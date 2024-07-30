import React, { useState, useEffect } from "react";
import "./mobileSalesStatement.scss";
import InvoiceIcon from "../../../assets/svg/mobile-view-invoice.svg";
import UpIcon from "../../../assets/svg/Up.svg";
import MobileViewChart from "../../../assets/svg/moble-chart.png";
import ChartChildIcon from "../../../assets/svg/round-vectore.svg";
import { Pie } from "react-chartjs-2";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import downIcon from "../../../assets/svg/down-red.svg";
import SoldIcon from "../../../assets/svg/sold.png";
import DueStatementIcon from "../../../assets/svg/Icon.png";

export default function MobileSalesStatement(props) {
  const {
    salesData,
    invoiceNo,
    offerData,
    dueAmountTotal,
    dueCount,
    soldProductListToggle,
    generatedInvoiceListToggle,
    permission,
    lastsalesData,
    today,
    temEndDate,
    startDate,
    currentType,
  } = props;
  const [showSales, setShowSales] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (
      +salesData?.memberShip + +salesData?.products + +salesData?.service !=
        0 &&
      +lastsalesData?.memberShip +
        +lastsalesData?.products +
        +lastsalesData?.service !=
        0
    ) {
      setPercentage(
        ((+salesData?.memberShip + +salesData?.products + +salesData?.service) *
          100) /
          (+lastsalesData?.memberShip +
            +lastsalesData?.products +
            +lastsalesData?.service) -
          100
      );
    }
    if (
      +salesData?.memberShip + +salesData?.products + +salesData?.service ==
        0 &&
      +lastsalesData?.memberShip +
        +lastsalesData?.products +
        +lastsalesData?.service !=
        0
    ) {
      setPercentage(
        -(
          +lastsalesData?.memberShip +
          +lastsalesData?.products +
          +lastsalesData?.service
        )
      );
    }
    if (
      +salesData?.memberShip + +salesData?.products + +salesData?.service !=
        0 &&
      +lastsalesData?.memberShip +
        +lastsalesData?.products +
        +lastsalesData?.service ==
        0
    ) {
      setPercentage(
        +salesData?.memberShip + +salesData?.products + +salesData?.service
      );
    }
    if (
      +salesData?.memberShip + +salesData?.products + +salesData?.service ==
        0 &&
      +lastsalesData?.memberShip +
        +lastsalesData?.products +
        +lastsalesData?.service ==
        0
    ) {
      setPercentage(0);
    }
  }, [lastsalesData]);

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
        backgroundColor: ["#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6"],
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
        data: [salesData?.service, salesData?.products, salesData?.memberShip],
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
        data: [salesData?.service, salesData?.products, salesData?.memberShip],
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
      <motion.div
        initial={{ opacity: 0, x: "20vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mobile-view-sale-statement-content-alignment"
      >
        <div className="heading-title">
          <h2>Sales</h2>
        </div>
        <div className="sales-first-box">
          {permission.includes("Total sales") && (
            <>
              <div className="icon-text-grid">
                <div className="icon-text-grid-items">
                  <div className="icon-design-alignment">
                    <img src={InvoiceIcon} alt="InvoiceIcon" />
                  </div>
                </div>
                <div className="icon-text-grid-items">
                  <h5>Total Sales</h5>
                  <p>
                    <a>{currentType}</a>{" "}
                    {Math.round(+salesData?.products) +
                      Math.round(+salesData?.service) +
                      Math.round(+salesData?.memberShip)}
                  </p>
                </div>
                <div
                  className="icon-text-grid-items"
                  onClick={() => setShowSales(!showSales)}
                >
                  <button
                    style={{
                      color: percentage < 0 ? "#E66666" : "#46BFBD",
                      background: percentage < 0 ? "#FDF0F0" : "#EDF9F9",
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
                              <span>{currentType}</span>{" "}
                              {Math.round(+lastsalesData?.products) +
                                Math.round(+lastsalesData?.service) +
                                Math.round(+lastsalesData?.memberShip)}{" "}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="first-box-chart-grid">
                <div className="first-box-chart-grid-items">
                  <div className="chart-alignment">
                    {(salesData?.products === 0 || null || NaN) &&
                    (salesData?.service === 0 || null || NaN) &&
                    (salesData?.memberShip === 0 || null || NaN) ? (
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
                </div>
                <div className="first-box-chart-grid-items">
                  <div className="all-box-alignment">
                    <div className="box-design">
                      <div className="box-design-items">
                        <div className="box-icon-alignment">
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
                      </div>
                      <div className="box-design-items">
                        <p>Service</p>
                        <h5>
                          <a>{currentType}</a> {Math.round(salesData?.service)}
                        </h5>
                      </div>
                    </div>
                    <div className="box-design">
                      <div className="box-design-items">
                        <div className="box-icon-alignment">
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
                      </div>
                      <div className="box-design-items">
                        <p>Products</p>
                        <h5>
                          <a>{currentType}</a> {Math.round(salesData?.products)}
                        </h5>
                      </div>
                    </div>
                    <div className="box-design">
                      <div className="box-design-items">
                        <div className="box-icon-alignment">
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
                      </div>
                      <div className="box-design-items">
                        <p>Membership</p>
                        <h5>
                          <a>{currentType}</a> {+salesData?.memberShip}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {permission.includes("Number of generated invoices") && (
            <div className="number-of-inoice-alignment">
              <span>Number of invoices generated</span>
              <h6>{invoiceNo || 0}</h6>
            </div>
          )}
        </div>
        <div className="full-width-box-alignment">
          {permission.includes("Number of products sold") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design yellow-opacity-background ">
                    <img src={SoldIcon} alt="SoldIcon" />
                  </div>
                </div>
                <div className="grid-items">
                  <p>Number of products sold</p>
                  <h4>{offerData?.product || 0}</h4>
                </div>
              </div>
            </div>
          )}
          {permission.includes("Average ticket size") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design green-opacity-background ">
                    <img src={InvoiceIcon} alt="InvoiceIcon" />
                  </div>
                </div>
                <div className="grid-items">
                  <p>Average ticket size</p>
                  <h4>
                    {" "}
                    <a>{currentType} </a>
                    {invoiceNo
                      ? (
                          (+salesData?.memberShip +
                            +salesData?.products +
                            +salesData?.service) /
                          (invoiceNo || 0)
                        ).toFixed(2)
                      : 0}{" "}
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="all-child-box-chart-alignment">
          <div className="grid">
            {permission.includes("Discount offered & Tax") && (
              <>
                <div className="grid-items">
                  <div className="sub-grid">
                    <div className="sub-grid-items">
                      <div className="sub-icon-design blue-opacity-background">
                        <span>%</span>
                      </div>
                    </div>
                    <div className="sub-grid-items">
                      <p>Discount </p>
                      <h6>
                        <a>{currentType} </a>
                        {offerData?.discountOffer || 0}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="grid-items">
                  <div className="sub-grid">
                    <div className="sub-grid-items">
                      <div className="sub-icon-design blue-opacity-background">
                        {" "}
                        <span style={{ fontSize: "16px" }}>TAX</span>
                      </div>
                    </div>
                    <div className="sub-grid-items">
                      <p>Tax</p>
                      <h6>
                        <a>{currentType} </a>
                        {offerData?.tax || 0}
                      </h6>
                    </div>
                  </div>
                </div>
              </>
            )}
            {permission.includes("Total sales") && (
              <>
                <div className="grid-items">
                  <div className="sub-grid">
                    <div className="sub-grid-items">
                      <div className="sub-icon-design due-opacity-background">
                        <span>₹</span>
                      </div>
                    </div>
                    <div className="sub-grid-items">
                      <p>Due amount</p>
                      <h6>
                        <a>{currentType} </a>
                        {dueAmountTotal || 0}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="grid-items">
                  <div className="sub-grid">
                    <div className="sub-grid-items">
                      <div className="sub-icon-design yellow-opacity-background">
                        <img src={DueStatementIcon} alt="DueStatementIcon" />
                      </div>
                    </div>
                    <div className="sub-grid-items">
                      <p>Due invoices</p>
                      <h6>{dueCount || 0}</h6>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
