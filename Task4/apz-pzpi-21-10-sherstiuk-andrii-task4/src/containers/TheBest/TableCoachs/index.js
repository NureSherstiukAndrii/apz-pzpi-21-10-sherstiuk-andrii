import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./index.scss";

const TableCoaches = () => {
  const { t } = useTranslation();
  const [topCoaches, setTopCoaches] = useState([]);
  const [currentSport, setCurrentSport] = useState("skiing");

  useEffect(() => {
    axios.get(`http://localhost:5000/coach/topCoaches?sport_type=${currentSport}`)
      .then((response) => {
        setTopCoaches(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentSport]);

  const newSportType = (sportType) => {
    setCurrentSport(sportType);
  };

  return (
    <div className="coach-block">
      <span className="coach-block-paragraph">{t("theBestPage.coachTableName")}</span>

      <div className="sports-btns">
        <button
          type="button"
          className={currentSport === "skiing" ? "active" : ""}
          onClick={() => newSportType("skiing")}
        >
          skiing
        </button>
        <button
          type="button"
          className={currentSport === "snowboarding" ? "active" : ""}
          onClick={() => newSportType("snowboarding")}
        >
          snowboarding
        </button>
        <button
          type="button"
          className={currentSport === "snowkiting" ? "active" : ""}
          onClick={() => newSportType("snowkiting")}
        >
          snowkiting
        </button>
      </div>

      <table className="coach-table">
        <thead>
          <tr>
            <th>{t("theBestPage.name")}</th>
            <th>{t("theBestPage.lastname")}</th>
            <th>{t("theBestPage.rating")}</th>
            <th>{t("theBestPage.link")}</th>
          </tr>
        </thead>
        <tbody>
          {topCoaches.map(({
            id, name, lastname, avgRating,
          }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{lastname}</td>
              <td>{avgRating}</td>
              <td><Link to={`/clients/${id}`} className="details-link">{t("theBestPage.details")}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCoaches;
