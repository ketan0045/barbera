import React from 'react'
import CloseIcon from "../../../../../assets/svg/close-icon.svg";

export default function ViewRating(props) {
    const { setOpenRatingModal, averageRatingData ,ViewInvoice} = props;
  return (
    <div>
      <div className="cus-modal-new-design">
        <div className="cus-modal-statment-modal">
          <div className="cus-modal-statemtn-design">
            <div className="generated-header">
              <div
                className="close-icon-cus"
                onClick={() => setOpenRatingModal(false)}
              >
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h1>Customer reviews</h1>
            </div>
            <div className="generated-invoice-modal-body generated-invoice-modal-body-alignment-box">
              <div className="generated-invoice-table4 table-left-right-alignment">
                <table>
                  <tr>
                    <th align="left">Customer</th>
                    <th align="left ">Invoice # </th>
                    <th align="right">Review</th>
                  </tr>
                  {averageRatingData?.length > 0 &&
                    averageRatingData.map((invoice) => {
                     
                        return (
                          <tr >
                            <td>{invoice?.customerData?.firstName}</td>

                            <td ><span
                                  className="number-text-color"
                                  onClick={(e) => ViewInvoice(e, invoice)}
                                >#{invoice?.invoiceId}</span></td>

                            <td  align="right"><span style={{ display:"flex",justifyContent:"flex-end"}}>{[1,2,3,4,5]?.map((star)=>{
                                if(star <= invoice?.feedback[0]?.star){
                                return(  
                                <img
                                style={{height:"25px",width:"25px",marginRight:"5px"}}
                                    src={
                                      "https://i.ibb.co/nfyCrr9/Vector.png"
                                    }
                                  />)}
                            })}</span></td>
                          </tr>
                        );
                      
                    })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
