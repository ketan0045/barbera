import React, { useEffect, useState } from "react";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import "./../Modal.scss";
import firebase from "../../../../firebase";
import { ApiGet, ApiPost, ApiPut } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Success from "../../Toaster/Success/Success";
import axios from "axios";

export default function OTPModal(props) {
  const {
    modal,
    otpModalToggle,
    page,
    setPage,
    userInProgress,
    setOwnerProfile,
    setOperatorProfile,
    firstTimeSetup,
    setFirstTimeSetup,
    isFirstMobileAssigned,
    setisFirstMobileAssigned,
    setCompanyOwnersAccounts,
    setCompanyOperatorsAccounts,
    getAcDetails,
    editOperator,
    editOperatorData,
    modalClose,
    setDidOperatorUpdate,
    deleteModaltoggle,
    sendOTPSuccess,
    setSendOTPSuccess,
  } = props;

  const operatorPermissions = useSelector((state) => state.operatorPermissions);

  const [otp, setOtp] = useState("");
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();


  const bindInput = (value, key) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  // console.log("firstTimeSetup", firstTimeSetup);

  // ---------------------------------------------- firebase OTP functionality start ------------------------------------------------

  // const configureReCaptcha = () => {
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  //     "resend-otp",
  //     {
  //       size: "invisible",
  //       callback: (response) => {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //         handleOnReSendOtp();
  //         console.log("Recaptca varified");
  //       },
  //       defaultCountry: "IN",
  //     }
  //   );
  // };

  // const handleOnReSendOtp = (e) => {
  //   e.preventDefault();
  //   configureReCaptcha();
  //   const phoneNumber = "+91" + userInProgress.contactInfo;
  //   console.log(phoneNumber);
  //   const appVerifier = window.recaptchaVerifier;
  //   firebase
  //     .auth()
  //     .signInWithPhoneNumber(phoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       window.confirmationResult = confirmationResult;
  //       console.log("OTP has been sent");
  //       setSuccess(true);
  //       setToastmsg("OTP has been sent!");
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Error; SMS not sent
  //       // ...
  //       console.log("SMS not sent");
  //       setSuccess(true);
  //       setEr("Error");
  //       setToastmsg("SMS not sent!");
  //     });
  // };

  // const handleOnReSubmitOtp = (e, key) => {
  //   e.preventDefault();
  //   const code = otp;
  //   console.log(code);
  //   window.confirmationResult
  //     .confirm(code)
  //     .then((result) => {
  //       // User signed in successfully.
  //       console.log(result);
  //       if (!isFirstMobileAssigned) {
  //         updateFirstTimeUser(e, key);
  //       } else if (editOperator === "EditOperator") {
  //         updateOperator(e, key);
  //       } else {
  //         addNewOwnerOperator(e, key);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setSuccess(true);
  //       setEr("Error");
  //       setToastmsg("Invalid verification code!");
  //       // User couldn't sign in (bad verification code?)
  //     });
  // };

  // ---------------------------------------------- firebase OTP functionality end ------------------------------------------------

  const handleOnReSendOtp = async () => {
    const phoneNumber = { mobile: "91" + userInProgress.contactInfo };

    let resp = await ApiPost("invoice/resend/otp", phoneNumber);
    try {
      if (resp.data.status === 200) {
        setSuccess(true);
        setToastmsg("OTP has been sent!");
      } else {
        console.log("in the else");
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("SMS not sent!");
    }
  };

  // ---------------------------------------------- old OTP functionality start ------------------------------------------------

  // const handleOnReSendOtp = (e) => {
  //   const phoneNumber = "91" + userInProgress.contactInfo;
  //   axios
  //     .get(
  //       `https://api.msg91.com/api/v5/otp/retry?authkey=375604AwGeIE6alcKc62552145P1&retrytype=Default&mobile=${phoneNumber}`
  //     )
  //     .then((res) => {
  //       if (res.type === "success") {
  //         setSuccess(true);
  //         setToastmsg("OTP has been sent!");
  //       }
  //     })
  //     .catch((er) => {
  //       setSuccess(true);
  //       setEr("Error");
  //       setToastmsg("SMS not sent!");
  //     });
  // };

  //   const handleOnReSubmitOtp = (e, key) => {
  //   const phoneNumber = "91" + userInProgress.contactInfo;
  //   const code = otp;
  //   axios
  //     .get(
  //       `https://api.msg91.com/api/v5/otp/verify?otp=${code}&authkey=375604AwGeIE6alcKc62552145P1&mobile=${phoneNumber}`
  //     )
  //     .then((result) => {
  //       if (!isFirstMobileAssigned) {
  //         updateFirstTimeUser(e, key);
  //       } else if (editOperator === "EditOperator") {
  //         updateOperator(e, key);
  //       } else {
  //         addNewOwnerOperator(e, key);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setSuccess(true);
  //       setEr("Error");
  //       setToastmsg("Invalid verification code!");
  //       // User couldn't sign in (bad verification code?)
  //     });
  // };

  // ---------------------------------------------- old OTP functionality end ------------------------------------------------

  const handleOnReSubmitOtp = async (e, key) => {
    const payload = {
      mobile: "91" + userInProgress.contactInfo,
      otpValue: otp,
    };
    try {
      let resp = await ApiPost("invoice/check/sendSMS", payload);
      if (resp.data.status === 200) {
        if (!isFirstMobileAssigned) {
          updateFirstTimeUser(e, key);
        } else if (editOperator === "EditOperator") {
          updateOperator(e, key);
        } else {
          addNewOwnerOperator(e, key);
        }
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Invalid verification code!");
    }
  };

  
  const updateOperator = async (e, key) => {
    let res = await ApiPut("account/" + editOperatorData._id, {
      Name: userInProgress?.fullName,
      mobileNumber: userInProgress?.contactInfo,
      password: userInProgress?.password,
    });
    try {
      if (res.data.status === 200) {
        // setPage(key);
        getAcDetails();
        otpModalToggle(e, "", "", `New role assigned to ${userInProgress.role}!`);
        modalClose();
        setPage("");
        setDidOperatorUpdate(true);
        deleteModaltoggle(false);
        setOwnerProfile({
          fullName: "",
          contactInfo: "",
          password: "",
          confirmPassword: "",
          role: "Owner",
        });
        setOperatorProfile({
          fullName: "",
          contactInfo: "",
          password: "",
          confirmPassword: "",
          role: "Operator",
          permission: [],
        });
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Account already exists!");
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Something Went Wrong!");
    }
  };

  const ownerPermissions = operatorPermissions?.map((per) => {
    return { ...per, isChecked: true };
  });

  const userInfo = Auth.getUserDetail();
  const updateFirstTimeUser = async (e, key) => {
   
    let res = await ApiPut("account/" + userInfo._id, {
      role: userInProgress.role,
      Name: userInProgress.fullName,
      password: userInProgress.confirmPassword,
      permission: userInProgress.role === "Operator" ? operatorPermissions : ownerPermissions,
    });
    try {
      if (res.data.status === 200) {
        setPage(key);
        getAcDetails();
        // if (key === "Operator_accounts") {
        // setFirstTimeSetup(false);
        // }
        setisFirstMobileAssigned(true);
        otpModalToggle(e, "", "", `New role assigned to ${userInProgress.role}!`);
        setOwnerProfile({
          fullName: "",
          contactInfo: "",
          password: "",
          confirmPassword: "",
          role: "Owner",
        });
        setOperatorProfile({
          fullName: "",
          contactInfo: "",
          password: "",
          confirmPassword: "",
          role: "Operator",
          permission: [],
        });
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Account already exists!");
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Something Went Wrong!");
    }
  };

  const addNewOwnerOperator = async (e, key) => {
    let res = await ApiPost("account/", {
      role: userInProgress.role,
      Name: userInProgress.fullName,
      password: userInProgress.confirmPassword,
      mobileNumber: userInProgress.contactInfo,
      permission: userInProgress.role === "Operator" ? operatorPermissions : ownerPermissions,
      businessName: userInfo.businessName,
      email: "",
      address: userInfo.address,
      city: userInfo.city,
      salonManager: userInfo.salonManager,
      nameOfSalonOwner: userInfo.nameOfSalonOwner,
      companyId: userInfo.companyId,
    });
    try {
      if (res.data.status === 200) {
        setPage(key);
        getAcDetails();
        otpModalToggle(e, "", "", `New ${userInProgress.role} added!`);
        setOwnerProfile({
          fullName: "",
          contactInfo: "",
          password: "",
          confirmPassword: "",
          role: "Owner",
        });
        setOperatorProfile({
          fullName: "",
          contactInfo: "",
          password: "",
          confirmPassword: "",
          role: "Operator",
          permission: [],
        });
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Account already exists!");
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Something went wrong!");
    }
  };

  useEffect(() => {
    if (sendOTPSuccess) {
      setSuccess(true);
      setToastmsg("OTP sent successfully");
    }
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => {
      clearTimeout(timer);
      setSendOTPSuccess(false);
    };
  });

 

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Enter OTP</h4>
              <div className="close-button" onClick={() => otpModalToggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="add-stock-section-align digits-code-color-change">
            <p>
              {" "}
              4 digits code has been sent to <span>{userInProgress.contactInfo}</span>{" "}
            </p>
            <div className="form-group">
              <input
                type="text"
                placeholder="Code here"
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                maxLength={`4`}
                onKeyPress={bindInput}
              />
            </div>
          </div>
          <div className="sub-modal-footer add-stock-button-top-align">
            <div className="button-right-align">
              {page === "Operator" ? (
                <button
                  id="captcha-button"
                  // onClick={(e) => toggle(e, "Operator_accounts")}
                  onClick={(e) => handleOnReSubmitOtp(e, "Operator_accounts")}
                  disabled={otp?.length < 4}
                >
                  Continue
                </button>
              ) : (
                <button
                  id="captcha-button"
                  // onClick={(e) => toggle(e, "Owner_accounts")}
                  onClick={(e) => handleOnReSubmitOtp(e, "Owner_accounts")}
                  disabled={otp?.length < 4}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              marginTop: "15px",
              // height:'18px',
              fontWeight: "500",
            }}
          >
            <span style={{ color: "rgba(25, 53, 102, 0.5)" }}>
              Didn't get one, <span> </span>
              <button
                id="resend-otp"
                onClick={(e) => handleOnReSendOtp(e)}
                style={{ backgroundColor: "#FFFFFF", color: "#1479FF" }}
              >
                <h5>Resend code</h5>
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
