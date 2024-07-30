import React, { useState } from "react";
import { toast } from "react-toastify";
import DragMenuIcon from "../../../../assets/svg/drag-menu.svg";
import EditIcon from "../../../../assets/svg/edit-icon.svg";
import { ApiPost } from "../../../../helpers/API/ApiData";

function FrequentServices(props) {
  const {
    handleOnToggle,
    OpenFrequentServiceModal,
    setOpenFrequentServiceModal,
    OpenFrequentModal,
    allServices,
    frequentServices,
    setFrequentServices,
    enableFrequentServices,
    setEnableFrequentServices,
  } = props;
  const [dragId, setDragId] = useState();

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = async (ev) => {
    let tempFrequentServices = frequentServices;
    const dragBox = tempFrequentServices.find((pm) => pm._id === dragId);
    const dropBox = tempFrequentServices.find((pm) => pm._id === ev.currentTarget.id);

    const newBoxState = await tempFrequentServices.map((ser, i) => {
      return ser?._id !== dragBox?._id && ser?._id !== dropBox?._id
        ? {
            ...ser,
            index:
              !ser?.index && ser?.index === 0 ? 0 : !ser?.index ? i : ser?.index ? ser?.index : i,
          }
        : ser?._id === dragBox?._id
        ? { ...ser, index: dropBox?.index }
        : ser?._id === dropBox?._id && { ...ser, index: dragBox?.index };
    });
    const sortedNewBoxState = await newBoxState?.sort((a, b) => {
      return a.index - b.index;
    });
    setFrequentServices(sortedNewBoxState);
    let payload = { data: sortedNewBoxState };
   
    await ApiPost("service/seviceList", payload);
  };

  return (
    <div className="setting-sub-grid-items frequentService-container-right-remove">
      <div className="frequentService-container">
        <div>
          <div className="frequest">
            <div className="frequesttext">Frequent service in invoices</div>
            <div>
              <label class="switch">
                <input
                  type="checkbox"
                  checked={enableFrequentServices}
                  onClick={(e) => handleOnToggle(e, "frequentServices")}
                />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          {enableFrequentServices && (
            <>
              <div className="frequemargin">
                <div className="frequesttext">Frequent services</div>
                <div>
                  <h6 className="editIcon">
                    <img src={EditIcon} alt="EditIcon" />
                    <span className="editText" onClick={() => OpenFrequentModal()}>
                      Edit
                    </span>
                  </h6>
                </div>
              </div>
              <div className="frequentService-item-contain-height">
                {frequentServices?.map((service, index) => {
                  return (
                    service?.frequentService && (
                      <div
                        className="frequentService-item-contain"
                        id={service._id}
                        draggable={true}
                        onDragOver={(ev) => ev.preventDefault()}
                        onDragStart={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="frequentService-item-flex">
                          <div className="frequentService-item-center">
                            <div className="new-change-alignment">
                              <img
                                src={DragMenuIcon}
                                alt="DragMenuIcon"
                                className="frequentService-DrageMenuSize"
                              />
                            </div>

                            <div className="flex items-center relative">
                              <div
                                className="frequentService-partline"
                                style={{
                                  backgroundColor: service?.colour,
                                }}
                              ></div>

                              <div className="frequentService-detailsabout">
                                <div className="frequentService-detailsabout-space">
                                  <h2>{service?.serviceName}</h2>
                                </div>
                                <div className="frequentService-detailsabout-space">
                                  <h2 className="categoryname">{service?.categoryName}</h2>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="frequentService-rateDetails">
                            <div className="frequentService-minterate">
                              <h3>{service?.duration} mins</h3>
                            </div>
                            <div className="frequentService-ratePrice">
                              <h3> <a> ₹ </a> {service?.amount}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
                {/* 
            <div className="frequentService-item-contain">
              <div className="frequentService-item-flex">
                <div className="frequentService-item-center">
                  <div>
                    <img
                      src={DragMenuIcon}
                      alt="DragMenuIcon"
                      className="frequentService-DrageMenuSize"
                    />
                  </div>

                  <div className="flex">
                    <div
                      className="frequentService-partline"
                      style={{
                        backgroundColor: "red",
                      }}
                    ></div>

                    <div className="frequentService-detailsabout">
                      <div className="frequentService-detailsabout-space">
                        <h2>Hair Wash</h2>
                      </div>
                      <div className="frequentService-detailsabout-space">
                        <h2 className="categoryname">Category name</h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="frequentService-rateDetails">
                  <div className="frequentService-minterate">
                    <h3>00 mins</h3>
                  </div>
                  <div className="frequentService-ratePrice">
                    <h3>₹ 3000</h3>
                  </div>
                </div>
              </div>
            </div> */}
              </div>
            </>
          )}
        </div>

        {/* <div className="servicebox">
      <div className="service-details">
        <div className="serviceIcon">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21C7.65685 21 9 19.6569 9 18Z"
              stroke="#97A7C3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 18C21 16.3431 19.6569 15 18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18Z"
              stroke="#97A7C3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 4L15.88 15.88"
              stroke="#97A7C3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.48 9.53L20 4"
              stroke="#97A7C3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.12 15.88L12 12"
              stroke="#97A7C3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div className="serviceTitleFont">
          No services saved as frequent services
        </div>

        <div className="servicedetailstext">
          Click on <span className="editTextcolor">Edit</span> to save
          best selling services as frequent service Frequent services
          helps you generate invoices quickly
        </div>
      </div>
    </div> */}
      </div>
    </div>
  );
}

export default FrequentServices;
