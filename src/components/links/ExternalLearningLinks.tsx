import React from 'react';
import { soundManager } from '../../utils/audio';

interface ExternalLearningLinksProps {
  currentGrade?: 1 | 2;
  compact?: boolean;
}

interface LearningPortal {
  id: string;
  name: string;
  badge: string;
  descriptionVi: string;
  url: string;
  icon: string;
  gradient: string;
  tag: string;
}

export const EXTERNAL_PORTALS: LearningPortal[] = [
  {
    id: 'digischool',
    name: 'DigiSchool Việt Nam',
    badge: 'Cổng Học Liệu Số Quốc Gia',
    descriptionVi: 'Hệ sinh thái học liệu số tương tác, bài giảng điện tử và kết nối trường học - phụ huynh.',
    url: 'https://digischool.vn/dang-nhap',
    icon: '🏫',
    gradient: 'from-blue-600 via-indigo-600 to-sky-600',
    tag: 'Đăng Nhập Học Sinh & GV',
  },
  {
    id: 'onluyen',
    name: 'Ôn Luyện (Onluyen.vn)',
    badge: 'Nền Tảng Tự Luyện & Khảo Sát',
    descriptionVi: 'Ngân hàng đề thi trắc nghiệm, ôn tập định kỳ bám sát chương trình GDPT 2018 Bộ GD&ĐT.',
    url: 'https://onluyen.vn/',
    icon: '🎯',
    gradient: 'from-emerald-600 via-teal-600 to-green-600',
    tag: 'Làm Đề Kiểm Tra Nhanh',
  },
  {
    id: 'cambridge-starters',
    name: 'Cambridge Pre-A1 Starters',
    badge: 'Luyện Thi Quốc Tế',
    descriptionVi: 'Học liệu tương tác chuẩn quốc tế Cambridge English: Starters dành cho học sinh Lớp 1 & Lớp 2.',
    url: 'https://www.cambridgeenglish.org/exams-and-tests/starters/preparation/',
    icon: '🇬🇧',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    tag: 'Bài Thi & Flashcards Mẫu',
  },
  {
    id: 'hanhtrangso',
    name: 'Hành Trang Số (NXBGDVN)',
    badge: 'Sách Giáo Khoa Điện Tử',
    descriptionVi: 'Xem trực tuyến trọn bộ sách giáo khoa, sách bài tập Tiếng Anh 1 & 2 Global Success có âm thanh.',
    url: 'https://hanhtrangso.nxbgd.vn/',
    icon: '📖',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    tag: 'Xem Sách Mềm Trực Tuyến',
  },
];

export const ExternalLearningLinks: React.FC<ExternalLearningLinksProps> = ({
  currentGrade = 1,
  compact = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌐</span>
          <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white">
            Cổng Học Tập & Liên Kết Giáo Dục Bổ Trợ
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
            Lớp {currentGrade}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Khám phá thêm học liệu số mở rộng
        </span>
      </div>

      {/* Grid of portal cards */}
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
        {EXTERNAL_PORTALS.map((portal) => (
          <a
            key={portal.id}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playDing()}
            className="group relative rounded-3xl p-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Top color accent strip */}
            <div className={`h-2 absolute top-0 inset-x-0 bg-gradient-to-r ${portal.gradient}`} />

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${portal.gradient} text-white flex items-center justify-center text-2xl shadow-md group-hover:rotate-6 transition-transform`}>
                  {portal.icon}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] tracking-tight">
                  {portal.tag}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {portal.badge}
                </span>
                <h4 className="font-display font-black text-sm text-slate-900 dark:text-white mt-0.5 group-hover:text-indigo-600 transition-colors">
                  {portal.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {portal.descriptionVi}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Mở liên kết ngay</span>
              <span>↗</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
