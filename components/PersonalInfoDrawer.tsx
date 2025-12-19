
import React, { useState, useEffect } from 'react';
import { PersonalInfo, Ingredient, IngredientItem } from '../types';
import { X, Save, Plus, Trash2, ChevronDown, Zap, CheckCircle, Edit3 } from './Icons';

interface Props {
  info: PersonalInfo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (info: PersonalInfo) => void;
}

// Local State Interface to manage nested form data before saving flat structure
interface LocalFormData {
    basic: {
        nickname: string;
        birthday: string;
        zodiac: string;
    };
    personality: {
        keywords: [string, string, string];
        mbti: string;
    };
    social: {
        battery: number;
    };
    ingredients: Ingredient[];
}

// --- Constants & Data ---

const INGREDIENT_CATEGORIES: Record<string, string[]> = {
  "饮料": ["🥤 白开水（平平淡淡才是真）", "🧋 奶茶（甜美/快乐/热量炸弹）", "☕️ 咖啡（高效/清醒/优雅）", "🍺 酒（浪漫/微醺/发疯）", "🥛 牛奶（温和/可爱/百搭）", "🍵 凉茶（养生/佛系/惜命）", "🥤 可乐（爽快/干脆/易爆炸）"],
  "动物": ["🦥 树懒(能躺着绝不坐着)", "🐶 修勾(忠诚/舔狗/热情)", "🐱 猫猫 (优雅/安逸)", "🦆 可达鸭 (眉头一皱发现事情并不简单)", "🐟 咸鱼 (梦想是翻身，但粘锅了)", "🐲 喷火龙(易怒)"],
  "基础属性": ["✨ 幸运值(虽然通常是E)", "🛡️ 防御力(脸皮厚度)", "⚔️ 攻击力(怼人能力)", "🧠 智力(或许偶尔下线)", "💨 闪避(无法选中/甩锅能力)"],
  "大脑内存占用": ["🧠 尴尬回忆（睡前循环播放的黑历史）", "💩 各种废料（一些无用的冷知识/八卦？）", "📅 待办事项（永远做不完的ddl）", "😴 空白发呆（待机ing）", "💭 白日梦（又在幻想中彩票/当老板）", "🎶 洗脑神曲（停不下来的BGM）"],
  "语言输出成分": ["😶 沉默（不知道回什么/不想回）", "🖼️ 梗图/表情包（一种主要的社交流通货币）", "🙃 阴阳怪气（就不好好说话）", "🇨🇳 优美的中国话（熟练掌握C语言）", "🗣️ 废话文学（听君一席话）"],
  "决策依据": ["🔮 玄学/塔罗（我命由天不由我）", "🎲 瞎蒙（全都选C）", "🐂 头铁（啥都不管，先冲！）", "🐌 拖延（拖到最后一刻问题就解决了）", "⚡️ 直觉（没什么逻辑但就是自信）", "🤔 慎重思考（必须深思熟虑）"],
  "我脑子里的三个小人": ["😈 邪恶反派（想毁灭世界）", "👼 圣母（一切都可以原谅）", "😭 爱哭鬼（因为一点破事就崩溃）", "🤡 小丑（希望不是我自己）", "🕵️ 大侦探（尤其在八卦的时候）", "🔬 科学家（对一切都有探索欲）"],
  "我正在以肉眼可见的速度流失": ["💇‍♀️ 发量（秃头少男少女）", "💰 存款（月光族）", "😤 耐心（现在的年轻人……）", "🧠 记忆力（就在嘴边但怎么想不起来）", "🥚 胶原蛋白（不服老不行）", "🤯 烦恼（人生赢家非我莫属）"],
  "翻开我的人生剧本，主要是": ["🕳️ 填不完的坑（flag立了从不回收）", "💧 注水文（平平淡淡的剧情）", "🔄 神转折（龙王归来逆天改命）", "📝 伏笔（未来处处都有精彩）", "📉 烂尾了（做事情好像总虎头蛇尾）"],
};

const MBTI_OPTIONS = [
  ['E', 'I'],
  ['N', 'S'],
  ['F', 'T'],
  ['P', 'J']
];

// --- Helper Functions ---

const getZodiac = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "水瓶座";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "双鱼座";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "白羊座";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "金牛座";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "双子座";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "巨蟹座";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "狮子座";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "处女座";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "天秤座";
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "天蝎座";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "射手座";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "摩羯座";
  return "";
};

// Helper to auto-balance percentages
// Prioritize filling/taking from the last item (buffer) first, then others.
const balancePercentages = (
  items: [IngredientItem, IngredientItem, IngredientItem],
  changedIndex: number,
  newValue: number
): [IngredientItem, IngredientItem, IngredientItem] => {
  const newItems = items.map(i => ({...i})) as [IngredientItem, IngredientItem, IngredientItem];
  
  // Clamp value between 0 and 100
  newValue = Math.max(0, Math.min(100, newValue));
  
  const oldValue = newItems[changedIndex].percentage;
  newItems[changedIndex].percentage = newValue;
  
  let neededChange = newValue - oldValue; // If positive, we need to reduce others.
  
  // Define priority order for adjustment. 
  // Standard logic: Always try to adjust item 2 (index 2) first, unless we are editing item 2.
  // Then item 1, then item 0.
  let adjustmentOrder: number[] = [];
  if (changedIndex === 0) adjustmentOrder = [2, 1];
  else if (changedIndex === 1) adjustmentOrder = [2, 0];
  else adjustmentOrder = [1, 0]; // If editing 2, adjust 1 then 0.

  for (const idx of adjustmentOrder) {
      if (neededChange === 0) break;
      const currentVal = newItems[idx].percentage;
      
      if (neededChange > 0) {
          // We need to reduce currentVal
          const reduction = Math.min(currentVal, neededChange);
          newItems[idx].percentage -= reduction;
          neededChange -= reduction;
      } else {
          // We need to increase currentVal (neededChange is negative)
          const increase = Math.min(100 - currentVal, -neededChange);
          newItems[idx].percentage += increase;
          neededChange += increase;
      }
  }

  // If we still have neededChange (e.g. hitting limits), revert the change on the source to match constraints
  if (neededChange !== 0) {
      newItems[changedIndex].percentage -= neededChange;
  }
  
  return newItems;
};

// --- Components ---

const PercentageWheel: React.FC<{ value: number, onChange: (val: number) => void }> = ({ value, onChange }) => {
  return (
    <div className="relative h-12 w-16 overflow-hidden bg-stone-100 rounded-xl group hover:bg-stone-200 transition-colors flex-shrink-0">
      <select 
         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
         value={value}
         onChange={e => onChange(parseInt(e.target.value))}
      >
        {Array.from({length: 101}).map((_, i) => (
           <option key={i} value={i}>{i}</option>
        ))}
      </select>
      <div className="flex items-center justify-center h-full text-xl font-black text-brand-black pointer-events-none group-hover:text-brand-orange transition-colors">
        {value}
        <span className="text-xs ml-0.5 font-bold text-stone-400 mt-1">%</span>
      </div>
    </div>
  );
};

const MBTILock: React.FC<{ value: string, onChange: (val: string) => void }> = ({ value, onChange }) => {
  const chars = (value && value.length === 4) ? value.split('') : ['E', 'N', 'F', 'P'];
  
  const toggleChar = (index: number) => {
    const newChars = [...chars];
    const options = MBTI_OPTIONS[index];
    const current = newChars[index];
    newChars[index] = current === options[0] ? options[1] : options[0];
    onChange(newChars.join(''));
  };

  return (
    <div className="flex gap-2">
      {chars.map((char, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            onClick={() => toggleChar(index)}
            className="w-12 h-16 bg-white border-2 border-stone-200 rounded-xl flex items-center justify-center text-2xl font-black text-brand-black cursor-pointer select-none shadow-[0_2px_0_0_rgba(0,0,0,0.05)] active:translate-y-0.5 active:shadow-none transition-all hover:border-brand-orange relative overflow-hidden group"
          >
            {char}
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/80 to-transparent pointer-events-none"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PersonalInfoDrawer: React.FC<Props> = ({ info, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<LocalFormData>({
    basic: { nickname: '', birthday: '', zodiac: '' },
    personality: { keywords: ['', '', ''], mbti: 'ENFP' },
    social: { battery: 50 },
    ingredients: []
  });

  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        basic: {
            nickname: info.nickname || '',
            birthday: info.birthday || '',
            zodiac: info.zodiac || '',
        },
        personality: {
            keywords: [...info.keywords] as [string, string, string],
            mbti: Array.isArray(info.mbti) ? info.mbti.join('') : 'ENFP',
        },
        social: {
            battery: info.socialBattery,
        },
        ingredients: JSON.parse(JSON.stringify(info.ingredients || [])),
      });
      setEditingIngredientId(null);
    }
  }, [isOpen, info]);

  if (!isOpen) return null;

  const handleSave = () => {
    const flatInfo: PersonalInfo = {
        nickname: formData.basic.nickname,
        birthday: formData.basic.birthday,
        zodiac: formData.basic.zodiac,
        keywords: formData.personality.keywords,
        mbti: formData.personality.mbti.split(''),
        socialBattery: formData.social.battery,
        ingredients: formData.ingredients
    };
    onSave(flatInfo);
    onClose();
  };

  const updateBasic = (field: keyof LocalFormData['basic'], value: string) => {
    const newData = { ...formData, basic: { ...formData.basic, [field]: value } };
    if (field === 'birthday') {
      newData.basic.zodiac = getZodiac(value);
    }
    setFormData(newData);
  };

  const updatePersonality = (field: keyof LocalFormData['personality'], value: any) => {
    setFormData({ ...formData, personality: { ...formData.personality, [field]: value } });
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...(formData.personality.keywords || ["", "", ""])];
    newKeywords[index] = value;
    // ensure length 3
    while (newKeywords.length < 3) newKeywords.push("");
    updatePersonality('keywords', newKeywords);
  };

  // Ingredient Handlers
  const addIngredient = () => {
    const usedCategories = (formData.ingredients || []).map(i => i.category);
    const allCategories = Object.keys(INGREDIENT_CATEGORIES);
    // Find the first available category that is NOT in usedCategories
    const availableCategory = allCategories.find(c => !usedCategories.includes(c));
    
    // Safety check, though button should be disabled if no categories available
    if (!availableCategory) return;

    const newId = Date.now().toString();
    const defaultItems = INGREDIENT_CATEGORIES[availableCategory].slice(0, 3).map((label, idx) => ({
        percentage: idx === 0 ? 50 : idx === 1 ? 30 : 20,
        label: label || ""
    })) as [IngredientItem, IngredientItem, IngredientItem];

    setFormData(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), {
          id: newId,
          category: availableCategory,
          items: defaultItems
      }]
    }));
    setEditingIngredientId(newId);
  };

  const removeIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter(i => i.id !== id)
    }));
    if (editingIngredientId === id) setEditingIngredientId(null);
  };

  const updateIngredientCategory = (id: string, category: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: (prev.ingredients || []).map(i => {
        if (i.id === id) {
          // Reset items when category changes
          const defaultItems = INGREDIENT_CATEGORIES[category].slice(0, 3).map((label, idx) => ({
            percentage: idx === 0 ? 50 : idx === 1 ? 30 : 20,
            label: label || ""
          }));
          return { ...i, category, items: defaultItems as [IngredientItem, IngredientItem, IngredientItem] };
        }
        return i;
      })
    }));
  };

  const updateIngredientItem = (id: string, itemIndex: number, field: keyof IngredientItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      ingredients: (prev.ingredients || []).map(i => {
        if (i.id === id) {
          let newItems = [...i.items] as [IngredientItem, IngredientItem, IngredientItem];
          
          if (field === 'percentage') {
             // Auto balance logic
             newItems = balancePercentages(newItems, itemIndex, value);
          } else {
             newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
          }
          
          return { ...i, items: newItems };
        }
        return i;
      })
    }));
  };

  // Social Battery Status Text
  const getSocialStatus = (val: number) => {
      if (val <= 25) return "社恐";
      if (val <= 50) return "慢热";
      if (val <= 75) return "正常待机";
      return "社牛";
  };
  
  // Logic for add button availability
  const usedCategoryCount = (formData.ingredients || []).length;
  const totalCategoryCount = Object.keys(INGREDIENT_CATEGORIES).length;
  const isLimitReached = usedCategoryCount >= totalCategoryCount;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm border-b border-stone-50">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors">
            <X size={24} />
          </button>
          <span className="font-bold text-lg text-brand-black tracking-tight">人生说明书</span>
          <button onClick={handleSave} className="p-2 rounded-full bg-brand-black text-white hover:opacity-80 transition-opacity shadow-lg shadow-brand-black/20">
            <Save size={20} />
          </button>
        </div>

        {/* Content - Scrollable Instruction Manual */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-stone-50 pb-32">
          
          {/* 1. Intro Sentence Card */}
          <section className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-stone-100">
             <div className="space-y-6">
                 {/* Name Row */}
                 <div className="flex flex-wrap items-end gap-3 text-lg font-bold text-stone-600">
                     <span>你好，你可以叫我</span>
                     <div className="flex-1 min-w-[120px] relative top-1">
                         <input 
                             type="text" 
                             value={formData.basic.nickname}
                             onChange={(e) => updateBasic('nickname', e.target.value)}
                             placeholder="未命名用户"
                             className="w-full bg-transparent border-b-2 border-stone-200 py-1 text-center font-black text-brand-black text-2xl focus:border-brand-black outline-none transition-colors placeholder:text-stone-200 placeholder:font-bold"
                         />
                     </div>
                     <span className="pb-1">；</span>
                 </div>
                 
                 {/* Birthday Row */}
                 <div className="flex flex-wrap items-end gap-3 text-lg font-bold text-stone-600">
                     <span>我的生日是</span>
                     <div className="relative top-1">
                          <input 
                             type="date" 
                             value={formData.basic.birthday}
                             onChange={(e) => updateBasic('birthday', e.target.value)}
                             className="bg-transparent border-b-2 border-stone-200 py-1 text-center font-black text-brand-black text-xl focus:border-brand-black outline-none transition-colors w-40 font-mono"
                         />
                     </div>
                     <span className="pb-1">，</span>
                     <span className={`pb-1 font-black ${formData.basic.zodiac ? 'text-brand-orange' : 'text-stone-200'}`}>
                       {formData.basic.zodiac || "___"}
                     </span>
                     <span className="pb-1">。</span>
                 </div>
             </div>
          </section>

          {/* 2. Keywords */}
          <section>
             <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">关键词</h3>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                 <p className="text-stone-500 font-bold mb-4 text-sm">三个关键词形容我，我希望是：</p>
                 <div className="flex flex-col sm:flex-row gap-3">
                    {[0, 1, 2].map(idx => (
                        <div key={idx} className="flex-1">
                            <input 
                                type="text"
                                value={formData.personality.keywords?.[idx] || ""}
                                onChange={(e) => updateKeyword(idx, e.target.value)}
                                className="w-full bg-stone-50 hover:bg-stone-100 focus:bg-white border-2 border-transparent focus:border-brand-orange rounded-xl px-4 py-3 text-center font-bold text-brand-black outline-none transition-all placeholder:text-stone-300 text-sm"
                                placeholder={`关键词 ${idx + 1}`}
                            />
                        </div>
                    ))}
                 </div>
             </div>
          </section>

          {/* 3. MBTI */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">人格密码</h3>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-600 text-sm">我的 MBTI 是</span>
                    <MBTILock 
                        value={formData.personality.mbti} 
                        onChange={(val) => updatePersonality('mbti', val)}
                    />
                </div>
             </div>
          </section>

          {/* 4. Social Battery */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-2 h-2 rounded-full bg-brand-green"></div>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">社交电量</h3>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                <div className="flex justify-between items-end mb-6">
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-brand-black tracking-tight">{formData.social.battery}%</span>
                     <span className="text-sm font-bold text-stone-400">
                        {getSocialStatus(formData.social.battery)}
                     </span>
                  </div>
                  <Zap className={formData.social.battery < 20 ? "text-stone-300" : "text-brand-yellow fill-brand-yellow"} size={24} />
                </div>
                
                <div className="relative h-12 flex items-center">
                    <input 
                    type="range" 
                    min="0" max="100" 
                    value={formData.social.battery}
                    onChange={(e) => setFormData({...formData, social: {...formData.social, battery: parseInt(e.target.value)}})}
                    className="relative z-10 w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-green [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                    />
                    {/* Custom Track Background */}
                    <div className="absolute inset-0 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-green transition-all duration-100" style={{width: `${formData.social.battery}%`}}></div>
                    </div>
                    {/* Ticks */}
                    <div className="absolute top-4 left-0 w-full flex justify-between px-1">
                        <span className="w-px h-1.5 bg-stone-200"></span>
                        <span className="w-px h-1.5 bg-stone-200"></span>
                        <span className="w-px h-1.5 bg-stone-200"></span>
                        <span className="w-px h-1.5 bg-stone-200"></span>
                    </div>
                    {/* Labels */}
                    <div className="absolute top-7 w-full flex justify-between text-[10px] font-bold text-stone-400 px-0">
                        <span>社恐</span>
                        <span className="pl-2">慢热</span>
                        <span className="pl-4">正常待机</span>
                        <span>社牛</span>
                    </div>
                </div>
             </div>
          </section>

          {/* 5. Ingredients (Composition) */}
          <section>
             <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">成分构成</h3>
             </div>
             
             <div className="space-y-4">
                {(formData.ingredients || []).map((ingredient) => {
                   const isEditing = editingIngredientId === ingredient.id;

                   if (isEditing) {
                     return (
                        <div key={ingredient.id} className="relative group animate-in zoom-in-95 duration-300">
                           {/* Edit Mode Card */}
                           <div className="bg-white p-5 rounded-[2rem] border-2 border-blue-400 shadow-xl relative z-10">
                             
                             {/* Delete Button */}
                             <button 
                                onClick={() => removeIngredient(ingredient.id)}
                                className="absolute -top-3 -right-2 p-1.5 bg-white text-stone-300 hover:text-red-500 rounded-full shadow-sm border border-stone-100 z-20 transition-colors"
                             >
                                <Trash2 size={14} />
                             </button>

                             {/* Category Selector */}
                             <div className="mb-5 flex items-center flex-wrap gap-2 text-sm">
                                 <span className="font-bold text-stone-400">如果用</span>
                                 <div className="relative">
                                     <select 
                                     value={ingredient.category}
                                     onChange={(e) => updateIngredientCategory(ingredient.id, e.target.value)}
                                     className="appearance-none bg-blue-50 border border-blue-100 text-blue-600 font-bold py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-blue-400 cursor-pointer"
                                     >
                                     {Object.keys(INGREDIENT_CATEGORIES).map(k => {
                                         // Filter out categories used by OTHER ingredients
                                         const isUsedByOthers = (formData.ingredients || []).some(
                                             existing => existing.category === k && existing.id !== ingredient.id
                                         );
                                         if (isUsedByOthers) return null;
                                         return <option key={k} value={k}>{k}</option>
                                     })}
                                     </select>
                                     <ChevronDown size={14} className="absolute right-2 top-2 text-blue-400 pointer-events-none" />
                                 </div>
                                 <span className="font-bold text-stone-400">形容我：</span>
                             </div>

                             {/* Items List */}
                             <div className="space-y-3 mb-4">
                                 {ingredient.items.map((item, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                     <PercentageWheel 
                                         value={item.percentage}
                                         onChange={(val) => updateIngredientItem(ingredient.id, i, 'percentage', val)}
                                     />
                                     <span className="text-stone-300 font-bold text-lg">+</span>
                                     <div className="relative flex-1">
                                         <select
                                         value={item.label}
                                         onChange={(e) => updateIngredientItem(ingredient.id, i, 'label', e.target.value)}
                                         className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-700 font-bold py-3 pl-3 pr-8 rounded-xl text-xs sm:text-sm outline-none focus:border-brand-orange truncate shadow-sm transition-all hover:border-stone-300"
                                         >
                                         {INGREDIENT_CATEGORIES[ingredient.category].map(opt => (
                                             <option key={opt} value={opt}>{opt}</option>
                                         ))}
                                         </select>
                                         <ChevronDown size={14} className="absolute right-3 top-3.5 text-stone-400 pointer-events-none" />
                                     </div>
                                 </div>
                                 ))}
                             </div>

                             {/* Done Button */}
                             <button 
                                onClick={() => setEditingIngredientId(null)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                             >
                                <CheckCircle size={18} />
                                完成编辑
                             </button>
                           </div>
                        </div>
                     );
                   }

                   // Display Mode Card
                   return (
                      <div key={ingredient.id} className="relative group cursor-pointer" onClick={() => setEditingIngredientId(ingredient.id)}>
                        <div className="absolute -top-2 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => { e.stopPropagation(); removeIngredient(ingredient.id); }}
                                className="p-1.5 bg-white text-red-500 rounded-full shadow-sm border border-red-100 hover:bg-red-50"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="bg-white p-5 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group-hover:-translate-y-1">
                            <div className="mb-4 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-stone-400">如果用</span>
                                    <span className="font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">{ingredient.category}</span>
                                    <span className="font-bold text-stone-400">形容我：</span>
                                </div>
                                <div className="text-stone-300 group-hover:text-blue-500 transition-colors">
                                    <Edit3 size={16} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {ingredient.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-10 text-right font-black text-brand-black text-sm">{item.percentage}%</span>
                                        <div className="w-24 h-2 flex-shrink-0 bg-stone-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${i === 0 ? 'bg-brand-orange' : i === 1 ? 'bg-brand-yellow' : 'bg-brand-green'}`} 
                                                style={{width: `${item.percentage}%`}}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-stone-600 flex-1 truncate">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                   );
                })}

                <button 
                  onClick={addIngredient}
                  disabled={isLimitReached}
                  className={`w-full py-4 border-2 border-dashed rounded-[2rem] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm ${isLimitReached ? 'border-stone-100 text-stone-300 cursor-not-allowed' : 'border-stone-200 text-stone-400 hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50'}`}
                >
                  {isLimitReached ? (
                      <>
                        <CheckCircle size={18} />
                        已达上限
                      </>
                  ) : (
                      <>
                        <Plus size={18} />
                        添加成分
                      </>
                  )}
                </button>
             </div>
          </section>

          <div className="h-12"></div> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};
