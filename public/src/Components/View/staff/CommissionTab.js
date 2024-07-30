import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import CalendarIcon from "../../../assets/svg/calendar_blue.svg";
import ProvidedServices from "../../../assets/svg/Scissor.svg";
import BoxIcon from "../../../assets/img/box-icon.png";
import Auth from "../../../helpers/Auth";
import moment from "moment";
import { ApiPost } from "../../../helpers/API/ApiData";

function CommissionTab(props) {
  const { staffDetails, SettingInfo } = props;
  const userInfo = Auth.getUserDetail();

  const [startDate, setStartDate] = useState(new Date());
  const [commission, setCommission] = useState({});
  const [totalCommission, setTotalCommission] = useState({});

  
  //get commission transactions
  const getTransactions = async (e) => {
    let payload = {
      startTime: moment(startDate).startOf("month").format("YYYY-MM-DD"),
      endTime: moment(startDate).endOf("month").format("YYYY-MM-DD"),
    };
    let res = await ApiPost(
      "staff/company/commision/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        let filter = res.data.data?.staffCommision?.filter(
          (item) => item.staffId.toString() === staffDetails?._id
        );
        if (filter[0]?.staffObject) {
          setCommission(filter[0]?.staffObject?.commission[0]);
        } else {
          setCommission(staffDetails.commission[0]);
        }
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
  }, [startDate, staffDetails]);

  return (
    <div className="personal-date-grid-items">
      <div className="personal-commision-data-heading">
        <div className="commission-data-heading-text-style">Commissions</div>

        <div className="Transactions-content-alignment-month">
          <button>
            <img src={CalendarIcon} alt="CalendarIcon" className="imgwidth" />
            <span className="date-picker-style">
              <ReactDatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMM yyyy"
                showMonthYearPicker
              />
            </span>
          </button>
        </div>
      </div>
      <div className="commission-border-box-style">
        <div className="header-grid">
          <div className="header-grid-items">
            <span>Commissions info</span>
          </div>
          <div className="header-grid-items">
            <span>Cycle: Every month</span>
          </div>
        </div>
        <div className="body-grid">
          <div className="body-grid-items">
            <p>Service commission</p>
            <span>
              <>
                {commission?.commission_type?.value}{" "}commission{" "}
                {commission?.commission_type?.targetValue ? `on ${commission?.commission_type?.targetValue}` : ""}{" "}<br />
                {commission?.commission_type?.targetRange?.map(
                  (item) => {
                    return (
                      <>
                        from
                        <a>{" "}{SettingInfo?.currentType}{" "}</a>
                        {item.from}{" "}
                        {item.to !== "" &&
                          item.to !== "0" ? (
                          <>
                            to
                            <a>
                              {" "}{SettingInfo?.currentType}{" "}
                            </a>
                          </>
                        ) : (
                          "and"
                        )} {" "}
                        {item.to === "" || item.to === "0"
                          ? "above"
                          : item.to}{" "}
                        - {item.commission}% {" "} <br />
                      </>
                    );
                  }
                )}
              </>
            </span>
          </div>
          <div className="body-grid-items">
            <p>Product commission</p>
            <span>
              {commission?.product_type
                ?.value === "All products"
                ? "All products added"
                : `${(
                  commission
                    ?.product_type?.commission
                    ?.length) ||
                0
                } products added`}
            </span>
          </div>
        </div>
      </div>
      <div className="commiision-box-new-grid">
        <div className="commiision-box-new-grid-items">
          <div className="sub-grid">
            <div className="sub-grid-items">
              <div className="icon-box-design green-opacity-background-color">
                <img src={ProvidedServices} alt="ProvidedServices" />
              </div>
            </div>
            <div className="sub-grid-items">
              <span>Service commission</span>
              <h2>
                <a>{SettingInfo?.currentType}</a>{" "}
                {totalCommission?.serviceCommison?.toFixed(2) || (0).toFixed(2)}*
              </h2>
            </div>
          </div>
        </div>
        <div className="commiision-box-new-grid-items">
          <div className="sub-grid">
            <div className="sub-grid-items">
              <div className="icon-box-design green-opacity-background-color">
                <img src={BoxIcon} alt="BoxIcon" />
              </div>
            </div>
            <div className="sub-grid-items">
              <span>Product commission</span>
              <h2>
                <a>{SettingInfo?.currentType}</a>{" "}
                {totalCommission?.productCommison?.toFixed(2) || (0).toFixed(2)}*
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommissionTab;
