import React, { useState } from "react";
import CollepsIcon from "../../../../assets/svg/colleps.png";
import AppointmentIcon from "../../../../assets/svg/appointmentIcon.svg";
import { Doughnut } from "react-chartjs-2";

function TotalAppointment(props) {
  const { saleData,salesDat } = props;  

  const [sectionClose, setSectionClose] = useState(true);

  const totalAppointment = {
    labels: ["Completed", "No shows", "Cancelled"],
    datasets: [
      {
        backgroundColor: ["#FDB45C", "#6F737D", "#F7464A"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#FDB45C", "#6F737D", "#F7464A"],
        data: [saleData?.complete?.reduce((a, b) => a + b, 0), +salesDat?.noShow?.reduce((a, b) => a + b, 0) + +salesDat?.upcoming?.reduce((a, b) => a + b, 0) , salesDat?.cancel?.reduce((a, b) => a + b, 0)],
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
        data: [saleData?.complete?.reduce((a, b) => a + b, 0), salesDat?.noshow?.reduce((a, b) => a + b, 0), salesDat?.cancel?.reduce((a, b) => a + b, 0)],
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
        data: [saleData?.complete?.reduce((a, b) => a + b, 0), salesDat?.noshow?.reduce((a, b) => a + b, 0), salesDat?.cancel?.reduce((a, b) => a + b, 0)],
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
        data: [saleData?.complete, salesDat?.noshow, salesDat?.cancel ],
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
                <img src={AppointmentIcon} alt="StatementIcon" />
              </div>
            </div>
            <div className="sale-child-grid-items">
              <p>Total appointments</p>
              <h5>
                {+salesDat?.noShow?.reduce((a, b) => a + b, 0) + +saleData?.complete?.reduce((a, b) => a + b, 0) + +salesDat?.cancel?.reduce((a, b) => a + b, 0) + +salesDat?.upcoming?.reduce((a, b) => a + b, 0) }
            
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
                {
                  // (salesDat?.totalAppointment === 0 || null) &&
                  (saleData?.complete === 0 || null) &&
                  (salesDat?.noshow === 0 || null) &&
                  (salesDat?.cancel === 0 || null) ? (
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
                        tooltips: {enabled : true},
                      }}
                    />
                  )
                }
              </div>
            </div>
            <div className="chart-grid-items">
              <div className="chart-details-box">
                <div className="chart-child-grid">
                  <div className="chart-child-grid-items">
                    <div className="child-chart-box">
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
                  </div>
                  <div className="chart-child-grid-items">
                    <p>Completed</p>
                    <h5>{saleData?.complete?.reduce((a, b) => a + b, 0)}</h5>
                  </div>
                </div>
              </div>
              <div className="chart-details-box">
                <div className="chart-child-grid">
                  <div className="chart-child-grid-items">
                    <div className="child-chart-box">
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
                  </div>
                  <div className="chart-child-grid-items">
                    <p>No-shows</p>
                    <h5>{+salesDat?.noShow?.reduce((a, b) => a + b, 0) + +salesDat?.upcoming?.reduce((a, b) => a + b, 0)}</h5>
                  </div>
                </div>
              </div>
              <div className="chart-details-box">
                <div className="chart-child-grid">
                  <div className="chart-child-grid-items">
                    <div className="child-chart-box">
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
                  </div>
                  <div className="chart-child-grid-items">
                    <p>Cancelled</p>
                    <h5>{salesDat?.cancel?.reduce((a, b) => a + b, 0)}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TotalAppointment;
