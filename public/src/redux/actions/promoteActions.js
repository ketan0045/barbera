export const getVisuals = () => {
  return {
    type: "GET_VISUALS",
  };
};

export const setVisuals = (index) => {
  return {
    type: "SET_VISUALS",
    payload: index,
  };
};

export const selectOffer = () => {
  return {
     type: "SELECT_OFFER",
  };
};

export const selectedOffer = (offer) => {
  return {
    type: "SELECTED_OFFER",
    payload: offer,
  };
};

export const selectMethod = () => {
  return {
    type: "SELECT_METHOD",
  };
};

export const selectedMethod = (method) => {
  return {
    type: "SELECTED_METHOD",
    payload: method,
  };
};

export const getSelectedFestival = () => {
  return {
    type: "GET_FESTIVAL",
  }
}

export const setSelectedFestival = (festival) => {
  return {
    type:"SET_FESTIVAL",
    payload: festival
  }
}

export const setServiceName = (selectedService) => {
  return {
    type: "SET_SERVICENAME",
    payload: selectedService
  }
}

export const getSelectedMainService = () => {
  return {
    type: "GET_MAINSERVICE",
  }
}

export const selectedMainService = (mainService) => {
  return {
    type: "SET_MAINSERVICE",
    payload: mainService
  }
}

export const selectedGreetingMethod = (greeting) => {
  return {
    type: "SET_GREETINGNAME",
    payload : greeting,    
  }
}

export const setDiscount = (discount) => {
  return {
    type: "SET_DISCOUNT",
    payload: discount,
  }
}

