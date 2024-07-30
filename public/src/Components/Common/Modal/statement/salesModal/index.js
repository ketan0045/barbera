import React, { useEffect, useState } from "react";
import "./salesModal.scss";
import DownIcon from "../../../../../assets/svg/blue-down.svg";
import SalesIcon from "../../../../../assets/svg/totla-sale-icon.svg";
import UpIcon from "../../../../../assets/svg/up-blue.svg";
import downIcon from "../../../../../assets/svg/down-red.svg";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import SoldIcon from "../../../../../assets/svg/sold.png";
import DueStatementIcon from "../../../../../assets/svg/Icon.png";

import { Pie } from "react-chartjs-2";
import RightIcon from "../../../../../assets/svg/rigt-gray.svg";
import moment from "moment";
export default function SalesModal(props) {
  const {
    salesData,
    SettingInfo,
    invoiceNo,
    offerData,
    dueAmountTotal,
    dueCount,
    soldProductListToggle,
    generatedInvoiceListToggle,
    lastsalesData,
    today,
    temEndDate,
    startDate,
  } = props;
  const [dropdown, setDropdown] = useState(true);
  const [showSales, setShowSales] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (
      +salesData?.products + +salesData?.service + +salesData?.memberShip !=
        0 &&
      +lastsalesData?.products +
        +lastsalesData?.service +
        +lastsalesData?.memberShip !=
        0
    ) {
      setPercentage(
        ((+salesData?.products + +salesData?.service + +salesData?.memberShip) *
          100) /
          (+lastsalesData?.products +
            +lastsalesData?.service +
            +lastsalesData?.memberShip) -
          100
      );
    }
    if (
      +salesData?.products + +salesData?.service + +salesData?.memberShip ==
        0 &&
      +lastsalesData?.products +
        +lastsalesData?.service +
        +lastsalesData?.memberShip !=
        0
    ) {
      setPercentage(
        -(
          +lastsalesData?.products +
          +lastsalesData?.service +
          +lastsalesData?.memberShip
        )
      );
    }
    if (
      +salesData?.products + +salesData?.service + +salesData?.memberShip !=
        0 &&
      +lastsalesData?.products +
        +lastsalesData?.service +
        +lastsalesData?.memberShip ==
        0
    ) {
      setPercentage(
        +salesData?.products + +salesData?.service + +salesData?.memberShip
      );
    }
    if (
      +salesData?.products + +salesData?.service + +salesData?.memberShip ==
        0 &&
      +lastsalesData?.products +
        +lastsalesData?.service +
        +lastsalesData?.memberShip ==
        0
    ) {
      setPercentage(0);
    }
  }, [salesData, lastsalesData]);

  const totalSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        data: [
          salesData.service
            ? (salesData?.service).toFixed(2)
            : salesData.service,
          salesData?.products
            ? (salesData?.products).toFixed(2)
            : salesData?.products,
          salesData?.memberShip
            ? (salesData?.memberShip).toFixed(2)
            : salesData?.memberShip,
        ],
      },
    ],
  };

  const nullTotalSales = {
    labels: ["No data found"],
    datasets: [
      {
        backgroundColor: ["#F6FBFF"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#F6FBFF"],
        data: [1],
      },
    ],
  };

  const nullSales = {
    labels: ["No data found"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6"],
        data: [1],
      },
    ],
  };

  const serviceSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#D1D9E6", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#D1D9E6", "#D1D9E6"],
        data: [salesData?.service, salesData?.products, salesData?.memberships],
      },
    ],
  };

  const productSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#F4BD6E", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#F4BD6E", "#D1D9E6"],
        data: [salesData?.service, salesData?.products, salesData?.memberships],
      },
    ],
  };

  const membershipSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#D1D9E6", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#D1D9E6", "#0B84A5"],
        data: [salesData?.service, salesData?.products, salesData?.memberShip],
      },
    ],
  };

  return (
    <>
      <div>
        <div className="sales-box-detials-alignment">
          <div className="whtite-box">
            <div className="box-header-alignment">
              <p>Sales</p>
              <div onClick={() => setDropdown(!dropdown)}>
                <img
                  className={
                    dropdown
                      ? "new-icon-rotate-css transition-icon"
                      : "transition-icon"
                  }
                  src={DownIcon}
                  alt="DownIcon"
                />
              </div>
            </div>
            <div
              className={
                dropdown
                  ? "box-body-content-alignment box-body-content-show"
                  : "box-body-content-alignment box-body-content-hidden"
              }
            >
              <div className="grid">
                <div className="grid-items">
                  <div className="grid-header">
                    <div className="grid-header-items">
                      <div className="icon-center-alignment-box green-opacity-background ">
                        <img src={SalesIcon} alt="SalesIcon" />
                      </div>
                    </div>
                    <div className="grid-header-items">
                      <p>Total Sales</p>
                      <h4>
                        <a>{SettingInfo?.currentType}</a>{" "}
                        {Math.round(+salesData?.products) +
                          Math.round(+salesData?.service) +
                          Math.round(+salesData?.memberShip)}
                      </h4>
                    </div>
                    <div
                      className="grid-header-items"
                      onMouseEnter={() => setShowSales(true)}
                      onMouseLeave={() => setShowSales(false)}
                    >
                      {moment(startDate).add(1, "day").format("L") ==
                        moment(temEndDate).format("L") && (
                        <>
                          {" "}
                          <button
                            style={{
                              color: percentage < 0 ? "#E66666" : "#46BFBD",
                              background:
                                percentage < 0 ? "#FDF0F0" : "#EDF9F9",
                              border:
                                percentage < 0
                                  ? "1px solid #F2ABAB"
                                  : "1px solid #A3DFDE",
                            }}
                          >
                            <img
                              src={percentage < 0 ? downIcon : UpIcon}
                              alt="UpIcon"
                            />
                            <span>
                              {percentage - Math.floor(percentage) !== 0
                                ? Math.abs(percentage)?.toFixed(0)
                                : Math.abs(percentage)}
                              %
                            </span>
                          </button>
                          {showSales && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.7 }}
                              className="generate-invoice-tooltip1"
                            >
                              <div className="sale-modal-tooltip-alignment">
                                <div className="content-alignment">
                                  <div>
                                    <p>Sales last {today}</p>
                                  </div>
                                  <div>
                                    <h2>
                                      <span>{SettingInfo?.currentType}</span>{" "}
                                      {Math.round(+lastsalesData?.products) +
                                        Math.round(+lastsalesData?.service) +
                                        Math.round(
                                          +lastsalesData?.memberShip
                                        )}{" "}
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid-body-alignment">
                    <div className="new-chart-grid">
                      <div className="new-chart-grid-items">
                        {/* <img src={PieChart} alt="PieChart" /> */}
                        {(salesData?.products === 0 || null) &&
                        (salesData?.service === 0 || null) &&
                        (salesData?.memberShip === 0 || null) ? (
                          <Pie
                            data={nullTotalSales}
                            width={100}
                            height={100}
                            options={{
                              legend: { display: false },
                              tooltips: { enabled: false },
                            }}
                          />
                        ) : (
                          <Pie
                            data={totalSales}
                            width={100}
                            height={100}
                            options={{
                              title: { display: false },
                              legend: { display: false },
                            }}
                          />
                        )}
                      </div>
                      <div className="new-chart-grid-items">
                        <div className="chart-sub-box-alignment">
                          {salesData?.service === 0 || null || NaN ? null : (
                            <div className="chart-sub-box">
                              <div className="chrt-icon-grid">
                                <div className="chrt-icon-grid-items">
                                  {salesData?.service === 0 || null ? (
                                    <Pie
                                      data={nullSales}
                                      width={100}
                                      height={100}
                                      options={{
                                        legend: { display: false },
                                        tooltips: { enabled: false },
                                      }}
                                    />
                                  ) : (
                                    <Pie
                                      data={serviceSales}
                                      width={100}
                                      height={100}
                                      options={{
                                        title: { display: false },
                                        legend: { display: false },
                                        tooltips: { enabled: false },
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="chrt-icon-grid-items">
                                  <p>Services</p>
                                  <h4>
                                    <span>{SettingInfo?.currentType}</span>{" "}
                                    {Math.round(salesData?.service)}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          )}
                          {salesData?.products === 0 || null || NaN ? null : (
                            <div className="chart-sub-box">
                              <div className="chrt-icon-grid">
                                <div className="chrt-icon-grid-items">
                                  {salesData?.products === 0 || null ? (
                                    <Pie
                                      data={nullSales}
                                      width={100}
                                      height={100}
                                      options={{
                                        legend: { display: false },
                                        tooltips: { enabled: false },
                                      }}
                                    />
                                  ) : (
                                    <Pie
                                      data={productSales}
                                      width={100}
                                      height={100}
                                      options={{
                                        title: { display: false },
                                        legend: { display: false },
                                        tooltips: { enabled: false },
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="chrt-icon-grid-items">
                                  <p>Products</p>
                                  <h4>
                                    <span>{SettingInfo?.currentType}</span>{" "}
                                    {Math.round(salesData?.products)}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          )}
                          {salesData?.memberShip === 0 || null || NaN ? null : (
                            <div className="chart-sub-box">
                              <div className="chrt-icon-grid">
                                <div className="chrt-icon-grid-items">
                                  {salesData?.memberShip === 0 || null ? (
                                    <Pie
                                      data={nullSales}
                                      width={100}
                                      height={100}
                                      options={{
                                        legend: { display: false },
                                        tooltips: { enabled: false },
                                      }}
                                    />
                                  ) : (
                                    <Pie
                                      data={membershipSales}
                                      width={100}
                                      height={100}
                                      options={{
                                        title: { display: false },
                                        legend: { display: false },
                                        tooltips: { enabled: false },
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="chrt-icon-grid-items">
                                  <p>Memberships</p>
                                  <h4>
                                    <span>{SettingInfo?.currentType}</span>{" "}
                                    {Math.round(salesData?.memberShip)}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid-footer-alignment">
                    <div>
                      <p>No. of generated invoices</p>
                      <h5>{invoiceNo || 0}</h5>
                    </div>
                    <div>
                      <img
                        src={RightIcon}
                        alt="RightIcon"
                        style={{ padding: "5px", cursor: "pointer" }}
                        onClick={() => generatedInvoiceListToggle()}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-items">
                  <div className="grid-header">
                    <div className="grid-header-items">
                      <div className="icon-center-alignment-box yellow-opacity-background">
                        <img src={SoldIcon} alt="SoldIcon" />
                      </div>
                    </div>
                    <div className="grid-header-items">
                      <p>No. of products sold</p>
                      <h4>{offerData?.product || 0}</h4>
                    </div>
                    <div className="grid-header-items">
                      <img
                        src={RightIcon}
                        alt="RightIcon"
                        style={{ padding: "5px", cursor: "pointer" }}
                        onClick={() => soldProductListToggle()}
                      />
                    </div>
                  </div>
                  <div className="grid-header grid-header-average-top-alignment">
                    <div className="grid-header-items">
                      <div className="icon-center-alignment-box green-opacity-background ">
                        <img src={SalesIcon} alt="SalesIcon" />
                      </div>
                    </div>
                    <div className="grid-header-items">
                      <p>Average ticket size</p>
                      <h4>
                        <a>{SettingInfo?.currentType}</a>{" "}
                        {invoiceNo
                          ? (
                              (+salesData?.products +
                                +salesData?.service +
                                +salesData?.memberShip) /
                              (invoiceNo || 0)
                            ).toFixed(2)
                          : 0}
                      </h4>
                    </div>
                    <div className="grid-header-items">
                      {/* <img src={RightIcon} alt="RightIcon" /> */}
                    </div>
                  </div>
                  <div className="all-type-chart-two-col-grid">
                    <div className="all-type-chart-two-col-grid-items">
                      <div className="type-grid">
                        <div className="type-grid-items blue-opacity-background">
                          <span>%</span>
                        </div>
                        <div className="type-grid-items">
                          <div>
                            <p>Discount offfered</p>
                            <h6>
                              <a>{SettingInfo?.currentType}</a>{" "}
                              {offerData?.discountOffer || 0}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="all-type-chart-two-col-grid-items">
                      <div className="type-grid">
                        <div className="type-grid-items  blue-opacity-background ">
                          <span style={{ fontSize: 15 }}>TAX</span>
                        </div>
                        <div className="type-grid-items">
                          <div>
                            <p>Tax</p>
                            <h6>
                              <a>{SettingInfo?.currentType}</a>{" "}
                              {offerData?.tax || 0}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="all-type-chart-two-col-grid-items">
                      <div className="type-grid">
                        <div className="type-grid-items due-opacity-background">
                          <span>
                            <a>₹</a>{" "}
                          </span>
                        </div>
                        <div className="type-grid-items">
                          <div>
                            <p>Due amount</p>
                            <h6>
                              <a>{SettingInfo?.currentType}</a>{" "}
                              {dueAmountTotal || 0}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="all-type-chart-two-col-grid-items">
                      <div className="type-grid">
                        <div className="type-grid-items due-opacity-background">
                          <img src={DueStatementIcon} alt="DueStatementIcon" />
                        </div>
                        <div className="type-grid-items">
                          <div>
                            <p>Due invoices</p>
                            <h6>{dueCount || 0}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
