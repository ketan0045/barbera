import React, { useEffect, useState } from "react";
import CloseIcon from "../../../../../assets/svg/close-icon.svg";

export default function AvailServiceModal(props) {
  const { setOpenAvailService, availServiceData ,availServiceDataList} = props;
  const [search,setSearch]=useState()
  const [availService,setAvailService]=useState([])

  useEffect(()=>{
    setAvailService(availServiceData)

  },[])

  const searchAvailService=(e)=>{
    setSearch(e.target.value)
    let filterData=availServiceDataList.filter((rep) =>
          (rep.categoryValue?.toLowerCase().includes(e.target.value?.toLowerCase())
          ||
          (rep.servicename.toLowerCase().includes(e.target.value.toLowerCase()))
          )
        );

        var _ = require("lodash");
        let response = _.groupBy(filterData, "servicename");
        let item1 = Object.entries(response);
        setAvailService(item1)
  }

  return (
    <div>
      <div className="cus-modal-new-design">
        <div className="cus-modal-statment-modal">
          <div className="cus-modal-statemtn-design">
            <div className="generated-header">
              <div
                className="close-icon-cus"
                onClick={() => setOpenAvailService(false)}
              >
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h1>Services availed</h1>
            </div>
            <div className="search-select-menus  ml-6  mt-6 mr-6">
              <div
                className="searchbar-wrapper cursor-pointer"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.95833 10.2917C8.35157 10.2917 10.2917 8.35157 10.2917 5.95833C10.2917 3.5651 8.35157 1.625 5.95833 1.625C3.5651 1.625 1.625 3.5651 1.625 5.95833C1.625 8.35157 3.5651 10.2917 5.95833 10.2917Z"
                    stroke="#97A7C3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.375 11.375L9.0188 9.01874"
                    stroke="#97A7C3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <input
                  className="cursor-text"
                  value={search}
                  onChange={(e) => searchAvailService(e)}
                  type="search"
                  placeholder="Search category or services"
                />
              </div>
            </div>
            <div className="generated-invoice-modal-body generated-invoice-modal-body-alignment-box">
              <div className="generated-invoice-table3 table-left-right-alignment">
                <table>
                  <tr>
                    <th align="left">Category</th>
                    <th align="left ">Service </th>
                    <th align="right">No. of times</th>
                  </tr>
                  {availService?.length > 0 &&
                    availService.map((invoice) => {
                 
                      return (
                        <tr>
                          <td>{invoice[1][0].categoryValue}</td>

                          <td>{invoice[0]}</td>

                          <td align="center">{invoice[1]?.length}</td>
                        </tr>
                      );
                    })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
