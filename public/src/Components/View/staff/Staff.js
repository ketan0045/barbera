import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { ApiGet, ApiPost, ApiPut } from "./../../../helpers/API/ApiData";
import button from "../../../../src/assets/svg/F_41.svg";
import "../../Sass/Staff.scss";

import ChildSidebar from "../Layout/ChildSidebar";
import CusEmptyIcon from "../../../assets/svg/new-cus-empty.svg";
import CommissionTransaction from "../../Common/Modal/CommissionChildModal/CommissionTransaction";
import moment from "moment";
import { motion } from "framer-motion/dist/framer-motion";
import {
  getUserInfo,
  get_Setting,
  removeUserInfo,
} from "../../../utils/user.util";

import ProvidedServices from "../../../assets/svg/Scissor.svg";
import AverageTicketSize from "../../../assets/svg/List.svg";

import ProfileEdit from "../../../assets/svg/profile-edit.png";
import SettingIcon from "../../../assets/svg/setting.svg";
import ImportIcon from "../../../assets/svg/import-button.png";
import ProfileDelete from "../../../assets/svg/profile-delete.png";
import SearchIcon from "../../../assets/svg/search.svg";
import { toast } from "react-toastify";
import "../../Sass/Customer.scss";
import Success from "../../Common/Toaster/Success/Success";
import AddNewStaffModal from "../../Common/Modal/AddNewStaffModal";
import Delete from "../../Common/Toaster/Delete";
import ViewInvoiceModal from "../../Common/Modal/ViewInvoiceModal";
import CalendarIcon from "../../../assets/svg/calendar_blue.svg";
import DatePicker from "react-datepicker";
import { Pie } from "react-chartjs-2";

import CommissionTab from "./CommissionTab";
import AttendanceTab from "./AttendanceTab";
import AttendanceReport from "../../Common/Modal/Attendance/AttendanceReport";
import PayTab from "./PayTab";
import StaffSalary from "./StaffSalary";

export default function Staff(props) {
  const [staffDetails, setStaffDetails] = useState();
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  let SettingInfo = get_Setting();

  let role = getUserInfo().role;
  const [loading, setLoading] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [allStaff, setAllStaff] = useState();
  const [search, setSearch] = useState();
  const [appointmentDetails, setAppointmentDetails] = useState();
  const [filteredData, setFilteredData] = useState();
  const [allServices, setAllServices] = useState([]);
  const [serviceSales, setServiceSales] = useState("all");
  const [serviceAppointment, setServiceAppointment] = useState("all");
  const [staffSalesDetails, setStaffSalesDetails] = useState();
  const [finalAmount, setFinalAmount] = useState();
  const [totalAppointment, setTotalAppointment] = useState();
  const [createStaffModal, setCreateStaffModal] = useState(false);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [allInvoices, setAllInvoices] = useState();
  const [allTransactions, setAllTransactions] = useState([]);
  const [staffPay, setStaffPay] = useState([]);
  const [staffPayTotal, setStaffPayTotal] = useState();
  const [temTopServices, setTemTopServices] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(30, "days")._d
  );
  const [endDate, setEndDate] = useState(new Date());
  //-----------------------------------------------------------New Code-------------------------------------------------------------------------
  const [childSidebar, setChildSidebar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [er, setEr] = useState();
  const [tabHandle, setTabHandle] = useState("profile");
  const [deleteStaffId, setDeleteStaffId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editStaff, setEditStaff] = useState({});
  const [addNewStaffModal, setAddNewStaffModal] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [commissionTransactionModal, setCommissionTransactionModal] =
    useState(false);
  const [attendanceReportModal, setAttendanceReportModal] = useState(false);
  const [weekOff, setWeekOff] = useState([]);
  const [startDates, setStartDates] = useState(new Date());
  const AddNewStaff = () => {
    AddNewStaffModaltoggle();
    setEditStaff();
  };
  const [staffPayModal, setStaffPayModal] = useState(false);

  const openStaffPayModal=(data)=>{
    setStaffPayModal(!staffPayModal)
    if(data == true){
      getAllPay(staffDetails)
    }
  }

  const checkClockinTime = async () => {
    let data = {
      startTime: moment(startDates).startOf("month").format("YYYY-MM-DD"),
      endTime: moment(startDates)
        .endOf("month")
        .add(1, "day")
        .format("YYYY-MM-DD"),
    };
    await ApiPost("attendence/company/alldata/" + userInfo.companyId, data)
      .then((res) => {
        // setuserAttendenceData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkClockinTime();
  }, [startDates]);
  const AddNewStaffModaltoggle = (status, values) => {
    setAddNewStaffModal(!addNewStaffModal);

    if (addNewStaffModal === true) {
      if (status) {
        if (status === 200) {
          setSuccess(true);
          setToastmsg(editStaff ? "Changes saved!" : "New staff added!");
          if (values) {
            getAllStaff(editStaff ? values[0] : values);
          } else {
            getAllStaff();
          }
        } else if (status === 208) {
          setSuccess(true);
          setToastmsg("Staff already exists!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong!");
        }
      }
    }
  };

  const data = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#FDB45C", "#F0E48E"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#FDB45C", "#F0E48E"],
        data: [
          parseInt(allTransactions?.serviceCountValue),
          parseInt(allTransactions?.product),
          parseInt(allTransactions?.membership),
        ],
      },
    ],
  };
  const nullData = {
    labels: ["No data found"],
    datasets: [
      {
        backgroundColor: ["#F6FBFF"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#F6FBFF"],
        data: [1],
      },
    ],
  };

  const permission = userInfo.permission;

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);
    if (deleteModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Staff deleted!");
          getAllStaff();
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const lineChartData = {
    labels: staffSalesDetails && staffSalesDetails.dates,
    datasets: [
      {
        label: "Sale Amount",
        data: staffSalesDetails && staffSalesDetails.amount,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const lineChartData2 = {
    labels: staffSalesDetails && staffSalesDetails.dates,
    datasets: [
      {
        label: "Confirmed",
        data: staffSalesDetails && staffSalesDetails.booking,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Canceled",
        data: staffSalesDetails && staffSalesDetails.cancel,
        fill: true,
        backgroundColor: "#bda3c1",
        borderColor: "#742774",
      },
    ],
  };

  const AttendanceReportToggle = () => {
    setAttendanceReportModal(!attendanceReportModal);
  };

  const getInvoices = async () => {};

  const ViewInvoiceModalToggle = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
  };

  const ViewInvoice = async (e, data) => {
    // let currentInvoice = await allInvoices.find((invoice) => {
    //   return invoice.invoiceId === data.invoiceId && invoice;
    // });
    ViewInvoiceModalToggle();
    let res = await ApiGet("invoice/value/" + data.invoiceDefaultId);
    try {
      if (res.data.status === 200) {
        setInvoiceDetail(res?.data?.data?.invoiceAllData[0]);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const TostMSG = (data) => {
    if (data) {
      if (data === "SMS") {
        setSuccess(true);
        setToastmsg("SMS sent successfully!");
        // getAllTransactions();
        setInvoiceDetail();
      } else if (data === "DELETE") {
        setSuccess(true);
        setToastmsg("Invoice deleted!");
        // getAllTransactions();
        setInvoiceDetail();
      } else if (data === "EDIT") {
        setSuccess(true);
        setToastmsg("Changes saved");
        // getAllTransactions();
        setInvoiceDetail();
      } else if (data === "Due") {
        setSuccess(true);
        setToastmsg("Due cleared");
        // getAllTransactions();
        setInvoiceDetail();
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  const renderMobileSidebar = () => {
    let divEle = document.getElementsByClassName("sidebar-banner")[0];
    divEle.classList?.toggle("sidebar-display");
  };

  const handleEdit = async (values) => {
    let res = await ApiPut("staff/" + values._id, values);
    try {
      if (res.data.status === 200) {
        getAllStaff(values);
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
      } else {
        toast.error(res.data.message, {
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

  const handleTab = (e, tabName) => {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(
        " staff-active-btn",
        ""
      );
    }
    document.getElementById(tabName).style.display = "block";
    e.currentTarget.className += " staff-active-btn";
  };

  const handleSubmit = async (values) => {
    let res = await ApiPost("staff/", values);
    try {
      if (res.data.status === 200) {
        setCreateStaffModal(false);
        getAllStaff();
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
        toast.error("Staff Already Reported", {
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

  const getAllStaff = async (values) => {
    try {
      setLoading(true);
      let res = await ApiGet("staff/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setAllStaff(res.data.data.filter((rep) => rep.default === false));

        if (userInfo && userInfo.role === "Staff") {
          setFilteredData(
            res.data.data.filter((rep) => rep._id === userInfo._id)
          );
        } else {
          setFilteredData(res.data.data.filter((rep) => rep.default === false));
        }

        if (res.data.data.length && !values) {
          setStaffDetails(res.data.data[1]);
        } else {
          setLoading(false);
          setStaffDetails(values);
        }
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  const getAllTransactions = async (data) => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
    };
    try {
      setLoading(true);
      let res = await ApiPost(
        "invoice/staff/transaction/" + data.companyId + "/" + data._id,
        payload
      );
      if (res.data.status === 200) {
        setLoading(false);
        setAllTransactions(res.data.data);
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Transactions", err);
    }
  };

  const getAllPay = async (data) => {

    if(data){
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
      companyId: data.companyId,
      staffId:data._id
    };
    try {
      setLoading(true);
      let res = await ApiPost(
        "expence/staff/entry",
        payload
      );
      if (res.data.status === 200) {
        setLoading(false);
        let totalPay=res.data.data
        .map((item) => item.amount)
        .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) 
        console.log("responcesss",res.data.data,totalPay)
        setStaffPay(res.data.data?.reverse());
        setStaffPayTotal(totalPay)
      } else {
        
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Transactions", err);
    }
  }
  };

  async function getAllServices(e) {
    try {
      setLoading(true);
      let res = await ApiGet("service/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setAllServices(res.data.data);
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Services", err);
    }
  }

  async function getAllCustomerInvoices() {
    try {
      setLoading(true);
      let allCustomerInvoices = await ApiGet(
        "invoice/company/" + userInfo.companyId
      );
      if (allCustomerInvoices.status === 200) {
        setLoading(false);
        setAllInvoices(allCustomerInvoices.data.data);
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Services", err);
    }
  }

  const handleFilterSales = async (e) => {
    if (e.target.value === "All") {
      setServiceSales("all");
    } else {
      setServiceSales(e.target.value);
    }
  };

  const handleFilterAppointment = async (e) => {
    if (e.target.value === "All") {
      setServiceAppointment("all");
    } else {
      setServiceAppointment(e.target.value);
    }
  };

  const editStaffDetails = (e, data) => {
    AddNewStaffModaltoggle();
    setEditStaff(data);
  };

  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(async () => {
    if (userInfo && userInfo.role === "Staff") {
      let staffData = [];
      staffData.push(userInfo);
      setIsStaff(true);
      setAllStaff(staffData);
      setFilteredData(staffData);
      setStaffDetails(userInfo);
      getAllServices();
    } else {
      getAllStaff();
      getAllServices();
    }
  }, []);

  useEffect(() => {
    if (endDate) {
      getAllTransactions(staffDetails);
      getAllPay(staffDetails)
    }
  }, [startDate, endDate]);

  useEffect(() => {
    getAllCustomerInvoices();
  }, [toastmsg]);

  useEffect(async () => {
    if (staffDetails) {
      updateStaffDetails(staffDetails);

      let appointmentRes = await ApiGet(
        "appointment/staff/" + staffDetails.companyId + "/" + staffDetails._id
      );
      if (appointmentRes.status === 200) {
        setAppointmentDetails(appointmentRes.data.data);
        setFinalAmount(appointmentRes.data.data.finalAmount);
        // setTotalAppointment(appointmentRes.data.data.booking)
      } else {
        console.log("in the else");
      }
      try {
        setLoading(true);
        let apiBody = {
          companyId: userInfo.companyId,
          staffId: staffDetails._id,
          startTime: moment().subtract(6, "day").format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD"),
        };
        let res = await ApiPost("staff/sales/company/" + serviceSales, apiBody);
        if (res.data.status === 200) {
          setLoading(false);
          let details = res.data.data;
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
          // for (let [key, value] of Object.entries(details && details.appointmentList)) {
          //     details[getDateDay(key)] = value;
          // }
          setStaffSalesDetails(details);
          let amountArray = details.amount;
          let sum = amountArray.reduce(function (a, b) {
            return a + b;
          }, 0);
          setFinalAmount(sum);
          // setTotalAppointment(details.totalAppts)
        }
      } catch (err) {
        setLoading(false);
        console.log("error while getting Forum", err);
      }
    }
  }, [staffDetails, serviceSales, toastmsg]);

  useEffect(async () => {
    if (staffDetails) {
      let serviceListResp = await ApiGet(
        "staff/service/details/data/" +
          staffDetails.companyId +
          "/" +
          staffDetails._id
      );
      if (serviceListResp.status === 200) {
        setServiceList(serviceListResp.data.data);
      } else {
        console.log("else");
      }
    }
  }, [staffDetails]);

  useEffect(() => {
    if (staffDetails) {
      let filter = staffDetails?.workingDays?.filter(
        (rep) => rep.dayOff === true
      );
      setWeekOff(filter);
    }
  }, [staffDetails]);

  useEffect(async () => {
    if (staffDetails) {
      let appointmentRes = await ApiGet(
        "appointment/staff/" + staffDetails.companyId + "/" + staffDetails._id
      );
      if (appointmentRes.status === 200) {
        setAppointmentDetails(appointmentRes.data.data);
        // setFinalAmount(appointmentRes.data.data.finalAmount)
        setTotalAppointment(appointmentRes.data.data.booking);
      } else {
        console.log("in the else");
      }
      try {
        setLoading(true);
        let apiBody = {
          companyId: userInfo.companyId,
          staffId: staffDetails._id,
          startTime: moment().subtract(6, "day").format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD"),
        };
        let res = await ApiPost(
          "staff/sales/company/" + serviceAppointment,
          apiBody
        );
        if (res.data.status === 200) {
          setLoading(false);
          let details = res.data.data;
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
          // for (let [key, value] of Object.entries(details && details.appointmentList)) {
          //     details[getDateDay(key)] = value;
          // }

          setStaffSalesDetails(details);
          let amountArray = details.amount;
          let sum = amountArray.reduce(function (a, b) {
            return a + b;
          }, 0);
          // setFinalAmount(sum)
          setTotalAppointment(details.totalAppts);
        }
      } catch (err) {
        setLoading(false);
        console.log("error while getting Forum", err);
      }
    }
  }, [staffDetails, serviceAppointment]);

  useEffect(() => {
    let filterData = allStaff;
    if (search) {
      setFilteredData(
        filterData.filter(
          (obj) =>
            (obj &&
              obj.firstName &&
              // obj.lastName &&
              (obj.firstName + " " + obj.lastName)
                .toLowerCase()
                .includes(search.toLowerCase())) ||
            (obj &&
              obj.mobileNumber &&
              obj.mobileNumber.includes(search.toLowerCase()))
        )
      );
    } else {
      if (userInfo && userInfo.role === "Staff") {
        let staffData = [];
        staffData.push(userInfo);
        setIsStaff(true);
        setFilteredData(staffData);
      } else {
        setFilteredData(allStaff);
      }
    }
  }, [search]);

  // -----------------------------------------------------------NEW CODE------------------------------------------------------------

  const sortStaff = filteredData?.sort(function (a, b) {
    if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
    if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
    return 0;
  });

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array?.filter(
      (obj) => !check?.has(obj[key]) && check?.add(obj[key])
    );
  };

  useEffect(() => {
    setTemTopServices([]);

    let temServiceArray = allTransactions?.serviceCount;
    let uniqueCategoryIdServices = removeDuplicateObjectFromArray(
      temServiceArray,
      "categoryId"
    );
    let temCategoryId = uniqueCategoryIdServices?.map(
      (service) => service?.categoryId
    );
    let topServices = temCategoryId?.map((id) => {
      return allServices?.find(
        (service) => service?.categoryId === id && service
      );
    });
    setTemTopServices(topServices);
    return () => setTemTopServices([]);
  }, [allTransactions, allServices, staffDetails]);
  const deleteStaff = (e, data) => {
    opendeleteModal();
    setDeleteStaffId(data._id);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  const updateStaffDetails = (data) => {
    setStaffDetails(data);
    getAllTransactions(data);
    getAllPay(data)
  };

  return (
    <>
      {childSidebar && <ChildSidebar modal={childSidebar} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="content"
        id="main-contain"
      >
     
        <div className="container-fluid container-left-right-space">


          {addNewStaffModal && (
            <AddNewStaffModal
              modal={addNewStaffModal}
              toggle={AddNewStaffModaltoggle}
              editStaff={editStaff}
              serviceList={serviceList}
              SettingInfo={SettingInfo}
            />
          )}

          {deleteModal && (
            <Delete
              modal={deleteModal}
              toggle={deleteModaltoggle}
              deleteStaffId={deleteStaffId}
            />
          )}

          <div className="dashboard-header">
            <div className="header-alignment">
              <div className="header-title">
                <i
                  class="fas fa-bars"
                  onClick={() => setChildSidebar(!childSidebar)}
                ></i>
                <h2>Staff</h2>
              </div>
              <div className="header-notification">
                {/* <div className="icon-design">
                  <div className="relative">
                    <img src={BellImage} alt="BellImage" />
                  </div>
                  <div className="bell-icon-design"></div>
                </div> */}
                {/* {permission?.filter((obj)=>obj.name ===  "Settings page")?.[0]?.isChecked === false ? null : */}
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

          <div className="customer-grid">
            <div className="customer-grid-items">
              <div className="customer-information-box">
                <div className="customer-search">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search name or number"
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                    <div className="search-icon-alignment">
                      <img src={SearchIcon} alt="SearchIcon" />
                    </div>
                  </div>
                </div>
                <div className="customer-list-box-height">
                  {sortStaff && sortStaff.length > 0 ? (
                    sortStaff.map((staff) => {
                      return (
                        <div
                          key={staff._id}
                          className={
                            staffDetails?._id === staff?._id
                              ? "customer-details-show-active"
                              : "customer-details-show"
                          }
                          onClick={() => updateStaffDetails(staff)}
                        >
                          <div className="customer-list">
                            <div className="customer-profile-grid">
                              <div className="customer-profile-grid-items">
                                <div className="cus-profile">
                                  <span>
                                    {staff && staff.firstName
                                      ? staff.firstName[0].toUpperCase()
                                      : "A"}
                                    {staff && staff.lastName
                                      ? staff.lastName[0].toUpperCase()
                                      : ""}
                                  </span>
                                </div>
                              </div>
                              <div className="customer-profile-grid-items">
                                <h6>
                                  {staff?.firstName + " " + staff?.lastName}
                                </h6>
                                <p>{staff?.mobileNumber}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="customer-new-empty-height-alignment">
                      <div className="all-globally-new-statement-empty-alignment">
                        <div className="icon-center-alignment">
                          <img src={CusEmptyIcon} alt="CusEmptyIcon" />
                        </div>
                        <div className="text-style">  
                          <p>No staff added so far</p>
                          <h4>
                            Click on <a>Add new</a> to add your first staff
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="customer-grid-items">
              {permission?.filter((obj) => obj.name === "Staff attendance")?.[0]
                ?.isChecked === false &&
              permission?.filter((obj) => obj.name === "Staff commission")?.[0]
                ?.isChecked === false &&
              permission?.filter((obj) => obj.name === "Add new staff")[0]
                ?.isChecked === false ? null : (
                <div className="import-panel-design">
                  <div className="import-panel-design-button-display">
                    {permission?.filter(
                      (obj) => obj.name === "Staff attendance"
                    )?.[0]?.isChecked === false
                      ? null
                      : SettingInfo?.attendence?.attendanceToggle && (
                          <div className="button-end-side">
                            <button
                              className="commission-button"
                              onClick={(e) => AttendanceReportToggle()}
                            >
                              Attendance
                            </button>
                          </div>
                        )}

                    {permission?.filter(
                      (obj) => obj.name === "Staff commission"
                    )?.[0]?.isChecked === false ? null : (
                      <div className="button-end-side">
                        <button
                          className="commission-button"
                          onClick={(e) =>
                            setCommissionTransactionModal(
                              !commissionTransactionModal
                            )
                          }
                        >
                          Commissions
                        </button>
                      </div>
                    )}

                    {permission?.filter(
                      (obj) => obj.name === "Add new staff"
                    )[0]?.isChecked === false ? null : (
                      <div className="button-end-side">
                        <button
                          className="add-new-button"
                          onClick={() => AddNewStaff()}
                        >
                          Add new
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="customer-full-information-box">
                <div className="personal-date-grid">
                  <div className="personal-date-grid-items">
                    <div className="customer-main-edit-profile-box">
                      <div className="customer-main-profile">
                        {
                          // staffDetails?.profilePic ? (
                          //   <div className="customer-profile-image">
                          //     <img src={ProfileImage} alt="ProfileImage" />
                          //   </div>
                          // ) :
                          <div className="customer-profile-image customer-profile-image-top-10">
                            <div className="no-image-show-use-round">
                              {staffDetails?.firstName
                                ? staffDetails?.firstName[0].toUpperCase()
                                : "A"}
                            </div>
                          </div>
                        }
                        <div className="customer-profile-name">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.firstName +
                                " " +
                                staffDetails?.lastName
                              : ""}
                          </p>
                        </div>
                        <div className="profile-edit-delete-alignment">
                          {staffDetails !== undefined ? (
                            permission?.filter(
                              (obj) => obj.name === "Edit staff"
                            )[0]?.isChecked === false ? null : (
                              <div className="incon-design staff-icon-right-sidealignment">
                                <img
                                  src={ProfileEdit}
                                  alt="ProfileEdit"
                                  onClick={(e) =>
                                    editStaffDetails(e, staffDetails)
                                  }
                                />
                              </div>
                            )
                          ) : permission?.filter(
                              (obj) => obj.name === "Edit staff"
                            )[0]?.isChecked === false ? null : (
                            <div className="incon-design staff-icon-left-sidealignment">
                              <img src={ProfileEdit} alt="ProfileEdit" />
                            </div>
                          )}

                          {staffDetails !== undefined ? (
                            permission?.filter(
                              (obj) => obj.name === "Delete staff"
                            )[0]?.isChecked === false ? null : userInfo &&
                              userInfo.role === "Staff" ? null : (
                              <div
                                className="incon-design"
                                onClick={(e) => deleteStaff(e, staffDetails)}
                              >
                                <img src={ProfileDelete} alt="ProfileDelete" />
                              </div>
                            )
                          ) : permission?.filter(
                              (obj) => obj.name === "Delete staff"
                            )[0]?.isChecked === false ? null : userInfo &&
                            userInfo.role === "Staff" ? null : (
                            <div className="incon-design">
                              <img src={ProfileDelete} alt="ProfileDelete" />
                            </div>
                          )}
                        </div>
                        <div className="cus-tab-design">
                          <ul>
                            <li
                              className={
                                tabHandle === "profile" &&
                                "active-tab-cus-background"
                              }
                              onClick={(e) => setTabHandle("profile")}
                            >
                              Profile
                            </li>
                          
                            {permission?.filter(
                              (obj) => obj.name === "Staff transaction"
                            )[0]?.isChecked === false ? null : (
                              <li
                                className={
                                  tabHandle === "transactions" &&
                                  "active-tab-cus-background"
                                }
                                onClick={(e) => setTabHandle("transactions")}
                              >
                                Transactions
                              </li>
                            )}
                           
                              <li
                                className={
                                  tabHandle === "Pay" &&
                                  "active-tab-cus-background"
                                }
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                                onClick={(e) => setTabHandle("Pay")}
                              >
                              <span className="flex items-center">Pay</span>
                               {tabHandle === "Pay" && <div className="wallet-icon-alignment-new-stroke">
                                  <span  onClick={()=>openStaffPayModal()}>
                                    <img src={button} />
                                  </span>
                                </div>}
                              </li>
                            
                            {permission?.filter(
                              (obj) => obj.name === "Staff attendance"
                            )?.[0]?.isChecked === false
                              ? null
                              : SettingInfo?.attendence?.attendanceToggle && (
                                  <li
                                    className={
                                      tabHandle === "Attendance" &&
                                      "active-tab-cus-background"
                                    }
                                    onClick={(e) => setTabHandle("Attendance")}
                                  >
                                    Attendance
                                  </li>
                                )}
                            {permission?.filter(
                              (obj) => obj.name === "Staff commission"
                            )?.[0]?.isChecked === false ? null : (
                              <li
                                className={
                                  tabHandle === "Commissions" &&
                                  "active-tab-cus-background"
                                }
                                onClick={(e) => setTabHandle("Commissions")}
                              >
                                Commissions
                              </li>
                            )}
                            {permission?.filter(
                              (obj) => obj.name === "Staff analytics"
                            )[0]?.isChecked === false ? null : (
                              <li
                                className={
                                  tabHandle === "analytics" &&
                                  "active-tab-cus-background"
                                }
                                onClick={(e) => setTabHandle("analytics")}
                              >
                                Analytics
                              </li>
                            )}
                              <li
                              className={
                                tabHandle === "working_hours" &&
                                "active-tab-cus-background"
                              }
                              onClick={(e) => setTabHandle("working_hours")}
                            >
                              Working hours
                            </li>
                            <li
                              className={
                                tabHandle === "services" &&
                                "active-tab-cus-background"
                              }
                              onClick={(e) => setTabHandle("services")}
                            >
                              Services
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {tabHandle === "profile" ? (
                    <div className="personal-date-grid-items">
                      <div className="personal-data-heading">
                        <h3>Personal data</h3>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Full Name</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.firstName +
                                " " +
                                staffDetails?.lastName
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Mobile</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.mobileNumber
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>email</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.email
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Gender</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.gender
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Birthday</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined &&
                            staffDetails.birthday !==
                              "Invalid date-Invalid date"
                              ? staffDetails?.birthday
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Salary</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.salary
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Weekoff</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? weekOff?.map((rep) => {
                                  return <>{rep.Day} </>;
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Address</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.address
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="personal-data-grid">
                        <div className="personal-data-grid-items">
                          <span>Notes</span>
                        </div>
                        <div className="personal-data-grid-items">
                          <p>
                            {staffDetails !== undefined
                              ? staffDetails?.notes
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {tabHandle === "working_hours" ? (
                    <div>
                      <div className="personal-date-grid-items border-right-remove">
                        <div className="personal-data-heading">
                          <h3>Working hours</h3>
                        </div>
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
                          {staffDetails && staffDetails.workingDays
                            ? staffDetails.workingDays.map((day, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={
                                      day?.isStoreClosed === true
                                        ? "working-time-grid disable-background"
                                        : day?.dayOff === true
                                        ? "working-time-grid disable-background"
                                        : "working-time-grid"
                                    }
                                  >
                                    <div className="working-grid-items">
                                      <span>{day.Day}</span>
                                    </div>
                                    <div className="working-grid-items input-packge-time-style-chanage">
                                      {day?.isStoreClosed === true ? (
                                        <button
                                          style={{
                                            backgroundColor:
                                              "rgb(230, 102, 102, 0.3)",
                                            color: "rgb(230, 102, 102)",
                                          }}
                                        >
                                          Store Closed
                                        </button>
                                      ) : day?.dayOff === true ? (
                                        <button>off day</button>
                                      ) : (
                                        <button>{day.starttime}</button>
                                      )}
                                    </div>
                                    <div className="working-grid-items input-packge-time-style-chanage">
                                      {day?.isStoreClosed === true ? (
                                        <button
                                          style={{
                                            backgroundColor:
                                              "rgb(230, 102, 102, 0.3)",
                                            color: "rgb(230, 102, 102)",
                                          }}
                                        >
                                          Store Closed
                                        </button>
                                      ) : day?.dayOff === true ? (
                                        <button>off day</button>
                                      ) : (
                                        <button>{day.endtime}</button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {tabHandle === "services" && (
                    <div className="personal-date-grid-items">
                      <div className="personal-service-title">
                        <h1>Services</h1>
                        {serviceList.length > 0 ? (
                          serviceList.map((service) => {
                            return (
                              <div
                                key={service._id}
                                className="service-grid-staff"
                              >
                                <div className="service-grid-staff-items">
                                  <p>{service?.categoryName}</p>
                                </div>
                                <div className="service-grid-staff-items">
                                  <div
                                    className="first-background-squre squre-box-design"
                                    style={{
                                      backgroundColor: service?.categoryColor,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="service-empty-box-height-alignment">
                            <div className="all-globally-new-statement-empty-alignment">
                              <div className="icon-center-alignment">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.33333 19.1177C8.33333 16.9736 6.69171 15.2354 4.66667 15.2354C2.64162 15.2354 1 16.9736 1 19.1177C1 21.2618 2.64162 23 4.66667 23C6.69171 23 8.33333 21.2618 8.33333 19.1177Z"
                                    stroke="#97A7C3"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M22.9998 19.1177C22.9998 16.9736 21.3582 15.2354 19.3332 15.2354C17.3081 15.2354 15.6665 16.9736 15.6665 19.1177C15.6665 21.2618 17.3081 23 19.3332 23C21.3582 23 22.9998 21.2618 22.9998 19.1177Z"
                                    stroke="#97A7C3"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M2.22217 1.00011L16.7422 16.374"
                                    stroke="#97A7C3"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M15.0312 8.15723L21.7779 1.00085"
                                    stroke="#97A7C3"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M7.2583 16.374L12.0005 11.3529"
                                    stroke="#97A7C3"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="text-style">
                                <p>
                                  No services assigned to the staff added so far
                                </p>
                                <h5>
                                  <a>Add new</a> or <a>Edit staff</a> to assign
                                  your first service to the staff
                                </h5>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {tabHandle === "transactions" && (
                    <div className="personal-date-grid-items">
                      <div className="personal-service-title Transactions-content-alignment">
                        <h1>Transactions</h1>
                        <button>
                          <img src={CalendarIcon} alt="CalendarIcon" />
                          <span>
                            <DatePicker
                              selected={startDate}
                              startDate={startDate}
                              endDate={endDate}
                              placeholderText="Date"
                              dateFormat="d MMM ''yy"
                              onChange={handleOnChange}
                              onKeyDown={(e) => e.preventDefault()}
                              selectsRange
                              fixedHeight
                            />
                          </span>
                        </button>
                      </div>
                      <div className="personal-transition-table">
                        <table className="personal-data-table">
                          <tr>
                            <th align="left">Date</th>
                            <th align="left">Customer name</th>
                            <th align="left">Invoice No.</th>
                            <th align="right">Amount</th>
                          </tr>

                          {allTransactions?.data?.length > 0 ? (
                            allTransactions &&
                            [...allTransactions.data]
                              ?.reverse()
                              .map((transaction) => {
                                return (
                                  <tr>
                                    <td>
                                      {moment(transaction?.date).format(
                                        "DD-MMM-YYYY"
                                      )}
                                    </td>
                                    <td>
                                      {transaction?.customer?.firstName
                                        ? transaction?.customer?.firstName
                                        : "Walk-in Customer"}
                                    </td>
                                    <td
                                      onClick={(e) =>
                                        ViewInvoice(e, transaction)
                                      }
                                    >
                                      <div className="convart-blue">
                                        <span style={{ color: "1479FF" }}>
                                          #{transaction?.invoiceId}
                                        </span>
                                      </div>
                                    </td>
                                    <td align="right">
                                      <span
                                        style={{
                                          fontFamily: "'Roboto', sans-serif",
                                        }}
                                      >
                                        {SettingInfo?.currentType}
                                      </span>{" "}
                                      {parseInt(transaction?.amount)}
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <></>
                            // <div className="system-does-not ">
                            //   <p className="text-center">No transactions</p>
                            // </div>
                          )}
                        </table>
                        <div className="no-transition-empty-height-box">
                          <div className="all-globally-new-statement-empty-alignment">
                            <div className="icon-center-alignment">
                              <svg
                                width="22"
                                height="26"
                                viewBox="0 0 22 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.5 0.5H3.5C2.83696 0.5 2.20107 0.763392 1.73223 1.23223C1.26339 1.70107 1 2.33696 1 3V23C1 23.663 1.26339 24.2989 1.73223 24.7678C2.20107 25.2366 2.83696 25.5 3.5 25.5H18.5C19.163 25.5 19.7989 25.2366 20.2678 24.7678C20.7366 24.2989 21 23.663 21 23V8L13.5 0.5Z"
                                  stroke="#97A7C3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M13.5 0.5V8H21"
                                  stroke="#97A7C3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M16 14.25H6"
                                  stroke="#97A7C3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M16 19.25H6"
                                  stroke="#97A7C3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M9.5 9.25H6"
                                  stroke="#97A7C3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                            <div className="text-style">
                              <p>No transactions to show</p>
                              <h4>
                                Click on <a>Add new</a> to add your first staff
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tabHandle === "analytics" && (
                    <div className="personal-date-grid-items">
                      <div className="personal-service-title Transactions-content-alignment">
                        <h1>Analytics</h1>
                        <button>
                          <img src={CalendarIcon} alt="CalendarIcon" />
                          <span>
                            <DatePicker
                              selected={startDate}
                              startDate={startDate}
                              endDate={endDate}
                              placeholderText="Date"
                              dateFormat="d MMM ''yy"
                              onChange={handleOnChange}
                              onKeyDown={(e) => e.preventDefault()}
                              selectsRange
                              fixedHeight
                            />
                          </span>
                        </button>
                      </div>
                      <div className="customer-total-sale-design">
                        <div className="total-sale-grid">
                          <div className="total-sale-grid-items">
                            <div className="sub-grid">
                              <div className="sub-grid-items">
                                <div className="box-design">
                                  {SettingInfo?.currentType}
                                </div>
                              </div>
                              <div className="sub-grid-items">
                                <p>Total Revenue</p>
                                <h3>
                                  <span>{SettingInfo?.currentType}</span>{" "}
                                  {parseInt(allTransactions?.revenue)}
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className="total-sale-grid-items-chart">
                            <div className="cus-chart-grid">
                              <div className="cus-chart-grid-items">
                                <div>
                                  {parseInt(
                                    allTransactions?.serviceCountValue
                                  ) !== 0 && (
                                    <div className="service-amount-text-alignment">
                                      <div className="tital-roun-alignment">
                                        <div className="customer-heighlight first-round-background"></div>
                                        <p>Service</p>
                                      </div>
                                      <div className="customer-price-text">
                                        <p>
                                          <span>
                                            {SettingInfo?.currentType}
                                          </span>{" "}
                                          {parseInt(
                                            allTransactions?.serviceCountValue
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {parseInt(allTransactions?.product) !== 0 && (
                                    <div className="service-amount-text-alignment">
                                      <div className="tital-roun-alignment">
                                        <div className="customer-heighlight sec-round-background"></div>
                                        <p>Product</p>
                                      </div>
                                      <div className="customer-price-text">
                                        <p>
                                          <span>
                                            {SettingInfo?.currentType}
                                          </span>{" "}
                                          {parseInt(allTransactions?.product)}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {parseInt(allTransactions?.membership) !==
                                    0 && (
                                    <div className="service-amount-text-alignment">
                                      <div className="tital-roun-alignment">
                                        <div className="customer-heighlight third-round-background"></div>
                                        <p>Membership</p>
                                      </div>
                                      <div className="customer-price-text">
                                        <p>
                                          <span>
                                            {SettingInfo?.currentType}
                                          </span>{" "}
                                          {parseInt(
                                            allTransactions?.membership
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="cus-chart-grid-items">
                                {/* {(customerAnalytics?.service === 0 ||
                                    customerAnalytics?.service === null) &&
                                  customerAnalytics?.product === 0 ? ( */}
                                <Pie
                                  data={data}
                                  width={60}
                                  height={60}
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
                                    tooltips: {
                                      enabled: false,
                                    },
                                  }}
                                />
                              
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="analytics-cus-grid">
                   
                        <div className="analytics-cus-grid-items">
                          <div className="analytics-sub-grid">
                            <div className="analytics-sub-grid-items">
                              <div className="analytics-icon-design">
                                <img
                                  src={AverageTicketSize}
                                  alt="AverageTicketSize"
                                />
                              </div>
                            </div>
                            <div className="analytics-sub-grid-items">
                              <p>Average ticket size</p>
                              <h1>
                                <span>{SettingInfo?.currentType}</span>{" "}
                                {allTransactions?.revenue === 0 ||
                                allTransactions?.service === 0
                                  ? 0
                                  : parseFloat(
                                      allTransactions?.revenue /
                                        allTransactions?.service
                                    ).toFixed(2)}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="analytics-cus-grid-items">
                          <div className="analytics-sub-grid">
                            <div className="analytics-sub-grid-items">
                              <div className="analytics-icon-design">
                                <img
                                  src={ProvidedServices}
                                  alt="ProvidedServices"
                                />
                              </div>
                            </div>
                            <div className="analytics-sub-grid-items">
                              <p>Provided services</p>
                              <h1> {allTransactions?.service}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                     

                      <div className="top-categories-card-alignment">
                        <div className="analytics-top-categories-box-design">
                          <div className="analytics-top-categories-grid">
                            <div className="analytics-top-categories-grid-items">
                              <div className="analytics-icon-design">
                                <img
                                  src={ProvidedServices}
                                  alt="ProvidedServices"
                                />
                              </div>
                            </div>
                            <div className="analytics-top-categories-grid-items">
                              <p>Top 3 service categories</p>
                            </div>
                          </div>
                          <div className="analytics-top-categories-left-alignment">
                            <div className="select-grid">
                              {/* {allTransactions?.serviceCount?.map((service) => { */}
                              {temTopServices?.slice(0, 3).map((service) => {
                                return (
                                  <>
                                    <div className="select-grid-items">
                                      <div
                                        className="select-heighlight"
                                        style={{ background: service?.colour }}
                                      ></div>
                                    </div>
                                    <div className="select-grid-items">
                                      <p>{service?.categoryName}</p>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {tabHandle === "Commissions" ? (
                    <>
                      <CommissionTab
                        staffDetails={staffDetails}
                        SettingInfo={SettingInfo}
                      />
                    </>
                  ) : null}
                  {tabHandle === "Attendance" ? (
                    <>
                      <AttendanceTab
                        staffDetails={staffDetails}
                        SettingInfo={SettingInfo}
                      />
                    </>
                  ) : null}
                   {tabHandle === "Pay" ? (
                    <>
                    
                      <PayTab
                         staffDetails={staffDetails}
                      staffPayTotal={staffPayTotal} 
                      staffPay={staffPay}
                      SettingInfo={SettingInfo}
                      getAllPay={getAllPay}
                      endDate={endDate}
                      startDate={startDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

        </div>
        {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      </motion.div>
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
      {commissionTransactionModal && (
        <CommissionTransaction
          setCommissionTransactionModal={setCommissionTransactionModal}
        />
      )}
      {attendanceReportModal && (
        <AttendanceReport toggle={AttendanceReportToggle} />
      )}
      {staffPayModal && <StaffSalary    SettingInfo={SettingInfo} toggle={openStaffPayModal} staffId={staffDetails?._id}  userInfo={userInfo} /> }
    </>
  );
}
