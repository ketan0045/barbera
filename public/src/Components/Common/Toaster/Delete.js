import React, { useState } from "react";
import "./Toaster.scss";
import { ApiGet, ApiPut, ApiPost } from "../../../helpers/API/ApiData";
import DeleteIcon from "../../../assets/svg/white-delete.svg";
import firebase from "../../../firebase";

export default function Delete(props) {
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));

  const {
    deleteProductId,
    toggle,
    toggler,
    getProducts,
    Delete,
    getInvoices,
    deleteBrandId,
    deleteCategoryId,
    getAllBrands,
    getAllCategories,
    setDeleteBrandId,
    setDeleteCategoryId,
    deleteCustomerId,
    deleteStaffId,
    disabledStaff,
    disabledStaffModal,
    disabledCustomer,
    disabledCustomerModal,
    deleteServiceId,
    deleteCategoryWithService,
    editProfileData,
    handleOnSubmit,
    editWorkingHours,
    handleOnUpdate,
    editTaxData,
    handleOnUpdateCall,
    handleLogOut,
    deleteMembershipId,
    getMembershipDetails,
    role,
    flag,
    otpModalToggle,
    deletePaymentMethodId,
    getPaymentMethod,
    setOtpModal,
    mobileNumber,
  } = props;

  const [clicked, setClicked] = useState(false);

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

  // const handleOnSendOtp = (e) => {
  //   e.preventDefault();
  //   setClicked(true);
  //   configureCaptcha();
  //   console.log("send Otp called");
  //   // setPage('Send_otp');
  //   const phoneNumber = `+91${mobileNumber}`;
  //   const appVerifier = window.recaptchaVerifier;
  //   firebase
  //     .auth()
  //     .signInWithPhoneNumber(phoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       window.confirmationResult = confirmationResult;
  //       console.log("OTP has been sent");
  //       setOtpModal(true);
  //       toggle();
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Error; SMS not sent
  //       // ...
  //       console.log("SMS not sent");
  //       window.alert("something went wrong");
  //       setOtpModal(true);
  //     });
  // };

  // ---------------------------------------------- firebase OTP functionality end ------------------------------------------------

  const handleOnSendOtp = async () => {
    setClicked(true);
    const phoneNumber = { mobile: "91" + mobileNumber };

    let resp = await ApiPost("invoice/sendSMS", phoneNumber);
    try {
      if (resp.data.status === 200) {
        setOtpModal(true);
        toggle();
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log(err);
      setOtpModal(true);
    }
  };

  const membershipRemoval = () => {
    ApiPost("customer/membership/edit/" + userInfo.companyId + "/" + deleteMembershipId, {
      isActive: false,
      isExpire: true,
      activeMembership: false,
      membership: false,
      type:"Delete"
    })
      .then((resp) => {
     
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteProduct = () => {
    let finalData = {
      isActive: false,
    };

    Delete?.invoiceId
      ? ApiPut("invoice/" + Delete?._id, finalData)
          .then((res) => {
            toggle(res.data.status);
            getInvoices();
            Delete?.products?.map((product) => {
              const productdata = {
                productId: product.productId,
                retailInitialStock: product.productCount,
                type: "CR",
                companyId: userInfo.companyId,
              };
              ApiPost("stock", productdata)
                .then((resp) => {})
                .catch((er) => {
                  console.log(er);
                });
              return <></>;
            });
          })
          .catch((er) => {
            toggle(er);
          })
      : deleteBrandId
      ? ApiPut("ibrand/" + deleteBrandId, finalData)
          .then((res) => {
            toggle(res.data.status);
            setDeleteBrandId();
            setDeleteCategoryId();
            getAllBrands();
          })
          .catch((er) => {
            toggle(er);
          })
      : deleteCategoryId
      ? ApiPut("icategory/" + deleteCategoryId, finalData)
          .then((res) => {
            toggle(res.data.status);
            setDeleteBrandId();
            setDeleteCategoryId();
            getAllCategories();
          })
          .catch((er) => {
            toggle(er);
          })
      : deleteCustomerId
      ? ApiPut("customer/" + deleteCustomerId, finalData)
          .then((res) => {
            toggle(res.data.status);
          })
          .catch((er) => {
            toggle(er);
          })
      : deleteStaffId
      ? ApiPut("staff/" + deleteStaffId, finalData)
          .then((res) => {
            toggle(res.data.status);
          })
          .catch((er) => {
            toggle(er);
          }) && ApiGet("category/staff/deleteStaff/" + deleteStaffId + "/" + userInfo.companyId)
      : deleteServiceId
      ? ApiPut("service/" + deleteServiceId, finalData)
          .then((res) => {
            toggler(res.data);
            toggle(res);
          })
          .catch((er) => {
            toggle(er);
          })
      : deleteCategoryWithService
      ? ApiPut("category/" + deleteCategoryWithService, finalData)
          .then((res) => {
            toggle(res.data.status);
          })
          .catch((er) => {
            toggle(er);
          })
      : deleteMembershipId
      ? ApiPut("membership/" + deleteMembershipId, finalData)
          .then((res) => {
            membershipRemoval();
            toggle();
            getMembershipDetails();
            toggler(res.data.status);
          })
          .catch((er) => {
            toggle(er);
          })
      : deletePaymentMethodId
      ? ApiPut("payment/" + deletePaymentMethodId, finalData)
          .then((res) => {
            getPaymentMethod();
            toggle(res.data.status);
          })
          .catch((er) => {
            toggle(er);
          })
      : ApiPut("product/" + deleteProductId, finalData)
          .then((res) => {
            toggle(res.data.status);
            if (toggler) {
              toggler(res.data.status);
            }
            getProducts();
          })
          .catch((er) => {
            toggle(er);
          });
  };

  return (
    <>
      <div className="toaster-modal">
        <div
          className={
            props.modal ? "modal-design-toster toster-show" : " modal-design-toster toster-hidden"
          }
        >
          <div className="toster-title">
            {Delete?.invoiceId ? (
              <p>
                Are you sure you want to delete a record of invoice #{Delete.invoiceId} from
                database?
              </p>
            ) : deleteBrandId ? (
              <p>Are you sure you want to delete this brand from database?</p>
            ) : deleteCategoryId ? (
              <p>Are you sure you want to delete this category from database?</p>
            ) : deleteCustomerId ? (
              <p>Are you sure you want to delete this customer?</p>
            ) : deleteStaffId ? (
              <p>Are you sure you want to delete this existing staff?</p>
            ) : disabledStaff ? (
              <p>The staff has not been added. Are you sure you want to discard the saved data?</p>
            ) : disabledCustomer ? (
              <p>
                The customer has not been added. Are you sure you want to discard the saved data?
              </p>
            ) : editProfileData ? (
              <p>Are you sure you want to make these changes?</p>
            ) : editWorkingHours ? (
              <p>Are you sure you want to make these changes?</p>
            ) : editTaxData ? (
              <p>Are you sure you want to make these changes?</p>
            ) : handleLogOut ? (
              <p>Are you sure you want to log out?</p>
            ) : deleteServiceId ? (
              <p>Are you sure you want to delete this service from the database?</p>
            ) : deleteMembershipId ? (
              flag ? (
                <p>Listed members will not be able to redeem discount under this plan</p>
              ) : (
                <p>
                  Deleting membership erase all data of transactions and members from the account.
                </p>
              )
            ) : role ? (
              <p>
                To save the new mobile number for the operator, you'll first have to verify the
                number
              </p>
            ) : deleteCategoryWithService ? (
              <>
                <p>Are you sure you want to delete this category from the database?</p>
                <span>Note: All the assigned services,to this category will get deleted</span>
              </>
            ) : deletePaymentMethodId ? (
              <p>Are you sure you want to delete this payment method from the database?</p>
            ) : (
              <p>Are you sure you want to delete this product from database?</p>
            )}
          </div>
          <div className="toster-footer">
            <button onClick={() => toggle()}>Cancel</button>
            {disabledStaff ? (
              <button onClick={() => disabledStaffModal()}>
                <img src={DeleteIcon} alt="DeleteIcon" />
                <span style={{ paddingLeft: "8px" }}>Discard</span>
              </button>
            ) : disabledCustomer ? (
              <button onClick={() => disabledCustomerModal()}>
                <img src={DeleteIcon} alt="DeleteIcon" />
                <span style={{ paddingLeft: "8px" }}>Discard</span>
              </button>
            ) : editProfileData ? (
              <button style={{ backgroundColor: "#1479FF" }} onClick={() => handleOnSubmit()}>
                <span>Confirm</span>
              </button>
            ) : handleLogOut ? (
              <button onClick={() => handleLogOut()}>
                <span>Logout</span>
              </button>
            ) : editWorkingHours ? (
              <button style={{ backgroundColor: "#1479FF" }} onClick={() => handleOnUpdate()}>
                <span>Confirm</span>
              </button>
            ) : role ? (
              <button
                id="get-otp-button"
                style={{
                  backgroundColor: "#1479FF",
                  pointerEvents: clicked ? "none" : null,
                  opacity: clicked ? "0.5" : "1",
                }}
                onClick={(e) => {
                  // otpModalToggle(e, role);
                  handleOnSendOtp(e);
                }}
              >
                <span>Get OTP</span>
              </button>
            ) : editTaxData ? (
              <button style={{ backgroundColor: "#1479FF" }} onClick={() => handleOnUpdateCall()}>
                <span>Confirm</span>
              </button>
            ) : deleteMembershipId ? (
              flag ? (
                <button onClick={() => deleteProduct()}>
                  <img src={DeleteIcon} alt="DeleteIcon" />
                  <span style={{ paddingLeft: "8px" }}>Delete</span>
                </button>
              ) : (
                <button style={{ backgroundColor: "#1479FF" }} onClick={() => toggle("proceed")}>
                  <span style={{ paddingLeft: "8px" }}>Proceed</span>
                </button>
              )
            ) : deletePaymentMethodId ? (
              <button onClick={() => deleteProduct()}>
                <img src={DeleteIcon} alt="DeleteIcon" />
                <span style={{ paddingLeft: "8px" }}>Delete</span>
              </button>
            ) : (
              <button onClick={() => deleteProduct()}>
                <img src={DeleteIcon} alt="DeleteIcon" />
                <span style={{ paddingLeft: "8px" }}>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
