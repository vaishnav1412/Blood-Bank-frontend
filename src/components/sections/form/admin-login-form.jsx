import { useState, useEffect } from "react";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
  FiActivity,
  FiUsers,
  FiDroplet,
  FiCalendar,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./admin-login-forms.scss";

const AdminLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, admin } = response.data;

      // Store in both for flexibility
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminData", JSON.stringify(admin));
      
      toast.success("Login successful! Redirecting...");
      
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message);
      
      // Shake animation on error
      const form = document.querySelector(".login-card");
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`admin-login ${mounted ? "mounted" : ""}`}>
      {/* Background Pattern */}
      <div className="background-pattern">
        <div className="pattern-grid"></div>
        <div className="pattern-dots"></div>
      </div>

      {/* Main Container */}
      <div className="login-container">
        {/* Left Panel - Branding */}
        <div className="brand-panel">
          <div className="brand-content">
            <div className="brand-header">
              <div className="logo-wrapper">
                <div className="logo-icon">
                  <FiDroplet />
                </div>
                <span className="logo-text">BloodCare</span>
              </div>
              <div className="badge">Admin Portal</div>
            </div>

            <div className="welcome-text">
              <h1>Welcome back, Admin</h1>
              <p>Manage your blood donation platform with powerful tools and insights</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon users">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <span className="stat-value">2,847</span>
                  <span className="stat-label">Active Donors</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon drops">
                  <FiDroplet />
                </div>
                <div className="stat-info">
                  <span className="stat-value">1,234</span>
                  <span className="stat-label">Donations</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon calendar">
                  <FiCalendar />
                </div>
                <div className="stat-info">
                  <span className="stat-value">24</span>
                  <span className="stat-label">Camps</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon activity">
                  <FiActivity />
                </div>
                <div className="stat-info">
                  <span className="stat-value">89%</span>
                  <span className="stat-label">Response Rate</span>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="features-list">
              <div className="feature-item">
                <FiCheckCircle className="feature-icon" />
                <span>Real-time donor management</span>
              </div>
              <div className="feature-item">
                <FiCheckCircle className="feature-icon" />
                <span>Blood inventory tracking</span>
              </div>
              <div className="feature-item">
                <FiCheckCircle className="feature-icon" />
                <span>Camp scheduling & notifications</span>
              </div>
              <div className="feature-item">
                <FiCheckCircle className="feature-icon" />
                <span>Analytics & reporting dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="form-panel">
          <div className="login-card">
            <div className="card-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className={`form-group ${errors.email ? "error" : ""}`}>
                <label htmlFor="email">
                  <FiMail className="field-icon" />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="admin@bloodcare.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="email"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-hint">
                      <FiAlertCircle /> {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className={`form-group ${errors.password ? "error" : ""}`}>
                <label htmlFor="password">
                  <FiLock className="field-icon" />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className={errors.password ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {errors.password && (
                    <span className="error-hint">
                      <FiAlertCircle /> {errors.password}
                    </span>
                  )}
                </div>
              </div>

              {/* Options Row */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
                
                <button type="button" className="forgot-link">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="btn-icon" />
                  </>
                )}
              </button>
            </form>

            {/* Security Badge */}
            <div className="security-badge">
              <FiShield />
              <span>Secure 256-bit SSL encrypted</span>
            </div>

            {/* Quick Access */}
           
          </div>

          {/* Footer */}
          <div className="footer-text">
            <p>© 2024 BloodCare. All rights reserved.</p>
            <div className="footer-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/support">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;