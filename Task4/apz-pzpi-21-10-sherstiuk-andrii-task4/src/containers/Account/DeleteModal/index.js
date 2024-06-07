import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import "./index.scss";

const DeleteModal = ({ token, closeModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deleteAccount = () => {
    axios.delete("http://localhost:5000/api/deleteUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="delete-modal">
      <span>{t("accountPage.modal.phrase")}</span>
      <div className="delete-modal-btns">
        <button type="button" onClick={() => { deleteAccount(); closeModal(); }}>{t("accountPage.modal.yes")}</button>
        <button type="button" onClick={closeModal}>{t("accountPage.modal.no")}</button>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  token: PropTypes.string,
  closeModal: PropTypes.func,
};

export default DeleteModal;
