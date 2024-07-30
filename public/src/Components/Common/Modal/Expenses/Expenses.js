import React, { useEffect, useState } from "react";
import "./expenses.scss";
import CloseIcon from "../../../../assets/svg/new-close-icon.svg";
import PlusIcon from "../../../../assets/svg/new-plus.svg";
import InvoiceIcon from "../../../../assets/svg/new-inivoice-icon.svg";
import CoffeeIcon from "../../../../assets/svg/coffee.svg";
import WalletIcon from "../../../../assets/svg/new-wallet.svg";
import RedWalletIcon from "../../../../assets/svg/red-wallet.svg";
import ContactIcon from "../../../../assets/svg/new-contact-icon.svg";
import RedContactIcon from "../../../../assets/svg/red-contact-icon.svg";
import RsInIcon from "../../../../assets/svg/rsin.svg";
import RsOutIcon from "../../../../assets/svg/rsout.svg";
import Staff from "../../../../assets/svg/staff.svg";
import RedStaff from "../../../../assets/svg/multi-red-staff.svg";
import AddNewExpenses from "./AddNewExpenses";
import AddNewRecord from "./AddNewRecord";
import Auth from "../../../../helpers/Auth";
import ExpensesCollections from "./expensesCollections";
import CashRegister from "./CashRegister";
import { ApiPost, ApiGet } from "../../../../helpers/API/ApiData";
import moment from "moment";
import CalendarIcon from "../../../../assets/svg/calendar_blue.svg";
import DatePicker from "react-datepicker";
import CashCollectionList from "./CashCollectionList";
import OpeningBalance from "./OpeningBalance";
import FirstOpening from "./FirstOpening";
import { get_Setting } from "../../../../utils/user.util";
import PaymentFilter from "./PaymentFilter";

export default function Expenses(props) {
  const userInfo = Auth.getUserDetail();
  const SettingData = get_Setting();
  let SettingInfo = JSON.parse(localStorage.getItem("setting"));
  const { SetOpenExpencemodal, permission } = props;
  const [openAddNewRecord, setOpenAddNewRecord] = useState(false);
  const [cashRegister, setCashRegister] = useState(false);
  const [expenceData, setExpenceData] = useState([]);
  const [walletWithdrawData, setWalletWithdrawData] = useState([]);
  const [cashCollectionData, setCashCollectionData] = useState([]);
  const [walletTopupData, setWalletTopupData] = useState([]);
  const [TotalexpenceData, setTotalExpenceData] = useState();
  const [TotalCashCollection, setTotalCashCollection] = useState();
  const [TotalWalletTopup, setTotalWalletTopup] = useState();
  const [TotalWalletWithdraw, setTotalWalletWithdraw] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [TotalDeposit, setTotalDeposit] = useState();
  const [TotalTransfers, setTotalTransfers] = useState();
  const [TotalStaffPay, setTotalStaffPay] = useState();
  const [staffPayData, setStaffPayData] = useState([]);
  const [showlist, setShowList] = useState(false);
  const [openingBalanceDetail, setOpeningBalanceDetail] = useState();
  const [closingBalanceDetail, setClosingBalanceDetail] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [openFirstOpeningModal, setOpenFirstOpeningModal] = useState(false);
  const [minTxnDate, setMinTxnDate] = useState(new Date());
  const [paymentFilterData, setPaymentFilterData] = useState("Cash");
  const [paymentFilter, setPaymentFilter] = useState(false);
  useEffect(async () => {
    getTotalExpences();
    getTotalCreditsEntry();
  }, [selectedDate, paymentFilterData]);
  const openingAdded = () => {
    setOpenFirstOpeningModal(false);
    getTotalExpences();
    getTotalCreditsEntry();
  };

  useEffect(async () => {
    let opening = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "CR",
      typeValue: "opening-balance",
      paymentMethod:paymentFilterData
    };
    await ApiPost("expence/company/expenseDetails", opening)
      .then((res) => {
        if (res.data.data.value?.length == 0) {
          setOpenFirstOpeningModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    try {
      let res = await ApiGet("setting/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setMinTxnDate(res.data.data[0]?.expansesMinDate);
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  }, []);

  const getOpeningClosing = async (data) => {
    let openingBalance;
    let openingBal;
    let opening = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "CR",
      typeValue: "opening-balance",
      paymentMethod:paymentFilterData
    };
    await ApiPost("expence/company/expenseDetails", opening)
      .then((res) => {
        openingBalance = res.data.data.total;
        openingBal = res.data.data.value;
      })
      .catch((err) => {
        console.log(err);
      });
    if (openingBal.length > 0) {
      let openingDR = {
        startTime: moment(selectedDate).format("YYYY-MM-DD"),
        endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
        companyId: userInfo?.companyId,
        type: "DR",
        typeValue: "opening-balance",
        paymentMethod:paymentFilterData
      };
      await ApiPost("expence/company/expenseDetails", openingDR)
        .then((res) => {
          setOpeningBalanceDetail(openingBalance - res.data.data.total);
        })
        .catch((err) => {
          console.log(err);
        });

      let closingBala = {
        startTime: moment(selectedDate).format("YYYY-MM-DD"),
        endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
        companyId: userInfo?.companyId,
        paymentMethod:paymentFilterData
      };
      await ApiPost("expence/daywise/expense", closingBala)
        .then(async (res) => {
          setClosingBalanceDetail(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const getTotalExpences = async () => {
    let expence = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "expence",
      paymentMethod: paymentFilterData,
    };
    await ApiPost("expence/company/expenseDetails", expence)
      .then((res) => {
        setTotalExpenceData(res.data.data.total);
        setExpenceData(res.data.data.value);
      })
      .catch((err) => {
        console.log(err);
      });

    let deposits = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "CR",
      typeValue: "deposit",
      paymentMethod: paymentFilterData,
    };
    await ApiPost("expence/company/expenseDetails", deposits)
      .then((res) => {
        setTotalDeposit(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });

    let transfers = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "transfer",
      paymentMethod: paymentFilterData,
    };
    await ApiPost("expence/company/expenseDetails", transfers)
      .then((res) => {
        setTotalTransfers(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });

    let staffpay = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "staff",
      paymentMethod: paymentFilterData,
    };
    await ApiPost("expence/company/expenseDetails", staffpay)
      .then((res) => {
        setTotalStaffPay(res.data.data.total);
        setStaffPayData(res.data.data.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalCreditsEntry = async () => {
    let expence = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod: paymentFilterData,
    };
    await ApiPost("expence/company/topup/wallet", expence)
      .then((res) => {
        setTotalCashCollection(res.data.data?.cashCollection);
        setTotalWalletTopup(res.data.data?.walletTopUp);
        setTotalWalletWithdraw(res.data.data?.walletWithdraw);
        setWalletTopupData(res.data.data?.walletTopUpData);
        setCashCollectionData(res.data.data?.cashCollectionData);
        setWalletWithdrawData(res.data.data?.walletWithdrawData);
      })
      .catch((err) => {
        console.log(err);
      });

    let Allexpence = {
      startTime: moment(selectedDate).subtract(25, "days").format("YYYY-MM-DD"),
      endTime: moment(selectedDate).subtract(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod: paymentFilterData,
    };
    await ApiPost("expence/company/topup/wallet", Allexpence)
      .then((res) => {
        let data = res.data.data?.walletTopUpData.concat(
          res.data.data?.cashCollectionData,
          res.data.data?.walletWithdrawData
        );

        getOpeningClosing(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openAddRecord = () => {
    setOpenAddNewRecord(!openAddNewRecord);
    if (openAddNewRecord == true) {
      getTotalExpences();
      getTotalCreditsEntry();
    }
  };

  const OpenOpeningEdit = () => {
    setOpenModal(!openModal);
    if (openModal == true) {
      getOpeningClosing();
    }
  };

  const openPaymentFilter = () => {
    setPaymentFilter(!paymentFilter);
  };
  return (
    <>
      <div className="expenses-new-modal-blur">
        <div className="expenses-modal-header">
          <div className="all-content-alignment">
            <div className="modal-title">
              <div onClick={() => SetOpenExpencemodal(false)}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h1>Expenses</h1>
            </div>
            <div className="modal-header-expenses-alignment">
              {permission?.filter((obj) => obj.name === "Register")[0]
                ?.isChecked === false ? null : (
                <div
                  className="modal-button"
                  onClick={() => setCashRegister(true)}
                >
                  <div className="cash-register">
                    <button>Registers</button>
                  </div>
                </div>
              )}
              <div className="new-expenses-modal-desgin-alignment">
                <img src={CalendarIcon} alt="CalendarIcon" />
                <span>
                  <DatePicker
                    selected={selectedDate}
                    placeholderText="Date"
                    dateFormat="dd MMM ''yy"
                    // onChange={(date) => handleSelectDate(date)}
                    onChange={(date) => setSelectedDate(new Date(date))}
                    onKeyDown={(e) => e.preventDefault()}
                    maxDate={moment(new Date())._d}
                    minDate={moment(minTxnDate)._d}
                    fixedHeight
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="expenses-modal-body">
          <div className="container">
            <div className="expenses-modal-center-alignment">
              <div className="expenses-modal-width">
                <div
                  className={
                    permission?.filter(
                      (obj) => obj.name === "Add new records"
                    )[0]?.isChecked === false
                      ? "new-one-col-grid-collections-setting"
                      : moment(selectedDate).format("L") ==
                        moment(new Date()).format("L")
                      ? SettingData?.collections?.collectionpaymentMethod?.length > 1  ? "new-two-col-grid-collections-setting":"new-one-col-grid-collections-setting"
                      : "new-one-col-grid-collections-setting"
                  }
                >
                  {SettingData?.collections?.collectionpaymentMethod?.length > 1 && <div className="payment-methoad-type-box-white">
                    <div className="new-content-alignment">
                      <div>
                        <span>Payment method</span>
                        <p>{paymentFilterData}</p>
                      </div>
                      <div onClick={() => openPaymentFilter()}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.75 13.5L11.25 9L6.75 4.5"
                            stroke="#97A7C3"
                            stroke-width="1.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>}
                  {permission?.filter(
                    (obj) => obj.name === "Add new records"
                  )[0]?.isChecked === false
                    ? null
                    : moment(selectedDate).format("L") ==
                        moment(new Date()).format("L") && (
                        <div
                          className="expenses-modal-child-box"
                          onClick={() => openAddRecord()}
                        >
                          <div className="text-grid">
                            <div className="text-grid-items">
                              <img src={PlusIcon} alt="PlusIcon" />
                            </div>
                            <div className="text-grid-items">
                              <p>Add new record</p>
                              <span>Add expense, transfers</span>
                            </div>
                          </div>
                        </div>
                      )}
                </div>

                <div className="open-collection-modal-design">
                  <div className="first-row-alignment">
                    <div>
                      <p >
                        Opening collection
                      </p>
                      {permission?.filter(
                        (obj) => obj.name === "Edit opening collection"
                      )[0]?.isChecked === false
                        ? null
                        : moment(selectedDate).format("L") ==
                            moment(new Date()).format("L") && (
                            <span onClick={() => OpenOpeningEdit()}>Edit</span>
                          )}
                    </div>
                    <div>
                      <h2 style={{ paddingRight: "15px" }}>
                        <a> {SettingInfo?.currentType}</a>{" "}
                        {openingBalanceDetail}
                      </h2>
                    </div>
                  </div>
                  <div className="open-collection-modal-body-height">
                    {TotalCashCollection > 0 && (
                      <div className="new-collection-box-alignment">
                        <div className="new-text-grid">
                          <div className="new-text-grid-items">
                            <img src={InvoiceIcon} alt="InvoiceIcon" />
                          </div>
                          <div className="new-text-grid-items">
                            <div className="new-child-content-alignment">
                              <div>
                                <p>Collection from Sale</p>
                                <span onClick={() => setShowList(!showlist)}>
                                  View list
                                </span>
                              </div>
                              <div>
                                <h3>
                                  <a> {SettingInfo?.currentType}</a>{" "}
                                  {TotalCashCollection}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {TotalWalletTopup > 0 && (
                      <div className="new-collection-all-details-box">
                        <div className="first-details-box-design">
                          <div className="first-details-grid">
                            <div
                              className="first-details-grid-items"
                              style={{ background: "#F4F9FF" }}
                            >
                              <img src={WalletIcon} alt="WalletIcon" />
                            </div>
                            <div className="first-details-grid-items">
                              <div className="new-child-all-content-alignment">
                                <div>
                                  <p>Wallet top-ups</p>
                                </div>
                                <div>
                                  <h2>
                                    <span> {SettingInfo?.currentType}</span>{" "}
                                    {TotalWalletTopup}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="new-child-wallet-alignment">
                          {walletTopupData?.map((exp) => {
                            let expAmount;
                            {
                              exp?.method?.map((expence) => {
                                if (expence?.method === paymentFilterData) {
                                  expAmount = expence?.amount;
                                }
                              });
                            }
                            return (
                              <div className="wallet-grid">
                                <div className="wallet-grid-items">
                                  <img src={ContactIcon} alt="ContactIcon" />
                                </div>
                                <div className="wallet-grid-items">
                                  <div className="wallet-child-content-alignment">
                                    <div>
                                      <span className="wallet-time-align">
                                        {moment(exp?.created).format("hh:mm A")}
                                      </span>
                                      <p>{exp?.customerData?.firstName}</p>
                                    </div>
                                    <div>
                                      <h3>
                                        <a> {SettingInfo?.currentType}</a>{" "}
                                        {expAmount}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {TotalWalletWithdraw > 0 && (
                      <div className="new-collection-all-details-box">
                        <div className="first-details-box-design">
                          <div className="first-details-grid">
                            <div
                              className="first-details-grid-items"
                              style={{ background: "#FDF0F0" }}
                            >
                              <img src={RedWalletIcon} alt="WalletIcon" />
                            </div>
                            <div className="first-details-grid-items">
                              <div className="new-child-all-content-alignment">
                                <div>
                                  <p>Wallet withdrawals</p>
                                </div>
                                <div>
                                  <h2>
                                    <span> {SettingInfo?.currentType}</span>{" "}
                                    {TotalWalletWithdraw}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="new-child-wallet-alignment">
                          {walletWithdrawData?.map((exp) => {
                            return (
                              <div className="wallet-grid">
                                <div className="wallet-grid-items">
                                  <img src={RedContactIcon} alt="ContactIcon" />
                                </div>
                                <div className="wallet-grid-items">
                                  <div className="wallet-child-content-alignment">
                                    <div>
                                      <span className="wallet-time-align">
                                        {moment(exp?.created).format("hh:mm A")}
                                      </span>
                                      <p>{exp?.customerData?.firstName} </p>
                                    </div>
                                    <div>
                                      <h3>
                                        <a> {SettingInfo?.currentType}</a>{" "}
                                        {exp?.walletAmount}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {TotalStaffPay > 0 && (
                      <div className="new-collection-all-details-box">
                        <div className="first-details-box-design">
                          <div className="first-details-grid">
                            <div
                              className="first-details-grid-items"
                              style={{ background: "#FDF0F0" }}
                            >
                              <img src={Staff} alt="Staff" />
                            </div>
                            <div className="first-details-grid-items">
                              <div className="new-child-all-content-alignment">
                                <div>
                                  <p>Staff pay</p>
                                </div>
                                <div>
                                  <h2>
                                    <span> {SettingInfo?.currentType}</span>{" "}
                                    {TotalStaffPay}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="new-child-wallet-alignment">
                          {staffPayData?.map((exp) => {
                            return (
                              <div className="wallet-grid">
                                <div className="wallet-grid-items">
                                  <img src={RedStaff} alt="RedStaff" />
                                </div>
                                <div className="wallet-grid-items">
                                  <div className="wallet-child-content-alignment">
                                    <div>
                                      <span className="wallet-time-align">
                                        {moment(exp?.created).format("hh:mm A")}
                                      </span>
                                      <p>{exp?.staffId?.firstName}  <span>{exp?.description && `${exp?.description}`}</span> </p>
                                    </div>
                                    <div>
                                      <h3>
                                        <a> {SettingInfo?.currentType}</a>{" "}
                                        {exp?.amount}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {TotalexpenceData > 0 && (
                      <div className="new-collection-all-details-box">
                        <div className="first-details-box-design">
                          <div className="first-details-grid">
                            <div
                              className="first-details-grid-items"
                              style={{ background: "#FDF0F0" }}
                            >
                              <img src={CoffeeIcon} alt="CoffeeIcon" />
                            </div>
                            <div className="first-details-grid-items">
                              <div className="new-child-all-content-alignment">
                                <div>
                                  <p>Expenses</p>
                                </div>
                                <div>
                                  <h2>
                                    <span> {SettingInfo?.currentType}</span>{" "}
                                    {TotalexpenceData}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="new-child-wallet-alignment">
                          {expenceData?.map((exp) => {
                            return (
                              <div className="wallet-grid">
                                <div className="wallet-grid-items">
                                  <img
                                    src={exp?.categoryValue?.icon}
                                    alt="ContactIcon"
                                  />
                                </div>
                                <div className="wallet-grid-items">
                                  <div className="wallet-child-content-alignment">
                                    <div>
                                      <span className="wallet-time-align">
                                        {moment(exp?.created).format("hh:mm A")}
                                      </span>
                                      <p>
                                        {exp?.categoryValue?.serviceName}{" "}
                                        <span>
                                          {" "}
                                          {exp?.description &&
                                            ` ${exp?.description}`}
                                        </span>{" "}
                                      </p>
                                    </div>
                                    <div>
                                      <h3>
                                        <a> {SettingInfo?.currentType}</a>{" "}
                                        {exp?.amount}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {TotalDeposit > 0 && (
                      <div className="new-collection-box-alignment">
                        <div className="new-text-grid">
                          <div className="new-text-grid-items">
                            <img src={RsInIcon} alt="RsInIcon" />
                          </div>
                          <div className="new-text-grid-items">
                            <div className="new-child-content-alignment">
                              <div>
                                <p>Transfer from Owner account</p>
                              </div>
                              <div>
                                <h3>
                                  <a> {SettingInfo?.currentType}</a>{" "}
                                  {TotalDeposit}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {TotalTransfers > 0 && (
                      <div className="new-collection-box-alignment">
                        <div className="new-text-grid">
                          <div className="new-text-grid-items">
                            <img src={RsOutIcon} alt="RsOutIcon" />
                          </div>
                          <div className="new-text-grid-items">
                            <div className="new-child-content-alignment">
                              <div>
                                <p>Transfer to Owner account</p>
                              </div>
                              <div>
                                <h3>
                                  <a> {SettingInfo?.currentType}</a>{" "}
                                  {TotalTransfers}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="open-collection-modal-footer">
                    <h2>Total collection</h2>
                    <p>
                      <span> {SettingInfo?.currentType}</span>{" "}
                      {closingBalanceDetail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openAddNewRecord && (
        <AddNewExpenses
          toggle={openAddRecord}
          closingBalanceDetail={closingBalanceDetail}
          SettingInfo={SettingInfo}
        />
      )}
      {cashRegister && (
        <CashRegister
          setCashRegister={setCashRegister}
          SettingInfo={SettingInfo}
          SettingData={SettingData}
          minTxnDate={minTxnDate}
        />
      )}
      {showlist && (
        <CashCollectionList
          setShowList={setShowList}
          cashCollectionData={cashCollectionData}
          SettingInfo={SettingInfo}
          paymentFilterData={paymentFilterData}
        />
      )}
      {openModal && (
        <OpeningBalance
          toggle={OpenOpeningEdit}
          openingBalanceDetail={openingBalanceDetail}
          selectedDate={selectedDate}
          userInfo={userInfo}
          paymentFilterData={paymentFilterData}
        />
      )}
      {openFirstOpeningModal && (
        <FirstOpening
          userInfo={userInfo}
          SetOpenExpencemodal={SetOpenExpencemodal}
          toggle={openingAdded}
        />
      )}
      {paymentFilter && (
        <PaymentFilter
          SettingData={SettingData}
          toggle={openPaymentFilter}
          setPaymentFilterData={setPaymentFilterData}
          paymentFilterData={paymentFilterData}
        />
      )}
    </>
  );
}
