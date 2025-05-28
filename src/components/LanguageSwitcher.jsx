import React from "react";

const LanguageSwitcher = ({ lang, setLang }) => {
  return (
    <div className="language-switcher">
      <img
        src="https://storage.123fakturera.no/public/flags/GB.png"
        alt="English"
        width="32"
        onClick={() => setLang("en")}
      />
      <img
        src="https://storage.123fakturera.no/public/flags/SE.png"
        alt="Swedish"
        width="32"
        onClick={() => setLang("sv")}
      />
    </div>
  );
};

export default LanguageSwitcher;
