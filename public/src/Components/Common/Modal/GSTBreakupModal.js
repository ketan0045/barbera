import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";

export default function AddNewbrand(props) {
  const { modal, serviceDetails, cartItems, selctedMemberShip, SettingInfo } = props;
 
  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className=" sub-modal-design-first">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>GST Breakup</h4>
              <div className="close-button" onClick={() => props.toggle(false)}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="sub-modal-design-first-body">
            <div className="breakup-table">
              <table>
                <tr>
                  <th align="left">Services/Products/Membership</th>
                  <th>Main Amount</th>
                  <th>Membership Discount</th>
                  <th>Discount</th>
                  <th>Final Amount</th>
                  <th>GST %</th>
                  <th>GST Amount</th>
                  <th align="right">Total Amount</th>
                </tr>
                {serviceDetails?.map((services) => {
                  return (
                    <tr key={services._id}>
                      <td>
                        <span>{services.servicename}</span>
                        {/* <span>HSN Code :- {}</span> */}
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {services?.servicerate}
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {services?.membershipDiscount}
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {services?.servicediscount.toFixed(2)}
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a>{" "}
                          {services?.serviceflatdiscountedprice.toFixed(2)}
                        </span>
                      </td>
                      <td align="center">
                        <span>{services?.servicegst}%</span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a>
                          {services.servicegstamount.toFixed(2)}
                        </span>
                      </td>
                      <td align="right">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {services.servicesubtotal.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {cartItems?.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td>
                        <span>{product.productName}</span>
                        {/* <span>HSN Code :- {}</span> */}
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {product?.productSubTotal}
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> 0
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {(product?.productDiscount).toFixed(2)}
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a>{" "}
                          {(product?.flatdiscountedSubTotal).toFixed(2)}
                        </span>
                      </td>
                      <td align="center">
                        <span>{product?.productgst}%</span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a>
                          {product.discountedPriceGstAmount.toFixed(2)}
                        </span>
                      </td>
                      <td align="right">
                        <span>
                          <a>{SettingInfo?.currentType}</a>{" "}
                          {product.discountedPriceWithGstAmount.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {selctedMemberShip?.map((member) => {
                  return (
                    <tr key={member._id}>
                      <td>
                        <span>{member.membershipName}</span>
                        {/* <span>HSN Code :- {}</span> */}
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {member?.price}
                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> 0
                        </span>
                      </td>
                      <td align="center">
                        <span>
                        <a>{SettingInfo?.currentType}</a> {member?.membershipDiscount}

                        </span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {member?.flatdiscountedPrice}
                        </span>
                      </td>
                      <td align="center">
                        <span>{member?.gst == 0 ? 0  : 18 }%</span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a>
                          {member?.gst}
                        </span>
                      </td>
                      <td align="right">
                        <span>
                          <a>{SettingInfo?.currentType}</a>{" "}
                          {(member?.gst +
                           member?.flatdiscountedPrice).toFixed(2)}
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
    </>
  );
}
