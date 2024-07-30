import React, { useState, useEffect } from "react";
import Auth from "../../../helpers/Auth";
import SubscriptionPlan from "./SubscriptionPlan";
import EditIcon from "../../../assets/svg/edit-icon.svg";
import Success from "../../Common/Toaster/Success/Success";
import EditCurrencyDetailsModal from "../../Common/Modal/EditCurrencyDetailsModal";
import UserOverview from "./UserOverview";
import moment from "moment";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";

export default function AccountSetting(props) {
  const {
    permission,
    userInfo,
    taxDetails,
    getSetting,
    currencyData,
    trialDays,
    planFeture,
    getMyPlan,
    gettrialDays,
    planBills,
    defaultFeature,
    expireDate,
    planName,
    salesData,
    currentInvoicesNo,
    currentInvoices,
    customersAdded,
    dueAmountTotal,
    dueCount,
    appointmentNo
  } = props;

  const [key, setKey] = useState("plan");
  const [editCurrencyDetails, setEditCurrencyDetails] = useState({});
  const [currencyDetailsModal, setCurrencyDetailsModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();

  useEffect(() => {
    const queryString = require("query-string");
    const parsed = queryString.parse(window.location.search);
    if (parsed.session == "behaviour") {
      setKey("overview");
    }
  }, [window.location.search]);

  const editCurrencyDetailsHandler = (data) => {
    currencyDetailsEditModaltoggle();
    setEditCurrencyDetails(data);
  };

  const currencyDetailsEditModaltoggle = (status, data) => {
    setCurrencyDetailsModal(!currencyDetailsModal);
    if (currencyDetailsModal === true) {
      if (status) {
        if (status === 200) {
          getSetting(data);
          setSuccess(true);
          setToastmsg("Changes saved!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <div>
        <div className="setting-sub-grid">
          <div className="setting-sub-grid-items">
            <div className="cus-tab-design">
              <ul>
                <li
                  className={key === "plan" && "active-tab-cus-background"}
                  onClick={(e) => setKey("plan")}
                >
                  Subscription plan
                </li>
                {userInfo.role === "Operator" ||
                    userInfo?.role === "Staff" ? null : trialDays < 30  && <li
                  className={key === "overview" && "active-tab-cus-background"}
                  onClick={(e) => setKey("overview")}
                >
                  User overview
                </li>}
                <li
                  className={key === "currency" && "active-tab-cus-background"}
                  onClick={(e) => setKey("currency")}
                >
                  Currency
                  {permission?.filter(
                    (obj) =>
                      obj.name ===
                      "General settings actions (Change working hours, edit profile, edit tax, edit currency)"
                  )?.[0]?.isChecked === false
                    ? null
                    : key === "currency" && (
                        <img
                          src={EditIcon}
                          alt="EditIcon"
                          onClick={() => editCurrencyDetailsHandler(taxDetails)}
                        />
                      )}
                </li>
              </ul>
            </div>
          </div>
          {key === "plan" && (
            <div className="setting-sub-grid-items">
              <SubscriptionPlan
                trialDays={trialDays}
                planFeture={planFeture}
                userInfo={userInfo}
                getMyPlan={getMyPlan}
                planBills={planBills}
                defaultFeature={defaultFeature}
                expireDate={expireDate}
                planName={planName}
                gettrialDays={gettrialDays}
              />
            </div>
          )}
          {key === "overview" && (
            <div className="setting-sub-grid-items">
              <div className="salon-data-data">
                <p>User overview</p>
              </div>
              <UserOverview
                currentType={currencyData}
                salesData={salesData}
                currentInvoices={currentInvoices?.length}
                customersAdded={customersAdded}
                dueCount={dueCount}
                dueAmountTotal={dueAmountTotal}
                appointmentNo={appointmentNo}
                currentInvoicesNo={currentInvoicesNo}
              />
            </div>
          )}

          {key === "currency" && (
            <div className="setting-sub-grid-items right-sapce-setting">
              <div className="salon-data-data">
                <p>System Currency</p>

                <p>
                  {currencyData == "₹"
                    ? "₹-Ruppes"
                    : currencyData == "$"
                    ? "$-Dollar"
                    : currencyData == "£"
                    ? "£-Pound"
                    : currencyData == "€"
                    ? "€-Euro"
                    : currencyData == "¥"
                    ? "¥-Yen"
                    : null}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {currencyDetailsModal && (
        <EditCurrencyDetailsModal
          modal={currencyDetailsModal}
          toggle={currencyDetailsEditModaltoggle}
          editTaxDetails={editCurrencyDetails}
          currencyData={currencyData}
        />
      )}
      {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
    </>
  );
}
