import React, { useEffect, useState } from "react";

const MembershipServicesBlock = (props) => {
  const {
    selectAllServices,
    flag,
    change,
    setSelectAllServices,
    temSelMembershipData,
    setTemSelMembershipData,
    // newTemSelMembershipData,
    // setNewTemSelMembershipData,
    temAllServiceNames,
    editMembership,
    cleanRepeatObject,
    setCleanRepeatObject,
    SettingInfo
  } = props;

  const rep = props.blockData;
  let temonedata;

  if (props.temSelMembershipData?.length > 0) {
    let filtereddata = props.temSelMembershipData.filter((onedata) => {
      return onedata._id === props.blockData._id;
    });
    temonedata = filtereddata[0];
    
  } else {
    temonedata = null;
  }

  const [memberShipchecked, setmemberShipchecked] = useState(
    temonedata == null ? false : true
  );

  const checkBoxHandler = (e) => {
    // debugger;

    if (selectAllServices.includes(rep?.serviceName)) {
        setCleanRepeatObject(!cleanRepeatObject);
        setTemSelMembershipData(
          temSelMembershipData.map((service) => {
            if (service.serviceName === rep?.serviceName) {
              return { ...service, isChecked: false };
            } else {
              return service;
            }
          })
        );
  
        // setNewTemSelMembershipData(
        //   newTemSelMembershipData.map((service) => {
        //     if (service.serviceName === rep?.serviceName) {
        //       return { ...service, isChecked: false };
        //     } else {
        //       return service;
        //     }
        //   })
        // );
      } else {
        setTemSelMembershipData(
          temSelMembershipData.map((service) => {
            if (service.serviceName === rep?.serviceName) {
              return { ...service, isChecked: true };
            } else {
              return service;
            }
          })
        );
  
        // setNewTemSelMembershipData(
        //   newTemSelMembershipData.map((service) => {
        //     if (service.serviceName === rep?.serviceName) {
        //       return { ...service, isChecked: true };
        //     } else {
        //       return service;
        //     }
        //   })
        // );
      }


    // if (selectAllServices.includes(rep?.serviceName)) {
    //   setCleanRepeatObject(!cleanRepeatObject);
    //   setTemSelMembershipData(
    //     temSelMembershipData.map((service) => {
    //       if (service.serviceName === rep?.serviceName) {
    //         return { ...service, isChecked: !service.isChecked };
    //       } else {
    //         return service;
    //       }
    //     })
    //   );

    //   setNewTemSelMembershipData(
    //     newTemSelMembershipData.map((service) => {
    //       if (service.serviceName === rep?.serviceName) {
    //         return { ...service, isChecked: !service.isChecked };
    //       } else {
    //         return service;
    //       }
    //     })
    //   );
    // } else {
    //   setCleanRepeatObject(!cleanRepeatObject);
    //   props.setTemSelMembershipData((prev) => [
    //     ...prev,
    //     {
    //       _id: rep._id,
    //       serviceName: rep.serviceName,
    //       amount: rep.amount,
    //       percentageDiscount: 100,
    //       rupeesDiscount: rep.amount,
    //       finalDiscountedAmount: 0,
    //       categoryId: rep.categoryId,
    //       categoryName: rep.categoryName,
    //       colour: rep.colour,
    //       companyId: rep.companyId,
    //       default: rep.default,
    //       duration: rep.duration,
    //       isActive: rep.isActive,
    //       __v: rep.__v,
    //       isChecked: true,
    //     },
    //   ]);
    //   props.setNewTemSelMembershipData((prev) => [
    //     ...prev,
    //     {
    //       _id: rep._id,
    //       serviceName: rep.serviceName,
    //       amount: rep.amount,
    //       percentageDiscount: 100,
    //       rupeesDiscount: rep.amount,
    //       finalDiscountedAmount: 0,
    //       categoryId: rep.categoryId,
    //       categoryName: rep.categoryName,
    //       colour: rep.colour,
    //       companyId: rep.companyId,
    //       default: rep.default,
    //       duration: rep.duration,
    //       isActive: rep.isActive,
    //       __v: rep.__v,
    //       isChecked: true,
    //     },
    //   ]);
    //   setCleanRepeatObject(!cleanRepeatObject);
    // }


    if (selectAllServices.includes(rep?.serviceName)) {
      let index = selectAllServices.indexOf(e.target.name);
      selectAllServices.splice(index, 1);
    } else {
      selectAllServices.push(e.target.name);
    }
    setSelectAllServices([...selectAllServices]);
    // setCleanRepeatObject(!cleanRepeatObject);
    setmemberShipchecked(!memberShipchecked);
  };


  useEffect(() => {
    if (selectAllServices) {
      setCleanRepeatObject(!cleanRepeatObject);
      if (!flag) {
        props.setTemSelMembershipData((prev) => [
          ...prev,
          {
            _id: rep._id,
            serviceName: rep.serviceName,
            amount: rep.amount,
            percentageDiscount: 100,
            rupeesDiscount: rep.amount,
            finalDiscountedAmount: 0,
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
        // props.setNewTemSelMembershipData((prev) => [
        //   ...prev,
        //   {
        //     _id: rep._id,
        //     serviceName: rep.serviceName,
        //     amount: rep.amount,
        //     percentageDiscount: 100,
        //     rupeesDiscount: rep.amount,
        //     finalDiscountedAmount: 0,
        //     categoryId: rep.categoryId,
        //     categoryName: rep.categoryName,
        //     colour: rep.colour,
        //     companyId: rep.companyId,
        //     default: rep.default,
        //     duration: rep.duration,
        //     isActive: rep.isActive,
        //     __v: rep.__v,
        //     isChecked: rep.isChecked === undefined ? true : rep.isChecked,
        //   },
        // ]);
        setmemberShipchecked(true);
      } else if (flag && change) {
        setCleanRepeatObject(!cleanRepeatObject);
        props.setTemSelMembershipData((prev) => [
          ...new Map(prev.map((item) => [JSON.stringify(item), item])).values(),
          {
            _id: rep._id,
            serviceName: rep.serviceName,
            amount: rep.amount,
            percentageDiscount: 100,
            rupeesDiscount: rep.amount,
            finalDiscountedAmount: 0,
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
        // props.setNewTemSelMembershipData((prev) => [
        //   ...new Map(prev.map((item) => [JSON.stringify(item), item])).values(),
        //   {
        //     _id: rep._id,
        //     serviceName: rep.serviceName,
        //     amount: rep.amount,
        //     percentageDiscount: 100,
        //     rupeesDiscount: rep.amount,
        //     finalDiscountedAmount: 0,
        //     categoryId: rep.categoryId,
        //     categoryName: rep.categoryName,
        //     colour: rep.colour,
        //     companyId: rep.companyId,
        //     default: rep.default,
        //     duration: rep.duration,
        //     isActive: rep.isActive,
        //     __v: rep.__v,
        //     isChecked: rep.isChecked === undefined ? true : rep.isChecked,
        //   },
        // ]);
        setmemberShipchecked(true);
      }
    } else {
      props.setTemSelMembershipData((prev) => {
        return prev.filter((onedata) => onedata._id !== rep._id);
      });
      setmemberShipchecked(false);
    }
  }, []);
// console.log("temAllServiceNames",temAllServiceNames)


  return props.hide.includes(rep.categoryName) ? null : (
    <div className="left-right-alignment-tratment">
      <div>
        <input
          type="checkbox"
          name={rep?.serviceName}
          onChange={checkBoxHandler}
          checked={
            // editMembership
            //   ? 
            //   temSelMembershipData.find((service) => {
            //     console.log("service", service)
            //       return (
            //         service.serviceName === rep.serviceName && service.isChecked === true
            //       );
            //     })
            // : 
              selectAllServices.includes(rep?.serviceName)
          }
          value={selectAllServices.includes(rep?.serviceName) ? 1 : 0}
        />
        <p>{rep?.serviceName}</p>
      </div>
      <p>
        <a>{SettingInfo?.currentType}</a> {rep?.amount}
      </p>
    </div>
  );
};

export default MembershipServicesBlock;
