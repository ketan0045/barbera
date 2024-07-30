import React, { useState, useEffect } from "react";
import "./AttendanceModal.scss";
import DatePicker from "react-datepicker";
import moment from "moment";
import CloseIcon from "../../../../assets/svg/Close.svg";
import { ApiPost } from "../../../../helpers/API/ApiData";

function Clockout(props) {
  const {
    toggleOut,
    staffDetails,
    attendenceStatus,
    checkClockinTime,
    userDataId,
    fromStaffRequestedData,
    setFromStaffRequestedData,
    selectedDate,
    editData,
    setEditData,
  } = props;
  const [currentTime, setCurrentTime] = useState(
    !editData.checkOutTime ? selectedDate : new Date(editData?.checkOutTime)
  );
  const [disabled, setDisabled] = useState(false);
  const [minTime, setMinTime] = useState();
  const [maxTime, setMaxTime] = useState();
  
  let firstName = staffDetails?.firstName?.charAt(0);
  let date = moment(selectedDate).format();
  let selectedDateDay = moment(selectedDate).format("dddd");


  useEffect(() => {
    if (fromStaffRequestedData?.checkOutTime) {
      setCurrentTime(new Date(fromStaffRequestedData?.checkOutTime));
      setMinTime(moment(fromStaffRequestedData?.checkInTime).add(15, "minutes")._d);
      setMaxTime(moment("23:50", "hh-mm a")._d);
    } else {
      let selectedDayStaffData = staffDetails?.workingDays?.find(
        (day) => day?.Day === selectedDateDay
      );
      let endTime = moment(selectedDayStaffData?.endtime, "hh:mm").format("hh:mm A");
      let temExpectedClockInTime = moment(endTime, "hh:mm A");
      // let temExpectedClockInTime = moment(new Date()).format("hh:mm A");
     
      var date2 = moment(selectedDate).format("L")?.toString();
    
      // var time2 = temExpectedClockInTime?.toString();
      var time2 = temExpectedClockInTime?._i?.toString();
  
      var dateTime = moment(date2 + " " + time2, "MM/DD/YYYY hh:mm A");
     
      let tempFinalTime = moment(dateTime, "YYYY-MM-DD hh:mm A").format("LLLL");
     
      setCurrentTime(new Date(tempFinalTime));
      setMinTime(moment(fromStaffRequestedData?.checkInTime).add(15, "minutes")._d);
      setMaxTime(moment("23:50", "hh-mm a")._d);
    }
    return () => {
      setFromStaffRequestedData();
      setEditData({});
    };
  }, []);

  const SunStartTime = async (e) => {
 
    setCurrentTime(e);
  };

  const handleClockOutSave = async (e) => {
    setDisabled(true);
    let data = {
      activeStatus: false,
      checkOutTime: attendenceStatus === "clockOut" ? moment(currentTime).format() : "",
      status: "Present",
      currentStatus: "clockOut",
      _id: userDataId?._id,
    };

    await ApiPost("attendence/user/company/multipleUpdate/data", data)
      .then((res) => {
   
        toggleOut({}, {}, "", {}, 200);
        checkClockinTime();
      })
      .catch((err) => setDisabled(false));
  };

  return (
    <div>
      <div className="clock-in-checkout-modal">
        <div className="clock-in-checkout">
          <div className="modal-header">
            <div className="">
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div className="modal-close" onClick={toggleOut}>
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div>
                    <h1>
                      {fromStaffRequestedData?.activeStatus
                        ? "Approve staff clock out request"
                        : "Clock out "}
                    </h1>
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
              <p>Expected clock out time</p>
              {staffDetails?.workingDays?.map((day) => {
                if (day?.Day === selectedDateDay) {
                  return (
                    <>
                      <p>{moment(moment(day?.endtime, "hh-mm a")).format("hh:mm A")} </p>
                    </>
                  );
                }
              })}
            </div>
            <div className="all-content-list-alignment-approve-staff">
              <h4>Edit clock out time</h4>
              {/* <button>{moment(date).format("h:mm a")}</button> */}
              <button>
                <DatePicker
                  selected={currentTime}
                  onChange={(e) => SunStartTime(e)}
                  minTime={minTime}
                  maxTime={maxTime}
                  // minTime={setHours(
                  //   setMinutes(new Date(), minTime?.getMinutes()),
                  //   minTime?.getHours()
                  // )}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="hh:mm aa"
                />
              </button>
            </div>
          </div>
          <div className="approve-modal-footer">
            <button disabled={disabled} onClick={(e) => handleClockOutSave(e)}>
              {fromStaffRequestedData?.activeStatus ? "Approve clock out" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clockout;
