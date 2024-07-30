import React, { useState } from 'react'
import './OptionSelect.scss';
import DropDownIcon from '../../../assets/svg/drop-down.svg';
export default function OptionSelect() {
    const [ subMenuOpen , setSubMenuopen ] = useState(false)
    return (
        <>
            <div className="option-select-group">
                <label>Payment method</label>
                <div className="relative">
                    <div className="input-relative">
                        <input type="text" placeholder="Cash"/>
                        <div className="drop-down-icon-center" onClick={() => setSubMenuopen(!subMenuOpen)}>
                            <img src={DropDownIcon} alt="DropDownIcon"/>
                        </div>
                    </div>
                    <div className={subMenuOpen ? "sub-menu-open sub-menu" : "sub-menu sub-menu-close"}>
                       <div className="sub-menu-design">
                           <ul>
                               <li>My brand</li>
                               <li>My brand</li>
                               <li>My brand</li>
                               <li>My brand</li>
                           </ul>
                       </div>
                    </div>
                </div>
            </div>
        </>
    )
}
