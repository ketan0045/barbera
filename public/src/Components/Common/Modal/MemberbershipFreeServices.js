import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Icon from "../../../assets/svg/Vectors.svg";
import { ApiGet } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import MembershipFreeServicesBlock from "./MembershipFreeServicesBlock";

export default function MemberbershipFreePServices(props) {
  const {
    selectedCategoryList,
    setSelectedCategoryList,
    temEditMembershipData,
    setTemEditMembershipData,
    flag,
    editMembership,
    SettingInfo
  } = props;
  const userInfo = Auth.getUserDetail();
  

  const [detailedCategories, setDetailedCategories] = useState([]);
  const [temDetailedCategories, setTemDetailedCategories] = useState([]);
  const [object, setObject] = useState({});
  const [change, setChange] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(true);
  const [selectAllServices, setSelectAllServices] = useState([]);
  props.setFinalSelServices(selectAllServices);
  const [searchcategory, setSearchCategory] = useState([]);
  const [hide, setHide] = useState([]);
  const [temAllServiceNames, setTemAllServiceNames] = useState([]);
  const [temSelMembershipData, setTemSelMembershipData] = useState(
    editMembership
      ? editMembership.selectedServices
      : props.temFinalMembershipData
  );
  // const [newTemSelMembershipData, setNewTemSelMembershipData] = useState(
  //   editMembership
  //     ? editMembership.selectedServices
  //     : props.temFinalMembershipData
  // );
  const [newSelectedCategoryServices, setNewSelectedCategoryServices] = useState([]);
  const [cleanRepeatObject, setCleanRepeatObject] = useState(false);
  const [selecttrue, setSelecttrue] = useState(false);
  

  const getAllServicesCategories = async () => {
    let res = await ApiGet(
      "service/category/company/serviceData/" + userInfo.companyId
    );
    try {
      if (res.data.status === 200) {
        
        let item = Object.entries(res.data.data);
        let Data = item.map((it) => {return it[1];}).flat();
        let FinalData = Data.map((data) => {
          return {
            ...data,
            finalDiscountedAmount: 0,
            percentageDiscount: 100,
            rupeesDiscount: data.amount,
            isChecked: true,
          };
        });
        var _ = require("lodash");
        let response = _.groupBy(FinalData, "categoryName");
       
        let itm = Object.entries(response);
        let filterdata = itm.filter((rep) => rep[0] !== "Unassign");
        setObject(response);
        

        setCategoryList(filterdata);
        setSearchCategory(filterdata);
        setDetailedCategories(filterdata);
        setTemDetailedCategories(filterdata);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
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

  const handleSearch = (e) => {
    // if(selectedCategoryList.length === categoryList.length){
 
  
  if (e.target.value) {
    setSelecttrue(true)
  }else{
    setSelecttrue(false)
  }
  var searchData =
        searchcategory.length > 0 &&
        searchcategory.filter((rep) =>
          rep[0]?.toLowerCase().includes(e.target.value?.toLowerCase())
        );
      setCategoryList(searchData);
  
  };


  const HandleSearch = async (e) => {
    if (e.target.value) {
      setSelecttrue(true)
    }else{
      setSelecttrue(false)
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
            .includes(e.target.value.toLowerCase()) ||
          obj?.amount?.toString().includes(e.target.value.toString())
      );
      

    var _ = require("lodash");
    let response = _.groupBy(serviceData, "categoryName");
    const ListData = Object.entries(response);
    
    if (e.target.value === "") {
      setDetailedCategories(temDetailedCategories);
    } else {
      setDetailedCategories(ListData);
    }
  };

  const handleOnSubmit = () => {
    const obj = [
      ...new Map(
        temSelMembershipData.map((item) => [JSON.stringify(item), item])
        ).values(),
      ];
      props.setTemFinalMembershipData(obj);
      setTemEditMembershipData(temSelMembershipData.filter(service=> {return service.isChecked === true && service}));
    props.toggle();
  };

  const CloseServices = (data) => {
    if (hide.includes(data[0].categoryName)) {
      let index = hide.indexOf(data[0].categoryName);
      hide.splice(index, 1);
    } else {
      hide.push(data[0].categoryName);
    }
    setHide([...hide]);
  };

  const handleOnCheckbox = (e, key) => {
    setChange(true);
    setCleanRepeatObject(!cleanRepeatObject);
    
    if (e.target.checked && e.target.name === "name") {
      selectedCategoryList.push(e.target.value);
    } else if (e.target.name === "name") {
      let index = selectedCategoryList.indexOf(e.target.value);
      selectedCategoryList.splice(index, 1);
      setTemSelMembershipData((prev) => {
        return prev.filter((onedata) => onedata.categoryId !== e.target.id);
      });
    }
    setSelectedCategoryList([...selectedCategoryList]);
    let tempCheckCategoryServices = detailedCategories?.filter((obj) =>{return obj[0]===e.target.value && obj}).flat()[1]  
    setNewSelectedCategoryServices((prev)=>[...prev, tempCheckCategoryServices?.map((service)=>service.serviceName)].flat());
    if (key === "all") {
      if (e.target.checked) {
        let allCategory = categoryList.map((rep) => rep[0]);
        setSelectedCategoryList(allCategory);
      } else {
        setSelectedCategoryList([]);
      }
    } else if (key === "allServices") {
      if (e.target.checked) {
        let allservice = detailedCategories
          .map((rep) => rep[1])
          .flat()
          .map((resp) => resp.serviceName);
        setSelectAllServices(allservice);
        let allservicedetail = detailedCategories.map((rep) => rep[1]).flat();
        setTemSelMembershipData(allservicedetail);
      } else {
        setSelectAllServices([]);
        setTemSelMembershipData(
          temSelMembershipData.map(service => { return ({...service, isChecked: false})})
        );
      }
    }
  };

  const handleOnClick = (e, key) => {
    if (key === "toNext") {
      if (!flag) {
        setTemSelMembershipData([]);
        let initHide = detailedCategories.map((category)=>category[0]);
        setHide(initHide);
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
        .map((resp) => resp.serviceName);
        let selectedservice =  temSelMembershipData.filter((resp)=>resp?.isChecked === true)
        .map((resp) => {if(resp.isChecked === true){return(resp.serviceName) }} );

      if(flag){
        // console.log("hello")
        // selectedservice.push(...newSelectedCategoryServices);
        setSelectAllServices(selectedservice);
        props.setFlag(!flag)
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

  return (
    <div>
      <div className="add-service-mini-modal">
        <div className="add-service-mini-modal-design">
          <div className="modal-header">
            <div className="container-long">
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div className="modal-close" onClick={props.toggle}>
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div className="modal-title alignment-counter-modal-header">
                    <h2>
                      Services: Select {currentPage ? "categories" : "services"}
                    </h2>
                    {/* <div className="membership-service-counter-design">8</div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {currentPage ? (
            <div className="mini-service-membership-modal-body">
              <div className="mini-service-membershio-modal-search">
                <input
                  type="search"
                  placeholder="Search category"
                  onChange={(e) => handleSearch(e)}
                />
                <div className="mini-search-alignment">
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
              <div className="service-select-categories-alignment">
              {selecttrue ? null :
                <div className="treatment-box-design">
                  <div className="treatment-header-grid">
                    <div className="treatment-header-grid-items">
                      <input
                        type="checkbox"
                        onChange={(e) => handleOnCheckbox(e, "all")}
                        checked={
                          selectedCategoryList.length === searchcategory.length
                        }
                      />
                      <h2>Select all categories</h2>
                      {/* <div className="membership-service-counter-design"></div> */}
                    </div> 
                  </div>
                </div> }
              </div>
              <div className="service-select-categories-alignment service-select-categories-box">
                {categoryList.map((category, index) => {
                  return (
                    <div key={index} className="treatment-box-design">
                      <div className="treatment-header-grid">
                        <div className="treatment-header-grid-items">
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
                            onChange={(e) => handleOnCheckbox(e, category[1])}
                          />
                          <h2>{category[0]}</h2>
                          <div className="membership-service-counter-design">
                            {category[1]?.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mini-service-membership-modal-body">
              <div className="mini-service-membershio-modal-search">
                <input
                  type="search"
                  placeholder="Search services"
                  onChange={(e) => HandleSearch(e)}
                />
                <div className="mini-search-alignment">
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
              <div className="service-select-categories-alignment">
                {selecttrue ? null :
                <div className="treatment-box-design">
                  <div className="treatment-header-grid">
                    <div className="treatment-header-grid-items">
                      <input
                        type="checkbox"
                        name="allservices"
                        checked={
                          selectAllServices.length ===
                          detailedCategories.map((obj) => obj[1]).flat().length
                        }
                        onChange={(e) => handleOnCheckbox(e, "allServices")}
                      />
                      <h2>Select all services</h2>
                      {/* <div className="membership-service-counter-design"></div> */}
                    </div>
                  </div>
                </div>
                }
              </div>
              {detailedCategories.map((detailedCategory, index) => {
                return (
                  <div key={index} className="treatment-box-design">
                    <div className="treatment-header-grid">
                      <div className="treatment-header-grid-items">
                        <h2>{detailedCategory[0]}</h2>
                        <div className="membership-service-counter-design">
                          {detailedCategory[1].length}
                        </div>
                      </div>
                      <div className="treatment-header-grid-items">
                        <div
                          className="option-menu-opacity"
                          style={{
                            transform: hide.includes(detailedCategory[0])
                              ? "rotate(360deg)"
                              : "rotate(180deg)",
                          }}
                          onClick={() => CloseServices(detailedCategory[1])}
                        >
                          <img src={Icon} alt="CloseIcon" />
                        </div>
                      </div>
                    </div>
                    {detailedCategory[1]?.map((rep) => {
                      return (
                        <MembershipFreeServicesBlock
                          temSelMembershipData={temSelMembershipData}
                          setTemSelMembershipData={setTemSelMembershipData}
                          // newTemSelMembershipData={newTemSelMembershipData}
                          // setNewTemSelMembershipData={setNewTemSelMembershipData}
                          blockData={rep}
                          selectAllServices={selectAllServices}
                          setSelectAllServices={setSelectAllServices}
                          temAllServiceNames={temAllServiceNames}
                          flag={flag}
                          change={change}
                          hide={hide}
                          editMembership={editMembership}
                          cleanRepeatObject={cleanRepeatObject}
                          setCleanRepeatObject={setCleanRepeatObject}
                          SettingInfo={SettingInfo}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
          <div className="select-categories-modal-footer-alignment">
            <div className="edit-category-alignment-all">
              {!currentPage && (
                <>
                  <div>
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
                  </div>
                  <div onClick={(e) => handleOnClick(e, "toPrev")}>
                    <span>Edit category</span>
                  </div>
                </>
              )}
            </div>
            <div className="count-alignment">
              {currentPage ? (
                selectedCategoryList?.length > 0 ? (
                  <span>
                    {selectedCategoryList?.length} {selectedCategoryList?.length === 1 ? "category selected" : "categories selected"} 
                  </span>
                ) : (
                  <span style={{ opacity: 0.5 }}>0 category selected</span>
                )
              ) : selectAllServices?.length > 0 ? (
                <span>{selectAllServices?.length} {selectAllServices?.length === 1 ? "service selected" : "services selected"  } </span>
              ) : (
                <span style={{ opacity: 0.5 }}>0 services selected</span>
              )}
              {selectedCategoryList?.length > 0 ? (
                !currentPage ? (
                  selectAllServices?.length > 0 ? (
                    <button onClick={() => handleOnSubmit()}>Continue</button>
                  ) : (
                    <button style={{ opacity: 0.5 }}>Continue</button>
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
