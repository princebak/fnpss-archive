import ResetPasswordForm from "@/app/components/form/ResetPasswordForm";
import { sendResetPwLink } from "@/services/UserService";
import React from "react";

export const metadata = {
  title: "FNPSS Archives | Reset password",
};

const page = () => {
  return <ResetPasswordForm sendResetPwLink={sendResetPwLink}/>;
};

export default page;
