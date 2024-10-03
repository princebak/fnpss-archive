"use client";

import { findById, updateFileInfo } from "@/services/MyFileService";
import { fileStatus } from "@/utils/constants";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

const CreateFileForm = ({ id, closeModal, refreshData }: any) => {
  const [file, setFile] = useState<File>();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  // const [isEnterKeyPressed, setIsEnterKeyPressed] = useState(false);
  let isEnterKeyPressed = false;

  const closeModalAndReload = () => {
    closeModal();
    refreshData();
  };

  const handleSubmit = async (e: any) => {
    console.log("Sub");
    e.preventDefault();
    setIsLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

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
        const res = await updateFileInfo({ id: id, name: name });
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

  const handleDelete = useCallback(
    async (e: any) => {
      e.preventDefault();
      console.log("handleDelete  >> ", isEnterKeyPressed);
      if (isEnterKeyPressed) {
        // The pressed key is Enter
        console.log("Enter key pressed!");
        return;
      } else {
        setIsLoading(true);

        /*  const res = await updateFileInfo({ id: id, status: fileStatus.REMOVED });
      if (res.error) {
        setMessage("Bad request.");
      } else {
        setMessage("File deleted sucessfully !!");
        closeModalAndReload();
      } */

        setIsLoading(false);
      }
    },
    [isEnterKeyPressed]
  );

  useEffect(() => {
    const loadFilInfo = async () => {
      if (id) {
        const fileInfo = await findById(id);
        if (fileInfo) {
          setName(fileInfo.name);
        }
      }
    };
    loadFilInfo();
  }, []);

  console.log();

  return (
    <form onSubmit={(e) => e.preventDefault()}>
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
              {id ? (
                <button
                  onKeyUp={(e) => {
                    console.log("onKeyUp", e.code);
                  }}
                  onClick={(e) => handleDelete(e)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
              >
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyUp={(e) => {
              e.preventDefault();
              isEnterKeyPressed = true;
              return;
            }}
            required
          />
        </div>
      </div>
    </form>
  );
};

export default CreateFileForm;
