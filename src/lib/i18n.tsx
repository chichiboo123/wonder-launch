import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "ko" | "en" | "ja";

export const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "ko", label: "KOR" },
  { value: "en", label: "ENG" },
  { value: "ja", label: "JPN" },
];

const translations = {
  // Index
  title1: { ko: "질문", en: "Question", ja: "質問" },
  title2: { ko: "스페이스", en: "Space", ja: "スペース" },
  subtitle: { ko: "우리들의 질문으로 만드는 우주", en: "A universe made from our questions", ja: "私たちの質問で作る宇宙" },
  exploreBtn: { ko: "질문 탐험", en: "Explore", ja: "探検" },
  randomBtn: { ko: "랜덤 질문", en: "Random", ja: "ランダム" },
  adminBtn: { ko: "관리자", en: "Admin", ja: "管理者" },
  createTitle: { ko: "🛰️ 질문 위성 만들기", en: "🛰️ Create a Question Satellite", ja: "🛰️ 質問衛星を作ろう" },
  namePlaceholder: { ko: "우주비행사 이름 (닉네임)", en: "Astronaut name (nickname)", ja: "宇宙飛行士の名前（ニックネーム）" },
  questionPlaceholder: { ko: "궁금한 질문을 적어보세요! ✨", en: "Write your question! ✨", ja: "質問を書いてみよう！✨" },
  topicGuide: { ko: "🏷️ 어떤 주제의 질문이야? (여러 개 고를 수 있어!)", en: "🏷️ What topic? (You can pick multiple!)", ja: "🏷️ どんなテーマ？（複数選べるよ！）" },
  etcGuideTitle: { ko: "✏️ '기타'를 골랐구나! 어떤 주제인지 짧게 적어줘!", en: "✏️ You picked 'Other'! Write your topic!", ja: "✏️ 「その他」を選んだね！テーマを書いてね！" },
  etcGuideDesc: { ko: "(예: 음식, 게임, 동물, 우주여행 등 네가 원하는 주제!)", en: "(e.g. food, games, animals, space travel...)", ja: "（例：食べ物、ゲーム、動物、宇宙旅行など）" },
  etcInputPlaceholder: { ko: "내가 정한 주제를 적어봐! 🌟", en: "Write your own topic! 🌟", ja: "自分のテーマを書いてね！🌟" },
  launchBtn: { ko: "질문 발사!", en: "Launch!", ja: "質問発射！" },
  launching: { ko: "발사 중...", en: "Launching...", ja: "発射中..." },
  totalQuestions: { ko: "개의 질문이 우주를 떠돌고 있어요", en: "questions floating in space", ja: "個の質問が宇宙を漂っています" },
  recentSatellites: { ko: "최근 질문 위성", en: "Recent Question Satellites", ja: "最近の質問衛星" },

  // Toasts
  toastName: { ko: "이름을 입력해줘! 🧑‍🚀", en: "Enter your name! 🧑‍🚀", ja: "名前を入力してね！🧑‍🚀" },
  toastQuestion: { ko: "질문을 입력해줘! 🤔", en: "Enter a question! 🤔", ja: "質問を入力してね！🤔" },
  toastLength: { ko: "질문은 300자 이내로 작성해줘!", en: "Question must be under 300 characters!", ja: "質問は300文字以内で！" },
  toastTopic: { ko: "카테고리를 하나 이상 골라줘! 🏷️", en: "Pick at least one category! 🏷️", ja: "カテゴリを1つ以上選んでね！🏷️" },
  toastEtc: { ko: "기타를 골랐으면 어떤 주제인지 적어줘! ✏️", en: "Write your custom topic! ✏️", ja: "「その他」のテーマを書いてね！✏️" },
  toastSuccess: { ko: "질문 위성이 발사되었어! 🛰️", en: "Question satellite launched! 🛰️", ja: "質問衛星が発射されたよ！🛰️" },

  // Questions page
  exploreTitle: { ko: "질문", en: "Question", ja: "質問" },
  exploreTitleSuffix: { ko: "탐험 🔭", en: "Explorer 🔭", ja: "探検 🔭" },
  allFilter: { ko: "🌌 전체", en: "🌌 All", ja: "🌌 すべて" },
  noQuestions: { ko: "아직 질문 위성이 없어요! 🌑", en: "No question satellites yet! 🌑", ja: "まだ質問衛星がないよ！🌑" },
  noQuestionsSub: { ko: "홈에서 질문을 발사해보세요!", en: "Launch a question from home!", ja: "ホームから質問を発射しよう！" },
  home: { ko: "홈으로", en: "Home", ja: "ホームへ" },

  // Question Detail
  back: { ko: "뒤로가기", en: "Back", ja: "戻る" },
  notFound: { ko: "질문을 찾을 수 없어요 😢", en: "Question not found 😢", ja: "質問が見つかりません 😢" },
  goHome: { ko: "홈으로 돌아가기", en: "Go Home", ja: "ホームに戻る" },
  answers: { ko: "💬 답변", en: "💬 Answers", ja: "💬 回答" },
  noAnswers: { ko: "아직 답변이 없어요! 첫 번째 답변을 달아보세요 ⭐", en: "No answers yet! Be the first to answer ⭐", ja: "まだ回答がないよ！最初の回答をしよう ⭐" },
  answerNamePlaceholder: { ko: "이름", en: "Name", ja: "名前" },
  answerPlaceholder: { ko: "답변을 적어보세요!", en: "Write your answer!", ja: "回答を書いてね！" },
  toastAnswerName: { ko: "이름을 입력해줘!", en: "Enter your name!", ja: "名前を入力してね！" },
  toastAnswerText: { ko: "답변을 입력해줘!", en: "Enter an answer!", ja: "回答を入力してね！" },
  toastAnswerLength: { ko: "답변은 500자 이내로!", en: "Answer must be under 500 characters!", ja: "回答は500文字以内で！" },
  toastAnswerSuccess: { ko: "답변이 등록되었어! ⭐", en: "Answer posted! ⭐", ja: "回答が登録されたよ！⭐" },

  // Random
  randomTitle: { ko: "랜덤", en: "Random", ja: "ランダム" },
  randomTitleSuffix: { ko: "질문 🎲", en: "Question 🎲", ja: "質問 🎲" },
  noQuestionsYet: { ko: "아직 질문이 없어요! 🌑", en: "No questions yet! 🌑", ja: "まだ質問がないよ！🌑" },
  clickToAnswer: { ko: "눌러서 답변 보기 →", en: "Click to see answers →", ja: "クリックして回答を見る →" },
  anotherQuestion: { ko: "다른 질문 보기!", en: "Another question!", ja: "別の質問を見る！" },

  // Admin
  adminTitle: { ko: "🔒 관리자 모드", en: "🔒 Admin Mode", ja: "🔒 管理者モード" },
  adminPasswordPrompt: { ko: "비밀번호를 입력하세요", en: "Enter password", ja: "パスワードを入力してください" },
  adminPasswordPlaceholder: { ko: "비밀번호", en: "Password", ja: "パスワード" },
  adminEnter: { ko: "입장하기", en: "Enter", ja: "入場する" },
  adminMode: { ko: "🛡️ 관리자 모드", en: "🛡️ Admin Mode", ja: "🛡️ 管理者モード" },
  adminManageTitle1: { ko: "질문", en: "Question", ja: "質問" },
  adminManageTitle2: { ko: "관리 ⚙️", en: "Management ⚙️", ja: "管理 ⚙️" },
  adminTotal: { ko: "총", en: "Total", ja: "合計" },
  adminQuestionUnit: { ko: "개의 질문", en: "questions", ja: "個の質問" },
  adminNoQuestions: { ko: "질문이 없습니다.", en: "No questions.", ja: "質問がありません。" },
  adminDeleted: { ko: "질문이 삭제되었어요", en: "Question deleted", ja: "質問が削除されました" },
  adminSaved: { ko: "수정 완료! ✏️", en: "Saved! ✏️", ja: "修正完了！✏️" },
  adminLoginSuccess: { ko: "관리자 모드 활성화! 🔓", en: "Admin mode activated! 🔓", ja: "管理者モード有効化！🔓" },
  adminLoginFail: { ko: "비밀번호가 틀렸어요! 🔒", en: "Wrong password! 🔒", ja: "パスワードが違います！🔒" },

  // Topics
  topicImagination: { ko: "💭 상상", en: "💭 Imagination", ja: "💭 想像" },
  topicPeople: { ko: "👫 사람", en: "👫 People", ja: "👫 人" },
  topicDream: { ko: "🌙 꿈", en: "🌙 Dreams", ja: "🌙 夢" },
  topicHistory: { ko: "📜 역사", en: "📜 History", ja: "📜 歴史" },
  topicScience: { ko: "🔬 과학·기술", en: "🔬 Science", ja: "🔬 科学·技術" },
  topicNature: { ko: "🌿 자연", en: "🌿 Nature", ja: "🌿 自然" },
  topicEmotion: { ko: "💗 마음·감정", en: "💗 Emotions", ja: "💗 心·感情" },
  topicArt: { ko: "🎨 예술", en: "🎨 Art", ja: "🎨 芸術" },
  topicSchool: { ko: "🏫 학교", en: "🏫 School", ja: "🏫 学校" },
  topicWorry: { ko: "😔 고민", en: "😔 Worries", ja: "😔 悩み" },
  topicEtc: { ko: "✨ 기타", en: "✨ Other", ja: "✨ その他" },
} as const;

type TranslationKey = keyof typeof translations;

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "ko",
  setLang: () => {},
  t: (key) => translations[key].ko,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("question-space-lang");
    return (saved as Lang) || "ko";
  });

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("question-space-lang", newLang);
  };

  const t = (key: TranslationKey) => translations[key][lang];

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

// Topic label with i18n
const topicKeyMap: Record<string, TranslationKey> = {
  imagination: "topicImagination",
  people: "topicPeople",
  dream: "topicDream",
  history: "topicHistory",
  science: "topicScience",
  nature: "topicNature",
  emotion: "topicEmotion",
  art: "topicArt",
  school: "topicSchool",
  worry: "topicWorry",
  etc: "topicEtc",
};

export function getTopicLabelI18n(value: string, lang: Lang): string {
  const key = topicKeyMap[value];
  if (key) return translations[key][lang];
  return `✨ ${value}`;
}
