import { useState } from "react";
import { toast } from "react-toastify";
import { submitFeedback } from "../../api/employeeApi";

export default function FeedbackModal({ booking, onClose, onSubmitted }) {
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      toast.error("Feedback is required");
      return;
    }

    const scoreNum = Number(score);
    if (!Number.isInteger(scoreNum) || scoreNum < 1 || scoreNum > 10) {
      toast.error("Score must be a whole number between 1 and 10");
      return;
    }

    setLoading(true);
    try {
      await submitFeedback(booking.id, { feedback: feedback.trim(), score: scoreNum });
      toast.success("Feedback submitted");
      onSubmitted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-text-primary mb-1">Give Feedback</h3>
        <p className="text-sm text-text-secondary mb-4">
          For {booking.candidateProfile?.user?.name || "this candidate"}. This cannot be changed after submitting.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Score (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}