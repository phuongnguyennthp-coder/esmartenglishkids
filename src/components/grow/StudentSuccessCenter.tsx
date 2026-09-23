import React, { useState } from 'react';
import { Award, Trophy, Star, Clock, BookOpen, Volume2, Sparkles, Printer, QrCode, CheckCircle2, Shield, Heart } from 'lucide-react';
import { StudentRecord, PraiseLetter, Certificate, getTeacherForClass } from '../../types/user';
import { soundManager } from '../../utils/audio';
import { generatePraiseLetterAI } from '../../services/geminiService';

interface StudentSuccessCenterProps {
  student: StudentRecord;
  onGeneratePraiseLetter: (letter: PraiseLetter) => void;
  onGenerateCertificate: (cert: Certificate) => void;
}

export const StudentSuccessCenter: React.FC<StudentSuccessCenterProps> = ({
  student,
  onGeneratePraiseLetter,
  onGenerateCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'praise' | 'certificate'>('overview');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [praiseError, setPraiseError] = useState<string | null>(null);
  const teacher = getTeacherForClass(student.className);

  // Available badges definition
  const allBadges = [
    {
      id: 'b-vocab',
      title: 'Vocabulary Master',
      description: 'Learned 15+ words in Global Success',
      icon: '🏆',
      isUnlocked: student.vocabLearnedCount >= 10,
    },
    {
      id: 'b-phonics',
      title: 'Phonics Star',
      description: 'Mastered phonics sounds with 90%+ pronunciation',
      icon: '⭐',
      isUnlocked: student.phonicsMasteryScore >= 85,
    },
    {
      id: 'b-speaker',
      title: 'Super Speaker',
      description: 'Completed 5+ speaking missions with AI Coach',
      icon: '🎙️',
      isUnlocked: (student.speakingHistory?.length || 0) >= 2,
    },
    {
      id: 'b-citizen',
      title: 'Digital Citizen',
      description: 'Passed 2018 General Education Curriculum online safety & ethics dilemmas',
      icon: '🛡️',
      isUnlocked: student.digitalCitizenshipScore >= 90,
    },
    {
      id: 'b-explorer',
      title: 'English Explorer',
      description: 'Completed at least 1 full Global Success unit',
      icon: '🚀',
      isUnlocked: student.completedUnits.length >= 1,
    },
  ];

  // AI Praise Letter Generation with fallback
  const handleGeneratePraiseLetter = async () => {
    setIsGeneratingAI(true);
    setPraiseError(null);
    soundManager.playDing();
    try {
      const data = await generatePraiseLetterAI(
        student.fullName,
        student.grade,
        student.completedUnits.length,
        student.averageSpeakingScore,
        student.averageListeningScore,
        student.badgesEarned.length,
        teacher.name
      );

      if (data && data.praiseLetter) {
        soundManager.playVictory();
        onGeneratePraiseLetter(data.praiseLetter);
        setActiveTab('praise');
      }
    } catch (err: any) {
      soundManager.playBuzzer();
      setPraiseError(err?.message || 'Lỗi tạo thư khen từ Gemini API');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Certificate Issuance
  const handleIssueCertificate = () => {
    soundManager.playVictory();
    const certNumber = `ESK-2026-G${student.grade}-${student.studentId}`;
    const cert: Certificate = {
      id: 'cert-' + Date.now(),
      certificateNumber: certNumber,
      studentName: student.fullName,
      achievementTitle: `Excellence in English Communicative Competence - Grade ${student.grade}`,
      grade: student.grade,
      className: student.className,
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      qrVerificationUrl: `https://esmartkids.edu.vn/verify/${certNumber}`,
      leadTeacher: teacher.name,
      institution: 'E-Smart English Kids · 2018 General Education Curriculum Innovation',
    };
    onGenerateCertificate(cert);
    setActiveTab('certificate');
  };

  const handlePrint = () => {
    window.print();
  };

  const latestLetter = student.praiseLetters[0];
  const latestCert = student.certificates[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 dark:border-slate-800 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Stage 5: GROW</span>
            <span>·</span>
            <span>Module 10</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Student Success Center 🚀
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Student Competency Portfolio, Digital Badges, AI Praise Letters &amp; Official Certificates
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGeneratePraiseLetter}
            disabled={isGeneratingAI}
            className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Praise Letter</span>
          </button>
          <button
            onClick={handleIssueCertificate}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Award className="w-4 h-4" />
            <span>Issue Certificate</span>
          </button>
        </div>
      </div>

      {/* Praise Error alert matching AI_INSTRUCTIONS.md */}
      {praiseError && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 text-rose-800 dark:text-rose-200 text-xs font-bold space-y-1.5 animate-shake">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wide">
                Đã dừng do lỗi
              </span>
              <span className="font-extrabold text-rose-900 dark:text-rose-100">
                Lỗi tạo thư khen AI:
              </span>
            </div>
            <button
              onClick={() => setPraiseError(null)}
              className="text-rose-500 hover:text-rose-800 cursor-pointer font-bold px-1"
            >
              ✕
            </button>
          </div>
          <p className="font-mono text-[11px] text-rose-700 dark:text-rose-300 break-words leading-relaxed pl-1">
            {praiseError}
          </p>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-100 dark:border-slate-800 pb-3">
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('overview');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📊 Portfolio Overview
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('badges');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🏆 Badges ({student.badgesEarned.length})
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('praise');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'praise'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          💌 Praise Letters ({student.praiseLetters?.length || 0})
        </button>
        <button
          onClick={() => {
            soundManager.playDing();
            setActiveTab('certificate');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'certificate'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📜 Certificate ({student.certificates?.length || 0})
        </button>
      </div>

      {/* TAB 1: PORTFOLIO OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="mt-6 space-y-6">
          {/* Key Metric Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-2xl">⭐</span>
              <span className="font-display font-bold text-2xl text-amber-800 dark:text-amber-200 block mt-1">
                {student.stars}
              </span>
              <span className="text-[11px] text-slate-500">Stars Earned</span>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
              <span className="text-2xl">📚</span>
              <span className="font-display font-bold text-2xl text-indigo-800 dark:text-indigo-200 block mt-1">
                {student.completedUnits.length} Units
              </span>
              <span className="text-[11px] text-slate-500">Completed</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-2xl">🎙️</span>
              <span className="font-display font-bold text-2xl text-emerald-800 dark:text-emerald-200 block mt-1">
                {student.averageSpeakingScore}%
              </span>
              <span className="text-[11px] text-slate-500">Speaking Fluency</span>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-2xl">🎧</span>
              <span className="font-display font-bold text-2xl text-teal-800 dark:text-teal-200 block mt-1">
                {student.averageListeningScore}%
              </span>
              <span className="text-[11px] text-slate-500">Listening Accuracy</span>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-center">
              <span className="text-2xl">⏱️</span>
              <span className="font-display font-bold text-2xl text-orange-800 dark:text-orange-200 block mt-1">
                {student.learningTimeMinutes}m
              </span>
              <span className="text-[11px] text-slate-500">Learning Time</span>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Active Student Profile
                </span>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                  {student.fullName} ({student.studentId})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Grade {student.grade} · {student.className} · Level {student.level} Learner ({student.xp} XP)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Status: {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BADGES COLLECTION */}
      {activeTab === 'badges' && (
        <div className="mt-6">
          <p className="text-xs text-slate-500 mb-6">
            Collect all 5 core competency badges aligned with the 2018 General Education Curriculum!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((b) => (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                  b.isUnlocked
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-3xl shadow-xs shrink-0">
                  {b.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      {b.title}
                    </h4>
                    {b.isUnlocked && (
                      <span className="text-[10px] text-emerald-600 font-bold">✓ Unlocked</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRAISE LETTERS (OFFICIAL ENGLISH ONLY AS REQUIRED) */}
      {activeTab === 'praise' && (
        <div className="mt-6">
          {latestLetter ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-end mb-3 no-print">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-900"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Praise Letter</span>
                </button>
              </div>

              {/* Formal Praise Letter Paper Card */}
              <div className="p-8 sm:p-12 rounded-3xl bg-amber-50/70 dark:bg-slate-800/90 border-4 border-amber-300 dark:border-amber-700/60 shadow-xl relative overflow-hidden font-serif">
                {/* Formal Seal Watermark */}
                <div className="absolute top-6 right-6 w-20 h-20 rounded-full border-4 border-amber-300/40 dark:border-amber-600/40 flex items-center justify-center text-amber-500/50 text-xs font-bold uppercase tracking-tighter transform rotate-12 pointer-events-none">
                  E-SMART SEAL
                </div>

                {/* Institution Header */}
                <div className="text-center pb-6 border-b-2 border-amber-200 dark:border-slate-700 mb-6 font-sans">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-widest block">
                    E-SMART ENGLISH KIDS PRIMARY INNOVATION
                  </span>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
                    LETTER OF COMMENDATION &amp; PRAISE
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Date: {latestLetter.date} · Aligned with 2018 General Education Curriculum
                  </p>
                </div>

                {/* Recipient */}
                <p className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                  To: <span className="text-amber-600 dark:text-amber-400 font-display">{latestLetter.recipient}</span>
                </p>

                {/* Headline */}
                <h4 className="font-bold text-base text-amber-800 dark:text-amber-200 mb-4 italic">
                  "{latestLetter.headline}"
                </h4>

                {/* Body */}
                <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-3 whitespace-pre-line mb-6 font-sans">
                  {latestLetter.letterBody}
                </div>

                {/* Highlights */}
                {latestLetter.keyHighlights && latestLetter.keyHighlights.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-700 mb-6 font-sans">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Key Highlights of Competence:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-200">
                      {latestLetter.keyHighlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-amber-500 font-bold">★</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sign Off */}
                <div className="pt-4 border-t border-amber-200 dark:border-slate-700 flex items-center justify-between font-sans">
                  <div>
                    <p className="text-xs text-slate-500 italic">
                      "{latestLetter.encouragementQuote}"
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {teacher.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {teacher.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
              <span className="text-4xl">💌</span>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-2">
                No Praise Letter Generated Yet
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tap the "Generate AI Praise Letter" button above to generate a formal personalized English letter for {student.fullName}.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OFFICIAL CERTIFICATE OF ACHIEVEMENT */}
      {activeTab === 'certificate' && (
        <div className="mt-6">
          {latestCert ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-end mb-3 no-print">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-900"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
              </div>

              {/* Certificate Canvas Frame */}
              <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border-8 border-amber-400 dark:border-amber-600 shadow-2xl relative text-center overflow-hidden">
                
                {/* Certificate Border Corner Ornaments */}
                <div className="absolute top-3 left-3 text-2xl text-amber-500">⚜️</div>
                <div className="absolute top-3 right-3 text-2xl text-amber-500">⚜️</div>
                <div className="absolute bottom-3 left-3 text-2xl text-amber-500">⚜️</div>
                <div className="absolute bottom-3 right-3 text-2xl text-amber-500">⚜️</div>

                <span className="font-display font-bold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-widest block mb-2">
                  E-SMART ENGLISH KIDS · 2018 GENERAL EDUCATION CURRICULUM
                </span>

                <h3 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-1">
                  CERTIFICATE OF ACHIEVEMENT
                </h3>
                <p className="text-xs text-slate-500 italic mb-6">
                  This official certificate is proudly presented to
                </p>

                {/* Recipient Big Name */}
                <div className="my-6">
                  <h2 className="font-display font-bold text-3xl sm:text-5xl text-amber-600 dark:text-amber-400 tracking-tight">
                    {latestCert.studentName}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                    Grade {latestCert.grade} · {latestCert.className} · ID: {latestCert.certificateNumber}
                  </p>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-200 max-w-lg mx-auto leading-relaxed mb-8">
                  for demonstrating outstanding excellence in English communicative competence, diligent phonics mastery, and exemplary digital citizenship in alignment with the 2018 General Education Curriculum.
                </p>

                {/* Footer with Signatures & QR Code */}
                <div className="pt-8 border-t-2 border-amber-300 dark:border-slate-700 grid grid-cols-3 items-end">
                  <div className="text-left">
                    <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {latestCert.leadTeacher}
                    </p>
                    <p className="text-[10px] text-slate-500">Lead English Educator</p>
                    <p className="text-[10px] text-slate-400 mt-1">{latestCert.issuedDate}</p>
                  </div>

                  {/* QR Code Verification */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-900" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">
                      VERIFY: {latestCert.certificateNumber}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      E-Smart Kids Board
                    </p>
                    <p className="text-[10px] text-slate-500">EdTech Innovation Council</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">Verified Official</p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
              <span className="text-4xl">📜</span>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-2">
                Certificate Ready to Issue
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tap the "Issue Certificate" button above to generate {student.fullName}'s official Certificate of Achievement.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
