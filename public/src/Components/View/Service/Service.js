import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import AddEditCategoryModal from "./AddEditCategoryModal";
import AddEditServiceModal from "./AddEditServiceModal";
// import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "../../Sass/Service.scss";
import { logout } from "../../../utils/auth.util";
import Dropdown from "../../basic/Dropdown";
import Auth from "../../../helpers/Auth";

import ImportCategoryModal from "./ImportCategoryModal";
import ChildSidebar from "../Layout/ChildSidebar";
import ImportServiceModal from "./ImportServiceModal";
import DropdownService from "../../basic/DropdownService";
import ProfileImage from "../../../assets/svg/profile-image.png";
import ProfileEdit from "../../../assets/svg/profile-edit.png";
import SettingIcon from "../../../assets/svg/setting.svg";
import ImportIcon from "../../../assets/svg/import-button.png";
import ProfileDelete from "../../../assets/svg/profile-delete.png";
import SearchIcon from "../../../assets/svg/search.svg";
import BellImage from "../../../assets/svg/bell.svg";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AddNewCategoryModal from "../../Common/Modal/AddNewCategoryModal";
import AddNewServiceModal from "../../Common/Modal/AddNewServiceModal";
import ImportCategoryFromExcelModal from "../../Common/Modal/ImportCategoryFromExcelModal";
import ImportServiceFromExcelModal from "../../Common/Modal/ImportServiceFromExcelModal";
import Success from "../../Common/Toaster/Success/Success";
import Delete from "../../Common/Toaster/Delete";
import { get_Setting } from "../../../utils/user.util";
import { motion } from "framer-motion/dist/framer-motion";

export default function Service() {
  const addNewRef = useRef();
  const importMenuRef = useRef();

  const [loading, setLoading] = useState(false);
  const [serviceSubMenu, setServiceSubMenu] = useState(false);
  const [importMenu, setImportMenu] = useState(false);
  const [addNewMenu, setAddNewMenu] = useState(false);
  const [services, setServices] = useState([]);
  const [serv, setServ] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [childSidebar, setChildSidebar] = useState(false);
  const [editCategoryObject, setEditCategoryObject] = useState();
  const [editSeriveObject, setEditServiceObject] = useState();
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [allCompanyServices, setAllCompanyServices] = useState();
  const [searchKeyword, setSearchKeyword] = useState();
  const [er, setEr] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [editService, setEditService] = useState();
  const [addSerInCat, setAddSerInCat] = useState();
  const [editCategory, setEditCategory] = useState();
  const [deleteCategoryId, setDeleteCategoryId] = useState();

  const [uploadCategoryExcel, setUploadCategoryExcelModal] = useState(false);
  const setUploadCategoryExcel = () =>
    setUploadCategoryExcelModal(!uploadCategoryExcel);

  const [uploadServiceExcel, setUploadServiceExcelModal] = useState(false);
  const setUploadServiceExcel = () =>
    setUploadServiceExcelModal(!uploadServiceExcel);

  const userInfo = Auth.getUserDetail();
  let SettingInfo = get_Setting();

  const permission = userInfo.permission;

  const [importCategoryFromExcel, setImportCategoryFromExcelModal] =
    useState(false);
  const ImportCategory = () =>
    setImportCategoryFromExcelModal(!importCategoryFromExcel);

  const [importServiceFromExcel, setImportServiceFromExcelModal] =
    useState(false);
  const ImportService = () =>
    setImportServiceFromExcelModal(!importServiceFromExcel);

  const [editCategorymodal, setEditCategoryModal] = useState(false);
  const editCategoryModaltoggle = () =>
    setEditCategoryModal(!editCategorymodal);

  const [editSerivemodal, setEditSeriveModal] = useState(false);
  const editSeriveModaltoggle = () => setEditSeriveModal(!editSerivemodal);

  const renderMobileSidebar = () => {
    let divEle = document.getElementsByClassName("sidebar-banner")[0];
    divEle.classList.toggle("sidebar-display");
  };

  const [addNewCategoryModal, setAddNewCategoryModal] = useState(false);
  const AddNewCategory = () => {
    AddNewCategoryModaltoggle();
  };
  const AddNewCategoryModaltoggle = (data) => {
    setAddNewCategoryModal(!addNewCategoryModal);
    setEditCategory();
    if (addNewCategoryModal === true) {
      if (data) {
        if (data === 200) {
          getAllCategories();
          setSuccess(true);
          setToastmsg(editCategory ? "Changes Saved!" : "New category added!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  let operatorPolicy = [
    {
      name: "Sales analytics",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Appointments analytics",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Statement",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Add new appointment",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Generate new invoice/Checkout",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Appointment actions (Cancel, No-show, Edit)",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Sales Data",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Visit Data",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "General settings actions (Change working hours, edit profile, edit tax, edit currency)",
      category: "Settings",
      isChecked: true,
    },
    {
      name: "Appointment tab page & actions",
      category: "Settings",
      isChecked: true,
    },
    {
      name: "Invoices tab page & actions",
      category: "Settings",
      isChecked: true,
    },
    {
      name: "Inventory tab page & actions",
      category: "Settings",
      isChecked: true,
    },
    {
      name: "Roles permissions tab page & actions",
      category: "Settings",
      isChecked: true,
    },
    {
      name: "Customer page",
      category: "Customer",
      isChecked: true,
    },
    {
      name: "Add new customer",
      category: "Customer",
      isChecked: true,
    },
    {
      name: "Edit/delete customer",
      category: "Customer",
      isChecked: true,
    },

    {
      name: "Customer analytics",
      category: "Customer",
      isChecked: true,
    },
    {
      name: "Access other staff profiles",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Add new staff",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Edit staff",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Delete staff",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Staff transaction",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Staff analytics",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Invoices page",
      category: "Invoices",
      isChecked: true,
    },
    {
      name: "Edit/delete invoice",
      category: "Invoices",
      isChecked: true,
    },
    {
      name: "Allow send SMS to customer",
      category: "Invoices",
      isChecked: true,
    },
    {
      name: "Inventory page",
      category: "Inventory",
      isChecked: true,
    },
    {
      name: "Add new product/Brand/Category",
      category: "Inventory",
      isChecked: true,
    },
    {
      name: "Edit/delete products, brands, and categories",
      category: "Inventory",
      isChecked: true,
    },
    {
      name: "Add stock",
      category: "Inventory",
      isChecked: true,
    },
    {
      name: "Service page",
      category: "Services",
      isChecked: true,
    },
    {
      name: "Add new category/service",
      category: "Services",
      isChecked: true,
    },
    {
      name: "Edit/delete category/service",
      category: "Services",
      isChecked: true,
    },
    {
      name: "Import category/service",
      category: "Services",
      isChecked: true,
    },
    {
      name: "Membership page",
      category: "Membership",
      isChecked: true,
    },
    {
      name: "Add new membership",
      category: "Membership",
      isChecked: true,
    },
    {
      name: "Edit/delete membership",
      category: "Membership",
      isChecked: true,
    },
    {
      name: "Membership information",
      category: "Membership",
      isChecked: true,
    },
    {
      name: "Expense",
      category: "Dashboard",
      isChecked: true,
    },
    {
      name: "Edit opening collection",
      category: "Expense",
      isChecked: true,
    },
    {
      name: "Add new records",
      category: "Expense",
      isChecked: true,
    },
    {
      name: "Register",
      category: "Expense",
      isChecked: true,
    },
    {
      name: "Request clock in/out",
      category: "Attendance",
      isChecked: true,
    },
    {
      name: "Accept/Mark attendance",
      category: "Attendance",
      isChecked: true,
    },
    {
      name: "Edit attendance",
      category: "Attendance",
      isChecked: true,
    },
    {
      name: "Membership tab page & actions",
      category: "Settings",
      isChecked: true,
    },

    {
      name: "Staff tab page & actions",
      category: "Settings",
      isChecked: true,
    },
    {
      name: "Customer transaction",
      category: "Customer",
      isChecked: true,
    },
    {
      name: "Customer feedback & notes",
      category: "Customer",
      isChecked: true,
    },
    {
      name: "Customer wallet",
      category: "Customer",
      isChecked: true,
    },
    {
      name: "Staff attendance",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Staff commission",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Create past invoices",
      category: "Invoices",
      isChecked: true,
    },
    {
      name: "Stock history",
      category: "Inventory",
      isChecked: true,
    },
    {
      name: "Generated invoices",
      category: "Dashboard",
      isChecked: true,
    },
  ];

  let staffPolicy = [
    {
      name: "Sales analytics",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Appointments analytics",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Statement",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Add new appointment",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Generate new invoice/Checkout",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Appointment actions (Cancel, No-show, Edit)",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Sales Data",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Visit Data",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "General settings actions (Change working hours, edit profile, edit tax, edit currency)",
      category: "Settings",
      isChecked: false,
    },
    {
      name: "Appointment tab page & actions",
      category: "Settings",
      isChecked: false,
    },
    {
      name: "Invoices tab page & actions",
      category: "Settings",
      isChecked: false,
    },
    {
      name: "Inventory tab page & actions",
      category: "Settings",
      isChecked: false,
    },
    {
      name: "Roles permissions tab page & actions",
      category: "Settings",
      isChecked: false,
    },
    {
      name: "Customer page",
      category: "Customer",
      isChecked: false,
    },
    {
      name: "Add new customer",
      category: "Customer",
      isChecked: false,
    },
    {
      name: "Edit/delete customer",
      category: "Customer",
      isChecked: false,
    },

    {
      name: "Customer analytics",
      category: "Customer",
      isChecked: false,
    },
    {
      name: "Access other staff profiles",
      category: "Staff",
      isChecked: false,
    },
    {
      name: "Add new staff",
      category: "Staff",
      isChecked: false,
    },
    {
      name: "Edit staff",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Delete staff",
      category: "Staff",
      isChecked: false,
    },
    {
      name: "Staff transaction",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Staff analytics",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Invoices page",
      category: "Invoices",
      isChecked: false,
    },
    {
      name: "Edit/delete invoice",
      category: "Invoices",
      isChecked: false,
    },
    {
      name: "Allow send SMS to customer",
      category: "Invoices",
      isChecked: false,
    },
    {
      name: "Inventory page",
      category: "Inventory",
      isChecked: true,
    },
    {
      name: "Add new product/Brand/Category",
      category: "Inventory",
      isChecked: false,
    },
    {
      name: "Edit/delete products, brands, and categories",
      category: "Inventory",
      isChecked: false,
    },
    {
      name: "Add stock",
      category: "Inventory",
      isChecked: false,
    },
    {
      name: "Service page",
      category: "Services",
      isChecked: true,
    },
    {
      name: "Add new category/service",
      category: "Services",
      isChecked: false,
    },
    {
      name: "Edit/delete category/service",
      category: "Services",
      isChecked: false,
    },
    {
      name: "Import category/service",
      category: "Services",
      isChecked: false,
    },
    {
      name: "Membership page",
      category: "Membership",
      isChecked: true,
    },
    {
      name: "Add new membership",
      category: "Membership",
      isChecked: false,
    },
    {
      name: "Edit/delete membership",
      category: "Membership",
      isChecked: false,
    },
    {
      name: "Membership information",
      category: "Membership",
      isChecked: false,
    },
    {
      name: "Collection",
      category: "Dashboard",
      isChecked: false,
    },
    {
      name: "Edit opening collection",
      category: "Collection",
      isChecked: false,
    },
    {
      name: "Add new records",
      category: "Collection",
      isChecked: false,
    },
    {
      name: "Cash register",
      category: "Collection",
      isChecked: false,
    },
    {
      name: "Request clock in/out",
      category: "Attendance",
      isChecked: true,
    },
    {
      name: "Accept/Mark attendance",
      category: "Attendance",
      isChecked: false,
    },
    {
      name: "Edit attendance",
      category: "Attendance",
      isChecked: false,
    },
    {
      name: "Membership tab page & actions",
      category: "Settings",
      isChecked: false,
    },
    {
      name: "Staff tab page & actions",
      category: "Settings",
      isChecked: false,
    },
    {
      name: "Customer transaction",
      category: "Customer",
      isChecked: false,
    },
    {
      name: "Customer feedback & notes",
      category: "Customer",
      isChecked: false,
    },
    {
      name: "Customer wallet",
      category: "Customer",
      isChecked: false,
    },
    {
      name: "Staff attendance",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Staff commission",
      category: "Staff",
      isChecked: true,
    },
    {
      name: "Create past invoices",
      category: "Invoices",
      isChecked: false,
    },
    {
      name: "Stock history",
      category: "Inventory",
      isChecked: false,
    },
    {
      name: "Generated invoices",
      category: "Dashboard",
      isChecked: false,
    },
  ];

  // useEffect(async () => {
  //   try {
  //     let res = await ApiGet("permission");
  //     if (res.data.status === 200) {
  //       console.log("reponce", res.data.data);
  //       let newpermission=res.data.data.map(async(obj)=>{

  //         if(obj.type === "staffPolicy"){
  //           let newPer = obj?.permissionMenu?.map((per)=>{
  //              if(per?.name === "Collection"){
  //               return(
  //                 {...per,name:"Expense"}
  //               )
  //              }else if(per?.category === "Collection" && per?.name === "Cash register" ){
  //               return(
  //                 {...per,category:"Expense", name :"Register"}
  //               )
  //              }else if(per?.category === "Collection"){
  //               return(
  //                 {...per,category:"Expense"}
  //               )
  //              }else {
  //               return(
  //                 {...per}
  //               )
  //              }
  //           })
  //           console.log("newPer",newPer)
  //           let newpermissions={
  //             permissionMenu:newPer
  //           }
  //           await ApiPut("permission/" + obj._id, newpermissions).then((resp)=>{
  //             console.log("resp",resp)
  //           })
  //         return(     
  //           {...obj,permissionMenu:staffPolicy}
          

  //         )
  //         }else{
  //           let newPerm = obj?.permissionMenu?.map((per)=>{
  //             if(per?.name === "Collection"){
  //              return(
  //                {...per,name:"Expense"}
  //              )
  //             }else if(per?.category === "Collection" && per?.name === "Cash register" ){
  //              return(
  //                {...per,category:"Expense", name :"Register"}
  //              )
  //             }else if(per?.category === "Collection"){
  //              return(
  //                {...per,category:"Expense"}
  //              )
  //             }else {
  //              return(  
  //                {...per}
  //              )
  //             }
  //           })
  //           console.log("newPerm",newPerm)
  //           let newpermissionss={
  //             permissionMenu:newPerm
  //           }
  //           await ApiPut("permission/" + obj._id, newpermissionss).then((resp)=>{
  //             console.log("resp",resp)
  //           })
  //           return(     
  //             {...obj,permissionMenu:operatorPolicy}
  //           )
  //         }
       
  //       })
  //       console.log("newpermission",newpermission)
  //     } else {
  //     }
  //   } catch (err) {}
  // }, []);

  const [addNewServiceModal, setAddNewServiceModal] = useState(false);
  const AddNewService = () => {
    AddNewServiceModaltoggle();
  };
  const AddNewServiceModaltoggle = (data) => {
    setAddNewServiceModal(!addNewServiceModal);
    setEditService();
    setAddSerInCat();
    if (addNewServiceModal === true) {
      if (data) {
        if (data === 200) {
          getAllServices();
          setSuccess(true);
          setToastmsg(editService ? "Changes saved!" : "New service added!");
        } else {
          if (data.status === 200) {
            getAllServices();
            setSuccess(true);
            setToastmsg("Record deleted!");
          } else {
            setSuccess(true);
            setEr("Error");
            setToastmsg("Something went wrong");
          }
        }
      }
    }
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);
    if (deleteModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Record deleted!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const editServiceModal = (e, data) => {
    AddNewService();
    setEditService(data);
  };

  const addServiceInCategory = (e, data) => {
    AddNewService();
    setAddSerInCat(data);
  };

  const editCategoryFunc = (e, data) => {
    AddNewCategory();
    setEditCategory(data);
  };

  const deleteCategoryFunc = (e, data) => {
    opendeleteModal();
    setDeleteCategoryId(data._id);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);

    var serviceData =
      allCompanyServices.length > 0 &&
      allCompanyServices.filter(
        (obj) =>
          (obj.serviceName &&
            obj.serviceName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.amount &&
            obj.amount.toString().includes(e.target.value.toString()))
      );

    var categoryData = [];
    serviceData.length > 0 &&
      serviceData.map((ser) => {
        allCategories.filter((cat) => {
          if (cat._id === ser.categoryId) {
            if (!categoryData.includes(cat)) {
              categoryData.push(cat);
            }
          }
        });
      });

    if (e.target.value === "") {
      setServices(allServices);
      setCategories(allCategories);
    } else {
      setServices(serviceData);
      if (categoryData.length > 0) {
        setCategories(categoryData);
      } else {
        setCategories(
          allCategories.filter(
            (obj) =>
              obj.categoryName &&
              obj.categoryName
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
          )
        );
      }
    }

    // setCategories(allCategories.filter((obj) =>
    //     obj.categoryName && obj.categoryName.toLowerCase().includes(e.target.value.toLowerCase())
    // ));
  };



  const getServiceByCategoryId = async (categoryId) => {
    try {
      setLoading(true);
      let res = await ApiGet(
        "service/category/company/service/" +
          userInfo.companyId +
          "/" +
          categoryId
      );
      if (res.data.status === 200) {
        setLoading(false);
        if (searchKeyword) {
          let serviceData =
            res.data.data.length > 0 &&
            res.data.data.filter(
              (obj) =>
                obj.serviceName &&
                obj.serviceName
                  .toLowerCase()
                  .includes(searchKeyword.toLowerCase())
            );
          setAllServices(res.data.data.filter((rep) => rep.default === false));
          //  setServ(res.data.data)
          setServices(res.data.data);
        } else {
          setServices(res.data.data);
          setAllServices(res.data.data.filter((rep) => rep.default === false));
        }
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Categories", err);
    }
  };

  const getAllCategories = async (e) => {
    try {
      setLoading(true);
      let res = await ApiGet("category/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setCategories(
          res.data.data.filter((rep) =>
            rep.categoryName === "Unassign" ? null : rep
          )
        );
        setSelectedCategoryId(res.data.data[0]._id);
        getServiceByCategoryId(res.data.data[0]._id);
        setAllCategories(
          res.data.data.filter((rep) =>
            rep.categoryName === "Unassign" ? null : rep
          )
        );
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Categories", err);
    }
  };

  const getAllServices = async (e) => {
    try {
      setLoading(true);
      let res = await ApiGet("service/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setAllCompanyServices(
          res.data.data.filter((rep) => rep.default === false)
        );
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Categories", err);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (addNewMenu) {
        if (
          addNewMenu &&
          addNewRef.current &&
          !addNewRef.current.contains(e.target)
        ) {
          setAddNewMenu(false);
        }
      } else if (importMenu) {
        if (
          importMenu &&
          importMenuRef.current &&
          !importMenuRef.current.contains(e.target)
        ) {
          setImportMenu(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [addNewMenu, importMenu]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  useEffect(async () => {
    getAllCategories();
    getAllServices();
  }, []);

  return (
    <>
      {childSidebar && <ChildSidebar modal={childSidebar} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="content"
        id="main-contain"
      >
        {/* {uploadCategoryExcel && (
          <ImportCategoryModal
            isOpen={uploadCategoryExcel}
            toggle={() => {
              setUploadCategoryExcel((e) => !e);
            }}
            // handleCategorySubmit={(values) => handleCategorySubmit(values)}
          />
        )} */}
        {/* {uploadServiceExcel && (
          <ImportServiceModal
            isOpen={uploadServiceExcel}
            toggle={() => {
              setUploadServiceExcel((e) => !e);
            }}
            // handleSubmit={(values) => handleSubmit(values)}
          />
        )} */}
        <div className="container-fluid container-left-right-space">
          {/* <header>
                        <div className="flex items-center pl-1 pr-1 justify-between mobile-view-block">
                            <div className="flex items-center">
                                <div className="toogle pr-3" onClick={renderMobileSidebar}>
                                    <i class="fas fa-align-left heading-title-text-color font-size-25"></i>
                                </div>
                                <p className="font-size-35 font-bold tracking-normal heading-title-text-color mb-0 cursor-pointer">
                                    Services
                            </p>
                            </div>
                            <div className="flex items-center mobile-view-between mobile-view-mt-1">
                                
                                <div>
                                    {userInfo && userInfo.role === "Staff" ?
                                        <div className="notification-round cursor-pointer flex items-center justify-center relative setting-header-icon">
                                            <i className="fas fa-sign-out-alt cursor-pointer" onClick={() => { logout() }} ></i>
                                        </div>
                                        :
                                        <NavLink to="/setting">
                                            <div className="notification-round cursor-pointer flex items-center justify-center relative setting-header-icon">
                                                <img src={require("../../../assets/img/new-setting.png").default} />
                                            </div>
                                        </NavLink>
                                    }
                                </div>
                            </div>
                        </div>
                    </header> */}
          {addNewCategoryModal && (
            <AddNewCategoryModal
              modal={addNewCategoryModal}
              toggle={AddNewCategoryModaltoggle}
              editCategory={editCategory}
            />
          )}
          {addNewServiceModal && (
            <AddNewServiceModal
              modal={addNewServiceModal}
              toggle={AddNewServiceModaltoggle}
              editService={editService}
              addSerInCat={addSerInCat}
              permission={permission}
              getAllServices={getAllServices}
              SettingInfo={SettingInfo}
            />
          )}
          {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
          {deleteModal && (
            <Delete
              modal={deleteModal}
              toggle={deleteModaltoggle}
              deleteCategoryWithService={deleteCategoryId}
            />
          )}
          {importCategoryFromExcel && (
            <ImportCategoryFromExcelModal
              isOpen={importCategoryFromExcel}
              toggle={() => {
                ImportCategory((e) => !e);
              }}
            />
          )}
          {importServiceFromExcel && (
            <ImportServiceFromExcelModal
              isOpen={importServiceFromExcel}
              toggle={() => {
                ImportService((e) => !e);
              }}
            />
          )}
          <div className="dashboard-header">
            <div className="header-alignment">
              <div className="header-title">
                <i
                  class="fas fa-bars"
                  onClick={() => setChildSidebar(!childSidebar)}
                ></i>
                <h2>Services</h2>
              </div>
              <div className="header-notification">
                {/* <div className="icon-design">
                  <div className="relative">
                    <img src={BellImage} alt="BellImage" />
                  </div>
                  <div className="bell-icon-design"></div>
                </div> */}
                {/* {permission?.filter((obj)=>obj.name ===  "Settings page")?.[0]?.isChecked === false ? null : */}
                <NavLink to="/setting">
                  <div className="cus-icon-design-last">
                    <div className="iconic-tab">
                      <div className="iconic-icon">
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5476 22.75H9.45259C8.92397 22.75 8.46659 22.3821 8.35347 21.8658L7.89559 19.7463C7.28477 19.4786 6.70559 19.144 6.16872 18.7484L4.10209 19.4065C3.59809 19.5672 3.0502 19.3551 2.78584 18.8969L0.733841 15.352C0.472378 14.8936 0.562457 14.3153 0.950966 13.9581L2.55409 12.4956C2.48119 11.8331 2.48119 11.1646 2.55409 10.5021L0.950966 9.043C0.561885 8.68566 0.47177 8.10669 0.733841 7.648L2.78134 4.10088C3.0457 3.64266 3.59359 3.43053 4.09759 3.59125L6.16422 4.24938C6.43879 4.04593 6.72462 3.85813 7.02034 3.68688C7.30422 3.52678 7.59638 3.38183 7.89559 3.25262L8.35459 1.13538C8.46717 0.618965 8.92405 0.250556 9.45259 0.25H13.5476C14.0761 0.250556 14.533 0.618965 14.6456 1.13538L15.1091 3.25375C15.425 3.39271 15.7326 3.54972 16.0305 3.724C16.3083 3.88466 16.5768 4.06082 16.8348 4.25163L18.9026 3.5935C19.4063 3.43338 19.9535 3.64543 20.2177 4.10312L22.2652 7.65025C22.5267 8.10867 22.4366 8.68695 22.0481 9.04412L20.445 10.5066C20.5179 11.1691 20.5179 11.8376 20.445 12.5001L22.0481 13.9626C22.4366 14.3198 22.5267 14.8981 22.2652 15.3565L20.2177 18.9036C19.9535 19.3613 19.4063 19.5734 18.9026 19.4132L16.8348 18.7551C16.5732 18.9478 16.3013 19.1262 16.0203 19.2895C15.7254 19.4604 15.4212 19.6148 15.1091 19.7519L14.6456 21.8658C14.5326 22.3817 14.0758 22.7496 13.5476 22.75ZM6.57259 16.2576L7.49509 16.9326C7.70305 17.0858 7.91979 17.2267 8.14422 17.3545C8.35538 17.4768 8.5728 17.5879 8.79559 17.6875L9.84522 18.1476L10.3593 20.5H12.6431L13.1572 18.1465L14.2068 17.6864C14.6651 17.4843 15.1 17.2331 15.504 16.9371L16.4276 16.2621L18.7237 16.9934L19.8656 15.0156L18.0847 13.3923L18.2107 12.2537C18.2661 11.7558 18.2661 11.2532 18.2107 10.7552L18.0847 9.61675L19.8667 7.99L18.7237 6.01112L16.4276 6.74237L15.504 6.06738C15.0999 5.77005 14.665 5.51697 14.2068 5.3125L13.1572 4.85238L12.6431 2.5H10.3593L9.84297 4.8535L8.79559 5.3125C8.57262 5.41042 8.35517 5.52046 8.14422 5.64213C7.92117 5.76962 7.70557 5.90972 7.49847 6.06175L6.57484 6.73675L4.27984 6.0055L3.13572 7.99L4.91659 9.61112L4.79059 10.7507C4.73524 11.2487 4.73524 11.7513 4.79059 12.2493L4.91659 13.3878L3.13572 15.0111L4.27759 16.9889L6.57259 16.2576ZM11.4956 16C9.01031 16 6.99559 13.9853 6.99559 11.5C6.99559 9.01472 9.01031 7 11.4956 7C13.9809 7 15.9956 9.01472 15.9956 11.5C15.9925 13.984 13.9796 15.9969 11.4956 16ZM11.4956 9.25C10.2664 9.25125 9.26571 10.2387 9.2481 11.4678C9.23049 12.6968 10.2025 13.7125 11.4311 13.749C12.6598 13.7855 13.6903 12.8292 13.7456 11.6012V12.0512V11.5C13.7456 10.2574 12.7382 9.25 11.4956 9.25Z"
                            fill="#97A7C3"
                          />
                        </svg>
                      </div>
                      <div className="iconic-icon-hover">
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5478 22.75H9.45284C8.92422 22.75 8.46684 22.3821 8.35371 21.8658L7.89584 19.7463C7.28502 19.4786 6.70584 19.144 6.16896 18.7484L4.10234 19.4065C3.59834 19.5672 3.05045 19.3551 2.78609 18.8969L0.734085 15.352C0.472622 14.8936 0.562701 14.3153 0.95121 13.9581L2.55434 12.4956C2.48143 11.8331 2.48143 11.1646 2.55434 10.5021L0.95121 9.043C0.562129 8.68566 0.472014 8.10669 0.734085 7.648L2.78159 4.10088C3.04595 3.64266 3.59384 3.43053 4.09784 3.59125L6.16446 4.24938C6.43903 4.04593 6.72486 3.85813 7.02059 3.68688C7.30447 3.52678 7.59663 3.38183 7.89584 3.25262L8.35484 1.13538C8.46741 0.618965 8.9243 0.250556 9.45284 0.25H13.5478C14.0764 0.250556 14.5333 0.618965 14.6458 1.13538L15.1093 3.25375C15.4252 3.39271 15.7329 3.54972 16.0307 3.724C16.3085 3.88466 16.5771 4.06082 16.8351 4.25163L18.9028 3.5935C19.4065 3.43338 19.9537 3.64543 20.218 4.10312L22.2655 7.65025C22.5269 8.10867 22.4368 8.68695 22.0483 9.04412L20.4452 10.5066C20.5181 11.1691 20.5181 11.8376 20.4452 12.5001L22.0483 13.9626C22.4368 14.3198 22.5269 14.8981 22.2655 15.3565L20.218 18.9036C19.9537 19.3613 19.4065 19.5734 18.9028 19.4132L16.8351 18.7551C16.5734 18.9478 16.3015 19.1262 16.0206 19.2895C15.7256 19.4604 15.4214 19.6148 15.1093 19.7519L14.6458 21.8658C14.5328 22.3817 14.076 22.7496 13.5478 22.75ZM6.57284 16.2576L7.49534 16.9326C7.70329 17.0858 7.92004 17.2267 8.14446 17.3545C8.35563 17.4768 8.57305 17.5879 8.79584 17.6875L9.84546 18.1476L10.3596 20.5H12.6433L13.1575 18.1465L14.2071 17.6864C14.6653 17.4843 15.1002 17.2331 15.5042 16.9371L16.4278 16.2621L18.724 16.9934L19.8658 15.0156L18.085 13.3923L18.211 12.2537C18.2663 11.7558 18.2663 11.2532 18.211 10.7552L18.085 9.61675L19.867 7.99L18.724 6.01112L16.4278 6.74237L15.5042 6.06738C15.1001 5.77005 14.6652 5.51697 14.2071 5.3125L13.1575 4.85238L12.6433 2.5H10.3596L9.84321 4.8535L8.79584 5.3125C8.57287 5.41042 8.35542 5.52046 8.14446 5.64213C7.92141 5.76962 7.70581 5.90972 7.49871 6.06175L6.57509 6.73675L4.28009 6.0055L3.13596 7.99L4.91684 9.61112L4.79084 10.7507C4.73549 11.2487 4.73549 11.7513 4.79084 12.2493L4.91684 13.3878L3.13596 15.0111L4.27784 16.9889L6.57284 16.2576ZM11.4958 16C9.01055 16 6.99584 13.9853 6.99584 11.5C6.99584 9.01472 9.01055 7 11.4958 7C13.9811 7 15.9958 9.01472 15.9958 11.5C15.9927 13.984 13.9798 15.9969 11.4958 16ZM11.4958 9.25C10.2667 9.25125 9.26596 10.2387 9.24835 11.4678C9.23073 12.6968 10.2027 13.7125 11.4314 13.749C12.66 13.7855 13.6905 12.8292 13.7458 11.6012V12.0512V11.5C13.7458 10.2574 12.7385 9.25 11.4958 9.25Z"
                            fill="#1479FF"
                          />
                        </svg>
                      </div>
                      <p className="iconic-title">Settings</p>
                    </div>
                  </div>
                </NavLink>
                {/* } */}
              </div>
            </div>
          </div>
          <div className="service-sub-header">
            <div className="service-button-search-alignment">
              <div className="input-relative">
                <input
                  type="search"
                  placeholder="Search category, service or price"
                  onChange={(e) => handleSearch(e)}
                  autoFocus
                />
                <div className="search-icon-alignment-customer">
                  <img src={SearchIcon} alt="searchIcon" />
                </div>
              </div>
              <div className="service-button-alignment">
                {/* {permission?.filter((obj)=>obj.name === "Import category/service")?.[0]?.isChecked === false ? null : (
                <div className="relative" ref={importMenuRef}>
                  <button
                    className="import-button-style"
                    onClick={() => setImportMenu(!importMenu)}
                  >
                    <img src={ImportIcon} alt="ImportIcon" />
                    Import
                  </button>
                  <div
                    className={
                      importMenu
                        ? "add-new-option add-new-option-show"
                        : "add-new-option add-new-option-hidden"
                    }
                  >
                    <div className="add-new-sub-menu-design">
                      <ul>
                        <li onClick={() => ImportCategory()}>
                          Category from excel
                        </li>
                        <li onClick={() => ImportService()}>
                          Service from excel
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )} */}
                <div className="relative" ref={addNewRef}>
                  {permission?.filter(
                    (obj) => obj.name === "Add new category/service"
                  )[0]?.isChecked === false ? null : (
                    <button
                      className="add-new-button-style"
                      onClick={() => setAddNewMenu(!addNewMenu)}
                    >
                      Add New
                    </button>
                  )}
                  <div
                    className={
                      addNewMenu
                        ? "add-new-option add-new-option-show"
                        : "add-new-option add-new-option-hidden"
                    }
                  >
                    <div className="add-new-sub-menu-design">
                      <ul>
                        <li onClick={() => AddNewCategory()}>Category</li>
                        <li onClick={() => AddNewService()}>Service</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="all-service-box-screen-height">
            <div className="center-box-align">
              <div>
                {categories.length > 0 ? (
                  categories?.map((category) => {
                    return (
                      <div key={category._id} className="service-box-design">
                        <div className="service-heading-grid">
                          <div className="service-heading-grid-items">
                            <div className="sub-grid">
                              <div className="sub-grid-items">
                                <div
                                  className="divider-dynamic"
                                  style={{
                                    backgroundColor: category.categoryColor,
                                  }}
                                  value={category.categoryColor}
                                ></div>
                              </div>
                              <div className="sub-grid-items">
                                <p>{category?.categoryName}</p>
                              </div>
                            </div>
                          </div>
                          <div className="service-heading-grid-items relative">
                            {permission?.filter(
                              (obj) => obj.name === "Add new category/service"
                            )[0]?.isChecked === false &&
                            permission?.filter(
                              (obj) =>
                                obj.name === "Edit/delete category/service"
                            )[0]?.isChecked === false ? null : (
                              <div
                                className="more-option-cus-menu"
                                onClick={() =>
                                  setServiceSubMenu(!serviceSubMenu)
                                }
                              >
                                <svg
                                  width="23"
                                  height="5"
                                  viewBox="0 0 23 5"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="11.5"
                                    cy="2.5"
                                    r="2.5"
                                    fill="#97A7C3"
                                  />
                                  <circle
                                    cx="2.5"
                                    cy="2.5"
                                    r="2.5"
                                    fill="#97A7C3"
                                  />
                                  <circle
                                    cx="20.5"
                                    cy="2.5"
                                    r="2.5"
                                    fill="#97A7C3"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="service-table-submenu">
                              <div className="service-table-submenu">
                                <ul>
                                  {permission?.filter(
                                    (obj) =>
                                      obj.name === "Add new category/service"
                                  )[0]?.isChecked === false ? null : (
                                    <li
                                      onClick={(e) =>
                                        addServiceInCategory(e, category)
                                      }
                                    >
                                      Add new service
                                    </li>
                                  )}
                                  {permission?.filter(
                                    (obj) =>
                                      obj.name ===
                                      "Edit/delete category/service"
                                  )[0]?.isChecked === false ? null : (
                                    <li
                                      onClick={(e) =>
                                        editCategoryFunc(e, category)
                                      }
                                    >
                                      Edit category
                                    </li>
                                  )}
                                  {/* <li
                                    onClick={(e) =>
                                      deleteCategoryFunc(e, category)
                                    }
                                  >
                                    Delete category
                                  </li> */}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="service-table-design">
                          <table className="service-sub-table">
                            {allCompanyServices
                              ?.filter(
                                (res) => res.categoryId === category?._id
                              )
                              .map((service) => {
                                return (
                                  <tr
                                    key={service._id}
                                    onClick={(e) =>
                                      editServiceModal(e, service)
                                    }
                                  >
                                    <th align="left">
                                      <span>{service?.serviceName}</span>
                                    </th>
                                    <th align="center">
                                      {service?.duration} mins
                                    </th>
                                    <th align="right">
                                      <span>
                                        <a>{SettingInfo?.currentType}</a>{" "}
                                        {service?.amount}
                                      </span>
                                    </th>
                                  </tr>
                                );
                              })}
                          </table>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="system-does-not ">
                    <p className="text-center">
                      Database has no such entry listed as a service or a
                      category
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
