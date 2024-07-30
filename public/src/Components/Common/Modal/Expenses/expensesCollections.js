import React from "react";
import { useState, useRef, useEffect } from "react";
import NewCloseIcon from "../../../../assets/svg/new-close.svg";
import "./expenses.scss";
import Auth from "../../../../helpers/Auth";
import { ApiPost } from "../../../../helpers/API/ApiData";
import DropDownIcon from "../../../../assets/svg/drop-down.svg";
import { get_Setting } from "../../../../utils/user.util";
import moment from "moment";

export default function ExpensesCollections(props) {
  const userInfo = Auth.getUserDetail();
  const SettingData = get_Setting();
  let SettingInfo = JSON.parse(localStorage.getItem("setting"));
  const genderRef = useRef();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [method, setMethod] = useState("Cash");
  const { selectedService, selectedCategoty, setAddType, toggle } = props;
  const [expenceAmount, setExpenseAmount] = useState();
  const [expenceNotes, setExpenseNotes] = useState("");
  const [disable, setDisable] = useState(true);
  const [closingBalanceDetail, setClosingBalanceDetail] = useState();

  const EditSelected = () => {
    setAddType("category");
  };

  useEffect(async () => {
    let closingBala = {
      startTime: moment(new Date()).format("YYYY-MM-DD"),
      endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod: method,
    };
    await ApiPost("expence/daywise/expense", closingBala)
      .then(async (res) => {
        setClosingBalanceDetail(res.data.data);
        if (expenceAmount) {
          if (res.data.data < expenceAmount) {
            setDisable(true);
          } else {
            setDisable(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [method]);

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
    setSubMenuopen(!subMenuOpen);
    setMethod(data);
  };

  const expenseHandler = (e) => {
    if (e.target.value == 0 || e.target.value === "") {
      setExpenseAmount(e.target.value);
      setDisable(true);
    } else {
      setExpenseAmount(parseInt(e.target.value));
      if (closingBalanceDetail >= parseInt(e.target.value)) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    }
  };

  const handleExpenseSave = async () => {
    setDisable(true);
    let expenceData = {
      categoryValue: selectedService?._id,
      amount: expenceAmount,
      description: expenceNotes,
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "expence",
      paymentMethod: method,
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
    <>
      <div className="add-expense-amount-text">
        <h1>Add expense amount </h1>
      </div>
      <div className="add-expense-amount-modal-body">
        <div className="provide-edit-option-list">
          <p>Available {method} balance</p>
          <p>
            <span>{SettingInfo?.currentType}</span>
            {""} {closingBalanceDetail}
          </p>
        </div>
        <div className="provide-edit-option-list">
          <p>
            {selectedCategoty} - {selectedService?.serviceName}
          </p>
          <a onClick={() => EditSelected()}>Edit</a>
        </div>
        <div className="amount-type-input">
          <label>Expense amount</label>
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
                  {SettingData?.collections?.collectionpaymentMethod?.map(
                    (pay) => {
                      return <li value={pay}>{pay}</li>;
                    }
                  )}
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
    </>
  );
}
