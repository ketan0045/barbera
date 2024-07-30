import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Auth from "../../helpers/Auth";
import { ApiGet, ApiPost } from "../../helpers/API/ApiData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Row, Col } from 'reactstrap';
import moment from "moment";

const SalesAnalytics = (props) => {
  const [startOfWeek, setStartOfWeek] = useState();
  const [endOfWeek, setEndOfWeek] = useState();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [weeklySales, setWeeklySales] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [custom, setCustom] = useState(false);
  const userInfo = Auth.getUserDetail();
  const {
    modal,
    toggle,
    SettingInfo
  } = props;
 
  const lineChartData = {
    labels: analyticsData && analyticsData.dates,
    datasets: [
      {
        label: "Sale Amount",
        data: analyticsData && analyticsData.amount,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };
  useEffect(() => {
    getAnalytics();
  }, []);

  const selectData = (e) => {
    if(e.target.value === "custom"){
setCustom (!custom)
    }else{
      setCustom (false)
      setStartDate("")
      setEndDate("")
      getAnalytics(e.target.value);
    }
 
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
        analyticsData = await ApiPost(
          "dashboard/company/getAllStatistic/value",
          analyticsPayload
        );
        if (analyticsData.data.status === 200) {
          let details = analyticsData.data.data;
          details["dates"] = [];
          details["amount"] = [];
          details["booking"] = [];
          details["cancel"] = [];
          details["totalAppts"] = 0;
          for (var key in details) {
            if (
              key === "amount" ||
              key === "dates" ||
              key === "booking" ||
              key === "cancel" ||
              key === "totalAppts"
            )
              break;
            details["dates"].push(moment(key).format("DD MMM YYYY"));
            details["amount"].push(details[key].amount);
            details["booking"].push(details[key].booking);
            details["totalAppts"] =
              details["totalAppts"] + details[key].booking;
            details["cancel"].push(details[key].cancel);
            // details[getDateDay(key)] = details[key];
          }
        
          setAnalyticsData(details);
          let weeklySales =
            details && details.amount.reduce((a, b) => a + b, 0);
          setWeeklySales(weeklySales);
        } else {
          console.log("in the else");
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
      if (userInfo.role === "Staff") {
        let apiDataCompany = {
          startTime: startOfWeek,
          endTime: endOfWeek,
          staffId: userInfo._id,
          compnayId: userInfo.companyId,
        };
        analyticsData = await ApiPost(
          "dashboard/company/getStaffStatistic/value/data",
          apiDataCompany
        );

        let details = analyticsData.data.data;
        details["dates"] = [];
        details["amount"] = [];
        details["booking"] = [];
        details["cancel"] = [];
        details["totalAppts"] = 0;
        for (var key in details) {
          if (
            key === "amount" ||
            key === "dates" ||
            key === "booking" ||
            key === "cancel" ||
            key === "totalAppts"
          )
            break;
          details["dates"].push(moment(key).format("DD MMM YYYY"));
          details["amount"].push(details[key].amount);
          details["booking"].push(details[key].booking);
          details["totalAppts"] = details["totalAppts"] + details[key].booking;
          details["cancel"].push(details[key].cancel);
          // details[getDateDay(key)] = details[key];
        }

        setAnalyticsData(details);
        let weeklySales = details && details.amount.reduce((a, b) => a + b, 0);
        setWeeklySales(weeklySales);
      } else {
        let analyticsPayload = {
          companyId: userInfo.companyId,
          startTime: startOfWeek,
          endTime: endOfWeek,
        };
        analyticsData = await ApiPost(
          "dashboard/company/getAllStatistic/value",
          analyticsPayload
        );
        if (analyticsData.data.status === 200) {
          let details = analyticsData.data.data;
          details["dates"] = [];
          details["amount"] = [];
          details["booking"] = [];
          details["cancel"] = [];
          details["totalAppts"] = 0;
          for (var key in details) {
            if (
              key === "amount" ||
              key === "dates" ||
              key === "booking" ||
              key === "cancel" ||
              key === "totalAppts"
            )
              break;
            details["dates"].push(moment(key).format("DD MMM YYYY"));
            details["amount"].push(details[key].amount);
            details["booking"].push(details[key].booking);
            details["totalAppts"] =
              details["totalAppts"] + details[key].booking;
            details["cancel"].push(details[key].cancel);
            // details[getDateDay(key)] = details[key];
          }
    
          setAnalyticsData(details);
          let weeklySales =
            details && details.amount.reduce((a, b) => a + b, 0);
          setWeeklySales(weeklySales);
        } else {
          console.log("in the else");
        }
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };
  return (
    <div>
      {modal ? (
        <>
          <div className="animation justify-center items-center mx-auto flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className=" relative w-auto my-6 md:w-1/2 mx-auto">
              {/*content*/}

              <div className="border-0 rounded-lg shadow-lg relative p-5  flex flex-col w-full staff-add-banner outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t">
                  <h3 className="font-size-30 font-bold tracking-normal heading-title-text-color mb-0 cursor-pointer">
                    Sales Analytics
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => toggle()}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <img
                        src={require("../../assets/img/Cancel.png").default}
                      />
                    </span>
                  </button>
                </div>
                <div className="pb-3 items-center justify-between">
                  <div>
                    <div className="flex items-center justify-between mt-5">
                      <div className="dark-blue-color font-size-26 mb-0 heading-titlet-text-color tracking-normal font-medium">
                        <span className="rs-font">{SettingInfo?.currentType}</span>{" "}
                        {weeklySales ? weeklySales : 0}
                      </div>
                      <div className="sale-sub-grid-items">
                          <label>Filter</label>
                            <select
                                name="cars"
                                id="cars"
                                className="form-control dropdown-style2 font-light dropdown2"
                                onChange={(e) => selectData(e)}
                                >
                                <option
                                  className="font-size-18 dark-text-color font-medium"
                                  value="today"
                                >
                                  Today
                                </option>

                                <option
                                  className="font-size-18 dark-text-color font-medium"
                                  value="week"
                                >
                                  This Week
                                </option>
                                <option
                                  className="font-size-18 dark-text-color font-medium"
                                  value="month"
                                >
                                  This Month
                                </option>
                                <option
                                  className="font-size-18 dark-text-color font-medium"
                                  value="custom"
                                >
                                Custom Date
                                </option>
                                </select>
                      </div>
                  </div>
                  {custom? <>
                  <div className="appointment-model-grid">
                    <div className="appointment-model-grid-items">
                        <div className="sub-appointment-model-grid">
  
                          <div className="sub-appointment-model-grid-items">
                            <label>Start Date</label>
                              <DatePicker
                                selected={startDate}
                                onChange={handleStartDate}
                                dateFormat="dd/MM/yyyy"
                              />
                          </div>
                          <div className="sub-appointment-model-grid-items">
                            <label>End Date</label>
                              <DatePicker
                                selected={endDate}
                                minDate={startDate}
                                onChange={handleEndDate}
                                dateFormat="dd/MM/yyyy"
                              />
                          </div>
                         
                        </div>
                      </div>                    
                    <div className="appointment-model-grid-items">
                      <button className="search-button-style"  onClick={() => getData()}>search</button>
                    </div>                    
                  </div>
                  </>:null}
                </div>
                </div>
                <div>
                  <Line data={lineChartData} />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default SalesAnalytics;
