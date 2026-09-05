import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-6">
      <p className="mb-4">
        Logged in as <span className="font-medium">{user?.name}</span> ({user?.role})
      </p>
      <button
        onClick={logout}
        className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}