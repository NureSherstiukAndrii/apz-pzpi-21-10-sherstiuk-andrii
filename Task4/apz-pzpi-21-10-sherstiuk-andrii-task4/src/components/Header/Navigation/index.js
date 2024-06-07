import React from "react";
import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import logout from "../../../utils/auth/logout";
import checkToken from "../../../utils/auth/checkToken";

const Navigation = ({
  isOpen, closeMenu, className, hasLogin,
}) => {
  const { t } = useTranslation();

  const links = [
    {
      to: "/events",
      i18: "events",
    },
    {
      to: "/clients",
      i18: "clients",
    },
    {
      to: "/companies",
      i18: "companies",
    },
    {
      to: "/the_best",
      i18: "the_best",
    },
    {
      to: "/account",
      i18: "account",
    },
  ];

  return (
    <ul className={className}>
      {links.map(({ to, i18 }) => (
        <NavLink key={i18} to={to}>{t(`header.nav.${i18}`)}</NavLink>
      ))}
      {/* eslint-disable-next-line no-nested-ternary */}
      {hasLogin
        ? (checkToken() !== null
          ? <Link to="/login" className="header__login__block__log" onClick={logout}>{t("header.btns.logout")}</Link>
          : <Link to="/login" className="header__login__block__log">{t("header.btns.login")}</Link>)
        : null}

      {isOpen && <button type="button" className="close-menu" onClick={closeMenu}>X</button>}
    </ul>
  );
};

Navigation.propTypes = {
  isOpen: PropTypes.bool,
  closeMenu: PropTypes.func,
  className: PropTypes.string,
  hasLogin: PropTypes.bool,
};

export default Navigation;
