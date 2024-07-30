import React, { useState } from "react";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import ViewInvoiceModal from "../ViewInvoiceModal";

export default function CashCollectionList(props) {
  const { setShowList, cashCollectionData, SettingInfo,paymentFilterData } = props;
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();

  const ViewInvoice = (e, inv) => {
    setInvoiceDetail(inv);
    
    setViewInvoiceModal(!viewInvoiceModal);
  };

  console.log("cashCollectionData",cashCollectionData)
  return (
    <>
      <div>
        <div className="cus-modal-new-design">
          <div className="cus-modal-cash-statment-modal">
            <div className="cus-modal-statemtn-design">
              <div className="generated-header">
                <div
                  className="close-icon-cus"
                  onClick={() => setShowList(false)}
                >
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <h1>Collection from Sale</h1>
              </div>
              <div className="generated-invoice-modal-body generated-invoice-modal-body-alignment-box">
                <div className="generated-invoice-table table-left-right-alignment">
                  <table>
                    <tr>
                      <th align="left">Invoice #</th>
                      <th align="left">Customer name</th>
                      <th align="center">Total amount</th>
                      <th align="center">Amount</th>
                    </tr>
                    {cashCollectionData.length > 0 &&
                      cashCollectionData.map((invoice) => {
                        return (
                          <tr key={invoice._id}>
                            <td>
                              {invoice.invoiceId ? (
                                <span
                                  className="number-text-color"
                                  onClick={(e) => ViewInvoice(e, invoice)}
                                >
                                  #{invoice.invoiceId}
                                </span>
                              ) : (
                                "Due Cleared"
                              )}
                            </td>
                            <td>
                              {invoice.customerData
                                ? invoice.customerData.firstName +
                                  " " +
                                  invoice.customerData.lastName
                                : "Walk-in"}
                            </td>
                            <td align="center">
                              <a className="dynamic-cureency-font-style">
                                {SettingInfo?.currentType}
                              </a>{" "}
                              {invoice.invoiceId
                                ? invoice.totalAmount
                                : invoice.walletAmount}
                            </td>

                            <td align="center">
                              <a className="dynamic-cureency-font-style">
                                {SettingInfo?.currentType}
                              </a>{" "}
                              {invoice.invoiceId
                                ? invoice?.isSplit
                                  ? invoice?.splitPayment.filter(
                                      (obj) => obj?.method === paymentFilterData
                                    )[0].amount
                                  : invoice.collectedAmountRecord
                                : invoice.walletAmount}
                            </td>
                          </tr>
                        );
                      })}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewInvoiceModal && (
        <ViewInvoiceModal
          modal={viewInvoiceModal}
          toggle={ViewInvoice}
          ViewInvoice={ViewInvoice}
          invoice={invoiceDetail}
          //   getInvoices={getInvoices}
          //   TostMSG={TostMSG}
          SettingInfo={SettingInfo}
          CustomerDue={true}
        />
      )}
    </>
  );
}
