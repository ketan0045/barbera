import React, { useState, useEffect } from "react";
import "./login.scss";
import HideIcon from "../../assets/svg/hide-gray.svg";
import ShowIcon from "../../assets/svg/eye-gray.svg";
import { useHistory } from "react-router-dom";
import { string } from "yup";
import { useDispatch } from "react-redux";
import { ApiGet, ApiPost } from "../../helpers/API/ApiData";
import * as userUtil from "../../utils/user.util";
import { motion } from "framer-motion";
import longArrow from "../../assets/svg/long-arrow.svg";
import {
  setUserInfoRed,
  setUserPermissions,
} from "../../redux/actions/userActions";
import Success from "../Common/Toaster/Success/Success";
import LoginwithOTP from "./LoginwithOTP";
import OtpInput from "react-otp-input";
import {
  setOnboardingCurrentTooltip,
  setOnboardingStatus,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../redux/actions/onboardingActions";
import BarberaLogo from "../../assets/svg/BarberaLogo.svg";
import LoginImage from "../Common/Modal/LoginImage";
import { setattendanceDate } from "../../redux/actions/attendanceActions";
import useKeypress from "react-use-keypress";

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [er, setEr] = useState();
  const [loading, setLoading] = useState(false);
  const [imageshow, setImage] = useState(true);
  const [mobile, setMobile] = useState("");
  const [selectedTab, setSelectedTab] = useState("login-with-otp");
  const [loginErr, setLoginErr] = useState(false);
  const [inputRed, setInputRed] = useState(false);
  const [passwordone, setPasswordone] = useState("");
  const [formstatus, setFormstatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [toastmsg, setToastmsg] = useState();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  useKeypress(["Enter"], (event) => {
    if (event.key === "Enter") {
      if (selectedTab === "login-with-email") {
        handleLoginwithEmail();
      }
      if (selectedTab === "login-otp-page") {
        if (otp.length === 4) {
          handleOnClick(mobile, "submitOtp");
        }
      } else {
        if (mobile.length == 10) {
          handleOnClick(mobile, "Send_OTP");
        }
      }
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 2000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const forgot = localStorage.getItem("Forgot");
    if (forgot) {
      setSelectedTab("login-with-email");
      localStorage.clear();
    }
  }, []);

  const handleNewTab = () => {
    window.open("https://www.barbera.io");
  };

  const handleLoginwithEmail = async (setStatus) => {
    const data = {
      email: mobile,
      password: passwordone,
    };
    await ApiPost("account/validateAccount", data)
      .then(async (res) => {
        if (res.data.status === 200) {
          setLoading(false);
          localStorage.clear();
          // authUtil.setToken(res.data.data.token);
          userUtil.setUserInfo(res?.data?.data[0]);
          dispatch(setUserPermissions(res.data.data[0].permission));
          settingData(res?.data?.data[0]?.companyId);
          dispatch(setUserInfoRed(res.data.data[0]));
          setImage(false);
          // await sleep(2000);
          setTimeout(() => {
            history.replace("/");
          }, 2600);
        } else {
          setLoading(false);
          // setSubmitting(false);
          setFormstatus("Invalid Credentials");
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          // setLoading(false);
          // setSubmitting(false);
          setFormstatus("Invalid Credentials");
        } else {
          // setLoading(false);
          // setSubmitting(false);
          setFormstatus("Something Went Wrong !");
        }
      });
  };

  const sleep = (ms) =>
    new Promise((r) => {
      setTimeout(r, ms);
      setLoading(true);
    });

  const handleOnClick = async (mobile, key) => {
    if (key === "Send_OTP") {
      if (mobile.length === 10) {
        console.log("right track");
        const phoneNumber = { mobile: "+91" + mobile };
        let response = await ApiGet("account/checkNumber/" + mobile);
        if (response.data.status === 200) {
          if (response.data.data.data === false) {
            let resp = await ApiPost("invoice/login/sendSMS", phoneNumber);
            if (resp.data.status === 200) {
              setSelectedTab("login-otp-page");
              setSuccess(true);
              setToastmsg("OTP Sent");
            } else {
              setInputRed(true);
              setSuccess(true);
              setEr("Error");
              setToastmsg("OTP not sent!");
            }
          } else {
            setInputRed(true);
            setLoginErr(true);
          }
        }
      } else {
        setInputRed(true);
        setSuccess(true);
        setEr("Error");
        setToastmsg("Invalid mobile number");
      }
    } else if (key === "resendOtp") {
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
          let responseis = await ApiGet("account/checkNumber/" + mobile);
          if (responseis.data.status === 200) {
            if (responseis.data.data.data === false) {
              setLoading(false);
              localStorage.clear();
              // authUtil.setToken(res.data.data.token);
              userUtil.setUserInfo(responseis?.data?.data.value[0]);
              dispatch(
                setUserPermissions(responseis.data.data.value[0].permission)
              );
              settingData(responseis?.data?.data.value[0]?.companyId);
              dispatch(setUserInfoRed(responseis.data.data.value[0]));
              setImage(false);
              setTimeout(() => {
                history.replace("/");
              }, 2550);
            }
          }
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
    }
  };

  const settingData = async (companyId) => {
    await ApiGet("setting/company/" + companyId).then(async (res) => {
      if (res?.data?.status === 200) {
        userUtil.setSetting(res.data.data[0]);
        if (res?.data?.data[0]?.attendanceDate) {
          dispatch(setattendanceDate(res?.data?.data[0]?.attendanceDate));
        }
        if (res?.data?.data[0]?.onboardProcess?.length > 0) {
          let onboardingData = res?.data?.data[0]?.onboardProcess[0];
          dispatch(
            setOnboardingTourProgress(onboardingData?.onboardingTourProgress)
          );
          dispatch(setOnboardingStatus(onboardingData?.onboardingStatus));
          dispatch(setOnboardingTourStatus(onboardingData?.onboardingStatus));
          dispatch(setOnboardingTooltipStatus(false));
          dispatch(setOnboardingCurrentTooltip(""));
        } else {
          let onboardingInitData = {
            companyId: companyId,
            onboardProcess: [
              {
                onboardingStatus: null,
                onboardingCompleted: false,
                onboardingTourProgress: 0,
                onboardingProfileUpdated: false,
              },
            ],
          };
          await ApiPost("setting", onboardingInitData)
            .then((res) => {
              userUtil.setSetting(res.data.data[0]);
              dispatch(setOnboardingTourProgress(0));
              dispatch(setOnboardingStatus(null));
              dispatch(setOnboardingTourStatus(true));
              dispatch(setOnboardingTooltipStatus(true));
              dispatch(setOnboardingCurrentTooltip(""));
            })
            .catch((err) => console.log(err));
        }
      }
    });
  };

  const handleChangeEvent = () => {
    setSelectedTab("login-with-otp");
    setOtp("");
    setMobile("");
  };

  return (
    <>
      {!loading && (
        <div className="new-login-banner">
          {imageshow && (
            <div className="header-text-link" style={{ cursor: "pointer" }}>
              <p onClick={() => handleNewTab()}>
                <span>
                  <img src={longArrow} alt="long-arrow" />
                </span>
                Explore barbera.io
              </p>
            </div>
          )}
          {imageshow && (
            <div className="new-login-banner-box-center-alignment">
              <div className="new-login-box-alignment">
                <div className="new-login-logo-alignment"></div>
                {selectedTab === "login-with-email" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="barbera-log-center">
                      <img src={BarberaLogo} alt="BarberaLogo" />
                    </div>
                    <div className="login-content-text-alignment">
                      <p>Welcome back!</p>
                      <span>
                        Verify your mobile number to access your account
                      </span>
                    </div>
                    <div
                      className="new-login-all-body-alignment"
                      onSubmit={() => handleLoginwithEmail()}
                    >
                      <div className="new-login-flow-input">
                        <label>Enter email/mobile number</label>
                        <input
                          type="text"
                          style={{ border: inputRed && "1px solid red" }}
                          placeholder="Enter"
                          value={mobile}
                          autoFocus
                          // maxLength={10}
                          // onKeyPress={bindInput}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            setInputRed(false);
                          }}
                        />
                        <span
                          style={{
                            color: "#E66666",
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          {formstatus === "" ? "" : formstatus}
                        </span>
                      </div>
                      <div className="new-login-flow-password">
                        <div className="label-content-alignment">
                          <label htmlFor="">Password</label>
                          <span onClick={() => history.push("/forgot")}>
                            Forgot password?
                          </span>
                        </div>
                        <div className="password-relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={passwordone}
                            onChange={(e) => setPasswordone(e.target.value)}
                          />
                          <div className="icon-alignment">
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
                      </div>
                    </div>
                    <div
                      className="login-flow-fill-button"
                      onClick={() => handleLoginwithEmail()}
                    >
                      <button>Log in</button>
                    </div>
                    <div
                      className="login-flow-outline-button"
                      onClick={() => setSelectedTab("login-with-otp")}
                    >
                      <button>Log in with OTP</button>
                    </div>
                    <div className="new-to-barbera-text-alignment">
                      <p>
                        New to barbera?{" "}
                        <span onClick={() => history.push("/signup")}>
                          Sign up{" "}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
                {selectedTab === "login-with-otp" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className=""
                  >
                    <div className="barbera-log-center">
                      <img src={BarberaLogo} alt="BarberaLogo" />
                    </div>
                    <div className="login-content-text-alignment">
                      <p>Welcome back!</p>
                      <span>
                        Verify your mobile number to access your account
                      </span>
                    </div>
                    <div className="new-login-all-body-alignment">
                      <div className="new-login-flow-input relative">
                        <label>Enter your mobile number</label>
                        <input
                          type="text"
                          style={{ border: inputRed && "1px solid red" }}
                          value={mobile}
                          onKeyPress={bindInput}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            setInputRed(false);
                          }}
                          maxLength={10}
                          autoFocus
                          placeholder="Mobile number"
                        />
                        {loginErr && (
                          <p
                            style={{
                              position: "absolute",
                              bottom: "-20px",
                              fontWeight: 500,
                              fontSize: "15px",
                              lineHeight: "18px",
                              color: "#E66666",
                            }}
                          >
                            This mobile number is not registered. Try Signing up
                          </p>
                        )}
                      </div>
                    </div>
                    {mobile.length < 10 ? (
                      <div
                        className="login-flow-fill-button"
                        // onClick={(e) => handleGetOtp(e, mobile, "Send_OTP")}
                      >
                        <button
                          style={{
                            background: "#abc9fb",
                            cursor: "not-allowed",
                          }}
                        >
                          Get OTP
                        </button>
                      </div>
                    ) : (
                      <div
                        className="login-flow-fill-button"
                        onClick={(e) => handleOnClick(mobile, "Send_OTP")}
                      >
                        <button>Get OTP</button>
                      </div>
                    )}

                    <div
                      className="login-flow-outline-button"
                      onClick={() => setSelectedTab("login-with-email")}
                    >
                      <button>Log in with email</button>
                    </div>
                    <div
                      className="new-to-barbera-text-alignment"
                      onClick={() => history.push("/signup")}
                    >
                      <p>
                        New to barbera? <span>Sign up </span>
                      </p>
                    </div>
                  </motion.div>
                )}
                {selectedTab === "login-otp-page" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="barbera-log-center">
                      <img src={BarberaLogo} alt="BarberaLogo" />
                    </div>
                    <div className="otp-section-alignment">
                      <p>Enter OTP</p>
                      <h2>
                        4-digit code has been sent to <br />
                        <span>+91 {mobile}</span>{" "}
                        <a onClick={() => handleChangeEvent()}>(change)</a>
                      </h2>
                    </div>
                    {/* <div className="otp-section-input-alignment">
                 <div className="input-flex">
                   <input type="text" name="" id="" />
                   <input type="text" name="" id="" />
                   <input type="text" name="" id="" />
                   <input type="text" name="" id="" />
                 </div>
               </div> */}
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
                    {otp.length === 4 ? (
                      <div
                        className="login-flow-fill-button"
                        onClick={(e) => handleOnClick(mobile, "submitOtp")}
                      >
                        <button>Continue</button>
                      </div>
                    ) : (
                      <div className="login-flow-fill-button">
                        <button
                          style={{
                            background: "rgb(171, 201, 251)",
                            cursor: "not-allowed",
                          }}
                        >
                          Continue
                        </button>
                      </div>
                    )}
                    <div className="resend-code-alignment">
                      <p>
                        Dind’t get one?{" "}
                        <span
                          onClick={(e) => handleOnClick(mobile, "resendOtp")}
                        >
                          RESEND CODE
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
          {!imageshow && <LoginImage />}
        </div>
      )}
    </>
  );
}
