import React from "react";
import { useState, useEffect } from "react";
import SendIcon from "../../../../assets/svg/send.svg";
import MiniCloseIcon from "../../../../assets/svg/new-close-icon-1.svg";
import ChatIcon from "../../../../assets/svg/chat-message-view-icon.svg";
import MessageIcon from "../../../../assets/svg/message-back-icon.svg";
import CloseIcon from "../../../../assets/svg/new-close.svg";
import SearchIcon from "../../../../assets/svg/new-search-icon.svg";
import CheckedIcon from "../../../../assets/svg/Checked.svg";
import UserIcon from "../../../../assets/svg/user-select.svg";
import { ApiGet } from "../../../../helpers/API/ApiData";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMethod,
  selectedOffer,
  setVisuals,
} from "../../../../redux/actions/promoteActions";
import ScheduleCampaign from "./ScheduleCampaign";
import MakePayment from "./makePayment";
import SelectGreeting from "./selectGreeting";
import CampaignOptions from "./CampaignOptions";
import SelectFestival from "./selectFestival";
import SpecificService from "./SpecificService";
import DiscountValue from "./discountValue";
import Offerexpiry from "./Offerexpiry";
import ServiceOptions from "./ServiceOptions";

function PastCampaign(props) {
  const {
    toggle,
    success,
    setSuccess,
    setOfferExpiryArrow,
    offerExpiryArrow,
    setPastCampaignModal,
  } = props;
  const dispatch = useDispatch();
  const [viewTemplate, setViewTemplate] = useState(false);
  const [showrecreate, setShowrecreate] = useState(false);
  const [showSelectedCampaign, setShowSelectedCampaign] = useState(false);
  const [campaignedData, setCampaignedData] = useState([]);
  const [campaigned, setCampaigned] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userinfo")).companyId;
  // const selectedMethod = useSelector((state) => state.selectedMethodReducer);
  const selectedOption = useSelector((state) => state.selectedOfferReducer);
  const currentVisual = useSelector((state) => state.visualAidReducer);

  console.log("1221", campaignedData);
  useEffect(() => {
    // gettingCampaign();
    gettingCampaignDetails();
  }, []);
  // const gettingCampaign = async () => {
  //   await ApiGet(`campaign/company/${userInfo}`)
  //     .then((res) => {
  //       console.log("1221221", res?.data?.data);
  //       setCampaigned(res?.data?.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const gettingCampaignDetails = async () => {
    await ApiGet(`campaign/company/${userInfo}`)
      .then((res) => {
        console.log("res 9879", res?.data?.data);
        setCampaigned((res?.data?.data).reverse());
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleRecreateCampaign = (item) => {
    let filtered = campaigned.filter((list) => list === item);
    setShowrecreate(true);
    setCampaignedData(filtered);
    dispatch(setVisuals(9));
    dispatch(selectedMethod("ReCreate"));
    dispatch(selectedOffer(filtered[0].campaignType));
    let finalScheduleDate = moment.utc(filtered[0].campaignDate).format("D MMM YY")
    let time = moment(filtered[0].campaignDate).subtract(330,"minutes").format("hh:mm A")
    localStorage.setItem("campaignSchedule", finalScheduleDate);
    localStorage.setItem("campaignTime", time);
    // pastCamp()
  };

  const handleViewCampaign = (item) => {
    let filtered = campaigned.filter((list) => list === item);
    setViewTemplate(!viewTemplate);
    setCampaignedData(filtered);
  };

  console.log("CVX0009", campaignedData);
  console.log("++1122", success);

  return (
    <div>
      {/* <p onClick={pastCamp}>X</p>
      <h3>Testing the flow with the condtions and many devs</h3>
      <p onClick={()=>setViewTemplate(!viewTemplate)}>View template</p>
      {viewTemplate && (
        <>
          <p onClick={()=>setViewTemplate(false)}>X</p>
          <h1>Testing flow with view templates</h1>
        </>
      )} */}
      <div className="campaign-modal">
        <div className="modal-header">
          <div className="container-long">
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div className="modal-close" onClick={toggle}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Past campaigns</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="campaign-modal-body">
          <div className="campaign-container">
            <div className="modal-body-top-align">
              <div className="campaign-new-table-design">
                <table>
                  <tr>
                    <th>Campaign type</th>
                    <th>Campaign id</th>
                    <th>Date</th>
                    <th>No. of customers</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Message content</th>
                    {/* <th>Relaunch campaign</th> */}
                  </tr>
                  {campaigned.map((list) => {
                    return (
                      <>
                        <tr>
                          <td>
                            <div className="first-child-text-style">
                              <span>{list?.campaignType}</span>
                            </div>
                          </td>
                          <td>
                            <div className="child-text-style">
                              <span>{list?.campaignId}</span>
                            </div>
                          </td>
                          <td>
                            <div className="child-text-style">
                              <span>
                                {moment.utc(list?.campaignDate).format("DD MMM yyyy  ")}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="child-text-style">
                              <span>{list?.customerId.length} customers</span>
                            </div>
                          </td>
                          <td>
                            <div className="child-text-style">
                              <span>
                                <a>₹</a> {list?.totalAmount}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="status-button-style">
                              <button>Successful</button>
                            </div>
                          </td>
                          <td>
                            <div
                              className="view-template"
                              onClick={() => handleViewCampaign(list)}
                            >
                              <span className="view-template-color">
                                View template
                              </span>
                            </div>
                          </td>
                          {/* <td>
                            <div className="re-create-button-style">
                              <button
                                onClick={() => {
                                  handleRecreateCampaign(list);
                                  gettingCampaignDetails();
                                }}
                              >
                                <img src={SendIcon} alt="SendIcon" />
                                <span>Re-create</span>
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      </>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewTemplate && (
        <>
          {/* <p onClick={()=>setViewTemplate(false)}>X</p>
          <h1>Testing flow with view templates</h1> */}

          <div className="set-view-template-modal-desgin">
            <div className="set-view-template-modal-center-alignment">
              <div className="set-view-template-box">
                <div className="message-modal-header">
                  <div onClick={() => setViewTemplate(false)}>
                    <img src={MiniCloseIcon} alt="MiniCloseIcon" />
                  </div>
                  <div>
                    <h2>Message template </h2>
                  </div>
                </div>
                <div className="message-modal-body-alignment">
                  <div className="message-text-box">
                    <div className="message-header-box">
                      <div className="message-profile-icon-center-alignment">
                        <svg
                          width="34"
                          height="33"
                          viewBox="0 0 34 33"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="17" cy="16.5" r="16.5" fill="#969AA6" />
                          <circle
                            cx="16.9999"
                            cy="12.1"
                            r="6.23333"
                            fill="white"
                          />
                          <path
                            d="M27.6334 25.3001C27.6334 26.4001 22.8727 30.0667 17 30.0667C11.1274 30.0667 6.3667 26.4001 6.3667 25.3001C6.3667 24.2001 11.1274 21.2667 17 21.2667C22.8727 21.2667 27.6334 24.2001 27.6334 25.3001Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div className="app-barbera-text">
                        <span>QP-BRBERA</span>
                        <svg
                          width="5"
                          height="7"
                          viewBox="0 0 5 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 6.5L4 3.40323L1 0.5"
                            stroke="#BBBBBB"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="message-body-alignment">
                      <div className="text-message">
                        <span>Text Message</span>
                      </div>
                      <div className="message-view-text-alignment">
                        <div
                          className="message-box-style"
                          dangerouslySetInnerHTML={{
                            __html: campaignedData[0]?.messageContent[12].Value,
                          }}
                        ></div>
                      </div>
                      <div className="text-message-box-style-alignment">
                        <div className="input-style">
                          <input type="text" placeholder="Text Message" />
                          <div className="right-alignment">
                            <img src={MessageIcon} alt="MessageIcon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showrecreate && (
        <>
          <div className="campaign-modal with-sam">
            <div className="modal-header">
              <div className="container-long">
                <div className="modal-header-alignment">
                  <div className="modal-heading-title">
                    <div className="modal-close" onClick={toggle}>
                      <img src={CloseIcon} alt="CloseIcon" />
                    </div>
                    <div className="modal-title">
                      <h2>Recreate campaign</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="campaign-modal-body">
              <div className="container">
                <div className="modal-body-top-align">
                  <>{currentVisual === 1 && <CampaignOptions />}</>
                  <>{currentVisual === 2 && <SelectGreeting />}</>
                  <>{currentVisual === 3 && <SelectFestival />}</>
                  <>{currentVisual === 4 && <ServiceOptions />}</>
                  <>{currentVisual === 5 && <SpecificService />}</>
                  <>{currentVisual === 6 && <DiscountValue />}</>
                  <>
                    {currentVisual === 7 && (
                      <Offerexpiry
                        campaignedData={campaignedData}
                        offerExpiryArrow={offerExpiryArrow}
                        setOfferExpiryArrow={setOfferExpiryArrow}
                      />
                    )}
                  </>
                  <>{currentVisual === 8 && <ScheduleCampaign />}</>
                  <>
                    {currentVisual === 9 && (
                      <MakePayment
                      toggle={toggle}
                        campaignedData={campaignedData}
                        success={success}
                        setSuccess={setSuccess}
                        setOfferExpiryArrow={setOfferExpiryArrow}
                        offerExpiryArrow={offerExpiryArrow}
                        setPastCampaignModal={setPastCampaignModal}
                      />
                    )}
                  </>
                  {/* <div className="generate-box-center">
                    <div className="campaign-child-box">
                      <div className="all-make-payment-box-header">
                        <div className="all-content-alignemnt">
                          <div className="all-cus-selected-area">
                            <div className="add-cus-box">
                              <img src={UserIcon} alt="UserIcon" />
                            </div>
                            <div>
                              <h3>All customers selected</h3>
                              <button>{sendCustomerMsg.length}</button>
                            </div>
                          </div>
                          <div onClick={HandleToContinue}>
                          <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      <div className="all-payment-box-body">
                        <div className="message-first-chat-alignment">
                          <div className="message-preview-box">
                            <div className="message-preview-header">
                              <p>Message preview</p>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => dispatch(setVisuals(8))}
                              >
                                Edit
                              </span>
                            </div>
                            {
                              <div className="chat-view-design">
                                <p>Dear Customer-name,</p>
                                <p>
                                  Get discounted off on selectedServiceis at
                                  businessName.{" "}
                                </p>
                                <p> Valid till finalExpiry</p>
                                <p>Messages by Barbera</p>
                              </div>
                            }
                          </div>
                        </div>
                        <div className="campaign-scheduled-for-alignment">
                          <p>Campaign scheduled for</p>
                          {/* <span>
                            {scheduleDate} at {scheduleTime}
                          </span> */}
                  {/* </div> */}
                  {/* <div className="payment-text-alignemnt">
                          <p>Payment</p>
                          <span>
                            <a>₹</a> {perMsg} per message *{" "}
                            {sendCustomerMsg.length} customers
                          </span>
                          <div className="sub-total-alignment">
                            <h3>Sub total</h3>
                            <h3>
                              <a>₹</a> {totalPrice.toFixed(2)}
                            </h3>
                          </div>
                        </div> */}
                  {/* <div className="total-amount-text-alignment">
                          <p>Total amount</p>
                          <p><a>₹</a> {totalPrice.toFixed(2)}</p>
                        </div> */}
                  {/* </div> */}
                  {/* <div className="all-payment-box-footer">
                        <button>Make Payment</button>
                        <button onClick={(e) => handleSelectedSending(e)}>
              Confirm Data
            </button>
                      </div> */}
                  {/* {customersModal && <CustomerModal />}
                    </div> */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PastCampaign;
