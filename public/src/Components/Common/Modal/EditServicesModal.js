import React, { useEffect, useRef, useState } from "react";
import "./Modal.scss";
import DropDownIcon from "../../../../src/assets/svg/drop-down.svg";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import moment from "moment";

export default function AddNewbrand(props) {
  const [subDiscoutMenu, setSubDiscoutMenu] = useState(false);
  const { modal, toggle, editServiceData, editBrand,RemoveService, showDiscount,editInvoice, EditServiceData,customer,gstType,SettingInfo,gstOn,serviceTax,sameInvoice, setInvoiceDetail,selctedMemberShip,setEditServicesModal , setHideBackToService,InvoiceProductConsumptionToggle,setOpenWorkRation, changes, setChanges} = props;
  const [discount, setDiscount] = useState(Math.round(editServiceData?.servicediscount));
  const [inclusivediscount, setInclusiveDiscount] = useState();
  const [discounttype, setDiscountType] = useState(SettingInfo?.currentType);
  const [discountPerUnit, setDiscountPerUnit] = useState(
    editServiceData?.servicediscountedprice
  );
  const [discountPerUnitwithgst, setDiscountPerUnitWithGst] = useState(Math.round(editServiceData?.servicesubtotal));
  const [errors, setError] = useState({});
  const [productdisCountType, setProductdisCountType] = useState(SettingInfo?.currentType);
  // const [changes, setChanges] = useState(false); // lifted this state up to <GenerateNewInvoice />
  const [subMenuOpen, setSubMenuopen] = useState(false);
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [staffId, setStaffId] = useState(editServiceData?.staffid);
  const [allStaff, setAllStaff] = useState();
  const [changeStaffPrice, setChangeStaffPrice] = useState("");
 
  const [selectedStaff, setSelectedStaff] = useState(
    editServiceData?.staff ? editServiceData?.staff[0].firstName + " " + editServiceData?.staff[0].lastName : "Unassign"
  );

  let editedData = [{
    multipleStaff:true,
    categoryName: editServiceData.categoryName,
    categoryId: editServiceData.categoryId,
    colour: editServiceData.colour,
    serviceId: editServiceData.serviceId,
    servicename: editServiceData.servicename,
    servicerate:  parseInt(discountPerUnit,10) > editServiceData.servicerate ? parseInt(discountPerUnit,10) : editServiceData.servicerate,
    servicediscountedprice: parseFloat(discountPerUnit, 10),
    staff:changeStaffPrice ? changeStaffPrice : editServiceData?.staff ,
    servicediscount:
      productdisCountType === "%"
        ? parseFloat(((editServiceData.servicerate * parseFloat(discount,10)) / 100).toFixed(2),10)
        : parseFloat(discount,10),
    servicediscountType: productdisCountType,
    key: editServiceData.key,
    servicegst: editServiceData.servicegst,
    servicegstamount: parseFloat(((discountPerUnit * editServiceData.servicegst) / 100).toFixed(2),10),
    servicesubtotal: editServiceData?.servicegst === 0 ?  parseFloat(discountPerUnit ,10) : parseFloat(((parseFloat(discountPerUnit ,10)  + ((parseFloat(discountPerUnit ,10)  * editServiceData?.servicegst)/100))).toFixed(2),10),
    serviceflatdiscountedprice: parseFloat(discountPerUnit, 10),
    membershipDiscount: editServiceData.membershipDiscount,
    productConsumptions: !editServiceData?.productConsumptions ? [] : editServiceData?.productConsumptions
  }]

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  useEffect(async () => {
    getAllStaff();
  }, []);

  const getAllStaff = async()=>{ 
    let datePayload = {
      startTime: moment(editServiceData?.date).format("YYYY-MM-DD"),
      endTime: moment(editServiceData?.date).add(1, "days").format("YYYY-MM-DD"),
    }
    let attendanceRes =  await ApiPost("attendence/company/" + userInfo.companyId, datePayload)
    let tempData = attendanceRes.data.data?.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    let tempAttendanceData = removeDuplicateObjectFromArray(tempData, "staffId");
    let thisDayAttendanceData = tempAttendanceData || [];
    if (editServiceData) {
  
    try {
      let res = await ApiGet( "category/staff/data/day/" +
      editServiceData?.categoryId  +
      "/" +
      moment(new Date()).format("dddd"));
      
      if (res.data.status === 200) {
        let staffFilter=res.data.data.filter((rep) => rep.default === false)
        let availableStaff
        if (
          SettingInfo?.attendence?.attendanceToggle &&
          SettingInfo?.attendence?.attendanceForInvoiceToggle
        ) {
         availableStaff = staffFilter?.filter((item) => thisDayAttendanceData?.find((data)=>data?.staffId === item?._id)?.currentStatus === "clockIn");
        }else{
          availableStaff=staffFilter
        }
        setAllStaff(availableStaff);
      } else {
        setStaffId("");
      }
    } catch (err) {
      console.log("in the catch");
    }
  } else {
    try {
      let res = await ApiGet(
        "category/" + editServiceData?.categoryId + "/" +
        moment(new Date()).format("dddd")
    );
    if (res.data.status === 200) {
      let availableStaff
      if (
        SettingInfo?.attendence?.attendanceToggle &&
        SettingInfo?.attendence?.attendanceForInvoiceToggle
      ) {
       availableStaff = res.data.data?.filter((item) => thisDayAttendanceData?.find((data)=>data?.staffId === item?._id)?.currentStatus === "clockIn");
      }else{
        availableStaff=res.data.data
      }
    
      setAllStaff(availableStaff);
    } else {
    }
    } catch (err) {
      console.log("in the catch");
    }
  }}

  const SelectNewStaff = async (e, data) => {
    
    getAllStaff();
    setChanges(true);
    let changePrice = [{...data, workRatio: changeStaffPrice ? changeStaffPrice[0]?.workRatio :  editServiceData?.staff[0]?.workRatio, workRationPercentage: 100}]
    setChangeStaffPrice(changePrice)
    setSelectedStaff(data.firstName + " " + data.lastName);
    setStaffId(data._id);
    setSubMenuopen(!subMenuOpen);
  };

  const ChangeDiscount = (e) => {
    setChanges(true);
    if (discounttype === "%") {
      if(e.target.value <= 100){
        setError(errors);
        setDiscount(parseInt(e.target.value, 10));
        setDiscountPerUnit(
          editServiceData.servicerate -
            parseInt((editServiceData.servicerate * e.target.value) / 100, 10)
        );
        let ChangePrice = editServiceData?.staff?.map((one) => {
          return {
            ...one,
            workRatio: parseFloat(((((editServiceData.servicerate) - (editServiceData.servicerate * e.target.value) / 100) / 100) * one?.workRationPercentage).toFixed(2), 10)
          };
      });
        setChangeStaffPrice(ChangePrice)
      }
    } else {
      if(editServiceData.servicerate >= e.target.value){
        setDiscount(parseInt(e.target.value, 10));
        setDiscountPerUnit(editServiceData.servicerate - e.target.value);
        let ChangePrice = editServiceData?.staff?.map((one) => {
          return {
            ...one,
            workRatio: parseFloat((((editServiceData?.servicerate - e.target.value) * one?.workRationPercentage) / 100).toFixed(2), 10)
          };
      });
      
        setChangeStaffPrice(ChangePrice)
      }
    }
  };

  const ChangeInclusiveDiscount=(e)=>{
    setChanges(true);
    if (discounttype === "%") {
      if(e.target.value <= 100){
      setError(errors);
      setDiscount(100 -((((editServiceData.servicesubtotal -
      (editServiceData.servicesubtotal * e.target.value) / 100)/(1+(18/100))) *100) /editServiceData.servicerate));
      setInclusiveDiscount(parseInt(e.target.value, 10));
      setDiscountPerUnit(parseFloat(( editServiceData.servicesubtotal -
        parseInt((editServiceData.servicesubtotal * e.target.value) / 100, 10))/(1+(18/100))).toFixed(2),10);
      setDiscountPerUnitWithGst( editServiceData.servicesubtotal -
        parseInt((editServiceData.servicesubtotal * e.target.value) / 100, 10))
        let ChangePrice = editServiceData?.staff?.map((one) => {
          return {
            ...one,
            workRatio: parseFloat(((( editServiceData.servicesubtotal -
              parseInt((editServiceData.servicesubtotal * e.target.value) / 100, 10))/(1+(18/100)) * one?.workRationPercentage) / 100).toFixed(2), 10)
          };
      });
        setChangeStaffPrice(ChangePrice)
      }
    } else {
      if(e.target.value <= editServiceData?.servicesubtotal){
        setDiscount(parseFloat(e.target.value/(1+(18/100))).toFixed(2),10);
        setInclusiveDiscount(parseInt(e.target.value, 10));
        setDiscountPerUnit(parseFloat(( editServiceData.servicesubtotal - e.target.value)/(1+(18/100))).toFixed(2),10);
        setDiscountPerUnitWithGst( editServiceData.servicesubtotal - e.target.value)
        let ChangePrice = editServiceData?.staff?.map((one) => {
          return {
            ...one,
            workRatio: parseFloat((((editServiceData.servicesubtotal - e.target.value)/(1+(18/100)) * one?.workRationPercentage) / 100).toFixed(2), 10)
          };
      });
        setChangeStaffPrice(ChangePrice)
      }

    }
  }

  const HandleDiscountPerUnit = (e) => {
    
    setChanges(true);
    let errors = {};
    let formIsValid = true;
    if (e.target.value > editServiceData.servicerate) {
      // formIsValid = false;
      // errors["perUnit"] = "* Enter valid input";
      setDiscountPerUnit(e.target.value);
      setDiscount(0);
    }else{
    if (discounttype === "%") {
      setDiscountPerUnit(e.target.value);
      setDiscount(
        100 - ((e.target.value * 100) / editServiceData.servicerate).toFixed(2)
      );
    } else {
      setDiscountPerUnit(e.target.value);
      setDiscount(editServiceData.servicerate - e.target.value);
      if (e.target.value > editServiceData.servicerate) {
        setDiscount(0);
      }
    }}
    let ChangePrice = editServiceData?.staff?.map((one) => {
        return {
          ...one,
          workRatio: parseFloat(((e.target.value * one?.workRationPercentage) / 100).toFixed(2), 10)
        
        };
    });
    
    setChangeStaffPrice(ChangePrice)
  };
  
  const HandleDiscountPerUnitWithGst=(e)=>{
    setChanges(true);
    let errors = {};
    let formIsValid = true;
    if (e.target.value > editServiceData.servicesubtotal) {
      // formIsValid = false;
      // errors["perUnit"] = "* Enter valid input";
      setDiscountPerUnit(parseFloat(e.target.value/(1+(18/100))).toFixed(2),10)
      setDiscountPerUnitWithGst(e.target.value);
      setDiscount(0);
      setInclusiveDiscount(0)
    }else{
    if (discounttype === "%") {
      setDiscountPerUnit(parseFloat(e.target.value/(1+(18/100))).toFixed(2),10);
      setDiscountPerUnitWithGst(e.target.value);
      setDiscount(
        100 - ((parseFloat((e.target.value/(1+(18/100))).toFixed(2),10) * 100) / editServiceData.servicerate).toFixed(2)
      );
      setInclusiveDiscount(Math.round(100 - ((e.target.value * 100) / editServiceData.servicesubtotal).toFixed(2)))
    } else {
      setDiscountPerUnit(parseFloat(e.target.value/(1+(18/100))).toFixed(2),10);
      setDiscountPerUnitWithGst(e.target.value);
      setDiscount(parseFloat(parseFloat(editServiceData.servicerate - parseFloat(e.target.value/(1+(18/100))).toFixed(2),10).toFixed(2),10));
      setInclusiveDiscount(Math.round(parseFloat(parseFloat(editServiceData.servicesubtotal - e.target.value).toFixed(2),10)))
    }}
    let ChangePrice = editServiceData?.staff?.map((one) => {
      return {
        ...one,
        workRatio: parseFloat((((e.target.value/(1+(18/100))) * one?.workRationPercentage) / 100).toFixed(2), 10)
      
      };
  });
  
  setChangeStaffPrice(ChangePrice)
  }

  function ChangeDiscountType(e, data) {
    if (data === "%") {
      setSubDiscoutMenu(!subDiscoutMenu);
      setDiscountType("%");
      setProductdisCountType("%");
      if (discount && discounttype === SettingInfo?.currentType) {
        setDiscount(0);
        setInclusiveDiscount(0)
        setDiscountPerUnit(editServiceData.servicerate);
        setDiscountPerUnitWithGst(editServiceData.servicesubtotal)
      }
    } else {
      setSubDiscoutMenu(!subDiscoutMenu);
      setDiscountType(SettingInfo?.currentType);
      setProductdisCountType("Rs.");
      if (discount && discounttype === "%") {
        setDiscount(0);
        setInclusiveDiscount(0)
        setDiscountPerUnit(editServiceData.servicerate);
        setDiscountPerUnitWithGst(editServiceData.servicesubtotal)
        
      }
    }
  }
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
      if (discount > editServiceData.servicerate) {
        formIsValid = false;
        errors["discount"] = "* Enter valid input";
      }
    }
    // if (discountPerUnit > editServiceData.servicerate) {
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

  

  const productTypeRef = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        subMenuOpen &&
        productTypeRef.current &&
        !productTypeRef.current.contains(e.target)
      ) {
        setSubMenuopen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [subMenuOpen]);

  const setDiscountTypePopUp = () => {
    customer
      ? customer.membership === true
        ? setSubDiscoutMenu(subDiscoutMenu)
        : setSubDiscoutMenu(!subDiscoutMenu)
      : setSubDiscoutMenu(!subDiscoutMenu);
  };

  const CloseEditServiceModal =()=>{
    EditServiceData(editedData)
  }

  

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment header-alignment-mutliple-staff">
              <h4>Edit Service</h4>
              <div className="close-button" onClick={() => toggle()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="edit-product-sub-modal edit-product-sub-modal-top-design">
            <div className="hair-wash-grid">
              <div className="hair-wash-grid-items">
                <div className="sub-grid">
                  <div className="edit-service-sub-grid-items">
                    <div
                      className="line-color-dynamic"
                      style={{
                        backgroundColor: editServiceData?.colour
                          ? editServiceData?.colour
                          : "#D1FFF4",
                        borderRadius: "5px",
                        height: "100%",
                      }}
                    ></div>
                  </div>

                  <div className="sub-grid-items">
                    <p>{editServiceData.servicename}</p>
                    <span>by {editServiceData?.staff?.map((stf)=>{
                      return(
                        stf.firstName + " " + stf.lastName
                      )
                    }).join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="hair-wash-grid-items">
                <h5>
                  {" "}
                  <span>{SettingInfo?.currentType}</span> {editServiceData.servicerate}
                </h5>
              </div>
              <div className="hair-wash-grid-items" onClick={() => InvoiceProductConsumptionToggle()}>
                <p className="edit-service-to-consumption">View product consumption</p>
              </div>
            </div>

            {showDiscount ? (
              <div>
                <div className="form-group">
                  <label>
                    For Edit In Serivce Rate Please Remove Flat Discount.{" "}
                  </label>
                </div>
              </div>
            ) :
            (<>{editServiceData?.staff?.length === 1 ?
              <div className="option-select-group edit-service-modal-bottom-align">
                <div style={{display:"flex", justifyContent:"space-between"}}>
                <label>Staff</label> 
                {SettingInfo?.multipleStaff?.assignMultipleStaff ? 
                // customer ? 
                //   customer?.membership === true || (selctedMemberShip?.length > 0 && sameInvoice) ? 
                <span onClick={(e) => EditServiceData(editedData)} >
                Multiple staff
                </span> :""
                // :
                // <span onClick={(e) => EditServiceData(editedData)} >
                //   Multiple staff
                // </span>  
                // :""
                }
                </div>
              
              <div className="relative" ref={productTypeRef}>
                <div
                  className="input-relative"
                  onClick={() =>setSubMenuopen(!subMenuOpen)}
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
                    {SettingInfo?.multipleStaff?.assignMultipleStaff ? 
                    <li onClick={(e) => EditServiceData(editedData)}>
                      Select multiple satff
                    </li> :"" }
                      {allStaff?.map((staff) => {
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
            : 
             <div className="edit-service-multiple-staff-box">
             <div className="first-service-alignment-all">
               <p>Staff</p>
               {
              //  customer?.membership === true || (selctedMemberShip?.length > 0 && sameInvoice) ? "": 
               <a onClick={()=>CloseEditServiceModal()}>Edit</a>}
             </div>
             <div className="all-multipal-staff-list-alignment">
               {editedData[0]?.staff?.map((editserv)=>{
                 return(<div className="all-multipal-staff-list">
                 <div>
                   <p>{editserv?.firstName + " " + editserv?.lastName}</p>
                   <span>{editserv?.workRationPercentage.toFixed(2)}%</span>
                 </div>
                 <div>
                   <p><a>{SettingInfo?.currentType}</a> {editserv?.workRatio === "" ? 0 : editserv?.workRatio}</p>
                 </div>
               </div>)
               })}
             </div>
           </div>
            }
           
            
            {gstType != "Inclusive" ?
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
                      {customer ? (
                        customer.membership === true  || (selctedMemberShip.length > 0 && sameInvoice) || editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? (
                          <input
                            type="number"
                            onWheel={() => document.activeElement.blur()}
                            name="fullname"
                            value={discount}
                            placeholder="e.g. 100"
                            onChange={(e) => ChangeDiscount(e)}
                            disabled
                          />
                        ) : (
                          <input
                            type="number"
                            onWheel={() => document.activeElement.blur()}
                            name="fullname"
                            value={discount}
                            placeholder="e.g. 100"
                            onChange={(e) => ChangeDiscount(e)}
                          />
                        )
                      ) : (
                        <input
                          type="number"
                          onWheel={() => document.activeElement.blur()}
                          name="fullname"
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
                        onClick={() => setDiscountTypePopUp()}
                      >
                        {customer ? (
                          customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice) ||editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord  ? (
                            editServiceData?.serviceflatdiscountedprice ===
                            0 ? (
                              <input
                                type="text"
                                value={discounttype}
                                disabled
                              />
                            ) : (
                              <input type="text" value={discounttype} />
                            )
                          ) : (
                            <input type="text" value={discounttype} />
                          )
                        ) : (
                          <input type="text" value={discounttype} />
                        )}
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
                            className="list-style-design rs-roboto-change"
                            onClick={(e) => ChangeDiscountType(e, SettingInfo?.currentType)}
                          >
                            <span>{SettingInfo?.currentType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
                gstOn && serviceTax ?
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
                      {customer ? (
                        customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice) || editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord ? (
                          <input
                            type="number"
                            onWheel={() => document.activeElement.blur()}
                            name="fullname"
                            value={inclusivediscount}
                            placeholder="e.g. 100"
                            onChange={(e) => ChangeInclusiveDiscount(e)}
                            disabled
                          />
                        ) : (
                          <input
                            type="number"
                            onWheel={() => document.activeElement.blur()}
                            name="fullname"
                            value={inclusivediscount}
                            placeholder="e.g. 100"
                            onChange={(e) => ChangeInclusiveDiscount(e)}
                          />
                        )
                      ) : (
                        <input
                          type="number"
                          onWheel={() => document.activeElement.blur()}
                          name="fullname"
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
                        onClick={() => setDiscountTypePopUp()}
                      >
                        {customer ? (
                          customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice)? (
                            editServiceData?.serviceflatdiscountedprice ===
                            0 ? (
                              <input
                                type="text"
                                value={discounttype}
                                disabled
                              />
                            ) : (
                              <input type="text" value={discounttype} />
                            )
                          ) : (
                            <input type="text" value={discounttype} />
                          )
                        ) : (
                          <input type="text" value={discounttype} />
                        )}
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
                            className="list-style-design rs-roboto-change"
                            onClick={(e) => ChangeDiscountType(e, SettingInfo?.currentType)}
                          >
                            <span>{SettingInfo?.currentType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
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
                    {customer ? (
                      customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice)||editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord ? (
                        <input
                          type="number"
                          onWheel={() => document.activeElement.blur()}
                          name="fullname"
                          value={discount}
                          placeholder="e.g. 100"
                          onChange={(e) => ChangeDiscount(e)}
                          disabled
                        />
                      ) : (
                        <input
                          type="number"
                          onWheel={() => document.activeElement.blur()}
                          name="fullname"
                          value={discount}
                          placeholder="e.g. 100"
                          onChange={(e) => ChangeDiscount(e)}
                        />
                      )
                    ) : (
                      <input
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        name="fullname"
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
                      onClick={() => setDiscountTypePopUp()}
                    >
                      {customer ? (
                        customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice) || editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord ? (
                          editServiceData?.serviceflatdiscountedprice ===
                          0 ? (
                            <input
                              type="text"
                              value={discounttype}
                              disabled
                            />
                          ) : (
                            <input type="text" value={discounttype} />
                          )
                        ) : (
                          <input type="text" value={discounttype} />
                        )
                      ) : (
                        <input type="text" value={discounttype} />
                      )}
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
                          className="list-style-design rs-roboto-change"
                          onClick={(e) => ChangeDiscountType(e, SettingInfo?.currentType)}
                        >
                          <span>{SettingInfo?.currentType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                }
                {gstType != "Inclusive"   ?
                <div className="form-group">
                  <label>
                    Final price per unit
                    {
                      <span
                        style={{ color: "red", top: "5px", fontSize: "10px" }}
                      >
                        {" "}
                        {errors["perUnit"]}{" "}
                      </span>
                    }
                  </label>
                  {customer ? (
                    customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice) ||editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet"  || editInvoice?.previousDueClearRecord ? (
                      <input
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        name="fullname"
                        value={discountPerUnit}
                        onChange={(e) => HandleDiscountPerUnit(e)}
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
                    )
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
                :
                gstOn && serviceTax? 
                <div className="form-group">
                  <label>
                  Final price (inclusive GST)
                    {
                      <span
                        style={{ color: "red", top: "5px", fontSize: "10px" }}
                      >
                        {" "}
                        {errors["perUnit"]}{" "}
                      </span>
                    }
                  </label>
                  {customer ? (
                    customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice)||editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord ? (
                      <input
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        name="fullname"
                        value={discountPerUnitwithgst}
                        onChange={(e) => HandleDiscountPerUnitWithGst(e)}
                        disabled
                      />
                    ) : (
                      <input
                        type="number"
                        onWheel={() => document.activeElement.blur()}
                        name="fullname"
                        value={discountPerUnitwithgst}
                        onChange={(e) => HandleDiscountPerUnitWithGst(e)}
                      />
                    )
                  ) : (
                    <input
                      type="number"
                      onWheel={() => document.activeElement.blur()}
                      name="fullname"
                      value={discountPerUnitwithgst}
                      onChange={(e) => HandleDiscountPerUnitWithGst(e)}
                    />
                  )}
                </div>
                :
                <div className="form-group">
                <label>
                  Final price per unit
                  {
                    <span
                      style={{ color: "red", top: "5px", fontSize: "10px" }}
                    >
                      {" "}
                      {errors["perUnit"]}{" "}
                    </span>
                  }
                </label>
                {customer ? (
                  customer.membership === true || (selctedMemberShip.length > 0 && sameInvoice) ||editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord ? (
                    <input
                      type="number"
                      onWheel={() => document.activeElement.blur()}
                      name="fullname"
                      value={discountPerUnit}
                      onChange={(e) => HandleDiscountPerUnit(e)}
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
                  )
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
                  }
              </>
            )}
          </div>
          <div className="remove-edit-button-align">
            {showDiscount ? null : (
              <div className="remove-button">
                {editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ? null :<button onClick={(e) => RemoveService(editServiceData)}>
                  Remove
                </button>}
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
