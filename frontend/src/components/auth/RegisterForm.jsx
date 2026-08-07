import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import api from "../../api/axios";
import Button from "../common/Button";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
      non_field_errors: "",
    }));

    setMessage("");
    setMessageType("");
  };

  const getFieldError = (fieldName) => {
    const error = fieldErrors[fieldName];

    if (Array.isArray(error)) {
      return error[0];
    }

    return error || "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFieldErrors({});
    setMessage("");
    setMessageType("");

    if (formData.password.length < 8) {
      setFieldErrors({
        password: "Password must contain at least 8 characters.",
      });

      return;
    }

    if (formData.password !== formData.confirm_password) {
      setFieldErrors({
        confirm_password: "The two passwords do not match.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/auth/register/", {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      setMessage(
        "Account created successfully. Redirecting to login..."
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            registrationMessage:
              "Account created successfully. You can now log in.",
          },
        });
      }, 1200);
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData && typeof responseData === "object") {
        setFieldErrors(responseData);

        const generalError =
          responseData.detail ||
          responseData.non_field_errors?.[0];

        if (generalError) {
          setMessage(generalError);
          setMessageType("error");
        }
      } else {
        setMessage(
          "Could not create your account. Please try again."
        );
        setMessageType("error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-card register-card">
      <div className="login-heading register-heading">
        <span className="login-eyebrow">Join TaskFlow</span>

        <h2>Create your account</h2>

        <p>
          Start organizing your tasks in one focused workspace.
        </p>
      </div>

      <form
        className="login-form register-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="register-name-grid">
          <div className="form-group">
            <label htmlFor="first_name">First name</label>

            <input
              id="first_name"
              name="first_name"
              type="text"
              placeholder="Your first name"
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="given-name"
              aria-invalid={Boolean(
                getFieldError("first_name")
              )}
              required
            />

            {getFieldError("first_name") && (
              <small className="field-error">
                {getFieldError("first_name")}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last name</label>

            <input
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Your last name"
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="family-name"
              aria-invalid={Boolean(
                getFieldError("last_name")
              )}
              required
            />

            {getFieldError("last_name") && (
              <small className="field-error">
                {getFieldError("last_name")}
              </small>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email">
            Email address
          </label>

          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            aria-invalid={Boolean(getFieldError("email"))}
            required
          />

          {getFieldError("email") && (
            <small className="field-error">
              {getFieldError("email")}
            </small>
          )}
        </div>

        <div className="register-password-grid">
          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                aria-invalid={Boolean(
                  getFieldError("password")
                )}
                required
              />

              <button
                className="password-toggle-button"
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {getFieldError("password") ? (
              <small className="field-error">
                {getFieldError("password")}
              </small>
            ) : (
              <small className="password-help">
                Use at least 8 characters.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">
              Confirm password
            </label>

            <div className="password-input-wrapper">
              <input
                id="confirm_password"
                name="confirm_password"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                placeholder="Repeat your password"
                value={formData.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                aria-invalid={Boolean(
                  getFieldError("confirm_password")
                )}
                required
              />

              <button
                className="password-toggle-button"
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmation password"
                    : "Show confirmation password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {getFieldError("confirm_password") && (
              <small className="field-error">
                {getFieldError("confirm_password")}
              </small>
            )}
          </div>
        </div>

        {message && (
          <p className={`form-message ${messageType}`}>
            {message}
          </p>
        )}

        {getFieldError("non_field_errors") && (
          <p className="form-message error">
            {getFieldError("non_field_errors")}
          </p>
        )}

        <Button
          className="primary-button register-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>

      <p className="register-text">
        Already have an account?

        <button
          className="text-button"
          type="button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;