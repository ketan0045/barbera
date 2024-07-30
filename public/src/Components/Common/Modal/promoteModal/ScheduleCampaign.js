import React, { useState, useEffect } from "react";
import "./promotemodal.scss";
import RightIcon from "../../../../assets/svg/group-right.svg";
import LightDownIcon from "../../../../assets/svg/light-down.svg";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setVisuals } from "../../../../redux/actions/promoteActions";
import CalenderIcon from "../../../../assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
// import { addDays } from "date-fns";
import { ApiGet, ApiPost } from "../../../../helpers/API/ApiData";
export default function ScheduleCampaign() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState();
  const [timeError, setTimeError] = useState(false);
  const [tinyUrl, setTinyURL] = useState("");
  const [times, setTimes] = useState(moment(new Date()).add(5, "minute").format("hh:mm A"));
  const [duration, setDuration] = useState(
    moment(new Date()).add(5,"minutes")._d
    // setHours(setMinutes(new Date(), 0), 9)
  );

  const [createdDate, setCreatedDate] = useState(new Date());
  const SelectFullDate = (data) => {
    setCreatedDate(data);
    // var finalScheduleDate = moment(createdDate).format("D MMM YY");
    // localStorage.setItem("campaignSchedule", finalScheduleDate);
    // localStorage.setItem("campaignTime", times);
  };
  const selectedMethod = useSelector((state) => state.selectedMethodReducer);
  const selectedOffer = useSelector((state) => state.selectedOfferReducer);
  let finalScheduleDate = moment(createdDate).format("D MMM YY");
  localStorage.setItem("campaignSchedule", finalScheduleDate);
  localStorage.setItem("campaignTime", times);
  console.log("13579", finalScheduleDate, times);
  

  const filterPassedTime = (time) => {
    const currentDate = new Date(time);
    const selectedDate = createdDate;
    if (selectedDate.getDate() === new Date().getDate()) {
      return currentDate.getTime() > selectedDate.getTime();
    }
    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    makingUrlTiny();
  }, []);

  const makingUrlTiny = async () => {
    let body = {
      link:
        localStorage.getItem("InstagramLink") ||
        localStorage.getItem("WebLink") ||
        localStorage.getItem("BookingLink"),
    };
    await ApiPost("campaign/company/tinyURl", body)
      .then((res) => {
        console.log("tester619", res?.data?.data);
        setTinyURL(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log("tester621", Link);
  localStorage.setItem("tinyUrlis", tinyUrl);
  console.log("testerSchdule", tinyUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="generate-box-center"
    >
      <div className="generate-box-center">
        <div className="campaign-child-box">
          <div className="campaign-child-header">
            <h1>Schedule campaign </h1>
            {selectedMethod === "Festival offers" && (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(7))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            )}
            {selectedMethod === "General offer" && (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(7))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            )}
            {selectedMethod === "Festival greetings" && (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(3))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            )}
            {selectedMethod === "Special days" && (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(3))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            )}
            {selectedOffer === "Promotions" && (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(2))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            )}
            {selectedOffer === "Services" && (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(2))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            )}
          </div>
          <div className="schedule-campaign-body-alignment">
            <div className="schedule-campaign-input">
              <label>Select date </label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={createdDate}
                  value={moment(new Date())}
                  onChange={(e) => SelectFullDate(e)}
                  // dateFormat="dd-MM-yyyy"
                  minDate={new Date()}
                  // minDate={moment(new Date()).add(5, "minutes")}
                  showDisabledMonthNavigation
                  // maxDate={(new Date(), 5)}
                  // maxDate={addDays(new Date(), 365)}
                  placeholderText="Date"
                  fixedHeight
                  dateFormat="d MMM yy"
                  autoFocus
                />
                <img
                  className="date-icon"
                  src={CalenderIcon}
                  alt="calenderIcon"
                />
              </div>
            </div>
            <div className="schedule-campaign-input">
              <label>Select time</label>
              <div className="input-relative">
                <DatePicker
                  selected={duration}
                  onChange={(date) => {
                    setDuration(date);
                    setTimes(moment(date).format("HH:mm A"));
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  filterTime={filterPassedTime}
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="hh:mm aa"
                />
                <div className="icon-alignment">
                  <img src={LightDownIcon} alt="LightDownIcon" />
                </div>
                {timeError && (
                  <h6 className="error-message">
                    Select Current or Future Time
                  </h6>
                )}
              </div>
            </div>
            <div className="child-text-alignment">
              <p>
                Messages will be auto sent to selected customers on the
                scheduled date and time
              </p>
            </div>
          </div>

          {finalScheduleDate && times && !timeError || selectedMethod === "ReCreate" ? (
            <div
              className="discount-value-continue-active-box-footer"
              onClick={() => dispatch(setVisuals(9))}
            >
              <button>Continue</button>
            </div>
          ) : (
            <div className="discount-value-continue-box-footer">
              <button>Continue</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
