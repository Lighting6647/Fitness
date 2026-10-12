import { Course, Member, CourseContract, CheckInRecord, Exercise, WorkoutSession, MealItem, BodyMetric } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1',
    title: 'All-Access Annual Membership (รายปีสุดคุ้ม)',
    category: 'Membership',
    description: 'เข้าใช้บริการฟิตเนส โซนเวท คาร์ดิโอ ห้องซาวน่า และสระว่ายน้ำได้ไม่จำกัดตลอด 1 ปีเต็ม',
    durationMonths: 12,
    price: 15900,
    originalPrice: 22000,
    tag: 'คุ้มค่าที่สุด',
    popular: true,
    features: [
      'เข้าใช้ฟิตเนสได้ทุกวัน 06:00 - 23:00 น.',
      'รวมคลาสกลุ่ม โยคะ ซุมบ้า ปั่นจักรยาน (ไม่จำกัด)',
      'ฟรี Locker ประจำวัน และผ้าขนหนู',
      'ฟรีตรวจวัดมวลกล้ามเนื้อ InBody 4 ครั้ง/ปี',
      'รับส่วนลดเครื่องดื่ม & เวย์โปรตีน 10%'
    ]
  },
  {
    id: 'c-2',
    title: 'Monthly Flex Pass (สมาชิกรายเดือนอิสระ)',
    category: 'Membership',
    description: 'แพ็กเกจรายเดือนไม่มีข้อผูกมัดระยะยาว เหมาะสำหรับผู้เริ่มต้นออกกำลังกาย',
    durationMonths: 1,
    price: 1690,
    originalPrice: 2100,
    features: [
      'เข้าใช้บริการยิมทุกโซนตลอด 30 วัน',
      'เข้าคลาสกลุ่มได้ทุกคลาส',
      'ที่จอดรถฟรี 3 ชั่วโมง',
      'ไม่มีค่าแรกเข้า'
    ]
  },
  {
    id: 'c-3',
    title: 'Personal Training 20 Sessions (เทรนเนอร์ 1-on-1)',
    category: 'Personal Training',
    description: 'คอร์สเทรนเนอร์ส่วนตัว 20 ครั้ง พร้อมวางแผนโภชนาการและการฝึกแบบเฉพาะบุคคลอย่างเข้มข้น',
    sessions: 20,
    durationMonths: 3,
    price: 18000,
    originalPrice: 24000,
    trainerName: 'Coach Alex (Certified NASM-CPT)',
    tag: 'ผลลัพธ์การันตี',
    popular: true,
    features: [
      'ฝึกตัวต่อตัว 60 นาที/ครั้ง รวม 20 ครั้ง',
      'ออกแบบตารางเวทเทรนนิ่งรายบุคคลตามเป้าหมาย',
      'คำนวณสารอาหารและจัดเมนูอาหารรายสัปดาห์',
      'ติดตามผลด้วย InBody ทุกๆ 2 สัปดาห์',
      'แชทปรึกษาเทรนเนอร์ได้ตลอด 24 ชม.'
    ]
  },
  {
    id: 'c-4',
    title: 'Hypertrophy Mass Builder (คอร์สปั้นกล้ามเนื้อ 30 ครั้ง)',
    category: 'Personal Training',
    description: 'เน้นการโฟกัสสร้างขนาดกล้ามเนื้อ เพิ่มความแข็งแรง (Strength) ปรับฟอร์มยกหนักอย่างปลอดภัย',
    sessions: 30,
    durationMonths: 4,
    price: 25500,
    originalPrice: 33000,
    trainerName: 'Coach Max (Bodybuilding Coach)',
    features: [
      'ฝึกตัวต่อตัว 30 ครั้ง เน้น Progressive Overload',
      'วิเคราะห์จุดอ่อนของกล้ามเนื้อแต่ละส่วน',
      'เทคนิคการเซฟตี้และการป้องกันการบาดเจ็บ',
      'รวมแผนโภชนาการ Bulk สะอาด (Clean Bulk)'
    ]
  },
  {
    id: 'c-5',
    title: '60-Day Fat Loss Bootcamp (แคมป์สลายไขมันเร่งด่วน)',
    category: 'Special Bootcamp',
    description: 'โปรแกรมรวมเวท คาร์ดิโอ HIIT และการคุมอาหารอย่างเข้มข้น ออกแบบเพื่อลดไขมันและกระชับสัดส่วนใน 60 วัน',
    sessions: 24,
    durationMonths: 2,
    price: 14500,
    originalPrice: 19500,
    tag: 'ขายดีประจำซีซั่น',
    features: [
      'เข้ากลุ่มย่อย 3-5 คน ดูแลใกล้ชิด',
      'ตาราง HIIT & Strength แบบเจาะจงโซนหัวใจ',
      'โค้ชตรวจการบ้านรูปอาหารทุกวัน',
      'การันตีสัดส่วนกระชับขึ้นอย่างเห็นได้ชัด'
    ]
  },
  {
    id: 'c-6',
    title: 'Pilates Reformer & Core 10 Class Pass',
    category: 'Class Pass',
    description: 'คอร์สพิลาทิสเครื่องรีฟอร์เมอร์ สร้างความยืดหยุ่น ปรับบุคลิกภาพ ลดอาการออฟฟิศซินโดรม',
    sessions: 10,
    durationMonths: 2,
    price: 7900,
    originalPrice: 9500,
    trainerName: 'Kru Pim (STOTT Pilates Certified)',
    features: [
      'ใช้เครื่อง Pilates Reformer ระดับสากล',
      'คลาสจำกัดไม่เกิน 6 ท่านเพื่อการดูแลที่ทั่วถึง',
      'เน้นแกนกลางลำตัว สะโพก และหลัง',
      'จองคลาสผ่านแอปได้สะดวก'
    ]
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'MB-1001',
    name: 'สมชาย รักสุขภาพ',
    phone: '081-234-5678',
    email: 'somchai.health@gmail.com',
    idCard: '1-1002-34567-89-0',
    memberType: 'VIP',
    qrCodeUrl: 'MB-1001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    remainingPtSessions: 14,
    activeContractId: 'CTR-2026-001',
    joinDate: '2026-01-15'
  },
  {
    id: 'MB-1002',
    name: 'กานดา มุ่งมั่นกล้าม',
    phone: '089-876-5432',
    email: 'kanda.fit@outlook.com',
    idCard: '3-1005-99887-12-3',
    memberType: 'Active',
    qrCodeUrl: 'MB-1002',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    remainingPtSessions: 6,
    activeContractId: 'CTR-2026-002',
    joinDate: '2026-02-01'
  },
  {
    id: 'MB-1003',
    name: 'ธนากร ฟิตเนสบอย',
    phone: '062-333-4455',
    email: 'tanakorn.gym@gmail.com',
    idCard: '1-4509-12345-67-8',
    memberType: 'Active',
    qrCodeUrl: 'MB-1003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    remainingPtSessions: 0,
    joinDate: '2026-03-10'
  },
  {
    id: 'MB-1004',
    name: 'อำพล แพทย์',
    phone: '085-123-4567',
    email: 'ampol.md@gmail.com',
    idCard: '1-1004-55667-88-9',
    memberType: 'Active',
    qrCodeUrl: 'MB-1004',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    remainingPtSessions: 0,
    activeContractId: 'CTR-2026-7267',
    joinDate: '2026-10-12'
  }
];

export const INITIAL_CONTRACTS: CourseContract[] = [
  {
    id: 'ctr-1',
    contractNumber: 'CTR-2026-001',
    courseId: 'c-3',
    courseTitle: 'Personal Training 20 Sessions (เทรนเนอร์ 1-on-1)',
    courseCategory: 'Personal Training',
    price: 18000,
    paymentMethod: 'PromptPay QR',
    customerName: 'สมชาย รักสุขภาพ',
    customerIdCard: '1-1002-34567-89-0',
    customerPhone: '081-234-5678',
    customerAddress: '88/12 หมู่บ้านสุขสมบูรณ์ แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
    emergencyContact: 'คุณวิภาวรรณ (ภรรยา)',
    emergencyPhone: '081-999-8877',
    signedDate: '2026-02-10 14:30',
    startDate: '2026-02-15',
    endDate: '2026-05-15',
    sessionsTotal: 20,
    signatureImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10,40 Q50,10 90,40 T170,25" fill="none" stroke="%2310b981" stroke-width="3"/></svg>',
    trainerSignature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M20,45 Q70,5 120,35 T180,20" fill="none" stroke="%233b82f6" stroke-width="3"/></svg>',
    status: 'Active',
    termsAccepted: true,
    notes: 'ลูกค้ามีประวัติเคยปวดหลังส่วนล่างเล็กน้อย เน้นปรับ Core Stability'
  },
  {
    id: 'ctr-2',
    contractNumber: 'CTR-2026-002',
    courseId: 'c-1',
    courseTitle: 'All-Access Annual Membership (รายปีสุดคุ้ม)',
    courseCategory: 'Membership',
    price: 15900,
    paymentMethod: 'Credit Card',
    customerName: 'กานดา มุ่งมั่นกล้าม',
    customerIdCard: '3-1005-99887-12-3',
    customerPhone: '089-876-5432',
    customerAddress: '234 คอนโดลุมพินี ถ.สุขุมวิท พระโขนง กรุงเทพฯ 10110',
    emergencyContact: 'คุณสมคิด (พี่ชาย)',
    emergencyPhone: '082-111-2233',
    signedDate: '2026-02-01 11:15',
    startDate: '2026-02-01',
    endDate: '2027-01-31',
    sessionsTotal: 0,
    signatureImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M15,35 Q60,15 110,45 T175,30" fill="none" stroke="%2310b981" stroke-width="3"/></svg>',
    status: 'Active',
    termsAccepted: true
  }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: 'chk-1',
    memberId: 'MB-1001',
    memberName: 'สมชาย รักสุขภาพ',
    timestamp: '2026-10-12 13:45:10',
    checkInType: 'PT Session',
    zone: 'Zone A - Free Weights & PT Cage',
    status: 'Success',
    notes: 'ใช้สิทธิ์ PT ครั้งที่ 7/20 (โค้ช Alex)'
  },
  {
    id: 'chk-2',
    memberId: 'MB-1002',
    memberName: 'กานดา มุ่งมั่นกล้าม',
    timestamp: '2026-10-12 12:30:22',
    checkInType: 'Gym Entrance',
    zone: 'Zone B - Cardio & Machines',
    status: 'Success',
    notes: 'สมาชิกรายปีสถานะปกติ'
  },
  {
    id: 'chk-3',
    memberId: 'MB-1003',
    memberName: 'ธนากร ฟิตเนสบอย',
    timestamp: '2026-10-12 10:15:00',
    checkInType: 'Gym Entrance',
    zone: 'Zone C - Cross-training',
    status: 'Success',
    notes: 'สมาชิกรายเดือนสถานะปกติ'
  }
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Barbell Bench Press',
    nameTh: 'เบนช์เพรสบาร์เบล',
    muscleGroup: 'Chest',
    equipment: 'Barbell & Flat Bench',
    difficulty: 'Intermediate',
    instructions: 'นอนราบบนเบาะ วางเท้าราบกับพื้น จับบาร์กว้างกว่าหัวไหล่เล็กน้อย ค่อยๆ ลดบาร์ลงระดับอกกลาง แล้วดันขึ้นอย่างมั่นคง',
    estimatedCaloriesPerMin: 7
  },
  {
    id: 'ex-2',
    name: 'Incline Dumbbell Press',
    nameTh: 'ดัมเบลเพรสเบาะเอียงขึ้น (อกบน)',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells & Incline Bench',
    difficulty: 'Beginner',
    instructions: 'ปรับเบาะเอียง 30-45 องศา ดันดัมเบลขึ้นตรงเหนือหน้าอกส่วนบน บีบกล้ามเนื้ออกตอนสุด',
    estimatedCaloriesPerMin: 6
  },
  {
    id: 'ex-3',
    name: 'Barbell Back Squat',
    nameTh: 'สควอทบาร์เบล',
    muscleGroup: 'Legs',
    equipment: 'Barbell & Squat Rack',
    difficulty: 'Advanced',
    instructions: 'วางบาร์บนบ่าส่วนบน ยืนกว้างระดับไหล่ เกร็งหน้าท้อง ย่อสะโพกลงหลังเข่าทำมุม 90 องศา ดันตัวกลับขึ้นด้วยส้นเท้า',
    estimatedCaloriesPerMin: 9
  },
  {
    id: 'ex-4',
    name: 'Romanian Deadlift (RDL)',
    nameTh: 'โรมาเนียนเดดลิฟต์ (หลังขาและก้น)',
    muscleGroup: 'Legs',
    equipment: 'Barbell or Dumbbells',
    difficulty: 'Intermediate',
    instructions: 'ยืนตรง ถือบาร์เบล งอเข่าเล็กน้อย ผลักสะโพกไปด้านหลัง รักษาหลังให้ตรงจนรู้สึกตึงที่ Hamstrings แล้วดันสะโพกกลับ',
    estimatedCaloriesPerMin: 8
  },
  {
    id: 'ex-5',
    name: 'Lat Pulldown',
    nameTh: 'แลทพูลดาวน์ (หลังกว้าง)',
    muscleGroup: 'Back',
    equipment: 'Cable Machine',
    difficulty: 'Beginner',
    instructions: 'จับบาร์กว้าง เอนตัวไปข้างหลังเล็กน้อย ดึงบาร์ลงมาแตะยอดอก บีบสะบักหลังเข้าหากัน ค่อยๆ คลายตัวขึ้น',
    estimatedCaloriesPerMin: 6
  },
  {
    id: 'ex-6',
    name: 'Barbell Bent-Over Row',
    nameTh: 'เบนต์โอเวอร์โรว์บาร์เบล (หลังส่วนกลาง)',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: 'พับสะโพกประมาณ 45 องศา หลังตรง ดึงบาร์เข้าหาช่วงสะดือ โฟกัสบีบกล้ามเนื้อปีกและหลังกลาง',
    estimatedCaloriesPerMin: 7
  },
  {
    id: 'ex-7',
    name: 'Dumbbell Shoulder Press',
    nameTh: 'ดัมเบลโชลเดอร์เพรส (หัวไหล่)',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: 'ยกดัมเบลระดับใบหู ดันขึ้นตรงเหนือศีรษะโดยไม่ล็อคข้อศอก ค่อยๆ ผ่อนลงช้าๆ',
    estimatedCaloriesPerMin: 6
  },
  {
    id: 'ex-8',
    name: 'Lateral Raise',
    nameTh: 'เลเทอรัลเรส (หัวไหล่ข้าง)',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells / Cable',
    difficulty: 'Beginner',
    instructions: 'ถือดัมเบลข้างลำตัว ยกแขนกางออกด้านข้างขนานกับพื้น เกร็งหัวไหล่ด้านข้าง ห้ามเหวี่ยงตัว',
    estimatedCaloriesPerMin: 5
  },
  {
    id: 'ex-9',
    name: 'Bicep Barbell Curl',
    nameTh: 'บาร์เบลเคิร์ล (หน้าแขน)',
    muscleGroup: 'Arms',
    equipment: 'EZ-Bar or Straight Bar',
    difficulty: 'Beginner',
    instructions: 'ล็อคข้อศอกชิดลำตัว หมุนข้อมือยกบาร์ขึ้นเกร็งกล้ามเนื้อไบเซป ค่อยๆ ลดลงช้าๆ',
    estimatedCaloriesPerMin: 5
  },
  {
    id: 'ex-10',
    name: 'Tricep Rope Pushdown',
    nameTh: 'ไตรเซปพุชดาวน์เชือก (หลังแขน)',
    muscleGroup: 'Arms',
    equipment: 'Cable Machine & Rope',
    difficulty: 'Beginner',
    instructions: 'จับเชือกสายเคเบิล ล็อคศอกข้างลำตัว กดเชือกลงตรงพร้อมกางปลายเชือกออกตอนสุด เกร็งหลังแขน',
    estimatedCaloriesPerMin: 5
  },
  {
    id: 'ex-11',
    name: 'Plank Hold',
    nameTh: 'แพลงก์ (แกนกลางลำตัว)',
    muscleGroup: 'Core',
    equipment: 'Yoga Mat',
    difficulty: 'Beginner',
    instructions: 'ตั้งศอกและปลายเท้าบนพื้น รักษาแนวศีรษะ หลัง และสะโพกให้เป็นเส้นตรง เกร็งหน้าท้องตลอดเวลา',
    estimatedCaloriesPerMin: 5
  },
  {
    id: 'ex-12',
    name: 'Treadmill Incline Walk',
    nameTh: 'เดินลู่วิ่งปรับชัน (คาร์ดิโอโซน 2)',
    muscleGroup: 'Cardio',
    equipment: 'Treadmill',
    difficulty: 'Beginner',
    instructions: 'ปรับความชัน 8-12% ความเร็ว 4.5-5.5 กม./ชม. เดินต่อเนื่อง 30-45 นาที เพื่อเผาผลาญไขมันสูงสุด',
    estimatedCaloriesPerMin: 8
  }
];

export const INITIAL_WORKOUT_HISTORY: WorkoutSession[] = [
  {
    id: 'ws-1',
    date: '2026-10-10',
    title: 'Chest & Triceps Hypertrophy',
    durationMinutes: 55,
    caloriesBurned: 380,
    exercises: [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Barbell Bench Press',
        muscleGroup: 'Chest',
        sets: [
          { setNumber: 1, weightKg: 60, reps: 10, completed: true },
          { setNumber: 2, weightKg: 70, reps: 8, completed: true },
          { setNumber: 3, weightKg: 75, reps: 6, completed: true }
        ]
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Incline Dumbbell Press',
        muscleGroup: 'Chest',
        sets: [
          { setNumber: 1, weightKg: 22, reps: 10, completed: true },
          { setNumber: 2, weightKg: 24, reps: 8, completed: true }
        ]
      },
      {
        exerciseId: 'ex-10',
        exerciseName: 'Tricep Rope Pushdown',
        muscleGroup: 'Arms',
        sets: [
          { setNumber: 1, weightKg: 20, reps: 12, completed: true },
          { setNumber: 2, weightKg: 25, reps: 10, completed: true }
        ]
      }
    ],
    notes: 'ฟอร์มดีมาก bench press ทำ New PR ได้ 75kg!'
  }
];

export const INITIAL_MEALS: MealItem[] = [
  {
    id: 'm-1',
    name: 'ข้าวกล้อง + อกไก่ย่าง 200g + บรอกโคลี',
    calories: 450,
    protein: 48,
    carbs: 45,
    fat: 6,
    mealType: 'Lunch'
  },
  {
    id: 'm-2',
    name: 'เวย์โปรตีน Isolate 1 สกู๊ป + กล้วยหอม 1 ลูก',
    calories: 220,
    protein: 26,
    carbs: 28,
    fat: 2,
    mealType: 'Breakfast'
  },
  {
    id: 'm-3',
    name: 'สเต๊กปลาแซลมอนย่าง 150g + สลัดผักน้ำมันมะกอก',
    calories: 410,
    protein: 34,
    carbs: 10,
    fat: 22,
    mealType: 'Dinner'
  }
];

export const INITIAL_BODY_METRICS: BodyMetric[] = [
  { date: '2026-09-01', weight: 75.4, bodyFatPercent: 21.2, muscleMassKg: 33.5 },
  { date: '2026-09-15', weight: 74.8, bodyFatPercent: 20.4, muscleMassKg: 33.7 },
  { date: '2026-10-01', weight: 73.9, bodyFatPercent: 19.5, muscleMassKg: 34.0 },
  { date: '2026-10-12', weight: 73.2, bodyFatPercent: 18.8, muscleMassKg: 34.2 }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    invoiceNumber: 'INV-2026-1001',
    contractId: 'ctr-1',
    memberName: 'สมชาย รักสุขภาพ',
    memberId: 'MB-1001',
    courseTitle: 'Personal Training 20 Sessions (เทรนเนอร์ 1-on-1)',
    amount: 18000,
    paymentMethod: 'PromptPay QR' as const,
    paymentDate: '2026-02-10 14:32',
    status: 'Completed' as const,
    taxDeductible: true,
    trainerCommission: 5400,
    trainerName: 'Coach Alex'
  },
  {
    id: 'tx-2',
    invoiceNumber: 'INV-2026-1002',
    contractId: 'ctr-2',
    memberName: 'กานดา มุ่งมั่นกล้าม',
    memberId: 'MB-1002',
    courseTitle: 'All-Access Annual Membership (รายปีสุดคุ้ม)',
    amount: 15900,
    paymentMethod: 'Credit Card' as const,
    paymentDate: '2026-02-01 11:20',
    status: 'Completed' as const,
    taxDeductible: true
  },
  {
    id: 'tx-3',
    invoiceNumber: 'INV-2026-1003',
    memberName: 'ธนากร ฟิตเนสบอย',
    memberId: 'MB-1003',
    courseTitle: 'Monthly Flex Pass (สมาชิกรายเดือนอิสระ)',
    amount: 1690,
    paymentMethod: 'PromptPay QR' as const,
    paymentDate: '2026-03-10 09:15',
    status: 'Completed' as const,
    taxDeductible: true
  },
  {
    id: 'tx-4',
    invoiceNumber: 'INV-2026-1004',
    memberName: 'วิชัย พลังม้า',
    memberId: 'MB-1004',
    courseTitle: '60-Day Fat Loss Bootcamp',
    amount: 14500,
    paymentMethod: 'Bank Transfer' as const,
    paymentDate: '2026-03-15 16:40',
    status: 'Completed' as const,
    taxDeductible: true,
    trainerCommission: 4350,
    trainerName: 'Coach Max'
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    title: 'ค่าไฟฟ้าและระบบปรับอากาศยิมประจำเดือน',
    category: 'Utilities' as const,
    amount: 28500,
    date: '2026-03-05',
    note: 'บิลการไฟฟ้านครหลวง'
  },
  {
    id: 'exp-2',
    title: 'ซ่อมบำรุงสายสลิงและลูกปืนลู่วิ่งไฟฟ้า (Zone B)',
    category: 'Maintenance' as const,
    amount: 6800,
    date: '2026-03-12',
    note: 'เปลี่ยนสลิง Cable Crossover และสายพานลู่วิ่ง #3'
  },
  {
    id: 'exp-3',
    title: 'ซื้อดัมเบล Urethane ขนาด 24kg, 26kg เพิ่มเติม',
    category: 'Equipment' as const,
    amount: 12000,
    date: '2026-03-18',
    note: 'อุปกรณ์สำหรับ Free Weight Zone'
  },
  {
    id: 'exp-4',
    title: 'โฆษณา Facebook & TikTok Ads แคมเปญ Summer Fit',
    category: 'Marketing' as const,
    amount: 8500,
    date: '2026-03-20',
    note: 'ยิงแอดกลุ่มเป้าหมายสุขุมวิท-อโศก รัศมี 5 กม.'
  }
];

export const INITIAL_CRM_LEADS = [
  {
    id: 'crm-1',
    name: 'สมชาย รักสุขภาพ',
    phone: '081-234-5678',
    email: 'somchai.health@gmail.com',
    stage: 'VIP' as const,
    assignedTrainer: 'Coach Alex',
    interestCourse: 'Personal Training 20 Sessions',
    lastContactDate: '2026-10-10',
    contractValue: 18000,
    joinDate: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    interactions: [
      {
        id: 'int-1',
        date: '2026-10-10',
        type: 'In-Person' as const,
        staffName: 'Coach Alex',
        note: 'ฝึก PT ครั้งที่ 6 ฟอร์มสควอทดีขึ้นมาก เพิ่มเป้าหมายอยากลดรอบเอวอีก 2 นิ้ว'
      },
      {
        id: 'int-2',
        date: '2026-09-28',
        type: 'Line Chat' as const,
        staffName: 'Admin Nan',
        note: 'ส่งคลิปยืดเหยียดแก้อาการตึงสะโพก ลูกค้าชื่นชมบริการ'
      }
    ]
  },
  {
    id: 'crm-2',
    name: 'กานดา มุ่งมั่นกล้าม',
    phone: '089-876-5432',
    email: 'kanda.fit@outlook.com',
    stage: 'Active' as const,
    assignedTrainer: 'Kru Pim',
    interestCourse: 'All-Access Annual Membership',
    lastContactDate: '2026-10-05',
    contractValue: 15900,
    joinDate: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    interactions: [
      {
        id: 'int-3',
        date: '2026-10-05',
        type: 'In-Person' as const,
        staffName: 'Staff Golf',
        note: 'แนะนำให้เข้าคลาส Pilates Reformer วันพฤหัสบดี'
      }
    ]
  },
  {
    id: 'crm-3',
    name: 'ณภัทร สุขสมบูรณ์',
    phone: '095-444-5566',
    email: 'naphat.lead@gmail.com',
    stage: 'Lead' as const,
    assignedTrainer: 'Coach Max',
    interestCourse: '60-Day Fat Loss Bootcamp',
    lastContactDate: '2026-10-11',
    interactions: [
      {
        id: 'int-4',
        date: '2026-10-11',
        type: 'Call' as const,
        staffName: 'Sales Mike',
        note: 'โทรแจ้งโปรโมชั่น Bootcamp ลูกค้าสะดวกเข้ามาดูสถานที่วันเสาร์นี้ เวลา 14:00 น.'
      }
    ]
  },
  {
    id: 'crm-4',
    name: 'ธีรเดช เจริญสุข',
    phone: '086-777-8899',
    email: 'teeradej.trial@gmail.com',
    stage: 'Trial' as const,
    assignedTrainer: 'Coach Alex',
    interestCourse: 'Monthly Flex Pass',
    lastContactDate: '2026-10-08',
    interactions: [
      {
        id: 'int-5',
        date: '2026-10-08',
        type: 'In-Person' as const,
        staffName: 'Reception Bow',
        note: 'รับสิทธิ์ Free Trial 3 วัน วันแรกพาเทสต์ InBody ค่าไขมัน 24%'
      }
    ]
  },
  {
    id: 'crm-5',
    name: 'วิภาดา รุ่งเรือง',
    phone: '082-999-1122',
    email: 'wipada.risk@gmail.com',
    stage: 'At Risk' as const,
    assignedTrainer: 'Coach Alex',
    interestCourse: 'Personal Training 20 Sessions',
    lastContactDate: '2026-09-20',
    contractValue: 18000,
    joinDate: '2026-02-15',
    interactions: [
      {
        id: 'int-6',
        date: '2026-09-20',
        type: 'Line Chat' as const,
        staffName: 'Admin Nan',
        note: 'ลูกค้าไม่ได้มาเข้ายิมเกิน 20 วันเนื่องจากติดงานต่างจังหวัด แนะนำให้แวะมาซ้อมเบาๆ สัปดาห์หน้า'
      }
    ]
  }
];

