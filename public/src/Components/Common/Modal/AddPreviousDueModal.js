import React, { useState } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiPost } from "../../../helpers/API/ApiData";

export default function AddPreviousDueModal(props) {
  const { SettingInfo, customerDetails, toggle } = props;
  const [addAmount, setAddAmount] = useState();

  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };
  const AddWalletHandler = () => {
    let walletData = {
      companyId: SettingInfo?.companyId,
      user_id: customerDetails?._id,
      type: "DR",
      method: [],
      description: "Previous Due",
      walletAmount: addAmount,
      topup: true,
    };

    ApiPost("wallet", walletData)
      .then((resp) => {
        if (resp.data.status === 200) {
          toggle(resp.data.status);
        }
      })
      .catch((er) => {
        console.log(er);
      });
  };

  return (
    <React.Fragment>
      <div className="modal-bluer-open"></div>

      <div className="sub-modal-main">
        <div className="split-sub-modal-wallet">
          <div className="sub-modal-headermenu-wallet">
            <div className="header-alignment-wallet">
              <div className="close-button-wallet" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h4>Add previous due</h4>
            </div>
          </div>

          <div className="sub-modal-body-Forwallet">
            <div className="form-group form-top-align-space">
              <label>Previous due amount</label>
              <div className="dropdown-relative">
                <input
                  type="text"
                  value={addAmount}
                  name="amount"
                  placeholder="Enter value"
                  maxLength="10"
                  style={{
                    marginBottom: "5%",
                    border: "1px solid lightgray",
                  }}
                  onChange={(e) => setAddAmount(e.target.value)}
                  onKeyPress={bindInput}
                />
                <div className="rupee-align">
                  <span className="roboto-font">
                    {SettingInfo?.currentType}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-modal-footer">
            {addAmount > 0 ? (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
                onClick={() => AddWalletHandler()}
              >
                <button>Add Previousdue</button>
              </div>
            ) : (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
              >
                <button disabled>Add Previous due</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
