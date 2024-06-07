import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./containers/Home";
import Events from "./containers/Events";
import Event from "./containers/Event";
import AllUsers from "./containers/AllUsers";
import Client from "./containers/Client";
import Account from "./containers/Account";
import TheBest from "./containers/TheBest";
import Login from "./containers/LogIn";
import Registration from "./containers/Registration";
import Companies from "./containers/Companies";
import NotFound from "./containers/NotFound";
import Company from "./containers/Company";
import checkTokenExpired from "./utils/auth/checkTokenExpired";

import "./styles/global.scss";
import "./styles/variables.scss";

const App = () => {
  checkTokenExpired();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:eventId" element={<Event />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/company/:companyId" element={<Company />} />
      <Route path="/clients" element={<AllUsers />} />
      <Route path="/clients/:userId" element={<Client />} />
      <Route path="/account" element={<Account />} />
      <Route path="/the_best" element={<TheBest />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
