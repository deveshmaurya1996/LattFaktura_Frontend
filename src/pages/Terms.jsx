import { useLanguage } from "../contexts/LanguageContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/terms.css";
import { Trans } from "react-i18next";
import Navbar from "../components/UnAuthComponents/Navbar";
import { isAuthPage } from "../constants/links";

const Terms = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="background-container">
        <img
          id="background-image"
          src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
          alt="Background"
        />
      </div>
      <div className="page-container">
        <div className="terms-page">
          <h1 className="terms-title"> {t("terms.title")}</h1>
          <button className="terms-close-button" onClick={() => navigate(-1)}>
            {t("terms.closeButton")}
          </button>
          <div className="terms-container">
            <p className="terms-text">{t("terms.intro")}</p>
            <p className="terms-text">
              <Trans i18nKey="terms.free_trial" components={{ br: <br /> }} />
            </p>
            <p className="terms-text">{t("terms.subscription")}</p>
            <p className="terms-text">{t("terms.termination_right")}</p>
            <p className="terms-text">{t("terms.no_notice")}</p>
            <p className="terms-text">{t("terms.billing")}</p>
            <p className="terms-text">{t("terms.additional_modules")}</p>

            <p className="terms-text">
              <Trans
                i18nKey="terms.registration_period"
                components={{ br: <br /> }}
              />
            </p>
            <p className="terms-text">{t("terms.offer")}</p>
            <p className="terms-text">{t("terms.intermediation")}</p>
            <p className="terms-text">{t("terms.renewal")}</p>
            <p className="terms-text">{t("terms.pricing_details")}</p>
            <p className="terms-text">{t("terms.license")}</p>
            <p className="terms-text">{t("terms.additional")}</p>
            <p className="terms-text">{t("terms.private_person")}</p>
            <p className="terms-text">{t("terms.ask_info")}</p>

            <p className="terms-text">
              <Trans
                i18nKey="terms.course_right"
                components={{
                  1: (
                    <Link
                      to="/us"
                      style={{ color: "blue", textDecoration: "none" }}
                    />
                  ),
                }}
              />
            </p>
            <p className="terms-text">
              <Trans i18nKey="terms.closing" components={{ br: <br /> }} />
            </p>
          </div>

          <button className="terms-close-button" onClick={() => navigate(-1)}>
            {t("terms.closeButton")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Terms;
