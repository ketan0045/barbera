import React, { useState, useEffect } from "react";
import { ApiGet, ApiPost, ApiPut } from "../../../helpers/API/ApiData";
import { useFormik } from "formik";
import "./../../style/tailwind.css";
import "./stayle.css";

import Auth from "../../../helpers/Auth";
import GoogleContacts from "react-google-contacts";
import FileUpload from "../../../../src/assets/img/file-upload.png";
import { DropzoneComponent } from "react-dropzone-component";
import "../../../Components/style/filepicker.css";
import "../../../Components/style/dropzone.min.css";
import { toast } from 'react-toastify';


export default function CreateCustomer(props) {
  const userInfo = Auth.getUserDetail();
  const [files, setFiles] = useState();
  const [notification, setNotification] = useState();
  const { isOpen, toggle } = props;
  const componentConfig = {
    iconFiletypes: [".xlsx", ".xls", ".csv"],
    showFiletypeIcon: true,
    postUrl: { postUrl: "no-url" },
  };
  const eventHandlers = {
    addedfile: (file) => {
      file.previewElement.querySelector(".dz-progress").style.display = "none";
      file.previewElement.querySelector(".dz-success-mark").style.opacity = 1;
      setFiles(file);
    },
  };
  const djsConfig = {
    addRemoveLinks: true,
    params: {
      myParameter: "I'm a parameter!",
    },
    autoProcessQueue: false,
    acceptedFiles: ".xlsx, .xlss, .csv"
  };

  const data = JSON.parse(localStorage.getItem("userinfo"));
  const handleSubmit = () => {
    let formData = new FormData();
    formData.append("file", files);
    ApiPost(`category/importExcel/category/${data.companyId}`, formData)
      .then((resp) => {
        if (resp.data.status === 200) {
          toggle();
          setNotification(toast.success("Added Successfully", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme:"colored"
            }))
      
        } else {
          setNotification(toast.warn(resp.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme:"colored"}))
    
        }
      })

      .catch((er) => {
        setNotification( toast.error("Please Upload File", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme:"colored"
          }))
       
   
      });
  };

  return (
    <>
      <div>
        {isOpen ? (
          <>
            <div className="animation justify-center items-center flex overflow-x-hidden overflow-y-auto  fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative my-6 mx-auto 2xl:w-9/12 xl:w-4/6 lg:5/6">
                <div className="rounded-lg shadow-lg relative staff-add-banner flex flex-col outline-none focus:outline-none">
                  <div className="modal-padding">
                    <div className="upload-file-text">
                      <h2>Upload a file</h2>
                      <p>
                        You can upload your excel sheet to import your services
                      </p>
                      <div className="drop-browse-box">
                        <DropzoneComponent
                          init={() => {
                            console.log("init called");
                          }}
                          config={componentConfig}
                          eventHandlers={eventHandlers}
                          djsConfig={djsConfig}
                        />
                       
                      </div>
                      <div className="modal-child-text">
                        <p>
                          Download a sample excel sheet that you can populate
                          with your data
                          <br />
                          Click <a href='/files/category.xlsx' download><b> here</b> </a> to download
                        </p>
                      </div>
                      <div className="modal-footer">
                        <div className="button-alignment">
                          <button
                            className="cancel-button-style"
                            onClick={() => {
                              toggle();
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            onClick={handleSubmit}
                            className="mr-remove cus-medium-btn 
                              font-size-16 font-medium 
                              tracking-normal white-text-color
                              tracking-normal cursor-pointer"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  );
}
