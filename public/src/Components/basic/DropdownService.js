import React, { useRef, useEffect } from "react";
import Popper from "popper.js";
import "./style.css";
import PropTypes from "prop-types";

const DropdownService = ({ color, CategoryFunction, ServiceFunction }) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const wrapperRef = useRef(null);
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownPopoverShow(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(wrapperRef);
  DropdownService.propTypes = {
    children: PropTypes.element.isRequired
  };

  // bg colors
  let bgColor;
  color === "white"
    ? (bgColor = "bg-gray-800")
    : (bgColor = "bg-" + color + "-500");
  return (
    <>
      <div className="flex flex-wrap" ref={wrapperRef}>
        <div className="w-full lg:w-4/12">
          <div className="relative inline-flex align-middle w-full">
            <button
              className={
                "mr-3 ml-remove flex items-center justify-center outline-btn-style font-size-16 heading-title-text-color font-medium tracking-normal" +
                bgColor
              }
              style={{ transition: "all .15s ease" }}
              type="button"
              ref={btnDropdownRef}
              onClick={() => {
                dropdownPopoverShow
                  ? closeDropdownPopover()
                  : openDropdownPopover();
              }}
            >
              <img
                style={{ width: "25px", height: "25px" }}
                src={require("./../../assets/img/import.png").default}
              />
              <div className="pl-2"> Import</div>
            </button>
            <div
              ref={popoverDropdownRef}
              className={
                (dropdownPopoverShow ? "block " : "hidden ") +
                (color === "white" ? "drop-down-background " : bgColor + " ") +
                "text-base text-center z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
              }
              style={{ minWidth: "12rem" }}
            >
              <div
                className={
                  " font-size-16  heading-title-text-color font-bold cursor-pointer" +
                  (color === "white" ? " heading-title-text-color" : "text-white")
                }
                onClick={() => {
                  CategoryFunction();
                  closeDropdownPopover();
                }}
              >
                Category from Excel
              </div>
              <div className="h-0 my-2 border border-solid border-t-0 border-gray-900 opacity-25" />
              <div
                className={
                  "font-size-16 text-center heading-title-text-color font-bold cursor-pointer" +
                  (color === "white" ? " heading-title-text-color" : "text-white")
                }
                onClick={() => {
                  ServiceFunction();
                  closeDropdownPopover();
                }}
              >
                Service from Excel
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropdownService;
