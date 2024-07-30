import React, { useState, useEffect } from "react";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Row, Col } from 'reactstrap';
import { ApiPut, ApiPost, ApiGet } from "../../../helpers/API/ApiData";

import * as Yup from "yup";
import { useFormik } from "formik";
import Auth from "../../../helpers/Auth";
import { toast } from "react-toastify";
import { get_Setting } from "../../../utils/user.util";

const AddEditServiceModal = (props) => {
  const { modal, selectedCategoryId, toggle, object, getAll } = props;
  const { buttonLabel, className } = props;
  const SettingInfo = get_Setting()

  const [categories, setCategories] = useState([]);

  const userInfo = Auth.getUserDetail();

  // useEffect(() => {
  //     setCategoryName()
  //     setCategoryColor(object && object.categoryColor)
  // }, [props.object])

  const getAllCategories = async (e) => {
    try {
      let res = await ApiGet("category/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setCategories(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("error while getting Categories", err);
    }
  };

  useEffect(async () => {
    getAllCategories();
  }, []);

  const createService = {
    categoryId: selectedCategoryId || (object && object.categoryId),
    serviceName: object && object.serviceName,
    duration: object && object.duration,
    amount: object && object.amount,
    companyId: userInfo.companyId,
  };

  const [initialValues, setInitialValues] = useState(createService);

  const digitsOnly = (value) => /^\d+$/.test(value);

  const serviceSchema = Yup.object().shape({
    categoryId: Yup.string().required("* required"),
    serviceName: Yup.string().trim().required("* required"),
    duration: Yup.number("Must be number")
      .required("* required")
      .positive()
      .integer()
      .min(0, "Min is 0")
      .max(300, "Max is 300"),
    amount: Yup.string()
      .required("* required")
      .test("Digits only", "The field should have digits only", digitsOnly),
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
    validationSchema: serviceSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      let selectedCategory =
        categories && categories.filter((cat) => cat._id === values.categoryId);
      let data = {
        categoryId: values.categoryId,
        serviceName: values.serviceName,
        duration: Number(values.duration),
        amount: Number(values.amount),
        companyId: values.companyId,
        colour: selectedCategory[0] && selectedCategory[0].categoryColor,
      };
      let res;
      object
        ? (res = await ApiPut("service/" + object._id, data))
        : (res = await ApiPost("service/", data));
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
       
          resetForm(createService);
          getAll();
          toggle();
        } else {
          toast.error("Service Already Reported", {
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
    },
  });

 
  return (
    <div>
    

      {modal ? (
        <>
          <div className="animation justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 md:w-2/5 mx-auto">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full staff-add-banner outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 rounded-t">
                  <h3 className="font-size-30 font-bold tracking-normal heading-title-text-color mb-0 cursor-pointer">
                    {object ? "Edit" : "Add"} Service
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => toggle()}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <img
                        src={require("../../../assets/img/Cancel.png").default}
                      />
                    </span>
                  </button>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  {/*body*/}
                  <div class="overflow-hidden sm:rounded-md">
                    <div class="px-4 py-5 sm:p-6">
                      <div class="grid grid-cols-12">
                        <div class="col-span-6 sm:col-span-12 p-2">
                          <div className="flex items-center mb-2">
                            <label
                              for="categoryId"
                              class="block modal-font-size-18 font-medium input-label-color"
                            >
                              Category
                            </label>
                            {formik.touched.categoryId &&
                            formik.errors.categoryId ? (
                              <span className="text-red-500 font-size-12 pl-2 block">
                                {formik.errors.categoryId}
                              </span>
                            ) : null}
                          </div>
                          <select
                            name="cars"
                            id="cars"
                            className={`dropdown8 w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                              "categoryId"
                            )}`}
                            {...formik.getFieldProps("categoryId")}
                          >
                            <option clasName="modal-font-size-18 heading-title-text-color font-medium"></option>
                            {categories.length > 0 &&
                              categories.map((cat) => {
                                return (
                                  <option
                                    key={cat._id}
                                    data-limit="20"
                                    className="modal-font-size-18 heading-title-text-color font-medium"
                                    value={cat._id}
                                  >
                                    {cat.categoryName}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                        {/* <div class="col-span-6 sm:col-span-12 p-2">
                                                        <form action="/action_page.php" method="get">
                                                            <input list="browsers" name="browser" className="w-full py-2 dark-text-color font-medium pl-2 serchbar-style" id="browser"  id="browser"/>
                                                            <datalist id="browsers" className="w-full">
                                                                <option value="Edge"></option>
                                                                <option value="Firefox"></option>
                                                                <option value="Chrome"></option>
                                                                <option value="Opera"></option>
                                                                <option value="Safari"></option>
                                                            </datalist>
                                                        </form>
                                                        </div> */}

                        <div class="col-span-6 sm:col-span-12 p-2">
                          <div className="flex items-center mb-2 ">
                            <label
                              for="serviceName"
                              class="block modal-font-size-18 font-medium input-label-color"
                            >
                              Service Name
                            </label>
                            {formik.touched.serviceName &&
                            formik.errors.serviceName ? (
                              <span className="text-red-500 font-size-12 pl-2">
                                {formik.errors.serviceName}
                              </span>
                            ) : null}
                          </div>
                          <input
                            type="text"
                            name="serviceName"
                            id="serviceName"
                            maxlength="50"
                            autocomplete="given-name"
                            className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                              "serviceName"
                            )}`}
                            {...formik.getFieldProps("serviceName")}
                          />
                        </div>

                        <div class="col-span-6 sm:col-span-6 p-2">
                          <div className="flex items-center mb-2">
                            <label
                              for="duration"
                              class="block modal-font-size-18 font-medium input-label-color"
                            >
                              Duration
                            </label>
                            {formik.touched.duration &&
                            formik.errors.duration ? (
                              <span className="text-red-500 font-size-12 pl-2">
                                {formik.errors.duration}
                              </span>
                            ) : null}
                          </div>
                          <div className="input-relative">
                            <input
                              type="text"
                              name="duration"
                              id="duration"
                              autocomplete="given-name"
                              className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                                "duration"
                              )}`}
                              {...formik.getFieldProps("duration")}
                            />
                            <div className="mins-text">
                              <span>Mins</span>
                            </div>
                          </div>
                          {/* <span class="z-10  leading-snug font-normal text-center text-gray-400 absolute bg-transparent rounded  items-center justify-center  pr-3 py-3">
                                                        MINS
                                                    </span> */}
                        </div>

                        <div class="col-span-6 sm:col-span-6 p-2">
                          <div className="flex items-center mb-2">
                            <label
                              for="amount"
                              class="block modal-font-size-18 font-medium input-label-color"
                            >
                              Amount
                            </label>
                            {formik.touched.amount && formik.errors.amount ? (
                              <span className="text-red-500 font-size-12 pl-2">
                                {formik.errors.amount}
                              </span>
                            ) : null}
                          </div>
                          <div className="input-relative input-left-space">
                            <input
                              type="text"
                              name="amount"
                              id="amount"
                              autocomplete="given-name"
                              className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses(
                                "amount"
                              )}`}
                              {...formik.getFieldProps("amount")}
                            />
                            <div className="amount-icon">
                              <span>{SettingInfo?.currentType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-center p-6 rounded-b">
                    {/* <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 font-size-12 outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            style={{ transition: "all .15s ease" }}
                                            onClick={() => { toggle(); setInitialValues(createService); }}
                                        >
                                            Close
                                        </button> */}
                    <button
                      className="mr-remove cus-medium-btn 
                                            font-size-16 font-medium 
                                            tracking-normal white-text-color
                                             tracking-normal cursor-pointer"
                      type="submit"
                      style={{ transition: "all .15s ease" }}
                      disabled={formik.isSubmitting}
                    >
                      {object ? "Save Changes" : "Add New Service"}
                    </button>
                  </div>
                </form>
                {/* <button
                  className="delete-service-button"
                  onClick={() => deleteService()}
                  
                >
                  Delete service
                </button> */}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default AddEditServiceModal;
