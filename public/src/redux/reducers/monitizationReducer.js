export const trialDays = (state = 6, action) => {
    switch (action.type) {
      case "GET_TRIAL_DAY":
        return state;
      case "SET_TRIAL_DAY":
        return (state = action.payload);
      default:
        return state;
    }
  };
  export const firstReminderDate = (state = null , action) => {
    switch (action.type) {
      case "GET_FIRST_DAY":
        return state;
      case "SET_FIRST_DAY":
        return (state = action.payload);
      default:
        return state;
    }
  };
  export const secondReminderDate = (state  = null, action) => {
    switch (action.type) {
      case "GET_SECOND_DAY":
        return state;
      case "SET_SECOND_DAY":
        return (state = action.payload);
      default:
        return state;
    }
  };
  export const thirdReminderDate = (state  = null, action) => {
    switch (action.type) {
      case "GET_THIRD_DAY":
        return state;
      case "SET_THIRD_DAY":
        return (state = action.payload);
      default:
        return state;
    }
  };
