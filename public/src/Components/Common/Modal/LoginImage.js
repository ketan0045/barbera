import React from "react";
import BarberaLogo from "../../../assets/svg/new-logo-barbera.svg";
const LoginImage = () => {
  let obj = JSON.parse(localStorage.getItem("userinfo"));
  return (
    <div>
      <div className="new-login-flow-alignment">
        <div className="new-barbera-logo-center-alignment">
          <img src={BarberaLogo} alt="BarberaLogo" />
        </div>
        <h3 className="login-footer-text">Welcome back, {obj?.Name ? obj?.Name : obj?.firstName }</h3>
      </div>
    </div>
  );
};

export default LoginImage;