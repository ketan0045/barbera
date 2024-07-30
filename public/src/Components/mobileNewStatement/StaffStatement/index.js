import React, { useState, useEffect } from "react";
import InvoiceIcon from "../../../assets/svg/mobile-view-invoice.svg";
import UpIcon from "../../../assets/svg/Up.svg";
import MobileViewChart from "../../../assets/svg/moble-chart.png";
import ChartChildIcon from "../../../assets/svg/round-vectore.svg";
import { Doughnut } from "react-chartjs-2";
import MultiStaff from "../../../assets/svg/multi-staff.svg";
import "./StaffStatement.scss";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
export default function StaffStatement(props) {
  const { staffTransactionsData, colorList, SettingInfo, staffPerformance, permission,currentType } =
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
        backgroundColor: ["#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6"],
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
      <motion.div initial={{ opacity: 0, x: "20vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }} className="mobile-view-staff-statement-content-alignment">
        <div className="heading-title">
          <h2>Staff</h2>
        </div>
        {permission.includes("Staff wise sales") &&<div className="sales-first-box">
          <div className="icon-text-grid">
            <div className="icon-text-grid-items">
              <div className="icon-design-alignment">
                <img style={{width:"24px"}} src={MultiStaff} alt="MultiStaff" />
              </div>
            </div>
            <div className="icon-text-grid-items">
              <h5>Staff vise sales</h5>
              <p>
                <a>{currentType}</a> {totalTransactionAmount}
              </p>
            </div>
            <div className="icon-text-grid-items">
           
            </div>
          </div>
          <div className="first-box-chart-grid">
            <div className="first-box-chart-grid-items">
              <div className="chart-alignment">
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
            </div>
            <div className="first-box-chart-grid-items">
              <div className="all-box-alignment">
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
                          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                          0, 0,
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
                        <p>{staff.staffName}</p>
                        <h5>
                          <a>{currentType}</a> {staff.amount}
                        </h5>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>}
        {permission.includes("Staff performance") &&<div className="staff-perfomance-box-alignment">
          <div className="staff-perfomance-box">
            <p>Staff performance</p>
            <table>
              <tr>
                <th align="left">Staff name</th>
                <th align="left">Services</th>
                <th align="left">Occupancy</th>
              </tr>
              {staffPerformance?.map((staff) => {
                if (staff?.staffName) {
                  return (
                    <tr>
                      <td align="left">{staff?.staffName}</td>
                      <td align="left">{staff?.service}</td>

                      <td align="left">
                        {" "}
                        {convertMinsToHrsMins(staff?.duration)}m
                      </td>
                    </tr>
                  );
                }
              })}
            </table>
          </div>
        </div>}
      </motion.div>
    </>
  );
}
