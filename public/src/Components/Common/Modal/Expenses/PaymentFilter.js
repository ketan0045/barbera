import React, { useEffect, useState } from "react";
import CloseIcon from "../../../../assets/svg/new-close-icon.svg";
import CheckedIcon from "../../../../assets/svg/new-Checked.svg";
import invoiceIcon from "../../../../assets/svg/blue-invoice.svg";

export default function PaymentFilter(props) {
  const { paymentFilterData, setPaymentFilterData, toggle,SettingData } = props;
  // const [filterData,setFilterData]=useState()

  // useEffect(()=>{
  //   setFilterData(filters)
  // },[])

  const AddRemoveFilterHandler = (key) => {
    setPaymentFilterData(key);
  };

  // const ApplyFilterHandler=()=>{
  //   setFilters(filterData)
  //   setOpenFilter(false)
  // }
  return (
    <>
      <div className="expense-payment-modal-design">
        <div className="expense-filter-modal">
          <div className="expense-filter-modal-header">
            <div className="expense-child-header-alignment">
              <div onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <div>
                <h1>Payment methods</h1>
              </div>
            </div>
          </div>
          <div className="expense-filter-modal-body">
            {SettingData?.collections?.collectionpaymentMethod.map((pay) => {
              return (
                <div
                  className={
                    paymentFilterData === pay ? "grid selected" : "grid"
                  }
                  onClick={() => AddRemoveFilterHandler(pay)}
                >
                  <div className="grid-items">
                    <div>
                      <p>{pay}</p>
                    </div>
                  </div>
                  <div className="grid-items">
                    {paymentFilterData === pay && (
                      <img src={CheckedIcon} alt="CheckedIcon" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
