import React, { useEffect, useState } from "react";
import "./../Modal.scss";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import RolesAndPermissionModal from "../RolesAndPermissionModal";
import { ApiGet, ApiPut } from "../../../../helpers/API/ApiData";
import Success from "../../Toaster/Success/Success";

export default function EditOperatorStaffPermissionModal(props) {
  const {
    permissionsList,
    permissionListExample,
    toggle,
    temEditId,
    setTemEditId,
    role,
    // onChangeHandler,
    staffPermissionNames,
    operatorPermissionNames,
    operatorPermissions,
    staffPermissions,
    temEditPermissions,
    setTemEditPermissions,
    operatorData,
    setOperatorData,
    page,
    setPage,
  } = props;

  const [rolesAndPermissionModal, setRolesAndPermissionModal] = useState(false);
  const [temEditPermissionNames, setTemEditPermissionNames] = useState([]);
  const [didOperatorUpdate, setDidOperatorUpdate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();
  const rolesAndPermissionToggle = () =>
    setRolesAndPermissionModal(!rolesAndPermissionModal);

  const generateTemEditPermissionNames = async () => {
    // console.log("temEditPermissions", temEditPermissions);
    let temPermissions = await temEditPermissions
      .filter((per) => {
        return per.isChecked && per;
      })
      .map((per) => per.name);
    setTemEditPermissionNames(temPermissions);
  };

  const handleOnChange = (e) => {
    if (e.target.checked) {
      temEditPermissionNames.push(e.target.value);
    } else {
      let index = temEditPermissionNames.indexOf(e.target.value);
      temEditPermissionNames.splice(index, 1);
    }
    setTemEditPermissionNames([...temEditPermissionNames]);
  };
  // console.log("temEditPermissionNames", temEditPermissionNames);
  // console.log("temEditPermissions",temEditPermissions);
  // console.log("Id", temEditId);
  const handleOnSave = async (e) => {
    // console.log("temEditPermissions",temEditPermissions);
    // console.table("updatedTemEditPermissions", temEditPermissions);
    try {
      let singleStaffRes =
        role === "Staff"
          ? await ApiPut(`staff/${temEditId}`, {
              permission: temEditPermissions,
            })
          : await ApiPut(`account/${temEditId}`, {
              permission: temEditPermissions,
            });
      if (singleStaffRes.data.status === 200) {
        toggle(singleStaffRes);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      setSuccess(true);
      setEr("Error");
      setToastmsg("Something Went Wrong!");
    }
  };
  
  useEffect(() => {
    if (didOperatorUpdate) {
      ApiGet("account/" + operatorData._id)
        .then((res) => {
          setOperatorData(res.data.data[0]);
        })
        .catch((err) => console.log(err));
    }
  }, [didOperatorUpdate]);

  useEffect(() => {
    // console.log("temEditPermissions", temEditPermissions);
    generateTemEditPermissionNames();
    return () => {
      setTemEditId("");
      setTemEditPermissions([]);
      setTemEditPermissionNames([]);
    };
  }, []);
  useEffect(() => {
    let updatedTemEditPermissions = temEditPermissions?.map((per) => {
      return temEditPermissionNames?.includes(per.name)
        ? { ...per, isChecked: true }
        : { ...per, isChecked: false };
    });
    setTemEditPermissions(updatedTemEditPermissions);
  }, [temEditPermissionNames]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <div>
      <div className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment role-permission-header-alignment">
              <div className="modal-heading-title">
                <div onClick={() => toggle()} className="modal-close">
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  <h2>Roles & permissions - {role}</h2>
                </div>
              </div>
              <div className="role-permission-save-button">
                <button onClick={(e) => handleOnSave(e)}>Save</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="roles-permissions-operator-center-alignment">
                <div>
                  {role === "Operator" && (
                    <div className="roles-permissions-operator-first">
                      <div>
                        <p>Operator - {operatorData?.Name}</p>
                        <span onClick={rolesAndPermissionToggle}>
                          Account edit
                        </span>
                      </div>
                    </div>
                  )}
                  {/* 
                  {permissionListExample.map((permissions) => {
                    return (
                      <div
                        key={permissions._id}
                        className="roles-permissions-operator-repeat"
                      >
                        <div className="permissions-operator-header">
                          <div className="permissions-operator-header-items">
                            <p>{permissions[0]}</p>
                          </div>
                          <div className="permissions-operator-header-items">
                            <p>{role}</p>
                          </div>
                        </div>
                        {permissions[1].map((permissionsItem) => {
                          return (
                            <div
                              key={permissionsItem._id}
                              className="permissions-operator-body"
                            >
                              <div className="permissions-operator-body-items">
                                <p>{permissionsItem}</p>
                              </div>
                              <div className="permissions-operator-body-items">
                                <div>
                                  {role === "Staff" ? (
                                    <input
                                      type="checkbox"
                                      name="staff_permissionList"
                                      value={permissionsItem}
                                      checked={
                                        staffPermissionNames?.includes(
                                          permissionsItem
                                        )
                                          ? true
                                          : false
                                      }
                                      // onChange={onChangeHandler}
                                    />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      name="operator_permissionList"
                                      value={permissionsItem}
                                      checked={
                                        operatorPermissionNames?.includes(
                                          permissionsItem
                                        )
                                          ? true
                                          : false
                                      }
                                      // onChange={onChangeHandler}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })} */}
                  {/* <------------------------new---------------------> */}
                  {permissionsList.map((permissions) => {
                    return (
                      <div
                        key={permissions._id}
                        className="roles-permissions-operator-repeat"
                      >
                        <div className="permissions-operator-header">
                          <div className="permissions-operator-header-items">
                            <p>{permissions.category}</p>
                          </div>
                          <div className="permissions-operator-header-items">
                            <p>{role}</p>
                          </div>
                        </div>
                        {permissions.services.map((permissionsItem) => {
                          return (
                            <div
                              key={permissionsItem._id}
                              className="permissions-operator-body"
                            >
                              <div className="permissions-operator-body-items">
                                <p>{permissionsItem.name}</p>
                              </div>
                              <div className="permissions-operator-body-items">
                                <div>
                                  <input
                                    type="checkbox"
                                    value={permissionsItem.name}
                                    checked={
                                      temEditPermissionNames.includes(
                                        permissionsItem.name
                                      )
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => handleOnChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {rolesAndPermissionModal && (
        <RolesAndPermissionModal
          modal={rolesAndPermissionModal}
          toggle={rolesAndPermissionToggle}
          role={"EditOperator"}
          page={page}
          setPage={setPage}
          setDidOperatorUpdate={setDidOperatorUpdate}
          operatorData={operatorData}
        />
      )}
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
    </div>
  );
}
