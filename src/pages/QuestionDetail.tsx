import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import StarField from "@/components/StarField";
import SatelliteIcon from "@/components/SatelliteIcon";
import { apiGetQuestionById, apiAddComment, Question } from "@/lib/api";
import { useLang, getTopicLabelI18n, Lang } from "@/lib/i18n";
import { toast } from "sonner";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [translationLang, setTranslationLang] = useState<Lang>(lang);
  const [lastCommentTime, setLastCommentTime] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiGetQuestionById(id || "").then(data => {
      setQuestion(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <StarField />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="relative min-h-screen">
        <StarField />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl text-muted-foreground">{t("notFound")}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-full"
          >
            {t("goHome")}
          </button>
        </div>
      </div>
    );
  }

  const handleComment = async () => {
    if (!commentAuthor.trim()) { toast.error(t("toastAnswerName")); return; }
    if (!commentText.trim()) { toast.error(t("toastAnswerText")); return; }
    if (commentText.trim().length > 500) { toast.error(t("toastAnswerLength")); return; }

    // 20초 쿨다운 체크
    if (lastCommentTime && Date.now() - lastCommentTime < 20000) {
      toast.error(t("toastAnswerCooldown"));
      return;
    }

    // 중복 댓글 체크
    const trimmedText = commentText.trim();
    const isDuplicate = question.comments?.some(
      (c) => c.text.trim() === trimmedText
    );
    if (isDuplicate) {
      toast.error(t("toastAnswerDuplicate"));
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    try {
      const newComment = await apiAddComment(question.id, commentAuthor.trim(), trimmedText);
      setQuestion(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : prev);
      setCommentText("");
      setLastCommentTime(Date.now());
      toast.success(t("toastAnswerSuccess"));
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Get translated text based on selected language
  const getTranslatedText = () => {
    if (translationLang === "ko" && question.text_ko) return question.text_ko;
    if (translationLang === "en" && question.text_en) return question.text_en;
    if (translationLang === "ja" && question.text_ja) return question.text_ja;
    return question.text;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      <div className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        <button
          onClick={() => {
            if (window.history.length > 1) { navigate(-1); }
            else { navigate("/"); }
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> {t("back")}
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <SatelliteIcon size={48} />
            <div>
              <div className="flex gap-1.5 flex-wrap">
                {question.topics.map((tp) => (
                  <span key={tp} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {getTopicLabelI18n(tp, translationLang)}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {question.author} · {new Date(question.createdAt).toLocaleDateString(lang === "ja" ? "ja-JP" : lang === "en" ? "en-US" : "ko-KR")}
              </p>
            </div>
          </div>
          <p className="text-xl text-foreground leading-relaxed">{getTranslatedText()}</p>

          {/* Translation buttons */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground mr-1">🌐</span>
            {(["ko", "en", "ja"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setTranslationLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  translationLang === l
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {l === "ko" ? "KO" : l === "en" ? "EN" : "JP"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Comments */}
        <div className="mb-4">
          <h2 className="text-lg text-primary mb-3">{t("answers")} ({question.comments?.length || 0})</h2>

          {(!question.comments || question.comments.length === 0) ? (
            <p className="text-muted-foreground text-center py-6">{t("noAnswers")}</p>
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
                  <p className="text-foreground text-sm">
                    {translationLang === "ko" && c.text_ko ? c.text_ko
                      : translationLang === "en" && c.text_en ? c.text_en
                      : translationLang === "ja" && c.text_ja ? c.text_ja
                      : c.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {c.author} · {new Date(c.createdAt).toLocaleDateString(lang === "ja" ? "ja-JP" : lang === "en" ? "en-US" : "ko-KR")}
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
            placeholder={t("answerNamePlaceholder")}
            maxLength={20}
            className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2 items-center">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("answerPlaceholder")}
              maxLength={500}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleComment}
              disabled={submitting}
              className="shrink-0 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
