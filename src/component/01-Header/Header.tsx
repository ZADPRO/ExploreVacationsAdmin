import { FaBars } from "react-icons/fa";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineTravelExplore } from "react-icons/md";
// import { FaCarOn } from "react-icons/fa6";
import { RiParkingFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
// import { FaUsers } from "react-icons/fa";
// import { FaImages } from "react-icons/fa";
import "./Header.css";

const routes: any = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <MdSpaceDashboard />,
    roles: [1, 2, 3, 4, 5], // All roles
  },
  {
    path: "/userdetails",
    label: "User Details",
    icon: <FaUserGear />,
    roles: [1], // Admin only
  },
  // {
  //   path: "/banner",
  //   label: "Banner",
  //   icon: <FaImages />,
  //   roles: [1], // Admin only
  // },
  // {
  //   path: "/userlist",
  //   label: "User List",
  //   icon: <FaUsers />,
  //   roles: [1], // Admin only
  // },
  {
    path: "/staff",
    label: "Staff",
    icon: <HiUserAdd />,
    roles: [1], // Admin only
  },
  {
    path: "/tour",
    label: "Tours",
    icon: <MdOutlineTravelExplore />,
    roles: [1, 2], // Admin + Employee for Tours
  },
  {
    path: "/carservices",
    label: "CarRental",
    icon: <FaCar />,
    roles: [1, 4], // Admin + Employee for Cars
  },
  {
    path: "/parking",
    label: "Car Parking",
    icon: <RiParkingFill />,
    roles: [1, 5], // Admin + Employee for Parking
  },

  {
    path: "/staffnotification",
    label: "Staff Notification",
    icon: <IoMdNotifications />,
    roles: [2,4,5], // Admin + Employee for Parking
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <IoSettingsSharp />,
    roles: [1,2], // Admin only
  },
  
  {
    path: "/logout",
    label: "Logout",
    icon: <FaSignOutAlt />,
    roles: [1, 2, 3, 4, 5], // All roles
  },
];

interface HeaderProps {
  children: ReactNode; // Type children prop explicitly as ReactNode
}

export default function Header({ children }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

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
                      Admin Pannel
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
