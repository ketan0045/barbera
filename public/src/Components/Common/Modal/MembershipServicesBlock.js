import React, { useState, useEffect } from "react";
import MembershipServices from "./MembershipServices";

const MembershipServicesBlock = (props) => {
  const {
    selectAllServices,
    setSelectAllServices,
    temSelMembershipData,
    setTemSelMembershipData,
    selectedCategory,
    cleanRepeatObject,
    setCleanRepeatObject,
    detailedCategories,
    search,
    setSearch,
    temFinalMembershipData,
    data,
    SettingInfo
  } = props;
  const rep = props.blockData;

  const [serviceDiscount, setServiceDiscount] = useState(
    rep?.percentageDiscount ? rep?.percentageDiscount : 0 
  );
  const [serviceDiscountRs, setServiceDiscountRs] = useState(
    rep?.rupeesDiscount ? rep?.rupeesDiscount : 0
  );
  const [memberShipPrice, setMemberShipPrice] = useState(
    rep?.finalDiscountedAmount ? rep?.finalDiscountedAmount : rep?.amount
  );
  const [serviceDiscount1, setServiceDiscount1] = useState(0);
  const [serviceDiscountRss, setServiceDiscountRss] = useState(0);
  const [falseCheckboxData, setFalseCheckboxData] = useState([]);
  

  useEffect(()=>{
    const exist = temSelMembershipData?.find((x) => x._id === rep._id);
    setServiceDiscountRs(exist?.rupeesDiscount)
    setMemberShipPrice(exist?.finalDiscountedAmount)
    setServiceDiscount(exist?.percentageDiscount)
    setSearch(false)
  },[search])

  useEffect(() => {
    setCleanRepeatObject(!cleanRepeatObject);    
    if (props.allServiceDiscountPer === undefined) {
      
      if(temFinalMembershipData.length === 0){
        setMemberShipPrice(rep?.amount);
      }

    } else {
    setServiceDiscount(props.allServiceDiscountPer);
      let discountinrs = (rep?.amount * props.allServiceDiscountPer) / 100;
    
      if (selectAllServices.includes(rep?.serviceName)) {
        setMemberShipPrice(rep?.amount - discountinrs);
      } else {
        setMemberShipPrice(rep?.amount);
      }
      setServiceDiscountRs(discountinrs);

      if (selectAllServices.includes(rep?.serviceName)) {
        props.setTemSelMembershipData((prev) => {
          return prev.map((onedata) => {
            if (onedata._id === rep._id) {
              return {
                _id: rep._id,
                serviceName: rep.serviceName,
                amount: rep.amount,
                percentageDiscount: parseInt(props.allServiceDiscountPer ,10),
                rupeesDiscount: discountinrs,
                finalDiscountedAmount: rep.amount - discountinrs,
                categoryId: rep.categoryId,
                categoryName: rep.categoryName,
                colour: rep.colour,
                companyId: rep.companyId,
                default: rep.default,
                duration: rep.duration,
                isActive: rep.isActive,
                __v: rep.__v,
                isChecked: rep.isChecked === undefined ? true : rep.isChecked,
              };
            } else {
              return onedata;
            }
          });
        });
      }
    }
  }, [
    props.allServiceDiscountPer
  ]);
  
  useEffect(() => {
    setCleanRepeatObject(!cleanRepeatObject);
    if (props.allServiceDiscountRs === undefined) {
    
      if(temFinalMembershipData.length === 0){
        // setMemberShipPrice(rep?.amount);
      }
    } else {
      let discountInPr = parseFloat(((100 * parseInt(props.allServiceDiscountRs,10)) / rep?.amount).toFixed(2),10);
      setServiceDiscount(discountInPr);
      setServiceDiscountRs(props.allServiceDiscountRs);
      if (selectAllServices.includes(rep?.serviceName)) {
        setMemberShipPrice(rep?.amount - props.allServiceDiscountRs);
      } else {
        setMemberShipPrice(rep?.amount);
      }

      if (selectAllServices.includes(rep?.serviceName)) {
      setCleanRepeatObject(!cleanRepeatObject);
        props.setTemSelMembershipData((prev) => {
          return prev.map((onedata) => {
            if (onedata._id === rep._id) {
              return {
                _id: rep._id,
                serviceName: rep.serviceName,
                amount: rep.amount,
                percentageDiscount: discountInPr,
                rupeesDiscount:parseInt( props.allServiceDiscountRs,10),
                finalDiscountedAmount: rep?.amount - props.allServiceDiscountRs,
                categoryId: rep.categoryId,
                categoryName: rep.categoryName,
                colour: rep.colour,
                companyId: rep.companyId,
                default: rep.default,
                duration: rep.duration,
                isActive: rep.isActive,
                __v: rep.__v,
                isChecked: rep.isChecked === undefined ? true : rep.isChecked,
              };
            } else {
              return onedata;
            }
          });
        });
      }
    }
  }, [props.allServiceDiscountRs ]);

  useEffect(() => {
    setCleanRepeatObject(!cleanRepeatObject);
   
    if (
      selectedCategory &&
      selectedCategory[0].categoryId === rep?.categoryId
    ) {
      setServiceDiscount(props.serviceDiscountPer);
      let discountinrs = (rep?.amount * props.serviceDiscountPer) / 100;
      if (rep?._id !== falseCheckboxData?.map((item) => item._id)[0]) {
        setMemberShipPrice(rep?.amount - discountinrs);
      }
      setServiceDiscountRs(discountinrs);
      if (selectAllServices.includes(rep?.serviceName)) {
        props.setTemSelMembershipData((prev) => {
          return prev.map((onedata) => {
            if (onedata._id === rep._id) {
              return {
                _id: rep._id,
                serviceName: rep.serviceName,
                amount: rep.amount,
                percentageDiscount: parseInt(props.serviceDiscountPer,10),
                rupeesDiscount: discountinrs,
                finalDiscountedAmount: rep?.amount - discountinrs,
                categoryId: rep.categoryId,
                categoryName: rep.categoryName,
                colour: rep.colour,
                companyId: rep.companyId,
                default: rep.default,
                duration: rep.duration,
                isActive: rep.isActive,
                __v: rep.__v,
                isChecked: rep.isChecked === undefined ? true : rep.isChecked,
              };
            } else {
              return onedata;
            }
          });
        });
      }else{
        setMemberShipPrice(rep?.amount)
      }
    }
  }, [props.serviceDiscountPer]);

  useEffect(() => {
    setCleanRepeatObject(!cleanRepeatObject);
    
    if (
      selectedCategory &&
      selectedCategory[0].categoryId === rep?.categoryId
    ) {
      if (props.serviceDiscountRs === undefined) {
      } else {
        let discountInPr = parseFloat(((100 * parseInt(props.serviceDiscountRs,10)) / rep?.amount).toFixed(2),10);
        setServiceDiscount(discountInPr);
        setServiceDiscountRs(props.serviceDiscountRs);
        if (rep?._id !== falseCheckboxData?.map((item) => item._id)[0]) {
          setMemberShipPrice(rep?.amount - props.serviceDiscountRs);
        }
        if (selectAllServices.includes(rep?.serviceName)) {
          props.setTemSelMembershipData((prev) => {
            return prev.map((onedata) => {
              if (onedata._id === rep._id) {
                return {
                  _id: rep._id,
                  serviceName: rep.serviceName,
                  amount: rep.amount,
                  percentageDiscount: parseFloat(discountInPr,10),
                  rupeesDiscount: parseInt(props.serviceDiscountRs ,10),
                  finalDiscountedAmount: rep?.amount - props.serviceDiscountRs,
                  categoryId: rep.categoryId,
                  categoryName: rep.categoryName,
                  colour: rep.colour,
                  companyId: rep.companyId,
                  default: rep.default,
                  duration: rep.duration,
                  isActive: rep.isActive,
                  __v: rep.__v,
                  isChecked: rep.isChecked === undefined ? true : rep.isChecked,
                };
              } else {
                return onedata;
              }
            });
          });
        }
      }
    }
  }, [props.serviceDiscountRs]);
 

  const disCountChangeHandler = (data) => {
    setCleanRepeatObject(!cleanRepeatObject);

    
    if (100 >= data) {
 
      setServiceDiscount(data);
      let discountinrs = (rep?.amount * data) / 100;
      setServiceDiscountRs(parseFloat(discountinrs.toFixed(2),10));
      setMemberShipPrice(rep?.amount - discountinrs);
     
      // if (selectAllServices.includes(rep?.serviceName)) {
        props.setTemSelMembershipData((prev) => {
          return prev.map((onedata) => {
            if (onedata._id === rep._id) {
              return {
                _id: rep._id,
                serviceName: rep.serviceName,
                amount: rep.amount,
                percentageDiscount: parseInt(data,10),
                rupeesDiscount: parseInt(discountinrs,10) ,
                finalDiscountedAmount: rep?.amount - discountinrs,
                categoryId: rep.categoryId,
                categoryName: rep.categoryName,
                colour: rep.colour,
                companyId: rep.companyId,
                default: rep.default,
                duration: rep.duration,
                isActive: rep.isActive,
                __v: rep.__v,
                isChecked: rep.isChecked === undefined ? true : rep.isChecked,
              };
            } else {
              return onedata;
            }
          });
        });
      // }
    } else {
    }
  };

  const disCountRsChangeHandler = (data) => {
    let compare =
      props.temSelMembershipData &&
      props.temSelMembershipData.filter((item) => item?._id === rep?._id);
    if (compare && compare[0].amount >= data) {
      setServiceDiscountRs(data);
      let discountInPr = (100 * data) / rep?.amount;
      setServiceDiscount(parseFloat(discountInPr.toFixed(2),10));
      setMemberShipPrice(rep?.amount - data);

      if (selectAllServices.includes(rep?.serviceName)) {
        props.setTemSelMembershipData((prev) => {
          return prev.map((onedata) => {
            if (onedata._id === rep._id) {
              return {
                _id: rep._id,
                serviceName: rep.serviceName,
                amount: rep.amount,
                percentageDiscount: parseInt(discountInPr,10),
                rupeesDiscount: parseInt(data,10),
                finalDiscountedAmount: rep?.amount - data,
                categoryId: rep.categoryId,
                categoryName: rep.categoryName,
                colour: rep.colour,
                companyId: rep.companyId,
                default: rep.default,
                duration: rep.duration,
                isActive: rep.isActive,
                __v: rep.__v,
                isChecked: rep.isChecked === undefined ? true : rep.isChecked,
              };
            } else {
              return onedata;
            }
          });
        });
      }
    }
  };

  const memberShipPriceChangeHandler = (event) => {
    
    let discountInPr = parseFloat((100 - (100 * event.target.value) / rep?.amount).toFixed(2),10);
    if (rep?.amount >= event.target.value) {
      setMemberShipPrice(event.target.value);
      setServiceDiscount(discountInPr);
      setServiceDiscountRs(parseFloat(((rep?.amount * discountInPr) / 100).toFixed(2),10));
    }

    if (selectAllServices.includes(rep?.serviceName)) {
      props.setTemSelMembershipData((prev) => {
        return prev.map((onedata) => {
          if (onedata._id !== rep._id) {
           
            return onedata;
            
          } else {return {
            _id: rep._id,
            serviceName: rep.serviceName,
            amount: rep.amount,
            percentageDiscount: discountInPr,
            rupeesDiscount: (rep?.amount * discountInPr) / 100,
            finalDiscountedAmount: event.target.value,
            categoryId: rep.categoryId,
            categoryName: rep.categoryName,
            colour: rep.colour,
            companyId: rep.companyId,
            default: rep.default,
            duration: rep.duration,
            isActive: rep.isActive,
            __v: rep.__v,
            isChecked: rep.isChecked === undefined ? true : rep.isChecked,
          }}
        });
      });
    }
  };

  const checkBoxHandler = (event) => {
    setCleanRepeatObject(!cleanRepeatObject);
    let discountinrs = (rep?.amount * serviceDiscount) / 100;
    if (selectAllServices.includes(rep?.serviceName)) {
      setServiceDiscount1(0);
      setServiceDiscountRss(0);
      setMemberShipPrice(rep?.amount);
    } else {
      setServiceDiscount(serviceDiscount);
      // setServiceDiscount(serviceDiscount === (undefined || NaN) ? 0 : serviceDiscount);
      setServiceDiscountRs(discountinrs);
      setMemberShipPrice(rep?.amount - discountinrs);
    }

    if (selectAllServices.includes(rep?.serviceName)) {
      // console.log("memberShipPrice",memberShipPrice);
      setFalseCheckboxData((prev) => [
        ...prev,
        {
          _id: rep._id,
          serviceName: rep.serviceName,
          amount: rep.amount,
          percentageDiscount: parseInt(serviceDiscount,10),
          rupeesDiscount: serviceDiscountRs,
          finalDiscountedAmount: memberShipPrice,
          categoryId: rep.categoryId,
          categoryName: rep.categoryName,
          colour: rep.colour,
          companyId: rep.companyId,
          default: rep.default,
          duration: rep.duration,
          isActive: rep.isActive,
          __v: rep.__v,
          isChecked: true,

        },
      ]);
    } else {
      // setMemberShipPrice(rep.finalDiscountedAmount)
      
      setFalseCheckboxData((prev) => {
        return prev.filter((onedata) => onedata._id !== rep._id);
      });
    }
    if (selectAllServices.includes(rep?.serviceName)) {
      

      setCleanRepeatObject(!cleanRepeatObject);
      setTemSelMembershipData(
        temSelMembershipData.map((service) => {
        
          if (service.serviceName === rep?.serviceName) {
            return { ...service, 
              percentageDiscount: service.isChecked === true ? 0 : service?.percentageDiscount,
              rupeesDiscount: service.isChecked === true ? 0 : service?.rupeesDiscount,
              finalDiscountedAmount:service?.amount,
              isChecked: false};
          } else {
            return service;
          }
        })
      );
    } else {
      
      setTemSelMembershipData(
        temSelMembershipData.map((service) => {
          if (service.serviceName === rep?.serviceName) {
            return { ...service, 
              percentageDiscount: serviceDiscount,
              rupeesDiscount: serviceDiscountRs,
              finalDiscountedAmount:memberShipPrice,
              isChecked: true };
          } else {
            return service;
          }
        })
      );
    }

    if (selectAllServices.includes(rep?.serviceName)) {
      let index = selectAllServices.indexOf(event.target.name);
      selectAllServices.splice(index, 1);
    } else {
      selectAllServices.push(event.target.name);
    }
    setSelectAllServices([...selectAllServices]);

    // setmemberShipchecked(!memberShipchecked);
  };

  //   if (!memberShipchecked) {
  //     props.setTemSelMembershipData((prev) => [
  //       ...prev,
  //       {
  //         _id: rep._id,
  //         serviceName: rep.serviceName,
  //         amount: rep.amount,
  //         percentageDiscount: serviceDiscount,
  //         rupeesDiscount: serviceDiscountRs,
  //         finalDiscountedAmount: memberShipPrice,
  //         categoryId: rep.categoryId,
  //         categoryName: rep.categoryName,
  //         colour: rep.colour,
  //         companyId: rep.companyId,
  //         default: rep.default,
  //         duration: rep.duration,
  //         isActive: rep.isActive,
  //         __v: rep.__v,
  //         isChecked: true,
  //       },
  //     ]);
  //   } else {
  //     props.setTemSelMembershipData((prev) => {
  //       return prev.filter((onedata) => onedata._id !== rep._id);
  //     });
  //   }
  //   setmemberShipchecked(!memberShipchecked);
  // };
  const vale = [...falseCheckboxData]
  
  useEffect(() => {
    setCleanRepeatObject(!cleanRepeatObject);
    if (selectAllServices) {
      props.setTemSelMembershipData((prev) => [
        ...prev,
        {
          _id: rep._id,
          serviceName: rep.serviceName,
          amount: rep.amount,
          percentageDiscount: serviceDiscount  ? parseInt(serviceDiscount,10): 0,
          rupeesDiscount: serviceDiscountRs ? parseInt(serviceDiscountRs,10)  : 0,
          finalDiscountedAmount: memberShipPrice ? parseInt(memberShipPrice,10)  : rep.amount,
          categoryId: rep.categoryId,
          categoryName: rep.categoryName,
          colour: rep.colour,
          companyId: rep.companyId,
          default: rep.default,
          duration: rep.duration,
          isActive: rep.isActive,
          __v: rep.__v,
          isChecked: rep.isChecked === undefined ? true : rep.isChecked,
        },
      ]);
      // setmemberShipchecked( rep.isChecked === undefined ? true : rep.isChecked);
    } else {
      props.setTemSelMembershipData((prev) => {
        return prev.filter((onedata) => onedata._id !== rep._id);
      });
      // setmemberShipchecked(false);
    }
    
  }, [selectAllServices]);
  

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

  

  

  
  return props.hide.includes(rep.categoryName) ? null : (
    <>
      <div className="m-grid-row row-space">
        <div className="m-grid-row-items">
          <div className="alignment-all-content">
            <div>
              <input
                type="checkbox"
                name={rep?.serviceName} 
                onChange={checkBoxHandler}
                // checked={memberShipchecked ? true : false}
                checked={selectAllServices.includes(rep?.serviceName)}
                value={selectAllServices.includes(rep?.serviceName) ? 1 : 0}
              />
            </div>
            <div>
              <h5>{rep?.serviceName}</h5>
            </div>
          </div>
        </div>
        <div className="m-grid-row-items">
          <div className="m-sub-grid-row">
            <div className="m-sub-grid-row-items">
              <span>{SettingInfo?.currentType} {rep?.amount}</span>
            </div>
            <div className="m-sub-grid-row-items">
              {/* {rep?._id === falseCheckboxData?.map((item) => item._id)[0] ? ( */}
              {!selectAllServices.includes(rep?.serviceName) ? (
                <input
                  type="number"
                  placeholder="in %"
                  disabled
                  value={serviceDiscount1}
                />
              ) : (serviceDiscountRs === 0 ? <input
                type="number"
                onChange={(e) => disCountChangeHandler(e.target.value)}
                placeholder="in %"
                onWheel={() => document.activeElement.blur()}
                onKeyPress={bindInput}
                maxLength={3}
              /> :
                <input
                  type="number"
                  value={serviceDiscount}
                  onChange={(e) => disCountChangeHandler(e.target.value)}
                  placeholder="in %"
                  onWheel={() => document.activeElement.blur()}
                  onKeyPress={bindInput}
                maxLength={3}

                />
              )}
            </div>
            <div className="m-sub-grid-row-items">
            {!selectAllServices.includes(rep?.serviceName) ? (
                <input
                  type="number"
                  placeholder={"in " + SettingInfo?.currentType}
                  disabled
                  value={serviceDiscountRss}
                />
              ) : (serviceDiscount === 0 ? <input
                type="number"
                // value={serviceDiscountRs}
                onChange={(e) => disCountRsChangeHandler(e.target.value)}
                placeholder={"in " + SettingInfo?.currentType}
                onWheel={() => document.activeElement.blur()}
                onKeyPress={bindInput}
              /> :
                <input
                  type="number"
                  value={serviceDiscountRs}
                  onChange={(e) => disCountRsChangeHandler(e.target.value)}
                  placeholder={"in " + SettingInfo?.currentType}
                  onWheel={() => document.activeElement.blur()}
                  onKeyPress={bindInput}
                />
              )}
            </div>
            <div className="m-sub-grid-row-items">
            {!selectAllServices.includes(rep?.serviceName) ? (
                <input type="number" value={memberShipPrice} disabled />
              ) : (
                <input
                  type="number"
                  value={memberShipPrice}
                  onChange={memberShipPriceChangeHandler}
                  onWheel={() => document.activeElement.blur()}
                  onKeyPress={bindInput}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipServicesBlock;
