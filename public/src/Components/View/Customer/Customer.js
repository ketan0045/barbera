import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import CreateCustomer from "./CreateCustomer";
import ImportFileModal from "./ImportFileModal";
import ViewAllCustomer from "./ViewAllCustomer";

import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { Pie } from "react-chartjs-2";
import "../../Sass/Customer.scss";
import BellImage from "../../../assets/svg/bell.svg";
import ProfileImage from "../../../assets/svg/profile-image.png";
import ProfileEdit from "../../../assets/svg/profile-edit.png";
import SettingIcon from "../../../assets/svg/setting.svg";
import ImportIcon from "../../../assets/svg/import-button.png";
import ProfileDelete from "../../../assets/svg/profile-delete.png";
import SearchIcon from "../../../assets/svg/search.svg";
import CalendarIcon from "../../../assets/svg/Calendar.png";
import CancelCalendarIcon from "../../../assets/svg/cancel-calendar.png";
import HideIcon from "../../../assets/svg/hide.png";
import TicketIcon from "../../../assets/svg/ticket-icon.png";
import moment from "moment";
import DropdownImport from "../../basic/DropdownImport";
import { toast } from "react-toastify";
import AddNewCustomerModal from "../../Common/Modal/AddNewCustomerModal";
import AddNewAppointmentModal from "../../Common/Modal/AddNewAppointmentModal";
import Success from "../../Common/Toaster/Success/Success";
import Delete from "../../Common/Toaster/Delete";
import Auth from "../../../helpers/Auth";
import GoogleContacts from "react-google-contacts";
import ImportCustomerModal from "../../Common/Modal/ImportCustomerModal";
import ViewInvoiceModal from "../../Common/Modal/ViewInvoiceModal";
import membershipProfile from "../../../assets/svg/membership-profile.svg";
import YellowMembership from "../../../assets/svg/Yellow-Membership.svg";
import SkyBlueMembership from "../../../assets/svg/SkyBlue-Membership.svg";
import OrangeMembership from "../../../assets/svg/Orange-Membership.svg";
import BlueMembership from "../../../assets/svg/BLue-Membership.svg";
import CusEmptyIcon from "../../../assets/svg/new-cus-empty.svg";
import ChildSidebar from "../Layout/ChildSidebar";
import DiscountedServiceCatalogue from "../../Common/Modal/DiscountedServiceCatalogue";
import EditCatalogueModal from "../../Common/Modal/EditCatalogueModal";
import UserContext from "../../../helpers/Context";
import CustomerDuePaymentModal from "../../Common/Modal/CustomerDuePaymentModal";
import { v4 as uuidv4 } from "uuid";
import { get_Setting } from "../../../utils/user.util";
import AddWalletModal from "../../Common/Modal/AddWalletModal";
import NoDataIcon from "../../../../src/assets/svg/coolicon.svg";
import button from "../../../../src/assets/svg/F_41.svg";
import ClearDuePopUp from "../../Common/Modal/ClearDuePopUp";
import WithdrawWallet from "../../Common/Modal/WithdrawWallet";
import AddPreviousDueModal from "../../Common/Modal/AddPreviousDueModal";
import { motion } from "framer-motion";

function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);
  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );
  useEffect(() => {
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);
  return isIntersecting;
}

export default function Customer(props) {
  const uuid = uuidv4();
  const { isMembership } = useContext(UserContext);
  const [customerDetails, setCustomerDetails] = useState();
  const [importDropdownNew, setImportDropdownNew] = useState(false);
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  let SettingInfo = get_Setting();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState();
  const [customers, setCustomers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [uploadexelsheet, setUploadexelsheetModal] = useState(false);
  const [searchTimeOut, setSearchTimeOut] = useState();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const divRef = useRef();
  const importDropdownRef = useRef();
  const isVisible = useOnScreen(divRef);
  const [transction, setTransction] = useState(false);
  const [profile, setProfile] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [membership, setMembership] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [pTrans, setPTrans] = useState(true);
  const [mTrans, setMTrans] = useState(false);
  const [customerFeedbacks, setCustomerFeedbacks] = useState([]);
  const [customerAnalytics, setCustomerAnalytics] = useState();
  const [customerInvoiceDetails, setCustomerInvoiceDetails] = useState([]);
  const [editCustomer, setEditCustomer] = useState({});
  const [er, setEr] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [deleteCustomerId, setDeleteCustomerId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  // const [membershipDetails, setMembershipDetails] = useState();
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [membershipData, setMembershipData] = useState();
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [transactionsDetail, setTransactionsDetail] = useState([]);
  const [
    customerDetailForBookApoointment,
    setCustomerDetailForBookApoointment,
  ] = useState();
  const [openDuePaymentModal, setOpenDuePaymentModal] = useState(false);
  const [membershipCustomer, setMembershipCustomer] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const location = useLocation().search;

  const [editCatalogue, setEditCatalogue] = useState(false);
  const editCatalogueToggle = () => setEditCatalogue(!editCatalogue);

  const [discountedServiceCatalogue, setDiscountedServiceCatalogue] =
    useState(false);
  const discountedServiceCatalogueToggle = () =>
    setDiscountedServiceCatalogue(!discountedServiceCatalogue);

  const [customerImportFromExcel, setcustomerImportFromExcelModal] =
    useState(false);
  const customerImport = () =>
    setcustomerImportFromExcelModal(!customerImportFromExcel);

  const [addNewCustomerModal, setAddNewCustomerModal] = useState(false);
  const addNewCustomer = () => {
    AddNewCustomerModaltoggle();
  };

  const id = new URLSearchParams(location).get("id");
  const [addwalletModal, setAddwalletModal] = useState(false);
  const [clearDuePopUp, setClearDuePopUp] = useState(false);
  const [walletHistory, setWalletHistory] = useState();
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [dueTransction, setDueTransction] = useState([]);
  const [addPrevious, setAddPrevious] = useState(false);
  const [allcustomer, setAllCustomer] = useState(0);

  useEffect(async () => {
    getCompanyAllCustomer()
    if (id) {
      try {
        let res = await ApiGet("customer/" + id);
        if (res.data.status === 200) {
          // setMembershipCustomer(res.data.data)
          getCustomerAnalytics(res.data.data[0]);
          setCustomers(res.data.data);
          getCustomerFeedback(res?.data?.data[0]?._id);
          getTransactions(res.data.data[0]._id);
        } else {
          console.log("in the else");
        }
      } catch (err) {
        console.log("error while getting Categories", err);
      }
    } else {
      getCustomers();
    }
  }, []);

  const permission = userInfo.permission;
  const AddNewCustomerModaltoggle = (status, values) => {
    setAddNewCustomerModal(!addNewCustomerModal);
    setEditCustomer();
    if (addNewCustomerModal === true) {
      if (status) {
        if (status === 200) {
          setSuccess(true);
          setToastmsg(editCustomer ? "Changes saved!" : "New customer added!");
          if (values) {
            getCustomers(editCustomer ? values[0] : values);
            // getAllCustomers(values);
            getCustomerAnalytics(editCustomer ? values[0] : values);
            // setMembershipDetails();
          }
        } else if (status === 208) {
          setSuccess(true);
          setToastmsg("Customer already exists!");
        }
        // else if (status !== 200 && status !== 208){
        //   setSuccess(true);
        //   setEr("Error");
        //   setToastmsg("Something went wrong!");
        // }
      }
    }
  };

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);
    if (deleteModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Customer deleted!");
          getCustomers();
          // getAllCustomers();
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const [addNewAppointment, setAddNewAppointment] = useState(false);
  const AddNewAppointmentModaltoggle = (data) => {
    setCustomerDetailForBookApoointment(data);
    setAddNewAppointment(!addNewAppointment);
    if (addNewAppointment === true) {
      if (data) {
        if (data?.data?.status === 200) {
          setSuccess(true);
          setToastmsg("Appointment added!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const setUploadexelsheet = () => setUploadexelsheetModal(!uploadexelsheet);

  const catalogueToggle = (e, key) => {
    setMembershipData(key.selectedServices);
    // if (key.membershipBenifits === "Discounted services") {
    // discountedServiceCatalogueToggle();
    // } else {
    editCatalogueToggle();
    // }
  };

  const responseCallback = async (response) => {
    const filterNullList = response.filter((rep) => rep.phoneNumber != null);
    const userInfo = Auth.getUserDetail();
    const contactArray = [];
    const contactList = filterNullList.map((item) => {
      contactArray.push({
        firstName: item.givenName,
        lastName: item.familyName,
        mobileNumber: item.phoneNumber,
        companyId: userInfo.companyId,
        isPromotional: true,
        profilePic: "base64url",
        isActive: true,
      });
    });
    let res = await ApiPost("customer/insertCustomerMany", contactArray);
    try {
      if (res.data.status === 200) {
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

  const renderMobileSidebar = () => {
    let divEle = document.getElementsByClassName("sidebar-banner")[0];
    divEle.classList.toggle("sidebar-display");
  };

  const data = {
    labels: ["Services", "Products"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#FDB45C"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#FDB45C"],
        data: [customerAnalytics?.service, customerAnalytics?.product],
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

  const handleSubmit = async (values) => {
    let res = await ApiPost("customer/", values);
    try {
      if (res.data.status === 200) {
        getAllCustomers();
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

  const handleEdit = async (values) => {
    let res = await ApiPut("customer/" + values._id, values);
    try {
      if (res.data.status === 200) {
        getCustomers(values);
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

  const getTransactions = async (id) => {
    try {
      // setLoading(true);
      let res = await ApiGet(
        "invoice/customer/membership/" + userInfo.companyId + "/" + id
      );
      if (res.data.status === 200) {
        // setLoading(false);
        setTransactionsDetail(res.data?.data?.reverse());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCustomerFeedback = async (id) => {
    try {
      // setLoading(true);
      let res = await ApiGet("invoice/company/customer/invoice/" + id);
      if (res.data.status === 200) {
        // setLoading(false);
        // setCustomerFeedbacks([...customerFeedbacks, ...res.data?.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const getMembershipById = async (id) => {
  //   let res = await ApiGet("membership/" + id);
  //   try {
  //     if (res.data.status === 200) {
  //       let data = res.data.data[0];
  //       setMembershipDetails(data);
  //     } else {
  //       console.log("error");
  //     }
  //   } catch {
  //     console.log("something went wrong");
  //   }
  // };

  const getWalletTransction = (user) => {
    if (user) {
      ApiGet(`wallet/user/company/${user?._id}`)
        .then((resp) => {
          setWalletHistory(resp?.data.data);
        })
        .catch((er) => {
          console.log(er);
        });
    }
  };

  const getCustomers = async (values) => {
    try {
      setLoading(true);
      let res = await ApiGet(
        "customer/company/" + userInfo.companyId + `?limit=30&skip=${0}`
      );
      if (res.data.status === 200) {
        setLoading(false);
        setCustomers(res.data.data);

        // setFilteredData((currentValue)=>[...currentValue, ...res.data.data]);
        if (res.data.data.length && !values) {
          if (customerDetails) {
            ApiGet("customer/company/" + userInfo.companyId)
              .then((responce) => {
                let serchedCustomer = responce.data.data?.filter(
                  (obj) => obj?._id === customerDetails?._id
                );

                if (serchedCustomer?.length === 0) {
                  setCustomerDetails(responce.data.data[0]);
                  getWalletTransction(responce.data.data[0]);
                  getCustomerAnalytics(responce.data.data[0]);
                  setSearch();
                } else {
                  setCustomerDetails(serchedCustomer[0]);
                  getWalletTransction(serchedCustomer[0]);
                  getCustomerAnalytics(serchedCustomer[0]);
                }
              })
              .catch((er) => {
                console.log(er);
              });
          } else {
            setCustomerDetails(res.data.data[0]);
            getWalletTransction(res.data.data[0]);
            getCustomerAnalytics(res.data.data[0]);
            getCustomerFeedback(res?.data?.data[0]?._id);
          }
        } else {
          setLoading(false);
          setCustomerDetails(values);
          getWalletTransction(values);
        }
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  const getCompanyAllCustomer=()=>{
    ApiGet("customer/company/" + userInfo.companyId)
    .then((responce) => {
      setAllCustomer(responce.data.data?.length)
    })
    .catch((er) => {
      console.log(er);
    });
  }

  const sortCustomers = filteredData.sort(function (a, b) {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  });
  // console.log("first",sortCustomers);
  const getAllCustomers = async (values) => {
    try {
      setLoading(true);
      let res = await ApiGet(
        "customer/company/" + userInfo.companyId + `?limit=30&skip=${skip}`
      );
      if (res.data.status === 200) {
        setLoading(false);
        setCustomers((currentValue) => [...currentValue, ...res.data.data]);
        // setFilteredData((currentValue)=>[...currentValue, ...res.data.data]);

        const sortCustomerDetail = res.data.data.sort(function (a, b) {
          if (a.firstName < b.firstName) return -1;
          if (a.firstName > b.firstName) return 1;
          return 0;
        });
        if (res.data.data.length && !values) {
          setCustomerDetails(sortCustomerDetail[0]);
          getWalletTransction(sortCustomerDetail[0]);
          getCustomerAnalytics(sortCustomerDetail[0]);
        } else {
          setLoading(false);
          setCustomerDetails(values);
          getWalletTransction(values);
        }
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  const getCustomerAnalytics = async (values) => {
    setCustomerDetails(values);
    getWalletTransction(values);
    let startTime = moment().subtract(1, "year").calendar();
    let endTime = moment().add(1, "year").calendar();
    try {
      let Body = {
        startTime: startTime,
        endTime: endTime,
        mobile: values.mobileNumber,
      };
      let res = await ApiPost(
        "customer/analytics/customer/" + userInfo.companyId + "/" + values._id,
        Body
      );
      if (res.data.status === 200) {
        setCustomerAnalytics(res.data.data);
        setCustomerInvoiceDetails(res.data.data?.invoiceData);
        setCustomerFeedbacks(
          res.data.data.invoiceData
            .reverse()
            ?.filter((obj) => obj?.feedback[0] || obj?.notes)
        );
        // getTransactions();
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  const onSearch = async (value) => {
    try {
      if (value) {
        setLoading(true);
        let res = await ApiGet(
          "customer/company/search/" + userInfo.companyId + `?text=${value}`
        );
        if (res.data.status === 200) {
          setLoading(false);
          setFilteredData(res.data.data);
        }
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  const editCustomerDetails = (e, data) => {
    addNewCustomer();
    setEditCustomer(data);
  };

  const deleteCustomer = (e, data) => {
    opendeleteModal();
    setDeleteCustomerId(data._id);
  };

  const setTimeoutUser = (value) => {
    let time = setTimeout(function () {
      onSearch(value);
    }, 1000);
    setSearchTimeOut(time);
  };

  // useEffect(async () => {
  //   getAllCustomers();
  // }, []);

  useEffect(() => {
    if (!search) {
      setFilteredData(customers);
    }
  }, [customers, search]);

  useEffect(async () => {
    if (skip !== 0) {
      getAllCustomers();
    }
  }, [skip]);

  useEffect(() => {
    if (isVisible && filteredData?.length > 0 && !search) {
      setSkip((currentValue) => currentValue + 30);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      if (searchTimeOut) clearTimeout(searchTimeOut);
      setTimeoutUser(search);
    }
    // let filterData = customers;
    // if (search) {
    //   setFilteredData(
    //     filterData.filter(
    //       (obj) =>
    //         (obj &&
    //           obj.firstName &&
    //           obj.lastName &&
    //           (obj.firstName + " " + obj.lastName)
    //             .toLowerCase()
    //             .includes(search.toLowerCase())) ||
    //         (obj &&
    //           obj.mobileNumber &&
    //           obj.mobileNumber.includes(search.toLowerCase()))
    //     )
    //   );
    // } else {
    //   setFilteredData(customers);
    // }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  const openOnClickHandler = (data, key) => {
    if (key === "Profile") {
      setProfile(true);
      setAnalytics(false);
      setTransction(false);
      setMembership(false);
      setFeedback(false);
      setWallet(false);
    } else if (key === "Transactions") {
      setTransction(true);
      setProfile(false);
      setAnalytics(false);
      setMembership(false);
      setWallet(false);
      setFeedback(false);
      // getInvoices()
    } else if (key === "Wallet") {
      setTransction(false);
      setProfile(false);
      setAnalytics(false);
      setMembership(false);
      setFeedback(false);
      setWallet(true);
    } else if (key === "Membership") {
      setMembership(true);
      setTransction(false);
      setProfile(false);
      setAnalytics(false);
      setFeedback(false);
      setWallet(false);
    } else if (key === "pTrans") {
      setPTrans(true);
      setMTrans(false);
    } else if (key === "mTrans") {
      setPTrans(false);
      setMTrans(true);
    } else if (key === "feedback") {
      setMembership(false);
      setTransction(false);
      setProfile(false);
      setAnalytics(false);
      setWallet(false);
      setFeedback(true);
    } else {
      setAnalytics(true);
      setMembership(false);
      setTransction(false);
      setProfile(false);
      getCustomerAnalytics(key);
      setWallet(false);
      setFeedback(false);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (importDropdownNew) {
        if (
          importDropdownNew &&
          importDropdownRef.current &&
          !importDropdownRef.current.contains(e.target)
        ) {
          setImportDropdownNew(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [importDropdownNew]);

  const ViewInvoice = (e, data) => {
    ViewInvoiceModalToggle();
    TostMSG();
    setInvoiceDetail(data);
  };

  const ViewInvoiceId = async (data) => {
    let res = await ApiGet("invoice/" + data.invoice_id);
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

  const TostMSG = (data) => {
    if (data) {
      if (data === "SMS") {
        setSuccess(true);
        setToastmsg("SMS sent successfully!");
        getCustomerAnalytics(customerDetails);
      } else if (data === "DELETE") {
        setSuccess(true);
        setToastmsg("Invoice deleted!");
        getCustomerAnalytics(customerDetails);
      } else if (data === "EDIT") {
        setSuccess(true);
        setToastmsg("Changes saved");
        getCustomerAnalytics(customerDetails);
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
  const [childSidebar, setChildSidebar] = useState(false);

  const ViewInvoiceModalToggle = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
    if (viewInvoiceModal === true) {
      // getDashboardBySales();
      getTransactions(customerDetails?._id);
      getCustomerAnalytics(customerDetails);
    }
  };

  const getInvoices = async () => {
    // let res = await ApiGet("invoice/company/" + userInfo.companyId);
    // try {
    //   if (res.data.status === 200) {
    //     setCustomerInvoiceDetails(res.data.data);
    //   } else {
    //     console.log("in the else");
    //   }
    // } catch (err) {
    //   console.log("in the catch");
    // }
  };

  // console.log(
  //   "customerDetailsselectMembershipreverse",
  //   customerDetails?.selectMembership
  // );
  // let arr1 = [];
  // for (let i = customerDetails?.selectMembership?.length - 1; i >= 0; i--) {
  //   arr1.push(customerDetails?.selectMembership[i]);
  // }
  // console.log("arr1", arr1);

  const DuePaymentModal = (data) => {
    OpenDuePaymentModaltoggle();
    ApiGet(`invoice/partPayment/customer/${data?._id}`)
      .then((resp) => {
        setDueTransction(resp?.data?.data);
      })
      .catch((er) => {
        console.log(er);
      });
  };
  const OpenDuePaymentModaltoggle = (data) => {
    setOpenDuePaymentModal(!openDuePaymentModal);
    if (data) {
      setSuccess(true);
      setToastmsg("Due cleared!");
      getCustomers();
    }
  };

  const AddWallet = (data) => {
    // console.log("aavu?");
    AddWallettoggle();
  };

  const AddWallettoggle = (data) => {
    setAddwalletModal(!addwalletModal);
    if (data) {
      if (data === 200) {
        setSuccess(true);
        setToastmsg("Wallet amount added!");
        getCustomers();
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  const ClearDuePopUpClick = (data) => {
    // console.log("aavu?");
    ClearDuePopUpToggle();
  };

  const ClearDuePopUpToggle = (data) => {
    setClearDuePopUp(!clearDuePopUp);
    if (data) {
      OpenDuePaymentModaltoggle();
      ApiGet(`invoice/partPayment/customer/${customerDetails?._id}`)
        .then((resp) => {
          setDueTransction(resp?.data?.data);
        })
        .catch((er) => {
          console.log(er);
        });
    }
  };

  const withdrawWallet = (data) => {
    if (
      walletHistory[walletHistory?.length - 1]?.finalAmount == 0 ||
      walletHistory[walletHistory?.length - 1]?.finalAmount == undefined
    ) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Wallet is empty!");
    } else {
      setWithdrawModal(!withdrawModal);
    }
    if (data) {
      if (data === 200) {
        setSuccess(true);
        setToastmsg("Amount withdrawed!");
        getCustomers();
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  const addPreviousDue = (data) => {
    setAddPrevious(!addPrevious);
    if (data) {
      if (data === 200) {
        setSuccess(true);
        setToastmsg("Previous due added!");
        getCustomers();
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
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
        {addNewCustomerModal && (
          <AddNewCustomerModal
            modal={addNewCustomerModal}
            toggle={AddNewCustomerModaltoggle}
            editCustomer={editCustomer}
            SettingInfo={SettingInfo}
          />
        )}
        {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
        {addNewAppointment && (
          <AddNewAppointmentModal
            modal={addNewAppointment}
            toggle={AddNewAppointmentModaltoggle}
            data={data}
            uuid={uuid}
            customerDetail={customerDetailForBookApoointment}
            SettingInfo={SettingInfo}
          />
        )}
        {deleteModal && (
          <Delete
            modal={deleteModal}
            toggle={deleteModaltoggle}
            deleteCustomerId={deleteCustomerId}
          />
        )}
        {/* {uploadexelsheet && (
          <ImportFileModal
            isOpen={uploadexelsheet}
            toggle={() => {
              setUploadexelsheet((e) => !e);
            }}
            handleSubmit={(values) => handleSubmit(values)}
          />
        )} */}
        {customerImportFromExcel && (
          <ImportCustomerModal
            isOpen={customerImportFromExcel}
            toggle={() => {
              setcustomerImportFromExcelModal((e) => !e);
            }}
            handleSubmit={(values) => handleSubmit(values)}
          />
        )}
        {/* {createCustomerModal && (
          <CreateCustomer
            isOpen={createCustomerModal}
            toggle={() => {
              setCreateCustomerModal((e) => !e);
            }}
            handleSubmit={(values) => handleSubmit(values)}
          />
        )} */}
        <div className="container-fluid container-left-right-space">
          {/* <header>
            <div className="flex items-center pl-1 pr-1 justify-between mobile-view-block">
              <div className="flex items-center">
                <div className="toogle pr-3" onClick={renderMobileSidebar}>
                  <i class="fas fa-align-left heading-title-text-color font-size-25"></i>
                </div>
                <p className="font-size-35 font-bold tracking-normal heading-title-text-color mb-0 cursor-pointer">
                  Customers
                </p>
              </div>
              <div className="flex items-center mobile-view-between mobile-view-mt-1">
                <div>
                  {userInfo && userInfo.role === "Staff" ? (
                    <div className="notification-round cursor-pointer flex items-center justify-center relative setting-header-icon">
                      <i
                        className="fas fa-sign-out-alt cursor-pointer"
                        onClick={() => {
                          logout();
                        }}
                      ></i>
                    </div>
                  ) : (
                    <NavLink to="/setting">
                      <div className="notification-round cursor-pointer flex items-center justify-center relative setting-header-icon">
                        <img
                          src={
                            require("../../../assets/img/new-setting.png")
                              .default
                          }
                        />
                      </div>
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </header> */}

          <div className="dashboard-header">
            <div className="header-alignment">
              <div className="header-title">
                <i
                  class="fas fa-bars"
                  onClick={() => setChildSidebar(!childSidebar)}
                ></i>
                <h2>Customer</h2>
              </div>
              <div className="header-notification">
                {/* <div className="icon-design">
                  <div className="relative">
                    <img src={BellImage} alt="BellImage" />
                  </div>
                  <div className="bell-icon-design"></div>
                </div> */}
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

          <div className="customer-grid">
            <div className="customer-grid-items">
              <div className="customer-information-box">
                <div className="customer-search">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder={`Search out of ${allcustomer} entries`}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                    <div className="search-icon-alignment">
                      <img src={SearchIcon} alt="SearchIcon" />
                    </div>
                  </div>
                </div>
                <div className="customer-list-box-height">
                  {sortCustomers.length > 0 ? (
                    sortCustomers.map((customer, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            customerDetails?._id === customer?._id
                              ? "customer-details-show-active"
                              : "customer-details-show"
                          }
                          onClick={() => {
                            getCustomerAnalytics(customer);
                            getTransactions(customer?._id);
                            getCustomerFeedback(customer?._id);
                            // setMembershipDetails(customer);
                          }}
                        >
                          <div className="customer-list">
                            <div className="customer-profile-grid">
                              <div className="customer-profile-grid-items">
                                {customer?.selectMembership[
                                  customer?.selectMembership?.length - 1
                                ]?.isExpire === false ? (
                                  customer?.selectMembership?.slice(-1)[0]
                                    ?.cardColur === "rgb(248, 226, 124)" ? (
                                    <img
                                      src={YellowMembership}
                                      alt="ProfileImage"
                                    />
                                  ) : customer?.selectMembership?.slice(-1)[0]
                                      ?.cardColur === "rgb(248, 163, 121)" ? (
                                    <img
                                      src={OrangeMembership}
                                      alt="ProfileImage"
                                    />
                                  ) : customer?.selectMembership?.slice(-1)[0]
                                      ?.cardColur === "rgb(109, 200, 199)" ? (
                                    <img
                                      src={SkyBlueMembership}
                                      alt="ProfileImage"
                                    />
                                  ) : customer?.selectMembership?.slice(-1)[0]
                                      ?.cardColur === "rgb(72, 148, 248)" ? (
                                    <img
                                      src={BlueMembership}
                                      alt="ProfileImage"
                                    />
                                  ) : (
                                    <div className="cus-profile">
                                      <span>
                                        {customer?.firstName
                                          ? customer?.firstName[0].toUpperCase()
                                          : "A"}
                                        {customer?.lastName
                                          ? customer?.lastName[0].toUpperCase()
                                          : ""}
                                      </span>
                                    </div>
                                  )
                                ) : (
                                  <div className="cus-profile">
                                    <span>
                                      {customer?.firstName
                                        ? customer?.firstName[0].toUpperCase()
                                        : "A"}
                                      {customer?.lastName
                                        ? customer?.lastName[0].toUpperCase()
                                        : ""}
                                    </span>
                                  </div>
                                )}
                                {/* {
                                  customer?.membership ? 
                                  <img
                                    src={BlueMembership}
                                    alt="ProfileImage"
                                  /> :  <div className="cus-profile">
                                  <span>
                                    {customer?.firstName
                                      ? customer?.firstName[0].toUpperCase()
                                      : "A"}
                                    {customer?.lastName
                                      ? customer?.lastName[0].toUpperCase()
                                      : ""}
                                  </span>
                                </div>
                                } */}
                              </div>
                              <div className="customer-profile-grid-items">
                                <h6>
                                  {customer?.firstName +
                                    " " +
                                    customer?.lastName}{" "}
                                </h6>
                                <p>{customer?.mobileNumber}</p>
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
                          <p>No customer added so far</p>
                          <h4>
                            Click on <a>Add new</a> to add your first customer
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={divRef}></div>
                </div>
              </div>
            </div>
            <div className="customer-grid-items">
              {permission?.filter((obj) => obj.name === "Add new customer")?.[0]
                ?.isChecked === false ? null : (
                <div className="import-panel-design">
                  <div className="button-end-side">
                    <div className="relative">
                      {/* <button className="import-button-side">
                        <GoogleContacts
                          clientId="840773866058-a5m3v8ej48090gecv817k4s77mffc29o.apps.googleusercontent.com"
                          buttonText="Contacts"
                          onSuccess={responseCallback}
                          onFailure={responseCallback}
                        />
                      </button> */}
                      <button
                        className="import-button-side"
                        onClick={() => setImportDropdownNew(!importDropdownNew)}
                        ref={importDropdownRef}
                      >
                        <img src={ImportIcon} alt="ImportIcon" />
                        <span>Import</span>
                      </button>
                      <div
                        className={
                          importDropdownNew
                            ? "import-dropdown-style import-dropdown-show"
                            : "import-dropdown-style import-dropdown-hidden"
                        }
                      >
                        <div className="add-new-sub-menu-design-new">
                          {/* <p
                            onClick={() => {
                              customerImport();
                            }}
                          >
                            From Excel
                          </p> */}
                          <p>
                            <GoogleContacts
                              clientId="840773866058-a5m3v8ej48090gecv817k4s77mffc29o.apps.googleusercontent.com"
                              buttonText="Contacts"
                              onSuccess={responseCallback}
                              onFailure={responseCallback}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      className="add-new-button"
                      onClick={() => addNewCustomer()}
                    >
                      Add new
                    </button>
                  </div>
                </div>
              )}
              <div className="customer-full-information-box">
                <div className="personal-date-grid">
                  <div className="personal-date-grid-items">
                    <div className="customer-main-edit-profile-box">
                      <div
                        className={
                          walletHistory?.length > 0
                            ? walletHistory[walletHistory?.length - 1]
                                ?.finalAmount != 0
                              ? "common-service-staff-wallet-add-design customer-main-profile"
                              : "customer-main-profile "
                            : "customer-main-profile "
                        }
                      >
                        <div className="customer-profile-image">
                          {customerDetails?.selectMembership?.slice(-1)[0]
                            ?.isExpire === false ? (
                            customerDetails?.selectMembership?.slice(-1)[0]
                              ?.cardColur === "rgb(248, 226, 124)" ? (
                              <img src={YellowMembership} alt="ProfileImage" />
                            ) : customerDetails?.selectMembership?.slice(-1)[0]
                                ?.cardColur === "rgb(248, 163, 121)" ? (
                              <img src={OrangeMembership} alt="ProfileImage" />
                            ) : customerDetails?.selectMembership?.slice(-1)[0]
                                ?.cardColur === "rgb(109, 200, 199)" ? (
                              <img src={SkyBlueMembership} alt="ProfileImage" />
                            ) : customerDetails?.selectMembership?.slice(-1)[0]
                                ?.cardColur === "rgb(72, 148, 248)" ? (
                              <img src={BlueMembership} alt="ProfileImage" />
                            ) : (
                              <div className="no-image-show-use-round">
                                {customerDetails?.firstName
                                  ? customerDetails?.firstName[0].toUpperCase()
                                  : "A"}
                              </div>
                            )
                          ) : (
                            <div className="no-image-show-use-round">
                              {customerDetails?.firstName
                                ? customerDetails?.firstName[0].toUpperCase()
                                : "A"}
                            </div>
                          )}
                          {/* {
                                  customerDetails?.membership ? 
                                  <img
                                    src={BlueMembership}
                                    alt="ProfileImage"
                                  /> : <div className="customer-profile-image bottom-space-cus-remove">
                                  <div className="no-image-show-use-round">
                                    {customerDetails?.firstName
                                      ? customerDetails?.firstName[0].toUpperCase()
                                      : "A"}
                                  </div>
                                </div>
                                } */}
                        </div>
                        <div className="customer-profile-name">
                          <p>
                            {customerDetails !== undefined
                              ? customerDetails?.firstName +
                                " " +
                                customerDetails?.lastName
                              : ""}
                          </p>
                          {walletHistory?.length > 0 ? (
                            walletHistory[walletHistory?.length - 1]
                              ?.finalAmount > 0 ? (
                              <div className="button-center-alignment-balance-payment">
                                <button>
                                  Balance{" "}
                                  <span> {SettingInfo?.currentType} </span>{" "}
                                  {
                                    walletHistory[walletHistory?.length - 1]
                                      ?.finalAmount
                                  }
                                </button>
                              </div>
                            ) : walletHistory[walletHistory?.length - 1]
                                ?.finalAmount < 0 ? (
                              <div
                                className="button-center-alignment-due-payment"
                                onClick={() => DuePaymentModal(customerDetails)}
                              >
                                <button>
                                  Due <span> {SettingInfo?.currentType} </span>{" "}
                                  {Math.abs(
                                    walletHistory[walletHistory?.length - 1]
                                      ?.finalAmount
                                  )}
                                </button>
                              </div>
                            ) : null
                          ) : null}
                        </div>
                        <div>
                          <div className="profile-edit-delete-alignment">
                            {permission?.filter(
                              (obj) => obj.name === "Edit/delete customer"
                            )?.[0]?.isChecked === false ? null : (
                              <div className="profile-edit-delete-alignment-align-new">
                                {customerDetails !== undefined ? (
                                  <div
                                    className="incon-design"
                                    onClick={(e) =>
                                      editCustomerDetails(e, customerDetails)
                                    }
                                  >
                                    <img src={ProfileEdit} alt="ProfileEdit" />
                                  </div>
                                ) : (
                                  <div className="incon-design">
                                    <img src={ProfileEdit} alt="ProfileEdit" />
                                  </div>
                                )}
                              </div>
                            )}
                            {permission?.filter(
                              (obj) => obj.name === "Edit/delete customer"
                            )?.[0]?.isChecked === false ? null : (
                              <div className="profile-edit-delete-alignment-align-new-right">
                                {customerDetails !== undefined ? (
                                  <div
                                    className="incon-design"
                                    onClick={(e) =>
                                      deleteCustomer(e, customerDetails)
                                    }
                                  >
                                    <img
                                      src={ProfileDelete}
                                      alt="ProfileDelete"
                                    />
                                  </div>
                                ) : (
                                  <div className="incon-design">
                                    <img
                                      src={ProfileDelete}
                                      alt="ProfileDelete"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="cus-tab-design">
                          <ul>
                            <li
                              className={profile && "active-tab-cus-background"}
                              onClick={(e) => openOnClickHandler(e, "Profile")}
                            >
                              Profile
                            </li>
                            {permission?.filter(
                              (obj) => obj.name === "Customer transaction"
                            )?.[0]?.isChecked === false ? null : (
                              <li
                                className={
                                  transction && "active-tab-cus-background"
                                }
                                onClick={(e) =>
                                  openOnClickHandler(e, "Transactions")
                                }
                              >
                                Transactions
                              </li>
                            )}
                            {permission?.filter(
                              (obj) => obj.name === "Customer wallet"
                            )?.[0]?.isChecked === false ? null :  <li
                              className={wallet && "active-tab-cus-background"}
                              onClick={(e) => openOnClickHandler(e, "Wallet")}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span className="flex items-center">Wallet</span>
                              {walletHistory &&
                              walletHistory[walletHistory?.length - 1]
                                ?.finalAmount < 0 ? (
                                <div className="wallet-icon-alignment-new-stroke">
                                  <span onClick={(e) => ClearDuePopUpClick(e)}>
                                    <img src={button} />
                                  </span>
                                </div>
                              ) : (
                                <div className="wallet-icon-alignment-new-stroke">
                                  <span onClick={(e) => AddWallet(e)}>
                                    <img src={button} />
                                  </span>
                                </div>
                              )}
                            </li>}
                            {/*  */}
                            {permission?.filter(
                              (obj) => obj.name === "Membership information"
                            )[0]?.isChecked === false
                              ? null
                              : isMembership && (
                                  <li
                                    className={
                                      membership && "active-tab-cus-background"
                                    }
                                    onClick={(e) =>
                                      openOnClickHandler(e, "Membership")
                                    }
                                  >
                                    Membership
                                  </li>
                                )}
                            {permission?.filter(
                              (obj) => obj.name === "Customer analytics"
                            )?.[0]?.isChecked === false ? null : (
                              <li
                                className={
                                  analytics && "active-tab-cus-background"
                                }
                                onClick={(e) =>
                                  openOnClickHandler(e, customerDetails)
                                }
                              >
                                Analytics
                              </li>
                            )}
                             {permission?.filter(
                              (obj) => obj.name === "Customer feedback & notes"
                            )?.[0]?.isChecked === false ? null : <li
                              className={
                                feedback && "active-tab-cus-background"
                              }
                              onClick={(e) => openOnClickHandler(e, "feedback")}
                            >
                              Feedback & Notes
                            </li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {permission?.filter(
                      (obj) => obj.name === "Add new appointment"
                    )[0]?.isChecked === false ? null : (
                      <div className="book-appointment-button">
                        <button
                          onClick={(e) =>
                            AddNewAppointmentModaltoggle(customerDetails)
                          }
                        >
                          Book appointment
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="personal-date-grid-items">
                    {profile && (
                      <div>
                        <div className="personal-data-heading">
                          <h3>Personal data</h3>
                        </div>
                        <div className="personal-data-grid">
                          <div className="personal-data-grid-items">
                            <span>Full Name</span>
                          </div>
                          <div className="personal-data-grid-items">
                            <p>
                              {customerDetails !== undefined
                                ? customerDetails?.firstName +
                                  " " +
                                  customerDetails?.lastName
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
                              {customerDetails !== undefined
                                ? customerDetails?.mobileNumber
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
                              {customerDetails !== undefined
                                ? customerDetails?.email
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
                              {customerDetails !== undefined
                                ? customerDetails?.gender
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
                              {customerDetails !== undefined &&
                              customerDetails.birthday !==
                                "Invalid date-Invalid date"
                                ? customerDetails?.birthday
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="personal-data-grid">
                          <div className="personal-data-grid-items">
                            <span>Promotional SMS</span>
                          </div>
                          <div className="personal-data-grid-items">
                            <p>
                              {customerDetails !== undefined
                                ? customerDetails?.isPromotional
                                  ? "ON"
                                  : "OFF"
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
                              {customerDetails !== undefined
                                ? customerDetails?.notes
                                : ""}
                            </p>
                          </div>
                        </div>
                        {isMembership &&
                        permission?.filter(
                          (obj) => obj.name === "Membership information"
                        )?.[0]?.isChecked === false ? null : (
                          <>
                            <div className="personal-data-heading">
                              <h3>Membership</h3>
                            </div>
                            <div className="personal-data-grid">
                              <div className="personal-data-grid-items">
                                <span>Status</span>
                              </div>
                              <div className="personal-data-grid-items">
                                <p>
                                  {customerDetails !== undefined
                                    ? customerDetails?.membership
                                      ? "Active"
                                      : "Inactive"
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="personal-data-heading">
                          <h3>Past Activity</h3>
                        </div>
                        <div className="personal-data-grid">
                          <div className="personal-data-grid-items">
                            <span>Last Visit</span>
                          </div>
                          <div className="personal-data-grid-items">
                            <p>
                              {customerAnalytics?.lastvisit
                                ? moment(customerAnalytics?.lastvisit).format(
                                    "LL"
                                  )
                                : " "}{" "}
                              {customerAnalytics?.lastvisit
                                ? `(${moment(
                                    customerAnalytics?.lastvisit
                                    // "YYYYMMDD"
                                  )
                                    .startOf("hour")
                                    .fromNow()})`
                                : " "}
                            </p>
                          </div>
                        </div>
                        <div className="personal-data-grid">
                          <div className="personal-data-grid-items">
                            <span>Most Served by</span>
                          </div>
                          <div className="personal-data-grid-items">
                            <p>
                              {customerAnalytics?.mostservedby[0]?.firstName
                                ? customerAnalytics?.mostservedby[0]?.firstName
                                : " "}{" "}
                              {customerAnalytics?.mostservedby[0]?.lastName
                                ? customerAnalytics?.mostservedby[0]?.lastName
                                : " "}
                            </p>
                          </div>
                        </div>
                        <div className="personal-data-grid">
                          <div className="personal-data-grid-items">
                            <span>Last Served by</span>
                          </div>
                          <div className="personal-data-grid-items">
                            <p>{customerAnalytics?.lastservedby || " "}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {transction && (
                      <div>
                        {isMembership ? (
                          permission?.filter(
                            (obj) => obj.name === "Membership information"
                          )?.[0]?.isChecked === false ? (
                            <div className="personal-data-heading">
                              <h3>Past transactions</h3>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                borderBottom: "2px solid #D1D9E6",
                              }}
                            >
                              <div
                                className="personal-data-heading"
                                onClick={(e) => openOnClickHandler(e, "pTrans")}
                              >
                                <h3
                                  style={{
                                    cursor: "pointer",
                                    color: pTrans && "#1479FF",
                                  }}
                                >
                                  Past transactions
                                </h3>
                              </div>
                              <div
                                className="personal-data-heading"
                                onClick={(e) => openOnClickHandler(e, "mTrans")}
                              >
                                <h3
                                  style={{
                                    cursor: "pointer",
                                    color: mTrans && "#1479FF",
                                  }}
                                >
                                  Membership transactions
                                </h3>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="personal-data-heading">
                            <h3>Past transactions</h3>
                          </div>
                        )}
                        {pTrans && (
                          <div className="personal-transition-table">
                            <table className="personal-data-table">
                              <tr>
                                <th align="left">Date</th>
                                <th align="left">Invoice No.</th>
                                <th align="left"></th>
                                <th align="left"></th>
                                <th align="right">Amount</th>
                                <th align="center">Status</th>
                              </tr>
                              {customerInvoiceDetails.length > 0 ? (
                                customerInvoiceDetails?.map((invoice) => {
                                  return (
                                    invoice?.isCustomerWithoutMembership ===
                                      true && (
                                      <tr
                                        key={invoice._id}
                                        className="border-bottom-none-p"
                                      >
                                        <td>
                                          {moment(invoice?.created).format(
                                            "DD-MMM-YYYY"
                                          )}
                                        </td>
                                        <td
                                          onClick={(e) =>
                                            ViewInvoice(e, invoice)
                                          }
                                        >
                                          <div className="convart-blue">
                                            <span style={{ color: "1479FF" }}>
                                              #{invoice?.invoiceId}
                                            </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="alignment-table-data">
                                            <div className="dot-design dark-blue-background"></div>
                                            <span>
                                              {invoice?.serviceDetails?.length}
                                            </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="alignment-table-data">
                                            <div className="dot-design yellow-background-color"></div>
                                            <span>
                                              {invoice?.products?.length}
                                            </span>
                                          </div>
                                        </td>
                                        <td align="right">
                                          <div className="table-amount-style">
                                            <p>
                                              <span
                                                style={{
                                                  fontFamily:
                                                    "'Roboto', sans-serif",
                                                }}
                                              >
                                                {SettingInfo?.currentType}
                                              </span>{" "}
                                              {parseInt(invoice?.totalAmount)}
                                            </p>
                                          </div>
                                        </td>
                                        <td align="center">
                                          {/* <div className="invoice-Balance-status-btn"> */}
                                          {invoice?.dueStatus === "Paid" ||
                                          !invoice?.dueStatus ? (
                                            <div className="Past-Transactions-paid-status">
                                              <button>Paid</button>
                                            </div>
                                          ) : invoice?.dueStatus ===
                                            "Part paid" ? (
                                            <div className="Past-Transactions-Unpaid-status">
                                              <button>Part paid</button>
                                            </div>
                                          ) : (
                                            <div className="Past-Transactions-Unpaid-status">
                                              <button>Unpaid</button>
                                            </div>
                                          )}

                                          {/* </div> */}
                                          {/* <div className="Past-Transactions-paid-status">
                                            className="Past-Transactions-paid-status" 
                                            <button>Unpaid</button>
                                          </div> */}
                                        </td>
                                      </tr>
                                    )
                                  );
                                })
                              ) : (
                                <div className="system-does-not ">
                                  <p className="text-center">No transactions</p>
                                </div>
                              )}
                            </table>
                          </div>
                        )}
                        {mTrans && (
                          <div className="personal-transition-table">
                            <table className="personal-data-table">
                              <tr>
                                <th align="left">Date</th>
                                <th align="left">Invoice No.</th>
                                <th align="center">Services redeemed</th>
                                <th align="right">Discount</th>
                                <th align="center">Status</th>
                              </tr>
                              {transactionsDetail?.length > 0 ? (
                                transactionsDetail
                                  ?.filter(
                                    (obj) =>
                                      obj.isCustomerWithoutMembership === true
                                  )
                                  ?.map((invoice) => {
                                    return (
                                      <tr
                                        key={invoice._id}
                                        className="border-bottom-none-p"
                                      >
                                        <td>
                                          {moment(invoice?.created).format(
                                            "DD-MMM-YYYY"
                                          )}
                                        </td>
                                        <td
                                          onClick={(e) =>
                                            ViewInvoice(e, invoice)
                                          }
                                        >
                                          <div className="convart-blue">
                                            <span style={{ color: "1479FF" }}>
                                              #{invoice?.invoiceId}
                                            </span>
                                          </div>
                                        </td>
                                        <td align="center">
                                          <div className="alignment-table-data alignment-table-data-center-alignment">
                                            <span>
                                              {
                                                invoice?.membershipServiceRedeemed
                                              }
                                            </span>
                                          </div>
                                        </td>
                                        <td align="right">
                                          <div className="table-amount-style">
                                            <p>
                                              <span
                                                style={{
                                                  fontFamily:
                                                    "'Roboto', sans-serif",
                                                }}
                                              >
                                                {SettingInfo?.currentType}{" "}
                                              </span>
                                              {invoice?.discountMembership}
                                            </p>
                                          </div>
                                        </td>
                                        <td align="center">
                                          {invoice?.dueStatus === "Paid" ||
                                          !invoice?.dueStatus ? (
                                            <div className="Past-Transactions-paid-status">
                                              <button>Paid</button>
                                            </div>
                                          ) : invoice?.dueStatus ===
                                            "Part paid" ? (
                                            <div className="Past-Transactions-Unpaid-status">
                                              <button>Part paid</button>
                                            </div>
                                          ) : (
                                            <div className="Past-Transactions-Unpaid-status">
                                              <button>Unpaid</button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })
                              ) : (
                                <div className="system-does-not ">
                                  <p className="text-center">No transactions</p>
                                </div>
                              )}
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* my */}
                    {wallet && (
                      <React.Fragment>
                        <div className="personal-data-heading">
                          <h3>Wallet balance</h3>
                          {walletHistory?.length !== 0 ? (
                            walletHistory[walletHistory?.length - 1]
                              ?.finalAmount < 0 ? (
                              <p>Withdraw amount</p>
                            ) : (
                              <span onClick={() => withdrawWallet()}>
                                Withdraw amount
                              </span>
                            )
                          ) : (
                            <span onClick={() => addPreviousDue()}>
                              Add previous due
                            </span>
                          )}
                        </div>

                        <div className="customer-total-sale-design-wallet">
                          <div className="total-sale-grid">
                            <div className="total-sale-grid-items">
                              <div className="sub-grid">
                                <div className="sub-grid-items">
                                  <div className="box-design">₹</div>
                                </div>
                                <div className="sub-grid-items">
                                  <p>Wallet balance</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              {walletHistory?.length === 0 ? (
                                <p
                                  style={{ color: "#97A7C3", fontSize: "12px" }}
                                >
                                  Empty
                                </p>
                              ) : walletHistory &&
                                walletHistory[walletHistory?.length - 1]
                                  ?.finalAmount > 0 ? (
                                <span className="wallet-Balance-status">
                                  <button>
                                    Balance{" "}
                                    <span> {SettingInfo?.currentType} </span>
                                    {
                                      walletHistory[walletHistory?.length - 1]
                                        ?.finalAmount
                                    }
                                  </button>
                                </span>
                              ) : walletHistory &&
                                walletHistory[walletHistory?.length - 1]
                                  ?.finalAmount < 0 ? (
                                <span className="wallet-Due-status">
                                  <button>
                                    Due <span>{SettingInfo?.currentType} </span>
                                    {Math.abs(
                                      walletHistory &&
                                        walletHistory[walletHistory?.length - 1]
                                          ?.finalAmount
                                    )}
                                  </button>
                                </span>
                              ) : (
                                <p
                                  style={{ color: "#97A7C3", fontSize: "12px" }}
                                >
                                  Empty
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="personal-data-heading">
                          <h3 style={{ marginTop: "25px" }}>History</h3>
                        </div>

                        <div className="personal-transition-table">
                          <table className="personal-data-table2">
                            <tr>
                              <th align="left">Date</th>
                              <th align="left">Transaction</th>
                              <th align="center">Credit</th>
                              <th align="center">Debit</th>
                              <th align="right">Balance</th>
                            </tr>

                            {/* if DATA available */}
                            {walletHistory
                              ?.slice(0)
                              .reverse()
                              .map((wallet) => {
                                return (
                                  <tr className="border-bottom-none-p">
                                    <td>
                                      {moment(wallet?.created).format(
                                        "DD-MMM-YYYY"
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        color:
                                          wallet?.description != "Top-up"
                                            ? wallet?.description ==
                                                "Withdraw" ||
                                              wallet?.description ==
                                                "Deleted invoice"
                                              ? "#E66666"
                                              : wallet?.description ==
                                                "Due cleared"
                                              ? "#338333"
                                              : "#1479FF"
                                            : "#338333",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => ViewInvoiceId(wallet)}
                                    >
                                      {wallet?.description}
                                    </td>
                                    <td align="center">
                                      {wallet?.type === "CR"
                                        ? wallet?.walletAmount
                                        : "-"}
                                    </td>
                                    <td align="center">
                                      {wallet?.type === "DR"
                                        ? wallet?.walletAmount
                                        : "-"}
                                    </td>
                                    {wallet?.finalAmount >= 0 ? (
                                      <td align="right">
                                        <span className="wallet-Balance">
                                          <button>
                                            Bal{" "}
                                            <span>
                                              {" "}
                                              {SettingInfo?.currentType}{" "}
                                            </span>{" "}
                                            {wallet?.finalAmount}
                                          </button>
                                        </span>
                                      </td>
                                    ) : (
                                      <td align="right">
                                        <span className="wallet-Balance-due">
                                          <button>
                                            Due{" "}
                                            <span>
                                              {" "}
                                              {SettingInfo?.currentType}{" "}
                                            </span>{" "}
                                            {Math.abs(wallet?.finalAmount)}
                                          </button>
                                        </span>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                          </table>

                          {/* if data NOT available */}
                          {walletHistory?.length === 0 && (
                            <div
                              className="noData"
                              style={{ color: "#97A7C3" }}
                            >
                              <img className="Iconstyle" src={NoDataIcon} />
                              <p style={{ fontSize: "12px" }}>
                                No amount added to the wallet yet
                              </p>
                              <p style={{ fontSize: "10px" }}>
                                Click on the + icon add balance to the wallet
                              </p>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    )}
                    {feedback && (
                      <>
                        {customerFeedbacks?.length === 0 ? (
                          <div
                            className="owner-accounts-modal-body-left-right-align"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#97A7C3",
                              }}
                            >
                              <p
                                style={{
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                }}
                              >
                                No data available
                              </p>
                            </div>
                          </div>
                        ) : (
                          customerFeedbacks?.map((invoice) => {
                            return (
                              <div className="review">
                                <div className="reviewbox">
                                  <div>
                                    <div className="invoicedetails">
                                      Invoice{" "}
                                      <span
                                        className="zerocolur"
                                        onClick={(e) => ViewInvoice(e, invoice)}
                                      >
                                        #{invoice?.invoiceId}
                                      </span>
                                    </div>
                                    <div className="invoicedetails">
                                      {moment(invoice?.created).format(
                                        "DD MMM 'YY"
                                      )}
                                    </div>
                                    {/* <div className="invoicedetails">13 Apr ‘22</div> */}
                                  </div>

                                  {
                                    <div className="starimg">
                                      {invoice?.feedback[0]?.star === 0 ||
                                        (!invoice?.feedback[0] && (
                                          <p className="customer-feedback-no-record">
                                            No record
                                          </p>
                                        ))}
                                      {invoice?.feedback[0] && (
                                        <>
                                          <img
                                            src={
                                              "https://i.ibb.co/nfyCrr9/Vector.png"
                                            }
                                            style={{
                                              display:
                                                invoice?.feedback[0]?.star <
                                                  1 && "none",
                                            }}
                                          />
                                          <img
                                            src={
                                              "https://i.ibb.co/nfyCrr9/Vector.png"
                                            }
                                            style={{
                                              display:
                                                invoice?.feedback[0]?.star <
                                                  2 && "none",
                                            }}
                                          />
                                          <img
                                            src={
                                              "https://i.ibb.co/nfyCrr9/Vector.png"
                                            }
                                            style={{
                                              display:
                                                invoice?.feedback[0]?.star <
                                                  3 && "none",
                                            }}
                                          />
                                          <img
                                            src={
                                              "https://i.ibb.co/nfyCrr9/Vector.png"
                                            }
                                            style={{
                                              display:
                                                invoice?.feedback[0]?.star <
                                                  4 && "none",
                                            }}
                                          />
                                          <img
                                            src={
                                              "https://i.ibb.co/nfyCrr9/Vector.png"
                                            }
                                            style={{
                                              display:
                                                invoice?.feedback[0]?.star <
                                                  5 && "none",
                                            }}
                                          />
                                        </>
                                      )}
                                    </div>
                                  }
                                </div>

                                {invoice.feedback[0]?.comment && (
                                  <>
                                    <hr className="linecolour"></hr>
                                    <div className="reviewbox-feedback">
                                      <div className="customer-feedback">
                                        Customer feedback
                                      </div>
                                      <div className="customer-feedback-details">
                                        {invoice.feedback[0]?.comment}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {invoice?.notes ? (
                                  <>
                                    <hr className="linecolour"></hr>
                                    <div className="reviewbox-feedback">
                                      <div className="customer-feedback">
                                        Invoice note
                                      </div>

                                      <div className="customer-feedback-details">
                                        {invoice?.notes}
                                      </div>
                                    </div>
                                  </>
                                ) : null}
                              </div>
                            );
                          })
                        )}
                      </>
                    )}

                    {membership &&
                      (customerDetails?.selectMembership?.length > 0 ? (
                        <div className="customer-add-membership-design">
                          {customerDetails?.selectMembership.map((resp, i) => {
                            return resp.isExpire === false ? (
                              <>
                                <div
                                  className="membership-heading-style"
                                  key={i}
                                >
                                  <h1>Active memberships</h1>
                                </div>
                                <div
                                  className="membership-card-show"
                                  style={{
                                    border: `2px solid ${resp?.cardColur}`,
                                  }}
                                >
                                  <div
                                    className="card-heading"
                                    style={{
                                      background:
                                        resp?.cardColur === "rgb(72, 148, 248)"
                                          ? "linear-gradient(90deg, rgba(20, 121, 255, 0.25) 0%, rgba(20, 121, 255, 0.1) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 226, 124)"
                                          ? "linear-gradient(90deg, rgba(241, 211, 2, 0.25) 0%, rgba(255, 255, 109, 0.1) 100%, rgba(255, 226, 89, 0.1) 100%, rgba(189, 191, 70, 0.1) 100%, rgba(241, 211, 2, 0.1) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(109, 200, 199)"
                                          ? "linear-gradient(90.23deg, rgba(70, 191, 189, 0.5) 0.16%, rgba(70, 191, 189, 0.2) 99.76%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 163, 121)"
                                          ? "linear-gradient(90.23deg, rgba(255, 142, 85, 0.5) 0.16%, rgba(255, 142, 85, 0.2) 99.76%)"
                                          : "",
                                    }}
                                  >
                                    <div className="card-title-grid">
                                      <div className="card-title-grid-items">
                                        <p>{resp?.membershipName}</p>
                                      </div>
                                      <div className="card-title-grid-items">
                                        <div className="round-design">
                                          {resp?.cardColur ===
                                          "rgb(248, 226, 124)" ? (
                                            <img
                                              src={YellowMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : resp?.cardColur ===
                                            "rgb(248, 163, 121)" ? (
                                            <img
                                              src={OrangeMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : resp?.cardColur ===
                                            "rgb(109, 200, 199)" ? (
                                            <img
                                              src={SkyBlueMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : resp?.cardColur ===
                                            "rgb(72, 148, 248)" ? (
                                            <img
                                              src={BlueMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : (
                                            <div className="customer-profile-image bottom-space-cus-remove">
                                              <div className="no-image-show-use-round">
                                                {customerDetails?.firstName
                                                  ? customerDetails?.firstName[0].toUpperCase()
                                                  : "A"}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="card-details-style"
                                    style={{
                                      background:
                                        resp?.cardColur === "rgb(72, 148, 248)"
                                          ? "linear-gradient(90deg, rgba(20, 121, 255, 0.5) 0%, rgba(20, 121, 255, 0.398438) 33.85%, rgba(20, 121, 255, 0.2875) 70.83%, rgba(20, 121, 255, 0.2) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 226, 124)"
                                          ? "linear-gradient(90deg, rgba(255, 226, 89, 0.8) 0%, rgba(255, 226, 89, 0.4) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(109, 200, 199)"
                                          ? "linear-gradient(90deg, rgba(70, 191, 189, 0.8) 0%, rgba(70, 191, 189, 0.4) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 163, 121)"
                                          ? "linear-gradient(90deg, rgba(230, 102, 102, 0.5) 0%, #FF8F56 0.01%, #FFBE9D 100%, rgba(230, 102, 102, 0.2) 100%)"
                                          : "",
                                    }}
                                  >
                                    <div className="all-content-alignment-text">
                                      <div>
                                        <span>Duration</span>
                                        <p>
                                          {resp?.duration}{" "}
                                          {resp?.duration === "1"
                                            ? "month"
                                            : "months"}
                                        </p>
                                      </div>
                                      {SettingInfo?.tax?.gstType ===
                                      "Exclusive" ? (
                                        <div>
                                          <h5>
                                            <a>{SettingInfo?.currentType}</a>
                                            {resp.gst === 0
                                              ? resp?.price
                                              : resp?.price + +resp.gst}
                                          </h5>
                                        </div>
                                      ) : (
                                        <div>
                                          <h5>
                                            <a>{SettingInfo?.currentType}</a>
                                            {resp?.price}
                                          </h5>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="membership-box-details-design">
                                  <div className="membership-information-grid">
                                    <div className="membership-information-grid-items">
                                      <span>Purchase date</span>
                                      <p>
                                        {moment(resp?.purchaseDate).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Benefits</span>
                                      <p>{resp?.membershipBenifits}</p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Validity</span>
                                      <p>{resp?.validFor}</p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Expires on</span>
                                      <p>
                                        {moment(resp?.expiresOn).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Services</span>
                                      <p
                                        className="blue-text-style"
                                        onClick={(e) =>
                                          catalogueToggle(e, resp)
                                        }
                                        style={{ cursor: "pointer" }}
                                      >
                                        Open catalogue
                                      </p>
                                    </div>
                                    {resp?.validFor === "Limited" && (
                                      <div className="membership-information-grid-items">
                                        <span>No. of times valid for</span>
                                        <p>
                                          {resp?.remainingService} out of{" "}
                                          {resp?.availService}
                                        </p>
                                      </div>
                                    )}
                                    {resp?.invoiceID ? (
                                      <div className="membership-information-grid-items">
                                        <span>Purchase invoice</span>
                                        <p
                                          className="blue-text-style"
                                          onClick={(e) => ViewInvoiceId(resp)}
                                        >
                                          {resp?.invoiceID}
                                        </p>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </>
                            ) : null;
                          })}
                        </div>
                      ) : null)}
                    {membership &&
                      (customerDetails?.selectMembership?.length > 0 ? (
                        <div className="customer-add-membership-design">
                          {customerDetails?.selectMembership?.map((resp, i) => {
                            return resp.isExpire === true ? (
                              <>
                                {" "}
                                {i === 0 ? (
                                  <div className="membership-heading-style">
                                    <h1>Expired memberships</h1>
                                  </div>
                                ) : null}
                                <div
                                  key={i}
                                  className="membership-card-show"
                                  style={{
                                    border: `2px solid ${resp?.cardColur}`,
                                  }}
                                >
                                  <div
                                    className="card-heading"
                                    style={{
                                      background:
                                        resp?.cardColur === "rgb(72, 148, 248)"
                                          ? "linear-gradient(90deg, rgba(20, 121, 255, 0.25) 0%, rgba(20, 121, 255, 0.1) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 226, 124)"
                                          ? "linear-gradient(90deg, rgba(241, 211, 2, 0.25) 0%, rgba(255, 255, 109, 0.1) 100%, rgba(255, 226, 89, 0.1) 100%, rgba(189, 191, 70, 0.1) 100%, rgba(241, 211, 2, 0.1) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(109, 200, 199)"
                                          ? "linear-gradient(90.23deg, rgba(70, 191, 189, 0.5) 0.16%, rgba(70, 191, 189, 0.2) 99.76%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 163, 121)"
                                          ? "linear-gradient(90.23deg, rgba(255, 142, 85, 0.5) 0.16%, rgba(255, 142, 85, 0.2) 99.76%)"
                                          : "",
                                    }}
                                  >
                                    <div className="card-title-grid">
                                      <div className="card-title-grid-items">
                                        <p>{resp?.membershipName}</p>
                                      </div>
                                      <div className="card-title-grid-items">
                                        <div className="round-design">
                                          {resp?.cardColur ===
                                          "rgb(248, 226, 124)" ? (
                                            <img
                                              src={YellowMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : resp?.cardColur ===
                                            "rgb(248, 163, 121)" ? (
                                            <img
                                              src={OrangeMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : resp?.cardColur ===
                                            "rgb(109, 200, 199)" ? (
                                            <img
                                              src={SkyBlueMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : resp?.cardColur ===
                                            "rgb(72, 148, 248)" ? (
                                            <img
                                              src={BlueMembership}
                                              alt="ProfileImage"
                                            />
                                          ) : (
                                            <div className="customer-profile-image bottom-space-cus-remove">
                                              <div className="no-image-show-use-round">
                                                {customerDetails?.firstName
                                                  ? customerDetails?.firstName[0].toUpperCase()
                                                  : "A"}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="card-details-style"
                                    style={{
                                      background:
                                        resp?.cardColur === "rgb(72, 148, 248)"
                                          ? "linear-gradient(90deg, rgba(20, 121, 255, 0.5) 0%, rgba(20, 121, 255, 0.398438) 33.85%, rgba(20, 121, 255, 0.2875) 70.83%, rgba(20, 121, 255, 0.2) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 226, 124)"
                                          ? "linear-gradient(90deg, rgba(255, 226, 89, 0.8) 0%, rgba(255, 226, 89, 0.4) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(109, 200, 199)"
                                          ? "linear-gradient(90deg, rgba(70, 191, 189, 0.8) 0%, rgba(70, 191, 189, 0.4) 100%)"
                                          : resp?.cardColur ===
                                            "rgb(248, 163, 121)"
                                          ? "linear-gradient(90deg, rgba(230, 102, 102, 0.5) 0%, #FF8F56 0.01%, #FFBE9D 100%, rgba(230, 102, 102, 0.2) 100%)"
                                          : "",
                                    }}
                                  >
                                    <div className="all-content-alignment-text">
                                      <div>
                                        <span>Duration</span>
                                        <p>
                                          {resp?.duration}{" "}
                                          {resp?.duration === "1"
                                            ? "month"
                                            : "months"}
                                        </p>
                                      </div>
                                      {SettingInfo.tax.gstType ===
                                      "Inclusive" ? (
                                        <div>
                                          <h5>
                                            <a>{SettingInfo?.currentType}</a>{" "}
                                            {resp?.price +
                                              parseInt(resp?.gst, 10)}
                                          </h5>
                                        </div>
                                      ) : (
                                        <div>
                                          <h5>
                                            <a>{SettingInfo?.currentType}</a>{" "}
                                            {resp?.price}
                                          </h5>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="membership-box-details-design">
                                  <div className="membership-information-grid">
                                    <div className="membership-information-grid-items">
                                      <span>Purchase date</span>
                                      <p>
                                        {moment(resp?.purchaseDate).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Benefits</span>
                                      <p>{resp?.membershipBenifits}</p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Validity</span>
                                      <p>{resp?.validFor}</p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Expires on</span>
                                      <p>
                                        {moment(resp?.expiresOn).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </p>
                                    </div>
                                    <div className="membership-information-grid-items">
                                      <span>Services</span>
                                      <p
                                        className="blue-text-style"
                                        onClick={(e) =>
                                          catalogueToggle(e, resp)
                                        }
                                        style={{ cursor: "pointer" }}
                                      >
                                        Open catalogue
                                      </p>
                                    </div>
                                    {resp?.validFor === "Limited times" && (
                                      <div className="membership-information-grid-items">
                                        <span>No. of times valid for</span>
                                        <p>00 out of 00</p>
                                      </div>
                                    )}
                                    {resp?.invoiceID ? (
                                      <div className="membership-information-grid-items">
                                        <span>Purchase invoice</span>
                                        <p
                                          className="blue-text-style"
                                          onClick={(e) => ViewInvoiceId(resp)}
                                        >
                                          {resp?.invoiceID}
                                        </p>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <div className="empty-membership-box-heihgt-alignment">
                          <div className="all-globally-new-statement-empty-alignment">
                            <div className="icon-center-alignment">
                              <svg
                                width="36"
                                height="30"
                                viewBox="0 0 36 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="path-1-outside-1_4810_3205"
                                  maskUnits="userSpaceOnUse"
                                  x="7.0835"
                                  y="5.59961"
                                  width="26"
                                  height="22"
                                  fill="black"
                                >
                                  <rect
                                    fill="white"
                                    x="7.0835"
                                    y="5.59961"
                                    width="26"
                                    height="22"
                                  />
                                  <path d="M8.0835 9.59961C8.0835 7.94275 9.42664 6.59961 11.0835 6.59961H28.4168C30.0737 6.59961 31.4168 7.94275 31.4168 9.59961V21.7996C31.4168 24.0088 29.626 25.7996 27.4168 25.7996H11.0835C9.42664 25.7996 8.0835 24.4565 8.0835 22.7996V9.59961Z" />
                                </mask>
                                <path
                                  d="M11.0835 7.59961H28.4168V5.59961H11.0835V7.59961ZM30.4168 9.59961V21.7996H32.4168V9.59961H30.4168ZM27.4168 24.7996H11.0835V26.7996H27.4168V24.7996ZM9.0835 22.7996V9.59961H7.0835V22.7996H9.0835ZM11.0835 24.7996C9.97893 24.7996 9.0835 23.9042 9.0835 22.7996H7.0835C7.0835 25.0088 8.87436 26.7996 11.0835 26.7996V24.7996ZM30.4168 21.7996C30.4168 23.4565 29.0737 24.7996 27.4168 24.7996V26.7996C30.1782 26.7996 32.4168 24.561 32.4168 21.7996H30.4168ZM28.4168 7.59961C29.5214 7.59961 30.4168 8.49504 30.4168 9.59961H32.4168C32.4168 7.39047 30.626 5.59961 28.4168 5.59961V7.59961ZM11.0835 5.59961C8.87436 5.59961 7.0835 7.39047 7.0835 9.59961H9.0835C9.0835 8.49504 9.97893 7.59961 11.0835 7.59961V5.59961Z"
                                  fill="#97A7C3"
                                  mask="url(#path-1-outside-1_4810_3205)"
                                />
                                <rect
                                  x="5.1665"
                                  y="3.59961"
                                  width="25.83"
                                  height="21.7"
                                  rx="3"
                                  fill="white"
                                />
                                <rect
                                  x="4.6665"
                                  y="3.09961"
                                  width="24.3333"
                                  height="20.2"
                                  rx="3.5"
                                  fill="white"
                                  stroke="#97A7C3"
                                />
                                <path
                                  d="M11.1284 11.4163L11.4171 11.008L11.1284 11.4163ZM13.9989 13.4462L13.7102 13.8544L13.9989 13.4462ZM13.3528 17.9121L13.0641 17.5038L13.3528 17.9121ZM13.2765 17.8554L12.8022 17.6971L13.2765 17.8554ZM16.2559 15.859L16.5446 16.2672L16.2559 15.859ZM20.3902 17.8554L20.8645 17.6971L20.3902 17.8554ZM20.3139 17.9121L20.0252 18.3203L20.3139 17.9121ZM19.6677 13.4462L19.3791 13.038L19.6677 13.4462ZM19.2966 14.5793L19.7709 14.421L19.2966 14.5793ZM22.5382 11.4163L22.2495 11.008L22.5382 11.4163ZM17.9823 10.6421L17.508 10.8004L17.9823 10.6421ZM16.8808 7.34227L16.4065 7.50059L16.8808 7.34227ZM16.7859 7.34227L17.2602 7.50059L16.7859 7.34227ZM16.4065 7.50059L17.508 10.8004L18.4566 10.4837L17.355 7.18395L16.4065 7.50059ZM18.9308 11.8254H22.5094V10.8254H18.9308V11.8254ZM22.2495 11.008L19.3791 13.038L19.9564 13.8544L22.8269 11.8245L22.2495 11.008ZM18.8223 14.7376L19.9159 18.0137L20.8645 17.6971L19.7709 14.421L18.8223 14.7376ZM20.6026 17.5038L17.6994 15.4507L17.122 16.2672L20.0252 18.3203L20.6026 17.5038ZM15.9672 15.4507L13.0641 17.5038L13.6415 18.3203L16.5446 16.2672L15.9672 15.4507ZM13.7507 18.0137L14.8443 14.7376L13.8958 14.421L12.8022 17.6971L13.7507 18.0137ZM14.2876 13.038L11.4171 11.008L10.8397 11.8245L13.7102 13.8544L14.2876 13.038ZM11.1573 11.8254H14.7358V10.8254H11.1573V11.8254ZM16.1587 10.8004L17.2602 7.50059L16.3116 7.18395L15.2101 10.4837L16.1587 10.8004ZM14.7358 11.8254C15.3812 11.8254 15.9543 11.4126 16.1587 10.8004L15.2101 10.4837C15.142 10.6878 14.951 10.8254 14.7358 10.8254V11.8254ZM11.4171 11.008C11.7754 11.2614 11.5962 11.8254 11.1573 11.8254V10.8254C10.6209 10.8254 10.4018 11.5148 10.8397 11.8245L11.4171 11.008ZM14.8443 14.7376C15.0538 14.1103 14.8276 13.4198 14.2876 13.038L13.7102 13.8544C13.8902 13.9817 13.9656 14.2119 13.8958 14.421L14.8443 14.7376ZM13.0641 17.5038C13.4191 17.2528 13.8884 17.6013 13.7507 18.0137L12.8022 17.6971C12.6339 18.2012 13.2075 18.6272 13.6415 18.3203L13.0641 17.5038ZM17.6994 15.4507C17.1804 15.0837 16.4863 15.0837 15.9672 15.4507L16.5446 16.2672C16.7177 16.1449 16.949 16.1449 17.122 16.2672L17.6994 15.4507ZM19.9159 18.0137C19.7782 17.6013 20.2476 17.2527 20.6026 17.5038L20.0252 18.3203C20.4591 18.6272 21.0328 18.2012 20.8645 17.6971L19.9159 18.0137ZM19.3791 13.038C18.8391 13.4198 18.6129 14.1103 18.8223 14.7376L19.7709 14.421C19.7011 14.2119 19.7764 13.9817 19.9564 13.8544L19.3791 13.038ZM22.5094 11.8254C22.0705 11.8254 21.8912 11.2614 22.2495 11.008L22.8269 11.8245C23.2649 11.5148 23.0458 10.8254 22.5094 10.8254V11.8254ZM17.508 10.8004C17.7124 11.4126 18.2854 11.8254 18.9308 11.8254V10.8254C18.7157 10.8254 18.5247 10.6878 18.4566 10.4837L17.508 10.8004ZM17.355 7.18395C17.1877 6.68282 16.4789 6.68282 16.3116 7.18395L17.2602 7.50059C17.1233 7.91061 16.5434 7.91061 16.4065 7.50059L17.355 7.18395Z"
                                  fill="#97A7C3"
                                />
                              </svg>
                            </div>
                            <div className="text-style">
                              <p>No membership assigned so far</p>
                              <h4>
                                Click on <a>Add new</a> to add your first
                                customer
                              </h4>
                            </div>
                          </div>
                        </div>
                      ))}

                    {analytics && (
                      <div>
                        <div
                          className="personal-data-heading"
                          style={{ margin: "0 0 25px 0" }}
                        >
                          <h3>Analytics</h3>
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
                                  <p>Total Sales</p>
                                  <h3>
                                    <span>{SettingInfo?.currentType}</span>{" "}
                                    {customerAnalytics?.totalSales}
                                  </h3>
                                </div>
                              </div>
                            </div>
                            <div className="total-sale-grid-items-chart">
                              <div className="cus-chart-grid">
                                <div className="cus-chart-grid-items">
                                  <div>
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
                                          {customerAnalytics?.service}
                                        </p>
                                      </div>
                                    </div>
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
                                          {customerAnalytics?.product}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="cus-chart-grid-items">
                                  {/* <img src={CusChart} alt="CusChart" /> */}
                                  {(customerAnalytics?.service === 0 ||
                                    customerAnalytics?.service === null) &&
                                  customerAnalytics?.product === 0 ? (
                                    <Pie
                                      data={nullData}
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
                                        tooltips: {
                                          enabled: false,
                                        },
                                      }}
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
                                        tooltips: {
                                          enabled: false,
                                        },
                                        legend: {
                                          display: false,
                                          position: "right",
                                        },
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="analytics-grid">
                          <div className="analytics-grid-items">
                            <div className="data-grid">
                              <div className="data-grid-items">
                                <div className="data-store-box first-child-box-color">
                                  <img src={CalendarIcon} alt="CalendarIcon" />
                                </div>
                              </div>
                              <div className="data-grid-items">
                                <p>Total Bookings</p>
                                <h5>{customerAnalytics?.totalBooking}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="analytics-grid-items">
                            <div className="data-grid">
                              <div className="data-grid-items">
                                <div className="data-store-box sec-background-color">
                                  <img
                                    src={CancelCalendarIcon}
                                    alt="CancelCalendarIcon"
                                  />
                                </div>
                              </div>
                              <div className="data-grid-items">
                                <p>Cancelled appointments</p>
                                <h5>{customerAnalytics?.cancelAppointment}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="analytics-grid-items">
                            <div className="data-grid">
                              <div className="data-grid-items">
                                <div className="data-store-box three-background-color">
                                  <img src={HideIcon} alt="HideIcon" />
                                </div>
                              </div>
                              <div className="data-grid-items">
                                <p>No-shows</p>
                                <h5>{customerAnalytics?.noshows}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="analytics-grid-items">
                            <div className="data-grid">
                              <div className="data-grid-items">
                                <div className="data-store-box first-child-box-color">
                                  <img src={TicketIcon} alt="TicketIcon" />
                                </div>
                              </div>
                              {/* <div className="data-grid-items">
                                    <p>Average ticket size</p>
                                    <h5>
                                      <span>₹</span>
                                      {parseFloat(customerAnalytics?.averageTicketSize).toFixed(2)}
                                    </h5>
                                  </div>
                                </div>
                              </div> */}
                              <div className="data-grid-items">
                                <p>Average ticket size</p>
                                <h5>
                                  <span>{SettingInfo?.currentType}</span>
                                  {customerAnalytics?.averageTicketSize
                                    ? parseFloat(
                                        customerAnalytics?.averageTicketSize
                                      ).toFixed(2)
                                    : 0}
                                </h5>
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
          </div>
        </div>
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
      {editCatalogue && (
        <EditCatalogueModal
          modal={editCatalogue}
          toggle={editCatalogueToggle}
          membershipData={membershipData}
          SettingInfo={SettingInfo}
        />
      )}
      {discountedServiceCatalogue && (
        <DiscountedServiceCatalogue
          modal={discountedServiceCatalogue}
          toggle={discountedServiceCatalogueToggle}
          SettingInfo={SettingInfo}
        />
      )}
      {openDuePaymentModal && (
        <CustomerDuePaymentModal
          modal={openDuePaymentModal}
          customerDetails={customerDetails}
          toggle={OpenDuePaymentModaltoggle}
          dueTransction={dueTransction}
          SettingInfo={SettingInfo}
          dueAmount={Math.abs(
            walletHistory[walletHistory?.length - 1]?.finalAmount
          )}
        />
      )}
      {addwalletModal && (
        <AddWalletModal
          modal={addwalletModal}
          toggle={AddWallettoggle}
          // AddWallet={AddNewWallet}
          customerDetails={customerDetails}
          search={search}
          SettingInfo={SettingInfo}
        />
      )}
      {withdrawModal && (
        <WithdrawWallet
          modal={withdrawModal}
          toggle={withdrawWallet}
          customerDetails={customerDetails}
          SettingInfo={SettingInfo}
          walletAmount={walletHistory[walletHistory?.length - 1]?.finalAmount}
          userInfo={userInfo}
        />
      )}

      {clearDuePopUp && (
        <ClearDuePopUp
          modal={clearDuePopUp}
          toggle={ClearDuePopUpToggle}
          description={
            "The customer is yet to pay the due amount. Would you like to clear the due amount of customer first?"
          }
          add={"Clear dues"}
          cancle={"Cancle"}
        />
      )}
      {addPrevious && (
        <AddPreviousDueModal
          toggle={addPreviousDue}
          SettingInfo={SettingInfo}
          customerDetails={customerDetails}
        />
      )}
    </>
  );
}
