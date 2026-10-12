import React, { useEffect } from 'react';
import { 
  QrCode, 
  ShoppingBag, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  BarChart3,
  Flame,
  Zap,
  UserPlus,
  PlusCircle,
  Receipt
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

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dash-kpi', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
      gsap.fromTo('.dash-action-btn',
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
      );
    });

    return () => ctx.revert();
  }, []);

  // 6-month revenue data
  const monthlyRevenueData = [
    { month: 'พ.ค.', amount: 42000 },
    { month: 'มิ.ย.', amount: 56500 },
    { month: 'ก.ค.', amount: 68000 },
    { month: 'ส.ค.', amount: 74500 },
    { month: 'ก.ย.', amount: 82000 },
    { month: 'ต.ค.', amount: 98900 },
  ];

  const maxRevenue = Math.max(...monthlyRevenueData.map(d => d.amount));

  // Peak hours data
  const peakHoursData = [
    { hour: '07:00 - 09:00', label: 'เช้า', visitors: 18 },
    { hour: '11:30 - 13:30', label: 'พักเที่ยง', visitors: 28 },
    { hour: '17:00 - 20:00', label: 'พีคช่วงเย็น 🔥', visitors: 48, isPeak: true },
    { hour: '20:00 - 22:00', label: 'ค่ำ', visitors: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Action Center */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
              <span>ภาพรวมการบริหารฟิตเนส (FitPulse Pro)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ยินดีต้อนรับสู่แดชบอร์ดบริหารยิม
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
              ระบบรวมศูนย์ข้อมูล: ตรวจสอบรายรับ, เช็คอินสมาชิก, สัญญาคอร์ส และติดตามลูกค้า สะดวก รวดเร็ว ไม่ซับซ้อน
            </p>
          </div>

          {/* Quick Action Buttons (คลิกเดียวทำงานได้ทันที) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('checkin')}
              className="dash-action-btn p-3 rounded-2xl bg-lime-400 text-zinc-950 hover:bg-lime-300 font-black text-xs flex flex-col items-center justify-center gap-1.5 transition shadow-lg shadow-lime-400/20 cursor-pointer"
            >
              <QrCode className="w-5 h-5 text-zinc-950" />
              <span>เช็คอินเข้ายิม</span>
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className="dash-action-btn p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-zinc-700 cursor-pointer"
            >
              <UserPlus className="w-5 h-5 text-lime-400" />
              <span>สมัครสมาชิกใหม่</span>
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className="dash-action-btn p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-zinc-700 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-violet-400" />
              <span>ซื้อคอร์ส / สัญญา</span>
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className="dash-action-btn p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-zinc-700 cursor-pointer"
            >
              <Receipt className="w-5 h-5 text-sky-400" />
              <span>ดูงบการเงิน</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. สถิติ 4 ตัวเลขสำคัญ ชัดเจน อ่านง่าย ไม่ซับซ้อน */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: รายรับสะสม */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="dash-kpi bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-lime-400 cursor-pointer transition shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">รายรับสะสมรวม</span>
            <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20 group-hover:scale-105 transition">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            ฿{totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-lime-400 mt-1.5 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ยอดขายเติบโตต่อเนื่อง</span>
          </div>
        </div>

        {/* KPI 2: สมาชิกทั้งหมด */}
        <div 
          onClick={() => setActiveTab('crm')}
          className="dash-kpi bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-violet-500 cursor-pointer transition shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">สมาชิก & ลูกค้าในระบบ</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            {crmLeads.length} <span className="text-xs font-normal text-zinc-400">คน</span>
          </div>
          <div className="text-xs text-violet-400 mt-1.5 font-semibold">
            VIP {crmLeads.filter(l => l.stage === 'VIP').length} • ทั่วไป {crmLeads.filter(l => l.stage === 'Active').length}
          </div>
        </div>

        {/* KPI 3: สัญญาคอร์ส */}
        <div 
          onClick={() => setActiveTab('contracts')}
          className="dash-kpi bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-lime-400 cursor-pointer transition shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">สัญญาคอร์สในระบบ</span>
            <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20 group-hover:scale-105 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            {activeContracts.length} <span className="text-xs font-normal text-zinc-400">ฉบับ</span>
          </div>
          <div className="text-xs text-lime-400 mt-1.5 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>มีผลผูกพันถูกต้อง 100%</span>
          </div>
        </div>

        {/* KPI 4: ผู้เข้าใช้ขณะนี้ */}
        <div 
          onClick={() => setActiveTab('checkin')}
          className="dash-kpi bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-violet-500 cursor-pointer transition shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">ผู้เข้าใช้ยิมขณะนี้</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-105 transition">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            {gymOccupancy} <span className="text-xs font-normal text-zinc-400">/ 80 คน</span>
          </div>
          <div className="text-xs text-lime-400 mt-1.5 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
            <span>ความหนาแน่น: ปกติ</span>
          </div>
        </div>
      </div>

      {/* 3. กราฟสรุปผลธุรกิจ 2 ส่วน (ยอดขาย + ช่วงเวลาคนเยอะ) สะอาดตา เข้าใจง่าย */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* กราฟยอดขาย 6 เดือน */}
        <div className="lg:col-span-7 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-lime-400" />
                <span>แนวโน้มยอดขายย้อนหลัง 6 เดือน</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">ยอดรายรับสะสมจากคอร์สและสมาชิกฟิตเนส</p>
            </div>
            <span className="text-xs font-mono font-bold text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-xl border border-lime-400/20">
              เดือนล่าสุด: ฿98,900
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-4 px-2">
            {monthlyRevenueData.map((d, idx) => {
              const heightPercent = Math.round((d.amount / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-zinc-400">
                    ฿{Math.round(d.amount / 1000)}k
                  </div>
                  <div className="w-full max-w-[42px] bg-zinc-950 rounded-xl overflow-hidden h-full flex items-end p-1 border border-zinc-800 group-hover:border-lime-400 transition">
                    <div 
                      className="w-full bg-gradient-to-t from-violet-600 via-lime-400 to-lime-300 rounded-lg transition-all duration-500 shadow-md shadow-lime-400/20"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-zinc-300">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>เฉลี่ย: ฿70,000 / เดือน</span>
            <button 
              onClick={() => setActiveTab('finance')}
              className="text-lime-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>ดูรายละเอียดการเงินทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ช่วงเวลาคนเข้ายิมหนาแน่น (Peak Hours) */}
        <div className="lg:col-span-5 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                <span>ช่วงเวลาคนเข้ายิมหนาแน่น (Peak Hours)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">ช่วยจัดเวรเทรนเนอร์และคลาสให้เหมาะสม</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {peakHoursData.map((ph, idx) => {
              const percent = Math.round((ph.visitors / 50) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-300">{ph.hour} ({ph.label})</span>
                    <span className={ph.isPeak ? 'text-lime-400 font-black' : 'text-zinc-400'}>
                      {ph.visitors} คน
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        ph.isPeak ? 'bg-gradient-to-r from-violet-500 to-lime-400' : 'bg-zinc-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2 mt-4">
            <Flame className="w-4 h-4 text-lime-400 shrink-0" />
            <span>ช่วง <strong>17:00 - 20:00 น.</strong> มีผู้ใช้บริการสูงสุด แนะนำเพิ่มเทรนเนอร์ฟลอร์</span>
          </div>
        </div>
      </div>

      {/* 4. สรุปประวัติเช็คอินล่าสุด (Live Attendance) เข้าถึงง่ายในหน้าแรก */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-lime-400" />
            <span>ประวัติสมาชิกเข้ายิมล่าสุด (Real-time Check-ins)</span>
          </h3>
          <button
            onClick={() => setActiveTab('checkin')}
            className="text-xs text-lime-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>เปิดระบบสแกนเช็คอิน</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] uppercase">
                <th className="py-2.5 px-3">เวลา</th>
                <th className="py-2.5 px-3">ชื่อสมาชิก</th>
                <th className="py-2.5 px-3">ประเภท</th>
                <th className="py-2.5 px-3">โซน</th>
                <th className="py-2.5 px-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {checkIns.slice(0, 4).map((chk) => (
                <tr key={chk.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3 px-3 text-zinc-300 font-mono">{chk.timestamp.slice(11)}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-white">{chk.memberName}</span>
                    <span className="text-[10px] text-zinc-500 font-mono ml-2">({chk.memberId})</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      chk.checkInType === 'PT Session' 
                        ? 'bg-violet-950 text-violet-300 border border-violet-500/30' 
                        : 'bg-lime-950 text-lime-400 border border-lime-500/30'
                    }`}>
                      {chk.checkInType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">{chk.zone}</td>
                  <td className="py-3 px-3">
                    <span className="text-lime-400 font-bold">✓ เช็คอินแล้ว</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
