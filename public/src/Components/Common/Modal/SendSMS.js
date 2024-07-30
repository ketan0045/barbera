import React, { useEffect, useState } from "react";
import "../../View/Invoice/Invoice";
import { ApiGet,ApiPut,ApiPost } from "../../../helpers/API/ApiData";
import VectorIcon from "../../../assets/svg/Vector.svg";
import { toast } from "react-toastify";

import moment from "moment";
import { parse } from "uuid";

export default function Delete(props) {
  const {toggle,modal,SendSMSData } = props;
const [sallonName,SetSallonName]=useState()
let userInfo = JSON.parse(localStorage.getItem("userinfo"));
useEffect(()=>{
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
ApiGet("account/company/companyData/" + userInfo.companyId).then((resp)=>{
       SetSallonName(resp?.data?.data[0]?.businessName)
}).catch((er)=>{
   alert(er)
})  

},[])

const SendSMS =()=>{
 
 const SmSData= {
    name:  `${SendSMSData?.customer?.firstName} ${SendSMSData?.customer?.lastName === null  ? "" : SendSMSData?.customer?.lastName } `,
    invoice: parseInt(SendSMSData?.totalAmount,10).toFixed(),
    date:moment(SendSMSData?.created).format("DD/MM/YYYY"),
    link :"www.app.barbera.io",
    sallon:sallonName,
    mobile: SendSMSData?.customer?.mobileNumber,
    invoiceId:SendSMSData?._id,
    companyId:userInfo.companyId,
  }
ApiPost("invoice/customer/invoice/sendMessage", SmSData).then((resp)=>{
  toggle(resp.data.status)
})

}

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
               Are you sure you want to send the invoice through SMS to +91 {SendSMSData.customer.mobileNumber}?
              </p>
           
          </div>
          <div className="toster-footer-SMS-button">
            <button onClick={() => props.toggle()}>No</button>
            <button onClick={(e) => SendSMS()}>
              <img src={VectorIcon} alt="DeleteIcon" />
              <span>Send SMS</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
