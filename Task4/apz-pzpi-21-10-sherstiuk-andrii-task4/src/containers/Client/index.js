import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";
import StarsRating from "../../components/StarsRating";
import Posts from "../../components/Posts";
import SendingForm from "./SendingForm";
import CoachComments from "./CoachComments";
import ReportsList from "./ReportsList";
import Footer from "../../components/Footer";
import toastSuccess from "../../utils/toast/toastSuccess";
import toastError from "../../utils/toast/toastError";
import CheckRole from "../../utils/auth/checkRole";
import user from "../../assets/free-icon-user-7630236.png";

import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

const Client = () => {
  const { t } = useTranslation();
  const currentRole = CheckRole();
  const [userData, setUserData] = useState({});
  const [rating, setRating] = useState(0);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [reportsView, setReportsView] = useState(false);
  const { userId } = useParams();
  const token = localStorage.getItem("token");

  const changeReportFormView = () => {
    setIsReportFormOpen((prev) => !prev);
  };

  const changeFeedbackFormView = () => {
    setIsFeedbackFormOpen((prev) => !prev);
  };

  const changeReportsView = () => {
    setReportsView((prev) => !prev);
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/unAuth/user/${userId}`)
      .then((response) => {
        setUserData(response.data);
      });
  }, [rating]);

  const sendApplication = (coachId) => {
    axios.post(`http://localhost:5000/coach/addClient/${coachId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data);
      })
      .catch((err) => {
        if (err.request.status === 401) {
          toastError("You need to log in");
          return;
        }
        toastError("???");
      });
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
    axios.post("http://localhost:5000/coach/addRating", {
      userId,
      newRating,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data);
      })
      .catch((err) => {
        if (err.request.status === 401) {
          toastError("You need to log in");
          return;
        }
        if (err.request.status === 400) {
          toastError("You have already rated");
          return;
        }
        toastError("???");
      });
  };

  const sendCoachFeedback = (coachId) => (value) => {
    axios.post("http://localhost:5000/api/addCommentToCoach", { value: value.text, coachId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        changeFeedbackFormView();
        toastSuccess(response.data);
      })
      .catch((err) => {
        if (err.request.status === 401) {
          toastError("You need to log in");
          return;
        }
        if (err.request.status === 400) {
          toastError("You have already left a comment");
          return;
        }

        toastError("???");
      });
  };

  const sendReport = (recipientId) => (value) => {
    axios.post("http://localhost:5000/api/addReport", { value: value.text, recipientId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        changeReportFormView();
        toastSuccess(response.data);
      })
      .catch((err) => {
        if (err.request.status === 401) {
          toastError("You need to log in");
          return;
        }
        if (err.request.status === 400) {
          toastError("You have already filed a complaint against the user");
          return;
        }

        toastError("???");
      });
  };

  const banUser = (id) => {
    axios.patch(`http://localhost:5000/api/addBannedUser/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data);
      })
      .catch(() => {
        toastError("???");
      });
  };

  const unbanUser = (id) => {
    axios.patch(`http://localhost:5000/api/deleteBannedUser/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data);
      })
      .catch(() => {
        toastError("???");
      });
  };

  return (
    <>
      <ToastContainer style={{ width: "330px" }} />
      <Header />
      <div className="user-container">
        <img src={user} className="user-container-photo" alt="user" />

        <div className="user-info">
          <span>
            {t("clientPage.name")}
            {userData.name}
          </span>
          <span>
            {t("clientPage.lastname")}
            {userData.lastname}
          </span>
          <span>
            {t("clientPage.role")}
            {userData.role}
          </span>
          {userData.role === "coach" ? (
            <>
              <span>
                {t("clientPage.price")}
                {userData.price}
                $
              </span>
              <span>
                {t("clientPage.rating")}
                <StarsRating
                  ratingChanged={ratingChanged}
                  initialValue={userData.rating}
                />
              </span>
            </>
          ) : ""}
          <span>
            {t("clientPage.age")}
            {userData.age}
          </span>
          <span>
            {t("clientPage.country")}
            {userData.country}
          </span>
          <span>
            {t("clientPage.city")}
            {userData.city}
          </span>
          <span>
            {t("clientPage.specialized")}
            {userData.sport_type}
          </span>
          <span>
            {t("clientPage.experience")}
            {userData.experience}
            {" "}
            years
          </span>
          <span>
            {t("clientPage.contact")}
            {" "}
            {userData.mail}
          </span>
          <div className="user-info-btns">
            {userData.role === "coach" ? (
              <>
                <button
                  type="button"
                  onClick={() => sendApplication(userId)}
                >
                  {t("clientPage.lessonApplicationBtn")}
                </button>
                <button type="button" onClick={changeFeedbackFormView}>{t("clientPage.feedbackParagraph")}</button>
              </>
            ) : ""}
            <button type="button" onClick={changeReportFormView}>{t("clientPage.reportParagraph")}</button>
            {/* eslint-disable-next-line no-nested-ternary */}
            {currentRole === "admin" && (
              <>
                {userData.is_banned
                  ? <button type="button" onClick={() => unbanUser(userId)}>Unban</button>
                  : <button type="button" onClick={() => banUser(userId)}>Ban</button>}
                <button type="button" onClick={changeReportsView}>{t("clientPage.reportList.button")}</button>
              </>
            )}
          </div>
        </div>
      </div>
      {reportsView && <ReportsList userId={userId} closeList={changeReportsView} />}
      <SendingForm
        onSubmit={sendReport(userData.id)}
        closeForm={changeReportFormView}
        blockName={t("clientPage.reportParagraph")}
        isFormOpen={isReportFormOpen}
      />
      <SendingForm
        onSubmit={sendCoachFeedback(userData.id)}
        closeForm={changeFeedbackFormView}
        blockName={t("clientPage.feedbackParagraph")}
        isFormOpen={isFeedbackFormOpen}
      />
      {userData.role === "coach" ? <CoachComments coachId={userId} /> : ""}
      <Posts user userId={userId} />
      <Footer />
    </>
  );
};

export default Client;
