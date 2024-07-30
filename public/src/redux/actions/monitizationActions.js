export const settrialDays = (days) => {
    return{
      type: 'SET_TRIAL_DAY',
      payload: days
      // true or false
    }
  }
export const gettrialDays = () => {
    return{
      type: 'GET_TRIAL_DAY'
    }
 }

export const getfirstReminderDate = () => {
    return{
      type: 'GET_FIRST_DAY'
    }
  }
  export const setfirstReminderDate = (date) => {
    return{
      type: 'SET_FIRST_DAY',
      payload: date
      // true or false
    }
  }
  

export const getsecondReminderDate = () => {
    return{
      type: 'GET_SECOND_DAY'
    }
  }
  export const setsecondReminderDate = (date) => {
    return{
      type: 'SET_SECOND_DAY',
      payload: date
      // true or false
    }
  }
  

export const getthirdReminderDate = () => {
    return{
      type: 'GET_THIRD_DAY'
    }
  }
  export const setthirdReminderDate = (date) => {
    return{
      type: 'SET_THIRD_DAY',
      payload: date
      // true or false
    }
  }
  

