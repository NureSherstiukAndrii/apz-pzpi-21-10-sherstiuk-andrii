import React, { useState } from "react";
import axios from "axios";
import { Form, Field } from "react-final-form";
import { ToastContainer } from "react-toastify";
import PropTypes from "prop-types";

import FormField from "../../../components/FormWrapper/Field";
import required from "../../../utils/validators/isRequired";
import generateUniqueFileName from "../../../utils/generateUniqueFileName";
import toastSuccess from "../../../utils/toast/toastSuccess";
import toastError from "../../../utils/toast/toastError";

import "./index.scss";

const EventForm = ({ changeFormView }) => {
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);

  const changeContinent = (value) => {
    setSelectedContinent(value);
  };

  const changeSport = (value) => {
    setSelectedSport(value);
  };

  const addEvent = (values) => {
    const eventData = {
      ...values,
    };

    axios
      .post("http://localhost:5000/events/addEvent", eventData)
      .then((response) => {
        changeFormView();
        toastSuccess(response.data);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch(() => {
        toastError("???");
      });
  };

  return (
    <>
      <ToastContainer style={{ width: "330px" }} />
      <Form
        onSubmit={addEvent}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="event-form">
            <button type="button" onClick={changeFormView}>X</button>
            <FormField
              name="name"
              type="text"
              validators={required}
              placeholder="name"
            />
            <FormField
              name="description"
              type="text"
              validators={required}
              placeholder="description"
            />
            <Field
              name="continent"
              component="select"
              validate={required}
              initialValue={selectedContinent}
              onChange={(event) => { changeContinent(event.target.value); }}
            >
              <option value="" disabled>Continent</option>
              <option value="eurasia">Eurasia</option>
              <option value="north_america">North America</option>
              <option value="south_america">South America</option>
              <option value="australia">Australia</option>
              <option value="africa">Africa</option>
            </Field>
            <Field
              name="sport_type"
              component="select"
              validate={required}
              initialValue={selectedSport}
              onChange={(event) => { changeSport(event.target.value); }}
            >
              <option value="" disabled>Sport Type</option>
              <option value="skiing">skiing</option>
              <option value="snowkiting">snowkiting</option>
              <option value="snowboarding">snowboarding</option>
            </Field>
            <FormField
              name="country"
              type="text"
              validators={required}
              placeholder="country"
            />
            <FormField
              name="city"
              type="text"
              validators={required}
              placeholder="city"
            />
            <FormField
              name="people"
              type="text"
              validators={required}
              placeholder="people"
            />
            <FormField
              name="start_date"
              type="date"
              validators={required}
            />

            <button type="submit">Add event</button>
          </form>
        )}
      />
    </>
  );
};

EventForm.propTypes = {
  changeFormView: PropTypes.func,
};

export default EventForm;
