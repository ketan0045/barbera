import React, {useEffect, useState} from 'react'
import './Modal.scss';
import CloseIcon from '../../../assets/svg/close-icon.svg';
import Auth from "../../../helpers/Auth";
import { toast } from 'react-toastify';
import { ApiGet, ApiPost, ApiPut } from '../../../helpers/API/ApiData';
import xtype from 'xtypejs'

export default function AddNewbrand(props) {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    const { modal, editBrand , AddCustomer ,search } =props
    let mob=""
    let fname =""
    if (xtype(parseInt(search, 10)) === "positive_integer"){
      mob =search
    }else{
        fname=search
    }

    const [fullName, setfullName] = useState(fname)
    const [mobileNumber, setMobileNumber] = useState(mob)
    const [errors, setError] = useState({});
    const [addedCustomerDetail, setAddedCustomerDetail] = useState({});
    const customer = {
        firstName : fullName,
        lastName : "",
        mobileNumber : mobileNumber,
        companyId : userInfo.companyId,
        selectMembership: [],

    }

    const closeOnClick = () => {
        props.toggle(false)
    }

    const AddNewCustomer=(customer)=>{
        if (validateForm()){
            AddCustomer(customer)
        }
    }
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
    
        if (!fullName) {
            formIsValid = false;
            errors["fullname"] = "* Enter valid input";
          }
        if (fullName?.trim() == "") {
          formIsValid = false;
          errors["fullname"] = "* Enter valid input";
        }
     
        if (mobileNumber?.trim() == "") {
            formIsValid = false;
            errors["mobilenumber"] = "* Enter valid Mobilenumber";
          }
         if (mobileNumber.length <10) {
            formIsValid = false;
            errors["mobilenumber"] = "* Enter valid Mobilenumber";
          }
        setError(errors);
        return formIsValid;
      };


    return (
        <>
           {modal ? <div className="modal-bluer-open"></div> :null}
            <div className="sub-modal-main">
                <div className="sub-modal">
                    <div className="sub-modal-header">
                        <div className="header-alignment">
                            <h4>Add new customer</h4>
                            <div className="close-button" onClick={()=>closeOnClick()} >
                                <img src={CloseIcon} alt="CloseIcon"/>
                            </div>
                        </div>
                    </div>
                    <div className="sub-modal-body">
                        <div className="form-group">
                            <label>Full name {<span style={{ color: "red", top: "5px", fontSize: "10px" }}> {errors["fullname"]} </span>} </label>
                            <input type="text" name="fullname" value={fullName} placeholder="Enter customer's name" onChange={(e)=>setfullName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Mobile number {<span style={{ color: "red", top: "5px", fontSize: "10px" }}> {errors["mobilenumber"]} </span>} </label>
                            <input type="text" 
                                name="mobilenumber" 
                                placeholder="+91" 
                                value={mobileNumber}
                                onChange={(e)=>setMobileNumber(e.target.value)}
                                onKeyUp={(event) =>
                                    event.key === "Enter"
                                    }
                                    onKeyPress={(e) => {
                                    if (e.target.value.toString().length > 9) e.preventDefault();
                                    if (
                                        e.which !== 8 &&
                                        e.which !== 0 &&
                                        (e.which < 48 || e.which > 57)
                                    )
                                        e.preventDefault();
                                    }} 
                                  />
                        </div>
                    </div>
                    <div className="sub-modal-footer">
                        <div className="button-right-align">
                            <button onClick={()=>AddNewCustomer(customer)}>Add customer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
