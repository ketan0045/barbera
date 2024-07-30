import React, { useState } from "react";
import GarIcon from "../../../../assets/svg/100.svg";
import FestivalsIcon from "../../../../assets/svg/FestivalsIcon.svg";
import GreetingsIcon from "../../../../assets/svg/Greetings.svg";
import PromoteService from "../../../../assets/svg/promote-service.svg";
import BellIcon from "../../../../assets/svg/primary-bell.svg";
import RemindersFullPageModal from "../../../remindersModal/remindersFullPageModal";

function PromoteScreen(props) {
  const { toggle, pastCamp } = props;
  const [openReminder, setOpenReminder] = useState(false);

  return (
    <>
      <div className="reminder-section-button-design">
        <button onClick={()=>setOpenReminder(!openReminder)}>
          <img src={BellIcon} alt="BellIcon" />
          <span>Reminders</span>
        </button>
      </div>
      <div className="promote-box-design">
        <div className="promote-box-left-alignment">
          <h1>Promote business to the Next level</h1>
          <p>Send SMS with a single click to all customers</p>
          <span>Get 30+ customized SMS template </span>
          <span>for the following events</span>
          <div className="icon-text-grid-alignment">
            <div className="icon-text-grid">
              <div className="icon-text-grid-items">
                <img src={GarIcon} alt="GarIcon" />
              </div>
              <div className="icon-text-grid-items">
                <h6>Offers</h6>
              </div>
            </div>
            <div className="icon-text-grid">
              <div className="icon-text-grid-items">
                <img src={PromoteService} alt="PromoteService" />
              </div>
              <div className="icon-text-grid-items">
                <h6>New services launch</h6>
              </div>
            </div>
            <div className="icon-text-grid">
              <div className="icon-text-grid-items">
                <img src={FestivalsIcon} alt="FestivalsIcon" />
              </div>
              <div className="icon-text-grid-items">
                <h6>Festivals</h6>
              </div>
            </div>
            <div className="icon-text-grid">
              <div className="icon-text-grid-items">
                <img src={GreetingsIcon} alt="GreetingsIcon" />
              </div>
              <div className="icon-text-grid-items">
                <h6>Greetings</h6>
              </div>
            </div>
          </div>
          <div className="two-button-alignment">
            <button onClick={toggle}>Start a new campaign</button>
            <button onClick={pastCamp}>View past campaigns</button>
          </div>
        </div>
      </div>
      {openReminder && <RemindersFullPageModal setOpenReminder={setOpenReminder} /> }
    </>
  );
}

export default PromoteScreen;
