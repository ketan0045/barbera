import React, { useEffect, useState } from "react";
import "./Modal.scss";
import DropDownIcon from "../../../../src/assets/svg/drop-down.svg";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import YellowMembership from "../../../assets/svg/Yellow-Membership.svg";
import SkyBlueMembership from "../../../assets/svg/SkyBlue-Membership.svg";
import OrangeMembership from "../../../assets/svg/Orange-Membership.svg";
import BlueMembership from "../../../assets/svg/BLue-Membership.svg";

export default function EditMembershipModal(props) {
  const {
    modal,
    toggle,
    editBrand,
    RemoveService,
    showDiscount,
    editMembershipValue,
    editInvoice,
    RemoveMembership,
    SettingInfo,
    gstOn,
    gstType,
    staffData,
  } = props;
  const [subDiscoutMenu, setSubDiscoutMenu] = useState(false);
  //   const { modal, toggle, editServiceData, editBrand,RemoveService,   showDiscount } = props;
  const [discount, setDiscount] = useState(
    editMembershipValue.membershipDiscount
  );
  const [inclusivediscount, setInclusiveDiscount] = useState();
  const [discounttype, setDiscountType] = useState(SettingInfo?.currentType);
  const [discountPerUnit, setDiscountPerUnit] = useState(
    editMembershipValue.discountedPrice
  );
  const [inclusivediscountPerUnit, setInclusiveDiscountPerUnit] = useState(
    editMembershipValue.discountedPrice + editMembershipValue?.gst
  );
  const [errors, setError] = useState({});
  const [productdisCountType, setProductdisCountType] = useState("Rs.");
  const [changes, setChanges] = useState(false);
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [staffId, setStaffId] = useState(editMembershipValue?.staffId);
  const [selectedStaff, setSelectedStaff] = useState(
    editMembershipValue?.staffName
      ? editMembershipValue?.staffName
      : "No staff assigned"
  );

  let editedData = {
    ...editMembershipValue,
    flatdiscountedPrice: parseFloat(discountPerUnit, 10),
    discountedPrice: parseFloat(discountPerUnit, 10),
    gst: parseFloat(
      ((discountPerUnit * editMembershipValue.gstPercentage) / 100).toFixed(2),
      10
    ),
    membershipDiscount: parseFloat(
      (editMembershipValue.price - discountPerUnit).toFixed(2),
      10
    ),
    staffName: selectedStaff,
    staffId: staffId,
  };

  const ChangeDiscount = (e) => {
    setChanges(true);
    if (discounttype === "%") {
      setError(errors);
      setDiscount(parseInt(e.target.value, 10));
      setDiscountPerUnit(
        parseInt(
          (
            editMembershipValue.discountedPrice -
            parseInt(
              (editMembershipValue.discountedPrice * e.target.value) / 100,
              10
            )
          ).toFixed(2),
          10
        )
      );
    } else {
      setDiscount(parseInt(e.target.value, 10));
      setDiscountPerUnit(
        parseInt(
          (editMembershipValue.discountedPrice - e.target.value).toFixed(2),
          10
        )
      );
    }
  };

  const ChangeInclusiveDiscount = (e) => {
    setChanges(true);
    if (discounttype === "%") {
      setError(errors);
      setInclusiveDiscount(parseFloat(e.target.value, 10));
      setInclusiveDiscountPerUnit(
        parseFloat(
          editMembershipValue.discountedPrice +
            editMembershipValue?.gst -
            parseFloat(
              (
                ((editMembershipValue.discountedPrice +
                  editMembershipValue?.gst) *
                  e.target.value) /
                100
              ).toFixed(2),
              10
            )
        ).toFixed(2),
        10
      );
      setDiscountPerUnit(
        parseFloat(
          (
            parseFloat(
              editMembershipValue.discountedPrice +
                editMembershipValue?.gst -
                parseFloat(
                  (
                    ((editMembershipValue.discountedPrice +
                      editMembershipValue?.gst) *
                      e.target.value) /
                    100
                  ).toFixed(2),
                  10
                )
            ) /
            (1 + 18 / 100)
          ).toFixed(2),
          10
        )
      );
    } else {
      setInclusiveDiscount(parseInt(e.target.value, 10));
      setInclusiveDiscountPerUnit(
        parseFloat(
          (
            editMembershipValue.discountedPrice +
            editMembershipValue?.gst -
            e.target.value
          ).toFixed(2),
          10
        )
      );
      setDiscountPerUnit(
        parseFloat(
          (
            parseFloat(
              (
                editMembershipValue.discountedPrice +
                editMembershipValue?.gst -
                e.target.value
              ).toFixed(2),
              10
            ) /
            (1 + 18 / 100)
          ).toFixed(2),
          10
        )
      );
    }
  };

  const HandleDiscountPerUnit = (e) => {
    setChanges(true);
    let errors = {};
    let formIsValid = true;
    if (e.target.value > editMembershipValue.discountedPrice) {
      formIsValid = false;
      errors["perUnit"] = "* Enter valid input";
    }
    setError(errors);

    if (discounttype === "%") {
      setDiscountPerUnit(e.target.value);
      setDiscount(
        parseInt(
          100 -
            (
              (e.target.value * 100) /
              editMembershipValue.discountedPrice
            ).toFixed(2),
          10
        )
      );
    } else {
      setDiscountPerUnit(e.target.value);
      setDiscount(
        parseInt(
          (editMembershipValue.discountedPrice - e.target.value).toFixed(2),
          10
        )
      );
    }
  };
  const HandleInclusiveDiscountPerUnit = (e) => {
    setChanges(true);
    let errors = {};
    let formIsValid = true;
    if (e.target.value > editMembershipValue.discountedPrice) {
      formIsValid = false;
      errors["perUnit"] = "* Enter valid input";
    }
    setError(errors);

    if (discounttype === "%") {
      setInclusiveDiscountPerUnit(e.target.value);
      setInclusiveDiscount(
        ((editMembershipValue.discountedPrice +
          editMembershipValue?.gst -
          e.target.value) *
          100) /
          (editMembershipValue.discountedPrice + editMembershipValue?.gst)
      );
      setDiscountPerUnit(
        parseFloat(e.target.value / (1 + 18 / 100)).toFixed(2),
        10
      );
      // setDiscount(parseInt(100-(e.target.value*100/editMembershipValue.discountedPrice).toFixed(2),10));
    } else {
      setInclusiveDiscountPerUnit(e.target.value);
      setInclusiveDiscount(
        editMembershipValue.discountedPrice +
          editMembershipValue?.gst -
          e.target.value
      );
      setDiscountPerUnit(
        parseFloat((e.target.value / (1 + 18 / 100)).toFixed(2), 10)
      );
      setDiscount(
        parseFloat(
          (
            parseFloat((e.target.value / (1 + 18 / 100)).toFixed(2), 10) -
            e.target.value
          ).toFixed(2),
          10
        )
      );
    }
  };

  const ChangeDiscountType = (e, data) => {
    if (data === "%") {
      setSubDiscoutMenu(!subDiscoutMenu);
      setDiscountType("%");
      setProductdisCountType("%");
      if (discount && discounttype === SettingInfo?.currentType) {
        setDiscount("");
        setDiscountPerUnit(
          parseInt(editMembershipValue.discountedPrice.toFixed(2), 10)
        );
      }
    } else {
      setSubDiscoutMenu(!subDiscoutMenu);
      setDiscountType(SettingInfo?.currentType);
      setProductdisCountType("Rs.");
      if (discount && discounttype === "%") {
        setDiscount("");
        setDiscountPerUnit(
          parseInt(editMembershipValue.discountedPrice.toFixed(2), 10)
        );
      }
    }
  };
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (productdisCountType === "%") {
      if (discount > 100) {
        formIsValid = false;
        errors["discount"] = "* Enter valid input";
      }
    }
    if (productdisCountType === "Rs.") {
      if (discount > editMembershipValue.discountedPrice) {
        formIsValid = false;
        errors["discount"] = "* Enter valid input";
      }
    }
    if (discountPerUnit > editMembershipValue.discountedPrice) {
      formIsValid = false;
      errors["discount"] = "* Enter valid input";
    }
    setError(errors);
    return formIsValid;
  };
  const saveDiscount = () => {
    if (validateForm()) {
      toggle(editedData);
    }
  };

  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9]*$.");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const SelectNewStaff = async (e, data) => {
    // getAllStaff();
    setChanges(true);
    setSelectedStaff(data?.firstName + " " + data?.lastName);
    setStaffId(data?._id);
    setSubMenuopen(!subMenuOpen);
  };

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Edit Membership</h4>
              <div className="close-button" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="edit-product-sub-modal">
            <div className="hair-wash-grid">
              <div className="hair-wash-grid-items">
                <div className="sub-grid">
                  <div className="edit-service-sub-grid-items">
                    <div className="line-color-dynamic"></div>
                  </div>

                  <div className="sub-grid-items">
                    <div className="silver-profile">
                      <div className="silver-profile-alignment">
                        <div className="profile-type service-provider-grid">
                          {editMembershipValue?.cardColur ===
                          "rgb(248, 226, 124)" ? (
                            <img src={YellowMembership} alt="ProfileImage" />
                          ) : editMembershipValue?.cardColur ===
                            "rgb(248, 163, 121)" ? (
                            <img src={OrangeMembership} alt="ProfileImage" />
                          ) : editMembershipValue?.cardColur ===
                            "rgb(109, 200, 199)" ? (
                            <img src={SkyBlueMembership} alt="ProfileImage" />
                          ) : editMembershipValue?.cardColur ===
                            "rgb(72, 148, 248)" ? (
                            <img src={BlueMembership} alt="ProfileImage" />
                          ) : (
                            ""
                          )}
                          <div className="service-provider-grid-items">
                            <p> {editMembershipValue.membershipName}</p>
                            <span>
                              {" "}
                              {selectedStaff !== "No staff assigned" &&
                                "by  " + " " + selectedStaff}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hair-wash-grid-items">
                <h5>
                  {" "}
                  <span>{SettingInfo?.currentType}</span>
                  {showDiscount
                    ? editMembershipValue.price
                    : editMembershipValue?.flatdiscountedPrice}
                </h5>
              </div>
            </div>
            {SettingInfo?.multipleStaff?.assignStaffForMembership ? (
              <div className="option-select-group edit-service-modal-bottom-align">
                <label>Staff</label>
                <div className="relative">
                  <div
                    className="input-relative"
                    onClick={() => setSubMenuopen(!subMenuOpen)}
                  >
                    <input disabled type="text" value={selectedStaff} />
                    <div className="drop-down-icon-center">
                      <img src={DropDownIcon} alt="DropDownIcon" />
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
                        {staffData?.map((staff) => {
                          return (
                            <li
                              key={staff._id}
                              onClick={(e) => SelectNewStaff(e, staff)}
                            >
                              {staff?.firstName + " " + staff?.lastName}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {showDiscount ? null : gstOn &&
              gstType === "Inclusive" &&
              editMembershipValue?.gst > 0 ? (
              <div className="disuount-input-grid">
                <div className="disuount-input-grid-items">
                  <div className="form-group">
                    <label>
                      Discount{" "}
                      {
                        <span
                          style={{ color: "red", top: "5px", fontSize: "10px" }}
                        >
                          {" "}
                          {errors["discount"]}{" "}
                        </span>
                      }
                    </label>
                    {editInvoice?.balanceAmountRecord ||
                    editInvoice?.dueAmountRecord ||
                    editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord ? (
                      <input
                        type="number"
                        name="fullname"
                        value={inclusivediscount}
                        onKeyPress={bindInput}
                        placeholder="e.g. 100"
                        disabled
                      />
                    ) : (
                      <input
                        type="number"
                        name="fullname"
                        value={inclusivediscount}
                        onKeyPress={bindInput}
                        placeholder="e.g. 100"
                        onChange={(e) => ChangeInclusiveDiscount(e)}
                      />
                    )}
                  </div>
                </div>
                <div className="disuount-input-grid-items">
                  <div className="relative">
                    <div
                      className="form-group relative"
                      onClick={() => setSubDiscoutMenu(!subDiscoutMenu)}
                    >
                      <input type="text" value={discounttype} />
                      <div className="icon-input-align">
                        <img src={DropDownIcon} alt="DropDownIcon" />
                      </div>
                    </div>
                    <div
                      className={
                        !subDiscoutMenu
                          ? "sub-menu-open sub-menu-hidden "
                          : "sub-menu-open sub-menu-show"
                      }
                    >
                      <div className="menu-design-box">
                        <div
                          className="list-style-design"
                          onClick={(e) => ChangeDiscountType(e, "%")}
                        >
                          <span>%</span>
                        </div>
                        <div
                          className="list-style-design rs-roboto-change"
                          onClick={(e) =>
                            ChangeDiscountType(e, SettingInfo?.currentType)
                          }
                        >
                          <span>{SettingInfo?.currentType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="disuount-input-grid">
                <div className="disuount-input-grid-items">
                  <div className="form-group">
                    <label>
                      Discount{" "}
                      {
                        <span
                          style={{ color: "red", top: "5px", fontSize: "10px" }}
                        >
                          {" "}
                          {errors["discount"]}{" "}
                        </span>
                      }
                    </label>
                    {editInvoice?.balanceAmountRecord ||
                    editInvoice?.dueAmountRecord ||
                    editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? (
                      <input
                        type="number"
                        name="fullname"
                        value={discount}
                        onKeyPress={bindInput}
                        placeholder="e.g. 100"
                        disabled
                      />
                    ) : (
                      <input
                        type="number"
                        name="fullname"
                        value={discount}
                        onKeyPress={bindInput}
                        placeholder="e.g. 100"
                        onChange={(e) => ChangeDiscount(e)}
                      />
                    )}
                  </div>
                </div>
                <div className="disuount-input-grid-items">
                  <div className="relative">
                    <div
                      className="form-group relative"
                      onClick={() => setSubDiscoutMenu(!subDiscoutMenu)}
                    >
                      <input type="text" value={discounttype} />
                      <div className="icon-input-align">
                        <img src={DropDownIcon} alt="DropDownIcon" />
                      </div>
                    </div>
                    <div
                      className={
                        !subDiscoutMenu
                          ? "sub-menu-open sub-menu-hidden "
                          : "sub-menu-open sub-menu-show"
                      }
                    >
                      <div className="menu-design-box">
                        <div
                          className="list-style-design"
                          onClick={(e) => ChangeDiscountType(e, "%")}
                        >
                          <span>%</span>
                        </div>
                        <div
                          className="list-style-design rs-roboto-change"
                          onClick={(e) =>
                            ChangeDiscountType(e, SettingInfo?.currentType)
                          }
                        >
                          <span>{SettingInfo?.currentType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showDiscount ? (
              <div>
                <div className="form-group">
                  <label>For Edit Membership Remove Flat Discount. </label>
                </div>
              </div>
            ) : gstOn &&
              gstType === "Inclusive" &&
              editMembershipValue?.gst > 0 ? (
              <div className="form-group">
                <label>Final price per unit (inclusive GST) </label>
                {editInvoice?.balanceAmountRecord ||
                editInvoice?.dueAmountRecord ||
                editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord? (
                  <input
                    type="text"
                    name="fullname"
                    value={inclusivediscountPerUnit}
                    onKeyPress={bindInput}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    name="fullname"
                    value={inclusivediscountPerUnit}
                    onKeyPress={bindInput}
                    onChange={(e) => HandleInclusiveDiscountPerUnit(e)}
                  />
                )}
              </div>
            ) : (
              <div className="form-group">
                <label>Final price per unit </label>
                {editInvoice?.balanceAmountRecord ||
                editInvoice?.dueAmountRecord ||
                editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? (
                  <input
                    type="text"
                    name="fullname"
                    value={discountPerUnit}
                    onKeyPress={bindInput}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    name="fullname"
                    value={discountPerUnit}
                    onKeyPress={bindInput}
                    onChange={(e) => HandleDiscountPerUnit(e)}
                  />
                )}
              </div>
            )}
          </div>
          <div className="remove-edit-button-align">
            {showDiscount ? null : (
              <div className="remove-button">
                {editInvoice?.balanceAmountRecord ||
                editInvoice?.dueAmountRecord ||
                editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord? null : (
                  <button
                    onClick={(e) => RemoveMembership(editMembershipValue)}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
            <div className="save-change">
              <button onClick={() => toggle()}>Cancel</button>
              {changes ? (
                <button onClick={() => saveDiscount()}>Save changes</button>
              ) : (
                <button disabled>Save changes</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
