import React, { useState, useRef, useEffect, useContext } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import DatePicker from "react-datepicker";
import moment from "moment";
import MemberbershipServices from "../../Common/Modal/MembershipServices";
import MemberbershipFreeServices from "./MemberbershipFreeServices";
import Success from "../Toaster/Success/Success";
import UserContext from "../../../helpers/Context";
import { get_Setting } from "../../../utils/user.util";

export default function MembershipModal(props) {
  const { toggle, editMembership, close , SettingInfo } = props;
  const userInfo = Auth.getUserDetail();
  // console.log("963258963",SettingInfo)
  const durationRef = useRef();
  const cardColorRef = useRef();
  const benefitRef = useRef();
  const validRef = useRef();

  const [errors, setError] = useState({});
  const [flag, setFlag] = useState(false);
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [durationDropDown, setDurationDropDown] = useState(false);
  const [cardColorDropDown, setCardColorDropDown] = useState(false);
  const [benefitDropDown, setBenefitDropDown] = useState(false);
  const [taxToggle, setTaxToggle] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [activeDays, setActiveDays] = useState([]);
  const [activeDaysList, setActiveDaysList] = useState([]);
  const [gstCharge, setGstCharge] = useState();
  const [servicetax, setServicetax] = useState();
  const [assignedColors, setAssignedColors] = useState([]);
  const [er, setEr] = useState();
  const [type, setType] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const { isMembershipType } = useContext(UserContext);
  const [colorarray, setColorArray] = useState([]);
  const [finalSelServices, setFinalSelServices] = useState(0);
  const [validStartTime,setValidStartTime]=useState()
  const [validEndTime ,setValidEndTime]=useState()
  const [membershipData, setMembershipData] = useState({
    membershipName: "",
    membershipDescription: "",
    duration: "12",
    days: 365,
    remainingDays: 0,
    remainingService: 0,
    cardColur:  colorarray[0],
    colourCard:
              colorarray[0] === "rgb(72, 148, 248)"
                ? "#1479FF"
                : colorarray[0] === "rgb(109, 200, 199)"
                ? "#46BFBD"
                : colorarray[0] === "rgb(248, 226, 124)"
                ? "#F1D302"
                : colorarray[0] === "rgb(248, 163, 121)"
                ? "#FF8E55"
                : "rgb(0, 0, 0)",
    membershipBenifits : !isMembershipType ? 'Free services' : isMembershipType !== "Free & Discounted services" ? 'Free services' : isMembershipType,
    selectedServices: [],
    validFor: "Unlimited",
    availService: "",
    activeHours: {
      startTime: "",
      endTime: "",
    },
    activeDays: [],
    tax: false,
  });

  

  const [temFinalMembershipData, setTemFinalMembershipData] = useState([]);
  const [temEditMembershipData, setTemEditMembershipData] = useState(editMembership ? (editMembership?.selectedServices?.filter((service)=> {return service.isChecked === true && service})) : 0)
  const [membershipServiceModal, setMembershipServiceModal] = useState(false);
  const openMembershipServiceModal = (data) => {

    setType(data);
    membershipServiceModalToggle();
  };
  const membershipServiceModalToggle = (data) => {
    setMembershipServiceModal(!membershipServiceModal);
    if (membershipServiceModal === true) {
      setDisabled(true);
    }
  };

  const [freeMembershipServices, setFreeMembershipServices] = useState(false);
  const membershipFreeServiceModal = () => {
    membershipFreeServiceModalToggle();
  };
  const membershipFreeServiceModalToggle = (data) => {
    setFreeMembershipServices(!freeMembershipServices);
    if (freeMembershipServices === true) {
      setDisabled(true);
    }
  };

  const temSelectedServices = editMembership?.selectedServices?.filter(
    (service) => {
      return service?.isChecked && service;
    }
  );

  const checkValue = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9' ]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

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
  const getMembershipDetails = async (e) => {
    let res = await ApiGet("membership/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        let colors = res.data.data.map((item) => {
          return item.cardColur;
        });
        setAssignedColors(colors);
        let color = [
          "rgb(72, 148, 248)",
          "rgb(109, 200, 199)",
          "rgb(248, 226, 124)",
          "rgb(248, 163, 121)",
        ];
        color = color.filter((val) => !colors.includes(val));
        setColorArray(color);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (membershipData?.membershipName?.trim() == "") {
      formIsValid = false;
      errors["membershipName"] = "Please enter membership name";
    }
    if (membershipData?.validFor === "Limited") {
      if (membershipData?.availService === "") {
        formIsValid = false;
        errors["availService"] = "Please add limitations";
      }
    }
    if (colorarray?.length === 0 && !editMembership) {
      formIsValid = false;
      errors["color"] = "Please select a color";
    }
   
    setError(errors);
    return formIsValid;
  };

  const getSetting = async (e) => {
    const SettingData = get_Setting()

      setActiveDays(SettingData?.storeTiming);
      setActiveDaysList(SettingData?.workingDays);
      setServicetax(SettingData?.tax?.serviceTax);
      setGstCharge(SettingData?.tax?.gstCharge);
      let timeFilter = SettingData?.storeTiming.filter(
        (time) => time.isStoreClosed === false
      );
      setStartTime(moment(`${timeFilter[0].starttime}`, "hh-mm a")._d);
      setEndTime(moment(`${timeFilter[0].endtime}`, "hh-mm a")._d);
      setValidStartTime(moment(`${timeFilter[0].starttime}`, "hh-mm a")._d);
      setValidEndTime(moment(`${timeFilter[0].endtime}`, "hh-mm a")._d);

    // let res = await ApiGet("setting/company/" + userInfo.companyId);
    // try {
    //   if (res.data.status === 200) {
    //     setActiveDays(res.data.data[0].storeTiming);
    //     setActiveDaysList(res.data.data[0].workingDays);
    //     setServicetax(res.data.data[0].tax.serviceTax);
    //     setGstCharge(res.data.data[0].tax.gstCharge);
    //     let timeFilter = res.data.data[0].storeTiming.filter(
    //       (time) => time.isStoreClosed === false
    //     );
    //     setStartTime(moment(`${timeFilter[0].starttime}`, "hh-mm a")._d);
    //     setEndTime(moment(`${timeFilter[0].endtime}`, "hh-mm a")._d);
    //     setValidStartTime(moment(`${timeFilter[0].starttime}`, "hh-mm a")._d);
    //     setValidEndTime(moment(`${timeFilter[0].endtime}`, "hh-mm a")._d);
    //   } else {
    //     console.log("in the else");
    //   }
    // } catch (err) {
    //   console.log("in the catch");
    // }
  };



  const handleOnChange = (e) => {
    setDisabled(true);
    let { name, value } = e.target;
    if (e.target.name === "price") {
      setMembershipData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    } else if (e.target.name === "availService") {
      setMembershipData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
      if (e.target.value != "") {
        setDisabled(true)
      }else{
        setDisabled(false)
      }
    }else{
      setMembershipData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };

  const handleOnCheckbox = (e) => {
    if (e.target.checked && e.target.name === "checkbox") {
      activeDaysList.push(e.target.value);
    } else if (e.target.name === "checkbox") {
      let index = activeDaysList.indexOf(e.target.value);
      activeDaysList.splice(index, 1);
    }
    setActiveDaysList([...activeDaysList]);
    setMembershipData((prevState) => {
      return {
        ...prevState,
        activeDays: activeDaysList,
      };
    });
    activeDaysList.length > 0 ? setDisabled(true) : setDisabled(false);
  };
  const handleOnClick = (data, key) => {
    setDisabled(true);
    if (key === "duration") {
      setMembershipData((prevState) => {
        return {
          ...prevState,
          duration: data.target.id,
          days: data.target.id * 30,
        };
      });
      setDurationDropDown(false);
    } else if (key === "cardcolor") {
      if (assignedColors.includes(data.target.style.backgroundColor)) {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Color is already assigned!");
      } else {
        setMembershipData((prevState) => {
          return {
            ...prevState,
            cardColur: data.target.style.backgroundColor,
            colourCard:
              data.target.style.backgroundColor === "rgb(72, 148, 248)"
                ? "#1479FF"
                : data.target.style.backgroundColor === "rgb(109, 200, 199)"
                ? "#46BFBD"
                : data.target.style.backgroundColor === "rgb(248, 226, 124)"
                ? "#F1D302"
                : data.target.style.backgroundColor === "rgb(248, 163, 121)"
                ? "#FF8E55"
                : "rgb(0, 0, 0)",
          };
        });
        setCardColorDropDown(false);
      }
    } else if (key === "benefits") {
      setMembershipData((prevState) => {
        return {
          ...prevState,
          membershipBenifits: data.target.id,
        };
      });
      setBenefitDropDown(false);
      setTemFinalMembershipData([]);
    } else if (key === "valid") {
      if (data.target.innerHTML === "Limited times") {
        setDisabled(false)
      }
      setMembershipData((prevState) => {
        return {
          ...prevState,
          validFor: data.target.id,
          availService: "",
        };
      });
      setSubMenuopen(false);
    }
  };



  const timeHandler = (e, key) => {
   
    setDisabled(true);
    let errors = {};
    if (key === "startTime") {
      setStartTime(e);
      if(moment(e).format("HH:mm") < moment(validStartTime).format("HH:mm")){
        setDisabled(false);
        errors["Start"] = "Check store start time";
      }
    } else if (key === "endTime") {
      setEndTime(e);
      if(moment(e).format("HH:mm") > moment(validEndTime).format("HH:mm")){
        setDisabled(false);
        errors["End"] = "Check store end time";
      }
    }
    setError(errors);
  };
  
  const handleOnSubmit = async (e) => {
    

    // if (membershipData.membershipBenifits !== "Free services") {
      if (validateForm()) {
        
        
      try {
        const membershipDetails = Object.assign(membershipData, {
          selectedServices : temFinalMembershipData,
          activeHours: {
            startTime: moment(startTime).format("HH:mm"),
            endTime: moment(endTime).format("HH:mm"),
          },
          activeDays: activeDaysList,
          remainingDays: membershipData?.days,
          remainingService: membershipData?.validFor === "Unlimited" ? 0 : parseInt(membershipData?.availService, 10),
          tax: taxToggle,
          gst: taxToggle ? parseInt((membershipData.price * 18) / 100, 10) : 0,
          companyId: userInfo.companyId,
          cardColur: membershipData.cardColur === undefined ? colorarray[0] : membershipData.cardColur,
          colourCard : membershipData.colourCard === "rgb(0, 0, 0)" ? colorarray[0] === "rgb(72, 148, 248)"
          ? "#1479FF"
          : colorarray[0] === "rgb(109, 200, 199)"
          ? "#46BFBD"
          : colorarray[0] === "rgb(248, 226, 124)"
          ? "#F1D302"
          : colorarray[0] === "rgb(248, 163, 121)"
          ? "#FF8E55"
          : "rgb(0, 0, 0)": membershipData.colourCard,
          isActive: true,
          activeMembership: true,
          isExpire: false,
          type:"Edit"
        });
        const membershipCustDetails =  {
          activeHours: {
            startTime: moment(startTime).format("HH:mm"),
            endTime: moment(endTime).format("HH:mm"),
          },
          activeDays: activeDaysList,
          gst: taxToggle ? parseInt((membershipData.price * 18) / 100, 10) : 0,
          isActive: true,
          tax: taxToggle,
          membershipName:membershipData.membershipName,
          membershipDescription: membershipData.membershipDescription,
          cardColur:membershipData.cardColur,
          colourCard:membershipData.colourCard,

        }
        let res;
        editMembership
          ? (res = await ApiPut(
              "membership/" + editMembership._id,
              membershipDetails
            ))
          : (res = await ApiPost("membership/", membershipDetails));
        try {
          if (editMembership) {
            ApiPost(`customer/membership/edit/${userInfo.companyId}/${editMembership._id}`,membershipCustDetails )
            .then((resp)=>{
              
            })
            close();
          }
          toggle(res.data.status);
        } catch (er) {
          toggle(er);
        }
      } catch (err) {
        toggle(err);
      }
    }}
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (durationDropDown) {
        if (
          durationDropDown &&
          durationRef.current &&
          !durationRef.current.contains(e.target)
        ) {
          setDurationDropDown(false);
        }
      } else if (cardColorDropDown) {
        if (
          cardColorDropDown &&
          cardColorRef.current &&
          !cardColorRef.current.contains(e.target)
        ) {
          setCardColorDropDown(false);
        }
      } else if (benefitDropDown) {
        if (
          benefitDropDown &&
          benefitRef.current &&
          !benefitRef.current.contains(e.target)
        ) {
          setBenefitDropDown(false);
        }
      } else if (subMenuOpen) {
        if (
          subMenuOpen &&
          validRef.current &&
          !validRef.current.contains(e.target)
        ) {
          setSubMenuopen(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [durationDropDown, cardColorDropDown, benefitDropDown, subMenuOpen]);
  useEffect(async () => {
    if (editMembership) {
      getSetting();
      setMembershipData(editMembership);
      let startISODate = moment("2021/10/5", "YYYY/DD/MM").add(
        editMembership?.activeHours?.startTime
      );
      let endISODate = moment("2021/10/5", "YYYY/DD/MM").add(
        editMembership?.activeHours?.endTime
      );
      setStartTime(startISODate._d);
      setEndTime(endISODate._d);
      setActiveDaysList(editMembership?.activeDays);
      setTemFinalMembershipData(editMembership?.selectedServices);
      setTaxToggle(editMembership?.tax);

      const SettingData = get_Setting()
      setActiveDays(SettingData?.storeTiming);
      setServicetax(SettingData?.tax?.serviceTax);
      
      // let res = await ApiGet("setting/company/" + userInfo.companyId);
      // if (res.data.status === 200) {
      //   setActiveDays(res.data.data[0]?.storeTiming);
      //   setServicetax(res.data.data[0]?.tax?.serviceTax);
      // }
      setSelectedCategoryList([
        ...new Map(
          editMembership?.selectedServices
            .map((rep) => rep?.categoryName)
            .map((item) => [JSON.stringify(item), item])
        ).values(),
      ]);
    } else {
      getSetting();
    }
  }, [editMembership]);

  useEffect(() => {
    getMembershipDetails();
    if (temFinalMembershipData?.length > 0) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [temFinalMembershipData]);

  

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {membershipServiceModal && (
              <MemberbershipServices
                modal={membershipServiceModal}
                toggle={membershipServiceModalToggle}
                temEditMembershipData={temEditMembershipData}
                setTemEditMembershipData={setTemEditMembershipData}
                setTemFinalMembershipData={setTemFinalMembershipData}
                temFinalMembershipData={temFinalMembershipData}
                setSelectedCategoryList={setSelectedCategoryList}
                selectedCategoryList={selectedCategoryList}
                editMembership={editMembership}
                flag={flag}
                type={type}
                SettingInfo={SettingInfo}
              />
            )}
            {freeMembershipServices && (
              <MemberbershipFreeServices
                modal={freeMembershipServices}
                toggle={membershipFreeServiceModalToggle}
                temEditMembershipData={temEditMembershipData}
                setTemEditMembershipData={setTemEditMembershipData}
                setTemFinalMembershipData={setTemFinalMembershipData}
                temFinalMembershipData={temFinalMembershipData}
                setSelectedCategoryList={setSelectedCategoryList}
                selectedCategoryList={selectedCategoryList}
                setFinalSelServices={setFinalSelServices}
                finalSelServices={finalSelServices}
                flag={flag}
                setFlag={setFlag}
                editMembership={editMembership}
                SettingInfo={SettingInfo}
              />
            )}
            {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>{editMembership ? "Edit" : "Add new"} membership</h2>
                </div>
              </div>
              <div className="modal-button">
                {membershipData?.membershipName &&
                membershipData?.price &&
                temFinalMembershipData.length > 0 &&
                disabled ? (
                  <button onClick={() => handleOnSubmit()}>
                    {editMembership ? "Save Changes" : "Add Membership"}
                  </button>
                ) : (
                  <button disabled>
                    {editMembership ? "Save Changes" : "Add Membership"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Membership info</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-alignment">
                      <div className="form-group membership-form-control-alignment">
                        <label>
                          Membership Name{" "}
                          <span style={{ color: "red" }}>
                            {" "}
                            *{" "}
                            {membershipData?.membershipName?.trim() == "" && (
                              <span
                                style={{
                                  color: "red",
                                  top: "5px",
                                  fontSize: "10px",
                                }}
                              >
                                {" "}
                                {errors["membershipName"]}{" "}
                              </span>
                            )}{" "}
                          </span>{" "}
                        </label>
                        <input
                          type="text"
                          name="membershipName"
                          placeholder="e.g. Gold"
                          value={membershipData?.membershipName?.replace(
                            /^(.)|\s+(.)/g,
                            (c) => c.toUpperCase()
                          )}
                          onChange={(e) => handleOnChange(e)}
                          // onKeyPress={checkValue}
                        />
                      </div>
                      <div className="form-group membership-form-control-alignment">
                        <label>Description</label>
                        <textarea
                          name="membershipDescription"
                          placeholder="Enter membership details"
                          value={membershipData?.membershipDescription}
                          onChange={(e) => handleOnChange(e)}
                          // onKeyPress={checkValue}
                        ></textarea>
                      </div>
                      <div className="form-group membership-form-control-alignment">
                        <label>
                          Price <span style={{ color: "red" }}> * </span>
                        </label>
                        <div className="membership-price-alignment">
                          <input
                            type="text"
                            name="price"
                            placeholder="Please enter price"
                            value={membershipData?.price}
                            onChange={(e) => handleOnChange(e)}
                            onWheel={() => document.activeElement.blur()}
                            maxLength="6"
                            onKeyPress={bindInput}
                          />
                          <div className="price-alignment-input">
                            <span>{SettingInfo?.currentType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="option-select-group  membership-form-control-alignment">
                        <label>
                          Duration <span style={{ color: "red" }}> * </span>
                        </label>
                        <div className="relative" ref={durationRef}>
                          <div
                            className="input-relative"
                            onClick={() =>
                              setDurationDropDown(!durationDropDown)
                            }
                          >
                            <input
                              type="dropdown"
                              value={`${membershipData?.duration} ${
                                membershipData?.duration === "1"
                                  ? "month"
                                  : "months"
                              }`}
                              readOnly
                            />
                            <div className="drop-down-icon-center">
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              durationDropDown
                                ? "sub-menu-open sub-menu"
                                : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              <ul onClick={(e) => handleOnClick(e, "duration")}>
                                <li id="1">1 month</li>
                                <li id="3">3 months</li>
                                <li id="6">6 months</li>
                                <li id="9">9 months</li>
                                <li id="12">12 months</li>
                                <li id="18">18 months</li>
                                <li id="24">24 months</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="option-select-group">
                        <label>
                          Card color{" "}
                          <span style={{ color: "red" }}>
                            {" "}
                            *{" "}
                            {membershipData?.cardColur === undefined && (
                              <span
                                style={{
                                  color: "red",
                                  top: "5px",
                                  fontSize: "10px",
                                }}
                              >
                                {errors["color"]}
                              </span>
                            )}{" "}
                          </span>
                        </label>
                        <div className="relative" ref={cardColorRef}>
                          <div
                            className="input-relative"
                            onClick={() =>
                              setCardColorDropDown(!cardColorDropDown)
                            }
                          >
                            <input type="dropdown" readOnly />
                            <div className="show-icon-input-alignment">
                              <div
                                className="input-under-design"
                                style={{
                                  backgroundColor: membershipData?.cardColur === undefined ? colorarray[0] : membershipData?.cardColur,
                                }}
                                value={membershipData?.cardColur}
                              ></div>
                            </div>
                            <div className="drop-down-icon-center">
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              cardColorDropDown
                                ? "sub-menu-open sub-menu"
                                : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              <div className="color-menu-alignment">
                                {colorarray?.map((color) => {
                                  return (
                                    <div
                                      key={color._id}
                                      className={
                                        color === membershipData?.cardColur
                                          ? "color-round-design-selected"
                                          : "color-round-design"
                                      }
                                      style={{
                                        backgroundColor: color,
                                      }}
                                      value={color}
                                      onClick={(e) =>
                                        handleOnClick(e, "cardcolor")
                                      }
                                    ></div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Membership benefits</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-alignment">
                      <div className="option-select-group  membership-form-control-alignment">
                        <label>
                          Benefits <span style={{ color: "red" }}> * </span>
                        </label>
                        <div className="relative" ref={benefitRef}>
                          <div
                            className="input-relative"
                            onClick={() =>
                              !(
                                isMembershipType === "Free services" ||
                                isMembershipType === "Discounted services"
                              ) && setBenefitDropDown(!benefitDropDown)
                            }
                          >
                            <input
                              type="dropdown"
                              value={`${membershipData?.membershipBenifits}`}
                              readOnly
                              disabled={
                                isMembershipType === "Free services" ||
                                isMembershipType === "Discounted services"
                              }
                            />
                            <div className="drop-down-icon-center">
                              {!(
                                isMembershipType === "Free services" ||
                                isMembershipType === "Discounted services"
                              ) && (
                                <img src={DropDownIcon} alt={"DropDownIcon"} />
                              )}
                            </div>
                          </div>
                          <div
                            className={
                              benefitDropDown
                                ? "sub-menu-open sub-menu"
                                : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              <ul onClick={(e) => handleOnClick(e, "benefits")}>
                                {!(
                                  isMembershipType === "Free services" ||
                                  isMembershipType === "Discounted services"
                                ) ? (
                                  <>
                                    <li id="Free services">Free services</li>
                                    <li id="Discounted services">
                                      Discounted services
                                    </li>
                                  </>
                                ) : isMembershipType === "Free services" ? (
                                  <li id="Free services">Free services</li>
                                ) : (
                                  <li id="Discounted services">
                                    Discounted services
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group membership-form-control-alignment">
                        <label>
                          Selected services
                          <span style={{ color: "red" }}> * </span>
                        </label>
                        {membershipData?.membershipBenifits ===
                        "Discounted services" ? (
                          <div className="membership-price-alignment">
                            <input
                              type="text"
                              placeholder="Please add services"
                              value={
                                editMembership
                                ? editMembership?.selectedServices?.length >
                                      0 &&
                                      `${temEditMembershipData?.length} services selected`
                                      : temFinalMembershipData?.length > 0
                                      ? `${temEditMembershipData?.length} services selected`
                                  : ""
                              }
                              readOnly
                            />
                            <div
                              className="price-alignment-input"
                              onClick={() =>
                                openMembershipServiceModal(
                                  temFinalMembershipData.length > 0
                                    ? "Edit"
                                    : "Select"
                                )
                              }
                            >
                              <p>
                                {temFinalMembershipData.length > 0
                                  ? "Edit"
                                  : "Select"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="membership-price-alignment">
                            <input
                              type="text"
                              placeholder="Please add services"
                              value={
                                editMembership
                                ? editMembership?.selectedServices?.length >
                                      0 &&
                                      `${temEditMembershipData?.length} services selected`
                                      : temFinalMembershipData?.length > 0
                                      ? `${temEditMembershipData?.length} services selected`
                                  : ""
                              }
                            />
                            <div
                              className="price-alignment-input"
                              onClick={() => membershipFreeServiceModal()}
                            >
                              <p>
                                {temFinalMembershipData.length > 0
                                  ? "Edit"
                                  : "Select"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="membership-form-group-grid"> 
                        <div className="membership-form-group-grid-items">
                          <div className="option-select-group">
                            <label>
                              Valid for
                              <span style={{ color: "red" }}> * </span>
                            </label>
                            <div className="relative" ref={validRef}>
                              <div
                                className="input-relative"
                                onClick={() => setSubMenuopen(!subMenuOpen)}
                              >
                                <input
                                  type="dropdown"
                                  value={`${membershipData?.validFor} times`}
                                  readOnly
                                />
                                <div className="drop-down-icon-center">
                                  <img src={DropDownIcon} alt="DropDownIcon" />
                                </div>
                              </div>
                              <div
                                className={
                                  subMenuOpen
                                    ? "sub-menu-open sub-menu"
                                    : "sub-menu sub-menu-close"
                                }
                              >
                                <div className="sub-menu-design">
                                  <ul
                                    onClick={(e) => handleOnClick(e, "valid")}
                                  >
                                    <li id="Unlimited">Unlimited times</li>
                                    <li id="Limited">Limited times</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {membershipData?.validFor === "Limited" && 
                        
                        <div className="membership-form-group-grid-items">
                          <div className="form-group">
                            <label>
                              Avail services
                              <span style={{ color: "red" }}>
                                {" "}
                                *{" "}
                                {/* {membershipData?.availService?.trim() === "" && ( */}
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {errors["availService"]}
                                </span>
                                {/* )
                                }{" "} */}
                              </span>
                            </label>
                            <div className="membership-price-alignment">
                              {membershipData?.validFor === "Limited" ? (
                                <input
                                  type="text"
                                  name="availService"
                                  value={membershipData?.availService}
                                  placeholder="e.g. 5"
                                  onKeyPress={bindInput}
                                  maxLength="4"
                                  onChange={(e) => handleOnChange(e)}
                                  setDisabled={false}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={membershipData?.availService}
                                  placeholder="e.g. 5"
                                  disabled
                                />
                              )}
                              <div className="price-alignment-input">
                                {membershipData?.availService ? (
                                  <a>times</a>
                                ) : (
                                  <a style={{ opacity: 0.5 }}>times</a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Active hours/days</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-alignment">
                      <div className="membership-active-hours-background">
                        <div className="box-title-page">
                          <p>Active hours</p>
                        </div>
                        <div className="active-grid">
                          <div className="active-grid-items">
                            <div className="option-select-group">
                              <label>
                                Start time
                                <span style={{ color: "red" }}> * </span>
                                {" "}
                                {" "}
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {errors["Start"]}
                                </span>
                              </label>
                              <div className="relative">
                                <div className="input-relative">
                                  {/* <input type="text" placeholder="11:00 am" /> */}
                                  <DatePicker
                                    onChange={(e) =>
                                      timeHandler(e, "startTime")
                                    }
                                    selected={startTime}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat="hh:mm aa"
                                  />
                                  <div
                                    className="drop-down-icon-center"
                                    // onClick={() => setSubMenuopen(!subMenuOpen)}
                                  >
                                    <img
                                      src={DropDownIcon}
                                      alt="DropDownIcon"
                                    />
                                  </div>
                                </div>
                                {/* <div
                                  className={
                                    subMenuOpen
                                      ? "sub-menu-open sub-menu"
                                      : "sub-menu sub-menu-close"
                                  }
                                >
                                  <div className="sub-menu-design">
                                    <ul>
                                      <li>11:00 am</li>
                                      <li>11:00 am</li>
                                      <li>11:00 am</li>
                                      <li>11:00 am</li>
                                    </ul>
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                          <div className="active-grid-items">
                            <div className="option-select-group">
                              <label>
                                End time
                                <span style={{ color: "red" }}> * </span>
                                {" "}
                                {" "}
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {errors["End"]}
                                </span>
                              </label>
                              <div className="relative">
                                <div className="input-relative">
                                  {/* <input type="text" placeholder="11:00 am" /> */}
                                  <DatePicker
                                    onChange={(e) => timeHandler(e, "endTime")}
                                    selected={endTime}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat="hh:mm aa"
                                  />
                                  <div
                                    className="drop-down-icon-center"
                                    // onClick={() => setSubMenuopen(!subMenuOpen)}
                                  >
                                    <img
                                      src={DropDownIcon}
                                      alt="DropDownIcon"
                                    />
                                  </div>
                                </div>
                                {/* <div
                                  className={
                                    subMenuOpen
                                      ? "sub-menu-open sub-menu"
                                      : "sub-menu sub-menu-close"
                                  }
                                >
                                  <div className="sub-menu-design">
                                    <ul>
                                      <li>11:00 am</li>
                                      <li>11:00 am</li>
                                      <li>11:00 am</li>
                                      <li>11:00 am</li>
                                    </ul>
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="edit-timings-alignment">
                          <div>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z"
                                stroke="#97A7C3"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10.5 14V10.5"
                                stroke="#97A7C3"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10.5 7H10.5088"
                                stroke="#97A7C3"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p>
                              Edit timings for your customers to redeem benefits
                              of the membership plan
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="membership-active-days">
                        <div className="box-title-page">
                          <p>
                            Active days
                            <span style={{ color: "red" }}> * </span>
                          </p>
                        </div>
                        {activeDays?.map((activeDays) => {
                          return (
                            <div
                              key={activeDays._id}
                              className={
                                activeDays.isStoreClosed
                                  ? "days-alignment-text-disabled"
                                  : "days-alignment-text"
                              }
                            >
                              <div>
                                <input
                                  type="checkbox"
                                  name="checkbox"
                                  value={activeDays.day}
                                  disabled={
                                    activeDays.isStoreClosed && disabled
                                  }
                                  checked={
                                    !activeDays.isStoreClosed &&
                                    activeDaysList.includes(activeDays.day)
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => handleOnCheckbox(e)}
                                />
                              </div>
                              <div>
                                <span>{activeDays.day}</span>
                              </div>
                              {activeDays.isStoreClosed && (
                                <div>
                                  <span
                                    style={{
                                      backgroundColor:
                                        "rgb(230, 102, 102, 0.3)",
                                      color: "rgb(230, 102, 102)",
                                    }}
                                  >
                                    Store closed
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div className="edit-timings-alignment">
                          <div>
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z"
                                stroke="#97A7C3"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10.5 14V10.5"
                                stroke="#97A7C3"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10.5 7H10.5088"
                                stroke="#97A7C3"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p>
                              Edit timings for your customers to redeem benefits
                              of the membership plan
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {gstCharge ? (
                servicetax === true ? (
                  <div className="box-center">
                    <div className="product-info-box">
                      <div className="heading-style">
                        <h3>Tax</h3>
                      </div>
                      <div className="card-details">
                        <div className="form-alignment">
                          <div className="membership-tax-align">
                            <div>
                              <span>Tax</span>
                            </div>
                            <div>
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  name="toggle"
                                  checked={taxToggle}
                                  onChange={(e) => {
                                    setTaxToggle(!taxToggle);
                                    setDisabled(true);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                            {taxToggle && (
                              <div className="form-group relative text-input-style tax-bottom-align-modal">
                                <label>Tax type</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value="CGST 9%, SGST 9%"
                                    disabled
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="box-center">
                    <div className="product-info-box">
                      <div className="heading-style">
                        <h3>Tax</h3>
                      </div>
                      <div className="card-details">
                        <div className="form-alignment">
                          <div className="membership-tax-align">
                            <div>
                              <span>Tax</span>
                            </div>
                            <div>
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  name="toggle"
                                  checked={taxToggle}
                                  onChange={(e) => {
                                    setTaxToggle(!taxToggle);
                                    setDisabled(true);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                            {taxToggle && (
                              <div className="form-group relative text-input-style tax-bottom-align-modal">
                                <label>Tax type</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value="CGST 9%, SGST 9%"
                                    disabled
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
