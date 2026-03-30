import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Info from '../../components/profile/Info';
import Posts from '../../components/profile/Posts';
import { useSelector, useDispatch } from "react-redux";
import LoadIcon  from "../../images/loading.gif";
import { getProfileUsers } from "../../redux/actions/profileAction";
import Saved from '../../components/profile/Saved';
import AvatarCreator from '../../components/AvatarCreator';
import "../../styles/ai_avatar.css";

const Profile = () => {
  const { profile, auth } = useSelector(state => state);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [saveTab, setSaveTab] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const currentUserId = auth?.user?._id;

  useEffect(() => {
    if (!id || !auth?.token) return;

    if(profile.ids.every(item => item !== id )){
      dispatch(getProfileUsers({ id, auth }));

    }
  }, [id, auth, dispatch, profile.ids]);

  if (!auth?.user) return null;

    return (
      <div className="profile">
        <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

        {currentUserId === id && !auth.user.hasCustomAvatar && (
          <div className="avatar_prompt_banner">
            <div className="avatar_prompt_text">
              ✨ You don't have a custom avatar yet! Create one now.
            </div>
            <button className="avatar_prompt_btn" onClick={() => setShowAvatarCreator(true)}>
              🎨 Create Avatar
            </button>
          </div>
        )}

        {currentUserId === id && auth.user.hasCustomAvatar && (
          <div className="text-center mb-3">
             <button className="btn btn-outline-info btn-sm" onClick={() => setShowAvatarCreator(true)}>
               ⚙️ Edit Custom Avatar
             </button>
          </div>
        )}

        {currentUserId === id && (
          <div className="profile_tab">
            <button
              className={saveTab ? "" : "active"}
              onClick={() => setSaveTab(false)}
            >
              posts
            </button>
            <button
              className={saveTab ? "active" : ""}
              onClick={() => setSaveTab(true)}
            >
              saved
            </button>
          </div>
        )}

        {profile.loading ? (
          <img className="d-block mx-auto my-4" src={LoadIcon} alt="Loading" />
        ) : (
          <>
            {
              saveTab
              ? <Saved auth={auth} dispatch={dispatch}  />
              : <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
            }
          </>
        )}

        {showAvatarCreator && (
          <AvatarCreator onClose={() => setShowAvatarCreator(false)} />
        )}
      </div>
    );
}

export default Profile;
