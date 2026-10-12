import React, { useEffect } from 'react';
import { 
  QrCode, 
  ShoppingBag, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  BarChart3,
  Flame,
  Zap,
  Activity,
  Heart,
  Timer,
  Footprints
} from 'lucide-react';
import gsap from 'gsap';
import { Member, CourseContract, CheckInRecord, Transaction, CrmLead, ActiveTab } from '../types';

interface DashboardOverviewProps {
  currentMember: Member;
  contracts: CourseContract[];
  checkIns: CheckInRecord[];
  transactions: Transaction[];
  crmLeads: CrmLead[];
  setActiveTab: (tab: ActiveTab) => void;
  gymOccupancy: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentMember,
  contracts,
  checkIns,
  transactions,
  crmLeads,
  setActiveTab,
  gymOccupancy,
}) => {
  const activeContracts = contracts.filter(c => c.status === 'Active');
  const totalRevenue = transactions.reduce((sum, tx) => tx.status === 'Completed' ? sum + tx.amount : sum, 0);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dash-hero', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo('.dash-kpi', 
        { opacity: 0, y: 25, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
      );
      gsap.fromTo('.dash-card', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.65, delay: 0.2, stagger: 0.1, ease: 'power3.out' }
      );
      // Animate revenue bars
      gsap.fromTo('.revenue-bar-fill',
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.8, stagger: 0.06, ease: 'back.out(1.4)', delay: 0.3 }
      );
    });

    return () => ctx.revert();
  }, []);

  // Simulated 6-month revenue data
  const monthlyRevenueData = [
    { month: 'พ.ค.', amount: 42000 },
    { month: 'มิ.ย.', amount: 56500 },
    { month: 'ก.ค.', amount: 68000 },
    { month: 'ส.ค.', amount: 74500 },
    { month: 'ก.ย.', amount: 82000 },
    { month: 'ต.ค.', amount: 98900 },
  ];

  const maxRevenue = Math.max(...monthlyRevenueData.map(d => d.amount));

  // Traffic by hour breakdown
  const peakHoursData = [
    { hour: '07:00', visitors: 18, label: 'เช้า' },
    { hour: '10:00', visitors: 12, label: 'สาย' },
    { hour: '12:00', visitors: 28, label: 'พักเที่ยง' },
    { hour: '15:00', visitors: 16, label: 'บ่าย' },
    { hour: '18:00', visitors: 48, label: 'พีคเย็น 🔥' },
    { hour: '20:00', visitors: 34, label: 'ค่ำ' },
    { hour: '22:00', visitors: 10, label: 'ดึก' },
  ];

  const maxVisitors = 50;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner - Style 3 Electric Lime & Violet */}
      <div className="dash-hero relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-purple-950/40 to-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl glow-athletic">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-black tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
              <span>FITPULSE PRO • ATHLETIC PERFORMANCE OPERATING SYSTEM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              แดชบอร์ดบริหาร ฟิตเนสระดับโปร
            </h1>
            <p className="text-zinc-300 text-sm max-w-xl leading-relaxed">
              ศูนย์รวมการควบคุมคลับ: การเงิน, บันทึกการเช็คอินสด, สัญญาคอร์สอิเล็กทรอนิกส์, วงแหวนกิจกรรม Dynamic Rings และระบบบริหารลูกค้า CRM
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('checkin')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 font-black hover:brightness-110 transition text-xs shadow-lg shadow-lime-400/25 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <QrCode className="w-4 h-4 text-zinc-950" />
                <span>ระบบเช็คอิน QR (ถ่ายภาพ/เลือกรูป)</span>
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-lime-400 font-bold hover:bg-zinc-800 transition text-xs flex items-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>ระบบการเงิน & บัญชี</span>
              </button>
              <button
                onClick={() => setActiveTab('crm')}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-violet-300 font-bold hover:bg-zinc-800 transition text-xs flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-violet-400" />
                <span>ระบบ CRM & สมาชิก</span>
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-bold hover:bg-zinc-800 transition text-xs flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-lime-400" />
                <span>สัญญาซื้อขายคอร์ส</span>
              </button>
            </div>
          </div>

          {/* Quick Athlete Snapshot Card */}
          <div className="bg-zinc-950/90 border-2 border-lime-400/30 p-6 rounded-2xl backdrop-blur-md shrink-0 w-full lg:w-80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-widest uppercase text-zinc-400">ATHLETE PROFILE</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-lime-400 text-zinc-950 uppercase tracking-wide">
                {currentMember.memberType} PASS
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img 
                src={currentMember.avatar} 
                alt={currentMember.name} 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-lime-400 shadow-md"
              />
              <div className="overflow-hidden">
                <div className="font-black text-white text-sm truncate">{currentMember.name}</div>
                <div className="text-xs text-lime-400 font-mono font-bold">{currentMember.id}</div>
                <div className="text-[10px] text-zinc-400">เข้าเป็นสมาชิก: {currentMember.joinDate}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-semibold">สิทธิ์ PT คงเหลือ:</span>
              <strong className="text-lime-400 text-base font-black font-mono">{currentMember.remainingPtSessions} ครั้ง</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Revenue */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="dash-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl hover:border-lime-400 cursor-pointer transition group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">รายรับสะสมรวม</span>
            <div className="p-2.5 rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/20 group-hover:scale-110 transition">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 font-mono">
            ฿{totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-lime-400 mt-2 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-lime-400" />
            <span>+18.4% จากเดือนที่แล้ว</span>
          </div>
        </div>

        {/* KPI 2: Total CRM Leads & Members */}
        <div 
          onClick={() => setActiveTab('crm')}
          className="dash-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl hover:border-violet-500 cursor-pointer transition group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">ลูกค้าในระบบ CRM</span>
            <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 font-mono">
            {crmLeads.length} <span className="text-xs font-normal text-zinc-400">ราย</span>
          </div>
          <div className="text-xs text-violet-400 mt-2 flex items-center gap-1 font-semibold">
            <span>VIP {crmLeads.filter(l => l.stage === 'VIP').length} • Active {crmLeads.filter(l => l.stage === 'Active').length}</span>
          </div>
        </div>

        {/* KPI 3: Contracts */}
        <div 
          onClick={() => setActiveTab('contracts')}
          className="dash-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl hover:border-lime-400 cursor-pointer transition group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">สัญญาคอร์สในระบบ</span>
            <div className="p-2.5 rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/20 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 font-mono">
            {activeContracts.length} <span className="text-xs font-normal text-zinc-400">ฉบับ</span>
          </div>
          <div className="text-xs text-lime-400 mt-2 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>มีผลผูกพันถูกต้อง 100%</span>
          </div>
        </div>

        {/* KPI 4: Live Occupancy */}
        <div 
          onClick={() => setActiveTab('checkin')}
          className="dash-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl hover:border-violet-500 cursor-pointer transition group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">ผู้เข้าใช้ยิมขณะนี้</span>
            <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-110 transition">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 font-mono">
            {gymOccupancy} <span className="text-xs font-normal text-zinc-400">/ 80 คน</span>
          </div>
          <div className="text-xs text-lime-400 mt-2 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
            <span>สถานะความหนาแน่น: ปกติ</span>
          </div>
        </div>
      </div>

      {/* Style 3 Signature: Athletic Activity Rings & Real-time Performance Metrics */}
      <div className="dash-card grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dynamic Activity Rings Card (Nike / Apple Fitness Athletic Style) */}
        <div className="lg:col-span-6 rounded-3xl bg-zinc-900/90 border-2 border-lime-400/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Flame className="w-5 h-5 text-lime-400" />
                <span>ACTIVITY RINGS & DAY PROGRESS</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">เป้าหมายความฟิตรายวัน: เผาผลาญ • เคลื่อนไหว • การยืน</p>
            </div>
            <span className="text-xs font-black text-zinc-950 bg-lime-400 px-3 py-1 rounded-full uppercase tracking-wider">
              82% GOAL
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* Concentric Rings SVG */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                {/* Background tracks */}
                <circle cx="80" cy="80" r="66" stroke="#27272a" strokeWidth="12" fill="none" />
                <circle cx="80" cy="80" r="48" stroke="#27272a" strokeWidth="12" fill="none" />
                <circle cx="80" cy="80" r="30" stroke="#27272a" strokeWidth="12" fill="none" />

                {/* Outer Ring: Move (Lime) 80% */}
                <circle 
                  cx="80" cy="80" r="66" 
                  stroke="#a3e635" strokeWidth="12" 
                  strokeDasharray="414.7" 
                  strokeDashoffset={414.7 * (1 - 0.80)}
                  strokeLinecap="round" fill="none"
                  className="transition-all duration-1000"
                />

                {/* Middle Ring: Exercise (Cyan/Sky) 70% */}
                <circle 
                  cx="80" cy="80" r="48" 
                  stroke="#38bdf8" strokeWidth="12" 
                  strokeDasharray="301.6" 
                  strokeDashoffset={301.6 * (1 - 0.70)}
                  strokeLinecap="round" fill="none"
                  className="transition-all duration-1000"
                />

                {/* Inner Ring: Stand (Violet) 90% */}
                <circle 
                  cx="80" cy="80" r="30" 
                  stroke="#c084fc" strokeWidth="12" 
                  strokeDasharray="188.5" 
                  strokeDashoffset={188.5 * (1 - 0.90)}
                  strokeLinecap="round" fill="none"
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <Zap className="w-6 h-6 text-lime-400 fill-lime-400 mb-0.5 animate-pulse" />
                <span className="text-xs font-black text-white font-mono">82%</span>
                <span className="text-[9px] text-zinc-400 uppercase font-bold">OVERALL</span>
              </div>
            </div>

            {/* Ring Legend & Values */}
            <div className="space-y-4 w-full sm:w-auto">
              {/* Move */}
              <div className="flex items-center justify-between sm:justify-start gap-4 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
                <div className="w-3.5 h-3.5 rounded-full bg-lime-400 shadow-sm shadow-lime-400/50"></div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">MOVE (CALORIES)</div>
                  <div className="text-base font-black text-white font-mono">645 <span className="text-xs font-normal text-zinc-400">/ 800 kcal (80%)</span></div>
                </div>
              </div>

              {/* Exercise */}
              <div className="flex items-center justify-between sm:justify-start gap-4 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50"></div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">EXERCISE TIME</div>
                  <div className="text-base font-black text-white font-mono">48 <span className="text-xs font-normal text-zinc-400">/ 60 mins (70%)</span></div>
                </div>
              </div>

              {/* Stand */}
              <div className="flex items-center justify-between sm:justify-start gap-4 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
                <div className="w-3.5 h-3.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50"></div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">STAND & ACTIVE</div>
                  <div className="text-base font-black text-white font-mono">11 <span className="text-xs font-normal text-zinc-400">/ 12 hrs (90%)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Athletic Performance Metrics (Nike Style Cards) */}
        <div className="lg:col-span-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Activity className="w-5 h-5 text-violet-400" />
                <span>ATHLETIC PERFORMANCE METRICS</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">การตรวจวัดผลและดัชนีชีวภาพของสมาชิกวันนี้</p>
            </div>
            <span className="text-xs font-mono font-bold text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-xl border border-lime-400/20">
              LIVE SYNC
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Metric 1: Workout Duration */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase">
                <Timer className="w-4 h-4 text-lime-400" />
                <span>WORKOUT TIME</span>
              </div>
              <div className="text-2xl font-black text-lime-400 font-mono">48:32</div>
              <div className="text-[11px] text-zinc-500">เซสชันเทรนเนอร์วันนี้</div>
            </div>

            {/* Metric 2: Calories Burned */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>CALORIES BURN</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">645 <span className="text-xs font-normal text-zinc-400">kcal</span></div>
              <div className="text-[11px] text-lime-400 font-semibold">+12% เหนือค่าเฉลี่ย</div>
            </div>

            {/* Metric 3: Heart Rate */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase">
                <Heart className="w-4 h-4 text-violet-400" />
                <span>HEART RATE</span>
              </div>
              <div className="text-2xl font-black text-violet-400 font-mono">142 <span className="text-xs font-normal text-zinc-400">BPM</span></div>
              <div className="text-[11px] text-zinc-500">Max Zone: 185 BPM</div>
            </div>

            {/* Metric 4: Daily Steps */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase">
                <Footprints className="w-4 h-4 text-sky-400" />
                <span>DAILY STEPS</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">11,894</div>
              <div className="text-[11px] text-lime-400 font-semibold">บรรลุเป้าหมาย 10k!</div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>เชื่อมต่อ Apple Health / Garmin / Polar</span>
            <span className="text-lime-400 font-bold">100% Synced</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts: Revenue Trend & Peak Hours */}
      <div className="dash-card grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Chart: Monthly Revenue Bars */}
        <div className="lg:col-span-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <BarChart3 className="w-4 h-4 text-lime-400" />
                <span>แนวโน้มการเติบโตของรายได้ (Revenue Growth)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">ยอดขายคอร์สและสมาชิกฟิตเนสย้อนหลัง 6 เดือน</p>
            </div>
            <span className="text-xs font-mono font-bold text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-xl border border-lime-400/20">
              เฉลี่ย ฿70,000/เดือน
            </span>
          </div>

          {/* Bar Chart Visualization with Lime to Violet Gradient */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyRevenueData.map((d, idx) => {
              const heightPercent = Math.round((d.amount / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition duration-200">
                    ฿{Math.round(d.amount / 1000)}k
                  </div>
                  <div className="w-full max-w-[42px] bg-zinc-950 rounded-xl overflow-hidden h-full flex items-end p-1 border border-zinc-800 group-hover:border-lime-400 transition">
                    <div 
                      className="revenue-bar-fill w-full bg-gradient-to-t from-violet-600 via-emerald-400 to-lime-400 rounded-lg transition-all duration-500 group-hover:brightness-125 shadow-md shadow-lime-400/20"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-zinc-300 uppercase">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>รายได้เดือนล่าสุด (ต.ค.): <strong className="text-lime-400 font-mono">฿98,900</strong></span>
            <button 
              onClick={() => setActiveTab('finance')}
              className="text-lime-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>ดูงบการเงินฉบับเต็ม</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Chart: Peak Hours Traffic */}
        <div className="lg:col-span-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-4 h-4 text-violet-400" />
                <span>ช่วงเวลาคนเข้ายิมหนาแน่น (Peak Hours)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">วิเคราะห์ Traffic สมาชิกเพื่อจัดสรรโค้ชและคลาส</p>
            </div>
          </div>

          {/* Traffic Bars */}
          <div className="space-y-3">
            {peakHoursData.map((ph, idx) => {
              const percent = Math.round((ph.visitors / maxVisitors) * 100);
              const isPeak = ph.visitors >= 40;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-300 font-mono">{ph.hour} ({ph.label})</span>
                    <span className={isPeak ? 'text-lime-400 font-black' : 'text-zinc-400'}>
                      {ph.visitors} คน
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPeak 
                          ? 'bg-gradient-to-r from-violet-500 to-lime-400' 
                          : percent > 50 ? 'bg-violet-400' : 'bg-lime-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
            <Flame className="w-4 h-4 text-lime-400 shrink-0" />
            <span>ช่วงพีคสูงสุด: <strong>17:30 - 20:00 น.</strong> แนะนำให้เพิ่มเทรนเนอร์ประจำฟลอร์</span>
          </div>
        </div>
      </div>

      {/* Feature Navigation Hub (4 Pillars) */}
      <div className="dash-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Hub 1: Check-in */}
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 flex flex-col justify-between space-y-4 hover:border-lime-400 transition group shadow-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/30 flex items-center justify-center group-hover:scale-105 transition">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wide">ระบบเช็คอิน (Kiosk)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              สแกน QR Code เข้ายิม เชื่อมต่อกล้องถ่ายภาพสมาชิก และตัดสิทธิ์ PT Session แบบเรียลไทม์
            </p>
          </div>
          <button
            onClick={() => setActiveTab('checkin')}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-lime-400 hover:text-zinc-950 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>ไปที่หน้าเช็คอิน</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hub 2: Courses */}
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 flex flex-col justify-between space-y-4 hover:border-violet-500 transition group shadow-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/30 flex items-center justify-center group-hover:scale-105 transition">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wide">คอร์ส & แพ็กเกจ</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              แพ็กเกจสมาชิกยิมรายปี รายเดือน คอร์ส PT 1-on-1 และคลาสสปอร์ตเข้มข้น
            </p>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-violet-500 hover:text-white text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>ดูแพ็กเกจคอร์ส</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hub 3: Contracts */}
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 flex flex-col justify-between space-y-4 hover:border-lime-400 transition group shadow-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/30 flex items-center justify-center group-hover:scale-105 transition">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wide">สัญญาซื้อขายคอร์ส</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              ร่างสัญญาอิเล็กทรอนิกส์ E-Contract ลงลายมือชื่อสด และพิมพ์สัญญาทางการ
            </p>
          </div>
          <button
            onClick={() => setActiveTab('contracts')}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-lime-400 hover:text-zinc-950 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>ดูรายการสัญญา</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hub 4: Finance */}
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 flex flex-col justify-between space-y-4 hover:border-violet-500 transition group shadow-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/30 flex items-center justify-center group-hover:scale-105 transition">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white uppercase tracking-wide">ระบบการเงิน & CRM</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              บัญชีรายรับ-รายจ่าย ออกใบเสร็จภาษี และดูแล Pipeline สมาชิก
            </p>
          </div>
          <button
            onClick={() => setActiveTab('finance')}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-violet-500 hover:text-white text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>ดูระบบการเงิน</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
