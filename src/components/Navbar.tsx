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
  Zap,
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
    { id: 'dashboard', label: 'แดชบอร์ด', icon: BarChart3 },
    { id: 'checkin', label: 'ระบบเช็คอิน', icon: QrCode, badge: 'QR/ID' },
    { id: 'courses', label: 'คอร์ส & แพ็กเกจ', icon: ShoppingBag, badge: 'Hot' },
    { id: 'contracts', label: 'สัญญาซื้อขายคอร์ส', icon: FileText },
    { id: 'finance', label: 'ระบบการเงิน', icon: DollarSign, badge: 'บิล/ภาษี' },
    { id: 'crm', label: 'ระบบ CRM', icon: Users, badge: 'ลูกค้า' },
  ];

  const occupancyPercent = Math.round((gymOccupancy / maxCapacity) * 100);

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 no-print">
      {/* Top Banner - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-lime-400 animate-ping"></span>
          <span className="text-zinc-200 font-bold uppercase tracking-wide">FITPULSE ARENA: 06:00 - 23:00 น.</span>
          <span className="text-zinc-700">|</span>
          <span className="hidden sm:inline text-zinc-400">สาขา Flagship สุขุมวิท (Pro Athletic Hub)</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Gym Occupancy meter */}
          <div className="flex items-center gap-2 bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-800">
            <Activity className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-zinc-300 text-xs">
              ความหนาแน่น: <strong className="text-white font-mono">{gymOccupancy}</strong>/{maxCapacity} คน
            </span>
            <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${occupancyPercent > 80 ? 'bg-rose-500' : occupancyPercent > 50 ? 'bg-violet-400' : 'bg-lime-400'}`}
                style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Member Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 hidden sm:inline text-xs font-semibold">สมาชิก:</span>
            <select
              value={currentMember.id}
              onChange={(e) => setCurrentMemberId(e.target.value)}
              className="bg-zinc-900 text-zinc-200 border border-zinc-700/80 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-lime-400 focus:outline-none cursor-pointer font-medium"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo - Electric Lime & Violet Theme */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-400 via-emerald-400 to-violet-500 flex items-center justify-center shadow-lg shadow-lime-400/25 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 text-zinc-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-white">FITPULSE</span>
                <span className="bg-gradient-to-r from-lime-400 to-violet-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">PRO</span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-widest uppercase font-semibold">ATHLETIC OS 2026</p>
            </div>
          </div>

          {/* Desktop Tab Links - Style 3 Lime & Violet */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 gap-1.5 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                    isActive 
                      ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 shadow-lg shadow-lime-400/25 font-black scale-[1.02]' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive 
                        ? 'bg-zinc-950/20 text-zinc-950' 
                        : 'bg-violet-950/90 text-violet-300 border border-violet-500/40'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Current Member Mini Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-black text-white flex items-center justify-end gap-1 uppercase tracking-wide">
                <span>{currentMember.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-lime-400 inline" />
              </div>
              <div className="text-[11px] text-lime-400 font-bold">
                PT คงเหลือ: <strong className="font-mono">{currentMember.remainingPtSessions}</strong> ครั้ง
              </div>
            </div>
            <div className="relative">
              <img 
                src={currentMember.avatar} 
                alt={currentMember.name} 
                className="w-10 h-10 rounded-full border-2 border-lime-400 object-cover shadow-md shadow-lime-400/20"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime-400 border-2 border-zinc-950 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden w-full px-3 py-2 border-t border-zinc-800 bg-zinc-950/95 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-black transition-all shrink-0 uppercase tracking-wide ${
                isActive 
                  ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-400/20' 
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
