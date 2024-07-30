import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ApiGet } from "../../../../helpers/API/ApiData";
import RightIcon from "../../../../assets/svg/group-right.svg";
import NewRightArrow from "../../../../assets/svg/new-right.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setDiscount,
  setVisuals,
} from "../../../../redux/actions/promoteActions";

export default function SpecificService() {
  let SettingInfo = JSON.parse(localStorage.getItem("setting"));
  // let currency = JSON.stringify(SettingInfo?.currentType);
  const dispatch = useDispatch();
  const selectedService = useSelector(
    (state) => state.selectedMainServiceReducer
  );
  const selectedMethod = useSelector((state) => state.selectedMethodReducer);
  const selectedFestival = useSelector(
    (state) => state.selectedFestivalReducer
  );
  const [serviceSelected, setServiceSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discountPrice, setDiscountPrice] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [inputRed, setInputRed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const discountedPrice = useSelector((state) => state.selectedDiscountReducer);
  let finalDiscount = discountedPrice.slice(0, discountedPrice.length - 1);
  // const [selectedway, setSelectedWay] = useState(SettingInfo?.currentType);
  const [selectedway, setSelectedWay] = useState("%");
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const selectedServiceis = useSelector(
    (state) => state.selectedMainServiceReducer
  ).toLowerCase();
  console.log("finalDiscount", finalDiscount);

  useEffect(() => {
    if (discountedPrice && !discountPrice) {
      console.log("discountedPrice", finalDiscount);
      setDiscountPrice(finalDiscount);
    }
  }, [discountedPrice]);
  useEffect(() => {
    getServices();
    getAllCategories();
    console.log("specific festival", selectedFestival?.name);
  }, []);

  const getServices = async () => {
    await ApiGet("service/company/" + userInfo.companyId).then((resp) => {
      let filterservice = resp.data.data.filter((obj) =>
        obj.categoryName === "Unassign" ? null : obj
      );
      // console.log("filterservice", filterservice);
      setServiceSelected(filterservice);
    });
  };
  const getAllCategories = async (e) => {
    try {
      let res = await ApiGet("category/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setCategories(
          res.data.data.filter((rep) =>
            rep.categoryName === "Unassign" ? null : rep
          )
        );
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };
  const handleSubService = (listed) => {
    dispatch(setVisuals(6));
  };
  const handleDiscountPrice = (typed) => {
    if (selectedway === "%") {
      if (typed < 1 || typed > 100) {
        setShowMsg(true);
        setErrorMsg("Enter valid input");
        setInputRed(true);
        setDiscountPrice(typed);
      } else {
        setShowMsg(false);
        setErrorMsg("");
        setInputRed(false);
        setDiscountPrice(typed);
      }
    } else {
      setShowMsg(false);
      setErrorMsg("");
      setDiscountPrice(typed);
      setInputRed(false);
    }
  };

  const handleSelectedWay = (e, key) => {
    console.log("keyis", key);
    // if (key === SettingInfo?.currentType) {
    if (key === "₹") {
      setSelectedWay("₹");
      // setSelectedWay(SettingInfo?.currentType);
      if (discountPrice > 0) {
        setErrorMsg("");
        setShowMsg(false);
        setInputRed(false);
        setDiscountPrice(discountPrice);
      } else {
        setShowMsg(false);
        setErrorMsg("");
        setInputRed(false);
      }
    } else {
      setSelectedWay("%");
      if (discountPrice <= 100) {
        setErrorMsg("");
        setShowMsg(false);
        setInputRed(false);
        setDiscountPrice(discountPrice);
      } else {
        setShowMsg(true);
        setErrorMsg("Enter valid input");
        setInputRed(true);
        setDiscountPrice(discountPrice);
      }
    }
  };

  const saveDiscount = () => {
    dispatch(setVisuals(7));
    dispatch(setDiscount(discountPrice + selectedway));
  };

  console.log("discountedPrice", discountedPrice);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="generate-box-center"
    >
      <div className="campaign-child-box">
        {selectedService === "Selected Services" && (
          <div className="generate-box-center">
            <div className="campaign-child-box">
              <div className="campaign-child-header">
                <h1>Enter the discount value</h1>
                <div
                  className="right-icon-alignment"
                  onClick={() => dispatch(setVisuals(4))}
                >
                  <img src={RightIcon} alt="RightIcon" />
                </div>
              </div>
              <div className="discount-value-box-alignment">
                <div className="offer-discount-alignment">
                  <div className="label-style">
                    <label>Offer discounts</label>
                  </div>
                  <div className="grid">
                    <div className="grid-items">
                      <div className="new-input">
                        <input
                          className={inputRed && "inputError"}
                          autoFocus
                          type="text"
                          maxLength={5}
                          value={discountPrice}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onChange={(e) => handleDiscountPrice(e.target.value)}
                          placeholder="Enter value"
                        />
                        <p className="error-message">{errorMsg}</p>
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
                          onClick={(e) =>
                            handleSelectedWay(e, SettingInfo?.currentType)
                          }
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
                          onClick={(e) => handleSelectedWay(e, "%")}
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
                  {selectedMethod === "Festival offers" && (
                    <div className="chat-view-design">
                      <p>Dear (Customer name),</p>
                      <p>
                        On this {selectedFestival?.name}, get{" "}
                        <a style={{ color: "#1479FF" }}>
                          {discountPrice === "" ? (
                            "discount is"
                          ) : (
                            <>
                              {" "}
                              {selectedway === "%" ? (
                                <>{discountPrice}%</>
                              ) : (
                                <>Rs.{discountPrice}</>
                              )}
                              {/* {discountPrice} {selectedway === "₹" ? "Rs" : "%"}{" "} */}
                            </>
                          )}
                        </a>{" "}
                        off on {selectedServiceis} at {userInfo?.businessName}.
                      </p>
                      <p>Valid till(Date Month)</p>
                      {/* <p>Messages by Barbera</p> */}
                    </div>
                  )}
                  {selectedMethod === "General offer" && (
                    <div className="chat-view-design">
                      <p>Dear(Customer name),</p>
                      <p>
                        Get{" "}
                        <a style={{ color: "#1479FF" }}>
                          {discountPrice === "" ? (
                            "discount"
                          ) : (
                            <>
                              {" "}
                              {/* {discountPrice}{" "} */}
                              {console.log("in the box 91", selectedway)}
                              {selectedway === "%" ? (
                                <>{discountPrice}%</>
                              ) : (
                                <>Rs.{discountPrice}</>
                              )}
                              {/* {selectedway === "₹" ? "Rs" : "%"} */}{" "}
                            </>
                          )}
                        </a>{" "}
                        off on {selectedServiceis} at {userInfo?.businessName}.
                        Valid till(Date Month)
                      </p>
                      {/* <p>Messages by Barbera</p> */}
                    </div>
                  )}
                </div>
              </div>
              {discountPrice === "" || showMsg ? (
                <div className="discount-value-continue-box-footer">
                  <button>Continue</button>
                </div>
              ) : (
                <div
                  className="discount-value-continue-active-box-footer"
                  // onClick={() => dispatch(setVisuals(7))}
                  onClick={() => saveDiscount()}
                >
                  <button>Continue</button>
                </div>
              )}
            </div>
          </div>
        )}
        {selectedService === "All Services" && (
          <div className="generate-box-center">
            <div className="campaign-child-box">
              <div className="campaign-child-header">
                <h1>Enter the discount value</h1>
                <div
                  className="right-icon-alignment"
                  onClick={() => dispatch(setVisuals(4))}
                >
                  <img src={RightIcon} alt="RightIcon" />
                </div>
              </div>
              <div className="discount-value-box-alignment">
                <div className="offer-discount-alignment">
                  <div className="label-style">
                    <label>Offer discounts</label>
                  </div>
                  <div className="grid">
                    <div className="grid-items">
                      <div className="new-input">
                        <input
                          className={inputRed && "inputError"}
                          autoFocus
                          type="text"
                          maxLength={5}
                          value={discountPrice}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onChange={(e) => handleDiscountPrice(e.target.value)}
                          placeholder="Enter value"
                        />
                        <p className="error-message">{errorMsg}</p>
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
                          onClick={(e) =>
                            handleSelectedWay(e, SettingInfo?.currentType)
                          }
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
                          onClick={(e) => handleSelectedWay(e, "%")}
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
                  {selectedMethod === "Festival offers" && (
                    <div className="chat-view-design">
                      <p>Dear (Customer name),</p>
                      <p>
                        On this {selectedFestival?.name}, get{" "}
                        <a style={{ color: "#1479FF" }}>
                          {discountPrice === "" ? (
                            "discount"
                          ) : (
                            <>
                              {" "}
                              {selectedway === "%" ? (
                                <>{discountPrice}%</>
                              ) : (
                                <>Rs.{discountPrice}</>
                              )}
                              {/* {discountPrice} {selectedway === "₹" ? "Rs" : "%"} */}{" "}
                            </>
                          )}
                        </a>{" "}
                        off on {selectedServiceis} at {userInfo?.businessName}.
                      </p>
                      <p>Valid till(Date Month)</p>
                      {/* <p>Messages by Barbera</p> */}
                    </div>
                  )}
                  {selectedMethod === "General offer" && (
                    <div className="chat-view-design">
                      <p>Dear(Customer name),</p>
                      <p>
                        Get{" "}
                        <a style={{ color: "#1479FF" }}>
                          {discountPrice === "" ? (
                            "discount"
                          ) : (
                            <>
                              {" "}
                              {selectedway === "%" ? (
                                <>{discountPrice}%</>
                              ) : (
                                <>Rs.{discountPrice}</>
                              )}
                              {/* {discountPrice} {selectedway === "₹" ? "Rs" : "%"} */}{" "}
                            </>
                          )}
                        </a>{" "}
                        off on {selectedServiceis} at {userInfo?.businessName}.
                      </p>
                      <p>Valid till(Date Month)</p>
                      {/* <p>Messages by Barbera</p> */}
                    </div>
                  )}
                </div>
              </div>
              {discountPrice === "" || discountPrice < 1 || showMsg ? (
                <div className="discount-value-continue-box-footer">
                  <button>Continue</button>
                </div>
              ) : (
                <div
                  className="discount-value-continue-active-box-footer"
                  // onClick={() => dispatch(setVisuals(7))}
                  onClick={() => saveDiscount()}
                >
                  <button>Continue</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* Apply after campaign-child-box */
{
  /* <div className="campaign-child-header">
          <h1>Start a new campaign for</h1>
          <div
            className="right-icon-alignment"
            onClick={() => dispatch(setVisuals(4))}
          >
            <img src={RightIcon} alt="RightIcon" />
          </div>
        </div> */
}
{
  /* {selectedService === "Single Service" && (
          <>
            <div className="campaign-child-header">
              <h1>Enter the discount value</h1>
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(3))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            </div>
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                {serviceSelected?.map((list) => {
                  return (
                    <div
                      className="greeting-box-design"
                      onClick={() => handleSubService(list?.serviceName)}
                      // onClick={() => handleFestivalOffer(festival)}
                    >
                      <span className="pr-4">{list?.serviceName}</span>
                      <img src={NewRightArrow} alt="NewRightArrow" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        {selectedService === "Single Category" && (
          <>
            <div className="campaign-child-header">
              <h1>Enter the discount value</h1>
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(4))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            </div>
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                {categories?.map((list) => {
                  return (
                    <div
                      className="greeting-box-design"
                      onClick={() => dispatch(setVisuals(6))}
                      // onClick={() => handleFestivalOffer(festival)}
                    >
                      <span className="pr-4">{list?.categoryName}</span>
                      <img src={NewRightArrow} alt="NewRightArrow" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )} */
}
