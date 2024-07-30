import React, { useEffect } from "react";
import ReactToPrint from "react-to-print";
import "./planInvoice.scss";
import moment from "moment";
import { ApiGet } from "../../../../helpers/API/ApiData";
import { get_Setting } from "../../../../utils/user.util";
import BarberaLogo from "../../../../assets/svg/BarberaLogo.svg";

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
                  <td style={{ padding: "50px 0px 30px 0" }}>
                    <div className="invoice-title" align="left">
                      <h5>Invoice </h5>
                      <div className="right-side " align="left">
                        <div>
                          <p className="first-child-align">Invoice No.</p>
                          <span>{this.props.data?.paymentId}</span>
                        </div>
                        <div>
                          <p>Invoice Date.</p>
                          <span>
                            {moment(this.props.data?.paymentStartDate).format(
                              "DD MMM yyyy"
                            )}
                          </span>
                        </div>
                        <h4>ONYX CLOUD SOLUTIONS PVT LTD </h4>
                        <div>
                          <a className="first-child-align">
                            402, Western Business Park , Vesu , Surat-395007
                          </a>
                        </div>
                        <div>
                          <a className="first-child-align">
                            Contact :- +91 706 99 999 53
                          </a>
                        </div>
                        <div>
                          <a className="first-child-align">
                            GSTIN :- SDGDS45224DD4FD
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="parlour-details" align="right">
                      <img
                        style={{ width: "250px" }}
                        src={BarberaLogo}
                        alt="BarberaLogo"
                        align="right"
                      />
                    </div>
                  </td>
                </tr>
                <tr className="bottom-border" style={{ borderBottom: "none" }}>
                  <td style={{ padding: "30px 0px" }}>
                    <div className="align-items">
                      <div className="left-side">
                        <p style={{ fontWeight: "500" }}>Billed To.</p>
                        <div className="parlour-details" align="left">
                          <h4>{this.state.SaloonDetail?.businessName}</h4>
                          <p>
                            <span>{this.state.SaloonDetail?.address}</span>
                          </p>
                          <p>
                            <span>{this.state.SaloonDetail?.city}</span>
                          </p>
                          <p>
                            <span>
                              {this.state.SaloonDetail?.mobileNumber
                                ? `Contact :- ${this.state.SaloonDetail?.mobileNumber}`
                                : null}
                            </span>
                          </p>
                          {this.state.gstCharge ? (
                            <p>
                              {" "}
                              <span>GSTIN : {this.state.gstNumber}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="table-space-remove">
                    <table className="new-table-design">
                      <thead>
                        <tr>
                          <th align="center" width="10%">
                            #
                          </th>
                          <th align="center" width="60%">
                            DESCRIPTION
                          </th>
                          <th align="center" width="30%">
                            Price ({SettingInfo?.currentType})
                          </th>
                        </tr>
                      </thead>
                      <tr>
                        <td align="center" style={{ fontWeight: "400", fontSize: "16px" }}>{1}</td>
                        <td align="center" style={{ fontWeight: "400", fontSize: "16px" }}>BARBERA SUBSCRIPTION (PRO)</td>
                        <td align="center" style={{ fontWeight: "400", fontSize: "16px" }}>
                        <span style={{ fontFamily: "'Roboto', sans-serif" }}>{SettingInfo?.currentType}</span> {this.props?.data?.planBasePrice }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "0px 0px 50px 0px" }}>
                    <div className="final-bill">
                      <div>
                        <div className="alignment-text">
                          <div className="first-child" align="right">
                            <span>TOTAL PRE TAX</span>
                          </div>
                          <div className="sec-child" align="right">
                            <span>
                            <span style={{ fontFamily: "'Roboto', sans-serif" }}>{SettingInfo?.currentType}</span>{" "}
                              {this.props?.data?.planBasePrice}
                            </span>
                          </div>
                        </div>
                        <div className="alignment-text">
                          <div className="first-child" align="right">
                            <span>GST (18%) </span>
                          </div>
                          <div className="sec-child" align="right">
                            <span>
                            <span style={{ fontFamily: "'Roboto', sans-serif" }}>{SettingInfo?.currentType}</span>{" "}
                              {this.props?.data?.planGstAmount}
                            </span>
                          </div>
                        </div>
                        <div className="alignment-text">
                          <div className="first-child" align="right">
                            <span
                              style={{ fontWeight: "600", fontSize: "16px" }}
                            >
                              Total
                            </span>
                          </div>
                          <div className="sec-child" align="right">
                            <span
                              style={{ fontWeight: "600", fontSize: "16px" }}
                            >
                              <span style={{ fontFamily: "'Roboto', sans-serif" ,fontWeight: "500"}}> {SettingInfo?.currentType}</span>{" "}
                              {this.props?.data?.paymentAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "70px 0px 120px 0px" }}>
                    <div className="thanks-message">
                      <p>Subscription</p>

                      <span>
                        Billing Period :-{" "}
                        <a>
                          {" "}
                          {moment(this.props.data?.paymentStartDate).format(
                            "DD MMM yyyy"
                          )}{" "}
                          to{" "}
                          {moment(this.props.data?.paymentEndDate).format(
                            "DD MMM yyyy"
                          )}{" "}
                        </a>
                      </span>
                      <span>
                        Next Bill Date :-{" "}
                        <a>
                          {" "}
                          {moment(this.props.data?.paymentEndDate)
                            .add(1, "days")
                            .format("DD MMM yyyy")}{" "}
                        </a>
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="terms">
                      <ul>
                        <li>
                          <i>
                            Thanks for subscribing to Barbera, Keep invoicing!
                          </i>
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
