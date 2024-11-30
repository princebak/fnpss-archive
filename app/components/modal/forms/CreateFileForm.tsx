"use client";

import { findById, getFolders, updateFileInfo } from "@/services/MyFileService";
import { fileRole } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormSelect from "../../form/elements/FormSelect";
import { getFileNameWithoutExtension } from "@/utils/myFunctions";
import FileEditAlert from "../../form/elements/FileEditAlert";

const CreateFileForm = ({ id, closeModal, refreshData, userFolderId }: any) => {
  const [file, setFile] = useState<File>();
  const [name, setName] = useState("");
  const [alertDate, setAlertDate] = useState<Date | null>(null);
  const [alertReason, setAlertReason] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  const [parentFolder, setParentFolder] = useState(userFolderId);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    content: string;
    colorClass?: string;
  }>({ content: "", colorClass: "danger" });
  const [folders, setFolders] = useState<Array<IMyFile>>();
  const { currentUser } = useSelector((state: any) => state.user);

  const closeModalAndReload = () => {
    closeModal();
    refreshData();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (name) {
      setIsLoading(true);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);

        if (alertDate && scheduledDate && alertReason) {
          if (new Date(alertDate) > new Date(scheduledDate)) {
            setMessage({
              ...message,
              content:
                "The alert date can't be after the scheduled date, please to correct it.",
            });
            setIsLoading(false);
            return;
          } else {
            formData.append("scheduledDate", scheduledDate + "");
            formData.append("alertDate", alertDate + "");
            formData.append("alertReason", alertReason);
            formData.append("isOnAlert", "true");
          }
        } else {
          formData.append("isOnAlert", "false");
        }

        formData.append("parentFolder", parentFolder);
        formData.append("userId", currentUser._id);
        formData.append("fileRole", fileRole.SIMPLE_FILE);
        const uploadRes = await fetch("/api/files", {
          method: "POST",
          body: formData,
        });

        const data = await uploadRes.json();
        if (data.error) {
          setMessage({ ...message, content: data.error });
          setIsLoading(false);
        } else {
          setMessage({
            content: "File uploaded successfully !",
            colorClass: "success",
          });
          closeModalAndReload();
        }
      } else {
        if (id) {
          if (
            alertDate &&
            scheduledDate &&
            new Date(alertDate) > new Date(scheduledDate)
          ) {
            setMessage({
              ...message,
              content:
                "The alert date can't be after the scheduled date, please to correct it.",
            });
          } else if (alertDate && !alertReason) {
            setMessage({
              ...message,
              content: "The alert reason is mandatory.",
            });
            setIsLoading(false);
            return;
          } else {
            // Update the file
            const res = await updateFileInfo(
              {
                _id: id,
                name,
                parentFolder,
                alertDate,
                scheduledDate,
                alertReason,
              },
              true
            );
            if (res.error) {
              setMessage({ ...message, content: "Bad request." });
            } else {
              setMessage({
                content: "File renamed with success !!",
                colorClass: "success",
              });
              closeModalAndReload();
            }
          }
        } else {
          setMessage({ ...message, content: "Please to upload a file !" });
        }
      }

      setIsLoading(false);
    } else {
      setMessage({ ...message, content: "A file should have a display name." });
    }
  };

  useEffect(() => {
    const loadFileInfo = async () => {
      if (id) {
        const fileInfo: IMyFile = await findById(id);
        if (fileInfo) {
          setName(fileInfo.name!);
          const parentFolderId = fileInfo.parentFolder
            ? fileInfo.parentFolder
            : fileInfo.owner;
          setParentFolder(parentFolderId);
          setAlertDate(fileInfo.alertDate ? fileInfo.alertDate! : null);
          setScheduledDate(
            fileInfo.scheduledDate ? fileInfo.scheduledDate! : null
          );
          setAlertReason(fileInfo.alertReason!);
        }
      }
      const myFolders = await getFolders(currentUser._id);
      setFolders(myFolders);
    };

    loadFileInfo();
  }, []);

  return (
    <form>
      {message.content ? (
        <label className={`alert alert-${message.colorClass}`}>
          {message.content}
        </label>
      ) : (
        ""
      )}

      <div
        className="bd-example d-flex flex-column gap-2"
        style={{
          border: "solid 1px #ddd",
          borderRadius: "5px",
        }}
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
                setName(getFileNameWithoutExtension(e.target.files[0].name));
              }}
            />
          )}

          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Rename the file here"
            value={name}
            onChange={(e) =>
              setName(getFileNameWithoutExtension(e.target.value))
            }
            required
          />
          <FormSelect
            folders={folders}
            parentFolder={parentFolder}
            setParentFolder={setParentFolder}
            userId={currentUser._id}
          />

          <FileEditAlert
            id={"fileIsOnAlert"}
            alertDate={alertDate}
            scheduledDate={scheduledDate}
            setAlertDate={(value: Date) => setAlertDate(value)}
            setScheduledDate={(value: Date) => setScheduledDate(value)}
            alertReason={alertReason}
            setAlertReason={(value: string) => setAlertReason(value)}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateFileForm;
