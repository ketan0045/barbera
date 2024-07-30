export const onboardingStatusReducer = (state = false, action) => {
  switch (action.type) {
    case "GET_ONBOARDING_STATUS":
      return state;
    case "SET_ONBOARDING_STATUS":
      return (state = action.payload);
    default:
      return state;
  }
};

export const onboardingTooltipStatus = (state = false, action) => {
  switch (action.type) {
    case "GET_ONBOARDING_TOOLTIP_STATUS":
      return state;
    case "SET_ONBOARDING_TOOLTIP_STATUS":
      return (state = action.payload);
    default:
      return state;
  }
};

export const onboardingTourStatus = (state = false, action) => {
  switch (action.type) {
    case "GET_ONBOARDING_TOUR_STATUS":
      return state;
    case "SET_ONBOARDING_TOUR_STATUS":
      return (state = action.payload);
    default:
      return state;
  }
};

export const onboardingTourProgress = (state = 0, action) => {
  switch (action.type) {
    case "GET_ONBOARDING_TOUR_PROGRESS":
      return state;
    case "SET_ONBOARDING_TOUR_PROGRESS":
      return (state = action.payload);
    default:
      return state;
  }
};

export const onboardingCurrentTooltip = (state = '', action) => {
  switch (action.type) {
    case "GET_ONBOARDING_CURRENT_TOOLTIP":
      return state;
    case "SET_ONBOARDING_CURRENT_TOOLTIP":
      return (state = action.payload);
    default:
      return state;
  }
};
