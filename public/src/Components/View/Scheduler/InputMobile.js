import React, { useState, useRef, useEffect } from "react";
import "../../Common/Modal/Modal.scss";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Row, Col } from 'reactstrap';
import { ApiPut, ApiPost, ApiGet } from "../../../helpers/API/ApiData";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import AppointmentImage from "../../../assets/svg/app.png";
import BookingImage from "../../../assets/svg/booking-image.png";
// import OptionSelect from "../OptionSelect/OptionSelect";
import UserAdd from "../../../assets/svg/user-add.svg";
import SearchIcon from "../../../assets/svg/X.svg";
import BackArrowService from "../../../assets/svg/Group.svg";
import InputSearchIcon from "../../../assets/svg/search.svg";
import Popper from "popper.js";
import PropTypes from "prop-types";
import moment, { min } from "moment";
import DatePicker from "react-datepicker";
import CloseBtn from "../../../assets/svg/close-btn.svg";
import EditServiceModals from "../../Common/Modal/EditServiceModals";
import { toast } from "react-toastify";
import Success from "../../Common/Toaster/Success/Success";
import AddCustomerModal from "../../Common/Modal/AddCustomerModal";
import dateTime from "date-time";
import membershipProfileSmall from "../../../assets/svg/membership-profile-small.svg";


import "./index.css";
import { get_Setting } from "../../../utils/user.util";


export default function InputMobile(props) {
  const {
    uuid,
    toggle,
    data,
    editAppointment,
    rescheduleAppointments,
    args,
    addEvent,
  } = props;
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [selectappointmemntType, setSelectAppointmemntType] = useState(true);
  const [appointmentType, setAppointmentType] = useState();
  const [selectDate, setSelectDate] = useState(true);
  const [selectTime, setSelectTime] = useState(true);
  const [selectService, setSelectService] = useState(true);
  const [selectStaff, setSelectStaff] = useState(true);
  const [checkout, setCheckout] = useState(true);
  const [date, setDate] = useState();
  const [hour, setHour] = useState();
  const [selectHour, setSelectHour] = useState();
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
  const [stafff, setStafff] = useState();
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
  const [times, setTimes] = useState(selectHour + ":" + timeDetail);
  const [ispromotional, setIsPromotional] = useState(true);
  const [customerCompulsion, setCustomerCompulsion] = useState(true);
  const [saveService, setSaveService] = useState(true);
  let SettingInfo = get_Setting()


  // let times = selectHour + ":" + timeDetail;
  const timing =
    selectHour > 12
      ? selectHour - 12 + ":" + (timeDetail === 0 ? "00" : timeDetail)
      : selectHour + ":" + (timeDetail === 0 ? "00" : timeDetail);

  let staffEndISODates = new Date(`${date} UTC`);

  let total = multipleappointment[0]?.serviceId
    ? multipleappointment &&
      multipleappointment
        .map((item) => item?.serviceId?.amount)
        .reduce((prev, curr) => prev + curr, 0)
    : 0;
  const [selectedDate, setSelectedDate] = useState();
  useEffect(() => {
    getAllServices();
    getStoreSetting();
    ApiGet("staff/company/" + userInfo.companyId).then((resp) => {
      let filterstaffs = resp.data.data.filter((obj) =>
        obj.firstName === "Unassign" ? null : obj
      );
      setStaffs(resp?.data?.data);
      setAllStaff(filterstaffs);
    });
  }, []);

  const getStoreSetting = async (values) => {
    const SettingData = get_Setting()
    
    setStoreTiming(SettingData?.storeTiming);
    setWorkingDays(SettingData?.workingDays);
    setCustomerCompulsion(SettingData?.customer);
    // try {
    //   let res = await ApiGet("setting/company/" + userInfo.companyId);
    //   if (res.data.status === 200) {
    //     setStoreTiming(res.data.data[0].storeTiming);
    //     setWorkingDays(res.data.data[0].workingDays);
    //     setCustomerCompulsion(res?.data?.data[0]?.customer);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };
  const appointmentdata = {
    type: appointmentType,
    date:
      multipleappointment?.length > 0
        ? startTime
        : moment(staffEndISODates).add(times)._d,
    default: staff && service ? false : true,
    time: service ? time : "30",
    serviceId: serviceId,
    name: name ? name : "",
    staffId: staff ? staffId : null,
    staff: staff ? staffId?.firstName + " " + staffId?.lastName : "Unassign",
    companyId: userInfo?.companyId,
    isPromotional: ispromotional,
    mobile: mobileNumber ? mobileNumber : "",
    status: 1,
    uuid: args?.uuid ? args?.uuid : uuid,
  };

  const SelectAppointmenttype = (data) => {
    setAppointmentType(data);
    setSelectAppointmemntType(false);

    if (data === "Walk-in") {
      setSelectDate(false);
      setSelectService(false);
      setDate(moment(dateTime())._d);
      if (service) {
      } else {
        setSelectService(false);

        if (staff) {
          setSelectStaff(false);
          setCheckout(false);

          multipleappointment.push(
            Object.assign(appointmentdata, {
              date: moment(dateTime()).add(330, "minutes")._d,
              default: true,
              type: data,
            })
          );
          setMultipleAppointment([...multipleappointment]);
        } else {
          setSelectStaff(false);
          setCheckout(false);

          multipleappointment.push(
            Object.assign(appointmentdata, {
              date: moment(dateTime()).add(330, "minutes")._d,
              default: true,
              type: data,
            })
          );
          setMultipleAppointment([...multipleappointment]);
        }
      }
    }

    if (data === "Pre-booking") {
      if (moment(args.StartTime)._d < moment(new Date())._d) {
        setSuccess(true);
        setEr("error");
        setToastmsg("Action not allowed");
        setAppointmentType(data);
        setSelectAppointmemntType(true);
      } else {
        setSelectDate(false);
        setSelectService(false);
        setDate(moment(args.StartTime)._d);
        if (service) {
        } else {
          if (staff) {
            setSelectStaff(false);
            setCheckout(false);

            multipleappointment.push(
              Object.assign(appointmentdata, {
                date: moment(args.StartTime).add(330, "minutes")._d,
                default: true,
                type: data,
                staffId: staffId,
                staff: staffId.firstName + " " + staffId.lastName,
              })
            );
            setMultipleAppointment([...multipleappointment]);
          } else {
            setSelectStaff(false);
            setCheckout(false);

            multipleappointment.push(
              Object.assign(appointmentdata, {
                date: moment(args.StartTime).add(330, "minutes")._d,
                default: true,
                type: data,
              })
            );
            setMultipleAppointment([...multipleappointment]);
          }
        }
      }
    }
  };

  const Opencalander = () => {
    setAppointmentType(false);
  };

  useEffect(() => {
    let test = document.getElementById("_dialog_wrapper");
    test.style.minWidth = "100%";
    test.style.height = "calc(110vh)";
  }, []);
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
      if (
        moment(ISODate).format("DD MM YY") < moment(today).format("DD MM YY")
      ) {
        add = false;
        setSuccess(true);
        setEr("error");
        setToastmsg("Action not allowed");
      }
      if (add) {
        setSelectDate(false);

        const SettingData = get_Setting()

            setStartHour(
            moment(SettingData?.storeTiming[0]?.starttime, [
               "HH.mm",
            ]).format("HH")
            );
            setEndHour(
              moment(SettingData?.storeTiming[0]?.endtime, ["HH.mm"]).format(
                "HH"
              )
            );

        // let res = await ApiGet("setting/company/" + userInfo.companyId);
        // try {
        //   if (res.data.status === 200) {
        //     setStartHour(
        //       moment(res.data.data[0].storeTiming[0].starttime, [
        //         "HH.mm",
        //       ]).format("HH")
        //     );
        //     setEndHour(
        //       moment(res.data.data[0].storeTiming[0].endtime, ["HH.mm"]).format(
        //         "HH"
        //       )
        //     );
        //   } else {
        //     console.log("in the else");
        //   }
        // } catch (err) {
        //   console.log("error while getting Categories", err);
        // }
      }
    } else {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Please select date");
    }
  };

  const handleMultipleSubmit = async () => {
    props.addEvent(multipleappointment);
  };

  const BackToSelectAppointmemntType = () => {
    setSelectAppointmemntType(true);
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
    setSelectService(true);
  };

  const BackToSelectService = () => {
    setSelectStaff(true);
    ApiGet("service/company/" + userInfo.companyId).then((resp) => {
      let filterservice = resp.data.data.filter((obj) =>
        obj.categoryName === "Unassign" ? null : obj
      );
      setAllServices(filterservice);
    });
  };
  useEffect(async () => {
    try {
      let res = await ApiGet("customer/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setAllCompanyCustomer(res?.data?.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  }, []);

  let selectedStaff = "";

  useEffect(async () => {
    try {
      let res = await ApiGet("staff/company/" + userInfo.companyId);
      if (res?.data?.status === 200) {
        setStafff(res?.data?.data);
        selectedStaff = res?.data?.data.filter(
          (obj) => obj._id === args?.staffId[0]
        );

        setStaffId(selectedStaff[0]);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting services", err);
    }

    ApiGet("setting/company/" + userInfo.companyId)
      .then((res) => {
        if (res.data.status === 200) {
          setAppointmnet(res?.data?.data[0]?.appointments);
          setService(res?.data?.data[0]?.service);
          setStaff(res?.data?.data[0]?.staff);
          if (res?.data?.data[0]?.appointments) {
            if (!res?.data?.data[0]?.service) {
              if (res?.data?.data[0]?.staff) {
                if (multipleappointment.length === 0) {
                  setSelectStaff(false);
                  setCheckout(false);
                  multipleappointment.push(
                    Object.assign(appointmentdata, {
                      type: "Pre-booking",
                      date: moment(args.StartTime).add(330, "minutes")._d,
                      default: true,
                      staffId: args?.type
                        ? args?.staffDetails
                        : selectedStaff[0],
                      staff: args?.type
                        ? args.staffDetails?.firstName +
                          " " +
                          args.staffDetails?.lastName
                        : selectedStaff[0]?.firstName +
                          " " +
                          selectedStaff[0]?.lastName,
                      _id: args?._id,
                      mobile: args?.type ? args.mobile : "",
                      name: args?.type ? args.name : "",
                    })
                  );
                  setMultipleAppointment([...multipleappointment]);
                }
              } else {
                setSelectStaff(false);
                setCheckout(false);
                multipleappointment.push(
                  Object.assign(appointmentdata, {
                    type: "Pre-booking",
                    date: moment(args.StartTime).add(330, "minutes")._d,
                    default: true,
                    staffId: args?.type ? args?.staffDetails : null,
                    staff: args?.type
                      ? args.staffDetails?.firstName +
                        " " +
                        args.staffDetails?.lastName
                      : "Unassign",
                    _id: args?._id,
                    mobile: args?.type ? args.mobile : "",
                    name: args?.type ? args.name : "",
                  })
                );
                setMultipleAppointment([...multipleappointment]);
              }
            }
          } else {
            setAppointmentType("Pre-booking");
            setSelectAppointmemntType(false);
            setSelectDate(false);
            setSelectService(false);
            setDate(moment(args.StartTime)._d);

            if (res?.data?.data[0]?.service && res?.data?.data[0]?.staff) {
              if (args.Guid) {
                setSelectStaff(false);
                setCheckout(false);

                multipleappointment.push(
                  Object.assign(appointmentdata, {
                    // type:"Pre-booking",
                    // date:moment(args.StartTime).add(330,"minutes")._d,
                    // default:true,
                    staffId: selectedStaff[0],
                    staff:
                      selectedStaff[0].firstName +
                      " " +
                      selectedStaff[0].lastName,
                  })
                );
                setMultipleAppointment([...multipleappointment]);
              }
            } else {
            
            }
            if (res.data.data[0].service) {
              setSelectStaff(true);
              if (!res.data.data[0].staff) {
                if (args.uuid) {
                  setMultipleAppointment([args]);
                  setSelectStaff(false);
                  setCheckout(false);
                }
              }
            } else {
              if (res.data.data[0].staff) {
                setSelectStaff(false);
                setCheckout(false);

                multipleappointment.push(
                  Object.assign(appointmentdata, {
                    type: "Pre-booking",
                    date: moment(args.StartTime).add(330, "minutes")._d,
                    default: true,
                    staffId: selectedStaff[0],
                    staff:
                      selectedStaff[0].firstName +
                      " " +
                      selectedStaff[0].lastName,
                  })
                );
                setMultipleAppointment([...multipleappointment]);
              } else {
                setSelectStaff(false);
                setCheckout(false);
                multipleappointment.push(
                  Object.assign(appointmentdata, {
                    type: "Pre-booking",
                    date: moment(args.StartTime).add(330, "minutes")._d,
                    default: true,
                    staffId: args?.type ? args?.staffDetails : null,
                    staff: args?.type
                      ? args.staffDetails?.firstName +
                        " " +
                        args.staffDetails?.lastName
                      : "Unassign",
                    _id: args?._id,
                    mobile: args?.type ? args.mobile : "",
                    name: args?.type ? args.name : "",
                  })
                );
                setMultipleAppointment([...multipleappointment]);
              }
            }
          }
        } else {
          console.log("in the else");
        }
      })
      .catch((err) => {
        console.log("error while getting Categories", err);
      });

    // if(editAppointment){

    //   setSelectAppointmemntType(false);
    //   setAppointmentType(editAppointment[0].type)
    //   setSelectDate(false)
    //   setSelectService(false)
    //   setSelectStaff(false)
    //   setCheckout(false)
    //   setMultipleAppointment(editAppointment)
    //   setDate(moment(editAppointment[0].date)._d)
    //   setEditId(editAppointment._id)
    //   setSelectedDate(moment(editAppointment[0].date).subtract(330,"minutes")._d)

    //   if(editAppointment[0].name === ""){

    //   }else{
    //     setCustomer({firstName:editAppointment[0].name,mobileNumber:editAppointment[0].mobile})
    //     setName(editAppointment[0].name)
    //     setMobileNumber(editAppointment[0].mobile)
    //   }
    // }
    if (args) {
      if (args.type) {
        setSelectAppointmemntType(false);
        setAppointmentType(args.type);
        setSelectDate(false);
        setSelectService(false);
        setSelectStaff(false);
        setCheckout(false);
        setMultipleAppointment([args]);
        setDate(moment(args?.date).subtract(330, "minutes")._d);
        setEditId(args._id);
        setSelectedDate(moment(args?.date).subtract(330, "minutes")._d);

        if (args.name === "") {
        } else {
          setCustomer({ firstName: args.name, mobileNumber: args.mobile });
          setName(args.name);
          setMobileNumber(args.mobile);
        }
      } else {
        if (moment(args.StartTime)._d < moment(new Date())._d) {
          setSuccess(true);
          setAddTrue(false);
          setEr("error");
          setToastmsg("Action not allowed");
          setAppointmentType(data);
          setSelectAppointmemntType(true);
        } else {
          setSelectAppointmemntType(false);
          setSelectDate(false);
          setSelectService(false);
          setAppointmentType("Pre-Booking");
          setDate(args?.StartTime);
          setSelectedDate(args?.StartTime);
        }
      }
    }

    if (rescheduleAppointments) {
      setSelectAppointmemntType(false);
      setAppointmentType(rescheduleAppointments[0].type);
      setSelectDate(false);
      setSelectService(false);
      setSelectStaff(false);
      setCheckout(false);
      setMultipleAppointment(rescheduleAppointments);
      setDate(moment(rescheduleAppointments[0].date)._d);
      setSelectedDate(
        moment(rescheduleAppointments[0].date).subtract(330, "minutes")._d
      );
      setEditId(rescheduleAppointments._id);
      if (rescheduleAppointments[0].name === "") {
      } else {
        setCustomer({
          firstName: rescheduleAppointments[0].name,
          mobileNumber: rescheduleAppointments[0].mobile,
        });
        setName(rescheduleAppointments[0].name);
        setMobileNumber(rescheduleAppointments[0].mobile);
      }
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
        setName(res.data.data.firstName + " " + res.data.data.lastName);
        setMobileNumber(res.data.data.mobileNumber);
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
    setAllCustomer("");
    setSearch("");
    setProductDropdown(!productDropdown);

    setMultipleAppointment(
      multipleappointment.map((item) => {
        return {
          ...item,
          name: data.firstName + " " + data.lastName,
          mobile: data.mobileNumber,
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
  InputMobile.propTypes = {
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
        setAllServices(filterservice);
        setAllCompanyServices(filterservice);
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
      allCompanyServices.filter(
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
            obj.amount.toString().includes(e.target.value.toString()))
      );
    if (e.target.value === "") {
      ApiGet("service/company/" + userInfo.companyId).then((resp) => {
        let filterservice = resp.data.data.filter((obj) =>
          obj.categoryName === "Unassign" ? null : obj
        );
        setAllServices(filterservice);
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
      ApiGet("category/" + saveService?.categoryId).then((resp) => {
        setAllStaff(resp.data.data[0]?.staff);
      });
    } else {
      setAllStaff(staffData);
    }
  };

  const SelectHour = (e, hour) => {
    setSelectHour(hour + 1);
    setSelectTime(false);
  };

  const OpenSelectService = async (e, min) => {
    // setTimes(selectHour + ":" + min)
    if (service) {
      setSelectService(!selectService);
    } else {
      setSelectService(!selectService);
      let isDayAvail = moment(date).format("dddd");
      try {
        let res = await ApiGet(
          "staff/available/company/" + userInfo.companyId + "/" + isDayAvail
        );
        if (res.data.status === 200) {
          setAllStaff(res.data.data);
        } else {
          console.log("in the else");
        }
      } catch (err) {
        console.log("error while getting services", err);
      }

      if (staff) {
        setSelectStaff(false);
        setCheckout(false);
        const time = selectHour + ":" + min;
        multipleappointment.push(
          Object.assign(appointmentdata, {
            date: moment(staffEndISODates).add(time)._d,
            default: true,
          })
        );
        setMultipleAppointment([...multipleappointment]);
      } else {
        setSelectStaff(false);
        setCheckout(false);
        const time = selectHour + ":" + min;
        multipleappointment.push(
          Object.assign(appointmentdata, {
            date: moment(staffEndISODates).add(time)._d,
            default: true,
          })
        );
        setMultipleAppointment([...multipleappointment]);
      }
    }

    setTimeDetail(min);
  };
  const OpenSelectStaff = async (e, service) => {
    setSaveService(service);
    let isDayAvail = moment(date).format("dddd");
    // try {
    //   let res = await ApiGet(
    //     "staff/available/company/" + userInfo.companyId + "/" + isDayAvail
    //   );
    //   if (res.data.status === 200) {
    //     setAllStaff(res.data.data);
    //   } else {
    //     console.log("in the else");
    //   }
    // } catch (err) {
    //   console.log("error while getting services", err);
    // }

    try {
      let res = await ApiGet("category/" + service?.categoryId);
      if (res.data.status === 200) {
        setAllStaff(res.data.data[0]?.staff);
      } else {
      }
    } catch (err) {
      console.log("in the catch");
    }

    setServiceId(service);
    setTime(service.duration);

    if (staff) {
      setSelectStaff(false);

      if (multipleappointment.length === 0) {
        setSelectStaff(false);
        setCheckout(false);

        multipleappointment.push(
          Object.assign(appointmentdata, {
            serviceId: service,
            time: service.duration,
            staffId: staffId,
            staff: staffId.firstName + " " + staffId.lastName,
          })
        );
        setMultipleAppointment([...multipleappointment]);
      }
    } else {
      setSelectStaff(false);
      setCheckout(false);

      multipleappointment.push(
        Object.assign(appointmentdata, {
          serviceId: service,
          time: service.duration,
          staff: "Unassign",
        })
      );
      setMultipleAppointment([...multipleappointment]);
    }
  };

  const OpenCheckOutPage = async (e, item) => {
    let add = true;
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
    let date1 = moment(staffEndISODates)._d;
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

    if (storeEndDate < apppointmentEndTime._d) {
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
    setSelectService(false);
    setSelectStaff(true);
    setSelectDate(false);
    setSelectAppointmemntType(false);
    setCheckout(true);
    setSelectService(false);
    setSelectStaff(true);
  };

  const changeSmsCheckbox = (e) => {
    setIsPromotional(!ispromotional);
    setMultipleAppointment(
      multipleappointment.map((item) => {
        return { ...item, isPromotional: !ispromotional };
      })
    );
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
    if (rescheduleAppointments) {
      multipleappointment.map((apt) => {
        ApiPut("appointment/" + apt._id, apt).then((resp) => {
          toggle(resp);
        });
      });
    } else {
      multipleappointment.map((apt) => {
        ApiPost("appointment/", apt).then((resp) => {
          toggle(resp);
        });
      });
    }
  };

  const ChangeAppointmentDate = (data, i) => {
    setDate(data);
    let ISODate = moment(data).add(times).add(330, "minutes")._d;
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
        staffId: app?.Guid ? app?.staffDetails : app.staffId,
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

      let todays = new Date();
      let ISODatess = new Date(`${data}`);
      if (ISODatess < todays) {
        setSuccess(true);
        setAddTrue(false);
        setEr("error");
        setToastmsg("Action not allowed");
      } else {
        if (app.staffId) {
          let add = true;
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
          let date1 = i > 0 ? ISODates : ISODate;
          let storeEndISODate = moment(i > 0 ? ISODates : ISODate).add(
            Endtime
          )._d;
          let storeEndDate = moment(storeEndISODate).add(15, "minutes");
          let date2 = moment(date1);
          let apppointmentEndTime = moment(date2).add(app.time, "minutes");
          let staffDetails =
            staffs &&
            staffs.filter(
              (obj) => obj._id === multipleappointment[0]?.staffId?._id
            );
          let staffDayDetails =
            staffDetails[0] &&
            staffDetails[0].workingDays &&
            staffDetails[0].workingDays.filter((obj) => obj.Day === day);

          let staffEndISODate = moment(i > 0 ? ISODates : ISODate).add(
            staffDayDetails && staffDayDetails[0]?.endtime
          )._d;

          let staffEndDate = moment(staffEndISODate).add(15, "minutes");

          if (storeEndDate < apppointmentEndTime) {
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
                    if (apt.name === app.name) {
                    } else {
                      setAddTrue(false);
                      add = false;
                      setSuccess(true);
                      setEr("error");
                      setToastmsg("Booked for" + " " + app.staff);
                    }
                  } else {
                    setAddTrue(false);
                    add = false;
                    setSuccess(true);
                    setEr("error");
                    setToastmsg("Booked for" + " " + app.staff);
                  }
                }
              });
          }
        }
      }
    });
  };
  const ChangeAppointmentTime = (data, i) => {
    //  setTimes(moment(data).format("hh:mm"))
    setDate(data);

    let ISODate = moment(data).add(330, "minutes")._d;
    let ISODates = "";
    multipleappointment.map(async (app, i) => {
      let appointment = {
        companyId: app?.companyId,
        date: i > 0 ? ISODates : ISODate,
        default: app?.default,
        isPromotional: app.isPromotional,
        mobile: app?.mobile,
        name: app?.name,
        serviceId: app?.serviceId,
        staff: app?.staff,
        staffId: app?.Guid ? app?.staffDetails : app?.staffId,
        status: app?.status,
        time: app?.time,
        type: app?.type,
        uuid: app?.uuid,
        // notes: app.notes,
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
        if (app.Guid) {
          let add = true;
          let dayInNumber = moment(date).day();
          let day;
          let startTime;

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
          let Endtime;
          storeTiming?.map((obj) => {
            return obj.day === day ? (Endtime = obj.endtime) : null;
          });
          storeTiming?.map((obj) => {
            return obj.day === day ? (startTime = obj.starttime) : null;
          });
          staffEndISODates = moment(date).format("LL");
          let date1 = i > 0 ? ISODates : ISODate;
          let storeEndISODate = moment(staffEndISODates)
            .add(330, "minutes")
            .add(Endtime)._d;
          let storeStartISODate = moment(staffEndISODates)
            .add(330, "minutes")
            .add(startTime)._d;
          let storeEndDate = moment(storeEndISODate).add(15, "minutes");
          let date2 = moment(date1);
          let apppointmentEndTime = moment(date2).add(app.time, "minutes");
          let staffDetails =
            staffs &&
            staffs.filter((obj) => obj?._id === app?.staffDetails?._id);
          let date3 = moment(date1).subtract(330, "minutes");
          let apppointmentStartTime = moment(date2);
          let staffDayDetails =
            staffDetails[0] &&
            staffDetails[0].workingDays &&
            staffDetails[0].workingDays.filter((obj) => obj.Day === day);

          let staffEndISODate = moment(staffEndISODates)
            .add(330, "minutes")
            .add(staffDayDetails[0].endtime)._d;

          let staffEndDate = moment(staffEndISODate).add(15, "minutes");

          if (storeStartISODate > apppointmentStartTime._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Store closed!");
          }

          if (storeEndDate._i < apppointmentEndTime._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Store closed!");
          }
          if (new Date() > date3._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Action not allowed");
          }
          if (apppointmentEndTime._d > staffEndDate._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Staff is not available");
          }

          if (app.staffDetails.firstName === "Unassign") {
          } else {
            let res = await ApiGet(
              "appointment/staff/" +
                userInfo.companyId +
                "/" +
                app.staffDetails._id
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
                    if (apt.staffId === app.staffDetails._id) {
                      if (apt.name === app.name) {
                      } else {
                        setAddTrue(false);
                        add = false;
                        setSuccess(true);
                        setEr("error");
                        setToastmsg("Booked for" + " " + app.staff);
                      }
                    } else {
                      setAddTrue(false);
                      add = false;
                      setSuccess(true);
                      setEr("error");
                      setToastmsg("Booked for" + " " + app.staff);
                    }
                  } else {
                  }
                });
            }
          }
        } else {
          let add = true;
          let dayInNumber = moment(date).day();
          let day;
          let startTime;

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
          let Endtime;
          storeTiming?.map((obj) => {
            return obj.day === day ? (Endtime = obj.endtime) : null;
          });
          storeTiming?.map((obj) => {
            return obj.day === day ? (startTime = obj.starttime) : null;
          });
          staffEndISODates = moment(date).format("LL");
          let date1 = i > 0 ? ISODates : ISODate;
          let storeEndISODate = moment(staffEndISODates)
            .add(330, "minutes")
            .add(Endtime)._d;
          let storeEndDate = moment(storeEndISODate).add(15, "minutes");
          let date2 = moment(date1);
          let apppointmentEndTime = moment(date2).add(app.time, "minutes");
          let staffDetails =
            staffs && staffs.filter((obj) => obj?._id === app?.staffId?._id);
          let storeStartISODate = moment(staffEndISODates)
            .add(330, "minutes")
            .add(startTime)._d;
          let apppointmentStartTime = moment(date2);
          let staffDayDetails =
            staffDetails[0] &&
            staffDetails[0].workingDays &&
            staffDetails[0].workingDays.filter((obj) => obj.Day === day);
          let date3 = moment(date1).subtract(330, "minutes");
          let staffEndISODate = moment(staffEndISODates).add(
            staffDayDetails[0].endtime
          )._d;
          let staffEndDate = moment(staffEndISODate).add(330, "minutes");

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
          if (storeStartISODate > apppointmentStartTime._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Store closed!");
          }
          if (new Date() > date3._d) {
            add = false;
            setAddTrue(false);
            setSuccess(true);
            setEr("error");
            setToastmsg("Action not allowed");
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
                        setAddTrue(false);
                        add = false;
                        setSuccess(true);
                        setEr("error");
                        setToastmsg("Booked for" + " " + app.staff);
                      } else {
                        if (apt.name === app.name) {
                        } else {
                          setAddTrue(false);
                          add = false;
                          setSuccess(true);
                          setEr("error");
                          setToastmsg("Booked for" + " " + app.staff);
                        }
                      }
                    } else {
                      setAddTrue(false);
                      add = false;
                      setSuccess(true);
                      setEr("error");
                      setToastmsg("Booked for" + " " + app.staff);
                    }
                  }
                });
            }
          }
        }
      } else {
        staffEndISODates = moment(date).format("LL");
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
        let storeStartISODate = moment(staffEndISODates)
          .add(330, "minutes")
          .add(startTime)._d;
        let storeEndISODate = moment(staffEndISODates)
          .add(330, "minutes")
          .add(Endtime)._d;
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
    // <div className="md:flex">
    <div className="md:full  " style={{ display: "block" }}>
      {/* <div class="overflow-hidden sm:rounded-md">
          <div> */}
      {/* <div className="cus-modal"> */}
      {/* <div className="modal-header">
            <div className="container-long"> */}
      {/* modal header */}
      {/* <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div onClick={() => props.toggle()} className="modal-close">
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div className="modal-title">
                    {editAppointment ? <h2>Edit Appointment</h2>:<h2> {rescheduleAppointments ?"Reschedule  Appointment":"Add New Appointment"}</h2>}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

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
                        <img src={AppointmentImage} alt="AppointmentImage" />
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
                        <img src={BackArrowService} alt="BackArrowService" />
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
                      <div
                        className="left-arrow-alignment"
                        onClick={BackTOselectDate}
                      >
                        <img src={BackArrowService} alt="BackArrowService" />
                      </div>
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
                              <span value={selectHour}></span>
                            </div>
                          </div>
                          <div className="timer-divider">
                            <span>:</span>
                          </div>
                          <div className="timer-input">
                            <div className="timer-cus-design">
                              <span>-</span>
                            </div>
                          </div>
                        </div>
                        <div className="timer-alignment-box">
                          <div>
                            {[
                              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                              15, 16, 17, 18, 19, 20, 21, 22, 23,
                            ].map((i) => {
                              return i + 1 >= starthour ? (
                                i + 1 > endhour ? null : (
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
                              <span
                                value={
                                  selectHour > 12 ? selectHour - 12 : selectHour
                                }
                              ></span>
                            </div>
                          </div>
                          <div className="timer-divider">
                            <span>:</span>
                          </div>
                          <div className="timer-input">
                            <div className="timer-cus-design">
                              <span value={timeDetail}></span>
                            </div>
                          </div>
                        </div>
                        <div className="timer-alignment-box">
                          <div>
                            {[0, 15, 30, 45].map((item, i) => {
                              return (
                                <div
                                  key={i}
                                  className="timer-box-design"
                                  onClick={(e) => OpenSelectService(e, item)}
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
                          <img src={BackArrowService} alt="BackArrowService" />
                        </div>
                      ) : (
                        <div
                          className="left-arrow-alignment"
                          // onClick={BackToSelectTime}
                        >
                          {/* <img
                              src={BackArrowService}
                              alt="BackArrowService"
                            /> */}
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
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.625 15.625C12.491 15.625 15.625 12.491 15.625 8.625C15.625 4.75901 12.491 1.625 8.625 1.625C4.75901 1.625 1.625 4.75901 1.625 8.625C1.625 12.491 4.75901 15.625 8.625 15.625Z" stroke="#193566" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.375 17.375L13.5687 13.5687" stroke="#193566" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                        </div>
                      </div>
                    </div>
                    <div className="appointment-service-box-height">
                      {allServices?.map((service) => {
                        return (
                          <div
                            key={service._id}
                            className="appointment-service-list"
                            onClick={(e) => OpenSelectStaff(e, service)}
                          >
                            <div className="list-grid">
                              <div className="list-grid-items">
                                <h5>{service?.serviceName}</h5>
                                <p>
                                  {service?.categoryName?.length > 30
                                    ? service?.categoryName.substring(0, 20) +
                                      "..."
                                    : service?.categoryName}
                                  • {service?.duration} mins
                                </p>
                              </div>
                              <div className="list-grid-items">
                                <h6>
                                  <span>{SettingInfo?.currentType}</span> {service?.amount}
                                </h6>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : checkout ? (
            <div className="modal-body-top-align">
              <div className="generate-box-center">
                <div className="appointment-service-box">
                  <div>
                    <div className="service-title">
                      <div
                        className="left-arrow-alignment"
                        onClick={BackToSelectService}
                      >
                        <img src={BackArrowService} alt="BackArrowService" />
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
                          <img src={InputSearchIcon} alt="InputSearchIcon" />
                        </div>
                      </div>
                    </div> */}
                    <div className="appointment-service-box-height">
                      {allStaff &&
                        allStaff.map((item) => {
                          return (
                            <>
                              <div
                                key={item._id}
                                className="appointment-service-list-style"
                                onClick={(e) => OpenCheckOutPage(e, item)}
                              >
                                <p>{item?.firstName + " " + item?.lastName}</p>
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
            <div className="modal-body">
              <div className="container">
                <div className="modal-body-top-align flex justify-center">
                  <div className="edit-invoice-grid">
                    <div className="edit-invoice-grid-items" ref={wrapperRef}>
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
                                    <img
                                      src={membershipProfileSmall}
                                      alt="ProfileImage"
                                    />
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
                                  )}
                                </div>
                                <div className="cus-grid-items close-icon-alignment-profile">
                                  <div>
                                    <p>
                                      {customer?.firstName} {customer?.lastName}
                                    </p>
                                    <span>{customer?.mobileNumber}</span>
                                  </div>
                                  <div>
                                    <img
                                      src={CloseBtn}
                                      alt="CloseIcon"
                                      onClick={() => setCustomer()}
                                    />
                                  </div>
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
                                    onChange={(e) => handleCustomerSearch(e)}
                                  />
                                </div>
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
                              <div className="text-center mt-2 font-medium heading-title-text-color">
                                "Customer doesn't exist in the data. Would you
                                like to add new?"{" "}
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
                                    key={index}
                                    className="add-customer-details"
                                  >
                                    <div className="cus-grid">
                                      <div className="cus-grid-items">
                                        {cus.membership ? (
                                          <img
                                            src={membershipProfileSmall}
                                            alt="ProfileImage"
                                          />
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
                                        )}
                                      </div>
                                      <div
                                        className="cus-grid-items"
                                        onClick={(e) => SelectCustomer(e, cus)}
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
                                {/* {staff ? (appointment ? (service ?<span>{moment.utc(serv.date).format("hh:mm A")} - {moment.utc(serv.date).add(serv.time, "minutes").format("hh:mm A")}</span> :  
                                    <span>{moment(serv.date).format("hh:mm A")} - {moment(serv.date).add(serv.time, "minutes").format("hh:mm A")}</span>
                                    ):(service ? <span>{moment.utc(serv.date).format("hh:mm A")} - {moment.utc(serv.date).add(serv.time, "minutes").format("hh:mm A")}</span>
                                    :<span>{moment.utc(serv.date).format("hh:mm A")} - {moment(serv.date).add(serv.time, "minutes").format("hh:mm A")}</span>)):
                                    appointment ? service? <span>{moment.utc(serv.date).format("hh:mm A")} - {moment.utc(serv.date).add(serv.time, "minutes").format("hh:mm A")}</span>:
                                    <span>{moment(serv.date).format("hh:mm A")} - {moment (serv.date).add(serv.time, "minutes").format("hh:mm A")}</span>:
                                    service ?  <span>{moment.utc(serv.date).format("hh:mm A")} - {moment.utc(serv.date).add(serv.time, "minutes").format("hh:mm A")}</span> :
                                    <span>{moment(serv.date).format("hh:mm A")} - {moment(serv.date).add(serv.time, "minutes").format("hh:mm A")}</span>} */}
                                <span>
                                  {moment.utc(serv.date).format("hh:mm A")} -{" "}
                                  {moment
                                    .utc(serv.date)
                                    .add(serv.time, "minutes")
                                    .format("hh:mm A")}
                                </span>
                              </div>

                              <div
                                className="service-provider-grid"
                                onClick={
                                  rescheduleAppointments
                                    ? null
                                    : (e) => OpenEditService(serv)
                                }
                              >
                                <div
                                  className="service-provider-grid-items"
                                  style={{
                                    backgroundColor: serv?.serviceId?.colour
                                      ? serv?.serviceId?.colour
                                      : "#D1FFF4",
                                    borderRadius: "5px",
                                    height: "100%",
                                  }}
                                ></div>
                                <div className="service-provider-grid-items">
                                  <p>
                                    {serv?.serviceId?.serviceName
                                      ? serv?.serviceId?.serviceName
                                      : "Slot"}
                                  </p>
                                  <span>
                                    {serv?.staff ? "by " : null}{" "}
                                    {serv?.staff ? serv?.staff : null}{" "}
                                  </span>
                                  {}
                                </div>
                                <div className="service-provider-grid-items">
                                  <h5>
                                    {serv?.serviceId?.amount ? <a>{SettingInfo?.currentType}</a> : null}
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
                          args._id ? null : (
                            <div className="add-more">
                              <p onClick={() => AddMoreservice()}>+ Add more</p>
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
                              src={
                                require("../../../assets/svg/date-icon-style.png")
                                  .default
                              }
                            />
                            <span>
                              <div className="time-dropdowns">
                                <DatePicker
                                  selected={date}
                                  onChange={(e) => ChangeAppointmentDate(e)}
                                  dateFormat="EEEE, do MMMM yyyy"
                                  placeholderText="Date"
                                  fixedHeight
                                />
                              </div>
                              {/* {moment(date).format("dddd ,Do MMMM  YYYY")} */}
                            </span>
                          </button>
                          {editAppointment ? null : <p>Edit</p>}
                        </div>
                        <div className="date-change-button-alignments">
                          <button>
                            <img
                              src={
                                require("../../../assets/svg/date-icon-style.png")
                                  .default
                              }
                            />
                            <span>
                              <div className="time-dropdown">
                                {/* {editAppointment ?
                                  <DatePicker
                                  selected = {date}
                                  disabled
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  dateFormat="hh:mm aa"
                                   />
                                  : */}
                                <DatePicker
                                  selected={date}
                                  onChange={(e) => ChangeAppointmentTime(e)}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  dateFormat="hh:mm aa"
                                />
                                {/* } */}
                              </div>
                            </span>
                          </button>
                          {editAppointment ? null : <p>Editable</p>}
                        </div>
                        {addtrue ? null : <p>Slot Not available</p>}
                      </div>
                      <div className="send-sms-text-alignment">
                        <input
                          type="checkbox"
                          value={ispromotional}
                          defaultChecked
                          onChange={(e) => changeSmsCheckbox(e)}
                        />
                        <label>Send SMS confirmation to the customer</label>
                      </div>
                      <div className="book-app-button-center">
                        {/* {editAppointment ? 
                             (addtrue ?
                             <button onClick={() => AddAppointment()}>
                               Edit appointment
                             </button>:
                             <button disabled>
                               Edit appointment
                             </button>): rescheduleAppointments ?
                            addtrue ?<button onClick={() => AddAppointment()}>
                            Reschedule appointment
                          </button>:
                          <button disabled>
                            Reschedule appointment
                          </button> : (customerCompulsion ? customer && addtrue ? 
                            <button onClick={() => handleMultipleSubmit()}>
                              {args._id ?  "Edit appointment": "Book appointment" }
                            </button>
                            :
                            <button disabled>
                              {args._id ? "Edit appointment": "Book appointment" }
                            </button>:  */}
                        {addtrue ? (
                          <button onClick={() => handleMultipleSubmit()}>
                            {args._id ? "Edit appointment" : "Book appointment"}
                          </button>
                        ) : (
                          <button disabled>
                            {args._id ? "Edit appointment" : "Book appointment"}
                          </button>
                        )}
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* {/* </div> */}
        </div>
        {/* </div>
      </div> */}
        {editServiceModal && (
          <EditServiceModals
            modal={editServiceModal}
            toggle={OpenEditService}
            editServiceData={editServiceData}
            RemoveService={RemoveService}
            editAppointment={editAppointment}
            service={service}
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
      </div>
    </div>
    //  </div>
    //  </div>
  );
}
