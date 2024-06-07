import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import "./index.scss";

const RegUsersList = ({ users }) => {
  const { t } = useTranslation();

  return (
    <div className="registered-users">
      {users?.map(({ id, name, lastname }) => (
        <div key={id} className="registered-user">
          <div>
            <span>{name}</span>
            <span className="registered-user-lastname">{lastname}</span>
          </div>
          <Link to={`/clients/${id}`} className="registered-user-link">{t("eventPage.seeProfile")}</Link>
        </div>
      ))}
    </div>
  );
};

RegUsersList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  users: PropTypes.array,
};

export default RegUsersList;
