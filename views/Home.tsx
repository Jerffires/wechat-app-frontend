
import React, { useState } from 'react';
import { Tag, PersonalInfo, TagType } from '../types';
import { 
  Edit3, User, Sparkles, Heart, ShoppingBag, Target, 
  Brain, FlaskConical, Zap, Feather, Cloud, Users, FileText, 
  Shield, Briefcase, Coffee, PenTool, Palette, Rocket, Music,
  CloudRain
} from '../components/Icons';
import { PersonalInfoDrawer } from '../components/PersonalInfoDrawer';

interface HomeProps {
  tags: Tag[];
  info: PersonalInfo;
  onUpdateInfo: (info: PersonalInfo) => void;
  onOpenPool: (type: TagType) => void;
  onOpenProfile: () => void;
}

// Configuration for 16 MBTI Types (Themes remain same)
const MBTI_THEMES: Record<string, { from: string, to: string, text: string, bgAccent: string, icon: React.ElementType }> = {
  // Analysts
  'INTJ': { from: 'from-violet-200', to: 'to-fuchsia-100', text: 'text-violet-700', bgAccent: 'bg-violet-500', icon: Brain },
  'INTP': { from: 'from-indigo-200', to: 'to-blue-100', text: 'text-indigo-700', bgAccent: 'bg-indigo-500', icon: FlaskConical },
  'ENTJ': { from: 'from-fuchsia-200', to: 'to-pink-100', text: 'text-fuchsia-700', bgAccent: 'bg-fuchsia-500', icon: Target },
  'ENTP': { from: 'from-purple-200', to: 'to-violet-100', text: 'text-purple-700', bgAccent: 'bg-purple-500', icon: Zap },
  // Diplomats
  'INFJ': { from: 'from-emerald-200', to: 'to-teal-100', text: 'text-emerald-700', bgAccent: 'bg-emerald-500', icon: Feather },
  'INFP': { from: 'from-teal-200', to: 'to-green-100', text: 'text-teal-700', bgAccent: 'bg-teal-500', icon: Cloud },
  'ENFJ': { from: 'from-green-200', to: 'to-lime-100', text: 'text-green-700', bgAccent: 'bg-green-500', icon: Users },
  'ENFP': { from: 'from-lime-200', to: 'to-yellow-100', text: 'text-lime-700', bgAccent: 'bg-lime-500', icon: Sparkles },
  // Sentinels
  'ISTJ': { from: 'from-slate-200', to: 'to-gray-100', text: 'text-slate-700', bgAccent: 'bg-slate-500', icon: FileText },
  'ISFJ': { from: 'from-sky-200', to: 'to-blue-100', text: 'text-sky-700', bgAccent: 'bg-sky-500', icon: Shield },
  'ESTJ': { from: 'from-blue-200', to: 'to-indigo-100', text: 'text-blue-700', bgAccent: 'bg-blue-500', icon: Briefcase },
  'ESFJ': { from: 'from-cyan-200', to: 'to-sky-100', text: 'text-cyan-700', bgAccent: 'bg-cyan-500', icon: Coffee },
  // Explorers
  'ISTP': { from: 'from-yellow-200', to: 'to-orange-100', text: 'text-yellow-700', bgAccent: 'bg-yellow-500', icon: PenTool },
  'ISFP': { from: 'from-rose-200', to: 'to-pink-100', text: 'text-rose-700', bgAccent: 'bg-rose-500', icon: Palette },
  'ESTP': { from: 'from-orange-200', to: 'to-amber-100', text: 'text-orange-700', bgAccent: 'bg-orange-500', icon: Rocket },
  'ESFP': { from: 'from-amber-200', to: 'to-yellow-100', text: 'text-amber-700', bgAccent: 'bg-amber-500', icon: Music },
};

const DEFAULT_THEME = { from: 'from-brand-cream', to: 'to-white', text: 'text-brand-black', bgAccent: 'bg-brand-black', icon: User };

export const Home: React.FC<HomeProps> = ({ tags, info, onUpdateInfo, onOpenPool, onOpenProfile }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getTagsByType = (type: TagType) => tags.filter(t => t.type === type);

  // Determine Theme based on MBTI array
  const mbtiStr = info.mbti.join('').toUpperCase();
  const theme = MBTI_THEMES[mbtiStr] || DEFAULT_THEME;
  const ThemeIcon = theme.icon;
  
  const categories: {
    type: TagType, 
    title: string, 
    enTitle: string, 
    gradient: string, 
    text: string, 
    icon: React.ReactNode, 
    borderColor: string 
  }[] = [
    { 
      type: 'like', 
      title: '我喜欢', 
      enTitle: 'I Like',
      gradient: 'from-orange-100 to-rose-50', 
      text: 'text-[#F07143]', 
      borderColor: 'border-[#F07143]/20',
      icon: <Heart className="fill-current" size={20} />
    },
    { 
      type: 'hate', 
      title: '我讨厌', 
      enTitle: 'I Hate',
      gradient: 'from-stone-200 to-gray-200',
      text: 'text-[#4B5563]', 
      borderColor: 'border-[#1F2937]/10',
      icon: <CloudRain className="stroke-2" size={20} />
    },
    { 
      type: 'have', 
      title: '我拥有', 
      enTitle: 'I Have',
      gradient: 'from-lime-100 to-emerald-50', 
      text: 'text-[#5FA02D]', 
      borderColor: 'border-[#84CE4C]/30',
      icon: <ShoppingBag className="stroke-2" size={20} />
    },
    { 
      type: 'want', 
      title: '我想要', 
      enTitle: 'I Want',
      gradient: 'from-yellow-100 to-amber-50', 
      text: 'text-[#D9AC00]', 
      borderColor: 'border-[#FFCC00]/30',
      icon: <Target className="stroke-2" size={20} />
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-32">
      {/* Top Banner / Branding */}
      <div className="px-8 pt-12 pb-6 flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-extrabold text-brand-black tracking-tighter">mylabel<span className="text-brand-orange">.</span></h1>
           <p className="text-stone-400 text-xs font-medium tracking-widest mt-1 uppercase">人生说明书</p>
        </div>
        <button 
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-600 hover:text-brand-orange hover:border-brand-orange transition-colors"
        >
          <User size={20} />
        </button>
      </div>

      {/* Personal Info Card */}
      <div className="px-6 mb-8">
        <div 
          onClick={() => setIsDrawerOpen(true)}
          className={`group relative w-full aspect-[16/9] rounded-[2rem] shadow-xl border border-white/40 overflow-hidden cursor-pointer bg-gradient-to-br ${theme.from} ${theme.to} transition-all duration-500 hover:shadow-2xl`}
        >
          {/* MBTI Watermark */}
          <div className={`absolute -right-4 -bottom-8 text-9xl font-black opacity-10 select-none pointer-events-none transform -rotate-12 ${theme.text}`}>
            {mbtiStr || "TYPE"}
          </div>

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Top Row: Avatar & Nickname & Zodiac */}
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/60 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/50">
                   <ThemeIcon size={32} className={`${theme.text}`} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-2xl font-black ${theme.text} leading-none tracking-tight`}>
                    {info.nickname || "未命名用户"}
                  </span>
                  {/* Changed: Zodiac instead of Occupation */}
                  <span className={`text-xs font-bold uppercase tracking-wider mt-1.5 opacity-70 ${theme.text}`}>
                    {info.zodiac || "未知星座"}
                  </span>
                </div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-black/20 group-hover:bg-white group-hover:text-brand-orange transition-all">
                 <Edit3 size={14} />
              </div>
            </div>

            {/* Middle/Bottom: Keywords & Stats */}
            <div className="z-10 space-y-4">
               {/* 3 Keywords */}
               <div className="flex flex-wrap gap-2">
                  {info.keywords.some(k => k) ? (
                    info.keywords.map((k, i) => k && (
                        <span key={i} className={`px-3 py-1 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 text-xs font-bold ${theme.text}`}>
                            #{k}
                        </span>
                    ))
                  ) : (
                    <span className={`px-3 py-1 rounded-lg bg-white/20 text-[10px] font-medium ${theme.text} opacity-60`}>
                       + 定义你自己
                    </span>
                  )}
               </div>

               {/* Social Battery */}
               <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md p-3 rounded-xl border border-white/20">
                  <div className={`p-1.5 rounded-full bg-white/50 ${theme.text}`}>
                    <Zap size={12} className="fill-current"/>
                  </div>
                  <div className="flex-1 h-1.5 bg-white/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${theme.bgAccent} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} 
                      style={{ width: `${info.socialBattery}%`}} 
                    />
                  </div>
                  <span className={`text-xs font-black ${theme.text}`}>{info.socialBattery}%</span>
               </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Tag Pools (2x2 Grid) */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        {categories.map(cat => {
          const catTags = getTagsByType(cat.type);
          const pinned = catTags.filter(t => t.isPinned).slice(0, 3);
          
          return (
            <div 
              key={cat.type}
              onClick={() => onOpenPool(cat.type)}
              className={`aspect-[4/5] rounded-3xl p-5 flex flex-col justify-between border transition-all duration-300 active:scale-95 cursor-pointer relative overflow-hidden group bg-gradient-to-br ${cat.gradient} shadow-lg hover:shadow-xl ${cat.borderColor}`}
            >
              <div className="relative z-10 flex justify-between items-start">
                 <div className={`p-2 rounded-full bg-white/60 backdrop-blur-sm shadow-sm ${cat.text}`}>
                    {cat.icon}
                 </div>
                 <span className="text-xs font-bold opacity-40 bg-black/5 px-2 py-1 rounded-full">{catTags.length}</span>
              </div>

              <div className="relative z-10">
                 <h3 className={`text-xl font-bold mb-1 ${cat.text}`}>{cat.title}</h3>
                 <p className={`text-[10px] uppercase tracking-wider font-semibold opacity-60 mb-3 ${cat.text}`}>{cat.enTitle}</p>
                 
                 <div className="flex flex-wrap gap-1.5 h-16 overflow-hidden content-start">
                    {pinned.length > 0 ? (
                      pinned.map(t => (
                        <span key={t.id} className="text-[10px] px-2 py-1 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm truncate max-w-full text-brand-black/80 font-medium">
                          {t.text}
                        </span>
                      ))
                    ) : (
                      <span className={`text-[10px] opacity-40 italic ${cat.text}`}>点击添加...</span>
                    )}
                 </div>
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      <PersonalInfoDrawer 
        info={info} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        onSave={onUpdateInfo}
      />
    </div>
  );
};
