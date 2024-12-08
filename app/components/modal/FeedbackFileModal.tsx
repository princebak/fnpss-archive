"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import FeedbackFileForm from "./forms/FeedbackFileForm";
import NotificationCirle from "../NotificationCirle";
import { findById, getFileMetadata } from "@/services/MyFileService";

const FeedbackFileModal = ({ id, refreshData }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [ownerName, setOwnerName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [sharedDate, setSharedDate] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [sharingReason, setSharingReason] = useState("")

  const toggleModal = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const updateTotalElements = async () => {
      const theFile = await findById(id);
      const sharing = theFile.sharing;
      if (sharing) {
        setShouldUpdate(true);
        setSharingReason(sharing.sharingReason)
      }
      setTotalElements(theFile.feedbacks.length);
    };

    updateTotalElements();

    const getTheFileOwner = async () => {
      const fileMetadata = await getFileMetadata(id);
      setOwnerName(fileMetadata?.ownerName);
      setCreatedDate(fileMetadata?.createdDate);
      setSharedDate(fileMetadata?.sharedDate);
    };

    getTheFileOwner();
  }, []);

  if (!shouldUpdate) {
    return null;
  } else {
    return (
      <>
        <div
          className="d-flex"
          title="feedback"
          onClick={toggleModal}
          style={{ cursor: "pointer" }}
        >
          <Image
            width={24}
            height={24}
            src={"/images/feedback.png"}
            alt="feedback"
            id={id}
          />
          <NotificationCirle
            sectionId={"Urgents"}
            totalElements={totalElements}
          />
        </div>

        {isOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
                style={{ boxShadow: "0 0 40px gray" }}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="d-flex justify-content-between">
                    <span></span>
                    <span
                      style={{
                        backgroundColor: "#eee",
                        borderRadius: "10px 10px 0 0",
                        padding: "5px",
                      }}
                    >
                      {ownerName}
                    </span>
                  </div>
                  <FeedbackFileForm
                    id={id}
                    refreshData={refreshData}
                    closeModal={() => setIsOpen(false)}
                    createdDate={createdDate}
                    sharedDate={sharedDate}
                    sharingReason={sharingReason}
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 d-flex justify-content-end ">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={toggleModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default FeedbackFileModal;
