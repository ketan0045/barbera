import React, { useState } from "react";
import "./Toaster.scss";
import { ApiGet, ApiPut, ApiPost } from "../../../helpers/API/ApiData";
import DeleteIcon from "../../../assets/svg/white-delete.svg";

export default function AcceptDeny(props) {


  return (
    <>
      <div className="toaster-modal">
        <div
          className={
            props.modal
              ? "modal-design-toster toster-show"
              : " modal-design-toster toster-hidden"
          }
        >
          <div className="toster-title">
              <p>
              Would you like to add membership discount for non-active hours/days?
              </p>
          </div>
          <div className="toster-footer">
            <button onClick={()=>props.toggle()}>Cancel</button>
              <button style={{ backgroundColor: "#1479FF" }}  onClick={()=>props.toggle("Accept")}>
                <span style={{ paddingLeft: "8px" }}>Apply</span>
              </button>
          </div>
        </div>
      </div>
    </>
  );
}
