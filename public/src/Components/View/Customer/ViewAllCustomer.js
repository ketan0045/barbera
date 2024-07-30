import React, { useState, useEffect, useRef } from "react";
import { ApiGet, ApiPost } from "../../../helpers/API/ApiData";
import { NavLink } from "react-router-dom";
import { yellow } from "@material-ui/core/colors";
import { CommentAction } from "semantic-ui-react";

function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);
  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );
  useEffect(() => {
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);
  return isIntersecting;
}

export default function ViewAllCustomer(props) {
  const { customers, setSkip, searchState } = props;
  const divRef = useRef();
  const isVisible = useOnScreen(divRef);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && customers?.length > 0 && !searchState) {
      setSkip((currentValue) => currentValue + 30);
    }
  }, [isVisible]);

  const sortCustomers = customers.sort(function (a, b) {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  });

  const renderMobileSidebar = () => {
    let divEle = document.getElementsByClassName("sidebar-banner")[0];
    divEle.classList.toggle("sidebar-display");
  };

  return (
    <div className="lg:w-2/6 pr-4 padding-right-remove">
      <div className="dashboard-box staff-box-height">
        <div class="flex items-center p-4 sticky top-0">
          <form className="w-full">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                <button
                  type="submit"
                  class="p-1 focus:outline-none focus:shadow-outline"
                >
                  <img
                    src={
                      require("./../../../assets/img/SearchIcon.svg").default
                    }
                  />
                </button>
              </span>
              <input
                type="search"
                name="q"
                class="w-full py-2  dark-text-color font-medium pl-10 serchbar-style"
                placeholder="Search name or number"
                onChange={(e) => props.search(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="dashboard-child-box p-3 pt-0 pr-2">
          {loading ? (
            <>
              {/* <Skeleton variant="rect" height={100} style={{ borderRadius: "12px", marginTop: "10px" }} />
                                        <Skeleton variant="rect" height={100} style={{ borderRadius: "12px", marginTop: "10px" }} />
                                        <Skeleton variant="rect" height={100} style={{ borderRadius: "12px", marginTop: "10px" }} />
                                        <Skeleton variant="rect" height={100} style={{ borderRadius: "12px", marginTop: "10px" }} /> */}
            </>
          ) : (
            <>
              {sortCustomers
                ? sortCustomers.map((customer, index) => {
                    return (
                      <>
                        <div key={index} className="mt-2"></div>
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 staff-profile-main cursor-pointer"
                          onClick={() => props.clicked(customer)}
                        >
                          <div className="flex items-center">
                            <div className="staff-profile">
                              {/* <img src={require("./../../../assets/img/staff-profile.svg").default} /> */}
                              <div
                                className="rounded-full flex items-center justify-center"
                                style={{
                                  backgroundColor: "#97A7C3",
                                  height: "50px",
                                  width: "50px",
                                }}
                              >
                                <span className="font-size-h5 font-weight-bold text-white font-size-20">
                                  {customer && customer.firstName
                                    ? customer.firstName[0].toUpperCase()
                                    : "A"}
                                </span>
                              </div>
                            </div>
                            <div className="pl-4">
                              <p className="heading-title-text-color custome-font font-bold tracking-normal">
                                {customer &&
                                  customer.firstName + " " + customer.lastName}
                              </p>
                              <p className="heading-title-text-color custome-font font-medium tracking-normal mb-0">
                                {customer && customer.mobileNumber}
                              </p>
                            </div>
                          </div>
                          {/* <div className="staff-edit-none cursor-pointer">
                                                        <img src={require ("./../../../assets/img/pen.svg").default}/>
                                                    </div> */}
                        </div>
                        <div
                          key={index}
                          className="dashboard-border mt-1"
                        ></div>
                      </>
                    );
                  })
                : ""}
              <div ref={divRef}></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
