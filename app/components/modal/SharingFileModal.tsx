"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SharingFileForm from "./forms/SharingFileForm";
import { getFileMetadata, unshareAFile } from "@/services/MyFileService";

const SharingFileModal = ({ id, refreshData, sectionId }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [sharedDate, setSharedDate] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const toggleModal = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleFileUnshare = async(e:any, fileId:string)=>{
    await unshareAFile(fileId)
    setIsOpen(false)
    refreshData()
  }

  useEffect(() => {
    if (sectionId != "Received") {
      setShouldUpdate(true);
    }
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
        <Image
          width={32}
          height={32}
          src={"/images/sharing.png"}
          alt="partage"
          id={id}
          onClick={toggleModal}
          style={{ cursor: "pointer" }}
          title="partager"
        />

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
                  <SharingFileForm
                    id={id}
                    refreshData={refreshData}
                    closeModal={() => setIsOpen(false)}
                    createdDate={createdDate}
                    sharedDate={sharedDate}
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 d-flex justify-content-between ">
                  <span>
                  {
                    sharedDate ? (
                      <button
                    type="button"
                    className="btn btn-warning"
                    onClick={(e)=>handleFileUnshare(e, id)}
                  >
                    {"Annuler le partage"}
                  </button>
                    ) : ""
                  }
                  </span>
                  
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={toggleModal}
                  >
                    {"Fermer"}
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

export default SharingFileModal;
