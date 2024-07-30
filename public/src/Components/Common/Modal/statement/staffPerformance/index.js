import React, { useState, useEffect } from "react";
import "./staffPerformance.scss";
import DownIcon from "../../../../../assets/svg/blue-down.svg";
import SalesIcon from "../../../../../assets/svg/totla-sale-icon.svg";
import UpIcon from "../../../../../assets/svg/up-blue.svg";
import PieChart from "../../../../../assets/svg/newPieChart.svg";
import RightIcon from "../../../../../assets/svg/rigt-gray.svg";
import { Doughnut } from "react-chartjs-2";
import MultiStaff from "../../../../../assets/svg/multi-staff.svg";

export default function StaffPerformance(props) {
  const [dropdown, setDropdown] = useState(true);
  const { staffTransactionsData, colorList, SettingInfo, staffPerformance } =
    props;
  const staffList = staffTransactionsData?.filter((obj) => obj?.amount);
  const [sectionClose, setSectionClose] = useState(true);
  const [totalTransactionAmount, setTotalTransactionAmount] = useState(0);

  const staffchartdata = {
    labels: staffTransactionsData?.map((label) => {
      return label.staffName;
    }),
    datasets: [
      {
        backgroundColor: colorList,
        borderWidth: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        hoverBackgroundColor: colorList,
        data: staffTransactionsData
          ?.filter((obj) => obj?.amount)
          .map((label) => {
            return label?.amount;
          }),
      },
    ],
  };

  const nullstaffchartdata = {
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

  const nostaffchartdata = {
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

  const getValue = (value) => {
    setTotalTransactionAmount(value);
  };

  const convertMinsToHrsMins = (minutes) => {
    var h = Math.floor(minutes / 60);
    var m = Math.floor(minutes % 60);
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    return h + "h  " + m;
  };

  useEffect(() => {
    let transactionAmount = staffTransactionsData
      ?.filter((obj) => obj?.amount)
      .map((label) => {
        return label.amount;
      });
    if (transactionAmount?.length > 0) {
      const reducer = (previousValue, currentValue) =>
        previousValue + currentValue;
      let item = transactionAmount.reduce(reducer);
      getValue(item);
    }
    return () => {
      setTotalTransactionAmount(0);
    };
  }, [staffTransactionsData]);

  return (
    <>
      <div className="staff-perfomance-content-alignment">
        <div className="sales-box-detials-alignment">
          <div className="whtite-box">
            <div className="box-header-alignment">
              <p>Staff</p>
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
                        <img
                          style={{ width: "25px" }}
                          src={MultiStaff}
                          alt="MultiStaff"
                        />
                      </div>
                    </div>
                    <div className="grid-header-items">
                      <p>Staff vise sales</p>
                      <h4>
                        <a>{SettingInfo?.currentType}</a>{" "}
                        {totalTransactionAmount}
                      </h4>
                    </div>
                    <div className="grid-header-items"></div>
                  </div>
                  <div className="grid-body-alignment">
                    <div className="new-chart-grid">
                      <div className="new-chart-grid-items">
                        {totalTransactionAmount === 0 ? (
                          <Doughnut
                            data={nullstaffchartdata}
                            width={100}
                            height={100}
                            options={{
                              legend: { display: false },
                              tooltips: { enabled: false },
                            }}
                          />
                        ) : (
                          <Doughnut
                            data={staffchartdata}
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
                          {staffList.map((staff, i) => {
                            // console.log('*******',staff)
                            let staffColor = colorList
                              .slice(0, staffList?.length)
                              .map((color, index) => {
                                if (i === index) {
                                  return color;
                                } else {
                                  return "#D1D9E6";
                                }
                              });
                            const data = {
                              labels: [staff && staff.staffName],
                              datasets: [
                                {
                                  backgroundColor: staffColor,
                                  borderWidth: [
                                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0,
                                  ],
                                  hoverBackgroundColor: staffColor,
                                  data: staffTransactionsData
                                    ?.filter((obj) => obj?.amount)
                                    .map((label) => {
                                      return label.amount;
                                    }),
                                },
                              ],
                            };
                            return (
                              <div key={i} className="chart-sub-box">
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
                                    <p>{staff.staffName}</p>
                                    <h4>
                                      <a>{SettingInfo?.currentType}</a>{" "}
                                      {staff.amount}
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
                  <div className="staff-perfomance-header-title">
                    <p>Staff performance</p>
                  </div>
                  <div className="staff-perfomance-header-body-content-alignment">
                    <table>
                      <tr>
                        <th align="left">Staff name</th>
                        <th align="center">Services</th>
                        {/* <th align="left">Total hours</th> */}
                        <th align="center">Occupancy</th>
                      </tr>
                      {staffPerformance?.map((staff) => {
                        if (staff?.staffName) {
                          return (
                            <tr>
                              <td align="left">{staff?.staffName}</td>
                              <td align="center">{staff?.service}</td>
                              {/* <td align="left">000h 00m</td> */}
                              <td align="center">
                                {" "}
                                {convertMinsToHrsMins(staff?.duration)}m
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </table>
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
