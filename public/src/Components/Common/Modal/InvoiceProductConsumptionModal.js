import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Icon from "../../../assets/svg/Vectors.svg";
import { ApiGet } from "../../../helpers/API/ApiData";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import OutsideAlerter from "./../OutsideAlerter";

export default function InvoiceProductConsumptionModal(props) {
  const {
    toggle,
    modal,
    serviceDetails,
    setServiceDetails,
    userInfo,
    additionalProductConsumption,
  } = props;
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(false);
  const [initialServiceDetails, setInitialServiceDetails] = useState([]);
  const [updatedServiceDetails, setUpdatedServiceDetails] = useState([]);
  const [newProductDropdown, setNewProductDropdown] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [additionallyUsedProducts, setAdditionallyUsedProducts] = useState([]);

  //input binder
  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9.]*$");
    var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const addNewProductToggle = () => {
    setNewProductDropdown(!newProductDropdown);
  };

  //additional product get
  const getProducts = async (e) => {
    let res = await ApiGet("product/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        let consumptionProducts = res.data.data.filter(
          (product) => product.productType !== "Retail"
        );
        setAllProducts(consumptionProducts);
        setSearchProducts(consumptionProducts);
        // setTotalPages(Math.ceil(res.data.data.length / 15));
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  //additional product search
  const handleSearch = (value) => {
    setSelected(true);
    setKeyword(value);
    setSearchProducts(
      allProducts?.filter((product) => {
        return (
          product?.productName.toLowerCase().includes(value.toLowerCase()) ||
          product?.categoryId.categoryName.toLowerCase().includes(value.toLowerCase()) ||
          product?.brandId.brandName.toLowerCase().includes(value.toLowerCase()) ||
          product?.quantity.toLowerCase().includes(value.toLowerCase()) ||
          product?.unit.toLowerCase().includes(value.toLowerCase())
        );
      })
    );
  };

  //additionally used product selection
  const handleOnSelectProduct = (product) => {
    props.setChanges(true);
    additionallyUsedProducts.push({
      consumptionRate: 0,
      defaultConsumption: 0,
      addedConsumption: 0,
      _id: product._id,
      quantity: product.quantity,
      productName: product.productName,
      productType: product.productType,
      unit: product.unit,
      brandId: product.brandId,
      categoryId: product.categoryId,
      key: additionallyUsedProducts?.length,
    });
    setAdditionallyUsedProducts([...additionallyUsedProducts]);
    setNewProductDropdown(false);
    setSelected(false);
    setKeyword("");
  };

  //additional product input change handle
  const additionalProductConsumptionHandler = async (e, product, option, key) => {
    if (option === "edit") {
      props.setChanges(true);
      let temSelectedProducts = additionallyUsedProducts.map((selPro, index) => {
        let consumptionRate = e.target.value;
        return key === index
          ? {
              consumptionRate: consumptionRate
                .toString()
                .split(".")
                .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
                .join("."),
              _id: selPro._id,
              key: selPro.key,
              quantity: selPro.quantity,
              productName: selPro.productName,
              productType: selPro.productType,
              unit: selPro.unit,
              defaultConsumption: 0,
              updatedUnit:
                selPro?.unit === "kg" ? "gm" : selPro?.unit === "litre" ? "ml" : selPro?.unit,
              addedConsumption: selPro?.unit === 'kg' || selPro?.unit === 'litre' ? +consumptionRate/1000 : consumptionRate
                .toString()
                .split(".")
                .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
                .join("."),
              brandId: selPro.brandId,
              categoryId: selPro.categoryId,
            }
          : {
              consumptionRate: selPro.consumptionRate,
              _id: selPro._id,
              quantity: selPro.quantity,
              productName: selPro.productName,
              productType: selPro.productType,
              unit: selPro.unit,
              defaultConsumption: 0,
              key: selPro.key,
              addedConsumption: selPro?.unit === 'kg' || selPro?.unit === 'litre' ? +consumptionRate/1000 : consumptionRate,
              updatedUnit:
                selPro?.unit === "kg" ? "gm" : selPro?.unit === "litre" ? "ml" : selPro?.unit,
              brandId: selPro.brandId,
              categoryId: selPro.categoryId,
            };
      });
      setAdditionallyUsedProducts(temSelectedProducts);
      
    }
    if (option === "delete") {
      props.setChanges(true);
      
      let additionalProductsWithoutDeleted = additionallyUsedProducts.filter((pro, i) => key !== i);
      setAdditionallyUsedProducts(
        additionalProductsWithoutDeleted?.map((pro, index) => {
          return { ...pro, key: index };
        })
      );
    }
  };

  const updateProductConsumption = async (e, targetService, targetProduct, key) => {
    props.setChanges(true);
    setInputInvalid(+e.target.value > +targetProduct.quantity);
    
    let inputValue = e.target.value
      ?.toString()
      .split(".")
      .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
      .join(".");
    

    if (key === "edit") {
      props.setChanges(true);
      // update changed service's prdoduct consumption array
      let updatedTargetServiceProductConsumptions = await targetService.productConsumptions.map(
        (pro) => {
          return pro._id === targetProduct._id
            ? {
                ...targetProduct,
                consumptionRate: `${inputValue}`,
                addedConsumption: `${
                  pro?.unit === "kg" || pro?.unit === "litre"
                    ? +inputValue / 1000
                    : +inputValue - +pro?.defaultConsumption
                }`,
              }
            : pro;
        }
      );
      // console.log(
      //   "update 3 updatedTargetService",
      //   updatedTargetServiceProductConsumptions
      // );

      // update changed service
      let updatedTargetService = {
        ...targetService,
        productConsumptions: updatedTargetServiceProductConsumptions,
      };
      

      // update all services array
      let temUpdatedServiceDetails = await updatedServiceDetails.map((ser) => {
        return ser.key === targetService.key ? updatedTargetService : ser;
      });
      

      setUpdatedServiceDetails([...temUpdatedServiceDetails]);
    }
    if (key === "delete") {
      props.setChanges(true);
      // update targeted service's products without delted product
      let updatedTargetService = await targetService?.productConsumptions?.filter(
        (pro) => pro._id !== targetProduct._id
      );
      // update all service
      let updatedServices = await updatedServiceDetails?.map((ser) => {
        return ser.key === targetService.key
          ? { ...ser, productConsumptions: updatedTargetService }
          : ser;
      });
      // set [] as productConsumption for 0 product services
      let finalFilteredServices = await updatedServices?.map((ser) => {
        return ser.productConsumptions?.length > 0 ? ser : { ...ser, productConsumptions: [] };
      });
      setUpdatedServiceDetails([...finalFilteredServices]);
    }
  };

  useEffect(() => {
    setInitialServiceDetails(serviceDetails);
    // console.log(serviceDetails.filter((obj)=>obj.productConsumptions.length > 0));
    setUpdatedServiceDetails(serviceDetails);
    getProducts();
    setAdditionallyUsedProducts(
      additionalProductConsumption?.map((pro, i) => {
        return { ...pro, key: i };
      })
    );
  }, []);

  useEffect(() => {
    if (updatedServiceDetails?.length > 0) {
      let tempArray = [];
      updatedServiceDetails?.map((ser) => tempArray.push(...ser.productConsumptions));

      // console.log("====================tempArray", tempArray);
      let invalidValues = tempArray.filter((pro) => {
        // console.log("==> consumptionRate ==>", pro.consumptionRate);
        // console.log("==> quantity ==>", pro.quantity);
        return (
          !+pro.consumptionRate 
          // ||
          // (+pro.consumptionRate &&
          //   (pro?.unit === "litre" || pro?.unit === "kg"
          //     ? +pro.consumptionRate > +pro.quantity * 1000
          //     : +pro.consumptionRate > +pro.quantity))
        );
      });
      // console.log("====================invalidValues", invalidValues);
      if (additionallyUsedProducts.length > 0) {
        let additionalProductInvalidValues = additionallyUsedProducts.filter((pro) => {
          return (
            !+pro.consumptionRate 
            // ||
            // (+pro.consumptionRate &&
            //   (pro?.unit === "litre" || pro?.unit === "kg"
            //     ? +pro.consumptionRate > +pro.quantity * 1000
            //     : +pro.consumptionRate > +pro.quantity))
          );
        });
        setInputInvalid(invalidValues.length > 0 || additionalProductInvalidValues.length > 0);
      } else {
        setInputInvalid(invalidValues.length > 0);
      }
    }
  }, [updatedServiceDetails, additionallyUsedProducts]);

  // const getServicesById = async (id) => {
  //   let res = await ApiGet("service/" + id);
  //   try {
  //     if (res.data.status === 200) {
  //       // services.push(res.data.data[0]);
  //       initialServiceDetails.push(res.data.data[0]);
  //       setInitialServiceDetails([...initialServiceDetails]);
  //       updatedServiceDetails.push(res.data.data[0]);
  //       setUpdatedServiceDetails([...updatedServiceDetails]);
  //       // setServices([...services]);
  //     }
  //   } catch (err) {
  //     console.log("in the catch");
  //   }
  // };

  // console.log("updatedServiceDetails", updatedServiceDetails);

  return (
    <>
      <div>
        {/* {console.log("updatedServiceDetails", updatedServiceDetails)}
        {console.log("additionallyUsedProducts", additionallyUsedProducts)} */}
        <div className="add-service-mini-modal" style={{ zIndex: "9999999999" }}>
          <div className="add-service-mini-modal-design custom-add-service-modal">
            <div className="modal-header">
              <div className="container-long custom-container-long">
                <div className="modal-header-alignment">
                  <div className="custom-modal-heading-title">
                    <div className="close-head-wrapper">
                      <div className="modal-close" onClick={(e) => toggle(e, "discard")}>
                        <img src={CloseIcon} alt="CloseIcon" />
                      </div>
                      <div className="modal-title alignment-counter-modal-header">
                        <h2 className="product-consumption-head">Product consumptions </h2>
                      </div>
                    </div>
                    <div>
                      <button className="custom-addnew-btn" onClick={() => addNewProductToggle()}>
                        Add Product
                      </button>{" "}
                      <button
                        className="custom-save-btn"
                        onClick={(e) =>
                          toggle(e, "save", updatedServiceDetails, additionallyUsedProducts)
                        }
                        disabled={inputInvalid}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mini-service-membership-modal-body">
              {newProductDropdown && (
                <OutsideAlerter setSelected={setSelected}>
                  <div className="left-right-alignment-add-tratment">
                    {/* <input className= type="text" /> */}
                    <div className="relative">
                      <div className="input-relative" onClick={() => setSelected(!selected)}>
                        <input
                          style={{ fontWeight: "500" }}
                          type="dropdown"
                          placeholder="Search"
                          value={keyword}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="drop-down-icon-center">
                          <img src={DropDownIcon} alt="DropDownIcon" />
                        </div>
                      </div>
                      <div
                        className={selected ? "sub-menu-open sub-menu" : "sub-menu sub-menu-close"}
                      >
                        <div className="sub-menu-design">
                          {allProducts?.length > 0 &&
                            (!keyword ? allProducts : searchProducts).map((product, i) => {
                              // let thisIsSelected = selectedProducts?.find(
                              //   (selPro) => selPro._id === product._id
                              // );
                              return (
                                <ul key={i} onClick={() => handleOnSelectProduct(product)}>
                                  <li>
                                    {product?.productName}
                                    <br />
                                    <span>
                                      {product?.brandId?.brandName} •{" "}
                                      {product?.categoryId?.categoryName} • {product?.quantity}{" "}
                                      {product?.unit}
                                    </span>
                                  </li>
                                </ul>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    {/* <div className="left-right-al-add-wrap">
                      <div className="left-right-input-wrap">
                        <input
                          type="text"
                          className="custom-left-right-input"
                          placeholder=""
                        />
                        <span>ml</span>
                      </div>
                      <span onClick={}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.61872 0.381282C1.27701 0.0395728 0.72299 0.0395728 0.381282 0.381282C0.0395728 0.72299 0.0395728 1.27701 0.381282 1.61872L1.61872 0.381282ZM11.6313 12.8687C11.973 13.2104 12.527 13.2104 12.8687 12.8687C13.2104 12.527 13.2104 11.973 12.8687 11.6313L11.6313 12.8687ZM0.381282 1.61872L11.6313 12.8687L12.8687 11.6313L1.61872 0.381282L0.381282 1.61872Z"
                          fill="#E66666"
                        />
                        <path
                          d="M0.381282 11.6313C0.0395728 11.973 0.0395728 12.527 0.381282 12.8687C0.72299 13.2104 1.27701 13.2104 1.61872 12.8687L0.381282 11.6313ZM12.8687 1.61872C13.2104 1.27701 13.2104 0.72299 12.8687 0.381282C12.527 0.0395728 11.973 0.0395728 11.6313 0.381282L12.8687 1.61872ZM1.61872 12.8687L12.8687 1.61872L11.6313 0.381282L0.381282 11.6313L1.61872 12.8687Z"
                          fill="#E66666"
                        />
                      </svg>
                      </span>
                    </div> */}
                  </div>
                </OutsideAlerter>
              )}
              {additionallyUsedProducts.length > 0 && (
                <div className="treatment-box-design">
                  {/* <div>{service?.colour}</div> */}
                  <div className="treatment-header-grid">
                    <div className="treatment-header-grid-items">
                      <div
                        className="treatement-head-color"
                        style={{ backgroundColor: "#97A7C3" }}
                      />
                      <h2 className="treatment-heading">Extra consumption</h2>
                    </div>
                  </div>
                
                  {additionallyUsedProducts.map((product) => {
                    // console.log("******key", product?.key);
                    return (
                      <div className="all-content-mention">
                        <div className="left-right-alignment-tratment">
                          <div className="custom-modal-subhead">
                            <h6>{product?.productName}</h6>
                            <p>
                              {product?.brandId?.brandName} • {product?.categoryId?.categoryName} •
                              {product?.quantity} {product?.unit}
                            </p>
                          </div>
                          <div>
                            <div className="left-right-input-wrap">
                              <input
                                type="text"
                                className="custom-left-right-input"
                                placeholder="eg.10"
                                id={product?.key}
                                value={product?.consumptionRate}
                                onChange={(e) =>
                                  additionalProductConsumptionHandler(
                                    e,
                                    product,
                                    "edit",
                                    product?.key
                                  )
                                }
                                onKeyPress={bindInput}
                                maxLength={`7`}
                              />
                              <span>
                                {product?.unit === "kg"
                                  ? "gm"
                                  : product?.unit === "litre"
                                  ? "ml"
                                  : product?.unit}
                              </span>
                            </div>
                            <span
                              name={product?.key}
                              onClick={(e) =>
                                additionalProductConsumptionHandler(
                                  e,
                                  product,
                                  "delete",
                                  product?.key
                                )
                              }
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.61872 0.381282C1.27701 0.0395728 0.72299 0.0395728 0.381282 0.381282C0.0395728 0.72299 0.0395728 1.27701 0.381282 1.61872L1.61872 0.381282ZM11.6313 12.8687C11.973 13.2104 12.527 13.2104 12.8687 12.8687C13.2104 12.527 13.2104 11.973 12.8687 11.6313L11.6313 12.8687ZM0.381282 1.61872L11.6313 12.8687L12.8687 11.6313L1.61872 0.381282L0.381282 1.61872Z"
                                  fill="#E66666"
                                />
                                <path
                                  d="M0.381282 11.6313C0.0395728 11.973 0.0395728 12.527 0.381282 12.8687C0.72299 13.2104 1.27701 13.2104 1.61872 12.8687L0.381282 11.6313ZM12.8687 1.61872C13.2104 1.27701 13.2104 0.72299 12.8687 0.381282C12.527 0.0395728 11.973 0.0395728 11.6313 0.381282L12.8687 1.61872ZM1.61872 12.8687L12.8687 1.61872L11.6313 0.381282L0.381282 11.6313L1.61872 12.8687Z"
                                  fill="#E66666"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {updatedServiceDetails?.length > 0 ? (
                updatedServiceDetails.map((service) => {
                  return (
                    <div
                      className="treatment-box-design"
                      style={{ display: service?.productConsumptions?.length === 0 && "none" }}
                    >
                      {/* <div>{service?.colour}</div> */}
                      <div className="treatment-header-grid">
                        <div className="treatment-header-grid-items">
                          <div
                            className="treatement-head-color"
                            style={{ backgroundColor: service?.colour }}
                          />
                          <h2 className="treatment-heading">{service?.servicename}</h2>
                        </div>
                      </div>
                     
                      {service?.productConsumptions?.length > 0 ? (
                        service?.productConsumptions.map((product) => {
                          return (
                            <div className="all-content-mention">
                              <div className="left-right-alignment-tratment">
                                <div className="custom-modal-subhead">
                                  <h6>{product?.productName}</h6>
                                  <p>
                                    {product?.brandId?.brandName} •{" "}
                                    {product?.categoryId?.categoryName}• {product?.quantity}
                                    {product?.unit}
                                  </p>
                                </div>
                                <div>
                                  <div className="left-right-input-wrap">
                                    <input
                                      type="text"
                                      className="custom-left-right-input"
                                      placeholder="eg.10"
                                      value={product?.consumptionRate}
                                      onChange={(e) =>
                                        updateProductConsumption(e, service, product, "edit")
                                      }
                                      onKeyPress={bindInput}
                                      maxLength={`7`}
                                    />
                                    <span>{product?.updatedUnit}</span>
                                  </div>
                                  <span
                                    onClick={(e) =>
                                      updateProductConsumption(e, service, product, "delete")
                                    }
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 14 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1.61872 0.381282C1.27701 0.0395728 0.72299 0.0395728 0.381282 0.381282C0.0395728 0.72299 0.0395728 1.27701 0.381282 1.61872L1.61872 0.381282ZM11.6313 12.8687C11.973 13.2104 12.527 13.2104 12.8687 12.8687C13.2104 12.527 13.2104 11.973 12.8687 11.6313L11.6313 12.8687ZM0.381282 1.61872L11.6313 12.8687L12.8687 11.6313L1.61872 0.381282L0.381282 1.61872Z"
                                        fill="#E66666"
                                      />
                                      <path
                                        d="M0.381282 11.6313C0.0395728 11.973 0.0395728 12.527 0.381282 12.8687C0.72299 13.2104 1.27701 13.2104 1.61872 12.8687L0.381282 11.6313ZM12.8687 1.61872C13.2104 1.27701 13.2104 0.72299 12.8687 0.381282C12.527 0.0395728 11.973 0.0395728 11.6313 0.381282L12.8687 1.61872ZM1.61872 12.8687L12.8687 1.61872L11.6313 0.381282L0.381282 11.6313L1.61872 12.8687Z"
                                        fill="#E66666"
                                      />
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center -mt-3 font-medium heading-title-text-color system-does-not">
                          <p>No products available</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center -mt-3 font-medium heading-title-text-color system-does-not">
                  <p>No services available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
