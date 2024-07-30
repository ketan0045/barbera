import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svg/new-cl.svg";
import SearchIcon from "../../assets/svg/reminder-search.svg";
import { ApiGet, ApiPost } from "../../helpers/API/ApiData";
import Auth from "../../helpers/Auth";

export default function ReminderMultipleServices(props) {
  let userInfo = Auth.getUserDetail();
  const [detailedCategories, setDetailedCategories] = useState([]);
  const [alldetailedCategories, setAllDetailedCategories] = useState([]);
  const [tempdetailedCategories, setTempDetailedCategories] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedService, setSelectedService] = useState([]);
  const [selectAllServices, setSelectAllServices] = useState([]);
  const [daydetailedCategories, setDayDetailedCategories] = useState([]);
  const [error,setError]=useState(false)
  console.log("detailedCategories", detailedCategories);
  useEffect(() => {
    getAllServicesCategories();
  }, []);

  const getAllServicesCategories = async () => {
    let res = await ApiGet("service/category/company/serviceData/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        let item = Object.entries(res.data.data);
        let filterDat = item.filter((obj) => obj[0] !== "Unassign");
        setDetailedCategories(filterDat);
        setAllDetailedCategories(filterDat);

        let tempitem = filterDat?.map((data) => {
          return data[1];
        });
        var merged = [].concat.apply([], tempitem);

        setTempDetailedCategories(merged);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const HandleSearch = (e) => {
    setSearchValue(e.target.value)
    var serviceData =
      tempdetailedCategories.length > 0 &&
      tempdetailedCategories.filter(
        (obj) =>
          (obj.serviceName && obj.serviceName?.toLowerCase().includes(e.target.value.toLowerCase())) ||
          (obj.categoryName && obj.categoryName?.toLowerCase().includes(e.target.value.toLowerCase()))
      );

    var _ = require("lodash");
    let response = _.groupBy(serviceData, "categoryName");
    const ListData = Object.entries(response);


    if (e.target.value === "") {
      setDetailedCategories(alldetailedCategories);
      setSearch(false);
    } else {
      setDetailedCategories(ListData);
      setSearch(true);
    }
  };

  const handleSelectService = (service) => {
    selectAllServices.push(service);
    setSelectAllServices([...selectAllServices]);
  };

  const ServiceIntervalHandler = (e, service) => {
    let newdetailedCategory = alldetailedCategories?.map((cat) => {
      let newCategory = cat[1].map((serv) => {
        if (serv?._id === service?._id) {
          let newData = { ...serv, interval: e.target.value };
          return newData;
        } else {
          return serv;
        }
      });
      return [cat[0], newCategory];
    });
  
   
    setAllDetailedCategories(newdetailedCategory)
    let tempitem = newdetailedCategory?.map((data) => {
      return data[1];
    });
    var merged = [].concat.apply([], tempitem);

    setTempDetailedCategories(merged);
    if(searchValue){
      var serviceData =
      merged.length > 0 &&
      merged.filter(
        (obj) =>
          (obj.serviceName && obj.serviceName?.toLowerCase().includes(searchValue.toLowerCase())) ||
          (obj.categoryName && obj.categoryName?.toLowerCase().includes(searchValue.toLowerCase()))
      );

    var _ = require("lodash");
    let response = _.groupBy(serviceData, "categoryName");
    const ListData = Object.entries(response);
    setDetailedCategories(ListData)
    }else{
      setDetailedCategories(newdetailedCategory)
    }
    
  };
  const CategoryIntervalHandler = (e, category) => {
    let newdetailedCategory = alldetailedCategories?.map((cat) => {
      let newCategory = cat[1].map((serv) => {
        if (serv?.categoryName === category) {
          let newData = { ...serv, categoryInterval: e.target.value };
          return newData;
        } else {
          return serv;
        }
      });
      return [cat[0], newCategory];
    });
    setDetailedCategories(newdetailedCategory)
    setAllDetailedCategories(newdetailedCategory)
    let tempitem = newdetailedCategory?.map((data) => {
      return data[1];
    });
    var merged = [].concat.apply([], tempitem);

    setTempDetailedCategories(merged);
    
  };
  const AddintervalsForService = (value, category) => {
    let newdetailedCategory = alldetailedCategories?.map((cat) => {
      let newCategory = cat[1].map((serv) => {
        if (serv?.categoryName === category) {
          if(!selectAllServices?.includes(serv?.serviceName)){
          selectAllServices?.push(serv?.serviceName)
          setSelectAllServices([...selectAllServices])
          }
          let newData = { ...serv, interval: value };
          return newData;
        } else {
          return serv;
        }
      });
      return [cat[0], newCategory];
    });
    setDetailedCategories(newdetailedCategory)
    setAllDetailedCategories(newdetailedCategory)
    let tempitem = newdetailedCategory?.map((data) => {
      return data[1];
    });
    var merged = [].concat.apply([], tempitem);

    setTempDetailedCategories(merged);
    
  };

  const AddMultiReminder=async()=>{
    let tempitem = detailedCategories?.map((data) => {
      return data[1];
    });
    var merged = [].concat.apply([], tempitem);
    let  intervalData=merged?.map((temp)=>{
      if(temp?.interval){
        return(
          temp
          )
      }
      
    })  
    console.log("days-input",intervalData,merged,selectAllServices)

    if(intervalData?.filter((obj)=>obj != undefined)?.length !==  selectAllServices?.length){
      setError(true)
    }else{
      setError(false)
      let serviceId=intervalData?.filter((obj)=>obj != undefined)?.map((data)=>{
        return(
          {
            serviceId:data,
            interval:data?.interval
          }
        )
      })

      let reminderData={
        serviceIds:serviceId,
        companyId:userInfo.companyId
      }
      try {
        let res = await ApiPost("serviceReminder",reminderData);
        if (res.data.status === 200) {
          props.toggle(true)
        } else {
          console.log("in the else");
          props.toggle(false)
        }
      } catch (err) {
        console.log("error while getting Categories", err);
        props.toggle(false)
      }

    }
  }

  return (
    <>
      <div className="reminder-multiple-services-modal-blur">
        <div className="reminder-multiple-services">
          <div className="modal-header-reminder-child">
            <h1>Add new reminder: Multiple services</h1>
            <div onClick={() => props.setMultipleOpen(false)}>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
          </div>
          <div className="reminder-multiple-body-content-alignment">
            <div className="reminder-multiple-input">
              <input type="search" placeholder="Search services"value={searchValue} autoFocus onChange={(e) => HandleSearch(e)} />
              <div className="search-icon-alignment">
                <img src={SearchIcon} alt="SearchIcon" />
              </div>
            </div>
            <div className="all-box-bottom-content-alignment">
              {detailedCategories?.map((category, i) => {
                return (
                  <div className="boder-box-content-design" key={i}>
                    <div className="first-header">
                      <div className="text-cumb-alignment">
                        <p>{category[0]}</p>
                        <button>{category[1]?.length}</button>
                      </div>
                      {!search && (
                        <div className="button-input-alignment">
                          <div className="days-input">
                            <input type="number"  value={category[1][0]?.categoryInterval} onChange={(e) => CategoryIntervalHandler(e, category[0])} />
                            <div className="days-text-alignment">
                              <span>days</span>
                            </div>
                          </div>
                          {category[1][0]?.categoryInterval ?
                           <div className="apply-text" onClick={()=>AddintervalsForService(category[1][0]?.categoryInterval,category[0])}>
                           <span>Apply</span>
                         </div>:
                          <div className="apply-text" style={{opacity:"0.5"}}>
                            <span>Apply</span>
                          </div>}
                        </div>
                      )}
                    </div>
                    <div className="sec-content-all-alignment">
                      {category[1]?.map((serv) => {
                        return (
                          <div className="service-content-box-design">
                            <div>
                              <h5>{serv?.serviceName}</h5>
                              <p>
                                <a>₹</a> {serv?.amount}
                              </p>
                            </div>
                            {!selectAllServices?.includes(serv?.serviceName) ? (
                              <div onClick={() => handleSelectService(serv?.serviceName)}>
                                <button>Select</button>
                              </div>
                            ) : (
                              <div className={error && (serv?.interval == undefined || serv?.interval == "" )?  "days-input days-input-red"  :"days-input"}>
                                <input type="number" value={serv?.interval} onChange={(e) => ServiceIntervalHandler(e, serv)} />
                                <div className="days-text-alignment">
                                  <span>days</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {selectAllServices?.length > 0 ?
           <div className="save-chnage-button-center-alignment" onClick={()=>AddMultiReminder()}>
           <button>Save changes</button>
         </div>:
          <div className="save-chnage-button-center-alignment" style={{opacity:"0.5"}} >
            <button>Save changes</button>
          </div>}
        </div>
      </div>
    </>
  );
}
