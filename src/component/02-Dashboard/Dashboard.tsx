import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Card } from "primereact/card";
// import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
// import CryptoJS from "crypto-js";
import { BsBell } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { decryptAPIResponse } from "../../utils";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  // const [visibleSidebar, setVisibleSidebar] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>({});
  const [staffnote, setStaffnote] = useState<any>({});
  const navigate = useNavigate();

  // Assuming 'roleId' is stored in localStorage
  const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);
  console.log('parseInt(localStorage.getItem("roleId") || "0", 10)', parseInt(localStorage.getItem("roleId") || "0", 10))

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
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data ---------->list dashboard", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data - dashboard", data);
        setDashboard(data.dashBoard[0]);
        console.log("data - dashboard", data.dashBoard[0]);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  const fetchstaffnotification = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL +
          "/notificationRoutes/staffNotificationCount",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data ---------->list fetchstaffnotification", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data - fetchstaffnotification", data);
        setStaffnote(data.Result[0]);
        console.log("data - fetchstaffnotification", data.Result[0]);
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
      title: "Tour Booked",
      path: "/userdetails",
      roles: ["Admin", "Employee - Tours"],
    },
    {
      key: "customizeTourBookingCount",
      title: "Customize Booked",
      path: "/userdetails",
      roles: ["Admin", "Employee - Tours"],
    },
    {
      key: "carBookingCount",
      title: "Car Booked",
      path: "/userdetails",
      roles: ["Admin", "Employee - Cars"],
    },
    {
      key: "carParkingBookingCount",
      title: "Parking Booked",
      path: "/userdetails",
      roles: ["Admin", "Employee - Parking"],
    },
    {
      key: "tourCount",
      title: "Tour Package",
      path: "/tour",
      roles: ["Admin", "Employee - Tours"],
    },
    {
      key: "carCount",
      title: "Car Package",
      path: "/carservices",
      roles: ["Admin", "Employee - Cars"],
    },
    {
      key: "CarParkingCount",
      title: "Parking Package",
      path: "/parking",
      roles: ["Admin", "Employee - Parking"],
    },
    {
      key: "logInClientCount",
      title: "Customer Login",
      path: "/userlist",
      roles: ["Admin", "Employee - Tours", "Employee - Cars", "Employee - Parking"],
    },
  ];

  // Filter the cards to be shown for current user
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
        <div className="text-2xl font-semibold p-3">Dashboard</div>
        <div className="flex flex-row justify-end">
          <div
            className="flex items-center w-[10%] justify-end cursor-pointer"
            onClick={() => navigate("/staffnotification")}
            title="View Notifications"
          >
            <NotificationIconWithBadge
              count={staffnote?.unReadNotifications || 0}
            />
          </div>
        </div>
        {/* <div className="flex flex-col gap-20">
          <div className="flex flex-row gap-10 px-5  justify-evenly">
         
            <div onClick={() => navigate("/userdetails")} className="text-[#0a5c9c] flex-1 h-10 cursor-pointer">
              <Card style={{ color: "#0a5c9c" }} title="Tour Booked">
                <div  className="flex  flex-row justify-between text-lg font-bold w-[50%]">
                  {" "}
                  <p className="font-bold">Count:</p>{" "}
                  {dashboard?.tourBookingCount}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/userdetails")} />{" "}
                </div>
              </Card>
            </div>
        
            <div onClick={() => navigate("/userdetails")} className="text-[#0a5c9c] cursor-pointer flex-1 h-10">
              <Card style={{ color: "#0a5c9c" }} title="Customize Booked">
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  {" "}
                  <p className="font-bold"> Count:</p>
                  {dashboard?.customizeTourBookingCount}{" "}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/userdetails")} />{" "}
                </div>
              </Card>
            </div>
       
            <div onClick={() => navigate("/userdetails")} className="text-[#0a5c9c] cursor-pointer flex-1">
              <Card style={{ color: "#0a5c9c" }} title="Car Booked">
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  {" "}
                  <p className="font-bold"> Count:</p>
                  {dashboard.carBookingCount}{" "}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/userdetails")} />{" "}
                </div>
              </Card>
            </div>
          
            <div onClick={() => navigate("/userdetails")} className="text-[#0a5c9c] cursor-pointer flex-1">
              <Card style={{ color: "#0a5c9c" }} title="Parking Booked">
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  <p className="font-bold"> Count:</p>
                  {dashboard.carParkingBookingCount}{" "}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/userdetails")} />{" "}
                </div>
              </Card>
            </div>
          </div>
          <div className="flex flex-row gap-10 px-5  justify-evenly">
         
            <div onClick={() => navigate("/tour")} className="text-[#0a5c9c] cursor-pointer flex-1">
              <Card style={{ color: "#0a5c9c" }} title="Tour Package">
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  {" "}
                  <p className="font-bold"> Count:</p>
                  {dashboard.tourCount}{" "}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/tour")} />{" "}
                </div>
              </Card>
            </div>
          
            <div onClick={() => navigate("/carservices")} className="text-[#0a5c9c] cursor-pointer flex-1">
              <Card style={{ color: "#0a5c9c" }} title="Car Package">
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  {" "}
                  <p className="font-bold"> Count:</p>
                  {dashboard.carCount}{" "}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/carservices")} />{" "}
                </div>
              </Card>
            </div>
        
            <div onClick={() => navigate("/parking")} className="text-[#0a5c9c] cursor-pointer flex-1">
              <Card style={{ color: "#0a5c9c" }} title="Parking Package">
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  {" "}
                  <p className="font-bold"> Count:</p>
                  {dashboard.CarParkingCount}{" "}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/parking")} />{" "}
                </div>
              </Card>
            </div>
        
            <div  onClick={() => navigate("/userlist")} className="text-[#0a5c9c] cursor-pointer flex-1">
              <Card style={{ color: "#0a5c9c" }} title="Customer Login">
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  {" "}
                  <p className="font-bold"> Count:</p>
                  {dashboard.logInClientCount}
                </div>
                <div className="flex w-full justify-end text-2xl font-bold cursor-pointer">
                  {" "}
                  <FiArrowRight onClick={() => navigate("/userlist")} />{" "}
                </div>
              </Card>
            </div>
          </div>
        </div> */}
        <div className="flex flex-row gap-10 px-5 justify-evenly flex-wrap">
          {visibleCards.map((card) => (
            <div
              key={card.key}
              onClick={() => navigate(card.path)}
              className="text-[#0a5c9c] cursor-pointer flex-1 min-w-[250px] max-w-[300px]"
            >
              <Card style={{ color: "#0a5c9c" }} title={card.title}>
                <div className="flex flex-row justify-between text-lg font-bold w-[50%]">
                  <p className="font-bold">Count:</p>
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
