import React, { useState, useEffect } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import { NavLink } from "react-router-dom";
import * as authUtil from "../../utils/auth.util";
import * as userUtil from "../../utils/user.util";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ApiGet, ApiPost } from "../../helpers/API/ApiData";

import LoginImage from "../Common/Modal/LoginImage";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserInfoRed,
  setUserPermissions,
} from "../../redux/actions/userActions";
import {
  setOnboardingCurrentTooltip,
  setOnboardingStatus,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../redux/actions/onboardingActions";

export const Login = () => {
  let history = useHistory();
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageshow, setImage] = useState(true);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const initialValues = {
    email: "",
    password: "",
  };

  const LoginSchema = Yup.object().shape({
    // email: Yup.string()
    //   .email("Enter Valid Email Address")
    //   .min(3, "Minimum 8 symbols")
    //   .max(50, "Maximum 50 symbols")
    //   .required("Email Address is required"),
    password: Yup.string().required("Password is Required"),
    // .matches(
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    // ),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }
    return "";
  };

  const sleep = (ms) =>
    new Promise((r) => {
      setTimeout(r, ms);
      setLoading(true);
    });

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const data = {
        email: values.email,
        password: values.password,
      };
      // debugger

      await ApiPost("account/validateAccount", data)
        .then(async (res) => {
          if (res.data.status === 200) {
            // debugger
            setLoading(false);
            localStorage.clear();
            // authUtil.setToken(res.data.data.token);
            userUtil.setUserInfo(res?.data?.data[0]);
            dispatch(setUserPermissions(res.data.data[0].permission));
            settingData(res?.data?.data[0]?.companyId);
            dispatch(setUserInfoRed(res.data.data[0]));
            setImage(false);
            await sleep(2000);
            history.push("/");
            // } else {
            //   // debugger
            //   setLoading(false);
            //   setSubmitting(false);
            //   setStatus("Invalid Credentials");
          }
        })
        .catch((error) => {
          if (error?.response?.status === 401) {
            setLoading(false);
            setSubmitting(false);
            setStatus("Invalid Credentials");
            // setImage(!imageshow);
          } else {
            setLoading(false);
            setSubmitting(false);
            setStatus("Something Went Wrong !");
            // setImage(!imageshow);
          }
        });
      // debugger
    },
  });

  const settingData = async (companyId) => {
    await ApiGet("setting/company/" + companyId).then(async (res) => {
      if (res?.data?.status === 200) {
        userUtil.setSetting(res.data.data[0]);
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

  return (
    <>
      <div className="login-banner">
        <div className="md:container md:mx-auto">
          <div className="flex items-center full-screen justify-center">
            <div>
              {imageshow && (
                <div className="login-logo-center-align">
                  <div className="barbera-logo cursor-pointer">
                    <img
                      style={{ width: "49px" }}
                      src={require("../../assets/img/new-barbera.png").default}
                    />
                  </div>
                </div>
              )}
              <div className="login-box-width">
                {!loading && (
                  <div className="login-box">
                    <div className="welcome-text">
                      <h2>Welcome back!</h2>
                      <p>Enter your credentials to access your account</p>
                    </div>

                    <form
                      onSubmit={() => {
                        formik.handleSubmit();
                      }}
                    >
                      {formik.status ? (
                        <div className="text-red-500 text-sm">
                          <div className="alert-text font-weight-bold text-center">
                            {formik.status}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="login-form-group">
                        <div className="icon-input-alignment relative">
                          <input
                            type="text"
                            className={` ${getInputClasses("email")}`}
                            {...formik.getFieldProps("email")}
                            placeholder="Enter email or contact number"
                          />
                          <div className="icon-login-align">
                            <svg
                              width="17"
                              height="14"
                              viewBox="0 0 17 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.875 1.27884H2.125C1.84321 1.27884 1.57296 1.39939 1.3737 1.61398C1.17444 1.82856 1.0625 2.1196 1.0625 2.42307V11.5769C1.0625 11.8804 1.17444 12.1714 1.3737 12.386C1.57296 12.6006 1.84321 12.7211 2.125 12.7211H14.875C15.1568 12.7211 15.427 12.6006 15.6263 12.386C15.8256 12.1714 15.9375 11.8804 15.9375 11.5769V2.42307C15.9375 2.1196 15.8256 1.82856 15.6263 1.61398C15.427 1.39939 15.1568 1.27884 14.875 1.27884ZM13.7062 2.42307L8.5 6.30201L3.29375 2.42307H13.7062ZM2.125 11.5769V2.94369L8.19719 7.46913C8.28612 7.53557 8.39177 7.57117 8.5 7.57117C8.60823 7.57117 8.71388 7.53557 8.80281 7.46913L14.875 2.94369V11.5769H2.125Z"
                                fill="#1479FF"
                              />
                            </svg>
                          </div>
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                          <div className="text-red-500 text-sm pt-2 lato-font-style">
                            {" "}
                            {formik.errors.email}{" "}
                          </div>
                        ) : null}
                      </div>

                      <div className="login-form-group">
                        <div className="icon-input-alignment relative">
                          <input
                            type="password"
                            className={` ${getInputClasses("password")}`}
                            {...formik.getFieldProps("password")}
                            placeholder="Enter password"
                          />
                          <div className="icon-login-align">
                            {/* <svg
                             width="17"
                             height="14"
                             viewBox="0 0 17 14"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg"
                           >
                             <path
                               d="M14.875 1.27884H2.125C1.84321 1.27884 1.57296 1.39939 1.3737 1.61398C1.17444 1.82856 1.0625 2.1196 1.0625 2.42307V11.5769C1.0625 11.8804 1.17444 12.1714 1.3737 12.386C1.57296 12.6006 1.84321 12.7211 2.125 12.7211H14.875C15.1568 12.7211 15.427 12.6006 15.6263 12.386C15.8256 12.1714 15.9375 11.8804 15.9375 11.5769V2.42307C15.9375 2.1196 15.8256 1.82856 15.6263 1.61398C15.427 1.39939 15.1568 1.27884 14.875 1.27884ZM13.7062 2.42307L8.5 6.30201L3.29375 2.42307H13.7062ZM2.125 11.5769V2.94369L8.19719 7.46913C8.28612 7.53557 8.39177 7.57117 8.5 7.57117C8.60823 7.57117 8.71388 7.53557 8.80281 7.46913L14.875 2.94369V11.5769H2.125Z"
                               fill="#1479FF"
                             />
                           </svg> */}
                            <img
                              style={{ width: "17px", height: "14px" }}
                              src={
                                require("../../assets/svg/lock-icon.png")
                                  .default
                              }
                            />
                          </div>
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                          <div className="text-red-500 text-sm pt-2 lato-font-style">
                            {" "}
                            {formik.errors.password}{" "}
                          </div>
                        ) : null}
                      </div>
                      <div className="login-page-login-button">
                        <button type="submit" className="">
                          Login{" "}
                        </button>
                        {/* <span>Cancel and return to website</span> */}
                      </div>
                    </form>
                  </div>
                )}
              </div>
              {!imageshow && <LoginImage />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
