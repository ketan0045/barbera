import React from "react";
import "./welcomemodal.scss";
import WelcomeImage from "../../../assets/img/rafiki.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setOnboardingCurrentTooltip,
  setOnboardingStatus,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../../redux/actions/onboardingActions";
import { onboardingStatusReducer } from "../../../redux/reducers/onboardingReducer";
import Auth from "../../../helpers/Auth";
import { ApiPost } from "../../../helpers/API/ApiData";

export default function WelcomeModal() {
  const userInfo = Auth.getUserDetail();
  const dispatch = useDispatch();
  const handleStartTour = async () => {
    // dispatch(setOnboardingStatus(false));
    // dispatch(setOnboardingTourProgress(33));
    let onboardingCloseWelcomeData = {
      companyId: userInfo?.companyId,
      onboardProcess: [
        {
          onboardingStatus: true,
          onboardingCompleted: false,
          onboardingTourProgress: 33,
        },
      ],
    };
    await ApiPost("setting/", onboardingCloseWelcomeData)
      .then((res) => {
        dispatch(setOnboardingTourStatus(false));
        dispatch(setOnboardingTooltipStatus(false));
        dispatch(setOnboardingTourProgress(33))
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="welcome-modal-design-blur">
        <div className="welcome-modal-center-align">
          <div className="welcome-text-barbera">
            <h1>Welcome to Barbera</h1>
            <div className="welcome-image">
              <img src={WelcomeImage} alt="WelcomeImage" />
            </div>
          </div>
          <div className="welcome-body">
            <div className="welcome-text-center">
              <p>Hello there A quick guide/tutorial Something smthg</p>
            </div>
          </div>
          <div className="welcome-footer">
            <Link to="/barberatasklist">
              <button onClick={handleStartTour}>Start a tutorial</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
