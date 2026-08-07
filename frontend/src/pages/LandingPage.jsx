import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  FolderKanban,
  MoonStar,
  ArrowRight,
} from "lucide-react";

import "../styles/landing.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <header className="landing-navbar">
        <div className="landing-logo">
          <div className="landing-logo-mark">T</div>

          <span>TaskFlow</span>
        </div>

        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>

          <button
            className="landing-login-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="landing-get-started-button"
            type="button"
            onClick={() => navigate("/register")}
          >
            Get started
          </button>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-eyebrow">
            Your productivity workspace
          </span>

          <h1>
            Organize your day.
            <span> Finish what matters.</span>
          </h1>

          <p>
            TaskFlow helps you manage tasks, organize categories,
            track progress, and understand your productivity from
            one focused workspace.
          </p>

          <div className="landing-hero-actions">
            <button
              className="landing-primary-cta"
              type="button"
              onClick={() => navigate("/register")}
            >
              Start for free
              <ArrowRight size={18} />
            </button>

            <button
              className="landing-secondary-cta"
              type="button"
              onClick={() => navigate("/login")}
            >
              I already have an account
            </button>
          </div>

          <div className="landing-trust-line">
            <CheckCircle2 size={18} />

            <span>
              Simple setup. Personal workspace. No clutter.
            </span>
          </div>
        </div>

        <div className="landing-preview">
          <div className="landing-preview-glow" />

          <div className="landing-preview-card">
            <div className="preview-card-header">
              <div>
                <span>Today</span>
                <h2>Your workspace</h2>
              </div>

              <div className="preview-avatar">
                TF
              </div>
            </div>

            <div className="preview-stats">
              <article>
                <span>Total tasks</span>
                <strong>12</strong>
              </article>

              <article>
                <span>Completed</span>
                <strong>8</strong>
              </article>

              <article>
                <span>Progress</span>
                <strong>67%</strong>
              </article>
            </div>

            <div className="preview-task-list">
              <div className="preview-task-item completed">
                <div>
                  <strong>Finish API integration</strong>
                  <span>Development</span>
                </div>

                <CheckCircle2 size={20} />
              </div>

              <div className="preview-task-item">
                <div>
                  <strong>Prepare project README</strong>
                  <span>Documentation</span>
                </div>

                <span className="preview-status">
                  In progress
                </span>
              </div>

              <div className="preview-task-item">
                <div>
                  <strong>Review analytics page</strong>
                  <span>TaskFlow</span>
                </div>

                <span className="preview-status todo">
                  To do
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="landing-features-section"
        id="features"
      >
        <div className="landing-section-heading">
          <span>Built for focus</span>

          <h2>
            Everything you need to stay organized.
          </h2>

          <p>
            TaskFlow brings task management, organization,
            analytics, and personalization together in one clean
            interface.
          </p>
        </div>

        <div className="landing-features-grid">
          <article className="landing-feature-card">
            <div className="landing-feature-icon">
              <CheckCircle2 size={25} />
            </div>

            <h3>Task Management</h3>

            <p>
              Create, edit, organize, filter, and track your tasks
              with clear priorities and progress.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-icon">
              <FolderKanban size={25} />
            </div>

            <h3>Categories</h3>

            <p>
              Group related tasks into custom categories and keep
              your workspace structured.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-icon">
              <BarChart3 size={25} />
            </div>

            <h3>Analytics</h3>

            <p>
              Understand your progress with visual statistics,
              completion rates, and productivity insights.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-icon">
              <MoonStar size={25} />
            </div>

            <h3>Your Workspace</h3>

            <p>
              Personalize your profile and choose between light,
              dark, or system appearance.
            </p>
          </article>
        </div>
      </section>

      <section
        className="landing-how-section"
        id="how-it-works"
      >
        <div className="landing-section-heading">
          <span>How it works</span>

          <h2>
            From account creation to completed tasks.
          </h2>
        </div>

        <div className="landing-steps">
          <article>
            <span className="landing-step-number">01</span>
            <h3>Create your account</h3>
            <p>
              Register securely and access your personal TaskFlow
              workspace.
            </p>
          </article>

          <article>
            <span className="landing-step-number">02</span>
            <h3>Organize your work</h3>
            <p>
              Add tasks, categories, priorities, deadlines, and
              progress.
            </p>
          </article>

          <article>
            <span className="landing-step-number">03</span>
            <h3>Track your progress</h3>
            <p>
              Use your dashboard and analytics to see exactly how
              your work is progressing.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-final-cta">
        <div>
          <span>Ready to get organized?</span>

          <h2>
            Turn your plans into progress with TaskFlow.
          </h2>

          <p>
            Create your workspace and start managing what matters
            today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
        >
          Create your account
          <ArrowRight size={18} />
        </button>
      </section>

      <footer className="landing-footer">
        <div className="landing-logo">
          <div className="landing-logo-mark">T</div>
          <span>TaskFlow</span>
        </div>

        <p>
          A full-stack productivity application built with React
          and Django REST Framework.
        </p>

        <span>
          © 2026 TaskFlow
        </span>
      </footer>
    </main>
  );
}

export default LandingPage;