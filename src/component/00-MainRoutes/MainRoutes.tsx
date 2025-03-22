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

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Router>
        <Mainheader />
        <Header>
          <Routes>
            <Route index path="/" element={<Login />} />
            {/* <Route path="/tour" element={<Torus/>} /> */}
            <Route path="/tour" element={<ToursNew />} />
            <Route path="/carservices" element={<CarServices />} />
            <Route path="/carrental" element={<CarRentals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/userdetails" element={<UserDetails />} />
          </Routes>
        </Header>
      </Router>
    </div>
  );
};

export default MainRoutes;
