import { useEffect, useState } from "react";
import {
  getEmployeeDashboard,
  getEmployeeProfile,
  getMySlots,
  createSlot,
  deleteSlot,
  getEmployeeBookings,
  employeeConfirmComplete,
  cancelBooking,
  postponeBooking,
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
  X,
} from "lucide-react";
import EmployeeProfileForm from "./EmployeeProfileForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setDayOffline } from "../../api/employeeApi";
import EditEmployeeProfile from "./EditEmployeeProfile";
import FeedbackModal from "./FeedbackModal";
import ViewEmployeeProfile from "./ViewEmployeeProfile";

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

function Overview({ summary, profile, onProfileUpdated }) {
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(false);

  if (!summary) return null;

  const profileIncomplete =
    !profile?.designation || !profile?.experience || !profile?.company;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Your Stats
          </h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setViewing(true)}
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-accent hover:underline"
            >
              Edit Profile
            </button>
          </div>
        </div>

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

        {editing && (
          <EditEmployeeProfile
            onClose={() => setEditing(false)}
            onUpdated={onProfileUpdated}
          />
        )}
        {viewing && <ViewEmployeeProfile onClose={() => setViewing(false)} />}
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

function MySlots({ slots, onCreate, onDelete, onRefresh }) {
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
      <DayOfflineForm onDone={onRefresh} />
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

function CancelModal({ booking, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-text-primary mb-3">
          Cancel this interview?
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          The candidate will get a refund marked pending. This slot cannot be
          reopened.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for cancellation"
          rows={3}
          className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary"
          >
            Back
          </button>
          <button
            onClick={() => onConfirm(booking.id, reason)}
            disabled={loading || !reason.trim()}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PostponeModal({
  booking,
  availableSlots,
  onClose,
  onConfirm,
  loading,
}) {
  const [selectedSlotId, setSelectedSlotId] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-text-primary mb-3">
          Postpone to a different slot
        </h3>

        {availableSlots.length === 0 ? (
          <p className="text-sm text-text-secondary mb-4">
            You have no other open slots. Create one first from "My Slots".
          </p>
        ) : (
          <select
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary mb-4"
          >
            <option value="">Select a new slot</option>
            {availableSlots.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.startTime).toLocaleString()}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary"
          >
            Back
          </button>
          <button
            onClick={() => onConfirm(booking.id, selectedSlotId)}
            disabled={loading || !selectedSlotId}
            className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Postponing..." : "Confirm Postpone"}
          </button>
        </div>
      </div>
    </div>
  );
}

const JOIN_WINDOW_BEFORE_MIN = 10;

const canJoinNow = (booking) => {
  const now = new Date();
  const startTime = new Date(booking.slot.startTime);
  const endTime = new Date(booking.slot.endTime);
  const windowStart = new Date(
    startTime.getTime() - JOIN_WINDOW_BEFORE_MIN * 60 * 1000,
  );
  return now >= windowStart && now <= endTime;
};

function MyBookings({
  bookings,
  slots,
  onConfirm,
  confirmLoadingId,
  onCancel,
  onPostpone,
  actionLoading,
}) {
  const navigate = useNavigate();

  const [cancelTarget, setCancelTarget] = useState(null);
  const [postponeTarget, setPostponeTarget] = useState(null);
  const [now, setNow] = useState(new Date());
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  // Re-check join availability every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const canJoinNow = (booking) => {
    if (!booking?.slot?.startTime || !booking?.slot?.endTime) {
      return false;
    }

    const startTime = new Date(booking.slot.startTime);
    const endTime = new Date(booking.slot.endTime);

    const windowStart = new Date(
      startTime.getTime() - JOIN_WINDOW_BEFORE_MIN * 60 * 1000,
    );

    return now >= windowStart && now <= endTime;
  };

  const openSlotsExcludingCurrent = (currentSlotId) => {
    return slots.filter((slot) => {
      if (slot.status !== "OPEN") {
        return false;
      }

      if (slot.id === currentSlotId) {
        return false;
      }

      if (!slot.startTime) {
        return false;
      }

      // Only allow future slots for postponement
      return new Date(slot.startTime) > now;
    });
  };

  const handleCancelConfirm = async (bookingId, reason) => {
    try {
      await onCancel(bookingId, reason);
      setCancelTarget(null);
    } catch {
      // Parent already handles and displays the error
    }
  };

  const handlePostponeConfirm = async (bookingId, newSlotId) => {
    try {
      await onPostpone(bookingId, newSlotId);
      setPostponeTarget(null);
    } catch {
      // Parent already handles and displays the error
    }
  };

  if (bookings.length === 0) {
    return <p className="text-text-secondary text-sm">No bookings yet.</p>;
  }

  return (
    <>
      {/* Bookings Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[750px] text-sm">
          <thead className="bg-bg-secondary text-text-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>

              <th className="px-4 py-3 font-medium">Slot</th>

              <th className="px-4 py-3 font-medium">Status</th>

              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => {
              const joinAllowed = canJoinNow(booking);

              const availableSlots = openSlotsExcludingCurrent(
                booking.slot?.id,
              );

              return (
                <tr key={booking.id} className="border-t border-border">
                  {/* Candidate */}
                  <td className="px-4 py-3 text-text-primary">
                    <div>
                      {booking.candidateProfile?.user?.name || "—"}

                      {booking.candidateProfile?.resumeUrl && (
                        <a
                          href={booking.candidateProfile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-accent hover:underline mt-1"
                        >
                          View Resume
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Slot */}
                  <td className="px-4 py-3 text-text-secondary">
                    {booking.slot?.startTime
                      ? new Date(booking.slot.startTime).toLocaleString()
                      : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        booking.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-600"
                          : booking.status === "CONFIRMED"
                            ? "bg-blue-500/10 text-blue-600"
                            : booking.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-gray-500/10 text-text-secondary"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    {booking.status === "CONFIRMED" && (
                      <div className="flex gap-2 justify-end flex-wrap">
                        {/* Join Interview */}
                        <button
                          onClick={() =>
                            navigate(`/interview-room/${booking.id}`)
                          }
                          disabled={!joinAllowed}
                          title={
                            joinAllowed
                              ? "Join interview"
                              : `Join opens ${JOIN_WINDOW_BEFORE_MIN} minutes before start`
                          }
                          className="text-xs font-medium bg-green-500/10 hover:bg-green-500/20 text-green-600 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-green-500/10"
                        >
                          Join Interview
                        </button>

                        {/* Confirm Complete */}
                        {!booking.employeeConfirmedAt && (
                          <button
                            onClick={() => onConfirm(booking.id)}
                            disabled={confirmLoadingId === booking.id}
                            className="text-xs font-medium bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {confirmLoadingId === booking.id
                              ? "Confirming..."
                              : "Confirm Complete"}
                          </button>
                        )}

                        {/* Waiting for Candidate */}
                        {booking.employeeConfirmedAt && (
                          <span className="text-xs text-text-secondary px-2 py-1.5">
                            Waiting for candidate
                          </span>
                        )}

                        {/* Postpone */}
                        <button
                          onClick={() => setPostponeTarget(booking)}
                          disabled={actionLoading}
                          className="flex items-center gap-1 text-xs font-medium bg-bg-secondary hover:bg-bg-primary text-text-secondary px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CalendarClock size={12} />
                          Postpone
                        </button>

                        {/* Cancel */}
                        <button
                          onClick={() => setCancelTarget(booking)}
                          disabled={actionLoading}
                          className="flex items-center gap-1 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X size={12} />
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Feedback — separate condition, only for COMPLETED bookings */}
                    {booking.status === "COMPLETED" &&
                      !booking.feedbackGivenAt && (
                        <button
                          onClick={() => setFeedbackTarget(booking)}
                          className="text-xs font-medium bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-full transition-colors"
                        >
                          Give Feedback
                        </button>
                      )}
                    {booking.feedbackGivenAt && (
                      <span className="text-xs text-text-secondary">
                        Feedback: {booking.score}/10
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onClose={() => {
            if (!actionLoading) {
              setCancelTarget(null);
            }
          }}
          onConfirm={handleCancelConfirm}
          loading={actionLoading}
        />
      )}

      {/* Postpone Modal */}
      {postponeTarget && (
        <PostponeModal
          booking={postponeTarget}
          availableSlots={openSlotsExcludingCurrent(postponeTarget.slot?.id)}
          onClose={() => {
            if (!actionLoading) {
              setPostponeTarget(null);
            }
          }}
          onConfirm={handlePostponeConfirm}
          loading={actionLoading}
        />
      )}

      {/* Feedback Modal */}
      {feedbackTarget && (
        <FeedbackModal
          booking={feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
          onSubmitted={() => setFeedbackTarget(null)}
        />
      )}
    </>
  );
}

function DayOfflineForm({ onDone }) {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast.error("Pick a date first");
      return;
    }

    setLoading(true);
    try {
      const res = await setDayOffline(date);
      toast.success(res.data.message, { autoClose: 4000 });
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set day offline");
    } finally {
      setLoading(false);
      setDate("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-card border border-border rounded-xl p-5 mb-4 flex flex-wrap items-end gap-4"
    >
      <div>
        <label className="block text-xs text-text-secondary mb-1">
          Mark a whole day offline
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : "Set Day Offline"}
      </button>
      <p className="text-xs text-text-secondary w-full">
        Hides all your open slots for that day. Already-booked slots are never
        affected — no monthly limit applies here.
      </p>
    </form>
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
  const [actionLoading, setActionLoading] = useState(false);
  const [isLimitError, setIsLimitError] = useState(false);

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
      toast.error(
        err.response?.data?.message || "Failed to confirm completion",
      );
    } finally {
      setConfirmLoadingId(null);
    }
  };

  const handleCancel = async (bookingId, reason) => {
    setActionLoading(true);
    setIsLimitError(false);
    try {
      await cancelBooking(bookingId, reason);
      loadAll();
    } catch (err) {
      setIsLimitError(err.response?.status === 429);
      setError(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostpone = async (bookingId, newSlotId) => {
    setActionLoading(true);
    setIsLimitError(false);
    try {
      await postponeBooking(bookingId, newSlotId);
      loadAll();
    } catch (err) {
      setIsLimitError(err.response?.status === 429);
      setError(err.response?.data?.message || "Failed to postpone booking");
    } finally {
      setActionLoading(false);
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
              <div
                className={`mb-6 text-sm rounded px-4 py-3 border ${
                  isLimitError
                    ? "text-yellow-600 bg-yellow-500/10 border-yellow-500/30"
                    : "text-red-500 bg-red-500/10 border-red-500/30"
                }`}
              >
                {isLimitError ? "⚠ " : ""}
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

            {activeTab === "Overview" && (
              <Overview
                summary={summary}
                profile={profile}
                onProfileUpdated={loadAll}
              />
            )}
            {activeTab === "My Slots" && (
              <MySlots
                slots={slots}
                onCreate={handleCreateSlot}
                onDelete={handleDeleteSlot}
                onRefresh={loadAll}
              />
            )}
            {activeTab === "My Bookings" && (
              <MyBookings
                bookings={bookings}
                slots={slots}
                onConfirm={handleConfirmComplete}
                confirmLoadingId={confirmLoadingId}
                onCancel={handleCancel}
                onPostpone={handlePostpone}
                actionLoading={actionLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
