import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMainService,
  selectedMethod,
  setVisuals,
} from "../../../../redux/actions/promoteActions";
import RightIcon from "../../../../assets/svg/group-right.svg";
import NewRightArrow from "../../../../assets/svg/new-right.svg";
import { motion } from "framer-motion";

export default function ServiceOptions() {
  const dispatch = useDispatch();
  const [header, setHeader] = useState("Select from the following");
  const services = [
    "All Services",
    "Selected Services",
  ]; /* "Single Category","Single Service" */
  const selectedService = useSelector(
    (state) => state.selectedMainServiceReducer
  );
  const selectedMethod = useSelector((state) => state.selectedMethodReducer);
  const selectedGreeting = useSelector(
    (state) => state.selectedGreetingReducer
  );
  const handleSelectedServiceOption = (selection) => {
    dispatch(selectedMainService(selection));
    dispatch(setVisuals(5));
  };

  console.log("123456789", selectedGreeting);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="generate-box-center"
    >
      <div className="generate-box-center">
        <div className="campaign-child-box">
          <div className="campaign-child-header">
            <h1>{header}</h1>
            {selectedMethod === "General offer" && (
              <div
              className="right-icon-alignment"
              onClick={() => dispatch(setVisuals(2))}
            >
              <img src={RightIcon} alt="RightIcon" />
            </div>
            )}
             {selectedMethod === "Festival offers" && (
              <div
              className="right-icon-alignment"
              onClick={() => dispatch(setVisuals(3))}
            >
              <img src={RightIcon} alt="RightIcon" />
            </div>
            )}
            {selectedMethod === "Special days" && (
              <div
              className="right-icon-alignment"
              onClick={() => dispatch(setVisuals(3))}
            >
              <img src={RightIcon} alt="RightIcon" />
            </div>
            )}
            {selectedMethod === "Festival greetings" && (
              <div
              className="right-icon-alignment"
              onClick={() => dispatch(setVisuals(3))}
            >
              <img src={RightIcon} alt="RightIcon" />
            </div>
            )}
          </div>
          <div className="campaign-child-body">
            <div className="all-list-box-alignment-greeting">
              {services.map((service) => {
                return (
                  <div
                    className="greeting-box-design"
                    onClick={() => handleSelectedServiceOption(service)}
                  >
                    <span>{service}</span>
                    <img src={NewRightArrow} alt="NewRightArrow" />
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
