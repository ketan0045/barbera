import React from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import "./Modal.scss";
export default function EditInvoiceModal(props) {
  const { invoicedata, modal, toggle ,SettingInfo} = props;

  return (
    <>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Edit Invoice #{invoicedata.invoiceId}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="edit-invoice-grid">
                <div className="edit-invoice-grid-items">
                  <div className="edit-invoice">
                    <div className="profile-grid">
                      <div className="profile-grid-items">
                        <div className="profile-image">
                          <span>
                            {invoicedata.customer?.firstName
                              ? invoicedata.customer?.firstName[0].toUpperCase()
                              : "A"}
                          </span>
                        </div>
                      </div>
                      <div className="profile-grid-items">
                        <span>
                          {invoicedata.customer?.firstName}{" "}
                          {invoicedata.customer?.lastName}
                        </span>
                        <p>+91 {invoicedata.customer?.mobileNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="edit-invoice-service">
                    <p>Services</p>
                    <div className="counter-service">
                      <span>{invoicedata?.serviceDetails.length}</span>
                    </div>
                  </div>
                  {invoicedata?.serviceDetails.map((service) => {
                    return (
                      <div key={service._id} className="edit-invoice-list-grid">
                        <div className="edit-invoice-list-grid-items divider-left">
                          <p>{service.servicename}</p>
                          <span>by {service.staffname}</span>
                        </div>
                        <div className="edit-invoice-list-grid-items">
                          <h6>
                            <a>{SettingInfo?.currentType}</a> {service.servicerate}
                          </h6>
                        </div>
                      </div>
                    );
                  })}

                  <div className="edit-invoice-service edit-invoice-product">
                    <p>Products</p>
                    <div className="counter-service">
                      <span>{invoicedata?.products.length}</span>
                    </div>
                  </div>
                  {invoicedata.products.map((product) => {
                    return (
                      <div key={product._id} className="product-invoice-grid">
                        <div className="product-invoice-grid-items">
                          <div className="content-alignment">
                            <p>{product.productName}</p>
                            <div className="counter-service">
                              <span>{product.productCount}</span>
                            </div>
                          </div>
                          <div className="rate-alignment">
                            <p>
                              {product.productquantity} {product.productUnit} •{" "}
                              <span>{SettingInfo?.currentType}</span> {product.productPrice}
                            </p>
                          </div>
                        </div>
                        <div className="product-invoice-grid-items">
                          <h6>
                            <span>{SettingInfo?.currentType}</span>{" "}
                            {product.productPrice * product.productCount}
                          </h6>
                        </div>
                      </div>
                    );
                  })}
                  <div className="add-more-invoice">
                    <p>+ Add more</p>
                  </div>
                </div>
                <div className="edit-invoice-grid-items">
                  <div className="child-box-fix">
                    <div className="checkout-text">
                      <p>Checkout</p>
                    </div>
                    <div className="total-grid">
                      <div className="total-grid-items">
                        <p>Sub total</p>
                      </div>
                      <div className="total-grid-items">
                        <p>
                          <span>{SettingInfo?.currentType}</span> {invoicedata.subTotal}
                        </p>
                      </div>
                    </div>
                    <div className="total-grid">
                      <div className="total-grid-items">
                        <p>Discount</p>
                      </div>
                      <div className="total-grid-items">
                        <p>
                          <span>{SettingInfo?.currentType}</span> {invoicedata?.discount.discountAmount}
                        </p>
                      </div>
                    </div>
                    <div className="total-grid">
                      <div className="total-grid-items">
                        <p>GST</p>
                      </div>
                      <div className="total-grid-items">
                        <p>
                          <span>{SettingInfo?.currentType}</span>
                          {invoicedata?.GST.gstAmount}
                        </p>
                      </div>
                    </div>
                    <div className="add-discount">
                      <p>+ Add discount</p>
                    </div>
                    <div className="discount-divider"></div>
                    <div className="total-grid">
                      <div className="total-grid-items">
                        <p>Total amount</p>
                      </div>
                      <div className="total-grid-items">
                        <p>
                          <span>{SettingInfo?.currentType}</span> {invoicedata.totalAmount}
                        </p>
                      </div>
                    </div>
                    <div className="payment-method-align">
                      <div className="invoice-form-group">
                        <label>Payment Method</label>
                        <div className="input-type-relative">
                          <input
                            type="text"
                            placeholder="Cash"
                            value={invoicedata.paymentMethod}
                          />
                          <div className="drop-down-align">
                            <img src={DropDownIcon} alt="DropDownIcon" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="checkbox-alignment">
                      <input type="checkbox" checked />
                      <span>Send invoice link to customer through SMS</span>
                    </div>
                  </div>
                  <div className="save-change-divider"></div>
                  <div className="save-change-button">
                    <button>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
