import { getColor } from "@/utils/myFunctions";
import React from "react";

const NotificationCirle = ({
  sectionId,
  totalElements,
}: {
  sectionId: any;
  totalElements: any;
}) => {
  return (
    <sup
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        border: "solid 1px #eee",
        color: `${getColor(sectionId)}`,
        fontWeight: "bold",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      {totalElements}
    </sup>
  );
};

export default NotificationCirle;
