import React, { useState, useRef, useEffect, useContext } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import DatePicker from "react-datepicker";
import moment from "moment";
import Delete from "../Toaster/Delete";
import UserContext from "../../../helpers/Context";

export default function  AddNewCustomerModal(props) {
  const { isMembership } = useContext(UserContext);
  const { editCustomer , SettingInfo} = props;
  const genderRef = useRef();
  const membershipTypeRef = useRef();
  const userInfo = Auth.getUserDetail();

  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [isAppointment, setIsAppointment] = useState(true);
  const [isInvoice, setIsInvoice] = useState(true);
  const [monthDate, setMonthDate] = useState("");
  const [year, setYear] = useState("");
  const [errors, setError] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    gender: "",
    birthday: "",
    notes: "",
    selectMembership: [],
    assignedMembership: [],
  });
  const [membershipData, setMembershipData] = useState(false);
  const [membershipSubmenuOpen, setMembershipSubmenuOpen] = useState(false);
  const [membershipDetails, setMembershipDetails] = useState({});
  const [tempMembership, setTempMembership] = useState(
    editCustomer ? editCustomer?.selectMembership?.slice(-1)[0] : {}
  );
  const [object, setObject] = useState({});
  const [assignedMembership, setAssignedMembership] = useState([]);
  const [membershipDays, setMembershipDays] = useState();
  const [servicesLeft, setServicesLeft] = useState();

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = () => {
    setDeleteModal(!deleteModal);
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

  const checkValue = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9 ]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const checkEmailValue = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9@_. ]*$");
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
    if (customerData?.firstName) {
      if (customerData?.firstName?.trim() === "") {
        formIsValid = false;
        errors["firstName"] = "Add customer's first name";
      }
    }
    setError(errors);
    return formIsValid;
  };

  const validateMobile = () => {
    let errors = {};
    let formIsValid = true;
    if (customerData?.mobileNumber.length < 10) {
      formIsValid = false;
      errors["mobileNumber"] = "Enter valid input";
    }
    setError(errors);
    return formIsValid;
  };

  const memberShipData = async () => {
    let res = await ApiGet("membership/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setMembershipData(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const getMembershipById = async (id) => {
    let res = await ApiGet("membership/" + id);
    try {
      if (res.data.status === 200) {
        let data = res.data.data[0];
        setMembershipDetails(data);
        setServicesLeft(
          customerData?.selectMembership.slice(-1)[0].remainingService ||
            data.remainingService ||
            data.availService
        );
        setTempMembership(isMember ? data : {});
        setMembershipDays(
          customerData?.selectMembership.slice(-1)[0].remainingDays ||
            data.remainingDays ||
            data.days
        );
      } else {
        console.log("error");
      }
    } catch {
      console.log("something went wrong");
    }
  };

  const handleOnChange = (e) => {
    validateForm();
    setDisabled(true);
    let { name, value } = e.target;
    setCustomerData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleOnToggle = (e) => {
    // setDisabled(true);
    setIsMember(!isMember);
    // isMember && setTempMembership({});
  };

  const handleOnClick = (data, key) => {
    validateForm();
    setDisabled(true);
    if (key === "isAppointment") {
      setIsAppointment(!isAppointment);
      setCustomerData((prevState) => {
        return {
          ...prevState,
          isAppointment: !isAppointment,
        };
      });
    } else if (key === "isInvoice") {
      setIsInvoice(!isInvoice);
      setCustomerData((prevState) => {
        return {
          ...prevState,
          isInvoice: !isInvoice,
        };
      });
    } else if (key === "gender") {
      setCustomerData((prevState) => {
        return {
          ...prevState,
          gender: data,
        };
      });
    } else if (key === "selectMembership") {
      const ExpiresOn = new Date();
      ExpiresOn.setDate(ExpiresOn.getDate() + data.days);
      getMembershipById(data._id);
      setMembershipDetails(data);
      setServicesLeft(data.remainingService || data.availService);
      setTempMembership(isMember ? data : {});
      setMembershipDays(data.remainingDays || data.days);
      setObject(data);
      setMembershipSubmenuOpen(false);
      // setTempMembership(tempMembership)
      setTempMembership((prevState) => {
        return {
          ...prevState,
          flatdiscountedPrice:0,
          expiresOn: ExpiresOn,
          purchaseDate: new Date(),
        };
      });
    }
  };


  const handleValidityChange = (e) => {
    const ExpiresOn = new Date();
    ExpiresOn.setDate(ExpiresOn.getDate() + parseInt(e.target.value));

    validateForm();
    setDisabled(true);
    setMembershipDays(e.target.value);
    setTempMembership((prevState) => {
      return {
        ...prevState,
        remainingDays: parseInt(e.target.value),
        expiresOn: ExpiresOn,
        purchaseDate: new Date(),
      };
    });
    setObject((prevState) => {
      return { ...prevState, remainingDays: parseInt(e.target.value) };
    });
  };
  const handleServicesChange = (e) => {
    validateForm();
    setDisabled(true);
    setServicesLeft(e.target.value);
    setTempMembership((prevState) => {
      return { ...prevState, remainingService: parseInt(e.target.value) };
    });
    setObject((prevState) => {
      return { ...prevState, remainingService: parseInt(e.target.value) };
    });
  };
  const handleSubmit = async () => {
    if (validateMobile()) {
      const values = isMember
        ? Object.assign(customerData, {
            selectMembership: assignedMembership.concat(tempMembership),
            membership: isMember,
            companyId: userInfo.companyId,
            isActive: true,
          })
        : editCustomer
        ? Object.assign(customerData, {
            selectMembership: assignedMembership.concat({}),
            membership: isMember,
            companyId: userInfo.companyId,
            isActive: true,
          })
        : Object.assign(customerData, {
            membership: isMember,
            companyId: userInfo.companyId,
            isActive: true,
          });

            // isCustomerWithoutMembership field is for adding 'without invoice memberships
            // (i.e. assigning membership directly from edit/add customer page)' to ...
            //    ... membershipview > memberslist page
            
      let res;
      editCustomer
        ? (res = await ApiPut("customer/" + editCustomer._id, values))
        : (res = await ApiPost("customer/", values));
      try {
        props.toggle(res.data.status, res.data.data);
        const InvoiceData = await {
          serviceDetails: [],
          products: [],
          subTotal: "0",
          GST: {
            percentage: "18",
            gstAmount: 0,
          },
          discount: {
            discount: 0,
            discountType: SettingInfo?.currentType,
          },
          discountMembership : 0,
          totalAmount: "0",
          paymentMethod: "Cash",
          isActive: false,
          type: "product",
          splitPayment: [],
          isSplit: false,
          discountedPrice : 0,
          totalDiscount : 0,
          grossTotal : 0,
          isMembership: isMember,
          membershipServiceRedeemed : "0",
          membershipDetails: assignedMembership.concat(tempMembership),
          customer: res.data.data,
          customerData: res.data.data,
          isCustomerWithoutMembership: false,
          membershipId: tempMembership?._id,
          companyId: userInfo.companyId,
          collectedAmountRecord: 0,
        };

        let temInvoiceData = editCustomer && {
          ...InvoiceData,
          customer: res.data.data[0],
          customerData: res.data.data[0]
        }

        if (isMember) {
          editCustomer 
            ? (!editCustomer?.membership && ApiPost("invoice", temInvoiceData)).then(resp=>resp.JSON()).catch(err=>console.log(err))
            : (
            ApiPost("invoice", InvoiceData).then(resp=>resp.JSON()).catch(err=>console.log(err))
              );
          } 
        }
        catch (er) {
          props.toggle(er);
        }
    }
  };

  const handleMonthDate = async (data) => {
    validateForm();
    setDisabled(true);
    setMonthDate(data);
    const fullDate = `${moment(data).format("DD-MM")}-${moment(year).format(
      "y"
    )}`;
    setCustomerData((prevState) => {
      return {
        ...prevState,
        birthday: fullDate,
      };
    });
  };

  const handleYear = async (data) => {
    validateForm();
    setDisabled(true);
    setYear(data);
    const fullDate = `${moment(monthDate).format("DD-MM")}-${moment(
      data
    ).format("y")}`;
    setCustomerData((prevState) => {
      return {
        ...prevState,
        birthday: fullDate,
      };
    });
  };

  const fetchData = async (id) => {
    let customerValue = await ApiGet("customer/" + id);
    customerValue = customerValue.data.data;
    let appointmentIsChecked = customerValue[0].isAppointment;
    let invoiceIsChecked = customerValue[0].isInvoice;
    let membershipChekced = customerValue[0].membership;
    let membershipId = customerValue[0].selectMembership?.slice(-1)[0]?._id;
    setCustomerData(customerValue[0]);
    setIsAppointment(appointmentIsChecked);
    setIsInvoice(invoiceIsChecked);
    setIsMember(membershipChekced);
    setAssignedMembership(customerValue[0].selectMembership);
    if (membershipId) {
      getMembershipById(membershipId);
    }
    setServicesLeft(
      customerValue[0]?.selectMembership?.slice(-1)[0]?.remainingService ||
        membershipDetails?.remainingService
    );
    setMembershipDays(
      customerValue[0]?.selectMembership?.slice(-1)[0]?.remainingDays ||
        membershipDetails?.remainingDays
    );
  };

  const setObj = () => {
    let MonthDate = moment(editCustomer?.birthday, "DD-MM-YYYY");
    if (editCustomer?.birthday === "") {
      setMonthDate("");
    } else if (editCustomer?.birthday === "Invalid date-Invalid date") {
      setMonthDate("");
    } else if (editCustomer?.birthday === undefined) {
      setMonthDate("");
    } else {
      setMonthDate(MonthDate._d);
    }
    let Year = moment(editCustomer?.birthday, "DD-MM-YYYY");
    if (editCustomer?.birthday === "") {
      setYear("");
    } else if (editCustomer?.birthday === "Invalid date-Invalid date") {
      setYear("");
    } else if (editCustomer?.birthday === undefined) {
      setYear("");
    } else {
      setYear(Year._d);
    }
  };

  useEffect(() => {
    if (editCustomer) {
      setObj();
      // setCustomerData(editCustomer);
    }
  }, [editCustomer]);

  useEffect(() => {
    if (editCustomer) {
      fetchData(editCustomer?._id);
    } else {
      setCustomerData({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        gender: "",
        birthday: "",
        notes: "",
        selectMembership: [],
        assignedMembership: [],
      });
    }
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (subMenuOpen) {
        if (
          subMenuOpen &&
          genderRef.current &&
          !genderRef.current.contains(e.target)
        ) {
          setSubMenuopen(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [subMenuOpen]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (membershipSubmenuOpen) {
        if (
          membershipSubmenuOpen &&
          membershipTypeRef.current &&
          !membershipTypeRef.current.contains(e.target)
        ) {
          setMembershipSubmenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [membershipSubmenuOpen]);

  useEffect(() => {
    memberShipData();
  }, []);

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {deleteModal && (
              <Delete
                modal={deleteModal}
                toggle={deleteModaltoggle}
                disabledCustomer={disabled}
                disabledCustomerModal={props.toggle}
              />
            )}
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                {disabled ? (
                  <div
                    onClick={() => opendeleteModal()}
                    className="modal-close"
                  >
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                ) : (
                  <div onClick={() => props.toggle()} className="modal-close">
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                )}
                <div className="modal-title">
                  <h2>{editCustomer ? "Edit customer" : "Add New Customer"}</h2>
                </div>
              </div>
              <div className="modal-button">
                {(customerData.firstName &&
                  customerData.mobileNumber &&
                  !isMember) ||
                (customerData.firstName &&
                  customerData.mobileNumber &&
                  customerData.selectMembership &&
                  tempMembership?.validFor === "Unlimited" &&
                  tempMembership?.days >= tempMembership?.remainingDays &&
                  isMember &&
                  disabled) ||
                (customerData.firstName &&
                  customerData.mobileNumber &&
                  customerData.selectMembership
                   &&
                  tempMembership?.validFor === "Limited" &&
                  tempMembership?.availService >=
                    tempMembership?.remainingService &&
                  tempMembership?.days >= tempMembership?.remainingDays &&
                  isMember &&
                  disabled) ? (
                  <button onClick={() => handleSubmit()}>
                    {editCustomer ? "Save Changes" : "Add Customer"}
                  </button>
                ) : (
                  <button disabled>
                    {editCustomer ? "Save Changes" : "Add Customer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Personal data</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-group customer-form-group-align">
                      <label>
                        Full name
                        <span style={{ color: "red" }}>
                          {" "}
                          *{" "}
                          {customerData.firstName.trim() == "" && (
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "10px",
                              }}
                            >
                              {" "}
                              {errors["firstName"]}{" "}
                            </span>
                          )}{" "}
                        </span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={customerData.firstName.replace(
                          /^(.)|\s+(.)/g,
                          (c) => c.toUpperCase()
                        )}
                        placeholder="Enter customer's full name"
                        onChange={(e) => handleOnChange(e)}
                        onKeyPress={checkValue}
                      />
                    </div>
                    {/* <div className="form-group customer-form-group-align">
                      <label>Last name </label>
                      <input
                        type="text"
                        name="lastName"
                        value={customerData.lastName.replace(
                          /^(.)|\s+(.)/g,
                          (c) => c.toUpperCase()
                        )}
                        placeholder="Enter customer's last name"
                        onChange={(e) => handleOnChange(e)}
                        onKeyPress={checkValue}
                      />
                    </div> */}
                    <div className="form-group customer-form-group-align">
                      <label>
                        Mobile number
                        <span style={{ color: "red" }}> * </span>
                        {customerData.mobileNumber.length < 10 && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {errors["mobileNumber"]}
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        value={customerData.mobileNumber}
                        placeholder="+ 91"
                        onChange={(e) => handleOnChange(e)}
                        onKeyPress={bindInput}
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group customer-form-group-align">
                      <label>Email</label>
                      <input
                        type="text"
                        name="email"
                        value={customerData.email}
                        placeholder="Enter email address"
                        onChange={(e) => handleOnChange(e)}
                        onKeyPress={checkEmailValue}
                      />
                    </div>
                    <div className="option-select-group customer-form-group-align">
                      <label>Gender</label>
                      <div className="relative">
                        <div
                          className="input-relative"
                          onClick={() => setSubMenuopen(!subMenuOpen)}
                          ref={genderRef}
                        >
                          <input
                            type="text"
                            name="gender"
                            style={{ fontWeight: "500" }}
                            value={customerData.gender}
                            placeholder="Select gender"
                            readOnly
                          />
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
                            <ul
                              onClick={(e) =>
                                handleOnClick(e.target.innerHTML, "gender")
                              }
                            >
                              <li value="Male">Male</li>
                              <li value="Female">Female</li>
                              <li value="Other">Other</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="customer-form-grid customer-form-group-align">
                      <div className="customer-form-grid-items">
                        <div className="form-group">
                          <label>Birthdate</label>
                          <DatePicker
                            selected={monthDate}
                            onChange={handleMonthDate}
                            dateFormat="dd-MMM"
                            placeholderText="Date - Month"
                            fixedHeight
                          />
                        </div>
                      </div>
                      <div className="customer-form-grid-items">
                        <div className="form-group">
                          <label>Year</label>
                          <DatePicker
                            selected={year}
                            onChange={handleYear}
                            showYearPicker
                            dateFormat="yyyy"
                            placeholderText="Year"
                            fixedHeight
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        value={customerData.notes}
                        rows="3"
                        cols="50"
                        onChange={(e) => handleOnChange(e)}
                      />
                    </div>
                    <div className="customer-checkbox-alignment">
                      <div className="checkbox-alignment-cus-list">
                        <input
                          type="checkbox"
                          name="isAppointment"
                          checked={isAppointment}
                          onClick={(e) => handleOnClick(e, "isAppointment")}
                        />
                        <span>Send appointment confirmation</span>
                      </div>
                      <div className="checkbox-alignment-cus-list">
                        <input
                          type="checkbox"
                          name="isInvoice"
                          checked={isInvoice}
                          onChange={(e) => handleOnClick(e, "isInvoice")}
                        />
                        <span>Send invoices</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isMembership && (
                <div className="box-center">
                  <div className="product-info-box">
                    <div className="membership-title">
                      <h5>Membership</h5>
                    </div>
                    <div className="membership-body">
                      <span>Status</span>
                      <div className="membership-box">
                        {isMember ? (
                          <span style={{ color: "#338333" }}>Active</span>
                        ) : (
                          <span style={{ color: "#fa1818" }}>Inactive</span>
                        )}
                        <label
                          class="switch"
                          onChange={(e) =>
                            !editCustomer?.membership && 
                            handleOnToggle(e)
                          }
                        >
                          <input
                            type="checkbox"
                            checked={isMember}
                            disabled={editCustomer?.membership}
                          />
                          <span
                            class={
                              !editCustomer?.membership &&
                               "slider round"}
                          ></span>
                        </label>
                      </div>
                      {isMember && ( editCustomer ? editCustomer?.membership === false : true) ? (
                        <>
                          <div className="option-select-group  membership-form-control-alignments">
                            <label>Select membership</label>
                            <div className="relative" ref={membershipTypeRef}>
                              <div
                                className="input-relative"
                                onClick={() =>
                                  !editCustomer?.membership &&
                                  setMembershipSubmenuOpen(
                                    !membershipSubmenuOpen
                                  )
                                }
                              >
                                <input
                                  type="dropdown"
                                  name="selectMembership"
                                  style={{ fontWeight: "500" }}
                                  value={membershipDetails?.membershipName}
                                  placeholder="Select Membership"
                                  readOnly
                                  disabled={editCustomer?.membership}
                                />
                                <div className="drop-down-icon-center">
                                  <img src={DropDownIcon} alt="DropDownIcon" />
                                </div>
                              </div>
                              <div
                                className={
                                  membershipSubmenuOpen
                                    ? "sub-menu-open sub-menu"
                                    : "sub-menu sub-menu-close"
                                }
                              >
                                <div className="sub-menu-design">
                                  <ul>
                                    {membershipData &&
                                      membershipData?.map((item) => {
                                        return (
                                          item.activeMembership && (
                                            <li
                                              key={item._id}
                                              onClick={(e) =>
                                                handleOnClick(
                                                  item,
                                                  "selectMembership"
                                                )
                                              }
                                            >
                                              {item?.membershipName}
                                            </li>
                                          )
                                        );
                                      })}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          {membershipDetails?.validFor === "Limited" && (
                            <div className="option-select-group  membership-form-control-alignments">
                              <label style={{ display: "flex" }}>
                                No. of services left
                                <span style={{ color: "red" }}> * </span>
                                {tempMembership?.availService <
                                  tempMembership?.remainingService && (
                                  <span
                                    style={{
                                      color: "red",
                                      top: "5px",
                                      fontSize: "10px",
                                    }}
                                  >
                                    invalid Input
                                  </span>
                                )}
                              </label>
                              <div className="relative">
                                <div className="input-relative">
                                  <input
                                    type="text"
                                    name="days"
                                    style={{ fontWeight: "500" }}
                                    placeholder="Type here"
                                    value={servicesLeft}
                                    onChange={(e) => handleServicesChange(e)}
                                    onKeyPress={bindInput}
                                    disabled={editCustomer?.membership}
                                  />
                                  <div className="drop-down-icon-center">
                                    out of {membershipDetails.availService}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="option-select-group  membership-form-control-alignments">
                            <label style={{ display: "flex" }}>
                              Validity <span style={{ color: "red" }}> * </span>
                              {tempMembership?.days <
                                tempMembership?.remainingDays && (
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  invalid Input
                                </span>
                              )}
                            </label>
                            <div className="relative">
                              <div className="input-relative">
                                <input
                                  type="text"
                                  name="days"
                                  style={{ fontWeight: "500" }}
                                  value={membershipDays}
                                  onChange={(e) => handleValidityChange(e)}
                                  onKeyPress={bindInput}
                                  disabled={editCustomer?.membership}
                                />
                                <div className="drop-down-icon-center">
                                  days
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
