import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import axios from "axios";
import { BsBell } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { decryptAPIResponse } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { t } = useTranslation("global");
  const [dashboard, setDashboard] = useState<any>({});
  const [staffnote, setStaffnote] = useState<any>({});
  const navigate = useNavigate();

  const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);

  const roleLabels: Record<number, string> = {
    1: "Admin",
    2: "Employee - Tours",
    4: "Employee - Cars",
    5: "Employee - Parking",
  };

  const userRole = roleLabels[roleId] || "Guest";

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/dashBoard",
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
            "Content-Type": "application/json",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data------------------>", data);
        setDashboard(data.dashBoard[0]);
      }
    } catch (e: any) {
      console.log("Error fetching dashboard:", e);
    }
  };

  const fetchstaffnotification = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL +
          "/notificationRoutes/staffNotificationCount",
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
            "Content-Type": "application/json",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setStaffnote(data.Result[0]);
      }
    } catch (e: any) {
      console.log("Error fetching staffnotification:", e);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchstaffnotification();
  }, []);

  const cardConfigs = [
    {
      key: "tourBookingCount",
      title: t("dashboard.Tour Booked"),
      tabIndex: 0,
      path: "/userdetails",
      roles: ["Admin", "Employee - Tours"],
    },
    {
      key: "carBookingCount",
      title: t("dashboard.Car Booked"),
      tabIndex: 1,
      path: "/userdetails",
      roles: ["Admin", "Employee - Cars"],
    },
    {
      key: "carParkingBookingCount",
      title: t("dashboard.Parking Booked"),
      tabIndex: 2,
      path: "/userdetails",
      roles: ["Admin", "Employee - Parking"],
    },
    {
      key: "tourCount",
      title: t("dashboard.Tour Package"),
      tabIndex: 0,
      path: "/tour",
      roles: ["Admin", "Employee - Tours"],
    },
    {
      key: "carCount",
      title: t("dashboard.Car Package"),
      tabIndex: 0,
      path: "/carservices",
      roles: ["Admin", "Employee - Cars"],
    },
    {
      key: "CarParkingCount",
      title: t("dashboard.Parking Package"),
      tabIndex: 0,
      path: "/parking",
      roles: ["Admin", "Employee - Parking"],
    },
    {
      key: "logInClientCount",
      tabIndex: 0,
      title: t("dashboard.Customer Login"),
      path: "/userlist",
      roles: ["Admin"],
    },
  ];

  const visibleCards = cardConfigs.filter((card) =>
    card.roles.includes(userRole)
  );

  const NotificationIconWithBadge = ({ count }: { count: number }) => {
    return (
      <div className="notification-wrapper">
        <BsBell className="notification-icon" />
        {count > 0 && (
          <span className="notification-badge">
            {count}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {t("dashboard.Dashboard")}
        </h1>
        <div
          className="notification-button"
          onClick={() => navigate("/staffnotification")}
          role="button"
          tabIndex={0}
          aria-label="View notifications"
        >
          <NotificationIconWithBadge
            count={staffnote?.unReadNotifications || 0}
          />
        </div>
      </div>

      <div className="dashboard-cards-grid">
        {visibleCards.map((card) => (
          <div
            key={card.key}
            onClick={() =>
              navigate(card.path, { state: { tabIndex: card.tabIndex } })
            }
            className="dashboard-card-wrapper"
          >
            <Card className="dashboard-card" title={card.title}>
              <div className="card-content">
                <div className="card-count-section">
                  <p className="count-label">{t("dashboard.Count")}:</p>
                  <p className="count-value">{dashboard[card.key] || 0}</p>
                </div>
                <div className="card-arrow">
                  <FiArrowRight />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;