import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, props) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        props.toggle && props.toggle();
        props.setApplyBenefitDropdown && props.setApplyBenefitDropdown(false);
        props.setBenefitDropdown && props.setBenefitDropdown(false);
        props.setRetailMenu && props.setRetailMenu(false);
        props.setSelected && props.setSelected(false);
        props.setProductDrop && props.setProductDrop(false);
        props.setReasonDrop && props.setReasonDrop(false);
        props.setOpenTransfer && props.setOpenTransfer(false);
        props.setMonthDropdown && props.setMonthDropdown(false);
        props.setCommissionType && props.setCommissionType(false);
        props.setTargetedCommission && props.setTargetedCommission(false);
        props.setCommissionOn && props.setCommissionOn(false);
        props.setBufferOptions && props.setBufferOptions(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);

  return <div ref={wrapperRef}>{props.children}</div>;
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
};

export default OutsideAlerter;
