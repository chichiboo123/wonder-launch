export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Question {
  id: string;
  author: string;
  text: string;
  topic: string;
  createdAt: string;
  comments: Comment[];
}

export const TOPICS = [
  { value: "science", label: "🔬 과학", emoji: "🔬" },
  { value: "math", label: "🔢 수학", emoji: "🔢" },
  { value: "history", label: "📜 역사", emoji: "📜" },
  { value: "nature", label: "🌿 자연", emoji: "🌿" },
  { value: "space", label: "🚀 우주", emoji: "🚀" },
  { value: "life", label: "💭 생활", emoji: "💭" },
  { value: "etc", label: "✨ 기타", emoji: "✨" },
];

const STORAGE_KEY = "question-space-data";

function loadQuestions(): Question[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveQuestions(questions: Question[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function getQuestions(): Question[] {
  return loadQuestions();
}

export function getQuestionById(id: string): Question | undefined {
  return loadQuestions().find((q) => q.id === id);
}

export function getQuestionsByTopic(topic: string): Question[] {
  return loadQuestions().filter((q) => q.topic === topic);
}

export function getRandomQuestion(): Question | undefined {
  const questions = loadQuestions();
  if (questions.length === 0) return undefined;
  return questions[Math.floor(Math.random() * questions.length)];
}

export function addQuestion(author: string, text: string, topic: string): Question {
  const questions = loadQuestions();
  const newQ: Question = {
    id: crypto.randomUUID(),
    author,
    text,
    topic,
    createdAt: new Date().toISOString(),
    comments: [],
  };
  questions.unshift(newQ);
  saveQuestions(questions);
  return newQ;
}

export function addComment(questionId: string, author: string, text: string): Comment | null {
  const questions = loadQuestions();
  const q = questions.find((q) => q.id === questionId);
  if (!q) return null;
  const comment: Comment = {
    id: crypto.randomUUID(),
    author,
    text,
    createdAt: new Date().toISOString(),
  };
  q.comments.push(comment);
  saveQuestions(questions);
  return comment;
}

export function deleteQuestion(id: string) {
  const questions = loadQuestions().filter((q) => q.id !== id);
  saveQuestions(questions);
}

export function updateQuestion(id: string, text: string, topic: string) {
  const questions = loadQuestions();
  const q = questions.find((q) => q.id === id);
  if (q) {
    q.text = text;
    q.topic = topic;
    saveQuestions(questions);
  }
}

// Apps Script integration placeholder
// To connect with Google Apps Script, replace these functions
// with fetch calls to your Apps Script web app URL:
// const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL";
// export async function syncToSheet(question: Question) {
//   await fetch(APPS_SCRIPT_URL, {
//     method: "POST",
//     body: JSON.stringify(question),
//   });
// }
