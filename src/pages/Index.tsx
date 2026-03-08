import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Compass, Shuffle, Shield } from "lucide-react";
import StarField from "@/components/StarField";
import SatelliteIcon from "@/components/SatelliteIcon";
import { addQuestion, getQuestions, TOPICS } from "@/lib/questions";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [launching, setLaunching] = useState(false);
  const questions = getQuestions();

  const toggleTopic = (value: string) => {
    setSelectedTopics((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
    // 기타 해제 시 커스텀 입력 초기화
    if (value === "etc" && selectedTopics.includes("etc")) {
      setCustomTopic("");
    }
  };

  const handleLaunch = () => {
    if (!author.trim()) { toast.error("이름을 입력해줘! 🧑‍🚀"); return; }
    if (!text.trim()) { toast.error("질문을 입력해줘! 🤔"); return; }
    if (text.trim().length > 300) { toast.error("질문은 300자 이내로 작성해줘!"); return; }
    if (selectedTopics.length === 0) { toast.error("카테고리를 하나 이상 골라줘! 🏷️"); return; }
    if (selectedTopics.includes("etc") && !customTopic.trim()) {
      toast.error("기타를 골랐으면 어떤 주제인지 적어줘! ✏️");
      return;
    }

    // 기타인 경우 커스텀 키워드로 대체
    const finalTopics = selectedTopics.map((t) =>
      t === "etc" ? customTopic.trim() : t
    );

    setLaunching(true);
    setTimeout(() => {
      addQuestion(author.trim(), text.trim(), finalTopics);
      setText("");
      setSelectedTopics([]);
      setCustomTopic("");
      setLaunching(false);
      toast.success("질문 위성이 발사되었어! 🛰️");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />

      <div className="relative z-10 flex flex-col items-center px-4 py-8 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl tracking-wide mb-2">
            <span className="text-primary">질문</span>{" "}
            <span className="text-accent">스페이스</span>{" "}
            <span className="text-2xl md:text-4xl">🚀</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            궁금한 걸 우주로 발사하자!
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8 flex-wrap justify-center"
        >
          <button
            onClick={() => navigate("/questions")}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border hover:border-primary transition-colors text-foreground text-base"
          >
            <Compass size={18} className="text-primary" />
            질문 탐험
          </button>
          <button
            onClick={() => navigate("/random")}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border hover:border-accent transition-colors text-foreground text-base"
          >
            <Shuffle size={18} className="text-accent" />
            랜덤 질문
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border hover:border-secondary transition-colors text-foreground text-base"
          >
            <Shield size={18} className="text-secondary" />
            관리자
          </button>
        </motion.div>

        {/* Question Input Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-lg bg-card/80 backdrop-blur-md border border-border rounded-2xl p-6 mb-10"
        >
          <h2 className="text-xl text-primary mb-4 text-center">🛰️ 질문 위성 만들기</h2>

          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="우주비행사 이름 (닉네임)"
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground mb-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="궁금한 질문을 적어보세요! ✨"
            rows={3}
            maxLength={300}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground mb-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <p className="text-sm text-muted-foreground mb-2">
            🏷️ 어떤 주제의 질문이야? (여러 개 고를 수 있어!)
          </p>
          <div className="flex gap-2 flex-wrap mb-2">
            {TOPICS.map((t) => (
              <button
                key={t.value}
                onClick={() => toggleTopic(t.value)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTopics.includes(t.value)
                    ? "bg-primary text-primary-foreground scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 기타 커스텀 입력 */}
          <AnimatePresence>
            {selectedTopics.includes("etc") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-muted/50 rounded-xl p-3 mb-2 border border-border">
                  <p className="text-sm text-accent mb-2">
                    ✏️ '기타'를 골랐구나! 어떤 주제인지 짧게 적어줘!
                    <br />
                    <span className="text-xs text-muted-foreground">
                      (예: 음식, 게임, 동물, 우주여행 등 네가 원하는 주제!)
                    </span>
                  </p>
                  <input
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="내가 정한 주제를 적어봐! 🌟"
                    maxLength={10}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {launching && (
              <motion.div
                className="flex justify-center mb-3"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -200, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <span className="text-5xl">🚀</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleLaunch}
            disabled={launching}
            className="w-full py-4 rounded-xl bg-launch text-primary-foreground font-display text-xl tracking-wider hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "hsl(var(--launch))" }}
          >
            <Rocket size={22} />
            {launching ? "발사 중..." : "질문 발사! 🚀"}
          </button>
        </motion.div>

        {/* Floating satellites */}
        {questions.length > 0 && (
          <div className="w-full max-w-2xl">
            <h2 className="text-lg text-muted-foreground mb-4 text-center">
              🛰️ 최근 질문 위성 ({questions.length}개)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {questions.slice(0, 6).map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/question/${q.id}`)}
                  className="bg-card/60 backdrop-blur border border-border rounded-xl p-4 cursor-pointer hover:border-primary transition-all hover:scale-105 flex flex-col items-center text-center gap-2"
                >
                  <SatelliteIcon index={i} size={40} />
                  <p className="text-sm text-foreground line-clamp-2">{q.text}</p>
                  <span className="text-xs text-muted-foreground">{q.author}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
