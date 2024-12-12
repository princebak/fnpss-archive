"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { emailMetadata } from "@/utils/constants";
import FormWrapper from "@/app/components/form/FormWrapper";
import FooterElement from "./elements/FooterElement";
import Loader from "../Loader";

const ValidateEmailForm = ({ sendEmailWithEmailJs }: any) => {
  const { justRegisteredUser } = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleResendValidationCode = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    await sendEmailWithEmailJs({
      receiver: justRegisteredUser,
      subject: emailMetadata.SUBJECT_EMAIL_VALIDATION,
      validationLink: emailMetadata.EMAIL_VALIDATION_LINK,
    });
    setIsLoading(false);
  };

  return (
    <FormWrapper formLabel="Validation d'E-mail">
      <label className="form-text">
        <p>
         {"Cliquez sur le lien de validation envoyé dans votre boîte aux lettres ;"}
        </p>
      </label>
      {isLoading ? (
        <Loader />
      ) : (
        <FooterElement
          firstText="Lien non reçu"
          secondText="Renvoyez-le"
          isborderTop={true}
          onClick={handleResendValidationCode}
        />
      )}
    </FormWrapper>
  );
};

export default ValidateEmailForm;
