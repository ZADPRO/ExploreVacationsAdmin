import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Card } from "primereact/card";
import axios from "axios";
import { BsBell } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { decryptAPIResponse } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



const Dashboard: React.FC = () => {
  const { t } = useTranslation("global");

  // language, flagEN, flagDE are not defined in your original snippet, so removed getFlag and handleChangeLang

  const [dashboard, setDashboard] = useState<any>({});
  const [staffnote, setStaffnote] = useState<any>({});
  const navigate = useNavigate();

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
      tabIndex: 1,
      path: "/userdetails",
      roles: ["Admin", "Employee - Tours"],
    },
    {
      key: "customizeTourBookingCount",
      title: t("dashboard.Customize Booked"),
      tabIndex: 0,
      path: "/userdetails",
      roles: ["Admin", "Employee - Tours"],
    },
    {
      key: "carBookingCount",
      title: t("dashboard.Car Booked"),
      tabIndex: 2,
      path: "/userdetails",
      roles: ["Admin", "Employee - Cars"],
    },
    {
      key: "carParkingBookingCount",
      title: t("dashboard.Parking Booked"),
      tabIndex: 3,
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
      roles: [
        "Admin",
        "Employee - Tours",
        "Employee - Cars",
        "Employee - Parking",
      ],
    },
  ];

  // Filter cards visible to current user role
  const visibleCards = cardConfigs.filter((card) =>
    card.roles.includes(userRole)
  );

  const NotificationIconWithBadge = ({ count }: { count: number }) => {
    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <BsBell className="text-4xl text-[#002f4fe0]" />
        {count > 0 && (
          <span className="absolute -top-1 right-15 bg-[#00375b] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <div className="text-2xl font-semibold p-3">
          {t("dashboard.Dashboard")}
        </div>
        <div className="flex flex-row justify-end">
          <div
            className="flex items-center w-[10%] justify-end cursor-pointer"
            onClick={() => navigate("/staffnotification")}
            title={t("dashboard.Customer Login")}
          >
            <NotificationIconWithBadge
              count={staffnote?.unReadNotifications || 0}
            />
          </div>
        </div>

        <div className="flex flex-row gap-10 px-5 justify-evenly flex-wrap">
          {visibleCards.map((card) => (
            <div
              key={card.key}
              onClick={() =>
                navigate(card.path, { state: { tabIndex: card.tabIndex } })
              }
              className="text-[#0a5c9c] cursor-pointer flex-1 min-w-[250px] max-w-[300px]"
            >
              <Card style={{ color: "#0a5c9c" }} title={card.title}>
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  <p className="font-bold">{t("dashboard.Count")}:</p>
                  {dashboard[card.key]}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  <FiArrowRight onClick={() => navigate(card.path)} />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
