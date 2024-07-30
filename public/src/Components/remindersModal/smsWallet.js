import React from "react";
import "./remindersModal.scss";
import CloseIcon from "../../assets/svg/new-cl.svg";
export default function SmsWallet(props) {
  const {smSData}=props
  return (
    <>
      <div className="sms-wallet-child-modal-alignment-blur">
        <div className="sms-wallet-child-box">
          <div className="modal-header-reminder-child">
            <h1>SMS wallet</h1>
            <div onClick={()=>props.setBuySmsModal(false)}>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
          </div>
          <div className="sms-modal-body-content-alignment">
            <div className="content-border-box">
              <div className="list-text-alignment">
                <p>Available reminder SMS</p>
                <p>{smSData?.Remaining}</p>
              </div>
              <div className="list-text-alignment">
                <span>Total reminder SMS Sent</span>
                <span>{smSData?.DR}</span>
              </div>
            </div>
          </div>
          <div className="sms-modal-footer-alignment">
            <button onClick={()=>{props.setBuySmsOpen(true);props.setBuySmsModal(false)}}>Buy SMS</button>
          </div>
        </div>
      </div>
    </>
  );
}
