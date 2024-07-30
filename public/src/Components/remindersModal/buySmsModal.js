import React, { useState } from "react";
import CloseIcon from "../../assets/svg/new-cl.svg";
import PaymentBtn from "../../Components/Common/Payment";
import SidebarBarberaLogo from "../../assets/img/sidebar-barbera.svg";
import { ApiPost } from "../../helpers/API/ApiData";

export default function BuySmsModal(props) {
  const { smSData, userInfo,toggle } = props;
  const [smsCount, setSmsCount] = useState();

  const BuySmSHandler =async (paymentId) => {
    if(paymentId) {
      let bodyy = {
        paymentGatewayId:paymentId,
        amount:smsCount * 0.2,
        companyId:userInfo?.companyId,
        type:"SMS"
      }
      await ApiPost("campaignPayment", bodyy)
      .then(async(res)=> {
        let smsData={
          value:smsCount,
          type:"CR",
          companyId:userInfo?.companyId,
          payementId:res?.data?.data?._id
      }
        await ApiPost("smsCheck", smsData)
        .then(async(res)=> {
          toggle(true)
         
        })
        .catch((err)=> {
          console.log("err", err);
          toggle(false)
        })
       
      })
      .catch((err)=> {
        console.log("err", err);
      })
    }
  
  };

  return (
    <>
      <div className="buy-sms-modal-wrapper-blur">
        <div className="buy-sms-modal">
          <div className="modal-header-reminder-child">
            <h1>Buy SMS</h1>
            <div onClick={() => props.setBuySmsOpen(false)}>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
          </div>
          <div className="buy-sms-modal-body-content-alignment">
            <div className="reminder-sms-box-content">
              <span>Available reminder SMS</span>
              <span>{smSData?.Remaining}</span>
            </div>
            <div className="enter-message-content-alignment">
              <label>Enter the number of SMS</label>
              <input type="number" placeholder="e.g. 500" value={smsCount} onChange={(e) => setSmsCount(e.target.value)} />
            </div>
          </div>
          <div className="payment-all-content-alignment">
            <p>Payment</p>
            <span>
              <a>₹</a> 0.20 per message * {smsCount && `${smsCount} SMS`}
            </span>
          </div>
          <div className="sub-title-alignment">
            <p>Sub total</p>
            <p>
              <a>₹</a> {smsCount ? smsCount * 0.2 : 0}
            </p>
          </div>
          <div className="total-amount-alignment">
            <p>Total amount</p>
            <span>
              <a>₹</a> {smsCount ? smsCount * 0.2 : 0}
            </span>
          </div>
          <div className="buy-sma-modal-footer-alignment">
            {smsCount != 0 && smsCount ? (
              <PaymentBtn price={smsCount * 0.2} logo={SidebarBarberaLogo} user={userInfo} upgradePlan={BuySmSHandler} />
            ) : (
              <button style={{opacity:0.5}}>Make payment</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
