import React, { useState } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import UserAdd from "../../../assets/svg/user-add.svg";
import SearchIcon from "../../../assets/svg/X.svg";
import { ApiGet } from "../../../helpers/API/ApiData";
import OptionSelect from "../OptionSelect/OptionSelect";
import GenerateNewInvoice from "./GenerateNewInvoice";
import "./Modal.scss";
import ViewInvoiceModal from "./ViewInvoiceModal";

export default function DuePaymentModal(props) {
  const { invoicedata, modal, toggle, duePayment } = props;

  const [customer, setCustomer] = useState([duePayment]);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [addNewCustomerModal, setAddNewCustomerModal] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();

  const ViewInvoiceModalToggle = (data) => {
    setViewInvoiceModal(!viewInvoiceModal);
  };

  
  const ViewInvoiceId = (data) => {
    ViewInvoiceModalToggle();
  };

  const ViewInvoice = (e, data) => {
    ViewInvoiceModalToggle();
    setInvoiceDetail(data);
  };

  return (
    <>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => props.toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Clear Dues | Invoice #{duePayment.invoiceId}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="generate-box-center">
                <div className="generate-box">
                  <div className="back-arrow-alignment"></div>
                  <div className="title-text">
                    <h3>Clear Dues</h3>
                  </div>
                  {customer.map((res) => {
                    return (
                      <>
                        <div className="select-service-grid right-space-align">
                          <div className="profile-grid">
                            <div className="profile-grid-items">
                              <div className="profile-grid-items">
                                <div
                                  className="cus-profile-membership"
                                  style={{
                                    background: "red",
                                  }}
                                ></div>
                              </div>
                              <div className="profile-grid">
                                <div className="profile-grid-items">
                                  <p> {res?.customerData?.firstName}</p>
                                </div>
                              </div>
                              </div>
                              <div className="profile-grid">
                                <div className="profile-grid-items">
                                  {/* <p> {res.customerData.firstName}</p> */}
                                </div>
                              </div>
                              <div className="profile-grid-items">
                                <p> Pending invoices dues</p>
                              </div>
                              <div className="profile-grid-items">
                                <p
                                  className="blue-text-style"
                                  onClick={(e) => ViewInvoiceId(res)}
                                >
                                  {duePayment.invoiceId}
                                </p>
                              </div>
                            </div>
                          </div>
                        
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewInvoiceModal && (
        <ViewInvoiceModal
          modal={viewInvoiceModal}
          toggle={ViewInvoiceModalToggle}
          ViewInvoice={ViewInvoice}
          invoice={duePayment}
          // getInvoices={getInvoices}
          // TostMSG={TostMSG}
        />
      )}
    </>
  );
}
