import React from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";

import "./index.scss";

const UserField = ({
  name, type, label, disabled, initialValue,
}) => (
  <Field name={name} initialValue={initialValue}>
    {({ input, meta }) => (
      <div className="user-block">
        <label htmlFor={name}>{label}</label>

        <input
          {...input}
          name={name}
          id={name}
          placeholder={name}
          className="user-block__input"
          type={type}
          disabled={disabled}
        />

        {meta.error && meta.touched && <span>{meta.error}</span>}
      </div>
    )}
  </Field>
);

UserField.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UserField;
