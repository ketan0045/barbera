import React, { useState } from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";
import "./Modal.scss";
import Auth from "../../../helpers/Auth";

export default function AddStock(props) {
  const { modal, object, productDetails, getProducts, toggle, close } = props;
  const [addRetailStock, setAddRetailStock] = useState();
  const [addStoreStock, setAddStoreStock] = useState();
  const userInfo = Auth.getUserDetail();

  const stockHandler = async (e) => {
    const body = {
      productId: productDetails._id,
      retailInitialStock: addRetailStock,
      storeInitialStock: addStoreStock,
      type: "CR",
      companyId: userInfo.companyId,
    };
    let res = await ApiPost("stock/", body);
    try {
      toggle(res.data.status);
      getProducts();
    } catch (err) {
      toggle(err);
    }
    close(false);
  };

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Add Stock - {object ? "Retail" : "Store consumption"} </h4>
              <div className="close-button" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="add-stock-section-align">
            <p>
              Current stock:{" "}
              {object
                ? productDetails?.stockArray?.slice(-1)[0]
                    .totalRetailInitialStock
                : productDetails?.stockArray?.slice(-1)[0]
                    .totalStoreInitialStock}{" "}
            </p>
            <div className="form-group">
              <label>Add number of stock</label>
              {object ? (
                <input
                  type="number"
                  value={addRetailStock}
                  placeholder="e.g., 20"
                  onChange={(e) => setAddRetailStock(e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  value={addStoreStock}
                  placeholder="e.g., 20"
                  onChange={(e) => setAddStoreStock(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="sub-modal-footer add-stock-button-top-align">
            <div className="button-right-align">
              {addRetailStock || addStoreStock ? (
                <button onClick={(e) => stockHandler(e)}>Add stock</button>
              ) : (
                <button disabled>Add stock</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
