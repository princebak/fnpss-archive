"use client";

import { findById, getFolders, updateFileInfo } from "@/services/MyFileService";
import { fileRole } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormSelect from "../../form/elements/FormSelect";
import { getFileNameWithoutExtension } from "@/utils/myFunctions";

const CreateFileForm = ({ id, closeModal, refreshData, userFolderId }: any) => {
  const [file, setFile] = useState<File>();
  const [name, setName] = useState("");
  const [parentFolder, setParentFolder] = useState(userFolderId);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [folders, setFolders] = useState<Array<IMyFile>>();
  const { currentUser } = useSelector((state: any) => state.user);

  const closeModalAndReload = () => {
    closeModal();
    refreshData();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("parentFolder", parentFolder);
      formData.append("userId", currentUser._id);
      formData.append("fileRole", fileRole.SIMPLE_FILE);

      const uploadRes = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage("File uploaded successfully !");
        closeModalAndReload();
      }
    } else {
      if (id) {
        // Rename the file
        const res = await updateFileInfo({ _id: id, name, parentFolder });
        if (res.error) {
          setMessage("Bad request.");
        } else {
          setMessage("File renamed with success !!");
          closeModalAndReload();
        }
      } else {
        setTimeout(() => {
          setMessage("File don't exist !");
        });
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
          className="d-flex justify-between flex-wrap p-2"
          style={{ borderBottom: "solid 1px #ddd" }}
        >
          <label style={{ color: "black" }}>Edit File</label>

          {isLoading ? (
            <label>Loading...</label>
          ) : (
            <div className="d-flex justify-content-between gap-2">
              <button onClick={handleSubmit} className="btn btn-primary">
                Save
              </button>
            </div>
          )}
        </div>

        <div className="d-flex flex-column gap-2 p-2">
          {id ? (
            <></>
          ) : (
            <input
              className="form-control"
              type="file"
              id="formFile"
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e: any) => {
                setFile(e.target.files[0]);
                setName(e.target.files[0].name);
              }}
            />
          )}

          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Rename the file here"
            value={getFileNameWithoutExtension(name)}
            onChange={(e) => setName(e.target.value)}
            required
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

export default CreateFileForm;
