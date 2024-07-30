import moment from "moment";
import React, { useEffect, useState } from "react";
import CloseIcon from "../../../../../assets/svg/close-icon.svg";
import { ApiPost } from "../../../../../helpers/API/ApiData";
import Auth from "../../../../../helpers/Auth";

export default function MultiOpeningCollection(props) {
  const { setOpenCollection, paymentMethod, temEndDate, startDate } = props;
  const userInfo = Auth.getUserDetail();
  const [allCollectionData, setAllCollectionData] = useState([]);
  const [firstPayload, setFirstPayload] = useState({});
  const [flag, setFlag] = useState(false);
  const [total, setTotal] = useState(0);

  console.log("paymentMethod", paymentMethod);
  console.log("firstPayload", firstPayload);

  const generateData = async () => {
    let CollectionData = await Promise.all(
      paymentMethod?.map(async (pay) => {
        let objectData = {};
        let opeeningBal;
        let openingCR = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          type: "CR",
          typeValue: "opening-balance",
          paymentMethod: await pay,
        };
        let openingCRRes = await ApiPost("expence/company/expenseDetails", openingCR);
        if ((await openingCRRes?.data?.status) === 200) {
          opeeningBal = await openingCRRes?.data?.data?.total;
          if ((await openingCRRes?.data?.data?.value?.length) > 0) {
            let openingDR = {
              startTime: moment(startDate).format("YYYY-MM-DD"),
              endTime: moment(temEndDate).format("YYYY-MM-DD"),
              companyId: userInfo?.companyId,
              type: "DR",
              typeValue: "opening-balance",
              paymentMethod: await pay,
            };

            let openingDRRes = await ApiPost("expence/company/expenseDetails", openingDR);

            if ((await openingDRRes?.data?.status) === 200) {
              Object.assign(objectData, {
                Opening: (await opeeningBal) - (await openingDRRes?.data?.data?.total),
                pay: await pay,
              });
            } else {
              console.log(await openingDRRes?.data?.message);
            }
          }
        } else {
          console.log(await openingCRRes?.data?.message);
        }
        let closingBala = {
          startTime: moment(startDate).format("YYYY-MM-DD"),
          endTime: moment(temEndDate).format("YYYY-MM-DD"),
          companyId: userInfo?.companyId,
          paymentMethod: await pay,
        };
        await ApiPost("expence/daywise/expense", closingBala)
          .then(async (res) => {
            Object.assign(objectData, {
              Closing: (await res.data.data),
            
            });
          })
          .catch((err) => {
            console.log(err);
          });

          let datas = {
            startTime: moment(startDate).format("YYYY-MM-DD"),
            endTime: moment(temEndDate).format("YYYY-MM-DD"),
            companyId: userInfo?.companyId,
            type: "DR",
            typeValue: "expence",
            paymentMethod: await pay,
          };
      
          await ApiPost("expence/company/expenseDetails", datas)
            .then(async (res) => {
              Object.assign(objectData, {
                Expense: (await res.data.data.total),
              
              });
            
            })
            .catch((err) => {
              console.log(err);
            });

            let datasss = {
              startTime: moment(startDate).format("YYYY-MM-DD"),
              endTime: moment(temEndDate).format("YYYY-MM-DD"),
              companyId: userInfo?.companyId,
              type: "DR",
              typeValue: "staff",
              paymentMethod: await pay,
            };
        
            await ApiPost("expence/company/expenseDetails", datasss)
              .then(async (res) => {
                Object.assign(objectData, {
                  Staff: (await res.data.data.total),
                
                });
              
              })
              .catch((err) => {
                console.log(err);
              });

              let datassss = {
                startTime: moment(startDate).format("YYYY-MM-DD"),
                endTime: moment(temEndDate).format("YYYY-MM-DD"),
                companyId: userInfo?.companyId,
                type: "CR",
                typeValue: "deposit",
                paymentMethod: await pay,
              };
          
              await ApiPost("expence/company/expenseDetails", datassss)
                .then(async (res) => {
                  Object.assign(objectData, {
                    Reccive: (await res.data.data.total),
                  
                  });
                  
                })
                .catch((err) => {
                  console.log(err);
                });

                let dat = {
                  startTime: moment(startDate).format("YYYY-MM-DD"),
                  endTime: moment(temEndDate).format("YYYY-MM-DD"),
                  companyId: userInfo?.companyId,
                  type: "DR",
                  typeValue: "transfer",
                  paymentMethod: await pay,
                };
            
                await ApiPost("expence/company/expenseDetails", dat)
                  .then(async (res) => {
                    Object.assign(objectData, {
                      Transfer: (await res.data.data.total),
                    
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
        return objectData;
      })
    );
    setAllCollectionData(CollectionData);
    return CollectionData;
  };

  useEffect(async () => {
    await generateData();
  }, []);

  console.log("allCollectionData", allCollectionData);
  return (
    <div>
      <div className="cus-modal-new-design">
        <div className="cus-modal-statment-modal">
          <div className="cus-modal-statemtn-design" style={{ width: "940px" }}>
            <div className="generated-header">
              <div className="close-icon-cus" onClick={() => setOpenCollection(false)}>
                <img src={CloseIcon} alt="CloseIcon" />
              </div>
              <h1>Collection</h1>
            </div>
            <div className="generated-invoice-modal-body generated-invoice-modal-body-alignment-box">
              <div className="generated-invoice-table5 table-left-right-alignment">
                <table>
                  <tr>
                    <th align="left">Payment method</th>
                    <th align="center">Opening collection </th>
                    <th align="center">Closing collection </th>
                    <th align="center">Expense </th>
                    <th align="center">Staff pay </th>
                    <th align="center">Receive (owner) </th>
                    <th align="center">Transfer (owner)</th>
                  </tr>
                  {allCollectionData?.map((data) => {
                    console.log("data", data.Opening);
                    return (
                      <>
                        <tr>
                          <td>{data?.pay}</td>

                          <td style={{display:"flex",justifyContent:"flex-start",paddingLeft:"40px"}} align="center">{data?.Opening}</td>
                          <td  style={{justifyContent:"flex-start",paddingLeft:"40px"}}  align="left">{data?.Closing}</td>
                          <td  style={{justifyContent:"flex-start",paddingLeft:"40px"}}  align="left">{data?.Expense}</td>
                          <td  style={{justifyContent:"flex-start",paddingLeft:"40px"}}  align="left">{data?.Staff}</td>
                          <td  style={{justifyContent:"flex-start",paddingLeft:"40px"}}  align="left">{data?.Reccive}</td>
                          <td  style={{justifyContent:"flex-start",paddingLeft:"40px"}}  align="left">{data?.Transfer}</td>
                        </tr>
                      </>
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
