import ConfimResetPwForm from "@/app/components/form/ConfirmResetPwForm";
import React from "react";
import { changePassword } from "@/services/UserService";

export const metadata = {
  title: "FNPSS Archives | Confim reset password",
};

const page = () => {
  return <ConfimResetPwForm changePassword={changePassword} />;
};

export default page;
