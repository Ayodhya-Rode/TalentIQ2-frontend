import { useEffect, useState } from "react";
import {
  getCandidateDashboard,
  getCandidateProfile,
  getEmployeesByCategory,
  createBookingOrder,
  verifyBookingPayment,
  getMyBookings,
  candidateConfirmComplete,
  rebookSameEmployee,
  getEmployeeOpenSlots,
  requestRefund as apiRequestRefund,
} from "../../api/candidateApi";
import { getCategories } from "../../api/categoryApi";
import DashboardHeader from "../../components/DashboardHeader";
import CandidateProfileForm from "./CandidateProfileForm";
import { CheckCircle2, CalendarClock, Wallet, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditCandidateProfile from "./EditCandidateProfile";
import ViewCandidateProfile from "./ViewCandidateProfile";

const TABS = ["Overview", "Book Interview", "My Bookings"];

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

function Overview({ summary, onProfileUpdated }) {
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(false);

  if (!summary) return null;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Your Stats</h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            icon={CheckCircle2}
            label="Interviews Attended"
            value={summary.totalInterviewsAttended}
          />
          <SummaryCard
            icon={CalendarClock}
            label="Upcoming Interviews"
            value={summary.upcomingConfirmedInterviews}
          />
          <SummaryCard icon={Wallet} label="Total Paid" value={`₹${summary.totalAmountPaid}`} />
        </div>

        {editing && (
          <EditCandidateProfile onClose={() => setEditing(false)} onUpdated={onProfileUpdated} />
        )}
        {viewing && <ViewCandidateProfile onClose={() => setViewing(false)} />}
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-text-primary mb-3">Booking Guidelines</h3>
        <ul className="text-sm text-text-secondary space-y-2 list-disc list-inside">
          <li>You can see and book slots up to 7 days in advance.</li>
          <li>You can book at most 3 slots per week with the same employee.</li>
          <li>Each booking costs a flat ₹100, paid securely via Razorpay.</li>
          <li>Confirm your interview as complete once it happens — both sides must confirm.</li>
        </ul>
      </div>
    </div>
  );
}

function BookInterview({ onBookingConfirmed }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setEmployees([]);
    setError("");

    if (!categoryId) return;

    setLoadingEmployees(true);
    try {
      const res = await getEmployeesByCategory(categoryId);
      setEmployees(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleBookSlot = async (slotId) => {
    setError("");
    setBookingSlotId(slotId);

    try {
      const orderRes = await createBookingOrder({ slotId });
      const { bookingId, razorpayOrderId, amount, currency } = orderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "TalentIQ",
        description: "Mock Interview Booking",
        handler: async (response) => {
          try {
            await verifyBookingPayment({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onBookingConfirmed();
            handleCategoryChange(selectedCategory);
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed");
          } finally {
            setBookingSlotId(null);
          }
        },
        modal: {
          ondismiss: () => setBookingSlotId(null),
        },
        theme: { color: "#2f4fd1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking order");
      setBookingSlotId(null);
    }
  };

  return (
    <div>
      <div className="max-w-sm mb-6">
        <label className="block text-sm text-text-secondary mb-1">Select a category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Choose category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {loadingEmployees && <p className="text-text-secondary text-sm">Loading employees...</p>}

      {!loadingEmployees && selectedCategory && employees.length === 0 && (
        <p className="text-text-secondary text-sm">No employees available in this category yet.</p>
      )}

      <div className="space-y-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-text-primary">{emp.user?.name}</p>
                <p className="text-sm text-text-secondary">
                  {emp.designation || "—"}
                  {emp.company ? ` at ${emp.company}` : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-4 text-xs text-text-secondary">
              {emp.experience && (
                <p><span className="text-text-primary font-medium">Experience:</span> {emp.experience}</p>
              )}
              {emp.location && (
                <p><span className="text-text-primary font-medium">Location:</span> {emp.location}</p>
              )}
              {emp.education && (
                <p><span className="text-text-primary font-medium">Education:</span> {emp.education}</p>
              )}
              {emp.skills && (
                <p><span className="text-text-primary font-medium">Skills:</span> {emp.skills}</p>
              )}
            </div>

            {emp.slots.length === 0 ? (
              <p className="text-xs text-text-secondary">No open slots in the next 7 days.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {emp.slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleBookSlot(slot.id)}
                    disabled={bookingSlotId === slot.id}
                    className="flex items-center gap-1.5 text-xs font-medium bg-bg-secondary hover:bg-accent hover:text-white text-text-secondary px-3 py-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Clock size={12} />
                    {new Date(slot.startTime).toLocaleDateString()}{" "}
                    {new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RebookModal({ booking, availableSlots, onClose, onConfirm, loading }) {
  const [selectedSlotId, setSelectedSlotId] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-text-primary mb-3">Rebook with same employee</h3>
        <p className="text-sm text-text-secondary mb-4">
          No new payment needed — your existing ₹{booking.amount} will be used for the new slot.
        </p>

        {availableSlots.length === 0 ? (
          <p className="text-sm text-text-secondary mb-4">
            This employee has no other open slots right now. Try requesting a refund instead.
          </p>
        ) : (
          <select
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text-primary mb-4"
          >
            <option value="">Select a slot</option>
            {availableSlots.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.startTime).toLocaleString()}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="text-sm text-text-secondary px-4 py-2 rounded hover:bg-bg-secondary">
            Back
          </button>
          <button
            onClick={() => onConfirm(booking.id, selectedSlotId)}
            disabled={loading || !selectedSlotId}
            className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Rebooking..." : "Confirm Rebook"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewFeedbackModal({ booking, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-text-primary mb-1">Interview Feedback</h3>
        <p className="text-sm text-text-secondary mb-4">
          From {booking.employeeProfile?.user?.name || "the interviewer"}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-accent">{booking.score}/10</span>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          {booking.feedback || "No written feedback provided."}
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm border border-border rounded-lg px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

const JOIN_WINDOW_BEFORE_MIN = 10;

function MyBookings({
  bookings,
  onConfirm,
  confirmLoadingId,
  onRebook,
  onRefund,
  actionLoading,
  getEmployeeSlots,
}) {
  const navigate = useNavigate();

  const [rebookTarget, setRebookTarget] = useState(null);
  const [rebookSlots, setRebookSlots] = useState([]);
  const [rebookLoading, setRebookLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const [feedbackViewTarget, setFeedbackViewTarget] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const canJoinNow = (booking) => {
    if (!booking?.slot?.startTime || !booking?.slot?.endTime) return false;
    const startTime = new Date(booking.slot.startTime);
    const endTime = new Date(booking.slot.endTime);
    const windowStart = new Date(startTime.getTime() - JOIN_WINDOW_BEFORE_MIN * 60 * 1000);
    return now >= windowStart && now <= endTime;
  };

  const openRebookModal = async (booking) => {
    setRebookLoading(true);
    setRebookTarget(booking);
    setRebookSlots([]);

    try {
      const slots = await getEmployeeSlots(booking.employeeProfile.id);
      const futureSlots = (slots || []).filter(
        (slot) => slot.status === "OPEN" && new Date(slot.startTime) > new Date()
      );
      setRebookSlots(futureSlots);
    } finally {
      setRebookLoading(false);
    }
  };

  const handleRebookConfirm = async (bookingId, newSlotId) => {
    if (!newSlotId) return;
    await onRebook(bookingId, newSlotId);
    setRebookTarget(null);
    setRebookSlots([]);
  };

  const handleCloseRebook = () => {
    if (actionLoading || rebookLoading) return;
    setRebookTarget(null);
    setRebookSlots([]);
  };

  if (bookings.length === 0) {
    return <p className="text-text-secondary text-sm">No bookings yet.</p>;
  }

  return (
    <>
      <div className="bg-bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-bg-secondary text-text-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Slot</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => {
              const joinAllowed = canJoinNow(booking);

              return (
                <tr key={booking.id} className="border-t border-border">
                  <td className="px-4 py-3 text-text-primary">
                    {booking.employeeProfile?.user?.name || "—"}
                  </td>

                  <td className="px-4 py-3 text-text-secondary">
                    {booking.slot?.startTime ? new Date(booking.slot.startTime).toLocaleString() : "—"}
                  </td>

                  <td className="px-4 py-3 text-text-secondary">₹{booking.amount}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
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

                      {booking.status === "CANCELLED" && booking.refundStatus === "PROCESSED" && (
                        <span className="text-xs text-green-600">Refunded</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {/* CONFIRMED */}
                    {booking.status === "CONFIRMED" && (
                      <div className="flex gap-2 justify-end flex-wrap">
                        <button
                          onClick={() => navigate(`/interview-room/${booking.id}`)}
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

                        {!booking.candidateConfirmedAt && (
                          <button
                            onClick={() => onConfirm(booking.id)}
                            disabled={confirmLoadingId === booking.id}
                            className="text-xs font-medium bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {confirmLoadingId === booking.id ? "Confirming..." : "Confirm Complete"}
                          </button>
                        )}

                        {booking.candidateConfirmedAt && (
                          <span className="text-xs text-text-secondary px-2 py-1.5">
                            Waiting for employee
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Feedback — only for COMPLETED, separate from CONFIRMED block */}
                    {booking.status === "COMPLETED" && booking.feedbackGivenAt && (
                      <button
                        onClick={() => setFeedbackViewTarget(booking)}
                        className="text-xs font-medium bg-accent/10 hover:bg-accent/20 text-accent px-3 py-1.5 rounded-full transition-colors"
                      >
                        View Feedback
                      </button>
                    )}

                    {/* CANCELLED + PENDING REFUND */}
                    {booking.status === "CANCELLED" && booking.refundStatus === "PENDING" && (
                      <div className="flex gap-2 justify-end flex-wrap">
                        <button
                          onClick={() => openRebookModal(booking)}
                          disabled={actionLoading || rebookLoading}
                          className="flex items-center gap-1 text-xs font-medium bg-bg-secondary hover:bg-bg-primary text-text-secondary px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CalendarClock size={12} />
                          {rebookLoading && rebookTarget?.id === booking.id ? "Loading..." : "Rebook Same Employee"}
                        </button>

                        <button
                          onClick={() => onRefund(booking.id)}
                          disabled={actionLoading}
                          className="flex items-center gap-1 text-xs font-medium bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Wallet size={12} />
                          Request Refund
                        </button>
                      </div>
                    )}

                    {/* CANCELLED + FAILED REFUND */}
                    {booking.status === "CANCELLED" && booking.refundStatus === "FAILED" && (
                      <button
                        onClick={() => onRefund(booking.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-1 text-xs font-medium bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                      >
                        <Wallet size={12} />
                        Retry Refund
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rebookTarget && (
        <RebookModal
          booking={rebookTarget}
          availableSlots={rebookSlots}
          onClose={handleCloseRebook}
          onConfirm={handleRebookConfirm}
          loading={actionLoading || rebookLoading}
        />
      )}

      {feedbackViewTarget && (
        <ViewFeedbackModal
          booking={feedbackViewTarget}
          onClose={() => setFeedbackViewTarget(null)}
        />
      )}
    </>
  );
}

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [summary, setSummary] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [confirmLoadingId, setConfirmLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadAll = async () => {
    try {
      await getCandidateProfile();
      setNeedsProfile(false);

      const [summaryRes, bookingsRes] = await Promise.all([getCandidateDashboard(), getMyBookings()]);
      setSummary(summaryRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsProfile(true);
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      }
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleConfirmComplete = async (bookingId) => {
    setConfirmLoadingId(bookingId);
    setError("");
    try {
      await candidateConfirmComplete(bookingId);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm completion");
    } finally {
      setConfirmLoadingId(null);
    }
  };

  const handleRebook = async (bookingId, newSlotId) => {
    setActionLoading(true);
    try {
      await rebookSameEmployee(bookingId, newSlotId);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to rebook");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async (bookingId) => {
    setActionLoading(true);
    try {
      await apiRequestRefund(bookingId);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process refund");
    } finally {
      setActionLoading(false);
    }
  };

  const getEmployeeSlotsForRebook = async (employeeProfileId) => {
    try {
      const res = await getEmployeeOpenSlots(employeeProfileId);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load employee's slots");
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <DashboardHeader title="Candidate Dashboard" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {needsProfile ? (
          <CandidateProfileForm onComplete={loadAll} />
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

            {activeTab === "Overview" && <Overview summary={summary} onProfileUpdated={loadAll} />}
            {activeTab === "Book Interview" && <BookInterview onBookingConfirmed={loadAll} />}
            {activeTab === "My Bookings" && (
              <MyBookings
                bookings={bookings}
                onConfirm={handleConfirmComplete}
                confirmLoadingId={confirmLoadingId}
                onRebook={handleRebook}
                onRefund={handleRefund}
                actionLoading={actionLoading}
                getEmployeeSlots={getEmployeeSlotsForRebook}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}