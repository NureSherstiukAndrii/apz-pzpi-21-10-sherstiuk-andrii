import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import EventsList from "./EventsList";
import Filters from "../../components/Filters";
import EventFilters from "./EventFilters";
import Footer from "../../components/Footer";
import filterIcon from "../../assets/filter-icon.png";

import "./index.scss";

const Events = () => {
  const [viewFilters, setViewFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const toggleFilters = () => {
    setViewFilters((prev) => !prev);
  };

  const setNewFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <PageWrapper>
      <Header />
      <div className="event-list-wrapper">
        <img src={filterIcon} onClick={toggleFilters} className="event-list-wrapper-img" alt="filter-icon" />
        <CSSTransition
          in={viewFilters}
          timeout={500}
          classNames="filter-mob-animation"
          unmountOnExit
        >
          <Filters className="filters-form__mobile" closeFilters={toggleFilters} updateFilters={setNewFilters}>
            <EventFilters />
          </Filters>
        </CSSTransition>
        <Filters className="filters-form__tablet" updateFilters={setNewFilters}>
          <EventFilters />
        </Filters>
        <EventsList filtersValues={filters} />
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default Events;
