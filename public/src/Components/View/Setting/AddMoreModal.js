import React, { useEffect, useState } from "react";
import "../../Common/Modal/Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";

export default function AddMoreModal(props) {
  const {
    modal,
    toggle,
    getPaymentMethod,
    editPaymentMethod,
    deleteModalToggle,
  } = props;

  const userInfo = Auth.getUserDetail();

  const [paymentMethod, setPaymentMethod] = useState();
  const [disable, setDisable] = useState(true);
  const [errors, setError] = useState({});

  const bindInput = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9/ -]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const validation = () => {
    let errors = {};
    let formIsValid = true;
    if (paymentMethod?.trim() == "") {
      formIsValid = false;
      setDisable(!formIsValid);
      errors["paymentMethod"] = "* Please enter valid method";
    }
    setError(errors);
    return formIsValid;
  };

  const handleOnChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  const addPaymentMethod = async (values) => {
    if (validation()) {
      let payload = editPaymentMethod
        ? {
            paymentType: paymentMethod,
          }
        : {
            paymentType: paymentMethod,
            companyId: userInfo.companyId,
            default: false
          };
      try {
        let res = editPaymentMethod
          ? await ApiPut("payment/" + editPaymentMethod?._id, payload)
          : await ApiPost("payment", payload);
        if (res.data.status === 200) {
          getPaymentMethod();
          toggle(res.data.status);
        }
      } catch (err) {
        console.log("error while getting Forum", err);
      }
    }
  };

  useEffect(() => {
    if (editPaymentMethod) {
      setPaymentMethod(editPaymentMethod?.paymentType);
    }
  }, [editPaymentMethod]);

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>{editPaymentMethod ? "Edit" : "Add new"} payment method</h4>
              <div className="close-button" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="sub-modal-body">
            <div className="option-select-group edit-service-modal-bottom-align">
              <label>
                Enter payment method{" "}
                {paymentMethod?.trim() == "" && (
                  <span
                    style={{
                      color: "red",
                      top: "5px",
                      fontSize: "10px",
                    }}
                  >
                    {errors["paymentMethod"]}
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="input-relative">
                  <input
                    type="text"
                    name="paymentMethod"
                    placeholder="Type here"
                    value={paymentMethod?.replace(/^(.)|\s+(.)/g, (c) =>
                      c.toUpperCase()
                    )}
                    onChange={(e) => handleOnChange(e)}
                    maxLength={"30"}
                    onKeyPress={bindInput}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="edit-service-modal-button-design">
            <div className="remove-service-button">
              {editPaymentMethod && (
                <button
                  className="remov-button-style"
                  onClick={() => deleteModalToggle()}
                >
                  Delete
                </button>
              )}
            </div>
            <div className="cancel-change-button">
              {editPaymentMethod && (
                <button
                  className="cancel-button-style"
                  onClick={() => toggle()}
                >
                  Cancel
                </button>
              )}
              <button
                className="save-button"
                disabled={disable}
                onClick={() => addPaymentMethod()}
              >
                {editPaymentMethod ? "Save changes" : "Add method"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
