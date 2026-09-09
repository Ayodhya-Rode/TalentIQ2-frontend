import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getSupportDashboard,
  getQueries,
  resolveQuery,
} from "../../api/supportApi";
import DashboardHeader from "../../components/DashboardHeader";
import {
  ListChecks,
  CheckCircle2,
  Clock,
  Square,
  CheckSquare,
} from "lucide-react";

const TABS = ["Overview", "Total Queries", "Solved", "Pending"];

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-accent" />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    </div>
  );
}

function Overview({ summary }) {
  if (!summary) return null;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Query Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            icon={ListChecks}
            label="Total Queries"
            value={summary.total}
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Solved"
            value={summary.solved}
          />
          <SummaryCard icon={Clock} label="Pending" value={summary.pending} />
        </div>
      </div>
      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-text-primary mb-3">
          Support Guidelines
        </h3>
        <ul className="text-sm text-text-secondary space-y-2 list-disc list-inside">
          <li>
            Review pending queries and respond within 24 hours where possible.
          </li>
          <li>
            Add a short resolution note when marking a query resolved, if
            useful.
          </li>
          <li>
            A daily summary email is also sent to the Super Admin each evening.
          </li>
        </ul>
      </div>
    </div>
  );
}

function QueriesTable({ queries, showResolveAction, onResolve, resolvingId }) {
  if (queries.length === 0) {
    return <p className="text-text-secondary text-sm">No queries here.</p>;
  }
  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-bg-secondary text-text-secondary text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Raised By</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Subject</th>
            <th className="px-4 py-3 font-medium">Message</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {showResolveAction && (
              <th className="px-4 py-3 font-medium text-right">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {queries.map((q) => (
            <tr key={q.id} className="border-t border-border align-top">
              <td className="px-4 py-3 text-text-primary">
                {q.user?.name || "—"}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {q.user?.role || "—"}
              </td>
              <td className="px-4 py-3 text-text-primary">{q.subject}</td>
              <td
                className="px-4 py-3 text-text-secondary max-w-xs truncate"
                title={q.message}
              >
                {q.message}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    q.status === "RESOLVED"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }`}
                >
                  {q.status}
                </span>
              </td>
              {showResolveAction && (
                <td className="px-4 py-3 text-right">
                  {q.status === "OPEN" ? (
                    <button
                      onClick={() => onResolve(q.id)}
                      disabled={resolvingId === q.id}
                      title="Mark as solved"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-green-600 transition-colors disabled:opacity-50"
                    >
                      {resolvingId === q.id ? (
                        "Saving..."
                      ) : (
                        <>
                          <Square size={16} />
                          Solve
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
                      <CheckSquare size={16} />
                      Solved
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [summary, setSummary] = useState(null);
  const [allQueries, setAllQueries] = useState([]);
  const [solvedQueries, setSolvedQueries] = useState([]);
  const [pendingQueries, setPendingQueries] = useState([]);
  const [error, setError] = useState("");
  const [resolvingId, setResolvingId] = useState(null);

  const loadSummary = async () => {
    try {
      const res = await getSupportDashboard();
      setSummary(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  };

  const loadTabData = async () => {
    try {
      if (activeTab === "Total Queries") {
        const res = await getQueries();
        setAllQueries(res.data.data);
      } else if (activeTab === "Solved") {
        const res = await getQueries("RESOLVED");
        setSolvedQueries(res.data.data);
      } else if (activeTab === "Pending") {
        const res = await getQueries("OPEN");
        setPendingQueries(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load queries");
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);
  useEffect(() => {
    loadTabData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [activeTab]);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await resolveQuery(id);
      toast.success("Marked as solved");
      await Promise.all([loadSummary(), loadTabData()]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve query");
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <DashboardHeader title="Support Dashboard" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-4 py-3">
            {error}
          </div>
        )}
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

        {activeTab === "Overview" && <Overview summary={summary} />}
        {activeTab === "Total Queries" && (
          <QueriesTable
            queries={allQueries}
            showResolveAction
            onResolve={handleResolve}
            resolvingId={resolvingId}
          />
        )}
        {activeTab === "Solved" && <QueriesTable queries={solvedQueries} />}
        {activeTab === "Pending" && (
          <QueriesTable
            queries={pendingQueries}
            showResolveAction
            onResolve={handleResolve}
            resolvingId={resolvingId}
          />
        )}
      </div>
    </div>
  );
}
