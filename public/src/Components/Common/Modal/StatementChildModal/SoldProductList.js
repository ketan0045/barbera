import React from "react";
import "./../Modal.scss";
import CloseIcon from "../../../../assets/svg/close-icon.svg";

export default function SoldProductList(props) {
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
              <h1>No. of products sold</h1>
            </div>
            <div className="generated-invoice-modal-body generated-invoice-modal-body-alignment-box">
              <div className="generated-invoice-table1 table-left-right-alignment">
                <table>
                  <tr>
                    <th align="left">Product name</th>
                    {SettingInfo?.inventory?.enableInventory &&
                      SettingInfo?.multipleStaff?.assignStaffForProduct && (
                        <th align="left">Staff assigned</th>
                      )}
                    <th align="center">Quantity</th>
                    <th align="center">Invoice #</th>
                    <th align="right">Amount</th>
                  </tr>
                  {currentInvoices.length > 0 &&
                    currentInvoices
                      .filter((item) => item.products?.length > 0)
                      .map((invoice) => {
                        return invoice.products.map((product) => {
                          return (
                            <tr key={product._id}>
                              <td>{product.productName}</td>
                             
                              {SettingInfo?.inventory?.enableInventory &&
                      SettingInfo?.multipleStaff?.assignStaffForProduct &&  <td>{product.staffName
                                  ? product.staffName
                                  : "No staff assigned"} </td>}
                             
                              <td align="center">{product.productCount}</td>
                              <td align="center">
                                <span
                                  className="number-text-color"
                                  onClick={(e) => ViewInvoice(e, invoice)}
                                >
                                  #{invoice.invoiceId}
                                </span>
                              </td>
                              <td align="right">
                                <a className="dynamic-cureency-font-style">
                                  {" "}
                                  {SettingInfo?.currentType}
                                </a>{" "}
                                {product?.flatdiscountedSubTotal}
                              </td>
                            </tr>
                          );
                        });
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
