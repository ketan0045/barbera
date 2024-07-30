import React, { useEffect, useState } from "react";
import "../Modal/CustomModal.scss";
import "../Modal/Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropdownIcon from "../../../assets/svg/drop-down.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import OutsideAlerter from "../OutsideAlerter";

function CustomModal(props) {

  const {
    togglecustom,
    manageStock,
    getProducts,
    productDetails,
    userInfo,
    close,
  } = props;
  const [productDrop, setProductDrop] = useState(false);
  const [reasonDrop, setReasonDrop] = useState(false);
  const [productType, setProductType] = useState(
    productDetails?.productType === "Store Consumable & Retail"
      ? "Retail"
      : productDetails?.productType
  );
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState();
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [checkIsValid, setCheckIsValid] = useState(false);

  

  const increaseStockReasons = [
    { key: "1", value: "New stock - added manually" },
    { key: "2", value: "Returned" },
    { key: "3", value: "Adjustments" },
    { key: "4", value: "Other reason" },
  ];
  const decreaseStockReasons = [
    { key: "1", value: "Adjustments" },
    { key: "2", value: "Expired" },
    { key: "3", value: "Lost" },
    { key: "4", value: "Other reason" },
  ];

  const handleSelectProductType = (e, key) => {
    setProductType(key);
    setProductDrop(!productDrop);
  };

  const handleSelectReason = (e, reason) => {
    setSelectedOption(reason);
    setReasonDrop(!reasonDrop);
    if (reason === "Other reason") {
      setShowDescription(true);
    } else {
      setShowDescription(false);
    }
  };

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
    setQuantity(e.target.value);
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

  const updateProductQuantity = async (e) => {
    e.preventDefault();
    const body = {
      productId: productDetails._id,
      retailInitialStock: productType.toLowerCase() === "retail" ? quantity : 0,
      storeInitialStock: productType.toLowerCase() !== "retail" ? quantity : 0,
      type: manageStock.toLowerCase() === "add" ? "CR" : "DR",
      companyId: userInfo.companyId,
      description: !description ? selectedOption : description,
    };
   
    let res = await ApiPost("stock/", body);
    try {
      if (res.data.status === 200) {
        getProducts();
        close();
        togglecustom(e, manageStock, 200);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseCustomModal = (e) => {
    togglecustom();
    setProductType("Retail");
    setOptions([]);
    setSelectedOption();
    setQuantity();
  };

  useEffect(() => {
    if (manageStock.toLowerCase() === "add") {
      setOptions(increaseStockReasons);
      setSelectedOption(increaseStockReasons[0].value);
    } else {
      setOptions(decreaseStockReasons);
      setSelectedOption(decreaseStockReasons[0].value);
    }
  }, []);

  

  useEffect(() => {
    if (quantity) {
      const inputInvalid =
        manageStock.toLowerCase() === "remove" &&
        (productType.toLowerCase() === "retail"
          ? +quantity >
            +productDetails?.stockArray?.slice(-1)[0].totalRetailInitialStock
          : +quantity >
            +productDetails?.stockArray?.slice(-1)[0].totalStoreInitialStock);
      setIsInvalid(inputInvalid);
    }
  }, [quantity, checkIsValid]);

  return (
    <>
      <div className="custom-modal-wrapper">
        <div className="custom-modal">
          <div className="custom-modal-header">
            <button
              type="button"
              className="modal-close"
              onClick={togglecustom}
            >
              <img className="close" src={CloseIcon} alt="CloseIcon" />
            </button>
            <h5 className="custom-modal-title">{manageStock} stock</h5>
          </div>
          <div className="custom-modal-body">
            <div className="content-wrapper">
              <div>
                <h6 className="custom-modal-head">
                  {productDetails?.productName}
                </h6>
                {/* <p className='custom-modal-subhead'> L’Oreal • 250 ml</p> */}
                <p className="custom-modal-subhead">
                  {" "}
                  {productDetails?.brandId?.brandName} •{" "}
                  {productDetails?.quantity} {productDetails?.unit}
                </p>
              </div>
              <div className="total-stocks">
                <p className="total">
                  <span>
                    {productType.toLowerCase() === "retail"
                      ? productDetails?.stockArray?.slice(-1)[0]
                          .totalRetailInitialStock
                      : productDetails?.stockArray?.slice(-1)[0]
                          .totalStoreInitialStock}
                  </span>{" "}
                  in stock
                </p>
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
                {productDetails?.productType ===
                  "Store Consumable & Retail" && (
                  <div className="input-wrapper">
                    <p className="label">Product type</p>
                    <div className="dropdown-relative relative">
                      <OutsideAlerter setProductDrop={setProductDrop}>
                        <div
                          className="relative"
                          onClick={() => setProductDrop(!productDrop)}
                        >
                          <input
                            type="select"
                            className="selectMenu"
                            value={productType}
                            readOnly
                          />
                          <div className="arrow-alignment-dropdown">
                            <img src={DropdownIcon} alt="DropdownIcon" />
                          </div>
                        </div>
                        <div
                          className={
                            productDrop
                              ? "option-select-dropdown-align option-select-dropdown-show"
                              : "option-select-dropdown-hidden option-select-dropdown-align"
                          }
                        >
                          <div
                            className="option-list-style-cus"
                            onClick={(e) => {
                              handleSelectProductType(e, "Retail");
                              setCheckIsValid(!checkIsValid);
                            }}
                          >
                            <span>Retail</span>
                          </div>
                          <div
                            className="option-list-style-cus"
                            onClick={(e) => {
                              handleSelectProductType(e, "Store consumption");
                              setCheckIsValid(!checkIsValid);
                            }}
                          >
                            <span>Store consumption</span>
                          </div>
                        </div>
                      </OutsideAlerter>
                    </div>
                  </div>
                )}
                <div className="input-wrapper">
                  <p className="label">Reason</p>
                  <OutsideAlerter setReasonDrop={setReasonDrop}>
                    <div className="dropdown-relative relative">
                      <div
                        className="relative"
                        onClick={() => setReasonDrop(!reasonDrop)}
                      >
                        <input
                          type="select"
                          className="selectMenu"
                          value={selectedOption}
                          readOnly
                        />
                        <div className="arrow-alignment-dropdown">
                          <img src={DropdownIcon} alt="DropdownIcon" />
                        </div>
                      </div>
                      <div
                        className={
                          reasonDrop
                            ? "option-select-dropdown-align option-select-dropdown-show"
                            : "option-select-dropdown-hidden option-select-dropdown-align"
                        }
                      >
                        {options.map((opt) => {
                          return (
                            <div
                              className="option-list-style-cus"
                              onClick={(e) => handleSelectReason(e, opt?.value)}
                            >
                              <span>{opt?.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </OutsideAlerter>
                </div>
                <div
                  className={
                    showDescription
                      ? "input-wrapper visible-wrapper"
                      : "input-wrapper hidden-wrapper"
                  }
                >
                  <p className="label">Description</p>
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        className="custom-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="custom-modal-footer">
            <div className="custom-btn-wrapper">
              <div>
                <button
                  className="custom-cancel-btn"
                  onClick={(e) => handleCloseCustomModal(e)}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  className="custom-save-btn"
                  onClick={(e) => updateProductQuantity(e)}
                  disabled={!quantity || isInvalid || selectedOption === "Other reason" && !description}
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

export default CustomModal;
