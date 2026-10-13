import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Member, 
  Course, 
  CourseContract, 
  CheckInRecord, 
  Transaction, 
  Expense, 
  CrmLead, 
  CrmInteraction 
} from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_COURSES, 
  INITIAL_CONTRACTS, 
  INITIAL_CHECKINS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_EXPENSES, 
  INITIAL_CRM_LEADS 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { CheckInView } from './components/CheckInView';
import { CourseCatalogView } from './components/CourseCatalogView';
import { ContractModal } from './components/ContractModal';
import { ContractsListView } from './components/ContractsListView';
import { FinanceView } from './components/FinanceView';
import { CrmView } from './components/CrmView';
import { CheckCircle2, QrCode, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // State with LocalStorage fallbacks
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('fitpulse_members');
    let list: Member[] = saved ? JSON.parse(saved) : [...INITIAL_MEMBERS];

    // Ensure all initial members (like MB-1004) exist
    INITIAL_MEMBERS.forEach(initM => {
      if (!list.some(m => m.id === initM.id || m.name === initM.name)) {
        list.push(initM);
      }
    });

    // Reconcile any contract customer
    const savedContracts = localStorage.getItem('fitpulse_contracts');
    if (savedContracts) {
      try {
        const parsedContracts: CourseContract[] = JSON.parse(savedContracts);
        parsedContracts.forEach((c) => {
          if (!list.some(m => m.name === c.customerName || m.phone === c.customerPhone)) {
            const nextNum = 1000 + list.length + 1;
            list.push({
              id: `MB-${nextNum}`,
              name: c.customerName,
              phone: c.customerPhone,
              email: `${c.customerName.replace(/\s+/g, '').toLowerCase()}@gmail.com`,
              idCard: c.customerIdCard || '1-xxxx-xxxxx-xx-x',
              memberType: 'Active',
              qrCodeUrl: `MB-${nextNum}`,
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
              remainingPtSessions: c.sessionsTotal || 0,
              activeContractId: c.id,
              joinDate: c.startDate || '2026-10-12',
            });
          }
        });
      } catch (e) {}
    }

    return list;
  });

  const [currentMemberId, setCurrentMemberId] = useState<string>(() => {
    return members[0]?.id || 'MB-1001';
  });

  const [courses] = useState<Course[]>(INITIAL_COURSES);

  const [contracts, setContracts] = useState<CourseContract[]>(() => {
    const saved = localStorage.getItem('fitpulse_contracts');
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
  });

  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(() => {
    const saved = localStorage.getItem('fitpulse_checkins');
    return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fitpulse_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('fitpulse_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [crmLeads, setCrmLeads] = useState<CrmLead[]>(() => {
    const saved = localStorage.getItem('fitpulse_crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_CRM_LEADS;
  });

  const [gymOccupancy, setGymOccupancy] = useState<number>(28);

  // Contract Modal state
  const [selectedCourseForContract, setSelectedCourseForContract] = useState<Course | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Scanned QR Confirmation Modal state
  const [qrScanModalData, setQrScanModalData] = useState<{ member: Member; time: string; message: string } | null>(null);

  // Handle QR Code Scan from Smartphone Camera (?checkin=MB-xxxx&name=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scannedId = params.get('checkin');
    if (scannedId) {
      const scannedName = params.get('name') || 'สมาชิกฟิตเนส';
      const scannedPhone = params.get('phone') || '081-xxx-xxxx';
      const scannedType = (params.get('type') === 'VIP' ? 'VIP' : 'Active') as 'Active' | 'VIP';
      const scannedPt = Number(params.get('pt')) || 0;
      const scannedJoin = params.get('join') || new Date().toISOString().slice(0, 10);

      let foundMember = members.find(m => m.id === scannedId);
      if (!foundMember) {
        foundMember = {
          id: scannedId,
          name: scannedName,
          phone: scannedPhone,
          email: `${scannedId.toLowerCase()}@fitpulse.com`,
          idCard: '1-xxxx-xxxxx-xx-x',
          memberType: scannedType,
          qrCodeUrl: scannedId,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          remainingPtSessions: scannedPt,
          joinDate: scannedJoin,
        };
        setMembers(prev => [...prev, foundMember!]);
      }

      const now = new Date();
      const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
      const newCheckIn: CheckInRecord = {
        id: `chk-${Date.now()}`,
        memberId: foundMember.id,
        memberName: foundMember.name,
        timestamp: timeStr,
        checkInType: 'Gym Entrance',
        zone: 'Zone A - Free Weights & PT Cage',
        status: 'Success',
        notes: 'สแกนเช็คอินผ่าน QR Code ด้วยกล้องมือถือสำเร็จ',
      };

      setCheckIns(prev => [newCheckIn, ...prev]);
      setGymOccupancy(prev => Math.min(80, prev + 1));
      setCurrentMemberId(foundMember.id);
      setActiveTab('checkin');
      setQrScanModalData({
        member: foundMember,
        time: timeStr,
        message: 'สแกน QR Code เช็คอินเข้ายิมสำเร็จ!'
      });

      // Clean URL query parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('fitpulse_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('fitpulse_contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('fitpulse_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('fitpulse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fitpulse_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('fitpulse_crm_leads', JSON.stringify(crmLeads));
  }, [crmLeads]);

  const currentMember = members.find(m => m.id === currentMemberId) || members[0];

  // Check-in Handler
  const handleCheckIn = (record: Omit<CheckInRecord, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
    const newId = `chk-${Date.now()}`;

    // Target member
    const targetMember = members.find(m => m.id === record.memberId);
    let updatedNote = record.notes;

    if (record.checkInType === 'PT Session' && targetMember) {
      if (targetMember.remainingPtSessions <= 0) {
        return {
          success: false,
          message: `ไม่สามารถเช็คอิน PT ได้: ${targetMember.name} มีสิทธิ์คงเหลือ 0 ครั้ง (กรุณาซื้อคอร์สเพิ่มเติม)`
        };
      }

      // Deduct 1 session
      const updatedMembers = members.map(m => {
        if (m.id === targetMember.id) {
          return {
            ...m,
            remainingPtSessions: Math.max(0, m.remainingPtSessions - 1)
          };
        }
        return m;
      });
      setMembers(updatedMembers);
      updatedNote = `ใช้สิทธิ์ PT เรียบร้อย (คงเหลือ ${targetMember.remainingPtSessions - 1} ครั้ง)`;
    }

    const newRecord: CheckInRecord = {
      ...record,
      id: newId,
      timestamp: timeStr,
      notes: updatedNote
    };

    setCheckIns([newRecord, ...checkIns]);
    setGymOccupancy(prev => Math.min(80, prev + 1));

    return {
      success: true,
      message: `เช็คอินสำเร็จ! สมาชิก: ${record.memberName} (${record.checkInType})`
    };
  };

  // Register Member directly
  const handleRegisterMember = (newMemberData: Omit<Member, 'id' | 'qrCodeUrl'>): Member => {
    const nextNum = 1000 + members.length + 1;
    const newId = `MB-${nextNum}`;
    const newMember: Member = {
      ...newMemberData,
      id: newId,
      qrCodeUrl: newId,
    };

    const updated = [...members, newMember];
    setMembers(updated);
    setCurrentMemberId(newId);

    // Also add to CRM Leads so both lists are synchronized
    const newLead: CrmLead = {
      id: `crm-${Date.now()}`,
      name: newMember.name,
      phone: newMember.phone,
      email: newMember.email,
      stage: newMember.memberType === 'VIP' ? 'VIP' : 'Active',
      assignedTrainer: 'Coach Alex',
      interestCourse: 'General Fitness',
      lastContactDate: new Date().toISOString().slice(0, 10),
      joinDate: newMember.joinDate,
      avatar: newMember.avatar,
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          type: 'In-Person',
          staffName: 'Reception',
          note: `ลงทะเบียนสมาชิกใหม่สำเร็จ (รหัส ${newId})`
        }
      ]
    };
    setCrmLeads([newLead, ...crmLeads]);

    return newMember;
  };

  // Open Contract Modal for a course
  const handleSelectCourseForContract = (course: Course) => {
    setSelectedCourseForContract(course);
    setIsContractModalOpen(true);
  };

  // Save Signed Contract
  const handleSaveContract = (contract: CourseContract) => {
    setContracts([contract, ...contracts]);

    // Check if customer exists in members list by name or phone
    const existingMember = members.find(m => m.name === contract.customerName || m.phone === contract.customerPhone);
    let targetMemberId = currentMember.id;

    if (existingMember) {
      targetMemberId = existingMember.id;
      const updatedMembers = members.map(m => {
        if (m.id === existingMember.id) {
          return {
            ...m,
            remainingPtSessions: m.remainingPtSessions + (contract.sessionsTotal || 0),
            activeContractId: contract.id
          };
        }
        return m;
      });
      setMembers(updatedMembers);
      setCurrentMemberId(existingMember.id);
    } else {
      // Create brand new member!
      const nextNum = 1000 + members.length + 1;
      const newId = `MB-${nextNum}`;
      targetMemberId = newId;
      const newMember: Member = {
        id: newId,
        name: contract.customerName,
        phone: contract.customerPhone,
        email: `${contract.customerName.replace(/\s+/g, '').toLowerCase()}@gmail.com`,
        idCard: contract.customerIdCard,
        memberType: contract.courseCategory === 'Membership' && contract.price > 15000 ? 'VIP' : 'Active',
        qrCodeUrl: newId,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        remainingPtSessions: contract.sessionsTotal || 0,
        activeContractId: contract.id,
        joinDate: contract.startDate,
      };
      setMembers([...members, newMember]);
      setCurrentMemberId(newId);
    }

    // 2. Automatically record finance transaction & invoice
    const invNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const commission = contract.courseCategory === 'Personal Training' ? Math.round(contract.price * 0.3) : undefined;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber: invNumber,
      contractId: contract.id,
      memberName: contract.customerName,
      memberId: targetMemberId,
      courseTitle: contract.courseTitle,
      amount: contract.price,
      paymentMethod: contract.paymentMethod,
      paymentDate: contract.signedDate,
      status: 'Completed',
      taxDeductible: true,
      trainerCommission: commission,
      trainerName: commission ? 'Coach Alex' : undefined
    };
    setTransactions([newTx, ...transactions]);

    // 3. Update or add to CRM Leads
    const existingCrmIndex = crmLeads.findIndex(l => l.name === contract.customerName || l.phone === contract.customerPhone);
    if (existingCrmIndex >= 0) {
      const updatedCrm = [...crmLeads];
      updatedCrm[existingCrmIndex] = {
        ...updatedCrm[existingCrmIndex],
        stage: 'Active',
        contractValue: (updatedCrm[existingCrmIndex].contractValue || 0) + contract.price,
        interactions: [
          {
            id: `int-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            type: 'In-Person',
            staffName: 'Contract System',
            note: `สมัครคอร์ส ${contract.courseTitle} ยอดชำระ ฿${contract.price.toLocaleString()}`
          },
          ...updatedCrm[existingCrmIndex].interactions
        ]
      };
      setCrmLeads(updatedCrm);
    } else {
      const newLead: CrmLead = {
        id: `crm-${Date.now()}`,
        name: contract.customerName,
        phone: contract.customerPhone,
        email: contract.customerPhone ? `${contract.customerPhone}@fitness.local` : '-',
        stage: 'Active',
        assignedTrainer: 'Coach Alex',
        interestCourse: contract.courseTitle,
        lastContactDate: new Date().toISOString().slice(0, 10),
        contractValue: contract.price,
        joinDate: contract.startDate,
        interactions: [
          {
            id: `int-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            type: 'In-Person',
            staffName: 'Contract System',
            note: `สมัครคอร์ส ${contract.courseTitle} ยอดชำระ ฿${contract.price.toLocaleString()}`
          }
        ]
      };
      setCrmLeads([newLead, ...crmLeads]);
    }

    // Navigate to Check-in tab so the user immediately sees their newly generated QR Code Pass
    setActiveTab('checkin');
  };

  // Finance: Add Expense
  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    setExpenses([newExpense, ...expenses]);
  };

  // CRM: Add Lead
  const handleAddLead = (lead: Omit<CrmLead, 'id' | 'interactions'>) => {
    const newLead: CrmLead = {
      ...lead,
      id: `crm-${Date.now()}`,
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          type: 'Call',
          staffName: 'Admin',
          note: `บันทึกผู้สนใจใหม่ คอร์สที่สนใจ: ${lead.interestCourse}`
        }
      ]
    };
    setCrmLeads([newLead, ...crmLeads]);

    // Also synchronize to members so they appear in check-in!
    const memberExists = members.some(m => m.name === lead.name || m.phone === lead.phone);
    if (!memberExists) {
      const nextNum = 1000 + members.length + 1;
      const newId = `MB-${nextNum}`;
      const newMember: Member = {
        id: newId,
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        idCard: '1-xxxx-xxxxx-xx-x',
        memberType: lead.stage === 'VIP' ? 'VIP' : 'Active',
        qrCodeUrl: newId,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        remainingPtSessions: lead.interestCourse.includes('20') ? 20 : lead.interestCourse.includes('30') ? 30 : 0,
        joinDate: new Date().toISOString().slice(0, 10),
      };
      setMembers([...members, newMember]);
      setCurrentMemberId(newId);
    }
  };

  // CRM: Add Interaction
  const handleAddInteraction = (leadId: string, interaction: Omit<CrmInteraction, 'id'>) => {
    const updated = crmLeads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          lastContactDate: interaction.date,
          interactions: [
            { ...interaction, id: `int-${Date.now()}` },
            ...l.interactions
          ]
        };
      }
      return l;
    });
    setCrmLeads(updated);
  };

  // CRM: Update Lead Stage
  const handleUpdateLeadStage = (leadId: string, newStage: CrmLead['stage']) => {
    const updated = crmLeads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          stage: newStage
        };
      }
      return l;
    });
    setCrmLeads(updated);
  };

  return (
    <div className="min-h-screen bg-[#09090d] text-zinc-100 flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        members={members}
        currentMember={currentMember}
        setCurrentMemberId={setCurrentMemberId}
        gymOccupancy={gymOccupancy}
        maxCapacity={80}
      />

      {/* Main Content View Container - Full Width */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            currentMember={currentMember}
            contracts={contracts}
            checkIns={checkIns}
            transactions={transactions}
            crmLeads={crmLeads}
            setActiveTab={setActiveTab}
            gymOccupancy={gymOccupancy}
          />
        )}

        {activeTab === 'checkin' && (
          <CheckInView
            currentMember={currentMember}
            members={members}
            checkIns={checkIns}
            onCheckIn={handleCheckIn}
            gymOccupancy={gymOccupancy}
            onRegisterMember={handleRegisterMember}
          />
        )}

        {activeTab === 'courses' && (
          <CourseCatalogView
            courses={courses}
            currentMember={currentMember}
            onSelectCourseForContract={handleSelectCourseForContract}
          />
        )}

        {activeTab === 'contracts' && (
          <ContractsListView
            contracts={contracts}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            transactions={transactions}
            expenses={expenses}
            members={members}
            onAddExpense={handleAddExpense}
          />
        )}

        {activeTab === 'crm' && (
          <CrmView
            leads={crmLeads}
            onAddLead={handleAddLead}
            onAddInteraction={handleAddInteraction}
            onUpdateLeadStage={handleUpdateLeadStage}
          />
        )}
      </main>

      {/* Digital Contract Modal */}
      {isContractModalOpen && selectedCourseForContract && (
        <ContractModal
          isOpen={isContractModalOpen}
          onClose={() => {
            setIsContractModalOpen(false);
            setSelectedCourseForContract(null);
          }}
          selectedCourse={selectedCourseForContract}
          currentMember={currentMember}
          onSaveContract={handleSaveContract}
        />
      )}

      {/* QR Scan Verification Success Modal (when scanned via smartphone camera) */}
      {qrScanModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 border border-lime-400/50 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-lime-400/20 border-2 border-lime-400 text-lime-400 flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-lime-400/15 text-lime-300 text-xs font-bold mb-2">
                VERIFIED MEMBER QR PASS
              </span>
              <h3 className="text-xl font-black text-white">{qrScanModalData.message}</h3>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">ชื่อสมาชิก:</span>
                <span className="text-white font-bold">{qrScanModalData.member.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">รหัสสมาชิก:</span>
                <span className="text-lime-400 font-mono font-bold">{qrScanModalData.member.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">ประเภทบัตร:</span>
                <span className="text-violet-400 font-bold">{qrScanModalData.member.memberType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">สิทธิ์เทรนเนอร์ (PT):</span>
                <span className="text-white font-bold">{qrScanModalData.member.remainingPtSessions} ครั้ง</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2">
                <span className="text-zinc-400">เวลาเช็คอิน:</span>
                <span className="text-zinc-300 font-mono text-xs">{qrScanModalData.time}</span>
              </div>
            </div>
            <button
              onClick={() => setQrScanModalData(null)}
              className="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black text-sm transition cursor-pointer"
            >
              ตกลง / เข้าสู่ระบบบัตรสมาชิก
            </button>
          </div>
        </div>
      )}

      {/* Footer - Full Width */}
      <footer className="border-t border-zinc-900 bg-zinc-950/90 py-8 no-print mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © 2026 <strong className="text-zinc-300">FITPULSE PRO</strong>. All-in-one Athletic Performance & Gym Management Platform.
          </div>
          <div className="flex items-center gap-4 text-zinc-400 font-medium">
            <span>แดชบอร์ดบริหาร</span>
            <span>•</span>
            <span>ระบบเช็คอิน QR</span>
            <span>•</span>
            <span>สัญญาซื้อขายคอร์ส</span>
            <span>•</span>
            <span>ระบบการเงิน & บัญชี</span>
            <span>•</span>
            <span>ระบบ CRM ลูกค้า</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
