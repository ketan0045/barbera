import React, { useEffect, useState } from "react";
import RightIcon from "../../../../assets/svg/group-right.svg";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setVisuals } from "../../../../redux/actions/promoteActions";

export default function DiscountValue() {
  let SettingInfo = JSON.parse(localStorage.getItem("setting"));
  const dispatch = useDispatch();
  const selectedServiceis = useSelector((state)=>state.selectedMainServiceReducer);
  const [discountPrice, setDiscountPrice] = useState("");
  const [selectedway, setSelectedWay] = useState("");


  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="generate-box-center"
      >
        <div className="generate-box-center">
          <div className="campaign-child-box">
            <div className="campaign-child-header">
              <h1>Enter the discount value</h1>
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(5))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            </div>
            <div className="discount-value-box-alignment">
              <div className="offer-discount-alignment">
                <div className="label-style">
                  <label>Offer discount</label>
                </div>
                <div className="grid">
                  <div className="grid-items">
                    <div className="new-input">
                      <input
                        type="text"
                        autoFocus
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="grid-items">
                    <div className="sub-grid">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className={
                          selectedway === SettingInfo?.currentType
                            ? "sub-grid-items activebox"
                            : "sub-grid-items"
                        }
                        onClick={() => setSelectedWay(SettingInfo?.currentType)}
                      >
                        <span>{SettingInfo?.currentType}</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className={
                          selectedway === "%"
                            ? "sub-grid-items activebox"
                            : "sub-grid-items"
                        }
                        onClick={() => setSelectedWay("%")}
                      >
                        <span>%</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="discount-value-box-body">
              <div className="message-preview-box">
                <p>Message preview</p>
                <div className="chat-view-design">
                  <p>Dear Customer name,</p>
                  <span>
                    On this Diwali, get{" "}
                    <a>
                      {discountPrice === "" ? (
                        "discount price"
                      ) : (
                        <>
                          {" "}
                          {discountPrice} {selectedway} {" "}
                        </>
                      )}
                    </a>{" "}
                    off on {selectedServiceis} on your next visit at Gada Hair
                    Salon. See you soon!
                  </span>
                </div>
              </div>
            </div>
            {discountPrice === "" ? (
              <div className="discount-value-continue-box-footer">
                <button>Continue</button>
              </div>
            ) : (
              <div className="discount-value-continue-active-box-footer" onClick={()=>dispatch(setVisuals(7))}>
                <button>Continue</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
