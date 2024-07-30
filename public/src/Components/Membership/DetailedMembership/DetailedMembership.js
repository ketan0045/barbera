import React, { useEffect, useRef, useState } from "react";
import "../../Common/Modal/Modal.scss";
import SearchIcon from "../../../assets/svg/search.svg";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import DeleteIcon from "../../../assets/svg/Delete-icon.png";
import moment from "moment";
import MembershipModal from "../../Common/Modal/MembershipModal";
import Success from "../../Common/Toaster/Success/Success";
import Auth from "../../../helpers/Auth";
import { ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import Delete from "../../Common/Toaster/Delete";
import EditCatalogueModal from "../../Common/Modal/EditCatalogueModal";
import DiscountedServiceCatalogue from "../../Common/Modal/DiscountedServiceCatalogue";
import ViewInvoiceModal from "../../Common/Modal/ViewInvoiceModal";
import { useHistory } from "react-router-dom";

export default function DetailedMembership(props) {
  const { toggle, getMembershipDetails, SettingInfo} = props;
  const addNewRef = useRef();
  const userInfo = Auth.getUserDetail();
  const permission = userInfo.permission;
  const [editMembership, setEditMembership] = useState(props.editMembership);
  const [deleteMembershipId, setDeleteMembershipId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [addNewMembership, setAddNewMembership] = useState(false);
  const [transactions, setTransactions] = useState(false);
  const [transactionsDetail, setTransactionsDetail] = useState([]);
  const [membersList, setMembersList] = useState(false);
  const [details, setDetails] = useState(true);
  const [active, setActive] = useState(true);
  const [er, setEr] = useState();
  const [success, setSuccess] = useState(false);
  const [toastmsg, setToastmsg] = useState();
  const [activeMembership, setActiveMembership] = useState(true);
  const [proceedToDelete, setProceedToDelete] = useState(false);
  const [flag, setFlag] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [viewInvoiceModal, setViewInvoiceModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchMembershipData, setSearchMembershipData] = useState([]);
  const [memberList, setMemberList] = useState()
  const [keyWord, setKeyWord] = useState("");
  const [filterSubMenu, setFilterSubMenu] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [profile, setProfile] = useState(true);
  const history =useHistory();


  const getTransactions = async () => {
    try {
      // setLoading(true);
      let res = await ApiGet(
        "invoice/membership/" +
          userInfo.companyId +
          "/" +
          props.membershipInfo._id
      );
      
      if (res.data.status === 200) {
        // setLoading(false);
        setTransactionsDetail(res.data.data.transaction.reverse());
        setSearchMembershipData(res.data.data.memberList);
        let temActiveMembers = res.data.data.memberList.filter(invoice => 
          invoice?.isExpire === false).length
        let temTotalSales = res.data.data.memberList.filter(invoice =>
          invoice.invoiceID ).length ;
        setActiveMembers(temActiveMembers);
        setMemberList(res.data.data.memberList)
        setTotalSales(temTotalSales);
          
      } 
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const AddNewMembershipModal = () => {
    membershipModalToggle();
  };
  const membershipModalToggle = (data) => {
    setAddNewMembership(!addNewMembership);
    if (addNewMembership === true) {
      if (data) {
        if (data === 200) {
          setSuccess(true);
          setToastmsg("Changes Saved!");
        } else {
          setSuccess(true);
          setEr("Error");
          setToastmsg("Something went wrong");
        }
      }
    }
  };

  const opendeleteModal = () => {
    deleteModaltoggle();
  };
  const deleteModaltoggle = (data) => {
    setDeleteModal(!deleteModal);
    if (deleteModal === true) {
      if (data === "proceed") {
        setProceedToDelete(true);
      } else {
        setProceedToDelete(false);
      }
    }
  };

  const [editCatalogue, setEditCatalogue] = useState(false);
  const editCatalogueToggle = () => setEditCatalogue(!editCatalogue);

  const [discountedServiceCatalogue, setDiscountedServiceCatalogue] =
    useState(false);
  const discountedServiceCatalogueToggle = () =>
    setDiscountedServiceCatalogue(!discountedServiceCatalogue);

  const isCloseHandler = async (data) => {
    getMembershipDetails();
    let res = await ApiGet("membership/company/" + userInfo.companyId);
   
    try {
      if (res.data.status === 200) {
        const resp = res.data.data;
        const filter = resp.filter((rep) => rep._id === editMembership._id);
        setEditMembership(filter[0]);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catchs");
    }
  };

  useEffect(() => {
    if (proceedToDelete) {
      setFlag(true);
      opendeleteModal();
    } else {
      setFlag(false);
    }
  }, [proceedToDelete]);

  const handleOnClick = (data) => {
    opendeleteModal();
    setDeleteMembershipId(data._id);
  };

  const handleTabOnClick = (e, key) => {
    if (key === "details") {
      setTransactions(false);
      setMembersList(false);
      setDetails(true);
    }
    if (key === "transactions") {
      setTransactions(true);
      setMembersList(false);
      setDetails(false);
    }
    if (key === "memberslist") {
      setTransactions(false);
      setMembersList(true);
      setDetails(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
      setEr();
    }, 1500);
    return () => clearTimeout(timer);
  });

  const MemberhsipToggle = (e) => {
    let memberhsiptoggle = {
      activeMembership: !activeMembership,
    };
    ApiPut("membership/" + props.membershipInfo._id, memberhsiptoggle)
      .then((res) => {
        setActiveMembership(!activeMembership);
        isCloseHandler();
      })
      .catch((er) => {
        toggle(er);
      });
  };

  useEffect(() => {
    setActiveMembership(props.membershipInfo.activeMembership);
  }, [props.membershipInfo]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (filterSubMenu) {
        if (
          filterSubMenu &&
          addNewRef.current &&
          !addNewRef.current.contains(e.target)
        ) {
          setFilterSubMenu(false);
        }
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [filterSubMenu]);

  const TostMSG = (data) => {
    if (data) {
      if (data === "SMS") {
        setSuccess(true);
        setToastmsg("SMS sent successfully!");
        getTransactions();
      } else if (data === "DELETE") {
        setSuccess(true);
        setToastmsg("Invoice deleted!");
        getTransactions();
      } else if (data === "EDIT") {
        setSuccess(true);
        setToastmsg("Changes saved");
        getTransactions();
      } else {
        setSuccess(true);
        setEr("Error");
        setToastmsg("Something went wrong");
      }
    }
  };

  
  const ViewInvoice =async (e, data) => {
    ViewInvoiceModalToggle();
    TostMSG();
    let res = await ApiGet("invoice/" + data);
    
    try {
      if (res.data.status === 200) {
     
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catchs");
    }

    setInvoiceDetail(res.data.data[0]);
  };
  const ViewInvoiceModalToggle = () => {
    setViewInvoiceModal(!viewInvoiceModal);
  };

  const toggleFilter = () => {
    if(filterSubMenu){
      setTransactionsDetail(searchMembershipData);
    }    
      setFilterSubMenu(!filterSubMenu)
  }
  

  const handleOnFilter = (key) => {
    setFilterSubMenu(!filterSubMenu)
    
    if(key === 'active'){
      var filterActiveData = searchMembershipData?.filter(
            (rep) => {
            
              return rep?.isExpire === false});
              setMemberList(filterActiveData);
        
    }else{
    var filterExpiredData = 
          searchMembershipData.length > 0 &&
          searchMembershipData.filter(
            (rep) =>  {
              
              return rep?.isExpire === true});
              setMemberList(filterExpiredData);
        
}
  }

 
  const handleOnSearch = (e) => {
    setKeyWord(e.target.value);
    var searchData =
      searchMembershipData.filter(
        (rep) =>
          rep?.invoiceID
            ?.includes(e.target.value?.toLowerCase()) ||
          rep?.customer
            ?.toString()?.toLowerCase()
            .includes(e.target.value?.toString()) 
      );
    // setTransactionsDetail(searchData);
    setMemberList(searchData)
    if (e.target.value === "") {
      getTransactions()
    } else {
      setMemberList(searchData)
      // setTransactionsDetail(searchData);
    }
  };

  const transactionSearch = (e) => {
    // setKeyWord(e.target.value);
    
    var searchData =
    transactionsDetail.filter(
        (rep) =>
          rep?.invoiceId
            ?.includes(e.target.value?.toLowerCase()) ||
          rep?.customer?.firstName
            ?.toString()?.toLowerCase()
            .includes(e.target.value?.toString()) 
      );
    setTransactionsDetail(searchData);
    if (e.target.value === "") {
      getTransactions()
    } else {
      setTransactionsDetail(searchData);
    }
  }

  return (
    <div className="cus-modal">
      <div className="modal-header">
        <div className="container-long">
          {addNewMembership && (
            <MembershipModal
              modal={addNewMembership}
              toggle={membershipModalToggle}
              editMembership={editMembership}
              close={isCloseHandler}
              SettingInfo={SettingInfo}
            />
          )}
          {deleteModal && (
            <Delete
              modal={deleteModal}
              toggle={deleteModaltoggle}
              deleteMembershipId={deleteMembershipId}
              toggler={toggle}
              flag={flag}
              getMembershipDetails={getMembershipDetails}
            />
          )}
          {editCatalogue && (
            <EditCatalogueModal
              modal={editCatalogue}
              toggle={editCatalogueToggle}
              membershipData={editMembership?.selectedServices}
              SettingInfo={SettingInfo}

            />
          )}
          {discountedServiceCatalogue && (
            <DiscountedServiceCatalogue
              modal={discountedServiceCatalogue}
              toggle={discountedServiceCatalogueToggle}
              SettingInfo={SettingInfo}
            />
          )}
          {success && <Success modal={success} er={er} toastmsg={toastmsg} />}
          {/* modal header */}
          <div className="modal-header-alignment">
            <div className="modal-heading-title">
              <div onClick={() => toggle()} className="modal-close">
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <div className="modal-title">
                <h2>{editMembership?.membershipName}</h2>
              </div>
            </div>
            {permission?.filter((obj) => obj.name === "Edit/delete membership")[0]?.isChecked === false ? null :
            <div className="product-edit-delete-button-align">
              <div
                className="delete-button-style"
                onClick={() => handleOnClick(editMembership)}
              >
                <img src={DeleteIcon} alt="DeleteIcon" />
              </div>
                <div className="edit-product-button">
                  <button onClick={() => AddNewMembershipModal()}>
                    Edit membership
                  </button>
                </div>
            </div>
            }
          </div>
        </div>
      </div>
      <div className="container-long">
        <div className="gold-section-left-right-align">
          <div className="gold-grid">
            <div className="gold-grid-items">
              <div className="cus-tab-design">
                <ul>
                  <li
                    style={
                      details
                        ? {
                            background:
                              "linear-gradient(0deg, #F3F8FF, #F3F8FF)",
                          }
                        : null
                    }
                    onClick={(e) => handleTabOnClick(e, "details")}
                  >
                    Details
                  </li>
                  <li
                    style={
                      transactions
                        ? {
                            background:
                              "linear-gradient(0deg, #F3F8FF, #F3F8FF)",
                          }
                        : null
                    }
                    onClick={(e) => handleTabOnClick(e, "transactions")}
                  >
                    Transactions
                  </li>
                  <li
                    style={
                      membersList
                        ? {
                            background:
                              "linear-gradient(0deg, #F3F8FF, #F3F8FF)",
                          }
                        : null
                    }
                    onClick={(e) => handleTabOnClick(e, "memberslist")}
                  >
                    Members list
                  </li>
                </ul>
              </div>
            </div>
            {details && (
              <div className="gold-grid-items">
                <div className="active-box-left-align">
                  <div className="active-box-design">
                    <div className={activeMembership ? "alignment-all-content" : "alignment-all-content_inaction"}>
                      <button>{activeMembership ? "Active" : "Inactive"}</button>
                      {permission?.filter((obj) => obj.name === "Edit/delete membership")[0]?.isChecked === false ? null :
                        <div>
                          <label class="switch">
                            <input
                              type="checkbox"
                              name="toggle"
                              checked={activeMembership}
                              onChange={(e) => MemberhsipToggle(e)}
                            />
                            <span class="slider round"></span>
                          </label>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="all-details-section-alignment">
                  <div className="deatails-title">
                    <h1>Sales</h1>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Total sales</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>{totalSales}</p>
                      </div>
                    </div>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Active members</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>{activeMembers}</p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="all-details-section-alignment"> */}
                  {/* <div className="deatails-title">
                      <h1>Sales</h1>
                      <div className="details-child-text-grid">
                        <div className="details-child-text-grid-items">
                          <span>Total sales</span>
                        </div>
                        <div className="details-child-text-grid-items">
                          <p>20</p>
                        </div>
                      </div>
                      <div className="details-child-text-grid">
                        <div className="details-child-text-grid-items">
                          <span>Active members</span>
                        </div>
                        <div className="details-child-text-grid-items">
                          <p>15</p>
                        </div>
                      </div>
                    </div> */}
                  <div className="deatails-title">
                    <h1>Membership info</h1>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Name</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>{editMembership?.membershipName}</p>
                      </div>
                    </div>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Description</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>{editMembership?.membershipDescription}</p>
                      </div>
                    </div>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Price</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>{SettingInfo?.currentType} {editMembership?.price}</p>
                      </div>
                    </div>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Duration</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>
                          {editMembership?.duration}{" "}
                          {editMembership?.duration === "1"
                            ? "month"
                            : "months"}
                        </p>
                      </div>
                    </div>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>No. of times Valid for</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>
                          {editMembership?.validFor === "Limited"
                            ? `${editMembership?.availService} times (${editMembership?.validFor})`
                            : editMembership?.validFor}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="deatails-title">
                    <h1>Membership benefits</h1>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Benefits</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>{editMembership?.membershipBenifits}</p>
                      </div>
                    </div>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Selected services</span>
                      </div>
                      {editMembership?.membershipBenifits === "Discounted" ? (
                        <div className="details-child-text-grid-items">
                          <p
                            style={{ color: "#1479FF", cursor: "pointer" }}
                            onClick={() => discountedServiceCatalogueToggle()}
                          >
                            Open services catalogue
                          </p>
                        </div>
                      ) : (
                        <div className="details-child-text-grid-items">
                          <p
                            style={{ color: "#1479FF", cursor: "pointer" }}
                            onClick={() => editCatalogueToggle()}
                          >
                            Open services catalogue
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="deatails-title">
                    <h1>Active hours & days </h1>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Active hours</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>
                          {moment(
                            editMembership?.activeHours?.startTime,
                            "HH:mm"
                          ).format("hh:mm a")}{" "}
                          to{" "}
                          {moment(
                            editMembership?.activeHours?.endTime,
                            "HH:mm"
                          ).format("hh:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Active days</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>
                          {editMembership?.activeDays?.length > 0 &&
                            editMembership?.activeDays?.reduce((prev, curr) => [
                              prev,
                              ", ",
                              curr,
                            ])}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="deatails-title">
                    <h1 style={{ color: "black" }}>Tax</h1>
                  </div>
                  <div className="details-child-text-grid">
                    <div className="details-child-text-grid-items">
                      <span>Charge tax</span>
                    </div>
                    <div className="details-child-text-grid-items">
                      {editMembership?.tax === true ? (
                        <button>Enabled</button>
                      ) : (
                        <button
                          style={{
                            backgroundColor: "rgb(230, 102, 102, 0.3)",
                            color: "rgb(230, 102, 102)",
                          }}
                        >
                          Disabled
                        </button>
                      )}
                    </div>
                  </div>
                  {editMembership?.tax === true && (
                    <div className="details-child-text-grid">
                      <div className="details-child-text-grid-items">
                        <span>Tax %</span>
                      </div>
                      <div className="details-child-text-grid-items">
                        <p>CGST 9%, SGST 9% ({SettingInfo?.tax?.gstType}  GST)</p>
                      </div>
                    </div>
                  )}
                  {/* </div> */}
                </div>
              </div>
            )}
            {transactions && (
              <div className="gold-grid-items">
                <div className="search-left-align">
                  <div className="membership-search">
                    <input
                      type="search"
                      onChange={(e) => transactionSearch(e)}
                      placeholder="Search customer or invoice #"
                    />
                    <div className="membership-search-alignment">
                      <img src={SearchIcon} alt="SearchIcon" />
                    </div>
                  </div>
                </div>
                <div className="membership-gold-table">
                  <table className="membership-gold-details">
                    <tr>
                      <th align="left">Customer name</th>
                      <th align="left">Date</th>
                      <th align="left">Invoice #</th>
                      <th align="center">Services redeemed</th>
                      <th align="right">Discounts</th>
                    </tr>
                    {transactionsDetail?.filter(invoice =>
                          invoice?.isCustomerWithoutMembership === true && invoice).map((resp, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <span>{resp?.customer?.firstName}</span>
                          </td>
                          <td>
                            <span>
                              {moment(resp?.created).format("DD/MM/YYYY")}
                            </span>
                          </td>
                          <td onClick={(e) => ViewInvoice(e, resp?._id)}>
                            <span className="invoice-blue-color">
                              {resp?.invoiceId}
                            </span>
                          </td>
                          <td>
                            <span align="center" className="text-center">
                              {resp?.membershipServiceRedeemed}
                            </span>
                          </td>
                          <td>
                            <span className="text-right">
                              <a>{SettingInfo?.currentType}</a> {parseInt((resp?.discountMembership).toFixed(2),10)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            )}
            {membersList && ( 
              <div className="gold-grid-items">
                <div className="only-members-left-right-align">
                  <div className="member-search-grid">
                    <div className="member-search-grid-items">
                      <div className="relative">
                        <input
                          type="search"
                          onChange={(e) => handleOnSearch(e)}
                          placeholder="Search members"
                          autoFocus
                        />
                        <div className="search-left-align-div">
                          <img src={SearchIcon} alt="SearchIcon" />
                        </div>
                      </div>
                    </div>
                    <div className="member-search-grid-items" ref={addNewRef}>
                    <div className="filter-menu" onClick={() => toggleFilter()}>
                        <svg
                          width="21"
                          height="19"
                          viewBox="0 0 21 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line
                            y1="2.84314"
                            x2="21"
                            y2="2.84314"
                            stroke="#1479FF"
                            stroke-width="1.75"
                          />
                          <line
                            y1="15.6853"
                            x2="21"
                            y2="15.6853"
                            stroke="#1479FF"
                            stroke-width="1.75"
                          />
                          <line
                            y1="9.26379"
                            x2="21"
                            y2="9.26379"
                            stroke="#1479FF"
                            stroke-width="1.75"
                          />
                          <path
                            d="M18.1287 2.7037C18.1287 3.77352 17.2473 4.65739 16.1395 4.65739C15.0317 4.65739 14.1504 3.77352 14.1504 2.7037C14.1504 1.63388 15.0317 0.75 16.1395 0.75C17.2473 0.75 18.1287 1.63388 18.1287 2.7037Z"
                            fill="#1479FF"
                            stroke="#1479FF"
                            stroke-width="1.5"
                          />
                          <path
                            d="M18.1287 15.546C18.1287 16.6158 17.2473 17.4997 16.1395 17.4997C15.0317 17.4997 14.1504 16.6158 14.1504 15.546C14.1504 14.4762 15.0317 13.5923 16.1395 13.5923C17.2473 13.5923 18.1287 14.4762 18.1287 15.546Z"
                            fill="#1479FF"
                            stroke="#1479FF"
                            stroke-width="1.5"
                          />
                          <path
                            d="M6.02807 9.1246C6.02807 10.1944 5.14674 11.0783 4.03894 11.0783C2.93113 11.0783 2.0498 10.1944 2.0498 9.1246C2.0498 8.05477 2.93113 7.1709 4.03894 7.1709C5.14674 7.1709 6.02807 8.05477 6.02807 9.1246Z"
                            fill="#1479FF"
                            stroke="#1479FF"
                            stroke-width="1.5"
                          />
                        </svg>
                      </div>
                      <div className={filterSubMenu ? "filter-menu-design-membership filter-menu-design-membership-show" : "filter-menu-design-membership-hidden filter-menu-design-membership"}>
                        <div className="filte-active-design">
                        <ul>
                          <li onClick={()=>handleOnFilter('active')}>Active</li>
                          <li onClick={()=>handleOnFilter('expired')}>Expired</li>
                        </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="member-search-details-table">
                  <table className="member-search-data">
                    <tr>
                      <th align="left">Customer name</th>
                      <th align="left">Date of purchase</th>
                      <th align="left">Invoice #</th>
                      <th align="left">Validity</th>
                      <th align="center">Services redeemed</th>
                      <th align="right">Status</th>
                    </tr>

                    {memberList?.length > 0 && memberList?.map((resp, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <span className="blue-color-style" onClick={()=>history.push(`/customer?id=${resp?.customer_id}`)}>
                              {resp?.customer}
                            </span>
                          </td>
                          <td>
                            <span>
                              {resp?.invoiceID ? 
                              moment(resp?.purchaseDate).format("DD/MM/YYYY") 
                              : '-'}
                            </span>
                          </td> 
                          {/* {resp?.isCustomerWithoutMembership
                          ? ( */}
                          {resp?.invoiceID ? 
                          <td onClick={(e) => ViewInvoice(e, resp?.invoice_id)}>
                              <span className="blue-color-style">{resp?.invoiceID}</span>
                            </td>
                             
                          : (<td>
                              <span>{'-'}</span>
                            </td> )} 
                          <td>
                            <span>
                              {
                                resp?.customer?.selectMembership?.slice(-1)[0]
                                  ?.remainingDays
                              }{" "}
                              {resp?.validity} days
                            </span>
                          </td>
                          <td className="text-center">
                            {
                              resp?.validFor === "Limited" ?
                              <span>{resp?.availService - resp?.remainingService}</span> :
                              <span>{resp?.remainingService === null ? 0 : resp?.remainingService }</span>
                            }
                          </td>
                          <td align="right">
                            {/* <button>Active</button>
                            <button>Expired</button> */}

                            {/* {resp?.customerData?.selectMembership?.slice(-1)[0]
                              ?. */}
                             { resp?.isExpire === false ? (
                              <button>Active</button>
                            ) : (
                              <button
                                style={{
                                  background: "#6F737D33",
                                  color: "#6F737D",
                                  fontWeight: "600",
                                }}
                              >
                                Expired
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {viewInvoiceModal && (
        <ViewInvoiceModal
          modal={viewInvoiceModal}
          toggle={ViewInvoiceModalToggle}
          ViewInvoice={ViewInvoice}
          invoice={invoiceDetail}
          TostMSG={TostMSG}
          SettingInfo={SettingInfo}
        />
      )}
    </div>
  );
}
