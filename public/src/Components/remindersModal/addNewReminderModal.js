import React, { useEffect, useState,useRef } from "react";
import DropDownIcon from "../../assets/svg/drop-down.svg";
import "./remindersModal.scss";
import CloseIcon from "../../assets/svg/new-cl.svg";
import { ApiGet, ApiPost, ApiPut } from "../../helpers/API/ApiData";
import Auth from "../../helpers/Auth";


export default function AddNewReminderModal(props) {
  let userInfo = Auth.getUserDetail();
  const {EditReminder,EditReminderData}=props
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [allCompanyServices, setAllCompanyServices] = useState();
  const [filterCompanyServices, setFilterCompanyServices] = useState();
  const [selectedService, setSelectedService] = useState({});
  const [interval, setInterval] = useState("");
  const selectService = useRef();
  const [search, setSearch] = useState();
  const [edited, setEdited] = useState(false);
  
  useEffect(()=>{
    if(EditReminderData){
      console.log("EditReminderData",EditReminderData)
      setSelectedService(EditReminderData?.serviceIds[0]?.serviceId)
      setInterval(EditReminderData?.serviceIds[0]?.interval)
      setEdited(false)
    }
  },[])
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (subMenuOpen) {
        if (
          subMenuOpen &&
          selectService.current &&
          !selectService.current.contains(e.target)
        ) {
          setSubMenuopen(false);
        }
      } 
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [selectService]);

  useEffect(() => {
    getAllServices();
  }, []);


  const AddNewReminder =async()=>{
    let reminderData={
      serviceIds:[{
          serviceId:selectedService,
          interval:interval
      }],
      companyId:userInfo.companyId
  }

  if(EditReminderData){
    try {
      let res = await ApiPut(`serviceReminder/${EditReminderData?._id}`,reminderData);
      if (res.data.status === 200) {
       EditReminder(true)
      } else {
        console.log("in the else");
       EditReminder(false)
      }
    } catch (err) {
      console.log("error while getting Categories", err);
     EditReminder(false)
    }
  }else{
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

  const OpenMultipleReminder = () => {
    props.setMultipleOpen(true);
    props.setNewreminder(false);
  };

  const getAllServices = async (e) => {
    try {
      let res = await ApiGet("service/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setAllCompanyServices(res.data.data.filter((rep) => rep.default === false));
        setFilterCompanyServices(res.data.data.filter((rep) => rep.default === false));
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const handleServiceSearch = (e) => {
    setSubMenuopen(true);
    setSearch(e.target.value);
    var serviceData =
      allCompanyServices.length > 0 &&
      allCompanyServices.filter(
        (obj) =>
          (obj.serviceName && obj.serviceName.toLowerCase().includes(e.target.value.toLowerCase())) ||
          (obj.quickSearch && obj.quickSearch.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    setFilterCompanyServices(serviceData);
  };
  return (
    <>
      <div className="add-new-reminder-modal-child-blur">
        <div className="reminder-child-modal">
          <div className="modal-header-reminder-child">
            <h1>{EditReminderData ?"Edit reminder": "Add new reminder"}</h1>
            <div onClick={() => props.setNewreminder(false)}>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
          </div>
          <div className="reminder-child-modal-content-alignment">
            <div className="new-option-select">
              <div className="option-select-group">
                <label>Select service</label>
                <div className="relative"  ref={selectService}>
                  <div className="input-relative" onClick={() => {setSubMenuopen(!subMenuOpen);setEdited(true)}}>
                    <input
                      type="text"
                      placeholder={!subMenuOpen ? "Search or select Service" : "Type here"}
                      autoFocus
                      onChange={(e) => handleServiceSearch(e)}
                      value={search || search === "" ? search :selectedService?.serviceName}
                    />
                    <div className="drop-down-icon-center">
                      <img src={DropDownIcon} alt="DropDownIcon" />
                    </div>
                  </div>
                  <div className={subMenuOpen ? "sub-menu-open sub-menu" : "sub-menu sub-menu-close"}>
                    <div className="sub-menu-design">
                      <ul>
                        {filterCompanyServices?.map((service, i) => {
                          return (
                              <div className="service-grid-items"  key={i}
                                onClick={(e) => {
                                  setSelectedService(service);
                                  setSubMenuopen(!subMenuOpen);
                                  setFilterCompanyServices(allCompanyServices)
                                  setSearch()
                                }}>
                              <div className="sub-service-grid">
                                <div
                                  className="service-divider"
                                  style={{
                                    backgroundColor: service.colour,
                                    borderRadius: "5px",
                                    height: "48%",
                                    width:"5px"
                                  }}
                                ></div>
                                <div className="sub-service-grid-items">
                                  <p>{service.serviceName}</p>
                                  <span>
                                  {service.categoryName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="reminder-after-input">
              <label>Reminder after (interval)</label>
              <div className="reminder-input-relative">
                <input type="number" placeholder="e.g. 30" value={interval} onChange={(e)=>{setInterval(e.target.value);setEdited(true)}}/>
                <div className="text-rigth-alignment">
                  <span>days</span>
                </div>
              </div>
            </div>
            <div className="sms-preview-text-alignment">
              <p>SMS preview</p>
              <div className="preview-text-box">
                <span>Dear (Customer name), </span>
                <span>
                  Its time for your for your next <a>{selectedService?.serviceName ? selectedService?.serviceName :"Select service"}</a> , visit Garrison Hair Salon. See you soon
                </span>
              </div>
            </div>
          </div>
          <div className="reminder-footer-alignment">
            {!EditReminderData && <span onClick={() => OpenMultipleReminder()}>Add multiple services</span>}
            {EditReminderData ? edited ? <button onClick={() => AddNewReminder()}>Edit reminder</button>:<button style={{opacity:0.5}}   >Edit reminder</button> :selectedService && interval && interval != 0  ?
            <button onClick={()=>AddNewReminder()}>Add reminder</button>
            :<button style={{opacity:0.5}}>Add reminder</button>}
          </div>
        </div>
      </div>
    </>
  );
}
