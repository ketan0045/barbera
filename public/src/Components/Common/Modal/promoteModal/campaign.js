import React, { useState } from "react";
import "./promotemodal.scss";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import SelectGreeting from "./selectGreeting";
import SelectFestival from "./selectFestival";
import CampaignOptions from "./CampaignOptions";
import { useSelector } from "react-redux";
import ServiceOptions from "./ServiceOptions";
import DiscountValue from "./discountValue";
import Offerexpiry from "./Offerexpiry";
import ScheduleCampaign from "./ScheduleCampaign";
import MakePayment from "./makePayment";
import { motion } from "framer-motion";
import SpecificService from "./SpecificService";
import CustomerModal from "./CustomerModal";
import EditService from "./EditService";

export default function Promotemodal(props) {
  const { toggle, setCampaignModal, success, setSuccess } = props;
  console.log("toggle", toggle);
  const currentVisual = useSelector((state) => state.visualAidReducer);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="generate-box-center"
    >
      <div className="campaign-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div className="modal-close" onClick={toggle}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Create New Campaign</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="campaign-modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <>{currentVisual === 1 && <CampaignOptions />}</>
              <>{currentVisual === 2 && <SelectGreeting />}</>
              <>{currentVisual === 3 && <SelectFestival />}</>
              <>{currentVisual === 4 && <ServiceOptions />}</>
              <>{currentVisual === 5 && <SpecificService />}</>
              <>{currentVisual === 6 && <DiscountValue />}</>
              <>{currentVisual === 7 && <Offerexpiry />}</>
              <>{currentVisual === 8 && <ScheduleCampaign />}</>
              <>
                {currentVisual === 9 && (
                  <MakePayment
                    toggle={toggle}
                    setCampaignModal={setCampaignModal}
                    success={success}
                    setSuccess={setSuccess}
                  />
                )}
              </>
              {/* <>{currentVisual === 4 && <ServiceOptions />}</> */}
              {/* <>{currentVisual === 1 && <DiscountValue />}</> */}
              {/* <>{currentVisual === 1 && <Offerexpiry />}</> */}
              {/* <>{currentVisual === 1 && <ScheduleCampaign />}</> */}
              {/* <>{currentVisual === 1 && <MakePayment />}</> */}
              {/* <>{currentVisual === 2 && <CustomerModal />}</> */}
              {/* <>{currentVisual === 2 && <EditService />}</> */}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
