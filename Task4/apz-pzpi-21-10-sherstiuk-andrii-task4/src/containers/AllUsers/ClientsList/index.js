import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import StarsRating from "../../../components/StarsRating";

import "./index.scss";

const ClientsList = ({ filtersValues, chooseRole, handleRole }) => {
  const { t } = useTranslation();
  const [clientsList, setClientsList] = useState([]);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const isEmptyObject = Object.keys(filtersValues).length === 0;

    if (isEmptyObject) {
      axios.get(`http://localhost:5000/unAuth/allUsers/?role=${chooseRole}`)
        .then((response) => {
          setClientsList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [chooseRole, filtersValues]);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (filtersValues.sport_type && filtersValues.sport_type.length > 0) {
      queryParams.append("sport_type", filtersValues.sport_type.join(","));
    }

    const addParamIfExists = (paramName, paramValue) => {
      if (paramValue !== undefined) {
        queryParams.set(paramName, paramValue);
      }
    };

    addParamIfExists("minAge", filtersValues.minAge);
    addParamIfExists("maxAge", filtersValues.maxAge);
    addParamIfExists("minExp", filtersValues.minExp);
    addParamIfExists("maxExp", filtersValues.maxExp);
    addParamIfExists("minPrice", filtersValues.minPrice);
    addParamIfExists("maxPrice", filtersValues.maxPrice);

    if (filtersValues.sort_by) {
      queryParams.append("sort_by", filtersValues.sort_by);
    }

    if (queryParams.toString() !== "") {
      axios
        .get(`http://localhost:5000/unAuth/allUsersWithFilters?role=${chooseRole}&${queryParams}`)
        .then((response) => {
          setClientsList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [filtersValues]);

  const seeMoreUsers = () => {
    setVisible((prev) => prev + 6);
  };

  return (
    <div className="users-container">
      <div className="role-btns">
        <button
          type="button"
          onClick={() => handleRole("athlete")}
          className={chooseRole === "athlete" ? "current-role" : ""}
        >
          {t("clientsPage.athletesParagraph")}
        </button>
        <button
          type="button"
          onClick={() => handleRole("coach")}
          className={chooseRole === "coach" ? "current-role" : ""}
        >
          {t("clientsPage.trainersParagraph")}
        </button>
      </div>
      <div className="users-list">
        {clientsList.slice(0, visible).map(({
          // eslint-disable-next-line camelcase
          id, name, lastname, sport_type, country, city, experience, price, rating,
        }) => (
          <div key={id} className="users-list-item">
            <div className="users-list-item-info">
              <div className="users-list-item-info-details">
                <span>
                  {name}
                  {" "}
                  {lastname}
                </span>
                <span>
                  {country}
                  ,
                  {" "}
                  {city}
                </span>
                <span>
                  {t("clientsPage.clientsList.specialized")}
                  {" "}
                  {/* eslint-disable-next-line camelcase */}
                  {sport_type}
                </span>
                <span>
                  {t("clientsPage.clientsList.experience")}
                  {" "}
                  {experience}
                  {" "}
                  years
                </span>
                {chooseRole === "coach"
                  ? (
                    <>
                      <span>
                        {t("clientsPage.clientsList.price")}
                        {" "}
                        {price}
                        {" "}
                        $
                      </span>
                      {" "}
                      <span>
                        {t("clientsPage.clientsList.rating")}
                        {" "}
                        <StarsRating
                          initialValue={rating}
                          readOnly={false}
                        />

                      </span>
                    </>
                  ) : ""}
              </div>
            </div>
            <Link to={`/clients/${id}`} className="check-profile">{t("clientsPage.clientsList.details")}</Link>
          </div>
        ))}
      </div>
      {clientsList.length > visible
        ? <button type="button" onClick={seeMoreUsers} className="load-more">Load more</button> : ""}
    </div>
  );
};

ClientsList.propTypes = {
  chooseRole: PropTypes.string,
  handleRole: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  filtersValues: PropTypes.object,
};

export default ClientsList;
