import moment from "moment";
import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import CalendarIcon from "../../../assets/svg/calendar_blue.svg";
import coinIcon from "../../../assets/svg/coin.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";

export default function PayTab(props) {
  const { staffPayTotal, staffPay, SettingInfo, staffDetails, getAllPay,startDate,endDate ,setEndDate,setStartDate} = props;
  const userInfo = Auth.getUserDetail();
  const [startDates, setStartDates] = useState(endDate);
  const [totalCommission, setTotalCommission] = useState({});

  const getTransactions = async (e) => {
    let payload = {
      startTime: moment(startDates).startOf("month").format("YYYY-MM-DD"),
      endTime: moment(startDates).endOf("month").format("YYYY-MM-DD"),
    };
    let res = await ApiPost("staff/company/commision/" + userInfo.companyId, payload);
    try {
      if (res.data.status === 200) {
        let filter = res.data.data?.staffCommision?.filter((item) => item.staffId.toString() === staffDetails?._id);

        setTotalCommission(filter[0]);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  useEffect(() => {
    getTransactions();
    getAllPay(staffDetails);
  }, [startDates,staffDetails]);

  
  // const handleOnChange = (dates) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  // };
  return (
    <div className="personal-date-grid-items">
      <div className="personal-commision-data-heading">
        <div className="commission-data-heading-text-style">Staff pay</div>
        <div className="Transactions-content-alignment-month">
          <button>
            <img src={CalendarIcon} alt="CalendarIcon" className="imgwidth" />
            <span className="date-picker-style">
              <ReactDatePicker
                selected={startDates}
                onChange={(date) => {
                  setStartDates(date);
                  setEndDate(moment(date).add(30, "days")._d);
                  setStartDate(date)
                 
                }}
                dateFormat="MMM yyyy"
                showMonthYearPicker
              />
            </span>
          </button>
        </div>{" "}
      </div>
      <div className="all-type-chart-two-col-grid-staff">
        <div className="all-type-chart-two-col-grid-items">
          <div className="type-grid">
            <div className="type-grid-items blue-opacity-background">
              <span>
                <a>₹</a>
              </span>
            </div>
            <div className="type-grid-items">
              <div>
                <p>Staff pay</p>
                <h6>
                  <a>{SettingInfo?.currentType}</a> {staffPayTotal}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="all-type-chart-two-col-grid-items">
          <div className="type-grid">
            <div className="type-grid-items  blue-opacity-background ">
              <img src={coinIcon} alt="coin" />
            </div>
            <div className="type-grid-items">
              <div>
                <p>Commission</p>
                <h6>
                  <a>{SettingInfo?.currentType}</a> {parseInt(totalCommission?.productCommison) + parseInt(totalCommission?.serviceCommison) || 0}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="personal-commision-data-heading">
        <div className="commission-data-heading-text-style">History</div>
      </div>
      <div className="personal-transition-table">
        <table className="personal-data-table">
          <tr>
            <th align="left">Date</th>
            <th align="left">Time</th>
            <th align="left">Payment method</th>
            <th align="right">Amount</th>
          </tr>

          {staffPay?.length > 0 ? (
            staffPay?.map((staff) => {
              return (
                <tr>
                  <td>{moment(staff?.created).format("DD-MMM-YYYY")}</td>
                  <td> {moment(staff?.created).format("hh:mm A")}</td>
                  <td>{staff?.paymentMethod}</td>
                  <td align="right">
                    <span
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      {SettingInfo?.currentType}
                    </span>{" "}
                    {staff?.amount}
                  </td>
                </tr>
              );
            })
          ) : (
        null 
          )}
        </table>
        { !staffPay?.length > 0 && <div className="system-does-not ">
              <p className="text-center">No transactions</p>
            </div>}
      </div>
    </div>
  );
}
