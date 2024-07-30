import React, { useState, useEffect } from "react";
// import { Spinner } from 'reactstrap';
import { ApiGet, ApiPut, ApiPost } from "../../../helpers/API/ApiData";

import * as Yup from "yup";
import { useFormik } from "formik";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";

const AddEditCategoryModal = (props) => {
  const { modal, toggle, object, getAll } = props;
  const { buttonLabel, className } = props;

  const [loading, setLoading] = useState(false);
  const [categoryColors, setCategoryColors] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const userInfo = Auth.getUserDetail();

  // useEffect(() => {
  //     setCategoryName()
  //     setCategoryColor(object && object.categoryColor)
  // }, [props.object])
  const getAllCategoryColors = async (e) => {
    try {
      let res = await ApiGet("colour/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        let data = res.data.data.sort(() => Math.random() - 0.5);
        setCategoryColors(data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  useEffect(async () => {
    getAllCategoryColors();
  }, []);
  const createCategory = {
    categoryName: object && object.categoryName,
    categoryColor: object && object.categoryColor,
  };
  const [initialValues, setInitialValues] = useState(createCategory);

  const categorySchema = Yup.object().shape({
    categoryName: Yup.string().trim().required("*required"),
    // categoryColor: Yup.string().required("*required")
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: categorySchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let data = {
        categoryName: values.categoryName,
        categoryColor: values.categoryColor
          ? values.categoryColor
          : categoryColors && categoryColors[0].name,
        companyId: userInfo.companyId,
      };
      let res;
      object
        ? (res = await ApiPut("category/" + object._id, data))
        : (res = await ApiPost("category/", data));
      try {
        if (res.data.status === 200) {
          toast.success(
            object ? "Updated Successfully" : "Added Successfully",
            {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
         
          resetForm(createCategory);
          getAll();
          toggle();
        } else {
          toast.error("Category Already Reported", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
         
        }
      } catch (err) {
        setLoading(false);
        toggle();
        toast.error("Something Went Wrong", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        
      }
      setLoading(false);
    },
  });

  const bindSlLabelBis = (value) => {
    formik.setFieldValue(
      "categoryColor",
      value.target.value
        ? value.target.value
        : categoryColors && categoryColors[0].name
    );
    setSelectedColor(value.target.value);
  };

  return (
    <div>
      {/* <Modal isOpen={modal} toggle={toggle} className={className} className="addNewModel">
                <ModalHeader toggle={toggle}>{object ? "Edit" : "Add"} Category</ModalHeader>
                <ModalBody>

                    <span className="font-size-18 dark-text-color font-medium tracking-normal">
                        Category Name
                    </span>
                    <input type="search" name="q" class="w-full py-2  dark-text-color font-medium pl-10 serchbar-style"
                        value={categoryName}
                        onChange={(e) => { setCategoryName(e.target.value) }}
                    />

                    <span className="font-size-18 dark-text-color font-medium tracking-normal">
                        Category Color
                    </span>
                    <select name="cars" id="cars" className="form-control dropdown-style font-medium"
                        value={categoryColor}
                        onChange={(e) => { setCategoryColor(e.target.value) }}
                    >
                        <option className="font-size-18 heading-title-text-color font-medium" ></option>
                        <option className="font-size-18 heading-title-text-color font-medium" >Red</option>
                        <option className="font-size-18 heading-title-text-color font-medium" >Blue</option>
                        <option className="font-size-18 heading-title-text-color font-medium" >Black</option>
                        <option className="font-size-18 heading-title-text-color font-medium" >White</option>
                    </select>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={SaveChanges}>{object ? "Save Changes" : "Add New Category"}</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal> */}

      {modal ? (
        <>
          <div className="animation justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto md:w-2/6">
              {/*content*/}
              <div className="rounded-lg shadow-lg staff-add-banner relative flex flex-col w-full outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5  rounded-t">
                  <h3 className="font-size-30 font-bold tracking-normal heading-title-text-color mb-0 cursor-pointer">
                    {object ? "Edit" : "Add"} Category
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      toggle();
                      setInitialValues(createCategory);
                    }}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <img
                        src={require("../../../assets/img/Cancel.png").default}
                      />
                    </span>
                  </button>
                </div>

                {/*body*/}
                {/* <div className="relative p-6 flex-auto">
                                    <span className="font-size-18 dark-text-color font-medium tracking-normal pb-5">
                                        Category Name
                                    </span>
                                    <input type="search" name="q" className="w-full py-2  dark-text-color font-medium pl-10 serchbar-style"
                                        value={categoryName}
                                        onChange={(e) => { setCategoryName(e.target.value) }}
                                    />
                                </div>
                                <div className="relative p-6 flex-auto">

                                    <span className="font-size-18 dark-text-color font-medium tracking-normal">
                                        Category Color
                                    </span>
                                    <div>
                                        <select name="cars" id="cars" className=" dropdown-style font-medium"
                                            value={categoryColor}
                                            onChange={(e) => { setCategoryColor(e.target.value) }}
                                        >
                                            <option className="font-size-18 heading-title-text-color font-medium" ></option>
                                            <option className="font-size-18 heading-title-text-color font-medium" >Red</option>
                                            <option className="font-size-18 heading-title-text-color font-medium" >Blue</option>
                                            <option className="font-size-18 heading-title-text-color font-medium" >Black</option>
                                            <option className="font-size-18 heading-title-text-color font-medium" >White</option>
                                        </select>
                                    </div>
                                </div> */}

                <form onSubmit={formik.handleSubmit}>
                  <div class="overflow-hidden sm:rounded-md max-w-3xl">
                    <div class="px-4 py-5">
                      <div class="">
                        <div class=" p-2">
                          <div className="flex items-center mb-2">
                            <label
                              for="categoryName"
                              class="block font-size-18 font-medium input-label-color"
                            >
                              Category Name
                            </label>
                            {formik.touched.categoryName &&
                            formik.errors.categoryName ? (
                              <span className="text-red-500 font-size-12 pl-2">
                                {formik.errors.categoryName}
                              </span>
                            ) : null}
                          </div>
                          <input
                            type="text"
                            name="categoryName"
                            autocomplete="categoryName"
                            maxlength="50"
                            className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                              "categoryName"
                            )}`}
                            {...formik.getFieldProps("categoryName")}
                          />
                        </div>

                        <div class="col-span-6 sm:col-span-12 p-2">
                          <div className="flex items-center mb-2">
                            <label
                              for="categoryColor"
                              class="block font-size-18 font-medium input-label-color"
                            >
                              Category Color
                            </label>
                            {formik.touched.categoryColor &&
                            formik.errors.categoryColor ? (
                              <span className="text-red-500 font-size-12 pl-2 block">
                                {formik.errors.categoryColor}
                              </span>
                            ) : null}
                          </div>
                          {object ? (
                            <select
                              name="categoryColor"
                              id="categoryColor"
                              style={{
                                backgroundColor: selectedColor
                                  ? selectedColor
                                  : object.categoryColor,
                              }}
                              className={`dropdown2 w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                                "categoryColor"
                              )}`}
                              {...formik.getFieldProps("categoryColor")}
                              onChange={(value) => {
                                bindSlLabelBis(value);
                                value = { categoryColors };
                              }}
                            >
                              {/* <option clasName="font-size-18 heading-title-text-color font-medium" value="#FFD5C2">#FFD5C2</option> */}
                              {categoryColors.length > 0 &&
                                categoryColors.map((color) => {
                                  return (
                                    <option
                                      key={color._id}
                                      className="font-size-18 heading-title-text-color font-medium"
                                      style={{ backgroundColor: color.name }}
                                      value={color.name}
                                    />
                                  );
                                })}
                            </select>
                          ) : (
                            <select
                              name="categoryColor"
                              id="categoryColor"
                              style={{
                                backgroundColor: selectedColor
                                  ? selectedColor
                                  : categoryColors && categoryColors[0].name,
                              }}
                              className={`dropdown2 w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                                "categoryColor"
                              )}`}
                              {...formik.getFieldProps("categoryColor")}
                              onChange={(value) => {
                                bindSlLabelBis(value);
                                value = { categoryColors };
                              }}
                            >
                              {/* <option clasName="font-size-18 heading-title-text-color font-medium" value="#FFD5C2">#FFD5C2</option> */}
                              {categoryColors.length > 0 &&
                                categoryColors.map((color) => {
                                  return (
                                    <option
                                      key={color._id}
                                      className="font-size-18 heading-title-text-color font-medium"
                                      style={{ backgroundColor: color.name }}
                                      value={color.name}
                                    />
                                  );
                                })}
                            </select>
                          )}
                        </div>

                        {/* <div class="p-2">
                                                    <label for="categoryColor" class="mb-2 block font-size-12 font-medium input-label-color">Category Color</label>
                                                    <input type="text" name="categoryColor" id="categoryColor" autocomplete="given-name"
                                                        className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses("categoryColor")}`} {...formik.getFieldProps("categoryColor")}
                                                    />
                                                    {formik.touched.categoryColor && formik.errors.categoryColor ? <span className="text-red-500 font-size-12 pl-2">{formik.errors.categoryColor}</span> : null}
                                                </div> */}
                      </div>
                    </div>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-center p-6 rounded-b">
                    {/* <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 font-size-12 outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => { toggle(); setInitialValues(createCategory); }}
                                        >
                                            Close
                                        </button> */}
                    <button
                      className="mr-3 mr-remove cus-medium-btn 
                                            font-size-16 font-medium 
                                            tracking-normal white-text-color
                                            tracking-normal cursor-pointer"
                      type="submit"
                      style={{ transition: "all .15s ease" }}
                      disabled={formik.isSubmitting}
                    >
                      {object ? "Save Changes" : "Add New Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default AddEditCategoryModal;
