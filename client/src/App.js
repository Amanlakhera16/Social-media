import { BrowserRouter as Router, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import io from 'socket.io-client'

import PageRender from "./customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Alert from "./components/alert/Alert";
import Header from "./components/header/Header";
import StatusModal from "./components/StatusModal";
import { refreshToken } from "./redux/actions/authAction";
import { getPosts } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionsAction";
import { getNotifies } from "./redux/actions/notifyAction";

import AdminDashboard from "./pages/adminDashboard";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import { BASE_URL } from "./utils/config";
import SocketClient from "./SocketClient";


function App() {
  const { auth, status, modal, userType, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    const socket = io(BASE_URL);
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close()
  }, [dispatch]);



  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {

    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
        }
      });
    }
  }, [])

  useEffect(() => {
    const positionDropdown = (dropdownEl) => {
      if (!dropdownEl) return;
      const menu = dropdownEl.querySelector(".dropdown-menu");
      const toggle =
        dropdownEl.querySelector('[data-bs-toggle="dropdown"]') ||
        dropdownEl.querySelector(".dropdown-toggle");
      if (!menu || !toggle) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth <= 768;
      const toggleRect = toggle.getBoundingClientRect();

      menu.style.position = "fixed";
      menu.style.right = "auto";
      menu.style.bottom = "auto";
      menu.style.zIndex = "1055";

      const menuRect = menu.getBoundingClientRect();
      const spaceBelow = viewportHeight - toggleRect.bottom;
      const spaceAbove = toggleRect.top;
      const preferDown = isMobile
        ? spaceBelow >= 120 || spaceBelow >= spaceAbove
        : spaceBelow >= menuRect.height || spaceBelow >= spaceAbove;

      const isNotify = menu.querySelector(".notify_modal");

      if (isMobile && isNotify) {
        const headerEl = document.querySelector(".header");
        const menuBarEl = document.querySelector(".header .menu");
        const headerHeight = headerEl
          ? Math.round(headerEl.getBoundingClientRect().height)
          : 0;
        const menuHeight = menuBarEl
          ? Math.round(menuBarEl.getBoundingClientRect().height)
          : 0;

        const width = Math.min(viewportWidth - 24, 420);
        const left = Math.max(12, (viewportWidth - width) / 2);
        const bottom = Math.max(12, menuHeight + 8);
        const maxHeight = Math.max(
          200,
          viewportHeight - headerHeight - bottom - 8
        );

        menu.classList.remove("drop-up");
        menu.style.top = "auto";
        menu.style.bottom = `${Math.round(bottom)}px`;
        menu.style.left = `${Math.round(left)}px`;
        menu.style.width = `${Math.round(width)}px`;
        menu.style.maxHeight = `${Math.round(maxHeight)}px`;
        menu.style.overflowY = "auto";
        return;
      }

      menu.classList.toggle("drop-up", !preferDown);

      const top = preferDown
        ? toggleRect.bottom + 8
        : Math.max(8, toggleRect.top - menuRect.height - 8);

      const maxHeight = preferDown
        ? viewportHeight - top - 8
        : toggleRect.top - 8;

      const desiredLeft =
        toggleRect.left + toggleRect.width / 2 - menuRect.width / 2;
      const left = Math.min(
        Math.max(8, desiredLeft),
        viewportWidth - menuRect.width - 8
      );

      menu.style.top = `${Math.round(top)}px`;
      menu.style.left = `${Math.round(left)}px`;
      menu.style.maxHeight = `${Math.max(160, Math.round(maxHeight))}px`;
      menu.style.overflowY = "auto";
      menu.style.width = "";
    };

    const handleShown = (event) => {
      positionDropdown(event.target);
    };

    const repositionOpenDropdowns = () => {
      document.querySelectorAll(".dropdown.show").forEach(positionDropdown);
    };

    document.addEventListener("shown.bs.dropdown", handleShown);
    window.addEventListener("resize", repositionOpenDropdowns);
    window.addEventListener("scroll", repositionOpenDropdowns, true);

    return () => {
      document.removeEventListener("shown.bs.dropdown", handleShown);
      window.removeEventListener("resize", repositionOpenDropdowns);
      window.removeEventListener("scroll", repositionOpenDropdowns, true);
    };
  }, []);

   

  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" checked={theme} readOnly />
      <div className={`App ${(status || modal) && "mode"}`}>
        <div className="main">
          {userType === "user" && auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient /> }
          <Route
            exact
            path="/"
            component={
              userType === "user"
                ? auth.token
                  ? Home
                  : Login
                : auth.token
                ? AdminDashboard
                : Login
            }
          />

          {userType === "user" && (
            <>
              <Route exact path="/register" component={Register} />
              <div className="wrap_page">
                <PrivateRouter exact path="/:page" component={PageRender} />
                <PrivateRouter exact path="/:page/:id" component={PageRender} />
              </div>
            </>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
