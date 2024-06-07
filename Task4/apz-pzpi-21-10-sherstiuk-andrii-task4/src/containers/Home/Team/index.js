import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import team from "./consts";
import sliderSettings from "./sliderSettings";
import feedback from "../../../assets/people-feedback/Andrey_Sherstyuk.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.scss";

const Team = () => {
  const { t } = useTranslation();

  return (
    <div className="team__wrapper">
      <h1>{t("homepage.team.paragraph")}</h1>
      <Slider {...sliderSettings}>
        {team.map(({
          id,
          teammate,
        }) => (
          <div key={id} className="team__container">
            <div className="team__container__info">
              <div className="team__container__info__user">
                <img src={feedback} alt="user" />
                <div>
                  <span>{t(`homepage.team.${teammate}.name`)}</span>
                  <span>{t(`homepage.team.${teammate}.position`)}</span>
                </div>
              </div>

              <span>{t(`homepage.team.${teammate}.text`)}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Team;
