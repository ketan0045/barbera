import React, { useState, useEffect, useRef } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import SwitchIcon from "../../../assets/svg/switch-icon.png";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import Auth from "../../../helpers/Auth";
import { ApiPost } from "../../../helpers/API/ApiData";
import Delete from "../Toaster/Delete";
import * as userUtil from "../../../utils/user.util";


export default function EditCurrencyDetailsModal(props) {
  const userInfo = Auth.getUserDetail();

  const [ subMenuOpen , setSubMenuopen ] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currencyType, setCurrencyType] = useState()
  const [currencyValue, setCurrencyValue] = useState()
  const [errors, setError] = useState({});

  useEffect(()=>{
    setCurrencyValue(props.currencyData)
    if(props.currencyData === "₹"){
      setCurrencyType("₹-Rupees")
    }else if(props.currencyData === "$"){
      setCurrencyType("$-Dollar")
    }else if(props.currencyData === "£"){
      setCurrencyType("£-Pound")
    }
    else if(props.currencyData === "€"){
      setCurrencyType("€-Euro")
    }
    else if(props.currencyData === "¥"){
      setCurrencyType("¥-Yen")
    }
  },[])

  const opendeleteModal = () => {
      deleteModaltoggle();
  };
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
  };

  const updateCall = async (e) => {
    let values = {
        currentType: currencyValue,
        companyId: userInfo.companyId,
      };
      let res = await ApiPost("setting/", values);
      try {
        if (res.data.status === 200) {
          props.toggle(res.data.status,res?.data?.data[0]);
          userUtil.setSetting(res?.data?.data[0])
        }
      } catch (err) {
        props.toggle(err);
      }
  }

  

  const handleCurrencyType = (e,type,value)=>{
    setCurrencyType(type)
    setCurrencyValue(value)
    setDisabled(true)
    setSubMenuopen(!subMenuOpen)
  }
  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {deleteModal && (
              <Delete
                modal={deleteModal}
                toggle={deleteModaltoggle}
                editTaxData={disabled}
                handleOnUpdateCall={updateCall}
              />
            )}
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => props.toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Currency</h2>
                </div>
              </div>
              {disabled ? (
                <div className="modal-button">
                  <button onClick={() => opendeleteModal()}>Save</button>
                </div>
              ) : (
                <div className="modal-button">
                  <button disabled>Save</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Currency</h3>
                  </div>
                  <div className="card-details">
                    <div className="tax-background">
                     <div className="option-select-group-invoice-data">
                       <div className="text-alignment">
                          <label>System currency</label>
                          </div>
                          <div className="relative">
                            <div
                              className="input-relative"
                              onClick={() =>
                                setSubMenuopen(!subMenuOpen)
                              }
                            >
                              <input
                                type="text" value={currencyType} placeholder="₹-Rupees"
                              />
                              <div className="drop-down-icon-center">
                                <img
                                  src={DropDownIcon}
                                  alt="DropDownIcon"
                                />
                              </div>
                            </div>
                            <div
                              className={
                                subMenuOpen
                                  ? "sub-menu-open sub-menu"
                                  : "sub-menu sub-menu-close"
                              }
                            >
                              <div className="sub-menu-design">
                                <ul>
                                  <li onClick={(e)=>handleCurrencyType(e,"₹-Rupees", "₹")}>₹-Rupees</li>
                                  <li onClick={(e)=>handleCurrencyType(e,"$-Dollar", "$")}>$-Dollar</li>
                                  <li onClick={(e)=>handleCurrencyType(e,"£-Pound", "£")}>£-Pound</li>
                                  <li onClick={(e)=>handleCurrencyType(e,"€-Euro", "€")}>€-Euro</li>
                                  <li onClick={(e)=>handleCurrencyType(e,"¥-Yen", "¥")}>¥-Yen</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
