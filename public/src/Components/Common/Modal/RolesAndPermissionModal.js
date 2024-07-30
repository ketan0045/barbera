import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import HideIcon from "../../../assets/svg/hide.svg";
import ShowIcon from "../../../assets/svg/eye.svg";
import OwnerImage from "../../../assets/img/Owner Illustration.png";
import OperatorImage from "../../../assets/img/Operator Illustration.png";
import OTPModal from "./RolesAndPermissionChildModal/OTPModal";
import Delete from "../Toaster/Delete";
import firebase from "../../../firebase";
import Auth from "../../../helpers/Auth";
import { useSelector } from "react-redux";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Success from "../Toaster/Success/Success";
import axios from "axios";

export default function RolesAndPermissionModal(props) {
  const {
    saloonDetail,
    toggle,
    firstTimeSetup,
    setFirstTimeSetup,
    companyOwnersAccounts,
    setCompanyOwnersAccounts,
    companyOperatorsAccounts,
    setCompanyOperatorsAccounts,
    page,
    setPage,
    setKey,
    allStaff,
    getAllStaff,
    operatorData,
    setDidOperatorUpdate,
  } = props;

  const userInfo = Auth.getUserDetail();
  const [isFirstMobileAssigned, setisFirstMobileAssigned] = useState(!firstTimeSetup);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectFromStaffModal, setSelectFromStaffModal] = useState(false);
  const [invalidInputs, setInvalidInputs] = useState(true);
  const [selectStaffForOperator, setSelectStaffForOperator] = useState([]);
  const [temStaffId, setTemStaffId] = useState();
  const [loading, setLoading] = useState(false);
  const [sendOTPSuccess, setSendOTPSuccess] = useState(false);
  const [otpConfirmation, setOtpConfirmation] = useState(false);
  const [countDown, setCountDown] = useState(10);
  // console.log("operatorPermissions", operatorPermissions);
  const [ownerProfile, setOwnerProfile] = useState({
    fullName: "",
    contactInfo: "",
    password: "",
    confirmPassword: "",
    role: "Owner",
  });
  const [operatorProfile, setOperatorProfile] = useState({
    fullName: "",
    contactInfo: "",
    password: "",
    confirmPassword: "",
    role: "Operator",
    permission: [],
  });


  // ------------ counter for send otp button ---------------------

  useEffect(() => {
    if (countDown === 0) {
      setLoading(false);
      setCountDown(10);
      setInvalidInputs(false);
    } else if (loading) {
      setTimeout(() => setCountDown(countDown - 1), 1000);
    }
  }, [countDown, loading]);

  //  ------------------------------------------------------------

  // ----------------------- otp confirmed -----------------------
  // -------------------------------------------------------------
  useEffect(() => {
    if (otpConfirmation) {
      setSuccess(true);
      setToastmsg("OTP confirmation successfull");
    }
  }, [otpConfirmation]);

  const [otpModal, setOtpModal] = useState(false);
  const otpModalToggle = async (e, data, subData, msg) => {
    setOtpModal(!otpModal);
    if (data) {
      if (data === "EditOperator") {
        setPage("Operator");
      } else if (data === "Operator_accounts") {
        setPage("Operator_accounts");
        setFirstTimeSetup(false);
      } else if (data === "Owner_accounts") {
        if (subData === "firstOwner") {
          setPage("Owner_accounts");
        } else {
          setPage("Owner_accounts");
          setFirstTimeSetup(false);
        }
      }
    }
    if (otpModal === true) {
      if (msg) {
        setSuccess(true);
        setToastmsg(msg);
      }
    }
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
  };

  const inputBinder = (value, key) => {
    if (key === "fullName") {
      var regex = new RegExp("^[^a-zA-Z0-9 ]*$");
      var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
      if (regex.test(key)) {
        value.preventDefault();
        return false;
      }
    } else if (key === "contactInfo") {
      var regex = new RegExp("^[^0-9]*$");
      var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
      if (regex.test(key)) {
        value.preventDefault();
        return false;
      }
    }
  };

  const handleOnChange = async (e) => {
    let { name, value } = e.target;
    if (page === "Owner") {
      setOwnerProfile((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    } else if (page === "Operator") {
      setOperatorProfile((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
    // validateInputs()
  };

  const handleOnSave = () => {
    setFirstTimeSetup(false);
    toggle();
  };

  useEffect(() => {
    if (page === "Owner" || page === "Operator") {
      validateInputs();
    }
  }, [ownerProfile, operatorProfile, page]);

  const validateInputs = () => {
    if (page === "Owner") {
      const inputsNotValid =
        !ownerProfile?.fullName ||
        !ownerProfile?.contactInfo ||
        !ownerProfile?.password ||
        !ownerProfile?.confirmPassword ||
        ownerProfile?.password !== ownerProfile?.confirmPassword ||
        (isFirstMobileAssigned && ownerProfile?.contactInfo === userInfo?.mobileNumber);
      setInvalidInputs(inputsNotValid);
    } else if (page === "Operator") {
      const inputsNotValid =
        !operatorProfile?.fullName ||
        !operatorProfile?.contactInfo ||
        !operatorProfile?.password ||
        !operatorProfile?.confirmPassword ||
        operatorProfile?.password !== operatorProfile?.confirmPassword ||
        (isFirstMobileAssigned && operatorProfile?.contactInfo === userInfo?.mobileNumber);
      setInvalidInputs(inputsNotValid);
    }
  };

  const handleOnClick = (e, key, subkey) => {
    //firstTimeSetup ? setPage("noOwnerAddedSoFar") : handleOnSendOtp(e, key)
    setPage(key);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ---------------------------------------------- firebase OTP functionality start ------------------------------------------------

  // const configureCaptcha = () => {
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  //     "get-otp-button",
  //     {
  //       size: "invisible",
  //       callback: (response) => {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //         handleOnSendOtp();
  //         console.log("Recaptca varified");
  //       },
  //       defaultCountry: "IN",
  //     }
  //   );
  // };

  // const handleOnSendOtp = (e, key) => {
  //   // setLoading(true)
  //   e.preventDefault();
  //   setLoading(true);
  //   configureCaptcha();
  //   console.log("send Otp called");
  //   // setPage('Send_otp');
  //   const phoneNumber =
  //     page === "Owner"
  //       ? "+91" + ownerProfile.contactInfo
  //       : "+91" + operatorProfile.contactInfo;
  //   const appVerifier = window.recaptchaVerifier;
  //   firebase
  //     .auth()
  //     .signInWithPhoneNumber(phoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       // setLoading(false)
  //       window.confirmationResult = confirmationResult;
  //       console.log("OTP has been sent");
  //       setOtpModal(true);
  //       setLoading(false)
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Error; SMS not sent
  //       // ...
  //       console.log("SMS not sent");
  //       window.alert("something went wrong");
  //       setOtpModal(true);
  //       setLoading(false)
  //     });
  // };

  // ---------------------------------------------- firebase OTP functionality end ------------------------------------------------

  const handleOnSendOtp = async () => {
    setCountDown(10);
    setLoading(true);
    setInvalidInputs(true);

    const phoneNumber =
      page === "Owner"
        ? { mobile: "91" + ownerProfile.contactInfo }
        : { mobile: "91" + operatorProfile.contactInfo };
    let resp = await ApiPost("invoice/sendSMS", phoneNumber);
    try {
      if (resp.data.status === 200) {
        setInvalidInputs(false);
        setSendOTPSuccess(true);
        setOtpModal(true);
        setCountDown(10);
        setLoading(false);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------------------------------------- old OTP functionality start ------------------------------------------------

  // const handleOnSendOtp = () => {
  // setInvalidInputs(true);
  // const phoneNumber =
  //   page === "Owner"
  //     ? "91" + ownerProfile.contactInfo
  //     : "91" + operatorProfile.contactInfo;

  // axios
  //   .get(
  //     `https://api.msg91.com/api/v5/otp?template_id=62553c14af7d522e9b410205&mobile=${phoneNumber}&authkey=375604AwGeIE6alcKc62552145P1`
  //   )
  //   .then((res) => {
  //     // if (res.type === "success") {
  //     setInvalidInputs(false);
  //     // }
  //   })
  //   .catch((er) => {
  //     console.log(er);
  //   });
  // setOtpModal(true);

  // var config = {
  //   method: 'get',
  //   url: `https://api.msg91.com/api/v5/otp?template_id=62553c14af7d522e9b410205&mobile=${phoneNumber}&authkey=375604AwGeIE6alcKc62552145P1`,
  //   headers: {
  //     'Cookie': 'PHPSESSID=4bljs3luuma3oa8cvp3ec66f85'
  //   }
  // };

  // axios(config)
  // .then(function (response) {
  //   console.log(JSON.stringify(response.data));
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });

  // };

  // ---------------------------------------------- old OTP functionality end ------------------------------------------------

  const reduxOpertaorPermissions = useSelector((state) => state.operatorPermissions);

  useEffect(() => {
    if (props.role) {
      setPage(props.role);
      if (props.role === "EditOperator") {
        setPage("Operator");
        setOperatorProfile({
          ...operatorProfile,
          fullName: operatorData?.Name,
          contactInfo: operatorData?.mobileNumber,
          password: operatorData?.password,
          confirmPassword: operatorData?.password,
        });
      }
    }
    
    if (firstTimeSetup) {
      setOwnerProfile({ ...ownerProfile, contactInfo: userInfo.mobileNumber ,fullName:userInfo?.nameOfSalonOwner});
      setOperatorProfile({
        ...operatorProfile,
        contactInfo: userInfo.mobileNumber,
      });
    }
  }, []);

  const handleAddOperatorFromStaff = (e, temUser) => {
    setTemStaffId(temUser._id);
    setSelectStaffForOperator({
      role: "Operator",
      Name: temUser.firstName,
      password: 1234,
      mobileNumber: temUser.mobileNumber,
      permission: reduxOpertaorPermissions,
      businessName: userInfo.businessName,
      email: temUser?.email,
      address: userInfo.address,
      city: userInfo.city,
      salonManager: userInfo.salonManager,
      nameOfSalonOwner: userInfo.nameOfSalonOwner,
      companyId: userInfo.companyId,
    });
  };

  const addOperatorFromStaff = async (e) => {
    let res = await ApiPost("account/", selectStaffForOperator);
    try {
      if (res.data.status === 200) {
        ApiPut(`staff/${temStaffId}`, { loginas: "Operator" });
        setSuccess(true);
        setToastmsg("New Operator added!");
        setPage("Operator_accounts");
        getAcDetails();
        getAllStaff();
        setTemStaffId();
        setSelectFromStaffModal(false);
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg(res.data.message);
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Something Went Wrong!");
    }
  };
  const getAcDetails = async () => {
    let resp = await ApiGet("account/company/companyData/" + userInfo.companyId);
    try {
      if (resp.data.status === 200) {
        let activeAccounts = await resp.data.data.filter((account) => account.isActive);
        let availableOwners = await activeAccounts.filter((account) => {
          return account.role.toLowerCase() === "owner" && account;
        });
        setCompanyOwnersAccounts(availableOwners);
        let availableOperators = await activeAccounts.filter((account) => {
          return account.role.toLowerCase() === "operator" && account;
        });
        setCompanyOperatorsAccounts(availableOperators);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log(err);
    }
  };

  

  // console.log("props.firstTimeSetup-R&Pmodal", props.firstTimeSetup);

  // const operatorAccountsPage = () => {
  //   if (companyOperatorsAccounts?.length > 0) {
  //     companyOperatorsAccounts.map((operator) => {
  //       return (
  //         <div className="name-number-grid">
  //           <div className="name-number-grid-items">
  //             <p>{operator.Name}</p>
  //           </div>
  //           <div className="name-number-grid-items">
  //             <p>{operator.mobileNumber}</p>
  //           </div>
  //         </div>
  //       );
  //     });
  //   } else {
  //     return (
  //       <div className="name-number-grid">
  //         <div className="name-number-grid-items">
  //           <p>{operatorProfile?.fullName}</p>
  //         </div>
  //         <div className="name-number-grid-items">
  //           <p>{operatorProfile?.contactInfo}</p>
  //         </div>
  //       </div>
  //     );
  //   }
  // };



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
        <div className="cus-modal">
          <div className="modal-header">
            <div className="container-long">
              {/* modal header */}
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div
                    onClick={() => {
                      setPage("");
                      !isFirstMobileAssigned && setKey("general");
                      props.toggle();
                    }}
                    className="modal-close"
                  >
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div className="modal-title">
                    <h2>
                      {props.role === "EditOperator"
                        ? `Edit operator account`
                        : `Setup roles & permissions`}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* permissions-modal-body */}
          <div className="permissions-modal-body">
            <div className="container">
              <div className="modal-body-top-align">
                <div className="permissions-box-center">
                  <div className="permissions-startup-child-box">
                    {page === "Base" && (
                      <div>
                        <div className="permissions-title-alignment">
                          <p>
                            What role would you like to assign to <span style={{ fontWeight:"600"}}>+91 {saloonDetail?.mobileNumber}</span>
                          </p>
                        </div>
                        <div className="permissions-assign-box-alignment">
                          <div
                            className="assign-box-design"
                            onClick={(e) => handleOnClick(e, "Owner")}
                          >
                            <div className="image-center-alignment">
                              <img src={OwnerImage} alt="OwnerImage" />
                            </div>
                            <div className="box-related-text">
                              <p>Owner</p>
                              <span>
                                A business owner is the legal proprietor of a business. Responsible
                                for the business
                              </span>
                            </div>
                          </div>
                          <div
                            className="assign-box-design"
                            onClick={(e) => handleOnClick(e, "Operator")}
                          >
                            <div className="image-center-alignment">
                              <img src={OperatorImage} alt="OperatorImage" />
                            </div>
                            <div className="box-related-text">
                              <p>Operator</p>
                              <span>
                                A business owner is the legal proprietor of a business. Responsible
                                for the business
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {page === "Owner" && (
                      <div>
                        <div className="owner-details-modal">
                          <div className="owner-details-title">
                            <p>Owner details</p>
                          </div>
                          <div className="owner-details-modal-body">
                            {/* {loading ? (
                              <div className="owner-details-modal-body-left-right-align">
                              Loading....
                              </div>
                            ) : ( */}
                            {!loading ? (
                              <div className="owner-details-modal-body-left-right-align">
                                <div className="form-group">
                                  <label>Full name</label>
                                  <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter full name"
                                    value={ownerProfile?.fullName.replace(/^(.)|\s+(.)/g, (c) =>
                                      c.toUpperCase()
                                    )}
                                    onChange={(e) => handleOnChange(e)}
                                    maxLength={30}
                                    onKeyPress={(value) => inputBinder(value, "fullName")}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>
                                    Contact number
                                    {isFirstMobileAssigned &&
                                      ownerProfile?.contactInfo === userInfo?.mobileNumber && (
                                        <span style={{ color: "red" , fontSize:"10px"}}>
                                          {" "}
                                          *this number is already assigned
                                        </span>
                                      )}
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={10}
                                    name="contactInfo"
                                    placeholder="Enter contact number"
                                    value={ownerProfile?.contactInfo.toLowerCase()}
                                    onChange={(e) => handleOnChange(e)}
                                    onKeyPress={(value) => inputBinder(value, "contactInfo")}
                                    disabled={!isFirstMobileAssigned}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Enter new password</label>
                                  <div className="form-input-relative">
                                    <input
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      // placeholder="Enter new password"
                                      value={ownerProfile?.password}
                                      onChange={(e) => handleOnChange(e)}
                                    />
                                    <div className="hide-icon-alignment">
                                      <img
                                        src={showPassword ? HideIcon : ShowIcon}
                                        alt="HideIcon"
                                        height="21"
                                        width="21"
                                        onClick={(e) => setShowPassword(!showPassword)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Re-enter new password</label>
                                  <div className="form-input-relative">
                                    <input
                                      type={showConfirmPassword ? "text" : "password"}
                                      name="confirmPassword"
                                      // placeholder="Confirm password"
                                      value={ownerProfile?.confirmPassword}
                                      onChange={(e) => handleOnChange(e)}
                                    />
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
                            ) : (
                              <div className="double-spinner-alignment">
                                <div className="dbl-spinner"></div>
                                <div className="dbl-spinner dbl-spinner--2"></div>
                              </div>
                            )}
                          </div>

                          <div className="owner-details-modal-footer permissions-footer-button">
                            <button
                              id="get-otp-button"
                              onClick={
                                (e) => handleOnSendOtp(e, "Owner")
                                // handleOnClick(e, "Send_otp", "Owner")
                                // sendOtpFunction(e, "owner")
                              }
                              disabled={invalidInputs || loading}
                            >
                              Get OTP {loading && ` ${countDown}s`}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {page === "Operator" && (
                      <div>
                        <div className="owner-details-modal">
                          <div className="owner-details-title">
                            <p>Operator details</p>
                          </div>
                          <div className="owner-details-modal-body">
                            {props.role !== "EditOperator" && (
                              <div
                                className="opreator-staff-alignment-text"
                                onClick={(e) => setSelectFromStaffModal(true)}
                              >
                                <p>Select from the staff list</p>
                              </div>
                            )}
                            {!loading ? (
                              <div className="owner-details-modal-body-left-right-align owner-details-modal-body-top-align">
                                <div className="form-group">
                                  <label>Full name</label>
                                  <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter full name"
                                    value={operatorProfile?.fullName.replace(/^(.)|\s+(.)/g, (c) =>
                                      c.toUpperCase()
                                    )}
                                    onChange={(e) => handleOnChange(e)}
                                    maxLength={30}
                                    onKeyPress={(value) => inputBinder(value, "fullName")}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>
                                    Contact number{" "}
                                    {isFirstMobileAssigned &&
                                      operatorProfile?.contactInfo === userInfo?.mobileNumber && (
                                        <span style={{ color: "red", fontSize:"10px" }}>
                                          {" "}
                                          *this number is already assigned
                                        </span>
                                      )}
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={10}
                                    name="contactInfo"
                                    placeholder="Enter contact number"
                                    value={operatorProfile?.contactInfo.toLowerCase()}
                                    onChange={(e) => handleOnChange(e)}
                                    onKeyPress={(value) => inputBinder(value, "contactInfo")}
                                    disabled={!isFirstMobileAssigned}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Enter new password</label>
                                  <div className="form-input-relative">
                                    <input
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      // placeholder="Enter new password"
                                      value={operatorProfile?.password}
                                      onChange={(e) => handleOnChange(e)}
                                    />
                                    <div className="hide-icon-alignment">
                                      <img
                                        src={showPassword ? HideIcon : ShowIcon}
                                        alt="HideIcon"
                                        height="21"
                                        width="21"
                                        onClick={(e) => setShowPassword(!showPassword)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Re-enter new password</label>
                                  <div className="form-input-relative">
                                    <input
                                      type={showConfirmPassword ? "text" : "password"}
                                      name="confirmPassword"
                                      // placeholder="Confirm password"
                                      value={operatorProfile?.confirmPassword}
                                      onChange={(e) => handleOnChange(e)}
                                    />
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
                            ) : (
                              <div className="double-spinner-alignment">
                                <div className="dbl-spinner"></div>
                                <div className="dbl-spinner dbl-spinner--2"></div>
                              </div>
                            )}
                          </div>
                          <div className="owner-details-modal-footer permissions-footer-button">
                            {props.role === "EditOperator" ? (
                              <button onClick={(e) => deleteModaltoggle(e)}>Save changes</button>
                            ) : (
                              <button
                                id="get-otp-button"
                                onClick={
                                  (e) => handleOnSendOtp(e, "Operator")
                                  // props.firstTimeSetup
                                  //   ? setPage("Operator_accounts")
                                  //   : handleOnSendOtp(e, "Operator")
                                  // handleOnClick(e, "Send_otp", "Operator")
                                }
                                disabled={invalidInputs}
                              >
                                Get OTP
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {page === "Owner_accounts" && (
                      <div>
                        <div className="owner-accounts-modal">
                          <div className="owner-accounts-title">
                            <p style={{ fontWeight:"600"}}>Owner accounts</p>
                            <span onClick={(e) => handleOnClick(e, "Owner")}>Add more</span>
                          </div>
                          <div className="owner-accounts-modal-body">
                            <div className="owner-accounts-modal-body-left-right-align">
                              {/* <div className="name-number-grid">
                              <div className="name-number-grid-items">
                                <p>Jethalal Gada</p>
                              </div>
                              <div className="name-number-grid-items">
                                <p>+91 12345 67890</p>
                              </div>
                            </div> */}
                              {companyOwnersAccounts?.length === 0 ? (
                                <div
                                  className="owner-accounts-modal-body-left-right-align"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: "50%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#97A7C3",
                                    }}
                                  >
                                    <div>
                                      <svg
                                        width="41"
                                        height="30"
                                        viewBox="0 0 41 30"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M25.5 26.25V23.75C25.5 22.4239 24.9732 21.1521 24.0355 20.2145C23.0979 19.2768 21.8261 18.75 20.5 18.75H10.5C9.17392 18.75 7.90215 19.2768 6.96447 20.2145C6.02678 21.1521 5.5 22.4239 5.5 23.75V26.25"
                                          stroke="#97A7C3"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M15.5 13.75C18.2614 13.75 20.5 11.5114 20.5 8.75C20.5 5.98858 18.2614 3.75 15.5 3.75C12.7386 3.75 10.5 5.98858 10.5 8.75C10.5 11.5114 12.7386 13.75 15.5 13.75Z"
                                          stroke="#97A7C3"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                        <path
                                          d="M31.5 10.5V19.5M27 15H36"
                                          stroke="#97A7C3"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <p
                                      style={{
                                        fontWeight: "500",
                                        fontSize: "12px",
                                        lineHeight: "18px",
                                        margin: "7px",
                                      }}
                                    >
                                      No owners added so far
                                    </p>
                                    <p
                                      style={{
                                        fontWeight: "500",
                                        fontSize: "10px",
                                        lineHeight: "15px",
                                        textAlign: "center",
                                      }}
                                    >
                                      Note: There must be atleast one owner account <br /> to manage
                                      all the system features
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                companyOwnersAccounts?.map((owner) => {
                                  return (
                                    <div className="name-number-alignment-all">
                                    <div className="name-number-grid">
                                      <div className="name-number-grid-items">
                                        <p>{owner.Name}</p>
                                      </div>
                                      <div className="name-number-grid-items">
                                        <p>+91 {owner.mobileNumber}</p>
                                      </div>
                                    </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                          <div className="permissions-footer-button">
                            <button
                              //   onClick={(e) =>
                              //     handleOnClick(e, "Operator_accounts")
                              //   }
                              disabled={companyOwnersAccounts?.length === 0}
                              // >
                              //   Continue
                              onClick={(e) =>
                                companyOwnersAccounts?.length === 0 ||
                                companyOperatorsAccounts?.length === 0
                                  ? setPage("Operator_accounts")
                                  : handleOnSave()
                              }
                            >
                              {companyOwnersAccounts?.length === 0 ||
                              companyOperatorsAccounts?.length === 0
                                ? "Continue"
                                : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {page === "Operator_accounts" && (
                      <div>
                        <div className="owner-accounts-modal">
                          <div className="owner-accounts-title">
                            <p style={{ fontWeight:"600"}}>Operator accounts</p>
                            <span onClick={(e) => handleOnClick(e, "Operator")}>Add more</span>
                          </div>
                          <div className="owner-accounts-modal-body">
                            <div
                              className="select-from-the-staff-list select-from-the-staff-list-left-right-align"
                              onClick={(e) => setSelectFromStaffModal(true)}
                            >
                              <p>Select from the staff list</p>
                            </div>
                            <div className="owner-accounts-modal-body-left-right-align">
                              {/* <div className="name-number-grid">
                              <div className="name-number-grid-items">
                                <p>Natukaka</p>
                              </div>
                              <div className="name-number-grid-items">
                                <p>+91 12345 67890</p>
                              </div>
                            </div> */}
                              {companyOperatorsAccounts?.length === 0 ? (
                                <div
                                  className="owner-accounts-modal-body-left-right-align"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#97A7C3",
                                    }}
                                  >
                                    {/* <div>add more icon</div> */}
                                    <p
                                      style={{
                                        fontWeight: "500",
                                        fontSize: "12px",
                                        lineHeight: "18px",
                                      }}
                                    >
                                      No data found
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                companyOperatorsAccounts?.map((operator) => {
                                  return (
                                    <div className="name-number-alignment-all">
                                    <div className="name-number-grid">
                                      <div className="name-number-grid-items">
                                        <p>{operator.Name}</p>
                                      </div>
                                      <div className="name-number-grid-items">
                                        <p>{operator.mobileNumber}</p>
                                      </div>
                                    </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                          <div className="permissions-footer-button">
                            <button
                              onClick={(e) =>
                                companyOwnersAccounts?.length === 0
                                  ? setPage("Owner_accounts")
                                  : handleOnSave()
                              }
                            >
                              {companyOwnersAccounts?.length === 0 ? "Continue" : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
        {otpModal && (
          <OTPModal
            modal={otpModal}
            otpModalToggle={otpModalToggle}
            firstTimeSetup={firstTimeSetup}
            setFirstTimeSetup={setFirstTimeSetup}
            isFirstMobileAssigned={isFirstMobileAssigned}
            setisFirstMobileAssigned={setisFirstMobileAssigned}
            userInProgress={page === "Owner" ? ownerProfile : operatorProfile}
            page={page}
            editOperator={props.role}
            editOperatorData={operatorData}
            setPage={setPage}
            modalClose={props.toggle}
            setOwnerProfile={setOwnerProfile}
            setOperatorProfile={setOperatorProfile}
            setCompanyOwnersAccounts={setCompanyOwnersAccounts}
            setCompanyOperatorsAccounts={setCompanyOperatorsAccounts}
            getAcDetails={getAcDetails}
            setDidOperatorUpdate={setDidOperatorUpdate}
            deleteModaltoggle={deleteModaltoggle}
            sendOTPSuccess={sendOTPSuccess}
            setSendOTPSuccess={setSendOTPSuccess}
            setLoading={setLoading}
          />
        )}
        {deleteModal && (
          <Delete
            modal={deleteModal}
            toggle={deleteModaltoggle}
            otpModalToggle={otpModalToggle}
            mobileNumber={operatorProfile?.contactInfo}
            role={props.role}
            setOtpModal={setOtpModal}
          />
        )}
        {selectFromStaffModal && (
          <>
            {selectFromStaffModal ? <div className="modal-bluer-open"></div> : null}
            <div className="sub-modal-main">
              <div className="sub-modal">
                <div className="sub-modal-header">
                  <div className="header-alignment">
                    <h4>Staff list</h4>
                    <div
                      className="close-button"
                      onClick={() => {
                        setTemStaffId();
                        setSelectStaffForOperator();
                        setSelectFromStaffModal(false);
                      }}
                    >
                      <img src={CloseIcon} alt="CloseIcon" />
                    </div>
                  </div>
                </div>
                <div className="owner-accounts-modal">
                  <div className="owner-accounts-title" />
                  <div className="owner-accounts-modal-body">
                    <div className="owner-accounts-modal-body-left-right-align">
                      {allStaff?.length === 0 ? (
                        <div
                          className="owner-accounts-modal-body-left-right-align"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#97A7C3",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "500",
                                fontSize: "12px",
                                lineHeight: "18px",
                              }}
                            >
                              No data available
                            </p>
                          </div>
                        </div>
                      ) : (
                        allStaff?.map((staff) => {
                          return (
                            <div
                              id={staff?._id}
                              className="name-number-grid"
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  temStaffId === staff?._id && "rgba(20, 121, 255, 0.2)",
                              }}
                              onClick={(e) => handleAddOperatorFromStaff(e, staff)}
                            >
                              <div className="name-number-grid-items">
                                <div className="same-text-style">
                                  <p>{staff.firstName}</p>
                                </div>
                              </div>
                              <div className="name-number-grid-items">
                                <div className="same-text-style">
                                  <p>{staff.mobileNumber}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="permissions-footer-button">
                    <button disabled={!temStaffId} onClick={(e) => addOperatorFromStaff(e)}>
                      Continue
                    </button>
                  </div>
                </div>
                <div className="edit-product-sub-modal"></div>
              </div>
            </div>
          </>
        )}
      </div>
      {success ? <Success modal={success} toastmsg={toastmsg} er={er} /> : null}
    </>
  );
}
