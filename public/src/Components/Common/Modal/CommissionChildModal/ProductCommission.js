import React, { useEffect, useState } from "react";
import OutsideAlerter from "../../OutsideAlerter";
import DownIcon from "../../../../assets/img/gray-down.svg";
import CloseIcon from "../../../../assets/svg/Close.svg";
import "./ProductCommission.scss";
import { ApiGet } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";

function ProductCommission(props) {
  const { productCommissionCallback, editProductCommission, setDisabled, key, commissionFlow } =
    props;

  const userInfo = Auth.getUserDetail();

  const [commissionOn, setCommissionOn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [productCommission, setProductCommission] = useState({
    value: "All products",
    commission: "",
  });

  //filter for comparision
  const selectedBrands = brands?.length > 0 && brands?.filter((item) => item.isSelected === true);
  const brandCommission =
    selectedBrands?.length > 0 &&
    selectedBrands?.filter((item) => item.commission !== "" && item.commission?.toString() <= 100);

  //input binder
  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9.]*$");
    var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  //get brands
  const getAllBrands = async () => {
    let res = await ApiGet("ibrand/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setBrandList(res.data.data);
        if (commissionFlow === "edit") {
          setProductCommission({
            value: editProductCommission?.value,
            commission: editProductCommission?.commission[0]?.commission,
          });
          let response = res.data.data?.map((item) => {
            let received = editProductCommission?.commission?.find(
              (obj) => obj?.brandId === item?._id
            );
            return {
              ...item,
              commission: received ? received?.commission : "",
              isSelected: received ? true : false,
            };
          });
          setBrands(response);
        } else {
          let baseResponse = res.data.data?.map((item) => {
            return {
              ...item,
              commission: "",
              isSelected: false,
            };
          });
          setBrands(baseResponse);
        }
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  //get products
  const getProducts = async (e) => {
    let res = await ApiGet("product/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setProducts(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  //option select
  const handleOnClick = (e, key) => {
    if (key === "selection") {
      setProductCommission({
        ...productCommission,
        value: e.target.id,
        commission: "",
      });
      setCommissionOn(false);
      if (commissionFlow === "edit") {
        let baseResponse = brandList?.map((item) => {
          return {
            ...item,
            commission: "",
            isSelected: false,
          };
        });
        setBrands(baseResponse);
      }
    } else if (key === "close") {
      setOpenModal(!openModal);
    }
  };

  //commission for all product
  const handleOnChange = (e) => {
    setProductCommission({
      ...productCommission,
      commission: e.target.value
        .toString()
        .split(".")
        .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
        .join("."),
    });
  };

  //brand modal selection
  const handleOnSelection = (e, index, key) => {
    let data = brands;
    if (key === "checkbox") {
      if (e.target.checked) {
        data[index].isSelected = true;
      } else {
        data[index].isSelected = false;
      }
    } else if (key === "input") {
      data[index].commission = e.target.value
        .toString()
        .split(".")
        .map((el, i) => (i ? el.split("").slice(0, 2).join("") : el))
        .join(".");
    }
    setBrands([...data]);
  };

  useEffect(() => {
    getProducts();
    getAllBrands();
  }, []);

  useEffect(async () => {
    //final product commission details
    let commission;

    //all products
    let allProducts = products.map((item) => {
      return { productId: item._id, commission: productCommission.commission };
    });

    //selected products
    var result = products?.filter((o1) => {
      let data =
        selectedBrands.length > 0 &&
        selectedBrands?.filter((o2) => {
          return o1.brandId._id === o2._id; // return the ones with equal id
        });
      return data.length > 0;
    });

    let selectedProducts = result?.map((rep) => {
      let data = selectedBrands?.find((brand) => brand._id === rep.brandId?._id);
      return { productId: rep._id, brandId: data?._id, commission: data?.commission };
    });

    let filteredProducts = selectedProducts?.filter((obj) => obj.commission);

    if (productCommission.value === "All products") {
      commission = {
        value: productCommission.value,
        commission: allProducts,
      };
    } else if (productCommission.value === "Selective brands") {
      commission = {
        value: productCommission.value,
        commission: filteredProducts.length > 0 ? filteredProducts : [],
      };
    }
    if (!key) {
      setDisabled(
        selectedBrands.length !== brandCommission.length &&
          (productCommission.commission === "" || productCommission.commission?.toString() > 100)
      );
    } else {
      setDisabled(false);
    }
    await productCommissionCallback(commission);
  }, [productCommission, brands, products]);

  return (
    <div>
      <div>
        <div className="service-commission-body">
          <div className="input-bottom-alignment">
            <div className="relative-input-cus">
              <div className="lable-alignment">
                <div>
                  <label>Commission on</label>
                </div>
              </div>
              <div className="reltive-div">
                <OutsideAlerter setCommissionOn={setCommissionOn}>
                  <div
                    className="icon-inputr-relative"
                    onClick={() => setCommissionOn(!commissionOn)}
                  >
                    <input type="text" value={productCommission.value} />
                    <div className="down-icon-alignment">
                      <img src={DownIcon} alt="DownIcon" />
                    </div>
                  </div>
                  <div
                    className={
                      commissionOn ? "cus-dropdown dropdown-show" : "cus-dropdown dropdown-hidden"
                    }
                  >
                    <div className="cus-dropdown-design">
                      <ul onClick={(e) => handleOnClick(e, "selection")}>
                        <li id="All products">
                          <b id="All products">All products</b>
                        </li>
                        <li id="Selective brands">
                          <b id="Selective brands">Selective brands</b>
                        </li>
                      </ul>
                    </div>
                  </div>
                </OutsideAlerter>
              </div>
            </div>
          </div>

          {productCommission.value === "Selective brands" ? (
            <div className="input-bottom-alignment">
              <div className="reltive-div" onClick={(e) => setOpenModal(!openModal)}>
                <div className="icon-inputr-relative">
                  <input
                    type="text"
                    className="selected-input"
                    placeholder="0 selected brands"
                    value={`${selectedBrands.length || 0} selected brands`}
                  />
                </div>

                <div className="down-icon-alignment">
                  <span>{selectedBrands.length > 0 ? "Edit" : "Add"} brands</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="input-bottom-alignment">
              <div className="relative-input-cus">
                <div className="lable-alignment">
                  <div>
                    <label>Commission %</label>
                  </div>
                </div>
              </div>
              <div className="reltive-div">
                <div className="icon-inputr-relative">
                  {/* <div className="input-width-big"> */}
                  <input
                    type="text"
                    placeholder="Enter Value"
                    value={productCommission.commission}
                    onChange={(e) => handleOnChange(e)}
                    maxLength="5"
                    onKeyPress={bindInput}
                  />
                  {/* </div> */}
                  {/* <div className="input-width-small">
                    <input type="text" placeholder="%" />
                    <div className="down-icon-alignment">
                      <img src={DownIcon} alt="DownIcon" />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* brand selection modal */}
        {openModal && (
          <div>
            <div className="comission-modal-wrapper">
              <div className="add-comission-modal-sm">
                <div className="comission-header">
                  <div className="comission-header-alignment">
                    <div>
                      <div onClick={(e) => handleOnClick(e, "close")}>
                        <img src={CloseIcon} alt="close" />
                      </div>
                      <div>
                        <h1>Product commission: Brands</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="comission-body">
                  <div className="input-bottom-alignment">
                    {brands?.length > 0 ? (
                      brands?.map((brand, index) => {
                        return (
                          <div className="product-commission-padding">
                            <div className="product-commission-display-flex">
                              <div className="product-commission-checkbox-display">
                                <div className="checkbox-design">
                                  <input
                                    type="checkbox"
                                    className="checkbox-design"
                                    checked={brand?.isSelected}
                                    onChange={(e) => handleOnSelection(e, index, "checkbox")}
                                  />
                                </div>
                                <div className="checkbox-label-font-style">
                                  <span>{brand?.brandName}</span>
                                </div>
                              </div>

                              <div className="product-commission-input-position">
                                <input
                                  type="text"
                                  placeholder="Enter value"
                                  maxLength="5"
                                  value={brand?.commission}
                                  onChange={(e) => handleOnSelection(e, index, "input")}
                                  onKeyPress={bindInput}
                                />
                                <div className="product-commission-percentage-display">
                                  <span>%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="system-does-not">
                        <p className="text-center">No brands added so far</p>
                      </div>
                    )}
                    <div className="product-button-aligment-padding">
                      <div className="product-button-display-end">
                        <button
                          disabled={selectedBrands.length !== brandCommission.length}
                          onClick={() => setOpenModal(false)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* brand selection modal */}
      </div>
    </div>
  );
}

export default ProductCommission;
