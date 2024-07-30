import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useDebugValue,
} from "react";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import ServiceIcon from "../../../assets/img/ADD-S.png";
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import RightIcon from "../../../assets/svg/right.svg";
import SearchIcon from "../../../assets/svg/search-icon.svg";
import SignleStaff from "../../../assets/svg/single-staff.svg";
import MultiStaff from "../../../assets/svg/multi-staff.svg";
import CloseBtn from "../../../assets/svg/close-btn.svg";
import ProductButton from "../../../assets/img/Products.svg";
import MembershipButton from "../../../assets/img/membership.png";
import OptionSelect from "../OptionSelect/OptionSelect";
import UserAdd from "../../../assets/svg/user-add.svg";
import BackArrowService from "../../../assets/svg/Group.svg"; //select Service
import BackArrowStaff from "../../../assets/svg/Group.svg"; //select staff
import "./Modal.scss";
import "../Modal/OptionSelect.scss";
import Basket from "../../Common/Cart/Basket";
import Main from "../../Common/Cart/Main";
import GSTBreakupModal from "../Modal/GSTBreakupModal";
import AddCustomerModal from "../Modal/AddCustomerModal";
import EditServicesModal from "../Modal/EditServicesModal";
import EditProductModal from "../Modal/EditProductModal";
import DropDownIcon from "../../../../src/assets/svg/drop-down.svg";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { toast } from "react-toastify";
import useRoveFocus from "./UseRoveFocus";
import HandleServiceNavigation from "./HandleServiceNavigation";
import HandleStaffNavigation from "./HandleStaffNavigation";
import HandleCustomerNavigation from "./HandleCustomerNavigation";
import ListItem from "./ListItem";
import Popper from "popper.js";
import PropTypes from "prop-types";
import Success from "../Toaster/Success/Success";
import moment from "moment";
import membershipProfileSmall from "../../../assets/svg/membership-profile-small.svg";
import MemberShip from "../Cart/MemberShip";
import UserContext from "../../../helpers/Context";
import EditMembershipModal from "./EditMembershipModal";
import MembershipBreakupModel from "./MembershipBreakupModal";
import AdditionalNotesModal from "../Modal/AdditionalNotesModal";
import Delete from "../Toaster/Delete";
import AcceptDeny from "../Toaster/AcceptDeny";
import { setDefaultLocale } from "react-datepicker";
import SplitPay from "./SplitPay";
import YellowMembership from "../../../assets/svg/Yellow-Membership.svg";
import SkyBlueMembership from "../../../assets/svg/SkyBlue-Membership.svg";
import OrangeMembership from "../../../assets/svg/Orange-Membership.svg";
import BlueMembership from "../../../assets/svg/BLue-Membership.svg";
import { get_Setting } from "../../../utils/user.util";
import InvoiceProductConsumptionModal from "./InvoiceProductConsumptionModal";
import { useDispatch, useSelector } from "react-redux";
import * as userUtil from "../../../utils/user.util";
import {
  setOnboardingCurrentTooltip,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../../redux/actions/onboardingActions";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

import TrueIcon from "../../../assets/svg/true-icon.svg";
import ClearDuePopUp from "./ClearDuePopUp";
import PreviousDueBreakup from "./PreviousDueBreakup";

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });
  return keyPressed;
};
export default function GenerateNewInvoice(props) {
  const { isMembership } = useContext(UserContext);
  const {
    product,
    serviceDetail,
    modals,
    toggle,
    editInvoice,
    getInvoice,
    invoiceData,
    SettingInfo,
    pastInvoice,
  } = props;
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const [addedServices, setAddedServices] = useState({});
  const [serviceDetails, setServiceDetails] = useState([]);
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [addServices, setAddServices] = useState(true);
  const [selectService, setSelectService] = useState(true);
  const [invoiceDetail, setInvoiceDetail] = useState(true);
  const [customerCompulsion, setCustomerCompulsion] = useState(true);
  const [productDropdown, setProductDropdown] = useState(false);
  const [inventory, setInventoy] = useState(true);
  const [addProduct, setAddProduct] = useState(true);
  const [addMemberShip, setAddMemberShip] = useState(true);
  const [allServices, setAllServices] = useState();
  const [allFrequentServices, setAllFrequentServices] = useState([]);
  const [allNonFrequentServices, setAllNonFrequentServices] = useState([]);
  const [allCompanyServices, setAllCompanyServices] = useState();
  const [allStaff, setAllStaff] = useState();
  const [allCompanyStaff, setAllCompanyStaff] = useState();
  const [allCustomer, setAllCustomer] = useState();
  const [allCompanyCustomer, setAllCompanyCustomer] = useState();
  const [searchKeywrd, setSearchKeywrd] = useState();
  const [subDiscoutMenu, setSubDiscoutMenu] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState();
  const [searchKey, setSearchKey] = useState();
  const [editProductData, setEditProductData] = useState();
  const [editProductDatasss, setEditProductDatasss] = useState();
  const [editServiceData, setEditServiceData] = useState();
  const [availableStaffData, setAvailableStaffData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [memberStaffData, setMemberStaffData] = useState(true);
  const [onMultipleStaff, setOnMultipleStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState([]);
  const [tempSelectedStaff, setTempSelectedStaff] = useState([]);

  const [isFrequentServiceOn, setIsFrequentServiceOn] = useState(
    SettingInfo?.frequentService
  );
  const [showAdditionalNotesModal, setShowAdditionalNotesModal] =
    useState(false);

  const [openWorkRation, setOpenWorkRation] = useState(false);
  const [staffPrice, setStaffPrice] = useState();
  const [hideBackToService, setHideBackToService] = useState(false);

  const [key, setKey] = useState(
    invoiceData
      ? invoiceData?.length + 1
      : editInvoice
      ? editInvoice?.serviceDetails?.length + 1
      : 1
  );
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [newcartItems, setNewcartItems] = useState([]);
  const [gstBreakupModal, setGstBreakupModal] = useState(false);
  const [membershipBreakupModal, setMembershipBreakupModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState();
  const [customer, setCustomer] = useState();
  const [search, setSearch] = useState();
  const [discount, setDiscount] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [editServicesModal, setEditServicesModal] = useState(false);
  const [editMembershipModal, setEditMembershipModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [save, setSave] = useState(false);
  const [smsCheckbox, setSmsCheckbox] = useState(true);
  const [discountprice, setDiscountprice] = useState();
  const [discountprices, setDiscountprices] = useState();
  const [discounttype, setDiscountType] = useState(SettingInfo?.currentType);
  const [showDiscount, setShowDiscount] = useState(0);
  const [errors, setError] = useState({});
  const [focus, setFocus] = useRoveFocus(allServices?.length);
  const [subtotal, setSubtotal] = useState();
  const [Gst, setGst] = useState();
  const [TotalAmount, setTotalAmount] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [er, setEr] = useState();
  const [change, setChange] = useState(false);
  const [changes, setChanges] = useState(false); // for tracking changes to <EditServicesModal /> && <InvoiceProductConsumptionModal />
  const [sallonName, SetSallonName] = useState();
  const [type, SetType] = useState("product");
  const [paymenttMethod, setPaymenttMethod] = useState();
  const [service, setservice] = useState();
  const [back, setBack] = useState(false);
  const [serviceTax, setServiceTax] = useState();
  const [gstType, setGstType] = useState();
  const [productTax, setProductTax] = useState(false);
  const [gstOn, setGstOn] = useState(false);
  const [memberShipData, setmemberShipData] = useState([]);
  const [selctedMemberShip, setSelctedMemberShip] = useState([]);
  const [searchMembershipData, setSearchMembershipData] = useState([]);
  const [gstmembershipData, setGstmembershipData] = useState([]);
  const [allCompanyProduct, setAllCompanyProduct] = useState();
  const [editProductssData, setEditProductssData] = useState();
  const [productData, setProductData] = useState();
  const [productCountss, setProductCountss] = useState([]);
  const [productt, setProductt] = useState();
  const [activdata, setActiveData] = useState();
  const [editMembershipValue, setEditMembershipValue] = useState();
  const [membershipId, setMembershipId] = useState();
  const [serviceObject, setServiceObject] = useState();
  const [removeCusData, setRemoveCusData] = useState();
  const [membershiphide, setMembershipHide] = useState(false);
  const [totalmembershipDiscount, setTotalMembershipDiscount] = useState(0);
  const [sameInvoice, setSameInvoice] = useState(false);
  const [accept, setAccept] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState("RequestAccepted");
  const [defaults, setDefaults] = useState(true);
  const [availService, setAvailService] = useState();
  const [availServ, setAvailServ] = useState();
  const [openSplitPay, setOpenSplitPay] = useState(false);
  const [splitPayment, setSplitPayment] = useState([]);
  const [edit, setEdit] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const [grossTotal, setGrossTotal] = useState();
  const [editInvoiceAvailService, setEditInvoiceAvailService] = useState();
  const [dueToggle, setDueToggle] = useState(false);
  const [advanceToggle, setadvanceToggle] = useState(false);
  const [dueAmount, setDueAmount] = useState();
  const [collectedAmount, setCollectedAmount] = useState();
  const [amount, setAmount] = useState(editInvoice?.collectedAmount);
  const [dueChanges, setDueChanges] = useState(false);
  const [advanceChanges, setAdvanceChanges] = useState(false);
  const [additionalProductConsumption, setAdditionalProductConsumption] =
    useState([]);
  const [ratioChange, setRatioChange] = useState(true);
  const [discountPerUnit, setDiscountPerUnit] = useState();
  const [createdDate, setCreatedDate] = useState();
  const [dateSelection, setDateSelection] = useState(true);
  const [defaultAllService, setDefaultAllServices] = useState([]);
  const [defaultmemberShipData, setDefaultmemberShipData] = useState([]);
  const [onboardingTourOn, setOnboardingTourOn] = useState(false);
  const [cursor, setCursor] = useState();
  const [selected, setSelected] = useState(undefined);
  const [hovered, setHovered] = useState(undefined);
  const [walletBalance, setWalletBalance] = useState();
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");

  const [balanceAmount, setBalanceAmount] = useState();
  const [advanceamount, setAdvanceamount] = useState();
  const [showAddDue, setShowAddDue] = useState();
  const [previousDue, setPreviousDue] = useState();
  const [dueTransction, setDueTransction] = useState([]);
  const [addDisble, setAddDisble] = useState(false);
  const [checkCondition, setCheckCondition] = useState(true);
  const [previousDueModal, setPreviousDueModal] = useState(false);
  const [notes, setNotes] = useState("");

  let payMethod;
  const [paymentSplitMethod, setPaymentSplitMethod] = useState();
  const dispatch = useDispatch();

  const toggleAdditionalNotesModal = (e, data) => {
    if (data) {
      setChange(true);
      setNotes(data);
    }
    setShowAdditionalNotesModal(!showAdditionalNotesModal);
  };
  // ################ onboarding #######################

  const storeOnboardingStatus = useSelector(
    (state) => state.onboardingStatusRed
  );
  const storeOnboardingTourProgress = useSelector(
    (state) => state.onboardingTourProgressRed
  );
  const storeOnboardingTourStatus = useSelector(
    (state) => state.onboardingTourStatusRed
  );
  const storeOnboardingTooltipStatus = useSelector(
    (state) => state.onboardingTooltipStatusRed
  );
  const storeOnboardingCurrentTooltip = useSelector(
    (state) => state.onboardingCurrentTooltipRed
  );
  let EditStaffforCustomer;
  useEffect(() => {
    if (storeOnboardingTourStatus && storeOnboardingCurrentTooltip === "I3") {
      setAddServices(!addServices);
      dispatch(setOnboardingTooltipStatus(true));
    }
  }, [storeOnboardingTourStatus, storeOnboardingCurrentTooltip]);

  // ########################################################

  //product consumption pop-up && states
  const [invoiceProductConsumptionModal, setInvoiceProductConsumptionModal] =
    useState(false);
  const InvoiceProductConsumptionToggle = async (
    e,
    key,
    data,
    additionalProd
  ) => {
    if (key === "save") {
      let temServiceData = await data.map((service) => {
        let onlyNeededConsumptionData = service.productConsumptions.map(
          (product) => {
            let tempAddedConsumption = product?.defaultConsumption
              ? (product?.unit === "kg" || product?.unit === "litre"
                  ? +product.consumptionRate / 1000
                  : +product.consumptionRate) - +product?.defaultConsumption
              : product?.unit === "kg" || product?.unit === "litre"
              ? +product.consumptionRate / 1000
              : +product.consumptionRate;
            return {
              _id: product._id,
              quantity: product.quantity,
              consumptionRate: +product.consumptionRate,
              addedConsumption: tempAddedConsumption.toFixed(4),
              defaultConsumption: product.defaultConsumption,
              productName: product.productName,
              productType: product.productType,
              brandId: product.brandId,
              categoryId: product.categoryId,
              unit: product.unit,
              updatedUnit:
                product?.unit === "litre"
                  ? "ml"
                  : product?.unit === "kg"
                  ? "gm"
                  : product?.unit,
              isAdditional: false,
            };
          }
        );
        return { ...service, productConsumptions: onlyNeededConsumptionData };
      });
    
      setServiceDetails(temServiceData);
      setInvoiceProductConsumptionModal(!invoiceProductConsumptionModal);
      setAdditionalProductConsumption(
        additionalProd.map((pro) => {
          return {
            ...pro,
            isAdditional: true,
            updatedUnit:
              pro?.unit === "litre"
                ? "ml"
                : pro?.unit === "kg"
                ? "gm"
                : pro?.unit,
          };
        })
      );
      setChange(true);
    } else if (key === "discard") {
      setInvoiceProductConsumptionModal(!invoiceProductConsumptionModal);
    } else {
      setInvoiceProductConsumptionModal(!invoiceProductConsumptionModal);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });
  useEffect(() => {
    let array = serviceDetails?.map((rep) => rep.membershipDiscount);

    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue;

    if (array?.length > 0) {
      const sumOfMembership = array.reduce(reducer);
      setTotalMembershipDiscount(sumOfMembership);
    }
  }, [serviceDetails]);

  let serv;

  useEffect(() => {
    if (pastInvoice) {
      setCreatedDate(moment().subtract(1, "days")._d);
    }
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    ApiGet("account/company/companyData/" + userInfo.companyId)
      .then((resp) => {
        SetSallonName(resp?.data?.data[0]?.businessName);
      })
      .catch((er) => {
        alert(er);
      });
    getStoreSetting();

    ApiGet("membership/company/" + userInfo.companyId).then((resp) => {
      setmemberShipData(resp.data.data.filter((res) => res?.activeMembership));
      setDefaultmemberShipData(
        resp.data.data.filter((res) => res?.activeMembership)
      );
      setSearchMembershipData(resp.data.data);
      setActiveData(resp.data.data[0]?.activeMembership);
    });
  }, []);

  useEffect(() => {
    getAllStaff();
  }, []);

  useEffect(() => {
    if (splitPayment?.length > 0) {
      if (
        Math.round(TotalAmount) !==
        splitPayment
          ?.map((item) => item.amount)
          .reduce((prev, curr) => prev + curr, 0)
      ) {
        if(  editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ){

        }else{
        RemoveSplitPayment();
        }
      }
    }
    // setCollectedAmount();

    setAmount();
    if (!editInvoice) {
      setDueAmount();
      setBalanceAmount();
    }

    setDueToggle(false);
    setadvanceToggle(false);
    setDueChanges(false);
    setAdvanceChanges(false);
  }, [TotalAmount]);

  useEffect(() => {
    if (sortStaff?.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);

  useEffect(() => {
    if (sortStaff?.length && hovered) {
      setCursor(sortStaff.indexOf(hovered));
    }
    if (allServices?.length && hovered) {
      setCursor(allServices.indexOf(hovered));
    }
  }, [hovered]);

  useEffect(() => {
    if (sortStaff?.length && downPress) {
      setCursor((prevState) =>
        prevState < sortStaff?.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);

  useEffect(() => {
    // if (splitPayment?.length > 0) {
    //   if (
    //     TotalAmount !==
    //     splitPayment
    //       ?.map((item) => item.amount)
    //       .reduce((prev, curr) => prev + curr, 0)
    //   ) {
    //     RemoveSplitPayment();
    //   }
    // }

    //  calculate grossTotal, TotalDiscount and TotalDiscountedPrice on every change

    let GrossTotals =
      serviceDetails
        .map((item) => item.servicerate)
        .reduce((prev, curr) => prev + curr, 0) +
      cartItems
        .map((item) => item.productSubTotal)
        .reduce((prev, curr) => prev + curr, 0) +
      selctedMemberShip
        .map((item) => item.price)
        .reduce((prev, curr) => prev + curr, 0);

    let totaldiscount =
      serviceDetails
        .map((item) => item.servicediscount)
        .reduce((prev, curr) => prev + curr, 0) +
      serviceDetails
        .map((item) => item.membershipDiscount)
        .reduce((prev, curr) => prev + curr, 0) +
      cartItems
        .map((item) => item.productDiscount)
        .reduce((prev, curr) => prev + curr, 0) +
      selctedMemberShip
        .map((item) => item.membershipDiscount)
        .reduce((prev, curr) => prev + curr, 0);

    let discountedprice =
      serviceDetails
        .map((item) => item.serviceflatdiscountedprice)
        .reduce((prev, curr) => prev + curr, 0) +
      cartItems
        .map((item) => item.flatdiscountedSubTotal)
        .reduce((prev, curr) => prev + curr, 0) +
      selctedMemberShip
        .map((item) => item.flatdiscountedPrice)
        .reduce((prev, curr) => prev + curr, 0);

    setGrossTotal(GrossTotals);
    setTotalDiscount(totaldiscount);
    setDiscountedPrice(discountedprice);
  }, [TotalAmount]);

  const handleOnSearch = (e) => {
    var searchData =
      searchMembershipData?.length > 0 &&
      searchMembershipData?.filter(
        (rep) =>
          rep?.membershipName
            ?.toLowerCase()
            .includes(e.target?.value?.toLowerCase()) ||
          rep?.price?.toString().includes(e.target?.value?.toString())
      );
    if (e.target.value === "") {
      setmemberShipData(defaultmemberShipData);
    } else {
      if (searchData?.length > 0) {
        setmemberShipData(searchData);
      } else {
        setmemberShipData([]);
      }
    }
  };

  const getStoreSetting = async (values) => {
    const SettingData = get_Setting();

    setInventoy(SettingData?.inventory?.enableInventory);
    setCustomerCompulsion(SettingData?.iCustomer);
    setServiceTax(SettingData?.tax?.serviceTax);
    setGstType(SettingData?.tax?.gstType);
    setProductTax(SettingData?.tax?.productTax);
    setGstOn(SettingData?.tax?.gstCharge);
    setPaymenttMethod(SettingData?.paymentMethod);
    setSameInvoice(SettingData?.membership?.applyMembershipBenefits);
   
  };
  useEffect(async () => {

    if (editInvoice) {
      let temAdditionalProductConsumption =
        await editInvoice.productConsumptions.map((pro) => {
          return pro.isAdditional
            ? {
                consumptionRate:
                  pro?.unit === "litre" || pro?.unit === "kg"
                    ? pro?.Product_quantity * 1000
                    : pro?.Product_quantity,
                defaultConsumption: pro?.defaultConsumption,
                addedConsumption: pro?.addedConsumption,
                isAdditional: pro?.isAdditional,
                productName: pro?.productName,
                productType: pro?.productType,
                quantity: pro?.quantity,
                unit: pro?.unit,
                updatedUnit:
                  pro?.unit === "litre"
                    ? "ml"
                    : pro?.unit === "kg"
                    ? "gm"
                    : pro?.unit,
                _id: pro?.Product_id,
                brandId: pro?.brandId,
                categoryId: pro?.categoryId,
              }
            : {};
        });
      let filteredAdditionalProductConsumptions =
        await temAdditionalProductConsumption?.filter(
          (pro) => pro.isAdditional
        );
      // ------- add productConsumption array to services without productConsumptions

      let updatedServices = editInvoice?.serviceDetails?.map((ser) => {
        return ser?.productConsumptions
          ? ser
          : { ...ser, productConsumptions: [] };
      });
    
      setIsSplit(editInvoice?.isSplit)
      setSplitPayment(editInvoice?.splitPayment);
      if(editInvoice?.splitPayment[0]?.method === "Wallet" && editInvoice?.splitPayment?.length <= 2){
        setPaymentSplitMethod(editInvoice?.splitPayment[1]?.method)
      }
      setServiceDetails(updatedServices);
      setAdditionalProductConsumption(filteredAdditionalProductConsumptions);
      setAddProduct(true);
      setAddServices(false);
      setSelectService(false);
      if (
        editInvoice?.customerData?.membership === true ||
        editInvoice?.discountMembership > 0
      ) {
        setMembershipHide(true);
        setTotalMembershipDiscount(editInvoice?.discountMembership);
      }
      setBalanceAmount(editInvoice?.balanceAmountRecord);
      setDueAmount(editInvoice?.dueAmountRecord);
      setPreviousDue(editInvoice?.previousDueClearRecord)
      setInvoiceDetail(false);
      SetType(editInvoice?.type);
      setCartItems(
        editInvoice?.products.map((exist) => {
          return { ...exist, finalproduct: 0 };
        })
      );
      setProductData(
        editInvoice?.products.map((exist) => {
          return { ...exist, finalproduct: 0 };
        })
      );
      setSelctedMemberShip(editInvoice.membershipDetails);
      setNewcartItems({ ...editInvoice.products, productCount: 0 });
      setNotes(editInvoice?.notes);
      setCustomer(
        editInvoice?.customerData
          ? editInvoice?.customerData
          : {
              firstName: "Walk-in-Customer",
              lastName: "",
              mobileNumber: "",
            }
      );
      setCollectedAmount(editInvoice?.collectedAmountRecord);
      setSmsCheckbox(editInvoice?.isSMS);
      setPaymentMethod(editInvoice?.paymentMethod);
      setSubtotal(editInvoice?.subTotal);
      setGst(editInvoice?.GST?.gstAmount);
      setTotalAmount(editInvoice?.totalAmount);
      setShowDiscount(editInvoice?.discount?.discountAmount);
    }
    if (invoiceData) {
      let gsttypes;
      const SettingData = get_Setting();

      setInventoy(SettingData?.inventory?.enableInventory);
      setCustomerCompulsion(SettingData?.iCustomer);
      setServiceTax(SettingData?.tax?.serviceTax);
      setGstType(SettingData?.tax?.gstType);
      gsttypes = SettingData?.tax?.gstType;
      serv = SettingData?.tax?.serviceTax;
      setProductTax(SettingData?.tax?.productTax);
      setGstOn(SettingData?.tax?.gstCharge);
      setPaymenttMethod(SettingData?.paymentMethod);
      payMethod = SettingData?.paymentMethod;

     
      let data;
      invoiceData.map((inv, i) => {
        if (gsttypes === "Inclusive") {
          data = {
            multipleStaff: true,
            categoryName: inv.serviceId.categoryId,
            colour: inv.serviceId.colour,
            key: i + 1,
            categoryId: inv.serviceId.categoryId,
            serviceId: inv.serviceId._id,
            servicediscount: 0,
            servicediscountedprice: parseFloat(
              (inv.serviceId.amount / (1 + 18 / 100)).toFixed(2),
              10
            ),
            serviceflatdiscountedprice: parseFloat(
              (inv.serviceId.amount / (1 + 18 / 100)).toFixed(2),
              10
            ),
            servicegst: serv ? 18 : 0,
            servicegstamount: parseFloat(
              (
                inv.serviceId.amount -
                inv.serviceId.amount / (1 + 18 / 100)
              ).toFixed(2),
              10
            ),
            servicename: inv.serviceId.serviceName,
            servicerate: parseFloat(
              (inv.serviceId.amount / (1 + 18 / 100)).toFixed(2),
              10
            ),
            servicesubtotal:
              parseFloat(
                (inv.serviceId.amount / (1 + 18 / 100)).toFixed(2),
                10
              ) +
              parseFloat(
                (
                  inv.serviceId.amount -
                  inv.serviceId.amount / (1 + 18 / 100)
                ).toFixed(2),
                10
              ),
            staffid: inv.staffId._id,
            staffname: inv.staff,
            staff: [
              {
                ...inv.staffId,
                workRatio: parseFloat(
                  (inv.serviceId.amount / (1 + 18 / 100)).toFixed(2),
                  10
                ),
                workRationPercentage: 100,
              },
            ],
            membershipDiscount: 0,
            productConsumptions: inv?.productConsumptions || [],
          };
        } else {
          data = {
            multipleStaff: true,
            categoryName: inv.serviceId.categoryId,
            colour: inv.serviceId.colour,
            key: i + 1,
            categoryId: inv.serviceId.categoryId,
            serviceId: inv.serviceId._id,
            servicediscount: 0,
            servicediscountedprice: inv.serviceId.amount,
            serviceflatdiscountedprice: inv.serviceId.amount,
            servicegst: serv ? 18 : 0,
            servicegstamount: (inv.serviceId.amount * (serv ? 18 : 0)) / 100,
            servicename: inv.serviceId.serviceName,
            servicerate: inv.serviceId.amount,
            servicesubtotal:
              inv.serviceId.amount +
              (inv.serviceId.amount * (serv ? 18 : 0)) / 100,
            staffid: inv.staffId._id,
            staffname: inv.staff,
            staff: [
              {
                ...inv.staffId,
                workRatio: inv.serviceId.amount,
                workRationPercentage: 100,
              },
            ],
            membershipDiscount: 0,
            productConsumptions: inv?.productConsumptions || [],
          };
        }

        serviceDetails.push(data);
        setServiceDetails([...serviceDetails]);
      });
      setSmsCheckbox(invoiceData?.isPromotional)
      SetType("appointment");
      setAddProduct(true);
      setAddServices(false);
      setSelectService(false);
      setInvoiceDetail(false);

      setCustomer(
        invoiceData[0]?.customer?.isActive
          ? invoiceData[0]?.customer?.mobileNumber === ""
            ? {
                firstName: invoiceData[0]?.type + "-Customer",
                lastName: "",
                mobileNumber: "",
              }
            : invoiceData[0]?.customer
          : {
              firstName: invoiceData[0]?.type + "-Customer",
              lastName: "",
              mobileNumber: "",
            }
      );
      setSubtotal(
        serviceDetails
          .map((item) => item.servicediscountedprice)
          .reduce((prev, curr) => prev + curr, 0)
      );
      setGst(
        serviceDetails
          .map((item) => item.servicegstamount)
          .reduce((prev, curr) => prev + curr, 0)
      );
      setTotalAmount(
        serviceDetails
          .map((item) => item.servicesubtotal)
          .reduce((prev, curr) => prev + curr, 0)
      );

      let member = invoiceData[0]?.customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
      );
      let member1 = invoiceData[0]?.customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
      );
      let limitedZero = member?.filter((data) => data.availService > 0);
      let limitedZero1 = member1?.filter(
        (data) => data.availService === null || data.availService === 0
      );

      let MembershipServices;
      if (
        limitedZero?.length > 0 &&
        invoiceData[0]?.customer?.membership === true
      ) {
        let data = invoiceData[0]?.customer?.selectMembership.filter(
          (obj) => obj.isExpire === false
        );

        MembershipServices = serviceDetails
          .map((items) => {
            return data[0]?.selectedServices?.filter(
              (item) => item._id === items.serviceId
            );
          })
          .flat();
        setAvailService(MembershipServices);
      } else if (
        limitedZero1?.length > 0 &&
        invoiceData[0]?.customer?.membership === true
      ) {
        MembershipServices = serviceDetails
          .map((items) => {
            return invoiceData[0]?.customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();
        setAvailService(MembershipServices);
      }
  
      MembershipApply("RequestAccepted", invoiceData[0]?.customer);
    }
  }, []);

  useEffect(() => {
    ApiGet("service/company/" + userInfo.companyId).then((resp) => {
      let filterservice = resp.data.data.filter((obj) =>
        obj.categoryName === "Unassign" ? null : obj
      );
      if (isFrequentServiceOn) {
        let tempFrequentServices = filterservice?.filter(
          (ser) => ser?.frequentService
        );
        let tempSortedServices = tempFrequentServices?.sort(
          (a, b) => a?.index - b?.index
        );
        setAllFrequentServices(
          tempSortedServices?.filter((ser) => ser?.frequentService)
        );
        let nonFrequentServices = filterservice?.filter(
          (ser) => !ser?.frequentService
        );
        setAllNonFrequentServices(
          nonFrequentServices?.sort(
            (a, b) => new Date(a?.created) - new Date(b?.created)
          )
        );
        tempSortedServices?.push(...nonFrequentServices);
        setAllServices(tempSortedServices);
        setDefaultAllServices(tempSortedServices);
      } else {
        let tempUnsortedServices = filterservice?.sort(
          (a, b) => new Date(a?.created) - new Date(b?.created)
        );
        setAllServices(tempUnsortedServices);
        setDefaultAllServices(tempUnsortedServices);
      }
    });
  }, []);
  const productTypeRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        subMenuOpen &&
        productTypeRef.current &&
        !productTypeRef.current.contains(e.target)
      ) {
        setSubMenuopen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [subMenuOpen]);

  useEffect(() => {
    getAllServices();
  }, []);

  const getAllServices = async (e) => {
    try {
      setLoading(true);
      let res = await ApiGet("service/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        let filterservice = res.data.data.filter((obj) =>
          obj.categoryName === "Unassign" ? null : obj
        );
        if (isFrequentServiceOn) {
          let tempFrequentServices = filterservice?.filter(
            (ser) => ser?.frequentService
          );
          let tempSortedServices = tempFrequentServices?.sort(
            (a, b) => a?.index - b?.index
          );
          let nonFrequentServices = filterservice?.filter(
            (ser) => !ser?.frequentService
          );
          tempSortedServices?.push(...nonFrequentServices);
          setAllCompanyServices(tempFrequentServices);
        } else {
          setAllCompanyServices(filterservice);
        }
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Categories", err);
    }
  };

  const SplitPaymentHandler = (data) => {
    SplitPaymentHandlerToggle();
    setChange(true);
    if (data) {
      setEdit(true);
    }
  };
  const SplitPaymentHandlerToggle = (data) => {
    setOpenSplitPay(!openSplitPay);
    if (data) {
      setSplitPayment(data);
      setPaymentMethod("Split");
      setIsSplit(true);
      setPaymentSplitMethod(data[1]?.method);
    }
  };
  const RemoveSplitPayment = () => {
    setEdit(false);
    setSplitPayment([]);
    setPaymentMethod(paymenttMethod[0]);
    setIsSplit(false);
    setChange(true);
  };

  const handleServiceSearch = async (e) => {
    setSearchKeyword(e.target.value);
    var serviceData =
      allCompanyServices?.length > 0 &&
      allCompanyServices?.filter(
        (obj) =>
          (obj?.serviceName &&
            obj?.serviceName
              .toLowerCase()
              .includes(e.target.value?.toLowerCase())) ||
          (obj?.categoryName &&
            obj?.categoryName
              .toLowerCase()
              .includes(e.target.value?.toLowerCase())) ||
          (obj?.quickSearch &&
            obj?.quickSearch
              .toLowerCase()
              .includes(e.target.value?.toLowerCase())) ||
          (obj?.amount &&
            obj?.amount.toString().includes(e.target.value.toString()))
      );
    if (e.target.value === "") {
      setSearchKeyword("");
      setAllServices(defaultAllService);
    } else {
      setAllServices(serviceData);
    }
  };

  const getAllSelectStaff = async (data) => {
    //     const exist = serviceDetails?.find((x) => x.serviceId === data?._id);
    // console.log("<<exist>>", exist);
    // const exist = serviceDetails
    // if(exist){
    //   setSelectedStaff(exist?.staff)
    // }
    setservice(data);
    setOpenWorkRation(false);
    if (serviceTax && gstType == "Inclusive") {
      setAddedServices({
        key: key,
        categoryName: data.categoryName,
        categoryId: data.categoryId,
        colour: data.colour,
        serviceId: data._id,
        servicename: data.serviceName,
        servicerate: parseFloat((data.amount / (1 + 18 / 100)).toFixed(2), 10),
        servicediscount: 0,
        servicediscountedprice: parseFloat(
          (data.amount / (1 + 18 / 100)).toFixed(2),
          10
        ),
        serviceflatdiscountedprice: parseFloat(
          (data.amount / (1 + 18 / 100)).toFixed(2),
          10
        ),
        servicegst: serviceTax ? 18 : 0,
        servicegstamount: parseFloat(
          (data.amount - data.amount / (1 + 18 / 100)).toFixed(2),
          10
        ),
        multipleStaff: true,
        servicesubtotal: data.amount,
        membershipDiscount: 0,
        productConsumptions: data.productConsumptions,
      });
      setDiscountPerUnit(
        parseFloat((data.amount / (1 + 18 / 100)).toFixed(2), 10)
      );
    } else {
      setAddedServices({
        key: key,
        categoryName: data.categoryName,
        categoryId: data.categoryId,
        colour: data.colour,
        serviceId: data._id,
        servicename: data.serviceName,
        servicerate: data.amount,
        servicediscount: 0,
        servicediscountedprice: data.amount - 0,
        serviceflatdiscountedprice: data.amount - 0,
        servicegst: serviceTax ? 18 : 0,
        servicegstamount: ((data.amount - 0) * (serviceTax ? 18 : 0)) / 100,
        servicesubtotal:
          data.amount - 0 + ((data.amount - 0) * (serviceTax ? 18 : 0)) / 100,
        membershipDiscount: 0,
        multipleStaff: true,
        productConsumptions: data.productConsumptions,
      });
      setDiscountPerUnit(data.amount - 0);
    }
    setKey(key + 1);
    setSelectService(!selectService);
    try {
      let res = await ApiGet(
        "category/staff/data/day/" +
          data?.categoryId +
          "/" +
          moment(new Date()).format("dddd")
      );
      if (res.data.status === 200) {
        if (
          storeOnboardingTourStatus &&
          storeOnboardingCurrentTooltip === "I3" &&
          res?.data?.data?.length === 0
        ) {
          let dummyStaff = [
            {
              workingDays: [
                {
                  isStoreClosed: false,
                  dayOff: false,
                  Day: "Monday",
                  starttime: "09:00",
                  endtime: "17:30",
                },
                {
                  isStoreClosed: false,
                  dayOff: false,
                  Day: "Tuesday",
                  starttime: "09:00",
                  endtime: "20:00",
                },
                {
                  isStoreClosed: false,
                  dayOff: false,
                  Day: "Wednesday",
                  starttime: "09:00",
                  endtime: "20:00",
                },
                {
                  isStoreClosed: false,
                  dayOff: false,
                  Day: "Thursday",
                  starttime: "09:00",
                  endtime: "20:00",
                },
                {
                  isStoreClosed: false,
                  dayOff: false,
                  Day: "Friday",
                  starttime: "09:00",
                  endtime: "20:00",
                },
                {
                  isStoreClosed: true,
                  dayOff: false,
                  Day: "Saturday",
                  starttime: "09:00",
                  endtime: "20:00",
                },
                {
                  isStoreClosed: false,
                  dayOff: false,
                  Day: "Sunday",
                  starttime: "09:00",
                  endtime: "20:00",
                },
              ],
              default: false,
              isActive: true,
              permission: [],
              firstName: userInfo?.Name,
              lastName: "",
              email: "",
              gender: "",
              birthday: "",
              address: "",
              notes: "",
              companyId: userInfo?.companyId,
              password: "",
            },
          ];
          dispatch(setOnboardingCurrentTooltip("I4"));
          setAllStaff(dummyStaff);
        } else {
          if (
            SettingInfo?.attendence?.attendanceToggle &&
            SettingInfo?.attendence?.attendanceForInvoiceToggle
          ) {
            if (pastInvoice) {
              setAllStaff(res.data.data);
            }else{
              let tempAvailableAllStaff = await res.data.data?.filter((item)=>availableStaffData?.filter((data)=>data?._id === item?._id).length > 0)
              setAllStaff(tempAvailableAllStaff);
             
            }
          } else {
              setAllStaff(res.data.data);
          }
        }
      } else {
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const handleStaffSearch = async (e) => {
    setSearchKeywrd(e.target.value);
    var staffData =
      allStaff.length > 0 &&
      allStaff.filter(
        (obj) =>
          (obj.firstName &&
            obj.firstName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.lastName &&
            obj.lastName.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    if (e.target.value === "") {
      ApiGet(
        "category/staff/data/day/" +
          service?.categoryId +
          "/" +
          moment(new Date()).format("dddd")
      ).then((resp) => {
        setAllStaff(resp.data.data);
      });
    } else {
      setAllStaff(staffData);
    }
  };

  const Mermbershipmodal = (data) => {
    setInvoiceDetail(false);
    setAddProduct(true);
    setAddMemberShip(true);
    setAddServices(false);
    setSelectService(false);
    setMemberStaffData(true);

    setSelctedMemberShip(
      selctedMemberShip?.map((mbr) => {
        return {
          ...mbr,
          staffId: data._id,
          staffName: data?.firstName + " " + data?.lastName,
        };
      })
    );
  };
  const modal = (data) => {
    if (!storeOnboardingTourStatus && storeOnboardingCurrentTooltip !== "I4") {
      ApiGet("service/company/" + userInfo.companyId).then((resp) => {
        let filterservice = resp.data.data.filter((obj) =>
          obj.categoryName === "Unassign" ? null : obj
        );
        if (isFrequentServiceOn) {
          let tempFrequentServices = filterservice?.filter(
            (ser) => ser?.frequentService
          );
          let tempSortedServices = tempFrequentServices?.sort(
            (a, b) => a?.index - b?.index
          );
          let nonFrequentServices = filterservice?.filter(
            (ser) => !ser?.frequentService
          );
          tempSortedServices?.push(...nonFrequentServices);
          setAllServices(tempFrequentServices);
        } else {
          setAllServices(filterservice);
        }
      });
    } else {
      setTimeout(() => {
        dispatch(setOnboardingCurrentTooltip("I5"));
      }, 250);
    }
    if (editServiceData) {
      let edited = serviceDetails?.map((serv) => {
        if (serv?.key === editServiceData?.key) {
          return {
            ...serv,
            staff: [
              {
                ...data,
                workRatio: addedServices?.servicerate,
                workRationPercentage: 100,
              },
            ],
          };
        } else {
          return { ...serv };
        }
      });

      setServiceDetails(edited);
      EditStaffforCustomer = edited;
    } else {
      serviceDetails.push(
        Object.assign(addedServices, {
          staff: [
            {
              ...data,
              workRatio: addedServices?.servicerate,
              workRationPercentage: 100,
            },
          ],
        })
      );
    }

    if (removeCusData?.length > 0) {
      removeCusData.push(
        Object.assign(addedServices, {
          staff: [
            {
              ...data,
              workRatio: addedServices?.servicerate,
              workRationPercentage: 100,
            },
          ],
        })
      );
      setRemoveCusData([...removeCusData]);
    }

    let member = customer?.selectMembership?.filter(
      (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
    );
    let member1 = customer?.selectMembership?.filter(
      (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
    );
    let limitedZero = member?.filter((data) => data.availService > 0);
    let limitedZero1 = member1?.filter(
      (data) => data.availService === null || data.availService === 0
    );

    let MembershipServices;
    if (limitedZero?.length > 0 && customer?.membership === true) {
      MembershipServices = serviceDetails
        .map((items) => {
          return customer?.selectMembership[
            customer?.selectMembership?.length - 1
          ]?.selectedServices?.filter((item) => item._id === items.serviceId);
        })
        .flat();
      setAvailService(MembershipServices);
    } else if (limitedZero1?.length > 0 && customer?.membership === true) {
      MembershipServices = serviceDetails
        .map((items) => {
          return customer?.selectMembership[
            customer?.selectMembership?.length - 1
          ]?.selectedServices?.filter((item) => item._id === items.serviceId);
        })
        .flat();
      setAvailService(MembershipServices);
    } else {
      setAvailService([]);
    }

    if (selctedMemberShip.length > 0) {
      let memberss = customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === true && resp?.validFor === "Limited"
      );

      let limitedZeross = memberss?.filter((data) => data.availService > 0);

      if (limitedZeross?.length > 0) {
        const MembershipSer = serviceDetails
          .map((items) => {
            return customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();

        setEditInvoiceAvailService(MembershipSer);
      } else {
        setEditInvoiceAvailService([]);
      }
    }
    if (!editServiceData) {
      setServiceDetails([...serviceDetails]);
    }
    setInvoiceDetail(!invoiceDetail);
    MembershipApply(MembershipServices);
  };

  const AddMoreDetails = () => {
    setEditServiceData();
    // setSelectedStaff([])
    setSelectedStaffId([]);
    setAddedServices();
    setAddProduct(true);
    setAddServices(true);
    setSelectService(true);
    setInvoiceDetail(true);
    setBack(true);
    setChange(true);
    SingleStaff();
  };

  const GetDiscount = (e) => {
    setDiscountprices(e.target.value);

    setSave(true);
  };

  const RemoveDiscount = () => {
    setChange(true);
    setShowDiscount(0);
    setDiscountprice();
    setDiscountprices();
    setDiscountType(SettingInfo?.currentType);
    const ServiceDetail = serviceDetails?.map((serv) => {
      // if(serv.serviceflatdiscountedprice === 0){
      //   return serv
      // }else{
      return {
        ...serv,
        categoryName: serv.categoryName,
        categoryId: serv.categoryId,
        colour: serv.colour,
        key: serv.key,
        serviceId: serv.serviceId,
        servicediscount: serv.servicerate - serv.servicediscountedprice,
        servicediscountedprice: serv.servicediscountedprice,
        serviceflatdiscountedprice:
          serv.servicediscountedprice - serv.membershipDiscount,
        servicegst: serv.servicegst,
        servicegstamount:
          ((serv.servicediscountedprice - serv.membershipDiscount) *
            serv.servicegst) /
          100,
        servicename: serv.servicename,
        servicerate: serv.servicerate,
        servicesubtotal:
          serv.servicediscountedprice -
          serv.membershipDiscount +
          ((serv.servicediscountedprice - serv.membershipDiscount) *
            serv.servicegst) /
            100,
        // serv.servicediscountedprice +
        // (serv.servicediscountedprice * serv.servicegst) / 100,
        staff: serv?.staff?.map((one) => {
          return {
            ...one,
            workRatio: parseFloat(
              (
                ((serv.servicediscountedprice - serv.membershipDiscount) *
                  one?.workRationPercentage) /
                100
              ).toFixed(2),
              10
            ),
          };
        }),
        membershipDiscount: serv.membershipDiscount,
        productConsumptions: serv?.productConsumptions || [],
      };
      // }
    });

    const CartItem = cartItems?.map((prod) => {
      return {
        ...prod,
        discountedPrice: prod.discountedPrice,
        discountedPriceGstAmount:
          (prod.discountedSubTotal * prod.productgst) / 100,
        discountedPriceWithGstAmount:
          prod.discountedSubTotal +
          (prod.discountedSubTotal * prod.productgst) / 100,
        discountedSubTotal: prod.discountedSubTotal,
        finalproduct: prod.finalproduct,
        flatdiscountedSubTotal: prod.discountedSubTotal,
        productCount: prod.productCount,
        productDiscount:
          (prod.productPrice - prod.discountedPrice) * prod.productCount,
        productId: prod.productId,
        productName: prod.productName,
        productPrice: prod.productPrice,
        productSubTotal: prod.productSubTotal,
        productUnit: prod.productUnit,
        productgst: prod.productgst,
        productquantity: prod.productquantity,
        totalProductss: prod.totalProductss,
      };
    });

    const MembershipItem = selctedMemberShip.map((mber) => {
      return {
        ...mber,
        discountedPrice: mber.discountedPrice,
        gst: gstOn
          ? parseFloat(
              ((mber.discountedPrice * mber.gstPercentage) / 100).toFixed(2),
              10
            )
          : 0,
        membershipDiscount: mber.price - mber.discountedPrice,
        flatdiscountedPrice: mber.discountedPrice,
      };
    });
    setCartItems(CartItem);
    setServiceDetails(ServiceDetail);
    setSelctedMemberShip(MembershipItem);

    setGst(
      (
        ServiceDetail.map((item) => item?.servicegstamount).reduce(
          (prev, curr) => prev + curr,
          0
        ) +
        CartItem.map((item) => item?.discountedPriceGstAmount).reduce(
          (prev, curr) => prev + curr,
          0
        ) +
        MembershipItem.map((item) => item?.gst).reduce(
          (prev, curr) => prev + curr,
          0
        )
      ).toFixed(2)
    );
    let total = parseFloat(
      (
        subtotal -
        totalmembershipDiscount +
        (ServiceDetail.map((item) => item?.servicegstamount).reduce(
          (prev, curr) => prev + curr,
          0
        ) +
          CartItem.map((item) => item?.discountedPriceGstAmount).reduce(
            (prev, curr) => prev + curr,
            0
          )) +
        MembershipItem.map((item) => item?.gst).reduce(
          (prev, curr) => prev + curr,
          0
        )
      ).toFixed(2),
      10
    );
    setTotalAmount(total);
    setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
    getUserWallet(customer, total);
  };

  const SaveDiscount = () => {
    setChange(true);

    let errors = {};
    if (discounttype === "%") {
      if (discountprices > 100) {
        errors["discount"] = "* Enter valid input";
      } else {
        let FlatDiscount;
        if (gstOn && gstType === "Inclusive") {
          setDiscountprice((TotalAmount * discountprices) / 100);
          setShowDiscount((TotalAmount * discountprices) / 100);
          setDiscount(!discount);
          FlatDiscount = discountprices;
        } else {
          setDiscountprice(
            ((subtotal - totalmembershipDiscount) * discountprices) / 100
          );
          setShowDiscount(
            ((subtotal - totalmembershipDiscount) * discountprices) / 100
          );
          setDiscount(!discount);
          FlatDiscount = discountprices;
        }

        const ServiceDetail = serviceDetails?.map((serv) => {
          if (serv.serviceflatdiscountedprice === 0) {
            return serv;
          } else {
            return {
              ...serv,
              categoryName: serv.categoryName,
              categoryId: serv.categoryId,
              colour: serv.colour,
              key: serv.key,
              serviceId: serv.serviceId,
              servicediscount: parseFloat(
                (
                  serv.servicediscount +
                  (serv.serviceflatdiscountedprice * FlatDiscount) / 100
                ).toFixed(2),
                10
              ),
              servicediscountedprice: serv.servicediscountedprice,
              serviceflatdiscountedprice: parseFloat(
                (
                  serv.serviceflatdiscountedprice -
                  ((serv.servicediscountedprice - serv.membershipDiscount) *
                    FlatDiscount) /
                    100
                ).toFixed(2),
                10
              ),
              servicegst: serv.servicegst,
              servicegstamount: parseFloat(
                (
                  (parseFloat(
                    (
                      serv.serviceflatdiscountedprice -
                      ((serv.servicediscountedprice - serv.membershipDiscount) *
                        FlatDiscount) /
                        100
                    ).toFixed(2),
                    10
                  ) *
                    serv.servicegst) /
                  100
                ).toFixed(2),
                10
              ),
              servicename: serv.servicename,
              servicerate: serv.servicerate,
              servicesubtotal: parseFloat(
                (
                  serv.serviceflatdiscountedprice -
                  ((serv.servicediscountedprice - serv.membershipDiscount) *
                    FlatDiscount) /
                    100 +
                  (parseFloat(
                    (
                      serv.serviceflatdiscountedprice -
                      ((serv.servicediscountedprice - serv.membershipDiscount) *
                        FlatDiscount) /
                        100
                    ).toFixed(2),
                    10
                  ) *
                    serv.servicegst) /
                    100
                ).toFixed(2),
                10
              ),
              membershipDiscount: serv.membershipDiscount,
              staff: serv?.staff?.map((one) => {
                return {
                  ...one,
                  workRatio:
                    ((serv.serviceflatdiscountedprice -
                      ((serv.servicediscountedprice - serv.membershipDiscount) *
                        FlatDiscount) /
                        100) *
                      one?.workRationPercentage) /
                    100,
                };
              }),
            };
          }
        });
        const CartItem = cartItems?.map((prod) => {
          return {
            ...prod,
            discountedPrice: prod.discountedPrice,
            discountedPriceGstAmount: parseFloat(
              (
                ((prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount *
                  prod.productgst) /
                100
              ).toFixed(2),
              10
            ),
            discountedPriceWithGstAmount: parseFloat(
              (
                (prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount +
                ((prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount *
                  prod.productgst) /
                  100
              ).toFixed(2),
              10
            ),
            discountedSubTotal: prod.discountedSubTotal,
            flatdiscountedSubTotal: parseFloat(
              (
                (prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                prod.productCount
              ).toFixed(2),
              10
            ),
            productCount: prod.productCount,
            productDiscount: parseFloat(
              (
                prod.productDiscount +
                ((prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount
              ).toFixed(2),
              10
            ),
            productId: prod.productId,
            finalproduct: prod.finalproduct,
            productName: prod.productName,
            productPrice: prod.productPrice,
            productSubTotal: prod.productSubTotal,
            productUnit: prod.productUnit,
            productgst: prod.productgst,
            productquantity: prod.productquantity,
            totalProductss: prod.totalProductss,
          };
        });
        const MembershipItem = selctedMemberShip.map((mber) => {
          return {
            ...mber,
            discountedPrice: mber.discountedPrice,
            gst:
              gstOn && mber.gst > 0
                ? parseFloat(
                    (
                      ((mber.discountedPrice -
                        mber.discountedPrice * (FlatDiscount / 100)) *
                        18) /
                      100
                    ).toFixed(2),
                    10
                  )
                : 0,
            flatdiscountedPrice: parseFloat(
              (
                mber.discountedPrice -
                mber.discountedPrice * (FlatDiscount / 100)
              ).toFixed(2),
              10
            ),
            membershipDiscount: parseFloat(
              (
                mber.discountedPrice * (FlatDiscount / 100) +
                mber.membershipDiscount
              ).toFixed(2),
              10
            ),
          };
        });
        setCartItems(CartItem);
        setServiceDetails(ServiceDetail);
        setSelctedMemberShip(MembershipItem);
        setGst(
          (
            ServiceDetail.map((item) => item.servicegstamount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            CartItem.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            MembershipItem.map((item) => item.gst).reduce(
              (prev, curr) => prev + curr,
              0
            )
          ).toFixed(2)
        );
        let total = (
          subtotal -
          totalmembershipDiscount -
          ((subtotal - totalmembershipDiscount) * discountprices) / 100 +
          (ServiceDetail.map((item) => item.servicegstamount).reduce(
            (prev, curr) => prev + curr,
            0
          ) +
            CartItem.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            )) +
          MembershipItem.map((item) => item.gst).reduce(
            (prev, curr) => prev + curr,
            0
          )
        ).toFixed(2);
        setTotalAmount(total);
        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
        getUserWallet(customer, total);
      }
      setError(errors);
    } else {
      if (
        discountprices >
        (gstOn && gstType === "Inclusive"
          ? TotalAmount
          : subtotal - totalmembershipDiscount)
      ) {
        errors["discount"] = "* Enter valid input";
      } else {
        setDiscountprice(discountprices);
        setShowDiscount(discountprices);
        setDiscount(!discount);
        let FlatDiscount;
        if (gstOn && gstType === "Inclusive") {
          FlatDiscount = (100 * discountprices) / TotalAmount;
        } else {
          FlatDiscount =
            (100 * discountprices) / (subtotal - totalmembershipDiscount);
        }

        const ServiceDetail = serviceDetails?.map((serv) => {
          if (serv.serviceflatdiscountedprice === 0) {
            return serv;
          } else {
            return {
              ...serv,
              categoryName: serv.categoryName,
              categoryId: serv.categoryId,
              colour: serv.colour,
              key: serv.key,
              serviceId: serv.serviceId,
              membershipDiscount: serv.membershipDiscount,
              servicediscount: parseFloat(
                (
                  serv.servicediscount +
                  ((serv.servicediscountedprice - serv.membershipDiscount) *
                    FlatDiscount) /
                    100
                ).toFixed(2),
                10
              ),
              servicediscountedprice: serv.servicediscountedprice,
              serviceflatdiscountedprice: parseFloat(
                (
                  serv.serviceflatdiscountedprice -
                  ((serv.servicediscountedprice - serv.membershipDiscount) *
                    FlatDiscount) /
                    100
                ).toFixed(2),
                10
              ),
              servicegst: serv.servicegst,
              servicegstamount: parseFloat(
                (
                  ((serv.serviceflatdiscountedprice -
                    (serv.serviceflatdiscountedprice * FlatDiscount) / 100) *
                    serv.servicegst) /
                  100
                ).toFixed(2),
                10
              ),
              servicename: serv.servicename,
              servicerate: serv.servicerate,
              servicesubtotal: parseFloat(
                (
                  serv.serviceflatdiscountedprice -
                  ((serv.servicediscountedprice - serv.membershipDiscount) *
                    FlatDiscount) /
                    100 +
                  ((serv.serviceflatdiscountedprice -
                    (serv.serviceflatdiscountedprice * FlatDiscount) / 100) *
                    serv.servicegst) /
                    100
                ).toFixed(2),
                10
              ),
              staff: serv?.staff?.map((one) => {
                return {
                  ...one,
                  workRatio:
                    ((serv.serviceflatdiscountedprice -
                      ((serv.servicediscountedprice - serv.membershipDiscount) *
                        FlatDiscount) /
                        100) *
                      one?.workRationPercentage) /
                    100,
                };
              }),
            };
          }
        });
        const CartItem = cartItems?.map((prod) => {
          return {
            ...prod,
            discountedPrice: prod.discountedPrice,
            discountedPriceGstAmount: parseFloat(
              (
                ((prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount *
                  prod.productgst) /
                100
              ).toFixed(2),
              10
            ),
            discountedPriceWithGstAmount: parseFloat(
              (
                (prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount +
                ((prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount *
                  prod.productgst) /
                  100
              ).toFixed(2),
              10
            ),
            discountedSubTotal: prod.discountedSubTotal,
            flatdiscountedSubTotal: parseFloat(
              (
                (prod.discountedPrice -
                  (prod.discountedPrice * FlatDiscount) / 100) *
                prod.productCount
              ).toFixed(2),
              10
            ),
            productCount: prod.productCount,
            productDiscount: parseFloat(
              (
                prod.productDiscount +
                ((prod.discountedPrice * FlatDiscount) / 100) *
                  prod.productCount
              ).toFixed(2),
              10
            ),
            productId: prod.productId,
            productName: prod.productName,
            productPrice: prod.productPrice,
            productSubTotal: prod.productSubTotal,
            productUnit: prod.productUnit,
            productgst: prod.productgst,
            productquantity: prod.productquantity,
            totalProductss: prod.totalProductss,
            finalproduct: prod.finalproduct,
          };
        });

        const MembershipItem = selctedMemberShip.map((mber) => {
          return {
            ...mber,
            discountedPrice: mber.discountedPrice,
            gst: gstOn
              ? parseFloat(
                  (
                    ((mber.discountedPrice -
                      mber.discountedPrice * (FlatDiscount / 100)) *
                      mber.gstPercentage) /
                    100
                  ).toFixed(2),
                  10
                )
              : 0,
            membershipDiscount: parseFloat(
              (
                mber.discountedPrice * (FlatDiscount / 100) +
                mber.membershipDiscount
              ).toFixed(2),
              10
            ),
            flatdiscountedPrice: parseFloat(
              (
                mber.discountedPrice -
                mber.discountedPrice * (FlatDiscount / 100)
              ).toFixed(2),
              10
            ),
          };
        });
        setCartItems(CartItem);
        setServiceDetails(ServiceDetail);
        setSelctedMemberShip(MembershipItem);
        setGst(
          (
            ServiceDetail.map((item) => item.servicegstamount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            CartItem.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            MembershipItem.map((item) => item.gst).reduce(
              (prev, curr) => prev + curr,
              0
            )
          ).toFixed(2)
        );
        let total = (
          ServiceDetail.map((item) => item.servicesubtotal).reduce(
            (prev, curr) => prev + curr,
            0
          ) +
          CartItem.map((item) => item.discountedPriceWithGstAmount).reduce(
            (prev, curr) => prev + curr,
            0
          ) +
          MembershipItem.map(
            (item) => item.flatdiscountedPrice + item.gst
          ).reduce((prev, curr) => prev + curr, 0)
        ).toFixed(0);
        setTotalAmount(total);
        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
        getUserWallet(customer, total);
      }
      setError(errors);
    }
  };

  const changeSmsCheckbox = (e) => {
    setSmsCheckbox(!smsCheckbox);
  };

  const DiscountTypeSelect = (e, data) => {
    setDiscountType(data);
    setSubDiscoutMenu(!subDiscoutMenu);
  };
  const getAllCustomer = async (e) => {

    // setProductDropdown(!productDropdown);
    setSearch();
    try {
      setLoading(true);
      let res = await ApiGet("customer/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setAllCompanyCustomer(res.data.data);
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Categories", err);
    }
  };

  const handleCustomerSearch = async (e) => {
    setSearch(e.target.value);
    var serviceData =
      allCompanyCustomer?.length > 0 &&
      allCompanyCustomer?.filter(
        (obj) =>
          (obj.firstName &&
            obj.firstName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.lastName &&
            obj.lastName
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (obj.mobileNumber &&
            obj.mobileNumber
              .toLowerCase()
              .includes(e.target.value.toLowerCase()))
      );
    if (e.target.value === "") {
      setAllCustomer("");
    } else {
      setAllCustomer(serviceData);
    }
  };

  const ValidationMsg = () => {
    setSuccess(true);
    setEr("Error");
    setToastmsg("Out of stock");
  };

  const onAdd = (product) => {
    setProductt(product);
    const exist = cartItems?.find((x) => x.productId === product.productId);
    if (exist) {
      if (gstType === "Inclusive") {
        setCartItems(
          cartItems?.map((x) =>
            x.productId === product.productId
              ? {
                  ...exist,
                  productCount: exist.productCount + 1,
                  productSubTotal: exist.productSubTotal + exist.productPrice,
                  flatdiscountedSubTotal: parseFloat(
                    (exist.discountedPrice * (exist.productCount + 1)).toFixed(
                      2
                    ),
                    10
                  ),
                  discountedSubTotal: parseFloat(
                    (exist.discountedPrice * (exist.productCount + 1)).toFixed(
                      2
                    ),
                    10
                  ),
                  productDiscount:
                    exist.productDiscount +
                    parseFloat(
                      (
                        (parseFloat(
                          (
                            (product.productPrice * 1) /
                            (1 + product.productgst / 100)
                          ).toFixed(2),
                          10
                        ) *
                          ((product.productDiscount * 100) /
                            product.productPrice)) /
                        100
                      ).toFixed(2),
                      10
                    ),
                  discountedPriceGstAmount: parseFloat(
                    (
                      (exist.discountedPrice *
                        (exist.productCount + 1) *
                        exist.productgst) /
                      100
                    ).toFixed(2),
                    10
                  ),
                  discountedPriceWithGstAmount:
                    exist.discountedPrice * (exist.productCount + 1) +
                    parseFloat(
                      (
                        (exist.discountedPrice *
                          (exist.productCount + 1) *
                          exist.productgst) /
                        100
                      ).toFixed(2),
                      10
                    ),
                  total: exist.total,
                  totalProductss: exist.total
                    ? exist.total
                    : exist.totalProductss,
                  finalproduct: exist.finalproduct + 1,
                }
              : x
          )
        );
      } else {
        setCartItems(
          cartItems?.map((x) =>
            x.productId === product.productId
              ? {
                  ...exist,
                  productCount: exist.productCount + 1,
                  productSubTotal:
                    exist.productPrice * (exist.productCount + 1),
                  flatdiscountedSubTotal:
                    exist.discountedPrice * (exist.productCount + 1),
                  discountedSubTotal:
                    exist.discountedPrice * (exist.productCount + 1),
                  productDiscount:
                    (exist.productPrice - exist.discountedPrice) *
                    (exist.productCount + 1),
                  discountedPriceGstAmount:
                    (exist.discountedPrice *
                      (exist.productCount + 1) *
                      exist.productgst) /
                    100,
                  discountedPriceWithGstAmount:
                    exist.discountedPrice * (exist.productCount + 1) +
                    (exist.discountedPrice *
                      (exist.productCount + 1) *
                      exist.productgst) /
                      100,
                  total: exist.total,
                  totalProductss: exist.total
                    ? exist.total
                    : exist.totalProductss,
                  finalproduct: exist.finalproduct + 1,
                }
              : x
          )
        );
      }
    } else {
      if (gstType === "Inclusive") {
        setCartItems([
          ...cartItems,
          {
            ...product,
            productDiscount: parseFloat(
              (
                (parseFloat(
                  (
                    (product.productPrice * 1) /
                    (1 + product.productgst / 100)
                  ).toFixed(2),
                  10
                ) *
                  ((product.productDiscount * 100) / product.productPrice)) /
                100
              ).toFixed(2),
              10
            ),
            discountedPrice: parseFloat(
              (
                (product.discountedPrice * 1) /
                (1 + product.productgst / 100)
              ).toFixed(2),
              10
            ),
            productPrice: parseFloat(
              (
                (product.productPrice * 1) /
                (1 + product.productgst / 100)
              ).toFixed(2),
              10
            ),
            productCount: 1,
            productSubTotal: parseFloat(
              (
                (product.productPrice * 1) /
                (1 + product.productgst / 100)
              ).toFixed(2),
              10
            ),
            discountedSubTotal: parseFloat(
              (
                (product.discountedPrice * 1) /
                (1 + product.productgst / 100)
              ).toFixed(2),
              10
            ),
            discountedPriceGstAmount: parseFloat(
              (
                product.discountedPrice * 1 -
                (product.discountedPrice * 1) / (1 + product.productgst / 100)
              ).toFixed(2),
              10
            ),
            discountedPriceWithGstAmount: product.discountedPrice * 1,
            finalproduct: 1,
            totalProductss: product.total,
            total: product.total,
            flatdiscountedSubTotal: parseFloat(
              (
                (product.discountedPrice * 1) /
                (1 + product.productgst / 100)
              ).toFixed(2),
              10
            ),
          },
        ]);
      } else {
        setCartItems([
          ...cartItems,
          {
            ...product,
            productCount: 1,
            productSubTotal: product.productPrice * 1,
            discountedSubTotal: product.discountedPrice * 1,
            productDiscount: product.productDiscount * 1,
            discountedPriceGstAmount: product.discountedPriceGstAmount,
            discountedPriceWithGstAmount: product.discountedPriceWithGstAmount,
            finalproduct: 1,
            totalProductss: product.total,
            total: product.total,
          },
        ]);
      }
    }
  };

  const onRemove = (product) => {
    const exist = cartItems?.find((x) => x.productId === product.productId);
    if (exist.productCount === 1) {
      setCartItems(cartItems?.filter((x) => x.productId !== product.productId));
    } else {
      if (gstType === "Inclusive") {
        setCartItems(
          cartItems?.map((x) =>
            x.productId === product.productId
              ? {
                  ...exist,
                  productCount: exist.productCount - 1,
                  productSubTotal: exist.productSubTotal - exist.productPrice,
                  discountedSubTotal: parseFloat(
                    (
                      exist.flatdiscountedSubTotal -
                      parseFloat(exist.discountedPrice)
                    ).toFixed(2),
                    10
                  ),
                  flatdiscountedSubTotal: parseFloat(
                    (
                      exist.flatdiscountedSubTotal -
                      parseFloat(exist.discountedPrice)
                    ).toFixed(2),
                    10
                  ),
                  productDiscount: parseFloat(
                    (
                      exist.productSubTotal -
                      exist.productPrice -
                      exist.discountedPrice * (exist.productCount - 1)
                    ).toFixed(2),
                    10
                  ),
                  discountedPriceGstAmount: parseFloat(
                    (
                      (parseFloat(
                        (
                          exist.flatdiscountedSubTotal -
                          parseFloat(exist.discountedPrice)
                        ).toFixed(2),
                        10
                      ) *
                        exist.productgst) /
                      100
                    ).toFixed(2),
                    10
                  ),
                  discountedPriceWithGstAmount:
                    parseFloat(
                      (
                        (parseFloat(
                          (
                            exist.flatdiscountedSubTotal -
                            parseFloat(exist.discountedPrice)
                          ).toFixed(2),
                          10
                        ) *
                          exist.productgst) /
                        100
                      ).toFixed(2),
                      10
                    ) +
                    parseFloat(
                      (
                        exist.flatdiscountedSubTotal -
                        parseFloat(exist.discountedPrice)
                      ).toFixed(2),
                      10
                    ),
                  totalProductss: exist.total
                    ? exist.total
                    : exist.productCountss,
                  finalproduct: exist.finalproduct - 1,
                }
              : x
          )
        );
      } else {
        setCartItems(
          cartItems?.map((x) =>
            x.productId === product.productId
              ? {
                  ...exist,
                  productCount: exist.productCount - 1,
                  productSubTotal: exist.productSubTotal - exist.productPrice,
                  discountedSubTotal:
                    exist.discountedSubTotal - exist.discountedPrice,
                  flatdiscountedSubTotal:
                    exist.flatdiscountedSubTotal - exist.discountedPrice,
                  productDiscount:
                    (exist.productPrice - exist.discountedPrice) *
                    (exist.productCount - 1),
                  discountedPriceGstAmount:
                    ((exist.discountedSubTotal - exist.discountedPrice) *
                      exist.productgst) /
                    100,
                  discountedPriceWithGstAmount:
                    exist.discountedPrice * (exist.productCount - 1) +
                    (exist.discountedPrice *
                      (exist.productCount - 1) *
                      exist.productgst) /
                      100,
                  totalProductss: exist.total
                    ? exist.total
                    : exist.productCountss,
                  finalproduct: exist.finalproduct - 1,
                }
              : x
          )
        );
      }
    }
  };

  const onEditAdd = (product) => {
    const exist = product;
    const existes = editProductDatasss;
    if (exist) {
      if (gstType === "Inclusive") {
        setEditProductDatasss({
          ...existes,
          productCount: existes?.productCount + 1,
        });
        setEditProductData({
          ...exist,
          productCount: exist.productCount + 1,
          productSubTotal: exist.productSubTotal + exist.productPrice,
          flatdiscountedSubTotal: parseFloat(
            (exist.discountedPrice * (exist.productCount + 1)).toFixed(2),
            10
          ),
          discountedSubTotal: parseFloat(
            (exist.discountedPrice * (exist.productCount + 1)).toFixed(2),
            10
          ),
          productDiscount:
            exist.productDiscount +
            parseFloat(
              (
                (parseFloat(
                  (
                    (product.productPrice * 1) /
                    (1 + product.productgst / 100)
                  ).toFixed(2),
                  10
                ) *
                  ((product.productDiscount * 100) / product.productPrice)) /
                100
              ).toFixed(2),
              10
            ),
          discountedPriceGstAmount: parseFloat(
            (
              (exist.discountedPrice *
                (exist.productCount + 1) *
                exist.productgst) /
              100
            ).toFixed(2),
            10
          ),
          discountedPriceWithGstAmount:
            exist.discountedPrice * (exist.productCount + 1) +
            parseFloat(
              (
                (exist.discountedPrice *
                  (exist.productCount + 1) *
                  exist.productgst) /
                100
              ).toFixed(2),
              10
            ),
          total: exist.total,
          totalProductss: exist.total ? exist.total : exist.totalProductss,
          finalproduct: exist.finalproduct + 1,
        });
      } else {
        setEditProductDatasss({
          ...existes,
          productCount: existes?.productCount + 1,
        });
        setEditProductData({
          ...exist,
          productCount: exist.productCount + 1,
          productSubTotal: exist.productSubTotal + exist.productPrice,
          flatdiscountedSubTotal:
            exist.discountedPrice * (exist.productCount + 1),
          discountedSubTotal: exist.discountedPrice * (exist.productCount + 1),
          productDiscount:
            (exist.productPrice - exist.discountedPrice) *
            (exist.productCount + 1),
          discountedPriceGstAmount:
            (exist.discountedPrice *
              (exist.productCount + 1) *
              exist.productgst) /
            100,
          discountedPriceWithGstAmount:
            exist.discountedPrice * (exist.productCount + 1) +
            (exist.discountedPrice *
              (exist.productCount + 1) *
              exist.productgst) /
              100,
          finalproduct: exist?.finalproduct + 1,
        });
      }
    }
  };

  const onEditRemove = (product) => {
    const exist = product;
    const existes = editProductDatasss;
    if (exist.productCount === 1) {
      setEditProductData(product);
    } else {
      if (gstType === "Inclusive") {
        setEditProductDatasss({
          ...existes,
          productCount: existes?.productCount - 1,
        });
        setEditProductData({
          ...exist,
          productCount: exist.productCount - 1,
          productSubTotal: exist.productSubTotal - exist.productPrice,
          discountedSubTotal: parseFloat(
            (
              exist.flatdiscountedSubTotal - parseFloat(exist.discountedPrice)
            ).toFixed(2),
            10
          ),
          flatdiscountedSubTotal: parseFloat(
            (
              exist.flatdiscountedSubTotal - parseFloat(exist.discountedPrice)
            ).toFixed(2),
            10
          ),
          productDiscount: parseFloat(
            (
              exist.productSubTotal -
              exist.productPrice -
              exist.discountedPrice * (exist.productCount - 1)
            ).toFixed(2),
            10
          ),
          discountedPriceGstAmount: parseFloat(
            (
              (parseFloat(
                (
                  exist.flatdiscountedSubTotal -
                  parseFloat(exist.discountedPrice)
                ).toFixed(2),
                10
              ) *
                exist.productgst) /
              100
            ).toFixed(2),
            10
          ),
          discountedPriceWithGstAmount:
            exist.discountedPrice * (exist.productCount - 1) +
            parseFloat(
              (
                (parseFloat(
                  (
                    exist.flatdiscountedSubTotal -
                    parseFloat(exist.discountedPrice)
                  ).toFixed(2),
                  10
                ) *
                  exist.productgst) /
                100
              ).toFixed(2),
              10
            ),
          totalProductss: exist.total ? exist.total : exist.productCountss,
          finalproduct: exist.finalproduct - 1,
        });
      } else {
        setEditProductDatasss({
          ...existes,
          productCount: existes?.productCount - 1,
        });
        setEditProductData({
          ...exist,
          productCount: exist.productCount - 1,
          flatdiscountedSubTotal:
            exist.discountedSubTotal - exist.discountedPrice,
          productSubTotal: exist.productSubTotal - exist.productPrice,
          discountedSubTotal: exist.discountedSubTotal - exist.discountedPrice,
          productDiscount:
            (exist.productPrice - exist.discountedPrice) *
            (exist.productCount - 1),
          discountedPriceGstAmount:
            ((exist.discountedSubTotal - exist.discountedPrice) *
              exist.productgst) /
            100,
          discountedPriceWithGstAmount:
            exist.discountedPrice * (exist.productCount - 1) +
            (exist.discountedPrice *
              (exist.productCount - 1) *
              exist.productgst) /
              100,
          finalproduct: exist?.finalproduct - 1,
        });
      }
    }
  };
  const clearCart = () => {
    setCartItems([]);
  };

  const getmembership = (data) => {
    setMembershipId(data._id);
    getAllStaff();
    const ExpiresOn = new Date();
    ExpiresOn.setDate(ExpiresOn.getDate() + data.days);
    if (SettingInfo?.multipleStaff?.assignStaffForMembership) {
      setMemberStaffData(false);
    } else {
      setInvoiceDetail(false);
      setAddProduct(true);
      setAddMemberShip(true);
      setAddServices(false);
      setSelectService(false);
      setMemberStaffData(true);
    }
    const newData = {
      ...data,
      gst: gstOn
        ? gstType === "Inclusive" && parseInt(data.gst, 10) > 0
          ? parseFloat(
              (
                parseInt(data.price, 10) -
                parseInt(data.price, 10) / (1 + 18 / 100)
              ).toFixed(2),
              10
            )
          : parseInt(data.gst, 10)
        : 0,
      gstPercentage: gstOn ? (data.gst > 0 ? 18 : 0) : 0,
      price: gstOn
        ? gstType === "Inclusive" && parseInt(data.gst, 10) > 0
          ? parseFloat(
              (parseInt(data.price, 10) / (1 + 18 / 100)).toFixed(2),
              10
            )
          : parseInt(data.price, 10)
        : parseInt(data.price, 10),
      membershipDiscount: 0,
      discountedPrice: gstOn
        ? gstType === "Inclusive" && parseInt(data.gst, 10) > 0
          ? parseFloat(
              (parseInt(data.price, 10) / (1 + 18 / 100)).toFixed(2),
              10
            )
          : parseInt(data.price, 10)
        : parseInt(data.price, 10),
      flatdiscountedPrice: gstOn
        ? gstType === "Inclusive" && parseInt(data.gst, 10) > 0
          ? parseFloat(
              (parseInt(data.price, 10) / (1 + 18 / 100)).toFixed(2),
              10
            )
          : parseInt(data.price, 10)
        : parseInt(data.price, 10),
      expiresOn: ExpiresOn,
      purchaseDate: new Date(),
    };
    setGstmembershipData(newData);
    setSelctedMemberShip([...selctedMemberShip, newData]);
    let memberShip = [...selctedMemberShip, newData];
    // let member = customer?.selectMembership.filter((resp)=>resp?.isExpire === false && resp?.validFor === "Limited")
    // let limitedZero = member.filter((data)=>data.availService > 0)
    // if(limitedZero.length > 0){
    if ([...selctedMemberShip, newData].length > 0) {
      const MembershipServices = serviceDetails
        .map((items) => {
          return [...selctedMemberShip, newData][0]?.selectedServices?.filter(
            (item) => item._id === items.serviceId
          );
        })
        .flat();

      setAvailService(MembershipServices);
    }

    if (
      customer?.membership === false &&
      sameInvoice &&
      memberShip.length > 0
    ) {
      setMembershipHide(true);

      const membershipDetail = memberShip?.filter(
        (resp) => resp?.isExpire === false
      );
      let avail;
      if (membershipDetail[0]?.validFor === "Unlimited") {
        avail = null;
      } else {
        avail = membershipDetail[0]?.remainingService;
      }
      let StartTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.startTime
      )._d;
      let EndTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.endTime
      )._d;
      let currentTime = new Date();
      let dataReplace = true;
      if (data === undefined && defaults) {
        let dayInNumber = moment(new Date()).day();
        let day;
        if (dayInNumber === 1) {
          day = "Monday";
        } else if (dayInNumber === 2) {
          day = "Tuesday";
        } else if (dayInNumber === 3) {
          day = "Wednesday";
        } else if (dayInNumber === 4) {
          day = "Thursday";
        } else if (dayInNumber === 5) {
          day = "Friday";
        } else if (dayInNumber === 6) {
          day = "Saturday";
        } else if (dayInNumber === 0) {
          day = "Sunday";
        }
        if (membershipDetail[0]?.activeDays.includes(day)) {
        } else {
          dataReplace = false;
          setAccept(true);
        }
        if (currentTime > StartTime && currentTime < EndTime) {
        } else {
          dataReplace = false;
          setAccept(true);
        }
      }
      if (dataReplace) {
        setRemoveCusData(serviceDetails);
        let replaced = 0;
        let active = membershipDetail[0]?.selectedServices.filter(
          (data) => data.isChecked === true
        );
        var respo = serviceDetails.map((obj) => {
          let replacedata = active?.find((o) => o?._id === obj?.serviceId);
          if (active?.find((o) => o._id === obj.serviceId)) {
            if (replaced >= avail && avail !== null) {
              return {
                ...obj,
                servicediscount: obj.servicerate - obj.servicediscountedprice,
                serviceflatdiscountedprice: obj.servicediscountedprice,
                servicegstamount:
                  (obj.servicediscountedprice * obj.servicegst) / 100,
                servicesubtotal:
                  obj.servicediscountedprice +
                  (obj.servicediscountedprice * obj.servicegst) / 100,
              };
            } else {
              replaced = replaced + 1;
              return {
                ...obj,
                colour: replacedata.colour,
                serviceId: replacedata._id,
                servicediscount: 0,
                servicediscountedprice: obj.servicerate,
                serviceflatdiscountedprice:
                  obj.servicerate -
                  parseFloat(
                    (
                      (obj.servicerate * replacedata.percentageDiscount) /
                      100
                    ).toFixed(2)
                  ),
                staff: obj?.staff?.map((one) => {
                  return {
                    ...one,
                    workRatio: parseFloat(
                      (
                        ((obj.servicerate -
                          parseFloat(
                            (
                              (obj.servicerate *
                                replacedata.percentageDiscount) /
                              100
                            ).toFixed(2)
                          )) *
                          one?.workRationPercentage) /
                        100
                      ).toFixed(2),
                      10
                    ),
                  };
                }),
                servicegstamount: parseFloat(
                  (
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                    100
                  ).toFixed(2)
                ),
                membershipDiscount: parseFloat(
                  (
                    (obj.servicerate * replacedata.percentageDiscount) /
                    100
                  ).toFixed(2)
                ),
                servicename: replacedata.serviceName,
                servicerate: obj.servicerate,
                servicesubtotal: parseFloat(
                  (
                    obj.servicerate -
                    parseFloat(
                      (
                        (obj.servicerate * replacedata.percentageDiscount) /
                        100
                      ).toFixed(2)
                    ) +
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                      100
                  ).toFixed(0)
                ),
              };
            }
          } else {
            return {
              ...obj,
              servicediscount: obj.servicerate - obj.servicediscountedprice,
              serviceflatdiscountedprice: obj.servicediscountedprice,
              servicegstamount:
                (obj.servicediscountedprice * obj.servicegst) / 100,
              servicesubtotal:
                obj.servicediscountedprice +
                (obj.servicediscountedprice * obj.servicegst) / 100,
            };
          }
        });
        let CartItm = cartItems?.map((prod) => {
          return {
            ...prod,
            discountedPrice: prod.discountedPrice,
            discountedPriceGstAmount:
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedPriceWithGstAmount:
              prod.discountedSubTotal +
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedSubTotal: prod.discountedSubTotal,
            finalproduct: prod.finalproduct,
            flatdiscountedSubTotal: prod.discountedSubTotal,
            productCount: prod.productCount,
            productDiscount:
              (prod.productPrice - prod.discountedPrice) * prod.productCount,
            productId: prod.productId,
            productName: prod.productName,
            productPrice: prod.productPrice,
            productSubTotal: prod.productSubTotal,
            productUnit: prod.productUnit,
            productgst: prod.productgst,
            productquantity: prod.productquantity,
            totalProductss: prod.totalProductss,
          };
        });
        setCartItems(CartItm);
        setShowDiscount(0);
        setServiceDetails(respo);
        setSubtotal(
          respo
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedSubTotal).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            memberShip
              .map((item) => item.price)
              .reduce((prev, curr) => prev + curr, 0)
        );
        setGst(
          respo
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            memberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0)
        );
        let total = (
          (showDiscount
            ? respo
                .map((item) => item.serviceflatdiscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              )
            : respo
                .map((item) => item.serviceflatdiscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              )) +
          (respo
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            memberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0) +
            memberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0))
        ).toFixed(2);

        setTotalAmount(total);
        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
        getUserWallet(customer, total);
      }
    } else {
      setSubtotal(
        serviceDetails
          .map((item) => item.servicediscountedprice)
          .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.price)
            .reduce((prev, curr) => prev + curr, 0) +
          memberShip[0].price
      );

      if (gstOn || (gstOn && serviceTax)) {
        setGst(
          (
            serviceDetails
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0) +
            memberShip[0].gst
          ).toFixed(2)
        );
      }
      let total;

      if (gstOn) {
        total = (
          showDiscount
            ? serviceDetails
                .map((item) => item.servicesubtotal)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceWithGstAmount)
                .reduce((prev, curr) => prev + curr, 0) +
              selctedMemberShip
                .map((item) => item.price)
                .reduce((prev, curr) => prev + curr, 0) +
              memberShip[0].price
            : serviceDetails
                .map((item) => item.servicediscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0) +
              (serviceDetails
                .map((item) => item.servicegstamount)
                .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedPriceGstAmount)
                  .reduce((prev, curr) => prev + curr, 0)) +
              selctedMemberShip
                .map((item) => item.price)
                .reduce((prev, curr) => prev + curr, 0) +
              memberShip[0].price +
              memberShip[0].gst
        ).toFixed(2);
      } else {
        total = (
          showDiscount
            ? serviceDetails
                .map((item) => item.servicesubtotal)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceWithGstAmount)
                .reduce((prev, curr) => prev + curr, 0) +
              selctedMemberShip
                .map((item) => item.price)
                .reduce((prev, curr) => prev + curr, 0) +
              memberShip[0].price
            : serviceDetails
                .map((item) => item.servicediscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0) +
              (serviceDetails
                .map((item) => item.servicegstamount)
                .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedPriceGstAmount)
                  .reduce((prev, curr) => prev + curr, 0)) +
              selctedMemberShip
                .map((item) => item.price)
                .reduce((prev, curr) => prev + curr, 0) +
              memberShip[0].price
        ).toFixed(2);
      }
      setTotalAmount(total);
      setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
      getUserWallet(customer, total);
    }
  };

  const Continue = () => {
    setInvoiceDetail(false);
    setAddProduct(true);
    setAddMemberShip(true);
    setAddServices(false);
    setSelectService(false);

    setSubtotal(
      serviceDetails
        .map((item) => item.servicediscountedprice)
        .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedSubTotal)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.discountedPrice)
          .reduce((prev, curr) => prev + curr, 0)
    );

    setGst(
      (
        serviceDetails
          .map((item) => item.servicegstamount)
          .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedPriceGstAmount)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.gst)
          .reduce((prev, curr) => prev + curr, 0)
      ).toFixed(2)
    );
    let total = (
      showDiscount
        ? serviceDetails
            .map((item) => item.servicesubtotal)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedPriceWithGstAmount)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.discountedPrice)
            .reduce((prev, curr) => prev + curr, 0)
        : serviceDetails
            .map((item) => item.servicesubtotal)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedPriceWithGstAmount)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.discountedPrice)
            .reduce((prev, curr) => prev + curr, 0)
    ).toFixed(2);
    setTotalAmount(total);
    setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
    getUserWallet(customer, total);
  };

  const RequestAccepted = (data) => {
    setAccept(!accept);
    if (data) {
      MembershipApply("RequestAccepted");
      setRequestAccepted("RequestAccepted");
      setDefaults(false);
    } else {
      if (customer?.membership === true) {
        setSelctedMemberShip([]);
        setSubtotal(
          serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.flatdiscountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0)
        );
        setGst(
          (
            serviceDetails
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount
          ).toFixed(2)
        );
        setTotalAmount(
          parseInt(
            (
              (showDiscount
                ? serviceDetails
                    .map((item) => item.servicediscountedprice)
                    .reduce((prev, curr) => prev + curr, 0) +
                  cartItems
                    .map((item) => item.discountedSubTotal)
                    .reduce((prev, curr) => prev + curr, 0) -
                  discountprice
                : serviceDetails
                    .map((item) => item.servicediscountedprice)
                    .reduce((prev, curr) => prev + curr, 0) +
                  cartItems
                    .map((item) => item.discountedSubTotal)
                    .reduce((prev, curr) => prev + curr, 0)) +
              (serviceDetails
                .map((item) => item.servicegstamount)
                .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedPriceGstAmount)
                  .reduce((prev, curr) => prev + curr, 0) -
                showDiscount)
            ).toFixed(2),
            10
          )
        );
      }
      setRequestAccepted("NotAccpted");
    }
  };

  const MembershipApply = (data, value) => {
    //Function use for appply membership Discount

    if (customer?.membership === true || value?.membership === true) {
      if (requestAccepted === "RequestAccepted") {
        setMembershipHide(true);
        let member = customer?.selectMembership.filter(
          (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
        );
        // let limitedZero = member.filter((data)=>data.availService === 0)
        // if(limitedZero.length > 0){
        //   RegularTotal()
        // }else{

        const membershipDetail =
          customer?.selectMembership?.filter(
            (resp) => resp?.isExpire === false
          ) ||
          value?.selectMembership?.filter((resp) => resp?.isExpire === false);

        let avail;
        if (membershipDetail[0]?.validFor === "Unlimited") {
          avail = null;
        } else {
          avail = membershipDetail[0]?.remainingService;
        }
        let active = membershipDetail[0]?.selectedServices.filter(
          (data) => data.isChecked === true
        );
        let StartTime = moment(membershipDetail[0]?.activeHours).add(
          membershipDetail[0]?.activeHours.startTime
        )._d;
        let EndTime = moment(membershipDetail[0]?.activeHours).add(
          membershipDetail[0]?.activeHours.endTime
        )._d;
        let currentTime = new Date();
        let dataReplace = true;
        if (typeof data === "object" && defaults) {
          if (data?.length > 0) {
            let dayInNumber = moment(new Date()).day();
            let day;
            if (dayInNumber === 1) {
              day = "Monday";
            } else if (dayInNumber === 2) {
              day = "Tuesday";
            } else if (dayInNumber === 3) {
              day = "Wednesday";
            } else if (dayInNumber === 4) {
              day = "Thursday";
            } else if (dayInNumber === 5) {
              day = "Friday";
            } else if (dayInNumber === 6) {
              day = "Saturday";
            } else if (dayInNumber === 0) {
              day = "Sunday";
            }
            if (membershipDetail[0]?.activeDays.includes(day)) {
            } else {
              dataReplace = false;
              setAccept(true);
            }
            if (currentTime > StartTime && currentTime < EndTime) {
            } else {
              dataReplace = false;
              setAccept(true);
            }
          } else {
            dataReplace = false;
            setMembershipHide(false);
          }
        }
        if (value?.membership === true && defaults) {
          let dayInNumber = moment(new Date()).day();
          let day;
          if (dayInNumber === 1) {
            day = "Monday";
          } else if (dayInNumber === 2) {
            day = "Tuesday";
          } else if (dayInNumber === 3) {
            day = "Wednesday";
          } else if (dayInNumber === 4) {
            day = "Thursday";
          } else if (dayInNumber === 5) {
            day = "Friday";
          } else if (dayInNumber === 6) {
            day = "Saturday";
          } else if (dayInNumber === 0) {
            day = "Sunday";
          }
          if (membershipDetail[0]?.activeDays.includes(day)) {
          } else {
            dataReplace = false;
            setAccept(true);
          }
          if (currentTime > StartTime && currentTime < EndTime) {
          } else {
            dataReplace = false;
            setAccept(true);
          }
        }

        if (dataReplace) {
          if (data === "RequestAccepted") {
            if (EditStaffforCustomer) {
              setRemoveCusData(EditStaffforCustomer);
            } else {
              setRemoveCusData(serviceDetails);
            }
          }
          let replaced = 0;
          let serviceData = EditStaffforCustomer
            ? EditStaffforCustomer
            : [...serviceDetails];
          var respo = serviceData?.map((obj) => {
            let replacedata = active?.find((o) => o?._id === obj?.serviceId);
            if (active?.find((o) => o?._id === obj?.serviceId)) {
              if (replaced >= avail && avail !== null) {
                return {
                  ...obj,
                  servicediscount: obj.servicerate - obj.servicediscountedprice,
                  serviceflatdiscountedprice: obj.servicediscountedprice,
                  servicegstamount:
                    (obj.servicediscountedprice * obj.servicegst) / 100,
                  servicesubtotal:
                    obj.servicediscountedprice +
                    (obj.servicediscountedprice * obj.servicegst) / 100,
                };
              } else {
                replaced = replaced + 1;
                return {
                  ...obj,
                  colour: replacedata.colour,
                  serviceId: replacedata._id,
                  servicediscount: 0,
                  servicediscountedprice: obj.servicerate,
                  serviceflatdiscountedprice:
                    obj.servicerate -
                    parseFloat(
                      (
                        (obj.servicerate * replacedata.percentageDiscount) /
                        100
                      ).toFixed(2)
                    ),
                  staff: obj?.staff?.map((one) => {
                    return {
                      ...one,
                      workRatio: parseFloat(
                        (
                          ((obj.servicerate -
                            parseFloat(
                              (
                                (obj.servicerate *
                                  replacedata.percentageDiscount) /
                                100
                              ).toFixed(2)
                            )) *
                            one?.workRationPercentage) /
                          100
                        ).toFixed(2),
                        10
                      ),
                    };
                  }),
                  servicegstamount: parseFloat(
                    (
                      ((obj.servicerate -
                        parseFloat(
                          (
                            (obj.servicerate * replacedata.percentageDiscount) /
                            100
                          ).toFixed(2)
                        )) *
                        obj.servicegst) /
                      100
                    ).toFixed(2)
                  ),
                  membershipDiscount: parseFloat(
                    (
                      (obj.servicerate * replacedata.percentageDiscount) /
                      100
                    ).toFixed(2)
                  ),
                  servicename: replacedata.serviceName,
                  servicerate: obj.servicerate,
                  servicesubtotal: parseFloat(
                    (
                      obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      ) +
                      ((obj.servicerate -
                        parseFloat(
                          (
                            (obj.servicerate * replacedata.percentageDiscount) /
                            100
                          ).toFixed(2)
                        )) *
                        obj.servicegst) /
                        100
                    ).toFixed(0)
                  ),
                };
              }
            } else {
              return {
                ...obj,
                servicediscount: obj.servicerate - obj.servicediscountedprice,
                serviceflatdiscountedprice: obj.servicediscountedprice,
                servicegstamount:
                  (obj.servicediscountedprice * obj.servicegst) / 100,
                servicesubtotal:
                  obj.servicediscountedprice +
                  (obj.servicediscountedprice * obj.servicegst) / 100,
              };
            }
          });

          let CartItm = cartItems?.map((prod) => {
            return {
              ...prod,
              discountedPrice: prod.discountedPrice,
              discountedPriceGstAmount:
                (prod.discountedSubTotal * prod.productgst) / 100,
              discountedPriceWithGstAmount:
                prod.discountedSubTotal +
                (prod.discountedSubTotal * prod.productgst) / 100,
              discountedSubTotal: prod.discountedSubTotal,
              finalproduct: prod.finalproduct,
              flatdiscountedSubTotal: prod.discountedSubTotal,
              productCount: prod.productCount,
              productDiscount:
                (prod.productPrice - prod.discountedPrice) * prod.productCount,
              productId: prod.productId,
              productName: prod.productName,
              productPrice: prod.productPrice,
              productSubTotal: prod.productSubTotal,
              productUnit: prod.productUnit,
              productgst: prod.productgst,
              productquantity: prod.productquantity,
              totalProductss: prod.totalProductss,
            };
          });

          setCartItems(CartItm);
          setShowDiscount(0);
          setServiceDetails(respo);
          setSelctedMemberShip([]);
          setSubtotal(
            respo
              .map((item) => item.servicediscountedprice)
              .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              )
          );
          setGst(
            respo
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedPriceGstAmount).reduce(
                (prev, curr) => prev + curr,
                0
              )
          );
          let total = (
            (showDiscount
              ? respo
                  .map((item) => item.serviceflatdiscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                CartItm.map((item) => item.discountedSubTotal).reduce(
                  (prev, curr) => prev + curr,
                  0
                )
              : respo
                  .map((item) => item.serviceflatdiscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                CartItm.map((item) => item.discountedSubTotal).reduce(
                  (prev, curr) => prev + curr,
                  0
                )) +
            (respo
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedPriceGstAmount).reduce(
                (prev, curr) => prev + curr,
                0
              ))
          ).toFixed(2);

          setTotalAmount(total);
          setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
          getUserWallet(customer ? customer : value, total);
        } else {
          RegularTotal(customer ? customer : value);
        }
      } else {
        RegularTotal(customer ? customer : value);
      }
    } else if (
      customer?.membership === false &&
      sameInvoice &&
      selctedMemberShip.length > 0
    ) {
      if (requestAccepted === "RequestAccepted") {
        setMembershipHide(true);

        if (data === "RequestAccepted") {
          if (EditStaffforCustomer) {
            setRemoveCusData(EditStaffforCustomer);
          } else {
            setRemoveCusData(serviceDetails);
          }
        }
        const MembershipServices = serviceDetails
          .map((items) => {
            return selctedMemberShip[0]?.selectedServices?.filter(
              (item) => item._id === items.serviceId
            );
          })
          .flat();
        setAvailService(MembershipServices);

        const membershipDetail = selctedMemberShip?.filter(
          (resp) => resp?.isExpire === false
        );
        let avail;
        if (membershipDetail[0]?.validFor === "Unlimited") {
          avail = null;
        } else {
          avail = membershipDetail[0]?.remainingService;
        }
        let active = membershipDetail[0]?.selectedServices.filter(
          (data) => data.isChecked === true
        );
        let StartTime = moment(membershipDetail[0]?.activeHours).add(
          membershipDetail[0]?.activeHours.startTime
        )._d;
        let EndTime = moment(membershipDetail[0]?.activeHours).add(
          membershipDetail[0]?.activeHours.endTime
        )._d;
        let currentTime = new Date();
        let dataReplace = true;
        if (data === undefined && defaults) {
          let dayInNumber = moment(new Date()).day();
          let day;
          if (dayInNumber === 1) {
            day = "Monday";
          } else if (dayInNumber === 2) {
            day = "Tuesday";
          } else if (dayInNumber === 3) {
            day = "Wednesday";
          } else if (dayInNumber === 4) {
            day = "Thursday";
          } else if (dayInNumber === 5) {
            day = "Friday";
          } else if (dayInNumber === 6) {
            day = "Saturday";
          } else if (dayInNumber === 0) {
            day = "Sunday";
          }
          if (membershipDetail[0]?.activeDays.includes(day)) {
          } else {
            dataReplace = false;
            setAccept(true);
          }
          if (currentTime > StartTime && currentTime < EndTime) {
          } else {
            dataReplace = false;
            setAccept(true);
          }
        }
        if (dataReplace) {
          let replaced = 0;
          let serviceData = EditStaffforCustomer
            ? EditStaffforCustomer
            : [...serviceDetails];
          var respo = serviceData?.map((obj) => {
            let replacedata = active?.find((o) => o._id === obj.serviceId);
            if (active?.find((o) => o._id === obj.serviceId)) {
              if (replaced >= avail && avail !== null) {
                return {
                  ...obj,
                  servicediscount: obj.servicerate - obj.servicediscountedprice,
                  serviceflatdiscountedprice: obj.servicediscountedprice,
                  servicegstamount:
                    (obj.servicediscountedprice * obj.servicegst) / 100,
                  servicesubtotal:
                    obj.servicediscountedprice +
                    (obj.servicediscountedprice * obj.servicegst) / 100,
                };
              } else {
                replaced = replaced + 1;
                return {
                  ...obj,
                  colour: replacedata.colour,
                  serviceId: replacedata._id,
                  servicediscount: 0,
                  servicediscountedprice: obj.servicerate,
                  serviceflatdiscountedprice:
                    obj.servicerate -
                    parseFloat(
                      (
                        (obj.servicerate * replacedata.percentageDiscount) /
                        100
                      ).toFixed(2)
                    ),
                  staff: obj?.staff?.map((one) => {
                    return {
                      ...one,
                      workRatio: parseFloat(
                        (
                          ((obj.servicerate -
                            parseFloat(
                              (
                                (obj.servicerate *
                                  replacedata.percentageDiscount) /
                                100
                              ).toFixed(2)
                            )) *
                            one?.workRationPercentage) /
                          100
                        ).toFixed(2),
                        10
                      ),
                    };
                  }),
                  servicegstamount: parseFloat(
                    (
                      ((obj.servicerate -
                        parseFloat(
                          (
                            (obj.servicerate * replacedata.percentageDiscount) /
                            100
                          ).toFixed(2)
                        )) *
                        obj.servicegst) /
                      100
                    ).toFixed(2)
                  ),
                  membershipDiscount: parseFloat(
                    (
                      (obj.servicerate * replacedata.percentageDiscount) /
                      100
                    ).toFixed(2)
                  ),
                  servicename: replacedata.serviceName,
                  servicerate: obj.servicerate,
                  servicesubtotal: parseFloat(
                    (
                      obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      ) +
                      ((obj.servicerate -
                        parseFloat(
                          (
                            (obj.servicerate * replacedata.percentageDiscount) /
                            100
                          ).toFixed(2)
                        )) *
                        obj.servicegst) /
                        100
                    ).toFixed(0)
                  ),
                };
              }
            } else {
              return {
                ...obj,
                servicediscount: obj.servicerate - obj.servicediscountedprice,
                serviceflatdiscountedprice: obj.servicediscountedprice,
                servicegstamount:
                  (obj.servicediscountedprice * obj.servicegst) / 100,
                servicesubtotal:
                  obj.servicediscountedprice +
                  (obj.servicediscountedprice * obj.servicegst) / 100,
              };
            }
          });
          let CartItm = cartItems?.map((prod) => {
            return {
              ...prod,
              discountedPrice: prod.discountedPrice,
              discountedPriceGstAmount:
                (prod.discountedSubTotal * prod.productgst) / 100,
              discountedPriceWithGstAmount:
                prod.discountedSubTotal +
                (prod.discountedSubTotal * prod.productgst) / 100,
              discountedSubTotal: prod.discountedSubTotal,
              finalproduct: prod.finalproduct,
              flatdiscountedSubTotal: prod.discountedSubTotal,
              productCount: prod.productCount,
              productDiscount:
                (prod.productPrice - prod.discountedPrice) * prod.productCount,
              productId: prod.productId,
              productName: prod.productName,
              productPrice: prod.productPrice,
              productSubTotal: prod.productSubTotal,
              productUnit: prod.productUnit,
              productgst: prod.productgst,
              productquantity: prod.productquantity,
              totalProductss: prod.totalProductss,
            };
          });
          setCartItems(CartItm);
          setShowDiscount(0);
          setServiceDetails(respo);
          setSubtotal(
            respo
              .map((item) => item.servicediscountedprice)
              .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              ) +
              selctedMemberShip
                .map((item) => item.price)
                .reduce((prev, curr) => prev + curr, 0)
          );
          setGst(
            respo
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedPriceGstAmount).reduce(
                (prev, curr) => prev + curr,
                0
              ) +
              selctedMemberShip
                .map((item) => item.gst)
                .reduce((prev, curr) => prev + curr, 0)
          );
          let total = (
            (showDiscount
              ? respo
                  .map((item) => item.serviceflatdiscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                CartItm.map((item) => item.discountedSubTotal).reduce(
                  (prev, curr) => prev + curr,
                  0
                )
              : respo
                  .map((item) => item.serviceflatdiscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                CartItm.map((item) => item.discountedSubTotal).reduce(
                  (prev, curr) => prev + curr,
                  0
                )) +
            (respo
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceGstAmount)
                .reduce((prev, curr) => prev + curr, 0) +
              selctedMemberShip
                .map((item) => item.discountedPrice)
                .reduce((prev, curr) => prev + curr, 0) +
              selctedMemberShip
                .map((item) => item.gst)
                .reduce((prev, curr) => prev + curr, 0))
          ).toFixed(2);
          setTotalAmount(total);
          setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
          getUserWallet(customer, total);
        }
      } else {
        RegularTotal(customer ? customer : value);
      }
    } else {
      if (editServiceData) {
      } else {
        RegularTotal(customer ? customer : value);
      }
    }
  };

  const RegularTotal = (data) => {
    // Sub total ,gst and total get updated if new field is not add
    setSubtotal(
      serviceDetails
        .map((item) => item.servicediscountedprice)
        .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.flatdiscountedSubTotal)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.discountedPrice)
          .reduce((prev, curr) => prev + curr, 0)
    );
    setGst(
      (
        serviceDetails
          .map((item) => item.servicegstamount)
          .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedPriceGstAmount)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.gst)
          .reduce((prev, curr) => prev + curr, 0) -
        showDiscount
      ).toFixed(2)
    );
    let total = parseFloat(
      (
        (showDiscount
          ? serviceDetails
              .map((item) => item.servicediscountedprice)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0) -
            discountprice
          : serviceDetails
              .map((item) => item.servicediscountedprice)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0)) +
        (serviceDetails
          .map((item) => item.servicegstamount)
          .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedPriceGstAmount)
            .reduce((prev, curr) => prev + curr, 0) -
          showDiscount) +
        selctedMemberShip
          .map((item) => item.discountedPrice + item.gst)
          .reduce((prev, curr) => prev + curr, 0)
      ).toFixed(2),
      10
    );
    setTotalAmount(total);
    setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
    getUserWallet(data ? data : customer, total);
  };

  const onboardingSelectCustomer = async() => {
    if(allCompanyCustomer?.length > 0){

      dispatch(setOnboardingCurrentTooltip("I11"));
      setChange(true);
      setCustomer(allCompanyCustomer[0]);
    }else{
    if (storeOnboardingTourStatus && storeOnboardingCurrentTooltip === "I10") {
      let values = {
        membership: false,
        selectMembership: [],
        isPromotional: true,
        isActive: true,
        firstName: userInfo?.businessName,
        lastName: "",
        mobileNumber: userInfo?.mobileNumber,
        email: "",
        gender: "",
        birthday: "",
        notes: "",
        companyId: userInfo?.companyId,
        __v: 0,
      };
      let res;
      res = await ApiPost("customer/", values)
      try{
      
      }catch (er) {
       console.log(er)
      }
      dispatch(setOnboardingCurrentTooltip("I11"));
      setChange(true);
      setCustomer(res.data.data);
      setAllCustomer([res.data.data]);
      setSearch("");
    }
    }
  };

  const AddDueAmounttoggle = (data) => {
    setShowAddDue(!showAddDue);
    setCheckCondition(false);
    if (data) {
      setPreviousDue(Math.abs(walletBalance));
      setCollectedAmount(Math.abs(walletBalance) + parseInt(TotalAmount));
      ApiGet(`invoice/partPayment/customer/${customer?._id}`)
        .then((resp) => {
          setDueTransction(resp?.data?.data);
        })
        .catch((er) => {
          console.log(er);
        });
    }
  };

  const userWalletCondition = (data, total) => {

    if (data < 0 && checkCondition) {
      setShowAddDue(!showAddDue);
    }
    if (data > 0) {
      let splitdata;

      if(parseInt(total) > 0){
      if (data > (parseInt(total) >= 0 ? parseInt(total) : TotalAmount)) {
        splitdata = [
          {
            method: "Wallet",
            amount: total ? Math.round(total) : Math.round(TotalAmount),
          },
        ];
        setCollectedAmount(0);
      } else if (data < (parseInt(total) >= 0 ? parseInt(total) : TotalAmount)){
    
        splitdata = [
          { method: "Wallet", amount: data },
          {
            method: paymenttMethod?.[0] ? paymenttMethod?.[0] : payMethod?.[0],
            amount: (total ? Math.round(total) : parseInt(TotalAmount)) - data,
          },
        ];
        setCollectedAmount(
          (total ? Math.round(total) : parseInt(TotalAmount)) - data
        );
      }

      setSplitPayment(splitdata);
      setIsSplit(true);
      setPaymentMethod("Split");
      setPaymentSplitMethod(
        paymenttMethod?.[0] ? paymenttMethod?.[0] : payMethod?.[0]
      );
      }
    }
  };
  
  const getUserWallet = (data, total) => {
    if (editInvoice) {
    } else {
      if (data) {
       
        if (walletBalance) {
          setWalletBalance(walletBalance);
          userWalletCondition(walletBalance, total);
        } else {
          ApiGet(`wallet/user/company/${data?._id}`)
            .then((resp) => {
              setWalletBalance(
                resp?.data.data[resp?.data?.data?.length - 1]?.finalAmount
              );
              userWalletCondition(
                resp?.data.data[resp?.data?.data?.length - 1]?.finalAmount,
                total
              );
            })
            .catch((er) => {
              console.log(er);
            });
        }
      }
  }
  };

  const SelectCustomer = (e, data) => {
    setChange(true);
    setCustomer(data);
    setAllCustomer("");
    setSmsCheckbox(data?.isInvoice)


    setSearch("");
    // let filterData = serviceDetails.map((serv) => {
    //   return availService.map((avail) => {
    //     if (serv?.serviceId === avail?._id) {
    //       return console.log(serv, avail);
    //     }
    //   });
    // });

    setProductDropdown(!productDropdown);
    let member = data?.selectMembership.filter(
      (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
    );
    let member1 = data?.selectMembership.filter(
      (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
    );
    let limitedZero = member.filter((data) => data.availService > 0);
    let limitedZero1 = member1.filter(
      (data) => data.availService === null || data.availService === 0
    );
    let MembershipServices;
    if (limitedZero.length > 0) {
      MembershipServices = serviceDetails
        .map((items) => {
          return data?.selectMembership[0]?.selectedServices?.filter(
            (item) => item._id === items.serviceId
          );
        })
        .flat();

      setAvailService(MembershipServices);
    } else if (limitedZero1.length > 0) {
      MembershipServices = serviceDetails
        .map((items) => {
          return data?.selectMembership[0]?.selectedServices?.filter(
            (item) => item._id === items.serviceId
          );
        })
        .flat();
      setAvailService(MembershipServices);
    } else {
      setAvailService([]);
    }

    if (data.membership === true) {
      setMembershipHide(true);

      const membershipDetail = data?.selectMembership?.filter(
        (resp) => resp?.isExpire === false
      );
      let avail;
      if (membershipDetail[0]?.validFor === "Unlimited") {
        avail = null;
      } else {
        avail = membershipDetail[0]?.remainingService;
      }

      let active = membershipDetail[0]?.selectedServices.filter(
        (data) => data?.isChecked === true
      );

      let member = data?.selectMembership.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
      );
      let limitedZero = member.filter((data) => data.availService === 0);
      let StartTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.startTime
      )._d;
      let EndTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.endTime
      )._d;
      let currentTime = new Date();
      let dataReplace = true;
      let dayInNumber = moment(new Date()).day();
      let day;
      if (dayInNumber === 1) {
        day = "Monday";
      } else if (dayInNumber === 2) {
        day = "Tuesday";
      } else if (dayInNumber === 3) {
        day = "Wednesday";
      } else if (dayInNumber === 4) {
        day = "Thursday";
      } else if (dayInNumber === 5) {
        day = "Friday";
      } else if (dayInNumber === 6) {
        day = "Saturday";
      } else if (dayInNumber === 0) {
        day = "Sunday";
      }
      if (MembershipServices?.length > 0) {
        if (membershipDetail[0]?.activeDays.includes(day)) {
        } else {
          dataReplace = false;
          setAccept(true);
        }
        if (currentTime > StartTime && currentTime < EndTime) {
        } else {
          dataReplace = false;
          setAccept(true);
        }
        if (limitedZero.length > 0) {
          dataReplace = false;
          setSuccess(true);
          setEr("Error");
          setToastmsg("Membership Expire");
        }
      } else {
        dataReplace = false;
        setMembershipHide(false);
        setSelctedMemberShip([]);
      }
      if (dataReplace) {
        setRemoveCusData(serviceDetails);
        let replaced = 0;

        var respo = serviceDetails.map((obj) => {
          let replacedata = active?.find((o) => o._id === obj.serviceId);

          if (active?.find((o) => o._id === obj.serviceId)) {
            if (replaced >= avail && avail !== null) {
              return {
                ...obj,
                servicediscount: obj.servicerate - obj.servicediscountedprice,
                serviceflatdiscountedprice: obj.servicediscountedprice,
                servicegstamount:
                  (obj.servicediscountedprice * obj.servicegst) / 100,
                servicesubtotal:
                  obj.servicediscountedprice +
                  (obj.servicediscountedprice * obj.servicegst) / 100,
              };
            } else {
              replaced = replaced + 1;
              return {
                ...obj,
                colour: replacedata.colour,
                serviceId: replacedata._id,
                servicediscount: 0,
                servicediscountedprice: obj.servicerate,
                serviceflatdiscountedprice:
                  obj.servicerate -
                  parseFloat(
                    (
                      (obj.servicerate * replacedata.percentageDiscount) /
                      100
                    ).toFixed(2)
                  ),
                staff: obj?.staff?.map((one) => {
                  return {
                    ...one,
                    workRatio: parseFloat(
                      (
                        ((obj.servicerate -
                          parseFloat(
                            (
                              (obj.servicerate *
                                replacedata.percentageDiscount) /
                              100
                            ).toFixed(2)
                          )) *
                          one?.workRationPercentage) /
                        100
                      ).toFixed(2),
                      10
                    ),
                  };
                }),
                servicegstamount: parseFloat(
                  (
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                    100
                  ).toFixed(2)
                ),
                membershipDiscount: parseFloat(
                  (
                    (obj.servicerate * replacedata.percentageDiscount) /
                    100
                  ).toFixed(2)
                ),
                servicename: replacedata.serviceName,
                servicerate: obj.servicerate,
                servicesubtotal: parseFloat(
                  (
                    obj.servicerate -
                    parseFloat(
                      (
                        (obj.servicerate * replacedata.percentageDiscount) /
                        100
                      ).toFixed(2)
                    ) +
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                      100
                  ).toFixed(0)
                ),
              };
            }
          } else {
            return {
              ...obj,
              servicediscount: obj.servicerate - obj.servicediscountedprice,
              serviceflatdiscountedprice: obj.servicediscountedprice,
              servicegstamount:
                (obj.servicediscountedprice * obj.servicegst) / 100,
              servicesubtotal:
                obj.servicediscountedprice +
                (obj.servicediscountedprice * obj.servicegst) / 100,
            };
          }
        });
        let CartItm = cartItems?.map((prod) => {
          return {
            ...prod,
            discountedPrice: prod.discountedPrice,
            discountedPriceGstAmount:
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedPriceWithGstAmount:
              prod.discountedSubTotal +
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedSubTotal: prod.discountedSubTotal,
            finalproduct: prod.finalproduct,
            flatdiscountedSubTotal: prod.discountedSubTotal,
            productCount: prod.productCount,
            productDiscount:
              (prod.productPrice - prod.discountedPrice) * prod.productCount,
            productId: prod.productId,
            productName: prod.productName,
            productPrice: prod.productPrice,
            productSubTotal: prod.productSubTotal,
            productUnit: prod.productUnit,
            productgst: prod.productgst,
            productquantity: prod.productquantity,
            totalProductss: prod.totalProductss,
          };
        });
        setCartItems(CartItm);

        setShowDiscount(0);
        setServiceDetails(respo);
        setSelctedMemberShip([]);
        setSubtotal(
          respo
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedSubTotal).reduce(
              (prev, curr) => prev + curr,
              0
            )
        );
        setGst(
          respo
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            )
        );
        let total = (
          (showDiscount
            ? respo
                .map((item) => item.serviceflatdiscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              )
            : respo
                .map((item) => item.serviceflatdiscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              )) +
          (respo
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ))
        ).toFixed(2);
       
        setTotalAmount(total);
        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
        getUserWallet(data, total);
      } else {
        setSubtotal(
          serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.flatdiscountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0)
        );
        setGst(
          (
            serviceDetails
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount
          ).toFixed(2)
        );
        let total = parseFloat(
          (
            (showDiscount
              ? serviceDetails
                  .map((item) => item.servicediscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedSubTotal)
                  .reduce((prev, curr) => prev + curr, 0) -
                discountprice
              : serviceDetails
                  .map((item) => item.servicediscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedSubTotal)
                  .reduce((prev, curr) => prev + curr, 0)) +
            (serviceDetails
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceGstAmount)
                .reduce((prev, curr) => prev + curr, 0) -
              showDiscount)
          ).toFixed(2),
          10
        );
        setTotalAmount(total);

        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
        getUserWallet(data, total);
      }
    } else if (sameInvoice && selctedMemberShip.length > 0) {
      setMembershipHide(true);

      const membershipDetail = selctedMemberShip?.filter(
        (resp) => resp?.isExpire === false
      );
      let avail;
      if (membershipDetail[0]?.validFor === "Unlimited") {
        avail = null;
      } else {
        avail = membershipDetail[0]?.remainingService;
      }
      let active = membershipDetail[0]?.selectedServices.filter(
        (data) => data.isChecked === true
      );
      let member = data?.selectMembership.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
      );
      let member1 = data?.selectMembership.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
      );
      let limitedZero = member.filter((data) => data.availService === 0);
      let limitedZero1 = member1.filter(
        (data) => data.availService === null || data.availService === 0
      );
      let MembershipServices;
      if (limitedZero.length === 0) {
        MembershipServices = serviceDetails
          .map((items) => {
            return data?.selectMembership[0]?.selectedServices?.filter(
              (item) => item._id === items.serviceId
            );
          })
          .flat();

        setAvailService(MembershipServices);
      } else if (limitedZero1.length > 0) {
        MembershipServices = serviceDetails
          .map((items) => {
            return data?.selectMembership[0]?.selectedServices?.filter(
              (item) => item._id === items.serviceId
            );
          })
          .flat();
        setAvailService(MembershipServices);
      } else {
        setAvailService([]);
      }

      let StartTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.startTime
      )._d;
      let EndTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.endTime
      )._d;
      let currentTime = new Date();
      let dataReplace = true;
      let dayInNumber = moment(new Date()).day();
      let day;
      if (dayInNumber === 1) {
        day = "Monday";
      } else if (dayInNumber === 2) {
        day = "Tuesday";
      } else if (dayInNumber === 3) {
        day = "Wednesday";
      } else if (dayInNumber === 4) {
        day = "Thursday";
      } else if (dayInNumber === 5) {
        day = "Friday";
      } else if (dayInNumber === 6) {
        day = "Saturday";
      } else if (dayInNumber === 0) {
        day = "Sunday";
      }

      if (MembershipServices?.length > 0) {
        if (membershipDetail[0]?.activeDays.includes(day)) {
        } else {
          dataReplace = false;
          setAccept(true);
        }
        if (currentTime > StartTime && currentTime < EndTime) {
        } else {
          dataReplace = false;
          setAccept(true);
        }
        if (limitedZero.length > 0) {
          dataReplace = false;
          setSuccess(true);
          setEr("Error");
          setToastmsg("Membership Expire");
        }
      } else {
        dataReplace = false;
        setMembershipHide(false);
      }
      if (dataReplace) {
        setRemoveCusData(serviceDetails);
        let replaced = 0;
        var respo = serviceDetails.map((obj) => {
          let replacedata = active?.find((o) => o?._id === obj?.serviceId);
          if (active?.find((o) => o._id === obj.serviceId)) {
            if (replaced >= avail && avail !== null) {
              return {
                ...obj,
                servicediscount: obj.servicerate - obj.servicediscountedprice,
                serviceflatdiscountedprice: obj.servicediscountedprice,
                servicegstamount:
                  (obj.servicediscountedprice * obj.servicegst) / 100,
                servicesubtotal:
                  obj.servicediscountedprice +
                  (obj.servicediscountedprice * obj.servicegst) / 100,
              };
            } else {
              replaced = replaced + 1;
              return {
                ...obj,
                colour: replacedata.colour,
                serviceId: replacedata._id,
                servicediscount: 0,
                servicediscountedprice: obj.servicerate,
                serviceflatdiscountedprice:
                  obj.servicerate -
                  parseFloat(
                    (
                      (obj.servicerate * replacedata.percentageDiscount) /
                      100
                    ).toFixed(2)
                  ),
                staff: obj?.staff?.map((one) => {
                  return {
                    ...one,
                    workRatio: parseFloat(
                      (
                        ((obj.servicerate -
                          parseFloat(
                            (
                              (obj.servicerate *
                                replacedata.percentageDiscount) /
                              100
                            ).toFixed(2)
                          )) *
                          one?.workRationPercentage) /
                        100
                      ).toFixed(2),
                      10
                    ),
                  };
                }),
                servicegstamount: parseFloat(
                  (
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                    100
                  ).toFixed(2)
                ),
                membershipDiscount: parseFloat(
                  (
                    (obj.servicerate * replacedata.percentageDiscount) /
                    100
                  ).toFixed(2)
                ),
                servicename: replacedata.serviceName,
                servicerate: obj.servicerate,
                servicesubtotal: parseFloat(
                  (
                    obj.servicerate -
                    parseFloat(
                      (
                        (obj.servicerate * replacedata.percentageDiscount) /
                        100
                      ).toFixed(2)
                    ) +
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                      100
                  ).toFixed(0)
                ),
              };
            }
          } else {
            return {
              ...obj,
              servicediscount: obj.servicerate - obj.servicediscountedprice,
              serviceflatdiscountedprice: obj.servicediscountedprice,
              servicegstamount:
                (obj.servicediscountedprice * obj.servicegst) / 100,
              servicesubtotal:
                obj.servicediscountedprice +
                (obj.servicediscountedprice * obj.servicegst) / 100,
            };
          }
        });
        let CartItm = cartItems?.map((prod) => {
          return {
            ...prod,
            discountedPrice: prod.discountedPrice,
            discountedPriceGstAmount:
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedPriceWithGstAmount:
              prod.discountedSubTotal +
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedSubTotal: prod.discountedSubTotal,
            finalproduct: prod.finalproduct,
            flatdiscountedSubTotal: prod.discountedSubTotal,
            productCount: prod.productCount,
            productDiscount:
              (prod.productPrice - prod.discountedPrice) * prod.productCount,
            productId: prod.productId,
            productName: prod.productName,
            productPrice: prod.productPrice,
            productSubTotal: prod.productSubTotal,
            productUnit: prod.productUnit,
            productgst: prod.productgst,
            productquantity: prod.productquantity,
            totalProductss: prod.totalProductss,
          };
        });
        setShowDiscount(0);
        setCartItems(CartItm);
        setServiceDetails(respo);
        setSubtotal(
          respo
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedSubTotal).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            selctedMemberShip
              .map((item) => item.price)
              .reduce((prev, curr) => prev + curr, 0)
        );
        setGst(
          respo
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0)
        );

        let total = (
          (showDiscount
            ? respo
                .map((item) => item.serviceflatdiscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              )
            : respo
                .map((item) => item.serviceflatdiscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedSubTotal).reduce(
                (prev, curr) => prev + curr,
                0
              )) +
          (respo
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0))
        ).toFixed(2);

        setTotalAmount(total);
        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
        getUserWallet(data, total);
      }
    } else {
      setCollectedAmount(
        parseInt(TotalAmount) + (previousDue ? previousDue : 0)
      );
      getUserWallet(data, TotalAmount);
    }
  };

  const RemoveCustomer = () => {
    if (!storeOnboardingTourStatus) {
      setCollectedAmount();
      setBalanceAmount();
      setAmount();
      setPreviousDue();
      setDueAmount();
      setCheckCondition(true);
      if (walletBalance > 0) {
        setIsSplit(false);
        setPaymentMethod(paymenttMethod[0]);
        setSplitPayment([]);
      }
      setWalletBalance(0);
      setDueToggle(false);
      setadvanceToggle(false);
      setDueChanges(false);
      setMembershipHide(false);
      setCustomer();
      setDefaults(true);
      setRequestAccepted("RequestAccepted");
      // setServiceDetails(removeCusData);
      if (removeCusData?.length > 0) {
        setServiceDetails(removeCusData);
        setSubtotal(
          removeCusData
            ?.map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.flatdiscountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0)
        );
        setGst(
          (
            removeCusData
              ?.map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount
          ).toFixed(2)
        );
        setTotalAmount(
          parseFloat(
            (
              (showDiscount
                ? removeCusData
                    ?.map((item) => item.servicediscountedprice)
                    .reduce((prev, curr) => prev + curr, 0) +
                  cartItems
                    .map((item) => item.discountedSubTotal)
                    .reduce((prev, curr) => prev + curr, 0) -
                  discountprice
                : removeCusData
                    ?.map((item) => item.servicediscountedprice)
                    .reduce((prev, curr) => prev + curr, 0) +
                  cartItems
                    .map((item) => item.discountedSubTotal)
                    .reduce((prev, curr) => prev + curr, 0)) +
              (removeCusData
                ?.map((item) => item.servicegstamount)
                .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedPriceGstAmount)
                  .reduce((prev, curr) => prev + curr, 0) -
                showDiscount) +
              selctedMemberShip
                .map((item) => item.discountedPrice + item.gst)
                .reduce((prev, curr) => prev + curr, 0)
            ).toFixed(2),
            10
          )
        );
      }
    }
  };

  const SelectOtherCustomer = () => {
    // getAllCustomer();
  };

  const openGSTBreakupModal = () => {
    AddGSTBreakuptoggle();
  };

  const AddGSTBreakuptoggle = () => {
    setGstBreakupModal(!gstBreakupModal);
    if (gstBreakupModal === true) {
    }
  };

  const openMembershipBreakupModal = () => {
    AddMembershipBreakupModaltoggle();
  };

  const AddMembershipBreakupModaltoggle = () => {
    setMembershipBreakupModal(!membershipBreakupModal);
    if (membershipBreakupModal === true) {
    }
  };

  const SelectPaymentMethod = (e, data) => {
    setSubMenuopen(!subMenuOpen);
    setPaymentMethod(data);
    setChange(true);
  };

  const SelectSplitPaymentMethod = (e, data) => {
    setSubMenuopen(!subMenuOpen);
    setPaymentSplitMethod(data);
    setIsSplit(true)
    setChange(true);
    let newSplitData = splitPayment?.map((pay) => {
      if (pay?.method === "Wallet") {
        return pay;
      } else {
        return {
          ...pay,
          method: data,
        };
      }
    });
    setSplitPayment(newSplitData);
  };

  const AddDiscount = (dis) => {
    setDiscount(!discount);
  };

  const CancleDiscount = () => {
    setDiscount(!discount);
  };

  const AddCustomer = () => {
    AddCustomertoggle();
    setProductDropdown(!productDropdown);
  };

  const AddCustomertoggle = (data) => {
    setAddCustomerModal(!addCustomerModal);

    if (addCustomerModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("New customer added!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Customer already exist!");
        }
      }
    }
  };

  const RemoveProduct = (data) => {
    const count = data.productCount;
    setChange(true);
    const removeIndex = cartItems.findIndex(
      (item) => item.productId === data.productId
    );
    // remove object
    cartItems.splice(removeIndex, 1);
    setProductCountss([
      ...productCountss,
      {
        finalproduct:
          data?.finalproduct > 0
            ? data.productCount - data.finalproduct
            : data.productCount,
        productId: data.productId,
      },
    ]);

    AddEditProducttoggle();
    setSubtotal(
      serviceDetails
        .map((item) => item.servicediscountedprice)
        .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedSubTotal)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.discountedPrice)
          .reduce((prev, curr) => prev + curr, 0)
    );
    setGst(
      serviceDetails
        .map((item) => item.servicegstamount)
        .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedPriceGstAmount)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.gst)
          .reduce((prev, curr) => prev + curr, 0) -
        showDiscount
    );
    let total = (
      (showDiscount
        ? serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) -
          showDiscount
        : serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0)) +
      (serviceDetails
        .map((item) => item.servicegstamount)
        .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedPriceGstAmount)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.discountedPrice)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.gst)
          .reduce((prev, curr) => prev + curr, 0) -
        showDiscount)
    ).toFixed(2);
    setTotalAmount(total);
    setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
    getUserWallet(customer, total);
  };

  const RemoveService = (data) => {
    setChange(true);
    const removeIndex = serviceDetails.findIndex(
      (item) => item.key === data.key
    );
    serviceDetails.splice(removeIndex, 1);
    if (customer?.memberShip === true || selctedMemberShip?.length !== 0) {
      const removeIndex1 = removeCusData?.findIndex(
        (item) => item.key === data.key
      );
      removeCusData?.splice(removeIndex1, 1);
    }

    if (invoiceData) {
      let member = invoiceData[0]?.customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
      );
      let member1 = invoiceData[0]?.customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
      );
      let limitedZero = member?.filter((data) => data.availService > 0);
      let limitedZero1 = member1?.filter(
        (data) => data.availService === null || data.availService === 0
      );

      let MembershipServices;
      if (
        limitedZero?.length > 0 &&
        invoiceData[0]?.customer?.membership === true
      ) {
        let data = invoiceData[0]?.customer?.selectMembership.filter(
          (obj) => obj.isExpire === false
        );

        MembershipServices = serviceDetails
          .map((items) => {
            return data[0]?.selectedServices?.filter(
              (item) => item._id === items.serviceId
            );
          })
          .flat();
        setAvailService(MembershipServices);
      } else if (
        limitedZero1?.length > 0 &&
        invoiceData[0]?.customer?.membership === true
      ) {
        MembershipServices = serviceDetails
          .map((items) => {
            return invoiceData[0]?.customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();
        setAvailService(MembershipServices);
      } else {
        setAvailService([]);
      }
    } else {
      let member = customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
      );
      let member1 = customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
      );
      let limitedZero = member?.filter((data) => data.availService > 0);
      let limitedZero1 = member1?.filter(
        (data) => data.availService === null || data.availService === 0
      );
      if (limitedZero?.length > 0) {
        const MembershipServices = serviceDetails
          .map((items) => {
            return customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();
        setAvailService(MembershipServices);
      } else if (limitedZero1?.length > 0) {
        const MembershipServices = serviceDetails
          .map((items) => {
            return customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();
        setAvailService(MembershipServices);
      }
      //  else if(customer?.selectMembership?.length === 0)
      else {
        const MembershipSer = serviceDetails
          .map((items) => {
            return selctedMemberShip[0]?.selectedServices?.filter(
              (item) => item._id === items.serviceId
            );
          })
          .flat();

        setAvailService(MembershipSer);
      }

      let members = customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === true && resp?.validFor === "Limited"
      );
      let limitedZeros = members?.filter((data) => data.availService > 0);
      if (limitedZeros?.length > 0) {
        const MembershipSer = serviceDetails
          .map((items) => {
            return customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();

        setEditInvoiceAvailService(MembershipSer);
      }
    }

    //     let memberss = selctedMemberShip[0]?.filter((resp)=>resp?.isExpire === true && resp?.validFor === "Limited")
    // let limitedZeross = members?.filter((data)=>data.availService > 0)

    // else{
    //   setAvailService([])

    // }

    // const MembershipSer = serviceDetails.map((items)=>{
    //   return(
    //     selctedMemberShip[0]?.selectedServices?.filter((item)=>item._id === items.serviceId)
    //   )
    // }).flat()

    // console.log("MembershipSer",MembershipSer)
    // setAvailServ(MembershipSer)

    if (serviceDetails.length === 0) {
      setTotalMembershipDiscount(0);
      setMembershipHide(false);
    }

    AddEditServicestoggle();
    setSubtotal(
      serviceDetails
        .map((item) => item.servicediscountedprice)
        .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedSubTotal)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.discountedPrice)
          .reduce((prev, curr) => prev + curr, 0)
    );
    setGst(
      serviceDetails
        .map((item) => item.servicegstamount)
        .reduce((prev, curr) => prev + curr, 0) +
        cartItems
          .map((item) => item.discountedPriceGstAmount)
          .reduce((prev, curr) => prev + curr, 0) +
        selctedMemberShip
          .map((item) => item.gst)
          .reduce((prev, curr) => prev + curr, 0) -
        showDiscount
    );
    let total = (
      showDiscount
        ? serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) -
          showDiscount +
          ((serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount) *
            18) /
            100
        : serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) +
          (serviceDetails
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0) -
            serviceDetails
              .map((item) => item.membershipDiscount)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount)
    ).toFixed(2);

    setTotalAmount(total);
    setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
    getUserWallet(customer, total);
    let array = serviceDetails.map((rep) => rep.membershipDiscount);

    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue;

    if (array?.length > 0) {
      const sumOfMembership = array.reduce(reducer);
      setTotalMembershipDiscount(sumOfMembership);
    }
  };

  const BacktoMembership = () => {
    setMemberStaffData(true);
    setSelctedMemberShip([]);
  };

  //out side click functions

  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const wrapperRef = useRef(null);
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "top",
    });
    setProductDropdown(!productDropdown);
    getAllCustomer();
  };
  const closeDropdownPopover = () => {
    setProductDropdown(false);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setProductDropdown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(wrapperRef);
  GenerateNewInvoice.propTypes = {
    children: PropTypes.element.isRequired,
  };

  const EditServices = (e, data) => {
    // const dated  = removeCusData?.map((dtas)=>{return({
    //   ...dtas,
    //   servicesubtotal:dtas.servicesubtotal
    // })})
    // if(removeCusData){
    //   setEditServiceData(dated);
    // }else{
    //   setEditServiceData(data);

    // }

    // console.log("dated",dated)
    setEditServiceData(data);
    AddEditServicestoggle();
  };

  const EditMembership = (value) => {
    AddEditMembershiptoggle();
    setEditMembershipValue(value);
  };
  const AddEditMembershiptoggle = (data) => {
    setEditMembershipModal(!editMembershipModal);

    if (data) {
      if (editMembershipModal === true) {
        selctedMemberShip[
          selctedMemberShip
            .map((x, i) => [i, x])
            .filter((x) => x[1]._id == data._id)[0][0]
        ] = data;
      }
      setChange(true);
      setSubtotal(
        serviceDetails
          .map((item) => item.servicediscountedprice)
          .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.discountedPrice)
            .reduce((prev, curr) => prev + curr, 0)
      );
      setGst(
        (
          serviceDetails
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedPriceGstAmount)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.gst)
            .reduce((prev, curr) => prev + curr, 0)
        ).toFixed(2)
      );
      let total = (
        showDiscount
          ? serviceDetails
              .map((item) => item.servicesubtotal)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceWithGstAmount)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0) -
            parseFloat(totalmembershipDiscount.toFixed(2), 10)
          : serviceDetails
              .map((item) => item.servicediscountedprice)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.flatdiscountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0) +
            (serviceDetails
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceGstAmount)
                .reduce((prev, curr) => prev + curr, 0)) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0) -
            parseFloat(totalmembershipDiscount.toFixed(2), 10)
      ).toFixed(2);
      setTotalAmount(total);
      setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
      getUserWallet(customer, total);
    }
  };

  const RemoveMembership = (data) => {
    setChange(true);
    setSelctedMemberShip([]);
    setMembershipId();
    setAvailService([]);
    setMembershipHide(false);

    if (removeCusData?.length > 0) {
      setRemoveCusData([]);

      setServiceDetails(removeCusData);

      setSubtotal(
        removeCusData
          ?.map((item) => item.servicediscountedprice)
          .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.flatdiscountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0)
      );
      setGst(
        (
          removeCusData
            ?.map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedPriceGstAmount)
            .reduce((prev, curr) => prev + curr, 0) -
          showDiscount
        ).toFixed(2)
      );
      let total = parseFloat(
        (
          (showDiscount
            ? removeCusData
                ?.map((item) => item.servicediscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0) -
              discountprice
            : removeCusData
                ?.map((item) => item.servicediscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0)) +
          (removeCusData
            ?.map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount)
        ).toFixed(2),
        10
      );
      setTotalAmount(total);
      setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
      getUserWallet(customer, total);
    } else {
      if (editInvoice) {
        var respo = serviceDetails.map((obj) => {
          return {
            ...obj,
            membershipDiscount: 0,
            serviceflatdiscountedprice: obj.servicediscountedprice,
            servicegstamount: (obj.servicerate * obj.servicegst) / 100,
            servicesubtotal:
              obj.servicerate + (obj.servicerate * obj.servicegst) / 100,
          };
        });
        setServiceDetails(respo);
        setSubtotal(
          respo
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0)
        );

        setGst(
          (
            respo
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0)
          ).toFixed(2)
        );

        let total = (
          showDiscount
            ? respo
                .map((item) => item.servicesubtotal)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceWithGstAmount)
                .reduce((prev, curr) => prev + curr, 0)
            : respo
                .map((item) => item.servicediscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.flatdiscountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0) +
              (respo
                .map((item) => item.servicegstamount)
                .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedPriceGstAmount)
                  .reduce((prev, curr) => prev + curr, 0))
        ).toFixed(2);
        setTotalAmount(total);
        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
      } else {
        setSubtotal(
          serviceDetails
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0)
        );

        setGst(
          (
            serviceDetails
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0)
          ).toFixed(2)
        );
        let total = (
          showDiscount
            ? serviceDetails
                .map((item) => item.servicesubtotal)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceWithGstAmount)
                .reduce((prev, curr) => prev + curr, 0)
            : serviceDetails
                .map((item) => item.servicediscountedprice)
                .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.flatdiscountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0) +
              (serviceDetails
                .map((item) => item.servicegstamount)
                .reduce((prev, curr) => prev + curr, 0) +
                cartItems
                  .map((item) => item.discountedPriceGstAmount)
                  .reduce((prev, curr) => prev + curr, 0))
        ).toFixed(2);
        setTotalAmount(total);
        setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
        getUserWallet(customer, total);
      }
    }
    AddEditMembershiptoggle();
  };

  const AddEditServicestoggle = (data) => {
    setEditServicesModal(!editServicesModal);
    if (data && data[0]) {
      setChange(true);
      if (editServicesModal === true) {
        serviceDetails[
          serviceDetails
            .map((x, i) => [i, x])
            .filter((x) => x[1].key == data[0].key)[0][0]
        ] = data[0];
      }
      setSubtotal(
        serviceDetails
          .map((item) => item.servicediscountedprice)
          .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.discountedPrice)
            .reduce((prev, curr) => prev + curr, 0)
      );

      setGst(
        (
          serviceDetails
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedPriceGstAmount)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.gst)
            .reduce((prev, curr) => prev + curr, 0)
        ).toFixed(2)
      );
      let total = (
        showDiscount
          ? serviceDetails
              .map((item) => item.servicesubtotal)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceWithGstAmount)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0)
          : serviceDetails
              .map((item) => item.serviceflatdiscountedprice)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.flatdiscountedSubTotal)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0) +
            (serviceDetails
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              cartItems
                .map((item) => item.discountedPriceGstAmount)
                .reduce((prev, curr) => prev + curr, 0)) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0)
      ).toFixed(2);
      setTotalAmount(total);
      if( editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ){
      }else{
      setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
      getUserWallet(customer, total);
      }
    }
  };

  const EditProduct = (e, data) => {
    setEditProductssData(data.productCount);
    setEditProductData(data);
    if (data.finalproduct === 0) {
      setEditProductDatasss({ ...data, productCount: 0 });
    }
    AddEditProducttoggle();
  };

  const AddEditProducttoggle = (data) => {
    setEditProductModal(!editProductModal);
    if (data) {
      setChange(true);
      if (editProductModal === true) {
        cartItems[
          cartItems
            .map((x, i) => [i, x])
            .filter((x) => x[1].productId == data.productId)[0][0]
        ] = data;
      }
      setSubtotal(
        serviceDetails
          .map((item) => item.servicediscountedprice)
          .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.discountedPrice)
            .reduce((prev, curr) => prev + curr, 0)
      );
      setGst(
        serviceDetails
          .map((item) => item.servicegstamount)
          .reduce((prev, curr) => prev + curr, 0) +
          cartItems
            .map((item) => item.discountedPriceGstAmount)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.gst)
            .reduce((prev, curr) => prev + curr, 0)
      );
      let total = (
        showDiscount
          ? serviceDetails
              .map((item) => item.servicesubtotal)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceWithGstAmount)
              .reduce((prev, curr) => prev + curr, 0)
          : serviceDetails
              .map((item) => item.servicesubtotal)
              .reduce((prev, curr) => prev + curr, 0) +
            cartItems
              .map((item) => item.discountedPriceWithGstAmount)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.discountedPrice)
              .reduce((prev, curr) => prev + curr, 0) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount
      ).toFixed(2);
      setTotalAmount(total);
      setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
      getUserWallet(customer, total);
    }
  };

  const AddNewCustomer = async (data) => {
    const MembershipServices = serviceDetails
      .map((items) => {
        return selctedMemberShip[0]?.selectedServices?.filter(
          (item) => item._id === items.serviceId
        );
      })
      .flat();
    setAvailService(MembershipServices);
    let res = await ApiPost("customer/", data);
    if (res.data.status) {
      if (res.data.status === 200) {
        setChange(true);
        setCustomer(res.data.data);
        setSuccess(true);
        setToastmsg("New customer added!");
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }

    if (sameInvoice && selctedMemberShip.length > 0) {
      setMembershipHide(true);
      const membershipDetail = selctedMemberShip?.filter(
        (resp) => resp?.isExpire === false
      );
      let avail;
      if (membershipDetail[0]?.validFor === "Unlimited") {
        avail = null;
      } else {
        avail = membershipDetail[0]?.remainingService;
      }
      let active = membershipDetail[0]?.selectedServices.filter(
        (data) => data.isChecked === true
      );
      let member = customer?.selectMembership.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
      );
      let limitedZero = member?.filter((data) => data.availService === 0);
      let StartTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.startTime
      )._d;
      let EndTime = moment(membershipDetail[0]?.activeHours).add(
        membershipDetail[0]?.activeHours.endTime
      )._d;
      let currentTime = new Date();
      let dataReplace = true;
      let dayInNumber = moment(new Date()).day();
      let day;
      if (dayInNumber === 1) {
        day = "Monday";
      } else if (dayInNumber === 2) {
        day = "Tuesday";
      } else if (dayInNumber === 3) {
        day = "Wednesday";
      } else if (dayInNumber === 4) {
        day = "Thursday";
      } else if (dayInNumber === 5) {
        day = "Friday";
      } else if (dayInNumber === 6) {
        day = "Saturday";
      } else if (dayInNumber === 0) {
        day = "Sunday";
      }
      if (membershipDetail[0]?.activeDays.includes(day)) {
      } else {
        dataReplace = false;
        setAccept(true);
      }
      if (currentTime > StartTime && currentTime < EndTime) {
      } else {
        dataReplace = false;
        setAccept(true);
      }
      if (limitedZero?.length > 0) {
        dataReplace = false;
        setSuccess(true);
        setEr("Error");
        setToastmsg("Membership Expire");
      }
      if (dataReplace) {
        setRemoveCusData(serviceDetails);
        let replaced = 0;
        var respo = serviceDetails?.map((obj) => {
          let replacedata = active?.find((o) => o?._id === obj?.serviceId);
          if (active?.find((o) => o._id === obj.serviceId)) {
            if (replaced >= avail && avail !== null) {
              return {
                ...obj,
                servicediscount: obj.servicerate - obj.servicediscountedprice,
                serviceflatdiscountedprice: obj.servicediscountedprice,
                servicegstamount:
                  (obj.servicediscountedprice * obj.servicegst) / 100,
                servicesubtotal:
                  obj.servicediscountedprice +
                  (obj.servicediscountedprice * obj.servicegst) / 100,
              };
            } else {
              replaced = replaced + 1;
              return {
                ...obj,
                colour: replacedata.colour,
                serviceId: replacedata._id,
                servicediscount: 0,
                servicediscountedprice: obj.servicerate,
                serviceflatdiscountedprice:
                  obj.servicerate -
                  parseFloat(
                    (
                      (obj.servicerate * replacedata.percentageDiscount) /
                      100
                    ).toFixed(2)
                  ),
                staff: obj?.staff?.map((one) => {
                  return {
                    ...one,
                    workRatio: parseFloat(
                      (
                        ((obj.servicerate -
                          parseFloat(
                            (
                              (obj.servicerate *
                                replacedata.percentageDiscount) /
                              100
                            ).toFixed(2)
                          )) *
                          one?.workRationPercentage) /
                        100
                      ).toFixed(2),
                      10
                    ),
                  };
                }),
                servicegstamount: parseFloat(
                  (
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                    100
                  ).toFixed(2)
                ),
                membershipDiscount: parseFloat(
                  (
                    (obj.servicerate * replacedata.percentageDiscount) /
                    100
                  ).toFixed(2)
                ),
                servicename: replacedata.serviceName,
                servicerate: obj.servicerate,
                servicesubtotal: parseFloat(
                  (
                    obj.servicerate -
                    parseFloat(
                      (
                        (obj.servicerate * replacedata.percentageDiscount) /
                        100
                      ).toFixed(2)
                    ) +
                    ((obj.servicerate -
                      parseFloat(
                        (
                          (obj.servicerate * replacedata.percentageDiscount) /
                          100
                        ).toFixed(2)
                      )) *
                      obj.servicegst) /
                      100
                  ).toFixed(0)
                ),
              };
            }
          } else {
            return {
              ...obj,
              servicediscount: obj.servicerate - obj.servicediscountedprice,
              serviceflatdiscountedprice: obj.servicediscountedprice,
              servicegstamount:
                (obj.servicediscountedprice * obj.servicegst) / 100,
              servicesubtotal:
                obj.servicediscountedprice +
                (obj.servicediscountedprice * obj.servicegst) / 100,
            };
          }
        });
        let CartItm = cartItems?.map((prod) => {
          return {
            ...prod,
            discountedPrice: prod.discountedPrice,
            discountedPriceGstAmount:
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedPriceWithGstAmount:
              prod.discountedSubTotal +
              (prod.discountedSubTotal * prod.productgst) / 100,
            discountedSubTotal: prod.discountedSubTotal,
            finalproduct: prod.finalproduct,
            flatdiscountedSubTotal: prod.discountedSubTotal,
            productCount: prod.productCount,
            productDiscount:
              (prod.productPrice - prod.discountedPrice) * prod.productCount,
            productId: prod.productId,
            productName: prod.productName,
            productPrice: prod.productPrice,
            productSubTotal: prod.productSubTotal,
            productUnit: prod.productUnit,
            productgst: prod.productgst,
            productquantity: prod.productquantity,
            totalProductss: prod.totalProductss,
          };
        });
        setCartItems(CartItm);
        setShowDiscount(0);
        setServiceDetails(respo);
        setSubtotal(
          respo
            .map((item) => item.servicediscountedprice)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedSubTotal).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            selctedMemberShip
              .map((item) => item.price)
              .reduce((prev, curr) => prev + curr, 0)
        );
        setGst(
          respo
            .map((item) => item.servicegstamount)
            .reduce((prev, curr) => prev + curr, 0) +
            CartItm.map((item) => item.discountedPriceGstAmount).reduce(
              (prev, curr) => prev + curr,
              0
            ) +
            selctedMemberShip
              .map((item) => item.gst)
              .reduce((prev, curr) => prev + curr, 0)
        );

        setTotalAmount(
          (
            (showDiscount
              ? respo
                  .map((item) => item.serviceflatdiscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                CartItm.map((item) => item.discountedSubTotal).reduce(
                  (prev, curr) => prev + curr,
                  0
                )
              : respo
                  .map((item) => item.serviceflatdiscountedprice)
                  .reduce((prev, curr) => prev + curr, 0) +
                CartItm.map((item) => item.discountedSubTotal).reduce(
                  (prev, curr) => prev + curr,
                  0
                )) +
            (respo
              .map((item) => item.servicegstamount)
              .reduce((prev, curr) => prev + curr, 0) +
              CartItm.map((item) => item.discountedPriceGstAmount).reduce(
                (prev, curr) => prev + curr,
                0
              ) +
              selctedMemberShip
                .map((item) => item.discountedPrice)
                .reduce((prev, curr) => prev + curr, 0) +
              selctedMemberShip
                .map((item) => item.gst)
                .reduce((prev, curr) => prev + curr, 0))
          ).toFixed(2)
        );
      } else {
        RegularTotal();
      }
    }

    AddCustomertoggle(false);
  };
  const BackToSelectItem = () => {
    setAddProduct(true);
    setAddServices(true);
    setAddMemberShip(true);
    setAllServices(defaultAllService);
    setmemberShipData(defaultmemberShipData);
  };

  const BacktoSelectService = () => {
    setSelectService(true);
    setAddedServices({ ...addedServices, staff: [] });
    setSelectedStaff([]);
    setSelectedStaffId([]);
    setTempSelectedStaff([]);
    // ApiGet("service/company/" + userInfo.companyId).then((resp) => {
    //   let filterservice = resp.data.data.filter((obj) =>
    //     obj.categoryName === "Unassign" ? null : obj
    //   );
    //   setAllServices(filterservice);
    // });
    if(storeOnboardingTourStatus){
      setAddServices(!addServices);
      dispatch(setOnboardingCurrentTooltip('I3'))
    }
  };

  const UpdateInvoiceData = () => {
    // ################  // commented for product consumption $$$$$
    let tempArray =
      additionalProductConsumption?.length > 0
        ? additionalProductConsumption?.map((pro) => {
            return { ...pro, isAdditional: true };
          })
        : [];
    serviceDetails?.map(
      (ser) =>
        ser?.productConsumptions && tempArray.push(...ser.productConsumptions)
    );

    // console.log('###old', tempArray)
    let finalPayload = tempArray.map((pro) => {
      let tempAddedConsumption = pro?.defaultConsumption
        ? (pro?.unit === "kg" || pro?.unit === "litre"
            ? +pro.consumptionRate / 1000
            : +pro.consumptionRate) - +pro?.defaultConsumption
        : pro?.unit === "kg" || pro?.unit === "litre"
        ? +pro.consumptionRate / 1000
        : +pro.consumptionRate;
      return {
        isAdditional: pro.isAdditional,
        productName: pro.productName,
        productType: pro.productType,
        Product_id: pro._id,
        defaultConsumption: pro?.defaultConsumption
          ? +pro?.defaultConsumption
          : 0,
        addedConsumption: tempAddedConsumption?.toFixed(4),
        Product_quantity:
          pro?.unit === "litre" || pro?.unit === "kg"
            ? +pro.consumptionRate / 1000
            : +pro.consumptionRate,
        quantity: pro.quantity,
        unit: pro.unit,
        updatedUnit:
          pro?.unit === "litre" ? "ml" : pro?.unit === "kg" ? "gm" : pro?.unit,
        brandId: pro.brandId,
        categoryId: pro.categoryId,
      };
    });
    // console.log('################ finalPayload', finalPayload)
    // ################

    const updatedData = {
      serviceDetails: serviceDetails,
      products: cartItems,
      membershipDetails: selctedMemberShip,
      customer: customer,
      customerData: customer,
      membershipId: membershipId,
      subTotal: parseInt(subtotal, 10),
      GST: {
        percentage: "18",
        gstAmount: parseInt(Gst, 10),
      },
      discount: {
        discount: discountprices,
        discountAmount: parseInt(showDiscount, 10),
        discountType: discounttype,
      },
      discountMembership: totalmembershipDiscount,
      totalAmount: parseInt(TotalAmount, 10),
      paymentMethod: paymentMethod ? paymentMethod : paymenttMethod?.[0],
      companyId: userInfo.companyId,
      isActive: true,
      isSMS: smsCheckbox,
      isMembership:
        serviceDetails?.filter((service) => service?.membershipDiscount > 0)
          ?.length > 0
          ? true
          : false,
      type: type,
      splitPayment: splitPayment,
      isSplit: isSplit,
      discountedPrice: discountedPrice,
      totalDiscount: totalDiscount,
      grossTotal: grossTotal,
      notes: notes,
      membershipServiceRedeemed: availService?.length,
      productConsumptions: finalPayload || [], // commented for product consumption $$$$$
      collectedAmountRecord: collectedAmount,
    };
    const updatedDatas = {
      serviceDetails: serviceDetails,
      products: cartItems,
      membershipDetails: selctedMemberShip,
      subTotal: parseInt(subtotal, 10),
      isMembership:
        serviceDetails?.filter((service) => service?.membershipDiscount > 0)
          ?.length > 0
          ? true
          : false,
      membershipId: membershipId,
      GST: {
        percentage: "18",
        gstAmount: parseInt(Gst, 10),
      },
      discount: {
        discount: discountprices,
        discountAmount: parseInt(showDiscount, 10),
        discountType: discounttype,
      },
      discountMembership: totalmembershipDiscount,
      totalAmount: parseInt(TotalAmount, 10),
      paymentMethod: paymentMethod ? paymentMethod : paymenttMethod?.[0],
      companyId: userInfo.companyId,
      isActive: true,
      type: type,
      isSMS: smsCheckbox,
      splitPayment: splitPayment,
      isSplit: isSplit,
      discountedPrice: discountedPrice,
      totalDiscount: totalDiscount,
      grossTotal: grossTotal,
      notes: notes,
      membershipServiceRedeemed: availService?.length,
      productConsumptions: finalPayload || [], // commented for product consumption $$$$$
      collectedAmountRecord: collectedAmount,
    };

    if (
      selctedMemberShip?.length >= 0 ||
      selctedMemberShip[-1]?.isExpire === true
    ) {
      if (selctedMemberShip.length > 0) {
        if (
          selctedMemberShip[0]?.validFor === "Unlimited" &&
          customer?.selectMembership?.length === 0
        ) {
          let served = [{ ...selctedMemberShip[0] }];
          const value = {
            selectMembership: served,
            remainingService: availService,
            membership: true,
          };

          ApiPut("customer/" + customer._id, value)
            .then((resp) => {})
            .catch((er) => {
              console.log("error");
            });
        } else {
          if (
            selctedMemberShip[0]?.availService > availService?.length &&
            customer?.selectMembership?.length === 0
          ) {
            let served = [
              {
                ...selctedMemberShip[0],
                remainingService:
                  selctedMemberShip[0]?.remainingService - availService?.length,
                // isExpire:true,
              },
            ];

            const value = {
              selectMembership: served,
              membership: true,
            };

            ApiPut("customer/" + customer._id, value)
              .then((resp) => {})
              .catch((er) => {
                console.log("error");
              });
          } else if (
            selctedMemberShip[0]?.availService <= availService?.length &&
            customer?.selectMembership?.length === 0
          ) {
            let served = [
              { ...selctedMemberShip[0], remainingService: 0, isExpire: true },
            ];
            const value = {
              selectMembership: served,
              membership: false,
            };

            ApiPut("customer/" + customer._id, value)
              .then((resp) => {})
              .catch((er) => {
                console.log("error");
              });
          } else if (availService?.length === 0) {
            let served = [
              {
                ...selctedMemberShip[0],
                remainingService: selctedMemberShip[0]?.availService,
              },
            ];
            const value = {
              selectMembership: served,
              membership: true,
            };
          } else if (
            customer?.selectMembership?.length > 0 &&
            customer?.membership === false
          ) {
            // let servicess = customer?.selectMembership.flat()
            // console.log("servicess",servicess)
            if (
              customer?.selectMembership?.filter(
                (itm) => itm._id === selctedMemberShip[0]._id
              ).length > 0
            ) {
              if (editInvoiceAvailService !== undefined) {
                let servicedatas = customer?.selectMembership?.map(
                  (obj, index) => {
                    if (index === customer?.selectMembership?.length - 1) {
                      if (obj?.availService < editInvoiceAvailService?.length) {
                        return {
                          ...obj,
                          isExpire: true,
                          remainingService: 0,
                        };
                      } else if (
                        obj?.availService > editInvoiceAvailService?.length &&
                        editInvoiceAvailService?.length !== 0
                      ) {
                        return {
                          ...obj,
                          remainingService:
                            obj.remainingService +
                            editInvoiceAvailService?.length,
                        };
                      } else if (
                        obj?.availService === editInvoiceAvailService?.length
                      ) {
                        return {
                          ...obj,
                          isExpire: true,
                          remainingService: 0,
                        };
                      } else if (editInvoiceAvailService?.length === 0) {
                        return {
                          ...obj,
                          isExpire: false,
                          remainingService: obj?.availService,
                        };
                      } else {
                        return obj;
                      }
                    } else {
                      return obj;
                    }
                  }
                );

                const updatedata = {
                  selectMembership: servicedatas,
                };
                ApiPut("customer/" + customer._id, updatedata)
                  .then((resp) => {})
                  .catch((er) => {
                    console.log("error");
                  });

                if (servicedatas[0]?.remainingService > 0) {
                  const value = {
                    membership: true,
                  };
                  ApiPut("customer/" + customer._id, value)
                    .then((resp) => {})
                    .catch((er) => {
                      console.log("error");
                    });
                }
              }
            } else {
              if (
                selctedMemberShip[0]?.validFor === "Unlimited" &&
                customer?.selectMembership?.length === 0
              ) {
                let served = [{ ...selctedMemberShip[0] }];
                const value = {
                  selectMembership: served,
                  membership: true,
                };

                ApiPut("customer/" + customer._id, value)
                  .then((resp) => {})
                  .catch((er) => {
                    console.log("error");
                  });
              } else {
                if (
                  selctedMemberShip[0]?.availService > availService?.length &&
                  customer?.selectMembership?.length > 0
                ) {
                  let servicesser = customer?.selectMembership.flat();
                  let served = [
                    servicesser,
                    {
                      ...selctedMemberShip[0],
                      remainingService:
                        selctedMemberShip[0]?.remainingService -
                        availService?.length,
                      // isExpire:true,
                    },
                  ].flat();
                  const value = {
                    selectMembership: served,
                    membership: true,
                  };

                  ApiPut("customer/" + customer._id, value)
                    .then((resp) => {})
                    .catch((er) => {
                      console.log("error");
                    });
                } else if (
                  selctedMemberShip[0]?.availService <= availService?.length &&
                  customer?.selectMembership?.length > 0
                ) {
                  let served = [
                    {
                      ...selctedMemberShip[0],
                      remainingService: 0,
                      isExpire: true,
                    },
                  ];
                  const value = {
                    selectMembership: served,
                    membership: false,
                  };

                  ApiPut("customer/" + customer._id, value)
                    .then((resp) => {})
                    .catch((er) => {
                      console.log("error");
                    });
                } else if (availService?.length === 0) {
                  let served = [
                    {
                      ...selctedMemberShip[0],
                      remainingService: selctedMemberShip[0]?.availService,
                    },
                  ];
                  const value = {
                    selectMembership: served,
                    membership: true,
                  };
                } else if (
                  customer?.selectMembership?.length > 0 &&
                  customer?.membership === false
                ) {
                  // let servicess = customer?.selectMembership.flat()
                  // console.log("servicess",servicess)
                  if (
                    customer?.selectMembership?.filter(
                      (itm) => itm._id === selctedMemberShip[0]._id
                    ).length > 0
                  ) {
                    let servicedddd = customer?.selectMembership?.map(
                      (obj, index) => {
                        if (index === customer?.selectMembership?.length - 1) {
                          if (
                            obj?.availService < editInvoiceAvailService?.length
                          ) {
                            return {
                              ...obj,
                              isExpire: true,
                              remainingService: 0,
                            };
                          } else if (
                            obj?.availService >
                              editInvoiceAvailService?.length &&
                            editInvoiceAvailService?.length !== 0
                          ) {
                            return {
                              ...obj,
                              remainingService:
                                obj.remainingService +
                                editInvoiceAvailService?.length,
                            };
                          } else if (
                            obj?.availService ===
                            editInvoiceAvailService?.length
                          ) {
                            return {
                              ...obj,
                              isExpire: true,
                              remainingService: 0,
                            };
                          } else if (editInvoiceAvailService?.length === 0) {
                            return {
                              ...obj,
                              isExpire: false,
                              remainingService: obj?.availService,
                            };
                          } else {
                            return obj;
                          }
                        } else {
                          return obj;
                        }
                      }
                    );

                    const updatedata = {
                      selectMembership: servicedddd,
                    };
                    ApiPut("customer/" + customer._id, updatedata)
                      .then((resp) => {})
                      .catch((er) => {
                        console.log("error");
                      });

                    if (servicedddd[0]?.remainingService > 0) {
                      const value = {
                        membership: true,
                      };
                      ApiPut("customer/" + customer._id, value)
                        .then((resp) => {})
                        .catch((er) => {
                          console.log("error");
                        });
                    }
                  }
                }
              }
            }
          }
        }
      } else if (editInvoiceAvailService?.length === 0) {
        let servicedddd = customer?.selectMembership?.map((obj, index) => {
          if (index === customer?.selectMembership?.length - 1) {
            if (editInvoiceAvailService?.length === 0) {
              return {
                ...obj,
                isExpire: false,
                remainingService: obj?.availService,
              };
            } else {
              return obj;
            }
          }
        });

        const updatedata = {
          selectMembership: servicedddd,
        };
        ApiPut("customer/" + customer._id, updatedata)
          .then((resp) => {})
          .catch((er) => {
            console.log("error");
          });

        const value = {
          membership: false,
        };

        ApiPut("customer/" + customer._id, value)
          .then((resp) => {})
          .catch((er) => {
            console.log("error");
          });
      } else if (
        selctedMemberShip.length === 0 &&
        customer.membership === false
      ) {
        let servicedddd = customer?.selectMembership?.map((obj, index) => {
          if (index === customer?.selectMembership?.length - 1) {
            if (editInvoiceAvailService?.length === 0) {
              return {
                ...obj,
                isExpire: false,
                remainingService: obj?.availService,
              };
            } else {
              return obj;
            }
          }
        });

        const updatedata = {
          selectMembership: [],
        };
        ApiPut("customer/" + customer._id, updatedata)
          .then((resp) => {})
          .catch((er) => {
            console.log("error");
          });

        const value = {
          membership: false,
        };
        ApiPut("customer/" + customer._id, value)
          .then((resp) => {})
          .catch((er) => {
            console.log("error");
          });
      } else {
        let servicedddd;
        if (
          editInvoice?.customer?.selectMembership[
            editInvoice?.customer?.selectMembership?.length - 1
          ].validFor === "Unlimited"
        ) {
          servicedddd = editInvoice?.customer?.selectMembership?.map(
            (obj, index) => {
              if (
                index ===
                editInvoice?.customer?.selectMembership?.length - 1
              ) {
                return {
                  ...obj,
                  remainingService:
                    obj?.remainingService +
                    (availService?.length -
                      parseInt(editInvoice?.membershipServiceRedeemed, 10)),
                };
              } else {
                return obj;
              }
            }
          );
          const vals = {
            selectMembership: servicedddd,
          };
          ApiPut("customer/" + customer._id, vals)
            .then((resp) => {})
            .catch((er) => {
              console.log("error");
            });
        } else {
          servicedddd = editInvoice?.customer?.selectMembership?.map(
            (obj, index) => {
              if (
                index ===
                editInvoice?.customer?.selectMembership?.length - 1
              ) {
                return {
                  ...obj,
                  isExpire:
                    availService?.length >= obj.availService ? true : false,
                  remainingService:
                    availService?.length === obj.availService
                      ? 0
                      : availService?.length > obj.availService
                      ? 0
                      : obj.availService - availService?.length,
                };
              } else {
                return obj;
              }
            }
          );
        }

        if (servicedddd) {
          if (
            servicedddd[0]?.availService >= servicedddd[0]?.remainingService
          ) {
            if (servicedddd[0]?.remainingService === 0) {
              const val = {
                membership: false,
                selectMembership: servicedddd,
              };
              ApiPut("customer/" + customer._id, val)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            } else {
              const val = {
                membership: true,
                selectMembership: servicedddd,
              };
              ApiPut("customer/" + customer._id, val)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            }
          }
          // if (servicedddd[0]?.availService === servicedddd[0]?.remainingService) {
          //   const val = {
          //     memberShip: false,
          //   };
          //   ApiPut("customer/" + customer._id, val)
          //     .then((resp) => {
          //       console.log(resp.data.status);
          //     })
          //     .catch((er) => {
          //       console.log("error");
          //     });
          //   console.log("value114", val);
          // }
        }
      }
    } else {
      let service = customer?.selectMembership?.map((obj, index) => {
        if (index === customer?.selectMembership?.length - 1) {
          if (obj?.availService < editInvoiceAvailService?.length) {
            return {
              ...obj,
              isExpire: true,
              remainingService: 0,
            };
          } else if (
            obj?.availService > editInvoiceAvailService?.length &&
            editInvoiceAvailService?.length !== 0
          ) {
            return {
              ...obj,
              remainingService:
                obj.remainingService + editInvoiceAvailService?.length,
            };
          } else if (obj?.availService === editInvoiceAvailService?.length) {
            return {
              ...obj,
              isExpire: true,
              remainingService: 0,
            };
          } else if (editInvoiceAvailService?.length === 0) {
            return {
              ...obj,
              isExpire: false,
              remainingService: obj?.availService,
            };
          } else {
            return obj;
          }
        } else {
          return obj;
        }
      });

      const updatedata = {
        selectMembership: service,
      };
      ApiPut("customer/" + customer._id, updatedata)
        .then((resp) => {})
        .catch((er) => {
          console.log("error");
        });

      if (service[0]?.remainingService > 0) {
        const value = {
          membership: true,
        };
        ApiPut("customer/" + customer._id, value)
          .then((resp) => {})
          .catch((er) => {
            console.log("error");
          });
      }
    }

    // }

    ApiPut(
      "invoice/" + editInvoice._id,
      customer?.firstName === "Walk-in-Customer" ? updatedDatas : updatedData
    )
      .then((res) => {
        const SmSData = {
          name: `${updatedData?.customer?.firstName} ${
            updatedData?.customer?.lastName === null
              ? ""
              : updatedData?.customer?.lastName
          } `,
          invoice: parseInt(updatedData?.totalAmount, 10).toFixed(),
          date: moment(updatedData?.created).format("DD/MM/YYYY"),
          link: "www.app.barbera.io",
          sallon: sallonName,
          mobile: updatedData?.customer?.mobileNumber,
          invoiceId: editInvoice._id,
          companyId: userInfo.companyId,
        };

        cartItems.map((product) => {
          const productdata = {
            productId: product.productId,
            retailInitialStock: product.finalproduct,
            type: "DR",
            companyId: userInfo.companyId,
          };
          if (product.finalproduct !== 0) {
            ApiPost("stock", productdata)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }
          return <></>;
        });

        if (productCountss !== null || undefined || "") {
          productCountss.map((product) => {
            const productdata = {
              productId: product.productId,
              retailInitialStock: -product.finalproduct,
              companyId: userInfo.companyId,
            };
            ApiPost("stock", productdata)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
            return <></>;
          });
        }
        if (smsCheckbox) {
          if (updatedData?.customer?.mobileNumber) {
            ApiPost("invoice/customer/invoice/sendMessage", SmSData)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }
        }
        toggle(res);
        getInvoice();
      })
      .catch((er) => {
        console.log(er);
      });
  };

  const GenerateInvoiceData = async (data) => {
    setAddDisble(true)
    if (!storeOnboardingTourStatus) {
      let onboardingUpdateProfileData = {
        companyId: userInfo?.companyId,
        onboardProcess: [
          {
            onboardingStatus: false,
            onboardingCompleted: true,
            onboardingTourProgress: 100,
            onboardingProfileUpdated: true,
          },
        ],
      };
      await ApiPost("setting/", onboardingUpdateProfileData)
        .then((res) => {
          dispatch(setOnboardingTourProgress(100));
          dispatch(setOnboardingCurrentTooltip(""));
          dispatch(setOnboardingTourStatus(false));
          dispatch(setOnboardingTooltipStatus(false));
          userUtil.setSetting(res?.data?.data[0]);
        })
        .catch((err) => console.log(err));
    }
    if (storeOnboardingTourStatus && storeOnboardingTourProgress === 66) {
      let onboardingUpdateProfileData = {
        companyId: userInfo?.companyId,
        onboardProcess: [
          {
            onboardingStatus: false,
            onboardingCompleted: false,
            onboardingTourProgress: 100,
            onboardingProfileUpdated: true,
          },
        ],
      };
      await ApiPost("setting/", onboardingUpdateProfileData)
        .then((res) => {
          dispatch(setOnboardingTourProgress(100));
          dispatch(setOnboardingCurrentTooltip("getSMS"));
          dispatch(setOnboardingTourStatus(true));
          dispatch(setOnboardingTooltipStatus(false));
        })
        .catch((err) => console.log(err));
    }
    let CustomerMembershipData;
    if (customer?.membership === true) {
      CustomerMembershipData =
        customer?.selectMembership?.[customer?.selectMembership.length - 1]
          ?._id;
    }

    // ################  // commented for product consumption $$$$$

    let tempArray =
      additionalProductConsumption?.length > 0
        ? additionalProductConsumption?.map((pro) => {
            return {
              ...pro,
              isAdditional: true,
              updatedUnit:
                pro?.unit === "litre"
                  ? "ml"
                  : pro?.unit === "kg"
                  ? "gm"
                  : pro?.unit,
            };
          })
        : [];

    serviceDetails?.filter(
      (ser) =>
        ser?.productConsumptions?.length > 0 &&
        tempArray?.push(...ser.productConsumptions)
    );

    // console.log('********###old', tempArray)

    let finalPayload =
      tempArray?.length > 0 &&
      tempArray?.map((pro) => {
        return {
          isAdditional: pro.isAdditional,
          productName: pro.productName,
          productType: pro.productType,
          Product_id: pro._id,
          Product_quantity:
            pro?.unit === "litre" || pro?.unit === "kg"
              ? +pro.consumptionRate / 1000
              : +pro.consumptionRate,
          defaultConsumption: pro?.defaultConsumption
            ? +pro?.defaultConsumption
            : 0,
          addedConsumption: pro?.defaultConsumption
            ? (pro?.unit === "kg" || pro?.unit === "litre"
                ? +pro.consumptionRate / 1000
                : +pro.consumptionRate) - +pro?.defaultConsumption
            : pro?.unit === "kg" || pro?.unit === "litre"
            ? +pro.consumptionRate / 1000
            : +pro.consumptionRate,
          quantity: pro.quantity,
          unit: pro.unit,
          updatedUnit:
            pro?.unit === "litre"
              ? "ml"
              : pro?.unit === "kg"
              ? "gm"
              : pro?.unit,
          brandId: pro.brandId,
          categoryId: pro.categoryId,
        };
      });
    // console.log('################ finalPayload', finalPayload)

    // ################

    const InvoiceData = {
      created: createdDate,
      serviceDetails: serviceDetails,
      membershipDetails: selctedMemberShip,
      products: cartItems,
      customer: customer,
      customerData: customer,
      subTotal: subtotal,
      // membershipId: membershipId,
      membershipId:
        selctedMemberShip.length !== 0 ? membershipId : CustomerMembershipData,

      GST: {
        percentage: "18",
        gstAmount: parseInt(Gst, 10),
      },
      discount: {
        discount: discountprices,
        discountAmount: parseInt(showDiscount, 10),
        discountType: discounttype,
      },
      discountMembership: totalmembershipDiscount,
      totalAmount: TotalAmount,
      paymentMethod: paymentMethod ? paymentMethod : paymenttMethod?.[0],
      companyId: userInfo.companyId,
      isActive: true,
      isSMS: smsCheckbox,
      type: type,
      splitPayment: splitPayment,
      isSplit: collectedAmount == 0 ? true : isSplit,
      isMembership:
        serviceDetails?.filter((service) => service?.membershipDiscount > 0)
          ?.length > 0
          ? true
          : false,
      discountedPrice: discountedPrice,
      totalDiscount: totalDiscount,
      grossTotal: grossTotal,
      membershipServiceRedeemed: serviceDetails?.filter(
        (service) => service?.membershipDiscount > 0
      )?.length,
      productConsumptions: finalPayload || [], // commented for product consumption $$$$$
      dueStatus:
        collectedAmount == 0 &&
        (TotalAmount > walletBalance || walletBalance === undefined) &&
        parseInt(TotalAmount) !==
          parseInt(totalmembershipDiscount.toFixed(2), 10) &&
        parseInt(TotalAmount) !== parseInt(showDiscount)
          ? "Unpaid"
          : dueAmount > 0
          ? "Part paid"
          : "Paid",
      dueAmount: dueAmount,
      balanceAmountRecord: balanceAmount,
      dueAmountRecord: dueAmount > 0 ? dueAmount : undefined,
      collectedAmountRecord: collectedAmount,
      notes: notes,
      previousDueClearRecord :previousDue
    };
    const InvoiceDatas = {
      created: createdDate,
      serviceDetails: serviceDetails,
      membershipDetails: selctedMemberShip,
      products: cartItems,
      subTotal: subtotal,
      // membershipId: membershipId,
      membershipId:
        selctedMemberShip.length !== 0 ? membershipId : CustomerMembershipData,
      GST: {
        percentage: "18",
        gstAmount: parseInt(Gst, 10),
      },
      discount: {
        discount: discountprices,
        discountAmount: parseInt(showDiscount, 10),
        discountType: discounttype,
      },
      discountMembership: totalmembershipDiscount,
      totalAmount: TotalAmount,
      paymentMethod: paymentMethod ? paymentMethod : paymenttMethod?.[0],
      companyId: userInfo.companyId,
      isActive: true,
      isSMS: smsCheckbox,
      type: type,
      splitPayment: splitPayment,
      isSplit: collectedAmount == 0 ? true : isSplit,
      isMembership:
        serviceDetails?.filter((service) => service?.membershipDiscount > 0)
          ?.length > 0
          ? true
          : false,
      discountedPrice: discountedPrice,
      totalDiscount: totalDiscount,
      grossTotal: grossTotal,
      membershipServiceRedeemed: serviceDetails?.filter(
        (service) => service?.membershipDiscount > 0
      )?.length,
      productConsumptions: finalPayload || [], // commented for product consumption $$$$$
      dueStatus: "Paid",
      dueAmount: dueAmount,
      notes: notes,
      collectedAmountRecord: parseInt(TotalAmount),
      previousDueClearRecord :previousDue
    };

    let invoiceNumber;
    let invoiceId;

    await ApiPost("invoice", customer?.isActive ? InvoiceData : InvoiceDatas)
      .then(async (resp) => {
        invoiceNumber = resp.data.data.invoiceId;
        invoiceId = resp.data.data._id;

        cartItems.map((product) => {
          const productdata = {
            productId: product.productId,
            retailInitialStock: product.productCount,
            description: "Sales" + "#" + resp.data.data.invoiceId,
            type: "DR",
            companyId: userInfo.companyId,
          };
          if (product?.productCount > product?.retailStock) {
            let consumeData = product?.productCount - product?.retailStock;
            const consumeProductdata = {
              productId: product.productId,
              storeInitialStock: consumeData,
              description: "Transfer to Retail",
              type: "DR",
              companyId: userInfo.companyId,
            };
            ApiPost("stock", consumeProductdata)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
            const retailProductdata = {
              productId: product.productId,
              retailInitialStock: consumeData,
              description: "Transfer from Store consumption",
              type: "CR",
              companyId: userInfo.companyId,
            };
            ApiPost("stock", retailProductdata)
              .then((resp) => {
                ApiPost("stock", productdata)
                  .then((resp) => {})
                  .catch((er) => {
                    console.log(er);
                  });
                // ApiPost("stock", productdata)
                //   .then((resp) => {})
                //   .catch((er) => {
                //     console.log(er);
                //   });
              })
              .catch((er) => {
                console.log(er);
              });
          } else {
            ApiPost("stock", productdata)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }

          return <></>;
        });

        const SmSData = {
          name: `${InvoiceData?.customer?.firstName} ${
            InvoiceData?.customer?.lastName === null
              ? ""
              : InvoiceData?.customer?.lastName
          } `,
          invoice: parseInt(InvoiceData?.totalAmount, 10).toFixed(),
          date: moment(InvoiceData?.created).format("DD/MM/YYYY"),
          link: "www.app.barbera.io",
          sallon: sallonName,
          mobile: InvoiceData?.customer?.mobileNumber,
          invoiceId: resp.data.data._id,
          companyId: userInfo.companyId,
        };
        if (smsCheckbox) {
          if (InvoiceData?.customer?.mobileNumber) {
            ApiPost("invoice/customer/invoice/sendMessage", SmSData)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }
        }

        if (
          serviceDetails?.length !== 0 ||
          cartItems?.length !== 0 ||
          selctedMemberShip?.length !== 0
        ) {
          if (isSplit && splitPayment[0]?.method === "Wallet") {
            let walletredeemData = {
              companyId: SettingInfo?.companyId,
              user_id: customer?._id,
              type: "DR",
              method: [],
              description: "#" + invoiceNumber,
              invoice_id: invoiceId,
              walletAmount: splitPayment[0]?.amount,
            };

            await ApiPost("wallet", walletredeemData)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }
          if (dueAmount) {
            let walletData = {
              companyId: SettingInfo?.companyId,
              user_id: customer?._id,
              type: "DR",
              method: [],
              description: "#" + invoiceNumber,
              invoice_id: invoiceId,
              walletAmount: dueAmount,
            };

            await ApiPost("wallet", walletData)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }
          if (balanceAmount) {
            let walletBalnceData = {
              companyId: SettingInfo?.companyId,
              user_id: customer?._id,
              type: "CR",
              method: [],
              description: "#" + invoiceNumber,
              invoice_id: invoiceId,
              walletAmount: balanceAmount,
              topup: false,
            };

            await ApiPost("wallet", walletBalnceData)
              .then((resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }
          if (previousDue) {
            dueTransction?.map(async (due) => {
              let updatedData = {
                dueStatus: "Paid",
                dueAmount: 0,
                duePaymentMethod: [],
              };
              ApiPut("invoice/" + due._id, updatedData)
                .then(async (resp) => {})
                .catch((er) => {
                  console.log(er);
                });
            });
            let walletredeemData = {
              companyId: SettingInfo?.companyId,
              user_id: customer?._id,
              type: "CR",
              method: [],
              description: "Due cleared",
              walletAmount: previousDue,
            };
            await ApiPost("wallet", walletredeemData)
              .then(async (resp) => {})
              .catch((er) => {
                console.log(er);
              });
          }
          if (selctedMemberShip?.length > 0) {
            if (
              selctedMemberShip[0]?.validFor === "Unlimited" &&
              customer?.selectMembership?.length === 0
            ) {
              let served = [
                {
                  ...selctedMemberShip[0],
                  remainingService: availService.length,
                  invoiceID: resp.data.data.invoiceId,
                  invoice_id: resp.data.data._id,
                },
              ];
              const value = {
                selectMembership: served,
                membership: true,
              };

              ApiPut("customer/" + customer._id, value)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            } else {
              if (
                selctedMemberShip[0]?.remainingService < availService?.length &&
                customer?.selectMembership?.length === 0
              ) {
                let served = [
                  {
                    ...selctedMemberShip[0],
                    remainingService: 0,
                    isExpire: true,
                    invoiceID: resp.data.data.invoiceId,
                    invoice_id: resp.data.data._id,
                  },
                ];
                const value = {
                  selectMembership: served,
                  membership: false,
                };

                ApiPut("customer/" + customer._id, value)
                  .then((resp) => {})
                  .catch((er) => {
                    console.log("error");
                  });
              } else if (
                selctedMemberShip[0]?.remainingService > availService?.length &&
                customer?.selectMembership?.length === 0
              ) {
              } else if (customer?.selectMembership?.length === 0) {
                let served = [
                  {
                    ...selctedMemberShip[0],
                    remainingService: 0,
                    isExpire: true,
                    invoiceID: resp.data.data.invoiceId,
                    invoice_id: resp.data.data._id,
                  },
                ];
                const value = {
                  selectMembership: served,
                  membership: false,
                };

                ApiPut("customer/" + customer._id, value)
                  .then((resp) => {})
                  .catch((er) => {
                    console.log("error");
                  });
              }
            }
          } else if (
            customer?.membership === false &&
            customer?.selectMembership?.length === 0 &&
            selctedMemberShip?.validFor === "Limited"
          ) {
            if (selctedMemberShip[0]?.availService < availService?.length) {
              let served = [
                { ...selctedMemberShip[0], availService: 0, isExpire: true },
              ];
              const value = {
                selectMembership: served,
                membership: false,
              };

              ApiPut("customer/" + customer._id, value)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            } else if (
              selctedMemberShip[0]?.availService > availService?.length
            ) {
              let served = [
                {
                  ...selctedMemberShip[0],
                  availService:
                    selctedMemberShip[0]?.availService - availService?.length,
                  isExpire: true,
                },
              ];
              const value = {
                selectMembership: served,
                membership: false,
              };

              ApiPut("customer/" + customer._id, value)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            } else {
              let served = [
                { ...selctedMemberShip[0], availService: 0, isExpire: true },
              ];
              const value = {
                selectMembership: served,
                membership: false,
              };

              ApiPut("customer/" + customer._id, value)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            }
          } else if (
            customer?.selectMembership?.length > 0 &&
            customer?.membership === false
          ) {
            let servicess = customer?.selectMembership.flat();
            if (selctedMemberShip[0]?.remainingService < availService?.length) {
              let datte = [
                servicess,
                [
                  {
                    ...selctedMemberShip[0],
                    remainingService: 0,
                    isExpire: true,
                  },
                ],
              ].flat();
              const value = {
                selectMembership: datte,
                membership: true,
              };

              ApiPut("customer/" + customer._id, value)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            } else if (
              selctedMemberShip[0]?.remainingService > availService?.length
            ) {
              let datte = [
                servicess,
                [
                  {
                    ...selctedMemberShip[0],
                    remainingService:
                      selctedMemberShip[0]?.remainingService -
                      availService?.length,
                    isExpire: true,
                  },
                ],
              ].flat();
              const value = {
                selectMembership: datte,
                membership: false,
              };

              ApiPut("customer/" + customer._id, value)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            }
          } else if (customer?.selectMembership?.length > 0) {
              let data = customer?.selectMembership?.filter(
                (obj) => obj.isActive === true
              );
              if (data[0].validFor === "Unlimited") {
                let servicess = customer?.selectMembership.flat();

                let services = servicess.map((data) => {
                  if (data.isExpire === true) {
                    return {
                      ...data,
                    };
                  } else {
                    return {
                      ...data,
                      remainingService:
                        data.remainingService === null
                          ? 0 + availService?.length
                          : data.remainingService + availService?.length,
                    };
                  }
                });

                const value = {
                  selectMembership: services,
                  // membership: false,
                };

                ApiPut("customer/" + customer._id, value)
                  .then((resp) => {})
                  .catch((er) => {
                    console.log("error");
                  });
              } else {
              }
            }
          
         
          let member = customer?.selectMembership?.filter(
            (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
          );
          if (
            availService?.length > 0 &&
            member &&
            member[0]?.validFor === "Limited"
          ) {
            let service = customer?.selectMembership?.map((obj, index) => {
              if (index === customer?.selectMembership?.length - 1) {
                if (obj?.remainingService < availService?.length) {
                  return {
                    ...obj,
                    isExpire: true,
                    remainingService: 0,
                  };
                } else if (obj?.remainingService > availService?.length) {
                  return {
                    ...obj,
                    remainingService:
                      obj.remainingService - availService?.length,
                  };
                } else if (obj?.remainingService === availService?.length) {
                  return {
                    ...obj,
                    isExpire: true,
                    remainingService: 0,
                  };
                } else {
                  return obj;
                }
              } else {
                return obj;
              }
            });
            if (service[0]?.remainingService === 0) {
              const value = {
                membership: false,
              };

              ApiPut("customer/" + customer._id, value)
                .then((resp) => {})
                .catch((er) => {
                  console.log("error");
                });
            }
            const updatedata = {
              selectMembership: service,
            };

            ApiPut("customer/" + customer._id, updatedata)
              .then((resp) => {})
              .catch((er) => {
                console.log("error");
              });
          } else {
            if (selctedMemberShip.length !== 0) {
              let servicess = customer?.selectMembership.flat();
              if (selctedMemberShip[0]?.remainingService === null) {
              } else {
                if (
                  selctedMemberShip[0]?.remainingService < availService?.length
                ) {
                  let datte = [
                    servicess,
                    [
                      {
                        ...selctedMemberShip[0],
                        remainingService:
                          selctedMemberShip[0]?.remainingService -
                          availService?.length,
                        isExpire: true,
                        invoiceID: resp.data.data.invoiceId,
                      },
                    ],
                  ].flat();
                  const value = {
                    selectMembership: datte,
                    membership: false,
                  };

                  ApiPut("customer/" + customer._id, value)
                    .then((resp) => {})
                    .catch((er) => {
                      console.log("error");
                    });
                } else if (
                  selctedMemberShip[0]?.remainingService > availService?.length
                ) {
                  let datte = [
                    servicess,
                    [
                      {
                        ...selctedMemberShip[0],
                        remainingService:
                          selctedMemberShip[0]?.remainingService -
                          availService?.length,
                        // isExpire:true
                        invoiceID: resp.data.data.invoiceId,
                        invoice_id: resp.data.data._id,
                      },
                    ],
                  ].flat();
                  const value = {
                    selectMembership: datte,
                    membership: true,
                  };

                  ApiPut("customer/" + customer._id, value)
                    .then((resp) => {})
                    .catch((er) => {
                      console.log("error");
                    });
                } else if (
                  selctedMemberShip[0]?.remainingService ===
                    availService?.length &&
                  selctedMemberShip[0]?.remainingService !== 0
                ) {
                  let datte = [
                    servicess,
                    [
                      {
                        ...selctedMemberShip[0],
                        remainingService:
                          selctedMemberShip[0]?.remainingService -
                          availService?.length,
                        isExpire: true,
                        invoiceID: resp.data.data.invoiceId,
                        invoice_id: resp.data.data._id,
                      },
                    ],
                  ].flat();
                  const value = {
                    selectMembership: datte,
                    membership: false,
                  };

                  ApiPut("customer/" + customer._id, value)
                    .then((resp) => {})
                    .catch((er) => {
                      console.log("error");
                    });
                }
              }

              // if (
              //   customer?.selectMembership?.length !== 0 &&
              //   selctedMemberShip[0]?.validFor === "Limited"
              // ) {
              //   let datte = [servicess,[{...selctedMemberShip[0],
              //     remainingService: 0,
              //     isExpire:true
              //   }]].flat()
              //   const value = {
              //     selectMembership: datte,
              //     membership: false,
              //   };
              //   console.log("value60",value)
              //   console.log("value60")
              //   ApiPut("customer/" + customer._id, value)
              //       .then((resp) => {
              //         console.log(resp.data.status);
              //       })
              //       .catch((er) => {
              //         console.log("error");
              //       });
              // } else
              if (
                customer?.selectMembership?.length !== 0 &&
                selctedMemberShip[0]?.validFor === "Unlimited"
              ) {
                let servicess = customer?.selectMembership.flat();
                let datte = [
                  servicess,
                  [
                    {
                      ...selctedMemberShip[0],
                      invoiceID: resp.data.data.invoiceId,
                      invoice_id: resp.data.data._id,
                    },
                  ],
                ].flat();
                const value = {
                  selectMembership: datte,
                  membership: true,
                };

                ApiPut("customer/" + customer._id, value)
                  .then((resp) => {})
                  .catch((er) => {
                    console.log("error");
                  });
              }
            }
          }


          toggle(resp);
        } else {
        }
      })
      .catch((er) => {
        toggle(er);
      });
      setAddDisble(false)
  };
  const Invoicess = {
    serviceDetails: serviceDetails,
    products: cartItems,
    subTotal: subtotal,
    membershipDetail: selctedMemberShip,
    GST: {
      percentage: "18",
      gstAmount: parseInt(Gst, 10),
    },
    discount: {
      discount: discountprices,
      discountAmount: parseInt(showDiscount, 10),
      discountType: discounttype,
    },
    totalAmount: TotalAmount,
    paymentMethod: paymentMethod ? paymentMethod : paymenttMethod?.[0],
    companyId: userInfo.companyId,
    isActive: true,
    type: type,
  };
  const BackProductToSelectItem = () => {
    setAddProduct(true);
    setAddServices(true);
  };
  
  const sortStaff =
    allStaff &&
    allStaff.sort(function (a, b) {
      if (a.firstName < b.firstName) return -1;
      if (a.firstName > b.firstName) return 1;
      return 0;
    });
  
  const BacktoCheckout = () => {
    setAddServices(false);
    setSelectService(false);
    setInvoiceDetail(false);
  };

  const CloseCustomerDropDown = () => {
    setProductDropdown(!productDropdown);
  };

  const selectMembershipOption = () => {
    setAddMemberShip(!addMemberShip);
  };

  const selectProduct = async (e) => {
    getAllStaff();
    setAddProduct(!addProduct);
    try {
      setLoading(true);
      let res = await ApiGet("product/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        setLoading(false);
        setAllCompanyProduct(res.data.data);
      } else {
        setLoading(false);
        console.log("in the else");
      }
    } catch (err) {
      setLoading(false);
      console.log("error while getting Producrts", err);
    }
  };

  const RemovePreviouseDue = () => {
    setPreviousDue();
    setCollectedAmount();
    setBalanceAmount();
    setAmount();
    setDueAmount();
    setDueToggle(false);
    setadvanceToggle(false);
    setDueChanges(false);
    RemoveSplitPayment();
    setDueTransction([]);
  };

  const OpenPrevoiusDueBreakup = () => {
    setPreviousDueModal(!previousDueModal);
  };

  const AddDueAmount = () => {
    setAddDisble(true);
    setDueToggle(!dueToggle);
    setDueAmount(
      parseInt(TotalAmount) +
        (previousDue ? previousDue : 0) -
        (splitPayment[0]?.method === "Wallet" ? splitPayment[0]?.amount : 0)
    );

    if (walletBalance < parseInt(TotalAmount) && walletBalance > 0) {
      setDueAmount(
        parseInt(TotalAmount) + (previousDue ? previousDue : 0) - walletBalance
      );
      setAmount();
    }
  };

  const AddAdvanceAmount = () => {
    setAddDisble(true);
    setadvanceToggle(!advanceToggle);
    setBalanceAmount(0);
  };

  const AdvanceAmountHandler = (e) => {
    if (e.target.value == "") {
      setAdvanceamount();
      setBalanceAmount();
    } else {
      setAdvanceamount(e.target.value);
      setBalanceAmount(parseInt(e.target.value));
    }
  };

  const DueAmount = (e) => {
    setAmount(e.target.value);

    if (
      e.target.value >
      parseInt(TotalAmount) +
        (previousDue ? previousDue : 0) -
        (splitPayment[0]?.method === "Wallet" ? splitPayment[0]?.amount : 0)
    ) {
      setDueAmount(0);
      setBalanceAmount(
        e.target.value -
          (parseInt(TotalAmount) +
            (previousDue ? previousDue : 0) -
            (splitPayment[0]?.method === "Wallet"
              ? splitPayment[0]?.amount
              : 0))
      );
    } else {
      setDueAmount(
        e.target.value
          ? e.target.value >
            parseInt(TotalAmount) +
              (previousDue ? previousDue : 0) -
              (splitPayment[0]?.method === "Wallet"
                ? splitPayment[0]?.amount
                : 0)
            ? e.target.value ===
              parseInt(TotalAmount) +
                (previousDue ? previousDue : 0) -
                (splitPayment[0]?.method === "Wallet"
                  ? splitPayment[0]?.amount
                  : 0)
              ? parseInt(TotalAmount) +
                (previousDue ? previousDue : 0) -
                (splitPayment[0]?.method === "Wallet"
                  ? splitPayment[0]?.amount
                  : 0) -
                e.target.value
              : 0
            : parseInt(TotalAmount) +
              (previousDue ? previousDue : 0) -
              (splitPayment[0]?.method === "Wallet"
                ? splitPayment[0]?.amount
                : 0) -
              e.target.value
          : parseInt(TotalAmount) +
              (previousDue ? previousDue : 0) -
              (splitPayment[0]?.method === "Wallet"
                ? splitPayment[0]?.amount
                : 0)
      );
      setBalanceAmount();
    }
  };

  const SaveAdvanceAmount = () => {
    setAddDisble(false);
    setadvanceToggle(!advanceToggle);
    setAdvanceChanges(true);

    if (advanceamount) {
      setCollectedAmount(advanceamount ? parseInt(advanceamount) : 0);
      if(isSplit === true){
      let splitdata = [
        { method: "Wallet", amount: parseInt(TotalAmount) },
        {
          method: paymenttMethod?.[0],
          amount: advanceamount ? advanceamount : 0,
        },
      ];
      setSplitPayment(splitdata);
      setIsSplit(true);
      setPaymentMethod("Split");
    }else{
      setPaymentMethod( paymenttMethod?.[0]);
    }
    } else {
      setCollectedAmount(0);
      let splitdata = [{ method: "Wallet", amount: parseInt(TotalAmount) }];
      setSplitPayment(splitdata);
      setIsSplit(true);
      setPaymentMethod("Split");
    }
  };
  const SaveCollectedAmount = () => {
    let errors = {};
    if (walletBalance > 0) {
      // if (amount < walletBalance) {
      //   errors["dueAmount"] = "* Enter more than wallet amount";
      // } else {

      setAddDisble(false);
      setCollectedAmount(amount ? amount : 0);
      setDueToggle(!dueToggle);
      setDueChanges(true);
      let splitdata;
      if (
        parseInt(amount) - parseInt(TotalAmount) - parseInt(walletBalance) ==
          0 ||
        amount === undefined ||
        amount === ""
      ) {
        splitdata = [{ method: "Wallet", amount: walletBalance }];
      } else {
        splitdata = [
          { method: "Wallet", amount: walletBalance },
          { method: paymenttMethod?.[0], amount: parseInt(amount) },
        ];
      }
      setSplitPayment(splitdata);
      setIsSplit(true);
      setPaymentMethod("Split");

      // }
      setError(errors);
    } else {
      let errors = {};

      if (amount < previousDue) {
        errors["dueAmount"] = "* Enter more than previous due amount";
      } else if (amount === undefined && previousDue) {
        errors["dueAmount"] = "* Enter more than previous due amount";
      } else {
        if (
          isSplit &&
          parseInt(amount) !==
            splitPayment
              ?.map((item) => item.amount)
              .reduce((prev, curr) => prev + curr, 0)
        ) {
          RemoveSplitPayment();
        }
        setAddDisble(false);
        setCollectedAmount(amount ? amount : 0);
        setDueToggle(!dueToggle);
        setDueChanges(true);
      }
      setError(errors);
    }
  };

  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  const getAllStaff = async (values) => {
    let datePayload = editInvoice ? {
      startTime: moment(editInvoice?.created).format("YYYY-MM-DD"),
      endTime: moment(editInvoice?.created).add(1, "days").format("YYYY-MM-DD"),
    } : {
      startTime: moment(createdDate).format("YYYY-MM-DD"),
      endTime: moment(createdDate).add(1, "days").format("YYYY-MM-DD"),
    }
    let attendanceRes =  await ApiPost("attendence/company/" + userInfo.companyId, datePayload)
    let tempData = attendanceRes.data.data?.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    let tempAttendanceData = removeDuplicateObjectFromArray(tempData, "staffId");
    let thisDayAttendanceData = tempAttendanceData || [];
    try {
      let res = await ApiGet("staff/company/" + userInfo.companyId);
      if (res.data.status === 200) {
        let filterDat = res?.data?.data?.filter(
          (obj) => obj?.firstName !== "Unassign"
        );
        let availableStaff = filterDat?.filter((item) => thisDayAttendanceData?.find((data)=>data?.staffId === item?._id)?.currentStatus === "clockIn");
       
        setAvailableStaffData(availableStaff);
        if (
          SettingInfo?.attendence?.attendanceToggle &&
          SettingInfo?.attendence?.attendanceForInvoiceToggle
        ) {
          if (pastInvoice) {
            setStaffData(filterDat);
          }else{
            setStaffData(availableStaff);
          }
        } else {
          setStaffData(filterDat);
        }
      }
    } catch (err) {
      console.log("error while getting Forum", err);
    }
  };
  const SelectStaffFromProduct = (stf, prod) => {
    const prodItem = cartItems?.find((x) => x?.productId === prod?.productId);
    setCartItems(
      cartItems?.map((crt) =>
        crt?.productId === prod?.productId
          ? stf.firstName === "No staff" && !stf?.Id
            ? {
                ...prodItem,
                staffId: "",
                staffName: "",
              }
            : {
                ...prodItem,
                staffId: stf._id,
                staffName: stf?.firstName + " " + stf?.lastName,
              }
          : crt
      )
    );
  };

  const MultipleStaff = () => {
    setOnMultipleStaff(true);
  };

  const SingleStaff = () => {
    setOnMultipleStaff(false);
  };
  const SelectMultipleStaff = (data) => {
    if (editServiceData) {
      let selectedIdData = selectedStaffId?.map((obj) => {
        return { id: obj };
      });

      let MatchData = selectedIdData
        .map((obj) => {
          return allStaff?.filter((resp) =>
            resp._id === obj.id ? resp : null
          );
        })
        .flat();
      let data = MatchData.map((one) => {
        return {
          ...one,
          workRatio: parseFloat(
            (
              editServiceData?.serviceflatdiscountedprice / MatchData.length
            ).toFixed(2),
            10
          ),
          workRationPercentage: parseFloat(100 / MatchData.length, 10),
        };
      });
      // if(selectedStaffId?.length === 1){
      //   setServiceDetails([{ ...addedServices, staff: data }]);
      //   setOpenWorkRation(false);
      //   setInvoiceDetail(!invoiceDetail);
      //   setSelectedStaffId([]);
      // }else{
      setEditServiceData({ ...editServiceData, staff: data });
      // setOpenWorkRation(true);
      // }
    }
    if (data) {
      if (selectedStaffId.includes(data._id)) {
        let index = selectedStaffId.indexOf(data._id);

        selectedStaffId.splice(index, 1);
      } else {
        selectedStaffId.push(data._id);
      }
      setSelectedStaffId([...selectedStaffId]);
    }
  };

  const SelectMultiStaff = (e) => {
    if(storeOnboardingTourStatus){
      setTimeout(() => {
        dispatch(setOnboardingCurrentTooltip("I5"));
      }, 250);
    }
    if (editServiceData) {
      setChange(true);
      let selectedIdData = selectedStaffId?.map((obj) => {
        return { id: obj };
      });

      let MatchData = selectedIdData
        .map((obj) => {
          return allStaff?.filter((resp) =>
            resp._id === obj.id ? resp : null
          );
        })
        .flat();
      let data;
      if (selectedStaffId?.length === editServiceData?.staff?.length) {
        let MatchsData = selectedIdData
          .map((obj) => {
            return editServiceData?.staff?.filter((resp) =>
              resp._id === obj.id ? resp : null
            );
          })
          .flat();
        data = MatchsData?.map((one) => {
          return {
            ...one,
            workRatio: parseFloat(
              (
                (editServiceData?.serviceflatdiscountedprice *
                  one?.workRationPercentage) /
                100
              ).toFixed(2),
              10
            ),
          };
        });
      } else {
        data = MatchData?.map((one) => {
          return {
            ...one,
            workRatio: parseFloat(
              (
                editServiceData?.serviceflatdiscountedprice / MatchData?.length
              ).toFixed(2),
              10
            ),
            workRationPercentage: parseFloat(100 / MatchData?.length, 10),
          };
        });
      }
      if (removeCusData?.length > 0) {
        removeCusData.push(Object.assign(data));
        setRemoveCusData([...removeCusData]);
      }
      let member = customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
      );
      let member1 = customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
      );
      let limitedZero = member?.filter((data) => data.availService > 0);
      let limitedZero1 = member1?.filter(
        (data) => data.availService === null || data.availService === 0
      );

      let MembershipServices;
      if (limitedZero?.length > 0 && customer?.membership === true) {
        MembershipServices = serviceDetails
          .map((items) => {
            return customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();
        setAvailService(MembershipServices);
      } else if (limitedZero1?.length > 0 && customer?.membership === true) {
        MembershipServices = serviceDetails
          .map((items) => {
            return customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();
        setAvailService(MembershipServices);
      } else {
        setAvailService([]);
      }
      if (selectedStaffId?.length === 1) {
        let editedService = serviceDetails?.map((serv) => {
          if (serv?.key === editServiceData?.key) {
            return { ...editServiceData, staff: data };
          } else {
            return serv;
          }
        });

        setServiceDetails(editedService);
        EditStaffforCustomer = editedService;
        MembershipApply(MembershipServices);
        setOpenWorkRation(false);
        setInvoiceDetail(!invoiceDetail);
        setSelectedStaffId([]);
      } else {
        setAddedServices({ ...editServiceData, staff: data });
        setOpenWorkRation(true);
      }
    } else {
      let selectedIdData = selectedStaffId?.map((obj) => {
        return { id: obj };
      });

      let MatchData = selectedIdData
        .map((obj) => {
          return allStaff?.filter((resp) =>
            resp._id === obj.id ? resp : null
          );
        })
        .flat();
      let data = MatchData.map((one) => {
        return {
          ...one,
          workRatio: parseFloat(
            (
              addedServices?.serviceflatdiscountedprice / MatchData.length
            ).toFixed(2),
            10
          ),
          workRationPercentage: parseFloat(100 / MatchData.length, 10),
        };
      });
      if (selectedStaffId?.length === 1) {
        serviceDetails.push({ ...addedServices, staff: data });
        // setServiceDetails([...serviceDetails]);
        setOpenWorkRation(false);
        if (removeCusData?.length > 0) {
          removeCusData.push(Object.assign(addedServices));
          setRemoveCusData([...removeCusData]);
        }
        let member = customer?.selectMembership?.filter(
          (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
        );
        let member1 = customer?.selectMembership?.filter(
          (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
        );
        let limitedZero = member?.filter((data) => data.availService > 0);
        let limitedZero1 = member1?.filter(
          (data) => data.availService === null || data.availService === 0
        );

        let MembershipServices;
        if (limitedZero?.length > 0 && customer?.membership === true) {
          MembershipServices = serviceDetails
            .map((items) => {
              return customer?.selectMembership[
                customer?.selectMembership?.length - 1
              ]?.selectedServices?.filter(
                (item) => item._id === items.serviceId
              );
            })
            .flat();
          setAvailService(MembershipServices);
        } else if (limitedZero1?.length > 0 && customer?.membership === true) {
          MembershipServices = serviceDetails
            .map((items) => {
              return customer?.selectMembership[
                customer?.selectMembership?.length - 1
              ]?.selectedServices?.filter(
                (item) => item._id === items.serviceId
              );
            })
            .flat();
          setAvailService(MembershipServices);
        } else {
          setAvailService([]);
        }

        if (selctedMemberShip.length > 0) {
          let memberss = customer?.selectMembership?.filter(
            (resp) => resp?.isExpire === true && resp?.validFor === "Limited"
          );

          let limitedZeross = memberss?.filter((data) => data.availService > 0);

          if (limitedZeross?.length > 0) {
            const MembershipSer = serviceDetails
              .map((items) => {
                return customer?.selectMembership[
                  customer?.selectMembership?.length - 1
                ]?.selectedServices?.filter(
                  (item) => item._id === items.serviceId
                );
              })
              .flat();

            setEditInvoiceAvailService(MembershipSer);
          } else {
            setEditInvoiceAvailService([]);
          }
        }
        if (!editServiceData) {
          setServiceDetails([...serviceDetails]);
        }
        setInvoiceDetail(!invoiceDetail);
        MembershipApply(MembershipServices);

        setSelectedStaffId([]);
      } else {
        setAddedServices({ ...addedServices, staff: data });
        setOpenWorkRation(true);
      }

      // setSelectedStaff(MatchData);
    }
  };

  const BacktoSelectMultipleStaff = () => {
    setOpenWorkRation(false);
  };

  const bindInput = (value) => {
    var regex = new RegExp("^[^0-9]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };
  const bindInputs = (value) => {
    var regex = new RegExp("^[^0-9.]*$");
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    );
    if (regex.test(key)) {
      value.preventDefault();
      return false;
    }
  };

  const MoveOnInvoice = () => {
    setSelectedStaffId([]);
    Object.assign(addedServices, {
      servicerate:
        addedServices?.serviceflatdiscountedprice > addedServices?.servicerate
          ? addedServices?.serviceflatdiscountedprice
          : addedServices?.servicerate,
      servicediscount:
        addedServices?.serviceflatdiscountedprice > addedServices?.servicerate
          ? 0
          : addedServices?.servicerate -
            addedServices?.serviceflatdiscountedprice,
    });
    setAddedServices(addedServices);
    // if(editServiceData){
    //   setEditServiceData(addedServices)
    // }
    ApiGet("service/company/" + userInfo.companyId).then((resp) => {
      let filterservice = resp.data.data.filter((obj) =>
        obj.categoryName === "Unassign" ? null : obj
      );
      if (isFrequentServiceOn) {
        let tempFrequentServices = filterservice?.filter(
          (ser) => ser?.frequentService
        );
        let tempSortedServices = tempFrequentServices?.sort(
          (a, b) => a?.index - b?.index
        );
        let nonFrequentServices = filterservice?.filter(
          (ser) => !ser.frequentService
        );
        tempSortedServices?.push(...nonFrequentServices);
        setAllServices(tempFrequentServices);
      } else {
        setAllServices(filterservice);
      }
    });

    if (editServiceData) {
      let ReplaceData = serviceDetails
        ?.map((one) => {
          if (one.key === editServiceData?.key) {
            return { ...addedServices };
          } else {
            return {
              ...one,
            };
          }
        })
        .flat();

      setServiceDetails(ReplaceData);
      // RegularTotal()
      EditStaffforCustomer = ReplaceData;
      setSubtotal(
        ReplaceData.map((item) => item.servicediscountedprice).reduce(
          (prev, curr) => prev + curr,
          0
        ) +
          cartItems
            .map((item) => item.flatdiscountedSubTotal)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.discountedPrice)
            .reduce((prev, curr) => prev + curr, 0)
      );
      setGst(
        (
          ReplaceData.map((item) => item.servicegstamount).reduce(
            (prev, curr) => prev + curr,
            0
          ) +
          cartItems
            .map((item) => item.discountedPriceGstAmount)
            .reduce((prev, curr) => prev + curr, 0) +
          selctedMemberShip
            .map((item) => item.gst)
            .reduce((prev, curr) => prev + curr, 0) -
          showDiscount
        ).toFixed(2)
      );
      let total = parseFloat(
        (
          (showDiscount
            ? ReplaceData.map((item) => item.servicediscountedprice).reduce(
                (prev, curr) => prev + curr,
                0
              ) +
              cartItems
                .map((item) => item.discountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0) -
              discountprice
            : ReplaceData.map((item) => item.servicediscountedprice).reduce(
                (prev, curr) => prev + curr,
                0
              ) +
              cartItems
                .map((item) => item.discountedSubTotal)
                .reduce((prev, curr) => prev + curr, 0)) +
          (ReplaceData.map((item) => item.servicegstamount).reduce(
            (prev, curr) => prev + curr,
            0
          ) +
            cartItems
              .map((item) => item.discountedPriceGstAmount)
              .reduce((prev, curr) => prev + curr, 0) -
            showDiscount) +
          selctedMemberShip
            .map((item) => item.discountedPrice + item.gst)
            .reduce((prev, curr) => prev + curr, 0)
        ).toFixed(2),
        10
      );
      setTotalAmount(total);
      if(editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet"|| editInvoice?.previousDueClearRecord ){

      }else{
      setCollectedAmount(parseInt(total) + (previousDue ? previousDue : 0));
      getUserWallet(customer, total);
      }
    } else {
      if (serviceDetails.includes(addedServices)) {
        let index = serviceDetails.indexOf(addedServices);
        serviceDetails.splice(index, 1);
      } else {
        serviceDetails.push(addedServices);
      }
      setServiceDetails([...serviceDetails]);
    }
    if (removeCusData?.length > 0) {
      // removeCusData.push(
      //   Object.assign(addedServices, {
      //     staffid: data?._id,
      //     staffname: data?.firstName + " " + data?.lastName,
      //   })
      // );
      setRemoveCusData([addedServices]);
    }
    let member = customer?.selectMembership?.filter(
      (resp) => resp?.isExpire === false && resp?.validFor === "Limited"
    );
    let member1 = customer?.selectMembership?.filter(
      (resp) => resp?.isExpire === false && resp?.validFor === "Unlimited"
    );
    let limitedZero = member?.filter((data) => data.availService > 0);
    let limitedZero1 = member1?.filter(
      (data) => data.availService === null || data.availService === 0
    );

    let MembershipServices;
    if (limitedZero?.length > 0 && customer?.membership === true) {
      MembershipServices = serviceDetails
        .map((items) => {
          return customer?.selectMembership[
            customer?.selectMembership?.length - 1
          ]?.selectedServices?.filter((item) => item._id === items.serviceId);
        })
        .flat();
      setAvailService(MembershipServices);
    } else if (limitedZero1?.length > 0 && customer?.membership === true) {
      MembershipServices = serviceDetails
        .map((items) => {
          return customer?.selectMembership[
            customer?.selectMembership?.length - 1
          ]?.selectedServices?.filter((item) => item._id === items.serviceId);
        })
        .flat();
      setAvailService(MembershipServices);
    } else {
      setAvailService([]);
    }

    if (selctedMemberShip.length > 0) {
      let memberss = customer?.selectMembership?.filter(
        (resp) => resp?.isExpire === true && resp?.validFor === "Limited"
      );

      let limitedZeross = memberss?.filter((data) => data.availService > 0);

      if (limitedZeross?.length > 0) {
        const MembershipSer = serviceDetails
          .map((items) => {
            return customer?.selectMembership[
              customer?.selectMembership?.length - 1
            ]?.selectedServices?.filter((item) => item._id === items.serviceId);
          })
          .flat();

        setEditInvoiceAvailService(MembershipSer);
      } else {
        setEditInvoiceAvailService([]);
      }
    }
    setInvoiceDetail(!invoiceDetail);

    MembershipApply(MembershipServices);
  };

  const BacktoInvoice = () => {
    setInvoiceDetail(!invoiceDetail);
    setSelectedStaff([]);
  };

  const EditServiceData = async (data) => {
    const serviceData = editServiceData?.staff?.map((resp) => {
      return resp._id;
    });
    if (data) {
      setOnMultipleStaff(true);
      setSelectedStaffId(serviceData);
      setOpenWorkRation(false);
      setEditServicesModal(false);
      setInvoiceDetail(true);
      setHideBackToService(true);
      setDiscountPerUnit(data[0]?.serviceflatdiscountedprice);
      setEditServiceData(data && data[0]);
      let datePayload = {
        startTime: moment(editServiceData?.date).format("YYYY-MM-DD"),
        endTime: moment(editServiceData?.date).add(1, "days").format("YYYY-MM-DD"),
      }
      let attendanceRes =  await ApiPost("attendence/company/" + userInfo.companyId, datePayload)
      let tempData = attendanceRes.data.data?.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      let tempAttendanceData = removeDuplicateObjectFromArray(tempData, "staffId");
      let thisDayAttendanceData = tempAttendanceData || [];
      try {
        let res = await ApiGet(
          "category/staff/data/day/" +
            editServiceData?.categoryId +
            "/" +
            moment(new Date()).format("dddd")
        );
        if (res.data.status === 200) {

          let availableStaff
          if (
            SettingInfo?.attendence?.attendanceToggle &&
            SettingInfo?.attendence?.attendanceForInvoiceToggle
          ) {  availableStaff = res.data.data?.filter((item) => thisDayAttendanceData?.find((data)=>data?.staffId === item?._id)?.currentStatus === "clockIn");
        }else{
          availableStaff=res.data.data
        }
          setAllStaff(availableStaff);
        } else {
        }
      } catch (err) {
        console.log("in the catch");
      }
    }
  };

  const ChangeStaffPrice = (e, data) => {
    if (
      e.target.value == 0 ||
      e.target.value == "" ||
      e.target.value == addedServices?.serviceflatdiscountedprice
    ) {
      setRatioChange(false);
    } else {
      setRatioChange(true);
    }
    if (addedServices.serviceflatdiscountedprice >= e.target.value) {
      let filter = addedServices?.staff?.map((one) => {
        if (one._id === data._id) {
          return {
            ...one,
            workRatio:
              e.target.value === "" ? "" : parseFloat(e.target.value, 10),
            workRationPercentage: parseFloat(
              (
                (e.target.value * 100) /
                addedServices?.serviceflatdiscountedprice
              ).toFixed(2),
              10
            ),
          };
        } else {
          return {
            ...one,
            workRatio:
              addedServices?.staff?.length === 2
                ? parseFloat(
                    (
                      addedServices?.serviceflatdiscountedprice - e.target.value
                    ).toFixed(2),
                    10
                  )
                : one?.workRatio,
            workRationPercentage:
              addedServices?.staff?.length === 2
                ? parseFloat(
                    (
                      100 -
                      (e.target.value * 100) /
                        addedServices?.serviceflatdiscountedprice
                    ).toFixed(2),
                    10
                  )
                : one?.workRationPercentage,
          };
        }
      });
      setAddedServices({ ...addedServices, staff: filter });
    }
  };

  const ChangeFinalAmount = (e) => {
    setDiscountPerUnit(e.target.value);
    let ChangePrice = addedServices?.staff?.map((one) => {
      return {
        ...one,
        workRatio:
          e.target.value === ""
            ? 0
            : parseFloat(
                (
                  (parseInt(e.target.value, 10) * one?.workRationPercentage) /
                  100
                ).toFixed(2),
                10
              ),
      };
    });
    Object.assign(addedServices, {
      servicediscountedprice: parseInt(e.target.value, 10),
      serviceflatdiscountedprice: parseInt(e.target.value, 10),
      staff: ChangePrice,
      // servicerate:
      //   e.target.value > addedServices?.serviceflatdiscountedprice
      //     ? parseInt(e.target.value, 10)
      //     : addedServices?.servicerate,
      servicegstamount: parseFloat(
        (
          (parseInt(e.target.value, 10) * addedServices?.servicegst) /
          100
        ).toFixed(2),
        10
      ),
      servicesubtotal:
        parseInt(e.target.value, 10) +
        parseFloat(
          (
            (parseInt(e.target.value, 10) * addedServices?.servicegst) /
            100
          ).toFixed(2),
          10
        ),
      // servicediscount:
      //   e.target.value > addedServices?.serviceflatdiscountedprice
      //     ? 0
      //     : addedServices?.servicerate - parseInt(e.target.value, 10),
    });

    setAddedServices(addedServices);
    if (editServiceData) {
      setEditServiceData(addedServices);
    }
  };

  const SelectFullDate = (data) => {
    setCreatedDate(data);
  };

  return (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}>
      <div

      className="cus-modal">
        <div className="modal-header">
          <div className="container-long">
            {/* modal header */}
            <div className="modal-header-alignment">
              <div
                className="modal-heading-title"
                style={{
                  pointerEvents:
                    storeOnboardingTourStatus === true &&
                    storeOnboardingCurrentTooltip.includes("I") &&
                    "all",
                }}
              >
                <div
                  onClick={() => {
                    props.toggle();
                    storeOnboardingTourStatus && props.closeTourOnClose();
                  }}
                  className="modal-close"
                >
                  <img src={CloseIcon} alt="CloseIcon" />
                </div>
                <div className="modal-title">
                  {editInvoice ? (
                    <h2>Edit Invoice #{editInvoice.invoiceId}</h2>
                  ) : (
                    <h2>Generate New Invoice</h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="container">
            {addMemberShip ? (
              addProduct ? (
                addServices ? (
                  <div className="modal-body-top-align">
                    <div className="generate-box-center">
                      {pastInvoice && dateSelection ? (
                        <div className="new-appointment-box-child">
                          <div className="date-picker-modal-height">
                            <div className="title-text-style-alignment">
                              <p>Select a Date</p>
                            </div>
                            <div className="appointment-date">
                              <div className="form-group relative">
                                <label>Select a Date</label>

                                <DatePicker
                                  selected={createdDate}
                                  onChange={SelectFullDate}
                                  dateFormat="dd-MM-yyyy"
                                  placeholderText="Date"
                                  fixedHeight
                                  maxDate={moment().subtract(1, "days")._d}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="date-next-step-button-align">
                            <button
                              onClick={() => setDateSelection(!dateSelection)}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="generate-box">
                          {back ? (
                            <div
                              onClick={() => BacktoCheckout()}
                              className="back-arrow-alignment"
                            >
                              <img src={BackArrowService} alt="UserAdd" />
                            </div>
                          ) : null}
                          {!back && pastInvoice ? (
                            <div
                              onClick={() => setDateSelection(!dateSelection)}
                              className="back-arrow-alignment"
                            >
                              <img src={BackArrowService} alt="UserAdd" />
                            </div>
                          ) : null}
                          <div className="title-text">
                            <h3>Select items</h3>
                          </div>
                          <div className="new-invoice-heading">
                            <div
                              onClick={() => setAddServices(!addServices)}
                              className="service-alignment"
                            >
                              <div className="service-name">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_3430_7279)">
                                    <path
                                      d="M8.36951 15.8696C8.36951 14.4889 7.25022 13.3696 5.86951 13.3696C4.48879 13.3696 3.36951 14.4889 3.36951 15.8696C3.36951 17.2503 4.48879 18.3696 5.86951 18.3696C7.25022 18.3696 8.36951 17.2503 8.36951 15.8696Z"
                                      stroke="#193566"
                                      stroke-width="1.75"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M16.8478 15.8696C16.8478 14.4889 15.7285 13.3696 14.3478 13.3696C12.9671 13.3696 11.8478 14.4889 11.8478 15.8696C11.8478 17.2503 12.9671 18.3696 14.3478 18.3696C15.7285 18.3696 16.8478 17.2503 16.8478 15.8696Z"
                                      stroke="#193566"
                                      stroke-width="1.75"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M6.52227 1.35091L13.5226 13.4759"
                                      stroke="#193566"
                                      stroke-width="1.75"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M7.34692 13.4761L10.3309 8.30776"
                                      stroke="#193566"
                                      stroke-width="1.75"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M12.2034 5.32715L14.6216 1.13865"
                                      stroke="#193566"
                                      stroke-width="1.75"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_3430_7279">
                                      <rect
                                        width="20"
                                        height="20"
                                        fill="white"
                                        transform="translate(0 20) rotate(-90)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>

                                <span>Add Services</span>
                              </div>
                              <div className="more-service">
                                <img src={RightIcon} alt="RightIcon" />
                              </div>
                            </div>
                            {inventory ? (
                              <div
                                onClick={(e) => selectProduct(e)}
                                className="service-alignment"
                              >
                                <div className="service-name">
                                  <img
                                    src={ProductButton}
                                    alt="ProductButton"
                                  />
                                  <span>Add Product</span>
                                </div>
                                <div className="more-service">
                                  <img src={RightIcon} alt="RightIcon" />
                                </div>
                              </div>
                            ) : null}
                            {isMembership &&
                              (Invoicess.membershipDetail.length >
                              0 ? null : customer ? (
                                customer.membership === true ? null : (
                                  <div
                                    className="service-alignment"
                                    onClick={() => selectMembershipOption()}
                                  >
                                    <div className="service-name">
                                      <img
                                        src={MembershipButton}
                                        alt="ProductButton"
                                      />
                                      <span>Add Membership</span>
                                    </div>
                                    <div className="more-service">
                                      <img src={RightIcon} alt="RightIcon" />
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div
                                  className="service-alignment"
                                  onClick={() => selectMembershipOption()}
                                >
                                  <div className="service-name">
                                    <img
                                      src={MembershipButton}
                                      alt="ProductButton"
                                    />
                                    <span>Add Membership</span>
                                  </div>
                                  <div className="more-service">
                                    <img src={RightIcon} alt="RightIcon" />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : selectService ? (
                  <div className="modal-body-top-align">
                    <div className="generate-box-center relative">
                      {/* generate invoice box */}

                      {/* generate invoice box */}
                      <div
                        className="generate-box right-space-remove"
                        style={{
                          pointerEvents:
                            storeOnboardingTourStatus === true && "all",
                        }}
                      >
                        <div className="modal-sub-title-sticky">
                          <div
                            onClick={BackToSelectItem}
                            className="back-arrow-alignment"
                          >
                            <img
                              // onClick={BackToSelectItem}
                              src={BackArrowService}
                              alt="UserAdd"
                            />
                          </div>
                          <div className="title-text right-space-align">
                            <h3>Select a Services</h3>
                          </div>
                        </div>
                      
                        <div className="select-service-search right-space-align right-space-align-search-input">
                          <input
                            type="search"
                            name="q"
                            placeholder={
                              storeOnboardingTourStatus
                                ? "Search service, category or amount"
                                : "Search service or category name"
                            }
                            onChange={(e) => {
                              handleServiceSearch(e);
                            }}
                            autoFocus
                          />
                          <div className="search-icon-align">
                            <img src={SearchIcon} alt="SearchIcon" />
                          </div>
                        </div>
                          {storeOnboardingCurrentTooltip === "I3" && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                          
                          className="generate-invoice-tooltip">
                                <p>
                                  Select any of the service. You can search
                                  service with its name, category or amount as
                                  well
                                </p>
                              </motion.div>   
                          )} 
                        <div className="frquent-service-text">
                          {/* <p>Frequent services</p> */}
                        </div>
                       
                        <div className="main-service-box-list">
                          <ul className="relative">
                           
                            {searchKeyword && (
                              <p className="frequnt-service-text-alignment">
                                Search results
                              </p>
                            )}
                            {allServices?.length > 0 ? (
                              <>
                                {!searchKeyword && isFrequentServiceOn ? (
                                  <>
                                    <div>
                                      {!searchKeyword && (
                                        <p className="frequnt-service-text-alignment">
                                          Frequent services
                                        </p>
                                      )}
                                      {allFrequentServices?.map(
                                        (character, index) => (
                                          <HandleServiceNavigation
                                            // setFocus={setFocus}
                                            index={index}
                                            // focus={focus === index}
                                            character={character}
                                            SettingInfo={SettingInfo}
                                            getAllSelectStaff={
                                              getAllSelectStaff
                                            }
                                            storeOnboardingTourStatus={
                                              storeOnboardingTourStatus
                                            }
                                            storeOnboardingCurrentTooltip={
                                              storeOnboardingCurrentTooltip
                                            }
                                            // setSelected={setSelected}
                                            // setHovered={setHovered}
                                            // active={index === cursor}
                                          />
                                        )
                                      )}
                                    </div>
                                    <div>
                                      {!searchKeyword && (
                                        <p className="frequnt-service-text-alignment">
                                          Services
                                        </p>
                                      )}
                                      {allNonFrequentServices?.map(
                                        (character, index) => (
                                          <HandleServiceNavigation
                                            // setFocus={setFocus}
                                            index={index}
                                            // focus={focus === index}
                                            character={character}
                                            SettingInfo={SettingInfo}
                                            getAllSelectStaff={
                                              getAllSelectStaff
                                            }
                                            storeOnboardingTourStatus={
                                              storeOnboardingTourStatus
                                            }
                                            storeOnboardingCurrentTooltip={
                                              storeOnboardingCurrentTooltip
                                            }
                                            // setSelected={setSelected}
                                            // setHovered={setHovered}
                                            // active={index === cursor}
                                          />
                                        )
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  allServices?.map((character, index) => (
                                    <HandleServiceNavigation
                                      // setFocus={setFocus}
                                      index={index}
                                      // focus={focus === index}
                                      character={character}
                                      SettingInfo={SettingInfo}
                                      getAllSelectStaff={getAllSelectStaff}
                                      storeOnboardingTourStatus={
                                        storeOnboardingTourStatus
                                      }
                                      storeOnboardingCurrentTooltip={
                                        storeOnboardingCurrentTooltip
                                      }
                                      // setSelected={setSelected}
                                      // setHovered={setHovered}
                                      // active={index === cursor}
                                    />
                                  ))
                                )}
                              </>
                            ) : (
                              <div className="text-center mt-2 font-medium heading-title-text-color system-does-not">
                                <p>System does not have this service data</p>
                              </div>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : invoiceDetail ? (
                  <>
                    {openWorkRation ? (
                      <div className="select-staff-box-alignment">
                        <div className="select-staff-box">
                          <div className="select-staff-space-alignment select-staff-space-alignment-box">
                            <div className="modal-sub-title-sticky">
                              <div
                                onClick={BacktoSelectMultipleStaff}
                                className="back-arrow-alignment"
                              >
                                <img src={BackArrowStaff} alt="UserAdd" />
                              </div>
                              <div className="title-text">
                                <h5>Staff work ratio</h5>
                              </div>
                            </div>
                            <div className="wash-service-box-height">
                              <div
                                className="treatement-head-color"
                                style={{
                                  backgroundColor: addedServices?.colour,
                                }}
                              ></div>
                              <div className="wash-service-alignment">
                                <p>{addedServices?.servicename}</p>
                                <h2>
                                  <span>{SettingInfo?.currentType}</span>
                                  {addedServices.servicerate}
                                </h2>
                              </div>
                              <div className="final-price-input">
                                <label>Final price</label>
                                <div className="final-price-relative-div">
                                  {editInvoice?.balanceAmountRecord ||
                                  editInvoice?.dueAmountRecord ||
                                  editInvoice?.splitPayment[0]?.method ===
                                    "Wallet"|| editInvoice?.previousDueClearRecord ? (
                                    <input
                                      type="text"
                                      placeholder="Enter final price"
                                      name=""
                                      value={discountPerUnit}
                                      onKeyPress={bindInput}
                                      disabled
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="Enter final price"
                                      name=""
                                      value={discountPerUnit}
                                      onKeyPress={bindInput}
                                      onChange={(e) => ChangeFinalAmount(e)}
                                    />
                                  )}
                                  <div className="rupees-alignment-left">
                                    <a>{SettingInfo?.currentType}</a>
                                  </div>
                                </div>
                              </div>
                              <div className="staff-ratio-alignment">
                                {addedServices?.staff?.map((stf) => {
                                  return (
                                    <div
                                      className={
                                        stf?.workRatio == 0 || ""
                                          ? "alret-box-alignment-red"
                                          : "alret-box-alignment"
                                      }
                                    >
                                      <div>
                                        <p>
                                          {stf?.firstName + " " + stf?.lastName}
                                        </p>
                                        <span>
                                          {stf?.workRationPercentage.toFixed(2)}
                                          %
                                        </span>
                                      </div>
                                      <div className="staff-work-input-rupees-alignment">
                                        <input
                                          type="text"
                                          onChange={(e) =>
                                            ChangeStaffPrice(e, stf)
                                          }
                                          value={stf?.workRatio}
                                          onKeyPress={bindInputs}
                                        />
                                        <div className="staff-ruppes-alignment">
                                          <a>{SettingInfo?.currentType}</a>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="select-staff-modal-footer">
                            <div className="single-select-staff-continue-button">
                              {ratioChange ? (
                                Math.round(
                                  addedServices?.staff
                                    .map((item) => item.workRatio)
                                    .reduce((prev, curr) => prev + curr, 0)
                                ) ==
                                Math.round(
                                  addedServices?.serviceflatdiscountedprice
                                ) ? (
                                  <button onClick={MoveOnInvoice}>
                                    Continue
                                  </button>
                                ) : (
                                  <button disabled>Continue</button>
                                )
                              ) : (
                                <button disabled>Continue</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // </div>
                      <div
                        className="select-staff-box-alignment"
                        style={{
                          pointerEvents:
                            storeOnboardingTourStatus === true && "all",
                        }}
                      >
                        <div className="select-staff-box">
                          <div className="select-staff-space-alignment select-staff-space-alignment-box padding-right-remove">
                            <div className="modal-sub-title-sticky padding-right-all-child-box-alignment">
                              {hideBackToService ? (
                                <div
                                  onClick={BacktoInvoice}
                                  className="back-arrow-alignment"
                                >
                                  <img src={BackArrowStaff} alt="UserAdd" />
                                </div>
                              ) : (
                                <div
                                  onClick={BacktoSelectService}
                                  className="back-arrow-alignment"
                                >
                                  <img src={BackArrowStaff} alt="UserAdd" />
                                </div>
                              )}

                              <div className="title-text">
                                <h5>
                                  {onMultipleStaff
                                    ? "Select Multiple Staff"
                                    : "Select a Staff"}
                                </h5>
                              </div>
                              <div className="flex justify-center">
                                <span className="service-staff-head">
                                  <button>
                                    {editServiceData
                                      ? editServiceData?.servicename
                                      : addedServices?.servicename}
                                  </button>
                                </span>
                              </div>
                            </div>
                            {/* <div className="select-service-search padding-right-all-child-box-alignment">
                              <input
                                type="search"
                                placeholder="Search staff name"
                                onChange={(e) => {
                                  handleStaffSearch(e);
                                }}
                              />
                              <div className="select-service-icon-center">
                                <img src={SearchIcon} alt="SearchIcon" />
                              </div>
                            </div> */}
                            <div className="relative">
                              {storeOnboardingCurrentTooltip === "I4" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                                
                                className="generate-invoice-tooltip1">
                                  <p>
                                    Select any of the staff. Write how staff
                                    gets filter through their assign service
                                  </p>
                                </motion.div>
                              )}
                              <div
                                className={
                                  SettingInfo?.multipleStaff
                                    ?.assignMultipleStaff
                                    ? "staff-box-height-fix staff-box-height-fix-top-alignment padding-right-all-child-box-alignment"
                                    : "staff-box-height-fix staff-box-height-fix-top-alignments padding-right-all-child-box-alignment"
                                }
                              >
                                {allStaff?.length > 0 ? (
                                  sortStaff?.map((item, index) => {
                                    return onMultipleStaff ? (
                                      <div
                                        className={
                                          selectedStaffId?.includes(item._id)
                                            ? "select-staff-name-disable"
                                            : "select-staff-name "
                                        }
                                        onClick={() =>
                                          SelectMultipleStaff(item)
                                        }
                                      >
                                        <p>
                                          {item.firstName}{" "}
                                          {item.lastName ? item.lastName : ""}
                                        </p>
                                        {selectedStaffId?.includes(item._id) ? (
                                          <img src={TrueIcon} alt="TrueIcon" />
                                        ) : null}
                                      </div>
                                    ) : (
                                      <div
                                        className={`select-staff-name ${
                                          index === cursor ? "active" : ""
                                        }`}
                                        onClick={() => modal(item)}
                                      >
                                        <p>
                                          {item.firstName}{" "}
                                          {item.lastName ? item.lastName : ""}
                                        </p>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="system-does-not text-center mt-2 font-medium heading-title-text-color">
                                    <p>
                                      System does not have this person's data
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* // <HandleStaffNavigation
                        //   focus={focus === index}
                        //   setFocus={setFocus}
                        //   index={index}
                        //   modal={modal}
                        //   active={index === cursor}
                        //   item={item}
                        //   setSelected={setSelected}
                        //   setHovered={setHovered}
                        // /> */}
                          {/* <div className="wash-service-box-footer">
                            <button>Continue</button>
                          </div> */}
                          {/* <div className="select-staff-modal-footer">
                            <div className="single-select-staff"> */}
                          {onMultipleStaff ? (
                            <>
                              <div className="select-staff-modal-footer">
                                <div className="single-select-staff">
                                  {/* <div>
                                    <img src={SignleStaff} alt="SignleStaff" />
                                  </div>
                                  <div onClick={SingleStaff}>
                                    <span>Select Single Staff </span>
                                  </div> */}
                                </div>
                                <div className="single-select-staff-continue-button">
                                  {selectedStaffId.length >= 1 ? (
                                    <button
                                      onClick={(e) => SelectMultiStaff(e)}
                                    >
                                      Continue
                                    </button>
                                  ) : (
                                    <button disabled>Continue</button>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : SettingInfo?.multipleStaff
                              ?.assignMultipleStaff ? (
                            <>
                              <div className="select-staff-modal-footer">
                                <div className="single-select-staff">
                                  <div>
                                    <img src={MultiStaff} alt="SignleStaff" />
                                  </div>
                                  <div onClick={MultipleStaff}>
                                    <span>Select Multiple Staff </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {/* </div> */}
                          {/* {onMultipleStaff ? (
                              selectedStaffId.length >= 2 ? (
                                <div className="single-select-staff-continue-button">
                                  <button onClick={(e) => SelectMultiStaff(e)}>
                                    Continue
                                  </button>
                                </div>
                              ) : (
                                <div className="single-select-staff-continue-button">
                                  <button
                                    onClick={(e) => SelectMultiStaff(e)}
                                    disabled
                                  >
                                    Continue
                                  </button>
                                </div>
                              )
                            ) : (
                              ""
                            )} */}
                        </div>
                        {/* <div onClick={MultipleStaff}>Select multiple staff</div> */}
                      </div>
                      // </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="modal-body add-new-appointment-tablet-view-space-remove">
                      <div className="container">
                        <div className="modal-body-top-align flex justify-center">
                          <div className="edit-invoice-grid relative">
                            {storeOnboardingTourStatus &&
                              storeOnboardingTooltipStatus &&
                              storeOnboardingCurrentTooltip === "I5" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                                 className="add-more-tooltip tooltip-I5">
                                  <div className="invoice-tooltip-design">
                                    <h3>Add more services or products</h3>
                                    <p>
                                      You can add more products and services
                                      through here
                                    </p>
                                    <div className="button-alignment">
                                      <div>
                                        {/* <Link to='/barberatasklist'> */}
                                        <span
                                          onClick={(e) => {
                                            dispatch(
                                              setOnboardingTourStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingTooltipStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingCurrentTooltip("")
                                            );
                                          }}
                                        >
                                          Close Tour
                                        </span>
                                        {/* </Link> */}
                                      </div>
                                      <div>
                                        <button
                                          onClick={(e) =>
                                            dispatch(
                                              setOnboardingCurrentTooltip("I6")
                                            )
                                          }
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tooltip-dot-design">
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="zoom-dot" />
                                      <div />
                                      <div />
                                      <div />
                                      <div />
                                      <div />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            {storeOnboardingTourStatus &&
                              storeOnboardingTooltipStatus &&
                              storeOnboardingCurrentTooltip === "I6" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                                
                                className="add-more-tooltip tooltip-I6">
                                  <div className="invoice-tooltip-design">
                                    <h3>Edit service</h3>
                                    <p>
                                      Edit service, add discount, increase final
                                      amount
                                    </p>
                                    <div className="button-alignment">
                                      <div>
                                        {/* <Link to='/barberatasklist'> */}
                                        <span
                                          onClick={(e) => {
                                            dispatch(
                                              setOnboardingTourStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingTooltipStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingCurrentTooltip("")
                                            );
                                          }}
                                        >
                                          Close Tour
                                        </span>
                                        {/* </Link> */}
                                      </div>
                                      <div>
                                        <button
                                          onClick={(e) =>
                                            dispatch(
                                              setOnboardingCurrentTooltip("I7")
                                            )
                                          }
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tooltip-dot-design">
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="zoom-dot" />
                                      <div />
                                      <div />
                                      <div />
                                      <div />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            {storeOnboardingTourStatus &&
                              storeOnboardingTooltipStatus &&
                              storeOnboardingCurrentTooltip === "I7" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                                
                                className="setting-profile-tooltip tooltip-I7">
                                  <div className="invoice-tooltip-design">
                                    <h3>Add discount</h3>
                                    <p>Add discount</p>
                                    <div className="button-alignment">
                                      <div>
                                        {/* <Link to='/barberatasklist'> */}
                                        <span
                                          onClick={(e) => {
                                            dispatch(
                                              setOnboardingTourStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingTooltipStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingCurrentTooltip("")
                                            );
                                          }}
                                        >
                                          Close Tour
                                        </span>
                                        {/* </Link> */}
                                      </div>
                                      <div>
                                        {/* uncomment to show 'due payment tooltip' */}
                                        {/* <button onClick={(e)=>dispatch(setOnboardingCurrentTooltip("I8"))}>Next</button>*/}
                                        <button
                                          onClick={(e) =>
                                            dispatch(
                                              setOnboardingCurrentTooltip("I9")
                                            )
                                          }
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tooltip-dot-design">
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="zoom-dot" />
                                      <div />
                                      <div />
                                      <div />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            {storeOnboardingTourStatus &&
                              storeOnboardingTooltipStatus &&
                              storeOnboardingCurrentTooltip === "I11" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                                
                                className="setting-profile-tooltip tooltip-I8">
                                  <div className="invoice-tooltip-design">
                                    <h3>Add due/advance amount</h3>
                                    <p>Add due/advance amount</p>
                                    <div className="button-alignment">
                                      <div>
                                        {/* <Link to='/barberatasklist'> */}
                                        <span
                                          onClick={(e) => {
                                            dispatch(
                                              setOnboardingTourStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingTooltipStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingCurrentTooltip("")
                                            );
                                          }}
                                        >
                                          Close Tour
                                        </span>
                                        {/* </Link> */}
                                      </div>
                                      <div>
                                        <button
                                          onClick={(e) =>
                                            dispatch(
                                              setOnboardingCurrentTooltip("I12")
                                            )
                                          }
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tooltip-dot-design">
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="zoom-dot" />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            {storeOnboardingTourStatus &&
                              storeOnboardingTooltipStatus &&
                              storeOnboardingCurrentTooltip === "I9" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                                
                                className="setting-profile-tooltip tooltip-I9">
                                  <div className="invoice-tooltip-design">
                                    <h3>Split payment</h3>
                                    <p>Split payment feature explanation</p>
                                    <div className="button-alignment">
                                      <div>
                                        {/* <Link to='/barberatasklist'> */}
                                        <span
                                          onClick={(e) => {
                                            dispatch(
                                              setOnboardingTourStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingTooltipStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingCurrentTooltip("")
                                            );
                                          }}
                                        >
                                          Close Tour
                                        </span>
                                        {/* </Link> */}
                                      </div>
                                      <div>
                                        <button
                                          onClick={(e) => { getAllCustomer();
                                            dispatch(
                                              setOnboardingCurrentTooltip("I10")
                                            )}
                                          }
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tooltip-dot-design">
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="zoom-dot" />
                                      <div />
                                      <div />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            {storeOnboardingTourStatus &&
                              storeOnboardingTooltipStatus &&
                              storeOnboardingCurrentTooltip === "I10" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                                
                                className="add-more-tooltip tooltip-I10">
                                  <div className="invoice-tooltip-design">
                                    <h3>Add customer</h3>
                                    <p>
                                      Add customer Search 99999 9999 and add the
                                      salon profile as a customer for demo
                                      purposes
                                    </p>
                                    <div className="button-alignment">
                                      <div>
                                        {/* <Link to='/barberatasklist'> */}
                                        <span
                                          onClick={(e) => {
                                            dispatch(
                                              setOnboardingTourStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingTooltipStatus(false)
                                            );
                                            dispatch(
                                              setOnboardingCurrentTooltip("")
                                            );
                                          }}
                                        >
                                          Close Tour
                                        </span>
                                        {/* </Link> */}
                                      </div>
                                      <div>
                                        <button
                                          onClick={(e) =>
                                            onboardingSelectCustomer()
                                          }
                                        >
                                          Got it!
                                        </button>
                                      </div>
                                    </div>
                                    <div className="tooltip-dot-design">
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="active-small-dot" />
                                      <div className="zoom-dot" />
                                      <div />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                               
                                 {storeOnboardingCurrentTooltip === "I12" && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
                          
                          className="setting-profile-tooltips ">
                                <p>
                                Click here to generate this invoice
                                </p>
                              </motion.div>   
                          )} 
                            <div
                              className="edit-invoice-grid-items relative"
                              ref={wrapperRef}
                            >
                              <div
                                className={
                                  customer
                                    ? "add-more-space-remove add-customer-box"
                                    : selctedMemberShip.length > 0
                                    ? "add-customer-box-alert relative"
                                    : "add-customer-box relative"
                                }
                                ref={btnDropdownRef}
                              >
                                {" "}
                                <div>
                                  {customer ? (
                                    <>
                                      <div className="add-customer-detail">
                                        <div className="cus-grid">
                                          <div className="cus-grid-items">
                                            {customer?.selectMembership?.slice(
                                              -1
                                            )[0]?.isExpire === false ? (
                                              customer?.selectMembership?.slice(
                                                -1
                                              )[0]?.cardColur ===
                                              "rgb(248, 226, 124)" ? (
                                                <img
                                                  src={YellowMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : customer?.selectMembership?.slice(
                                                  -1
                                                )[0]?.cardColur ===
                                                "rgb(248, 163, 121)" ? (
                                                <img
                                                  src={OrangeMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : customer?.selectMembership?.slice(
                                                  -1
                                                )[0]?.cardColur ===
                                                "rgb(109, 200, 199)" ? (
                                                <img
                                                  src={SkyBlueMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : customer?.selectMembership?.slice(
                                                  -1
                                                )[0]?.cardColur ===
                                                "rgb(72, 148, 248)" ? (
                                                <img
                                                  src={BlueMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : (
                                                <img
                                                  src={membershipProfileSmall}
                                                  alt="ProfileImage"
                                                />
                                              )
                                            ) : (
                                              <div className="profile-image">
                                                {" "}
                                                {customer?.firstName === "" ||
                                                customer?.firstName === null ||
                                                customer?.firstName ===
                                                  undefined
                                                  ? ""
                                                  : customer.firstName[0].toUpperCase()}
                                                {customer?.lastName === "" ||
                                                customer?.lastName === null ||
                                                customer?.lastName === undefined
                                                  ? ""
                                                  : customer?.lastName[0].toUpperCase()}
                                              </div>
                                            )}
                                            {/* {
                                            customer?.membership ? 
                                            <img
                                              src={BlueMembership}
                                              alt="ProfileImage"
                                            /> :   <div className="profile-image">
                                            {" "}
                                            {customer?.firstName === "" ||
                                            customer?.firstName === null ||
                                            customer?.firstName === undefined
                                              ? ""
                                              : customer.firstName[0].toUpperCase()}
                                            {customer?.lastName === "" ||
                                            customer?.lastName === null ||
                                            customer?.lastName === undefined
                                              ? ""
                                              : customer?.lastName[0].toUpperCase()}
                                          </div>
                                          } */}
                                          </div>
                                          <div
                                            className="cus-grid-items close-icon-alignment-profile"
                                            onClick={SelectOtherCustomer}
                                          >
                                            <div>
                                              <p>
                                                {customer.firstName}{" "}
                                                {customer.lastName}
                                              </p>
                                              <span>
                                                {customer.mobileNumber}
                                              </span>
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              {walletBalance > 0 && (
                                                <div className="Invoice-Balance-status">
                                                  <button>
                                                    Bal
                                                    <span className="pl-1 pr-1">
                                                      {" "}
                                                      {
                                                        SettingInfo?.currentType
                                                      }{" "}
                                                    </span>{" "}
                                                    {walletBalance}
                                                  </button>
                                                </div>
                                              )}
                                              {walletBalance < 0 && (
                                                <div className="Invoice-Due-status">
                                                  <button className="flex items-center">
                                                    Due{" "}
                                                    <span className="pl-1 pr-1">
                                                      {" "}
                                                      {
                                                        SettingInfo?.currentType
                                                      }{" "}
                                                    </span>{" "}
                                                    {Math.abs(walletBalance)}
                                                  </button>
                                                </div>
                                              )}
                                              {editInvoice ? null : (
                                                <div>
                                                  <img
                                                    src={CloseBtn}
                                                    alt="CloseIcon"
                                                    onClick={() =>
                                                      RemoveCustomer()
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div
                                      style={{
                                        pointerEvents:
                                          storeOnboardingTourStatus === true &&
                                          storeOnboardingCurrentTooltip !==
                                            "I10" &&
                                          "none",
                                      }}
                                      className="grid pointer"
                                      onClick={() => {
                                        storeOnboardingTourStatus &&
                                        storeOnboardingCurrentTooltip === "I10"
                                          ? onboardingSelectCustomer()
                                          : productDropdown
                                          ? closeDropdownPopover()
                                          : openDropdownPopover();
                                      }}
                                    >
                                      <div className="grid-items">
                                        <div className="add-box">
                                          <img src={UserAdd} alt="UserAdd" />
                                        </div>
                                      </div>
                                      <div className="grid-items">
                                        <p>Add customer</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div
                                  ref={popoverDropdownRef}
                                  className={
                                    productDropdown
                                      ? "add-customer-dropdown add-customer-dropdown-show"
                                      : "add-customer-dropdown-hidden add-customer-dropdown"
                                  }
                                >
                                  <div className="add-new-cus-height-modal">
                                    <div className="add-customer-dropdown-align">
                                      <div className="search-grid">
                                        <div className="search-grid-items">
                                          <input
                                            type="text"
                                            value={search}
                                            placeholder="Search mobile number or name"
                                            onChange={(e) =>
                                              handleCustomerSearch(e)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="sub-spacing-align">
                                      <div
                                        className="add-new-cus"
                                        onClick={AddCustomer}
                                      >
                                        <p>+ Add new customer</p>
                                      </div>
                                    </div>
                                    {allCustomer?.length === 0 ? (
                                      <div className="cus-does-not-exist">
                                        <p>
                                          This customer does not exist in the
                                          data. Click on
                                          <span> + Add new customer</span> to
                                          add new
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="modal-cancel-show-align-modal">
                                        {allCustomer &&
                                          allCustomer.map((cus, index) => {
                                            return (
                                              <div
                                                key={cus._id}
                                                className="add-customer-details"
                                              >
                                                <div className="cus-grid">
                                                  <div className="cus-grid-items">
                                                    {cus?.selectMembership?.slice(
                                                      -1
                                                    )[0]?.isExpire === false ? (
                                                      cus?.selectMembership?.slice(
                                                        -1
                                                      )[0]?.cardColur ===
                                                      "rgb(248, 226, 124)" ? (
                                                        <img
                                                          src={YellowMembership}
                                                          alt="ProfileImage"
                                                        />
                                                      ) : cus?.selectMembership?.slice(
                                                          -1
                                                        )[0]?.cardColur ===
                                                        "rgb(248, 163, 121)" ? (
                                                        <img
                                                          src={OrangeMembership}
                                                          alt="ProfileImage"
                                                        />
                                                      ) : cus?.selectMembership?.slice(
                                                          -1
                                                        )[0]?.cardColur ===
                                                        "rgb(109, 200, 199)" ? (
                                                        <img
                                                          src={
                                                            SkyBlueMembership
                                                          }
                                                          alt="ProfileImage"
                                                        />
                                                      ) : cus?.selectMembership?.slice(
                                                          -1
                                                        )[0]?.cardColur ===
                                                        "rgb(72, 148, 248)" ? (
                                                        <img
                                                          src={BlueMembership}
                                                          alt="ProfileImage"
                                                        />
                                                      ) : (
                                                        <img
                                                          src={
                                                            membershipProfileSmall
                                                          }
                                                          alt="ProfileImage"
                                                        />
                                                      )
                                                    ) : (
                                                      <div className="profile-image">
                                                        {" "}
                                                        {cus.firstName === "" ||
                                                        cus.firstName ===
                                                          null ||
                                                        cus.firstName ===
                                                          undefined
                                                          ? ""
                                                          : cus.firstName[0].toUpperCase()}
                                                        {cus.lastName === "" ||
                                                        cus.lastName === null ||
                                                        cus.lastName ===
                                                          undefined
                                                          ? ""
                                                          : cus.lastName[0].toUpperCase()}
                                                      </div>
                                                    )}
                                                    {/* {
                                                    )}
                                                    {/* {
                                                      cus?.membership ? 
                                                      <img
                                                        src={BlueMembership}
                                                        alt="ProfileImage"
                                                      /> : <div className="profile-image">
                                                      {" "}
                                                      {cus.firstName === "" ||
                                                      cus.firstName ===
                                                        null ||
                                                      cus.firstName ===
                                                        undefined
                                                        ? ""
                                                        : cus.firstName[0].toUpperCase()}
                                                      {cus.lastName === "" ||
                                                      cus.lastName === null ||
                                                      cus.lastName ===
                                                        undefined
                                                        ? ""
                                                        : cus.lastName[0].toUpperCase()}
                                                    </div>
                                                    } */}
                                                  </div>
                                                  <div
                                                    className="cus-grid-items"
                                                    onClick={(e) =>
                                                      SelectCustomer(e, cus)
                                                    }
                                                    style={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <div>
                                                      <p>
                                                        {cus.firstName}{" "}
                                                        {cus.lastName}
                                                      </p>
                                                      <span>
                                                        {cus.mobileNumber}
                                                      </span>
                                                    </div>
                                                    {/* <div className="Invoice-Balance-status">
                                                      <button>Bal  ₹ 5000</button>
                                                    </div> */}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                      </div>
                                    )}
                                  </div>
                                  <div
                                    className="modal-sub-cancel-button-style"
                                    onClick={CloseCustomerDropDown}
                                  >
                                    <p>Cancel</p>
                                  </div>
                                </div>
                              </div>

                              {/* show alert message  */}
                              {selctedMemberShip.length > 0 && !customer ? (
                                <div className="alert-message">
                                  <p>Add customer to get membership.</p>
                                </div>
                              ) : null}

                              {serviceDetails.length > 0 ? (
                                <>
                                  <div className="add-product-counter-alignment">
                                    <p>Services</p>
                                    <div className="counter-box">
                                      {serviceDetails.length}
                                    </div>
                                  </div>
                                  {serviceDetails?.map((serv) => {
                                    return (
                                      <div
                                        style={{
                                          pointerEvents:
                                            storeOnboardingTourStatus ===
                                              true && "none",
                                        }}
                                        key={serv?._id}
                                        className="service-provider-grid"
                                        onClick={(e) => EditServices(e, serv)}
                                      >
                                        <div
                                          className="service-provider-grid-items"
                                          style={{
                                            backgroundColor: serv?.colour,
                                            borderRadius: "5px",
                                            height: "100%",
                                          }}
                                        ></div>
                                        <div className="service-provider-grid-items">
                                          <p>{serv?.servicename}</p>
                                          <span>
                                            by{" "}
                                            {serv?.staff
                                              ?.map((res) => {
                                                return res.firstName;
                                              })
                                              .join(", ")}
                                          </span>
                                        </div>
                                        <div className="service-provider-grid-items">
                                          <h5>
                                            <a>{SettingInfo?.currentType}</a>{" "}
                                            {serv?.servicediscountedprice}
                                          </h5>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : null}
                              {cartItems?.length > 0 ? (
                                <>
                                  <div className="add-product-counter-alignment">
                                    <p>Products</p>
                                    <div className="counter-box">
                                      {cartItems?.length}
                                    </div>
                                  </div>
                                  {cartItems.map((prod) => {
                                    return (
                                      <div
                                        key={prod?._id}
                                        className="discount-grid"
                                        onClick={(e) => EditProduct(e, prod)}
                                      >
                                        <div className="discount-grid-items">
                                          <div className="text-alignment-modal">
                                            <p>{prod?.productName}</p>
                                            <div className="counter-box">
                                              {prod?.productCount}
                                            </div>
                                          </div>
                                          <div className="child-text-alignment">
                                            <span>
                                              {prod?.productquantity}{" "}
                                              {prod?.productUnit}{" "}
                                              {prod?.staffName && "•"}
                                            </span>
                                            <p>
                                              {" "}
                                              {/* <del>
                                                <a>
                                                  {SettingInfo?.currentType}
                                                </a>{" "}
                                                {prod?.productPrice}
                                              </del> */}
                                              {""}{" "}
                                              <span>
                                                {prod?.staffName && "by  "}
                                                {prod?.staffName}
                                              </span>
                                              {/* <a>{SettingInfo?.currentType}</a>{" "}
                                              {prod?.discountedPrice} */}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="discount-grid-items">
                                          <h5>
                                            <span>
                                              {SettingInfo?.currentType}
                                            </span>{" "}
                                            {prod?.discountedSubTotal}
                                          </h5>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              ) : null}

                              <div>
                                {selctedMemberShip?.length > 0 && (
                                  <>
                                    <div className="membership-title-count-alignment">
                                      <p>Membership</p>
                                      <div className="membership-counter-design">
                                        {selctedMemberShip?.length}
                                      </div>
                                    </div>

                                    {selctedMemberShip?.map((membership) => {
                                      return (
                                        <div
                                          key={membership?._id}
                                          className="silver-profile"
                                          onClick={(e) =>
                                            EditMembership(membership)
                                          }
                                        >
                                          <div className="silver-profile-alignment">
                                            <div className="profile-type service-provider-grid">
                                              {membership?.cardColur ===
                                              "rgb(248, 226, 124)" ? (
                                                <img
                                                  src={YellowMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : membership?.cardColur ===
                                                "rgb(248, 163, 121)" ? (
                                                <img
                                                  src={OrangeMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : membership?.cardColur ===
                                                "rgb(109, 200, 199)" ? (
                                                <img
                                                  src={SkyBlueMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : membership?.cardColur ===
                                                "rgb(72, 148, 248)" ? (
                                                <img
                                                  src={BlueMembership}
                                                  alt="ProfileImage"
                                                />
                                              ) : (
                                                ""
                                              )}
                                              <div className="service-provider-grid-items">
                                                {" "}
                                                <p>
                                                  {" "}
                                                  {membership.membershipName}
                                                </p>
                                                {SettingInfo?.multipleStaff
                                                  ?.assignStaffForMembership ? (
                                                  <span>
                                                    {" "}
                                                    by {membership?.staffName}
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                            <div className="membership-alignment">
                                              <h5>
                                                <a>
                                                  {SettingInfo?.currentType}
                                                </a>{" "}
                                                {membership?.discountedPrice}
                                              </h5>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                                {editInvoice?.balanceAmountRecord ||
                                editInvoice?.dueAmountRecord ||
                                editInvoice?.splitPayment[0]?.method ===
                                  "Wallet"|| editInvoice?.previousDueClearRecord  ? null : showDiscount ? null : (
                                  <div
                                    className="add-more relative"
                                    style={{
                                      pointerEvents:
                                        storeOnboardingTourStatus === true &&
                                        "none",
                                    }}
                                  >
                                    <p onClick={() => AddMoreDetails()}>
                                      + Add more
                                    </p>
                                  </div>
                                )}
                                <div
                                  className="custom-view-product-box"
                                  onClick={(e) =>
                                    InvoiceProductConsumptionToggle(e)
                                  }
                                >
                                  <p>Product consumptions</p>
                                </div>
                              </div>
                            </div>
                            <div className="edit-invoice-grid-items edit-invoice-grid-items-sapce-remove">
                              <div className="new-phase-edit-notes-box-height">
                                <div className="edit-invoice-bottom-align">
                                  <div className="title-text">
                                    <p style={{ marginBottom: "15px" }}>
                                      Checkout
                                    </p>
                                  </div>

                                  <div className="divider-edit"></div>

                                  <div className="text-alignment">
                                    <p>Sub total</p>
                                    <h5>
                                      <span>{SettingInfo?.currentType}</span>
                                      {""} {parseFloat(subtotal, 10).toFixed(2)}
                                    </h5>
                                  </div>
                                  {showDiscount ? (
                                    <div className="text-alignment">
                                      <p>
                                        Discount
                                        {editInvoice?.balanceAmountRecord ||
                                        editInvoice?.dueAmountRecord ||
                                        editInvoice?.splitPayment[0]?.method ===
                                          "Wallet" || editInvoice?.previousDueClearRecord ? null : (
                                          <span
                                            onClick={() => RemoveDiscount()}
                                            style={{ color: "#E66666" }}
                                          >
                                            {" "}
                                            Remove
                                          </span>
                                        )}
                                      </p>

                                      <h5 style={{ color: "#E66666" }}>
                                        <span style={{ color: "#E66666" }}>
                                          - {SettingInfo?.currentType}
                                        </span>
                                        {parseFloat(showDiscount).toFixed(2)}
                                      </h5>
                                    </div>
                                  ) : null}

                                  {gstOn ? (
                                    <div
                                      className="text-alignment"
                                      style={{
                                        pointerEvents:
                                          storeOnboardingTourStatus === true &&
                                          "none",
                                      }}
                                    >
                                      <p>
                                        GST{" "}
                                        <span onClick={openGSTBreakupModal}>
                                          Breakup
                                        </span>
                                      </p>

                                      <h5>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {parseFloat(Gst).toFixed(2)}
                                      </h5>
                                    </div>
                                  ) : null}

                                  {membershiphide ? (
                                    <div
                                      className="text-alignment"
                                      style={{
                                        pointerEvents:
                                          storeOnboardingTourStatus === true &&
                                          "none",
                                      }}
                                    >
                                      <p>
                                        Membership discount{" "}
                                        <span
                                          onClick={openMembershipBreakupModal}
                                        >
                                          Breakup
                                        </span>
                                      </p>

                                      <h5>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {parseFloat(
                                          totalmembershipDiscount.toFixed(2),
                                          10
                                        )}
                                      </h5>
                                    </div>
                                  ) : null}

                                  {discount ? (
                                    <>
                                      <div className="discount-filed-open">
                                        <div className="discount-filed-open-grid">
                                          <div className="discount-filed-open-grid-items">
                                            <label>
                                              Discount
                                              <span
                                                style={{
                                                  color: "red",
                                                  top: "5px",
                                                  fontSize: "10px",
                                                }}
                                              >
                                                {" "}
                                                {errors["discount"]}{" "}
                                              </span>
                                            </label>
                                            <input
                                              type="number"
                                              value={discountprices}
                                              placeholder="e.g. 100"
                                              onChange={(e) => GetDiscount(e)}
                                            />
                                          </div>
                                          <div className="discount-filed-open-grid-items relative">
                                            <label>Type</label>
                                            <div
                                              className="relative"
                                              onClick={() =>
                                                setSubDiscoutMenu(
                                                  !subDiscoutMenu
                                                )
                                              }
                                            >
                                              <input
                                                type="text"
                                                value={discounttype}
                                              />
                                              <div className="icon-type-center">
                                                <img
                                                  src={DropDownIcon}
                                                  alt="DropDownIcon"
                                                />
                                              </div>
                                            </div>
                                            <div
                                              className={
                                                !subDiscoutMenu
                                                  ? "sub-menu-open sub-menu-hidden "
                                                  : "sub-menu-open sub-menu-show z-index-sub-menu"
                                              }
                                            >
                                              <div className="menu-design-box">
                                                <div
                                                  className="list-style-design"
                                                  onClick={(e) =>
                                                    DiscountTypeSelect(e, "%")
                                                  }
                                                >
                                                  <span>%</span>
                                                </div>
                                                <div
                                                  className="list-style-design"
                                                  onClick={(e) =>
                                                    DiscountTypeSelect(
                                                      e,
                                                      SettingInfo?.currentType
                                                    )
                                                  }
                                                >
                                                  <span>
                                                    {SettingInfo?.currentType}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="cancel-save-button">
                                          <button onClick={CancleDiscount}>
                                            Cancel
                                          </button>
                                          {save ? (
                                            <button
                                              onClick={() => SaveDiscount()}
                                            >
                                              Save
                                            </button>
                                          ) : (
                                            <button disabled>Save</button>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ) : editInvoice?.balanceAmountRecord ||
                                    editInvoice?.dueAmountRecord ||
                                    editInvoice?.splitPayment[0]?.method ===
                                      "Wallet"|| editInvoice?.previousDueClearRecord ? null : showDiscount ? null : (
                                    <>
                                      <div
                                        className="text-alignment"
                                        style={{
                                          pointerEvents:
                                            storeOnboardingTourStatus ===
                                              true && "none",
                                        }}
                                      >
                                        <h4 onClick={AddDiscount}>
                                          + Add discount
                                        </h4>
                                      </div>
                                    </>
                                  )}
                                  <div className="divider-edit"></div>
                                  <div className="text-alignment">
                                    <p>
                                      {" "}
                                      <b>Total Invoice amount</b>
                                    </p>
                                    <h5 style={{ fontSize: "15px" }}>
                                      <span style={{ fontSize: "15px" }}>
                                        {SettingInfo?.currentType}
                                      </span>{" "}
                                      {Math.round(TotalAmount)}
                                    </h5>
                                  </div>
                                  {previousDue && (
                                    <div className="text-alignment-blue">
                                      <span className="flex flex-row items-baseline">
                                        <p
                                          onClick={() =>
                                            OpenPrevoiusDueBreakup()
                                          }
                                        >
                                          Previous dues{" "}
                                        </p>
                                        {editInvoice?.balanceAmountRecord || editInvoice?.dueAmountRecord || editInvoice?.splitPayment[0]?.method === "Wallet" || editInvoice?.previousDueClearRecord ? null :<span
                                          style={{
                                            color: "#E66666",
                                            fontSize: "11px",
                                            fontWeight: "500",
                                          }}
                                          onClick={() => RemovePreviouseDue()}
                                        >
                                          Remove
                                        </span>}
                                      </span>
                                      <h5>
                                        <span style={{ color: "#387F6B" }}>
                                          + {SettingInfo?.currentType}
                                        </span>{" "}
                                        {previousDue}
                                      </h5>
                                    </div>
                                  )}
                                  <div className="add-due-alignment">
                                    {splitPayment?.length > 0 &&
                                    splitPayment[0]?.method === "Wallet" ? (
                                      <div className="add-due-text-final-alignment">
                                        <h2>Wallet</h2>
                                        <p style={{ fontSize: "15px" }}>
                                          <span style={{ fontSize: "15px" }}>
                                            - {SettingInfo?.currentType}{" "}
                                          </span>
                                          {splitPayment[0]?.amount}
                                        </p>
                                      </div>
                                    ) : (
                                      ""
                                    )}

                                    {balanceAmount || balanceAmount === 0 ? (
                                      <div className="add-due-text-final-alignment">
                                        <h2>Balance</h2>
                                        <p
                                          style={{
                                            fontSize: "15px",
                                            color: "#338333",
                                          }}
                                        >
                                          <span style={{ fontSize: "15px" }}>
                                            + {SettingInfo?.currentType}{" "}
                                          </span>
                                          {balanceAmount}
                                        </p>
                                      </div>
                                    ) : dueAmount ? (
                                      <div className="add-due-text-final-alignment">
                                        <h2>Due</h2>
                                        <p style={{ fontSize: "15px" }}>
                                          <span style={{ fontSize: "15px" }}>
                                            - {SettingInfo?.currentType}{" "}
                                          </span>
                                          {dueAmount}
                                        </p>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {dueToggle ? (
                                    <>
                                      <div className="add-due-alignment">
                                        <div className="total-amount-collected">
                                          <div style={{ display: "flex" }}>
                                            <label>
                                              Total amount collected
                                            </label>
                                            <span
                                              style={{
                                                color: "red",
                                                // top: "5px",
                                                fontSize: "10px",
                                              }}
                                            >
                                              {errors["dueAmount"]}
                                            </span>
                                          </div>
                                          <div className="total-amount-dues-grid">
                                            <div className="total-amount-dues-grid-items">
                                              <input
                                                type="text"
                                                placeholder="Enter value"
                                                value={amount}
                                                onChange={(e) => DueAmount(e)}
                                                onKeyPress={bindInput}
                                              />
                                              <div className="dues-amount">
                                                <span>
                                                  {SettingInfo?.currentType}
                                                </span>
                                              </div>
                                            </div>
                                            <div
                                              className="total-amount-dues-grid-items"
                                              onClick={SaveCollectedAmount}
                                            >
                                              <button>
                                                {amount
                                                  ? balanceAmount ||
                                                    dueAmount == 0
                                                    ? "Save Paid"
                                                    : "Save Part paid"
                                                  : "Save Unpaid"}
                                              </button>
                                            </div>
                                          </div>
                                          <span className="alert-line">
                                            <i>
                                              Extra amount added will count as
                                              an advance amount
                                            </i>
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  ) : customer ? (
                                    walletBalance >= TotalAmount ? (
                                      ""
                                    ) : balanceAmount || dueAmount ? (
                                      " "
                                    ) : editInvoice ? (
                                      " "
                                    ) : (
                                      <div
                                        className="add-dues-alignment-invoice"
                                        onClick={AddDueAmount}
                                      >
                                        <p>+ Add due/advance amount</p>
                                      </div>
                                    )
                                  ) : (
                                    ""
                                  )}

                                  {walletBalance >= TotalAmount &&
                                  !advanceToggle ? (
                                    collectedAmount > 0 ? (
                                      " "
                                    ) : customer ? (
                                      editInvoice ? (
                                        " "
                                      ) : (
                                        <div
                                          className="add-dues-alignment-invoice"
                                          onClick={AddAdvanceAmount}
                                        >
                                          <p>+ Add advance amount</p>
                                        </div>
                                      )
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                  {advanceToggle && (
                                    <>
                                      <div className="add-due-alignment">
                                        <div className="total-amount-collected">
                                          <div style={{ display: "flex" }}>
                                            <label>
                                              Total advance amount collected
                                            </label>
                                            <span
                                              style={{
                                                color: "red",
                                                // top: "5px",
                                                fontSize: "10px",
                                              }}
                                            >
                                              {errors["dueAmount"]}
                                            </span>
                                          </div>
                                          <div className="total-amount-dues-grid">
                                            <div className="total-amount-dues-grid-items">
                                              <input
                                                type="text"
                                                placeholder="Enter value"
                                                value={advanceamount}
                                                onChange={(e) =>
                                                  AdvanceAmountHandler(e)
                                                }
                                                onKeyPress={bindInput}
                                              />
                                              <div className="dues-amount">
                                                <span>
                                                  {SettingInfo?.currentType}
                                                </span>
                                              </div>
                                            </div>
                                            <div
                                              className="total-amount-dues-grid-items"
                                              onClick={SaveAdvanceAmount}
                                            >
                                              <button>
                                                {advanceamount
                                                  ? "Save advance"
                                                  : "Save paid"}
                                              </button>
                                            </div>
                                          </div>
                                          <span className="alert-line">
                                            <i>
                                              Amount added will count as an
                                              advance amount
                                            </i>
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <div className="divider-edit-invoice"></div>
                                  {!dueChanges && !advanceChanges ? (
                                    <div className="text-alignment">
                                      <p>To collect</p>
                                      <h5 style={{ fontSize: "18px" }}>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {collectedAmount >= 0
                                          ? collectedAmount
                                          : parseInt(TotalAmount)}
                                      </h5>
                                    </div>
                                  ) : null}
                                  {dueChanges ? (
                                    <div className="text-alignment">
                                      <p>
                                        To collect
                                        {parseInt(collectedAmount) !==
                                          parseInt(TotalAmount) -
                                            (walletBalance > 0
                                              ? walletBalance
                                              : 0) +
                                            (previousDue ? previousDue : 0) && (
                                          <span
                                            onClick={() => {
                                              setDueToggle(!dueToggle);
                                              setDueChanges(false);
                                              setAddDisble(true);
                                            }}
                                          >
                                            {" "}
                                            Edit
                                          </span>
                                        )}
                                      </p>
                                      <h5>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {collectedAmount}
                                      </h5>
                                    </div>
                                  ) : null}
                                  {advanceChanges && collectedAmount >= 0 ? (
                                    <div className="text-alignment">
                                      <p>
                                        To collect
                                        {parseInt(collectedAmount) !== 0 && (
                                          <span
                                            onClick={() => {
                                              setAddDisble(true);
                                              setadvanceToggle(!advanceToggle);
                                              setBalanceAmount(balanceAmount);
                                            }}
                                          >
                                            {" "}
                                            Edit
                                          </span>
                                        )}
                                      </p>
                                      <h5 style={{ fontSize: "16px" }}>
                                        <span>{SettingInfo?.currentType}</span>{" "}
                                        {collectedAmount}
                                      </h5>
                                    </div>
                                  ) : null}
                                  <div className="divider-edit-invoice"></div>
                                  {splitPayment?.length === 0 ? (
                                    collectedAmount == 0 ? (
                                      ""
                                    ) : (
                                      <div className="option-select-align1">
                                        <div className="option-select-group">
                                          <div
                                            className="text-alignment"
                                            style={{
                                              pointerEvents:
                                                storeOnboardingTourStatus ===
                                                  true && "none",
                                            }}
                                          >
                                            <label>Payment method</label>
                                            <p
                                              onClick={() =>
                                                SplitPaymentHandler()
                                              }
                                            >
                                              <span>Split</span>
                                            </p>
                                          </div>
                                          <div
                                            className="relative"
                                            ref={productTypeRef}
                                            style={{
                                              pointerEvents:
                                                storeOnboardingTourStatus ===
                                                  true && "none",
                                            }}
                                          >
                                            <div
                                              className="relative"
                                              ref={productTypeRef}
                                            >
                                              <div
                                                className="input-relative"
                                                onClick={() =>
                                                  setSubMenuopen(!subMenuOpen)
                                                }
                                              >
                                                <input
                                                  type="text"
                                                  value={
                                                    paymentMethod
                                                      ? paymentMethod
                                                      : paymenttMethod?.[0] ||
                                                        "Cash"
                                                  }
                                                  disabled
                                                />
                                                <div className="drop-down-icon-center">
                                                  <img
                                                    src={DropDownIcon}
                                                    alt="DropDownIcon"
                                                  />
                                                  <div className="drop-down-icon-center">
                                                    <img
                                                      src={DropDownIcon}
                                                      alt="DropDownIcon"
                                                    />
                                                    {/* <div className="drop-down-icon-center">
                                            <img
                                              src={DropDownIcon}
                                              alt="DropDownIcon"
                                            />
                                          </div>
                                        </div> */}
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className={
                                                  subMenuOpen
                                                    ? "sub-menu-open sub-menu"
                                                    : "sub-menu sub-menu-close"
                                                }
                                              >
                                                <div className="sub-menu-design">
                                                  <ul>
                                                    {paymenttMethod?.length ===
                                                    0 ? (
                                                      <li
                                                        onClick={(e) =>
                                                          SelectPaymentMethod(
                                                            e,
                                                            "Cash"
                                                          )
                                                        }
                                                      >
                                                        Cash
                                                      </li>
                                                    ) : (
                                                      paymenttMethod?.map(
                                                        (pay) => {
                                                          return (
                                                            <li
                                                              key={pay._id}
                                                              onClick={(e) =>
                                                                SelectPaymentMethod(
                                                                  e,
                                                                  pay
                                                                )
                                                              }
                                                            >
                                                              {pay}
                                                            </li>
                                                          );
                                                        }
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  ) : collectedAmount == 0 ? (
                                    " "
                                  ) : splitPayment[0]?.method === "Wallet" &&
                                    splitPayment?.length === 2 ? (
                                    <div className="option-select-align1">
                                      <div className="option-select-group">
                                        <div
                                          className="text-alignment"
                                          style={{
                                            pointerEvents:
                                              storeOnboardingTourStatus ===
                                                true && "none",
                                          }}
                                        >
                                          <label>Payment method</label>
                                          <p
                                            onClick={() =>
                                              SplitPaymentHandler("edit")
                                            }
                                          >
                                            <span>Split</span>
                                          </p>
                                        </div>
                                        <div
                                          className="relative"
                                          ref={productTypeRef}
                                          style={{
                                            pointerEvents:
                                              storeOnboardingTourStatus ===
                                                true && "none",
                                          }}
                                        >
                                          <div
                                            className="relative"
                                            ref={productTypeRef}
                                          >
                                            <div
                                              className="input-relative"
                                              onClick={() =>
                                                setSubMenuopen(!subMenuOpen)
                                              }
                                            >
                                              <input
                                                type="text"
                                                value={paymentSplitMethod}
                                                disabled
                                              />
                                              <div className="drop-down-icon-center">
                                                <img
                                                  src={DropDownIcon}
                                                  alt="DropDownIcon"
                                                />
                                                <div className="drop-down-icon-center">
                                                  <img
                                                    src={DropDownIcon}
                                                    alt="DropDownIcon"
                                                  />
                                                  {/* <div className="drop-down-icon-center">
                                            <img
                                              src={DropDownIcon}
                                              alt="DropDownIcon"
                                            />
                                          </div>
                                        </div> */}
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className={
                                                subMenuOpen
                                                  ? "sub-menu-open sub-menu"
                                                  : "sub-menu sub-menu-close"
                                              }
                                            >
                                              <div className="sub-menu-design">
                                                <ul>
                                                  {paymenttMethod?.length ===
                                                  0 ? (
                                                    <li
                                                      onClick={(e) =>
                                                        SelectSplitPaymentMethod(
                                                          e,
                                                          "Cash"
                                                        )
                                                      }
                                                    >
                                                      Cash
                                                    </li>
                                                  ) : (
                                                    paymenttMethod?.map(
                                                      (pay) => {
                                                        return (
                                                          <li
                                                            key={pay._id}
                                                            onClick={(e) =>
                                                              SelectSplitPaymentMethod(
                                                                e,
                                                                pay
                                                              )
                                                            }
                                                          >
                                                            {pay}
                                                          </li>
                                                        );
                                                      }
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="split-pay-remove-edit-alignment">
                                        <div>
                                          <p>
                                            Split payment
                                            {splitPayment?.length > 1 && (
                                              <span
                                                onClick={() =>
                                                  SplitPaymentHandler("edit")
                                                }
                                              >
                                                Edit
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                        {splitPayment[0]?.method !=
                                          "Wallet" && (
                                          <div>
                                            <h6
                                              onClick={() =>
                                                RemoveSplitPayment()
                                              }
                                            >
                                              Remove
                                            </h6>
                                          </div>
                                        )}
                                      </div>
                                      <div className="split-pay-info">
                                        {splitPayment?.map((pay) => {
                                          if (pay.method !== "Wallet") {
                                            return (
                                              <div className="text-amount-alignment">
                                                <p>{pay.method}</p>
                                                <h2>
                                                  <span>
                                                    {SettingInfo?.currentType}
                                                  </span>{" "}
                                                  {pay.amount}
                                                </h2>
                                              </div>
                                            );
                                          }
                                        })}
                                      </div>
                                    </>
                                  )}
                                </div>

                                {notes && (
                                  <div className="additional-note-top-boarder">
                                    <div className="additional-note-alignment">
                                      <div className="additional-note-flex">
                                        <div className="additional-note-heading">
                                          <span>Additional notes</span>
                                        </div>
                                        <div className="additional-note-remove">
                                          <span
                                            onClick={(e) => {
                                              setChange(true);
                                              setNotes("");
                                            }}
                                          >
                                            Remove
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className="additional-note-box-alignment"
                                        onClick={toggleAdditionalNotesModal}
                                      >
                                        <span>{notes}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="additional-notes-box">
                                <div className="additional-notes-align-box-space">
                                  <div style={{ opacity: notes && 0 }}>
                                    <label onClick={toggleAdditionalNotesModal}>
                                      Additional notes
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div
                                className="checkbox-alignment-box left-align-right-space"
                                style={{
                                  pointerEvents:
                                    storeOnboardingTourStatus === true &&
                                    "none",
                                }}
                              >
                               
                                <input
                                  type="checkbox"
                                
                                  checked={smsCheckbox}
                                  // defaultChecked
                                  onChange={(e) => changeSmsCheckbox(e)}
                                />
                                <p>Send invoice link to customer through SMS</p>
                              </div>
                              <div
                                className="button-alignment-center"
                                style={{
                                  pointerEvents:
                                    storeOnboardingTourStatus === true &&
                                    storeOnboardingCurrentTooltip !== "I12" &&
                                    "none",
                                }}
                              >
                                {editInvoice ? (
                                  change ? (
                                    <button onClick={UpdateInvoiceData}>
                                      Save Changes
                                    </button>
                                  ) : (
                                    <button
                                      onClick={UpdateInvoiceData}
                                      disabled
                                    >
                                      Save Changes
                                    </button>
                                  )
                                ) : customerCompulsion ? (
                                  customer ? (
                                    addDisble ? (
                                      <button
                                        onClick={GenerateInvoiceData}
                                        disabled
                                      >
                                        Generate Invoice
                                      </button>
                                    ) : (
                                      <button onClick={GenerateInvoiceData}>
                                        Generate Invoice
                                      </button>
                                    )
                                  ) : (
                                    <button
                                      onClick={GenerateInvoiceData}
                                      disabled
                                    >
                                      Generate Invoice
                                    </button>
                                  )
                                ) : selctedMemberShip.length > 0 ? (
                                  customer ? (
                                    addDisble ? (
                                      <button
                                        onClick={GenerateInvoiceData}
                                        disabled
                                      >
                                        Generate Invoice
                                      </button>
                                    ) : (
                                      <button onClick={GenerateInvoiceData}>
                                        Generate Invoice
                                      </button>
                                    )
                                  ) : (
                                    <button
                                    // onClick={GenerateInvoiceData}
                                    // disabled
                                    >
                                      Generate Invoice
                                    </button>
                                  )
                                ) : dueAmount > 0 ? (
                                  customer ? (
                                    addDisble ? (
                                      <button
                                        onClick={GenerateInvoiceData}
                                        disabled
                                      >
                                        Generate Invoice
                                      </button>
                                    ) : (
                                      <button onClick={GenerateInvoiceData}>
                                        Generate Invoice
                                      </button>
                                    )
                                  ) : (
                                    <button
                                      onClick={GenerateInvoiceData}
                                      disabled
                                    >
                                      Generate Invoice
                                    </button>
                                  )
                                ) : addDisble ? (
                                  <button
                                    onClick={GenerateInvoiceData}
                                    disabled
                                  >
                                    Generate Invoice
                                  </button>
                                ) : (
                                  <button onClick={GenerateInvoiceData}>
                                    Generate Invoice
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <div className="modal-body-top-align tablet-view-right-left-align">
                  <div className="generate-box-center">
                    <div className="product-service-grid">
                      <Main
                        products={cartItems}
                        onAdd={onAdd}
                        ValidationMsg={ValidationMsg}
                        onRemove={onRemove}
                        productt={productt}
                        BackProductToSelectItem={BackProductToSelectItem}
                        SettingInfo={SettingInfo}
                      ></Main>
                      <Basket
                        cartItems={cartItems}
                        SelectStaffFromProduct={SelectStaffFromProduct}
                        staffData={staffData}
                        clearCart={clearCart}
                        Continue={Continue}
                        SettingInfo={SettingInfo}
                      ></Basket>
                    </div>
                  </div>
                </div>
              )
            ) : memberStaffData ? (
              <div className="modal-body-top-align">
                <div className="generate-box-center">
                  <div className="generate-box right-space-remove">
                    <div className="modal-sub-title-sticky">
                      <div
                        onClick={BackToSelectItem}
                        className="back-arrow-alignment"
                      >
                        <img
                          onClick={BackToSelectItem}
                          src={BackArrowService}
                          alt="UserAdd"
                        />
                      </div>
                      <div className="title-text right-space-align">
                        <h3>Select a Membership</h3>
                      </div>
                      <div className="select-service-search right-space-align right-space-align-search-input">
                        <input
                          type="search"
                          name="q"
                          placeholder="Search Membership"
                          onChange={(e) => handleOnSearch(e)}
                          autoFocus
                        />
                        <div className="search-icon-align">
                          <img src={SearchIcon} alt="SearchIcon" />
                        </div>
                      </div>
                      <div>
                        <div className="add-membership-modal-card-alignment">
                          {memberShipData.map((memberShip) => {
                            return (
                              <MemberShip
                                membershipData={memberShip}
                                getmembership={getmembership}
                                SettingInfo={SettingInfo}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="select-staff-box-alignment">
                <div className="select-staff-box">
                  <div className="select-staff-space-alignment select-staff-space-alignment-box ">
                    <div className="modal-sub-title-sticky">
                      <div
                        onClick={BacktoMembership}
                        className="back-arrow-alignment"
                      >
                        <img src={BackArrowStaff} alt="UserAdd" />
                      </div>
                      <div className="title-text">
                        <h5>Select a Staff</h5>
                      </div>
                      <div className="flex justify-center">
                        <span className="service-staff-head">
                          <button>
                            {selctedMemberShip[0]?.membershipName}
                          </button>
                        </span>
                      </div>
                    </div>
                    {/* <div className="select-service-search">
                      <input
                        type="search"
                        placeholder="Search staff name"
                        onChange={(e) => {
                          handleStaffSearch(e);
                        }}
                      />
                      <div className="select-service-icon-center">
                        <img src={SearchIcon} alt="SearchIcon" />
                      </div>
                    </div> */}
                    <div
                      className={
                        "staff-box-height-fix staff-box-height-fix-top-alignments padding-right-all-child-box-alignment"
                      }
                    >
                      {staffData?.length > 0 ? (
                        staffData?.map((item, index) => (
                          <HandleStaffNavigation
                            focus={focus === index}
                            setFocus={setFocus}
                            index={index}
                            modal={Mermbershipmodal}
                            active={index === cursor}
                            item={item}
                            setSelected={setSelected}
                            setHovered={setHovered}
                          />
                        ))
                      ) : (
                        <div className="system-does-not text-center mt-2 font-medium heading-title-text-color">
                          <p>System does not have this person's data</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="wash-service-box-footer">
                       <button>Continue</button>
                     </div> */}
                  {/* <div className='select-staff-modal-footer'>
                         <div className="single-select-staff">
                           <div>
                             <img src={SignleStaff} alt="SignleStaff"/>
                           </div>
                           <div>
                             <span>Select single staff</span>
                           </div>
                         </div>
                         <div className="single-select-staff-continue-button">
                           <button>Continue</button>
                         </div>
                   </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
        {invoiceProductConsumptionModal && (
          <InvoiceProductConsumptionModal
            modal={invoiceProductConsumptionModal}
            toggle={InvoiceProductConsumptionToggle}
            serviceDetails={serviceDetails}
            setServiceDetails={setServiceDetails}
            userInfo={userInfo}
            additionalProductConsumption={additionalProductConsumption}
            setAdditionalProductConsumption={setAdditionalProductConsumption}
            changes={changes}
            setChanges={setChanges}
          />
        )}
        {gstBreakupModal && (
          <GSTBreakupModal
            modal={gstBreakupModal}
            toggle={AddGSTBreakuptoggle}
            serviceDetails={serviceDetails}
            cartItems={cartItems}
            selctedMemberShip={selctedMemberShip}
            SettingInfo={SettingInfo}
          />
        )}
        {membershipBreakupModal && (
          <MembershipBreakupModel
            modal={membershipBreakupModal}
            toggle={AddMembershipBreakupModaltoggle}
            serviceDetails={serviceDetails}
            customer={customer}
            SettingInfo={SettingInfo}
          />
        )}
        {addCustomerModal && (
          <AddCustomerModal
            modal={addCustomerModal}
            toggle={AddCustomertoggle}
            AddCustomer={AddNewCustomer}
            search={search}
          />
        )}
        {editServicesModal && (
          <EditServicesModal
            setHideBackToService={setHideBackToService}
            setInvoiceDetail={setInvoiceDetail}
            setEditServicesModal={setEditServicesModal}
            EditServiceData={EditServiceData}
            setOpenWorkRation={setOpenWorkRation}
            showDiscount={showDiscount}
            editServiceData={editServiceData}
            modal={editServicesModal}
            toggle={AddEditServicestoggle}
            products={cartItems}
            RemoveService={RemoveService}
            customer={customer}
            gstType={gstType}
            SettingInfo={SettingInfo}
            gstOn={gstOn}
            serviceTax={serviceTax}
            selctedMemberShip={selctedMemberShip}
            sameInvoice={sameInvoice}
            InvoiceProductConsumptionToggle={InvoiceProductConsumptionToggle}
            changes={changes}
            setChanges={setChanges}
            editInvoice={editInvoice}
          />
        )}
        {editMembershipModal && (
          <EditMembershipModal
            modal={editMembershipModal}
            toggle={AddEditMembershiptoggle}
            editMembershipValue={editMembershipValue}
            RemoveMembership={RemoveMembership}
            showDiscount={showDiscount}
            SettingInfo={SettingInfo}
            gstOn={gstOn}
            gstType={gstType}
            staffData={staffData}
            editInvoice={editInvoice}
          />
        )}
        {editProductModal && (
          <EditProductModal
            showDiscount={showDiscount}
            editProductData={editProductData}
            modal={editProductModal}
            toggle={AddEditProducttoggle}
            products={cartItems}
            onEditAdd={onEditAdd}
            onEditRemove={onEditRemove}
            RemoveProduct={RemoveProduct}
            ValidationMsg={ValidationMsg}
            SettingInfo={SettingInfo}
            productTax={productTax}
            gstOn={gstOn}
            gstType={gstType}
            staffData={staffData}
            editInvoice={editInvoice}
          />
        )}
        {success && <Success modal={success} toastmsg={toastmsg} er={er} />}
        {accept && <AcceptDeny modal={accept} toggle={RequestAccepted} />}
        {openSplitPay && (
          <SplitPay
            modal={openSplitPay}
            toggle={SplitPaymentHandlerToggle}
            paymenttMethod={paymenttMethod}
            TotalAmount={
              collectedAmount
                ? collectedAmount
                : TotalAmount + (previousDue ? previousDue : 0)
            }
            splitPayment={splitPayment}
            edit={edit}
            SettingInfo={SettingInfo}
            walletBalance={walletBalance}
          />
        )}
        {showAddDue && (
          <ClearDuePopUp
            modal={showAddDue}
            toggle={AddDueAmounttoggle}
            description={
              "Would you like to clear the due amount from previous invoices?"
            }
            add={"Add due amount"}
            cancle={"Skip"}
          />
        )}
        {showAdditionalNotesModal && (
          <AdditionalNotesModal
            toggle={toggleAdditionalNotesModal}
            modal={showAdditionalNotesModal}
            notes={notes}
          />
        )}
        {previousDueModal && (
          <PreviousDueBreakup
            modal={previousDueModal}
            previousDue={previousDue}
            SettingInfo={SettingInfo}
            toggle={OpenPrevoiusDueBreakup}
            dueTransction={dueTransction}
          />
        )}
      </div>
      </motion.div>
  );
}
