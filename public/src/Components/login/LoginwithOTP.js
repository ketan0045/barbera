// import React, { useState } from "react";
// import "./login.scss";
// import HideIcon from "../../assets/svg/hide.svg";
// import ShowIcon from "../../assets/svg/eye.svg";
// import { useHistory } from "react-router-dom";
// import { string } from "yup";
// import { useDispatch } from "react-redux";
// import { ApiPost } from "../../helpers/API/ApiData";
// import * as userUtil from "../../utils/user.util";
// import { motion } from "framer-motion";
// import longArrow from "../../assets/svg/long-arrow.svg";
// import {
//   setUserInfoRed,
//   setUserPermissions,
// } from "../../redux/actions/userActions";

// export default function LoginwithOTP() {
//   const history = useHistory();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [imageshow, setImage] = useState(true);
//   const [mobile, setMobile] = useState("");
//   const [inputRed, setInputRed] = useState(false);
//   const [passwordone, setPasswordone] = useState("");
//   const [formstatus, setFormstatus] = useState("");
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const bindInput = (value) => {
//     var regex = new RegExp("^[^0-9]*$");
//     var key = String.fromCharCode(
//       !value.charCode ? value.which : value.charCode
//     );
//     if (regex.test(key)) {
//       value.preventDefault();
//       return false;
//     }
//   };

//   const handleLoginwithEmail = async (setStatus) => {
//     const data = {
//       email: mobile,
//       password: passwordone,
//     };
//     await ApiPost("account/validateAccount", data)
//       .then(async (res) => {
//         if (res.data.status === 200) {
//           debugger;
//           setLoading(false);
//           localStorage.clear();
//           // authUtil.setToken(res.data.data.token);
//           userUtil.setUserInfo(res?.data?.data[0]);
//           dispatch(setUserPermissions(res.data.data[0].permission));
//           // settingData(res?.data?.data[0]?.companyId)
//           dispatch(setUserInfoRed(res.data.data[0]));
//           setImage(false);
//           // await sleep(2000);
//           history.push("/");
//         } else {
//           // debugger
//           setLoading(false);
//           // setSubmitting(false);
//           setFormstatus("Invalid Credentials");
//         }
//       })
//       .catch((error) => {
//         if (error?.response?.status === 401) {
//           // setLoading(false);
//           // setSubmitting(false);
//           setFormstatus("Invalid Credentials");
//           // setImage(!imageshow);
//         } else {
//           // setLoading(false);
//           // setSubmitting(false);
//           setFormstatus("Something Went Wrong !");
//           // setImage(!imageshow);
//         }
//       });
//   };

//   return (
//     <>
//       <div className="new-login-banner">
//         <div className="new-login-banner-box-center-alignment">
//           <div className="new-login-box-alignment">
//             <div className="new-login-logo-alignment"></div>
//             <motion.div initial={{opacity: 0, x: "20vw"}} animate={{opacity: 1, x: 0}} transition={{duration: 0.5}} className="">
//               <div className="login-content-text-alignment">
//                 <p>Welcome back!</p>
//                 <span>Verify your mobile number to access your account</span>
//               </div>
//               <div className="new-login-all-body-alignment">
//                 <div className="new-login-flow-input">
//                   <label>Enter your mobile number</label>
//                   <input type="text" placeholder="Mobile number" />
//                 </div>
//               </div>
//               <div className="login-flow-fill-button">
//                 <button>Get OTP</button>
//               </div>
//               <div className="login-flow-outline-button" onClick={()=>history.push("/new-login")}>
//                 <button>Log in with email</button>
//               </div>
//               <div className="new-to-barbera-text-alignment" onClick={()=>history.push("/signup")}>
//                 <p>
//                   New to barbera? <span>Sign Up </span>
//                 </p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
