import React from 'react';
import { 
  Dumbbell, 
  QrCode, 
  ShoppingBag, 
  FileText, 
  Users, 
  ShieldCheck, 
  DollarSign, 
  BarChart3,
  Activity
} from 'lucide-react';
import { ActiveTab, Member } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  members: Member[];
  currentMember: Member;
  setCurrentMemberId: (id: string) => void;
  gymOccupancy: number;
  maxCapacity: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  members,
  currentMember,
  setCurrentMemberId,
  gymOccupancy,
  maxCapacity
}) => {
  const tabs = [
    { id: 'dashboard', label: 'หน้าหลัก (แดชบอร์ด)', icon: BarChart3 },
    { id: 'checkin', label: 'เช็คอินเข้ายิม', icon: QrCode },
    { id: 'courses', label: 'คอร์ส & แพ็กเกจ', icon: ShoppingBag },
    { id: 'contracts', label: 'สัญญาคอร์ส', icon: FileText },
    { id: 'finance', label: 'การเงิน & ใบเสร็จ', icon: DollarSign },
    { id: 'crm', label: 'ข้อมูลลูกค้า (CRM)', icon: Users },
  ];

  const occupancyPercent = Math.round((gymOccupancy / maxCapacity) * 100);

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 no-print">
      {/* Main Navigation Bar - Full Width & Clean */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-400 to-violet-500 flex items-center justify-center shadow-md shadow-lime-400/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-zinc-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wide text-white">FITPULSE</span>
                <span className="bg-lime-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">PRO</span>
              </div>
              <p className="text-[10px] text-zinc-400">ระบบจัดการฟิตเนสครบวงจร</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Simple & Clear */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 gap-2 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-400/20 font-black' 
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status & Member Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Occupancy Pill */}
            <div className="hidden xl:flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
              <span className="text-zinc-400">ในยิม:</span>
              <strong className="text-white font-mono">{gymOccupancy}/{maxCapacity}</strong>
            </div>

            {/* Active Member Switcher */}
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1.5 pr-3">
              <img 
                src={currentMember.avatar} 
                alt={currentMember.name} 
                className="w-8 h-8 rounded-lg border border-lime-400 object-cover shrink-0"
              />
              <div className="text-left">
                <select
                  value={currentMember.id}
                  onChange={(e) => setCurrentMemberId(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                      {m.name} ({m.id})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-lime-400 font-medium">
                  PT คงเหลือ {currentMember.remainingPtSessions} ครั้ง
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden w-full px-3 py-2 border-t border-zinc-800 bg-zinc-950 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap font-bold transition-all shrink-0 ${
                isActive 
                  ? 'bg-lime-400 text-zinc-950 font-black shadow-md shadow-lime-400/20' 
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
