import React, { useEffect, useState } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import "./Modal.scss";
import SplitPay from "./SplitPay";
import ViewInvoiceModal from "./ViewInvoiceModal";
import YellowMembership from "../../../assets/svg/Yellow-Membership.svg";
import SkyBlueMembership from "../../../assets/svg/SkyBlue-Membership.svg";
import OrangeMembership from "../../../assets/svg/Orange-Membership.svg";
import BlueMembership from "../../../assets/svg/BLue-Membership.svg";
import { ApiPost, ApiPut } from "../../../helpers/API/ApiData";

export default function CustomerDuePaymentModal(props) {
  const {
    dueTransction,
    toggle,
    modal,
    SettingInfo,
    dueAmount,
    CustomerDue,
    customerDetails,
  } = props;
 
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  const [invoiceDetail, setInvoiceDetail] = useState();
  const paymentsMethod = SettingInfo?.paymentMethod;
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [splitPayment, setSplitPayment] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState();
  const [openSplitPay, setOpenSplitPay] = useState(false);
  const [edit, setEdit] = useState(false);
  const [dueToggle, setDueToggle] = useState(false);
  const [errors, setError] = useState({});
  const [amount, setAmount] = useState();
  const [clearDisble, setClearDisble] = useState(false);
  const [dueAmountRecord, setDueAmountRecord] = useState();
  const [collectedAmount, setCollectedAmount] = useState(dueAmount);

  useEffect(() => {
    setSelectedPaymentMethod(paymentsMethod[0]);
  }, []);

  const SelectPaymentMethod = (e, data) => {
    setSubMenuopen(!subMenuOpen);
    setSelectedPaymentMethod(data);
  };

  const ViewInvoice = (e, data) => {
    ViewInvoiceModalToggle();
    setInvoiceDetail(data);
  };
  const ViewInvoiceModalToggle = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
    if (data === true) {
      toggle(true);
    }
  };
  const SplitPaymentHandler = (data) => {
    SplitPaymentHandlerToggle();
    if (data) {
      setEdit(true);
    }
  };

  const SplitPaymentHandlerToggle = (data) => {
    setOpenSplitPay(!openSplitPay);
    if (data) {
      setSplitPayment(data);
      setPaymentMethod("Split");
      setIsSplit(true);
    }
  };

  const RemoveSplitPayment = () => {
    setEdit(false);
    setSplitPayment([]);
    setPaymentMethod("Cash");
    setIsSplit(false);
  };
  let breaksd = false;
  const ClearDueHandler = async () => {
    let payment;

    if (splitPayment?.length === 0) {
      payment = [
        {
          method: selectedPaymentMethod
            ? selectedPaymentMethod
            : paymentsMethod[0],
          amount: collectedAmount,
        },
      ];
    } else {
      payment = splitPayment;
    }

    if (dueTransction?.length === 1) {
      let updatedData = {
        dueStatus:
          collectedAmount !== parseInt(dueAmount) ? "Part paid" : "Paid",
        dueAmount: dueAmountRecord ? dueAmountRecord : 0,
        duePaymentMethod: payment,
      };
      await ApiPut("invoice/" + dueTransction[0]?._id, updatedData)
        .then((resp) => {})
        .catch((er) => {
          console.log(er);
        });
      let walletredeemData = {
        companyId: SettingInfo?.companyId,
        user_id: customerDetails?._id,
        type: "CR",
        method: payment,
        description: "Due cleared",
        // invoice_id: dueTransction[0]?._id,
        walletAmount: collectedAmount,
        invoice:true
      };
      await ApiPost("wallet", walletredeemData)
        .then((resp) => {
          toggle(true);
        })
        .catch((er) => {
          console.log(er);
        });
    } else {
      // debugger;
      let duepayment = payment;
      let walletredeemData = {
        companyId: SettingInfo?.companyId,
        user_id: customerDetails?._id,
        type: "CR",
        method: payment,
        description: "Due cleared",
        walletAmount: collectedAmount,
        invoice:true
      };
      
      ApiPost("wallet", walletredeemData)
        .then((resp) => {
          if (dueTransction?.length === 0) {
            toggle(true);
          }
        })
        .catch((er) => {
          console.log(er);
        });
      let partpayss;
      let duesss = dueTransction?.map(async (due, i) => {
        let dueAmount = due?.dueAmount;
        let amount;
        let remain;
        let remining;
        let newdueAmount;
        let newduePayment = [];
        let partpay = duepayment?.map((pay, i) => {
          if (i == 0) {
            amount = pay?.amount;
          }
          remining = (remining ? remining : dueAmount) - amount;
          console.log(
            "amount",
            amount,
            pay?.amount,
            dueAmount,
            newdueAmount,
            remining
          );

          dueAmount =
            amount > (newdueAmount != undefined ? newdueAmount : dueAmount)
              ? newdueAmount != undefined
                ? newdueAmount
                : dueAmount
              : amount ==
                  (newdueAmount != undefined ? newdueAmount : dueAmount) &&
                amount != 0 &&
                i !== duepayment?.length - 1
              ? pay?.amount
              : amount;
          remain =
            amount > (newdueAmount != undefined ? newdueAmount : dueAmount)
              ? 0
              : amount ==
                  (newdueAmount != undefined ? newdueAmount : dueAmount) &&
                amount != 0
              ? i !== duepayment?.length - 1
                ? pay?.amount
                : due?.dueAmount - amount
              : due?.dueAmount - amount;
          newdueAmount =
            newdueAmount != undefined
              ? amount ==
                  (newdueAmount != undefined ? newdueAmount : dueAmount) &&
                amount != 0 &&
                i !== duepayment?.length - 1
                ? newdueAmount
                : newdueAmount - remain
              : remain;
          
          if (pay?.amount > dueAmount) {
            let newduePaymentdata;
            if (dueAmount > 0) {
              newduePaymentdata = {
                ...pay,
                amount: pay?.amount - Math.abs(dueAmount),
              };
            } else {
              newduePaymentdata = {
                ...pay,
              };
            }

            newduePayment.push(newduePaymentdata);

            if (i === duepayment?.length - 1) {
              duepayment = newduePayment;
            }
          }
          if (dueAmount > 0) {
            amount = remain;
            return {
              ...pay,
              amount: dueAmount,
            };
          }
        });
        let finalPaymentMethod = partpay?.filter((obj) => obj !== undefined);
        

        if (!breaksd) {
          let updatedData = {
            dueStatus: remining > 0 ? "Part paid" : "Paid",
            dueAmount:
              dueTransction[i]?.dueAmount - finalPaymentMethod[0]?.amount,
            duePaymentMethod: finalPaymentMethod,
          };
      
          setTimeout(() => {
            console.log("sleep");
          }, 500);

          ApiPut("invoice/" + dueTransction[i]?._id, updatedData)
            .then(async (resp) => {
              if (resp) {
                if (i == dueTransction?.length - 1) {
                  toggle(true);
                }
              }
            })
            .catch((er) => {
              console.log(er);
            });
        }
        partpayss = dueAmount;

        if (remining >= 0) {
          toggle(true);
          breaksd = true;
          partpayss = 0;
        }

        return <p key={i}>Hell0</p>;
      });
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

  const AddDueAmount = () => {
    setDueToggle(!dueToggle);
    setDueAmountRecord(dueAmount);
    setAmount();
    setClearDisble(true);
  };

  const DueAmount = (e) => {
    if (e.target.value === "") {
      setDueAmountRecord(parseInt(dueAmount));
      setAmount(e.target.value);
    } else if (parseInt(e.target.value) === 0) {
      setDueAmountRecord(parseInt(dueAmount));
      setAmount(parseInt(e.target.value));
    } else if (parseInt(e.target.value) === parseInt(dueAmount)) {
      setDueAmountRecord();
      setAmount(parseInt(e.target.value));
    } else {
      setDueAmountRecord(parseInt(dueAmount) - parseInt(e.target.value));
      setAmount(parseInt(e.target.value));
    }
  };

  const SaveCollectedAmount = () => {
    let errors = {};
    if (amount > parseInt(dueAmount)) {
      errors["Due"] = "* Enter valid input";
    } else if (amount === "" || amount === 0 || amount === undefined) {
      errors["Due"] = "* Enter valid input";
    } else {
      setCollectedAmount(amount);
      setDueToggle(!dueToggle);
      setClearDisble(false);
    }
    setError(errors);
  };

  return (
    <>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>
                    Clear Dues |{" "}
                    {dueTransction?.length === 0
                      ? customerDetails.firstName + customerDetails.lastName
                      : dueTransction?.length > 1
                      ? customerDetails.firstName + customerDetails.lastName
                      : `Invoice #${dueTransction[0]?.invoiceId}`}{" "}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="generate-box-center dues-box-padding-remove">
                <div className="generate-box">
                  <div className="clear-dues-title">
                    <h2>Clear Dues</h2>
                  </div>
                  <div className="clear-dues-body">
                    <div className="clear-dues-profile-alignment">
                      <div className="due-profile-grid">
                        <div className="due-profile-grid-items">
                          <div className="sub-profile">
                            <div className="sub-profile-items">
                              {dueTransction[0]?.customerData?.selectMembership?.slice(
                                -1
                              )[0]?.isExpire === false ? (
                                dueTransction[0]?.customerData?.selectMembership?.slice(
                                  -1
                                )[0]?.cardColur === "rgb(248, 226, 124)" ? (
                                  <img
                                    src={YellowMembership}
                                    alt="ProfileImage"
                                  />
                                ) : dueTransction[0]?.customerData?.selectMembership?.slice(
                                    -1
                                  )[0]?.cardColur === "rgb(248, 163, 121)" ? (
                                  <img
                                    src={OrangeMembership}
                                    alt="ProfileImage"
                                  />
                                ) : dueTransction[0]?.customerData?.selectMembership?.slice(
                                    -1
                                  )[0]?.cardColur === "rgb(109, 200, 199)" ? (
                                  <img
                                    src={SkyBlueMembership}
                                    alt="ProfileImage"
                                  />
                                ) : dueTransction[0]?.customerData?.selectMembership?.slice(
                                    -1
                                  )[0]?.cardColur === "rgb(72, 148, 248)" ? (
                                  <img
                                    src={BlueMembership}
                                    alt="ProfileImage"
                                  />
                                ) : (
                                  <div className="due-profile-icon-design">
                                    <span>
                                      {customerDetails?.firstName[0].toUpperCase()}
                                    </span>
                                  </div>
                                )
                              ) : (
                                <div className="due-profile-icon-design">
                                  <span>
                                    {customerDetails?.firstName[0].toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="sub-profile-items">
                              <h3>
                                {customerDetails.firstName +
                                  customerDetails.lastName}
                              </h3>
                              <p>{customerDetails?.mobileNumber}</p>
                            </div>
                          </div>
                        </div>
                        <div className="due-profile-grid-items">
                          <button>
                            Due <a>{SettingInfo?.currentType}</a> {dueAmount}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="new-pending-box-md-height">
                    <div className="pending-due-invoice">
                      <div className="section-title">
                        <p>Pending invoices dues</p>
                      </div>
                      {dueTransction?.length === 0 ? (
                        <div className="dues-text-amount-alignment">
                          <h3
                            style={{
                              color: "#193566",
                              cursor: "pointer",
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            Previous due
                          </h3>
                          <p>
                            <span>{SettingInfo?.currentType}</span> {dueAmount}
                          </p>
                        </div>
                      ) : dueTransction
                          .map((item) => item.dueAmount)
                          .reduce((prev, curr) => prev + curr, 0) !==
                        dueAmount ? (
                        <div className="dues-text-amount-alignment">
                          <h3
                            style={{
                              color: "#193566",
                              cursor: "pointer",
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            Previous due
                          </h3>
                          <p>
                            <span>{SettingInfo?.currentType}</span> {dueAmount-dueTransction
                          .map((item) => item.dueAmount)
                          .reduce((prev, curr) => prev + curr, 0) 
                        }
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      {dueTransction?.map((due) => {
                        return (
                          <div className="dues-text-amount-alignment">
                            <h2
                              onClick={(e) => ViewInvoice(e, due)}
                              style={{ cursor: "pointer" }}
                            >
                              #{due?.invoiceId}
                            </h2>
                            <p>
                              <span>{SettingInfo?.currentType}</span>{" "}
                              {due?.dueAmount}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="total-dues-amount">
                      <h3>Total due amount</h3>
                      <p>
                        <span>{SettingInfo?.currentType} </span>
                        {dueAmount}
                      </p>
                    </div>
                    {dueAmountRecord && (
                      <div className="add-due-text-final-alignment">
                        <h2>Due</h2>
                        <p style={{ fontSize: "15px" }}>
                          <span style={{ fontSize: "15px" }}>
                            - {SettingInfo?.currentType}{" "}
                          </span>
                          {dueAmountRecord}
                        </p>
                      </div>
                    )}

                    <div className="add-due-main-alignment">
                      {dueToggle ? (
                        <>
                          <div className="add-due-alignment">
                            <div className="total-amount-collected">
                              <div style={{ display: "flex" }}>
                                <label>Total amount collected</label>
                                <span
                                  style={{
                                    color: "red",
                                    // top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {errors["Due"]}
                                </span>
                              </div>
                              <div className="total-amount-dues-grid">
                                <div className="total-amount-dues-grid-items">
                                  <input
                                    type="text"
                                    placeholder="Enter value"
                                    value={amount}
                                    onChange={(e) => DueAmount(e)}
                                    onKeyPress={bindInput}
                                  />
                                  <div className="dues-amount">
                                    <span>{SettingInfo?.currentType}</span>
                                  </div>
                                </div>
                                <div
                                  className="total-amount-dues-grid-items"
                                  onClick={SaveCollectedAmount}
                                >
                                  <button>
                                    {amount
                                      ? !dueAmountRecord
                                        ? "Save Paid"
                                        : dueAmountRecord < 0
                                        ? "Save"
                                        : "Save Part paid"
                                      : "Save"}
                                  </button>
                                </div>
                              </div>
                             
                            </div>
                          </div>
                        </>
                      ) : dueAmountRecord ? (
                        ""
                      ) : (
                        <div
                          className="add-dues-alignment-invoice"
                          onClick={AddDueAmount}
                        >
                          <p>+ Add due amount</p>
                        </div>
                      )}

                      <div className="text-alignment">
                        <p>
                          To collect
                          {collectedAmount !== dueAmount && (
                            <span
                              onClick={() => {
                                setDueToggle(!dueToggle);
                                setClearDisble(true);
                              }}
                            >
                              Edit
                            </span>
                          )}
                        </p>
                        <h5 style={{ fontSize: "18px" }}>
                          <span>{SettingInfo?.currentType}</span>{" "}
                          {collectedAmount}
                        </h5>
                      </div>
                    </div>
                    <div className="dues-payment">
                      {splitPayment?.length === 0 ? (
                        <div className="option-select-align1">
                          <div className="option-select-group">
                            <div className="text-alignment">
                              <label>Payment method</label>
                              {/* <p>
                                <span onClick={() => SplitPaymentHandler()}>
                                  Split
                                </span>
                              </p> */}
                            </div>
                            <div className="relative">
                              <div
                                className="input-relative"
                                onClick={() => setSubMenuopen(!subMenuOpen)}
                              >
                                <input
                                  type="text"
                                  value={selectedPaymentMethod}
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
                                  <ul>
                                    {paymentsMethod?.map((pay) => {
                                      return (
                                        <li
                                          key={pay._id}
                                          onClick={(e) =>
                                            SelectPaymentMethod(e, pay)
                                          }
                                        >
                                          {pay}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="split-pay-remove-edit-alignment">
                            <div>
                              <p>
                                Split payment
                                {splitPayment?.length > 1 && (
                                  <span
                                    onClick={() => SplitPaymentHandler("edit")}
                                  >
                                    Edit
                                  </span>
                                )}
                              </p>
                            </div>
                            {splitPayment[0]?.method != "Wallet" && (
                              <div>
                                <h6 onClick={() => RemoveSplitPayment()}>
                                  Remove
                                </h6>
                              </div>
                            )}
                          </div>
                          <div className="split-pay-info">
                            {splitPayment?.map((pay) => {
                              return (
                                <div className="text-amount-alignment">
                                  <p>{pay.method}</p>
                                  <h2>
                                    <span>{SettingInfo?.currentType}</span>{" "}
                                    {pay.amount}
                                  </h2>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                    </div>
                  </div>
                  <div className="clear-dues-footer">
                    {clearDisble ? (
                      <button disabled>Clear due</button>
                    ) : (
                      <button onClick={() => ClearDueHandler()}>
                        Clear due
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewInvoiceModal && (
        <ViewInvoiceModal
          modal={viewInvoiceModal}
          toggle={ViewInvoiceModalToggle}
          ViewInvoice={ViewInvoice}
          invoice={invoiceDetail}
          SettingInfo={SettingInfo}
          CustomerDue={true}
        />
      )}
      {openSplitPay && (
        <SplitPay
          modal={openSplitPay}
          toggle={SplitPaymentHandlerToggle}
          paymenttMethod={paymentsMethod}
          TotalAmount={dueAmount}
          edit={edit}
          SettingInfo={SettingInfo}
          splitPayment={splitPayment}
        />
      )}
    </>
  );
}
