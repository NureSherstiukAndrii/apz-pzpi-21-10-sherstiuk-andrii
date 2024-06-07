import React from "react";

import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompaniesList from "./CompaniesList";

import "./index.scss";

const Companies = () => (
  <PageWrapper>
    <Header />
    <div className="event-list-wrapper">
      <CompaniesList />
    </div>
    <Footer />
  </PageWrapper>
);

export default Companies;
