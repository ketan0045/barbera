import React, { useEffect, useState } from "react";
import CollepsIcon from "../../../../assets/svg/colleps.png";
import UserIcon from "../../../../assets/svg/feather_user.svg";
import { Doughnut } from "react-chartjs-2";

function StaffAnalytics(props) {
  const { staffData, colorList } = props;
  const staffList = staffData?.filter((obj) => obj?.customerCount)
  const [sectionClose, setSectionClose] = useState(true);
  const [totalAttendedCustomer, setTotalAttendedCustomer] = useState(0);
  
  const staffchartdata = {
    labels: staffData
      ?.filter((obj) => obj?.customerCount)
      .map((label) => {
        return label.firstName;
      }),
    datasets: [
      {
        backgroundColor: colorList,
        borderWidth: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        hoverBackgroundColor: colorList,
        data: staffData
          ?.filter((obj) => obj?.customerCount)
          .map((label) => {
            return label.customerCount;
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
    setTotalAttendedCustomer(value);
  };

  useEffect(() => {
    let customerCount = staffData
      ?.filter((obj) => obj?.customerCount)
      .map((label) => {
        return label.customerCount;
      });
    if (customerCount?.length > 0) {
      const reducer = (previousValue, currentValue) =>
        previousValue + currentValue;
      let item = customerCount.reduce(reducer);
      getValue(item);
    }
    return () => {
      setTotalAttendedCustomer(0);
    };
  }, [staffData]);
  
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
              <p>No. of customers attended by staff</p>
              <h5>{totalAttendedCustomer}</h5>
            </div>
          </div>
        </div>
        <div className="total-sale-grid-items">
          <div
            className="colleps-button"
            onClick={() => setSectionClose(!sectionClose)}
          >
            <img
              src={CollepsIcon}
              alt="CollepsIcon"
              className={!sectionClose && "toggleArrow"}
            />
          </div>
        </div>
      </div>
      {sectionClose && (
        <div className="total-sales-chart-alignment">
          <div className="chart-grid">
            <div className="chart-grid-items">
              <div className="main-chart">
                {totalAttendedCustomer === 0 ? (
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
              {totalAttendedCustomer === 0 ? (
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
                    
                    let staffColor = colorList.slice(0, staffList?.length).map((color, index)=>{
                      if (i === index) {
                        return color
                      } else {
                        return "#F6F6FF"
                      }
                    })
                    const data = {
                      labels: [staff && staff.firstName],
                      datasets: [
                        {
                          backgroundColor: staffColor,
                          borderWidth: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                          hoverBackgroundColor: staffColor,
                          data: staffData
                          ?.filter((obj) => obj?.customerCount)
                          .map((label) => {
                            return label.customerCount;
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
                            <p>{staff.firstName + " " + staff.lastName}</p>
                            <h5>{staff.customerCount}</h5>
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

export default StaffAnalytics;
