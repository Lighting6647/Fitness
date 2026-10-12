import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Dumbbell, 
  Apple, 
  Flame, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Member } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AICoachViewProps {
  currentMember: Member;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ currentMember }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `สวัสดีครับคุณ ${currentMember.name}! ผมคือ FitPulse AI เทรนเนอร์ส่วนตัวอัจฉริยะของคุณ มีคำถามเกี่ยวกับการจัดตารางเวทเทรนนิ่ง ฟอร์มการยกท่าต่างๆ หรือเมนูอาหารโภชนาการ ถามผมได้เลยครับ! 💪`,
      timestamp: '14:00'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'จัดตารางเวท 3 วัน/สัปดาห์ สำหรับคนทำงานออฟฟิศ',
    'เมนูอาหารไทยโปรตีนสูง 140g ทำง่ายๆ งบประหยัด',
    'วิธีเล่น Bench Press ไม่ให้เจ็บหัวไหล่',
    'เทคนิคคาร์ดิโอโซน 2 เพื่อดึงไขมันมาใช้สูงสุด'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toTimeString().slice(0, 5)
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';

      if (text.includes('ตารางเวท') || text.includes('3 วัน') || text.includes('ออฟฟิศ')) {
        reply = `🏋️‍♂️ **ตาราง Push / Pull / Legs (3 วัน/สัปดาห์) เหมาะกับคนทำงานออฟฟิศ:**
1. **วันจันทร์ (Push: อก, ไหล่, หลังแขน):**
   - Barbell Bench Press (3 เซ็ต x 8-10 ครั้ง)
   - Incline Dumbbell Press (3 เซ็ต x 10-12 ครั้ง)
   - Dumbbell Shoulder Press (3 เซ็ต x 10 ครั้ง)
   - Tricep Rope Pushdown (3 เซ็ต x 12-15 ครั้ง)
2. **วันพุธ (Pull: หลัง, หน้าแขน):**
   - Lat Pulldown (4 เซ็ต x 10 ครั้ง)
   - Barbell Row (3 เซ็ต x 8-10 ครั้ง)
   - Face Pulls (3 เซ็ต x 15 ครั้ง - ดีมากสำหรับแก้อาการไหล่ห่อ)
   - Bicep Barbell Curl (3 เซ็ต x 10-12 ครั้ง)
3. **วันศุกร์ (Legs & Core: ขา, ก้น, แกนกลาง):**
   - Barbell Back Squat หรือ Leg Press (3 เซ็ต x 8-10 ครั้ง)
   - Romanian Deadlift (3 เซ็ต x 10 ครั้ง)
   - Walking Lunges (3 เซ็ต x 12 ก้าว)
   - Plank (3 เซ็ต x 45-60 วินาที)
💡 *พักระหว่างเซ็ต 60-90 วินาที และเน้นโฟกัสฟอร์มการเกร็งกล้ามเนื้อเป็นหลักครับ*`;
      } else if (text.includes('โปรตีน') || text.includes('อาหาร') || text.includes('เมนู')) {
        reply = `🥗 **ตัวอย่างเมนูอาหารไทยโปรตีนสูง 140g+ ทำง่ายและคุมแคลอรี่ได้ดี:**
- **มื้อเช้า (โปรตีน ~30g | ~320 kcal):**
  ไข่ต้ม 2 ฟอง + ไข่ขาวต้ม 2 ฟอง + ขนมปังโฮลวีต 2 แผ่น + นมจืดไขมัน 0% 1 กล่อง
- **มื้อกลางวัน (โปรตีน ~45g | ~480 kcal):**
  กะเพราอกไก่ลอกหนัง (ใช้อกไก่ 200g) ใช้น้ำมันมะกอกน้อย หรือผัดน้ำ + ข้าวกล้อง 1.5 ทัพพี + แตงกวา
- **ของว่างบ่าย (โปรตีน ~28g | ~160 kcal):**
  เวย์โปรตีน 1 สกู๊ป ผสมน้ำเย็น หรือกรีกโยเกิร์ต 1 ถ้วย + อัลมอนด์ 10 เม็ด
- **มื้อเย็น (โปรตีน ~42g | ~420 kcal):**
  ปลานิลนึ่งมะนาว หรือสเต๊กปลาแซลมอนย่าง 200g + ผักต้มหรือสลัดผักน้ำใส + ข้าวไรซ์เบอร์รี่ 1 ทัพพี
💧 *ดื่มน้ำเปล่าให้ได้วันละ 2.5 - 3 ลิตรเพื่อช่วยไตสังเคราะห์โปรตีนครับ!*`;
      } else if (text.includes('Bench Press') || text.includes('ไหล่') || text.includes('เจ็บ')) {
        reply = `🛡️ **3 เทคนิคป้องกันอาการเจ็บหัวไหล่ในการเล่น Bench Press:**
1. **บีบสะบักเข้าหากัน (Retract & Depress Scapula):**
   ก่อนนอนลงบนเบาะ ให้ดึงสะบักหลังเข้าหากันแล้วกดลง ปักให้แน่นกับเบาะ จะช่วยเปิดหน้าอกและล็อคหัวไหล่ให้อยู่ในมุมปลอดภัย
2. **ปรับมุมข้อศอก (Tuck Elbows ~45-60 องศา):**
   ห้ามกางข้อศอกออก 90 องศาแนวเดียวกับหัวไหล่ เพราะจะเกิดการเสียดสีของเส้นเอ็นข้อต่อ ให้หุบศอกเฉียงลงประมาณ 45-60 องศาคล้ายรูปลูกศร
3. **ลดบาร์ลงที่ระดับราวนมส่วนล่าง (Lower Sternum):**
   วิถีของบาร์เบลควรลงมาแตะเบาๆ ที่บริเวณฐานหน้าอกส่วนล่าง ไม่ใช่ที่ระดับลำคอ แล้วดันขึ้นเฉียงกลับเข้าหาแนวสายตา`;
      } else {
        reply = `ยินดีให้คำแนะนำครับ! สำหรับการฝึกและเป้าหมายของคุณ ${currentMember.name}:
- แนะนำให้ใช้หลัก **Progressive Overload** (ค่อยๆ เพิ่มน้ำหนัก หรือเพิ่มจำนวนครั้งทีละน้อยทุกสัปดาห์)
- นอนหลับพักผ่อนให้มีคุณภาพ 7-8 ชั่วโมงต่อคืน เพราะกล้ามเนื้อจะซ่อมแซมและเติบโตในช่วงที่นอนหลับ
- อย่าลืมบันทึกน้ำหนักและเช็คอินเข้าฝึกซ้อมอย่างสม่ำเสมอในแอป FitPulse Pro นะครับ! หากต้องการให้ผมช่วยจัดโปรแกรมเพิ่มเติม พิมพ์บอกได้เลยครับ 😊`;
      }

      const aiReplyMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toTimeString().slice(0, 5)
      };

      setMessages((prev) => [...prev, aiReplyMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Personal Trainer & Nutrition Coach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI เทรนเนอร์ส่วนตัวอัจฉริยะ (Coach FitPulse)
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              ปรึกษาเทคนิคการจัดตารางเวทเทรนนิ่ง แก้ไขฟอร์มท่าฝึก และจัดเมนูโภชนาการแบบเฉพาะบุคคลได้ตลอด 24 ชั่วโมง
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-slate-950">
              <Bot className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">FitPulse AI Active</div>
              <div className="text-emerald-400 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ออนไลน์พร้อมให้คำปรึกษา
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Quick Suggestion Pills */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 whitespace-nowrap transition"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500 text-slate-950 font-bold'
                }`}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                    isAi 
                      ? 'bg-slate-950/90 text-slate-200 border border-slate-800/80 rounded-tl-sm' 
                      : 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm'
                  }`}>
                    {m.text}
                  </div>
                  <div className={`text-[10px] text-slate-500 font-mono ${isAi ? 'text-left pl-1' : 'text-right pr-1'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 mr-auto">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1">Coach FitPulse กำลังพิมพ์ตอบ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="พิมพ์คำถามเกี่ยวกับการออกกำลังกาย ตารางเวท หรือเมนูอาหารที่นี่..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">ส่งคำถาม</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
