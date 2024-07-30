import React from "react";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import OutsideAlerter from "../../Common/OutsideAlerter";

export default function InventorySetting(props) {
  const {
    handleOnClick,
    handleOnToggle,
    enableIn,
    productType,
    enableBarcode,
    retailMenu,
    setRetailMenu,
    permission,
  } = props;

  return (
    <div>
      <div className="" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
        <div className="">
          <div className="enable-inventroy-text-alignment">
            <p>Enable Inventory</p>
            <label
              class="switch"
              onChange={(e) => handleOnToggle(e, "enableIn")}
            >
              <input
                type="checkbox"
                checked={enableIn}
                // disabled={permission?.filter(
                //             (obj) => obj.name === "Settings functions edit"
                //           )[0]?.isChecked === false ? true : false}
              />
              <span class="slider round"></span>
            </label>
          </div>
          {enableIn && (
            <>
              <div className="product-type-menu-alignment">
                <p>Product type</p>
                <div className="relative">
                  <OutsideAlerter setRetailMenu={setRetailMenu}>
                    <button
                      onClick={() => setRetailMenu(!retailMenu)}
                      // disabled={permission?.filter(
                      //       (obj) => obj.name === "Settings functions edit"
                      //     )[0]?.isChecked === false ? true : false}
                    >
                      {productType ? productType : "Store Consumable & Retail"}
                      <img src={DropDownIcon} alt="DropDownIcon" />
                    </button>
                  </OutsideAlerter>
                  <div
                    className={
                      retailMenu
                        ? "retail-menu-design retail-menu-open"
                        : "retail-menu-design retail-menu-close"
                    }
                  >
                    <div className="retails-dropdown-box">
                      <ul onClick={(e) => handleOnClick(e, "productType")}>
                        <li>Retail</li>
                        <li>Store Consumable</li>
                        <li>Store Consumable & Retail</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="enable-inventroy-text-alignment">
                <p style={{ fontWeight: "500" }}>Enable barcode</p>
                <label
                  class="switch"
                  onChange={(e) => handleOnToggle(e, "enableBarcode")}
                >
                  <input
                    type="checkbox"
                    checked={enableBarcode}
                    // disabled={permission?.filter(
                    //         (obj) => obj.name === "Settings functions edit"
                    //       )[0]?.isChecked === false ? true : false}
                  />
                  <span class="slider round"></span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
