import LoginForm from "../components/auth/LoginForm";
import "../styles/login.css";

function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="brand-badge">TaskFlow</div>

        <h1>
          Organize your tasks.
          <span> Focus on what matters.</span>
        </h1>

        <p>
          Plan your work, track your progress, and keep every task under
          control from one energetic workspace.
        </p>

        <div className="brand-stats">
          <div>
            <strong>Simple</strong>
            <span>Task management</span>
          </div>

          <div>
            <strong>Secure</strong>
            <span>Private workspace</span>
          </div>

          <div>
            <strong>Focused</strong>
            <span>Clear progress</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <LoginForm />
      </section>
    </main>
  );
}

export default LoginPage;