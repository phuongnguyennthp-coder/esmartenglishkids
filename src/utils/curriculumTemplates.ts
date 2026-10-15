import { GradeLevel } from '../types/curriculum';

/**
 * Returns a ready-to-use CSV template for Global Success curriculum import
 */
export function generateCurriculumCSVTemplate(grade: GradeLevel): string {
  const header = 'Unit,Title,TitleVi,Theme,TargetLetter,PhonicsSound,Word,MeaningVi,Phonetic,ExampleSentence,Pattern,PatternVi,Chant';
  const rowsGrade1 = [
    '1,In the School Playground,Trong sân trường,School & Friends,"B, b",/b/,ball,quả bóng,/bɔːl/,I have a red ball.,"Hi, I\'m Bill. / Bye, Ba.","Xin chào, tớ là Bill. / Tạm biệt Ba.","b, b, ball! Look at the ball!"',
    '1,,,,,,book,quyển sách,/bʊk/,Open your book.,,,',
    '1,,,,,,bike,xe đạp,/baɪk/,Ba has a bike.,,,',
    '1,,,,,,boy,cậu bé,/bɔɪ/,The boy is playing.,,,',
    '2,In the Dining Room,Trong phòng ăn,Family & Food,"C, c",/k/,car,xe ô tô,/kɑːr/,I see a car.,"I have a cat.","Tớ có một con mèo.","c, c, car! Drive the car!"',
    '2,,,,,,cake,bánh ngọt,/keɪk/,This is a sweet cake.,,,',
    '2,,,,,,cat,con mèo,/kæt/,The cat is sleeping.,,,',
    '2,,,,,,cup,cái chén (tách),/kʌp/,A cup of water.,,,',
  ];

  const rowsGrade2 = [
    '1,At My Birthday Party,Tại bữa tiệc sinh nhật,Celebrations,"P, p",/p/,popcorn,bắp rang bơ,/ˈpɒpkɔːn/,I like popcorn.,"Point to the popcorn.","Hãy chỉ vào bắp rang bơ.","p, p, popcorn! Pop, pop, pop!"',
    '1,,,,,,pizza,bánh pizza,/ˈpiːtsə/,Eat the pizza.,,,',
    '1,,,,,,pasta,mì Ý,/ˈpæstə/,I love pasta.,,,',
    '2,In the Backyard,Trong sân sau,Home & Garden,"K, k",/k/,kite,con diều,/kaɪt/,Fly the kite.,"Look at the kite.","Nhìn con diều kìa.","k, k, kite! Fly so high!"',
    '2,,,,,,kitten,mèo con,/ˈkɪtn/,A cute kitten.,,,',
  ];

  const rows = grade === 1 ? rowsGrade1 : rowsGrade2;
  return `${header}\n${rows.join('\n')}`;
}

/**
 * Returns a ready-to-use JSON template for Global Success curriculum import
 */
export function generateCurriculumJSONTemplate(grade: GradeLevel): string {
  const sample = [
    {
      unitNumber: 1,
      grade,
      title: grade === 1 ? 'In the School Playground' : 'At My Birthday Party',
      titleVi: grade === 1 ? 'Trong sân trường' : 'Tại bữa tiệc sinh nhật',
      theme: grade === 1 ? 'School & Friends' : 'Celebrations',
      targetLetter: grade === 1 ? 'B, b' : 'P, p',
      phonicsSound: grade === 1 ? '/b/' : '/p/',
      vocabulary: [
        {
          word: grade === 1 ? 'ball' : 'popcorn',
          meaningVi: grade === 1 ? 'quả bóng' : 'bắp rang bơ',
          phonetic: grade === 1 ? '/bɔːl/' : '/ˈpɒpkɔːn/',
          exampleSentence: grade === 1 ? 'I have a red ball.' : 'I like popcorn.',
        },
        {
          word: grade === 1 ? 'book' : 'pizza',
          meaningVi: grade === 1 ? 'quyển sách' : 'bánh pizza',
          phonetic: grade === 1 ? '/bʊk/' : '/ˈpiːtsə/',
          exampleSentence: grade === 1 ? 'Open your book.' : 'Eat the pizza.',
        },
      ],
      sentencePatterns: [
        {
          pattern: grade === 1 ? "Hi, I'm Bill." : 'Point to the popcorn.',
          patternVi: grade === 1 ? 'Xin chào, tớ là Bill.' : 'Hãy chỉ vào bắp rang bơ.',
        },
      ],
      funTime: {
        chantTitle: 'Unit 1 Chant',
        chantLyrics: [
          'Listen, listen, hear the sound!',
          'English is fun all around!',
        ],
      },
    },
  ];

  return JSON.stringify(sample, null, 2);
}
