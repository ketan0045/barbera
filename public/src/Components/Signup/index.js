import React, { useEffect, useState } from "react";
import "./signup.scss";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

import BarberaLogo from "../../assets/svg/BarberaLogo.svg";
import FlashImage from "../../assets/img/flash.png";
import CorrectImage from "../../assets/img/Correct.png";
import { ApiGet, ApiPost } from "../../helpers/API/ApiData";
import OtpInput from "react-otp-input";
import Success from "../Common/Toaster/Success/Success";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfoRed } from "../../redux/actions/userActions";
import * as userUtil from "../../utils/user.util";
import HideIcon from "../../assets/svg/hide-gray.svg";
import ShowIcon from "../../assets/svg/eye-gray.svg";
import longArrow from "../../assets/svg/long-arrow.svg";
import {
  setOnboardingCurrentTooltip,
  setOnboardingStatus,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../redux/actions/onboardingActions";
import moment from "moment";

export default function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [disable, setDisable] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [inputRed, setInputRed] = useState(false);
  const [yourName, setYourName] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const colorList = [
    "#FFD5C2",
    "#FFD3AA",
    "#FEFFC2",
    "#CBF9FF",
    "#D1FFF4",
    "#C2FFC8",
    "#F5CBFF",
    "#FFD8FD",
    "#FBDEE3",
    "#FFD6E3",
  ];

  const handleNewTab = () => {
    window.open("https://www.barbera.io");
  };

  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const [tabPane, setTabPane] = useState("first");
  const toggleTabPane = (string) => {
    setTabPane(string);
  };

  const handleOnClick = async (e, key) => {
    if (key === "sendOtp") {
      //send OTP
      setDisable(true);
      const phoneNumber = { mobile: "+91" + mobile };
      try {
        let response = await ApiGet("account/checkNumber/" + mobile);
        if (response.data.status === 200) {
          if (response.data.data.data === true) {
            let resp = await ApiPost("invoice/sendSMS", phoneNumber);
            if (resp.data.status === 200) {
              toggleTabPane("second");
            } else {
              setSuccess(true);
              setEr("Error");
              setToastmsg("OTP not sent!");
            }
          } else {
            setInputRed(true);
            setSuccess(true);
            setEr("Error");
            setToastmsg("Number already exists!");
          }
        }
      } catch (err) {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong!");
      }
    } else if (key === "numberChange") {
      //change number
      toggleTabPane("first");
    } else if (key === "resendOtp") {
      //resend OTP
      setOtp("");
      const phoneNumber = { mobile: "+91" + mobile };
      try {
        let resp = await ApiPost("invoice/resend/otp", phoneNumber);
        if (resp.data.status === 200) {
          setSuccess(true);
          setToastmsg("OTP has been sent!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("OTP not sent!");
        }
      } catch (err) {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong!");
      }
    } else if (key === "submitOtp") {
      //verify OTP
      const payload = {
        mobile: "+91" + mobile,
        otpValue: otp,
      };
      try {
        let resp = await ApiPost("invoice/check/sendSMS", payload);
        if (resp.data.status === 200) {
          toggleTabPane("third");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Invalid varification code!");
        }
      } catch (err) {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Invalid varification code!");
      }
    } else if (key === "createAc") {
      let payload = {
        role: "Admin",
        password: password1,
        mobileNumber: mobile,
        businessName: businessName,
        Name: yourName,
        nameOfSalonOwner: yourName,
        email: email,
      };
      try {
        let res = await ApiPost("account/", payload);
        if (res.data.status === 200) {
          toggleTabPane("fourth");
          getAccountInfo(res.data.data._id);
          dispatch(setOnboardingTourProgress(0));
          dispatch(setOnboardingStatus(null));
        }
      } catch (err) {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong!");
      }
    }
  };

  const getAccountInfo = async (id) => {
    try {
      let res = await ApiGet("account/" + id);
      if (res.data.status === 200) {
        localStorage.clear();
        userUtil.setUserInfo(res?.data?.data[0]);
        // settingData(res?.data?.data[0]?.companyId);

        //create default payment method
        for (var i = 0; i < 3; i++) {
          createPaymentMethod(
            res?.data?.data[0]?.companyId,
            i === 0 ? "Cash" : i == 1 ? "Debit/Credit Card" : "UPI",
            i == 0 ? true : false
          );
        }
        //add data for defult whatsup sms 
        updateDailyWhatsup(res?.data?.data[0])

        //add default trial days
        trialDays(res?.data?.data[0]?.companyId);

        //create default setting
        setOnobardingData(res?.data?.data[0]?.companyId);
     
        //create default staff
        createStaff(res?.data?.data[0]?.companyId);

        //create default category
        createCategory(res?.data?.data[0]?.companyId);

        //create default color panel
        colorList.forEach((element) => {
          createColor(res?.data?.data[0]?.companyId, element);
        });

        dispatch(setUserInfoRed(res.data.data[0]));
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const trialDays=async(companyId)=>{
    let PlanDetail = {
      finalDate: moment.utc(new Date()).add(7, "days").format(),
      paymentData:[],
      companyId:companyId
    };
    let resp = await ApiPost("monetize", PlanDetail);
    
  }
  const defaultData = [
    [
      "Sales",
      [
        "Total sales",
        "Number of generated invoices",
        "Number of products sold",
        "Average ticket size",
        "Discount offered & Tax",
        "Due amount & Due invoices",
      ],
    ],
    [
      "Appointments",
      ["Total appointments", "Total services availed", "Popular hours"],
    ],
    [
      "Collections",
      [
        "Total sales collections",
        "Opening collection",
        "Closing collection",
        "Expense & Staff pay",
        "Receive from Owner",
        "Transfer to Owner",
      ],
    ],
    ["Staff", ["Staff wise sales", "Staff performance"]],
    [
      "Customers",
      [
        "Available wallet balance",
        "Wallet top-ups",
        "Wallet redeemed",
        "Wallet Withdrawals",
        "Previous due paid",
        "Customer reviews",
        "Custmomer visits",
        "Number of customers added to the system",
      ],
    ],
  ];

  const updateDailyWhatsup = async (user) => {
    let updated = {
      permission: defaultData,
      user: [ { contactName: user?.Name, contactNumber: user?.mobileNumber }] ,
      time:  moment("23:00", "hh-mm a")._d,
      companyId: user?.companyId,
      featureOn: true
    };
    await ApiPost("statement", updated)
      .then(async (res) => {
       
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setOnobardingData = async (companyId) => {
    let onboardingInitData = {
      firstDay: "Sunday",
      bookingInterval: "15",
      storeTiming: [
        {
          isStoreClosed: false,
          day: "Sunday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          day: "Monday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          day: "Tuesday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          day: "Wednesday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          day: "Thursday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          day: "Friday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          day: "Saturday",
          starttime: "10:00",
          endtime: "20:00",
        },
      ],
      multipleStaff: { assignMultipleStaff: true },
      attendence: { attendanceToggle: true },
      workingDays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      customer: false,
      iCustomer: false,
      appointments: true,
      service: true,
      staff: true,
      serviceTime: "15",
      companyId: companyId,
      inventory: {
        enableInventory: true,
        productType: "Store Consumable & Retail",
        enableBarcode: false,
      },
      tax: {
        gstCharge: false,
        gstNumber: "",
        serviceTax: false,
        serviceTaxPer: "CGST 9%, SGST 9%",
        productTax: false,
        productTaxPer: [],
      },
      paymentMethod: ["Cash", "Debit/Credit Card", "UPI"],
      onboardProcess: [
        {
          onboardingStatus: null,
          onboardingCompleted: false,
          onboardingTourProgress: 0,
          onboardingProfileUpdated: false,
        },
      ],
      membership: {
        membership: true,
        membershipBenefits: "Free & Discounted services",
        applyMembershipBenefits: true,
      },
      firstReminderDate:new Date(),
      secondReminderDate:new Date(),
      thirdReminderDate:new Date(),
      currentType: "₹",
    };
    await ApiPost("setting/", onboardingInitData)
      .then((res) => {
        
        userUtil.setSetting(res.data.data);
        dispatch(setOnboardingTourProgress(0));
        dispatch(setOnboardingStatus(null));
        dispatch(setOnboardingTourStatus(true));
        dispatch(setOnboardingTooltipStatus(true));
        dispatch(setOnboardingCurrentTooltip(""));
      })
      .catch((err) => console.log(err));
  };

  const createStaff = async (companyId) => {
    let body = {
      firstName: "Unassign",
      lastName: "",
      mobileNumber: "9898975574",
      workingDays: [
        {
          isStoreClosed: false,
          Day: "Sunday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          Day: "Monday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          Day: "Tuesday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          Day: "Wednesday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          Day: "Thursday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          Day: "Friday",
          starttime: "10:00",
          endtime: "20:00",
        },
        {
          isStoreClosed: false,
          Day: "Saturday",
          starttime: "10:00",
          endtime: "20:00",
        },
      ],
      companyId: companyId,
      default: true,
    };
    await ApiPost("staff/", body);
  };

  const createCategory = async (companyId) => {
    let body1 = {
      categoryName: "Unassign",
      categoryColor: "#D1FFF4",
      companyId: companyId,
    };
    let body2 = {
      categoryName: "Hair Treatment",
      categoryColor: "#FFD3AA",
      companyId: companyId,
      staff: [],
      isActive: true,
    };
    let resp = await ApiPost("category/", body1);
    try {
      if (resp.data.status === 200) {
        //create default services
        createDefaultService(resp.data.data._id, companyId);
        let res = await ApiPost("category/", body2);
        try {
          if (res.data.status === 200) {
            //create default services
            createServices(res.data.data._id, companyId);
          }
        } catch (er) {
          console.log(er);
        }
      }
    } catch (er) {
      console.log(er);
    }
  };

  const createColor = async (companyId, color) => {
    let payload = {
      name: color,
      companyId: companyId,
    };
    await ApiPost("colour/", payload);
  };

  const createDefaultService = async (categoryId, companyId) => {
    const body = {
      categoryId: categoryId,
      serviceName: "Slot",
      duration: "30",
      amount: "0",
      companyId: companyId,
      default:true
    };
    await ApiPost("service/", body);
  };

  const createServices = async (categoryId, companyId) => {
    const body1 = {
      categoryId: categoryId,
      serviceName: "Hair Wash",
      duration: 15,
      amount: 150,
      tax: {},
      companyId: companyId,
      productConsumptions: [],
      isActive: true,
    };
    const body2 = {
      categoryId: categoryId,
      serviceName: "Hair Cut",
      duration: 40,
      amount: 500,
      tax: {},
      companyId: companyId,
      productConsumptions: [],
      isActive: true,
    };
    await ApiPost("service/", body1);
    await ApiPost("service/", body2);
  };

  const createPaymentMethod = async (companyId, method, status) => {
    let payload = {
      paymentType: method,
      companyId: companyId,
      default: status,
    };
    await ApiPost("payment", payload);
  };

  useEffect(() => {
    if (tabPane === "first") {
      const inputInvalid = mobile?.length < 10;
      setIsInvalid(inputInvalid);
    }
    if (tabPane === "second") {
      const inputInvalid = !otp || otp?.length !== 4;
      setIsInvalid(inputInvalid);
    }
    if (tabPane === "third") {
      const inputInvalid = !businessName || !yourName || !password1;
      setIsInvalid(inputInvalid);
    }
  }, [tabPane, mobile, otp, businessName, yourName, email, password1, disable]);

  //toaster timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <div>
        <div className="sign-up-banner">
          <div className="header-text-link" style={{ cursor: "pointer" }}>
            <p onClick={() => handleNewTab()}>
              <span>
                <img src={longArrow} alt="long-arrow" />
              </span>
              Explore barbera.io
            </p>
          </div>
          <div className="container">
            <div className="sign-up-steper-center">
              <div className="steper-box">
                <div className="barbera-log-center">
                  <img src={BarberaLogo} alt="BarberaLogo" />
                </div>
                <div className="steper-left-right-alignment">
                  <div className="stper-alignment">
                    <div
                      className={`steper ${tabPane === "first" && "active"}  ${
                        tabPane === "second" && "active"
                      } ${tabPane === "third" && "active"}  ${
                        tabPane === "fourth" && "active"
                      }`}
                      // onClick={(e) => setTabPane("first")}
                    >
                      {tabPane === "first" ? <span>1</span> : <span>1</span>}
                    </div>
                    <div
                      className={`steper ${tabPane === "second" && "active"} ${
                        tabPane === "third" && "active"
                      } ${tabPane === "fourth" && "active"}`}
                      // onClick={(e) => setTabPane("second")}
                    >
                      {tabPane === "first" || tabPane === "second" ? (
                        <span>2</span>
                      ) : (
                        <span>2</span>
                      )}
                    </div>
                    <div
                      className={`steper ${tabPane === "third" && "active"} ${
                        tabPane === "fourth" && "active"
                      }`}
                      // onClick={(e) => setTabPane("third")}
                    >
                      {tabPane === "first" ||
                      tabPane === "second" ||
                      tabPane === "third" ? (
                        <span>3</span>
                      ) : (
                        <span>3</span>
                      )}
                    </div>
                    <div
                      className={`steper ${
                        tabPane === "fourth" && "steper-active"
                      }`}
                    >
                      <img src={FlashImage} alt="FlashImage" />
                    </div>
                  </div>
                </div>
                {tabPane === "first" && (
                  <div>
                    <div className="first-text-show">
                      <h1>Hey there! First things first...</h1>
                      <p>Setup your account with a mobile number</p>
                    </div>
                    <div className="signup-input">
                      <label>Enter your mobile number</label>
                      <input
                        type="text"
                        style={{ border: inputRed && "1px solid red" }}
                        placeholder="+91 98765 43210"
                        maxLength={10}
                        value={mobile}
                        onKeyPress={bindInput}
                        onChange={(e) => {
                          setMobile(e.target.value);
                          setInputRed(false);
                        }}
                      />
                    </div>
                    <div
                      className="fill-button"
                      onClick={(e) => handleOnClick(e, "sendOtp")}
                    >
                      <button disabled={isInvalid}>Get OTP</button>
                    </div>
                    <div className="new-to-barbera-text-alignment">
                      <p className="already-text">
                        Already a user?{" "}
                        <span
                          className="already-user-text"
                          onClick={() => history.push("/login")}
                        >
                          Login here{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                {tabPane === "second" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="first-text-show-align">
                      <h1>Enter OTP</h1>
                      <p>4-digit code has been sent to </p>
                      <p>
                        <a style={{ color: "#193566" }}> +91 {mobile} </a>
                        <span onClick={(e) => handleOnClick(e, "numberChange")}>
                          (change)
                        </span>
                      </p>
                    </div>
                    <div className="otpInputContainer">
                      <OtpInput
                        value={otp}
                        isInputNum={true}
                        onChange={(e) => setOtp(e)}
                        inputStyle="otpInputStyle"
                        focusStyle="active"
                        containerStyle="otpInputContainerStyle"
                        numInputs={4}
                        shouldAutoFocus={true}
                      />
                    </div>
                    <div
                      className="fill-button"
                      onClick={(e) => handleOnClick(e, "submitOtp")}
                    >
                      <button disabled={isInvalid}>Continue</button>
                    </div>
                    <div className="resend-code-text">
                      <p>
                        Dind’t get one?{" "}
                        <span onClick={(e) => handleOnClick(e, "resendOtp")}>
                          RESEND CODE
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
                {tabPane === "third" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="first-text-show">
                      <h1>One last thing...</h1>
                      <p>Enter these final details and you’re done!</p>
                    </div>
                    <div className="third-step-input">
                      <label>What's your business name</label>
                      <div className="relative-div-input">
                        <input
                          type="text"
                          placeholder="Business Name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                        <div className="icon-steper-align">
                          <svg
                            width="16"
                            height="12"
                            viewBox="0 0 16 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.2857 1.2L14.8571 4.8H1.14286L1.82857 1.2H14.2857ZM15.0401 0.76838C14.9328 0.317912 14.5303 0 14.0673 0H1.93272C1.46965 0 1.06716 0.317911 0.95991 0.768379L0.0271939 4.68579C0.00912675 4.76167 0 4.8394 0 4.91741V5C0 5.55229 0.447716 6 1 6H1.14286V11C1.14286 11.5523 1.59057 12 2.14286 12H7.57143C8.12371 12 8.57143 11.5523 8.57143 11V6H13.7143V11.4286C13.7143 11.7442 13.9701 12 14.2857 12C14.6013 12 14.8571 11.7442 14.8571 11.4286V6H15C15.5523 6 16 5.55229 16 5V4.91741C16 4.8394 15.9909 4.76167 15.9728 4.68579L15.0401 0.76838ZM2.28571 10.8V6H7.42857V10.8H2.28571Z"
                              fill="#1479FF"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="third-step-input">
                      <label>What's your name</label>
                      <div className="relative-div-input">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={yourName}
                          onChange={(e) => setYourName(e.target.value)}
                        />
                        <div className="icon-steper-align">
                          <svg
                            width="12"
                            height="14"
                            viewBox="0 0 12 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3332 13V11.6667C11.3332 10.9594 11.0522 10.2811 10.5521 9.78105C10.052 9.28095 9.37375 9 8.6665 9H3.33317C2.62593 9 1.94765 9.28095 1.44755 9.78105C0.947455 10.2811 0.666504 10.9594 0.666504 11.6667V13"
                              stroke="#1479FF"
                              stroke-width="1.25"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M5.99967 6.33333C7.47243 6.33333 8.66634 5.13943 8.66634 3.66667C8.66634 2.19391 7.47243 1 5.99967 1C4.52692 1 3.33301 2.19391 3.33301 3.66667C3.33301 5.13943 4.52692 6.33333 5.99967 6.33333Z"
                              stroke="#1479FF"
                              stroke-width="1.25"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="third-step-input">
                      <label>What's your email id</label>
                      <div className="relative-div-input">
                        <input
                          type="text"
                          placeholder="Enter email (optional)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="icon-steper-align">
                          <svg
                            width="15"
                            height="12"
                            viewBox="0 0 15 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.875 0.278809H1.125C0.843207 0.278809 0.572956 0.399361 0.373699 0.613946C0.174442 0.828531 0.0625 1.11957 0.0625 1.42304V10.5769C0.0625 10.8804 0.174442 11.1714 0.373699 11.386C0.572956 11.6006 0.843207 11.7211 1.125 11.7211H13.875C14.1568 11.7211 14.427 11.6006 14.6263 11.386C14.8256 11.1714 14.9375 10.8804 14.9375 10.5769V1.42304C14.9375 1.11957 14.8256 0.828531 14.6263 0.613946C14.427 0.399361 14.1568 0.278809 13.875 0.278809ZM12.7062 1.42304L7.5 5.30198L2.29375 1.42304H12.7062ZM1.125 10.5769V1.94366L7.19719 6.4691C7.28612 6.53554 7.39177 6.57114 7.5 6.57114C7.60823 6.57114 7.71388 6.53554 7.80281 6.4691L13.875 1.94366V10.5769H1.125Z"
                              fill="#1479FF"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="third-step-input">
                      <label>Enter password</label>
                      <div className="relative-div-input">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={password1}
                          onChange={(e) => setPassword1(e.target.value)}
                        />
                        <div className="icon-steper-align">
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.04 12.88H17.92V10.64C17.92 8.45598 16.184 6.71998 14 6.71998C11.816 6.71998 10.08 8.45598 10.08 10.64V12.88H8.95996V10.64C8.95996 7.83998 11.2 5.59998 14 5.59998C16.8 5.59998 19.04 7.83998 19.04 10.64V12.88Z"
                              fill="#1479FF"
                            />
                            <rect
                              x="7.8042"
                              y="12.674"
                              width="12.3913"
                              height="8.73913"
                              rx="1.5"
                              fill="white"
                              stroke="#1479FF"
                            />
                            <path
                              d="M13.9999 16.7999C14.6184 16.7999 15.1199 16.2985 15.1199 15.6799C15.1199 15.0614 14.6184 14.5599 13.9999 14.5599C13.3813 14.5599 12.8799 15.0614 12.8799 15.6799C12.8799 16.2985 13.3813 16.7999 13.9999 16.7999Z"
                              fill="#1479FF"
                            />
                            <path
                              d="M14.2802 15.6801H13.7202L13.1602 19.0401H14.8402L14.2802 15.6801Z"
                              fill="#1479FF"
                            />
                          </svg>
                        </div>
                        <div className="hide-icon-alignment">
                          <img
                            src={showConfirmPassword ? HideIcon : ShowIcon}
                            alt="HideIcon"
                            height="21"
                            width="21"
                            onClick={(e) =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="third-step-input">
                      <label>Re-enter password</label>
                      <div className="relative-div-input">
                        <input
                          type="text"
                          placeholder="Enter password"
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                        />
                        <div className="icon-steper-align">
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.04 12.88H17.92V10.64C17.92 8.45598 16.184 6.71998 14 6.71998C11.816 6.71998 10.08 8.45598 10.08 10.64V12.88H8.95996V10.64C8.95996 7.83998 11.2 5.59998 14 5.59998C16.8 5.59998 19.04 7.83998 19.04 10.64V12.88Z"
                              fill="#1479FF"
                            />
                            <rect
                              x="7.8042"
                              y="12.674"
                              width="12.3913"
                              height="8.73913"
                              rx="1.5"
                              fill="white"
                              stroke="#1479FF"
                            />
                            <path
                              d="M13.9999 16.7999C14.6184 16.7999 15.1199 16.2985 15.1199 15.6799C15.1199 15.0614 14.6184 14.5599 13.9999 14.5599C13.3813 14.5599 12.8799 15.0614 12.8799 15.6799C12.8799 16.2985 13.3813 16.7999 13.9999 16.7999Z"
                              fill="#1479FF"
                            />
                            <path
                              d="M14.2802 15.6801H13.7202L13.1602 19.0401H14.8402L14.2802 15.6801Z"
                              fill="#1479FF"
                            />
                          </svg>
                        </div>
                      </div>
                    </div> */}
                    <div
                      className="created-account-button"
                      onClick={(e) => handleOnClick(e, "createAc")}
                    >
                      <button disabled={isInvalid}>Create account</button>
                    </div>
                  </motion.div>
                )}
                {tabPane === "fourth" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="launch-icon-center-align">
                      <img src={CorrectImage} alt="CorrectImage" />
                    </div>
                    <div className="first-text-show">
                      <h1>Yay! Welcome to Barbera.</h1>
                      <p>You have successfully registered.</p>
                    </div>
                    <div className="fill-button">
                      <Link to="/">
                        <button>Launch Barbera!</button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
    </>
  );
}
