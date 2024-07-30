import React from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";

export default function TemporaryModal(props) {
  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => props.toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Coming Soon...</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
