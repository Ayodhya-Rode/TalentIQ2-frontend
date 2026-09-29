import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { getJoinToken } from "../api/interviewApi";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AiQuestionsPanel from "../components/AiQuestionsPanel";

export default function InterviewRoom() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
    const { user } = useAuth();

  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


const isEmployee = user?.role === "EMPLOYEE";
const [showAi, setShowAi] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchToken = async () => {
      try {
        const res = await getJoinToken(bookingId);

        const { token, livekitUrl } = res.data.data;

        if (!token || !livekitUrl) {
          throw new Error("Invalid interview room details");
        }

        if (isMounted) {
          setToken(token);
          setServerUrl(livekitUrl);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to join this interview",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
        Connecting to interview room...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary gap-4 px-4">
        <p className="text-red-500 text-center">
          {error}
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary gap-4">
        <p className="text-red-500">
          Interview room could not be initialized.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
  <div className="flex h-screen bg-bg-primary">
    <div className="relative min-w-0 flex-1">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={() => navigate("/dashboard")}
      >
        <VideoConference />
      </LiveKitRoom>

      {isEmployee && !showAi && (
        <button
          onClick={() => setShowAi(true)}
          className="absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white shadow hover:bg-accent-hover"
        >
          <Sparkles size={16} /> AI Questions
        </button>
      )}
    </div>

    {isEmployee && (
      <aside
        className={`${
          showAi ? "fixed inset-0 z-40 sm:static sm:w-[380px]" : "hidden"
        } shrink-0 border-l border-border bg-bg-card`}
      >
        <AiQuestionsPanel bookingId={bookingId} onClose={() => setShowAi(false)} />
      </aside>
    )}
  </div>
);
}