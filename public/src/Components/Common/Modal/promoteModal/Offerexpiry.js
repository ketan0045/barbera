import React, { useEffect, useState } from "react";
import "./promotemodal.scss";
import RightIcon from "../../../../assets/svg/group-right.svg";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setVisuals } from "../../../../redux/actions/promoteActions";
import CalenderIcon from "../../../../assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
export default function Offerexpiry(props) {
  const { campaignedData, setOfferExpiryArrow, offerExpiryArrow } = props;
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const dispatch = useDispatch();
  const [createdDate, setCreatedDate] = useState();
  const selectedServiceis = useSelector(
    (state) => state.selectedMainServiceReducer
  ).toLowerCase();
  const discounted = useSelector((state) => state.selectedDiscountReducer);
  const selectedFestival = useSelector(
    (state) => state.selectedFestivalReducer
  );
  const selectedMethod = useSelector((state) => state.selectedMethodReducer);
  const SelectFullDate = (data) => {
    setCreatedDate(data);
    let finalExpiry = moment(data).format("D MMM YY");
    localStorage.setItem("expiry", finalExpiry);
  };

  useEffect(() => {
    console.log("localStorage.getItem", localStorage.getItem("expiry"));
    if (localStorage.getItem("expiry")) {
      console.log("Inside expiry");
      setCreatedDate(moment(localStorage.getItem("expiry"), "DD MMM YY")._d);
      let finalExpirys = moment(
        moment(localStorage.getItem("expiry"), "DD MMM YY")._d
      ).format("D MMM YY");
      localStorage.setItem("expiry", finalExpirys);
    } else {
      setCreatedDate(new Date());
      let finalExpir = moment(new Date()).format("D MMM YY");
      localStorage.setItem("expiry", finalExpir);
      console.log("Else condition");
    }
  }, []);

  console.log("campaignedData", campaignedData);
  // console.log(
  //   "dividerSingh",
  //   !campaignedData[0]?.messageContent[0]?.Value
  // );

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
            <h1>Offer expiry</h1>
            {offerExpiryArrow ? (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(5))}
              >
                {/* <img src={RightIcon} alt="RightIcon" /> */}
              </div>
            ) : (
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(5))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            )}
          </div>
          <div className="discount-value-box-alignment">
            <div className="offer-discount-alignment">
              <div className="offer-expiry-date-alignment">
                <label>Select an expiry date for the offer</label>
                <div className="date-picker-wrapper">
                  <DatePicker
                    selected={createdDate}
                    value={createdDate}
                    onChange={(e) => SelectFullDate(e)}
                    minDate={new Date()}
                    showDisabledMonthNavigation
                    // dateFormat="dd-MM-yyyy"
                    // placeholderText={new Date().dateFormat="d MMM yy"}
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
            </div>
          </div>

          {selectedMethod === "ReCreate" && (
            <div className="discount-value-box-body">
              <div className="message-preview-box">
                <p>Message preview</p>
                {campaignedData[0]?.messageContent[0]?.Value && (
                  <div className="chat-view-design">
                    {/* <p>Dear (Customer name),</p>
                    <p>
                      Get {campaignedData[0]?.discount} off on{" "}
                      {campaignedData[0]?.messageContent[2]?.Value} at{" "}
                      {userInfo?.businessName}.
                    </p>
                    <p>Valid till {moment(createdDate).format("D MMM YY")}</p> */}
                    {/* <p>Messages by Barbera</p> */}
                    <p>Dear (Customer name),</p>
                    <p>
                      On this {campaignedData[0]?.messageContent[0]?.Value}, get {campaignedData[0]?.discount} off on{" "}
                      {selectedServiceis} at {userInfo?.businessName}.
                    </p>
                    <p>Valid till {moment(createdDate).format("D MMM YY")}</p>
                    <p>Messages by Barbera</p>
                  </div>
                )}
                {!campaignedData[0]?.messageContent[0]?.Value && (
                  <div className="chat-view-design">
                    <p>Dear (Customer name),</p>
                    <p>
                      Get {campaignedData[0]?.discount} off on{" "}
                      {campaignedData[0]?.messageContent[2]?.Value} at{" "}
                      {userInfo?.businessName}.
                    </p>
                    <p>Valid till {moment(createdDate).format("D MMM YY")}</p>
                    {/* <p>Messages by Barbera</p> */}
                    {/* <p>Dear (Customer name),</p>
                  <p>
                    On this {selectedFestival?.name}, get {discounted} off on{" "}
                    {selectedServiceis} at {userInfo?.businessName}.
                  </p>
                  <p>Valid till {moment(createdDate).format("D MMM YY")}</p>
                  <p>Messages by Barbera</p> */}
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedMethod !== "ReCreate" && (
            <div className="discount-value-box-body">
              <div className="message-preview-box">
                <p>Message preview</p>
                {selectedMethod === "Festival offers" && (
                  <div className="chat-view-design">
                    <p>Dear (Customer name),</p>
                    <p>
                      On this {selectedFestival?.name}, get{" "}
                      {discounted.includes("%") ? (
                        discounted
                      ) : (
                        <>Rs {discounted.slice(0, discounted.length - 1)}</>
                      )}{" "}
                      off on {selectedServiceis} at {userInfo?.businessName}.
                    </p>
                    <p>Valid till {moment(createdDate).format("D MMM YY")}</p>
                    {/* <p>Messages by Barbera</p> */}
                  </div>
                )}
                {selectedMethod === "General offer" && (
                  <div className="chat-view-design">
                    <p>Dear(Customer name),</p>
                    <p>
                      Get{" "}
                      {discounted.includes("%") ? (
                        discounted
                      ) : (
                        <>Rs {discounted.slice(0, discounted.length - 1)}</>
                      )}{" "}
                      off on {selectedServiceis} at {userInfo?.businessName}.
                    </p>
                    <p>Valid till {moment(createdDate).format("D MMM YY")}</p>
                    {/* <p>Messages by Barbera</p> */}
                  </div>
                )}
              </div>
            </div>
          )}
          {createdDate === "" || createdDate === null ? (
            <div className="discount-value-continue-box-footer">
              <button>Continue</button>
            </div>
          ) : (
            <div className="discount-value-continue-active-box-footer">
              <button onClick={() => dispatch(setVisuals(8))}>Continue</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
