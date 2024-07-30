import React, { useState, useEffect } from "react";
import "./customersStatement.scss";
import InvoiceIcon from "../../../assets/svg/mobile-view-invoice.svg";
import UpIcon from "../../../assets/svg/Up.svg";
import MobileViewChart from "../../../assets/svg/moble-chart.png";
import ChartChildIcon from "../../../assets/svg/round-vectore.svg";
import { Pie } from "react-chartjs-2";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import downIcon from "../../../assets/svg/down-red.svg";
import moment from "moment";
import UserIcon from "../../../assets/svg/feather_user.svg";
import WalletIcon from "../../../assets/svg/new-wallet.svg";
import RedWalletIcon from "../../../assets/svg/red-wallet.svg";
import StarIcon from "../../../assets/svg/star-back.svg";

import blueinvoiceIcon from "../../../assets/svg/blueinvoice.svg";
export default function CustomersStatement(props) {
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [showSales, setShowSales] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const {
    availableBalance,
    SettingInfo,
    OpenWalletListHander,
    walletTopup,
    collectionData,
    averageRating,
    walkincustomer,
    newGeneratedCustomer,
    invoiceNo,
    previousDue,
    walletWithdraw,
    ViewInvoice,
    averageRatingData,
    newcustomer,
    returncustomer,
    permission,
    lastinvoiceNo,
    today,
    startDate,
    temEndDate,
    currentType
  } = props;

  useEffect(() => {
    if ((walkincustomer + returncustomer + newcustomer) != 0 && lastinvoiceNo != 0) {
      setPercentage(((walkincustomer + returncustomer + newcustomer) * 100) / lastinvoiceNo - 100);
    }
    if ((walkincustomer + returncustomer + newcustomer) == 0 && lastinvoiceNo != 0) {
      setPercentage(-(lastinvoiceNo * 100));
    }
    if ((walkincustomer + returncustomer + newcustomer) != 0 && lastinvoiceNo == 0) {
      setPercentage((walkincustomer + returncustomer + newcustomer) * 100);
    }
    if ((walkincustomer + returncustomer + newcustomer) == 0 && lastinvoiceNo == 0) {
      setPercentage(0);
    }
  }, [walkincustomer , returncustomer , newcustomer, lastinvoiceNo]);

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

  const walkincustomerData = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#D1D9E6", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#D1D9E6", "#0B84A5"],
        data: [returncustomer, newcustomer, walkincustomer],
      },
    ],
  };

  const newcustomerData = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#F4BD6E", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#F4BD6E", "#D1D9E6"],
        data: [returncustomer, newcustomer, walkincustomer],
      },
    ],
  };

  const returncustomerData = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#D1D9E6", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#D1D9E6", "#D1D9E6"],
        data: [returncustomer, newcustomer, walkincustomer],
      },
    ],
  };

  const totalSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        data: [returncustomer, newcustomer, walkincustomer],
      },
    ],
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: "20vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="customers-statement-content-alignment"
      >
        <div className="heading-title">
          <h2>Customers</h2>
        </div>
        <div className="full-width-box-alignment">
          {permission.includes("Available wallet balance") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design blue-opacity-background"> 
                  <img src={WalletIcon} alt="WalletIcon" />
                  </div>
                </div>
                <div className="grid-items">
                  <p>Available wallet balance</p>
                  <h4>
                    <a>{currentType}</a> {Math.abs(availableBalance)}
                  </h4>
                </div>
              </div>
            </div>
          )}
          {permission.includes("Wallet top-ups") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design blue-opacity-background">
                  <img src={WalletIcon} alt="WalletIcon" />
                  </div>
                </div>
                <div className="grid-items">
                  <p>Wallet topups</p>
                  <h4>
                    <a>{currentType}</a> {walletTopup}
                  </h4>
                </div>
              </div>
            </div>
          )}
          {permission.includes("Wallet redeemed") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design blue-opacity-background">
                  <img src={blueinvoiceIcon} alt="blueinvoiceIcon" />
                  </div>
                </div>
                <div className="grid-items">
                  <p>Wallet redeemed</p>
                  <h4>
                    <a>{currentType}</a>{" "}
                    {collectionData?.serviceCount?.filter(
                      (service) => service?.method === "Wallet"
                    )[0]?.amount || 0}
                  </h4>
                </div>
              </div>
            </div>
          )}
          {permission.includes("Wallet Withdrawals") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design red-opacity-background">
                  <img src={RedWalletIcon} alt="RedWalletIcon" />
                  </div>
                </div>
                <div className="grid-items">
                  <p>Wallet withdrawals</p>
                  <h4>
                    <a>{currentType}</a> {walletWithdraw}
                  </h4>
                </div>
              </div>
            </div>
          )}
          {permission.includes("Previous due paid") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design blue-opacity-background">
                  <span><a>₹</a> </span>
                  </div>
                </div>
                <div className="grid-items">
                  <p>Previous due paid</p>
                  <h4>
                    <a>{currentType}</a> {previousDue}
                  </h4>
                </div>
              </div>
            </div>
          )}
          {permission.includes("Customer reviews") && (
            <div className="full-width-box">
              <div className="grid">
                <div className="grid-items">
                  <div className="icon-design">
                  <img src={StarIcon} alt="StarIcon " />
                  </div>
                </div>
                <div className="grid-items">
                  <p>Customer ratings</p>
                  <h4>   {averageRating - Math.floor(averageRating) !== 0
                        ? Math.abs(averageRating) ?.toFixed(2)
                        : Math.abs(averageRating) || 0}/5</h4>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sales-first-box">
          {permission.includes("Custmomer visits") && (
            <>
              <div className="icon-text-grid">
                <div className="icon-text-grid-items">
                  <div className="icon-design-alignment blue-opacity-background">
                  <img src={UserIcon} alt="UserIcon" />
                  </div>
                </div>
                <div className="icon-text-grid-items">
                  <h5>Customer visits</h5>
                  <p>{walkincustomer + returncustomer + newcustomer}</p>
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
                            <p>Visits last {today}</p>
                          </div>
                          <div>
                            <h2>{lastinvoiceNo} </h2>
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
                    {walkincustomer === 0  &&
                    returncustomer === 0  &&
                    newcustomer === 0 
                    ? (
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
                          {" "}
                          {returncustomer === 0 || null ? (
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
                              data={returncustomerData}
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
                        <p>Returning</p>
                        <h5>{returncustomer || 0}</h5>
                      </div>
                    </div>
                    <div className="box-design">
                      <div className="box-design-items">
                        <div className="box-icon-alignment">
                          {newcustomer === 0 || null ? (
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
                              data={newcustomerData}
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
                        <p>New </p>
                        <h5>{newcustomer || 0}</h5>
                      </div>
                    </div>
                    <div className="box-design">
                      <div className="box-design-items">
                        <div className="box-icon-alignment">
                          {" "}
                          {walkincustomer === 0 || null ? (
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
                              data={walkincustomerData}
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
                        <p>Walk-ins</p>
                        <h5>{walkincustomer || 0}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {permission.includes("Number of customers added to the system") && (
            <div className="number-of-inoice-alignment">
              <span>Number of customers added to the system</span>
              <h6> {newGeneratedCustomer}</h6>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
