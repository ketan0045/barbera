export const operatorPermissionsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_OPERATOR_PERMISSIONS":
      return state;
    case "SET_OPERATOR_PERMISSIONS":
      return (state = action.payload);
    default:
      return state;
  }
};

export const operatorPermissionsIdReducer = (state = "", action) => {
  switch (action.type) {
    case "GET_OPERATOR_PERMISSIONS_ID":
      return state;
    case "SET_OPERATOR_PERMISSIONS_ID":
      return (state = action.payload);
    default:
      return state;
  }
};

export const staffPermissionsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_STAFF_PERMISSIONS":
      return state;
    case "SET_STAFF_PERMISSIONS":
      return (state = action.payload);
    default:
      return state;
  }
};

export const staffPermissionsIdReducer = (state = "", action) => {
  switch (action.type) {
    case "GET_STAFF_PERMISSIONS_ID":
      return state;
    case "SET_STAFF_PERMISSIONS_ID":
      return (state = action.payload);
    default:
      return state;
  }
};