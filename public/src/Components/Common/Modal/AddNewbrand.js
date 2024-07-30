import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";

export default function AddNewbrand(props) {
  const { modal, editBrand,toggle } = props;
  const userInfo = Auth.getUserDetail();
  const [brandName, setBrandName] = useState("");
  const [errors, setError] = useState({});
  const [disabled, setDisabled] = useState(false);

  const handleOnClick = async () => {
    
    if (validateForm()) {
      let brandBody = {
        brandName,
        companyId: userInfo.companyId,
        isActive: true,
      };
      let res;
      editBrand
        ? (res = await ApiPut("ibrand/" + editBrand._id, brandBody))
        : (res = await ApiPost("ibrand/", brandBody));
 
      try {
        toggle(res.data.status) 
      } catch (er) {
        toggle(er);
      }
      props.close(false);
    }
  };

  const closeOnClick = () => {
    props.close(false);
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (brandName.trim() == "") {
      formIsValid = false;
      errors["brandName"] = "* Enter valid input";
    }
    setError(errors);
    return formIsValid;
  };

  const fetchData = async (id) => {
    let productValue = await ApiGet("ibrand/" + id);
    productValue = productValue.data.data;
    setBrandName(productValue[0].brandName);
  };

  const handleOnChange = (e) => {
    setBrandName(e.target.value);
    if (e.target.value) {
      setDisabled(true);
    }
  };

  useEffect(() => {
    if (editBrand) {
      fetchData(editBrand._id);
    } else {
      setBrandName("");
    }
  }, []);

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>{editBrand ? "Edit brand" : "Add new brand"}</h4>
              <div className="close-button" onClick={() => closeOnClick()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="sub-modal-body">
            <div className="form-group">
              <label>
                Enter brand name{" "}
                {
                  <span style={{ color: "red", top: "5px", fontSize: "10px" }}>
                    {" "}
                    {errors["brandName"]}{" "}
                  </span>
                }{" "}
              </label>
              <input
                type="text"
                name="brandName"
                placeholder="e.g., My Brand"
                value={brandName}
                onChange={(e) => handleOnChange(e)}
              />
            </div>
          </div>
          <div className="sub-modal-footer">
            <div className="button-right-align">
              {disabled && brandName ? (
                <button onClick={(e) => handleOnClick(e)}>
                  {editBrand ? "Save changes" : "Add Brand"}
                </button>
              ) : (
                <button disabled>
                  {editBrand ? "Save changes" : "Add Brand"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
