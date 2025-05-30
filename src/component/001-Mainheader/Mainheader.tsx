import React, { useState, useRef } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Mainheader.css";
import { useTranslation } from "react-i18next";
import flagEN from "../../assets/flag/english.png";
import flagDE from "../../assets/flag/german.png";
import { OverlayPanel } from 'primereact/overlaypanel';

const Mainheader: React.FC = () => {
  const location = useLocation();
  const isLoginScreen = location.pathname === "/";
  const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);

  const roleLabels: Record<number, string> = {
    1: "Admin",
    2: "Employee - Tours",
    4: "Employee - Cars",
    5: "Employee - Parking",
  };
  const userRole = roleLabels[roleId] || "Guest";

  type Language = "en" | "de";
  const initialLang = (localStorage.getItem("language") as Language) || "en";

  const [language, setLanguage] = useState<Language>(initialLang);
  const {i18n } = useTranslation("global");

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
        <img className="h-16" src={logo} alt="logo" />
        <div className="flex items-center justify-between">
          <div className="relative mr-4 ">
            <img
              src={getFlag()}
              alt="Language"
              className="h-6 w-6 rounded-full   cursor-pointer"
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
