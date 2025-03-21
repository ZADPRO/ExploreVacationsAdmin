import React from 'react';
import { FaUserAlt } from "react-icons/fa";
import { useLocation } from 'react-router-dom';  // Import useLocation hook
import logo from "../../assets/images/logo.png";
import "./Mainheader.css";

const Mainheader: React.FC = () => {
    const location = useLocation(); 

 
    const isLoginScreen = location.pathname === "/";  

    return (
        <div>
            <div>
                <div className="primaryNav">
                    <img className='h-16' src={logo} alt="logo" />
                   
                    {!isLoginScreen && (
                        <p className="profileicon">
                            <FaUserAlt />
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Mainheader;
