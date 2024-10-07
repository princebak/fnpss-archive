"use client";

import React, { useState } from "react";
import CreateFolderForm from "./forms/CreateFolderForm";

const UpdateFolderModal = ({ id, refreshData }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <a
        className="font-size-16 text-muted"
        role="button"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        id={id}
        onClick={toggleModal}
      >
        <i className="mdi mdi-dots-horizontal"></i>
      </a>

      {isOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          onClick={(e) => e.preventDefault()}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
              style={{ boxShadow: "0 0 40px gray" }}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <CreateFolderForm
                  id={id}
                  closeModal={() => setIsOpen(false)}
                  refreshData={refreshData}
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

export default UpdateFolderModal;
