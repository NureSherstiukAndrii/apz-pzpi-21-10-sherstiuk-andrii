import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import formatDate from "../../../utils/formatDate";

import "./index.scss";

const ReportsList = ({ userId, closeList }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/getReports/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setReports(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="reports">
      <button type="button" onClick={closeList}>X</button>
      <table>
        <thead>
          <tr>
            <th>{t("clientPage.reportList.sender")}</th>
            <th>{t("clientPage.reportList.reason")}</th>
            <th>{t("clientPage.reportList.date")}</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(({
            id, senderId, senderName, senderLastname, reason, dateOfCreation,
          }) => (
            <tr key={id}>
              <td>
                <Link to={`/clients/${senderId}`}>
                  {senderName}
                  {" "}
                  {senderLastname}
                </Link>
              </td>
              <td>{reason}</td>
              <td>{formatDate(dateOfCreation)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ReportsList.propTypes = {
  userId: PropTypes.string,
  closeList: PropTypes.func,
};

export default ReportsList;
