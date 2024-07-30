import React, { useState, useEffect } from "react";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
// import Skeleton from "@material-ui/lab/Skeleton";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { get_Setting } from "../../../utils/user.util";

export default function ViewCustomerSales(props) {
  const { customerDetails } = props;
  const [loading, setLoading] = useState(false);
  const [customerSales, setCustomerSales] = useState();
  const [filteredData, setFilteredData] = useState();
  let SettingInfo = get_Setting()

  const renderMobileSidebar = () => {
    let divEle = document.getElementsByClassName("sidebar-banner")[0];
    divEle.classList.toggle("sidebar-display");
  };

  const getCustomerSales = async (e) => {
    try {
      setLoading(true);
      if (customerDetails) {
        let res = await ApiGet(
          "appointment/customer/" +
            customerDetails.companyId +
            "/" +
            customerDetails.mobileNumber
        );
        if (res.data.status === 200) {
          setLoading(false);
          setCustomerSales(res.data.data);
          setFilteredData(res.data.data.appointmentList);
        } else {
          setLoading(false);
          console.log("in the else");
        }
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Forum", err);
    }
  };

  useEffect(async () => {
    getCustomerSales();
  }, [customerDetails]);

  const handleFilter = async (e) => {
    if (e.target.value === "All") {
      setFilteredData(customerSales.appointmentList);
    } else if (e.target.value === "Completed") {
      // let date = new Date();
      // let date1 = new Date();
      // date1.setDate(date.getDate() - 30);

      // date = moment(date).format('YYYY-MM-DD')
      // date1 = moment(date1).format('YYYY-MM-DD')

      // let filterDate = customerSales.appointmentList && customerSales.appointmentList.filter((obj) => {
      //     if (obj.date >= date1 && obj.date <= date) {
      //         return obj;
      //     }
      // })
      // setFilteredData(filterDate)

      let filterCompleted =
        customerSales.appointmentList &&
        customerSales.appointmentList.filter((obj) => {
          if (obj.status === 1) {
            return obj;
          }
        });
      setFilteredData(filterCompleted);
    } else if (e.target.value === "Cancelled") {
      // let date = new Date();
      // let date1 = new Date();
      // date1.setDate(date.getDate() - 15);

      // date = moment(date).format('YYYY-MM-DD')
      // date1 = moment(date1).format('YYYY-MM-DD')

      // let filterDate = customerSales.appointmentList && customerSales.appointmentList.filter((obj) => {
      //     if (obj.date >= date1 && obj.date <= date) {
      //         return obj;
      //     }
      // })
      // setFilteredData(filterDate)

      let filterCancelled =
        customerSales.appointmentList &&
        customerSales.appointmentList.filter((obj) => {
          if (obj.status === 0) {
            return obj;
          }
        });
      setFilteredData(filterCancelled);
    }
    // else if (e.target.value === "7") {
    //     let date = new Date();
    //     let date1 = new Date();
    //     date1.setDate(date.getDate() - 7);

    //     date = moment(date).format('YYYY-MM-DD')
    //     date1 = moment(date1).format('YYYY-MM-DD')

    //     let filterDate = customerSales.appointmentList && customerSales.appointmentList.filter((obj) => {
    //         if (obj.date >= date1 && obj.date <= date) {
    //             return obj;
    //         }
    //     })
    //     console.log("rtyuioijuhjkl;", filterDate)
    //     setFilteredData(filterDate)

    // }
  };

  // const convertDate = async (date1) => {
  //     console.log("kjshdfjsafd", date1)
  //     function pad2(n) {
  //         return (n < 10 ? '0' : '') + n;
  //     }
  //     var month = pad2(date1.getMonth() + 1);//months (0-11)
  //     var day = pad2(date1.getDate());//day (1-31)
  //     var year = date1.getFullYear();
  //     var formattedDate = day + "-" + month + "-" + year;
  //     return formattedDate;
  // }

  return (
    <>
      <div className="lg:w-7/12 md:w-full pl-3 padding-left-remove t-pl-0">
        <div className="">
          <div className="lg:flex">
            <div className="lg:w-1/3 md:w-full t-pl-0 t-pr-0 t-mt-1 pr-2 padding-left-remove padding-right-remove mobile-view-mt-1">
              <div className="dashboard-box p-3 customer-child">
                <p className="mini-view-heading-style font-size-32 heading-title-text-color font-bold mt-3 tracking-normal">
                  <span className="font-bold rs-font"> {SettingInfo?.currentType} </span>
                  {customerSales && customerSales.finalAmount}
                </p>
                <p className="font-size-22 mini-view-font-size-19 heading-title-text-color font-bold mt-3 mb-3 tracking-normal">
                  Total Sales
                </p>
              </div>
            </div>
            <div className="lg:w-1/3 md:w-full t-pl-0 t-pr-0 t-mt-1 pr-2 pl-2 padding-left-remove padding-right-remove mobile-view-mt-1">
              <div className="dashboard-box p-3 customer-child">
                <p className="mini-view-heading-style font-size-32 heading-title-text-color font-bold mt-3 tracking-normal">
                  {customerSales && customerSales.booking}
                </p>
                <p className="mini-view-font-size-19 font-size-22 heading-title-text-color font-bold mt-3 mb-3 tracking-normal">
                  Bookings
                </p>
              </div>
            </div>
            <div className="lg:w-1/3 md:w-full t-pl-0 pl-2 t-mt-1 padding-left-remove mobile-view-mt-1">
              <div className="dashboard-box p-3 customer-child">
                <p className="mini-view-heading-style font-size-32 danger-text-color font-bold mt-3 tracking-normal">
                  {customerSales && customerSales.cancel}
                </p>
                <p className="mini-view-font-size-19 font-size-22 danger-text-color font-bold mt-3 mb-3 tracking-normal">
                  Cancelled
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center pt-7 justify-between mobile-view-block pl-3">
            <div>
              <p className="font-size-25 heading-title-text-color font-bold mt-3 tracking-normal">
                Past Appointments
              </p>
            </div>
            <div className="mobile-view-mt-1">
              <select
                name="cars"
                id="cars"
                className="form-control dropdown-style font-medium dropdown3"
                onChange={(e) => handleFilter(e)}
              >
                <option
                  className="font-size-18 dark-text-color font-medium"
                  value="All"
                >
                  All appts.
                </option>
                <option
                  className="font-size-18 dark-text-color font-medium"
                  value="Completed"
                >
                  Completed
                </option>
                <option
                  className="font-size-18 dark-text-color font-medium"
                  value="Cancelled"
                >
                  Cancelled
                </option>
              </select>
            </div>
          </div>
          <div className="dashboard-box p-3 mt-7 pr-0">
            <div className="list-price">
              <table width="100%" className="price-data">
                {filteredData && filteredData.length ? (
                  filteredData.map((appointmentDetail) => {
                    return (
                      <tr key={appointmentDetail._id}>
                        <td>
                          <div className="flex items-center">
                            <div className="table-child-width-fix">
                              <span
                                style={{
                                  color:
                                    appointmentDetail.status == 1
                                      ? "#193566"
                                      : "#D60000",
                                }}
                                className="heading-title-text-color leading-6 text-center custome-font font-medium tracking-normal"
                              >
                                {appointmentDetail &&
                                  appointmentDetail.date &&
                                  moment(appointmentDetail.date).format("ll")}
                                <br />
                              </span>
                            </div>
                            <div className="pl-2 module overflow">
                              <span
                                style={{
                                  color:
                                    appointmentDetail.status == 1
                                      ? "#193566"
                                      : "#D60000",
                                }}
                                className="heading-title-text-color custome-font font-bolder tracking-normal leading-6 overflow  "
                              >
                                {appointmentDetail &&
                                  appointmentDetail.serviceId &&
                                  appointmentDetail.serviceId.serviceName}
                              </span>
                              <p
                                style={{
                                  color:
                                    appointmentDetail.status == 1
                                      ? "#193566"
                                      : "#D60000",
                                }}
                                className="past-appointment-font-style font-medium tracking-normal mb-0 leading-6 overflow"
                              >
                                by{" "}
                                {appointmentDetail && appointmentDetail.staff}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td align="right">
                          <span
                            className="font-size-22 tracking-normal font-medium"
                            style={{
                              color:
                                appointmentDetail.status == 1
                                  ? "#193566"
                                  : "#D60000",
                            }}
                          >
                            <span className="rs-font">{SettingInfo?.currentType}</span>{" "}
                            {appointmentDetail &&
                              appointmentDetail.serviceId &&
                              appointmentDetail.serviceId.amount}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className="font-size-20 heading-title-text-color tracking-normal font-medium text-center no-data-height flex items-center justify-center">
                    No past Appointments
                  </div>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
