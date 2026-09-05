import { Target, Users, Lightbulb } from "lucide-react";
import aboutIllustration from "/about-img2.svg";

export default function About() {
  return (
    <div className="text-text-primary">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <span className="inline-block text-xs font-semibold tracking-wide text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
          About TalentIQ
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Interview practice shouldn't be a guessing game.
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          Most candidates walk into interviews having only practiced alone —
          reading questions off a list, talking to a mirror, or worse, not
          practicing at all. TalentIQ exists to close that gap.
        </p>
      </section>

      <section className="bg-bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              The problem we saw
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Mock interview platforms are either too expensive, too generic, or
              built around long-term coaching packages nobody has time for
              before an actual interview next week.
            </p>
            <p className="text-text-secondary leading-relaxed">
              We built a simple booking marketplace instead — pick a category,
              book a real person's time, pay a flat fee, done.
            </p>
          </div>
          <div className="w-full h-[420px] md:h-[520px] rounded-2xl bg-gradient-to-br from-accent/10 via-bg-secondary to-bg-card border border-border flex items-center justify-center p-8 md:p-12">
            <img
              src={aboutIllustration}
              alt="Candidate on a video interview"
              className="w-full h-full max-w-sm object-contain"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
          What we believe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-bg-card border border-border rounded-xl p-6 hover:border-accent hover:-translate-y-1 transition-all duration-300">
            <Target size={24} className="text-accent mb-3" />
            <h3 className="font-semibold mb-2">Practice should be practical</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              A single well-run mock interview beats ten hours of theory videos.
            </p>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-6 hover:border-accent hover:-translate-y-1 transition-all duration-300">
            <Users size={24} className="text-accent mb-3" />
            <h3 className="font-semibold mb-2">Real people, real feedback</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Every interviewer on TalentIQ is an approved, working
              professional.
            </p>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-6 hover:border-accent hover:-translate-y-1 transition-all duration-300">
            <Lightbulb size={24} className="text-accent mb-3" />
            <h3 className="font-semibold mb-2">Simple, transparent pricing</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              One flat fee per interview. No subscriptions, no surprise charges.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-bg-secondary border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Still growing</h2>
          <p className="text-text-secondary leading-relaxed">
            TalentIQ is an early-stage platform, built and refined step by step.
            New categories, features, and improvements are added regularly based
            on what candidates and employees actually need.
          </p>
        </div>
      </section>
    </div>
  );
}
