
export const userInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_INFO":
      return state;
    case "SET_USER_INFO":
      return (state = action.payload);
    default:
      return state;
  }
};

export const currentUserPermissionsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_USER_PERMISSIONS":
      return state;
    case "SET_USER_PERMISSIONS":
      return (state = action.payload);
    default:
      return state;
  }
};