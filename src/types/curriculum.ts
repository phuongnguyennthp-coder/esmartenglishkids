export type GradeLevel = 1 | 2;

export interface VocabWord {
  id: string;
  word: string;
  meaningVi: string;
  phonetic: string;
  letter: string;
  imageEmoji: string;
  exampleSentence: string;
  audioText: string;
}

export interface DialogueExchange {
  speaker: string;
  avatar: string;
  textEn: string;
  textVi: string;
  audioText: string;
}

export interface SentencePattern {
  id: string;
  pattern: string;
  patternVi: string;
  dialogue: DialogueExchange[];
  scrambleWords: string[];
  correctOrder: string[];
  rolePlayPrompts: {
    character: string;
    prompt: string;
    expectedReply: string;
  }[];
}

export interface PhonicsItem {
  id: string;
  letter: string;
  sound: string; // e.g. /b/, /k/
  soundTip: string;
  soundTipVi: string;
  blendingExamples: {
    onset: string;
    rime: string;
    word: string;
    emoji: string;
  }[];
  segmentingWords: {
    word: string;
    sounds: string[];
  }[];
}

export interface ListeningActivity {
  id: string;
  type: 'choose' | 'match' | 'number' | 'point';
  questionPrompt: string;
  audioPrompt: string;
  options: {
    id: string;
    text: string;
    imageEmoji: string;
    isCorrect: boolean;
  }[];
}

export interface UnitFunTime {
  chantTitle: string;
  chantLyrics: string[];
  songAudioTitle?: string;
  gameType: 'wheel' | 'board' | 'match' | 'simon';
  gameInstruction: string;
  funQuestions: {
    prompt: string;
    options: string[];
    correctIndex: number;
    emoji: string;
    soundHint?: string;
  }[];
  actionChallenge: string;
}

export interface FunTimeMilestone {
  id: string;
  milestoneNumber: number; // 1, 2, 3, 4
  grade: GradeLevel;
  title: string;
  titleVi: string;
  coveredUnits: string; // e.g. "Units 1 - 4"
  themeEmoji: string;
  chant: {
    title: string;
    lyrics: string[];
    tempo: 'lively' | 'playful' | 'calm';
  };
  wheelChallenge: {
    segments: {
      label: string;
      color: string;
      challenge: string;
      rewardStars: number;
      emoji: string;
    }[];
  };
  boardGameTiles: {
    step: number;
    title: string;
    task: string;
    emoji: string;
    type: 'normal' | 'bonus' | 'speak' | 'sing' | 'star';
  }[];
  oddOneOutPuzzle: {
    question: string;
    options: { text: string; emoji: string; isOdd: boolean; reason: string }[];
  };
}

export interface Unit {
  id: string;
  unitNumber: number;
  grade: GradeLevel;
  title: string;
  titleVi: string;
  theme: string;
  themeEmoji?: string;
  targetLetter: string;
  phonicsSound: string;
  vocabulary: VocabWord[];
  sentencePatterns: SentencePattern[];
  phonics: PhonicsItem;
  listeningActivities: ListeningActivity[];
  speakingPrompts: {
    aiPrompt: string;
    suggestedStudentReply: string;
    hint: string;
  }[];
  storyTopic: string;
  funTime?: UnitFunTime;
}

export interface DigitalCitizenshipTopic {
  id: string;
  title: string;
  titleVi: string;
  iconEmoji: string;
  coreRule: string;
  coreRuleVi: string;
  storyContext: string;
  dilemma: {
    situation: string;
    situationVi: string;
    options: {
      text: string;
      textVi: string;
      isSafe: boolean;
      feedback: string;
    }[];
  };
  smartTip: string;
}

export interface ReflectionRecord {
  date: string;
  unitNumber: number;
  grade: GradeLevel;
  feeling: 'well' | 'practice' | 'help'; // 😊, 😐, 😢
  note?: string;
}

export interface SpeakingAttempt {
  id: string;
  date: string;
  targetText: string;
  recognizedText: string;
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
  rating: 'Excellent' | 'Good Job' | 'Try Again' | 'Need More Practice';
  audioBlobUrl?: string;
  feedbackTip?: string;
}
