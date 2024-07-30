import React,{useState} from "react";
import "./AttendanceRequest.scss";
import request from "../../../assets/svg/request.svg";
import requestAttend from "../../../assets/svg/pana.svg";
import ClockInClockOut from "./Attendance/ClockInClockOut";
import moment from "moment";
import { ApiPost } from "../../../helpers/API/ApiData";

export default function AttendanceRequest(props) {
  const {staffRequestedData,requestedStaffDetails,setOpenRequestModal,setOpenAttendanceModal,toggle,attendanceMark,setAttendaceMark}=props
  const [clockInModal, setClockInModal] = useState(false);
  const [fromStaffRequestedData, setFromStaffRequestedData] = useState(staffRequestedData[0]);
  const [editData, setEditData] = useState({});
  const OpenClockinmodal=(data, status, attendance, response, category)=>{
    if(staffRequestedData?.length > 1 ){
      staffRequestedData?.map(async(stafff,i)=>{
        let data = {
            ...stafff,
          skip :true
        };
        await ApiPost("attendence/user/company/multipleUpdate/data", data)
          .then((res) => {
            if(i == (staffRequestedData?.length -1)){
              setOpenRequestModal(false)
              setOpenAttendanceModal(true)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
  
    }else{
      toggle()
    // setClockInModal(!clockInModal)
    if(response === 200){
 
      // setOpenRequestModal(false)
    }
  }
  }

const DenyRequestHandler=()=>{
  staffRequestedData?.map(async(stafff,i)=>{
    let data = {
      status: "Awaiting",
      currentStatus: "Awaiting",
      clockinTime: "",
      date: moment(new Date()).format(),
      _id: stafff?._id,
      activeStatus: false,
      skip:false
    };
    await ApiPost("attendence/user/company/multipleUpdate/data", data)
      .then((res) => {
        if(i == (staffRequestedData?.length -1)){
          setOpenRequestModal(false)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })

}

const SkipforNowHandler=()=>{
  if(attendanceMark){
    setOpenRequestModal(false)
    setAttendaceMark(false)
  }else{
  staffRequestedData?.map(async(stafff,i)=>{
    let data = {
        ...stafff,
      skip :true
    };
    await ApiPost("attendence/user/company/multipleUpdate/data", data)
      .then((res) => {
        if(i == (staffRequestedData?.length -1)){
          setOpenRequestModal(false)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
}
}


  return (
    <>
      <div className="modal-bluer-outer">
        <div className="modal-box">
          <div className="modal-content-body">
            <div className="skipcontent">
            <small className="text-right" onClick={()=>SkipforNowHandler()}>Skip for now</small>
            <h5 className="text-center">{attendanceMark ? "Its attendance time!":"Request Pending"}</h5>
            </div>
            <div className="imageWrapper">
              <img src={attendanceMark ? requestAttend :request} />
            </div>
            <div className="blockContent">
              {attendanceMark ? <p>Salon hours is up, start your day by taking attendance</p> :staffRequestedData?.length > 1 ? 
              <p>Multiple staff has sent a request to clock in</p>: 
              <p>{requestedStaffDetails[0]?.firstName + " " + requestedStaffDetails[0]?.lastName} has sent a request to clock in</p>}
            </div>
            {attendanceMark ?
            <div className="buttonMarkWrapper"> <button className="approveMarkBtn" onClick={()=>  toggle(true)}>Mark staff attendance</button></div>:
            <div className="buttonWrapper">
              <button className="denyBtn" onClick={()=>DenyRequestHandler()}>Deny Request</button>
              <button className="approveBtn" onClick={()=>OpenClockinmodal()}>Approve clock in</button>
            </div>}
          </div>
        </div>
      </div>
      {clockInModal && (
        <ClockInClockOut
          toggle={OpenClockinmodal}
          staffDetails={requestedStaffDetails[0]}
          attendenceStatus={"clockIn"}
          // checkClockinTime={checkClockinTime}
          selectedDate={new Date()}
          fromStaffRequestedData={fromStaffRequestedData}
          setFromStaffRequestedData={setFromStaffRequestedData}
          editData={editData}
          setEditData={setEditData}
        />
      )}
    </>
  );
}
