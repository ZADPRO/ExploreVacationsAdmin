import { ReactNode, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaUserTie, FaRetweet, FaBars } from "react-icons/fa";
import { RiParkingFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { LuHandshake } from "react-icons/lu";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { FaImages } from "react-icons/fa";
import "./Header.css";
import { useTranslation } from "react-i18next";
import { FaUserCheck } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";

interface HeaderProps {
  children: ReactNode;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  children,
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const { t } = useTranslation("global");
  const [isOpen, setIsOpen] = useState(isSidebarOpen);

  // Sync with parent state
  useEffect(() => {
    setIsOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  const toggle = () => {
    setIsOpen(!isOpen);
    onToggleSidebar();
  };

  const routes: any = [
    {
      path: "/dashboard",
      label: t("dashboard.dashboard"),
      icon: <MdSpaceDashboard />,
      roles: [1, 2, 3, 4, 5],
    },
    {
      path: "/userdetails",
      label: t("dashboard.userBookings"),
      icon: <FaUserGear />,
      roles: [1],
    },
    {
      path: "/banner",
      label: t("dashboard.banner"),
      icon: <FaImages />,
      roles: [1],
    },
    {
      path: "/userlist",
      label: t("dashboard.userList"),
      icon: <FaUsers />,
      roles: [1],
    },
    {
      path: "/staff",
      label: t("dashboard.staff"),
      icon: <FaUserTie />,
      roles: [1],
    },
    {
      path: "/StaffTranfer",
      label: t("dashboard.StaffTranfer"),
      icon: <FaRetweet />,
      roles: [1],
    },
    {
      path: "/patner",
      label: t("dashboard.partner"),
      icon: <LuHandshake />,
      roles: [1],
    },
    {
      path: "/transfer",
      label: t("dashboard.transfer"),
      icon: <FaExchangeAlt />,
      roles: [1],
    },
    {
      path: "/Dtransfer",
      label: t("dashboard.Driver transfer"),
      icon: <FaCarSide />,
      roles: [1, 2, 4],
    },
    {
      path: "/tour",
      label: t("dashboard.tours"),
      icon: <MdOutlineTravelExplore />,
      roles: [1, 2],
    },
    {
      path: "/carservices",
      label: t("dashboard.carRental"),
      icon: <FaCar />,
      roles: [1, 4],
    },
    {
      path: "/parking",
      label: t("dashboard.carParking"),
      icon: <RiParkingFill />,
      roles: [1, 5],
    },
    {
      path: "/staffnotification",
      label: t("dashboard.staffNotification"),
      icon: <IoMdNotifications />,
      roles: [1, 2, 4, 5, 6],
    },
    {
      path: "/settings",
      label: t("dashboard.settings"),
      icon: <IoSettingsSharp />,
      roles: [1],
    },
    {
      path: "/singlestaff",
      label: t("dashboard.settings"),
      icon: <FaUserCheck />,
      roles: [2, 3, 4, 5, 6],
    },
    {
      path: "/",
      label: t("dashboard.logout"),
      icon: <FaSignOutAlt />,
      roles: [1, 2, 3, 4, 5, 6],
    },
  ];

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "auto",
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const hideSidebarPaths = ["/"];
  const location = useLocation();
  const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);

  const filteredRoutes = routes.filter((route: any) =>
    route.roles.includes(roleId)
  );

  return (
    <div>
      {!hideSidebarPaths.includes(location.pathname) && (
        <div className="main_container">
          {/* Backdrop overlay when sidebar is open on mobile */}
          {isOpen && window.innerWidth <= 768 && (
            <div className="sidebar-backdrop" onClick={toggle}></div>
          )}

          {/* Sidebar */}
          <motion.div
            animate={{
              width: isOpen
                ? window.innerWidth <= 768
                  ? "60vw"
                  : window.innerWidth <= 1024
                  ? "25vw"
                  : "15vw"
                : window.innerWidth <= 768
                ? "0vw"
                : window.innerWidth <= 1024
                ? "8vw"
                : "5vw",
              transition: {
                duration: 0.3,
                type: "spring",
                damping: 12,
              },
            }}
            className="sidebar"
          >
            <div className="top_section">
              <AnimatePresence>
                {isOpen && (
                  <motion.h1
                    className="logo"
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                  >
                    Admin Panel
                  </motion.h1>
                )}
              </AnimatePresence>
              <div className="bars">
                <FaBars onClick={toggle} />
              </div>
            </div>

            <section className="routes">
              {filteredRoutes.map((route: any) => (
                <NavLink
                  to={route.path}
                  key={route.label}
                  className="link"
                  onClick={() => {
                    if (route.label === "Logout") {
                      localStorage.clear();
                      window.location.href = "/";
                    }
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth <= 768) {
                      setIsOpen(false);
                      onToggleSidebar();
                    }
                  }}
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="link_text"
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                      >
                        {route.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              ))}
            </section>
          </motion.div>

          {/* Main content */}
          <main
            className="main_content"
            style={{
              width: isOpen
                ? window.innerWidth <= 768
                  ? "40vw"
                  : window.innerWidth <= 1024
                  ? "75vw"
                  : "85vw"
                : window.innerWidth <= 768
                ? "100vw"
                : window.innerWidth <= 1024
                ? "92vw"
                : "95vw",
            }}
          >
            {children}
          </main>
        </div>
      )}

      {hideSidebarPaths.includes(location.pathname) && (
        <main style={{ width: "100vw" }}>{children}</main>
      )}
    </div>
  );
}
