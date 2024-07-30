import React, { useState } from "react";
import "./monitization.scss";

export default function ApplyCoupon(props) {
  const { toggle, setCouponCode } = props;
  const [coupon, setCoupon] = useState();
  const [errors, setError] = useState({});

  const ApplyCoupenCode = () => {
    let errors = {};
    if (coupon === "BRB25") {
      setCouponCode(coupon);
      toggle(coupon);
    } else {
      errors["coupon"] = "* Invalid coupon!";
      setError(errors);
    }
  };

  return (
    <>
      <div className="apply-coupong-content-modal-alignment">
        <div className="apply-coupon-modal">
          <div className="modal-header" style={{ height: "auto" }}>
            <div onClick={() => toggle()}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.25 1.25L11.75 11.75"
                  stroke="#193566"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M1.25 11.75L11.75 1.25"
                  stroke="#193566"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div>
              <h2>Apply coupon</h2>
            </div>
          </div>
          <div className="apply-coupon-modal-body">
            <div className="coupon-code-input">
              <label>
                Enter coupon code
                {
                  <span style={{ color: "red", top: "5px", fontSize: "10px" }}>
                    {" "}
                    {errors["coupon"]}{" "}
                  </span>
                }
              </label>
              <input
                type="text"
                placeholder="Ex. BRB45"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </div>
            <div className="coupon-code-footer-alignment">
              <span onClick={() => toggle()}>Cancel</span>
              {coupon ? (
                <button onClick={() => ApplyCoupenCode()}>Apply</button>
              ) : (
                <button disabled>Apply</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
