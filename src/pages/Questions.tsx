import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import StarField from "@/components/StarField";
import SatelliteIcon from "@/components/SatelliteIcon";
import { getQuestions, getQuestionsByTopic, TOPICS } from "@/lib/questions";

export default function Questions() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const questions = selectedTopic
    ? getQuestionsByTopic(selectedTopic)
    : getQuestions();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> 홈으로
        </button>

        <h1 className="text-3xl text-center mb-6">
          <span className="text-primary">질문</span> 탐험 🔭
        </h1>

        {/* Topic filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              !selectedTopic
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            🌌 전체
          </button>
          {TOPICS.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedTopic(t.value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedTopic === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {questions.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg mt-16">
            아직 질문 위성이 없어요! 🌑<br />
            홈에서 질문을 발사해보세요!
          </p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/question/${q.id}`)}
                className="bg-card/70 backdrop-blur border border-border rounded-xl p-4 cursor-pointer hover:border-primary transition-all flex items-center gap-4"
              >
                <SatelliteIcon index={i} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground line-clamp-2">{q.text}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{q.author}</span>
                    <span>{TOPICS.find((t) => t.value === q.topic)?.label}</span>
                    <span>💬 {q.comments.length}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
