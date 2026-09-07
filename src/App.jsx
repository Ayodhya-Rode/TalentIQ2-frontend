import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InterviewRoom from "./pages/InterviewRoom";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function RoleDashboard() {
  const { user } = useAuth();

  if (user?.role === "SUPER_ADMIN") return <SuperAdminDashboard />;
  if (user?.role === "EMPLOYEE") return <EmployeeDashboard />;
  if (user?.role === "CANDIDATE") return <CandidateDashboard />;
  // Placeholder until Employee/Candidate dashboards are built
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
      Dashboard for {user?.role} coming next.
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <PublicLayout>
              <HowItWorks />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={user ? <RoleDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

        <Route
          path="/interview-room/:bookingId"
          element={user ? <InterviewRoom /> : <Navigate to="/login" />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
