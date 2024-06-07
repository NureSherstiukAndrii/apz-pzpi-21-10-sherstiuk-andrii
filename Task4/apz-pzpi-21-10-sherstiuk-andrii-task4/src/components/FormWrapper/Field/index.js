import React from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";

import "./index.scss";

const FormField = ({
  name, validators, type, hasButton, viewPassword, togglePassword, placeholder,
}) => (
  <Field name={name} validate={validators}>
    {({ input, meta }) => (
      <div className="form__block">
        <input
          {...input}
          name={name}
          placeholder={placeholder}
          className="form__block-input"
          type={type}
        />

        {
            hasButton
            && (
            <button
              type="button"
              onClick={togglePassword}
              className="show-password"
            >
              {viewPassword ? "hide" : "show"}
            </button>
            )
          }

        {meta.error && meta.touched && <span>{meta.error}</span>}
      </div>
    )}
  </Field>
);

FormField.propTypes = {
  name: PropTypes.string,
  validators: PropTypes.func,
  type: PropTypes.string,
  hasButton: PropTypes.bool,
  viewPassword: PropTypes.bool,
  togglePassword: PropTypes.func,
  placeholder: PropTypes.string,
};

export default FormField;
