// src/components/Footer.js

import { useLanguage } from "../../contexts/LanguageContext";
import "./footer.css";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">{t("footer.company")}</h3>
        </div>

        <div className="footer-section footer-links">
          <a
            href="https://www.123fakturera.se/index.html"
            className="footer-link"
          >
            {t("nav.home")}
          </a>
          <a
            href="https://www.123fakturera.se/bestall.html"
            className="footer-link"
          >
            {t("nav.order")}
          </a>
          <a
            href="https://www.123fakturera.se/kontaktaoss.html"
            className="footer-link"
          >
            {t("nav.contactUs")}
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
