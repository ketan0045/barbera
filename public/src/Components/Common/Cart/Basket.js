import React, { useState, useEffect, useRef } from "react";
import "../Modal/Modal.scss";

export default function Basket(props) {
  const {
    cartItems,
    onAdd,
    onRemove,
    clearCart,
    Continue,
    SettingInfo,
    staffData,
    SelectStaffFromProduct,
  } = props;
  const itemsPrice = cartItems?.reduce(
    (a, c) => a + c.productCount * c.price,
    0
  );
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = itemsPrice > 2000 ? 0 : 20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  const [asignDropdown, setAsignDropdown] = useState(false);
  const [productName, setProductName] = useState();

  const [OnStaff, setOnStaff] = useState({
    firstName: "No staff",
    lastName: "assigned",
  });

  const SelectStaff = (e, staff, prdname) => {
    SelectStaffFromProduct(staff,prdname)
    setOnStaff(staff);
    setProductName(prdname);
    setAsignDropdown(!asignDropdown);
  };

  const OpenDropdown = (item) => {
    setProductName(item);
    setAsignDropdown(!asignDropdown);
  };

  const productTypeRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
        if (asignDropdown && productTypeRef.current && !productTypeRef.current.contains(e.target)) {
          setAsignDropdown(false);
        }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [asignDropdown]);

  return (
    <div className="product-service-grid-items">
      <div className="empty-card">
        <h5>Inventory Cart</h5>

        <div>
          {cartItems?.length === 0 && (
            <>
              <p>The cart is empty right now</p>
            </>
          )}
          {cartItems.length > 0 ? (
            <div className="product-details-grid-height-child" >
              {cartItems.map((item, i) => {
                return (
                  <>
                    <div className="sub-product-details-grid-style">
                      <div className="sub-product-details-grid">
                        <div className="sub-product-details-grid-items">
                          <div className="counter-alignment-add-cart">
                            <h6>{item.productName}</h6>
                            <div className="add-related-counter">
                              {item.productCount}
                            </div>
                          </div>
                          <div className="child-alignment">
                            <span>
                              {item.productquantity} {item.productUnit} •
                            </span>
                            <h5>
                              <del>
                                {" "}
                                <a>{SettingInfo?.currentType}</a>{" "}
                                {item.productPrice}
                              </del>
                              &nbsp;<a>{SettingInfo?.currentType}</a>{" "}
                              {item.discountedPrice}
                            </h5>
                          </div>
                        </div>
                        <div className="sub-product-details-grid-items">
                          <h3 style={{ fontSize: "18px" }}>
                            <span>{SettingInfo?.currentType}</span>{" "}
                            {item.discountedSubTotal}
                          </h3>
                        </div>
                      </div>
                      {SettingInfo?.multipleStaff?.assignStaffForProduct ?
                      <div
                        className="asign-box-alignment"
                        onClick={() => OpenDropdown(item)}
                      >
                        <div className="asign-input-relative">
                          <input
                            type="text"
                            placeholder="No staff assigned"
                            disabled
                            value={!item?.staffName || item?.staffName === "" ? "No staff assigned" : item?.staffName}
                          />
                          <div className="arrow-alignment-asign">
                            <svg
                              width="12"
                              height="6"
                              viewBox="0 0 12 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                opacity="0.5"
                                d="M12 0L0 0L6 6L12 0Z"
                                fill="#193566"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                        // ref={productTypeRef}
                          className={
                            asignDropdown && productName.productName === item.productName
                              ? "asign-dropdown asign-dropdown-show"
                              : "asign-dropdown asign-dropdown-hidden"
                          }
                        > 
                          <div className="asign-dropdown-style-new" 
                          // ref={productTypeRef}
                          >
                            <ul>
                              <li
                                onClick={(e) =>
                                  SelectStaff(e, {
                                    firstName: "No staff",
                                    lastName: "assigned",
                                    _id:"1"
                                  },item)
                                }
                              >
                                No staff assigned
                              </li>
                              {staffData?.length > 0 ? (
                                staffData.map((staff, i) => {
                                  return (
                                    <li
                                      onClick={(e) =>
                                        SelectStaff(e, staff, item)
                                      }
                                    >
                                      {staff?.firstName + " " + staff?.lastName}{" "}
                                    </li>
                                  );
                                })
                              ) : (
                                <li> NO Staff Data </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div> :""}
                    </div>
                  </>
                );
              })}
            </div>
          ) : null}
          {cartItems.length === 0 ? (
            <>
              {" "}
              <div className="button-right-side add-cart-final-align">
                <button disabled> Continue</button>
              </div>
            </>
          ) : (
            <>
              <div className="add-final-amount-design">
                <span>Total amount: </span>
                <p style={{ paddingLeft: "5px" }}>
                  {" "}
                  <span>{SettingInfo?.currentType}</span>{" "}
                  {cartItems
                    .map((item) => item.discountedSubTotal)
                    .reduce((prev, curr) => prev + curr, 0)}
                </p>
              </div>
              <div className="button-right-side add-cart-final-align">
                <button
                  className="clear-cart-button"
                  onClick={() => clearCart()}
                >
                  Clear Cart
                </button>
                <button onClick={() => Continue()}> Continue</button>
              </div>
            </>
          )}

          {/* {cartItems.length !== 0 && (
            <>
              <div className="row">
                <div className="col-2">Items Price</div>
                <div className="col-1 text-right">${itemsPrice.toFixed(2)}</div>
              </div>
              <div className="row">
                <div className="col-2">Tax Price</div>
                <div className="col-1 text-right">${taxPrice.toFixed(2)}</div>
              </div>
              <div className="row">
                <div className="col-2">Shipping Price</div>
                <div className="col-1 text-right">
                  ${shippingPrice.toFixed(2)}
                </div>
              </div>
  
              <div className="row">
                <div className="col-2">
                  <strong>Total Price</strong>
                </div>
                <div className="col-1 text-right">
                  <strong>${totalPrice.toFixed(2)}</strong>
                </div>
              </div>
              <hr />
              <div className="row">
                <button onClick={() => alert('Implement Checkout!')}>
                  Checkout
                </button>
              </div>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}
