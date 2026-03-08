import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shuffle } from "lucide-react";
import StarField from "@/components/StarField";
import SatelliteIcon from "@/components/SatelliteIcon";
import { getRandomQuestion, Question } from "@/lib/questions";

export default function RandomQuestion() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | undefined>();

  const pickRandom = () => setQuestion(getRandomQuestion());

  useEffect(() => { pickRandom(); }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      <div className="relative z-10 px-4 py-8 max-w-lg mx-auto flex flex-col items-center min-h-screen">
        <button
          onClick={() => navigate("/")}
          className="self-start flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> 홈으로
        </button>

        <h1 className="text-3xl mb-8">
          <span className="text-accent">랜덤</span> 질문 🎲
        </h1>

        {question ? (
          <motion.div
            key={question.id}
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="bg-card/80 backdrop-blur border border-border rounded-2xl p-8 text-center w-full mb-8 cursor-pointer hover:border-primary transition-all"
            onClick={() => navigate(`/question/${question.id}`)}
          >
            <SatelliteIcon size={64} />
            <p className="text-xl text-foreground mt-4 leading-relaxed">{question.text}</p>
            <p className="text-sm text-muted-foreground mt-3">
              {question.author} · 💬 {question.comments.length}
            </p>
            <p className="text-xs text-primary mt-2">눌러서 답변 보기 →</p>
          </motion.div>
        ) : (
          <p className="text-muted-foreground text-lg mt-16">
            아직 질문이 없어요! 🌑
          </p>
        )}

        <button
          onClick={pickRandom}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-accent-foreground text-lg hover:brightness-110 transition-all"
        >
          <Shuffle size={20} />
          다른 질문 보기!
        </button>
      </div>
    </div>
  );
}
