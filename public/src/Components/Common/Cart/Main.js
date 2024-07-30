import React, { useState, useEffect } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import ServiceIcon from "../../../assets/svg/mini.png";
import RightIcon from "../../../assets/svg/right.svg";
import SearchIcon from "../../../assets/svg/search-icon.svg";
import Basket from "./Basket";
import BackArrowProduct from "../../../assets/svg/Group.svg"; //select product
// import '../Modal/Modal.scss';
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { prepareDataForValidation } from "formik";
import HandleProductNavigation from "../Modal/HandleProductNavigation";
import useRoveFocus from "../Modal/UseRoveFocus";
import { get_Setting } from "../../../utils/user.util";

export default function Main(props) {
  const {
    onAdd,
    products,
    onRemove,
    BackProductToSelectItem,
    Continue,
    cartItems,
    ValidationMsg,
    productt,
    SettingInfo
  } = props;

  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [allProduct, setAllProduct] = useState();
  const [allCompanyProduct, setAllCompanyProduct] = useState();
  const [loading, setLoading] = useState(false);
  const [searchword, setSearchword] = useState();
  const [focus, setFocus] = useRoveFocus(allProduct?.length);
  const [productTax, setProductTax] = useState(false);
  const newArrayOfObj = allProduct?.map(
    ({
      _id: productId,
      unit: productUnit,
      retailPrice: productPrice,
      quantity: productquantity,
      ...rest
    }) => ({
      productId,
      productUnit,
      productPrice,
      productquantity,
      ...rest,
    })
  );

  const invoiceProducts = newArrayOfObj?.map((item) => {
    return {
      productId: item.productId,
      productName: item.productName,
      productPrice: parseInt(item.productPrice, 10),
      productUnit: item.productUnit,
      productquantity: parseInt(item.productquantity, 10),
      discountedPrice: parseInt(item.discountPrice, 10),
      flatdiscountedSubTotal: parseInt(item.discountPrice, 10),
      productgst: productTax ? parseFloat(item.totalTax, 10) : 0,
      productDiscount:
        parseInt(item.productPrice, 10) - parseInt(item.discountPrice, 10),
      total: parseInt(item.stockArray[item.stockArray.length - 1].total, 10),
      retailStock:  parseInt(item.stockArray[item.stockArray.length - 1].totalRetailInitialStock, 10),
      discountedPriceGstAmount: item.tax
        ? productTax
          ? (parseInt(item.discountPrice, 10) *
              parseFloat(item.totalTax, 10).toFixed(2)) /
            100
          : 0
        : 0,
      discountedPriceWithGstAmount:
        parseInt(item.discountPrice, 10) +
        (item.tax
          ? productTax
            ? (parseInt(item.discountPrice, 10) *
                parseFloat(item.totalTax, 10).toFixed(2)) /
              100
            : 0
          : 0),
    };
  });

  useEffect(() => {
    ApiGet("product/company/" + userInfo.companyId).then((resp) => {
      setAllProduct(resp.data.data);
    });
  }, []);

  useEffect(() => {
    getAllProduct();
    getStoreSetting();
  }, []);

  const getStoreSetting = async (values) => {
    const SettingData = get_Setting()
    setProductTax(SettingData?.tax?.productTax);
    
    // try {
    //   let res = await ApiGet("setting/company/" + userInfo.companyId);
    //   if (res.data.status === 200) {
    //     setProductTax(res?.data?.data[0]?.tax.productTax);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const getAllProduct = async (e) => {
    try {
      setLoading(true);
      let res = await ApiGet("product/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setAllCompanyProduct(res.data.data);
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Producrts", err);
    }
  };

  const handleProductSearch = async (e) => {
    setSearchword(e.target.value);
    var productData =
      allCompanyProduct?.length > 0 &&
      allCompanyProduct?.filter(
        (obj) =>
          (obj?.productName &&
          obj?.productName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          (obj?.discountPrice &&
            obj?.discountPrice.toString().includes(e.target.value.toString()))
          )
      );
    if (e.target.value === "") {
      ApiGet("product/company/" + userInfo.companyId).then((resp) => {
        setAllProduct(resp.data.data);
      });
    } else {
      if(productData?.length > 0){
      setAllProduct(productData);
      }else{
        setAllProduct([]);
      }
    }
  };

  const BackTOSelectItem = () => {
    props.BackProductToSelectItem();
  };

  return (
    <div className="product-service-grid-items">
      <div className="product-service-box-design">
        <div onClick={BackTOSelectItem} className="back-arrow-alignment">
          <img src={BackArrowProduct} alt="UserAdd" />
        </div>
        <h3>Select a Product</h3>
        <div className="select-service-search space-remove-search">
          <input
            type="search"
            name="q"
            placeholder="Search product name"
            onChange={(e) => {
              handleProductSearch(e);
            }}
            autoFocus
          />
          <div className="search-icon-align">
            <img src={SearchIcon} alt="SearchIcon" />
          </div>
        </div>
        <div className="product-details-grid-height">
          {invoiceProducts?.length > 0 ? (
            invoiceProducts?.map((prd, index) => {
              return (
                <div className="product-details-grid" key={prd._id}>
                  <div className="product-details-grid-items">
                    <p>{prd.productName}</p>
                    <div className="child-alignment">
                      <span>
                        {prd.productquantity
                          ? prd.productquantity + " " + prd.productUnit + " • "
                          : ""}
                      </span>
                      <p>
                        <del>
                          {" "}
                          <a>{SettingInfo?.currentType} </a> {prd.productPrice}
                        </del>
                        <a> {SettingInfo?.currentType}</a> {prd.discountedPrice}
                      </p>
                    </div>
                  </div>
                  {products?.length > 0 ? (
                    products.some(
                      (product) => product.productId === prd.productId
                    ) ? (
                      <div className="product-button-counter">
                        <button>
                          <span onClick={() => onRemove(prd)}>-</span>
                          {products.map((prod) => {
                            return prod.productId === prd.productId
                              ? prod.productCount
                              : null;
                          })}
                          {products.map((prod) => {
                            return prod.productId === prd.productId ? (
                              prod.finalproduct >= prd.total ? (
                                <span
                                  key={prod._id}
                                  onClick={() => ValidationMsg()}
                                >
                                  +
                                </span>
                              ) : (
                                <span key={prod._id} onClick={() => onAdd(prd)}>
                                  +
                                </span>
                              )
                            ) : null;
                          })}
                        </button>
                      </div>
                    ) : prd.total !== 0 ? (
                      <div className="product-details-grid-items">
                        <button onClick={() => onAdd(prd)}>ADD</button>
                      </div>
                    ) : (
                      <div className="product-details-grid-items">
                        <button onClick={() => ValidationMsg()}>ADD</button>
                      </div>
                    )
                  ) : prd.total !== 0 ? (
                    <div className="product-details-grid-items">
                      <button onClick={() => onAdd(prd)}>ADD</button>
                    </div>
                  ) : (
                    <div className="product-details-grid-items">
                      <button onClick={() => ValidationMsg()}>ADD</button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="system-does-not text-center font-medium heading-title-text-color">
              <p>System does not have this product data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
