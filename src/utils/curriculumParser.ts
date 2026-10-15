import { GradeLevel, Unit, VocabWord, SentencePattern, PhonicsItem, ListeningActivity } from '../types/curriculum';
import { CurriculumUnitRecord, SupportedFileType, ValidationIssue } from '../types/curriculumImport';

/**
 * Normalizes text for lenient header and field matching
 */
export function normalizeKey(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Maps common emoji icons to vocabulary words based on word semantics
 */
export function inferWordEmoji(word: string): string {
  const w = (word || '').toLowerCase().trim();
  const emojiMap: Record<string, string> = {
    // Grade 1 & 2 common items
    ball: '⚽',
    book: '📚',
    bike: '🚲',
    boy: '👦',
    girl: '👧',
    cat: '🐱',
    car: '🚗',
    cake: '🎂',
    cup: '☕',
    dog: '🐶',
    door: '🚪',
    duck: '🦆',
    desk: '🪑',
    apple: '🍎',
    ant: '🐜',
    bag: '🎒',
    pen: '🖊️',
    pencil: '✏️',
    ruler: '📏',
    rubber: '🧼',
    eraser: '🧼',
    school: '🏫',
    teacher: '👩‍🏫',
    friend: '🤝',
    fish: '🐟',
    fox: '🦊',
    hat: '🧢',
    hand: '✋',
    hair: '💇',
    horse: '🐴',
    house: '🏠',
    home: '🏡',
    kite: '🪁',
    monkey: '🐒',
    mango: '🥭',
    mother: '👩',
    father: '👨',
    brother: '👦',
    sister: '👧',
    baby: '👶',
    sun: '☀️',
    sea: '🌊',
    sand: '🏖️',
    tree: '🌳',
    tiger: '🐯',
    zoo: '🦁',
    one: '1️⃣',
    two: '2️⃣',
    three: '3️⃣',
    four: '4️⃣',
    five: '5️⃣',
    six: '6️⃣',
    seven: '7️⃣',
    eight: '8️⃣',
    nine: '9️⃣',
    ten: '🔟',
    red: '🔴',
    blue: '🔵',
    yellow: '🟡',
    green: '🟢',
    white: '⚪',
    black: '⚫',
  };

  return emojiMap[w] || '✨';
}

/**
 * Auto-generates basic listening activities from a unit's vocabulary
 */
export function generateDefaultListeningActivities(unitNumber: number, words: VocabWord[]): ListeningActivity[] {
  if (words.length === 0) return [];
  const validWords = words.filter((w) => w.word);

  return validWords.slice(0, 3).map((targetWord, idx) => {
    // Pick 2 distractor words
    const distractors = validWords.filter((w) => w.id !== targetWord.id).slice(0, 2);
    const options = [
      { id: `opt-${unitNumber}-${idx}-correct`, text: targetWord.word, imageEmoji: targetWord.imageEmoji || '✨', isCorrect: true },
      ...distractors.map((d, dIdx) => ({
        id: `opt-${unitNumber}-${idx}-dist-${dIdx}`,
        text: d.word,
        imageEmoji: d.imageEmoji || '✨',
        isCorrect: false,
      })),
    ].sort(() => Math.random() - 0.5);

    return {
      id: `la-u${unitNumber}-${idx + 1}`,
      type: 'choose',
      questionPrompt: `Listen and point to the correct picture: "${targetWord.word}"`,
      audioPrompt: targetWord.word,
      options,
    };
  });
}

/**
 * Validates a parsed unit and returns issues
 */
export function validateUnitRecord(unit: CurriculumUnitRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Unit Number Check
  if (!unit.unitNumber || isNaN(unit.unitNumber) || unit.unitNumber < 1) {
    issues.push({
      id: `err-unit-no-${unit.id}`,
      level: 'error',
      field: 'unitNumber',
      message: 'Số thứ tự Unit không hợp lệ hoặc bị bỏ trống.',
      suggestion: 'Điền số thứ tự Unit (ví dụ: 1, 2, 3...).',
    });
  }

  // Title Check
  if (!unit.title || !unit.title.trim()) {
    issues.push({
      id: `err-title-${unit.id}`,
      level: 'error',
      field: 'title',
      message: 'Tiêu đề Unit Tiếng Anh chưa được cung cấp.',
      suggestion: 'Điền tên chính thức của Unit trong SGK Global Success.',
    });
  }

  if (!unit.titleVi || !unit.titleVi.trim()) {
    issues.push({
      id: `warn-titleVi-${unit.id}`,
      level: 'warning',
      field: 'titleVi',
      message: 'Chưa có tên Tiếng Việt cho Unit.',
      suggestion: 'Bổ sung nghĩa Tiếng Việt để các bé dễ hiểu.',
    });
  }

  // Vocabulary Check
  if (!unit.vocabulary || unit.vocabulary.length === 0) {
    issues.push({
      id: `err-vocab-${unit.id}`,
      level: 'error',
      field: 'vocabulary',
      message: 'Unit chưa có từ vựng nào.',
      suggestion: 'Cần ít nhất 2 đến 4 từ vựng trọng tâm cho mỗi Unit.',
    });
  } else {
    unit.vocabulary.forEach((v, idx) => {
      if (!v.word || !v.word.trim()) {
        issues.push({
          id: `err-word-${unit.id}-${idx}`,
          level: 'error',
          field: `vocabulary[${idx}].word`,
          message: `Từ vựng thứ ${idx + 1} bị trống từ tiếng Anh.`,
        });
      }
      if (!v.meaningVi || !v.meaningVi.trim()) {
        issues.push({
          id: `warn-meaning-${unit.id}-${idx}`,
          level: 'warning',
          field: `vocabulary[${idx}].meaningVi`,
          message: `Từ "${v.word || idx + 1}" chưa có nghĩa tiếng Việt.`,
        });
      }
      if (!v.phonetic || !v.phonetic.trim()) {
        issues.push({
          id: `info-phonetic-${unit.id}-${idx}`,
          level: 'info',
          field: `vocabulary[${idx}].phonetic`,
          message: `Từ "${v.word}" chưa có phiên âm IPA.`,
        });
      }
    });
  }

  // Phonics Check
  if (!unit.targetLetter || !unit.targetLetter.trim()) {
    issues.push({
      id: `warn-phonics-letter-${unit.id}`,
      level: 'warning',
      field: 'targetLetter',
      message: 'Chưa xác định chữ cái âm trọng tâm (Target Letter).',
    });
  }

  if (!unit.phonicsSound || !unit.phonicsSound.trim()) {
    issues.push({
      id: `warn-phonics-sound-${unit.id}`,
      level: 'warning',
      field: 'phonicsSound',
      message: 'Chưa xác định âm ngữ âm (Phonics Sound, ví dụ /b/, /k/).',
    });
  }

  // Sentence Patterns Check
  if (!unit.sentencePatterns || unit.sentencePatterns.length === 0) {
    issues.push({
      id: `warn-sentence-${unit.id}`,
      level: 'warning',
      field: 'sentencePatterns',
      message: 'Chưa có mẫu câu giao tiếp trọng tâm cho Unit.',
    });
  }

  return issues;
}

/**
 * Universal CSV / TSV text splitter respecting quoted strings
 */
export function parseDelimitedText(rawText: string): string[][] {
  const lines: string[][] = [];
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (!text.trim()) return [];

  // Detect delimiter: comma, tab, or semicolon
  const firstLine = text.split('\n')[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  let delimiter = ',';
  if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';
  else if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';

  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\n' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      // Only push non-empty rows
      if (currentRow.some((c) => c.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Maps parsed spreadsheet rows into structured CurriculumUnitRecords
 */
export function mapTableRowsToCurriculumUnits(
  rows: string[][],
  grade: GradeLevel,
  fileName: string,
  fileType: SupportedFileType
): CurriculumUnitRecord[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeKey);

  // Identify column indices
  const findCol = (aliases: string[]): number => {
    return headers.findIndex((h) => aliases.some((a) => h.includes(normalizeKey(a))));
  };

  const colUnit = findCol(['unit', 'unitno', 'bai', 'sttunit', 'lessonunit']);
  const colTitle = findCol(['title', 'tenbai', 'unittitle', 'chude', 'topic', 'name']);
  const colTitleVi = findCol(['titlevi', 'tenbaivi', 'nghiatiengviet', 'tiengviet', 'chudevi', 'nghiabai']);
  const colTheme = findCol(['theme', 'topic', 'chude']);
  const colWord = findCol(['word', 'tuvung', 'vocab', 'vocabulary', 'tu', 'targetword']);
  const colMeaningVi = findCol(['meaning', 'meaningvi', 'nghia', 'dich', 'nghiatu']);
  const colPhonetic = findCol(['phonetic', 'ipa', 'phienam', 'phatam']);
  const colLetter = findCol(['letter', 'targetletter', 'chucai', 'amchu']);
  const colSound = findCol(['sound', 'phonicssound', 'am', 'nguam']);
  const colExample = findCol(['example', 'examplesentence', 'vidu', 'cauvidu']);
  const colPattern = findCol(['pattern', 'sentence', 'sentencepattern', 'mauca', 'maucau', 'cautruc']);
  const colPatternVi = findCol(['patternvi', 'nghiamaucau', 'dichmaucau']);
  const colChant = findCol(['chant', 'song', 'lyrics', 'baive', 'baihat']);

  // Temporary aggregation map keyed by unit number
  const unitMap = new Map<number, {
    unitNumber: number;
    title: string;
    titleVi: string;
    theme: string;
    targetLetter: string;
    phonicsSound: string;
    words: VocabWord[];
    patterns: SentencePattern[];
    chantLyrics: string[];
  }>();

  let lastUnitNum = 1;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    // Unit Number resolution
    const rawUnitStr = colUnit !== -1 ? row[colUnit] : '';
    const extractedNum = parseInt((rawUnitStr || '').replace(/[^0-9]/g, ''), 10);
    const unitNum = !isNaN(extractedNum) && extractedNum > 0 ? extractedNum : lastUnitNum;
    lastUnitNum = unitNum;

    // Ensure bucket exists
    if (!unitMap.has(unitNum)) {
      unitMap.set(unitNum, {
        unitNumber: unitNum,
        title: colTitle !== -1 && row[colTitle] ? row[colTitle] : `Unit ${unitNum}`,
        titleVi: colTitleVi !== -1 && row[colTitleVi] ? row[colTitleVi] : '',
        theme: colTheme !== -1 && row[colTheme] ? row[colTheme] : 'School & Friends',
        targetLetter: colLetter !== -1 && row[colLetter] ? row[colLetter] : '',
        phonicsSound: colSound !== -1 && row[colSound] ? row[colSound] : '',
        words: [],
        patterns: [],
        chantLyrics: [],
      });
    }

    const current = unitMap.get(unitNum)!;

    // Update unit metadata if provided on this row
    if (colTitle !== -1 && row[colTitle] && !current.title.includes(row[colTitle])) {
      current.title = row[colTitle];
    }
    if (colTitleVi !== -1 && row[colTitleVi] && !current.titleVi) {
      current.titleVi = row[colTitleVi];
    }
    if (colLetter !== -1 && row[colLetter] && !current.targetLetter) {
      current.targetLetter = row[colLetter];
    }
    if (colSound !== -1 && row[colSound] && !current.phonicsSound) {
      current.phonicsSound = row[colSound];
    }

    // Extract Word
    const wordText = colWord !== -1 ? (row[colWord] || '').trim() : '';
    if (wordText && !current.words.some((w) => w.word.toLowerCase() === wordText.toLowerCase())) {
      const meaningText = colMeaningVi !== -1 ? (row[colMeaningVi] || '').trim() : '';
      const phoneticText = colPhonetic !== -1 ? (row[colPhonetic] || '').trim() : '';
      const exampleText = colExample !== -1 ? (row[colExample] || '').trim() : '';

      current.words.push({
        id: `imp-w-${unitNum}-${current.words.length + 1}`,
        word: wordText,
        meaningVi: meaningText,
        phonetic: phoneticText,
        letter: current.targetLetter || (wordText[0] || '').toLowerCase(),
        imageEmoji: inferWordEmoji(wordText),
        exampleSentence: exampleText || `I like the ${wordText}.`,
        audioText: wordText,
      });
    }

    // Extract Sentence Pattern
    const patternText = colPattern !== -1 ? (row[colPattern] || '').trim() : '';
    if (patternText && !current.patterns.some((p) => p.pattern.toLowerCase() === patternText.toLowerCase())) {
      const patternViText = colPatternVi !== -1 ? (row[colPatternVi] || '').trim() : '';
      const scramble = patternText.split(' ').filter(Boolean);

      current.patterns.push({
        id: `imp-sp-${unitNum}-${current.patterns.length + 1}`,
        pattern: patternText,
        patternVi: patternViText,
        dialogue: [
          { speaker: 'Smarty', avatar: '🦉', textEn: patternText, textVi: patternViText, audioText: patternText },
        ],
        scrambleWords: scramble,
        correctOrder: scramble,
        rolePlayPrompts: [
          { character: 'Bimi', prompt: patternText, expectedReply: patternText },
        ],
      });
    }

    // Extract Chant
    if (colChant !== -1 && row[colChant]) {
      const lyrics = row[colChant].split('\n').map((l) => l.trim()).filter(Boolean);
      current.chantLyrics.push(...lyrics);
    }
  }

  // Convert map to CurriculumUnitRecord array
  const result: CurriculumUnitRecord[] = Array.from(unitMap.values()).map((u) => {
    const letter = u.targetLetter || (u.words[0] ? u.words[0].word[0].toUpperCase() : 'A');
    const sound = u.phonicsSound || `/${letter.toLowerCase()}/`;

    const phonics: PhonicsItem = {
      id: `ph-imp-u${u.unitNumber}`,
      letter,
      sound,
      soundTip: `Listen carefully and pronounce the sound: ${sound}, ${sound}, ${u.words[0]?.word || ''}!`,
      soundTipVi: `Hãy lắng nghe và phát âm chuẩn âm: ${sound}!`,
      blendingExamples: u.words.slice(0, 3).map((w) => ({
        onset: (w.word[0] || '').toLowerCase(),
        rime: w.word.slice(1) || 'at',
        word: w.word,
        emoji: w.imageEmoji || '✨',
      })),
      segmentingWords: u.words.slice(0, 2).map((w) => ({
        word: w.word,
        sounds: [sound, w.word.slice(1)],
      })),
    };

    const listeningActivities = generateDefaultListeningActivities(u.unitNumber, u.words);

    const record: CurriculumUnitRecord = {
      id: `cur-g${grade}-u${u.unitNumber}`,
      unitNumber: u.unitNumber,
      grade,
      title: u.title,
      titleVi: u.titleVi || u.title,
      theme: u.theme,
      themeEmoji: u.words[0]?.imageEmoji || '📖',
      targetLetter: letter,
      phonicsSound: sound,
      storyTopic: u.title,
      vocabulary: u.words,
      sentencePatterns: u.patterns,
      phonics,
      listeningActivities,
      speakingPrompts: u.words.slice(0, 2).map((w) => ({
        aiPrompt: `Can you say the word: "${w.word}"?`,
        suggestedStudentReply: w.word,
        hint: `Press the microphone and say "${w.word}" loud and clear!`,
      })),
      funTime: {
        chantTitle: `${u.title} Fun Chant`,
        chantLyrics: u.chantLyrics.length > 0 ? u.chantLyrics : [
          `${letter}, ${letter}, ${sound}!`,
          `Look at the ${u.words[0]?.word || 'book'}!`,
          `Listen to the sound: ${sound}!`,
        ],
        gameType: 'wheel',
        gameInstruction: 'Quay vòng quay may mắn và phát âm to từ vựng tiếng Anh nhé!',
        funQuestions: u.words.slice(0, 3).map((w, qIdx) => ({
          prompt: `What is this word: "${w.word}"?`,
          options: [w.meaningVi, 'Quyển vở', 'Cây bút'],
          correctIndex: 0,
          emoji: w.imageEmoji || '✨',
          soundHint: w.word,
        })),
        actionChallenge: `Con hãy tìm một đồ vật ${u.words[0]?.word || 'book'} trong phòng nhé!`,
      },
      sourceFileName: fileName,
      sourceFileType: fileType,
      status: 'draft',
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officialSourceRef: `Global Success Grade ${grade} - Bộ GD&ĐT 2018`,
      validationIssues: [],
    };

    // Run validation
    const issues = validateUnitRecord(record);
    record.validationIssues = issues;
    record.status = issues.some((i) => i.level === 'error') ? 'draft' : 'validated';

    return record;
  });

  return result.sort((a, b) => a.unitNumber - b.unitNumber);
}

/**
 * Universal JSON parser for curriculum files
 */
export function parseCurriculumJSON(
  rawJson: string,
  targetGrade: GradeLevel,
  fileName: string
): CurriculumUnitRecord[] {
  const parsed = JSON.parse(rawJson);
  const unitsArray: any[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.units)
    ? parsed.units
    : typeof parsed === 'object' && parsed !== null
    ? [parsed]
    : [];

  if (unitsArray.length === 0) {
    throw new Error('Không tìm thấy danh sách Unit nào trong file JSON đã tải lên.');
  }

  return unitsArray.map((u, idx) => {
    const unitNumber = u.unitNumber || u.unit || u.number || idx + 1;
    const words: VocabWord[] = (u.vocabulary || u.words || []).map((w: any, wIdx: number) => ({
      id: w.id || `imp-json-w-${unitNumber}-${wIdx + 1}`,
      word: (w.word || w.term || '').trim(),
      meaningVi: (w.meaningVi || w.meaning || w.vietnamese || '').trim(),
      phonetic: (w.phonetic || w.ipa || '').trim(),
      letter: (w.letter || (w.word ? w.word[0] : '')).toLowerCase(),
      imageEmoji: w.imageEmoji || inferWordEmoji(w.word || ''),
      exampleSentence: w.exampleSentence || w.example || `Look at the ${w.word || ''}.`,
      audioText: w.audioText || w.word || '',
    }));

    const patterns: SentencePattern[] = (u.sentencePatterns || u.patterns || []).map((p: any, pIdx: number) => ({
      id: p.id || `imp-json-sp-${unitNumber}-${pIdx + 1}`,
      pattern: (p.pattern || p.sentence || '').trim(),
      patternVi: (p.patternVi || p.meaningVi || '').trim(),
      dialogue: p.dialogue || [
        { speaker: 'Smarty', avatar: '🦉', textEn: p.pattern, textVi: p.patternVi, audioText: p.pattern },
      ],
      scrambleWords: p.scrambleWords || (p.pattern ? p.pattern.split(' ').filter(Boolean) : []),
      correctOrder: p.correctOrder || (p.pattern ? p.pattern.split(' ').filter(Boolean) : []),
      rolePlayPrompts: p.rolePlayPrompts || [],
    }));

    const targetLetter = u.targetLetter || u.letter || (words[0] ? words[0].word[0].toUpperCase() : 'A');
    const phonicsSound = u.phonicsSound || u.sound || `/${targetLetter.toLowerCase()}/`;

    const phonics: PhonicsItem = u.phonics || {
      id: `ph-json-u${unitNumber}`,
      letter: targetLetter,
      sound: phonicsSound,
      soundTip: `Phát âm chuẩn âm: ${phonicsSound}`,
      soundTipVi: `Khẩu hình miệng chuẩn cho âm: ${phonicsSound}`,
      blendingExamples: words.slice(0, 3).map((w) => ({
        onset: (w.word[0] || '').toLowerCase(),
        rime: w.word.slice(1) || '',
        word: w.word,
        emoji: w.imageEmoji,
      })),
      segmentingWords: words.slice(0, 2).map((w) => ({
        word: w.word,
        sounds: [phonicsSound, w.word.slice(1)],
      })),
    };

    const listeningActivities = u.listeningActivities || generateDefaultListeningActivities(unitNumber, words);

    const record: CurriculumUnitRecord = {
      id: `cur-g${targetGrade}-u${unitNumber}`,
      unitNumber,
      grade: targetGrade,
      title: u.title || `Unit ${unitNumber}`,
      titleVi: u.titleVi || u.meaningVi || u.title || '',
      theme: u.theme || 'Global Success Curriculum',
      themeEmoji: u.themeEmoji || words[0]?.imageEmoji || '📖',
      targetLetter,
      phonicsSound,
      storyTopic: u.storyTopic || u.title || '',
      vocabulary: words,
      sentencePatterns: patterns,
      phonics,
      listeningActivities,
      speakingPrompts: u.speakingPrompts || words.slice(0, 2).map((w) => ({
        aiPrompt: `Can you say "${w.word}"?`,
        suggestedStudentReply: w.word,
        hint: `Luyện nói từ: ${w.word}`,
      })),
      funTime: u.funTime,
      sourceFileName: fileName,
      sourceFileType: 'json',
      status: 'draft',
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officialSourceRef: u.officialSourceRef || `Global Success Grade ${targetGrade}`,
      validationIssues: [],
    };

    const issues = validateUnitRecord(record);
    record.validationIssues = issues;
    record.status = issues.some((i) => i.level === 'error') ? 'draft' : 'validated';

    return record;
  }).sort((a, b) => a.unitNumber - b.unitNumber);
}

/**
 * Text file & Structured syllabus parser
 * Recognizes lines like:
 * Unit 1: In the School Playground (Trong sân trường)
 * - ball /bɔːl/: quả bóng
 * - book /bʊk/: quyển sách
 * Phonics: Letter B /b/
 * Sentence: Hi, I'm Bill.
 */
export function parseStructuredTextCurriculum(
  rawText: string,
  targetGrade: GradeLevel,
  fileName: string,
  fileType: SupportedFileType
): CurriculumUnitRecord[] {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const units: CurriculumUnitRecord[] = [];

  let currentUnitNum: number | null = null;
  let currentTitle = '';
  let currentTitleVi = '';
  let currentLetter = '';
  let currentSound = '';
  let currentWords: VocabWord[] = [];
  let currentPatterns: SentencePattern[] = [];
  let currentChants: string[] = [];

  const finalizeUnit = () => {
    if (currentUnitNum === null) return;
    const letter = currentLetter || (currentWords[0] ? currentWords[0].word[0].toUpperCase() : 'A');
    const sound = currentSound || `/${letter.toLowerCase()}/`;

    const unitRecord: CurriculumUnitRecord = {
      id: `cur-g${targetGrade}-u${currentUnitNum}`,
      unitNumber: currentUnitNum,
      grade: targetGrade,
      title: currentTitle || `Unit ${currentUnitNum}`,
      titleVi: currentTitleVi || currentTitle,
      theme: 'Global Success English',
      themeEmoji: currentWords[0]?.imageEmoji || '📖',
      targetLetter: letter,
      phonicsSound: sound,
      storyTopic: currentTitle,
      vocabulary: currentWords,
      sentencePatterns: currentPatterns,
      phonics: {
        id: `ph-txt-u${currentUnitNum}`,
        letter,
        sound,
        soundTip: `Pronounce: ${sound}`,
        soundTipVi: `Phát âm: ${sound}`,
        blendingExamples: currentWords.slice(0, 3).map((w) => ({
          onset: (w.word[0] || '').toLowerCase(),
          rime: w.word.slice(1),
          word: w.word,
          emoji: w.imageEmoji,
        })),
        segmentingWords: currentWords.slice(0, 2).map((w) => ({
          word: w.word,
          sounds: [sound, w.word.slice(1)],
        })),
      },
      listeningActivities: generateDefaultListeningActivities(currentUnitNum, currentWords),
      speakingPrompts: currentWords.slice(0, 2).map((w) => ({
        aiPrompt: `Can you say: "${w.word}"?`,
        suggestedStudentReply: w.word,
        hint: `Nói to từ "${w.word}"`,
      })),
      funTime: {
        chantTitle: `${currentTitle} Chant`,
        chantLyrics: currentChants.length > 0 ? currentChants : [
          `${letter}, ${letter}, ${sound}!`,
          `Look at the ${currentWords[0]?.word || 'item'}!`,
        ],
        gameType: 'wheel',
        gameInstruction: 'Quay vòng quay từ vựng vui nhộn',
        funQuestions: currentWords.slice(0, 3).map((w) => ({
          prompt: `What is this word: "${w.word}"?`,
          options: [w.meaningVi, 'Khác'],
          correctIndex: 0,
          emoji: w.imageEmoji,
        })),
        actionChallenge: 'Luyện đọc to các từ vừa học nhé!',
      },
      sourceFileName: fileName,
      sourceFileType: fileType,
      status: 'draft',
      importedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officialSourceRef: `Global Success Grade ${targetGrade}`,
      validationIssues: [],
    };

    const issues = validateUnitRecord(unitRecord);
    unitRecord.validationIssues = issues;
    unitRecord.status = issues.some((i) => i.level === 'error') ? 'draft' : 'validated';

    units.push(unitRecord);
  };

  for (const line of lines) {
    // Detect Unit header: "Unit 1: In the School Playground" or "Bài 1: Trong sân trường"
    const unitMatch = line.match(/^(?:Unit|Bài)\s*([0-9]+)\s*[:\-\.]?\s*(.*)$/i);
    if (unitMatch) {
      finalizeUnit();
      currentUnitNum = parseInt(unitMatch[1], 10);
      const titleRaw = unitMatch[2] || '';
      // Check if title has parentheses for Vietnamese meaning: "In the School Playground (Trong sân trường)"
      const viMatch = titleRaw.match(/^(.*?)\s*\((.*?)\)$/);
      if (viMatch) {
        currentTitle = viMatch[1].trim();
        currentTitleVi = viMatch[2].trim();
      } else {
        currentTitle = titleRaw.trim();
        currentTitleVi = '';
      }
      currentWords = [];
      currentPatterns = [];
      currentChants = [];
      currentLetter = '';
      currentSound = '';
      continue;
    }

    if (currentUnitNum === null) {
      currentUnitNum = 1;
    }

    // Detect Phonics: "Phonics: Letter B /b/" or "Âm: B /b/"
    const phonicsMatch = line.match(/(?:Phonics|Âm|Chữ cái)\s*[:\-]\s*(?:Letter\s*)?([a-zA-Z,\s]+)(?:\s*(\/[^\/]+\/))?/i);
    if (phonicsMatch) {
      currentLetter = phonicsMatch[1].trim();
      if (phonicsMatch[2]) currentSound = phonicsMatch[2].trim();
      continue;
    }

    // Detect Sentence: "Sentence: Hi, I'm Bill." or "Mẫu câu: Hi, I'm Bill."
    const sentenceMatch = line.match(/(?:Sentence|Pattern|Mẫu câu|Cấu trúc)\s*[:\-]\s*(.+)$/i);
    if (sentenceMatch) {
      const pat = sentenceMatch[1].trim();
      const viPattern = pat.includes('(') ? pat.match(/\((.*?)\)/)?.[1] || '' : '';
      const cleanPat = pat.replace(/\(.*?\)/, '').trim();
      currentPatterns.push({
        id: `pat-txt-${currentUnitNum}-${currentPatterns.length + 1}`,
        pattern: cleanPat,
        patternVi: viPattern,
        dialogue: [{ speaker: 'Smarty', avatar: '🦉', textEn: cleanPat, textVi: viPattern, audioText: cleanPat }],
        scrambleWords: cleanPat.split(' ').filter(Boolean),
        correctOrder: cleanPat.split(' ').filter(Boolean),
        rolePlayPrompts: [],
      });
      continue;
    }

    // Detect Vocabulary Word:
    // "- ball /bɔːl/: quả bóng" or "ball: quả bóng" or "1. ball - quả bóng"
    const wordMatch = line.match(/^[-*•0-9.]*\s*([a-zA-Z\s\-]+?)\s*(?:\/([^\/]+)\/)?\s*[:=\-–]\s*(.+)$/);
    if (wordMatch) {
      const word = wordMatch[1].trim();
      const phonetic = wordMatch[2] ? `/${wordMatch[2].trim()}/` : '';
      const meaningVi = wordMatch[3].trim();

      if (word && !word.toLowerCase().startsWith('unit') && !word.toLowerCase().startsWith('lesson')) {
        currentWords.push({
          id: `w-txt-${currentUnitNum}-${currentWords.length + 1}`,
          word,
          meaningVi,
          phonetic,
          letter: (word[0] || '').toLowerCase(),
          imageEmoji: inferWordEmoji(word),
          exampleSentence: `I see a ${word}.`,
          audioText: word,
        });
      }
    }
  }

  finalizeUnit();

  return units.sort((a, b) => a.unitNumber - b.unitNumber);
}

/**
 * Dynamic loader for SheetJS (xlsx) for rich Excel spreadsheet parsing in browser
 */
export async function loadSheetJS(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Chức năng chỉ hoạt động trên trình duyệt');
  }

  if ((window as any).XLSX) {
    return (window as any).XLSX;
  }

  return new Promise((resolve, reject) => {
    // Check if already injected
    const existing = document.getElementById('sheetjs-script');
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).XLSX));
      existing.addEventListener('error', () => reject(new Error('Không thể tải SheetJS')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'sheetjs-script';
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).XLSX) {
        resolve((window as any).XLSX);
      } else {
        reject(new Error('Không tìm thấy đối tượng XLSX'));
      }
    };
    script.onerror = () => reject(new Error('Không thể kết nối tải thư viện đọc file Excel SheetJS'));
    document.head.appendChild(script);
  });
}

/**
 * Reads any uploaded File object and parses it into validated CurriculumUnitRecords
 */
export async function parseUploadedCurriculumFile(
  file: File,
  targetGrade: GradeLevel
): Promise<{ units: CurriculumUnitRecord[]; fileType: SupportedFileType; summary: string }> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. JSON Files
  if (extension === 'json') {
    const rawText = await file.text();
    const units = parseCurriculumJSON(rawText, targetGrade, file.name);
    return {
      units,
      fileType: 'json',
      summary: `Đã bóc tách thành công ${units.length} Unit từ file cấu trúc JSON "${file.name}".`,
    };
  }

  // 2. CSV & TSV Files
  if (extension === 'csv' || extension === 'tsv') {
    const rawText = await file.text();
    const rows = parseDelimitedText(rawText);
    const units = mapTableRowsToCurriculumUnits(rows, targetGrade, file.name, extension);
    return {
      units,
      fileType: extension,
      summary: `Đã nhận diện bảng dữ liệu gồm ${rows.length} dòng và ánh xạ thành ${units.length} Unit hoàn chỉnh.`,
    };
  }

  // 3. Excel Spreadsheet Files (.xlsx, .xls)
  if (extension === 'xlsx' || extension === 'xls') {
    try {
      const XLSX = await loadSheetJS();
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Read all sheets and aggregate rows
      const allRows: string[][] = [];
      workbook.SheetNames.forEach((sheetName: string) => {
        const sheet = workbook.Sheets[sheetName];
        if (sheet) {
          const csvText: string = XLSX.utils.sheet_to_csv(sheet);
          const parsed = parseDelimitedText(csvText);
          if (parsed.length > 0) {
            // Keep header from first sheet, append data rows
            if (allRows.length === 0) {
              allRows.push(...parsed);
            } else {
              allRows.push(...parsed.slice(1));
            }
          }
        }
      });

      const units = mapTableRowsToCurriculumUnits(allRows, targetGrade, file.name, extension as SupportedFileType);
      return {
        units,
        fileType: extension as SupportedFileType,
        summary: `Đã xử lý file Excel (${workbook.SheetNames.length} trang tính), bóc tách được ${units.length} Unit.`,
      };
    } catch (e: any) {
      console.warn('XLSX parsing fallback:', e);
      // Fallback: try reading as text in case it's a CSV with xlsx extension
      const rawText = await file.text();
      const rows = parseDelimitedText(rawText);
      if (rows.length > 1) {
        const units = mapTableRowsToCurriculumUnits(rows, targetGrade, file.name, 'csv');
        return {
          units,
          fileType: 'csv',
          summary: `Đã đọc dữ liệu dạng bảng với ${units.length} Unit.`,
        };
      }
      throw new Error(`Lỗi đọc file Excel "${file.name}": ${e.message || 'Vui lòng xuất file thành định dạng CSV hoặc JSON để đảm bảo 100% tương thích.'}`);
    }
  }

  // 4. DOCX Documents
  if (extension === 'docx') {
    try {
      // DOCX contains word/document.xml inside a zip archive
      const buffer = await file.arrayBuffer();
      // Fast extraction of raw text from XML stream in browser
      const dec = new TextDecoder('utf-8');
      const textChunk = dec.decode(buffer);
      // Strip XML tags if present
      const plainText = textChunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const units = parseStructuredTextCurriculum(plainText, targetGrade, file.name, 'docx');
      if (units.length > 0) {
        return {
          units,
          fileType: 'docx',
          summary: `Đã phân tích văn bản DOCX và bóc tách thành công ${units.length} Unit.`,
        };
      }
    } catch {
      // Fall through to plain text
    }
  }

  // 5. Plain Text (.txt, .md, text-based .pdf fallback)
  const rawText = await file.text();
  const units = parseStructuredTextCurriculum(rawText, targetGrade, file.name, extension === 'pdf' ? 'pdf' : 'txt');
  return {
    units,
    fileType: extension === 'pdf' ? 'pdf' : 'txt',
    summary: `Đã bóc tách thành công ${units.length} Unit từ tài liệu văn bản "${file.name}".`,
  };
}
