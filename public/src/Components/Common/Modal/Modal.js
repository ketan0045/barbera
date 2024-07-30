import React, { useState, useRef, useEffect, useContext } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropdownIcon from "../../../assets/svg/drop-down.svg";
import Auth from "../../../helpers/Auth";
import { ApiPost, ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";
import Success from "../Toaster/Success/Success";
import UserContext from "../../../helpers/Context";
import { get_Setting } from "../../../utils/user.util";

export default function Modal(props) {
  const { editProduct, close, toggle, SettingInfo, permission } = props;
  const userInfo = Auth.getUserDetail();
  const { isProductType, isBarcode } = useContext(UserContext);
  const selectCategoryRef = useRef();
  const selectBrandRef = useRef();
  const createCategoryRef = useRef();
  const createBrandRef = useRef();
  const productTypeRef = useRef();
  const discountTypeRef = useRef();
  const texRef = useRef();
  const texTypeRef = useRef();
  const unitRef = useRef();
  const [amountMenu, setAmountMenu] = useState(true);
  const [productTypeSetting, setProductTypeSetting] = useState(
    "Store Consumable & Retail"
  );
  const [keyWord, setKeyWord] = useState("");
  const [showProduct, setShowProduct] = useState(false);
  const [showUnit, setShowUnit] = useState(false);
  const [showTax, setShowTax] = useState(false);
  const [showTaxType, setShowTaxType] = useState(false);
  const [allBrands, setAllBrands] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [newBrandAdd, setNewBrandAdd] = useState(true);
  const [newCategoryAdd, setNewCategoryAdd] = useState(true);
  const [newBrandDropDown, setNewBrandDropDown] = useState(true);
  const [newCategoryDropDown, setNewCategoryDropDown] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [productData, setProductData] = useState({
    productType: "Retail",
    unit: "ml",
    discountType: SettingInfo?.currentType,
    taxType: "Inclusive",
    retailPrice: "",
    discount: "",
    discountPrice: "",
  });
  const [selectCategory, setSelectCategory] = useState("");
  const [selectBrand, setSelectBrand] = useState("");
  const [errors, setError] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [availlist, setAvaillist] = useState([]);
  // const [object, setObject] = useState({});
  const [addGst, setAddGst] = useState(0);
  const [toastmsg, setToastmsg] = useState();
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [enableInventory, setEnableInventory] = useState({});
  const [productTax, setProductTax] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const productTypeList = [
    "Retail",
    "Store Consumable",
    "Store Consumable & Retail",
  ];
  const taxTypeList = ["Exclusive", "Inclusive"];
  const discountTypeList = [SettingInfo?.currentType, "%"];
  // const taxList = ["CGST 9%", "SGST 9%", "CGST 18%", "SGST 18%"];
  const unitList = [
    {
      unit: "ml - mililitre",
      value: "ml",
    },
    {
      unit: "litre",
      value: "litre",
    },
    {
      unit: "gram",
      value: "gram",
    },
    {
      unit: "kg - kilogram",
      value: "kg",
    },
    {
      unit: "cm - centimeter",
      value: "cm",
    },
    {
      unit: "A whole product",
      value: "No.",
    },
  ];

  const checkValue = (value) => {
    var regex = new RegExp("^[^a-zA-Z0-9' ]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
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

  const bindMultiPointInput = (value) => {
    var regex = new RegExp("^[^0-9.]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

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

  const getSetting = async (e) => {
    const SettingData = get_Setting()
      setProductTax(SettingData?.tax?.productTax);
      setTaxList(SettingData?.tax?.productTaxPer);
      setEnableInventory(SettingData?.inventory);
     
    // let res = await ApiGet("setting/company/" + userInfo.companyId);
    // try {
    //   if (res.data.status === 200) {
    //     setProductTax(res.data.data[0].tax.productTax);
    //     setTaxList(res.data.data[0].tax.productTaxPer);
    //     setEnableInventory(res.data.data[0].inventory);
    //   }
    // } catch (err) {
    //   console.log("in the catch");
    // }
  };

  const getAllBrands = async () => {
    let res = await ApiGet("ibrand/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setAllBrands(res.data.data);
        setFilteredBrand(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const getAllCategories = async () => {
    let res = await ApiGet("icategory/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setAllCategories(res.data.data);
        setFilteredCategory(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const changeCategoryHandler = (e) => {
    setNewCategoryDropDown(false);
    validateCategoryForm();
    setSelectCategory(e.target.value);
    setKeyWord(e.target.value);
    var categoryData =
      filteredCategory.length > 0 &&
      filteredCategory.filter(
        (rep) =>
          rep.categoryName &&
          rep.categoryName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    if (e.target.value === "") {
      ApiGet("icategory/company/" + userInfo.companyId).then((resp) => {
        setAllCategories(resp.data.data);
      });
    } else {
      setAllCategories(categoryData);
    }
  };

  const changeBrandHandler = (e) => {
    setNewBrandDropDown(false);
    validateBrandForm();
    setSelectBrand(e.target.value);
    setKeyWord(e.target.value);
    var brandData =
      filteredBrand.length > 0 &&
      filteredBrand.filter(
        (rep) =>
          rep.brandName &&
          rep.brandName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    if (e.target.value === "") {
      ApiGet("ibrand/company/" + userInfo.companyId).then((resp) => {
        setAllBrands(resp.data.data);
      });
    } else {
      setAllBrands(brandData);
    }
  };

  const handleOnClick = async (e) => {
    setSelectCategory(categoryName);
    let categoryBody = {
      categoryName,
      companyId: userInfo.companyId,
      isActive: true,
    };
    let res = await ApiPost("icategory/", categoryBody);
    try {
      if (res.data.status === 200) {
        setSuccess(true);
        setToastmsg("Category added!");
      } else if (res.data.status == 208) {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Category already exists!");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Something went wrong");
    }
    setNewCategoryAdd(!newCategoryAdd);
    getAllCategories();
  };

  const clickHandler = async (e) => {
    setSelectBrand(brandName);
    let brandBody = {
      brandName,
      companyId: userInfo.companyId,
      isActive: true,
    };
    let res = await ApiPost("ibrand/", brandBody);
    try {
      if (res.data.status === 200) {
        setSuccess(true);
        setToastmsg("Brand added!");
      } else if (res.data.status == 208) {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Brand already exists!");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Something went wrong");
    }
    setNewBrandAdd(!newBrandAdd);
    getAllBrands();
  };

  const handleOnChange = (e) => {
    validateForm();
    let { name, value } = e.target;
    if (name === "discountPrice") {
      setProductData((prevState) => {
        return {
          ...prevState,
          discountType: SettingInfo?.currentType,
          [name]: value,
        };
      });
    } else {
      setProductData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
      if (e.target.value) {
        setDisabled(true);
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (productData?.productName?.trim() == "") {
      formIsValid = false;
      errors["productName"] = "Please enter product name";
    }
    if (selectCategory) {
      if (selectCategory?.trim() == "") {
        formIsValid = false;
        errors["category"] = "Please select category";
      } else if (!categoryId.length > 0) {
        formIsValid = false;
        errors["category2"] = "Select category from the list or add new";
      }
    }
    if (selectBrand) {
      if (selectBrand?.trim() == "") {
        formIsValid = false;
        errors["brand"] = "Please select brand";
      } else if (!brandId.length > 0) {
        formIsValid = false;
        errors["brand2"] = "Select brand from the list or add new";
      }
    }
    if (
      +productData?.retailPrice < +productData?.discount &&
      productData?.discountType === SettingInfo?.currentType
    ) {
      formIsValid = false;
      errors["discountRupee"] = "* Enter valid input";
    }
    if (+productData?.discount > 100 && productData?.discountType === "%") {
      formIsValid = false;
      errors["discountPercentage"] = "* Enter valid input";
    }
    if (+productData?.discountPrice > +productData?.retailPrice) {
      formIsValid = false;
      errors["discountPrice"] = "* Enter valid input";
    }
    setError(errors);
    return formIsValid;
  };

  const validateCategoryForm = () => {
    let errors = {};
    let formIsValid = true;

    if (productData?.productName?.trim() == "") {
      formIsValid = false;
      errors["productName"] = "Please enter product name";
    }
    if (selectBrand) {
      if (selectBrand?.trim() == "") {
        formIsValid = false;
        errors["brand"] = "Please select brand";
      } else if (!brandId.length > 0) {
        formIsValid = false;
        errors["brand2"] = "Select brand from the list or add new";
      }
    }
    setError(errors);
    return formIsValid;
  };

  const validateBrandForm = () => {
    let errors = {};
    let formIsValid = true;

    if (productData?.productName?.trim() == "") {
      formIsValid = false;
      errors["productName"] = "Please enter product name";
    }
    if (selectCategory) {
      if (selectCategory?.trim() == "") {
        formIsValid = false;
        errors["category"] = "Please select category";
      } else if (!categoryId.length > 0) {
        formIsValid = false;
        errors["category2"] = "Select category from the list or add new";
      }
    }
    setError(errors);
    return formIsValid;
  };

  const onSubmit = async (e) => {
    try {
      const productDetails = Object.assign(productData, {
        unit: productData?.quantity ? productData?.unit : null,
        discountPrice: !productData?.discount
          ? productData?.retailPrice
          : productData?.discountPrice,
        categoryId: categoryId[0]._id,
        brandId: brandId[0]._id,
        tax: availlist,
        totalTax: addGst,
        companyId: userInfo.companyId,
        isActive: true,
      });
      let res;
      editProduct
        ? (res = await ApiPut("product/" + editProduct._id, productDetails))
        : (res = await ApiPost("product/", productDetails));
      try {
        close();
        toggle(res.data.status);
      } catch (er) {
        toggle(er);
      }
      let stockDetails = {
        productId: res?.data?.data?._id,
        retailInitialStock: productData?.retailInitialStock
          ? productData?.retailInitialStock
          : 0,
        storeInitialStock: productData?.storeInitialStock
          ? productData?.storeInitialStock
          : 0,
        type: "CR",
        companyId: userInfo.companyId,
      };
      let resp;
      resp = await ApiPost("stock/", stockDetails);
      close();
    } catch (err) {
      toast.error("Something Went Wrong", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const sortedCategories =
    allCategories.length > 0 &&
    allCategories?.sort(function (a, b) {
      if (a.categoryName < b.categoryName) return -1;
      if (a.categoryName > b.categoryName) return 1;
      return 0;
    });

  const sortedBrands =
    allBrands.length > 0 &&
    allBrands?.sort(function (a, b) {
      if (a.brandName < b.brandName) return -1;
      if (a.brandName > b.brandName) return 1;
      return 0;
    });

  const fetchData = async (id) => {
    let productValue = await ApiGet("product/" + id);
    productValue = productValue.data.data;
    setProductData(productValue[0]);
   
  };

  const multipleTaxSlabs = (e) => {
    setDisabled(true);
    const productgst = e.target.value?.match(/[\d\.]+|\D+/g)?.[1];
    setAddGst(productgst);
    if (e.target.checked && e.target.name === "name") {
      availlist.push(e.target.value);
      setAddGst(+addGst + +productgst);
    } else if (e.target.name === "name") {
      let index = availlist.indexOf(e.target.value);
      availlist.splice(index, 1);
      setAddGst(+addGst - +productgst);
    }
    setAvaillist([...availlist]);
    // let obj = Object.assign({}, availlist);
    // setObject(obj);
  };

  const mergeStateHandler = (data, key) => {
    setDisabled(true);
    if (key === "unit") {
      setShowUnit(!showUnit);
      setProductData((prevState) => {
        return {
          ...prevState,
          unit: data.value,
        };
      });
    } else if (key === "discountType") {
      setAmountMenu(!amountMenu);
      setProductData((prevState) => {
        return {
          ...prevState,
          discountType: data,
          discount: "",
        };
      });
    } else if (key === "productType") {
      setShowProduct(!showProduct);
      setProductData((prevState) => {
        return {
          ...prevState,
          productType: data,
        };
      });
    } else if (key === "tax") {
      setShowTax(!showTax);
      setProductData((prevState) => {
        return {
          ...prevState,
          tax: data,
        };
      });
    } else if (key === "taxType") {
      setShowTaxType(!showTaxType);
      setProductData((prevState) => {
        return {
          ...prevState,
          taxType: data,
        };
      });
    } else if (key === "discountPrice") {
      setProductData((prevState) => {
        return {
          ...prevState,
          discountPrice: data,
          discountType: SettingInfo?.currentType,
          discount:
            +data > +prevState.retailPrice ? 0 : +prevState.retailPrice - +data,
        };
      });
    }
  };

  const categoryId = !selectCategory
    ? allCategories.length > 0 &&
      allCategories?.filter(
        (rep) => rep.categoryName === editProduct?.categoryId?.categoryName
      )
    : allCategories.length > 0 &&
      allCategories?.filter((rep) => rep.categoryName === selectCategory);
  const brandId = !selectBrand
    ? allBrands.length > 0 &&
      allBrands?.filter(
        (rep) => rep.brandName === editProduct?.brandId?.brandName
      )
    : allBrands.length > 0 &&
      allBrands?.filter((rep) => rep.brandName === selectBrand);

  useEffect(() => {
    setSelectCategory(editProduct?.categoryId?.categoryName);
    setSelectBrand(editProduct?.brandId?.brandName);
    setAvaillist(editProduct?.tax ? editProduct?.tax : []);
    // setAvaillist(editProduct?.tax ? Object.values(editProduct?.tax) : []);
    // setObject(
    //   Object.assign({}, editProduct?.tax ? Object.values(editProduct?.tax) : [])
    // );
    setAddGst(editProduct ? editProduct?.totalTax : 0);
    setProductData((prevState) => {
      return {
        ...prevState,
        retailPrice: editProduct?.retailPrice,
        discount: editProduct?.discount,
        discountPrice: editProduct?.discountPrice,
        discountType: editProduct?.discountType,
      };
    });
  }, [editProduct]);

  useEffect(() => {
    setProductData((prevState) => {
      return {
        ...prevState,
        discountPrice:
          prevState.discountType === "%"
            ? +prevState.discount > 100
              ? 0
              : +prevState.retailPrice -
                (+prevState.retailPrice * +prevState.discount) / 100
            : +prevState.discount > +prevState.retailPrice
            ? 0
            : +prevState.retailPrice - +prevState.discount,
      };
    });
  }, [productData.discount, productData.retailPrice]);

  useEffect(() => {
    getAllBrands();
    getAllCategories();
    getSetting();
    setProductTypeSetting(isProductType);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (editProduct) {
      fetchData(editProduct._id);
    } else {
      setProductData({
        productType: "Retail",
        unit: "ml",
        taxType: "Inclusive",
        discountType: SettingInfo?.currentType,
        retailPrice: "",
        discount: "",
        discountPrice: "",
      });
    }
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!newCategoryDropDown) {
        if (
          !newCategoryDropDown &&
          selectCategoryRef.current &&
          !selectCategoryRef.current.contains(e.target)
        ) {
          setNewCategoryDropDown(true);
        }
      } else if (!newBrandDropDown) {
        if (
          !newBrandDropDown &&
          selectBrandRef.current &&
          !selectBrandRef.current.contains(e.target)
        ) {
          setNewBrandDropDown(true);
        }
      } else if (!newCategoryAdd) {
        if (
          !newCategoryAdd &&
          createCategoryRef.current &&
          !createCategoryRef.current.contains(e.target)
        ) {
          setNewCategoryAdd(true);
        }
      } else if (!newBrandAdd) {
        if (
          !newBrandAdd &&
          createBrandRef.current &&
          !createBrandRef.current.contains(e.target)
        ) {
          setNewBrandAdd(true);
        }
      } else if (showProduct) {
        if (
          showProduct &&
          productTypeRef.current &&
          !productTypeRef.current.contains(e.target)
        ) {
          setShowProduct(false);
        }
      } else if (!amountMenu) {
        if (
          !amountMenu &&
          discountTypeRef.current &&
          !discountTypeRef.current.contains(e.target)
        ) {
          setAmountMenu(true);
        }
      } else if (showTax) {
        if (showTax && texRef.current && !texRef.current.contains(e.target)) {
          setShowTax(false);
        }
      } else if (showTaxType) {
        if (
          showTaxType &&
          texTypeRef.current &&
          !texTypeRef.current.contains(e.target)
        ) {
          setShowTaxType(false);
        }
      } else if (showUnit) {
        if (
          showUnit &&
          unitRef.current &&
          !unitRef.current.contains(e.target)
        ) {
          setShowUnit(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [
    newCategoryDropDown,
    newBrandDropDown,
    newCategoryAdd,
    newBrandAdd,
    showProduct,
    amountMenu,
    showTax,
    showTaxType,
    showUnit,
  ]);

  useEffect(() => {
    if (enableInventory) {
      if (enableInventory.productType === "Retail") {
        setProductData((prevState) => {
          return {
            ...prevState,
            productType: "Retail",
          };
        });
      } else if (enableInventory.productType === "Store Consumable") {
        setProductData((prevState) => {
          return {
            ...prevState,
            productType: "Store Consumable",
          };
        });
      } else if (enableInventory.productType === "Store Consumable & Retail") {
        setProductData((prevState) => {
          return {
            ...prevState,
            productType: "Store Consumable & Retail",
          };
        });
      }
    }
  }, [enableInventory]);

  return (
    <>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>{editProduct ? "Edit product" : "Add new product"}</h2>
                </div>
              </div>
              <div className="modal-button">
                {productData?.productName &&
                selectCategory &&
                selectBrand &&
                productData?.retailPrice &&
                productData?.quantity &&
                disabled ? (
                  <button onClick={(e) => onSubmit(e)}>
                    {editProduct ? "Save changes" : "Add product"}
                  </button>
                ) : (
                  <button disabled>
                    {editProduct ? "Save changes" : "Add product"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* modal header */}
        {/* modal body */}
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Product info</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-alignment">
                      <div className="form-group">
                        <label>
                          Product name{" "}
                          <span style={{ color: "red" }}>
                            {" "}
                            *{" "}
                            {productData?.productName?.trim() == "" && (
                              <span
                                style={{
                                  color: "red",
                                  top: "5px",
                                  fontSize: "10px",
                                }}
                              >
                                {" "}
                                {errors["productName"]}{" "}
                              </span>
                            )}{" "}
                          </span>{" "}
                        </label>
                        <input
                          type="text"
                          name="productName"
                          value={productData?.productName?.replace(
                            /^(.)|\s+(.)/g,
                            (c) => c.toUpperCase()
                          )}
                          placeholder="Hair Fall Control Shampoo"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                      <div>
                        <div
                          className={
                            newCategoryAdd
                              ? "input-grid form-top-align-space"
                              : "input-grid-hidden"
                          }
                        >
                          <div className="input-grid-items">
                            <div className="form-group">
                              <label>
                                Category{" "}
                                <span style={{ color: "red" }}>
                                  {" "}
                                  *{" "}
                                  {selectCategory?.trim() == "" && (
                                    <span
                                      style={{
                                        color: "red",
                                        top: "5px",
                                        fontSize: "10px",
                                      }}
                                    >
                                      {" "}
                                      {errors["category"]}{" "}
                                    </span>
                                  )}
                                  {!categoryId.length > 0 && (
                                    <span
                                      style={{
                                        color: "red",
                                        top: "5px",
                                        fontSize: "10px",
                                      }}
                                    >
                                      {" "}
                                      {errors["category2"]}{" "}
                                    </span>
                                  )}{" "}
                                </span>{" "}
                              </label>
                              <div
                                className="input-relative-icon"
                                ref={selectCategoryRef}
                              >
                                <div
                                  className="relative"
                                  onClick={() =>
                                    setNewCategoryDropDown(!newCategoryDropDown)
                                  }
                                >
                                  <input
                                    type="search"
                                    placeholder={
                                      !newCategoryDropDown
                                        ? "Type here"
                                        : "e.g., Shampoo"
                                    }
                                    value={selectCategory}
                                    onChange={(e) => changeCategoryHandler(e)}
                                    onKeyPress={checkValue}
                                  />
                                  <div className="icon-input-align">
                                    <img
                                      src={DropdownIcon}
                                      alt="DropdownIcon"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={
                                    newCategoryDropDown
                                      ? "category-sub-menu-design category-sub-menu-design-hidden"
                                      : "category-sub-menu-design category-sub-menu-design-show"
                                  }
                                >
                                  {permission?.filter(
                                      (obj) =>
                                        obj.name === "Add new product/Brand/Category"
                                    )[0]?.isChecked === false ? null :
                                  <div
                                    className="category-sub-menu-option add-new-category-sticky category-color-change add-new-category-sticky"
                                    onClick={() => {
                                      setNewCategoryAdd(!newCategoryAdd);
                                      setCategoryName(selectCategory);
                                    }}
                                  >
                                    <span>Add new category</span>
                                  </div>}
                                  {sortedCategories.length > 0 &&
                                    sortedCategories
                                      .slice(0)
                                      .map((category) => {
                                        return (
                                          <div
                                            key={category._id}
                                            className="category-sub-menu-option"
                                            onClick={(e) => {
                                              setSelectCategory(
                                                category?.categoryName
                                              );
                                              setDisabled(true);
                                              setNewCategoryDropDown(
                                                !newCategoryDropDown
                                              );
                                            }}
                                          >
                                            <span>
                                              {category?.categoryName}
                                            </span>
                                          </div>
                                        );
                                      })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="input-grid-items">
                            {permission?.filter(
                              (obj) =>
                                obj.name === "Add new product/Brand/Category"
                            )[0]?.isChecked === false ? (
                              <div className="plus-icon-design">
                                <svg
                                  width="21"
                                  height="21"
                                  viewBox="0 0 21 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="0.5"
                                    y="9"
                                    width="20"
                                    height="2.5"
                                    rx="1.25"
                                    fill="#D1D9E6"
                                  />
                                  <rect
                                    x="9"
                                    y="20.5"
                                    width="20"
                                    height="2.5"
                                    rx="1.25"
                                    transform="rotate(-90 9 20.5)"
                                    fill="#D1D9E6"
                                  />
                                </svg>
                              </div>
                            ) : selectCategory ? (
                              <div className="plus-icon-design">
                                <svg
                                  width="21"
                                  height="21"
                                  viewBox="0 0 21 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="0.5"
                                    y="9"
                                    width="20"
                                    height="2.5"
                                    rx="1.25"
                                    fill="#D1D9E6"
                                  />
                                  <rect
                                    x="9"
                                    y="20.5"
                                    width="20"
                                    height="2.5"
                                    rx="1.25"
                                    transform="rotate(-90 9 20.5)"
                                    fill="#D1D9E6"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div
                                className="plus-icon-design plus-icon-color-change"
                                onClick={() => {
                                  setNewCategoryAdd(!newCategoryAdd);
                                  setCategoryName("");
                                }}
                              >
                                <svg
                                  width="21"
                                  height="21"
                                  viewBox="0 0 21 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="0.5"
                                    y="9"
                                    width="20"
                                    height="2.5"
                                    rx="1.25"
                                    fill="#D1D9E6"
                                  />
                                  <rect
                                    x="9"
                                    y="20.5"
                                    width="20"
                                    height="2.5"
                                    rx="1.25"
                                    transform="rotate(-90 9 20.5)"
                                    fill="#D1D9E6"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={
                            newCategoryAdd
                              ? "add-new-category-hidden"
                              : "add-new-category-show"
                          }
                        >
                          <div
                            className="add-new-category"
                            ref={createCategoryRef}
                          >
                            <div className="form-group">
                              <label>Add new category</label>
                              <input
                                type="text"
                                name="category"
                                placeholder="Type here"
                                value={categoryName}
                                onChange={(e) =>
                                  setCategoryName(e.target.value)
                                }
                                onKeyPress={checkValue}
                              />
                            </div>
                            <div className="product-slect-info-align">
                              <div className="button-alignment">
                                <button
                                  onClick={() => {
                                    setNewCategoryAdd(!newCategoryAdd);
                                    setNewCategoryDropDown(
                                      !newCategoryDropDown
                                    );
                                    setSelectCategory("");
                                  }}
                                >
                                  Select from the list
                                </button>
                                {categoryName ? (
                                  <button
                                    className="enabled-active-button"
                                    onClick={(e) => handleOnClick(e)}
                                  >
                                    Add category
                                  </button>
                                ) : (
                                  <button>Add category</button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          newBrandAdd
                            ? "input-grid form-top-align-space"
                            : "input-grid-hidden"
                        }
                      >
                        <div className="input-grid-items">
                          <div className="form-group">
                            <label>
                              Brand{" "}
                              <span style={{ color: "red" }}>
                                {" "}
                                *{" "}
                                {selectBrand?.trim() == "" && (
                                  <span
                                    style={{
                                      color: "red",
                                      top: "5px",
                                      fontSize: "10px",
                                    }}
                                  >
                                    {" "}
                                    {errors["brand"]}{" "}
                                  </span>
                                )}
                                {!brandId.length > 0 && (
                                  <span
                                    style={{
                                      color: "red",
                                      top: "5px",
                                      fontSize: "10px",
                                    }}
                                  >
                                    {" "}
                                    {errors["brand2"]}{" "}
                                  </span>
                                )}{" "}
                              </span>{" "}
                            </label>
                            <div
                              className="input-relative-icon"
                              ref={selectBrandRef}
                            >
                              <div
                                className="relative"
                                onClick={() =>
                                  setNewBrandDropDown(!newBrandDropDown)
                                }
                              >
                                <input
                                  type="search"
                                  placeholder={
                                    !newBrandDropDown
                                      ? "Type here"
                                      : "e.g., My Brand"
                                  }
                                  value={selectBrand}
                                  onChange={(e) => changeBrandHandler(e)}
                                  onKeyPress={checkValue}
                                />
                                <div className="icon-input-align">
                                  <img src={DropdownIcon} alt="DropdownIcon" />
                                </div>
                              </div>
                              <div
                                className={
                                  newBrandDropDown
                                    ? "category-sub-menu-design category-sub-menu-design-hidden"
                                    : "category-sub-menu-design category-sub-menu-design-show"
                                }
                              >
                                {permission?.filter(
                                    (obj) =>
                                      obj.name === "Add new product/Brand/Category"
                                  )[0]?.isChecked === false ? null : 
                                <div
                                  className="category-sub-menu-option category-color-change"
                                  onClick={() => {
                                    setNewBrandAdd(!newBrandAdd);
                                    setBrandName(selectBrand);
                                  }}
                                >
                                  <span>Add new brand</span>
                                </div>}
                                {sortedBrands.length > 0 &&
                                  sortedBrands.slice(0).map((brand) => {
                                    return (
                                      <div
                                        key={brand._d}
                                        className="category-sub-menu-option"
                                        onClick={(e) => {
                                          setSelectBrand(brand?.brandName);
                                          setDisabled(true);
                                          setNewBrandDropDown(
                                            !newBrandDropDown
                                          );
                                        }}
                                      >
                                        <span>{brand?.brandName}</span>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="input-grid-items">
                          {permission?.filter(
                            (obj) =>
                              obj.name === "Add new product/Brand/Category"
                          )[0]?.isChecked === false ? (
                            <div className="plus-icon-design">
                              <svg
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.5"
                                  y="9"
                                  width="20"
                                  height="2.5"
                                  rx="1.25"
                                  fill="#D1D9E6"
                                />
                                <rect
                                  x="9"
                                  y="20.5"
                                  width="20"
                                  height="2.5"
                                  rx="1.25"
                                  transform="rotate(-90 9 20.5)"
                                  fill="#D1D9E6"
                                />
                              </svg>
                            </div>
                          ) : selectBrand ? (
                            <div className="plus-icon-design">
                              <svg
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.5"
                                  y="9"
                                  width="20"
                                  height="2.5"
                                  rx="1.25"
                                  fill="#D1D9E6"
                                />
                                <rect
                                  x="9"
                                  y="20.5"
                                  width="20"
                                  height="2.5"
                                  rx="1.25"
                                  transform="rotate(-90 9 20.5)"
                                  fill="#D1D9E6"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div
                              className="plus-icon-design plus-icon-color-change"
                              onClick={() => {
                                setNewBrandAdd(!newBrandAdd);
                                setBrandName("");
                              }}
                            >
                              <svg
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.5"
                                  y="9"
                                  width="20"
                                  height="2.5"
                                  rx="1.25"
                                  fill="#D1D9E6"
                                />
                                <rect
                                  x="9"
                                  y="20.5"
                                  width="20"
                                  height="2.5"
                                  rx="1.25"
                                  transform="rotate(-90 9 20.5)"
                                  fill="#D1D9E6"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          newBrandAdd
                            ? "add-new-category-hidden"
                            : "add-new-category-show"
                        }
                      >
                        <div className="add-new-category" ref={createBrandRef}>
                          <div className="form-group">
                            <label>Add new brand</label>
                            <input
                              type="text"
                              name="brand"
                              placeholder="Type here"
                              value={brandName}
                              onChange={(e) => setBrandName(e.target.value)}
                              onKeyPress={checkValue}
                            />
                          </div>
                          <div className="product-slect-info-align">
                            <div className="button-alignment">
                              <button
                                onClick={() => {
                                  setNewBrandAdd(!newBrandAdd);
                                  setNewBrandDropDown(!newBrandDropDown);
                                  setSelectBrand("");
                                }}
                              >
                                Select from the list
                              </button>
                              {brandName ? (
                                <button
                                  className="enabled-active-button"
                                  onClick={(e) => clickHandler(e)}
                                >
                                  Add brand
                                </button>
                              ) : (
                                <button>Add brand</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="input-sub-grid form-top-align-space">
                        <div className="input-sub-grid-items">
                          <div className="form-group" ref={unitRef}>
                            <label>Unit </label>
                            <div className="dropdown-relative">
                              <div
                                className="relative"
                                onClick={() => setShowUnit(!showUnit)}
                              >
                                <input
                                  className="cursor-pointer"
                                  type="select"
                                  value={productData.unit}
                                />
                                <div className="arrow-alignment-dropdown">
                                  <img src={DropdownIcon} alt="DropdownIcon" />
                                </div>
                              </div>
                              <div
                                className={
                                  showUnit
                                    ? "option-select-dropdown-align option-select-dropdown-show"
                                    : "option-select-dropdown-hidden option-select-dropdown-align"
                                }
                              >
                                {unitList.map((unit) => {
                                  return (
                                    <div
                                      key={unit._id}
                                      className="option-list-style-cus"
                                      onClick={(e) =>
                                        mergeStateHandler(unit, "unit")
                                      }
                                    >
                                      <span>{unit.unit}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="input-sub-grid-items">
                          <div className="quantity-input">
                            <div>
                              <label>
                                Quantity per product
                                <span style={{ color: "red" }}> *</span>
                              </label>
                              <input
                                type="text"
                                name="quantity"
                                value={productData.quantity}
                                placeholder="Enter Quantity"
                                onWheel={() => document.activeElement.blur()}
                                onChange={(e) => handleOnChange(e)}
                                onKeyPress={bindInput}
                                maxLength="10"
                              />
                              <div className="mil-text-align">
                                <span>{productData.unit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isBarcode && (
                        <div className="form-group form-top-align-space">
                          <label>Product barcode</label>
                          <input
                            type="text"
                            name="barcode"
                            maxLength="16"
                            value={productData?.barcode?.toUpperCase()}
                            placeholder="123456789011"
                            onChange={(e) => handleOnChange(e)}
                            onKeyPress={checkValueNoSpace}
                          />
                        </div>
                      )}
                      <div className="form-group form-top-align-space">
                        <label>HSN</label>
                        <input
                          type="text"
                          name="hsn"
                          value={productData.hsn}
                          placeholder="2210.10.10"
                          onWheel={() => document.activeElement.blur()}
                          onChange={(e) => handleOnChange(e)}
                          onKeyPress={bindMultiPointInput}
                          maxLength="10"
                        />
                      </div>
                      {productTypeSetting === "Store Consumable & Retail" && (
                        <div
                          className="form-group form-top-align-space"
                          ref={productTypeRef}
                        >
                          <label>Product type </label>
                          <div className="dropdown-relative relative">
                            <div
                              className="relative"
                              onClick={() => setShowProduct(!showProduct)}
                            >
                              <input
                                type="select"
                                value={productData.productType}
                              />
                              <div className="arrow-alignment-dropdown">
                                <img src={DropdownIcon} alt="DropdownIcon" />
                              </div>
                            </div>
                            <div
                              className={
                                showProduct
                                  ? "option-select-dropdown-align option-select-dropdown-show"
                                  : "option-select-dropdown-hidden option-select-dropdown-align"
                              }
                            >
                              {productTypeList.map((productType) => {
                                return (
                                  <div
                                    key={productType._id}
                                    className="option-list-style-cus"
                                    onClick={() =>
                                      mergeStateHandler(
                                        productType,
                                        "productType"
                                      )
                                    }
                                  >
                                    <span>{productType}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="form-group form-top-align-space">
                        <label>Product description</label>
                        <textarea
                          name="productDescription"
                          rows="3"
                          cols="50"
                          value={productData.productDescription}
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Price</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-alignment">
                      <div className="form-group">
                        <label>
                          Retail price
                          <span style={{ color: "red" }}> *</span>
                        </label>
                        <div className="dropdown-relative">
                          <input
                            type="text"
                            name="retailPrice"
                            value={productData.retailPrice}
                            placeholder="Enter MRP"
                            onWheel={() => document.activeElement.blur()}
                            onChange={(e) => handleOnChange(e)}
                            onKeyPress={bindInput}
                            maxLength="10"
                          />
                          <div className="down-arrow-align">
                            <span className="roboto-font">{SettingInfo?.currentType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="discount-input-grid form-top-align-space">
                        <div className="discount-input-grid-items">
                          <label>
                            Discount{" "}
                            {+productData?.discount >
                              +productData?.retailPrice &&
                              productData?.discountType === SettingInfo?.currentType && (
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {errors["discountRupee"]}
                                </span>
                              )}
                            {+productData?.discount > 100 &&
                              productData?.discountType === "%" && (
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {errors["discountPercentage"]}
                                </span>
                              )}
                          </label>
                          <input
                            type="number"
                            name="discount"
                            value={productData.discount}
                            placeholder="Enter Discount"
                            onWheel={() => document.activeElement.blur()}
                            onChange={(e) => handleOnChange(e)}
                          />
                        </div>
                        <div
                          className="discount-input-grid-items"
                          ref={discountTypeRef}
                        >
                          <div
                            className="amount-box"
                            onClick={() => setAmountMenu(!amountMenu)}
                          >
                            <span>{productData.discountType}</span>
                            <img src={DropdownIcon} alt="DropdownIcon" />
                          </div>
                          <div
                            className={
                              amountMenu
                                ? "amount-menu-design amount-menu-design-hidden"
                                : "amount-menu-design amount-menu-design-show"
                            }
                          >
                            <div className="menu-design">
                              {discountTypeList?.map((discountType) => {
                                return (
                                  <div
                                    key={discountType?._id}
                                    className="list-style"
                                    onClick={() =>
                                      mergeStateHandler(
                                        discountType,
                                        "discountType"
                                      )
                                    }
                                  >
                                    <span className="roboto-font">
                                      {discountType}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group form-top-align-space">
                        <label>
                          Discounted price
                          {+productData?.discountPrice >
                            +productData?.retailPrice && (
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "10px",
                              }}
                            >
                              {errors["discountPrice"]}
                            </span>
                          )}
                        </label>
                        <div className="dropdown-relative">
                          <input
                            type="number"
                            name="discountPrice"
                            value={productData.discountPrice}
                            onChange={(e) =>
                              mergeStateHandler(e.target.value, "discountPrice")
                            }
                            onWheel={() => document.activeElement.blur()}
                            placeholder="Enter flat discounted price"
                          />
                          <div className="down-arrow-align">
                            <span className="roboto-font">{SettingInfo?.currentType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group form-top-align-space">
                        <label>Purchase price</label>
                        <div className="dropdown-relative">
                          <input
                            type="text"
                            name="purchasePrice"
                            value={productData.purchasePrice}
                            placeholder="Enter purchase price"
                            onWheel={() => document.activeElement.blur()}
                            onChange={(e) => handleOnChange(e)}
                            onKeyPress={bindInput}
                            maxLength="10"
                          />
                          <div className="down-arrow-align">
                            <span className="roboto-font">{SettingInfo?.currentType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {productTax && (
                <div className="box-center">
                  <div className="product-info-box">
                    <div className="heading-style">
                      <h3>Tax</h3>
                    </div>
                    <div className="card-details">
                      <div className="form-alignment">
                        <div className="form-group" ref={texRef}>
                          <label>Tax</label>
                          <div className="dropdown-relative relative">
                            <div
                              className="relative"
                              onClick={() => setShowTax(!showTax)}
                            >
                              <input
                                type="text"
                                placeholder=" Enter tax slabs"
                                value={availlist}
                              />
                              <div className="arrow-alignment-dropdown">
                                <img src={DropdownIcon} alt="DropdownIcon" />
                              </div>
                            </div>
                            <div
                              className={
                                showTax
                                  ? "option-select-dropdown-align option-select-dropdown-show"
                                  : "option-select-dropdown-hidden option-select-dropdown-align"
                              }
                            >
                              {taxList.map((tax, i) => {
                                return (
                                  <div
                                    key={tax._id}
                                    className="option-list-style-cus checkbox-design-change"
                                    // onClick={() => {
                                    //   mergeStateHandler(tax, "tax");
                                    // }}
                                  >
                                    <input
                                      type="checkbox"
                                      name="name"
                                      id="id"
                                      value={tax}
                                      checked={
                                        availlist.includes(tax) ? true : false
                                      }
                                      onChange={(e) => multipleTaxSlabs(e)}
                                    />
                                    <span>{tax}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        {/* <div
                          className="form-group form-top-align-space"
                          ref={texTypeRef}
                        >
                          <label>Tax type</label>
                          <div className="dropdown-relative relative">
                            <div
                              className="relative"
                              onClick={() => setShowTaxType(!showTaxType)}
                            >
                              <input
                                type="select"
                                placeholder="Enter tax type"
                                value={productData.taxType}
                              />
                              <div className="arrow-alignment-dropdown">
                                <img src={DropdownIcon} alt="DropdownIcon" />
                              </div>
                            </div>
                            <div
                              className={
                                showTaxType
                                  ? "option-select-dropdown-align option-select-dropdown-show"
                                  : "option-select-dropdown-hidden option-select-dropdown-align"
                              }
                            >
                              {taxTypeList.map((taxType) => {
                                return (
                                  <div
                                    className="option-list-style-cus"
                                    onClick={() =>
                                      mergeStateHandler(taxType, "taxType")
                                    }
                                  >
                                    <span>{taxType}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="box-center">
                <div className="product-info-box">
                  <div className="heading-style">
                    <h3>Stock</h3>
                  </div>
                  <div className="card-details">
                    <div className="form-alignment">
                      {productData.productType === "Store Consumable" ||
                      editProduct ? null : (
                        <div className="form-group">
                          <label>Initial stock (Retail)</label>
                          <input
                            type="text"
                            name="retailInitialStock"
                            value={productData.retailInitialStock}
                            placeholder="Number of product store has"
                            onWheel={() => document.activeElement.blur()}
                            onChange={(e) => handleOnChange(e)}
                            onKeyPress={bindInput}
                            maxLength="4"
                          />
                        </div>
                      )}
                      {productData.productType === "Store Consumable" ? null : (
                        <div className="form-group form-top-align-space">
                          <label>Alert quantity (Retail)</label>
                          <input
                            type="text"
                            name="retailAlertQuantity"
                            value={productData.retailAlertQuantity}
                            placeholder="Minimum number of products requied in store"
                            onWheel={() => document.activeElement.blur()}
                            onChange={(e) => handleOnChange(e)}
                            onKeyPress={bindInput}
                            maxLength="4"
                          />
                        </div>
                      )}
                      {productData.productType === "Retail" ||
                      editProduct ? null : (
                        <div className="form-group form-top-align-space">
                          <label>Initial stock (Store consumption)</label>
                          <input
                            type="text"
                            name="storeInitialStock"
                            value={productData.storeInitialStock}
                            placeholder="Number of product store has"
                            onWheel={() => document.activeElement.blur()}
                            onChange={(e) => handleOnChange(e)}
                            onKeyPress={bindInput}
                            maxLength="4"
                          />
                        </div>
                      )}
                      {productData.productType === "Retail" ? null : (
                        <div className="form-group form-top-align-space">
                          <label>Alert quantity (Store consumption)</label>
                          <input
                            type="text"
                            name="storeAlertQuantity"
                            value={productData.storeAlertQuantity}
                            placeholder="Minimum number of products requied in store"
                            onWheel={() => document.activeElement.blur()}
                            onChange={(e) => handleOnChange(e)}
                            onKeyPress={bindInput}
                            maxLength="4"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal body */}
      </div>
      {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
    </>
  );
}
