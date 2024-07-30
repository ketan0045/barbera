import React from "react";

function index(props) {
  // console.log("payment props", props);
  const { price, logo, user,upgradePlan } = props;

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(e) {
    e.preventDefault();
   
    if (user) {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      // const ids = localStorage.getItem("userId");
      // const id = ids?.split('"').join("");
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }
      const options = {
        key: "rzp_test_x26TDJSiei1WOk",
        amount: price * 100,
        currency: "INR",
        name: "Barbera",
        description: "Payment for easy upgrade",
        image: logo || "",
        notify: {
          sms: true,
          email: true,
        },
        prefill: {
          name: user?.name,
          contact: user?.mobileNumber,
          email: user?.email,
        },
        handler: async function (response) {
          if(response?.razorpay_payment_id){
            upgradePlan(response?.razorpay_payment_id)
          }
        },
        theme: {
          color: "#1479FF",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        alert(response.error.reason);
      });
      paymentObject.open();
    }
  }

  return <button onClick={(e) => displayRazorpay(e)}>Make Payment</button>;
}

export default index;
