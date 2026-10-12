import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Star, 
  Filter, 
  X, 
  Plus, 
  Send,
  ChevronRight
} from 'lucide-react';
import { CrmLead, CrmInteraction, Member } from '../types';
import gsap from 'gsap';

interface CrmViewProps {
  leads: CrmLead[];
  onAddLead: (lead: Omit<CrmLead, 'id' | 'interactions'>) => void;
  onAddInteraction: (leadId: string, interaction: Omit<CrmInteraction, 'id'>) => void;
  onUpdateLeadStage: (leadId: string, newStage: CrmLead['stage']) => void;
}

export const CrmView: React.FC<CrmViewProps> = ({
  leads,
  onAddLead,
  onAddInteraction,
  onUpdateLeadStage,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);

  // GSAP Entrance Animations
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.crm-lead-card',
        { opacity: 0, y: 25, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [selectedStage, searchQuery]);

  // Add Lead Modal state
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadStage, setNewLeadStage] = useState<CrmLead['stage']>('Lead');
  const [newLeadTrainer, setNewLeadTrainer] = useState('Coach Alex');
  const [newLeadInterest, setNewLeadInterest] = useState('Personal Training 20 Sessions');

  // Add Interaction Form state
  const [interactionType, setInteractionType] = useState<CrmInteraction['type']>('Call');
  const [interactionStaff, setInteractionStaff] = useState('Admin Nan');
  const [interactionNote, setInteractionNote] = useState('');

  const stages: { id: string; label: string; count: number; color: string }[] = [
    { id: 'All', label: 'ทั้งหมด', count: leads.length, color: 'bg-slate-800 text-slate-200' },
    { id: 'Lead', label: 'ผู้สนใจใหม่ (Lead)', count: leads.filter(l => l.stage === 'Lead').length, color: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'Trial', label: 'ทดลองเล่น (Trial)', count: leads.filter(l => l.stage === 'Trial').length, color: 'bg-amber-500/20 text-amber-300' },
    { id: 'Active', label: 'สมาชิกปกติ (Active)', count: leads.filter(l => l.stage === 'Active').length, color: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'VIP', label: 'สมาชิก VIP', count: leads.filter(l => l.stage === 'VIP').length, color: 'bg-purple-500/20 text-purple-300' },
    { id: 'At Risk', label: 'ไม่ได้มาเกิน 14 วัน (At Risk)', count: leads.filter(l => l.stage === 'At Risk').length, color: 'bg-rose-500/20 text-rose-300' },
  ];

  const filteredLeads = leads.filter(l => {
    const matchesStage = selectedStage === 'All' || l.stage === selectedStage;
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.assignedTrainer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    onAddLead({
      name: newLeadName,
      phone: newLeadPhone,
      email: newLeadEmail || '-',
      stage: newLeadStage,
      assignedTrainer: newLeadTrainer,
      interestCourse: newLeadInterest,
      lastContactDate: new Date().toISOString().slice(0, 10),
    });

    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setIsAddLeadModalOpen(false);
  };

  const handleCreateInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !interactionNote) return;

    onAddInteraction(selectedLead.id, {
      date: new Date().toISOString().slice(0, 10),
      type: interactionType,
      staffName: interactionStaff,
      note: interactionNote
    });

    // Update the selectedLead view locally
    const updatedLead = {
      ...selectedLead,
      lastContactDate: new Date().toISOString().slice(0, 10),
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          type: interactionType,
          staffName: interactionStaff,
          note: interactionNote
        },
        ...selectedLead.interactions
      ]
    };
    setSelectedLead(updatedLead);
    setInteractionNote('');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Customer Relationship Management (CRM)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ระบบบริหารความสัมพันธ์ลูกค้าและสมาชิก (Fitness CRM)
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              ติดตาม Pipeline ผู้สนใจ สมัครสมาชิก ดูแลลูกค้ากลุ่มเสี่ยง (At Risk) และบันทึกประวัติการพูดคุยแบบ 360 องศา
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:brightness-110 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>เพิ่มผู้สนใจ / สมาชิกใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Stage Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStage(st.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
              selectedStage === st.id 
                ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20 font-bold' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{st.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              selectedStage === st.id ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}>
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Directory Table & Customer 360 Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Leads Table */}
        <div className={`space-y-4 ${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            {/* Search */}
            <div className="flex items-center justify-between mb-4 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, เบอร์โทร, เทรนเนอร์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <span className="text-xs text-slate-400 font-mono">พบ {filteredLeads.length} รายการ</span>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">ลูกค้า / สมาชิก</th>
                    <th className="py-3 px-3">สถานะ (Stage)</th>
                    <th className="py-3 px-3">คอร์สที่สนใจ</th>
                    <th className="py-3 px-3">โค้ชดูแล</th>
                    <th className="py-3 px-3">ติดต่อล่าสุด</th>
                    <th className="py-3 px-3 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className={`crm-lead-card hover:bg-zinc-800/50 cursor-pointer transition ${
                        selectedLead?.id === lead.id ? 'bg-violet-950/30 border-l-2 border-lime-400' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{lead.name}</span>
                          {lead.stage === 'VIP' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{lead.phone}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.stage === 'VIP' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          lead.stage === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          lead.stage === 'At Risk' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          lead.stage === 'Trial' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {lead.stage}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 max-w-[160px] truncate">{lead.interestCourse}</td>
                      <td className="py-3.5 px-3 text-slate-400">{lead.assignedTrainer}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-400">{lead.lastContactDate}</td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 hover:bg-purple-500 hover:text-white font-semibold text-[11px] transition"
                        >
                          ประวัติ 360°
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Customer 360 Detail View & Interaction Logger */}
        {selectedLead && (
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
              {/* Profile Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {selectedLead.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{selectedLead.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        {selectedLead.stage}
                      </span>
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedLead.phone} | {selectedLead.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stage Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">ปรับเปลี่ยนสถานะ (Pipeline Stage):</label>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {(['Lead', 'Trial', 'Active', 'VIP', 'At Risk', 'Expired'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateLeadStage(selectedLead.id, st);
                        setSelectedLead({ ...selectedLead, stage: st });
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-center font-bold transition ${
                        selectedLead.stage === st 
                          ? 'bg-purple-500 text-white border-purple-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Log Follow-up / Interaction Form */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>บันทึกการติดตามลูกค้า (Log Follow-up)</span>
                </h4>

                <form onSubmit={handleCreateInteraction} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 mb-1 block">ช่องทาง:</label>
                      <select
                        value={interactionType}
                        onChange={(e) => setInteractionType(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      >
                        <option value="Call">โทรศัพท์ (Phone Call)</option>
                        <option value="Line Chat">LINE / แชท</option>
                        <option value="In-Person">พบตัวต่อตัวที่ยิม</option>
                        <option value="Email">อีเมล (Email)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 mb-1 block">ผู้บันทึก (Staff):</label>
                      <input
                        type="text"
                        value={interactionStaff}
                        onChange={(e) => setInteractionStaff(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">รายละเอียดการพูดคุย / ติดตามผล:</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="เช่น สอบถามความพึงพอใจการฝึกซ้อม, นัดหมายวันเข้าคลาส, ชวนต่อโปร..."
                      value={interactionNote}
                      onChange={(e) => setInteractionNote(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>บันทึกประวัติการพูดคุย</span>
                  </button>
                </form>
              </div>

              {/* Interaction History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ไทม์ไลน์การพูดคุยย้อนหลัง ({selectedLead.interactions.length} ครั้ง)
                </h4>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedLead.interactions.map((int) => (
                    <div key={int.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-purple-400">{int.type} • โดย {int.staffName}</span>
                        <span className="font-mono">{int.date}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{int.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <span>เพิ่มรายชื่อผู้สนใจ / สมาชิกใหม่</span>
              </h3>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ณภัทร สุขสมบูรณ์"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="081-xxx-xxxx"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">อีเมล</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">สถานะแรกเริ่ม *</label>
                  <select
                    value={newLeadStage}
                    onChange={(e) => setNewLeadStage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Lead">Lead (ผู้สนใจ)</option>
                    <option value="Trial">Trial (ทดลองใช้ฟรี)</option>
                    <option value="Active">Active (สมาชิก)</option>
                    <option value="VIP">VIP Member</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">เทรนเนอร์ที่ดูแล *</label>
                  <select
                    value={newLeadTrainer}
                    onChange={(e) => setNewLeadTrainer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Coach Alex">Coach Alex</option>
                    <option value="Coach Max">Coach Max</option>
                    <option value="Kru Pim">Kru Pim</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">คอร์สที่สนใจ / วัตถุประสงค์</label>
                <input
                  type="text"
                  placeholder="เช่น ลดน้ำหนัก 60 วัน, เวทเทรนนิ่ง 20 ครั้ง"
                  value={newLeadInterest}
                  onChange={(e) => setNewLeadInterest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition shadow-lg shadow-purple-500/20"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
