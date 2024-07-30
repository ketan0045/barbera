import React from "react";
import DiscountIcon from "../../../../assets/svg/discount.svg";
import SmaileIcon from "../../../../assets/svg/smile.svg";
import ScissorIcon from "../../../../assets/svg/scissorPromote.svg";
import SendIcon from "../../../../assets/svg/send-icon.svg";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  selectedMethod,
  selectedOffer,
  setVisuals,
} from "../../../../redux/actions/promoteActions";

function CampaignOptions() {
  const dispatch = useDispatch();

  const offerOptions = [
    {
      img: DiscountIcon,
      label: "Offers",
      description:
        "Offer discounts on festivals or to boost sales something something",
    },
    {
      img: SmaileIcon,
      label: "Send Greetings",
      description:
        "Offer discounts on festivals or to boost sales something something",
    },
    {
      img: ScissorIcon,
      label: "Services",
      description:
        "Offer discounts on festivals or to boost sales something something",
    },
    {
      img: SendIcon,
      label: "Promotions",
      description:
        "Offer discounts on festivals or to boost sales Insta, blog, b2b2c",
    },
  ];

  const handleOnOptionSelection = (option) => {
    dispatch(setVisuals(2));
    dispatch(selectedOffer(option.label));
    if(option.label === "Services"){
    dispatch(selectedMethod(option.label))
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="generate-box-center"
    >
      <div className="generate-box-center">
        <div className="campaign-child-box">
          <div className="campaign-child-header">
            <h1>Start a new campaign for</h1>
          </div>
          <div className="campaign-child-body">
            <div className="intro-box-alignment">
              {offerOptions.map((option) => {
                return (
                  <div
                    className="intro-box-design"
                    onClick={() => handleOnOptionSelection(option)}
                  >
                    <div className="text-icon-modal-grid">
                      <div className="text-icon-modal-grid-items">
                        <div className="icon-box-design">
                          <img src={option.img} alt="DiscountIcon" />
                        </div>
                      </div>
                      <div className="text-icon-modal-grid-items">
                        <h2>{option.label}</h2>
                        <span>{option.description}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CampaignOptions;
