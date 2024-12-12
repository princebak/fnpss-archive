"use client";

import React, { useState } from "react";
import FormWrapper from "./FormWrapper";
import FormInput from "./elements/FormInput";
import FormSubmitButton from "./elements/FormSubmitButton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateJustRegisteredUser } from "@/redux/slices/userSlice";
import Footer from "./elements/Footer";
import FooterElement from "./elements/FooterElement";
import AlertMessage from "../AlertMessage";
import { AlertMessageClass } from "@/classes";

const SignupForm = ({ register }: any) => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const router = useRouter();

  const [message, setMessage] = useState<AlertMessageClass | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(initialValues);
  const dispatch = useDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);

      const res: any = await register(form);

      if (res.error) {
        setMessage({ content: res.error, color: "alert-danger" });
      } else {
        setMessage({
          content:
            "Enregistré avec succès",
          color: "alert-success",
        });
        setForm(initialValues);
        /*We save the registered user in local storage
          to use it for the resend email request on the validate-email
        */
        dispatch(updateJustRegisteredUser(res)); // when success, the response is the registered user
        setInterval(() => {
          router.push("/validate-email");
        }, 3000);
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <FormWrapper formLabel="S'inscrire" handleSubmit={handleSubmit}>
      {message && (
        <AlertMessage content={message.content} color={message?.color} />
      )}
      <FormInput
        id={"name"}
        name={"name"}
        type="text"
        label="Nom complet"
        placeHolder="Prince Bakenga"
        title="Nom complet"
        value={form.name}
        handleChange={handleChange}
      />
      <FormInput
        id={"email"}
        name={"email"}
        type="email"
        label="Adresse e-mail"
        title="Adresse e-mail"
        value={form.email}
        handleChange={handleChange}
      />

      <FormInput
        id={"phone"}
        name={"phone"}
        type="tel"
        label="Numéro de téléphone"
        title="Numéro de téléphone"
        value={form.phone}
        handleChange={handleChange}
      />

      <FormInput
        id={"password"}
        name={"password"}
        type="password"
        label="Mot de passe"
        title="Mot de passe"
        value={form.password}
        handleChange={handleChange}
      />
      <FormInput
        id={"confirmPassword"}
        name={"confirmPassword"}
        type="password"
        label="Confirmer le mot de passe"
        title="Confirmer le mot de passe"
        value={form.confirmPassword}
        handleChange={handleChange}
      />

      <FormSubmitButton label="Soumettre" isLoading={isLoading} />

      <Footer>
        <FooterElement
          firstText="Vous souvenez-vous de votre mot de passe"
          secondText="se connecter"
          link="/login"
          isborderTop={true}
        />
      </Footer>
    </FormWrapper>
  );
};

export default SignupForm;