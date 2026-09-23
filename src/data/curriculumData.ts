import { Unit, FunTimeMilestone } from '../types/curriculum';

export const GRADE_1_UNITS: Unit[] = [
  // Unit 1
  {
    id: 'g1-u1',
    unitNumber: 1,
    grade: 1,
    title: 'In the School Playground',
    titleVi: 'Trong sân trường',
    theme: 'School & Friends',
    themeEmoji: '🏫',
    targetLetter: 'B, b',
    phonicsSound: '/b/',
    storyTopic: 'School Playground',
    vocabulary: [
      { id: 'w-ball', word: 'ball', meaningVi: 'quả bóng', phonetic: '/bɔːl/', letter: 'b', imageEmoji: '⚽', exampleSentence: 'I have a red ball.', audioText: 'ball' },
      { id: 'w-book', word: 'book', meaningVi: 'quyển sách', phonetic: '/bʊk/', letter: 'b', imageEmoji: '📚', exampleSentence: 'Open your English book.', audioText: 'book' },
      { id: 'w-bike', word: 'bike', meaningVi: 'xe đạp', phonetic: '/baɪk/', letter: 'b', imageEmoji: '🚲', exampleSentence: 'Ba has a blue bike.', audioText: 'bike' },
      { id: 'w-boy', word: 'boy', meaningVi: 'cậu bé', phonetic: '/bɔɪ/', letter: 'b', imageEmoji: '👦', exampleSentence: 'The boy is playing.', audioText: 'boy' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-1',
        pattern: "Hi, I'm Bill. / Bye, Ba.",
        patternVi: 'Xin chào, tớ là Bill. / Tạm biệt Ba.',
        dialogue: [
          { speaker: 'Bill', avatar: '👦', textEn: "Hi! I'm Bill.", textVi: 'Chào bạn! Tớ là Bill.', audioText: "Hi! I'm Bill." },
          { speaker: 'Ba', avatar: '🧒', textEn: 'Hi, Bill! Bye, Bill.', textVi: 'Chào Bill! Tạm biệt Bill.', audioText: 'Hi, Bill! Bye, Bill.' },
        ],
        scrambleWords: ["Hi,", "I'm", "Bill."],
        correctOrder: ["Hi,", "I'm", "Bill."],
        rolePlayPrompts: [{ character: 'Smarty', prompt: "Hi! I'm Smarty the Owl. What's your name?", expectedReply: "Hi, I'm Minh." }],
      },
    ],
    phonics: {
      id: 'ph-b',
      letter: 'B, b',
      sound: '/b/',
      soundTip: 'Put both lips together, build up air, then open lips: /b/, /b/, ball!',
      soundTipVi: 'Khép hai môi lại, bật hơi nhẹ: /b/, /b/, ball!',
      blendingExamples: [
        { onset: 'b', rime: 'at', word: 'bat', emoji: '🦇' },
        { onset: 'b', rime: 'ed', word: 'bed', emoji: '🛏️' },
        { onset: 'b', rime: 'ox', word: 'box', emoji: '📦' },
      ],
      segmentingWords: [{ word: 'ball', sounds: ['/b/', '/ɔː/', '/l/'] }, { word: 'boy', sounds: ['/b/', '/ɔɪ/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-1',
        type: 'choose',
        questionPrompt: 'Listen and choose the correct picture: "book"',
        audioPrompt: 'book',
        options: [
          { id: 'opt-1-1', text: 'ball', imageEmoji: '⚽', isCorrect: false },
          { id: 'opt-1-2', text: 'book', imageEmoji: '📚', isCorrect: true },
          { id: 'opt-1-3', text: 'bike', imageEmoji: '🚲', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Hello! Say: 'Hi, I am Bill.'", suggestedStudentReply: "Hi, I am Bill.", hint: "Tap the microphone and say: Hi, I am Bill." }],
  },

  // Unit 2
  {
    id: 'g1-u2',
    unitNumber: 2,
    grade: 1,
    title: 'In the Dining Room',
    titleVi: 'Trong phòng ăn',
    theme: 'Food & Home',
    themeEmoji: '🍽️',
    targetLetter: 'C, c',
    phonicsSound: '/k/',
    storyTopic: 'Dining Room',
    vocabulary: [
      { id: 'w-cake', word: 'cake', meaningVi: 'bánh ngọt', phonetic: '/keɪk/', letter: 'c', imageEmoji: '🍰', exampleSentence: 'A yummy birthday cake.', audioText: 'cake' },
      { id: 'w-car', word: 'car', meaningVi: 'ô tô đồ chơi', phonetic: '/kɑːr/', letter: 'c', imageEmoji: '🚗', exampleSentence: 'A small red car.', audioText: 'car' },
      { id: 'w-cat', word: 'cat', meaningVi: 'con mèo', phonetic: '/kæt/', letter: 'c', imageEmoji: '🐱', exampleSentence: 'A cute little cat.', audioText: 'cat' },
      { id: 'w-cup', word: 'cup', meaningVi: 'chiếc cốc', phonetic: '/kʌp/', letter: 'c', imageEmoji: '🍵', exampleSentence: 'A warm cup of milk.', audioText: 'cup' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-2',
        pattern: 'I have a cake.',
        patternVi: 'Tớ có một chiếc bánh ngọt.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'I have a cake.', textVi: 'Tớ có một chiếc bánh.', audioText: 'I have a cake.' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'I have a cup.', textVi: 'Tớ có một chiếc cốc.', audioText: 'I have a cup.' },
        ],
        scrambleWords: ['I', 'have', 'a', 'cake.'],
        correctOrder: ['I', 'have', 'a', 'cake.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Look at the table! What do you have?', expectedReply: 'I have a cake.' }],
      },
    ],
    phonics: {
      id: 'ph-c',
      letter: 'C, c',
      sound: '/k/',
      soundTip: 'Raise the back of your tongue against soft palate: /k/, /k/, cake!',
      soundTipVi: 'Nâng cuống lưỡi lên vòm họng mềm: /k/, /k/, cake!',
      blendingExamples: [
        { onset: 'c', rime: 'at', word: 'cat', emoji: '🐱' },
        { onset: 'c', rime: 'up', word: 'cup', emoji: '🍵' },
        { onset: 'c', rime: 'ap', word: 'cap', emoji: '🧢' },
      ],
      segmentingWords: [{ word: 'cat', sounds: ['/k/', '/æ/', '/t/'] }, { word: 'cup', sounds: ['/k/', '/ʌ/', '/p/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-2',
        type: 'choose',
        questionPrompt: 'Listen and choose the item: "cake"',
        audioPrompt: 'cake',
        options: [
          { id: 'opt-2-1', text: 'cake', imageEmoji: '🍰', isCorrect: true },
          { id: 'opt-2-2', text: 'car', imageEmoji: '🚗', isCorrect: false },
          { id: 'opt-2-3', text: 'cup', imageEmoji: '🍵', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What do you have on the dining table? Say: 'I have a cake.'", suggestedStudentReply: 'I have a cake.', hint: 'Say: I have a cake.' }],
  },

  // Unit 3
  {
    id: 'g1-u3',
    unitNumber: 3,
    grade: 1,
    title: 'At the Street Market',
    titleVi: 'Ở chợ đường phố',
    theme: 'Shopping & Fruits',
    themeEmoji: '🍎',
    targetLetter: 'A, a',
    phonicsSound: '/æ/',
    storyTopic: 'Street Market',
    vocabulary: [
      { id: 'w-apple', word: 'apple', meaningVi: 'quả táo', phonetic: '/ˈæp.əl/', letter: 'a', imageEmoji: '🍎', exampleSentence: 'A fresh red apple.', audioText: 'apple' },
      { id: 'w-bag', word: 'bag', meaningVi: 'chiếc túi', phonetic: '/bæɡ/', letter: 'a', imageEmoji: '🎒', exampleSentence: 'Put the apples in the bag.', audioText: 'bag' },
      { id: 'w-can', word: 'can', meaningVi: 'lon nước', phonetic: '/kæn/', letter: 'a', imageEmoji: '🥫', exampleSentence: 'A can of fruit juice.', audioText: 'can' },
      { id: 'w-hat', word: 'hat', meaningVi: 'chiếc mũ', phonetic: '/hæt/', letter: 'a', imageEmoji: '👒', exampleSentence: 'She wears a sunny hat.', audioText: 'hat' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-3',
        pattern: 'Have an apple! - Thank you.',
        patternVi: 'Ăn một quả táo nhé! - Cảm ơn bạn.',
        dialogue: [
          { speaker: 'Smarty', avatar: '🦉', textEn: 'Have an apple!', textVi: 'Mời bạn quả táo!', audioText: 'Have an apple!' },
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Thank you, Smarty.', textVi: 'Cảm ơn Smarty nhé.', audioText: 'Thank you, Smarty.' },
        ],
        scrambleWords: ['Have', 'an', 'apple!'],
        correctOrder: ['Have', 'an', 'apple!'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Here is fresh fruit! Have an apple!', expectedReply: 'Thank you.' }],
      },
    ],
    phonics: {
      id: 'ph-a',
      letter: 'A, a',
      sound: '/æ/',
      soundTip: 'Open mouth wide, push tongue flat forward: /æ/, /æ/, apple!',
      soundTipVi: 'Mở rộng miệng, hạ phẳng lưỡi: /æ/, /æ/, apple!',
      blendingExamples: [
        { onset: 'b', rime: 'ag', word: 'bag', emoji: '🎒' },
        { onset: 'h', rime: 'at', word: 'hat', emoji: '👒' },
      ],
      segmentingWords: [{ word: 'bag', sounds: ['/b/', '/æ/', '/ɡ/'] }, { word: 'hat', sounds: ['/h/', '/æ/', '/t/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-3',
        type: 'choose',
        questionPrompt: 'Listen and choose: "apple"',
        audioPrompt: 'apple',
        options: [
          { id: 'opt-3-1', text: 'apple', imageEmoji: '🍎', isCorrect: true },
          { id: 'opt-3-2', text: 'hat', imageEmoji: '👒', isCorrect: false },
          { id: 'opt-3-3', text: 'bag', imageEmoji: '🎒', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Practice kindness at the market! Say: 'Have an apple!'", suggestedStudentReply: 'Have an apple!', hint: 'Say: Have an apple!' }],
  },

  // Unit 4
  {
    id: 'g1-u4',
    unitNumber: 4,
    grade: 1,
    title: 'In the Bedroom',
    titleVi: 'Trong phòng ngủ',
    theme: 'Bedroom & Furniture',
    themeEmoji: '🛏️',
    targetLetter: 'D, d',
    phonicsSound: '/d/',
    storyTopic: 'Bedroom',
    vocabulary: [
      { id: 'w-desk', word: 'desk', meaningVi: 'bàn học', phonetic: '/desk/', letter: 'd', imageEmoji: '🛋️', exampleSentence: 'A tidy study desk.', audioText: 'desk' },
      { id: 'w-door', word: 'door', meaningVi: 'cánh cửa', phonetic: '/dɔːr/', letter: 'd', imageEmoji: '🚪', exampleSentence: 'Close the bedroom door.', audioText: 'door' },
      { id: 'w-duck', word: 'duck', meaningVi: 'con vịt', phonetic: '/dʌk/', letter: 'd', imageEmoji: '🦆', exampleSentence: 'A yellow toy duck.', audioText: 'duck' },
      { id: 'w-dog', word: 'dog', meaningVi: 'chú chó', phonetic: '/dɒɡ/', letter: 'd', imageEmoji: '🐶', exampleSentence: 'A playful pet dog.', audioText: 'dog' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-4',
        pattern: "It's a desk. / Point to the door.",
        patternVi: 'Đó là chiếc bàn học. / Hãy chỉ vào cánh cửa.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Point to the door.', textVi: 'Hãy chỉ vào cửa.', audioText: 'Point to the door.' },
          { speaker: 'Smarty', avatar: '🦉', textEn: "It's a brown door.", textVi: 'Đó là cánh cửa màu nâu.', audioText: "It's a brown door." },
        ],
        scrambleWords: ["It's", 'a', 'desk.'],
        correctOrder: ["It's", 'a', 'desk.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'What is near your bed? Is it a desk?', expectedReply: "It's a desk." }],
      },
    ],
    phonics: {
      id: 'ph-d',
      letter: 'D, d',
      sound: '/d/',
      soundTip: 'Press tongue tip against upper gum ridge: /d/, /d/, desk!',
      soundTipVi: 'Đầu lưỡi chạm nướu răng trên bật ra: /d/, /d/, desk!',
      blendingExamples: [
        { onset: 'd', rime: 'og', word: 'dog', emoji: '🐶' },
        { onset: 'd', rime: 'uck', word: 'duck', emoji: '🦆' },
      ],
      segmentingWords: [{ word: 'desk', sounds: ['/d/', '/e/', '/s/', '/k/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-4',
        type: 'choose',
        questionPrompt: 'Listen and choose: "door"',
        audioPrompt: 'door',
        options: [
          { id: 'opt-4-1', text: 'door', imageEmoji: '🚪', isCorrect: true },
          { id: 'opt-4-2', text: 'desk', imageEmoji: '🛋️', isCorrect: false },
          { id: 'opt-4-3', text: 'dog', imageEmoji: '🐶', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Look around your bedroom. Say: 'It is a desk.'", suggestedStudentReply: "It is a desk.", hint: "Say: It is a desk." }],
  },

  // Unit 5
  {
    id: 'g1-u5',
    unitNumber: 5,
    grade: 1,
    title: 'At the Fish and Chip Shop',
    titleVi: 'Ở cửa hàng cá và khoai tây chiên',
    theme: 'Food & Meals',
    themeEmoji: '🐟',
    targetLetter: 'I, i',
    phonicsSound: '/ɪ/',
    storyTopic: 'Food Shop',
    vocabulary: [
      { id: 'w-fish', word: 'fish', meaningVi: 'con cá', phonetic: '/fɪʃ/', letter: 'i', imageEmoji: '🐟', exampleSentence: 'I like grilled fish.', audioText: 'fish' },
      { id: 'w-chips', word: 'chips', meaningVi: 'khoai tây chiên', phonetic: '/tʃɪps/', letter: 'i', imageEmoji: '🍟', exampleSentence: 'Hot crispy chips.', audioText: 'chips' },
      { id: 'w-milk', word: 'milk', meaningVi: 'sữa', phonetic: '/mɪlk/', letter: 'i', imageEmoji: '🥛', exampleSentence: 'A cup of milk.', audioText: 'milk' },
      { id: 'w-chicken', word: 'chicken', meaningVi: 'thịt gà', phonetic: '/ˈtʃɪk.ɪn/', letter: 'i', imageEmoji: '🍗', exampleSentence: 'Delicious fried chicken.', audioText: 'chicken' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-5',
        pattern: 'I like fish and chips.',
        patternVi: 'Tớ thích cá và khoai tây chiên.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'I like fish.', textVi: 'Tớ thích ăn cá.', audioText: 'I like fish.' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'I like milk.', textVi: 'Tớ thích uống sữa.', audioText: 'I like milk.' },
        ],
        scrambleWords: ['I', 'like', 'chips.'],
        correctOrder: ['I', 'like', 'chips.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'What food do you like to eat?', expectedReply: 'I like fish.' }],
      },
    ],
    phonics: {
      id: 'ph-i',
      letter: 'I, i',
      sound: '/ɪ/',
      soundTip: 'Short relaxed sound with lips parted: /ɪ/, /ɪ/, fish!',
      soundTipVi: 'Âm i ngắn thư giãn: /ɪ/, /ɪ/, fish!',
      blendingExamples: [
        { onset: 'f', rime: 'ish', word: 'fish', emoji: '🐟' },
        { onset: 'm', rime: 'ilk', word: 'milk', emoji: '🥛' },
      ],
      segmentingWords: [{ word: 'fish', sounds: ['/f/', '/ɪ/', '/ʃ/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-5',
        type: 'choose',
        questionPrompt: 'Listen and choose: "milk"',
        audioPrompt: 'milk',
        options: [
          { id: 'opt-5-1', text: 'milk', imageEmoji: '🥛', isCorrect: true },
          { id: 'opt-5-2', text: 'fish', imageEmoji: '🐟', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What do you like to drink? Say: 'I like milk.'", suggestedStudentReply: 'I like milk.', hint: 'Say: I like milk.' }],
  },

  // Unit 6
  {
    id: 'g1-u6',
    unitNumber: 6,
    grade: 1,
    title: 'In the Classroom',
    titleVi: 'Trong lớp học',
    theme: 'Classroom & Stationery',
    themeEmoji: '✏️',
    targetLetter: 'E, e',
    phonicsSound: '/e/',
    storyTopic: 'Classroom',
    vocabulary: [
      { id: 'w-pen', word: 'pen', meaningVi: 'bút mực', phonetic: '/pen/', letter: 'e', imageEmoji: '🖊️', exampleSentence: 'A blue ink pen.', audioText: 'pen' },
      { id: 'w-pencil', word: 'pencil', meaningVi: 'bút chì', phonetic: '/ˈpen.səl/', letter: 'e', imageEmoji: '✏️', exampleSentence: 'Write with a pencil.', audioText: 'pencil' },
      { id: 'w-red', word: 'red', meaningVi: 'màu đỏ', phonetic: '/red/', letter: 'e', imageEmoji: '🔴', exampleSentence: 'A bright red pen.', audioText: 'red' },
      { id: 'w-bell', word: 'bell', meaningVi: 'chuông trường', phonetic: '/bel/', letter: 'e', imageEmoji: '🔔', exampleSentence: 'The school bell rings.', audioText: 'bell' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-6',
        pattern: 'This is a pen. / It is red.',
        patternVi: 'Đây là cái bút. / Nó màu đỏ.',
        dialogue: [
          { speaker: 'Bill', avatar: '👦', textEn: 'This is a red pen.', textVi: 'Đây là cây bút màu đỏ.', audioText: 'This is a red pen.' },
          { speaker: 'Mai', avatar: '👧', textEn: 'This is a pencil.', textVi: 'Đây là một cây bút chì.', audioText: 'This is a pencil.' },
        ],
        scrambleWords: ['This', 'is', 'a', 'pen.'],
        correctOrder: ['This', 'is', 'a', 'pen.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Hold up your stationery! What is it?', expectedReply: 'This is a pen.' }],
      },
    ],
    phonics: {
      id: 'ph-e',
      letter: 'E, e',
      sound: '/e/',
      soundTip: 'Open lips halfway, short crisp tone: /e/, /e/, pen!',
      soundTipVi: 'Mở miệng vừa phải phát âm e ngắn: /e/, /e/, pen!',
      blendingExamples: [
        { onset: 'p', rime: 'en', word: 'pen', emoji: '🖊️' },
        { onset: 'r', rime: 'ed', word: 'red', emoji: '🔴' },
      ],
      segmentingWords: [{ word: 'pen', sounds: ['/p/', '/e/', '/n/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-6',
        type: 'choose',
        questionPrompt: 'Listen and choose: "pen"',
        audioPrompt: 'pen',
        options: [
          { id: 'opt-6-1', text: 'pen', imageEmoji: '🖊️', isCorrect: true },
          { id: 'opt-6-2', text: 'pencil', imageEmoji: '✏️', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Show your teacher your tool! Say: 'This is a pen.'", suggestedStudentReply: 'This is a pen.', hint: 'Say: This is a pen.' }],
  },

  // Unit 7
  {
    id: 'g1-u7',
    unitNumber: 7,
    grade: 1,
    title: 'In the Garden',
    titleVi: 'Trong vườn',
    theme: 'Nature & Animals',
    themeEmoji: '🌻',
    targetLetter: 'G, g',
    phonicsSound: '/ɡ/',
    storyTopic: 'Garden',
    vocabulary: [
      { id: 'w-garden', word: 'garden', meaningVi: 'khu vườn', phonetic: '/ˈɡɑː.dən/', letter: 'g', imageEmoji: '🏡', exampleSentence: 'Flowers bloom in the garden.', audioText: 'garden' },
      { id: 'w-girl', word: 'girl', meaningVi: 'cô bé', phonetic: '/ɡɜːl/', letter: 'g', imageEmoji: '👧', exampleSentence: 'A happy young girl.', audioText: 'girl' },
      { id: 'w-gate', word: 'gate', meaningVi: 'cổng vườn', phonetic: '/ɡeɪt/', letter: 'g', imageEmoji: '🚪', exampleSentence: 'Open the garden gate.', audioText: 'gate' },
      { id: 'w-goat', word: 'goat', meaningVi: 'con dê', phonetic: '/ɡəʊt/', letter: 'g', imageEmoji: '🐐', exampleSentence: 'A friendly white goat.', audioText: 'goat' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-7',
        pattern: 'There is a goat in the garden.',
        patternVi: 'Có một chú dê trong vườn.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Look! There is a goat.', textVi: 'Nhìn kìa! Có một chú dê.', audioText: 'Look! There is a goat.' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'It is near the gate.', textVi: 'Nó ở gần cánh cổng.', audioText: 'It is near the gate.' },
        ],
        scrambleWords: ['There', 'is', 'a', 'goat.'],
        correctOrder: ['There', 'is', 'a', 'goat.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'What animal is eating grass in the garden?', expectedReply: 'There is a goat.' }],
      },
    ],
    phonics: {
      id: 'ph-g',
      letter: 'G, g',
      sound: '/ɡ/',
      soundTip: 'Back of tongue presses palate then releases voiced burst: /ɡ/, /ɡ/, goat!',
      soundTipVi: 'Bật hơi có thanh từ cuống họng: /ɡ/, /ɡ/, goat!',
      blendingExamples: [
        { onset: 'g', rime: 'ate', word: 'gate', emoji: '🚪' },
        { onset: 'g', rime: 'irl', word: 'girl', emoji: '👧' },
      ],
      segmentingWords: [{ word: 'goat', sounds: ['/ɡ/', '/əʊ/', '/t/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-7',
        type: 'choose',
        questionPrompt: 'Listen and choose: "goat"',
        audioPrompt: 'goat',
        options: [
          { id: 'opt-7-1', text: 'goat', imageEmoji: '🐐', isCorrect: true },
          { id: 'opt-7-2', text: 'girl', imageEmoji: '👧', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Look at the garden! Say: 'There is a goat.'", suggestedStudentReply: 'There is a goat.', hint: 'Say: There is a goat.' }],
  },

  // Unit 8
  {
    id: 'g1-u8',
    unitNumber: 8,
    grade: 1,
    title: 'In the Park',
    titleVi: 'Trong công viên',
    theme: 'Outdoor Fun',
    themeEmoji: '🌳',
    targetLetter: 'P, p',
    phonicsSound: '/p/',
    storyTopic: 'Park Adventures',
    vocabulary: [
      { id: 'w-park', word: 'park', meaningVi: 'công viên', phonetic: '/pɑːk/', letter: 'p', imageEmoji: '🌳', exampleSentence: 'Play in the green park.', audioText: 'park' },
      { id: 'w-pen-8', word: 'puppy', meaningVi: 'chú cún con', phonetic: '/ˈpʌp.i/', letter: 'p', imageEmoji: '🐶', exampleSentence: 'A cute little puppy.', audioText: 'puppy' },
      { id: 'w-pool', word: 'pool', meaningVi: 'bể bơi', phonetic: '/puːl/', letter: 'p', imageEmoji: '🏊', exampleSentence: 'Swim in the park pool.', audioText: 'pool' },
      { id: 'w-parrot', word: 'parrot', meaningVi: 'con vẹt', phonetic: '/ˈpær.ət/', letter: 'p', imageEmoji: '🦜', exampleSentence: 'A colorful flying parrot.', audioText: 'parrot' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-8',
        pattern: 'Let’s go to the park!',
        patternVi: 'Chúng mình cùng đi công viên nhé!',
        dialogue: [
          { speaker: 'Bill', avatar: '👦', textEn: 'Let’s go to the park!', textVi: 'Cùng đi công viên nào!', audioText: 'Let’s go to the park!' },
          { speaker: 'Ba', avatar: '🧒', textEn: 'Great idea! I can see a parrot.', textVi: 'Ý hay đấy! Tớ thấy một chú vẹt.', audioText: 'Great idea! I can see a parrot.' },
        ],
        scrambleWords: ['Let’s', 'go', 'to', 'the', 'park!'],
        correctOrder: ['Let’s', 'go', 'to', 'the', 'park!'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'The sun is shining! Invite your friend to go out!', expectedReply: 'Let’s go to the park!' }],
      },
    ],
    phonics: {
      id: 'ph-p',
      letter: 'P, p',
      sound: '/p/',
      soundTip: 'Puff of air with closed lips bursting open: /p/, /p/, park!',
      soundTipVi: 'Bật luồng hơi mạnh từ hai môi: /p/, /p/, park!',
      blendingExamples: [
        { onset: 'p', rime: 'ark', word: 'park', emoji: '🌳' },
        { onset: 'p', rime: 'ool', word: 'pool', emoji: '🏊' },
      ],
      segmentingWords: [{ word: 'park', sounds: ['/p/', '/ɑː/', '/k/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-8',
        type: 'choose',
        questionPrompt: 'Listen and choose: "parrot"',
        audioPrompt: 'parrot',
        options: [
          { id: 'opt-8-1', text: 'parrot', imageEmoji: '🦜', isCorrect: true },
          { id: 'opt-8-2', text: 'park', imageEmoji: '🌳', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Invite Bimi to have fun outside! Say: 'Let’s go to the park!'", suggestedStudentReply: 'Let’s go to the park!', hint: 'Say: Let’s go to the park!' }],
  },

  // Unit 9
  {
    id: 'g1-u9',
    unitNumber: 9,
    grade: 1,
    title: 'In the Shop',
    titleVi: 'Trong cửa hàng',
    theme: 'Shopping & Objects',
    themeEmoji: '🏪',
    targetLetter: 'O, o',
    phonicsSound: '/ɒ/',
    storyTopic: 'Supermarket',
    vocabulary: [
      { id: 'w-clock', word: 'clock', meaningVi: 'đồng hồ treo tường', phonetic: '/klɒk/', letter: 'o', imageEmoji: '⏰', exampleSentence: 'Look at the round clock.', audioText: 'clock' },
      { id: 'w-lock', word: 'lock', meaningVi: 'ổ khóa', phonetic: '/lɒk/', letter: 'o', imageEmoji: '🔒', exampleSentence: 'A secure shiny lock.', audioText: 'lock' },
      { id: 'w-mop', word: 'mop', meaningVi: 'cây lau nhà', phonetic: '/mɒp/', letter: 'o', imageEmoji: '🧹', exampleSentence: 'Clean the floor with a mop.', audioText: 'mop' },
      { id: 'w-pot', word: 'pot', meaningVi: 'cái nồi', phonetic: '/pɒt/', letter: 'o', imageEmoji: '🍲', exampleSentence: 'Soup in the cooking pot.', audioText: 'pot' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-9',
        pattern: 'Look at the clock.',
        patternVi: 'Hãy nhìn vào chiếc đồng hồ.',
        dialogue: [
          { speaker: 'Smarty', avatar: '🦉', textEn: 'Look at the clock!', textVi: 'Nhìn chiếc đồng hồ kìa!', audioText: 'Look at the clock!' },
          { speaker: 'Bimi', avatar: '🐻', textEn: "It's three o'clock.", textVi: 'Đã ba giờ rồi.', audioText: "It's three o'clock." },
        ],
        scrambleWords: ['Look', 'at', 'the', 'clock.'],
        correctOrder: ['Look', 'at', 'the', 'clock.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Tell your friend where to look in the shop!', expectedReply: 'Look at the clock.' }],
      },
    ],
    phonics: {
      id: 'ph-o',
      letter: 'O, o',
      sound: '/ɒ/',
      soundTip: 'Round lips open softly: /ɒ/, /ɒ/, clock!',
      soundTipVi: 'Tròn môi phát âm o ngắn: /ɒ/, /ɒ/, clock!',
      blendingExamples: [
        { onset: 'p', rime: 'ot', word: 'pot', emoji: '🍲' },
        { onset: 'm', rime: 'op', word: 'mop', emoji: '🧹' },
      ],
      segmentingWords: [{ word: 'pot', sounds: ['/p/', '/ɒ/', '/t/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-9',
        type: 'choose',
        questionPrompt: 'Listen and choose: "clock"',
        audioPrompt: 'clock',
        options: [
          { id: 'opt-9-1', text: 'clock', imageEmoji: '⏰', isCorrect: true },
          { id: 'opt-9-2', text: 'pot', imageEmoji: '🍲', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Direct Bimi's attention! Say: 'Look at the clock.'", suggestedStudentReply: 'Look at the clock.', hint: 'Say: Look at the clock.' }],
  },

  // Unit 10
  {
    id: 'g1-u10',
    unitNumber: 10,
    grade: 1,
    title: 'At the Zoo',
    titleVi: 'Ở sở thú',
    theme: 'Wild Animals',
    themeEmoji: '🦓',
    targetLetter: 'Z, z',
    phonicsSound: '/z/',
    storyTopic: 'Zoo Safari',
    vocabulary: [
      { id: 'w-zoo', word: 'zoo', meaningVi: 'sở thú', phonetic: '/zuː/', letter: 'z', imageEmoji: '🦁', exampleSentence: 'Visit animals at the zoo.', audioText: 'zoo' },
      { id: 'w-zebra', word: 'zebra', meaningVi: 'ngựa vằn', phonetic: '/ˈzeb.rə/', letter: 'z', imageEmoji: '🦓', exampleSentence: 'A black and white zebra.', audioText: 'zebra' },
      { id: 'w-zebu', word: 'zebu', meaningVi: 'bò u', phonetic: '/ˈziː.buː/', letter: 'z', imageEmoji: '🐂', exampleSentence: 'A gentle horned zebu.', audioText: 'zebu' },
      { id: 'w-zero', word: 'zero', meaningVi: 'số không', phonetic: '/ˈzɪə.rəʊ/', letter: 'z', imageEmoji: '0️⃣', exampleSentence: 'Count from zero to ten.', audioText: 'zero' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-10',
        pattern: 'I can see a zebra at the zoo.',
        patternVi: 'Tớ có thể thấy một chú ngựa vằn ở sở thú.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'What can you see?', textVi: 'Bạn thấy gì nào?', audioText: 'What can you see?' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'I can see a zebra!', textVi: 'Tớ thấy một chú ngựa vằn!', audioText: 'I can see a zebra!' },
        ],
        scrambleWords: ['I', 'can', 'see', 'a', 'zebra.'],
        correctOrder: ['I', 'can', 'see', 'a', 'zebra.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Look at the stripes! What can you see?', expectedReply: 'I can see a zebra.' }],
      },
    ],
    phonics: {
      id: 'ph-z',
      letter: 'Z, z',
      sound: '/z/',
      soundTip: 'Vibrate vocal cords like a buzzing bee: /z/, /z/, zebra!',
      soundTipVi: 'Rung dây thanh âm như tiếng ong vo ve: /z/, /z/, zebra!',
      blendingExamples: [
        { onset: 'z', rime: 'oo', word: 'zoo', emoji: '🦁' },
        { onset: 'z', rime: 'ip', word: 'zip', emoji: '🤐' },
      ],
      segmentingWords: [{ word: 'zoo', sounds: ['/z/', '/uː/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-10',
        type: 'choose',
        questionPrompt: 'Listen and choose: "zebra"',
        audioPrompt: 'zebra',
        options: [
          { id: 'opt-10-1', text: 'zebra', imageEmoji: '🦓', isCorrect: true },
          { id: 'opt-10-2', text: 'zebu', imageEmoji: '🐂', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What animal do you see at the zoo? Say: 'I can see a zebra.'", suggestedStudentReply: 'I can see a zebra.', hint: 'Say: I can see a zebra.' }],
  },

  // Unit 11
  {
    id: 'g1-u11',
    unitNumber: 11,
    grade: 1,
    title: 'At the Bus Stop',
    titleVi: 'Ở trạm xe buýt',
    theme: 'Vehicles & Street',
    themeEmoji: '🚌',
    targetLetter: 'U, u',
    phonicsSound: '/ʌ/',
    storyTopic: 'City Transit',
    vocabulary: [
      { id: 'w-bus', word: 'bus', meaningVi: 'xe buýt', phonetic: '/bʌs/', letter: 'u', imageEmoji: '🚌', exampleSentence: 'Ride the yellow school bus.', audioText: 'bus' },
      { id: 'w-truck', word: 'truck', meaningVi: 'xe tải', phonetic: '/trʌk/', letter: 'u', imageEmoji: '🚚', exampleSentence: 'A heavy cargo truck.', audioText: 'truck' },
      { id: 'w-sun', word: 'sun', meaningVi: 'mặt trời', phonetic: '/sʌn/', letter: 'u', imageEmoji: '☀️', exampleSentence: 'The bright sunny day.', audioText: 'sun' },
      { id: 'w-cup-u', word: 'run', meaningVi: 'chạy bộ', phonetic: '/rʌn/', letter: 'u', imageEmoji: '🏃', exampleSentence: 'Run to catch the bus.', audioText: 'run' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-11',
        pattern: 'The bus is coming.',
        patternVi: 'Xe buýt đang tới rồi.',
        dialogue: [
          { speaker: 'Ba', avatar: '🧒', textEn: 'Look! The bus is coming.', textVi: 'Nhìn kìa! Xe buýt đang tới.', audioText: 'Look! The bus is coming.' },
          { speaker: 'Bill', avatar: '👦', textEn: 'Let’s get on!', textVi: 'Chúng mình cùng lên xe nhé!', audioText: 'Let’s get on!' },
        ],
        scrambleWords: ['The', 'bus', 'is', 'coming.'],
        correctOrder: ['The', 'bus', 'is', 'coming.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Tell everyone at the bus stop what vehicle is arriving!', expectedReply: 'The bus is coming.' }],
      },
    ],
    phonics: {
      id: 'ph-u',
      letter: 'U, u',
      sound: '/ʌ/',
      soundTip: 'Relax jaw and make short open sound from chest: /ʌ/, /ʌ/, bus!',
      soundTipVi: 'Âm á ngắn nhẹ nhàng từ lồng ngực: /ʌ/, /ʌ/, bus!',
      blendingExamples: [
        { onset: 'b', rime: 'us', word: 'bus', emoji: '🚌' },
        { onset: 's', rime: 'un', word: 'sun', emoji: '☀️' },
      ],
      segmentingWords: [{ word: 'bus', sounds: ['/b/', '/ʌ/', '/s/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-11',
        type: 'choose',
        questionPrompt: 'Listen and choose: "bus"',
        audioPrompt: 'bus',
        options: [
          { id: 'opt-11-1', text: 'bus', imageEmoji: '🚌', isCorrect: true },
          { id: 'opt-11-2', text: 'truck', imageEmoji: '🚚', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Announce the ride! Say: 'The bus is coming.'", suggestedStudentReply: 'The bus is coming.', hint: 'Say: The bus is coming.' }],
  },

  // Unit 12
  {
    id: 'g1-u12',
    unitNumber: 12,
    grade: 1,
    title: 'At the Lake',
    titleVi: 'Ở bên hồ nước',
    theme: 'Nature & Lake',
    themeEmoji: '🌊',
    targetLetter: 'L, l',
    phonicsSound: '/l/',
    storyTopic: 'Lakeside Walk',
    vocabulary: [
      { id: 'w-lake', word: 'lake', meaningVi: 'hồ nước', phonetic: '/leɪk/', letter: 'l', imageEmoji: '🏞️', exampleSentence: 'Clear blue lake water.', audioText: 'lake' },
      { id: 'w-leaf', word: 'leaf', meaningVi: 'chiếc lá', phonetic: '/liːf/', letter: 'l', imageEmoji: '🍃', exampleSentence: 'A green floating leaf.', audioText: 'leaf' },
      { id: 'w-lemon', word: 'lemon', meaningVi: 'quả chanh vàng', phonetic: '/ˈlem.ən/', letter: 'l', imageEmoji: '🍋', exampleSentence: 'Sour yellow lemon.', audioText: 'lemon' },
      { id: 'w-lock-l', word: 'lion', meaningVi: 'sư tử', phonetic: '/ˈlaɪ.ən/', letter: 'l', imageEmoji: '🦁', exampleSentence: 'A golden royal lion.', audioText: 'lion' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-12',
        pattern: 'There is a leaf on the lake.',
        patternVi: 'Có một chiếc lá trên mặt hồ.',
        dialogue: [
          { speaker: 'Smarty', avatar: '🦉', textEn: 'Look at the blue lake.', textVi: 'Nhìn hồ nước xanh kìa.', audioText: 'Look at the blue lake.' },
          { speaker: 'Bimi', avatar: '🐻', textEn: 'I see a green leaf.', textVi: 'Tớ thấy một chiếc lá xanh.', audioText: 'I see a green leaf.' },
        ],
        scrambleWords: ['There', 'is', 'a', 'leaf.'],
        correctOrder: ['There', 'is', 'a', 'leaf.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'What is floating on the water?', expectedReply: 'There is a leaf.' }],
      },
    ],
    phonics: {
      id: 'ph-l',
      letter: 'L, l',
      sound: '/l/',
      soundTip: 'Tongue tip touches roof behind teeth: /l/, /l/, lake!',
      soundTipVi: 'Đầu lưỡi chạm vòm miệng trên sau răng: /l/, /l/, lake!',
      blendingExamples: [
        { onset: 'l', rime: 'ake', word: 'lake', emoji: '🏞️' },
        { onset: 'l', rime: 'eaf', word: 'leaf', emoji: '🍃' },
      ],
      segmentingWords: [{ word: 'lake', sounds: ['/l/', '/eɪ/', '/k/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-12',
        type: 'choose',
        questionPrompt: 'Listen and choose: "leaf"',
        audioPrompt: 'leaf',
        options: [
          { id: 'opt-12-1', text: 'leaf', imageEmoji: '🍃', isCorrect: true },
          { id: 'opt-12-2', text: 'lake', imageEmoji: '🏞️', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Describe what you see on the lake! Say: 'There is a leaf.'", suggestedStudentReply: 'There is a leaf.', hint: 'Say: There is a leaf.' }],
  },

  // Unit 13
  {
    id: 'g1-u13',
    unitNumber: 13,
    grade: 1,
    title: 'In the School Canteen',
    titleVi: 'Trong căng tin trường học',
    theme: 'Meals & Healthy Food',
    themeEmoji: '🍜',
    targetLetter: 'N, n',
    phonicsSound: '/n/',
    storyTopic: 'School Canteen Lunch',
    vocabulary: [
      { id: 'w-noodles', word: 'noodles', meaningVi: 'mì sợi / phở', phonetic: '/ˈnuː.dəlz/', letter: 'n', imageEmoji: '🍜', exampleSentence: 'Hot bowl of noodles.', audioText: 'noodles' },
      { id: 'w-nuts', word: 'nuts', meaningVi: 'hạt dinh dưỡng', phonetic: '/nʌts/', letter: 'n', imageEmoji: '🥜', exampleSentence: 'Crunchy healthy nuts.', audioText: 'nuts' },
      { id: 'w-banana', word: 'banana', meaningVi: 'quả chuối', phonetic: '/bəˈnɑː.nə/', letter: 'n', imageEmoji: '🍌', exampleSentence: 'A sweet yellow banana.', audioText: 'banana' },
      { id: 'w-nine', word: 'nine', meaningVi: 'số chín', phonetic: '/naɪn/', letter: 'n', imageEmoji: '9️⃣', exampleSentence: 'Nine healthy bowls.', audioText: 'nine' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-13',
        pattern: 'Do you like noodles? - Yes, I do.',
        patternVi: 'Bạn có thích ăn mì không? - Có, tớ rất thích.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Do you like noodles?', textVi: 'Bạn thích mì không?', audioText: 'Do you like noodles?' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'Yes, I do! Yum!', textVi: 'Có, tớ thích lắm! Ngon quá!', audioText: 'Yes, I do! Yum!' },
        ],
        scrambleWords: ['Do', 'you', 'like', 'noodles?'],
        correctOrder: ['Do', 'you', 'like', 'noodles?'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Lunchtime! Do you like noodles?', expectedReply: 'Yes, I do.' }],
      },
    ],
    phonics: {
      id: 'ph-n',
      letter: 'N, n',
      sound: '/n/',
      soundTip: 'Nasal sound with tongue firmly against upper gum: /n/, /n/, noodles!',
      soundTipVi: 'Âm mũi với đầu lưỡi áp sát chân răng trên: /n/, /n/, noodles!',
      blendingExamples: [
        { onset: 'n', rime: 'uts', word: 'nuts', emoji: '🥜' },
        { onset: 'n', rime: 'ine', word: 'nine', emoji: '9️⃣' },
      ],
      segmentingWords: [{ word: 'nuts', sounds: ['/n/', '/ʌ/', '/t/', '/s/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-13',
        type: 'choose',
        questionPrompt: 'Listen and choose: "noodles"',
        audioPrompt: 'noodles',
        options: [
          { id: 'opt-13-1', text: 'noodles', imageEmoji: '🍜', isCorrect: true },
          { id: 'opt-13-2', text: 'nuts', imageEmoji: '🥜', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Answer Bimi's question! Say: 'Yes, I do.'", suggestedStudentReply: 'Yes, I do.', hint: 'Say: Yes, I do.' }],
  },

  // Unit 14
  {
    id: 'g1-u14',
    unitNumber: 14,
    grade: 1,
    title: 'In the Toy Shop',
    titleVi: 'Trong cửa hàng đồ chơi',
    theme: 'Toys & Fun',
    themeEmoji: '🧸',
    targetLetter: 'T, t',
    phonicsSound: '/t/',
    storyTopic: 'Toy Wonderland',
    vocabulary: [
      { id: 'w-tiger', word: 'tiger', meaningVi: 'con hổ đồ chơi', phonetic: '/ˈtaɪ.ɡər/', letter: 't', imageEmoji: '🐯', exampleSentence: 'A striped toy tiger.', audioText: 'tiger' },
      { id: 'w-top', word: 'top', meaningVi: 'con quay', phonetic: '/tɒp/', letter: 't', imageEmoji: '🪀', exampleSentence: 'Spin the spinning top.', audioText: 'top' },
      { id: 'w-teddy', word: 'teddy bear', meaningVi: 'gấu bông', phonetic: '/ˈted.i beər/', letter: 't', imageEmoji: '🧸', exampleSentence: 'A soft cuddly teddy bear.', audioText: 'teddy bear' },
      { id: 'w-turtle', word: 'turtle', meaningVi: 'con rùa', phonetic: '/ˈtɜː.təl/', letter: 't', imageEmoji: '🐢', exampleSentence: 'A gentle green turtle.', audioText: 'turtle' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-14',
        pattern: 'I have a teddy bear.',
        patternVi: 'Tớ có một chú gấu bông.',
        dialogue: [
          { speaker: 'Mai', avatar: '👧', textEn: 'I have a teddy bear.', textVi: 'Tớ có một chú gấu bông.', audioText: 'I have a teddy bear.' },
          { speaker: 'Bill', avatar: '👦', textEn: 'I have a toy tiger.', textVi: 'Tớ có một chú hổ đồ chơi.', audioText: 'I have a toy tiger.' },
        ],
        scrambleWords: ['I', 'have', 'a', 'teddy', 'bear.'],
        correctOrder: ['I', 'have', 'a', 'teddy', 'bear.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'What toy do you pick in the shop?', expectedReply: 'I have a teddy bear.' }],
      },
    ],
    phonics: {
      id: 'ph-t',
      letter: 'T, t',
      sound: '/t/',
      soundTip: 'Tap tongue tip and release crisp unvoiced air: /t/, /t/, tiger!',
      soundTipVi: 'Bật nhẹ đầu lưỡi ở nướu răng trên: /t/, /t/, tiger!',
      blendingExamples: [
        { onset: 't', rime: 'op', word: 'top', emoji: '🪀' },
        { onset: 't', rime: 'en', word: 'ten', emoji: '🔟' },
      ],
      segmentingWords: [{ word: 'top', sounds: ['/t/', '/ɒ/', '/p/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-14',
        type: 'choose',
        questionPrompt: 'Listen and choose: "teddy bear"',
        audioPrompt: 'teddy bear',
        options: [
          { id: 'opt-14-1', text: 'teddy bear', imageEmoji: '🧸', isCorrect: true },
          { id: 'opt-14-2', text: 'tiger', imageEmoji: '🐯', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Show off your favorite toy! Say: 'I have a teddy bear.'", suggestedStudentReply: 'I have a teddy bear.', hint: 'Say: I have a teddy bear.' }],
  },

  // Unit 15
  {
    id: 'g1-u15',
    unitNumber: 15,
    grade: 1,
    title: 'At the Football Match',
    titleVi: 'Tại trận đấu bóng đá',
    theme: 'Sports & Movement',
    themeEmoji: '⚽',
    targetLetter: 'F, f',
    phonicsSound: '/f/',
    storyTopic: 'Football Match Championship',
    vocabulary: [
      { id: 'w-football', word: 'football', meaningVi: 'bóng đá', phonetic: '/ˈfʊt.bɔːl/', letter: 'f', imageEmoji: '⚽', exampleSentence: 'Play a football game.', audioText: 'football' },
      { id: 'w-fan', word: 'fan', meaningVi: 'người hâm mộ', phonetic: '/fæn/', letter: 'f', imageEmoji: '📣', exampleSentence: 'Cheer like a football fan.', audioText: 'fan' },
      { id: 'w-face', word: 'face', meaningVi: 'khuôn mặt', phonetic: '/feɪs/', letter: 'f', imageEmoji: '😀', exampleSentence: 'A smiling joyful face.', audioText: 'face' },
      { id: 'w-foot', word: 'foot', meaningVi: 'bàn chân', phonetic: '/fʊt/', letter: 'f', imageEmoji: '🦶', exampleSentence: 'Kick the ball with your foot.', audioText: 'foot' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-15',
        pattern: 'Kick the ball with your foot!',
        patternVi: 'Hãy sút bóng bằng chân của bạn!',
        dialogue: [
          { speaker: 'Ba', avatar: '🧒', textEn: 'Pass the football to me!', textVi: 'Chuyền bóng cho tớ nào!', audioText: 'Pass the football to me!' },
          { speaker: 'Bill', avatar: '👦', textEn: 'Go, go, football team!', textVi: 'Cố lên, đội bóng đá!', audioText: 'Go, go, football team!' },
        ],
        scrambleWords: ['Play', 'football', 'today!'],
        correctOrder: ['Play', 'football', 'today!'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Cheer for your team! What sport is it?', expectedReply: 'We play football!' }],
      },
    ],
    phonics: {
      id: 'ph-f',
      letter: 'F, f',
      sound: '/f/',
      soundTip: 'Upper teeth touch lower lip, blowing smooth air: /f/, /f/, football!',
      soundTipVi: 'Răng trên chạm nhẹ môi dưới thổi hơi: /f/, /f/, football!',
      blendingExamples: [
        { onset: 'f', rime: 'an', word: 'fan', emoji: '📣' },
        { onset: 'f', rime: 'oot', word: 'foot', emoji: '🦶' },
      ],
      segmentingWords: [{ word: 'fan', sounds: ['/f/', '/æ/', '/n/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-15',
        type: 'choose',
        questionPrompt: 'Listen and choose: "football"',
        audioPrompt: 'football',
        options: [
          { id: 'opt-15-1', text: 'football', imageEmoji: '⚽', isCorrect: true },
          { id: 'opt-15-2', text: 'fan', imageEmoji: '📣', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Cheer loudly at the stadium! Say: 'We play football!'", suggestedStudentReply: 'We play football!', hint: 'Say: We play football!' }],
  },

  // Unit 16
  {
    id: 'g1-u16',
    unitNumber: 16,
    grade: 1,
    title: 'At Home',
    titleVi: 'Ở nhà',
    theme: 'Family & Body',
    themeEmoji: '🏠',
    targetLetter: 'H, h',
    phonicsSound: '/h/',
    storyTopic: 'Happy Home',
    vocabulary: [
      { id: 'w-hair', word: 'hair', meaningVi: 'mái tóc', phonetic: '/heər/', letter: 'h', imageEmoji: '💇', exampleSentence: 'Brush your clean hair.', audioText: 'hair' },
      { id: 'w-hand-g1', word: 'hand', meaningVi: 'bàn tay', phonetic: '/hænd/', letter: 'h', imageEmoji: '✋', exampleSentence: 'Clap your hands together.', audioText: 'hand' },
      { id: 'w-head', word: 'head', meaningVi: 'cái đầu', phonetic: '/hed/', letter: 'h', imageEmoji: '🗣️', exampleSentence: 'Nod your head yes.', audioText: 'head' },
      { id: 'w-horse-g1', word: 'horse', meaningVi: 'chú ngựa', phonetic: '/hɔːs/', letter: 'h', imageEmoji: '🐴', exampleSentence: 'A playful wooden horse.', audioText: 'horse' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g1-16',
        pattern: 'Touch your hair! / Wash your hands.',
        patternVi: 'Chạm vào tóc của bạn! / Rửa sạch tay.',
        dialogue: [
          { speaker: 'Mom', avatar: '👩', textEn: 'Wash your hands before dinner.', textVi: 'Rửa tay trước khi ăn tối nhé.', audioText: 'Wash your hands before dinner.' },
          { speaker: 'Minh', avatar: '🧒', textEn: 'Yes, Mom! I love our home.', textVi: 'Dạ vâng ạ! Con yêu gia đình mình.', audioText: 'Yes, Mom! I love our home.' },
        ],
        scrambleWords: ['Wash', 'your', 'hands.'],
        correctOrder: ['Wash', 'your', 'hands.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Follow the friendly instruction: Touch your hair!', expectedReply: 'Touch your hair.' }],
      },
    ],
    phonics: {
      id: 'ph-h-g1',
      letter: 'H, h',
      sound: '/h/',
      soundTip: 'Exhale warm gentle breeze from back of mouth: /h/, /h/, hand!',
      soundTipVi: 'Thở hơi êm từ họng: /h/, /h/, hand!',
      blendingExamples: [
        { onset: 'h', rime: 'air', word: 'hair', emoji: '💇' },
        { onset: 'h', rime: 'and', word: 'hand', emoji: '✋' },
      ],
      segmentingWords: [{ word: 'hand', sounds: ['/h/', '/æ/', '/n/', '/d/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g1-16',
        type: 'choose',
        questionPrompt: 'Listen and choose: "hand"',
        audioPrompt: 'hand',
        options: [
          { id: 'opt-16-1', text: 'hand', imageEmoji: '✋', isCorrect: true },
          { id: 'opt-16-2', text: 'head', imageEmoji: '🗣️', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Practice healthy habits at home! Say: 'Wash your hands.'", suggestedStudentReply: 'Wash your hands.', hint: 'Say: Wash your hands.' }],
  },
];

export const GRADE_2_UNITS: Unit[] = [
  // Unit 1
  {
    id: 'g2-u1',
    unitNumber: 1,
    grade: 2,
    title: 'At My Birthday Party',
    titleVi: 'Tại bữa tiệc sinh nhật',
    theme: 'Celebrations & Family',
    themeEmoji: '🎂',
    targetLetter: 'M, m',
    phonicsSound: '/m/',
    storyTopic: 'Birthday Party',
    vocabulary: [
      { id: 'w-monkey', word: 'monkey', meaningVi: 'con khỉ', phonetic: '/ˈmʌŋ.ki/', letter: 'm', imageEmoji: '🐵', exampleSentence: 'The funny monkey sings.', audioText: 'monkey' },
      { id: 'w-mango', word: 'mango', meaningVi: 'quả xoài', phonetic: '/ˈmæŋ.ɡəʊ/', letter: 'm', imageEmoji: '🥭', exampleSentence: 'A sweet yellow mango.', audioText: 'mango' },
      { id: 'w-mother', word: 'mother', meaningVi: 'người mẹ', phonetic: '/ˈmʌð.ər/', letter: 'm', imageEmoji: '👩', exampleSentence: 'My mother hugs me.', audioText: 'mother' },
      { id: 'w-mouse', word: 'mouse', meaningVi: 'con chuột', phonetic: '/maʊs/', letter: 'm', imageEmoji: '🐭', exampleSentence: 'A cute little mouse.', audioText: 'mouse' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-1',
        pattern: 'He’s / She’s eating a mango.',
        patternVi: 'Anh ấy / Cô ấy đang ăn một quả xoài.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'What is she eating?', textVi: 'Cô ấy đang ăn gì vậy?', audioText: 'What is she eating?' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'She’s eating a sweet mango.', textVi: 'Cô ấy đang ăn một quả xoài ngọt.', audioText: 'She’s eating a sweet mango.' },
        ],
        scrambleWords: ['She’s', 'eating', 'a', 'mango.'],
        correctOrder: ['She’s', 'eating', 'a', 'mango.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Look at the birthday table! What is she eating?', expectedReply: 'She’s eating a mango.' }],
      },
    ],
    phonics: {
      id: 'ph-m',
      letter: 'M, m',
      sound: '/m/',
      soundTip: 'Press both lips tight and hum through your nose: /m/, /m/, mango!',
      soundTipVi: 'Khép chặt hai môi và ngâm giọng qua mũi: /m/, /m/, mango!',
      blendingExamples: [
        { onset: 'm', rime: 'an', word: 'man', emoji: '👨' },
        { onset: 'm', rime: 'op', word: 'mop', emoji: '🧹' },
      ],
      segmentingWords: [{ word: 'mouse', sounds: ['/m/', '/aʊ/', '/s/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-1',
        type: 'choose',
        questionPrompt: 'Listen and choose: "mango"',
        audioPrompt: 'mango',
        options: [
          { id: 'opt-g2-1-1', text: 'mango', imageEmoji: '🥭', isCorrect: true },
          { id: 'opt-g2-1-2', text: 'monkey', imageEmoji: '🐵', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Describe what she is doing! Say: 'She is eating a mango.'", suggestedStudentReply: 'She is eating a mango.', hint: 'Say: She is eating a mango.' }],
  },

  // Unit 2
  {
    id: 'g2-u2',
    unitNumber: 2,
    grade: 2,
    title: 'In the Backyard',
    titleVi: 'Ở sân sau nhà',
    theme: 'Home & Play',
    themeEmoji: '🪁',
    targetLetter: 'K, k',
    phonicsSound: '/k/',
    storyTopic: 'Backyard Playtime',
    vocabulary: [
      { id: 'w-kite', word: 'kite', meaningVi: 'chiếc diều', phonetic: '/kaɪt/', letter: 'k', imageEmoji: '🪁', exampleSentence: 'Fly a kite in the wind.', audioText: 'kite' },
      { id: 'w-kitten', word: 'kitten', meaningVi: 'mèo con', phonetic: '/ˈkɪt.ən/', letter: 'k', imageEmoji: '🐱', exampleSentence: 'A tiny playful kitten.', audioText: 'kitten' },
      { id: 'w-bike-k', word: 'bike', meaningVi: 'xe đạp', phonetic: '/baɪk/', letter: 'k', imageEmoji: '🚲', exampleSentence: 'Ride a bike in the backyard.', audioText: 'bike' },
      { id: 'w-cake-k', word: 'cake', meaningVi: 'bánh ngọt', phonetic: '/keɪk/', letter: 'k', imageEmoji: '🍰', exampleSentence: 'Eat a slice of cake.', audioText: 'cake' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-2',
        pattern: 'He’s / She’s flying a kite.',
        patternVi: 'Cậu ấy / Cô ấy đang thả diều.',
        dialogue: [
          { speaker: 'Minh', avatar: '👦', textEn: 'Look at Nam in the backyard!', textVi: 'Nhìn Nam ở sân sau kìa!', audioText: 'Look at Nam in the backyard!' },
          { speaker: 'Linh', avatar: '👧', textEn: 'He’s flying a colorful kite.', textVi: 'Cậu ấy đang thả một con diều rực rỡ.', audioText: 'He’s flying a colorful kite.' },
        ],
        scrambleWords: ['He’s', 'flying', 'a', 'kite.'],
        correctOrder: ['He’s', 'flying', 'a', 'kite.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'What is the boy doing in the windy yard?', expectedReply: 'He’s flying a kite.' }],
      },
    ],
    phonics: {
      id: 'ph-k',
      letter: 'K, k',
      sound: '/k/',
      soundTip: 'Release quick breath from back of tongue: /k/, /k/, kite!',
      soundTipVi: 'Bật hơi dứt khoát từ gốc lưỡi: /k/, /k/, kite!',
      blendingExamples: [
        { onset: 'k', rime: 'ite', word: 'kite', emoji: '🪁' },
        { onset: 'k', rime: 'id', word: 'kid', emoji: '🧒' },
      ],
      segmentingWords: [{ word: 'kite', sounds: ['/k/', '/aɪ/', '/t/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-2',
        type: 'choose',
        questionPrompt: 'Listen and choose: "kitten"',
        audioPrompt: 'kitten',
        options: [
          { id: 'opt-g2-2-1', text: 'kitten', imageEmoji: '🐱', isCorrect: true },
          { id: 'opt-g2-2-2', text: 'kite', imageEmoji: '🪁', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What is he doing? Say: 'He is flying a kite.'", suggestedStudentReply: 'He is flying a kite.', hint: 'Say: He is flying a kite.' }],
  },

  // Unit 3
  {
    id: 'g2-u3',
    unitNumber: 3,
    grade: 2,
    title: 'At the Seaside',
    titleVi: 'Ở bờ biển',
    theme: 'Holiday & Nature',
    themeEmoji: '🏖️',
    targetLetter: 'S, s',
    phonicsSound: '/s/',
    storyTopic: 'Sunny Beach Trip',
    vocabulary: [
      { id: 'w-sea', word: 'sea', meaningVi: 'biển', phonetic: '/siː/', letter: 's', imageEmoji: '🌊', exampleSentence: 'Swim in the cool sea.', audioText: 'sea' },
      { id: 'w-sail', word: 'sail', meaningVi: 'cánh buồm', phonetic: '/seɪl/', letter: 's', imageEmoji: '⛵', exampleSentence: 'A white sailboat travels.', audioText: 'sail' },
      { id: 'w-sand', word: 'sand', meaningVi: 'bãi cát', phonetic: '/sænd/', letter: 's', imageEmoji: '🏖️', exampleSentence: 'Build a castle on the sand.', audioText: 'sand' },
      { id: 'w-sun-s', word: 'sun', meaningVi: 'mặt trời', phonetic: '/sʌn/', letter: 's', imageEmoji: '☀️', exampleSentence: 'Golden warm seaside sun.', audioText: 'sun' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-3',
        pattern: 'Look at the sea! / The sun is shining.',
        patternVi: 'Hãy nhìn ra biển kìa! / Mặt trời đang tỏa sáng.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Look at the sail on the sea!', textVi: 'Nhìn cánh buồm ngoài biển kìa!', audioText: 'Look at the sail on the sea!' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'The sun is so warm and bright.', textVi: 'Mặt trời ấm áp và rực rỡ quá.', audioText: 'The sun is so warm and bright.' },
        ],
        scrambleWords: ['Look', 'at', 'the', 'sea.'],
        correctOrder: ['Look', 'at', 'the', 'sea.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Tell Smarty to gaze at the blue water!', expectedReply: 'Look at the sea.' }],
      },
    ],
    phonics: {
      id: 'ph-s',
      letter: 'S, s',
      sound: '/s/',
      soundTip: 'Hissing sound between teeth: /s/, /s/, sea!',
      soundTipVi: 'Thổi hơi dài qua kẽ răng khép nhẹ: /s/, /s/, sea!',
      blendingExamples: [
        { onset: 's', rime: 'ea', word: 'sea', emoji: '🌊' },
        { onset: 's', rime: 'and', word: 'sand', emoji: '🏖️' },
      ],
      segmentingWords: [{ word: 'sand', sounds: ['/s/', '/æ/', '/n/', '/d/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-3',
        type: 'choose',
        questionPrompt: 'Listen and choose: "sand"',
        audioPrompt: 'sand',
        options: [
          { id: 'opt-g2-3-1', text: 'sand', imageEmoji: '🏖️', isCorrect: true },
          { id: 'opt-g2-3-2', text: 'sea', imageEmoji: '🌊', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Direct your friend's gaze at the coast! Say: 'Look at the sea.'", suggestedStudentReply: 'Look at the sea.', hint: 'Say: Look at the sea.' }],
  },

  // Unit 4
  {
    id: 'g2-u4',
    unitNumber: 4,
    grade: 2,
    title: 'In the Countryside',
    titleVi: 'Ở vùng nông thôn',
    theme: 'Countryside & Animals',
    themeEmoji: '🏡',
    targetLetter: 'H, h',
    phonicsSound: '/h/',
    storyTopic: 'Countryside Farm Visit',
    vocabulary: [
      { id: 'w-horse-g2', word: 'horse', meaningVi: 'con ngựa', phonetic: '/hɔːs/', letter: 'h', imageEmoji: '🐴', exampleSentence: 'The brown horse gallops.', audioText: 'horse' },
      { id: 'w-house-g2', word: 'house', meaningVi: 'ngôi nhà', phonetic: '/haʊs/', letter: 'h', imageEmoji: '🏡', exampleSentence: 'A cozy house on the hill.', audioText: 'house' },
      { id: 'w-hill-g2', word: 'hill', meaningVi: 'ngọn đồi', phonetic: '/hɪl/', letter: 'h', imageEmoji: '⛰️', exampleSentence: 'Green grass on the hill.', audioText: 'hill' },
      { id: 'w-hand-g2', word: 'hand', meaningVi: 'bàn tay', phonetic: '/hænd/', letter: 'h', imageEmoji: '✋', exampleSentence: 'Wave your hand hello.', audioText: 'hand' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-4',
        pattern: 'What can you see? - I can see a horse.',
        patternVi: 'Bạn có thể nhìn thấy gì? - Tớ thấy một chú ngựa.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'What can you see on the hill?', textVi: 'Bạn thấy gì trên ngọn đồi?', audioText: 'What can you see on the hill?' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'I can see a brown horse.', textVi: 'Tớ thấy một chú ngựa màu nâu.', audioText: 'I can see a brown horse.' },
        ],
        scrambleWords: ['I', 'can', 'see', 'a', 'horse.'],
        correctOrder: ['I', 'can', 'see', 'a', 'horse.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Look past the fence! What can you see?', expectedReply: 'I can see a horse.' }],
      },
    ],
    phonics: {
      id: 'ph-h-g2',
      letter: 'H, h',
      sound: '/h/',
      soundTip: 'Gentle warm sigh: /h/, /h/, horse!',
      soundTipVi: 'Thở hơi nhẹ và êm từ họng ra: /h/, /h/, horse!',
      blendingExamples: [
        { onset: 'h', rime: 'ill', word: 'hill', emoji: '⛰️' },
        { onset: 'h', rime: 'ouse', word: 'house', emoji: '🏡' },
      ],
      segmentingWords: [{ word: 'hill', sounds: ['/h/', '/ɪ/', '/l/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-4',
        type: 'choose',
        questionPrompt: 'Listen and choose: "horse"',
        audioPrompt: 'horse',
        options: [
          { id: 'opt-g2-4-1', text: 'horse', imageEmoji: '🐴', isCorrect: true },
          { id: 'opt-g2-4-2', text: 'house', imageEmoji: '🏡', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What do you see in the meadow? Say: 'I can see a horse.'", suggestedStudentReply: 'I can see a horse.', hint: 'Say: I can see a horse.' }],
  },

  // Unit 5
  {
    id: 'g2-u5',
    unitNumber: 5,
    grade: 2,
    title: 'In the Classroom',
    titleVi: 'Trong lớp học',
    theme: 'School & Learning',
    themeEmoji: '🏫',
    targetLetter: 'T, t',
    phonicsSound: '/t/',
    storyTopic: 'English Lesson Fun',
    vocabulary: [
      { id: 'w-table', word: 'table', meaningVi: 'cái bàn', phonetic: '/ˈteɪ.bəl/', letter: 't', imageEmoji: '🪵', exampleSentence: 'Sit neatly at the table.', audioText: 'table' },
      { id: 'w-teacher', word: 'teacher', meaningVi: 'cô giáo', phonetic: '/ˈtiː.tʃər/', letter: 't', imageEmoji: '👩‍🏫', exampleSentence: 'Listen to the kind teacher.', audioText: 'teacher' },
      { id: 'w-tiger-5', word: 'tiger', meaningVi: 'bức tranh con hổ', phonetic: '/ˈtaɪ.ɡər/', letter: 't', imageEmoji: '🐯', exampleSentence: 'A picture of a tiger.', audioText: 'tiger' },
      { id: 'w-turtle-5', word: 'turtle', meaningVi: 'chú rùa', phonetic: '/ˈtɜː.təl/', letter: 't', imageEmoji: '🐢', exampleSentence: 'A cute mascot turtle.', audioText: 'turtle' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-5',
        pattern: 'Point to the teacher. / Clean the table.',
        patternVi: 'Hãy chỉ vào cô giáo. / Lau sạch mặt bàn.',
        dialogue: [
          { speaker: 'Nam', avatar: '👦', textEn: 'Good morning, Teacher!', textVi: 'Chúng em chào cô ạ!', audioText: 'Good morning, Teacher!' },
          { speaker: 'Teacher', avatar: '👩‍🏫', textEn: 'Good morning! Please sit at your table.', textVi: 'Chào các con! Mời các con ngồi vào bàn.', audioText: 'Good morning! Please sit at your table.' },
        ],
        scrambleWords: ['Point', 'to', 'the', 'table.'],
        correctOrder: ['Point', 'to', 'the', 'table.'],
        rolePlayPrompts: [{ character: 'Teacher', prompt: 'Welcome to class! Greet your teacher politely!', expectedReply: 'Good morning, Teacher!' }],
      },
    ],
    phonics: {
      id: 'ph-t-g2',
      letter: 'T, t',
      sound: '/t/',
      soundTip: 'Tongue taps teeth ridge: /t/, /t/, table!',
      soundTipVi: 'Đầu lưỡi gõ nhẹ nướu trên: /t/, /t/, table!',
      blendingExamples: [
        { onset: 't', rime: 'en', word: 'ten', emoji: '🔟' },
        { onset: 't', rime: 'op', word: 'top', emoji: '🪀' },
      ],
      segmentingWords: [{ word: 'table', sounds: ['/t/', '/eɪ/', '/b/', '/əl/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-5',
        type: 'choose',
        questionPrompt: 'Listen and choose: "teacher"',
        audioPrompt: 'teacher',
        options: [
          { id: 'opt-g2-5-1', text: 'teacher', imageEmoji: '👩‍🏫', isCorrect: true },
          { id: 'opt-g2-5-2', text: 'table', imageEmoji: '🪵', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Greet your teacher politely! Say: 'Good morning, Teacher!'", suggestedStudentReply: 'Good morning, Teacher!', hint: 'Say: Good morning, Teacher!' }],
  },

  // Unit 6
  {
    id: 'g2-u6',
    unitNumber: 6,
    grade: 2,
    title: 'On the Farm',
    titleVi: 'Ở nông trại',
    theme: 'Farms & Animals',
    themeEmoji: '🚜',
    targetLetter: 'F, f',
    phonicsSound: '/f/',
    storyTopic: 'Happy Farm Harvest',
    vocabulary: [
      { id: 'w-farm', word: 'farm', meaningVi: 'nông trại', phonetic: '/fɑːm/', letter: 'f', imageEmoji: '🚜', exampleSentence: 'Animals live on the farm.', audioText: 'farm' },
      { id: 'w-farmer', word: 'farmer', meaningVi: 'bác nông dân', phonetic: '/ˈfɑː.mər/', letter: 'f', imageEmoji: '👨‍🌾', exampleSentence: 'The friendly hardworking farmer.', audioText: 'farmer' },
      { id: 'w-fox', word: 'fox', meaningVi: 'con cáo', phonetic: '/fɒks/', letter: 'f', imageEmoji: '🦊', exampleSentence: 'A clever reddish fox.', audioText: 'fox' },
      { id: 'w-flower', word: 'flower', meaningVi: 'bông hoa', phonetic: '/ˈflaʊ.ər/', letter: 'f', imageEmoji: '🌸', exampleSentence: 'A fragrant blooming flower.', audioText: 'flower' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-6',
        pattern: 'There is a farmer on the farm.',
        patternVi: 'Có một bác nông dân ở nông trại.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Who is that on the tractor?', textVi: 'Ai trên chiếc máy kéo thế?', audioText: 'Who is that on the tractor?' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'There is a friendly farmer!', textVi: 'Đó là một bác nông dân thân thiện!', audioText: 'There is a friendly farmer!' },
        ],
        scrambleWords: ['There', 'is', 'a', 'farmer.'],
        correctOrder: ['There', 'is', 'a', 'farmer.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Who takes care of the green farm?', expectedReply: 'There is a farmer.' }],
      },
    ],
    phonics: {
      id: 'ph-f-g2',
      letter: 'F, f',
      sound: '/f/',
      soundTip: 'Teeth on lip, breathe through: /f/, /f/, farmer!',
      soundTipVi: 'Răng trên đặt môi dưới thổi hơi: /f/, /f/, farmer!',
      blendingExamples: [
        { onset: 'f', rime: 'ox', word: 'fox', emoji: '🦊' },
        { onset: 'f', rime: 'arm', word: 'farm', emoji: '🚜' },
      ],
      segmentingWords: [{ word: 'fox', sounds: ['/f/', '/ɒ/', '/k/', '/s/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-6',
        type: 'choose',
        questionPrompt: 'Listen and choose: "farmer"',
        audioPrompt: 'farmer',
        options: [
          { id: 'opt-g2-6-1', text: 'farmer', imageEmoji: '👨‍🌾', isCorrect: true },
          { id: 'opt-g2-6-2', text: 'fox', imageEmoji: '🦊', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Who is working in the field? Say: 'There is a farmer.'", suggestedStudentReply: 'There is a farmer.', hint: 'Say: There is a farmer.' }],
  },

  // Unit 7
  {
    id: 'g2-u7',
    unitNumber: 7,
    grade: 2,
    title: 'In the Kitchen',
    titleVi: 'Trong phòng bếp',
    theme: 'Food & Cooking',
    themeEmoji: '🍳',
    targetLetter: 'J, j',
    phonicsSound: '/dʒ/',
    storyTopic: 'Kitchen Cooking Time',
    vocabulary: [
      { id: 'w-jam', word: 'jam', meaningVi: 'mứt dâu', phonetic: '/dʒæm/', letter: 'j', imageEmoji: '🍓', exampleSentence: 'Sweet strawberry jam.', audioText: 'jam' },
      { id: 'w-jelly', word: 'jelly', meaningVi: 'thạch rau câu', phonetic: '/ˈdʒel.i/', letter: 'j', imageEmoji: '🍮', exampleSentence: 'Wobbly fruit jelly.', audioText: 'jelly' },
      { id: 'w-juice', word: 'juice', meaningVi: 'nước ép trái cây', phonetic: '/dʒuːs/', letter: 'j', imageEmoji: '🧃', exampleSentence: 'Fresh orange juice.', audioText: 'juice' },
      { id: 'w-jar', word: 'jar', meaningVi: 'hũ thủy tinh', phonetic: '/dʒɑːr/', letter: 'j', imageEmoji: '🫙', exampleSentence: 'A glass honey jar.', audioText: 'jar' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-7',
        pattern: 'I’d like some juice, please.',
        patternVi: 'Cho tớ một cốc nước ép nhé.',
        dialogue: [
          { speaker: 'Minh', avatar: '🧒', textEn: 'I’d like some orange juice, please.', textVi: 'Cho tớ một cốc nước cam nhé.', audioText: 'I’d like some orange juice, please.' },
          { speaker: 'Mom', avatar: '👩', textEn: 'Here you are! Enjoy your juice.', textVi: 'Của con đây! Uống ngon miệng nhé.', audioText: 'Here you are! Enjoy your juice.' },
        ],
        scrambleWords: ['I’d', 'like', 'some', 'juice.'],
        correctOrder: ['I’d', 'like', 'some', 'juice.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Order a polite refreshing drink!', expectedReply: 'I’d like some juice, please.' }],
      },
    ],
    phonics: {
      id: 'ph-j',
      letter: 'J, j',
      sound: '/dʒ/',
      soundTip: 'Voiced burst with rounded lips: /dʒ/, /dʒ/, jam!',
      soundTipVi: 'Bật âm có thanh từ đầu lưỡi khép tròn môi: /dʒ/, /dʒ/, jam!',
      blendingExamples: [
        { onset: 'j', rime: 'am', word: 'jam', emoji: '🍓' },
        { onset: 'j', rime: 'et', word: 'jet', emoji: '✈️' },
      ],
      segmentingWords: [{ word: 'jam', sounds: ['/dʒ/', '/æ/', '/m/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-7',
        type: 'choose',
        questionPrompt: 'Listen and choose: "juice"',
        audioPrompt: 'juice',
        options: [
          { id: 'opt-g2-7-1', text: 'juice', imageEmoji: '🧃', isCorrect: true },
          { id: 'opt-g2-7-2', text: 'jelly', imageEmoji: '🍮', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Order a drink politely! Say: 'I would like some juice, please.'", suggestedStudentReply: 'I would like some juice, please.', hint: 'Say: I would like some juice, please.' }],
  },

  // Unit 8
  {
    id: 'g2-u8',
    unitNumber: 8,
    grade: 2,
    title: 'In the Village',
    titleVi: 'Ở ngôi làng',
    theme: 'Village & Vehicles',
    themeEmoji: '🚐',
    targetLetter: 'V, v',
    phonicsSound: '/v/',
    storyTopic: 'Peaceful Village',
    vocabulary: [
      { id: 'w-village', word: 'village', meaningVi: 'ngôi làng', phonetic: '/ˈvɪl.ɪdʒ/', letter: 'v', imageEmoji: '🏘️', exampleSentence: 'A peaceful green village.', audioText: 'village' },
      { id: 'w-van', word: 'van', meaningVi: 'xe tải nhỏ / xe van', phonetic: '/væn/', letter: 'v', imageEmoji: '🚐', exampleSentence: 'A white delivery van.', audioText: 'van' },
      { id: 'w-volleyball', word: 'volleyball', meaningVi: 'quả bóng chuyền', phonetic: '/ˈvɒl.i.bɔːl/', letter: 'v', imageEmoji: '🏐', exampleSentence: 'Play volleyball with friends.', audioText: 'volleyball' },
      { id: 'w-vase', word: 'vase', meaningVi: 'bình hoa', phonetic: '/vɑːz/', letter: 'v', imageEmoji: '🏺', exampleSentence: 'A lovely flower vase.', audioText: 'vase' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-8',
        pattern: 'He’s driving a van in the village.',
        patternVi: 'Chú ấy đang lái xe van trong làng.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'What is that vehicle?', textVi: 'Xe kia là xe gì thế?', audioText: 'What is that vehicle?' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'He’s driving a white van.', textVi: 'Chú ấy đang lái một chiếc xe van trắng.', audioText: 'He’s driving a white van.' },
        ],
        scrambleWords: ['He’s', 'driving', 'a', 'van.'],
        correctOrder: ['He’s', 'driving', 'a', 'van.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Look down the village road! What is he driving?', expectedReply: 'He’s driving a van.' }],
      },
    ],
    phonics: {
      id: 'ph-v',
      letter: 'V, v',
      sound: '/v/',
      soundTip: 'Vibrate lower lip against upper teeth: /v/, /v/, van!',
      soundTipVi: 'Rung môi dưới chạm răng trên: /v/, /v/, van!',
      blendingExamples: [
        { onset: 'v', rime: 'an', word: 'van', emoji: '🚐' },
        { onset: 'v', rime: 'et', word: 'vet', emoji: '🩺' },
      ],
      segmentingWords: [{ word: 'van', sounds: ['/v/', '/æ/', '/n/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-8',
        type: 'choose',
        questionPrompt: 'Listen and choose: "volleyball"',
        audioPrompt: 'volleyball',
        options: [
          { id: 'opt-g2-8-1', text: 'volleyball', imageEmoji: '🏐', isCorrect: true },
          { id: 'opt-g2-8-2', text: 'van', imageEmoji: '🚐', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What is moving on the street? Say: 'He is driving a van.'", suggestedStudentReply: 'He is driving a van.', hint: 'Say: He is driving a van.' }],
  },

  // Unit 9
  {
    id: 'g2-u9',
    unitNumber: 9,
    grade: 2,
    title: 'In the Grocery Store',
    titleVi: 'Ở cửa hàng tạp hóa',
    theme: 'Shopping & Snacks',
    themeEmoji: '🏪',
    targetLetter: 'Y, y',
    phonicsSound: '/j/',
    storyTopic: 'Grocery Shopping',
    vocabulary: [
      { id: 'w-yoghurt', word: 'yoghurt', meaningVi: 'sữa chua', phonetic: '/ˈjɒɡ.ət/', letter: 'y', imageEmoji: '🥣', exampleSentence: 'Creamy cold yoghurt.', audioText: 'yoghurt' },
      { id: 'w-yam', word: 'yam', meaningVi: 'củ khoai từ', phonetic: '/jæm/', letter: 'y', imageEmoji: '🍠', exampleSentence: 'Sweet steamed yam.', audioText: 'yam' },
      { id: 'w-yoyo', word: 'yo-yo', meaningVi: 'đồ chơi yo-yo', phonetic: '/ˈjəʊ.jəʊ/', letter: 'y', imageEmoji: '🪀', exampleSentence: 'Spin the red yo-yo.', audioText: 'yo-yo' },
      { id: 'w-yellow', word: 'yellow', meaningVi: 'màu vàng', phonetic: '/ˈjel.əʊ/', letter: 'y', imageEmoji: '🟡', exampleSentence: 'A bright yellow box.', audioText: 'yellow' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-9',
        pattern: 'Do you want some yoghurt? - Yes, please.',
        patternVi: 'Bạn có muốn ăn sữa chua không? - Có, làm ơn.',
        dialogue: [
          { speaker: 'Linh', avatar: '👧', textEn: 'Do you want some yoghurt?', textVi: 'Bạn có muốn ăn sữa chua không?', audioText: 'Do you want some yoghurt?' },
          { speaker: 'Minh', avatar: '👦', textEn: 'Yes, please! I love strawberry yoghurt.', textVi: 'Có chứ! Tớ thích sữa chua dâu.', audioText: 'Yes, please! I love strawberry yoghurt.' },
        ],
        scrambleWords: ['I', 'want', 'some', 'yoghurt.'],
        correctOrder: ['I', 'want', 'some', 'yoghurt.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Offer your friend a tasty treat in the store!', expectedReply: 'Do you want some yoghurt?' }],
      },
    ],
    phonics: {
      id: 'ph-y',
      letter: 'Y, y',
      sound: '/j/',
      soundTip: 'Glide smoothly from high tongue position: /j/, /j/, yoghurt!',
      soundTipVi: 'Âm lướt y nhẹ nhàng từ vòm miệng: /j/, /j/, yoghurt!',
      blendingExamples: [
        { onset: 'y', rime: 'am', word: 'yam', emoji: '🍠' },
        { onset: 'y', rime: 'es', word: 'yes', emoji: '✅' },
      ],
      segmentingWords: [{ word: 'yam', sounds: ['/j/', '/æ/', '/m/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-9',
        type: 'choose',
        questionPrompt: 'Listen and choose: "yoghurt"',
        audioPrompt: 'yoghurt',
        options: [
          { id: 'opt-g2-9-1', text: 'yoghurt', imageEmoji: '🥣', isCorrect: true },
          { id: 'opt-g2-9-2', text: 'yo-yo', imageEmoji: '🪀', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What snack do you want? Say: 'I want some yoghurt.'", suggestedStudentReply: 'I want some yoghurt.', hint: 'Say: I want some yoghurt.' }],
  },

  // Unit 10
  {
    id: 'g2-u10',
    unitNumber: 10,
    grade: 2,
    title: 'At the Zoo',
    titleVi: 'Ở sở thú',
    theme: 'Zoo & Nature',
    themeEmoji: '🐺',
    targetLetter: 'W, w',
    phonicsSound: '/w/',
    storyTopic: 'Zoo Explorer',
    vocabulary: [
      { id: 'w-watch', word: 'watch', meaningVi: 'đồng hồ đeo tay', phonetic: '/wɒtʃ/', letter: 'w', imageEmoji: '⌚', exampleSentence: 'A smart wrist watch.', audioText: 'watch' },
      { id: 'w-water', word: 'water', meaningVi: 'nước uống', phonetic: '/ˈwɔː.tər/', letter: 'w', imageEmoji: '💧', exampleSentence: 'Drink clean fresh water.', audioText: 'water' },
      { id: 'w-window', word: 'window', meaningVi: 'cửa sổ', phonetic: '/ˈwɪn.dəʊ/', letter: 'w', imageEmoji: '🪟', exampleSentence: 'Look out the zoo window.', audioText: 'window' },
      { id: 'w-wolf', word: 'wolf', meaningVi: 'con chó sói', phonetic: '/wʊlf/', letter: 'w', imageEmoji: '🐺', exampleSentence: 'A wild gray wolf.', audioText: 'wolf' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-10',
        pattern: 'Look through the window! There is a wolf.',
        patternVi: 'Nhìn qua cửa sổ kìa! Có một con sói.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Look through the window!', textVi: 'Hãy nhìn qua cửa sổ!', audioText: 'Look through the window!' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'The animals are drinking water.', textVi: 'Các con thú đang uống nước.', audioText: 'The animals are drinking water.' },
        ],
        scrambleWords: ['Drink', 'some', 'water.'],
        correctOrder: ['Drink', 'some', 'water.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Remind your friend to stay hydrated at the zoo!', expectedReply: 'Drink some water.' }],
      },
    ],
    phonics: {
      id: 'ph-w',
      letter: 'W, w',
      sound: '/w/',
      soundTip: 'Round lips tight like blowing a whistle: /w/, /w/, water!',
      soundTipVi: 'Tròn môi chụm lại bật hơi nhẹ: /w/, /w/, water!',
      blendingExamples: [
        { onset: 'w', rime: 'et', word: 'wet', emoji: '🌧️' },
        { onset: 'w', rime: 'in', word: 'win', emoji: '🏆' },
      ],
      segmentingWords: [{ word: 'wolf', sounds: ['/w/', '/ʊ/', '/l/', '/f/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-10',
        type: 'choose',
        questionPrompt: 'Listen and choose: "water"',
        audioPrompt: 'water',
        options: [
          { id: 'opt-g2-10-1', text: 'water', imageEmoji: '💧', isCorrect: true },
          { id: 'opt-g2-10-2', text: 'window', imageEmoji: '🪟', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Stay healthy on a sunny walk! Say: 'Drink some water.'", suggestedStudentReply: 'Drink some water.', hint: 'Say: Drink some water.' }],
  },

  // Unit 11
  {
    id: 'g2-u11',
    unitNumber: 11,
    grade: 2,
    title: 'In the Playground',
    titleVi: 'Trong sân chơi',
    theme: 'Games & Action',
    themeEmoji: '🛝',
    targetLetter: 'R, r',
    phonicsSound: '/r/',
    storyTopic: 'Playground Games',
    vocabulary: [
      { id: 'w-running', word: 'running', meaningVi: 'đang chạy', phonetic: '/ˈrʌn.ɪŋ/', letter: 'r', imageEmoji: '🏃', exampleSentence: 'He is running fast.', audioText: 'running' },
      { id: 'w-riding', word: 'riding', meaningVi: 'đang đi xe đạp', phonetic: '/ˈraɪ.dɪŋ/', letter: 'r', imageEmoji: '🚴', exampleSentence: 'She is riding her bike.', audioText: 'riding' },
      { id: 'w-skating', word: 'roller-skating', meaningVi: 'đang trượt pa-tanh', phonetic: '/ˈrəʊ.ləˌskeɪ.tɪŋ/', letter: 'r', imageEmoji: '🛼', exampleSentence: 'Fun roller-skating in the park.', audioText: 'roller-skating' },
      { id: 'w-rainbow', word: 'rainbow', meaningVi: 'cầu vồng', phonetic: '/ˈreɪn.bəʊ/', letter: 'r', imageEmoji: '🌈', exampleSentence: 'A colorful arc rainbow.', audioText: 'rainbow' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-11',
        pattern: 'He’s / She’s running.',
        patternVi: 'Cậu ấy / Cô ấy đang chạy.',
        dialogue: [
          { speaker: 'Smarty', avatar: '🦉', textEn: 'What is Nam doing?', textVi: 'Nam đang làm gì thế?', audioText: 'What is Nam doing?' },
          { speaker: 'Bimi', avatar: '🐻', textEn: 'He’s running very fast!', textVi: 'Cậu ấy đang chạy rất nhanh!', audioText: 'He’s running very fast!' },
        ],
        scrambleWords: ['He’s', 'running', 'fast.'],
        correctOrder: ['He’s', 'running', 'fast.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Look at the race! What is the boy doing?', expectedReply: 'He’s running.' }],
      },
    ],
    phonics: {
      id: 'ph-r',
      letter: 'R, r',
      sound: '/r/',
      soundTip: 'Curl tongue tip back without touching palate: /r/, /r/, running!',
      soundTipVi: 'Uốn cong đầu lưỡi về phía sau không chạm vòm: /r/, /r/, running!',
      blendingExamples: [
        { onset: 'r', rime: 'ed', word: 'red', emoji: '🔴' },
        { onset: 'r', rime: 'un', word: 'run', emoji: '🏃' },
      ],
      segmentingWords: [{ word: 'run', sounds: ['/r/', '/ʌ/', '/n/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-11',
        type: 'choose',
        questionPrompt: 'Listen and choose: "running"',
        audioPrompt: 'running',
        options: [
          { id: 'opt-g2-11-1', text: 'running', imageEmoji: '🏃', isCorrect: true },
          { id: 'opt-g2-11-2', text: 'riding', imageEmoji: '🚴', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Describe the boy in the race! Say: 'He is running.'", suggestedStudentReply: 'He is running.', hint: 'Say: He is running.' }],
  },

  // Unit 12
  {
    id: 'g2-u12',
    unitNumber: 12,
    grade: 2,
    title: 'At the Cafe',
    titleVi: 'Ở quán cà phê / giải khát',
    theme: 'Drinks & Snacks',
    themeEmoji: '☕',
    targetLetter: 'C, c',
    phonicsSound: '/k/',
    storyTopic: 'Cozy Afternoon Cafe',
    vocabulary: [
      { id: 'w-coffee', word: 'coffee', meaningVi: 'cà phê', phonetic: '/ˈkɒf.i/', letter: 'c', imageEmoji: '☕', exampleSentence: 'Warm cup of coffee.', audioText: 'coffee' },
      { id: 'w-cake-12', word: 'cake', meaningVi: 'bánh kem', phonetic: '/keɪk/', letter: 'c', imageEmoji: '🍰', exampleSentence: 'A piece of sweet cake.', audioText: 'cake' },
      { id: 'w-cat-12', word: 'cat', meaningVi: 'chú mèo', phonetic: '/kæt/', letter: 'c', imageEmoji: '🐱', exampleSentence: 'A sleeping cafe cat.', audioText: 'cat' },
      { id: 'w-cookie', word: 'cookie', meaningVi: 'bánh quy', phonetic: '/ˈkʊk.i/', letter: 'c', imageEmoji: '🍪', exampleSentence: 'A crunchy chocolate cookie.', audioText: 'cookie' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-12',
        pattern: 'Would you like some cake? - Yes, please.',
        patternVi: 'Bạn có muốn dùng bánh kem không? - Có, làm ơn.',
        dialogue: [
          { speaker: 'Waiter', avatar: '👨‍🍳', textEn: 'Would you like some cake?', textVi: 'Bạn có muốn dùng chút bánh kem không?', audioText: 'Would you like some cake?' },
          { speaker: 'Linh', avatar: '👧', textEn: 'Yes, please! Thank you.', textVi: 'Dạ có ạ! Cháu cảm ơn.', audioText: 'Yes, please! Thank you.' },
        ],
        scrambleWords: ['Would', 'you', 'like', 'some', 'cake?'],
        correctOrder: ['Would', 'you', 'like', 'some', 'cake?'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Offer dessert politely to your guest!', expectedReply: 'Would you like some cake?' }],
      },
    ],
    phonics: {
      id: 'ph-c-g2',
      letter: 'C, c',
      sound: '/k/',
      soundTip: 'Crisp release from back of palate: /k/, /k/, coffee!',
      soundTipVi: 'Bật hơi rõ ràng từ cuống họng: /k/, /k/, coffee!',
      blendingExamples: [
        { onset: 'c', rime: 'up', word: 'cup', emoji: '🍵' },
        { onset: 'c', rime: 'at', word: 'cat', emoji: '🐱' },
      ],
      segmentingWords: [{ word: 'cake', sounds: ['/k/', '/eɪ/', '/k/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-12',
        type: 'choose',
        questionPrompt: 'Listen and choose: "coffee"',
        audioPrompt: 'coffee',
        options: [
          { id: 'opt-g2-12-1', text: 'coffee', imageEmoji: '☕', isCorrect: true },
          { id: 'opt-g2-12-2', text: 'cookie', imageEmoji: '🍪', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Offer a sweet snack politely! Say: 'Would you like some cake?'", suggestedStudentReply: 'Would you like some cake?', hint: 'Say: Would you like some cake?' }],
  },

  // Unit 13
  {
    id: 'g2-u13',
    unitNumber: 13,
    grade: 2,
    title: 'In the Maths Class',
    titleVi: 'Trong giờ học Toán',
    theme: 'Numbers & Shapes',
    themeEmoji: '🔢',
    targetLetter: 'N, n / Numbers',
    phonicsSound: '/n/',
    storyTopic: 'Fun with Numbers',
    vocabulary: [
      { id: 'w-eleven', word: 'eleven', meaningVi: 'số mười một', phonetic: '/ɪˈlev.ən/', letter: 'e', imageEmoji: '1️⃣1️⃣', exampleSentence: 'Count eleven green pencils.', audioText: 'eleven' },
      { id: 'w-twelve', word: 'twelve', meaningVi: 'số mười hai', phonetic: '/twelv/', letter: 't', imageEmoji: '1️⃣2️⃣', exampleSentence: 'Twelve yellow rulers.', audioText: 'twelve' },
      { id: 'w-thirteen', word: 'thirteen', meaningVi: 'số mười ba', phonetic: '/θɜːˈtiːn/', letter: 't', imageEmoji: '1️⃣3️⃣', exampleSentence: 'Thirteen counting blocks.', audioText: 'thirteen' },
      { id: 'w-fourteen', word: 'fourteen', meaningVi: 'số mười bốn', phonetic: '/ˌfɔːˈtiːn/', letter: 'f', imageEmoji: '1️⃣4️⃣', exampleSentence: 'Fourteen happy stars.', audioText: 'fourteen' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-13',
        pattern: 'How many can you see? - I can see eleven.',
        patternVi: 'Bạn có thể nhìn thấy bao nhiêu? - Tớ thấy mười một cái.',
        dialogue: [
          { speaker: 'Teacher', avatar: '👩‍🏫', textEn: 'How many books can you see?', textVi: 'Các con nhìn thấy bao nhiêu quyển sách?', audioText: 'How many books can you see?' },
          { speaker: 'Nam', avatar: '👦', textEn: 'I can see eleven books.', textVi: 'Em thấy mười một quyển sách ạ.', audioText: 'I can see eleven books.' },
        ],
        scrambleWords: ['How', 'many', 'can', 'you', 'see?'],
        correctOrder: ['How', 'many', 'can', 'you', 'see?'],
        rolePlayPrompts: [{ character: 'Teacher', prompt: 'Count the items on the blackboard! How many do you see?', expectedReply: 'I can see eleven.' }],
      },
    ],
    phonics: {
      id: 'ph-n-g2',
      letter: 'N, n',
      sound: '/n/',
      soundTip: 'Nasal hum with tongue at roof: /n/, /n/, eleven!',
      soundTipVi: 'Âm mũi với đầu lưỡi chạm vòm miệng: /n/, /n/, eleven!',
      blendingExamples: [
        { onset: 't', rime: 'en', word: 'ten', emoji: '🔟' },
        { onset: 'n', rime: 'ine', word: 'nine', emoji: '9️⃣' },
      ],
      segmentingWords: [{ word: 'ten', sounds: ['/t/', '/e/', '/n/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-13',
        type: 'choose',
        questionPrompt: 'Listen and choose: "eleven"',
        audioPrompt: 'eleven',
        options: [
          { id: 'opt-g2-13-1', text: 'eleven', imageEmoji: '1️⃣1️⃣', isCorrect: true },
          { id: 'opt-g2-13-2', text: 'twelve', imageEmoji: '1️⃣2️⃣', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Answer how many objects you count! Say: 'I can see eleven.'", suggestedStudentReply: 'I can see eleven.', hint: 'Say: I can see eleven.' }],
  },

  // Unit 14
  {
    id: 'g2-u14',
    unitNumber: 14,
    grade: 2,
    title: 'At the Toy Shop',
    titleVi: 'Tại cửa hàng đồ chơi',
    theme: 'Toys & Games',
    themeEmoji: '🤖',
    targetLetter: 'P, p / Toys',
    phonicsSound: '/p/',
    storyTopic: 'Robots & Toys',
    vocabulary: [
      { id: 'w-plane', word: 'plane', meaningVi: 'máy bay đồ chơi', phonetic: '/pleɪn/', letter: 'p', imageEmoji: '✈️', exampleSentence: 'A silver model plane.', audioText: 'plane' },
      { id: 'w-puppet', word: 'puppet', meaningVi: 'con rối tay', phonetic: '/ˈpʌp.ɪt/', letter: 'p', imageEmoji: '🎎', exampleSentence: 'A cheerful hand puppet.', audioText: 'puppet' },
      { id: 'w-robot', word: 'robot', meaningVi: 'người máy', phonetic: '/ˈrəʊ.bɒt/', letter: 'r', imageEmoji: '🤖', exampleSentence: 'A cool talking robot.', audioText: 'robot' },
      { id: 'w-puzzle', word: 'puzzle', meaningVi: 'tranh ghép hình', phonetic: '/ˈpʌz.əl/', letter: 'p', imageEmoji: '🧩', exampleSentence: 'Solve the wooden puzzle.', audioText: 'puzzle' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-14',
        pattern: 'I have a robot and a plane.',
        patternVi: 'Tớ có một chú rô-bốt và một chiếc máy bay.',
        dialogue: [
          { speaker: 'Bill', avatar: '👦', textEn: 'What toys do you have?', textVi: 'Bạn có những món đồ chơi nào?', audioText: 'What toys do you have?' },
          { speaker: 'Nam', avatar: '🧒', textEn: 'I have a shiny robot.', textVi: 'Tớ có một chú rô-bốt sáng bóng.', audioText: 'I have a shiny robot.' },
        ],
        scrambleWords: ['I', 'have', 'a', 'robot.'],
        correctOrder: ['I', 'have', 'a', 'robot.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Tell your friends about your coolest toy!', expectedReply: 'I have a robot.' }],
      },
    ],
    phonics: {
      id: 'ph-p-g2',
      letter: 'P, p',
      sound: '/p/',
      soundTip: 'Pop lips open with a burst of air: /p/, /p/, plane!',
      soundTipVi: 'Bật nhẹ hai môi giải phóng luồng hơi: /p/, /p/, plane!',
      blendingExamples: [
        { onset: 'p', rime: 'lane', word: 'plane', emoji: '✈️' },
        { onset: 'p', rime: 'en', word: 'pen', emoji: '🖊️' },
      ],
      segmentingWords: [{ word: 'plane', sounds: ['/p/', '/l/', '/eɪ/', '/n/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-14',
        type: 'choose',
        questionPrompt: 'Listen and choose: "robot"',
        audioPrompt: 'robot',
        options: [
          { id: 'opt-g2-14-1', text: 'robot', imageEmoji: '🤖', isCorrect: true },
          { id: 'opt-g2-14-2', text: 'plane', imageEmoji: '✈️', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Share what toy you own! Say: 'I have a robot.'", suggestedStudentReply: 'I have a robot.', hint: 'Say: I have a robot.' }],
  },

  // Unit 15
  {
    id: 'g2-u15',
    unitNumber: 15,
    grade: 2,
    title: 'At the Clothes Shop',
    titleVi: 'Ở cửa hàng quần áo',
    theme: 'Clothes & Style',
    themeEmoji: '👕',
    targetLetter: 'Sh, sh / Clothes',
    phonicsSound: '/ʃ/',
    storyTopic: 'Dressing Up Nice',
    vocabulary: [
      { id: 'w-shirt', word: 'shirt', meaningVi: 'áo sơ mi', phonetic: '/ʃɜːt/', letter: 's', imageEmoji: '👔', exampleSentence: 'A clean white shirt.', audioText: 'shirt' },
      { id: 'w-dress', word: 'dress', meaningVi: 'chiếc váy', phonetic: '/dres/', letter: 'd', imageEmoji: '👗', exampleSentence: 'A pretty pink dress.', audioText: 'dress' },
      { id: 'w-shoes', word: 'shoes', meaningVi: 'đôi giày', phonetic: '/ʃuːz/', letter: 's', imageEmoji: '👟', exampleSentence: 'Put on your running shoes.', audioText: 'shoes' },
      { id: 'w-shorts', word: 'shorts', meaningVi: 'quần soóc', phonetic: '/ʃɔːts/', letter: 's', imageEmoji: '🩳', exampleSentence: 'Comfortable blue shorts.', audioText: 'shorts' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-15',
        pattern: 'He’s / She’s wearing a blue shirt.',
        patternVi: 'Cậu ấy / Cô ấy đang mặc một chiếc áo sơ mi xanh.',
        dialogue: [
          { speaker: 'Linh', avatar: '👧', textEn: 'What is she wearing?', textVi: 'Bạn ấy đang mặc gì thế?', audioText: 'What is she wearing?' },
          { speaker: 'Minh', avatar: '🧒', textEn: 'She’s wearing a pretty dress.', textVi: 'Bạn ấy đang mặc một chiếc váy rất xinh.', audioText: 'She’s wearing a pretty dress.' },
        ],
        scrambleWords: ['She’s', 'wearing', 'a', 'dress.'],
        correctOrder: ['She’s', 'wearing', 'a', 'dress.'],
        rolePlayPrompts: [{ character: 'Bimi', prompt: 'Describe what the girl is wearing to the party!', expectedReply: 'She’s wearing a dress.' }],
      },
    ],
    phonics: {
      id: 'ph-sh',
      letter: 'Sh, sh',
      sound: '/ʃ/',
      soundTip: 'Rounded lips whispering quiet sound: /ʃ/, /ʃ/, shirt!',
      soundTipVi: 'Tròn môi thổi luồng hơi như suỵt khẽ: /ʃ/, /ʃ/, shirt!',
      blendingExamples: [
        { onset: 'sh', rime: 'irt', word: 'shirt', emoji: '👔' },
        { onset: 'sh', rime: 'oe', word: 'shoe', emoji: '👟' },
      ],
      segmentingWords: [{ word: 'shirt', sounds: ['/ʃ/', '/ɜː/', '/t/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-15',
        type: 'choose',
        questionPrompt: 'Listen and choose: "shirt"',
        audioPrompt: 'shirt',
        options: [
          { id: 'opt-g2-15-1', text: 'shirt', imageEmoji: '👔', isCorrect: true },
          { id: 'opt-g2-15-2', text: 'shoes', imageEmoji: '👟', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "What is she wearing? Say: 'She is wearing a dress.'", suggestedStudentReply: 'She is wearing a dress.', hint: 'Say: She is wearing a dress.' }],
  },

  // Unit 16
  {
    id: 'g2-u16',
    unitNumber: 16,
    grade: 2,
    title: 'At the Campsite',
    titleVi: 'Tại khu cắm trại',
    theme: 'Camping & Outdoor',
    themeEmoji: '⛺',
    targetLetter: 'St, st / Camping',
    phonicsSound: '/st/',
    storyTopic: 'Night Camping under Stars',
    vocabulary: [
      { id: 'w-tent', word: 'tent', meaningVi: 'cái lều', phonetic: '/tent/', letter: 't', imageEmoji: '⛺', exampleSentence: 'Sleep safely inside the tent.', audioText: 'tent' },
      { id: 'w-campfire', word: 'campfire', meaningVi: 'lửa trại', phonetic: '/ˈkæmp.faɪər/', letter: 'c', imageEmoji: '🔥', exampleSentence: 'Sing songs by the warm campfire.', audioText: 'campfire' },
      { id: 'w-blanket', word: 'blanket', meaningVi: 'chiếc chăn ấm', phonetic: '/ˈblæŋ.kɪt/', letter: 'b', imageEmoji: '🛏️', exampleSentence: 'A cozy warm wool blanket.', audioText: 'blanket' },
      { id: 'w-star', word: 'star', meaningVi: 'ngôi sao', phonetic: '/stɑːr/', letter: 's', imageEmoji: '⭐', exampleSentence: 'Look at the glowing night star.', audioText: 'star' },
    ],
    sentencePatterns: [
      {
        id: 'sp-g2-16',
        pattern: 'Look at the tent! / I can see a bright star.',
        patternVi: 'Hãy nhìn chiếc lều kìa! / Tớ thấy một ngôi sao sáng.',
        dialogue: [
          { speaker: 'Bimi', avatar: '🐻', textEn: 'Look at the beautiful night sky!', textVi: 'Nhìn bầu trời đêm tuyệt đẹp kìa!', audioText: 'Look at the beautiful night sky!' },
          { speaker: 'Smarty', avatar: '🦉', textEn: 'I can see a bright star over our tent.', textVi: 'Tớ thấy một ngôi sao sáng trên chiếc lều của chúng mình.', audioText: 'I can see a bright star over our tent.' },
        ],
        scrambleWords: ['Look', 'at', 'the', 'star.'],
        correctOrder: ['Look', 'at', 'the', 'star.'],
        rolePlayPrompts: [{ character: 'Smarty', prompt: 'Look up at the camping night sky! What can you see?', expectedReply: 'I can see a bright star.' }],
      },
    ],
    phonics: {
      id: 'ph-st',
      letter: 'St, st',
      sound: '/st/',
      soundTip: 'Blend hiss /s/ directly into crisp /t/: /st/, /st/, star!',
      soundTipVi: 'Nối mượt âm s vào âm t dứt khoát: /st/, /st/, star!',
      blendingExamples: [
        { onset: 'st', rime: 'ar', word: 'star', emoji: '⭐' },
        { onset: 'st', rime: 'op', word: 'stop', emoji: '🛑' },
      ],
      segmentingWords: [{ word: 'star', sounds: ['/s/', '/t/', '/ɑː/'] }],
    },
    listeningActivities: [
      {
        id: 'la-g2-16',
        type: 'choose',
        questionPrompt: 'Listen and choose: "tent"',
        audioPrompt: 'tent',
        options: [
          { id: 'opt-g2-16-1', text: 'tent', imageEmoji: '⛺', isCorrect: true },
          { id: 'opt-g2-16-2', text: 'star', imageEmoji: '⭐', isCorrect: false },
        ],
      },
    ],
    speakingPrompts: [{ aiPrompt: "Describe the night sky at the campsite! Say: 'I can see a bright star.'", suggestedStudentReply: 'I can see a bright star.', hint: 'Say: I can see a bright star.' }],
  },
];

// ==========================================
// GLOBAL SUCCESS GRADE 1 - FUN TIME MILESTONES
// ==========================================
export const GRADE_1_FUN_TIMES: FunTimeMilestone[] = [
  {
    id: 'g1-ft1',
    milestoneNumber: 1,
    grade: 1,
    title: 'Fun Time 1: Playground & Home Adventure',
    titleVi: 'Fun Time 1: Sân trường và Gia đình vui nhộn',
    coveredUnits: 'Units 1 - 4 (Playground, Dining Room, Market, Bedroom)',
    themeEmoji: '🎪',
    chant: {
      title: 'B, C, E, D Fun Rhythm Chant',
      tempo: 'lively',
      lyrics: [
        'B, B, B! Bounce the red ball! ⚽',
        'C, C, C! Eat the yummy cake! 🍰',
        'E, E, E! Have a healthy egg! 🥚',
        'D, D, D! Open up the door! 🚪',
        'Clap your hands and shout hooray! 🎉',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Letter B', color: '#f59e0b', challenge: "Say: 'I have a ball!'", rewardStars: 2, emoji: '⚽' },
        { label: 'Letter C', color: '#10b981', challenge: "Say: 'A yummy cake!'", rewardStars: 2, emoji: '🍰' },
        { label: 'Letter E', color: '#6366f1', challenge: "Say: 'Have an egg!'", rewardStars: 2, emoji: '🥚' },
        { label: 'Letter D', color: '#ec4899', challenge: "Say: 'Touch the door!'", rewardStars: 2, emoji: '🚪' },
        { label: 'Lucky Star', color: '#eab308', challenge: 'Sing: B - C - E - D!', rewardStars: 3, emoji: '⭐' },
        { label: 'Action!', color: '#06b6d4', challenge: 'Mime riding a bike: Bike! Bike!', rewardStars: 2, emoji: '🚲' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Start', task: "Say: 'Hello, Smarty!'", emoji: '🦉', type: 'normal' },
      { step: 2, title: 'Ball Pitch', task: "Say 'ball' 3 times clearly", emoji: '⚽', type: 'speak' },
      { step: 3, title: 'Star Bonus', task: 'Collected a golden star!', emoji: '⭐', type: 'bonus' },
      { step: 4, title: 'Cake Shop', task: "Say: 'I like cake!'", emoji: '🍰', type: 'speak' },
      { step: 5, title: 'Sing Time', task: 'Sing the Letter C song!', emoji: '🎵', type: 'sing' },
      { step: 6, title: 'Bike Ride', task: 'Mime riding a bike: /b/, /b/, bike!', emoji: '🚲', type: 'normal' },
      { step: 7, title: 'Egg Basket', task: "Say: 'An egg on the table'", emoji: '🥚', type: 'speak' },
      { step: 8, title: 'Door Bell', task: 'Knock on table and say: Door!', emoji: '🚪', type: 'normal' },
      { step: 9, title: 'Super Bonus', task: 'Double coins awarded!', emoji: '🪙', type: 'bonus' },
      { step: 10, title: 'Finish Line', task: 'Celebrate: I am an English Champion!', emoji: '🏆', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which word does NOT start with sound /b/?',
      options: [
        { text: 'ball', emoji: '⚽', isOdd: false, reason: 'Starts with /b/' },
        { text: 'book', emoji: '📚', isOdd: false, reason: 'Starts with /b/' },
        { text: 'cake', emoji: '🍰', isOdd: true, reason: 'Starts with sound /k/, not /b/!' },
        { text: 'bike', emoji: '🚲', isOdd: false, reason: 'Starts with /b/' },
      ],
    },
  },
  {
    id: 'g1-ft2',
    milestoneNumber: 2,
    grade: 1,
    title: 'Fun Time 2: Classroom & Garden Safari',
    titleVi: 'Fun Time 2: Lớp học và Khu vườn kỳ diệu',
    coveredUnits: 'Units 5 - 8 (Fish Shop, Classroom, Garden, Bus)',
    themeEmoji: '🌳',
    chant: {
      title: 'I, O, U, G Joyful Chant',
      tempo: 'playful',
      lyrics: [
        'I, I, I! In the big blue shop! 🐟',
        'O, O, O! Orange on the tree! 🍊',
        'U, U, U! Under the umbrella! ☂️',
        'G, G, G! Girl in the garden! 👧',
        'Let us jump and get on the bus! 🚌',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Letter I', color: '#3b82f6', challenge: "Say: 'Fish and chips!'", rewardStars: 2, emoji: '🐟' },
        { label: 'Letter O', color: '#f97316', challenge: "Say: 'A juicy orange!'", rewardStars: 2, emoji: '🍊' },
        { label: 'Letter U', color: '#a855f7', challenge: "Say: 'Open umbrella!'", rewardStars: 2, emoji: '☂️' },
        { label: 'Letter G', color: '#10b981', challenge: "Say: 'Green garden!'", rewardStars: 2, emoji: '🌳' },
        { label: 'Bus Ride', color: '#eab308', challenge: "Say: 'Get on the bus!'", rewardStars: 3, emoji: '🚌' },
        { label: 'Dance', color: '#ec4899', challenge: 'Clap 3 times and say: Garden!', rewardStars: 2, emoji: '👏' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Bus Stop', task: "Say: 'The wheels on the bus!'", emoji: '🚌', type: 'sing' },
      { step: 2, title: 'Fish Market', task: "Say: 'Fish!'", emoji: '🐟', type: 'speak' },
      { step: 3, title: 'Classroom', task: 'Open your notebook and pencil', emoji: '✏️', type: 'normal' },
      { step: 4, title: 'Star Tile', task: 'Bonus star collected!', emoji: '⭐', type: 'bonus' },
      { step: 5, title: 'Orange Tree', task: "Say: 'One orange, two oranges'", emoji: '🍊', type: 'speak' },
      { step: 6, title: 'Rain Shower', task: "Hold up umbrella and say: /ʌ/!", emoji: '☂️', type: 'normal' },
      { step: 7, title: 'Green Garden', task: "Say: 'The girl is in the garden'", emoji: '👧', type: 'speak' },
      { step: 8, title: 'Star Trophy', task: 'You completed Fun Time 2!', emoji: '🏆', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which word does NOT belong to the Garden / Fruit theme?',
      options: [
        { text: 'orange', emoji: '🍊', isOdd: false, reason: 'Is a garden fruit' },
        { text: 'tree', emoji: '🌳', isOdd: false, reason: 'Grows in a garden' },
        { text: 'bus', emoji: '🚌', isOdd: true, reason: 'Is a vehicle, not in the garden!' },
        { text: 'flower', emoji: '🌸', isOdd: false, reason: 'Grows in a garden' },
      ],
    },
  },
  {
    id: 'g1-ft3',
    milestoneNumber: 3,
    grade: 1,
    title: 'Fun Time 3: Zoo & Playground Expedition',
    titleVi: 'Fun Time 3: Khám phá Sở thú và Sân chơi',
    coveredUnits: 'Units 9 - 12 (Shop, Zoo, Playground, Cafe)',
    themeEmoji: '🦁',
    chant: {
      title: 'L, M, N, P Expedition Chant',
      tempo: 'lively',
      lyrics: [
        'L, L, L! Look at the lake! 🌊',
        'M, M, M! Monkey in the zoo! 🐵',
        'N, N, N! Nine birds in the nest! 🪺',
        'P, P, P! Play with the puppy! 🐶',
        'Hip hip hooray, English is fun! 🎈',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Monkey', color: '#f59e0b', challenge: "Mime a monkey: 'A funny monkey!'", rewardStars: 2, emoji: '🐵' },
        { label: 'Lake', color: '#06b6d4', challenge: "Say: 'Look at the lake!'", rewardStars: 2, emoji: '🌊' },
        { label: 'Nest', color: '#84cc16', challenge: "Say: 'Bird in the nest!'", rewardStars: 2, emoji: '🪺' },
        { label: 'Puppy', color: '#ec4899', challenge: "Say: 'A cute little puppy!'", rewardStars: 2, emoji: '🐶' },
        { label: 'Golden Coin', color: '#eab308', challenge: "Say: 'I love animals!'", rewardStars: 3, emoji: '🪙' },
        { label: 'High Five', color: '#8b5cf6', challenge: "Say: 'Give me five, Bimi!'", rewardStars: 2, emoji: '✋' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Zoo Gate', task: "Say: 'Welcome to the zoo!'", emoji: '🎫', type: 'speak' },
      { step: 2, title: 'Monkey Cage', task: 'Make monkey sounds: /m/, /m/!', emoji: '🐵', type: 'normal' },
      { step: 3, title: 'Lake View', task: "Say: 'The water is clear'", emoji: '🌊', type: 'speak' },
      { step: 4, title: 'Lucky Coin', task: 'Bonus 20 coins!', emoji: '🪙', type: 'bonus' },
      { step: 5, title: 'Playground', task: 'Mime sliding down the slide', emoji: '🛝', type: 'normal' },
      { step: 6, title: 'Cafe Pause', task: "Say: 'A cup of juice, please!'", emoji: '🧃', type: 'speak' },
      { step: 7, title: 'Treasure Star', task: 'Awesome job on Fun Time 3!', emoji: '⭐', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which item is NOT an animal in the Zoo?',
      options: [
        { text: 'monkey', emoji: '🐵', isOdd: false, reason: 'Is a zoo animal' },
        { text: 'tiger', emoji: '🐯', isOdd: false, reason: 'Is a zoo animal' },
        { text: 'pen', emoji: '🖊️', isOdd: true, reason: 'Is school stationery, not an animal!' },
        { text: 'elephant', emoji: '🐘', isOdd: false, reason: 'Is a zoo animal' },
      ],
    },
  },
  {
    id: 'g1-ft4',
    milestoneNumber: 4,
    grade: 1,
    title: 'Fun Time 4: Campsite Carnival Finale',
    titleVi: 'Fun Time 4: Lễ hội Cắm trại & Tốt nghiệp Lớp 1',
    coveredUnits: 'Units 13 - 16 (Canteen, Toy Shop, Football Match, Campsite)',
    themeEmoji: '⛺',
    chant: {
      title: 'S, T, W, R Celebration Song',
      tempo: 'lively',
      lyrics: [
        'S is for Sun, shining so bright! ☀️',
        'T is for Tent, cozy at night! ⛺',
        'W is for Water, splash and play! 💧',
        'R is for Rainbow, end of the day! 🌈',
        'Grade 1 is done, we are superstars! ⭐',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Sun', color: '#eab308', challenge: "Say: 'Warm sunny day!'", rewardStars: 3, emoji: '☀️' },
        { label: 'Tent', color: '#10b981', challenge: "Say: 'Sleep in the tent!'", rewardStars: 2, emoji: '⛺' },
        { label: 'Football', color: '#3b82f6', challenge: "Say: 'Goal! Football match!'", rewardStars: 2, emoji: '⚽' },
        { label: 'Rainbow', color: '#ec4899', challenge: "Say: 'Beautiful rainbow!'", rewardStars: 3, emoji: '🌈' },
        { label: 'Toy Robot', color: '#8b5cf6', challenge: "Mime a robot: Beep boop!", rewardStars: 2, emoji: '🤖' },
        { label: 'Grand Award', color: '#f59e0b', challenge: "Sing: 'We did it!'", rewardStars: 4, emoji: '🏆' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Camp Bus', task: "Say: 'Off to the campsite!'", emoji: '🚌', type: 'speak' },
      { step: 2, title: 'Toy Shop', task: "Say: 'I love my new teddy bear'", emoji: '🧸', type: 'speak' },
      { step: 3, title: 'Football Field', task: "Kick imaginary ball: Goal!", emoji: '⚽', type: 'normal' },
      { step: 4, title: 'Star Bonus', task: 'Bonus 3 stars!', emoji: '⭐', type: 'bonus' },
      { step: 5, title: 'Pitch Tent', task: "Say: 'Look at our big green tent!'", emoji: '⛺', type: 'speak' },
      { step: 6, title: 'Campfire', task: 'Sing the Rainbow Song!', emoji: '🔥', type: 'sing' },
      { step: 7, title: 'Grand Finale Trophy', task: 'You mastered Grade 1 Global Success!', emoji: '🎓', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which word does NOT start with sound /t/?',
      options: [
        { text: 'tent', emoji: '⛺', isOdd: false, reason: 'Starts with /t/' },
        { text: 'tiger', emoji: '🐯', isOdd: false, reason: 'Starts with /t/' },
        { text: 'sun', emoji: '☀️', isOdd: true, reason: 'Starts with sound /s/, not /t/!' },
        { text: 'toy', emoji: '🧸', isOdd: false, reason: 'Starts with /t/' },
      ],
    },
  },
];

// ==========================================
// GLOBAL SUCCESS GRADE 2 - FUN TIME MILESTONES
// ==========================================
export const GRADE_2_FUN_TIMES: FunTimeMilestone[] = [
  {
    id: 'g2-ft1',
    milestoneNumber: 1,
    grade: 2,
    title: 'Fun Time 1: Party & Seaside Fiesta',
    titleVi: 'Fun Time 1: Bữa tiệc sinh nhật & Bờ biển vui nhộn',
    coveredUnits: 'Units 1 - 4 (Birthday Party, Backyard, Seaside, Countryside)',
    themeEmoji: '🎂',
    chant: {
      title: 'M, P, S, K Birthday & Ocean Chant',
      tempo: 'lively',
      lyrics: [
        'M is for Mango, sweet and gold! 🥭',
        'P is for Pizza, hot and bold! 🍕',
        'S is for Sea, waves go roll! 🌊',
        'K is for Kite, high in the sky! 🪁',
        'Happy birthday, sing with joy! 🎈',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Mango', color: '#f59e0b', challenge: "Say: 'She is eating a mango.'", rewardStars: 2, emoji: '🥭' },
        { label: 'Pizza', color: '#ef4444', challenge: "Say: 'I want a slice of pizza.'", rewardStars: 2, emoji: '🍕' },
        { label: 'Sea & Sail', color: '#06b6d4', challenge: "Say: 'Look at the sailing boat!'", rewardStars: 2, emoji: '⛵' },
        { label: 'Fly a Kite', color: '#8b5cf6', challenge: "Say: 'He is flying a kite.'", rewardStars: 3, emoji: '🪁' },
        { label: 'Party Hat', color: '#ec4899', challenge: "Say: 'Happy birthday to you!'", rewardStars: 2, emoji: '🎉' },
        { label: 'Super Star', color: '#eab308', challenge: 'High five Smarty: Super speaker!', rewardStars: 3, emoji: '⭐' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Party Door', task: "Say: 'Welcome to my party!'", emoji: '🎉', type: 'speak' },
      { step: 2, title: 'Sweet Mango', task: "Say: 'A juicy mango'", emoji: '🥭', type: 'speak' },
      { step: 3, title: 'Balloon Pop', task: 'Pop imaginary balloon: Pop!', emoji: '🎈', type: 'normal' },
      { step: 4, title: 'Star Bonus', task: 'Golden Star gained!', emoji: '⭐', type: 'bonus' },
      { step: 5, title: 'Seaside Walk', task: "Say: 'Look at the blue sea!'", emoji: '🌊', type: 'speak' },
      { step: 6, title: 'Sing Birthday', task: 'Sing: Happy Birthday to you!', emoji: '🎂', type: 'sing' },
      { step: 7, title: 'Kite High', task: 'Mime holding a kite string', emoji: '🪁', type: 'normal' },
      { step: 8, title: 'Seaside Trophy', task: 'You conquered Grade 2 Fun Time 1!', emoji: '🏆', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which item is NOT a food at the Birthday Party?',
      options: [
        { text: 'cake', emoji: '🎂', isOdd: false, reason: 'Is party food' },
        { text: 'mango', emoji: '🥭', isOdd: false, reason: 'Is sweet fruit' },
        { text: 'kite', emoji: '🪁', isOdd: true, reason: 'Is a toy to fly, not food!' },
        { text: 'pizza', emoji: '🍕', isOdd: false, reason: 'Is party food' },
      ],
    },
  },
  {
    id: 'g2-ft2',
    milestoneNumber: 2,
    grade: 2,
    title: 'Fun Time 2: Farm Animals & Kitchen Cooking',
    titleVi: 'Fun Time 2: Nông trại vui vẻ & Gian bếp ấm cúng',
    coveredUnits: 'Units 5 - 8 (Classroom, Farm, Kitchen, Village)',
    themeEmoji: '🚜',
    chant: {
      title: 'T, F, H, V Country Farm Chant',
      tempo: 'playful',
      lyrics: [
        'T is for Tiger and Tree so tall! 🐯',
        'F is for Farm, hear animals call! 🚜',
        'H is for Horse, neigh and run! 🐴',
        'V is for Village in the morning sun! 🏡',
        'Cooking in the kitchen, cooking is fun! 🍳',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Horse', color: '#f97316', challenge: "Mime a galloping horse: Neigh!", rewardStars: 2, emoji: '🐴' },
        { label: 'Farm', color: '#10b981', challenge: "Say: 'Welcome to the farm!'", rewardStars: 2, emoji: '🚜' },
        { label: 'Kitchen', color: '#ec4899', challenge: "Say: 'Mother is in the kitchen.'", rewardStars: 2, emoji: '🍳' },
        { label: 'Village', color: '#3b82f6', challenge: "Say: 'A peaceful green village.'", rewardStars: 2, emoji: '🏡' },
        { label: 'Golden Egg', color: '#eab308', challenge: "Say: 'The chicken laid an egg!'", rewardStars: 3, emoji: '🥚' },
        { label: 'Animal Quiz', color: '#a855f7', challenge: "Say: 'Duck, cow, sheep, horse!'", rewardStars: 3, emoji: '🦆' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Farm Gate', task: "Say: 'Good morning, Farmer!'", emoji: '🚜', type: 'speak' },
      { step: 2, title: 'Horse Stable', task: "Say 'horse' 3 times clearly", emoji: '🐴', type: 'speak' },
      { step: 3, title: 'Lucky Coin', task: 'Bonus 25 coins!', emoji: '🪙', type: 'bonus' },
      { step: 4, title: 'Kitchen Stove', task: "Say: 'Smell the delicious soup'", emoji: '🍲', type: 'speak' },
      { step: 5, title: 'Old MacDonald', task: 'Sing: Old MacDonald had a farm!', emoji: '🎵', type: 'sing' },
      { step: 6, title: 'Village Road', task: 'Mime riding a bicycle through the village', emoji: '🚲', type: 'normal' },
      { step: 7, title: 'Harvest Star', task: 'You mastered Fun Time 2!', emoji: '⭐', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which word is NOT a farm animal?',
      options: [
        { text: 'horse', emoji: '🐴', isOdd: false, reason: 'Is a farm animal' },
        { text: 'cow', emoji: '🐮', isOdd: false, reason: 'Is a farm animal' },
        { text: 'desk', emoji: '🪑', isOdd: true, reason: 'Is classroom furniture, not an animal!' },
        { text: 'duck', emoji: '🦆', isOdd: false, reason: 'Is a farm animal' },
      ],
    },
  },
  {
    id: 'g2-ft3',
    milestoneNumber: 3,
    grade: 2,
    title: 'Fun Time 3: Sports Camp & Supermarket Quest',
    titleVi: 'Fun Time 3: Trại thể thao & Đại siêu thị',
    coveredUnits: 'Units 9 - 12 (Grocery Store, Sports Camp, Craft Room, Lake)',
    themeEmoji: '🏅',
    chant: {
      title: 'Active Sports & Shopping Song',
      tempo: 'lively',
      lyrics: [
        'Run, run, run! In the sports camp today! 🏃',
        'Kick the ball and score right away! ⚽',
        'Apples and milk at the grocery store! 🥛',
        'Boat on the lake, row near the shore! 🚣',
        'Grade 2 champions, hip hip hooray! 🏅',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Runner', color: '#ef4444', challenge: "Mime running: 'I can run fast!'", rewardStars: 2, emoji: '🏃' },
        { label: 'Shopper', color: '#10b981', challenge: "Say: 'How much are the apples?'", rewardStars: 2, emoji: '🍎' },
        { label: 'Origami Craft', color: '#8b5cf6', challenge: "Say: 'I can fold a paper boat.'", rewardStars: 2, emoji: '⛵' },
        { label: 'Lake Row', color: '#06b6d4', challenge: "Say: 'Row, row, row your boat!'", rewardStars: 3, emoji: '🚣' },
        { label: 'Champion Medal', color: '#eab308', challenge: "Say: 'Gold medal for English!'", rewardStars: 3, emoji: '🥇' },
        { label: 'High Jump', color: '#ec4899', challenge: 'Jump once and shout: Sports!', rewardStars: 2, emoji: '🦘' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Gym Track', task: "Say: 'Ready, set, go!'", emoji: '🏃', type: 'speak' },
      { step: 2, title: 'Ball Pass', task: "Say: 'Catch the basketball!'", emoji: '🏀', type: 'speak' },
      { step: 3, title: 'Grocery Aisle', task: "Say: 'Fresh milk and bread'", emoji: '🍞', type: 'speak' },
      { step: 4, title: 'Star Bonus', task: 'Bonus 2 stars!', emoji: '⭐', type: 'bonus' },
      { step: 5, title: 'Craft Table', task: 'Draw an origami star in the air', emoji: '🎨', type: 'normal' },
      { step: 6, title: 'Rowing Boat', task: 'Sing: Row, row, row your boat!', emoji: '🚣', type: 'sing' },
      { step: 7, title: 'Sports Trophy', task: 'You won the Sports Camp Quest!', emoji: '🏆', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which item is NOT a sport or exercise activity?',
      options: [
        { text: 'running', emoji: '🏃', isOdd: false, reason: 'Is a sport activity' },
        { text: 'swimming', emoji: '🏊', isOdd: false, reason: 'Is a sport activity' },
        { text: 'sleeping', emoji: '😴', isOdd: true, reason: 'Is resting, not a sport!' },
        { text: 'football', emoji: '⚽', isOdd: false, reason: 'Is a sport activity' },
      ],
    },
  },
  {
    id: 'g2-ft4',
    milestoneNumber: 4,
    grade: 2,
    title: 'Fun Time 4: Safari Camp & Library Grand Finale',
    titleVi: 'Fun Time 4: Thư viện & Chuyến thám hiểm Safari Lớp 2',
    coveredUnits: 'Units 13 - 16 (Library, Park, Clothes Shop, Animal Camp)',
    themeEmoji: '🦁',
    chant: {
      title: 'Grade 2 Grand Champion Celebration Song',
      tempo: 'lively',
      lyrics: [
        'Open the book in the quiet library! 📖',
        'Fly a red kite in the sunny park! 🪁',
        'Try on a jacket in the clothes shop! 🧥',
        'Sleep in the tent under bright night stars! ⭐',
        'We did it! We are Grade 2 English Champions! 🎓',
      ],
    },
    wheelChallenge: {
      segments: [
        { label: 'Library Book', color: '#3b82f6', challenge: "Say: 'Read a wonderful story!'", rewardStars: 3, emoji: '📖' },
        { label: 'Safari Tent', color: '#10b981', challenge: "Say: 'Look at the glowing star!'", rewardStars: 3, emoji: '⭐' },
        { label: 'New Clothes', color: '#ec4899', challenge: "Say: 'I like this warm jacket.'", rewardStars: 2, emoji: '🧥' },
        { label: 'Animal Safari', color: '#f59e0b', challenge: "Say: 'Wild animals in the camp!'", rewardStars: 3, emoji: '🦁' },
        { label: 'Graduation Cap', color: '#eab308', challenge: "Sing: 'We are English Stars!'", rewardStars: 4, emoji: '🎓' },
        { label: 'Victory Dance', color: '#8b5cf6', challenge: 'Wiggle dance: English is awesome!', rewardStars: 3, emoji: '🕺' },
      ],
    },
    boardGameTiles: [
      { step: 1, title: 'Library Gate', task: "Say: 'Welcome to the library!'", emoji: '📖', type: 'speak' },
      { step: 2, title: 'Green Park', task: "Say: 'The trees are green and tall'", emoji: '🌳', type: 'speak' },
      { step: 3, title: 'Clothes Shop', task: "Say: 'Put on your warm jacket'", emoji: '🧥', type: 'speak' },
      { step: 4, title: 'Super Star', task: 'Bonus 5 stars awarded!', emoji: '⭐', type: 'bonus' },
      { step: 5, title: 'Campfire Circle', task: 'Sing our camping song with Smarty!', emoji: '🔥', type: 'sing' },
      { step: 6, title: 'Starry Sky', task: "Say: 'I see a bright star over the tent!'", emoji: '⛺', type: 'speak' },
      { step: 7, title: 'Grand Master Trophy', task: 'Congratulations! You graduated Grade 2 English!', emoji: '🎓', type: 'star' },
    ],
    oddOneOutPuzzle: {
      question: 'Which item is NOT an article of clothing?',
      options: [
        { text: 'jacket', emoji: '🧥', isOdd: false, reason: 'Is clothing' },
        { text: 'hat', emoji: '🧢', isOdd: false, reason: 'Is clothing' },
        { text: 'campfire', emoji: '🔥', isOdd: true, reason: 'Is outdoor fire, not clothes!' },
        { text: 'shoes', emoji: '👟', isOdd: false, reason: 'Is clothing' },
      ],
    },
  },
];
