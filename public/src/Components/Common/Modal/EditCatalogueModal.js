import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import Icon from "../../../assets/svg/Vectors.svg";
import { CloudWatchLogs } from "aws-sdk";

export default function EditCatalogueModal(props) {
  const userInfo = Auth.getUserDetail();
  const {membershipData , SettingInfo}=props
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedServiceLength, setSelectedServiceLength] = useState("");
  const [hide, setHide] = useState([]);
  const [response, setResponse] = useState();

  useEffect(()=>{
    var _ = require("lodash");
       const memdata = membershipData.filter((data)=> data.isChecked === true )
        let response = _.groupBy(memdata, "categoryName");
        let item1 = Object.entries(response);
        const data1 = item1.map ((res)=>{
          return (
            res[1]
          )
        }).flat()
        setSelectedServiceLength(data1?.length);
        setSelectedServices(item1);
  },[membershipData])

  const CloseServices = (data) => {
   
    if (hide.includes(data[0]?.categoryName)) {
      let index = hide.indexOf(data[0]?.categoryName);
      hide.splice(index, 1);
    } else {
      hide.push(data[0]?.categoryName);
    }
    setHide([...hide]);
  }
  const data = response?.selectedServices?.filter((item) => item.categoryName === hide[0])
  return (
    <div>
      <div className="add-service-mini-modal">
        <div className="add-service-mini-modal-design">
          <div className="modal-header">
            <div className="container-long">
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div onClick={() => props.toggle()} className="modal-close">
                    <img src={CloseIcon} alt="CloseIcon" />
                  </div>
                  <div className="modal-title alignment-counter-modal-header">
                    <h2>Services</h2>
                    <div className="membership-service-counter-design">
                      {selectedServiceLength}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mini-service-membership-modal-body">
            {selectedServices.length > 0 &&
              selectedServices.map((selectedService) => {
                return (
                  <div
                    key={selectedService._d}
                    className="treatment-box-design"
                  >
                    <div className="treatment-header-grid">
                      <div className="treatment-header-grid-items">
                        <div className="treatement-head-color" style={{
                          backgroundColor:  selectedService[1][0].colour,
                        }}>
                        </div>
                        <h2 className="treatment-heading">{selectedService && selectedService[0]}</h2>
                        <div className="membership-service-counter-design">
                          {selectedService[1]?.length}
                        </div>
                      </div>
                      <div className="treatment-header-grid-items">
                        <div className="open-close-button"
                          style={{ transform: hide.includes(selectedService[0]) ? "rotate(180deg)" : "rotate(360deg)" }}
                          onClick={() => CloseServices(selectedService[1])}>
                          <img src={Icon} alt="CloseIcon" />
                        </div>
                      </div>
                    </div>
                    {hide.includes(selectedService[0]) && (selectedService[1]?.map((selectedService) => {
                      return (
                        <div
                          key={selectedService._id}
                          className="left-right-alignment-tratment"
                        >
                          <p>{selectedService?.serviceName}</p>
                          <p>
                            <a>{SettingInfo?.currentType}</a> {selectedService?.finalDiscountedAmount}&nbsp;&nbsp;
                            <del><a>{SettingInfo?.currentType}</a> {selectedService?.amount}</del>
                          </p>
                        </div>
                      );
                    }))}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
