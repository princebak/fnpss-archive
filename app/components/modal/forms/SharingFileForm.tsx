"use client";

import { findById, updateFileInfo } from "@/services/MyFileService";
import { getAllSilmUsers } from "@/services/UserService";
import { getFileFullname } from "@/utils/myFunctions";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormSimpleCheckbox from "./FormSimpleCheckbox";

const SharingFileForm = ({ id, closeModal, refreshData }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [isFolder, setIsFolder] = useState(false);
  const [sharedWithUsers, setSharedWithUsers] = useState<IMyFile[]>([]);
  const [newSharedWithUsers, setNewSharedWithUsers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const { currentUser } = useSelector((state: any) => state.user);

  const handleUsersFiltering = (value: string) => {
    const regex = new RegExp(value, "i");
    if (value) {
      const filteredUsers = allUsers.filter((user: { name: string }) =>
        regex.test(user.name)
      );
      setFilteredUsers(filteredUsers);
    } else {
      setFilteredUsers(allUsers);
    }
  };

  const addOrRemoveSharedWithUser = (userId: string) => {
    console.log("In : addOrRemoveSharedWithUser");
    if (isDisabled) return;
    setIsDisabled(true);

    const existingUserId = newSharedWithUsers.find(
      (userKey) => userId === userKey
    );

    if (existingUserId) {
      const newList = newSharedWithUsers.filter((userKey) => userId != userKey);
      setNewSharedWithUsers(newList);
    } else {
      setNewSharedWithUsers([...newSharedWithUsers, userId]);
    }

    console.log("Out : addOrRemoveSharedWithUser");
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  const closeModalAndReload = () => {
    closeModal();
    refreshData();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await updateFileInfo(
      {
        _id: id,
        sharedWithUsers: newSharedWithUsers,
        scheduledDate: null,
        alertDate: null,
      },
      false
    );

    if (res.error) {
      setMessage(res.error);
    } else {
      setNewSharedWithUsers([]);
      setMessage("File shared successfully !");
      closeModalAndReload();
    }
  };

  useEffect(() => {
    const loadFileInfo = async () => {
      if (id) {
        const fileInfo = await findById(id); // assuming that the sharedWithUsers is populated
        const users = await getAllSilmUsers();
        const usersWithoutCurrentUser = users.filter(
          (user: any) => user._id !== currentUser._id
        );

        setAllUsers(usersWithoutCurrentUser);
        setFilteredUsers(usersWithoutCurrentUser);

        if (fileInfo) {
          setSharedWithUsers(fileInfo.sharedWithUsers!);
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
          <label style={{ color: "black" }}>Sharing File</label>

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
          <label
            className="p-1"
            style={{ backgroundColor: "#eee", borderRadius: "0px 20px 0 0" }}
          >
            {getFileFullname(fileName, isFolder, fileExtension)}
          </label>

          <div>
            <label className="form-text">Is shared with :</label>
            <div
              className="d-flex flex-column gap-2 p-2"
              style={{ border: "solid 1px #ddd", borderRadius: "5px" }}
            >
              {sharedWithUsers.length > 0 ? (
                sharedWithUsers.map((user: any, index) => (
                  <label
                    key={user._id}
                    style={index > 0 ? { borderTop: "solid 1px #eee" } : {}}
                  >
                    {user.name}
                  </label>
                ))
              ) : (
                <label className="alert alert-info mb-0">
                  Not yet shared !
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="form-text">Select users to share with : </label>
            <div
              className="d-flex flex-column gap-2 p-2"
              style={{ border: "solid 1px #ddd", borderRadius: "5px" }}
            >
              <input
                type="text"
                placeholder="search user"
                className="form-control"
                onChange={(e) => handleUsersFiltering(e.target.value)}
              />
              <div className="d-flex flex-column gap-2">
                {filteredUsers.map((user: { name: string; _id: string }) => (
                  <label
                    className="d-flex gap-2"
                    key={user._id}
                    onClick={() => addOrRemoveSharedWithUser(user._id)}
                  >
                    <FormSimpleCheckbox
                      id={user._id}
                      label={user.name}
                      checked={
                        sharedWithUsers.find(
                          (sharedUser: any) => sharedUser._id == user._id
                        )
                          ? true
                          : false
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SharingFileForm;
