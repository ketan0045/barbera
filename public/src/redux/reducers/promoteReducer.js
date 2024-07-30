export const visualAidReducer = (state = 1, action) => {
  switch (action.type) {
    case "GET_VISUALS":
      return state;
    case "SET_VISUALS":
      return (state = action.payload);
    default:
      return state;
  }
};

export const selectedOfferReducer = (state = "", action) => {
  switch (action.type) {
    case "SELECT_OFFER":
      return state;
    case "SELECTED_OFFER":
      return (state = action.payload);
    default:
      return state;
  }
};

export const selectedMethodReducer = (state = "", action) => {
  switch (action.type) {
    case "SELECT_METHOD":
      return state;
    case "SELECTED_METHOD":
      return (state = action.payload);
    default:
      return state;
  }
};

export const selectedFestivalReducer = (state = "", {type, payload}) => {
  switch (type) {
    case "GET_FESTIVAL":
      return state;
    case "SET_FESTIVAL":
      return (state = payload);
    default:
      return state;
  }
};

export const selectedMainServiceReducer = (state = "", action) => {
  switch (action.type) {
    case "GET_MAINSERVICE":
      return state;
    case "SET_MAINSERVICE":
      return (state = action.payload);
    default:
      return state;
  }
};

export const selectedGreetingReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_GREETINGNAME":
      return (state = action.payload);
    default:
      return state;
  }
};

export const selectedDiscountReducer = (state = "", { type, payload }) => {
  switch (type) {
    case "SET_DISCOUNT":
      return (state = payload);
    default:
      return state;
  }
};
