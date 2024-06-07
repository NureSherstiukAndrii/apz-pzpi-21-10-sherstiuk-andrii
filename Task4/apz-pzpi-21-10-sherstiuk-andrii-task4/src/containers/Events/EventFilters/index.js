import React from "react";
import { Field } from "react-final-form";
import { useTranslation } from "react-i18next";

import Filter from "../../../components/Filters/Filter";

const EventFilters = () => {
  const { t } = useTranslation();

  return (
    <>
      <Filter
        filterParagraph={t("eventsPage.filters.continent.paragraph")}
      >
        <label htmlFor="continents">
          <Field
            name="continents"
            component="input"
            type="checkbox"
            value="eurasia"
          />
          {" "}
          {t("eventsPage.filters.continent.eurasia")}
        </label>
        <label htmlFor="continents">
          <Field
            name="continents"
            component="input"
            type="checkbox"
            value="north_america"
          />
          {" "}
          {t("eventsPage.filters.continent.north_america")}
        </label>
        <label htmlFor="continents">
          <Field
            name="continents"
            component="input"
            type="checkbox"
            value="south_america"
          />
          {" "}
          {t("eventsPage.filters.continent.south_america")}
        </label>
        <label htmlFor="continents">
          <Field
            name="continents"
            component="input"
            type="checkbox"
            value="australia"
          />
          {" "}
          {t("eventsPage.filters.continent.australia")}
        </label>
        <label htmlFor="continents">
          <Field
            name="continents"
            component="input"
            type="checkbox"
            value="africa"
          />
          {" "}
          {t("eventsPage.filters.continent.africa")}
        </label>
      </Filter>

      <Filter
        filterParagraph={t("eventsPage.filters.sportType.paragraph")}
      >
        <label htmlFor="sportType">
          <Field
            name="sport_type"
            component="input"
            type="checkbox"
            value="skiing"
          />
          {" "}
          {t("eventsPage.filters.sportType.skiing")}
        </label>
        <label htmlFor="continents">
          <Field
            name="sport_type"
            component="input"
            type="checkbox"
            value="snowboarding"
          />
          {" "}
          {t("eventsPage.filters.sportType.snowboarding")}
        </label>
        <label htmlFor="continents">
          <Field
            name="sport_type"
            component="input"
            type="checkbox"
            value="snowkiting"
          />
          {" "}
          {t("eventsPage.filters.sportType.snowkiting")}
        </label>
      </Filter>

      <Filter
        filterParagraph={t("eventsPage.sorting.paragraph")}
      >
        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="fromMinPeople"
          />
          {" "}
          {t("eventsPage.sorting.fromMinPeople")}
        </label>
        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="fromMaxPeople"
          />
          {" "}
          {t("eventsPage.sorting.fromMaxPeople")}
        </label>
        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="earliestStartDate"
          />
          {" "}
          {t("eventsPage.sorting.earliestStartDate")}
        </label>
        <label htmlFor="continents">
          <Field
            name="sort_by"
            component="input"
            type="radio"
            value="furthestStartDate"
          />
          {" "}
          {t("eventsPage.sorting.furthestStartDate")}
        </label>
      </Filter>
    </>
  );
};

export default EventFilters;
