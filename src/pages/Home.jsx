import { Link } from "react-router-dom";
import { Clock, IndianRupee, CheckCircle2 } from "lucide-react";
import homeIllustration from "/home-img2.svg";

const steps = [
  {
    num: "01",
    title: "Pick a category",
    desc: "Choose from Frontend, Backend, Data Analyst, and more.",
  },
  {
    num: "02",
    title: "Book a slot",
    desc: "See real employee availability for the next 7 days.",
  },
  {
    num: "03",
    title: "Pay & attend",
    desc: "Pay a small fee, join your mock interview, get real practice.",
  },
];

const stats = [
  { value: "₹100", label: "Per mock interview" },
  { value: "7 days", label: "Booking visibility window" },
  { value: "Real", label: "Working professionals, not bots" },
];

export default function Home() {
  return (
    <div className="text-text-primary">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-wide text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
            Mock interviews, done right
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Practice interviews with real professionals, not just a checklist.
          </h1>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            TalentIQ connects candidates with real employees for paid mock
            interviews. Book a slot in your category, pay a small fee, and walk
            into your real interview with actual practice behind you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/how-it-works"
              className="border border-border text-text-primary font-medium px-6 py-3 rounded-full hover:bg-bg-secondary transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="w-full h-[420px] md:h-[520px] rounded-2xl bg-gradient-to-br from-accent/10 via-bg-secondary to-bg-card border border-border flex items-center justify-center p-8 md:p-12">
          <img
            src={homeIllustration}
            alt="Candidate on a video interview"
            className="w-full h-full max-w-sm object-contain"
          />
        </div>
      </section>

      {/* How it works preview */}
      <section className="bg-bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">How it works</h2>
          <p className="text-text-secondary mb-10">
            Three steps, no complicated setup.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-bg-card border border-border rounded-xl p-6 hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-3xl font-bold text-accent/40">
                  {step.num}
                </span>
                <h3 className="text-lg font-semibold mt-3 mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/how-it-works"
              className="text-accent font-medium hover:underline text-sm"
            >
              See the full walkthrough →
            </Link>
          </div>
        </div>
      </section>

      {/* Why TalentIQ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
          Why candidates use TalentIQ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Clock size={22} className="text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Book in minutes</h3>
            <p className="text-text-secondary text-sm">
              See open slots for the next 7 days across every category, no back
              and forth.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <IndianRupee size={22} className="text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Pay only for what you use</h3>
            <p className="text-text-secondary text-sm">
              A flat, transparent fee per interview. No subscriptions, no hidden
              charges.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Real working professionals</h3>
            <p className="text-text-secondary text-sm">
              Interviewers are approved employees, not scripts or bots reading
              questions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-accent mb-1">{s.value}</p>
              <p className="text-text-secondary text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to practice with confidence?
        </h2>
        <p className="text-text-secondary mb-8">
          Create your account, pick a category, and book your first mock
          interview today.
        </p>
        <Link
          to="/register"
          className="inline-block bg-accent hover:bg-accent-hover text-white font-medium px-8 py-3 rounded-full transition-colors"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
