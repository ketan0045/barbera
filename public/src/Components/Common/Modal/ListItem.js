import React from 'react'
import "./style.css"


const HandleServiceNavigation = ({ item, active, setSelected, setHovered,selected ,getAllSelectStaff , SettingInfo }) => {
    

    
    return (       <>
     <span>Selected: {selected ? selected.name : "none"}</span>
     <div 
                                      className="select-service-grid right-space-align" className={`item ${active ? "active" : ""}`}
                                      onClick={() => setSelected(item)}
                                      onMouseEnter={() => setHovered(item)}
                                      onClick={()=>getAllSelectStaff(item)}
                                      
                                      onMouseLeave={() => setHovered(undefined)}> 
                                                <div className="select-service-grid-items">
                                                    <h6>{item.serviceName}</h6>
                                                    <p>{item?.categoryName.length > 30 ? item?.categoryName.substring(0,20) + "..." : item?.categoryName }• {item.duration} mins</p>
                                                </div>
                                                <div className="select-service-grid-items">
                                                    <h5><span>{SettingInfo?.currentType}</span> {item.amount}</h5>
                                                </div>
                                            </div>
                                           
                                            </>
                                   
            

    )
};

export default HandleServiceNavigation;
