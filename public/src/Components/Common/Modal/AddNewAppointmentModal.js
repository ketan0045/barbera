import React, { useState, useRef, useEffect } from "react";
import "./Modal.scss";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import AppointmentImage from "../../../assets/svg/app.png";
import BookingImage from "../../../assets/svg/booking-image.png";
import OptionSelect from "../OptionSelect/OptionSelect";
import UserAdd from "../../../assets/svg/user-add.svg";
import SearchIcon from "../../../assets/svg/X.svg";
import BackArrowService from "../../../assets/svg/Group.svg";
import InputSearchIcon from "../../../assets/svg/search.svg";
import Popper from "popper.js";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "react-datepicker";
import CloseBtn from "../../../assets/svg/close-btn.svg";
import EditServiceModals from "./EditServiceModals";
import { toast } from "react-toastify";
import Success from "../../Common/Toaster/Success/Success";
import AddCustomerModal from "./AddCustomerModal";
import dateTime from "date-time";
import membershipProfileSmall from "../../../assets/svg/membership-profile-small.svg";
import YellowMembership from "../../../assets/svg/Yellow-Membership.svg";
import SkyBlueMembership from "../../../assets/svg/SkyBlue-Membership.svg";
import OrangeMembership from "../../../assets/svg/Orange-Membership.svg";
import BlueMembership from "../../../assets/svg/BLue-Membership.svg";
import { get_Setting } from "../../../utils/user.util";


export default function AddNewAppointmentModal(props) {
  const {
    uuid,
    toggle,
    data,
    editAppointment,
    rescheduleAppointments,
    args,
    addEvent,
    customerDetail,
    SettingInfo,
  } = props;
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [selectappointmemntType, setSelectAppointmemntType] = useState();
  const [appointmentType, setAppointmentType] = useState();
  const [selectDate, setSelectDate] = useState(true);
  const [selectTime, setSelectTime] = useState(true);
  const [selectService, setSelectService] = useState(true);
  const [selectStaff, setSelectStaff] = useState(true);
  const [checkout, setCheckout] = useState(true);
  const [date, setDate] = useState();
  const [hour, setHour] = useState();
  const [selectHour, setSelectHour] = useState("-");
  const [selectMinute, setSelectMinute] = useState();
  const [productDropdown, setProductDropdown] = useState(false);
  const [starthour, setStartHour] = useState();
  const [endhour, setEndHour] = useState();
  const [allServices, setAllServices] = useState();
  const [allCompanyServices, setAllCompanyServices] = useState();
  const [allStaff, setAllStaff] = useState();
  const [searchKeyword, setSearchKeyword] = useState();
  const [searchKeywrd, setSearchKeywrd] = useState();
  const [timeDetail, setTimeDetail] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [time, setTime] = useState();
  const [serviceId, setServiceId] = useState();
  const [staff, setStaff] = useState();
  const [service, setService] = useState();
  const [appointment, setAppointmnet] = useState();
  const [staffId, setStaffId] = useState();
  const [multipleappointment, setMultipleAppointment] = useState([]);
  const [newmultipleappointment, setNewMultipleAppointment] = useState([]);
  const [search, setSearch] = useState();
  const [allCustomer, setAllCustomer] = useState();
  const [allCompanyCustomer, setAllCompanyCustomer] = useState();
  const [customer, setCustomer] = useState();
  const [name, setName] = useState();
  const [minutes, setMinutes] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [editServiceModal, setEditServiceModal] = useState(false);
  const [startTime, setStartTime] = useState();
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [workingDays, setWorkingDays] = useState();
  const [storeTiming, setStoreTiming] = useState();
  const [staffs, setStaffs] = useState([]);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [addtrue, setAddTrue] = useState(true);
  const [editServiceData, setEditServiceData] = useState();
  const [editId, setEditId] = useState();
  const [categoryWiseStaff, setCategoryWiseStaff] = useState();
  const [times, setTimes] = useState(selectHour + ":" + timeDetail);
  const [ispromotional, setIsPromotional] = useState(true);
  const [customerCompulsion, setCustomerCompulsion] = useState(true);
  const [saveService, setSaveService] = useState(true);
  const [dayy, setDayy] = useState();
  const [allFrequentServices, setAllFrequentServices] = useState([]);
  const [allNonFrequentServices, setAllNonFrequentServices] = useState([]);
  const [isFrequentServiceOn, setIsFrequentServiceOn] = useState(
    SettingInfo?.frequentService
  );
  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };
  useEffect(() => {
    setDate(props.selectDate);
  }, [props.selectDate]);

  const timing =
    selectHour > 12
      ? selectHour - 12 + ":" + (timeDetail === 0 ? "00" : timeDetail)
      : selectHour + ":" + (timeDetail === 0 ? "00" : timeDetail);
  let staffEndISODates = date
    ? new Date(`${date} UTC`)
    : props.selectDate
    ? new Date(`${props.selectDate} UTC`)
    : new Date();
  let total = multipleappointment[0]?.serviceId
    ? multipleappointment &&
      multipleappointment
        .map((item) => item?.serviceId?.amount)
        .reduce((prev, curr) => prev + curr, 0)
    : 0;
  const [selectedDate, setSelectedDate] = useState();
  useEffect(() => {
    const SettingData = get_Setting();

    setAppointmnet(SettingData.appointments);
    setService(SettingData.service);
    setStaff(SettingData.staff);
    if (!SettingData.appointments) {
      setAppointmentType("Pre-Booking");
    } else {
      setAppointmentType("Pre-Booking");
      if (!editAppointment && !rescheduleAppointments) {
        setSelectAppointmemntType(true);
      }
    }
    if (props.selectDate) {
      setSelectAppointmemntType(false);
      setSelectDate(false);
      setSelectTime(true);
      setSelectService(true);
      setSelectStaff(true);
      setCheckout(true);
      OpenHourSelect();
    }

    // ApiGet("setting/company/" + userInfo.companyId)
    //   .then((res) => {
    //     if (res.data.status === 200) {
    //       setAppointmnet(res.data.data[0].appointments);
    //       setService(res.data.data[0].service);
    //       setStaff(res.data.data[0].staff);
    //       if (!res.data.data[0].appointments) {
    //         setAppointmentType("Pre-Booking");
    //       } else {
    //         setAppointmentType("Pre-Booking");
    //         if (!editAppointment && !rescheduleAppointments) {
    //           setSelectAppointmemntType(true);
    //         }
    //       }
    //       if (props.selectDate) {
    //         setSelectAppointmemntType(false);
    //         setSelectDate(false);
    //         setSelectTime(true);
    //         setSelectService(true);
    //         setSelectStaff(true);
    //         setCheckout(true);
    //         OpenHourSelect();
    //       }
    //     } else {
    //       console.log("in the else");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("error while getting Categories", err);
    //   });

    if (customerDetail) {
      setCustomer(customerDetail);
      setMobileNumber(customerDetail?.mobileNumber);
      setName(customerDetail?.firstName + " " + customerDetail?.lastName);
    }
    if (editAppointment) {
      setSelectAppointmemntType(false);
      setAppointmentType(editAppointment[0]?.type);
      setSelectDate(false);
      setSelectService(false);
      setSelectStaff(false);
      setCheckout(false);
      setMultipleAppointment(editAppointment);
      setDate(moment(editAppointment[0]?.date)._d);
      setEditId(editAppointment._id);
      setSelectedDate(
        moment(editAppointment[0]?.date).subtract(330, "minutes")._d
      );

      if (editAppointment[0]?.name === "") {
      } else {
        setCustomer(editAppointment[0]?.customer);
        setName(editAppointment[0]?.name);
        setMobileNumber(editAppointment[0]?.mobile);
      }
    }
    if (args) {
      if (args.type) {
        setSelectAppointmemntType(false);
        setAppointmentType(args.type);
        setSelectDate(false);
        setSelectService(false);
        setSelectStaff(false);
        setCheckout(false);
        // setMultipleAppointment(args)
        setDate(moment(args.date)._d);
        setEditId(args._id);
        setSelectedDate(moment(args.date).subtract(330, "minutes")._d);
        // setMultipleAppointment(editAppointment)
        if (args.name === "") {
        } else {
          setCustomer({ firstName: args.name, mobileNumber: args.mobile });
          setName(args.name);
          setMobileNumber(args.mobile);
        }
      } else {
        setSelectAppointmemntType(false);
        setAppointmentType("Pre-Booking");
        setSelectDate(false);
        setSelectService(false);
        setDate(moment(args.StartTime)._d);
        setSelectedDate(moment(args.StartTime).subtract(330, "minutes")._d);
        setStaffId(args.staffId);
      }
    }
    if (rescheduleAppointments) {
      setSelectAppointmemntType(false);
      setAppointmentType(rescheduleAppointments[0]?.type);
      setSelectDate(false);
      setSelectService(false);
      setSelectStaff(false);
      setCheckout(false);
      setMultipleAppointment(rescheduleAppointments);
      setDate(moment(rescheduleAppointments[0]?.date)._d);
      setSelectedDate(
        moment(rescheduleAppointments[0]?.date).subtract(330, "minutes")._d
      );
      setEditId(rescheduleAppointments._id);
      if (rescheduleAppointments[0]?.name === "") {
      } else {
        setCustomer(rescheduleAppointments[0]?.customer);
        setName(rescheduleAppointments[0]?.name);
        setMobileNumber(rescheduleAppointments[0]?.mobile);
      }
    }
  }, []);
  useEffect(async () => {
    getAllServices();
    getStoreSetting();
    let datePayload = {
      startTime: moment(date).format("YYYY-MM-DD"),
      endTime: moment(date).add(1, "days").format("YYYY-MM-DD"),
    };
    let attendanceRes = await ApiPost(
      "attendence/company/" + userInfo.companyId,
      datePayload
    );
    let tempData = attendanceRes.data.data?.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    let tempAttendanceData = removeDuplicateObjectFromArray(
      tempData,
      "staffId"
    );
    let thisDayAttendanceData = tempAttendanceData || [];
    ApiGet("staff/company/" + userInfo.companyId).then((resp) => {
      let filterstaff = resp.data.data.filter((obj) =>
        obj.firstName === "Unassign" ? null : obj
      );
      let availableStaff;
      if (
        moment(date).format("DD-MM-YYYY") ==
          moment(new Date()).format("DD-MM-YYYY") &&
        SettingInfo?.attendence?.attendanceToggle &&
        SettingInfo?.attendence?.attendanceForInvoiceToggle
      ) {
        availableStaff = filterstaff?.filter(
          (item) =>
            thisDayAttendanceData?.find((data) => data?.staffId === item?._id)
              ?.currentStatus === "clockIn"
        );
      } else {
        availableStaff = filterstaff;
      }
     
      setStaffs(resp.data.data);
      setAllStaff(availableStaff);
    });
  }, []);
  const getStoreSetting = async (values) => {
    const SettingData = get_Setting();
    setStoreTiming(SettingData.storeTiming);
    setWorkingDays(SettingData.workingDays);
    setCustomerCompulsion(SettingData.customer);
    // try {
    //   let res = await ApiGet("setting/company/" + userInfo.companyId);
    //   if (res.data.status === 200) {
    //     setStoreTiming(res.data.data[0].storeTiming);
    //     setWorkingDays(res.data.data[0].workingDays);
    //     setCustomerCompulsion(res?.data?.data[0]?.customer);
    //   }
    // } catch (err) {
    //   console.log("error while getting Forum", err);
    // }
  };
  const appointmentdata = {
    type: appointmentType,
    date:
      multipleappointment.length > 0
        ? startTime
        : moment(staffEndISODates).add(times)._d,
    default: staff && service ? false : true,
    time: service ? time : "30",
    serviceId: serviceId,
    name: name ? name : "",
    companyId: userInfo.companyId,
    isPromotional: ispromotional,
    mobile: mobileNumber ? mobileNumber : "",
    status: 1,
    uuid: editAppointment ? editAppointment[0]?.uuid : uuid,
  };

  const changeSmsCheckbox = (e) => {
    setIsPromotional(!ispromotional);
    setMultipleAppointment(
      multipleappointment.map((item) => {
        return { ...item, isPromotional: !ispromotional };
      })
    );
  };

  const SelectAppointmenttype = (data) => {
    if (data === "Walk-in") {
      let dayInNumber = moment.utc(dateTime()).day();
      let day;
      let add = true;

      if (dayInNumber === 1) {
        day = "Monday";
      } else if (dayInNumber === 2) {
        day = "Tuesday";
      } else if (dayInNumber === 3) {
        day = "Wednesday";
      } else if (dayInNumber === 4) {
        day = "Thursday";
      } else if (dayInNumber === 5) {
        day = "Friday";
      } else if (dayInNumber === 6) {
        day = "Saturday";
      } else if (dayInNumber === 0) {
        day = "Sunday";
      }
      let today = new Date();
      let ISODate = new Date(`${date}`);
      if (day === "Monday") {
        if (!workingDays.includes("Monday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Tuesday") {
        if (!workingDays.includes("Tuesday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Wednesday") {
        if (!workingDays.includes("Wednesday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Thursday") {
        if (!workingDays.includes("Thursday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Friday") {
        if (!workingDays.includes("Friday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Saturday") {
        if (!workingDays.includes("Saturday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Sunday") {
        if (!workingDays.includes("Sunday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      }

      let Endtime;
      let Starttime;
      storeTiming?.map((obj) => {
        return obj.day === day ? (Endtime = obj.endtime) : null;
      });
      storeTiming?.map((obj) => {
        return obj.day === day ? (Starttime = obj.starttime) : null;
      });
      let datedata = moment().format("LL");
      let date1 = new Date();
      let storeStartISODate = moment(datedata).add(Starttime)._d;
      let storeEndISODate = moment(datedata).add(Endtime)._d;
      let storeEndDate = moment(storeEndISODate).add(15, "minutes");
      let date2 = moment(date1);
      let apppointmentStartTime = date2;
      let apppointmentEndTime = moment(date2).add(30, "minutes");

      if (storeEndDate._i < apppointmentEndTime._d) {
        add = false;
        setAddTrue(false);
        setSuccess(true);
        setEr("error");
        setToastmsg("Store closed!");
      }

      if (storeStartISODate > apppointmentStartTime._d) {
        add = false;
        setAddTrue(false);
        setSuccess(true);
        setEr("error");
        setToastmsg("Store closed!");
      }

      if (add) {
        setAppointmentType(data);
        setSelectAppointmemntType(false);
        setSelectDate(false);
        setSelectService(false);
        setDate(moment.utc(dateTime()));
        // setSelectedDate(moment.utc(dateTime()))
        if (!service && staff) {
          setSelectStaff(false);
        }
        if (!service && !staff) {
          setSelectDate(false);
          setSelectService(false);
          setSelectStaff(false);
          setCheckout(false);
          multipleappointment.push(
            Object.assign(appointmentdata, {
              date: moment(new Date()).add(330, "minutes")._d,
              default: true,
              type: "Walk-in",
              staff: "Unassign",
            })
          );
          setMultipleAppointment([...multipleappointment]);
        }
      }
    }
    if (data === "Pre-booking") {
      setAppointmentType(data);
      setSelectAppointmemntType(false);
      setSelectDate(true);
      setSelectService(true);
    }
  };

  const Opencalander = () => {
    setAppointmentType(false);
  };

  const OpenHourSelect = async () => {
    if (date) {
      let dayInNumber = moment(date).day();
      let day;
      let add = true;

      if (dayInNumber === 1) {
        day = "Monday";
      } else if (dayInNumber === 2) {
        day = "Tuesday";
      } else if (dayInNumber === 3) {
        day = "Wednesday";
      } else if (dayInNumber === 4) {
        day = "Thursday";
      } else if (dayInNumber === 5) {
        day = "Friday";
      } else if (dayInNumber === 6) {
        day = "Saturday";
      } else if (dayInNumber === 0) {
        day = "Sunday";
      }
      let today = new Date();
      let ISODate = new Date(`${date}`);
      if (day === "Monday") {
        if (!workingDays.includes("Monday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Tuesday") {
        if (!workingDays.includes("Tuesday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Wednesday") {
        if (!workingDays.includes("Wednesday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Thursday") {
        if (!workingDays.includes("Thursday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Friday") {
        if (!workingDays.includes("Friday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Saturday") {
        if (!workingDays.includes("Saturday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Sunday") {
        if (!workingDays.includes("Sunday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      }

      if (moment(ISODate).format("LL") === moment(today).format("LL")) {
      } else {
        if (moment(ISODate) < moment(today)) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Action not allowed");
        }
      }
      if (add) {
        setSelectDate(false);
        let StartTime;
        let EndTime;
        const SettingData = get_Setting();
        const data = SettingData.storeTiming;
        data?.map((rep) => {
          return day === rep.day ? (StartTime = rep.starttime) : null;
        });
        data?.map((rep) => {
          return day === rep.day ? (EndTime = rep.endtime) : null;
        });

        setStartHour(moment(StartTime, ["HH.mm"]).format("HH"));
        setEndHour(moment(EndTime, ["HH.mm"]).format("HH"));

        // let res = await ApiGet("setting/company/" + userInfo.companyId);
        //   try {
        //     if (res.data.status === 200) {
        //       const data = res.data.data[0].storeTiming;
        //       data?.map((rep) => {
        //         return day === rep.day ? (StartTime = rep.starttime) : null;
        //       });
        //       data?.map((rep) => {
        //         return day === rep.day ? (EndTime = rep.endtime) : null;
        //       });

        //       setStartHour(moment(StartTime, ["HH.mm"]).format("HH"));
        //       setEndHour(moment(EndTime, ["HH.mm"]).format("HH"));
        //     } else {
        //       console.log("in the else");
        //     }
        //   } catch (err) {
        //     console.log("error while getting Categories", err);
        //   }
      }
    } else if (props.selectDate) {
      setDate(props.selectDate);
      let dayInNumber = moment(props.selectDate).day();
      let day;
      let add = true;
      if (dayInNumber === 1) {
        day = "Monday";
      } else if (dayInNumber === 2) {
        day = "Tuesday";
      } else if (dayInNumber === 3) {
        day = "Wednesday";
      } else if (dayInNumber === 4) {
        day = "Thursday";
      } else if (dayInNumber === 5) {
        day = "Friday";
      } else if (dayInNumber === 6) {
        day = "Saturday";
      } else if (dayInNumber === 0) {
        day = "Sunday";
      }
      let today = new Date();
      let ISODate = new Date(`${props.selectDate}`);
      let workday;
      try {
        const SettingData = get_Setting();
        workday = SettingData.workingDays;
        // let res = await ApiGet("setting/company/" + userInfo.companyId);
        // if (res.data.status === 200) {
        //   workday = res.data.data[0].workingDays;
        // }
      } catch (err) {
        console.log("error while getting Forum", err);
      }
      if (day === "Monday") {
        if (!workday?.includes("Monday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Tuesday") {
        if (!workday?.includes("Tuesday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Wednesday") {
        if (!workday?.includes("Wednesday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Thursday") {
        if (!workday?.includes("Thursday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Friday") {
        if (!workday?.includes("Friday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Saturday") {
        if (!workday?.includes("Saturday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      } else if (day === "Sunday") {
        if (!workday?.includes("Sunday")) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      }

      if (moment(ISODate).format("LL") === moment(today).format("LL")) {
      } else {
        if (moment(ISODate) < moment(today)) {
          add = false;
          setSuccess(true);
          setEr("error");
          setToastmsg("Action not allowed");
        }
      }
      if (add) {
        setSelectDate(false);
        let StartTime;
        let EndTime;
        const SettingData = get_Setting();

        const data = SettingData.storeTiming;
        data?.map((rep) => {
          return day === rep.day ? (StartTime = rep.starttime) : null;
        });
        data?.map((rep) => {
          return day === rep.day ? (EndTime = rep.endtime) : null;
        });
        setStartHour(moment(StartTime, ["HH.mm"]).format("HH"));
        setEndHour(moment(EndTime, ["HH.mm"]).format("HH"));
        //   let res = await ApiGet("setting/company/" + userInfo.companyId);
        //   try {
        //     if (res.data.status === 200) {
        //       const data = res.data.data[0].storeTiming;
        //       data?.map((rep) => {
        //         return day === rep.day ? (StartTime = rep.starttime) : null;
        //       });
        //       data?.map((rep) => {
        //         return day === rep.day ? (EndTime = rep.endtime) : null;
        //       });

        //       setStartHour(moment(StartTime, ["HH.mm"]).format("HH"));
        //       setEndHour(moment(EndTime, ["HH.mm"]).format("HH"));
        //     } else {
        //       console.log("in the else");
        //     }
        //   } catch (err) {
        //     console.log("error while getting Categories", err);
        //   }
      }
    } else {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Please Select Date");
    }
  };

  const BackToSelectAppointmemntType = () => {
    setSelectAppointmemntType(true);
    if (appointment) {
    } else {
      setSelectAppointmemntType(false);
    }
  };

  const BackTOselectDate = () => {
    setSelectDate(true);
    setSelectTime(true);
  };
  const BackToCheckout = () => {
    setSelectStaff(false);
    setCheckout(false);
  };
  const BackToSelectTime = () => {
    if (props.selectDate) {
    } else {
      if (appointmentType === "Pre-booking") {
        setSelectDate(true);
        setSelectService(true);
      } else if (appointmentType === "Walk-in") {
        setSelectAppointmemntType(true);
        setDate();
      } else {
        setSelectDate(true);
        setSelectService(true);
      }
    }
  };

  const BackToSelectService = () => {
    setSelectStaff(true);
    ApiGet("service/company/" + userInfo.companyId).then((resp) => {
      let filterservice = resp.data.data.filter((obj) =>
        obj.categoryName === "Unassign" ? null : obj
      );

      if (isFrequentServiceOn) {
        let tempFrequentServices = filterservice?.filter(
          (ser) => ser?.frequentService
        );
        let tempSortedServices = tempFrequentServices?.sort(
          (a, b) => a?.index - b?.index
        );
        setAllFrequentServices(
          tempSortedServices?.filter((ser) => ser?.frequentService)
        );
        let nonFrequentServices = filterservice?.filter(
          (ser) => !ser?.frequentService
        );
        setAllNonFrequentServices(
          nonFrequentServices?.sort(
            (a, b) => new Date(a?.created) - new Date(b?.created)
          )
        );
        tempSortedServices?.push(...nonFrequentServices);
        setAllServices(tempSortedServices);
        setAllCompanyServices(tempSortedServices);
      } else {
        let tempUnsortedServices = filterservice?.sort(
          (a, b) => new Date(a?.created) - new Date(b?.created)
        );
        setAllServices(filterservice);
        setAllCompanyServices(filterservice);
      }
    });

    if (appointment) {
      if (!service) {
        setSelectStaff(false);
        if (appointmentType === "Walk-in") {
          setSelectAppointmemntType(true);
          setDate();
        } else {
          setSelectService(true);
        }
      }
    } else {
      if (service) {
      } else {
        setSelectStaff(false);
        setSelectService(true);
        // setSelectDate(true)
      }
    }
  };
  useEffect(async () => {
    try {
      let res = await ApiGet("customer/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setAllCompanyCustomer(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  }, []);

  const handleCustomerSearch = (e) => {
    setSearch(e.target.value);
    var serviceData =
      allCompanyCustomer?.length > 0 &&
      allCompanyCustomer?.filter(
        (obj) =>
          (obj.firstName &&
            obj.firstName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.lastName &&
            obj.lastName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.mobileNumber &&
            obj.mobileNumber
              .toLowerCase()
              .includes(e.target.value.toLowerCase()))
      );

    if (e.target.value === "") {
      setAllCustomer("");
    } else {
      setAllCustomer(serviceData);
    }
  };
  const AddCustomertoggle = (data) => {
    setAddCustomerModal(!addCustomerModal);

    if (addCustomerModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("New customer added!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Customer alredy exist!");
        }
      }
    }
  };

  const AddNewCustomer = async (data) => {
    let res = await ApiPost("customer/", data);

    if (res.data.status) {
      if (res.data.status === 200) {
        setCustomer(res.data.data);
        setMultipleAppointment(
          multipleappointment.map((item) => {
            return {
              ...item,
              name: res.data.data.firstName + " " + res.data.data.lastName,
              mobile: res.data.data.mobileNumber,
            };
          })
        );
        setSuccess(true);
        setToastmsg("New customer added!");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
    AddCustomertoggle(false);
  };
  const SelectCustomer = (e, data) => {
    setCustomer(data);
    setIsPromotional(data?.isAppointment);
    setAllCustomer("");
    setSearch("");
    setProductDropdown(!productDropdown);

    setMultipleAppointment(
      multipleappointment.map((item) => {
        return {
          ...item,
          name: data.firstName + " " + data.lastName,
          mobile: data.mobileNumber,
          isPromotional: data?.isAppointment,
        };
      })
    );
    setMobileNumber(data.mobileNumber);
    setName(data.firstName);
  };
  //out side click functions

  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const wrapperRef = useRef(null);
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "top",
    });
    setProductDropdown(!productDropdown);
  };
  const closeDropdownPopover = () => {
    setProductDropdown(false);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setProductDropdown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(wrapperRef);
  AddNewAppointmentModal.propTypes = {
    children: PropTypes.element.isRequired,
  };

  const SelectFullDate = (data) => {
    setDate(data);
  };

  const getAllServices = async (e) => {
    try {
      let res = await ApiGet("service/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        let filterservice = res.data.data.filter((obj) =>
          obj.categoryName === "Unassign" ? null : obj
        );
        if (isFrequentServiceOn) {
          let tempFrequentServices = filterservice?.filter(
            (ser) => ser?.frequentService
          );
          let tempSortedServices = tempFrequentServices?.sort(
            (a, b) => a?.index - b?.index
          );
          setAllFrequentServices(
            tempSortedServices?.filter((ser) => ser?.frequentService)
          );
          let nonFrequentServices = filterservice?.filter(
            (ser) => !ser?.frequentService
          );
          setAllNonFrequentServices(
            nonFrequentServices?.sort(
              (a, b) => new Date(a?.created) - new Date(b?.created)
            )
          );
          tempSortedServices?.push(...nonFrequentServices);
          setAllServices(tempSortedServices);
          setAllCompanyServices(tempSortedServices);
        } else {
          let tempUnsortedServices = filterservice?.sort(
            (a, b) => new Date(a?.created) - new Date(b?.created)
          );
          setAllServices(filterservice);
          setAllCompanyServices(filterservice);
        }
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const handleServiceSearch = async (e) => {
    setSearchKeyword(e.target.value);
    var serviceData =
      allCompanyServices?.length > 0 &&
      allCompanyServices?.filter(
        (obj) =>
          (obj.serviceName &&
            obj.serviceName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.categoryName &&
            obj.categoryName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.amount &&
            obj.amount.toString().includes(e.target.value.toString())) ||
          (obj.quickSearch &&
            obj.quickSearch
              .toLowerCase()
              .includes(e.target.value.toLowerCase()))
      );
    if (e.target.value === "") {
      ApiGet("service/company/" + userInfo.companyId).then((resp) => {
        let filterservice = resp.data.data.filter((obj) =>
          obj.categoryName === "Unassign" ? null : obj
        );
        if (isFrequentServiceOn) {
          let tempFrequentServices = filterservice?.filter(
            (ser) => ser?.frequentService
          );
          let tempSortedServices = tempFrequentServices?.sort(
            (a, b) => a?.index - b?.index
          );
          setAllFrequentServices(
            tempSortedServices?.filter((ser) => ser?.frequentService)
          );
          let nonFrequentServices = filterservice?.filter(
            (ser) => !ser?.frequentService
          );
          setAllNonFrequentServices(
            nonFrequentServices?.sort(
              (a, b) => new Date(a?.created) - new Date(b?.created)
            )
          );
          tempSortedServices?.push(...nonFrequentServices);
          setAllServices(tempSortedServices);
          setAllCompanyServices(tempSortedServices);
        } else {
          let tempUnsortedServices = filterservice?.sort(
            (a, b) => new Date(a?.created) - new Date(b?.created)
          );
          setAllServices(filterservice);
          setAllCompanyServices(filterservice);
        }
      });
    } else {
      setAllServices(serviceData);
    }
  };

  const handleStaffSearch = async (e) => {
    setSearchKeywrd(e.target.value);
    var staffData =
      allStaff?.length > 0 &&
      allStaff?.filter(
        (obj) =>
          (obj.firstName &&
            obj.firstName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.lastName &&
            obj.lastName.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    if (e.target.value === "") {
      if (!service) {
        ApiGet("staff/company/" + userInfo.companyId).then((resp) => {
          let filterstaff = resp.data.data.filter((obj) =>
            obj.firstName === "Unassign" ? null : obj
          );
       
          setAllStaff(filterstaff);
        });
      } else {
        ApiGet(
          "category/staff/data/day/" + saveService?.categoryId + "/" + dayy
        ).then((resp) => {
          let filterstaff = resp.data.data.filter((obj) =>
            obj.firstName === "Unassign" ? null : obj
          );
      
          setAllStaff(filterstaff);
        });
      }
    } else {
      
      setAllStaff(staffData);
    }
  };

  const SelectHour = (e, hour) => {
    setSelectHour(hour + 1);
    setSelectTime(false);
  };

  const OpenSelectService = async (e, min) => {
    setTimes(selectHour + ":" + min);

    if (service) {
      setSelectService(!selectService);
      if (staff) {
        setSelectStaff(true);
      } else {
        setSelectStaff(true);
      }
    } else {
      setSelectService(!selectService);
      if (staff) {
        setSelectStaff(false);
      } else {
        setSelectStaff(false);
        setCheckout(false);
        let time = selectHour + ":" + min;
        multipleappointment.push(
          Object.assign(appointmentdata, {
            date: moment(staffEndISODates).add(time)._d,
            default: true,
            staff: "Unassign",
          })
        );
        setMultipleAppointment([...multipleappointment]);
      }
      let isDayAvail = moment(date).format("dddd");
      let datePayload = {
        startTime: moment(date).format("YYYY-MM-DD"),
        endTime: moment(date).add(1, "days").format("YYYY-MM-DD"),
      };
      let attendanceRes = await ApiPost(
        "attendence/company/" + userInfo.companyId,
        datePayload
      );
      let tempData = attendanceRes.data.data?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      let tempAttendanceData = removeDuplicateObjectFromArray(
        tempData,
        "staffId"
      );
      let thisDayAttendanceData = tempAttendanceData || [];
      try {
        let res = await ApiGet(
          "staff/available/company/" + userInfo.companyId + "/" + isDayAvail
        );
        if (res.data.status === 200) {
          let filterstaff = res.data.data.filter((obj) =>
            obj.firstName === "Unassign" ? null : obj
          );
          let availableStaff;
          if (
            moment(date).format("DD-MM-YYYY") ==
              moment(new Date()).format("DD-MM-YYYY") &&
            SettingInfo?.attendence?.attendanceToggle &&
            SettingInfo?.attendence?.attendanceForInvoiceToggle
          ) {
            availableStaff = filterstaff?.filter(
              (item) =>
                thisDayAttendanceData?.find(
                  (data) => data?.staffId === item?._id
                )?.currentStatus === "clockIn"
            );
          } else {
            availableStaff = res.data.data;
          }
         
          setAllStaff(availableStaff);
        } else {
          console.log("in the else");
        }
      } catch (err) {
        console.log("error while getting services", err);
      }
    }
    // if (staff) {
    //   setSelectStaff(false);

    // } else {

    //   setSelectStaff(false);
    //   setCheckout(false);
    //   const time = selectHour + ":" + min;
    //   multipleappointment.push(
    //     Object.assign(appointmentdata, {
    //       date: moment(staffEndISODates).add(time)._d,
    //       default:true,
    //     })
    //   );
    //   setMultipleAppointment([...multipleappointment]);
    // }

    setTimeDetail(min);
  };

  const OpenSelectStaff = async (e, service) => {
    setSaveService(service);
    let isDayAvail = moment(date).format("dddd");

    let dayInNumber = moment(date).day();
    let day;
    let Endtime;
    if (dayInNumber === 1) {
      day = "Monday";
    } else if (dayInNumber === 2) {
      day = "Tuesday";
    } else if (dayInNumber === 3) {
      day = "Wednesday";
    } else if (dayInNumber === 4) {
      day = "Thursday";
    } else if (dayInNumber === 5) {
      day = "Friday";
    } else if (dayInNumber === 6) {
      day = "Saturday";
    } else if (dayInNumber === 0) {
      day = "Sunday";
    }

    storeTiming?.map((obj) => {
      return obj.day === day ? (Endtime = obj.endtime) : null;
    });

    setDayy(day);
    let date1 = moment(staffEndISODates).add(times)._d;
    let storeEndISODate = moment(staffEndISODates).add(Endtime)._d;
    let storeEndDate = moment(storeEndISODate).add(15, "minutes");
    let date2 = moment(date1);
    let apppointmentEndTime = moment(date2).add(service.duration, "minutes");
    if (storeEndDate._i < apppointmentEndTime._d) {
      setSuccess(true);
      setEr("error");
      setToastmsg("Store closed!");
    } else {
      if (service) {
        // let datePayload = editInvoice ? {
        //   startTime: moment(editInvoice?.created).format("YYYY-MM-DD"),
        //   endTime: moment(editInvoice?.created).add(1, "days").format("YYYY-MM-DD"),
        // } : {
        let datePayload = {
          startTime: moment(date).format("YYYY-MM-DD"),
          endTime: moment(date).add(1, "days").format("YYYY-MM-DD"),
        };
        let attendanceRes = await ApiPost(
          "attendence/company/" + userInfo.companyId,
          datePayload
        );
        let tempData = attendanceRes.data.data?.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        let tempAttendanceData = removeDuplicateObjectFromArray(
          tempData,
          "staffId"
        );
        let thisDayAttendanceData = tempAttendanceData || [];
        try {
          let res = await ApiGet(
            "category/staff/data/day/" + service.categoryId + "/" + day
          );
          if (res.data.status === 200) {
            let filterstaff = res.data.data.filter((obj) =>
              obj.firstName === "Unassign" ? null : obj
            );
            let availableStaff;
            if (
              moment(date).format("DD-MM-YYYY") ==
                moment(new Date()).format("DD-MM-YYYY") &&
              SettingInfo?.attendence?.attendanceToggle &&
              SettingInfo?.attendence?.attendanceForInvoiceToggle
            ) {
              availableStaff = filterstaff?.filter(
                (item) =>
                  thisDayAttendanceData?.find(
                    (data) => data?.staffId === item?._id
                  )?.currentStatus === "clockIn"
              );
            } else {
              availableStaff = filterstaff;
            }

           
            setAllStaff(availableStaff);
          } else {
          }
        } catch (err) {
          console.log("in the catch");
        }
      }

      setServiceId(service);
      setTime(service.duration);

      if (staff) {
        setSelectStaff(false);
      } else {
        setSelectStaff(false);
        setCheckout(false);
        multipleappointment.push(
          Object.assign(appointmentdata, {
            serviceId: service,
            time: service?.duration,
            staff: "Unassign",
          })
        );
        setMultipleAppointment([...multipleappointment]);
      }
    }
  };
  const OpenCheckOutPage = async (e, item) => {
    let add = true;
    let dayInNumber = moment(date).day();
    let Endtime;
    let day;

    if (dayInNumber === 1) {
      day = "Monday";
    } else if (dayInNumber === 2) {
      day = "Tuesday";
    } else if (dayInNumber === 3) {
      day = "Wednesday";
    } else if (dayInNumber === 4) {
      day = "Thursday";
    } else if (dayInNumber === 5) {
      day = "Friday";
    } else if (dayInNumber === 6) {
      day = "Saturday";
    } else if (dayInNumber === 0) {
      day = "Sunday";
    }

    storeTiming?.map((obj) => {
      return obj.day === day ? (Endtime = obj.endtime) : null;
    });
    let date1 = moment(staffEndISODates).add(times)._d;
    let storeEndISODate = moment(staffEndISODates).add(Endtime)._d;
    let storeEndDate = moment(storeEndISODate).add(15, "minutes");
    let date2 = moment(date1);
    let apppointmentEndTime = moment(date2).add(
      appointmentdata.time,
      "minutes"
    );
    let staffDetails = staffs && staffs.filter((obj) => obj._id === item._id);
    let staffDayDetails =
      staffDetails[0] &&
      staffDetails[0].workingDays &&
      staffDetails[0].workingDays.filter((obj) => obj.Day === day);
    let staffEndISODate = moment(staffEndISODates).add(
      staffDayDetails[0].endtime
    )._d;

    let staffEndDate = moment(staffEndISODate).add(15, "minutes");

    if (storeEndDate < apppointmentEndTime) {
      add = false;
      setSuccess(true);
      setEr("error");
      setToastmsg("Store closed!");
    }
    if (apppointmentEndTime > staffEndDate) {
      add = false;
      setSuccess(true);
      setEr("error");
      setToastmsg("Staff is not available");
    }
    let res = await ApiGet(
      "appointment/staff/" + userInfo.companyId + "/" + item._id
    );
    if (res.data.status === 200) {
      let today = new Date();
      let futAppointments = res.data.data.appointmentList.filter(
        (apt) => new Date(apt.date) >= today
      );

      futAppointments &&
        futAppointments.map((apt) => {
          let endDate = moment(apt.date).add(apt.serviceId.duration, "minutes");
          endDate = moment(endDate).toISOString();
          let newDate = startTime
            ? startTime
            : moment(staffEndISODates).add(times)._d;
          newDate = moment(newDate).toISOString();
          if (newDate >= apt.date && newDate < endDate) {
            add = false;
            setSuccess(true);
            setEr("error");
            setToastmsg("Slot booked!");
          }
        });
      if (add) {
        setCheckout(false);

        setStaffId(item);
        multipleappointment.push(
          Object.assign(appointmentdata, {
            staffId: item,
            staff: item.firstName + " " + item.lastName,
          })
        );
        setMinutes(time);
        setMultipleAppointment([...multipleappointment]);
      }
    }
  };

  const AddMoreservice = () => {
    ApiGet("service/company/" + userInfo.companyId).then((resp) => {
      let filterservice = resp.data.data.filter((obj) =>
        obj.categoryName === "Unassign" ? null : obj
      );
      if (isFrequentServiceOn) {
        let tempFrequentServices = filterservice?.filter(
          (ser) => ser?.frequentService
        );
        let tempSortedServices = tempFrequentServices?.sort(
          (a, b) => a?.index - b?.index
        );
        setAllFrequentServices(
          tempSortedServices?.filter((ser) => ser?.frequentService)
        );
        let nonFrequentServices = filterservice?.filter(
          (ser) => !ser?.frequentService
        );
        setAllNonFrequentServices(
          nonFrequentServices?.sort(
            (a, b) => new Date(a?.created) - new Date(b?.created)
          )
        );
        tempSortedServices?.push(...nonFrequentServices);
        setAllServices(tempSortedServices);
        setAllCompanyServices(tempSortedServices);
      } else {
        let tempUnsortedServices = filterservice?.sort(
          (a, b) => new Date(a?.created) - new Date(b?.created)
        );
        setAllServices(filterservice);
        setAllCompanyServices(filterservice);
      }
    });
    if (multipleappointment.length === 0) {
      setStartTime(moment(staffEndISODates).add(times)._d);
    } else {
      setStartTime(
        moment(multipleappointment[multipleappointment.length - 1].date).add(
          multipleappointment[multipleappointment.length - 1].time,
          "minutes"
        )._d
      );
    }
    setServiceId();
    setSelectStaff(true);
    setSelectDate(false);
    setSelectAppointmemntType(false);
    setCheckout(true);
    if (service) {
      setSelectService(false);
      setSelectStaff(true);
    } else {
      setSelectService(false);
      setSelectStaff(false);
    }
  };

  const OpenEditService = (data) => {
    setEditServiceData(data);
    setEditServiceModal(!editServiceModal);
    if (editServiceModal === true) {
      if (data) {
        multipleappointment[
          multipleappointment
            .map((x, i) => [i, x])
            .filter((x) => x[1].date == data.date)[0][0]
        ] = data;
      }
    }
  };

  const AddAppointment = () => {
    setAddTrue(true)
    if (editAppointment || rescheduleAppointments) {
      multipleappointment.map((apt) => {
        ApiPut("appointment/" + apt._id, apt)
          .then((resp) => {
            toggle(resp);
          })
          .catch((err) => {
            console.log("error while book Appointment", err);
          });
      });
    } else {
      // multipleappointment.map((apt) => {
      ApiPost("appointment/", multipleappointment)
        .then((resp) => {
          toggle(resp);
        })
        .catch((err) => {
          toggle(err);
          console.log("error while book Appointment", err);
        });
      // });
    }
    setAddTrue(false)
  };

  const ChangeAppointmentDate = (data, i) => {
    setSelectedDate(data);
    // setDate(data)
    let ISODate = moment(data).add(330, "minutes")._d;
    let ISODates = "";
    multipleappointment.map(async (app, i) => {
      let appointment = {
        companyId: app.companyId,
        date: i > 0 ? ISODates : ISODate,
        default: app.default,
        isPromotional: app.isPromotional,
        mobile: app.mobile,
        name: app.name,
        serviceId: app.serviceId,
        staff: app.staff,
        staffId: app.Subject ? app.staffDetails : app.staffId,
        status: app.status,
        time: app.time,
        type: app.type,
        uuid: app.uuid,
        notes: app.notes,
        _id: app._id,
      };

      multipleappointment[
        multipleappointment
          .map((x, i) => [i, x])
          .filter((x) => x[1].date == app.date)[0][0]
      ] = appointment;
      ISODates = moment(i > 0 ? ISODates : ISODate).add("minute", app.time)._d;
      setAddTrue(true);
      let staffEndISODates = new Date(`${data} UTC`);
      if (app.Subject) {
        let todays = new Date();
        let ISODatess = new Date(`${data}`);
        if (ISODatess < todays) {
          add = false;
          setSuccess(true);
          setAddTrue(false);
          setEr("error");
          setToastmsg("Action not allowed");
        }

        let add = true;
        let dayInNumber = moment(date).day();
        let Endtime;
        let day;

        if (dayInNumber === 1) {
          day = "Monday";
        } else if (dayInNumber === 2) {
          day = "Tuesday";
        } else if (dayInNumber === 3) {
          day = "Wednesday";
        } else if (dayInNumber === 4) {
          day = "Thursday";
        } else if (dayInNumber === 5) {
          day = "Friday";
        } else if (dayInNumber === 6) {
          day = "Saturday";
        } else if (dayInNumber === 0) {
          day = "Sunday";
        }
        storeTiming?.map((obj) => {
          return obj.day === day ? (Endtime = obj.endtime) : null;
        });

        let date1 = i > 0 ? ISODates : ISODate;
        let storeEndISODate = moment(staffEndISODates).add(Endtime)._d;
        let storeEndDate = moment(storeEndISODate).add(15, "minutes");
        let date2 = moment(date1);
        let apppointmentEndTime = moment(date2).add(app.time, "minutes");
        let staffDetails =
          staffs && staffs.filter((obj) => obj?._id === app?.staffDetails?._id);
        let staffDayDetails =
          staffDetails &&
          staffDetails[0] &&
          staffDetails[0].workingDays &&
          staffDetails[0].workingDays.filter((obj) => obj.Day === day);

        let staffEndISODate = moment(i > 0 ? ISODates : ISODate).add(
          staffDayDetails[0]?.endtime
        )._d;

        let staffEndDate = moment(staffEndISODate).add(15, "minutes");
        if (storeEndDate._i < apppointmentEndTime._d) {
          add = false;
          setAddTrue(false);
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
        if (apppointmentEndTime > staffEndDate) {
          add = false;
          setAddTrue(false);
          setSuccess(true);
          setEr("error");
          setToastmsg("Staff is not available");
        }

        let res = await ApiGet(
          "appointment/staff/" + userInfo.companyId + "/" + app?.staffId?._id
        );
        if (res.data.status === 200) {
          let today = new Date();
          let futAppointments = res.data.data.appointmentList.filter(
            (apt) => new Date(apt.date) >= today
          );

          futAppointments &&
            futAppointments.map((apt) => {
              let endDate = moment(apt.date).add(
                apt.serviceId.duration,
                "minutes"
              );
              endDate = moment(endDate).toISOString();
              let newDate = moment(i > 0 ? ISODates : ISODate).subtract(
                330,
                "minutes"
              )._d;

              newDate = moment(newDate).add(330, "minutes").toISOString();
              if (newDate >= apt.date && newDate < endDate) {
                if (apt?.staffId === app?.staffId?._id) {
                  if (apt.name === app.name) {
                  } else {
                    setAddTrue(false);
                    add = false;
                    setSuccess(true);
                    setEr("error");
                    setToastmsg("Booked For" + " " + app.staff);
                  }
                } else {
                  setAddTrue(false);
                  add = false;
                  setSuccess(true);
                  setEr("error");
                  setToastmsg("Booked For" + " " + app.staff);
                }
              }
            });
        }
      } else {
        let add = true;
        let todays = new Date();
        let ISODatess = new Date(`${data}`);

        if (ISODatess < todays) {
          add = false;
          setSuccess(true);
          setAddTrue(false);
          setEr("error");
          setToastmsg("Action not allowed");
        }
        let dayInNumber = moment(date).day();
        let Endtime;
        let day;

        if (dayInNumber === 1) {
          day = "Monday";
        } else if (dayInNumber === 2) {
          day = "Tuesday";
        } else if (dayInNumber === 3) {
          day = "Wednesday";
        } else if (dayInNumber === 4) {
          day = "Thursday";
        } else if (dayInNumber === 5) {
          day = "Friday";
        } else if (dayInNumber === 6) {
          day = "Saturday";
        } else if (dayInNumber === 0) {
          day = "Sunday";
        }
        storeTiming?.map((obj) => {
          return obj.day === day ? (Endtime = obj.endtime) : null;
        });
        let date1 = i > 0 ? ISODates : ISODate;
        let storeEndISODate = moment(staffEndISODates).add(Endtime)._d;
        let storeEndDate = moment(storeEndISODate).add(15, "minutes");
        let date2 = moment(date1);
        let apppointmentEndTime = moment(date2).add(app.time, "minutes");
        let staffDetails =
          staffs && staffs.filter((obj) => obj?._id === app?.staffId?._id);
        let staffDayDetails =
          staffDetails &&
          staffDetails[0] &&
          staffDetails[0].workingDays &&
          staffDetails[0].workingDays.filter((obj) => obj.Day === day);
        let staffEndISODate = moment(i > 0 ? ISODates : ISODate).add(
          staffDayDetails[0]?.endtime
        )._d;

        let staffEndDate = moment(staffEndISODate).add(15, "minutes");

        if (storeEndDate._i < apppointmentEndTime._d) {
          add = false;
          setAddTrue(false);
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
        if (apppointmentEndTime > staffEndDate) {
          add = false;
          setAddTrue(false);
          setSuccess(true);
          setEr("error");
          setToastmsg("Staff is not available");
        }
        let res = await ApiGet(
          "appointment/staff/" + userInfo.companyId + "/" + app?.staffId?._id
        );
        if (res.data.status === 200) {
          let today = new Date();
          let futAppointments = res.data.data.appointmentList.filter(
            (apt) => new Date(apt.date) >= today
          );

          futAppointments &&
            futAppointments.map((apt) => {
              let endDate = moment(apt.date).add(
                apt.serviceId.duration,
                "minutes"
              );
              endDate = moment(endDate).toISOString();
              let newDate = moment(i > 0 ? ISODates : ISODate).subtract(
                330,
                "minutes"
              )._d;

              newDate = moment(newDate).add(330, "minutes").toISOString();
              if (newDate >= apt.date && newDate < endDate) {
                if (apt?.staffId === app?.staffId?._id) {
                  if (apt.name === app.name) {
                  } else {
                    setAddTrue(false);
                    add = false;
                    setSuccess(true);
                    setEr("error");
                    setToastmsg("Booked For" + " " + app.staff);
                  }
                } else {
                  setAddTrue(false);
                  add = false;
                  setSuccess(true);
                  setEr("error");
                  setToastmsg("Booked For" + " " + app.staff);
                }
              }
            });
        }
      }
    });
  };

  const ChangeAppointmentTime = (data, i) => {
    setTimes(moment(data).format("hh:mm"));
    setSelectedDate(data);
    let ISODate = moment(data).add(330, "minutes")._d;
    let ISODates = "";
    multipleappointment.map(async (app, i) => {
      let appointment = {
        companyId: app.companyId,
        date: i > 0 ? ISODates : ISODate,
        default: app.default,
        isPromotional: app.isPromotional,
        mobile: app.mobile,
        name: app.name,
        serviceId: app.serviceId,
        staff: app.staff,
        staffId: app.staffId,
        status: app.status,
        time: app.time,
        type: app.type,
        uuid: app.uuid,
        notes: app.notes,
        _id: app._id,
      };

      multipleappointment[
        multipleappointment
          .map((x, i) => [i, x])
          .filter((x) => x[1].date == app.date)[0][0]
      ] = appointment;
      setAddTrue(true);
      ISODates = moment(i > 0 ? ISODates : ISODate).add("minute", app.time)._d;
      if (app.staffId) {
        let add = true;
        let dayInNumber = moment(date).day();
        let Endtime;
        let startTime;
        let day;

        if (dayInNumber === 1) {
          day = "Monday";
        } else if (dayInNumber === 2) {
          day = "Tuesday";
        } else if (dayInNumber === 3) {
          day = "Wednesday";
        } else if (dayInNumber === 4) {
          day = "Thursday";
        } else if (dayInNumber === 5) {
          day = "Friday";
        } else if (dayInNumber === 6) {
          day = "Saturday";
        } else if (dayInNumber === 0) {
          day = "Sunday";
        }
        storeTiming?.map((obj) => {
          return obj.day === day ? (Endtime = obj.endtime) : null;
        });
        storeTiming?.map((obj) => {
          return obj.day === day ? (startTime = obj.starttime) : null;
        });
        if (rescheduleAppointments) {
          staffEndISODates = moment(selectedDate).format("LL");
          let date1 = i > 0 ? ISODates : ISODate;
          let storeEndISODate = moment(staffEndISODates)
            .add(330, "minutes")
            .add(Endtime)._d;
          let storeEndDate = moment(storeEndISODate).add(15, "minutes");
          let date2 = moment(date1);
          let apppointmentStartTime = moment(date2);
          let date3 = moment(date1).subtract(330, "minutes");
          let apppointmentEndTime = moment(date2).add(app.time, "minutes");
          let staffDetails =
            staffs && staffs.filter((obj) => obj._id === app.staffId._id);
          let staffDayDetails =
            staffDetails[0] &&
            staffDetails[0].workingDays &&
            staffDetails[0].workingDays.filter((obj) => obj.Day === day);

          let staffEndISODate = moment(staffEndISODates)
            .add(330, "minutes")
            .add(staffDayDetails[0].endtime)._d;
          let staffStartISODate = moment(staffEndISODates).add(
            staffDayDetails[0].starttime
          )._d;
          let staffEndDate = moment(staffEndISODate).add(15, "minutes");
          let staffStartDate = moment(staffStartISODate).add(330, "minutes");

          if (new Date() > date3._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Action not allowed");
          }

          if (storeEndDate._i < apppointmentEndTime._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Store closed!");
          }
          if (apppointmentEndTime._d > staffEndDate._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Staff is not available");
          }
          if (apppointmentStartTime < staffStartDate) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Staff is not available");
          }
        } else {
          let date1 = i > 0 ? ISODates : ISODate;
          let storeEndISODate = moment(staffEndISODates).add(Endtime)._d;
          let storeEndDate = moment(storeEndISODate).add(15, "minutes");
          let date2 = moment(date1);
          let apppointmentStartTime = moment(date2);
          let date3 = moment(date1).subtract(330, "minutes");
          let apppointmentEndTime = moment(date2).add(app.time, "minutes");
          let staffDetails =
            staffs && staffs.filter((obj) => obj._id === app.staffId._id);
          let staffDayDetails =
            staffDetails[0] &&
            staffDetails[0].workingDays &&
            staffDetails[0].workingDays.filter((obj) => obj.Day === day);

          let staffEndISODate = moment(staffEndISODates).add(
            staffDayDetails[0].endtime
          )._d;
          let staffStartISODate = moment(staffEndISODates).add(
            staffDayDetails[0].starttime
          )._d;
          let staffEndDate = moment(staffEndISODate).add(15, "minutes");
          let staffStartDate = moment(staffStartISODate);

          if (new Date() > date3._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Action not allowed");
          }
          if (storeEndDate._i < apppointmentEndTime._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Store closed!");
          }
          if (apppointmentEndTime > staffEndDate) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Staff is not available");
          }
          if (apppointmentStartTime < staffStartDate) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Staff will not arrived yet");
          }
        }
        if (app.staff === "Unassign") {
        } else {
          let res = await ApiGet(
            "appointment/staff/" + userInfo.companyId + "/" + app.staffId._id
          );
          if (res.data.status === 200) {
            let today = new Date();
            let futAppointments = res.data.data.appointmentList.filter(
              (apt) => new Date(apt.date) >= today
            );

            futAppointments &&
              futAppointments.map((apt) => {
                let endDate = moment(apt.date).add(
                  apt.serviceId.duration,
                  "minutes"
                );
                endDate = moment(endDate).toISOString();
                let newDate = moment(i > 0 ? ISODates : ISODate).subtract(
                  330,
                  "minutes"
                )._d;

                newDate = moment(newDate).add(330, "minutes").toISOString();
                if (newDate >= apt.date && newDate < endDate) {
                  if (apt.staffId === app.staffId._id) {
                    if (app.name === "") {
                      if (apt.name === app.name) {
                      } else {
                        setAddTrue(false);
                        add = false;
                        setSuccess(true);
                        setEr("error");
                        setToastmsg("Booked For" + " " + app.staff);
                      }
                    } else {
                      if (apt.name === app.name) {
                      } else {
                        setAddTrue(false);
                        add = false;
                        setSuccess(true);
                        setEr("error");
                        setToastmsg("Booked For" + " " + app.staff);
                      }
                    }
                  } else {
                    setAddTrue(false);
                    add = false;
                    setSuccess(true);
                    setEr("error");
                    setToastmsg("Booked For" + " " + app.staff);
                  }
                }
              });
          }
        }
      } else {
        let add = true;
        let dayInNumber = moment(date).day();
        let Endtime;
        let startTime;
        let day;

        if (dayInNumber === 1) {
          day = "Monday";
        } else if (dayInNumber === 2) {
          day = "Tuesday";
        } else if (dayInNumber === 3) {
          day = "Wednesday";
        } else if (dayInNumber === 4) {
          day = "Thursday";
        } else if (dayInNumber === 5) {
          day = "Friday";
        } else if (dayInNumber === 6) {
          day = "Saturday";
        } else if (dayInNumber === 0) {
          day = "Sunday";
        }
        storeTiming?.map((obj) => {
          return obj.day === day ? (Endtime = obj.endtime) : null;
        });
        storeTiming?.map((obj) => {
          return obj.day === day ? (startTime = obj.starttime) : null;
        });
        let date1 = i > 0 ? ISODates : ISODate;
        let storeStartISODate = moment(staffEndISODates).add(startTime)._d;
        let storeEndISODate = moment(staffEndISODates).add(Endtime)._d;
        let storeEndDate = moment(storeEndISODate).add(15, "minutes");
        let date2 = moment(date1);
        let apppointmentStartTime = moment(date2);
        let date3 = moment(date1).subtract(330, "minutes");
        let apppointmentEndTime = moment(date2).add(app.time, "minutes");

        if (new Date() > date3._d) {
          add = false;
          setAddTrue(false);
          setSuccess(true);
          setEr("error");
          setToastmsg("Action not allowed");
        }
        if (storeEndDate._i < apppointmentEndTime._d) {
          add = false;
          setAddTrue(false);
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
        if (storeStartISODate > apppointmentStartTime._d) {
          add = false;
          setAddTrue(false);
          setSuccess(true);
          setEr("error");
          setToastmsg("Store closed!");
        }
      }
    });
  };

  const RemoveService = (data) => {
    OpenEditService();
    const removeIndex = multipleappointment.findIndex(
      (item) => item.date === data.date
    );
    multipleappointment.splice(removeIndex, 1);
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
      <div>
        <div className="cus-modal">
          <div className="modal-header">
            <div className="container-long">
              {/* modal header */}
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div onClick={() => props.toggle()} className="modal-close">
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div className="modal-title">
                    {editAppointment ? (
                      <h2>Edit Appointment</h2>
                    ) : (
                      <h2>
                        {" "}
                        {rescheduleAppointments
                          ? "Reschedule  Appointment"
                          : "Add New Appointment"}
                      </h2>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="container">
              {selectappointmemntType ? (
                <div className="modal-body-top-align">
                  <div className="generate-box-center">
                    <div className="new-appointment-box">
                      <div>
                        <div className="title-text-style">
                          <p>Select appointment type</p>
                        </div>
                        <div
                          className="appointment-image-box"
                          onClick={() => SelectAppointmenttype("Walk-in")}
                        >
                          <div>
                            <img
                              src={AppointmentImage}
                              alt="AppointmentImage"
                            />
                            <div className="appointment-text-style">
                              <p>Walk-in</p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="appointment-image-box"
                          onClick={() => SelectAppointmenttype("Pre-booking")}
                        >
                          <div>
                            <img src={BookingImage} alt="BookingImage" />
                            <div className="appointment-text-style">
                              <p>Pre-booking</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectDate ? (
                <div className="modal-body-top-align">
                  <div className="generate-box-center">
                    <div className="new-appointment-box-child">
                      <div className="date-picker-modal-height">
                        <div className="title-text-style-alignment">
                          <div
                            className="back-arrow-alignment"
                            onClick={BackToSelectAppointmemntType}
                          >
                            <img
                              src={BackArrowService}
                              alt="BackArrowService"
                            />
                          </div>
                          <p>Select a Date</p>
                        </div>
                        <div className="appointment-date">
                          <div className="form-group relative">
                            <label>Select a Date</label>

                            <DatePicker
                              selected={date}
                              onChange={SelectFullDate}
                              dateFormat="dd-MM-yyyy"
                              placeholderText="Date"
                              fixedHeight
                            />
                          </div>
                        </div>
                      </div>
                      <div className="date-next-step-button-align">
                        <button onClick={() => OpenHourSelect()}>Next</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectService ? (
                <div className="modal-body-top-align">
                  <div className="generate-box-center">
                    <div className="select-time-box">
                      <div>
                        <div className="title-text-style">
                          {props.selectDate ? (
                            ""
                          ) : (
                            <div
                              className="left-arrow-alignment"
                              onClick={BackTOselectDate}
                            >
                              <img
                                src={BackArrowService}
                                alt="BackArrowService"
                              />
                            </div>
                          )}

                          <p>Select a Time</p>
                        </div>
                        <div className="sub-text-style">
                          <p>Hours</p>
                        </div>

                        {selectTime ? (
                          <div>
                            <div className="timer-counter-alignment">
                              <div className="timer-input">
                                <div className="timer-cus-design">
                                  <span> {selectHour}</span>
                                </div>
                              </div>
                              <div className="timer-divider">
                                <span>:</span>
                              </div>
                              <div className="timer-input">
                                <div className="timer-cus-design">
                                  <span> - </span>
                                </div>
                              </div>
                            </div>
                            <div className="timer-alignment-box">
                              <div>
                                {[
                                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                  14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                                ].map((i) => {
                                  return i + 1 >= starthour ? (
                                    i + 1 > endhour ? null : date <
                                      new Date() ? (
                                      i + 2 >
                                      moment(new Date()).format("HH") ? (
                                        <div
                                          key={i._id}
                                          className="timer-box-design"
                                          onClick={(e) => SelectHour(e, i)}
                                        >
                                          <span>
                                            {" "}
                                            {i + 1 > 12 ? i - 11 : i + 1}{" "}
                                            {i + 1 > 11 ? "PM" : "AM"}
                                          </span>
                                        </div>
                                      ) : null
                                    ) : (
                                      <div
                                        key={i._id}
                                        className="timer-box-design"
                                        onClick={(e) => SelectHour(e, i)}
                                      >
                                        <span>
                                          {" "}
                                          {i + 1 > 12 ? i - 11 : i + 1}{" "}
                                          {i + 1 > 11 ? "PM" : "AM"}
                                        </span>
                                      </div>
                                    )
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="timer-counter-alignment">
                              <div className="timer-input">
                                <div className="timer-cus-design">
                                  <span>
                                    {selectHour > 12
                                      ? selectHour - 12
                                      : selectHour}
                                  </span>
                                </div>
                              </div>
                              <div className="timer-divider">
                                <span>:</span>
                              </div>
                              <div className="timer-input">
                                <div className="timer-cus-design">
                                  <span>{timeDetail}</span>
                                </div>
                              </div>
                            </div>
                            <div className="timer-alignment-box">
                              <div>
                                {[0, 15, 30, 45].map((item, i) => {
                                  return date < new Date() ? (
                                    selectHour ==
                                    moment(new Date()).format("HH") ? (
                                      item > moment(new Date()).format("mm") ? (
                                        <div
                                          key={item._id}
                                          className="timer-box-design"
                                          onClick={(e) =>
                                            OpenSelectService(e, item)
                                          }
                                        >
                                          <span>
                                            {selectHour > 12
                                              ? selectHour - 12
                                              : selectHour}{" "}
                                            : {i === 0 ? "00" : item}{" "}
                                            {selectHour > 11 ? "PM" : "AM"}
                                          </span>
                                        </div>
                                      ) : null
                                    ) : (
                                      <div
                                        key={item._id}
                                        className="timer-box-design"
                                        onClick={(e) =>
                                          OpenSelectService(e, item)
                                        }
                                      >
                                        <span>
                                          {selectHour > 12
                                            ? selectHour - 12
                                            : selectHour}{" "}
                                          : {i === 0 ? "00" : item}{" "}
                                          {selectHour > 11 ? "PM" : "AM"}
                                        </span>
                                      </div>
                                    )
                                  ) : (
                                    <div
                                      className="timer-box-design"
                                      onClick={(e) =>
                                        OpenSelectService(e, item)
                                      }
                                    >
                                      <span>
                                        {selectHour > 12
                                          ? selectHour - 12
                                          : selectHour}{" "}
                                        : {i === 0 ? "00" : item}{" "}
                                        {selectHour > 11 ? "PM" : "AM"}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectStaff ? (
                <div className="modal-body-top-align">
                  <div className="generate-box-center">
                    <div className="appointment-service-box">
                      <div>
                        <div className="service-title">
                          {startTime ? (
                            <div
                              className="left-arrow-alignment"
                              onClick={BackToCheckout}
                            >
                              <img
                                src={BackArrowService}
                                alt="BackArrowService"
                              />
                            </div>
                          ) : (
                            <div
                              className="left-arrow-alignment"
                              onClick={BackToSelectTime}
                            >
                              <img
                                src={BackArrowService}
                                alt="BackArrowService"
                              />
                            </div>
                          )}
                          <p>Select a Service</p>
                        </div>
                        <div className="appointment-service-search">
                          <div className="relative">
                            <input
                              type="search"
                              placeholder="Search services"
                              onChange={handleServiceSearch}
                              autoFocus
                            />
                            <div className="search-icon-alignment">
                              <svg
                                width="19"
                                height="19"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.625 15.625C12.491 15.625 15.625 12.491 15.625 8.625C15.625 4.75901 12.491 1.625 8.625 1.625C4.75901 1.625 1.625 4.75901 1.625 8.625C1.625 12.491 4.75901 15.625 8.625 15.625Z"
                                  stroke="#193566"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M17.375 17.375L13.5687 13.5687"
                                  stroke="#193566"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="frquent-service-text">
                          {/* <p>Frequent services</p> */}
                        </div>
                       
                        <div className="appointment-service-box-height">
                          <ul className="relative">
                            {searchKeyword && (
                              <p className="frequnt-service-text-alignment">
                                Search results
                              </p>
                            )}
                            {allServices?.length > 0 ? (
                              <>
                                {!searchKeyword && isFrequentServiceOn ? (
                                  <>
                                    <div>
                                      {!searchKeyword && (
                                        <p className="frequnt-service-text-alignment">
                                          Frequent services
                                        </p>
                                      )}
                                      {allFrequentServices?.map((service) => {
                                        return (
                                          <div
                                            key={service._id}
                                            className="appointment-service-list"
                                            onClick={(e) =>
                                              OpenSelectStaff(e, service)
                                            }
                                          >
                                            <div className="list-grid">
                                              <div className="list-grid-items">
                                                <h5>{service?.serviceName}</h5>
                                                <p>
                                                  {service?.categoryName
                                                    ?.length > 30
                                                    ? service?.categoryName.substring(
                                                        0,
                                                        20
                                                      ) + "..."
                                                    : service?.categoryName}{" "}
                                                  • {service?.duration} mins
                                                </p>
                                              </div>
                                              <div className="list-grid-items">
                                                <h6>
                                                  <span>
                                                    {SettingInfo?.currentType}
                                                  </span>{" "}
                                                  {service?.amount}
                                                </h6>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <div>
                                      {!searchKeyword && (
                                        <p className="frequnt-service-text-alignment">
                                          Services
                                        </p>
                                      )}
                                      {allNonFrequentServices?.map(
                                        (service) => {
                                          return (
                                            <div
                                              key={service._id}
                                              className="appointment-service-list"
                                              onClick={(e) =>
                                                OpenSelectStaff(e, service)
                                              }
                                            >
                                              <div className="list-grid">
                                                <div className="list-grid-items">
                                                  <h5>
                                                    {service?.serviceName}
                                                  </h5>
                                                  <p>
                                                    {service?.categoryName
                                                      ?.length > 30
                                                      ? service?.categoryName.substring(
                                                          0,
                                                          20
                                                        ) + "..."
                                                      : service?.categoryName}{" "}
                                                    • {service?.duration} mins
                                                  </p>
                                                </div>
                                                <div className="list-grid-items">
                                                  <h6>
                                                    <span>
                                                      {SettingInfo?.currentType}
                                                    </span>{" "}
                                                    {service?.amount}
                                                  </h6>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  allServices?.map((service) => {
                                    return (
                                      <div
                                        key={service._id}
                                        className="appointment-service-list"
                                        onClick={(e) =>
                                          OpenSelectStaff(e, service)
                                        }
                                      >
                                        <div className="list-grid">
                                          <div className="list-grid-items">
                                            <h5>{service?.serviceName}</h5>
                                            <p>
                                              {service?.categoryName?.length >
                                              30
                                                ? service?.categoryName.substring(
                                                    0,
                                                    20
                                                  ) + "..."
                                                : service?.categoryName}{" "}
                                              • {service?.duration} mins
                                            </p>
                                          </div>
                                          <div className="list-grid-items">
                                            <h6>
                                              <span>
                                                {SettingInfo?.currentType}
                                              </span>{" "}
                                              {service?.amount}
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </>
                            ) : (
                              <div className="text-center mt-2 font-medium heading-title-text-color system-does-not">
                                <p>System does not have this service data</p>
                              </div>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : checkout ? (
                <div key={service._id} className="modal-body-top-align">
                  <div className="generate-box-center">
                    <div className="appointment-service-box">
                      <div>
                        <div className="service-title">
                          <div
                            className="left-arrow-alignment"
                            onClick={BackToSelectService}
                          >
                            <img
                              src={BackArrowService}
                              alt="BackArrowService"
                            />
                          </div>
                          <p>Select a Staff</p>
                        </div>
                        {/* <div className="appointment-service-search">
                          <div className="relative">
                            <input
                              type="search"
                              placeholder="Search staff"
                              onChange={handleStaffSearch}
                            />
                            <div className="search-icon-alignment">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.625 15.625C12.491 15.625 15.625 12.491 15.625 8.625C15.625 4.75901 12.491 1.625 8.625 1.625C4.75901 1.625 1.625 4.75901 1.625 8.625C1.625 12.491 4.75901 15.625 8.625 15.625Z" stroke="#193566" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.375 17.375L13.5687 13.5687" stroke="#193566" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                            </div>
                          </div>
                        </div> */}
                        <div className="appointment-service-box-height">
                          <div style={{ padding: "15px 0 0 0" }}></div>
                          {allStaff &&
                            allStaff.map((item) => {
                              return (
                                <>
                                  <div
                                    key={item._id}
                                    className="appointment-service-list-style"
                                    onClick={(e) => OpenCheckOutPage(e, item)}
                                  >
                                    <p>
                                      {item?.firstName}{" "}
                                      {item?.lastName ? item?.lastName : ""}
                                    </p>
                                  </div>
                                </>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    {/* <div className="new-appointment-box">
               <div>
                 <div className="title-text-style">
                   <p>Select a satff</p>
                 </div>
                 <div  onClick={()=>OpenCheckOutPage()}>
                   <p>Sanjay Mishra</p>
                 </div>
                 
               </div>
             </div> */}
                  </div>
                </div>
              ) : (
                <div className="modal-body add-new-appointment-tablet-view-space-remove">
                  <div className="container">
                    <div className="modal-body-top-align flex justify-center">
                      <div className="edit-invoice-grid">
                        <div
                          className="edit-invoice-grid-items"
                          ref={wrapperRef}
                        >
                          <div className="edit-invoice-grid-height">
                            <div
                              className={
                                customer
                                  ? "add-more-space-remove add-customer-box"
                                  : "add-customer-box relative"
                              }
                              ref={btnDropdownRef}
                            >
                              {customer ? (
                                <div className="add-customer-detail">
                                  <div className="cus-grid">
                                    <div className="cus-grid-items">
                                      {customer?.membership ? (
                                        customer?.selectMembership?.slice(-1)[0]
                                          ?.isExpire === false ? (
                                          customer?.selectMembership?.slice(
                                            -1
                                          )[0]?.cardColur ===
                                          "rgb(248, 226, 124)" ? (
                                            <img
                                              src={YellowMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : customer?.selectMembership?.slice(
                                              -1
                                            )[0]?.cardColur ===
                                            "rgb(248, 163, 121)" ? (
                                            <img
                                              src={OrangeMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : customer?.selectMembership?.slice(
                                              -1
                                            )[0]?.cardColur ===
                                            "rgb(109, 200, 199)" ? (
                                            <img
                                              src={SkyBlueMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : customer?.selectMembership?.slice(
                                              -1
                                            )[0]?.cardColur ===
                                            "rgb(72, 148, 248)" ? (
                                            <img
                                              src={BlueMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : (
                                            <img
                                              src={membershipProfileSmall}
                                              alt="ProfileImage"
                                            />
                                          )
                                        ) : (
                                          <div className="profile-image">
                                            {" "}
                                            {customer?.firstName === "" ||
                                            customer?.firstName === null ||
                                            customer?.firstName === undefined
                                              ? ""
                                              : customer.firstName[0].toUpperCase()}
                                            {customer?.lastName === "" ||
                                            customer?.lastName === null ||
                                            customer?.lastName === undefined
                                              ? ""
                                              : customer?.lastName[0].toUpperCase()}
                                          </div>
                                        )
                                      ) : (
                                        // <img
                                        //   src={membershipProfileSmall}
                                        //   alt="ProfileImage"
                                        // />
                                        <div className="profile-image">
                                          {" "}
                                          {customer?.firstName === "" ||
                                          customer?.firstName === null ||
                                          customer?.firstName === undefined
                                            ? ""
                                            : customer.firstName[0].toUpperCase()}
                                          {customer?.lastName === "" ||
                                          customer?.lastName === null ||
                                          customer?.lastName === undefined
                                            ? ""
                                            : customer?.lastName[0].toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="cus-grid-items close-icon-alignment-profile">
                                      <div>
                                        <p>
                                          {customer?.firstName}{" "}
                                          {customer?.lastName}
                                        </p>
                                        <span>{customer.mobileNumber}</span>
                                      </div>
                                      {rescheduleAppointments ? null : (
                                        <div>
                                          <img
                                            src={CloseBtn}
                                            alt="CloseIcon"
                                            onClick={() => setCustomer()}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    {/* <div className="staff-box-height-fix"  > */}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="grid pointer"
                                  onClick={() => {
                                    productDropdown
                                      ? closeDropdownPopover()
                                      : openDropdownPopover();
                                  }}
                                >
                                  <div className="grid-items">
                                    <div className="add-box">
                                      <img src={UserAdd} alt="UserAdd" />
                                    </div>
                                  </div>
                                  <div className="grid-items">
                                    <p>Add customer</p>
                                  </div>
                                </div>
                              )}
                              <div
                                ref={popoverDropdownRef}
                                className={
                                  productDropdown
                                    ? "add-customer-dropdown add-customer-dropdown-show"
                                    : "add-customer-dropdown-hidden add-customer-dropdown"
                                }
                              >
                                <div className="add-customer-dropdown-align">
                                  <div className="search-grid">
                                    <div className="search-grid-items">
                                      <input
                                        type="text"
                                        value={search}
                                        placeholder="Search mobile number or name"
                                        onChange={(e) =>
                                          handleCustomerSearch(e)
                                        }
                                        autoFocus
                                      />
                                    </div>
                                    {/* <div className="search-grid-items">
                                      <img src={SearchIcon} alt="SearchIcon" />
                                    </div> */}
                                  </div>
                                </div>
                                <div className="sub-spacing-align">
                                  <div
                                    className="add-new-cus"
                                    onClick={AddCustomertoggle}
                                  >
                                    <p>+ Add new customer</p>
                                  </div>
                                </div>
                                {allCustomer?.length === 0 ? (
                                  <div className="system-does-not">
                                    <p className="text-center">
                                      "Customer doesn't exist in the data. Would
                                      you like to add new?"
                                    </p>
                                  </div>
                                ) : (
                                  allCustomer &&
                                  allCustomer.map((cus, index) => {
                                    return (
                                      // <HandleCustomerNavigation
                                      //   key={character}
                                      //   setFocus={setFocus}
                                      //   index={index}
                                      //   focus={focus === index}
                                      //   character={character}
                                      //   SelectCustomer={SelectCustomer}
                                      // />
                                      <div
                                        key={cus._id}
                                        className="add-customer-details"
                                      >
                                        <div className="cus-grid">
                                          <div className="cus-grid-items">
                                            {cus.membership ? (
                                              cus?.selectMembership?.slice(
                                                -1
                                              )[0]?.isExpire === false ? (
                                                cus?.selectMembership?.slice(
                                                  -1
                                                )[0]?.cardColur ===
                                                "rgb(248, 226, 124)" ? (
                                                  <img
                                                    src={YellowMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : cus?.selectMembership?.slice(
                                                    -1
                                                  )[0]?.cardColur ===
                                                  "rgb(248, 163, 121)" ? (
                                                  <img
                                                    src={OrangeMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : cus?.selectMembership?.slice(
                                                    -1
                                                  )[0]?.cardColur ===
                                                  "rgb(109, 200, 199)" ? (
                                                  <img
                                                    src={SkyBlueMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : cus?.selectMembership?.slice(
                                                    -1
                                                  )[0]?.cardColur ===
                                                  "rgb(72, 148, 248)" ? (
                                                  <img
                                                    src={BlueMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : (
                                                  <img
                                                    src={membershipProfileSmall}
                                                    alt="ProfileImage"
                                                  />
                                                )
                                              ) : (
                                                <div className="profile-image">
                                                  {" "}
                                                  {cus.firstName === "" ||
                                                  cus.firstName === null ||
                                                  cus.firstName === undefined
                                                    ? ""
                                                    : cus.firstName[0].toUpperCase()}
                                                  {cus.lastName === "" ||
                                                  cus.lastName === null ||
                                                  cus.lastName === undefined
                                                    ? ""
                                                    : cus.lastName[0].toUpperCase()}
                                                </div>
                                              )
                                            ) : (
                                              //   <img
                                              //     src={membershipProfileSmall}
                                              //     alt="ProfileImage"
                                              //   />
                                              // )
                                              <div className="profile-image">
                                                {" "}
                                                {cus.firstName === "" ||
                                                cus.firstName === null ||
                                                cus.firstName === undefined
                                                  ? ""
                                                  : cus.firstName[0].toUpperCase()}
                                                {cus.lastName === "" ||
                                                cus.lastName === null ||
                                                cus.lastName === undefined
                                                  ? ""
                                                  : cus.lastName[0].toUpperCase()}
                                              </div>
                                            )}
                                          </div>
                                          <div
                                            className="cus-grid-items"
                                            onClick={(e) =>
                                              SelectCustomer(e, cus)
                                            }
                                          >
                                            <p>
                                              {cus.firstName} {cus.lastName}
                                            </p>
                                            <span>{cus.mobileNumber}</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>

                            <div className="add-product-counter-alignment">
                              <p>Services</p>
                              <div className="counter-box">
                                {multipleappointment.length}
                              </div>
                            </div>
                            {multipleappointment.map((serv) => {
                              return (
                                <>
                                  <div
                                    key={serv._id}
                                    className="service-timer-design"
                                  >
                                    <span>
                                      {moment.utc(serv.date).format("hh:mm A")}{" "}
                                      -{" "}
                                      {moment
                                        .utc(serv.date)
                                        .add(serv.time, "minutes")
                                        .format("hh:mm A")}
                                    </span>
                                  </div>

                                  <div
                                    key={serv._id}
                                    className="service-provider-grid"
                                    onClick={
                                      rescheduleAppointments
                                        ? null
                                        : (e) => OpenEditService(serv)
                                    }
                                  >
                                    <div
                                      key={serv._id}
                                      className="service-provider-grid-items"
                                      style={{
                                        backgroundColor: serv?.serviceId?.colour
                                          ? serv?.serviceId?.colour
                                          : "#D1FFF4",
                                        borderRadius: "5px",
                                        height: "100%",
                                      }}
                                    ></div>
                                    <div
                                      key={serv._id}
                                      className="service-provider-grid-items"
                                    >
                                      <p>
                                        {serv?.serviceId?.serviceName
                                          ? serv?.serviceId?.serviceName
                                          : "Slot"}
                                      </p>
                                      <span>
                                        {serv?.staff ? "by " : null}
                                        {serv?.staff
                                          ? serv?.staff
                                          : "by Unassign"}{" "}
                                      </span>
                                    </div>
                                    <div
                                      key={serv._id}
                                      className="service-provider-grid-items"
                                    >
                                      <h5>
                                        {serv?.serviceId?.amount ? (
                                          <a>{SettingInfo?.currentType}</a>
                                        ) : null}
                                        {serv?.serviceId?.amount === 0
                                          ? null
                                          : serv?.serviceId?.amount}
                                      </h5>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                            {service ? (
                              rescheduleAppointments ? null : editAppointment ? null : (
                                <div className="add-more">
                                  <p onClick={() => AddMoreservice()}>
                                    + Add more
                                  </p>
                                </div>
                              )
                            ) : null}
                          </div>

                          <div className="divider-edit"></div>
                          <div className="text-alignment edit-invoice-text-style">
                            <p>Total amount</p>
                            <h5>
                              <span>{SettingInfo?.currentType}</span>
                              {total}
                            </h5>
                          </div>
                        </div>
                        <div className="edit-invoice-grid-items">
                          <div className="booking-text-style">
                            <p>{appointmentType} appointment</p>
                            <div className="date-change-button-alignment">
                              <button>
                                <img
                                  style={{ marginRight: "10px" }}
                                  src={
                                    require("../../../assets/svg/date-icon-style.png")
                                      .default
                                  }
                                />
                                <span>
                                  <div className="time-dropdowns">
                                    {editAppointment ? (
                                      <DatePicker
                                        selected={
                                          selectedDate
                                            ? selectedDate
                                            : moment(staffEndISODates)
                                                .add(times)
                                                .subtract("minute", 330)._d
                                        }
                                        disabled
                                        showTimeSelect
                                        showTimeSelectOnly
                                        dateFormat="EEEE , do MMMM yyyy"
                                      />
                                    ) : (
                                      <DatePicker
                                        selected={
                                          selectedDate
                                            ? selectedDate
                                            : moment(staffEndISODates)
                                                .add(times)
                                                .subtract("minute", 330)._d
                                        }
                                        onChange={(e) =>
                                          ChangeAppointmentDate(e)
                                        }
                                        dateFormat="EEEE, do MMMM yyyy"
                                        placeholderText="Date"
                                        fixedHeight
                                      />
                                    )}
                                  </div>
                                  {/* {moment(date).format("dddd ,Do MMMM  YYYY")} */}
                                </span>
                              </button>
                              {editAppointment ? null : <p>Edit</p>}
                            </div>
                            <div className="date-change-button-alignment">
                              <button>
                                <svg
                                  style={{ marginRight: "5px" }}
                                  width="13"
                                  height="13"
                                  viewBox="0 0 13 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6.5 12.75C3.04822 12.75 0.25 9.95178 0.25 6.5C0.25 3.04822 3.04822 0.25 6.5 0.25C9.95178 0.25 12.75 3.04822 12.75 6.5C12.7462 9.95021 9.95021 12.7462 6.5 12.75ZM6.5 1.5C3.73858 1.5 1.5 3.73858 1.5 6.5C1.5 9.26142 3.73858 11.5 6.5 11.5C9.26142 11.5 11.5 9.26142 11.5 6.5C11.4969 3.73986 9.26014 1.5031 6.5 1.5ZM9.625 7.125H5.875V3.375H7.125V5.875H9.625V7.125Z"
                                    fill="#2E3A59"
                                  />
                                </svg>

                                <span>
                                  <div className="time-dropdown">
                                    {editAppointment ? (
                                      <DatePicker
                                        selected={
                                          selectedDate
                                            ? selectedDate
                                            : moment(staffEndISODates)
                                                .add(times)
                                                .subtract("minute", 330)._d
                                        }
                                        disabled
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        dateFormat="hh:mm aa"
                                      />
                                    ) : (
                                      <DatePicker
                                        selected={
                                          selectedDate
                                            ? selectedDate
                                            : moment(staffEndISODates)
                                                .add(times)
                                                .subtract("minute", 330)._d
                                        }
                                        onChange={(e) =>
                                          ChangeAppointmentTime(e)
                                        }
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        dateFormat="hh:mm aa"
                                      />
                                    )}
                                  </div>
                                </span>
                              </button>
                              {editAppointment ? null : <p>Edit</p>}
                            </div>
                            {addtrue ? null : <p>Slot Not available</p>}
                          </div>
                          <div className="send-sms-text-alignment">
                   
                            <input
                              type="checkbox"
                              checked={ispromotional}
                              // defaultChecked
                              onChange={(e) => changeSmsCheckbox(e)}
                            />
                            <label>Send SMS confirmation to the customer</label>
                          </div>
                          <div className="book-app-button-center">
                            {editAppointment ? (
                              addtrue ? (
                                <button onClick={() => AddAppointment()}>
                                  Edit appointment
                                </button>
                              ) : (
                                <button disabled>Edit appointment</button>
                              )
                            ) : rescheduleAppointments ? (
                              addtrue ? (
                                <button onClick={() => AddAppointment()}>
                                  Reschedule appointment
                                </button>
                              ) : (
                                <button disabled>Reschedule appointment</button>
                              )
                            ) : customerCompulsion ? (
                              customer && addtrue ? (
                                <button onClick={() => AddAppointment()}>
                                  Book appointment
                                </button>
                              ) : (
                                <button disabled>Book appointment</button>
                              )
                            ) : addtrue ? (
                              <button onClick={() => AddAppointment()}>
                                Book appointment
                              </button>
                            ) : (
                              <button disabled>Book appointment</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {editServiceModal && (
        <EditServiceModals
          modal={editServiceModal}
          toggle={OpenEditService}
          editServiceData={editServiceData}
          RemoveService={RemoveService}
          editAppointment={editAppointment}
          service={service}
          SettingInfo={SettingInfo}
        />
      )}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {addCustomerModal && (
        <AddCustomerModal
          modal={addCustomerModal}
          toggle={AddCustomertoggle}
          AddCustomer={AddNewCustomer}
          search={search}
        />
      )}
    </>
  );
}
