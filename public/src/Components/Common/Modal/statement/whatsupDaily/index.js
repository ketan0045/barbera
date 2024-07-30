import React, { useEffect, useState } from "react";
import "./whatsupDaily.scss";
import EditIcon from "../../../../../assets/svg/edit-icon-alignment.svg";
import DeleteIcon from "../../../../../assets/svg/new-Delete.svg";
import CloseIcon from "../../../../../assets/svg/add-new-contact.svg";
import CheckedIcon from "../../../../../assets/svg/Checked-statement.svg";
import { ApiGet, ApiPost } from "../../../../../helpers/API/ApiData";
import Auth from "../../../../../helpers/Auth";
import DatePicker from "react-datepicker";
import moment from "moment";
import { get_Setting } from "../../../../../utils/user.util";

export default function WhatsupDaily(props) {
  const userInfo = Auth.getUserDetail();
  const { setOpenDailyWhatsup } = props;
  const [addnew, setAddnew] = useState(false);
  const [ediitContact, setEditContact] = useState(false);
  const [editContactModal, setEditContactModal] = useState(false);
  const [contact, setContact] = useState([]);
  const [contactNumber, setContactNumber] = useState();
  const [contactName, setContactName] = useState();
  const [openEditStatement, setOpenEditStatement] = useState(false);
  const [addedPermission, setAddedPermission] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment("23:00", "hh-mm a")._d
  );
  const [key, setKey] = useState();
  const [showSave, setShowSave] = useState(false);
  const [whatsup, setWhatsup] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [error, setError] = useState({});

  const settingData = get_Setting();
  const [maxTimes, setMaxTimes] = useState(
    moment(settingData?.storeTiming[0]?.endtime, "hh-mm a")._d
  );


 
  const defaultData = [
    [
      "Sales",
      [
        "Total sales",
        "Number of generated invoices",
        "Number of products sold",
        "Average ticket size",
        "Discount offered & Tax",
        "Due amount & Due invoices",
      ],
    ],
    [
      "Appointments",
      ["Total appointments", "Total services availed", "Popular hours"],
    ],
    [
      "Collections",
      [
        "Total sales collections",
        "Opening collection",
        "Closing collection",
        "Expense & Staff pay",
        "Receive from Owner",
        "Transfer to Owner",
      ],
    ],
    ["Staff", ["Staff wise sales", "Staff performance"]],
    [
      "Customers",
      [
        "Available wallet balance",
        "Wallet top-ups",
        "Wallet redeemed",
        "Wallet Withdrawals",
        "Previous due paid",
        "Customer reviews",
        "Custmomer visits",
        "Number of customers added to the system",
      ],
    ],
  ];

  const updateDaily = async (cont) => {
    let updated = {
      permission: addedPermission,
      user: cont ? cont : contact,
      time: selectedDate,
      companyId: userInfo?.companyId,
      featureOn: whatsup,
    };
    await ApiPost("statement", updated)
      .then(async (res) => {
     
        // if(res.data.data?.length == 0 ){
        //   setAddedPermission(defaultData);
        // }else{
        //   setAddedPermission([]);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDailyupdate = async () => {
    await ApiGet("statement/company/" + userInfo?.companyId)
      .then(async (res) => {

        if (res.data.data[0].permission.length == 0) {
          setAddedPermission(defaultData);
          setContact(res.data.data[0].user);
          setWhatsup(res.data.data[0].featureOn);
        } else {
          setAddedPermission(res.data.data[0].permission);
          setContact(res.data.data[0].user);
          setWhatsup(res.data.data[0].featureOn);
          if (res.data.data[0]?.time) {
            // setSelectedDate(moment(res.data.data[0]?.time)._d)
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDailyupdate();
  }, []);

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

  const AddContactlist = () => {
    let errors = {};
    if (contactNumber?.length != 10) {
      errors["contact"] = "* Enter valid contact number";
    } else {
      let contacts = { contactName: contactName, contactNumber: contactNumber };
      if (ediitContact) {
        let newContact = contact?.map((can, i) => {
          if (i == key) {
            return contacts;
          } else {
            return can;
          }
        });
        setContact(newContact);
      } else {
        contact.push(contacts);
        setContact([...contact]);
      }
      setAddnew(!addnew);
      setContactName();
      setContactNumber();
      updateDaily(contact);
      setEditContact(false);
      setKey();
    }
    setError(errors);
  };

  const removeContact = (key) => {
    contact.splice(key, 1);
    setContact([...contact]);
  };

  const editContact = (data, key) => {
    setContactName(data?.contactName);
    setContactNumber(data?.contactNumber);
    setAddnew(!addnew);
    setEditContactModal(!editContactModal);
    setEditContact(true);
    setKey(key);
  };

  const openEditStatementModal = () => {
    setOpenEditStatement(!openEditStatement);
  };

  const AddPermissionData = (data, key, index) => {
    let addedData = addedPermission?.map((permission, i) => {
      if (i == index) {
        if (permission[1].includes(data)) {
          let ind = permission[1].indexOf(data);
          permission[1].splice(ind, 1);
          return [permission[0], [...permission[1]]];
        } else {
          permission[1].push(data);
          return [permission[0], [...permission[1]]];
        }
      } else {
        return permission;
      }
    });
    setAddedPermission(addedData);
  };

  const AddFulldata = (key, data) => {
    let addedData = addedPermission?.map((permission, i) => {
      if (i == key) {
        if (permission[1]?.length > 0) {
          return [permission[0], []];
        } else {
          permission[1].push(data);
          return [permission[0], ...permission[1]];
        }
      } else {
        return permission;
      }
    });

    setAddedPermission(addedData);
  };

  const closeDaily = () => {
    setOpenEditStatement(!openEditStatement);
    getDailyupdate();
  };

  const SaveChanges = () => {
    updateDaily();
    setOpenEditStatement(false);
    setEditContactModal(false);
  };

  const SelectFullDate = (e) => {
   
    setSelectedDate(e);
    setShowSave(!showSave);
  };

 
  const handleOnToggle = async () => {
    setWhatsup(!whatsup);
    let updated = {
      featureOn: !whatsup,
      companyId: userInfo?.companyId,
    };
    await ApiPost("statement", updated)
      .then(async (res) => {
      
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div>
        <div className="cus-modal">
          <div className="modal-header">
            <div className="container-long">
              <div className="modal-header-alignment">
                <div className="modal-heading-title">
                  <div
                    className="modal-close"
                    onClick={() => {
                      setOpenDailyWhatsup(false);
                    }}
                  >
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.9587 10.5H2.04199M2.04199 10.5L10.5003 18.9583M2.04199 10.5L10.5003 2.04167"
                        stroke="#193566"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="modal-title">
                    <h2>Daily statement</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="whatsapp-daily-statement-modal-body">
            <div>
              <div className="all-box-width-fix">
                <div className="whatsapp-header-alignment">
                  <div>
                    <h3>Daily statements</h3>
                    <p>
                    You can have daily statements of the business by enabling this feature
                    </p>
                  </div>

                  <div>
                    <label class="switch" onChange={(e) => handleOnToggle(e)}>
                      <input type="checkbox" checked={whatsup} />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              {whatsup && (
                <>
                  <div className="all-box-width-fix">
                    <div className="whatsapp-header-alignment">
                      <div>
                        <h3>SMS</h3>
                        <p>
                        Added contact numbers will receive daily statements on SMS
                        </p>
                      </div>
                      {editContactModal ? (
                        <div
                          onClick={() => SaveChanges()}
                          style={{ cursor: "pointer" }}
                        >
                          <a>Save changes</a>
                        </div>
                      ) : contact?.length > 0 ? (
                        <div
                          onClick={() => setEditContactModal(!editContactModal)}
                          style={{ cursor: "pointer" }}
                        >
                          <a>Edit contacts</a>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setAddnew(!addnew);
                            setContactName();
                            setContactNumber();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <a>Add contacts</a>
                        </div>
                      )}
                    </div>
                    <div className="whatsapp-body-alignment">
                      {contact?.length > 0 && (
                        <>
                          {contact?.map((con, i) => {
                            return (
                              <div className="all-box-design">
                                <div>
                                  <span>{con?.contactName}</span>
                                </div>
                                <div>
                                  <span style={{ paddingRight: "15px" }}>
                                    +91 {con?.contactNumber}
                                  </span>
                                  {editContactModal && (
                                    <>
                                      <div className="image-left-right-alignment">
                                        <img
                                          src={EditIcon}
                                          alt="EditIcon"
                                          onClick={() => editContact(con, i)}
                                        />
                                      </div>
                                      <div className="image-left-alignment">
                                        <img
                                          src={DeleteIcon}
                                          alt="DeleteIcon"
                                          onClick={() => removeContact(i)}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                    {editContactModal ? (
                      <div className="add-new-box-bottom-alignment">
                        <div
                          className="add-new-box-alignment"
                          onClick={() => {
                            setAddnew(!addnew);
                            setContactName();
                            setContactNumber();
                          }}
                        >
                          <span>+ Add new</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="all-box-width-fix">
                    <div className="time-box-alignment">
                      <div>
                        <h4>Time</h4>
                        <p>At this time, a link would be shared through SMS</p>
                      </div>
                      {showSave && (
                        <span
                          onClick={() => {
                            setShowSave(!showSave);
                            updateDaily();
                          }}
                        >
                          Save Change
                        </span>
                      )}
                      <div style={{ opacity: editContactModal ? "0.5" : "1" }}>
                        <button>
                          <DatePicker
                            selected={selectedDate}
                            disabled
                            // onChange={(e)=>SelectFullDate(e)}
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="hh:mm aa"
                            timeIntervals={15}
                            fixedHeight
                            // minTime={maxTimes}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="all-box-width-fix">
                    <div className="whatsapp-header-alignment">
                      <div>
                        <h3>Daily Statements</h3>
                        <p>Get only selected data points</p>
                      </div>
                      {editContactModal ? (
                        <div style={{ cursor: "pointer", opacity: "0.5" }}>
                          <a>Edit daily statement</a>
                        </div>
                      ) : (
                        <div style={{ cursor: "pointer" }}>
                          <a onClick={() => openEditStatementModal()}>
                            Edit daily statement
                          </a>
                        </div>
                      )}
                    </div>
                    {!editContactModal && (
                      <div className="select-data-section-alignment">
                        <div className="select-data-header-alignment">
                          <p>
                            Selected data fields{" "}
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => setShowMore(!showMore)}
                            >
                              {" "}
                              {showMore ? "View less" : "View list"}
                            </span>
                          </p>
                        </div>
                        {showMore && (
                          <div className="all-data-list-alignment">
                            {addedPermission?.map((perm) => {
                              return (
                                perm[1]?.length > 0 && (
                                  <div className="all-data-list-style">
                                    <h4>{perm[0]}</h4>
                                    <div className="text-style">
                                      {perm[1]?.map((serv) => {
                                        return <span>{serv}</span>;
                                      })}
                                    </div>
                                  </div>
                                )
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {addnew && (
            <>
              <div className="add-new-expenese-modal-design">
                <div className="add-new-contact-desgin-box">
                  <div
                    className="add-new-contact-header"
                    onClick={() => {
                      setAddnew(!addnew);
                      setEditContact(false);
                    }}
                  >
                    <div>
                      <img src={CloseIcon} alt="CloseIcon" />
                    </div>
                    <h5>{ediitContact ? "Edit" : "Add new"} contact</h5>
                  </div>
                  <div className="add-new-contact-modal-body">
                    <div className="new-input-style">
                      <label>Contact name </label>
                      <input
                        type="text"
                        placeholder="e.g. Jethalal Gada"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>
                    <div className="new-input-style">
                      <label>
                        WhatsApp number{" "}
                        <span
                          style={{ color: "red", top: "5px", fontSize: "10px" }}
                        >
                          {" "}
                          {error["contact"]}{" "}
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="+91"
                        value={contactNumber}
                        maxLength="10"
                        minLength={10}
                        onKeyPress={bindInput}
                        onChange={(e) => setContactNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="add-new-contact-footer-alignment">
                    {contactNumber && contactName ? (
                      <button onClick={() => AddContactlist()}>
                        {ediitContact ? "Edit" : "Save"} contact
                      </button>
                    ) : (
                      <button disabled>
                        {ediitContact ? "Edit" : "Save"} contact
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {openEditStatement && (
            <div className="add-opening-modal-design">
              <div className="daily-statement-modal-alignment-for-pages">
                <div className="modal-header-alignment">
                  <div className="left-side-alignment">
                    <div>
                      <img
                        src={CloseIcon}
                        alt="CloseIcon"
                        onClick={() => closeDaily()}
                      />
                    </div>
                    <div>
                      <h3>Daily statement </h3>
                    </div>
                  </div>
                  <div onClick={() => SaveChanges()}>
                    <button>Save Changes</button>
                  </div>
                </div>
                <div className="daily-statement-modal-body">
                  {defaultData?.map((category, i) => {
                 
                    return (
                      <div
                        className={
                          addedPermission[i][1]?.length > 0
                            ? "boder-box boder-box-change"
                            : "boder-box"
                        }
                      >
                        <div
                          className="first-header"
                          onClick={() => AddFulldata(i, category[1])}
                        >
                          <div>
                            <span>{category[0]}</span>
                          </div>
                          <div>
                            {addedPermission[i][1]?.length > 0 && (
                              <img src={CheckedIcon} alt="CheckedIcon" />
                            )}
                          </div>
                        </div>
                        <div
                          className={
                            addedPermission[i][1]?.length > 0
                              ? "more-list-show"
                              : " more-list-hidden"
                          }
                        >
                          <div className="more-list-align-for-all-content">
                            {category[1].map((serv, index) => {
                           
                              return (
                                <div
                                  className={
                                    addedPermission[i][1]?.includes(serv)
                                      ? "more-list-box-active"
                                      : "more-list-box"
                                  }
                                  onClick={() =>
                                    AddPermissionData(serv, index, i)
                                  }
                                >
                                  <div>
                                    <span>{serv}</span>
                                  </div>
                                  <div>
                                    {addedPermission[i][1]?.includes(serv) && (
                                      <img
                                        src={CheckedIcon}
                                        alt="CheckedIcon"
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
