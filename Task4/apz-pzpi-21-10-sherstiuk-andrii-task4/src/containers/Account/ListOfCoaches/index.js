import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

import formatDate from "../../../utils/formatDate";
import check from "../../../assets/check.png";
import clear from "../../../assets/clear.png";
import toastSuccess from "../../../utils/toast/toastSuccess";

import "react-toastify/dist/ReactToastify.css";

const ListOfCoaches = () => {
  const { t } = useTranslation();
  const [coachClients, setCoachClients] = useState([]);
  const [currentClientStatus, setCurrentClientStatus] = useState("waiting");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`http://localhost:5000/company/getCoaches?status=${currentClientStatus}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setCoachClients(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentClientStatus]);

  const applyClient = (clientId) => {
    axios.patch(`http://localhost:5000/company/acceptCoach/${clientId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data);
        setCoachClients((prev) => prev.filter((client) => client.id !== clientId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const rejectClient = (id) => {
    axios.delete(`http://localhost:5000/company/deleteCoach/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data);
        setCoachClients((prev) => prev.filter((client) => client.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStatusChange = (newStatus) => {
    setCurrentClientStatus(newStatus);
  };

  return (
    <>
      <ToastContainer style={{ width: "330px" }} />
      <div className="status">
        <span style={{ fontSize: 30 }}>Your Coaches:</span>
        {/* <span>{t("accountPage.listClients.status")}</span> */}
        <div className="status-btns">
          <button
            type="button"
            onClick={() => handleStatusChange("waiting")}
            className={currentClientStatus === "waiting" ? "current-status" : ""}
          >
            {t("accountPage.listClients.statusWait")}
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("accepted")}
            className={currentClientStatus === "accepted" ? "current-status" : ""}
          >
            {t("accountPage.listClients.statusAccept")}
          </button>
        </div>
      </div>
      {coachClients.map(({
        id, name, lastname, coachStatus,
      }) => (
        <div className="client-item" key={id}>
          <div className="client-item-detail">
            <span>{name}</span>
            <span>{lastname}</span>
          </div>
          <div className="client-item-detail">
            <span>{t("accountPage.listClients.applicationDate")}</span>
            <span>DATA</span>
          </div>
          <div className="client-item-detail">
            <span>{t("accountPage.listClients.status")}</span>
            <span>{coachStatus}</span>
          </div>
          <Link to={`/clients/${id}`}>{t("accountPage.listClients.profileLink")}</Link>
          <div className="client-item-btns">
            {coachStatus === "waiting"
              ? (
                <button type="button" onClick={() => applyClient(id)}>
                  <img src={check} alt="accept" />
                </button>
              ) : ""}
            <button type="button" onClick={() => rejectClient(id)}><img src={clear} alt="reject" /></button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ListOfCoaches;
