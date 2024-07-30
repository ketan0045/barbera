import React, { useState, useEffect } from "react";
import "./promotemodal.scss";
import UserIcon from "../../../../assets/svg/user-select.svg";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  selectedOffer,
  setDiscount,
  setVisuals,
} from "../../../../redux/actions/promoteActions";
import CloseIcon from "../../../../assets/svg/new-close.svg";
import SearchIcon from "../../../../assets/svg/new-search-icon.svg";
import StarIcon from "../../../../assets/svg/rating-star.svg";
import CheckedIcon from "../../../../assets/svg/Checked.svg";
import { ApiGet, ApiPost } from "../../../../helpers/API/ApiData";
import moment from "moment";
import PaymentBtn from "../../../../Components/Common/Payment";
import SidebarBarberaLogo from "../../../../assets/img/sidebar-barbera.svg";
import { IconGroup } from "semantic-ui-react";
export default function MakePayment(props) {
  // let selectedSocial = localStorage.getItem("socialType");
  let tinyUrlisas = localStorage.getItem("tinyUrlis");
  const {
    campaignedData,
    toggle,
    setCampaignModal,
    success,
    setSuccess,
    setOfferExpiryArrow,
    offerExpiryArrow,
    setPastCampaignModal,
    pastCamp,
  } = props;

  const dispatch = useDispatch();
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  let finalExpiry = localStorage.getItem("expiry");
  const [fesGreetingMsg, setFesGreetingMsg] = useState("");
  const [keyis, setKeyis] = useState("clear");
  const [customers, setCustomers] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [sendCustomerMsg, setSendCustomerMsg] = useState([]);
  const [backupSendCustomerMsg, setBackupSendCustomerMsg] = useState([]);
  const [perMsg, setPerMsg] = useState("");
  const [platformis, setPlatformis] = useState("");
  let totalPrice = perMsg * sendCustomerMsg.length;
  let scheduleDate = localStorage.getItem("campaignSchedule");
  let scheduleTime = localStorage.getItem("campaignTime");
  let combo = scheduleDate + " " + scheduleTime;
  let postDate = moment.utc(combo, "DD MMM YY h:mm a").format();
  const [activeMsg, setActiveMsg] = useState(true);
  const [searchedList, setSearchedList] = useState([]);
  const [showTitle, setShowTitle] = useState(false);
  const [updatingTimeis, setUpdatingTimeis] = useState(false);
  const [indexis, setIndexis] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [campaignMsg, setCampaignMsg] = useState("");
  const [messageIdis, setMessageIdis] = useState("");
  const [filteredDiscount, setFilteredDiscount] = useState("");
  // const [url, setUrl] = useState("");
  const [tinyUrl, setTinyURL] = useState("");
  const [action, setAction] = useState("");
  // const [selectedSocial, setSelectedSocial] = useState("");
  const [selectCustomerModal, setSelectCustomerModal] = useState(false);

  const selectedMethod = useSelector((state) => state.selectedMethodReducer);
  const selectedOffer = useSelector((state) => state.selectedOfferReducer);
  const selectedServiceis = useSelector(
    (state) => state.selectedMainServiceReducer
  ).toLowerCase();
  const selectedFestival = useSelector(
    (state) => state.selectedFestivalReducer
  );
  const selectedOption = useSelector((state) => state.selectedOfferReducer);
  const discounted = useSelector((state) => state.selectedDiscountReducer);
  const [dateiS, setDateiS] = useState("");
  const [timeiS, setTimeiS] = useState("");
  const handleFilteredDiscount = () => {
    if (discounted.includes("%")) {
      return discounted;
    } else {
      return `Rs.${discounted.slice(0, discounted.length - 1)}`;
    }
  };
  let Link = localStorage.getItem("InstagramLink");
  let webLink = localStorage.getItem("webLink");
  let serviceName = localStorage.getItem("serviceName");
  let servicePrice = localStorage.getItem("servicePrice");

  useEffect(() => {
    if (campaignedData) {
      if (selectedMethod === "ReCreate" || campaignedData[0]?.campaignDate) {
        var campaignDateis = moment(campaignedData[0]?.campaignDate);

        setDateiS(moment(campaignDateis).format("DD MMM YY"));
        setTimeiS(moment(campaignDateis).format("HH:mm"));
        console.log(
          "I am from RECREATE",
          moment(campaignDateis).format("HH:mm")
        );
      } else {
        setDateiS("");
        setTimeiS("");
      }
    }
  }, []);

  console.log("selectedOption", selectedOption,selectedMethod,offerExpiryArrow);

  if (selectedOffer === "Promotions") {
    var selectedSocial = localStorage.getItem("socialType");
  }
  let Customer = "(Customer Name     )";
  let generalOffer = `<small> Dear ${Customer}, <br/> Get ${handleFilteredDiscount()} off on ${selectedServiceis} at ${
    userInfo?.businessName
  }. <br/> Valid till ${finalExpiry} <br/> Messages by Barbera </small>`;
  let festivalOffer = `<small> Dear ${Customer}, <br/> On this ${
    selectedFestival?.name
  },get ${handleFilteredDiscount()} off on ${selectedServiceis} at ${
    userInfo?.businessName
  }. <br/> Valid till ${finalExpiry} <br/> Messages by Barbera </small>`;
  let festivalGreeting = `<small> Dear ${Customer}, <br/> ${userInfo?.businessName} wishes you and your family ${selectedFestival?.description} <br/> Messages by Barbera </small>`;
  let specialGreeting = `<small> ${selectedFestival?.description} ${userInfo?.businessName} wishes you a ${selectedFestival?.sday} <br/> Messages by Barbera </small>`;
  let instagramMsg = `<small> Hey there, <br/> ${action} us on ${platformis} at ${tinyUrlisas} for more offers and updates from ${userInfo?.businessName}. <br/> Messages by Barbera </small>`;
  let webMsg = `<small> Hey there, <br/> ${action} us on ${platformis} at ${tinyUrlisas} for more offers and updates from ${userInfo?.businessName}. <br/> Messages by Barbera </small>`;
  let serviceMsg = `<small> Dear ${Customer}, <br/> Get ${serviceName} starting at just Rs. ${servicePrice} at ${userInfo?.businessName}. See you soon! <br/> Messages by Barbera </small>`;
  // let bookingLink = `https://dev-bookings.barbera.io/?id=${userInfo?.companyId}`;
  let bookingMsg = `<small> Hey there, <br/> ${action} us on ${platformis} at ${tinyUrlisas} for more offers and updates from ${userInfo?.businessName}. <br/> Messages by Barbera `;
  let webMessageFunction = (action, platformis, tinyURl, businessName) => {
    console.log(
      "action, platformis, tinyURl, businessName",
      action,
      platformis,
      tinyURl,
      businessName
    );
    setCampaignMsg(
      `<small> Hey there, <br/> ${action} us on ${platformis} at ${tinyUrlisas} for more offers and updates from ${userInfo?.businessName}. <br/> Messages by Barbera </small>`
    );
  };
  let instaMessageFunction = (action, platformis, tinyURl, businessName) => {
    console.log(
      "action, platformis, tinyURl, businessName",
      action,
      platformis,
      tinyURl,
      businessName
    );
    setCampaignMsg(
      `<small> Hey there, <br/> ${action} us on ${platformis} at ${tinyUrlisas} for more offers and updates from ${userInfo?.businessName}. <br/> Messages by Barbera </small>`
    );
  };

  let bookingMessageFunction = (action, platformis, tinyURl, businessName) => {
    console.log(
      "action, platformis, tinyURl, businessName",
      action,
      platformis,
      tinyURl,
      businessName
    );
    setCampaignMsg(
      `<small> Hey there, <br/> ${action} us on ${platformis} at ${tinyUrlisas} for more offers and updates from ${userInfo?.businessName}. <br/> Messages by Barbera </small>`
    );
  };

  let generalDiscounted = () => {
    setCampaignMsg(
      `<small> Dear ${Customer}, <br/> Get ${handleFilteredDiscount()} off on ${selectedServiceis} at ${
        userInfo?.businessName
      }. <br/> Valid till ${finalExpiry} <br/> Messages by Barbera </small>`
    );
  };

  let festivalDiscounted = () => {
    setCampaignMsg(
      `<small> Dear ${Customer}, <br/> On this ${
        selectedFestival?.name
      },get ${handleFilteredDiscount()} off on ${selectedServiceis} at ${
        userInfo?.businessName
      }. <br/> Valid till ${finalExpiry} <br/> Messages by Barbera </small>`
    );
  };

  useEffect(() => {
    if (selectedMethod === "ReCreate") {
      if (campaignedData[0]?.campaignType === "Offers") {
        let finalEx = moment(new Date(), "DD MMM YY").format("DD MMM YY");
        console.log(
          "Change the expiry Date",
          moment(campaignedData[0]?.expiryDate).format("DD MMM YY"),
          localStorage.getItem("expiry"),
          finalEx
        );
        if (campaignedData[0]?.expiryDate && !localStorage.getItem("expiry")) {
          if (
            moment(campaignedData[0]?.expiryDate).format("DD MMM YY") <
              finalEx ||
            localStorage.getItem("expiry") < finalEx
          ) {
            dispatch(setVisuals(7));
            setOfferExpiryArrow(true);
            console.log("Change the expiry Date");
          }
        }
      }
    } else {
      console.log("Working properly");
    }
  }, []);

  console.log("tested");

  useEffect(() => {
    console.log("filteredDiscount", filteredDiscount);
  }, []);

  useEffect(() => {
    console.log("@@@@@tinyUrl", tinyUrl);
  }, [tinyUrl]);

  useEffect(() => {
    handlePerMSg();
    handleSelectedMethodMsg();
    console.log("combo", moment.utc(combo, "DD MMM YY hh:mm a").format());
  }, []);

  useEffect(() => {
    if (selectedMethod !== "ReCreate") return;
    setSendCustomerMsg([...sendCustomerMsg, ...campaignedData[0]?.customerId]);
    setBackupSendCustomerMsg([
      ...sendCustomerMsg,
      ...campaignedData[0]?.customerId,
    ]);
  }, [campaignedData]);

  useEffect(() => {
    const collectCustomers = async () => {
      await ApiGet(`customer/company/${userInfo?.companyId}`)
        .then((res) => {
          console.log("customer-res", res?.data?.data);
          setCustomerList(res?.data?.data);
          selectedMethod !== "ReCreate" && setSendCustomerMsg(res?.data?.data);
          selectedMethod !== "ReCreate" &&
            setBackupSendCustomerMsg(res?.data?.data);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    collectCustomers();
  }, []);

  console.log("tester21", tinyUrl);

  const handlePaymentMethod = async (key) => {
    if (key) {
      let bodyy = {
        paymentGatewayId: key,
        amount: totalPrice.toFixed(2),
        companyId: userInfo?.companyId,
        type: "Promote",
      };
      await ApiPost("campaignPayment", bodyy)
        .then(async (res) => {
          let body = {
            customerId: sendCustomerMsg,
            messageId: messageIdis,
            paymentId: res?.data?.data?._id,
            messageContent: [
              {
                Key: "festival",
                Value: selectedFestival?.name,
              },
              {
                Key: "discount",
                Value: handleFilteredDiscount(),
              },
              {
                Key: "all/selected services",
                Value: selectedServiceis,
              },
              {
                Key: "service",
                Value: serviceName,
              },
              {
                Key: "amount",
                Value: servicePrice,
              },
              {
                Key: "date",
                Value: finalExpiry,
              },
              {
                Key: "wish",
                Value: selectedFestival?.description,
              },
              {
                Key: "day",
                Value: selectedFestival?.sday,
              },
              {
                Key: "url",
                Value: tinyUrl || tinyUrlisas,
              },
              {
                Key: "action",
                Value: action,
              },
              {
                Key: "platform",
                Value: platformis,
              },
              {
                Key: "ServicePrice",
                Value: servicePrice,
              },
              {
                Key: "FullMsg",
                Value:
                  campaignMsg || campaignedData[0]?.messageContent[12].Value,
              },
            ],
            campaignDate: postDate,
            payment: totalPrice.toFixed(2),
            subTotal: totalPrice.toFixed(2),
            totalAmount: totalPrice.toFixed(2),
            companyId: userInfo?.companyId,
            expiryDate: finalExpiry != "Invalid date" ? finalExpiry : undefined,
            discount: handleFilteredDiscount(),
            campaignType: selectedOffer,
          };
          await ApiPost("campaign", body)
            .then((res) => {
              if (res.status === 200) {
                if (setCampaignModal) {
                  setCampaignModal(toggle);
                }
                if (toggle) {
                  toggle(body);
                }
                setSuccess(true);
                localStorage.setItem("InstagramLink", "");
                localStorage.setItem("WebLink", "");
                localStorage.setItem("tinyUrlis", "");
                localStorage.setItem("BookingLink", "");
                localStorage.setItem("expiry", "");
                localStorage.setItem("campaignSchedule", "");
                localStorage.setItem("campaignTime", "");
                dispatch(setDiscount(""));
                setCampaignMsg("");
              }
              console.log("res", res);
            })
            .catch((err) => {
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    localStorage.setItem("socialType", "");
  };

  const handleSelectedMethodMsg = () => {
    if (
      selectedMethod === "Festival greetings" &&
      selectedOption !== "Services"
    ) {
      setCampaignMsg(festivalGreeting);
      setMessageIdis("62ecd2e9eeccbc4b47100b32");
    } else if (
      selectedMethod === "Special days" &&
      selectedOption !== "Services"
    ) {
      setCampaignMsg(specialGreeting);
      setMessageIdis("62ecdf7af0ff3a79b05e2e74");
    } else if (
      selectedMethod === "General offer" &&
      selectedOption !== "Services"
    ) {
      generalDiscounted();
      // setCampaignMsg(generalOffer);
      setMessageIdis("62ece0f46c33574dc8734e17");
    } else if (
      selectedMethod === "Festival offers" &&
      selectedOption !== "Services"
    ) {
      festivalDiscounted();
      // setCampaignMsg(festivalOffer);
      setMessageIdis("62ece1a001db5449f77a4d26");
    } else if (
      selectedMethod === "Instagram" &&
      selectedOption !== "Services"
    ) {
      setMessageIdis("62ecde9f591bee64111bcbb3");
      setPlatformis("Instagram");
      setAction("Follow");
      // setCampaignMsg(instagramMsg);
      instaMessageFunction(
        "Follow",
        "Instagram",
        tinyUrlisas,
        userInfo?.businessName
      );
    } else if (
      selectedMethod === "Salon website" &&
      selectedOption !== "Services"
    ) {
      setMessageIdis("62ecde9f591bee64111bcbb3");
      setPlatformis("web");
      setAction("Check out");
      // setCampaignMsg(webMsg);
      webMessageFunction(
        "Check out",
        "web",
        tinyUrlisas,
        userInfo?.businessName
      );
    } else if (selectedMethod === "Booking" && selectedOption !== "Services") {
      setMessageIdis("62ecde9f591bee64111bcbb3");
      setPlatformis("web");
      setAction("Book");
      setCampaignMsg(bookingMsg);
      bookingMessageFunction(
        "Book",
        "web",
        tinyUrlisas,
        userInfo?.businessName
      );
    } else if (selectedOption === "Services") {
      setCampaignMsg(serviceMsg);
      setMessageIdis("62ece028b068bb41d6297ed6");
    } else if (selectedMethod === "ReCreate" && campaignedData) {
      setMessageIdis(campaignedData[0]?.messageId);
    }
  };

  // console.log("nineisnie", campaignedData[0]?.messageId);

  useEffect(() => {
    console.log("1234%", campaignMsg);
  }, [campaignMsg]);

  const handlePerMSg = () => {
    console.log("selectedMethod", selectedMethod);
    if (selectedMethod === "General offer") {
      if (generalOffer.length - 35 <= 160) {
        setPerMsg("0.20");
      } else if (
        generalOffer.length - 35 > 160 &&
        generalOffer.length - 35 <= 320
      ) {
        setPerMsg("0.40");
      } else if (generalOffer.length - 35 > 320) {
        setPerMsg("0.60");
      }
    } else if (selectedMethod === "Festival offers") {
      if (festivalOffer.length - 35 <= 160) {
        setPerMsg("0.20");
      } else if (
        festivalOffer.length - 35 > 160 &&
        festivalOffer.length - 35 <= 320
      ) {
        setPerMsg("0.40");
      } else if (festivalOffer.length - 35 > 320) {
        setPerMsg("0.60");
      }
    } else if (selectedMethod === "Festival greetings") {
      if (festivalGreeting.length - 29 <= 160) {
        setPerMsg("0.20");
      } else if (
        festivalGreeting.length - 29 > 160 &&
        festivalGreeting.length - 29 <= 320
      ) {
        setPerMsg("0.40");
      } else if (festivalGreeting.length - 29 > 320) {
        setPerMsg("0.60");
      }
    } else if (selectedMethod === "Special days") {
      if (specialGreeting.length - 23 <= 160) {
        setPerMsg("0.20");
      } else if (
        specialGreeting.length - 23 > 160 &&
        specialGreeting.length - 23 <= 320
      ) {
        setPerMsg("0.40");
      } else if (specialGreeting.length - 23 > 320) {
        setPerMsg("0.60");
      }
    } else if (selectedMethod === "Instagram") {
      if (instagramMsg.length - 23 <= 160) {
        setPerMsg("0.20");
      } else if (
        instagramMsg.length - 23 > 160 &&
        instagramMsg.length - 23 <= 320
      ) {
        setPerMsg("0.40");
      } else if (instagramMsg.length - 23 > 320) {
        setPerMsg("0.60");
      }
    } else if (selectedMethod === "Salon website") {
      if (webMsg.length - 23 <= 160) {
        setPerMsg("0.20");
      } else if (webMsg.length - 23 > 160 && webMsg.length - 23 <= 320) {
        setPerMsg("0.40");
      } else if (webMsg.length - 23 > 320) {
        setPerMsg("0.60");
      }
    } else if (selectedMethod === "Booking") {
      if (bookingMsg.length - 23 <= 160) {
        setPerMsg("0.20");
      } else if (
        bookingMsg.length - 23 > 160 &&
        bookingMsg.length - 23 <= 320
      ) {
        setPerMsg("0.40");
      } else if (bookingMsg.length - 23 > 320) {
        setPerMsg("0.60");
      }
    } else if (selectedMethod === "Services") {
      if (serviceMsg.length - 29 <= 160) {
        setPerMsg("0.20");
      } else if (
        serviceMsg.length - 29 > 160 &&
        serviceMsg.length - 29 <= 320
      ) {
        setPerMsg("0.40");
      } else if (serviceMsg.length - 29 > 320) {
        setPerMsg("0.60");
      }
    }else if (campaignedData && campaignedData[0]?.messageContent[12]?.Value) {
      
      if (campaignedData[0]?.messageContent[12]?.Value.length - 23 <= 160) {
        setPerMsg("0.20");
      
      } else if (
        campaignedData[0]?.messageContent[12]?.Value.length - 23 > 160 &&
        serviceMsg.length - 23 <= 320
      ) {
        setPerMsg("0.40");
      } else if (
        campaignedData[0]?.messageContent[12]?.Value.length - 23 >
        320
      ) {
        setPerMsg("0.60");
      }
    }

  };

  const getAllCustomerData = (keyis) => {
    if (keyis === "add") {
      setSendCustomerMsg([...customerList]);
      // setBackupSendCustomerMsg([...customerList]);

      setKeyis("clear");
      // setActiveMsg(true);
    } else if (keyis == "clear") {
      setSendCustomerMsg([]);
      // setBackupSendCustomerMsg([]);
      setKeyis("add");
      setActiveMsg(false);
    }
  };

  const getCustomerData = (customer, i) => {
    if (sendCustomerMsg.find((el) => el._id === customer._id)) {
      setSendCustomerMsg(
        sendCustomerMsg.filter((el) => el._id !== customer._id)
      );
      setActiveMsg(false);
    } else {
      setSendCustomerMsg([...sendCustomerMsg, customer]);
    }
  };

  const isActiveClass = (id) => {
    return sendCustomerMsg.find((el) => el._id === id);
  };

  console.log("Tester617", sendCustomerMsg);

  const handleSearching = (e) => {
    let valueis = e.target.value.toLowerCase();
    let filterData = customerList.filter(
      (item) =>
        item?.firstName?.toLowerCase()?.includes(valueis) ||
        item?.mobileNumber?.toLowerCase()?.includes(valueis)
    );
    setSearchedList(filterData);
    console.log("This is simple");
  };

  const HandleToContinue = () => {
    setCustomers(!customers);
    setSearchedList(customerList);
  };

  const selectedCampaignDatais = (value) => {
    if (value) {
      return campaignedData[0]?.messageContent[12].Value;
    }
  };

  const handleCampaignDate = () => {
    dispatch(setVisuals(8));
    setUpdatingTimeis(true);
    selectedCampaignDatais(campaignedData[0]?.messageContent[12].Values);
  };

  // const settingPayment = async () => {

  // }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="generate-box-center"
      style={{ zIndex: 99999999999999 }}
    >
      {selectedMethod !== "ReCreate" && (
        <div className="generate-box-center">
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
                      onClick={() => dispatch(setVisuals(1))}
                    >
                      Edit
                    </span>
                  </div>
                  {selectedMethod === "Festival greetings" &&
                    selectedOption !== "Services" && (
                      <div className="chat-view-design">
                        <p>Dear {Customer}</p>
                        <p>
                          {userInfo?.businessName} wishes you and your family{" "}
                          {selectedFestival?.description}
                        </p>
                        <p>Messages by Barbera</p>
                      </div>
                    )}
                  {selectedMethod === "Special days" &&
                    selectedOption !== "Services" && (
                      <div className="chat-view-design">
                        <p>
                          {selectedFestival?.description}
                          {userInfo?.businessName} wishes you a{" "}
                          {selectedFestival?.sday}
                        </p>
                        <p>Messages by Barbera</p>
                      </div>
                    )}
                  {selectedMethod === "General offer" &&
                    selectedOption !== "Services" && (
                      <div className="chat-view-design">
                        <p>Dear {Customer},</p>
                        <p>
                          Get{" "}
                          {discounted.includes("%") ? (
                            <>{discounted}</>
                          ) : (
                            <>Rs.{discounted.slice(0, discounted.length - 1)}</>
                          )}{" "}
                          off on {selectedServiceis} at {userInfo?.businessName}
                          .{" "}
                        </p>
                        <p> Valid till {finalExpiry}</p>
                        <p>Messages by Barbera</p>
                      </div>
                    )}
                  {selectedMethod === "Festival offers" &&
                    selectedOption !== "Services" && (
                      <div className="chat-view-design">
                        <p>Dear {Customer},</p>
                        <p>
                          On this {selectedFestival?.name}, get{" "}
                          {discounted.includes("%") ? (
                            <>{discounted}</>
                          ) : (
                            <>Rs.{discounted.slice(0, discounted.length - 1)}</>
                          )}{" "}
                          off on {selectedServiceis} at {userInfo?.businessName}
                        </p>
                        <p> Valid till {finalExpiry}</p>
                        <p>Messages by Barbera</p>
                      </div>
                    )}
                  {selectedMethod === "Instagram" &&
                    selectedOption !== "Services" && (
                      <div className="chat-view-design">
                        <p>Hey there, </p>
                        <p>
                          {action} us on {platformis} at{" "}
                          <a style={{ color: "#1479FF" }}>
                            {tinyUrl || tinyUrlisas}
                          </a>{" "}
                          for more offers and updates from{" "}
                          {userInfo?.businessName}
                        </p>
                        <p>Messages by Barbera</p>
                      </div>
                    )}
                  {selectedMethod === "Salon website" &&
                    selectedOption !== "Services" && (
                      <div className="chat-view-design">
                        <p>Hey there,  </p>
                        <p>
                          {action} us on {platformis} at{" "}
                          <a style={{ color: "#1479FF" }}>
                            {tinyUrl || tinyUrlisas}
                          </a>{" "}
                          for more offers and updates from{" "}
                          {userInfo?.businessName}
                        </p>
                        <p>Messages by Barbera</p>
                      </div>
                    )}
                  {selectedOption === "Services" && (
                    <>
                      <div className="chat-view-design">
                        <p>Dear {Customer},</p>
                        <p>
                          Get {serviceName} starting at just Rs. {servicePrice}{" "}
                          at {userInfo?.businessName}. See you soon!
                        </p>
                        <p>Messages by Barbera</p>
                      </div>
                    </>
                  )}
                  {selectedMethod === "Booking" &&
                    selectedOption !== "Services" && (
                      <div className="chat-view-design">
                        <p>Hey there,</p>
                        <p>
                          {action} us on {platformis} at{" "}
                          <a style={{ color: "#1479FF" }}>{tinyUrlisas}</a> for
                          more offers and updates from {userInfo?.businessName}
                        </p>
                        <p>Messages by Barbera</p>
                      </div>
                    )}
                </div>
              </div>
              <div className="campaign-scheduled-for-alignment">
                <p>Campaign scheduled for</p>
                <span>
                  {scheduleDate} at {scheduleTime}
                </span>
              </div>
              <div className="payment-text-alignemnt">
                <p>Payment</p>
                <span>
                  <a>₹</a> {perMsg} per message * {sendCustomerMsg.length}{" "}
                  customers
                </span>
                <div className="sub-total-alignment">
                  <h3>Sub total</h3>
                  <h3>
                    <a>₹</a> {totalPrice.toFixed(2)}
                  </h3>
                </div>
              </div>
              <div className="total-amount-text-alignment">
                <p>Total amount</p>
                <p>
                  <a>₹</a> {totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="all-payment-box-footer">
              <PaymentBtn
                price={totalPrice}
                logo={SidebarBarberaLogo}
                user={userInfo}
                upgradePlan={handlePaymentMethod}
              />
              {/* <button onClick={(e) => handlePaymentMethod(e)}>
                Confirm Data
              </button> */}
            </div>
            {/* {customersModal && <CustomerModal />} */}
          </div>
        </div>
      )}
      {selectedMethod === "ReCreate" && (
        <div className="generate-box-center">
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
                      onClick={() => dispatch(setVisuals(1))}
                    >
                      Edit
                    </span>
                  </div>
                  {selectedMethod === "ReCreate" &&
                    selectedOption !== "Services" &&
                    !offerExpiryArrow && (
                      <div
                        className="chat-view-design"
                        dangerouslySetInnerHTML={{
                          __html:
                            campaignedData &&
                            campaignedData[0]?.messageContent[12].Value,
                        }}
                      >
                      </div>
                    )}
                     {/* {selectedMethod === "ReCreate" &&
                    selectedOption !== "Services" &&
                    offerExpiryArrow && (
                      <div
                        className="chat-view-design"
                        dangerouslySetInnerHTML={{
                          __html: campaignedData && campaignedData[0]?.messageContent[12].Value,
                        }}
                      >
                      </div>
                    )} */}
                  {
                    // selectedMethod === "Receate" &&
                    // selectedOption !== "Services" &&
                    offerExpiryArrow &&
                      !campaignedData &&
                      campaignedData[0]?.messageContent[0]?.Value && (
                        <div className="chat-view-design">
                          <p>Dear(Customer name),</p>
                          <p>
                            Get {campaignedData && campaignedData[0]?.discount}{" "}
                            off on{" "}
                            {campaignedData &&
                              campaignedData[0]?.messageContent[2]?.Value}{" "}
                            at {userInfo?.businessName}.
                          </p>
                          <p>Valid till {localStorage.getItem("expiry")}</p>
                        </div>
                      )
                  }
                  {console.log("campaignedData && campaignedData[0]?.messageContent[0]?.Value",campaignedData)}
                  {
                    offerExpiryArrow &&
                      campaignedData && campaignedData[0]?.messageContent[12]?.Value && (
                        <div className="chat-view-design">
                          <p>Dear (Customer name),</p>
                          <p>
                            On this{" "}
                            {campaignedData &&
                              campaignedData[0]?.messageContent[0]?.Value}
                            , get{" "}
                            {(campaignedData && campaignedData[0]?.discount) ||
                              campaignedData[0]?.messageContent[1]?.Value}{" "}
                            off on {selectedServiceis} at{" "}
                            {userInfo?.businessName}.
                          </p>
                          <p>
                            <p>Valid till {localStorage.getItem("expiry")}</p>
                          </p>
                          {/* <p>Messages by Barbera</p> */}
                        </div>
                      )
                  }
                  {selectedOption === "Services" && (
                    <>
                      <div className="chat-view-design">
                        <p>Dear {Customer},</p>
                        <p>
                          Get{" "}
                          {campaignedData &&
                            campaignedData[0]?.messageContent[3]?.Value}{" "}
                          starting at just Rs.
                          {campaignedData &&
                            campaignedData[0]?.messageContent[4]?.Value}{" "}
                          at {userInfo?.businessName}. See you soon!
                        </p>
                        <p>Messages by Barbera</p>
                      </div>
                    </>
                  )}
                  {/* {selectedOption === "Services" && (
                    <>
                      <div className="chat-view-design">
                        <p>Dear {Customer},</p>
                        <p>
                          Get {serviceName} starting at just Rs. {servicePrice}{" "}
                          on your next visit at the {userInfo?.businessName}.
                          See you soon!
                        </p>
                      </div>
                    </>
                  )} */}
                </div>
              </div>
              <div className="campaign-scheduled-for-alignment">
                <div className="flex justify-between">
                  <p>Campaign scheduled for</p>
                  <p className="edit-text" onClick={() => handleCampaignDate()}>
                    Edit
                  </p>
                </div>
                {/* <span> */}
                {localStorage.getItem("campaignSchedule") &&
                localStorage.getItem("campaignTime") ? (
                  <span>
                    {" "}
                    {scheduleDate} at {scheduleTime}{" "}
                  </span>
                ) : (
                  <span>
                    {" "}
                    {dateiS} ataq {timeiS}{" "}
                  </span>
                )}
                {/* </span> */}
              </div>
              <div className="payment-text-alignemnt">
                <p>Payment</p>
                <span>
                  <a>₹</a> {perMsg} per message * {sendCustomerMsg.length}{" "}
                  customers
                </span>
                <div className="sub-total-alignment">
                  <h3>Sub total</h3>
                  <h3>
                    <a>₹</a> {totalPrice.toFixed(2)}
                  </h3>
                </div>
              </div>
              <div className="total-amount-text-alignment">
                <p>Total amount</p>
                <p>
                  <a>₹</a> {totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="all-payment-box-footer">
              <PaymentBtn
                price={totalPrice}
                logo={SidebarBarberaLogo}
                user={userInfo}
                upgradePlan={handlePaymentMethod}
              />
              {/* <button onClick={(e) => handlePaymentMethod(e)}>
                Re-Confirm Data
              </button> */}
            </div>
            {/* {customersModal && <CustomerModal />} */}
          </div>
        </div>
      )}
      {customers && (
        <div className="add-service-mini-modal">
          <div className="customer-details-modal-box-design">
            <div className="select-customers-header-design">
              <div
                onClick={() => {
                  setCustomers(false);
                  // setSendCustomerMsg([...customerList]);
                  setSendCustomerMsg(backupSendCustomerMsg);
                }}
              >
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h1>Select customers</h1>
            </div>
            <div className="customer-details-body-modal-alignment">
              <div className="customer-details-search">
                <div className="relative-div-align">
                  <input
                    type="search"
                    placeholder="Search customers"
                    onChange={(e) => handleSearching(e)}
                  />
                  <div className="search-icon-alignment">
                    <img src={SearchIcon} alt="SearchIcon" />
                  </div>
                </div>
              </div>
              <div className="first-section-alignment">
                <p>{sendCustomerMsg.length} customers</p>
                {keyis == "clear" && (
                  <span onClick={() => getAllCustomerData("clear")}>
                    Clear Selection
                  </span>
                )}
                {keyis === "add" && (
                  <span onClick={() => getAllCustomerData("add")}>
                    Select all customers
                  </span>
                )}
              </div>
              <div className="customer-details-all-box-alignment">
                <div className="customer-details-child-box-height">
                  {searchedList.map((list, i) => {
                    return (
                      <div
                        style={{ cursor: "pointer" }}
                        // activeMsg ||
                        className={
                          isActiveClass(list._id)
                            ? "cus-grid active-message"
                            : "cus-grid"
                        }
                        onClick={() => getCustomerData(list, i)}
                      >
                        <div className="cus-grid-items">
                          <div className="profile-grid">
                            <div className="profile-grid-items">
                              <div className="profile-dummy-alignment">
                                <img src={StarIcon} alt="StarIcon" />
                              </div>
                            </div>
                            <div className="profile-grid-items">
                              <p>{list?.firstName}</p>
                              <span>{list?.mobileNumber}</span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="cus-grid-items">
                          <p>Last transaction date</p>
                          <p>25 Apr ‘22</p>
                        </div> */}
                        {/* {activeMsg && ( */}
                        <div className="cus-grid-items">
                          <img
                            className={
                              isActiveClass(list._id)
                                ? "up-opacity"
                                : "low-opacity"
                            }
                            src={CheckedIcon}
                            alt="CheckedIcon"
                          />
                        </div>
                        {/* )} */}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="customer-details-footer-alignment">
                <div>
                  <span>{sendCustomerMsg.length} customers selected </span>
                </div>
                <div className="customer-details">
                  {sendCustomerMsg.length === 0 ? (
                    <button
                      style={{ background: "#1479ff33", cursor: "not-allowed" }}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCustomers(!customers);
                        setBackupSendCustomerMsg(sendCustomerMsg);
                      }}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
