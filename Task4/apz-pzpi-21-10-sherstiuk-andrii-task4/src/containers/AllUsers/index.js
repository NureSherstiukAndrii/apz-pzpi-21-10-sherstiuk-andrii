import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import ClientsList from "./ClientsList";
import Filters from "../../components/Filters";
import ClientsFilters from "./ClientsFilters";
import BannedList from "./BannedList";
import Footer from "../../components/Footer";
import checkRole from "../../utils/auth/checkRole";
import filterIcon from "../../assets/filter-icon.png";

import "./index.scss";

const Clients = () => {
  const currentRole = checkRole();
  const [viewFilters, setViewFilters] = useState(false);
  const [userRole, setUserRole] = useState("athlete");
  const [filters, setFilters] = useState({});
  const [viewBannedList, setViewBannedList] = useState(false);

  const toggleFilters = () => {
    setViewFilters((prev) => !prev);
  };

  const setNewFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
  };

  const handleViewBannedList = () => {
    setViewBannedList((prev) => !prev);
  };

  return (
    <PageWrapper>
      <Header />
      {viewBannedList && <BannedList closeList={handleViewBannedList} />}
      <div className="user-list-wrapper">
        {currentRole === "admin"
          ? (
            <button
              type="button"
              className="banned-users-btn"
              onClick={handleViewBannedList}
            >
              Banned users
            </button>
          ) : ""}
        <img src={filterIcon} onClick={toggleFilters} className="event-list-wrapper-img" alt="filter-icon" />
        <CSSTransition
          in={viewFilters}
          timeout={500}
          classNames="filter-mob-animation"
          unmountOnExit
        >
          <Filters className="filters-form__mobile" closeFilters={toggleFilters} updateFilters={setNewFilters}>
            <ClientsFilters chooseRole={userRole} />
          </Filters>
        </CSSTransition>
        <Filters className="filters-form__tablet" updateFilters={setNewFilters}>
          <ClientsFilters chooseRole={userRole} />
        </Filters>
        <ClientsList filtersValues={filters} chooseRole={userRole} handleRole={handleRoleChange} />
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default Clients;
