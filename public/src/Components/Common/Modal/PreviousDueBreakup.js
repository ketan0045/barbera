import React,{useState} from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import moment from "moment";
import ViewInvoiceModal from "./ViewInvoiceModal";


export default function PreviousDueBreakup(props) {
  const { modal, SettingInfo, toggle, dueTransction, previousDue } = props;
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const openInvoice =(due)=>{
    setInvoiceDetail(due);
    setViewInvoiceModal(!viewInvoiceModal);
  }
  return (
    <>
      {modal ? <div className="modal-bluer-open-due"></div> : null}
      <div className="sub-modal-main">
        <div className=" sub-modal-design-second">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Previous dues breakup</h4>
              <div className="close-button" onClick={() => toggle(false)}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="sub-modal-design-second-body">
            <div className="breakup-tables">
              <table>
                <tr>
                <th align="left">Date</th>
                  <th align="left">Invoices</th>
                  <th>Final Amount</th>
                  <th>Due amount</th>
                </tr>
                {dueTransction?.length === 0 ? (
                  <tr>
                    <td>
                      <span>Previous due</span>
                    </td>
                    <td align="center"></td>
                    <td align="center">
                      <span>
                        <a>{SettingInfo?.currentType}</a> {previousDue}
                      </span>
                    </td>
                  </tr>
                ) : dueTransction
                    .map((item) => item.dueAmount)
                    .reduce((prev, curr) => prev + curr, 0) !== previousDue ? (
                  <tr>
                    <td>
                      <span>Previous due</span>
                    </td>
                    <td align="center"></td>
                    <td align="center">
                      <span>
                        <a>{SettingInfo?.currentType}</a>{" "}
                        {previousDue -
                          dueTransction
                            .map((item) => item.dueAmount)
                            .reduce((prev, curr) => prev + curr, 0)}
                      </span>
                    </td>
                  </tr>
                ) : (
                  ""
                )}
                {dueTransction?.map((due) => {
              
                  return (
                    <tr>
                      <td>
                        <span>{moment(due?.created).format("DD/MM/YYYY")}</span>
                      </td>
                      <td >
                        <span className="invoice-type-span" onClick={()=>openInvoice(due)}>#{due?.invoiceId}</span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {due?.totalAmount}
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {due?.dueAmount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
      {viewInvoiceModal && <ViewInvoiceModal 
      modal={viewInvoiceModal}
      toggle={openInvoice}
      ViewInvoice={invoiceDetail}
      invoice={invoiceDetail}
      // getInvoices={getInvoices}
      // TostMSG={TostMSG}
      CustomerDue={true}
      SettingInfo={SettingInfo}/>}
      
    </>
  );
}
