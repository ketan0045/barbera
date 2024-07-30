export const setattendanceDate = (date) => {
    return{
      type: 'SET_ATTENDANCE_DATE',
      payload: date
      // true or false
    }
  }
  

export const getattendanceDate = () => {
    return{
      type: 'GET_ATTENDANCE_DATE'
    }
  }

  export const setattendanceMarkDate = (date) => {
    return{
      type: 'SET_ATTENDANCE_MARKDATE',
      payload: date
      // true or false
    }
  }
  

export const getattendanceMarkDate = () => {
    return{
      type: 'GET_ATTENDANCE_MARKDATE'
    }
  }