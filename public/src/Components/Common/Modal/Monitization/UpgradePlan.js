import React, { useState } from "react";
import PlanDetail from "./PlanDetail";
import "./monitization.scss";
import PanaImage from "../../../../assets/img/pana.png";
export default function UpgradePlan(props) {
  const { toggle,userInfo } = props;

  return (
    <>
      <div className="modal-bluer-outer">
        <div className="trial-modal-box">
          <div className="skipcontent">
            <small className="text-right" onClick={() => toggle()}>
              Skip for now
            </small>
          </div>
          <div className="box-center-alignment">
            <p>Your trial has expired</p>
          </div>
          <div className="image-center-alignment">
            <img src={PanaImage} alt="PanaImage" />
          </div>
          <div className="child-text-alignment">
            <p>
              Please upgrade to Barbera Pro to keep using barbera. Don’t worry,
              we’ll keep your data safe and secure
            </p>
          </div>
          <div className="view-user-behaviour-alignment">
            {userInfo.role === "Operator" ||
                    userInfo?.role === "Staff" ? <span></span> : <span onClick={() => toggle("behaviour")}>View user behaviour</span>}
            <button onClick={() => toggle("upgrade")}>Upgrade</button>
          </div>
        </div>
      </div>
    </>
  );
}
