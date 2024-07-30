import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./login.scss";

export default function NewResetPassowrd() {
  const history = useHistory();
  const [mobile, setMobile] = useState("");
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
            <div>
              <div className="login-content-text-alignment">
                <p>Reset password</p>
                <span>Enter a new password</span>
              </div>
              <div className="new-login-all-body-alignment">
                <div className="new-login-flow-input">
                  <label>Enter email/mobile number</label>
                  <input type="text" placeholder="Mobile number" />
                </div>
                <div className="new-login-flow-password">
                  <div className="label-content-alignment">
                    <label htmlFor="">Password</label>
                  </div>
                  <div className="password-relative">
                    <input type="text" placeholder="Enter password" />
                    <div className="icon-alignment">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.425 3.18C7.94125 3.05916 8.4698 2.99875 9 3C14.25 3 17.25 9 17.25 9C16.7947 9.85171 16.2518 10.6536 15.63 11.3925M10.59 10.59C10.384 10.8111 10.1356 10.9884 9.85961 11.1113C9.58362 11.2343 9.28568 11.3004 8.98357 11.3058C8.68146 11.3111 8.38137 11.2555 8.10121 11.1424C7.82104 11.0292 7.56654 10.8608 7.35288 10.6471C7.13923 10.4335 6.97079 10.179 6.85763 9.89879C6.74447 9.61863 6.68889 9.31854 6.69423 9.01643C6.69956 8.71432 6.76568 8.41638 6.88866 8.14039C7.01163 7.86439 7.18894 7.61599 7.41 7.41M0.75 0.75L17.25 17.25M13.455 13.455C12.1729 14.4323 10.6118 14.9736 9 15C3.75 15 0.75 9 0.75 9C1.68292 7.26142 2.97685 5.74246 4.545 4.545L13.455 13.455Z"
                          stroke="#97A7C3"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="login-flow-fill-button">
                <button>Reset Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
