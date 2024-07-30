import React, { useState,useEffect,useRef } from "react";
import { ApiPost } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import moment from "moment";
import { get_Setting } from "../../../../utils/user.util";
import DropDownIcon from "../../../../assets/svg/drop-down.svg";

export default function TransferToOwner(props) {
  const SettingData = get_Setting();
  const genderRef = useRef();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [method, setMethod] = useState("Cash");
  const userInfo = Auth.getUserDetail();
  const { toggle,SettingInfo } = props;
  const [disable, setDisable] = useState(true);
  const [transferAmount, setTransferAmount] = useState();
  const [expenceNotes, setExpenseNotes] = useState("");
  const [closingBalanceDetail,setClosingBalanceDetail]=useState()

  const handleOnClick = (data) => {
    setSubMenuopen(!subMenuOpen)
    setMethod(data)
};

  
  const expenseHandler = (e) => {
    if(e.target.value == 0 || e.target.value === ""){
      setTransferAmount(e.target.value);
      setDisable(true);
    }else{
      setTransferAmount(parseInt(e.target.value));
      if(closingBalanceDetail >= parseInt(e.target.value) ){
        setDisable(false);
      }else{
        setDisable(true);
      }
    
    }
  };


  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const handleExpenseSave =async()=>{
    setDisable(true);
    let transferData={
      amount:transferAmount,
      companyId:userInfo?.companyId,
      type:"DR",
      typeValue:"transfer",
      paymentMethod:method,
      description: expenceNotes
  }
  await ApiPost("expence",transferData)
  .then((res) => {
   
    toggle()
  })
  .catch((err) => {
    console.log(err);
  });
  }

  useEffect(async()=>{
    let closingBala = {
      startTime: moment(new Date()).format("YYYY-MM-DD"),
      endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod:method
    };
    await ApiPost("expence/daywise/expense", closingBala)
      .then(async (res) => {
        setClosingBalanceDetail(res.data.data);
        if (transferAmount) {
          if (res.data.data < transferAmount) {
            setDisable(true);
          } else {
            setDisable(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },[method])

  return (
    <div className="add-new-expenses-modal-body-record">
      <div className="add-expense-amount-text">
        <h1>Deposit to Owner account</h1>
      </div>
    
      <div className="add-expense-amount-modal-body">
      <div className="provide-edit-option-list">
          <p>
          Available {method} balance
          </p>
          <p>
          <span>{SettingInfo?.currentType}</span>{""} {closingBalanceDetail}
          </p>
        </div>
        <div className="amount-type-input">
          <label>Enter amount</label>
          <input
            type="text"
            value={transferAmount}
            placeholder="Enter value"
            onChange={(e) => expenseHandler(e)}
            onKeyPress={bindInput}
          />
        </div>
        <div className="amount-type-input">
          <label>Additional notes</label>
          <input
            type="text"
            maxLength={60}
            placeholder="Type here"
            value={expenceNotes}
            onChange={(e) => setExpenseNotes(e.target.value)}
          />
        </div>
        {SettingInfo?.collections?.collectionpaymentMethod
                        ?.length > 1 && <div className="option-select-group customer-form-group-align">
          <label>Payment Method</label>
          <div className="relative">
            <div
              className="input-relative"
              onClick={() => setSubMenuopen(!subMenuOpen)}
              ref={genderRef}
            >
              <input
                type="text"
                style={{ fontWeight: "500" }}
                name="method"
                value={method}
                placeholder="Select Payment Method"
              />
              <div className="drop-down-icon-center">
                <img src={DropDownIcon} alt="DropDownIcon" />
              </div>
            </div>
            <div
              className={
                subMenuOpen
                  ? "sub-menu-open sub-menu"
                  : "sub-menu sub-menu-close"
              }
            >
              <div className="sub-menu-design">
                <ul onClick={(e) => handleOnClick(e.target.innerHTML)}>
                {SettingData?.collections?.collectionpaymentMethod?.map((pay)=>{
                  return(
                    <li value={pay}>{pay}</li>
                  )
                })}
                </ul>
              </div>
            </div>
          </div>
        </div>}
      </div>
      <div className="add-expense-amount-modal-footer">
        {disable ? (
          <button disabled>Save</button>
        ) : (
          <button  onClick={()=>handleExpenseSave()}>Save</button>
        )}
      </div>
    </div>
  );
}
