import React, { useEffect, useState } from "react";
import CollepsIcon from "../../../../assets/svg/colleps.png";
import UserIcon from "../../../../assets/svg/feather_user.svg";
import { Doughnut } from "react-chartjs-2";

function StaffTransactionsTotal(props) {
  const { staffTransactionsData, colorList, SettingInfo } = props;
  const staffList = staffTransactionsData?.filter((obj) => obj?.amount);
  const [sectionClose, setSectionClose] = useState(true);
  const [totalAttendedCustomer, setTotalAttendedCustomer] = useState(0);
  const [totalTransactionAmount, setTotalTransactionAmount] = useState(0);

  const staffchartdata = {
    labels: staffTransactionsData?.map((label) => {
      return label.staffName;
    }),
    datasets: [
      {
        backgroundColor: colorList,
        borderWidth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

  useEffect(() => {
    let transactionAmount = staffTransactionsData
      ?.filter((obj) => obj?.amount)
      .map((label) => {
        return label.amount;
      });
    if (transactionAmount?.length > 0) {
      const reducer = (previousValue, currentValue) => previousValue + currentValue;
      let item = transactionAmount.reduce(reducer);
      getValue(item);
    }
    return () => {
      setTotalTransactionAmount(0);
    };
  }, [staffTransactionsData]);

  return (
    <div className="total-sale-box">
      <div className="total-sale-grid">
        <div className="total-sale-grid-items">
          <div className="sale-child-grid">
            <div className="sale-child-grid-items">
              <div className="total-sale-show-icon">
                <img src={UserIcon} alt="StatementIcon" />
              </div>
            </div>
            <div className="sale-child-grid-items">
              <p>Total Transactions by staff</p>

              <h5>
                <span>{SettingInfo?.currentType}</span> {totalTransactionAmount}
              </h5>
            </div>
          </div>
        </div>
        <div className="total-sale-grid-items">
          <div className="colleps-button" onClick={() => setSectionClose(!sectionClose)}>
            <img src={CollepsIcon} alt="CollepsIcon" className={!sectionClose && "toggleArrow"} />
          </div>
        </div>
      </div>
      {sectionClose && (
        <div className="total-sales-chart-alignment">
          <div className="chart-grid">
            <div className="chart-grid-items">
              <div className="main-chart">
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
            <div className="chart-grid-items">
              {totalTransactionAmount === 0 ? (
                <div className="chart-details-box">
                  <div className="chart-child-grid">
                    <div className="chart-child-grid-items">
                      <div className="child-chart-box">
                        <Doughnut
                          data={nostaffchartdata}
                          width={100}
                          height={100}
                          options={{
                            legend: { display: false },
                            tooltips: { enabled: false },
                          }}
                        />
                      </div>
                    </div>
                    <div className="chart-child-grid-items">
                      <p></p>
                      <h5></h5>
                    </div>
                  </div>
                </div>
              ) : (
                staffList.map((staff, i) => {
                  // console.log('*******',staff)
                  let staffColor = colorList.slice(0, staffList?.length).map((color, index) => {
                    if (i === index) {
                      return color;
                    } else {
                      return "#F6F6FF";
                    }
                  });
                  const data = {
                    labels: [staff && staff.staffName],
                    datasets: [
                      {
                        backgroundColor: staffColor,
                        borderWidth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
                    <div key={i} className="chart-details-box">
                      <div className="chart-child-grid">
                        <div className="chart-child-grid-items">
                          <div className="child-chart-box">
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
                        <div className="chart-child-grid-items">
                          <p>{staff.staffName}</p>
                          <h5>
                            <span>{SettingInfo?.currentType}</span> {staff.amount}
                          </h5>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffTransactionsTotal;
