import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";
import NotifyModal from "../NotifyModal";

const Menu = () => {
  const navLinks = [
    { label: "Home", icon: "home", path: "/" },
    { label: "Message", icon: "near_me", path: "/message" },
    { label: "Discover", icon: "explore", path: "/discover" },
  ];

  const { auth, theme, notify } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const unreadNotifyCount = notify.data.filter((item) => !item.isRead).length;

  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };

  return (
    <div className="menu">
      <ul className="navbar-nav flex-row mb-2 mb-lg-0">
        {navLinks.map((link, index) => (
          <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
            <Link className={`nav-link `} to={link.path}>
              <span className={`material-icons `}>{link.icon}</span>
            </Link>
          </li>
        ))}

        <li className="nav-item dropdown" style={{ opacity: "1" }}>
          <span
            className="nav-link position-relative"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span
              style={{ color: unreadNotifyCount > 0 ? "var(--c1)" : "" }}
              className={`material-icons `}
            >
              notifications
            </span>
            {unreadNotifyCount > 0 && (
              <span className="notify_length">{unreadNotifyCount}</span>
            )}
          </span>

          <div
            className="dropdown-menu notify_dropdown_menu"
            aria-labelledby="navbarDropdown"
            data-bs-display="static"
          >
            <NotifyModal />
          </div>
        </li>

        <li className="nav-item dropdown" style={{ opacity: "1" }}>
          <span
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Avatar src={auth.user.avatar} size="medium-avatar" />
          </span>
          <ul
            className="dropdown-menu profile_dropdown_menu"
            aria-labelledby="navbarDropdown"
            data-bs-display="static"
          >
            <div className="d-flex justify-content-between align-items-center d-md-none mb-4 px-2 profile-mobile-header">
               <h3 className="m-0" style={{ fontWeight: 800 }}>Account</h3>
               <i 
                className="fas fa-times text-dark" 
                style={{ fontSize: "1.8rem", cursor: "pointer" }}
                onClick={() => document.body.click()}
                title="Close Menu"
              />
            </div>
            <li>
              <Link
                style={{ color: "white" }}
                className="dropdown-item"
                to={`/profile/${auth.user._id}`}
              >
                Profile
              </Link>
            </li>
            <li>
              <label
                style={{ color: "white" }}
                htmlFor="theme"
                className="dropdown-item"
                onClick={() => {
                  dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
                  localStorage.setItem("theme", !theme);
                }}
              >
                {theme ? "Light mode" : "Dark mode"}
              </label>
            </li>
            <li>
              <Link
                style={{ color: "white" }}
                className="dropdown-item"
                to="/"
                onClick={() => dispatch(logout())}
              >
                Logout
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
