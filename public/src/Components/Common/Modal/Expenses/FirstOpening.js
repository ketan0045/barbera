import React, { useState } from "react";
import NewCloseIcon from "../../../../assets/svg/new-close.svg";
import moment from "moment";
import { ApiPost } from "../../../../helpers/API/ApiData";
import * as userUtil from "../../../../utils/user.util";

export default function FirstOpening(props) {
  const { SetOpenExpencemodal, userInfo, toggle } = props;
  const [openingAmount, setOpeningAmount] = useState();
  const [disable, setDisable] = useState(true);

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

  const openingHandler = (e) => {
    if (e.target.value == 0 || e.target.value === "") {
      setOpeningAmount(e.target.value);
      setDisable(true);
    } else {
      setOpeningAmount(parseInt(e.target.value));
      setDisable(false);
    }
  };

  const OpeningEditHandler = async () => {
    setDisable(true);
    let editOpening = {
      amount: Math.abs(openingAmount),
      companyId: userInfo?.companyId,
      type: "CR",
      typeValue: "opening-balance",
      created: moment.utc(new Date()).format(),
    };
    await ApiPost("expence", editOpening)
      .then(async(respo) => {
        let values = {
          expansesMinDate: moment.utc(new Date()).format(),
          companyId: userInfo.companyId,
        };
        let res = await ApiPost("setting/", values);
        try {
          if (res.data.status === 200) {
            userUtil.setSetting(res?.data?.data[0])
            toggle();
          }
        } catch (err) {
          console.log(err)
        }
      
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="add-opening-modal-design">
        <div className="add-new-expenese-mini-modal">
          <div className="add-new-expenese-modal-header">
            <div onClick={() => SetOpenExpencemodal(false)}>
              <img src={NewCloseIcon} alt="NewCloseIcon" />
            </div>
            <h1>Opening collection</h1>
          </div>
          <div
            className="add-expense-amount-modal-body"
            style={{ height: "auto" }}
          >
            <div className="amount-type-input" style={{ margin: "0 0 30px 0" }}>
              <label>Start with your Opening Collections</label>
              <input
                type="text"
                value={openingAmount}
                placeholder="Enter Opening Amount"
                onChange={(e) => openingHandler(e)}
                onKeyPress={bindInput}
              />
            </div>
          </div>
          <div className="expensed-new-footer-modal-alignment">
            <div className="add-expense-amount-modal-footer">
              {disable ? (
                <button disabled>Save</button>
              ) : (
                <button onClick={() => OpeningEditHandler()}>Save</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
