import React from "react";
import "./TasklistProfile.scss";
import BarberaLightLogo from "../../assets/img/barbera-light.png";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function TasklistProfile() {
  const storeOnboardingTourProgress = useSelector((state) => state.onboardingTourProgressRed);
  const history = useHistory()

  const handleClick = () => {
    history.push("/barberatasklist")
  }

  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      <div className="tasklist-profile-setup">
        <div className="tasklist-profile-box">
          <div className="tasklist-profile-grid">
            <div className="tasklist-profile-grid-items">
              <div className="light-logo-center">
                <img src={BarberaLightLogo} alt="BarberaLightLogo" />
              </div>
              <div className="logo-text">
                <p>Explore barbera.io</p>
              </div>
            </div>
            <div className="tasklist-profile-grid-items">
              <h1>Your tutorial to barbera is waiting for you</h1>
              <p>Complete the tutorial to learn what more you can do with Barbera</p>
            </div>
            <div className="tasklist-profile-grid-items">
              <span>{storeOnboardingTourProgress}% Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
