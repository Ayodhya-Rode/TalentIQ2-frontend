import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
} from "../../api/candidateApi";
import { FileText, Upload } from "lucide-react";

export default function EditCandidateProfile({ onClose, onUpdated }) {
  const [form, setForm] = useState({
    education: "",
    skills: "",
    location: "",
    designation: "",
  });

  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

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

        setResumeUrl(profile.resumeUrl || null);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    setUploadingResume(true);

    try {
      const res = await uploadResume(resumeFile);

      setResumeUrl(res.data.data.resumeUrl);
      setResumeFile(null);

      toast.success("Resume uploaded successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to upload resume"
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await updateCandidateProfile(form);

      toast.success("Profile updated successfully");

      onUpdated();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-text-secondary text-sm">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Designation
              </label>

              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Education
              </label>

              <input
                name="education"
                value={form.education}
                onChange={handleChange}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Skills
              </label>

              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
<div className="border-t border-border pt-4">
  <label className="block text-sm text-text-secondary mb-2">
    Resume (PDF, optional, max 5MB)
  </label>

  {resumeUrl && (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-accent hover:underline mb-3"
    >
      <FileText size={14} />
      View current resume
    </a>
  )}

  <div className="flex items-center gap-3 flex-wrap">
    <label
      htmlFor="resume-upload"
      className="cursor-pointer flex items-center gap-2 text-sm font-medium bg-bg-secondary hover:bg-bg-primary border border-border text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg transition-colors"
    >
      <FileText size={14} />
      {resumeFile ? resumeFile.name : "Choose PDF"}
    </label>

    <input
      id="resume-upload"
      type="file"
      accept="application/pdf"
      onChange={handleFileSelect}
      className="hidden"
    />

    {resumeFile && (
      <button
        type="button"
        onClick={handleResumeUpload}
        disabled={uploadingResume}
        className="flex items-center gap-1 text-xs font-medium bg-accent hover:bg-accent-hover text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      >
        <Upload size={12} />
        {uploadingResume ? "Uploading..." : "Upload"}
      </button>
    )}
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