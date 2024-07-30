import React, { useState, useEffect, useRef } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import SwitchIcon from "../../../assets/svg/switch-icon.png";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import Auth from "../../../helpers/Auth";
import { ApiPost } from "../../../helpers/API/ApiData";
import Delete from "../Toaster/Delete";
import * as userUtil from "../../../utils/user.util";


export default function EditTaxDetailsModal(props) {
  const { editTaxDetails } = props;
  const userInfo = Auth.getUserDetail();
  const taxTypeRef = useRef();
  const taxRef = useRef();
  const pTaxTypeRef = useRef();
  const pTaxRef = useRef();
  const [textMenuList, setTextMenuList] = useState(false);
  const [textMenuListGst, setTextMenuListGst] = useState(false);
  const [textMenuListGstProduct, setTextMenuListGstProduct] = useState(false);
  const [textMenuListProduct, setTextMenuListProduct] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const [serviceTaxToggle, setServiceTaxToggle] = useState(false);
  const [productTaxToggle, setProductTaxToggle] = useState(false);
  const [gstNumber, setGstNumber] = useState();
  const [taxType, setTaxType] = useState();
  const [productTaxType, setProductTaxType] = useState("Exclusive");
  const [availlist, setAvaillist] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [errors, setError] = useState({});

  const [deleteModal, setDeleteModal] = useState(false);
  const opendeleteModal = () => {
    if (validateForm()) {
      deleteModaltoggle();
    }
  };
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
  };

  const taxList = [
    { name: " CGST 2.5%", value: "2.5" },
    { name: " CGST 6%", value: "6" },
    { name: " CGST 9%", value: "9" },
    { name: " CGST 14%", value: "14" },
    { name: " SGST 2.5%", value: "2.5" },
    { name: " SGST 6%", value: "6" },
    { name: " SGST 9%", value: "9" },
    { name: " SGST 14%", value: "14" },
    { name: " IGST 5%", value: "5" },
    { name: " IGST 12%", value: "12" },
    { name: " IGST 18%", value: "18" },
    { name: " IGST 28%", value: "28" },
  ];

  const checkValueNoSpace = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (isToggle) {
      if (gstNumber.length < 15) {
        formIsValid = false;
        errors["gst"] = " * Please enter valid gst no.";
      }
    }

    setError(errors);
    return formIsValid;
  };
  
   const handleOnClick = (e, key) => {
    if (key === "taxType") {
      setTaxType(e.target.innerText);
    } else if (key === "pTaxType") {
      setProductTaxType(e.target.innerText);
    }
  };

  const handleGstType = (e,type) =>{
    setProductTaxType(type)
  }

  const handleOnChange = (e) => {
    setGstNumber(e.target.value);
  };

  const toggleHandler = (e, key) => {
    if (key === "gstCharge") {
      setProductTaxType("Exclusive")
      if (isToggle === true) {
        setDisabled(true);
      } else {
        setDisabled(false);
        setGstNumber("");
      }
      setIsToggle(!isToggle);
      setServiceTaxToggle(false);
      setProductTaxToggle(false);
    } else if (key === "serviceTax") {
      if (serviceTaxToggle === true) {
        if (!availlist.length > 0 || productTaxToggle === false) {
          setDisabled(false);
        }
      } else {
        setDisabled(true);
      }
      setServiceTaxToggle(!serviceTaxToggle);
    } else if (key === "productTax") {
      setProductTaxToggle(!productTaxToggle);
      if (!productTaxToggle || serviceTaxToggle === false) {
        setAvaillist([]);
        setDisabled(false);
      } else {
        if (availlist.length > 0) {
          setDisabled(true);
        }
      }
    }
  };

  const multipleTaxSlabs = (e) => {
    if (e.target.checked && e.target.name === "name") {
      availlist.push(e.target.value);
    } else if (e.target.name === "name") {
      let index = availlist.indexOf(e.target.value);
      availlist.splice(index, 1);
    }
    setAvaillist([...availlist]);
    if (availlist.length > 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const updateCall = async (e) => {
    
    let values = {
      tax: {
        gstCharge: isToggle,
        gstNumber: gstNumber,
        serviceTax: serviceTaxToggle,
        serviceTaxPer: "CGST 9%, SGST 9%",
        productTax: productTaxToggle,
        productTaxPer: availlist,
        gstType:productTaxType,
      },
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
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (textMenuList) {
        if (
          textMenuList &&
          taxTypeRef.current &&
          !taxTypeRef.current.contains(e.target)
        ) {
          setTextMenuList(false);
        }
      } else if (textMenuListGst) {
        if (
          textMenuListGst &&
          taxRef.current &&
          !taxRef.current.contains(e.target)
        ) {
          setTextMenuListGst(false);
        }
      } else if (textMenuListProduct) {
        if (
          textMenuListProduct &&
          pTaxTypeRef.current &&
          !pTaxTypeRef.current.contains(e.target)
        ) {
          setTextMenuListProduct(false);
        }
      } else if (textMenuListGstProduct) {
        if (
          textMenuListGstProduct &&
          pTaxRef.current &&
          !pTaxRef.current.contains(e.target)
        ) {
          setTextMenuListGstProduct(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [
    textMenuList,
    textMenuListGst,
    textMenuListProduct,
    textMenuListGstProduct,
  ]);

  useEffect(() => {
    if (editTaxDetails) {
      setIsToggle(editTaxDetails.gstCharge);
      setGstNumber(editTaxDetails.gstNumber);
      setProductTaxType(editTaxDetails.gstType)
      setServiceTaxToggle(editTaxDetails.serviceTax);
      setProductTaxToggle(editTaxDetails.productTax);
      setAvaillist(editTaxDetails.productTaxPer);
      if (
        editTaxDetails?.serviceTax === true &&
        editTaxDetails?.productTaxPer?.length > 0
      ) {
        setDisabled(true);
      }
    }
  }, [editTaxDetails]);

  useEffect(() => {
    if (
      serviceTaxToggle === true &&
      productTaxToggle === true &&
      availlist.length <= 0
    ) {
      setDisabled(false);
    }
    if (serviceTaxToggle === true && productTaxToggle === false) {
      setDisabled(true);
    }
  }, [serviceTaxToggle, productTaxToggle]);

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
                  <h2>TAX</h2>
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
                    <h3>TAX</h3>
                  </div>
                  <div className="card-details">
                    <div className="tax-background">
                      <div className="tax-text-alignment">
                        <p>Charge GST</p>
                        {/* <img src={SwitchIcon} alt="SwitchIcon"/> */}
                        <label
                          class="switch"
                          onChange={(e) => toggleHandler(e, "gstCharge")}
                        >
                          <input type="checkbox" checked={isToggle} />
                          <span class="slider round"></span>
                        </label>
                      </div>
                      {isToggle && (
                        <div className="form-group">
                          <label>
                            GST Number
                            {gstNumber.length < 15 && (
                              <span
                                style={{
                                  color: "red",
                                  top: "5px",
                                  fontSize: "10px",
                                }}
                              >
                                {errors["gst"]}
                              </span>
                            )}
                          </label>
                          <input
                            type="text"
                            name="gst"
                            value={gstNumber?.toUpperCase()}
                            maxLength="15"
                            placeholder="22AAAAA0000A1Z5"
                            onKeyPress={checkValueNoSpace}
                            onChange={(e) => handleOnChange(e)}
                          />
                        </div>
                      )}
                    </div>
                   
                    {isToggle && (
                      <div>
                         <div>
                        <div className="tax-background">
                          <div className="tax-text-alignment">
                            <p>Tax type</p>
                          </div>
                            <div>
                              <div className="form-group relative text-input-style tax-bottom-align-modal">
                                {/* <label>Tax type</label> */}
                                <div
                                  className="relative"
                                  onClick={() =>
                                    setTextMenuListProduct(!textMenuListProduct)
                                  }
                                  ref={pTaxTypeRef}
                                >
                                  <input
                                    type="text"
                                    placeholder="Inclusive & Exclusive"
                                    value={productTaxType}
                                  />
                                  <div className="icon-center-align-input">
                                    <img
                                      src={DropDownIcon}
                                      alt="DropDownIcon"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={
                                    textMenuListProduct
                                      ? "tax-menu-list tax-menu-open"
                                      : "tax-menu-list tax-menu-close"
                                  }
                                >
                                  <div className="tax-sub-menu-design">
                                    <ul>
                                      <li onClick={(e)=>handleGstType(e,"Inclusive")}>Inclusive</li>
                                      <li onClick={(e)=>handleGstType(e,"Exclusive")}>Exclusive</li>
                                    </ul>
                                  </div>
                                </div>
                              </div> 
                            </div>
                        </div>
                      </div>
                        <div className="tax-background">
                          <div className="tax-text-alignment">
                            <p>Service TAX</p>
                            {/* <img src={SwitchIcon} alt="SwitchIcon" /> */}
                            <label
                              class="switch"
                              onChange={(e) => toggleHandler(e, "serviceTax")}
                            >
                              <input
                                type="checkbox"
                                checked={serviceTaxToggle}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                          {serviceTaxToggle && (
                            <div>
                              {/* <div className="form-group relative text-input-style tax-bottom-align-modal">
                                <label>Tax type</label>
                                <div
                                  className="relative"
                                  onClick={() => setTextMenuList(!textMenuList)}
                                  ref={taxTypeRef}
                                >
                                  <input
                                    type="text"
                                    placeholder="Inclusive & Exclusive"
                                    value={taxType}
                                  />
                                  <div className="icon-center-align-input">
                                    <img
                                      src={DropDownIcon}
                                      alt="DropDownIcon"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={
                                    textMenuList
                                      ? "tax-menu-list tax-menu-open"
                                      : "tax-menu-list tax-menu-close"
                                  }
                                >
                                  <div className="tax-sub-menu-design">
                                    <ul
                                      onClick={(e) =>
                                        handleOnClick(e, "taxType")
                                      }
                                    >
                                      <li>Inclusive</li>
                                      <li>Exclusive</li>
                                    </ul>
                                  </div>
                                </div>
                              </div> */}
                              <div className="form-group relative text-input-style tax-bottom-align-modal">
                                <label>Tax %</label>
                                <div
                                  className="relative"
                                  onClick={() =>
                                    setTextMenuListGst(!textMenuListGst)
                                  }
                                  ref={taxRef}
                                >
                                  <input
                                    type="text"
                                    placeholder="Choose from the list"
                                    style={{ cursor: "pointer" }}
                                    value="CGST 9%, SGST 9%"
                                    disabled
                                  />
                                  {/* <div className="icon-center-align-input">
                                    <img
                                      src={DropDownIcon}
                                      alt="DropDownIcon"
                                    />
                                  </div> */}
                                </div>
                                {/* <div
                                  className={
                                    textMenuListGst
                                      ? "tax-menu-list tax-menu-open"
                                      : "tax-menu-list tax-menu-close"
                                  }
                                >
                                  <div className="tax-sub-menu-design">
                                    <ul>
                                      <li>Inclusive & Exclusive</li>
                                      <li>Inclusive & Exclusive</li>
                                      <li>Inclusive & Exclusive</li>
                                      <li>Inclusive & Exclusive</li>
                                      <li>Inclusive & Exclusive</li>
                                    </ul>
                                  </div>
                                </div> */}
                              </div>
                              
                            </div>
                          )}
                        </div>
                        <div className="tax-background">
                          <div className="tax-text-alignment">
                            <p>Product TAX</p>
                            {/* <img src={SwitchIcon} alt="SwitchIcon" /> */}
                            <label
                              class="switch"
                              onChange={(e) => toggleHandler(e, "productTax")}
                            >
                              <input
                                style={{ cursor: "pointer" }}
                                type="checkbox"
                                checked={productTaxToggle}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                          {productTaxToggle && (
                            <div>
                              {/* <div className="form-group relative text-input-style tax-bottom-align-modal">
                                <label>Tax type</label>
                                <div
                                  className="relative"
                                  onClick={() =>
                                    setTextMenuListProduct(!textMenuListProduct)
                                  }
                                  ref={pTaxTypeRef}
                                >
                                  <input
                                    type="text"
                                    placeholder="Inclusive & Exclusive"
                                    value={productTaxType}
                                  />
                                  <div className="icon-center-align-input">
                                    <img
                                      src={DropDownIcon}
                                      alt="DropDownIcon"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={
                                    textMenuListProduct
                                      ? "tax-menu-list tax-menu-open"
                                      : "tax-menu-list tax-menu-close"
                                  }
                                >
                                  <div className="tax-sub-menu-design">
                                    <ul
                                      onClick={(e) =>
                                        handleOnClick(e, "pTaxType")
                                      }
                                    >
                                      <li>Inclusive</li>
                                      <li>Exclusive</li>
                                    </ul>
                                  </div>
                                </div>
                              </div> */}
                              <div
                                className="form-group relative text-input-style tax-bottom-align-modal"
                                ref={pTaxRef}
                              >
                                <label>Tax %</label>
                                <div
                                  className="relative"
                                  onClick={() =>
                                    setTextMenuListGstProduct(
                                      !textMenuListGstProduct
                                    )
                                  }
                                >
                                  <input
                                    type="dropdown"
                                    placeholder="Choose from the list"
                                    value={availlist}
                                    style={{ cursor: "pointer" }}
                                  />
                                  <div className="icon-center-align-input">
                                    <img
                                      src={DropDownIcon}
                                      alt="DropDownIcon"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={
                                    textMenuListGstProduct
                                      ? "tax-menu-list tax-menu-open"
                                      : "tax-menu-list tax-menu-close"
                                  }
                                >
                                  <div className="tax-sub-menu-design">
                                    {taxList.map((tax) => {
                                      return (
                                        <div
                                          key={tax._id}
                                          className="option-list-style-cus checkbox-design-change"
                                        >
                                          <input
                                            type="checkbox"
                                            name="name"
                                            id="id"
                                            value={tax.name}
                                            checked={
                                              availlist.includes(tax.name)
                                                ? true
                                                : false
                                            }
                                            onChange={(e) =>
                                              multipleTaxSlabs(e)
                                            }
                                          />
                                          <span>{tax.name}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
