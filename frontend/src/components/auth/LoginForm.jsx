import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Button from "../common/Button";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  co
  nst [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await api.post("/auth/login/", formData);

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      setMessage("Login successful.");
      setMessageType("success");

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Invalid email or password."
      );

      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-card">
      <div className="login-heading">
        <span className="login-eyebrow">Welcome back</span>

        <h2>Login to TaskFlow</h2>

        <p>Enter your account details to continue.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <div className="password-label">
            <label htmlFor="password">Password</label>

            <button className="text-button" type="button">
              Forgot password?
            </button>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <Button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {message && (
          <p className={`form-message ${messageType}`}>
            {message}
          </p>
        )}
      </form>

      <p className="register-text">
        Don&apos;t have an account?

        <Link className="text-button" to="/register">
          Create account
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;