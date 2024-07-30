import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";

export default function MembershipBreakupModel(props) {
  const { modal, serviceDetails, cartItems, selctedMemberShip,customer,SettingInfo } = props;

  const memberShipData =serviceDetails?.filter((service)=>service?.membershipDiscount > 0 )

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className=" sub-modal-design-first">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Membership discount breakup
                {customer?.membership ?
              <button style={{"background": customer?.selectMembership?.slice(-1)[0]?.colourCard, }}>{customer?.selectMembership?.slice(-1)[0]?.membershipName}</button> :null}
              </h4>
              <div className="close-button" onClick={() => props.toggle(false)}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="sub-modal-design-first-body">
            <div className="breakup-tables">
              <table>
                <tr>
                  <th align="left">Services</th>
                  <th>Retail Price</th>
                  <th>Service discount</th>
                  <th>Membership discount</th>
                  <th>Total discount</th>
                  <th>Final price</th>
                </tr>
                {memberShipData?.map((services) => {
                  return (
                    <tr key={services._id}>
                      <td>
                        <span>{services.servicename}</span>
                        
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a> {services?.servicerate}
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
                          {services?.membershipDiscount?.toFixed(2)}
                        </span>
                      </td>
                      <td align="center">
                        <span><a>{SettingInfo?.currentType}</a>{" "}{services?.servicediscount + services?.membershipDiscount}</span>
                      </td>
                      <td align="center">
                        <span>
                          <a>{SettingInfo?.currentType}</a>
                          {services.serviceflatdiscountedprice.toFixed(2)}
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
