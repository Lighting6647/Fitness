import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  Printer, 
  Plus, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  QrCode, 
  FileText, 
  X, 
  Users, 
  Search,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Transaction, Expense, Member } from '../types';
import gsap from 'gsap';

interface FinanceViewProps {
  transactions: Transaction[];
  expenses: Expense[];
  members: Member[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  transactions,
  expenses,
  members,
  onAddExpense,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'commission'>('income');

  // GSAP animation
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.finance-kpi',
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  // Expense form state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<Expense['category']>('Utilities');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expenseNote, setExpenseNote] = useState('');

  // Calculations
  const totalRevenue = transactions.reduce((sum, tx) => tx.status === 'Completed' ? sum + tx.amount : sum, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalCommission = transactions.reduce((sum, tx) => sum + (tx.trainerCommission || 0), 0);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    onAddExpense({
      title: expenseTitle,
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: new Date().toISOString().slice(0, 10),
      note: expenseNote
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseNote('');
    setIsExpenseModalOpen(false);
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Gym Finance & Invoicing System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ระบบบัญชีและการเงินฟิตเนส (Finance & Cashflow)
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              รายงานรายรับ-รายจ่าย ตรวจสอบธุรกรรม ออกใบเสร็จรับเงิน/ใบกำกับภาษี และคำนวณค่าคอมมิชชั่นเทรนเนอร์
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-rose-400" />
              <span>บันทึกรายจ่ายยิม</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 no-print">
        {/* Card 1: Total Revenue */}
        <div className="finance-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-xl hover:border-lime-400 transition">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span>รายรับรวม (Total Revenue)</span>
            <div className="p-2.5 rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 font-mono">
            ฿{totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-lime-400 mt-2 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>จากสัญญาและคอร์ส {transactions.length} รายการ</span>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="finance-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-xl hover:border-rose-400 transition">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span>รายจ่ายดำเนินงาน (Expenses)</span>
            <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400 mt-3 font-mono">
            ฿{totalExpenses.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            ค่าไฟ, ซ่อมบำรุง, อุปกรณ์ ({expenses.length} รายการ)
          </div>
        </div>

        {/* Card 3: Net Profit */}
        <div className="finance-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-xl hover:border-violet-400 transition">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span>กำไรสุทธิ (Net Operating Profit)</span>
            <div className="p-2.5 rounded-2xl bg-violet-500/15 text-violet-400 border border-violet-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-violet-400 mt-3 font-mono">
            ฿{netProfit.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400 mt-2 font-medium">
            อัตรากำไรขั้นต้น: {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%
          </div>
        </div>

        {/* Card 4: Trainer Commission */}
        <div className="finance-kpi bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-xl hover:border-lime-400 transition">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span>คอมมิชชั่นเทรนเนอร์ (Commissions)</span>
            <div className="p-2.5 rounded-2xl bg-lime-400/15 text-lime-400 border border-lime-400/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-lime-400 mt-3 font-mono">
            ฿{totalCommission.toLocaleString()}
          </div>
          <div className="text-xs text-lime-300 mt-2 font-semibold">
            ส่วนแบ่งจากคอร์ส PT (30%)
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'income' 
                ? 'bg-emerald-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            รายการรายรับ & ใบเสร็จ ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'expense' 
                ? 'bg-rose-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            รายจ่ายดำเนินงาน ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'commission' 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ค่าคอมมิชชั่นโค้ช
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่ใบเสร็จ หรือชื่อสมาชิก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Tab Content 1: Income & Invoices */}
      {activeTab === 'income' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl no-print">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>ทะเบียนใบเสร็จรับเงินและการชำระเงิน</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">ทั้งหมด {filteredTransactions.length} รายการ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">เลขที่ใบเสร็จ</th>
                  <th className="py-3 px-3">วันที่ชำระ</th>
                  <th className="py-3 px-3">สมาชิก</th>
                  <th className="py-3 px-3">คอร์ส / รายการ</th>
                  <th className="py-3 px-3">ช่องทาง</th>
                  <th className="py-3 px-3">ยอดเงิน</th>
                  <th className="py-3 px-3">สถานะ</th>
                  <th className="py-3 px-3 text-right">ใบเสร็จ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{tx.invoiceNumber}</td>
                    <td className="py-3.5 px-3 text-slate-300 font-mono">{tx.paymentDate}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white">{tx.memberName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{tx.memberId}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-200 max-w-[200px] truncate">{tx.courseTitle}</td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                        {tx.paymentMethod === 'PromptPay QR' ? <QrCode className="w-3 h-3 text-emerald-400" /> : <CreditCard className="w-3 h-3 text-cyan-400" />}
                        <span>{tx.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                      ฿{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>สำเร็จ</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedTransaction(tx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold transition text-xs"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>ดูใบเสร็จ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Expenses */}
      {activeTab === 'expense' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl no-print">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>บันทึกค่าใช้จ่ายยิม (Operating Expenses)</span>
            </h3>
            <span className="text-xs text-rose-400 font-mono font-bold">รวม ฿{totalExpenses.toLocaleString()}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">วันที่</th>
                  <th className="py-3 px-3">รายการค่าใช้จ่าย</th>
                  <th className="py-3 px-3">หมวดหมู่</th>
                  <th className="py-3 px-3">หมายเหตุ</th>
                  <th className="py-3 px-3 text-right">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 text-slate-300 font-mono">{exp.date}</td>
                    <td className="py-3.5 px-3 font-semibold text-white">{exp.title}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">{exp.note || '-'}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-rose-400 text-sm">
                      -฿{exp.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Commissions */}
      {activeTab === 'commission' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl no-print">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>ส่วนแบ่งและค่าคอมมิชชั่นเทรนเนอร์ (Trainer Commissions)</span>
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold">รวม ฿{totalCommission.toLocaleString()}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">เทรนเนอร์</th>
                  <th className="py-3 px-3">คอร์สที่สอน</th>
                  <th className="py-3 px-3">สมาชิกผู้ซื้อ</th>
                  <th className="py-3 px-3">ยอดคอร์ส</th>
                  <th className="py-3 px-3 text-right">คอมมิชชั่น (30%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.filter(tx => tx.trainerCommission).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 font-bold text-white">{tx.trainerName}</td>
                    <td className="py-3.5 px-3 text-slate-300">{tx.courseTitle}</td>
                    <td className="py-3.5 px-3 text-slate-400">{tx.memberName}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">฿{tx.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400 text-sm">
                      ฿{tx.trainerCommission?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Receipt & Tax Invoice Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none">
            {/* Top Bar (Hidden in Print) */}
            <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">ใบเสร็จรับเงิน: {selectedTransaction.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์ใบเสร็จ / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-8 sm:p-10 space-y-6 text-xs font-sans print:p-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight">FITPULSE PRO FITNESS CLUB</h2>
                  <div className="text-[11px] text-slate-600 mt-1">
                    บริษัท ฟิตพัลส์ โปร ฟิตเนส คลับ จำกัด<br />
                    88/1 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110<br />
                    เลขประจำตัวผู้เสียภาษี: 0-1055-66012-34-5 (สำนักงานใหญ่)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-950">ใบเสร็จรับเงิน</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">RECEIPT / TAX INVOICE</div>
                  <div className="mt-2 font-mono text-slate-800">
                    <div><strong>เลขที่:</strong> {selectedTransaction.invoiceNumber}</div>
                    <div><strong>วันที่:</strong> {selectedTransaction.paymentDate}</div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold mb-1">ข้อมูลลูกค้า (Customer Details):</div>
                <div className="font-bold text-slate-900 text-sm">{selectedTransaction.memberName}</div>
                <div className="text-slate-600 font-mono mt-0.5">รหัสสมาชิก: {selectedTransaction.memberId}</div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-600">
                    <th className="py-2.5">ลำดับ</th>
                    <th className="py-2.5">รายการ</th>
                    <th className="py-2.5 text-right">จำนวนเงิน (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-mono">1</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{selectedTransaction.courseTitle}</div>
                      <div className="text-[10px] text-slate-500">ชำระผ่าน: {selectedTransaction.paymentMethod}</div>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      ฿{selectedTransaction.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="border-t-2 border-slate-900 pt-4 space-y-1.5 text-right font-mono">
                <div className="text-slate-600 flex justify-between">
                  <span>มูลค่าสินค้าก่อนภาษี:</span>
                  <span>฿{Math.round(selectedTransaction.amount / 1.07).toLocaleString()}</span>
                </div>
                <div className="text-slate-600 flex justify-between">
                  <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                  <span>฿{(selectedTransaction.amount - Math.round(selectedTransaction.amount / 1.07)).toLocaleString()}</span>
                </div>
                <div className="text-base font-black text-slate-950 flex justify-between border-t border-slate-200 pt-2">
                  <span>จำนวนเงินรวมทั้งสิ้น:</span>
                  <span>฿{selectedTransaction.amount.toLocaleString()} บาท</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="h-12 flex items-center justify-center border-b border-slate-300">
                    <span className="font-mono text-emerald-600 font-bold text-xs">✓ PAID & VERIFIED</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5">สถานะการชำระเงิน</div>
                </div>
                <div>
                  <div className="h-12 flex items-center justify-center border-b border-slate-300">
                    <span className="font-serif italic font-bold text-slate-800">FitPulse Cashier</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5">ผู้รับเงิน / ออกใบเสร็จ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-400" />
                <span>บันทึกรายจ่ายยิมใหม่</span>
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ชื่อรายการค่าใช้จ่าย *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ค่าไฟ, ซ่อมแซมลู่วิ่ง, โฆษณา"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">หมวดหมู่ค่าใช้จ่าย *</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Utilities">ค่าน้ำ/ค่าไฟ (Utilities)</option>
                    <option value="Maintenance">ซ่อมบำรุง (Maintenance)</option>
                    <option value="Equipment">อุปกรณ์ยิม (Equipment)</option>
                    <option value="Marketing">การตลาด/โฆษณา (Marketing)</option>
                    <option value="Staff Salary">เงินเดือน/เบี้ยเลี้ยง (Staff)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">จำนวนเงิน (บาท) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">หมายเหตุเพิ่มเติม</label>
                <input
                  type="text"
                  placeholder="รายละเอียดใบเสร็จ หรือชื่อผู้รับเงิน"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-500/20"
                >
                  บันทึกรายจ่าย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
