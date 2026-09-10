import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getRecruiterProfile,
  updateRecruiterProfile,
  getCandidates,
  getMyOutreachHistory,
} from "../../api/recruiterApi";
import DashboardHeader from "../../components/DashboardHeader";
import RecruiterProfileForm from "./RecruiterProfileForm";
import OutreachModal from "./OutreachModal";
import { Search, Mail, Clock, X } from "lucide-react";

const TABS = ["Browse Candidates", "Outreach History", "Profile"];
const COOLDOWN_HOURS = 24;

function BrowseCandidates({
  candidates,
  search,
  setSearch,
  onSearch,
  onReachOut,
  lastContactMap,
  onClear,
}) {
  return (
    <div>
      <form onSubmit={onSearch} className="flex gap-2 max-w-md mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by skill or designation"
          className="flex-1 bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          <Search size={16} />
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-red-500 px-3 py-2 rounded border border-border hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </form>

      {candidates.length === 0 ? (
        <p className="text-text-secondary text-sm">No candidates found.</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => {
            const lastContact = lastContactMap[c.id];
            const hoursSince = lastContact
              ? (Date.now() - new Date(lastContact).getTime()) /
                (1000 * 60 * 60)
              : null;
            const recentlyContacted =
              hoursSince !== null && hoursSince < COOLDOWN_HOURS;

            return (
              <div
                key={c.id}
                className="bg-bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-text-primary">
                        {c.user?.name}
                      </p>
                      {recentlyContacted && (
                        <span className="flex items-center gap-1 text-xs font-medium bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full">
                          <Clock size={10} />
                          Contacted recently
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">
                      {c.designation || "—"}
                    </p>
                    {c.skills && (
                      <p className="text-xs text-text-secondary mt-2">
                        <span className="font-medium text-text-primary">
                          Skills:
                        </span>{" "}
                        {c.skills}
                      </p>
                    )}
                    {c.projects?.length > 0 && (
                      <p className="text-xs text-text-secondary mt-1">
                        {c.projects.length} project(s),{" "}
                        {c.certificates?.length || 0} certificate(s)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onReachOut(c)}
                    className="flex items-center gap-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-full transition-colors flex-shrink-0"
                  >
                    <Mail size={14} />
                    Reach Out
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OutreachHistory({ logs }) {
  if (logs.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        You haven't reached out to anyone yet.
      </p>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-bg-secondary text-text-secondary text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Candidate</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Skills Required</th>
            <th className="px-4 py-3 font-medium">Sent</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-border">
              <td className="px-4 py-3 text-text-primary">
                {log.candidateProfile?.user?.name || "—"}
              </td>
              <td className="px-4 py-3 text-text-secondary">{log.role}</td>
              <td className="px-4 py-3 text-text-secondary">
                {log.skillsRequired}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {new Date(log.sentAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfileTab({ profile, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    company: profile.company || "",
    location: profile.location || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateRecruiterProfile(form);
      toast.success("Profile updated");
      setEditing(false);
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-6 max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-text-primary">Your Profile</h3>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-accent hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-text-secondary">Company:</span>{" "}
            <span className="text-text-primary">{profile.company || "—"}</span>
          </div>
          <div>
            <span className="text-text-secondary">Location:</span>{" "}
            <span className="text-text-primary">{profile.location || "—"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-card border border-border rounded-xl p-6 max-w-md space-y-4"
    >
      <div>
        <label className="block text-sm text-text-secondary mb-1">
          Company
        </label>
        <input
          name="company"
          value={form.company}
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
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="text-sm bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default function RecruiterDashboard() {
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Browse Candidates");
  const [profile, setProfile] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [outreachLogs, setOutreachLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [outreachTarget, setOutreachTarget] = useState(null);

  const checkProfile = async () => {
    try {
      const res = await getRecruiterProfile();
      setProfile(res.data.data);
      setNeedsProfile(false);
    } catch (err) {
      if (err.response?.status === 404) setNeedsProfile(true);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async (searchTerm = "") => {
    try {
      const res = await getCandidates({ search: searchTerm || undefined });
      setCandidates(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load candidates");
    }
  };

  const loadOutreachHistory = async () => {
    try {
      const res = await getMyOutreachHistory();
      setOutreachLogs(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load outreach history",
      );
    }
  };

  useEffect(() => {
    checkProfile();
  }, []);

  useEffect(() => {
    if (needsProfile) return;
    if (activeTab === "Browse Candidates") {
      loadCandidates();
      loadOutreachHistory(); // needed to compute lastContactMap for cooldown badges
    }
    if (activeTab === "Outreach History") loadOutreachHistory();
  }, [activeTab, needsProfile]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCandidates(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    loadCandidates("");
  };

  // Build a map of candidateProfileId -> most recent sentAt, for cooldown badges
  const lastContactMap = outreachLogs.reduce((acc, log) => {
    if (
      !acc[log.candidateProfileId] ||
      new Date(log.sentAt) > new Date(acc[log.candidateProfileId])
    ) {
      acc[log.candidateProfileId] = log.sentAt;
    }
    return acc;
  }, {});

  const handleOutreachSent = () => {
    setOutreachTarget(null);
    loadOutreachHistory(); // refresh so the badge shows immediately after sending
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <DashboardHeader title="Recruiter Dashboard" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {needsProfile ? (
          <RecruiterProfileForm onComplete={checkProfile} />
        ) : (
          <>
            <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-accent text-accent"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Browse Candidates" && (
              <BrowseCandidates
                candidates={candidates}
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                onReachOut={setOutreachTarget}
                lastContactMap={lastContactMap}
                onClear={handleClearSearch}
              />
            )}
            {activeTab === "Outreach History" && (
              <OutreachHistory logs={outreachLogs} />
            )}
            {activeTab === "Profile" && (
              <ProfileTab profile={profile} onUpdated={checkProfile} />
            )}
          </>
        )}
      </div>

      {outreachTarget && (
        <OutreachModal
          candidate={outreachTarget}
          onClose={handleOutreachSent}
        />
      )}
    </div>
  );
}
