import React, { useEffect, useState } from "react";
import AppointmentsStatement from "./appointmentsStatement";
import CollectionsStatement from "./CollectionsStatement";
import CustomersStatement from "./customersStatement";
import "./mobileNewStatement.scss";
import MobileSalesStatement from "./mobileSalesStatement";
import StaffStatement from "./StaffStatement";
import { useParams } from "react-router-dom";
import moment from "moment";
import { ApiGet, ApiPost } from "../../helpers/API/ApiData";
import GridIcon from "../../assets/svg/grid.svg";
import Loader from "../Common/Loader/Loader";


export default function MobileNewStatement() {
  const params = useParams();

  const userInfo = {companyId:params?.id};
  const colorList = [
    "#46BFBD",
    "#F4BD6E",
    "#0B84A5",
    "#84F2D6",
    "#F0E48E",
    "#4C6268",
    "#E1E8E4",
    "#F36363",
    "#7876D9",
    "#AEEF7D",
    "#A1C9FF",
    "#FFBADB",
    "#F69E71",
    "#2F4B7C",
    "#62B095",
    "#80EA9D",
    "#FF9B9B",
    "#C4DDFF",
    "#CEA9FF",
    "#756C83",
  ];
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState({});
  const [salesDat, setSalesDat] = useState({});
  const [saleData, setSaleData] = useState({});
  const [collectionData, setCollectionData] = useState({});
  const [offerData, setOfferData] = useState({});
  const [staffData, setStaffData] = useState([]);
  const [staffTransactionsData, setStaffTransactionsData] = useState([]);
  const [currentInvoices, setCurrentInvoices] = useState([]);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tempdate, setTempdate] = useState();
  const [totalCommission, setTotalCommission] = useState([]);
  const [totalCommissionSum, setTotalCommissionSum] = useState(0);
  const [soldProductListModal, setSoldProductListModal] = useState(false);
  const [openWalletList, setOpenWalletList] = useState(false);
  const [walletTopup, setWalletTopup] = useState();
  const [walletWithdraw, setWalletWithdraw] = useState();
  const [previousDue, setPreviousDue] = useState();
  const [dueCount, setDueCount] = useState();
  const [dueAmountTotal, setDueAmountTotal] = useState();
  const [availableBalance, setAvailbleBalance] = useState();
  const soldProductListToggle = () =>
    setSoldProductListModal(!soldProductListModal);

  const OpenWalletListHander = () => {
    setOpenWalletList(!openWalletList);
  };

  const [generatedInvoiceListModal, setGeneratedInvoiceListModal] =
    useState(false);
  const generatedInvoiceListToggle = () =>
    setGeneratedInvoiceListModal(!generatedInvoiceListModal);
  const [availService, setAvailService] = useState(0);
  const [availServiceData, setAvailServiceData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [averageRatingData, setAverageRatingData] = useState([]);
  const [newGeneratedCustomer, setNewGeneratedCustomer] = useState(0);
  const [walkincustomer, setWalkincustomer] = useState(0);
  const [newcustomer, setNewcustomer] = useState(0);
  const [returncustomer, setReturncustomer] = useState(0);
  const [openingBalanceDetail, setOpeningBalanceDetail] = useState();
  const [closingBalanceDetail, setClosingBalanceDetail] = useState();
  const [opendailywhatsup, setOpenDailyWhatsup] = useState(false);
  const [expense, setExpense] = useState();
  const [staffPay, setStaffPay] = useState();
  const [transfer, setTransfer] = useState();
  const [reccieve, setReccieve] = useState();
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [popularhours, setPopularHours] = useState([]);
  const [view, setView] = useState("grid");
  const [currntView, setCurrntView] = useState("Sales");
  const [addedPermission, setAddedPermission] = useState([]);
  const [lastcurrentInvoices, setLastCurrentInvoices] = useState([]);
  
  const [lastsalesData, setLastSalesData] = useState({});
  const [lastsalesDat, setlastSalesDat] = useState({});
  const [lastsaleData, setlastSaleData] = useState({});
  const [lastcollectionData, setlastCollectionData] = useState({});
  const [businessName, setBusinessName] = useState();

  const [currentType, setCurrentType] = useState("₹");
  const [paymentMethodss, setPaymentMethodss] = useState([]);

  
  const getBusinessName= async () => {

    ApiGet("account/company/companyData/" + userInfo.companyId)
    .then((resp) => {
      setBusinessName(resp.data.data[0].businessName);
    })
    .catch((er) => {
      alert(er);
    });
   }

   useEffect(async()=>{
    const queryString = require('query-string');
    const parsed = queryString.parse(window.location.search);
      setStartDate(moment(parsed.date).format());
      setEndDate(moment(parsed.date).format());
    let res = await ApiGet("setting/company/" + params?.id)
    try {
      if (res.data.status === 200) {
        setPaymentMethodss(res?.data?.data[0].collections?.collectionpaymentMethod)
        setCurrentType(res?.data?.data[0].currentType)
      }
    } catch (err) {
      console.log("in the catch");
    }
   },[])

  let today=moment(startDate).format("dddd")
  const getlastSale = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).subtract(7, "days").format("L"),
      endTime: moment(temEndDate).subtract(7, "days").format("L"),
    };
    let res = await ApiPost(
      "dashboard/sales/visits/company/apointment/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setLastSalesData(res.data.data);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
    try {
      let Body = {
        startTime: moment(startDate).subtract(7, "days").format("L"),
        endTime: moment(temEndDate).subtract(8, "days").format("L"),
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
        setlastSalesDat(details);
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
        setlastSaleData(details);
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  }

  const getlastCollection = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).subtract(7, "days").format("L"),
      endTime: moment(temEndDate).subtract(7, "days").format("L"),
    };
    let res = await ApiPost(
      "dashboard/generate/collection/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setlastCollectionData(res.data.data);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  let permission = addedPermission.flat(2)

  const getDailyupdate = async () => {
    await ApiGet("statement/company/" + userInfo?.companyId)
      .then(async (res) => {
    
        setAddedPermission(res.data.data[0].permission);
        let view =res.data.data[0].permission.map((per)=>{
          if(per[1].length > 0){
            return(
              per[0]
              )
            }
        })
        setCurrntView(view?.filter((obj)=>obj != undefined)[0])

      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDailyupdate()
  }, [])

  const getAppointment = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
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
    try {
      let Body = {
        startTime: moment(startDate).format("L"),
        endTime: moment(endDate).format("L"),
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
        setSalesDat(details);
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
        setSaleData(details);
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  const getCollection = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
    };
    let res = await ApiPost(
      "dashboard/generate/collection/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setCollectionData(res.data.data);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const getData = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      starttime: moment(startDate).format("yyyy-MM-DD"),
      endTime: moment(temEndDate).format("yyyy-MM-DD"),
    };
    let res = await ApiPost("invoice/dashboard/" + userInfo.companyId, payload);
    try {
      if (res.data.status === 200) {
        var _ = require("lodash");
        let response = _.groupBy(res.data.data?.serviceArray, "categoryName");
        let item1 = Object.entries(response);
        setAvailServiceData(item1);
       ;
        setAvailService(res.data.data?.serviceCount);
        setAverageRatingData(res.data.data?.invoiceRating);
        setAverageRating(res.data.data?.averageRating);
        setNewGeneratedCustomer(res.data.data?.customerList);
        setWalkincustomer(res.data.data?.wallIn);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const getOfferData = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
    };
    let res = await ApiPost(
      "dashboard/dicount/offer/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setOfferData(res.data.data);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const getStaffData = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
    };
    let res = await ApiPost(
      "dashboard/customer/staff/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setStaffData(res.data.data);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const getStaffTransactionsData = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
    };
    let res = await ApiPost(
      "dashboard/allstaff/servicecount/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setStaffTransactionsData(res.data.data);
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
        let filteredInvoiceList = invoiceList.filter((item, index) => {
          return (
            moment(startDate).format("L") <=
            moment(item?.created).format("L") &&
            moment(item?.created).format("L") <= moment(endDate).format("L") &&
            item &&
            item?.isActive === true
          );
        });
        let removeManualMembership=filteredInvoiceList?.filter((obj)=> obj.isCustomerWithoutMembership === true)
        setCurrentInvoices(removeManualMembership);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const getLastInvoices = async () => {
    let walkinss;
    let newCustome;
    let returncustome;
    let temEndDate = moment(endDate).subtract(6, "days")._d;
    let payload = {
      starttime: moment(startDate).subtract(7, "days").format("yyyy-MM-DD"),
      endTime: moment(temEndDate).format("yyyy-MM-DD"),
    };
    let res = await ApiPost("invoice/dashboard/" + userInfo.companyId, payload);
    try {
      if (res.data.status === 200) {
        walkinss = res.data.data?.wallIn;
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
    let datas = {
      startTime: moment(startDate).subtract(7, "days").format("yyyy-MM-DD"),
      endTime: moment(moment(endDate).subtract(6, "days")._d).format(
        "YYYY-MM-DD"
      ),
    };
    await ApiPost("invoice/newCustomer/dashboard/" + userInfo?.companyId, datas)
      .then(async (res) => {
        returncustome = res.data.data.returningCustomer;
        newCustome = res.data.data.newCustomer;
      })
      .catch((err) => {
        console.log(err);
      });
    setLastCurrentInvoices(walkinss + newCustome + returncustome);
    setLoading(false)
  };

  //get commission transactions
  const getTransactions = async (e) => {
    // monthly commission data
    // let payload = {
    //   startTime: moment(startDate).startOf("month").format("YYYY-MM-DD"),
    //   endTime: moment(startDate).endOf("month").format("YYYY-MM-DD"),
    // };
    // --------

    // selected time period commission data
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
    };
    // --------
    let res = await ApiPost(
      "staff/company/commision/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setTotalCommission(res.data.data?.staffCommision);
        let tempCommission = res.data.data?.staffCommision?.filter(
          (sc) => sc?.data
        );
        let tempCommissionSum =
          tempCommission?.length > 0
            ? tempCommission?.reduce((a, b) => +a + +b?.data, 0)
            : 0;
        setTotalCommissionSum(tempCommissionSum);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const ViewInvoiceModalToggle = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
    if (viewInvoiceModal === true) {
      getInvoices();
    }
  };

  const ViewInvoice = (e, data) => {
    ViewInvoiceModalToggle();
    TostMSG();
    setInvoiceDetail(data);
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


   

  const getDueAndWallet = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let payload = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
      companyId: userInfo.companyId,
    };
    let res = await ApiPost(
      "dashboard/topup/entry/wallet/data/value/invoice/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        setWalletTopup(res?.data?.data?.crEntry);
        setDueAmountTotal(res?.data?.data?.invoiceValue);
        setDueCount(res?.data?.data?.invoiceCount);
        setAvailbleBalance(res?.data?.data?.finalCount);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const getOpeningCloaingData = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    setTempdate(temEndDate);
    let openingDR = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
      companyId: userInfo.companyId,
      type: "CR",
      typeValue: "opening-balance",
      paymentMethod:"Cash"
    };

    await ApiPost("expence/company/expenseDetails", openingDR)
      .then((res) => {
        setOpeningBalanceDetail(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });

    let closingBala = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod:"Cash"
    };
    await ApiPost("expence/daywise/expense", closingBala)
      .then(async (res) => {
      
        setClosingBalanceDetail(res.data.data);
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

  const getWalletData = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod:"Cash" 
    };
    await ApiPost("expence/company/topup/wallet", datas)
      .then(async (res) => {
        setPreviousDue(res.data.data.previousDue);
        setWalletWithdraw(res.data.data.walletWithdraw);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getExpence = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "expence",
      paymentMethod:"Cash"
    };

    await ApiPost("expence/company/expenseDetails", datas)
      .then(async (res) => {
  
        setExpense(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getStaffpay = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "staff",
      paymentMethod:"Cash"
    };

    await ApiPost("expence/company/expenseDetails", datas)
      .then(async (res) => {
        setStaffPay(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getReccieve = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "CR",
      typeValue: "deposit",
      paymentMethod:"Cash"
    };

    await ApiPost("expence/company/expenseDetails", datas)
      .then(async (res) => {
        setReccieve(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTransfer = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      type: "DR",
      typeValue: "transfer",
      paymentMethod:"Cash"
    };

    await ApiPost("expence/company/expenseDetails", datas)
      .then(async (res) => {
        setTransfer(res.data.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPopularHour = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
    };

    await ApiPost("appointment/appointment/" + userInfo?.companyId, datas)
      .then(async (res) => {
        let item = Object.entries(res.data.data);
        setPopularHours(item);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAttendance = async () => {
    setLoading(true)
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
    };
    await ApiPost("invoice/attendence/dashboard/" + userInfo?.companyId, datas)
      .then(async (res) => {
        setStaffPerformance(res.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCustomer = async () => {
    let temEndDate = moment(endDate).add(1, "days")._d;
    let datas = {
      startTime: moment(startDate).format("YYYY-MM-DD"),
      endTime: moment(temEndDate).format("YYYY-MM-DD"),
    };
    await ApiPost("invoice/newCustomer/dashboard/" + userInfo?.companyId, datas)
      .then(async (res) => {
        setReturncustomer(res.data.data.returningCustomer);
        setNewcustomer(res.data.data.newCustomer);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (endDate) {
      getAttendance();
      getBusinessName()
      getCustomer();
      getPopularHour();
      getAppointment();
      getCollection();
      getData();
      getExpence();
      getStaffpay();
      getReccieve();
      getTransfer();
      getWalletData();
      getOpeningCloaingData();
      getOfferData();
      getStaffData();
      getStaffTransactionsData();
      getInvoices();
      getTransactions();
      getDueAndWallet();
      getlastSale()
      getlastCollection()
      getLastInvoices()
    
    }
  }, [startDate, endDate]);

  const showGridView=()=>{
    setView("list")

    let view =addedPermission.map((per)=>{
      if(per[1].length > 0){
        return(
          per[0]
          )
        }
    })
    setCurrntView(view?.filter((obj)=>obj != undefined)[0])

  }

  return (
    <>
      <div className="mobile-view-statement-mobile-container">
        <div className="daily-statements-header">
          <div>
            <h1>Daily statements</h1>
            <p>{moment(startDate).format("DD MMM yyyy")} | {businessName}</p>
          </div>
          <div>
            {view == "grid" ? (
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => showGridView() }
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="35"
                  height="35"
                  rx="4.5"
                  fill="white"
                />
                <path
                  d="M16 9H9V16H16V9Z"
                  stroke="#1479FF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M27 9H20V16H27V9Z"
                  stroke="#1479FF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M27 20H20V27H27V20Z"
                  stroke="#1479FF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 20H9V27H16V20Z"
                  stroke="#1479FF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="35"
                  height="35"
                  rx="4.5"
                  stroke="#7DAFF2"
                />
              </svg>
            ) : (
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => { setView("grid") }}
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="35"
                  height="35"
                  rx="4.5"
                  fill="white"
                />
                <path
                  d="M14 12H27M14 18H27M14 24H27M9 12H9.01M9 18H9.01M9 24H9.01"
                  stroke="#1479FF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="35"
                  height="35"
                  rx="4.5"
                  stroke="#7DAFF2"
                />
              </svg>
            )}
          </div>
        </div>
        {loading ? <Loader /> 
          :<>
        {view == "list" && (
          <div className="mobile-statement-tab">
            <ul>
              {addedPermission && addedPermission[0] && addedPermission[0][1]?.length > 0 && <li className={currntView == "Sales" ? "active" : ""} onClick={() => setCurrntView("Sales")}>Sales</li>}
              {addedPermission && addedPermission[0] && addedPermission[1][1]?.length > 0 && <li className={currntView == "Appointments" ? "active" : ""} onClick={() => setCurrntView("Appointments")}>Appointments</li>}
              {addedPermission && addedPermission[0] && addedPermission[2][1]?.length > 0 && <li className={currntView == "Collections" ? "active" : ""} onClick={() => setCurrntView("Collections")}>Collections</li>}
              {addedPermission && addedPermission[0] && addedPermission[3][1]?.length > 0 && <li className={currntView == "Staff" ? "active" : ""} onClick={() => setCurrntView("Staff")}> Staff</li>}
              {addedPermission && addedPermission[0] && addedPermission[4][1]?.length > 0 && <li  className={currntView == "Customers" ? "active" : ""} onClick={() => setCurrntView("Customers")}>Customers</li>}
            </ul>
          </div>
        )}
        <div className="mobile-view-statement-all-content-alignment">
          {addedPermission && addedPermission[0] && addedPermission[0][1]?.length > 0 ? ((currntView == "Sales" ||
            view == "grid") && (
              <MobileSalesStatement
                salesData={salesData}
                invoiceNo={currentInvoices?.length}
                offerData={offerData}
                dueAmountTotal={dueAmountTotal}
                dueCount={dueCount}
                soldProductListToggle={soldProductListToggle}
                generatedInvoiceListToggle={generatedInvoiceListToggle}
                permission={permission}
                lastsalesData={lastsalesData}
                today={today}
                startDate={startDate}
                temEndDate={tempdate}
                currentType={currentType}
              />
            )) : null}
          {addedPermission && addedPermission[0] && addedPermission[1][1]?.length > 0 ? ((currntView == "Appointments" ||
            view == "grid") && (
              <AppointmentsStatement
                saleData={saleData}
                salesDat={salesDat}
                availService={availService}
                availServiceData={availServiceData}
                popularhours={popularhours}
                permission={permission}
                today={today}
                startDate={startDate}
                temEndDate={tempdate}
                lastsaleData={lastsaleData}
                lastsalesDat={lastsalesDat}
              />
            )) : null}
          {addedPermission && addedPermission[0] && addedPermission[2][1]?.length > 0 ? ((currntView == "Collections" ||
            view == "grid") && (
              <CollectionsStatement
                collectionData={collectionData}
                colorList={colorList}
                openingBalanceDetail={openingBalanceDetail}
                closingBalanceDetail={closingBalanceDetail}
                startDate={startDate}
                temEndDate={tempdate}
                staffPay={staffPay}
                expense={expense}
                transfer={transfer}
                reccieve={reccieve}
                permission={permission}
                today={today}
                lastcollectionData={lastcollectionData}
                currentType={currentType}
                userInfo={userInfo}
                paymentMethod={paymentMethodss}
              />
            )) : null}
          {addedPermission && addedPermission[0] && addedPermission[3][1]?.length > 0 ? ((currntView == "Staff" ||
            view == "grid") && (
              <StaffStatement
                staffTransactionsData={staffTransactionsData}
                colorList={colorList}
                staffPerformance={staffPerformance}
                permission={permission}
                currentType={currentType}
              />
            )) : null}
          {addedPermission && addedPermission[0] && addedPermission[4][1]?.length > 0 ? ((currntView == "Customers" ||
            view == "grid") && (
              <CustomersStatement
                availableBalance={availableBalance}
                OpenWalletListHander={OpenWalletListHander}
                walletTopup={walletTopup}
                collectionData={collectionData}
                averageRating={averageRating}
                newGeneratedCustomer={newGeneratedCustomer}
                walkincustomer={walkincustomer}
                lastinvoiceNo={lastcurrentInvoices}
                walletWithdraw={walletWithdraw}
                previousDue={previousDue}
                averageRatingData={averageRatingData}
                ViewInvoice={ViewInvoice}
                newcustomer={newcustomer}
                returncustomer={returncustomer}
                permission={permission}
                today={today}
                startDate={startDate}
                temEndDate={tempdate}
                currentType={currentType}
              />
            )) : null}
        </div>
        </>}
      </div>
    </>
  );
}
