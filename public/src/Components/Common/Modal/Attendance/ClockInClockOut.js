import React, { useState, useEffect } from "react";
import "./AttendanceModal.scss";
import DatePicker from "react-datepicker";
import moment from "moment";
import CloseIcon from "../../../../assets/svg/Close.svg";
import { ApiPost } from "../../../../helpers/API/ApiData";

function ClockInClockOut(props) {
  const {
    toggle,
    staffDetails,
    attendenceStatus,
    checkClockinTime,
    fromStaffRequestedData,
    setFromStaffRequestedData,
    selectedDate,
    editData,
    setEditData,
    showDefault,
    DefaultOpendata
  } = props;

  const [disabled, setDisabled] = useState(false);
  let firstName = staffDetails?.firstName?.charAt(0);
  let date = selectedDate;
  let selectedDateDay = moment(selectedDate).format("dddd");
  const [currentTime, setCurrentTime] = useState();

  const [minTime, setMinTime] = useState();
  const [maxTime, setMaxTime] = useState();
  const [timeValidation, setTimeValidation] = useState(false);

  useEffect(() => {
 

    let selectedDayStaffData = staffDetails?.workingDays?.find(
      (day) => day?.Day === selectedDateDay
    );
    let startTime = moment(selectedDayStaffData?.starttime, "hh:mm").format("hh:mm A");
    // let startTime = moment(new Date()).format("hh:mm A");
    let temExpectedClockInTime = moment(startTime, "hh:mm A");

    var date2 = moment(selectedDate).format("L")?.toString();
    var time2 = temExpectedClockInTime?._i?.toString();
    var dateTime = moment(date2 + " " + time2, "MM/DD/YYYY hh:mm A");
    let tempFinalTime = moment(dateTime, "YYYY-MM-DD hh:mm A").format("LLLL");

    setCurrentTime(new Date(tempFinalTime));


    if (fromStaffRequestedData) {
 
      setCurrentTime(
        !fromStaffRequestedData?.checkInTime
          ? new Date(tempFinalTime)
          : new Date(fromStaffRequestedData?.checkInTime)
      );
      if (fromStaffRequestedData?.checkOutTime) {
        setTimeValidation(true);
        setMinTime(moment("00:10", "hh-mm a")._d);
        setMaxTime(moment(fromStaffRequestedData?.checkOutTime).subtract(15, "minutes")._d);
      }
    } else {
      let newDate = new Date();
      let updatedDate = moment(newDate).format("LT");
   
    }
   
    return () => {
      setFromStaffRequestedData();
      setEditData({});
    };
  }, []);
  useEffect(()=>{
    if(showDefault){
  
      // setCurrentTime(new Date(DefaultOpendata?.checkInTime))
    }
  },[])

  // console.log("currentTime", moment(currentTime).format());
  const SunStartTime = async (e) => {
    // console.log("eee..", e);
    setCurrentTime(e);
  };

  const handleClockinChange = async (e) => {
    setDisabled(true);
    let autoClockout
    {staffDetails?.workingDays?.map((day) => {
      if (day?.Day === selectedDateDay) {
        autoClockout = moment( (moment(selectedDate).format("L")) + " " + ((moment(day?.endtime , "hh-mm a"))._i))._d
        return (
          <>
            <p>{moment(moment(day?.starttime, "hh-mm a")).format("hh:mm A")} </p>
          </>
        );
      }
    })}
  
    let data = fromStaffRequestedData
      ?  moment(selectedDate).format("L") != moment(new Date()).format("L") ? 

      [
        {
          activeStatus: false,
          checkInTime: moment.utc(currentTime).format(),
          checkOutTime:autoClockout,
          status: "Present",
          currentStatus:"clockOut" ,
          _id: fromStaffRequestedData?._id,
        },
      ] :

      [
          {
            activeStatus: false,
            checkInTime: moment.utc(currentTime).format(),
            status: "Present",
            currentStatus:
              fromStaffRequestedData?.currentStatus === "clockOut" ? "clockOut" : attendenceStatus,
            _id: fromStaffRequestedData?._id,
          },
        ]
      :
      moment(selectedDate).format("L") != moment(new Date()).format("L") ? [
        {
          activeStatus: false,
          staffId: staffDetails?._id,
          checkInTime: attendenceStatus === "clockOut" ? "" : moment.utc(currentTime).format(),
          checkOutTime: attendenceStatus === "clockOut"   ? moment(currentTime).format() :  moment(selectedDate).format("L") != moment(new Date()).format("L") ? autoClockout  :"",
          status: "Present",
          currentStatus: moment(selectedDate).format("L") != moment(new Date()).format("L") ? "clockOut":attendenceStatus,
          companyId: staffDetails?.companyId,
          date: moment.utc(currentTime).format(),
          _id: fromStaffRequestedData?._id,
        },
      ]:
      [
          {
            activeStatus: false,
            staffId: staffDetails?._id,
            checkInTime: attendenceStatus === "clockOut" ? "" : moment(currentTime).format(),
            // checkOutTime: attendenceStatus === "clockOut"   ? moment(currentTime).format() :  moment(selectedDate).format("L") != moment(new Date()).format("L") ? autoClockout  :"",
            status: "Present",
            currentStatus: moment(selectedDate).format("L") != moment(new Date()).format("L") ? "clockOut":attendenceStatus,
            companyId: staffDetails?.companyId,
            date: moment.utc(currentTime).format(),
            _id: fromStaffRequestedData?._id,
          },
        ];

       

    if (fromStaffRequestedData) {
      await ApiPost("attendence/user/company/multipleUpdate/data", data)
        .then((res) => {
        
          toggle({}, "", {}, 200, "approval");
          checkClockinTime();
        })
        .catch((err) => setDisabled(false));
    } else {
    
      await ApiPost("attendence", data)
        .then((res) => {
          
          toggle({}, "", {}, 200, "");
          checkClockinTime();
        })
        .catch((err) => setDisabled(false));
    }
  };

  return (
    <div>
      <div className="clock-in-checkout-modal">
        <div className="clock-in-checkout">
          <div className="modal-header">
            <div className="">
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div className="modal-close" onClick={toggle}>
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div>
                    {fromStaffRequestedData?.activeStatus ? (
                      <h1>Approve staff clock in request</h1>
                    ) : (
                      <h1>Clock in</h1>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="approve-stadd-clock-alignment">
            <div className="staff-profile-grid-modal">
              <div className="staff-profile-grid-modal-items">
                <div className="profile-name-text-show">{firstName}</div>
              </div>
              <div className="staff-profile-grid-modal-items">
                <p>
                  {staffDetails?.firstName} {staffDetails?.lastName}
                </p>
                <span>+91 {staffDetails?.mobileNumber}</span>
              </div>
            </div>
          </div>
          <div className="time-section-alignment">
            <div className="all-content-list-alignment-approve-staff">
              <p>Expected clock in time</p>
              {staffDetails?.workingDays?.map((day) => {
                if (day?.Day === selectedDateDay) {
                  return (
                    <>
                      <p>{moment(moment(day?.starttime, "hh-mm a")).format("hh:mm A")} </p>
                    </>
                  );
                }
              })}
            </div>
            <div className="all-content-list-alignment-approve-staff">
              <h4>Edit clock in time</h4>
              {/* <button>{moment(date).format("h:mm a")}</button> */}
              <button>
                {timeValidation ? (
                  <DatePicker
                    selected={currentTime}
                    onChange={(e) => SunStartTime(e)}
                    minTime={minTime}
                    maxTime={maxTime}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="hh:mm aa"
                  />
                ) : (
                  <DatePicker
                    selected={ currentTime}
                    onChange={(e) => SunStartTime(e)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="hh:mm aa"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="approve-modal-footer">
            <button disabled={disabled} onClick={(e) => handleClockinChange(e)}>
              {fromStaffRequestedData?.activeStatus ? "Approve clock in" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClockInClockOut;
