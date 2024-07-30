export const getUserInfoRed = () => {
  return {
    type: "GET_USER_INFO",
  };
};

export const setUserInfoRed = (userInfo) => {
  return {
    type: "SET_USER_INFO",
    payload: userInfo,
  };
};

export const getUserPermissions = () => {
  return {
    type: "GET_USER_PERMISSIONS",
  };
};

export const setUserPermissions = (permissionNamesArray) => {
  return {
    type: "SET_USER_PERMISSIONS",
    payload: permissionNamesArray,
  };
};
