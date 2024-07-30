import React, { useState, useEffect } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { ApiPost, ApiPut, ApiGet } from "../../../helpers/API/ApiData";

export default function AddNewCategory(props) {
  const { modal, editCategory,toggle } = props;
  const userInfo = Auth.getUserDetail();
  const [categoryName, setCategoryName] = useState("");
  const [errors, setError] = useState({});
  const [disabled, setDisabled] = useState(false);

  const handleOnClick = async () => {
    if (validateForm()) {
      let categoryBody = {
        categoryName,
        companyId: userInfo.companyId,
        isActive: true,
      };
      let res;
      editCategory
        ? (res = await ApiPut("icategory/" + editCategory._id, categoryBody))
        : (res = await ApiPost("icategory/", categoryBody));
        try {
          toggle(res.data.status) 
        }catch (er) {
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

    if (categoryName.trim() == "") {
      formIsValid = false;
      errors["categoryName"] = "* Enter valid input";
    }
    setError(errors);
    return formIsValid;
  };

  const fetchData = async (id) => {
    let productValue = await ApiGet("icategory/" + id);
    productValue = productValue.data.data;
    setCategoryName(productValue[0].categoryName);
  };

  const handleOnChange = (e) => {
    setCategoryName(e.target.value);
    if (e.target.value) {
      setDisabled(true);
    }
  };

  useEffect(() => {
    if (editCategory) {
      fetchData(editCategory._id);
    } else {
      setCategoryName("");
    }
  }, []);

  return (
    <>
      {modal ? <div className="modal-bluer-open"></div> : null}
      <div className="sub-modal-main">
        <div className="sub-modal">
          <div className="sub-modal-header">
            <div className="header-alignment">
              <h4>{editCategory ? "Edit category" : "Add new category"}</h4>
              <div className="close-button" onClick={() => closeOnClick()}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
            </div>
          </div>
          <div className="sub-modal-body">
            <div className="form-group">
              <label>
                Enter category name{" "}
                {
                  <span style={{ color: "red", top: "5px", fontSize: "10px" }}>
                    {" "}
                    {errors["categoryName"]}{" "}
                  </span>
                }{" "}
              </label>
              <input
                type="name"
                placeholder="e.g., Shampoo"
                value={categoryName}
                onChange={(e) => handleOnChange(e)}
              />
            </div>
          </div>
          <div className="sub-modal-footer">
            <div className="button-right-align">
              {disabled && categoryName ? (
                <button onClick={(e) => handleOnClick(e)}>
                  {editCategory ? "Save changes" : "Add Category"}
                </button>
              ) : (
                <button disabled>
                  {editCategory ? "Save changes" : "Add Category"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
