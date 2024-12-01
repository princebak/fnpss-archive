import ValidateEmailForm from "@/app/components/form/ValidateEmailForm";
import { sendEmailWithEmailJs } from "@/services/NotificationService";
import React from "react";

export const metadata = {
  title: "FNPSS Archives | Validate email",
};

const page = () => {
  return <ValidateEmailForm sendEmailWithEmailJs={sendEmailWithEmailJs}/>;
};

export default page;
