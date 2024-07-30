import React, { useEffect, useRef, useCallback } from "react";

const HandleServiceNavigation = ({ character, focus, index, setFocus,SelectCustomer}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, [focus]);

  const handleSelect = useCallback(() => {
    SelectCustomer(character)
    setFocus(index);
  }, [character, index, setFocus]);

  return (
    <>
    <li
      tabIndex={focus ? 0 : -1}
      role="button"
      ref={ref}
      onClick={handleSelect}
      onKeyPress={handleSelect}
    >
                                    <div className="add-customer-details">
                                         <div className="cus-grid">
                                           <div className="cus-grid-items">
                                             <div className="profile-image">
                                               {" "}
                                               {character.firstName === "" ||
                                              character.firstName === null ||
                                              character.firstName === undefined
                                                ? ""
                                                : character.firstName[0].toUpperCase()}
                                              {character.lastName === "" ||
                                              character.lastName === null ||
                                              character.lastName === undefined
                                                ? ""
                                                : character.lastName[0].toUpperCase()}
                                            </div>
                                          </div>
                                          <div
                                            className="cus-grid-items"
                                          >
                                            <p>
                                              {character.firstName} {character.lastName}
                                            </p>
                                            <span>{character.mobileNumber}</span>
                                          </div>
                                        </div>
                                      </div>
    </li>
    </>
  );
};

export default HandleServiceNavigation;