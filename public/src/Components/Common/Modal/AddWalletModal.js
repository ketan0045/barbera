import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import Rupees from "../../../assets/svg/ruppe_1.png";
import SplitPay from "./SplitPay";
import { ApiPost } from "../../../helpers/API/ApiData";
import { ErrorOutlineRounded, ErrorOutlineSharp } from "@material-ui/icons";

export default function AddWalletModal(props) {
  const { modal, editBrand, AddCustomer, search, toggle, SettingInfo ,customerDetails} = props;
  const [addAmount, setAddAmount] = useState();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [splitOpen, setSplitopen] = useState();
  const [edit, setEdit] = useState(false);
  const [splitPayOpen, setSplitPayopen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([
    { method: SettingInfo?.paymentMethod[0] },
  ]);

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

  const AddWalletHandler = () => {
    let walletData = {
      companyId: SettingInfo?.companyId,
      user_id: customerDetails?._id,
      type: "CR",
      method: paymentMethod,
      description: "Top-up",
      walletAmount: addAmount,
      topup:false
    };

    ApiPost("wallet",walletData).then((resp)=>{
      if(resp.data.status === 200){
        toggle(resp.data.status)
      }
    }).catch((er)=>{
      console.log(er)
    })
  };
  const SplitPayHandler = (data) => {
    SplitPaymentHandler();
    if (data) {
      setEdit(true);
    }
  };

  const RemoveSplitPayment = () => {
    setEdit(false);
    setPaymentMethod([
      { method: SettingInfo?.paymentMethod[0], amount: addAmount },
    ]);
  };

  const SplitPaymentHandler = (data) => {
    if (!addAmount) {
      setSplitopen(true);
    } else {
      setSplitPayopen(!splitPayOpen);
    }
    if (data) {
      setPaymentMethod(data);
    }
  };

  const AddAmountHandler = (e) => {
    if (e.target.value == "" || e.target.value == 0) {
      setAddAmount();
      setSplitopen(true);
      setPaymentMethod([{ method: SettingInfo?.paymentMethod[0], amount: 0 }]);
    } else {
      setAddAmount(parseInt(e.target.value));
      setSplitopen(false);
      setPaymentMethod([
        {
          method: SettingInfo?.paymentMethod[0],
          amount: parseInt(e.target.value),
        },
      ]);
    }
  };
  const SelectPaymentMethod = (e, data) => {
    setSubMenuopen(!subMenuOpen);
    setPaymentMethod([{ method: data, amount: addAmount }]);
  };

  const closeOnClick = () => {
    toggle(false);
  };
  return (
    <React.Fragment>
      {!splitPayOpen && <div className="modal-bluer-open"></div>}

      <div className="sub-modal-main">
        <div className="split-sub-modal-wallet">
          <div className="sub-modal-headermenu-wallet">
            <div className="header-alignment-wallet">
              <div
                className="close-button-wallet"
                onClick={() => closeOnClick()}
              >
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h4>Add wallet balance</h4>
            </div>
          </div>

          <div className="sub-modal-body-Forwallet">
            <div className="form-group form-top-align-space">
              <label>Add amount</label>
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
                  <span className="roboto-font">{SettingInfo?.currentType}</span>
                </div>
              </div>
            </div>

            {paymentMethod?.length <= 1 ? (
              <div className="option-select-group customer-form-group-align">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Payment methods</label>
                  <p onClick={() => SplitPaymentHandler()}>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#1479FF",
                        cursor: "pointer",
                      }}
                    >
                      Split
                    </span>
                  </p>
                </div>

                <div className="relative">
                  <div
                    className="input-relative"
                    onClick={() => setSubMenuopen(!subMenuOpen)}
                  >
                    <input type="text" value={paymentMethod[0]?.method} />
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
                        {SettingInfo?.paymentMethod?.length === 0 ? (
                          <li onClick={(e) => SelectPaymentMethod(e, "Cash")}>
                            Cash
                          </li>
                        ) : (
                          SettingInfo?.paymentMethod?.map((pay) => {
                            return (
                              <li
                                key={pay._id}
                                onClick={(e) => SelectPaymentMethod(e, pay)}
                              >
                                {pay}
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="split-pay-remove-edit-alignment split-remove-space">
                  <div>
                    <p>
                      Split payment
                      <span onClick={() => SplitPayHandler("edit")}>Edit</span>
                    </p>
                  </div>
                  <div>
                    <h6 onClick={() => RemoveSplitPayment()}>Remove</h6>
                  </div>
                </div>
                <div className="split-pay-info">
                  {paymentMethod?.map((pay) => {
                    return (
                      <div className="text-amount-alignment">
                        <p>{pay.method}</p>
                        <h2>
                          <span>{SettingInfo?.currentType}</span> {pay.amount}
                        </h2>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <hr />
          <div className="sub-modal-footer">
            {addAmount > 0 ? (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
                onClick={() => AddWalletHandler()}
              >
                <button>Add Balance</button>
              </div>
            ) : (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
              >
                <button disabled>Add Balance</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {splitPayOpen && (
        <SplitPay
          modal={splitPayOpen}
          toggle={SplitPaymentHandler}
          paymenttMethod={SettingInfo?.paymentMethod}
          TotalAmount={addAmount}
          splitPayment={paymentMethod}
          edit={edit}
          SettingInfo={SettingInfo}
        />
      )}
    </React.Fragment>
  );
}
