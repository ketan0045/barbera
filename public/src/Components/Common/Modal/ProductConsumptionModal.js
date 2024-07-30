import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import SearchIcon from "../../../assets/svg/SearchIcon.svg";
import { ApiGet } from "../../../helpers/API/ApiData";

export default function ProductConsumptionModal(props) {
  const {
    productConsumptionModalToggle,
    userInfo,
    setServiceData,
    editProductConsumptions,
    prevSelectedProducts,
  } = props;
  const [selectedProducts, setSelectedProducts] = useState(prevSelectedProducts);
  const [addQuantityMenuToggle, setAddQuantityMenuToggle] = useState(editProductConsumptions);
  const [allProducts, setAllProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSelectProducts = async (product) => {
    if (selectedProducts?.length === 0) {
      setSelectedProducts([product]);
    } else if (selectedProducts?.find((selProd) => selProd._id === product._id)) {
      let newSelectedProducts = await selectedProducts.filter((selectedProduct) => {
        return selectedProduct._id !== product._id;
      });
      setSelectedProducts(newSelectedProducts);
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleChangeConsumption = async (e, product) => {
    let temSelectedProducts = await selectedProducts.map((selPro) => {
      let consumptionRate = e.target.value;
      return selPro._id === product._id
        ? {
            ...selPro,
            consumptionRate: consumptionRate
              .toString()
              .split(".")
              .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
              .join("."),
          }
        : selPro;
    });
    setSelectedProducts(temSelectedProducts);
  };

  const consumptionAdded =
    selectedProducts?.filter((selPro) => selPro?.consumptionRate)?.length ===
    selectedProducts?.length;

  const handleOnSave = (e) => {
    const tempSelectedProducts = selectedProducts?.map((selPro) => ({
      ...selPro,
      updatedUnit: selPro?.unit === "litre" ? "ml" : selPro?.unit === "kg" ? "gm" : selPro?.unit,
      defaultConsumption:
        selPro?.unit === "litre" || selPro?.unit === "kg"
          ? +selPro?.consumptionRate / 1000
          : +selPro?.consumptionRate,
      addedConsumption: 0,
    }));
    setServiceData((prevState) => {
      return {
        ...prevState,
        productConsumptions: tempSelectedProducts,
      };
    });
    productConsumptionModalToggle();
  };

  const handleClose = (e) => {
    setSelectedProducts([]);
    productConsumptionModalToggle();
  };

  const addQuantityToggle = (e) => {
    e.preventDefault();
    setAddQuantityMenuToggle(!addQuantityMenuToggle);
  };

  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9.]*$");
    var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

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

  const handleSearch = (value) => {
    setKeyword(value);
    setSearchProducts(
      allProducts?.filter((product) => {
        return (
          product?.productName.toLowerCase().includes(value.toLowerCase()) ||
          product?.brandId.brandName.toLowerCase().includes(value.toLowerCase()) ||
          product?.quantity.toLowerCase().includes(value.toLowerCase()) ||
          product?.categoryId.categoryName.toLowerCase().includes(value.toLowerCase()) ||
          product?.unit.toLowerCase().includes(value.toLowerCase())
        );
      })
    );
  };

  useEffect(() => {
    let invalid = selectedProducts.filter((selPro) => {
      return !+selPro.consumptionRate;
      // || +selPro.consumptionRate &&
      // (selPro?.unit === "litre" || selPro?.unit === "kg"
      //   ? +selPro.consumptionRate > +selPro.quantity * 1000
      //   : +selPro.consumptionRate > +selPro.quantity))
    });

    setIsInvalid(invalid?.length > 0);
   
  }, [selectedProducts]);

  useEffect(() => {
    getProducts();
  }, []);

  // console.log("isInvalid", isInvalid);
  // console.log("selectedProducts", selectedProducts);

  return (
    <div className="add-service-mini-modal">
      <div className="add-service-mini-modal-design">
        <div className="modal-header">
          <div className="container-long" style={{ padding: "0 25px" }}>
            <div className="modal-header-alignment">
              <div className="add-staff-child-modal-design-title">
                <div className="modal-close" onClick={(e) => handleClose(e)}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="">
                  <h2>
                    Add service: {addQuantityMenuToggle ? "Add quantity used" : "Select products"}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        {addQuantityMenuToggle ? (
          <div className="mini-service-add-staff-modal-body">
            {/* <div className="add-new-child-search">
              {/* <div className="input-relative-child">
                <input
                  type="search"
                  placeholder="Search category"
                  // onChange={(e) => setKeyWord(e.target.value)}
                /> */}
            {/* <div className="search-child-icon-alignment">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div> */}
            <div className="select-all-category-child-box">
              <div className="all-treatment-product-detail-wrapper">
                <div className="all-treatment-align-box">
                  <h5 className="p-name-style-cus">Product name</h5>
                  <h5 className="p-name-style-cus">Product Qty</h5>
                </div>
                {selectedProducts.map((product, i) => {
                  return (
                    <div
                      className="all-treatment-product-detail"
                      key={i}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div className="custom-treatement-wrapper">
                        <div className="new-phase-modal-style">
                          <h6 className="">{product.productName}</h6>
                          <p className="">
                            {" "}
                            {product?.brandId?.brandName} • {product?.categoryId?.categoryName} •{" "}
                            {product?.quantity} {product?.unit}
                          </p>
                        </div>
                        <div className="discount-filed-open-grid-items custom-service-input">
                          <input
                            type="text"
                            placeholder="e.g. 100"
                            maxLength={"7"}
                            onKeyPress={(e) => bindInput(e)}
                            onChange={(e) => handleChangeConsumption(e, product)}
                            value={product?.consumptionRate}
                          />
                          <p>
                            {product?.unit === "litre"
                              ? "ml"
                              : product?.unit === "kg"
                              ? "gm"
                              : product?.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mini-service-add-staff-modal-body">
            <div className="add-new-child-search">
              <div className="input-relative-child">
                <input
                  type="search"
                  placeholder="Search product’s name, brand, category or amount"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="search-child-icon-alignment">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div>
              </div>
            </div>
            <div className="select-all-category-child-box">
              <div className="all-treatment-align-box-all">
                {allProducts.length > 0 &&
                  (!keyword ? allProducts : searchProducts).map((product, i) => {
                    let thisIsSelected = selectedProducts?.find(
                      (selPro) => selPro._id === product._id
                    );
                    return (
                      <div
                        className={
                          !!thisIsSelected
                            ? "all-treatment-align-box-selected"
                            : "all-treatment-align-box"
                        }
                        key={i}
                        style={{
                          cursor: "pointer",
                        }}
                        value={product._id}
                        onClick={(e) => handleSelectProducts(product)}
                      >
                        <div className="new-phase-modal-style">
                          <h6 className="">{product?.productName}</h6>
                          <p className="custom-modal-subhead">
                            {" "}
                            {product?.brandId?.brandName} • {product?.categoryId?.categoryName} •{" "}
                            {product?.quantity} {product?.unit}
                          </p>
                        </div>
                        <div className="selected-icon-wrapper">
                          {!!thisIsSelected && (
                            <svg
                              width="15"
                              height="12"
                              viewBox="0 0 15 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.72926 5.18418C1.35136 4.78142 0.718517 4.76127 0.315759 5.13916C-0.0869977 5.51706 -0.107152 6.1499 0.270744 6.55266L1.72926 5.18418ZM5.81482 11L5.08556 11.6842C5.28265 11.8943 5.56075 12.0092 5.84862 11.9994C6.1365 11.9897 6.4062 11.8563 6.58864 11.6334L5.81482 11ZM14.7738 1.63339C15.1236 1.20602 15.0608 0.575984 14.6334 0.22617C14.206 -0.123643 13.576 -0.0607681 13.2262 0.366606L14.7738 1.63339ZM0.270744 6.55266L5.08556 11.6842L6.54407 10.3158L1.72926 5.18418L0.270744 6.55266ZM6.58864 11.6334L14.7738 1.63339L13.2262 0.366606L5.04099 10.3666L6.58864 11.6334Z"
                                fill="#1479FF"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        <div className="select-categories-modal-footer-alignment">
          <div className="edit-category-alignment-all">
            <div className="edit-category-position">
              {addQuantityMenuToggle ? (
                <>
                  <div className="edit-custom-position">
                    <div>
                      <button className="custom-select-btn" onClick={(e) => addQuantityToggle(e)}>
                        <svg
                          width="16"
                          height="14"
                          viewBox="0 0 16 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.82333 6.99997L14.1763 6.99997"
                            stroke="#1479FF"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.22754 1L1.82313 7L7.22754 13"
                            stroke="#1479FF"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>

                        <p>Select products</p>
                      </button>
                    </div>
                    <div className="selected-footer-wrapper">
                      <span style={{ opacity: "0.5", color: "#193566" }}>
                        {selectedProducts?.length} Products selected
                      </span>
                      <button
                        disabled={!consumptionAdded || isInvalid}
                        onClick={(e) => handleOnSave(e)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="selected-item-footer">
                    <p className="selected-item-numbers">
                      {selectedProducts.length}
                      <span>&nbsp;Products selected</span>
                    </p>
                    &nbsp; &nbsp;
                    <button
                      disabled={selectedProducts?.length === 0}
                      onClick={(e) => addQuantityToggle(e)}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
