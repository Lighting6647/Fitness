export type ActiveTab = 
  | 'dashboard' 
  | 'checkin' 
  | 'courses' 
  | 'contracts'
  | 'finance'
  | 'crm';

export interface Transaction {
  id: string;
  invoiceNumber: string;
  contractId?: string;
  memberName: string;
  memberId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: 'PromptPay QR' | 'Credit Card' | 'Cash' | 'Bank Transfer';
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Refunded';
  taxDeductible: boolean;
  trainerCommission?: number;
  trainerName?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Utilities' | 'Equipment' | 'Maintenance' | 'Staff Salary' | 'Marketing';
  amount: number;
  date: string;
  note?: string;
}

export interface CrmInteraction {
  id: string;
  date: string;
  type: 'Call' | 'Line Chat' | 'In-Person' | 'Email';
  staffName: string;
  note: string;
}

export interface CrmLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: 'Lead' | 'Trial' | 'Active' | 'VIP' | 'At Risk' | 'Expired';
  assignedTrainer: string;
  interestCourse: string;
  lastContactDate: string;
  interactions: CrmInteraction[];
  contractValue?: number;
  joinDate?: string;
  avatar?: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  idCard: string;
  memberType: 'Active' | 'VIP' | 'Expired';
  qrCodeUrl: string;
  avatar: string;
  remainingPtSessions: number;
  activeContractId?: string;
  joinDate: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'Membership' | 'Personal Training' | 'Special Bootcamp' | 'Class Pass';
  description: string;
  durationMonths?: number;
  sessions?: number;
  price: number;
  originalPrice: number;
  features: string[];
  trainerName?: string;
  tag?: string;
  popular?: boolean;
}

export interface CourseContract {
  id: string;
  contractNumber: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  price: number;
  paymentMethod: 'PromptPay QR' | 'Credit Card' | 'Cash' | 'Bank Transfer';
  customerName: string;
  customerIdCard: string;
  customerPhone: string;
  customerAddress: string;
  emergencyContact: string;
  emergencyPhone: string;
  signedDate: string;
  startDate: string;
  endDate: string;
  sessionsTotal: number;
  signatureImage: string; // Base64 data URL
  trainerSignature?: string;
  status: 'Active' | 'Completed' | 'Terminated';
  termsAccepted: boolean;
  notes?: string;
}

export interface CheckInRecord {
  id: string;
  memberId: string;
  memberName: string;
  timestamp: string;
  checkInType: 'Gym Entrance' | 'PT Session' | 'Group Class';
  zone: string;
  status: 'Success' | 'Warn' | 'Denied';
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  nameTh: string;
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string;
  estimatedCaloriesPerMin: number;
}

export interface WorkoutSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises: WorkoutExerciseLog[];
  notes?: string;
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface DailyNutrition {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: MealItem[];
}

export interface BodyMetric {
  date: string;
  weight: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
}
