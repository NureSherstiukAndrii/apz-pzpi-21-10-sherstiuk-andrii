import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const ListWrapper = ({ closeList, children }) => (
  <div className="list-wrapper">
    <button type="button" onClick={closeList} className="list-wrapper__close">X</button>
    {children}
  </div>
);

ListWrapper.propTypes = {
  closeList: PropTypes.func,
  children: PropTypes.node,
};

export default ListWrapper;
