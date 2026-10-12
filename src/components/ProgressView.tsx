import React, { useState } from 'react';
import { 
  TrendingUp, 
  Scale, 
  Percent, 
  Activity, 
  Calendar, 
  Plus, 
  Award, 
  Flame, 
  Camera,
  CheckCircle2
} from 'lucide-react';
import { BodyMetric, Member, CheckInRecord } from '../types';

interface ProgressViewProps {
  metrics: BodyMetric[];
  currentMember: Member;
  checkIns: CheckInRecord[];
  onAddMetric: (metric: BodyMetric) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  metrics,
  currentMember,
  checkIns,
  onAddMetric,
}) => {
  const [newWeight, setNewWeight] = useState<number | ''>('');
  const [newBodyFat, setNewBodyFat] = useState<number | ''>('');
  const [newMuscle, setNewMuscle] = useState<number | ''>('');

  const latestMetric = metrics[metrics.length - 1] || { weight: 70, bodyFatPercent: 20, muscleMassKg: 32 };
  const firstMetric = metrics[0] || latestMetric;
  const weightChange = (latestMetric.weight - firstMetric.weight).toFixed(1);

  // Filter checkins for current member
  const memberCheckins = checkIns.filter(c => c.memberId === currentMember.id);

  const handleAddMetricSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    onAddMetric({
      date: new Date().toISOString().slice(0, 10),
      weight: Number(newWeight),
      bodyFatPercent: newBodyFat ? Number(newBodyFat) : undefined,
      muscleMassKg: newMuscle ? Number(newMuscle) : undefined,
    });

    setNewWeight('');
    setNewBodyFat('');
    setNewMuscle('');
  };

  // Render a smooth SVG sparkline chart for weight progress
  const renderWeightChart = () => {
    if (metrics.length < 2) return null;
    const weights = metrics.map(m => m.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const range = maxW - minW || 1;

    const width = 600;
    const height = 180;
    const padding = 30;

    const points = metrics.map((m, idx) => {
      const x = padding + (idx / (metrics.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((m.weight - minW) / range) * (height - 2 * padding);
      return { x, y, weight: m.weight, date: m.date };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
        {/* Horizontal grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="0.8" />

        {/* Path line */}
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="5" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
              {p.weight} kg
            </text>
            <text x={p.x} y={height - 10} textAnchor="middle" fill="#64748b" fontSize="9">
              {p.date.slice(5)}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Body Metrics & Consistency Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ติดตามสถิติร่างกาย & ความสม่ำเสมอ
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              บันทึกน้ำหนัก เปอร์เซ็นต์ไขมัน มวลกล้ามเนื้อ และประวัติความสม่ำเสมอในการเข้ายิม (Gym Consistency)
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">เข้ายิมสะสม</div>
              <div className="text-xl font-bold text-white">{memberCheckins.length} ครั้ง</div>
              <div className="text-[10px] text-emerald-400">ระดับ: Fitness Enthusiast 🔥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">น้ำหนักปัจจุบัน (Weight)</span>
            <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {latestMetric.weight} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold mt-2">
            {Number(weightChange) < 0 ? `ลดลง ${Math.abs(Number(weightChange))} kg` : `เพิ่มขึ้น ${weightChange} kg`} จากวันแรก
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">ไขมันในร่างกาย (Body Fat)</span>
            <div className="p-2 bg-cyan-500/15 text-cyan-400 rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {latestMetric.bodyFatPercent || '--'} <span className="text-sm font-normal text-slate-400">%</span>
          </div>
          <div className="text-xs text-cyan-400 font-semibold mt-2">
            เป้าหมาย: รักษาระดับ 15-18% เพื่อสุขภาพ
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">มวลกล้ามเนื้อ (Muscle Mass)</span>
            <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {latestMetric.muscleMassKg || '--'} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs text-amber-400 font-semibold mt-2">
            แนวโน้มเพิ่มขึ้นต่อเนื่อง (+0.7 kg)
          </div>
        </div>
      </div>

      {/* Trend Graph & New Metric Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Weight Chart */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>กราฟแนวโน้มน้ำหนักตัว (Weight Progression Trend)</span>
              </h3>
              <p className="text-xs text-slate-400">เส้นกราฟแสดงการเปลี่ยนแปลงน้ำหนักตามระยะเวลา</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {metrics.length} ครั้งที่บันทึก
            </span>
          </div>

          <div className="py-2">
            {renderWeightChart()}
          </div>

          {/* History table */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
              ประวัติการชั่งน้ำหนักย้อนหลัง
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">วันที่</th>
                    <th className="py-2 px-3">น้ำหนัก (kg)</th>
                    <th className="py-2 px-3">ไขมัน (%)</th>
                    <th className="py-2 px-3">กล้ามเนื้อ (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {metrics.slice().reverse().map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-mono text-slate-300">{m.date}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{m.weight} kg</td>
                      <td className="py-2.5 px-3 text-cyan-400">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '-'}</td>
                      <td className="py-2.5 px-3 text-amber-400">{m.muscleMassKg ? `${m.muscleMassKg} kg` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Log New Metric */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>บันทึกน้ำหนัก / InBody วันนี้</span>
            </h3>

            <form onSubmit={handleAddMetricSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">น้ำหนักตัว (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="เช่น 73.2"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">เปอร์เซ็นต์ไขมัน (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="เช่น 18.5"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">มวลกล้ามเนื้อ (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="เช่น 34.2"
                  value={newMuscle}
                  onChange={(e) => setNewMuscle(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>บันทึกสถิติร่างกาย</span>
              </button>
            </form>
          </div>

          {/* Photo gallery preview teaser */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>อัลบั้ม Before / After</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Private</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="relative aspect-square rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-3 text-center">
                <div className="text-[11px] font-bold text-slate-300">วันแรก (Day 1)</div>
                <div className="text-[10px] text-slate-500 mt-1">75.4 kg</div>
              </div>
              <div className="relative aspect-square rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col items-center justify-center p-3 text-center">
                <div className="text-[11px] font-bold text-emerald-400">ปัจจุบัน (Now)</div>
                <div className="text-[10px] text-emerald-300 mt-1">{latestMetric.weight} kg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
