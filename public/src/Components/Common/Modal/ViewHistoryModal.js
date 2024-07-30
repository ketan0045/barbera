import React, { useState, useEffect } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import "../Modal/ViewHistoryModal.scss";
import { ApiGet } from "../../../helpers/API/ApiData";
import Moment from "moment";
import ViewInvoiceModal from "./ViewInvoiceModal";
import Success from "../Toaster/Success/Success";

function ViewHistoryModal(props) {
  const { toggleme, productDetails, userInfo, historyOf, SettingInfo } = props;
  const [stockHistory, setStockHistory] = useState([]);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState();
  const [er, setEr] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  // console.log("productDetails", productDetails);
  // console.log("stockHistory", stockHistory);

  const getProductStockHistory = async () => {
    let stockRes = await ApiGet("/stock/company/product/" + productDetails?._id);
    try {
      if (stockRes.status === 200) {
        let allTypeStockHistory = stockRes.data.data;
        
        let oneTypeStockHistory = await allTypeStockHistory?.filter((entry) => {
          return historyOf === "Retail"
            ? !!entry.retailInitialStock && +entry.retailInitialStock !== 0
            : !!entry.storeInitialStock && +entry.storeInitialStock !== 0;
        });
        setStockHistory(oneTypeStockHistory.reverse());
      }
    } catch (error) {
      console.log("in the catch", error);
    }
  };

  const handleShowInvoice = async (invoiceNo) => {
   
    let res = await ApiGet("invoice/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        let invoiceList = res.data.data;
        let filteredInvoice = invoiceList.filter((item, index) => {
          return item.invoiceId === invoiceNo;
        });
        setCurrentInvoice(filteredInvoice[0]);
        ViewInvoiceModalToggle();
        TostMSG();
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const ViewInvoiceModalToggle = () => {
    setViewInvoiceModal(!viewInvoiceModal);
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
        setToastmsg("Changes saved");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1200);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    getProductStockHistory();
    return () => {
      setStockHistory([]);
    };
  }, []);

  return (
    <>
      <div className="history-modal-wrapper">
        <div className="history-modal">
          <div className="history-modal-header">
            <button type="button" className="modal-close" onClick={toggleme}>
              <img className="close" src={CloseIcon} alt="CloseIcon" />
            </button>
            <h5 className="history-modal-title">
              {historyOf === "Retail"
                ? "Stock history | Retail"
                : "Stock history | Store Consumption"}
            </h5>
          </div>
          <div className="history-modal-body">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Status/Quantity</th>
                  <th>Final stock</th>
                </tr>
                <tr className="breaker"></tr>
              </thead>
              <tbody>
                {/* {data.map((e) => {
                  return (
                    <tr>
                      <td>{e.numbers}</td>
                      <td>{e.desc}</td>
                      <td>
                        {e.arrow} <span>{e.quantity}</span>
                      </td>
                      <td>{e.stock}</td>
                    </tr>
                  );
                })} */}
                {stockHistory?.map((entry) => {
                  return (
                    <tr>
                      <td>{Moment(entry.created).format("DD MMM 'YY")}</td>
                      {entry.description?.split("#").length === 2 ? (
                        <td>
                          {entry.description?.split("#")[0]}
                          <span
                            style={{ color: "#1479FF" }}
                            onClick={(e) => handleShowInvoice(entry.description?.split("#")[1])}
                          >
                            <br /> #{entry.description?.split("#")[1]}
                          </span>
                        </td>
                      ) : (
                        <td> {entry.description}</td>
                      )}
                      <td className="qualityWrapper">
                        {entry?.type === "CR" ? (
                          <svg
                            width="12"
                            height="16"
                            viewBox="0 0 12 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 3.83L10.59 7.41L12 6L6 0L0 6L1.41 7.41L5 3.83V16H7V3.83Z"
                              fill="#387F6B"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="12"
                            height="16"
                            viewBox="0 0 12 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12.17L1.41 8.59L0 10L6 16L12 10L10.59 8.59L7 12.17V0H5V12.17Z"
                              fill="#E66666"
                            />
                          </svg>
                        )}
                        <span>
                          {historyOf === "Retail"
                            ? entry.retailInitialStock
                            : entry.storeInitialStock}
                        </span>
                      </td>
                      <td>
                        {historyOf === "Retail"
                          ? entry.totalRetailInitialStock
                          : entry.totalStoreInitialStock}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {viewInvoiceModal && (
        <div>
          <ViewInvoiceModal
            modal={viewInvoiceModal}
            toggle={ViewInvoiceModalToggle}
            invoice={currentInvoice}
            ViewInvoice={"ViewInvoice"}
            TostMSG={TostMSG}
            SettingInfo={SettingInfo}
          />
        </div>
      )}
      {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
    </>
  );
}

export default ViewHistoryModal;
