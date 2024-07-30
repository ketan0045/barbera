import React, { useState, useEffect } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import ProductsImages from "../../../assets/svg/Products-images.svg";
import DeleteIcon from "../../../assets/svg/Delete-icon.png";
import Delete from "../../Common/Toaster/Delete";
import AddStock from "./AddStock";
import Modal from "../../Common/Modal/Modal";
import { ApiGet } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import Success from "../Toaster/Success/Success";
import CustomModal from "./CustomModal";
import ViewHistoryModal from "./ViewHistoryModal";
import TransferModal from "./TransferModal";

export default function ProductModalInfo(props) {
  const { getProducts, toggle, SettingInfo, permission } = props;
  const [productDetails, setProductDetails] = useState(props.productDetails);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addStock, setAddStock] = useState(false);
  const [manageStock, setManageStock] = useState("");
  const [deleteProductId, setDeleteProductId] = useState();
  const [openInventoryModal, setOpenInventoryModal] = useState(false);
  const [editProduct, setEditProduct] = useState();
  const [object, setObject] = useState();
  const [historyOf, setHistoryOf] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [er, setEr] = useState();
  const userInfo = Auth.getUserDetail();

  const AddnewInventoryModal = () => {
    AddnewInventoryModaltoggle();
  };
  const AddnewInventoryModaltoggle = (data) => {
    setOpenInventoryModal(!openInventoryModal);
    if (openInventoryModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Changes saved!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const tax = productDetails?.tax ? productDetails?.tax : null;
  // const tax = productDetails?.tax ? Object.values(productDetails?.tax) : null;
  const productType = productDetails?.productType;

  const isCloseHandler = async (data) => {
    setOpenInventoryModal(data);
    setEditProduct(data);
    getProducts();
    let res = await ApiGet("product/company/" + userInfo.companyId);

    try {
      if (res.data.status === 200) {
        const resp = res.data.data;
        const filter = resp.filter((rep) => rep._id === productDetails._id);
        setProductDetails(filter[0]);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catchs");
    }
  };

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);
    if (deleteModal === true) {
      if (data === 200) {
        setSuccess(true);
        setToastmsg("Record deleted!");
      }
    }
  };

  const OpenAddStockModal = () => {
    AddStockModaltoggle();
  };
  const AddStockModaltoggle = (data) => {
    setAddStock(!addStock);
    if (addStock === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Stock added!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openCustomModal, setOpenCustomModal] = useState(false);

  const toggleModal = (e, data) => {
    setOpenModal(!openModal);
    if (openModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Stock transferred!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong!");
        }
      }
    }
  };
  const openHistoryModal = () => {
    setOpenHistory(!openHistory);
  };
  const handleMangeStockToggle = (e, key, data) => {
    if (key === "add") {
      setManageStock("Add");
    }
    if (key === "remove") {
      setManageStock("Remove");
    }
    setOpenCustomModal(!openCustomModal);
    if (openCustomModal === true) {
      if (data === 200) {
        if (key === "Add") {
          setSuccess(true);
          setToastmsg("Stock added!");
        } else if (key === "Remove") {
          setSuccess(true);
          setToastmsg("Stock Removed!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });
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
                  <h2>Product info</h2>
                </div>
              </div>
              {permission?.filter(
                (obj) => obj.name === "Edit/delete products, brands, and categories"
              )[0]?.isChecked === false ? null : (
                <div className="product-edit-delete-button-align">
                  <div
                    className="delete-button-style"
                    onClick={() => {
                      opendeleteModal();
                      setDeleteProductId(productDetails._id);
                    }}
                  >
                    <img src={DeleteIcon} alt="DeleteIcon" />
                  </div>
                  <div
                    className="edit-product-button"
                    onClick={() => {
                      AddnewInventoryModaltoggle((e) => !e);
                      setEditProduct(productDetails);
                    }}
                  >
                    <button>Edit product</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="product-modal-left-right-align">
            <div className="modal-body-top-align">
              <div className="product-info-grid">
                <div className="product-info-grid-items">
                  <div className="child-box">
                    <div className="product-amount">
                      <h2>
                        <span>{SettingInfo?.currentType}</span>{" "}
                        {parseInt(productDetails?.discountPrice)}
                      </h2>
                      <p>Final retail price</p>
                    </div>
                    <div className="product-details">
                      <div className="title-text">
                        <h6>Pricing</h6>
                      </div>
                      <div className="details-amount-alignment">
                        <p>Retail price</p>
                        <h6>
                          <span>{SettingInfo?.currentType}</span> {productDetails?.retailPrice}
                        </h6>
                      </div>
                      <div className="details-amount-alignment">
                        <p>Discount allowed</p>
                        <h6>
                          <span>{productDetails?.discountType}</span> {productDetails?.discount}
                        </h6>
                      </div>
                      <div className="details-amount-alignment">
                        <p>Purchase price</p>
                        <h6>
                          <span>{SettingInfo?.currentType}</span> {productDetails?.purchasePrice}
                        </h6>
                      </div>
                    </div>
                    <div className="product-divider"></div>
                    <div className="product-text">
                      <div className="title-text">
                        <h6>Tax</h6>
                      </div>

                      <div className="details-amount-alignment">
                        <p>Tax</p>
                        <h6>
                          {tax?.length > 0 && tax?.reduce((prev, curr) => [prev, ", ", curr])}
                        </h6>
                      </div>
                      <div className="details-amount-alignment bottom-type-remove">
                        <p>Tax type</p>
                        <h6>{productDetails?.taxType}</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product-info-grid-items">
                  <div className="child-box child-box-align">
                    <div className="intense-text">
                      <h2>{productDetails?.productName}</h2>
                      <p>Product info</p>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>Brand</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.brandId?.brandName}</p>
                        </div>
                      </div>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>Category</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.categoryId?.categoryName}</p>
                        </div>
                      </div>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>Barcode</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.barcode}</p>
                        </div>
                      </div>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>HSN</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.hsn}</p>
                        </div>
                      </div>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>Unit</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.unit}</p>
                        </div>
                      </div>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>Quantity per unit</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.quantity}</p>
                        </div>
                      </div>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>Product type</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.productType}</p>
                        </div>
                      </div>
                      <div className="product-grid">
                        <div className="product-grid-items">
                          <span>Product description</span>
                        </div>
                        <div className="product-grid-items">
                          <p>{productDetails?.productDescription}</p>
                        </div>
                      </div>
                      <div>
                        <div className="product-image-upload-alignment">
                          <p>Product photos</p>
                          <span>
                            <i>Comming Soon</i>
                          </span>
                        </div>
                        <div className="product-images-box">
                          <img src={ProductsImages} alt="ProductsImages" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product-info-grid-items">
                  <div className="child-box">
                    <div className="product-amount">
                      <div className="amount-wrapper">
                        <div className="stock-btn">
                          {permission?.filter((obj) => obj.name === "Add stock")[0]?.isChecked ===
                          false ? null : (
                            <button
                              type="button"
                              className="stock-sign"
                              onClick={(e) => handleMangeStockToggle(e, "remove")}
                            >
                              -
                            </button>
                          )}
                        </div>
                        <h2> {productDetails?.stockArray?.slice(-1)[0].total} </h2>
                        <div className="stock-btn">
                          {permission?.filter((obj) => obj.name === "Add stock")[0]?.isChecked ===
                          false ? null : (
                            <button
                              type="button"
                              className="stock-sign"
                              onClick={(e) => handleMangeStockToggle(e, "add")}
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                      <p>Stock in hand</p>
                    </div>
                    {productType === "Store Consumable" ? null : (
                      <div className="product-details">
                        <div className="title-text">
                          <h6>Retail</h6>
                          {permission?.filter((obj) => obj.name === "Stock history")[0]?.isChecked === false ? null : 
                          <span
                            // onClick={() => {
                            //   OpenAddStockModal();
                            //   setObject("Retail");
                            // }}
                            onClick={(e) => {
                              setHistoryOf("Retail");
                              openHistoryModal();
                            }}
                          >
                            View history
                            {/* Add stock */}
                          </span>}
                        </div>
                        <div className="details-amount-alignment">
                          <p>Stock in hand</p>
                          <h6>
                            {productDetails?.stockArray?.slice(-1)[0].totalRetailInitialStock}
                          </h6>
                        </div>
                        <div className="details-amount-alignment">
                          <p>Alert quantity</p>
                          <h6>{productDetails?.retailAlertQuantity}</h6>
                        </div>
                      </div>
                    )}
                    {productType === "Retail" ? null : (
                      <>
                        <div className="product-divider"></div>
                        <div className="product-text">
                          <div className="title-text">
                            <h6>Store consumption</h6>
                            {permission?.filter((obj) => obj.name === "Stock history")[0]?.isChecked === false ? null : 
                            <span
                              style={{ cursor: "pointer" }}
                              // onClick={() => {
                              //   OpenAddStockModal();
                              //   setObject();
                              // }}
                              onClick={(e) => {
                                setHistoryOf("Store consumption");
                                openHistoryModal();
                              }}
                            >
                              View history
                              {/* Add stock */}
                            </span>}
                          </div>
                          <div className="details-amount-alignment">
                            <p>Stock in hand</p>
                            <h6>
                              {productDetails?.stockArray?.slice(-1)[0].totalStoreInitialStock}
                            </h6>
                          </div>
                          <div className="details-amount-alignment">
                            <p>Alert quantity</p>
                            <h6>{productDetails?.storeAlertQuantity}</h6>
                          </div>
                        </div>
                      </>
                    )}
                    {productDetails?.productType === "Store Consumable & Retail" &&
                      (permission?.filter((obj) => obj.name === "Add stock")[0]?.isChecked ===
                      false ? null : (
                        <>
                          <div className="product-divider"></div>
                          <div className="product-text product-text-new-alignment-modal">
                            <button className="custom-btn" onClick={toggleModal}>
                              Transfer stock
                            </button>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {openCustomModal && (
            <CustomModal
              togglecustom={handleMangeStockToggle}
              manageStock={manageStock}
              getProducts={getProducts}
              productDetails={productDetails}
              userInfo={userInfo}
              close={isCloseHandler}
            />
          )}
          {/* <ViewHistoryModal /> */}
          {openHistory && (
            <ViewHistoryModal
              toggleme={openHistoryModal}
              historyOf={historyOf}
              productDetails={productDetails}
              userInfo={userInfo}
              SettingInfo={SettingInfo}
            />
          )}
          {openModal && (
            <TransferModal
              toggle={toggleModal}
              productDetails={productDetails}
              getProducts={getProducts}
              userInfo={userInfo}
              close={isCloseHandler}
            />
          )}
        </div>
      </div>
      {openInventoryModal && (
        <Modal
          modal={openInventoryModal}
          toggle={AddnewInventoryModaltoggle}
          close={isCloseHandler}
          permission={permission}
          editProduct={editProduct}
          SettingInfo={SettingInfo}
        />
      )}
      {deleteModal && (
        <Delete
          modal={deleteModal}
          toggle={deleteModaltoggle}
          deleteProductId={deleteProductId}
          toggler={toggle}
          getProducts={getProducts}
        />
      )}
      {addStock && (
        <AddStock
          modal={addStock}
          toggle={AddStockModaltoggle}
          object={object}
          productDetails={productDetails}
          getProducts={getProducts}
          close={isCloseHandler}
        />
      )}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
    </>
  );
}
