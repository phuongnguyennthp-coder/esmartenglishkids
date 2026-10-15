import React, { useState, useEffect, useRef } from 'react';
import { UnitCurriculum } from '../../types/curriculum';
import { UserRole } from '../../types/user';
import { soundManager, speakText } from '../../utils/audio';
import { loadUserApiKey } from '../../utils/storage';
import { callGeminiWithFallback } from '../../services/geminiService';

interface MsPhuongAiChatboxProps {
  currentRole: UserRole;
  activeUnit?: UnitCurriculum;
  currentGrade?: 1 | 2;
  studentName?: string;
  onOpenApiKeyModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  audioText?: string;
}

export const MsPhuongAiChatbox: React.FC<MsPhuongAiChatboxProps> = ({
  currentRole,
  activeUnit,
  currentGrade = 1,
  studentName = 'bé',
  onOpenApiKeyModal,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'ai',
        text:
          currentRole === 'teacher' || currentRole === 'admin'
            ? `Xin chào đồng nghiệp! Tôi là Ms Phượng AI – Trợ lý sư phạm Tiếng Anh Tiểu học (Global Success 2018 GEC). Tôi có thể hỗ trợ cô soạn giáo án, câu đố phonics, hoạt động warm-up và bài tập phân hoá cho Lớp ${currentGrade}.`
            : `Chào ${studentName}! Cô Phượng đây! 🌸 Hôm nay chúng mình cùng học Unit ${
                activeUnit?.unitNumber || 1
              }: ${activeUnit?.title || 'English'} nhé! Con muốn hỏi cô điều gì nào?`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        audioText:
          currentRole === 'teacher'
            ? 'Hello teacher! I am Ms Phuong AI, your educational assistant.'
            : `Hello ${studentName}! I am Ms Phuong AI! Let us learn English together!`,
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const hasApiKey = Boolean(loadUserApiKey());

  // Quick suggestion prompts based on role and active unit
  const quickChips =
    currentRole === 'teacher' || currentRole === 'admin'
      ? [
          `Soạn 3 trò chơi warm-up cho Unit ${activeUnit?.unitNumber || 1}`,
          `Gợi ý bài tập phát âm phonics chữ ${activeUnit?.phonics.letter || 'B'}`,
          `Ý tưởng khen thưởng thi đua ClassDojo tuần này`,
          `Tạo 3 câu hỏi đánh giá nhanh cuối tiết`,
        ]
      : [
          `Cô đọc mẫu từ vựng Unit ${activeUnit?.unitNumber || 1} giúp con!`,
          `Đố con một câu tiếng Anh vui về bài này!`,
          `Làm sao để phát âm chuẩn âm /${activeUnit?.phonics.sound || 'b'}/?`,
          `Cô khen con một câu để con có động lực nha!`,
        ];

  // Offline / Fallback response generator grounded in current curriculum unit
  const getOfflinePedagogicalResponse = (userPrompt: string): string => {
    const p = userPrompt.toLowerCase();
    const unitTitle = activeUnit?.title || 'Tiếng Anh Tiểu Học';
    const vocabList = activeUnit?.vocabulary?.map((v) => `${v.word} (${v.meaningVi})`).join(', ') || 'book, ball, bike';
    const patternList = activeUnit?.sentencePatterns?.map((p) => p.pattern).join(' | ') || 'Touch your head!';
    const letter = activeUnit?.phonics?.letter || 'B';
    const sound = activeUnit?.phonics?.sound || 'b';

    if (currentRole === 'teacher' || currentRole === 'admin') {
      if (p.includes('warm-up') || p.includes('trò chơi') || p.includes('game')) {
        return `💡 **Gợi ý 3 Hoạt Động Khởi Động (Warm-up Games) cho Unit ${activeUnit?.unitNumber || 1}: ${unitTitle}**:\n\n1. **Flashcard Freeze Dance**: Bật nhạc bài hát của Unit, học sinh nhảy tự do. Khi nhạc dừng, giơ flashcard từ vựng (${vocabList}) – học sinh hô to từ và làm động tác mô phỏng.\n2. **Pass the Ball & Chant**: Chuyền bóng theo nhịp vè âm /${sound}/; bạn giữ bóng khi nhịp dứt sẽ nói 1 từ chứa âm /${sound}/.\n3. **Simon Says with Pattern**: Giáo viên dùng mẫu câu "${patternList}" để học sinh thực hiện phản xạ nhanh.`;
      }
      if (p.includes('phonics') || p.includes('phát âm')) {
        return `🔬 **Hướng dẫn sư phạm Phonics cho Unit ${activeUnit?.unitNumber || 1}**:\n- Âm trọng tâm: **/${sound}/** (Chữ cái **${letter}**).\n- Lưu ý cho học sinh Việt Nam: Học sinh hay quên bật âm đầu hoặc nhầm với âm /p/. Cho học sinh đặt một tờ giấy mỏng trước miệng, khi phát âm /b/ thì giấy không rung mạnh như /p/.\n- Từ luyện tập: ${vocabList}.`;
      }
      return `📚 **Thông tin bài học Unit ${activeUnit?.unitNumber || 1}: ${unitTitle}**:\n- Từ vựng trọng tâm: ${vocabList}\n- Mẫu câu giao tiếp: ${patternList}\n- Ngữ âm: Chữ cái ${letter}, âm /${sound}/.\nCô có thể tích hợp với Bảng thi đua ClassDojo để tặng điểm cho các bạn phát âm to rõ nhé!`;
    } else {
      // Student mode
      if (p.includes('đọc mẫu') || p.includes('từ vựng')) {
        return `Dạ đây nè bé ơi! 💕 Từ vựng trọng tâm của Unit ${activeUnit?.unitNumber || 1} gồm có: **${vocabList}**. Con bấm vào chiếc loa nhỏ bên cạnh để nghe cô phát âm chuẩn giọng Anh nhé! Giỏi lắm con! ⭐`;
      }
      if (p.includes('đố') || p.includes('câu hỏi')) {
        const firstWord = activeUnit?.vocabulary?.[0]?.word || 'book';
        const firstMeaning = activeUnit?.vocabulary?.[0]?.meaningVi || 'quyển sách';
        return `🎉 **Câu đố của Cô Phượng dành cho con đây:**\n\nTrong tiếng Anh, "${firstMeaning}" đọc là gì con nhỉ? Bắt đầu bằng chữ cái **${letter}** đó!\n\nA) ${firstWord}\nB) Cat\nC) Apple\n\nCon chọn đáp án nào nè? 🌟`;
      }
      if (p.includes('khen') || p.includes('động lực')) {
        return `🌟 **Cô Phượng khen bé yêu:**\nCon học bài rất chăm chỉ và ngoan ngoãn! Mỗi ngày con học thêm một từ tiếng Anh là con đang tiến thêm một bước thành công dân toàn cầu tí hon rồi đó! Tặng con 100 điểm sao sáng lấp lánh nhé! 🌸✨`;
      }
      return `Cô Phượng nghe rồi nè! 💖 Trong bài Unit ${activeUnit?.unitNumber || 1} này, chúng mình đang làm quen với âm **/${sound}/** và các từ: **${vocabList}**. Con hãy tự tin nói thật to theo cô nha: *${vocabList}*! Cố lên con yêu! 🎉`;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isThinking) return;

    soundManager.playDing();
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    const isTeacher = currentRole === 'teacher' || currentRole === 'admin';

    try {
      if (hasApiKey) {
        // Construct pedagogical grounding prompt
        const systemInstruction = isTeacher
          ? `You are Ms Hồng Phượng, Lead Primary English Specialist for Vietnam's 2018 General Education Curriculum (Grade 1 & 2 Global Success). 
You are speaking with a primary school teacher. Keep suggestions practical, pedagogically sound, encouraging, structured with bullet points.
Active Unit: Unit ${activeUnit?.unitNumber || 1}: ${activeUnit?.title || 'General'}
Target Phonics: Letter ${activeUnit?.phonics.letter || 'B'}, Sound /${activeUnit?.phonics.sound || 'b'}/
Vocabulary: ${activeUnit?.vocabulary?.map((v) => `${v.word} (${v.meaningVi})`).join(', ')}
Patterns: ${activeUnit?.sentencePatterns?.map((p) => p.pattern).join(' | ')}`
          : `You are Ms Phượng AI, a super friendly, warm, cheerful English teacher for Vietnamese primary school students (Grade 1 & 2, ages 6-7). 
Use simple English and friendly Vietnamese scaffolding. Keep sentences short, sweet, enthusiastic, full of cute emojis (🌸, ⭐, 🎈, 🐱).
Address the child gently as "bé" or "${studentName}". Encourage them to speak out loud.
Active Unit: Unit ${activeUnit?.unitNumber || 1}: ${activeUnit?.title || 'General'}
Letter: ${activeUnit?.phonics.letter || 'B'}, sound: /${activeUnit?.phonics.sound || 'b'}/
Words: ${activeUnit?.vocabulary?.map((v) => `${v.word} (${v.meaningVi})`).join(', ')}`;

        const prompt = `User said: "${text}". Please answer thoughtfully grounded in the curriculum.`;

        const res = await callGeminiWithFallback(prompt, { systemInstruction });
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: res.text,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          audioText: text.length < 100 ? text : undefined,
        };
        setMessages((prev) => [...prev, aiMsg]);
        soundManager.playStar();
      } else {
        // Offline Pedagogical Fallback
        await new Promise((r) => setTimeout(r, 600));
        const offlineReply = getOfflinePedagogicalResponse(text);
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: offlineReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        soundManager.playStar();
      }
    } catch (err: any) {
      console.warn('AI call error, falling back to pedagogical offline response:', err);
      const offlineReply = getOfflinePedagogicalResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: offlineReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING TRIGGER BUTTON (BOTTOM RIGHT) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => {
              soundManager.playStar();
              setIsOpen(true);
            }}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-2xl hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-3 border-white dark:border-slate-800 animate-bounce-subtle"
          >
            {/* Mascot Avatar Avatar */}
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/40">
              🌸
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[10px] font-black uppercase tracking-wider text-pink-100">
                {currentRole === 'teacher' ? 'Trợ Lý Sư Phạm' : 'Bạn Đồng Hành Tiếng Anh'}
              </span>
              <span className="block font-display font-black text-sm tracking-tight">
                MS PHƯỢNG AI
              </span>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white absolute -top-0.5 -right-0.5 animate-ping" />
            <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white absolute -top-0.5 -right-0.5" />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FLOATING EXPANDED CHAT PANEL */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-pink-400 dark:border-pink-600 flex flex-col overflow-hidden animate-scale-up">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/30 shadow-inner">
                🌸
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-sm text-white">
                    MS PHƯỢNG AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-yellow-300 text-amber-950 font-black text-[9px]">
                    2018 GEC
                  </span>
                </div>
                <p className="text-[10px] text-pink-100 font-medium">
                  {currentRole === 'teacher'
                    ? 'Trợ lý sư phạm Global Success Lớp ' + currentGrade
                    : `Bạn học tiếng Anh của ${studentName}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundManager.playDing();
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-black transition-all cursor-pointer"
                title="Thu nhỏ"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Active Unit Grounding Pill */}
          <div className="px-4 py-1.5 bg-pink-50 dark:bg-slate-800 border-b border-pink-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-pink-900 dark:text-pink-300">
            <span className="font-bold truncate">
              🎯 Đang học: Unit {activeUnit?.unitNumber || 1} ({activeUnit?.title || 'Global Success'})
            </span>
            <span className="font-bold text-[10px] text-pink-600 dark:text-pink-400 shrink-0">
              Lớp {currentGrade}
            </span>
          </div>

          {/* API Key notice banner if not set */}
          {!hasApiKey && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
              <span className="line-clamp-1">
                ⭐ Đang dùng Chế độ Thông Minh tích hợp.
              </span>
              {onOpenApiKeyModal && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="font-black underline text-amber-700 dark:text-amber-300 shrink-0 cursor-pointer"
                >
                  Nhập Key
                </button>
              )}
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-amber-300 text-white flex items-center justify-center text-sm shrink-0 shadow-xs">
                      🌸
                    </div>
                  )}

                  <div className={`space-y-1 max-w-[80%]`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                        isAi
                          ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                          : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div
                      className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                        isAi ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isAi && (
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playDing();
                            speakText(msg.audioText || msg.text.replace(/[\*\#\_]/g, ''));
                          }}
                          className="hover:text-pink-600 dark:hover:text-pink-400 flex items-center gap-0.5 cursor-pointer"
                          title="Nghe cô Phượng đọc"
                        >
                          <span>🔊</span>
                          <span>Nghe</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-slate-800 flex items-center justify-center text-xs animate-spin">
                  🌸
                </div>
                <span className="font-medium animate-pulse">
                  Cô Phượng đang soạn câu trả lời...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/60 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-pink-100 dark:hover:bg-pink-950/60 text-slate-700 dark:text-slate-300 hover:text-pink-800 dark:hover:text-pink-200 font-medium text-[11px] whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder={
                currentRole === 'teacher'
                  ? 'Hỏi cô Phượng về giáo án, bài giảng, trò chơi...'
                  : `Hỏi cô Phượng bất cứ điều gì con nhé...`
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-hidden border border-transparent focus:border-pink-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 disabled:opacity-50 text-white font-display font-black text-xs shadow-md hover:scale-103 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Gửi</span>
              <span>🚀</span>
            </button>
          </form>

        </div>
      )}
    </>
  );
};
