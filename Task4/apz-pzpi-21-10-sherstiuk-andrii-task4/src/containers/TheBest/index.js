import React from "react";

import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import TableCoachs from "./TableCoachs";
import Footer from "../../components/Footer";

import "./index.scss";

const TheBest = () => (
  <PageWrapper>
    <Header />
    <div className="tables-wrapper">
      <TableCoachs />
    </div>
    <Footer />
  </PageWrapper>
);

export default TheBest;
