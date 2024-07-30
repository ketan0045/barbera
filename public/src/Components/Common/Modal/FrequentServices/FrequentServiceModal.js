import React, { useEffect, useState } from "react";
import "../Modal.scss";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import { ApiGet, ApiPost } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import Icon from "../../../../assets/svg/Vectors.svg";
import { CloudWatchLogs } from "aws-sdk";
import "./Frequentservicemodal.scss";
import RightIcon from "../../../../assets/svg/Checked.svg";
import SearchIcon from "../../../../assets/svg/search.svg";

import Success from "../../../Common/Toaster/Success/Success";
export default function FrequentServiceModal(props) {
  const {
    allServices,
    getAllServices,
    frequentServices,
    setFrequentServices,
    setToastmsg,
    setSuccess,
    setEr,
    fsChange,
    setFsChange,
  } = props;
  const [tempFrequentServices, setTempFrequentServices] = useState(frequentServices);
  const [tempAllServices, setTempAllServices] = useState(allServices);
  const [search, setSearch] = useState("");
  const [tempSearchServices, setTempSearchServices] = useState(allServices);
  const [flag, setFlag] = useState(false);

  const handleSelectService = (service, key) => {
    setFsChange(true);
    let newServices = tempAllServices?.map((ser) => {
      return {
        ...ser,
        frequentService: ser?._id === service?._id ? !ser?.frequentService : !!ser?.frequentService,
      };
    });
    setTempAllServices(newServices);
    setTempSearchServices(newServices);

    // let newFrequentServices = tempFrequentServices?.map((ser) => {
    //   return {
    //     ...ser,
    //     frequentService:
    //       ser?._id === service?._id ? !ser?.frequentService : ser?.frequentService,
    //   };
    // });
    // setTempFrequentServices(newFrequentServices);
    if (key === "add") {
      setTempFrequentServices([
        ...tempFrequentServices,
        { ...service, frequentService: true, index: tempFrequentServices?.length },
      ]);
    } else if (key === "remove") {
      let tempSelectedServices = tempFrequentServices?.map((ser, i) => {
        return {
          ...ser,
          frequentService: ser?._id === service?._id ? false : !!ser?.frequentService,
          index:
            !ser?.index && ser?.index === 0 ? 0 : !ser?.index ? i : ser?.index ? ser?.index : i,
        };
      });
      setTempFrequentServices(tempSelectedServices);
    }
  };

  const handleContinue = async (e) => {
    let finalFrequentServices = await tempFrequentServices?.map((ser, i) => ({
      ...ser,
      index: !ser?.index && ser?.index === 0 ? 0 : !ser?.index ? i : ser?.index ? ser?.index : i,
    }));
    setFrequentServices(finalFrequentServices);
    let payload = { data: finalFrequentServices };
    // console.log("***payload", payload);
    let serviceUpdateRes = await ApiPost("service/seviceList", payload);
    if (serviceUpdateRes?.status === 200) {
      // console.log("service res",serviceUpdateRes?.data?.data)
      props.toggle();
      // getAllServices(serviceUpdateRes?.data?.data)
      getAllServices();
      setSuccess(true);
      setToastmsg("Changes Saved!");
    } else {
      setEr("Error");
      setToastmsg("Something went wrong!");
    }
  };

  useEffect(() => {
    if (flag) {
      if (!!search) {
        let filteredServices = allServices?.filter(
          (ser) =>
            ser?.serviceName?.toLowerCase().includes(search?.toLowerCase()) ||
            ser?.categoryName?.toLowerCase().includes(search?.toLowerCase()) ||
            ser?.amount.toString().includes(search?.toLowerCase()) ||
            ser?.duration.toString().includes(search?.toLowerCase()) ||
            ser?.quickSearch?.toLowerCase().includes(search?.toLowerCase())
        );
        setTempAllServices(filteredServices);
      } else {
        let tempServices = allServices?.map((service) => {
          let isSelected = tempFrequentServices?.find(
            (ser) => ser?._id === service?._id
          )?.frequentService;
          return { ...service, frequentService: isSelected };
        });
        setTempAllServices(tempServices);
      }
    }
    return () => {
      setFlag(false);
      setFsChange(false);
      setTempAllServices([]);
    };
  }, [search]);

  return (
    <div>
      <div className="add-servicefrequent-mini-modal">
        <div className="add-service-mini-modal-design">
          <div className="modal-header-servicefrequent">
            <div className="container-long">
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div onClick={() => props.toggle()} className="modal-close">
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div className="modal-title alignment-counter-modal-header-servicefrequent">
                    <h2>Frequent services: Select services</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="serchbardesign">
            <div className="inventory-search">
              <img src={SearchIcon} alt="SearchIcon" />
              <input
                type="search"
                onChange={(e) => {
                  setFlag(true);
                  setSearch(e.target.value);
                }}
                value={search}
                placeholder="Search service or category"
              />
            </div>
          </div>

          <div className="mini-service-Frquent-modal-body">
            {tempAllServices?.map((service, index) => {
              let isSelected = service?.frequentService;
              // let isSelected = tempSearchServices?.find((ser)=>ser?._id === service?._id)?.frequentService;
              return (
                !service?.default && (
                  <div
                    className={`treatment-box-design ${isSelected && "bluebackground"}`}
                    onClick={(e) => handleSelectService(service, isSelected ? "remove" : "add")}
                  >
                    <div className="treatment-header-grid">
                      <div className="treatment-header-grid-items">
                        <div
                          className="treatement-head-color"
                          style={{
                            backgroundColor: service?.colour,
                          }}
                        ></div>

                        <div>
                          <h2 className="treatment-heading">{service?.serviceName}</h2>
                          <h2 className="treatment-heading categoryname">
                            {service?.categoryName || "N/A"}
                          </h2>
                        </div>

                        <div className="ratedetails ratedetails-new-style">
                          <div className="ratedetails">
                            <h3 className="minute ratePadding">{service?.duration} mins</h3>
                            <h4> <a> ₹ </a> {service?.amount} </h4>
                          </div>
                          <div className="RightImageSize">
                            {isSelected && (
                              <img className="RightImageSize" src={RightIcon} alt="Checked" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              );
            })}

            <hr className="lineboder"></hr>
          </div>
          <div className="footercontine">
            <h3 className="selectedService">
              {tempFrequentServices?.filter((ser) => ser?.frequentService)?.length} services
              selected
            </h3>
            <div className="btndesign" style={{ opacity: !fsChange && "50%" }}>
              <button className="btntext" onClick={(e) => handleContinue(e)} disabled={!fsChange} style={{ cursor: !fsChange && 'default'}}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="treatment-box-design bluebackground">
<div className="treatment-header-grid">
  <div className="treatment-header-grid-items">
    <div
      className="treatement-head-color"
      style={{
        backgroundColor: "red",
      }}
    ></div>

    <div>
      <h2 className="treatment-heading">Hair Wash</h2>
      <h2 className="treatment-heading categoryname">Category name</h2>
    </div>

    <div className="ratedetails">
      <div className="ratedetails">
        <h3 className="minute ratePadding">00 mins</h3>
        <h3 className="rateNumber">₹ 3000</h3>
      </div>
      <div>
        <img className="RightImageSize" src={RightIcon} alt="Checked" />
      </div>
    </div>
  </div>
</div>
</div>

<div className="treatment-box-design ">
<div className="treatment-header-grid">
  <div className="treatment-header-grid-items">
    <div
      className="treatement-head-color"
      style={{
        backgroundColor: "red",
      }}
    ></div>

    <div>
      <h2 className="treatment-heading">Hair Wash</h2>
      <h2 className="treatment-heading categoryname">Category name</h2>
    </div>

    <div className="ratedetails">
      <div className="ratedetails">
        <h3 className="minute ratePadding">00 mins</h3>
        <h3 className="rateNumber">₹ 3000</h3>
      </div>
      <div className="RightImageSize">
        {/* <img className="RightImageSize" src={RightIcon} alt="Checked" /> 
      </div>
    </div>
  </div>
</div>
</div> */
}
