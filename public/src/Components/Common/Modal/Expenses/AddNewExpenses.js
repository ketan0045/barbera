import React from "react";
import NewCloseIcon from "../../../../assets/svg/new-close.svg";
import CoffeeIcon from "../../../../assets/svg/coffee.svg";
import RsInIcon from "../../../../assets/svg/rsin.svg";
import RsOutIcon from "../../../../assets/svg/rsout.svg";
import Staff from "../../../../assets/svg/staff.svg";
import { useState } from "react";
import AddNewRecord from "./AddNewRecord";
import ReceiveFromOwner from "./ReceiveFromOwner";
import TransferToOwner from "./TransferToOwner";
import StaffPay from "./StaffPay";
export default function AddNewExpenses(props) {
  const { toggle ,closingBalanceDetail,SettingInfo} = props;
  const [screenView, setScreenView] = useState("record");
  return (
    <>
      <div>
        <div className="add-new-expenese-modal-design">
          <div className="add-new-expenese-mini-modal">
            <div className="add-new-expenese-modal-header">
              <div onClick={()=>toggle()}>
                <img src={NewCloseIcon} alt="NewCloseIcon" />
              </div>
              <h1>Add new record</h1>
            </div>
            {screenView === "record" && <div className="add-new-expenses-modal-body">
              <div className="add-new-expenses-box">
                <div className="grid" onClick={()=>setScreenView("category")}>
                  <div className="grid-items">
                    <img src={CoffeeIcon} alt="CoffeeIcon" />
                  </div>
                  <div className="grid-items">
                    <p>Add expense</p>
                  </div>
                </div>
                <div className="grid"  onClick={()=>setScreenView("transfer")}>
                  <div className="grid-items">
                    <img src={RsOutIcon} alt="CoffeeIcon" />
                  </div>
                  <div className="grid-items">
                    <p>Deposit to Owner account</p>
                  </div>
                </div>
                <div className="grid"  onClick={()=>setScreenView("staff")}>
                  <div className="grid-items">
                    <img src={Staff} alt="CoffeeIcon" />
                  </div>
                  <div className="grid-items">
                    <p>Staff pay</p>
                  </div>
                </div>
                <div className="grid"  onClick={()=>setScreenView("receive")}>
                  <div className="grid-items">
                    <img src={RsInIcon} alt="CoffeeIcon" />
                  </div>
                  <div className="grid-items">
                    <p>Receive from Owner account</p>
                  </div>
                </div>
              </div>
            </div>}
            {screenView === "staff"  && <StaffPay  toggle={toggle}  closingBalanceDetail={closingBalanceDetail} SettingInfo={SettingInfo}/>}
            {screenView === "transfer"  && <TransferToOwner  toggle={toggle} closingBalanceDetail={closingBalanceDetail} SettingInfo={SettingInfo}/>}
            {screenView === "receive"  && <ReceiveFromOwner  toggle={toggle} />}
            {screenView === "category"  && <AddNewRecord setScreenView={setScreenView} toggle={toggle} />}
          </div>
        </div>
      </div>
    
    </>
  );
}
