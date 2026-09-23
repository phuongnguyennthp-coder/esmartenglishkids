import { DigitalCitizenshipTopic } from '../types/curriculum';

export const DIGITAL_CITIZENSHIP_TOPICS: DigitalCitizenshipTopic[] = [
  {
    id: 'dc-1',
    title: 'Online Safety',
    titleVi: 'An toàn trực tuyến',
    iconEmoji: '🛡️',
    coreRule: 'Only visit approved learning spaces and never chat with strangers.',
    coreRuleVi: 'Chỉ học tập trên các trang được cha mẹ/thầy cô cho phép, không nói chuyện với người lạ.',
    storyContext: 'Smarty is exploring the digital library. A strange pop-up message says: "Click here to win 100 free candies!"',
    dilemma: {
      situation: 'A popup message appears asking you to click an unknown link. What should you do?',
      situationVi: 'Một thông báo lạ hiện lên mời bấm vào đường link để nhận quà. Em sẽ làm gì?',
      options: [
        {
          text: 'Tell a teacher or parent immediately, and do not click it.',
          textVi: 'Báo ngay cho thầy cô hoặc cha mẹ, không bấm vào.',
          isSafe: true,
          feedback: 'Outstanding! Always notify an adult when an unexpected link appears.',
        },
        {
          text: 'Click the link quickly to get the prize.',
          textVi: 'Bấm ngay để xem có nhận được quà không.',
          isSafe: false,
          feedback: 'Be careful! Unknown links can be dangerous. Always ask an adult first.',
        },
      ],
    },
    smartTip: 'Remember: If something online looks strange, pause and ask an adult!',
  },
  {
    id: 'dc-2',
    title: 'Personal Information',
    titleVi: 'Bảo vệ thông tin cá nhân',
    iconEmoji: '🔒',
    coreRule: 'Keep your real name, phone number, and home address secret.',
    coreRuleVi: 'Giữ bí mật họ tên đầy đủ, số điện thoại và địa chỉ nhà.',
    storyContext: 'Bimi is creating his kid avatar. The game asks for his home address and mother’s phone number.',
    dilemma: {
      situation: 'An online game asks for your house address and phone number. What is the right action?',
      situationVi: 'Trò chơi trực tuyến yêu cầu nhập địa chỉ nhà và số điện thoại. Em nên làm gì?',
      options: [
        {
          text: 'Keep private info private! Use a fun nickname and ask parents first.',
          textVi: 'Giữ bí mật! Dùng biệt danh vui vẻ và hỏi ý kiến cha mẹ.',
          isSafe: true,
          feedback: 'Super star! Private information must always stay safe and protected.',
        },
        {
          text: 'Type your exact home address so they can send stickers.',
          textVi: 'Điền địa chỉ nhà thật để họ gửi hình dán.',
          isSafe: false,
          feedback: 'Never type your real address online! Your safety comes first.',
        },
      ],
    },
    smartTip: 'Your home address and phone number are like secret treasures — keep them locked safe!',
  },
  {
    id: 'dc-3',
    title: 'Password Security',
    titleVi: 'Bảo mật mật khẩu',
    iconEmoji: '🔑',
    coreRule: "Don't share your password with friends. Only parents know your secret key.",
    coreRuleVi: 'Không chia sẻ mật khẩu cho bạn bè. Chỉ cha mẹ được biết chìa khóa bí mật.',
    storyContext: 'During computer class, your classmate asks: "Can you tell me your E-Smart password so I can play?"',
    dilemma: {
      situation: 'A classmate asks to borrow your student account password. What should you say?',
      situationVi: 'Bạn cùng lớp hỏi mượn mật khẩu tài khoản học tập của em. Em nên trả lời thế nào?',
      options: [
        {
          text: '"I keep my password secret, but we can play together on your screen!"',
          textVi: '"Mật khẩu là bí mật riêng, nhưng tớ có thể cùng chơi trên màn hình của bạn!"',
          isSafe: true,
          feedback: 'Perfect! True digital citizens protect their passwords with kindness.',
        },
        {
          text: 'Write your password on a paper slip and give it to them.',
          textVi: 'Viết mật khẩu ra giấy rồi đưa cho bạn.',
          isSafe: false,
          feedback: 'Passwords are like toothbrushes — you do not share them with anyone!',
        },
      ],
    },
    smartTip: 'A strong password keeps your stars, badges, and learning journey safe!',
  },
  {
    id: 'dc-4',
    title: 'Digital Footprint & Kindness',
    titleVi: 'Dấu chân số & Ứng xử tử tế',
    iconEmoji: '👣',
    coreRule: 'Be kind online. Friendly words build happiness; mean words hurt forever.',
    coreRuleVi: 'Hãy tử tế trên mạng. Lời nói tích cực mang lại niềm vui; lời ác ý để lại vết thương.',
    storyContext: 'A friend mispronounces a word in class voice recording and feels shy.',
    dilemma: {
      situation: 'Your friend made a mistake while speaking English. What do you say in the comment cheer?',
      situationVi: 'Bạn vô tình phát âm sai trong bản ghi âm và cảm thấy rụt rè. Em sẽ nhắn gì cổ vũ bạn?',
      options: [
        {
          text: 'Send a cheer: "Great try! You can do it next time! 🌟"',
          textVi: 'Gửi lời khen: "Cố lên bạn nhé! Lần tới bạn sẽ làm tốt hơn! 🌟"',
          isSafe: true,
          feedback: 'Wonderful heart! Kindness is the greatest superpower of a digital citizen.',
        },
        {
          text: 'Laugh and tell other students that they said it wrong.',
          textVi: 'Cười chê và kể với các bạn khác.',
          isSafe: false,
          feedback: 'Remember: Treat friends online with the same warmth you would in person.',
        },
      ],
    },
    smartTip: 'Everything you post or say leaves a digital footprint. Leave footprints of kindness!',
  },
  {
    id: 'dc-5',
    title: 'Copyright & Respect',
    titleVi: 'Bản quyền & Tôn trọng tác giả',
    iconEmoji: '🎨',
    coreRule: 'Give credit to artists and authors when you use songs or pictures.',
    coreRuleVi: 'Tôn trọng và ghi nguồn tác giả khi sử dụng tranh ảnh hay bài hát.',
    storyContext: 'You want to add a cute bunny drawing to your English project poster.',
    dilemma: {
      situation: 'You find a cute drawing online by another artist. How do you use it respectfully?',
      situationVi: 'Em tìm thấy bức tranh thỏ rất đẹp trên mạng. Em nên sử dụng thế nào cho đúng?',
      options: [
        {
          text: 'Ask teacher/parents to help check permission and write the artist name.',
          textVi: 'Nhờ thầy cô/cha mẹ giúp xin phép hoặc ghi rõ tên người vẽ tranh.',
          isSafe: true,
          feedback: 'Honest and respectful! Creative artists love having their names credited.',
        },
        {
          text: 'Pretend that you drew it all by yourself.',
          textVi: 'Nói rằng chính mình đã tự vẽ từ đầu.',
          isSafe: false,
          feedback: 'Honesty is always best! Giving credit makes you a proud learner.',
        },
      ],
    },
    smartTip: 'Always respect original creations by saying "Artwork by [Artist Name]"!',
  },
  {
    id: 'dc-6',
    title: 'Responsible AI Use',
    titleVi: 'Sử dụng AI có trách nhiệm',
    iconEmoji: '🤖',
    coreRule: 'Use AI as a helpful study buddy to practice, not as a shortcut to copy answers.',
    coreRuleVi: 'Sử dụng AI như bạn đồng hành cùng học tập, không sao chép đáp án bừa bãi.',
    storyContext: 'The AI Speaking Coach gives you pronunciation feedback and hints.',
    dilemma: {
      situation: 'How should you interact with the AI Speaking Coach?',
      situationVi: 'Em nên tương tác với Gia sư AI luyện nói như thế nào?',
      options: [
        {
          text: 'Listen carefully, repeat with my own voice, and learn from its feedback.',
          textVi: 'Lắng nghe kỹ, dùng giọng thật của mình đọc lại và học theo gợi ý.',
          isSafe: true,
          feedback: 'Brilliant! AI is your supportive study coach to help YOU shine!',
        },
        {
          text: 'Ask AI to do all my school homework while I play video games.',
          textVi: 'Nhờ AI làm hết bài tập về nhà để đi chơi điện tử.',
          isSafe: false,
          feedback: 'Using AI responsibly means you do the thinking and speaking yourself!',
        },
      ],
    },
    smartTip: 'AI is like training wheels on your bicycle — it helps you learn, but YOU do the pedaling!',
  },
];
