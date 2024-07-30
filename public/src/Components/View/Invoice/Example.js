import React, { useEffect } from "react";
import ReactToPrint from "react-to-print";
import "./Example.scss";
import moment from "moment";
import { ApiGet } from "../../../helpers/API/ApiData";
import { get_Setting } from "../../../utils/user.util";

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

class ComponentToPrint extends React.Component {
  constructor() {
    super();
    this.state = {
      SaloonDetail: null,
      serviceTax: null,
      productTax: null,
      gstCharge: null,
      gstNumber: null,
    };
  }
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    ApiGet("account/company/companyData/" + userInfo.companyId)
      .then((resp) => {
        this?.setState({ SaloonDetail: resp?.data?.data[0] });
      })
      .catch((er) => {
        alert(er);
      });
    const SettingData = get_Setting();
    this?.setState({ serviceTax: SettingData?.tax?.serviceTax });
    this?.setState({ productTax: SettingData?.tax?.productTax });
    this?.setState({ gstCharge: SettingData?.tax?.gstCharge });
    this?.setState({ gstNumber: SettingData?.tax?.gstNumber });
    // ApiGet("setting/company/" + userInfo.companyId)
    //   .then((res) => {
    //     this.setState({ serviceTax: res?.data?.data[0]?.tax?.serviceTax });
    //     this.setState({ productTax: res?.data?.data[0]?.tax?.productTax });
    //     this.setState({ gstCharge: res?.data?.data[0]?.tax?.gstCharge });
    //     this.setState({ gstNumber: res?.data?.data[0]?.tax?.gstNumber });
    //   })
    //   .catch((er) => {
    //     alert(er);
    //   });
  }

  render() {
    let SettingInfo = get_Setting();
  
    return (
      <div className="print-table-design">
        <table
          className="table-spacing"
          cellpadding="0"
          cellspacing="0"
          width="100%"
        >
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
                      {this.state.gstCharge ? (
                        <p>GSTIN : {this.state.gstNumber}</p>
                      ) : null}
                    </div>
                  </td>
                </tr>
                <tr className="bottom-border" style={{ borderBottom: "none" }}>
                  <td>
                    <div className="align-items">
                      <div className="left-side">
                        <p style={{ fontWeight: "600" }}>Bill To</p>
                        <p>
                          {this.props.data?.customer?.firstName
                            ? this.props.data?.customer?.firstName
                            : "Walk-in Customer"}{" "}
                          {this.props.data?.customer?.lastName
                            ? this.props.data?.customer?.lastName
                            : ""}
                        </p>
                        <p>{this.props.data?.customer?.mobileNumber}</p>
                      </div>
                      <div className="right-side" align="right">
                        <div>
                          <p className="first-child-align">Invoice No.</p>
                          <span>
                            {" "}
                            {"  "} {this.props.data?.invoiceId}
                          </span>
                        </div>
                        <div>
                          <p>Invoice Date.</p>
                          <span>
                            {moment(this.props.data?.created).format(
                              "DD/MM/yyyy"
                            )}
                          </span>
                        </div>
                        <div>
                          <p> Invoice Time.</p>
                          <span>
                            {moment(this.props.data?.created).format("LTS")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                {this.props.data?.serviceDetails?.length > 0 ? (
                  <>
                    <tr>
                      <td>
                        <p
                          className="service-text"
                          style={{ padding: "1rem 0 0 0" }}
                        >
                          Services
                        </p>
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
                              {this.state.serviceTax ? (
                                <th align="center" width="8%">
                                  GST(%)
                                </th>
                              ) : null}
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
                                    {+item.servicediscount?.toFixed(2) +
                                      +item.membershipDiscount?.toFixed(2)}
                                  </td>
                                  <td align="center">
                                    {item.serviceflatdiscountedprice?.toFixed(
                                      2
                                    )}
                                  </td>
                                  {this.state.serviceTax ? (
                                    <td align="center">{item.servicegst}</td>
                                  ) : null}
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
                        <p
                          className="service-text"
                          style={{ padding: "1rem 0 0 0" }}
                        >
                          Products
                        </p>
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
                              {this.state.productTax ? (
                                <th align="center" width="7%">
                                  GST(%)
                                </th>
                              ) : null}
                              <th align="center" width="11%">
                                Net Price
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
                                  {this.state.productTax ? (
                                    <td align="center">{item.productgst}</td>
                                  ) : null}
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

                {this.props.data?.membershipDetails?.length > 0 ? (
                  <>
                    <tr>
                      <td>
                        <p
                          className="service-text"
                          style={{ padding: "1rem 0 0 0" }}
                        >
                          Membership
                        </p>
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
                                Membership Name
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
                              {this.state.serviceTax ? (
                                <th align="center" width="8%">
                                  GST(%)
                                </th>
                              ) : null}
                              <th align="center" width="11.5%">
                                Net Price
                              </th>
                            </tr>
                          </thead>

                          {this.props.data?.membershipDetails.map((item, i) => {
                            return (
                              <>
                                <tr key={item._id}>
                                  <td align="center">{i + 1}</td>
                                  <td>{item?.membershipName}</td>
                                  <td align="center">{item?.price}</td>
                                  <td align="center">
                                    {item?.membershipDiscount}
                                  </td>
                                  <td align="center">
                                    {item.flatdiscountedPrice?.toFixed(2)}
                                  </td>
                                  {this.state?.gstCharge ? (
                                    <td align="center">{item.gstPercentage}</td>
                                  ) : null}
                                  <td align="center">
                                    {this.state?.gstCharge
                                      ? parseFloat(
                                          (
                                            item.flatdiscountedPrice +
                                            parseInt(item?.gst)
                                          ).toFixed(2),
                                          10
                                        )
                                      : item.flatdiscountedPrice?.toFixed(2)}
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
                            <span> {this?.props?.data?.grossTotal}</span>
                          </div>
                        </div>
                        <div className="alignment-text">
                          <div className="first-child">
                            <span>Discount ({SettingInfo?.currentType}) </span>
                          </div>
                          <div className="sec-child" align="right">
                            <span>
                              {this?.props?.data?.totalDiscount?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="alignment-text">
                          <div className="first-child">
                            <span>Discounted Price</span>
                          </div>
                          <div className="sec-child" align="right">
                            <span>
                              {this?.props?.data?.discountedPrice?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {this?.state?.gstCharge ? (
                          <div className="alignment-text">
                            <div className="first-child">
                              <span>GST ({SettingInfo?.currentType}) </span>
                            </div>
                            <div className="sec-child" align="right">
                              <span>
                                {this?.props?.data?.GST?.gstAmount?.toFixed(2)}
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
                              {this?.props?.data?.totalAmount}{" "}
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
                      {this.props.data?.dueAmountRecord ? (
                        <span>
                          {SettingInfo?.currentType}{" "}
                          {this.props.data?.dueAmountRecord} due amount has been
                          recorded to this invoice
                        </span>
                      ) : null}
                      {this.props.data?.balanceAmountRecord ? (
                        <span>
                          {SettingInfo?.currentType}{" "}
                          {this.props.data?.balanceAmountRecord} advance amount
                          has been added to your wallet
                        </span>
                      ) : null}
                      <span>
                        Paid by{" "}
                        {this.props.data?.paymentMethod === "Split"
                          ? "multiple payment modes"
                          : this.props.data?.paymentMethod}
                      </span>
                      <span>
                        {" "}
                        <i>Thanks for your visit</i>{" "}
                      </span>
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
      </div>
    );
  }
}

export default ComponentToPrint;
