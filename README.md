# ⚡ FitPulse Pro - Fitness Club & Athletic OS

All-in-one Fitness Club & Gym Management Web Application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **GSAP (GreenSock)**.

---

## 🌟 ฟีเจอร์หลักของระบบ (Key Features)

### 1. 📊 Executive Dashboard & Athletic Performance OS
- ภาพรวมรายรับ, ผู้ใช้งานในยิมแบบเรียลไทม์, สัญญาคอร์ส, และระบบ CRM
- **Activity Rings & Day Progress:** วงแหวนกิจกรรม 3 ระดับ (Move, Exercise, Stand) คำนวณความคืบหน้ารายวัน
- **Live Performance Metrics:** ระยะเวลาฝึกสอน, แคลอรี่ที่เผาผลาญ, อัตราการเต้นหัวใจ (BPM), และก้าวเดิน
- กราฟแท่งรายรับ 6 เดือน และชาร์ตวิเคราะห์ช่วงเวลาหนาแน่น (Peak Hours) ขับเคลื่อนด้วย GSAP

### 2. 🪪 Smart QR Check-in Terminal & กล้องถ่ายภาพสมาชิก
- บัตรสมาชิกดิจิทัล **Athlete Pass / VIP Pass** พร้อม QR Code ดิจิทัล
- สแกนและบันทึกเวลาเข้าใช้บริการ, ตัดสิทธิ์ PT Session (1-on-1) และคลาสกลุ่ม
- **📸 ระบบถ่ายภาพสดจากกล้อง (Webcam) & อัปโหลดรูปภาพ:** 
  - เชื่อมต่อกล้องคอมพิวเตอร์/มือถือ ถ่ายภาพสดสมาชิกใหม่เพื่อใช้เป็นรูปประจำตัวบนบัตรดิจิทัลทันที
  - รองรับการเลือกรูปจากเครื่อง

### 3. 🛍️ คอร์ส & แพ็กเกจฟิตเนส (Course Catalog)
- แคตตาล็อกคอร์สรายเดือน/รายปี, คอร์สเทรนเนอร์ส่วนตัว และบูทแคมป์
- แสดงราคา สิทธิ์การฝึกสอน และสิทธิประโยชน์ครบครัน

### 4. 📝 สัญญาซื้อขายคอร์สอิเล็กทรอนิกส์ (E-Contract)
- ร่างสัญญาซื้อขายคอร์สตามมาตรฐานกฎหมาย พร้อมกรอบลงลายมือชื่อดิจิทัลสด (Touch/Mouse Signature Canvas)
- จัดเก็บและพิมพ์สัญญาทางการ (Print / PDF) พร้อมตรายางประทับยิมรับรอง

### 5. 💰 ระบบการเงินและบัญชียิม (Finance & Invoicing)
- รายรับ-รายจ่าย, กำไรสุทธิจากการดำเนินงาน
- คำนวณค่าคอมมิชชั่นเทรนเนอร์อัตโนมัติ (30%)
- ออกใบเสร็จรับเงิน/ใบกำกับภาษีเต็มรูปแบบ (Tax Invoice/Receipt) พร้อมพิมพ์เอกสาร

### 6. 👥 ระบบบริหารความสัมพันธ์ลูกค้า (Fitness CRM)
- Pipeline ผู้สนใจ: Lead, Trial, Active, VIP, At Risk
- บันทึกประวัติการพูดคุยและปฏิสัมพันธ์ (Call, Line Chat, In-Person) แบบ 360 องศา

---

## 🎨 สไตล์การออกแบบ (UI & UX)
- **สไตล์:** Electric Lime & Violet Athletic (ธีมสปอร์ตพลังสูง สไตล์ Nike Training Club)
- **ชุดสี:** Dark Obsidian Background (`#09090d`), Neon Electric Lime (`#a3e635`), Neon Violet (`#c084fc`)
- **แอนิเมชัน:** GSAP (Staggered Entrance, Animated Counters, Growth Charts, 3D Hover Tilt)

---

## 🚀 การติดตั้งและรันโปรเจกต์ (Getting Started)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้น Dev Server
npm run dev

# 3. บิลด์สำหรับ Production
npm run build
```

---

© 2026 **FitPulse Pro**. Built for high-performance fitness clubs.
