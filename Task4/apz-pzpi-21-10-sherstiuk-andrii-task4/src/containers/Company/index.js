import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import ListWrapper from "../../components/ListWrapper";
import RegUsersList from "./RegUsersList";
import Footer from "../../components/Footer";
import checkRole from "../../utils/auth/checkRole";
import toastError from "../../utils/toast/toastError";
import toastSuccess from "../../utils/toast/toastSuccess";
import companyPng from "../../assets/company.jpg";

import "./index.scss";

const Company = () => {
  const { t } = useTranslation();
  const currentRole = checkRole();
  const [company, setCompany] = useState({});
  const [viewUsersList, setViewUsersList] = useState(false);
  const navigate = useNavigate();
  const { companyId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/company/getCompany/${companyId}`)
      .then((response) => {
        setCompany(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const changeListView = () => {
    setViewUsersList((prev) => !prev);
  };

  const addCoachIntoCompany = () => {
    if (currentRole !== "coach") {
      toastError("You need be a coach");

      return;
    }

    const token = localStorage.getItem("token");
    if (token === null) {
      toastError("You need to log in");
      return;
    }
    axios.post(`http://localhost:5000/company/addCoach/${companyId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data === "You already sent application") {
          toastError(response.data);
          return;
        }

        toastSuccess(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCompany = (id) => {
    axios.delete(`http://localhost:5000/company/deleteCompany/${id}`)
      .then((response) => {
        toastSuccess(response.data);
        setTimeout(() => {
          navigate("/events");
        }, 3000);
      })
      .catch(() => {
        toastError("???");
      });
  };

  return (
    <PageWrapper>
      <ToastContainer style={{ width: "330px" }} />
      <Header />
      <div className="event">
        {currentRole === "admin"
          ? (
            <button
              type="button"
              onClick={() => deleteCompany(companyId)}
              className="event-del-btn"
            >
              {t("eventPage.delEvent")}
            </button>
          ) : ""}
        <img src={companyPng} className="event-img" alt="event" />
        <div className="event-details">
          <div className="event-detail">
            <span>{t("eventPage.name")}</span>
            <span>{company.name}</span>
          </div>
          <div className="event-detail description">
            <span>{t("eventPage.description")}</span>
            <span>
              {company.description}
            </span>
          </div>
          <div className="event-detail">
            <span>{t("eventPage.owner")}</span>
            <span>{company.owner}</span>
          </div>
          <div className="event-detail">
            <span>{t("eventPage.dateOfRegistation")}</span>
            <span>{company.dateOfCreation}</span>
          </div>
          <div className="event-detail">
            <span>{t("eventPage.mail")}</span>
            <span>{company.mail}</span>
          </div>
          <div className="event-detail people">
            <span>{t("eventPage.coaches")}</span>
            {company.registeredUsers?.length !== 0
              ? <button type="submit" onClick={changeListView}>{t("eventPage.coachesBtn")}</button> : ""}
          </div>
          <CSSTransition
            in={viewUsersList}
            timeout={500}
            classNames="user-list-animation"
            unmountOnExit
          >
            <ListWrapper closeList={changeListView}>
              <RegUsersList users={company.companyCoaches} />
            </ListWrapper>
          </CSSTransition>
          <button type="button" onClick={addCoachIntoCompany} className="get-place-btn">
            {t("eventPage.coachesBtnSend")}
          </button>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default Company;
