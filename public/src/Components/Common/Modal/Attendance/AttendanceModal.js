import React, { useState, useEffect } from "react";
import "./AttendanceModal.scss";
import CloseIcon from "../../../../assets/svg/Close.svg";
import ClockInClockOut from "./ClockInClockOut";
import AllClockInClockOut from "./AllClockInClockOut";
import Clockin from "../../../../assets/svg/clockin.svg";
import back from "../../../../assets/svg/123.svg";
import ClockinRed from "../../../../assets/svg/ClockinRed.svg";
import clockout from "../../../../assets/svg/clockout.svg";
import clock_out_status from "../../../../assets/svg/clock_out_status.svg";
import ClockoutRed from "../../../../assets/svg/ClockoutRed.svg";
import absentIcon from "../../../../assets/svg/absent.svg";
import moment from "moment";
import { ApiPost } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import Clockout from "./Clockout";
import ClockInIcon from "../../../../assets/svg/AttendanceClockIn.svg";
import CalendarIcon from "../../../../assets/svg/calendar_blue.svg";
import DatePicker from "react-datepicker";
import OutsideAlerter from "../../OutsideAlerter";
import Success from "../../Toaster/Success/Success"
import * as userUtil from "../../../../utils/user.util";
import {  useDispatch } from "react-redux";
import { setattendanceMarkDate } from "../../../../redux/actions/attendanceActions";

function AttendanceModal(props) {
  const { toggle, staffData, showDefault, setShowDefault,attendanceMarkDate ,setAttendaceDateMark,permission} = props;
  const dispatch = useDispatch();
  let attendanceMark =attendanceMarkDate
  const [clockInModal, setClockInModal] = useState(false);
  const [clockOutModal, setClockOutModal] = useState(false);
  const [MarkLeaveModal, setMarkLeaveModal] = useState(false);
  const [allClockInModal, setAllClockInModal] = useState(false);
  const [showAllClockOutBtn, setShowAllClockOutBtn] = useState(false);
  const [staffDetails, setStaffDetails] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [attendenceStatus, setAttendenceStatus] = useState();
  const [userAttendenceData, setuserAttendenceData] = useState();
  const [userDataId, setUserDataId] = useState();
  const [optionsShow, setOptionsShow] = useState(false);
  const [targetIndex, setTargetIndex] = useState();
  const [editData, setEditData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();

  const [staffRequestedData, setStaffRequestedData] = useState([]);
  const [requestedStaffDetails, setRequestedStaffDetails] = useState([]);
  const [nonRequestedStaffDetails, setNonRequestedStaffDetails] = useState([]);

  const [enableClockOutAllBtn, setEnableClockOutAllBtn] = useState(false);
  const [hideClockInBtn, setHideClockInBtn] = useState(false);
  const [hideClockOutBtn, setHideClockOutBtn] = useState(false);

  const [fromStaffRequestedData, setFromStaffRequestedData] = useState({});
  const userInfo = Auth.getUserDetail();
  let DefaultOpendata;
  let startTime = moment(new Date()).format("hh:mm A");
  let temExpectedClockInTime = moment(startTime, "hh:mm A");

    var date2 = moment(selectedDate).format("L")?.toString();
    var time2 = temExpectedClockInTime?._i?.toString();
    var dateTime = moment(date2 + " " + time2, "MM/DD/YYYY hh:mm A");
    let tempFinalTime = moment(dateTime, "YYYY-MM-DD hh:mm A").format("LLLL");

    // setCurrentTime(new Date(tempFinalTime));

  const optionsToggle = (index) => {
    setOptionsShow(!optionsShow);
    if (optionsShow) {
      setTargetIndex(null);
    } else {
      setTargetIndex(index);
    }
  };

  const updateAttendance = async () => {
    let data = {
      startTime: moment(new Date()).startOf("month").format("YYYY-MM-DD"),
      endTime: moment(new Date())
        .endOf("month")
        .add(1, "day")
        .format("YYYY-MM-DD"),
    };
    await ApiPost("attendence/company/alldata/" + userInfo.companyId, data)
      .then((res) => {
        // setuserAttendenceData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(()=>{
    updateAttendance()
  },[])


  const handleOptionSelect = async (
    key,
    staffDetails,
    selectedStaffAttendance
  ) => {
    // console.log("///// option key", key);
    // console.log("///// option staffDetails", staffDetails);
    // console.log("///// option selectedStaffAttendance", selectedStaffAttendance);
    if (key === "editClockIn") {
      setEditData(selectedStaffAttendance);
      clockToggle(staffDetails, "clockIn", selectedStaffAttendance);
    } else if (key === "editClockOut") {
      setEditData(selectedStaffAttendance);
      clockOutToggle(staffDetails, selectedStaffAttendance, "clockOut");
    } else if (key === "markLeave") {
      setEditData(selectedStaffAttendance);
      MarkLeaveToggle(staffDetails, "Absent", selectedStaffAttendance);
    } else if (key === "voidLeave") {
      setEditData(selectedStaffAttendance);
      editStaffStatus(selectedStaffAttendance, "Awaiting");
    }else if (key === "reject") {
      setEditData(selectedStaffAttendance);
      rejectRequest(selectedStaffAttendance, "Awaiting");
    }
  };

  const rejectRequest = async (selectedStaffAttendance, key) => {
    let data = {
      status: "Awaiting",
      currentStatus: key,
      checkInTime: "",
      checkOutTime: null,
      date: moment.utc(new Date(tempFinalTime)).subtract(3,"hour").format(),
      _id: selectedStaffAttendance._id,
      activeStatus: false,
      skip: false,
    };
    await ApiPost("attendence/user/company/multipleUpdate/data", data)
      .then((res) => {
        setSuccess(true);
        setToastmsg("Request denied!");
        checkClockinTime();
      })
      .catch((err) => {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
        console.log(err);
      });
  };

  const editStaffStatus = async (selectedStaffAttendance, key) => {
    let data = {
      status: "Awaiting",
      currentStatus: key,
      checkInTime: "",
      checkOutTime: null,
      date: moment.utc(new Date(tempFinalTime)).subtract(3,"hour").format(),
      _id: selectedStaffAttendance._id,
      activeStatus: false,
      skip: false,
    };
    await ApiPost("attendence/user/company/multipleUpdate/data", data)
      .then((res) => {
        setSuccess(true);
        setToastmsg("Attendance updated");
        checkClockinTime();
      })
      .catch((err) => {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
        console.log(err);
      });
  };

  const handledenyOptionSelect = async (selectedStaffAttendance) => {
   
    let data = {
      checkOutTime: null,
      _id: selectedStaffAttendance._id,
      activeStatus: false,
    };
    await ApiPost("attendence/user/company/multipleUpdate/data", data)
      .then((res) => {
        setSuccess(true);
        setToastmsg("Request denied!");
        checkClockinTime();
      })
      .catch((err) => {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
        console.log(err);
      });
  };
  let date = new Date();
  let todayDate = moment(selectedDate).format("dddd");

  const clockToggle = (data, status, attendance, response, category) => {
    // console.log("///// staffDetails", data);
    // console.log("///// status", status);
   
    setFromStaffRequestedData(attendance);
    setStaffDetails(data);
    setAttendenceStatus(status);
    setClockInModal(!clockInModal);
    if (response) {
      setSuccess(true);
      setToastmsg("Clock-in successfully!");
    }
  };

  const clockOutToggle = (data, userid, status, attendance, response) => {
    // console.log("staffDetails", data);
    // console.log("staffDetails user id", userid);
    // console.log("staffDetails user attendance", attendance);
    // console.log("staffDetails now", status);
    setStaffDetails(data);
    setUserDataId(userid);
    setFromStaffRequestedData(userid);
    setAttendenceStatus(status);
    setClockOutModal(!clockOutModal);
    if (response) {
      setSuccess(true);
      setToastmsg("Attendance updated");
    }
  };

  const MarkLeaveToggle = async (staffDetail, key, selectedStaffAttendance) => {
    // setStaffDetails(staffDetail);
    // setMarkLeaveModal(!MarkLeaveModal)
    let isThisStaffAlreadyMarked = userAttendenceData?.find(
      (data) => data?.staffId === staffDetail?._id
    );

    if (isThisStaffAlreadyMarked) {
      let data = {
        status: "Absent",
        currentStatus: key,
        checkInTime: "",
        checkOutTime: "",
        date:moment.utc(new Date(tempFinalTime)).subtract(3,"hour").format(),
        _id: selectedStaffAttendance._id,
      };
      await ApiPost("attendence/user/company/multipleUpdate/data", data)
        .then((res) => {
          setSuccess(true);
          setToastmsg("Attendance updated");
          checkClockinTime();
        })
        .catch((err) => {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
          console.log(err);
        });
    } else {
      
      let data = [
        {
          staffId: staffDetail?._id,
          status: "Absent",
          currentStatus: key,
          companyId: staffDetail?.companyId,
          date: moment.utc(new Date(tempFinalTime)).subtract(3,"hour").format(),
        },
      ];
      await ApiPost("attendence", data)
        .then((res) => {
          
          // toggle(false)
          setSuccess(true);
          setToastmsg("Attendance updated");
          checkClockinTime();
        })
        .catch((err) => {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
          console.log(err);
        });
    }
  };

  const MarkOffdayToggle = async (staffDetail, key, selectedStaffAttendance) => {
    // setStaffDetails(staffDetail);
    // setMarkLeaveModal(!MarkLeaveModal)
    let isThisStaffAlreadyMarked = userAttendenceData?.find(
      (data) => data?.staffId === staffDetail?._id
    );

    if (isThisStaffAlreadyMarked) {
      let data = {
        status: "Off-day",
        currentStatus: key,
        checkInTime: "",
        checkOutTime: "",
        date:moment.utc(new Date(tempFinalTime)).subtract(3,"hour").format(),
        _id: selectedStaffAttendance._id,
      };
      await ApiPost("attendence/user/company/multipleUpdate/data", data)
        .then((res) => {
          setSuccess(true);
          setToastmsg("Attendance updated");
          checkClockinTime();
        })
        .catch((err) => {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
          console.log(err);
        });
    } else {
   
      let data = [
        {
          staffId: staffDetail?._id,
          status: "Off-day",
          currentStatus: key,
          companyId: staffDetail?.companyId,
          date: moment.utc(new Date(tempFinalTime)).subtract(3,"hour").format(),
        },
      ];
      await ApiPost("attendence", data)
        .then((res) => {
          
          // toggle(false)
          setSuccess(true);
          setToastmsg("Attendance updated");
          checkClockinTime();
        })
        .catch((err) => {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
          console.log(err);
        });
    }
  };

  const allClockInToggle = (status, response) => {
    setAttendenceStatus(status);
    setAllClockInModal(!allClockInModal);
    if (response) {
      setSuccess(true);
      setToastmsg("Attendance updated");
    }
  };

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  const checkClockinTime = async () => {
    setOptionsShow(false);
    let data = {
      startTime: moment(selectedDate).format("YYYY-MM-DD"),
      endTime: moment(selectedDate).add(1, "days").format("YYYY-MM-DD"),
    };

    // http://localhost:7075/api/attendence/company/alldata/8787
    await ApiPost("attendence/company/" + userInfo.companyId, data)
      .then(async(res) => {

        let tempData = res.data.data?.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        // let tempAttendanceData = tempData
        let tempAttendanceData = removeDuplicateObjectFromArray(
          tempData,
          "staffId"
        );
      
        let tempClkOutData = tempAttendanceData.filter(
          (data) =>
            data?.currentStatus?.toLowerCase() === "clockin" ||
            data?.currentStatus?.toLowerCase() === "absent" ||
            data?.currentStatus === "dayOff"
        );
        let tempEnableClockOutAllBtn =
          tempAttendanceData?.length === staffData?.length &&
          tempAttendanceData?.filter(
            (data) => data?.currentStatus !== "clockIn"
          )?.length === 0;
        setEnableClockOutAllBtn(tempEnableClockOutAllBtn);

        let tempHideClockInBtn =
          tempAttendanceData?.length === 0 &&
          tempAttendanceData?.filter(
            (data) => data?.currentStatus === "clockIn"
          ).length !== 0;
        setHideClockInBtn(tempHideClockInBtn);

        let tempHideClockOUtBtn =
          tempAttendanceData?.length !== staffData?.length ||
          tempAttendanceData?.filter(
            (data) => data?.currentStatus === "clockOut"
          )?.length !== 0;

        setHideClockOutBtn(tempHideClockOUtBtn);

        // console.log(
        //   "~~~~~ tempEnableClockOutAllBtn",
        //   tempAttendanceData,
        //   staffData,
        //   tempClkOutData
        // );
        // console.log(
        //   "present status attendance",
        //   tempData?.filter((data) => data.activeStatus)
        // );
        setShowAllClockOutBtn(
          tempAttendanceData?.length !== 0 &&
            staffData?.length === tempAttendanceData?.length &&
            !(
              tempAttendanceData?.filter(
                (data) => data?.currentStatus === "Awaiting" 
              )?.length > 0
            )
        );

        let tempStaffRequestedData = tempAttendanceData.filter(
          (data) => data?.activeStatus
          // (data) => data?.currentStatus?.toLowerCase() === "present" && !data?.activeStatus
        );
        let tempStaffNotRequestedData = tempAttendanceData.filter(
          (data) => data?.currentStatus?.toLowerCase() !== "present"
        );
      
        setStaffRequestedData(tempStaffRequestedData);
        setuserAttendenceData(tempStaffNotRequestedData);
        // console.log("//attendance// userAttendanceData", tempStaffNotRequestedData);
        // let tempRequestedStaffDetails = tempStaffRequestedData.map((staff) => {
        //   let thisStaffDetails = staffData.find((data) => data?._id === staff?.staffId);
        //   return thisStaffDetails;
        // });
        let tempRequestedStaffDetails = staffData.filter((staff) => {
          let thisStaffData = tempStaffRequestedData.find(
            (data) => data?.staffId === staff?._id
          );
          return !!thisStaffData;
        });
        setRequestedStaffDetails(tempRequestedStaffDetails);
        // let tempNonRequestedStaffDetails = tempStaffNotRequestedData.map((staff) => {
        //   let thisStaffDetails = staffData.find((data) => data?._id === staff?.staffId);
        //   return thisStaffDetails;
        // });
        let tempNonRequestedStaffDetails =
          tempStaffRequestedData?.length === 0
            ? staffData
            : staffData.filter(
                (staff) =>
                  !tempStaffRequestedData.find(
                    (data) => data?.staffId === staff?._id
                  )
              );
        
    
      //   let datesss = moment(selectedDate).format("dddd");
      //   let offDays = 1
      //    let staffDatass= tempNonRequestedStaffDetails.map((staffDetails)=>{
      //     console.log("staffDetailsaaaaa",staffDetails,datesss)
      //       staffDetails?.workingDays?.map(async(day) => {
      //         if (day?.dayOff === true) {
      //           if (day?.Day === datesss) {
                
      //             return (
      //               offDays = offDays + 1
      //             )
      //           }
      //         }
      //       })
           
      //     })
      //     console.log("offDays",offDays,moment(attendanceMark).format("L"),moment(new Date()).format("L"))
      
      //   if ( moment(attendanceMark).format("L") !== moment(new Date()).format("L") && offDays != 1){
      //   tempNonRequestedStaffDetails.map((staffDetails)=>{
      //     staffDetails?.workingDays?.map(async(day) => {
      //       if (day?.dayOff === true) {
      //         if (day?.Day === todayDate) {
      //           let data = [
      //             {
      //               staffId: staffDetails?._id,
      //               status: "Off-day",
      //               currentStatus: "dayOff",
      //               companyId: staffDetails?.companyId,
      //               date: moment.utc(moment(moment(new Date(`${moment(selectedDate).format("MM-DD-yyyy")} ${moment(new Date()).format("h:mm")}`))).subtract(330,'minutes').add(1,"day").format("MM-DD-YY h:mm")).format(),
      //               clockinTime:new Date ()
                    
      //             },
      //           ];
      //           await ApiPost("attendence", data)
      //             .then((resp) => {
      //               console.log("ress", resp);
      //             })
      //             .catch((err) => {

      //               console.log(err);
      //             });
      //           return (
      //             <>
      //               <button   style={{
      //                   color: "#6F737D",
      //                   fontFamily: "Poppins",
      //                   fontStyle: "normal",
      //                   fontWeight: "500",
      //                   fontSize: "11px",
      //                   background:
      //                     "rgba(111, 115, 125, 0.15)",
      //                 }}>Off-day</button>
      //             </>
      //           );
      //         }
      //       } else if (day?.Day === todayDate) {
      //         return (
      //           <>
      //             <button>Awaiting</button>
      //           </>
      //         );
      //       }
      //     })
      //   }
       
      //   )
      //   let values = {
      //     attendanceMarkDate: new Date(),
      //     companyId: userInfo.companyId,
      //   };
      //   let respo = await ApiPost("setting/", values);
      //   try {
      //     if (respo.data.status === 200) {
      //       userUtil.setSetting(respo?.data?.data[0])
      //       dispatch(setattendanceMarkDate(new Date()))
      //       setAttendaceDateMark(new Date())
      //       attendanceMark =new Date()
      //     }
      //   } catch (err) {
      //     console.log(err);
      //   }
      //   checkClockinTime()
      // }
        setNonRequestedStaffDetails(tempNonRequestedStaffDetails);
        if (showDefault) {
         
          DefaultOpendata = tempStaffRequestedData[0];
          setFromStaffRequestedData(tempStaffRequestedData[0]);
          setAttendenceStatus("clockIn");
          setStaffDetails(tempRequestedStaffDetails[0]);
          setEditData(tempStaffRequestedData[0]);
          setShowDefault(!showDefault);
          setClockInModal(!clockInModal);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
 
  const handleSelectDate = async (date) => {
    if (date) {
      setSelectedDate(new Date(date));
    }
  };

  useEffect(() => {
    checkClockinTime();
    if (userInfo && userInfo.role === "Staff") {
      // let staffData = [];
      // staffData.push(userInfo);
      // setStaffData(staffData);
    } else {
      return () => props?.getStaffByCompany();
    }

   
    // }, []);
  }, [selectedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  const ApproveallRequest = () => {
    staffRequestedData?.map(async (staffs, i) => {
      let data = {
        ...staffs,
        currentStatus:
          staffs?.currentStatus === "Present" ? "clockIn" : "clockOut",
        activeStatus: false,
        skip: false,
      };
      await ApiPost("attendence/user/company/multipleUpdate/data", data)
        .then((res) => {
          if (i == staffRequestedData?.length - 1) {
            checkClockinTime();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <>
      <div className="attebdabce-modal-design">
        <div className="modal-header">
          <div className="container-long">
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div className="modal-close" onClick={toggle}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div>
                  <h1>Attendance</h1>
                </div>
              </div>
              { permission?.filter((obj) => obj.name === "Edit attendance")[0]
                  ?.isChecked === false ? null  :<div className="new-attendance-modal-desgin-alignment">
                <img src={CalendarIcon} alt="CalendarIcon" />
                <span>
                  <DatePicker
                    selected={selectedDate}
                    placeholderText="Date"
                    dateFormat="d MMM ''yy"
                    onChange={(date) => handleSelectDate(date)}
                    // onChange={(date) => setSelectedDate(new Date(date))}
                    onKeyDown={(e) => e.preventDefault()}
                    maxDate={moment(new Date())._d}
                    fixedHeight
                  />
                </span>
              </div>}
            </div>
          </div>
        </div>
        <div
          className={
            requestedStaffDetails?.length > 0
              ? "global-attendance-modal-boady pending-request-scrolls"
              : "global-attendance-modal-boady"
          }
        >
          <div className="attebdabce-modal-body">
            <div className="container">
              <div className="box-center-alignment">
                <div className="box-design">
                  {requestedStaffDetails?.length > 0 && (
                    <>
                   
                      <div className="box-title-alignment">
                        <h2>Pending requests</h2>
                        <h2 onClick={() => ApproveallRequest()}>Approve all</h2>
                      </div>

                      <div className="all-box-alignment-fixed">
                        {requestedStaffDetails?.map((staffDetails) => {
                          let thisStaffAttendance = staffRequestedData?.filter(
                            (ans) => ans?.staffId === staffDetails?._id
                          );

                          return (
                            <div className="attebdabce-box-list-view">
                              <div className="first-box-title-alignment">
                                <div>
                                  <button>Pending</button>
                                </div>
                                <div>
                                  <span>
                                    Requested clock{" "}
                                    {!thisStaffAttendance[0]?.checkOutTime
                                      ? "in"
                                      : "out"}{" "}
                                    for{" "}
                                    {moment(
                                      !thisStaffAttendance[0]?.checkOutTime
                                        ? thisStaffAttendance[0]?.checkInTime
                                        : thisStaffAttendance[0]?.checkOutTime
                                    ).format("h:mm a")}
                                  </span>
                                </div>
                              </div>
                              <div className="all-content-list-alignment">
                                <div className="information-text-style">
                                  <h3>
                                    {staffDetails?.firstName}{" "}
                                    {staffDetails?.lastName}
                                  </h3>
                                  {staffDetails?.workingDays?.map((day) => {
                                    if (day?.Day === todayDate) {
                                      return (
                                        <>
                                          <p>
                                            {moment(
                                              moment(day?.starttime, "hh-mm a")
                                            ).format("hh:mm A")}{" "}
                                            to{" "}
                                            {moment(
                                              moment(day?.endtime, "hh-mm a")
                                            ).format("hh:mm A")}{" "}
                                          </p>
                                        </>
                                      );
                                    }
                                  })}
                                </div>
                                <div className="all-button-alignment">
                                  {staffDetails?.workingDays?.map((day) => {
                                    if (day?.Day === todayDate) {
                                      return (
                                        <>
                                       
                                          {thisStaffAttendance[0]
                                            ?.checkInTime &&
                                          (thisStaffAttendance[0]
                                            ?.checkOutTime ) ? (
                                            <>
                                              <>
                                                <button
                                                  onClick={(e) =>
                                                    handledenyOptionSelect(
                                                      thisStaffAttendance[0]
                                                    )
                                                  }
                                                >
                                                  Deny request
                                                </button>

                                                <button
                                                  onClick={(e) =>
                                                    clockOutToggle(
                                                      staffDetails,
                                                      thisStaffAttendance[0],
                                                      "clockOut"
                                                    )
                                                  }
                                                >
                                                  <div className="flex-alignment">
                                                    <div>
                                                      <img
                                                        src={clockout}
                                                        alt="Clockin"
                                                      />{" "}
                                                    </div>
                                                    <div>Approve </div>
                                                  </div>
                                                </button>
                                              </>
                                            </>
                                          ) : (
                                            <>
                                            
                                              {/* {userAttendenceData?.map((clockinTime)=>{ */}
                                              {/* return( */}
                                              <button
                                                onClick={(e) =>
                                                  handleOptionSelect(
                                                    "reject",
                                                    staffDetails,
                                                    thisStaffAttendance[0]
                                                  )
                                                }
                                              >
                                                Deny request
                                              </button>
                                              {/* ) */}
                                              {/* })} */}
                                              <button
                                                onClick={(e) =>
                                                  clockToggle(
                                                    staffDetails,
                                                    "clockIn",
                                                    thisStaffAttendance[0]
                                                  )
                                                }
                                              >
                                                <div className="flex-alignment">
                                                  <div>
                                                    <img
                                                      src={Clockin}
                                                      alt="Clockin"
                                                    />{" "}
                                                  </div>
                                                  <div>Approve</div>
                                                </div>
                                              </button>
                                            </>
                                          )}
                                        </>
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <div className="box-title-alignment">
                    <h2>Staff list</h2>
                    {showAllClockOutBtn ? (
                      userAttendenceData &&
                      userAttendenceData.filter(
                        (obj) => obj?.currentStatus === "clockOut"
                      )?.length > 0 ? (
                        <h3 className="disable-clockin" disabled>
                          Clock out all
                        </h3>
                      ) : (
                        <h2 onClick={(e) => allClockInToggle("clockOutAll")}>
                          Clock out all
                        </h2>
                      )
                    ) : userAttendenceData &&
                      userAttendenceData.filter(
                        (obj) => obj?.currentStatus === "clockOut"
                      )?.length > 0 &&
                      userAttendenceData.filter(
                        (obj) => obj?.currentStatus === "clockOut"
                      )?.length !== staffData?.length ? (
                      <h3 className="disable-clockin" disabled>
                        Clock in all
                      </h3>
                    ) : userAttendenceData &&
                      userAttendenceData?.filter(
                        (obj) => obj?.currentStatus === "clockIn"
                      )?.length > 0 ? (
                      <h3 className="disable-clockin" disabled>
                        Clock in all
                      </h3>
                    ) : (
                      <h2 onClick={(e) => allClockInToggle("clockInAll")}>
                        Clock in all
                      </h2>
                    )}
                  </div>

                  <div className="all-box-alignment-fixed">
                    {nonRequestedStaffDetails?.map((staffDetails, index) => {
                      let thisStaffAttendance = userAttendenceData?.filter(
                        (ans) => ans?.staffId === staffDetails?._id
                      );
                    
                      return (
                        <div className="attebdabce-box-list-view">
                          <div className="first-box-title-alignment">
                            <div>
                              <>
                                {thisStaffAttendance?.length > 0 ? (
                                  <>
                                    {thisStaffAttendance.map((clockinTime) => {
                                      // console.log("clockinTime...", clockinTime?.currentStatus);
                                      if (
                                        clockinTime?.staffId ===
                                        staffDetails?._id
                                      ) {
                                        return (
                                          <>
                                            {clockinTime?.currentStatus?.toLowerCase() ===
                                            "clockout" ? (
                                              <button
                                                style={{
                                                  color: "#065F46",
                                                  fontFamily: "Poppins",
                                                  fontStyle: "normal",
                                                  fontWeight: "500",
                                                  fontSize: "10px",
                                                  background:
                                                    "rgba(6, 95, 70, 0.1)",
                                                }}
                                              >
                                                Clock out
                                              </button>
                                            ) : clockinTime?.currentStatus?.toLowerCase() ===
                                              "clockin" ? (
                                              <button
                                                style={{
                                                  color: "#065F46",
                                                  fontFamily: "Poppins",
                                                  fontStyle: "normal",
                                                  fontWeight: "500",
                                                  fontSize: "11px",
                                                  background:
                                                    "rgba(6, 95, 70, 0.1)",
                                                }}
                                              >
                                                Present
                                              </button>
                                            ) : clockinTime?.currentStatus?.toLowerCase() ===
                                              "absent" ? (
                                              <button
                                                style={{
                                                  color: "#A8071A",
                                                  fontFamily: "Poppins",
                                                  fontStyle: "normal",
                                                  fontWeight: "500",
                                                  fontSize: "11px",
                                                  background:
                                                    "rgba(168, 7, 26, 0.1)",
                                                }}
                                              >
                                                Absent
                                              </button>
                                            ) : clockinTime?.currentStatus?.toLowerCase() ===
                                              "dayoff" ? (
                                              <button
                                                style={{
                                                  color: "#6F737D",
                                                  fontFamily: "Poppins",
                                                  fontStyle: "normal",
                                                  fontWeight: "500",
                                                  fontSize: "11px",
                                                  background:
                                                    "rgba(111, 115, 125, 0.15)",
                                                }}
                                              >
                                                Off-day
                                              </button>
                                            ) : (
                                              clockinTime?.currentStatus?.toLowerCase() ===
                                                "awaiting" && (
                                                <>
                                                  <button>Awaiting</button>
                                                </>
                                              )
                                            )}
                                          </>
                                        );
                                      }
                                    })}
                                  </>
                                ) : (
                                  <>
                                    {staffDetails?.workingDays?.map((day) => {
                                      if (day?.dayOff === true) {
                                        if (day?.Day === todayDate) {
                                          return (
                                            <>
                                              <button   style={{
                                                  color: "#6F737D",
                                                  fontFamily: "Poppins",
                                                  fontStyle: "normal",
                                                  fontWeight: "500",
                                                  fontSize: "11px",
                                                  background:
                                                    "rgba(111, 115, 125, 0.15)",
                                                }}>Off-day</button>
                                            </>
                                          );
                                        }
                                      } else if (day?.Day === todayDate) {
                                        return (
                                          <>
                                            <button>Awaiting</button>
                                          </>
                                        );
                                      }
                                    })}
                                  </>
                                )}
                              </>
                            </div>

                            {thisStaffAttendance[0]?.currentStatus &&   
                            permission?.filter((obj) => obj.name === "Edit attendance")[0]
                                         ?.isChecked === false ? null  :
                                <div
                              style={{
                                display: "flex",
                                flex: "1",
                                justifyContent: "end",
                                cursor: "pointer",
                                position: "relative",
                              }}
                            >
           
                              {
                                thisStaffAttendance[0]?.currentStatus !==
                                  "dayOff" && (
                                  <div className="hover-three-dot-blue">
                                    <span onClick={(e) => optionsToggle(index)}>
                                      <svg
                                        width="30"
                                        height="20"
                                        viewBox="0 0 30 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          width="30"
                                          height="20"
                                          fill="white"
                                        />
                                        <circle
                                          cx="15"
                                          cy="10"
                                          r="2"
                                          fill="#97A7C3"
                                        />
                                        <circle
                                          cx="6"
                                          cy="10"
                                          r="2"
                                          fill="#97A7C3"
                                        />
                                        <circle
                                          cx="24"
                                          cy="10"
                                          r="2"
                                          fill="#97A7C3"
                                        />
                                      </svg>
                                    </span>
                                    {optionsShow && targetIndex === index && (
                                      <OutsideAlerter toggle={optionsToggle}>
                                        <div className="attendance-options-container ">
                                          {/* <span>
                                          {staffDetails?.firstName} ||{" "}
                                          {thisStaffAttendance[0]?.currentStatus?.toLowerCase()}
                                        </span> */}
                                          {thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                            "absent" && (
                                            <span
                                              onClick={(e) =>
                                                handleOptionSelect(
                                                  "voidLeave",
                                                  staffDetails,
                                                  thisStaffAttendance[0]
                                                )
                                              }
                                              className="attendance-options-danger attendance-options-danger-clock"
                                            >
                                              <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L1.53033 0.46967ZM10.4697 11.5303C10.7626 11.8232 11.2374 11.8232 11.5303 11.5303C11.8232 11.2374 11.8232 10.7626 11.5303 10.4697L10.4697 11.5303ZM0.46967 1.53033L10.4697 11.5303L11.5303 10.4697L1.53033 0.46967L0.46967 1.53033Z"
                                                  fill="#E66666"
                                                />
                                                <path
                                                  d="M0.46967 10.4697C0.176777 10.7626 0.176777 11.2374 0.46967 11.5303C0.762563 11.8232 1.23744 11.8232 1.53033 11.5303L0.46967 10.4697ZM11.5303 1.53033C11.8232 1.23744 11.8232 0.762563 11.5303 0.46967C11.2374 0.176777 10.7626 0.176777 10.4697 0.46967L11.5303 1.53033ZM1.53033 11.5303L11.5303 1.53033L10.4697 0.46967L0.46967 10.4697L1.53033 11.5303Z"
                                                  fill="#E66666"
                                                />
                                              </svg>
                                              Void leave
                                            </span>
                                          )}
                                          {(thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                            "clockin" ||
                                            thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                              "clockout") && (
                                            <span
                                              onClick={(e) =>
                                                handleOptionSelect(
                                                  "editClockIn",
                                                  staffDetails,
                                                  thisStaffAttendance[0]
                                                )
                                              }
                                              className="attendance-options-edit-clock"
                                            >
                                              <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M9 1H11.6667C12.0203 1 12.3594 1.14048 12.6095 1.39052C12.8595 1.64057 13 1.97971 13 2.33333V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13H9M5.66667 10.3333L9 7M9 7L5.66667 3.66667M9 7H1"
                                                  stroke="#1479FF"
                                                  stroke-width="1.25"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                              Edit clock in time
                                            </span>
                                          )}
                                          {thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                            "clockout" && (
                                            <span
                                              onClick={(e) =>
                                                handleOptionSelect(
                                                  "editClockOut",
                                                  staffDetails,
                                                  thisStaffAttendance[0]
                                                )
                                              }
                                              className="attendance-options-edit-clock"
                                            >
                                              <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M5 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V2.33333C1 1.97971 1.14048 1.64057 1.39052 1.39052C1.64057 1.14048 1.97971 1 2.33333 1H5M9.66667 10.3333L13 7M13 7L9.66667 3.66667M13 7H5"
                                                  stroke="#1479FF"
                                                  stroke-width="1.25"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                              Edit clock out time
                                            </span>
                                          )}
                                          {(thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                            "clockin" ||
                                            thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                              "clockout" ||
                                            thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                              "awaiting" || !thisStaffAttendance[0]?.currentStatus ) && (
                                            <span
                                              onClick={(e) =>
                                                handleOptionSelect(
                                                  "markLeave",
                                                  staffDetails,
                                                  thisStaffAttendance[0]
                                                )
                                              }
                                              className="attendance-options-danger attendance-options-danger-clock"
                                            >
                                              <svg
                                                width="16"
                                                height="14"
                                                viewBox="0 0 16 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M10.6667 13V11.6667C10.6667 10.9594 10.3858 10.2811 9.8857 9.78105C9.3856 9.28095 8.70732 9 8.00008 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M12.0001 4.33333L15.3334 7.66667M15.3334 4.33333L12.0001 7.66667M8.33341 3.66667C8.33341 5.13943 7.13951 6.33333 5.66675 6.33333C4.19399 6.33333 3.00008 5.13943 3.00008 3.66667C3.00008 2.19391 4.19399 1 5.66675 1C7.13951 1 8.33341 2.19391 8.33341 3.66667Z"
                                                  stroke="#E66666"
                                                  stroke-width="1.25"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                              Mark leave
                                            </span>
                                          )}
                                           { (thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                            "clockin" ||
                                            thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                              "clockout" ||
                                              thisStaffAttendance[0]?.currentStatus?.toLowerCase() ===
                                              "absent")
                                               &&  <span
                                                onClick={(e) =>
                                                  MarkOffdayToggle(
                                                    staffDetails,
                                                    "dayOff",
                                                    thisStaffAttendance[0]
                                                  )
                                              }
                                              className="attendance-options-danger"
                                            >
                                              <svg
                                                width="16"
                                                height="14"
                                                viewBox="0 0 16 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M10.6667 13V11.6667C10.6667 10.9594 10.3858 10.2811 9.8857 9.78105C9.3856 9.28095 8.70732 9 8.00008 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M12.0001 4.33333L15.3334 7.66667M15.3334 4.33333L12.0001 7.66667M8.33341 3.66667C8.33341 5.13943 7.13951 6.33333 5.66675 6.33333C4.19399 6.33333 3.00008 5.13943 3.00008 3.66667C3.00008 2.19391 4.19399 1 5.66675 1C7.13951 1 8.33341 2.19391 8.33341 3.66667Z"
                                                  stroke="#E66666"
                                                  stroke-width="1.25"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                              Mark Off-day
                                            </span>}
                                        </div>
                                      </OutsideAlerter>
                                    )}
                                  </div>
                                )}
              
                          
                               {thisStaffAttendance[0]?.currentStatus &&   
                            permission?.filter((obj) => obj.name === "Edit attendance")[0]
                                         ?.isChecked === false ? null  : thisStaffAttendance?.length > 0 &&
                                !!thisStaffAttendance[0]?.status &&
                                thisStaffAttendance[0]?.currentStatus ===
                                  "dayOff" && (
                                  <div className="hover-three-dot-blue">
                                    <span onClick={(e) => optionsToggle(index)}>
                                      <svg
                                        width="30"
                                        height="20"
                                        viewBox="0 0 30 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          width="30"
                                          height="20"
                                          fill="white"
                                        />
                                        <circle
                                          cx="15"
                                          cy="10"
                                          r="2"
                                          fill="#97A7C3"
                                        />
                                        <circle
                                          cx="6"
                                          cy="10"
                                          r="2"
                                          fill="#97A7C3"
                                        />
                                        <circle
                                          cx="24"
                                          cy="10"
                                          r="2"
                                          fill="#97A7C3"
                                        />
                                      </svg>
                                    </span>
                                    {optionsShow &&
                                            targetIndex === index && (
                                              <OutsideAlerter
                                                toggle={optionsToggle}
                                              >
                                                <div className="attendance-options-container">
                                                  <span
                                                    onClick={(e) =>
                                                      clockToggle(
                                                        staffDetails,
                                                        "clockIn"
                                                      )
                                                    }
                                                    className="attendance-options-danger"
                                                  >
                                                    <svg
                                                      width="12"
                                                      height="12"
                                                      viewBox="0 0 12 12"
                                                      fill="none"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        d="M1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L1.53033 0.46967ZM10.4697 11.5303C10.7626 11.8232 11.2374 11.8232 11.5303 11.5303C11.8232 11.2374 11.8232 10.7626 11.5303 10.4697L10.4697 11.5303ZM0.46967 1.53033L10.4697 11.5303L11.5303 10.4697L1.53033 0.46967L0.46967 1.53033Z"
                                                        fill="#E66666"
                                                      />
                                                      <path
                                                        d="M0.46967 10.4697C0.176777 10.7626 0.176777 11.2374 0.46967 11.5303C0.762563 11.8232 1.23744 11.8232 1.53033 11.5303L0.46967 10.4697ZM11.5303 1.53033C11.8232 1.23744 11.8232 0.762563 11.5303 0.46967C11.2374 0.176777 10.7626 0.176777 10.4697 0.46967L11.5303 1.53033ZM1.53033 11.5303L11.5303 1.53033L10.4697 0.46967L0.46967 10.4697L1.53033 11.5303Z"
                                                        fill="#E66666"
                                                      />
                                                    </svg>
                                                    Void Off-day
                                                  </span>
                                                </div>
                                              </OutsideAlerter>
                                            )}
                                  </div>
                                )}
                              
                            </div>}
                          </div>
                          <div className="all-content-list-alignment">
                            <div className="information-text-style">
                              <h3>
                                {staffDetails?.firstName}{" "}
                                {staffDetails?.lastName}
                              </h3>
                              
                              {staffDetails?.workingDays?.map((day) => {
                                if (
                                  (day?.dayOff === true &&
                                    !thisStaffAttendance[0]?.currentStatus) ||
                                  thisStaffAttendance[0]?.currentStatus ===
                                    "dayOff"
                                ) {
                                  if (day?.Day === todayDate) {
                                    return (
                                      <>
                                        <div className="first-box-title-alignment">
                                          <div>{/* <p>Off-day</p> */}</div>
                                        </div>{" "}
                                      </>
                                    );
                                  }
                                } else if (day?.Day === todayDate) {
                                  return (
                                    <>
                                      <p>
                                        {moment(
                                          moment(day?.starttime, "hh-mm a")
                                        ).format("hh:mm A")}{" "}
                                        to{" "}
                                        {moment(
                                          moment(day?.endtime, "hh-mm a")
                                        ).format("hh:mm A")}{" "}
                                      </p>
                                    </>
                                  );
                                }
                              })}
                            </div>
                            <div className="all-button-alignment">
                              {staffDetails?.workingDays?.map((day) => {
                                if (
                                  (day?.dayOff === true &&
                                    !thisStaffAttendance[0]?.currentStatus) ||
                                  thisStaffAttendance[0]?.currentStatus ===
                                    "dayOff"
                                ) {
                                } else {
                                  if (day?.Day === todayDate) {
                                    return (
                                      <>
                                        {thisStaffAttendance?.length > 0 &&
                                        thisStaffAttendance[0]?.currentStatus?.toLowerCase() !==
                                          "awaiting" ? (
                                          <>
                                            {thisStaffAttendance.map(
                                              (clockinTime) => {
                                                if (
                                                  clockinTime?.staffId ===
                                                  staffDetails?._id
                                                ) {
                                                  return clockinTime?.currentStatus?.toLowerCase() ===
                                                    "absent" ? null : (
                                                    <>
                                                      <button
                                                        style={{
                                                          border:
                                                            "1px solid #C4DEFF",
                                                          color:
                                                            moment(
                                                              moment(
                                                                day?.starttime,
                                                                "HH-mm a"
                                                              )
                                                            ).format(
                                                              "hh:mm A"
                                                            ) <
                                                            moment(
                                                              clockinTime?.checkInTime
                                                            ).format("HH:mm A")
                                                              ? "#E66666"
                                                              : "#4F7194",
                                                          background: "#F6FBFF",
                                                        }}
                                                      >
                                                        <div className="flex-alignment">
                                                          <div>
                                                            <img
                                                              src={
                                                                moment(
                                                                  moment(
                                                                    day?.starttime,
                                                                    "HH-mm a"
                                                                  )
                                                                ).format(
                                                                  "hh:mm A"
                                                                ) <
                                                                moment(
                                                                  clockinTime?.checkInTime
                                                                ).format(
                                                                  "HH:mm A"
                                                                )
                                                                  ? ClockinRed
                                                                  : back
                                                              }
                                                              alt="Clockin"
                                                            />{" "}
                                                          </div>
                                                          <div>
                                                            Clock in at{" "}
                                                            {moment(
                                                              clockinTime?.checkInTime
                                                            ).format("hh:mm A")}
                                                          </div>
                                                        </div>
                                                      </button>
                                                      {clockinTime?.checkOutTime ? (
                                                        <button
                                                          style={{
                                                            border:
                                                              "1px solid #C4DEFF",
                                                            color:
                                                              moment(
                                                                moment(
                                                                  day?.endtime,
                                                                  "hh-mm a"
                                                                )
                                                              ).format(
                                                                "hh:mm A"
                                                              ) >
                                                              moment(
                                                                clockinTime?.checkOutTime
                                                              ).format(
                                                                "hh:mm A"
                                                              )
                                                                ? "#E66666"
                                                                : "#4F7194",
                                                            background:
                                                              "#F6FBFF",
                                                          }}
                                                        >
                                                          <div className="flex-alignment">
                                                            <div>
                                                              <img
                                                                src={
                                                                  moment(
                                                                    moment(
                                                                      day?.endtime,
                                                                      "hh-mm a"
                                                                    )
                                                                  ).format(
                                                                    "hh:mm A"
                                                                  ) >
                                                                  moment(
                                                                    clockinTime?.checkOutTime
                                                                  ).format(
                                                                    "hh:mm A"
                                                                  )
                                                                    ? ClockoutRed
                                                                    : clock_out_status
                                                                }
                                                                alt="clock_out_status"
                                                              />{" "}
                                                            </div>

                                                            <div>
                                                              Clock out at{" "}
                                                              {moment(
                                                                clockinTime?.checkOutTime
                                                              ).format(
                                                                "hh:mm A"
                                                              )}
                                                            </div>
                                                          </div>
                                                        </button>
                                                      ) : (
                                                        <button
                                                          onClick={(e) =>
                                                            clockOutToggle(
                                                              staffDetails,
                                                              clockinTime,
                                                              "clockOut"
                                                            )
                                                          }
                                                        >
                                                          <div className="flex-alignment">
                                                            <div>
                                                              <img
                                                                src={clockout}
                                                                alt="Clockin"
                                                              />{" "}
                                                            </div>
                                                            <div>Clock out</div>
                                                          </div>
                                                        </button>
                                                      )}
                                                    </>
                                                  );
                                                }
                                              }
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {/* {userAttendenceData?.map((clockinTime)=>{ */}
                                            {/* return( */}
                                            <button
                                              onClick={(e) =>
                                                MarkOffdayToggle(
                                                  staffDetails,
                                                  "dayOff",
                                                  thisStaffAttendance[0]
                                                )
                                              }
                                            >
                                              Mark Off-day
                                            </button>
                                            {/* ) */}
                                            {/* })} */}
                                            <button
                                              onClick={(e) =>
                                                clockToggle(
                                                  staffDetails,
                                                  "clockIn",
                                                  thisStaffAttendance[0]
                                                )
                                              }
                                            >
                                              <div className="flex-alignment">
                                                <div>
                                                  <img
                                                    src={Clockin}
                                                    alt="Clockin"
                                                  />{" "}
                                                </div>
                                                <div>Clock in</div>
                                              </div>
                                            </button>
                                          </>
                                        )}
                                      </>
                                    );
                                  }
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {clockInModal && (
        <ClockInClockOut
          toggle={clockToggle}
          staffDetails={staffDetails}
          attendenceStatus={attendenceStatus}
          checkClockinTime={checkClockinTime}
          selectedDate={selectedDate}
          fromStaffRequestedData={fromStaffRequestedData}
          setFromStaffRequestedData={setFromStaffRequestedData}
          editData={editData}
          setEditData={setEditData}
          showDefault={showDefault}
          DefaultOpendata={DefaultOpendata}
        />
      )}
      {clockOutModal && (
        <Clockout
          toggleOut={clockOutToggle}
          staffDetails={staffDetails}
          attendenceStatus={attendenceStatus}
          checkClockinTime={checkClockinTime}
          userDataId={userDataId}
          selectedDate={selectedDate}
          fromStaffRequestedData={fromStaffRequestedData}
          setFromStaffRequestedData={setFromStaffRequestedData}
          editData={editData}
          setEditData={setEditData}
        />
      )}
      {allClockInModal && (
        <AllClockInClockOut
          toggle={allClockInToggle}
          staffData={staffData}
          checkClockinTime={checkClockinTime}
          userAttendenceData={userAttendenceData}
          selectedDate={selectedDate}
          attendenceStatus={attendenceStatus}
          setAttendenceStatus={setAttendenceStatus}
        />
      )}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
    </>
  );
}

export default AttendanceModal;
