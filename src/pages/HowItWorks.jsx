import { useEffect, useRef, useState } from "react";
import { ChevronDown, UserCheck, CalendarCheck, CreditCard, Video, Award } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Create your profile",
    description:
      "Sign up, get approved by our team, and fill in your candidate profile — skills, education, and background.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a category and browse employees",
    description:
      "Choose a category like Frontend Developer or Data Analyst, and see employees who take interviews in it.",
  },
  {
    icon: CreditCard,
    title: "Book a slot and pay",
    description:
      "Pick any open slot in the next 7 days, pay a flat ₹100 fee, and your interview is instantly confirmed.",
  },
  {
    icon: Video,
    title: "Attend your mock interview",
    description:
      "Join at the scheduled time and go through a real interview conducted by a working professional.",
  },
  {
    icon: Award,
    title: "Confirm completion",
    description:
      "Both you and the interviewer confirm the session happened, closing the loop on your booking.",
  },
];

const faqs = [
  {
    q: "Is my payment safe?",
    a: "Yes. Payments are processed through Razorpay in a secure, PCI-compliant checkout flow. TalentIQ never stores your card details.",
  },
  {
    q: "What if the employee cancels my interview?",
    a: "You'll be notified immediately and given the option to rebook the same employee, choose a different one, or request a refund.",
  },
  {
    q: "How far in advance can I book?",
    a: "You can see and book open slots for the next 7 days from today. Slots further out become visible as the window rolls forward.",
  },
  {
    q: "Who are the interviewers?",
    a: "Employees who've registered and been approved by our Super Admin team, each tied to specific interview categories they're qualified in.",
  },
  {
    q: "Can I book the same employee more than once?",
    a: "Yes, up to 3 bookings with the same employee per week — useful if you want to practice multiple related categories with them.",
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-text-primary">{faq.q}</span>
        <ChevronDown
          size={18}
          className={`text-text-secondary transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="text-text-primary">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
        <span className="inline-block text-xs font-semibold tracking-wide text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
          How it works
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Five steps, start to finish</h1>
        <p className="text-text-secondary text-lg">
          Scroll down to see exactly how a booking goes from sign-up to a completed interview.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="relative">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-border" />
          <div
            className="absolute left-6 top-2 w-px bg-accent transition-all duration-500 ease-out"
            style={{
              height: `${(activeIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          <div className="flex flex-col gap-16 md:gap-24">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeIndex === i;

              return (
                <div
                  key={step.title}
                  ref={(el) => (stepRefs.current[i] = el)}
                  data-index={i}
                  className="relative flex gap-6 items-start pl-0"
                >
                  <div
                    className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-accent border-accent shadow-lg shadow-accent/30"
                        : "bg-bg-card border-border"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-white" : "text-text-secondary"} />
                  </div>

                  <div className="pt-2">
                    <span
                      className={`font-mono text-xs font-bold tracking-widest transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-text-secondary"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`text-xl font-bold mt-1 mb-2 transition-colors duration-300 ${
                        isActive ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-bg-secondary border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Frequently asked questions</h2>
          <p className="text-text-secondary text-center mb-10">
            Everything else you might want to know before booking.
          </p>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}