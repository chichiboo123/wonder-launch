import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import StarField from "@/components/StarField";
import SatelliteIcon from "@/components/SatelliteIcon";
import { getQuestionById, addComment, TOPICS } from "@/lib/questions";
import { toast } from "sonner";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [, setRefresh] = useState(0);

  const question = getQuestionById(id || "");

  if (!question) {
    return (
      <div className="relative min-h-screen">
        <StarField />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl text-muted-foreground">질문을 찾을 수 없어요 😢</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-full"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const topicInfo = TOPICS.find((t) => t.value === question.topic);

  const handleComment = () => {
    if (!commentAuthor.trim()) { toast.error("이름을 입력해줘!"); return; }
    if (!commentText.trim()) { toast.error("답변을 입력해줘!"); return; }
    if (commentText.trim().length > 500) { toast.error("답변은 500자 이내로!"); return; }

    addComment(question.id, commentAuthor.trim(), commentText.trim());
    setCommentText("");
    setRefresh((r) => r + 1);
    toast.success("답변이 등록되었어! ⭐");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      <div className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> 뒤로가기
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <SatelliteIcon size={48} />
            <div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                {topicInfo?.label}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {question.author} · {new Date(question.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>
          <p className="text-xl text-foreground leading-relaxed">{question.text}</p>
        </motion.div>

        {/* Comments */}
        <div className="mb-4">
          <h2 className="text-lg text-primary mb-3">💬 답변 ({question.comments.length})</h2>

          {question.comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              아직 답변이 없어요! 첫 번째 답변을 달아보세요 ⭐
            </p>
          ) : (
            <div className="space-y-3 mb-4">
              {question.comments.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-muted/50 rounded-xl p-3 border border-border"
                >
                  <p className="text-foreground text-sm">{c.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {c.author} · {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Comment input */}
        <div className="bg-card/60 backdrop-blur border border-border rounded-xl p-4">
          <input
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="이름"
            maxLength={20}
            className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="답변을 적어보세요!"
              maxLength={500}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleComment}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
