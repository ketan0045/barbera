import React, { useEffect, useState, useRef } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import dateTime from "date-time";
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import Delete from "../Toaster/Delete";
import * as userUtil from "../../../utils/user.util";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOnboardingCurrentTooltip, setOnboardingStatus, setOnboardingTooltipStatus, setOnboardingTourProgress, setOnboardingTourStatus } from "../../../redux/actions/onboardingActions";


export default function EditWorkingHoursModal(props) {
  const { storeTiming, workingDay, workday } = props;
  const userInfo = Auth.getUserDetail();
  const history = useHistory();
  const dispatch = useDispatch();
  const storeOnboardingStatus = useSelector((state) => state.onboardingStatusRed);
  const storeOnboardingTourProgress = useSelector((state) => state.onboardingTourProgressRed);
  const storeOnboardingTourStatus = useSelector((state) => state.onboardingTourStatusRed);
  const storeOnboardingTooltipStatus = useSelector((state) => state.onboardingTooltipStatusRed);
  const storeOnboardingCurrentTooltip = useSelector((state) => state.onboardingCurrentTooltipRed);

  const toggleTooltip = (key) => {
    if (key === "gotIt") {
      dispatch(setOnboardingTooltipStatus(false));
    }
  };

  const handleCloseTour = () => {
    dispatch(setOnboardingTourStatus(false));
    dispatch(setOnboardingTooltipStatus(false));
    dispatch(setOnboardingCurrentTooltip(""));
  };
  
  const sunRef = useRef();
  const monRef = useRef();
  const tueRef = useRef();
  const wedRef = useRef();
  const thuRef = useRef();
  const friRef = useRef();
  const satRef = useRef();
  const [workingDays, setWorkingDays] = useState(workingDay);

  const [allStaff, setAllStaff] = useState();
  const [disabled, setDisabled] = useState(false);

  const [monStartDate, setMonStartDate] = useState(null);
  const [monEndDate, setMonEndDate] = useState(null);
  const [mon, setMon] = useState(false);

  const [tueStartDate, setTueStartDate] = useState(null);
  const [tueEndDate, setTueEndDate] = useState(null);
  const [tue, setTue] = useState(false);

  const [wedStartDate, setWedStartDate] = useState(null);
  const [wedEndDate, setWedEndDate] = useState(null);
  const [wed, setWed] = useState(false);

  const [thuStartDate, setThuStartDate] = useState(null);
  const [thuEndDate, setThuEndDate] = useState(null);
  const [thu, setThu] = useState(false);

  const [friStartDate, setFriStartDate] = useState(null);
  const [friEndDate, setFriEndDate] = useState(null);
  const [fri, setFri] = useState(false);

  const [satStartDate, setSatStartDate] = useState(null);
  const [satEndDate, setSatEndDate] = useState(null);
  const [sat, setSat] = useState(false);

  const [sunStartDate, setSunStartDate] = useState(null);
  const [sunEndDate, setSunEndDate] = useState(null);
  const [sun, setSun] = useState(false);

  const [sunApplyToAll, setSunApplyToAll] = useState(false);
  const [monApplyToAll, setMonApplyToAll] = useState(false);
  const [tueApplyToAll, setTueApplyToAll] = useState(false);
  const [wedApplyToAll, setWedApplyToAll] = useState(false);
  const [thuApplyToAll, setThuApplyToAll] = useState(false);
  const [friApplyToAll, setFriApplyToAll] = useState(false);
  const [satApplyToAll, setSatApplyToAll] = useState(false);
  const [off, setOff] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const opendeleteModal = async () => {
    if(storeOnboardingTourStatus || storeOnboardingTourProgress === 50 ){
      let onboardingUpdateProfileData = {
        companyId: userInfo?.companyId,
        onboardProcess: [
          {
            onboardingStatus: true,
            onboardingCompleted: false,
            onboardingTourProgress: 66,
            onboardingProfileUpdated: true
          },
        ],
      };
      await ApiPost("setting/", onboardingUpdateProfileData)
        .then((res) => 
        dispatch(setOnboardingTourStatus(false)),
        dispatch(setOnboardingTooltipStatus(false)),
        dispatch(setOnboardingTourProgress(66)))
        .catch((err) => console.log(err));
      setTimeout(() => {
        dispatch(setOnboardingTooltipStatus(true));
      }, 500);
      dispatch(setOnboardingCurrentTooltip(""));
      dispatch(setOnboardingTooltipStatus(false));
      updateSetting();
      if(storeOnboardingTourProgress === 50 && storeOnboardingTourStatus){
        history.push('/barberatasklist');
      }else{
        deleteModaltoggle();
      }
     
      // setTimeout(() => {
        
      // }, 250);
    } else {
      deleteModaltoggle();
    }
  };
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
  };

  const getAllStaff = async (values) => {
    try {
      let res = await ApiGet("staff/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setAllStaff(res.data.data);
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  useEffect(() => {
    if (workday === undefined) {
      setWorkingDays([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]);
    }
  }, []);

  const handleSetting = async (e) => {
    if (e.target.name === "workingDays") {
      if (workingDays.includes(e.target.value)) {
        let index = workingDays.indexOf(e.target.value);
        workingDays.splice(index, 1);
        setWorkingDays(workingDays);
      } else {
        workingDays.push(e.target.value);
        setWorkingDays(workingDays);
      }
    }
  };

  const updateSetting = async () => {
    let values = {
      storeTiming: [
        {
          isStoreClosed: mon,
          day: "Monday",
          starttime: moment(monStartDate).format("HH:mm"),
          endtime: moment(monEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: tue,
          day: "Tuesday",
          starttime: moment(tueStartDate).format("HH:mm"),
          endtime: moment(tueEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: wed,
          day: "Wednesday",
          starttime: moment(wedStartDate).format("HH:mm"),
          endtime: moment(wedEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: thu,
          day: "Thursday",
          starttime: moment(thuStartDate).format("HH:mm"),
          endtime: moment(thuEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: fri,
          day: "Friday",
          starttime: moment(friStartDate).format("HH:mm"),
          endtime: moment(friEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: sat,
          day: "Saturday",
          starttime: moment(satStartDate).format("HH:mm"),
          endtime: moment(satEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: sun,
          day: "Sunday",
          starttime: moment(sunStartDate).format("HH:mm"),
          endtime: moment(sunEndDate).format("HH:mm"),
        },
      ],
      companyId: userInfo.companyId,
      workingDays: workingDays,
    };
    let res = await ApiPost("setting/", values);
    try {
      props.toggle(res.data.status,res?.data?.data[0]);
     
      userUtil.setSetting(res?.data?.data[0])

    } catch (er) {
      props.toggle(er);
    }
    let staffIdList =
      allStaff &&
      allStaff.map((rep) => {
        return rep._id;
      });
    let weekdata = {
      staffId: staffIdList,
      workingDays: [
        {
          isStoreClosed: mon,
          dayOff: false,
          Day: "Monday",
          starttime: moment(monStartDate).format("HH:mm"),
          endtime: moment(monEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: tue,
          dayOff: false,
          Day: "Tuesday",
          starttime: moment(tueStartDate).format("HH:mm"),
          endtime: moment(tueEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: wed,
          dayOff: false,
          Day: "Wednesday",
          starttime: moment(wedStartDate).format("HH:mm"),
          endtime: moment(wedEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: thu,
          dayOff: false,
          Day: "Thursday",
          starttime: moment(thuStartDate).format("HH:mm"),
          endtime: moment(thuEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: fri,
          dayOff: false,
          Day: "Friday",
          starttime: moment(friStartDate).format("HH:mm"),
          endtime: moment(friEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: sat,
          dayOff: false,
          Day: "Saturday",
          starttime: moment(satStartDate).format("HH:mm"),
          endtime: moment(satEndDate).format("HH:mm"),
        },
        {
          isStoreClosed: sun,
          dayOff: false,
          Day: "Sunday",
          starttime: moment(sunStartDate).format("HH:mm"),
          endtime: moment(sunEndDate).format("HH:mm"),
        },
      ],
    };
    let resp = await ApiPut("staff/updateInfo/data", weekdata);
    try {
      if (resp.data.status === 200) {
        getAllStaff();
      }
    } catch (err) {}
  };

  const MonStartTime = async (data) => {
    setDisabled(true);
    setMonApplyToAll(true);
    setMonStartDate(data);
  };
  const MonEndTime = async (data) => {
    setDisabled(true);
    setMonApplyToAll(true);
    setMonEndDate(data);
  };

  const TueStartTime = async (data) => {
    setDisabled(true);
    setTueApplyToAll(true);
    setTueStartDate(data);
  };
  const TueEndTime = async (data) => {
    setDisabled(true);
    setTueApplyToAll(true);
    setTueEndDate(data);
  };

  const WedStartTime = async (data) => {
    setDisabled(true);
    setWedApplyToAll(true);
    setWedStartDate(data);
  };
  const WedEndTime = async (data) => {
    setDisabled(true);
    setWedApplyToAll(true);
    setWedEndDate(data);
  };

  const ThuStartTime = async (data) => {
    setDisabled(true);
    setThuApplyToAll(true);
    setThuStartDate(data);
  };
  const ThuEndTime = async (data) => {
    setDisabled(true);
    setThuApplyToAll(true);
    setThuEndDate(data);
  };

  const FriStartTime = async (data) => {
    setDisabled(true);
    setFriApplyToAll(true);
    setFriStartDate(data);
  };
  const FriEndTime = async (data) => {
    setDisabled(true);
    setFriApplyToAll(true);
    setFriEndDate(data);
  };

  const SatStartTime = async (data) => {
    setDisabled(true);
    setSatApplyToAll(true);
    setSatStartDate(data);
  };
  const SatEndTime = async (data) => {
    setDisabled(true);
    setSatApplyToAll(true);
    setSatEndDate(data);
  };

  const SunStartTime = async (data) => {
    setDisabled(true);
    setSunApplyToAll(true);
    setSunStartDate(data);
  };
  const SunEndTime = async (data) => {
    setDisabled(true);
    setSunApplyToAll(true);
    setSunEndDate(data);
  };

  const applyToAllHandler = (data, key) => {
    if (key === "sun") {
      setMonStartDate(sunStartDate);
      setMonEndDate(sunEndDate);
      setTueStartDate(sunStartDate);
      setTueEndDate(sunEndDate);
      setWedStartDate(sunStartDate);
      setWedEndDate(sunEndDate);
      setThuStartDate(sunStartDate);
      setThuEndDate(sunEndDate);
      setFriStartDate(sunStartDate);
      setFriEndDate(sunEndDate);
      setSatStartDate(sunStartDate);
      setSatEndDate(sunEndDate);
      setOff(false);
    } else if (key === "mon") {
      setSunStartDate(monStartDate);
      setSunEndDate(monEndDate);
      setTueStartDate(monStartDate);
      setTueEndDate(monEndDate);
      setWedStartDate(monStartDate);
      setWedEndDate(monEndDate);
      setThuStartDate(monStartDate);
      setThuEndDate(monEndDate);
      setFriStartDate(monStartDate);
      setFriEndDate(monEndDate);
      setSatStartDate(monStartDate);
      setSatEndDate(monEndDate);
      setOff(false);
    } else if (key === "tue") {
      setSunStartDate(tueStartDate);
      setSunEndDate(tueEndDate);
      setMonStartDate(tueStartDate);
      setMonEndDate(tueEndDate);
      setWedStartDate(tueStartDate);
      setWedEndDate(tueEndDate);
      setThuStartDate(tueStartDate);
      setThuEndDate(tueEndDate);
      setFriStartDate(tueStartDate);
      setFriEndDate(tueEndDate);
      setSatStartDate(tueStartDate);
      setSatEndDate(tueEndDate);
      setOff(false);
    } else if (key === "wed") {
      setSunStartDate(wedStartDate);
      setSunEndDate(wedEndDate);
      setMonStartDate(wedStartDate);
      setMonEndDate(wedEndDate);
      setTueStartDate(wedStartDate);
      setTueEndDate(wedEndDate);
      setThuStartDate(wedStartDate);
      setThuEndDate(wedEndDate);
      setFriStartDate(wedStartDate);
      setFriEndDate(wedEndDate);
      setSatStartDate(wedStartDate);
      setSatEndDate(wedEndDate);
      setOff(false);
    } else if (key === "thu") {
      setSunStartDate(thuStartDate);
      setSunEndDate(thuEndDate);
      setMonStartDate(thuStartDate);
      setMonEndDate(thuEndDate);
      setTueStartDate(thuStartDate);
      setTueEndDate(thuEndDate);
      setWedStartDate(thuStartDate);
      setWedEndDate(thuEndDate);
      setFriStartDate(thuStartDate);
      setFriEndDate(thuEndDate);
      setSatStartDate(thuStartDate);
      setSatEndDate(thuEndDate);
      setOff(false);
    } else if (key === "fri") {
      setSunStartDate(friStartDate);
      setSunEndDate(friEndDate);
      setMonStartDate(friStartDate);
      setMonEndDate(friEndDate);
      setTueStartDate(friStartDate);
      setTueEndDate(friEndDate);
      setWedStartDate(friStartDate);
      setWedEndDate(friEndDate);
      setThuStartDate(friStartDate);
      setThuEndDate(friEndDate);
      setSatStartDate(friStartDate);
      setSatEndDate(friEndDate);
      setOff(false);
    } else if (key === "sat") {
      setSunStartDate(satStartDate);
      setSunEndDate(satEndDate);
      setMonStartDate(satStartDate);
      setMonEndDate(satEndDate);
      setTueStartDate(satStartDate);
      setTueEndDate(satEndDate);
      setWedStartDate(satStartDate);
      setWedEndDate(satEndDate);
      setThuStartDate(satStartDate);
      setThuEndDate(satEndDate);
      setFriStartDate(satStartDate);
      setFriEndDate(satEndDate);
      setOff(false);
    }
  };

  useEffect(async () => {
    setObj();
  }, [storeTiming]);

  const setObj = () => {
    if (storeTiming) {
      let MonStart = moment(
        storeTiming[0]?.starttime ? storeTiming[0]?.starttime : "10:00",
        "hh-mm a"
      );
      storeTiming[0]?.starttime
        ? setMonStartDate(MonStart._d)
        : setMonStartDate(moment("10:00", "hh-mm a")._d);
      setMon(storeTiming[0]?.isStoreClosed);
      let MonEnd = moment(
        storeTiming[0]?.endtime ? storeTiming[0]?.endtime : "10:00",
        "hh-mm a"
      );
      storeTiming[0]?.endtime
        ? setMonEndDate(MonEnd._d)
        : setMonEndDate(moment("20:00", "hh-mm a")._d);

      let TueStart = moment(
        storeTiming[1]?.starttime ? storeTiming[1]?.starttime : "10:00",
        "hh-mm a"
      );
      storeTiming[1]?.starttime
        ? setTueStartDate(TueStart._d)
        : setTueStartDate(moment("10:00", "hh-mm a")._d);
      setTue(storeTiming[1]?.isStoreClosed);
      let TueEnd = moment(
        storeTiming[1]?.endtime ? storeTiming[1]?.endtime : "10:00",
        "hh-mm a"
      );
      storeTiming[1]?.endtime
        ? setTueEndDate(TueEnd._d)
        : setTueEndDate(moment("20:00", "hh-mm a")._d);

      let WedStart = moment(
        storeTiming[2]?.starttime ? storeTiming[2]?.starttime : "10:00",
        "hh-mm a"
      );
      storeTiming[2]?.starttime
        ? setWedStartDate(WedStart._d)
        : setWedStartDate(moment("10:00", "hh-mm a")._d);
      setWed(storeTiming[2]?.isStoreClosed);
      let WedEnd = moment(
        storeTiming[2]?.endtime ? storeTiming[2]?.endtime : "10:00",
        "hh-mm a"
      );
      storeTiming[2]?.endtime
        ? setWedEndDate(WedEnd._d)
        : setWedEndDate(moment("20:00", "hh-mm a")._d);

      let ThuStart = moment(
        storeTiming[3]?.starttime ? storeTiming[3]?.starttime : "10:00",
        "hh-mm a"
      );
      storeTiming[3]?.starttime
        ? setThuStartDate(ThuStart._d)
        : setThuStartDate(moment("10:00", "hh-mm a")._d);
      setThu(storeTiming[3]?.isStoreClosed);
      let ThuEnd = moment(
        storeTiming[3]?.endtime ? storeTiming[3]?.endtime : "10:00",
        "hh-mm a"
      );
      storeTiming[3]?.endtime
        ? setThuEndDate(ThuEnd._d)
        : setThuEndDate(moment("20:00", "hh-mm a")._d);

      let FriStart = moment(
        storeTiming[4]?.starttime ? storeTiming[4]?.starttime : "10:00",
        "hh-mm a"
      );
      storeTiming[4]?.starttime
        ? setFriStartDate(FriStart._d)
        : setFriStartDate(moment("10:00", "hh-mm a")._d);
      setFri(storeTiming[4]?.isStoreClosed);
      let FriEnd = moment(
        storeTiming[4]?.endtime ? storeTiming[4]?.endtime : "10:00",
        "hh-mm a"
      );
      storeTiming[4]?.endtime
        ? setFriEndDate(FriEnd._d)
        : setFriEndDate(moment("20:00", "hh-mm a")._d);

      let SatStart = moment(
        storeTiming[5]?.starttime ? storeTiming[5]?.starttime : "10:00",
        "hh-mm a"
      );
      storeTiming[5]?.starttime
        ? setSatStartDate(SatStart._d)
        : setSatStartDate(moment("10:00", "hh-mm a")._d);
      setSat(storeTiming[5]?.isStoreClosed);
      let SatEnd = moment(
        storeTiming[5]?.endtime ? storeTiming[5]?.endtime : "10:00",
        "hh-mm a"
      );
      storeTiming[5]?.endtime
        ? setSatEndDate(SatEnd._d)
        : setSatEndDate(moment("20:00", "hh-mm a")._d);

      let SunStart = moment(
        storeTiming[6]?.starttime ? storeTiming[6]?.starttime : "10:00",
        "hh-mm a"
      );
      storeTiming[6]?.starttime
        ? setSunStartDate(SunStart._d)
        : setSunStartDate(moment("10:00", "hh-mm a")._d);
      setSun(storeTiming[6]?.isStoreClosed);
      let SunEnd = moment(
        storeTiming[6]?.endtime ? storeTiming[6]?.endtime : "10:00",
        "hh-mm a"
      );
      storeTiming[6]?.endtime
        ? setSunEndDate(SunEnd._d)
        : setSunEndDate(moment("20:00", "hh-mm a")._d);
    } else {
      setSunEndDate(moment("20:00", "hh-mm a")._d);
      setSunStartDate(moment("10:00", "hh-mm a")._d);
      setSatEndDate(moment("20:00", "hh-mm a")._d);
      setSatStartDate(moment("10:00", "hh-mm a")._d);
      setFriEndDate(moment("20:00", "hh-mm a")._d);
      setFriStartDate(moment("10:00", "hh-mm a")._d);
      setThuEndDate(moment("20:00", "hh-mm a")._d);
      setThuStartDate(moment("10:00", "hh-mm a")._d);
      setWedEndDate(moment("20:00", "hh-mm a")._d);
      setWedStartDate(moment("10:00", "hh-mm a")._d);
      setTueEndDate(moment("20:00", "hh-mm a")._d);
      setTueStartDate(moment("10:00", "hh-mm a")._d);
      setMonEndDate(moment("20:00", "hh-mm a")._d);
      setMonStartDate(moment("10:00", "hh-mm a")._d);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (sunApplyToAll) {
        if (
          sunApplyToAll &&
          sunRef.current &&
          !sunRef.current.contains(e.target)
        ) {
          setSunApplyToAll(false);
        }
      } else if (monApplyToAll) {
        if (
          monApplyToAll &&
          monRef.current &&
          !monRef.current.contains(e.target)
        ) {
          setMonApplyToAll(false);
        }
      } else if (tueApplyToAll) {
        if (
          tueApplyToAll &&
          tueRef.current &&
          !tueRef.current.contains(e.target)
        ) {
          setTueApplyToAll(false);
        }
      } else if (wedApplyToAll) {
        if (
          wedApplyToAll &&
          wedRef.current &&
          !wedRef.current.contains(e.target)
        ) {
          setWedApplyToAll(false);
        }
      } else if (thuApplyToAll) {
        if (
          thuApplyToAll &&
          thuRef.current &&
          !thuRef.current.contains(e.target)
        ) {
          setThuApplyToAll(false);
        }
      } else if (friApplyToAll) {
        if (
          friApplyToAll &&
          friRef.current &&
          !friRef.current.contains(e.target)
        ) {
          setFriApplyToAll(false);
        }
      } else if (satApplyToAll) {
        if (
          satApplyToAll &&
          satRef.current &&
          !satRef.current.contains(e.target)
        ) {
          setSatApplyToAll(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [
    sunApplyToAll,
    monApplyToAll,
    tueApplyToAll,
    wedApplyToAll,
    thuApplyToAll,
    friApplyToAll,
    satApplyToAll,
  ]);

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {deleteModal && (
              <Delete
                modal={deleteModal}
                toggle={deleteModaltoggle}
                editWorkingHours={disabled}
                handleOnUpdate={updateSetting}
              />
            )}
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title"  
              // style={{pointerEvents: storeOnboardingTourStatus && (storeOnboardingCurrentTooltip === 'B2' || storeOnboardingCurrentTooltip === 'B2 with toast') && 'none'}}
              >
                <div onClick={() => {props.toggle() ; handleCloseTour()}} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Working hours</h2>
                </div>
              </div>
              {
                storeOnboardingTourStatus ? (
                <div className="modal-button">
                    <button onClick={(e) => opendeleteModal()}>Save</button>
                  </div> ):
                disabled ? (
                  <div className="modal-button">
                    <button onClick={(e) => opendeleteModal()}>Save</button>
                  </div>
                ) : (
                  <div className="modal-button">
                    <button disabled>Save</button>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
                   <div className="box-center relative">
                   {/* Working hours tooltip */}
                   {storeOnboardingTourStatus && storeOnboardingTooltipStatus && (storeOnboardingCurrentTooltip === 'B2'  || storeOnboardingCurrentTooltip === 'B2 with toast') &&
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                    
                    className="setting-profile-tooltip" style={{ pointerEvents: 'all'}}>
                  <div className="setup-profile-tooltip-design">
                      <h3>Working hours</h3>
                      <p>Write about appointment hours <br/>
                        staff working hours <br/>
                        edit working hourse later in the settings</p>
                  <div className="button-alignment">
                    <div>
                    <Link to="/barberatasklist">
                      <span onClick={(e)=>{dispatch(setOnboardingTourStatus(false)); dispatch(setOnboardingTooltipStatus(false))}}>Close Tour</span>
                    </Link>
                    </div>
                    <div>
                      <button onClick={(e) => toggleTooltip("gotIt")}>Got it</button>
                    </div>
                  </div>
                  <div className="tooltip-dot-design">
                    <div className="active-small-dot"></div>
                    <div className="zoom-dot"></div>
                  </div>
                  </div>
                </motion.div>
                  }
                  {/* Working hours  tooltip */}
                <div className="product-info-box add-new-staff-align">
                  <div className="heading-style">
                    <h3>Working hours</h3>
                  </div>
                  <div className="card-details">
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
                      {/* <div className="working-time-grid disable-background">
                      <div className="working-grid-items">
                        <span>Sunday</span>
                      </div>
                      <div className="working-grid-items">
                        <button>Off day</button>
                      </div>
                      <div className="working-grid-items">
                        <button>Off day</button>
                      </div>
                    </div>
                    {[0, 1, 2, 3, 4, 5].map(() => {
                      return (
                        <div className="working-time-grid">
                          <div className="working-grid-items">
                            <span>Sunday</span>
                          </div>
                          <div className="working-grid-items">
                            <button>00:00 am</button>
                          </div>
                          <div className="working-grid-items">
                            <button>00:00 am</button>
                          </div>
                        </div>
                      );
                    })} */}
                      <div
                        className={
                          sun
                            ? "working-time-grid disable-background"
                            : "working-time-grid"
                        }
                        ref={sunRef}
                      >
                        <div className="working-grid-items">
                          <input
                            type="checkbox"
                            name="workingDays"
                            value="Sunday"
                            checked={!sun}
                            onChange={(e) => {
                              setSun(!sun);
                              setDisabled(true);
                              handleSetting(e);
                            }}
                          />
                          <span>Sunday</span>
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {sun ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={sunStartDate}
                                onChange={(e) => SunStartTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {sun ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                onChange={(e) => SunEndTime(e)}
                                selected={sunEndDate}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        {sunApplyToAll && off && (
                          <div
                            className="apply-t-all-days"
                            onClick={(e) => applyToAllHandler(e, "sun")}
                          >
                            <span>Apply to all the days</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={
                          mon
                            ? "working-time-grid disable-background"
                            : "working-time-grid"
                        }
                        ref={monRef}
                      >
                        <div className="working-grid-items">
                          <input
                            type="checkbox"
                            name="workingDays"
                            value="Monday"
                            checked={!mon}
                            onChange={(e) => {
                              setMon(!mon);
                              setDisabled(true);
                              handleSetting(e);
                            }}
                          />
                          <span>Monday</span>
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {mon ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={monStartDate}
                                onChange={(e) => MonStartTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {mon ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={monEndDate}
                                onChange={(e) => MonEndTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        {monApplyToAll && off && (
                          <div
                            className="apply-t-all-days"
                            onClick={(e) => applyToAllHandler(e, "mon")}
                          >
                            <span>Apply to all the days</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={
                          tue
                            ? "working-time-grid disable-background"
                            : "working-time-grid"
                        }
                        ref={tueRef}
                      >
                        <div className="working-grid-items">
                          <input
                            type="checkbox"
                            name="workingDays"
                            value="Tuesday"
                            checked={!tue}
                            onChange={(e) => {
                              setTue(!tue);
                              setDisabled(true);
                              handleSetting(e);
                            }}
                          />
                          <span>Tuesday</span>
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {tue ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={tueStartDate}
                                onChange={(e) => TueStartTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {tue ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={tueEndDate}
                                onChange={(e) => TueEndTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        {tueApplyToAll && off && (
                          <div
                            className="apply-t-all-days"
                            onClick={(e) => applyToAllHandler(e, "tue")}
                          >
                            <span>Apply to all the days</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={
                          wed
                            ? "working-time-grid disable-background"
                            : "working-time-grid"
                        }
                        ref={wedRef}
                      >
                        <div className="working-grid-items">
                          <input
                            type="checkbox"
                            name="workingDays"
                            value="Wednesday"
                            checked={!wed}
                            onChange={(e) => {
                              setWed(!wed);
                              setDisabled(true);
                              handleSetting(e);
                            }}
                          />
                          <span>Wednesday</span>
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {wed ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={wedStartDate}
                                onChange={(e) => WedStartTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {wed ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                onChange={(e) => WedEndTime(e)}
                                selected={wedEndDate}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        {wedApplyToAll && off && (
                          <div
                            className="apply-t-all-days"
                            onClick={(e) => applyToAllHandler(e, "wed")}
                          >
                            <span>Apply to all the days</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={
                          thu
                            ? "working-time-grid disable-background"
                            : "working-time-grid"
                        }
                        ref={thuRef}
                      >
                        <div className="working-grid-items">
                          <input
                            type="checkbox"
                            name="workingDays"
                            value="Thursday"
                            checked={!thu}
                            onChange={(e) => {
                              setThu(!thu);
                              setDisabled(true);
                              handleSetting(e);
                            }}
                          />
                          <span>Thursday</span>
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {thu ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={thuStartDate}
                                onChange={(e) => ThuStartTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {thu ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                onChange={(e) => ThuEndTime(e)}
                                selected={thuEndDate}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        {thuApplyToAll && off && (
                          <div
                            className="apply-t-all-days"
                            onClick={(e) => applyToAllHandler(e, "thu")}
                          >
                            <span>Apply to all the days</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={
                          fri
                            ? "working-time-grid disable-background"
                            : "working-time-grid"
                        }
                        ref={friRef}
                      >
                        <div className="working-grid-items">
                          <input
                            type="checkbox"
                            name="workingDays"
                            value="Friday"
                            checked={!fri}
                            onChange={(e) => {
                              setFri(!fri);
                              setDisabled(true);
                              handleSetting(e);
                            }}
                          />
                          <span>Friday</span>
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {fri ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={friStartDate}
                                onChange={(e) => FriStartTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {fri ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                onChange={(e) => FriEndTime(e)}
                                selected={friEndDate}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        {friApplyToAll && off && (
                          <div
                            className="apply-t-all-days"
                            onClick={(e) => applyToAllHandler(e, "fri")}
                          >
                            <span>Apply to all the days</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={
                          sat
                            ? "working-time-grid disable-background"
                            : "working-time-grid"
                        }
                        ref={satRef}
                      >
                        <div className="working-grid-items">
                          <input
                            type="checkbox"
                            name="workingDays"
                            value="Saturday"
                            checked={!sat}
                            onChange={(e) => {
                              setSat(!sat);
                              setDisabled(true);
                              handleSetting(e);
                            }}
                          />
                          <span>Saturday</span>
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {sat ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                selected={satStartDate}
                                onChange={(e) => SatStartTime(e)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        <div className="working-grid-items  input-packge-time-style-chanage">
                          {sat ? (
                            <button
                              style={{
                                backgroundColor: "rgb(230, 102, 102, 0.3)",
                                color: "rgb(230, 102, 102)",
                              }}
                            >
                              Store Closed
                            </button>
                          ) : (
                            <button>
                              <DatePicker
                                onChange={(e) => SatEndTime(e)}
                                selected={satEndDate}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="hh:mm aa"
                              />
                            </button>
                          )}
                        </div>
                        {satApplyToAll && off && (
                          <div
                            className="apply-t-all-days"
                            onClick={(e) => applyToAllHandler(e, "sat")}
                          >
                            <span>Apply to all the days</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
