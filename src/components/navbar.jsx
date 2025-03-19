import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import "./navbar.css";
import logo from "./logo.png";

function Navbar() {
  const [active, setActive] = useState("nav__menu");
  const [toggleIcon, setToggleIcon] = useState("nav__toggler");

  const location = useLocation(); 

  const navToggle = () => {
    setActive(active === "nav__menu" ? "nav__menu nav__active" : "nav__menu");
    setToggleIcon(
      toggleIcon === "nav_toggler" ? "nav__toggler toggle" : "nav__toggler"
    );
  };

  return (
    <nav className="nav">
      <div className="logo">
      <Link to="/criar" className="nav__link">
        <img id="logo" src={logo} alt="Logo" />
        </Link>

      </div>

    

      <div onClick={navToggle} className={toggleIcon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
}

export default Navbar;
