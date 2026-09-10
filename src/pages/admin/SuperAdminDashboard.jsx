import { useState, useEffect, useRef } from "react";

import {
  getDashboardSummary,
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers,
  getCancellationWarnings,
  createSupportUser,
} from "../../api/superAdminApi";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";
import DashboardHeader from "../../components/DashboardHeader";
import { toast } from "react-toastify";
import {
  Users,
  Clock,
  XCircle,
  Layers,
  CheckCircle2,
  IndianRupee,
  Check,
  X,
  Trash2,
  Pencil,
  LifeBuoy,
} from "lucide-react";

const TABS = [
  "Overview",
  "Pending Approvals",
  "All Users",
  "Rejected Users",
  "Categories",
  "Cancellation Warnings",
  "Support Staff",
];

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
          Platform Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            icon={Clock}
            label="Pending Approvals"
            value={summary.pendingApprovals}
          />
          <SummaryCard
            icon={Layers}
            label="Total Categories"
            value={summary.totalCategories}
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Completed Interviews"
            value={summary.totalCompletedInterviews}
          />
          <SummaryCard
            icon={IndianRupee}
            label="Platform Revenue"
            value={`₹${summary.totalPlatformRevenue}`}
          />
          <SummaryCard
            icon={Users}
            label="Active Employees"
            value={summary.activeAccounts?.EMPLOYEE ?? 0}
          />
          <SummaryCard
            icon={Users}
            label="Active Candidates"
            value={summary.activeAccounts?.CANDIDATE ?? 0}
          />
        </div>
      </div>
      {summary.supportQueries && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Support Queries
          </h2>
          <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-wrap items-center gap-6">
            <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <LifeBuoy size={20} className="text-accent" />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {summary.supportQueries.total}
                </p>
                <p className="text-sm text-text-secondary">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {summary.supportQueries.solved}
                </p>
                <p className="text-sm text-text-secondary">Solved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {summary.supportQueries.pending}
                </p>
                <p className="text-sm text-text-secondary">Pending</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Rejected Accounts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            icon={XCircle}
            label="Rejected Employees"
            value={summary.rejectedAccounts?.EMPLOYEE ?? 0}
          />
          <SummaryCard
            icon={XCircle}
            label="Rejected Candidates"
            value={summary.rejectedAccounts?.CANDIDATE ?? 0}
          />
          <SummaryCard
            icon={XCircle}
            label="Rejected Recruiters"
            value={summary.rejectedAccounts?.RECRUITER ?? 0}
          />
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-text-primary mb-3">
          Platform Guidelines
        </h3>
        <ul className="text-sm text-text-secondary space-y-2 list-disc list-inside">
          <li>
            Candidates can book up to 3 slots per week with the same employee.
          </li>
          <li>Candidates can only book slots within the next 7 days.</li>
          <li>
            Booking fee is a flat ₹100; employee payout is ₹50 per completed
            interview.
          </li>
          <li>
            Interview confirmation must happen within 24 hours of the slot's end
            time.
          </li>
        </ul>
      </div>
    </div>
  );
}

function PendingApprovals({
  pendingUsers,
  onApprove,
  onReject,
  actionLoadingId,
}) {
  if (pendingUsers.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        No pending approvals right now.
      </p>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-bg-secondary text-text-secondary text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Registered</th>
            <th className="px-4 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map((u) => (
            <tr key={u.id} className="border-t border-border">
              <td className="px-4 py-3 text-text-primary">{u.name}</td>
              <td className="px-4 py-3 text-text-secondary">{u.email}</td>
              <td className="px-4 py-3 text-text-secondary">{u.role}</td>
              <td className="px-4 py-3 text-text-secondary">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onApprove(u.id)}
                    disabled={actionLoadingId === u.id}
                    className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    aria-label="Approve"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => onReject(u.id)}
                    disabled={actionLoadingId === u.id}
                    className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    aria-label="Reject"
                  >
                    <X size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AllUsers({ users, roleFilter, setRoleFilter }) {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["ALL", "EMPLOYEE", "CANDIDATE", "RECRUITER", "SUPPORT"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              roleFilter === r
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            {r.charAt(0) + r.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-text-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3 text-text-primary">{u.name}</td>
                <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                <td className="px-4 py-3 text-text-secondary">{u.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      u.status === "APPROVED"
                        ? "bg-green-500/10 text-green-600"
                        : u.status === "REJECTED"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CancellationWarnings({ warnings }) {
  if (warnings.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        No employees have hit the monthly limit.
      </p>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-bg-secondary text-text-secondary text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">
              Cancellations this month
            </th>
          </tr>
        </thead>
        <tbody>
          {warnings.map((w) => (
            <tr key={w.employeeProfileId} className="border-t border-border">
              <td className="px-4 py-3 text-text-primary">{w.name}</td>
              <td className="px-4 py-3 text-text-secondary">{w.email}</td>
              <td className="px-4 py-3">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                  {w.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium text-red-500">
                {w.cancellationsThisMonth}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Categories({ categories, onCreate, onUpdate, onDelete }) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName("");
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const submitEdit = (id) => {
    if (!editingName.trim()) return;
    onUpdate(id, editingName.trim());
    setEditingId(null);
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="flex gap-2 mb-6 max-w-md">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          Add
        </button>
      </form>

      <div className="bg-bg-card border border-border rounded-xl divide-y divide-border">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between px-4 py-3"
          >
            {editingId === cat.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitEdit(cat.id)}
                autoFocus
                className="flex-1 bg-bg-secondary border border-border rounded px-2 py-1 text-sm text-text-primary mr-2"
              />
            ) : (
              <span className="text-text-primary text-sm">{cat.name}</span>
            )}

            <div className="flex gap-2">
              {editingId === cat.id ? (
                <button
                  onClick={() => submitEdit(cat.id)}
                  className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20"
                >
                  <Check size={14} />
                </button>
              ) : (
                <button
                  onClick={() => startEdit(cat)}
                  className="p-2 rounded-full text-text-secondary hover:bg-bg-secondary"
                >
                  <Pencil size={14} />
                </button>
              )}
              <button
                onClick={() => onDelete(cat.id)}
                className="p-2 rounded-full text-red-500 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportStaff() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are both required");
      return;
    }
    setLoading(true);
    try {
      await createSupportUser(form);
      toast.success("Support account created. Credentials have been emailed.");
      setForm({ name: "", email: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create support account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-1">
        Create Support Account
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        There's no public sign-up for the Support role — only you can create
        one. A temporary password and login link will be emailed automatically.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white rounded py-2 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Support Account"}
        </button>
      </form>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabsScrollRef = useRef(null);
  const tabRefs = useRef({});
  const [summary, setSummary] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [cancellationWarnings, setCancellationWarnings] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [rejectedRoleFilter, setRejectedRoleFilter] = useState("ALL");

  const loadAll = async () => {
    try {
      const [summaryRes, pendingRes, categoriesRes] = await Promise.all([
        getDashboardSummary(),
        getPendingUsers(),
        getCategories(),
      ]);
      setSummary(summaryRes.data.data);
      setPendingUsers(pendingRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    tabRefs.current[tab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  // Load all users when the "All Users" tab is active or when the role filter changes
  useEffect(() => {
    if (activeTab !== "All Users") return;
    const params = {
      status: "APPROVED",
      ...(roleFilter !== "ALL" && { role: roleFilter }),
    };
    getAllUsers(params)
      .then((res) => setAllUsers(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load users"),
      );
  }, [activeTab, roleFilter]);

  // Load cancellation warnings when the "Cancellation Warnings" tab is active
  useEffect(() => {
    if (activeTab !== "Cancellation Warnings") return;
    getCancellationWarnings()
      .then((res) => setCancellationWarnings(res.data.data))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Failed to load cancellation warnings",
        ),
      );
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "Rejected Users") return;
    const params = {
      status: "REJECTED",
      ...(rejectedRoleFilter !== "ALL" && { role: rejectedRoleFilter }),
    };
    getAllUsers(params)
      .then((res) => setRejectedUsers(res.data.data))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Failed to load rejected users",
        ),
      );
  }, [activeTab, rejectedRoleFilter]);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      await approveUser(id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve user");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoadingId(id);
    try {
      await rejectUser(id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject user");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateCategory = async (name) => {
    try {
      const res = await createCategory({ name });
      setCategories((prev) => [...prev, res.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdateCategory = async (id, name) => {
    try {
      const res = await updateCategory(id, { name });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? res.data.data : c)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <DashboardHeader title="Super Admin Dashboard" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded px-4 py-3">
            {error}
          </div>
        )}

        <div className="relative mb-6 border-b border-border">
          <div
            ref={tabsScrollRef}
            className="flex gap-2 overflow-x-auto no-scrollbar"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                ref={(el) => (tabRefs.current[tab] = el)}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  activeTab === tab
                    ? "border-accent text-accent"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab}
                {tab === "Pending Approvals" && pendingUsers.length > 0 && (
                  <span className="ml-2 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
                    {pendingUsers.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-primary to-transparent sm:hidden" />
        </div>

        {activeTab === "Overview" && <Overview summary={summary} />}
        {activeTab === "Pending Approvals" && (
          <PendingApprovals
            pendingUsers={pendingUsers}
            onApprove={handleApprove}
            onReject={handleReject}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeTab === "All Users" && (
          <AllUsers
            users={allUsers}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />
        )}
        {activeTab === "Rejected Users" && (
          <AllUsers
            users={rejectedUsers}
            roleFilter={rejectedRoleFilter}
            setRoleFilter={setRejectedRoleFilter}
          />
        )}

        {activeTab === "Categories" && (
          <Categories
            categories={categories}
            onCreate={handleCreateCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
          />
        )}

        {activeTab === "Cancellation Warnings" && (
          <CancellationWarnings warnings={cancellationWarnings} />
        )}

        {activeTab === "Support Staff" && <SupportStaff />}
      </div>
    </div>
  );
}
