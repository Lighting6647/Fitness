import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  FileCheck, 
  PenTool, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  RotateCcw, 
  Check, 
  Calendar,
  AlertTriangle
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
  // Form fields
  const [customerName, setCustomerName] = useState(currentMember.name);
  const [customerIdCard, setCustomerIdCard] = useState(currentMember.idCard);
  const [customerPhone, setCustomerPhone] = useState(currentMember.phone);
  const [customerAddress, setCustomerAddress] = useState('88/12 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110');
  const [emergencyContact, setEmergencyContact] = useState('คุณสมศรี รักสุขภาพ (ความสัมพันธ์: ครอบครัว)');
  const [emergencyPhone, setEmergencyPhone] = useState('089-111-2233');
  const [paymentMethod, setPaymentMethod] = useState<'PromptPay QR' | 'Credit Card' | 'Cash' | 'Bank Transfer'>('PromptPay QR');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notes, setNotes] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set up signature canvas
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
    if (!termsAccepted) {
      alert('กรุณากดยินยอมรับข้อกำหนดและเงื่อนไขของสัญญา');
      return;
    }
    if (!hasSigned) {
      alert('กรุณาลงลายมือชื่อดิจิทัลในช่องลายเซ็น');
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
      customerAddress: customerAddress,
      emergencyContact: emergencyContact,
      emergencyPhone: emergencyPhone,
      signedDate: `${startDateStr} ${today.toTimeString().slice(0, 5)}`,
      startDate: startDateStr,
      endDate: endDateStr,
      sessionsTotal: selectedCourse.sessions || 0,
      signatureImage: signatureImage,
      trainerSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10,40 Q50,10 90,40 T170,25" fill="none" stroke="%233b82f6" stroke-width="3"/></svg>',
      status: 'Active',
      termsAccepted: true,
      notes: notes
    };

    onSaveContract(newContract);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>สัญญาการซื้อขายคอร์สและสมัครสมาชิก</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  E-CONTRACT
                </span>
              </h2>
              <p className="text-xs text-slate-400">FITPULSE PRO FITNESS CLUB MEMBERSHIP AGREEMENT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Selected Course Summary */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                  {selectedCourse.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedCourse.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedCourse.description}</p>
                {selectedCourse.sessions && (
                  <div className="text-xs text-slate-300 mt-2 font-medium">
                    ⚡ สิทธิ์การฝึกสอน: <strong>{selectedCourse.sessions}</strong> ครั้ง | ระยะเวลา: {selectedCourse.durationMonths} เดือน
                  </div>
                )}
              </div>
              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 shrink-0">
                <div className="text-xs text-slate-500 line-through">฿{selectedCourse.originalPrice.toLocaleString()}</div>
                <div className="text-2xl font-black text-emerald-400">
                  ฿{selectedCourse.price.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">รวมภาษีมูลค่าเพิ่มแล้ว</div>
              </div>
            </div>
          </div>

          {/* Section 2: Customer Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1. ข้อมูลผู้สมัคร / สมาชิกคู่สัญญา</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">ชื่อ-นามสกุล (ผู้สมัคร) *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">เลขประจำตัวประชาชน (13 หลัก) *</label>
                <input
                  type="text"
                  required
                  value={customerIdCard}
                  onChange={(e) => setCustomerIdCard(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">บุคคลติดต่อกรณีฉุกเฉิน *</label>
                <input
                  type="text"
                  required
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">ที่อยู่ตามบัตรประชาชน / ปัจจุบัน *</label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>2. วิธีการชำระเงิน</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'PromptPay QR', label: 'QR พร้อมเพย์', icon: QrCode },
                { id: 'Credit Card', label: 'บัตรเครดิต/เดบิต', icon: CreditCard },
                { id: 'Bank Transfer', label: 'โอนเงินผ่านธนาคาร', icon: Check },
                { id: 'Cash', label: 'เงินสดที่เคาน์เตอร์', icon: FileCheck },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3 rounded-xl border text-center transition ${
                      paymentMethod === p.id 
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1.5 ${paymentMethod === p.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="text-xs font-semibold">{p.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Legal Terms & Health Declaration */}
          <div className="space-y-3 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>ข้อกำหนดและเงื่อนไขการใช้บริการสัญญาฟิตเนส (Terms & Conditions)</span>
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-2 pr-2 text-slate-400 text-[11px] leading-5">
              <p>1. สมาชิกสัญญาว่าจะปฏิบัติตามกฎระเบียบความปลอดภัย การใช้อุปกรณ์ และคำแนะนำของเทรนเนอร์ประจำฟิตเนสอย่างเคร่งครัด</p>
              <p>2. การยกเลิกหรือเปลี่ยนแปลงตารางฝึกกับเทรนเนอร์ (PT) ต้องแจ้งล่วงหน้าไม่น้อยกว่า 12 ชั่วโมง มิฉะนั้นจะถือว่าเป็นการใช้สิทธิ์ในครั้งนั้นโดยสมบูรณ์</p>
              <p>3. สมาชิกรับรองว่าตนเองมีสุขภาพแข็งแรงพร้อมสำหรับการออกกำลังกาย และไม่มีโรคประจำตัวที่เป็นอันตรายร้ายแรงต่อการใช้กำลังหนัก</p>
              <p>4. คอร์สที่ซื้อมีอายุการใช้งานตามระยะเวลาที่กำหนดในสัญญา หากพ้นกำหนดระยะเวลา สิทธิ์ที่ไม่ได้ใช้งานจะไม่สามารถขอคืนเงินหรือโอนให้บุคคลอื่นได้ เว้นแต่ได้รับอนุมัติเป็นลายลักษณ์อักษรจากฝ่ายบริหาร</p>
              <p>5. ลายมือชื่ออิเล็กทรอนิกส์ในสัญญานี้มีผลผูกพันตามพระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544</p>
            </div>

            <label className="flex items-start gap-3 mt-4 pt-3 border-t border-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium">
                ข้าพเจ้าได้อ่าน เข้าใจ และตกลงยอมรับข้อกำหนด เงื่อนไข และสัญญาการใช้บริการของฟิตเนสทุกประการ
              </span>
            </label>
          </div>

          {/* Section 5: Digital Signature Pad */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-emerald-400" />
                <span>ลงลายมือชื่อดิจิทัลของผู้สมัคร (เซ็นชื่อในกรอบด้านล่าง) *</span>
              </label>
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างลายเซ็น</span>
              </button>
            </div>

            <div className="relative border-2 border-dashed border-zinc-700 hover:border-lime-400 rounded-2xl bg-zinc-950 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={560}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 cursor-crosshair touch-none"
              />
              {!hasSigned && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-zinc-600 gap-1 text-xs">
                  <PenTool className="w-6 h-6 stroke-1 text-lime-400" />
                  <span>ลากเมาส์ หรือใช้นิ้วมือวาดลายเซ็นที่นี่ (หมึกนีออน Lime)</span>
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

          {/* Modal Actions */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-bold transition uppercase tracking-wider"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 font-black hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-lime-400/25 text-xs flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-zinc-950" />
              <span>ยืนยันการทำสัญญาและชำระเงิน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
