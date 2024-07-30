import React, { useEffect, useState, useRef, useContext } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
// import xtype from 'xtypejs'

import moment from "moment";
import Popper from "popper.js";
import PropTypes from "prop-types";
import MoreIcon from "../../../assets/svg/more.png";
import closeIcon from "../../../assets/svg/close-icon.svg";
import SmsIcon from "../../../assets/svg/sms.svg";
import EditIcon from "../../../assets/svg/edit.svg";
import DownloadIcon from "../../../assets/svg/download.svg";
import { useReactToPrint } from "react-to-print";
import DeleteIcon from "../../../assets/svg/delete.svg";
import ComponentToPrint from "../../../Components/View/Invoice/Example";
import Success from "../Toaster/Success/Success";
import GenerateNewInvoice from "./GenerateNewInvoice";
import Delete from "../Toaster/Delete";
import SendSMS from "../Modal/SendSMS";
import YellowMembership from "../../../assets/svg/Yellow-Membership.svg";
import SkyBlueMembership from "../../../assets/svg/SkyBlue-Membership.svg";
import OrangeMembership from "../../../assets/svg/Orange-Membership.svg";
import BlueMembership from "../../../assets/svg/BLue-Membership.svg";
import UserContext from "../../../helpers/Context";
import CustomerDuePaymentModal from "./CustomerDuePaymentModal";
import rupeesicon from "../../../assets/svg/rupees-icon.svg";
import ViewAdditionalNotesModal from "./ViewAdditionalNotesModal";


export default function ViewInvoiceModal(props) {
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const {
    modal,
    editBrand,
    AddCustomer,
    search,
    ViewInvoice,
    toggle,
    invoice,
    getInvoices,
    TostMSG,
    SettingInfo,
    CustomerDue
  } = props;
  let mob = "";
  let fname = "";
  // if (xtype(parseInt(search, 10)) === "positive_integer") {
  //   mob = search;
  // } else {
  //   fname = search;
  // }
  const permission = userInfo.permission;
  // const [fullName, setfullName] = useState(fname);
  // const [mobileNumber, setMobileNumber] = useState(mob);
  const [errors, setError] = useState({});
  const [addedCustomerDetail, setAddedCustomerDetail] = useState({});
  const wrapperRefs = useRef();
  const [invoiceMenu, SetInvoiceMenu] = useState(true);
  const [sendSMSData, setSendSMSData] = useState();
  const [sendSMS, setSendSMS] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [er, setEr] = useState();
  const [editInvoice, setEditInvoice] = useState(false);
  const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
  const [deleteinvoice, setDeleteInvoice] = useState(false);
  const [deleteInvoiceData, setDeleteInvoiceData] = useState();
  const [openInvoice, setOpenInvoice] = useState(true);
  const [duePaymentDetail,setDuePaymentDetail ] = useState([]);
  const [walletHistory, setWalletHistory] = useState();
  const [openDuePaymentModal, setOpenDuePaymentModal] = useState(false);
  const [duePayment, setDuePayment] = useState(false);
  const [viewAdditionalNotes, setViewAdditionalNotes] = useState(false);

  const curencySymbol=SettingInfo?.currentType
  // const customer = {
  //   firstName: fullName,
  //   lastName: "",
  //   mobileNumber: mobileNumber,
  //   companyId: userInfo.companyId,
  // };

  const closeOnClick = () => {
    props.toggle(false);
  };
  const ClickPdf = useReactToPrint({
    content: () => wrapperRefs.current,
  });

  const ClickSendSMS = (e, data) => {
    setSendSMSData(data);
    SetInvoiceMenu(!invoiceMenu);
    OpenSendSMSModaltoggle();
  };

  const OpenSendSMSModaltoggle = (data) => {
    setSendSMS(!sendSMS);
    if (sendSMS === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("SMS sent successfully!");
          toggle(data);
          TostMSG("SMS");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
          toggle(data);
        }
      }
    }
  };
  const deleteInvoiceEntry = (e, data) => {
    SetInvoiceMenu(!invoiceMenu);
    setDeleteInvoiceData(data);
    OpenDeleteInvoiceModaltoggle();
  };
  

  const OpenDeleteInvoiceModaltoggle = (data) => {
    setDeleteInvoice(!deleteinvoice);
    if (deleteinvoice === true) {
      if (data) {
        if (data === 200) {
          if(invoice?.balanceAmountRecord){
            let walletData = {
              companyId: SettingInfo?.companyId,
              user_id: invoice?.customer?._id,
              type: "DR",
              method: [],
              description: "Deleted invoice",
              walletAmount: invoice?.balanceAmountRecord,
              topup:true
            };
        
            ApiPost("wallet",walletData).then((resp)=>{
              if(resp.data.status === 200){
              
              }
            }).catch((er)=>{
              console.log(er)
            })
          }

          if(invoice?.dueAmountRecord && invoice?.dueStatus !== "Paid"){
            let walletData = {
              companyId: SettingInfo?.companyId,
              user_id: invoice?.customer?._id,
              type: "CR",
              method: [],
              description: "Deleted invoice",
              walletAmount: invoice?.dueAmount,
              topup:true
            };
        
            ApiPost("wallet",walletData).then((resp)=>{
              if(resp.data.status === 200){
              
              }
            }).catch((er)=>{
              console.log(er)
            })
          }

          if(invoice?.splitPayment[0]?.method === "Wallet"){
            let walletData = {
              companyId: SettingInfo?.companyId,
              user_id: invoice?.customer?._id,
              type: "CR",
              method: [],
              description: "Deleted invoice",
              walletAmount: invoice?.splitPayment[0]?.amount,
              topup:true
            };
        
            ApiPost("wallet",walletData).then((resp)=>{
              if(resp.data.status === 200){
              
              }
            }).catch((er)=>{
              console.log(er)
            })
          }

          ApiGet("customer/company/" + userInfo.companyId)
          .then((resp) => {
            let cusData = resp.data.data.filter((cus)=>cus._id === invoice.customerData._id)
            
            let OnlymembershipService = invoice?.membershipDetails[0]?.selectedServices?.map((serv)=>{
              return(
                invoice?.serviceDetails?.filter((ser)=>ser?.serviceId === serv?._id)
              )
            }).flat()
    
            let OnlyCustomermembershipService = cusData[0]?.selectMembership[0]?.selectedServices?.map((serv)=>{
              return(
                invoice?.serviceDetails?.filter((ser)=>ser?.serviceId === serv?._id)
              )
            }).flat()
            
            if(cusData?.selectMembership?.length !== 0 || OnlymembershipService > 0 || OnlyCustomermembershipService > 0){
            if(OnlymembershipService?.length > 0){
                let service = cusData[0]?.selectMembership?.map((obj,index)=>{
                  if(index === cusData[0]?.selectMembership?.length - 1 ){
                    if(obj?.availService === OnlymembershipService?.length){
                      return({
                        ...obj,
                        isExpire: false,
                        remainingService: obj?.availService
                      })
                    }else {
                      return({
                      ...obj,
                      remainingService:obj?.remainingService + OnlymembershipService?.length
                      })
                    }
                  } else {
                    return(obj)
                  }
                }) 
            
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
    
            
  
    
              if(OnlyCustomermembershipService?.length > 0){
                let servicedd = cusData[0]?.selectMembership?.map((obj,index)=>{
                  if(index === cusData[0]?.selectMembership?.length - 1 ){
                    if(obj?.availService === OnlyCustomermembershipService?.length){
                      return({
                        ...obj,
                        isExpire: false,
                        remainingService: obj?.availService
                      })
                    }else {
                      return({
                      ...obj,
                      remainingService:obj?.remainingService + OnlyCustomermembershipService?.length
                      })
                    }
                  } else {
                    return(obj)
                  }
                })
              
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
          setSuccess(true);
          setToastmsg("Invoice deleted!");
          toggle(data);
          TostMSG("DELETE");
        } else {
          setSuccess(true);
          setEr("Error");
          toggle(data);
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const additionalNotesModalToggle = () => { setViewAdditionalNotes(!viewAdditionalNotes) };

  const editInvoiceModal = (e, data) => {
    setEditInvoice(data);
    SetInvoiceMenu(!invoiceMenu);
    OpenEditInvoiceModaltoggle();
  };

  const OpenEditInvoiceModaltoggle = (data) => {
    setOpenEditInvoiceModal(!openEditInvoiceModal);
    if (openEditInvoiceModal === true) {
      if (data) {
        if (data.data.status === 200) {
          setSuccess(true);
          setToastmsg("Changes saved!");
          toggle(data.data.status);
          TostMSG("EDIT");
        } else {
          setSuccess(true);
          setEr("Error");
          toggle(data.data.status);
          setToastmsg("Something went wrong");
        }
      }
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

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
  ViewInvoiceModal.propTypes = {
    children: PropTypes.element.isRequired,
  };

 

  const duePaymentModal = (e, data) => {
    
    getWalletTransction(data?.customer)
    ApiGet(`invoice/partPayment/customer/${data?.customer?._id}`).then((resp)=>{
      
      setDuePaymentDetail(resp?.data?.data)
    }).catch((er)=>{
      console.log(er)})
    setDuePayment([data]);
  
    OpenDuePaymentModaltoggle();
  };

  
  const getWalletTransction = (user) => {
    
    if(user){
    ApiGet(`wallet/user/company/${user?._id}`)
      .then((resp) => {
        setWalletHistory(resp?.data.data);
      })
      .catch((er) => {
        console.log(er);
      });
    }
  };

  const OpenDuePaymentModaltoggle = (data) => {
    setOpenDuePaymentModal(!openDuePaymentModal);

    if (openDuePaymentModal === true) {
      if (data) {
        if (data === true) {
          setSuccess(true);
          setToastmsg("Changes saved!");
          getInvoices()
          toggle()
          TostMSG("Due");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  // const btnDropdownRef = React.createRef();
  // const popoverDropdownRef = React.createRef();
  // const wrapperRef = useRef(null);
  // const openDropdownPopover = () => {
  //   new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
  //     placement: "top",
  //   });
  //     toggle(true)
  // };
  // const closeDropdownPopover = () => {
  //     toggle(true)
  // };

  // function useOutsideAlerter(ref) {
  //   useEffect(() => {
  //     function handleClickOutside(event) {
  //       if (ref.current && !ref.current.contains(event.target)) {
  //         toggle(true)
  //       }
  //     }
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [ref]);
  // }

  // useOutsideAlerter(wrapperRef);
  // ViewInvoiceModal.propTypes = {
  //   children: PropTypes.element.isRequired,
  // };
  return (
    <>
      {modal ? (
        openEditInvoiceModal ? null : (
          <div className="modal-bluer-open"></div>
        )
      ) : null}
      <div
        className={
          ViewInvoice
            ? openEditInvoiceModal
              ? "sub-modal-main-one right-side-modal-hide"
              : "sub-modal-main-one right-side-modal-show"
            : "sub-modal-main-one right-side-modal-hidden"
        }
      >
        <div
          className="dashboard-right-side-modal"
          // ref={wrapperRef}
        >
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
                  style={{ display: "flex" }}
                >
                  <div className="text-grid-items">
                    <h3>Invoice #{invoice?.invoiceId}</h3>
                    <span>{moment(invoice?.created).format("LLLL")}</span>
                  </div>

                  <div className="text-grid-items">
                    <div className={!invoice?.isActive ? "text-grid ":"text-grid text-grid-three"} style={{ gap: "5px" }}>
                      <div className="text-grid-items">
                        {!invoice?.isActive ?    <div className="Transactions-wallet-deleted-status">
                            <button>Deleted </button>
                          </div>
                           : invoice?.dueStatus === "Part paid" ||
                        invoice?.dueStatus === "Unpaid" ? (
                          <div className="Transactions-wallet-status">
                            {CustomerDue ?<button>Due <span>{SettingInfo?.currentType} </span>{invoice?.dueAmount}</button>: 
                            <button   onClick={(e) =>duePaymentModal(e, invoice)}>Due <span>{SettingInfo?.currentType}</span> {invoice?.dueAmount}</button>}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {invoice?.isActive && 
                      <div
                        className= "text-grid-items more-menu-hover"
                        ref={wrapperRef2}
                      >
                        {/* {invoice?.serviceDetails?.length ? ! (  */}

                        {!CustomerDue && <div>
                          <div
                            className="more-button"
                            onClick={() => SetInvoiceMenu(!invoiceMenu)}
                            ref={btnDropdownRef2}
                          >
                            <img src={MoreIcon} alt="MoreIcon" />
                          </div>
                        </div>}
                        {/* ) : null } */}
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
                            {invoice?.dueStatus ? invoice?.dueStatus !== "Paid" && <div
                                                className="sub-menu-box"
                                                onClick={(e) =>
                                                  duePaymentModal(
                                                    e,
                                                    invoice
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
                                              </div> : null} 
                              {permission?.filter(
                                (obj) =>
                                  obj.name === "Allow send SMS to customer"
                              )[0]?.isChecked ===
                              false ? null : invoice?.customer ? (
                                <div
                                  className="sub-menu-box"
                                  onClick={(e) => ClickSendSMS(e, invoice)}
                                >
                                  <img src={SmsIcon} alt="SmsIcon" />
                                  <span>Send SMS </span>
                                </div>
                              ) : null}
                              {permission?.filter(
                                (obj) => obj.name === "Edit/delete invoice"
                              )[0]?.isChecked === false ? null : (
                                // invoice?.balanceAmountRecord || invoice?.dueAmountRecord || invoice?.splitPayment[0]?.method === "Wallet" ? null :
                                <div
                                  className="sub-menu-box"
                                  onClick={(e) => editInvoiceModal(e, invoice)}
                                >
                                  <img src={EditIcon} alt="EditIcon" />
                                  <span>Edit Invoice</span>
                                </div>
                              )}
                              <div
                                className="sub-menu-box"
                                id="download"
                                onClick={() => ClickPdf()}
                              >
                                <img src={DownloadIcon} alt="DownloadIcon" />
                                <span>Download</span>
                              </div>
                              <div style={{ display: "none" }}>
                                <ComponentToPrint
                                  data={invoice}
                                  ref={wrapperRefs}
                                />
                              </div>
                              {permission?.filter(
                                (obj) => obj.name === "Edit/delete invoice"
                              )[0]?.isChecked === false ? null : (
                                <div
                                  className="sub-menu-box"
                                  onClick={(e) =>
                                    deleteInvoiceEntry(e, invoice)
                                  }
                                >
                                  <img src={DeleteIcon} alt="DeleteIcon" />
                                  <span style={{ color: "#e66666" }}>
                                    Delete
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>}
                      <div className="text-grid-items">
                        <div
                          className="more-button"
                          onClick={() => toggle()}
                          ref={btnDropdownRef2}
                        >
                          <img
                            style={{ width: "12px" }}
                            src={closeIcon}
                            alt="MoreIcon"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-grid">
                  <div className="profile-grid-items">
                    {/* <div className="profile-icon"> */}
                    {invoice?.customerData?.membership ? (
                      invoice?.customerData?.selectMembership?.slice(-1)[0]
                        ?.cardColur === "rgb(248, 226, 124)" ? (
                        <img src={YellowMembership} alt="ProfileImage" />
                      ) : invoice?.customerData?.selectMembership?.slice(-1)[0]
                          ?.cardColur === "rgb(248, 163, 121)" ? (
                        <img src={OrangeMembership} alt="ProfileImage" />
                      ) : invoice?.customerData?.selectMembership?.slice(-1)[0]
                          ?.cardColur === "rgb(109, 200, 199)" ? (
                        <img src={SkyBlueMembership} alt="ProfileImage" />
                      ) : invoice?.customerData?.selectMembership?.slice(-1)[0]
                          ?.cardColur === "rgb(72, 148, 248)" ? (
                        <img src={BlueMembership} alt="ProfileImage" />
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
                  </div>
                  {/* </div> */}
                  <div className="profile-grid-items">
                    {invoice?.customerData ? (
                      <>
                        {" "}
                        <p>
                          {invoice?.customerData?.firstName}{" "}
                          {invoice?.customerData?.lastName}
                        </p>
                        <span>{invoice?.customerData?.mobileNumber}</span>
                      </>
                    ) : (
                      <p>Walk-in Customer</p>
                    )}
                  </div>
                 {invoice?.notes && <div className="view-notes-button">
                    <span onClick={additionalNotesModalToggle}>View notes</span>
                  </div>}
                </div>
                {invoice?.serviceDetails?.length > 0 ? (
                  <>
                    <div className="service-title">
                      <h4>Services</h4>
                    </div>

                    {invoice?.serviceDetails.map((service) => {
                      return (
                        <div key={service._id} className="service-grid">
                          <div className="service-grid-items">
                            <div className="sub-service-grid">
                              <div className="sub-service-grid-items">
                                <div
                                  style={{
                                    backgroundColor: service.colour,
                                    borderRadius: "5px",
                                    height: "30px",
                                    width: "5px",
                                    marginTop: "3px",
                                  }}
                                ></div>
                              </div>
                              <div className="sub-service-grid-items">
                                <p>{service.servicename}</p>
                                <span>
                                  by{" "}
                                  {service?.staff
                                    ? service?.staff
                                        ?.map((st) => {
                                          return (
                                            st?.firstName + " " + st?.lastName
                                          );
                                        })
                                        .join(",")
                                    : service?.staffname}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="service-grid-items">
                            <h5>
                              <span style={{ paddingRight: "3px" }}>
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
                {invoice?.products?.length > 0 ? (
                  <>
                    <div
                      className="products-title"
                      style={{ paddingTop: "22px" }}
                    >
                      <h4>Products</h4>
                    </div>
                    {invoice?.products.map((product) => {
                      return (
                        <div key={product._id} className="products-grid">
                          <div className="products-grid-items">
                            <div className="products-counter-align">
                              <p>{product.productName}</p>
                              <div className="counter-amount">
                                {" "}
                                {product.productCount}
                              </div>
                            </div>
                            <span className="c-flex-invoice">
                              {product.productquantity} {product.productUnit} •{" "}
                              <span style={{ paddingRight: "3px" }}>
                                {" "}
                                {product?.staffName &&
                                  " by " + " " + product?.staffName}
                              </span>
                            </span>
                          </div>
                          <div className="products-grid-items">
                            <h5>
                              <span style={{ paddingRight: "3px" }}>
                                <a>{SettingInfo?.currentType}</a>
                              </span>
                              <span>
                                {" "}
                                {product.discountedPrice * product.productCount}
                              </span>
                            </h5>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : null}
                {invoice?.membershipDetails?.length > 0 && (
                  <>
                    <div className="membership-title-count-alignment">
                      <p>Membership</p>
                      <div className="membership-counter-design">
                        {invoice?.membershipDetails?.length}
                      </div>
                    </div>
                    {invoice?.membershipDetails?.map((membership) => {
                      return (
                        <div key={membership?._id} className="silver-profile">
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
                                <img src={BlueMembership} alt="ProfileImage" />
                              ) : (
                                ""
                              )}
                              <div className="service-provider-grid-items">
                                <p> {membership.membershipName}</p>
                                <span>
                                  {" "}
                                  {membership?.staffName &&
                                    "by" + " " + membership?.staffName}
                                </span>
                              </div>
                            </div>
                            <div className="membership-alignment">
                              <h5>
                                <a>{SettingInfo?.currentType}</a>{" "}
                                {membership?.discountedPrice}
                              </h5>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="amount-height">
                <div className="sub-total-alignment">
                  <div className="text-alignment">
                    <p>Sub total</p>
                    <p>
                      <span style={{ paddingRight: "3px" }}>
                        {SettingInfo?.currentType}
                      </span>
                      {Math.round(invoice?.subTotal)}
                    </p>
                  </div>
                  {invoice?.discountMembership > 0 ? (
                    <div className="text-alignment">
                      <p>Membership Discount</p>
                      <p>
                        <span style={{ paddingRight: "3px" }}>
                          {SettingInfo?.currentType}
                        </span>
                        {invoice?.discountMembership}
                      </p>
                    </div>
                  ) : null}
                  <div className="text-alignment">
                    <p>Discount</p>
                    <p>
                      <span style={{ paddingRight: "3px" }}>
                        {SettingInfo?.currentType}
                      </span>
                      {invoice?.discount?.discountAmount}
                    </p>
                  </div>
                  <div className="text-alignment">
                    <p>GST</p>
                    <p>
                      <span>{SettingInfo?.currentType}</span>
                      {invoice?.GST?.gstAmount}
                    </p>
                  </div>
                </div>
                <div className="total-amount">
                  <div className="select-items">
                    <p>Total amount</p>
                    <h5>Payment Method: {invoice?.dueStatus === "Unpaid" ? "-" :invoice?.paymentMethod }</h5>
                  </div>
                  <div className="final-total">
                    <p style={{ paddingRight: "3px" }}>
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
                <div className="add-due-amount"> 
                 {invoice?.balanceAmountRecord ? <span>{SettingInfo?.currentType} {invoice?.balanceAmountRecord} advance amount has been added to the client wallet</span>:null}
                {invoice?.dueAmountRecord ? <p>{SettingInfo?.currentType} {invoice?.dueAmountRecord} due amount has been recorded</p> :null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {deleteinvoice && (
        <Delete
          Delete={deleteInvoiceData}
          modal={deleteinvoice}
          toggle={OpenDeleteInvoiceModaltoggle}
          getInvoices={getInvoices}
        />
      )}

      {sendSMS && (
        <SendSMS
          SendSMSData={sendSMSData}
          modal={sendSMS}
          toggle={OpenSendSMSModaltoggle}
        />
      )}
      {openEditInvoiceModal && (
        <GenerateNewInvoice
          editInvoice={editInvoice}
          modal={openEditInvoiceModal}
          toggle={OpenEditInvoiceModaltoggle}
          SettingInfo={SettingInfo}
        />
      )}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {openDuePaymentModal && (
          <CustomerDuePaymentModal
            dueTransction={duePayment}
            modal={openDuePaymentModal}
            customerDetails={invoice?.customerData}
            toggle={OpenDuePaymentModaltoggle}
            SettingInfo={SettingInfo}
            dueAmount={duePayment[0].dueAmount}
            CustomerDue={CustomerDue}
          />
        )}
        {viewAdditionalNotes && 
          <ViewAdditionalNotesModal toggle={additionalNotesModalToggle} modal={viewAdditionalNotes} notes={invoice?.notes}/>
        }
    </>
  );
}
