import React, { useState, useEffect } from "react";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
// import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { useFormik } from "formik";
import './../../style/tailwind.css';
import * as Yup from "yup";
import { NavLink } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import "./stayle.css";
import Auth from "../../../helpers/Auth";
import  DatePicker  from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

import moment from "moment";

// import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
export default function CreateCustomer(props) {

    const renderMobileSidebar = () => {
        let divEle = document.getElementsByClassName("sidebar-banner")[0];
        divEle.classList.toggle("sidebar-display");
    };
    const userInfo = Auth.getUserDetail();
    const [errors, setError] = useState({});
    const [monthDate, setMonthDate] = useState();
    const [year, setYear] = useState();
    const [date, setDate] = useState();
    const { mobile } = props
    const createCustomer = {
        firstName: "",
        lastName: "",
        mobileNumber: mobile ? mobile : "",
        gender: "",
        email: "",
        birthday: "" ,
        companyId: userInfo.companyId,
        isPromotional: "",
    };
    const { isOpen, toggle } = props
    const [initialValues, setInitialValues] = useState(createCustomer)
    const [isProSMS, setIsProSMS] = useState(true);


    const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

    const userSchema = Yup.object().shape({
        firstName: Yup.string().trim().required("* required"),
        // lastName: Yup.string().required("Last name is required"),
        mobileNumber: Yup.string().matches(phoneRegExp, '* not valid').min(10).max(10).required("* required"),
        // gender: Yup.string().required("* required")
        // email: Yup.string().required("Email is required"),
        // birthday: Yup.date().required("Birthdate name is required").max(new Date(), "Invalid Date"),
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
        validationSchema: userSchema,
        enableReinitialize: true,
        
        onSubmit: async (values, { resetForm }) => {
           
    

            if (values.isPromotional === "") {
                values.isPromotional = false
            }
            props.handleSubmit(values);
            
            props.toggle();
            // resetForm(createCustomerModal)
        },
    });


    const handleMonthDate = async (data) => {
        setMonthDate(data)  
        const fullDate = `${moment(data).format("DD-MM")}-${moment(year).format("y")}`
        formik.setFieldValue("birthday",fullDate)
        }
    
        const handleYear = async (data) => {
        setYear(data)
        const fullDate = `${moment(monthDate).format("DD-MM")}-${moment(data).format("y")}`
        formik.setFieldValue("birthday",fullDate)
     }


    return (
        <>
            <div>
                {isOpen ? (
                    <>
                        <div className="animation justify-center items-center flex overflow-x-hidden overflow-y-auto  fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative my-6 mx-auto md:w-2/5">
                                {/*content*/}
                                <div className=" rounded-lg shadow-lg relative staff-add-banner flex flex-col outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start  justify-between p-5 rounded-t">
                                        <h3 className="font-size-30 font-bold tracking-normal heading-title-text-color mb-0 cursor-pointer">
                                            New Customer
                                        </h3>
                                        <button
                                            className=""
                                            onClick={() => { toggle(); }}
                                        >
                                            <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                <img src={require("../../../assets/img/Cancel.png").default} />
                                            </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <form>
                                        <div class="overflow-hidden sm:rounded-md">
                                            <div class="px-4 py-5 sm:p-6 sm:pb-0">
                                                <div class="grid grid-cols-6 gap-6">
                                                    <div class="col-span-6 sm:col-span-3 p-2">
                                                        <div className="flex items-center mb-2">
                                                            <label for="firstName" class="block font-size-18 font-medium input-label-color">First name</label>
                                                            {formik.touched.firstName && formik.errors.firstName ? <span className="text-red-500 font-size-18 pl-2">{formik.errors.firstName}</span> : null}
                                                        </div>
                                                        <input type="text" name="firstName" className={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses("firstName")}`} {...formik.getFieldProps("firstName")} />
                                                    </div>

                                                    <div class="col-span-6 sm:col-span-3 p-2">
                                                        <div className="flex items-center mb-2">
                                                            <label for="lastName" class="block font-size-18 font-medium input-label-color">Last name</label>
                                                            {formik.touched.lastName && formik.errors.lastName ? <span className="text-red-500 font-size-18 pl-2">{formik.errors.lastName}</span> : null}
                                                        </div>
                                                        <input type="text" name="lastName" id="lastName" class={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses("lastName")}`} {...formik.getFieldProps("lastName")} />
                                                    </div>
                                                    <div class="col-span-6 sm:col-span-3 p-2">
                                                        <div className="flex items-center mb-2">
                                                            <label for="mobileNumber" class="block font-size-18 font-medium input-label-color">Mobile Number</label>
                                                            {formik.touched.mobileNumber
                                                             && formik.errors.mobileNumber 
                                                             ?
                                                             <span className="text-red-500 font-size-18 pl-2">{formik.errors.mobileNumber}</span>
                                                          : null}
                                                        </div>
                                                        <input type="text" name="mobileNumber" id="mobileNumber" maxlength="10" class={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses("mobileNumber")}`} {...formik.getFieldProps("mobileNumber")} />
                                                    </div>

                                                    <div class="col-span-6 sm:col-span-3 p-2">
                                                        <div className="flex items-center mb-2">
                                                            <label for="gender" class="block font-size-18 font-medium input-label-color">Gender</label>
                                                            {formik.touched.gender && formik.errors.gender ? <span className="text-red-500 font-size-18 pl-2">{formik.errors.gender}</span> : null}
                                                        </div>
                                                        <select id="gender" name="gender" class={`dropdown2 w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses("gender")}`} {...formik.getFieldProps("gender")}>
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Others">Others</option>
                                                        </select>
                                                    </div>

                                                    <div class="col-span-6 sm:col-span-3 p-2">
                                                        <div className="flex items-center mb-2">
                                                            <label for="email" class="block font-size-18 font-medium input-label-color">Email</label>
                                                            {formik.touched.email && formik.errors.email ? <span className="text-red-500 font-size-18 pl-2">{formik.errors.email}</span> : null}
                                                        </div>
                                                        <input type="text" name="email" id="email" class={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses("email")}`} {...formik.getFieldProps("email")} />
                                                    </div>

                                                    <div class="col-span-6 sm:col-span-3 p-2">
                                                        <div className="flex items-center mb-2">
                                                            <label for="birthday" class="block font-size-18 font-medium input-label-color">Birth date</label>
                                                            {formik.touched.birthday && formik.errors.birthday ? <span className="text-red-500 font-size-18 pl-2">{formik.errors.birthday}</span> : null}
                                                        </div>
                                                        {/* <input type="date" name="birthday" class={`w-full py-2 dark-text-color font-medium pl-2 serchbar-style ${getInputClasses("birthday")}`} {...formik.getFieldProps("birthday")} /> */}
                                                        <div className="date-picker-grid">
                                                            <div className="date-picker-grid-items">
                                                        <DatePicker
                                                        selected={monthDate}
                                                        onChange={handleMonthDate}
                                                        name="birthday" 
                                                        class="w-full py-2 dark-text-color font-medium pl-2 serchbar-style"
                                                        dateFormat="MMM d"
                                                        placeholderText="Date"
                                                        fixedHeight />
                                                        </div>
                                                        <div className="date-picker-grid-items">
                                                        <DatePicker
                                                        selected={year}
                                                        onChange={handleYear}
                                                        name="birthday" 
                                                        showYearPicker
                                                        dateFormat="yyyy"
                                                        placeholderText="Year"
                                                        fixedHeight
                                                        />
                                                             </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-span-6 sm:col-span-3 p-2">
                                                        <label class="flex items-center create-customer-checkbox">
                                                            <input type="checkbox" checked={isProSMS} onClick={() => { setIsProSMS(!isProSMS) }} class={`form-checkbox ${getInputClasses("isPromotional")}`} {...formik.getFieldProps("isPromotional")} />
                                                            <span class="ml-2 font-size-18">Promotional SMS</span>
                                                            {formik.touched.isPromotional && formik.errors.isPromotional ? <span className="text-red-500 font-size-18 pl-2">{formik.errors.isPromotional}</span> : null}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {/*footer*/}
                                    <div className="flex items-center justify-center p-6 rounded-b">
                                        <button
                                            type="submit"
                                            onClick={formik.handleSubmit}
                                            className="mr-remove cus-medium-btn 
                                            font-size-16 font-medium 
                                            tracking-normal white-text-color
                                            tracking-normal cursor-pointer">
                                            Add New Customer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </div>


        </>
    )
}
