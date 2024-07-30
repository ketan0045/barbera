import React, { useEffect, useState } from "react";
import "./CommissionTransaction.scss";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import PlayIcon from "../../../../assets/svg/playbutton.svg";
import SearchIcon from "../../../../assets/svg/search.svg";
import CalendarIcon from "../../../../assets/svg/calendar_blue.svg";
import ArrowDown from "../../../../assets/svg/Vectors.svg";
import TopIcon from "../../../../assets/svg/gray-top-arrow.svg";
import TopArrowIcon from "../../../../assets/svg/arrow-top.svg";
import Auth from "../../../../helpers/Auth";
import { ApiGet, ApiPost } from "../../../../helpers/API/ApiData";
import moment from "moment";
import DatePicker from "react-datepicker";
import ViewInvoiceModal from "../ViewInvoiceModal";
import Success from "../../Toaster/Success/Success";

function CommissionTransaction(props) {
  const { setCommissionTransactionModal } = props;
  let SettingInfo = JSON.parse(localStorage.getItem("setting"));

  const userInfo = Auth.getUserDetail();
  const [keyName, setKeyName] = useState("Staff commissions");
  const [keyWord, setKeyWord] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [staffCommissions, setStaffCommissions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [popedInvoice, setPopedInvoice] = useState([]);
  const [openCommissionDetails, setOpenCommissionDetails] = useState(false);
  const [particularStaffCommission, setParticularStaffCommission] = useState([]);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [openedIndex, setOpenedIndex] = useState("");

  //reserved array-state for filter
  const [filterCommissions, setFilterCommissions] = useState([]);
  const [filterTransactions, setFilterTransactions] = useState([]);

  //get commission transactions
  const getTransactions = async (e) => {
    let payload = {
      startTime: moment(startDate).startOf("month").format("YYYY-MM-DD"),
      endTime: moment(startDate).endOf("month").format("YYYY-MM-DD"),
    };
    let res = await ApiPost("staff/company/commision/" + userInfo.companyId, payload);
    try {
      if (res.data.status === 200) {
        // let tempTransactionDataWithCommission = res.data.data?.transactions?.filter(data=>data?.commission)
        // let tempCommissionsDataWithCommission = res.data.data?.staffCommision?.filter(data=>data?.data )
        let sortedTransactions = res.data.data?.transactions
          .sort(function (a, b) {
            return a.invoice - b.invoice;
          })
          .reverse();
        let filterInvoice=sortedTransactions?.filter((obj)=> obj?.staffObject)
        let filterStaffCommisions=res.data.data?.staffCommision?.filter((obj)=> obj?.staffObject || obj?.productCommison > 0  )
        setStaffCommissions(filterStaffCommisions);
        setTransactions(filterInvoice);

        //reserved array for filter
        setFilterCommissions(filterStaffCommisions);
        setFilterTransactions(filterInvoice);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  //get invoices
  const getInvoices = async () => {
    let res = await ApiGet("invoice/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setInvoices(res.data.data);
      } else {
        console.log("else");
      }
    } catch (err) {
      console.log("catch");
    }
  };

  //invoice show
  const handleOnInvoice = (invoiceNo) => {
    let filteredInvoice =
      invoices.length > 0 &&
      invoices.filter((obj) => obj.invoiceId.toString() === invoiceNo.toString());
    setPopedInvoice(filteredInvoice[0]);
    ViewInvoiceModalToggle();
    TostMSG();
  };

  //invoice popup
  const ViewInvoiceModalToggle = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
    if (viewInvoiceModal === true) {
    }
  };

  //invoice action toast
  const TostMSG = (data) => {
    if (data) {
      if (data === "SMS") {
        setSuccess(true);
        setToastmsg("SMS sent successfully!");
      } else if (data === "DELETE") {
        setSuccess(true);
        setToastmsg("Invoice deleted!");
      } else if (data === "EDIT") {
        setSuccess(true);
        setToastmsg("Changes saved!");
      }else if (data === "Due") {
        setSuccess(true);
        setToastmsg("Due cleared!");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  //commission data popup
  const handleOnClick = (data, index) => {
    setOpenCommissionDetails(!openCommissionDetails);
    setParticularStaffCommission(data);
    setOpenedIndex(index);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  useEffect(() => {
    getTransactions();
  }, [startDate]);

  useEffect(() => {
    if (keyWord) {
      var filter =
        filterCommissions.length > 0 &&
        filterCommissions.filter(
          (obj) => obj.staffName && obj.staffName.toLowerCase().includes(keyWord.toLowerCase())
        );
      setStaffCommissions(filter);
    } else {
      setStaffCommissions(filterCommissions);
    }
  }, [keyWord]);

  useEffect(() => {
    if (search) {
      var filter =
        filterTransactions.length > 0 &&
        filterTransactions.filter(
          (obj) =>
            (obj.invoice && obj.invoice.toString().includes(search.toString())) ||
            (obj.serviceName && obj.serviceName.toLowerCase().includes(search.toLowerCase())) ||
            (obj.staffName && obj.staffName.toLowerCase().includes(search.toLowerCase()))
        );
      setTransactions(filter);
    } else {
      setTransactions(filterTransactions);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <div>
      <div className="cus-commmission-modal">
        <div className="commission-modal-header">
          <div className="container-long">
            <div className="commission-modal-header-alignment">
              <div className="commission-custom-modal-heading-title">
                <div className="modal-close" onClick={() => setCommissionTransactionModal(false)}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Commissions</h2>
                </div>
              </div>
              {/* <div className="demo-commission-details-button">
                <button>
                  <img src={PlayIcon} alt="PlayIcon" /> Demo
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="container-long">
          <div className="commission-details-section-left-right-padding">
            <div className="commission-details-grid">
              <div className="commission-details-heading-grid-items">
                <div className="commission-tab-design">
                  <ul onClick={(e) => setKeyName(e.target.innerText)}>
                    <li className={keyName === "Staff commissions" && "active"}>
                      Staff commissions
                    </li>
                    <li className={keyName === "Transactions" && "active"}>Transactions</li>
                  </ul>
                </div>
              </div>
              {keyName === "Staff commissions" && (
                <div className="commission-details-heading-grid-items">
                  <div className="commission-serch-left-align">
                    <div className="staff-commission-member-serch">
                      <div className="staff-commission-input-design">
                        <input
                          type="search"
                          placeholder="Search staff"
                          onChange={(e) => setKeyWord(e.target.value)}
                        />
                      </div>
                      <div className="staff-commission-member-search-alignment">
                        <img src={SearchIcon} alt="SearchIcon" />
                      </div>
                      <div className="serch-input-two-tab-display-flex">
                      <div className="staff-commission-details-calender">
                        <img src={CalendarIcon} alt="CalendarIcon" />
                        <span className="date-picker-style">
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                          />
                        </span>
                      </div>
                      </div>
                    </div>
                    <div className="staff-commision-membership-gold-table">
                      <table className="staff-commision-membership-gold-table-details">
                        <tr>
                          <th align="left">Staff name</th>
                          <th align="left">Commission type</th>
                          <th align="left">Total sales</th>
                          <th align="center">
                            Service <br /> commission
                          </th>
                          <th align="center">
                            Product <br /> commission
                          </th>
                          <th>Total commission</th>
                          <th>Expand</th>
                        </tr>
                        {staffCommissions.length > 0 &&
                          staffCommissions.map((item, index) => {
                            return (
                              <>
                                <tr>
                                  <td>
                                    <span>{item?.staffName}</span>
                                  </td>
                                  <td>
                                    <span>
                                      {item?.staffObject?.commission[0]?.commission_type?.value ? item?.staffObject?.commission[0]?.commission_type?.value : "Product"}
                                    </span>
                                  </td>
                                  <td>
                                    <span>
                                      <a>{SettingInfo?.currentType}</a>{" "}
                                      {item?.totalSales?.toFixed(2) || 0}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-center">
                                      <a>{SettingInfo?.currentType}</a>{" "}
                                      {item?.serviceCommison?.toFixed(2) || 0}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-center">
                                      <a>{SettingInfo?.currentType}</a>{" "}
                                      {item?.productCommison?.toFixed(2) || 0}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-center">
                                      <a>{SettingInfo?.currentType}</a>{" "}
                                      {item?.data?.toFixed(2) || 0}
                                    </span>
                                  </td>
                                  <td
                                    className="arrow-down-img-center"
                                    onClick={() =>
                                      handleOnClick(item?.staffObject?.commission, index)
                                    }
                                  >
                                    {openCommissionDetails && openedIndex === index ? (
                                      <img src={TopArrowIcon} alt="TopArrowIcon" />
                                    ) : (
                                      <img src={ArrowDown} alt="ArrowDown" />
                                    )}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                      </table>
                      {openCommissionDetails && (
                        <div className="comission-modal-wrapper">
                          <div className="CommissionTransaction-modal-md">
                            <div className="comission-header">
                              <div className="comission-header-alignment">
                                <div>
                                  <div
                                    onClick={() => setOpenCommissionDetails(!openCommissionDetails)}
                                  >
                                    <img src={CloseIcon} alt="close" />
                                  </div>
                                  <div>
                                    <h1>Commission details</h1>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="comission-body">
                              <div className="CycleEverydisplay">
                                <p>Cycle: Every month</p>
                              </div>
                              <div className="Servicecommissiondisplay">
                                <h3>Service commission</h3>
                                <div className="service-commission-width">
                                  <p>
                                    {particularStaffCommission?.length > 0 &&
                                      particularStaffCommission[0]?.commission_type?.value}{" "}
                                    commission{" "}
                                    {particularStaffCommission?.length > 0 &&
                                    particularStaffCommission[0]?.commission_type?.targetValue
                                      ? `on ${
                                          particularStaffCommission?.length > 0 &&
                                          particularStaffCommission[0]?.commission_type?.targetValue
                                        }`
                                      : ""}
                                    {particularStaffCommission?.length > 0 &&
                                      particularStaffCommission[0]?.commission_type?.targetRange?.map(
                                        (item) => {
                                          return (
                                            <p>
                                              from <a>{SettingInfo?.currentType}</a> {item.from}{" "}
                                              {item.to !== "" && item.to !== "0" ? (
                                                <>
                                                  to <a>{SettingInfo?.currentType}</a>
                                                </>
                                              ) : (
                                                "and"
                                              )}{" "}
                                              {item.to === "" || item.to === "0"
                                                ? "above"
                                                : item.to}{" "}
                                              - {item.commission}%
                                            </p>
                                          );
                                        }
                                      )}
                                  </p>
                                </div>
                              </div>
                              <div className="Servicecommissiondisplay">
                                <h3>Product commission</h3>
                                <div className="service-commission-width">
                                  <p>
                                    
                                    {particularStaffCommission?.length > 0 &&
                                    particularStaffCommission[0]?.product_type?.value ===
                                      "All products"
                                      ? "All products added"
                                      : `${
                                          (particularStaffCommission?.length > 0 &&
                                            particularStaffCommission[0]?.product_type?.commission
                                              ?.length) ||
                                          0
                                        } products added`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {keyName === "Transactions" && (
                <div className="commission-details-heading-grid-items">
                  <div className="commission-serch-left-align">
                    <div className="staff-commission-member-serch">
                      <div className="staff-commission-input-design">
                        <input
                          type="search"
                          placeholder="Search staff, item or invoice #"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="staff-commission-member-search-alignment">
                        <img src={SearchIcon} alt="SearchIcon" />
                      </div>
                      <div className="serch-input-two-tab-display-flex">
                        {/* <div className="staff-commission-position-relative">
                          <div className="icon-inputr-relative">
                            <div className="all-staff-selected-input-deign">
                              <input type="text" placeholder="All staff selected" readOnly />
                            </div>
                            <div className="down-icon-alignment">
                              <img src={TopIcon} alt="DownIcon" />
                            </div>
                          </div>
                        </div> */}
                        <div className="staff-commission-details-calender">
                          <img src={CalendarIcon} alt="CalendarIcon" />
                          <span className="date-picker-style">
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM yyyy"
                              showMonthYearPicker
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="transation-commission-details-gold-table">
                      <table className="transation-commission-gold-table-details">
                        <tr>
                          <th align="left">Date</th>
                          <th align="left">Invoice #</th>
                          <th align="left">Staff assigned</th>
                          <th align="left">Item</th>
                          <th align="center">
                            Sale <br /> amount
                          </th>
                          <th align="center">
                          Commission <br/> (%)
                          </th>
                          <th align="right">
                          Commission <br/>($)
                          </th>
                        </tr>
                        {transactions.length > 0 &&
                          transactions.map((item) => {
                            return (
                              <tr>
                                <td>
                                  <span>{moment(item?.date).format("DD MMM YYYY")}</span>
                                </td>
                                <td>
                                  <span
                                    className="invoice-blue-color"
                                    onClick={() => handleOnInvoice(item?.invoice)}
                                  >
                                    {item?.invoice}
                                  </span>
                                </td>
                                <td>
                                  <span>{item?.staffName}</span>
                                </td>
                                <td className="table-dynamic-width">
                                  <span>
                                    {item?.isService || item?.isService === undefined ? item?.serviceName : item?.productName}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-center">
                                    <a>{SettingInfo?.currentType}</a>{" "}
                                    {item?.serviceAmount?.toFixed(2)}
                                  </span>
                                </td>
                                <td align="center">
                                  <span className="text-center">{item?.commission || 0} {item?.commissionEarned !== "N/A" && "%"}</span>
                                </td>
                                <td>
                                <span className="text-right">
                                    <a> {item?.commissionEarned !== "N/A" && SettingInfo?.currentType}</a>{" "}
                                    {item?.commissionEarned === "N/A" ? item?.commissionEarned : item?.commissionEarned?.toFixed(2) || 0}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                         
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {viewInvoiceModal && (
        <div>
          <ViewInvoiceModal
            modal={viewInvoiceModal}
            toggle={ViewInvoiceModalToggle}
            ViewInvoice={handleOnInvoice}
            invoice={popedInvoice}
            getInvoices={getInvoices}
            TostMSG={TostMSG}
            SettingInfo={SettingInfo}
          />
        </div>
      )}
    </div>
  );
}

export default CommissionTransaction;
