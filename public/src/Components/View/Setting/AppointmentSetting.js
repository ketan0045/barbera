import React, { useState } from "react";
import Auth from "../../../helpers/Auth";

export default function AppointmentSetting(props) {
  const {
    handleOnToggle,
    walkInToggle,
    serviceToggle,
    staffToggle,
    customerForAppointment,
    permission,
  } = props;

  const [key, setKey] = useState("quickAppointments");
 
  
  return (
    <>
    <div>
      <div className="setting-sub-grid">
        <div className="setting-sub-grid-items">
          <div className="cus-tab-design">
            <ul>
              <li
                className={
                  key === "quickAppointments" && "active-tab-cus-background"
                }
                onClick={(e) => setKey("quickAppointments")}
              >
                Quick Appointments
              </li>
              <li
                className={key === "customerA" && "active-tab-cus-background"}
                onClick={(e) => setKey("customerA")}
              >
                Customer
              </li>
            </ul>
          </div>
        </div>
        {key === "quickAppointments" && (
          <div className="setting-sub-grid-items">
            <div>
              <div className="quick-appointment-child">
                <p>Walk-in appointments</p>
                <label
                  class="switch"
                  onChange={(e) => handleOnToggle(e, "walkin")}
                >
                  <input type="checkbox" checked={walkInToggle} 
                  // disabled={permission?.filter(
                  //         (obj) => obj.name === "Settings functions edit"
                  //       )[0]?.isChecked === false ? true : false} 
                  />
                  <span class="slider round"></span>
                </label>
              </div>
              <div className="quick-appointment-child">
                <p>Services</p>
                <label
                  class="switch"
                  onChange={(e) => handleOnToggle(e, "services")}
                >
                  <input type="checkbox" checked={serviceToggle} 
                  // disabled={permission?.filter(
                  //         (obj) => obj.name === "Settings functions edit"
                  //       )[0]?.isChecked === false ? true : false}
                  />
                  <span class="slider round"></span>
                </label>
              </div>
              <div className="quick-appointment-child">
                <p>Staff</p>
                <label
                  class="switch"
                  onChange={(e) => handleOnToggle(e, "staff")}
                >
                  <input type="checkbox" checked={staffToggle} 
                  // disabled={permission?.filter(
                  //         (obj) => obj.name === "Settings functions edit"
                  //       )[0]?.isChecked === false ? true : false}
                  />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        )}
        {key === "customerA" && (
          <div className="setting-sub-grid-items">
            <div className="enable-inventroy-text-alignment">
              <p>Adding customer compulsion</p>
              <label
                class="switch"
                onChange={(e) => handleOnToggle(e, "customer")}
              >
                <input type="checkbox" checked={customerForAppointment} 
                // disabled={permission?.filter(
                //           (obj) => obj.name === "Settings functions edit"
                //         )[0]?.isChecked === false ? true : false}
                />
                <span class="slider round"></span>
              </label>
            </div>
            <div className="you-will-reqire-text">
              <p>
                By turning this switch on, you will be required to add customer
                for every appointment
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
   
    </>
  );
}
