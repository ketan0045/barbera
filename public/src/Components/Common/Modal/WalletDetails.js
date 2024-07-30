import moment from "moment";
import React, { useEffect, useState } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiGet } from "../../../helpers/API/ApiData";

export default function WalletDetails(props) {
  const { toggle, SettingInfo } = props;
  const [walletHistory, setWalletHistory] = useState([]);

  useEffect(async () => {
    let res = await ApiGet("wallet/company/details/" + SettingInfo?.companyId);
    try {
   
      if (res.data.status === 200) {
        let filterdata =res?.data?.data?.filter((obj)=>obj?.finalAmount != 0)
        setWalletHistory(filterdata);
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  }, []);
  return (
    <div className="cus-modal-new-design">
      <div className="cus-modal-statment-modal">
        <div className="cus-modal-statemtn-design cus-modal-statemtn-design-new-modal">
          <div className="generated-header">
            <div className="close-icon-cus" onClick={toggle}>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
            <h1>Available wallet balance</h1>
          </div>
          <div className="generated-invoice-modal-body generated-invoice-modal-body-alignment-box">
            <div className="generated-invoice-table2 table-left-right-alignment">
              <table>
                <tr>
                  <th align="left">Customer name</th>
                  <th align="left">Update on</th>
                  <th align="center">Due/Balance</th>
                  <th align="right">Amount</th>
                </tr>
                {walletHistory?.map((wallet) => {
                  return (
                    <tr>
                      <td>{wallet?.user_id?.firstName + wallet?.user_id?.lastName}</td>
                      <td>{moment(wallet?.created).format("DD MMM yyyy")}</td>
                      {wallet?.finalAmount >= 0 ? (
                        <>
                          <td className="number-text-color"  align="center">Balance</td>
                          <td className="number-text-color" align="right">
                            <span className="amount-new-font">{SettingInfo?.currentType}</span>{" "}
                            {Math.abs(wallet?.finalAmount)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="number-text-color-due"  align="center">Due</td>
                          <td className="number-text-color-due flex justify-end" align="right">
                            <span className="amount-new-font pr-1">{SettingInfo?.currentType}</span>{" "}
                            {Math.abs(wallet?.finalAmount)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
