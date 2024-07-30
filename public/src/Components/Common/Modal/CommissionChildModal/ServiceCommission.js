import React, { useEffect, useState } from "react";
import DownIcon from "../../../../assets/img/gray-down.svg";
import OutsideAlerter from "../../OutsideAlerter";
import CloseRedIcon from "../../../../assets/svg/Close-red.svg";

function ServiceCommission(props) {
  const {
    commissionCallback,
    editServiceCommission,
    setDisabled,
    key,
    commissionFlow,
    SettingInfo,
    errors
  } = props;

  const [dropdown, setDropdown] = useState(false);
  const [commissionType, setCommissionType] = useState(false);
  const [targetedCommission, setTargetedCommission] = useState(false);
  const [targetRange, setTargetRange] = useState(false);
  const [showAddRange, setShowAddRange] = useState(true);
  const [targetRangeSelector, setTargetRangeSelector] = useState([
    {
      from: "0",
      to: "",
      commission: "",
      unlimited: true,
    },
  ]);
  const [serviceCommission, setServiceCommission] = useState({
    value: "Standard",
    targetValue: "Sales",
    targetRange: [],
    // tieredCommission: false,
  });
  
  //input binder
  const bindInput = (value, key) => {
    if (key === "number") {
      var regex = new RegExp("^[^0-9]*$");
      var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
      if (regex.test(key)) {
        value.preventDefault();
        return false;
      }
    } else {
      var regex = new RegExp("^[^0-9.]*$");
      var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
      if (regex.test(key)) {
        value.preventDefault();
        return false;
      }
    }
  };

  //dropdown and checkbox selection handler
  const handleOnOptionSelect = (e, key) => {
    if (key === "cType") {
      //commission-droopdown
      setServiceCommission({
        ...serviceCommission,
        value: e.target.id,
        targetValue: e.target.id === "Target based" ? "Sales" : "",
      });
      //object reset
      setTargetRange(false);
      setTargetRangeSelector([
        {
          from: "0",
          to: "",
          commission: "",
          unlimited: true,
        },
      ]);
      setCommissionType(false);
    } else if (key === "tType") {
      //target-dropdown
      setServiceCommission({
        ...serviceCommission,
        targetValue: e.target.id,
      });
      setTargetedCommission(false);

      //target range conditional rendering
      if (e.target.id === "Sales" || e.target.id === "Salary") {
        setShowAddRange(true);
        setTargetRange(false);
      } else {
        setTargetRange(false);
        setShowAddRange(false);
      }
      setTargetRangeSelector([
        {
          from: "0",
          to: "",
          commission: "",
          unlimited: true,
        },
      ]);
      // } else if (key === "tiered") {
      //   //checkbox-tiered
      //   setServiceCommission({
      //     ...serviceCommission,
      //     tieredCommission: !serviceCommission.tieredCommission,
      //   });
    }
  };

  //single input change handler
  const handleOnChange = (e, key) => {
    let data = targetRangeSelector;
    let index = 0;
    if (key === "tAmount") {
      data[index].to = e.target.value;
    } else if (key === "commission") {
      data[index].commission = e.target.value
        .toString()
        .split(".")
        .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
        .join(".");
      data[index].to = "0";
    } else if (key === "tCommission") {
      data[index].commission = e.target.value
        .toString()
        .split(".")
        .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
        .join(".");
    }
    setTargetRangeSelector([...data]);
  };

  //target range input change handler
  const handleOnTargetRangeChange = (e, key, index) => {
    let data = targetRangeSelector;
    let length = data.length; 
    if (key === "from") {
      data[index].from = e.target.value;
      data[index - 1].to = e.target.value;
    } else if (key === "to") {
      data[index].to = e.target.value;
      data[index + 1].from = e.target.value;
    } else if (key === "commission") {
      data[index].commission = e.target.value
        .toString()
        .split(".")
        .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
        .join(".");
    }
    data[index].unlimited = length === index + 1 ? true : false;
    setTargetRangeSelector([...data]);
  };

  //add-remove range input handler
  const handleOnClick = (e, key, index) => {
    if (key === "add") {
      setTargetRange(true);
      if (targetRangeSelector.length > 1) {
        targetRangeSelector.push({
          from: "",
          to: "",
          commission: "",
          unlimited: true,
        });
      } else {
        targetRangeSelector.push({
          from: targetRangeSelector[0].to,
          to: "",
          commission: "",
          unlimited: true,
        });
      }
      setTargetRangeSelector([...targetRangeSelector]);
    } else if (key === "remove") {
      if (targetRangeSelector.length > 2) {
        let data = targetRangeSelector;
        data.splice(index, 1);
        data[index - 1].to = "";
        setTargetRangeSelector([...data]);
      } else {
        setTargetRange(false);
        setTargetRangeSelector([
          {
            from: "0",
            to: "",
            commission: "",
            unlimited: true,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    if (commissionFlow === "edit") {
      setServiceCommission(editServiceCommission);
      setTargetRangeSelector(editServiceCommission?.targetRange);
      setTargetRange(editServiceCommission?.wideRange);
    }
  }, [commissionFlow]);

  useEffect(async () => {
    //final object generator
    let commissiondata;
    if (serviceCommission.value === "Standard") {
      commissiondata = {
        value: serviceCommission.value,
        targetRange: targetRangeSelector,
      };
    } else if (serviceCommission.value === "Target based") {
      commissiondata = {
        value: serviceCommission.value,
        targetValue: serviceCommission.targetValue,
        targetRange: targetRangeSelector,
        wideRange: targetRange,
        // tieredCommission: serviceCommission.tieredCommission,
      };
    }
    if (!key) {
      setDisabled(
        targetRangeSelector?.length > 0 &&
          targetRangeSelector?.filter(
            (item, index) =>
              (targetRangeSelector?.length - 1 === index ? item.to === "1" : item.to === "") ||
              item.commission === "" ||
              item.commission > 100 ||
              item.from === ""
          ).length > 0
      );
    } else {
      setDisabled(false);
    }
    await commissionCallback(commissiondata);
  }, [serviceCommission, targetRangeSelector]);

  return (
    <div>
      <div className="service-commission-body">
        <div className="input-bottom-alignment">
          <div className="relative-input-cus">
            <div className="lable-alignment">
              <div>
                <label>Commission type</label>
              </div>
            </div>
            <div className="reltive-div">
              <OutsideAlerter setCommissionType={setCommissionType}>
                <div
                  className="icon-inputr-relative"
                  onClick={() => setCommissionType(!commissionType)}
                >
                  <input type="text" value={serviceCommission.value} />
                  <div className="down-icon-alignment">
                    <img src={DownIcon} alt="DownIcon" />
                  </div>
                </div>
                <div
                  className={
                    commissionType ? "cus-dropdown dropdown-show" : "cus-dropdown dropdown-hidden"
                  }
                >
                  <div className="cus-dropdown-design">
                    <ul onClick={(e) => handleOnOptionSelect(e, "cType")}>
                      <li id="Standard">
                        <b id="Standard">Standard</b>
                        <br />
                        <span id="Standard">
                          The standard commission type calculates the flat commission rate on every
                          sale the staff has made
                        </span>
                      </li>
                      <li id="Target based">
                        <b id="Target based">Target based</b>
                        <br />
                        <span id="Target based">
                          The target based commission type calculates the commission rate only after
                          a fixed target sales has been achieved by the staff
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </OutsideAlerter>
            </div>
          </div>
        </div>

        {serviceCommission.value === "Standard" && (
          <div className="input-bottom-alignment">
            <div className="relative-input-cus">
              <div className="lable-alignment">
                <div>
                  <label>Commission %</label>
                </div>
              </div>
            </div>
            <div className="reltive-div">
              <div className="icon-inputr-relative">
                {/* <div className="input-width-big"> */}
                <input
                  type="text"
                  placeholder="Enter Value"
                  value={targetRangeSelector[0].commission}
                  onChange={(e) => handleOnChange(e, "commission")}
                  maxLength="5"
                  onKeyPress={bindInput}
                />
                {/* </div> */}
                {/* <div className="input-width-small">
                  <input type="text" placeholder="%" />
                  <div className="down-icon-alignment">
                    <img src={DownIcon} alt="DownIcon" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}

        {serviceCommission.value === "Target based" && (
          <div className="input-bottom-alignment">
            <div className="relative-input-cus">
              <div className="lable-alignment">
                <div>
                  <label>When target achieved, calculate commission from</label>
                </div>
              </div>
            </div>
            <div className="reltive-div">
              <OutsideAlerter setTargetedCommission={setTargetedCommission}>
                <div
                  className="icon-inputr-relative"
                  onClick={() => setTargetedCommission(!targetedCommission)}
                >
                  <input
                    type="text"
                    placeholder="Select type"
                    value={serviceCommission.targetValue}
                    readOnly
                  />

                  {/* <div className="input-width-small"> */}
                  {/* <input type="text" placeholder="%" /> */}
                  <div className="down-icon-alignment">
                    <img src={DownIcon} alt="DownIcon" />
                  </div>
                  {/* </div> */}
                </div>
                <div
                  className={
                    targetedCommission
                      ? "cus-dropdown dropdown-show"
                      : "cus-dropdown dropdown-hidden"
                  }
                >
                  <div className="cus-dropdown-design">
                    <ul onClick={(e) => handleOnOptionSelect(e, "tType")}>
                      <li id="Sales">
                        <b id="Sales">Sales</b>
                        <br />
                        <span id="Sales">
                          The commission will be calculated on the sales amount the staff has
                          achieved
                        </span>
                      </li>
                      <li id="Salary">
                        <b id="Salary">Salary</b>
                        <br />
                        <span id="Salary">
                          The commission will be calculated on the salary the staff earns
                        </span>
                      </li>
                      <li id="Difference">
                        <b id="Difference">Difference</b>
                        <br />
                        <span id="Difference">
                          The commission will be calculated on the difference between the target
                          amount and total sales
                        </span>
                      </li>
                      {/* <li id="Target amount">
                        <b id="Target amount">Target amount</b>
                        <br />
                        <span id="Target amount">
                          The commission will be calculated on the target amount of the staff
                        </span>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </OutsideAlerter>
            </div>
            {targetRange ? (
              <div className="relative-input-cus target-range-top-alignment">
                <div className="lable-alignment">
                  <div>
                    <label>Target amount - range</label>
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
                  {<span style={{ color: "red", top: "5px", fontSize: "10px" }}> {errors["range"]} </span>}
                </div>

                {targetRangeSelector.map((item, index) => {
                  return (
                    <div className="commision-add-range-box-size">
                      <div className="commissiom-add-range-box-padding-size">
                        {targetRangeSelector.length === index + 1 && (
                          <div
                            className="close-btn-create"
                            onClick={(e) => handleOnClick(e, "remove", index)}
                          >
                            <img src={CloseRedIcon} alt="CloseIcon" />
                          </div>
                        )}

                        <div className="from-to-commission-row-input">
                          <div className="commission-width-display">
                            <div className="from-to-label-design">
                              <div>
                                <div className="lable-alignment">
                                  <div>
                                    <label>From</label>
                                  </div>
                                </div>

                                <div className="reltive-div">
                                  <div className="icon-inputr-relative">
                                    <input
                                      type="text"
                                      placeholder="0.0"
                                      value={item.from}
                                      disabled={index === 0}
                                      onChange={(e) => handleOnTargetRangeChange(e, "from", index)}
                                    />
                                    <span className="down-icon-alignment opacity-class">
                                      <a>{SettingInfo?.currentType}</a>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="lable-alignment">
                                  <div>
                                    <label>To</label>
                                  </div>
                                </div>

                                <div className="reltive-div">
                                  <div className="icon-inputr-relative">
                                    <input
                                      type="text"
                                      placeholder={
                                        targetRangeSelector.length === index + 1 ? "∞" : "0.0"
                                      }
                                      value={
                                        targetRangeSelector.length === index + 1 ? "" : item.to
                                      }
                                      disabled={targetRangeSelector.length === index + 1}
                                      onChange={(e) => handleOnTargetRangeChange(e, "to", index)}
                                    />
                                    <span className="down-icon-alignment opacity-class">
                                      <a>{SettingInfo?.currentType}</a>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="commission-width-display">
                            <div className="lable-alignment">
                              <div>
                                <label>Commission %</label>
                              </div>
                            </div>

                            <div className="reltive-div">
                              <div className="icon-inputr-relative">
                                {/* <div className="commission-input-field-big-width"> */}
                                <input
                                  type="text"
                                  placeholder="Enter value"
                                  value={item.commission}
                                  onChange={(e) =>
                                    handleOnTargetRangeChange(e, "commission", index)
                                  }
                                />
                                {/* </div> */}
                                {/* <div className="commission-input-field-small-width">
                              <input type="text" placeholder="%" />

                              <div className="down-icon-alignment">
                                <img src={DownIcon} alt="DownIcon" />
                              </div>
                            </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* {serviceCommission.targetValue === "Sales" &&
                          targetRangeSelector.length === index + 1 && (
                            <div className="checkbox-tiered-commission-text">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={serviceCommission.tieredCommission}
                                  onChange={(e) => handleOnOptionSelect(e, "tiered")}
                                />
                              </div>

                              <div className="checkbox-tiered-commission-text-size-design">
                                <span>Tiered commission</span>
                              </div>
                            </div>
                          )} */}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="first-section-input-grid">
                <div className="first-section-input-grid-items">
                  <div className="relative-input-cus">
                    <div className="lable-alignment">
                      <div>
                        <label>Target amount</label>
                      </div>
                    </div>
                  </div>
                  <div className="reltive-div">
                    <input
                      type="text"
                      placeholder="Enter Value"
                      value={targetRangeSelector[0].to}
                      onChange={(e) => handleOnChange(e, "tAmount")}
                      onKeyPress={(e) => bindInput(e, "number")}
                    />
                  </div>
                </div>
                <div className="first-section-input-grid-items">
                  <div className="relative-input-cus">
                    <div className="lable-alignment">
                      <div>
                        <label>Commission %</label>
                      </div>
                    </div>
                  </div>
                  <div className="reltive-div">
                    <div className="icon-inputr-relative">
                      <input
                        type="text"
                        placeholder="Enter Value"
                        value={targetRangeSelector[0].commission}
                        onChange={(e) => handleOnChange(e, "tCommission")}
                        maxLength="5"
                        onKeyPress={bindInput}
                      />
                      {/* <div className="down-icon-alignment" onClick={() => setDropdown(!dropdown)}>
                        <img src={DownIcon} alt="DownIcon" />
                      </div> */}
                    </div>

                    {/* <div className="commission-width-display">

                      <div className="reltive-div">
                        <div className="icon-inputr-relative" >
                          <div className="commission-input-field-big-width">
                            <input type="text" placeholder="10" />
                          </div>

                          <div className="commission-input-field-small-width">
                            <input type="text" placeholder="%" />

                            <div className="down-icon-alignment">
                              <img src={DownIcon} alt="DownIcon" />
                            </div>

                          </div>

                        </div>
                      </div>
                    </div> */}

                    {/* <div
                      className={
                        dropdown ? "cus-dropdown dropdown-show" : "cus-dropdown dropdown-hidden"
                      }
                    >
                      <div className="cus-dropdown-design">
                        <ul>
                          <li>On salary day</li>
                          <li>On salary day</li>
                          <li>On salary day</li>
                          <li>On salary day</li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            )}
            {showAddRange && (
              <div className="add-range" onClick={(e) => handleOnClick(e, "add")}>
                <p>+ Add range</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceCommission;
