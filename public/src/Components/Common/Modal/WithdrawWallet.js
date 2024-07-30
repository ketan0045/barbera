import React, { useEffect, useState } from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/svg/close-icon.svg";
import { ApiPost } from "../../../helpers/API/ApiData";
import moment from "moment"

export default function WithdrawWallet(props) {
  const { walletAmount,toggle, SettingInfo ,customerDetails,userInfo} = props;
  const [addAmount, setAddAmount] = useState();
  const [subMenuOpen, setSubMenuopen] = useState(false);
  const [splitOpen, setSplitopen] = useState();
  const [edit, setEdit] = useState(false);
  const [splitPayOpen, setSplitPayopen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([
    { method: SettingInfo?.paymentMethod[0] },
  ]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [availableCash,setAvailableCash]=useState()
  const [enable,setEnable]=useState(false)
  
  useEffect(async()=>{
    let closingBala = {
      startTime: moment(new Date()).format("YYYY-MM-DD"),
      endTime: moment(new Date()).add(1, "days").format("YYYY-MM-DD"),
      companyId: userInfo?.companyId,
      paymentMethod:"Cash"
    };
    await ApiPost("expence/daywise/expense", closingBala)
      .then(async (res) => {
        setAvailableCash(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },[])


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

  const AddWalletHandler = () => {
    let walletData = {
      companyId: SettingInfo?.companyId,
      user_id: customerDetails?._id,
      type: "DR",
      method: [{ method: "Cash", amount: addAmount }],
      description: "Withdraw",
      walletAmount: addAmount,
    };

    ApiPost("wallet",walletData).then((resp)=>{
     
      if(resp.data.status === 200){
        toggle(resp.data.status)
      }
    }).catch((er)=>{
      console.log(er)
    })
  };
 
  const SplitPaymentHandler = (data) => {
    if (!addAmount) {
      setSplitopen(true);
    } else {
      setSplitPayopen(!splitPayOpen);
    }
    if (data) {
      setPaymentMethod(data);
    }
  };

  const AddAmountHandler = (e) => {
    if (e.target.value == "" || e.target.value == 0) {
      setAddAmount();
      setEnable(false)
    } else {
      setAddAmount(parseInt(e.target.value));
      if(parseInt(e.target.value) > walletAmount || parseInt(e.target.value) > availableCash){
        setSplitopen(true)
        setEnable(false)
      }else{
        setSplitopen(false)
        setEnable(true)
      }
    }
  };


  const closeOnClick = () => {
    toggle(false);
  };
  return (
    <React.Fragment>
      {!splitPayOpen && <div className="modal-bluer-open"></div>}

      <div className="sub-modal-main">
        <div className="split-sub-modal-wallet">
          <div className="sub-modal-headermenu-wallet">
            <div className="header-alignment-wallet">
              <div
                className="close-button-wallet"
                onClick={() => closeOnClick()}
              >
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h4>Withdraw wallet balance</h4>
            </div>
          </div>
          <div className="sub-modal-body-Forwallet-amount">
                <div className=" form-top-align-space">
                    <label>Withdraw wallet balance</label>
                    <p><span>{SettingInfo?.currentType}</span>{" "}{walletAmount}</p>
                </div>
          </div>

          <div className="sub-modal-body-Forwallet">
            <div className="form-group form-top-align-space">
              <label>Enter amount</label>
              <div className="dropdown-relative">
                <input
                  type="text"
                  value={addAmount}
                  name="amount"
                  placeholder="Enter value"
                  maxLength="10"
                  style={{
                    marginBottom: "5%",
                    border: splitOpen ? "1px solid red" : "1px solid lightgray",
                  }}
                  onChange={(e) => AddAmountHandler(e)}
                  onKeyPress={bindInput}
                />
                <div className="rupee-align">
                  <span className="roboto-font">{SettingInfo?.currentType}</span>
                </div>
              </div>
            </div>

              <div className="option-select-group customer-form-group-align">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Payment methods</label>
                </div>

                <div className="relative">
                  <div
                    className="input-relative"
                    onClick={() => setSubMenuopen(!subMenuOpen)}
                  >
                    <input type="text" value={"Cash"} />
                    <div className="drop-down-icon-center">
                        <span>
                          Available {" "}  {SettingInfo?.currentType}{" "}{availableCash}
                        </span>
                    </div>
                  </div>  
                </div>
              </div>
           
          </div>
          <hr />
          <div className="sub-modal-footer">
            {enable ? (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
                onClick={() => AddWalletHandler()}
              >
                <button>Withdraw amount</button>
              </div>
            ) : (
              <div
                className="button-right-align"
                style={{ margin: "25px 0px 25px 0px" }}
              >
                <button disabled>Add Wallet</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
