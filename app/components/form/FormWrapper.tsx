"use client";

import React from "react";

const FormWrapper = ({ formLabel, handleSubmit, children }: any) => {
  return (
    <div
      className="bd-example d-flex flex-column gap-2 mt-2"
      style={{
        border: "solid 1px #ddd",
        borderRadius: "5px",
        height: "fit-content",
      }}
      id="formWrapper"
    >
      <div
        className="d-flex justify-between flex-wrap p-2"
        style={{
          borderBottom: "solid 1px #ddd",
          backgroundColor: "rgb(245,245,245)",
        }}
      >
        <label style={{ color: "black" }}> {formLabel}</label>
      </div>

      <div className="p-3">
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-3">{children}</div>
        </form>
      </div>
    </div>
  );
};

export default FormWrapper;
