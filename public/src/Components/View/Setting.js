import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ApiGet, ApiPost } from "./../../helpers/API/ApiData";
import moment from "moment";
import Auth from "../../helpers/Auth";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SettingIcon from "../../assets/svg/setting.svg";
import BellImage from "../../assets/svg/bell.svg";
import SearchIcon from "../../assets/svg/search-icon.svg";
import "../Sass/Setting.scss";
import UserContext from "../../helpers/Context";
import RolesAndPermissionModal from "../Common/Modal/RolesAndPermissionModal";
import MembershipSetting from "./Setting/MembershipSetting";
import RolesAndPermissions from "./Setting/RolesAndPermissions";
import InventorySetting from "./Setting/InventorySetting";
import InvoiceSetting from "./Setting/InvoiceSetting";
import AppointmentSetting from "./Setting/AppointmentSetting";
import GeneralSetting from "./Setting/GeneralSetting";
import { get_Setting } from "../../utils/user.util";
import * as userUtil from "../../utils/user.util";
import { setCurrencyCode } from "@syncfusion/ej2-base";
import { useDispatch, useSelector } from "react-redux";
import {
  setOperatorPermissions,
  setOperatorPermissionsId,
  setStaffPermissions,
  setStaffPermissionsId,
} from "../../redux/actions/permissionsActions";
import StaffSetting from "./Setting/StaffSetting";
import { motion } from "framer-motion";
import {
  setattendanceDate,
  setattendanceMarkDate,
} from "../../redux/actions/attendanceActions";
import AccountSetting from "./Setting/AccountSetting";
import UpgradePlan from "../Common/Modal/Monitization/UpgradePlan";
import { useHistory } from "react-router-dom";
import PlanDetail from "../Common/Modal/Monitization/PlanDetail";
import { settrialDays } from "../../redux/actions/monitizationActions";
import SucessPlanPayment from "../Common/Modal/Monitization/SucessPlanPayment";
import CollectionSetting from "./Setting/CollectionSetting";

export const Setting = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const renderMobileSidebar = () => {
    let divEle = document.getElementsByClassName("sidebar-banner")[0];
    divEle.classList.toggle("sidebar-display");
  };

  const userInfo = Auth.getUserDetail();
  const permission = userInfo.permission;

  const {
    setIsDisable,
    setIsBarcode,
    setIsProductType,
    setIsMembership,
    setIsMembershipType,
    setApplyMembershipBenefit,
  } = useContext(UserContext);
  const [firstTimeSetup, setFirstTimeSetup] = useState(true);
  const [allStaff, setAllStaff] = useState();
  const [loading, setLoading] = useState(false);
  const [lounge, setLounge] = useState(false);
  const [retailMenu, setRetailMenu] = useState(false);
  const [benefitDropdown, setBenefitDropdown] = useState(false);
  const [applyBenefitDropdown, setApplyBenefitDropdown] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [popularHours, setPopularHours] = useState(false);
  const [firstDay, setFirstDay] = useState();
  const [settingData, setSettingData] = useState();
  const [currencyData, setCurrencyData] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [isQuickToggle, setIsQuickToggle] = useState(true);
  const [walkInToggle, setWalkInToggle] = useState(true);
  const [serviceToggle, setServiceToggle] = useState(true);
  const [staffToggle, setStaffToggle] = useState(true);
  const [customerForAppointment, setCustomerForAppointment] = useState(false);
  const [customerForInvoices, setCustomerForInvoices] = useState(false);
  const [enableIn, setEnableIn] = useState(false);
  const [enableBarcode, setEnableBarcode] = useState(true);
  const [enableMembership, setEnableMembership] = useState(true);
  const [productType, setProductType] = useState("Store Consumable & Retail");
  const [storeTiming, setStoreTiming] = useState();
  const [taxDetails, setTaxDetails] = useState({});
  const [saveChanges, setSaveChanges] = useState(true);
  const [editOptions, setEditOptions] = useState(false);
  const [workday, setWorkday] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [bookingInterval, setBookingInterval] = useState();
  const [membershipBenefit, setMembershipBenefit] = useState("Free services");
  const [applyMembershipBenefitFrom, setApplyMembershipBenefitFrom] =
    useState("Same invoice");
  const [applyMembershipBenefitBoolean, setApplyMembershipBenefitBoolean] =
    useState(true);
  const [membershipToggle, setMembershipToggle] = useState(true);
  const [key, setKey] = useState();
  const [saloonDetail, setSaloonDetail] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [allServices, setAllServices] = useState([]);
  const [frequentServices, setFrequentServices] = useState([]);
  const [enableFrequentServices, setEnableFrequentServices] = useState(false);
  const [page, setPage] = useState("");
  const [companyOwnersAccounts, setCompanyOwnersAccounts] = useState([]);
  const [companyOperatorsAccounts, setCompanyOperatorsAccounts] = useState([]);
  const [assignMultipleStaff, setAssignMultipleStaff] = useState(false);
  const [assignStaffForMembership, setAssignStaffForMembership] =
    useState(false);
  const [assignStaffForProduct, setAssignStaffForProduct] = useState(false);

  const [attendanceToggle, setAttendanceToggle] = useState();
  const [attendanceForInvoiceToggle, setAttendanceForInvoiceToggle] =
    useState();
  const [bufferOptions, setBufferOptions] = useState(false);
  const [bufferTime, setBufferTime] = useState();
  const [attendanceMarkDate, setAttendanceMarkDate] = useState(new Date());
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [openExpireModal, setOpenExpiremodal] = useState(false);
  const [openPlanDetaiilsmodal, setOpenPlanDetailsmodal] = useState(false);
  const trialDay = useSelector((state) => state.trialDays);
  let SettingInfo = get_Setting();
  const [planFeture, setPlanFeture] = useState([]);
  const [defaultFeature, setDefaultFeature] = useState([]);
  const [trialDays, setTrialDays] = useState();
  const [planName, setPlanName] = useState();
  const [expireDate, setExpireDate] = useState();
  const [planBills, setPlanBills] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [currentInvoices, setCurrentInvoices] = useState([]);
  const [currentInvoicesNo, setCurrentInvoicesNo] = useState();
  const [customersAdded, setCustomersAdded] = useState([]);
  const [dueCount, setDueCount] = useState();
  const [dueAmountTotal, setDueAmountTotal] = useState();
  const [appointmentNo, setAppointmentNo] = useState();
  const [sucessPayment, setSucessPayment] = useState(false);
  const [invoiceData, setInvoiceData] = useState();
  const [featureOn, setFeatureOn] = useState(false);
  const [enablePaymentMethod, setEnablePaymentMethod] = useState(false);
  const [collectionpaymentMethod, setCollectionPaymentMethod] = useState(["Cash"]);
  const [selectedPaymentMethod,setSelectedPaymentMethod]=useState([])
  

  useEffect(() => {
    setTrialDays(trialDay);
  }, [trialDay]);

  const getAllCustomers = () => {
    ApiGet("customer/company/" + userInfo.companyId)
      .then((responce) => {
        let serchedCustomer = responce.data.data.filter(
          (item) =>
            moment(moment(item?.created).format("yyyy-MM-DD")).isAfter(
              moment(new Date()).subtract(365, "days").format("yyyy-MM-DD")
            ) &&
            moment(moment(item?.created).format("yyyy-MM-DD")).isBefore(
              moment(new Date()).add(1, "days").format("yyyy-MM-DD")
            )
        );

        setCustomersAdded(serchedCustomer?.length);
      })
      .catch((er) => {
        console.log(er);
      });
  };

  const getDueAndWallet = async () => {
    let payload = {
      startTime: moment(new Date()).subtract(1, "year").format("L"),
      endTime: moment(new Date()).add(1, "days").format("L"),
      companyId: userInfo.companyId,
    };
    let res = await ApiPost(
      "dashboard/topup/entry/wallet/data/value/invoice/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setDueAmountTotal(res?.data?.data?.invoiceValue);
        setDueCount(res?.data?.data?.invoiceCount);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const getSalesData = async () => {
    let payload = {
      startTime: moment(new Date()).subtract(1, "year").format("L"),
      endTime: moment(new Date()).add(1, "days").format("L"),
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
  const getInvoices = async () => {
    let res = await ApiGet("invoice/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        let invoiceList = res.data.data;
        let filteredInvoiceList = invoiceList?.map((item) => {
          if (
            moment(moment(item?.date).format("yyyy-MM-DD")).isAfter(
              moment(new Date()).subtract(365, "days").format("yyyy-MM-DD")
            ) &&
            moment(moment(item?.date).format("yyyy-MM-DD")).isBefore(
              moment(new Date()).add(1, "days").format("yyyy-MM-DD")
            )
          ) {
            return item;
          }
        });
        let removeManualMembership = filteredInvoiceList?.filter(
          (obj) =>
            obj.isCustomerWithoutMembership === true && obj.isActive === true
        );
        setCurrentInvoices(removeManualMembership);
        let walkinremove = removeManualMembership?.filter(
          (obj) => obj.customer
        );
        setCurrentInvoicesNo(walkinremove?.length);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const getAppointments = async () => {
    let res = await ApiGet("appointment/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        let AppList = res.data.data;

        let filteredAppointment = AppList?.map((item) => {
          if (
            moment(moment(item?.date).format("yyyy-MM-DD")).isAfter(
              moment(new Date()).subtract(365, "days").format("yyyy-MM-DD")
            ) &&
            moment(moment(item?.date).format("yyyy-MM-DD")).isBefore(
              moment(new Date()).add(1, "days").format("yyyy-MM-DD")
            )
          ) {
            return item;
          }
        });
        let removeundefined = filteredAppointment?.filter(
          (obj) => obj !== undefined
        );
        let removeWalkin = removeundefined?.filter((obj) => obj.customer);
        setAppointmentNo(removeWalkin?.length);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  useEffect(() => {
    if (
      userInfo.role !== "Operator" &&
      userInfo?.role !== "Staff" &&
      trialDay <= 30
    ) {
      getSalesData();
      getInvoices();
      getAppointments();
      getAllCustomers();
      getDueAndWallet();
    }
  }, []);

  useEffect(() => {
    
      getMyPlan();
    
  }, []);

  const gettrialDays = async (companyId) => {
    await ApiGet("monetize/company/remainingDays/" + userInfo?.companyId)
      .then(async (res) => {
        if (res?.data?.status === 200) {
         
          if (!res.data.data.differnce) {
            dispatch(settrialDays(0));
          } else {
            dispatch(settrialDays(res.data.data?.differnce));
            setTrialDays(res.data.data?.differnce);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getMyPlan = async () => {
    let resp = await ApiGet("monetize/company/" + userInfo?.companyId);
    if (resp.data.status === 200) {
      if (resp.data.data.length > 0) {
      if(resp.data.data[0].paymentData[
        resp.data.data[0].paymentData?.length - 1
      ]?.planId?.planService){
        setDefaultFeature(
          resp.data.data[0].paymentData[
            resp.data.data[0].paymentData?.length - 1
          ]?.planId?.planService
        );
      }
        setPlanName(
          resp.data.data[0].paymentData[
            resp.data.data[0].paymentData?.length - 1
          ]?.planId?.planName
        );
        setExpireDate(resp.data.data[0].finalDate);
        setPlanBills(resp.data.data[0].paymentData);
      }
    }
  };

  useEffect(async () => {
    
      let resp = await ApiGet("monetizePlan");
      if (resp.data.status === 200) {
       
        setPlanFeture(resp.data.data);
        setDefaultFeature(resp.data.data[0]?.planService);
      }
    
  }, []);

  useEffect(() => {
    const queryString = require("query-string");
    const parsed = queryString.parse(window.location.search);
    if (parsed.session == "behaviour") {
      setKey("account");
    }
  }, [window.location.search]);

  const openExpireModaltoggle = (data) => {
    setOpenExpiremodal(!openExpireModal);
    if (data == "upgrade") {
      setOpenPlanDetailsmodal(true);
    }
    if (data == "behaviour") {
      history.push("/setting?session=behaviour");
    }
  };
  const UpgradeMyPlans = (data) => {
    setOpenPlanDetailsmodal(!openPlanDetaiilsmodal);
    if (data) {
      getMyPlan();
      gettrialDays();
      setInvoiceData(data);
      setSucessPayment(!sucessPayment);
      history.push("/setting?session=activeplan");
    }
  };

  useEffect(() => {
    
      if (trialDays !== "") {
        if (trialDays <= 0) {
          openExpireModaltoggle();
          setKey("account");
        }
        if (trialDays <= 15) {
          setKey("account");
        }
        const queryString = require("query-string");
        const parsed = queryString.parse(window.location.search);
        if (trialDays >= 30) {
          if (parsed.session == "activeplan") {
            setKey("account");
          } else {
            setKey("general");
          }
        }
        if (trialDays > 15 && trialDays < 30 ) {
          setKey("account");
        }

        if (trialDays <= 5) {
          if (parsed.upgrade === "newplan") {
            setOpenPlanDetailsmodal(true);
          }
        }
      }
  }, [trialDays]);

  const getAcDetails = async () => {
    let resp = await ApiGet(
      "account/company/companyData/" + userInfo.companyId
    );
    try {
      if (resp.data.status === 200) {
        setSaloonDetail(resp?.data?.data[0]);
        let activeAccounts = await resp.data.data;
        let availableOwnerOperators = await activeAccounts.filter((account) => {
          return (
            account.role.toLowerCase() === "owner" ||
            account.role.toLowerCase() === "operator"
          );
        });
        let availableOwners = await activeAccounts.filter((account) => {
          return account.role.toLowerCase() === "owner" && account;
        });
        setCompanyOwnersAccounts(availableOwners);
        let availableOperators = await activeAccounts.filter((account) => {
          return account.role.toLowerCase() === "operator" && account;
        });
        setCompanyOperatorsAccounts(availableOperators);
        // console.log("availableOwnerOperators", availableOwnerOperators);
        setFirstTimeSetup(availableOwnerOperators?.length === 0);
        setPage(availableOwnerOperators?.length === 0 && "Base");
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllStaff = async (values) => {
    try {
      setLoading(true);
      let res = await ApiGet("staff/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        let filteredStaff = await res.data.data.filter(
          (rep) => rep.default === false
        );
        let remainingstaff = await filteredStaff?.filter(
          (staff) => !staff.loginas || staff.loginas === "staff"
        );
        setAllStaff(remainingstaff);
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  const getPaymentMethod = async (values) => {
    try {
      setLoading(true);
      let res = await ApiGet("payment/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setPaymentMethod(res.data.data);
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  const getAllServices = async (data) => {
    if (data) {
      setAllServices(data);
      let tempFrequentServices = data?.filter(
        (service) => service?.frequentService
      );
      let tempSortedFrequentServices = tempFrequentServices?.sort((a, b) => {
        return a.index - b.index;
      });
      setFrequentServices(tempSortedFrequentServices);
    } else {
      try {
        setLoading(true);
        let res = await ApiGet("service/company/" + userInfo.companyId);
        if (res.data.status === 200) {
          setLoading(false);
          setAllServices(res.data.data);
          let tempFrequentServices = res.data.data?.filter(
            (service) => service?.frequentService
          );
          let tempSortedFrequentServices = tempFrequentServices?.sort(
            (a, b) => {
              return a.index - b.index;
            }
          );
          setFrequentServices(tempSortedFrequentServices);
        }
      } catch (err) {
        setLoading(false);
        console.log("error while getting Forum", err);
      }
    }
  };

  const getPermissions = async () => {
    try {
      setLoading(true);
      let res = await ApiGet("permission/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        let permissionsArray = res.data.data;

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
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  const getSetting = async (data) => {
    let settingData;
    console.log("hwllososs")
    if (data) {
      settingData = data;
    } else {
      settingData = get_Setting();
    }
    setSettingData(settingData);
    setLounge(settingData?.lounge);
    setPopularHours(settingData?.popularHours);
    setFirstDay(settingData?.firstDay);
    setBookingInterval(settingData?.bookingInterval);
    setStoreTiming(settingData?.storeTiming);
    setAttendanceDate(settingData?.attendanceDate);
    setAttendanceMarkDate(settingData?.attendanceMarkDate);
    setCurrencyData(settingData?.currentType);
    setWorkingDays(
      settingData?.workingDays?.length > 0
        ? settingData?.workingDays
        : [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]
    );
    setWorkday(
      settingData?.workingDays?.length > 0
        ? settingData?.workingDays
        : [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]
    );
    setWalkInToggle(settingData?.appointments);
    setServiceToggle(settingData?.service);
    setStaffToggle(settingData?.staff);
    setAttendanceToggle(settingData?.attendence?.attendanceToggle);
    setAttendanceForInvoiceToggle(
      settingData?.attendence?.attendanceForInvoiceToggle
    );
    // setBufferTime(settingData?.attendence?.bufferTime);
    setFeatureOn(settingData?.collections?.enableCollection)
    setEnablePaymentMethod(settingData?.collections?.enablePaymentMethod)
   
    if(settingData?.collections?.collectionpaymentMethod){
      setCollectionPaymentMethod(settingData?.collections?.collectionpaymentMethod)
      setSelectedPaymentMethod(settingData?.collections?.collectionpaymentMethod)

    }
    setEnableIn(settingData?.inventory?.enableInventory);
    setEnableBarcode(settingData?.inventory?.enableBarcode);
    setProductType(settingData?.inventory?.productType);
    setTaxDetails(settingData?.tax);
    setCustomerForAppointment(settingData?.customer);
    setCustomerForInvoices(settingData?.iCustomer);
    setAssignMultipleStaff(settingData?.multipleStaff?.assignMultipleStaff);
    setAssignStaffForMembership(
      settingData?.multipleStaff?.assignStaffForMembership
    );
    setAssignStaffForProduct(settingData?.multipleStaff?.assignStaffForProduct);
    setMembershipBenefit(settingData?.membership?.membershipBenefits);
    setEnableMembership(settingData?.membership?.membership);
    setApplyMembershipBenefitFrom(
      settingData?.membership?.applyMembershipBenefits
        ? "Same invoice"
        : "Next invoice"
    );
    setMembershipToggle(settingData?.membership?.membership);
    setEnableFrequentServices(settingData?.frequentService);
    if (settingData?.storeTiming?.[0]?.starttime) {
      let ISODate = moment("2021/10/5", "YYYY/DD/MM").add(
        settingData?.storeTiming[0].starttime
      );
      // setStartTime(settingData?.storeTiming[0].starttime);
      setStartTime(ISODate._d);
    } else {
      setStartTime("09:00");
    }
    if (settingData?.storeTiming?.[0]?.endtime) {
      // setEndTime(settingData?.storeTiming[0].endtime);
      let IsoDate = moment("2021/10/5", "YYYY/DD/MM").add(
        settingData?.storeTiming[0].endtime
      );

      setEndTime(IsoDate._d);
    } else {
      setEndTime("19:00");
    }
  };

  const [rolesAndPermissionModal, setRolesAndPermissionModal] = useState(false);
  const rolesAndPermissionToggle = () =>
    setRolesAndPermissionModal(!rolesAndPermissionModal);

  const handleOnToggle = (e, key) => {
    if (key === "walkin") {
      setIsUpdate(true);
      setWalkInToggle(!walkInToggle);
    } else if (key === "services") {
      setIsUpdate(true);
      setServiceToggle(!serviceToggle);
    } else if (key === "staff") {
      setIsUpdate(true);
      setStaffToggle(!staffToggle);
    } else if (key === "enableIn") {
      setIsUpdate(true);
      setEnableIn(!enableIn);
      setIsDisable(!enableIn);
    } else if (key === "enableBarcode") {
      setIsUpdate(true);
      setEnableBarcode(!enableBarcode);
      setIsBarcode(!enableBarcode);
    } else if (key === "customer") {
      setIsUpdate(true);
      setCustomerForAppointment(!customerForAppointment);
    } else if (key === "icustomer") {
      setIsUpdate(true);
      setCustomerForInvoices(!customerForInvoices);
    } else if (key === "membership") {
      setIsUpdate(true);
      setEnableMembership(!enableMembership);
      setIsMembership(!enableMembership);
      setMembershipToggle(!membershipToggle);
    } else if (key === "assignmultiplestaff") {
      setIsUpdate(true);
      setAssignMultipleStaff(!assignMultipleStaff);
    } else if (key === "assignStaffForMembership") {
      setIsUpdate(true);
      setAssignStaffForMembership(!assignStaffForMembership);
    } else if (key === "assignStaffForProduct") {
      setIsUpdate(true);
      setAssignStaffForProduct(!assignStaffForProduct);
    } else if (key === "frequentServices") {
      setIsUpdate(true);
      setEnableFrequentServices(!enableFrequentServices);
    } else if (key === "attendance") {
      setIsUpdate(true);
      setAttendanceToggle(!attendanceToggle);
    } else if (key === "attendanceForInvoice") {
      setIsUpdate(true);
      setAttendanceForInvoiceToggle(!attendanceForInvoiceToggle);
    }else if(key === "enableCollection"){
      setFeatureOn(!featureOn)
      if(featureOn){
      setEnablePaymentMethod(false)
      }
      setIsUpdate(true);
    }else if(key === "enablePaymentMethod"){
      setEnablePaymentMethod(!enablePaymentMethod)
      setIsUpdate(true);
    }
  };

  const updateCall = async (data, value) => {
    const StartTime = value === "startTime" ? data : startTime;
    const EndTime = value === "endTime" ? data : endTime;
    let values = {
      lounge: lounge,
      popularHours: popularHours,
      firstDay: firstDay,
      bookingInterval: bookingInterval,
      appointments: walkInToggle,
      service: serviceToggle,
      staff: staffToggle,
      attendence: {
        attendanceToggle: attendanceToggle,
        attendanceForInvoiceToggle: attendanceForInvoiceToggle,
        bufferTime: bufferTime,
      },
      attendanceDate: attendanceDate ? attendanceDate : new Date(),
      attendanceMarkDate: attendanceMarkDate ? attendanceMarkDate : new Date(),
      customer: customerForAppointment,
      iCustomer: customerForInvoices,
      quickAppointment: isQuickToggle,
      inventory: {
        enableInventory: enableIn,
        productType: productType,
        enableBarcode: enableBarcode,
      },
      collections : {
        enableCollection: featureOn,
        enablePaymentMethod:enablePaymentMethod,
        collectionpaymentMethod:collectionpaymentMethod
      },
      multipleStaff: {
        assignMultipleStaff: assignMultipleStaff,
        assignStaffForMembership: assignStaffForMembership,
        assignStaffForProduct: assignStaffForProduct,
      },
      paymentMethod: paymentMethod?.map((rep) => rep.paymentType),
      // storeTiming: [
      //   {
      //     starttime: moment(StartTime).format("HH:mm"),
      //     endtime: moment(EndTime).format("HH:mm"),
      //   },
      // ],
      frequentService: enableFrequentServices,
      workingDays: workingDays,
      membership: {
        membership: enableMembership,
        membershipBenefits: membershipBenefit,
        applyMembershipBenefits: applyMembershipBenefitBoolean,
      },
      companyId: userInfo.companyId,
    };
    let res = await ApiPost("setting/", values);

    try {
      if (res.data.status === 200) {
        userUtil.setSetting(res?.data?.data[0]);
        getSetting(res?.data?.data[0]);
        setIsUpdate(false)
        dispatch(
          setattendanceDate(attendanceDate ? attendanceDate : new Date())
        );
        dispatch(
          setattendanceMarkDate(
            attendanceMarkDate ? attendanceMarkDate : new Date()
          )
        );
      } else {
        console.log("in the else");
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

  const updatePaymentMethod = async () => {
    var arr = paymentMethod.map((PM, i) => ({
      isActive: PM.isActive,
      _id: PM._id,
      paymentType: PM.paymentType,
      companyId: PM.companyId,
      index: i + 1,
    }));

    let payload = { data: arr };

    let resp = await ApiPost("payment/paymentlist", payload);
    try {
      if (resp.data.status === 200) {
      } else {
        console.log("in the else");
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

  useEffect(async () => {
    if (isUpdate) {
      updateCall();
    }
  }, [
    lounge,
    popularHours,
    firstDay,
    bookingInterval,
    walkInToggle,
    serviceToggle,
    staffToggle,
    isQuickToggle,
    enableIn,
    productType,
    enableBarcode,
    customerForAppointment,
    customerForInvoices,
    saveChanges,
    enableMembership,
    membershipBenefit,
    applyMembershipBenefitFrom,
    applyMembershipBenefitBoolean,
    assignMultipleStaff,
    assignStaffForMembership,
    assignStaffForProduct,
    enableFrequentServices,
    frequentServices,
    attendanceToggle,
    featureOn,
    enablePaymentMethod,
    attendanceForInvoiceToggle,
    collectionpaymentMethod
  ]);

  useEffect(() => {
    getAllStaff();
    getAcDetails();
    getSetting();
    getPaymentMethod();
    getPermissions();
    getAllServices();
  }, []);

  const handleOnClick = (e, key) => {
    if (key === "productType") {
      setIsUpdate(true);
      setProductType(e.target.innerText);
      setIsProductType(e.target.innerText);
    } else if (key === "edit") {
      setEditOptions(!editOptions);
      setSaveChanges(false);
    } else if (key === "save") {
      setIsUpdate(true);
      setSaveChanges(!saveChanges);
      setEditOptions(false);
      updatePaymentMethod();
      updateCall();
    } else if (key === "benefit") {
      setIsUpdate(true);
      setIsMembershipType(e.target.title);
      setMembershipBenefit(e.target.title);
      setBenefitDropdown(false);
    } else if (key === "applyBenefit") {
      setIsUpdate(true);
      setApplyMembershipBenefit(e.target.title);
      setApplyMembershipBenefitFrom(e.target.title);
      setApplyMembershipBenefitBoolean(
        e.target.title === "Same invoice" ? true : false
      );
      setApplyBenefitDropdown(false);
    } else if (key === "attendance") {
      setIsUpdate(true);
      setBufferTime(e.target.innerText);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="content"
        id="main-contain"
      >
        <div className="container-fluid container-left-right-space">
          <div className="dashboard-header">
            <div className="header-alignment">
              <div className="header-title">
                <i class="fas fa-bars"></i>
                <h2>Settings</h2>
              </div>
              <div
                className="header-notification"
                onClick={(e) => setKey("general")}
              >
                {/* <NavLink to="/setting"> */}
                <div className="icon-design">
                  <img src={SettingIcon} alt="SettingIcon" />
                </div>
                {/* </NavLink> */}
              </div>
            </div>
          </div>
          {firstTimeSetup && rolesAndPermissionModal && (
            <RolesAndPermissionModal
              modal={rolesAndPermissionModal}
              firstTimeSetup={firstTimeSetup}
              setFirstTimeSetup={setFirstTimeSetup}
              toggle={rolesAndPermissionToggle}
              saloonDetail={saloonDetail}
              companyOwnersAccounts={companyOwnersAccounts}
              setCompanyOwnersAccounts={setCompanyOwnersAccounts}
              companyOperatorsAccounts={companyOperatorsAccounts}
              setCompanyOperatorsAccounts={setCompanyOperatorsAccounts}
              page={page}
              setPage={setPage}
              setKey={setKey}
              allStaff={allStaff}
              getAllStaff={getAllStaff}
            />
          )}
          <div className="new-setting-page-design">
            <div className="setting-grid">
              <div className="setting-grid-items">
                <div className="setting-search-box">
                  <div className="seting-option-box-height">
                    { (
                      <div className="setting-option-align">
                        <div
                          className={
                            key === "account"
                              ? "setting-option-list-active"
                              : "setting-option-list"
                          }
                          onClick={(e) => setKey("account")}
                        >
                          <p>My account</p>
                        </div>
                      </div>
                    )}
                    <div className="setting-option-align">
                      <div
                        className={
                          key === "general"
                            ? "setting-option-list-active"
                            : "setting-option-list"
                        }
                        onClick={(e) => setKey("general")}
                      >
                        <p>General</p>
                      </div>
                    </div>

                    {permission?.filter(
                      (obj) => obj.name === "Appointment tab page & actions"
                    )[0]?.isChecked === false ? null : (
                      <div className="setting-option-align">
                        {trialDays <= 0  ? (
                          <div
                            className={
                              key === "appointments"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            style={{ opacity: "0.5" }}
                          >
                            <p>Appointments</p>
                          </div>
                        ) : (
                          <div
                            className={
                              key === "appointments"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            onClick={(e) => setKey("appointments")}
                          >
                            <p>Appointments</p>
                          </div>
                        )}
                      </div>
                    )}
                    {permission?.filter(
                      (obj) => obj.name === "Staff tab page & actions"
                    )[0]?.isChecked === false ? null : (
                      <div className="setting-option-align">
                        {trialDays <= 0  ? (
                          <div
                            className={
                              key === "staffTab"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            style={{ opacity: "0.5" }}
                          >
                            <p>Staff</p>
                          </div>
                        ) : (
                          <div
                            className={
                              key === "staffTab"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            onClick={(e) => setKey("staffTab")}
                          >
                            <p>Staff</p>
                          </div>
                        )}
                      </div>
                    )}
                    {permission?.filter(
                      (obj) => obj.name === "Invoices tab page & actions"
                    )[0]?.isChecked === false ? null : (
                      <div className="setting-option-align">
                        {trialDays <= 0  ? (
                          <div
                            className={
                              key === "invoices"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            style={{ opacity: "0.5" }}
                          >
                            <p>Invoices</p>
                          </div>
                        ) : (
                          <div
                            className={
                              key === "invoices"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            onClick={(e) => setKey("invoices")}
                          >
                            <p>Invoices</p>
                          </div>
                        )}
                      </div>
                    )}
                    {permission?.filter(
                      (obj) => obj.name === "Inventory tab page & actions"
                    )[0]?.isChecked === false ? null : (
                      <div className="setting-option-align">
                        {trialDays <= 0  ? (
                          <div
                            className={
                              key === "inventory"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            style={{ opacity: "0.5" }}
                          >
                            <p>Inventory</p>
                          </div>
                        ) : (
                          <div
                            className={
                              key === "inventory"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            onClick={(e) => setKey("inventory")}
                          >
                            <p>Inventory</p>
                          </div>
                        )}
                      </div>
                    )}
                    {permission?.filter(
                      (obj) => obj.name === "Membership tab page & actions"
                    )[0]?.isChecked === false ? null : (
                      <div className="setting-option-align">
                        {trialDays <= 0 ? (
                          <div
                            className={
                              key === "membership"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            style={{ opacity: "0.5" }}
                          >
                            <p>Membership</p>
                          </div>
                        ) : (
                          <div
                            className={
                              key === "membership"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            onClick={(e) => setKey("membership")}
                          >
                            <p>Membership</p>
                          </div>
                        )}
                      </div>
                    )}
                   {permission?.filter((obj) => obj.name === "Expense")[0]
                  ?.isChecked === false ? null : <div className="setting-option-align">
                      {trialDays <= 0  ? (
                        <div
                          className={
                            key === "Expense"
                              ? "setting-option-list-active"
                              : "setting-option-list"
                          }
                          style={{ opacity: "0.5" }}
                        >
                          <p>Expense</p>
                        </div>
                      ) : (
                        <div
                          className={
                            key === "Expense"
                              ? "setting-option-list-active"
                              : "setting-option-list"
                          }
                          onClick={(e) => setKey("Expense")}
                        >
                          <p>Expense</p>
                        </div>
                      )}
                    </div>}

                    {userInfo?.role == "Staff" ||
                    permission?.filter(
                      (obj) =>
                        obj.name === "Roles permissions tab page & actions"
                    )[0]?.isChecked === false ? null : (
                      <div className="setting-option-align">
                        {trialDays <= 0  ? (
                          <div
                            className={
                              key === "roles_permissions"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            style={{ opacity: "0.5" }}
                          >
                            <p>Roles & Permissions</p>
                          </div>
                        ) : (
                          <div
                            className={
                              key === "roles_permissions"
                                ? "setting-option-list-active"
                                : "setting-option-list"
                            }
                            onClick={(e) => {
                              setKey("roles_permissions");
                              setPage(firstTimeSetup && "Base");
                              firstTimeSetup && rolesAndPermissionToggle();
                            }}
                          >
                            <p>Roles & Permissions</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="setting-grid-items">
                <div className="setting-full-infromation-section">
                  {key === "account" && (
                    <AccountSetting
                      permission={permission}
                      userInfo={userInfo}
                      taxDetails={taxDetails}
                      getSetting={getSetting}
                      currencyData={currencyData}
                      trialDays={trialDays}
                      planFeture={planFeture}
                      getMyPlan={getMyPlan}
                      gettrialDays={gettrialDays}
                      defaultFeature={defaultFeature}
                      planName={planName}
                      expireDate={expireDate}
                      planBills={planBills}
                      currentInvoicesNo={currentInvoicesNo}
                      currentInvoices={currentInvoices}
                      salesData={salesData}
                      customersAdded={customersAdded}
                      dueCount={dueCount}
                      dueAmountTotal={dueAmountTotal}
                      appointmentNo={appointmentNo}
                    />
                  )}
                  {key === "general" && (
                    <GeneralSetting
                      getAcDetails={getAcDetails}
                      getSetting={getSetting}
                      taxDetails={taxDetails}
                      storeTiming={storeTiming}
                      workday={workday}
                      workingDays={workingDays}
                      saloonDetail={saloonDetail}
                      currencyData={currencyData}
                      permission={permission}
                      userInfo={userInfo}
                    />
                  )}
                  {key === "appointments" && (
                    <AppointmentSetting
                      handleOnToggle={handleOnToggle}
                      walkInToggle={walkInToggle}
                      serviceToggle={serviceToggle}
                      staffToggle={staffToggle}
                      customerForAppointment={customerForAppointment}
                      permission={permission}
                    />
                  )}
                  {key === "staffTab" && (
                    <StaffSetting
                      handleOnToggle={handleOnToggle}
                      handleOnClick={handleOnClick}
                      attendanceToggle={attendanceToggle}
                      attendanceForInvoiceToggle={attendanceForInvoiceToggle}
                      bufferOptions={bufferOptions}
                      setBufferOptions={setBufferOptions}
                      bufferTime={bufferTime}
                      permission={permission}
                    />
                  )}
                  {key === "invoices" && (
                    <InvoiceSetting
                      membershipToggle={membershipToggle}
                      enableIn={enableIn}
                      handleOnClick={handleOnClick}
                      handleOnToggle={handleOnToggle}
                      saveChanges={saveChanges}
                      editOptions={editOptions}
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      assignMultipleStaff={assignMultipleStaff}
                      assignStaffForProduct={assignStaffForProduct}
                      assignStaffForMembership={assignStaffForMembership}
                      customerForInvoices={customerForInvoices}
                      getPaymentMethod={getPaymentMethod}
                      permission={permission}
                      allServices={allServices}
                      getAllServices={getAllServices}
                      frequentServices={frequentServices}
                      setFrequentServices={setFrequentServices}
                      enableFrequentServices={enableFrequentServices}
                      setEnableFrequentServices={setEnableFrequentServices}
                    />
                  )}
                  {key === "inventory" && (
                    <InventorySetting
                      handleOnClick={handleOnClick}
                      handleOnToggle={handleOnToggle}
                      enableIn={enableIn}
                      productType={productType}
                      enableBarcode={enableBarcode}
                      retailMenu={retailMenu}
                      setRetailMenu={setRetailMenu}
                      permission={permission}
                    />
                  )}
                  {key === "membership" && (
                    <MembershipSetting
                      benefitDropdown={benefitDropdown}
                      setBenefitDropdown={setBenefitDropdown}
                      enableMembership={enableMembership}
                      applyBenefitDropdown={applyBenefitDropdown}
                      setApplyBenefitDropdown={setApplyBenefitDropdown}
                      handleOnClick={handleOnClick}
                      handleOnToggle={handleOnToggle}
                      membershipBenefit={membershipBenefit}
                      applyMembershipBenefitFrom={applyMembershipBenefitFrom}
                      membershipToggle={membershipToggle}
                    />
                  )}
                  {key === "Expense" && (
                    <CollectionSetting 
                    featureOn={featureOn} 
                    enablePaymentMethod={enablePaymentMethod}
                    handleOnToggle={handleOnToggle}
                    collectionpaymentMethod={collectionpaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    selectedPaymentMethod={selectedPaymentMethod}
                    paymentMethod={paymentMethod}
                    SettingInfo={SettingInfo}
                    setIsUpdate={setIsUpdate}
                    setCollectionPaymentMethod={setCollectionPaymentMethod}
                    />
                  )}
                  {key === "roles_permissions" && (
                    <RolesAndPermissions
                      allStaff={allStaff}
                      firstTimeSetup={firstTimeSetup}
                      setFirstTimeSetup={setFirstTimeSetup}
                      companyOwnersAccounts={companyOwnersAccounts}
                      setCompanyOwnersAccounts={setCompanyOwnersAccounts}
                      companyOperatorsAccounts={companyOperatorsAccounts}
                      setCompanyOperatorsAccounts={setCompanyOperatorsAccounts}
                      page={page}
                      setPage={setPage}
                      setKey={setKey}
                      getAllStaff={getAllStaff}
                      permission={permission}
                      getAcDetails={getAcDetails}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* new design */}
        </div>
      </motion.div>
      {openExpireModal && <UpgradePlan toggle={openExpireModaltoggle} userInfo={userInfo}/>}
      {openPlanDetaiilsmodal && (
        <PlanDetail
          toggle={UpgradeMyPlans}
          trialDays={trialDays}
          planFeture={planFeture}
          userInfo={userInfo}
          planBills={planBills}
        />
      )}
      {sucessPayment && (
        <SucessPlanPayment
          invoiceData={planBills[planBills?.length - 1]}
          setSucessPayment={setSucessPayment}
        />
      )}
    </>
  );
};

export default Setting;
