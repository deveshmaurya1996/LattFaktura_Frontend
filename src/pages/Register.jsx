import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Building,
  Loader,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { Trans } from "react-i18next";
import Footer from "../components/UnAuthComponents/Footer";
import Navbar from "../components/UnAuthComponents/Navbar";

const Register = () => {
  const { t } = useLanguage();
  const { register, authError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    address: "",
    postalNumber: "",
    city: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      setError(t("auth.businessNameRequired") || "Business name is required");
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setError(t("auth.contactPersonRequired") || "Contact person is required");
      return false;
    }
    if (!formData.address.trim()) {
      setError(t("auth.addressRequired") || "Address is required");
      return false;
    }
    if (!formData.postalNumber.trim()) {
      setError(t("auth.postalNumberRequired") || "Postal number is required");
      return false;
    }
    if (!formData.city.trim()) {
      setError(t("auth.cityRequired") || "City is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError(t("auth.emailRequired") || "Email is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError(t("auth.phoneNumberRequired") || "Phone number is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError(
        t("auth.passwordTooShort") || "Password must be at least 6 characters"
      );
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordsDoNotMatch") || "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await register(formData);
    } catch (error) {
      setError(t("auth.registrationFailed"));
      console.error("Registration failed:", error);
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
            <h2 className="auth-title">{t("auth.register")}</h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-container">
            <div className="form-group">
              <div className="input-container">
                <Building size={20} className="input-icon" />
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.businessName") || "Business Name"}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.contactPerson") || "Contact Person"}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <MapPin size={20} className="input-icon" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.address") || "Address"}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <MapPin size={20} className="input-icon" />
                <input
                  type="text"
                  name="postalNumber"
                  value={formData.postalNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.postalNumber") || "Postal Number"}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <MapPin size={20} className="input-icon" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.city") || "City"}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.enterEmail")}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <Phone size={20} className="input-icon" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.phoneNumber") || "Phone Number"}
                  required
                />
              </div>
            </div>

            <div className="note-container">
              <p className="note">{t("auth.note1")}</p>
              <p className="note">{t("auth.note2")}</p>
              <p className="note">{t("auth.note3")}</p>
              <p className="note">
                <Trans
                  i18nKey="auth.note4"
                  components={{ 1: <Link to="/terms" className="note-link" /> }}
                />
              </p>
            </div>

            <div className="form-group">
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.enterPassword")}
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

            <div className="form-group">
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t("auth.confirmPassword")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="eye-button"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`submit-button ${loading ? "loading" : ""}`}
            >
              {loading ? <Loader size={20} /> : t("auth.registerButton")}
            </button>

            {authError && <div className="error-message">{authError}</div>}

            <div className="auth-links">
              <button
                onClick={() => navigate("/login")}
                className="link-button"
              >
                {t("auth.switchToLogin")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
