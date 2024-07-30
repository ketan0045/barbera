import React, { useState, useEffect, useContext, useRef } from "react";
import Carousel from "react-multi-carousel";
import { ApiPut, ApiGet, ApiPost } from "../../helpers/API/ApiData";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import { useHistory } from "react-router-dom";
import WelcomeModal from "../WelcomeFlow/WelcomeModal/index";
import Auth from "../../helpers/Auth";
import { getDateDay, getDateMonth } from "../../helpers/Common";
import Skeleton from "@material-ui/lab/Skeleton";
import AppointmentModal from "./Appointment/AppointmentModal";
import SalesAnalytics from "./SalesAnalytics";
import AppointmentAnalytics from "./AppointmentAnalytics";
import { logout } from "../../utils/auth.util";
import moment from "moment";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { Pie, Doughnut } from "react-chartjs-2";
import dateTime from "date-time";
import RescheduleModal from "./Appointment/RescheduleModal";
import Notify from "../../assets/svg/notify.svg";
import { toast } from "react-toastify";
import "../Sass/Home.scss";
import BellImage from "../../assets/svg/bell.svg";
import GenerateNewInvoice from "../Common/Modal/GenerateNewInvoice";
import SettingIcon from "../../assets/svg/setting.svg";
import PieChart from "../../assets/svg/pie-chart.svg";
import QuiteIcon from "../../assets/svg/quite-icon.svg";
import NoStaffIcon from "../../assets/svg/no-staff.svg";
import InvoiceNewIcon from "../../assets/svg/invoice-icon.svg";
import AddNew from "../../assets/svg/add-new.svg";
import CongImage from "../../assets/img/cong.png";
import CloseIcon from "../../assets/svg/close-icon.svg";
import ChildSidebar from "./Layout/ChildSidebar";
import AddNewAppointmentModal from "../Common/Modal/AddNewAppointmentModal";
import { v4 as uuidv4 } from "uuid";
import Success from "../Common/Toaster/Success/Success";
import ViewInvoiceModal from "../Common/Modal/ViewInvoiceModal";
import VisitAnalyticsModal from "../Common/Modal/VisitAnalyticsModal";
import SalesAnalyticsModal from "../Common/Modal/SalesAnalyticsModal";
import UserContext from "../../helpers/Context";
import StatementModal from "../Common/Modal/StatementModal";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./Home";
import * as userUtil from "../../utils/user.util";
import { get_Setting } from "../../utils/user.util";
import Slider from "react-slick";
import {
  getOperatorPermissions,
  setOperatorPermissions,
  setOperatorPermissionsId,
  setStaffPermissions,
  setStaffPermissionsId,
} from "../../redux/actions/permissionsActions";
import { getUserPermissions } from "../../redux/actions/userActions";
import TasklistProfile from "../TasklistProfile";
import {
  setOnboardingCurrentTooltip,
  setOnboardingStatus,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../redux/actions/onboardingActions";
import AttendanceModal from "../Common/Modal/Attendance/AttendanceModal";
import AttendanceRequest from "../Common/Modal/AttendanceRequest";
import Expenses from "../Common/Modal/Expenses/Expenses";
import SearchIcon from "../../assets/svg/search-icon.svg";
import DropDownIcon from "../../assets/svg/drop-down.svg";
import useRoveFocus from "../Common/Modal/UseRoveFocus";
import {
  setattendanceDate,
  setattendanceMarkDate,
} from "../../redux/actions/attendanceActions";
import UpgradePlan from "../Common/Modal/Monitization/UpgradePlan";
import {
  setfirstReminderDate,
  setsecondReminderDate,
  setthirdReminderDate,
} from "../../redux/actions/monitizationActions";
import Loader from "../Common/Loader/Loader";

const ArrowLeft = <i class="fas fa-chevron-left cursor-pointer"></i>;
const ArrowRight = <i class="fas fa-chevron-right cursor-pointer"></i>;

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};
export const Home = () => {
  let SettingInfo = JSON.parse(localStorage.getItem("setting"));
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
  const attendanceDate = useSelector((state) => state.attendanceDate);
  const attendanceMarkDates = useSelector((state) => state.attendanceMarkDate);
  const trialDays = useSelector((state) => state.trialDays);

  const firstReminderDate = useSelector((state) => state.firstReminderDate);
  const secondReminderDate = useSelector((state) => state.secondReminderDate);

  const thirdReminderDate = useSelector((state) => state.thirdReminderDate);

  useEffect(async () => {
    let temExpectedClockInTime = moment(new Date(), "hh:mm A");

    var date2 = moment(new Date()).format("L")?.toString();
    var time2 = temExpectedClockInTime?._i?.toString();
    var dateTime = moment(date2 + " " + time2, "MM/DD/YYYY hh:mm A");
    let tempFinalTime = moment(dateTime, "YYYY-MM-DD hh:mm A").format("LLLL");
    setAttendaceDateMark(attendanceMarkDates);
    const SettingDataa = get_Setting();
    if (
      moment(attendanceDate).format("L") != "Invalid date" ||
      SettingDataa?.attendanceDate
    ) {
      if (
        moment(SettingDataa?.attendanceDate).format("L") !==
          moment(new Date()).format("L") &&
        SettingDataa?.attendence?.attendanceToggle
      ) {
        setOpenRequestModal(!openRequestModal);
        setAttendaceMark(true);
        let values = {
          attendanceDate: new Date(),
          companyId: userInfo.companyId,
        };
        let todayDate = moment(new Date()).format("dddd");
        let res = await ApiPost("setting/", values);
        try {
          if (res.data.status === 200) {
            userUtil.setSetting(res?.data?.data[0]);
            dispatch(setattendanceDate(new Date()));
          }
        } catch (err) {
          console.log(err);
        }
        let filterStaffData;
        try {
          let staffResponse = await ApiGet(
            "staff/company/" + userInfo.companyId
          );
          if (staffResponse?.data?.status === 200) {
            let data = {
              startTime: moment(new Date()).format("YYYY-MM-DD"),
              endTime: moment(new Date()).add("day", 1).format("YYYY-MM-DD"),
            };
            // let staffData = staffResponse?.data?.data?.slice(1);
            filterStaffData = staffResponse?.data?.data?.filter((obj) =>
              obj?.firstName === "Unassign" ? null : obj
            );
          } else {
            console.log("in the else");
          }
        } catch (err) {
          setStaffLoading(false);
          console.log("error while getting Staff Details", err);
        }

        let data = {
          startTime: moment(new Date()).format("YYYY-MM-DD"),
          endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
        };

        await ApiPost("attendence/company/" + userInfo.companyId, data)
          .then(async (res) => {
            let tempData = res.data.data?.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
            let tempAttendanceData = removeDuplicateObjectFromArray(
              tempData,
              "staffId"
            );
            let tempStaffNotRequestedData = tempAttendanceData.filter(
              (data) => data?.currentStatus?.toLowerCase() !== "present"
            );

            let tempStaffRequestedData = tempAttendanceData.filter(
              (data) => data?.activeStatus
              // (data) => data?.currentStatus?.toLowerCase() === "present" && !data?.activeStatus
            );
            let tempNonRequestedStaffDetails =
              tempStaffRequestedData?.length === 0
                ? filterStaffData
                : filterStaffData.filter(
                    (staff) =>
                      !tempStaffRequestedData.find(
                        (data) => data?.staffId === staff?._id
                      )
                  );

            let datesss = moment(new Date()).format("dddd");
            let offDays = 1;
            let staffDatass = tempNonRequestedStaffDetails.map(
              (staffDetails) => {
                staffDetails?.workingDays?.map(async (day) => {
                  if (day?.dayOff === true) {
                    if (day?.Day === datesss) {
                      return (offDays = offDays + 1);
                    }
                  }
                });
              }
            );

            if (
              moment(attendanceMark).format("L") !==
                moment(new Date()).format("L") &&
              offDays != 1
            ) {
              tempNonRequestedStaffDetails.map((staffDetails) => {
                staffDetails?.workingDays?.map(async (day) => {
                  if (day?.dayOff === true) {
                    if (day?.Day === todayDate) {
                      let data = [
                        {
                          staffId: staffDetails?._id,
                          status: "Off-day",
                          currentStatus: "dayOff",
                          companyId: staffDetails?.companyId,
                          date: moment
                            .utc(new Date(tempFinalTime))
                            .subtract(3, "hour")
                            .format(),
                          clockinTime: new Date(),
                        },
                      ];
                      await ApiPost("attendence", data)
                        .then((resp) => {})
                        .catch((err) => {
                          console.log(err);
                        });
                      return (
                        <>
                          <button
                            style={{
                              color: "#6F737D",
                              fontFamily: "Poppins",
                              fontStyle: "normal",
                              fontWeight: "500",
                              fontSize: "11px",
                              background: "rgba(111, 115, 125, 0.15)",
                            }}
                          >
                            Off-day
                          </button>
                        </>
                      );
                    }
                  } else if (day?.Day === todayDate) {
                    return (
                      <>
                        <button>Awaiting</button>
                      </>
                    );
                  }
                });
              });
              let values = {
                attendanceMarkDate: new Date(),
                companyId: userInfo.companyId,
              };
              let respo = await ApiPost("setting/", values);
              try {
                if (respo.data.status === 200) {
                  userUtil.setSetting(respo?.data?.data[0]);
                  dispatch(setattendanceMarkDate(new Date()));
                  setAttendaceDateMark(new Date());
                  attendanceMark = new Date();
                }
              } catch (err) {
                console.log(err);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, []);

  const handleOnboardingGotSMS = () => {
    dispatch(setOnboardingCurrentTooltip("finish"));
    dispatch(setOnboardingTooltipStatus(false));
    setTimeout(() => {
      dispatch(setOnboardingTooltipStatus(true));
    }, 250);
  };

  const handleOnboardingTourComplete = async () => {
    let onboardingUpdateProfileData = {
      companyId: userInfo?.companyId,
      onboardProcess: [
        {
          onboardingStatus: false,
          onboardingCompleted: true,
          onboardingTourProgress: 100,
          onboardingProfileUpdated: true,
        },
      ],
    };
    await ApiPost("setting/", onboardingUpdateProfileData)
      .then((res) => {
        dispatch(setOnboardingStatus(false));
        dispatch(setOnboardingTooltipStatus(false));
        dispatch(setOnboardingTourStatus(false));
        dispatch(setOnboardingTourProgress(100));
        dispatch(setOnboardingCurrentTooltip(""));
        userUtil.setSetting(res?.data?.data[0]);
      })
      .catch((err) => console.log(err));
  };

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const optionRef = useRef();
  const optionRefrences = useRef();
  // const toggleClass = () => {
  //     let divEle = document.getElementById('main-contain')
  //     divEle.classList.toggle('content-blur')
  // }
  const userInfo = Auth.getUserDetail();
  const permission = userInfo.permission;
  const uuid = uuidv4();
  const {
    setIsDisable,
    setIsMembership,
    setIsMembershipType,
    setApplyMembershipBenefit,
  } = useContext(UserContext);
  const [dashboardValues, setDashboardValues] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [moreInformation, setMoreInformation] = useState(false);
  const [cancelledAppointment, setCancelledAppointment] = useState(false);
  const [moreOptionMenu, setMoreOptionMenu] = useState(false);
  const [loungeList, setLoungeList] = useState([]);
  const [upcomingAppointmentDateList, setUpcomingAppointmentDateList] =
    useState([]);
  const [loading, setLoading] = useState(false);
  const [loungeLoading, setLoungeLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [lounge, setLounge] = useState(false);
  const [popular_hours, setPopular_hours] = useState(false);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState();
  const [openGenerateNewModal, setOpenGenerateNewModal] = useState(false);
  const [weeklySales, setWeeklySales] = useState();
  const [startOfWeek, setStartOfWeek] = useState();
  const [visit, setVisit] = useState();
  const [endOfWeek, setEndOfWeek] = useState();
  const [weeklyAppointment, setWeeklyAppointment] = useState();
  const [totalvalues, setTotalValues] = useState();
  const [allInvoiceData, setAllInvoiceData] = useState([]);
  const [reschedule, setReschedule] = useState(false);
  const [dailyTotalSales, setDailyTotalSales] = useState();
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  const [more, setMore] = useState();
  const [startDate, setStartDate] = useState(
    moment().clone().startOf("today").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().clone().endOf("today").format("YYYY-MM-DD")
  );
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [visitAnalytics, setVisitAnalytics] = useState(false);
  const [salesAnalytics, setSalesAnalytics] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [openeditmodal, SetOpenEditModal] = useState(false);
  const [editAppointment, SetEditAppointment] = useState();
  const [rescheduleAppointments, setRescheduleAppointments] = useState();
  const [opennewinvoice, setOpenNewInvoice] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const [todayAppointment, setTodayAppointment] = useState();
  const [sortAppointment, setSortAppointment] = useState();
  const [sortInvoice, setSortInvoice] = useState();
  const [todayUpcomingAppointment, setTodayUpcomingAppointment] = useState();
  const [selectDate, setSelectDate] = useState();
  const [onboardInvoiceData, setOnboardInvoiceData] = useState([]);
  const [staffRequestedData, setStaffRequestedData] = useState([]);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestedStaffDetails, setRequestedStaffDetails] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [showDefault, setShowDefault] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState(false);
  const [openExpencemodal, SetOpenExpencemodal] = useState(false);
  const [attendanceMark, setAttendaceMark] = useState(false);
  const [appFilter, setAppFilter] = useState("Upcoming");
  const [search, setSearch] = useState();
  const [focus, setFocus] = useRoveFocus(0);
  const [attendanceMarkDate, setAttendaceDateMark] = useState();
  const [openPlanmodal, setOpenPlanmodal] = useState(false);
  const [salesData, setSalesData] = useState({});
  const history = useHistory();
  const [expenseDisable, setExpenseDisable] = useState(true);

  useEffect(async () => {
   
      if (trialDays !== "") {
        if (trialDays <= 0) {
          history.push("/setting?plan=expire");
        }
      }

      if (trialDays == 3) {
        if (
          allInvoiceData
            ?.slice(0)
            .filter(
              (obj) =>
                moment(obj.created).format("DD-MM-YYYY") ===
                moment(new Date()).format("DD-MM-YYYY")
            ).length === 2 &&
          moment(firstReminderDate).format("DD MM YYYY") ==
            moment(new Date()).format("DD MM YYYY")
        ) {
          setOpenPlanmodal(true);
        }
        var beginningTime = moment("06:30pm", "h:mma");
        var endTime = moment(moment(new Date()).format("hh:mma"), "h:mma");
        if (
          beginningTime.isBefore(endTime) &&
          moment(thirdReminderDate).format("DD MM YYYY") ==
            moment(new Date()).format("DD MM YYYY")
        ) {
          setOpenPlanmodal(true);
        }

        if (
          moment(moment(thirdReminderDate).format("yyyy-MM-DD")).isBefore(
            moment(new Date()).format("yyyy-MM-DD")
          )
        ) {
          if (trialDays < 3) {
            setOpenPlanmodal(true);
          }
          let values = {
            thirdReminderDate: new Date(),
            companyId: userInfo.companyId,
          };
          let res = await ApiPost("setting/", values);
          try {
            if (res.data.status === 200) {
              userUtil.setSetting(res?.data?.data[0]);
              dispatch(setthirdReminderDate(new Date()));
            }
          } catch (err) {}
        }
        if (
          moment(moment(firstReminderDate).format("yyyy-MM-DD")).isBefore(
            moment(new Date()).format("yyyy-MM-DD")
          )
        ) {
          let values = {
            firstReminderDate: new Date(),
            companyId: userInfo.companyId,
          };
          let res = await ApiPost("setting/", values);
          try {
            if (res.data.status === 200) {
              userUtil.setSetting(res?.data?.data[0]);
              dispatch(setfirstReminderDate(new Date()));
            }
          } catch (err) {}
        }
      }
      if (trialDays <= 2 && trialDays >= 1) {
       
        if (
          allInvoiceData
            ?.slice(0)
            .filter(
              (obj) =>
                moment(obj.created).format("DD-MM-YYYY") ===
                moment(new Date()).format("DD-MM-YYYY")
            ).length === 2 &&
          moment(firstReminderDate).format("DD MM YYYY") ==
            moment(new Date()).format("DD MM YYYY")
        ) {
          setOpenPlanmodal(true);
        }
        var beginningtime = moment("03:00pm", "h:mma");
        var endtime = moment(moment(new Date()).format("hh:mma"), "h:mma");
        if (
          beginningtime.isBefore(endtime) &&
          moment(secondReminderDate).format("DD MM YYYY") ==
            moment(new Date()).format("DD MM YYYY")
        ) {
          setOpenPlanmodal(true);
        }
        var beginningTime = moment("06:30pm", "h:mma");
        var endTime = moment(moment(new Date()).format("hh:mma"), "h:mma");
        if (
          beginningTime.isBefore(endTime) &&
          moment(thirdReminderDate).format("DD MM YYYY") ==
            moment(new Date()).format("DD MM YYYY")
        ) {
          setOpenPlanmodal(true);
        }
        if (
          moment(moment(firstReminderDate).format("yyyy-MM-DD")).isBefore(
            moment(new Date()).format("yyyy-MM-DD")
          )
        ) {
          let values = {
            firstReminderDate: new Date(),
            companyId: userInfo.companyId,
          };
          let res = await ApiPost("setting/", values);
          try {
            if (res.data.status === 200) {
              userUtil.setSetting(res?.data?.data[0]);
              dispatch(setfirstReminderDate(new Date()));
            }
          } catch (err) {}
        }
        if (
          moment(moment(secondReminderDate).format("yyyy-MM-DD")).isBefore(
            moment(new Date()).format("yyyy-MM-DD")
          )
        ) {
          setOpenPlanmodal(true);
          let values = {
            secondReminderDate: new Date(),
            companyId: userInfo.companyId,
          };
          let res = await ApiPost("setting/", values);
          try {
            if (res.data.status === 200) {
              userUtil.setSetting(res?.data?.data[0]);
              dispatch(setsecondReminderDate(new Date()));
            }
          } catch (err) {}
        }

        if (
          moment(moment(thirdReminderDate).format("yyyy-MM-DD")).isBefore(
            moment(new Date()).format("yyyy-MM-DD")
          )
        ) {
          setOpenPlanmodal(true);
          let values = {
            thirdReminderDate: new Date(),
            companyId: userInfo.companyId,
          };
          let res = await ApiPost("setting/", values);
          try {
            if (res.data.status === 200) {
              userUtil.setSetting(res?.data?.data[0]);
              dispatch(setthirdReminderDate(new Date()));
            }
          } catch (err) {}
        }
      }
    

  }, [trialDays, allInvoiceData, secondReminderDate]);

  useEffect(async () => {
    if (userInfo && userInfo.role === "Staff") {
      let staffData = [];
      staffData.push(userInfo);
      setStaffData(staffData);
    } else {
      getStaffByCompany();
    }
  }, []);

  useEffect(async () => {
    // if (userInfo && userInfo.role === "Staff") {
    //   let staffData = [];
    //   staffData.push(userInfo);
    //   setStaffData(staffData);
    // } else {
    //   getStaffByCompany();
    // }
    getDashboardBySales();
    getMembershipSales();
    setMoreInformation(false);
    setMoreOptionMenu(false);
    SetEditAppointment();
    setRescheduleAppointments();
    // setInnerSize();
    getInvoices();
    getTotalSales();
    getDashboardByCompany();
    getAnalytics();
    getDashboardByAppointment(moment().format("YYYY-MM-DD"));
    getAppointmentDates();

    getSetting();
    getPermissions();
  }, [success]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (moreOptionMenu) {
        if (
          moreOptionMenu &&
          optionRef.current &&
          !optionRef.current.contains(e.target)
        ) {
          setMoreOptionMenu(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [moreOptionMenu]);

  useEffect(() => {
    const checkIfClickedOutsides = (e) => {
      if (focus !== 0) {
        if (optionRef.current && !optionRef.current.contains(e.target)) {
          setFocus(0);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutsides);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutsides);
    };
  }, [focus]);

  const checkClockinTime = async (filterStaffData) => {
    let data = {
      startTime: moment(new Date()).format("YYYY-MM-DD"),
      endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
    };
    let allStaffData;
    if (filterStaffData) {
      allStaffData = filterStaffData;
    } else {
      allStaffData = allStaff;
    }

    await ApiPost("attendence/company/" + userInfo.companyId, data)
      .then((res) => {
        let tempData = res.data.data?.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        let tempAttendanceData = removeDuplicateObjectFromArray(
          tempData,
          "staffId"
        );
        let tempStaffRequestedData = tempAttendanceData.filter(
          (data) => data?.activeStatus && data?.currentStatus !== "clockIn"
        );
        let RequestedData = tempAttendanceData.filter(
          (data) =>
            data?.activeStatus &&
            data?.currentStatus !== "clockIn" &&
            data?.skip !== true
        );

        setStaffRequestedData(tempStaffRequestedData);
        if (RequestedData?.length > 0) {
          setOpenRequestModal(!openRequestModal);
        }

        let tempRequestedStaffDetails = allStaffData.filter((staff) => {
          let thisStaffData = tempStaffRequestedData.find(
            (data) => data?.staffId === staff?._id
          );
          return !!thisStaffData;
        });
        setRequestedStaffDetails(tempRequestedStaffDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1200);
    return () => clearTimeout(timer);
  });
  var _ = require("lodash");
  let response = _.groupBy(appointmentList, "uuid");
  const appointmentListData = Object.values(response);

  const newAppointment = appointmentList.filter((obj) => obj?.status === 1);
  const finalAppointment = newAppointment.filter(
    (obj) =>
      moment.utc(obj?.date).format("HH:mm") >=
      moment.utc(dateTime()).format("HH:mm")
  );
  const occupiedAppointment = newAppointment.filter(
    (obj) =>
      moment.utc(obj?.date).add(obj?.time, "minutes").format("HH:mm") >=
      moment.utc(dateTime()).format("HH:mm")
  );

  const data = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#FDB45C", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#FDB45C", "#0B84A5"],
        data: [
          sortInvoice?.ServicePrice,
          sortInvoice?.productPrice,
          salesData?.memberShip,
        ],
      },
    ],
  };
  const nullData = {
    // labels: ["No data found"],
    datasets: [
      {
        backgroundColor: ["#F6FBFF"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#F6FBFF"],
        data: [1],
      },
    ],
  };
  const state = {
    labels: ["Upcoming", "No shows", "Completed", "Cancelled"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#6F737D", "#FDB45C", "#F7464A"],
        borderWidth: [0, 0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#6F737D", "#FDB45C", "#F7464A"],
        data: [
          sortAppointment?.upcoming,
          sortAppointment?.noShow,
          sortInvoice?.complete,
          sortAppointment?.cancel,
        ],
      },
    ],
  };

  const getAppointmentDates = () => {
    let today = moment();
    let after7DayDate = moment().add(5, "days");

    let tempDateList = [];
    for (let index = 0; index < 6; index++) {
      tempDateList.push(moment().add(index, "days").format("YYYY-MM-DD"));
    }
    setUpcomingAppointmentDateList(tempDateList);
    setSelectedAppointmentDate(tempDateList[0]);
    setUpcomingDates(
      `${today.date()} ${today.format(
        "MMM"
      )} - ${after7DayDate.date()} ${after7DayDate.format("MMM")}`
    );
  };

  const [upcomingDates, setUpcomingDates] = useState();

  const renderMobileSidebar = () => {
    let divEle = document.getElementsByClassName("sidebar-banner")[0];
    divEle.classList.toggle("sidebar-display");
  };
  const getMembershipSales = async (data) => {
    let temEndDate = moment(new Date()).add(1, "days")._d;
    let payload = {
      startTime: moment(new Date()).format("L"),
      endTime: moment(temEndDate).format("L"),
    };
    let res = await ApiPost(
      "dashboard/sales/visits/company/apointment/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setSalesData(res.data.data);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };
  const getDashboardBySales = async (data) => {
   
    let today = moment().format("YYYY-MM-DD");
    try {
      let Body = {
        startTime: today,
        endTime: today,
        companyId: userInfo.companyId,
      };
      let res = await ApiPost(
        "dashboard/sales/visits/dashboard/company/apointment/" +
          userInfo.companyId,
        Body
      );

      if (res.data.status === 200) {
        let details = res.data.data.appointment;
        details["dates"] = [];
        details["cancel"] = [];
        details["noShow"] = [];
        details["upcoming"] = [];
        details["total"] = [];
        for (var key in details) {
          if (
            key === "cancel" ||
            key === "dates" ||
            key === "noShow" ||
            key === "upcoming" ||
            key === "total"
          )
            break;
          details["dates"].push(moment(key).format("DD MMM YYYY"));
          details["cancel"].push(details[key].cancel);
          details["noShow"].push(details[key].noShow);
          details["upcoming"].push(details[key].upcoming);
          details["total"].push(details[key].total);
        }
        setSortAppointment(details);
        let todayAppointment =
          details && details.total.reduce((a, b) => a + b, 0);
        // setTodayAppointment(todayAppointment);
      }

      if (res.data.status === 200) {
        let details = res.data.data.invoice;
        details["dates"] = [];
        details["ServicePrice"] = [];
        details["complete"] = [];
        details["data"] = [];
        details["productPrice"] = [];
        for (var key in details) {
          if (
            key === "dates" ||
            key === "ServicePrice" ||
            key === "complete" ||
            key === "data" ||
            key === "productPrice"
          )
            break;
          details["dates"].push(moment(key).format("DD MMM YYYY"));
          details["ServicePrice"].push(details[key].ServicePrice);
          details["complete"].push(details[key].complete);
          details["data"].push(details[key].data);
          details["productPrice"].push(details[key].productPrice);
        }
        setSortInvoice(details);
        let todayupcomingAppointment =
          details && details.complete.reduce((a, b) => a + b, 0);
        setTodayUpcomingAppointment(todayupcomingAppointment);
      }

      if (res.data.status === 200) {
        setDailyTotalSales(res.data.data);
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  useEffect(() => {
    getDashboardBySales();
    getMembershipSales();
  }, []);

  const getDashboardByAppointment = async (date) => {

    let today = moment().format("YYYY-MM-DD");
    today === date && setLoungeLoading(false);
    try {
      let apiDataAppointment = {
        starttime: date,
      };

      let dasboardValuesByAppointment = await ApiPost(
        "dashboard/company/apointment/" + userInfo.companyId,
        apiDataAppointment
      );

      if (dasboardValuesByAppointment.data.status === 200) {
        let dashData;
        if (userInfo && userInfo.role === "Staff") {
          dashData = dasboardValuesByAppointment.data.data.filter(
            (apt) => apt.staffId._id === userInfo._id
          );
        } else {
          dashData = dasboardValuesByAppointment.data.data;
        }
        let upcominginvoiceData =
          dashData?.length > 0 && dashData?.filter((obj) => obj?.status === 1);
        setAppFilter("Upcoming");
        setSearch("");
        if (today === date) {
          setLoungeList(dashData);
          if (upcominginvoiceData?.length > 0) {
            setAppointmentList(upcominginvoiceData);
          } else {
            setAppointmentList([]);
          }
        } else {
          if (upcominginvoiceData?.length > 0) {
            setAppointmentList(upcominginvoiceData);
          } else {
            setAppointmentList([]);
          }
          setLoungeList(dashData);
        }
      }
    } catch (err) {
    
      setLoungeLoading(false);
      console.log("error while getting Categories", err);
    }
  
    setLoungeLoading(false);
  };

  const getDashboardByCompany = async (data) => {
    try {
      let dasboardValuesByCompany;
      if (userInfo.role === "Staff") {
        let apiDataCompany = {
          starttime: moment().clone().startOf(data).format("YYYY-MM-DD"),
          endTime: moment().clone().endOf(data).format("YYYY-MM-DD"),
          staffId: userInfo._id,
        };
        dasboardValuesByCompany = await ApiPost(
          "dashboard/company/staff/value/statistic/" + userInfo.companyId,
          apiDataCompany
        );
      } else {
        let apiDataCompany = {
          starttime: moment().clone().startOf(data).format("YYYY-MM-DD"),
          endTime: moment().clone().endOf(data).format("YYYY-MM-DD"),
        };
        dasboardValuesByCompany = await ApiPost(
          "dashboard/company/" + userInfo.companyId,
          apiDataCompany
        );
      }
      if (dasboardValuesByCompany.data.status === 200) {
        let dashData = dasboardValuesByCompany.data.data;
        setDashboardValues(dasboardValuesByCompany.data.data);
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const getTotalSales = async () => {
    try {
      let totalsales;
      if (userInfo.role === "Staff") {
        let apiDataCompany = {
          starttime: moment().clone().startOf("today").format("YYYY-MM-DD"),
          endTime: moment().clone().endOf("today").format("YYYY-MM-DD"),
          staffId: userInfo._id,
        };
        totalsales = await ApiPost(
          "dashboard/company/staff/value/statistic/" + userInfo.companyId,
          apiDataCompany
        );
      } else {
        let apiDataCompany = {
          starttime: moment().clone().startOf("today").format("YYYY-MM-DD"),
          endTime: moment().clone().endOf("today").format("YYYY-MM-DD"),
        };
        totalsales = await ApiPost(
          "dashboard/company/" + userInfo.companyId,
          apiDataCompany
        );
      }
      if (totalsales.data.status === 200) {
        setVisit(totalsales.data.data.booking);
        setTotalValues(totalsales.data.data.finalAmount);
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const getAnalytics = async (e) => {
    try {
      const startOfWeek = moment().clone().startOf("week").format("YYYY-MM-DD");
      const endOfWeek = moment().clone().endOf("week").format("YYYY-MM-DD");
      setStartOfWeek(startOfWeek);
      setEndOfWeek(endOfWeek);
      let analyticsData;
      if (userInfo.role === "Staff") {
        let apiDataCompany = {
          startTime: startOfWeek,
          endTime: endOfWeek,
          staffId: userInfo._id,
          compnayId: userInfo.companyId,
        };
        analyticsData = await ApiPost(
          "dashboard/company/getStaffStatistic/value/data",
          apiDataCompany
        );

        let details = analyticsData.data.data;
        details["dates"] = [];
        details["amount"] = [];
        details["booking"] = [];
        details["cancel"] = [];
        details["totalAppts"] = 0;
        for (var key in details) {
          if (
            key === "amount" ||
            key === "dates" ||
            key === "booking" ||
            key === "cancel" ||
            key === "totalAppts"
          )
            break;
          details["dates"].push(moment(key).format("DD MMM YYYY"));
          details["amount"].push(details[key].amount);
          details["booking"].push(details[key].booking);
          details["totalAppts"] = details["totalAppts"] + details[key].booking;
          details["cancel"].push(details[key].cancel);
          // details[getDateDay(key)] = details[key];
        }
        setAnalyticsData(details);
        let weeklySales = details && details.amount.reduce((a, b) => a + b, 0);
        setWeeklySales(weeklySales);

        let weeklyAppointment =
          details && details.booking.reduce((a, b) => a + b, 0);
        setWeeklyAppointment(weeklyAppointment);

        // let dailySales = details && details.amount[0]
        // setDailySales(dailySales)

        // analyticsData.data.data['dates'] = [];
        // analyticsData && analyticsData.length && analyticsData.data.data.appointmentList.map((apt) => {
        //   analyticsData.data.data.appointmentList['dates'].push(moment(apt.date).format("DD MMM YYYY"));
        // })
        // setAnalyticsData(analyticsData.data.data);
        // setWeeklySales(analyticsData.data.data.finalAmount)
        // setWeeklyAppointment(analyticsData.data.data.booking)
      } else {
        let analyticsPayload = {
          companyId: userInfo.companyId,
          startTime: startOfWeek,
          endTime: endOfWeek,
        };
        analyticsData = await ApiPost(
          "dashboard/company/getAllStatistic/value",
          analyticsPayload
        );
        if (analyticsData.data.status === 200) {
          let details = analyticsData.data.data;
          details["dates"] = [];
          details["amount"] = [];
          details["booking"] = [];
          details["cancel"] = [];
          details["totalAppts"] = 0;
          for (var key in details) {
            if (
              key === "amount" ||
              key === "dates" ||
              key === "booking" ||
              key === "cancel" ||
              key === "totalAppts"
            )
              break;
            details["dates"].push(moment(key).format("DD MMM YYYY"));
            details["amount"].push(details[key].amount);
            details["booking"].push(details[key].booking);
            details["totalAppts"] =
              details["totalAppts"] + details[key].booking;
            details["cancel"].push(details[key].cancel);
            // details[getDateDay(key)] = details[key];
          }

          setAnalyticsData(details);
          let weeklySales =
            details && details.amount.reduce((a, b) => a + b, 0);
          setWeeklySales(weeklySales);
          let weeklyAppointment =
            details && details.booking.reduce((a, b) => a + b, 0);
          setWeeklyAppointment(weeklyAppointment);
        } else {
          console.log("in the else");
        }
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  const getStaffByCompany = async () => {
    setLoading(true);
    try {
      setStaffLoading(true);
      let staffResponse = await ApiGet("staff/company/" + userInfo.companyId);
      if (staffResponse?.data?.status === 200) {
        let data = {
          startTime: moment(new Date()).format("YYYY-MM-DD"),
          endTime: moment(new Date()).add("day", 1).format("YYYY-MM-DD"),
        };
        // let staffData = staffResponse?.data?.data?.slice(1);
        let filterStaffData = staffResponse?.data?.data?.filter((obj) =>
          obj?.firstName === "Unassign" ? null : obj
        );
        let attendanceRes = await ApiPost(
          "attendence/company/" + userInfo.companyId,
          data
        );
        if (attendanceRes?.data?.status === 200) {
          let tempData = attendanceRes.data.data?.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          let tempAttendanceData = removeDuplicateObjectFromArray(
            tempData,
            "staffId"
          );
          setAttendanceData(tempAttendanceData);
        }

        setAllStaff(filterStaffData);
        checkClockinTime(filterStaffData);
        setStaffData(filterStaffData);
      
      } else {
        console.log("in the else");
      }
    } catch (err) {
      setStaffLoading(false);
      console.log("error while getting Staff Details", err);
    }
    setLoading(false)
    setStaffLoading(false);
  };

  const getSetting = async (e) => {
    // let res = await ApiGet("setting/company/" + userInfo.companyId);
    const settingData = get_Setting();

    // console.log("settingData",settingData.membership.applyMembershipBenefits);

    // try {
    //   if (res.data.status === 200) {
    // setLounge(res.data.data[0].lounge);
    // setPopular_hours(res.data.data[0].popularHours);
    // console.log("Lounge",res);
    setIsDisable(settingData?.inventory?.enableInventory);
    setExpenseDisable(settingData?.collections?.enableCollection)
    setIsMembership(settingData?.membership?.membership);
    setIsMembershipType(settingData?.membership?.membershipBenefits);
    setApplyMembershipBenefit(
      settingData?.membership?.applyMembershipBenefits
        ? "Same invoice"
        : "Next invoice"
    );
    //   } else {
    //     console.log("in the else");
    //   }
    // } catch (err) {
    //   console.log("in the catch");
    // }
  };

  const getInvoices = async () => {
    let res = await ApiGet("invoice/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        let filterData = res.data.data?.filter((obj) => obj?.isActive === true);
        setAllInvoiceData(filterData);
        if (
          res?.data?.data?.length >= 1 &&
          storeOnboardingTourProgress !== 100 &&
          !storeOnboardingTourStatus &&
          !storeOnboardingTooltipStatus
        ) {
          // handleOnboardingTourComplete()
        }
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const [addNewAppointment, setAddNewAppointment] = useState(false);

  const AddNewAppointmentModaltoggle = (data) => {
    setAddNewAppointment(!addNewAppointment);
    if (addNewAppointment === true) {
      if (data) {
        if (userInfo && userInfo.role === "Staff") {
          let staffData = [];
          staffData.push(userInfo);
          setStaffData(staffData);
        } else {
          getStaffByCompany();
        }
        if (data?.data?.status === 200) {
          setSuccess(true);
          setToastmsg("Appointment booked!");
        } else {
          setSuccess(true);
          setEr("Eroor");
          setToastmsg("Something went wrong");
        }
      }
      getDashboardByAppointment(moment().format("YYYY-MM-DD"));
    }
  };

  const [childSidebar, setChildSidebar] = useState(false);

  const [statementModal, setStatementModal] = useState(false);
  const statementToggle = () => setStatementModal(!statementModal);

  const [editAppointmentmodal, setEditAppointmentModal] = useState(false);
  const editAppointmentModaltoggle = () => {
    setEditAppointmentModal(!editAppointmentmodal);
    // window.location.reload()
    if (editAppointmentmodal === true) {
    }
  };
  // const editAppointment = () => {
  //   window.location.reload();
  // };

  const [openSalesAnalytics, setOpenSalesAnalytics] = useState(false);
  const openSalesAnalyticsToggle = () =>
    setOpenSalesAnalytics(!openSalesAnalytics);

  const [openAppointmentAnalytics, setOpenAppointmentAnalytics] =
    useState(false);
  const openAppointmentAnalyticsToggle = () =>
    setOpenAppointmentAnalytics(!openAppointmentAnalytics);

  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [appointment, setAppointment] = useState();
  const rescheduleAppointmentModal = (appointment) => {
    setAppointment(appointment);
    rescheduleAppointmentModaltoggle();
  };
  const rescheduleAppointmentModaltoggle = () => {
    setOpenRescheduleModal(!openRescheduleModal);
    if (openRescheduleModal === true) {
      rescheduleAppointmenttoggle();
    }
  };
  const generateInvoiceOnClick = () => {
    OpenGenerateNewtoggle();
  };
  const OpenGenerateNewtoggle = (data) => {
    setOpenGenerateNewModal(!openGenerateNewModal);
    getInvoices();

    if (openGenerateNewModal === true) {
      if (data) {
        setOnboardInvoiceData(data?.data?.data);
        if (storeOnboardingTourStatus) {
          setSuccess(true);
          setToastmsg("Invoice Generated!");
          return;
        } else {
          if (data?.data?.status === 200) {
            setSuccess(true);
            setToastmsg("Invoices generated!");
          } else {
            setSuccess(true);
            setEr("Error");
            setToastmsg("Something went wrong");
          }
        }
      }
    }
  };
  const rescheduleAppointmenttoggle = () => {
    // window.location.reload()
    setReschedule(false);
    // setInnerSize();
    getTotalSales();
    getDashboardByCompany();
    getAnalytics();
    getDashboardByAppointment(moment().format("YYYY-MM-DD"));
    getAppointmentDates();
    if (userInfo && userInfo.role === "Staff") {
      let staffData = [];
      staffData.push(userInfo);
      setStaffData(staffData);
    } else {
      getStaffByCompany();
    }
    getSetting();
  };
  const [appointmentId, setAppointmentId] = useState();
  const rescheduleAppointment = (appointment) => {
    setAppointmentId(appointment);
    setReschedule(!reschedule);
  };

  // useEffect(async () => {
  //   if (userInfo && userInfo.role === "Staff") {
  //     let staffData = [];
  //     staffData.push(userInfo);
  //     setStaffData(staffData);
  //   } else {
  //     getStaffByCompany();
  //   }
  //   SetEditAppointment();
  //   setRescheduleAppointments();
  //   getInvoices();
  //   getTotalSales();
  //   getDashboardByCompany();
  //   getAnalytics();
  //   getDashboardByAppointment(moment().format("YYYY-MM-DD"));
  //   getAppointmentDates();

  //   getSetting();
  //   getPermissions();
  // }, []);

  const SelectAnalytics = (e) => {
    if (e.target.value === "month") {
      setStartDate(moment().clone().startOf("month").format("YYYY-MM-DD"));
      setEndDate(moment().clone().endOf("month").format("YYYY-MM-DD"));
    }
    if (e.target.value === "today") {
      setStartDate(moment().clone().startOf("today").format("YYYY-MM-DD"));
      setEndDate(moment().clone().endOf("today").format("YYYY-MM-DD"));
    }
    if (e.target.value === "week") {
      setStartDate(moment().clone().startOf("week").format("YYYY-MM-DD"));
      setEndDate(moment().clone().endOf("week").format("YYYY-MM-DD"));
    }
    getDashboardByCompany(e.target.value);
  };

  const MoreInformation = (e, data) => {
    setMore(data);
    setMoreInformation(!moreInformation);
  };

  const NoshowAppointment = (data) => {
    const noshowdata = { status: 2 };
    data?.map((dt) => {
      ApiPut("appointment/" + dt._id, noshowdata)
        .then((resp) => {
          if (resp.data.status === 200) {
            setSuccess(true);
            setToastmsg("Appointment status updated");
          }
        })
        .catch((er) => {
          setSuccess(true);
          setEr("eroor");
          setToastmsg(er);
        });
    });
  };

  const VoidNoshow = (data) => {
    const showdata = { status: 1 };
    data?.map((dt) => {
      ApiPut("appointment/" + dt._id, showdata)
        .then((resp) => {
          if (resp.data.status === 200) {
            setSuccess(true);
            setToastmsg("Appointment status updated");
          }
        })
        .catch((er) => {
          setSuccess(true);
          setEr("eroor");
          setToastmsg(er);
        });
    });
  };

  const getPermissions = async () => {
    let res = await ApiGet("permission/company/" + userInfo.companyId);
    // console.log("permission/company/", res);
    try {
      if (res.status === 200) {
        let permissionsArray = await res.data.data;
        // console.log("permission/company/api status === 200");
        // console.log("permissionsArray", res.data);
        if (permissionsArray?.length === 0) {
          let response = await ApiGet("permission");
          if (response.data.status === 200) {
            // console.log("permission/api response === 200");
            let defaultPermissions = await response.data.data;

            let operatorPermissionResponse = await defaultPermissions.find(
              (per) => per?.type === "operatorPolicy"
            );
            let staffPermissionResponse = await defaultPermissions.find(
              (per) => per?.type === "staffPolicy"
            );

            let operatorData = {
              permissionMenu: operatorPermissionResponse.permissionMenu,
              isActive: true,
              type: "operatorPolicy",
              companyId: userInfo.companyId,
            };
            let staffData = {
              permissionMenu: staffPermissionResponse.permissionMenu,
              isActive: true,
              type: "staffPolicy",
              companyId: userInfo.companyId,
            };
            // console.log('userInfo',userInfo)
            userInfo &&
              ApiPost(`permission/`, operatorData)
                .then((res) => {
                  // console.log("submitted-Operator", res);
                  let temOperatorPermissionResponse = res.data.data.find(
                    (per) => per?.type === "operatorPolicy"
                  );
                  dispatch(
                    setOperatorPermissions(
                      temOperatorPermissionResponse.permissionMenu
                    )
                  );
                  dispatch(
                    setOperatorPermissionsId(temOperatorPermissionResponse._id)
                  );
                })
                .catch((err) => console.log(err));
            userInfo &&
              ApiPost(`permission/`, staffData)
                .then((res) => {
                  // console.log("submitted-staff", res);
                  let temStaffPermissionResponse = res.data.data.find(
                    (per) => per?.type === "staffPolicy"
                  );
                  dispatch(
                    setStaffPermissions(
                      temStaffPermissionResponse.permissionMenu
                    )
                  );
                  dispatch(
                    setStaffPermissionsId(temStaffPermissionResponse._id)
                  );
                })
                .catch((err) => console.log(err));
          }
        } else {
          // console.log('in the else permission')
          let operatorPermissionResponse = await permissionsArray.find(
            (per) => per?.type === "operatorPolicy"
          );
          let staffPermissionResponse = await permissionsArray.find(
            (per) => per?.type === "staffPolicy"
          );
          dispatch(
            setOperatorPermissions(operatorPermissionResponse.permissionMenu)
          );
          dispatch(setOperatorPermissionsId(operatorPermissionResponse._id));
          dispatch(setStaffPermissions(staffPermissionResponse.permissionMenu));
          dispatch(setStaffPermissionsId(staffPermissionResponse._id));
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const VoidCancel = (data) => {
    const voidcancledata = { status: 1 };
    data?.map((dt) => {
      ApiPut("appointment/" + dt._id, voidcancledata)
        .then((resp) => {
          if (resp.data.status === 200) {
            setSuccess(true);
            setToastmsg("Appointment status updated");
          }
        })
        .catch((er) => {
          setSuccess(true);
          setEr("eroor");
          setToastmsg(er);
        });
    });
  };

  const CancelAppointment = (data) => {
    const cancledata = { status: 0 };
    data?.map((dt) => {
      ApiPut("appointment/" + dt._id, cancledata)
        .then((resp) => {
          if (resp.data.status === 200) {
            setSuccess(true);
            setToastmsg("Appointment cancelled");
          }
        })
        .catch((er) => {
          setSuccess(true);
          setEr("eroor");
          setToastmsg(er);
        });
    });
  };

  const OpenResheduleAppointment = (data) => {
    SetEditAppointment();
    setRescheduleAppointments(data);
    SetOpenEditModal(!openeditmodal);
    if (openeditmodal === true) {
      setRescheduleAppointments();
      if (data) {
        if (userInfo && userInfo.role === "Staff") {
          let staffData = [];
          staffData.push(userInfo);
          setStaffData(staffData);
        } else {
          getStaffByCompany();
        }
        if (data.data.status === 200) {
          setSuccess(true);
          setToastmsg("Appointment updated");
        }
      }
      getDashboardByAppointment(moment().format("YYYY-MM-DD"));
    }
  };
  const OpenEditAppointment = (data) => {
    setSelectedAppointmentDate(moment(new Date()).format("YYYY-MM-DD"));
    setMoreInformation(false);
    setMoreOptionMenu(false);
    SetEditAppointment(data);
    setRescheduleAppointments();
    SetOpenEditModal(!openeditmodal);
    if (openeditmodal === true) {
      SetEditAppointment();
      if (data) {
        if (userInfo && userInfo.role === "Staff") {
          let staffData = [];
          staffData.push(userInfo);
          setStaffData(staffData);
        } else {
          getStaffByCompany();
        }
        if (data?.data?.status === 200) {
          setSuccess(true);
          setToastmsg("Appointment updated");
        }
      }
      getDashboardByAppointment(moment().format("YYYY-MM-DD"));
    }
  };

  const ViewInvoice = (e, data) => {
    ViewInvoiceModalToggle();
    TostMSG();
    setInvoiceDetail(data);
  };

  const attendanceToggle = () => {
    setOpenAttendanceModal(!openAttendanceModal);
    if (openAttendanceModal === true) {
      if (userInfo && userInfo.role === "Staff") {
        let staffData = [];
        staffData.push(userInfo);
        setStaffData(staffData);
      } else {
        getStaffByCompany();
      }
    }
  };

  const openAttendanceclockin = (data) => {
    setOpenRequestModal(false);
    setOpenAttendanceModal(true);

    if (!data) {
      setShowDefault(true);
    } else {
      setAttendaceMark(false);
    }
  };

  const searchAppointment = (e) => {
    setSearch(e.target.value);
    var invoiceData =
      loungeList?.length > 0 &&
      loungeList?.filter(
        (obj) =>
          obj?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          obj?.type.toLowerCase().includes(e.target.value.toLowerCase())
      );
    if (invoiceData?.length > 0) {
      setAppointmentList(invoiceData);
    } else {
      setAppointmentList([]);
    }
  };

  const OpenAppFilter = (key) => {
    setAppointmentFilter(!appointmentFilter);
    setAppFilter(key);
    var invoiceData;
    if (key === "All") {
      invoiceData = loungeList?.length > 0 && loungeList;
    }
    if (key === "Upcoming") {
      invoiceData =
        loungeList?.length > 0 &&
        loungeList?.filter((obj) => obj?.status === 1);
    }
    if (key === "Completed") {
      invoiceData =
        loungeList?.length > 0 &&
        loungeList?.filter((obj) => obj?.status === 3);
    }
    if (key === "No-shows") {
      invoiceData =
        loungeList?.length > 0 &&
        loungeList?.filter((obj) => obj?.status === 2);
    }
    if (key === "Cancelled") {
      invoiceData =
        loungeList?.length > 0 &&
        loungeList?.filter((obj) => obj?.status === 0);
    }
    if (invoiceData?.length > 0) {
      setAppointmentList(invoiceData);
    } else {
      setAppointmentList([]);
    }
  };
  const TostMSG = (data) => {
    if (data) {
      if (data === "SMS") {
        setSuccess(true);
        setToastmsg("SMS sent successfully!");
      } else if (data === "DELETE") {
        setSuccess(true);
        setToastmsg("Invoice deleted!");
      } else if (data === "EDIT") {
        setSuccess(true);
        setToastmsg("Changes saved!");
      } else if (data === "Due") {
        setSuccess(true);
        setToastmsg("Due cleared!");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  const ViewInvoiceModalToggle = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
    if (viewInvoiceModal === true) {
      getDashboardBySales();
      getMembershipSales();
    }
  };

  const SalesAnalytics = () => {
    SalesAnalyticsToggle();
  };
  const SalesAnalyticsToggle = () => {
    setSalesAnalytics(!salesAnalytics);
  };

  const VisitAnalytics = () => {
    VisitAnalyticsToggle();
  };
  const VisitAnalyticsToggle = () => {
    setVisitAnalytics(!visitAnalytics);
  };

  const closeTourOnClose = () => {
    dispatch(setOnboardingTourStatus(false));
    dispatch(setOnboardingTooltipStatus(false));
    dispatch(setOnboardingCurrentTooltip(""));
  };

  const invoiceDataa = allInvoiceData
    ?.slice(0)
    .filter(
      (obj) =>
        moment(obj.created).format("DD-MM-YYYY") ===
        moment(new Date()).format("DD-MM-YYYY")
    );

  const OpenGenerateInvoice = (data) => {
    setInvoiceData(data);
    setOpenNewInvoice(!opennewinvoice);
    if (opennewinvoice === true) {
      if (data) {
        if (data?.data?.status === 200) {
          const invoice = {
            status: 3,
            invoiceID: data?.data?.data?._id,
          };
          invoiceData?.map((dt) => {
            ApiPut("appointment/" + dt._id, invoice)
              .then((resp) => {
                if (resp.data.status === 200) {
                  console.log("Sucess");
                }
              })
              .catch((er) => {
                console.log("error");
              });
          });
          setSuccess(true);
          setToastmsg("Invoice Generated!");
        }
      }
    }
  };

  const ViewInvoiceData = async (data) => {
    let res = await ApiGet("invoice/" + data[0].invoiceID);
    try {
      if (res.data.status === 200) {
        setInvoiceDetail(res.data.data[0]);
        ViewInvoiceModalToggle();
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  useEffect(() => {
    getInvoices();
  }, [storeOnboardingStatus]);
  const SkipForNow = async () => {
    setOpenPlanmodal(false);

    if (
      allInvoiceData
        ?.slice(0)
        .filter(
          (obj) =>
            moment(obj.created).format("DD-MM-YYYY") ===
            moment(new Date()).format("DD-MM-YYYY")
        ).length === 2
    ) {
      let values = {
        firstReminderDate: moment(new Date()).add(1, "days").format(),
        companyId: userInfo.companyId,
      };
      let res = await ApiPost("setting/", values);
      try {
        if (res.data.status === 200) {
          userUtil.setSetting(res?.data?.data[0]);
          dispatch(
            setfirstReminderDate(moment(new Date()).add(1, "days").format())
          );
        }
      } catch (err) {}
    }
    var beginningtime = moment("03:00pm", "h:mma");
    var endtime = moment(moment(new Date()).format("hh:mma"), "h:mma");
    if (beginningtime.isBefore(endtime)) {
      let values = {
        secondReminderDate: moment(new Date()).add(1, "days").format(),
        companyId: userInfo.companyId,
      };
      let res = await ApiPost("setting/", values);
      try {
        if (res.data.status === 200) {
          userUtil.setSetting(res?.data?.data[0]);
          dispatch(
            setsecondReminderDate(moment(new Date()).add(1, "days").format())
          );
        }
      } catch (err) {}
    }
    var beginningTime = moment("06:30pm", "h:mma");
    var endTime = moment(moment(new Date()).format("hh:mma"), "h:mma");
    if (beginningTime.isBefore(endTime)) {
      let values = {
        thirdReminderDate: moment(new Date()).add(1, "days").format(),
        companyId: userInfo.companyId,
      };
      let res = await ApiPost("setting/", values);
      try {
        if (res.data.status === 200) {
          userUtil.setSetting(res?.data?.data[0]);
          dispatch(
            setthirdReminderDate(moment(new Date()).add(1, "days").format())
          );
        }
      } catch (err) {}
    }
  };

  const UpgradeNow = () => {
    history.push("/setting?upgrade=newplan");
    SkipForNow();
  };
  return (
    <>{loading && <Loader />}
      
    
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="content"
        id="main-contain"
        style={{
          pointerEvents:
            (storeOnboardingCurrentTooltip === "I2" ||
              storeOnboardingCurrentTooltip === "I3" ||
              storeOnboardingCurrentTooltip === "finish") &&
            "none",
        }}
      >
        {openPlanmodal && (
          <motion.div
            initial={{ opacity: 0, y: "-120px" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="plan-upgrade-notification"
          >
            <div className="notification-alignment">
              <div className="notification-text-align">
                <img src={Notify} alt="Notify" />
                <p>
                  Heads up! Your free trial has only{" "}
                  <span>{trialDays} {trialDays ==  1 ? "day":"days"}</span> left. Upgrade your account to
                  keep using Barbera for your salon{" "}
                </p>
              </div>
              <div className="notification-button-align">
                <div
                  className="upgrade-button-alignment"
                  onClick={() => UpgradeNow()}
                >
                  <button>Upgrade account</button>
                </div>
                <div className="close-icon-back" onClick={() => SkipForNow()}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div className="container-fluid container-left-right-space">
          <div className="dashboard-header">
            <div className="header-alignment">
              <div className="header-title">
                <i
                  class="fas fa-bars"
                  onClick={() => setChildSidebar(!childSidebar)}
                ></i>
                <h2>Dashboard</h2>
              </div>
              <div className="header-notification">
                {/* <div className="icon-design">
                  <div className="relative">
                    <img src={BellImage} alt="BellImage" />
                  </div>
                  <div className="bell-icon-design"></div>
                </div> */}
                {expenseDisable ?  permission?.filter((obj) => obj.name === "Expense")[0]
                  ?.isChecked === false ? null : (
                  <div
                    className="cus-icon-design"
                    onClick={() => SetOpenExpencemodal(!openExpencemodal)}
                  >
                    <div className="iconic-tab">
                      <div className="iconic-icon">
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.9475 3.75003C13.9487 2.36876 11.1322 1.25 7.66186 1.25C4.19151 1.25 1.37751 2.37001 1.375 3.75003M1.375 3.75003C1.375 5.13129 4.189 6.25005 7.66186 6.25005C11.1347 6.25005 13.9487 5.13129 13.9487 3.75003L13.9487 13.45M1.375 3.75003V18.7501C1.37626 20.1314 4.19026 21.2501 7.66186 21.2501C9.34548 21.2501 10.8656 20.9839 11.9935 20.5551M1.37626 8.75006C1.37626 10.1313 4.19026 11.2501 7.66312 11.2501C11.136 11.2501 13.95 10.1313 13.95 8.75006M12.0689 15.5315C10.9348 15.9752 9.37943 16.2502 7.66186 16.2502C4.19026 16.2502 1.37626 15.1314 1.37626 13.7502M21.0931 14.1477C23.3023 16.344 23.3023 19.9065 21.0931 22.1028C18.8839 24.2991 15.3004 24.2991 13.0912 22.1028C10.882 19.9065 10.882 16.344 13.0912 14.1477C15.3004 11.9514 18.8839 11.9514 21.0931 14.1477Z"
                            stroke="#97A7C3"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="iconic-icon-hover">
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.9475 3.75003C13.9487 2.36876 11.1322 1.25 7.66186 1.25C4.19151 1.25 1.37751 2.37001 1.375 3.75003M1.375 3.75003C1.375 5.13129 4.189 6.25005 7.66186 6.25005C11.1347 6.25005 13.9487 5.13129 13.9487 3.75003L13.9487 13.45M1.375 3.75003V18.7501C1.37626 20.1314 4.19026 21.2501 7.66186 21.2501C9.34548 21.2501 10.8656 20.9839 11.9935 20.5551M1.37626 8.75006C1.37626 10.1313 4.19026 11.2501 7.66312 11.2501C11.136 11.2501 13.95 10.1313 13.95 8.75006M12.0689 15.5315C10.9348 15.9752 9.37943 16.2502 7.66186 16.2502C4.19026 16.2502 1.37626 15.1314 1.37626 13.7502M21.0931 14.1477C23.3023 16.344 23.3023 19.9065 21.0931 22.1028C18.8839 24.2991 15.3004 24.2991 13.0912 22.1028C10.882 19.9065 10.882 16.344 13.0912 14.1477C15.3004 11.9514 18.8839 11.9514 21.0931 14.1477Z"
                            stroke="#1479FF"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="iconic-title">Expenses</p>
                    </div>
                  </div>
                ):null}
                {permission?.filter((obj) => obj.name === "Statement")[0]
                  ?.isChecked === false ? null : (
                  <div
                    className="cus-icon-design"
                    onClick={() => statementToggle()}
                  >
                    <div className="iconic-tab">
                      <div className="iconic-icon">
                        <svg
                          width="27"
                          height="27"
                          viewBox="0 0 27 27"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.4375 15.1875H15.1875V16.875H8.4375V15.1875Z"
                            fill="#97A7C3"
                          />
                          <path
                            d="M8.4375 10.9688H18.5625V12.6562H8.4375V10.9688Z"
                            fill="#97A7C3"
                          />
                          <path
                            d="M8.4375 19.4062H12.6562V21.0938H8.4375V19.4062Z"
                            fill="#97A7C3"
                          />
                          <path
                            d="M21.0938 4.21875H18.5625V3.375C18.5625 2.92745 18.3847 2.49822 18.0682 2.18176C17.7518 1.86529 17.3226 1.6875 16.875 1.6875H10.125C9.67745 1.6875 9.24823 1.86529 8.93176 2.18176C8.61529 2.49822 8.4375 2.92745 8.4375 3.375V4.21875H5.90625C5.4587 4.21875 5.02947 4.39654 4.71301 4.71301C4.39654 5.02947 4.21875 5.4587 4.21875 5.90625V23.625C4.21875 24.0726 4.39654 24.5018 4.71301 24.8182C5.02947 25.1347 5.4587 25.3125 5.90625 25.3125H21.0938C21.5413 25.3125 21.9705 25.1347 22.287 24.8182C22.6035 24.5018 22.7812 24.0726 22.7812 23.625V5.90625C22.7812 5.4587 22.6035 5.02947 22.287 4.71301C21.9705 4.39654 21.5413 4.21875 21.0938 4.21875ZM10.125 3.375H16.875V6.75H10.125V3.375ZM21.0938 23.625H5.90625V5.90625H8.4375V8.4375H18.5625V5.90625H21.0938V23.625Z"
                            fill="#97A7C3"
                          />
                        </svg>
                      </div>
                      <div className="iconic-icon-hover">
                        <svg
                          width="27"
                          height="27"
                          viewBox="0 0 27 27"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.4375 15.1875H15.1875V16.875H8.4375V15.1875Z"
                            fill="#1479FF"
                          />
                          <path
                            d="M8.4375 10.9688H18.5625V12.6562H8.4375V10.9688Z"
                            fill="#1479FF"
                          />
                          <path
                            d="M8.4375 19.4062H12.6562V21.0938H8.4375V19.4062Z"
                            fill="#1479FF"
                          />
                          <path
                            d="M21.0938 4.21875H18.5625V3.375C18.5625 2.92745 18.3847 2.49822 18.0682 2.18176C17.7518 1.86529 17.3226 1.6875 16.875 1.6875H10.125C9.67745 1.6875 9.24823 1.86529 8.93176 2.18176C8.61529 2.49822 8.4375 2.92745 8.4375 3.375V4.21875H5.90625C5.4587 4.21875 5.02947 4.39654 4.71301 4.71301C4.39654 5.02947 4.21875 5.4587 4.21875 5.90625V23.625C4.21875 24.0726 4.39654 24.5018 4.71301 24.8182C5.02947 25.1347 5.4587 25.3125 5.90625 25.3125H21.0938C21.5413 25.3125 21.9705 25.1347 22.287 24.8182C22.6035 24.5018 22.7812 24.0726 22.7812 23.625V5.90625C22.7812 5.4587 22.6035 5.02947 22.287 4.71301C21.9705 4.39654 21.5413 4.21875 21.0938 4.21875ZM10.125 3.375H16.875V6.75H10.125V3.375ZM21.0938 23.625H5.90625V5.90625H8.4375V8.4375H18.5625V5.90625H21.0938V23.625Z"
                            fill="#1479FF"
                          />
                        </svg>
                      </div>
                      <p className="iconic-title">Statement</p>
                    </div>
                  </div>
                )}
                {/* {permission?.filter((obj) => obj.name === "Settings page")[0]
                  ?.isChecked === false ? null : */}
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
                {/* } */}
              </div>
            </div>
          </div>
        </div>
        {addNewAppointment && (
          <AddNewAppointmentModal
            modal={addNewAppointment}
            toggle={AddNewAppointmentModaltoggle}
            uuid={uuid}
            selectDate={selectDate}
            SettingInfo={SettingInfo}
          />
        )}
        {statementModal && (
          <StatementModal
            modal={statementModal}
            toggle={statementToggle}
            SettingInfo={SettingInfo}
          />
        )}
        <div className="container-left-right-space">
          <div className="home-grid">
            <div className="home-grid-items">
              <div className="chart-grid">
                <div className="chart-grid-items">
                  <div className="same-box-design">
                    <div className="flex items-center justify-between bottom-algin-1">
                      <h4>Sales</h4>
                      {permission?.filter(
                        (obj) => obj.name === "Sales analytics"
                      )[0]?.isChecked === false ? null : (
                        <div
                          className="analytics-icon-text-stlye"
                          onClick={(e) => SalesAnalytics()}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14 14H2.66667C2.29848 14 2 13.7015 2 13.3333V2H3.33333V12.6667H14V14ZM5.582 10.6667L4.66667 9.77067L7.904 6.6C8.15885 6.35232 8.56449 6.35232 8.81933 6.6L10.304 8.054L13.0847 5.33333L14 6.22933L10.7627 9.4C10.5078 9.64768 10.1022 9.64768 9.84733 9.4L8.362 7.94533L5.58267 10.6667H5.582Z"
                              fill="#1479FF"
                            />
                          </svg>
                          <span>Analytics</span>
                        </div>
                      )}
                    </div>
                    <p>
                      <span className="rs-font">
                        {SettingInfo?.currentType}
                      </span>
                      {permission?.filter((obj) => obj.name === "Sales Data")[0]
                        ?.isChecked === false
                        ? "-"
                        : +(+sortInvoice?.ServicePrice).toFixed(0) +
                            +(+sortInvoice?.productPrice).toFixed(0) +
                            +salesData?.memberShip || 0}
                    </p>
                    <div className="chart-align-box">
                      <div className="pie-chart-grid">
                        <div className="pie-chart-grid-items">
                          {permission?.filter(
                            (obj) => obj.name === "Sales Data"
                          )[0]?.isChecked === false ? (
                            <Pie
                              data={nullData}
                              width={100}
                              height={100}
                              options={{ tooltips: { enabled: false } }}
                            />
                          ) : sortInvoice?.ServicePrice <= 0 &&
                            sortInvoice?.productPrice <= 0 &&
                            salesData?.memberShip <= 0 ? (
                            <Pie
                              data={nullData}
                              width={100}
                              height={100}
                              options={{ tooltips: { enabled: false } }}
                            />
                          ) : (
                            <Pie
                              data={data}
                              width={100}
                              height={100}
                              options={{
                                title: {
                                  display: false,
                                  text: "Appointments",
                                  fontSize: 20,
                                },
                                legend: {
                                  display: false,
                                  position: "right",
                                },
                              }}
                            />
                          )}
                        </div>
                        <div className="pie-chart-grid-items">
                          <div className="service-show">
                            <div className="content-alignment">
                              <div className="round"></div>
                              <div className="text">
                                <p>Services</p>

                                <h4>
                                  <span className="rs-font">
                                    {SettingInfo?.currentType}
                                  </span>{" "}
                                  {permission?.filter(
                                    (obj) => obj.name === "Sales Data"
                                  )[0]?.isChecked === false
                                    ? "-"
                                    : sortInvoice?.ServicePrice.length > 0
                                    ? Math.round(sortInvoice?.ServicePrice[0])
                                    : 0}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="product-show set-membership">
                            <div className="content-alignment">
                              <div className="round"></div>
                              <div className="text">
                                <p>Products</p>
                                <h4>
                                  <span className="rs-font">
                                    {SettingInfo?.currentType}
                                  </span>{" "}
                                  {permission?.filter(
                                    (obj) => obj.name === "Sales Data"
                                  )[0]?.isChecked === false
                                    ? "-"
                                    : sortInvoice?.productPrice.length > 0
                                    ? sortInvoice?.productPrice[0].toFixed(0)
                                    : 0}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="membership-show">
                            <div className="content-alignment">
                              <div className="round"></div>
                              <div className="text">
                                <p>Membership</p>
                                <h4>
                                  <span className="rs-font">
                                    {SettingInfo?.currentType}
                                  </span>{" "}
                                  {permission?.filter(
                                    (obj) => obj.name === "Sales Data"
                                  )[0]?.isChecked === false
                                    ? "-"
                                    : salesData?.memberShip || 0}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chart-grid-items">
                  <div className="same-box-design">
                    <div className="bottom-algin-1 flex items-center justify-between">
                      <h4>Visits</h4>
                      {permission?.filter(
                        (obj) => obj.name === "Appointments analytics"
                      )[0]?.isChecked === false ? null : (
                        <div
                          className="analytics-icon-text-stlye"
                          onClick={() => VisitAnalytics()}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14 14H2.66667C2.29848 14 2 13.7015 2 13.3333V2H3.33333V12.6667H14V14ZM5.582 10.6667L4.66667 9.77067L7.904 6.6C8.15885 6.35232 8.56449 6.35232 8.81933 6.6L10.304 8.054L13.0847 5.33333L14 6.22933L10.7627 9.4C10.5078 9.64768 10.1022 9.64768 9.84733 9.4L8.362 7.94533L5.58267 10.6667H5.582Z"
                              fill="#1479FF"
                            />
                          </svg>
                          <span>Analytics</span>
                        </div>
                      )}
                    </div>
                    <p>
                      {permission?.filter((obj) => obj.name === "Visit Data")[0]
                        ?.isChecked === false
                        ? "-"
                        : sortAppointment?.upcoming[0] +
                            sortAppointment?.noShow[0] +
                            (sortInvoice?.complete?.length === 0
                              ? 0
                              : sortInvoice?.complete[0]) +
                            sortAppointment?.cancel[0] || 0}
                      <span
                        style={{
                          paddingLeft: "3px",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "18px",
                        }}
                      >
                        Appointments
                      </span>
                    </p>
                    <div className="chart-align-box">
                      <div className="visit-grid">
                        <div className="visit-grid-items">
                          {permission?.filter(
                            (obj) => obj.name === "Visit Data"
                          )[0]?.isChecked === false ? (
                            <Doughnut
                              data={nullData}
                              width={100}
                              height={100}
                              options={{ tooltips: { enabled: false } }}
                            />
                          ) : dailyTotalSales?.appointment?.total?.length ===
                            0 ? (
                            <Doughnut
                              data={nullData}
                              width={100}
                              height={100}
                              options={{ tooltips: { enabled: false } }}
                            />
                          ) : (
                            <Doughnut
                              data={state}
                              width={100}
                              height={100}
                              options={{
                                title: {
                                  display: false,
                                  text: "Appointments",
                                  fontSize: 20,
                                },
                                legend: {
                                  display: false,
                                  position: "right",
                                },
                              }}
                            />
                          )}
                        </div>
                        <div className="visit-grid-items">
                          <div className="grid">
                            <div className="grid-items">
                              <div className="box-style-same first-child-background">
                                <div className="content-alignment">
                                  <div className="round"></div>
                                  <div className="content-text">
                                    <p>Upcoming</p>
                                    <h4>
                                      {permission?.filter(
                                        (obj) => obj.name === "Visit Data"
                                      )[0]?.isChecked === false
                                        ? "-"
                                        : sortAppointment?.upcoming.length > 0
                                        ? sortAppointment?.upcoming
                                        : 0}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="grid-items">
                              <div className="box-style-same sec-child-background">
                                <div className="content-alignment">
                                  <div className="round-one"></div>
                                  <div className="content-text">
                                    <p>Completed</p>
                                    <h4>
                                      {permission?.filter(
                                        (obj) => obj.name === "Visit Data"
                                      )[0]?.isChecked === false
                                        ? "-"
                                        : sortInvoice?.complete.length > 0
                                        ? sortInvoice?.complete
                                        : 0}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="grid-items">
                              <div className="box-style-same three-child-background">
                                <div className="content-alignment">
                                  <div className="round-two"></div>
                                  <div className="content-text">
                                    <p>No shows</p>
                                    <h4>
                                      {permission?.filter(
                                        (obj) => obj.name === "Visit Data"
                                      )[0]?.isChecked === false
                                        ? "-"
                                        : sortAppointment?.noShow.length > 0
                                        ? sortAppointment?.noShow
                                        : 0}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="grid-items">
                              <div className="box-style-same four-child-background">
                                <div className="content-alignment">
                                  <div className="round-three"></div>
                                  <div className="content-text">
                                    <p>Cancelled</p>
                                    <h4>
                                      {permission?.filter(
                                        (obj) => obj.name === "Visit Data"
                                      )[0]?.isChecked === false
                                        ? "-"
                                        : sortAppointment?.cancel.length > 0
                                        ? sortAppointment?.cancel
                                        : 0}
                                    </h4>
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
              </div>

              <div className="sub-grid">
                <div className="sub-grid-items relative">
                  {/* invoice tooltip */}
                  {storeOnboardingTourStatus &&
                    storeOnboardingTooltipStatus &&
                    storeOnboardingCurrentTooltip === "I2" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="custom-tooltip tooltip-I2"
                        style={{
                          pointerEvents:
                            storeOnboardingCurrentTooltip === "I2" && "all",
                        }}
                      >
                        <div className="invoice-tooltip-design">
                          <h3>Invoices</h3>
                          <p>With invoice module you can:</p>
                          <p>
                            Assign services, set different working hours, staff
                            transactions, analytics
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
                                onClick={() => {
                                  generateInvoiceOnClick();
                                  if (storeOnboardingTourStatus) {
                                    dispatch(setOnboardingTooltipStatus(true));
                                    dispatch(setOnboardingCurrentTooltip("I3"));
                                    setTimeout(() => {
                                      dispatch(
                                        setOnboardingTooltipStatus(true)
                                      );
                                      dispatch(
                                        setOnboardingCurrentTooltip("I3")
                                      );
                                      // dispatch(setOnboardingCurrentTooltip)
                                    }, 250);
                                  }
                                }}
                              >
                                Got it, Next
                              </button>
                            </div>
                          </div>
                          <div className="tooltip-dot-design">
                            <div className="active-small-dot"></div>
                            <div className="zoom-dot" />
                            <div />
                            <div />
                            <div />
                            <div />x
                            <div />
                            <div />
                            <div />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  <div
                    className={
                      openPlanmodal
                        ? "small-box-height-update-height small-box-height"
                        : "small-box-height"
                    }
                  >
                    <div className="invoice-home-page-show">
                      <div
                        className="title-alignment"
                        style={{
                          pointerEvents:
                            storeOnboardingTourStatus === true &&
                            (storeOnboardingCurrentTooltip === "I3" ||
                              storeOnboardingCurrentTooltip === "I2") &&
                            "all",
                        }}
                      >
                        {/* storeOnboardingTourStatus===true && storeOnboardingCurrentTooltip === 'I3' */}
                        <h4>Invoices</h4>
                        {permission?.filter(
                          (obj) => obj.name === "Generate new invoice/Checkout"
                        )[0]?.isChecked === false ? null : (
                          <div
                            className="add-new-alignment"
                            onClick={() => {
                              generateInvoiceOnClick();
                              if (storeOnboardingTourStatus) {
                                setTimeout(() => {
                                  dispatch(setOnboardingTooltipStatus(true));
                                  dispatch(setOnboardingCurrentTooltip("I3"));
                                  // dispatch(setOnboardingCurrentTooltip)
                                }, 250);
                              }
                            }}
                          >
                            <p>Generate new</p>
                            <div className="add-button">
                              <img src={AddNew} alt="AddNew" />
                            </div>
                          </div>
                        )}
                      </div>
                      {permission?.filter(
                        (obj) => obj.name === "Generated invoices"
                      )[0]?.isChecked === false ? null : (
                        <div className="home-invoice-table">
                          {invoiceDataa?.length > 0 ? (
                            <table>
                              {allInvoiceData
                                ?.slice(0)
                                .filter(
                                  (obj) =>
                                    moment(obj.created).format("DD-MM-YYYY") ===
                                    moment(new Date()).format("DD-MM-YYYY")
                                )
                                .reverse()
                                .filter(
                                  (obj) =>
                                    obj.isCustomerWithoutMembership === true
                                )
                                .map((invoice) => {
                                  return (
                                    <tr key={invoice._id}>
                                      <td>
                                        <div className="table-text-style">
                                          <span
                                            style={{ color: "#1479FF" }}
                                            onClick={(e) =>
                                              ViewInvoice(e, invoice)
                                            }
                                          >
                                            #{invoice?.invoiceId}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="table-text-style">
                                          <span>
                                            {invoice?.customer ? (
                                              <>
                                                <p>
                                                  {invoice?.customer?.firstName}{" "}
                                                  {""}
                                                  {invoice?.customer?.lastName}
                                                </p>
                                              </>
                                            ) : (
                                              "Walk-in Customer"
                                            )}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="center-table-point">
                                          <div className="bullet blue-bullet-color"></div>
                                          <span>
                                            {invoice?.serviceDetails?.length}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="center-table-point">
                                          <div className="bullet orange-bullet-color"></div>
                                          <span>
                                            {invoice?.products?.length}
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="final-amount">
                                          <p>
                                            <span>
                                              {SettingInfo?.currentType}
                                            </span>{" "}
                                            {Math.round(invoice?.totalAmount)}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </table>
                          ) : (
                            <div className="no-invoice-box-alignment-empty">
                            <div>
                              <div className="icon-center-alignment">
                                <img
                                  src={InvoiceNewIcon}
                                  alt="InvoiceNewIcon"
                                />
                              </div>
                                <div className="empty-text-style">
                                <p>No invoices to show</p>
                                <h4>
                                  Click on <a>Generate new</a> to start billing
                                </h4>
                              </div>
                            </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sub-grid-items">
                  <div
                    className={
                      openPlanmodal
                        ? "small-box-height-update-height small-box-height"
                        : "small-box-height"
                    }
                  >
                    <div className="home-staff-title">
                      <h3>Staff</h3>
                      {permission?.filter(
                        (obj) => obj.name === "Accept/Mark attendance"
                      )[0]?.isChecked === false
                        ? null
                        : SettingInfo?.attendence?.attendanceToggle && (
                            <span onClick={(e) => attendanceToggle()}>
                              Attendance
                            </span>
                          )}
                    </div>
                    {/* {staffLoading ? (
                      <>
                        <Skeleton
                          variant="rect"
                          height={70}
                          style={{ borderRadius: "12px", marginTop: "10px" }}
                        />
                        <Skeleton
                          variant="rect"
                          height={70}
                          style={{ borderRadius: "12px", marginTop: "10px" }}
                        />
                        <Skeleton
                          variant="rect"
                          height={70}
                          style={{ borderRadius: "12px", marginTop: "10px" }}
                        />
                        <Skeleton
                          variant="rect"
                          height={70}
                          style={{ borderRadius: "12px", marginTop: "10px" }}
                        />
                      </>
                    ) : ( */}
                    <>
                      {staffData && staffData.length > 0 ? (
                        staffData.map((staff) => {
                          let thisStaffAttendance =
                            attendanceData?.find(
                              (obj) => obj.staffId === staff._id
                            ) || {};
                          if (SettingInfo?.attendence?.attendanceToggle) {
                            return (
                              // thisStaffAttendance?.currentStatus?.toLowerCase() === 'clockout' ? null :
                              <>
                                <div
                                  key={staff._id}
                                  className="list-style-alignment"
                                >
                                  <p>{staff.firstName}</p>
                                  {staff.workingDays
                                    .filter(
                                      (obj) =>
                                        obj?.Day === getDateDay(new Date())
                                    )
                                    .map((day) => {
                                      if (day.Day === getDateDay(new Date())) {
                                        return (
                                          (day.dayOff === true &&
                                            !thisStaffAttendance?.currentStatus) ||
                                          day.isStoreClosed === true ? (
                                            <span
                                              key={day._id}
                                              className="span-day-off"
                                            >
                                              Day Off
                                            </span>
                                          ) : (
                                            thisStaffAttendance?.currentStatus?.toLowerCase() ===
                                            "dayoff"
                                          )
                                        ) ? (
                                          <span
                                            key={day._id}
                                            className="span-day-off"
                                          >
                                            Off-day
                                          </span>
                                        ) : thisStaffAttendance?.currentStatus?.toLowerCase() ===
                                          "absent" ? (
                                          <span
                                            key={day._id}
                                            className="span-absent"
                                          >
                                            Absent
                                          </span>
                                        ) : thisStaffAttendance?.currentStatus?.toLowerCase() ===
                                          "clockout" ? (
                                          <span
                                            key={day._id}
                                            className="span-clockout"
                                          >
                                            Clock Out
                                          </span>
                                        ) : thisStaffAttendance?.currentStatus?.toLowerCase() ===
                                          "awaiting" ? (
                                          <span
                                            key={day._id}
                                            className="span-awaiting"
                                          >
                                            Awaiting
                                          </span>
                                        ) : !thisStaffAttendance?.currentStatus ? (
                                          <span
                                            key={day._id}
                                            className="span-awaiting"
                                          >
                                            Awaiting
                                          </span>
                                        ) : (
                                          <span key={day._id}>
                                            {" "}
                                            {occupiedAppointment.filter(
                                              (obj) =>
                                                obj?.staffId?._id === staff?._id
                                            )[0]?.date ? (
                                              moment(
                                                occupiedAppointment.filter(
                                                  (obj) =>
                                                    obj?.staffId?._id ===
                                                    staff?._id
                                                )[0]?.date
                                              ).subtract(330, "minutes")._d <
                                                new Date() &&
                                              moment(
                                                occupiedAppointment.filter(
                                                  (obj) =>
                                                    obj?.staffId?._id ===
                                                    staff?._id
                                                )[0]?.date
                                              )
                                                .add(
                                                  occupiedAppointment.filter(
                                                    (obj) =>
                                                      obj?.staffId?._id ===
                                                      staff?._id
                                                  )[0]?.time,
                                                  "minutes"
                                                )
                                                .subtract(330, "minutes")._d >
                                                new Date() ? (
                                                "Occupied"
                                              ) : (
                                                "Available till  " +
                                                moment
                                                  .utc(
                                                    occupiedAppointment.filter(
                                                      (obj) =>
                                                        obj?.staffId?._id ===
                                                        staff?._id
                                                    )[0]?.date
                                                  )
                                                  .format("hh:mm A")
                                              )
                                            ) : day.starttime >
                                              moment(new Date()).format(
                                                "HH:mm"
                                              ) ? (
                                              "Available after" +
                                              " " +
                                              moment(day.starttime, [
                                                "HH:mm",
                                              ]).format("hh:mm A")
                                            ) : thisStaffAttendance?.activeStatus ? (
                                              <span className="span-awaiting">
                                                Awaiting{" "}
                                              </span>
                                            ) : (
                                              "Available"
                                            )}
                                          </span>
                                        );
                                      }
                                    })}
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <div
                                  key={staff._id}
                                  className="list-style-alignment"
                                >
                                  <p>{staff.firstName}</p>
                                  {staff.workingDays
                                    .filter(
                                      (obj) =>
                                        obj?.Day === getDateDay(new Date())
                                    )
                                    .map((day) => {
                                      if (day.Day === getDateDay(new Date())) {
                                        return day.dayOff === true ||
                                          day.isStoreClosed === true ? (
                                          <span
                                            key={day._id}
                                            className="span-absent"
                                          >
                                            Absent
                                          </span>
                                        ) : (
                                          <span key={day._id}>
                                            {" "}
                                            {occupiedAppointment.filter(
                                              (obj) =>
                                                obj?.staffId?._id === staff?._id
                                            )[0]?.date
                                              ? moment(
                                                  occupiedAppointment.filter(
                                                    (obj) =>
                                                      obj?.staffId?._id ===
                                                      staff?._id
                                                  )[0]?.date
                                                ).subtract(330, "minutes")._d <
                                                  new Date() &&
                                                moment(
                                                  occupiedAppointment.filter(
                                                    (obj) =>
                                                      obj?.staffId?._id ===
                                                      staff?._id
                                                  )[0]?.date
                                                )
                                                  .add(
                                                    occupiedAppointment.filter(
                                                      (obj) =>
                                                        obj?.staffId?._id ===
                                                        staff?._id
                                                    )[0]?.time,
                                                    "minutes"
                                                  )
                                                  .subtract(330, "minutes")._d >
                                                  new Date()
                                                ? "Occupied"
                                                : "Available till  " +
                                                  moment
                                                    .utc(
                                                      occupiedAppointment.filter(
                                                        (obj) =>
                                                          obj?.staffId?._id ===
                                                          staff?._id
                                                      )[0]?.date
                                                    )
                                                    .format("hh:mm A")
                                              : day.starttime >
                                                moment(new Date()).format(
                                                  "HH:mm"
                                                )
                                              ? "Available after" +
                                                " " +
                                                moment(day.starttime, [
                                                  "HH:mm",
                                                ]).format("hh:mm A")
                                              : "Available"}
                                          </span>
                                        );
                                      }
                                    })}
                                </div>
                              </>
                            );
                          }
                        })
                      ) : (
                        <div className="no-staff-statement-section-alignemnt-empty">
                          <div>
                            <div className="icon-center-alignment">
                              <img src={NoStaffIcon} alt="NoStaffIcon" />
                            </div>
                            <div className="empty-text-style">
                              <p>No staff added</p>
                              <h4>Visit Staff page to add staff</h4>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                    {/* )}  */}
                  </div>
                </div>
              </div>
            </div>
            <div className="home-grid-items">
              <div className="appointments-box">
                <div className="Appointments-alignment-text">
                  <h2>Appointments</h2>
                  {permission?.filter(
                    (obj) => obj.name === "Add new appointment"
                  )[0]?.isChecked === false ? null : (
                    <div
                      className="add-new-alignment"
                      onClick={() => AddNewAppointmentModaltoggle()}
                    >
                      <p>Add new</p>
                      <div className="add-box">
                        <img src={AddNew} alt="AddNew" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="cus-date-carousel">
                  {upcomingAppointmentDateList?.map((date, index) => {
                    return (
                      <div key={index} className="mb-6">
                        <div
                          className={
                            selectedAppointmentDate === date
                              ? "date-design-active"
                              : "date-design"
                          }
                          onClick={() => {
                            setSelectedAppointmentDate(date);
                            getDashboardByAppointment(date);
                            setSelectDate(moment(date).toDate());
                          }}
                        >
                          <div className="text-style">
                            <p>
                              {date.slice(-2)} {getDateMonth(date).slice(0, 0)}
                            </p>
                            <span>
                              {index === 0
                                ? "Today"
                                : index === 1
                                ? "Tom"
                                : moment(date).format("ddd")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* </Slider> */}
                </div>
                {/* <!-------> */}
                <div className="search-select-menu flex gap-2">
                  <div
                    className="searchbar-wrapper cursor-pointer"
                    ref={optionRefrences}
                  >
                    {focus == 0 ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.95833 10.2917C8.35157 10.2917 10.2917 8.35157 10.2917 5.95833C10.2917 3.5651 8.35157 1.625 5.95833 1.625C3.5651 1.625 1.625 3.5651 1.625 5.95833C1.625 8.35157 3.5651 10.2917 5.95833 10.2917Z"
                          stroke="#97A7C3"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.375 11.375L9.0188 9.01874"
                          stroke="#97A7C3"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.95833 10.2917C8.35157 10.2917 10.2917 8.35157 10.2917 5.95833C10.2917 3.5651 8.35157 1.625 5.95833 1.625C3.5651 1.625 1.625 3.5651 1.625 5.95833C1.625 8.35157 3.5651 10.2917 5.95833 10.2917Z"
                          stroke="#193566"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.375 11.375L9.0188 9.01874"
                          stroke="#193566"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                    <input
                      style={{ border: focus == 0 ? "" : "1px solid #7DAFF2" }}
                      className="cursor-text"
                      value={search}
                      onChange={(e) => searchAppointment(e)}
                      onClick={() => setFocus(1)}
                      type="search"
                      placeholder="Search customer"
                      autoFocus
                    />
                  </div>
                  <div className="filter-dropdown-wrapper cursor-pointer">
                    <div className="relative">
                      <img src={DropDownIcon} alt="Drop Icon" />
                      <div
                        className="content-filter"
                        onClick={() => setAppointmentFilter(!appointmentFilter)}
                      >
                        <p
                          className={
                            appFilter == "Upcoming"
                              ? "upcoming-filter"
                              : appFilter == "Completed"
                              ? "completed-filter"
                              : appFilter == "No-shows"
                              ? "no-filter"
                              : appFilter == "Cancelled"
                              ? "cancelled-filter"
                              : "all-filter"
                          }
                        >
                          {appFilter}
                        </p>
                      </div>
                    </div>
                    {appointmentFilter && (
                      <motion.div
                        initial={{ top: "30px" }}
                        animate={{ top: "40px" }}
                        transition={{ duration: 0.1 }}
                        className="filter-dropdown-options cursor-pointer"
                      >
                        {appFilter !== "Upcoming" && (
                          <p
                            className="upcoming-filter"
                            onClick={() => OpenAppFilter("Upcoming")}
                          >
                            Upcoming
                          </p>
                        )}
                        {appFilter !== "Completed" && (
                          <p
                            className="completed-filter"
                            onClick={() => OpenAppFilter("Completed")}
                          >
                            Completed
                          </p>
                        )}
                        {appFilter !== "No-shows" && (
                          <p
                            className="no-filter"
                            onClick={() => OpenAppFilter("No-shows")}
                          >
                            No-shows
                          </p>
                        )}
                        {appFilter !== "Cancelled" && (
                          <p
                            className="cancelled-filter"
                            onClick={() => OpenAppFilter("Cancelled")}
                          >
                            Cancelled
                          </p>
                        )}
                        {appFilter !== "All" && (
                          <p
                            className="all-filter"
                            onClick={() => OpenAppFilter("All")}
                          >
                            All
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    openPlanmodal
                      ? "appointemet-scroll-align-update-version appointemet-scroll-align"
                      : "appointemet-scroll-align"
                  }
                >
                  {appointmentListData?.length > 0 ? (
                    appointmentListData?.map((item, i) => {
                      return (
                        <div key={item._id}>
                          {item[0].status === 0 ? (
                            <>
                              <div>
                                <div className="appointments-same-box">
                                  <div onClick={(e) => MoreInformation(e, i)}>
                                    <div className="cancelled-app-design">
                                      <p>
                                        {moment.utc(item[0].date).format("hh")}:
                                        {moment
                                          .utc(item[0].date)
                                          .format("mm A")}
                                      </p>
                                      <button>Cancelled</button>
                                    </div>
                                    <div className="name-amount-alignment">
                                      <p>
                                        {item[0]?.name
                                          ? item[0]?.name
                                          : item[0]?.type === "prebooking"
                                          ? "Pre-booking"
                                          : item[0]?.type === "Pre-booking"
                                          ? "Pre-booking"
                                          : "Walk-in Customer"}{" "}
                                      </p>
                                      <h6>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {item
                                          .map(
                                            (item) => item?.serviceId?.amount
                                          )
                                          .reduce(
                                            (prev, curr) => prev + curr,
                                            0
                                          )}
                                      </h6>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      more === i
                                        ? moreInformation
                                          ? "show-information"
                                          : "hidden-information"
                                        : "hidden-information "
                                    }
                                  >
                                    <div className="more-information-align">
                                      {item.map((service) => {
                                        return (
                                          <div
                                            key={service._id}
                                            className="tumb-grid tumb-grid-bottom-align"
                                          >
                                            <div className="tumb-grid-items">
                                              <div className="sub-grid-common">
                                                <div className="sub-grid-common-items">
                                                  <div
                                                    className="line-color-dynamic"
                                                    style={{
                                                      backgroundColor:
                                                        service?.serviceId
                                                          ?.colour,
                                                      borderRadius: "5px",
                                                      height: "100%",
                                                    }}
                                                  ></div>
                                                </div>
                                                <div className="sub-grid-common-items">
                                                  <h5>
                                                    {" "}
                                                    {
                                                      service?.serviceId
                                                        ?.serviceName
                                                    }
                                                  </h5>
                                                  <span>
                                                    {service?.staff
                                                      ? "by" +
                                                        " " +
                                                        service?.staff
                                                      : null}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="tumb-grid-items">
                                              <p>
                                                {service?.serviceId?.amount ===
                                                0 ? null : (
                                                  <span>
                                                    {SettingInfo?.currentType}
                                                  </span>
                                                )}{" "}
                                                {service?.serviceId?.amount ===
                                                0
                                                  ? null
                                                  : service?.serviceId?.amount}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      <div className="more-information-footer relative">
                                        <div className="full-button">
                                          <button
                                            onClick={(e) => VoidCancel(item)}
                                          >
                                            Void Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {item[0].status === 1 ? (
                            <>
                              <div className="appointments-same-box">
                                <div onClick={(e) => MoreInformation(e, i)}>
                                  <div className="time-text-alignment">
                                    <p>
                                      {moment.utc(item[0].date).format("hh")}:
                                      {moment.utc(item[0].date).format("mm A")}
                                    </p>
                                    <div className="hair-text-time-alignment">
                                      <span>
                                        {item[0]?.serviceId?.serviceName ===
                                        "Slot"
                                          ? null
                                          : item[0]?.serviceId?.serviceName}
                                        {item[0]?.staffId?.firstName ===
                                        "Unassign"
                                          ? null
                                          : "  by" +
                                            " " +
                                            item[0]?.staffId?.firstName +
                                            " " +
                                            item[0]?.staffId?.lastName}
                                      </span>
                                      {item?.length > 1 ? (
                                        <div className="home-counter-design">
                                          {item?.length - 1}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="name-amount-alignment">
                                    <p>
                                      {item[0]?.name
                                        ? item[0]?.name
                                        : item[0]?.name === ""
                                        ? item[0]?.type === "Walk-in"
                                          ? "Walk-in Customer"
                                          : item[0]?.type
                                        : item[0]?.type === "prebooking"
                                        ? "Pre-booking"
                                        : item[0]?.type === "Pre-booking"
                                        ? "Pre-booking"
                                        : "Walk-in Customer"}
                                    </p>
                                    {item[0]?.serviceId?.amount ? (
                                      <h6>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {item
                                          .map(
                                            (item) => item?.serviceId?.amount
                                          )
                                          .reduce(
                                            (prev, curr) => prev + curr,
                                            0
                                          )}
                                      </h6>
                                    ) : null}
                                  </div>
                                </div>
                                <div
                                  className={
                                    more === i
                                      ? moreInformation
                                        ? "show-information"
                                        : "hidden-information"
                                      : "hidden-information "
                                  }
                                >
                                  <div className="more-information-align">
                                    {item.map((service) => {
                                      return (
                                        <div
                                          key={service._id}
                                          className="tumb-grid tumb-grid-bottom-align"
                                        >
                                          <div className="tumb-grid-items">
                                            <div className="sub-grid-common">
                                              <div className="sub-grid-common-items">
                                                <div
                                                  className="line-color-dynamic"
                                                  style={{
                                                    backgroundColor:
                                                      service?.serviceId
                                                        ?.colour,
                                                    borderRadius: "5px",
                                                    height: "100%",
                                                  }}
                                                ></div>
                                              </div>
                                              <div className="sub-grid-common-items">
                                                <h5>
                                                  {
                                                    service?.serviceId
                                                      ?.serviceName
                                                  }
                                                </h5>
                                                <span>
                                                  {service?.staff
                                                    ? "by" +
                                                      " " +
                                                      service?.staff
                                                    : null}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="tumb-grid-items">
                                            <p>
                                              {service?.serviceId?.amount ===
                                              0 ? null : (
                                                <span>
                                                  {SettingInfo?.currentType}
                                                </span>
                                              )}{" "}
                                              {service?.serviceId?.amount === 0
                                                ? null
                                                : service?.serviceId?.amount}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <div className="more-information-footer">
                                      <div className="button-grid">
                                        <div>
                                          {permission?.filter(
                                            (obj) =>
                                              obj.name ===
                                              "Appointment actions (Cancel, No-show, Edit)"
                                          )[0]?.isChecked === false ? null : (
                                            <div className="button-grid-items relative">
                                              <div className="" ref={optionRef}>
                                                <button
                                                  onClick={() =>
                                                    setMoreOptionMenu(
                                                      !moreOptionMenu
                                                    )
                                                  }
                                                >
                                                  More options
                                                </button>
                                              </div>
                                              <div
                                                className={
                                                  moreOptionMenu
                                                    ? "more-option-dropdown more-option-dropdown-show"
                                                    : "more-option-dropdown more-option-dropdown-hidden"
                                                }
                                              >
                                                <div className="moreoption-menu-design">
                                                  <ul>
                                                    <li
                                                      onClick={(e) =>
                                                        OpenEditAppointment(
                                                          item
                                                        )
                                                      }
                                                    >
                                                      Edit appointment
                                                    </li>
                                                    <li
                                                      onClick={(e) =>
                                                        OpenResheduleAppointment(
                                                          item
                                                        )
                                                      }
                                                    >
                                                      Reschedule
                                                    </li>
                                                    <li
                                                      className="danger-text-color"
                                                      onClick={(e) =>
                                                        CancelAppointment(item)
                                                      }
                                                    >
                                                      Cancel{" "}
                                                    </li>
                                                    <li
                                                      onClick={(e) =>
                                                        NoshowAppointment(item)
                                                      }
                                                    >
                                                      {" "}
                                                      No Show
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        {permission?.filter(
                                          (obj) =>
                                            obj.name ===
                                            "Generate new invoice/Checkout"
                                        )?.[0]?.isChecked === false ? null : (
                                          <div className="button-grid-items relative">
                                            <div
                                              className=""
                                              onClick={(e) =>
                                                OpenGenerateInvoice(item)
                                              }
                                            >
                                              <button>Checkout</button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {item[0].status === 3 ? (
                            <>
                              <div className="appointments-same-box">
                                <div onClick={(e) => MoreInformation(e, i)}>
                                  <div className="time-text-alignment">
                                    <p>
                                      {moment.utc(item[0].date).format("hh")}:
                                      {moment.utc(item[0].date).format("mm A")}
                                    </p>
                                    <div className="hair-text-time-alignment">
                                      <span>
                                        {item[0]?.serviceId?.serviceName ===
                                        "Slot"
                                          ? null
                                          : item[0]?.serviceId?.serviceName}
                                        {item[0]?.staffId?.firstName === "Slot"
                                          ? null
                                          : "  by" +
                                            " " +
                                            item[0]?.staffId?.firstName +
                                            " " +
                                            item[0]?.staffId?.lastName}
                                      </span>
                                      {item?.length > 1 ? (
                                        <div className="home-counter-design">
                                          {item?.length - 1}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="name-amount-alignment">
                                    <p>
                                      {item[0]?.name
                                        ? item[0]?.name
                                        : item[0]?.type === "prebooking"
                                        ? "Pre-booking"
                                        : item[0]?.type === "Pre-booking"
                                        ? "Pre-booking"
                                        : "Walk-in Customer"}
                                    </p>
                                    {item[0]?.serviceId?.amount ? (
                                      <h6>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {item
                                          .map(
                                            (item) => item?.serviceId?.amount
                                          )
                                          .reduce(
                                            (prev, curr) => prev + curr,
                                            0
                                          )}
                                      </h6>
                                    ) : null}
                                  </div>
                                </div>
                                <div
                                  className={
                                    more === i
                                      ? moreInformation
                                        ? "show-information"
                                        : "hidden-information"
                                      : "hidden-information "
                                  }
                                >
                                  <div className="more-information-align">
                                    {item.map((service) => {
                                      return (
                                        <div
                                          key={service._id}
                                          className="tumb-grid tumb-grid-bottom-align"
                                        >
                                          <div className="tumb-grid-items">
                                            <div className="sub-grid-common">
                                              <div className="sub-grid-common-items">
                                                <div
                                                  className="line-color-dynamic"
                                                  style={{
                                                    backgroundColor:
                                                      service?.serviceId
                                                        ?.colour,
                                                    borderRadius: "5px",
                                                    height: "100%",
                                                  }}
                                                ></div>
                                              </div>
                                              <div className="sub-grid-common-items">
                                                <h5>
                                                  {
                                                    service?.serviceId
                                                      ?.serviceName
                                                  }
                                                </h5>
                                                <span>
                                                  {service?.staff
                                                    ? "by" +
                                                      " " +
                                                      service?.staff
                                                    : null}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="tumb-grid-items">
                                            <p>
                                              {service?.serviceId?.amount ===
                                              0 ? null : (
                                                <span>
                                                  {SettingInfo?.currentType}
                                                </span>
                                              )}{" "}
                                              {service?.serviceId?.amount === 0
                                                ? null
                                                : service?.serviceId?.amount}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <div className="more-information-footer relative">
                                      <div className="full-button">
                                        <button
                                          onClick={(e) => ViewInvoiceData(item)}
                                        >
                                          View Invoice
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {item[0].status === 2 ? (
                            <>
                              <div>
                                <div className="appointments-same-box">
                                  <div onClick={(e) => MoreInformation(e, i)}>
                                    <div className="noshow-app-design">
                                      <p>
                                        {moment.utc(item[0].date).format("hh")}:
                                        {moment
                                          .utc(item[0].date)
                                          .format("mm A")}
                                      </p>
                                      <button>No-Show</button>
                                    </div>
                                    <div className="name-amount-alignment">
                                      <p>
                                        {item[0]?.name
                                          ? item[0]?.name
                                          : item[0]?.type === "prebooking"
                                          ? "Pre-booking"
                                          : item[0]?.type === "Pre-booking"
                                          ? "Pre-booking"
                                          : "Walk-in Customer"}{" "}
                                      </p>
                                      <h6>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {item
                                          .map(
                                            (item) => item?.serviceId?.amount
                                          )
                                          .reduce(
                                            (prev, curr) => prev + curr,
                                            0
                                          )}
                                      </h6>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      more === i
                                        ? moreInformation
                                          ? "show-information"
                                          : "hidden-information"
                                        : "hidden-information "
                                    }
                                  >
                                    <div className="more-information-align">
                                      {item.map((service) => {
                                        return (
                                          <div
                                            key={service._id}
                                            className="tumb-grid tumb-grid-bottom-align"
                                          >
                                            <div className="tumb-grid-items">
                                              <div className="sub-grid-common">
                                                <div className="sub-grid-common-items">
                                                  <div
                                                    className="line-color-dynamic"
                                                    style={{
                                                      backgroundColor:
                                                        service?.serviceId
                                                          ?.colour,
                                                      borderRadius: "5px",
                                                      height: "100%",
                                                    }}
                                                  ></div>
                                                </div>
                                                <div className="sub-grid-common-items">
                                                  <h5>
                                                    {" "}
                                                    {
                                                      service?.serviceId
                                                        ?.serviceName
                                                    }
                                                  </h5>
                                                  <span>
                                                    {service?.staff
                                                      ? "by" +
                                                        " " +
                                                        service?.staff
                                                      : null}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="tumb-grid-items">
                                              <p>
                                                {service?.serviceId?.amount ===
                                                0 ? null : (
                                                  <span>
                                                    {SettingInfo?.currentType}
                                                  </span>
                                                )}{" "}
                                                {service?.serviceId?.amount ===
                                                0
                                                  ? null
                                                  : service?.serviceId?.amount}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      <div className="more-information-footer relative">
                                        <div className="full-button">
                                          <button
                                            onClick={(e) => VoidNoshow(item)}
                                          >
                                            Void No Show
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      );
                    })
                  ) : (
                    <div className="new-appointment-height-alignment">
                    <div>
                      <div className="icon-center-alignment">
                        <img src={QuiteIcon} alt="QuiteIcon" />
                      </div>
                      <div className="text-style">
                        <p>Too quite here...</p>
                        <h4>
                          Click on <a>Add new</a> to book appointments
                        </h4>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {storeOnboardingTourStatus &&
          storeOnboardingCurrentTooltip === "getSMS" && (
            <div className="congratulations-modal-blur">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="congratulations-modal"
              >
                <h1>
                  Congratulations on creating <br /> your first invoice!
                </h1>
                <div className="cong-image-center-alignment">
                  <img src={CongImage} alt="CongImage" />
                </div>
                <div className="child-modal-text-alignment">
                  <div>
                    <p>
                      Checkout the SMS you got on your mobile number Your
                      customers will get an invoice like that
                    </p>
                    <p>
                      Here is the link to the invoice{" "}
                      <a
                        href={`/invoice/${onboardInvoiceData?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click here
                      </a>
                    </p>
                  </div>
                </div>
                <div className="got-the-sms">
                  <button
                    onClick={(e) => {
                      handleOnboardingGotSMS();
                    }}
                  >
                    Got the SMS
                  </button>
                </div>
              </motion.div>
            </div>
          )}

        {/* new dashboard design */}

        <div className="">
          <div className=""></div>
        </div>
        {/* statement tooltip */}
        {storeOnboardingTourStatus &&
          storeOnboardingTooltipStatus &&
          storeOnboardingCurrentTooltip === "finish" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="custom-statement-tooltip note-statement-tooltip tooltip-I2"
              style={{ pointerEvents: storeOnboardingTourStatus && "all" }}
            >
              <div className="statement-tooltip-design">
                <h3>Statement</h3>
                <p>One last thing...</p>
                <p>Checkout statement for your daily reports</p>
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
                      onClick={(e) => {
                        handleOnboardingTourComplete();
                      }}
                    >
                      Got it, Next
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </motion.div>

      {/* {editAppointmentmodal && (
        <AppointmentModal
          modal={editAppointmentmodal}
          toggle={editAppointmentModaltoggle}
          getAll={() => getDashboardByAppointment(new Date())}
        />
      )} */}

      <>
        {/* {(storeOnboardingStatus === null &&  storeOnboardingTourProgress === 0 ) && <WelcomeModal/>} */}
        {storeOnboardingStatus === null &&
          allInvoiceData?.length === 0 &&
          storeOnboardingTourProgress === 0 && <WelcomeModal />}
      </>

      <>
        {storeOnboardingTourProgress !== 100 &&
          storeOnboardingTourProgress !== 0 &&
          !storeOnboardingTourStatus && <TasklistProfile />}
      </>

      {openSalesAnalytics && (
        <SalesAnalytics
          startDate={startOfWeek}
          endDate={endOfWeek}
          weeklySales={weeklySales}
          analyticsData={analyticsData}
          modal={openSalesAnalytics}
          toggle={openSalesAnalyticsToggle}
          SettingInfo={SettingInfo}
        />
      )}
      {openAppointmentAnalytics && (
        <AppointmentAnalytics
          startDate={startOfWeek}
          endDate={endOfWeek}
          weeklyAppointment={weeklyAppointment}
          analyticsData={analyticsData}
          modal={openAppointmentAnalytics}
          toggle={openAppointmentAnalyticsToggle}
        />
      )}
      {openRescheduleModal && (
        <RescheduleModal
          startDate={startOfWeek}
          endDate={endOfWeek}
          appointment={appointment}
          appointmentList={appointmentList}
          modal={openRescheduleModal}
          toggle={rescheduleAppointmentModaltoggle}
        />
      )}
      {childSidebar && <ChildSidebar modal={childSidebar} />}
      {openGenerateNewModal && (
        <GenerateNewInvoice
          modal={openGenerateNewModal}
          toggle={OpenGenerateNewtoggle}
          closeTourOnClose={closeTourOnClose}
          SettingInfo={SettingInfo}
        />
      )}

      {viewInvoiceModal && (
        <ViewInvoiceModal
          modal={viewInvoiceModal}
          toggle={ViewInvoiceModalToggle}
          ViewInvoice={ViewInvoice}
          invoice={invoiceDetail}
          getInvoices={getInvoices}
          TostMSG={TostMSG}
          SettingInfo={SettingInfo}
        />
      )}

      {visitAnalytics && (
        <VisitAnalyticsModal
          modal={visitAnalytics}
          toggle={VisitAnalyticsToggle}
        />
      )}

      {salesAnalytics && (
        <SalesAnalyticsModal
          modal={salesAnalytics}
          toggle={SalesAnalyticsToggle}
          SettingInfo={SettingInfo}
        />
      )}
      {openeditmodal ? (
        <AddNewAppointmentModal
          modal={openeditmodal}
          toggle={OpenEditAppointment}
          editAppointment={editAppointment}
          rescheduleAppointments={rescheduleAppointments}
          SettingInfo={SettingInfo}
        />
      ) : null}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {opennewinvoice && (
        <GenerateNewInvoice
          invoiceData={invoiceData}
          toggle={OpenGenerateInvoice}
          SettingInfo={SettingInfo}
        />
      )}
      {openAttendanceModal && (
        <AttendanceModal
          toggle={attendanceToggle}
          staffRequestedData={staffRequestedData}
          staffData={staffData}
          getStaffByCompany={getStaffByCompany}
          showDefault={showDefault}
          setShowDefault={setShowDefault}
          userInfo={userInfo}
          attendanceMarkDate={attendanceMarkDate}
          setAttendaceDateMark={setAttendaceDateMark}
          permission={permission}
        />
      )}
      {openRequestModal && (
        <AttendanceRequest
          toggle={openAttendanceclockin}
          staffRequestedData={staffRequestedData}
          requestedStaffDetails={requestedStaffDetails}
          setOpenRequestModal={setOpenRequestModal}
          setOpenAttendanceModal={setOpenAttendanceModal}
          attendanceMark={attendanceMark}
          setAttendaceMark={setAttendaceMark}
        />
      )}
      {openExpencemodal && (
        <Expenses
          SetOpenExpencemodal={SetOpenExpencemodal}
          permission={permission}
        />
      )}
   
    </>
  );
};

export default Home;
