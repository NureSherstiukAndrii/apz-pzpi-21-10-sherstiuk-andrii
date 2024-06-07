import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "react-final-form";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

import FormWrapper from "../../components/FormWrapper";
import FormField from "../../components/FormWrapper/Field";
import required from "../../utils/validators/isRequired";
import minLength from "../../utils/validators/minLength";
import validateEmail from "../../utils/validators/validateEmail";
import composeValidators from "../../utils/validators/composeValidators";
import usePassword from "../../hooks/usePassword";
import toastSuccess from "../../utils/toast/toastSuccess";
import toastError from "../../utils/toast/toastError";

import "./index.scss";

const Registration = () => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [registerAs, setRegisterAs] = useState(null);
  const { togglePassword, isPasswordVisible } = usePassword();
  const navigate = useNavigate();

  const changeRole = (value) => {
    setSelectedRole(value);
  };

  const sendUserData = (values) => {
    if (registerAs === "company") {
      axios
        .post("http://localhost:5000/company/registration", values)
        .then((response) => {
          toastSuccess(response.message);
          navigate("/login");
        })
        .catch((error) => {
          if (error.request.status === 400) {
            toastError("This email already registered");
          }
        });
      return;
    }
    axios
      .post("http://localhost:5000/api/registration", values)
      .then((response) => {
        toastSuccess(response.message);
        navigate("/login");
      })
      .catch((error) => {
        if (error.request.status === 400) {
          toastError("This email already registered");
        }
      });
  };

  return (
    <>
      {!registerAs && (
        <div className="register-buttons">
          <Link className="form-container__paragraph" to="/">SPORTIFY</Link>
          <div>
            <button onClick={() => setRegisterAs("user")}>register as user</button>
            <button onClick={() => setRegisterAs("company")}>register as company</button>
          </div>
        </div>
      )}

      {registerAs === "user" && (
        <FormWrapper
          onSubmit={sendUserData}
          linkTo="/login"
          linkToName={t("loginPage.paragraph")}
          paragraphName={t("regPage.paragraph")}
        >
          <ToastContainer style={{ width: "330px" }} />
          <div className="inputs-wrapper">
            <div className="inputs-wrapper__block">
              <FormField
                name="name"
                validators={required}
                type="text"
                placeholder={t("regPage.name")}
              />

              <FormField
                name="lastname"
                validators={required}
                type="text"
                placeholder={t("regPage.lastname")}
              />

              <FormField
                name="age"
                validators={required}
                type="text"
                placeholder={t("regPage.age")}
              />

              <FormField
                name="weight"
                validators={required}
                type="text"
                placeholder={t("regPage.weight")}
              />

              <FormField
                name="height"
                validators={required}
                type="text"
                placeholder={t("regPage.height")}
              />

              <FormField
                name="country"
                validators={required}
                type="text"
                placeholder={t("regPage.country")}
              />
            </div>

            <div className="inputs-wrapper__block">
              <FormField
                name="city"
                validators={required}
                type="text"
                placeholder={t("regPage.city")}
              />

              <Field
                name="sport_type"
                component="select"
                validate={required}
              >
                <option value="" disabled>{t("regPage.sport.name")}</option>
                <option value="skiing">{t("regPage.sport.skiing")}</option>
                <option value="snowboarding">{t("regPage.sport.snowboarding")}</option>
                <option value="snowkiting">{t("regPage.sport.snowkiting")}</option>
              </Field>

              <FormField
                name="experience"
                validators={required}
                type="text"
                placeholder={t("regPage.experience")}
              />

              <Field
                name="role"
                component="select"
                validate={required}
                onChange={(event) => { changeRole(event.target.value); }}
                initialValue={selectedRole}
              >
                <option value="" disabled>{t("regPage.role.name")}</option>
                <option value="athlete">{t("regPage.role.athlete")}</option>
                <option value="coach">{t("regPage.role.coach")}</option>
              </Field>

              {selectedRole === "coach" && (
                <FormField
                  name="price_per_lesson"
                  validators={required}
                  type="text"
                  placeholder={t("regPage.price")}
                />
              )}

              <FormField
                name="mail"
                validators={composeValidators(required, validateEmail)}
                type="text"
                placeholder={t("regPage.mail")}
              />

              <FormField
                name="password"
                validators={composeValidators(required, minLength)}
                hasButton
                placeholder={t("regPage.password")}
                type={isPasswordVisible ? "text" : "password"}
                togglePassword={togglePassword}
                viewPassword={isPasswordVisible}
              />
            </div>
          </div>
        </FormWrapper>
      )}

      {registerAs === "company" && (
        <FormWrapper
          onSubmit={sendUserData}
          linkTo="/login"
          linkToName={t("loginPage.paragraph")}
          paragraphName={t("regPage.paragraph")}
        >
          <ToastContainer style={{ width: "330px" }} />
          <div className="inputs-wrapper__block">
            <FormField
              name="name"
              validators={required}
              type="text"
              placeholder={t("regPage.name")}
            />

            <FormField
              name="description"
              validators={required}
              type="text"
              placeholder="description"
            />

            <FormField
              name="owner"
              validators={required}
              type="text"
              placeholder="owner"
            />

            <FormField
              name="mail"
              validators={composeValidators(required, validateEmail)}
              type="text"
              placeholder={t("regPage.mail")}
            />

            <FormField
              name="password"
              validators={composeValidators(required, minLength)}
              hasButton
              placeholder={t("regPage.password")}
              type={isPasswordVisible ? "text" : "password"}
              togglePassword={togglePassword}
              viewPassword={isPasswordVisible}
            />
          </div>
        </FormWrapper>
      )}
    </>
  );
};

export default Registration;
