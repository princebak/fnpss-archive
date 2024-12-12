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
          {"Sélectionner un dossier"}
          </option>
          <option value={userId}>{"Dossier racine"}</option>
          {folders?.map((folder: any) => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="alert alert-info mb-0">
          {"La liste des dossiers s'affiche ici, vous voyez ce message parce qu'il n'y a pas encore de dossier."}
        </p>
      )}
    </React.Fragment>
  );
};

export default FormSelect;
