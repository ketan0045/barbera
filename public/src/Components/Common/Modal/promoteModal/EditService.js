import React from "react";
import "./promotemodal.scss";
import CloseIcon from "../../../../assets/svg/new-close.svg";
export default function EditService() {
  return (
    <div>
      <div className="add-service-mini-modal">
        <div className="customer-details-modal-box-design">
          <div className="select-customers-header-design">
            <div>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
            <h1>Select customers</h1>
          </div>
          <div className="customer-details-body-modal-alignment">
            <div className="first-section-alignment"></div>
            <div className="customer-details-all-box-alignment"></div>
            <div className="customer-details-footer-alignment">
              {/* <div>
                <span>400 customers selected</span>
              </div> */}
              <div>
                <button>Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
