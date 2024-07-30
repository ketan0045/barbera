import React, { useEffect, useState } from "react";
import CollepsIcon from "../../../../assets/svg/colleps.png";
import RupeeIcon from "../../../../assets/svg/rupee.png";
import { Doughnut } from "react-chartjs-2";

function TotalCollection(props) {
  const { collectionData, colorList, SettingInfo } = props;

  const [sectionClose, setSectionClose] = useState(true);
  const [totalCollectionAmount, setTotalCollectionAmount] = useState(0);

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
    if (collectionData) {
      let total = collectionData?.serviceCount
        ?.filter((service) => service?.method != "Wallet")
        .map((item) => item.amount)
        .reduce((prev, curr) => +prev + +curr, 0);

      setTotalCollectionAmount(total);
    }
  }, [collectionData]);

  return (
    <div className="total-sale-box" style={{ margin: "0" }}>
      <div className="total-sale-grid">
        <div className="total-sale-grid-items">
          <div className="sale-child-grid">
            <div className="sale-child-grid-items">
              <div className="total-sale-show-icon">
                {SettingInfo?.currentType}
                {/* <img src={RupeeIcon} alt="StatementIcon" /> */}
              </div>
            </div>
            <div className="sale-child-grid-items">
              <p>Total collection</p>
              <h5>
                <span>{SettingInfo?.currentType}</span> {totalCollectionAmount}
              </h5>
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
            <div className="chart-grid-items">
              {totalCollectionAmount === 0 ? (
                <div className="chart-details-box">
                  <div className="chart-child-grid">
                    <div className="chart-child-grid-items">
                      <div className="child-chart-box">
                        <Doughnut
                          data={nullCollection}
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
                collectionData?.serviceCount
                  ?.filter((service) => service?.method != "Wallet")
                  .map((type, i) => {
                    let serviceColor = colorList
                      .slice(0, collectionData?.serviceCount?.length)
                      .map((color, index) => {
                        if (i === index) {
                          return color;
                        } else {
                          return "#F6F6FF";
                        }
                      });
                    const data = {
                      labels: [type && type.method],
                      datasets: [
                        {
                          backgroundColor: serviceColor,
                          borderWidth: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0,
                          ],
                          hoverBackgroundColor: serviceColor,
                          data: collectionData?.serviceCount
                            ?.filter((service) => service?.method != "Wallet")
                            .map((service) => service.amount),
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
                            <p>{type.method}</p>
                            <h5>{type.amount}</h5>
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

export default TotalCollection;
