import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import formatDate from "../../../../utils/formatDate";

import "./index.scss";

const ResultDetails = ({ id, onClose }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const [details, setDetails] = useState({});
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/userHistory/result/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setDetails(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const convertCelsiusToFahrenheit = (celsius) => {
    // eslint-disable-next-line no-restricted-globals
    if (typeof celsius !== "number" || isNaN(celsius)) {
      return "Invalid Temperature";
    }
    // eslint-disable-next-line no-mixed-operators
    const fahrenheit = (celsius * 9 / 5) + 32;
    return `${fahrenheit.toFixed(2)} °F`;
  };

  const handleToggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  if (!details || Object.keys(details).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="result">
      <button type="button" onClick={onClose} className="result-close">
        {t("accountPage.history.closeDetails")}
      </button>
      <h2>{t("accountPage.history.resultDetails")}</h2>
      <div>
        {t("accountPage.history.rules")}
      </div>
      <p>
        {t("accountPage.history.result")}
        {" "}
        {details.result}
        {" "}
        {t("accountPage.history.meters")}
      </p>
      <p>
        Health coefficient
        {": "}
        {Math.round(details.healthCoefficient)}
      </p>
      <p>
        Train coefficient
        {": "}
        {details.trainCoefficient}
      </p>
      <p>
        {t("accountPage.history.heartbeat")}
        {" "}
        {details.heartbeat}
        {" "}
        {t("accountPage.history.heartbeatPerMinute")}
      </p>
      <p>
        {t("accountPage.history.oxygen")}
        {" "}
        {details.oxygen}
        {" "}
        %
      </p>
      <p>
        Middle speed:
        {" "}
        {details.middle_speed}
        {" "}
        km/h
      </p>
      <p>
        Tilt angle:
        {" "}
        {details.tilt_angle}
        {" "}
        degrees
      </p>
      <div className="result-temperature">
        <p>
          {t("accountPage.history.temperature")}
          {" "}
          {isCelsius ? `${details.temperature} ℃` : convertCelsiusToFahrenheit(details.temperature)}
        </p>
        <button type="button" onClick={handleToggleTemperatureUnit}>
          {isCelsius ? t("accountPage.history.fahrenheit") : t("accountPage.history.celsius")}
        </button>
      </div>
      <p>
        {t("accountPage.history.date")}
        {": "}
        {formatDate(details.dateOfTrain)}
      </p>
    </div>
  );
};

ResultDetails.propTypes = {
  id: PropTypes.number,
  onClose: PropTypes.func,
};

export default ResultDetails;
