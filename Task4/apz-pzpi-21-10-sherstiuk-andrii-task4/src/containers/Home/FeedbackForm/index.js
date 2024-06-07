import React from "react";
import { Form, Field } from "react-final-form";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

import toastError from "../../../utils/toast/toastError";
import toastSuccess from "../../../utils/toast/toastSuccess";
import paperPlane from "../../../assets/paper-plane.png";

import "./index.scss";

const FeedbackForm = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  const sendFeedback = (values, form) => {
    axios.post("http://localhost:5000/api/addCommentToService", { text: values.feedback }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data.message);
      })
      .catch((err) => {
        if (err.request.status === 401) {
          toastError("You need to login");
        }
      });
    form.change("feedback", "");
  };

  return (
    <div className="feedback-form-wrapper">
      <ToastContainer style={{ width: "330px" }} />
      <Form
        onSubmit={sendFeedback}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="feedback-form">
            <span className="feedback-form-paragraph">{t("homepage.feedbacks.form_paragraph")}</span>
            <Field name="feedback">
              {({ input, meta }) => (
                <div className="feedback-block">
                  <input
                    {...input}
                    placeholder={t("homepage.feedbacks.placeholder")}
                    className="feedback-block-input"
                    type="text"
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                  <button
                    type="submit"
                  >
                    <img src={paperPlane} alt="plane" />
                  </button>
                </div>
              )}
            </Field>
          </form>
        )}
      />
    </div>
  );
};

export default FeedbackForm;
