
import React from 'react';
import { PersonalInfo } from '../types';
import { ChevronLeft, ChevronRight, User, Bell, Moon, HelpCircle, Shield, FileText, Info, LogOut } from '../components/Icons';

interface ProfileProps {
  info: PersonalInfo;
  onBack: () => void;
  onEditProfile: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ info, onBack, onEditProfile }) => {
  const menuGroups = [
    {
      title: "偏好设置",
      items: [
        { icon: <Bell size={18} />, label: "消息通知", action: () => alert("功能开发中") },
        { icon: <Moon size={18} />, label: "外观设置", action: () => alert("功能开发中") },
      ]
    },
    {
      title: "支持与关于",
      items: [
        { icon: <HelpCircle size={18} />, label: "帮助与反馈", action: () => alert("请联系客服") },
        { icon: <Shield size={18} />, label: "隐私政策", action: () => alert("隐私政策内容...") },
        { icon: <FileText size={18} />, label: "用户协议", action: () => alert("用户协议内容...") },
        { icon: <Info size={18} />, label: "关于我们", action: () => alert("mylabel v1.0.0") },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-stone-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center hover:bg-stone-100 transition-colors">
          <ChevronLeft size={24} className="text-stone-600" />
        </button>
        <h1 className="text-lg font-bold text-brand-black">个人中心</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        
        {/* User Card */}
        <div 
          onClick={onEditProfile}
          className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100 flex items-center gap-5 cursor-pointer active:scale-95 transition-transform"
        >
           <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <User size={32} />
           </div>
           <div className="flex-1">
              <h2 className="text-xl font-bold text-brand-black">{info.nickname || "未登录"}</h2>
              <p className="text-sm text-stone-400 mt-1">点击编辑个人资料</p>
           </div>
           <ChevronRight size={20} className="text-stone-300" />
        </div>

        {/* Menu Groups */}
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-2">{group.title}</h3>
             <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100">
                {group.items.map((item, i) => (
                   <button 
                      key={i}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors ${i !== group.items.length - 1 ? 'border-b border-stone-50' : ''}`}
                   >
                      <div className="flex items-center gap-4 text-stone-600 font-medium">
                         {item.icon}
                         <span>{item.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-stone-300" />
                   </button>
                ))}
             </div>
          </div>
        ))}

        {/* Logout */}
        <button 
            onClick={() => alert("退出登录")}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 transition-colors"
        >
            <LogOut size={18} />
            退出登录
        </button>

        <div className="text-center text-[10px] text-stone-300 font-medium pt-4">
            mylabel Version 1.0.0
        </div>
      </div>
    </div>
  );
};
