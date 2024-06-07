import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import company from "../../../assets/company.jpg";
import "./index.scss";

const CompaniesList = React.memo(() => {
  const { t } = useTranslation();
  const [allCompanies, setAllCompanies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/company/getCompanies")
      .then((response) => {
        setAllCompanies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="events-wrapper">
      <h1>{t("header.nav.companies")}</h1>
      <div className="companies">
        {allCompanies.length === 0 ? <div>{t("eventsPage.eventList.noMatches")}</div> : ""}
        {allCompanies.map(({
          id, name,
        }) => (
          <div className="events-item" key={id}>
            <img src={company} alt="event" />
            <span className="events-item-name">{name}</span>
            <Link to={`/company/${id}`}>{t("eventsPage.eventList.seeMore")}</Link>
          </div>
        ))}
      </div>
    </div>
  );
});

CompaniesList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  filtersValues: PropTypes.object,
};

export default CompaniesList;
