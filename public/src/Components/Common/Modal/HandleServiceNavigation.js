import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOnboardingCurrentTooltip } from "../../../redux/actions/onboardingActions";
import "./style.css"
const HandleServiceNavigation = (props) => {
  const { character, focus, index, setFocus,getAllSelectStaff,setSelected,setHovered,active,SettingInfo} = props;
  const ref = useRef(null);
  const dispatch = useDispatch()
  const storeOnboardingTourStatus = useSelector((state) => state.onboardingTourStatusRed);
  const storeOnboardingCurrentTooltip = useSelector((state) => state.onboardingCurrentTooltipRed);


  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  const handleSelect = useCallback(() => {
    getAllSelectStaff(character);
    setFocus(index);
  }, [character, index, setFocus]);

  const handleSelectStaffOnTour = () => {
    if (storeOnboardingTourStatus && storeOnboardingCurrentTooltip === 'I3') {
      dispatch(setOnboardingCurrentTooltip('I4'))
    }
  }

  return (
    <>
      {/* <li
  
      tabIndex={focus ? 0 : -1}
      role="button"
      ref={ref}
      onClick={handleSelect}
      onKeyPress={handleSelect}
    > */}
                                    <div 
                                      className={`select-service-grid right-space-align ${active ? "active" : ""}`} onClick={()=>{getAllSelectStaff(character); handleSelectStaffOnTour()}}   >
                                                <div className="select-service-grid-items">
                                                    <h6>{character.serviceName}</h6>
                                                    <p>{character?.categoryName?.length > 30 ? character?.categoryName.substring(0,20) + "..." : character?.categoryName } • {character.duration} mins</p>
                                                </div>
                                                <div className="select-service-grid-items">
                                                    <h5><span>{SettingInfo?.currentType}</span> {character.amount}</h5>
                                                </div>
                                            </div>
    {/* </li> */}
    </>
  );
};

export default HandleServiceNavigation;
