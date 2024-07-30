import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'


import {
  getOnboardingTourProgress,
  setOnboardingCurrentTooltip,
  setOnboardingTooltipStatus,
  setOnboardingTourProgress,
  setOnboardingTourStatus,
} from "../../../redux/actions/onboardingActions";
import "./BarberaTasklist.scss";
import taskCheckedBig from "../../../assets/svg/taskCheckedBig.svg";
import Auth from "../../../helpers/Auth";
import { ApiGet } from "../../../helpers/API/ApiData";

export default function BarberaTasklist(props) {
  const dispatch = useDispatch();
  const userInfo = Auth.getUserDetail();

  const getSettings = () => {
    ApiGet("setting/company/" + userInfo.companyId)
      .then((res) => {
        dispatch(
          // setOnboardingTourProgress(33) // for checking business profile tour
          // setOnboardingTourProgress(66) // for checking invoice tour
          setOnboardingTourProgress(res?.data?.data[0]?.onboardProcess[0].onboardingTourProgress)
        );
      })
      .catch((err) => console.log(err));
  };

  const storeOnboardingStatus = useSelector((state) => state.onboardingStatusRed);
  const storeOnboardingTourProgress = useSelector((state) => state.onboardingTourProgressRed);
  const storeOnboardingTourStatus = useSelector((state) => state.onboardingTourStatusRed);
  const storeOnboardingTooltipStatus = useSelector((state) => state.onboardingTooltipStatusRed);
  const storeOnboardingCurrentTooltip = useSelector((state) => state.onboardingCurrentTooltipRed);

  const startTour = (currentTooltip) => {
    dispatch(setOnboardingTourStatus(true));
    dispatch(setOnboardingTooltipStatus(true));
    dispatch(setOnboardingCurrentTooltip(currentTooltip));
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6  }}
      className="content"
      id="main-contain"
      style={{
        pointerEvents:
          (storeOnboardingCurrentTooltip === "I1" || storeOnboardingCurrentTooltip === "I2") &&
          "none",
      }}
    >
      <div className="container-fluid container-left-right-space">
        <div className="barbera-tasklist-title">
          <h1>Welcome to Barbera!</h1>
        </div>
        {/* setting Invoice tooltip */}
        {storeOnboardingTourStatus &&
          storeOnboardingTooltipStatus &&
          storeOnboardingCurrentTooltip === "I1" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7  }}
            
            className="setting-profile-tooltip tooltip-I1" style={{ pointerEvents: "all" }}>
              <div className="setup-profile-tooltip-design">
                <h3>Business profile</h3>
                <p>
                  Enter necessary details. This data will show to customer’s profile so seriously
                  fill it up, dont joke around You can always change it later in the settings
                </p>
                <div className="button-alignment">
                  <div>
                    <Link to="/barberatasklist">
                      <span
                        onClick={(e) => {
                          dispatch(setOnboardingTourStatus(false));
                          dispatch(setOnboardingTooltipStatus(false));
                          dispatch(setOnboardingCurrentTooltip(""));
                        }}
                      >
                        Close Tour
                      </span>
                    </Link>
                  </div>
                  <div>
                    <Link to="/">
                      <button
                        onClick={(e) => {
                          dispatch(setOnboardingTooltipStatus(false));
                          dispatch(setOnboardingCurrentTooltip("I2"));
                          setTimeout(() => {
                            dispatch(setOnboardingTooltipStatus(true));
                          }, 250);
                        }}
                      >
                        Got it
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="tooltip-dot-design">
                  <div className="zoom-dot" />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </motion.div>
          )}
        {/* setting Invoice tooltip */}
        <div className="task-list-box-center-alignment">
          <div className="task-list-box">
            <div className="task-list-box-header">
              <div>
                <h2>Your tasklist</h2>
              </div>
              <div className="progress-align">
                <div className="cus-progress">
                  <div
                    className="progress-flow"
                    style={{ width: `${storeOnboardingTourProgress}%` }}
                  ></div>
                </div>
                <div className="cus-details">
                  <span>Progress</span>
                  <h3>{storeOnboardingTourProgress}%</h3>
                </div>
              </div>
            </div>
            <div className="task-list-body">
              <div className="task-timeline-border">
                <div className="tasklist-time-line">
                  <div className="tasklist-time-line-items">
                    <img src={taskCheckedBig} alt="taskCheckedBig" />
                    {/* <div className="timeline-design">
                      <span>1</span>
                    </div> */}
                  </div>
                  <div className="tasklist-time-line-items">
                    <h2>Sign in and setup account</h2>
                    <p>Enter details, verify mobile number and other details</p>
                  </div>
                </div>
              </div>
              <div className="task-timeline-border">
                <div className="tasklist-time-line tasklist-time-line-bottom">
                  <div className="tasklist-time-line-items">
                    {storeOnboardingTourProgress >= 66 ? (
                      <img src={taskCheckedBig} alt="taskCheckedBig" />
                    ) : (
                      <div className="timeline-design">
                        <span>2</span>
                      </div>
                    )}
                  </div>
                  <div className="tasklist-time-line-items">
                    <div className="start-timeline-button-align">
                      <div>
                        <h2>Setup your business profile</h2>
                        <p>Setup salon details, working days and hours</p>
                      </div>
                      {storeOnboardingTourProgress < 66 && (
                        <div>
                          <Link to="/setting">
                            {storeOnboardingTourProgress === 50 ? (
                              <button onClick={(e) => startTour("B2")}>Continue</button>
                            ) : (
                              <button onClick={(e) => startTour("B1")}>Start</button>
                            )}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="step-alignment-all">
                  <div className="radio-label-alignment">
                    <div>
                      {storeOnboardingTourProgress >= 50 ? (
                        <img src={taskCheckedBig} alt="taskCheckedBig" height="18px" width="18px" />
                      ) : (
                        <input type="radio" style={{ cursor: "default", pointerEvents: "none" }} />
                      )}
                    </div>
                    <div>
                      <span>
                        {storeOnboardingTourProgress >= 50 ? (
                          <strike style={{ opacity: "50%" }}>Setup business profile</strike>
                        ) : (
                          "Setup business profile"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="radio-label-alignment">
                    <div>
                      {storeOnboardingTourProgress >= 66 ? (
                        <img src={taskCheckedBig} alt="taskCheckedBig" height="18px" width="18px" />
                      ) : (
                        <input type="radio" style={{ cursor: "default", pointerEvents: "none" }} />
                      )}
                    </div>
                    <div>
                      <span>
                        {storeOnboardingTourProgress >= 66 ? (
                          <strike style={{ opacity: "50%" }}>Setup working hours</strike>
                        ) : (
                          "Setup working hours"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="task-timeline-border">
                <div className="tasklist-time-line tasklist-time-line-bottom">
                  <div className="tasklist-time-line-items">
                    {storeOnboardingTourProgress === 100 ? (
                      <img src={taskCheckedBig} alt="taskCheckedBig" />
                    ) : (
                      <div className="timeline-design">
                        <span>3</span>
                      </div>
                    )}
                  </div>
                  <div className="tasklist-time-line-items">
                    <div className="start-timeline-button-align">
                      <div>
                        <h2>Generate an invoice</h2>
                        <p>Setup salon details, working days and hours</p>
                      </div>
                      {(storeOnboardingTourProgress === 66 ||
                        storeOnboardingTourProgress === 83) && (
                        <div>
                          {storeOnboardingTourProgress === 66 ? (
                            <button onClick={(e) => startTour("I1")}>Start</button>
                          ) : (
                            <Link to="/">
                              <button onClick={(e) => startTour("getSMS")}>Continue</button>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="step-alignment-all">
                  <div className="radio-label-alignment">
                    <div>
                      {storeOnboardingTourProgress >= 83 ? (
                        <img src={taskCheckedBig} alt="taskCheckedBig" height="18px" width="18px" />
                      ) : (
                        <input type="radio" style={{ cursor: "default", pointerEvents: "none" }} />
                      )}
                    </div>
                    <div>
                      <span>
                        {storeOnboardingTourProgress >= 83 ? (
                          <strike style={{ opacity: "50%" }}>
                            Learn about generating an invoice
                          </strike>
                        ) : (
                          "Learn about generating an invoice"
                        )}
                      </span>
                    </div>
                  </div>
                  {/* <div className="radio-label-alignment">
                    <div>
                      <input type="radio" />
                    </div>
                    <div>
                      <span>Learn about generating an invoice</span>
                    </div>
                  </div> */}
                  <div className="radio-label-alignment">
                    <div>
                      {storeOnboardingTourProgress === 100 ? (
                        <img src={taskCheckedBig} alt="taskCheckedBig" height="18px" width="18px" />
                      ) : (
                        <input type="radio" style={{ cursor: "default", pointerEvents: "none" }} />
                      )}
                    </div>
                    <div>
                      <span>
                        {storeOnboardingTourProgress === 100 ? (
                          <strike style={{ opacity: "50%" }}>Get the invoice SMS</strike>
                        ) : (
                          "Get the invoice SMS"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
