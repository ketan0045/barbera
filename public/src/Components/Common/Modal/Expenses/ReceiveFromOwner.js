import React, { useState ,useRef} from "react";
import { ApiPost } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import DropDownIcon from "../../../../assets/svg/drop-down.svg";
import { get_Setting } from "../../../../utils/user.util";
export default function ReceiveFromOwner(props) {
  const userInfo = Auth.getUserDetail();
  const genderRef = useRef();
  const SettingData = get_Setting();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [method, setMethod] = useState("Cash");
  const { toggle } = props;
  const [disable, setDisable] = useState(true);
  const [expenceAmount, setExpenseAmount] = useState();
  const [expenceNotes, setExpenseNotes] = useState("");

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

  const handleOnClick = (data) => {
    setSubMenuopen(!subMenuOpen)
    setMethod(data)
};
  const expenseHandler = (e) => {
    if (e.target.value == 0 || e.target.value === "") {
      setExpenseAmount(e.target.value);
      setDisable(true);
    } else {
      setExpenseAmount(parseInt(e.target.value));
      setDisable(false);
    }
  };

  const handleExpenseSave = async () => {
    setDisable(true);
    let expenceData = {
      amount: expenceAmount,
      companyId: userInfo?.companyId,
      type: "CR",
      typeValue: "deposit",
      paymentMethod:method,
      description: expenceNotes,
    };
    await ApiPost("expence", expenceData)
      .then((res) => {
       
        toggle();
      })
      .catch((err) => {
        console.log(err);
      });
    
  };

  return (
    <div className="add-new-expenses-modal-body-record">
      <div className="add-expense-amount-text">
        <h1>Receive from Owner account </h1>
      </div>
      <div className="add-expense-amount-modal-body">
        <div className="amount-type-input">
          <label>Enter amount</label>
          <input
            type="text"
            value={expenceAmount}
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
        {SettingData?.collections?.collectionpaymentMethod
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
          <button onClick={() => handleExpenseSave()}>Save</button>
        )}
      </div>
    </div>
  );
}
