import React from "react";

const FormSelect = ({
  folders,
  parentFolder,
  setParentFolder,
  userId,
}: any) => {
  return (
    <React.Fragment>
      {folders && folders.length > 0 ? (
        <select
          className="form-control"
          value={parentFolder}
          onChange={(e: any) => setParentFolder(e.target.value)}
        >
          <option value={userId} disabled>
            Select a folder
          </option>
          <option value={userId}>Root folder</option>
          {folders?.map((folder: any) => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="alert alert-info">
          The folder list will be shwon here, you are seeing the message because
          there is no folder yet.
        </p>
      )}
    </React.Fragment>
  );
};

export default FormSelect;
