import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { ApiGet, ApiPut } from "../../../helpers/API/ApiData";
import "./SmsInvoice.scss";

export default function SmsInvoice() {
  const params = useParams();

  const [invoiceData, setInvoiceData] = useState();
  const [saloonData, setSaloonData] = useState();
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState();

  const [load, setLoad] = useState(false);
  let Date = moment(saloonData?.invoiceDate).format("D MMM YY");
  let Time = moment(saloonData?.invoiceDate).format("h:mm A");

  const handleChange = (e) => {
    setComment(e.target.value);
  };
  const handleClick = (e, data) => {
    setStar(data);
  };
  const handleSubmit = async () => {
    const data = {
      feedback: { star: star, comment: comment },
    };
    let res = await ApiPut("invoice/" + params.id, data);
    try {
      if (res.data.status === 200) {
        
        setLoad(true);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  };

  useEffect(async () => {
    let res = await ApiGet("invoice/value/" + params.id);
    try {
      if (res.data.status === 200) {
        setInvoiceData(res.data.data.invoiceAllData?.[0]);
        setSaloonData(res.data.data);
        setComment(res.data.data.invoiceAllData[0].feedback[0].comment);
        setStar(res.data.data.invoiceAllData[0].feedback[0].star);
      } else {
        console.log("in the else");
      }
    } catch (err) {
      console.log("in the catch");
    }
  }, [params, load]);

  return (
    <div>
      <div className="new-sms-invoice-design">
        <div className="page-layout">
          <div className="page-grid">
            <div className="page-grid-items">
              <div className="invoice-box">
                <div className="box-title">
                  <h1>Invoice</h1>
                  {/* <p>25 Mar ‘22 | 12:00 PM</p> */}
                  <p>
                    {Date} | {Time}
                  </p>
                </div>
                <div className="bill-alignment">
                  <div className="all-text-alignment">
                    <span>Bill from</span>
                    <span>Bill to</span>
                  </div>
                  <div className="name-alignment">
                    <div>
                      <p>{saloonData?.saloonname}</p>
                    </div>
                    <div>
                      <p>
                        {invoiceData?.customerData?.firstName}
                        {invoiceData?.customerData?.lastName}
                      </p>
                      <span>+91 {invoiceData?.customerData?.mobileNumber}</span>
                    </div>
                  </div>
                  <div className="number-style">
                    <p>+91 {saloonData?.mobileNumber}</p>
                  </div>
                  <div className="add-style">
                    <p>
                      {saloonData?.address}, {saloonData?.city}
                    </p>
                    <p>GSTIN: {saloonData?.setting[0]?.tax?.gstNumber}</p>
                  </div>
                </div>
                <div className="mobile-view-box-align-shadow">
                  <div className="bill-details">
                    <div className="bill-title">
                      <p>Bill details</p>
                      {invoiceData?.serviceDetails?.length > 0 ? (
                        <h2>Services</h2>
                      ) : null}
                    </div>
                  </div>
                  {invoiceData?.serviceDetails?.length > 0 ? (
                    <div className="show-data">
                      <span>Details</span>
                      <span>Amount</span>
                    </div>
                  ) : null}
                  <div className="show-data-body">
                    {invoiceData?.serviceDetails?.length > 0 && (
                      <>
                        {invoiceData?.serviceDetails.map((res) => {
                          return (
                            <>
                              <div className="body-data">
                                <p>{res?.servicename}</p>
                                <p>
                                  <span className="roboto-style">
                                    {saloonData?.setting[0]?.currentType}
                                  </span>{" "}
                                  {res?.servicerate}
                                </p>
                              </div>
                            </>
                          );
                        })}
                        <div className="dashed-border"></div>
                      </>
                    )}

                    {invoiceData?.products?.length > 0 ? (
                      <>
                        <div className="product-title">
                          <p>Products</p>
                        </div>
                        <div className="product-grid">
                          <div className="product-grid-items">
                            <p>Details</p>
                          </div>
                          <div className="product-grid-items">
                            <p>Qty</p>
                          </div>
                          <div className="product-grid-items">
                            <p>Amount</p>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {invoiceData?.products?.length > 0 && (
                      <>
                        {invoiceData?.products.map((res) => {
                          return (
                            <>
                              <div className="product-child-grid">
                                <div className="product-child-grid-items">
                                  <span>{res?.productName}</span>
                                </div>
                                <div className="product-child-grid-items">
                                  <span>{res?.productCount}</span>
                                </div>
                                <div className="product-child-grid-items">
                                  <span>
                                    <span className="roboto-style">
                                      {saloonData?.setting[0]?.currentType}
                                    </span>{" "}
                                    {res?.productSubTotal}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        })}
                        <div className="dashed-border"></div>
                      </>
                    )}
                    {invoiceData?.membershipDetails?.length > 0 ? (
                      <>
                        <div className="product-title">
                          <p>Membership</p>
                        </div>
                        <div className="product-grid">
                          <div className="product-grid-items">
                            <p>Details</p>
                          </div>
                          <div className="product-grid-items">
                            {/* <p>Qty</p> */}
                          </div>
                          <div className="product-grid-items">
                            <p>Amount</p>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {invoiceData?.membershipDetails?.length > 0 && (
                      <>
                        {invoiceData?.membershipDetails.map((res) => {
                          return (
                            <>
                              <div className="product-child-grid">
                                <div className="product-child-grid-items">
                                  <span>{res?.membershipName}</span>
                                </div>
                                <div className="product-child-grid-items">
                                  {/* <span>{res?.productCount}</span> */}
                                </div>
                                <div className="product-child-grid-items">
                                  <span>
                                    <span className="roboto-style">
                                      {saloonData?.setting[0]?.currentType}
                                    </span>{" "}
                                    {res?.price}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        })}
                        <div className="dashed-border"></div>
                      </>
                    )}
                    <div className="product-last-border"></div>
                    <div className="all-final">
                      <div className="final-total">
                        <p>Subtotal</p>
                        <p>
                          <span className="roboto-style">
                            {saloonData?.setting[0]?.currentType}
                          </span>
                          {saloonData?.grossTotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="final-total">
                        <p>Total discount</p>
                        <p>
                          <a>
                            -{" "}
                            <span className="roboto-style">
                              {saloonData?.setting[0]?.currentType}
                            </span>{" "}
                            {saloonData?.discount.toFixed(2)}
                          </a>
                        </p>
                      </div>
                      {saloonData?.gst ? (
                        <div className="final-total">
                          <p>GST</p>
                          <p>
                            <span className="roboto-style">
                              {saloonData?.setting[0]?.currentType}
                            </span>{" "}
                            {parseFloat(saloonData?.gst, 10)}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="bill-amount">
                      <div>
                        <p>Bill amount</p>
                        <span>payment by {saloonData?.paymentMethod}</span>
                      </div>
                      <h6>
                        <span className="roboto-style">
                          {saloonData?.setting[0]?.currentType}
                        </span>{" "}
                        {parseInt(invoiceData?.totalAmount, 10)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              {invoiceData?.dueAmountRecord ? (
                <div className="heightlight-box-invoice">
                  <p>
                    <span>{saloonData?.setting[0]?.currentType} {invoiceData?.dueAmountRecord }</span> due amount has been recorded to this
                    invoice
                  </p>
                </div>
              ):null}
              {invoiceData?.balanceAmountRecord ? (
                <div className="heightlight-box-invoice-balance">
                  <p>
                    <span>{saloonData?.setting[0]?.currentType} {invoiceData?.balanceAmountRecord}</span> advance amount has been added to your
                    wallet
                  </p>
                </div>
              ):null}
            </div>
            {invoiceData?.feedback?.length <= 0 ? (
              <div className="page-grid-items">
                <div className="rating-box">
                  <div className="child-box-title">
                    <p>Rate your overall visit at </p>
                    <span>{saloonData?.saloonname}</span>
                  </div>

                  {star === 1 ? (
                    <div className="awesome-align">
                      <p>
                        Argghhh!
                        <img src="https://i.ibb.co/X5B7MJy/image-173.png" />
                      </p>
                    </div>
                  ) : star === 2 ? (
                    <div className="awesome-align">
                      <p>
                        Bad
                        <img src="https://i.ibb.co/27WhYCr/image-133-2.png" />
                      </p>
                    </div>
                  ) : star === 3 ? (
                    <div className="awesome-align">
                      <p>
                        It was OK
                        <img src="https://i.ibb.co/cT7qzv3/image-58.png" />
                      </p>
                    </div>
                  ) : star === 4 ? (
                    <div className="awesome-align">
                      <p>
                        Alright, I like it
                        <img src="https://i.ibb.co/2PCyZcg/Smiling-Face-with-Smiling-Eyes.png" />
                      </p>
                    </div>
                  ) : star === 5 ? (
                    <div className="awesome-align">
                      <p>
                        AWESOME!
                        <img src="https://i.ibb.co/5BkvdYQ/image-121.png" />
                      </p>
                    </div>
                  ) : (
                    <div className="awesome-align">
                      <p>Rate below as per your experience</p>
                    </div>
                  )}
                  <div className="rating-alignment">
                    {star === 0 ? (
                      <img
                        src={"https://i.ibb.co/zQgcyFC/Vector-1.png"}
                        onClick={(e) => handleClick(e, 1)}
                      />
                    ) : null}
                    {star >= 1 ? (
                      <img
                        src={" https://i.ibb.co/nfyCrr9/Vector.png"}
                        onClick={(e) => handleClick(e, star == 1 ? 0 : 1)}
                      />
                    ) : null}
                    <img
                      src={
                        star >= 2
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                      onClick={(e) => handleClick(e, star == 2 ? 0 : 2)}
                    />
                    <img
                      src={
                        star >= 3
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                      onClick={(e) => handleClick(e, star == 3 ? 0 : 3)}
                    />
                    <img
                      src={
                        star >= 4
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                      onClick={(e) => handleClick(e, star == 4 ? 0 : 4)}
                    />
                    <img
                      src={
                        star >= 5
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                      onClick={(e) => handleClick(e, star == 5 ? 0 : 5)}
                    />
                  </div>
                  <div className="form-control">
                    <label>We'd like to hear what you have to say</label>
                    <textarea
                      placeholder="Leave a comment "
                      name="comment"
                      value={comment}
                      onChange={(e) => handleChange(e)}
                    ></textarea>
                  </div>
                  <div className="submit-button">
                    {invoiceData?.feedback?.length <= 0 ? (
                      star > 0 ? (
                        <button onClick={(e) => handleSubmit()}>
                          Submit feedback
                        </button>
                      ) : (
                        <button disabled>Submit feedback</button>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="page-grid-items">
                <div className="rating-box">
                  <div className="child-box-title">
                    <p>Rate your overall visit at </p>
                    <span>{saloonData?.saloonname}</span>
                  </div>

                  {star === 1 ? (
                    <div className="awesome-align">
                      <p>
                        Argghhh!
                        <img src="https://i.ibb.co/X5B7MJy/image-173.png" />
                      </p>
                    </div>
                  ) : star === 2 ? (
                    <div className="awesome-align">
                      <p>
                        Bad
                        <img src="https://i.ibb.co/27WhYCr/image-133-2.png" />
                      </p>
                    </div>
                  ) : star === 3 ? (
                    <div className="awesome-align">
                      <p>
                        It was OK
                        <img src="https://i.ibb.co/cT7qzv3/image-58.png" />
                      </p>
                    </div>
                  ) : star === 4 ? (
                    <div className="awesome-align">
                      <p>
                        Alright, I like it
                        <img src="https://i.ibb.co/2PCyZcg/Smiling-Face-with-Smiling-Eyes.png" />
                      </p>
                    </div>
                  ) : star === 5 ? (
                    <div className="awesome-align">
                      <p>
                        AWESOME!
                        <img src="https://i.ibb.co/5BkvdYQ/image-121.png" />
                      </p>
                    </div>
                  ) : (
                    <div className="awesome-align">
                      <p>Rate below as per your experience</p>
                    </div>
                  )}
                  <div className="rating-alignment">
                    {star === 0 ? (
                      <img src={"https://i.ibb.co/zQgcyFC/Vector-1.png"} />
                    ) : null}
                    {star >= 1 ? (
                      <img src={" https://i.ibb.co/nfyCrr9/Vector.png"} />
                    ) : null}
                    <img
                      src={
                        star >= 2
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                    />
                    <img
                      src={
                        star >= 3
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                    />
                    <img
                      src={
                        star >= 4
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                    />
                    <img
                      src={
                        star >= 5
                          ? " https://i.ibb.co/nfyCrr9/Vector.png"
                          : "https://i.ibb.co/zQgcyFC/Vector-1.png"
                      }
                    />
                  </div>
                  {comment?.length > 0 ? (
                    <div className="form-control">
                      <label>We’d like to hear what you have to say</label>
                      <textarea
                        placeholder="Leave a comment "
                        name="comment"
                        value={comment}
                      ></textarea>
                    </div>
                  ) : null}
                  <div className="submit-button">
                    {invoiceData?.feedback?.length <= 0 ? (
                      star > 0 ? (
                        <button>Submit feedback</button>
                      ) : (
                        <button disabled>Submit feedback</button>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
