import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendOutreachEmail, getEmailHistory } from "../../api/recruiterApi";

export default function OutreachModal({ candidate, onClose }) {
  const [role, setRole] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getEmailHistory(candidate.id)
      .then((res) => setHistory(res.data.data))
      .catch(() => {});
  }, [candidate.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim() || !skillsRequired.trim()) {
      toast.error("Role and skills required are both required");
      return;
    }

    setLoading(true);
    try {
      await sendOutreachEmail(candidate.id, { role: role.trim(), skillsRequired: skillsRequired.trim() });
      toast.success("Email sent successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-text-primary mb-1">Reach out to {candidate.user?.name}</h3>
        <p className="text-sm text-text-secondary mb-4">
          An email will be sent with the details below.
        </p>

        {history.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-xs text-yellow-600">
            You've already contacted this candidate {history.length} time(s), most recently on{" "}
            {new Date(history[0].sentAt).toLocaleString()}.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Skills Required</label>
            <textarea
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              rows={3}
              placeholder="e.g. React, TypeScript, 2+ years experience"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="text-sm bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded disabled:opacity-50">
              {loading ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}