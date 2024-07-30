import React from 'react'
import './Success.scss';
import SuccessIcon from '../../../../assets/svg/correct.png';
import ErrorMessage from '../../../../assets/svg/error-message.png';
export default function Success(props) {

    return (
        <div>
            <div className="toaster-modal">
                <div className={props.er ?
                "modal-success-toster error-message-toster":
                "modal-success-toster success-message-toster" }>
                    <div className="grid">
                        <div className="grid-items">
                        {props.er ?   <img src={ErrorMessage} alt="ErrorMessage"/>:
                            <img src={SuccessIcon} alt="SuccessIcon"/>}
                        
                        </div>
                        <div className="grid-items">
                            <p>{props.toastmsg}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
