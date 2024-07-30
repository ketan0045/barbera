import React, { useState, useRef, useEffect } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import SearchIcon from "../../../assets/svg/SearchIcon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
import Auth from "../../../helpers/Auth";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Delete from "../Toaster/Delete";
import { get_Setting } from "../../../utils/user.util";
import { useSelector } from "react-redux";
import CommissionModal from "./CommissionChildModal/CommissionModal";
import ProfileEdit from "../../../assets/svg/profile-edit.png";
import ProfileDelete from "../../../assets/svg/profile-delete.png";

export default function AddNewStaffModal(props) {
  const { editStaff, serviceList, SettingInfo } = props;
  const genderRef = useRef();
  const userInfo = Auth.getUserDetail();

  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [commissionFlow, setCommissionFlow] = useState("");
  const [errors, setError] = useState({});
  const [monthDate, setMonthDate] = useState();
  const [commission, setCommission] = useState([]);
  const [year, setYear] = useState();
  const [disabled, setDisabled] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sunApplyToAll, setSunApplyToAll] = useState(false);
  const [monApplyToAll, setMonApplyToAll] = useState(false);
  const [tueApplyToAll, setTueApplyToAll] = useState(false);
  const [wedApplyToAll, setWedApplyToAll] = useState(false);
  const [thuApplyToAll, setThuApplyToAll] = useState(false);
  const [friApplyToAll, setFriApplyToAll] = useState(false);
  const [satApplyToAll, setSatApplyToAll] = useState(false);
  const [addStaffModal, setAddStaffModal] = useState(false);
  const [off, setOff] = useState(true);
  const [staffData, setStaffData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    gender: "",
    birthday: "",
    address: "",
    notes: "",
    workingDays: [],
  });

  const [commissionModal, setCommissionModal] = useState(false);

  const [monStartDate, setMonStartDate] = useState(null);
  const [monEndDate, setMonEndDate] = useState(null);
  const [monStoreClosed, setMonStoreClosed] = useState(true);
  const [mon, setMon] = useState(false);
  const [checkMonStartDate, setCheckMonStartDate] = useState(null);
  const [checkMonEndDate, setCheckMonEndDate] = useState(null);

  const [tueStartDate, setTueStartDate] = useState(null);
  const [tueEndDate, setTueEndDate] = useState(null);
  const [tueStoreClosed, setTueStoreClosed] = useState(true);
  const [tue, setTue] = useState(false);
  const [checkTueStartDate, setCheckTueStartDate] = useState(null);
  const [checkTueEndDate, setCheckTueEndDate] = useState(null);

  const [wedStartDate, setWedStartDate] = useState(null);
  const [wedEndDate, setWedEndDate] = useState(null);
  const [wedStoreClosed, setWedStoreClosed] = useState(true);
  const [wed, setWed] = useState(false);
  const [checkWedStartDate, setCheckWedStartDate] = useState(null);
  const [checkWedEndDate, setCheckWedEndDate] = useState(null);

  const [thuStartDate, setThuStartDate] = useState();
  const [thuEndDate, setThuEndDate] = useState(null);
  const [thuStoreClosed, setThuStoreClosed] = useState(true);
  const [thu, setThu] = useState(false);
  const [checkThuStartDate, setCheckThuStartDate] = useState(null);
  const [checkThuEndDate, setCheckThuEndDate] = useState(null);

  const [friStartDate, setFriStartDate] = useState(null);
  const [friEndDate, setFriEndDate] = useState(null);
  const [friStoreClosed, setFriStoreClosed] = useState(true);
  const [fri, setFri] = useState(false);
  const [checkFriStartDate, setCheckFriStartDate] = useState(null);
  const [checkFriEndDate, setCheckFriEndDate] = useState(null);

  const [satStartDate, setSatStartDate] = useState(null);
  const [satEndDate, setSatEndDate] = useState(null);
  const [satStoreClosed, setSatStoreClosed] = useState(true);
  const [sat, setSat] = useState(false);
  const [checkSatStartDate, setCheckSatStartDate] = useState(null);
  const [checkSatEndDate, setCheckSatEndDate] = useState(null);

  const [sunStartDate, setSunStartDate] = useState(null);
  const [sunEndDate, setSunEndDate] = useState(null);
  const [sunStoreClosed, setSunStoreClosed] = useState(true);
  const [sun, setSun] = useState(false);
  const [checkSunStartDate, setCheckSunStartDate] = useState(null);
  const [checkSunEndDate, setCheckSunEndDate] = useState(null);

  const [allCategories, setAllCategories] = useState([]);
  const [categoryIdList, setCategoryIdList] = useState([]);
  const [arrayforFilter, setArrayforFilter] = useState([]);
  const [keyWord, setKeyWord] = useState("");

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
  };

  const getAllCategories = async () => {
    try {
      let res = await ApiGet("category/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setAllCategories(res.data.data);
        setArrayforFilter(res.data.data);
        if (editStaff) {
          // setCategoryIdList(serviceList.map((item) => item._id));
          setCategoryIdList(
            serviceList.filter((obj) => obj.categoryName !== "Unassign").map((item) => item._id)
          );
        } else {
          // setCategoryIdList(res.data.data.map((item) => item._id));
          setCategoryIdList(
            res.data.data.filter((obj) => obj.categoryName !== "Unassign").map((item) => item._id)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const checkEmailValue = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9@_. ]*$");
    var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const checkValue = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9 ]*$");
    var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const validateSalary=()=>{
    let errors = {};
    let formIsValid = true;
    if(commission[0]?.commission_type?.targetValue === "Salary"){
      if (!staffData?.salary) {
        formIsValid = false;
        errors["salary"] = "* Add staff's Salary";
      }
    }
    setError(errors);
    return formIsValid;
  }

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    // if (staffData?.firstName) {
      if (staffData?.firstName?.trim() === "") {
        formIsValid = false;
        errors["firstName"] = "Add staff's Full name";
      }
      if (!staffData?.firstName) {
        formIsValid = false;
        errors["firstName"] = "Add staff's Full name";
      }
    // }
    setError(errors);
    return formIsValid;
  };

  const validateMobile = () => {
    let errors = {};
    let formIsValid = true;
    if (staffData?.mobileNumber.length < 10) {
      formIsValid = false;
      errors["mobileNumber"] = "Enter valid input";
    }
    setError(errors);
    return formIsValid;
  };

  const validateWorkingHours = () => {
    let errors = {};
    let formIsValid = true;
    if (monStartDate < checkMonStartDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (monEndDate > checkMonEndDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (tueStartDate < checkTueStartDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (tueEndDate > checkTueEndDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (wedStartDate < checkWedStartDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (wedEndDate > checkWedEndDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (thuStartDate < checkThuStartDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (thuEndDate > checkThuEndDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (friStartDate < checkFriStartDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (friEndDate > checkFriEndDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (satStartDate < checkSatStartDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (satEndDate > checkSatEndDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (sunStartDate < checkSunStartDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    } else if (sunEndDate > checkSunEndDate) {
      formIsValid = false;
      errors["workingHours"] = "Store is closed at this time";
    }
    setError(errors);
    return formIsValid;
  };

  const handleOnChange = (e) => {
    // validateForm();
    setDisabled(true);
    let { name, value } = e.target;
    setStaffData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleOnClick = (data) => {
    validateForm();
    setDisabled(true);
    setStaffData((prevState) => {
      return {
        ...prevState,
        gender: data,
      };
    });
  };

  const commissionModalToggle = (key) => {
    setCommissionModal(!commissionModal);
    setCommissionFlow(key);
  };

  const handleMonthDate = async (data) => {
    validateForm();
    setDisabled(true);
    setMonthDate(data);
    const fullDate = `${moment(data).format("DD-MM")}-${moment(year).format("y")}`;
    setStaffData((prevState) => {
      return {
        ...prevState,
        birthday: fullDate,
      };
    });
  };

  const handleYear = async (data) => {
    validateForm();
    setDisabled(true);
    setYear(data);
    const fullDate = `${moment(monthDate).format("DD-MM")}-${moment(data).format("y")}`;
    setStaffData((prevState) => {
      return {
        ...prevState,
        birthday: fullDate,
      };
    });
  };

  const MonStartTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setMonApplyToAll(true);
    setMonStartDate(data);
  };
  const MonEndTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setMonApplyToAll(true);
    setMonEndDate(data);
  };

  const TueStartTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setTueApplyToAll(true);
    setTueStartDate(data);
  };
  const TueEndTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setTueApplyToAll(true);
    setTueEndDate(data);
  };

  const WedStartTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setWedApplyToAll(true);
    setWedStartDate(data);
  };
  const WedEndTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setWedApplyToAll(true);
    setWedEndDate(data);
  };

  const ThuStartTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setThuApplyToAll(true);
    setThuStartDate(data);
  };
  const ThuEndTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setThuApplyToAll(true);
    setThuEndDate(data);
  };

  const FriStartTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setFriApplyToAll(true);
    setFriStartDate(data);
  };
  const FriEndTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setFriApplyToAll(true);
    setFriEndDate(data);
  };

  const SatStartTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setSatApplyToAll(true);
    setSatStartDate(data);
  };
  const SatEndTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setSatApplyToAll(true);
    setSatEndDate(data);
  };

  const SunStartTime = async (data) => {
    validateWorkingHours();
    setDisabled(true);
    setSunApplyToAll(true);
    setSunStartDate(data);
  };
  const SunEndTime = async (data) => {
    validateWorkingHours();
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

  const staffPermission = useSelector((state) => state.staffPermissions);
  const handleSubmit = async () => {
    if (validateMobile() && validateWorkingHours() && validateForm() && validateSalary()) {
      const values = Object.assign(staffData, {
        workingDays: [
          {
            dayOff: mon,
            isStoreClosed: monStoreClosed,
            Day: "Monday",
            starttime: moment(monStartDate).format("HH:mm"),
            endtime: moment(monEndDate).format("HH:mm"),
          },
          {
            dayOff: tue,
            isStoreClosed: tueStoreClosed,
            Day: "Tuesday",
            starttime: moment(tueStartDate).format("HH:mm"),
            endtime: moment(tueEndDate).format("HH:mm"),
          },
          {
            dayOff: wed,
            isStoreClosed: wedStoreClosed,
            Day: "Wednesday",
            starttime: moment(wedStartDate).format("HH:mm"),
            endtime: moment(wedEndDate).format("HH:mm"),
          },
          {
            dayOff: thu,
            isStoreClosed: thuStoreClosed,
            Day: "Thursday",
            starttime: moment(thuStartDate).format("HH:mm"),
            endtime: moment(thuEndDate).format("HH:mm"),
          },
          {
            dayOff: fri,
            isStoreClosed: friStoreClosed,
            Day: "Friday",
            starttime: moment(friStartDate).format("HH:mm"),
            endtime: moment(friEndDate).format("HH:mm"),
          },
          {
            dayOff: sat,
            isStoreClosed: satStoreClosed,
            Day: "Saturday",
            starttime: moment(satStartDate).format("HH:mm"),
            endtime: moment(satEndDate).format("HH:mm"),
          },
          {
            dayOff: sun,
            isStoreClosed: sunStoreClosed,
            Day: "Sunday",
            starttime: moment(sunStartDate).format("HH:mm"),
            endtime: moment(sunEndDate).format("HH:mm"),
          },
        ],
        companyId: userInfo.companyId,
        isActive: true,
        loginas: "staff",
        permission: staffPermission,
        commission: commission[0],
      });
      let res;
      editStaff
        ? (res = await ApiPut("staff/" + editStaff._id, values))
        : (res = await ApiPost("staff/", values));
      try {
        props.toggle();
        props.toggle(res?.data.status, res?.data.data);
        updateCategoriesToStaff(res?.data.data);
      } catch (er) {
        props.toggle(er);
      }
    }
  };

  const handleOnCheckbox = (e, key) => {
    setDisabled(true);
    if (e.target.checked && e.target.name === "category") {
      categoryIdList.push(e.target.value);
    } else if (e.target.name === "category") {
      let index = categoryIdList.indexOf(e.target.value);
      categoryIdList.splice(index, 1);
    }
    setCategoryIdList([...categoryIdList]);
    if (key === "all") {
      if (e.target.checked) {
        // setCategoryIdList(allCategories.map((item) => item._id));
        setCategoryIdList(
          allCategories.filter((obj) => obj.categoryName !== "Unassign").map((item) => item._id)
        );
      } else {
        setCategoryIdList([]);
      }
    }
  };

  const updateCategoriesToStaff = async (data) => {
    let values = editStaff ? data[0] : data;
    let payload = {
      categoryIds: categoryIdList,
      staff: [
        {
          _id: values?._id,
          firstName: values?.firstName,
          lastName: values?.lastName,
          mobileNumber: values?.mobileNumber,
          email: values?.email,
          workingDays: values?.workingDays,
        },
      ],
    };
    try {
      let res = await ApiPost("category/staff/edit/" + userInfo.companyId, payload);
    } catch (error) {
      console.log(error);
    }
  };

  const getStoreTiming = async () => {
    const SettingData = get_Setting();

    let MonStart = moment(SettingData?.storeTiming[0]?.starttime, "HH-mm");
    setMonStartDate(MonStart._d);
    let MonEnd = moment(SettingData?.storeTiming[0]?.endtime, "HH-mm");
    setMonEndDate(MonEnd._d);
    setMonStoreClosed(SettingData?.storeTiming[0]?.isStoreClosed);

    let TueStart = moment(SettingData?.storeTiming[1]?.starttime, "HH-mm");
    setTueStartDate(TueStart._d);
    let TueEnd = moment(SettingData?.storeTiming[1]?.endtime, "HH-mm");
    setTueEndDate(TueEnd._d);
    setTueStoreClosed(SettingData?.storeTiming[1]?.isStoreClosed);

    let WedStart = moment(SettingData?.storeTiming[2]?.starttime, "HH-mm");
    setWedStartDate(WedStart._d);
    let WedEnd = moment(SettingData?.storeTiming[2]?.endtime, "HH-mm");
    setWedEndDate(WedEnd._d);
    setWedStoreClosed(SettingData?.storeTiming[2]?.isStoreClosed);

    let ThuStart = moment(SettingData?.storeTiming[3]?.starttime, "HH-mm");
    setThuStartDate(ThuStart._d);
    let ThuEnd = moment(SettingData?.storeTiming[3]?.endtime, "HH-mm");
    setThuEndDate(ThuEnd._d);
    setThuStoreClosed(SettingData?.storeTiming[3]?.isStoreClosed);

    let FriStart = moment(SettingData?.storeTiming[4]?.starttime, "HH-mm");
    setFriStartDate(FriStart._d);
    let FriEnd = moment(SettingData?.storeTiming[4]?.endtime, "HH-mm");
    setFriEndDate(FriEnd._d);
    setFriStoreClosed(SettingData?.storeTiming[4]?.isStoreClosed);

    let SatStart = moment(SettingData?.storeTiming[5]?.starttime, "HH-mm");
    setSatStartDate(SatStart._d);
    let SatEnd = moment(SettingData?.storeTiming[5]?.endtime, "HH-mm");
    setSatEndDate(SatEnd._d);
    setSatStoreClosed(SettingData?.storeTiming[5]?.isStoreClosed);

    let SunStart = moment(SettingData?.storeTiming[6]?.starttime, "HH-mm");
    setSunStartDate(SunStart._d);
    let SunEnd = moment(SettingData?.storeTiming[6]?.endtime, "HH-mm");
    setSunEndDate(SunEnd._d);
    setSunStoreClosed(SettingData?.storeTiming[6]?.isStoreClosed);

    // let res = await ApiGet("setting/company/" + userInfo.companyId);
    // try {
    //   if (res.data.status === 200) {
    //     let MonStart = moment(
    //       res.data.data[0].storeTiming[0].starttime,
    //       "HH-mm"
    //     );
    //     setMonStartDate(MonStart._d);
    //     let MonEnd = moment(res.data.data[0].storeTiming[0].endtime, "HH-mm");
    //     setMonEndDate(MonEnd._d);
    //     setMonStoreClosed(res.data.data[0].storeTiming[0].isStoreClosed);

    //     let TueStart = moment(
    //       res.data.data[0].storeTiming[1].starttime,
    //       "HH-mm"
    //     );
    //     setTueStartDate(TueStart._d);
    //     let TueEnd = moment(res.data.data[0].storeTiming[1].endtime, "HH-mm");
    //     setTueEndDate(TueEnd._d);
    //     setTueStoreClosed(res.data.data[0].storeTiming[1].isStoreClosed);

    //     let WedStart = moment(
    //       res.data.data[0].storeTiming[2].starttime,
    //       "HH-mm"
    //     );
    //     setWedStartDate(WedStart._d);
    //     let WedEnd = moment(res.data.data[0].storeTiming[2].endtime, "HH-mm");
    //     setWedEndDate(WedEnd._d);
    //     setWedStoreClosed(res.data.data[0].storeTiming[2].isStoreClosed);

    //     let ThuStart = moment(
    //       res.data.data[0].storeTiming[3].starttime,
    //       "HH-mm"
    //     );
    //     setThuStartDate(ThuStart._d);
    //     let ThuEnd = moment(res.data.data[0].storeTiming[3].endtime, "HH-mm");
    //     setThuEndDate(ThuEnd._d);
    //     setThuStoreClosed(res.data.data[0].storeTiming[3].isStoreClosed);

    //     let FriStart = moment(
    //       res.data.data[0].storeTiming[4].starttime,
    //       "HH-mm"
    //     );
    //     setFriStartDate(FriStart._d);
    //     let FriEnd = moment(res.data.data[0].storeTiming[4].endtime, "HH-mm");
    //     setFriEndDate(FriEnd._d);
    //     setFriStoreClosed(res.data.data[0].storeTiming[4].isStoreClosed);

    //     let SatStart = moment(
    //       res.data.data[0].storeTiming[5].starttime,
    //       "HH-mm"
    //     );
    //     setSatStartDate(SatStart._d);
    //     let SatEnd = moment(res.data.data[0].storeTiming[5].endtime, "HH-mm");
    //     setSatEndDate(SatEnd._d);
    //     setSatStoreClosed(res.data.data[0].storeTiming[5].isStoreClosed);

    //     let SunStart = moment(
    //       res.data.data[0].storeTiming[6].starttime,
    //       "HH-mm"
    //     );
    //     setSunStartDate(SunStart._d);
    //     let SunEnd = moment(res.data.data[0].storeTiming[6].endtime, "HH-mm");
    //     setSunEndDate(SunEnd._d);
    //     setSunStoreClosed(res.data.data[0].storeTiming[6].isStoreClosed);
    //   } else {
    //     console.log("in the else");
    //   }
    // } catch (err) {
    //   console.log("in the catch");
    // }
  };

  const getStoreTimingForCheck = async () => {
    const SettingData = get_Setting();

    let MonStart = moment(SettingData?.storeTiming[0]?.starttime, "HH-mm");
    setCheckMonStartDate(MonStart._d);
    let MonEnd = moment(SettingData?.storeTiming[0]?.endtime, "HH-mm");
    setCheckMonEndDate(MonEnd._d);

    let TueStart = moment(SettingData?.storeTiming[1]?.starttime, "HH-mm");
    setCheckTueStartDate(TueStart._d);
    let TueEnd = moment(SettingData?.storeTiming[1]?.endtime, "HH-mm");
    setCheckTueEndDate(TueEnd._d);

    let WedStart = moment(SettingData?.storeTiming[2]?.starttime, "HH-mm");
    setCheckWedStartDate(WedStart._d);
    let WedEnd = moment(SettingData?.storeTiming[2]?.endtime, "HH-mm");
    setCheckWedEndDate(WedEnd._d);

    let ThuStart = moment(SettingData?.storeTiming[3]?.starttime, "HH-mm");
    setCheckThuStartDate(ThuStart._d);
    let ThuEnd = moment(SettingData?.storeTiming[3]?.endtime, "HH-mm");
    setCheckThuEndDate(ThuEnd._d);

    let FriStart = moment(SettingData?.storeTiming[4]?.starttime, "HH-mm");
    setCheckFriStartDate(FriStart._d);
    let FriEnd = moment(SettingData?.storeTiming[4]?.endtime, "HH-mm");
    setCheckFriEndDate(FriEnd._d);

    let SatStart = moment(SettingData?.storeTiming[5]?.starttime, "HH-mm");
    setCheckSatStartDate(SatStart._d);
    let SatEnd = moment(SettingData?.storeTiming[5]?.endtime, "HH-mm");
    setCheckSatEndDate(SatEnd._d);

    let SunStart = moment(SettingData?.storeTiming[6]?.starttime, "HH-mm");
    setCheckSunStartDate(SunStart._d);
    let SunEnd = moment(SettingData?.storeTiming[6]?.endtime, "HH-mm");
    setCheckSunEndDate(SunEnd._d);
    // let res = await ApiGet("setting/company/" + userInfo.companyId);
    // try {
    //   if (res.data.status === 200) {
    //     let MonStart = moment(
    //       res.data.data[0].storeTiming[0]?.starttime,
    //       "HH-mm"
    //     );
    //     setCheckMonStartDate(MonStart._d);
    //     let MonEnd = moment(res.data.data[0].storeTiming[0].endtime, "HH-mm");
    //     setCheckMonEndDate(MonEnd._d);

    //     let TueStart = moment(
    //       res.data.data[0].storeTiming[1].starttime,
    //       "HH-mm"
    //     );
    //     setCheckTueStartDate(TueStart._d);
    //     let TueEnd = moment(res.data.data[0].storeTiming[1].endtime, "HH-mm");
    //     setCheckTueEndDate(TueEnd._d);

    //     let WedStart = moment(
    //       res.data.data[0].storeTiming[2].starttime,
    //       "HH-mm"
    //     );
    //     setCheckWedStartDate(WedStart._d);
    //     let WedEnd = moment(res.data.data[0].storeTiming[2].endtime, "HH-mm");
    //     setCheckWedEndDate(WedEnd._d);

    //     let ThuStart = moment(
    //       res.data.data[0].storeTiming[3].starttime,
    //       "HH-mm"
    //     );
    //     setCheckThuStartDate(ThuStart._d);
    //     let ThuEnd = moment(res.data.data[0].storeTiming[3].endtime, "HH-mm");
    //     setCheckThuEndDate(ThuEnd._d);

    //     let FriStart = moment(
    //       res.data.data[0].storeTiming[4].starttime,
    //       "HH-mm"
    //     );
    //     setCheckFriStartDate(FriStart._d);
    //     let FriEnd = moment(res.data.data[0].storeTiming[4].endtime, "HH-mm");
    //     setCheckFriEndDate(FriEnd._d);

    //     let SatStart = moment(
    //       res.data.data[0].storeTiming[5].starttime,
    //       "HH-mm"
    //     );
    //     setCheckSatStartDate(SatStart._d);
    //     let SatEnd = moment(res.data.data[0].storeTiming[5].endtime, "HH-mm");
    //     setCheckSatEndDate(SatEnd._d);

    //     let SunStart = moment(
    //       res.data.data[0].storeTiming[6].starttime,
    //       "HH-mm"
    //     );
    //     setCheckSunStartDate(SunStart._d);
    //     let SunEnd = moment(res.data.data[0].storeTiming[6].endtime, "HH-mm");
    //     setCheckSunEndDate(SunEnd._d);
    //   } else {
    //     console.log("in the else");
    //   }
    // } catch (err) {
    //   console.log("in the catch");
    // }
  };

  const fetchData = async (id) => {
    let staffValue = await ApiGet("staff/" + id);
    staffValue = staffValue.data.data;
    setStaffData(staffValue[0]);
    let MonStart = moment(staffValue[0].workingDays[0].starttime, "HH-mm");
    staffValue[0].workingDays[0].starttime ? setMonStartDate(MonStart._d) : setMonStartDate();

    setMon(staffValue[0].workingDays[0].dayOff);
    let MonEnd = moment(staffValue[0].workingDays[0].endtime, "HH-mm");
    staffValue[0].workingDays[0].endtime ? setMonEndDate(MonEnd._d) : setMon(true);

    let TueStart = moment(staffValue[0].workingDays[1].starttime, "HH-mm");
    staffValue[0].workingDays[1].starttime ? setTueStartDate(TueStart._d) : setTueStartDate();

    setTue(staffValue[0].workingDays[1].dayOff);
    let TueEnd = moment(staffValue[0].workingDays[1].endtime, "HH-mm");
    staffValue[0].workingDays[1].endtime ? setTueEndDate(TueEnd._d) : setTue(true);

    let WedStart = moment(staffValue[0].workingDays[2].starttime, "HH-mm");
    staffValue[0].workingDays[2].starttime ? setWedStartDate(WedStart._d) : setWedStartDate();

    setWed(staffValue[0].workingDays[2].dayOff);
    let WedEnd = moment(staffValue[0].workingDays[2].endtime, "HH-mm");
    staffValue[0].workingDays[2].endtime ? setWedEndDate(WedEnd._d) : setWed(true);

    let ThuStart = moment(staffValue[0].workingDays[3].starttime, "HH-mm");
    staffValue[0].workingDays[3].starttime ? setThuStartDate(ThuStart._d) : setThuStartDate();

    setThu(staffValue[0].workingDays[3].dayOff);
    let ThuEnd = moment(staffValue[0].workingDays[3].endtime, "HH-mm");
    staffValue[0].workingDays[3].endtime ? setThuEndDate(ThuEnd._d) : setThu(true);

    let FriStart = moment(staffValue[0].workingDays[4].starttime, "HH-mm");
    staffValue[0].workingDays[4].starttime ? setFriStartDate(FriStart._d) : setFriStartDate();

    setFri(staffValue[0].workingDays[4].dayOff);
    let FriEnd = moment(staffValue[0].workingDays[4].endtime, "HH-mm");
    staffValue[0].workingDays[4].endtime ? setFriEndDate(FriEnd._d) : setFri(true);

    let SatStart = moment(staffValue[0].workingDays[5].starttime, "HH-mm");
    staffValue[0].workingDays[5].starttime ? setSatStartDate(SatStart._d) : setSatStartDate();

    setSat(staffValue[0].workingDays[5].dayOff);
    let SatEnd = moment(staffValue[0].workingDays[5].endtime, "HH-mm");
    staffValue[0].workingDays[5].endtime ? setSatEndDate(SatEnd._d) : setSat(true);

    let SunStart = moment(staffValue[0].workingDays[6].starttime, "HH-mm");
    staffValue[0].workingDays[6].starttime ? setSunStartDate(SunStart._d) : setSunStartDate();

    setSun(staffValue[0].workingDays[6].dayOff);
    let SunEnd = moment(staffValue[0].workingDays[6].endtime, "HH-mm");
    staffValue[0].workingDays[6].endtime ? setSunEndDate(SunEnd._d) : setSun(true);

    setMonStoreClosed(staffValue[0].workingDays[0].isStoreClosed);
    setTueStoreClosed(staffValue[0].workingDays[1].isStoreClosed);
    setWedStoreClosed(staffValue[0].workingDays[2].isStoreClosed);
    setThuStoreClosed(staffValue[0].workingDays[3].isStoreClosed);
    setFriStoreClosed(staffValue[0].workingDays[4].isStoreClosed);
    setSatStoreClosed(staffValue[0].workingDays[5].isStoreClosed);
    setSunStoreClosed(staffValue[0].workingDays[6].isStoreClosed);

    setCommission(staffValue[0].commission);
  };

  const setObj = () => {
    let MonthDate = moment(editStaff?.birthday, "DD-MM-YYYY");
    if (editStaff?.birthday === "") {
      setMonthDate("");
    } else if (editStaff?.birthday === "Invalid date-Invalid date") {
      setMonthDate("");
    } else if (editStaff?.birthday === undefined) {
      setMonthDate("");
    } else {
      setMonthDate(MonthDate._d);
    }
    let Year = moment(editStaff?.birthday, "DD-MM-YYYY");
    if (editStaff?.birthday === "") {
      setYear("");
    } else if (editStaff?.birthday === "Invalid date-Invalid date") {
      setYear("");
    } else if (editStaff?.birthday === undefined) {
      setYear("");
    } else {
      setYear(Year._d);
    }
  };

  useEffect(() => {
    if (editStaff) {
      setObj();
      fetchData(editStaff?._id);
    } else {
      getStoreTiming();
      setStaffData({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        gender: "",
        birthday: "",
        address: "",
        notes: "",
        workingDays: [],
      });
    }
  }, []);

  useEffect(() => {
    getStoreTimingForCheck();
    getAllCategories();
  }, []);

  useEffect(() => {
    validateWorkingHours();
  }, [disabled]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (subMenuOpen) {
        if (subMenuOpen && genderRef.current && !genderRef.current.contains(e.target)) {
          setSubMenuopen(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [subMenuOpen]);

  useEffect(() => {
    if (keyWord) {
      var category =
        arrayforFilter.length > 0 &&
        arrayforFilter.filter(
          (obj) =>
            obj.categoryName && obj.categoryName.toLowerCase().includes(keyWord.toLowerCase())
        );
      setAllCategories(category);
    } else {
      setAllCategories(arrayforFilter);
    }
  }, [keyWord]);

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {deleteModal && (
              <Delete
                modal={deleteModal}
                toggle={deleteModaltoggle}
                disabledStaff={disabled}
                disabledStaffModal={props.toggle}
              />
            )}
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                {disabled ? (
                  <div onClick={() => opendeleteModal()} className="modal-close">
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                ) : (
                  <div onClick={() => props.toggle()} className="modal-close">
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                )}
                <div className="modal-title">
                  <h2>{editStaff ? "Edit staff" : "Add New Staff"}</h2>
                </div>
              </div>
              {staffData?.firstName &&
                staffData?.mobileNumber &&
                // allCategories?.length > 0
                // ? categoryIdList?.length > 0
                // :
                staffData?.firstName &&
                disabled ? (
                <div className="modal-button">
                  <button onClick={() => handleSubmit()}>
                    {editStaff ? "Save Changes" : "Add Staff"}
                  </button>
                </div>
              ) : (
                <div className="modal-button">
                  <button disabled>{editStaff ? "Save Changes" : "Add Staff"}</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center">
                <div>
                  <div className="product-info-box">
                    <div className="heading-style">
                      <h3>Personal data</h3>
                    </div>
                    <div className="card-details">
                      <div className="form-group customer-form-group-align">
                        <label>
                          Full name
                          <span style={{ color: "red" }}>
                            {" "}
                            *{" "}
                            {staffData.firstName.trim() == "" && (
                              <span
                                style={{
                                  color: "red",
                                  top: "5px",
                                  fontSize: "10px",
                                }}
                              >
                                {" "}
                                {errors["firstName"]}{" "}
                              </span>
                            )}{" "}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={staffData.firstName.replace(/^(.)|\s+(.)/g, (c) =>
                            c.toUpperCase()
                          )}
                          placeholder="Enter staff's full name"
                          onChange={(e) => handleOnChange(e)}
                          onKeyPress={checkValue}
                          autoFocus
                        />
                      </div>
                      {/* <div className="form-group customer-form-group-align">
                        <label>Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={staffData.lastName.replace(
                            /^(.)|\s+(.)/g,
                            (c) => c.toUpperCase()
                          )}
                          placeholder="Enter staff's last name"
                          onChange={(e) => handleOnChange(e)}
                          onKeyPress={checkValue}
                        />
                      </div> */}
                      <div className="form-group customer-form-group-align">
                        <label>
                          Mobile number<span style={{ color: "red" }}> * </span>
                          {staffData.mobileNumber.length < 10 && (
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "10px",
                              }}
                            >
                              {errors["mobileNumber"]}
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          name="mobileNumber"
                          value={staffData.mobileNumber}
                          placeholder="+ 91"
                          onChange={(e) => handleOnChange(e)}
                          onKeyPress={bindInput}
                          maxLength="10"
                        />
                      </div>
                      <div className="form-group customer-form-group-align">
                        <label>Email</label>
                        <input
                          type="text"
                          name="email"
                          value={staffData.email}
                          placeholder="Enter email address"
                          onChange={(e) => handleOnChange(e)}
                          onKeyPress={checkEmailValue}
                        />
                      </div>
                      <div className="option-select-group customer-form-group-align">
                        <label>Gender</label>
                        <div className="relative">
                          <div
                            className="input-relative"
                            onClick={() => setSubMenuopen(!subMenuOpen)}
                            ref={genderRef}
                          >
                            <input
                              type="text"
                              style={{ fontWeight: "500" }}
                              name="gender"
                              value={staffData.gender}
                              placeholder="Select gender"
                            />
                            <div className="drop-down-icon-center">
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              subMenuOpen ? "sub-menu-open sub-menu" : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              <ul onClick={(e) => handleOnClick(e.target.innerHTML)}>
                                <li value="Male">Male</li>
                                <li value="Female">Female</li>
                                <li value="Other">Other</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="customer-form-grid customer-form-group-align">
                        <div className="customer-form-grid-items">
                          <div className="form-group">
                            <label>Birthdate</label>
                            {/* <input
                              type="text"
                              name="birthDate"
                              value={staffData.birthDate}
                              placeholder="Date - Month"
                              onChange={(e) => handleOnChange(e)}
                            /> */}
                            <DatePicker
                              selected={monthDate}
                              onChange={handleMonthDate}
                              dateFormat="dd-MMM"
                              placeholderText="Date - Month"
                              fixedHeight
                            />
                          </div>
                        </div>
                        <div className="customer-form-grid-items">
                          <div className="form-group">
                            <label>Year</label>
                            {/* <input
                              type="text"
                              name="year"
                              value={staffData.year}
                              placeholder="Year"
                              onChange={(e) => handleOnChange(e)}
                            /> */}
                            <DatePicker
                              selected={year}
                              onChange={handleYear}
                              showYearPicker
                              dateFormat="yyyy"
                              placeholderText="Year"
                              fixedHeight
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group customer-form-group-align">
                        <label>Salary</label> <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["salary"]}
                          </span>
                        <input
                          type="text"
                          name="salary"
                          value={staffData.salary}
                          placeholder="Enter salary"
                          onChange={(e) => handleOnChange(e)}
                          onKeyPress={bindInput}
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          name="address"
                          value={staffData.address}
                          rows="3"
                          cols="50"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          name="notes"
                          value={staffData.notes}
                          rows="3"
                          cols="50"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                  </div>
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
                        {sunStartDate < checkSunStartDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}{" "}
                        {sunEndDate > checkSunEndDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}
                        <div
                          className={
                            sunStoreClosed
                              ? "working-time-grid disable-background"
                              : sun
                                ? "working-time-grid disable-background"
                                : "working-time-grid"
                          }
                        >
                          <div className="working-grid-items">
                            <input
                              type="checkbox"
                              checked={sunStoreClosed ? !sunStoreClosed : !sun}
                              onChange={() => {
                                setSun(!sun);
                                setDisabled(true);
                              }}
                            />
                            <span>Sunday</span>
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {sunStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : sun ? (
                              <button>Off day</button>
                            ) : (
                              <button>
                                <DatePicker
                                  selected={sunStartDate}
                                  onChange={(e) => SunStartTime(e)}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  dateFormat="hh:mm aa"
                                  className="approve-staff-date"
                                />
                              </button>
                            )}
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {sunStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : sun ? (
                              <button>Off day</button>
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
                        {monStartDate < checkMonStartDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}{" "}
                        {monEndDate > checkMonEndDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}
                        <div
                          className={
                            monStoreClosed
                              ? "working-time-grid disable-background"
                              : mon
                                ? "working-time-grid disable-background"
                                : "working-time-grid"
                          }
                        >
                          <div className="working-grid-items">
                            <input
                              type="checkbox"
                              checked={monStoreClosed ? !monStoreClosed : !mon}
                              onChange={() => {
                                setMon(!mon);
                                setDisabled(true);
                              }}
                            />
                            <span>Monday</span>
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {monStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : mon ? (
                              <button>Off day</button>
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
                            {monStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : mon ? (
                              <button>Off day</button>
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
                        {tueStartDate < checkTueStartDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}{" "}
                        {tueEndDate > checkTueEndDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}
                        <div
                          className={
                            tueStoreClosed
                              ? "working-time-grid disable-background"
                              : tue
                                ? "working-time-grid disable-background"
                                : "working-time-grid"
                          }
                        >
                          <div className="working-grid-items">
                            <input
                              type="checkbox"
                              checked={tueStoreClosed ? !tueStoreClosed : !tue}
                              onChange={() => {
                                setTue(!tue);
                                setDisabled(true);
                              }}
                            />
                            <span>Tuesday</span>
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {tueStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : tue ? (
                              <button>Off day</button>
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
                            {tueStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : tue ? (
                              <button>Off day</button>
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
                        {wedStartDate < checkWedStartDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}{" "}
                        {wedEndDate > checkWedEndDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}
                        <div
                          className={
                            wedStoreClosed
                              ? "working-time-grid disable-background"
                              : wed
                                ? "working-time-grid disable-background"
                                : "working-time-grid"
                          }
                        >
                          <div className="working-grid-items">
                            <input
                              type="checkbox"
                              checked={wedStoreClosed ? !wedStoreClosed : !wed}
                              onChange={() => {
                                setWed(!wed);
                                setDisabled(true);
                              }}
                            />
                            <span>Wednesday</span>
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {wedStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : wed ? (
                              <button>Off day</button>
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
                            {wedStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : wed ? (
                              <button>Off day</button>
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
                        {thuStartDate < checkThuStartDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}{" "}
                        {thuEndDate > checkThuEndDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}
                        <div
                          className={
                            thuStoreClosed
                              ? "working-time-grid disable-background"
                              : thu
                                ? "working-time-grid disable-background"
                                : "working-time-grid"
                          }
                        >
                          <div className="working-grid-items">
                            <input
                              type="checkbox"
                              checked={thuStoreClosed ? !thuStoreClosed : !thu}
                              onChange={() => {
                                setThu(!thu);
                                setDisabled(true);
                              }}
                            />
                            <span>Thursday</span>
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {thuStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : thu ? (
                              <button>Off day</button>
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
                            {thuStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : thu ? (
                              <button>Off day</button>
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
                        {friStartDate < checkFriStartDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}{" "}
                        {friEndDate > checkFriEndDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}
                        <div
                          className={
                            friStoreClosed
                              ? "working-time-grid disable-background"
                              : fri
                                ? "working-time-grid disable-background"
                                : "working-time-grid"
                          }
                        >
                          <div className="working-grid-items">
                            <input
                              type="checkbox"
                              checked={friStoreClosed ? !friStoreClosed : !fri}
                              onChange={() => {
                                setFri(!fri);
                                setDisabled(true);
                              }}
                            />
                            <span>Friday</span>
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {friStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : fri ? (
                              <button>Off day</button>
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
                            {friStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : fri ? (
                              <button>Off day</button>
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
                        {satStartDate < checkSatStartDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}{" "}
                        {satEndDate > checkSatEndDate && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["workingHours"]}
                          </span>
                        )}
                        <div
                          className={
                            satStoreClosed
                              ? "working-time-grid disable-background"
                              : sat
                                ? "working-time-grid disable-background"
                                : "working-time-grid"
                          }
                        >
                          <div className="working-grid-items">
                            <input
                              type="checkbox"
                              checked={satStoreClosed ? !satStoreClosed : !sat}
                              onChange={() => {
                                setSat(!sat);
                                setDisabled(true);
                              }}
                            />
                            <span>Saturday</span>
                          </div>
                          <div className="working-grid-items  input-packge-time-style-chanage">
                            {satStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : sat ? (
                              <button>Off day</button>
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
                            {satStoreClosed ? (
                              <button
                                style={{
                                  backgroundColor: "rgb(230, 102, 102, 0.3)",
                                  color: "rgb(230, 102, 102)",
                                }}
                              >
                                Store Closed
                              </button>
                            ) : sat ? (
                              <button>Off day</button>
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
                  <div className="product-info-box add-new-staff-align">
                    <div className="heading-style">
                      <h3>Services</h3>
                    </div>
                    <div className="card-details">
                      <div className="child-all-service-selected">
                        <p>
                          {categoryIdList?.length === allCategories?.length - 1
                            ? "All"
                            : categoryIdList?.length}{" "}
                          services selected
                        </p>
                        <span onClick={() => setAddStaffModal(!addStaffModal)}>Edit</span>
                      </div>
                    </div>
                  </div>

                  <div className="product-info-box add-new-staff-align">
                    <div className="heading-style">
                      <h3>Staff commissions</h3>
                    </div>
                    {commission?.length > 0 ? (
                      <div className="staff-commission-details">
                        <div className="child-staff-commission-details">
                          <div className="commission-header-details-border">
                            <div>
                              <h1>Commissions</h1>
                            </div>
                            <div className="edit-delete-icon-position">
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() => commissionModalToggle("edit")}
                              >
                                <img src={ProfileEdit} alt="ProfileEdit" />
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setCommission([[]]);
                                  setDisabled(true);
                                }}
                              >
                                <img src={ProfileDelete} alt="ProfileDelete" />
                              </div>
                            </div>
                          </div>
                          <div className="service-commission-details-box-width">
                            <div className="service-commission-details-header">
                              <h1>Service commission</h1>
                            </div>
                            <div className="service-commission-details-text">
                              <p>
                                {commission[0]?.commission_type?.value} commission{" "}
                                {commission[0]?.commission_type?.targetValue
                                  ? `on ${commission[0]?.commission_type?.targetValue}`
                                  : ""}
                                {commission[0]?.commission_type?.targetRange?.map((item, index) => {
                                  return (
                                    <p>
                                      from <a>{SettingInfo?.currentType}</a> {item.from}{" "}
                                      {item.to !== "" && item.to !== "0" ? <>to <a>{SettingInfo?.currentType}</a></> : "and"}{" "}
                                      {item.to === "" || item.to === "0" ? "above" : item.to} -{" "}
                                      {item.commission} %
                                    </p>
                                  );
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="service-commission-details-box-width">
                            <div className="service-commission-details-header">
                              <h1>Product commission</h1>
                            </div>
                            <div className="service-commission-details-text">
                              <p>
                                {commission[0]?.product_type?.value === "All products"
                                  ? "All products added"
                                  : `${commission[0]?.product_type?.commission?.length || 0
                                  } products added`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="card-details"
                        style={{ cursor: "pointer" }}
                        onClick={() => commissionModalToggle("add")}
                      >
                        <div className="child-all-service-selected">
                          <span>+ Add staff commissions</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {addStaffModal && (
              <div className="add-service-mini-modal">
                <div className="add-service-mini-modal-design">
                  <div className="modal-header">
                    <div className="container-long">
                      <div className="modal-header-alignment">
                        <div className="add-staff-child-modal-design-title">
                          <div
                            className="modal-close"
                            onClick={() => setAddStaffModal(!addStaffModal)}
                          >
                            <img src={CloseIcon} alt="CloseIcon" />
                          </div>
                          <div className="">
                            <h2>Add staff: Select service categories</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mini-service-add-staff-modal-body">
                    <div className="add-new-child-search">
                      <div className="input-relative-child">
                        <input
                          type="search"
                          placeholder="Search category"
                          onChange={(e) => setKeyWord(e.target.value)}
                        />
                        <div className="search-child-icon-alignment">
                          <img src={SearchIcon} alt="SearchIcon" />
                        </div>
                      </div>
                    </div>
                    <div className="select-all-category-child-box">
                      <div className="all-treatment-align-box-all">
                        <div className="all-treatment-align-box">
                          <div>
                            <input
                              type="checkbox"
                              checked={categoryIdList?.length === allCategories?.length - 1}
                              onChange={(e) => handleOnCheckbox(e, "all")}
                            />
                          </div>
                          <div>
                            <span>Select all categories</span>
                          </div>
                        </div>
                        {allCategories.length > 0 &&
                          allCategories.map((category, i) => {
                            return (
                              category.categoryName !== "Unassign" && (
                                <div className="all-treatment-align-box" key={i}>
                                  <div>
                                    <input
                                      type="checkbox"
                                      name="category"
                                      value={category?._id}
                                      checked={categoryIdList?.includes(category?._id)}
                                      onChange={(e) => handleOnCheckbox(e)}
                                    />
                                  </div>
                                  <div>
                                    <span>{category?.categoryName}</span>
                                  </div>
                                </div>
                              )
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {commissionModal && (
        <CommissionModal
          toggle={commissionModalToggle}
          editCommission={commission}
          setCommission={setCommission}
          setDisabled={setDisabled}
          commissionFlow={commissionFlow}
        />
      )}
    </div>
  );
}
