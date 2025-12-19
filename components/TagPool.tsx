
import React, { useState, useEffect } from 'react';
import { Tag, TagType } from '../types';
import { Plus, X, Sparkles, RefreshCw, ChevronLeft } from './Icons';
import { getTagRecommendations } from '../services/gemini';

interface TagPoolProps {
  type: TagType;
  tags: Tag[];
  onAdd: (text: string, type: TagType) => void;
  onRemove: (id: string) => void;
  onPin: (id: string) => void;
  onBack: () => void;
}

const typeConfig: Record<TagType, {
  title: string;
  subtitle: string;
  gradient: string;
  text: string;
  accent: string;
  border: string;
  tagBg: string;
  recBg: string;
}> = {
  like: {
    title: "我喜欢",
    subtitle: "COLLECT MOMENTS",
    gradient: "from-orange-100 via-rose-50 to-white",
    text: "text-[#D65A2E]",
    accent: "bg-[#F07143]",
    border: "border-[#F07143]/20",
    tagBg: "bg-white/60",
    recBg: "bg-[#F07143]/5"
  },
  hate: {
    title: "我讨厌",
    subtitle: "NO THANKS",
    gradient: "from-stone-200 via-gray-100 to-white",
    text: "text-[#4B5563]",
    accent: "bg-[#4B5563]",
    border: "border-[#4B5563]/20",
    tagBg: "bg-white/60",
    recBg: "bg-[#4B5563]/5"
  },
  have: {
    title: "我拥有",
    subtitle: "TREASURE BOX",
    gradient: "from-lime-100 via-emerald-50 to-white",
    text: "text-[#4D8523]",
    accent: "bg-[#84CE4C]",
    border: "border-[#84CE4C]/30",
    tagBg: "bg-white/60",
    recBg: "bg-[#84CE4C]/5"
  },
  want: {
    title: "我想要",
    subtitle: "DREAM BIG",
    gradient: "from-yellow-100 via-amber-50 to-white",
    text: "text-[#B38D00]",
    accent: "bg-[#FFCC00]",
    border: "border-[#FFCC00]/30",
    tagBg: "bg-white/60",
    recBg: "bg-[#FFCC00]/5"
  },
};

export const TagPool: React.FC<TagPoolProps> = ({ type, tags, onAdd, onRemove, onPin, onBack }) => {
  const config = typeConfig[type];
  const [inputValue, setInputValue] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const pinnedTags = tags.filter(t => t.isPinned);
  const otherTags = tags.filter(t => !t.isPinned);

  const handleAdd = (text: string) => {
    if (text.trim()) {
      onAdd(text.trim(), type);
      setInputValue("");
      setRecommendations(prev => prev.filter(r => r !== text));
    }
  };

  const fetchRecs = async () => {
    setLoadingRecs(true);
    const recs = await getTagRecommendations(type, tags);
    setRecommendations(recs);
    setLoadingRecs(false);
  };

  useEffect(() => {
    fetchRecs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br ${config.gradient} animate-in slide-in-from-right duration-500 relative overflow-hidden`}>
      
      {/* Ambient Background Elements */}
      <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full ${config.accent} opacity-[0.08] blur-[80px] pointer-events-none`}></div>
      <div className={`absolute top-1/3 -left-20 w-60 h-60 rounded-full ${config.accent} opacity-[0.05] blur-[60px] pointer-events-none`}></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-6">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center hover:bg-white/80 transition-all shadow-sm group active:scale-95"
        >
          <ChevronLeft size={24} className={`${config.text} opacity-70 group-hover:opacity-100`} />
        </button>
        <div className="flex flex-col items-center">
            <span className={`text-[10px] font-black tracking-[0.2em] uppercase opacity-40 ${config.text} mb-0.5`}>{config.subtitle}</span>
            <h1 className={`text-2xl font-black ${config.text} tracking-tight`}>{config.title}</h1>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar space-y-8 relative z-10">
        
        {/* Input Field */}
        <div className="relative group shadow-sm">
          <div className="absolute inset-0 bg-white/40 rounded-2xl blur-md transform group-hover:scale-[1.02] transition-transform duration-500"></div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd(inputValue)}
            placeholder="输入关键词..."
            className={`relative w-full py-4 pl-6 pr-14 rounded-2xl bg-white/60 backdrop-blur-xl border ${config.border} ${config.text} placeholder:text-stone-400 font-bold outline-none focus:bg-white focus:shadow-lg focus:border-opacity-50 transition-all`}
          />
          <button 
            onClick={() => handleAdd(inputValue)}
            disabled={!inputValue.trim()}
            className={`absolute right-2 top-2 bottom-2 aspect-square rounded-xl ${config.accent} text-white flex items-center justify-center shadow-md active:scale-95 transition-all hover:brightness-110 disabled:opacity-50 disabled:shadow-none`}
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Pinned Section */}
        {pinnedTags.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-center gap-2 opacity-60 px-1">
                <Sparkles size={14} className={config.text} />
                <span className={`text-xs font-bold ${config.text} tracking-wider`}>置顶收藏</span>
            </div>
            {/* Modified: Flex wrap for adaptive width, text-sm to match other tags */}
            <div className="flex flex-wrap gap-2.5">
              {pinnedTags.map(tag => (
                <div key={tag.id} className="group relative">
                    <div className={`pl-4 pr-3 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2`}>
                        <span className={`font-bold ${config.text} text-sm`}>{tag.text}</span>
                        <button 
                            onClick={() => onPin(tag.id)} 
                            className={`${config.text} opacity-60 hover:opacity-100 hover:scale-110 transition-transform active:scale-95`}
                            title="取消置顶"
                        >
                            <Sparkles size={14} className="fill-current" />
                        </button>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Tags Section */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
           <div className="flex items-center justify-between px-1 opacity-60">
              <span className={`text-xs font-bold ${config.text} tracking-wider`}>全部标签 ({tags.length})</span>
           </div>
          <div className="flex flex-wrap gap-2.5">
            {otherTags.map(tag => (
              <div 
                key={tag.id} 
                className="group relative"
              >
                 <button 
                   onClick={() => onPin(tag.id)}
                   className={`px-4 py-2.5 rounded-xl ${config.tagBg} backdrop-blur-sm border border-white/40 text-sm font-bold ${config.text} shadow-sm hover:bg-white hover:shadow-md hover:scale-105 active:scale-95 transition-all`}
                 >
                    {tag.text}
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(tag.id); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-stone-400 rounded-full shadow-sm border border-stone-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 hover:scale-110 hover:border-red-100 z-10"
                 >
                    <X size={10} strokeWidth={3} />
                 </button>
              </div>
            ))}
            {tags.length === 0 && (
                <div className="w-full text-center py-12 opacity-40 border-2 border-dashed border-white/40 rounded-3xl">
                    <p className={`text-sm font-medium ${config.text}`}>暂无标签，开始记录吧</p>
                </div>
            )}
          </div>
        </div>

        {/* Daily Recommendations */}
        <div className={`rounded-3xl p-6 ${config.recBg} backdrop-blur-sm border ${config.border} animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300`}>
          <div className="flex items-center justify-between mb-5">
            <div>
                <h3 className={`text-sm font-black ${config.text} flex items-center gap-2`}>
                    灵感碎片
                </h3>
                <p className={`text-[10px] opacity-60 ${config.text} font-medium mt-0.5`}>点击即可添加</p>
            </div>
            <button 
                onClick={fetchRecs} 
                disabled={loadingRecs} 
                className={`p-2 rounded-full bg-white/50 hover:bg-white ${config.text} transition-all shadow-sm active:scale-95`}
            >
              <RefreshCw size={14} className={loadingRecs ? "animate-spin" : ""} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {loadingRecs ? (
               [1,2,3,4,5,6].map(i => <div key={i} className="h-10 w-full bg-white/30 rounded-lg animate-pulse" />)
            ) : (
              recommendations.map((rec, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAdd(rec)}
                  className="w-full flex items-center justify-center text-center px-3 py-3 rounded-lg bg-white/60 hover:bg-white border border-white/20 text-xs font-bold text-stone-600 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  {rec}
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
