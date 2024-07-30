import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";

import DropDownIcon from "../../../assets/svg/drop-down.svg";
import moment from "moment";
import Success from "../Toaster/Success/Success";

export default function EditServiceModals(props) {
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const {
    modal,
    toggle,
    editServiceData,
    RemoveService,
    editAppointment,
    service,
    SettingInfo
  } = props;
  const [selectedStaff, setSelectedStaff] = useState(
    editServiceData.staff ? editServiceData.staff : "Unassign"
  );
  const [staffId, setStaffId] = useState(editServiceData.staffId);
  const [allStaff, setAllStaff] = useState();
  const [notes, setNotes] = useState();
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });
  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };
  useEffect(async () => {
    let dayInNumber = moment(editServiceData?.date).day();
    let day;
    if (dayInNumber === 1) {
      day = "Monday";
    } else if (dayInNumber === 2) {
      day = "Tuesday";
    } else if (dayInNumber === 3) {
      day = "Wednesday";
    } else if (dayInNumber === 4) {
      day = "Thursday";
    } else if (dayInNumber === 5) {
      day = "Friday";
    } else if (dayInNumber === 6) {
      day = "Saturday";
    } else if (dayInNumber === 0) {
      day = "Sunday";
    }

    if (service) {
      let datePayload = {
        startTime: moment(editServiceData?.date).format("YYYY-MM-DD"),
        endTime: moment(editServiceData?.date).add(1, "days").format("YYYY-MM-DD"),
      }
      let attendanceRes =  await ApiPost("attendence/company/" + userInfo.companyId, datePayload)
      let tempData = attendanceRes.data.data?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      let tempAttendanceData = removeDuplicateObjectFromArray(tempData, "staffId");
      let thisDayAttendanceData = tempAttendanceData || [];
      try {
        // let res = await ApiGet("category/" +  editServiceData?.serviceId?.categoryId);
        let res = await ApiGet(
          "category/staff/data/day/" +
            editServiceData?.serviceId?.categoryId +
            "/" +
            day
        );
        if (res.data.status === 200) {
          let availableStaff
          if(moment(editServiceData?.date).format("DD-MM-YYYY") <= moment(new Date()).format("DD-MM-YYYY")&&  
          SettingInfo?.attendence?.attendanceToggle &&
          SettingInfo?.attendence?.attendanceForInvoiceToggle){
            availableStaff = res.data.data?.filter((item) => thisDayAttendanceData?.find((data)=>data?.staffId === item?._id)?.currentStatus === "clockIn");
          }else{
            availableStaff = res.data.data
          }
          
        
          setAllStaff(availableStaff);
        } else {
          setStaffId("");
        }
      } catch (err) {
        console.log("in the catch");
      }
    } else {
      try {
        let res = await ApiGet(
          "category/" + editServiceData?.serviceId?.categoryId
        );
        // let res = await ApiGet("category/staff/data/day/" +  editServiceData?.serviceId?.categoryId + "/" + day);
        if (res.data.status === 200) {
          setAllStaff(res.data.data[0]?.staff);
        } else {
          setStaffId("");
        }
      } catch (err) {
        console.log("in the catch");
      }
    }
  }, []);

  const EditedSeviceData = {
    companyId: editServiceData.companyId,
    date: editServiceData.date,
    default: editServiceData.default,
    isPromotional: editServiceData.isPromotional,
    mobile: editServiceData.mobile,
    name: editServiceData.name,
    serviceId: editServiceData.serviceId,
    staff: selectedStaff,
    staffId: staffId,
    status: editServiceData.status,
    time: editServiceData.time,
    type: editServiceData.type,
    uuid: editServiceData.uuid,
    note: notes,
    _id: editServiceData._id,
  };
  const SetSaveChange = () => {
    toggle(EditedSeviceData);
  };
  const SelectNewStaff = async (e, data) => {
    let res = await ApiGet(
      "appointment/staff/" + userInfo.companyId + "/" + data._id
    );
    if (res.data.status === 200) {
      let add = true;
      let today = new Date();
      let futAppointments = res.data.data?.appointmentList?.filter(
        (apt) => new Date(apt?.date) >= today
      );

      futAppointments &&
        futAppointments.map((apt) => {
          let endDate = moment(apt.date).add(apt.serviceId.duration, "minutes");
          endDate = moment(endDate).toISOString();
          let newDate = moment(editServiceData.date).add(
            editServiceData.time
          )._d;
          newDate = moment(newDate).toISOString();
          if (newDate >= apt.date && newDate < endDate) {
            add = false;
            setSuccess(true);
            setEr("error");
            setToastmsg(
              "Booked for" + " " + data.firstName + " " + data.lastName
            );
          }
        });
      if (add) {
        setSelectedStaff(data.firstName + " " + data.lastName);
        setStaffId(data);
        setSubMenuopen(!subMenuOpen);
      }
    }
  };
  // useEffect(async()=>{
  //     let isDayAvail = moment(editServiceData.date).format("dddd");
  //     try {
  //     let res = await ApiGet(
  //         "staff/available/company/" + userInfo.companyId + "/" + isDayAvail
  //     );
  //     if (res.data.status === 200) {
  //         setAllStaff(res.data.data);
  //     } else {
  //         console.log("in the else");
  //     }
  //     } catch (err) {
  //     console.log("error while getting services", err);
  //     }

  // },[])

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Edit Service</h4>
              <div className="close-button" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="sub-modal-body">
            <div className="edit-service-time-text-stlye">
              <p>
                {" "}
                {moment.utc(editServiceData?.date).format("hh:mm A")} -{" "}
                {moment
                  .utc(editServiceData?.date)
                  .add(editServiceData?.time, "minutes")
                  .format("hh:mm A")}
              </p>
            </div>
            <div className="edit-service-modal-grid">
              <div className="edit-service-modal-grid-items">
                <div className="edit-service-sub-grid">
                  <div className="edit-service-sub-grid-items">
                    <div
                      className="line-color-dynamic"
                      style={{
                        backgroundColor: editServiceData?.serviceId?.colour
                          ? editServiceData?.serviceId?.colour
                          : "#D1FFF4",
                        borderRadius: "5px",
                        height: "100%",
                      }}
                    ></div>
                  </div>
                  <div className="edit-service-sub-grid-items">
                    <p>
                      {editServiceData?.serviceId?.serviceName
                        ? editServiceData?.serviceId?.serviceName
                        : "Slot"}
                    </p>
                    <span>by {selectedStaff}</span>
                  </div>
                </div>
              </div>
              <div className="edit-service-modal-grid-items">
                {editServiceData?.serviceId?.amount ? (
                  <h6>
                    <span>{SettingInfo?.currentType}</span> {editServiceData?.serviceId?.amount}
                  </h6>
                ) : null}
              </div>
            </div>
            <div className="option-select-group edit-service-modal-bottom-align">
              <label>Staff</label>
              <div className="relative">
                <div
                  className="input-relative"
                  onClick={() => setSubMenuopen(!subMenuOpen)}
                >
                  <input disabled type="text" value={selectedStaff} />
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
                    <ul>
                      {allStaff?.map((staff) => {
                        return (
                          <li
                            key={staff._id}
                            onClick={(e) => SelectNewStaff(e, staff)}
                          >
                            {staff?.firstName + " " + staff?.lastName}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Additional notes</label>
              <textarea
                id="w3review"
                value={notes}
                name="w3review"
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="edit-service-modal-button-design">
            <div className="remove-service-button">
              {editAppointment ? null : (
                <button
                  className="remov-button-style"
                  onClick={() => RemoveService(editServiceData)}
                >
                  Remove
                </button>
              )}{" "}
            </div>
            <div className="cancel-change-button">
              <button className="cancel-button-style" onClick={() => toggle()}>
                Cancel
              </button>
              <button className="save-button" onClick={() => SetSaveChange()}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {success ? <Success modal={success} toastmsg={toastmsg} er={er} /> : null}
    </>
  );
}
