import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { DOJO_CATEGORIES, DojoCategory, PointTransaction, TeamId, TEAMS } from '../../types/competition';
import { StudentRecord } from '../../types/user';
import { soundManager } from '../../utils/audio';
import {
  awardClassPoints,
  awardDojoPoint,
  awardTeamPoints,
  getDefaultTeamForStudent,
  getStudentSummaries,
  getTeamStandings,
  loadTransactions,
  resetCompetitionPoints,
  setStudentTeam,
} from '../../utils/competitionManager';

interface ClassDojoCompetitionProps {
  students: StudentRecord[];
  currentTeacherName?: string;
  isTeacherMode?: boolean;
  selectedClass?: string;
  onStudentUpdated?: () => void;
}

export const ClassDojoCompetition: React.FC<ClassDojoCompetitionProps> = ({
  students,
  currentTeacherName = 'Ms Hồng Phượng',
  isTeacherMode = false,
  selectedClass: initialClass,
  onStudentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'teams' | 'leaderboard' | 'history'>('grid');
  const [filterClass, setFilterClass] = useState<string>(initialClass || 'All');
  const [selectedStudentForAward, setSelectedStudentForAward] = useState<StudentRecord | null>(null);
  const [selectedTeamForAward, setSelectedTeamForAward] = useState<TeamId | null>(null);
  const [isAwardingWholeClass, setIsAwardingWholeClass] = useState<boolean>(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'positive' | 'needs_work'>('positive');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Available classes
  const classOptions = ['All', 'Class 1/1', 'Class 1/2', 'Class 2/3', 'Class 2/4'];

  // Filter students based on selected class and search
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = filterClass === 'All' || s.className === filterClass;
      const matchSearch =
        searchQuery.trim() === '' ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [students, filterClass, searchQuery]);

  // Summaries and Standings with refresh trigger
  const summaries = useMemo(() => {
    return getStudentSummaries(filteredStudents);
  }, [filteredStudents, refreshKey]);

  const teamStandings = useMemo(() => {
    return getTeamStandings(filteredStudents);
  }, [filteredStudents, refreshKey]);

  const transactions = useMemo(() => {
    const all = loadTransactions();
    if (filterClass === 'All') return all;
    return all.filter((tx) => tx.className === filterClass);
  }, [filterClass, refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
    if (onStudentUpdated) onStudentUpdated();
  };

  // Handle Awarding Single Student
  const handleAwardSingle = (cat: DojoCategory) => {
    if (!selectedStudentForAward) return;

    if (cat.delta > 0) {
      soundManager.playStar();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      soundManager.playBuzzer();
    }

    awardDojoPoint(selectedStudentForAward, cat, currentTeacherName);
    setSelectedStudentForAward(null);
    triggerRefresh();
  };

  // Handle Awarding Entire Team
  const handleAwardTeam = (cat: DojoCategory) => {
    if (!selectedTeamForAward) return;
    const teamStudents = filteredStudents.filter(
      (s) => getDefaultTeamForStudent(s) === selectedTeamForAward
    );

    if (cat.delta > 0) {
      soundManager.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } else {
      soundManager.playBuzzer();
    }

    awardTeamPoints(teamStudents, cat, currentTeacherName);
    setSelectedTeamForAward(null);
    triggerRefresh();
  };

  // Handle Awarding Whole Class
  const handleAwardWholeClass = (cat: DojoCategory) => {
    if (cat.delta > 0) {
      soundManager.playVictory();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.4 },
      });
    } else {
      soundManager.playBuzzer();
    }

    awardClassPoints(filteredStudents, cat, currentTeacherName);
    setIsAwardingWholeClass(false);
    triggerRefresh();
  };

  const positiveCategories = DOJO_CATEGORIES.filter((c) => c.type === 'positive');
  const needsWorkCategories = DOJO_CATEGORIES.filter((c) => c.type === 'needs_work');

  // Top 10 Students
  const topStudents = useMemo(() => {
    return [...summaries].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 10);
  }, [summaries]);

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl border-4 border-emerald-400">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-emerald-100">
              <span>🏆 E-Smart ClassDojo Competition</span>
              <span>·</span>
              <span>Thi Đua Điểm Tích Cực</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              Bảng Thi Đua Lớp Học & 4 Biệt Đội 🦁🐬🦅🐼
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl font-medium">
              Khen thưởng tức thì, rèn luyện thói quen học tập tốt và cùng đồng đội tích lũy điểm sao rực rỡ!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isTeacherMode && (
              <>
                <button
                  type="button"
                  onClick={() => setIsAwardingWholeClass(true)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>🎉</span>
                  <span>Tặng Điểm Cả Lớp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="px-3 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all cursor-pointer"
                  title="Đặt lại bảng điểm cho tuần mới"
                >
                  🔄 Reset Tuần
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Tab Navigation Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Class Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Lớp:
          </span>
          {classOptions.map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setFilterClass(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterClass === cls
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cls === 'All' ? 'Tất cả (140 HS)' : cls}
            </button>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            👥 Học Sinh ({summaries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teams')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'teams'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🛡️ 4 Biệt Đội
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🏅 Vinh Danh
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📜 Nhật Ký ({transactions.length})
          </button>
        </div>

      </div>

      {/* SEARCH BAR (For grid tab) */}
      {activeTab === 'grid' && (
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm học sinh theo tên hoặc mã định danh (vd: Minh Anh, G1-001)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent border-none outline-hidden text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CLASSROOM GRID (STUDENTS MONSTER CARDS) */}
      {/* ========================================================================= */}
      {activeTab === 'grid' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {summaries.map((summary) => {
              const fullRecord = students.find((s) => s.studentId === summary.studentId);
              const team = TEAMS[summary.teamId];

              return (
                <div
                  key={summary.studentId}
                  onClick={() => {
                    if (isTeacherMode && fullRecord) {
                      soundManager.playDing();
                      setSelectedStudentForAward(fullRecord);
                    }
                  }}
                  className={`relative p-4 rounded-3xl border-2 transition-all group flex flex-col items-center text-center ${
                    isTeacherMode
                      ? 'cursor-pointer hover:scale-103 hover:shadow-lg ' + team.colorBorder
                      : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800`}
                >
                  {/* Team Badge pill */}
                  <div className="absolute top-2 left-2.5 flex items-center gap-1">
                    <span className="text-xs">{team.emoji}</span>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {summary.className.replace('Class ', '')}
                    </span>
                  </div>

                  {/* Points Badge */}
                  <div className="absolute top-2 right-2.5">
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-black shadow-xs ${
                        summary.totalPoints >= 0
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {summary.totalPoints > 0 ? `+${summary.totalPoints}` : summary.totalPoints}
                    </div>
                  </div>

                  {/* Cute Student Avatar / Monster */}
                  <div className="mt-4 mb-2 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-slate-700 dark:to-slate-600 transform group-hover:rotate-6 transition-transform">
                    {team.emoji}
                  </div>

                  {/* Student Name */}
                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                    {summary.fullName}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {summary.studentId} · {team.nameVi}
                  </p>

                  {/* Action prompt for teacher */}
                  {isTeacherMode ? (
                    <div className="mt-3 w-full py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      + Tặng Điểm
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-slate-400">
                      {summary.positiveCount} khen ngợi
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {summaries.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Không tìm thấy học sinh phù hợp với bộ lọc.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TEAMS / HOUSES STANDINGS */}
      {/* ========================================================================= */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamStandings.map((team, idx) => (
              <div
                key={team.teamId}
                className={`p-5 rounded-3xl border-3 shadow-md bg-white dark:bg-slate-800 ${team.colorBorder} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{team.emoji}</span>
                      <div>
                        <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                          {team.nameVi}
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {team.nameEn}
                        </p>
                      </div>
                    </div>
                    <span className="text-xl">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '4️⃣'}
                    </span>
                  </div>

                  <div className="my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-around text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">
                        Tổng Điểm
                      </span>
                      <span className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">
                        {team.totalPoints > 0 ? `+${team.totalPoints}` : team.totalPoints}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">
                        Thành Viên
                      </span>
                      <span className="font-display font-black text-2xl text-slate-700 dark:text-slate-200">
                        {team.studentCount}
                      </span>
                    </div>
                  </div>
                </div>

                {isTeacherMode && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playDing();
                      setSelectedTeamForAward(team.teamId);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display font-black text-xs shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>⭐</span>
                    <span>Tặng Điểm Toàn Đội</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Roster of each team */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
              📋 Danh Sách Thành Viên Từng Biệt Đội ({filterClass})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(TEAMS) as TeamId[]).map((tid) => {
                const team = TEAMS[tid];
                const teamMembers = summaries.filter((s) => s.teamId === tid);

                return (
                  <div
                    key={tid}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{team.emoji}</span>
                        <span>{team.nameVi}</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {teamMembers.length} bạn
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {teamMembers.map((m) => (
                        <div
                          key={m.studentId}
                          className="flex items-center justify-between p-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs shadow-2xs"
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                            {m.fullName}
                          </span>
                          <span className="font-black text-[11px] text-emerald-600">
                            +{m.totalPoints}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LEADERBOARD / PODIUM */}
      {/* ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Top 3 Podium */}
          {topStudents.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto pt-6 items-end">
              {/* 2nd place */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border-2 border-slate-300 dark:border-slate-600 text-center shadow-lg transform translate-y-3">
                <span className="text-3xl block mb-1">🥈</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black uppercase">
                  Hạng 2
                </span>
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-2 line-clamp-1">
                  {topStudents[1]?.fullName}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {topStudents[1]?.className}
                </p>
                <div className="mt-2 font-display font-black text-lg text-emerald-600">
                  +{topStudents[1]?.totalPoints} pts
                </div>
              </div>

              {/* 1st place */}
              <div className="bg-gradient-to-b from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/20 p-5 rounded-3xl border-4 border-amber-400 text-center shadow-2xl scale-105 z-10">
                <span className="text-4xl block mb-1 animate-bounce">👑</span>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase shadow-xs">
                  Quán Quân
                </span>
                <h4 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white mt-2 line-clamp-1">
                  {topStudents[0]?.fullName}
                </h4>
                <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                  {topStudents[0]?.className} · {TEAMS[topStudents[0]?.teamId].nameVi}
                </p>
                <div className="mt-2 font-display font-black text-2xl text-amber-600">
                  +{topStudents[0]?.totalPoints} pts
                </div>
              </div>

              {/* 3rd place */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border-2 border-amber-600/40 text-center shadow-lg transform translate-y-6">
                <span className="text-3xl block mb-1">🥉</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                  Hạng 3
                </span>
                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-2 line-clamp-1">
                  {topStudents[2]?.fullName}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {topStudents[2]?.className}
                </p>
                <div className="mt-2 font-display font-black text-lg text-emerald-600">
                  +{topStudents[2]?.totalPoints} pts
                </div>
              </div>
            </div>
          )}

          {/* Top 10 Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
              🌟 Bảng Vinh Danh Top 10 Cá Nhân Xuất Sắc Nhất
            </h3>
            <div className="space-y-2">
              {topStudents.map((s, idx) => {
                const team = TEAMS[s.teamId];
                return (
                  <div
                    key={s.studentId}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-display font-black text-xs ${
                          idx === 0
                            ? 'bg-amber-400 text-amber-950'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                            {s.fullName}
                          </span>
                          <span className="text-xs">{team.emoji}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {s.className} · {s.studentId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        {s.positiveCount} lần khen ngợi
                      </span>
                      <span className="font-display font-black text-base text-emerald-600">
                        +{s.totalPoints} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT TRANSACTION LOG */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              📜 Lịch Sử Ghi Nhận Điểm Thi Đua (Audit Log)
            </h3>
            <span className="text-xs text-slate-400">
              Tổng cộng: {transactions.length} lượt
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tx.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {tx.studentName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {tx.className}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {tx.categoryTitle} {tx.note && `· "${tx.note}"`}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Ghi nhận bởi {tx.awardedBy} · {new Date(tx.timestamp).toLocaleTimeString('vi-VN')} {new Date(tx.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl font-display font-black text-sm ${
                    tx.delta > 0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {tx.delta > 0 ? `+${tx.delta}` : tx.delta}
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                Chưa có lượt ghi nhận điểm thi đua nào trong tuần này.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AWARD POINT TO STUDENT / TEAM / CLASS */}
      {/* ========================================================================= */}
      {(selectedStudentForAward || selectedTeamForAward || isAwardingWholeClass) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-emerald-400 animate-scale-up space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                  {selectedStudentForAward
                    ? 'Tặng Điểm Cá Nhân'
                    : selectedTeamForAward
                    ? `Tặng Điểm Toàn Đội ${TEAMS[selectedTeamForAward].nameVi}`
                    : `Tặng Điểm Tập Thể ${filterClass}`}
                </span>
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  {selectedStudentForAward
                    ? selectedStudentForAward.fullName
                    : selectedTeamForAward
                    ? `${TEAMS[selectedTeamForAward].emoji} ${TEAMS[selectedTeamForAward].nameVi}`
                    : `Toàn thể học sinh (${filteredStudents.length} bạn)`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudentForAward(null);
                  setSelectedTeamForAward(null);
                  setIsAwardingWholeClass(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Category Type Switcher (Positive vs Needs Work) */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-700 p-1">
              <button
                type="button"
                onClick={() => setActiveCategoryTab('positive')}
                className={`flex-1 py-2 rounded-xl text-xs font-display font-black transition-all cursor-pointer ${
                  activeCategoryTab === 'positive'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                🌟 Khen Ngợi Tích Cực (+)
              </button>
              {selectedStudentForAward && (
                <button
                  type="button"
                  onClick={() => setActiveCategoryTab('needs_work')}
                  className={`flex-1 py-2 rounded-xl text-xs font-display font-black transition-all cursor-pointer ${
                    activeCategoryTab === 'needs_work'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  💪 Cần Cố Gắng Thêm (-)
                </button>
              )}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {(activeCategoryTab === 'positive' ? positiveCategories : needsWorkCategories).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (selectedStudentForAward) handleAwardSingle(cat);
                    else if (selectedTeamForAward) handleAwardTeam(cat);
                    else if (isAwardingWholeClass) handleAwardWholeClass(cat);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all hover:scale-102 cursor-pointer flex flex-col justify-between ${
                    cat.type === 'positive'
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500'
                      : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-display font-black text-xs ${
                        cat.delta > 0
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-amber-200 text-amber-900'
                      }`}
                    >
                      {cat.delta > 0 ? `+${cat.delta}` : cat.delta}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      {cat.titleVi}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {cat.titleEn}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400">
                Điểm sẽ được tự động cộng vào hồ sơ học sinh và xếp hạng biệt đội.
              </span>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 border-2 border-rose-300">
            <span className="text-4xl block">⚠️</span>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Đặt lại bảng thi đua tuần?
            </h3>
            <p className="text-xs text-slate-500">
              Thao tác này sẽ xoá toàn bộ lịch sử điểm thi đua tạm thời để bắt đầu tuần học mới. Điểm sao/xu tích luỹ học tập của học sinh vẫn được bảo toàn.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  resetCompetitionPoints();
                  setShowConfirmReset(false);
                  triggerRefresh();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md"
              >
                Xác nhận Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
