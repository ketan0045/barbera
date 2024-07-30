
import moment from "moment";
import React, { useState, useEffect } from "react";
import EditIcon from "../../../assets/svg/blue-edit.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import HandleServiceNavigation from "../../Common/Modal/HandleProductNavigation";
import CollectionPayment from "./CollectionPayment";



export default function CollectionSetting(props) {
  const userInfo = Auth.getUserDetail();
  const { featureOn,handleOnToggle ,enablePaymentMethod,setIsUpdate,collectionpaymentMethod,setCollectionPaymentMethod,SettingInfo,setSelectedPaymentMethod,selectedPaymentMethod,paymentMethod} = props;
  const [paymentMethodModal,setPaymentMethodModal]=useState(false)




  const OpenPaymentMethod=(data)=>{
    setPaymentMethodModal(!paymentMethodModal)
    
    if(data){
      setSelectedPaymentMethod(data)
      setCollectionPaymentMethod(data)
      setIsUpdate(true) 

      data?.map(async(payment)=>{
        let opening = {
          startTime: moment(new Date()).format("YYYY-MM-DD"),
          endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "CR",
          typeValue: "opening-balance",
          paymentMethod:payment
        };
        await ApiPost("expence/company/expenseDetails", opening)
          .then(async(res) => {
          
            if (res.data.data.value?.length == 0) {
              let editOpening = {
                amount: 0,
                companyId: userInfo?.companyId,
                type: "CR",
                typeValue: "opening-balance",
                paymentMethod:payment
              };
              await ApiPost("expence", editOpening)
                .then((respo) => {
                  console.log(
                    "res.data.data",res.data.data,respo
                  )
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
    }else{
      setSelectedPaymentMethod(SettingInfo?.collections?.collectionpaymentMethod)
    }
  }

  
  

  return (
    <>
      <div className="collection-setting-page">
        <div className="colllection-header-alignment">
          <div>
            <p>Enable Expense</p>
          </div>
          <div>
            <label class="switch">
              <input type="checkbox" checked={featureOn} onChange={(e)=>handleOnToggle(e, "enableCollection")}/>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        {featureOn && <div className="enable-box">
          <div
            className="first-div-style"
            style={{ borderBottom: enablePaymentMethod ? " " : "none" }}
          >
            <div>
              <p>Enable other payment methods</p>
              <span>Use other payment methods to track your Expense</span>
            </div>
            <div>
              <label class="switch">
                <input type="checkbox" checked={enablePaymentMethod}  onChange={(e)=>handleOnToggle(e, "enablePaymentMethod")}/>
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          {enablePaymentMethod && (
            <div className="sec-div-style">
              <div className="payment-methoad-style">
                <div>
                  <h6>Payment methods</h6>
                </div>
                <div>
                  <span>{collectionpaymentMethod?.length} selected</span>
                  <img src={EditIcon} alt="EditIcon" style={{cursor:"pointer"}} onClick={()=>OpenPaymentMethod()} />
                </div>
              </div>
            </div>
          )}
        </div>}
      </div>
      {paymentMethodModal && <CollectionPayment toggle={OpenPaymentMethod}  DefaultPaymentMethod={paymentMethod?.map((rep) => rep.paymentType)} selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} /> }
    </>
  );
}
