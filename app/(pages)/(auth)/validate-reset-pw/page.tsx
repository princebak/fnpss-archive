import ValidateResetPwForm from "@/app/components/form/ValidateResetPwForm";
import { sendEmailWithEmailJs } from "@/services/NotificationService";
import React from "react";

export const metadata = {
  title: "FNPSS Archives | Validate reset password",
};

const page = () => {
  return <ValidateResetPwForm sendEmailWithEmailJs={sendEmailWithEmailJs} />;
};

export default page;
