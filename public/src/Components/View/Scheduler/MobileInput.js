import React, { useState, useEffect } from "react";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Row, Col } from 'reactstrap';
import { ApiPut, ApiPost, ApiGet } from "../../../helpers/API/ApiData";

import * as Yup from "yup";
import { useFormik } from "formik";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Auth from "../../../helpers/Auth";
import moment from "moment";
import CreateCustomer from "./../Customer/CreateCustomer";
import Select from "react-select";
import "./index.css";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import { get_Setting } from "../../../utils/user.util";

export default function MobileInput(props) {
  const { args, startTime, endTime, IsStaff, dateTime, uuid } = props;

  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [appointmentType, setAppointmentType] = useState("prebooking");
  const [isConfirmationSMS, setIsConfirmationSMS] = useState(true);
  const [customers, setCustomers] = useState();
  const [multipleClicked, setMultipleClicked] = useState(false);
  const [mobile, setMobile] = useState();
  const [appointmentId, setAppointmentId] = useState();
  const [matched, setMatched] = useState(false);
  const [serviceId, setServiceId] = useState();
  const [name, setName] = useState();
  const [name1, setName1] = useState();
  const [mobileMsg, setMobileMsg] = useState("");
  const [workingDays, setWorkingDays] = useState();
  const [storeTiming, setStoreTiming] = useState();
  const [timeMsg, setTimeMsg] = useState("");
  const [storeTimeMsg, setStoreTimeMsg] = useState("");
  const [matchedMsg, setMatchedMsg] = useState("");
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const userInfo = Auth.getUserDetail();
  const [multipleServices, setMultipleServices] = useState(false);
  const [multipleServicesData, setMultipleServicesData] = useState([]);
  const [multipleServicesBodyData, setMultipleServicesBodyData] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [nextSlotTime, setNextSlotTime] = useState();
  const [firstTime, setFirstTime] = useState();
  const [duration, setDuration] = useState();
  const [appointment, setAppointmnet] = useState();
  const [staffs, setStaffs] = useState();
  const [service, setService] = useState();
  const [times, setTimes] = useState();
  const [editDeleteMultipleServiceData, setEditDeleteMultipleServiceData] =
    useState([]);
  const [
    editDeleteMultipleServiceDataBody,
    setEditDeleteMultipleServiceDataBody,
  ] = useState([]);
  const [editDeleteIndex, setEditDeleteIndex] = useState(0);
  const [serv, setServ] = useState(
    args && args.serviceId ? args && args.serviceId : ""
  );
  let SettingInfo = get_Setting()

  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [number, setNumber] = useState("");
  const [searchTimeOut, setSearchTimeOut] = useState();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [wordEntered, setWordEntered] = useState("");
  const [loading, setLoading] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [textValue1, setTextValue1] = useState("");
  const changeDuration = (data) => {
    setDuration(data);
    setTimes(moment(data).format("HH:mm"));
  };
  const selectStyles = {
    control: (styles) => ({
      ...styles,
      fontFamily: "'Poppins', sans-serif",
      borderColor: "none !important",
      color: "#193566",
      background: "#ECF0F3 !important",
      backgroundColor: "#ECF0F3 !important",
      minHeight: "45px !important",
      boxShadow:
        "inset 5px 5px 10px #97a7c380, inset -5px -5px 5px #ffffff !important",
      "&:hover": {
        borderColor: "none !important",
        boxShadow:
          "inset 5px 5px 10px #97a7c380, inset -5px -5px 5px #ffffff !important",
      },
      "&:focus": {
        borderColor: "none !important",
        boxShadow:
          "inset 5px 5px 10px #97a7c380, inset -5px -5px 5px #ffffff !important",
      },
    }),
    noOptionsMessage: (styles, data) => {
      return {
        ...styles,
        color: "#193566",
        backgroundColor: "#ecf0f3",
      };
    },
    option: (styles, data) => {
      return {
        ...styles,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "600",
        fontSize: "1rem",
        background: "#ECF0F3 !important",
        "&:hover": {
          background: "#d1d9e6 !important",
        },
        backgroundColor: data.isDisabled
          ? null
          : data.isSelected
          ? "#d1d9e6"
          : data.isFocused
          ? "#d1d9e6"
          : null,

        color: data.isDisabled
          ? "#ccc"
          : data.isSelected
          ? "#193566"
          : "#193566",
        cursor: data.isDisabled ? "not-allowed" : "default",
        ":active": {
          ...styles[":active"],
          fontFamily: "'Poppins', sans-serif",
          backgroundColor:
            !data.isDisabled && (data.isSelected ? "#d1d9e6" : "#d1d9e6"),
        },
      };
    },
    input: (styles) => ({
      ...styles,
      color: "#193566",
      fontWeight: "500",
      borderColor: "rgba(0, 0, 0, 0.38)",
      fontFamily: "'Poppins', sans-serif",
    }),
    placeholder: (styles) => ({
      ...styles,
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1rem",
      fontWeight: "500",
      lineHeight: 1,
      fontSize: "18px",
      color: "#193566",
    }),
    valueContainer: (styles) => ({
      ...styles,
      color: "#193566",
      fontWeight: "500",
      fontFamily: "'Poppins', sans-serif",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#193566",
      fontFamily: "'Poppins', sans-serif",
    }),
    multiValue: (styles) => ({
      ...styles,
      color: "#193566",
      fontFamily: "'Poppins', sans-serif",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#193566",
      fontFamily: "'Poppins', sans-serif",
      fontSize: "18px",
    }),
    menuPortal: (styles) => ({ ...styles, zIndex: 1000 }),
    indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
    indicatorContainer: (styles) => ({
      ...styles,
      color: "#ff0000 !important",
    }),
    group: (provided) => ({
      ...provided,
      paddingTop: 0,
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: 0,
      width: "100%",
      marginTop: "-1px",
    }),
    menuList: (provided, state) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
      overflow: "auto",
    }),
  };
  const handleRadioChange = (event) => {
    setAppointmentType(event.target.value);
    if (event.target.value === "walkin") {
      formik.setFieldValue("date", moment().format("YYYY-MM-DD"));
      formik.setFieldValue("time", moment().format("HH:mm"));
      setDuration(moment()._d);
      setTimes(moment(moment()._d).add(1, "minutes").format("HH:mm"));
    } else {
      formik.setFieldValue("date", "");
      formik.setFieldValue("time", "");
      setDuration();
      setTimes();
    }
  };

  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
  // const getSetting = async (e) => {
  //   let res = await ApiGet("setting/company/" + userInfo.companyId);
  //   try {
  //     if (res.data.status === 200) {
  //       setAppointmnet(res?.data?.data[0]?.appointments);
  //       setService(res?.data?.data[0]?.service);
  //       setStaffs(res?.data?.data[0]?.staff);
  //     } else {
  //       console.log("in the else");
  //     }
  //   } catch (err) {
  //     console.log("in the catch");
  //   }
  // };
  useEffect(async () => {
    if (mobile && customers) {
      if ((mobile && mobile.length < 10) || (mobile && mobile.length > 10)) {
        setMobileMsg("Invalid Number");
      }
      if (mobile && mobile.length === 10) {
        setMobileMsg("");
        let findInCustomer =
          customers &&
          customers.filter((customer) => customer.mobileNumber === mobile);
        if (findInCustomer && findInCustomer.length > 0) {
          setMatched(true);
          setMatchedMsg("");
          formik.setFieldValue(
            "name",
            findInCustomer[0].firstName + " " + findInCustomer[0].lastName
          );
        } else {
          setMatched(false);
          setMatchedMsg("This Customer Does Not Exist");
          formik.setFieldValue("name", "");
        }
      } else {
        setMatched(false);
        formik.setFieldValue("name", "");
      }
    }
  }, [mobile]);

  useEffect(async () => {
    if (args) {
      args && args._id && setAppointmentId(args && args._id);
      args && args.mobile && setMobile(args.mobile);
      args &&
        args.StartTime &&
        formik.setFieldValue(
          "date",
          moment(args.StartTime).format("YYYY-MM-DD")
        );
      setAppointmentType(args.type ? args.type : "prebooking");
      setTimes(
        moment(
          moment(args.StartTime)._d ? moment(args.StartTime)._d : moment()._d
        ).format("HH:mm")
      );
      setDuration(
        moment(args.StartTime)._d ? moment(args.StartTime)._d : moment()._d
      );

      args &&
        args.StartTime &&
        formik.setFieldValue("time", moment(args.StartTime).format("HH:mm"));
      args &&
        args.name &&
        formik.setFieldValue("name", args.name) &&
        setMatched(true);
      args &&
        args.serviceId &&
        formik.setFieldValue("serviceId", args.serviceId);
      args &&
        args.staffId &&
        formik.setFieldValue(
          "staffId",
          args.staffId instanceof Array ? args && args.staffId[0] : args.staffId
        );
      args &&
        args.isPromotional &&
        formik.setFieldValue("isPromotional", args.isPromotional);
      args && args.type && formik.setFieldValue("type", args.type);
      args &&
        args.serviceId &&
        formik.setFieldValue("serviceId", args.serviceId);
      args &&
        args.serviceDetails &&
        args.serviceDetails.duration &&
        formik.setFieldValue("duration", args.serviceDetails.duration);
    }
  }, []);

  useEffect(async () => {
    if (multipleServices) {
      let test = document.getElementById("_dialog_wrapper");
      test.style.minWidth = "80%";
      test.style.height = "calc(100vh - 50px)";
    }
  }, [multipleServices]);

  const getAllServices = async (e) => {
    try {
      let res = await ApiGet("service/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setServices(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting services", err);
    }
  };

  const getAllStaff = async (e) => {
    try {
      let res = await ApiGet("staff/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setStaff(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting services", err);
    }
  };

  const getAllCustomers = async (values) => {
    try {
      let res = await ApiGet("customer/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  const validateMobile = async (data) => {
    let date1 = new Date(`${data.date} ${times}`);

    let storeEndISODate = new Date(`${data.date} ${storeTiming.endtime}`);
    let storeEndDate = moment(storeEndISODate).add(15, "minutes");
    let date2 = moment(date1);
    let apppointmentEndTime = moment(date2).add(data.duration, "minutes");
    var isValid = true;
    const today = new Date();
    let staffDetails = staff && staff.filter((obj) => obj._id === data.staffId);
    let dayInNumber = moment(data.date).day();
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

    if (
      staffDetails[0] &&
      staffDetails[0].workingDays &&
      staffDetails[0].workingDays.filter((obj) => obj.Day === day).length === 0
    ) {
      isValid = false;
      setStoreTimeMsg("Staff is on leave.");
    }
    let staffDayDetails =
      staffDetails[0] &&
      staffDetails[0].workingDays &&
      staffDetails[0].workingDays.filter((obj) => obj.Day === day);
    let staffEndISODate = new Date(
      `${data.date} ${staffDayDetails[0].endtime}`
    );
    let staffEndDate = moment(staffEndISODate).add(15, "minutes");
    let ISODate = new Date(`${data.date} ${times}`);
    if (ISODate <= today) {
      isValid = false;
      setTimeMsg("You can not add past date appointment");
    }
    if (storeEndDate < apppointmentEndTime) {
      isValid = false;
      setStoreTimeMsg("Store will be closed");
    }
    if (apppointmentEndTime > staffEndDate) {
      isValid = false;
      setStoreTimeMsg("Staff will be left");
    }
    if (storeTiming.starttime > times || storeTiming.endtime < times) {
      isValid = false;
      setStoreTimeMsg("Store Closed");
    } else if (
      !(staffDayDetails[0].starttime <= times) ||
      times >= staffDayDetails[0].endtime
    ) {
      isValid = false;
      setStoreTimeMsg("Staff Is Not Available At this Time");
    } else if (day === "Monday") {
      if (!workingDays.includes("Monday")) {
        isValid = false;
        setStoreTimeMsg("Store Closed At This Day");
      }
    } else if (day === "Tuesday") {
      if (!workingDays && workingDays.includes("Tuesday")) {
        isValid = false;
        setStoreTimeMsg("Store Closed At This Day");
      }
    } else if (day === "Wednesday") {
      if (!workingDays && workingDays.includes("Wednesday")) {
        isValid = false;
        setStoreTimeMsg("Store Closed At This Day");
      }
    } else if (day === "Thursday") {
      if (!workingDays && workingDays.includes("Thursday")) {
        isValid = false;
        setStoreTimeMsg("Store Closed At This Day");
      }
    } else if (day === "Friday") {
      if (!workingDays && workingDays.includes("Friday")) {
        isValid = false;
        setStoreTimeMsg("Store Closed At This Day");
      }
    } else if (day === "Saturday") {
      if (!workingDays && workingDays.includes("Saturday")) {
        isValid = false;
        setStoreTimeMsg("Store Closed At This Day");
      }
    } else if (day === "Sunday") {
      if (!workingDays && workingDays.includes("Sunday")) {
        isValid = false;
        setStoreTimeMsg("Store Closed At This Day");
      }
    } else {
      setStoreTimeMsg("");
    }
    if (!matched) {
      isValid = false;
    }
    if (!mobile) {
      setMobileMsg("* required");
      isValid = false;
    } else if (mobile) {
      if (!Boolean(mobile.trim())) {
        setMobileMsg("* required");
        isValid = false;
      }
    }

    let res = await ApiGet(
      "appointment/staff/" + userInfo.companyId + "/" + data.staffId
    );
    if (res.data.status === 200) {
      let futAppointments = res.data.data.appointmentList.filter(
        (apt) => new Date(apt.date) >= today
      );
      futAppointments &&
        futAppointments.map((apt) => {
          let endDate = moment(apt.date).add(apt.serviceId.duration, "minutes");
          endDate = moment(endDate).toISOString();
          let newDate = new Date(`${data.date} ${times} UTC`);
          newDate = moment(newDate).toISOString();
          if (newDate >= apt.date && newDate < endDate) {
            isValid = false;
            setStoreTimeMsg("Sorry! This Slot Is Already Booked");
          }
        });
    }

    if (multipleServices) {
      multipleServicesData &&
        multipleServicesData.map((service, index) => {
          let starttime = moment(service.date)
            .subtract("minute", 330)
            .format("HH:mm");
          let endtime = moment(service.date)
            .subtract("minute", 330)
            .add(service.time, "minutes")
            .format("HH:mm");
          if (editDeleteIndex === index) {
          } else {
            if (starttime < data.time && data.time < endtime) {
              isValid = false;
              setStoreTimeMsg("You Already Booked This Slot");
            }
          }
        });
    }
    return isValid;
  };

  const handleMultipleSubmit = async () => {
    props.addEvent(multipleServicesBodyData);
  };

  // const getStoreSetting = async (values) => {
  //   try {
  //     let res = await ApiGet("setting/company/" + userInfo.companyId);
  //     if (res.data.status === 200) {
  //       setStoreTiming(res?.data?.data[0]?.storeTiming[0]);
  //       setWorkingDays(res?.data?.data[0]?.workingDays);
  //     }
  //   } catch (err) {
  //     console.log("error while getting Forum", err);
  //   }
  // };

  useEffect(async () => {
    getSetting();
    getAllServices();
    getAllCustomers();
    if (userInfo && userInfo.role === "Staff") {
      let staffData = [];
      staffData.push(userInfo);
      setStaff(staffData);
    } else {
      getAllStaff();
    }
    getStoreSetting();
    setName1(args.name);
  }, []);

  const handleSubmit = async (values) => {
    let res = await ApiPost("customer/", values);
    try {
      if (res.data.status === 200) {
        getAllCustomers();
        setTimeout(() => {
          setName(res.data.data.firstName + " " + res.data.data.lastName);
          setMobile(res.data.data.mobileNumber);
        }, 1000);
        setMatchedMsg("");
        setMatched(true);
        toast.success("Added Successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
   
      } else {
        toast.warn(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
   
      }
    } catch (err) {
      toast.error("Something Went Wrong", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    }
  };

  const createAppointment = {
    name: "",
    mobile: 0,
    serviceId: "",
    staffId: "",
    date: "",
    time: "",
  };
  const [initialValues, setInitialValues] = useState(createAppointment);

  const appointmentSchema = Yup.object().shape({
    name: Yup.string().required("This Customer Does Not Exist"),
    // mobile: Yup.string().matches(phoneRegExp, 'Phone number is not valid').min(10).max(10).required("* required"),
    // serviceId: Yup.string().required("* required"),
    staffId: Yup.string().required("* required"),
    date: Yup.date().required("* required"),
    // time: Yup.string().required("* required"),
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

  const handleMultipleServices = async (lastTime) => {
    formik.setFieldValue("time", lastTime);
    formik.setFieldTouched("time", false);
    formik.setFieldValue("duration", "");
    formik.setFieldTouched("duration", false);
    formik.setFieldValue("staffId", "");
    formik.setFieldTouched("staffId", false);
    let serviceelement = document.getElementById("service");
    serviceelement.value = "";
    setTotalServices(multipleServicesData.length);
    let total = 0;
    multipleServicesData.map((apt) => {
      total = total + apt.serviceId[0].amount;
    });
    setTotalAmount(total);
  };

  const handleEdit = async (key) => {
    setEditDeleteIndex(key);
    setServiceId(multipleServicesBodyData[key].serviceId);
    setEditDeleteMultipleServiceData(multipleServicesData[key]);
    setEditDeleteMultipleServiceDataBody(multipleServicesBodyData[key]);
    let starttime = moment(multipleServicesBodyData[key].date)
      .subtract("minute", 330)
      .format("HH:mm");
    formik.setFieldValue("time", starttime);
    formik.setFieldTouched("time", false);
    let serviceelement = document.getElementById("service");
    serviceelement.value = multipleServicesBodyData[key].serviceId;
    formik.setFieldValue("duration", multipleServicesBodyData[key].time);
    formik.setFieldTouched("duration", false);

    // formik.setFieldValue("serviceId", multipleServicesBodyData[key].serviceId);
    // formik.setFieldTouched("serviceId", false);
    formik.setFieldValue("staffId", multipleServicesBodyData[key].staffId);
    formik.setFieldTouched("staffId", false);
  };

  const handleDelete = async (key) => {
    setEditDeleteIndex(key);
    setEditDeleteMultipleServiceData(multipleServicesData[key]);
    setEditDeleteMultipleServiceDataBody(multipleServicesBodyData[key]);

    let allAppointment = multipleServicesData;
    allAppointment.splice(key, 1);
    setMultipleServicesData(allAppointment);
    setEditDeleteMultipleServiceData([]);

    let allAppointmentBody = multipleServicesBodyData;
    allAppointmentBody.splice(key, 1);
    setMultipleServicesBodyData(allAppointmentBody);
    setEditDeleteMultipleServiceDataBody([]);

    let total = 0;
    allAppointment.map((apt) => {
      total = total + apt.serviceId[0].amount;
    });
    setTotalAmount(total);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: appointmentSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      let isValid = await validateMobile(values);
      if (isValid) {
        setTimeMsg("");
        setStoreTimeMsg("");
        setMobileMsg("");
        let staffName =
          staff &&
          staff.filter((staffData) => staffData._id === values.staffId);
        const staff_name = `${staffName[0] && staffName[0].firstName} ${
          staffName[0] && staffName[0].lastName
        }`;
        if (multipleClicked === true) {
          let serviceObject =
            services && services.filter((serv) => serv._id === serviceId);
          let staffObject =
            staff &&
            staff.filter((staffData) => staffData._id === values.staffId);
          const staf_name = `${staffObject[0] && staffObject[0].firstName} ${
            staffObject[0] && staffObject[0].lastName
          }`;

          let ISODate = new Date(`${values.date} ${times} UTC`);
          let data1 = {
            // name: values.name,
            name: name ? name : name1,
            mobile: mobile,
            type: appointmentType,
            serviceId: serviceObject,
            time: values.duration,
            staffId: staffObject,
            staff: staf_name,
            date: moment(ISODate).subtract("minute", 0),
            isPromotional: isConfirmationSMS,
            companyId: userInfo.companyId,
            status: 1,
            uuid: uuid,
          };
          let data = {
            // name: values.name,
            name: name ? name : name1,
            mobile: mobile,
            type: appointmentType,
            serviceId: serviceId,
            time: values.duration,
            staffId: values.staffId,
            staff: staf_name,
            date: moment(ISODate).subtract("minute", 0),
            isPromotional: isConfirmationSMS,
            companyId: userInfo.companyId,
            status: 1,
            uuid: uuid,
          };
          if (
            editDeleteMultipleServiceData &&
            editDeleteMultipleServiceData.length === 0
          ) {
            let allAppointment = multipleServicesData;
            allAppointment.push(data1);
            setMultipleServicesData(allAppointment);
            setServiceId("");
          } else {
            let allAppointment = multipleServicesData;
            allAppointment.splice(editDeleteIndex, 1);
            allAppointment.splice(editDeleteIndex, 0, data1);
            setMultipleServicesData(allAppointment);
            setEditDeleteMultipleServiceData([]);
            setServiceId("");
          }

          if (
            editDeleteMultipleServiceDataBody &&
            editDeleteMultipleServiceDataBody.length === 0
          ) {
            let allAppointmentBody = multipleServicesBodyData;
            allAppointmentBody.push(data);
            setMultipleServices(true);
            setServiceId("");
            setMultipleServicesBodyData(allAppointmentBody);
          } else {
            let allAppointmentBody = multipleServicesBodyData;
            allAppointmentBody.splice(editDeleteIndex, 1);
            allAppointmentBody.splice(editDeleteIndex, 0, data);
            setMultipleServicesBodyData(allAppointmentBody);
            setServiceId("");
            setEditDeleteMultipleServiceDataBody([]);
          }

          let lastTime = moment(data1.date)
            .subtract("minute", 330)
            .add(data1.time, "minutes")
            .format("HH:mm");
          setNextSlotTime(lastTime);
          handleMultipleServices(lastTime);
          setDuration(
            moment(values.date).add(times).add(data.time, "minutes")._d
          );
          setTimes(
            moment(
              moment(values.date).add(times).add(data.time, "minutes")._d
            ).format("HH:mm")
          );
        } else if (appointmentId) {
          let ISODate = new Date(`${values.date} ${times} UTC`);

          let data = {
            _id: appointmentId,
            name: name,
            mobile: mobile,
            time: values.duration,
            type: appointmentType,
            serviceId: serviceId,
            staff: staff_name,
            staffId: values.staffId,
            date: moment(ISODate).subtract("minute", 0),
            isPromotional: isConfirmationSMS,
            companyId: userInfo.companyId,
            status: 1,
            uuid: uuid,
          };

          props.addEvent(data);
        } else {
          let ISODate = new Date(`${values.date} ${values.time} UTC`);
          let data = {
            name: name,
            mobile: mobile,
            type: appointmentType,
            time: values.duration,
            serviceId: serviceId,
            staff: staff_name,
            staffId: values.staffId,
            date: moment(ISODate).subtract("minute", 0),
            isPromotional: isConfirmationSMS,
            companyId: userInfo.companyId,
            status: 1,
            uuid: uuid,
          };
          props.addEvent(data);
        }
      }
    },
  });

  const handleService = (selectedLevel) => {
    setServiceId(selectedLevel.value);

    let serviceData =
      services && services.filter((serv) => serv._id === selectedLevel.value);

    if (serviceData.length) {
      formik.setFieldValue("duration", serviceData[0].duration);
    } else {
      formik.setFieldValue("duration", "");
    }
    setServ(selectedLevel.value);
  };

  const searchServices = services.map((service) => {
    return Object.assign(
      {},
      {
        value: service._id,
        label: `${service.serviceName} - {SettingInfo?.currentType} ${service.amount}`,
      }
    );
  });
  const SuggestMobileNumber = async (value) => {
    try {
      setTextValue(value);
      setMobile(value);
      // setName(value)
      setName("");
      setName1("");
      if (value) {
        let res = await ApiGet(
          "customer/company/search/" + userInfo.companyId + `?text=${value}`
        );
        if (res.data.status === 200) {
          setFilteredData(res.data.data);
        }
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };
  const SaveNumber = (value) => {
    setMobile(value.mobileNumber);
    setName(value.firstName + " " + (value.lastName ? value.lastName : ""));
    setTextValue("");
  };

  const SuggestName = async (value) => {
    try {
      setTextValue1(value);
      setName(value);
      setMobile("");
      if (value) {
        let res = await ApiGet(
          "customer/company/search/" + userInfo.companyId + `?text=${value}`
        );
        if (res.data.status === 200) {
          setFilteredData1(res.data.data);
        }
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  const SaveName = (value) => {
    setMobile(value.mobileNumber);
    setName(value.firstName + " " + (value.lastName ? value.lastName : ""));
    setTextValue1("");
  };

  return (
    <div className="md:flex">
      <div
        className={
          multipleServices ? "md:w-2/5 appotment-right-border" : "md:w-full"
        }
      >
        <div class="overflow-hidden sm:rounded-md">
          {createCustomerModal && (
            <CreateCustomer
              mobile={mobile}
              isOpen={createCustomerModal}
              toggle={() => {
                setCreateCustomerModal((e) => !e);
              }}
              handleSubmit={(values) => handleSubmit(values)}
            />
          )}
          <div class="px-4 py-5 sm:p-6 sm:pt-4">
            <div class="grid grid-cols-12">
              <div class="col-span-6 sm:col-span-12 p-2 pl-0 cus-add-font pt-0">
                <div className="flex items-center">
                  <div>
                    <Radio
                      checked={appointmentType === "walkin"}
                      onChange={handleRadioChange}
                      value="walkin"
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "A" }}
                    />
                    <span className="radio-btn-label-color font-size-18 tracking-normal font-bold">
                      Walk- In
                    </span>
                  </div>
                  <div>
                    <Radio
                      checked={appointmentType === "prebooking"}
                      onChange={handleRadioChange}
                      value="prebooking"
                      name="radio-button-demo"
                      inputProps={{ "aria-label": "B" }}
                    />
                    <span className="radio-btn-label-color font-size-18 tracking-normal font-bold">
                      Pre-booking
                    </span>
                    {formik.touched.serviceName && formik.errors.serviceName ? (
                      <span className="text-red-500 font-size-12 pl-2">
                        {formik.errors.serviceName}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div class="col-span-6 sm:col-span-12 p-2">
                <div>
                  <label
                    for="mobile"
                    class="block mb-2  font-medium radio-btn-label-color font-bold font-size-18"
                  >
                    Mobile Number
                  </label>
                  <div className="modal-search-grid">
                    <div className="relative">
                      <input
                        type="number"
                        maxlength="10"
                        name="mobile"
                        id="mobile"
                        className="w-full py-2 dark-text-color font-medium pl-2 serchbar-style"
                        onChange={(e) => SuggestMobileNumber(e.target.value)}
                        value={mobile}
                      />
                      {filteredData.length != 0 && textValue != "" && (
                        <div className="dataResult">
                          {filteredData.slice(0, 15).map((value) => {
                            return (
                              <>
                                <div
                                  key={value._id}
                                  onClick={() => {
                                    SaveNumber(value);
                                  }}
                                >
                                  <div className="mobile-number-list-style">
                                    <p className="custome-font tracking-normal heading-title-text-color">
                                      {value.firstName + " " + value.lastName}
                                    </p>
                                    <span className="custome-font font-medium tracking-normal mb-0 block heading-title-text-color">
                                      {" "}
                                      {value.mobileNumber}
                                    </span>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className="plus-number flex items-center justify-center"
                        style={{ opacity: matched ? "0.4" : "1" }}
                        onClick={
                          !matched
                            ? () => {
                                setCreateCustomerModal((e) => !e);
                              }
                            : ""
                        }
                      >
                        <i class="fas fa-plus"></i>
                      </div>
                    </div>
                  </div>
                </div>
                {mobileMsg ? (
                  <span className="text-red-500 font-size-12 pl-2">
                    {mobileMsg}
                  </span>
                ) : null}
              </div>

              <div class="col-span-6 sm:col-span-12 p-2">
                <label
                  for="name"
                  class="block mb-2  font-medium radio-btn-label-color font-bold font-size-18"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size ${getInputClasses(
                    "name"
                  )}`}
                  autocomplete="given-name"
                  onChange={(e) => SuggestName(e.target.value)}
                  value={name ? name : name1}
                />
                {filteredData1.length != 0 && textValue1 != "" && (
                  <div className="dataResult1">
                    {filteredData1.slice(0, 15).map((value) => {
                      return (
                        <>
                          <div
                            key={value._id}
                            onClick={() => {
                              SaveName(value);
                            }}
                          >
                            <div className="mobile-number-list-style">
                              <p className="custome-font tracking-normal heading-title-text-color">
                                {value.firstName + " " + value.lastName}
                              </p>
                              <span className="custome-font font-medium tracking-normal mb-0 block heading-title-text-color">
                                {" "}
                                {value.mobileNumber}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
                {formik.touched.name && formik.errors.name ? (
                  <span className="text-red-500 font-size-12 pl-2">
                    {formik.errors.name}
                  </span>
                ) : null}
              </div>
              <div class="col-span-6 sm:col-span-6 p-2">
                <label
                  for="date"
                  class="mb-2 block  font-medium radio-btn-label-color font-bold font-size-18"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  autocomplete="given-name"
                  className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                    "date"
                  )}`}
                  {...formik.getFieldProps("date")}
                />
                {/* <span class="z-10  leading-snug font-normal text-center text-gray-400 absolute bg-transparent rounded  items-center justify-center  pr-3 py-3">
                                                        MINS
                                                    </span> */}
                {formik.touched.date && formik.errors.date ? (
                  <span className="text-red-500 font-size-12 pl-2">
                    {formik.errors.date}
                  </span>
                ) : null}
                {timeMsg && (
                  <span className="text-red-500 font-size-12 w-full">
                    {timeMsg}
                  </span>
                )}
              </div>
              <div class="col-span-6 sm:col-span-6 p-2">
                <label
                  for="time"
                  class="mb-2 block  font-medium radio-btn-label-color font-bold font-size-18"
                >
                  Choose Time
                </label>
                <div className="date-appointment-input">
                  <div className="">
                    <div className="">
                      <DatePicker
                        selected={duration}
                        onChange={(date) => changeDuration(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                      />
                      {formik.touched.time && formik.errors.time ? (
                        <span className="text-red-500 font-size-12 pl-2">
                          {formik.errors.time}
                        </span>
                      ) : null}
                      {storeTimeMsg && (
                        <span className="text-red-500 font-size-12 w-full">
                          {storeTimeMsg}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {service ? (
                <>
                  <div class="col-span-6 sm:col-span-6 p-2">
                    <div className="mb-2 flex items-center">
                      <label
                        for="serviceId"
                        class="block font-medium radio-btn-label-color font-bold font-size-18"
                      >
                        Select Service
                      </label>
                      {formik.touched.serviceId && formik.errors.serviceId ? (
                        <span className="text-red-500 text-sm pl-2 block">
                          {formik.errors.serviceId}
                        </span>
                      ) : null}
                    </div>

                    <Select
                      name="cars"
                      id="service"
                      value={searchServices.filter(
                        (option) => option.value == serv
                      )}
                      placeholder="Search"
                      styles={selectStyles}
                      maxMenuHeight={170}
                      // className="dropdown2 w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size"
                      onChange={handleService}
                      options={searchServices}
                    >
                      {/* <option clasName="font-size-18 heading-title-text-color font-medium" ></option>
                  {services.length > 0 &&
                    services.map((service) => {
                      return (
                        <option
                          className="font-size-18 heading-title-text-color font-medium"
                          value={service._id}
                          >
                          {service.serviceName} - {SettingInfo?.currentType}{" "}
                          {service.amount}{" "}
                        </option>
                      );
                    })} */}
                    </Select>
                  </div>

                  <div class="col-span-6 sm:col-span-6 p-2">
                    <div>
                      <div className="flex items-center mb-2">
                        <label
                          for="mobile"
                          className="block font-medium radio-btn-label-color font-bold font-size-18"
                        >
                          Duration
                        </label>

                        <span className="text-red-500 text-sm pl-2"></span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="duration"
                          id="duration"
                          className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size ${getInputClasses(
                            "duration"
                          )}`}
                          {...formik.getFieldProps("duration")}
                        />
                        <div></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {staffs ? (
                <div class="col-span-6 sm:col-span-12 p-2">
                  <label
                    for="staffId"
                    class="mb-2 block  font-medium radio-btn-label-color font-bold font-size-18"
                  >
                    Select Staff
                  </label>
                  <select
                    name="cars"
                    id="cars"
                    className={`w-full dropdown7 py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                      "staffId"
                    )}`}
                    {...formik.getFieldProps("staffId")}
                  >
                    <option clasName="font-size-18 heading-title-text-color font-medium"></option>

                    {staff.length > 0 &&
                      staff.map((staf) => {
                        return (
                          <option
                            key={staf._id}
                            className="font-size-18 heading-title-text-color font-medium"
                            value={staf._id}
                          >
                            {staf.firstName} {staf.lastName}
                          </option>
                        );
                      })}
                  </select>
                  {formik.touched.staffId && formik.errors.staffId ? (
                    <span className="text-red-500 font-size-12 pl-2 block">
                      {formik.errors.staffId}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div class="col-span-12 sm:col-span-12 p-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class={`form-checkbox `}
                    // checked={isConfirmationSMS}
                    onChange={() => {
                      setIsConfirmationSMS(!isConfirmationSMS);
                    }}
                    checked={isConfirmationSMS ? isConfirmationSMS : false}
                  /> 
                  <span class="ml-2">Confirmation/Reminder SMS</span>
                  {formik.touched.isPromotional &&
                  formik.errors.isPromotional ? (
                    <span className="text-red-500 font-size-12 pl-2">
                      {formik.errors.isPromotional}
                    </span>
                  ) : null}
                </label>
              </div>

              <div
                class="col-span-12 sm:col-span-12 p-2"
                style={{ display: appointmentId ? "none" : "block" }}
              >
                <div
                  className={
                    "flex cursor-pointer " +
                    (multipleServices ? "justify-center mt-5" : "justify-end")
                  }
                >
                  <div
                    className="flex items-center plus-img-modal"
                    onClick={(e) => {
                      setMultipleClicked(true);
                      formik.handleSubmit();
                    }}
                  >
                    <img
                      src={require("../../../assets/img/Plus.png").default}
                    />
                    <span className="font-size-20 pl-2 dark-text-color tracking-normal font-medium">
                      Add Multiple Service
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {matchedMsg && (
            <span className="text-red-500 font-size-12 pl-8">{matchedMsg}</span>
          )}
          {appointmentId ? (
            <div
              className="flex items-center justify-
         p-6 rounded-b"
            >
              <button
                type="submit"
                onClick={formik.handleSubmit}
                className="mr-remove cus-medium-btn  btn-bottom
                                          font-size-16 font-medium 
                                          tracking-normal white-text-color
                                           tracking-normal cursor-pointer"
                style={{ transition: "all .15s ease" }}
                disabled={formik.isSubmitting}
                // onClick={matched && formik.handleSubmit}
              >
                Reschedule
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 rounded-b">
              <button
                type="submit"
                onClick={formik.handleSubmit}
                className="mr-remove cus-medium-btn  btn-bottom
                                            font-size-16 font-medium 
                                            tracking-normal white-text-color
                                             tracking-normal cursor-pointer"
                style={{
                  transition: "all .15s ease",
                  display: multipleServices ? "none" : "block",
                }}
                disabled={formik.isSubmitting}
                // onClick={matched && formik.handleSubmit}
              >
                Book Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="md:w-3/5 pl-10 pr-4"
        style={{ display: multipleServices ? "block" : "none" }}
      >
        <div className="md:flex">
          <div className="md:w-full modal-subheading-height mb-3">
            <div className="flex items-center">
              <img src={require("../../../assets/img/new-c.png").default} />
              <span className="font-size-20 heading-title-text-color font-bold tracking-normal pl-4">
                {multipleServicesData && multipleServicesData.length
                  ? multipleServicesData[0] &&
                    new Date(multipleServicesData[0].date).toDateString()
                  : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="table-timline-height">
          <div className="timeline-table">
            <table style={{ width: "100%", height: "10vh" }}>
              {multipleServicesData && multipleServicesData.length
                ? multipleServicesData.map((apt, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div
                            className={
                              "timeline " +
                              (index === 0 ? "timeline-start" : "")
                            }
                          >
                            <div class="a"></div>
                            <div class="b-small">{index + 1}</div>
                            <div class="c"></div>
                          </div>
                        </td>
                        <td className="details-hover relative">
                          <div className="md:flex">
                            <div className="md:w-2/5 pr-3">
                              <div className="flex items-center clock-modal-img">
                                <img
                                  src={
                                    require("../../../assets/img/new-clock.png")
                                      .default
                                  }
                                />
                                <span className="font-size-20 heading-title-text-color font-medium tracking-normal pl-4">
                                  {apt &&
                                    moment(apt.date)
                                      .subtract("minute", 330)
                                      .format("hh:mm a")}{" "}
                                  -
                                  {apt &&
                                    moment(apt.date)
                                      .subtract("minute", 330)
                                      // .add(apt.serviceId[0].duration, "minutes")
                                      .format("hh:mm a")}
                                  {/* 4:30 PM - 5:10 PM */}
                                </span>
                              </div>
                            </div>
                            <div className="md:w-2/5 pr-3">
                              <div className="flex items-center modal-sec-img">
                                <img
                                  src={
                                    require("../../../assets/img/modal.png")
                                      .default
                                  }
                                />
                                <span className="font-size-20 heading-title-text-color font-medium tracking-normal pl-4">
                                  {apt &&
                                    apt.serviceId[0] &&
                                    apt.serviceId[0].serviceName}
                                </span>
                              </div>
                              <div className="flex items-center modal-contact pt-1">
                                <img
                                  src={
                                    require("../../../assets/img/Vector (1).png")
                                      .default
                                  }
                                />
                                <span className="font-size-20 heading-title-text-color font-medium tracking-normal pl-4">
                                  {apt &&
                                    apt.staffId[0] &&
                                    apt.staffId[0].firstName +
                                      " " +
                                      apt.staffId[0].lastName}
                                </span>
                              </div>
                            </div>
                            <div className="md:w-1/5 pl-3">
                              <div className="flex justify-end">
                                <p className="font-medium tracking-normal rs-font heading-title-text-color pt-4 mb-0 font-size-22">
                                  {SettingInfo?.currentType}
                                  <span className="font-medium">
                                    {apt &&
                                      apt.serviceId[0] &&
                                      apt.serviceId[0].amount}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="timeline-option">
                            <div className="flex items-center">
                              <div
                                className="data-delete mr-5 flex items-center justify-center"
                                onClick={() => handleEdit(index)}
                              >
                                <img
                                  src={
                                    require("../../../assets/img/t-en.png")
                                      .default
                                  }
                                />
                              </div>
                              <div
                                className="data-delete flex items-center justify-center"
                                onClick={() => handleDelete(index)}
                              >
                                <img
                                  src={
                                    require("../../../assets/img/timeline-delete.png")
                                      .default
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : "No Appointment Booking"}
            </table>
          </div>
        </div>
        <div className="md:flex">
          <div className="md:w-full">
            <div className="flex items-center justify-between">
              <div>
                {/* <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                                                                Total services
                                        <span className="font-bold"> - {totalServices}</span>
                                                            </p> */}
                <p className="font-size-20 heading-title-text-color font-medium tracking-normal mb-0">
                  Total amount
                  <span className="font-bold"> - {totalAmount}</span>
                </p>
              </div>
              <div>
                <button
                  className="book-app-btn font-size-20 tracking-normal white-text-color font-medium text-center"
                  onClick={() => handleMultipleSubmit()}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
