export const attendanceDate = (state = false, action) => {
    switch (action.type) {
      case "GET_ATTENDANCE_DATE":
        return state;
      case "SET_ATTENDANCE_DATE":
        return (state = action.payload);
      default:
        return state;
    }
  };

  export const attendanceMarkDate = (state = false, action) => {
    switch (action.type) {
      case "GET_ATTENDANCE_MARKDATE":
        return state;
      case "SET_ATTENDANCE_MARKDATE":
        return (state = action.payload);
      default:
        return state;
    }
  };