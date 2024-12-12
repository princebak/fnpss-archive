"use client";

import React, { useState } from "react";
import FormWrapper from "./FormWrapper";
import FormInput from "./elements/FormInput";
import FormSubmitButton from "./elements/FormSubmitButton";
import { useRouter } from "next/navigation";
import FooterElement from "./elements/FooterElement";
import Footer from "./elements/Footer";
import { AlertMessageClass } from "@/classes";
import AlertMessage from "../AlertMessage";

const ResetPasswordForm = ({ sendResetPwLink }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<AlertMessageClass | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await sendResetPwLink(email);

    if (res.error) {
      setMessage({ content: res.error, color: "alert-danger" });
      setIsLoading(false);
    } else {
      router.push("/validate-reset-pw");
    }
  };
  return (
    <FormWrapper formLabel="Réinitialiser le mot de passe" handleSubmit={handleSubmit}>
      {message && (
        <AlertMessage content={message.content} color={message?.color} />
      )}
      <FormInput
        id={"email"}
        name={"email"}
        type="email"
        label="Adresse E-mail"
        required
        value={email}
        handleChange={(e) => setEmail(e.target.value)}
      />

      <FormSubmitButton label="Soumettre" isLoading={isLoading} />

      <Footer>
        <FooterElement
          firstText="Vous n'avez pas de compte"
          secondText="s'inscrire"
          isborderTop={true}
          link="/signup"
        />
        <FooterElement
          firstText="Vous souvenez-vous de votre mot de passe"
          secondText="se connecter"
          link="/login"
        />
      </Footer>
    </FormWrapper>
  );
};

export default ResetPasswordForm;