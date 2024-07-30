import moment from "moment";
import React, { useState } from "react";
import NewCloseIcon from "../../../../assets/svg/new-close.svg";
import { ApiPost } from "../../../../helpers/API/ApiData";

export default function OpeningBalance(props) {
  const { toggle, openingBalanceDetail, selectedDate, userInfo,paymentFilterData } = props;
  const [disable, setDisable] = useState(true);
  const [openingAmount, setOpeningAmount] = useState(openingBalanceDetail);
  const [editedAmount, setEditedAmount] = useState(0);
 
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
      setEditedAmount(parseInt(e.target.value) - openingBalanceDetail);
      if (openingBalanceDetail != parseInt(e.target.value)) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    }
  };

  const OpeningEditHandler = async () => {
    setDisable(true);
    let editOpening = {
      amount: Math.abs(editedAmount),
      companyId: userInfo?.companyId,
      type: editedAmount > 0 ? "CR" : "DR",
      typeValue: "opening-balance",
      created: new Date(),
      paymentMethod:paymentFilterData
    };
    await ApiPost("expence", editOpening)
      .then((respo) => {
        toggle();
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
            <div onClick={() => toggle()}>
              <img src={NewCloseIcon} alt="NewCloseIcon" />
            </div>
            <h1>Edit  opening collection</h1>
          </div>
          <div className="edit-opening-collection-modal-alignment">   
              <p> {paymentFilterData}</p>
            <div className="provide-edit-option-list">
              <p>
                Closing collection of{" "}
                {moment(selectedDate).subtract(1, "day").format("DD MMM 'YY")}
              </p>
              <p>
                <span>₹</span>
                {""} {openingBalanceDetail}
              </p>
            </div>
            <div className="amount-type-input">
              <label>Opening collection for today</label>
              <input
                type="text"
                value={openingAmount}
                placeholder="Enter Opening Balance"
                onChange={(e) => openingHandler(e)}
                onKeyPress={bindInput}
              />
            </div>
          </div>
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
  );
}
