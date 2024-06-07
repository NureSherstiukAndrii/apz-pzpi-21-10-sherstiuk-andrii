import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";

import FormField from "../../components/FormWrapper/Field";
import FormWrapper from "../../components/FormWrapper";
import required from "../../utils/validators/isRequired";
import minLength from "../../utils/validators/minLength";
import validateEmail from "../../utils/validators/validateEmail";
import composeValidators from "../../utils/validators/composeValidators";
import usePassword from "../../hooks/usePassword";
import toastError from "../../utils/toast/toastError";

const Login = () => {
  const { t } = useTranslation();
  const { isPasswordVisible, togglePassword } = usePassword();
  const navigate = useNavigate();
  const [loginAs, setLoginAs] = useState(null);

  const sendUserData = (values) => {
    if (loginAs === "company") {
      axios.post("http://localhost:5000/company/login", values)
        .then((response) => {
          const token = response.data;
          localStorage.setItem("token", token);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error login user", error);
          toastError("Incorrect mail or password");
        });
      return;
    }
    axios.post("http://localhost:5000/api/login", values)
      .then((response) => {
        const token = response.data;
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error login user", error);
        toastError("Incorrect mail or password");
      });
  };

  return (
    <>
      {!loginAs && (
        <div className="register-buttons">
          <Link className="form-container__paragraph" to="/">SPORTIFY</Link>
          <div>
            <button onClick={() => setLoginAs("user")}>login as user</button>
            <button onClick={() => setLoginAs("company")}>login as company</button>
          </div>
        </div>
      )}

      {loginAs && (
        <FormWrapper
          onSubmit={sendUserData}
          linkTo="/registration"
          linkToName={t("regPage.paragraph")}
          paragraphName={t("loginPage.paragraph")}
        >
          <ToastContainer style={{ width: "330px" }} />
          <FormField
            name="mail"
            validators={composeValidators(required, validateEmail)}
            type="text"
            placeholder={t("loginPage.mail")}
          />
          <FormField
            name="password"
            validators={composeValidators(required, minLength)}
            hasButton
            placeholder={t("loginPage.password")}
            type={isPasswordVisible ? "text" : "password"}
            togglePassword={togglePassword}
            viewPassword={isPasswordVisible}
          />
        </FormWrapper>
      )}
    </>
  );
};

export default Login;
