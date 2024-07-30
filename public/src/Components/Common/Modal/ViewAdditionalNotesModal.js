import React, { useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";

function ViewAdditionalNotesModal(props) {
  const { modal, toggle, notes } = props;

  return (
    <>
      {modal ? <></> : null}
      <div className="sub-modal-main-view-notes">
        <div className="sub-modal-view-notes">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Additional notes</h4>
              <div className="close-button" onClick={toggle}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>

          <div className="sub-modal-body">
            <div className="Additional-notes-textarea-alignment">
              <div className="form-group">
                {notes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewAdditionalNotesModal;
