export const getOnboardingStatus = () => {
  return{
    type: 'GET_ONBOARDING_STATUS'
  }
}

export const setOnboardingStatus = (onboardingStatus) => {
  return{
    type: 'SET_ONBOARDING_STATUS',
    payload: onboardingStatus
    // true or false
  }
}

export const getOnboardingTooltipStatus = () => {
  return{
    type: 'GET_ONBOARDING_TOOLTIP_STATUS'
  }
}

export const setOnboardingTooltipStatus = (tooltipStatus) => {
  return{
    type: 'SET_ONBOARDING_TOOLTIP_STATUS',
    payload: tooltipStatus
    // true  or false
  }
}

export const getOnboardingTourStatus = () => {
  return{
    type: 'GET_ONBOARDING_TOUR_STATUS'
  }
}

export const setOnboardingTourStatus = (tourStatus) => {
  return{
    type: 'SET_ONBOARDING_TOUR_STATUS',
    payload: tourStatus
    // true  or false
  }
}

export const getOnboardingTourProgress = () => {
  return{
    type: 'GET_ONBOARDING_TOUR_PROGRESS'
  }
}

export const setOnboardingTourProgress = (tourProgress) => {
  return{
    type: 'SET_ONBOARDING_TOUR_PROGRESS',
    payload: tourProgress
    // in percentage
  }
}

export const getOnboardingCurrentTooltip = () => {
  return{
    type: 'GET_ONBOARDING_CURRENT_TOOLTIP'
  }
}

export const setOnboardingCurrentTooltip = (currentTooltip) => {
  return{
    type: 'SET_ONBOARDING_CURRENT_TOOLTIP',
    payload: currentTooltip
    // name of current tooltip
  }
}

