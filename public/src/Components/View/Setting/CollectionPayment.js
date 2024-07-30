import React, {useState, useEffect } from "react";
import CloseIcon from "../../../assets/svg/new-close-icon.svg";
import CheckedIcon from "../../../assets/svg/new-Checked.svg";

export default function CollectionPayment(props) {
  const {
    DefaultPaymentMethod,
    toggle,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = props;
  const [collectionMethods,setCollectionMethods]=useState(selectedPaymentMethod)


  const AddRemoveFilterHandler = (key) => {
    if (key !== "Cash") {
      if (collectionMethods.includes(key)) {
        let index = collectionMethods.indexOf(key);
        collectionMethods.splice(index, 1);
        setCollectionMethods([...collectionMethods]);
      } else {
        collectionMethods.push(key);
        setCollectionMethods([...collectionMethods]);
      }
    }
  };

  return (
    <>
      <div className="expense-payment-select-modal-design">
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
            {DefaultPaymentMethod.map((pay) => {
              return (
                <div
                  className={
                    collectionMethods?.includes(pay)
                      ? "grid selected"
                      : "grid"
                  }
                  onClick={(e) => AddRemoveFilterHandler(pay)}
                >
                  <div className="grid-items">
                    <div>
                      <p>{pay}</p>
                    </div>
                  </div>
                  <div className="grid-items">
                    {pay == "Cash"
                      ? null
                      : collectionMethods?.includes(pay) && (
                          <img src={CheckedIcon} alt="CheckedIcon" />
                        )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="expense-filter-modal-footer">
            <div onClick={(e)=>toggle(collectionMethods)}>
              <button>Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
