import { useEffect, useState } from "react";
import { X, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { getAiQuestions, generateAiQuestions } from "../api/aiQuestionApi";
import { toast } from "react-toastify";

const GROUPS = [
  ["technical", "Technical"],
  ["project", "Projects"],
  ["followUps", "Follow-ups"],
];

const DIFF_STYLE = {
  easy: "bg-green-500/15 text-green-600",
  medium: "bg-yellow-500/15 text-yellow-600",
  hard: "bg-red-500/15 text-red-500",
};

export default function AiQuestionsPanel({ bookingId, onClose }) {
  const [data, setData] = useState(null); // { questions, generatedAt, remaining, source? }
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    getAiQuestions(bookingId) // GET: no AI call, no quota used
      .then((r) => setData(r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Failed to load questions"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [bookingId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => toast.dismiss("regen-confirm"), []);

  const runGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    setError("");
    try {
      const r = await generateAiQuestions(bookingId);
      setData(r.data);
      toast.success("New questions generated");
    } catch (e) {
      setError(
        e.response?.status === 429
          ? "Generation limit reached for this interview."
          : e.response?.data?.message || "Generation failed. Try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const generate = () => {
    if (!data?.questions) return runGenerate();

    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-sm">
            Your current questions will be replaced and can't be recovered. You
            have {data.remaining} generation(s) left. Continue?
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                closeToast();
                runGenerate();
              }}
              className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover"
            >
              Regenerate
            </button>
            <button
              onClick={closeToast}
              className="rounded border border-white/30 px-3 py-1 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        toastId: "regen-confirm",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      },
    );
  };

  const q = data?.questions;

  return (
    <div className="flex h-full flex-col text-text-primary">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="flex items-center gap-2 font-semibold">
          <Sparkles size={16} className="text-accent" /> AI Interview Questions
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Hide questions"
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {loading && <p className="text-sm text-text-secondary">Loading...</p>}

        {error && (
          <div className="space-y-2">
            <p className="text-sm text-red-500">{error}</p>
            {!data && (
              <button
                onClick={load}
                className="text-sm text-accent hover:underline"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {data && (
          <div className="space-y-1">
            <button
              onClick={generate}
              disabled={generating || data.remaining === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {generating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {generating
                ? "Generating, up to 30s..."
                : q
                  ? "Regenerate"
                  : "Generate questions"}{" "}
              ({data.remaining} left)
            </button>
            {data.generatedAt && (
              <p className="text-xs text-text-secondary">
                Generated {new Date(data.generatedAt).toLocaleTimeString()}
              </p>
            )}
            {data.source === "profile" && (
              <p className="text-xs text-yellow-600">
                Based on profile only. No readable resume.
              </p>
            )}
          </div>
        )}

        {q &&
          GROUPS.map(([key, label]) => (
            <section key={key}>
              <h3 className="mb-2 text-sm font-semibold text-text-secondary">
                {label}
              </h3>
              <ul className="space-y-3">
                {q[key].map((item, i) => (
                  <li key={i} className="rounded-lg border border-border p-3">
                    <p className="text-sm">{item.question}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${DIFF_STYLE[item.difficulty]}`}
                      >
                        {item.difficulty}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {item.why}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}
