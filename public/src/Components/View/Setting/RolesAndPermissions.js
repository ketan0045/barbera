import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ApiGet } from "../../../helpers/API/ApiData";
import EditOperatorStaffPermissionModal from "../../Common/Modal/RolesAndPermissionChildModal/EditOperatorStaffPermissionModal";
import EditPermissionModal from "../../Common/Modal/RolesAndPermissionChildModal/EditPermissionModal";
import RolesAndPermissionModal from "../../Common/Modal/RolesAndPermissionModal";
import Auth from "../../../helpers/Auth";
import Success from "../../Common/Toaster/Success/Success";
import "../../Common/Modal/Attendance/AttendanceModal.scss";
import OutsideAlerter from "../../Common/OutsideAlerter";
import DeleteAccount from "./DeleteAccount";

export default function RolesAndPermission(props) {
  const {
    allStaff,
    firstTimeSetup,
    setFirstTimeSetup,
    page,
    setPage,
    setKey,
    companyOwnersAccounts,
    setCompanyOwnersAccounts,
    companyOperatorsAccounts,
    setCompanyOperatorsAccounts,
    getAllStaff,
    getAcDetails,
    permission,
  } = props;
  const userInfo = Auth.getUserDetail();
  const dispatch = useDispatch();
  const operatorPermissions = useSelector((state) => state.operatorPermissions);
  const staffPermissions = useSelector((state) => state.staffPermissions);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const operatorPermissionsId = useSelector(
    (state) => state.operatorPermissionsId
  );
  const [optionsShow, setOptionsShow] = useState(false);
  const [targetIndex, setTargetIndex] = useState();

  let permissionListExample = [
    [
      "Dashboard",
      [
        "Sales analytics",
        "Appointments analytics",
        "Statement",
        "Add new appointment",
        "Generate new invoice",
        "Appointment edits (Cancel, No-show, Edit)",
      ],
    ],
    ["Settings", ["Settings page", "Settings functions edit"]],
    [
      "Customer",
      [
        "Customer page",
        "Add new customer",
        "Edit/delete customer",
        "Customer transaction",
        "Customer analytics",
      ],
    ],
    [
      "Staff",
      [
        "Access other staff profiles",
        "Add new staff",
        "Edit staff",
        "Staff transaction",
        "Staff analytics",
      ],
    ],
    [
      "Invoices",
      ["Invoices page", "Edit/delete invoice", "Alllow send SMS to customer"],
    ],
    [
      "Inventory",
      [
        "Inventory page",
        "Add new product",
        "Edit/delete products, brands, and categories",
        "Add stock",
      ],
    ],
    [
      "Services",
      [
        "Service page",
        "Add new category/service",
        "Edit/delete category/service",
      ],
    ],
    [
      "Membership",
      [
        "Membership page",
        "Add new membership",
        "Edit/delete membership",
        "Membership information",
      ],
    ],
  ];

  const staffPermissionsId = useSelector((state) => state.staffPermissionsId);

  // console.log("operatorPermissions", operatorPermissions);
  // console.log("staffPermissions", staffPermissions);
  const [permissionsList, setPermissionsList] = useState([]);

  const [role, setRole] = useState("Owner");

  const [operatorPermissionNames, setOperatorPermissionNames] = useState([]);
  const [staffPermissionNames, setStaffPermissionNames] = useState([]);
  const [temEditPermissions, setTemEditPermissions] = useState([]);
  const [temEditId, setTemEditId] = useState("");
  const [operatorData, setOperatorData] = useState({});
  const [askModal, setAskModal] = useState(false);
  const [account, setAccount] = useState();
  const [type, setType] = useState();
  const [editPermissionModal, setEditPermissionModal] = useState(false);
  const editPermissionToggle = (data) => {
    setEditPermissionModal(!editPermissionModal);
    if (editPermissionModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Permissions Updated!");
        }
      }
    }
  };

  const AccountDeactive=(data,key)=>{
    setAskModal(!askModal)
    setAccount(data)
    setType(key)
    if(data == true){
      getAcDetails()
    }
  }

  const [editOperatorStaffPermissionModal, setEditOperatorPermissionModal] =
    useState(false);
  const editOperatorStaffPermissionToggle = (data) => {
    setEditOperatorPermissionModal(!editOperatorStaffPermissionModal);
    if (editOperatorStaffPermissionModal === true) {
      if (data) {
        if (data.data.status === 200) {
          setSuccess(true);
          setToastmsg("Permissions Updated!");
        }
      }
    }
  };

  const optionsToggle = (index) => {
    setOptionsShow(!optionsShow);
    if (optionsShow) {
      setTargetIndex(null);
    } else {
      setTargetIndex(index);
    }
  };

  const handleEditOperatorStaffPermissionToggle = async (e, key, staffId) => {
    if (key === "open") {
      setTemEditId(staffId);

      let res =
        role === "Staff"
          ? await ApiGet("staff/" + staffId)
          : await ApiGet("account/" + staffId);
      try {
        if (res.data.status === 200) {
          let singleStaffPermission = await res.data.data[0].permission;
          if (role !== "Staff") {
            setOperatorData(res.data.data[0]);
          }
          if (singleStaffPermission.length === 0) {
            setTemEditPermissions(staffPermissions);
            editOperatorStaffPermissionToggle();
          } else {
            setTemEditPermissions(singleStaffPermission);
            editOperatorStaffPermissionToggle();
          }
        }
      } catch (err) {
        console.log("error while getting Forum", err);
      }
    } else {
      setEditOperatorPermissionModal(false);
    }
  };

  const [rolesAndPermissionModal, setRolesAndPermissionModal] = useState(false);
  const rolesAndPermissionToggle = () =>
    setRolesAndPermissionModal(!rolesAndPermissionModal);

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  const generatePermissionList = async () => {
    let uniqueCategoriesList = await removeDuplicateObjectFromArray(
      // operatorPermissions,
      staffPermissions,
      "category"
    );

    let categoriesNames = await uniqueCategoriesList?.map(
      (per) => per.category
    );

    let temPermissionsList = await categoriesNames.map((category) => {
      let services = staffPermissions.filter((per) => {
        return per.category === category && category;
      });
      return { category, services };
    });
    setPermissionsList(temPermissionsList);
    // console.log("temPermissionsList", temPermissionsList);
  };

  const generateOperatorPermissions = async () => {
    let temOpPermissions = await operatorPermissions
      .filter((per) => per.isChecked)
      .map((per) => per.name);
    setOperatorPermissionNames(temOpPermissions);
  };
  const generateStaffPermissions = async () => {
    let temStaffPermissions = await staffPermissions
      .filter((per) => per.isChecked && per.name)
      .map((per) => per.name);
    setStaffPermissionNames(temStaffPermissions);
  };

  const onChangeHandler = (e) => {
    if (e.target.checked && e.target.name === "staff_permissionList") {
      staffPermissionNames.push(e.target.value);
    } else if (e.target.name === "staff_permissionList") {
      let index = staffPermissionNames.indexOf(e.target.value);
      staffPermissionNames.splice(index, 1);
    }
    setStaffPermissionNames([...staffPermissionNames]);

    if (e.target.checked && e.target.name === "operator_permissionList") {
      operatorPermissionNames.push(e.target.value);
    } else if (e.target.name === "operator_permissionList") {
      let index = operatorPermissionNames.indexOf(e.target.value);
      operatorPermissionNames.splice(index, 1);
    }
    setOperatorPermissionNames([...operatorPermissionNames]);
  };
  // console.log("staffPermissionNames", staffPermissionNames);
  // console.log("operatorPermissionNames", operatorPermissionNames);

  useEffect(() => {
    generatePermissionList();
    generateOperatorPermissions();
    generateStaffPermissions();
  }, []);

  const handleAddNewOwnerOperator = (e, key) => {
    rolesAndPermissionToggle();
    setPage(key);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <div>
      <div className="setting-sub-grid">
        <div className="setting-sub-grid-items">
          <div className="role-operator-box-height">
            <div className="cus-tab-design">
              <ul>
                <li
                  className={role === "Owner" && "active-tab-cus-background"}
                  onClick={(e) => setRole("Owner")}
                >
                  Owner
                </li>
                <li
                  className={role === "Operator" && "active-tab-cus-background"}
                  onClick={(e) => setRole("Operator")}
                >
                  Operator
                </li>
                <li
                  className={role === "Staff" && "active-tab-cus-background"}
                  onClick={(e) => setRole("Staff")}
                >
                  Staff
                </li>
              </ul>
            </div>
          </div>
          <div>
            {/* {permission?.filter(
              (obj) => obj.name === "Settings functions edit"
            )?.[0]?.isChecked === false ? null : ( */}
            {userInfo?.role !== "Staff" && (
              <div className="Edit-permissions-button">
                <button onClick={() => editPermissionToggle()}>
                  Edit permissions
                </button>
              </div>
            )}
            {/* )} */}
          </div>
        </div>
        {role === "Owner" && (
          <div
            className="setting-sub-grid-items"
            style={{ border: "none", paddingRight: "0" }}
          >
            <div className="owenear-page-alignment" style={{ border: "none" }}>
              <div className="page-title-alignment">
                <p>Owner accounts</p>
                {/* {permission?.filter(
                  (obj) => obj.name === "Settings functions edit"
                )?.[0]?.isChecked === false ? null : ( */}
                <span
                  onClick={(e) => handleAddNewOwnerOperator(e, "Owner")}
                  style={{ cursor: "pointer" }}
                >
                  + Add new
                </span>
                {/* )} */}
              </div>
              <div className="owenear-title-grid">
                <div className="owenear-title-grid-items">
                  <div className="same-text-style">
                    <p>Name</p>
                  </div>
                </div>
                <div className="owenear-title-grid-items">
                  <div className="same-text-style">
                    <p>Primary account id</p>
                  </div>
                </div>
              </div>
              <div className="role-permission-height-fixed">
             
                {companyOwnersAccounts?.map((owner,index) => {
                  return (
                    <div className="owenear-child-grid">
                      <div className="owenear-child-grid-items">
                        <div className={owner?.isActive ? "same-text-style": "same-text-style-gray"}>
                          <p>{owner.Name}</p>
                        </div>
                      </div>
                      <div className="owenear-child-grid-items">
                        <div className={owner?.isActive ? "same-text-style": "same-text-style-gray"}>
                          <p>{owner.mobileNumber}</p>
                        </div>
                      </div>
                      {userInfo.role === "Operator" ||
                      userInfo?.role === "Staff"  || userInfo.mobileNumber === owner?.mobileNumber ? null : (
                        <>
                          <div
                            className="hover-three-dot-blue-role"
                            style={{
                              cursor: "pointer",
                              position: "relative",
                            }}
                          >
                            <svg
                              width="30"
                              height="20"
                              viewBox="0 0 30 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={(e) => optionsToggle(index)}
                            >
                              <rect width="30" height="20" fill="white" />
                              <circle cx="15" cy="10" r="2" fill="#97A7C3" />
                              <circle cx="6" cy="10" r="2" fill="#97A7C3" />
                              <circle cx="24" cy="10" r="2" fill="#97A7C3" />
                            </svg>
                            {optionsShow && targetIndex === index && (
                              <OutsideAlerter toggle={optionsToggle}>
                                <div className="roles-options-container ">
                                {owner?.isActive && <>
                                
                                  <span className="attendance-options-danger attendance-options-danger-clock" onClick={()=>AccountDeactive(owner,"Deactivate")}>
                                    <svg
                                      width="16"
                                      height="14"
                                      viewBox="0 0 16 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10.6667 13V11.6667C10.6667 10.9594 10.3858 10.2811 9.8857 9.78105C9.3856 9.28095 8.70732 9 8.00008 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M12.0001 4.33333L15.3334 7.66667M15.3334 4.33333L12.0001 7.66667M8.33341 3.66667C8.33341 5.13943 7.13951 6.33333 5.66675 6.33333C4.19399 6.33333 3.00008 5.13943 3.00008 3.66667C3.00008 2.19391 4.19399 1 5.66675 1C7.13951 1 8.33341 2.19391 8.33341 3.66667Z"
                                        stroke="#E66666"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                    Deactivate account
                                  </span>
                                  </>}
                                  {!owner?.isActive && <span className="attendance-options-edit-clock-green" onClick={()=>AccountDeactive(owner,"Activate")}>
                                  <svg
                                      width="16"
                                      height="14"
                                      viewBox="0 0 16 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10.6667 13V11.6667C10.6667 10.9594 10.3858 10.2811 9.8857 9.78105C9.3856 9.28095 8.70732 9 8.00008 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M12.0001 4.33333L15.3334 7.66667M15.3334 4.33333L12.0001 7.66667M8.33341 3.66667C8.33341 5.13943 7.13951 6.33333 5.66675 6.33333C4.19399 6.33333 3.00008 5.13943 3.00008 3.66667C3.00008 2.19391 4.19399 1 5.66675 1C7.13951 1 8.33341 2.19391 8.33341 3.66667Z"
                                        stroke="#338333"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                    Activate account
                                  </span>}
                                </div>
                              </OutsideAlerter>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {role === "Operator" && (
          <div
            className="setting-sub-grid-items"
            style={{ border: "none", paddingRight: "0" }}
          >
            <div
              className="owenear-page-alignment"
              style={{ border: "none" }}
            >
              <div className="page-title-alignment">
                <p>Operator accounts</p>
                {/* {permission?.filter(
                  (obj) => obj.name === "Settings functions edit"
                )?.[0]?.isChecked === false ? null : ( */}
                <span
                  onClick={(e) => handleAddNewOwnerOperator(e, "Owner")}
                  style={{ cursor: "pointer" }}
                >
                  + Add new
                </span>
                {/* )} */}
              </div>
              <div className="operator-accounts-title-grid">
                <div className="operator-accounts-title-grid-items">
                  <div className="same-text-style">
                    <p>Name</p>
                  </div>
                </div>
                <div className="operator-accounts-title-grid-items">
                  <div className="same-text-style">
                    <p>Primary account id</p>
                  </div>
                </div>
              </div>
              <div className="role-permission-height-fixed">
                {companyOperatorsAccounts?.map((operator, index) => {
                  return (
                    <div className="operator-accounts-grid">
                      <div className="operator-accounts-grid-items">
                        <div className={operator?.isActive ? "same-text-style": "same-text-style-gray"}>
                          <p>{operator.Name}</p>
                        </div>
                      </div>
                      <div className="operator-accounts-grid-items">
                        <div className={operator?.isActive ? "same-text-style":"same-text-style-gray"}>
                          <p>{operator.mobileNumber}</p>
                        </div>
                      </div>
                      {userInfo.role === "Operator" ||
                      userInfo?.role === "Staff" ? null : (
                        <>
                          <div
                            className="hover-three-dot-blue-role"
                            style={{
                              cursor: "pointer",
                              position: "relative",
                            }}
                          >
                            <svg
                              width="30"
                              height="20"
                              viewBox="0 0 30 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={(e) => optionsToggle(index)}
                            >
                              <rect width="30" height="20" fill="white" />
                              <circle cx="15" cy="10" r="2" fill="#97A7C3" />
                              <circle cx="6" cy="10" r="2" fill="#97A7C3" />
                              <circle cx="24" cy="10" r="2" fill="#97A7C3" />
                            </svg>
                            {optionsShow && targetIndex === index && (
                              <OutsideAlerter toggle={optionsToggle}>
                                <div className="roles-options-container ">
                                {operator?.isActive && <><span
                                    className="attendance-options-edit-clock"
                                    onClick={(e) =>
                                      handleEditOperatorStaffPermissionToggle(
                                        e,
                                        "open",
                                        operator._id
                                      )
                                    }
                                  >
                                    <svg
                                      width="16"
                                      height="14"
                                      viewBox="0 0 17 17"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.79159 2.83325H2.83329C2.45756 2.83325 2.09723 2.98251 1.83156 3.24818C1.56588 3.51386 1.41663 3.87419 1.41663 4.24992V14.1666C1.41663 14.5423 1.56588 14.9026 1.83156 15.1683C2.09723 15.434 2.45756 15.5832 2.83329 15.5832H12.7499C13.1256 15.5832 13.486 15.434 13.7516 15.1683C14.0173 14.9026 14.1666 14.5423 14.1666 14.1666V9.20824"
                                        stroke="#1479FF"
                                        stroke-width="1.3"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M13.1042 1.77091C13.386 1.48912 13.7682 1.33081 14.1667 1.33081C14.5652 1.33081 14.9474 1.48912 15.2292 1.77091C15.511 2.05271 15.6693 2.4349 15.6693 2.83341C15.6693 3.23193 15.511 3.61412 15.2292 3.89591L8.49998 10.6251L5.66663 11.3334L6.37496 8.50008L13.1042 1.77091Z"
                                        stroke="#1479FF"
                                        stroke-width="1.3"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                    Edit permissions
                                  </span>
                                  <span className="attendance-options-danger attendance-options-danger-clock" onClick={()=>AccountDeactive(operator,"Deactivate")}>
                                    <svg
                                      width="16"
                                      height="14"
                                      viewBox="0 0 16 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10.6667 13V11.6667C10.6667 10.9594 10.3858 10.2811 9.8857 9.78105C9.3856 9.28095 8.70732 9 8.00008 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M12.0001 4.33333L15.3334 7.66667M15.3334 4.33333L12.0001 7.66667M8.33341 3.66667C8.33341 5.13943 7.13951 6.33333 5.66675 6.33333C4.19399 6.33333 3.00008 5.13943 3.00008 3.66667C3.00008 2.19391 4.19399 1 5.66675 1C7.13951 1 8.33341 2.19391 8.33341 3.66667Z"
                                        stroke="#E66666"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                    Deactivate account
                                  </span>
                                  </>}
                                  {!operator?.isActive && <span className="attendance-options-edit-clock-green" onClick={()=>AccountDeactive(operator,"Activate")}>
                                  <svg
                                      width="16"
                                      height="14"
                                      viewBox="0 0 16 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10.6667 13V11.6667C10.6667 10.9594 10.3858 10.2811 9.8857 9.78105C9.3856 9.28095 8.70732 9 8.00008 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M12.0001 4.33333L15.3334 7.66667M15.3334 4.33333L12.0001 7.66667M8.33341 3.66667C8.33341 5.13943 7.13951 6.33333 5.66675 6.33333C4.19399 6.33333 3.00008 5.13943 3.00008 3.66667C3.00008 2.19391 4.19399 1 5.66675 1C7.13951 1 8.33341 2.19391 8.33341 3.66667Z"
                                        stroke="#338333"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                    Activate account
                                  </span>}
                                </div>
                              </OutsideAlerter>
                            )}
                          </div>
                        </>
                      )}
                     
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {role === "Staff" && (
          <div className="setting-sub-grid-items" style={{ border: "none" , paddingRight: "0"}}>
            {/* <div
              className="setting-sub-grid-items"
              style={{ border: "none", paddingRight: "0" }}
            > */}
              <div className="owenear-page-alignment">
                <div className="page-title-alignment">
                  <p>Staff accounts</p>
                </div>
                <div className="operator-accounts-title-grid">
                  <div className="operator-accounts-title-grid-items">
                    <div className="same-text-style">
                      <p>Name</p>
                    </div>
                  </div>
                  <div className="operator-accounts-title-grid-items">
                    <div className="same-text-style">
                      <p>Primary account id</p>
                    </div>
                  </div>
                </div>
                <div className="role-permission-height-fixed">
                  {allStaff?.map((staff) => {
                    return (
                      <div
                        className="operator-accounts-grid"
                        // id={staff._id}
                        // style={{ cursor: "pointer" }}
                        // onClick={(e) => handleEditOperatorStaffPermissionToggle(e, "open")}
                      >
                        <div className="operator-accounts-grid-items">
                          <div className="same-text-style">
                            <p>{staff.firstName}</p>
                          </div>
                        </div>
                        <div className="operator-accounts-grid-items">
                          <div className="same-text-style">
                            <p>{staff.mobileNumber}</p>
                          </div>
                        </div>
                        {/* {permission?.filter(
                        (obj) => obj.name === "Settings functions edit"
                      )?.[0]?.isChecked === false ? null : ( */}
                        {userInfo?.role === "Staff" ? null : (
                          <div
                            id={staff._id}
                            className="operator-accounts-grid-items"
                            onClick={(e) =>
                              handleEditOperatorStaffPermissionToggle(
                                e,
                                "open",
                                staff._id
                              )
                            }
                          >
                            <svg
                              onClick={(e) =>
                                handleEditOperatorStaffPermissionToggle(
                                  e,
                                  "open",
                                  staff._id
                                )
                              }
                              id={staff._id}
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                onClick={(e) =>
                                  handleEditOperatorStaffPermissionToggle(
                                    e,
                                    "open",
                                    staff._id
                                  )
                                }
                                id={staff._id}
                                d="M7.79159 2.83325H2.83329C2.45756 2.83325 2.09723 2.98251 1.83156 3.24818C1.56588 3.51386 1.41663 3.87419 1.41663 4.24992V14.1666C1.41663 14.5423 1.56588 14.9026 1.83156 15.1683C2.09723 15.434 2.45756 15.5832 2.83329 15.5832H12.7499C13.1256 15.5832 13.486 15.434 13.7516 15.1683C14.0173 14.9026 14.1666 14.5423 14.1666 14.1666V9.20824"
                                stroke="#1479FF"
                                stroke-width="1.3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                onClick={(e) =>
                                  handleEditOperatorStaffPermissionToggle(
                                    e,
                                    "open",
                                    staff._id
                                  )
                                }
                                id={staff._id}
                                d="M13.1042 1.77091C13.386 1.48912 13.7682 1.33081 14.1667 1.33081C14.5652 1.33081 14.9474 1.48912 15.2292 1.77091C15.511 2.05271 15.6693 2.4349 15.6693 2.83341C15.6693 3.23193 15.511 3.61412 15.2292 3.89591L8.49998 10.6251L5.66663 11.3334L6.37496 8.50008L13.1042 1.77091Z"
                                stroke="#1479FF"
                                stroke-width="1.3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                        {/* )} */}
                      </div>
                    );
                  })}
                </div>
              </div>
            {/* </div> */}
          </div>
        )}
      </div>
      {editPermissionModal && (
        <EditPermissionModal
          modal={editPermissionModal}
          toggle={editPermissionToggle}
          permissionsList={permissionsList}
          permissionListExample={permissionListExample}
          onChangeHandler={onChangeHandler}
          operatorPermissions={operatorPermissions}
          staffPermissions={staffPermissions}
          operatorPermissionNames={operatorPermissionNames}
          staffPermissionNames={staffPermissionNames}
          operatorPermissionsId={operatorPermissionsId}
          staffPermissionsId={staffPermissionsId}
        />
      )}
      {editOperatorStaffPermissionModal && (
        <EditOperatorStaffPermissionModal
          modal={editOperatorStaffPermissionModal}
          toggle={editOperatorStaffPermissionToggle}
          permissionsList={permissionsList}
          permissionListExample={permissionListExample}
          // onChangeHandler={onChangeHandler}
          temEditId={temEditId}
          setTemEditId={setTemEditId}
          role={role}
          page={page}
          setPage={setPage}
          operatorPermissions={operatorPermissions}
          staffPermissions={staffPermissions}
          temEditPermissions={temEditPermissions}
          setTemEditPermissions={setTemEditPermissions}
          staffPermissionNames={staffPermissionNames}
          operatorPermissionNames={operatorPermissionNames}
          operatorData={operatorData}
          setOperatorData={setOperatorData}
        />
      )}
      {rolesAndPermissionModal && (
        <RolesAndPermissionModal
          modal={rolesAndPermissionModal}
          toggle={rolesAndPermissionToggle}
          firstTimeSetup={firstTimeSetup}
          setFirstTimeSetup={setFirstTimeSetup}
          companyOperatorsAccounts={companyOperatorsAccounts}
          companyOwnersAccounts={companyOwnersAccounts}
          setCompanyOperatorsAccounts={setCompanyOperatorsAccounts}
          setCompanyOwnersAccounts={setCompanyOwnersAccounts}
          role={role}
          page={page}
          setPage={setPage}
          setKey={setKey}
          allStaff={allStaff}
          getAllStaff={getAllStaff}
        />
      )}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
      {askModal && <DeleteAccount toggle={AccountDeactive} account={account} type={type}/>}
    </div>
  );
}
