import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '../Avatar';
import EditProfile from './EditProfile';
import FollowBtn from '../FollowBtn';
import Following from './Following';
import Followers from './Followers';
import ChangePassword from './ChangePassword';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Info = ({id, auth, profile, dispatch}) => {
    const [userData, setUserData] = useState([]);
    const [onEdit, setOnEdit] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const history = useHistory();
    const currentUserId = auth?.user?._id;

    useEffect(() => {
      if (!currentUserId) return;

      if (id === currentUserId) {
          setUserData([auth.user]);
      }else{
        const newData = profile.users.filter(user => user._id === id);
        setUserData(newData);
      }
    }, [id, auth, currentUserId, dispatch, profile.users]);

    useEffect(() => {
      if (showFollowers || showFollowing || onEdit) {
        dispatch({ type: GLOBALTYPES.MODAL, payload: true });
      } else {
        dispatch({ type: GLOBALTYPES.MODAL, payload: false });
      }
    }, [showFollowers, showFollowing, onEdit, dispatch]);

    if (!auth?.user) return null;

    return (
      <div className="info">
        {userData.map((user) => (
          <div key={user._id} className="info_container profile_header">
            <div className="profile_avatar_wrap outer-shadow">
              <Avatar src={user.avatar} size="supper-avatar" />
            </div>

            <div className="info_content profile_meta">
              <div className="info_content_title profile_title_row">
                <h2>{user.username}</h2>
                {user._id === currentUserId ? (
                  <>
                  <button
                    className="btn-1 outer-shadow hover-in-shadow"
                    onClick={() => setOnEdit(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn-1 outer-shadow hover-in-shadow ml-3"
                    onClick={() => setChangePassword(true)}
                  >
                    change password
                  </button>
                  </>
                ) : (
                  <>
                  <FollowBtn user={user} />
                  <button className="btn-1 outer-shadow hover-in-shadow ml-3"
                  style={{borderRadius: '5px'}}
                  onClick={() => history.push(`/message/${user._id}`)}>
                      Message
                  </button>
                  </>
                )}
              </div>

              <div className="follow_btn profile_stats">
                <span className="mr-4" onClick={() => setShowFollowers(true)}>
                  {user.followers.length} Followers
                </span>
                <span className="ml-4" onClick={() => setShowFollowing(true)}>
                  {user.following.length} Following
                </span>
              </div>

              <h6 className="profile_name">
                {user.fullname}{" "}
                <span className="color-violet">{user.mobile}</span>
              </h6>
              <p className="m-0">{user.address}</p>
              <h6 className="profile_email">{user.email}</h6>
              <a
                style={{ textDecoration: "none" }}
                href={user.website}
                target="_blank"
                rel="noreferrer"
              >
                {user.website}
              </a>
              <p className="profile_bio">{user.story}</p>
            </div>

            {onEdit && <EditProfile setOnEdit={setOnEdit} />}
            {changePassword && <ChangePassword setChangePassword={setChangePassword} />}

            {showFollowers && (
              <Followers
                users={user.followers}
                setShowFollowers={setShowFollowers}
              />
            )}
            {showFollowing && (
              <Following
                users={user.following}
                setShowFollowing={setShowFollowing}
              />
            )}
          </div>
        ))}
      </div>
    );
}

export default Info;
