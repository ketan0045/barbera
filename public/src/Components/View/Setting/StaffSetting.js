import React from "react";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import OutsideAlerter from "../../Common/OutsideAlerter";

export default function StaffSetting(props) {
  const {
    handleOnToggle,
    handleOnClick,
    attendanceToggle,
    attendanceForInvoiceToggle,
    bufferOptions,
    setBufferOptions,
    bufferTime,
    permission,
  } = props;

  return (
    <div>
      <div className="setting-sub-grid">
        <div className="setting-sub-grid-items">
          <div className="cus-tab-design">
            <ul>
              <li className="active-tab-cus-background">Attendance</li>
            </ul>
          </div>
        </div>
        <div className="setting-sub-grid-items">
          <div>
            <div className="quick-appointment-child">
              <p>Enable attendance</p>
              <label
                class="switch"
                onChange={(e) => handleOnToggle(e, "attendance")}
              >
                <input type="checkbox" checked={attendanceToggle} />
                <span class="slider round"></span>
              </label>
            </div>
            {attendanceToggle && (
              <>
                <div className="quick-appointment-child">
                  <p>Staff attendance compulsion for Invoices/ Appointments</p>
                  <label
                    class="switch"
                    onChange={(e) => handleOnToggle(e, "attendanceForInvoice")}
                  >
                    <input
                      type="checkbox"
                      checked={attendanceForInvoiceToggle}
                      // disabled={permission?.filter(
                      //         (obj) => obj.name === "Settings functions edit"
                      //       )[0]?.isChecked === false ? true : false}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
                {/* <div className="product-type-menu-alignment">
              <p>Time buffer</p>
              <div className="relative">
                <OutsideAlerter setBufferOptions={setBufferOptions}>
                  <button
                    onClick={() => setBufferOptions(!bufferOptions)}
                    // disabled={permission?.filter(
                    //       (obj) => obj.name === "Settings functions edit"
                    //     )[0]?.isChecked === false ? true : false}
                  >
                    {bufferTime ? bufferTime : "15 min"}
                    <img src={DropDownIcon} alt="DropDownIcon" />
                  </button>
                </OutsideAlerter>
                <div
                  className={
                    bufferOptions
                      ? "retail-menu-design retail-menu-open"
                      : "retail-menu-design retail-menu-close"
                  }
                >
                  <div className="retails-dropdown-box">
                    <ul onClick={(e) => handleOnClick(e, "attendance")}>
                      <li>5 mins</li>
                      <li>10 mins</li>
                      <li>15 mins</li>
                      <li>30 mins</li>
                      <li>45 mins</li>
                      <li>60 mins</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
