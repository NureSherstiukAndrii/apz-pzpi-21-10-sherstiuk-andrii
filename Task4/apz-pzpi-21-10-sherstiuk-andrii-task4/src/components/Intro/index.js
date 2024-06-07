import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const Intro = ({ paragraph, text, backgroundImage }) => {
  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
  };

  return (
    <div className="intro" style={divStyle}>
      <div className="intro__content">
        <span className="intro__content__paragraph">{paragraph}</span>
        <span className="intro__content__desc">{text}</span>
      </div>
    </div>
  );
};

Intro.propTypes = {
  paragraph: PropTypes.string,
  text: PropTypes.string,
  backgroundImage: PropTypes.string,
};

export default Intro;
