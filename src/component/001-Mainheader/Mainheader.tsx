import React, { useState, useRef } from "react";
import { FaUserAlt, FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Mainheader.css";
import { useTranslation } from "react-i18next";
import flagEN from "../../assets/flag/english.png";
import flagDE from "../../assets/flag/german.png";
import { OverlayPanel } from 'primereact/overlaypanel';

interface MainheaderProps {
  onToggleSidebar?: () => void; // Add this prop to trigger sidebar toggle
}

const Mainheader: React.FC<MainheaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const isLoginScreen = location.pathname === "/";
  const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);

  const roleLabels: Record<number, string> = {
    1: "Admin",
    2: "Employee - Tours",
    4: "Employee - Cars",
    5: "Employee - Parking",
    6: "Employee - Transfer",
  };
  const userRole = roleLabels[roleId] || "Guest";

  type Language = "en" | "de";
  const initialLang = (localStorage.getItem("language") as Language) || "en";

  const [language, setLanguage] = useState<Language>(initialLang);
  const { i18n } = useTranslation("global");

  const langPanelRef = useRef<OverlayPanel | null>(null);

  const handleChangeLang = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("language", lang);
    langPanelRef.current?.hide();
  };

  const getFlag = (): string => {
    switch (language) {
      case "en":
        return flagEN;
      case "de":
        return flagDE;
      default:
        return flagEN;
    }
  };

  return (
    <div>
      <div className="primaryNav">
        {/* Left Section: Toggle + Logo */}
        <div className="nav-left-section">
          {!isLoginScreen && (
            <button className="mobile-toggle-btn" onClick={onToggleSidebar}>
              <FaBars />
            </button>
          )}
          <img className="header-logo" src={logo} alt="logo" />
        </div>

        {/* Right Section: Language + Profile */}
        <div className="nav-right-section">
          <div className="language-selector">
            <img
              src={getFlag()}
              alt="Language"
              className="flag-icon"
              onClick={(e) => langPanelRef.current?.toggle(e)}
            />
            <OverlayPanel ref={langPanelRef}>
              <div
                className="flex items-center px-4 py-2 hover:bg-[#cbcbcb] cursor-pointer gap-2"
                onClick={() => handleChangeLang("en")}
              >
                <img src={flagEN} alt="English" className="w-5 h-5" />
                English
              </div>
              <div
                className="flex items-center px-4 py-2 hover:bg-[#cdcdcd] cursor-pointer gap-2"
                onClick={() => handleChangeLang("de")}
              >
                <img src={flagDE} alt="German" className="w-5 h-5" />
                German
              </div>
            </OverlayPanel>
          </div>

          {!isLoginScreen && (
            <div className="profileicon">
              <FaUserAlt />
              <span className="user-role-label">{userRole}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mainheader;