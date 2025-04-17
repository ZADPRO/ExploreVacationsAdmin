import { FaBars } from "react-icons/fa";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineTravelExplore } from "react-icons/md";
// import { FaCarOn } from "react-icons/fa6";
// import { RiParkingFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
// import { HiUserAdd } from "react-icons/hi";
import "./Header.css";

const routes: any = [
  {
    path: "/userdetails",
    label: "User Details",
    icon: <FaUserGear />,
  },
  // {
  //   path: "/staff",
  //   label: "Staff",
  //   icon: <HiUserAdd />,
  // },
  {
    path: "/tour",
    label: "Tours",
    icon: <MdOutlineTravelExplore />,
  },
  {
    path: "/carservices",
    label: "CarRental",

    icon: <FaCar />,
  },
  // {
  //   path: "/parking",
  //   label: "Car Parking",

  //   icon: <RiParkingFill />,
  // },
  {
    path: "/settings",
    label: "Settings",
    icon: <IoSettingsSharp />,
  },

  {
    path: "/logout",
    label: "Logout",
    icon: <FaSignOutAlt />,
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
                      Dashboard
                    </motion.h1>
                  )}
                </AnimatePresence>
                <div className="bars">
                  <FaBars onClick={toggle} />
                </div>
              </div>

              <section className="routes">
                {routes.map((route: any) => (
                  <NavLink
                    to={route.path}
                    key={route.label} // Use `label` instead of `name` to avoid undefined
                    className="link"
                    onClick={() => {
                      if (route.label === "Logout") {
                        localStorage.clear();
                        window.location.href = "/"; // Redirect to login page
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
