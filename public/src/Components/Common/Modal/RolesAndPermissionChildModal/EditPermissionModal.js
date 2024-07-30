import React, { useEffect, useState } from "react";
import "./../Modal.scss";
import CloseIcon from "../../../../assets/svg/close-icon.svg";
import { useDispatch } from "react-redux";
import {
  setOperatorPermissions,
  setStaffPermissions,
} from "../../../../redux/actions/permissionsActions";
import { ApiPut, ApiPost } from "../../../../helpers/API/ApiData";
import Auth from "../../../../helpers/Auth";
import Success from "../../Toaster/Success/Success";

export default function EditPermissionModal(props) {
  const {
    permissionsList,
    toggle,
    onChangeHandler,
    staffPermissionsId,
    operatorPermissionsId,
    staffPermissionNames,
    operatorPermissionNames,
    staffPermissions,
    operatorPermissions,
  } = props;

  const dispatch = useDispatch();
  const userInfo = Auth.getUserDetail();
  const [success, setSuccess] = useState(false);
  const [er, setEr] = useState();
  const [toastmsg, setToastmsg] = useState();

  const handleSavePermissions = async () => {
    let updatedStaffPermissions = await staffPermissions.map((per) => {
      return staffPermissionNames.includes(per.name)
        ? { ...per, isChecked: true }
        : { ...per, isChecked: false };
    });
    let updatedOperatorPermissions = await operatorPermissions.map((per) => {
      return operatorPermissionNames.includes(per.name)
        ? { ...per, isChecked: true }
        : { ...per, isChecked: false };
    });
    let updateAllStaffPermissions = {
      type: "Staff",
      companyId: userInfo.companyId,
      permission: updatedStaffPermissions,
    };
    let updateAllOperatorPermissions = {
      type: "Operator",
      companyId: userInfo.companyId,
      permission: updatedOperatorPermissions,
    };

    // console.log("updatedStaffPermissions",updatedStaffPermissions)
    // console.log("updatedOperatorPermissions",updatedOperatorPermissions)
    // console.log("updateAllStaffPermissions",updateAllStaffPermissions)
    // console.log("updateAllOperatorPermissions",updateAllOperatorPermissions)

    dispatch(setStaffPermissions(updatedStaffPermissions));
    dispatch(setOperatorPermissions(updatedOperatorPermissions));
    try {
      let staffRes = await ApiPut(`permission/${staffPermissionsId}`, {
        permissionMenu: updatedStaffPermissions,
      });
      let operatorRes = await ApiPut(`permission/${operatorPermissionsId}`, {
        permissionMenu: updatedOperatorPermissions,
      });
      let allStaffRes = await ApiPost(
        `permission/edit/company`,
        updateAllStaffPermissions
      );
      let allOperatorRes = await ApiPost(
        `permission/edit/company`,
        updateAllOperatorPermissions
      );
      if (
        operatorRes.data.status === 200 &&
        staffRes.data.status === 200 &&
        allStaffRes.data.status === 200 &&
        allOperatorRes.data.status === 200
      ) {
        toggle(200);
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
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <div>
      {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
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
                  <h2>Roles & permissions</h2>
                </div>
              </div>
              <div className="role-permission-save-button">
                <button onClick={(e) => handleSavePermissions(e)}>Save</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            <div className="modal-body-top-align">
              <div className="reole-permissions-modal-center-alignment">
                <div>
                  {permissionsList.map((permissions) => {
                    return (
                      <div
                        key={permissions._id}
                        className="reole-permissions-modal-box"
                      >
                        <div className="roles-header-grid">
                          <div className="roles-header-grid-items">
                            <p>{permissions.category}</p>
                          </div>
                          <div className="roles-header-grid-items">
                            <div className="roles-header-sub-grid">
                              <div className="roles-header-sub-grid-items">
                                <p>Staff</p>
                              </div>
                              <div className="roles-header-sub-grid-items">
                                <p>Operator</p>
                              </div>
                              <div className="roles-header-sub-grid-items">
                                <p>Owner</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {permissions.services.map((permissionsItem) => {
                          return (
                            <div
                              key={permissionsItem._id}
                              className="roles-body-grid"
                            >
                              <div className="roles-body-grid-items">
                                <p>{permissionsItem.name}</p>
                              </div>
                              <div className="roles-body-grid-items">
                                <div className="roles-body-child-grid">
                                  <div className="roles-body-child-grid-items">
                                    <div>
                                      <input
                                        type="checkbox"
                                        name="staff_permissionList"
                                        value={permissionsItem.name}
                                        checked={
                                          staffPermissionNames.includes(
                                            permissionsItem.name
                                          )
                                            ? true
                                            : false
                                        }
                                        onChange={onChangeHandler}
                                      />
                                    </div>
                                  </div>
                                  <div className="roles-body-child-grid-items">
                                    <div>
                                      <input
                                        type="checkbox"
                                        name="operator_permissionList"
                                        value={permissionsItem.name}
                                        disabled={userInfo.role === "Operator"}
                                        checked={
                                          operatorPermissionNames.includes(
                                            permissionsItem.name
                                          )
                                            ? true
                                            : false
                                        }
                                        onChange={onChangeHandler}
                                      />
                                    </div>
                                  </div>
                                  <div className="roles-body-child-grid-items">
                                    <div style={{ opacity: 0.5 }}>
                                      <input type="checkbox" checked />
                                    </div>
                                  </div>
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
    </div>
  );
}
