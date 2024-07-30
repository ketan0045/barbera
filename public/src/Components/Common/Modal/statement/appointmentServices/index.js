import React, { useState, useEffect } from "react";
import "./appointmentServices.scss";
import SalesIcon from "../../../../../assets/svg/totla-sale-icon.svg";
import UpIcon from "../../../../../assets/svg/up-blue.svg";
import downIcon from "../../../../../assets/svg/down-red.svg";
import PieChart from "../../../../../assets/svg/newPieChart.svg";
import RightIcon from "../../../../../assets/svg/rigt-gray.svg";
import DownIcon from "../../../../../assets/svg/blue-down.svg";
import LineChart from "../../../../../assets/svg/new-line-chart.png";
import { get_Setting } from "../../../../../utils/user.util";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import { Doughnut } from "react-chartjs-2";
import AvailServiceModal from "./availServiceModal";
import Chart from "react-apexcharts";
import moment from "moment";
import AppointmentIcon from "../../../../../assets/svg/appointmentIcon.svg";
import ScissorsIcon from "../../../../../assets/svg/green-scissors.svg";

export default function AppointmentServices(props) {
  const {
    saleData,
    salesDat,
    availService,
    availServiceData,
    availServiceDataList,
    popularhours,
    lastsaleData,
    lastsalesDat,
    today,
    startDate,
    temEndDate,
  } = props;
  const [dropdown, setDropdown] = useState(true);
  const [showSales, setShowSales] = useState(false);
  const [openAvailService, setOpenAvailService] = useState(false);
  const SettingData = get_Setting();

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (
      (+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +saleData?.complete?.reduce((a, b) => a + b, 0) +
        +salesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +salesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) != 0 &&
      (+lastsalesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +lastsaleData?.complete?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) != 0
    ) {
      setPercentage(
        ((+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
          +saleData?.complete?.reduce((a, b) => a + b, 0) +
          +salesDat?.cancel?.reduce((a, b) => a + b, 0) +
          +salesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) *
          100) /
          (+lastsalesDat?.noShow?.reduce((a, b) => a + b, 0) +
            +lastsaleData?.complete?.reduce((a, b) => a + b, 0) +
            +lastsalesDat?.cancel?.reduce((a, b) => a + b, 0) +
            +lastsalesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) -
          100
      );
    }
    if (
      (+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +saleData?.complete?.reduce((a, b) => a + b, 0) +
        +salesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +salesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) == 0 &&
      (+lastsalesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +lastsaleData?.complete?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) != 0
    ) {
      setPercentage(
        -(
          (+lastsalesDat?.noShow?.reduce((a, b) => a + b, 0) +
            +lastsaleData?.complete?.reduce((a, b) => a + b, 0) +
            +lastsalesDat?.cancel?.reduce((a, b) => a + b, 0) +
            +lastsalesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) * 100
        )
      );
    }
    if (
      (+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +saleData?.complete?.reduce((a, b) => a + b, 0) +
        +salesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +salesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) != 0 &&
      (+lastsalesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +lastsaleData?.complete?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) == 0
    ) {
      setPercentage(
        (+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
          +saleData?.complete?.reduce((a, b) => a + b, 0) +
          +salesDat?.cancel?.reduce((a, b) => a + b, 0) +
          +salesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) * 100
      );
    }
    if (
      (+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +saleData?.complete?.reduce((a, b) => a + b, 0) +
        +salesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +salesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) == 0 &&
      (+lastsalesDat?.noShow?.reduce((a, b) => a + b, 0) +
        +lastsaleData?.complete?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.cancel?.reduce((a, b) => a + b, 0) +
        +lastsalesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0) == 0
    ) {
      setPercentage(0);
    }
  }, [salesDat, saleData, lastsalesDat, lastsaleData]);

  let xaxisData = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ]?.map((hrs, i) => {
    if (
      i >=
      moment(
        moment(SettingData?.storeTiming[0].starttime, "hh-mm a")._d
      ).hours()
    ) {
      if (i > 11) {
        if (
          i <=
          moment(
            moment(SettingData?.storeTiming[0].endtime, "hh-mm a")._d
          ).hours()
        ) {
          if (hrs == 12) {
            return hrs + " pm";
          } else {
            return hrs - 12 + " pm";
          }
        }
      } else {
        if (
          i <=
          moment(
            moment(SettingData?.storeTiming[0].endtime, "hh-mm a")._d
          ).hours()
        ) {
          return hrs + " am";
        }
      }
    }
  });

  let dummyData = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ]?.map((hrs, i) => {
    if (
      i >=
      moment(
        moment(SettingData?.storeTiming[0].starttime, "hh-mm a")._d
      ).hours()
    ) {
      if (i > 11) {
        if (
          i <=
          moment(
            moment(SettingData?.storeTiming[0].endtime, "hh-mm a")._d
          ).hours()
        ) {
          return hrs;
        }
      } else {
        if (
          i <=
          moment(
            moment(SettingData?.storeTiming[0].endtime, "hh-mm a")._d
          ).hours()
        ) {
          return hrs;
        }
      }
    }
  });
  let yaxisData = dummyData
    ?.filter((obj) => obj !== undefined)
    ?.map((pop) => {
      return popularhours
        ?.map((hrs) => {
          if (hrs[0] == pop) {
            return hrs[1];
          }
        })
        ?.filter((obj) => obj !== undefined);
    })
    .map((data) => {
      if (data?.length > 0) {
        return data[0];
      } else {
        return 0;
      }
    });

  const totalAppointment = {
    labels: ["Completed", "No shows", "Cancelled"],
    datasets: [
      {
        backgroundColor: ["#FDB45C", "#6F737D", "#F7464A"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#FDB45C", "#6F737D", "#F7464A"],
        data: [
          saleData?.complete?.reduce((a, b) => a + b, 0),
          +salesDat?.noShow?.reduce((a, b) => a + b, 0) +
            +salesDat?.upcoming?.reduce((a, b) => a + b, 0),
          salesDat?.cancel?.reduce((a, b) => a + b, 0),
        ],
      },
    ],
  };

  const nulltotalAppointment = {
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

  const nullAppointment = {
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

  const completedAppointment = {
    labels: ["Completed", "No shows", "Cancelled"],
    datasets: [
      {
        backgroundColor: ["#FDB45C", "#D1D9E6", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#FDB45C", "#D1D9E6", "#D1D9E6"],
        data: [
          saleData?.complete?.reduce((a, b) => a + b, 0),
          +salesDat?.noShow?.reduce((a, b) => a + b, 0) +
            +salesDat?.upcoming?.reduce((a, b) => a + b, 0),
          salesDat?.cancel?.reduce((a, b) => a + b, 0),
        ],
      },
    ],
  };

  const upcomingAppointment = {
    labels: ["Completed", "No shows", "Cancelled"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#6F737D", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#6F737D", "#D1D9E6"],
        data: [
          saleData?.complete?.reduce((a, b) => a + b, 0),
          +salesDat?.noShow?.reduce((a, b) => a + b, 0) +
            +salesDat?.upcoming?.reduce((a, b) => a + b, 0),
          salesDat?.cancel?.reduce((a, b) => a + b, 0),
        ],
      },
    ],
  };

  const cancelledAppointment = {
    labels: ["Completed", "No shows", "Cancelled"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#D1D9E6", "#F7464A"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#D1D9E6", "#F7464A"],
        data: [
          saleData?.complete?.reduce((a, b) => a + b, 0),
          +salesDat?.noShow?.reduce((a, b) => a + b, 0) +
            +salesDat?.upcoming?.reduce((a, b) => a + b, 0),
          salesDat?.cancel?.reduce((a, b) => a + b, 0),
        ],
      },
    ],
  };

  var options = {
    chart: {
      height: 400,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#E8F2FF"],

    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#7DAFF2"],
      },
    },

    xaxis: {
      categories: xaxisData?.filter((obj) => obj !== undefined),
      position: "bottom",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: xaxisData
            ?.filter((obj) => obj !== undefined)
            ?.map(() => "#7DAFF2"),
        },
      },

      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#E4E9F2",
            colorTo: "#E4E9F2",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },

      labels: {
        show: false,
        formatter: function (val) {
          return val;
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          strokeDashArray: 0,
          borderColor: "#E8F2FF",
          fillColor: "#E8F2FF",
          opacity: 0.7,
          offsetX: 0,
          offsetY: 0,
        },
      ],
    },
  };

  const series = [
    {
      data: yaxisData,
    },
  ];

  return (
    <>
      <div className="appointment-services-box-content-alignment">
        <div className="white-box">
          <div className="box-header-alignment">
            <p>Appointment/Services</p>
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
                      <img src={AppointmentIcon} alt="AppointmentIcon" />
                    </div>
                  </div>
                  <div className="grid-header-items">
                    <p>Total Appointments</p>
                    <h4>
                      {+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
                        +saleData?.complete?.reduce((a, b) => a + b, 0) +
                        +salesDat?.cancel?.reduce((a, b) => a + b, 0) +
                        +salesDat?.upcoming?.reduce((a, b) => a + b, 0) || 0}
                    </h4>
                  </div>
                  <div
                    className="grid-header-items"
                    onMouseEnter={() => setShowSales(true)}
                    onMouseLeave={() => setShowSales(false)}
                  >
                    {moment(startDate).add(1, "day").format("L") ==
                      moment(temEndDate).format("L") && (
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
                    )}
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
                              <p>Appointments last {today}</p>
                            </div>
                            <div>
                              <h2>
                                {+lastsalesDat?.noShow?.reduce(
                                  (a, b) => a + b,
                                  0
                                ) +
                                  +lastsaleData?.complete?.reduce(
                                    (a, b) => a + b,
                                    0
                                  ) +
                                  +lastsalesDat?.cancel?.reduce(
                                    (a, b) => a + b,
                                    0
                                  ) +
                                  +lastsalesDat?.upcoming?.reduce(
                                    (a, b) => a + b,
                                    0
                                  ) || 0}{" "}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="grid-body-alignment">
                  <div className="new-chart-grid">
                    <div className="new-chart-grid-items">
                      {
                        // (salesDat?.totalAppointment === 0 || null) &&
                        (saleData?.complete == 0 || null) &&
                        (salesDat?.noshow == 0 || null) &&
                        (salesDat?.cancel == 0 || null)(
                          salesDat?.upcoming == 0 || null
                        ) ? (
                          <Doughnut
                            data={nulltotalAppointment}
                            width={100}
                            height={100}
                            options={{
                              legend: { display: false },
                              tooltips: { enabled: false },
                            }}
                          />
                        ) : (
                          <Doughnut
                            data={totalAppointment}
                            width={100}
                            height={100}
                            options={{
                              title: { display: false },
                              legend: { display: false },
                              tooltips: { enabled: true },
                            }}
                          />
                        )
                      }
                    </div>
                    <div className="new-chart-grid-items">
                      <div className="chart-sub-box-alignment">
                        <div className="chart-sub-box">
                          <div className="chrt-icon-grid">
                            <div className="chrt-icon-grid-items">
                              {saleData?.complete === 0 || null ? (
                                <Doughnut
                                  data={nullAppointment}
                                  width={100}
                                  height={100}
                                  options={{
                                    legend: { display: false },
                                    tooltips: { enabled: false },
                                  }}
                                />
                              ) : (
                                <Doughnut
                                  data={completedAppointment}
                                  width={100}
                                  height={100}
                                  options={{
                                    title: { display: false },
                                    tooltips: { enabled: false },
                                    legend: { display: false },
                                  }}
                                />
                              )}
                            </div>
                            <div className="chrt-icon-grid-items">
                              <p>Completed</p>
                              <h4>
                                {saleData?.complete?.reduce(
                                  (a, b) => a + b,
                                  0
                                ) || 0}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="chart-sub-box">
                          <div className="chrt-icon-grid">
                            <div className="chrt-icon-grid-items">
                              {salesDat?.noshow === 0 || null ? (
                                <Doughnut
                                  data={nullAppointment}
                                  width={100}
                                  height={100}
                                  options={{
                                    legend: { display: false },
                                    tooltips: { enabled: false },
                                  }}
                                />
                              ) : (
                                <Doughnut
                                  data={upcomingAppointment}
                                  width={100}
                                  height={100}
                                  options={{
                                    title: { display: false },
                                    tooltips: { enabled: false },
                                    legend: { display: false },
                                  }}
                                />
                              )}
                            </div>
                            <div className="chrt-icon-grid-items">
                              <p>No-shows</p>
                              <h4>
                                {+salesDat?.noShow?.reduce((a, b) => a + b, 0) +
                                  +salesDat?.upcoming?.reduce(
                                    (a, b) => a + b,
                                    0
                                  ) || 0}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="chart-sub-box">
                          <div className="chrt-icon-grid">
                            <div className="chrt-icon-grid-items">
                              {salesDat?.cancel === 0 || null ? (
                                <Doughnut
                                  data={nullAppointment}
                                  width={100}
                                  height={100}
                                  options={{
                                    legend: { display: false },
                                    tooltips: { enabled: false },
                                  }}
                                />
                              ) : (
                                <Doughnut
                                  data={cancelledAppointment}
                                  width={100}
                                  height={100}
                                  options={{
                                    title: { display: false },
                                    tooltips: { enabled: false },
                                    legend: { display: false },
                                  }}
                                />
                              )}
                            </div>
                            <div className="chrt-icon-grid-items">
                              <p>Cancelled</p>
                              <h4>
                                {salesDat?.cancel?.reduce((a, b) => a + b, 0) ||
                                  0}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-items">
                <div className="grid-header">
                  <div className="grid-header-items">
                    <div className="icon-center-alignment-box">
                      <img src={ScissorsIcon} alt="ScissorsIcon" />
                    </div>
                  </div>
                  <div className="grid-header-items">
                    <p>Total services availed</p>
                    <h4>{availService}</h4>
                  </div>
                  <div className="grid-header-items">
                    <img
                      style={{ cursor: "pointer" }}
                      src={RightIcon}
                      alt="RightIcon"
                      onClick={() => setOpenAvailService(!openAvailService)}
                    />
                  </div>
                </div>
                <div className="popular-hours-box-alignment">
                  <div className="popular-header-alignment">
                    <p>Popular hours</p>
                    <div className="line-chart-section-alignment">
                      {/* <div className="chart-content"> */}
                      <Chart
                        options={options}
                        series={series}
                        type="bar"
                        width="520px"
                        height="180px"
                      />
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openAvailService && (
        <AvailServiceModal
          setOpenAvailService={setOpenAvailService}
          availServiceData={availServiceData}
          availServiceDataList={availServiceDataList}
        />
      )}
    </>
  );
}
