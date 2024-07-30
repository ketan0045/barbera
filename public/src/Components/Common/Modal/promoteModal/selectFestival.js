import React, { useEffect, useState } from "react";
import "./promotemodal.scss";
import RightIcon from "../../../../assets/svg/group-right.svg";
import NewRightArrow from "../../../../assets/svg/new-right.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setVisuals,
  setSelectedFestival,
  selectedMainService,
} from "../../../../redux/actions/promoteActions";
import { ApiGet } from "../../../../helpers/API/ApiData";
import { motion } from "framer-motion";

export default function SelectFestival() {
  const dispatch = useDispatch();
  const [festivals, setFestivals] = useState([]);
  const [header, setHeader] = useState("");
  const selectedMethod = useSelector((state) => state.selectedMethodReducer);
  const selectedGreeting = useSelector((state)=> state.selectedGreetingReducer);
  const services = [
    "All Services",
    "Selected Services",
    // "Single Category",
    // "Single Service",
  ];

  console.log("0009", selectedGreeting);

  // const festival = [
  //   "Makarsankranti",
  //   "Holi",
  //   "Rakshabandhan",
  //   "Janmashtmi",
  //   "Ganesh Chaturthi",
  //   "Navratri",
  //   "Diwali	",
  //   "Christmas",
  // ];

  useEffect(() => {
    allFestival();
  }, []);

  const allFestival = async () => {
    await ApiGet(`festival/company/type/${selectedMethod}`)
      .then((res) => {
        console.log("res is", res?.data);
        setFestivals(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const specialDays = [
  //   "Republic day",
  //   "Valentines day",
  //   "International Women's Day",
  //   "Frendship day",
  //   "Independence day",
  //   "Daughters day",
  //   "International Men's Day",
  // ];

  // const getFestivals = async () => {
  //   try {
  //     let responce = await ApiGet("festival");
  //     console.log(responce);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // getFestivals();
    console.log("Selected is", selectedMethod, selectedGreeting);
  }, []);

  // useEffect(() => {
  //   switch (selectedMethod) {
  //     case "General offer":
  //       setHeader("Select Service");
  //     // dispatch(setVisuals(4))
  //     case "Festival offers":
  //       // setFestivals(festival);
  //       setHeader("Select a festival");
  //       break;

  //     case "Festival greetings":
  //       // setFestivals(festival);
  //       setHeader("Select a festival");
  //       break;

  //     case "Special days":
  //       setFestivals(specialDays);
  //       setHeader("Select a special day");
  //       break;

  //     default:
  //       break;
  //   }
  // }, [selectedMethod]);

  const handleFestivalOffer = (festival) => {
    if(selectedMethod === "Festival greetings" || selectedMethod === "Special days") {
      dispatch(setVisuals(8));
    }
    else {
      dispatch(setVisuals(4));
    }
    dispatch(setSelectedFestival(festival));
  };

  const handleSelectedServiceOption = (selection) => {
    dispatch(selectedMainService(selection));
    dispatch(setVisuals(5));
  };

  // const setSpecificService = (service) => {
  //   dispatch(setVisuals(4));
  // }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="generate-box-center"
    >
      <div className="generate-box-center">
        <div className="campaign-child-box">
          {selectedMethod === "General offer" && (
            <>
              <div className="campaign-child-header">
                <h1>Select from the following</h1>
                <div
                  className="right-icon-alignment"
                  onClick={() => dispatch(setVisuals(2))}
                >
                  <img src={RightIcon} alt="RightIcon" />
                </div>
              </div>
              <div className="campaign-child-body">
                <div className="all-list-box-alignment-greeting">
                  {services.map((service) => {
                    return (
                      <div
                        className="greeting-box-design"
                        onClick={() => handleSelectedServiceOption(service)}
                      >
                        {/* onClick={()=>setSpecificService(service)} */}
                        <span>{service}</span>
                        <img src={NewRightArrow} alt="NewRightArrow" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {selectedMethod === "Festival offers" && (
            <>
              <div className="campaign-child-header">
                <h1>Select a festival</h1>
                <div
                  className="right-icon-alignment"
                  onClick={() => dispatch(setVisuals(2))}
                >
                  <img src={RightIcon} alt="RightIcon" />
                </div>
              </div>
              <div className="campaign-child-body">
                <div className="all-list-box-alignment-greeting">
                  {festivals.map((festival) => {
                    return (
                      <div
                        className="greeting-box-design"
                        onClick={() => handleFestivalOffer(festival)}
                      >
                        <span>{festival?.name}</span>
                        <img src={NewRightArrow} alt="NewRightArrow" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {selectedMethod === "Festival greetings" && (
            <>
            <div className="campaign-child-header">
              <h1>Select a festival</h1>
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(2))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            </div>
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                {festivals.map((festival) => {
                  return (
                    <div
                      className="greeting-box-design"
                      onClick={() => handleFestivalOffer(festival)}
                    >
                      <span>{festival?.name}</span>
                      <img src={NewRightArrow} alt="NewRightArrow" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
          )}
          {selectedMethod === "Special days" && (
            <>
            <div className="campaign-child-header">
              <h1>Select a festival</h1>
              <div
                className="right-icon-alignment"
                onClick={() => dispatch(setVisuals(2))}
              >
                <img src={RightIcon} alt="RightIcon" />
              </div>
            </div>
            <div className="campaign-child-body">
              <div className="all-list-box-alignment-greeting">
                {festivals.map((special) => {
                  return (
                    <div
                      className="greeting-box-design"
                      onClick={() => handleFestivalOffer(special)}
                    >
                      <span>{special?.name}</span>
                      <img src={NewRightArrow} alt="NewRightArrow" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
