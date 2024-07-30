import React, { useState, useEffect } from "react";
import "./CollectionsStatement.scss";
import InvoiceIcon from "../../../assets/svg/mobile-view-invoice.svg";
import UpIcon from "../../../assets/svg/Up.svg";
import MobileViewChart from "../../../assets/svg/moble-chart.png";
import ChartChildIcon from "../../../assets/svg/round-vectore.svg";
import { Doughnut } from "react-chartjs-2";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import downIcon from "../../../assets/svg/down-red.svg";
import coinIcon from "../../../assets/svg/coin.svg";
import RsInIcon from "../../../assets/svg/rsin.svg";
import RsOutIcon from "../../../assets/svg/rsout.svg";
import CoffeeIcon from "../../../assets/svg/red-teeee.svg";
import Staff from "../../../assets/svg/red-usersss.svg";
import { ApiPost } from "../../../helpers/API/ApiData";

export default function CollectionsStatement(props) {
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
    permission,
    reccieve,
    transfer,
    today,
    lastcollectionData,
    currentType,
    userInfo,
    paymentMethod,
  } = props;

  const [sectionClose, setSectionClose] = useState(true);
  const [totalCollectionAmount, setTotalCollectionAmount] = useState(0);
  const [totallastCollectionAmount, setTotallastCollectionAmount] = useState(0);
  const [showSales, setShowSales] = useState(false);

  const [percentage, setPercentage] = useState(0);
  const [allCollectionData, setAllCollectionData] = useState([]);
  const totalCollection = {
    labels: collectionData?.serviceCount?.filter((service) => service?.method != "Wallet").map((service) => service.method),
    datasets: [
      {
        backgroundColor: colorList,
        borderWidth: 0,
        hoverBackgroundColor: colorList,
        data: collectionData?.serviceCount?.filter((service) => service?.method != "Wallet").map((service) => service.amount),
      },
    ],
  };

  const nullTotalCollection = {
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

  const generateData = async () => {
    let CollectionData = await Promise.all(
      paymentMethod?.map(async (pay) => {
        let objectData = {};
        let opeeningBal;
        let openingCR = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "CR",
          typeValue: "opening-balance",
          paymentMethod: await pay,
        };
        let openingCRRes = await ApiPost("expence/company/expenseDetails", openingCR);
        if ((await openingCRRes?.data?.status) === 200) {
          opeeningBal = await openingCRRes?.data?.data?.total;
          if ((await openingCRRes?.data?.data?.value?.length) > 0) {
            let openingDR = {
              startTime: moment(startDate).format("YYYY-MM-DD"),
              endTime: moment(temEndDate).format("YYYY-MM-DD"),
              companyId: userInfo?.companyId,
              type: "DR",
              typeValue: "opening-balance",
              paymentMethod: await pay,
            };

            let openingDRRes = await ApiPost("expence/company/expenseDetails", openingDR);

            if ((await openingDRRes?.data?.status) === 200) {
              Object.assign(objectData, {
                Opening: (await opeeningBal) - (await openingDRRes?.data?.data?.total),
                pay: await pay,
              });
            } else {
              console.log(await openingDRRes?.data?.message);
            }
          }
        } else {
          console.log(await openingCRRes?.data?.message);
        }
        let closingBala = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          paymentMethod: await pay,
        };
        await ApiPost("expence/daywise/expense", closingBala)
          .then(async (res) => {
            Object.assign(objectData, {
              Closing: await res.data.data,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        let datas = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "DR",
          typeValue: "expence",
          paymentMethod: await pay,
        };

        await ApiPost("expence/company/expenseDetails", datas)
          .then(async (res) => {
            Object.assign(objectData, {
              Expense: await res.data.data.total,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        let datasss = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "DR",
          typeValue: "staff",
          paymentMethod: await pay,
        };

        await ApiPost("expence/company/expenseDetails", datasss)
          .then(async (res) => {
            Object.assign(objectData, {
              Staff: await res.data.data.total,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        let datassss = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "CR",
          typeValue: "deposit",
          paymentMethod: await pay,
        };

        await ApiPost("expence/company/expenseDetails", datassss)
          .then(async (res) => {
            Object.assign(objectData, {
              Reccive: await res.data.data.total,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        let dat = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "DR",
          typeValue: "transfer",
          paymentMethod: await pay,
        };

        await ApiPost("expence/company/expenseDetails", dat)
          .then(async (res) => {
            Object.assign(objectData, {
              Transfer: await res.data.data.total,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        return objectData;
      })
    );
    setAllCollectionData(CollectionData);
    return CollectionData;
  };

  useEffect(async () => {
    if (paymentMethod?.length > 1) {
      await generateData();
    }
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: "20vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mobile-view-collection-content-alignment"
      >
        <div className="heading-title">
          <h2>Collections</h2>
        </div>
        {permission.includes("Total sales collections") && (
          <div className="sales-first-box">
            <div className="icon-text-grid">
              <div className="icon-text-grid-items">
                <div className="icon-design-alignment">
                  <span>
                    <a>₹</a>{" "}
                  </span>
                </div>
              </div>
              <div className="icon-text-grid-items">
                <h5>Total sales collection</h5>
                <p>
                  <a>{currentType}</a> {totalCollectionAmount}
                </p>
              </div>
              <div className="icon-text-grid-items" onClick={() => setShowSales(!showSales)}>
                <button
                  style={{
                    color: percentage < 0 ? "#E66666" : "#46BFBD",
                    background: percentage < 0 ? "#FDF0F0" : "#EDF9F9",
                    border: percentage < 0 ? "1px solid #F2ABAB" : "1px solid #A3DFDE",
                  }}
                >
                  <img src={percentage < 0 ? downIcon : UpIcon} alt="UpIcon" />
                  <span>{percentage - Math.floor(percentage) !== 0 ? Math.abs(percentage)?.toFixed(0) : Math.abs(percentage)}%</span>
                </button>
                {showSales && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="generate-invoice-tooltip1">
                    <div className="sale-modal-tooltip-alignment">
                      <div className="content-alignment">
                        <div>
                          <p>Collection last {today}</p>
                        </div>
                        <div>
                          <h2>
                            <span>{currentType}</span> {totallastCollectionAmount}{" "}
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
              </div>
              <div className="first-box-chart-grid-items">
                <div className="all-box-alignment">
                  {collectionData?.serviceCount
                    ?.filter((service) => service?.method != "Wallet")
                    .map((type, i) => {
                      let serviceColor = colorList.slice(0, collectionData?.serviceCount?.length).map((color, index) => {
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
                            borderWidth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            hoverBackgroundColor: serviceColor,
                            data: collectionData?.serviceCount?.filter((service) => service?.method != "Wallet").map((service) => service.amount),
                          },
                        ],
                      };
                      return (
                        <div className="box-design">
                          <div className="box-design-items">
                            <div className="box-icon-alignment">
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
                          </div>
                          <div className="box-design-items">
                            <p>{type.method}</p>
                            <h5>
                              <a>{currentType}</a> {type.amount}
                            </h5>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
        {paymentMethod?.length > 1 ? (
          allCollectionData?.map((collection) => {
            return (
              <motion.div
              initial={{ opacity: 0, x: "20vw" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}>
                <div className="heading-titles">
                  <h2>{collection?.pay} Collection</h2>
                </div>
                <div className="full-width-box-alignment">
                  {permission.includes("Opening collection") && (
                    <div className="full-width-box">
                      <div className="grid">
                        <div className="grid-items">
                          <div className="icon-design blue-opacity-background ">
                            <img style={{ width: "25px" }} src={coinIcon} alt="coinIcon" />
                          </div>
                        </div>
                        <div className="grid-items">
                          <p>Opening collection</p>
                          <h4>
                            {" "}
                            <a>{currentType}</a>{" "}
                            {moment(startDate).add(1, "day").format("L") !== moment(temEndDate).format("L") ? "N/A" : collection?.Opening}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                  {permission.includes("Closing collection") && (
                    <div className="full-width-box">
                      <div className="grid">
                        <div className="grid-items">
                          <div className="icon-design blue-opacity-background ">
                            <img style={{ width: "25px" }} src={coinIcon} alt="coinIcon" />
                          </div>
                        </div>
                        <div className="grid-items">
                          <p>Closing collection</p>
                          <h4>
                            {" "}
                            <a>{currentType}</a>{" "}
                            {moment(startDate).add(1, "day").format("L") !== moment(temEndDate).format("L") ? "N/A" : collection?.Closing}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="all-child-box-chart-alignment">
                  {permission.includes("Expense & Staff pay") && (
                    <div className="grid">
                      <div className="grid-items">
                        <div className="sub-grid">
                          <div className="sub-grid-items">
                            <div className="sub-icon-design">
                              <img style={{ width: "68px" }} src={CoffeeIcon} alt="CoffeeIcon" />
                            </div>
                          </div>
                          <div className="sub-grid-items">
                            <p>Expense</p>
                            <h6>
                              {" "}
                              <a>{currentType}</a> {collection?.Expense}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="grid-items">
                        <div className="sub-grid">
                          <div className="sub-grid-items">
                            <div className="sub-icon-design">
                              <img style={{ width: "68px" }} src={Staff} alt="Staff" />
                            </div>
                          </div>
                          <div className="sub-grid-items">
                            <p>Staff pay</p>
                            <h6>
                              {" "}
                              <a>{currentType}</a> {collection?.Staff}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="full-width-box-alignment">
                  {permission.includes("Receive from Owner") && (
                    <div className="full-width-box">
                      <div className="grid">
                        <div className="grid-items">
                          <div className="icon-design">
                            <img style={{ width: "68px" }} src={RsInIcon} alt="RsInIcon" />
                          </div>
                        </div>
                        <div className="grid-items">
                          <p>Receive from Owner</p>
                          <h4>
                            {" "}
                            <a>{currentType}</a> {collection?.Reccive}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                  {permission.includes("Transfer to Owner") && (
                    <div className="full-width-box">
                      <div className="grid">
                        <div className="grid-items">
                          <div className="icon-design">
                            <img style={{ width: "68px" }} src={RsOutIcon} alt="RsOutIcon" />
                          </div>
                        </div>
                        <div className="grid-items">
                          <p>Transfer to Owner</p>
                          <h4>
                            {" "}
                            <a>{currentType}</a> {collection?.Transfer}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <>
            <div className="full-width-box-alignment">
              {permission.includes("Opening collection") && (
                <div className="full-width-box">
                  <div className="grid">
                    <div className="grid-items">
                      <div className="icon-design blue-opacity-background ">
                        <img style={{ width: "25px" }} src={coinIcon} alt="coinIcon" />
                      </div>
                    </div>
                    <div className="grid-items">
                      <p>Opening collection</p>
                      <h4>
                        {" "}
                        <a>{currentType}</a>{" "}
                        {moment(startDate).add(1, "day").format("L") !== moment(temEndDate).format("L") ? "N/A" : openingBalanceDetail}
                      </h4>
                    </div>
                  </div>
                </div>
              )}
              {permission.includes("Closing collection") && (
                <div className="full-width-box">
                  <div className="grid">
                    <div className="grid-items">
                      <div className="icon-design blue-opacity-background ">
                        <img style={{ width: "25px" }} src={coinIcon} alt="coinIcon" />
                      </div>
                    </div>
                    <div className="grid-items">
                      <p>Closing collection</p>
                      <h4>
                        {" "}
                        <a>{currentType}</a>{" "}
                        {moment(startDate).add(1, "day").format("L") !== moment(temEndDate).format("L") ? "N/A" : closingBalanceDetail}
                      </h4>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="all-child-box-chart-alignment">
              {permission.includes("Expense & Staff pay") && (
                <div className="grid">
                  <div className="grid-items">
                    <div className="sub-grid">
                      <div className="sub-grid-items">
                        <div className="sub-icon-design">
                          <img style={{ width: "68px" }} src={CoffeeIcon} alt="CoffeeIcon" />
                        </div>
                      </div>
                      <div className="sub-grid-items">
                        <p>Expense</p>
                        <h6>
                          {" "}
                          <a>{currentType}</a> {expense}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="grid-items">
                    <div className="sub-grid">
                      <div className="sub-grid-items">
                        <div className="sub-icon-design">
                          <img style={{ width: "68px" }} src={Staff} alt="Staff" />
                        </div>
                      </div>
                      <div className="sub-grid-items">
                        <p>Staff pay</p>
                        <h6>
                          {" "}
                          <a>{currentType}</a> {staffPay}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="full-width-box-alignment">
              {permission.includes("Receive from Owner") && (
                <div className="full-width-box">
                  <div className="grid">
                    <div className="grid-items">
                      <div className="icon-design">
                        <img style={{ width: "68px" }} src={RsInIcon} alt="RsInIcon" />
                      </div>
                    </div>
                    <div className="grid-items">
                      <p>Receive from Owner</p>
                      <h4>
                        {" "}
                        <a>{currentType}</a> {reccieve}
                      </h4>
                    </div>
                  </div>
                </div>
              )}
              {permission.includes("Transfer to Owner") && (
                <div className="full-width-box">
                  <div className="grid">
                    <div className="grid-items">
                      <div className="icon-design">
                        <img style={{ width: "68px" }} src={RsOutIcon} alt="RsOutIcon" />
                      </div>
                    </div>
                    <div className="grid-items">
                      <p>Transfer to Owner</p>
                      <h4>
                        {" "}
                        <a>{currentType}</a> {transfer}
                      </h4>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
