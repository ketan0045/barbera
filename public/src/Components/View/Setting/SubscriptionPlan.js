import React, { useEffect, useState, useRef } from "react";
import InventroyIcon from "../../../assets/svg/child-invetory-icon.svg";
import BarberaIcon from "../../../assets/svg/Barbera-log.svg";
import PlanDetail from "../../Common/Modal/Monitization/PlanDetail";
import { ApiGet } from "../../../helpers/API/ApiData";
import moment from "moment";
import { useHistory } from "react-router-dom";
import SucessPlanPayment from "../../Common/Modal/Monitization/SucessPlanPayment";
import ComponentToPrint from "../../Common/Modal/Monitization/planInvoice";
import { useReactToPrint } from "react-to-print";

export default function SubscriptionPlan(props) {
  const {
    trialDays,
    planFeture,
    userInfo,
    getMyPlan,
    gettrialDays,
    planBills,
    defaultFeature,
    expireDate,
    planName,
  } = props;
  const history = useHistory();
  const [access, setAccess] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [sucessPayment, setSucessPayment] = useState(false);
  const [invoiceData, setInvoiceData] = useState();

  const wrapperRefs = useRef();
  const UpgradeMyPlans = (data) => {
    setUpgrade(!upgrade);

    if (data) {
      getMyPlan();
      gettrialDays();
      setSucessPayment(!sucessPayment);
      setInvoiceData(data);
      history.push("/setting?session=activeplan");
    }
  };

  const ClickPdf = useReactToPrint({
    content: () => wrapperRefs.current,
  });

  return (
    <>
      <div className="subscription-full-page-box">
        <div className="current-plan-text-style">
          <p>Current plan</p>
        </div>
        <div className="main-box-border-style">
          <div className="first-header-alignment">
            <div className="logo-text-style">
              <div className="barbera-logo-setting-page">
                <div>
                  <img src={BarberaIcon} alt="BarberaIcon" />
                </div>
                <div>
                  <h2>{planName ? planName : "FREE trial"}</h2>
                  {planName ? (
                    trialDays <= 15 ? (
                      <p>
                        Your {planName} plan ends in {trialDays} {trialDays ==  1 ? "day":"days"}
                      </p>
                    ) : null
                  ) : trialDays > 0 ? (
                    <p>Your FREE trial ends in {trialDays} {trialDays ==  1 ? "day":"days"}</p>
                  ) : (
                    <p>FREE trial expired</p>
                  )}
                </div>
              </div>
              <div className="barbera-logo-text"></div>
            </div>
            {planName ? (
              trialDays <= 15 ? (
                <div
                  className="upgrade-button-style"
                  onClick={() => UpgradeMyPlans()}
                >
                  <button>Upgrade</button>
                </div>
              ) : null
            ) : (
              <div
                className="upgrade-button-style"
                onClick={() => UpgradeMyPlans()}
              >
                <button>Upgrade</button>
              </div>
            )}
          </div>
          <div className="sec-header-alignment">
            <div>
              <h2>Access to all the features of Barbera</h2>
            </div>
            {access ? (
              <div onClick={() => setAccess(!access)}>
                <a>View less</a>
              </div>
            ) : (
              <div onClick={() => setAccess(!access)}>
                <a>View list</a>
              </div>
            )}
          </div>
          <div
            className={access ? "access-to-all-show" : "access-to-all-hidden"}
          >
            <div className="access-to-all-icon-text-grid">
              {defaultFeature?.map((service) => {
                return (
                  <div className="icon-text-grid">
                    <div className="icon-text-grid-items">
                      <img src={service?.icon} alt="InventroyIcon" />
                    </div>
                    <div className="icon-text-grid-items">
                      <span>{service?.serviceName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {planBills?.length > 0 ? (
          <div className="next-billing-date-alignment">
            <div className="first-nav-alignment">
              <p>Next billing date</p>
              <span>
                {moment(expireDate).add(1, "days").format("DD MMM YYYY")}
              </span>
            </div>
            <div className="invoice-text-style">
              <p>Invoice for the previous payments</p>
            </div>
            {planBills?.map((plan, i) => {
              return (
                <div
                  className="sec-content-alignment"
                  style={{ border: i == planBills?.length - 1 ? "none" : "" }}
                >
                  <p>
                    Date: {moment(plan?.paymentStartDate).format("DD MMM yyyy")}
                  </p>
                  <span onClick={() => ClickPdf()}>Download invoice</span>
                  <div style={{ display: "none" }}>
                    <ComponentToPrint data={plan} ref={wrapperRefs} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {upgrade && (
        <PlanDetail
          toggle={UpgradeMyPlans}
          trialDays={trialDays}
          planFeture={planFeture}
          userInfo={userInfo}
          planBills={planBills}
        />
      )}
      {sucessPayment && (
        <SucessPlanPayment
          invoiceData={planBills[planBills?.length - 1]}
          setSucessPayment={setSucessPayment}
        />
      )}
    </>
  );
}
