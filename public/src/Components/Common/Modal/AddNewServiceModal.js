import React, { useEffect, useState, useRef } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import DeleteIcon from "../../../assets/svg/Delete-icon.png";
import Delete from "../Toaster/Delete";
import Success from "../Toaster/Success/Success";
import ProductConsumptionModal from "./ProductConsumptionModal";

export default function AddNewServiceModal(props) {
  const { editService, getAllServices, addSerInCat, toggle, permission, SettingInfo } = props;
  const userInfo = Auth.getUserDetail();
  const categoryRef = useRef();
  const taxTypeRef = useRef();
  const taxRef = useRef();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [hairTreatment, setHairTreatment] = useState(false);
  const [exclusive, setExclusive] = useState(false);
  const [taxType, setTaxType] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [taxTypes, setTaxTypes] = useState();
  const [taxPercentage, setTaxPercentage] = useState();
  const [disabled, setDisabled] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState();
  const [errors, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [er, setEr] = useState();
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [productConumptionModal, setProductConumptionModal] = useState(false);
  const [editProductConsumptions, setEditProductConsumptions] = useState(false);
  const [prevSelectedProducts, setPrevSelectedProducts] = useState([]);
  const [serviceData, setServiceData] = useState({
    categoryId: "",
    serviceName: "",
    duration: "",
    amount: "",
    tax: {},
    companyId: userInfo.companyId,
    productConsumptions: [],
  });

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);
    if (deleteModal === true) {
      if (data) {
        if (data === 200) {
          getAllServices();
          setSuccess(true);
          setToastmsg("Record deleted!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const taxList = ["CGST 9%", "SGST 9%", "CGST 18%", "SGST 18%"];

  const getAllCategories = async (e) => {
    try {
      let res = await ApiGet("category/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setCategories(
          res.data.data.filter((rep) => (rep.categoryName === "Unassign" ? null : rep))
        );
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (serviceData?.serviceName) {
      if (serviceData?.serviceName?.trim() === "") {
        formIsValid = false;
        errors["serviceName"] = "Add service name";
      }
    }
    if (!serviceData.duration <= 600) {
      formIsValid = false;
      errors["duration"] = "Services can not have duration higher than 10 hours";
    }
    if (!serviceData.amount <= 100000) {
      formIsValid = false;
      errors["amount"] = "Service amount can not exceed Rs. 100000";
    }
    setError(errors);
    return formIsValid;
  };

  const handleOnChange = (e) => {
    validateForm();
    setDisabled(true);
    let { name, value } = e.target;
    setServiceData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleOnClick = (e, key) => {
    setDisabled(true);
    if (key === "taxType") {
      setTaxTypes(e.target.innerHTML);
    } else if (key === "tax") {
      setTaxPercentage(e.target.innerHTML);
    } else {
      setSelectedCategoryName(e.target.innerText);
      setServiceData((prevState) => {
        return {
          ...prevState,
          categoryId: key._id,
          colour: key.categoryColor,
        };
      });
      setHairTreatment(false);
      let filter = categories?.filter((rep) => rep._id === key._id);
      setFilteredStaff(filter[0].staff);
    }
  };

  const productConsumptionModalToggle = (e, key) => {
    if (key === "edit") {
      setEditProductConsumptions(true);
      setPrevSelectedProducts(serviceData.productConsumptions);
      setProductConumptionModal(!productConumptionModal);
    } else {
      setProductConumptionModal(!productConumptionModal);
    }
    setDisabled(true);
  };

  const handleOnSubmit = async (e) => {
    const body = Object.assign(serviceData, {
      isActive: true,
    });
    let res;
    editService
      ? (res = await ApiPut("service/" + editService._id, body))
      : (res = await ApiPost("service/", body));
    try {
      props.toggle(res.data.status);
      getAllServices();
    } catch (er) {
      props.toggle(er);
    }
  };

  const fetchData = async (id) => {
    let productValue = await ApiGet("service/" + id);
    productValue = productValue.data.data;
    setServiceData(productValue[0]);
    let res = await ApiGet("category/company/" + userInfo.companyId);
    let categoryName = res.data.data.filter((res) => res._id === productValue[0].categoryId);
    setSelectedCategoryName(categoryName[0].categoryName);
    setFilteredStaff(categoryName[0].staff);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (hairTreatment) {
        if (hairTreatment && categoryRef.current && !categoryRef.current.contains(e.target)) {
          setHairTreatment(false);
        }
      } else if (exclusive) {
        if (exclusive && taxTypeRef.current && !taxTypeRef.current.contains(e.target)) {
          setExclusive(false);
        }
      } else if (taxType) {
        if (taxType && taxRef.current && !taxRef.current.contains(e.target)) {
          setTaxType(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [hairTreatment, exclusive, taxType]);

  useEffect(() => {
    if (editService) {
      fetchData(editService._id);
    } else if (addSerInCat) {
      setSelectedCategoryName(addSerInCat.categoryName);
      setFilteredStaff(addSerInCat.staff);
      setServiceData((prevState) => {
        return {
          ...prevState,
          categoryId: addSerInCat._id,
          colour: addSerInCat.categoryColor,
        };
      });
    } else {
      setServiceData({
        categoryId: "",
        serviceName: "",
        duration: "",
        amount: "",
        tax: {},
        companyId: userInfo.companyId,
        productConsumptions: [],
      });
    }
  }, []);

  useEffect(async () => {
    getAllCategories();
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
                deleteServiceId={deleteServiceId}
                toggler={toggle}
              />
            )}
            {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => props.toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>{editService ? "Edit service" : "Add New Service"}</h2>
                </div>
              </div>
              {(permission?.filter((obj) => obj.name === "Edit/delete category/service")[0]
                ?.isChecked === false &&
                permission?.filter((obj) => obj.name === "Add new category/service")[0]
                  ?.isChecked === false ) ? null
                : (permission?.filter((obj) => obj.name === "Edit/delete category/service")[0]
                ?.isChecked === false &&
                permission?.filter((obj) => obj.name === "Add new category/service")[0]
                  ?.isChecked === true ) ? (
                  <div className="product-edit-delete-button-align">
                    <div className="modal-button">
                      {editService ? null : serviceData.serviceName &&
                        serviceData.duration &&
                        serviceData.amount &&
                        selectedCategoryName &&
                        disabled ? (
                        <button onClick={(e) => handleOnSubmit(e)}>
                          {editService ? "Save changes" : "Add Service"}
                        </button>
                      ) : (
                        <button disabled>{editService ? "Save changes" : "Add Service"}</button>
                      )}
                    </div>
                  </div>
                ) : (permission?.filter((obj) => obj.name === "Edit/delete category/service")[0]
                ?.isChecked === true &&
                permission?.filter((obj) => obj.name === "Add new category/service")[0]
                  ?.isChecked === false) ? (
                  <div className="product-edit-delete-button-align">
                    {editService ? (
                      <div
                        className="delete-button-style"
                        onClick={() => {
                          opendeleteModal();
                          setDeleteServiceId(editService._id);
                        }}
                      >
                        <img src={DeleteIcon} alt="DeleteIcon" />
                      </div>
                    ) : null}
                    <div className="modal-button">
                      {!editService ? null : serviceData.serviceName &&
                        serviceData.duration &&
                        serviceData.amount &&
                        selectedCategoryName &&
                        disabled ? (
                        <button onClick={(e) => handleOnSubmit(e)}>
                          {editService ? "Save changes" : "Add Service"}
                        </button>
                      ) : (
                        <button disabled>{editService ? "Save changes" : "Add Service"}</button>
                      )}
                    </div>
                  </div>
                ) : (permission?.filter((obj) => obj.name === "Edit/delete category/service")[0]
                ?.isChecked === true &&
                permission?.filter((obj) => obj.name === "Add new category/service")[0]
                  ?.isChecked === true) ? (
                  <div className="product-edit-delete-button-align">
                    {editService ? (
                      <div
                        className="delete-button-style"
                        onClick={() => {
                          opendeleteModal();
                          setDeleteServiceId(editService._id);
                        }}
                      >
                        <img src={DeleteIcon} alt="DeleteIcon" />
                      </div>
                    ) : null}
                    <div className="modal-button">
                      {serviceData.serviceName &&
                      serviceData.duration &&
                      serviceData.amount &&
                      selectedCategoryName &&
                      disabled ? (
                        <button onClick={(e) => handleOnSubmit(e)}>
                          {editService ? "Save changes" : "Add Service"}
                        </button>
                      ) : (
                        <button disabled>{editService ? "Save changes" : "Add Service"}</button>
                      )}
                    </div>
                  </div>
                ) : <div className="product-edit-delete-button-align">
                {editService ? (
                  <div
                    className="delete-button-style"
                    onClick={() => {
                      opendeleteModal();
                      setDeleteServiceId(editService._id);
                    }}
                  >
                    <img src={DeleteIcon} alt="DeleteIcon" />
                  </div>
                ) : null}
                <div className="modal-button">
                  {serviceData.serviceName &&
                  serviceData.duration &&
                  serviceData.amount &&
                  selectedCategoryName &&
                  disabled ? (
                    <button onClick={(e) => handleOnSubmit(e)}>
                      {editService ? "Save changes" : "Add Service"}
                    </button>
                  ) : (
                    <button disabled>{editService ? "Save changes" : "Add Service"}</button>
                  )}
                </div>
              </div>}
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center">
                <div>
                  <div className="product-info-box">
                    <div className="heading-style">
                      <h3>Service info</h3>
                    </div>
                    <div className="card-details">
                      <div className="option-select-group customer-form-group-align">
                        <label>
                          Select category
                          <span style={{ color: "red" }}> * </span>
                        </label>
                        <div className="relative" ref={categoryRef}>
                          <div
                            className="input-relative"
                            onClick={() =>
                              editService
                                ? permission?.filter(
                                    (obj) => obj.name === "Edit/delete category/service"
                                  )[0]?.isChecked !== false && setHairTreatment(!hairTreatment)
                                : permission?.filter(
                                    (obj) => obj.name === "Add new category/service"
                                  )[0]?.isChecked !== false && setHairTreatment(!hairTreatment)
                            }
                          >
                            <input
                              style={{ fontWeight: "500" }}
                              type="dropdown"
                              placeholder="Choose category"
                              value={selectedCategoryName}
                              disabled={
                                permission?.filter(
                                  (obj) => obj.name === "Edit/delete category/service"
                                )[0]?.isChecked === false
                              }
                            />
                            <div className="drop-down-icon-center">
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              hairTreatment ? "sub-menu-open sub-menu" : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              {categories?.map((cat) => {
                                return (
                                  <ul key={cat._id} onClick={(e) => handleOnClick(e, cat)}>
                                    <li>{cat.categoryName}</li>
                                  </ul>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group customer-form-group-align">
                        <label>
                          Service name
                          <span style={{ color: "red" }}> * </span>
                          {serviceData.serviceName.trim() == "" && (
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "10px",
                              }}
                            >
                              {" "}
                              {errors["serviceName"]}{" "}
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          name="serviceName"
                          value={serviceData.serviceName.replace(/^(.)|\s+(.)/g, (c) =>
                            c.toUpperCase()
                          )}
                          placeholder="Enter service name"
                          onChange={(e) => handleOnChange(e)}
                          disabled={
                            editService
                              ? permission?.filter(
                                  (obj) => obj.name === "Edit/delete category/service"
                                )[0]?.isChecked === false
                              : permission?.filter(
                                  (obj) => obj.name === "Add new category/service"
                                )[0]?.isChecked === false
                          }
                        />
                      </div>
                      <div className="form-group customer-form-group-align">
                        <label>
                          Duration (in mins)
                          <span style={{ color: "red" }}> * </span>
                          {serviceData.duration > 600 && (
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "10px",
                              }}
                            >
                              {" "}
                              {errors["duration"]}{" "}
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          name="duration"
                          value={serviceData.duration}
                          placeholder="Enter time required"
                          onChange={(e) => handleOnChange(e)}
                          onWheel={() => document.activeElement.blur()}
                          disabled={
                            editService
                              ? permission?.filter(
                                  (obj) => obj.name === "Edit/delete category/service"
                                )[0]?.isChecked === false
                              : permission?.filter(
                                  (obj) => obj.name === "Add new category/service"
                                )[0]?.isChecked === false
                          }
                        />
                      </div>
                      <div className="form-group customer-form-group-align">
                        <label>
                          Amount <a>( {SettingInfo?.currentType} )</a>{" "}
                          <span style={{ color: "red" }}> * </span>
                          {serviceData.amount > 100000 && (
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "10px",
                              }}
                            >
                              {" "}
                              {errors["amount"]}{" "}
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={serviceData.amount}
                          placeholder="Enter amount"
                          onChange={(e) => handleOnChange(e)}
                          onWheel={() => document.activeElement.blur()}
                          disabled={
                            editService
                              ? permission?.filter(
                                  (obj) => obj.name === "Edit/delete category/service"
                                )[0]?.isChecked === false
                              : permission?.filter(
                                  (obj) => obj.name === "Add new category/service"
                                )[0]?.isChecked === false
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Quick search word for invoices search </label>
                        <input
                          type="text"
                          name="quickSearch"
                          value={serviceData?.quickSearch}
                          placeholder="Use “HC” for Hair Cut"
                          onChange={(e) => handleOnChange(e)}
                          onWheel={() => document.activeElement.blur()}
                          // disabled={
                          //   permission?.filter(
                          //     (obj) =>
                          //       obj.name === "Edit/delete category/service"
                          //   )[0]?.isChecked === false
                          // }
                        />
                      </div>
                    </div>
                    {productConumptionModal && (
                      <ProductConsumptionModal
                        productConsumptionModalToggle={productConsumptionModalToggle}
                        userInfo={userInfo}
                        setServiceData={setServiceData}
                        editProductConsumptions={editProductConsumptions}
                        prevSelectedProducts={prevSelectedProducts}
                      />
                    )}
                  </div>
                  <div className="product-info-box add-new-staff-align">
                    <div className="heading-style">
                      <h3>Products consumption</h3>
                    </div>
                    <div className="card-details">
                      <div className="working-table-staff">
                        {serviceData?.productConsumptions?.length > 0 ? (
                          <>
                            <>
                              <div
                                className="flexing-wrapper"
                                onClick={(e) => productConsumptionModalToggle(e, "edit")}
                              >
                                <div className="system-does-not">
                                  <p className="text-center">Products</p>
                                </div>
                                <button> Edit </button>
                              </div>
                            </>
                            {serviceData.productConsumptions.map((product) => {
                              return (
                                <div key={product._id} className="custom-working-time-grid">
                                  <div className="custom-working-grid-items">
                                    <div>
                                      <h6 className="custom-modal-head">{product?.productName}</h6>
                                      <p className="custom-modal-subhead">
                                        {" "}
                                        {product?.brandId?.brandName} • {product?.quantity}{" "}
                                        {product?.unit}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="total-stocks">
                                    <h6>{product.consumptionRate}</h6>
                                    <p>{product?.updatedUnit}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            <div
                              className="system-does-not-wrapper"
                              onClick={(e) => productConsumptionModalToggle(e)}
                            >
                              <div className="system-does-not">
                                <p className="text-center">No products selected</p>
                              </div>
                              <button> Select </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="product-info-box add-new-staff-align">
                    <div className="heading-style">
                      <h3>GST</h3>
                    </div>
                    <div className="card-details">
                      <div className="option-select-group customer-form-group-align">
                        <label>Tax type</label>
                        <div className="relative">
                          <div
                            className="input-relative"
                            onClick={() => setExclusive(!exclusive)}
                            ref={taxTypeRef}
                          >
                            <input
                              type="text"
                              placeholder="Exclusive"
                              value={taxTypes}
                            />
                            <div className="drop-down-icon-center">
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              exclusive
                                ? "sub-menu-open sub-menu"
                                : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              <ul onClick={(e) => handleOnClick(e, "taxType")}>
                                <li>Exclusive</li>
                                <li>Inclusive</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="option-select-group">
                        <label>Tax %</label>
                        <div className="relative">
                          <div
                            className="input-relative"
                            onClick={() => setTaxType(!taxType)}
                            ref={taxRef}
                          >
                            <input
                              type="text"
                              placeholder="CGST 5%"
                              value={taxPercentage}
                            />
                            <div className="drop-down-icon-center">
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              taxType
                                ? "sub-menu-open sub-menu"
                                : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              {taxList?.map((tax) => {
                                return (
                                  <ul onClick={(e) => handleOnClick(e, "tax")}>
                                    <li>{tax}</li>
                                  </ul>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="product-info-box add-new-staff-align">
                    <div className="heading-style">
                      <h3>Staff allocated</h3>
                    </div>
                    <div className="card-details">
                      <div className="working-table-staff">
                        {/* <div className="working-time-grid disable-background">
                          <div className="working-grid-items">
                            <span>Staff name</span>
                          </div>
                          <div className="working-grid-items">
                            <button>Start time</button>
                          </div>
                          <div className="working-grid-items">
                            <button>End time</button>
                          </div>
                        </div> */}
                        {filteredStaff.length > 0 ? (
                          filteredStaff.map((filteredStaff) => {
                            return (
                              <div key={filteredStaff._id} className="working-time-grid">
                                <div className="working-grid-items">
                                  <span>{filteredStaff.firstName}</span>
                                </div>
                                {/* <div className="working-grid-items">
                                  <button>00:00 am</button>
                                </div>
                                <div className="working-grid-items">
                                  <button>00:00 am</button>
                                </div> */}
                              </div>
                            );
                          })
                        ) : (
                          <div className="system-does-not">
                            <p className="text-center">No staff available</p>
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
      </div>
    </div>
  );
}
