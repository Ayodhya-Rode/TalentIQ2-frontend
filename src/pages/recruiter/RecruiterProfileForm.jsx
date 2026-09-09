import { useState } from "react";
import { toast } from "react-toastify";
import { createRecruiterProfile } from "../../api/recruiterApi";

export default function RecruiterProfileForm({ onComplete }) {
  const [form, setForm] = useState({ company: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.location.trim()) {
      toast.error("Company and location are both required");
      return;
    }

    setLoading(true);
    try {
      await createRecruiterProfile(form);
      toast.success("Profile created");
      onComplete();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-1">Complete your profile</h2>
      <p className="text-sm text-text-secondary mb-6">
        Candidates will see this when you reach out to them.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white rounded py-2 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}