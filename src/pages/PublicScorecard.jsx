import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicScorecard } from "../api/publicApi";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-4">
      {children}
    </div>
  );
}

export default function PublicScorecard() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | notfound | error

  // Keep shared scorecards out of search engines
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Interview Scorecard | TalentIQ";

    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getPublicScorecard(token)
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
        setStatus("ok");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.response?.status === 404 ? "notfound" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "loading") {
    return (
      <Shell>
        <p className="text-text-secondary">Loading scorecard...</p>
      </Shell>
    );
  }

  if (status === "notfound" || status === "error") {
    return (
      <Shell>
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-text-primary mb-2">
            {status === "notfound"
              ? "We couldn't find this scorecard"
              : "Something went wrong"}
          </h1>
          <p className="text-sm text-text-secondary mb-4">
            {status === "notfound"
              ? "The link may be incorrect, or the owner has stopped sharing it."
              : "Please try again in a moment."}
          </p>
          <Link to="/" className="text-sm font-medium text-accent hover:underline">
            Go to {window.location.host}
          </Link>
        </div>
      </Shell>
    );
  }

  const { candidateName, score, maxScore, date, domains, interviewer } = data;

  const percent = Math.max(0, Math.min(100, (score / maxScore) * 100));

  const interviewerLine = [interviewer?.designation, interviewer?.company]
    .filter(Boolean)
    .join(" at ");

  return (
    <Shell>
      <div className="w-full max-w-xl bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-text-primary">
            Talent<span className="text-accent">IQ</span>
          </span>
          <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full">
            Recorded on TalentIQ
          </span>
        </div>

        <p className="text-xs font-medium tracking-wide text-text-secondary uppercase">
          Mock Interview Scorecard
        </p>
        <h1 className="text-2xl font-bold text-text-primary mb-3">
          {candidateName}
        </h1>

        <div className="mb-3">
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-4xl font-bold text-accent">{score}</span>
            <span className="text-base text-text-secondary">/ {maxScore}</span>
          </div>
          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <dl className="text-sm space-y-2">
          {domains?.length > 0 && (
            <div>
              <dt className="text-text-secondary mb-1">Interview focus</dt>
              <dd className="flex flex-wrap gap-2">
                {domains.map((d) => (
                  <span
                    key={d}
                    className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full"
                  >
                    {d}
                  </span>
                ))}
              </dd>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <dt className="text-text-secondary mb-0.5">Interview date</dt>
              <dd className="text-text-primary">
                {new Date(date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>

            {interviewerLine && (
              <div>
                <dt className="text-text-secondary mb-0.5">Interviewed by</dt>
                <dd className="text-text-primary">{interviewerLine}</dd>
              </div>
            )}
          </div>
        </dl>

        <p className="mt-3 pt-3 border-t border-border text-xs text-text-secondary leading-relaxed">
          Scored by a single interviewer in a one-on-one mock interview. This is
          a practice score, not a certified assessment. Want to try it yourself?
          Visit{" "}
          <Link to="/" className="font-medium text-accent hover:underline">
            {window.location.host}
          </Link>
          . To confirm this scorecard is genuine, open the original link.
        </p>
      </div>

      <Link
        to="/register"
        className="mt-3 inline-block text-sm font-medium bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg transition-colors"
      >
        Try a mock interview
      </Link>
    </Shell>
  );
}