import React, { useState, useEffect } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import SearchIcon from "../../../assets/svg/search-icon.svg";
import AddNewBrand from "../Modal/AddNewbrand";
import { ApiGet } from "../../../helpers/API/ApiData";
import Auth from "../../../helpers/Auth";
import AddNewCategory from "../Modal/AddNewCategory";
import EditIcon from "../../../assets/svg/edit-icon1.svg";
import DeleteIcon from "../../../assets/svg/Delete-icon.svg";
import Delete from "../Toaster/Delete";
import Success from "../Toaster/Success/Success";

export default function BrandAndCategoryModal(props) {
  const {SettingInfo, permission} = props
  const userInfo = Auth.getUserDetail();
  const [allBrands, setAllBrands] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [addNewBrandModal, setAddNewBrandModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addNewCategoryModal, setAddNewCategoryModal] = useState(false);
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [editBrand, setEditBrand] = useState();
  const [editCategory, setEditCategory] = useState();
  const [deleteBrandId, setDeleteBrandId] = useState();
  const [deleteCategoryId, setDeleteCategoryId] = useState();
  const [keyWord, setKeyWord] = useState("");
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();

  const openAddNewBrandModal = () => {
    AddNewBrandModaltoggle();
  };
  const AddNewBrandModaltoggle = (data) => {
    setAddNewBrandModal(!addNewBrandModal);
    if (addNewBrandModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg(editBrand ? "Changes saved!" : "Brand added!");
        } else if (data === 208) {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Brand already exists!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const openAddNewCategoryModal = () => {
    AddNewCategoryModaltoggle();
  };
  const AddNewCategoryModaltoggle = (data) => {
    setAddNewCategoryModal(!addNewCategoryModal);
    if (addNewCategoryModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg(editCategory ? "Changes saved!" : "Category added! ");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);
    setDeleteCategoryId();
    setDeleteBrandId();
    if (deleteModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg(
            deleteCategoryId ? "Category deleted!" : "Brand deleted!"
          );
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const getAllBrands = async () => {
    let res = await ApiGet("ibrand/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setAllBrands(res.data.data);
        setFilteredBrand(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  const getAllCategories = async () => {
    let res = await ApiGet("icategory/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setAllCategories(res.data.data);
        setFilteredCategory(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const changeBrandHandler = (e) => {
    setKeyWord(e.target.value);
    var brandData =
      filteredBrand.length > 0 &&
      filteredBrand.filter(
        (rep) =>
          rep.brandName &&
          rep.brandName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    if (e.target.value === "") {
      ApiGet("ibrand/company/" + userInfo.companyId).then((resp) => {
        setAllBrands(resp.data.data);
      });
    } else {
      setAllBrands(brandData);
    }
  };

  const changeCategoryHandler = (e) => {
    setKeyWord(e.target.value);
    var categoryData =
      filteredCategory.length > 0 &&
      filteredCategory.filter(
        (rep) =>
          rep.categoryName &&
          rep.categoryName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    if (e.target.value === "") {
      ApiGet("icategory/company/" + userInfo.companyId).then((resp) => {
        setAllCategories(resp.data.data);
      });
    } else {
      setAllCategories(categoryData);
    }
  };

  const isCloseHandler = (data) => {
    setEditBrand("");
    setEditCategory("");
    setAddNewBrandModal(data);
    setAddNewCategoryModal(data);
    getAllBrands();
    getAllCategories();
  };

  useEffect(() => {
    getAllBrands();
    getAllCategories();
  }, []);

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => props.toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Manage Brand and Category</h2>
                </div>
              </div>
              {/* <div className="modal-button">
                                <button>Save chnages</button>    
                            </div>     */}
            </div>
          </div>
        </div>
        {/* modal body */}
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align same-box-align">
              <div className="manage-grid">
                <div className="manage-grid-items">
                  <div className="manage-box-style">
                    <div className="title-text">
                      <h3>Brands</h3>
                      {permission?.filter((obj)=>obj.name ===  "Add new product/Brand/Category")[0]?.isChecked === false ? null :
                      <div onClick={() => openAddNewBrandModal()}>
                        <p>Add New</p>
                      </div>}
                    </div>
                    <div className="invoice-search">
                      <input
                        type="search"
                        placeholder="Search brand"
                        onChange={(e) => changeBrandHandler(e)}
                      />
                      <div className="search-icon-align">
                        <img src={SearchIcon} alt="SearchIcon" />
                      </div>
                    </div>
                    <div className="invoice-items">
                      <ul>
                        {allBrands &&
                          allBrands
                            .slice(0)
                            .reverse()
                            .map((brand) => {
                              return (
                                <div key={brand._id} className="edit-icon-grid">
                                  <div className="edit-icon-grid-items">
                                    <li>{brand && brand.brandName}</li>
                                  </div>
                                  <div className="edit-icon-grid-items">
                                  {permission?.filter((obj)=>obj.name ===  "Edit/delete products, brands, and categories")[0]?.isChecked === false ? null : (
                                    <div className="icon-alignment">
                                      <img
                                        src={EditIcon}
                                        alt="EditIcon"
                                        onClick={() => {
                                          AddNewBrandModaltoggle((e) => !e);
                                          setEditBrand(brand);
                                        }}
                                      />
                                      <img
                                        src={DeleteIcon}
                                        alt="DeleteIcon"
                                        onClick={() => {
                                          opendeleteModal();
                                          setDeleteBrandId(brand._id);
                                        }}
                                      />
                                    </div>
                                  )}
                                  </div>
                                </div>
                              );
                            })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="manage-grid-items">
                  <div className="manage-box-style">
                    <div className="title-text">
                      <h3>Categories</h3>
                      {permission?.filter((obj)=>obj.name ===  "Add new product/Brand/Category")[0]?.isChecked === false ? null :
                      <div onClick={() => openAddNewCategoryModal()}>
                        <p>Add New</p>
                      </div>}
                    </div>
                    <div className="invoice-search">
                      <input
                        type="search"
                        placeholder="Search category"
                        onChange={(e) => changeCategoryHandler(e)}
                      />
                      <div className="search-icon-align">
                        <img src={SearchIcon} alt="SearchIcon" />
                      </div>
                    </div>
                    <div className="invoice-items">
                      <ul>
                        {allCategories &&
                          allCategories
                            .slice(0)
                            .reverse()
                            .map((category) => {
                              return (
                                <div
                                  key={category._id}
                                  className="edit-icon-grid"
                                >
                                  <div className="edit-icon-grid-items">
                                    <li>{category && category.categoryName}</li>
                                  </div>
                                  <div className="edit-icon-grid-items">
                                  {permission?.filter((obj)=>obj.name ===  "Edit/delete products, brands, and categories")[0]?.isChecked === false ? null : (
                                    <div className="icon-alignment">
                                      <img
                                        src={EditIcon}
                                        alt="EditIcon"
                                        onClick={() => {
                                          AddNewCategoryModaltoggle((e) => !e);
                                          setEditCategory(category);
                                        }}
                                      />
                                      <img
                                        src={DeleteIcon}
                                        alt="DeleteIcon"
                                        onClick={() => {
                                          opendeleteModal();
                                          setDeleteCategoryId(category._id);
                                        }}
                                      />
                                    </div>
                                  )}
                                  </div>
                                </div>
                              );
                            })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* modal body */}
      </div>
      {addNewCategoryModal && (
        <AddNewCategory
          modal={addNewCategoryModal}
          toggle={AddNewCategoryModaltoggle}
          close={isCloseHandler}
          editCategory={editCategory}
        />
      )}
      {deleteModal && (
        <Delete
          modal={deleteModal}
          toggle={deleteModaltoggle}
          deleteBrandId={deleteBrandId}
          deleteCategoryId={deleteCategoryId}
          getAllBrands={getAllBrands}
          getAllCategories={getAllCategories}
          setDeleteBrandId={setDeleteBrandId}
          setDeleteCategoryId={setDeleteCategoryId}
        />
      )}
      {addNewBrandModal && (
        <AddNewBrand
          modal={addNewBrandModal}
          toggle={AddNewBrandModaltoggle}
          close={isCloseHandler}
          editBrand={editBrand}
          SettingInfo={SettingInfo}
        />
      )}
      {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
    </div>
  );
}
