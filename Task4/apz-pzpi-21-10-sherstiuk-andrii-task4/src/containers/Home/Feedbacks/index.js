import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { useTranslation } from "react-i18next";

import formatDate from "../../../utils/formatDate";
import user from "../../../assets/people-feedback/Andrey_Sherstyuk.jpg";

import "./index.scss";

const Feedbacks = () => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/unAuth/serviceComments")
      .then((response) => {
        setFeedbacks(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <div className="feedbacks-wrapper">
      <h1 className="feedbacks-wrapper__paragraph">{t("homepage.feedbacks.paragraph")}</h1>

      <Marquee className="feedbacks-wrapper__content" gradientWidth={100} gradient speed={25}>
        {feedbacks.map(({
          id, name, lastname, description, date,
        }) => (
          <div key={id} className="feedbacks-wrapper__content__block">
            <div className="username-wrapper">
              <span>{name}</span>
              <span>{lastname}</span>
            </div>
            <span>{description}</span>
            <span>{formatDate(date)}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Feedbacks;
