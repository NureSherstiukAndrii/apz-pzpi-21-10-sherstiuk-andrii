import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import formatDate from "../../../utils/formatDate";
import sliderSettings from "./sliderSettings";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.scss";

const CoachComments = ({ coachId }) => {
  const { t } = useTranslation();
  const [coachComments, setCoachComments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/coach/comments/${coachId}`)
      .then((response) => {
        setCoachComments(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="coach-comments">
      <span className="coach-comments-paragraph">{t("clientPage.comments.paragraph")}</span>
      {coachComments.length === 0 ? <div style={{ marginTop: "30px" }}>{t("clientPage.comments.noComments")}</div>
        : (
          <Slider {...sliderSettings}>
            {coachComments.map(({
              id, SenderName, SenderLastname, text, dateOfCreation,
            }) => (
              <div key={id} className="coach-comments-item">
                <div className="coach-comments-item-name">
                  <span>{SenderName}</span>
                  <span>{SenderLastname}</span>
                </div>
                <span>{text}</span>
                <div>
                  <span>{t("clientPage.comments.date")}</span>
                  <span>{formatDate(dateOfCreation)}</span>
                </div>
              </div>
            ))}
          </Slider>
        )}
    </div>
  );
};

CoachComments.propTypes = {
  coachId: PropTypes.string,
};

export default CoachComments;
