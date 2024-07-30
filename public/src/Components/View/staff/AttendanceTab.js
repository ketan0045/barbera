import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import CalendarIcon from "../../../assets/svg/calendar_blue.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import moment from "moment";

function AttendanceTab(props) {
  const { staffDetails, SettingInfo } = props;
  const [startDate, setStartDate] = useState(new Date());
  const userInfo = Auth.getUserDetail();
  const [attendanceData, setAttendanceData] = useState();


  // console.log(
  //   "staffDetails working day",
  //   staffDetails?.workingDays?.find((day) => day?.Day === moment(new Date()).format("dddd"))?.dayOff
  // );
 

  //get all attendence
  // const getAttendence = async (e) => {
  //   let payload = {
  //     startTime: moment(startDate).startOf("month").format("YYYY-MM-DD"),
  //     endTime: moment(startDate).endOf("month").format("YYYY-MM-DD"),
  //   };
  //   let res = await ApiPost(
  //     "attendence/user/company/" + userInfo.companyId,
  //     payload
  //     );
  //     try {
  //       if (res.data.status === 200) {
  //         let filter = res.data.data?.staffCommision?.filter(
  //           (item) => item.staffId.toString() === staffDetails?._id
  //           );
  //       if (filter.length > 0) {
  //         // setCommission(filter[0]?.staffObject?.commission[0]);
  //       } else {
  //         // setCommission(staffDetails.commission[0]);
  //       }
  //       // setTotalCommission(filter[0]);
  //     } else {
  //       console.log("in the else");
  //     }
  //   } catch (err) {
  //     console.log("in the catch");
  //   }
  // };

  // useEffect(() => {
  //   getAttendence();
  // }, [startDate, staffDetails]);
  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };
  const getAttendenceByData = async (selectedStartDate) => {
    let date = new Date();
    let data = selectedStartDate
      ? {
          startTime: moment(selectedStartDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endTime: moment(selectedStartDate)
            .add(1, "month")
            .startOf("month")
            .format("YYYY-MM-DD"),
        }
      : {
          startTime: moment(date).startOf("month").format("YYYY-MM-DD"),
          endTime: moment(date).add(1, "days").format("YYYY-MM-DD"),
        };

    await ApiPost(`attendence/user/company/${staffDetails?._id}`, data)
      .then((res) => {
        let tempData = res.data.data;
        let tempSortedData = tempData?.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
       
        let tempFilterData = tempSortedData?.map((data) => {
          return { ...data, date: moment(data.date).format("DD-MM-YYYY") };
        });
        let tempAttendanceData = removeDuplicateObjectFromArray(
          tempFilterData,
          "date"
        );

        let finalData = res.data.data?.filter(
          (data) => !!tempAttendanceData?.find((item) => item._id === data._id)
        );
        let sortedFinalData = finalData?.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setAttendanceData(sortedFinalData);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const convertMinsToHrsMins = (minutes) => {
    var h = Math.floor(minutes / 60);
    var m = Math.floor(minutes % 60);
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    return h + ":" + m;
  };

  useEffect(() => {
    getAttendenceByData();
  }, [staffDetails]);

  return (
    <div className="personal-date-grid-items">
      <div className="personal-commision-data-heading">
        <div className="commission-data-heading-text-style">Attendance</div>

        <div className="Transactions-content-alignment-month">
          <button>
            <img src={CalendarIcon} alt="CalendarIcon" className="imgwidth" />
            <span className="date-picker-style">
              <ReactDatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  getAttendenceByData(date);
                }}
                dateFormat="MMM yyyy"
                showMonthYearPicker
              />
            </span>
          </button>
        </div>
      </div>
      <div className="attendance-table-style">
        <table>
          <tr>
            <th align="left">Date</th>
            <th align="center">Status</th>
            <th align="center">Clock in</th>
            <th align="center">Clock out</th>
            <th align="right">Total hours</th>
          </tr>
          {attendanceData?.map((item) => {
            let thisDayStartTime = staffDetails?.workingDays?.find(
              (day) => day?.Day === moment(item?.date).format("dddd")
            ).starttime;
            let thisDayEndTime = staffDetails?.workingDays?.find(
              (day) => day?.Day === moment(item?.date).format("dddd")
            ).endtime;
            let thisDayTimeDifference = convertMinsToHrsMins(
              (moment(thisDayEndTime, "hh:mm") -
                moment(thisDayStartTime, "hh:mm")) /
                60000
            );

            return item?.status?.toLowerCase() === "awaiting" ? null : (
              <tr>
                <td align="left">
                  <span>{moment(item?.date).format("DD-MM-YYYY")}</span>
                </td>
                <td align="center">
                  <button
                    className={
                      item?.status
                        ? item?.status?.toLowerCase() === "absent"
                          ? "absent-button-style"
                          : item?.status?.toLowerCase() === "present" ?
                            "present-button-style"
                        : "day-off-button-style":
                        ""
                    }
                  >
                    {!item?.status
                      ? staffDetails?.workingDays?.find(
                          (day) =>
                            day?.Day === moment(item?.date).format("dddd")
                        )?.dayOff
                        ? "Off-day"
                        : "Absent"
                      : item?.status}
                  </button>
                </td>
                <td align="center">
                  <span
                    style={{
                      color:
                        moment(item?.checkInTime).format("HH:mm") <
                        moment(moment(thisDayStartTime, "hh-mm")).format(
                          "HH:mm"
                        )
                          ? "#338333" // green
                          : moment(item?.checkInTime).format("HH:mm") >
                            moment(moment(thisDayStartTime, "hh-mm")).format(
                              "HH:mm"
                            )
                          ? "#E66666" // red
                          : "#193566",
                    }}
                  >
                    {item?.checkInTime
                      ? moment(item?.checkInTime).format("HH:mm")
                      : "-"}
                  </span>
                </td>
                <td align="center">
                  <span
                    style={{
                      color:
                        moment(item?.checkOutTime).format("HH:mm") <
                        moment(moment(thisDayEndTime, "hh-mm")).format("HH:mm")
                          ? "#E66666" // red
                          : moment(item?.checkOutTime).format("HH:mm") >
                            moment(moment(thisDayEndTime, "hh-mm")).format(
                              "HH:mm"
                            )
                          ? "#338333" // green
                          : "#193566",
                    }}
                  >
                    {item?.checkOutTime
                      ? moment(item?.checkOutTime).format("HH:mm")
                      : "-"}
                  </span>
                </td>
                <td align="right">
                  <span
                    style={{
                      color:
                        !item?.differnce ||
                        convertMinsToHrsMins(item?.differnce) <
                          thisDayTimeDifference
                          ? "#E66666" // red
                          : convertMinsToHrsMins(item?.differnce) >
                            thisDayTimeDifference
                          ? "#338333" // green
                          : "#193566",
                    }}
                  >
                    {!item?.differnce
                      ? staffDetails?.workingDays?.find(
                          (day) =>
                            day?.Day === moment(item?.date).format("dddd")
                        )?.dayOff
                        ? "-"
                        : "-"
                      : `${convertMinsToHrsMins(item?.differnce)} hrs`}
                  </span>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default AttendanceTab;
