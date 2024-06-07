import React from "react";
import { Form, Field } from "react-final-form";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { useTranslation } from "react-i18next";

import "./index.scss";

const SendingForm = ({
  onSubmit, blockName, closeForm, isFormOpen,
}) => {
  const { t } = useTranslation();

  return (
    <CSSTransition
      in={isFormOpen}
      timeout={500}
      classNames="user-list-animation"
      unmountOnExit
    >
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="interaction-form">
            <button type="button" onClick={closeForm} className="interaction-form-close-btn">X</button>
            <span className="interaction-form-paragraph">{blockName}</span>
            <Field name="text">
              {({ input, meta }) => (
                <>
                  <div className="interaction-block">
                    <textarea
                      {...input}
                      className="interaction-block-input"
                      rows="10"
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                  <button
                    type="submit"
                    className="interaction-form-send-btn"
                  >
                    {t("clientPage.sendBtn")}
                  </button>
                </>
              )}
            </Field>
          </form>
        )}
      />
    </CSSTransition>
  );
};

SendingForm.propTypes = {
  onSubmit: PropTypes.func,
  blockName: PropTypes.string,
  closeForm: PropTypes.func,
  isFormOpen: PropTypes.bool,
};

export default SendingForm;
