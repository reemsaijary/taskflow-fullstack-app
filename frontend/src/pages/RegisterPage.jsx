import RegisterForm from "../components/auth/RegisterForm";

import "../styles/login.css";

function RegisterPage() {
  return (
    <main className="login-page register-page">
      <section className="login-brand register-brand">
        <div className="login-brand-content register-brand-content">
          <span className="brand-badge">TaskFlow</span>

          <h1 className="register-simple-title">
            Create. Organize.
            <span>Stay focused.</span>
          </h1>

          <p className="register-brand-description">
            Build your personal workspace, organize your tasks,
            and track your progress from one simple place.
          </p>

          <div className="register-brand-note">
            <span className="register-note-icon">✓</span>

            <p>
              Simple, private, and designed to keep your work clear.
            </p>
          </div>
        </div>
      </section>

      <section className="login-form-side register-form-side">
        <RegisterForm />
      </section>
    </main>
  );
}

export default RegisterPage;