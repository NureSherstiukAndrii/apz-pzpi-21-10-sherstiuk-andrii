import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Form } from "react-final-form";

import "./index.scss";

const FormWrapper = ({
  children, onSubmit, linkTo, linkToName, paragraphName,
}) => (
  <div className="form-container">
    <Link className="form-container__paragraph" to="/">SPORTIFY</Link>
    <div className="form-container__wrapper">
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="form">
            <h2 className="form__paragraph">{paragraphName}</h2>
            {children}
            <button type="submit" className="form__btn">{paragraphName}</button>
            <Link to={linkTo} className="form__create-link">{linkToName}</Link>
          </form>
        )}
      />
    </div>
  </div>
);

FormWrapper.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  linkTo: PropTypes.string,
  linkToName: PropTypes.string,
  paragraphName: PropTypes.string,
};

export default FormWrapper;
