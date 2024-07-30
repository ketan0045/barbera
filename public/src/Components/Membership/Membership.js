import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SettingIcon from "../../assets/svg/setting.svg";
import SearchIcon from "../../assets/svg/search-icon.svg";
import AddPlan from "../../assets/img/add-plan.png";
import "./Membership.scss";
import MembershipModal from "../Common/Modal/MembershipModal";
import DetailedMembership from "./DetailedMembership/DetailedMembership";
import Success from "../Common/Toaster/Success/Success";
import { ApiGet } from "../../helpers/API/ApiData";
import Auth from "../../helpers/Auth";
import { get_Setting } from "../../utils/user.util";
import { motion } from "framer-motion/dist/framer-motion";

export default function Membership() {
  const userInfo = Auth.getUserDetail();
  let SettingInfo = get_Setting();

  const permission = userInfo.permission;
  const [addNewMembership, setAddNewMembership] = useState(false);
  const [membershipPlan, setMembershipPlan] = useState(false);
  const [membershipData, setMembershipData] = useState([]);
  const [editMembership, setEditMembership] = useState({});
  const [membershipInfo, setMembershipInfo] = useState();
  const [searchMembershipData, setSearchMembershipData] = useState([]);
  const [keyWord, setKeyWord] = useState("");
  const [er, setEr] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [focus, setFocus] = useState(false);
  const [pressed, setPressed] = useState(false);

  const AddNewMembershipModal = () => {
    setFocus(true);
    setPressed(true);
    membershipModalToggle();
  };
  const membershipModalToggle = (data) => {
    setAddNewMembership(!addNewMembership);
    if (addNewMembership === true) {
      if (data) {
        if (data === 200) {
          getMembershipDetails();
          setSuccess(true);
          setToastmsg("Membership created!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const OpenMembershipPlan = (data) => {
    setMembershipPlan(!membershipPlan);
    if (data === 200) {
      setSuccess(true);
      setToastmsg("Membership deleted!");
    }
  };

  const getMembershipDetails = async (e) => {
    let res = await ApiGet("membership/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setMembershipData(res.data.data);
        setSearchMembershipData(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const handleOnClick = (e, data) => {
    setMembershipInfo(data);
    OpenMembershipPlan();
    setEditMembership(data);
  };

  const handleOnSearch = (e) => {
    setKeyWord(e.target.value);
    var searchData =
      searchMembershipData?.length > 0 &&
      searchMembershipData?.filter(
        (rep) =>
          rep?.membershipName
            ?.toLowerCase()
            .includes(e.target.value?.toLowerCase()) ||
          rep?.price?.toString().includes(e.target.value?.toString())
      );
    if (e.target.value === "") {
      ApiGet("membership/company/" + userInfo.companyId).then((resp) => {
        setMembershipData(resp.data.data);
      });
    } else {
      if (searchMembershipData?.length > 0) {
        setMembershipData(searchData);
      } else {
        setMembershipData([]);
      }
    }
  };

  useEffect(() => {
    getMembershipDetails();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="content"
        id="main-contain"
      >
        <div className="container-fluid container-left-right-space">
          <div className="dashboard-header">
            <div className="header-alignment">
              <div className="header-title">
                <i class="fas fa-bars"></i>
                <h2>Membership</h2>
              </div>
              <div className="header-notification">
                <NavLink to="/setting">
                  <div className="cus-icon-design-last">
                    <div className="iconic-tab">
                      <div className="iconic-icon">
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5476 22.75H9.45259C8.92397 22.75 8.46659 22.3821 8.35347 21.8658L7.89559 19.7463C7.28477 19.4786 6.70559 19.144 6.16872 18.7484L4.10209 19.4065C3.59809 19.5672 3.0502 19.3551 2.78584 18.8969L0.733841 15.352C0.472378 14.8936 0.562457 14.3153 0.950966 13.9581L2.55409 12.4956C2.48119 11.8331 2.48119 11.1646 2.55409 10.5021L0.950966 9.043C0.561885 8.68566 0.47177 8.10669 0.733841 7.648L2.78134 4.10088C3.0457 3.64266 3.59359 3.43053 4.09759 3.59125L6.16422 4.24938C6.43879 4.04593 6.72462 3.85813 7.02034 3.68688C7.30422 3.52678 7.59638 3.38183 7.89559 3.25262L8.35459 1.13538C8.46717 0.618965 8.92405 0.250556 9.45259 0.25H13.5476C14.0761 0.250556 14.533 0.618965 14.6456 1.13538L15.1091 3.25375C15.425 3.39271 15.7326 3.54972 16.0305 3.724C16.3083 3.88466 16.5768 4.06082 16.8348 4.25163L18.9026 3.5935C19.4063 3.43338 19.9535 3.64543 20.2177 4.10312L22.2652 7.65025C22.5267 8.10867 22.4366 8.68695 22.0481 9.04412L20.445 10.5066C20.5179 11.1691 20.5179 11.8376 20.445 12.5001L22.0481 13.9626C22.4366 14.3198 22.5267 14.8981 22.2652 15.3565L20.2177 18.9036C19.9535 19.3613 19.4063 19.5734 18.9026 19.4132L16.8348 18.7551C16.5732 18.9478 16.3013 19.1262 16.0203 19.2895C15.7254 19.4604 15.4212 19.6148 15.1091 19.7519L14.6456 21.8658C14.5326 22.3817 14.0758 22.7496 13.5476 22.75ZM6.57259 16.2576L7.49509 16.9326C7.70305 17.0858 7.91979 17.2267 8.14422 17.3545C8.35538 17.4768 8.5728 17.5879 8.79559 17.6875L9.84522 18.1476L10.3593 20.5H12.6431L13.1572 18.1465L14.2068 17.6864C14.6651 17.4843 15.1 17.2331 15.504 16.9371L16.4276 16.2621L18.7237 16.9934L19.8656 15.0156L18.0847 13.3923L18.2107 12.2537C18.2661 11.7558 18.2661 11.2532 18.2107 10.7552L18.0847 9.61675L19.8667 7.99L18.7237 6.01112L16.4276 6.74237L15.504 6.06738C15.0999 5.77005 14.665 5.51697 14.2068 5.3125L13.1572 4.85238L12.6431 2.5H10.3593L9.84297 4.8535L8.79559 5.3125C8.57262 5.41042 8.35517 5.52046 8.14422 5.64213C7.92117 5.76962 7.70557 5.90972 7.49847 6.06175L6.57484 6.73675L4.27984 6.0055L3.13572 7.99L4.91659 9.61112L4.79059 10.7507C4.73524 11.2487 4.73524 11.7513 4.79059 12.2493L4.91659 13.3878L3.13572 15.0111L4.27759 16.9889L6.57259 16.2576ZM11.4956 16C9.01031 16 6.99559 13.9853 6.99559 11.5C6.99559 9.01472 9.01031 7 11.4956 7C13.9809 7 15.9956 9.01472 15.9956 11.5C15.9925 13.984 13.9796 15.9969 11.4956 16ZM11.4956 9.25C10.2664 9.25125 9.26571 10.2387 9.2481 11.4678C9.23049 12.6968 10.2025 13.7125 11.4311 13.749C12.6598 13.7855 13.6903 12.8292 13.7456 11.6012V12.0512V11.5C13.7456 10.2574 12.7382 9.25 11.4956 9.25Z"
                            fill="#97A7C3"
                          />
                        </svg>
                      </div>
                      <div className="iconic-icon-hover">
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5478 22.75H9.45284C8.92422 22.75 8.46684 22.3821 8.35371 21.8658L7.89584 19.7463C7.28502 19.4786 6.70584 19.144 6.16896 18.7484L4.10234 19.4065C3.59834 19.5672 3.05045 19.3551 2.78609 18.8969L0.734085 15.352C0.472622 14.8936 0.562701 14.3153 0.95121 13.9581L2.55434 12.4956C2.48143 11.8331 2.48143 11.1646 2.55434 10.5021L0.95121 9.043C0.562129 8.68566 0.472014 8.10669 0.734085 7.648L2.78159 4.10088C3.04595 3.64266 3.59384 3.43053 4.09784 3.59125L6.16446 4.24938C6.43903 4.04593 6.72486 3.85813 7.02059 3.68688C7.30447 3.52678 7.59663 3.38183 7.89584 3.25262L8.35484 1.13538C8.46741 0.618965 8.9243 0.250556 9.45284 0.25H13.5478C14.0764 0.250556 14.5333 0.618965 14.6458 1.13538L15.1093 3.25375C15.4252 3.39271 15.7329 3.54972 16.0307 3.724C16.3085 3.88466 16.5771 4.06082 16.8351 4.25163L18.9028 3.5935C19.4065 3.43338 19.9537 3.64543 20.218 4.10312L22.2655 7.65025C22.5269 8.10867 22.4368 8.68695 22.0483 9.04412L20.4452 10.5066C20.5181 11.1691 20.5181 11.8376 20.4452 12.5001L22.0483 13.9626C22.4368 14.3198 22.5269 14.8981 22.2655 15.3565L20.218 18.9036C19.9537 19.3613 19.4065 19.5734 18.9028 19.4132L16.8351 18.7551C16.5734 18.9478 16.3015 19.1262 16.0206 19.2895C15.7256 19.4604 15.4214 19.6148 15.1093 19.7519L14.6458 21.8658C14.5328 22.3817 14.076 22.7496 13.5478 22.75ZM6.57284 16.2576L7.49534 16.9326C7.70329 17.0858 7.92004 17.2267 8.14446 17.3545C8.35563 17.4768 8.57305 17.5879 8.79584 17.6875L9.84546 18.1476L10.3596 20.5H12.6433L13.1575 18.1465L14.2071 17.6864C14.6653 17.4843 15.1002 17.2331 15.5042 16.9371L16.4278 16.2621L18.724 16.9934L19.8658 15.0156L18.085 13.3923L18.211 12.2537C18.2663 11.7558 18.2663 11.2532 18.211 10.7552L18.085 9.61675L19.867 7.99L18.724 6.01112L16.4278 6.74237L15.5042 6.06738C15.1001 5.77005 14.6652 5.51697 14.2071 5.3125L13.1575 4.85238L12.6433 2.5H10.3596L9.84321 4.8535L8.79584 5.3125C8.57287 5.41042 8.35542 5.52046 8.14446 5.64213C7.92141 5.76962 7.70581 5.90972 7.49871 6.06175L6.57509 6.73675L4.28009 6.0055L3.13596 7.99L4.91684 9.61112L4.79084 10.7507C4.73549 11.2487 4.73549 11.7513 4.79084 12.2493L4.91684 13.3878L3.13596 15.0111L4.27784 16.9889L6.57284 16.2576ZM11.4958 16C9.01055 16 6.99584 13.9853 6.99584 11.5C6.99584 9.01472 9.01055 7 11.4958 7C13.9811 7 15.9958 9.01472 15.9958 11.5C15.9927 13.984 13.9798 15.9969 11.4958 16ZM11.4958 9.25C10.2667 9.25125 9.26596 10.2387 9.24835 11.4678C9.23073 12.6968 10.2027 13.7125 11.4314 13.749C12.66 13.7855 13.6905 12.8292 13.7458 11.6012V12.0512V11.5C13.7458 10.2574 12.7385 9.25 11.4958 9.25Z"
                            fill="#1479FF"
                          />
                        </svg>
                      </div>
                      <p className="iconic-title">Settings</p>
                    </div>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
          <div className="service-sub-header">
            <div className="service-button-search-alignment">
              <div className="input-relative">
                <input
                  type="search"
                  placeholder="Search membership"
                  onChange={(e) => handleOnSearch(e)}
                  autoFocus
                />
                <div className="search-icon-alignment-customer">
                  <img src={SearchIcon} alt="searchIcon" />
                </div>
              </div>
              {permission?.filter((obj) => obj.name === "Add new membership")[0]
                ?.isChecked === false ? null : (
                <div className="service-button-alignment">
                  <div className="relative">
                    <button
                      className={focus && "focused" || pressed && "pressed" ||  "add-new-button-style"}
                      onClick={() => AddNewMembershipModal()}
                    >
                      Add New
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {membershipData.length > 0 ? null : (
            <div className="add-new-plan-center-align">
              <div className="add-plan-box-design">
                <div className="">
                  <div className="add-plan-icon-center-align">
                    <img src={AddPlan} alt="AddPlan" />
                  </div>
                  <div className="plan-details">
                    <p>Offer memberships to your customers, </p>
                    <p>
                      Click on <span>Add New</span> to create plans and give
                      boost to your sales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="membership-box-center-align">
            <div className="membership-card-box">
              <div className="card-box-grid">
                {membershipData?.map((membership) => {
                  return (
                    <div
                      key={membership._id}
                      className="membership-card-box-items"
                      style={{
                        border: `2px solid ${membership.cardColur}`,
                        boxShadow: `0px 5px 30px #D1D9E6`,
                        borderRadius: "8px",
                        pointerEvents:
                          permission?.filter(
                            (obj) => obj.name === "Membership information"
                          )[0]?.isChecked === false
                            ? "none"
                            : null,
                      }}
                      onClick={(e) => handleOnClick(e, membership)}
                    >
                      <div
                        className="card-title-alignment"
                        style={{
                          background:
                            membership?.cardColur === "rgb(72, 148, 248)"
                              ? "linear-gradient(90deg, rgba(20, 121, 255, 0.25) 0%, rgba(20, 121, 255, 0.1) 100%)"
                              : membership?.cardColur === "rgb(248, 226, 124)"
                              ? "linear-gradient(90deg, rgba(241, 211, 2, 0.25) 0%, rgba(255, 255, 109, 0.1) 100%, rgba(255, 226, 89, 0.1) 100%, rgba(189, 191, 70, 0.1) 100%, rgba(241, 211, 2, 0.1) 100%)"
                              : membership?.cardColur === "rgb(109, 200, 199)"
                              ? "linear-gradient(90.23deg, rgba(70, 191, 189, 0.5) 0.16%, rgba(70, 191, 189, 0.2) 99.76%)"
                              : membership?.cardColur === "rgb(248, 163, 121)"
                              ? "linear-gradient(90.23deg, rgba(255, 142, 85, 0.5) 0.16%, rgba(255, 142, 85, 0.2) 99.76%)"
                              : "",
                        }}
                      >
                        <h1>{membership?.membershipName}</h1>
                        <div className="package-round package-round-first">
                          {membership?.cardColur === "rgb(72, 148, 248)" ? (
                            <svg
                              width="33"
                              height="33"
                              viewBox="0 0 33 33"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="16.5"
                                cy="16.5"
                                r="16.5"
                                fill="#1479FF"
                                fill-opacity="0.2"
                              />
                              <path
                                d="M18.547 13.3831L18.6343 13.56L18.8294 13.5884L23.083 14.2065C23.0832 14.2066 23.0833 14.2066 23.0835 14.2066C23.1752 14.2205 23.2328 14.3035 23.22 14.3867L23.2194 14.3909C23.2145 14.4249 23.1985 14.457 23.1726 14.4825C23.1725 14.4826 23.1724 14.4827 23.1723 14.4828L20.0946 17.4834L19.9534 17.621L19.9868 17.8153L20.714 22.0534L20.7141 22.0537C20.729 22.1403 20.671 22.2235 20.5825 22.2388L20.582 22.2389C20.5468 22.245 20.511 22.239 20.4823 22.2237L20.4806 22.2228L16.6749 20.2219L16.5004 20.1302L16.3259 20.2219L12.5202 22.2228L12.5196 22.2231C12.4931 22.2371 12.4632 22.2434 12.4333 22.2412C12.4034 22.2391 12.3747 22.2286 12.3504 22.211C12.3262 22.1934 12.3073 22.1694 12.2961 22.1416C12.2848 22.1138 12.2815 22.0834 12.2866 22.0539L12.2867 22.0534L13.014 17.8153L13.0473 17.621L12.9062 17.4834L9.82778 14.4821L9.82776 14.4821C9.79699 14.4521 9.77939 14.4111 9.77882 14.3681C9.77826 14.3254 9.79459 14.2842 9.82425 14.2535C9.8497 14.2277 9.88173 14.2117 9.91565 14.2069L9.91654 14.2067L14.1714 13.5884L14.3665 13.56L14.4537 13.3831L16.3548 9.52899C16.3549 9.52877 16.3551 9.52856 16.3552 9.52834C16.396 9.44749 16.494 9.41586 16.5723 9.45455L16.5728 9.45477C16.6041 9.47017 16.6295 9.49554 16.6449 9.52685L16.645 9.52717L18.547 13.3831Z"
                                fill="#1479FF"
                                fill-opacity="0.4"
                                stroke="#1479FF"
                                stroke-width="0.75"
                              />
                            </svg>
                          ) : membership?.cardColur === "rgb(248, 226, 124)" ? (
                            <svg
                              width="33"
                              height="33"
                              viewBox="0 0 33 33"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="16.5"
                                cy="16.5"
                                r="16.5"
                                fill="#F1D302"
                                fill-opacity="0.2"
                              />
                              <path
                                d="M18.547 13.3831L18.6343 13.56L18.8294 13.5884L23.083 14.2065C23.0832 14.2066 23.0833 14.2066 23.0835 14.2066C23.1752 14.2205 23.2328 14.3035 23.22 14.3867L23.2194 14.3909C23.2145 14.4249 23.1985 14.457 23.1726 14.4825C23.1725 14.4826 23.1724 14.4827 23.1723 14.4828L20.0946 17.4834L19.9534 17.621L19.9868 17.8153L20.714 22.0534L20.7141 22.0537C20.729 22.1403 20.671 22.2235 20.5825 22.2388L20.582 22.2389C20.5468 22.245 20.511 22.239 20.4823 22.2237L20.4806 22.2228L16.6749 20.2219L16.5004 20.1302L16.3259 20.2219L12.5202 22.2228L12.5196 22.2231C12.4931 22.2371 12.4632 22.2434 12.4333 22.2412C12.4034 22.2391 12.3747 22.2286 12.3504 22.211C12.3262 22.1934 12.3073 22.1694 12.2961 22.1416C12.2848 22.1138 12.2815 22.0834 12.2866 22.0539L12.2867 22.0534L13.014 17.8153L13.0473 17.621L12.9062 17.4834L9.82778 14.4821L9.82776 14.4821C9.79699 14.4521 9.77939 14.4111 9.77882 14.3681C9.77826 14.3254 9.79459 14.2842 9.82425 14.2535C9.8497 14.2277 9.88173 14.2117 9.91565 14.2069L9.91654 14.2067L14.1714 13.5884L14.3665 13.56L14.4537 13.3831L16.3548 9.52899C16.3549 9.52877 16.3551 9.52856 16.3552 9.52834C16.396 9.44749 16.494 9.41586 16.5723 9.45455L16.5728 9.45477C16.6041 9.47017 16.6295 9.49554 16.6449 9.52685L16.645 9.52717L18.547 13.3831Z"
                                fill="#F1D302"
                                fill-opacity="0.4"
                                stroke="#F1D302"
                                stroke-width="0.75"
                              />
                            </svg>
                          ) : membership?.cardColur === "rgb(109, 200, 199)" ? (
                            <svg
                              width="33"
                              height="33"
                              viewBox="0 0 33 33"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="16.5"
                                cy="16.5"
                                r="16.5"
                                fill="#46BFBD"
                                fill-opacity="0.2"
                              />
                              <path
                                d="M18.547 13.3832L18.6343 13.5601L18.8294 13.5884L23.083 14.2066C23.0832 14.2066 23.0833 14.2067 23.0835 14.2067C23.1752 14.2205 23.2328 14.3035 23.22 14.3868L23.2194 14.391C23.2145 14.425 23.1985 14.4571 23.1726 14.4826C23.1725 14.4826 23.1724 14.4827 23.1723 14.4828L20.0946 17.4835L19.9534 17.6211L19.9868 17.8154L20.714 22.0535L20.7141 22.0537C20.729 22.1403 20.671 22.2236 20.5825 22.2388L20.582 22.2389C20.5468 22.2451 20.511 22.239 20.4823 22.2237L20.4806 22.2228L16.6749 20.222L16.5004 20.1302L16.3259 20.222L12.5202 22.2228L12.5196 22.2232C12.4931 22.2372 12.4632 22.2434 12.4333 22.2413C12.4034 22.2392 12.3747 22.2287 12.3504 22.2111C12.3262 22.1935 12.3073 22.1694 12.2961 22.1416C12.2848 22.1139 12.2815 22.0835 12.2866 22.054L12.2867 22.0535L13.014 17.8154L13.0473 17.6211L12.9062 17.4835L9.82778 14.4822L9.82776 14.4821C9.79699 14.4521 9.77939 14.4112 9.77882 14.3682C9.77826 14.3255 9.79459 14.2843 9.82425 14.2535C9.8497 14.2277 9.88173 14.2118 9.91565 14.2069L9.91654 14.2068L14.1714 13.5884L14.3665 13.5601L14.4537 13.3832L16.3548 9.52905C16.3549 9.52883 16.3551 9.52862 16.3552 9.52841C16.396 9.44755 16.494 9.41592 16.5723 9.45461L16.5728 9.45483C16.6041 9.47023 16.6295 9.49561 16.6449 9.52691L16.645 9.52723L18.547 13.3832Z"
                                fill="#46BFBD"
                                fill-opacity="0.4"
                                stroke="#46BFBD"
                                stroke-width="0.75"
                              />
                            </svg>
                          ) : membership?.cardColur === "rgb(248, 163, 121)" ? (
                            <svg
                              width="33"
                              height="33"
                              viewBox="0 0 33 33"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="16.5"
                                cy="16.5"
                                r="16.5"
                                fill="#FF8E55"
                                fill-opacity="0.2"
                              />
                              <path
                                d="M18.547 13.3832L18.6343 13.5601L18.8294 13.5884L23.083 14.2066C23.0832 14.2066 23.0833 14.2067 23.0835 14.2067C23.1752 14.2205 23.2328 14.3035 23.22 14.3868L23.2194 14.391C23.2145 14.425 23.1985 14.4571 23.1726 14.4826C23.1725 14.4826 23.1724 14.4827 23.1723 14.4828L20.0946 17.4835L19.9534 17.6211L19.9868 17.8154L20.714 22.0535L20.7141 22.0537C20.729 22.1403 20.671 22.2236 20.5825 22.2388L20.582 22.2389C20.5468 22.2451 20.511 22.239 20.4823 22.2237L20.4806 22.2228L16.6749 20.222L16.5004 20.1302L16.3259 20.222L12.5202 22.2228L12.5196 22.2232C12.4931 22.2372 12.4632 22.2434 12.4333 22.2413C12.4034 22.2392 12.3747 22.2287 12.3504 22.2111C12.3262 22.1935 12.3073 22.1694 12.2961 22.1416C12.2848 22.1139 12.2815 22.0835 12.2866 22.054L12.2867 22.0535L13.014 17.8154L13.0473 17.6211L12.9062 17.4835L9.82778 14.4822L9.82776 14.4821C9.79699 14.4521 9.77939 14.4112 9.77882 14.3682C9.77826 14.3255 9.79459 14.2843 9.82425 14.2535C9.8497 14.2277 9.88173 14.2118 9.91565 14.2069L9.91654 14.2068L14.1714 13.5884L14.3665 13.5601L14.4537 13.3832L16.3548 9.52905C16.3549 9.52883 16.3551 9.52862 16.3552 9.52841C16.396 9.44755 16.494 9.41592 16.5723 9.45461L16.5728 9.45483C16.6041 9.47023 16.6295 9.49561 16.6449 9.52691L16.645 9.52723L18.547 13.3832Z"
                                fill="#FF8E55"
                                fill-opacity="0.4"
                                stroke="#FF8E55"
                                stroke-width="0.75"
                              />
                            </svg>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div
                        className="child-text-style"
                        style={{
                          background:
                            membership?.cardColur === "rgb(72, 148, 248)"
                              ? "linear-gradient(90deg, rgba(20, 121, 255, 0.25) 0%, rgba(20, 121, 255, 0.1) 100%)"
                              : membership?.cardColur === "rgb(248, 226, 124)"
                              ? "linear-gradient(90deg, rgba(241, 211, 2, 0.25) 0%, rgba(255, 255, 109, 0.1) 100%, rgba(255, 226, 89, 0.1) 100%, rgba(189, 191, 70, 0.1) 100%, rgba(241, 211, 2, 0.1) 100%)"
                              : membership?.cardColur === "rgb(109, 200, 199)"
                              ? "linear-gradient(90.23deg, rgba(70, 191, 189, 0.5) 0.16%, rgba(70, 191, 189, 0.2) 99.76%)"
                              : membership?.cardColur === "rgb(248, 163, 121)"
                              ? "linear-gradient(90.23deg, rgba(255, 142, 85, 0.5) 0.16%, rgba(255, 142, 85, 0.2) 99.76%)"
                              : "",
                        }}
                      >
                        <p>{membership?.membershipBenifits}</p>
                      </div>
                      <div
                        className="card-duration-banner card-duration-banner-first-background"
                        style={{
                          background:
                            membership?.cardColur === "rgb(72, 148, 248)"
                              ? "linear-gradient(90deg, rgba(20, 121, 255, 0.5) 0%, rgba(20, 121, 255, 0.398438) 33.85%, rgba(20, 121, 255, 0.2875) 70.83%, rgba(20, 121, 255, 0.2) 100%)"
                              : membership?.cardColur === "rgb(248, 226, 124)"
                              ? "linear-gradient(90deg, rgba(255, 226, 89, 0.8) 0%, rgba(255, 226, 89, 0.4) 100%)"
                              : membership?.cardColur === "rgb(109, 200, 199)"
                              ? "linear-gradient(90deg, rgba(70, 191, 189, 0.8) 0%, rgba(70, 191, 189, 0.4) 100%)"
                              : membership?.cardColur === "rgb(248, 163, 121)"
                              ? "linear-gradient(90deg, rgba(230, 102, 102, 0.5) 0%, #FF8F56 0.01%, #FFBE9D 100%, rgba(230, 102, 102, 0.2) 100%)"
                              : "",
                        }}
                      >
                        <div className="card-content-alignment">
                          <div>
                            <p>Duration</p>
                            <h4>
                              {membership?.duration}{" "}
                              {membership?.duration === "1"
                                ? "month"
                                : "months"}
                            </h4>
                          </div>
                          <div>
                            <h2>
                              <span>{SettingInfo?.currentType}</span>{" "}
                              {membership?.price}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* <div className="membership-card-box-items"></div>
                <div className="membership-card-box-items"></div>
                <div className="membership-card-box-items"></div> */}
              </div>
            </div>
          </div>
          {addNewMembership && (
            <MembershipModal
              modal={addNewMembership}
              toggle={membershipModalToggle}
              SettingInfo={SettingInfo}
            />
          )}
          {membershipPlan && (
            <DetailedMembership
              modal={membershipPlan}
              toggle={OpenMembershipPlan}
              editMembership={editMembership}
              getMembershipDetails={getMembershipDetails}
              membershipInfo={membershipInfo}
              SettingInfo={SettingInfo}
            />
          )}
          {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
        </div>
      </motion.div>
    </>
  );
}
