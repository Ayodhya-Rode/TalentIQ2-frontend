import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getEmployeeProfile, updateEmployeeProfile } from "../../api/employeeApi";
import { getCategories } from "../../api/categoryApi";

export default function EditEmployeeProfile({ onClose, onUpdated }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [form, setForm] = useState({
    education: "",
    skills: "",
    location: "",
    experience: "",
    company: "",
    designation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, categoriesRes] = await Promise.all([
          getEmployeeProfile(),
          getCategories(),
        ]);
        const profile = profileRes.data.data;
        setForm({
          education: profile.education || "",
          skills: profile.skills || "",
          location: profile.location || "",
          experience: profile.experience || "",
          company: profile.company || "",
          designation: profile.designation || "",
        });
        setSelectedCategoryIds(profile.categories.map((c) => c.category.id));
        setCategories(categoriesRes.data.data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategoryIds.length === 0) {
      toast.error("Select at least one category");
      return;
    }

    setSaving(true);
    try {
      await updateEmployeeProfile({ ...form, categoryIds: selectedCategoryIds });
      toast.success("Profile updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-text-secondary text-sm">Loading profile...</p>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <label className="block text-sm text-text-secondary mb-1">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Experience</label>
              <input
                name="experience"
                value={form.experience}
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

          <div>
            <label className="block text-sm text-text-secondary mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    selectedCategoryIds.includes(cat.id)
                      ? "bg-accent text-white border-accent"
                      : "bg-bg-secondary text-text-secondary border-border hover:text-text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-sm bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}