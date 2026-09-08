import { useEffect, useState } from "react";
import { X, MapPin, Briefcase, GraduationCap, Code2, Star } from "lucide-react";
import { getCandidateProfileView } from "../../api/candidateApi";

export default function ViewCandidateProfile({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getCandidateProfileView();
        setData(res.data.data);
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
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition"
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

        {/* Content */}
        {!loading && !error && data && (
          <>
            {/* Profile Information */}
            <div className="space-y-3 mb-6">
              <ProfileRow
                icon={<Briefcase size={16} />}
                label="Designation"
                value={data.profile.designation}
              />

              <ProfileRow
                icon={<MapPin size={16} />}
                label="Location"
                value={data.profile.location}
              />

              <ProfileRow
                icon={<GraduationCap size={16} />}
                label="Education"
                value={data.profile.education}
              />

              <ProfileRow
                icon={<Code2 size={16} />}
                label="Skills"
                value={data.profile.skills}
              />
            </div>

            {/* Interview History */}
            {/* <div className="border-t border-border pt-5">
              <h3 className="font-semibold text-text-primary mb-3">
                Completed Interviews ({data.totalCompletedInterviews})
              </h3>

              {data.interviewHistory?.length === 0 ? (
                <p className="text-text-secondary text-sm">
                  No completed interviews yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.interviewHistory.map((h) => (
                    <div
                      key={h.bookingId}
                      className="bg-bg-secondary rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {h.employeeName || "Unknown interviewer"}
                          </p>

                          <p className="text-xs text-text-secondary mt-1">
                            {h.date
                              ? new Date(h.date).toLocaleDateString()
                              : "Date unavailable"}
                          </p>
                        </div>

                        {h.score !== null && h.score !== undefined && (
                          <span className="flex items-center gap-1 text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full whitespace-nowrap">
                            <Star size={12} />
                            {h.score}/10
                          </span>
                        )}
                      </div>

                      {h.feedback ? (
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {h.feedback}
                        </p>
                      ) : (
                        <p className="text-xs text-text-secondary italic">
                          No feedback provided.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div> */}
          </>
        )}

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition"
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