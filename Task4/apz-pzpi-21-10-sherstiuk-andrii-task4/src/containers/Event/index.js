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
import formatDate from "../../utils/formatDate";
import Footer from "../../components/Footer";
import checkRole from "../../utils/auth/checkRole";
import toastError from "../../utils/toast/toastError";
import toastSuccess from "../../utils/toast/toastSuccess";

import "./index.scss";

const Event = () => {
  const { t } = useTranslation();
  const currentRole = checkRole();
  const [event, setEvent] = useState(null); // Use null as the initial state
  const [viewUsersList, setViewUsersList] = useState(false);
  const navigate = useNavigate();
  const { eventId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/events/event/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event data", error);
      });
  }, [eventId]);

  const changeListView = () => {
    setViewUsersList((prev) => !prev);
  };

  const addUserIntoEvent = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toastError("You need to log in");
      return;
    }

    axios.post(`http://localhost:5000/events/addUserToEvent/${eventId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toastSuccess(response.data.message);
        setEvent((prevEvent) => ({
          ...prevEvent,
          registeredUsers: [
            ...prevEvent.registeredUsers,
            response.data.user,
          ],
        }));
      })
      .catch((err) => {
        console.error("Error adding user to event", err);
        if (err.response && err.response.status === 400) {
          toastError("You already register");
        }
      });
  };

  const deleteEvent = (id) => {
    axios.delete(`http://localhost:5000/events/deleteEvent/${id}`)
      .then((response) => {
        toastSuccess(response.data);
        setTimeout(() => {
          navigate("/events");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting event", error);
        toastError("Error deleting event");
      });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <ToastContainer style={{ width: "330px" }} />
      <Header />
      <div className="event">
        {currentRole === "admin" && (
          <button
            type="button"
            onClick={() => deleteEvent(eventId)}
            className="event-del-btn"
          >
            {t("eventPage.delEvent")}
          </button>
        )}
        <div className="event-details">
          <div className="event-detail">
            <span>{t("eventPage.name")}</span>
            <span>{event.name}</span>
          </div>
          <div className="event-detail description">
            <span>{t("eventPage.description")}</span>
            <span>{event.description}</span>
          </div>
          <div className="event-detail">
            <span>{t("eventPage.sportType")}</span>
            <span>{event.sportType}</span>
          </div>
          <div className="event-detail">
            <span>{t("eventPage.continent")}</span>
            <span>{event.continent}</span>
          </div>
          <div className="event-detail">
            <span>{t("eventPage.country")}</span>
            <span>{event.country}</span>
          </div>
          <div className="event-detail">
            <span>{t("eventPage.city")}</span>
            <span>{event.city}</span>
          </div>
          <div className="event-detail people">
            <span>{t("eventPage.takePart")}</span>
            <span>
              {event.registeredUsers?.length}
              /
              {event.people}
            </span>
            {event.registeredUsers?.length !== 0 && (
              <button type="submit" onClick={changeListView}>
                {t("eventPage.listUsersBtn")}
              </button>
            )}
          </div>
          <CSSTransition
            in={viewUsersList}
            timeout={500}
            classNames="user-list-animation"
            unmountOnExit
          >
            <ListWrapper closeList={changeListView}>
              <RegUsersList users={event.registeredUsers} />
            </ListWrapper>
          </CSSTransition>
          <div className="event-detail">
            <span>{t("eventPage.startDate")}</span>
            <span>{event.start_date ? formatDate(event.start_date) : "N/A"}</span>
          </div>
          <button type="button" onClick={addUserIntoEvent} className="get-place-btn">
            {t("eventPage.getPlace")}
          </button>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default Event;
