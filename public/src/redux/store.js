import { configureStore } from "@reduxjs/toolkit";
import {
  operatorPermissionsIdReducer,
  operatorPermissionsReducer,
  staffPermissionsIdReducer,
  staffPermissionsReducer,
} from "./reducers/permissionsReducer";
import {
  currentUserPermissionsReducer,
  userInfoReducer,
} from "./reducers/userReducer";
import {
  onboardingStatusReducer,
  onboardingTooltipStatus,
  onboardingTourStatus,
  onboardingTourProgress,
  onboardingCurrentTooltip,
} from "./reducers/onboardingReducer";
import {
  selectedDiscountReducer,
  selectedFestivalReducer,
  selectedGreetingReducer,
  selectedMainServiceReducer,
  selectedMethodReducer,
  selectedOfferReducer,
  setEditedServiceReducer,
  visualAidReducer,
} from "./reducers/promoteReducer";
import { attendanceDate, attendanceMarkDate } from "./reducers/attendanceReducer";
import { firstReminderDate,secondReminderDate, thirdReminderDate,trialDays } from "./reducers/monitizationReducer";

const store = configureStore({
  reducer: {
    operatorPermissionsId: operatorPermissionsIdReducer,
    operatorPermissions: operatorPermissionsReducer,
    staffPermissionsId: staffPermissionsIdReducer,
    staffPermissions: staffPermissionsReducer,
    userPermissions: currentUserPermissionsReducer,
    userInfoRed: userInfoReducer,
    
    onboardingStatusRed: onboardingStatusReducer,
    onboardingTooltipStatusRed: onboardingTooltipStatus,
    onboardingTourStatusRed: onboardingTourStatus,
    onboardingTourProgressRed: onboardingTourProgress,
    onboardingCurrentTooltipRed: onboardingCurrentTooltip,

    visualAidReducer: visualAidReducer,
    selectedOfferReducer: selectedOfferReducer,
    selectedMethodReducer: selectedMethodReducer,
    selectedMainServiceReducer : selectedMainServiceReducer,
    selectedGreetingReducer: selectedGreetingReducer,
    selectedDiscountReducer: selectedDiscountReducer,
    selectedFestivalReducer: selectedFestivalReducer,
    attendanceDate: attendanceDate,
    attendanceMarkDate:attendanceMarkDate,
    trialDays:trialDays,
    firstReminderDate:firstReminderDate,
    secondReminderDate:secondReminderDate,
    thirdReminderDate:thirdReminderDate
  },
});

export default store;
