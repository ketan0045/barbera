import React from 'react'
import { ApiPut } from '../../../helpers/API/ApiData';

export default function DeleteAccount(props) {
    const{ toggle,account,type}=props

    const AccountHandler=()=>{
   
    let deactivateData={
        isActive: type == "Deactivate" ? false:true
    }
    
     ApiPut("account/" + account._id, deactivateData)
     .then((resp) => {
        toggle(true)
     })
     .catch((err) => {
       console.log("error", err);
     });
    }
  return (
    <>
      <div className="toaster-modal">
        <div
          className={
            props.modal
              ? "modal-design-toster toster-show"
              : " modal-design-toster toster-hidden"
          }
        >
          <div className="toster-title">
              <p>
               Are you sure you want to {type} account of {account?.Name}?
              </p>
           
          </div>
          <div className={ type == "Deactivate" ?  "toster-footer-wallet":"toster-footer-wallet-green"}>
            <button onClick={() => toggle()}>No</button>
            <button onClick={()=>AccountHandler()}>
              <span>{type}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
