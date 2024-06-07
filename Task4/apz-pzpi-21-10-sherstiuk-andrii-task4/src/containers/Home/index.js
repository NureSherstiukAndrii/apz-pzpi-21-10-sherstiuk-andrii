import React from "react";
import { useTranslation } from "react-i18next";

import Team from "./Team";
import Feedbacks from "./Feedbacks";
import Header from "../../components/Header";
import Intro from "../../components/Intro";
import FeedbackForm from "./FeedbackForm";
import Footer from "../../components/Footer";
import mountains from "../../assets/mountains.jpg";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <Intro
        paragraph={t("homepage.intro_paragraph")}
        text={t("homepage.intro_sentence")}
        backgroundImage={mountains}
      />
      <Team />
      <Feedbacks />
      <FeedbackForm />
      <Footer />
    </>
  );
};

export default Home;
