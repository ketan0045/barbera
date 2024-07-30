import React, { useEffect, useState } from "react";
import EditIcon from "../../../assets/svg/edit-icon.svg";
import ProfileImage from "../../../assets/svg/profile-image.png";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { logout } from "../../../utils/auth.util";
import EditProfileModal from "../../Common/Modal/EditProfileModal";
import EditTaxDetailsModal from "../../Common/Modal/EditTaxDetailsModal";
import EditWorkingHoursModal from "../../Common/Modal/EditWorkingHoursModal";
import EditCurrencyDetailsModal from "../../Common/Modal/EditCurrencyDetailsModal";
import Delete from "../../Common/Toaster/Delete";
import Success from "../../Common/Toaster/Success/Success";
import { useDispatch, useSelector } from "react-redux";

import OtpInput from "react-otp-input";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import HideIcon from "../../../assets/svg/hide.svg";
import ShowIcon from "../../../assets/svg/eye.svg";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";



export default function GeneralSetting(props) {
  const {
    getSetting,
    taxDetails,
    storeTiming,
    workday,
    workingDays,
    saloonDetail,
    getAcDetails,
    currencyData,
    permission,
    userInfo
  } = props;

  const [changePassword, setChangePassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const storeOnboardingStatus = useSelector(
    (state) => state.onboardingStatusRed
  );
  const storeOnboardingTourProgress = useSelector(
    (state) => state.onboardingTourProgressRed
  );
  const storeOnboardingTourStatus = useSelector(
    (state) => state.onboardingTourStatusRed
  );
  const storeOnboardingTooltipStatus = useSelector(
    (state) => state.onboardingTooltipStatusRed
  );

  const storeOnboardingCurrentTooltip = useSelector(
    (state) => state.onboardingCurrentTooltipRed
  );

  useEffect(() => {
    if (storeOnboardingCurrentTooltip === "B1") {
      setProfileModal(true);
    } else if (storeOnboardingCurrentTooltip === "B2 with toast") {
      setWorkingHoursModal(true);
      setSuccess(true);
      setToastmsg("Changes saved!");
      setTimeout(() => {
        setProfileModal(false);
      }, 500);
    } else if (storeOnboardingCurrentTooltip === "B2") {
      setWorkingHoursModal(true);
    }
  }, [storeOnboardingCurrentTooltip]);

  const [editProfileData, setEditProfileData] = useState({});
  const [editTaxDetails, setEditTaxDetails] = useState({});
  const [editCurrencyDetails, setEditCurrencyDetails] = useState({});
  const [success, setSuccess] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [reshowConfirmPassword, setReshowConfirmPassword] = useState(false);
  const [passwordone, setPasswordone] = useState("");
  const [passwordtwo, setPasswordtwo] = useState("");
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [key, setKey] = useState("profile");
  const [inputRed, setInputRed] = useState(false);
  const [reenter, setReenter] = useState(false);
  const storageData = localStorage.getItem("userinfo");
  const mobile = JSON.parse(storageData).mobileNumber;
  

  const [profileModal, setProfileModal] = useState(false);
  const profileEditModal = () => {
    profileEditModaltoggle();
  };
  const profileEditModaltoggle = (status) => {
    setProfileModal(!profileModal);
    if (profileModal === true) {
      if (status) {
        if (status === 200) {
          getAcDetails();
          setSuccess(true);
          setToastmsg("Changes saved!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

 

  const handleResetingPassword = async () => {
    let body = {
      password: passwordone,
    };
    let role =JSON.parse(localStorage.getItem("userinfo"))
    let ID = localStorage.getItem("Id");
    if(role.role === "Staff"){
      await ApiPut(`staff/${role._id}`, body)
      .then((res) => {
        setSuccess(true);
        setToastmsg("Password updated!");
        setPasswordone("");
        setPasswordtwo("");
        setReenter(false);
        // history.push("/setting");
      })
      .catch((err) => {
        console.log(err);
      });
    }else{
    await ApiPut(`account/${ID}`, body)
      .then((res) => {
        setSuccess(true);
        setToastmsg("Password updated!");
        setPasswordone("");
        setPasswordtwo("");
        setReenter(false);
        // history.push("/setting");
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };


  const sleep = (ms) =>
  new Promise((r) => {
    setTimeout(r, ms);
    setLoading(true);
  });

  const handleOnClick = async (e, key) => {
    if (key === "Send_OTP") {
      setChangePasswordModal(true);
      // if (mobile.length === 10) {
      const phoneNumber = { mobile: "+91" + mobile };
      
      let response = await ApiGet("account/checkNumber/" + mobile);
      if (response.data.status === 200) {
        if (response.data.data.data === false) {
          let resp = await ApiPost("invoice/sendSMS", phoneNumber);
          if (resp.data.status === 200) {
            // setSelectedTab("login-otp-page");
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
          // setLoginErr(true);
        }
      }
      // } else {
      //   setInputRed(true);
      //   setSuccess(true);
      //   setEr("Error");
      //   setToastmsg("Invalid mobile number");
      // }
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
          localStorage.setItem("Id", responseis?.data?.data?.value[0]._id);
          if (responseis.data.status === 200) {
            setOtp("");
            if (responseis.data.data.data === false) {
              setLoading(false);
              setReenter(true);
              setChangePasswordModal(false);
              // localStorage.clear();
              // // authUtil.setToken(res.data.data.token);
              // userUtil.setUserInfo(responseis?.data?.data.value[0]);
              // dispatch(
              //   setUserPermissions(responseis.data.data.value[0].permission)
              // );
              // settingData(responseis?.data?.data.value[0]?.companyId);
              // dispatch(setUserInfoRed(responseis.data.data.value[0]));
              // setImage(false);
              // await sleep(2000);
              // history.push("/");
            } else {
              setOtp("");
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


  const [deleteModal, setDeleteModal] = useState(false);
  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
  };

  const [workingHoursModal, setWorkingHoursModal] = useState(false);
  const workingHoursEditModal = () => {
    workingHoursEditModaltoggle();
  };
  const workingHoursEditModaltoggle = (status, data) => {
    getSetting();
    setWorkingHoursModal(!workingHoursModal);
    if (workingHoursModal === true) {
      if (status) {
        if (status === 200) {
          getSetting(data);
          setSuccess(true);
          setToastmsg("Changes saved!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const [taxDetailsModal, setTaxDetailsModal] = useState(false);
  const taxDetailsEditModal = () => {
    taxDetailsEditModaltoggle();
  };
  const taxDetailsEditModaltoggle = (status, data) => {
    setTaxDetailsModal(!taxDetailsModal);
    if (taxDetailsModal === true) {
      if (status) {
        if (status === 200) {
          getSetting(data);
          setSuccess(true);
          setToastmsg("Changes saved!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };


  const editProfileHandler = (data) => {
    profileEditModal();
    setEditProfileData(data);
  };
  const editWorkingHourHandler = () => {
    workingHoursEditModal();
  };
  const editTaxDetailsHandler = (data) => {
    taxDetailsEditModal();
    setEditTaxDetails(data);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

 


  


  return (
    <>
      <div className="setting-sub-grid">
        <div className="setting-sub-grid-items">
          <div className="setting-use-menu">
            <div className="setting-profile-main">
              {saloonDetail?.profileImage ? (
                <div className="profile-center-align">
                  <img src={ProfileImage} alt="ProfileImage" />
                </div>
              ) : (
                <div className="profile-center-align">
                  <div className="no-image-show-use-round">
                    {saloonDetail?.businessName[0].toUpperCase()}
                  </div>
                </div>
              )}
              <div className="setting-profile-name">
                <p>{saloonDetail?.businessName}</p>
              </div>
              <div className="setting-profile-type-name">
                <span>Logged in as {userInfo?.role}</span>
                <p>{userInfo?.role == "Staff" ? userInfo?.firstName :userInfo?.Name }</p>
              </div>
            </div>
            <div className="cus-tab-design">
              <ul>
                <li
                  className={key === "profile" && "active-tab-cus-background"}
                  onClick={(e) => setKey("profile")}
                >
                  Profile
                  {permission?.filter(
                    (obj) =>
                      obj.name ===
                      "General settings actions (Change working hours, edit profile, edit tax, edit currency)"
                  )?.[0]?.isChecked === false
                    ? null
                    : key === "profile" && (
                        <img
                          src={EditIcon}
                          alt="EditIcon"
                          onClick={() => editProfileHandler(saloonDetail)}
                        />
                      )}
                </li>
                <li
                  className={
                    key === "working_hours" && "active-tab-cus-background"
                  }
                  onClick={(e) => setKey("working_hours")}
                >
                  Working hours
                  {permission?.filter(
                    (obj) =>
                      obj.name ===
                      "General settings actions (Change working hours, edit profile, edit tax, edit currency)"
                  )?.[0]?.isChecked === false
                    ? null
                    : key === "working_hours" && (
                        <img
                          src={EditIcon}
                          alt="EditIcon"
                          onClick={() => editWorkingHourHandler()}
                        />
                      )}
                </li>
                <li
                  className={key === "tax" && "active-tab-cus-background"}
                  onClick={(e) => setKey("tax")}
                >
                  Tax
                  {permission?.filter(
                    (obj) =>
                      obj.name ===
                      "General settings actions (Change working hours, edit profile, edit tax, edit currency)"
                  )?.[0]?.isChecked === false
                    ? null
                    : key === "tax" && (
                        <img
                          src={EditIcon}
                          alt="EditIcon"
                          onClick={() => editTaxDetailsHandler(taxDetails)}
                        />
                      )}
                </li>
                
              </ul>
            </div>
          </div>
          <div>
          <div className="changepassword-button-alignment">
              {/* <button>Change password</button> */}
              <button onClick={(e) => handleOnClick(e, "Send_OTP")}>
                Change Password
              </button>
            </div>

            <div className="setting-button-alignment">
              {/* <button>Change password</button> */}
              <button
                onClick={() => {
                  opendeleteModal();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {key === "profile" && (
          <div className="setting-sub-grid-items">
            <div className="salon-data">
              <p>Business data</p>
            </div>
            <div className="salon-data-grid">
              <div className="salon-data-grid-items">
                <p>Business name</p>
              </div>
              <div className="salon-data-grid-items">
                <span>{saloonDetail?.businessName}</span>
              </div>
            </div>
            <div className="salon-data-grid">
              <div className="salon-data-grid-items">
                <p>Contact number</p>
              </div>
              <div className="salon-data-grid-items">
                <span>{saloonDetail?.mobileNumber}</span>
              </div>
            </div>
            <div className="salon-data-grid">
              <div className="salon-data-grid-items">
                <p>E-mail</p>
              </div>
              <div className="salon-data-grid-items">
                <span>{saloonDetail?.email}</span>
              </div>
            </div>
            <div className="salon-data-grid">
              <div className="salon-data-grid-items">
                <p>Owner name</p>
              </div>
              <div className="salon-data-grid-items">
                <span>{saloonDetail?.nameOfSalonOwner}</span>
              </div>
            </div>
            {/* <div className="salon-data-grid">
              <div className="salon-data-grid-items">
                <p>Operator name</p>
              </div>
              <div className="salon-data-grid-items">
                <span>{saloonDetail?.salonManager}</span>
              </div>
            </div> */}
            <div className="salon-data-grid">
              <div className="salon-data-grid-items">
                <p>Address</p>
              </div>
              <div className="salon-data-grid-items">
                <span>{saloonDetail?.address}</span>
              </div>
            </div>
          </div>
        )}
        {key === "working_hours" && (
          <div className="setting-sub-grid-items">
            <div className="salon-data">
              <p>Working hours</p>
            </div>
            <div className="working-table-staff">
              <div className="grid">
                <div className="grid-items">
                  <span>Day</span>
                </div>
                <div className="grid-items">
                  <span align="center">Start time</span>
                </div>
                <div className="grid-items">
                  <span>End time</span>
                </div>
              </div>
              {storeTiming?.map((storeTiming) => {
                return (
                  <div
                    key={storeTiming._id}
                    className={
                      storeTiming.isStoreClosed
                        ? "working-time-grid disable-background"
                        : "working-time-grid"
                    }
                  >
                    <div className="working-grid-items">
                      <span>{storeTiming.day}</span>
                    </div>
                    <div className="working-grid-items">
                      {storeTiming.isStoreClosed ? (
                        <button
                          style={{
                            backgroundColor: "rgb(230, 102, 102, 0.3)",
                            color: "rgb(230, 102, 102)",
                          }}
                        >
                          Store Closed
                        </button>
                      ) : (
                        <button>{storeTiming.starttime}</button>
                      )}
                    </div>
                    <div className="working-grid-items">
                      {storeTiming.isStoreClosed ? (
                        <button
                          style={{
                            backgroundColor: "rgb(230, 102, 102, 0.3)",
                            color: "rgb(230, 102, 102)",
                          }}
                        >
                          Store Closed
                        </button>
                      ) : (
                        <button>{storeTiming.endtime}</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {key === "tax" && (
          <div className="setting-sub-grid-items right-sapce-setting">
            <div className="salon-data">
              <p>TAX</p>
            </div>
            {taxDetails?.gstCharge ? (
              <>
                <div className="charge-text-alignment setting-tax-box-align">
                  <p>Charge TAX</p>
                  {taxDetails?.gstCharge === true ? (
                    <button>Enabled</button>
                  ) : (
                    <button
                      style={{
                        color: "rgb(230, 102, 102)",
                        backgroundColor: "rgb(230, 102, 102, 0.3)",
                      }}
                    >
                      Disabled
                    </button>
                  )}
                </div>
                {taxDetails?.gstCharge && (
                  <div className="setting-gst-number">
                    <p>GST Number</p>
                    <span>{taxDetails?.gstNumber}</span>
                  </div>
                )}
                <div className="charge-text-alignment top-setting-tab-align setting-tax-box-align">
                  <p>TAX Type</p>
                </div>

                <div className="setting-gst-number setting-tax-box-align">
                  <p>Type</p>
                  <span>{taxDetails?.gstType}</span>
                </div>

                <div className="charge-text-alignment top-setting-tab-align setting-tax-box-align">
                  <p>Service TAX</p>
                  {taxDetails?.serviceTax === true ? (
                    <button>Enabled</button>
                  ) : (
                    <button
                      style={{
                        color: "rgb(230, 102, 102)",
                        backgroundColor: "rgb(230, 102, 102, 0.3)",
                      }}
                    >
                      Disabled
                    </button>
                  )}
                </div>
                {taxDetails?.serviceTax && (
                  <div className="setting-gst-number setting-tax-box-align">
                    <p>Tax %</p>
                    <span>{taxDetails?.serviceTaxPer}</span>
                  </div>
                )}
                <div className="charge-text-alignment top-setting-tab-align setting-tax-box-align">
                  <p>Product TAX</p>
                  {taxDetails?.productTax === true ? (
                    <button>Enabled</button>
                  ) : (
                    <button
                      style={{
                        color: "rgb(230, 102, 102)",
                        backgroundColor: "rgb(230, 102, 102, 0.3)",
                      }}
                    >
                      Disabled
                    </button>
                  )}
                </div>
                {taxDetails?.productTax && (
                  <div className="setting-gst-number setting-tax-box-align">
                    <p>Tax %</p>
                    <span>
                      {taxDetails?.productTaxPer?.length > 0 &&
                        taxDetails?.productTaxPer?.reduce((prev, curr) => [
                          prev,
                          ", ",
                          curr,
                        ])}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="p-5 pb-3 text-center font-medium">
                Enable Tax by clicking on Edit icon
              </div>
            )}
          </div>
        )}
           {changePasswordModal && (
          <>
            <div className="change-password-blur"></div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="sub-modal-main"
            >
              <div className="change-password-modal-alignment">
                <div className="close-button-right-alignment">
                  <div onClick={() => setChangePasswordModal(false)}>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.25 1.25L11.75 11.75"
                        stroke="#193566"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                      <path
                        d="M1.25 11.75L11.75 1.25"
                        stroke="#193566"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="modal-content-style">
                  <h2>Enter OTP</h2>
                  <p>
                    Mobile number verification is required for changing the
                    account password
                  </p>
                  <h4>
                    4-digit code has been sent to <br /> <span>{mobile} </span>
                  </h4>
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
                  <div className="continue-button-style">
                    {otp.length !== 4 ? (
                      <button
                        style={{
                          background: "#abc9fb",
                          cursor: "not-allowed",
                        }}
                      >
                        Continue
                      </button>
                    ) : (
                      <button onClick={(e) => handleOnClick(e, "submitOtp")}>
                        Continue
                      </button>
                    )}
                  </div>
                  <h6>
                    Dind’t get one?{" "}
                    <a onClick={(e) => handleOnClick(e, "resendOtp")}>
                      RESEND CODE
                    </a>
                  </h6>
                </div>
              </div>
            </motion.div>
          </>
        )}
 {reenter && (
        <div className="cus-modal">
          <div className="modal-header">
            <div className="container-long">
              {/* modal header */}
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div
                    className="modal-close"
                    onClick={() => setReenter(false)}
                  >
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div className="modal-title">
                    <h2>Change password</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="modal-body-top-align">
                <div className="generate-box-center">
                  <div className="reenter-password-box">
                    <div className="box-header-style">
                      <p>
                        Your new password must be different from previous used
                        passwords
                      </p>
                    </div>
                    <div className="password-input-alignment-modal-box">
                      <div className="change-password-input">
                        <label>Enter new password</label>
                        <div className="relative-div">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={passwordone}
                            onChange={(e) => setPasswordone(e.target.value)}
                          />
                          <div className="icon-alignment">
                            {/* <svg
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
                      </svg> */}
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
                      <div className="change-password-input">
                        <label>Re-enter new password</label>
                        <div className="relative-div">
                          <input
                            type={reshowConfirmPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={passwordtwo}
                            onChange={(e) => setPasswordtwo(e.target.value)}
                          />
                          <div className="icon-alignment">
                            {/* <svg
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
                      </svg> */}
                            <div className="hide-icon-alignment">
                              <img
                                src={
                                  reshowConfirmPassword ? HideIcon : ShowIcon
                                }
                                alt="HideIcon"
                                height="21"
                                width="21"
                                onClick={(e) =>
                                  setReshowConfirmPassword(
                                    !reshowConfirmPassword
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="password-input-modal-footer-alignment">
                      {passwordone != passwordtwo ||
                      passwordone === "" ||
                      passwordtwo === "" ? (
                        <button
                          className="reset-button"
                          style={{
                            background: "#abc9fb",
                            cursor: "not-allowed",
                          }}
                        >
                          Reset password
                        </button>
                      ) : (
                        <button
                          className="reset-button"
                          onClick={() => handleResetingPassword()}
                        >
                          Reset password
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      

        {deleteModal && (
          <Delete
            modal={deleteModal}
            toggle={deleteModaltoggle}
            handleLogOut={logout}
          />
        )}

        {profileModal && (
          <EditProfileModal
            modal={profileModal}
            toggle={profileEditModaltoggle}
            editProfileData={editProfileData}
          />
        )}

        {workingHoursModal && (
          <EditWorkingHoursModal
            modal={workingHoursModal}
            toggle={workingHoursEditModaltoggle}
            storeTiming={storeTiming}
            workingDay={workingDays}
            workday={workday}
          />
        )}

        {taxDetailsModal && (
          <EditTaxDetailsModal
            modal={taxDetailsModal}
            toggle={taxDetailsEditModaltoggle}
            editTaxDetails={editTaxDetails}
          />
        )}

       
       
        {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
      </div>
      {/* {changePassword && <ChangePassword />}
       {modalChangePassword && <ReenterChangePassword />} */}
    
    </>
  );
}
