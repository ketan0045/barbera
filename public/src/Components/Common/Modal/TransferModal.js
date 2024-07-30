import React, { useEffect, useState } from "react";
import "../Modal/TransferModal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropdownIcon from "../../../assets/svg/drop-down.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import OutsideAlerter from "../OutsideAlerter";

function TransferModal(props) {
  const { toggle, productDetails, getProducts, close, userInfo } = props;
  const [openTransfer, setOpenTransfer] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const [quantity, setQuantity] = useState();
  const [checkIsValid, setCheckIsValid] = useState(false);
  const [transferFrom, setTransferFrom] = useState(
    "Retail to Store consumption"
  );
  const transferDown = () => {
    setOpenTransfer(!openTransfer);
  };
  const [transferOptions, setTransferOptions] = useState([
    "Retail to Store consumption",
    "Store consumption to Retail",
  ]);

  const updateProductQuantity = async (e) => {
    e.preventDefault();
    const fromBody = {
      productId: productDetails._id,
      retailInitialStock:
        transferFrom === "Retail to Store consumption" ? quantity : 0,
      storeInitialStock:
        transferFrom === "Store consumption to Retail" ? quantity : 0,
      type: "DR",
      companyId: userInfo.companyId,
      description: transferFrom === "Retail to Store consumption" ? "Transfer to Store consumption" : "Transfer to Retail",
    };
    const toBody = {
      productId: productDetails._id,
      retailInitialStock:
        transferFrom === "Retail to Store consumption" ? 0 : quantity,
      storeInitialStock:
        transferFrom === "Store consumption to Retail" ? 0 : quantity,
      type: "CR",
      companyId: userInfo.companyId,
      description: transferFrom === "Retail to Store consumption" ? "Transfer from Retail" : "Transfer from Store consumption",
    };
    let fromRes = await ApiPost("stock/", fromBody);
    let toRes = await ApiPost("stock/", toBody);
    try {
      if (fromRes.data.status === 200 && toRes.data.status === 200) {
        getProducts();
        close();
        toggle(e, 200);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   console.log("quantity", quantity);
  //   console.log(
  //     "retail",
  //     productDetails?.stockArray?.slice(-1)[0].totalRetailInitialStock
  //   );
  //   console.log(
  //     "store",
  //     productDetails?.stockArray?.slice(-1)[0].totalStoreInitialStock
  //   );

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

  const handleQuantityInput = (e) => {
    setQuantity(+e.target.value);
    setCheckIsValid(!checkIsValid);
  };

  const handleSelectTransferFrom = (e, from) => {
    setTransferFrom(from);
    transferDown();
    setCheckIsValid(!checkIsValid);
  };

  const handleQuantityChange = (e, action) => {
    if (action === "increase") {
      !quantity ? setQuantity(1) : setQuantity(+quantity + 1);
    }
    if (action === "decrease") {
      !quantity
        ? setQuantity(0)
        : +quantity !== 0 && setQuantity(+quantity - 1);
    }
  };

  useEffect(() => {
    if (quantity) {
      if (transferFrom === "Retail to Store consumption") {
        let quantityExceedsStock =
          +quantity >
          +productDetails?.stockArray?.slice(-1)[0].totalRetailInitialStock;
        setIsInvalid(quantityExceedsStock);
      } else {
        let quantityExceedsStock =
          +quantity >
          +productDetails?.stockArray?.slice(-1)[0].totalStoreInitialStock;
        setIsInvalid(quantityExceedsStock);
      }
    }
  }, [quantity, checkIsValid]);

  return (
    <>
      <div className="transfer-modal-wrapper">
        <div className="transfer-modal">
          <div className="transfer-modal-header">
            <button
              type="button"
              className="modal-close"
              onClick={(e) => toggle(e)}
            >
              <img className="close" src={CloseIcon} alt="CloseIcon" />
            </button>
            <h5 className="transfer-modal-title">Transfer stock</h5>
          </div>
          <div className="transfer-modal-body">
            <div className="available-stock-wrapper">
              <div className="available-stock-head">
                <h5 className="stock-cmn">Available stock</h5>
              </div>
              <div className="available-stock-detail-wrapper">
                <div className="available-stock-detail">
                  <div className="stock-name">
                    <h5 className="stock-cmn">Retail</h5>
                  </div>
                  <div className="stock-unit">
                    <h5 className="stock-cmn">
                      {
                        productDetails?.stockArray?.slice(-1)[0]
                          .totalRetailInitialStock
                      }{" "}
                      Units
                    </h5>
                  </div>
                </div>
                <div className="available-stock-detail">
                  <div className="stock-name">
                    <h5 className="stock-cmn">Store consumption</h5>
                  </div>
                  <div className="stock-unit">
                    <h5 className="stock-cmn">
                      {
                        productDetails?.stockArray?.slice(-1)[0]
                          .totalStoreInitialStock
                      }{" "}
                      Units
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-wrapper">
              <form>
                <div className="input-wrapper">
                  <p className="label">Quantity</p>
                  <div
                    className={
                      isInvalid && !!quantity
                        ? "quantity-wrapper-validation"
                        : "quantity-wrapper"
                    }
                  >
                    <div className="stock-btn">
                      <button
                        type="button"
                        className="stock-design"
                        onClick={(e) => handleQuantityChange(e, "decrease")}
                        disabled={!quantity || quantity === 0}
                      >
                        -
                      </button>
                    </div>
                    <input
                      type="text"
                      min={0}
                      value={quantity}
                      onChange={(e) => handleQuantityInput(e)}
                      onKeyPress={bindInput}
                      maxLength={4}
                      placeholder="Type here"
                    />
                    <div className="stock-btn">
                      <button
                        type="button"
                        className="stock-insign"
                        onClick={(e) => handleQuantityChange(e, "increase")}
                        disabled={+quantity === 9999}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="input-wrapper">
                  <p className="label">Transfer from</p>
                  <OutsideAlerter setOpenTransfer={setOpenTransfer}>
                    <div className="dropdown-relative relative">
                      <div className="relative" onClick={transferDown}>
                        <input
                          type="select"
                          className="customInput"
                          value={transferFrom}
                        />
                        <div className="arrow-alignment-dropdown">
                          <img src={DropdownIcon} alt="DropdownIcon" />
                        </div>
                      </div>
                      <div
                        className={
                          openTransfer
                            ? "option-select-dropdown-align option-select-dropdown-show"
                            : "option-select-dropdown-hidden option-select-dropdown-align"
                        }
                      >
                        {transferOptions.map((transOpt) => {
                          return (
                            <div
                              className="option-list-style-cus"
                              onClick={(e) =>
                                handleSelectTransferFrom(e, transOpt)
                              }
                            >
                              <span>{transOpt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </OutsideAlerter>
                </div>
              </form>
            </div>
          </div>
          <div className="transfer-modal-footer">
            <div className="transfer-btn-wrapper">
              <div>
                <button className="transfer-cancel-btn" onClick={toggle}>
                  Cancel
                </button>
              </div>
              <div>
                <button
                  className="transfer-save-btn"
                  onClick={(e) => updateProductQuantity(e)}
                  disabled={!quantity || isInvalid}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransferModal;
