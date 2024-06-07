import aboutUsTrans from "./aboutUsTrans";
import homePage from "./homePage";
import eventsPageTrans from "./eventsPageTrans";
import clientsPageTrans from "./clientsPageTrans";
import eventPageTrans from "./eventPageTrans";
import accountPageTrans from "./accountPageTrans";
import clientPageTrans from "./clientPageTrans";
import regPageTrans from "./regPageTrans";
import theBestTrans from "./theBestTrans";

const translationsUa = {
  header: {
    nav: {
      paragraph: "Українська мова",
      companies: "Компанії",
      about: "Про нас",
      events: "Події",
      clients: "Клієнти",
      account: "Профіль",
      the_best: "Найкращі",
    },
    btns: {
      login: "Увійти",
      logout: "Вийти",
    },
  },
  homepage: homePage,
  aboutUsPage: aboutUsTrans,
  filterBlock: {
    name: "Фільтри",
    button: "Застосувати фільтри",
    resetButton: "Скинути фільтри",
  },
  eventsPage: eventsPageTrans,
  clientsPage: clientsPageTrans,
  eventPage: eventPageTrans,
  accountPage: accountPageTrans,
  clientPage: clientPageTrans,
  loginPage: {
    paragraph: "Увійти",
    mail: "пошта",
    password: "пароль",
  },
  regPage: regPageTrans,
  theBestPage: theBestTrans,
};

export default translationsUa;
