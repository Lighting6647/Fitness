import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  FileCheck, 
  PenTool, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  RotateCcw, 
  Check
} from 'lucide-react';
import { Course, Member, CourseContract } from '../types';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course;
  currentMember: Member;
  onSaveContract: (contract: CourseContract) => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  currentMember,
  onSaveContract,
}) => {
  const [customerName, setCustomerName] = useState(currentMember.name);
  const [customerIdCard, setCustomerIdCard] = useState(currentMember.idCard);
  const [customerPhone, setCustomerPhone] = useState(currentMember.phone);
  const [paymentMethod, setPaymentMethod] = useState<'PromptPay QR' | 'Credit Card' | 'Cash' | 'Bank Transfer'>('PromptPay QR');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.strokeStyle = '#a3e635';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
          }
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSigned) {
      alert('กรุณาลงลายมือชื่อดิจิทัลในช่องลายเซ็นก่อนยืนยัน');
      return;
    }

    const canvas = canvasRef.current;
    const signatureImage = canvas ? canvas.toDataURL('image/png') : '';

    const today = new Date();
    const startDateStr = today.toISOString().slice(0, 10);
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + (selectedCourse.durationMonths || 3));
    const endDateStr = endDate.toISOString().slice(0, 10);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const contractNumber = `CTR-2026-${randomSuffix}`;

    const newContract: CourseContract = {
      id: `ctr-${Date.now()}`,
      contractNumber: contractNumber,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      courseCategory: selectedCourse.category,
      price: selectedCourse.price,
      paymentMethod: paymentMethod,
      customerName: customerName,
      customerIdCard: customerIdCard,
      customerPhone: customerPhone,
      customerAddress: 'กรุงเทพมหานคร',
      emergencyContact: 'ผู้ติดต่อฉุกเฉินของสมาชิก',
      emergencyPhone: customerPhone,
      signedDate: startDateStr,
      startDate: startDateStr,
      endDate: endDateStr,
      sessionsTotal: selectedCourse.sessions || 0,
      signatureImage: signatureImage,
      trainerSignature: selectedCourse.trainerName || 'FitPulse Pro Admin',
      status: 'Active',
      termsAccepted: true,
      notes: '',
    };

    onSaveContract(newContract);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border-2 border-lime-400/40 rounded-3xl shadow-2xl overflow-hidden my-6 glow-athletic">
        {/* Header */}
        <div className="bg-zinc-950 p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/15 text-lime-400 flex items-center justify-center border border-lime-400/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                ทำสัญญาซื้อคอร์ส & สมัครสมาชิกด่วน
              </h2>
              <p className="text-xs text-zinc-400">กรอกข้อมูล ชำระเงิน และเซ็นชื่อในขั้นตอนเดียว</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Course Summary Box */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-lime-400 font-bold uppercase">{selectedCourse.category}</span>
              <h3 className="text-base font-black text-white">{selectedCourse.title}</h3>
              <div className="text-xs text-zinc-400 mt-0.5">
                {selectedCourse.sessions ? `ฝึกสอน ${selectedCourse.sessions} ครั้ง • ` : ''}
                ระยะเวลา {selectedCourse.durationMonths || 3} เดือน
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-xs text-zinc-500 line-through font-mono">฿{selectedCourse.originalPrice.toLocaleString()}</div>
              <div className="text-2xl font-black text-lime-400 font-mono">฿{selectedCourse.price.toLocaleString()}</div>
            </div>
          </div>

          {/* Step 1: Customer Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>1. ข้อมูลผู้สมัคร</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-400 mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-400 mb-1">เบอร์โทรศัพท์ *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-400 mb-1">เลขบัตรประชาชน</label>
                <input
                  type="text"
                  value={customerIdCard}
                  onChange={(e) => setCustomerIdCard(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-lime-400" />
              <span>2. เลือกวิธีชำระเงิน</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'PromptPay QR', label: 'QR พร้อมเพย์', icon: QrCode },
                { id: 'Credit Card', label: 'บัตรเครดิต', icon: CreditCard },
                { id: 'Bank Transfer', label: 'โอนธนาคาร', icon: Check },
                { id: 'Cash', label: 'เงินสด', icon: FileCheck },
              ].map((p) => {
                const Icon = p.icon;
                const active = paymentMethod === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      active 
                        ? 'bg-lime-400/15 border-lime-400 text-white shadow-sm' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${active ? 'text-lime-400' : 'text-zinc-500'}`} />
                    <div className="text-xs font-bold">{p.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Digital Signature Pad */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-lime-400" />
                <span>3. เซ็นชื่อผู้สมัครในกรอบด้านล่าง *</span>
              </label>
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างลายเซ็น</span>
              </button>
            </div>

            <div className="relative border-2 border-dashed border-zinc-700 hover:border-lime-400 rounded-2xl bg-zinc-950 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={520}
                height={130}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-32 cursor-crosshair touch-none"
              />
              {!hasSigned && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-zinc-500 gap-1 text-xs">
                  <PenTool className="w-5 h-5 stroke-1 text-lime-400" />
                  <span>ใช้นิ้วหรือเมาส์วาดลายเซ็นที่นี่</span>
                </div>
              )}
            </div>
            {hasSigned && (
              <div className="text-[11px] text-lime-400 flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>บันทึกลายเซ็นดิจิทัลเรียบร้อยแล้ว</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-bold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 font-black hover:brightness-110 transition shadow-lg shadow-lime-400/25 text-xs flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-zinc-950" />
              <span>ยืนยันทำสัญญาและชำระเงิน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
