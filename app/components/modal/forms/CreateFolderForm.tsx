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
import FileEditAlert from "../../form/elements/FileEditAlert";

const CreateFolderForm = ({
  id,
  closeModal,
  userFolderId,
  refreshData,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    content: string;
    colorClass?: string;
  }>({ content: "", colorClass: "danger" });
  const { currentUser } = useSelector((state: any) => state.user);

  const [name, setName] = useState("");
  const [parentFolder, setParentFolder] = useState(userFolderId);
  const [folders, setFolders] = useState<Array<IMyFile>>();

  const [alertDate, setAlertDate] = useState<Date | null>(null);
  const [alertReason, setAlertReason] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  const closeModalAndReload = () => {
    closeModal();
    refreshData();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      name,
      originalName: name,
      parentFolder,
      scheduledDate,
      alertDate,
      alertReason,
    };

    if (name) {
      if (alertDate && scheduledDate && alertDate > scheduledDate) {
        setMessage({
          ...message,
          content:
            "La date d'alerte ne peut pas être postérieure à la date prévue, veuillez la corriger.",
        });
        setIsLoading(false);
        return;
      } else if (alertDate && !alertReason) {
        setMessage({
          ...message,
          content: "Le motif de l'alerte est obligatoire.",
        });
        setIsLoading(false);
        return;
      }

      if (!id) {
        // Create a new Folder
        const finalData = {
          ...data,
          owner: currentUser._id,
          isFolder: true,
        };
        const res = await saveFileInfo(
          finalData,
          "true" // TO DO check without this... because I think we should remove it
        );
        if (res.error) {
          console.log("Error >>  ", res.error);
          setMessage({ ...message, content: "Mauvaise requête." });
        } else {
          setMessage({
            content: "Folder uploaded successfully !",
            colorClass: "success",
          });
          closeModalAndReload();
        }
      } else {
        // Update the Folder

        const res = await updateFileInfo({
          _id: id,
          ...data,
        });

        if (res.error) {
          setMessage({ ...message, content: "Mauvaise requête." });
        } else {
          setMessage({
            content: "Folder updated with success !!",
            colorClass: "success",
          });
          closeModalAndReload();
        }
      }
    } else {
      setMessage({
        ...message,
        content: "Un dossier doit avoir un nom d'affichage.",
      });
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
          setAlertDate(fileInfo.alertDate ? fileInfo.alertDate! : null);
          setScheduledDate(
            fileInfo.scheduledDate ? fileInfo.scheduledDate! : null
          );
          setAlertReason(fileInfo.alertReason!);
        }
      }
      const myFolders = await getFolders(currentUser._id);

      const validFolders = myFolders.filter((folder: any) => folder._id != id);
      setFolders(validFolders);
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
        style={{ border: "solid 1px #ddd", borderRadius: "5px" }}
      >
        <div
          className="d-flex justify-between p-2"
          style={{ borderBottom: "solid 1px #ddd" }}
        >
          <label style={{ color: "black" }}>{"Modifier le dossier"}</label>

          {isLoading ? (
            <label>Chargement...</label>
          ) : (
            <div className="d-flex justify-content-between gap-2">
              <button className="btn btn-primary" onClick={handleSubmit}>
              Enregistrer
              </button>
            </div>
          )}
        </div>

        <div className="d-flex flex-column gap-2 p-2">
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Entrer le nom du dossier"
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

          <FileEditAlert
            id={"folderIsOnAlert"}
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

export default CreateFolderForm;
