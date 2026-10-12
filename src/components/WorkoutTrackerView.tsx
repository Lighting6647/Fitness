import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Flame, 
  Dumbbell, 
  Check, 
  Calendar, 
  Search, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WorkoutSession, WorkoutExerciseLog, WorkoutSet } from '../types';

interface WorkoutTrackerViewProps {
  exercises: Exercise[];
  workoutHistory: WorkoutSession[];
  onSaveWorkout: (session: WorkoutSession) => void;
}

export const WorkoutTrackerView: React.FC<WorkoutTrackerViewProps> = ({
  exercises,
  workoutHistory,
  onSaveWorkout,
}) => {
  // Active session state
  const [sessionTitle, setSessionTitle] = useState('Upper Body Push & Core');
  const [activeExercises, setActiveExercises] = useState<WorkoutExerciseLog[]>([
    {
      exerciseId: 'ex-1',
      exerciseName: 'Barbell Bench Press',
      muscleGroup: 'Chest',
      sets: [
        { setNumber: 1, weightKg: 60, reps: 10, completed: true },
        { setNumber: 2, weightKg: 70, reps: 8, completed: false },
        { setNumber: 3, weightKg: 70, reps: 8, completed: false }
      ]
    }
  ]);
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Exercise Library modal / selector state
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [searchExercise, setSearchExercise] = useState('');
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);

  // Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [currentTimerTime, setCurrentTimerTime] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && currentTimerTime > 0) {
      interval = setInterval(() => {
        setCurrentTimerTime((prev) => prev - 1);
      }, 1000);
    } else if (currentTimerTime === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play brief sound or trigger notification
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentTimerTime]);

  const startTimer = (secs: number) => {
    setTimerSeconds(secs);
    setCurrentTimerTime(secs);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setCurrentTimerTime(timerSeconds);
  };

  const handleAddExerciseToSession = (ex: Exercise) => {
    const newExLog: WorkoutExerciseLog = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: [
        { setNumber: 1, weightKg: 20, reps: 10, completed: false },
        { setNumber: 2, weightKg: 20, reps: 10, completed: false },
        { setNumber: 3, weightKg: 20, reps: 10, completed: false },
      ]
    };
    setActiveExercises([...activeExercises, newExLog]);
    setIsExercisePickerOpen(false);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updated = [...activeExercises];
    const sets = updated[exerciseIndex].sets;
    const lastSet = sets[sets.length - 1];
    sets.push({
      setNumber: sets.length + 1,
      weightKg: lastSet ? lastSet.weightKg : 20,
      reps: lastSet ? lastSet.reps : 10,
      completed: false
    });
    setActiveExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...activeExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    // Renumber
    updated[exerciseIndex].sets.forEach((s, idx) => s.setNumber = idx + 1);
    setActiveExercises(updated);
  };

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: 'weightKg' | 'reps' | 'completed', value: any) => {
    const updated = [...activeExercises];
    (updated[exerciseIndex].sets[setIndex] as any)[field] = value;
    setActiveExercises(updated);
  };

  const handleRemoveExercise = (index: number) => {
    const updated = activeExercises.filter((_, i) => i !== index);
    setActiveExercises(updated);
  };

  const handleFinishWorkout = () => {
    if (activeExercises.length === 0) {
      alert('กรุณาเพิ่มท่าออกกำลังกายอย่างน้อย 1 ท่า');
      return;
    }

    // Estimate calories burned (avg 6-8 kcal per min of resistance training)
    const burned = Math.round(workoutDuration * 7.2);

    const newSession: WorkoutSession = {
      id: `ws-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: sessionTitle || 'Workout Session',
      durationMinutes: workoutDuration,
      caloriesBurned: burned,
      exercises: activeExercises,
      notes: workoutNotes
    };

    onSaveWorkout(newSession);

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Reset form
    setSessionTitle('Workout Session ' + new Date().toLocaleDateString('th-TH'));
    setWorkoutNotes('');
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesGroup = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    const matchesSearch = 
      ex.name.toLowerCase().includes(searchExercise.toLowerCase()) ||
      ex.nameTh.toLowerCase().includes(searchExercise.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Smart Workout Tracker & Gym Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              บันทึกการออกกำลังกาย & ตัวจับเวลาพักเซ็ต
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              บันทึกน้ำหนัก จำนวนครั้ง (Progressive Overload) จับเวลาพักเซ็ต และสถิติการฝึกซ้อมเพื่อการเติบโตของกล้ามเนื้อ
            </p>
          </div>

          {/* Quick Rest Timer Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-rose-500/15 rounded-xl border border-rose-500/30 text-rose-400">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Rest Timer (เวลาพักเซ็ต)</div>
              <div className="text-2xl font-black font-mono text-white">
                {Math.floor(currentTimerTime / 60)}:{(currentTimerTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center gap-1"
                >
                  {isTimerRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                  {isTimerRunning ? 'หยุด' : 'เริ่ม'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold"
                >
                  รีเซ็ต
                </button>
                <div className="flex gap-1 ml-1">
                  {[45, 60, 90].map((s) => (
                    <button
                      key={s}
                      onClick={() => startTimer(s)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 hover:text-white"
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Workout Logger & Exercise Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Workout Tracker */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
            {/* Session Info Form */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 mb-1">ชื่อโปรแกรม / เซสชันฝึกวันนี้:</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="w-full sm:w-40">
                <label className="block text-xs font-semibold text-slate-400 mb-1">ระยะเวลารวม (นาที):</label>
                <input
                  type="number"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Exercises in Session */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-rose-400" />
                  <span>รายการท่าที่ฝึก ({activeExercises.length} ท่า)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsExercisePickerOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มท่าออกกำลังกาย</span>
                </button>
              </div>

              {activeExercises.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                  <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">ยังไม่มีท่าฝึกในเซสชันนี้ กดปุ่ม "เพิ่มท่าออกกำลังกาย" เพื่อเริ่มบันทึก</p>
                </div>
              ) : (
                activeExercises.map((exerciseLog, exIdx) => (
                  <div key={exIdx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                          {exerciseLog.muscleGroup}
                        </div>
                        <h4 className="text-sm font-bold text-white">{exerciseLog.exerciseName}</h4>
                      </div>
                      <button
                        onClick={() => handleRemoveExercise(exIdx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sets Table */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 px-2">
                        <div className="col-span-2 text-center">เซ็ต</div>
                        <div className="col-span-4 text-center">น้ำหนัก (kg)</div>
                        <div className="col-span-3 text-center">จำนวนครั้ง</div>
                        <div className="col-span-2 text-center">เสร็จ</div>
                        <div className="col-span-1"></div>
                      </div>

                      {exerciseLog.sets.map((set, sIdx) => (
                        <div 
                          key={sIdx} 
                          className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition ${
                            set.completed ? 'bg-emerald-950/20 border border-emerald-500/30' : 'bg-slate-900/60'
                          }`}
                        >
                          <div className="col-span-2 text-center font-mono font-bold text-xs text-slate-400">
                            #{set.setNumber}
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              value={set.weightKg}
                              onChange={(e) => handleUpdateSet(exIdx, sIdx, 'weightKg', Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-xs text-center text-white font-mono focus:ring-1 focus:ring-rose-500"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => handleUpdateSet(exIdx, sIdx, 'reps', Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-xs text-center text-white font-mono focus:ring-1 focus:ring-rose-500"
                            />
                          </div>
                          <div className="col-span-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateSet(exIdx, sIdx, 'completed', !set.completed);
                                if (!set.completed) {
                                  startTimer(60); // Auto start 60s rest timer on completing set
                                }
                              }}
                              className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition ${
                                set.completed 
                                  ? 'bg-emerald-500 text-slate-950' 
                                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </button>
                          </div>
                          <div className="col-span-1 text-center">
                            <button
                              onClick={() => handleRemoveSet(exIdx, sIdx)}
                              className="text-slate-600 hover:text-rose-400 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSet(exIdx)}
                      className="w-full py-2 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-semibold transition"
                    >
                      + เพิ่มเซ็ต (Add Set)
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Finish Workout CTA */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleFinishWorkout}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-black hover:brightness-110 active:scale-[0.99] transition shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 text-base"
              >
                <Sparkles className="w-5 h-5" />
                <span>เสร็จสิ้นการฝึกซ้อม & บันทึกสถิติ (Finish Workout)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Workout History List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>ประวัติการฝึกซ้อมล่าสุด</span>
            </h3>

            <div className="space-y-4">
              {workoutHistory.map((session) => (
                <div key={session.id} className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{session.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{session.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                      <Flame className="w-3.5 h-3.5" />
                      {session.caloriesBurned} kcal
                    </span>
                    <span>•</span>
                    <span>เวลา: {session.durationMinutes} นาที</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    {session.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-400">
                        <span className="text-slate-300">{ex.exerciseName}</span>
                        <span className="font-mono text-slate-400">{ex.sets.length} เซ็ต</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      {isExercisePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">คลังท่าออกกำลังกาย (Exercise Library)</h3>
                <p className="text-xs text-slate-400">เลือกท่าฝึกเพื่อนำมาบันทึกในเซสชันของคุณ</p>
              </div>
              <button
                onClick={() => setIsExercisePickerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Filter and Search */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/60">
              <input
                type="text"
                placeholder="ค้นหาชื่อท่าฝึก (ภาษาไทย หรือ อังกฤษ)..."
                value={searchExercise}
                onChange={(e) => setSearchExercise(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedMuscle(grp)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedMuscle === grp 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handleAddExerciseToSession(ex)}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-rose-500/60 hover:bg-slate-800/40 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-rose-400 transition">{ex.name}</span>
                      <span className="text-xs text-slate-400">({ex.nameTh})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      อุปกรณ์: {ex.equipment} • ระดับ: {ex.difficulty}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-rose-400 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
