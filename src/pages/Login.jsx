import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import Navbar from "../components/UnAuthComponents/Navbar";
import Footer from "../components/UnAuthComponents/Footer";

const Login = () => {
  const { t } = useLanguage();
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError(t("auth.loginFailed"));
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="auth-form">
          <div className="auth-header">
            <h2 className="auth-title">{t("auth.login")}</h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-container">
            <div className="form-group">
              <label className="form-label">{t("auth.enterEmail")}</label>
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.email")}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t("auth.enterPassword")}</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`submit-button ${loading ? "loading" : ""}`}
            >
              {loading ? t("auth.loading") : t("auth.loginButton")}
            </button>

            {authError && <div className="error-message">{authError}</div>}

            <div className="auth-links">
              <button
                onClick={() => navigate("/register")}
                className="link-button"
              >
                {t("auth.switchToRegister")}
              </button>
              <button
                onClick={() => navigate("/forgot-password")}
                className="link-button forgot-password"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
