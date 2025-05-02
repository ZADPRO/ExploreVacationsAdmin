import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Mainheader.css";

const Mainheader: React.FC = () => {
  const location = useLocation();
  const isLoginScreen = location.pathname === "/";

  // Assuming 'roleId' is stored in localStorage
  const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);

  // Map roleId to label
  const roleLabels: Record<number, string> = {
    1: "Admin",
    2: "Employee - Tours",
    4: "Employee - Cars",
    5: "Employee - Parking",
  };

  const userRole = roleLabels[roleId] || "Guest";

  return (
    <div>
      <div className="primaryNav">
        <img className="h-16" src={logo} alt="logo" />
        {!isLoginScreen && (
          <div className="profileicon">
            <FaUserAlt />

            <span className="user-role-label">{userRole}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mainheader;
