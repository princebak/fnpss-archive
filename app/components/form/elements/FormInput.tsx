"use client";

import Image from "next/image";
import React, { ChangeEventHandler, FC } from "react";

type InputProps = {
  component?: any;
  label: string;
  type: string;
  id?: string;
  name?: string;
  value?: string;
  placeHolder?: string;
  title?: string;
  error?: string;
  required?: boolean;
  readonly?: boolean;
  checked?: boolean;
  iconLink?: string;
  tooglePasswordVisibility?:
    | React.MouseEventHandler<HTMLImageElement>
    | undefined;
  handleChange?: ChangeEventHandler<HTMLInputElement> | undefined;
};

const FormInput: FC<InputProps> = ({
  component,
  label,
  type,
  id,
  name,
  error,
  value,
  placeHolder,
  title,
  required,
  readonly,
  checked,
  iconLink,
  handleChange,
  tooglePasswordVisibility,
}) => {
  if (!placeHolder) {
    switch (type) {
      case "password":
        placeHolder = "********";
        break;
      case "email":
        placeHolder = "bakengailunga@gmail.com";
        break;
      case "tel":
        placeHolder = "+243828414084";
        break;
      default:
        break;
    }
  }

  let inputTag = (
    <input
      type={type}
      className="form-control"
      id={id}
      name={name}
      aria-describedby={`${name}Help`}
      value={value ? value : ""}
      placeholder={placeHolder}
      title={title}
      required={required}
      readOnly={readonly}
      checked={checked}
      onChange={handleChange}
    />
  );

  if (id == "password" || id == "confirmPassword") {
    inputTag = (
      <div className="input-group">
        {inputTag}
        <button
          className="btn btn-outline-secondary"
          type="button"
          id="togglePassword"
        >
          <i
            className="bi bi-eye"
            id="toggleIcon"
            onClick={tooglePasswordVisibility}
          >
            <Image
              width={20}
              height={20}
              alt="eye_closed"
              src={iconLink ? iconLink : ""}
            />
          </i>
        </button>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="form-label mb-0">
        {label}
      </label>
      {component ? <div>{component}</div> : inputTag}
      {error ? (
        <div id={`${name}Help`} className="form-text text-danger">
          {error}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default FormInput;
