import React, { useEffect, useState } from "react";
import "./staffStatement.scss";
import SalesIcon from "../../../../../assets/svg/totla-sale-icon.svg";
import UpIcon from "../../../../../assets/svg/up-blue.svg";
import downIcon from "../../../../../assets/svg/down-red.svg";
import PieChart from "../../../../../assets/svg/newPieChart.svg";
import RightIcon from "../../../../../assets/svg/rigt-gray.svg";
import DownIcon from "../../../../../assets/svg/blue-down.svg";
import LineChart from "../../../../../assets/svg/new-line-chart.png";
import { Doughnut } from "react-chartjs-2";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import coinIcon from "../../../../../assets/svg/coin.svg";
import RsInIcon from "../../../../../assets/svg/rsin.svg";
import RsOutIcon from "../../../../../assets/svg/rsout.svg";
import CoffeeIcon from "../../../../../assets/svg/red-teeee.svg";
import Staff from "../../../../../assets/svg/red-usersss.svg";
import MultiOpeningCollection from "./MultiOpeningCollection";

export default function StaffStatement(props) {
  const [dropdown, setDropdown] = useState(true);
  const {
    collectionData,
    colorList,
    SettingInfo,
    openingBalanceDetail,
    startDate,
    closingBalanceDetail,
    temEndDate,
    staffPay,
    expense,
    reccieve,
    transfer,
    today,
    lastcollectionData,
  } = props;

  const [sectionClose, setSectionClose] = useState(true);
  const [totalCollectionAmount, setTotalCollectionAmount] = useState(0);
  const [totallastCollectionAmount, setTotallastCollectionAmount] = useState(0);
  const [showSales, setShowSales] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);

  const totalCollection = {
    labels: collectionData?.serviceCount
      ?.filter((service) => service?.method != "Wallet")
      .map((service) => service.method),
    datasets: [
      {
        backgroundColor: colorList,
        borderWidth: 0,
        hoverBackgroundColor: colorList,
        data: collectionData?.serviceCount
          ?.filter((service) => service?.method != "Wallet")
          .map((service) => service.amount),
      },
    ],
  };

  const nullTotalCollection = {
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

  const nullCollection = {
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

  useEffect(() => {
    let total;
    let lasttotal;
    if (collectionData) {
      total = collectionData?.serviceCount
        ?.filter((service) => service?.method != "Wallet")
        .map((item) => item.amount)
        .reduce((prev, curr) => +prev + +curr, 0);

      setTotalCollectionAmount(total);
    }
    if (lastcollectionData) {
      lasttotal = lastcollectionData?.serviceCount
        ?.filter((service) => service?.method != "Wallet")
        .map((item) => item.amount)
        .reduce((prev, curr) => +prev + +curr, 0);

      setTotallastCollectionAmount(lasttotal);
    }
    if (total != 0 && lasttotal != 0) {
      setPercentage((total * 100) / lasttotal - 100);
    }
    if (total == 0 && lasttotal != 0) {
      setPercentage(-lasttotal);
    }
    if (total != 0 && lasttotal == 0) {
      setPercentage(total);
    }
    if (total == 0 && lasttotal == 0) {
      setPercentage(0);
    }
  }, [collectionData, lastcollectionData]);

  const [percentage, setPercentage] = useState(0);

  return (
    <>
      <div className="staff-statement-contnet-center-alignment">
        <div className="white-box">
          <div className="box-header-alignment">
            <p>Collection</p>
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
                    <div className="icon-center-alignment-box">
                      {/* <img src={SalesIcon} alt="SalesIcon" /> */}
                      <span>
                        <a>₹</a>{" "}
                      </span>
                    </div>
                  </div>
                  <div className="grid-header-items">
                    <p>Total sales collection</p>
                    <h4>
                      <a>{SettingInfo?.currentType}</a> {totalCollectionAmount}
                    </h4>
                  </div>
                  <div
                    className="grid-header-items"
                    onMouseEnter={() => setShowSales(true)}
                    onMouseLeave={() => setShowSales(false)}
                  >
                    {" "}
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
                                  <p>Collection last {today}</p>
                                </div>
                                <div>
                                  <h2>
                                    <span>{SettingInfo?.currentType}</span>{" "}
                                    {totallastCollectionAmount}{" "}
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
                      {collectionData?.serviceCount?.length === 0 ? (
                        <Doughnut
                          data={nullTotalCollection}
                          width={100}
                          height={100}
                          options={{
                            legend: { display: false },
                            tooltips: { enabled: false },
                          }}
                        />
                      ) : (
                        <Doughnut
                          data={totalCollection}
                          width={100}
                          height={100}
                          options={{
                            title: { display: false },
                            legend: { display: false },
                            tooltips: { enabled: true },
                          }}
                        />
                      )}
                    </div>
                    <div className="new-chart-grid-items">
                      <div className="chart-sub-box-alignment">
                        {collectionData?.serviceCount
                          ?.filter((service) => service?.method != "Wallet")
                          .map((type, i) => {
                            let serviceColor = colorList
                              .slice(0, collectionData?.serviceCount?.length)
                              .map((color, index) => {
                                if (i === index) {
                                  return color;
                                } else {
                                  return "#D1D9E6";
                                }
                              });
                            const data = {
                              labels: [type && type.method],
                              datasets: [
                                {
                                  backgroundColor: serviceColor,
                                  borderWidth: [
                                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0,
                                  ],
                                  hoverBackgroundColor: serviceColor,
                                  data: collectionData?.serviceCount
                                    ?.filter(
                                      (service) => service?.method != "Wallet"
                                    )
                                    .map((service) => service.amount),
                                },
                              ],
                            };
                            return (
                              <div className="chart-sub-box">
                                <div className="chrt-icon-grid">
                                  <div className="chrt-icon-grid-items">
                                    <Doughnut
                                      data={data}
                                      width={100}
                                      height={100}
                                      options={{
                                        title: { display: false },
                                        legend: { display: false },
                                        tooltips: { enabled: false },
                                      }}
                                    />
                                  </div>
                                  <div className="chrt-icon-grid-items">
                                    <p>{type.method}</p>
                                    <h4>
                                      <a>{SettingInfo?.currentType}</a>{" "}
                                      {type.amount}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-items">
                {SettingInfo?.collections?.enablePaymentMethod &&
                  SettingInfo?.collections?.collectionpaymentMethod?.length >
                    1 && (
                    <div className="grid-header" style={{marginBottom :"30px"}}>
                      <div className="grid-header-items">
                        <div className="icon-center-alignment-box blue-opacity-background">
                          <img src={coinIcon} alt="coinIcon" />
                        </div>
                      </div>
                      <div className="grid-header-items ">
                        <p>
                        Collections
                        </p>
                        <h4>
                          {" "}
                          
                          {moment(startDate).add(1, "day").format("L") !==
                                moment(temEndDate).format("L")
                                  ? "N/A" :SettingInfo?.collections?.collectionpaymentMethod?.map((pay,i)=>{
                            if(i == (SettingInfo?.collections?.collectionpaymentMethod?.length -1)){
                              return(
                                `${pay}`
                              )
                            }else{
                            return(
                              `${pay}, `
                            )}
                          })}
                        </h4>
                      </div>
                      <div className="grid-header-items">
                      {moment(startDate).add(1, "day").format("L") !==
                                moment(temEndDate).format("L")
                                  ? null:<img
                          src={RightIcon}
                          style={{cursor:"pointer"}}
                          alt="RightIcon"
                          onClick={() => setOpenCollection(!openCollection)}
                        />}
                      </div>
                    </div>
                  )}
                <div className="all-type-chart-two-col-grid">
                  {SettingInfo?.collections?.enablePaymentMethod &&
                  SettingInfo?.collections?.collectionpaymentMethod?.length >
                    1 ? null : (
                    <>
                      <div className="all-type-chart-two-col-grid-items">
                        <div className="type-grid">
                          <div className="type-grid-items">
                            <img
                              style={{ width: "25px" }}
                              src={coinIcon}
                              alt="coinIcon"
                            />
                          </div>
                          <div className="type-grid-items">
                            <div>
                              <p>Opening collection</p>
                              <h6>
                                <a>{SettingInfo?.currentType}</a>{" "}
                                {moment(startDate).add(1, "day").format("L") !==
                                moment(temEndDate).format("L")
                                  ? "N/A"
                                  : openingBalanceDetail}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="all-type-chart-two-col-grid-items">
                        <div className="type-grid">
                          <div className="type-grid-items">
                            <img
                              style={{ width: "25px" }}
                              src={coinIcon}
                              alt="coinIcon"
                            />
                          </div>
                          <div className="type-grid-items">
                            <div>
                              <p>Closing collection</p>
                              <h6>
                                <a>{SettingInfo?.currentType}</a>{" "}
                                {moment(startDate).add(1, "day").format("L") !==
                                moment(temEndDate).format("L")
                                  ? "N/A"
                                  : closingBalanceDetail}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items">
                        <img
                          style={{ width: "68px" }}
                          src={CoffeeIcon}
                          alt="CoffeeIcon"
                        />
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Expense</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {expense}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items">
                        <img
                          style={{ width: "68px" }}
                          src={Staff}
                          alt="Staff"
                        />
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Staff pay</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {staffPay}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items">
                        <img
                          style={{ width: "68px" }}
                          src={RsInIcon}
                          alt="RsInIcon"
                        />
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Receive (Owner)</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {reccieve}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-type-chart-two-col-grid-items">
                    <div className="type-grid">
                      <div className="type-grid-items">
                        <img
                          style={{ width: "68px" }}
                          src={RsOutIcon}
                          alt="RsOutIcon"
                        />
                      </div>
                      <div className="type-grid-items">
                        <div>
                          <p>Transfer (Owner)</p>
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {transfer}
                          </h6>
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
      {openCollection && <MultiOpeningCollection  setOpenCollection={setOpenCollection} startDate={startDate}  temEndDate={temEndDate}paymentMethod={SettingInfo?.collections?.collectionpaymentMethod}/>}
    </>
  );
}
