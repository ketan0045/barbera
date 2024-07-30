import React, { useState, useEffect } from "react";
import "../../Common/Modal/Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import moment from "moment";
import DropDownIcon from "../../../assets/svg/drop-down.svg";

export default function StaffSalary(props) {
  const { toggle, SettingInfo, staffId, userInfo } = props;
  const [splitPayOpen, setSplitPayopen] = useState(false);
  const [addAmount, setAddAmount] = useState();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [splitOpen, setSplitopen] = useState();
  const [availableCash, setAvailableCash] = useState();
  const [enable, setEnable] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
  "Cash"
  );
  const [closingBalanceDetail, setClosingBalanceDetail] = useState();

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
  const SelectPaymentMethod = (e, data) => {
    setSubMenuopen(!subMenuOpen);
    setPaymentMethod(data);
  };
  const AddAmountHandler = (e) => {
    if (e.target.value == "" || e.target.value == 0) {
      setAddAmount();
      setSplitopen(true);
      setEnable(false);
    } else {
      setAddAmount(parseInt(e.target.value));
      if (closingBalanceDetail >= parseInt(e.target.value)) {
        setEnable(true);
        setSplitopen(false);
      } else {
        setSplitopen(true);
        setEnable(false);
      }
     

    }
  };

  const AddExpenseHandler = async () => {
    setEnable(true);
    let transferData = {
      amount: addAmount,
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "staff",
      staffId: staffId,
      paymentMethod: paymentMethod,
    };
    await ApiPost("expence", transferData)
      .then((res) => {
        toggle(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(async () => {
    let closingBala = {
      startTime: moment(new Date()).format("YYYY-MM-DD"),
      endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod: paymentMethod,
    };
    await ApiPost("expence/daywise/expense", closingBala)
      .then(async (res) => {
        setClosingBalanceDetail(res.data.data);
        if (addAmount) {
          if (res.data.data < addAmount) {
            setEnable(false);
            setSplitopen(true);
          } else {
            setEnable(true);
            setSplitopen(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [paymentMethod]);

  return (
    <React.Fragment>
      {!splitPayOpen && <div className="modal-bluer-open"></div>}

      <div className="sub-modal-main">
        <div className="split-sub-modal-wallet">
          <div className="sub-modal-headermenu-wallet">
            <div className="header-alignment-wallet">
              <div className="close-button-wallet" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h4>Staff pay</h4>
            </div>
          </div>

          <div className="sub-modal-body-Forwallet">
            <div className="provide-edit-option-lists">
              <p>Available {paymentMethod} balance</p>
              <p>
                <span>{SettingInfo?.currentType}</span>
                {""} {closingBalanceDetail}
              </p>
            </div>
            <div className="form-group form-top-align-space">
              <label>Amount</label>
              <div className="dropdown-relative">
                <input
                  type="text"
                  value={addAmount}
                  name="amount"
                  placeholder="Enter value"
                  maxLength="10"
                  style={{
                    marginBottom: "5%",
                    border: splitOpen ? "1px solid red" : "1px solid lightgray",
                  }}
                  onChange={(e) => AddAmountHandler(e)}
                  onKeyPress={bindInput}
                />
                <div className="rupee-align">
                  <span className="roboto-font">
                    {SettingInfo?.currentType}
                  </span>
                </div>
              </div>
            </div>
            {SettingInfo?.collections?.collectionpaymentMethod
                        ?.length > 1 &&
            <div className="option-select-group customer-form-group-align">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Payment methods</label>
              </div>

              <div className="relative">
                <div
                  className="input-relative"
                  onClick={() => setSubMenuopen(!subMenuOpen)}
                >
                  <input type="text" value={paymentMethod} />
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
                    <ul>
                      {SettingInfo?.collections?.collectionpaymentMethod
                        ?.length === 0 ? (
                        <li onClick={(e) => SelectPaymentMethod(e, "Cash")}>
                          Cash
                        </li>
                      ) : (
                        SettingInfo?.collections?.collectionpaymentMethod?.map(
                          (pay) => {
                            return (
                              <li
                                key={pay._id}
                                onClick={(e) => SelectPaymentMethod(e, pay)}
                              >
                                {pay}
                              </li>
                            );
                          }
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>}
          </div>
          <hr />
          <div className="sub-modal-footer">
            {enable ? (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
                onClick={() => AddExpenseHandler()}
              >
                <button>Save</button>
              </div>
            ) : (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
              >
                <button disabled>Save</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
