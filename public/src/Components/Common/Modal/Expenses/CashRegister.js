import React, { useState, useEffect, useDebugValue } from "react";
import CloseIcon from "../../../../assets/svg/new-close-icon.svg";
import ExpenseFilter from "./ExpenseFilter";
import CalendarIcon from "../../../../assets/svg/calendar_blue.svg";
import ReactDatePicker from "react-datepicker";
import { ApiPost } from "../../../../helpers/API/ApiData";
import moment from "moment";
import Auth from "../../../../helpers/Auth";
import dropIcon from "../../../../assets/svg/rigt-gray.svg";
import ViewInvoiceModal from "../ViewInvoiceModal";
import PaymentFilter from "./PaymentFilter";

export default function CashRegister(props) {
  const userInfo = Auth.getUserDetail();
  const { setCashRegister, SettingInfo,minTxnDate,SettingData } = props;
  const [openFilter, setOpenFilter] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filterData, setFilterData] = useState([]);
  const [registerData, setRegisterData] = useState([]);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [closingBalanceDetail, setClosingBalanceDetail] = useState();
  const [walletOpeningData, setwalletOpeningData] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState(false);
  const [paymentFilterData, setPaymentFilterData] = useState("Cash");
  
 

  useEffect(() => {
    if (endDate) {
      getCashRegisterDetails();
    }
  }, [startDate, endDate,paymentFilterData]);

  
  useEffect(async()=>{
    if (endDate) {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
      companyId: userInfo.companyId,
      paymentMethod:paymentFilterData
    };

    let res = await ApiPost('expence/cashRegister?cash=opening-balance', payload);
    try {
      if (res.data.status === 200) {
        let registerDatasss = Object.entries(res.data.data[0]);
      
        if(registerDatasss?.length > 0){
        setwalletOpeningData(registerDatasss.reverse())
        }else{
          setwalletOpeningData([])
        }

      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  }
  },[startDate, endDate])

  useEffect(async () => {
    let closingBala = {
      startTime: moment(new Date()).format("YYYY-MM-DD"),
      endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
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

      setFilterData([])
  }, [paymentFilterData]);

  useEffect(async () => {
    if (filterData?.length > 0) {

      let Api = "expence/cashRegister?";
      filterData?.map((filter, i) => {
        if (filterData?.length == 1) {
          Api = Api + `cash=${filter}`;
        } else {
          if (i == 0) {
            Api = Api + `cash=${filter}`;
          } else {
            Api = Api + `&&cash=${filter}`;
          }
        }
      });
 
      let temEndDate = moment(endDate).add(1, "days")._d;
      let payload = {
        startTime: moment(startDate).format("L"),
        endTime: moment(temEndDate).format("L"),
        companyId: userInfo.companyId,
        paymentMethod:paymentFilterData
      };
      let res = await ApiPost(Api, payload);
      try {
        if (res.data.status === 200) {
          let registerDatasss = Object.entries(res.data.data[0]);
          let tempData = registerDatasss?.sort((a, b) => {
            return new Date(a[0]) - new Date(b[0]);
          });
          setRegisterData(tempData.reverse());
        } else {
          console.log("error");
        }
      } catch {
        console.log("something went wrong");
      }
    } else {
      getCashRegisterDetails();
    }
  }, [filterData]);

  const getCashRegisterDetails = async () => {
 
    if (endDate !== null) {
      let temEndDate = moment(endDate).add(1, "days")._d;
      let payload = {
        startTime: moment(startDate).format("L"),
        endTime: moment(temEndDate).format("L"),
        companyId: userInfo.companyId,
        paymentMethod:paymentFilterData
      };
      let res = await ApiPost("expence/cashRegister", payload);
      try {
        if (res.data.status === 200) {
          let registerDatasss = Object.entries(res.data.data[0]);
          let tempData = registerDatasss?.sort((a, b) => {
            return new Date(a[0]) - new Date(b[0]);
          });
          setRegisterData(tempData.reverse());
        } else {
          console.log("error");
        }
      } catch {
        console.log("something went wrong");
      }
    }
  };

  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setFilterData([]);
  };

  const OpenInvoiceModal = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
    setInvoiceDetail(data);
  };

  const openPaymentFilter=()=>{
    setPaymentFilter(!paymentFilter)
  }
  return (
    <>
      <div className="cash-register-modal-design">
        <div className="cash-register-modal-header">
          <div className="all-content-alignment">
            <div className="modal-title" onClick={() => setCashRegister(false)}>
              <div>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h1>Register</h1>
            </div>
            <div className="new-statement-modal-desgin-alignment">
              <img src={CalendarIcon} alt="CalendarIcon" />
              <span>
                <ReactDatePicker
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  minDate={moment(minTxnDate)._d}
                  placeholderText="Date"
                  dateFormat="d MMM ''yy"
                  onChange={handleOnChange}
                  onKeyDown={(e) => e.preventDefault()}
                  selectsRange
                  fixedHeight
                />
              </span>
            </div>
          </div>
        </div>
        <div className="cash-register-modal-body">
          <div className="cash-register-modal-body-width">
            <div className="cash-register-modal-body-header-alignment">
              <div className="current-collection">
                <span>Current {paymentFilterData} collection</span>
                <p>
                  <a>{SettingInfo?.currentType}</a> {closingBalanceDetail}
                </p>
                {SettingData?.collections?.collectionpaymentMethod?.length > 1  && <img  src={dropIcon} alt="dropIcon" onClick={()=>openPaymentFilter()}/>}
              </div>
              <div className="flex justify-center items-center">
                {filterData?.length > 0 && (
                  <span
                    style={{
                      color: "#1479FF",
                      fontWeight: "500",
                      padding: "15px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                    onClick={() => setFilterData([])}
                  >
                    Clear Filter
                  </span>
                )}

                <button onClick={() => setOpenFilter(true)}>
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      y1="3.24756"
                      x2="18"
                      y2="3.24756"
                      stroke="#1479FF"
                      stroke-width="1.5"
                    />
                    <line
                      y1="9.49756"
                      x2="18"
                      y2="9.49756"
                      stroke="#1479FF"
                      stroke-width="1.5"
                    />
                    <circle
                      cx="4.5"
                      cy="3.37256"
                      r="1.875"
                      fill="white"
                      stroke="#1479FF"
                      stroke-width="1.25"
                    />
                    <line
                      y1="15.3726"
                      x2="18"
                      y2="15.3726"
                      stroke="#1479FF"
                      stroke-width="1.5"
                    />
                    <circle
                      cx="4.5"
                      cy="15.6274"
                      r="1.875"
                      fill="white"
                      stroke="#1479FF"
                      stroke-width="1.25"
                    />
                    <circle
                      cx="13.5"
                      cy="9.24756"
                      r="1.875"
                      fill="white"
                      stroke="#1479FF"
                      stroke-width="1.25"
                    />
                  </svg>
                  {filterData?.length > 0 ? (
                    <span>Filter applied</span>
                  ) : (
                    <span>Apply filter</span>
                  )}
                </button>
              </div>
            </div>

            {registerData?.length > 0 ? (
              registerData?.map((register,i) => {
                let openingCollection;
                return (
                  <div className="cash-register-modal-body-data-alignment">
                    <div className="first-header-alignment">
                      <span>
                        Date - {moment(register[0]).format("Do MMM YY")}
                      </span>
                    </div>
                    <div className="cash-register-modal-body-table">
                      <table>
                        <tr>
                          <td>
                            <div
                              className="time-text-nowrap"
                              style={{ color: "#97A7C3" }}
                            >
                              <span>Time</span>
                            </div>
                          </td>
                          <td>
                            <div
                              className="time-text-nowrap"
                              style={{ color: "#97A7C3" }}
                            >
                              <span>Category</span>
                            </div>
                          </td>
                          <td>
                            <div
                              className="time-text-nowrap"
                              style={{ color: "#97A7C3" }}
                            >
                              <span>Description</span>
                            </div>
                          </td>

                          <td>
                            {" "}
                            <div
                              className="amount-style"
                              style={{ color: "#97A7C3" }}
                            >
                              <span>
                                Debit (<a>{SettingInfo?.currentType}</a>)
                              </span>
                            </div>
                          </td>
                          <td>
                            <div
                              className="amount-style"
                              style={{ color: "#97A7C3" }}
                            >
                              <span>
                                Credit (<a>{SettingInfo?.currentType}</a>)
                              </span>
                            </div>
                          </td>
                        </tr>
                        {register[1].combineData
                          ?.sort(function (a, b) {
                            if (a.created < b.created) return -1;
                            if (a.created > b.created) return 1;
                            return 0;
                          })
                          .reverse()
                          ?.map((entry) => {
                          //   let hideEntry
                          
                          //   if(walletOpeningData?.length > 0){
                          //   walletOpeningData[i][1]?.combineData?.map((wallet,i)=>{
                          //     if(wallet?._id  === entry?._id && i == 0){
                          //       hideEntry=true
                          //     }
                          //   })
                          // }
                          // if (
                          //   openingCollection === undefined &&
                          //   entry?.cashType == "opening-balance"
                          // ) {
                          //     openingCollection = entry?.cashAmount;
                          //     console.log(
                          //       "openingCollection",
                          //       openingCollection
                          //     );
                          //     return <></>;
                          //   } else {
                              return (
                                <tr>
                                  <td>
                                    <div className="time-text-nowrap">
                                      <span>
                                        {moment(entry?.created).format(
                                          "hh:mm A"
                                        )}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="time-text-nowrap">
                                      <span>
                                        {entry?.cashType == "transfer"
                                          ? "Deposit (Owner)"
                                          : entry?.cashType == "deposit"
                                          ? "Receive (Owner)"
                                          : entry?.cashType == "wallet-topup" ||
                                            entry?.cashType == "wallet-withdraw"
                                          ? "Wallet "
                                          : entry?.cashType == "expence"
                                          ? "Expense"
                                          : entry?.cashType == "invoice"
                                          ? "Sale"
                                          : entry?.cashType == "staff"
                                          ? "Staff"
                                          : "Collection difference"}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    {" "}
                                    <div className="invoice-show">
                                      {entry?.cashType == "wallet-topup"
                                        ? `Credit in ${entry?.user_id?.firstName}'s wallet`
                                        : entry?.cashType == "wallet-withdraw"
                                        ? `Debit from ${entry?.user_id?.firstName}'s wallet`
                                        : entry?.cashType == "transfer" ||
                                          entry?.cashType == "deposit"
                                        ? entry?.description ? entry?.description :"-"
                                        : entry?.cashType == "staff"
                                        ? entry?.description ? `${entry?.staffId?.firstName} | ${entry?.description} `:`Salary of ${entry?.staffId?.firstName} `
                                        : entry?.cashType == "expence"
                                        ? entry?.categoryValue?.serviceName
                                        : entry?.cashType == "invoice"
                                        ? ""
                                        : "Collection edited"}
                                      {entry?.cashType == "invoice" ? (
                                        entry?.user_id ? (
                                          `Due cleared by ${entry?.user_id?.firstName} `
                                        ) : entry?.previousDueClearRecord ? (
                                          `Due cleared & `
                                        ) : (
                                          <span
                                            onClick={() =>
                                              OpenInvoiceModal(entry)
                                            }
                                          >
                                            #{entry?.invoiceId}
                                          </span>
                                        )
                                      ) : (
                                        ""
                                      )}
                                      {entry?.previousDueClearRecord && (
                                        <span
                                          onClick={() =>
                                            OpenInvoiceModal(entry)
                                          }
                                        >
                                          #{entry?.invoiceId}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    {entry?.cashValue === "DR" && (
                                      <div className="amount-style">
                                        <span>{entry?.cashAmount}</span>
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    {entry?.cashValue === "CR" && (
                                      <div className="amount-style">
                                        <span>{entry?.cashAmount}</span>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          // }
                          )
                          }

                        <tr>
                          <td colSpan={2}>
                            <div className="time-text-nowrap">
                              <span>Total collection</span>
                            </div>
                          </td>
                          <td>
                            <div className="time-text-nowrap">
                              <span></span>
                            </div>
                          </td>
                          <td>
                            {" "}
                            <div className="amount-style">
                              <span>
                                <a>{SettingInfo?.currentType}</a>{" "}
                                {register[1].drEntry}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="amount-style">
                              <span>
                                <a>{SettingInfo?.currentType}</a>{" "}
                                {openingCollection
                                  ? register[1].crEntry - openingCollection
                                  : register[1].crEntry}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="cash-register-modal-body-data-alignment">
                <div className="norecord-header-alignment">
                  <span>No Record Found</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {openFilter && (
        <ExpenseFilter
          setOpenFilter={setOpenFilter}
          setFilters={setFilterData}
          filters={filterData}
        />
      )}
      {viewInvoiceModal && (
        <ViewInvoiceModal
          modal={viewInvoiceModal}
          toggle={OpenInvoiceModal}
          ViewInvoice={OpenInvoiceModal}
          invoice={invoiceDetail}
          SettingInfo={SettingInfo}
          CustomerDue={true}
        />
      )}
      {paymentFilter && <PaymentFilter SettingData={SettingData} toggle={openPaymentFilter} setPaymentFilterData={setPaymentFilterData} paymentFilterData={paymentFilterData} />}
    </>
  );
}
