import React, { useRef, useEffect } from 'react';
import Popper from "popper.js";
import "./style.css"
import PropTypes from "prop-types";

const Dropdown = ({ color, CategoryFunction, ServiceFunction }) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const wrapperRef = useRef(null);
    const openDropdownPopover = () => {
        new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-start"
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
      Dropdown.propTypes = {
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
                                "cus-medium-btn text-white font-bold  text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1" +
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
                            Add New
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
                                    " font-size-18  heading-title-text-color font-bold cursor-pointer" +
                                    (color === "white" ? " " : "text-white")
                                }
                                onClick={() => { CategoryFunction(); closeDropdownPopover() }}
                            >
                                Category
                            </div>
                            <div className="h-0 my-2 border border-solid border-t-0 border-gray-900 opacity-25" />
                            <div
                                className={
                                    "font-size-18 text-center heading-title-text-color font-bold cursor-pointer" +
                                    (color === "white" ? " " : "text-white")
                                }
                                onClick={() => { ServiceFunction(); closeDropdownPopover() }}
                            >
                                Service
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dropdown;