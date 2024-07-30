import React, { useState, useRef, useEffect } from "react";
import "./Modal.scss";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Line } from "react-chartjs-2";

export default function VisitAnalyticsModal(props) {
  const userInfo = Auth.getUserDetail();
  const statusRef = useRef();
  const filterRef = useRef();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [startOfWeek, setStartOfWeek] = useState();
  const [endOfWeek, setEndOfWeek] = useState();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [weeklySales, setWeeklySales] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [custom, setCustom] = useState(false);
  const [weeklyAppointment, setWeeklyAppointment] = useState();
  const [filterName, setFilterName] = useState("This week");
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [isCompleted, setIsCompleted] = useState(true);
  const [isNoShows, setIsNoShows] = useState(true);
  const [isCancelled, setIsCancelled] = useState(true);
  const [appStatus, setAppStatus] = useState([]);

  const lineChartData = {
    labels: analyticsData && analyticsData.dates,
    datasets: [
      {
        label: "Cancel",
        data: isCancelled && analyticsData && analyticsData.cancel,
        fill: true,
        backgroundColor: "rgba(247,70,74,0.2)",
        borderColor: "rgba(247,70,74,1)",
        tension: 0,
      },
      {
        label: "No Show",
        data: isNoShows && analyticsData && analyticsData.noShow,
        fill: true,
        backgroundColor: "rgba(111,115,125,0.2)",
        borderColor: "rgba(111,115,125,1)",
        tension: 0,
      },
      {
        label: "Upcoming",
        data: isUpcoming && analyticsData && analyticsData.upcoming,
        fill: true,
        backgroundColor: "rgba(70,191,189,0.2)",
        borderColor: "rgba(70,191,189,1)",
        tension: 0,
      },
      {
        label: "complete",
        data: isCompleted && appStatus && appStatus.complete,
        fill: true,
        backgroundColor: "rgba(253,180,92,0.2)",
        borderColor: "rgba(253,180,92,1)",
        tension: 0,
      },
    ],
  };

  useEffect(() => {
    getAnalytics("week");
  }, []);

  const selectData = (e) => {
    setFilterName(e.target.innerText);
    if (e.target.attributes[0]?.value === "custom") {
      setCustom(!custom);
    } else {
      setCustom(false);
      setStartDate("");
      setEndDate("");
      getAnalytics(e.target.attributes[0].value);
    }
    setDropDown(false);
  };
  const handleStartDate = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const getData = async () => {
    try {
      const startOfWeek = moment(startDate).format("YYYY-MM-DD");
      const endOfWeek = moment(endDate).format("YYYY-MM-DD");
      setStartOfWeek(startOfWeek);
      setEndOfWeek(endOfWeek);
      let analyticsData;
      
        let analyticsPayload = {
          companyId: userInfo.companyId,
          startTime: startOfWeek,
          endTime: endOfWeek,
        };
        let appointmentData = await ApiPost(
          "dashboard/sales/visits/dashboard/company/apointment/" +
            userInfo.companyId,
          analyticsPayload
        );
        if (appointmentData.data.status === 200) {
          let details = appointmentData.data.data.appointment;
          details["dates"] = [];
          details["cancel"] = [];
          details["noShow"] = [];
          details["upcoming"] = [];
          details["total"] = [];
          for (var key in details) {
            if (
              key === "cancel" ||
              key === "dates" ||
              key === "noShow" ||
              key === "upcoming" ||
              key === "total"
            )
              break;
            details["dates"].push(moment(key).format("DD MMM YYYY"));
            details["cancel"].push(details[key].cancel);
            details["noShow"].push(details[key].noShow);
            details["upcoming"].push(details[key].upcoming);
            details["total"].push(details[key].total);
          }
          setAnalyticsData(details);
        } else {
          console.log("in else");
        }
      // }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const getAnalytics = async (data) => {
    try {
      const startOfWeek = moment().clone().startOf(data).format("YYYY-MM-DD");
      const endOfWeek = moment().clone().endOf(data).format("YYYY-MM-DD");
      setStartOfWeek(startOfWeek);
      setEndOfWeek(endOfWeek);
      let analyticsData;
     
        let analyticsPayload = {
          companyId: userInfo.companyId,
          startTime: startOfWeek,
          endTime: endOfWeek,
        };
        let appointmentData = await ApiPost(
          "dashboard/sales/visits/dashboard/company/apointment/" +
            userInfo.companyId,
          analyticsPayload
        );
        if (appointmentData.data.status === 200) {
          let details = appointmentData.data.data.appointment;
          details["dates"] = [];
          details["cancel"] = [];
          details["noShow"] = [];
          details["upcoming"] = [];
          details["total"] = [];
          for (var key in details) {
            if (
              key === "cancel" ||
              key === "dates" ||
              key === "noShow" ||
              key === "upcoming" ||
              key === "total"
            )
              break;
            details["dates"].push(moment(key).format("DD MMM YYYY"));
            details["cancel"].push(details[key].cancel);
            details["noShow"].push(details[key].noShow);
            details["upcoming"].push(details[key].upcoming);
            details["total"].push(details[key].total);
          }
          setAnalyticsData(details);
          let data = appointmentData.data.data.invoice;
          data["complete"] = [];
          for (var key in data) {
            if (key === "complete") break;
            data["complete"].push(data[key].complete);
            setAppStatus(data);
          }
          let weeklyAppointment =
          details && details.total.reduce((a, b) => a + b, 0);
        setWeeklyAppointment(weeklyAppointment);
        } else {
          console.log("in else");
        }
      // }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const handleOnSelect = (e, key) => {
    if (key === "upcoming") {
      setIsUpcoming(!isUpcoming);
    } else if (key === "completed") {
      setIsCompleted(!isCompleted);
    } else if (key === "noshows") {
      setIsNoShows(!isNoShows);
    } else if (key === "cancelled") {
      setIsCancelled(!isCancelled);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (dropDown) {
        if (
          dropDown &&
          filterRef.current &&
          !filterRef.current.contains(e.target)
        ) {
          setDropDown(false);
        }
      } else if (subMenuOpen) {
        if (
          subMenuOpen &&
          statusRef.current &&
          !statusRef.current.contains(e.target)
        ) {
          setSubMenuopen(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [dropDown, subMenuOpen]);

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => props.toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Visits Analytics</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-analytics-box-center">
          <div className="dashboard-analytics-box-design">
            <div className="modal-text-title">
              <h1>
                {weeklyAppointment ? weeklyAppointment : 0}{" "}
                <span style={{ fontSize:"12px" , fontWeight:"500"}}>Appointments</span>
              </h1>
            </div>
            <div className="dashboard-form-grid">
              <div className="dashboard-form-grid-items">
                <div className="option-select-group">
                  <label>Appointment status</label>
                  <div className="relative" ref={statusRef}>
                    <div
                      className="input-relative"
                      onClick={() => setSubMenuopen(!subMenuOpen)}
                    >
                      <input disabled type="text" placeholder="All" />
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
                        <div className="checkbox-design-change-three ">
                          <input
                            type="checkbox"
                            checked={isUpcoming}
                            onChange={(e) => handleOnSelect(e, "upcoming")}
                          />
                          <span>Upcoming</span>
                        </div>
                        <div className="checkbox-design-change-three ">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={(e) => handleOnSelect(e, "completed")}
                          />
                          <span>Completed</span>
                        </div>
                        <div className="checkbox-design-change-three ">
                          <input
                            type="checkbox"
                            checked={isNoShows}
                            onChange={(e) => handleOnSelect(e, "noshows")}
                          />
                          <span>No-shows</span>
                        </div>
                        <div className="checkbox-design-change-three ">
                          <input
                            type="checkbox"
                            checked={isCancelled}
                            onChange={(e) => handleOnSelect(e, "cancelled")}
                          />
                          <span>Cancelled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-form-grid-items">
                <div className="option-select-group">
                  <label>Filters</label>
                  <div className="relative" ref={filterRef}>
                    <div
                      className="input-relative"
                      onClick={() => setDropDown(!dropDown)}
                    >
                      <input disabled type="text" value={filterName} />
                      <div className="drop-down-icon-center">
                        <img src={DropDownIcon} alt="DropDownIcon" />
                      </div>
                    </div>
                    <div
                      className={
                        dropDown
                          ? "sub-menu-open sub-menu"
                          : "sub-menu sub-menu-close"
                      }
                    >
                      <div
                        className="sub-menu-design"
                        onClick={(e) => selectData(e)}
                      >
                        <ul>
                          {/* <li value="today">Today</li> */}
                          <li value="week">This week</li>
                          <li value="month">This month</li>
                          <li value="custom">Custome date</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {custom && (
              <div className="dashboard-form-date-grid">
                <div className="dashboard-form-date-grid-items">
                  <div className="form-group">
                    <label>Start date</label>
                    {/* <input type="date" placeholder="Wednesday, 00 OOO 2021" /> */}
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDate}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
                <div className="dashboard-form-date-grid-items">
                  <div className="date-sub-grid">
                    <div className="date-sub-grid-items">
                      <div className="form-group">
                        <label>End date</label>
                        {/* <input type="date" placeholder="Wednesday, 00 OOO 2021" /> */}
                        <DatePicker
                          selected={endDate}
                          minDate={startDate}
                          onChange={handleEndDate}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                    <div className="date-sub-grid-items">
                      <div
                        className="search-icon-design"
                        onClick={() => getData()}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.4157 12.2324L17 15.8158L15.8158 17L12.2324 13.4157C10.8991 14.4846 9.24062 15.0659 7.53175 15.0635C3.37422 15.0635 0 11.6893 0 7.53175C0 3.37422 3.37422 0 7.53175 0C11.6893 0 15.0635 3.37422 15.0635 7.53175C15.0659 9.24062 14.4846 10.8991 13.4157 12.2324ZM11.737 11.6115C12.7991 10.5193 13.3922 9.0552 13.3898 7.53175C13.3898 4.29477 10.7679 1.67372 7.53175 1.67372C4.29477 1.67372 1.67372 4.29477 1.67372 7.53175C1.67372 10.7679 4.29477 13.3898 7.53175 13.3898C9.0552 13.3922 10.5193 12.7991 11.6115 11.737L11.737 11.6115Z"
                            fill="#1479FF"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="dashboard-graph">
              <div className="graph-box">
                <Line data={lineChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
