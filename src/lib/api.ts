const API_URL = "https://script.google.com/macros/s/AKfycbziVpqGBJoQz7nQN0ZwgALeUZvPB04EsmDVd0l-y9DKT99x6ns3lcGCGyctV-dKXdJBfg/exec";

export interface Comment {
  id: string;
  questionId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Question {
  id: string;
  author: string;
  text: string;
  topics: string[];
  createdAt: string;
  comments: Comment[];
  text_ko?: string;
  text_en?: string;
  text_ja?: string;
}

async function fetchGet(action: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function fetchPost(body: Record<string, any>): Promise<any> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiGetAllQuestions(): Promise<Question[]> {
  return fetchGet("getall");
}

export async function apiGetQuestionById(id: string): Promise<Question | null> {
  const data = await fetchGet("get", { id });
  if (data?.error) return null;
  return data;
}

export async function apiGetRandomQuestion(): Promise<Question | null> {
  return fetchGet("random");
}

export async function apiGetQuestionsByTopic(topic: string): Promise<Question[]> {
  return fetchGet("bytopic", { topic });
}

export async function apiAddQuestion(author: string, text: string, topics: string[]): Promise<Question> {
  return fetchPost({ action: "addquestion", author, text, topics });
}

export async function apiAddComment(questionId: string, author: string, text: string): Promise<Comment> {
  return fetchPost({ action: "addcomment", questionId, author, text });
}

export async function apiDeleteQuestion(id: string): Promise<any> {
  return fetchPost({ action: "deletequestion", id });
}

export async function apiUpdateQuestion(id: string, text: string, topics: string[]): Promise<any> {
  return fetchPost({ action: "updatequestion", id, text, topics });
}
