import React, { useState, useEffect, useRef } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import DeleteIcon from "../../../assets/svg/Delete-icon.png";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import DatePicker from "react-datepicker";

export default function AddNewCategoryModal(props) {
  const { editCategory } = props;
  const userInfo = Auth.getUserDetail();
  const colorRef = useRef();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [allStaff, setAllStaff] = useState();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gstAmount, setGstAmount] = useState(false);
  const [taxType, setTaxType] = useState(false);
  const [categoryColors, setCategoryColors] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [errors, setError] = useState({});
  const [availlist, setAvaillist] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryColor: "",
    companyId: userInfo.companyId,
  });

  const getAllStaff = async (values) => {
    try {
      let res = await ApiGet("staff/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setAllStaff(res.data.data.filter((rep) => rep.default === false));
        if (!editCategory) {
          let staffNameList = res?.data?.data?.map((rep) => {
            return rep.firstName;
          });
          setAvaillist(staffNameList);
          setAvailableStaff(
            res.data.data.filter((rep) => rep.default === false)
          );
        }
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };

  const getAllCategoryColors = async (e) => {
    try {
      let res = await ApiGet("colour/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        let data = res.data.data.sort(() => Math.random() - 0.5);
        setCategoryColors(data);
        setCategoryData((prevState) => {
          return {
            ...prevState,
            categoryColor: data[0]?.name,
          };
        });
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    if (categoryData?.categoryName) {
      if (categoryData?.categoryName?.trim() === "") {
        formIsValid = false;
        errors["categoryName"] = "Add category name";
        setDisabled(formIsValid);
      }
    }
    setError(errors);
    return formIsValid;
  };

  const handleOnChange = (e) => {
    setDisabled(true);
    let { name, value } = e.target;
    setCategoryData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      let body = Object.assign(categoryData, {
        staff: availableStaff,
        isActive: true,
      });
      let res;
      editCategory
        ? (res = await ApiPut("category/" + editCategory._id, body))
        : (res = await ApiPost("category/", body));
      try {
        if (editCategory) {
          let serviceColor = {
            colour: selectedColor ? selectedColor : editCategory.categoryColor,
          };
          ApiPut(
            "service/category/change/company/" + editCategory._id,
            serviceColor
          ).then((res) => {});
        }
        props.toggle(res.data.status);
      } catch (er) {
        props.toggle(er);
      }
    }
  };

  const colorSelection = (e, value) => {
    validateForm();
    setDisabled(true);
    setSelectedColor(value);
    setSubMenuopen(false);
    setCategoryData((prevState) => {
      return {
        ...prevState,
        categoryColor: value,
      };
    });
  };

  const fetchData = async (id) => {
    let CategoryValue = await ApiGet("category/" + id);
    CategoryValue = CategoryValue.data.data;
    setCategoryData(CategoryValue[0]);
    setAvaillist(
      CategoryValue[0].staff.map((rep) => {
        return rep.firstName;
      })
    );
    setAvailableStaff(CategoryValue[0]?.staff);
  };

  const handleStartTime = async (data) => {
    setDisabled(true);
    setStartTime(data);
  };
  const handleEndTime = async (data) => {
    setDisabled(true);
    setEndTime(data);
  };

  const staffHandler = (e) => {
    validateForm();
    setDisabled(true);
    if (e.target.checked && e.target.name === "name") {
      availlist.push(e.target.value);
    } else if (e.target.name === "name") {
      let index = availlist.indexOf(e.target.value);
      availlist.splice(index, 1);
    }
    let filter = allStaff.filter((rep) => availlist.includes(rep.firstName));
    setAvaillist([...availlist]);
    setAvailableStaff(filter);
  };

  useEffect(() => {
    // if (!editCategory) {
      getAllCategoryColors();
    // }
    getAllStaff();
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (subMenuOpen) {
        if (
          subMenuOpen &&
          colorRef.current &&
          !colorRef.current.contains(e.target)
        ) {
          setSubMenuopen(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [subMenuOpen]);

  useEffect(() => {
    if (editCategory) {
      fetchData(editCategory._id);
    } else {
      setCategoryData({
        categoryName: "",
        categoryColor: "",
        companyId: userInfo.companyId,
      });
    }
  }, []);

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div className="modal-close" onClick={() => props.toggle()}>
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>{editCategory ? "Edit" : "Add New"} Category</h2>
                </div>
              </div>
              <div className="product-edit-delete-button-align">
                {/* {editCategory ? (
                  <div className="delete-button-style">
                    <img src={DeleteIcon} alt="DeleteIcon" />
                  </div>
                ) : null} */}
                <div className="modal-button">
                  {categoryData.categoryName &&
                  (
                    // allStaff?.length > 0
                    // ? availlist?.length > 0
                    // : 
                    categoryData.categoryName) &&
                  disabled ? (
                    <button onClick={() => handleSubmit()}>
                      {editCategory ? "Save Changes" : "Add Category"}
                    </button>
                  ) : (
                    <button disabled>
                      {editCategory ? "Save Changes" : "Add Category"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="box-center">
                <div>
                  <div className="product-info-box">
                    <div className="heading-style">
                      <h3>Category info</h3>
                    </div>
                    <div className="card-details">
                      <div className="form-group customer-form-group-align">
                        <label>
                          Category name
                          <span style={{ color: "red" }}> * </span>
                          {categoryData.categoryName?.trim() == "" && (
                            <span
                              style={{
                                color: "red",
                                top: "5px",
                                fontSize: "10px",
                              }}
                            >
                              {" "}
                              {errors["categoryName"]}{" "}
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          name="categoryName"
                          placeholder="Enter category name"
                          value={categoryData.categoryName?.replace(
                            /^(.)|\s+(.)/g,
                            (c) => c.toUpperCase()
                          )}
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                      <div className="option-select-group">
                        <label>Category color</label>
                        {editCategory ? (
                          <div className="relative" ref={colorRef}>
                            <div
                              className="input-relative"
                              onClick={() => setSubMenuopen(!subMenuOpen)}
                            >
                              <input type="text" disabled />
                              <div className="show-icon-input-alignment">
                                <div
                                  className="input-under-desing"
                                  style={{
                                    backgroundColor: selectedColor
                                      ? selectedColor
                                      : editCategory.categoryColor,
                                  }}
                                  value={
                                    selectedColor
                                      ? selectedColor
                                      : editCategory.categoryColor
                                  }
                                ></div>
                              </div>
                              <div className="drop-down-icon-center">
                                <img src={DropDownIcon} alt="DropDownIcon" />
                              </div>
                            </div>
                            <div
                              className={
                                subMenuOpen
                                  ? "sub-menu-open sub-menu"
                                  : "sub-menu sub-menu-close"
                              }
                            >
                              <div className="sub-menu-design">
                                <div className="color-menu-alignment">
                                  {categoryColors.length > 0 &&
                                    categoryColors.map((color) => {
                                      return (
                                        <div
                                          key={color._id}
                                          className="color-round-design light-background"
                                          style={{
                                            backgroundColor: color.name,
                                          }}
                                          value={color.name}
                                          onClick={(e) =>
                                            colorSelection(e, color.name)
                                          }
                                        ></div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative" ref={colorRef}>
                            <div
                              className="input-relative"
                              onClick={() => setSubMenuopen(!subMenuOpen)}
                            >
                              <input type="text" disabled />
                              <div className="show-icon-input-alignment">
                                <div
                                  className="input-under-desing"
                                  style={{
                                    backgroundColor: selectedColor
                                      ? selectedColor
                                      : categoryColors &&
                                        categoryColors[0]?.name,
                                  }}
                                  value={
                                    selectedColor
                                      ? selectedColor
                                      : categoryColors && categoryColors[0]?.name
                                  }
                                ></div>
                              </div>
                              <div className="drop-down-icon-center">
                                <img src={DropDownIcon} alt="DropDownIcon" />
                              </div>
                            </div>
                            <div
                              className={
                                subMenuOpen
                                  ? "sub-menu-open sub-menu"
                                  : "sub-menu sub-menu-close"
                              }
                            >
                              <div className="sub-menu-design">
                                <div className="color-menu-alignment">
                                  {categoryColors.length > 0 &&
                                    categoryColors.map((color) => {
                                      return (
                                        <div
                                          key={color._id}
                                          className="color-round-design light-background"
                                          style={{
                                            backgroundColor: color.name,
                                          }}
                                          value={color.name}
                                          onClick={(e) =>
                                            colorSelection(e, color.name)
                                          }
                                        ></div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="product-info-box add-new-staff-align">
                    <div className="heading-style">
                      <h3>GST</h3>
                    </div>
                    <div className="card-details">
                      <div className="option-select-group customer-form-group-align">
                        <label>Tax type</label>
                        <div className="relative">
                          <div className="input-relative">
                            <input type="text" placeholder="Exclusive" />
                            <div
                              className="drop-down-icon-center"
                              onClick={() => setTaxType(!taxType)}
                            >
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              taxType
                                ? "sub-menu-open sub-menu"
                                : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              <ul>
                                <li>Exclusive</li>
                                <li>Exclusive</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="option-select-group">
                        <label>Tax %</label>
                        <div className="relative">
                          <div className="input-relative">
                            <input type="text" placeholder="CGST 5%" />
                            <div
                              className="drop-down-icon-center"
                              onClick={() => setGstAmount(!gstAmount)}
                            >
                              <img src={DropDownIcon} alt="DropDownIcon" />
                            </div>
                          </div>
                          <div
                            className={
                              gstAmount
                                ? "sub-menu-open sub-menu"
                                : "sub-menu sub-menu-close"
                            }
                          >
                            <div className="sub-menu-design">
                              <ul>
                                <li>CGST 5%</li>
                                <li>CGST 5%</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="product-info-box add-new-staff-align">
                    <div className="heading-style">
                      <h3>Staff selection</h3>
                    </div>
                    <div className="card-details">
                      <div className="working-table-staff working-table-staff-grid-change">
                        {/* <div className="working-time-grid disable-background">
                          <div className="working-grid-items">
                            <span>Sunday</span>
                          </div>
                          <div className="working-grid-items">
                            <button>Off day</button>
                          </div>
                          <div className="working-grid-items">
                            <button>Off day</button>
                          </div>
                        </div> */}
                        {!availlist.length > 0 && (
                          <span
                            style={{
                              color: "red",
                              top: "5px",
                              fontSize: "10px",
                            }}
                          >
                            {" "}
                            {errors["name"]}{" "}
                          </span>
                        )}
                        {allStaff?.map((allStaff) => {
                          return (
                            <div
                              key={allStaff._id}
                              className="working-time-grid"
                            >
                              <div className="working-grid-items">
                                <input
                                  type="checkbox"
                                  name="name"
                                  id="id"
                                  value={allStaff.firstName}
                                  checked={
                                    availlist.includes(allStaff.firstName)
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => staffHandler(e)}
                                />
                                <span>{allStaff.firstName}</span>
                              </div>
                              {/* <div className="working-grid-items">
                                <button>
                                  00:00 AM
                                </button>
                              </div>
                              <div className="working-grid-items">
                                <button>
                                  00:00 PM
                                </button>
                              </div> */}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
