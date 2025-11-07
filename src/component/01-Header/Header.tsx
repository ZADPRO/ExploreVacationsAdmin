import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaUserTie, FaRetweet } from "react-icons/fa";
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
import { FaUserCheck } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "./Header.css";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export default function Header({ children, sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { t } = useTranslation("global");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const location = useLocation();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-close sidebar on mobile when route changes
      if (width < 768) {
        setIsOpen(false);
      }
      // Auto-open on desktop
      if (width >= 1024) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location]);

  const toggle = () => setIsOpen(!isOpen);

  const routes = [
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
  const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);
  const filteredRoutes = routes.filter((route) =>
    route.roles.includes(roleId)
  );

  // Get sidebar width based on screen size
  const getSidebarWidth = () => {
    if (isMobile) {
      return isOpen ? "280px" : "0px";
    }
    if (isTablet) {
      return isOpen ? "220px" : "70px";
    }
    return isOpen ? "240px" : "80px";
  };

  // Get main content margin based on screen size
  const getMainContentMargin = () => {
    if (isMobile) return "0";
    if (isTablet) return isOpen ? "220px" : "70px";
    return isOpen ? "240px" : "80px";
  };

  return (
    <div className="layout-wrapper">
      {!hideSidebarPaths.includes(location.pathname) && (
        <>
          {/* Mobile Overlay */}
          {isMobile && isOpen && (
            <div className="sidebar-overlay" onClick={toggle}></div>
          )}

          {/* Sidebar */}
          <motion.div
            animate={{
              width: getSidebarWidth(),
              transition: {
                duration: 0.3,
                type: "spring",
                damping: 12,
              },
            }}
            className={`sidebar ${isMobile ? "sidebar-mobile" : ""} ${
              isOpen ? "sidebar-open" : ""
            }`}
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
                {isMobile && isOpen ? (
                  <IoClose onClick={toggle} size={24} />
                ) : (
                  <FaBars onClick={toggle} />
                )}
              </div>
            </div>

            <section className="routes">
              {filteredRoutes.map((route) => (
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
                    if (isMobile) {
                      setIsOpen(false);
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

          {/* Main Content */}
          <main
            className="main-content"
            style={{
              marginLeft: getMainContentMargin(),
            }}
          >
            {children}
          </main>
        </>
      )}

      {hideSidebarPaths.includes(location.pathname) && (
        <main className="main-content-full">{children}</main>
      )}
    </div>
  );
}