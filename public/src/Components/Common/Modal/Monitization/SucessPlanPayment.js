import React,{useRef} from 'react'
import "./monitization.scss";
import PanaImage from "../../../../assets/svg/paySuccess.svg";
import ComponentToPrint from "../../../Common/Modal/Monitization/planInvoice";
import { useReactToPrint } from "react-to-print";

export default function SucessPlanPayment(props) {
  const {invoiceData,setSucessPayment}=props

  const wrapperRefs = useRef();

  const ClickPdf = useReactToPrint({
    content: () => wrapperRefs.current,
  });
  return (
    <>
      <div className="modal-bluer-outer">
        <div className="payment-sucess-modal-box">
        <div className="skipcontent">
            </div>
          <div className="image-center-alignment">
            <img src={PanaImage} alt="PanaImage" />
          </div>
          <div className="box-center-alignment">
            <p>Payment Successful!</p>
          </div>
          <div className="child-text-alignment">
            <p>
            Your barbera subscription has been updated!
            Thank you for choosing Barbera Pro
            </p>
          </div>
          <div className="view-user-behaviour-alignment">
            <span onClick={()=>ClickPdf()}>View Invoice</span>
            <span onClick={()=>setSucessPayment(false)} >Close</span>
          </div>
          <div style={{ display: "none" }}>
                  <ComponentToPrint   data={invoiceData} ref={wrapperRefs}/>
          </div>
        </div>
      </div>
     
    </>
  )
}
