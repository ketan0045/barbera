import React, { useState, useEffect, useRef } from "react";
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
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import "../Scheduler/index.css";
import { AppsOutlined } from "@material-ui/icons";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const selectStyles = {
  control: (styles) => ({
    ...styles,
    fontFamily: "'Poppins', sans-serif",
    borderColor: "none !important",
    color: "#193566",
    borderRadius: "8px !important",
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
      fontWeight: "500",
      background: "#ECF0F3 !important",
      backgroundColor: data.isDisabled
        ? null
        : data.isSelected
        ? "#d1d9e6"
        : data.isFocused
        ? "#d1d9e6"
        : null,
      "&:hover": {
        background: "#d1d9e6 !important",
      },
      color: data.isDisabled ? "#ccc" : data.isSelected ? "#193566" : "#193566",
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
  indicatorContainer: (styles) => ({ ...styles, color: "#ff0000 !important" }),
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

const RescheduleModal = (props) => {
  const {
    modal,
    toggle,
    object,
    getAll,
    details,
    appointmentList,
    appointment,
    toggle1,
    SettingInfo
  } = props;

  const { buttonLabel, className } = props;
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [appointmentType, setAppointmentType] = useState("prebooking");
  const [isConfirmationSMS, setIsConfirmationSMS] = useState(true);
  const [customers, setCustomers] = useState();
  const [mobile, setMobile] = useState();
  const [matched, setMatched] = useState(false);
  const [mobileMsg, setMobileMsg] = useState("");
  const [workingDays, setWorkingDays] = useState();
  const [timeMsg, setTimeMsg] = useState("");
  const [storeTimeMsg, setStoreTimeMsg] = useState("");
  const [storeTiming, setStoreTiming] = useState();
  const [matchedMsg, setMatchedMsg] = useState("");
  const [slotError, setSlotError] = useState("");
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [multipleServices, setMultipleServices] = useState(false);
  const [multipleServicesData, setMultipleServicesData] = useState([]);
  const [multipleServicesBodyData, setMultipleServicesBodyData] = useState([]);
  const [multipleClicked, setMultipleClicked] = useState(false);
  const [totalServices, setTotalServices] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [nextSlotTime, setNextSlotTime] = useState();
  const [firstTime, setFirstTime] = useState();
  const [serviceId, setServiceId] = useState();
  const [appointmentId, setAppointmentId] = useState();
  const [editDeleteMultipleServiceData, setEditDeleteMultipleServiceData] =
    useState([]);
  const [
    editDeleteMultipleServiceDataBody,
    setEditDeleteMultipleServiceDataBody,
  ] = useState([]);
  const [editDeleteIndex, setEditDeleteIndex] = useState(0);
  const [mobileno, setMobileno] = useState();
  const [name, setName] = useState();
  const [ser, setSer] = useState(
    object && object.serviceId ? object && object.serviceId : ""
  );
  const [textValue, setTextValue] = useState("");
  const [textValue1, setTextValue1] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [duration, setDuration] = useState();
  const [uuid, setUuid] = useState();
  const [date, setDate] = useState();

  const [times, setTimes] = useState();
  const [able, setAble] = useState(false);

  const formikRef = useRef(null);

  const userInfo = Auth.getUserDetail();
  const amountFilter = appointmentData
    .map((item) => item.serviceId && item.serviceId.amount)
    .reduce((prev, curr) => prev + curr, 0);
  const handleRadioChange = (event) => {
    setAppointmentType(event.target.value);
    if (event.target.value === "walkin") {
      // formik.setFieldValue("date", moment().format("YYYY-MM-DD"));
      // formik.setFieldValue("time", moment().format("HH:mm"));
    } else {
      // formik.setFieldValue("date", null);
      // formik.setFieldValue("time", null);
    }
  };
  let i = 1;
  const changeDuration = (data) => {
    setDuration(data);
    setAble(true);
    setTimes(moment(data).format("HH:mm"));
  };
  // const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;
  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

  useEffect(async () => {
    if (mobile) {
      if ((mobile && mobile.length < 10) || (mobile && mobile.length > 10)) {
        setMobileMsg("Invalid Number");
      }
      if (mobile && mobile.length === 10) {
        setMobileMsg("");
        let findInCustomer = customers.filter(
          (customer) => customer.mobileNumber === mobile
        );
        if (findInCustomer.length > 0) {
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

  const ChangeinDate = (e) => {
    setDate(e.target.value);
    setAble(true);
  };

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

  const getStoreSetting = async (values) => {
    try {
      let res = await ApiGet("setting/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setStoreTiming(res?.data?.data[0]?.storeTiming[0]);
        setWorkingDays(res?.data?.data[0]?.workingDays);
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  const handleEdit = async (key) => {
    setEditDeleteIndex(key);
    setServiceId(multipleServicesBodyData[key]?.serviceId);
    setEditDeleteMultipleServiceData(multipleServicesData[key]);
    setEditDeleteMultipleServiceDataBody(multipleServicesBodyData[key]);
    let starttime = moment(multipleServicesBodyData[key].date)
      .subtract("minute", 330)
      .format("HH:mm");
    // formik.setFieldValue("time", starttime);

    formik.setFieldTouched("time", false);
    let serviceelement = document.getElementById("service");
    serviceelement.value = multipleServicesBodyData[key].serviceId;
    // formik.setFieldValue("duration", multipleServicesBodyData[key].time);
    formik.setFieldTouched("duration", false);

    // formik.setFieldValue("serviceId", multipleServicesBodyData[key].serviceId);
    // formik.setFieldTouched("serviceId", false);
    // formik.setFieldValue("staffId", multipleServicesBodyData[key].staffId);
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

  const validateMobile = async (data) => {
    let date1 = new Date(`${date} ${times}`);
    let storeEndISODate = new Date(`${date} ${storeTiming.endtime}`);
    let storeEndDate = moment(storeEndISODate).add(15, "minutes");
    let date2 = moment(date1);
    let apppointmentEndTime = moment(date2).add(data.duration, "minutes");

    var isValid = true;

    const today = new Date();
    let staffDetails = staff && staff.filter((obj) => obj._id === data.staffId);
    let dayInNumber = moment(date).day();
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
    let staffEndISODate = new Date(`${date} ${staffDayDetails[0].endtime}`);
    let staffEndDate = moment(staffEndISODate).add(15, "minutes");
    let ISODate = new Date(`${date} ${times}`);
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

    // if (!matched) {
    //   isValid = false;
    // }

    if (mobile) {
      if (!mobile) {
        setMobileMsg("* required");
        isValid = false;
      } else if (mobile) {
        if (!Boolean(mobile.trim())) {
          setMobileMsg("* required");
          isValid = false;
        }
      }
    }

    // else{
    //     if (!mobileno) {
    //         setMobileMsg("* required");
    //         isValid = false;
    //     } else if (mobileno) {
    //         if (!Boolean(mobileno.trim())) {
    //             setMobileMsg("* required");
    //             isValid = false;
    //         }
    //     }
    // }

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
          let newDate = new Date(`${date} ${times} UTC`);
          newDate = moment(newDate).toISOString();
          if (mobileno !== apt.mobile) {
            if (newDate >= apt.date && newDate <= endDate) {
              isValid = false;
              setStoreTimeMsg("Sorry! This Slot Is Already Booked");
            }
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

  useEffect(async () => {
    setAppointmentData(
      appointmentList.filter((apt) => apt.uuid == appointment.uuid)
    );

    setAppointmentType(appointment.type);
    setDate(moment.utc(appointment && appointment.date).format("YYYY-MM-DD"));
    // formik.setFieldValue(
    //   "date",
    //   moment.utc(appointment && appointment.date).format("YYYY-MM-DD")
    // );
    formik.setFieldValue(
      "duration",
      appointment.serviceId && appointment.serviceId.duration
    );

    formik.setFieldValue(
      "staffId",
      appointment.staffId && appointment.staffId._id
    );

    setDuration(moment(appointment.date).subtract("minute", 330)._d);
    setTimes(
      moment(moment(appointment.date).subtract("minute", 330)._d).format(
        "HH:mm"
      )
    );
    setServiceId(appointment.serviceId && appointment.serviceId._id);
    setAppointmentId(appointment._id);
    setUuid(appointment.uuid);
    // formik.setFieldValue(
    //   "staffId",
    //  appointment.staff
    // );
    formik.setFieldValue(
      "time",
      moment.utc(appointment && appointment.date).format("HH:mm")
    );

    if (userInfo && userInfo.role === "Staff") {
      let staffData = [];
      staffData.push(userInfo);
      setStaff(staffData);
    } else {
      getAllStaff();
    }
    getAllServices();
    getAllCustomers();
    getStoreSetting();
    setMobileno(appointment && appointment.mobile);
    // setMobileno(details && details.mobileNumber);
    // const fullname = `${details && details.firstName} ${
    //   details && details.lastName
    // } `;

    setName(appointment && appointment.name);

    setSer(appointment.serviceId && appointment.serviceId._id);

    // if (details && details.mobileNumber) {
    //   setMatched(true);
    // }
  }, []);

  const handleMultipleServices = async (lastTime) => {
    formik.setFieldValue("time", lastTime);
    formik.setFieldTouched("time", false);
    // formik.setFieldValue("duration", "");
    formik.setFieldTouched("duration", false);
    // formik.setFieldValue("staffId", "");
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

  const handleMultipleSubmit = async () => {
    try {
      let res = await ApiPost("appointment/", multipleServicesBodyData);
      if (res.data.status === 200) {
       
        toggle();
      } else {
        
      }
    } catch (err) {
      toggle();
     
    }
  };

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
    name: details && details.firstName + " " + details.lastName,
    mobile: details && details.mobileNumber,
    serviceId: object && object.serviceId,
    staffId: object && object.staffId,
    date: object && object.date,
    time: object && object.time,
  };
  const [initialValues, setInitialValues] = useState(createAppointment);

  const appointmentSchema = Yup.object().shape({
    // name: Yup.string().required("* required"),
    duration: Yup.string().required("* required"),
    // mobile: Yup.string().matches(phoneRegExp, 'Phone number is not valid').min(10).max(10).required("* required"),
    // serviceId: Yup.string().required("* required"),
    staffId: Yup.string().required("* required"),
    // date: Yup.date().required("* required"),
    time: Yup.string().required("* required"),
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

  const formik = useFormik({
    initialValues,

    validationSchema: appointmentSchema,
    enableReinitialize: true,
    innerRef: formikRef,
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

        if (appointmentData.length > 1) {
          let ISODate = new Date(`${date} ${times} UTC`);

          let newdate = "";
          appointmentData.map((apt, i) => {
            let data = {
              _id: apt._id,
              name: name,
              mobile: mobile ? mobile : mobileno,
              time: apt.time,
              type: apt.type,
              serviceId: apt.serviceId._id,
              staff: apt.staff,
              staffId: apt.staffId._id,
              date:
                i > 0
                  ? moment(ISODate).add("minute", newdate)
                  : moment(ISODate).subtract("minute", 0),
              isPromotional: true,
              companyId: apt.companyId,
              status: 1,
              uuid: apt.uuid,
            };
            ISODate = moment(ISODate).add("minute", newdate);
            newdate = apt.time;

            ApiPut("appointment/" + data._id, data)
              .then((res) => {
                if (res.data.status === 200) {
                  if (i === 0) {
                    toast.success("Updated Successfully", {
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

                  toggle();
                }
              })
              .catch((err) => {
                toast.error("Error", {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              });
          });
        } else if (appointmentId) {
          let ISODate = new Date(`${date} ${times} UTC`);

          let data = {
            _id: appointmentId,
            name: name,
            mobile: mobile ? mobile : mobileno,
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

          if (data._id) {
            ApiPut("appointment/" + data._id, data)
              .then((res) => {
                if (res.data.status === 200) {
                  toast.success("Updated Successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });

                
                  toggle();
                  // window.location.reload()
                }
              })
              .catch((err) => {
                toast.error("Error", {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              });
          }
        } else {
          let ISODate = new Date(`${date} ${values.time} `);

          let data = {
            name: name,
            mobile: mobile,
            type: appointmentType,
            time: values.duration,
            serviceId: serviceId,
            staffId: values.staffId,
            date: moment(ISODate).subtract("minute", 0),
            isPromotional: isConfirmationSMS,
            companyId: userInfo.companyId,
            status: 1,
          };
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
    setSer(selectedLevel.value);
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
      setMobileno(value);
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
    setName(value.firstName);
    setTextValue("");
  };

  const SuggestName = async (value) => {
    try {
      setTextValue1(value);
      // setMobile(value)
      setName(value);

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
    setName(value.firstName);
    setTextValue1("");
  };

  return (
    <div>
      {modal ? (
        <>
          <div className="">
            <div className="animation justify-center items-center mx-auto flex oflex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
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
              <div
                className={
                  "relative w-auto my-6 mx-auto " +
                  "multiple-Appointment-modal-width"
                }
              >
                {/*content*/}
                <div
                  className={
                    "border-0 rounded-lg shadow-lg relative flex flex-col w-full staff-add-banner outline-none focus:outline-none modalHeight " +
                    "multipal-appoitment-height-modal"
                  }
                >
                  {/*header*/}
                  <div className="flex items-start items-center justify-between pt-5 pl-5 pr-5 pb-2 rounded-t">
                    <h3 className="font-size-30 font-bold font-20 tracking-normal heading-title-text-color mb-0 cursor-pointer">
                      Edit Appointment
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => {
                        setInitialValues(createAppointment);
                        toggle(false);
                      }}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        <img
                          className="close-mini"
                          src={
                            require("../../../assets/img/Cancel.png").default
                          }
                        />
                      </span>
                    </button>
                  </div>
                  <div className="md:flex">
                    <div className={"md:w-2/5 appotment-right-border"}>
                      <form innerRef={formikRef}>
                        {/*body*/}
                        <div class="overflow-hidden sm:rounded-md">
                          <div class="pl-5 pr-5">
                            <div className="md:flex">
                              <div className="md:w-full mb-3">
                                <Radio
                                  checked={appointmentType === "walkin"}
                                  onChange={handleRadioChange}
                                  value="walkin"
                                  name="radio-button-demo"
                                  inputProps={{ "aria-label": "A" }}
                                  disabled={true}
                                />
                                Walk- In
                                <Radio
                                  checked={appointmentType === "prebooking"}
                                  onChange={handleRadioChange}
                                  value="prebooking"
                                  name="radio-button-demo"
                                  inputProps={{ "aria-label": "B" }}
                                  disabled={true}
                                />
                                Pre-booking
                                {formik.touched.serviceName &&
                                formik.errors.serviceName ? (
                                  <span className="text-red-500 text-sm pl-2">
                                    {formik.errors.serviceName}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div class="grid grid-cols-12">
                              <div class="col-span-6 sm:col-span-12 p-2">
                                <div>
                                  <div className="flex items-center mb-2">
                                    <label
                                      for="mobile"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Mobile Number
                                    </label>
                                    {mobileMsg ? (
                                      <span className="text-red-500 text-sm pl-2">
                                        {mobileMsg}
                                      </span>
                                    ) : null}
                                  </div>

                                  <div className="modal-search-grid">
                                    <div className="relative">
                                      <input
                                        type="text"
                                        maxlength="10"
                                        name="mobile"
                                        id="mobile"
                                        className="w-full py-2 dark-text-color font-medium pl-2 serchbar-style"
                                        value={mobile ? mobile : mobileno}
                                        disabled={true}
                                        onChange={(e) =>
                                          SuggestMobileNumber(e.target.value)
                                        }
                                      />
                                      {filteredData.length != 0 &&
                                        textValue != "" && (
                                          <div className="dataResult">
                                            {filteredData
                                              .slice(0, 15)
                                              .map((value) => {
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
                                                          {value.firstName +
                                                            " " +
                                                            value.lastName}
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
                                        style={{ opacity: "1" }}
                                        onClick={() => {
                                          setCreateCustomerModal((e) => !e);
                                        }}
                                      >
                                        <i class="fas fa-plus"></i>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="col-span-6 sm:col-span-12 p-2">
                                <div className="flex mb-2 items-center">
                                  <label
                                    for="name"
                                    class="block text-sm font-medium text-gray-700"
                                  >
                                    Name
                                  </label>
                                  {formik.touched.name && formik.errors.name ? (
                                    <span className="text-red-500 font-size-14 pl-2">
                                      {formik.errors.name}
                                    </span>
                                  ) : null}
                                </div>
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  autocomplete="given-name"
                                  className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size ${getInputClasses(
                                    "name"
                                  )}`}
                                  onChange={(e) => SuggestName(e.target.value)}
                                  value={name}
                                  // {...formik.getFieldProps("name")}
                                  disabled={true}
                                />
                                {filteredData1.length != 0 && textValue1 != "" && (
                                  <div className="dataResult">
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
                                                {value.firstName +
                                                  " " +
                                                  value.lastName}
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

                              <div class="col-span-6 sm:col-span-6 p-2">
                                <div className="mb-2 flex items-center">
                                  <label
                                    for="date"
                                    class="block text-sm font-medium text-gray-700"
                                  >
                                    Select Date
                                  </label>
                                  {formik.touched.date && formik.errors.date ? (
                                    <span className="text-red-500 text-sm pl-2">
                                      {formik.errors.date}
                                    </span>
                                  ) : null}
                                  {timeMsg && (
                                    <span className="text-red-500 font-size-12 w-full">
                                      {timeMsg}
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="date"
                                  name="date"
                                  id="date"
                                  autocomplete="given-name"
                                  className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size ${getInputClasses(
                                    "date"
                                  )}`}
                                  value={date}
                                  // {...formik.getFieldProps("date")}
                                  onChange={(e) => ChangeinDate(e)}
                                  // disabled={multipleServices ? true : false}
                                />
                                {/* <span class="z-10  leading-snug font-normal text-center text-gray-400 absolute bg-transparent rounded  items-center justify-center  pr-3 py-3">
                                                        MINS
                                                    </span> */}
                              </div>

                              <div class="col-span-6 sm:col-span-6 p-2">
                                <div className="mb-2 flex items-center">
                                  <label
                                    for="time"
                                    class="block text-sm font-medium text-gray-700"
                                  >
                                    Choose Time
                                  </label>
                                  {formik.touched.time && formik.errors.time ? (
                                    <span className="text-red-500 text-sm pl-2">
                                      {formik.errors.time}
                                    </span>
                                  ) : null}
                                  {storeTimeMsg && (
                                    <span className="text-red-500 text-sm w-full">
                                      {storeTimeMsg}
                                    </span>
                                  )}
                                </div>

                                {/* <input
                                  type="time"
                                  name="time"
                                  id="time"
                                  autocomplete="given-name"
                                  className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size
                                   ${getInputClasses(
                                    "time"
                                  )}`}
                              
                                  // value={duration} 
                                  
                                  {...formik.getFieldProps("time")}
                                /> */}
                                <div className="date-appointment-input">
                                  <div className="">
                                    <div className="">
                                      <DatePicker
                                        selected={duration}
                                        onChange={(date) =>
                                          changeDuration(date)
                                        }
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="col-span-6 sm:col-span-6 p-2">
                                <div className="mb-2 flex items-center">
                                  <label
                                    for="serviceId"
                                    class="block text-sm font-medium text-gray-700"
                                  >
                                    Select Service
                                  </label>
                                  {formik.touched.serviceId &&
                                  formik.errors.serviceId ? (
                                    <span className="text-red-500 text-sm pl-2 block">
                                      {formik.errors.serviceId}
                                    </span>
                                  ) : null}
                                </div>

                                <Select
                                  name="cars"
                                  id="service"
                                  placeholder="Search"
                                  styles={selectStyles}
                                  value={searchServices.filter(
                                    (option) => option.value === ser
                                  )}
                                  maxMenuHeight={170}
                                  //   className="dropdown2 w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size"
                                  onChange={handleService}
                                  options={searchServices}
                                  disabled={true}
                                >
                                  {/* <option clasName="font-size-18 heading-title-text-color font-medium"></option>
                                                                    {services.length > 0 &&
                                                                        services.map((service) => {
                                                                            return (
                                                                                <option
                                                                                    className="font-size-18 heading-title-text-color font-medium"
                                                                                    value={service._id}
                                                                                >
                                                                                    {service.serviceName} - {SettingInfo?.currentType} 
                                                                                    {service.amount}
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
                                      className="block text-sm font-medium text-gray-700"
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
                                      disabled={true}
                                    />
                                    <div></div>
                                  </div>
                                </div>
                              </div>

                              <div class="col-span-6 sm:col-span-12 p-2">
                                <div className="mb-2 flex items-center">
                                  <label
                                    for="staffId"
                                    class="block text-sm font-medium text-gray-700"
                                  >
                                    Select Staff
                                  </label>
                                  {formik.touched.staffId &&
                                  formik.errors.staffId ? (
                                    <span className="text-red-500 text-sm pl-2 block">
                                      {formik.errors.staffId}
                                    </span>
                                  ) : null}
                                </div>
                                <select
                                  name="cars"
                                  id="staff"
                                  className={`dropdown2 w-full py-2 dark-text-color font-medium pl-2 serchbar-style mini-leptop-size ${getInputClasses(
                                    "staffId"
                                  )}`}
                                  // value={appointment && appointment.staff}
                                  {...formik.getFieldProps("staffId")}
                                  disabled={true}
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
                              </div>

                              <div class="col-span-12 sm:col-span-12 p-2">
                                {/* <label class="flex items-center"> */}
                                <input
                                  type="checkbox"
                                  class={`form-checkbox `}
                                  checked={isConfirmationSMS}
                                  onChange={() => {
                                    setIsConfirmationSMS(!isConfirmationSMS);
                                  }}
                                  // disabled={multipleServices ? true : false}
                                />
                                <span class="ml-2">
                                  Confirmation/Reminder SMS
                                </span>
                                {formik.touched.isPromotional &&
                                formik.errors.isPromotional ? (
                                  <span className="text-red-500 text-sm pl-2">
                                    {formik.errors.isPromotional}
                                  </span>
                                ) : null}

                                {/* </label> */}
                              </div>

                              {/* <div class="col-span-12 sm:col-span-12 p-2">
                                <div
                                  className={
                                    "flex cursor-pointer " +
                                    "justify-center mt-5"
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
                                      src={
                                        require("../../../assets/img/Plus.png")
                                          .default
                                      }
                                    />
                                    <span className="font-size-20 pl-2 dark-text-color tracking-normal font-medium">
                                      Add Multiple Service
                                    </span>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>

                        {/*footer*/}
                        {matchedMsg && (
                          <span className="text-red-500 font-size-12 pl-8">
                            {matchedMsg}
                          </span>
                        )}
                        <div className="flex items-center justify-center p-6 rounded-b">
                          <button
                            type="submit"
                            onClick={formik.handleSubmit}
                            className="mr-remove cus-medium-btn 
                                                                    font-size-16 font-medium 
                                                                    tracking-normal white-text-color
                                                                    tracking-normal cursor-pointer"
                            style={{
                              transition: "all .15s ease",
                              display: "none",
                            }}
                            disabled={formik.isSubmitting}
                            // onClick={matched && formik.handleSubmit}
                          >
                            {object ? "Save Changes" : "Book Appointment"}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div
                      className="md:w-3/5 pl-10 pr-4"
                      style={{ display: "block" }}
                    >
                      <div className="md:flex">
                        <div className="md:w-full modal-subheading-height mb-3">
                          <div className="flex items-center">
                            <img
                              src={
                                require("../../../assets/img/new-c.png").default
                              }
                            />
                            <span className="font-size-20 heading-title-text-color font-bold tracking-normal pl-4">
                              {appointmentData && appointmentData.length
                                ? moment
                                    .utc(appointmentData[0].date)
                                    .format("DD MMMM YYYY")
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="table-timline-height">
                        <div className="timeline-table">
                          <table style={{ width: "100%", height: "10vh" }}>
                            {appointmentData &&
                              appointmentData.map((apt, index) => {
                                return (
                                  <>
                                    <tr key={index}>
                                      <td>
                                        <div
                                          className={
                                            "timeline " +
                                            (index === 0
                                              ? "timeline-start"
                                              : "")
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
                                              <span className="font-size-20 heading-title-text-color font-bold tracking-normal pl-4">
                                                {apt &&
                                                  moment
                                                    .utc(apt.date)
                                                    // .subtract("minute", 330)
                                                    .format("hh:mm a")}
                                                -
                                                {apt &&
                                                  moment
                                                    .utc(apt.date)
                                                    .add(
                                                      "minute",
                                                      apt.serviceId &&
                                                        apt.serviceId.duration
                                                    )
                                                    .format("hh:mm a")}{" "}
                                                {/* {apt &&
                                                  moment(apt.date)
                                                    .subtract("minute", 330)
                                                    .format("hh:mm a")}{" "}
                                                -
                                                {apt &&
                                                  moment(apt.date)
                                                    .subtract("minute", 330)
                                                    .add(apt.time, "minutes")
                                                    .format("hh:mm a")} */}
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
                                              <span className="font-size-20 heading-title-text-color font-bold tracking-normal pl-4">
                                                {apt &&
                                                  apt.serviceId &&
                                                  apt.serviceId.serviceName}
                                                {/* {apt &&
                                                  apt.serviceId[0] &&
                                                  apt.serviceId[0].serviceName} */}
                                              </span>
                                            </div>
                                            <div className="flex items-center modal-contact pt-1">
                                              <img
                                                src={
                                                  require("../../../assets/img/Vector (1).png")
                                                    .default
                                                }
                                              />
                                              <span className="font-size-20 heading-title-text-color font-bold tracking-normal pl-4">
                                                {apt && apt.staff}
                                                {/* {apt &&
                                                  apt.staffId[0] &&
                                                  apt.staffId[0].firstName +
                                                    " " +
                                                    apt.staffId[0].lastName} */}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="md:w-1/5 pl-3">
                                            <div className="flex justify-end">
                                              <p className="font-medium tracking-normal rs-font heading-title-text-color pt-4 mb-0 font-size-22">
                                                {SettingInfo?.currentType}
                                                <span className="font-bold">
                                                  {apt &&
                                                    apt.serviceId &&
                                                    apt.serviceId.amount}
                                                  {/* {apt &&
                                                    apt.serviceId[0] &&
                                                    apt.serviceId[0].amount} */}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="timeline-option">
                                          {/* <div className="flex items-center">
                                            <div
                                              className="data-delete mr-5 flex items-center justify-center"
                                              //   onClick={() => handleEdit(index)}
                                            >
                                              <img
                                                src={
                                                  require("../../../assets/img/t-en.png")
                                                    .default
                                                }
                                              />
                                            </div> */}
                                          {/* <div
                                              className="data-delete flex items-center justify-center"
                                              //   onClick={() =>
                                              //     handleDelete(index)
                                              //   }
                                            >
                                              <img
                                                src={
                                                  require("../../../assets/img/timeline-delete.png")
                                                    .default
                                                }
                                              />
                                            </div> */}
                                          {/* </div> */}
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
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
                                <span className="font-bold">
                                  {" "}
                                  - {amountFilter}
                                </span>
                              </p>
                            </div>
                            <div>
                              {able ? (
                                <button
                                  className="book-app-btn font-size-20 tracking-normal white-text-color font-medium text-center"
                                  // onClick={() => handleMultipleSubmit()}
                                  onClick={formik.handleSubmit}
                                >
                                  Reschedule Appointment
                                </button>
                              ) : (
                                <button
                                  className="book-app-btn font-size-20 tracking-normal white-text-color font-medium text-center opacity-25"
                                  // onClick={() => handleMultipleSubmit()}
                                  onClick={formik.handleSubmit}
                                  disabled
                                >
                                  Reschedule Appointment
                                </button>
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
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default RescheduleModal;
