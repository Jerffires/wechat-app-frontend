
import React, { useState, useEffect } from 'react';
import { Tag, PersonalInfo, TagType, QuestionRecord } from '../types';
import { MessageCircle, Plus, ChevronRight, ChevronLeft, RefreshCw, Star, CreditCard, Users, Trophy, Download, RotateCcw, X, Clock, Save, Edit3, Trash2, Share2, User as UserIcon, CheckCircle } from '../components/Icons';
import { getDailyQuestion } from '../services/gemini';

interface LabProps {
  tags: Tag[];
  info: PersonalInfo;
  onAddTag: (text: string, type: TagType) => void;
  onOpenProfile: () => void;
  savedQuestions?: QuestionRecord[];
  onSaveQuestion?: (question: {id: string, text: string, type: TagType}, answer: string) => void;
  onUpdateQuestion?: (id: string, answer: string) => void;
  onDeleteQuestion?: (id: string) => void;
}

const tagColors: Record<TagType, string> = {
  like: "text-brand-orange fill-brand-orange",
  hate: "text-stone-600 fill-stone-600",
  have: "text-brand-green fill-brand-green",
  want: "text-brand-yellow fill-brand-yellow",
};

const tagBgColors: Record<TagType, string> = {
  like: "bg-orange-100 text-orange-800",
  hate: "bg-stone-200 text-stone-700",
  have: "bg-lime-100 text-lime-800",
  want: "bg-yellow-100 text-yellow-800",
};

// --- Sub-Component: Star Jar ---
const StarJar: React.FC<{ tags: Tag[] }> = ({ tags }) => {
    const [shaking, setShaking] = useState(false);
    const [selectedStar, setSelectedStar] = useState<Tag | null>(null);
    const [stars, setStars] = useState<{tag: Tag, x: number, y: number, r: number}[]>([]);

    useEffect(() => {
        const displayTags = tags.length > 0 ? tags : [
            {id:'d1', text:'点击添加', type:'like', isPinned:false, createdAt:0},
            {id:'d2', text:'你的', type:'want', isPinned:false, createdAt:0},
            {id:'d3', text:'第一颗', type:'have', isPinned:false, createdAt:0},
            {id:'d4', text:'星星', type:'hate', isPinned:false, createdAt:0}
        ] as Tag[];
        
        setStars(displayTags.map(t => ({
            tag: t,
            x: Math.random() * 70 + 15,
            y: Math.random() * 70 + 15,
            r: Math.random() * 360
        })));
    }, [tags]);

    const handleShake = () => {
        setShaking(true);
        setTimeout(() => {
            setShaking(false);
            setStars(prev => prev.map(s => ({
                ...s,
                x: Math.random() * 70 + 15,
                y: Math.random() * 70 + 15,
                r: Math.random() * 360
            })));
            if (tags.length > 0) {
                 const random = tags[Math.floor(Math.random() * tags.length)];
                 setSelectedStar(random);
            }
        }, 500);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full relative">
            <div className={`relative w-64 h-80 transition-transform duration-100 ${shaking ? 'animate-shake' : ''}`}>
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-8 bg-white/30 backdrop-blur-md border border-white/60 rounded-full z-10 shadow-sm"></div>
                 <div className="w-full h-full bg-gradient-to-br from-white/40 via-white/10 to-white/5 backdrop-blur-sm border-2 border-white/50 rounded-[3rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden relative z-0">
                    <div className="absolute top-4 left-4 w-3 h-[80%] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[1px]"></div>
                    <div className="absolute top-4 right-8 w-1 h-[40%] bg-white/20 rounded-full blur-[1px]"></div>
                    <div className="absolute bottom-4 right-10 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
                    {stars.map((s, i) => (
                        <div 
                            key={s.tag.id + i}
                            className="absolute cursor-pointer transition-all hover:scale-110 active:scale-95 drop-shadow-md opacity-90 hover:opacity-100"
                            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `rotate(${s.r}deg)` }}
                            onClick={() => setSelectedStar(s.tag)}
                        >
                            <Star size={24} className={tagColors[s.tag.type]} fill="currentColor" />
                        </div>
                    ))}
                 </div>
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/10 blur-md rounded-full"></div>
            </div>

            <button 
                onClick={handleShake}
                className="mt-10 px-8 py-3 bg-brand-black text-white rounded-2xl font-bold shadow-lg shadow-black/10 active:scale-95 transition-all flex items-center gap-2"
            >
                <RotateCcw size={18} /> 晃动星星罐
            </button>
            <p className="mt-4 text-stone-400 text-xs">摇一摇，看看会掉出什么回忆</p>

            {selectedStar && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-stone-900/20 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full relative animate-in zoom-in duration-300 border border-white/50">
                        <button onClick={() => setSelectedStar(null)} className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-400 hover:bg-stone-200">
                            <X size={18} />
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 relative">
                                <div className={`absolute inset-0 ${tagBgColors[selectedStar.type].split(' ')[0]} rounded-full blur-xl opacity-50`}></div>
                                <Star size={64} className={`${tagColors[selectedStar.type]} relative z-10 drop-shadow-sm`} />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full ${tagBgColors[selectedStar.type]}`}>
                                {selectedStar.type === 'like' ? '我喜欢' : selectedStar.type === 'hate' ? '我讨厌' : selectedStar.type === 'have' ? '我拥有' : '我想要'}
                            </span>
                            <h3 className="text-3xl font-black text-brand-black mb-2">{selectedStar.text}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Component: Card Generator ---
const CardGenerator: React.FC<{ info: PersonalInfo, tags: Tag[] }> = ({ info, tags }) => {
    const [mode, setMode] = useState<'profile' | 'tags'>('profile');
    const [showFields, setShowFields] = useState({
        mbti: true,
        keyword: true,
        social: true,
        zodiac: true
    });
    const [visibleTypes, setVisibleTypes] = useState<Record<TagType, boolean>>({
        like: true, hate: true, have: true, want: true
    });

    const handleSave = () => {
        alert("名片已生成并保存到相册（模拟）");
    };

    const typeConfig: Record<TagType, { label: string, color: string, bg: string, border: string }> = {
        like: { label: 'I LIKE', color: 'text-brand-orange', bg: 'bg-orange-50', border: 'border-brand-orange' },
        hate: { label: 'I HATE', color: 'text-stone-600', bg: 'bg-stone-100', border: 'border-stone-400' },
        have: { label: 'I HAVE', color: 'text-brand-green', bg: 'bg-lime-50', border: 'border-brand-green' },
        want: { label: 'I WANT', color: 'text-brand-yellow', bg: 'bg-yellow-50', border: 'border-brand-yellow' },
    };

    const pillStyles: Record<TagType, string> = {
        like: "bg-[#FFEEE8] text-[#D65A2E] border border-[#F07143]/20",
        hate: "bg-[#F5F5F5] text-[#4B5563] border border-[#9CA3AF]/20",
        have: "bg-[#ECF9E3] text-[#4D8523] border border-[#84CE4C]/30",
        want: "bg-[#FFF9DB] text-[#B38D00] border border-[#FFCC00]/30",
    };

    // Modified to filter by pinned status
    const filteredTags = tags.filter(t => visibleTypes[t.type] && t.isPinned);
    const mbtiStr = info.mbti.join('');

    return (
        <div className="flex flex-col h-full">
            <div className="flex p-1 bg-stone-100 rounded-xl mb-4 mx-6 flex-shrink-0">
                <button 
                    onClick={() => setMode('profile')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'profile' ? 'bg-white shadow text-brand-black' : 'text-stone-400'}`}
                >
                    社交名片
                </button>
                <button 
                    onClick={() => setMode('tags')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'tags' ? 'bg-white shadow text-brand-black' : 'text-stone-400'}`}
                >
                    标签名片
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
                <div id="card-preview" className={`rounded-[2rem] shadow-2xl overflow-hidden relative min-h-[480px] transition-colors duration-300 ${mode === 'profile' ? 'bg-white border border-stone-100' : 'bg-[#FDFBF7] border border-stone-100'}`}>
                    {mode === 'profile' ? (
                        <div className="p-8 h-full flex flex-col justify-between relative">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/5 rounded-full blur-3xl"></div>
                            <div className="absolute top-20 -left-10 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 shadow-inner">
                                        <Users size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-brand-black">{info.nickname || "Name"}</h2>
                                        <p className="text-stone-400 text-sm font-medium mt-1">Life Explorer</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {showFields.mbti && (
                                        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                                            <span className="text-xs font-bold text-stone-400 uppercase">MBTI</span>
                                            <span className="font-bold text-brand-orange">{mbtiStr || "-"}</span>
                                        </div>
                                    )}
                                    {showFields.keyword && (
                                        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                                            <span className="text-xs font-bold text-stone-400 uppercase">关键词</span>
                                            <div className="flex gap-2">
                                                {info.keywords.map((k,i) => k && <span key={i} className="text-xs font-bold text-stone-600 bg-white px-2 py-1 rounded">{k}</span>)}
                                            </div>
                                        </div>
                                    )}
                                    {showFields.social && (
                                        <div className="flex flex-col gap-2 p-4 bg-stone-50 rounded-2xl">
                                             <div className="flex justify-between">
                                                <span className="text-xs font-bold text-stone-400 uppercase">社交电量</span>
                                                <span className="text-xs font-bold text-stone-600">{info.socialBattery}%</span>
                                             </div>
                                             <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                                                 <div style={{width: `${info.socialBattery}%`}} className="h-full bg-brand-green"></div>
                                             </div>
                                        </div>
                                    )}
                                    {showFields.zodiac && info.zodiac && (
                                        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                                            <span className="text-xs font-bold text-stone-400 uppercase">星座</span>
                                            <span className="font-bold text-brand-black">{info.zodiac}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-end relative z-10">
                                <div className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">Generated by mylabel</div>
                                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white">
                                    <span className="font-black text-xs">QR</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 h-full flex flex-col relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

                             <div className="flex justify-between items-end mb-6 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-brand-black">{info.nickname}</h2>
                                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Life Labels</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center">
                                    <Star size={16} className="text-brand-orange" fill="currentColor" />
                                </div>
                             </div>

                             <div className="flex-1 relative z-10 flex flex-wrap content-start gap-2.5 overflow-hidden pb-8">
                                {filteredTags.length > 0 ? (
                                    filteredTags.map(t => (
                                        <div 
                                            key={t.id} 
                                            className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm transition-transform hover:scale-105 ${pillStyles[t.type]}`}
                                        >
                                           <span className="truncate max-w-[12rem] block">{t.text}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-stone-300 text-center py-20 text-xs italic">
                                        无置顶标签
                                    </div>
                                )}
                             </div>
                             
                             <div className="absolute -bottom-4 -right-4 text-[80px] font-black text-stone-900/5 select-none leading-none z-0 tracking-tighter">
                                MYLABEL
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {mode === 'profile' ? (
                <div className="px-6 pb-6 flex gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
                    {Object.keys(showFields).map(k => (
                        <button 
                            key={k}
                            onClick={() => setShowFields(prev => ({...prev, [k]: !prev[k as keyof typeof showFields]}))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-colors ${showFields[k as keyof typeof showFields] ? 'bg-brand-black text-white border-brand-black' : 'bg-white text-stone-400 border-stone-200'}`}
                        >
                            {k === 'mbti' ? 'MBTI' : k === 'keyword' ? '关键词' : k === 'social' ? '社交电量' : '星座'}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="px-6 pb-6 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
                    {(['like', 'hate', 'have', 'want'] as TagType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => setVisibleTypes(prev => ({...prev, [type]: !prev[type]}))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap flex items-center gap-1.5 transition-colors ${visibleTypes[type] ? typeConfig[type].bg + ' ' + typeConfig[type].color + ' border-transparent' : 'bg-white text-stone-300 border-stone-200'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${visibleTypes[type] ? 'bg-current' : 'bg-stone-300'}`}></div>
                            {typeConfig[type].label}
                        </button>
                    ))}
                </div>
            )}

            <div className="px-6 pb-8 flex-shrink-0">
                 <button onClick={handleSave} className="w-full py-4 bg-brand-orange text-white rounded-2xl font-bold shadow-lg shadow-brand-orange/20 active:scale-95 transition-all flex justify-center items-center gap-2">
                    <Download size={20} /> 保存图片
                 </button>
            </div>
        </div>
    );
};

// --- Sub-Component: Chemistry Test ---
const ChemistryTest: React.FC<{ tags: Tag[], nickname: string }> = ({ tags, nickname }) => {
    const [status, setStatus] = useState<'intro' | 'quiz' | 'result'>('intro');
    const [questions, setQuestions] = useState<{tag: string, type: TagType, statementType: TagType, isTrue: boolean}[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);

    const typeText: Record<TagType, string> = { like: '喜欢', hate: '讨厌', have: '拥有', want: '想要' };

    const startQuiz = () => {
        if (tags.length < 5) {
            alert("标签太少啦，先去添加一些标签吧！");
            return;
        }
        const newQs = [];
        const pool = [...tags].sort(() => 0.5 - Math.random());
        for (let i = 0; i < 10; i++) {
            const tag = pool[i % pool.length];
            const isTrue = Math.random() > 0.5;
            let statementType = tag.type;
            if (!isTrue) {
                const types: TagType[] = ['like', 'hate', 'have', 'want'];
                const wrongTypes = types.filter(t => t !== tag.type);
                statementType = wrongTypes[Math.floor(Math.random() * wrongTypes.length)];
            }
            newQs.push({ tag: tag.text, type: tag.type, statementType, isTrue });
        }
        setQuestions(newQs);
        setCurrentQ(0);
        setScore(0);
        setStatus('quiz');
    };

    const handleAnswer = (choice: boolean) => {
        if (choice === questions[currentQ].isTrue) {
            setScore(prev => prev + 10);
        }
        if (currentQ < 9) {
            setCurrentQ(prev => prev + 1);
        } else {
            setStatus('result');
        }
    };

    const handleShare = () => {
        alert("模拟：已生成小程序卡片，请分享给微信好友");
    };

    if (status === 'intro') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-6 text-violet-600 animate-bounce">
                    <Users size={40} />
                </div>
                <h2 className="text-2xl font-black text-brand-black mb-2">默契大考验</h2>
                <p className="text-stone-500 mb-10 max-w-xs">系统将基于 {nickname} 的标签生成10道判断题，看看你（或你的朋友）有多了解 TA ？</p>
                
                <div className="flex flex-col w-full max-w-xs gap-4">
                    <button onClick={startQuiz} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-xl shadow-violet-200 active:scale-95 transition-all">
                        开始答题
                    </button>
                    <button onClick={handleShare} className="w-full py-4 bg-white text-violet-600 border border-violet-100 rounded-2xl font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Share2 size={18} />
                        转给朋友
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'quiz') {
        const q = questions[currentQ];
        return (
            <div className="flex flex-col h-full p-8">
                <div className="mb-8">
                    <div className="w-full h-2 bg-stone-100 rounded-full mb-4">
                        <div className="h-full bg-violet-500 rounded-full transition-all duration-300" style={{width: `${(currentQ + 1) * 10}%`}}></div>
                    </div>
                    <span className="text-xs font-bold text-stone-400">Question {currentQ + 1}/10</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100 w-full text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-violet-500"></div>
                        <p className="text-stone-400 text-sm font-bold uppercase tracking-widest mb-4">请判断</p>
                        <h3 className="text-2xl font-medium text-brand-black leading-relaxed">
                            {nickname} <span className="text-violet-600 font-bold">{typeText[q.statementType]}</span> <br/>
                            <span className="text-3xl font-black mt-2 block">{q.tag}</span>
                        </h3>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 pb-8">
                    <button onClick={() => handleAnswer(false)} className="py-4 rounded-2xl bg-stone-100 text-stone-600 font-bold text-xl hover:bg-stone-200 active:scale-95 transition-all">❌ 不对</button>
                    <button onClick={() => handleAnswer(true)} className="py-4 rounded-2xl bg-violet-600 text-white font-bold text-xl shadow-lg hover:bg-violet-700 active:scale-95 transition-all">✅ 是的</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in zoom-in">
            <Trophy size={64} className="text-brand-yellow mb-6" />
            <h2 className="text-4xl font-black text-brand-black mb-2">{score}分</h2>
            <p className="text-lg font-bold text-stone-600 mb-8">
                {score === 100 ? "灵魂伴侣！" : score >= 80 ? "非常懂 TA！" : score >= 60 ? "还算了解~" : "塑料友情..."}
            </p>
            <div className="w-full bg-stone-50 rounded-2xl p-6 mb-8 text-left space-y-2">
                <p className="text-xs font-bold text-stone-400 uppercase">测试报告</p>
                <div className="flex justify-between text-sm font-medium">
                    <span>题目总数</span>
                    <span>10</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                    <span>答对</span>
                    <span className="text-brand-green">{score/10}</span>
                </div>
            </div>
            <div className="flex flex-col w-full gap-3">
                <button onClick={() => alert("海报生成并保存（模拟）")} className="w-full py-4 bg-brand-black text-white rounded-2xl font-bold active:scale-95 transition-all">
                    保存结果海报
                </button>
                <button onClick={() => setStatus('intro')} className="w-full py-4 bg-transparent text-stone-400 font-bold hover:text-stone-600">
                    再测一次
                </button>
            </div>
        </div>
    );
};

// --- Sub-Component: Daily Question ---
const DailyQuestionModule: React.FC<{
    onAddTag: (text: string, type: TagType) => void;
    savedQuestions: QuestionRecord[];
    onSaveQuestion: (question: {id: string, text: string, type: TagType}, answer: string) => void;
    onUpdateQuestion: (id: string, answer: string) => void;
    onDeleteQuestion: (id: string) => void;
}> = ({ onAddTag, savedQuestions, onSaveQuestion, onUpdateQuestion, onDeleteQuestion }) => {
    const [mode, setMode] = useState<'question' | 'history'>('question');
    const [dailyQuestion, setDailyQuestion] = useState<{id: string, text: string, type: TagType} | null>(null);
    const [questionAnswer, setQuestionAnswer] = useState("");
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    
    // History Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editAnswer, setEditAnswer] = useState("");

    useEffect(() => {
        if (!dailyQuestion) fetchQuestion();
    }, []);

    const fetchQuestion = async () => {
        setLoadingQuestion(true);
        const q = await getDailyQuestion();
        setDailyQuestion(q);
        setLoadingQuestion(false);
    };

    const handleSave = () => {
        if (dailyQuestion && questionAnswer.trim()) {
            onSaveQuestion(dailyQuestion, questionAnswer);
            setQuestionAnswer("");
            alert("回答已保存到历史记录！");
        }
    };

    const handleAddToTags = () => {
        if (dailyQuestion && questionAnswer.trim()) {
            onAddTag(questionAnswer, dailyQuestion.type);
            setQuestionAnswer("");
            alert("已添加到标签池！");
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Toggle Header */}
            <div className="flex justify-end px-6 pt-2 pb-0">
                <button 
                    onClick={() => setMode(mode === 'question' ? 'history' : 'question')}
                    className="flex items-center gap-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-full transition-colors"
                >
                    {mode === 'question' ? <Clock size={14} /> : <MessageCircle size={14} />}
                    {mode === 'question' ? '查看历史' : '返回答题'}
                </button>
            </div>

            {mode === 'question' ? (
                <div className="flex flex-col justify-center h-full p-6 pb-24 overflow-y-auto">
                    {dailyQuestion ? (
                        <div className="space-y-8 max-w-sm mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <MessageCircle size={100} className="text-blue-600" />
                                    </div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className="text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">{dailyQuestion.type}</span>
                                    <button onClick={fetchQuestion} disabled={loadingQuestion} className="text-blue-400 hover:text-blue-600 transition-colors">
                                        <RefreshCw size={18} className={loadingQuestion ? 'animate-spin' : ''}/>
                                    </button>
                                </div>
                                <p className="text-blue-900 font-bold text-2xl leading-relaxed relative z-10">{dailyQuestion.text}</p>
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    value={questionAnswer}
                                    onChange={e => setQuestionAnswer(e.target.value)}
                                    placeholder="写下你的回答..."
                                    className="w-full h-32 bg-stone-50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-blue-200 resize-none text-lg text-stone-700 placeholder:text-stone-300 border border-stone-100"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={handleAddToTags}
                                        disabled={!questionAnswer.trim()}
                                        className="py-4 bg-white border border-stone-200 text-stone-600 hover:border-brand-orange hover:text-brand-orange rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                                    >
                                        <Plus size={18} /> 转为标签
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={!questionAnswer.trim()}
                                        className="py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all"
                                    >
                                        <Save size={18} /> 保存回答
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <RefreshCw className="animate-spin text-stone-300" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-4 no-scrollbar">
                    <h3 className="text-lg font-bold text-brand-black mb-4">我的问答 ({savedQuestions.length})</h3>
                    {savedQuestions.length === 0 ? (
                        <div className="text-center py-20 opacity-40">
                            <Clock size={48} className="mx-auto mb-4 text-stone-300" />
                            <p className="text-stone-400 text-sm">暂无保存的回答</p>
                        </div>
                    ) : (
                        savedQuestions.map(record => (
                            <div key={record.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 group animate-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded-md">{new Date(record.date).toLocaleDateString()}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {editingId === record.id ? (
                                            <button 
                                                onClick={() => {
                                                    onUpdateQuestion(record.id, editAnswer);
                                                    setEditingId(null);
                                                }}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                                                title="保存修改"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    setEditingId(record.id);
                                                    setEditAnswer(record.answer);
                                                }}
                                                className="p-1.5 text-stone-400 hover:bg-stone-50 hover:text-blue-500 rounded-lg"
                                                title="修改回答"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                        )}
                                        {/* New Convert to Tag Button */}
                                        <button 
                                            onClick={() => {
                                                if(confirm(`确定将 "${record.answer}" 添加到 "${record.type}" 标签池吗？`)) {
                                                    onAddTag(record.answer, record.type);
                                                }
                                            }}
                                            className="p-1.5 text-stone-400 hover:bg-stone-50 hover:text-brand-orange rounded-lg"
                                            title="转为标签"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(confirm("确定删除这条记录吗？")) onDeleteQuestion(record.id);
                                            }}
                                            className="p-1.5 text-stone-400 hover:bg-stone-50 hover:text-red-500 rounded-lg"
                                            title="删除记录"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-stone-800 mb-2 leading-snug">{record.questionText}</h4>
                                {editingId === record.id ? (
                                    <textarea 
                                        value={editAnswer}
                                        onChange={e => setEditAnswer(e.target.value)}
                                        className="w-full bg-stone-50 p-3 rounded-xl text-sm text-stone-700 outline-none focus:ring-2 focus:ring-blue-100"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-stone-600 text-sm leading-relaxed">{record.answer}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// --- Main Laboratory View ---
export const Laboratory: React.FC<LabProps> = ({ 
    tags, info, onAddTag, onOpenProfile, 
    savedQuestions = [], onSaveQuestion = () => {}, onUpdateQuestion = () => {}, onDeleteQuestion = () => {} 
}) => {
  const [subView, setSubView] = useState<'menu' | 'jar' | 'cards' | 'question' | 'chemistry'>('menu');
  
  const tools = [
    { id: 'jar', title: '标签星星罐', desc: '摇一摇，重温标签记忆。', icon: <Star size={24} />, bg: 'bg-orange-50', text: 'text-orange-600' },
    { id: 'cards', title: '名片生成器', desc: '生成你的专属社交名片。', icon: <CreditCard size={24} />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { id: 'chemistry', title: '默契大考验', desc: '邀请好友测试默契度。', icon: <Users size={24} />, bg: 'bg-violet-50', text: 'text-violet-600' },
    { id: 'question', title: '每日一问', desc: '通过问题挖掘内心角落。', icon: <MessageCircle size={24} />, bg: 'bg-blue-50', text: 'text-blue-600' },
  ];

  if (subView !== 'menu') {
    return (
        <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4 p-6 border-b border-stone-100 flex-shrink-0 z-20 bg-white">
                <button onClick={() => setSubView('menu')} className="w-10 h-10 rounded-full bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-brand-black">
                    {tools.find(t => t.id === subView)?.title}
                </h2>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {subView === 'jar' && <StarJar tags={tags} />}
                {subView === 'cards' && <CardGenerator info={info} tags={tags} />}
                {subView === 'chemistry' && <ChemistryTest tags={tags} nickname={info.nickname || "我"} />}
                
                {subView === 'question' && (
                    <DailyQuestionModule 
                        onAddTag={onAddTag} 
                        savedQuestions={savedQuestions}
                        onSaveQuestion={onSaveQuestion}
                        onUpdateQuestion={onUpdateQuestion}
                        onDeleteQuestion={onDeleteQuestion}
                    />
                )}
            </div>
        </div>
    );
  }

  // Main Menu
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto no-scrollbar pb-32 animate-in fade-in">
      <div className="mt-8 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-black">实验室</h1>
            <p className="text-stone-400 text-sm mt-2">自我探索的趣味工具。</p>
          </div>
          <button 
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-600 hover:text-brand-orange hover:border-brand-orange transition-colors"
          >
            <UserIcon size={20} />
          </button>
      </div>

      <div className="grid gap-4">
        {tools.map(tool => (
          <button 
             key={tool.id} 
             onClick={() => setSubView(tool.id as any)}
             className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 flex items-center text-left hover:shadow-md transition-all active:scale-95 group"
          >
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 ${tool.bg} ${tool.text} group-hover:scale-110 transition-transform`}>
                {tool.icon}
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-lg text-brand-black mb-1">{tool.title}</h3>
                <p className="text-xs text-stone-400">{tool.desc}</p>
             </div>
             <div className="text-stone-300 group-hover:text-brand-orange transition-colors">
                <ChevronRight size={24} />
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};
