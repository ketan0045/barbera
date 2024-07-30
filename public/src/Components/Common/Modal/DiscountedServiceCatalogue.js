import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import Icon from "../../../assets/svg/Vectors.svg";


export default function DiscountedServiceCatalogue(props,SettingInfo) {
  const userInfo = Auth.getUserDetail();

  const [selectedServices, setSelectedServices] = useState([]);
  const [hide, setHide] = useState([]);

  const getMembershipDetails = async (e) => {
    let res = await ApiGet("membership/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        const serviceIdList = res.data.data[0].selectedServices
          .filter((resp) => resp.serviceId)
          .map((rep) => rep.serviceId);
        getServices(serviceIdList);
      }
    } catch (err) {
      console.log("in the catch");
    }
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





  const getServices = async (serviceIdList) => {
    let payload = {
      serviceId: serviceIdList,
    };
    let res = await ApiPost(
      "service/category/company/serviceId/" + userInfo.companyId,
      payload
    );
    try {
      if (res.data.status === 200) {
        let item = Object.entries(res.data.data);
        setSelectedServices(item);
      }
    } catch {
      console.log("went to catch");
    }
  };

  useEffect(() => {
    getMembershipDetails();
  }, []);

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
                <h1>Services</h1>
              </div>
            </div>
          </div>
          <div className="membership-modal-body">
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
            <div className="m-grid-row top-bottom-selected"></div>
            {selectedServices.length > 0 &&
              selectedServices?.map((selectedService) => {
                return (
                  <div key={selectedService._id} className="group-design-m">
                    <div className="m-grid-row row-space">
                      <div className="m-grid-row-items">
                        <div className="alignment-all-content">
                          <div>
                            <h5>{selectedService[0]}</h5>
                          </div>
                          <div className="counter-design">1</div>
                        </div>
                      </div>
                      <div className="m-grid-row-items">
                        <div className="m-sub-grid-row">
                          <div className="m-sub-grid-row-items"></div>
                          <div className="m-sub-grid-row-items">
                            <span>percentageee</span>
                          </div>
                          <div className="m-sub-grid-row-items">
                            <span>rupeesssss</span>
                          </div>
                          <div className="m-sub-grid-row-items">
                            <div className="apply-to-all colleps-end-side">
                              <div className="option-menu-opacity"
                               style={{
                                transform: hide.includes(selectedService[0])
                                  ? "rotate(360deg)"
                                  : "rotate(180deg)",
                              }}

                              onClick={() => CloseServices(selectedService[1])}
                              >
                                 <img src={Icon} alt="CloseIcon" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedService[1]?.map((selectedService) => {
                      return (
                        <div
                          key={selectedService._id}
                          className="m-grid-row row-space"
                        >
                          <div className="m-grid-row-items">
                            <div className="alignment-all-content">
                              <div>
                                <h5>{selectedService?.serviceName}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="m-grid-row-items">
                            <div className="m-sub-grid-row last-child-text-end-side">
                              <div className="m-sub-grid-row-items">
                                <span>{SettingInfo?.currentType} {selectedService?.amount}</span>
                              </div>
                              <div className="m-sub-grid-row-items">
                                <span>percentage</span>
                              </div>
                              <div className="m-sub-grid-row-items">
                                <span>rupee</span>
                              </div>
                              <div className="m-sub-grid-row-items">
                                <span>total</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
