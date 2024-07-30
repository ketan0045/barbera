import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useHistory } from "react-router-dom";
import "./login.scss";
import { motion } from "framer-motion";

export default function NewLoginOTP() {
  const history = useHistory();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [inputRed, setInputRed] = useState(false);
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
  return (
    <div>
      <div className="new-login-banner">
        <div className="new-login-banner-box-center-alignment">
          <div className="new-login-box-alignment">
            <div className="new-login-logo-alignment"></div>
            <motion.div
              initial={{ opacity: 0, x: "20vw" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="otp-section-alignment">
                <p>Enter OTP</p>
                <h2>
                  4-digit code has been sent to <br />
                  <span>+91 {localStorage.getItem("mobile", mobile)}</span>{" "}
                  <a onClick={() => history.push("/forgot")}>(change)</a>
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
              <div
                className="login-flow-fill-button"
                onClick={() => history.push("/new-reset-password")}
              >
                <button>Continue</button>
              </div>
              <div className="resend-code-alignment">
                <p>
                  Dind’t get one? <span>RESEND CODE</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
