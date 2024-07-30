import React from "react";
import "./../Modal.scss";
import CloseIcon from "../../../../assets/svg/close-icon.svg";

export default function GeneratedInvoiceList(props) {
  const { toggle, currentInvoices, ViewInvoice, SettingInfo } = props;

  return (
    <div>
      <div className="cus-modal-new-design">
        <div className="cus-modal-statment-modal">
          <div className="cus-modal-statemtn-design">
            <div className="generated-header">
              <div className="close-icon-cus" onClick={toggle}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h1>No. of generated invoices</h1>
            </div>
            <div className="generated-invoice-modal-body generated-invoice-modal-body-alignment-box">
              <div className="generated-invoice-table table-left-right-alignment">
                <table className="generated-invoice-table-design">
                  <tr>
                    <th align="left">Invoice #</th>
                    <th align="left">Customer name</th>
                    <th align="left">Products</th>
                    <th align="left">Services</th>
                    <th align="left">Amount</th>
                    <th align="center">Status</th>
                  </tr>
                  {currentInvoices.length > 0 &&
                    currentInvoices.map((invoice) => {
                      return (
                        <tr key={invoice._id}>
                          <td>
                            <span
                              className="number-text-color"
                              onClick={(e) => ViewInvoice(e, invoice)}
                            >
                              #{invoice.invoiceId}
                            </span>
                          </td>
                          <td>
                            {invoice.customer
                              ? invoice.customer.firstName +
                                " " +
                                invoice.customer.lastName
                              : "Walk-in"}
                          </td>
                          <td align="">
                            {invoice.products ? invoice.products.length : 0}
                          </td>
                          <td align="">
                            {invoice.serviceDetails
                              ? invoice.serviceDetails.length
                              : 0}
                          </td>
                          <td align="left">
                            <a className="dynamic-cureency-font-style">
                              {SettingInfo?.currentType}
                            </a>{" "}
                            {invoice.totalAmount}
                          </td>
                          <td align="right">
                            {!invoice?.isActive ? (
                              <div className="Past-Transactions-deleted-status">
                                <button>Deleted</button>
                              </div>
                            ) : invoice?.dueStatus === "Paid" ||
                              !invoice?.dueStatus ? (
                              <div className="Past-Transactions-paid-status">
                                <button>Paid</button>
                              </div>
                            ) : invoice?.dueStatus === "Part paid" ? (
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
                    })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
