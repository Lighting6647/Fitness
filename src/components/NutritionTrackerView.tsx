import React, { useState } from 'react';
import { 
  Utensils, 
  Flame, 
  Plus, 
  Trash2, 
  Calculator, 
  PieChart, 
  Zap, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MealItem, DailyNutrition } from '../types';

interface NutritionTrackerViewProps {
  nutritionData: DailyNutrition;
  onAddMeal: (meal: Omit<MealItem, 'id'>) => void;
  onRemoveMeal: (mealId: string) => void;
  onUpdateTargets: (targets: { targetCalories: number; targetProtein: number; targetCarbs: number; targetFat: number }) => void;
}

export const NutritionTrackerView: React.FC<NutritionTrackerViewProps> = ({
  nutritionData,
  onAddMeal,
  onRemoveMeal,
  onUpdateTargets,
}) => {
  // New meal form state
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState<number | ''>('');
  const [mealProtein, setMealProtein] = useState<number | ''>('');
  const [mealCarbs, setMealCarbs] = useState<number | ''>('');
  const [mealFat, setMealFat] = useState<number | ''>('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');

  // Calculator state
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('male');
  const [calcWeight, setCalcWeight] = useState(73);
  const [calcHeight, setCalcHeight] = useState(175);
  const [calcAge, setCalcAge] = useState(28);
  const [calcActivity, setCalcActivity] = useState(1.55); // Moderate exercise
  const [calcGoal, setCalcGoal] = useState<'loss' | 'maintain' | 'gain'>('loss');
  const [calculatedTdee, setCalculatedTdee] = useState<number | null>(null);

  // Quick preset foods
  const quickPresets = [
    { name: 'อกไก่ต้ม/ย่าง (150g)', cal: 247, p: 46, c: 0, f: 5 },
    { name: 'ไข่ต้ม (2 ฟอง)', cal: 156, p: 13, c: 1, f: 11 },
    { name: 'ข้าวกล้องสุก (1 ทัพพี 100g)', cal: 110, p: 2.5, c: 23, f: 0.9 },
    { name: 'เวย์โปรตีน Isolate (1 scoop)', cal: 120, p: 27, c: 1, f: 0.5 },
    { name: 'กรีกโยเกิร์ต (1 ถ้วย 150g)', cal: 130, p: 15, c: 6, f: 3 },
    { name: 'กล้วยหอม (1 ลูก)', cal: 105, p: 1.3, c: 27, f: 0.3 }
  ];

  // Totals
  const totalCalories = nutritionData.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = nutritionData.meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = nutritionData.meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = nutritionData.meals.reduce((sum, m) => sum + m.fat, 0);

  const calPercent = Math.min(100, Math.round((totalCalories / nutritionData.targetCalories) * 100));
  const proPercent = Math.min(100, Math.round((totalProtein / nutritionData.targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / nutritionData.targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / nutritionData.targetFat) * 100));

  const handleCalculateTdee = () => {
    // Mifflin-St Jeor Equation
    let bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge;
    if (calcGender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    const tdee = Math.round(bmr * calcActivity);
    let target = tdee;
    if (calcGoal === 'loss') target -= 400;
    if (calcGoal === 'gain') target += 350;

    setCalculatedTdee(target);
  };

  const applyCalculatedTargets = () => {
    if (!calculatedTdee) return;
    // Macro split approximation: 30% Protein, 45% Carbs, 25% Fat
    const proteinGrams = Math.round((calculatedTdee * 0.3) / 4);
    const carbsGrams = Math.round((calculatedTdee * 0.45) / 4);
    const fatGrams = Math.round((calculatedTdee * 0.25) / 9);

    onUpdateTargets({
      targetCalories: calculatedTdee,
      targetProtein: proteinGrams,
      targetCarbs: carbsGrams,
      targetFat: fatGrams,
    });
  };

  const handleAddMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName || !mealCalories) return;

    onAddMeal({
      name: mealName,
      calories: Number(mealCalories),
      protein: Number(mealProtein) || 0,
      carbs: Number(mealCarbs) || 0,
      fat: Number(mealFat) || 0,
      mealType: mealType,
    });

    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setMealCarbs('');
    setMealFat('');
  };

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setMealName(preset.name);
    setMealCalories(preset.cal);
    setMealProtein(preset.p);
    setMealCarbs(preset.c);
    setMealFat(preset.f);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Utensils className="w-3.5 h-3.5" />
              <span>Smart Nutrition & Macro Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              คำนวณโภชนาการ & บันทึกแคลอรี่รายวัน
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              ติดตามแคลอรี่ สารอาหารหลัก โปรตีน คาร์โบไฮเดรต ไขมัน และคำนวณค่า TDEE เพื่อผลลัพธ์การสร้างกล้ามเนื้อและลดไขมันที่ดีที่สุด
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/15 rounded-xl border border-emerald-500/30 text-emerald-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">เป้าหมายแคลอรี่วันนี้</div>
              <div className="text-2xl font-black text-white">
                {totalCalories} <span className="text-xs text-slate-500 font-normal">/ {nutritionData.targetCalories} kcal</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                คงเหลือ {Math.max(0, nutritionData.targetCalories - totalCalories)} kcal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">พลังงานรวม (Calories)</span>
            <span className="text-xs font-bold text-white font-mono">{calPercent}%</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalCalories} <span className="text-xs text-slate-500 font-normal">kcal</span></div>
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${calPercent}%` }}></div>
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">โปรตีน (Protein)</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">{totalProtein}/{nutritionData.targetProtein}g</span>
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">{totalProtein} <span className="text-xs text-slate-500 font-normal">กรัม</span></div>
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${proPercent}%` }}></div>
          </div>
        </div>

        {/* Carbs Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">คาร์โบไฮเดรต (Carbs)</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{totalCarbs}/{nutritionData.targetCarbs}g</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{totalCarbs} <span className="text-xs text-slate-500 font-normal">กรัม</span></div>
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${carbsPercent}%` }}></div>
          </div>
        </div>

        {/* Fat Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400">ไขมัน (Fat)</span>
            <span className="text-xs font-bold text-rose-400 font-mono">{totalFat}/{nutritionData.targetFat}g</span>
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{totalFat} <span className="text-xs text-slate-500 font-normal">กรัม</span></div>
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-rose-400 rounded-full" style={{ width: `${fatPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Food Logger & TDEE Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Meal Logger */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>บันทึกมื้ออาหารวันนี้ (Log Meals)</span>
            </h3>

            {/* Quick Presets */}
            <div>
              <div className="text-xs text-slate-400 mb-2 font-medium">เมนูด่วนยอดนิยม (คลิกเพื่อกรอกอัตโนมัติ):</div>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(qp)}
                    className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-[11px] text-slate-300 transition"
                  >
                    + {qp.name} ({qp.cal} kcal)
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddMealSubmit} className="space-y-4 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่ออาหาร / รายการ *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ข้าวอกไก่ย่าง, เวย์โปรตีน"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">มื้ออาหาร *</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Breakfast">มื้อเช้า</option>
                    <option value="Lunch">มื้อกลางวัน</option>
                    <option value="Dinner">มื้อเย็น</option>
                    <option value="Snack">ของว่าง</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">แคลอรี่ (kcal) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cyan-400 mb-1">โปรตีน (g)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">คาร์โบไฮเดรต (g)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1">ไขมัน (g)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={mealFat}
                    onChange={(e) => setMealFat(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มมื้ออาหารลงตาราง</span>
              </button>
            </form>

            {/* Meals Log Table */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                รายการอาหารที่บันทึกแล้ว ({nutritionData.meals.length} รายการ)
              </h4>

              <div className="space-y-2">
                {nutritionData.meals.map((meal) => (
                  <div key={meal.id} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{meal.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {meal.mealType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                        <span className="text-emerald-400 font-semibold">{meal.calories} kcal</span>
                        <span>• P: {meal.protein}g</span>
                        <span>• C: {meal.carbs}g</span>
                        <span>• F: {meal.fat}g</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveMeal(meal.id)}
                      className="p-1.5 text-slate-600 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: TDEE / BMR Smart Calculator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>เครื่องคำนวณ TDEE & กำหนดเป้าหมาย</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* Gender */}
              <div>
                <label className="block text-slate-400 mb-1.5">เพศ:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcGender('male')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      calcGender === 'male' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ชาย (Male)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGender('female')}
                    className={`py-2 rounded-xl font-bold border transition ${
                      calcGender === 'female' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    หญิง (Female)
                  </button>
                </div>
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">น้ำหนัก (kg):</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ส่วนสูง (cm):</label>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">อายุ (ปี):</label>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={(e) => setCalcAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-slate-400 mb-1">ระดับการออกกำลังกาย:</label>
                <select
                  value={calcActivity}
                  onChange={(e) => setCalcActivity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value={1.2}>นั่งทำงานเป็นหลัก ไม่ออกกำลังกาย (x1.2)</option>
                  <option value={1.375}>ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์ (x1.375)</option>
                  <option value={1.55}>ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์ (x1.55)</option>
                  <option value={1.725}>ออกกำลังกายหนัก 6-7 วัน/สัปดาห์ (x1.725)</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-slate-400 mb-1">เป้าหมายของคุณ:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'loss', label: 'ลดไขมัน (-400)' },
                    { id: 'maintain', label: 'คงน้ำหนัก' },
                    { id: 'gain', label: 'เพิ่มกล้าม (+350)' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setCalcGoal(g.id as any)}
                      className={`p-2 rounded-xl text-center border font-semibold ${
                        calcGoal === g.id 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCalculateTdee}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>คำนวณพลังงานที่เหมาะสม</span>
              </button>

              {calculatedTdee && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-3">
                  <div className="text-center">
                    <div className="text-[11px] text-slate-400">พลังงานแนะนำต่อวัน (Target Calories)</div>
                    <div className="text-2xl font-black text-emerald-400">{calculatedTdee} kcal</div>
                  </div>

                  <button
                    type="button"
                    onClick={applyCalculatedTargets}
                    className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>ใช้ค่านี้เป็นเป้าหมายรายวันทันที</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
