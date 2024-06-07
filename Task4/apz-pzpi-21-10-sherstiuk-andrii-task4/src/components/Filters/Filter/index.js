import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

import { ReactComponent as DownArrow } from "../../../assets/arrows/arrow-down.svg";

import "./index.scss";

const Filter = ({
  filterParagraph, children,
}) => {
  const [viewFilter, setViewFilter] = useState(false);

  const changeFilterView = () => {
    setViewFilter((prev) => !prev);
  };

  return (
    <>
      <div className="filter-item">
        <span>{filterParagraph}</span>
        <CSSTransition
          in={viewFilter}
          timeout={300}
          classNames="filter-arrow"
        >
          <DownArrow onClick={changeFilterView} />
        </CSSTransition>
      </div>

      <CSSTransition
        in={viewFilter}
        timeout={300}
        classNames="filter-animation"
        unmountOnExit
      >
        <div className="filter-item-options">{children}</div>
      </CSSTransition>
    </>
  );
};

Filter.propTypes = {
  filterParagraph: PropTypes.string,
  children: PropTypes.node,
};

export default Filter;
