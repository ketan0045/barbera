import React, { useEffect, useState ,useRef} from "react";
import Auth from "../../../../helpers/Auth";
import { ApiGet, ApiPost } from "../../../../helpers/API/ApiData";
import moment from "moment";
import DropDownIcon from "../../../../assets/svg/drop-down.svg";
import { get_Setting } from "../../../../utils/user.util";

export default function StaffPay(props) {
  const { toggle,SettingInfo } = props;
  const genderRef = useRef();
  const SettingData = get_Setting();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [method, setMethod] = useState("Cash");
  const userInfo = Auth.getUserDetail();
  const [staffData, setStaffData] = useState([]);
  const [addType, setAddType] = useState("staff");
  const [selectedStaff, setSelectedStaff] = useState();
  const [transferAmount, setTransferAmount] = useState();
  const [disable, setDisable] = useState(true);
  const [expenceNotes, setExpenseNotes] = useState("");
  const [closingBalanceDetail,setClosingBalanceDetail]=useState()

  const handleOnClick = (data) => {
    setSubMenuopen(!subMenuOpen)
    setMethod(data)
};

useEffect(async()=>{
  let closingBala = {
    startTime: moment(new Date()).format("YYYY-MM-DD"),
    endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
    companyId: userInfo?.companyId,
    paymentMethod:method
  };
  await ApiPost("expence/daywise/expense", closingBala)
    .then(async (res) => {
      setClosingBalanceDetail(res.data.data);
      if (transferAmount) {
        if (res.data.data < transferAmount) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
},[method])

  useEffect(async () => {
    await ApiGet("staff/company/" + userInfo?.companyId)
      .then((res) => {
        let filterstaffs = res.data.data.filter((obj) =>
          obj.firstName === "Unassign" ? null : obj
        );
        const sortStaff = filterstaffs?.sort(function (a, b) {
          if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
          if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
          return 0;
        });
        setStaffData(sortStaff);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const selectStaffHandler = (staff) => {
    setAddType("enter");
    setSelectedStaff(staff);
  };

  const handleStaffPaySave=async()=>{
    setDisable(true);
    let transferData={
      amount:transferAmount,
      companyId:userInfo?.companyId,
      type:"DR",
      typeValue:"staff",
      staffId:selectedStaff?._id,
      paymentMethod:method,
      description: expenceNotes
  }
  await ApiPost("expence",transferData)
  .then((res) => {
   
    toggle()
  })
  .catch((err) => {
    console.log(err);
  });
  }

  const expenseHandler = (e) => {
    if(e.target.value == 0 || e.target.value === ""){
      setTransferAmount(e.target.value);
      setDisable(true);
    }else{
      setTransferAmount(parseInt(e.target.value));
      if (closingBalanceDetail > parseInt(e.target.value)){
      setDisable(false);
      }else{
        setDisable(true);
      }
    }
  };

  return (
    <>
      {addType === "staff" && (
        <div className="add-new-expenses-modal-body-record">
          <div className="record-add-header">
            <p>Staff pay - Select a staff</p>
          </div>
          <div className="record-add-body">
            {staffData?.map((cat) => {
              return (
                <div
                  className="new-box-grid"
                  onClick={() => selectStaffHandler(cat)}
                >
                  <div>
                    <p>{cat?.firstName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {addType === "enter" && (
        <div className="add-new-expenses-modal-body-record">
          <div className="add-expense-amount-text">
            <h1>Staff pay - Enter amount</h1>
          </div>

          <div className="add-expense-amount-modal-body">
            <div className="provide-edit-option-list">
              <p>Available {method} balance</p>
              <p>
                <span>{SettingInfo?.currentType}</span>
                {""} {closingBalanceDetail}
              </p>
            </div>
            <div className="provide-staff-edit-option-list">
              <p>{selectedStaff?.firstName}</p>
              <p>
                <a onClick={() => setAddType("staff")}>Edit</a>
              </p>
            </div>
            <div className="amount-type-input">
              <label>Enter amount</label>
              <input
                type="text"
                value={transferAmount}
                placeholder="Enter value"
                 onChange={(e) => expenseHandler(e)}
                onKeyPress={bindInput}
              />
            </div>
            <div className="amount-type-input">
          <label>Additional notes</label>
          <input
            type="text"
            maxLength={60}
            placeholder="Type here"
            value={expenceNotes}
            onChange={(e) => setExpenseNotes(e.target.value)}
          />
        </div>
        {SettingInfo?.collections?.collectionpaymentMethod
                        ?.length > 1 &&  <div className="option-select-group customer-form-group-align">
          <label>Payment Method</label>
          <div className="relative">
            <div
              className="input-relative"
              onClick={() => setSubMenuopen(!subMenuOpen)}
              ref={genderRef}
            >
              <input
                type="text"
                style={{ fontWeight: "500" }}
                name="method"
                value={method}
                placeholder="Select Payment Method"
              />
              <div className="drop-down-icon-center">
                <img src={DropDownIcon} alt="DropDownIcon" />
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
                <ul onClick={(e) => handleOnClick(e.target.innerHTML)}>
                {SettingData?.collections?.collectionpaymentMethod?.map((pay)=>{
                  return(
                    <li value={pay}>{pay}</li>
                  )
                })}
                </ul>
              </div>
            </div>
          </div>
        </div>}
          </div>
          <div className="add-expense-amount-modal-footer">
            {disable ? (
              <button disabled>Save</button>
            ) : (
                 <button  onClick={()=>handleStaffPaySave()}>Save</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
