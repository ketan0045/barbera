import React, { useRef, useEffect } from "react";
import Popper from "popper.js";
import "./style.css";
import GoogleContacts from "react-google-contacts";

import { ApiPost } from "../../helpers/API/ApiData";
import Auth from "../../helpers/Auth";
import { toast } from 'react-toastify';
import PropTypes from "prop-types";

const DropdownImport = ({ color, GoogleFunction, ExcelFunction }) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const wrapperRef = useRef(null);

  const responseCallback = async (response) => {
    const filterNullList = response.filter((rep) => rep.phoneNumber != null);
    const userInfo = Auth.getUserDetail();
    const contactArray = [];
    const contactList = filterNullList.map((item) => {
      contactArray.push({
        firstName: item.givenName,
        lastName: item.familyName,
        mobileNumber: item.phoneNumber,
        companyId: userInfo.companyId,
        isPromotional: true,
        profilePic: "base64url",
        isActive: true,
      });
    });
    let res = await ApiPost("customer/insertCustomerMany", contactArray);
    try {
      if (res.data.status === 200) {
        toast.success("Added Successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme:"colored"
          })
     
      } else {
        toast.warn(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme:"colored"})
       
      }
    } catch (err) {
      toast.error("Something Went Wrong", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme:"colored"
        })
    
    }
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
  DropdownImport.propTypes = {
    children: PropTypes.element.isRequired
  };

  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
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
                  " font-size-18  heading-title-text-color font-bold cursor-pointer" +
                  (color === "white" ? "" : "text-white")
                }
                onClick={() => {
                  ExcelFunction();
                  closeDropdownPopover();
                }}
              >
                Import From Excel
              </div>
              <div className="h-0 my-2 border border-solid border-t-0 border-gray-900 opacity-25" />
              <div
                className={
                  "font-size-18 text-center heading-title-text-color font-bold cursor-pointer" +
                  (color === "white" ? "" : "text-white")
                }
                onClick={() => {
                  GoogleFunction();
                  closeDropdownPopover();
                }}
              >
                <GoogleContacts
                  clientId="840773866058-a5m3v8ej48090gecv817k4s77mffc29o.apps.googleusercontent.com"
                  buttonText="Import from Google"
                  onSuccess={responseCallback}
                  onFailure={responseCallback}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropdownImport;
