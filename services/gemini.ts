
import { GoogleGenAI } from "@google/genai";
import { Tag, PersonalInfo, TagType } from "../types";
import { QUESTION_LIBRARY } from "../data/questions";

const getAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getTagRecommendations = async (type: TagType, currentTags: Tag[]): Promise<string[]> => {
  const ai = getAI();
  const defaults = ["雨天的书店", "凌晨的便利店", "老式唱片机", "无所事事的下午"];
  
  if (!ai) return defaults;

  const typeMap: Record<TagType, string> = {
    like: "我喜欢",
    hate: "我讨厌",
    have: "我拥有",
    want: "我想要"
  };

  const existing = currentTags.filter(t => t.type === type).map(t => t.text).join(", ");
  const prompt = `
    Context: A self-discovery app called "mylabel".
    User's current tags in category "${typeMap[type]}": [${existing}].
    Task: Suggest 6 unique, poetic, interesting, or specific short phrases (in Chinese) that this user might also identify with.
    Requirements:
    - Language: Chinese (Simplified).
    - Style: Aesthetic, specific scenes, emotional, or witty. Avoid generic single words like "Apple". Use phrases like "刚出炉的面包香" (Scent of fresh bread).
    - Output: JSON array of strings only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (e) {
    return defaults;
  }
};

export const extractTagsFromJournal = async (content: string): Promise<{text: string, type: TagType}[]> => {
  const ai = getAI();
  if (!ai) return [];

  const prompt = `
    Analyze this diary entry and extract 3-5 potential "tags" for the user's self-manual.
    Content: "${content}"
    
    Classify each tag into one of: 'like', 'hate', 'have', 'want'.
    Return JSON array: [{ "text": "Tag Name (Chinese)", "type": "like" }, ...]
    
    Rules:
    - Text should be concise (2-6 chars usually).
    - Capture the emotion or object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getDailyQuestion = async (): Promise<{id: string, text: string, type: TagType}> => {
  // Try to pick a random question from the local library first for speed and consistency
  if (QUESTION_LIBRARY.length > 0) {
    const randomIndex = Math.floor(Math.random() * QUESTION_LIBRARY.length);
    const q = QUESTION_LIBRARY[randomIndex];
    return { id: q.id, text: q.text, type: q.type };
  }

  // Fallback to AI if library is empty (should not happen with updated code)
  const ai = getAI();
  const fallback = { id: Date.now().toString(), text: "今天发生了什么让你感到开心的小事？", type: 'like' as TagType };
  
  if (!ai) return fallback;

  const prompt = `
    Generate ONE introspective question for a user to better understand themselves.
    The answer should serve as a tag for one of these pools: 'like', 'hate', 'have', 'want'.
    
    Output JSON: { "text": "Question in Chinese?", "type": "tag_type" }
    Examples:
    - "What is your biggest fear?" -> type: hate
    - "What skill do you wish you had?" -> type: want
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const data = JSON.parse(response.text || "{}");
    return { id: Date.now().toString(), text: data.text || fallback.text, type: data.type || 'like' };
  } catch {
    return fallback;
  }
};
