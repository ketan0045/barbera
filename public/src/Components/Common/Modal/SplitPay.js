import React, { useEffect, useState } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import TrueIcon from "../../../assets/svg/true-icon.svg";
import RightIcon from "../../../assets/svg/right-blue-icon.svg";

export default function SplitPay(props) {
  const {
    modal,
    toggle,
    paymenttMethod,
    TotalAmount,
    splitPayment,
    edit,
    SettingInfo,
    walletBalance,
  } = props;
  const [selectSplit, setSelectSplit] = useState(true);
  const [selectedpayment, setSelectedPayment] = useState([]);
  const [selectedSplit, setSelectedSplit] = useState([]);
  const [errors, setError] = useState({});
  const [disble, setDisable] = useState(false);

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

  useEffect(() => {
    if (edit) {
    } else {
      setSelectedSplit(
        selectedpayment?.map((py) => {
          return { method: py, amount: "" };
        })
      );
    }
  }, [selectedpayment]);

  useEffect(() => {
    if (edit) {
      setSelectedPayment(
        splitPayment?.map((split) => {
          return split.method;
        })
      );
      setSelectedSplit(splitPayment);
      if (splitPayment[0]?.method !== "Wallet" && splitPayment?.length >= 2){
        setSelectSplit(false);
      }
      if (splitPayment[0]?.method === "Wallet" && splitPayment?.length === 2){
        setSelectSplit(true);
      }else{
        setSelectSplit(false);
      }
    } else {
      setSelectedPayment([paymenttMethod[0]]);
    }
  }, []);

  const selectNext = () => {
    setSelectSplit(!selectSplit);
    setDisable(true);
  };
  

  const selectedPaymentMethods = (pay) => {
    if (selectedpayment?.includes(pay)) {
      let index = selectedpayment?.indexOf(pay);
      selectedpayment?.splice(index, 1);
      if (splitPayment) {
        let index = selectedSplit?.findIndex((obj) => {
          return obj.method === pay;
        });
        selectedSplit.splice(index, 1);
      }
    } else {
      selectedpayment?.push(pay);
      if (splitPayment) {
        selectedSplit.push({ method: pay, amount: "" });
      }
    }
    setSelectedPayment([...selectedpayment]);
    setSelectedSplit([...selectedSplit]);
  };

  const setSplitPayment = (e) => {
    if (selectedSplit?.length > 2) {
      let NewData = selectedSplit?.map((resp) => {
        if (resp.method === e.target.name) {
          return {
            ...resp,
            amount: parseFloat(e.target.value, 10),
          };
        } else {
          return {
            ...resp,
          };
        }
      });
      setSelectedSplit(NewData);
      let able = NewData.filter((obj) => obj.amount === 0);
      let abl = NewData.filter((obj) => obj.amount === "");
      if (
        able.length > 0 ||
        abl.length > 0 ||
        e.target.value >= parseInt(TotalAmount, 10)
      ) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    } else {
      let NewData;
      if (selectedpayment?.includes("Wallet")) {
        NewData = selectedSplit?.map((resp) => {
          if (resp.method === e.target.name) {
            return {
              ...resp,
              amount: parseFloat(e.target.value, 10),
            };
          } else {
            return {
              ...resp,
            };
          }
        });
      } else {
        NewData = selectedSplit?.map((resp) => {
          if (resp.method === e.target.name) {
            return {
              ...resp,
              amount: parseFloat(e.target.value, 10),
            };
          } else {
            return {
              ...resp,
              amount:
                parseInt(e.target.value, 10) > parseInt(TotalAmount, 10)
                  ? 0
                  : parseInt(TotalAmount, 10) - e.target.value,
            };
          }
        });
      }
      
      setSelectedSplit(NewData);
      let able = NewData.filter((obj) => obj.amount === 0);
      let abl = NewData.filter((obj) => obj.amount === "");
      if (
        able.length > 0 ||
        abl.length > 0 ||
        e.target.value > parseInt(TotalAmount, 10)
      ) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  };

  const HandleOnSave = () => {
    toggle(selectedSplit);
  };

 
  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="split-sub-modal">
          <div className="sub-modal-headermenu">
            <div className="header-alignment">
              <div className="close-button" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h4>Split payment mode</h4>
            </div>
          </div>
          {selectSplit ? (
            <>
              <div className="sub-grid-items">
                <p>Select payment modes to split in</p>
              </div>
              <div className="split-pay-sub-modal">
                {/* {selectedpayment?.includes("Wallet") && (
                  <div
                    className={
                      selectedpayment?.includes("Wallet")
                        ? "select-grid-setting"
                        : "select-grid-setting-disable"
                    }
                  >
                    <div className="select-text-alignment-setting">
                      <div className="Invoice-Balance-status">
                        <span className="mr-3">Wallet</span>
                        <button>
                          Bal {SettingInfo?.currentType} {walletBalance}
                        </button>
                      </div>
                      {selectedpayment?.includes("Wallet") ? (
                        <img src={TrueIcon} alt="TrueIcon" />
                      ) : null}
                    </div>
                  </div>
                )} */}
                {paymenttMethod?.map((pay) => {
                  return (
                    <div
                      className={
                        selectedpayment?.includes(pay)
                          ? "select-grid-setting"
                          : "select-grid-setting-disable"
                      }
                      onClick={(e) => selectedPaymentMethods(pay)}
                    >
                      <div className="select-text-alignment-setting">
                        <span>{pay}</span>
                        {selectedpayment?.includes(pay) ? (
                          <img src={TrueIcon} alt="TrueIcon" />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedpayment?.length > 1 ? (
                <div className="save-changes">
                  <button onClick={() => selectNext()}>Next</button>
                </div>
              ) : (
                <div className="save-changes">
                  <button disabled>Next</button>
                </div>
              )}
            </>
          ) : (
            <div className="split-pay-sub-modal-alignment">
              <div className="split-pay-sub-modal">
                <div className="total-payable-alignment">
                  <div>
                    <span>Total payable amount</span>
                  </div>
                  <div>
                    <h2>
                      <a>{SettingInfo?.currentType}</a>{" "}
                      {parseInt(TotalAmount, 10)}
                    </h2>
                  </div>
                </div>
                <div className="value-form-alignment">
                  <div className="value-form-grid">
                    {selectedpayment?.map((paymethod) => {
                     if(paymethod !== "Wallet") {
                      return (
                        <div className="value-grid" style={{ display: "flex" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <div className="value-grid-items">
                              <span>{paymethod}</span>
                            </div>

                            {paymethod === "Wallet" && (
                              <div className="splitpay-Balance-status-btn">
                                <button>
                                  Bal {SettingInfo?.currentType} {walletBalance}
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="value-grid-items">
                            <div
                              className={
                                selectedSplit?.filter(
                                  (resp) => resp?.method === paymethod
                                )[0]?.amount == parseInt(TotalAmount, 10) &&  splitPayment[0]?.method !== "Wallet" && selectedSplit?.length !== 2 ||
                                selectedSplit?.filter(
                                  (resp) => resp?.method === paymethod
                                )[0]?.amount === 0 || selectedSplit?.filter(
                                  (resp) => resp?.method === paymethod
                                )[0]?.amount > parseInt(TotalAmount, 10)
                                  ? "input-relative-value-red"
                                  : "input-relative-value"
                              }
                            >
                              {paymethod === "Wallet" ? (
                                <input
                                  type="number"
                                  placeholder="Enter value"
                                  onWheel={() => document.activeElement.blur()}
                                  name={paymethod}
                                  onKeyPress={bindInput}
                                  value={
                                    selectedSplit?.filter(
                                      (resp) => resp?.method === paymethod
                                    )[0]?.amount
                                  }
                                  disabled
                                />
                              ) : (
                                <input
                                  type="number"
                                  placeholder="Enter value"
                                  onWheel={() => document.activeElement.blur()}
                                  name={paymethod}
                                  onKeyPress={bindInput}
                                  value={
                                    selectedSplit?.filter(
                                      (resp) => resp?.method === paymethod
                                    )[0]?.amount
                                  }
                                  onChange={(e) => setSplitPayment(e)}
                                />
                              )}
                              <div className="amount-icon-alignment">
                                <a>{SettingInfo?.currentType}</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    })}
                  </div>
                  <div className="value-form-grid"></div>
                </div>
              </div>
              <div className="spilt-modal-footer"></div>
              <div className="spilt-footer-alignment">
                <div onClick={() => setSelectSplit(!selectSplit)}>
                  <img src={RightIcon} alt="RightIcon" />
                  <span>Select modes</span>
                </div>
                {selectedSplit
                  .map((item) => item.amount)
                  .reduce((prev, curr) => prev + curr, 0) - (splitPayment[0]?.method === "Wallet" ? splitPayment[0]?.amount : 0) ===
                parseInt(TotalAmount, 10) ? (
                  disble ? (
                    <div>
                      <button disabled>Save</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => HandleOnSave()}>Save</button>
                    </div>
                  )
                ) : (
                  <div>
                    <button disabled>Save</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
