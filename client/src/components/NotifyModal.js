import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import moment from 'moment';
import { deleteAllNotifies, isReadNotify, NOTIFY_TYPES } from '../redux/actions/notifyAction';

const NotifyModal = () => {
    const { auth, notify } = useSelector(state => state);
    const dispatch = useDispatch();

    const handleIsRead = (msg) => {
      dispatch(isReadNotify({msg, auth}));
    };

    const handleDeleteAll = () => {
      const newArr = notify.data.filter(item => item.isRead === false)
      if(newArr.length === 0) return dispatch(deleteAllNotifies(auth.token))

      if(window.confirm(`You have ${newArr.length} unread notifications.Do you want to delete all notifications?`)){
        return dispatch(deleteAllNotifies(auth.token))
      }
    };

    const handleSound = () => {
      dispatch({type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notify.sound });
    };

    return (
      <div className="notify_modal mt-1">
        <div className="notify_header d-flex justify-content-between align-items-center">
          <h3>Notifications</h3>
          <div className="d-flex align-items-center">
            {notify.sound ? (
              <i
                className="fas fa-bell text-danger me-3"
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
                onClick={handleSound}
              />
            ) : (
              <i
                className="fas fa-bell-slash text-danger me-3"
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
                onClick={handleSound}
              />
            )}
            <i 
              className="fas fa-times text-dark d-md-none" 
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => document.body.click()}
              title="Close Notifications"
            />
          </div>
        </div>
        <hr className="mt-1" />
        {notify.data.length === 0 && (
          <span className="text-muted w-100 text-center">No Notifications</span>
        )}
        <div className="notify_list">
          {notify.data.map((msg, index) => (
            <div className={`notify_item px-2 mb-3 ${!msg.isRead ? "unread" : ""}`} key={index}>
              <Link
                to={`${msg.url}`}
                style={{ textDecoration: "none" }}
                className="d-flex text-dark align-items-center"
                onClick={() => handleIsRead(msg)}
              >
                <Avatar src={msg.user.avatar} size="big-avatar" />

                <div className="flex-fill mx-1">
                  <div>
                    <strong className="mr-1">{msg.user.username}</strong>
                    <span>{msg.text}</span>
                  </div>
                  {msg.content && <small>{msg.content.slice(0, 20)}...</small>}
                </div>
                <div style={{ width: "30px" }}>
                  {msg.image && <Avatar src={msg.image} size="medium-avatar" />}
                </div>
              </Link>
              <small className="text-muted d-flex justify-content-between px-2">
                {moment(msg.createdAt).fromNow()}
                {!msg.isRead && <i className="fas fa-circle color-c1" />}
              </small>
            </div>
          ))}
        </div>
        <hr className="my-1" />
        <div
          className="notify_footer text-end my-auto me-2 color-c1"
          style={{ cursor: "pointer" }}
          onClick={handleDeleteAll}
        >
          Delete
        </div>
      </div>
    );
}

export default NotifyModal
