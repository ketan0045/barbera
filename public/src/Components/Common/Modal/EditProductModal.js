import React, { useEffect, useState } from "react";
import "./Modal.scss";
import DropDownIcon from "../../../../src/assets/svg/drop-down.svg";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";

export default function EditProductModal(props) {
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [subDiscoutMenu, setSubDiscoutMenu] = useState(false);
  const {
    modal,
    editProductData,
    onEditAdd,
    onEditRemove,
    toggle,
    RemoveProduct,
    showDiscount,
    products,
    ValidationMsg,
    SettingInfo,
    productTax,
    gstOn,
    gstType,
    staffData,
    editInvoice,
  } = props;
  const [productSubTotal, setProductSubTotal] = useState(
    editProductData.productSubTotal
  );
  const [productPrice, setProductPrice] = useState(
    editProductData.productPrice
  );
  const [discountedSubTotal, setDiscountedSubTotal] = useState(
    editProductData.discountedSubTotal
  );
  const [flatdiscountedSubTotal, setFlatdiscountedSubTotal] = useState(
    editProductData.flatdiscountedSubTotal
  );
  const [discountedPriceGstAmount, setDiscountedPriceGstAmount] = useState(
    editProductData.discountedPriceGstAmount
  );
  const [discountedWithGstAmount, setDiscountedWithGstAmount] = useState(
    parseFloat(
      (
        editProductData.discountedPrice +
        (editProductData.discountedPrice * editProductData.productgst) / 100
      ).toFixed(2),
      10
    )
  );
  const [discountedPriceWithGstAmount, setDiscountedPriceWithGstAmount] =
    useState(editProductData.discountedPriceWithGstAmount);
  const [productdisCountType, setProductdisCountType] = useState("Rs.");
  const [productDiscount, setProductDiscount] = useState(
    editProductData.productDiscount
  );
  const [discount, setDiscount] = useState();
  const [inclusivediscount, setInclusiveDiscount] = useState();
  const [discounttype, setDiscountType] = useState(SettingInfo?.currentType);
  const [discountPerUnit, setDiscountPerUnit] = useState(
    editProductData.discountedPrice
  );
  const [errors, setError] = useState({});
  const [changes, setChanges] = useState(false);
  const [allProduct, setAllProduct] = useState();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [staffId, setStaffId] = useState(editProductData?.staffId);
  const [selectedStaff, setSelectedStaff] = useState(
    editProductData?.staffName
      ? editProductData?.staffName
      : "No staff assigned"
  );
  let totalproduc;

  useEffect(async () => {
    await ApiGet("product/company/" + userInfo.companyId).then((resp) => {
      setAllProduct(
        parseFloat(
          (resp?.data?.data.filter(
            (x) => x._id === editProductData?.productId
          ))[0].stockArray[
            (resp?.data?.data.filter(
              (x) => x._id === editProductData?.productId
            ))[0]?.stockArray?.length - 1
          ].total,
          10
        )
      );
    });
  }, [editProductData]);
  const product = props.products;
  const productss = product
    .filter((dataa) => dataa.productId === editProductData.productId)
    .map((item) => item.totalProductss || item.total);
  let editedData = {
    discountedPrice: discountPerUnit,
    flatdiscountedSubTotal: parseFloat(flatdiscountedSubTotal.toFixed(2), 10),
    productCount: editProductData.productCount,
    productId: editProductData.productId,
    productName: editProductData.productName,
    productPrice: productPrice ? productPrice : editProductData?.productPrice,
    productSubTotal: productSubTotal,
    productUnit: editProductData.productUnit,
    staffId: staffId,
    staffName: selectedStaff,
    productquantity: editProductData.productquantity,
    // productdisCount: discount,
    productdisCountType: productdisCountType,
    discountedPriceGstAmount: discountedPriceGstAmount,
    discountedPriceWithGstAmount: discountedPriceWithGstAmount,
    discountedSubTotal: parseFloat(discountedSubTotal.toFixed(2), 10),
    productDiscount: parseFloat(productDiscount.toFixed(2), 10),
    productgst: editProductData.productgst,
    total: editProductData.total,
    retailStock: editProductData.retailStock,
    totalProductss: editProductData.totalProductss
      ? editProductData.totalProductss
      : productss[0],
    finalproduct: editProductData?.finalproduct,
  };
  
  const SelectNewStaff = async (e, data) => {
    // getAllStaff();
    setChanges(true);
    setSelectedStaff(data.firstName + " " + data.lastName);
    setStaffId(data._id);
    setSubMenuopen(!subMenuOpen);
  };

  const ChangeDiscount = (e) => {
    setChanges(true);
    if (discounttype === "%") {
      setError(errors);
      setDiscount(parseFloat(e.target.value, 10));
      setDiscountPerUnit(
        parseFloat(
          parseFloat(editProductData.discountedPrice.toFixed(2), 10) -
            ((editProductData.discountedPrice * e.target.value) / 100).toFixed(
              2
            ),
          10
        )
      );
      // setProductSubTotal(editProductData.productSubTotal- (editProductData.productSubTotal * e.target.value/100))
      setDiscountedSubTotal(
        (editProductData.discountedPrice -
          parseFloat(
            (editProductData.discountedPrice * e.target.value) / 100,
            10
          )) *
          editProductData.productCount
      );
      setFlatdiscountedSubTotal(
        editProductData.flatdiscountedSubTotal -
          (
            (editProductData.flatdiscountedSubTotal * e.target.value) /
            100
          ).toFixed(2)
      );
      setDiscountedPriceGstAmount(
        ((editProductData.flatdiscountedSubTotal -
          parseFloat(
            (editProductData.flatdiscountedSubTotal * e.target.value) / 100,
            10
          )) *
          editProductData.productgst) /
          100
      );
      setDiscountedPriceWithGstAmount(
        ((editProductData.flatdiscountedSubTotal -
          parseFloat(
            (editProductData.flatdiscountedSubTotal * e.target.value) / 100,
            10
          )) *
          editProductData.productgst) /
          100 +
          (editProductData.flatdiscountedSubTotal -
            parseFloat(
              (editProductData.flatdiscountedSubTotal * e.target.value) / 100,
              10
            ))
      );
      setProductDiscount(
        editProductData.productDiscount +
          (editProductData.flatdiscountedSubTotal * e.target.value) / 100
      );
    } else {
      setDiscount(parseFloat(e.target.value, 10));
      setDiscountPerUnit(
        parseFloat(
          (editProductData.discountedPrice - e.target.value).toFixed(2),
          10
        )
      );
      // setProductSubTotal((editProductData.discountedPrice -e.target.value) * editProductData.productCount)
      setDiscountedSubTotal(
        parseFloat(editProductData.discountedPrice - e.target.value, 10) *
          editProductData.productCount
      );
      setFlatdiscountedSubTotal(
        (parseFloat(
          editProductData.flatdiscountedSubTotal / editProductData.productCount,
          10
        ) -
          e.target.value) *
          editProductData.productCount
      );
      setDiscountedPriceGstAmount(
        ((parseFloat(
          editProductData.flatdiscountedSubTotal / editProductData.productCount,
          10
        ) -
          e.target.value) *
          editProductData.productCount *
          editProductData.productgst) /
          100
      );
      setDiscountedPriceWithGstAmount(
        (parseFloat(
          editProductData.flatdiscountedSubTotal / editProductData.productCount,
          10
        ) -
          e.target.value) *
          editProductData.productCount +
          ((parseFloat(
            editProductData.flatdiscountedSubTotal /
              editProductData.productCount,
            10
          ) -
            e.target.value) *
            editProductData.productCount *
            editProductData.productgst) /
            100
      );
      setProductDiscount(
        editProductData.productDiscount +
          parseFloat(e.target.value, 10) * editProductData.productCount
      );
    }
  };

  const ChangeInclusiveDiscount = (e) => {
    setChanges(true);
    if (discounttype === "%") {
      // setError(errors);
      setInclusiveDiscount(parseFloat(e.target.value, 10));
      if (e.target.value !== "") {
        setDiscountedWithGstAmount(
          parseFloat(
            (
              editProductData.discountedPrice +
              (editProductData.discountedPrice * editProductData.productgst) /
                100
            ).toFixed(2),
            10
          ) -
            (parseFloat(
              (
                editProductData.discountedPrice +
                (editProductData.discountedPrice * editProductData.productgst) /
                  100
              ).toFixed(2),
              10
            ) *
              parseFloat(e.target.value, 10)) /
              100
        );
      } else {
        setDiscountedWithGstAmount(
          parseFloat(
            (
              editProductData.discountedPrice +
              (editProductData.discountedPrice * editProductData.productgst) /
                100
            ).toFixed(2),
            10
          )
        );
      }
      setDiscountPerUnit(
        parseFloat(
          (
            (parseFloat(
              (
                editProductData.discountedPrice +
                (editProductData.discountedPrice * editProductData.productgst) /
                  100
              ).toFixed(2),
              10
            ) -
              (parseFloat(
                (
                  editProductData.discountedPrice +
                  (editProductData.discountedPrice *
                    editProductData.productgst) /
                    100
                ).toFixed(2),
                10
              ) *
                parseFloat(e.target.value, 10)) /
                100) /
            (1 + editProductData.productgst / 100)
          ).toFixed(2),
          10
        )
      );
      // setProductSubTotal(editProductData.productSubTotal- (editProductData.productSubTotal * e.target.value/100))
      setDiscountedSubTotal(
        (editProductData.discountedPrice -
          parseFloat(
            (editProductData.discountedPrice * e.target.value) / 100,
            10
          )) *
          editProductData.productCount
      );
      setFlatdiscountedSubTotal(
        editProductData.flatdiscountedSubTotal -
          (
            (editProductData.flatdiscountedSubTotal * e.target.value) /
            100
          ).toFixed(2)
      );
      setDiscountedPriceGstAmount(
        parseFloat(
          (
            ((editProductData.flatdiscountedSubTotal -
              parseFloat(
                (editProductData.flatdiscountedSubTotal * e.target.value) / 100,
                10
              )) *
              editProductData.productgst) /
            100
          ).toFixed(2),
          10
        )
      );
      setDiscountedPriceWithGstAmount(
        parseFloat(
          (
            ((editProductData.flatdiscountedSubTotal -
              parseFloat(
                (editProductData.flatdiscountedSubTotal * e.target.value) / 100,
                10
              )) *
              editProductData.productgst) /
              100 +
            (editProductData.flatdiscountedSubTotal -
              parseFloat(
                (editProductData.flatdiscountedSubTotal * e.target.value) / 100,
                10
              ))
          ).toFixed(2),
          10
        )
      );
      setProductDiscount(
        editProductData.productDiscount +
          (editProductData.flatdiscountedSubTotal * e.target.value) / 100
      );
    } else {
      setInclusiveDiscount(parseFloat(e.target.value, 10));
      if (e.target.value !== "") {
        setDiscountedWithGstAmount(
          parseFloat(
            (
              editProductData.discountedPrice +
              (editProductData.discountedPrice * editProductData.productgst) /
                100
            ).toFixed(2),
            10
          ) - parseFloat(e.target.value, 10)
        );
      } else {
        setDiscountedWithGstAmount(
          parseFloat(
            (
              editProductData.discountedPrice +
              (editProductData.discountedPrice * editProductData.productgst) /
                100
            ).toFixed(2),
            10
          )
        );
      }
      // setDiscount(parseFloat(e.target.value, 10));
      setDiscountPerUnit(
        parseFloat(
          (
            (parseFloat(
              (
                editProductData.discountedPrice +
                (editProductData.discountedPrice * editProductData.productgst) /
                  100
              ).toFixed(2),
              10
            ) -
              parseFloat(e.target.value, 10)) /
            (1 + editProductData.productgst / 100)
          ).toFixed(2),
          10
        )
      );
      // setProductSubTotal((editProductData.discountedPrice -e.target.value) * editProductData.productCount)
      setDiscountedSubTotal(
        parseFloat(
          (
            (parseFloat(
              (
                editProductData.discountedPrice +
                (editProductData.discountedPrice * editProductData.productgst) /
                  100
              ).toFixed(2),
              10
            ) -
              parseFloat(e.target.value, 10)) /
            (1 + editProductData.productgst / 100)
          ).toFixed(2),
          10
        ) * editProductData.productCount
      );
      setFlatdiscountedSubTotal(
        parseFloat(
          (
            (parseFloat(
              (
                editProductData.discountedPrice +
                (editProductData.discountedPrice * editProductData.productgst) /
                  100
              ).toFixed(2),
              10
            ) -
              parseFloat(e.target.value, 10)) /
            (1 + editProductData.productgst / 100)
          ).toFixed(2),
          10
        ) * editProductData.productCount
      );
      setDiscountedPriceGstAmount(
        parseFloat(
          (
            (parseFloat(
              (
                (parseFloat(
                  (
                    editProductData.discountedPrice +
                    (editProductData.discountedPrice *
                      editProductData.productgst) /
                      100
                  ).toFixed(2),
                  10
                ) -
                  parseFloat(e.target.value, 10)) /
                (1 + editProductData.productgst / 100)
              ).toFixed(2),
              10
            ) *
              editProductData.productCount *
              editProductData.productgst) /
            100
          ).toFixed(2),
          10
        )
      );
      setDiscountedPriceWithGstAmount(
        parseFloat(
          (
            parseFloat(
              (
                (parseFloat(
                  (
                    editProductData.discountedPrice +
                    (editProductData.discountedPrice *
                      editProductData.productgst) /
                      100
                  ).toFixed(2),
                  10
                ) -
                  parseFloat(e.target.value, 10)) /
                (1 + editProductData.productgst / 100)
              ).toFixed(2),
              10
            ) *
              editProductData.productCount +
            parseFloat(
              (
                (parseFloat(
                  (
                    (parseFloat(
                      (
                        editProductData.discountedPrice +
                        (editProductData.discountedPrice *
                          editProductData.productgst) /
                          100
                      ).toFixed(2),
                      10
                    ) -
                      parseFloat(e.target.value, 10)) /
                    (1 + editProductData.productgst / 100)
                  ).toFixed(2),
                  10
                ) *
                  editProductData.productCount *
                  editProductData.productgst) /
                100
              ).toFixed(2),
              10
            )
          ).toFixed(2),
          10
        )
      );
      if (e.target.value !== "") {
        setProductDiscount(
          editProductData.productSubTotal -
            parseFloat(
              (
                parseFloat(
                  (
                    (parseFloat(
                      (
                        editProductData.discountedPrice +
                        (editProductData.discountedPrice *
                          editProductData.productgst) /
                          100
                      ).toFixed(2),
                      10
                    ) -
                      parseFloat(e.target.value, 10)) /
                    (1 + editProductData.productgst / 100)
                  ).toFixed(2),
                  10
                ) *
                  editProductData.productCount +
                parseFloat(
                  (
                    (parseFloat(
                      (
                        (parseFloat(
                          (
                            editProductData.discountedPrice +
                            (editProductData.discountedPrice *
                              editProductData.productgst) /
                              100
                          ).toFixed(2),
                          10
                        ) -
                          parseFloat(e.target.value, 10)) /
                        (1 + editProductData.productgst / 100)
                      ).toFixed(2),
                      10
                    ) *
                      editProductData.productCount *
                      editProductData.productgst) /
                    100
                  ).toFixed(2),
                  10
                )
              ).toFixed(2),
              10
            ) +
            parseFloat(
              (
                (parseFloat(
                  (
                    (parseFloat(
                      (
                        editProductData.discountedPrice +
                        (editProductData.discountedPrice *
                          editProductData.productgst) /
                          100
                      ).toFixed(2),
                      10
                    ) -
                      parseFloat(e.target.value, 10)) /
                    (1 + editProductData.productgst / 100)
                  ).toFixed(2),
                  10
                ) *
                  editProductData.productCount *
                  editProductData.productgst) /
                100
              ).toFixed(2),
              10
            )
        );
      } else {
        setProductDiscount(editProductData.productDiscount);
      }
    }
  };

  const ChangeDiscountType = (e, data) => {
    if (data === "%") {
      setSubDiscoutMenu(!subDiscoutMenu);
      setDiscountType("%");
      setProductdisCountType("%");

      if (
        discount ||
        (inclusivediscount && discounttype === SettingInfo?.currentType)
      ) {
        setDiscount("");
        setDiscountPerUnit(editProductData.discountedPrice);
        setDiscountedSubTotal(editProductData.discountedSubTotal);
        setFlatdiscountedSubTotal(editProductData.flatdiscountedSubTotal);
        setDiscountedPriceGstAmount(editProductData.discountedPriceGstAmount);
        setInclusiveDiscount("");
        setDiscountedWithGstAmount(
          parseFloat(
            (
              editProductData.discountedPrice +
              (editProductData.discountedPrice * editProductData.productgst) /
                100
            ).toFixed(2),
            10
          )
        );
        setDiscountedPriceWithGstAmount(
          editProductData.discountedPriceWithGstAmount
        );
        setProductDiscount(editProductData.productDiscount);
      }
    } else {
      setSubDiscoutMenu(!subDiscoutMenu);
      setDiscountType(SettingInfo?.currentType);
      setProductdisCountType("Rs.");
      if (discount || (inclusivediscount && discounttype === "%")) {
        setDiscount("");
        setInclusiveDiscount("");
        setDiscountPerUnit(editProductData.discountedPrice);
        setDiscountedSubTotal(editProductData.discountedSubTotal);
        setFlatdiscountedSubTotal(editProductData.flatdiscountedSubTotal);
        setDiscountedPriceGstAmount(editProductData.discountedPriceGstAmount);
        setDiscountedWithGstAmount(
          editProductData.discountedPrice +
            (editProductData.discountedPrice * editProductData.productgst) / 100
        );
        setDiscountedPriceWithGstAmount(
          editProductData.discountedPriceWithGstAmount
        );
        setProductDiscount(editProductData.productDiscount);
      }
    }
  };
  const onRemove = (data) => {
    setChanges(true);
    if (data.productCount !== 1) {
      setProductSubTotal((editProductData.productCount - 1) * discountPerUnit);
      onEditRemove(data);
    }
  };
  const onAdd = (data) => {
    setChanges(true);
    setProductSubTotal((editProductData.productCount + 1) * discountPerUnit);
    onEditAdd(data);
  };

  const HandleDiscountPerUnit = (e) => {
    setChanges(true);
    let errors = {};
    let formIsValid = true;
    if (e.target.value > editProductData.discountedPrice) {
      setDiscountPerUnit(parseInt(e.target.value, 10));
      setDiscount(0);
      setDiscountedSubTotal(e.target.value * editProductData.productCount);
      setFlatdiscountedSubTotal(e.target.value * editProductData.productCount);
      setDiscountedPriceGstAmount(
        parseFloat(
          (
            (e.target.value *
              editProductData.productCount *
              editProductData.productgst) /
            100
          ).toFixed(2),
          10
        )
      );
      setDiscountedPriceWithGstAmount(
        (e.target.value *
          editProductData.productCount *
          editProductData.productgst) /
          100 +
          e.target.value * editProductData.productCount
      );
      setProductDiscount(0);
      setProductSubTotal(e.target.value * editProductData.productCount);
      setProductPrice(parseInt(e.target.value));
    } else {
      if (discounttype === "%") {
        setDiscountType(SettingInfo?.currentType);
        setProductdisCountType("Rs.");
        setDiscountPerUnit(parseInt(e.target.value, 10));
        setDiscount(
          editProductData.discountedPrice.toFixed(2) -
            parseFloat(e.target.value, 10)
        );
        setDiscountedSubTotal(e.target.value * editProductData.productCount);
        setFlatdiscountedSubTotal(
          e.target.value * editProductData.productCount
        );
        setDiscountedPriceGstAmount(
          parseFloat(
            (
              (e.target.value *
                editProductData.productCount *
                editProductData.productgst) /
              100
            ).toFixed(2),
            10
          )
        );
        setDiscountedPriceWithGstAmount(
          (e.target.value *
            editProductData.productCount *
            editProductData.productgst) /
            100 +
            e.target.value * editProductData.productCount
        );
        setProductDiscount(
          editProductData.productDiscount +
            (editProductData.discountedPrice - e.target.value) *
              editProductData.productCount
        );
        setProductSubTotal(
          editProductData.productPrice * editProductData.productCount
        );
        setProductPrice(editProductData.productPrice);
      } else {
        setDiscountPerUnit(parseInt(e.target.value, 10));
        setDiscount(editProductData.discountedPrice - e.target.value);
        setDiscountedSubTotal(e.target.value * editProductData.productCount);
        setFlatdiscountedSubTotal(
          e.target.value * editProductData.productCount
        );
        setDiscountedPriceGstAmount(
          parseFloat(
            (
              (e.target.value *
                editProductData.productCount *
                editProductData.productgst) /
              100
            ).toFixed(2),
            10
          )
        );
        setDiscountedPriceWithGstAmount(
          (e.target.value *
            editProductData.productCount *
            editProductData.productgst) /
            100 +
            e.target.value * editProductData.productCount
        );
        setProductDiscount(
          editProductData.productDiscount +
            (editProductData.discountedPrice - e.target.value) *
              editProductData.productCount
        );
        setProductSubTotal(
          editProductData.productPrice * editProductData.productCount
        );
        setProductPrice(editProductData.productPrice);
      }
    }
  };

  const HandleInclusiveDiscountPerUnit = (e) => {
    setChanges(true);
    let errors = {};
    let formIsValid = true;
    if (e.target.value > editProductData.discountedPriceWithGstAmount) {
      setDiscountedWithGstAmount(parseInt(e.target.value, 10));
      setDiscountedPriceWithGstAmount(
        parseInt(e.target.value, 10) * editProductData.productCount
      );
      setInclusiveDiscount(0);
      setDiscountedPriceGstAmount(
        parseFloat(
          (
            (parseFloat(
              (
                (parseInt(e.target.value, 10) * editProductData.productCount) /
                (1 + editProductData?.productgst / 100)
              ).toFixed(2),
              10
            ) *
              editProductData?.productgst) /
            100
          ).toFixed(2),
          10
        )
      );
      setDiscountPerUnit(
        parseFloat(
          (
            parseInt(e.target.value, 10) /
            (1 + editProductData?.productgst / 100)
          ).toFixed(2),
          10
        )
      );
      // setDiscount(editProductData.discountedPrice - e.target.value);
      setDiscountedSubTotal(
        parseFloat(
          (
            parseInt(e.target.value, 10) /
            (1 + editProductData?.productgst / 100)
          ).toFixed(2),
          10
        ) * editProductData.productCount
      );
      setFlatdiscountedSubTotal(
        parseFloat(
          (
            parseInt(e.target.value, 10) /
            (1 + editProductData?.productgst / 100)
          ).toFixed(2),
          10
        ) * editProductData.productCount
      );

      setProductDiscount(0);
      setProductPrice(
        parseFloat(
          (
            parseInt(e.target.value, 10) /
            (1 + editProductData?.productgst / 100)
          ).toFixed(2),
          10
        )
      );
      setProductSubTotal(
        parseFloat(
          (
            parseInt(e.target.value, 10) /
            (1 + editProductData?.productgst / 100)
          ).toFixed(2),
          10
        ) * editProductData?.productCount
      );
    } else {
      if (discounttype === "%") {
        setDiscountType(SettingInfo?.currentType);
        setProductdisCountType("Rs.");
        setDiscountedWithGstAmount(parseInt(e.target.value));
        setDiscount(
          100 -
            parseFloat(
              (e.target.value * 100) /
                editProductData.discountedPrice.toFixed(2),
              10
            )
        );
        setDiscountedPriceWithGstAmount(
          parseInt(e.target.value, 10) * editProductData.productCount
        );
        setInclusiveDiscount(
          parseFloat(
            (
              editProductData.discountedPriceWithGstAmount /
                editProductData.productCount -
              parseInt(e.target.value, 10)
            ).toFixed(2),
            10
          )
        );
        setDiscountedPriceGstAmount(
          parseFloat(
            (
              (parseFloat(
                (
                  (parseInt(e.target.value, 10) *
                    editProductData.productCount) /
                  (1 + editProductData?.productgst / 100)
                ).toFixed(2),
                10
              ) *
                editProductData?.productgst) /
              100
            ).toFixed(2),
            10
          )
        );
        setDiscountPerUnit(
          parseFloat(
            (
              parseInt(e.target.value, 10) /
              (1 + editProductData?.productgst / 100)
            ).toFixed(2),
            10
          )
        );
        // setDiscount(editProductData.discountedPrice - e.target.value);
        setDiscountedSubTotal(
          parseFloat(
            (
              parseInt(e.target.value, 10) /
              (1 + editProductData?.productgst / 100)
            ).toFixed(2),
            10
          ) * editProductData.productCount
        );
        setFlatdiscountedSubTotal(
          parseFloat(
            (
              parseInt(e.target.value, 10) /
              (1 + editProductData?.productgst / 100)
            ).toFixed(2),
            10
          ) * editProductData.productCount
        );

        setProductDiscount(
          editProductData.productDiscount +
            (editProductData.discountedPrice -
              parseFloat(
                (
                  parseInt(e.target.value, 10) /
                  (1 + editProductData?.productgst / 100)
                ).toFixed(2),
                10
              )) *
              editProductData.productCount
        );
        setProductPrice(editProductData.productPrice);
        setProductSubTotal(
          editProductData.productPrice * editProductData.productCount
        );
      } else {
        setDiscountedWithGstAmount(parseInt(e.target.value, 10));
        setDiscountedPriceWithGstAmount(
          parseInt(e.target.value, 10) * editProductData.productCount
        );
        setInclusiveDiscount(
          parseFloat(
            (
              editProductData.discountedPriceWithGstAmount /
                editProductData.productCount -
              parseInt(e.target.value, 10)
            ).toFixed(2),
            10
          )
        );
        setDiscountedPriceGstAmount(
          parseFloat(
            (
              (parseFloat(
                (
                  (parseInt(e.target.value, 10) *
                    editProductData.productCount) /
                  (1 + editProductData?.productgst / 100)
                ).toFixed(2),
                10
              ) *
                editProductData?.productgst) /
              100
            ).toFixed(2),
            10
          )
        );
        setDiscountPerUnit(
          parseFloat(
            (
              parseInt(e.target.value, 10) /
              (1 + editProductData?.productgst / 100)
            ).toFixed(2),
            10
          )
        );
        // setDiscount(editProductData.discountedPrice - e.target.value);
        setDiscountedSubTotal(
          parseFloat(
            (
              parseInt(e.target.value, 10) /
              (1 + editProductData?.productgst / 100)
            ).toFixed(2),
            10
          ) * editProductData.productCount
        );
        setFlatdiscountedSubTotal(
          parseFloat(
            (
              parseInt(e.target.value, 10) /
              (1 + editProductData?.productgst / 100)
            ).toFixed(2),
            10
          ) * editProductData.productCount
        );

        setProductDiscount(
          editProductData.productDiscount +
            (editProductData.discountedPrice -
              parseFloat(
                (
                  parseInt(e.target.value, 10) /
                  (1 + editProductData?.productgst / 100)
                ).toFixed(2),
                10
              )) *
              editProductData.productCount
        );
        setProductPrice(editProductData.productPrice);
        setProductSubTotal(
          editProductData.productPrice * editProductData.productCount
        );
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (productdisCountType === "%") {
      if (discount > 100) {
        formIsValid = false;
        errors["discount"] = "* Enter valid input";
      }
    }
    if (productdisCountType === "Rs.") {
      if (discount > editProductData.discountedPrice) {
        formIsValid = false;
        errors["discount"] = "* Enter valid input";
      }
    }

    // if (discountPerUnit > editProductData.discountedPrice) {
    //   formIsValid = false;
    //   errors["discount"] = "* Enter valid input";
    // }
    setError(errors);

    return formIsValid;
  };
  const saveDiscount = () => {
    if (validateForm()) {
      toggle(editedData);
    }
  };
  useEffect(() => {
    setDiscountedSubTotal(editProductData.discountedSubTotal);
    setProductSubTotal(editProductData.productSubTotal);
    setDiscountedPriceGstAmount(editProductData.discountedPriceGstAmount);
    setDiscountedPriceWithGstAmount(
      editProductData.discountedPriceWithGstAmount
    );
    setFlatdiscountedSubTotal(editProductData.flatdiscountedSubTotal);
    setProductDiscount(editProductData.productDiscount);
  }, [editProductData]);
  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>Edit Product</h4>
              <div className="close-button" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="edit-product-sub-modal">
            <div className="edit-grid">
              <div className="edit-grid-items">
                <p>{editProductData.productName}</p>
                <div className="child-text-alignment">
                  <span>
                    {editProductData.productquantity}{" "}
                    {editProductData.productUnit} •
                  </span>
                  <p>
                    {" "}
                    {/* <del>
                      <a>{SettingInfo?.currentType}</a>{" "}
                      {editProductData.productPrice}
                    </del>{" "}
                    {""}
                    <a> {SettingInfo?.currentType} </a>
                    {editProductData.discountedPrice} */}
                    <span>
                      {selectedStaff !== "No staff assigned" &&
                        "by  " + " " + selectedStaff}
                    </span>
                  </p>
                </div>
              </div>
              {showDiscount || editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord  ? null : (
                <div className="edit-grid-items">
                  <button>
                    <span onClick={() => onRemove(editedData)}> -</span>
                    <span>{editProductData.productCount}</span>
                    {editProductData.finalproduct >= allProduct ? (
                      <span onClick={() => ValidationMsg()}> +</span>
                    ) : (
                      <span onClick={() => onAdd(editedData)}> +</span>
                    )}
                  </button>
                </div>
              )}
            </div>
            {SettingInfo?.multipleStaff?.assignStaffForProduct ? (
              <div className="option-select-group edit-service-modal-bottom-align">
                <label>Staff</label>
                <div className="relative">
                  <div
                    className="input-relative"
                    onClick={() => setSubMenuopen(!subMenuOpen)}
                  >
                    <input disabled type="text" value={selectedStaff} />
                    <div className="drop-down-icon-center">
                      <img src={DropDownIcon} alt="DropDownIcon" />
                    </div>
                  </div>
                  <div
                    className={
                      subMenuOpen
                        ? "sub-menu-open sub-menu"
                        : "sub-menu sub-menu-close"
                    }
                  >
                    <div className="sub-menu-design">
                      <ul>
                        {staffData?.map((staff) => {
                          return (
                            <li
                              key={staff._id}
                              onClick={(e) => SelectNewStaff(e, staff)}
                            >
                              {staff?.firstName + " " + staff?.lastName}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {showDiscount ? null : gstType === "Inclusive" && productTax ? (
              <div className="disuount-input-grid">
                <div className="disuount-input-grid-items">
                  <div className="form-group">
                    <label>
                      Discount{" "}
                      {
                        <span
                          style={{ color: "red", top: "5px", fontSize: "10px" }}
                        >
                          {" "}
                          {errors["discount"]}{" "}
                        </span>
                      }
                    </label>
                    {editInvoice?.balanceAmountRecord ||
                    editInvoice?.dueAmountRecord ||
                    editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? (
                      <input
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        name="Discount"
                        value={inclusivediscount}
                        placeholder="e.g. 100"
                        disabled
                      />
                    ) : (
                      <input
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        name="Discount"
                        value={inclusivediscount}
                        placeholder="e.g. 100"
                        onChange={(e) => ChangeInclusiveDiscount(e)}
                      />
                    )}
                  </div>
                </div>
                <div className="disuount-input-grid-items">
                  <div className="relative">
                    <div
                      className="form-group relative"
                      onClick={() => setSubDiscoutMenu(!subDiscoutMenu)}
                    >
                      <input type="text" value={discounttype} />
                      <div className="icon-input-align">
                        <img src={DropDownIcon} alt="DropDownIcon" />
                      </div>
                    </div>
                    <div
                      className={
                        !subDiscoutMenu
                          ? "sub-menu-open sub-menu-hidden "
                          : "sub-menu-open sub-menu-show"
                      }
                    >
                      <div className="menu-design-box">
                        <div
                          className="list-style-design"
                          onClick={(e) => ChangeDiscountType(e, "%")}
                        >
                          <span>%</span>
                        </div>
                        <div
                          className="list-style-design"
                          onClick={(e) =>
                            ChangeDiscountType(e, SettingInfo?.currentType)
                          }
                        >
                          <span>{SettingInfo?.currentType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="disuount-input-grid">
                  <div className="disuount-input-grid-items">
                    <div className="form-group">
                      <label>
                        Discount{" "}
                        {
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {" "}
                            {errors["discount"]}{" "}
                          </span>
                        }
                      </label>
                      {editInvoice?.balanceAmountRecord ||
                      editInvoice?.dueAmountRecord ||
                      editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? (
                        <input
                          type="number"
                          onWheel={() => document.activeElement.blur()}
                          name="Discount"
                          value={discount}
                          placeholder="e.g. 100"
                          disabled
                        />
                      ) : (
                        <input
                          type="number"
                          onWheel={() => document.activeElement.blur()}
                          name="Discount"
                          value={discount}
                          placeholder="e.g. 100"
                          onChange={(e) => ChangeDiscount(e)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="disuount-input-grid-items">
                    <div className="relative">
                      <div
                        className="form-group relative"
                        onClick={() => setSubDiscoutMenu(!subDiscoutMenu)}
                      >
                        <input type="text" value={discounttype} />
                        <div className="icon-input-align">
                          <img src={DropDownIcon} alt="DropDownIcon" />
                        </div>
                      </div>
                      <div
                        className={
                          !subDiscoutMenu
                            ? "sub-menu-open sub-menu-hidden "
                            : "sub-menu-open sub-menu-show"
                        }
                      >
                        <div className="menu-design-box">
                          <div
                            className="list-style-design"
                            onClick={(e) => ChangeDiscountType(e, "%")}
                          >
                            <span>%</span>
                          </div>
                          <div
                            className="list-style-design"
                            onClick={(e) =>
                              ChangeDiscountType(e, SettingInfo?.currentType)
                            }
                          >
                            <span>{SettingInfo?.currentType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {showDiscount ? (
              <div>
                <div className="form-group">
                  <label>For Edit Product Remove Flat Discount. </label>
                </div>
              </div>
            ) : gstType === "Inclusive" && productTax ? (
              <div className="form-group">
                <label>
                  Final price per unit (inclusive GST){" "}
                  {
                    <span
                      style={{ color: "red", top: "5px", fontSize: "10px" }}
                    >
                      {" "}
                      {errors["perunit"]}{" "}
                    </span>
                  }
                </label>
                {editInvoice?.balanceAmountRecord ||
                editInvoice?.dueAmountRecord ||
                editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? (
                  <input
                    type="number"
                    onWheel={() => document.activeElement.blur()}
                    name="fullname"
                    value={discountedWithGstAmount}
                    disabled
                  />
                ) : (
                  <input
                    type="number"
                    onWheel={() => document.activeElement.blur()}
                    name="fullname"
                    value={discountedWithGstAmount}
                    onChange={(e) => HandleInclusiveDiscountPerUnit(e)}
                  />
                )}
              </div>
            ) : (
              <div className="form-group">
                <label>
                  Final price per unit{" "}
                  {
                    <span
                      style={{ color: "red", top: "5px", fontSize: "10px" }}
                    >
                      {" "}
                      {errors["perunit"]}{" "}
                    </span>
                  }
                </label>
                {editInvoice?.balanceAmountRecord ||
                editInvoice?.dueAmountRecord ||
                editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? (
                  <input
                    type="number"
                    onWheel={() => document.activeElement.blur()}
                    name="fullname"
                    value={discountPerUnit}
                    disabled
                  />
                ) : (
                  <input
                    type="number"
                    onWheel={() => document.activeElement.blur()}
                    name="fullname"
                    value={discountPerUnit}
                    onChange={(e) => HandleDiscountPerUnit(e)}
                  />
                )}
              </div>
            )}
          </div>
          <div className="remove-edit-button-align">
            {showDiscount ? null : (
              <div className="remove-button">
                {editInvoice?.balanceAmountRecord ||
                editInvoice?.dueAmountRecord ||
                editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord? null : (
                  <button onClick={(e) => RemoveProduct(editProductData)}>
                    Remove
                  </button>
                )}
              </div>
            )}
            <div className="save-change">
              <button onClick={() => toggle()}>Cancel</button>
              {changes ? (
                <button onClick={() => saveDiscount()}>Save changes</button>
              ) : (
                <button disabled>Save changes</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
