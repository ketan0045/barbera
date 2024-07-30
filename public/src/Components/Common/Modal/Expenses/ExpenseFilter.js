import CloseIcon from "../../../../assets/svg/new-close-icon.svg";
import WalletIcon from "../../../../assets/svg/new-wallet-icon.svg";
import CheckedIcon from "../../../../assets/svg/new-Checked.svg";
import invoiceIcon from "../../../../assets/svg/blue-invoice.svg";
import teaIcon from "../../../../assets/svg/blue-teaicon.svg";
import staffIcon from "../../../../assets/svg/blue-staff.svg";
import depositIcon from "../../../../assets/svg/deposite.svg";
import recciveIcon from "../../../../assets/svg/recive.svg";
import collectiondiffIcon from "../../../../assets/svg/coin-stack.svg";

import React, { useEffect, useState } from "react";

export default function ExpenseFilter(props) {
  const {setOpenFilter,setFilters,filters}=props
  const [filterData,setFilterData]=useState([])

  useEffect(()=>{
    setFilterData(filters)
  },[])


  const AddRemoveFilterHandler=(key)=>{
    if (key) {
      if (filterData.includes(key)) {
        let index = filterData.indexOf(key);
        filterData.splice(index, 1);
        setFilterData([...filterData]);
      } else {
        filterData.push(key);
        setFilterData([...filterData]);
      }
    }

  }

  const ApplyFilterHandler=()=>{
    setFilters(filterData)
    setOpenFilter(false)
  }

  return (
    <>
      <div className="expense-filter-modal-design">
        <div className="expense-filter-modal">
          <div className="expense-filter-modal-header">
            <div className="expense-child-header-alignment">
              <div onClick={()=>setOpenFilter(false)}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <div>
                <h1>Apply filter</h1>
              </div>
            </div>
          </div>
          <div className="expense-filter-modal-body">
          <div className={filterData.includes("invoice") ? "grid selected" : "grid"}  onClick={()=>AddRemoveFilterHandler("invoice")}>
              <div className="grid-items">
                <div>
                  <img src={invoiceIcon} alt="invoiceIcon" />
                </div>
                <div>
                  <p>Sale</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("invoice") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
            <div className={filterData.includes("expence") ? "grid selected" : "grid"} onClick={()=>AddRemoveFilterHandler("expence")}>
              <div className="grid-items">
                <div>
                  <img src={teaIcon} alt="teaIcon" />
                </div>
                <div>
                  <p>Expense</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("expence") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
            <div className={filterData.includes("wallet-topup") ? "grid selected" : "grid"} onClick={()=>AddRemoveFilterHandler("wallet-topup")}>
              <div className="grid-items">
                <div>
                  <img src={WalletIcon} alt="WalletIcon" />
                </div>
                <div>
                  <p>Wallet top-up</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("wallet-topup") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
            <div className={filterData.includes("wallet-withdraw") ? "grid selected" : "grid"} onClick={()=>AddRemoveFilterHandler("wallet-withdraw")}>
              <div className="grid-items">
                <div>
                  <img src={WalletIcon} alt="WalletIcon" />
                </div>
                <div>
                  <p>Wallet withdrawals</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("wallet-withdraw") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
            <div className={filterData.includes("staff") ? "grid selected" : "grid"} onClick={()=>AddRemoveFilterHandler("staff")}>
              <div className="grid-items">
                <div>
                  <img src={staffIcon} alt="staffIcon" />
                </div>
                <div>
                  <p>Staff pay</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("staff") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
            <div className={filterData.includes("transfer") ? "grid selected" : "grid"} onClick={()=>AddRemoveFilterHandler("transfer")}>
              <div className="grid-items">
                <div>
                  <img src={depositIcon} alt="depositIcon" />
                </div>
                <div>
                  <p>Deposit (Owner)</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("transfer") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
            <div className={filterData.includes("deposit") ? "grid selected" : "grid"} onClick={()=>AddRemoveFilterHandler("deposit")}>
              <div className="grid-items">
                <div>
                  <img src={recciveIcon} alt="recciveIcon" />
                </div>
                <div>
                  <p>Receive (Owner)</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("deposit") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
            <div className={filterData.includes("opening-balance") ? "grid selected" : "grid"} onClick={()=>AddRemoveFilterHandler("opening-balance")}>
              <div className="grid-items">
                <div>
                  <img src={collectiondiffIcon} alt="collectiondiffIcon" />
                </div>
                <div>
                  <p>Collection difference</p>
                </div>
              </div>
              <div className="grid-items">
              {filterData.includes("opening-balance") && <img src={CheckedIcon} alt="CheckedIcon" />}
              </div>
            </div>
          </div>
          <div className="expense-filter-modal-footer">
            <div>
            {filterData?.length > 0 ? <button onClick={()=>setFilterData([])}>Clear filter</button> : <button style={{opacity:"0.4"}}>Clear filter</button>}
            </div>
            <div>
              <button onClick={()=>ApplyFilterHandler()}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
