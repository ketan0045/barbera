import React from "react";
import "../../Common/Toaster/Toaster.scss";

export default function ClearDuePopUp(props) {
  const { toggle,description,cancle,add } = props;

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
           {description}
            </p>
          </div>
          <div className="toster-footer">
            <button onClick={() => toggle()}>{cancle}</button>
            <button
              style={{ backgroundColor: "#1479FF" }}
              onClick={() => toggle(true)}
            >
              <span style={{ paddingLeft: "8px" }}>{add}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
