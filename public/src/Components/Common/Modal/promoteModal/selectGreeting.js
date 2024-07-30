import React, { useEffect, useState } from "react";
import "./promotemodal.scss";
import RightIcon from "../../../../assets/svg/group-right.svg";
import NewRightArrow from "../../../../assets/svg/new-right.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedGreetingMethod,
  selectedMethod,
  setVisuals,
} from "../../../../redux/actions/promoteActions";
import SearchIcon from "../../../../assets/svg/search-icon.svg";
import socialBarbera from "../../../../assets/img/bookingBarbera.png";
import { motion } from "framer-motion";
import { ApiGet, ApiPost } from "../../../../helpers/API/ApiData";

export default function SelectGreeting() {
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  let SettingInfo = JSON.parse(localStorage.getItem("setting"));
  const dispatch = useDispatch();
  const selectedOption = useSelector((state) => state.selectedOfferReducer);
  const [header, setHeader] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [serviceSelected, setServiceSelected] = useState([]);
  const [offertoService, setOffertoService] = useState([]);
  const [socialMedia, setSocialMedia] = useState(false);
  const [editServiceModal, seteditServiceModal] = useState(false);
  // const [webLink, setWebLink] = useState("");
  const [tinyUrlis, setTinyUrlis] = useState("");
  const [instagramlinked, setInstagramlinked] = useState("");
  const [weblinked, setWeblinked] = useState("");
  const [selectedSocial, setSelectedSocial] = useState("Instagram");
  // const [instagram, setInstagram] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedServicePrice, setSelectedServicePrice] = useState("");
  const [finalSocial, setFinalSocial] = useState("");
  let bookingLink = `https://dev-bookings.barbera.io/?id=${userInfo?.companyId}`;
  // localStorage.setItem("socialType", selectedSocial);
  localStorage.setItem("InstagramLink", instagramlinked);
  localStorage.setItem("WebLink", weblinked);
  localStorage.setItem("BookingLink", bookingLink);
  // localStorage.setItem("webLink", webLink);
  localStorage.setItem("serviceName", selectedService);
  localStorage.setItem("servicePrice", selectedServicePrice);

  const handleOnOptionSelection = (selection) => {
    dispatch(setVisuals(3));
    dispatch(selectedMethod(selection));
  };

  const handleGreetingOptionSelect = (selectedLabel) => {
    dispatch(selectedGreetingMethod(selectedLabel));
    dispatch(setVisuals(3));
  };

  console.log("destroy", instagramlinked)

  // const getServices = async (e) => {
  //   try {
  //     let res = await ApiGet("service/company/" + userInfo.companyId);
  //     if (res.data.status === 200) {
  //       setServiceData(
  //         res.data.data.filter((rep) => rep.default === false)
  //       );
  //     } else {
  //       console.log("in the else");
  //     }
  //   } catch (err) {
  //     console.log("error while getting Categories", err);
  //   }
  // };

  // const getServices = async () => {
  //   await ApiGet("service/company/" + userInfo.companyId)
  //   .then((resp) => {
  //     let filterservice = resp.data.data.filter((obj) =>
  //       obj.categoryName === "Unassign" ? null : obj
  //     );
  //     // console.log("filterservice", filterservice);
  //     setServiceData(filterservice);
  //   });
  // };

  const getServices = async () => {
    await ApiGet("service/company/" + userInfo.companyId)
      .then((resp) => {
        console.log("098765", resp?.data?.data);
        let filterservice = resp?.data?.data?.filter((obj) =>
          obj.categoryName === "Unassign" ? null : obj
        );
        setServiceSelected(filterservice);
        setOffertoService(filterservice);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    switch (selectedOption) {
      case "Offers":
        setHeader("Select the type of offer");
        break;

      case "Send Greetings":
        setHeader("Select a greeting");
        break;

      case "Services":
        setHeader("Select a service");
        getServices();
        break;

      case "Promotions":
        setHeader("Select a platform");
        break;

      default:
        break;
    }
  }, [selectedOption]);

  const handleSelectService = (e, service) => {
    console.log("testing", service);
    setSelectedService(service?.serviceName);
    setSelectedServicePrice(service?.amount);
    seteditServiceModal(!editServiceModal);
  };

  const handleSocialMedia = (e, label) => {
    setSocialMedia(true);
  };

  const handleEditedService = (e) => {
    setSelectedService(e.target.value);
    localStorage.setItem("selected", selectedService);
  };

  const handleSearchingService = (entered) => {
    console.log("}}}}", entered);
    let offertoService = serviceSelected.filter(
      (detail) =>
        detail?.serviceName.toLowerCase().includes(entered) ||
        detail?.categoryName.toLowerCase().includes(entered) ||
        detail?.amount &&
          detail?.amount.toString().includes(entered.toString())
    );
    setOffertoService(offertoService);
  };

  const handleonSocial = (social) => {
    setSocialMedia(true);
    setFinalSocial(social);
    dispatch(selectedMethod(social));
  };

  const bindingInput = (valueis) => {
    if (valueis?.code === "Space") {
      valueis.preventDefault();
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="generate-box-center"
    >
      <div className="generate-box-center">
        <div className="campaign-child-box">
          <div className="campaign-child-header">
            <h1>{header}</h1>
            <div
              className="right-icon-alignment"
              onClick={() => dispatch(setVisuals(1))}
            >
              <img src={RightIcon} alt="RightIcon" />
            </div>
          </div>
          {selectedOption.toLowerCase() === "offers" && (
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                {["General offer", "Festival offers"].map((label) => {
                  return (
                    <div
                      className="greeting-box-design"
                      onClick={() => handleOnOptionSelection(label)}
                    >
                      <span>{label}</span>
                      <img src={NewRightArrow} alt="NewRightArrow" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {selectedOption.toLowerCase() === "send greetings" && (
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                {["Festival greetings", "Special days"].map((label) => {
                  return (
                    <div
                      className="greeting-box-design"
                      onClick={() => handleOnOptionSelection(label)}
                    >
                      <span>{label}</span>
                      <img src={NewRightArrow} alt="NewRightArrow" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {selectedOption.toLowerCase() === "promotions" && (
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                <div
                  className="greeting-box-design"
                  onClick={() => {
                    // setSelectedSocial("Instagram");
                    handleonSocial("Instagram");
                  }}
                >
                  <div className="flex items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 6.5H17.51M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7616 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
                        stroke="#193566"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="ml-3">Instagram</span>
                  </div>
                  <img src={NewRightArrow} alt="NewRightArrow" />
                </div>
                <div
                  className="greeting-box-design"
                  onClick={() => {
                    // setSelectedSocial("Salon website");
                    handleonSocial("Salon website");
                  }}
                >
                  <div className="flex items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5013 19.2616 15.9228 15.708 16 12C15.9228 8.29203 14.5013 4.73835 12 2M12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2M2 12C2 6.47715 6.47715 2 12 2"
                        stroke="#193566"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <span className="ml-3">Salon website</span>
                  </div>
                  <img src={NewRightArrow} alt="NewRightArrow" />
                </div>
                {/* <div
                  className="greeting-box-design"
                  // onClick={() => dispatch(setVisuals(8))}
                  onClick={() => {
                    handleonSocial("Booking");
                    dispatch(setVisuals(8));
                  }}
                  // onClick={() => {
                  //   setSelectedSocial("booking");
                  //   setSocialMedia(true);
                  // }}
                >
                  <div
                    className="flex items-center"
                    // onClick={()=>setVisuals(8)}
                    // onClick={() =>
                    //   window.open(
                    //     "https://dev-bookings.barbera.io/?id=rnsqyntmpkvrfekradifx",
                    //     ""
                    //   )
                    // }
                  >
                    <img src={socialBarbera} alt="booking" />
                    <span className="ml-3">Barbera booking link</span>
                  </div>
                  <img src={NewRightArrow} alt="NewRightArrow" />
                </div> */}
              </div>
            </div>
          )}
          {selectedOption.toLowerCase() === "services" && (
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                <div className="select-service-search right-space-align right-space-align-search-input searchbox-align">
                  <input
                    type="search"
                    name="q"
                    placeholder={"Search service"}
                    autoFocus
                    onChange={(e) => handleSearchingService(e.target.value)}
                  />
                  <div className="search-icon-align">
                    <img src={SearchIcon} alt="SearchIcon" />
                  </div>
                </div>
                {console.log("offertoService", offertoService)}
                {/* {offertoService?.map((service) => { */}
                {offertoService.length === 0 ? (
                  <span>No data Found</span>
                ) : (
                  offertoService?.map((service) => {
                    return (
                      // <h1>Workign Desk {serv?.serviceName}</h1>
                      <div
                        className="select-service-grid right-space-align"
                        onClick={(e) => handleSelectService(e, service)}
                        // onClick={() => seteditServiceModal(true)}
                      >
                        <div className="select-service-grid-items">
                          <h6>{service?.serviceName}</h6>
                          <p>{service?.categoryName}</p>
                        </div>
                        <div className="select-service-grid-items">
                          <h5>
                            <span>{SettingInfo?.currentType}</span>{" "}
                            {service?.amount}
                          </h5>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        {editServiceModal && (
          <div className="edit-searvice-modal-blur-alignment">
            <div className="edit-searvice-modal-design">
              <div className="modal-header-alignment">
                <div onClick={() => seteditServiceModal(false)}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.25 1.25L11.75 11.75"
                      stroke="#193566"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M1.25 11.75L11.75 1.25"
                      stroke="#193566"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <h5>Edit service name</h5>
              </div>
              <div className="selected-service-name-alignment">
                {selectedService.length > 30 && (
                  <div className="grid">
                    <div className="grid-items">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.05967 6.00016C6.21641 5.55461 6.52578 5.1789 6.93298 4.93958C7.34018 4.70027 7.81894 4.61279 8.28446 4.69264C8.74998 4.77249 9.17222 5.01451 9.47639 5.37585C9.78057 5.73718 9.94705 6.19451 9.94634 6.66683C9.94634 8.00016 7.94634 8.66683 7.94634 8.66683M7.99967 11.3335H8.00634M14.6663 8.00016C14.6663 11.6821 11.6816 14.6668 7.99967 14.6668C4.31778 14.6668 1.33301 11.6821 1.33301 8.00016C1.33301 4.31826 4.31778 1.3335 7.99967 1.3335C11.6816 1.3335 14.6663 4.31826 14.6663 8.00016Z"
                          stroke="#97A7C3"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="grid-items">
                      <p>
                        Selected service name contains more than 30 characters.
                        This may affect the per SMS cost
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="edit-service-name-input-alignment">
                <label>Edit service name</label>
                <textarea
                  value={selectedService}
                  onChange={(e) => handleEditedService(e)}
                  placeholder="Hair Strengthening with Intense care"
                  autoFocus
                ></textarea>
                <span>Character count: {selectedService.length}/30</span>
              </div>
              <div className="edit-service-footer-modal-alignemnt">
                <button onClick={() => seteditServiceModal(false)}>
                  Select another service
                </button>
                {selectedService.length > 30 ? (
                  <button onClick={() => dispatch(setVisuals(8))}>
                    Continue anyway
                  </button>
                ) : (
                  <button onClick={() => dispatch(setVisuals(8))}>
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {socialMedia && (
          <div className="edit-searvice-modal-blur-alignment">
            <div className="edit-searvice-modal-design">
              {finalSocial === "Instagram" && (
                <>
                  <div className="modal-header-alignment">
                    <div onClick={() => setSocialMedia(false)}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.25 1.25L11.75 11.75"
                          stroke="#193566"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                        <path
                          d="M1.25 11.75L11.75 1.25"
                          stroke="#193566"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    {/* {selectedSocial === "booking" && <h5>Barbera booking link</h5>} */}
                    <h5>Instagram</h5>
                  </div>
                  <div className="social-media-modal-alignment">
                    <div className="new-input-style">
                      {selectedSocial === "Instagram" && (
                        <label>Enter salon’s instagram account link</label>
                      )}
                      <input
                        type="text"
                        // pattern="\A[A-Za-z][A-Za-z\'\s\-]+\Z"
                        onChange={(e) => setInstagramlinked(e.target.value)}
                        onKeyPress={bindingInput}
                        // onKeyDown={(e) => handleSpacebarInput(e.target.value)}
                        placeholder="copy + paste link here"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="social-media-footer-alignment">
                    {tinyUrlis || instagramlinked || weblinked ? (
                      <button onClick={() => dispatch(setVisuals(8))}>
                        Process Link
                      </button>
                    ) : (
                      <button
                        style={{
                          background: "#1479ff33",
                          cursor: "not-allowed",
                        }}
                      >
                        Process Link
                      </button>
                    )}
                  </div>
                </>
              )}
              {finalSocial === "Salon website" && (
                <>
                  <div className="modal-header-alignment">
                    <div onClick={() => setSocialMedia(false)}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.25 1.25L11.75 11.75"
                          stroke="#193566"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                        <path
                          d="M1.25 11.75L11.75 1.25"
                          stroke="#193566"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    {/* {selectedSocial === "booking" && <h5>Barbera booking link</h5>} */}
                    <h5>Salon website</h5>
                  </div>
                  <div className="social-media-modal-alignment">
                    <div className="new-input-style">
                      <label>Enter salon’s website link</label>
                      <input
                        type="text"
                        onChange={(e) => setWeblinked(e.target.value)}
                        onKeyPress={bindingInput}
                        placeholder="copy + paste link here"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="social-media-footer-alignment">
                    {tinyUrlis || weblinked ? (
                      <button onClick={() => dispatch(setVisuals(8))}>
                        Process Link
                      </button>
                    ) : (
                      <button
                        style={{
                          background: "#1479ff33",
                          cursor: "not-allowed",
                        }}
                      >
                        Process Link
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Makarsankranti
// Holi
// Rakshabandhan
// Janmasthami
// Ganesh Chaturthi
// Navratri
// Diwali
// Christmas
