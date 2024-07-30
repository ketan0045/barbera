import React, { useEffect, useState } from "react";
import "./expenses.scss";
import NewCloseIcon from "../../../../assets/svg/new-close.svg";
import CoffeeIcon from "../../../../assets/svg/new-coffie.svg";
import { ApiGet } from "../../../../helpers/API/ApiData";
import ExpensesCollections from "./expensesCollections";
export default function AddNewRecord(props) {
  const {toggle}=props
  const [CategoryData, setCategoryData] = useState([]);
  const [ServiceData, setServiceData] = useState([]);
  const [addType, setAddType] = useState("category");
  const [selectedCategoty, setSelectedCategoty] = useState();
  const [selectedService, setSelectedService ]= useState();
  const [addNewCollections, setAddNewCollections] = useState(false);
  useEffect(async () => {
    await ApiGet("expenceCategory")
      .then((res) => {
        setCategoryData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const selectCategoryHandler =async (cat)=>{
    let otherService
    setSelectedCategoty(cat?.categoryName)
    await ApiGet("categoryValue/category/" + cat?._id)
      .then((res) => {
        
        setServiceData(res.data.data);
        otherService=res.data.data[0]
      })
      .catch((err) => {
        console.log(err);
      });
      if(cat?.categoryName == "Other"){
        
      setSelectedService(otherService)
      setServiceData([])
        setAddType("expense")

      }else{
      setAddType("service")
      }
  }

  const selectServiceHandler=(cat)=>{
  
      setSelectedService(cat)
      setServiceData([])
      setAddType("expense")
    

  }

  return (
    <>
      <div className="add-new-expenses-modal-body-record">
        {addType === "category" && 
        <>
        <div className="record-add-header">
          <p>Add expense - Select expense category</p>
        </div>
        <div className="record-add-body">
          {CategoryData?.map((cat) => {
            return (
              <div className="new-box-grid" onClick={()=>selectCategoryHandler(cat)}>
                <div>
                  <img src={cat?.icon} alt="CoffeeIcon" />
                </div>
                <div>
                  <p>{cat?.categoryName}</p>
                </div>
              </div>
            );
          })}
        </div>
        </>}
        {addType === "service" && 
        <><div className="record-add-header">
          <p>Select expense for <span>{selectedCategoty}</span></p>
        </div>
        <div className="record-add-body">
          {ServiceData?.map((cat) => {
            return (
              <div className="new-box-grid " onClick={()=>selectServiceHandler(cat)}>
                <div>
                  <img className="service-img-handle" src={cat?.subIcon} alt="CoffeeIcon" />
                </div>
                <div>
                  <p>{cat?.serviceName}</p>
                </div>
              </div>
            );
          })}
        </div></>}
        {addType == "expense"  && (
        <ExpensesCollections  selectedCategoty={selectedCategoty}  selectedService={selectedService} setAddType={setAddType} toggle={toggle}/>
      )}
      </div>
    </>
  );
}
