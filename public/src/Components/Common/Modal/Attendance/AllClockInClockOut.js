
import React, { useState, useEffect } from "react";
import "./AttendanceModal.scss";
import CloseIcon from "../../../../assets/svg/Close.svg";
import UserXIcon from "../../../../assets/img/user-x.svg";
import OffDayIcon from "../../../../assets/svg/offDay.svg";
import UserPresentIcon from "../../../../assets/img/UserPresentIcon.svg";
import moment from "moment";
import { ApiPost } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import DatePicker from "react-datepicker";

function AllClockInClockOut(props) {
  const {
    toggle,
    staffData,
    userAttendenceData,
    checkClockinTime,
    selectedDate,
    attendenceStatus,
    setAttendenceStatus,
  } = props;
  const [startDate, setStartDate] = useState(selectedDate);
  const [currentTime, setCurrentTime] = useState();
  const [tempStaffData, setTempStaffData] = useState();
  const [disabled, setDisabled] = useState(false);
  const userInfo = Auth.getUserDetail();
  const [disabledtoggle, setDisabledToggle] = useState(false);
  let todayDate = moment(selectedDate).format("dddd");
  let startTime = moment(new Date()).format("hh:mm A");
    let temExpectedClockInTime = moment(startTime, "hh:mm A");
  var date2 = moment(selectedDate).format("L")?.toString();
  var time2 = temExpectedClockInTime?._i?.toString();
  var dateTime = moment(date2 + " " + time2, "MM/DD/YYYY hh:mm A");
  let tempFinalTimes = moment(dateTime, "YYYY-MM-DD hh:mm A").format("LLLL");


  useEffect(() => {
    if (disabledtoggle) {
      toggle("", 200);
    }
  }, [disabledtoggle]);

 

  useEffect(() => {
    let startTime = moment(new Date()).format("hh:mm A");
    let temExpectedClockInTime = moment(startTime, "hh:mm A");

    var date2 = moment(selectedDate).format("L")?.toString();
    var time2 = temExpectedClockInTime?._i?.toString();
    var dateTime = moment(date2 + " " + time2, "MM/DD/YYYY hh:mm A");
    let tempFinalTime = moment(dateTime, "YYYY-MM-DD hh:mm A").format("LLLL");

    setCurrentTime(tempFinalTime);
    return () => {
      setAttendenceStatus();
    };
  }, []);



  const SunStartTime = async (e, id) => {
   

    setTempStaffData(
      tempStaffData?.map((staff) => {
        return id !== staff?.staffId
          ? { ...staff }
          : attendenceStatus === "clockInAll"
          ?  moment(selectedDate).format("L") != moment(new Date()).format("L") ? {
              ...staff,
              activeStatus: false,
              date:   moment.utc(moment(selectedDate).format("MM-DD-YY")).format(),
              checkInTime: e,
              checkOutTime:staff?.currentStatus?.toLowerCase() === "absent"
              ? "":staff?.checkOutTime,
              companyId: staff?.companyId,
              staffId: staff?.staffId,
              status:
                staff?.currentStatus?.toLowerCase() === "absent"
                  ? "Absent"
                  : "Present",
              currentStatus:
                staff?.currentStatus?.toLowerCase() === "absent"
                  ? "Absent"
                  : staff?.currentStatus?.toLowerCase() === "clockout"? "clockOut": "clockIn",
              firstName: staff?.firstName,
            }: {
              activeStatus: false,
              date:    moment.utc(moment(selectedDate).format("MM-DD-YY")).format(),
              checkInTime: e,
              checkOutTime:staff?.currentStatus?.toLowerCase() === "absent"
              ? "":staff?.checkOutTime,
              companyId: staff?.companyId,
              staffId: staff?.staffId,
              status:
                staff?.currentStatus?.toLowerCase() === "absent"
                  ? "Absent"
                  : "Present",
              currentStatus:
                staff?.currentStatus?.toLowerCase() === "absent"
                  ? "Absent"
                  : staff?.currentStatus?.toLowerCase() === "clockout"? "clockOut": "clockIn",
              firstName: staff?.firstName,
            }
          : {
              ...staff,
              activeStatus: false,
              checkOutTime: e,
              status:
                staff?.currentStatus?.toLowerCase() === "absent"
                  ? "Absent"
                  : "Present",
              currentStatus:
                staff?.currentStatus?.toLowerCase() === "absent"
                  ? "Absent"
                  : "clockOut",
            };
      })
    );
  };

  useEffect(() => {
   
    let staffsdata =
      staffData?.map((staff) => {
        let thisStaff = userAttendenceData?.find((attendence) => {
          return attendence?.staffId === staff?._id;
        });
        let dayOff;
        let expectedclockInTime;
        let expectedclockOutTime;
        staff?.workingDays?.map((day) => {
          if (day?.dayOff === true) {
            if (day?.Day === todayDate) {
              dayOff = true;
        
              // expectedclockInTime = moment(day?.starttime, "hh-mm a")._d;
              // expectedclockOutTime = moment(day?.endtime, "hh-mm a")._d;

              expectedclockInTime = "";
              expectedclockOutTime = "";
              return <></>;
            }
          } else {
            var tempdate = moment(selectedDate).format("L");
            var tempClockIntime = moment(day?.starttime, "hh-mm a")._i;
            var tempClockOuttime = moment(day?.endtime, "hh-mm a")._i;
            var clockIntimeAndDate = moment(
              tempdate + " " + tempClockIntime
            )._d;
            var clockOuttimeAndDate = moment(
              tempdate + " " + tempClockOuttime
            )._d;
            // expectedclockInTime = moment(day?.starttime, "hh-mm a")._d;
            // expectedclockOutTime = moment(day?.endtime, "hh-mm a")._d;

            expectedclockInTime = clockIntimeAndDate;
            expectedclockOutTime = clockOuttimeAndDate;
          }
        });
        return attendenceStatus === "clockInAll"
          ? moment(selectedDate).format("L") !== moment(new Date()).format("L")
            ? {
                activeStatus: false,
                date:moment.utc(moment(selectedDate).format("MM-DD-YY")).format(),
                companyId: staff?.companyId,
                staffId: staff?._id,
                status: dayOff &&  !thisStaff?.status || thisStaff?.status === "Off-day"
                  ? "Off-day"
                  : thisStaff?.status?.toLowerCase() === "absent"
                  ? "Absent"
                  : "Present",
                currentStatus: dayOff && !thisStaff?.status || thisStaff?.status === "Off-day"
                  ? "dayOff"
                  : thisStaff?.status?.toLowerCase() === "absent"
                  ? "Absent"
                  : "clockOut",
                checkInTime: expectedclockInTime,
                checkOutTime: dayOff  || thisStaff?.status === "Off-day"? "" : thisStaff?.status?.toLowerCase() === "absent"
                ? null :expectedclockOutTime,
                firstName: staff?.firstName,
              }
            : {
                activeStatus: false,
                date:  moment.utc(moment(selectedDate).format("MM-DD-YY")).format(),
                companyId: staff?.companyId,
                staffId: staff?._id,
                status:
                  dayOff && !thisStaff?.status || thisStaff?.status === "Off-day"
                    ? "Off-day"
                    : thisStaff?.status?.toLowerCase() === "absent"
                    ? "Absent"
                    : "Present",
                currentStatus:
                  dayOff && !thisStaff?.status || thisStaff?.status === "Off-day" 
                    ? "dayOff"
                    : thisStaff?.status?.toLowerCase() === "absent"
                    ? "Absent"
                    : thisStaff?.currentStatus === "clockOut"
                    ? "clockOut"
                    : "clockIn",
                // checkInTime:
                //   thisStaff?.status?.toLowerCase() === "absent" ||
                //   thisStaff?.status?.toLowerCase() === "dayoff"
                //     ? ""
                //     : selectedDate,
                checkInTime:  expectedclockInTime,
                firstName: staff?.firstName,
              }
          : 
          thisStaff?.status?.toLowerCase() === "absent" || thisStaff?.status?.toLowerCase() === "off-day" ? {}:
          {
              ...thisStaff,
              activeStatus: false,
              status:
                dayOff && !thisStaff?.status
                  ? "Off-day"
                  : thisStaff?.status?.toLowerCase() === "absent"
                  ? "Absent"
                  : thisStaff?.status === "Off-day"
                  ? "Off-day"
                  : "Present",
              currentStatus:
                dayOff && !thisStaff?.status
                  ? "dayOff"
                  : thisStaff?.status?.toLowerCase() === "absent"
                  ? "Absent"
                  : thisStaff?.status === "Off-day"
                  ? "dayOff"
                  : "clockOut",
              // checkOutTime: selectedDate,,
              checkOutTime: expectedclockOutTime,
              firstName: staff?.firstName,
            };
      })
      
      setTempStaffData( staffsdata?.filter((obj)=> obj.staffId));
  }, []);



  const handleOnSave = async (e) => {
    setDisabled(true);
   
    if (attendenceStatus === "clockInAll") {

      let payload = tempStaffData?.map((staff) => {
        return {
          ...staff,
          checkInTime:
            staff?.status?.toLowerCase() === "absent" ||
            staff?.status?.toLowerCase() === "off-day"
              ? ""
              : staff?.checkInTime,
              checkOutTime:
              staff?.status?.toLowerCase() === "absent" ||
              staff?.status?.toLowerCase() === "off-day"
                ? ""
                : staff?.checkOutTime,
        };
      });

      await ApiPost("attendence", payload)
        .then((res) => {
         toggle("", 200);
          checkClockinTime();
        })
        .catch((err) => {
          console.log(err);
          setDisabled(false);
        });
    } else {
      let payload = tempStaffData?.map((staff, i) => {
        return {
          checkOutTime:
            staff?.status?.toLowerCase() === "absent"
              ? ""
              : staff?.status === "Off-day"
              ? ""
              : moment(staff?.checkOutTime).format(),
          status: staff?.status,
          currentStatus:
            staff?.status?.toLowerCase() === "absent"
              ? "Absent"
              : staff?.status === "Off-day"
              ? "dayOff"
              : "clockOut",
          _id: staff?._id,
          activeStatus: false,
        };
      });

      ApiPost("attendence/user/company/multipleUpdate/data", payload)
        .then((res) => {
          checkClockinTime();
          setDisabledToggle(true);
        })
        .catch((err) => {});
    }
  };

  return (
    <div>
      <div className="all-clock-in-out-modal-blur">
        <div className="all-clock-in-modal">
          <div className="modal-header">
            <div className="">
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div className="modal-close" onClick={toggle}>
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div>
                    <h1>
                      Clock {attendenceStatus === "clockInAll" ? "in" : "out"}{" "}
                      all staff
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="all-clock-in-time-body">
        
            {tempStaffData?.map((allStaffData, i) => {
              let thisStaff = staffData?.find(
                (staff) => staff?._id === allStaffData?.staffId
              );
              let tempClockInTime = thisStaff?.workingDays?.find(
                (day) => day?.Day === moment(selectedDate).format("dddd")
              )?.starttime;

              let tempClockOutTime = thisStaff?.workingDays?.find(
                (day) => day?.Day === moment(selectedDate).format("dddd")
              )?.endtime;
             

              let thisStaffMinTime = moment(allStaffData?.checkInTime).add(
                15,
                "minutes"
              )._d;
              let thisStaffMaxTime = moment("23:50", "hh-mm a")._d;
             
              return (
                <div className="all-clock-list">
                  <div className="name-style">
                    <h4>{allStaffData?.firstName}</h4>
                    {allStaffData?.currentStatus !== "dayOff" &&
                      (attendenceStatus === "clockInAll" ? (
                        <p>
                          Expected check in -{" "}
                          {moment(moment(tempClockInTime, "hh-mm a")).format(
                            "hh:mm A"
                          )}
                        </p>
                      ) : (
                        <p>
                          Expected clock out -{" "}
                          {moment(moment(tempClockOutTime, "hh-mm a")).format(
                            "hh:mm A"
                          )}
                        </p>
                      ))}
                  </div>
                  <div className="time-user-details">
                    {/* <button>10:14 AM</button> */}
                    {allStaffData?.currentStatus?.toLowerCase() === "absent" ? (
                      <div
                        style={{
                          width: "100px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "15px",
                        }}
                      >
                        <button className="allClockIn-absent-btn">
                          Absent
                        </button>
                      </div>
                    ) : // : allStaffData?.currentStatus === "clockOut" ? (
                    //   <div
                    //     style={{
                    //       width: "100px",
                    //       display: "flex",
                    //       justifyContent: "center",
                    //       alignItems: "center",
                    //       marginRight: "15px",
                    //     }}
                    //   >
                    //     <button className="allClockIn-clockout-btn">Clock out</button>
                    //   </div>
                    // )
                    allStaffData?.currentStatus?.toLowerCase()  === "dayoff" ? (
                      <div
                        style={{
                          width: "100px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "15px",
                        }}
                      >
                        <button className="allClockIn-offday-btn">
                          Off-day
                        </button>
                      </div>
                    ) : (
                      <div
                        className="allClockIn-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {attendenceStatus === "clockOutAll" ? (
                          <DatePicker
                            selected={allStaffData?.checkOutTime}
                            onChange={(e) =>
                              SunStartTime(e, allStaffData?.staffId)
                            }
                            minTime={thisStaffMinTime}
                            maxTime={thisStaffMaxTime}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            dateFormat="hh:mm aa"
                          />
                        ) : (
                          <DatePicker
                            selected={allStaffData?.checkInTime}
                            onChange={(e) =>
                              SunStartTime(e, allStaffData?.staffId)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            dateFormat="hh:mm aa"
                          />
                        )}
                      </div>
                    )}
                    <div
                      onClick={(e) =>
                        setTempStaffData(
                          tempStaffData?.map((staff) => {
                            return staff?.staffId === allStaffData?.staffId
                              ? {
                                  ...staff,
                                  status:
                                    allStaffData?.status?.toLowerCase() ===
                                    "off-day"|| allStaffData?.status?.toLowerCase() === "absent" 
                                      ? "Present"
                                      : "Off-day",
                                  currentStatus:
                                    allStaffData?.status?.toLowerCase() ===
                                    "off-day" || allStaffData?.status?.toLowerCase() === "absent" 
                                      ? allStaffData?.currentStatus?.toLowerCase() ===
                                      "off-day" ? 'clockOut' : "clockIn"
                                      : "dayOff",
                                      checkOutTime:staff?.checkOutTime,

                                }
                              : { ...staff };
                          })
                        )
                      }
                    >
                      {attendenceStatus === "clockInAll" &&
                      allStaffData?.status?.toLowerCase() === "off-day" || allStaffData?.status?.toLowerCase() === "absent"   ? (
                        <div style={{ cursor: "pointer" }}>
                          <img src={UserPresentIcon} alt="UserPresentIcon" />
                        </div>
                      ) : attendenceStatus === "clockOutAll" ? null: (
                        <div className="user-profile-design">
                          <img src={OffDayIcon} alt="UserXIcon" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
              
            })}
          </div>
          <div className="all-clock-in-time-footer">
            <button disabled={disabled} onClick={(e) => handleOnSave(e)}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllClockInClockOut;