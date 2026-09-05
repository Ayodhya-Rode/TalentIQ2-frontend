import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-2">TalentIQ</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Practice mock interviews with real employees before it counts.
            Build confidence, one session at a time.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-text-secondary hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm text-text-secondary hover:text-accent transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="text-sm text-text-secondary hover:text-accent transition-colors">
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Get Started</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/register" className="text-sm text-text-secondary hover:text-accent transition-colors">
                Create an account
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-sm text-text-secondary hover:text-accent transition-colors">
                Log in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-text-secondary text-center">
          © {new Date().getFullYear()} TalentIQ. Built for learning, not production revenue.
        </p>
      </div>
    </footer>
  );
}