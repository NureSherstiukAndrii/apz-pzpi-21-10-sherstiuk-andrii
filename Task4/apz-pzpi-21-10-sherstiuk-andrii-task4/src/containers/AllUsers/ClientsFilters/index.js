import React from "react";
import { Field } from "react-final-form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Filter from "../../../components/Filters/Filter";

const ClientsFilters = ({ chooseRole }) => {
  const { t } = useTranslation();

  return (
    <>
      <Filter
        filterParagraph={t("clientsPage.filters.sportType.paragraph")}
      >
        <label htmlFor="sport_type">
          <Field
            name="sport_type"
            component="input"
            type="checkbox"
            value="skiing"
          />
          {" "}
          {t("clientsPage.filters.sportType.skiing")}
        </label>
        <label htmlFor="sport_type">
          <Field
            name="sport_type"
            component="input"
            type="checkbox"
            value="snowboarding"
          />
          {" "}
          {t("clientsPage.filters.sportType.snowboarding")}
        </label>
        <label htmlFor="sport_type">
          <Field
            name="sport_type"
            component="input"
            type="checkbox"
            value="snowkiting"
          />
          {" "}
          {t("clientsPage.filters.sportType.snowkiting")}
        </label>
      </Filter>

      <Filter
        filterParagraph={t("clientsPage.filters.age.paragraph")}
      >
        <label htmlFor="age">
          {t("clientsPage.filters.from")}
          {" "}
          <Field
            name="minAge"
            component="input"
            type="text"
          />
        </label>
        <label htmlFor="age">
          {t("clientsPage.filters.to")}
          {" "}
          <Field
            name="maxAge"
            component="input"
            type="text"
          />
        </label>
      </Filter>

      <Filter
        filterParagraph={t("clientsPage.filters.experience.paragraph")}
      >
        <label htmlFor="experience">
          {t("clientsPage.filters.from")}
          {" "}
          <Field
            name="minExp"
            component="input"
            type="text"
          />
        </label>
        <label htmlFor="experience">
          {t("clientsPage.filters.to")}
          {" "}
          <Field
            name="maxExp"
            component="input"
            type="text"
          />
        </label>
      </Filter>

      { chooseRole === "coach"
        ? (
          <Filter
            filterParagraph={t("clientsPage.filters.price.paragraph")}
          >
            <label htmlFor="price">
              {t("clientsPage.filters.from")}
              {" "}
              <Field
                name="minPrice"
                component="input"
                type="text"
              />
            </label>
            <label htmlFor="price">
              {t("clientsPage.filters.to")}
              {" "}
              <Field
                name="maxPrice"
                component="input"
                type="text"
              />
            </label>
          </Filter>
        ) : ""}

      <Filter
        filterParagraph={t("clientsPage.sorting.paragraph")}
      >
        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="fromMinAge"
          />
          {" "}
          {t("clientsPage.sorting.fromMinAge")}
        </label>
        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="fromMaxAge"
          />
          {" "}
          {t("clientsPage.sorting.fromMaxAge")}
        </label>

        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="fromMinExp"
          />
          {" "}
          {t("clientsPage.sorting.fromMinExp")}
        </label>
        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="fromMaxExp"
          />
          {" "}
          {t("clientsPage.sorting.fromMaxExp")}
        </label>

        {chooseRole === "coach"
          ? (
            <>
              <label htmlFor="continents">
                <Field
                  name="sort_by"
                  component="input"
                  type="radio"
                  value="fromMinPrice"
                />
                {" "}
                {t("clientsPage.sorting.fromMinPrice")}
              </label>
              <label htmlFor="continents">
                <Field
                  name="sort_by"
                  component="input"
                  type="radio"
                  value="fromMaxPrice"
                />
                {" "}
                {t("clientsPage.sorting.fromMaxPrice")}
              </label>
            </>
          )
          : ""}
      </Filter>
    </>
  );
};

ClientsFilters.propTypes = {
  chooseRole: PropTypes.string,
};

export default ClientsFilters;
