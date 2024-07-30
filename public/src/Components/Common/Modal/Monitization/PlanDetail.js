import React, { useEffect, useState } from "react";
import "./monitization.scss";
import CloseIcon from "../../../../assets/svg/mini-close.svg";
import ClockIcon from "../../../../assets/svg/new-clock.svg";
import ChildInvetoryIcon from "../../../../assets/svg/child-invetory-icon.svg";
import BookmarkIcon from "../../../../assets/svg/bookmark.svg";
import alertIcon from "../../../../assets/svg/alert-circle.svg";
import ApplyCoupon from "./applyCoupon";
import moment from "moment";
import { ApiPost } from "../../../../helpers/API/ApiData";
import PaymentBtn from "../../../../Components/Common/Payment";
import SidebarBarberaLogo from "../../../../assets/img/sidebar-barbera.svg";

export default function PlanDetail(props) {
  const { toggle, trialDays, planFeture, userInfo, planBills } = props;
  const [basePrice, setBasePrice] = useState(23990);
  // const [gstPrice, setGstPrice] = useState();
  const [applyCoupon, setApplyCoupon] = useState(false);
  const [FinalPrice, setFinalPrice] = useState(23990);
  const [CouponCode, setCouponCode] = useState();
  const [discountPercentage, setDiscountPercentage] = useState(25);
  const [discountAmount, setDiscountAmount] = useState(0);
  useEffect(() => {
    if(userInfo?.parentId){

    }else{
    setCouponCode("BRB25");
    setDiscountPercentage(25);
    setDiscountAmount(parseInt((basePrice  * 25) / 100))
    setFinalPrice(
      basePrice - parseInt(
        basePrice  -
        parseInt(basePrice  - parseInt((basePrice * 25) / 100))
      )
    );
  }
  }, []);

  const ApplyCoupenCode = (data) => {
    setApplyCoupon(!applyCoupon);
    if (data) {
      setDiscountPercentage(25);
      setDiscountAmount(parseInt((basePrice * 25) / 100));
      setFinalPrice(
        basePrice - parseInt(
          basePrice  -
          parseInt(basePrice  - parseInt((basePrice * 25) / 100))
        )
      )
    }
  };

  const removeCoupen = () => {
    setCouponCode();
    // setGstPrice(3660);
    setBasePrice(23990)
    setFinalPrice(23990);
    setDiscountAmount(0);
    setDiscountPercentage(0);
  };

  const upgradePlan = async (paymentId) => {
    if(paymentId) {
      let bodyy = {
        paymentGatewayId:paymentId,
        amount:FinalPrice,
        companyId:userInfo?.companyId,
        type:"Payment"
      }
      await ApiPost("campaignPayment", bodyy)
      .then(async(res)=> {
        let planpayment = [
          {
            planId: planFeture[0],
            planBasePrice:  parseInt(FinalPrice/(1+(18/100))),
            planGstAmount: (FinalPrice - (parseInt(FinalPrice/(1+(18/100))))),
            paymentAmount: FinalPrice,
            razorpaymentId: res?.data?.data?._id,
            paymentStartDate: moment.utc(new Date()).format(),
            paymentEndDate: moment.utc(new Date()).add(1, "year").add(trialDays, "days").format(),
            isActive: true,
            companyId: userInfo.companyId,
            company_Id: userInfo._id,
          },
        ];
    
        if (planBills?.length > 0) {
          planpayment = planBills.concat(planpayment);
        }
        let PlanDetail = {
          finalDate: moment.utc(new Date()).add(1, "year").add(trialDays, "days").format(),
          paymentData: planpayment,
          companyId: userInfo.companyId,
        };
    
    
        let resp = await ApiPost("monetize", PlanDetail);
        if (resp.data.status === 200) {
          toggle(true);
        }
       
      })
      .catch((err)=> {
        console.log("err", err);
      })
    }
  
  };

  return (
    <>
      <div className="plan-details-modal-design">
        <div className="modal-header">
          <div className="header-alignment">
            <div className="menu">
              <div onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h2>Upgrade my account</h2>
            </div>
            <div className="button">
              <button>
                <img src={ClockIcon} alt="ClockIcon" />
                {trialDays > 0 ? (
                  <span>Your FREE trial ends in {trialDays} {trialDays ==  1 ? "day":"days"}</span>
                ) : (
                  <span>Your FREE trial expired</span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="plan-details-modal-body">
          <div className="all-box-center-alignment">
            <div className="plan-details-data">
              <div className="grid">
                <div className="grid-items">
                  <div className="white-box">
                    <div className="barbera-basic-content-style">
                      <h2>{planFeture[0]?.planName}</h2>
                      <p>
                        Plan that suits all the businesses. Have all the available features and get
                        the most out of it
                      </p>
                    </div>
                    <div className="barbera-basic-icon-text-alignment">
                      <div className="icon-text-box-title">
                        <h2>Pro includes:</h2>
                      </div>
                      <div className="all-icon-text-grid-alignment">
                        {planFeture[0]?.planService?.map((plan) => {
                          return (
                            <div className="icon-text-grid">
                              <div className="icon-text-grid-items">
                                <img src={plan?.icon} alt="ChildInvetoryIcon" />
                              </div>
                              <div className="icon-text-grid-items">
                                <span>{plan?.serviceName}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-items">
                  <div className="white-box">
                    <div className="amount-to-pay-title">
                      <h2>Amount to pay</h2>
                    </div>
                    <div className="barbera-basic-sec-content-alignment">
                      <div className="all-row-content-alignment">
                        <div className="row-content-alignment">
                          <div>
                            <h3>Barbera Pro</h3>
                          </div>
                          <div>
                            <h3>
                              <span>₹</span> {parseInt(basePrice) .toLocaleString()}
                            </h3>
                          </div>
                        </div>
                     
                        {CouponCode ? (
                          <>
                            <div className="discount-contnet-box">
                              <div>
                                <h4>Discount @ {discountPercentage}%</h4>
                              </div>
                              <div>
                                <h4>
                                  - <span>₹</span> {discountAmount}{" "}
                                </h4>
                              </div>
                            </div>
                            <div className="remove-text-all-content-alignment">
                              <div className="coupon-content-alignment">
                                <div>
                                  <img src={BookmarkIcon} alt="BookmarkIcon" />
                                </div>
                                <div>
                                  <p>
                                    {CouponCode} <a> coupon applied</a>
                                  </p>
                                </div>
                              </div>
                              <div className="remove-text" onClick={() => removeCoupen()}>
                                <h6>Remove</h6>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="remove-text-all-content-alignment">
                            <div
                              className="coupon-content-alignment"
                              onClick={() => ApplyCoupenCode()}
                            >
                              <div>
                                <span>Apply coupon</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="barbera-final-price-content-alignment">
                      <div>
                        <p>Final price to pay</p>
                      </div>
                      <div>
                        <h6>
                          <span>₹</span> {FinalPrice.toLocaleString()}
                        </h6>
                      </div>
                    </div>
                    <div
                      className="pay-now-button"
                      // add payment button here
                    >
                   
                      <PaymentBtn price={FinalPrice} logo={SidebarBarberaLogo} user={userInfo} upgradePlan={upgradePlan}/>
                    </div>
                    <div className="inclusive-gst-tag">
                          <div className="tag-content-alignment">
                                <div>
                                  <img src={alertIcon} alt="alertIcon" />
                                </div>
                                <div>
                                  <p>
                                  <a> This price is inclusive of GST</a>
                                  </p>
                                </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {applyCoupon && <ApplyCoupon toggle={ApplyCoupenCode} setCouponCode={setCouponCode} />}
    </>
  );
}
