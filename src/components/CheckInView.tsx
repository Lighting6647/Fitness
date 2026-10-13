import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  MapPin, 
  Calendar, 
  Sparkles,
  ArrowRight,
  UserPlus,
  X,
  Camera,
  Upload,
  Trash2,
  Zap,
  Activity,
  Download,
  Smartphone
} from 'lucide-react';
import gsap from 'gsap';
import QRCode from 'qrcode';
import { Member, CheckInRecord } from '../types';

interface CheckInViewProps {
  currentMember: Member;
  members: Member[];
  checkIns: CheckInRecord[];
  onCheckIn: (record: Omit<CheckInRecord, 'id' | 'timestamp'>) => { success: boolean; message: string };
  gymOccupancy: number;
  onRegisterMember: (newMember: Omit<Member, 'id' | 'qrCodeUrl'>) => Member;
}

export const CheckInView: React.FC<CheckInViewProps> = ({
  currentMember,
  members,
  checkIns,
  onCheckIn,
  gymOccupancy,
  onRegisterMember,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState(currentMember.id);
  const [checkInType, setCheckInType] = useState<'Gym Entrance' | 'PT Session' | 'Group Class'>('Gym Entrance');
  const [selectedZone, setSelectedZone] = useState('Zone A - Free Weights & PT Cage');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Quick Register Modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regIdCard, setRegIdCard] = useState('');
  const [regPtSessions, setRegPtSessions] = useState<number>(0);
  const [regType, setRegType] = useState<'Active' | 'VIP'>('Active');
  
  // Camera & Image Upload state
  const [regAvatar, setRegAvatar] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultPresetAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  const zones = [
    'Zone A - Free Weights & PT Cage',
    'Zone B - Cardio & High-Tech Machines',
    'Zone C - Functional & Cross-Training',
    'Studio 1 - Yoga & Pilates Studio',
    'Studio 2 - Spinning & Cycling Room'
  ];

  // Sync selectedMemberId when currentMember changes (e.g. after buying a course or registering)
  useEffect(() => {
    setSelectedMemberId(currentMember.id);
  }, [currentMember.id]);

  // Active member for the pass card
  const displayedMember = members.find(m => m.id === selectedMemberId) || currentMember;

  // Generate REAL Scannable ISO QR Code whenever displayedMember changes
  useEffect(() => {
    const generateRealQrCode = async () => {
      try {
        const baseUrl = window.location.origin;
        const scanUrl = `${baseUrl}/?checkin=${encodeURIComponent(displayedMember.id)}&name=${encodeURIComponent(displayedMember.name)}&phone=${encodeURIComponent(displayedMember.phone)}&type=${encodeURIComponent(displayedMember.memberType)}&pt=${displayedMember.remainingPtSessions}&join=${encodeURIComponent(displayedMember.joinDate)}`;

        const dataUrl = await QRCode.toDataURL(scanUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#09090b',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('QR generation error:', err);
      }
    };

    generateRealQrCode();
  }, [displayedMember]);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.athlete-pass-card', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
      gsap.fromTo('.kiosk-panel', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.45, delay: 0.1, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  // Download QR Code Image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `FitPulse-QR-${displayedMember.id}-${displayedMember.name}.png`;
    link.click();
  };

  // Camera Management Functions
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('อุปกรณ์หรือเบราว์เซอร์ไม่รองรับกล้องถ่ายภาพ');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        },
        audio: false
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error('Video play error:', e));
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('ไม่สามารถเปิดกล้องได้ (กรุณาอนุญาตสิทธิ์การเข้าถึงกล้อง หรือเลือกอัปโหลดรูปภาพแทน)');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setRegAvatar(dataUrl);
        stopCamera();
      }
    } catch (e) {
      console.error('Capture photo error:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRegAvatar(event.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseRegisterModal = () => {
    stopCamera();
    setIsRegisterModalOpen(false);
  };

  const handlePerformCheckIn = (memberIdToUse?: string) => {
    const targetId = memberIdToUse || selectedMemberId;
    const targetMember = members.find(m => m.id === targetId);
    
    if (!targetMember) {
      setStatusMessage({ text: 'ไม่พบข้อมูลสมาชิกในระบบ', type: 'error' });
      return;
    }

    const result = onCheckIn({
      memberId: targetMember.id,
      memberName: targetMember.name,
      checkInType: checkInType,
      zone: selectedZone,
      status: 'Success',
      notes: checkInType === 'PT Session' 
        ? `ใช้บริการ PT Session (คงเหลือ ${Math.max(0, targetMember.remainingPtSessions - 1)} ครั้ง)`
        : 'เช็คอินเข้าใช้งานตามปกติ'
    });

    if (result.success) {
      setStatusMessage({ text: result.message, type: 'success' });
    } else {
      setStatusMessage({ text: result.message, type: 'error' });
    }

    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;

    const created = onRegisterMember({
      name: regName,
      phone: regPhone,
      email: `${regName.replace(/\s+/g, '').toLowerCase()}@gmail.com`,
      idCard: regIdCard || '1-1002-99887-12-3',
      memberType: regType,
      avatar: regAvatar || defaultPresetAvatar,
      remainingPtSessions: Number(regPtSessions) || 0,
      joinDate: new Date().toISOString().slice(0, 10),
    });

    setSelectedMemberId(created.id);
    handleCloseRegisterModal();
    setRegName('');
    setRegPhone('');
    setRegIdCard('');
    setRegPtSessions(0);
    setRegAvatar('');

    setStatusMessage({
      text: `สร้างบัตรสมาชิกและ QR Code ใหม่สำเร็จ! สมาชิก: ${created.name} (${created.id}) สามารถสแกน QR ได้ทันที`,
      type: 'success'
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-xl transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-zinc-900 border-lime-400 text-lime-300 shadow-lime-500/20' 
            : 'bg-zinc-900 border-rose-500 text-rose-300 shadow-rose-500/20'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-lime-400 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <div className="font-bold text-sm">{statusMessage.text}</div>
        </div>
      )}

      {/* Main Grid: Digital Pass (Left) & Check-in Desk (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Member Pass with REAL Scannable QR Code */}
        <div className="lg:col-span-5 space-y-6">
          <div className="athlete-pass-card relative rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-lime-400/40 p-6 sm:p-7 shadow-2xl overflow-hidden glow-athletic">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-lime-400 via-violet-500 to-fuchsia-500"></div>

            <div className="flex items-center justify-between mb-5 mt-1">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-lime-400" />
                <span className="text-xs font-black tracking-widest text-zinc-300 uppercase">FITPULSE ATHLETE PASS</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-black tracking-wider uppercase ${
                displayedMember.memberType === 'VIP' 
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/30' 
                  : 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-400/30'
              }`}>
                {displayedMember.memberType} PASS
              </span>
            </div>

            {/* Member Card Profile Info with Photo */}
            <div className="flex items-center gap-4 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 mb-5">
              <div className="relative shrink-0">
                <img 
                  src={displayedMember.avatar} 
                  alt={displayedMember.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-lime-400 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-lime-400 rounded-full text-zinc-950">
                  <Zap className="w-3 h-3 fill-zinc-950" />
                </div>
              </div>
              <div className="space-y-1 overflow-hidden">
                <h3 className="text-lg font-black text-white truncate">{displayedMember.name}</h3>
                <div className="text-xs text-zinc-400">
                  รหัสบัตร: <span className="text-lime-400 font-mono font-bold">{displayedMember.id}</span>
                </div>
                <div className="text-xs text-zinc-400">เบอร์โทร: {displayedMember.phone}</div>
              </div>
            </div>

            {/* REAL Scannable QR Code Display */}
            <div className="bg-zinc-950/90 p-5 rounded-2xl border border-zinc-800 text-center mb-5">
              <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-lime-400 font-bold">
                <Smartphone className="w-4 h-4" />
                <span>ใช้กล้องมือถือสแกน QR Code นี้เพื่อเช็คอินได้ทันที</span>
              </div>

              {qrDataUrl ? (
                <div className="inline-block p-2.5 bg-white rounded-2xl shadow-xl border-4 border-lime-400/60">
                  <img 
                    src={qrDataUrl} 
                    alt={`QR Code สำหรับ ${displayedMember.name}`}
                    className="w-48 h-48 mx-auto block rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center text-xs text-zinc-500">
                  กำลังสร้าง QR Code...
                </div>
              )}

              <div className="mt-3 font-mono font-black text-base tracking-widest text-lime-400">
                {displayedMember.id}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                ผูกกับสมาชิก: <strong className="text-white">{displayedMember.name}</strong>
              </div>

              {/* Download QR Button */}
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex justify-center">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-lime-400" />
                  <span>ดาวน์โหลดรูป QR Code บัตรสมาชิก</span>
                </button>
              </div>
            </div>

            {/* Member Statistics Overview */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl">
                <div className="text-[11px] text-zinc-400 font-medium">สิทธิ์ PT คงเหลือ</div>
                <div className="text-2xl font-black text-lime-400 mt-0.5">
                  {displayedMember.remainingPtSessions} <span className="text-xs text-zinc-500 font-normal">ครั้ง</span>
                </div>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl">
                <div className="text-[11px] text-zinc-400 font-medium">วันที่เข้าร่วม</div>
                <div className="text-sm font-bold text-white mt-1.5 font-mono">
                  {displayedMember.joinDate}
                </div>
              </div>
            </div>

            {/* Quick Check-in Button */}
            <button
              onClick={() => handlePerformCheckIn(displayedMember.id)}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 font-black hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-lime-400/25 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-zinc-950" />
              <span>กดเช็คอินด่วนให้ {displayedMember.name}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Staff / Scanner Kiosk Terminal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="kiosk-panel rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 mb-6 gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-lime-400" />
                  <span>เคาน์เตอร์เช็คอิน & สร้าง QR สมาชิกใหม่</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  เมื่อเพิ่มสมาชิกใหม่ หรือซื้อแพ็กเกจ ระบบจะสร้าง QR Code เฉพาะบุคคลให้สแกนได้ทันที
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-lime-400 text-zinc-950 hover:bg-lime-300 font-black text-xs flex items-center gap-1.5 shadow-md shadow-lime-400/20 cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4 text-zinc-950" />
                <span>+ เพิ่มสมาชิกใหม่ (สร้าง QR)</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Member Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  1. เลือกรายชื่อสมาชิกเพื่อแสดง QR Code / เช็คอิน:
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-lime-400 font-medium cursor-pointer"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.name} ({m.phone}) [PT คงเหลือ: {m.remainingPtSessions} ครั้ง]
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in Type Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  2. ประเภทการเข้าใช้บริการ:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Gym Entrance', label: 'เข้ายิมทั่วไป', desc: 'ออกกำลังกายอิสระ' },
                    { id: 'PT Session', label: 'ฝึกกับ PT (1-on-1)', desc: 'ตัดสิทธิ์คอร์ส 1 ครั้ง' },
                    { id: 'Group Class', label: 'เข้าคลาสกลุ่ม', desc: 'โยคะ / ซุมบ้า / ปั่นจักรยาน' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCheckInType(t.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        checkInType === t.id
                          ? 'bg-lime-400/15 border-lime-400 text-white shadow-lg shadow-lime-400/10'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className={`font-black text-sm ${checkInType === t.id ? 'text-lime-400' : 'text-zinc-200'}`}>
                        {t.label}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  <span>3. โซนที่เข้าใช้งาน:</span>
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  {zones.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handlePerformCheckIn()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 font-black hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2 text-base shadow-lg shadow-lime-400/20 cursor-pointer"
                >
                  <span>บันทึกการเช็คอินทันที</span>
                  <ArrowRight className="w-5 h-5 text-zinc-950" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Check-in Logs Table */}
          <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-lime-400" />
                <span>ประวัติการเช็คอินล่าสุด (Live Attendance)</span>
              </h3>
              <span className="text-xs text-zinc-400 font-mono">ทั้งหมด {checkIns.length} รายการ</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">เวลา</th>
                    <th className="py-2.5 px-3">สมาชิก</th>
                    <th className="py-2.5 px-3">ประเภท</th>
                    <th className="py-2.5 px-3">โซน</th>
                    <th className="py-2.5 px-3">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {checkIns.slice(0, 6).map((chk) => (
                    <tr key={chk.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-3 px-3 text-zinc-300 font-mono">{chk.timestamp.slice(11)}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{chk.memberName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{chk.memberId}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          chk.checkInType === 'PT Session' 
                            ? 'bg-violet-950/80 text-violet-300 border border-violet-500/30' 
                            : chk.checkInType === 'Group Class' 
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30' 
                            : 'bg-lime-950/80 text-lime-400 border border-lime-500/30'
                        }`}>
                          {chk.checkInType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400 max-w-[150px] truncate">{chk.zone}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-lime-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ผ่าน</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Register Member Modal with Camera Capture & File Upload */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-900 border-2 border-lime-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 glow-athletic">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-lime-400" />
                <span>เพิ่มสมาชิกใหม่ & สร้าง QR Code ประจำตัว</span>
              </h3>
              <button
                type="button"
                onClick={handleCloseRegisterModal}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-300 mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย แข็งแกร่ง"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="081-xxx-xxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">เลขประจำตัว ปชช.</label>
                  <input
                    type="text"
                    placeholder="1-xxxx-xxxxx-xx-x"
                    value={regIdCard}
                    onChange={(e) => setRegIdCard(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">ประเภทสมาชิก *</label>
                  <select
                    value={regType}
                    onChange={(e) => setRegType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 font-medium"
                  >
                    <option value="Active">Active Member (ทั่วไป)</option>
                    <option value="VIP">VIP Member (พรีเมียม)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">สิทธิ์ PT เริ่มต้น (ครั้ง)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={regPtSessions}
                    onChange={(e) => setRegPtSessions(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
              </div>

              {/* CAMERA & PHOTO UPLOAD SECTION */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-lime-400" />
                    <span>รูปถ่ายประจำตัวสมาชิก (ถ่ายจากกล้อง หรือ เลือกรูป)</span>
                  </label>
                  {regAvatar && (
                    <button
                      type="button"
                      onClick={() => setRegAvatar('')}
                      className="text-[11px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>รีเซ็ตรูป</span>
                    </button>
                  )}
                </div>

                {cameraError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {isCameraActive ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-lime-400 aspect-video flex items-center justify-center">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 border-2 border-dashed border-lime-400/50 m-6 rounded-2xl pointer-events-none flex items-center justify-center">
                        <div className="w-24 h-24 border border-lime-400/40 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-lime-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span>กล้องสดกำลังทำงาน</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 py-2.5 rounded-xl bg-lime-400 text-zinc-950 font-black hover:bg-lime-300 transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-lime-400/20 cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-zinc-950" />
                        <span>📸 กดถ่ายภาพตอนนี้</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition font-semibold text-xs cursor-pointer"
                      >
                        ปิดกล้อง
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    <div className="relative shrink-0">
                      <img
                        src={regAvatar || defaultPresetAvatar}
                        alt="Member Preview"
                        className={`w-20 h-20 rounded-2xl object-cover border-2 shadow-lg ${
                          regAvatar ? 'border-lime-400 ring-2 ring-lime-400/30' : 'border-zinc-700'
                        }`}
                      />
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 font-black hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-lime-400/15"
                        >
                          <Camera className="w-4 h-4 text-zinc-950" />
                          <span>เปิดกล้องถ่ายรูป</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-750 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer font-bold"
                        >
                          <Upload className="w-4 h-4 text-violet-400" />
                          <span>เลือกรูปจากเครื่อง</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-zinc-500">
                        {regAvatar 
                          ? '✅ อัปเดตรูปถ่ายสำเร็จ พร้อมสร้าง QR Code ประจำตัว' 
                          : 'กดเปิดกล้องเพื่อถ่ายภาพสด หรือเลือกไฟล์รูปจากเครื่อง'}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex justify-end gap-2.5 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleCloseRegisterModal}
                  className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-bold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 font-black hover:brightness-110 transition shadow-lg shadow-lime-400/25 cursor-pointer"
                >
                  ลงทะเบียนและสร้าง QR Code ทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
