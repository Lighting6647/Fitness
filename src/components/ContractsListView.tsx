import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  Eye, 
  X,
  Award
} from 'lucide-react';
import { CourseContract } from '../types';
import gsap from 'gsap';

interface ContractsListViewProps {
  contracts: CourseContract[];
}

export const ContractsListView: React.FC<ContractsListViewProps> = ({ contracts }) => {
  const [selectedContract, setSelectedContract] = useState<CourseContract | null>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contract-row',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [contracts]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header - Style 3 Lime & Violet */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-purple-950/40 to-zinc-950 border border-zinc-800 p-6 sm:p-8 no-print shadow-2xl glow-athletic">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-black tracking-wide uppercase mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>DIGITAL CONTRACT REGISTRY & ARCHIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              ระบบสัญญาซื้อขายคอร์สและข้อตกลงสมาชิก
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              จัดการสัญญาอิเล็กทรอนิกส์ (E-Contracts) ตรวจสอบลายมือชื่อดิจิทัล และพิมพ์สัญญาฉบับทางการ
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-lg">
            <Award className="w-8 h-8 text-lime-400 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-white uppercase tracking-wider">สัญญาทั้งหมดในระบบ</div>
              <div className="text-lime-400 font-mono text-base font-black">{contracts.length} ฉบับ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Table / Cards */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl no-print">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>ทะเบียนสัญญาซื้อขายคอร์สฟิตเนส</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">เลขที่สัญญา</th>
                <th className="py-3 px-3">ชื่อสมาชิกผู้สมัคร</th>
                <th className="py-3 px-3">คอร์สที่ซื้อ</th>
                <th className="py-3 px-3">ยอดชำระ</th>
                <th className="py-3 px-3">ระยะเวลาสัญญา</th>
                <th className="py-3 px-3">สถานะ</th>
                <th className="py-3 px-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {contracts.map((c) => (
                <tr key={c.id} className="contract-row hover:bg-zinc-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-lime-400">{c.contractNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{c.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-medium">{c.courseTitle}</div>
                    <div className="text-[10px] text-slate-500">{c.courseCategory}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">฿{c.price.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-400">
                    <div>{c.startDate} ถึง {c.endDate}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedContract(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ดูสัญญาฉบับเต็ม</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Viewer Modal / Print View */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none">
            {/* Action Bar for Modal (hidden in print) */}
            <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">สัญญาฉบับทางการ: {selectedContract.contractNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์สัญญา / บันทึก PDF</span>
                </button>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Contract Document Body */}
            <div className="p-8 sm:p-12 space-y-6 text-sm leading-relaxed font-sans max-h-[85vh] overflow-y-auto print:max-h-none print:p-6 print:overflow-visible">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-6">
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">
                  FITPULSE PRO FITNESS & HEALTH CLUB
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  สัญญาการซื้อขายคอร์สและข้อตกลงการใช้บริการฟิตเนส
                </h2>
                <div className="text-xs text-slate-600 mt-1">
                  (FITNESS MEMBERSHIP & PERSONAL TRAINING SERVICE AGREEMENT)
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono font-bold text-slate-700">
                  <span>เลขที่สัญญา: {selectedContract.contractNumber}</span>
                  <span>•</span>
                  <span>วันที่ทำสัญญา: {selectedContract.signedDate}</span>
                </div>
              </div>

              {/* Parties */}
              <div className="space-y-3">
                <p>
                  สัญญานี้ทำขึ้นระหว่าง <strong>บริษัท ฟิตพัลส์ โปร ฟิตเนส คลับ จำกัด</strong> สำนักงานตั้งอยู่เลขที่ 88/1 อาคารฟิตเนสพลาซ่า ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร (ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>"สถานประกอบการ"</strong>) ฝ่ายหนึ่ง กับ
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">ชื่อ-นามสกุล สมาชิก:</span>{' '}
                    <strong className="text-slate-900">{selectedContract.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">เลขประจำตัวประชาชน:</span>{' '}
                    <strong className="text-slate-900 font-mono">{selectedContract.customerIdCard}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">เบอร์โทรศัพท์:</span>{' '}
                    <strong className="text-slate-900">{selectedContract.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">ผู้ติดต่อฉุกเฉิน:</span>{' '}
                    <strong className="text-slate-900">{selectedContract.emergencyContact} ({selectedContract.emergencyPhone})</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">ที่อยู่ตามบัตร:</span>{' '}
                    <span className="text-slate-800">{selectedContract.customerAddress}</span>
                  </div>
                </div>
                <p>
                  (ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>"สมาชิก"</strong>) อีกฝ่ายหนึ่ง คู่สัญญาทั้งสองฝ่ายได้ตกลงทำสัญญากันโดยมีข้อความดังต่อไปนี้:
                </p>
              </div>

              {/* Clause 1: Course Scope */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">ข้อ 1. รายละเอียดคอร์สและการให้บริการ</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">คอร์ส / โปรแกรม:</span>
                    <strong className="text-slate-900">{selectedContract.courseTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">หมวดหมู่:</span>
                    <span className="text-slate-900">{selectedContract.courseCategory}</span>
                  </div>
                  {selectedContract.sessionsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">จำนวนครั้งการฝึกสอน (Sessions):</span>
                      <strong className="text-slate-900">{selectedContract.sessionsTotal} ครั้ง</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">ระยะเวลาเริ่มต้นสัญญา:</span>
                    <span className="text-slate-900">{selectedContract.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ระยะเวลาสิ้นสุดสัญญา:</span>
                    <span className="text-slate-900 font-bold">{selectedContract.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Clause 2: Payment */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">ข้อ 2. ค่าบริการและการชำระเงิน</h4>
                <p className="text-xs">
                  สมาชิกตกลงชำระค่าบริการสำหรับคอร์สดังกล่าว เป็นจำนวนเงินทั้งสิ้น{' '}
                  <strong className="text-base text-slate-900">฿{selectedContract.price.toLocaleString()} บาท</strong>{' '}
                  (รวมภาษีมูลค่าเพิ่มแล้ว) ผ่านช่องทาง <strong>{selectedContract.paymentMethod}</strong> โดยสถานประกอบการได้รับชำระเงินเรียบร้อยแล้ว ณ วันลงนามในสัญญานี้
                </p>
              </div>

              {/* Clause 3: Terms */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900">ข้อ 3. ข้อกำหนดและเงื่อนไขความปลอดภัย</h4>
                <p>3.1 สมาชิกยืนยันว่ามีสุขภาพสมบูรณ์พร้อมสำหรับการออกกำลังกาย และได้แจ้งข้อจำกัดทางกายภาพแก่โค้ชเรียบร้อยแล้ว</p>
                <p>3.2 สัญญานี้มีอายุถึงวันที่ {selectedContract.endDate} หากสมาชิกไม่ได้ใช้สิทธิ์จนครบตามกำหนด จะถือว่าสละสิทธิ์ในส่วนที่เหลือ</p>
                <p>3.3 การลงลายมือชื่อดิจิทัลด้านล่างนี้ถือเป็นหลักฐานการยินยอมรับเงื่อนไขทุกประการตามกฎหมาย</p>
              </div>

              {/* Signatures Section */}
              <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8">
                {/* Member Signature */}
                <div className="text-center space-y-2">
                  <div className="text-xs font-semibold text-slate-500">ลงชื่อ สมาชิก (ผู้ซื้อคอร์ส)</div>
                  <div className="h-20 flex items-center justify-center border-b border-slate-400 pb-1">
                    {selectedContract.signatureImage && (
                      <img 
                        src={selectedContract.signatureImage} 
                        alt="Customer Signature" 
                        className="max-h-16 max-w-[200px] object-contain"
                      />
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900">({selectedContract.customerName})</div>
                  <div className="text-[10px] text-slate-500 font-mono">วันที่ {selectedContract.signedDate}</div>
                </div>

                {/* Gym Authorized Representative */}
                <div className="text-center space-y-2 relative">
                  <div className="text-xs font-semibold text-slate-500">ลงชื่อ ตัวแทนสถานประกอบการฟิตเนส</div>
                  <div className="h-20 flex items-center justify-center border-b border-slate-400 pb-1 relative">
                    <img 
                      src={selectedContract.trainerSignature} 
                      alt="Trainer Signature" 
                      className="max-h-16 max-w-[180px] object-contain"
                    />
                    {/* Official Stamp */}
                    <div className="absolute right-0 top-0 w-16 h-16 rounded-full border-2 border-rose-600/70 text-rose-600 font-bold flex flex-col items-center justify-center rotate-[-15deg] pointer-events-none text-[8px] uppercase tracking-tighter opacity-80">
                      <span>FITPULSE</span>
                      <span className="font-black text-[9px]">CERTIFIED</span>
                      <span>OFFICIAL</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-900">(นายอเล็กซ์ มั่นคง • หัวหน้าเทรนเนอร์)</div>
                  <div className="text-[10px] text-slate-500">บจก. ฟิตพัลส์ โปร ฟิตเนส คลับ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
