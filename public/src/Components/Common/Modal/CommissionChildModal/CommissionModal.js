import React, { useEffect, useState } from "react";
import "./CommissionModal.scss";
import DownIcon from "../../../../assets/img/gray-down.svg";
import CloseIcon from "../../../../assets/svg/Close.svg";
import OutsideAlerter from "../../OutsideAlerter";
import ServiceCommission from "./ServiceCommission";
import ProductCommission from "./ProductCommission";
import moment from "moment";
import { get_Setting } from "../../../../utils/user.util";

export default function CommissionModal(props) {
  const { toggle, setCommission, editCommission, setDisabled, commissionFlow } =
    props;

  const [monthDropdown, setMonthDropdown] = useState(false);
  const [serviceDisabled, setServiceDisabled] = useState(true);
  const [productDisabled, setProductDisabled] = useState(true);
  const [commissionDetails, setCommissionDetails] = useState({
    effective_month: "January",
    effective_date: moment().startOf("month").format("YYYY-MM-DD"),
    commision_cycle: "Monthly",
    service_commission: false,
    product_commission: false,
    membership_commission: false,
    commission_type: [],
    product_type: [],
    membership_type: [],
  });
  let SettingInfo = get_Setting();
  const [errors, setError] = useState({}); 

  const handleOnOptionSelect = (e, key) => {
    if (key === "month") {
      setCommissionDetails({
        ...commissionDetails,
        effective_month: e.target.innerText,
      });
      setMonthDropdown(false);
    }
  };

  const handleOnToggleChange = (e, key) => {
    if (key === "service") {
      setCommissionDetails({
        ...commissionDetails,
        commission_type: commissionDetails.service_commission
          ? []
          : {
              value: "Standard",
              targetValue: "Sales",
              targetRange: [
                {
                  from: "0",
                  to: "",
                  commission: "",
                  unlimited: true,
                },
              ],
            },
        service_commission: !commissionDetails.service_commission,
      });
    } else if (key === "product") {
      setCommissionDetails({
        ...commissionDetails,
        product_type: [],
        product_commission: !commissionDetails.product_commission,
      });
    }
  };

  //callback service commission data
  const serviceCommissionCallback = (data) => {
    setCommissionDetails({
      ...commissionDetails,
      commission_type: data,
    });
  };

  //callback product commission data
  const productCommissionCallback = (data) => {
    setCommissionDetails({
      ...commissionDetails,
      product_type: data,
    });
  };

  //submit final data
  const handleOnSubmit = () => {
    if (validate()) {
      setCommission([commissionDetails]);
      setDisabled(true);
      toggle();
    }
  };

  const validate = () => {
    let formIsValid = true;
    let errors ={}
    commissionDetails?.commission_type?.targetRange?.map((range, i) => {
      if (
        i ==
        commissionDetails?.commission_type?.targetRange[
          commissionDetails?.commission_type?.targetRange?.length - 1
        ]
      ) {
        if (formIsValid) {
          return (formIsValid = true);
        } else {
          errors["range"] = "* Enter valid Range";
          return (formIsValid = false);
        }
      } else {
        if (parseInt(range.to) < parseInt(range.from)) {
          errors["range"] = "* Enter valid Range";
          return (formIsValid = false);
        } else {
          if (formIsValid) {
            return (formIsValid = true);
          } else {
            errors["range"] = "* Enter valid Range";
            return (formIsValid = false);
          }
        }
      }
    });
    setError(errors)
    return formIsValid;
  };
  useEffect(() => {
    if (editCommission && editCommission.length > 0) {
      setCommissionDetails(editCommission[0]);
    }
  }, [editCommission]);

  return (
    <div>
      <div className="comission-modal-wrapper">
        <div className="comission-modal-md">
          <div className="comission-header">
            <div className="comission-header-alignment">
              <div>
                <div onClick={toggle}>
                  <img src={CloseIcon} alt="close" />
                </div>
                <div>
                  <h1>{editCommission?.length > 0 ? "Edit" : "Add"} commission</h1>
                </div>
              </div>
              <div>
                <button
                  disabled={
                    !commissionDetails?.service_commission &&
                    !commissionDetails?.product_commission
                      ? true
                      : commissionDetails?.service_commission &&
                        !commissionDetails?.product_commission
                      ? serviceDisabled
                      : !commissionDetails?.service_commission &&
                        commissionDetails?.product_commission
                      ? productDisabled
                      : commissionDetails?.service_commission &&
                        commissionDetails?.product_commission &&
                        (serviceDisabled || productDisabled)
                  }
                  onClick={() => handleOnSubmit()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="comission-body">
            <div className="first-section-input">
              <div className="first-section-input-grid">
                <div className="first-section-input-grid-items">
                  <div className="relative-input-cus">
                    <div className="lable-alignment">
                      <div>
                        <label>Effective Month</label>
                      </div>
                      <div>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
                            stroke="#97A7C3"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.5 10V7.5"
                            stroke="#97A7C3"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.5 5H7.50515"
                            stroke="#97A7C3"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="reltive-div">
                    <OutsideAlerter setMonthDropdown={setMonthDropdown}>
                      <div
                        className="icon-inputr-relative"
                        onClick={() => setMonthDropdown(!monthDropdown)}
                      >
                        <input
                          type="text"
                          value={commissionDetails.effective_month}
                          placeholder="Select effective month"
                        />
                        <div className="down-icon-alignment">
                          <img src={DownIcon} alt="DownIcon" />
                        </div>
                      </div>
                      <div
                        className={
                          monthDropdown
                            ? "cus-dropdown dropdown-show"
                            : "cus-dropdown dropdown-hidden"
                        }
                      >
                        <div className="cus-dropdown-design month-scroll">
                          <ul onClick={(e) => handleOnOptionSelect(e, "month")}>
                            <li>January</li>
                            <li>February</li>
                            <li>March</li>
                            <li>April</li>
                            <li>May</li>
                            <li>June</li>
                            <li>July</li>
                            <li>August</li>
                            <li>September</li>
                            <li>October</li>
                            <li>November</li>
                            <li>December</li>
                          </ul>
                        </div>
                      </div>
                    </OutsideAlerter>
                  </div>
                </div>
                <div className="first-section-input-grid-items">
                  <div className="relative-input-cus">
                    <div className="lable-alignment">
                      <div>
                        <label>Commission cycle</label>
                      </div>
                      <div>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
                            stroke="#97A7C3"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.5 10V7.5"
                            stroke="#97A7C3"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.5 5H7.50515"
                            stroke="#97A7C3"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="reltive-div">
                    <input
                      type="text"
                      style={{ pointerEvents: "none" }}
                      value={`Monthly`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="service-commission-section-alignment">
              <div className="section-title-alignment">
                <div>
                  <p>Service commission</p>
                </div>
                <div>
                  <label class="switch">
                    <input
                      type="checkbox"
                      value={commissionDetails.service_commission}
                      checked={commissionDetails.service_commission}
                      onChange={(e) => handleOnToggleChange(e, "service")}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              {commissionDetails.service_commission && (
                <ServiceCommission
                  commissionCallback={serviceCommissionCallback}
                  key={commissionDetails.service_commission}
                  setDisabled={setServiceDisabled}
                  editServiceCommission={commissionDetails.commission_type}
                  commissionFlow={commissionFlow}
                  SettingInfo={SettingInfo}
                  errors={errors}
                />
              )}
            </div>
            <div className="service-commission-section-alignment">
              <div className="section-title-alignment">
                <div>
                  <p>Product commission</p>
                </div>
                <div>
                  <label class="switch">
                    <input
                      type="checkbox"
                      value={commissionDetails.product_commission}
                      checked={commissionDetails.product_commission}
                      onChange={(e) => handleOnToggleChange(e, "product")}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              {commissionDetails.product_commission && (
                <ProductCommission
                  productCommissionCallback={productCommissionCallback}
                  key={commissionDetails.product_commission}
                  setDisabled={setProductDisabled}
                  editProductCommission={commissionDetails.product_type}
                  commissionFlow={commissionFlow}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
