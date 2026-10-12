import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Users, 
  FileText,
  Search,
  Zap,
  Flame
} from 'lucide-react';
import gsap from 'gsap';
import { Course, Member } from '../types';

interface CourseCatalogViewProps {
  courses: Course[];
  currentMember: Member;
  onSelectCourseForContract: (course: Course) => void;
}

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  onSelectCourseForContract,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'ทั้งหมด' },
    { id: 'Membership', label: 'สมาชิกยิม' },
    { id: 'Personal Training', label: 'เทรนเนอร์ (1-on-1)' },
    { id: 'Special Bootcamp', label: 'แคมป์ลดไขมัน/บูทแคมป์' },
    { id: 'Class Pass', label: 'คลาสพาส & พิลาทิส' },
  ];

  // GSAP animation on courses load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.course-card',
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [selectedCategory, searchQuery]);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Catalog Hero Banner - Style 3 Lime & Violet */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-purple-950/40 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl glow-athletic">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-black tracking-wide uppercase mb-3">
              <Zap className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
              <span>OFFICIAL ATHLETIC PACKAGES & DIGITAL CONTRACTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              เลือกซื้อคอร์สฟิตเนส & ทำสัญญาออนไลน์
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              สมัครสมาชิก แพ็กเกจเทรนเนอร์ส่วนตัว และคอร์สเฉพาะทาง พร้อมระบบร่างสัญญาอิเล็กทรอนิกส์ (E-Contract) ลงลายมือชื่อดิจิทัลถูกต้องตามกฎหมาย
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl shadow-lg">
            <ShieldCheck className="w-8 h-8 text-lime-400 shrink-0" />
            <div className="text-xs">
              <div className="font-black text-white uppercase tracking-wider">รับประกันความปลอดภัย</div>
              <div className="text-zinc-400">สัญญาผูกพันถูกต้อง ออกใบเสร็จทันที</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 shadow-md shadow-lime-400/25'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="ค้นหาชื่อคอร์ส หรือเป้าหมาย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400 font-medium"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const discountPercent = Math.round(
            ((course.originalPrice - course.price) / course.originalPrice) * 100
          );

          return (
            <div
              key={course.id}
              className={`course-card relative rounded-3xl bg-zinc-900/90 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${
                course.popular 
                  ? 'border-2 border-lime-400/60 shadow-xl shadow-lime-400/10' 
                  : 'border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Badges */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {course.tag && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-lime-400/20 text-lime-300 border border-lime-400/40 uppercase tracking-wide">
                    {course.tag}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                    ลด {discountPercent}%
                  </span>
                )}
              </div>

              <div className="p-6">
                {/* Category & Title */}
                <div className="text-[11px] font-black tracking-widest uppercase text-lime-400 mb-1">
                  {course.category}
                </div>
                <h3 className="text-xl font-black text-white tracking-tight pr-12 uppercase">
                  {course.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                  {course.description}
                </p>

                {/* Trainer tag if present */}
                {course.trainerName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                    <Users className="w-3.5 h-3.5 text-lime-400" />
                    <span>ผู้ดูแล: <strong className="text-white">{course.trainerName}</strong></span>
                  </div>
                )}

                {/* Pricing Box */}
                <div className="mt-5 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">
                      ฿{course.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-500 line-through font-mono">
                      ฿{course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>
                      {course.durationMonths ? `อายุสัญญา ${course.durationMonths} เดือน` : 'อายุการใช้งานตามเงื่อนไข'}
                      {course.sessions ? ` • ฝึกสอน ${course.sessions} ครั้ง` : ''}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-5 space-y-2.5">
                  <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">สิทธิประโยชน์ในสัญญา:</div>
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                      <div className="w-4 h-4 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0 mt-4 border-t border-zinc-800">
                <button
                  onClick={() => onSelectCourseForContract(course)}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer uppercase tracking-wider ${
                    course.popular
                      ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-zinc-950 hover:brightness-110 shadow-lg shadow-lime-400/25'
                      : 'bg-zinc-800 text-white hover:bg-violet-600 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>สมัครคอร์ส & ทำสัญญาออนไลน์</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
