import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { updateProfileUser } from "../../redux/actions/profileAction";
import { checkImage } from "../../utils/imageUpload";
import AvatarCreator from "../AvatarCreator";
import '../../styles/ai_avatar.css';

const EditProfile = ({ setOnEdit }) => {
  const initialState = {
    fullname: "",
    mobile: "",
    address: "",
    website: "",
    story: "",
    gender: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { fullname, mobile, address, website, story, gender } = userData;
  const [avatar, SetAvatar] = useState("");
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    const err = checkImage(file);
    if (err) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }
    SetAvatar(file);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileUser({ userData, avatar, auth }));
    setOnEdit(false);
  };

  return (
    <div className="edit_profile">
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn btn-danger btn_close"
          onClick={() => setOnEdit(false)}
        >
          Close
        </button>
        <div className="info_avatar">
          <img
            alt="profile"
            src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
            style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          />
          <span>
            <i className="fas fa-camera" />
            <p>Change</p>
            <input
              type="file"
              name="file"
              id="file_up"
              accept="image/*"
              onChange={changeAvatar}
            />
          </span>
        </div>

        {/* Avatar Creator prompt/button */}
        <div className="avatar_prompt_banner">
          <span className="avatar_prompt_text">
            {auth.user.hasCustomAvatar
              ? "🎨 You have a custom avatar"
              : "✨ No profile photo? Create a personalized avatar!"}
          </span>
          <button
            type="button"
            className="avatar_prompt_btn"
            onClick={() => setShowAvatarCreator(true)}
          >
            {auth.user.hasCustomAvatar ? "Edit Avatar" : "Create Avatar"}
          </button>
        </div>

        {showAvatarCreator && (
          <AvatarCreator onClose={() => setShowAvatarCreator(false)} />
        )}

        <div className="form_group">
          <label htmlFor="fullname">Full Name</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={handleInput}
            />
            <small
              className="text-danger position-absolute"
              style={{
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              {fullname.length}/25
            </small>
          </div>
        </div>

        <div className="form_group">
          <label htmlFor="mobile">Mobile</label>

          <input
            type="text"
            className="form-control"
            id="mobile"
            name="mobile"
            value={mobile}
            onChange={handleInput}
          />
        </div>

        <div className="form_group">
          <label htmlFor="address">Address</label>

          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={address}
            onChange={handleInput}
          />
        </div>

        <div className="form_group">
          <label htmlFor="website">Website</label>

          <input
            type="text"
            className="form-control"
            id="website"
            name="website"
            value={website}
            onChange={handleInput}
          />
        </div>

        <div className="form_group">
          <label htmlFor="story">Story</label>

          <textarea
            cols="30"
            rows="4"
            type="text"
            className="form-control"
            id="story"
            name="story"
            value={story}
            onChange={handleInput}
          />

          <small className="text-danger d-block text-right">
            {story.length}/200
          </small>
        </div>

        <label htmlFor="gender">Gender</label>
        <div className="input-group-prepend px-0 mb-4">
          <select
            className="custom-select text-capitalize"
            name="gender"
            id="gender"
            onChange={handleInput}
            value={gender}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button className="btn btn-info w-100" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
