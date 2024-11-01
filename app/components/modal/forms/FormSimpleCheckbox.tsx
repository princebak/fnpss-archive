import React, { useState } from "react";

const FormSimpleCheckbox = ({
  id,
  label,
  checked,
}: {
  id: string;
  label: string;
  checked: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className="d-flex gap-1">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={() => handleChange()}
      />
      <span>{label}</span>
    </div>
  );
};

export default FormSimpleCheckbox;
