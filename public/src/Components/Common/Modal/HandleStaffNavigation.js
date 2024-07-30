import React, { useEffect, useRef, useCallback } from "react";
import "./style.css"
const HandleStaffNavigation = ({ item,character, focus, index, setFocus,modal,active,setSelected,setHovered, StaffForMembership}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (focus) {
      ref.current.focus();
 
    }
  }, [focus]);


  const handleSelect = useCallback(() => {
   modal(character)
    setFocus(index);
  }, [character, index, setFocus]);

  return (
    <>

    <div className={`select-staff-name ${active ? "active" : ""}`} onClick={()=>{
      modal(item); 
      }} ref={ref}   role="button"  tabIndex={focus ? 0 : -1}>
      <p>{item.firstName}{" "}{item.lastName ? item.lastName : ""}</p>
    </div>
               
    </>
  );
};

export default HandleStaffNavigation;