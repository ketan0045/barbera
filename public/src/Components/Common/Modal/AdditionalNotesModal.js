import React, { useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";

function AdditionalNotesModal(props) {
  const { modal, toggle, notes } = props;
  const [disable, setDisable] = useState(true);
  const [note, setNote] = useState(notes);

  const handleOnChange = (e) => {
    setNote(e.target.value);
    if (e.target.value) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
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
                <textarea
                  name="notes"
                  rows="5"
                  cols="50"
                  placeholder="Type here"
                  value={note}
                  onChange={handleOnChange}
                />
              </div>
            </div>
          </div>

          <div className="sub-modal-footer">
            <div className="Addintional-note-save-button" onClick={(e) => toggle(e, note)}>
              <button disabled={disable}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdditionalNotesModal;
