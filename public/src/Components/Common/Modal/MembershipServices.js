import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Icon from "../../../assets/svg/Vectors.svg";
import { ApiGet } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import MembershipServicesBlock from "./MembershipServicesBlock";

export default function MembershipServices(props) {
  const {
    selectedCategoryList,
    setSelectedCategoryList,
    editMembership,
    setTemEditMembershipData,
    temFinalMembershipData,
    type,
    flag,
    SettingInfo
  } = props;
  
 
  const userInfo = Auth.getUserDetail();
  const [keyWord, setKeyWord] = useState("");
  const [object, setObject] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [detailedCategories, setDetailedCategories] = useState([]);
  const [temDetailedCategories, setTemDetailedCategories] = useState([]);
  const [selectAllServices, setSelectAllServices] = useState([]);
  const [temAllServiceNames, setTemAllServiceNames] = useState([]);
  const [uncheckedServices , setUncheckedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(true);
  const [temSelMembershipData, setTemSelMembershipData] = useState(
    editMembership && !flag
      ? editMembership.selectedServices
      : props.temFinalMembershipData
  );
  // const [newTemSelMembershipData, setNewTemSelMembershipData] = useState(
  //   editMembership
  //     ? editMembership.selectedServices
  //     : props.temFinalMembershipData
  // );
  const [newSelectedCategoryServices, setNewSelectedCategoryServices] = useState([]);
    // props.temFinalMembershipData
  const [persantageDiscount, setPersantageDiscount] = useState();
  const [rupeesDiscount, setRupeesDiscount] = useState();
  const [serviceDiscountPer, setServiceDiscountPer] = useState();
  const [serviceDiscountRs, setServiceDiscountRs] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [discountForAllPer, setDiscountForAllPer] = useState();
  const [discountForAllRs, setDiscountForAllRs] = useState();
  const [allServiceDiscountRs, setAllServiceDiscountRs] = useState();
  const [allServiceDiscountPer, setAllServiceDiscountPer] = useState();
  const [searchcategory, setSearchCategory] = useState([]);
  const [error, setError] = useState({});
  const [change, setChange] = useState(false);
  const [hide, setHide] = useState([]);
  const [cleanRepeatObject, setCleanRepeatObject] = useState(false)
  const [invalidAllPer, setInvalidAllPer] = useState(false)
  const [invalidAllRs, setInvalidAllRs] = useState(false)
  const [invalidPer, setInvalidPer] = useState(false)
  const [selecttrue, setSelecttrue] = useState(false);
  const [selecttrue1, setSelecttrue1] = useState(false);
  const [invalidRs, setInvalidRs] = useState(false) 
  const [ search,setSearch]=useState(false)

  

 

  const getAllServicesCategories = async () => {
    let res = await ApiGet(
      "service/category/company/serviceData/" + userInfo.companyId
    );
    try {
      if (res.data.status === 200) {
        // if (editMembership) { 
        //   var _ = require("lodash");
        //   let FinalData = editMembership.selectedServices;
        //   let response = _.groupBy(FinalData, "categoryName");
        //   console.log("response",response)
        //   let itm = Object.entries(response);
        //   let filterdata = itm.filter((rep) => rep[0] !== "Unassign");
        //   console.log("response",filterdata)
        //   setObject(response);
        //   setCategoryList(filterdata);
        //   setDetailedCategories(filterdata);
        // } else {
 
          let item = Object.entries(res.data.data);
          let filterDat = item.filter((obj) => obj[0] !== "Unassign");

          setObject(res.data.data);
          setCategoryList(filterDat);
          setSearchCategory(filterDat);
          if(!temFinalMembershipData > 0){
            setDetailedCategories(filterDat);
          }
          setTemDetailedCategories(filterDat);
          setSearchCategory(filterDat);
        // }
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const handleOnSubmit = () => {
    // props.setTemFinalMembershipData(temSelMembershipData);
    const obj = [
      ...new Map(
        temSelMembershipData.map((item) => [JSON.stringify(item), item])
      ).values(),
    ];
   
    let temEdit = temSelMembershipData.filter(service=> {return service.isChecked === true && service})
    setTemEditMembershipData(temEdit);
    props.setTemFinalMembershipData(temSelMembershipData);
    props.toggle();
  };
 

  const handleOnCheckbox = (e, key) => {
    setChange(true);
    setCleanRepeatObject(!cleanRepeatObject);
    if (e.target.checked && e.target.name === "name") {
      selectedCategoryList.push(e.target.value);
    } else if (e.target.name === "name") {
      let index = selectedCategoryList.indexOf(e.target.value);
      selectedCategoryList.splice(index, 1);
     let removedService= temSelMembershipData.filter((item)=> item.categoryName !== e.target.value)
      setTemSelMembershipData(removedService)
    }

    setSelectedCategoryList([...selectedCategoryList]);
    if (key === "all") {
      if (e.target.checked) {
        let allCategory = categoryList.map((rep) => rep[0]);
        setSelectedCategoryList(allCategory);
      } else {
        setSelectedCategoryList([]);
      }
    }else if (key === "allServices") {
      if (e.target.checked) {
        let allservice = detailedCategories
          .map((rep) => rep[1])
          .flat()
          .map((resp) => resp.serviceName);
       setSelectAllServices(allservice);
        let allservicedetail = detailedCategories.map((rep) => rep[1]).flat();
        
        setTemSelMembershipData(allservicedetail);
        if(discountForAllRs){
          setTemSelMembershipData(
            temSelMembershipData.map((service) => {
                return { ...service, 
                  percentageDiscount: service.isChecked === true ? 0 : 0,
                  rupeesDiscount: parseInt(discountForAllRs,10),
                  finalDiscountedAmount:service?.amount -parseInt(discountForAllRs,10),
                  isChecked: true};
            })
          );
        }
      } else {
      setSelectAllServices([]);

        setTemSelMembershipData(
          temSelMembershipData.map(service => { return ({...service, isChecked: false})})
        );
      }
    }
  };

  useEffect(()=>{
    var _ = require("lodash");
    if(temFinalMembershipData.length > 0){
        let response = _.groupBy(temFinalMembershipData, "categoryName");
        let item1 = Object.entries(response);
        
      setDetailedCategories(item1)
    }
  },[temFinalMembershipData])

  const handleOnClick = (e, key) => {
    if (key === "toNext") {
      categoryList.map((item) => {
        if(temFinalMembershipData.length === 0 ){
            hide.push(item?.[0]);
            setHide([...hide]);
          }

        return(<></>)
      })
      if (!flag) {
        setTemSelMembershipData([]);
      }
      setCurrentPage(false);
      

      const filtered = selectedCategoryList.reduce(
        (obj, key) => ({ ...obj, [key]: object[key] }),
        {}
      );
      let item = Object.entries(filtered);
        setDetailedCategories(item);
      setTemDetailedCategories(item);

    
      let selectedservices = item
        .map((rep) => rep[1])
        .flat()
        .map((resp) => resp?.serviceName);
        let selectedservice =  temSelMembershipData?.filter((resp)=>resp?.isChecked === true)
        .map((resp) => {if(resp?.isChecked === true){return(resp?.serviceName) }} );
        setTemAllServiceNames(selectedservices);
      if(flag){
        selectedservice.push(...newSelectedCategoryServices);
          setSelectAllServices(selectedservice);
      }else{
      setSelectAllServices(selectedservices);
      }
    } else if (key === "toPrev") {
      setCurrentPage(true);
      if (!flag) {
        setTemSelMembershipData([]);
      }
    }
  };

  useEffect(() => {
    getAllServicesCategories();
  

  }, []);

  const Persantagediscount = (e, name) => {
    setSelectedCategory(name);
    setPersantageDiscount(e.target.value);
    if(e.target.value > 100){
      setInvalidPer(true)
    }else{
      setInvalidPer(false)
    }
  };

  const Rupeesdiscount = (e, name) => {
    
    setSelectedCategory(name);
    if (e.target.value === "") {
      setRupeesDiscount();
    } else {
      setRupeesDiscount(e.target.value);
    }
    let compare =
    temSelMembershipData &&
    temSelMembershipData
      .filter((item) => item.categoryId === name[0].categoryId)
      .map((item) => item.amount);
  let temp;
  let size = compare.length;
  let i = 0;
  let j = 0;
  for (i = 0; i < size; i++) {
    for (j = i + 1; j < size; j++) {
      if (compare[i] > compare[j]) {
        temp = compare[i];
        compare[i] = compare[j];
        compare[j] = temp;
      }
    }
  }
  if(e.target.value > compare[0]){
    setInvalidRs(true)
  }else{
    setInvalidRs(false)
  }
  };

  const ApplyservicesDiscount = (e, data) => {
    let error = {};
    if (data && selectedCategory) {
      if(data && data[0]?.categoryId === selectedCategory[0]?.categoryId){
      let compare =
        temSelMembershipData &&
        temSelMembershipData
          ?.filter((item) => item?.categoryId === data[0]?.categoryId)
          ?.map((item) => item?.amount);
      let temp;
      let size = compare.length;
      let i = 0;
      let j = 0;
      for (i = 0; i < size; i++) {
        for (j = i + 1; j < size; j++) {
          if (compare[i] > compare[j]) {
            temp = compare[i];
            compare[i] = compare[j];
            compare[j] = temp;
          }
        }
      }
      if (rupeesDiscount > compare[0]) {
        error["rupeesDiscount"] = "* Enter valid input";
      } else {
        setServiceDiscountRs(rupeesDiscount);
      }
      if (persantageDiscount > 100) {
        error["persantageDiscount"] = "* Enter valid input";
      } else {
        setServiceDiscountPer(persantageDiscount);
      }
      setError(error);
    }
  }
  };

  const DiscountForAllPer = (e) => {
    setDiscountForAllPer(e.target.value);
    if(e.target.value > 100){
      setInvalidAllPer(true)
    }else{
      setInvalidAllPer(false)
    }

  };

  const DiscountForAllRs = (e) => {
    setDiscountForAllRs(e.target.value);
    if (e.target.value === "") {
      setDiscountForAllRs();
    } else {
      setDiscountForAllRs(e.target.value);
    }

    let compare =
    temSelMembershipData && temSelMembershipData.map((item) => item.amount);
    let temp;
    let size = compare.length;
    let i = 0;
    let j = 0;
    for (i = 0; i < size; i++) {
      for (j = i + 1; j < size; j++) {
        if (compare[i] > compare[j]) {
          temp = compare[i];
          compare[i] = compare[j];
          compare[j] = temp;
        }
      }
    }
  if(e.target.value > compare[0]){
    setInvalidAllRs(true)
  }else{
    setInvalidAllRs(false)
  }
  };

  const ApplyAllServicesDiscount = () => {
    let error = {};
    let compare =
      temSelMembershipData && temSelMembershipData.map((item) => item.amount);
    let temp;
    let size = compare.length;
    let i = 0;
    let j = 0;
    for (i = 0; i < size; i++) {
      for (j = i + 1; j < size; j++) {
        if (compare[i] > compare[j]) {
          temp = compare[i];
          compare[i] = compare[j];
          compare[j] = temp;
        }
      }
    }
    if (discountForAllPer > 100) {
      error["discountForAllPer"] = "* Enter valid input";
      setInvalidAllPer(true)
    } else {
      setAllServiceDiscountPer(discountForAllPer);
    }

    if (discountForAllRs > compare[0]) {
      error["discountForAllRs"] = "* Enter valid input";
    } else {
      setAllServiceDiscountRs(discountForAllRs);
    }
    setError(error);
  };

  const handleSearch = (e) => {
    if (e.target.value) {
      setSelecttrue(true)
    }else{
      setSelecttrue(false)
    }
    var searchData =
      searchcategory?.length > 0 &&
      searchcategory?.filter((rep) =>
      rep && rep[0]?.toLowerCase().includes(e.target.value?.toLowerCase())
      );
    setCategoryList(searchData);
  };
// console.log("newTemSelMembershipData",newTemSelMembershipData)
  const HandleSearch = (e) => {
    if (e.target.value) {
      setSelecttrue1(true)
    }else{
      setSelecttrue1(false)
    }
    setCleanRepeatObject(!cleanRepeatObject);
    var serviceData =
    temSelMembershipData.length > 0 &&
    temSelMembershipData.filter(
        (obj) =>
          obj?.serviceName
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          obj?.categoryName
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase())
      );
      

    var _ = require("lodash");
    let response = _.groupBy(serviceData, "categoryName");
    const ListData = Object.entries(response);
   
    if (e.target.value === "") {
      setDetailedCategories(temDetailedCategories);
      setSearch(true)
    } else {
      setDetailedCategories(ListData);
      setSearch(true)
    }
  };

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array?.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  
  useEffect(() => {
    const tempData = removeDuplicateObjectFromArray(
      temSelMembershipData,
      "serviceName"
    );
    setTemSelMembershipData(tempData);

    // const filteredTemSelMembershipData = removeDuplicateObjectFromArray(
    //   newTemSelMembershipData,
    //   "serviceName"
    // );
    // setNewTemSelMembershipData(filteredTemSelMembershipData);
  }, [cleanRepeatObject]);
  
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

  const CloseServices = (data) => {
    if (hide?.includes(data && data[0].categoryName)) {
      let index = hide?.indexOf(data && data[0].categoryName);
      hide?.splice(index, 1);
    } else {
      hide?.push(data && data[0].categoryName);
    }
    setHide([...hide]);
  };

  

  return (
    <div>
      <div className="cus-modal-membership-modal">
        <div className="medium-modal-center-align">
          <div className="membership-modal-header">
            <div className="header-alignment">
              <div className="close-title">
                <div className="close-button" onClick={props.toggle}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <h1> 
                Services: Select {currentPage ? "categories" : "services"}
                </h1>
              </div>
              <div></div>
            </div>
          </div>
          {currentPage ? (
            <div className="membership-modal-body">
              <div className="membership-search">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search category"
                    // onChange={(e) => setKeyWord(e.target.value)}
                    onChange={(e) => handleSearch(e)}
                  />
                  <div className="search-center-align">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.58224 5.4375C8.81296 5.4375 9.00219 5.24999 8.97891 5.02044C8.93544 4.59195 8.82517 4.17288 8.65168 3.78028C8.42223 3.26102 8.08772 2.80054 7.67144 2.43092C7.25516 2.06129 6.76714 1.79141 6.24137 1.64008C5.85445 1.52872 5.45393 1.48353 5.05512 1.50532C4.81629 1.51837 4.65752 1.74417 4.69541 1.98034C4.73416 2.22191 4.96389 2.38127 5.20853 2.37762C5.48196 2.37353 5.75533 2.40986 6.02048 2.48618C6.42911 2.60379 6.8084 2.81354 7.13192 3.10081C7.45545 3.38808 7.71543 3.74596 7.89376 4.14952C8.01609 4.42635 8.09797 4.72011 8.13734 5.02091C8.16728 5.24968 8.35151 5.4375 8.58224 5.4375Z"
                        fill="#97A7C3"
                      />
                      <path
                        d="M9.46992 8.63464L12 11.1641L11.1641 12L8.63464 9.46992C7.69346 10.2244 6.52279 10.6348 5.31653 10.6331C2.38181 10.6331 0 8.25126 0 5.31653C0 2.38181 2.38181 0 5.31653 0C8.25126 0 10.6331 2.38181 10.6331 5.31653C10.6348 6.52279 10.2244 7.69346 9.46992 8.63464ZM8.28493 8.19632C9.03463 7.42535 9.4533 6.39191 9.45161 5.31653C9.45161 3.0316 7.60087 1.18145 5.31653 1.18145C3.0316 1.18145 1.18145 3.0316 1.18145 5.31653C1.18145 7.60087 3.0316 9.45161 5.31653 9.45161C6.39191 9.4533 7.42535 9.03463 8.19632 8.28493L8.28493 8.19632Z"
                        fill="#97A7C3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="common-grid-layout-change">
                <div className="m-grid-row top-bottom-selected">
                  <div className="m-grid-row-items">
                  {selecttrue ? null :
                    <div className="all-service-selected">
                      <div className="alignment-all-content">
                        <div>
                          <input
                            type="checkbox"
                            onChange={(e) => handleOnCheckbox(e, "all")}
                            checked={
                              // categoryList.length ===
                              // selectedCategoryList.length
                              selectedCategoryList.length === searchcategory.length
                            }
                          />
                        </div>
                        <div>
                          <span>Select all categories</span>
                        </div>
                      </div>
                    </div>
                  }
                  </div>
                </div>
              </div>
              

              {categoryList?.map((category, index) => {
                return (
                  <>
                    <div key={index} className="group-design-m">
                      <div className="m-grid-row row-space">
                        <div className="m-grid-row-items">
                          <div className="alignment-all-content">
                            <div>
                              <input
                                type="checkbox"
                                name="name"
                                id={category[1][0]?.categoryId}
                                value={category[0]}
                                checked={
                                  selectedCategoryList.includes(category[0])
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleOnCheckbox(e, category)}
                              />
                            </div>
                            <div>
                              <h5>{category[0]}</h5>
                            </div>
                            <div className="counter-design">
                              {category[1]?.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          ) : (
            <div className="membership-modal-body">
              <div className="membership-search">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search services or category"
                    onChange={(e) => HandleSearch(e)}
                  />
                  <div className="search-center-align">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.58224 5.4375C8.81296 5.4375 9.00219 5.24999 8.97891 5.02044C8.93544 4.59195 8.82517 4.17288 8.65168 3.78028C8.42223 3.26102 8.08772 2.80054 7.67144 2.43092C7.25516 2.06129 6.76714 1.79141 6.24137 1.64008C5.85445 1.52872 5.45393 1.48353 5.05512 1.50532C4.81629 1.51837 4.65752 1.74417 4.69541 1.98034C4.73416 2.22191 4.96389 2.38127 5.20853 2.37762C5.48196 2.37353 5.75533 2.40986 6.02048 2.48618C6.42911 2.60379 6.8084 2.81354 7.13192 3.10081C7.45545 3.38808 7.71543 3.74596 7.89376 4.14952C8.01609 4.42635 8.09797 4.72011 8.13734 5.02091C8.16728 5.24968 8.35151 5.4375 8.58224 5.4375Z"
                        fill="#97A7C3"
                      />
                      <path
                        d="M9.46992 8.63464L12 11.1641L11.1641 12L8.63464 9.46992C7.69346 10.2244 6.52279 10.6348 5.31653 10.6331C2.38181 10.6331 0 8.25126 0 5.31653C0 2.38181 2.38181 0 5.31653 0C8.25126 0 10.6331 2.38181 10.6331 5.31653C10.6348 6.52279 10.2244 7.69346 9.46992 8.63464ZM8.28493 8.19632C9.03463 7.42535 9.4533 6.39191 9.45161 5.31653C9.45161 3.0316 7.60087 1.18145 5.31653 1.18145C3.0316 1.18145 1.18145 3.0316 1.18145 5.31653C1.18145 7.60087 3.0316 9.45161 5.31653 9.45161C6.39191 9.4533 7.42535 9.03463 8.19632 8.28493L8.28493 8.19632Z"
                        fill="#97A7C3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="m-grid-row row-align">
                <div className="m-grid-row-items">
                  <span>Category/Service name</span>
                </div>
                <div className="m-grid-row-items">
                  <div className="m-sub-grid-row">
                    <div className="m-sub-grid-row-items">
                      <span>Price</span>
                    </div>
                    <div className="m-sub-grid-row-items">
                      <span>Discount(%)</span>
                    </div>
                    <div className="m-sub-grid-row-items">
                      <span>
                        Discount<a>({SettingInfo?.currentType})</a>
                      </span>
                    </div>
                    <div className="m-sub-grid-row-items">
                      <span>
                        Membership price <a>({SettingInfo?.currentType})</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-grid-row top-bottom-selected">
              {selecttrue1 ? null :
                <>
                <div className="m-grid-row-items">
                  <div className="all-service-selected">
                    <div className="alignment-all-content">
                      <div>
                        <input
                          type="checkbox"
                          // checked={selectAllServices}
                          checked={
                            selectAllServices.length ===
                            temSelMembershipData.length
                          }
                          onChange={(e) => handleOnCheckbox(e, "allServices")}
                        />
                      </div>
                      <div>
                        <span>Select all services</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="m-grid-row-items">
                  <div className="m-sub-grid-row">
                    <div className="m-sub-grid-row-items"></div>
                    <div className={ invalidAllPer ? "m-sub-grid-row-red-items":"m-sub-grid-row-items "}>
                      {/* <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {error["discountForAllPer"]}
                      </span> */}
                      {discountForAllRs ? (
                        <input
                          type="text"
                          placeholder="--"
                          onChange={(e) => DiscountForAllPer(e)}
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder="in %"
                          onChange={(e) => DiscountForAllPer(e)}
                          onKeyPress={bindInput}
                          maxLength={3}
                        />
                      )}
                    </div>
                    <div className={ invalidAllRs ? "m-sub-grid-row-red-items":"m-sub-grid-row-items "}>
                      {/* <span
                        style={{
                          color: "red",
                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {error["discountForAllRs"]}
                      </span> */}
                      {discountForAllPer ? (
                        <input
                          type="text"
                          placeholder="--"
                          onChange={(e) => DiscountForAllRs(e)}
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={"in " + SettingInfo?.currentType}
                          onChange={(e) => DiscountForAllRs(e)}
                          onKeyPress={bindInput}
                        />
                      )}
                    </div>
                    <div className="m-sub-grid-row-items">
                      <span
                        className="disabled-text"
                        onClick={() => ApplyAllServicesDiscount()}
                      >
                        Apply to all
                      </span>
                    </div>
                  </div>
                </div>
                </>
                }
              </div>
              {detailedCategories?.map((detailedCategory, index) => {
                return (
                  <>
                    <div key={index} className="group-design-m">
                      <div className="m-grid-row row-space">
                        <div className="m-grid-row-items">
                          <div className="alignment-all-content">
                            <div>
                              <h5>{detailedCategory[0]}</h5>
                            </div>
                            <div className="counter-design">
                              {detailedCategory[1]?.length}
                            </div>
                          </div>
                        </div>
                        <div className="m-grid-row-items">
                          <div className="m-sub-grid-row">
                            <div className="m-sub-grid-row-items"></div>
                            <div className={ invalidPer ? detailedCategory[1][0].categoryId === selectedCategory[0].categoryId ? "m-sub-grid-row-red-items":"m-sub-grid-row-items " :"m-sub-grid-row-items" }>
                              {/* {selectedCategory?.categoryName ===
                              detailedCategory[0] ? (
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {error["persantageDiscount"]}
                                </span>
                              ) : null} */}

                              {rupeesDiscount ? (
                                selectedCategory?.categoryName ===
                                detailedCategory[0] ? (
                                  <input
                                    type="number"
                                    placeholder="in %"
                                    onChange={(e) => Persantagediscount(e)}
                                    disabled
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    placeholder="in %"
                                    onChange={(e) =>
                                      Persantagediscount(e, detailedCategory[1])
                                    }
                                    onKeyPress={bindInput}
                                  maxLength={3}

                                  />
                                )
                              ) : (
                                <input
                                  type="text"
                                  placeholder="in %"
                                  onChange={(e) =>
                                    Persantagediscount(e, detailedCategory[1])
                                  }
                                  onKeyPress={bindInput}
                                   maxLength={3}

                                />
                              )}
                            </div>
                            <div className={ invalidRs ? detailedCategory[1][0].categoryId === selectedCategory[0].categoryId ? "m-sub-grid-row-red-items":"m-sub-grid-row-items " :"m-sub-grid-row-items" }>
                              {selectedCategory?.categoryName ===
                              detailedCategory[0] ? (
                                <span
                                  style={{
                                    color: "red",
                                    top: "5px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {error["rupeesDiscount"]}
                                </span>
                              ) : null}
                              {persantageDiscount ? (
                                selectedCategory?.categoryName ===
                                detailedCategory[0] ? (
                                  <input
                                    type="number"
                                    placeholder="--"
                                    onChange={(e) => Rupeesdiscount(e)}
                                    disabled
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    placeholder={"in " + SettingInfo?.currentType}
                                    onChange={(e) =>
                                      Rupeesdiscount(e, detailedCategory[1])
                                    }
                                    onKeyPress={bindInput}
                                  />
                                )
                              ) : (
                                <input
                                  type="text"
                                  placeholder={"in " +  SettingInfo?.currentType}
                                  onChange={(e) =>
                                    Rupeesdiscount(e, detailedCategory[1])
                                  }
                                  onKeyPress={bindInput}
                                />
                              )}
                            </div>
                            <div className="m-sub-grid-row-items">
                              <div className="apply-to-all">
                                <span
                                  className="disabled-text"
                                  onClick={(e) =>
                                    ApplyservicesDiscount(
                                      e,
                                      detailedCategory[1]
                                    )
                                  }
                                >
                                  Apply to all
                                </span>
                                <div
                                  className=" "
                                  style={{
                                    transform: hide.includes(
                                      detailedCategory[0]
                                    )
                                      ? "rotate(360deg)"
                                      : "rotate(180deg)",
                                  }}
                                  onClick={() =>
                                    CloseServices(detailedCategory[1])
                                  }
                                >
                                  <img src={Icon} alt="CloseIcon" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {detailedCategory[1]?.map((rep, subIndex) => {
                        
                        return (
                          <MembershipServicesBlock
                            temFinalMembershipData={temFinalMembershipData}
                            temSelMembershipData={temSelMembershipData}
                            setTemSelMembershipData={setTemSelMembershipData}
                            blockData={rep}
                            uncheckedServices={uncheckedServices}
                            setUncheckedServices={setUncheckedServices}
                            detailedCategories={detailedCategories}
                            setDetailedCategories={setDetailedCategories}
                            selectAllServices={selectAllServices}
                            setSelectAllServices={setSelectAllServices}
                            temAllServiceNames={temAllServiceNames}
                            editMembership={editMembership}
                            serviceDiscountPer={serviceDiscountPer}
                            serviceDiscountRs={serviceDiscountRs}
                            selectedCategory={selectedCategory}
                            allServiceDiscountPer={allServiceDiscountPer}
                            allServiceDiscountRs={allServiceDiscountRs}
                            setCleanRepeatObject={setCleanRepeatObject}
                            cleanRepeatObject={cleanRepeatObject}
                            change={change}
                            // editMembership={editMembership}
                            flag={flag}
                            hide={hide}
                            type={type}
                            search={search}
                            setSearch={setSearch}
                            SettingInfo={SettingInfo}
                          />
                        );
                      })}
                    </div>
                  </>
                );
              })}
            </div>
          )}
          <div className="select-categories-modal-footer-alignment">
            <div className="edit-category-alignment-all">
              <div>
                {" "}
                {!currentPage && (
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.82333 7L14.1763 7"
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
                )}
              </div>
              <div onClick={(e) => handleOnClick(e, "toPrev")}>
                {!currentPage && (
                  <span onClick={(e) => handleOnClick(e, "toPrev")}>
                    Edit category
                  </span>
                )}
              </div>
            </div>
            <div>
              {/* {currentPage ? (
                <span>{selectedCategoryList?.length} Categories Selected</span>
              ) : (
                <span>{temSelMembershipData?.length} Services Selected</span>
              )} */}
              {currentPage ? (
                selectedCategoryList?.length > 0 ? (
                  <span>
                    {selectedCategoryList?.length} {selectedCategoryList?.length === 1 ? "category selected" : "categories selected" } 
                  </span>
                ) : (
                  <span style={{ opacity: 0.5 }}>0 category selected</span>
                )
              ) : temSelMembershipData?.length > 0 ? (
                <span>{selectAllServices?.length} {selectAllServices?.length === 1  ? "service selected" : "services selected" } </span>
              ) : (
                <span style={{ opacity: 0.5 }}>0 service selected</span>
              )}
              {/* 
              {selectedCategoryList?.length > 0 ? (
                <button onClick={(e) => handleOnClick(e, "toNext")}>
                  Continue
                </button>
              ) : (
                <button style={{ opacity: 0.5 }}>Continue</button>
              )} */}
              {selectedCategoryList?.length > 0 ? (
                !currentPage ? (
                  temSelMembershipData?.length > 0 ? ( 
                    temSelMembershipData.filter((service)=>{
                      return (service.percentageDiscount > 0 ) || (service.rupeesDiscount > 0 ) || (service.isChecked === false) && service
                    })?.length === temSelMembershipData.length && selectAllServices.length !== 0 ? (

                      <button onClick={() => handleOnSubmit()}>Save</button>
                      ) : (
                    <button style={{ opacity: 0.5 }}>Save</button>
                      )
                  ) : (
                    <button style={{ opacity: 0.5 }}>Save</button>
                  )
                ) : (
                  <button onClick={(e) => handleOnClick(e, "toNext")}>
                    Continue
                  </button>
                )
              ) : (
                <button style={{ opacity: 0.5 }}>Continue</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
