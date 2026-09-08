import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCandidateProfile, updateCandidateProfile } from "../../api/candidateApi";

export default function EditCandidateProfile({ onClose, onUpdated }) {
  const [form, setForm] = useState({
    education: "",
    skills: "",
    location: "",
    designation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCandidateProfile()
      .then((res) => {
        const profile = res.data.data;
        setForm({
          education: profile.education || "",
          skills: profile.skills || "",
          location: profile.location || "",
          designation: profile.designation || "",
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCandidateProfile(form);
      toast.success("Profile updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-text-secondary text-sm">Loading profile...</p>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Designation</label>
              <input
                name="designation"
                value={form.designation}
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
            <div>
              <label className="block text-sm text-text-secondary mb-1">Education</label>
              <input
                name="education"
                value={form.education}
                onChange={handleChange}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Skills</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="text-sm bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}