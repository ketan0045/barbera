import React, { useEffect, useState } from "react";
import DownIcon from "../../../../../assets/svg/blue-down.svg";
import SalesIcon from "../../../../../assets/svg/totla-sale-icon.svg";
import UpIcon from "../../../../../assets/svg/up-blue.svg";
import PieChart from "../../../../../assets/svg/newPieChart.svg";
import RightIcon from "../../../../../assets/svg/rigt-gray.svg";
import "./customersStatement.scss";
import { Pie } from "react-chartjs-2";
import ViewRating from "./viewRating";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import downIcon from "../../../../../assets/svg/down-red.svg";
import moment from "moment";
import UserIcon from "../../../../../assets/svg/feather_user.svg";
import WalletIcon from "../../../../../assets/svg/new-wallet.svg";
import RedWalletIcon from "../../../../../assets/svg/red-wallet.svg";
import StarIcon from "../../../../../assets/svg/star-back.svg";

import blueinvoiceIcon from "../../../../../assets/svg/blueinvoice.svg";

export default function CustomersStatement(props) {
  const [dropdown, setDropdown] = useState(true);
  const [showSales, setShowSales] = useState(false);
  const [openRatingModal, setOpenRatingModal] = useState(false);
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
    previousDue,
    walletWithdraw,
    ViewInvoice,
    averageRatingData,
    newcustomer,
    returncustomer,
    lastinvoiceNo,
    today,
    startDate,
    temEndDate,
  } = props;

  useEffect(() => {
    if (
      walkincustomer + returncustomer + newcustomer != 0 &&
      lastinvoiceNo != 0
    ) {
      setPercentage(
        ((walkincustomer + returncustomer + newcustomer) * 100) /
          lastinvoiceNo -
          100
      );
    }
    if (
      walkincustomer + returncustomer + newcustomer == 0 &&
      lastinvoiceNo != 0
    ) {
      setPercentage(-(lastinvoiceNo * 100));
    }
    if (
      walkincustomer + returncustomer + newcustomer != 0 &&
      lastinvoiceNo == 0
    ) {
      setPercentage((walkincustomer + returncustomer + newcustomer) * 100);
    }
    if (
      walkincustomer + returncustomer + newcustomer == 0 &&
      lastinvoiceNo == 0
    ) {
      setPercentage(0);
    }
  }, [walkincustomer, returncustomer, newcustomer, lastinvoiceNo]);

  const nullSales = {
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
      <div className="customers-statement-section-alignment">
        <div className="whtite-box">
          <div className="box-header-alignment">
            <p>Customers</p>
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
                    <div className="icon-center-alignment-box blue-opacity-background">
                      <img src={WalletIcon} alt="WalletIcon" />
                    </div>
                  </div>
                  <div className="grid-header-items ">
                    <p>
                      {availableBalance < 0
                        ? "Total Due"
                        : "Available wallet balance"}
                    </p>
                    <h4>
                      {" "}
                      <span> {SettingInfo?.currentType} </span> &nbsp;
                      {Math.abs(availableBalance)}
                    </h4>
                  </div>
                  <div className="grid-header-items">
                    <img
                      src={RightIcon}
                      alt="RightIcon"
                      onClick={() => OpenWalletListHander()}
                    />
                  </div>
                </div>
                <div className="all-type-chart-two-col-grid">
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items blue-opacity-background">
                        <img src={WalletIcon} alt="WalletIcon" />
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Wallet top-ups</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {walletTopup}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items blue-opacity-background">
                        <img src={blueinvoiceIcon} alt="blueinvoiceIcon" />
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Wallet redeemed</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a>{" "}
                            {collectionData?.serviceCount?.filter(
                              (service) => service?.method === "Wallet"
                            )[0]?.amount || 0}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items red-opacity-background ">
                        <img src={RedWalletIcon} alt="RedWalletIcon" />
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Wallet withdrawals</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {walletWithdraw}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items blue-opacity-background">
                        <span>
                          <a>₹</a>{" "}
                        </span>
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Previous due paid</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {previousDue}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-header grid-header-average-top-alignment">
                  <div className="grid-header-items">
                    <div className="icon-center-alignment-box">
                      <img src={StarIcon} alt="StarIcon " />
                    </div>
                  </div>
                  <div className="grid-header-items">
                    <p>Customer ratings</p>
                    <h4>
                      {averageRating - Math.floor(averageRating) !== 0
                        ? Math.abs(averageRating)?.toFixed(2)
                        : Math.abs(averageRating) || 0}
                      <p>/5</p>
                    </h4>
                  </div>
                  <div className="grid-header-items">
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpenRatingModal(!openRatingModal)}
                    >
                      View all ratings
                    </a>
                  </div>
                </div>
              </div>
              <div className="grid-items">
                <div className="grid-header">
                  <div className="grid-header-items">
                    <div className="icon-center-alignment-box blue-opacity-background">
                      <img src={UserIcon} alt="UserIcon" />
                    </div>
                  </div>
                  <div className="grid-header-items">
                    <p>Customer visits</p>
                    <h4>{walkincustomer + returncustomer + newcustomer}</h4>
                  </div>
                  <div
                    className="grid-header-items"
                    onMouseEnter={() => setShowSales(true)}
                    onMouseLeave={() => setShowSales(false)}
                  >
                    {moment(startDate).add(1, "day").format("L") ==
                      moment(temEndDate).format("L") && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
                <div className="grid-body-alignment">
                  <div className="new-chart-grid">
                    <div className="new-chart-grid-items">
                      {walkincustomer === 0 &&
                      returncustomer === 0 &&
                      newcustomer === 0 ? (
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
                    <div className="new-chart-grid-items">
                      <div className="chart-sub-box-alignment">
                        <div className="chart-sub-box">
                          <div className="chrt-icon-grid">
                            <div className="chrt-icon-grid-items">
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
                            <div className="chrt-icon-grid-items">
                              <p>Returning customer</p>
                              <h4>{returncustomer || 0}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="chart-sub-box">
                          <div className="chrt-icon-grid">
                            <div className="chrt-icon-grid-items">
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
                            <div className="chrt-icon-grid-items">
                              <p>New customer</p>
                              <h4>{newcustomer || 0}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="chart-sub-box">
                          <div className="chrt-icon-grid">
                            <div className="chrt-icon-grid-items">
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
                            <div className="chrt-icon-grid-items">
                              <p>Walk-ins</p>
                              <h4>{walkincustomer || 0}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-footer-alignment">
                  <div>
                    <p>No. of new customer added to system</p>
                    <h5>{newGeneratedCustomer}</h5>
                  </div>
                  <div>{/* <img src={RightIcon} alt="RightIcon" /> */}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openRatingModal && (
        <ViewRating
          setOpenRatingModal={setOpenRatingModal}
          averageRatingData={averageRatingData}
          ViewInvoice={ViewInvoice}
        />
      )}
    </>
  );
}
