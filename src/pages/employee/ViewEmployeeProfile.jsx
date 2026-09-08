import { useEffect, useState } from "react";
import { X, MapPin, Briefcase, GraduationCap, Code2, Tag } from "lucide-react";
import { getEmployeeProfile } from "../../api/employeeApi";

export default function ViewEmployeeProfile({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getEmployeeProfile();
        setProfile(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-bg-card p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            My Profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-8 text-center">
            <p className="text-sm text-text-secondary">
              Loading profile...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-8 text-center">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Profile */}
        {!loading && !error && profile && (
          <div className="space-y-4">

            <ProfileRow
              icon={<Briefcase size={16} />}
              label="Designation"
              value={profile.designation}
            />

            <ProfileRow
              icon={<Briefcase size={16} />}
              label="Company"
              value={profile.company}
            />

            <ProfileRow
              icon={<Briefcase size={16} />}
              label="Experience"
              value={profile.experience}
            />

            <ProfileRow
              icon={<MapPin size={16} />}
              label="Location"
              value={profile.location}
            />

            <ProfileRow
              icon={<GraduationCap size={16} />}
              label="Education"
              value={profile.education}
            />

            <ProfileRow
              icon={<Code2 size={16} />}
              label="Skills"
              value={profile.skills}
            />

            {/* Categories */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  Categories
                </span>
              </div>

              {profile.categories?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((item) => (
                    <span
                      key={item.category.id}
                      className="rounded-full border border-border px-3 py-1 text-xs text-text-primary"
                    >
                      {item.category.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">—</p>
              )}
            </div>
          </div>
        )}

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-4">
      <div className="mt-0.5 text-text-secondary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-text-secondary mb-1">
          {label}
        </p>

        <p className="text-sm text-text-primary break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}