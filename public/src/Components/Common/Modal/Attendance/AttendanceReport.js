import React, { useEffect, useState } from "react";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import CalendarIcon from "../../../../assets/img/Calendar-new.svg";
import UserCheckIcon from "../../../../assets/img/user-check.svg";
import UserMinusIcon from "../../../../assets/img/user-minus.svg";
import LeavesIcon from "../../../../assets/img/leaves-icon.svg";
import moment from "moment";
import "./AttendanceModal.scss";
import { ApiPost } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import ReactDatePicker from "react-datepicker";

function AttendanceReport(props) {
  const { toggle } = props;
  const [startDate, setStartDate] = useState(new Date());
  const userInfo = Auth.getUserDetail();
  const [userAttendenceData, setuserAttendenceData] = useState();

  const checkClockinTime = async () => {
    let data = {
      startTime: moment(startDate).startOf("month").format("YYYY-MM-DD"),
      endTime: moment(startDate)
        .endOf("month")
        .add(1, "day")
        .format("YYYY-MM-DD"),
    };
    await ApiPost("attendence/company/alldata/" + userInfo.companyId, data)
      .then((res) => {
        setuserAttendenceData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkClockinTime();
  }, [startDate]);

  const convertMinsToHrsMins = (minutes) => {
    var h = Math.floor(minutes / 60);
    var m = Math.floor(minutes % 60);
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    return h + ":" + m;
  };

  return (
    <div>
      <div className="cus-commmission-modal">
        <div className="commission-modal-header">
          <div className="container-long">
            <div className="commission-modal-header-alignment">
              <div className="commission-custom-modal-heading-title">
                <div className="modal-close" onClick={toggle}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Attendance report</h2>
                </div>
              </div>
              <div className="right-side-content-alignment-full-modal">
                <p>
                  Total{" "}
                  {userAttendenceData && userAttendenceData?.length > 0
                    ? userAttendenceData[0]?.daysInMonth
                    : new Date(
                        startDate.getFullYear(),
                        startDate.getMonth() + 1,
                        0
                      ).getDate()}{" "}
                  salon working days in {moment(startDate).format("MMM 'YY")}
                </p>
                <button>
                  <img
                    src={CalendarIcon}
                    alt="CalendarIcon"
                    style={{ padding: "10px" }}
                  />
                  <div className="custom-date-picker">
                    <span className="date-picker-style">
                      <div className="date-style">
                        <ReactDatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MMM yyyy"
                          showMonthYearPicker
                        />
                      </div>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="attendance-report-modal-body-alignment">
          <div className="container">
            <div className="attendance-report-center-alignment">
              <div className="attendance-report">
                {userAttendenceData?.length > 0 ? (
                  userAttendenceData?.map((item) => {
                    return (
                      <div className="attendance-report-box">
                        <div className="attendance-report-box-title">
                          <h2>{item?.staffName}</h2>
                        </div>
                        <div className="grid">
                          <div className="grid-items">
                            <div className="working-hours-alignment">
                              <p>Avg working hours</p>
                              <p>Total Overtime</p>
                            </div>
                            <div className="time-text-all-alignment">
                              <p>
                                {convertMinsToHrsMins(item?.avgWorkingHours)}{" "}
                                hrs
                              </p>
                              <p>
                                {convertMinsToHrsMins(item?.totalOvertime)} hrs
                              </p>
                            </div>
                            <div className="working-hours-alignment">
                              <p style={{ opacity: "0" }}>
                                Expected avg working hours
                              </p>
                              <p>Total Short time</p>
                            </div>
                            <div
                              className="time-text-all-alignment"
                              style={{ padding: "0" }}
                            >
                              <p style={{ opacity: "0" }}>
                                {convertMinsToHrsMins(
                                  item?.expextedWorkingHours
                                )}{" "}
                                hrs
                              </p>
                              <p style={{ color: "#E66666" }}>
                                {convertMinsToHrsMins(item?.totalMinustime)} hrs
                              </p>
                            </div>
                            {/* <div className="children-text-style">
                                            <p>Expected avg working hours</p>
                                            <h5>8:00 hrs</h5>
                                        </div> */}
                          </div>
                          <div className="grid-items">
                            <div className="all-icon-text-alignment">
                              <div className="icon-text-style">
                                <div className="green-background-color-style">
                                  <img
                                    src={UserCheckIcon}
                                    alt="UserCheckIcon"
                                  />
                                </div>
                                <div>
                                  <p>{item?.present} presents</p>
                                </div>
                              </div>
                              <div className="icon-text-style">
                                <div className="leaves-background-color-style">
                                  <img src={LeavesIcon} alt="LeavesIcon" />
                                </div>
                                <div>
                                  <p>{item?.leaves} leaves</p>
                                </div>
                              </div>
                              <div className="icon-text-style">
                                <div className="user-minus-color-style">
                                  <img
                                    src={UserMinusIcon}
                                    alt="UserMinusIcon"
                                  />
                                </div>
                                <div>
                                  <p>{item?.dayOff} off days</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      fontWeight: "500",
                      fontSize: "24px",
                      lineHeight: "18px",
                      margin: "30%",
                      color: "#4F7194",
                    }}
                  >
                    <span>No data found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;
