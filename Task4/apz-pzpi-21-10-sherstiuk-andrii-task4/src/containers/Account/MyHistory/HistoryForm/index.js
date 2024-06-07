import React from "react";
import { Form } from "react-final-form";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import FormField from "../../../../components/FormWrapper/Field";
import required from "../../../../utils/validators/isRequired";

import "./index.scss";

const HistoryForm = ({ changeHistoryList, closeList }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const addResult = (values) => {
    axios.post("http://localhost:5000/api/addResult", values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        changeHistoryList(response.data);
        closeList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Form
      onSubmit={addResult}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className="history-form">
          <button type="button" onClick={closeList} className="close-form-btn">X</button>
          <div className="history-form-item">
            <FormField
              validators={required}
              name="result"
              type="text"
              placeholder={t("accountPage.history.result")}
            />
          </div>

          <div className="history-form-item">
            <FormField
              validators={required}
              name="heartbeat"
              type="text"
              placeholder="heartbeat"
            />
          </div>

          <div className="history-form-item">
            <FormField
              validators={required}
              name="oxygen"
              type="text"
              placeholder="oxygen"
            />
          </div>

          <div className="history-form-item">
            <FormField
              validators={required}
              name="temperature"
              type="text"
              placeholder="temperature"
            />
          </div>

          <div className="history-form-item">
            <FormField
              validators={required}
              name="tiltAngle"
              type="text"
              placeholder="tilt angle"
            />
          </div>

          <div className="history-form-item">
            <FormField
              validators={required}
              name="middle_speed"
              type="text"
              placeholder="middle speed"
            />
          </div>

          <div className="history-form-item">
            <FormField
              validators={required}
              name="dateOfResult"
              type="date"
              placeholder="date of result"
            />
          </div>
          <button type="submit" className="add-result">{t("accountPage.history.add")}</button>
        </form>
      )}
    />
  );
};

HistoryForm.propTypes = {
  changeHistoryList: PropTypes.func,
  closeList: PropTypes.func,
};

export default HistoryForm;
