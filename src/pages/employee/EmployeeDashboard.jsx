import { useEffect, useState } from "react";
import {
  getEmployeeDashboard,
  getEmployeeProfile,
  getMySlots,
  createSlot,
  deleteSlot,
  getEmployeeBookings,
  employeeConfirmComplete,
} from "../../api/employeeApi";
import DashboardHeader from "../../components/DashboardHeader";
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Wallet,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import EmployeeProfileForm from "./EmployeeProfileForm";

const TABS = ["Overview", "My Slots", "My Bookings"];

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

function Overview({ summary, profile }) {
  if (!summary) return null;

  const profileIncomplete =
    !profile?.designation || !profile?.experience || !profile?.company;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Your Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={CheckCircle2}
            label="Interviews Conducted"
            value={summary.totalInterviewsConducted}
          />
          <SummaryCard
            icon={CalendarClock}
            label="Upcoming Interviews"
            value={summary.upcomingConfirmedInterviews}
          />
          <SummaryCard
            icon={Briefcase}
            label="Slots Created"
            value={summary.totalSlotsCreated}
          />
          <SummaryCard
            icon={Wallet}
            label="Revenue Earned"
            value={`₹${summary.totalRevenueEarned}`}
          />
        </div>
      </div>

      {profileIncomplete && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-600">
          Your profile is missing some details (designation, experience, or
          company). Candidates see this on your booking card — consider
          completing it.
        </div>
      )}

      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-text-primary mb-3">
          Employee Guidelines
        </h3>
        <ul className="text-sm text-text-secondary space-y-2 list-disc list-inside">
          <li>
            You earn ₹50 for every interview marked complete by both sides.
          </li>
          <li>
            You can only confirm an interview as complete after its scheduled
            start time.
          </li>
          <li>
            Confirmation must happen within 24 hours of the slot's end time, or
            it expires.
          </li>
          <li>
            Candidates can see and book your open slots up to 7 days in advance.
          </li>
        </ul>
      </div>
    </div>
  );
}

function MySlots({ slots, onCreate, onDelete }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!date || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (end <= start) {
      setError("End time must be after start time");
      return;
    }

    onCreate({
      date,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });
    setDate("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-bg-card border border-border rounded-xl p-5 mb-6 flex flex-wrap items-end gap-4"
      >
        <div>
          <label className="block text-xs text-text-secondary mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          <Plus size={16} />
          Add Slot
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {slots.length === 0 ? (
        <p className="text-text-secondary text-sm">No slots created yet.</p>
      ) : (
        <div className="bg-bg-card border border-border rounded-xl divide-y divide-border">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-text-secondary" />
                <div>
                  <p className="text-sm text-text-primary">
                    {new Date(slot.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" – "}
                    {new Date(slot.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    slot.status === "OPEN"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }`}
                >
                  {slot.status}
                </span>
              </div>
              {slot.status === "OPEN" && (
                <button
                  onClick={() => onDelete(slot.id)}
                  className="p-2 rounded-full text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MyBookings({ bookings, onConfirm, confirmLoadingId }) {
  if (bookings.length === 0) {
    return <p className="text-text-secondary text-sm">No bookings yet.</p>;
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-bg-secondary text-text-secondary text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Candidate</th>
            <th className="px-4 py-3 font-medium">Slot</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t border-border">
              <td className="px-4 py-3 text-text-primary">
                {b.candidateProfile?.user?.name || "—"}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {new Date(b.slot.startTime).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    b.status === "COMPLETED"
                      ? "bg-green-500/10 text-green-600"
                      : b.status === "CONFIRMED"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-gray-500/10 text-text-secondary"
                  }`}
                >
                  {b.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {b.status === "CONFIRMED" && !b.employeeConfirmedAt && (
                  <button
                    onClick={() => onConfirm(b.id)}
                    disabled={confirmLoadingId === b.id}
                    className="text-xs font-medium bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                  >
                    Confirm Complete
                  </button>
                )}
                {b.employeeConfirmedAt && b.status !== "COMPLETED" && (
                  <span className="text-xs text-text-secondary">
                    Waiting for candidate
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [summary, setSummary] = useState(null);
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [confirmLoadingId, setConfirmLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);

  const loadAll = async () => {
    try {
      const profileRes = await getEmployeeProfile();
      setProfile(profileRes.data.data);
      setNeedsProfile(false);

      const [summaryRes, slotsRes, bookingsRes] = await Promise.all([
        getEmployeeDashboard(),
        getMySlots(),
        getEmployeeBookings(),
      ]);
      setSummary(summaryRes.data.data);
      setSlots(slotsRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsProfile(true);
      } else {
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      }
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateSlot = async (slotData) => {
    try {
      const res = await createSlot(slotData);
      setSlots((prev) => [...prev, res.data.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create slot");
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete slot");
    }
  };

  const handleConfirmComplete = async (bookingId) => {
    setConfirmLoadingId(bookingId);
    try {
      await employeeConfirmComplete(bookingId);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm completion");
    } finally {
      setConfirmLoadingId(null);
    }
  };

  return (
  <div className="min-h-screen bg-bg-primary">
    <DashboardHeader title="Employee Dashboard" />

    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {needsProfile ? (
        <EmployeeProfileForm onComplete={loadAll} />
      ) : (
        <>
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

          {activeTab === "Overview" && <Overview summary={summary} profile={profile} />}
          {activeTab === "My Slots" && (
            <MySlots slots={slots} onCreate={handleCreateSlot} onDelete={handleDeleteSlot} />
          )}
          {activeTab === "My Bookings" && (
            <MyBookings
              bookings={bookings}
              onConfirm={handleConfirmComplete}
              confirmLoadingId={confirmLoadingId}
            />
          )}
        </>
      )}
    </div>
  </div>
);
}