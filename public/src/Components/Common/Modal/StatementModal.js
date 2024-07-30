import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import CalendarIcon from "../../../assets/svg/calendar_blue.svg";
import StatementIcon from "../../../assets/svg/statement.png";
import DueStatementIcon from "../../../assets/svg/Icon.png";
import SoldIcon from "../../../assets/svg/sold.png";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import moment from "moment";
import TotalSales from "./StatementChildModal/TotalSales";
import TotalCollection from "./StatementChildModal/TotalCollection";
import TotalAppointment from "./StatementChildModal/TotalAppointment";
import StaffAnalytics from "./StatementChildModal/StaffAnalytics";
import UserPlusIcon from "../../../assets/svg/user_plus.svg";
import SoldProductList from "./StatementChildModal/SoldProductList";
import GeneratedInvoiceList from "./StatementChildModal/GeneratedInvoiceList";
import ViewInvoiceModal from "./ViewInvoiceModal";
import Success from "../Toaster/Success/Success";
import DatePicker from "react-datepicker";
import CollepsIcon from "../../../assets/svg/colleps.png";
import WalletDetails from "./WalletDetails";
import StaffTransactionsTotal from "./StatementChildModal/StaffTransactionsTotal";
import SalesModal from "./statement/salesModal";
import AppointmentServices from "./statement/appointmentServices";
import StaffStatement from "./statement/staffStatement";
import StaffPerformance from "./statement/staffPerformance";
import CustomersStatement from "./statement/customersStatement";
import WhatsupDaily from "./statement/whatsupDaily";
import Loader from "../Loader/Loader";

export default function StatementModal(props) {
  const { SettingInfo } = props;
  const userInfo = Auth.getUserDetail();
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
  const [lastcurrentInvoices, setLastCurrentInvoices] = useState([]);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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
  const [availServiceDataList, setAvailServiceDatalist] = useState([]);
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

  const [lastsalesData, setLastSalesData] = useState({});
  const [lastsalesDat, setlastSalesDat] = useState({});
  const [lastsaleData, setlastSaleData] = useState({});
  const [lastcollectionData, setlastCollectionData] = useState({});

  let today = moment(startDate).format("dddd");

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
  };

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
        let response = _.groupBy(res.data.data?.serviceArray, "servicename");
        let item1 = Object.entries(response);
        setAvailServiceData(item1);
        setAvailServiceDatalist(res.data.data?.serviceArray);

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
        let removeManualMembership = filteredInvoiceList?.filter(
          (obj) => obj.isCustomerWithoutMembership === true
        );
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

  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
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
    let opeeningBal
    let openingBals
    let openingDR = {
      startTime: moment(startDate).format("L"),
      endTime: moment(temEndDate).format("L"),
      companyId: userInfo.companyId,
      type: "CR",
      typeValue: "opening-balance",
    };

    await ApiPost("expence/company/expenseDetails", openingDR)
      .then((res) => {
        opeeningBal=res.data.data.total
       openingBals = res.data.data.value;
       
      })
      .catch((err) => {
        console.log(err);
      });
      if (openingBals.length > 0) {
        let openingDR = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "DR",
          typeValue: "opening-balance",
        };
        await ApiPost("expence/company/expenseDetails", openingDR)
          .then((res) => {
            setOpeningBalanceDetail(opeeningBal - res.data.data.total);
          })
          .catch((err) => {
            console.log(err);
          });
      }

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
      getlastSale();
      getlastCollection();
      getLastInvoices();
    }
  }, [startDate, endDate]);

  const DailyWhatsUpModal = () => {
    setOpenDailyWhatsup(!opendailywhatsup);
  };

  return (
    <>
   
    <div>

      <div className="cus-modal">
        <div className="modal-header" style={{ padding: "26px 0" }}>
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment statement-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => props.toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Statement</h2>
                </div>
              </div>
              <div
                className="statement-modal-header"
                onClick={() => DailyWhatsUpModal()}
              >
                <button>
                  <span>Daily statement</span>
                </button>
              </div>
              <div className="new-statement-modal-desgin-alignment">
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
              </div>
            </div>
          </div>
        </div>
        {loading ? <Loader /> 
          :<>
        <div className="statment-modal-body">
          <div className="statment-container">
            <>
              <SalesModal
                salesData={salesData}
                SettingInfo={SettingInfo}
                invoiceNo={currentInvoices?.length}
                offerData={offerData}
                dueAmountTotal={dueAmountTotal}
                dueCount={dueCount}
                soldProductListToggle={soldProductListToggle}
                generatedInvoiceListToggle={generatedInvoiceListToggle}
                lastsalesData={lastsalesData}
                today={today}
                startDate={startDate}
                temEndDate={tempdate}
              />
            </>
            <>
              <AppointmentServices
                saleData={saleData}
                salesDat={salesDat}
                availService={availService}
                availServiceData={availServiceData}
                availServiceDataList={availServiceDataList}
                popularhours={popularhours}
                today={today}
                startDate={startDate}
                temEndDate={tempdate}
                lastsaleData={lastsaleData}
                lastsalesDat={lastsalesDat}
              />
            </>
            <>
              <StaffStatement
                collectionData={collectionData}
                colorList={colorList}
                SettingInfo={SettingInfo}
                openingBalanceDetail={openingBalanceDetail}
                closingBalanceDetail={closingBalanceDetail}
                startDate={startDate}
                temEndDate={tempdate}
                staffPay={staffPay}
                expense={expense}
                transfer={transfer}
                today={today}
                reccieve={reccieve}
                lastcollectionData={lastcollectionData}
              />
            </>
            <>
              <StaffPerformance
                staffTransactionsData={staffTransactionsData}
                colorList={colorList}
                SettingInfo={SettingInfo}
                staffPerformance={staffPerformance}
              />
            </>
            <>
              <CustomersStatement
                availableBalance={availableBalance}
                SettingInfo={SettingInfo}
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
                today={today}
                startDate={startDate}
                temEndDate={tempdate}
              />
            </>
          </div>
        </div>
        </>}
      </div>
      {soldProductListModal && (
        <SoldProductList
          modal={soldProductListModal}
          toggle={soldProductListToggle}
          currentInvoices={currentInvoices}
          ViewInvoice={ViewInvoice}
          SettingInfo={SettingInfo}
        />
      )}
      {generatedInvoiceListModal && (
        <GeneratedInvoiceList
          modal={generatedInvoiceListModal}
          toggle={generatedInvoiceListToggle}
          currentInvoices={currentInvoices}
          ViewInvoice={ViewInvoice}
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
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {openWalletList && (
        <WalletDetails
          toggle={OpenWalletListHander}
          SettingInfo={SettingInfo}
        />
      )}
      {opendailywhatsup && (
        <WhatsupDaily setOpenDailyWhatsup={setOpenDailyWhatsup} />
      )}
    </div>
    </>
  );
}
