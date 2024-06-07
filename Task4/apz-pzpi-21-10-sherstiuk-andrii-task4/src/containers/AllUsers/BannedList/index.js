import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

import "./index.scss";

const BannedList = ({ closeList }) => {
  const [bannedUsers, setBannedUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/bannedUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setBannedUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="banned-list">
      <button type="button" onClick={closeList}>X</button>
      {bannedUsers.map(({ id, name, lastname }) => (
        <div className="banned-list-item" key={id}>
          <div className="banned-list-item-details">
            <span>{name}</span>
            <span>{lastname}</span>
          </div>
          <Link to={`/clients/${id}`}>Profile</Link>
        </div>
      ))}
    </div>
  );
};

BannedList.propTypes = {
  closeList: PropTypes.func,
};

export default BannedList;
