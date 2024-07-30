import React, { useState } from "react";
import InvoiceIcon from "../../../assets/svg/mobile-view-invoice.svg";
import { Pie } from "react-chartjs-2";
import UserIcon from "../../../assets/svg/feather_user.svg";
import MailIcon from "../../../assets/svg/mail.svg";
import DueStatementIcon from "../../../assets/svg/Icon.png";

export default function UserOverview(props) {
  const {
    currentType,
    salesData,
    currentInvoices,
    customersAdded,
    dueCount,
    dueAmountTotal,
    appointmentNo,
    currentInvoicesNo,
  } = props;

  const totalSales = {
    labels: ["Services", "Products", "Membership"],
    datasets: [
      {
        backgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        borderWidth: [0, 0, 0],
        hoverBackgroundColor: ["#46BFBD", "#F4BD6E", "#0B84A5"],
        data: [
          Math.round(salesData.service),
          Math.round(salesData?.products),
          Math.round(salesData?.memberShip),
        ],
      },
    ],
  };

  const nullTotalSales = {
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
        data: [salesData?.service, salesData?.products, salesData?.memberShip],
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
        data: [salesData?.service, salesData?.products, salesData?.memberShip],
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
        data: [salesData?.service, salesData?.products, salesData?.memberShip],
      },
    ],
  };

  return (
    <>
      <div className="sales-first-boxs">
        <div className="icon-text-grid">
          <div className="icon-text-grid-items">
            <div className="icon-design-alignment">
              <img src={InvoiceIcon} alt="InvoiceIcon" />
            </div>
          </div>
          <div className="icon-text-grid-items">
            <h5>Total sales recorded</h5>
            <p>
              <a>{currentType} </a>{" "}
              {Math.round(salesData?.service) +
                +Math.round(salesData?.products) +
                +Math.round(salesData?.memberShip)}
            </p>
          </div>
        </div>
        <div className="first-box-chart-grid">
          <div className="first-box-chart-grid-items">
            <div className="chart-alignment">
              {salesData?.products === undefined &&
              salesData?.service === undefined &&
              salesData?.memberShip === undefined ? (
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
          <div className="first-box-chart-grid-items">
            <div className="all-box-alignment">
              <div className="box-design">
                <div className="box-design-items">
                  <div className="box-icon-alignment">
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
                <div className="box-design-items">
                  <p>Service</p>
                  <h5>
                    <a>{currentType}</a> {Math.round(salesData?.service)}
                  </h5>
                </div>
              </div>
              <div className="box-design">
                <div className="box-design-items">
                  <div className="box-icon-alignment">
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
                <div className="box-design-items">
                  <p>Products</p>
                  <h5>
                    <a>{currentType}</a> {Math.round(salesData?.products)}
                  </h5>
                </div>
              </div>
              <div className="box-design">
                <div className="box-design-items">
                  <div className="box-icon-alignment">
                    {salesData?.memberShip === 0 || null ? (
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
                <div className="box-design-items">
                  <p>Membership</p>
                  <h5>
                    <a>{currentType}</a> {+salesData?.memberShip}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="full-width-box-alignments">
        <div className="full-width-box">
          <div className="grid">
            <div className="grid-items">
              <div className="icon-design green-opacity-background ">
                <img src={InvoiceIcon} alt="InvoiceIcon" />
              </div>
            </div>
            <div className="grid-items">
              <p>No. of generated invoices</p>
              <h4> {currentInvoices}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-items-align">
        <div className="grid-header">
          <div className="grid-header-items">
            <div className="icon-center-alignment-box blue-opacity-background">
              <img src={UserIcon} alt="UserIcon" />
            </div>
          </div>
          <div className="grid-header-items">
            <p>No. of customers added to system</p>
            <h4>{customersAdded}</h4>
          </div>
          <div></div>
        </div>
      </div>
      <div className="all-type-chart-two-col-grids">
        <div className="all-type-chart-two-col-grid-items">
          <div className="type-grid">
            <div className="type-grid-items due-opacity-background">
              <img src={DueStatementIcon} alt="DueStatementIcon" />
            </div>
            <div className="type-grid-items">
              <div>
                <p>Due invoices</p>
                <h6>{dueCount || 0}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="all-type-chart-two-col-grid-items">
          <div className="type-grid">
            <div className="type-grid-items due-opacity-background">
              <span>
                <a>{currentType}</a>{" "}
              </span>
            </div>
            <div className="type-grid-items">
              <div>
                <p>Due amount</p>
                <h6>
                  <a>{currentType}</a> {dueAmountTotal || 0}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-items-align">
        <div className="grid-header">
          <div className="grid-header-items">
            <div className="icon-center-alignment-box blue-opacity-background">
              <img src={MailIcon} alt="UserIcon" />
            </div>
          </div>
          <div className="grid-header-items">
            <p>Total number of notifications sent to customers</p>
            <h4>{appointmentNo + currentInvoicesNo}</h4>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
