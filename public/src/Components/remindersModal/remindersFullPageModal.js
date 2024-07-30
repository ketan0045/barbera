import React, { useEffect, useState } from "react";
import "./remindersModal.scss";
import CloseIcon from "../../assets/svg/reminder-close.svg";
import SearchIcon from "../../assets/svg/reminder-search.svg";
import FilterIcon from "../../assets/svg/reminder-filter-icon.svg";
import OptionsIcon from "../../assets/svg/Options.svg";
import SelectIcon from "../../assets/svg/rigt-gray.svg";
import AddNewReminderModal from "./addNewReminderModal";
import SmsWallet from "./smsWallet";
import BuySmsModal from "./buySmsModal";
import ReminderMultipleServices from "./reminderMultipleServices";
import { ApiGet, ApiPost, ApiPut } from "../../helpers/API/ApiData";
import Auth from "../../helpers/Auth";
import Success from "../Common/Toaster/Success/Success";
import moment from "moment";
import CalendarIcon from "../../assets/svg/calendar_blue.svg";
import DatePicker from "react-datepicker";
import MiniCloseIcon from "../../assets/svg/new-close-icon-1.svg";
import MessageIcon from "../../assets/svg/message-back-icon.svg";
import OutsideAlerter from "../Common/OutsideAlerter";

export default function RemindersFullPageModal(props) {
  let userInfo = Auth.getUserDetail();
  const [buySmsModal, setBuySmsModal] = useState(false);
  const [newreminder, setNewreminder] = useState(false);
  const [activeTab, setActiveTab] = useState("Service");
  const [multipleOpen, setMultipleOpen] = useState(false);
  const [buySmsOpen, setBuySmsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [availSmS, setAvailSmS] = useState(0);
  const [smSData, setSmSData] = useState({});
  const [serviceReminderData, setServiceReminderData] = useState([]);
  const [allserviceReminderData, setAllServiceReminderData] = useState([]);
  const [EditReminderData, setEditReminderData] = useState();
  const [ReminderData, setReminderData] = useState([]);
  const [allReminderData, setAllReminderData] = useState([]);
  const [startDate, setStartDate] = useState(moment(new Date()).subtract(30, "days")._d);
  const [endDate, setEndDate] = useState(new Date());
  const [SMSPreview, setSMSPreview] = useState(false);
  const [customer, setCustomer] = useState("");
  const [customerService, setCustomerService] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [optionsShow, setOptionsShow] = useState(false);
  const [targetIndex, setTargetIndex] = useState();

  const AddNewReminder = (data) => {
    setNewreminder(!newreminder);
    setEditReminderData()
    if (data === true) {
      setSuccess(true);
      setToastmsg("New reminder added!");
      getAllreminder();
    }
    if (data === false) {
      setSuccess(true);
      setEr("error");
      setToastmsg("Something went wrong");
      getAllreminder();
    }
  };

  const multiReminderAdded = (data) => {
    setMultipleOpen(!multipleOpen);
    setEditReminderData()
    if (data === true) {
      setSuccess(true);
      setToastmsg("New reminders added!");
      getAllreminder();
    }
    if (data === false) {
      setSuccess(true);
      setEr("error");
      setToastmsg("Something went wrong");
      getAllreminder();
    }
  };

  const NewSmSPurchesed = (data) => {
    setBuySmsOpen(!buySmsOpen);
    if (data === true) {
      setSuccess(true);
      setToastmsg("SMS purchased!");
      getSmsData();
    }
    if (data === false) {
      setSuccess(true);
      setEr("error");
      setToastmsg("Something went wrong");
      getSmsData();
    }
  };

  useEffect(() => {
    getAllreminder();
    getSmsData();
  }, []);

  useEffect(() => {
    if (endDate) {
      getAllreminderLogs();
    }
  }, [startDate, endDate]);

  const getSmsData = async () => {
    try {
      let res = await ApiGet("smsCheck/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setAvailSmS(res?.data.data?.finalData?.Remaining);
        setSmSData(res?.data.data?.finalData);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const getAllreminder = async () => {
    try {
      let res = await ApiGet("serviceReminder/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setServiceReminderData(res?.data?.data);
        setAllServiceReminderData(res?.data?.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const getAllreminderLogs = async () => {
    let logsData = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(endDate).add(1, "days").format("YYYY-MM-DD"),
    };
    try {
      let res = await ApiPost("reminderLogs/company/" + userInfo.companyId, logsData);
      if (res.data.status === 200) {
        console.log("remonder", res);
        setReminderData(res?.data?.data);
        setAllReminderData(res?.data?.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const searchServiceHandler = (e) => {
    setServiceSearch(e.target.value);
    let filterData =
      allserviceReminderData?.length > 0 &&
      allserviceReminderData.filter(
        (obj) =>
          obj?.serviceIds[0]?.serviceId?.serviceName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          obj?.serviceIds[0]?.serviceId?.categoryName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    setServiceReminderData(filterData);
  };

  const optionsToggle = (index) => {
    setOptionsShow(!optionsShow);
    if (optionsShow) {
      setTargetIndex(null);
    } else {
      setTargetIndex(index);
    }
  };

  const EditReminder = (remind) => {
    setEditReminderData(remind);
    setNewreminder(!newreminder);
    if (remind === true) {
      setSuccess(true);
      setToastmsg("Reminders edited!");
      getAllreminder();
      setEditReminderData();
    }
    if (remind === false) {
      setSuccess(true);
      setEr("error");
      setToastmsg("Something went wrong");
      getAllreminder();
      setEditReminderData();
    }
  };

  const inactiveORactiveReminder = async (remind, data) => {
    let reminderData = {
      status: data === "active" ? true : false,
    };
    try {
      let res = await ApiPut(`serviceReminder/${remind?._id}`, reminderData);
      if (res.data.status === 200) {
        getAllreminder();
      } else {
        console.log("in the else");
        getAllreminder();
      }
    } catch (err) {
      console.log("error while getting Categories", err);
      getAllreminder();
    }
    optionsToggle();
  };
  return (
    <>
      <div className="reminder-full-page-modal-blur">
        <div className="reminder-full-page-header">
          <div className="icon-header-text-alignment">
            <div onClick={() => props.setOpenReminder(false)}>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
            <h1>Reminders</h1>
          </div>
          <div className="modal-all-button-alignment">
            <button onClick={() => setBuySmsModal(!buySmsModal)}>
              <span>SMS Wallet</span>
              <a>{availSmS} left</a>
            </button>
            <button onClick={() => AddNewReminder()}>Add new reminder</button>
          </div>
        </div>
        <div className="reminder-full-page-body-alignment">
          <div className="reminder-container">
            <div className="reminder-grid">
              <div className="reminder-grid-items">
                <div
                  className={activeTab === "Service" ? "all-tab-alignment all-tab-alignment-active " : "all-tab-alignment"}
                  onClick={() => setActiveTab("Service")}
                >
                  <div className="tab-design">
                    <span>Service reminders</span>
                  </div>
                </div>
                <div
                  className={activeTab === "Reminder" ? "all-tab-alignment all-tab-alignment-active " : "all-tab-alignment"}
                  onClick={() => setActiveTab("Reminder")}
                >
                  <div className="tab-design">
                    <span>Reminders logs</span>
                  </div>
                </div>
              </div>
              <div className="reminder-grid-items">
                {activeTab === "Service" && (
                  <>
                    <div className="search-filter-all-content-alignment">
                      <div className="search-reminder-box">
                        <input type="search" placeholder="Search service" autoFocus value={serviceSearch} onChange={(e) => searchServiceHandler(e)} />
                        <div className="search-icon-alignment">
                          <img src={SearchIcon} alt="SearchIcon" />
                        </div>
                      </div>
                      <div className="filter-button">
                        <img src={FilterIcon} alt="FilterIcon" />
                      </div>
                    </div>
                    <div className="reminder-table-design-alignment">
                      <table>
                        <tr>
                          <th align="left">
                            <span>Services</span>
                          </th>
                          <th align="center">
                            <span>Interval</span>
                          </th>
                          <th align="center">
                            <span>Status</span>
                          </th>
                          <th align="left">
                            <span></span>
                          </th>
                        </tr>
                        {serviceReminderData?.map((remind, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                <div className="content-border-text-alignment" style={{    width: "380px"}}>
                                  <div
                                    className="service-divider"
                                    style={{
                                      backgroundColor: remind?.serviceIds[0]?.serviceId?.colour,
                                      borderRadius: "5px",
                                      height: "100%",
                                      width: "5px",
                                    }}
                                  ></div>
                                  <div className="left-side-text-alignment">
                                    <p>{remind?.serviceIds[0]?.serviceId?.serviceName}</p>
                                    <span>{remind?.serviceIds[0]?.serviceId?.categoryName}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="interval-text-style">
                                  <span>{remind?.serviceIds[0]?.interval} days</span>
                                </div>
                              </td>
                              <td>
                                <div className="button-text-alignment">
                                  {remind?.status ? (
                                    <>
                                      <button>Active</button>
                                    </>
                                  ) : (
                                    <>
                                      <button className="expire-button-align">Inactive</button>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    flex: "1",
                                    justifyContent: "end",
                                    cursor: "pointer",
                                    position: "relative",
                                  }}
                                >
                                  <div className="button-text-alignment" onClick={(e) => optionsToggle(i)}>
                                    {remind?.status ? (
                                      <>
                                        <div className="">
                                          <img src={OptionsIcon} alt="OptionsIcon" />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="">
                                          <img src={OptionsIcon} alt="OptionsIcon" />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  {optionsShow && targetIndex === i && (
                                    <OutsideAlerter toggle={optionsToggle}>
                                      <div className="attendance-options-container ">
                                        {!remind?.status ? (
                                          <span className="attendance-options-edit-clock" onClick={() => inactiveORactiveReminder(remind, "active")}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path
                                                d="M9.15333 13.9999C9.03613 14.202 8.8679 14.3697 8.66548 14.4863C8.46307 14.6029 8.23359 14.6642 8 14.6642C7.76641 14.6642 7.53693 14.6029 7.33452 14.4863C7.13211 14.3697 6.96387 14.202 6.84667 13.9999M12 5.33325C12 4.27239 11.5786 3.25497 10.8284 2.50482C10.0783 1.75468 9.06087 1.33325 8 1.33325C6.93913 1.33325 5.92172 1.75468 5.17157 2.50482C4.42143 3.25497 4 4.27239 4 5.33325C4 9.99992 2 11.3333 2 11.3333H14C14 11.3333 12 9.99992 12 5.33325Z"
                                                stroke="#1479FF"
                                                stroke-width="1.2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                              />
                                            </svg>
                                            Active reminder
                                          </span>
                                        ) : (
                                          <span
                                            className="attendance-options-danger attendance-options-danger-clock"
                                            onClick={() => inactiveORactiveReminder(remind, "inactive")}
                                          >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g clip-path="url(#clip0_12_3738)">
                                                <path
                                                  d="M9.15329 14.0001C9.03608 14.2021 8.86785 14.3698 8.66544 14.4864C8.46303 14.603 8.23354 14.6644 7.99996 14.6644C7.76637 14.6644 7.53689 14.603 7.33447 14.4864C7.13206 14.3698 6.96383 14.2021 6.84663 14.0001M12.42 8.66675C12.1234 7.58102 11.982 6.45878 12 5.33341C12.001 4.60879 11.8052 3.89748 11.4335 3.27548C11.0618 2.65347 10.5281 2.14412 9.88937 1.80184C9.25068 1.45956 8.53101 1.29721 7.80723 1.33213C7.08344 1.36704 6.38274 1.59791 5.77996 2.00008M4.17329 4.17341C4.05747 4.54916 3.99903 4.94023 3.99996 5.33341C3.99996 10.0001 1.99996 11.3334 1.99996 11.3334H11.3333M0.666626 0.666748L15.3333 15.3334"
                                                  stroke="#E66666"
                                                  stroke-width="1.2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_12_3738">
                                                  <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                            Inactive reminder
                                          </span>
                                        )}

                                        <span className="attendance-options-edit-clock" onClick={() => EditReminder(remind)}>
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                              d="M10.6667 1.33325V3.99992M5.33333 1.33325V3.99992M2 6.66659H14M3.33333 2.66659H12.6667C13.403 2.66659 14 3.26354 14 3.99992V13.3333C14 14.0696 13.403 14.6666 12.6667 14.6666H3.33333C2.59695 14.6666 2 14.0696 2 13.3333V3.99992C2 3.26354 2.59695 2.66659 3.33333 2.66659Z"
                                              stroke="#1479FF"
                                              stroke-width="1.1"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </svg>
                                          Edit interval
                                        </span>

                                        <span className="attendance-options-edit-clock" style={{ borderBottom: "none" }}>
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                              d="M13.6667 3.99877V6.99851M13.6667 6.99851H10.4848M13.6667 6.99851L11.2061 4.8187C10.6361 4.28111 9.93101 3.88839 9.15654 3.67719C8.38207 3.46599 7.56347 3.4432 6.77712 3.61094C5.99078 3.77868 5.26232 4.13148 4.65972 4.63643C4.05712 5.14137 3.60001 5.78201 3.33106 6.49855M2 11.9981V8.99833M2 8.99833H5.18182M2 8.99833L4.46061 11.1781C5.03055 11.7157 5.73565 12.1085 6.51013 12.3197C7.2846 12.5309 8.1032 12.5536 8.88954 12.3859C9.67589 12.2182 10.4043 11.8654 11.0069 11.3604C11.6096 10.8555 12.0667 10.2148 12.3356 9.49829"
                                              stroke="#1479FF"
                                              stroke-width="1.1"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </svg>
                                          View reminder logs
                                        </span>
                                      </div>
                                    </OutsideAlerter>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </div>
                  </>
                )}
                {activeTab === "Reminder" && (
                  <>
                    <div className="search-filter-all-content-alignment">
                      <div className="search-reminder-box">
                        <input type="search" placeholder="Search customer or service" autoFocus />
                        <div className="search-icon-alignment">
                          <img src={SearchIcon} alt="SearchIcon" />
                        </div>
                      </div>
                      <div className="new-statement-modal-desgin-alignment" style={{ width: "215px", padding: "6px 10px" }}>
                        <img src={CalendarIcon} alt="CalendarIcon" />
                        <span>
                          <DatePicker
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
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
                    <div className="reminder-table-design-alignment">
                      <table>
                        <tr>
                          <th align="left">
                            <span>Date</span>
                          </th>
                          <th align="left">
                            <span>Service name</span>
                          </th>
                          <th align="center">
                            <span>Customer</span>
                          </th>
                          <th align="center">
                            <span>Mobile number</span>
                          </th>
                          <th align="left">
                            <span></span>
                          </th>
                        </tr>
                        {ReminderData?.map((reminder) => {
                          return (
                            <tr
                              onClick={() => {
                                setSMSPreview(!SMSPreview);
                                setCustomer(reminder?.customerId?.firstName);
                                setCustomerService(reminder?.serviceId?.serviceName);
                              }}
                            >
                              <td>
                                <div className="interval-text-style" style={{justifyContent:"flex-start"}}>
                                  <span>{moment(reminder?.created).format("DD MMM YY")}</span>
                                </div>
                              </td>
                              <td>
                                <div className="content-border-text-alignment" >
                                  <div
                                    className="service-divider"
                                    style={{
                                      backgroundColor: reminder?.serviceId?.colour,
                                      borderRadius: "5px",
                                      height: "100%",
                                      width: "5px",
                                    }}
                                  ></div>
                                  <div className="left-side-text-alignment">
                                    <p>{reminder?.serviceId?.serviceName}</p>
                                    <span>{reminder?.serviceId?.categoryName}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="interval-text-style">
                                  <span>{reminder?.customerId?.firstName}</span>
                                </div>
                              </td>
                              <td>
                                <div className="button-text-alignment">
                                  <div className="interval-text-style">
                                    <span>{reminder?.customerId?.mobileNumber}</span>
                                  </div>
                                  
                                </div>
                              </td>
                              <td>
                                <div className="button-text-alignment">
                                  
                                  <div className="" style={{ width: "6px" }}>
                                    <img src={SelectIcon} alt="SelectIcon" />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {newreminder && (
        <AddNewReminderModal
          toggle={AddNewReminder}
          EditReminder={EditReminder}
          EditReminderData={EditReminderData}
          setNewreminder={setNewreminder}
          setMultipleOpen={setMultipleOpen}
        />
      )}
      {buySmsModal && <SmsWallet setBuySmsModal={setBuySmsModal} setBuySmsOpen={setBuySmsOpen} smSData={smSData} />}
      {buySmsOpen && <BuySmsModal toggle={NewSmSPurchesed} setBuySmsOpen={setBuySmsOpen} smSData={smSData} userInfo={userInfo} />}
      {multipleOpen && <ReminderMultipleServices toggle={multiReminderAdded} setMultipleOpen={setMultipleOpen} />}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {SMSPreview && (
        <div className="set-view-template-modal-desgin">
          <div className="set-view-template-modal-center-alignment">
            <div className="set-view-template-box">
              <div className="message-modal-header">
                <div onClick={() => setSMSPreview(false)}>
                  <img src={MiniCloseIcon} alt="MiniCloseIcon" />
                </div>
                <div>
                  <h2>SMS Preview </h2>
                </div>
              </div>
              <div className="message-modal-body-alignment">
                <div className="message-text-box">
                  <div className="message-header-box">
                    <div className="message-profile-icon-center-alignment">
                      <svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="17" cy="16.5" r="16.5" fill="#969AA6" />
                        <circle cx="16.9999" cy="12.1" r="6.23333" fill="white" />
                        <path
                          d="M27.6334 25.3001C27.6334 26.4001 22.8727 30.0667 17 30.0667C11.1274 30.0667 6.3667 26.4001 6.3667 25.3001C6.3667 24.2001 11.1274 21.2667 17 21.2667C22.8727 21.2667 27.6334 24.2001 27.6334 25.3001Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="app-barbera-text">
                      <span>QP-BRBERA</span>
                      <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6.5L4 3.40323L1 0.5" stroke="#BBBBBB" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="message-body-alignment">
                    <div className="text-message">
                      <span>Text Message</span>
                    </div>
                    <div className="message-view-text-alignment">
                      <div className="message-box-style">
                        <span>Dear {customer},</span> <br />
                        <span style={{ maxWidth: "216px" }}>
                          Its time for your for your next {customerService}, visit Garrison Hair Salon. See you soon
                        </span>
                      </div>
                    </div>
                    <div className="text-message-box-style-alignment">
                      <div className="input-style">
                        <input type="text" placeholder="Text Message" />
                        <div className="right-alignment">
                          <img src={MessageIcon} alt="MessageIcon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
