import React from "react";
import DropDownIcon from "../../../assets/svg/drop-down.svg";
import OutsideAlerter from "../../Common/OutsideAlerter";

export default function MembershipSetting(props) {
  const {
    benefitDropdown,
    setBenefitDropdown,
    applyBenefitDropdown,
    setApplyBenefitDropdown,
    enableMembership,
    handleOnClick,
    handleOnToggle,
    membershipBenefit,
    applyMembershipBenefitFrom,
    membershipToggle,
    permission,
  } = props;

  return (
    <div>
      <div className="" style={{ paddingLeft: "25px", paddingRight: "25px" }}>
        <div className="">
          <div className="enable-inventroy-text-alignment">
            <p>Enable Membership</p>
            <label class="switch">
              <input
                type="checkbox"
                checked={membershipToggle}
                onChange={(e) => handleOnToggle(e, "membership")}
                // disabled={permission?.filter(
                //   (obj) => obj.name === "Settings functions edit"
                // )[0]?.isChecked === false ? true : false}
              />
              <span class="slider round"></span>
            </label>
          </div>
          {enableMembership && (
            <>
              <div className="product-type-menu-alignment">
                <p>Benefits</p>
                <div className="relative">
                  <OutsideAlerter setBenefitDropdown={setBenefitDropdown}>
                    <button
                      onClick={() => setBenefitDropdown(!benefitDropdown)}
                      // disabled={permission?.filter(
                      //   (obj) => obj.name === "Settings functions edit"
                      // )[0]?.isChecked === false ? true : false}
                    >
                      {membershipBenefit || "Free & Discounted services"}
                      <img src={DropDownIcon} alt="DropDownIcon" />
                    </button>
                  </OutsideAlerter>
                  <div
                    className={
                      benefitDropdown
                        ? "retail-menu-design retail-menu-open"
                        : "retail-menu-design retail-menu-close"
                    }
                  >
                    <div className="retails-dropdown-box">
                      <ul onClick={(e) => handleOnClick(e, "benefit")}>
                        <li title="Free services">Free services</li>
                        <li title="Discounted services">Discounted services</li>
                        <li title="Free & Discounted services">
                          Free & Discounted services
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="enable-inventroy-text-alignment product-type-menu-alignment">
                <p style={{ fontWeight: "500" }}>Apply benefits</p>
                <div className="relative">
                  <OutsideAlerter
                    setApplyBenefitDropdown={setApplyBenefitDropdown}
                  >
                    <button
                      onClick={() =>
                        setApplyBenefitDropdown(!applyBenefitDropdown)
                      }
                      //   disabled={permission?.filter(
                      //   (obj) => obj.name === "Settings functions edit"
                      // )[0]?.isChecked === false ? true : false}
                    >
                      {applyMembershipBenefitFrom || "Same invoice"}
                      <img src={DropDownIcon} alt="DropDownIcon" />
                    </button>
                  </OutsideAlerter>
                  <div
                    className={
                      applyBenefitDropdown
                        ? "retail-menu-design retail-menu-open"
                        : "retail-menu-design retail-menu-close"
                    }
                  >
                    <div className="retails-dropdown-box">
                      <ul onClick={(e) => handleOnClick(e, "applyBenefit")}>
                        <li title="Same invoice">Same invoice</li>
                        <li title="Next invoice">Next invoice</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
