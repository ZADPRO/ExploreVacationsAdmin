import { FaBars } from "react-icons/fa";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineTravelExplore } from "react-icons/md";
// import { FaCarOn } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
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




interface HeaderProps {
  children: ReactNode; // Type children prop explicitly as ReactNode
}

export default function Header({ children }: HeaderProps) {
  const { t } = useTranslation("global");
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
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
      path: "/patner",
      label: t("dashboard.partner"),
      icon: <LuHandshake />,
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
      roles: [1, 2, 4, 5],
    },
    {
      path: "/settings",
      label: t("dashboard.settings"),
      icon: <IoSettingsSharp />,
      roles: [1, 2],
    },
    {
      path: "/",
      label: t("dashboard.logout"),
      icon: <FaSignOutAlt />,
      roles: [1, 2, 3, 4, 5],
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

  console.log("Role ID from localStorage:", roleId);

  const filteredRoutes = routes.filter((route: any) =>
    route.roles.includes(roleId)
  );

  return (
    <div>
      <div className="main_container">
        {!hideSidebarPaths.includes(location.pathname) && (
          <>
            <motion.div
              animate={{
                width: isOpen ? "15vw" : "5vw",
                transition: {
                  duration: 0.2,
                  type: "spring",
                  damping: 10,
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
            <main style={{ width: isOpen ? "85vw" : "95vw" }}>{children}</main>
          </>
        )}
        {hideSidebarPaths.includes(location.pathname) && (
          <main style={{ width: "100vw" }}>{children}</main>
        )}
      </div>
    </div>
  );
}
