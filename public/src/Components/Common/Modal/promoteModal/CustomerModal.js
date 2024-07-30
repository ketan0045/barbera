import React from "react";
import "./promotemodal.scss";
import RightIcon from "../../../../assets/svg/group-right.svg";
import CloseIcon from "../../../../assets/svg/new-close.svg";
import SearchIcon from "../../../../assets/svg/new-search-icon.svg";
import StarIcon from "../../../../assets/svg/rating-star.svg";
import CheckedIcon from "../../../../assets/svg/Checked.svg";
import { useDispatch } from "react-redux";
import { setVisuals } from "../../../../redux/actions/promoteActions";
export default function CustomerModal() {
  const dispatch = useDispatch();
  return (
    <>
      <div className="add-service-mini-modal">
        <div className="customer-details-modal-box-design">
          <div className="select-customers-header-design">
            <div>
              <img src={CloseIcon} alt="CloseIcon" />
            </div>
            <h1>Select customers</h1>
          </div>
          <div className="customer-details-body-modal-alignment">
            <div className="customer-details-search">
              <div className="relative-div-align">
                <input type="text" placeholder="Search customers" />
                <div className="search-icon-alignment">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div>
              </div>
            </div>
            <div className="first-section-alignment">
              <p>400 customers</p>
              <span>Clear selection</span>
            </div>
            <div className="customer-details-all-box-alignment">
              <div className="customer-details-child-box-height">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => {
                  return (
                    <div className="cus-grid">
                      <div className="cus-grid-items">
                        <div className="profile-grid">
                          <div className="profile-grid-items">
                            <div className="profile-dummy-alignment">
                              <img src={StarIcon} alt="StarIcon" />
                            </div>
                          </div>
                          <div className="profile-grid-items">
                            <p>John Doe</p>
                            <span>+91 99999 99999</span>
                          </div>
                        </div>
                      </div>
                      <div className="cus-grid-items">
                        <p>Last transaction date</p>
                        <p>25 Apr ‘22</p>
                      </div>
                      <div className="cus-grid-items">
                        <img src={CheckedIcon} alt="CheckedIcon" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="customer-details-footer-alignment">
              <div>
                <span>400 customers selected</span>
              </div>
              <div>
                <button>Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
