import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../01-Header/Header";

import Mainheader from "../001-Mainheader/Mainheader";

import CarServices from "../05-CarServices/CarServices";
import CarRentals from "../04-CarRentals/CarRentals";
// import Torus from "../03-Tours/Tours";
import Settings from "../06-Settings/Settings";
import Login from "../../Pages/04-Loginpage/Login";
import ToursNew from "../03-Tours/ToursNew";
import UserDetails from "../05-UserDetails/UserDetails";
import Staff from "../../Pages/08-Satff/Staff";
import Parking from "../../Pages/10-Parking/Parking";
import Dashboard from "../02-Dashboard/Dashboard";
import StaffNotification from "../../Pages/12-StaffNotification/StaffNotification";
import Userlist from "../../Pages/13-UserList/Userlist";
import Banner from "../14-ImageModule/Banner";
import Patner from "../../Pages/14-Patner/Patner";
import TourAgreement from "../Pdf/TourAgreement";
// import Staff from "../../Pages/08-Satff/Staff";

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Router>
        <Mainheader />
        <Header>
          <Routes>
            <Route index path="/" element={<Login />} />
            <Route path="/tour" element={<ToursNew />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/carservices" element={<CarServices />} />
            <Route path="/carrental" element={<CarRentals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/userlist" element={<Userlist />} />
            <Route path="/banner" element={<Banner/>}/>
            <Route path="/userdetails" element={<UserDetails />} />
            <Route path="/staffnotification" element={<StaffNotification />} />
            <Route path="/parking" element={<Parking />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/patner" element={<Patner/>}/>
             <Route path="/touragreement" element={<TourAgreement/>  }/>
          </Routes>
        </Header>
      </Router>
    </div>
  );
};

export default MainRoutes;
