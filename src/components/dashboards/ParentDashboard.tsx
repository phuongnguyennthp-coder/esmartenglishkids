import React, { useState } from 'react';
import { Heart, Volume2, Award, Sparkles, Clock, Calendar, CheckCircle2, Shield, MessageCircle, Phone, Mail, BookOpen, UserCheck } from 'lucide-react';
import { StudentRecord, getTeacherForClass } from '../../types/user';
import { speakText, soundManager } from '../../utils/audio';

interface ParentDashboardProps {
  student: StudentRecord;
  language: 'en' | 'vi';
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  student,
  language,
}) => {
  const isVi = language === 'vi';
  const [selectedTab, setSelectedTab] = useState<'progress' | 'recordings' | 'praise' | 'guidance'>('progress');
  const teacher = getTeacherForClass(student.className);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Parent Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>{isVi ? 'Góc Phụ Huynh · Đồng Hành Cùng Con' : 'Parent Companion Hub'}</span>
              <span>·</span>
              <span className="font-mono bg-white/30 px-2 py-0.5 rounded-full">STT {student.stt ?? '-'} ({student.className})</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              {isVi ? `Gia đình bé ${student.fullName}` : `${student.fullName}'s Family`} 🏡
            </h1>
            <p className="text-pink-50 text-sm mt-1 max-w-xl font-medium">
              {isVi
                ? `Cập nhật tiến độ học tập, nghe lại giọng đọc tiếng Anh của con và nhận thư khen từ giáo viên phụ trách.`
                : `Track learning progress, listen to your child's spoken English recordings, and celebrate achievements.`}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white p-3.5 rounded-2xl shadow-md border border-pink-200">
            <span className="text-[11px] text-slate-500 font-bold block text-center">
              {isVi ? 'Thời Gian Học Tích Lũy' : 'Total Learning Time'}
            </span>
            <span className="font-display font-bold text-2xl text-rose-600 block text-center mt-0.5">
              ⏱️ {student.learningTimeMinutes} {isVi ? 'phút' : 'mins'}
            </span>
          </div>
        </div>

        {/* Assigned Teacher Card */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center font-bold text-lg shadow-xs">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{teacher.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-bold text-white">
                  {student.className}
                </span>
              </div>
              <p className="text-pink-100 text-[11px]">{teacher.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-pink-100 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{teacher.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{teacher.phone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => {
            soundManager.playDing();
            setSelectedTab('progress');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'progress'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📊 {isVi ? 'Tiến Độ Học Tập' : 'Learning Progress'}
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setSelectedTab('recordings');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'recordings'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🎙️ {isVi ? 'Nghe Giọng Con Đọc' : "Child's Spoken Audio"} ({student.speakingHistory?.length || 0})
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setSelectedTab('praise');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'praise'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          💌 {isVi ? 'Thư Khen Từ Thầy Cô' : 'Praise Letters'} ({student.praiseLetters?.length || 0})
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setSelectedTab('guidance');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'guidance'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          💡 {isVi ? 'Cẩm Nang Đồng Hành' : 'Parent Guidance'}
        </button>
      </div>

      {/* TAB 1: PROGRESS */}
      {selectedTab === 'progress' && (
        <div className="space-y-6">
          {/* Key Competency Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-2xl mb-2 block">🎙️</span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {isVi ? 'Năng Lực Luyện Nói AI' : 'Speaking Competence'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isVi ? 'Đánh giá phát âm, độ chuẩn xác và lưu loát' : 'Pronunciation, accuracy & fluency evaluated by AI'}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display font-bold text-4xl text-emerald-600">
                  {student.averageSpeakingScore}%
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  {student.averageSpeakingScore >= 90 ? 'Xuất Sắc' : 'Khá Tốt'}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-2xl mb-2 block">🎧</span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {isVi ? 'Kỹ Năng Nghe Hiểu' : 'Listening Comprehension'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isVi ? 'Khả năng nhận diện âm thanh bản xứ' : 'Ability to recognize native phonemes and words'}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display font-bold text-4xl text-teal-600">
                  {student.averageListeningScore}%
                </span>
                <span className="text-xs font-bold text-teal-700 bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                  {isVi ? 'Chính Xác' : 'Accurate'}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-2xl mb-2 block">🛡️</span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {isVi ? 'Công Dân Số An Toàn' : 'Digital Citizenship'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isVi ? 'Ý thức bảo mật thông tin & cư xử tử tế trực tuyến' : 'Awareness of passwords, privacy & digital kindness'}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display font-bold text-4xl text-indigo-600">
                  {student.digitalCitizenshipScore}%
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                  {isVi ? 'An Toàn' : 'Safe Learner'}
                </span>
              </div>
            </div>
          </div>

          {/* Child's Self-Reflection History */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
              {isVi ? 'Cảm Nhận Tự Đánh Giá Của Bé' : "Child's Self-Reflections"}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {isVi
                ? 'Bé chia sẻ cảm xúc sau mỗi bài học để phát triển tính tự chủ học tập.'
                : 'Student shares how they felt after completing units to develop self-regulation.'}
            </p>

            <div className="space-y-3">
              {(student.reflections || []).map((ref, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {ref.feeling === 'well' ? '😊' : ref.feeling === 'practice' ? '😐' : '😢'}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Unit {ref.unitNumber} (Grade {ref.grade}): "{ref.note || 'Con rất thích bài này'}"
                      </p>
                      <span className="text-[10px] text-slate-400">{ref.date}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    {ref.feeling === 'well' ? (isVi ? 'Làm rất tốt' : 'Did Well') : (isVi ? 'Cần luyện thêm' : 'Need Practice')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIO RECORDINGS */}
      {selectedTab === 'recordings' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            {isVi
              ? 'Cha mẹ có thể bấm nghe lại câu tiếng Anh do chính con phát âm trong các thử thách cùng Gia sư AI.'
              : 'Parents can listen to authentic spoken audio recorded during AI Speaking Coach missions.'}
          </p>

          {(student.speakingHistory || []).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs"
            >
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {item.date} · Grade {student.grade}
                </span>
                <p className="font-display font-bold text-base text-slate-900 dark:text-white mt-0.5">
                  "{item.targetText}"
                </p>
                <div className="flex items-center gap-3 text-xs mt-1 text-slate-600 dark:text-slate-300">
                  <span className="text-emerald-600 font-bold">
                    {isVi ? 'Điểm Phát Âm' : 'Pronunciation'}: {item.pronunciationScore}%
                  </span>
                  <span>·</span>
                  <span className="text-indigo-600 font-bold">
                    {isVi ? 'Lưu Loát' : 'Fluency'}: {item.fluencyScore}%
                  </span>
                  <span>·</span>
                  <span className="text-slate-500 italic">"{item.feedbackTip}"</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playDing();
                  speakText(item.targetText);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isVi ? 'Nghe Giọng Con' : 'Play Audio'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PRAISE LETTERS */}
      {selectedTab === 'praise' && (
        <div className="space-y-4">
          {(student.praiseLetters || []).map((pl) => (
            <div
              key={pl.id}
              className="p-6 rounded-3xl bg-amber-50/80 dark:bg-slate-800/80 border-2 border-amber-300 dark:border-amber-700/60 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-slate-700 mb-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {pl.date} · {pl.verifiedBy}
                  </span>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-0.5">
                    {pl.headline}
                  </h3>
                </div>

                <span className="text-3xl">💌</span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-4">
                {pl.letterBody}
              </p>

              {pl.keyHighlights && (
                <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-amber-200 dark:border-slate-700 mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    {isVi ? 'Điểm Sáng Nổi Bật Của Bé:' : 'Key Competency Highlights:'}
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-200">
                    {pl.keyHighlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-amber-500">★</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-slate-500 italic">
                "{pl.encouragementQuote}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: PARENT GUIDANCE */}
      {selectedTab === 'guidance' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                {isVi
                  ? 'Cẩm Nang Đồng Hành Tiếng Anh 10 Phút Mỗi Ngày (2018 General Education Curriculum)'
                  : 'Daily 10-Minute English Partnership Guide (2018 General Education Curriculum)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isVi
                  ? 'Bí quyết giúp con tự tin nói tiếng Anh tự nhiên tại nhà mà cha mẹ không cần giỏi ngoại ngữ.'
                  : 'Practical tips to nurture confident English communication without requiring parents to be fluent.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs">
              <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm mb-1">
                {isVi ? '1. Tạo thói quen khen ngợi nỗ lực' : '1. Praise effort over perfection'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isVi
                  ? 'Thay vì sửa sai ngay lập tức khi con phát âm lệch, hãy động viên: "Bố mẹ rất thích cách con tự tin mở miệng nói!". Sự tự tin là nền tảng số một cho học sinh Lớp 1 & 2.'
                  : 'Encourage boldness. Confidence is the foundation for young communicative competence.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-xs">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-sm mb-1">
                {isVi ? '2. Chơi cùng AI Story World' : '2. Roleplay together in Story World'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isVi
                  ? 'Dành 5 phút trước giờ ngủ cùng con đọc một câu chuyện ngắn với Cú Vàng Smarty và Gấu Bimi. Hãy để bé dạy lại cho cha mẹ từ mới con vừa học.'
                  : 'Spend 5 minutes before bedtime exploring a comic scene with Smarty the Owl and Bimi the Bear.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm mb-1">
                {isVi ? '3. Đồng hành an toàn số' : '3. Practice Digital Safety together'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isVi
                  ? 'Nhắc nhở con nguyên tắc Digital Citizenship: Giữ bí mật mật khẩu, không bấm vào đường link lạ và luôn cư xử tử tế khi giao tiếp trực tuyến.'
                  : 'Reinforce password protection and online kindness to build early digital citizenship.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs">
              <h4 className="font-bold text-rose-900 dark:text-rose-100 text-sm mb-1">
                {isVi ? '4. Kết nối trực tiếp giáo viên' : '4. School Connection'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isVi
                  ? 'Giáo viên phụ trách: Cô Hồng Phương · Hotline/Zalo: 0912-345-678 · Email: hongphuong.teacher@esmartkids.edu.vn.'
                  : 'Lead Educator: Ms Hong Phuong · Office: 0912-345-678 · Email: hongphuong.teacher@esmartkids.edu.vn.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
