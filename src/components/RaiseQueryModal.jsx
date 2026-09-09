import { useState } from "react";
import { toast } from "react-toastify";
import { raiseQuery } from "../api/queryApi";

export default function RaiseQueryModal({ onClose }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are both required");
      return;
    }
    setLoading(true);
    try {
      await raiseQuery({ subject: subject.trim(), message: message.trim() });
      toast.success("Your query has been submitted");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-text-primary mb-1">Raise a query</h3>
        <p className="text-sm text-text-secondary mb-4">
          Facing an issue? Let our support team know and we'll get back to you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Payment deducted but booking not confirmed"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe your issue in detail"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="text-sm bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Query"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}