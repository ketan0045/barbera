import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "../Inventory/inventory.scss";
import "../Invoice/Invoice.scss";
import SearchIcon from "../../../assets/svg/search.svg";
import FilterIcon from "../../../assets/svg/filter.svg";
import SettingIcon from "../../../assets/svg/setting.svg";
import BellImage from "../../../assets/svg/bell.svg";
import DownIcon from "../../../assets/svg/drop-down.svg";
import FolderIcon from "../../../assets/svg/folder.svg";
import UpIcon from "../../../assets/svg/up-icon.svg";
import ExportIcon from "../../../assets/svg/export.svg";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import ArrowIcon from "../../../assets/svg/arrow.svg";
import MoreOption from "../../../assets/svg/more-option.svg";
import ChildSidebar from "../Layout/ChildSidebar";
import FeatherEdit from "../../../assets/svg/feather_edit.svg";
import CarbonDelete from "../../../assets/svg/carbon_delete.svg";
import Modal from "../../Common/Modal/Modal";
import BrandAndCategoryModal from "../../Common/Modal/BrandAndCategoryModal";
import ProductModalInfo from "../../Common/Modal/ProductModalInfo";
import Auth from "../../../helpers/Auth";
import { ApiGet } from "../../../helpers/API/ApiData";
import Pagination from "../../Common/Pagination/Pagination";
import styles from "../../Common/Pagination/Pagination.scss";
import Delete from "../../Common/Toaster/Delete";
import ImportModal from "./ImportModal";
import Success from "../../Common/Toaster/Success/Success";
import TemporaryModal from "../../Common/Modal/TemporaryModal";
import { get_Setting } from "../../../utils/user.util";
import { motion } from "framer-motion/dist/framer-motion";

export default function Inventory() {
  const userInfo = Auth.getUserDetail();
  let SettingInfo = get_Setting();;
  const permission = userInfo.permission;
  const filterRef = useRef();
  const brandRef = useRef();
  const threeDotRef = useRef();
  const [moreOptionMenu, setMoreOptionMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allProductDetails, setAllProductDetails] = useState([]);
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [editProduct, setEditProduct] = useState();
  const [availlist, setAvaillist] = useState([]);
  const [availlist2, setAvaillist2] = useState([]);
  const [myarray, setMyArray] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [openInventoryModal, setOpenInventoryModal] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState(false);
  const [filtercategory, setFiltercategory] = useState(false);
  const [openBrandAndCategoryModal, setOpenBrandAndCategoryModal] =
    useState(false);
  const [productInfoModal, setProductInfoModal] = useState(false);
  const [showFilter, setShowfilter] = useState(false);
  const [object, setObject] = useState(false);
  const [childSidebar, setChildSidebar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState();
  const [er, setEr] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [keyWord, setKeyWord] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [importProductExcel, setImportProductExcelModal] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const setImportProductExcel = (data) =>
    setImportProductExcelModal(!importProductExcel);
  const postsPerPage = 15;
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentProducts = products
    ?.slice(0)
    .reverse()
    .slice(indexOfFirstPost, indexOfLastPost);
  const length = products && products.length;

  const AddnewInventoryModal = () => {
    AddnewInventoryModaltoggle();
  };
  const AddnewInventoryModaltoggle = (data) => {
    setOpenInventoryModal(!openInventoryModal);

    setEditProduct();
    if (openInventoryModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg(editProduct ? "Changes saved!" : "New product added!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };
  const ClickBrandAndCategoryModal = () => {
    BrandAndCategoryModaltoggle();
  };

  const BrandAndCategoryModaltoggle = () => {
    setOpenBrandAndCategoryModal(!openBrandAndCategoryModal);
    if (openBrandAndCategoryModal === true) {
    }
  };

  /* temporary modal */
  const [temporaryModal, setTemporaryModal] = useState(false);
  const ClickTemporaryModal = () => {
    TemporaryModaltoggle();
  };
  const TemporaryModaltoggle = () => {
    setTemporaryModal(!temporaryModal);
  };
  /* temporary modal*/

  const ProductModal = (data) => {
    setProductDetails(data);
    ProductModaltoggle();
  };

  const ProductModaltoggle = () => {
    setProductInfoModal(!productInfoModal);
    if (productInfoModal === true) {
    }
  };

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);

    if (deleteModal === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Record deleted!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const getAllBrands = async () => {
    let res = await ApiGet("ibrand/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setAllBrands(res.data.data);
        setFilteredBrand(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const getAllCategories = async () => {
    let res = await ApiGet("icategory/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setAllCategories(res.data.data);
        setFilteredCategory(res.data.data);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const getProducts = async (e) => {
    let res = await ApiGet("product/company/" + userInfo.companyId);
    try {
      if (res.data.status === 200) {
        setProducts(res.data.data);
        setAllProductDetails(res.data.data);
        setTotalPages(Math.ceil(res.data.data.length / 15));
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  const searchHandler = (e) => {
    setKeyWord(e.target.value);
    var searchData =
      allProductDetails?.length > 0 &&
      allProductDetails.filter(
        (rep) =>
          rep?.brandId?.brandName
            ?.toLowerCase()
            .includes(e.target.value?.toLowerCase()) ||
          rep?.categoryId?.categoryName
            ?.toLowerCase()
            .includes(e.target.value?.toLowerCase()) ||
          rep?.productName
            ?.toLowerCase()
            .includes(e.target.value?.toLowerCase()) ||
          rep?.productCode
            ?.toLowerCase()
            .includes(e.target.value?.toLowerCase()) ||
          rep?.retailPrice?.toString().includes(e.target.value?.toString())
      );
    if (e.target.value === "") {
      ApiGet("product/company/" + userInfo.companyId).then((resp) => {
        setProducts(resp.data.data);
      });
    } else {
      if  (allProductDetails?.length > 0)  {
          setProducts(searchData);
      }  else  {
        setProducts([]);
      }
    }
  };

  const changeBrandHandler = (e) => {
    setFilterVisibility(true);
    setKeyWord(e.target.value);
    var brandData =
      filteredBrand.length > 0 &&
      filteredBrand.filter(
        (rep) =>
          rep.brandName &&
          rep.brandName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    if (e.target.value === "") {
      ApiGet("ibrand/company/" + userInfo.companyId).then((resp) => {
        setAllBrands(resp.data.data);
      });
    } else {
      setAllBrands(brandData);
    }
  };

  const changeCategoryHandler = (e) => {
    setFiltercategory(true);
    setKeyWord(e.target.value);
    var categoryData =
      filteredCategory.length > 0 &&
      filteredCategory.filter(
        (rep) =>
          rep.categoryName &&
          rep.categoryName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    if (e.target.value === "") {
      ApiGet("icategory/company/" + userInfo.companyId).then((resp) => {
        setAllCategories(resp.data.data);
      });
    } else {
      setAllCategories(categoryData);
    }
  };

  const handleOnBestSellingFilter = async (e, key) => {
    setBestSeller(!bestSeller);
    if (key) {
      let res = await ApiGet(
        "product/company/bestsellproduct/" + userInfo.companyId
      );
      try {
        if (res.data.status === 200) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.log("in the catch");
      }
    } else {
      getProducts();
    }
  };

  const sortByMaxFilter = () => {
    setObject(!object);
    products.length > 0 &&
      products.sort(function (a, b) {
        return (
          (a.stockArray?.slice(-1)[0].total
            ? a.stockArray?.slice(-1)[0].total
            : 0) -
          (b.stockArray?.slice(-1)[0].total
            ? b.stockArray?.slice(-1)[0].total
            : 0)
        );
      });
  };

  const clearFilter = () => {
    // setFiltercategory(false);
    // setFilterVisibility(false);
    setObject(false);
    // setShowfilter(false);
    setAvaillist([]);
    setAvaillist2([]);
    getProducts();
  };

  const isCloseHandler = (data) => {
    setOpenInventoryModal(data);
    getProducts();
    setEditProduct(data);
  };

  const handleOnFilter = (e) => {
    if (e.target.checked && e.target.name === "name") {
      availlist.push(e.target.value);
    } else if (e.target.name === "name") {
      let index = availlist.indexOf(e.target.value);
      availlist.splice(index, 1);
    }
    setAvaillist([...availlist]);
    const myarray = allProductDetails.filter((rep) => {
      return availlist.some((f) => {
        return f === rep.brandId.brandName;
      });
    });
    setMyArray(myarray);
    setProducts(
      myarray.length > 0
        ? myarray
        : availlist.length > 0
        ? []
        : allProductDetails
    );
  };

  const handleOnCategoryFilter = (e) => {
    if (e.target.checked && e.target.name === "name") {
      availlist2.push(e.target.value);
    } else if (e.target.name === "name") {
      let index = availlist2.indexOf(e.target.value);
      availlist2.splice(index, 1);
    }
    setAvaillist2([...availlist2]);
    const myarray2 =
      myarray.length > 0
        ? myarray.filter((rep) => {
            return availlist2.some((f) => {
              return f === rep.categoryId.categoryName;
            });
          })
        : allProductDetails.filter((rep) => {
            return availlist2.some((f) => {
              return f === rep.categoryId.categoryName;
            });
          });
    setProducts(
      myarray2.length > 0
        ? myarray2
        : availlist2.length > 0
        ? []
        : myarray.length > 0
        ? myarray
        : allProductDetails
    );
  };

  useEffect(() => {
    setPage(1);
  }, [products]);

  useEffect(() => {
    getProducts();
    getAllBrands();
    getAllCategories();
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (showFilter) {
        if (
          showFilter &&
          filterRef.current &&
          !filterRef.current.contains(e.target)
        ) {
          setFilterVisibility(false);
          setFiltercategory(false);
        }
      } else if (isOpen) {
        if (
          isOpen &&
          brandRef.current &&
          !brandRef.current.contains(e.target)
        ) {
          setIsOpen(false);
        }
      } else if (moreOptionMenu) {
        if (
          moreOptionMenu &&
          threeDotRef.current &&
          !threeDotRef.current.contains(e.target)
        ) {
          setMoreOptionMenu(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showFilter, isOpen, moreOptionMenu]);

  const moreOptionMenuSelect = (e, data) => {
    setMore(data);
    setMoreOptionMenu(!moreOptionMenu);
    setProductInfoModal(false);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  return (
    <>
      {childSidebar && <ChildSidebar modal={childSidebar} />}
      <div className="w-full full-page-banner">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="content"
          id="main-contain"
        >
          <div className="container-fluid container-left-right-space">
            <div className="flex items-center justify-between common-header-style top-align-new">
              <div className="header-title">
                <i
                  class="fas fa-bars"
                  onClick={() => setChildSidebar(!childSidebar)}
                ></i>
                <h2>Inventory</h2>
              </div>
              <div className="header-notification">
                {/* <div className="icon-design">
                  <div className="relative">
                    <img src={BellImage} alt="BellImage" />
                  </div>
                  <div className="bell-icon-design"></div>
                </div> */}
                {/* {permission?.filter((obj)=>obj.name ===  "Settings page")?.[0]?.isChecked === false ? null : */}
                <NavLink to="/setting">
                <div className="cus-icon-design-last">
                    <div className="iconic-tab">
                      <div className="iconic-icon">
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5476 22.75H9.45259C8.92397 22.75 8.46659 22.3821 8.35347 21.8658L7.89559 19.7463C7.28477 19.4786 6.70559 19.144 6.16872 18.7484L4.10209 19.4065C3.59809 19.5672 3.0502 19.3551 2.78584 18.8969L0.733841 15.352C0.472378 14.8936 0.562457 14.3153 0.950966 13.9581L2.55409 12.4956C2.48119 11.8331 2.48119 11.1646 2.55409 10.5021L0.950966 9.043C0.561885 8.68566 0.47177 8.10669 0.733841 7.648L2.78134 4.10088C3.0457 3.64266 3.59359 3.43053 4.09759 3.59125L6.16422 4.24938C6.43879 4.04593 6.72462 3.85813 7.02034 3.68688C7.30422 3.52678 7.59638 3.38183 7.89559 3.25262L8.35459 1.13538C8.46717 0.618965 8.92405 0.250556 9.45259 0.25H13.5476C14.0761 0.250556 14.533 0.618965 14.6456 1.13538L15.1091 3.25375C15.425 3.39271 15.7326 3.54972 16.0305 3.724C16.3083 3.88466 16.5768 4.06082 16.8348 4.25163L18.9026 3.5935C19.4063 3.43338 19.9535 3.64543 20.2177 4.10312L22.2652 7.65025C22.5267 8.10867 22.4366 8.68695 22.0481 9.04412L20.445 10.5066C20.5179 11.1691 20.5179 11.8376 20.445 12.5001L22.0481 13.9626C22.4366 14.3198 22.5267 14.8981 22.2652 15.3565L20.2177 18.9036C19.9535 19.3613 19.4063 19.5734 18.9026 19.4132L16.8348 18.7551C16.5732 18.9478 16.3013 19.1262 16.0203 19.2895C15.7254 19.4604 15.4212 19.6148 15.1091 19.7519L14.6456 21.8658C14.5326 22.3817 14.0758 22.7496 13.5476 22.75ZM6.57259 16.2576L7.49509 16.9326C7.70305 17.0858 7.91979 17.2267 8.14422 17.3545C8.35538 17.4768 8.5728 17.5879 8.79559 17.6875L9.84522 18.1476L10.3593 20.5H12.6431L13.1572 18.1465L14.2068 17.6864C14.6651 17.4843 15.1 17.2331 15.504 16.9371L16.4276 16.2621L18.7237 16.9934L19.8656 15.0156L18.0847 13.3923L18.2107 12.2537C18.2661 11.7558 18.2661 11.2532 18.2107 10.7552L18.0847 9.61675L19.8667 7.99L18.7237 6.01112L16.4276 6.74237L15.504 6.06738C15.0999 5.77005 14.665 5.51697 14.2068 5.3125L13.1572 4.85238L12.6431 2.5H10.3593L9.84297 4.8535L8.79559 5.3125C8.57262 5.41042 8.35517 5.52046 8.14422 5.64213C7.92117 5.76962 7.70557 5.90972 7.49847 6.06175L6.57484 6.73675L4.27984 6.0055L3.13572 7.99L4.91659 9.61112L4.79059 10.7507C4.73524 11.2487 4.73524 11.7513 4.79059 12.2493L4.91659 13.3878L3.13572 15.0111L4.27759 16.9889L6.57259 16.2576ZM11.4956 16C9.01031 16 6.99559 13.9853 6.99559 11.5C6.99559 9.01472 9.01031 7 11.4956 7C13.9809 7 15.9956 9.01472 15.9956 11.5C15.9925 13.984 13.9796 15.9969 11.4956 16ZM11.4956 9.25C10.2664 9.25125 9.26571 10.2387 9.2481 11.4678C9.23049 12.6968 10.2025 13.7125 11.4311 13.749C12.6598 13.7855 13.6903 12.8292 13.7456 11.6012V12.0512V11.5C13.7456 10.2574 12.7382 9.25 11.4956 9.25Z"
                            fill="#97A7C3"
                          />
                        </svg>
                      </div>
                      <div className="iconic-icon-hover">
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5478 22.75H9.45284C8.92422 22.75 8.46684 22.3821 8.35371 21.8658L7.89584 19.7463C7.28502 19.4786 6.70584 19.144 6.16896 18.7484L4.10234 19.4065C3.59834 19.5672 3.05045 19.3551 2.78609 18.8969L0.734085 15.352C0.472622 14.8936 0.562701 14.3153 0.95121 13.9581L2.55434 12.4956C2.48143 11.8331 2.48143 11.1646 2.55434 10.5021L0.95121 9.043C0.562129 8.68566 0.472014 8.10669 0.734085 7.648L2.78159 4.10088C3.04595 3.64266 3.59384 3.43053 4.09784 3.59125L6.16446 4.24938C6.43903 4.04593 6.72486 3.85813 7.02059 3.68688C7.30447 3.52678 7.59663 3.38183 7.89584 3.25262L8.35484 1.13538C8.46741 0.618965 8.9243 0.250556 9.45284 0.25H13.5478C14.0764 0.250556 14.5333 0.618965 14.6458 1.13538L15.1093 3.25375C15.4252 3.39271 15.7329 3.54972 16.0307 3.724C16.3085 3.88466 16.5771 4.06082 16.8351 4.25163L18.9028 3.5935C19.4065 3.43338 19.9537 3.64543 20.218 4.10312L22.2655 7.65025C22.5269 8.10867 22.4368 8.68695 22.0483 9.04412L20.4452 10.5066C20.5181 11.1691 20.5181 11.8376 20.4452 12.5001L22.0483 13.9626C22.4368 14.3198 22.5269 14.8981 22.2655 15.3565L20.218 18.9036C19.9537 19.3613 19.4065 19.5734 18.9028 19.4132L16.8351 18.7551C16.5734 18.9478 16.3015 19.1262 16.0206 19.2895C15.7256 19.4604 15.4214 19.6148 15.1093 19.7519L14.6458 21.8658C14.5328 22.3817 14.076 22.7496 13.5478 22.75ZM6.57284 16.2576L7.49534 16.9326C7.70329 17.0858 7.92004 17.2267 8.14446 17.3545C8.35563 17.4768 8.57305 17.5879 8.79584 17.6875L9.84546 18.1476L10.3596 20.5H12.6433L13.1575 18.1465L14.2071 17.6864C14.6653 17.4843 15.1002 17.2331 15.5042 16.9371L16.4278 16.2621L18.724 16.9934L19.8658 15.0156L18.085 13.3923L18.211 12.2537C18.2663 11.7558 18.2663 11.2532 18.211 10.7552L18.085 9.61675L19.867 7.99L18.724 6.01112L16.4278 6.74237L15.5042 6.06738C15.1001 5.77005 14.6652 5.51697 14.2071 5.3125L13.1575 4.85238L12.6433 2.5H10.3596L9.84321 4.8535L8.79584 5.3125C8.57287 5.41042 8.35542 5.52046 8.14446 5.64213C7.92141 5.76962 7.70581 5.90972 7.49871 6.06175L6.57509 6.73675L4.28009 6.0055L3.13596 7.99L4.91684 9.61112L4.79084 10.7507C4.73549 11.2487 4.73549 11.7513 4.79084 12.2493L4.91684 13.3878L3.13596 15.0111L4.27784 16.9889L6.57284 16.2576ZM11.4958 16C9.01055 16 6.99584 13.9853 6.99584 11.5C6.99584 9.01472 9.01055 7 11.4958 7C13.9811 7 15.9958 9.01472 15.9958 11.5C15.9927 13.984 13.9798 15.9969 11.4958 16ZM11.4958 9.25C10.2667 9.25125 9.26596 10.2387 9.24835 11.4678C9.23073 12.6968 10.2027 13.7125 11.4314 13.749C12.66 13.7855 13.6905 12.8292 13.7458 11.6012V12.0512V11.5C13.7458 10.2574 12.7385 9.25 11.4958 9.25Z"
                            fill="#1479FF"
                          />
                        </svg>
                      </div>
                      <p className="iconic-title">Settings</p>
                    </div>
                  </div>
                </NavLink>
                {/* } */}
              </div>
            </div>

            <div
              className={
                showFilter
                  ? "inventory-search-box inventory-search-box-max"
                  : "inventory-search-box"
              }
            >
              <div className="all-alignment">
                <div className="inventory-search">
                  <input
                    type="search"
                    placeholder="Search products, brands, category or price"
                    onChange={(e) => searchHandler(e)}
                  />
                  <div className="search-icon-align">
                    <img src={SearchIcon} alt="SearchIcon" />
                  </div>
                </div>
                <div className="button-alignment">
                  <div>
                    {/* <div
                      onClick={() => setShowfilter(!showFilter)}
                      className={
                        showFilter
                          ? "sub-button-style-filter sub-button-style-filter-width filter-text-show"
                          : "sub-button-style-filter"
                      }
                    >
                      <img src={FilterIcon} alt="FilterIcon" />
                      <span>Filters</span>
                    </div> */}
                    {/* <div
                      onClick={() => {
                        setOpenBrandAndCategoryModal(
                          !openBrandAndCategoryModal
                        );
                      }}
                      className="sub-button-style-filter"
                    >
                      <img src={FolderIcon} alt="FolderIcon" />
                      <span>Manage</span>
                    </div> */}
                    <div
                      className="cus-inventory-icon-design"
                      onClick={() => setShowfilter(!showFilter)}
                    >
                      <div className="iconic-tab">
                        <div className="iconic-icon">
                          <img src={FilterIcon} alt="FilterIcon" />
                        </div>
                        <div className="iconic-icon-hover">
                          <img src={FilterIcon} alt="FilterIcon" />
                        </div>
                        <p className="iconic-title">Filters</p>
                      </div>
                    </div>
                    <div
                      className="cus-inventory-icon-last-design"
                      onClick={() => {
                        setOpenBrandAndCategoryModal(
                          !openBrandAndCategoryModal
                        );
                      }}
                    >
                      <div className="iconic-tab">
                        <div className="iconic-icon">
                        <img src={FolderIcon} alt="FolderIcon" />
                        </div>
                        <div className="iconic-icon-hover">
                        <img src={FolderIcon} alt="FolderIcon" />
                        </div>
                        <p className="iconic-title">Manage</p>
                      </div>
                    </div>
                    {/* <div
                      className="sub-button-style-filter"
                      onClick={() =>
                        // setImportProductExcelModal(!importProductExcel)
                        ClickTemporaryModal()
                      }
                    >
                      <img src={ExportIcon} alt="ExportIcon" />
                      <span>Import</span>
                    </div> */}
                  </div>
                  <div className="add-new-button">
                    {permission?.filter(
                      (obj) => obj.name === "Add new product/Brand/Category"
                    )[0]?.isChecked === false ? null : (
                      <button
                        onClick={() => {
                          AddnewInventoryModal();
                        }}
                      >
                        Add New
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {showFilter ? (
                <div className="fitler-input-show">
                  <div className="top-filter-align">
                    <div className="filter-input-grid" ref={filterRef}>
                      <div className="filter-input-grid-items">
                        <div className="filter-label-align">
                          <label>Brand</label>
                          <div className="filter-select-counter">
                            <span>{availlist.length}</span>
                          </div>
                        </div>
                        <div className="filter-option-relative">
                          <div
                            onClick={() =>
                              setFilterVisibility(!filterVisibility)
                            }
                          >
                            <input
                              type="search"
                              placeholder="Search brands (type here..)"
                              onChange={(e) => changeBrandHandler(e)}
                            />
                            <div className="down-icon-filter">
                              <img src={DownIcon} alt="DownIcon" />
                            </div>
                          </div>
                          <div className="filter-brand-dropdown">
                            <div
                              className={
                                filterVisibility
                                  ? "dropdown-show-visibility"
                                  : "dropdown-hidden-visibility"
                              }
                            >
                              {allBrands &&
                                allBrands.map((brand, i) => {
                                  return (
                                    <div
                                      key={brand._id}
                                      className="filter-brand-list"
                                    >
                                      <div className="checkbox-lable-align">
                                        <div>
                                          <input
                                            type="checkbox"
                                            name="name"
                                            id="id"
                                            value={brand.brandName}
                                            checked={
                                              availlist.includes(
                                                brand.brandName
                                              )
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => handleOnFilter(e)}
                                          />
                                        </div>
                                        <span>{brand.brandName}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="filter-input-grid-items">
                        <div className="filter-label-align">
                          <label>Category</label>
                          <div className="filter-select-counter">
                            <span>{availlist2.length}</span>
                          </div>
                        </div>
                        <div className="filter-option-relative">
                          <div
                            onClick={() => setFiltercategory(!filtercategory)}
                          >
                            <input
                              type="search"
                              placeholder="Search category (type here..)"
                              onChange={(e) => changeCategoryHandler(e)}
                            />
                            <div className="down-icon-filter">
                              <img src={DownIcon} alt="DownIcon" />
                            </div>
                          </div>
                          <div className="filter-brand-dropdown">
                            <div
                              className={
                                filtercategory
                                  ? "dropdown-show-visibility"
                                  : "dropdown-hidden-visibility"
                              }
                            >
                              {allCategories &&
                                allCategories.map((category, i) => {
                                  return (
                                    <div
                                      key={category._id}
                                      className="filter-brand-list"
                                    >
                                      <div className="checkbox-lable-align">
                                        <input
                                          type="checkbox"
                                          name="name"
                                          id="id"
                                          value={category.categoryName}
                                          checked={
                                            availlist2.includes(
                                              category.categoryName
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={(e) =>
                                            handleOnCategoryFilter(e)
                                          }
                                        />
                                        <span>{category.categoryName}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="filter-input-grid-items">
                        {availlist.length > 0 || availlist2.length > 0 ? (
                          <div
                            className="clearFilter-button-design"
                            onClick={() => clearFilter()}
                          >
                            Clear Filter
                          </div>
                        ) : (
                          <div
                            className="filter-close"
                            onClick={() => {
                              setShowfilter(!showFilter);
                              setFiltercategory(false);
                              setFilterVisibility(false);
                            }}
                          >
                            <img src={CloseIcon} alt="CloseIcon" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="fitler-input">
                  <div className="top-filter-align">
                    <div className="filter-input-grid">
                      <div className="filter-input-grid-items"></div>
                      <div className="filter-input-grid-items"></div>
                      <div className="filter-input-grid-items"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/*  */}
            <div className="table-grid">
              <div className="table-grid-items">
                <div className="table-responsive">
                  <table className="invoice-table">
                    <tr className={showFilter ? "" : "table-header-sticky"}>
                      <th align="left">
                        <p>Brand</p>
                        <div
                          className={filterVisibility ? "" : "brand-dropdown"}
                          ref={brandRef}
                        >
                          <span onClick={() => setIsOpen(!isOpen)}>
                            {availlist.length > 0 ? "filtered view" : "All"}
                            <img src={ArrowIcon} alt="ArrowIcon" />
                          </span>
                          {isOpen ? (
                            <div className="brand-dropdown-list">
                              <div className="dropdown-spacing">
                                <div className="filter-clear-alignment">
                                  <div className="filter-lable-align">
                                    <span onClick={() => setIsOpen(!isOpen)}>
                                      {availlist.length > 0
                                        ? "filtered view"
                                        : "All"}
                                    </span>
                                    <img
                                      src={UpIcon}
                                      alt="UpIcon"
                                      onClick={() => setIsOpen(!isOpen)}
                                    />
                                  </div>
                                  <div className="filter-clear">
                                    {availlist.length > 0 ? (
                                      <p
                                        className="cus-text-blue"
                                        onClick={() => clearFilter()}
                                      >
                                        Clear
                                      </p>
                                    ) : (
                                      <p>Clear</p>
                                    )}
                                  </div>
                                </div>
                                <div className="filter-sub-box">
                                  {allBrands &&
                                    allBrands.map((brand, i) => {
                                      return (
                                        <div
                                          key={brand._id}
                                          className="filter-option"
                                        >
                                          <div>
                                            <input
                                              type="checkbox"
                                              name="name"
                                              id="id"
                                              value={brand.brandName}
                                              checked={
                                                availlist.includes(
                                                  brand.brandName
                                                )
                                                  ? true
                                                  : false
                                              }
                                              onChange={(e) =>
                                                handleOnFilter(e)
                                              }
                                            />
                                          </div>
                                          <span>{brand.brandName}</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </th>
                      <th>
                        <p className="text-left">Product name</p>
                        {bestSeller ? (
                          <span onClick={(e) => handleOnBestSellingFilter(e)}>
                            Clear filter
                          </span>
                        ) : (
                          <span
                            onClick={(e) =>
                              handleOnBestSellingFilter(e, "filter")
                            }
                          >
                            Best sellers
                            <img src={ArrowIcon} alt="ArrowIcon" />
                          </span>
                        )}
                      </th>
                      <th align="center">
                        <p className="table-heading-sub-alignment">
                          Product code
                        </p>
                      </th>
                      <th className="">
                        <span className="table-heading-text">
                          <p className="text-center">Stock in hand</p>
                          <img src={ArrowIcon} alt="ArrowIcon" />
                        </span>
                        {object ? (
                          <span
                            className="justify-center flex table-heading-align"
                            onClick={() => clearFilter()}
                          >
                            Clear filter
                          </span>
                        ) : (
                          <span
                            className="justify-center flex table-heading-align"
                            onClick={() => sortByMaxFilter()}
                          >
                            Sort by Max
                            <img src={ArrowIcon} alt="ArrowIcon" />
                          </span>
                        )}
                      </th>
                      <th align="center">
                        <p className="table-heading-sub-alignment">
                          Quantity per unit
                        </p>
                      </th>
                      <th align="center">
                        <p className="table-heading-sub-alignment">
                          Retail price
                        </p>
                      </th>
                    </tr>
                    {currentProducts.map((product, index) => {
                      return (
                        <tr
                          key={index}
                          className="table-hover-effect"
                          // onClick={() => ProductModal(product)}
                        >
                          <td onClick={() => ProductModal(product)}>
                            <span>{product?.brandId?.brandName}</span>
                          </td>
                          <td onClick={() => ProductModal(product)}>
                            <span>{product?.productName}</span>
                          </td>
                          <td
                            align="center"
                            onClick={() => ProductModal(product)}
                          >
                            <span>{product?.productCode}</span>
                          </td>
                          <td
                            align="center"
                            onClick={() => ProductModal(product)}
                          >
                            <span>
                              {product?.stockArray?.slice(-1)[0].total}
                            </span>
                          </td>
                          <td
                            align="center"
                            onClick={() => ProductModal(product)}
                          >
                            <span>
                              {product?.quantity} {product?.unit}
                            </span>
                          </td>
                          <td
                            align="center"
                            className="product-table-menu-hover"
                          >
                            <span onClick={() => ProductModal(product)}>
                              <a>{SettingInfo?.currentType}</a>{" "}
                             {" "}
                              {parseInt(product?.discountPrice)}
                            </span>
                            {permission?.filter(
                              (obj) =>
                                obj.name ===
                                "Edit/delete products, brands, and categories"
                            )[0]?.isChecked === false ? null : (
                              <div
                                className={
                                  more === index
                                    ? moreOptionMenu
                                      ? "more-menu-align more-menu-sec-shows"
                                      : " more-menu-align"
                                    : "more-menu-align"
                                }
                                onClick={(e) => {
                                  // ProductModal();
                                  moreOptionMenuSelect(e, index);
                                }}
                              >
                                <div className="more-option-cus-menu">
                                  {/* <i class="fas fa-ellipsis-h"></i> */}
                                  <svg
                                    width="23"
                                    height="5"
                                    viewBox="0 0 23 5"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx="11.5"
                                      cy="2.5"
                                      r="2.5"
                                      fill="#97A7C3"
                                    />
                                    <circle
                                      cx="2.5"
                                      cy="2.5"
                                      r="2.5"
                                      fill="#97A7C3"
                                    />
                                    <circle
                                      cx="20.5"
                                      cy="2.5"
                                      r="2.5"
                                      fill="#97A7C3"
                                    />
                                  </svg>
                                </div>
                                {/* <img src={MoreOption} alt="MoreOption" /> */}
                              </div>
                            )}
                            <div
                              className={
                                more === index
                                  ? moreOptionMenu
                                    ? "more-menu-option-open more-menu-open-full "
                                    : "more-menu-option-open"
                                  : "more-menu-option-open"
                              }
                              ref={threeDotRef}
                            >
                              <div
                                className="content-icon-alignment"
                                onClick={() => {
                                  AddnewInventoryModaltoggle((e) => !e);
                                  setEditProduct(product);
                                }}
                              >
                                <img src={FeatherEdit} alt="FeatherEdit" />
                                <span>Edit product</span>
                              </div>
                              <div
                                className="content-icon-alignment"
                                onClick={() => {
                                  opendeleteModal();
                                  setDeleteProductId(product._id);
                                }}
                              >
                                <img src={CarbonDelete} alt="CarbonDelete" />
                                <span>Delete</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                {/* <div className="empty-statement-alignment-all">
                  <div className="all-globally-new-statement-empty-alignment">
                    <div className="icon-center-alignment">
                      <svg
                        width="31"
                        height="30"
                        viewBox="0 0 31 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.8787 2.87868L21.3483 3.40901L21.8787 2.87868ZM16.25 7.5V2H14.75V7.5H16.25ZM10 2.75H19.7574V1.25H10V2.75ZM21.3483 3.40901L22.5322 4.59283L23.5928 3.53217L22.409 2.34835L21.3483 3.40901ZM19.7574 2.75C20.3541 2.75 20.9264 2.98705 21.3483 3.40901L22.409 2.34835C21.7057 1.64509 20.7519 1.25 19.7574 1.25V2.75Z"
                          fill="#97A7C3"
                        />
                        <path
                          d="M18.251 7.5H19.001C19.001 7.08579 18.6652 6.75 18.251 6.75V7.5ZM12.751 7.5V6.75C12.3368 6.75 12.001 7.08579 12.001 7.5H12.751ZM12.001 11.625C12.001 12.0392 12.3368 12.375 12.751 12.375C13.1652 12.375 13.501 12.0392 13.501 11.625H12.001ZM19.001 11.625V7.5H17.501V11.625H19.001ZM18.251 6.75H12.751V8.25H18.251V6.75ZM12.001 7.5V11.625H13.501V7.5H12.001Z"
                          fill="#97A7C3"
                        />
                        <path
                          d="M8.25 29.8571H22.75V28.3571H8.25V29.8571ZM24.5 28.1071V16.5139H23V28.1071H24.5ZM8 28.1071V16.5139H6.5V28.1071H8ZM7.25 16.5139C8 16.5139 8 16.5143 8 16.5147C8 16.5148 8 16.5151 8 16.5153C8 16.5157 8 16.5161 8 16.5163C7.99999 16.5168 7.99999 16.5171 7.99999 16.517C7.99999 16.517 8 16.5158 8.00004 16.5135C8.00013 16.5089 8.00033 16.5 8.00082 16.4871C8.00179 16.4612 8.00387 16.4194 8.00833 16.3639C8.01727 16.2526 8.03562 16.088 8.07309 15.8882C8.1486 15.4855 8.2984 14.9576 8.59118 14.4371C9.14913 13.4452 10.2776 12.375 12.75 12.375V10.875C9.72241 10.875 8.10087 12.2492 7.28382 13.7017C6.8891 14.4035 6.69515 15.0978 6.59878 15.6118C6.55031 15.8703 6.5257 16.0877 6.51315 16.2437C6.50687 16.3219 6.50359 16.3851 6.50187 16.4309C6.50101 16.4538 6.50054 16.4723 6.50029 16.4863C6.50016 16.4932 6.50009 16.499 6.50005 16.5036C6.50003 16.506 6.50002 16.508 6.50001 16.5097C6.50001 16.5105 6.5 16.5113 6.5 16.512C6.5 16.5124 6.5 16.5128 6.5 16.513C6.5 16.5135 6.5 16.5139 7.25 16.5139ZM23.75 16.5139C24.5 16.5139 24.5 16.5135 24.5 16.513C24.5 16.5128 24.5 16.5124 24.5 16.512C24.5 16.5113 24.5 16.5105 24.5 16.5097C24.5 16.508 24.5 16.506 24.4999 16.5036C24.4999 16.499 24.4998 16.4932 24.4997 16.4863C24.4995 16.4723 24.499 16.4538 24.4981 16.4309C24.4964 16.3851 24.4931 16.3219 24.4868 16.2437C24.4743 16.0877 24.4497 15.8703 24.4012 15.6118C24.3049 15.0978 24.1109 14.4035 23.7162 13.7017C22.8991 12.2492 21.2776 10.875 18.25 10.875V12.375C20.7224 12.375 21.8509 13.4452 22.4088 14.4371C22.7016 14.9576 22.8514 15.4855 22.9269 15.8882C22.9644 16.088 22.9827 16.2526 22.9917 16.3639C22.9961 16.4194 22.9982 16.4612 22.9992 16.4871C22.9997 16.5 22.9999 16.5089 23 16.5135C23 16.5158 23 16.517 23 16.517C23 16.5171 23 16.5168 23 16.5163C23 16.5161 23 16.5157 23 16.5153C23 16.5151 23 16.5148 23 16.5147C23 16.5143 23 16.5139 23.75 16.5139ZM18.25 10.875H12.75V12.375H18.25V10.875ZM22.75 29.8571C23.7165 29.8571 24.5 29.0736 24.5 28.1071H23C23 28.2452 22.8881 28.3571 22.75 28.3571V29.8571ZM8.25 28.3571C8.11193 28.3571 8 28.2452 8 28.1071H6.5C6.5 29.0736 7.2835 29.8571 8.25 29.8571V28.3571Z"
                          fill="#97A7C3"
                        />
                      </svg>
                    </div>
                    <div className="text-style">
                      <p>No invoices generated so far</p>
                      <h4>
                        Click on <a>Generate new</a> to start billing
                      </h4>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="pagination-top-align">
              <Pagination
                wrapperClass={styles.pagination}
                pages={totalPages}
                current={page}
                onClick={setPage}
              />
            </div>
          </div>
        </motion.div>
      </div>
      {openInventoryModal && (
        <Modal
          modal={openInventoryModal}
          toggle={AddnewInventoryModaltoggle}
          permission={permission}
          close={isCloseHandler}
          editProduct={editProduct}
          SettingInfo={SettingInfo}
        />
      )}
      {openBrandAndCategoryModal && (
        <BrandAndCategoryModal
          permission={permission}
          modal={openBrandAndCategoryModal}
          toggle={BrandAndCategoryModaltoggle}
          SettingInfo={SettingInfo}
        />
      )}
      {productInfoModal && (
        <ProductModalInfo
          modal={productInfoModal}
          toggle={ProductModaltoggle}
          productDetails={productDetails}
          permission={permission}
          getProducts={getProducts}
          SettingInfo={SettingInfo}
        />
      )}
      {deleteModal && (
        <Delete
          modal={deleteModal}
          toggle={deleteModaltoggle}
          deleteProductId={deleteProductId}
          getProducts={getProducts}
        />
      )}
      {importProductExcel && (
        <ImportModal
          isOpen={importProductExcel}
          toggle={() => {
            setImportProductExcel((e) => !e);
          }}
        />
      )}
      {temporaryModal && (
        <TemporaryModal modal={temporaryModal} toggle={TemporaryModaltoggle} />
      )}
      {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
    </>
  );
}
