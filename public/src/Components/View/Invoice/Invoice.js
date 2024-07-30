import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./Invoice.scss";
import DownIcon from "../../../assets/svg/drop-down.svg";
import SettingIcon from "../../../assets/svg/setting.svg";
import BellImage from "../../../assets/svg/bell.svg";
import ChildSidebar from "../Layout/ChildSidebar";
import MoreOption from "../../../assets/svg/more-option.svg";
import SearchIcon from "../../../assets/svg/search.svg";
import MoreIcon from "../../../assets/svg/more.png";
import SmsIcon from "../../../assets/svg/sms.svg";
import rupeesicon from "../../../assets/svg/rupees-icon.svg";
import EditIcon from "../../../assets/svg/edit.svg";
import FilterIcon from "../../../assets/svg/filter.svg";
import CloseTab from "../../../assets/svg/CloseTab-red.svg";
import DownloadIcon from "../../../assets/svg/download.svg";
import DeleteIcon from "../../../assets/svg/delete.svg";
import EditInvoiceModal from "../../Common/Modal/EditInvoiceModal";
import GenerateNewInvoice from "../../Common/Modal/GenerateNewInvoice";
import DuePaymentModal from "../../Common/Modal/DuePaymentModal";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Pagination from "../../Common/Pagination/Pagination";
import styles from "../../Common/Pagination/Pagination.scss";
import moment from "moment";
import Pdf from "react-to-pdf";
import Delete from "../../Common/Toaster/Delete";
import SendSMS from "../../Common/Modal/SendSMS";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import DatePicker from "react-datepicker";
import Popper from "popper.js";
import PropTypes from "prop-types";

import ReactToPrint from "react-to-print";
import Example from "./Example";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./Example";
import Success from "../../Common/Toaster/Success/Success";
import ViewInvoiceModal from "../../Common/Modal/ViewInvoiceModal";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import AWS from "aws-sdk";
import YellowMembership from "../../../assets/svg/Yellow-Membership.svg";
import SkyBlueMembership from "../../../assets/svg/SkyBlue-Membership.svg";
import OrangeMembership from "../../../assets/svg/Orange-Membership.svg";
import BlueMembership from "../../../assets/svg/BLue-Membership.svg";
import membershipProfileSmall from "../../../assets/svg/membership-profile-small.svg";
import { get_Setting } from "../../../utils/user.util";
import Auth from "../../../helpers/Auth";
import TimeIcon from "../../../assets/svg/time.svg";
import CustomerDuePaymentModal from "../../Common/Modal/CustomerDuePaymentModal";
import ViewAdditionalNotesModal from "../../Common/Modal/ViewAdditionalNotesModal";
import { motion } from "framer-motion/dist/framer-motion";

function amountToWords(amountInDigits) {
  // American Numbering System
  var th = ["", "Thousand", "Million", "Billion", "Trillion"];
  var dg = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  var tn = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  var tw = [
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  function toWords(s) {
    s = s?.toString();
    s = s?.replace(/[\, ]/g, "");
    if (s != parseFloat(s)) return "not a number";
    var x = s.indexOf(".");
    if (x == -1) x = s.length;
    if (x > 15) return "too big";
    var n = s.split("");
    var str = "";
    var sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == "1") {
          str += tn[Number(n[i + 1])] + " ";
          i++;
          sk = 1;
        } else if (n[i] != 0) {
          str += tw[n[i] - 2] + " ";
          sk = 1;
        }
      } else if (n[i] != 0) {
        str += dg[n[i]] + " ";
        if ((x - i) % 3 == 0) str += "Hundred ";
        sk = 1;
      }
      if ((x - i) % 3 == 1) {
        if (sk) str += th[(x - i - 1) / 3] + " ";
        sk = 0;
      }
    }
    if (x != s.length) {
      var y = s.length;
      str += "Point ";
      for (var i = x + 1; i < y; i++) str += dg[n[i]] + " ";
    }
    return str.replace(/\s+/g, " ");
  }

  return toWords(amountInDigits);
}

// const S3_BUCKET = "barbera-web";
// const REGION = "Asia Pacific (Mumbai) ap-south-1";
// AWS.config.update({
//   accessKeyId: "AKIA46FSGXXRIMYQVPPV",
//   secretAccessKey: "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"
// });
// const myBucket = new AWS.S3({
//   params: { Bucket: S3_BUCKET },
//   region: REGION
// });

//   const [progress, setProgress] = useState(0);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const handleFileInput = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };
//   const uploadFile = (file) => {
//     const params = {
//       ACL: "public-read",
//       Body: file,
//       Bucket: S3_BUCKET,
//       Key: file.name
//     };
//     myBucket
//       .putObject(params)
//       .on("httpUploadProgress", (evt) => {
//         setProgress(Math.round((evt.loaded / evt.total) * 100));
//       })
//       .send((err) => {
//         if (err) console.log(err);
//       });
//   };

class ComponentToPrints extends React.Component {
  constructor() {
    super();
    this.state = {
      SaloonDetail: null,
    };
  }
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    ApiGet("account/company/companyData/" + userInfo.companyId)
      .then((resp) => {
        this.setState({ SaloonDetail: resp?.data?.data[0] });
      })
      .catch((er) => {
        // alert(er);
      });
  }

  render() {
    let SettingInfo = get_Setting();

    return (
      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <table align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div className="invoice-title">
                      <h5>Invoice </h5>
                    </div>
                    <div className="parlour-details" align="right">
                      <h4>{this.state.SaloonDetail?.businessName}</h4>
                      <p>{this.state.SaloonDetail?.address}</p>
                      <p>{this.state.SaloonDetail?.city}</p>
                      <p>{this.state.SaloonDetail?.mobileNumber}</p>
                    </div>
                  </td>
                </tr>
                <tr className="bottom-border">
                  <td>
                    <div className="align-items">
                      <div className="left-side">
                        <p>Bill To</p>
                        <p>
                          {this.props.data?.customer?.firstName}{" "}
                          {this.props.data?.customer?.lastName
                            ? this.props.data?.customer?.lastName
                            : ""}
                        </p>
                        <p>{this.props.data?.customer?.mobileNumber}</p>
                      </div>
                      <div className="right-side" align="right">
                        <p className="first-child-align">
                          <span> Invoice No.</span>
                          {"  "} #{this.props.data?.invoiceId} &nbsp;
                        </p>
                        <p>
                          <span> Invoice Date.</span>
                          {moment(this.props.data?.created).format(
                            "DD/MM/yyyy"
                          )}
                        </p>
                        <p>
                          <span> Invoice Time.</span>
                          {moment(this.props.data?.created).format("LTS")}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                {this.props.data?.serviceDetails?.length > 0 ? (
                  <>
                    <tr>
                      <td>
                        <p className="service-text">Services</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-space-remove">
                        <table className="new-table-design">
                          <thead>
                            <tr>
                              <th align="center" width="8%">
                                #
                              </th>
                              <th align="center" width="30%">
                                Service Name
                              </th>
                              <th align="center" width="11.5%">
                                Price
                              </th>
                              <th align="center" width="11.5%">
                                Discount ({SettingInfo?.currentType})
                              </th>
                              <th align="center" width="11.5%">
                                Sell Price
                              </th>
                              <th align="center" width="8%">
                                GST(%)
                              </th>
                              <th align="center" width="11.5%">
                                Net Price
                              </th>
                            </tr>
                          </thead>

                          {this.props.data?.serviceDetails.map((item, i) => {
                            return (
                              <>
                                <tr key={item._id}>
                                  <td align="center">{i + 1}</td>
                                  <td>{item.servicename}</td>
                                  <td align="center">{item.servicerate}</td>
                                  <td align="center">
                                    {item?.servicediscount?.toFixed(2)}
                                  </td>
                                  <td align="center">
                                    {item?.serviceflatdiscountedprice?.toFixed(
                                      2
                                    )}
                                  </td>
                                  <td align="center">{item?.servicegst}</td>
                                  <td align="center">
                                    {item.servicesubtotal?.toFixed(2)}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </table>
                      </td>
                    </tr>
                  </>
                ) : null}

                {this.props.data?.products?.length > 0 ? (
                  <>
                    <tr>
                      <td>
                        <p className="service-text">Products</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-space-remove">
                        <table className="new-table-design">
                          <thead>
                            <tr>
                              <th align="center" width="8%">
                                #
                              </th>
                              <th align="center" width="23%">
                                Products Name
                              </th>
                              <th align="center" width="7%">
                                Qty
                              </th>
                              <th align="center" width="7%">
                                Unit Price
                              </th>
                              <th align="center" width="11%">
                                Total Price
                              </th>
                              <th align="center" width="11%">
                                Discount ({SettingInfo?.currentType})
                              </th>
                              <th align="center" width="11%">
                                Sell Price
                              </th>
                              <th align="center" width="7%">
                                GST(%)
                              </th>
                              <th align="center" width="11%">
                                Nett Price
                              </th>
                            </tr>
                          </thead>
                          {this.props.data?.products.map((item, i) => {
                            return (
                              <>
                                <tr key={item._id}>
                                  <td align="center">{i + 1}</td>
                                  <td>{item.productName}</td>
                                  <td align="center">{item.productCount}</td>
                                  <td align="center">{item.productPrice}</td>
                                  <td align="center">{item.productSubTotal}</td>
                                  <td align="center">
                                    {item.productDiscount?.toFixed(2)}
                                  </td>
                                  <td align="center">
                                    {item.flatdiscountedSubTotal?.toFixed(2)}
                                  </td>
                                  <td align="center">{item.productgst}</td>
                                  <td align="center">
                                    {item.discountedPriceWithGstAmount?.toFixed(
                                      2
                                    )}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </table>
                      </td>
                    </tr>
                  </>
                ) : null}

                <tr>
                  <td>
                    <div className="final-bill">
                      <div>
                        <div className="alignment-text">
                          <div className="first-child">
                            <span>Gross Total </span>
                          </div>
                          <div className="sec-child" align="right">
                            <span> {this.props.data?.grossTotal}</span>
                          </div>
                        </div>
                        <div className="alignment-text">
                          <div className="first-child">
                            <span>Discount ({SettingInfo?.currentType}) </span>
                          </div>
                          <div className="sec-child" align="right">
                            <span>{this.props.data?.totalDiscount}</span>
                          </div>
                        </div>
                        <div className="alignment-text">
                          <div className="first-child">
                            <span>Discounted Price</span>
                          </div>
                          <div className="sec-child" align="right">
                            <span>{this.props.data?.discountedPrice}</span>
                          </div>
                        </div>
                        {this.state.gstCharge ? (
                          <div className="alignment-text">
                            <div className="first-child">
                              <span>GST ({SettingInfo?.currentType}) </span>
                            </div>
                            <div className="sec-child" align="right">
                              <span>
                                {this.props.data?.GST?.gstAmount?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : null}
                        <div className="alignment-text">
                          <div className="first-child">
                            <span
                              style={{ fontWeight: "600", fontSize: "13px" }}
                            >
                              Net Total Price
                            </span>
                          </div>
                          <div className="sec-child" align="right">
                            <span
                              style={{ fontWeight: "600", fontSize: "13px" }}
                            >
                              {this.props.data?.totalAmount}{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="thanks-message">
                      <p>
                        Amount in words:{" "}
                        {amountToWords(
                          Math.round(this.props.data?.totalAmount)
                        )}{" "}
                        Rupees Only
                      </p>
                      <span>Paid by {this.props.data?.paymentMethod}</span>
                      <span> Thanks for your visit </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="terms">
                      <p>Terms and Conditions</p>
                      <ul>
                        <li>Material once sold will not be returned.</li>
                        <li>
                          All disputes are subjected to local jurisdiction.
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </motion.div>
    );
  }
}

export default function Invoice() {
  const wrapperRefs = useRef();
  const wrapperRef = useRef(null);
  const ref = React.createRef();
  const [childSidebar, setChildSidebar] = useState(false);
  const ref2 = React.createRef();
  const [invoiceMenu, SetInvoiceMenu] = useState(true);
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const userAuthInfo = Auth.getUserDetail();
  const permission = userAuthInfo.permission;
  const [allInvoiceData, setAllInvoiceData] = useState();
  const [invoice, setInvoice] = useState();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [duePayment, setDuePayment] = useState(false);
  const [editInvoice, setEditInvoice] = useState(false);
  const [deleteinvoice, setDeleteInvoice] = useState(false);
  const [moreOptionMenu, setMoreOptionMenu] = useState(false);
  const [more, setMore] = useState();
  const [openInvoice, setOpenInvoice] = useState(true);
  const [allCompanyInvoiceData, setCompanyAllInvoiceData] = useState([]);
  const [deleteInvoiceData, setDeleteInvoiceData] = useState();
  const [sendSMS, setSendSMS] = useState();
  const [sendSMSData, setSendSMSData] = useState();
  const [openDuePaymentModal, setOpenDuePaymentModal] = useState(false);
  const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
  const [openGenerateNewModal, setOpenGenerateNewModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [er, setEr] = useState();
  const [gstOn, setGstOn] = useState(false);
  const pdfExportComponent = useRef(null);
  const [showFilter, setShowfilter] = useState(false);
  let SettingInfo = get_Setting();
  const [pastInvoice, setPastInvoice] = useState(false);
  const [pdf, setPdf] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [duePaymentDetail, setDuePaymentDetail] = useState([]);
  const [walletHistory, setWalletHistory] = useState();
  const [viewAdditionalNotes, setViewAdditionalNotes] = useState(false);

  const additionalNotesModalToggle = () => {
    setViewAdditionalNotes(!viewAdditionalNotes);
  };
  const [statusFilter, setStatusFilter] = useState([]);
  const paidfilter = statusFilter?.includes("paid");
  const partpaidfilter = statusFilter?.includes("partpaid");
  const unpaidfilter = statusFilter?.includes("unpaid");
  const deletedfilter = statusFilter?.includes("deleted");

  const curencySymbol = SettingInfo?.currentType;
  let dueRecord = invoice?.dueAmountRecord;
  let balanceRecord = invoice?.balanceAmountRecord;
  useEffect(() => {
    setPage(1);
  }, [allInvoiceData]);
  const ClickPdf = useReactToPrint({
    content: () => wrapperRefs.current,
  });

  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();

    // const params = {
    //   ACL: "public-read",
    //   Body:  pdfExportComponent.current,
    //   Bucket: S3_BUCKET,
    //   Key: file.name
    // };
    // myBucket
    //   .putObject(params)
    //   .on("httpUploadProgress", (evt) => {
    //     setProgress(Math.round((evt.loaded / evt.total) * 100));
    //   })
    //   .send((err) => {
    //     if (err) console.log(err);
    //   });
  };
  const postsPerPage = 15;
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    allInvoiceData &&
    allInvoiceData.slice(0).reverse()?.slice(indexOfFirstPost, indexOfLastPost);
  const length = allInvoiceData && allInvoiceData.length;
  const DiscountedPrice = invoice?.subTotal - invoice?.discount?.discount;

  const deleteInvoiceEntry = (e, data) => {
    SetInvoiceMenu(!invoiceMenu);
    setDeleteInvoiceData(data);
    OpenDeleteInvoiceModaltoggle();
  };
  const OpenDeleteInvoiceModaltoggle = (data) => {
    setDeleteInvoice(!deleteinvoice);
    if (deleteinvoice === true) {
      setOpenInvoice(true);
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Invoice deleted!");
          if (invoice?.balanceAmountRecord) {
            let walletData = {
              companyId: SettingInfo?.companyId,
              user_id: invoice?.customer?._id,
              type: "DR",
              method: [],
              description: "Deleted invoice",
              walletAmount: invoice?.balanceAmountRecord,
              topup: true,
            };

            ApiPost("wallet", walletData)
              .then((resp) => {
                if (resp.data.status === 200) {
                }
              })
              .catch((er) => {
                console.log(er);
              });
          }

          if (invoice?.dueAmountRecord && invoice?.dueStatus !== "Paid") {
            let walletData = {
              companyId: SettingInfo?.companyId,
              user_id: invoice?.customer?._id,
              type: "CR",
              method: [],
              description: "Deleted invoice",
              walletAmount: invoice?.dueAmount,
              topup: true,
            };

            ApiPost("wallet", walletData)
              .then((resp) => {
                if (resp.data.status === 200) {
                }
              })
              .catch((er) => {
                console.log(er);
              });
          }

          if (invoice?.splitPayment[0]?.method === "Wallet") {
            let walletData = {
              companyId: SettingInfo?.companyId,
              user_id: invoice?.customer?._id,
              type: "CR",
              method: [],
              description: "Deleted invoice",
              walletAmount: invoice?.splitPayment[0]?.amount,
              topup: true,
            };

            ApiPost("wallet", walletData)
              .then((resp) => {
                if (resp.data.status === 200) {
                }
              })
              .catch((er) => {
                console.log(er);
              });
          }
          ApiGet("customer/company/" + userInfo.companyId)
            .then((resp) => {
              let cusData = resp.data.data.filter(
                (cus) => cus._id === invoice.customerData._id
              );

              let OnlymembershipService =
                invoice?.membershipDetails[0]?.selectedServices
                  ?.map((serv) => {
                    return invoice?.serviceDetails?.filter(
                      (ser) => ser?.serviceId === serv?._id
                    );
                  })
                  .flat();

              let OnlyCustomermembershipService =
                cusData[0]?.selectMembership[0]?.selectedServices
                  ?.map((serv) => {
                    return invoice?.serviceDetails?.filter(
                      (ser) => ser?.serviceId === serv?._id
                    );
                  })
                  .flat();

              if (
                cusData?.selectMembership?.length !== 0 ||
                OnlymembershipService > 0 ||
                OnlyCustomermembershipService > 0
              ) {
                if (OnlymembershipService?.length > 0) {
                  let service = cusData[0]?.selectMembership?.map(
                    (obj, index) => {
                      if (index === cusData[0]?.selectMembership?.length - 1) {
                        if (
                          obj?.availService === OnlymembershipService?.length
                        ) {
                          return {
                            ...obj,
                            isExpire: false,
                            remainingService: obj?.availService,
                          };
                        } else {
                          return {
                            ...obj,
                            remainingService:
                              obj?.remainingService +
                              OnlymembershipService?.length,
                          };
                        }
                      } else {
                        return obj;
                      }
                    }
                  );

                  const value = {
                    selectMembership: service,
                    membership: true,
                  };

                  ApiPut("customer/" + cusData[0]._id, value)
                    .then((resp) => {
                  
                    })
                    .catch((er) => {
                      console.log("error");
                    });
                }
              }

              if (OnlyCustomermembershipService?.length > 0) {
                let servicedd = cusData[0]?.selectMembership?.map(
                  (obj, index) => {
                    if (index === cusData[0]?.selectMembership?.length - 1) {
                      if (
                        obj?.availService ===
                        OnlyCustomermembershipService?.length
                      ) {
                        return {
                          ...obj,
                          isExpire: false,
                          remainingService: obj?.availService,
                        };
                      } else {
                        return {
                          ...obj,
                          remainingService:
                            obj?.remainingService +
                            OnlyCustomermembershipService?.length,
                        };
                      }
                    } else {
                      return obj;
                    }
                  }
                );

                const value = {
                  selectMembership: servicedd,
                  membership: true,
                };

                ApiPut("customer/" + cusData[0]._id, value)
                  .then((resp) => {
                 
                  })
                  .catch((er) => {
                    console.log("error");
                  });
              }
            })
            .catch((er) => {
              // alert(er);
            });
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const ClickSendSMS = (e, data) => {
    setSendSMSData(data);
    SetInvoiceMenu(!invoiceMenu);
    OpenSendSMSModaltoggle();
  };
  const OpenSendSMSModaltoggle = (data) => {
    setSendSMS(!sendSMS);
    if (sendSMS === true) {
      if (data === 200) {
        setSuccess(true);
        setToastmsg("SMS sent successfully!");
      }
    }
  };

  const OpenPdfModaltoggle = () => {
    setPdf(!pdf);
    if (pdf === true) {
    }
  };

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

  const duePaymentModal = (e, data) => {
    getWalletTransction(data?.customer);
    ApiGet(`invoice/partPayment/customer/${data?.customer?._id}`)
      .then((resp) => {
        setDuePaymentDetail(resp?.data?.data);
      })
      .catch((er) => {
        console.log(er);
      });
    setDuePayment([data]);
    // SetInvoiceMenu(!invoiceMenu);
    OpenDuePaymentModaltoggle();
  };
  const OpenDuePaymentModaltoggle = (data) => {
    setOpenDuePaymentModal(!openDuePaymentModal);
    GetInvoices();
    if (openDuePaymentModal === true) {
      if (data) {
        if (data === true) {
          setSuccess(true);
          setToastmsg("Due cleared!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const editInvoiceModal = (e, data) => {

    setEditInvoice(data);
    SetInvoiceMenu(!invoiceMenu);
    OpenEditInvoiceModaltoggle();
  };
  const OpenEditInvoiceModaltoggle = (data) => {
    setOpenEditInvoiceModal(!openEditInvoiceModal);
    GetInvoices();
    if (openEditInvoiceModal === true) {
      if (data) {
        if (data?.data?.status === 200) {
          setSuccess(true);
          setToastmsg("Changes saved!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };
  const ClickGenerateModal = (data) => {
    SetInvoiceMenu(true);
    OpenGenerateNewtoggle();
    if (data) {
      setPastInvoice(true);
    }
  };
  const OpenGenerateNewtoggle = (data) => {
    setPastInvoice(false);
    setOpenGenerateNewModal(!openGenerateNewModal);
    GetInvoices();
    if (openGenerateNewModal === true) {
      if (data) {
        if (data?.data?.status === 200) {
          setSuccess(true);
          setToastmsg("Invoices generated!");
        } else {
          // setSuccess(true);
          // setEr("Error");
          // setToastmsg("Something went wrong");
        }
      }
    }
  };

  //Outside Click Events
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  // const wrapperRef = useRef(null);
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "top",
    });
    setMoreOptionMenu(!moreOptionMenu);
    setMore();
  };
  const closeDropdownPopover = () => {
    setMoreOptionMenu(!moreOptionMenu);
    setMore();
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setMoreOptionMenu(!moreOptionMenu);
          setMore();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(wrapperRef);
  Invoice.propTypes = {
    children: PropTypes.element.isRequired,
  };

  //Outside Click Events
  const btnDropdownRef1 = React.createRef();
  const popoverDropdownRef1 = React.createRef();
  const wrapperRef1 = useRef(null);
  const openDropdownPopover1 = () => {
    new Popper(btnDropdownRef1.current, popoverDropdownRef1.current, {
      placement: "top",
    });
    SetInvoiceMenu(invoiceMenu);
  };
  const closeDropdownPopover1 = () => {
    SetInvoiceMenu(true);
  };

  function useOutsideAlerter1(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          SetInvoiceMenu(invoiceMenu);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter1(wrapperRef1);
  Invoice.propTypes = {
    children: PropTypes.element.isRequired,
  };

  //Outside Click Events
  const btnDropdownRef2 = React.createRef();
  const popoverDropdownRef2 = React.createRef();
  const wrapperRef2 = useRef(null);
  const openDropdownPopover2 = () => {
    new Popper(btnDropdownRef2.current, popoverDropdownRef2.current, {
      placement: "top",
    });
    SetInvoiceMenu(invoiceMenu);
  };
  const closeDropdownPopover2 = () => {
    SetInvoiceMenu(true);
  };

  function useOutsideAlerter1(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          SetInvoiceMenu(invoiceMenu);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter1(wrapperRef2);
  Invoice.propTypes = {
    children: PropTypes.element.isRequired,
  };

  const GetInvoice = (e, data) => {
    setOpenInvoice(false);
    SetInvoiceMenu(true);
    setInvoice(data);
  };
  const getAllInvoice = async (e) => {
    try {
      setLoading(true);
      let res = await ApiGet("invoice/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setCompanyAllInvoiceData(res.data.data);
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Categories", err);
    }
  };

  const GetInvoices = () => {
    ApiGet("invoice/company/" + userInfo.companyId).then((resp) => {
      setAllInvoiceData(
        resp?.data?.data?.filter(
          (obj) => obj?.isCustomerWithoutMembership === true
        )
      );
      setTotalPages(
        Math.ceil(
          resp?.data?.data?.filter(
            (obj) => obj?.isCustomerWithoutMembership === true
          )?.length / 15
        )
      );
      setInvoice(resp?.data?.data[resp?.data?.data?.length - 1]);
    });
  };

  useEffect(() => {
    GetInvoices();
  }, []);

  useEffect(() => {
    getAllInvoice();
    getStoreSetting();
  }, []);

  const getStoreSetting = async (values) => {
    const SettingData = get_Setting();
    setGstOn(SettingData?.tax?.gstCharge);

    // try {
    //   let res = await ApiGet("setting/company/" + userInfo.companyId);
    //   if (res.data.status === 200) {
    //     setGstOn(res?.data?.data[0]?.tax.gstCharge);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleInvoicesSearch = async (e) => {
    setSearchKeyword(e.target.value);
    var invoiceData =
      allCompanyInvoiceData?.length > 0 &&
      allCompanyInvoiceData?.filter(
        (obj) =>
          (obj.customer &&
            obj.customer.firstName &&
            obj.customer.firstName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.customer &&
            obj.customer.lastName &&
            obj.customer.lastName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.customer &&
            obj.customer.mobileNumber &&
            obj.customer.mobileNumber
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.invoiceId &&
            obj.invoiceId
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.totalAmount &&
            obj.totalAmount
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.created &&
            obj.created.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    if (e.target.value === "") {
      ApiGet("invoice/company/" + userInfo.companyId).then((resp) => {
        setAllInvoiceData(resp.data.data);
      });
    } else {
      setAllInvoiceData(invoiceData);
    }
  };

  const SelectDate = (e) => {
    setSelectedDate(moment(e.target.value).format("yyyy-MM-DD"));
    let Body = {
      starttime: moment(e.target.value).format("yyyy-MM-DD"),
      companyId: userInfo.companyId,
    };
    if (e.target.value === null || undefined || "") {
      ApiGet("invoice/company/" + userInfo.companyId).then((resp) => {
        setAllInvoiceData(resp.data.data);
      });
      setSubMenuopen(false);
    } else {
      ApiPost("invoice/company/search", Body).then((resp) => {
        setAllInvoiceData(resp.data.data);
      });
    }
  };

  const OpenDropDown = () => {
    setSubMenuopen(!subMenuOpen);
  };

  const moreOpetionSelect = (e, data) => {
    setMore(data);
    setMoreOptionMenu(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });



  const S3_BUCKET = "barbera-web";
  const REGION = "ap-south-1";
  AWS.config.update({
    accessKeyId: "AKIA46FSGXXRIMYQVPPV",
    secretAccessKey: "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",
  });
  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const uploadFile = (file) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };
    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  const InvoiceStatusFilter = (e, key) => {
    let filter;
    if (statusFilter?.includes(key)) {
      let index = statusFilter.indexOf(key);
      statusFilter.splice(index, 1);
      setStatusFilter([...statusFilter]);
    } else {
      statusFilter?.push(key);
      setStatusFilter([...statusFilter]);
    }
    if (statusFilter) {
      filter = allCompanyInvoiceData?.filter(
        (fil) =>
          (statusFilter?.includes("deleted") && fil?.isActive === false) ||
          (fil?.isActive === true &&
            ((statusFilter?.includes("unpaid") &&
              fil?.dueStatus === "Unpaid") ||
              (statusFilter?.includes("partpaid") &&
                fil?.dueStatus === "Part paid") ||
              (statusFilter?.includes("paid") && fil?.dueStatus === "Paid") ||
              (statusFilter?.includes("paid") && !fil?.dueStatus)))
      );
      setAllInvoiceData(filter);
    }
    if (statusFilter?.length === 4 || statusFilter?.includes("clear")) {
      filter = allCompanyInvoiceData;
      setAllInvoiceData(filter);
      setShowfilter(!showFilter);
      setStatusFilter([]);
    }
    if (statusFilter?.length === 0) {
      filter = allCompanyInvoiceData;
      setAllInvoiceData(filter);
      setStatusFilter([]);
    }
    setTotalPages(Math.ceil(filter?.length / 15));
    if (filter?.length > 0) {
      setInvoice(filter[filter?.length - 1]);
    }
  };

  return (
    <>
      {childSidebar && <ChildSidebar modal={childSidebar} />}
      <div className="w-full full-page-banner">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="content"
          id="main-contain"
        >
          <div className="container-fluid container-left-right-space">
            <div className="common-header-style flex items-center justify-between top-align-new">
              <div className="header-title">
                <i
                  class="fas fa-bars"
                  onClick={() => setChildSidebar(!childSidebar)}
                ></i>
                <h2>Invoices</h2>
              </div>

              {/* <div className="invoice-title-text">
              <h2>Invoices</h2>
            </div> */}
              <div className="header-notification">
                {/* <div className="icon-design">
                <div className="relative">
                  <img src={BellImage} alt="BellImage" />
                </div>
                <div className="bell-icon-design"></div>
              </div> */}
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
              </div>
            </div>

            <div className="main-searchbar-style">
              <div className="input-search">
                <input
                  type="text"
                  placeholder="Search invoice number or customer name"
                  onChange={(e) => handleInvoicesSearch(e)}
                  autoFocus
                />
                <div className="search-icon-align">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* <div
                  onClick={() => (showFilter ? "" : setShowfilter(!showFilter))}
                  className={
                    showFilter ? "sub-button-style-filter" : "sub-button-filter"
                  }
                >
                  <img
                    src={FilterIcon}
                    alt="FilterIcon"
                    className={showFilter ? "margin-filter-pic" : ""}
                  />
                  <span>Filters</span>

                  {showFilter ? (
                    <div style={{ display: "flex" }}>
                      <div
                        className={
                          paidfilter
                            ? "filter-data-btns-paid-active"
                            : "filter-data-btns-paid"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "paid")}
                      >
                        <button>Paid</button>
                      </div>
                      <div
                        className={
                          partpaidfilter
                            ? "filter-btn-clicked-active"
                            : "filter-btn-clicked"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "partpaid")}
                      >
                        <button>Part paid</button>
                      </div>
                      <div
                        className={
                          unpaidfilter
                            ? "filter-btn-clicked-active"
                            : "filter-btn-clicked"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "unpaid")}
                      >
                        <button>Unpaid</button>
                      </div>
                      <div
                        className={
                          deletedfilter
                            ? "filter-data-btns-deleted-active"
                            : "filter-data-btns-deleted"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "deleted")}
                      >
                        <button>Deleted</button>
                      </div>
                      <div
                        style={{ marginLeft: "15px", marginTop: "2px" }}
                        onClick={(e) => InvoiceStatusFilter(e, "clear")}
                      >
                        <img src={CloseTab} alt="CloseTab-red" />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div> */}
                <div
                  className={
                    showFilter
                      ? "sub-button-style-filter cus-invoice-icon-design"
                      : "cus-invoice-icon-design"
                  }
                  onClick={() => (showFilter ? "" : setShowfilter(!showFilter))}
                >
                  <div className="iconic-tab">
                    <div className="iconic-icon">
                      <img src={FilterIcon} alt="FilterIcon" />
                    </div>
                    <div className="iconic-icon-hover">
                      <img src={FilterIcon} alt="FilterIcon" />
                    </div>
                    <p className="iconic-title">Filters</p>
                  </div>
                  {showFilter ? (
                    <div style={{ display: "flex", marginLeft: "40px" }}>
                      <div
                        className={
                          paidfilter
                            ? "filter-data-btns-paid-active"
                            : "filter-data-btns-paid"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "paid")}
                      >
                        <button>Paid</button>
                      </div>
                      <div
                        className={
                          partpaidfilter
                            ? "filter-btn-clicked-active"
                            : "filter-btn-clicked"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "partpaid")}
                      >
                        <button>Part paid</button>
                      </div>
                      <div
                        className={
                          unpaidfilter
                            ? "filter-btn-clicked-active"
                            : "filter-btn-clicked"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "unpaid")}
                      >
                        <button>Unpaid</button>
                      </div>
                      <div
                        className={
                          deletedfilter
                            ? "filter-data-btns-deleted-active"
                            : "filter-data-btns-deleted"
                        }
                        onClick={(e) => InvoiceStatusFilter(e, "deleted")}
                      >
                        <button>Deleted</button>
                      </div>
                      <div
                        style={{ marginLeft: "15px", marginTop: "2px" }}
                        onClick={(e) => InvoiceStatusFilter(e, "clear")}
                      >
                        <img src={CloseTab} alt="CloseTab-red" />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {permission?.filter(
                  (obj) => obj.name === "Create past invoices"
                )[0]?.isChecked === false ? null : (
                  <>
                    {/* <div
                      className={"sub-button-filter"}
                      onClick={() => ClickGenerateModal("PastInvoice")}
                    >
                      <img
                        src={TimeIcon}
                        alt="TimeIcon"
                        className={showFilter ? "margin-filter-pic" : ""}
                      />
                      <span>Past invoice</span>
                    </div> */}
                    <div
                      className="cus-invoice-icon-last-design"
                      onClick={() => ClickGenerateModal("PastInvoice")}
                    >
                      <div className="iconic-tab">
                        <div className="iconic-icon">
                          <img src={TimeIcon} alt="TimeIcon" />
                        </div>
                        <div className="iconic-icon-hover">
                          <img src={TimeIcon} alt="TimeIcon" />
                        </div>
                        <p className="iconic-title">Past invoice</p>
                      </div>
                    </div>
                  </>
                )}

                {permission?.filter(
                  (obj) => obj.name === "Generate new invoice/Checkout"
                )[0]?.isChecked === false ? null : (
                  <div>
                    <button onClick={() => ClickGenerateModal()}>
                      Generate New
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* invoice grid */}
            <div className="invoice-section-align">
              <div className="invoice-grid">
                <div className="invoice-grid-items">
                  <div className="invoice-table-height">
                    <div className="invoice-child-box invoice-child-box-space-align">
                      <div className="invoice-table-design">
                        {currentPosts?.length > 0 ? (
                          <table className="invoice-table-data">
                            <tr>
                              <th>
                                <span>Invoice #</span>
                              </th>
                              <th>
                                <span>Customer name</span>
                              </th>
                              <th align="center">
                                <span style={{ textAlign: "center" }}>
                                  Contact number
                                </span>
                              </th>
                              <th className="date-picker-style">
                                <span>Date</span>
                                <img
                                  src={DropDownIcon}
                                  alt="DropDownIcon"
                                  onClick={() => OpenDropDown()}
                                />
                              </th>
                              {subMenuOpen ? (
                                <DatePickerComponent
                                  id="datepicker"
                                  onChange={(e) => SelectDate(e)}
                                  format="d/MM/yyyy"
                                ></DatePickerComponent>
                              ) : null}
                              <th>
                                <span style={{ textAlign: "center" }}>
                                  Amount
                                </span>
                              </th>
                              <th>
                                <span style={{ textAlign: "left" }}>
                                  Status
                                </span>
                              </th>
                              <th> </th>
                            </tr>

                            {currentPosts?.map((inv, i) => {
                              return (
                                inv?.isCustomerWithoutMembership === true && (
                                  <tr
                                    key={inv._id}
                                    onClick={(e) => GetInvoice(e, inv)}
                                    className="more-option-show-invoice"
                                  >
                                    <td>
                                      <span>{inv?.invoiceId}</span>
                                    </td>
                                    <td>
                                      {inv.customer ? (
                                        <span>
                                          {inv?.customer?.firstName} {"  "}{" "}
                                          {inv?.customer?.lastName}
                                        </span>
                                      ) : (
                                        <span>Walk-in Customer</span>
                                      )}
                                    </td>
                                    <td>
                                      {inv.customer ? (
                                        <span style={{ textAlign: "center" }}>
                                          {inv?.customer?.mobileNumber}{" "}
                                        </span>
                                      ) : (
                                        <span style={{ textAlign: "center" }}>
                                          {" "}
                                          -{" "}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <span>
                                        {moment(inv.created).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </span>
                                    </td>
                                    <td>
                                      <span style={{ textAlign: "center" }}>
                                        {"  "}
                                        <a>{SettingInfo?.currentType}</a>{" "}
                                        {Math.round(inv.totalAmount)}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="invoice-Balance-status-btn">
                                        {!inv?.isActive ? (
                                          <button className="button-text-color-red">
                                            Deleted
                                          </button>
                                        ) : inv?.dueStatus === "Unpaid" ? (
                                          <button className="button-text-color-orange">
                                            Unpaid
                                          </button>
                                        ) : inv?.dueStatus === "Part paid" ? (
                                          <button className="button-text-color-orange">
                                            Part paid
                                          </button>
                                        ) : (
                                          <button className="button-text-color-blue">
                                            Paid
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                    <td className="invoice-more-option-relative">
                                      {inv?.isActive && (
                                        <div
                                          className="relative"
                                          style={{ zIndex: "1" }}
                                          ref={wrapperRef}
                                        >
                                          <div
                                            className={
                                              more === i
                                                ? moreOptionMenu
                                                  ? "more-option-invoice more-menu-sec-show"
                                                  : "more-option-invoice "
                                                : "more-option-invoice "
                                            }
                                          >
                                            <div
                                              className="more-option-cus-menu"
                                              onClick={(e) =>
                                                moreOpetionSelect(e, i)
                                              }
                                              ref={btnDropdownRef}
                                            >
                                              <svg
                                                width="23"
                                                height="5"
                                                viewBox="0 0 23 5"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="11.5"
                                                  cy="2.5"
                                                  r="2.5"
                                                  fill="#97A7C3"
                                                />
                                                <circle
                                                  cx="2.5"
                                                  cy="2.5"
                                                  r="2.5"
                                                  fill="#97A7C3"
                                                />
                                                <circle
                                                  cx="20.5"
                                                  cy="2.5"
                                                  r="2.5"
                                                  fill="#97A7C3"
                                                />
                                              </svg>
                                            </div>

                                            <div
                                              ref={popoverDropdownRef}
                                              className={
                                                more === i
                                                  ? moreOptionMenu
                                                    ? "more-option-sub-menu more-option-sub-menu-show "
                                                    : "more-option-sub-menu more-option-sub-menu-hidden"
                                                  : "more-option-sub-menu more-option-sub-menu-hidden"
                                              }
                                            >
                                              {invoice?.dueStatus &&
                                                invoice?.dueStatus !==
                                                  "Paid" && (
                                                  <div
                                                    className="table-more-menu-align"
                                                    onClick={(e) =>
                                                      duePaymentModal(
                                                        e,
                                                        invoice
                                                      )
                                                    }
                                                  >
                                                    <img
                                                      src={rupeesicon}
                                                      alt="EditIcon"
                                                      style={{
                                                        width: "13px",
                                                        height: "13px",
                                                      }}
                                                    />
                                                    <span className="blue-pri">
                                                      Clear due
                                                    </span>
                                                  </div>
                                                )}
                                              {permission?.filter(
                                                (obj) =>
                                                  obj.name ===
                                                  "Allow send SMS to customer"
                                              )[0]?.isChecked ===
                                              false ? null : inv.customer ? (
                                                <div
                                                  className="table-more-menu-align"
                                                  onClick={(e) =>
                                                    ClickSendSMS(e, invoice)
                                                  }
                                                >
                                                  <img
                                                    src={SmsIcon}
                                                    alt="SmsIcon"
                                                  />
                                                  <span className="blue-pri">
                                                    Send SMS{" "}
                                                  </span>
                                                </div>
                                              ) : null}
                                              {permission?.filter(
                                                (obj) =>
                                                  obj.name ===
                                                  "Edit/delete invoice"
                                              )[0]?.isChecked ===
                                              false ? null : (
                                                // inv?.balanceAmountRecord || inv?.dueAmountRecord || inv?.splitPayment[0]?.method === "Wallet" ? null :
                                                <div
                                                  className="table-more-menu-align"
                                                  onClick={(e) =>
                                                    editInvoiceModal(e, invoice)
                                                  }
                                                >
                                                  <img
                                                    src={EditIcon}
                                                    alt="EditIcon"
                                                  />
                                                  <span className="blue-pri">
                                                    Edit Invoice
                                                  </span>
                                                </div>
                                              )}

                                              <div
                                                className="table-more-menu-align"
                                                onClick={() => ClickPdf()}
                                              >
                                                <img
                                                  src={DownloadIcon}
                                                  alt="DownloadIcon"
                                                />
                                                <span className="blue-pri">
                                                  Download
                                                </span>
                                              </div>
                                              <div style={{ display: "none" }}>
                                                <ComponentToPrint
                                                  data={invoice}
                                                  ref={wrapperRefs}
                                                />
                                              </div>
                                              {permission?.filter(
                                                (obj) =>
                                                  obj.name ===
                                                  "Edit/delete invoice"
                                              )[0]?.isChecked ===
                                              false ? null : (
                                                <div
                                                  className="table-more-menu-align"
                                                  onClick={(e) =>
                                                    deleteInvoiceEntry(
                                                      e,
                                                      invoice
                                                    )
                                                  }
                                                >
                                                  <img
                                                    src={DeleteIcon}
                                                    alt="DeleteIcon"
                                                  />
                                                  <span
                                                    style={{ color: "#E66666" }}
                                                  >
                                                    Delete
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                )
                              );
                            })}
                          </table>
                        ) : (
                          <>
                            <table className="invoice-table-data">
                              <tr>
                                <th>
                                  <span>Invoice #</span>
                                </th>
                                <th>
                                  <span>Customer name</span>
                                </th>
                                <th>
                                  <span>Contact number</span>
                                </th>
                                <th className="date-picker-style">
                                  <span>Date</span>
                                  <img
                                    src={DropDownIcon}
                                    alt="DropDownIcon"
                                    onClick={() => OpenDropDown()}
                                  />
                                </th>
                                {subMenuOpen ? (
                                  <DatePickerComponent
                                    id="datepicker"
                                    onChange={(e) => SelectDate(e)}
                                    format="d/MM/yyyy"
                                  ></DatePickerComponent>
                                ) : null}
                                <th>
                                  <span>Retail price</span>
                                </th>
                              </tr>
                            </table>
                            <div className="system-does-not  mt-2 font-medium heading-title-text-color align-item-center">
                              <p className="text-center">
                                System could not found this record in this
                                database
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* <div className="empty-statement-alignment-all">
                      <div className="all-globally-new-statement-empty-alignment">
                        <div className="icon-center-alignment">
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.5 2.5H7.5C6.83696 2.5 6.20107 2.76339 5.73223 3.23223C5.26339 3.70107 5 4.33696 5 5V25C5 25.663 5.26339 26.2989 5.73223 26.7678C6.20107 27.2366 6.83696 27.5 7.5 27.5H22.5C23.163 27.5 23.7989 27.2366 24.2678 26.7678C24.7366 26.2989 25 25.663 25 25V10L17.5 2.5Z"
                              stroke="#97A7C3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M17.5 2.50098V10.001H25"
                              stroke="#97A7C3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M20 16.251H10"
                              stroke="#97A7C3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M20 21.251H10"
                              stroke="#97A7C3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M13.5 11.251H10"
                              stroke="#97A7C3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="text-style">
                          <p>No invoices generated so far</p>
                          <h4>
                            Click on <a>Generate new</a> to start billing
                          </h4>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className="invoice-pagination">
                    <Pagination
                      wrapperClass={styles.pagination}
                      pages={totalPages}
                      current={page}
                      onClick={setPage}
                    />
                  </div>
                </div>
                {openInvoice ? (
                  <PDFExport ref={pdfExportComponent}>
                    <div className="Post">
                      <div className="invoice-grid-items">
                        <div className="invoice-child-box invoice-details-height">
                          <div>
                            <div
                              className={
                                allInvoiceData?.[allInvoiceData?.length - 1]
                                  ?.discountMembership > 0
                                  ? "service-provider-membership-height"
                                  : "service-provider-height"
                              }
                            >
                              <div
                                className="text-grid sticky-invoice-box"
                                style={{
                                  gridTemplateColumns: "35%",
                                  display: "flex",
                                }}
                              >
                                <div
                                  className="text-grid-items"
                                  ref={wrapperRef1}
                                >
                                  <h3>
                                    Invoice #
                                    {
                                      allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.invoiceId
                                    }
                                  </h3>
                                  <span>
                                    {moment(
                                      allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.created
                                    ).format("LLLL")}
                                  </span>
                                </div>

                                <div
                                  className="text-grid-items"
                                  style={{ display: "flex", padding: "1%" }}
                                >
                                  {!invoice?.isActive && (
                                    <span className="invoice-Deleted-btn">
                                      <button>Deleted </button>
                                    </span>
                                  )}
                                  {invoice?.isActive &&
                                    allInvoiceData?.[allInvoiceData?.length - 1]
                                      ?.dueStatus === "Part paid" && (
                                      <span className="invoice-Balance-btn">
                                        <button
                                          onClick={(e) =>
                                            duePaymentModal(e, invoice)
                                          }
                                        >
                                          Due{" "}
                                          <span>
                                            {SettingInfo?.currentType}
                                          </span>{" "}
                                          {
                                            allInvoiceData?.[
                                              allInvoiceData?.length - 1
                                            ]?.dueAmount
                                          }
                                        </button>
                                      </span>
                                    )}
                                  {invoice?.isActive &&
                                    allInvoiceData?.[allInvoiceData?.length - 1]
                                      ?.dueStatus === "Unpaid" && (
                                      <span className="invoice-Balance-btn">
                                        <button
                                          onClick={(e) =>
                                            duePaymentModal(e, invoice)
                                          }
                                        >
                                          Due{" "}
                                          <span>
                                            {" "}
                                            {SettingInfo?.currentType}{" "}
                                          </span>{" "}
                                          {
                                            allInvoiceData?.[
                                              allInvoiceData?.length - 1
                                            ]?.dueAmount
                                          }
                                        </button>
                                      </span>
                                    )}

                                  {invoice?.isActive && (
                                    <div
                                      className="more-menu-hover"
                                      style={{ width: "30px" }}
                                    >
                                      <div
                                        className="more-button"
                                        onClick={() =>
                                          SetInvoiceMenu(!invoiceMenu)
                                        }
                                        ref={btnDropdownRef1}
                                      >
                                        {/* <img src={MoreIcon} alt="MoreIcon" /> */}
                                        <svg
                                          width="23"
                                          height="5"
                                          viewBox="0 0 23 5"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            cx="11.5"
                                            cy="2.5"
                                            r="2.5"
                                            fill="#97A7C3"
                                          />
                                          <circle
                                            cx="2.5"
                                            cy="2.5"
                                            r="2.5"
                                            fill="#97A7C3"
                                          />
                                          <circle
                                            cx="20.5"
                                            cy="2.5"
                                            r="2.5"
                                            fill="#97A7C3"
                                          />
                                        </svg>
                                      </div>
                                      <div
                                        ref={popoverDropdownRef1}
                                        className={
                                          !invoiceMenu
                                            ? "table-menu-dropdown table-menu-open"
                                            : "table-menu-dropdown table-menu-hidden"
                                        }
                                      >
                                        <div className="table-invoice-menu-design">
                                          <div className="sub-menu-align">
                                            {invoice?.dueStatus &&
                                              invoice?.dueStatus !== "Paid" && (
                                                <div
                                                  className="sub-menu-box"
                                                  onClick={(e) =>
                                                    duePaymentModal(
                                                      e,
                                                      allInvoiceData?.[
                                                        allInvoiceData?.length -
                                                          1
                                                      ]
                                                    )
                                                  }
                                                >
                                                  <img
                                                    style={{
                                                      width: "13px",
                                                      height: "13px",
                                                    }}
                                                    src={rupeesicon}
                                                    alt="EditIcon"
                                                  />
                                                  <span>Clear due</span>
                                                </div>
                                              )}

                                            {allInvoiceData?.[
                                              allInvoiceData?.length - 1
                                            ]?.customer ? (
                                              permission?.filter(
                                                (obj) =>
                                                  obj.name ===
                                                  "Allow send SMS to customer"
                                              )[0]?.isChecked ===
                                              false ? null : (
                                                <div
                                                  className="sub-menu-box"
                                                  onClick={(e) =>
                                                    ClickSendSMS(
                                                      e,
                                                      allInvoiceData?.[
                                                        allInvoiceData?.length -
                                                          1
                                                      ]
                                                    )
                                                  }
                                                >
                                                  <img
                                                    src={SmsIcon}
                                                    alt="SmsIcon"
                                                  />
                                                  <span>Send SMS </span>
                                                </div>
                                              )
                                            ) : null}
                                            {permission?.filter(
                                              (obj) =>
                                                obj.name ===
                                                "Edit/delete invoice"
                                            )[0]?.isChecked === false ? null : (
                                              // invoice?.balanceAmountRecord || invoice?.dueAmountRecord || invoice?.splitPayment[0]?.method === "Wallet" ? null :
                                              <div
                                                className="sub-menu-box"
                                                onClick={(e) =>
                                                  editInvoiceModal(
                                                    e,
                                                    allInvoiceData?.[
                                                      allInvoiceData?.length - 1
                                                    ]
                                                  )
                                                }
                                              >
                                                <img
                                                  style={{
                                                    width: "19px",
                                                    height: "19px",
                                                  }}
                                                  src={EditIcon}
                                                  alt="EditIcon"
                                                />
                                                <span>Edit Invoice</span>
                                              </div>
                                            )}
                                            <div
                                              className="sub-menu-box"
                                              id="download"
                                              onClick={() => ClickPdf()}
                                              // onClick={(e)=>handleExportWithComponent(e)}
                                            >
                                              <img
                                                src={DownloadIcon}
                                                alt="DownloadIcon"
                                              />
                                              <span>Download</span>
                                            </div>
                                            <div style={{ display: "none" }}>
                                              <ComponentToPrints
                                                data={
                                                  allInvoiceData?.[
                                                    allInvoiceData?.length - 1
                                                  ]
                                                }
                                                ref={wrapperRefs}
                                              />
                                            </div>
                                            {permission?.filter(
                                              (obj) =>
                                                obj.name ===
                                                "Edit/delete invoice"
                                            )[0]?.isChecked === false ? null : (
                                              <div
                                                className="sub-menu-box"
                                                onClick={(e) =>
                                                  deleteInvoiceEntry(
                                                    e,
                                                    allInvoiceData?.[
                                                      allInvoiceData?.length - 1
                                                    ]
                                                  )
                                                }
                                              >
                                                <img
                                                  src={DeleteIcon}
                                                  alt="DeleteIcon"
                                                />
                                                <span
                                                  style={{ color: "#E66666" }}
                                                >
                                                  Delete
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="profile-grid">
                                <div className="profile-grid-items">
                                  {allInvoiceData?.[
                                    allInvoiceData?.length - 1
                                  ]?.customerData?.selectMembership?.slice(
                                    -1
                                  )[0]?.isExpire === false ? (
                                    allInvoiceData?.[
                                      allInvoiceData?.length - 1
                                    ]?.customerData?.selectMembership?.slice(
                                      -1
                                    )[0]?.cardColur === "rgb(248, 226, 124)" ? (
                                      <img
                                        src={YellowMembership}
                                        alt="ProfileImage"
                                      />
                                    ) : allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.customerData?.selectMembership?.slice(
                                        -1
                                      )[0]?.cardColur ===
                                      "rgb(248, 163, 121)" ? (
                                      <img
                                        src={OrangeMembership}
                                        alt="ProfileImage"
                                      />
                                    ) : allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.customerData?.selectMembership?.slice(
                                        -1
                                      )[0]?.cardColur ===
                                      "rgb(109, 200, 199)" ? (
                                      <img
                                        src={SkyBlueMembership}
                                        alt="ProfileImage"
                                      />
                                    ) : allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.customerData?.selectMembership?.slice(
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
                                    <>
                                      <div className="profile-icon">
                                        {allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.customerData?.firstName
                                          ? allInvoiceData?.[
                                              allInvoiceData?.length - 1
                                            ]?.customerData?.firstName[0].toUpperCase()
                                          : "A"}
                                        {allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.customerData?.lastName
                                          ? allInvoiceData?.[
                                              allInvoiceData?.length - 1
                                            ]?.customerData?.lastName[0].toUpperCase()
                                          : ""}
                                      </div>
                                    </>
                                  )}
                                  {/* {
                                    allInvoiceData?.[
                                      allInvoiceData?.length - 1
                                    ]?.customerData?.membership ? 
                                    <img
                                    src={BlueMembership}
                                    alt="ProfileImage"
                                   /> : 
                                   <div className="profile-icon">
                                   {" "}
                                   {allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.customerData?.firstName === "" ||
                                        allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.customerData?.firstName ===
                                     null ||
                                     allInvoiceData?.[
                                      allInvoiceData?.length - 1
                                    ]?.customerData?.firstName ===
                                    undefined
                                    ? "W"
                                    : allInvoiceData?.[
                                      allInvoiceData?.length - 1
                                    ]?.customerData?.firstName[0].toUpperCase()}
                                   {allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.customerData?.lastName === "" ||
                                        allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.customerData?.lastName === null ||
                                        allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.customerData?.lastName ===
                                    undefined
                                    ? ""
                                    : allInvoiceData?.[
                                      allInvoiceData?.length - 1
                                    ]?.customerData?.lastName[0].toUpperCase()}
                                    </div>
                                    } */}
                                </div>
                                <div className="profile-grid-items">
                                  <div className="invoice-add-content-alignment">
                                    {allInvoiceData?.[
                                      allInvoiceData?.length - 1
                                    ]?.customerData ? (
                                      <>
                                        {" "}
                                        <div>
                                          <p>
                                            {" "}
                                            {
                                              allInvoiceData?.[
                                                allInvoiceData?.length - 1
                                              ]?.customerData?.firstName
                                            }{" "}
                                            {
                                              allInvoiceData?.[
                                                allInvoiceData?.length - 1
                                              ]?.customerData?.lastName
                                            }
                                          </p>
                                          <span>
                                            {" "}
                                            {
                                              allInvoiceData?.[
                                                allInvoiceData?.length - 1
                                              ]?.customerData?.mobileNumber
                                            }
                                          </span>
                                        </div>
                                        {allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.notes && (
                                          <div className="view-notes-button">
                                            <span
                                              onClick={
                                                additionalNotesModalToggle
                                              }
                                            >
                                              View notes
                                            </span>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <p>Walk-in-Customer</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {allInvoiceData?.[allInvoiceData?.length - 1]
                                ?.serviceDetails?.length ? (
                                <>
                                  <div className="service-title">
                                    <h4>Services</h4>
                                  </div>

                                  {allInvoiceData?.[
                                    allInvoiceData?.length - 1
                                  ]?.serviceDetails.map((service) => {
                                    return (
                                      <div
                                        key={service._id}
                                        className="service-grid"
                                      >
                                        <div className="service-grid-items">
                                          <div className="sub-service-grid">
                                            <div
                                              className="sub-service-grid-items"
                                              style={{
                                                backgroundColor: service.colour,
                                                borderRadius: "5px",
                                                height: "100%",
                                              }}
                                            ></div>
                                            <div className="sub-service-grid-items">
                                              <p>{service.servicename}</p>
                                              <span>
                                                by{" "}
                                                {service?.staff
                                                  ? service?.staff
                                                      ?.map((data) => {
                                                        return (
                                                          data?.firstName +
                                                          "" +
                                                          data?.lastName
                                                        );
                                                      })
                                                      .join(", ")
                                                  : service?.staffname}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="service-grid-items">
                                          <h5>
                                            <span>
                                              <a>{SettingInfo?.currentType}</a>{" "}
                                            </span>{" "}
                                            {service.servicediscountedprice}
                                          </h5>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : null}
                              {allInvoiceData?.[allInvoiceData?.length - 1]
                                ?.products?.length ? (
                                <>
                                  <div className="products-title">
                                    <h4>Products</h4>
                                  </div>

                                  {allInvoiceData?.[
                                    allInvoiceData?.length - 1
                                  ]?.products.map((product) => {
                                    return (
                                      <div
                                        key={product._id}
                                        className="products-grid"
                                      >
                                        <div className="products-grid-items">
                                          <div className="products-counter-align">
                                            <p>{product.productName}</p>

                                            <div className="counter-amount">
                                              {" "}
                                              {product.productCount}
                                            </div>
                                          </div>
                                          <span>
                                            {product.productquantity}{" "}
                                            {product.productUnit} •{" "}
                                            <>
                                              {product?.staffName &&
                                                "by" + " " + product?.staffName}
                                            </>
                                          </span>
                                        </div>
                                        <div className="products-grid-items">
                                          <h5>
                                            <span>
                                              <a>{SettingInfo?.currentType}</a>
                                            </span>
                                            <span>
                                              {" "}
                                              {product.discountedPrice *
                                                product.productCount}
                                            </span>
                                          </h5>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : null}
                              {allInvoiceData?.[allInvoiceData?.length - 1]
                                ?.membershipDetails?.length ? (
                                <>
                                  <div className="products-title">
                                    <h4>Membership</h4>
                                  </div>

                                  {allInvoiceData?.[
                                    allInvoiceData?.length - 1
                                  ]?.membershipDetails.map((membership) => {
                                    return (
                                      <div className="products-grid">
                                        <div className="sub-grid-items">
                                          <div className="silver-profile">
                                            <div className="silver-profile-alignment">
                                              <div className="profile-type">
                                                {membership?.cardColur ===
                                                "rgb(248, 226, 124)" ? (
                                                  <img
                                                    src={YellowMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : membership?.cardColur ===
                                                  "rgb(248, 163, 121)" ? (
                                                  <img
                                                    src={OrangeMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : membership?.cardColur ===
                                                  "rgb(109, 200, 199)" ? (
                                                  <img
                                                    src={SkyBlueMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : membership?.cardColur ===
                                                  "rgb(72, 148, 248)" ? (
                                                  <img
                                                    src={BlueMembership}
                                                    alt="ProfileImage"
                                                  />
                                                ) : (
                                                  ""
                                                )}
                                                <div className="service-provider-grid-items">
                                                  <p>
                                                    {" "}
                                                    {membership.membershipName}
                                                  </p>
                                                  <span>
                                                    {" "}
                                                    {membership?.staffName &&
                                                      "by" +
                                                        " " +
                                                        membership?.staffName}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="products-grid-items">
                                          <h5>
                                            <span>
                                              <a>{SettingInfo?.currentType}</a>
                                            </span>
                                            <span>
                                              {" "}
                                              {membership?.discountedPrice}
                                            </span>
                                          </h5>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : null}
                            </div>
                            <div className="amount-height">
                              <div className="sub-total-alignment">
                                <div className="text-alignment">
                                  <p>Sub total</p>
                                  <p>
                                    <span>{SettingInfo?.currentType}</span>
                                    {Math.round(
                                      allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.subTotal
                                    )}
                                  </p>
                                </div>
                                {allInvoiceData?.[allInvoiceData?.length - 1]
                                  ?.discountMembership > 0 ? (
                                  <div className="text-alignment">
                                    <p>Membership Discount</p>
                                    <p>
                                      <span>{SettingInfo?.currentType}</span>
                                      {parseInt(
                                        (allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.discountMembership).toFixed(2),
                                        10
                                      )}
                                    </p>
                                  </div>
                                ) : null}
                                <div className="text-alignment">
                                  <p>Discount</p>
                                  <p>
                                    <span>{SettingInfo?.currentType}</span>
                                    {
                                      allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.discount?.discountAmount
                                    }
                                  </p>
                                </div>
                                {gstOn ? (
                                  <div className="text-alignment">
                                    <p>GST</p>
                                    <p>
                                      <span>{SettingInfo?.currentType}</span>
                                      {
                                        allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.GST?.gstAmount
                                      }
                                    </p>
                                  </div>
                                ) : null}
                              </div>
                              <div className="total-amount">
                                <div className="select-items">
                                  <p>Total amount</p>
                                  <h5>
                                    Payment Method:{" "}
                                    {allInvoiceData?.[
                                      allInvoiceData?.length - 1
                                    ]?.dueStatus === "Unpaid"
                                      ? "-"
                                      : allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.paymentMethod}
                                  </h5>
                                </div>
                                <div className="final-total">
                                  <p>
                                    <span>{SettingInfo?.currentType}</span>

                                    {Math.round(
                                      allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.totalAmount
                                    )}
                                    {/* {Math.round(
                                      +allInvoiceData?.[
                                        allInvoiceData?.length - 1
                                      ]?.subTotal -
                                        +allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.discount?.discountAmount +
                                        +allInvoiceData?.[
                                          allInvoiceData?.length - 1
                                        ]?.GST?.gstAmount
                                    )} */}
                                  </p>
                                </div>
                              </div>
                              {allInvoiceData?.[allInvoiceData?.length - 1]
                                ?.balanceAmountRecord ? (
                                <div className="add-due-amount">
                                  <span>
                                    {curencySymbol} {balanceRecord} advance
                                    amount has been added to the client wallet
                                  </span>
                                </div>
                              ) : allInvoiceData?.[allInvoiceData?.length - 1]
                                  ?.dueAmountRecord ? (
                                <div className="add-due-amount">
                                  <p>
                                    {curencySymbol} {dueRecord} due amount has
                                    been recorded
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PDFExport>
                ) : (
                  <PDFExport ref={pdfExportComponent}>
                    <div className="Post">
                      <div className="invoice-grid-items">
                        <div className="invoice-child-box invoice-details-height">
                          <div>
                            <div
                              className={
                                invoice?.discountMembership > 0
                                  ? "service-provider-membership-height"
                                  : "service-provider-height"
                              }
                            >
                              <div
                                className="text-grid sticky-invoice-box"
                                style={{
                                  gridTemplateColumns: "35%",
                                  display: "flex",
                                }}
                              >
                                <div className="text-grid-items">
                                  <h3>Invoice #{invoice?.invoiceId}</h3>
                                  <span>
                                    {moment(invoice?.created).format("LLLL")}
                                  </span>
                                </div>

                                <div
                                  className="text-grid-items"
                                  style={{ display: "flex", padding: "1%" }}
                                >
                                  {!invoice?.isActive && (
                                    <span className="invoice-Deleted-btn">
                                      <button> Deleted </button>
                                    </span>
                                  )}
                                  {invoice?.isActive &&
                                    invoice?.dueStatus === "Part paid" && (
                                      <span className="invoice-Balance-btn">
                                        <button
                                          onClick={(e) =>
                                            duePaymentModal(e, invoice)
                                          }
                                        >
                                          {" "}
                                          Due <span>
                                            {" "}
                                            {curencySymbol}{" "}
                                          </span>{" "}
                                          {invoice?.dueAmount}
                                        </button>
                                      </span>
                                    )}
                                  {invoice?.isActive &&
                                    invoice?.dueStatus === "Unpaid" && (
                                      <span className="invoice-Balance-btn">
                                        <button
                                          onClick={(e) =>
                                            duePaymentModal(e, invoice)
                                          }
                                        >
                                          {" "}
                                          Due <span>{curencySymbol} </span>{" "}
                                          {invoice?.dueAmount}{" "}
                                        </button>
                                      </span>
                                    )}

                                  {invoice?.isActive && (
                                    <div
                                      className="more-menu-hover"
                                      ref={wrapperRef2}
                                      style={{ width: "30px" }}
                                    >
                                      <div
                                        className="more-button"
                                        onClick={() =>
                                          SetInvoiceMenu(!invoiceMenu)
                                        }
                                        ref={btnDropdownRef2}
                                      >
                                        <img src={MoreIcon} alt="MoreIcon" />
                                      </div>
                                      <div
                                        ref={popoverDropdownRef2}
                                        className={
                                          !invoiceMenu
                                            ? "table-menu-dropdown table-menu-open"
                                            : "table-menu-dropdown table-menu-hidden"
                                        }
                                      >
                                        <div className="table-invoice-menu-design">
                                          <div className="sub-menu-align">
                                            {invoice?.dueStatus &&
                                              invoice?.dueStatus !== "Paid" && (
                                                <div
                                                  className="sub-menu-box"
                                                  onClick={(e) =>
                                                    duePaymentModal(e, invoice)
                                                  }
                                                >
                                                  <img
                                                    src={rupeesicon}
                                                    alt="EditIcon"
                                                    style={{
                                                      width: "13px",
                                                      height: "13px",
                                                    }}
                                                  />
                                                  <span>Clear due</span>
                                                </div>
                                              )}
                                            {permission?.filter(
                                              (obj) =>
                                                obj.name ===
                                                "Allow send SMS to customer"
                                            )[0]?.isChecked ===
                                            false ? null : invoice.customer ? (
                                              <div
                                                className="sub-menu-box"
                                                onClick={(e) =>
                                                  ClickSendSMS(e, invoice)
                                                }
                                              >
                                                <img
                                                  src={SmsIcon}
                                                  alt="SmsIcon"
                                                />
                                                <span>Send SMS </span>
                                              </div>
                                            ) : null}
                                            {permission?.filter(
                                              (obj) =>
                                                obj.name ===
                                                "Edit/delete invoice"
                                            )[0]?.isChecked === false ? null : (
                                              // invoice?.balanceAmountRecord || invoice?.dueAmountRecord  || invoice?.splitPayment[0]?.method === "Wallet" ? null :
                                              <div
                                                className="sub-menu-box"
                                                onClick={(e) =>
                                                  editInvoiceModal(e, invoice)
                                                }
                                              >
                                                <img
                                                  src={EditIcon}
                                                  alt="EditIcon"
                                                />
                                                <span>Edit Invoice</span>
                                              </div>
                                            )}
                                            <div
                                              className="sub-menu-box"
                                              id="download"
                                              onClick={() => ClickPdf()}
                                              // onClick={handleExportWithComponent}
                                            >
                                              <img
                                                src={DownloadIcon}
                                                alt="DownloadIcon"
                                              />
                                              <span>Download</span>
                                            </div>
                                            <div style={{ display: "none" }}>
                                              <ComponentToPrint
                                                data={invoice}
                                                ref={wrapperRefs}
                                              />
                                            </div>
                                            {permission?.filter(
                                              (obj) =>
                                                obj.name ===
                                                "Edit/delete invoice"
                                            )[0]?.isChecked === false ? null : (
                                              <div
                                                className="sub-menu-box"
                                                onClick={(e) =>
                                                  deleteInvoiceEntry(e, invoice)
                                                }
                                              >
                                                <img
                                                  src={DeleteIcon}
                                                  alt="DeleteIcon"
                                                />
                                                <span
                                                  style={{ color: "#e66666" }}
                                                >
                                                  Delete
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="profile-grid">
                                <div className="profile-grid-items">
                                  {invoice?.customerData?.selectMembership?.slice(
                                    -1
                                  )[0]?.isExpire === false ? (
                                    invoice.customerData?.selectMembership?.slice(
                                      -1
                                    )[0]?.cardColur === "rgb(248, 226, 124)" ? (
                                      <img
                                        src={YellowMembership}
                                        alt="ProfileImage"
                                      />
                                    ) : invoice.customerData?.selectMembership?.slice(
                                        -1
                                      )[0]?.cardColur ===
                                      "rgb(248, 163, 121)" ? (
                                      <img
                                        src={OrangeMembership}
                                        alt="ProfileImage"
                                      />
                                    ) : invoice.customerData?.selectMembership?.slice(
                                        -1
                                      )[0]?.cardColur ===
                                      "rgb(109, 200, 199)" ? (
                                      <img
                                        src={SkyBlueMembership}
                                        alt="ProfileImage"
                                      />
                                    ) : invoice.customerData?.selectMembership?.slice(
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
                                    <>
                                      <div className="profile-icon">
                                        {invoice?.customerData?.firstName
                                          ? invoice?.customerData?.firstName[0].toUpperCase()
                                          : "A"}
                                        {invoice?.customerData?.lastName
                                          ? invoice?.customerData?.lastName[0].toUpperCase()
                                          : ""}
                                      </div>
                                    </>
                                  )}
                                  {/* {
                                    invoice?.customerData?.membership ? 
                                    <img
                                    src={BlueMembership}
                                    alt="ProfileImage"
                                   /> : 
                                   <div className="profile-icon">
                                   {" "}
                                   {invoice?.customerData?.firstName === "" ||
                                    invoice?.customerData?.firstName ===
                                     null ||
                                     invoice?.customerData?.firstName ===
                                    undefined
                                    ? "W"
                                    : invoice?.customerData?.firstName[0].toUpperCase()}
                                   {invoice?.customerData?.lastName === "" ||
                                    invoice?.customerData?.lastName === null ||
                                    invoice?.customerData?.lastName ===
                                    undefined
                                    ? ""
                                    : invoice?.customerData?.lastName[0].toUpperCase()}
                                    </div>
                                    } */}
                                </div>
                                <div className="profile-grid-items">
                                  <div className="invoice-add-content-alignment">
                                    {invoice?.customer ? (
                                      <>
                                        {" "}
                                        <div>
                                          <p>
                                            {" "}
                                            {invoice?.customer?.firstName}{" "}
                                            {invoice?.customer?.lastName}
                                          </p>
                                          <span>
                                            {" "}
                                            {invoice?.customer?.mobileNumber}
                                          </span>
                                        </div>
                                        {invoice?.notes && (
                                          <div className="view-notes-button">
                                            <span
                                              onClick={
                                                additionalNotesModalToggle
                                              }
                                            >
                                              View notes
                                            </span>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <p>Walk-in-Customer</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {invoice.serviceDetails.length > 0 ? (
                                <>
                                  <div className="service-title">
                                    <h4>Services</h4>
                                  </div>

                                  {invoice.serviceDetails.map((service) => {
                                    return (
                                      <div
                                        key={service._id}
                                        className="service-grid"
                                      >
                                        <div className="service-grid-items">
                                          <div className="sub-service-grid">
                                            <div
                                              className="sub-service-grid-items"
                                              style={{
                                                backgroundColor: service.colour,
                                                borderRadius: "5px",
                                                height: "100%",
                                              }}
                                            ></div>
                                            <div className="sub-service-grid-items">
                                              <p>{service.servicename}</p>
                                              <span>
                                                by{" "}
                                                {service?.staff
                                                  ? service?.staff
                                                      ?.map((data) => {
                                                        return (
                                                          data?.firstName +
                                                          "" +
                                                          data?.lastName
                                                        );
                                                      })
                                                      .join(", ")
                                                  : service?.staffname}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="service-grid-items">
                                          <h5>
                                            <span>
                                              <a>{SettingInfo?.currentType}</a>
                                            </span>
                                            {service.servicediscountedprice}
                                          </h5>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : null}
                              {invoice.products.length > 0 ? (
                                <>
                                  <div className="products-title">
                                    <h4>Products</h4>
                                  </div>
                                  {invoice.products.map((product) => {
                                    return (
                                      <div
                                        key={product._id}
                                        className="products-grid"
                                      >
                                        <div className="products-grid-items">
                                          <div className="products-counter-align">
                                            <p>{product.productName}</p>
                                            <div className="counter-amount">
                                              {" "}
                                              {product.productCount}
                                            </div>
                                          </div>
                                          <span>
                                            {product.productquantity}{" "}
                                            {product.productUnit} •{" "}
                                            <>
                                              {product?.staffName &&
                                                "by" + " " + product?.staffName}
                                            </>
                                          </span>
                                        </div>
                                        <div className="products-grid-items">
                                          <h5>
                                            <span>
                                              <a>{SettingInfo?.currentType}</a>
                                            </span>
                                            <span>
                                              {" "}
                                              {product.discountedPrice *
                                                product.productCount}
                                            </span>
                                          </h5>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : null}
                              {invoice.membershipDetails.length > 0 ? (
                                <>
                                  <div className="products-title">
                                    <h4>Membership</h4>
                                  </div>
                                  {invoice.membershipDetails.map(
                                    (membership) => {
                                      return (
                                        <div className="products-grid">
                                          <div className="sub-grid-items">
                                            <div className="silver-profile">
                                              <div className="silver-profile-alignment">
                                                <div className="profile-type">
                                                  {membership?.cardColur ===
                                                  "rgb(248, 226, 124)" ? (
                                                    <img
                                                      src={YellowMembership}
                                                      alt="ProfileImage"
                                                    />
                                                  ) : membership?.cardColur ===
                                                    "rgb(248, 163, 121)" ? (
                                                    <img
                                                      src={OrangeMembership}
                                                      alt="ProfileImage"
                                                    />
                                                  ) : membership?.cardColur ===
                                                    "rgb(109, 200, 199)" ? (
                                                    <img
                                                      src={SkyBlueMembership}
                                                      alt="ProfileImage"
                                                    />
                                                  ) : membership?.cardColur ===
                                                    "rgb(72, 148, 248)" ? (
                                                    <img
                                                      src={BlueMembership}
                                                      alt="ProfileImage"
                                                    />
                                                  ) : (
                                                    ""
                                                  )}
                                                  <div className="service-provider-grid-items">
                                                    <p>
                                                      {" "}
                                                      {
                                                        membership.membershipName
                                                      }
                                                    </p>
                                                    <span>
                                                      {" "}
                                                      {membership?.staffName &&
                                                        "by" +
                                                          " " +
                                                          membership?.staffName}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="products-grid-items">
                                            <h5>
                                              <span>
                                                <a>
                                                  {SettingInfo?.currentType}
                                                </a>
                                              </span>
                                              <span>
                                                {" "}
                                                {membership?.discountedPrice}
                                              </span>
                                            </h5>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </>
                              ) : null}
                            </div>

                            <div className="amount-height">
                              <div className="sub-total-alignment">
                                <div className="text-alignment">
                                  <p>Sub total</p>
                                  <p>
                                    <span>{SettingInfo?.currentType}</span>
                                    {Math.round(invoice.subTotal)}
                                  </p>
                                </div>
                                {invoice.discountMembership > 0 ? (
                                  <div className="text-alignment">
                                    <p>Membership Discount</p>
                                    <p>
                                      <span>{SettingInfo?.currentType}</span>
                                      {invoice?.discountMembership}
                                    </p>
                                  </div>
                                ) : null}
                                <div className="text-alignment">
                                  <p>Discount</p>
                                  <p>
                                    <span>{SettingInfo?.currentType}</span>
                                    {invoice?.discount?.discountAmount}
                                  </p>
                                </div>
                                {gstOn ? (
                                  <div className="text-alignment">
                                    <p>GST</p>
                                    <p>
                                      <span>{SettingInfo?.currentType}</span>
                                      {invoice?.GST?.gstAmount}
                                    </p>
                                  </div>
                                ) : null}
                              </div>
                              <div className="total-amount">
                                <div className="select-items">
                                  <p>Total amount</p>
                                  <h5>
                                    Payment Method:{" "}
                                    {invoice?.dueStatus === "Unpaid"
                                      ? "-"
                                      : invoice?.paymentMethod}
                                  </h5>
                                </div>
                                <div className="final-total">
                                  <p style={{ fontSize: "18px" }}>
                                    <span>{SettingInfo?.currentType}</span>
                                    {Math.round(invoice?.totalAmount)}
                                    {/* {Math.round(
                                      invoice?.subTotal -
                                        invoice?.discount?.discountAmount +
                                        +invoice?.GST?.gstAmount
                                    )} */}
                                  </p>
                                </div>
                              </div>
                              {invoice?.balanceAmountRecord ? (
                                <div className="add-due-amount">
                                  <span>
                                    {curencySymbol} {balanceRecord} advance
                                    amount has been added to the client wallet
                                  </span>
                                </div>
                              ) : invoice?.dueAmountRecord ? (
                                <div className="add-due-amount">
                                  <p>
                                    {curencySymbol} {dueRecord} due amount has
                                    been recorded
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PDFExport>
                )}
              </div>
            </div>
          </div>
          {/* <div>
      <div>Native SDK File Upload Progress is {progress}%</div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div> */}
        </motion.div>
        {openEditInvoiceModal && (
          <GenerateNewInvoice
            editInvoice={editInvoice}
            modal={openEditInvoiceModal}
            toggle={OpenEditInvoiceModaltoggle}
            getInvoice={GetInvoices}
            SettingInfo={SettingInfo}
          />
        )}
        {openDuePaymentModal && (
          <CustomerDuePaymentModal
            dueTransction={duePayment}
            modal={openDuePaymentModal}
            customerDetails={invoice?.customerData}
            toggle={OpenDuePaymentModaltoggle}
            SettingInfo={SettingInfo}
            dueAmount={duePayment[0].dueAmount}
          />
        )}
        {openGenerateNewModal && (
          <GenerateNewInvoice
            modal={openGenerateNewModal}
            toggle={OpenGenerateNewtoggle}
            SettingInfo={SettingInfo}
            pastInvoice={pastInvoice}
          />
        )}
        {deleteinvoice && (
          <Delete
            Delete={deleteInvoiceData}
            modal={deleteinvoice}
            toggle={OpenDeleteInvoiceModaltoggle}
            getInvoices={GetInvoices}
            togggle={GetInvoices}
          />
        )}

        {sendSMS && (
          <SendSMS
            SendSMSData={sendSMSData}
            modal={sendSMS}
            toggle={OpenSendSMSModaltoggle}
          />
        )}

        {pdf && <Example modal={pdf} toggle={OpenPdfModaltoggle} />}

        {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
        <ViewInvoiceModal
          editInvoiceModal={editInvoiceModal}
          SettingInfo={SettingInfo}
        />
      </div>
      {viewAdditionalNotes && (
        <ViewAdditionalNotesModal
          toggle={additionalNotesModalToggle}
          modal={viewAdditionalNotes}
          notes={invoice?.notes}
        />
      )}
    </>
  );
}
