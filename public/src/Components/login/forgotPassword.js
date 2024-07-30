import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./login.scss";
import { motion } from "framer-motion/dist/framer-motion";
import { ApiGet, ApiPost, ApiPut } from "../../helpers/API/ApiData";
import Success from "../Common/Toaster/Success/Success";
import NewLoginOTP from "./NewLoginOTP";
import OtpInput from "react-otp-input";
import HideIcon from "../../assets/svg/hide.svg";
import ShowIcon from "../../assets/svg/eye.svg";
import BarberaLogo from "../../assets/svg/BarberaLogo.svg";

export default function ForgotPassword() {
  const history = useHistory();
  const [otp, setOtp] = useState("");
  const [toastmsg, setToastmsg] = useState();
  const [er, setEr] = useState();
  const [mobile, setMobile] = useState("");
  const [passwordone, setPasswordone] = useState("");
  const [passwordtwo, setPasswordtwo] = useState("");
  const [disable, setDisable] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inputRed, setInputRed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("forgot-main");
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
  localStorage.setItem("mobile", mobile);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 2000);
    return () => clearTimeout(timer);
  });
  const handleForgotPassword = async (e, mobile, key) => {
    if (key === "sendOtp") {
      //send OTP
      setDisable(true);
      const phoneNumber = { mobile: "+91" + mobile };
      try {
        let response = await ApiGet("account/checkNumber/" + mobile);
        if (response.data.status === 200) {
          if (response.data.data.data === false) {
            let resp = await ApiPost("invoice/sendSMS", phoneNumber);
            if (resp.data.status === 200) {
              setSelectedTab("get-otp");
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
            setSuccess(true);
            setEr("Error");
            setToastmsg("This mobile number is not registered");
          }
        }
      } catch (err) {
        setInputRed(true);
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong!");
      }
    } else if (key === "numberChange") {
      //change number
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
          let responseis = await ApiGet("account/checkNumber/" + mobile);
          localStorage.setItem("Id", responseis?.data?.data?.value[0]._id);
          localStorage.setItem("Role", responseis?.data?.data?.value[0].role);
          setSelectedTab("reset-password");
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
  const handleResetingPassword = async () => {
    if (passwordone === passwordtwo) {
      let body = {
        password: passwordone,
      };
      let ID = localStorage.getItem("Id");
      let role = localStorage.getItem("Role")
      if(role === "Staff"){
        await ApiPut(`staff/${ID}`, body)
        .then((res) => {
          history.push("/login");
          localStorage.setItem("Forgot", true);
        })
        .catch((err) => {
          console.log(err);
        });
      }else{
      await ApiPut(`account/${ID}`, body)
        .then((res) => {
          history.push("/login");
          localStorage.setItem("Forgot", true);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    } else {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Password not match");
    }
  };
  return (
    <div>
      <div className="new-login-banner">
        <div className="new-login-banner-box-center-alignment">
          <div className="new-login-box-alignment">
            <div className="new-login-logo-alignment"></div>
            {selectedTab === "forgot-main" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <div className="barbera-log-center">
                  <img src={BarberaLogo} alt="BarberaLogo" />
                </div>
                <div className="login-content-text-alignment">
                  <p>Forgot password? No worries</p>
                  <span>Verify your mobile number and set a new password</span>
                </div>
                <div className="new-login-all-body-alignment">
                  <div className="new-login-flow-input">
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
                      placeholder="+91 Mobile number"
                    />
                  </div>
                </div>
                {mobile.length === 10 ? (
                  <div
                    className="login-flow-fill-button"
                    style={{ padding: "0" }}
                    onClick={(e) => {
                      handleForgotPassword(e, mobile, "sendOtp");
                    }}
                  >
                    <button>Get OTP</button>
                  </div>
                ) : (
                  <div
                    className="login-flow-fill-button"
                    style={{ padding: "0" }}
                  >
                    <button
                      style={{
                        background: "rgba(59, 130, 246, 0.2)",
                        cursor: "not-allowed",
                      }}
                    >
                      Get OTP
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            {selectedTab === "get-otp" && (
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
                    <span>
                      +91 {localStorage.getItem("mobile", mobile)}
                    </span>{" "}
                    <a
                      onClick={() => {
                        setSelectedTab("forgot-main");
                        setOtp("");
                        setMobile("");
                      }}
                    >
                      (change)
                    </a>
                  </h2>
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
                  className="login-flow-fill-button"
                  onClick={(e) => handleForgotPassword(e, mobile, "submitOtp")}
                >
                  <button>Continue</button>
                </div>
                <div className="resend-code-alignment">
                  <p>
                    Dind’t get one?{" "}
                    <span
                      onClick={(e) =>
                        handleForgotPassword(e, mobile, "resendOtp")
                      }
                    >
                      RESEND CODE
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
            {selectedTab === "reset-password" && (
              <div>
                <div className="barbera-log-center">
                  <img src={BarberaLogo} alt="BarberaLogo" />
                </div>
                <div className="login-content-text-alignment">
                  <p>Reset password</p>
                  <span>Enter a new Password</span>
                </div>
                <div className="new-login-all-body-alignment">
                  <div className="new-login-flow-password">
                    <div className="label-content-alignment">
                      <label htmlFor="">Enter Password</label>
                    </div>
                    <div className="password-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
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
                  <div className="new-login-flow-input">
                    <label>Re-enter password</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordtwo}
                      onChange={(e) => setPasswordtwo(e.target.value)}
                    />
                  </div>
                </div>
                {passwordone === "" || passwordtwo === "" ? (
                  <div className="login-flow-fill-button">
                    <button
                      style={{
                        background: "rgba(59, 130, 246, 0.2)",
                        cursor: "not-allowed",
                      }}
                    >
                      Reset Password
                    </button>
                  </div>
                ) : (
                  <div
                    className="login-flow-fill-button"
                    onClick={() => handleResetingPassword()}
                  >
                    <button>Reset Password</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
    </div>
  );
}
