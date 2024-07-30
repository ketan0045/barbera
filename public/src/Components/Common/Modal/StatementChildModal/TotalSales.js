import React, { useState } from "react";
import CollepsIcon from "../../../../assets/svg/colleps.png";
import StatementIcon from "../../../../assets/svg/statement.png";
import { Pie } from "react-chartjs-2";

function TotalSales(props) {
  const { salesData , SettingInfo } = props;

  const [sectionClose, setSectionClose] = useState(true);

  const totalSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        data: [salesData.service ? (salesData?.service).toFixed(2) : salesData.service , 
              salesData?.products ? (salesData?.products).toFixed(2) : salesData?.products, 
              salesData?.memberships ? (salesData?.memberships).toFixed(2) : salesData?.memberships],
      },
    ],
  };

  const nullTotalSales = {
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

  const serviceSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#D1D9E6", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#D1D9E6", "#D1D9E6"],
        data: [salesData?.service, salesData?.products, salesData?.memberships],
      },
    ],
  };

  const productSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#F4BD6E", "#D1D9E6"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#F4BD6E", "#D1D9E6"],
        data: [salesData?.service, salesData?.products, salesData?.memberships],
      },
    ],
  };

  const membershipSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#D1D9E6", "#D1D9E6", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#D1D9E6", "#D1D9E6", "#0B84A5"],
        data: [salesData?.service, salesData?.products, salesData?.memberships],
      },
    ],
  };

  return (
    <div className="total-sale-box total-sale-bottom-align">
      <div className="total-sale-grid">
        <div className="total-sale-grid-items">
          <div className="sale-child-grid">
            <div className="sale-child-grid-items">
              <div className="total-sale-show-icon">
                <img src={StatementIcon} alt="StatementIcon" />
              </div>
            </div>
            <div className="sale-child-grid-items">
              <p>Total sales</p>
              <h5>
                <span>{SettingInfo?.currentType}</span>{" "}
                {Math.round(salesData?.totalSales) ||
                  +salesData?.products + +salesData?.service}
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
                {(salesData?.products === 0 || null) &&
                (salesData?.service === 0 || null) &&
                (salesData?.totalSales === 0 || null) ? (
                  <Pie
                    data={nullTotalSales}
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
            <div className="chart-grid-items">
              <div className="chart-details-box">
                <div className="chart-child-grid">
                  <div className="chart-child-grid-items">
                    <div className="child-chart-box">
                      {salesData?.service === 0 || null ? (
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
                          data={serviceSales}
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
                  <div className="chart-child-grid-items">
                    <p>Services</p>
                    <h5>
                      <span>{SettingInfo?.currentType}</span> {Math.round(salesData?.service)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="chart-details-box">
                <div className="chart-child-grid">
                  <div className="chart-child-grid-items">
                    <div className="child-chart-box">
                      {salesData?.products === 0 || null ? (
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
                          data={productSales}
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
                  <div className="chart-child-grid-items">
                    <p>Products</p>
                    <h5>
                      <span>{SettingInfo?.currentType}</span> {Math.round(salesData?.products)}
                    </h5>
                  </div>
                </div>
              </div>
              {/* <div className="chart-details-box">
                <div className="chart-child-grid">
                  <div className="chart-child-grid-items">
                    <div className="child-chart-box">
                      {salesData?.memberships === 0 || null ? (
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
                          data={membershipSales}
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
                  <div className="chart-child-grid-items">
                    <p>Membership</p>
                    <h5>
                      <span>{SettingInfo?.currentType}</span> {salesData?.memberships}
                    </h5>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TotalSales;
