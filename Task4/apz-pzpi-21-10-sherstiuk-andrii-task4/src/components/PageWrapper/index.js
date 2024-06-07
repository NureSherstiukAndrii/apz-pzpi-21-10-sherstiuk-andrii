import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const PageWrapper = ({ children, className }) => (
  <div className={`page-wrapper ${className}`}>
    {children}
  </div>
);

PageWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default PageWrapper;
