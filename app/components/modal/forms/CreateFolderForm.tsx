"use client";

import {
  findById,
  getFolders,
  saveFileInfo,
  updateFileInfo,
} from "@/services/MyFileService";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormSelect from "../../form/elements/FormSelect";

const CreateFolderForm = ({
  id,
  closeModal,
  userFolderId,
  refreshData,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { currentUser } = useSelector((state: any) => state.user);

  const [name, setName] = useState("");
  const [parentFolder, setParentFolder] = useState("");
  const [folders, setFolders] = useState<Array<IMyFile>>();

  const closeModalAndReload = () => {
    closeModal();
    refreshData();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (!id) {
      // Create a new Folder
      const res = await saveFileInfo({
        name,
        parentFolder: parentFolder,
        owner: currentUser._id,
        isFolder: true,
      });
      if (res.error) {
        setMessage("Bad request.");
      } else {
        setMessage("Folder uploaded successfully !");
        closeModalAndReload();
      }
    } else {
      // Update the Folder

      const res = await updateFileInfo({
        _id: id,
        name,
        parentFolder: parentFolder,
      });

      if (res.error) {
        setMessage("Bad request.");
      } else {
        setMessage("Folder updated with success !!");
        closeModalAndReload();
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const loadFileInfo = async () => {
      if (id) {
        const fileInfo = await findById(id);
        if (fileInfo) {
          setName(fileInfo.name);
          setParentFolder(fileInfo.parentFolder);
        }
      }
      const myFolders = await getFolders(currentUser._id);
      setFolders(myFolders);
    };
    loadFileInfo();
  }, []);

  return (
    <form>
      {message ? <label>{message}</label> : ""}

      <div
        className="bd-example d-flex flex-column gap-2"
        style={{ border: "solid 1px #ddd", borderRadius: "5px" }}
      >
        <div
          className="d-flex justify-between p-2"
          style={{ borderBottom: "solid 1px #ddd" }}
        >
          <label style={{ color: "black" }}>Edit Folder</label>

          {isLoading ? (
            <label>Loading...</label>
          ) : (
            <div className="d-flex justify-content-between gap-2">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save
              </button>
            </div>
          )}
        </div>

        <div className="d-flex flex-column gap-2 p-2">
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter Folder name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormSelect
            folders={folders}
            parentFolder={parentFolder}
            setParentFolder={setParentFolder}
            userId={currentUser._id}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateFolderForm;
