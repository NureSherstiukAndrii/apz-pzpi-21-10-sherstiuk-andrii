import React from "react";
import ReactStars from "react-stars";
import PropTypes from "prop-types";

const StarsRating = ({ ratingChanged, initialValue, readOnly }) => (
  <ReactStars
    count={5}
    onChange={ratingChanged}
    size={24}
    color2="#ffd700"
    half={false}
    edit={readOnly}
    value={initialValue}
  />
);

StarsRating.propTypes = {
  ratingChanged: PropTypes.func,
  initialValue: PropTypes.number,
  readOnly: PropTypes.bool,
};

export default StarsRating;
