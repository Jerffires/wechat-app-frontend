
import React, { useState, useEffect } from 'react';
import { Tag, PersonalInfo, ViewState, TagType, QuestionRecord } from './types';
import { Home } from './views/Home';
import { Laboratory } from './views/Laboratory';
import { Profile } from './views/Profile';
import { TagPool } from './components/TagPool';
import { PersonalInfoDrawer } from './components/PersonalInfoDrawer';
import { Home as HomeIcon, FlaskConical } from './components/Icons';

// Initial Data matching new structure
const initialInfo: PersonalInfo = {
  nickname: '',
  birthday: '',
  zodiac: '',
  keywords: ['', '', ''],
  mbti: ['E', 'N', 'F', 'P'],
  socialBattery: 60,
  ingredients: []
};

const initialTags: Tag[] = [
  { id: '1', text: '设计', type: 'like', isPinned: true, createdAt: Date.now() },
  { id: '2', text: '咖啡', type: 'like', isPinned: true, createdAt: Date.now() },
  { id: '3', text: '虚伪', type: 'hate', isPinned: true, createdAt: Date.now() },
  { id: '4', text: '相机', type: 'have', isPinned: true, createdAt: Date.now() },
  { id: '5', text: '自由', type: 'want', isPinned: true, createdAt: Date.now() },
  { id: '6', text: '早起', type: 'hate', isPinned: false, createdAt: Date.now() },
  { id: '7', text: '躺平', type: 'want', isPinned: true, createdAt: Date.now() },
];

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [activePool, setActivePool] = useState<TagType>('like');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Data State
  const [tags, setTags] = useState<Tag[]>(() => {
    try {
      const saved = localStorage.getItem('mylabel_tags_v4');
      return saved ? JSON.parse(saved) : initialTags;
    } catch {
      return initialTags;
    }
  });
  
  const [info, setInfo] = useState<PersonalInfo>(() => {
    try {
      const saved = localStorage.getItem('mylabel_info_v6'); // Bumped version to v6 to reset defaults
      if (saved) {
        const parsed = JSON.parse(saved);
        // Simple migration or check if ingredients exist
        if (!parsed.ingredients) return initialInfo;
        return parsed;
      }
      return initialInfo;
    } catch {
      return initialInfo;
    }
  });

  const [savedQuestions, setSavedQuestions] = useState<QuestionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mylabel_questions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('mylabel_tags_v4', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('mylabel_info_v6', JSON.stringify(info)); // Bumped version to v6
  }, [info]);

  useEffect(() => {
    localStorage.setItem('mylabel_questions_v1', JSON.stringify(savedQuestions));
  }, [savedQuestions]);

  // Tag Handlers
  const addTag = (text: string, type: TagType) => {
    if (!text) return;
    if (tags.some(t => t.text === text && t.type === type)) return;
    const newTag: Tag = {
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      text,
      type,
      isPinned: false,
      createdAt: Date.now(),
    };
    setTags(prev => [newTag, ...prev]);
  };

  const removeTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const togglePin = (id: string) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, isPinned: !t.isPinned } : t));
  };

  const openPool = (type: TagType) => {
    setActivePool(type);
    setView('tag-detail');
  };

  // Question Handlers
  const handleSaveQuestion = (question: {id: string, text: string, type: TagType}, answer: string) => {
    const record: QuestionRecord = {
      id: Date.now().toString(),
      questionId: question.id,
      questionText: question.text,
      answer: answer,
      type: question.type,
      date: Date.now()
    };
    setSavedQuestions(prev => [record, ...prev]);
  };

  const handleUpdateQuestion = (id: string, newAnswer: string) => {
    setSavedQuestions(prev => prev.map(q => q.id === id ? { ...q, answer: newAnswer } : q));
  };

  const handleDeleteQuestion = (id: string) => {
    setSavedQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Simplified Info Handler
  const handleUpdateInfo = (newInfo: PersonalInfo) => {
    setInfo(newInfo);
  };

  // Render logic
  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
            <Home 
                tags={tags} 
                info={info} 
                onUpdateInfo={handleUpdateInfo} 
                onOpenPool={openPool} 
                onOpenProfile={() => setView('profile')}
            />
        );
      case 'lab':
        return (
            <Laboratory 
                tags={tags} 
                info={info} 
                onAddTag={addTag} 
                onOpenProfile={() => setView('profile')}
                savedQuestions={savedQuestions}
                onSaveQuestion={handleSaveQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
            />
        );
      case 'tag-detail':
        return (
          <TagPool 
            type={activePool}
            tags={tags.filter(t => t.type === activePool)}
            onAdd={addTag}
            onRemove={removeTag}
            onPin={togglePin}
            onBack={() => setView('home')}
          />
        );
      case 'profile':
        return (
          <Profile 
            info={info} 
            onBack={() => setView('home')} 
            onEditProfile={() => setIsDrawerOpen(true)}
          />
        );
      default:
        return <Home tags={tags} info={info} onUpdateInfo={handleUpdateInfo} onOpenPool={openPool} onOpenProfile={() => setView('profile')} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-brand-cream flex flex-col shadow-2xl overflow-hidden relative font-sans text-brand-black">
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>

      {view !== 'tag-detail' && view !== 'profile' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto">
          <nav className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-xl">
            <button 
              onClick={() => setView('home')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${view === 'home' ? 'text-brand-orange scale-110' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <HomeIcon size={24} strokeWidth={view === 'home' ? 2.5 : 2} />
            </button>
            <div className="w-px h-6 bg-stone-200"></div>
            <button 
              onClick={() => setView('lab')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${view === 'lab' ? 'text-brand-orange scale-110' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <FlaskConical size={24} strokeWidth={view === 'lab' ? 2.5 : 2} />
            </button>
          </nav>
        </div>
      )}

       <PersonalInfoDrawer 
        info={info} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleUpdateInfo}
      />
    </div>
  );
}
