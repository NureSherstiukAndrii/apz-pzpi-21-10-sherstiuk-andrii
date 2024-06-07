import React, { useState, useEffect } from "react";
import { Form } from "react-final-form";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { CSSTransition } from "react-transition-group";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

import PageWrapper from "../../components/PageWrapper";
import Header from "../../components/Header";
import Posts from "../../components/Posts";
import MyHistory from "./MyHistory";
import ListOfClients from "./ListOfClients";
import ListOfCoaches from "./ListOfCoaches";
import accountFields from "./UserField/constants";
import Footer from "../../components/Footer";
import UserField from "./UserField";
import checkToken from "../../utils/auth/checkToken";
import ListWrapper from "../../components/ListWrapper";
import DeleteModal from "./DeleteModal";
import toastSuccess from "../../utils/toast/toastSuccess";
import toastError from "../../utils/toast/toastError";
import user from "../../assets/free-icon-user-7630236.png";

import "./index.scss";

const Account = () => {
  const { t } = useTranslation();
  const [isFormReadonly, setIsFormReadonly] = useState(true);
  const [viewClientsList, setViewClientsList] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [companyInfo, setCompanyInfo] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/company/getAuthCompany", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setCompanyInfo(response.data);
      })
      .catch(() => {
        localStorage.clear();
      });

    axios.get("http://localhost:5000/api/authUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch(() => {
        localStorage.clear();
      });
  }, [token]);

  const changeViewHistory = () => {
    setViewHistory((prev) => !prev);
  };

  const changeModalView = () => {
    setViewModal((prev) => !prev);
  };

  const changeUserData = (values) => {
    const newData = {
      ...values,
      token,
    };

    axios.patch("http://localhost:5000/api/changeUserData", newData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUserInfo(response.data.updated);
        toastSuccess(response.data.message);
      })
      .catch(() => {
        toastError("???");
      });
  };

  const handleClientListView = () => {
    setViewClientsList((prev) => !prev);
  };

  const isEmpty = (obj) => {
    // Check if obj is undefined or null
    if (obj === undefined || obj === null) {
      return true;
    }
    // Check if obj is an object and has no keys
    return typeof obj === "object" && Object.keys(obj).length === 0;
  };

  const regDate = userInfo?.reg_date ? new Date(userInfo.reg_date) : null;

  return (
    <>
      {viewModal && <DeleteModal closeModal={changeModalView} token={token} />}
      <PageWrapper className={viewModal ? "blur" : ""}>
        <ToastContainer style={{ width: "330px" }} />
        <Header />
        {checkToken() === null ? (
          <div className="link-log-wrapper">
            <div className="link-log">
              <span>{t("accountPage.noRegBlock.phrase")}</span>
              <span>
                {t("accountPage.noRegBlock.beforeBtn")}
                <Link to="/login" className="link-log-btn">{t("accountPage.noRegBlock.btn")}</Link>
              </span>
            </div>
          </div>
        ) : (
          <>
            {!isEmpty(userInfo) ? (
              <>
                <div className="account-wrapper">
                  <div className="img-wrapper">
                    <img key={user} src={user} className="account-wrapper__photo" alt="user" />
                  </div>
                  <Form
                    onSubmit={changeUserData}
                    render={({ handleSubmit, invalid }) => (
                      <form onSubmit={handleSubmit} className="account-form">
                        <UserField
                          name="role"
                          type="text"
                          label={t("accountPage.role")}
                          initialValue={userInfo.role}
                          disabled={isFormReadonly}
                        />

                        {userInfo.role === "coach" ? (
                          <div className="price-wrapper">
                            <UserField
                              name="price"
                              type="text"
                              label={t("accountPage.price")}
                              initialValue={userInfo.price}
                              disabled={isFormReadonly}
                            />
                            <span>$</span>
                          </div>
                        ) : ""}

                        {accountFields.map(({ name, label }) => (
                          <UserField
                            key={name}
                            name={name}
                            type="text"
                            label={t(`accountPage.${label}`)}
                            initialValue={userInfo[name]}
                            disabled={isFormReadonly}
                          />
                        ))}

                        <UserField
                          name="reg_date"
                          type="text"
                          label={t("accountPage.regDate")}
                          initialValue={regDate !== null ? format(regDate, "dd-MM-yyyy") : ""}
                          disabled
                        />

                        <button
                          onClick={() => setIsFormReadonly((prev) => !prev)}
                          type={isFormReadonly ? "submit" : "button"}
                          disabled={invalid && !isFormReadonly}
                          className="user-form__btn"
                        >
                          {isFormReadonly ? t("accountPage.editBtn") : t("accountPage.saveBtn")}
                        </button>
                        <button
                          type="button"
                          onClick={changeViewHistory}
                        >
                          {t("accountPage.history.seeHistoryBtn")}
                        </button>
                        {userInfo.role === "coach" ? (
                          <button
                            type="button"
                            onClick={handleClientListView}
                          >
                            {t("accountPage.listClients.btn")}
                          </button>
                        ) : ""}
                        <button type="button" onClick={changeModalView}>{t("accountPage.deleteAcc")}</button>
                      </form>
                    )}
                  />
                </div>
                <Posts />
              </>
            ) : (
              !isEmpty(companyInfo) && (
                <>
                  <div className="company-greeting">
                    <h1>Your Profile</h1>
                    <p>
                      Name:
                      {companyInfo.name}
                    </p>
                    <p>
                      Description:
                      {companyInfo.description}
                    </p>
                    <p>
                      Owner:
                      {companyInfo.owner}
                    </p>
                    <p>
                      Mail:
                      {companyInfo.mail}
                    </p>
                    <p>
                      Date of registration:
                      {companyInfo.dateOfCreation}
                    </p>
                  </div>

                  <ListOfCoaches />
                </>
              )
            )}
            <CSSTransition
              in={viewClientsList}
              timeout={500}
              classNames="client-list-animation"
              unmountOnExit
            >
              <ListWrapper closeList={handleClientListView}>
                <ListOfClients />
              </ListWrapper>
            </CSSTransition>
            {viewHistory && (
              <ListWrapper closeList={changeViewHistory}>
                <MyHistory sportType={userInfo.sport_type} />
              </ListWrapper>
            )}
          </>
        )}
        <Footer />
      </PageWrapper>
    </>
  );
};

export default Account;
