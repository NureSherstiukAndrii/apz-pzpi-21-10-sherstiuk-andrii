import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navigation from "./Navigation";
import logout from "../../utils/auth/logout";
import checkToken from "../../utils/auth/checkToken";
import burgerMenu from "../../assets/burger-menu.png";
import { ReactComponent as Logo } from "../../assets/logo.svg";

import "./index.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const currentLanguage = i18n.language;
  return (
    <header className="header">

      <div className="header__logo__wrapper">
        <Link to="/"><Logo /></Link>
        <span>SKIIIIR</span>
      </div>

      <div className="header__burger__menu__nav">
        <img src={burgerMenu} onClick={toggleMenu} className="open__burger__menu" alt="burger-menu-icon" />
      </div>

      <CSSTransition
        in={isMenuOpen}
        timeout={500}
        classNames="menu-animation"
        unmountOnExit
      >
        <Navigation
          isOpen={isMenuOpen}
          closeMenu={toggleMenu}
          className="header__burger__menu"
          hasLogin
        />
      </CSSTransition>

      <Navigation className="header__nav__menu" />

      <div className="language-btns">
        <button
          className={`btn ${currentLanguage === "en" ? "active" : ""}`}
          type="button"
          onClick={() => changeLanguage("en")}
        >
          Eng
        </button>
        <span>/</span>
        <button
          className={`btn ${currentLanguage === "ua" ? "active" : ""}`}
          type="button"
          onClick={() => changeLanguage("ua")}
        >
          Укр
        </button>
      </div>

      {checkToken() !== null
        ? <Link to="/login" className="header__log-btn" onClick={logout}>{t("header.btns.logout")}</Link>
        : <Link to="/login" className="header__log-btn">{t("header.btns.login")}</Link>}
    </header>
  );
};

export default Header;
