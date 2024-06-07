import React from "react";

import { ReactComponent as Logo } from "../../assets/logo.svg";
import instagram from "../../assets/social-media/instagram.png";
import telegram from "../../assets/social-media/telegram.png";
import youtube from "../../assets/social-media/youtube.png";
import facebook from "../../assets/social-media/facebook.png";

import "./index.scss";

const Footer = () => (
  <footer className="footer">
    <Logo />
    <span>sportify213@gmail.com</span>
    <div className="footer__social-media">
      <img src={instagram} alt="instagram" />
      <img src={telegram} alt="telegram" />
      <img src={youtube} alt="youtube" />
      <img src={facebook} alt="facebook" />
    </div>
  </footer>
);

export default Footer;
