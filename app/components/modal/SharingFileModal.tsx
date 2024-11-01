"use client";

import React, { useState } from "react";
import Image from "next/image";
import SharingFileForm from "./forms/SharingFileForm";

const SharingFileModal = ({ id, refreshData }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Image
        width={32}
        height={32}
        src={"/images/sharing.png"}
        alt="sharing"
        id={id}
        onClick={toggleModal}
        style={{ cursor: "pointer" }}
      />

      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
              style={{ boxShadow: "0 0 40px gray" }}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <SharingFileForm
                  id={id}
                  refreshData={refreshData}
                  closeModal={() => setIsOpen(false)}
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
};

export default SharingFileModal;
