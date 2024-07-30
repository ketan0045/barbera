import "./App.css";
import "./Components/style/style.scss";
import "../src/Components/style/tailwind.scss";
import Routes from "./Routes";
import "react-multi-carousel/lib/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import UserContext from "./helpers/Context";
import { ApiGet } from "./helpers/API/ApiData";
import Auth from "./helpers/Auth";
import { get_Setting } from "./utils/user.util";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  setOnboardingCurrentTooltip,
  setOnboardingStatus,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "./redux/actions/onboardingActions";
import { setattendanceDate, setattendanceMarkDate } from "./redux/actions/attendanceActions";
import { gettrialDays, setfirstReminderDate, setsecondReminderDate, setthirdReminderDate, settrialDays } from "./redux/actions/monitizationActions";

function App() {
  const dispatch = useDispatch();
  const userInfo = Auth.getUserDetail();
  const currentUserRole = userInfo?.role;
  const [isDisable, setIsDisable] = useState(false);
  const [isBarcode, setIsBarcode] = useState(true);
  const [isMembership, setIsMembership] = useState(true);
  const [isProductType, setIsProductType] = useState("Store Consumable & Retail");
  const [isMembershipType, setIsMembershipType] = useState("");
  const [applyMembershipBenefit, setApplyMembershipBenefit] = useState("Same invoice");

  const getOnboardingData = async (res) => {
    await ApiGet("setting/company/" + res)
      .then(async (res) => {
        if (res?.data?.status === 200) {
          if(res?.data?.data[0]?.secondReminderDate){
            dispatch(setsecondReminderDate(res?.data?.data[0]?.secondReminderDate))
          }else{
            dispatch(setsecondReminderDate(new Date()))
          }
          if(res?.data?.data[0]?.firstReminderDate){
            dispatch(setfirstReminderDate(res?.data?.data[0]?.firstReminderDate))
          }else{
            dispatch(setfirstReminderDate(new Date()))
          }
          if(res?.data?.data[0]?.thirdReminderDate){
            dispatch(setthirdReminderDate(res?.data?.data[0]?.thirdReminderDate))
          }else{
            dispatch(setthirdReminderDate(new Date()))
          }
          if(res?.data?.data[0]?.attendanceDate){
            dispatch(setattendanceDate(res?.data?.data[0]?.attendanceDate))
          }
          if(res?.data?.data[0]?.attendanceMarkDate){
            dispatch(setattendanceMarkDate(res?.data?.data[0]?.attendanceMarkDate))
          }
          if (res?.data?.data[0]?.onboardProcess?.length > 0) {
            let onboardingData = res?.data?.data[0]?.onboardProcess[0];
            dispatch(setOnboardingStatus(onboardingData?.onboardingStatus));
            dispatch(setOnboardingTourStatus(false));
            dispatch(setOnboardingTooltipStatus(false));
            dispatch(setOnboardingCurrentTooltip(""));
            if (onboardingData?.onboardingTourProgress <= 66 && onboardingData?.onboardingProfileUpdated === true) {
              dispatch(setOnboardingTourProgress(66));
            } {
              dispatch(setOnboardingTourProgress(onboardingData?.onboardingTourProgress));
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getSetting = async () => {
    const SettingData = get_Setting();
    if (SettingData?.hasOwnProperty("inventory")) {
      setIsDisable(SettingData?.inventory?.enableInventory);
      setIsBarcode(SettingData?.inventory?.enableBarcode);
      setIsProductType(SettingData?.inventory?.productType);
    }
    if (SettingData?.hasOwnProperty("membership")) {
      setIsMembership(SettingData?.membership?.membership);
      setIsMembershipType(SettingData?.membership?.membershipBenefits);
      setApplyMembershipBenefit(
        SettingData?.membership?.applyMembershipBenefits ? "Same invoice" : "Next invoice"
      );
    }
  };

const gettrialDays=async(companyId)=>{
  await ApiGet("monetize/company/remainingDays/" + companyId)
  .then(async (res) => {
    if (res?.data?.status === 200) {
      
      if(!res.data.data.differnce){
        dispatch(settrialDays(0));
      }else{
        dispatch(settrialDays(res.data.data?.differnce));
      }
    }
  })
  .catch((err) => console.log(err));
}

useEffect(async () => {
  getSetting();
  if (userInfo.companyId) {
    getOnboardingData(userInfo.companyId);
    gettrialDays(userInfo.companyId)
  }
}, [userInfo]);

  return (
    <>
      <ToastContainer position="top-center" style={{ fontFamily: "poppins" }} />
      <UserContext.Provider
        value={{
          isDisable,
          setIsDisable,
          isBarcode,
          setIsBarcode,
          isProductType,
          setIsProductType,
          isMembership,
          setIsMembership,
          isMembershipType,
          setIsMembershipType,
          applyMembershipBenefit,
          setApplyMembershipBenefit,
          currentUserRole,
        }}
      >
        <Routes />
      </UserContext.Provider>
    </>
  );
}

export default App;
