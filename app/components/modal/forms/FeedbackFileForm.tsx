"use client";

import { addUserFeedback, findById } from "@/services/MyFileService";
import { getAllSilmUsers } from "@/services/UserService";
import { getFileFullname, getFormatedDate } from "@/utils/myFunctions";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FeedbackFileForm = ({
  id,
  closeModal,
  refreshData,
  createdDate,
  sharedDate,
  sharingReason
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [isFolder, setIsFolder] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Partial<FeedbackContent>[]>([]);

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { currentUser } = useSelector((state: any) => state.user);

  const closeModalAndReload = () => {
    closeModal();
    refreshData();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await addUserFeedback(currentUser._id, id, feedbackMessage);

    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage("Use feednack added successfully !");
      closeModalAndReload();
    }
  };

  useEffect(() => {
    const loadFileInfo = async () => {
      if (id) {
        const fileInfo = await findById(id); // assuming that the receivers is populated

        if (fileInfo) {
          setFeedbacks(fileInfo.feedbacks);
          setFileName(fileInfo.name!);
          setFileExtension(fileInfo.extension);
          setIsFolder(fileInfo.isFolder);
        }
      }
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
          <label style={{ color: "black" }}>Feedback File</label>
        </div>

        <div className="d-flex flex-column gap-2 p-2">
          <label
            className="p-1 d-flex justify-content-between"
            style={{ backgroundColor: "#eee", borderRadius: "0px 20px 0 0" }}
          >
            <span> {getFileFullname(fileName, isFolder, fileExtension)}</span>
            <span>{sharedDate}</span>
          </label>

          <div>
            <label className="form-text">Sharing reason :</label>

            <div
              className="d-flex flex-column gap-2 p-2"
              style={{ border: "solid 1px #ddd", borderRadius: "5px" }}
            >
                <label
                  >
                    {sharingReason}
                </label>
            </div>
          </div>

          <div>
            <label className="form-text">Feedbacks : </label>
            <div
              className="d-flex flex-column gap-2 p-2"
              style={{ border: "solid 1px #ddd", borderRadius: "5px" }}
            >
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="feedback here"
                  className="form-control"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                />

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

              <div
                className="d-flex flex-column gap-2"
                style={{ borderTop: "solid 1px #ddd", paddingTop: "10px" }}
              >
                {feedbacks.map((feedback: any, index: any) => (
                  <div className="d-flex gap-1" key={index}>
                    <div className="flex-shrink-0">
                      {index + 1}
                      {":"}
                    </div>
                    <div className="d-flex flex-column flex-grow-1">
                      <span style={{ fontWeight: "bold" }}>
                        {feedback.receiver.type.name}
                      </span>
                      <div
                        className="d-flex justify-content-between align-items-center text-primary"
                        style={{
                          backgroundColor: "rgb(240,240,255)",
                          padding: "5px",
                          borderRadius: "0 30px 30px 30px",
                        }}
                      >
                        <span>{feedback.feedbackMessage}</span>
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {getFormatedDate(feedback.feedbackDate, true, true)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FeedbackFileForm;
