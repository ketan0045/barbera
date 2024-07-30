import React, { useEffect, useRef, useCallback } from "react";

const HandleServiceNavigation = ({ prd, focus, index, setFocus,getAllSelectStaff,products,onRemove,onAdd,Continue,SettingInfo}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (focus) {
      ref.current.focus();  
    }
  }, [focus]);

  const handleSelect = useCallback(() => {
    onAdd(prd)
    setFocus(index);
  }, [prd, index, setFocus]);

  return (
    <>
    <li
      tabIndex={focus ? 0 : -1}
      role="button"
      ref={ref}
      onClick={handleSelect}
      onKeyPress={handleSelect}
    >
                                   
                                    <div className="product-details-grid">             
                                    <div className="product-details-grid-items">
                                    <p>{prd.productName}</p>
                                    <div className="child-alignment">
                                        <span>
                                        {prd.productquantity} {prd.productUnit} •
                                        </span>
                                        <p>
                                        <del> {SettingInfo?.currentType} {prd.productPrice} </del>{SettingInfo?.currentType} {prd.discountedPrice}
                                        </p>
                                    </div>
                                    </div>
                                    {products?.length > 0 ? (
                                    products.some(
                                        (product) => product.productId === prd.productId
                                    ) ? (
                                        <div className="product-button-counter">
                                        
                                        <button>
                                            <span  onClick={() => onRemove(prd)}>-</span>
                                        {products.map((prod)=>{
                                            return(
                                                prod.productId === prd.productId ? prod.productCount :null
                                            )
                                        })}
                                            <span onClick={() => onAdd(prd)}>+</span>
                                        </button>
                                        </div>
                                    ) : (
                                        <div className="product-details-grid-items">
                                        <button onClick={() => onAdd(prd)}>ADD</button>
                                        </div>
                                    )
                                    ) : (
                                    <div className="product-details-grid-items">
                                        <button onClick={() => onAdd(prd)}>ADD</button>
                                    </div>
                                    )}
                                    </div>

    </li>
    </>
  );
};

export default HandleServiceNavigation;