import React from "react";
import { Field, Form } from "react-final-form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import "./index.scss";

const PostForm = React.memo(({
  changeFormView, onSubmit, initialValues, buttonName,
}) => {
  const { t } = useTranslation();

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className="post-form">
          <button type="button" onClick={changeFormView} className="post-form-close-btn">X</button>
          <div className="post-form-item">
            <span>{t("accountPage.posts.topic")}</span>
            <Field
              name="topic"
              component="textarea"
              rows="5"
              cols="33"
              placeholder="..."
            />
          </div>
          <div className="post-form-item">
            <span>{t("accountPage.posts.text")}</span>
            <Field
              name="text"
              component="textarea"
              rows="5"
              cols="33"
              placeholder="..."
            />
          </div>

          <button type="submit" className="send-post-btn">{buttonName}</button>
        </form>
      )}
    />
  );
});

PostForm.propTypes = {
  changeFormView: PropTypes.func,
  onSubmit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object,
  buttonName: PropTypes.string,
};

export default PostForm;
