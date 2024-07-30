import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'

import Auth from "../../../helpers/Auth";
import { ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Delete from "../Toaster/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnboardingCurrentTooltip,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../../redux/actions/onboardingActions";
import { Link } from "react-router-dom";
import * as userUtil from "../../../utils/user.util";

export default function EditProfileModal(props) {
  const userInfo = Auth.getUserDetail();

  const dispatch = useDispatch();
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

  const { editProfileData } = props;

  const [disabled, setDisabled] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: "",
    Name: "",
    salonManager: "",
    email: "",
    mobileNumber: "",
    address: "",
  });
  
  const goNext = async () => {
    const body = Object.assign(profileData, {
      companyId: userInfo.companyId,
      isActive: true,
    });
    await ApiPut("account/" + userInfo._id, body);
    dispatch(setOnboardingCurrentTooltip("B2 with toast"));

    let onboardingProfileData = {
      companyId: userInfo?.companyId,
      onboardProcess: [
        {
          onboardingStatus: true,
          onboardingCompleted: false,
          onboardingTourProgress: 50,
          onboardingProfileUpdated: false,
        },
      ],
    };
    await ApiPost("setting/", onboardingProfileData)
      .then((res) => {
        dispatch(setOnboardingTourStatus(true));
        dispatch(setOnboardingTooltipStatus(true));
        dispatch(setOnboardingTourProgress(50));
      })
      .catch((err) => console.log(err));

    setTimeout(() => {
      dispatch(setOnboardingTooltipStatus(true));
    }, 500);
  };

  const handleCloseTour = () => {
    dispatch(setOnboardingTourStatus(false));
    dispatch(setOnboardingTooltipStatus(false));
    dispatch(setOnboardingCurrentTooltip(""));
  };

  // --------------------

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
  };

  const handleOnChange = (e) => {
    setDisabled(true);
    let { name, value } = e.target;
    setProfileData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onSubmit = async (e) => {
    const body = Object.assign(profileData, {
      companyId: userInfo.companyId,
      isActive: true,
    });
    let res = await ApiPut("account/" + editProfileData._id, body);
    try {
   
      props.toggle(res.data.status);
      userUtil.setUserInfo(body);
      if (
        storeOnboardingTourProgress === 33 &&
        profileData.email !== "" &&
        profileData.mobileNumber !== "" &&
        profileData.businessName !== "" &&
        profileData.address !== "" &&
        profileData.nameOfSalonOwner !== "" 
      ) {
        let onboardingProfileData = {
          companyId: userInfo?.companyId,
          onboardProcess: [
            {
              onboardingStatus: false,
              onboardingCompleted: false,
              onboardingTourProgress: 50,
              onboardingProfileUpdated: false,
            },
          ],
        };
        await ApiPost("setting/", onboardingProfileData)
          .then((res) => {
            // dispatch(setOnboardingTourStatus(false));
            // dispatch(setOnboardingTooltipStatus(false));
            dispatch(setOnboardingTourProgress(50));
          })
          .catch((err) => console.log(err));

        setTimeout(() => {
          // dispatch(setOnboardingTooltipStatus(false));
        }, 500);
      }
    } catch (er) {
      props.toggle(er);
    }
  };

  useEffect(() => {
    if (editProfileData) {
      if (storeOnboardingCurrentTooltip === "B1") {
        setProfileData({
          businessName: userInfo.businessName,
          email: userInfo.email,
          mobileNumber: userInfo.mobileNumber,
          salonManager: userInfo.salonManager,
          nameOfSalonOwner: userInfo.nameOfSalonOwner,
          address: userInfo.address,
        });
      } else {
        setProfileData(editProfileData);
      }
    } else {
      setProfileData();
    }
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
       className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {deleteModal && (
              <Delete
                modal={deleteModal}
                toggle={deleteModaltoggle}
                editProfileData={disabled}
                handleOnSubmit={onSubmit}
              />
            )}
            {/* modal header */}
            <div className="modal-header-alignment">
              <div
                className="modal-heading-title"
                // style={{
                //   pointerEvents:
                //     storeOnboardingTourStatus && storeOnboardingCurrentTooltip === "B1" && "none",
                // }}
              >
                <div
                  onClick={() => {
                    props.toggle();
                    handleCloseTour();
                  }}
                  className="modal-close"
                >
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Setup - Profile</h2>
                </div>
              </div>
              <div className="modal-button">
                {storeOnboardingTourStatus ? (
                  <button disabled={!disabled} onClick={goNext}>
                    Next
                  </button>
                ) : disabled ? (
                  <button onClick={(e) => opendeleteModal()}>Save</button>
                ) : (
                  <button disabled>Save</button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center relative">
                {/* setting profile tooltip */}
                {storeOnboardingTourStatus &&
                  storeOnboardingTooltipStatus &&
                  storeOnboardingCurrentTooltip === "B1" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                    
                    className="setting-profile-tooltip">
                      <div className="setup-profile-tooltip-design">
                        <h3>Business profile</h3>
                        <p>
                          Enter necessary details. This data will show to
                          customer’s profile so seriously fill it up, dont joke
                          around You can always change it later in the settings
                        </p>
                        <div className="button-alignment">
                          <div>
                            <Link to="/barberatasklist">
                              <span
                                onClick={(e) => {
                                  dispatch(setOnboardingTourStatus(false));
                                  dispatch(setOnboardingTooltipStatus(false));
                                  dispatch(setOnboardingCurrentTooltip(""));
                                }}
                              >
                                Close Tour
                              </span>
                            </Link>
                          </div>
                          <div>
                            <button
                              onClick={(e) =>
                                dispatch(setOnboardingTooltipStatus(false))
                              }
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                        <div className="tooltip-dot-design">
                          <div className="zoom-dot"></div>
                          <div></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                {/* setting profile tooltip */}
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Business info</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-group customer-form-group-align">
                      <label>Business name</label>
                      <input
                        type="text"
                        name="businessName"
                        placeholder="Enter business name"
                        value={profileData.businessName}
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                    <div className="form-group customer-form-group-align">
                      <label>Contact number</label>
                      <input
                        type="number"
                        name="mobileNumber"
                        placeholder="+91"
                        value={profileData.mobileNumber}
                        readOnly
                        // onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                    <div className="form-group customer-form-group-align">
                      <label>Email</label>
                      {userInfo.email !== "" ? (
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={profileData.email}
                          readOnly
                          // onChange={(e) => handleOnChange(e)}
                        />
                      ) : (
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={profileData.email}
                          onChange={(e) => handleOnChange(e)}
                        />
                      )}
                    </div>
                    <div className="form-group customer-form-group-align">
                      <label>Owner name</label>
                      <input
                        type="text"
                        name="nameOfSalonOwner"
                        placeholder="Enter owner name"
                        value={profileData.nameOfSalonOwner}
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                    {/* <div className="form-group customer-form-group-align">
                      <label>Operator name</label>
                      <input
                        type="text"
                        name="salonManager"
                        placeholder="Enter operator name"
                        value={profileData.salonManager}
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div> */}
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        name="address"
                        value={profileData.address}
                        placeholder="Enter address"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
