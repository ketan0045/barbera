import React, { useEffect, useState } from "react";
import EditIcon from "../../../assets/svg/edit-icon.svg";
import DragMenuIcon from "../../../assets/svg/drag-menu.svg";
import EditPrimary from "../../../assets/svg/edit-primary.svg";
import DeleteIcon from "../../../assets/svg/Delete-icon.svg";
import AddMoreModal from "./AddMoreModal";
import Delete from "../../Common/Toaster/Delete";
import Success from "../../Common/Toaster/Success/Success";
import FrequentServiceModal from "../../Common/Modal/FrequentServices/FrequentServiceModal";
import FrequentServicesTab from "../../Common/Modal/FrequentServices/FrequentServicesTab";

export default function InvoiceSetting(props) {
  const {
    handleOnClick,
    handleOnToggle,
    saveChanges,
    editOptions,
    paymentMethod,
    customerForInvoices,
    getPaymentMethod,
    setPaymentMethod,
    permission,
    assignMultipleStaff,
    assignStaffForMembership,
    assignStaffForProduct,
    membershipToggle,
    enableIn,
    allServices,
    getAllServices,
    frequentServices,
    setFrequentServices,
    enableFrequentServices,
    setEnableFrequentServices
  } = props;
  const [key, setKey] = useState("paymentMethods");
  const [editPaymentMethod, setEditPaymentMethod] = useState();
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const [dragId, setDragId] = useState();
  const [OpenFrequentServiceModal, setOpenFrequentServiceModal] =
    useState(false);

  const [addMoreModal, setAddMoreModal] = useState(false);
  const [fsChange, setFsChange] = useState(false);
  const openAddMoreToggle = (data) => {
    setAddMoreModal(!addMoreModal);
    setEditPaymentMethod();
    if (data) {
      if (data === 200) {
        setSuccess(true);
        setToastmsg(
          editPaymentMethod ? "Changes saved!" : "New payment method added!"
        );
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  const [deleteModal, setDeleteModal] = useState();
  const deleteModalToggle = (data) => {
    setDeleteModal(!deleteModal);
    if (data) {
      if (data === 200) {
        setAddMoreModal(false);
        setSuccess(true);
        setToastmsg("Payment method deleted!");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    const dragBox = paymentMethod.find((pm) => pm._id === dragId);
    const dropBox = paymentMethod.find((pm) => pm._id === ev.currentTarget.id);

    const dragBoxName = dragBox?.paymentType;
    const dropBoxName = dropBox?.paymentType;

    const newBoxState = paymentMethod.map((pm) => {
      if (pm._id === dragId) {
        pm.paymentType = dropBoxName;
      }
      if (pm._id === ev.currentTarget.id) {
        pm.paymentType = dragBoxName;
      }
      return pm;
    });

    setPaymentMethod(newBoxState);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  const OpenFrequentModal = () => {
    setOpenFrequentServiceModal(!OpenFrequentServiceModal);
  };

  return (
    <div>
      <div className="setting-sub-grid">
        <div className="setting-sub-grid-items">
          <div className="cus-tab-design">
            <ul>
              <li
                className={
                  key === "paymentMethods" && "active-tab-cus-background"
                }
                onClick={(e) => setKey("paymentMethods")}
              >
                Payment Methods
              </li>
              <li
                className={
                  key === "frequentServices" && "active-tab-cus-background"
                }
                onClick={(e) => setKey("frequentServices")}
              >
                Frequent services
              </li>
              <li
                className={key === "customerI" && "active-tab-cus-background"}
                onClick={(e) => setKey("customerI")}
              >
                Customer
              </li>
              <li
                className={key === "staff" && "active-tab-cus-background"}
                onClick={(e) => setKey("staff")}
              >
                Staff
              </li>
            </ul>
          </div>
        </div>
        {key === "paymentMethods" && (
          <div className="setting-sub-grid-items">
            <div className="payment-methods-alignment">
              <p>Payment methods</p>
              {editOptions && (
                <h6 onClick={(e) => handleOnClick(e, "save")}>Save changes</h6>
              )}
              {
                saveChanges && (
                  // permission?.filter((obj)=>obj.name === "Settings functions edit")?.[0]?.isChecked === false ? null : (
                  <h6 onClick={(e) => handleOnClick(e, "edit")}>
                    <img src={EditIcon} alt="EditIcon" />
                    Edit
                  </h6>
                )
                // )
              }
            </div>
            {paymentMethod?.map((rep, i) => {
              return saveChanges ? (
                <div key={i} className="checkbox-grid-setting">
                  <div className="payment-methods-first-grid">
                    <div className="payment-methods-first-grid-items">
                      <div className="checkbox-text-alignment-setting">
                        <span>{rep.paymentType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="checkbox-grid-setting"
                  id={rep._id}
                  draggable={true}
                  onDragOver={(ev) => ev.preventDefault()}
                  onDragStart={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="payment-methods-first-grid">
                    <div className="payment-methods-first-grid-items">
                      <div className="checkbox-text-alignment-setting">
                        <div>
                          <img src={DragMenuIcon} alt="DragMenuIcon" />
                        </div>
                        <span>{rep.paymentType}</span>
                      </div>
                    </div>
                    {rep.paymentType === "Cash" ? null : (
                      <div className="payment-methods-first-grid-items">
                        <div className="payment-methods-edit-delete-icon-alignment">
                          <div>
                            <img
                              src={EditPrimary}
                              alt="EditPrimary"
                              onClick={() => {
                                openAddMoreToggle();
                                setEditPaymentMethod(rep);
                              }}
                            />
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <img
                              src={DeleteIcon}
                              alt="DeleteIcon"
                              onClick={() => {
                                deleteModalToggle();
                                setEditPaymentMethod(rep);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {!saveChanges && (
              <div
                className="payment-add-button-design"
                onClick={() => openAddMoreToggle()}
              >
                <span>+ Add more</span>
              </div>
            )}
          </div>
        )}
        {key === "customerI" && (
          <div className="setting-sub-grid-items">
            <div className="enable-inventroy-text-alignment">
              <p>Adding customer compulsion</p>
              <label
                class="switch"
                onChange={(e) => {
                  handleOnToggle(e, "icustomer");
                }}
              >
                <input
                  type="checkbox"
                  checked={customerForInvoices}
                  // disabled={permission?.filter(
                  //           (obj) => obj.name === "Settings functions edit"
                  //         )[0]?.isChecked === false ? true : false}
                />
                <span class="slider round"></span>
              </label>
            </div>
            <div className="you-will-reqire-text">
              <p>
                By turning this switch on, you will be required to add customer
                for every checkout
              </p>
            </div>
          </div>
        )}
        {key === "frequentServices" && (
          <FrequentServicesTab 
          handleOnToggle={handleOnToggle}
          setOpenFrequentServiceModal={setOpenFrequentServiceModal} 
          OpenFrequentServiceModal={OpenFrequentServiceModal} 
          OpenFrequentModal={OpenFrequentModal} 
          allServices={allServices}
          frequentServices={frequentServices}
          setFrequentServices={setFrequentServices}
          enableFrequentServices={enableFrequentServices}
          setEnableFrequentServices={setEnableFrequentServices}
          />
        )}
        {key === "staff" && (
          <div className="setting-sub-grid-items">
            <div className="enable-inventroy-text-alignment ">
              <p>Assign multiple staff for one service</p>
              <label
                class="switch"
                onChange={(e) => handleOnToggle(e, "assignmultiplestaff")}
              >
                <input type="checkbox" checked={assignMultipleStaff} />
                <span class="slider round"></span>
              </label>
            </div>
            {assignMultipleStaff ? (
              ""
            ) : (
              <div className="you-will-reqire-text">
                <p>
                  Comissions won’t apply to staff if staff to service assign is
                  off
                </p>
              </div>
            )}
            {membershipToggle ?
            <div className="enable-inventroy-text-alignment">
              <p>Assign staff for memberships</p>
              <label
                class="switch"
                onChange={(e) => handleOnToggle(e, "assignStaffForMembership")}
              >
                <input type="checkbox" checked={assignStaffForMembership} />
                <span class="slider round"></span>
              </label>
            </div>:""}
            {assignStaffForMembership ? (
              ""
            ) : (
              membershipToggle ?
              <div className="you-will-reqire-text">
                <p>
                  Comissions won’t apply to staff if staff to memberships assign
                  is off
                </p>
              </div> :""
            )}
            {enableIn ? 
            <div className="enable-inventroy-text-alignment">
              <p>Assign staff for products</p>
              <label
                class="switch"
                onChange={(e) => handleOnToggle(e, "assignStaffForProduct")}
              >
                <input type="checkbox" checked={assignStaffForProduct} />
                <span class="slider round"></span>
              </label>
            </div> : ""}
            {assignStaffForProduct ? (
              ""
            ) : (
              enableIn ?
              <div className="you-will-reqire-text">
                <p>
                  Comissions won’t apply to staff if staff to product assign is
                  off
                </p>
              </div> : ""
            )}
          </div>
        )}
      </div>
      {addMoreModal && (
        <AddMoreModal
          modal={addMoreModal}
          toggle={openAddMoreToggle}
          getPaymentMethod={getPaymentMethod}
          editPaymentMethod={editPaymentMethod}
          deleteModalToggle={deleteModalToggle}
        />
      )}
      {deleteModal && (
        <Delete
          modal={deleteModal}
          toggle={deleteModalToggle}
          getPaymentMethod={getPaymentMethod}
          deletePaymentMethodId={editPaymentMethod?._id}
        />
      )}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {OpenFrequentServiceModal && (
        <FrequentServiceModal 
          toggle={OpenFrequentModal} 
          allServices={allServices} 
          getAllServices={getAllServices}
          frequentServices={frequentServices}
          setFrequentServices={setFrequentServices}
          setSuccess={setSuccess}
          setEr={setEr}
          setToastmsg={setToastmsg}
          fsChange={fsChange}
          setFsChange={setFsChange}
        />
      )}
    </div>
  );
}
