import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { createPost } from "../redux/actions/postAction";
import { imageUpload } from "../utils/imageUpload";
import { imageShow, videoShow } from "../utils/mediaShow";
import { patchDataAPI } from "../utils/fetchData";
import axios from "axios";

const AnonPostModal = ({ onClose }) => {
  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChangeImages = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];
    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");
      if (file.size > 1024 * 1024 * 5) return (err = "Image size must be less than 5 mb.");
      return newImages.push(file);
    });
    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const arr = [...images];
    arr.splice(index, 1);
    setImages(arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Add text or image(s)." } });
    }

    setLoading(true);
    try {
      let media = [];
      if (images.length > 0) media = await imageUpload(images);

      await axios.post("/api/anon_post", { content, images: media }, {
        headers: { Authorization: auth.token }
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: "Anonymous post shared!" } });
      onClose();
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Failed to post anonymously." } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anon_modal_overlay">
      <div className="anon_modal_card" style={{ background: theme ? "#1a1a2e" : "#fff" }}>
        <div className="anon_modal_header">
          <div className="anon_title_row">
            <span className="anon_ghost_icon">👻</span>
            <h5>Post Anonymously</h5>
          </div>
          <button className="anon_close_btn" onClick={onClose}>×</button>
        </div>

        <div className="anon_notice">
          <span>🔒</span> Your identity will not be attached to this post.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="anon_user_row">
            <div className="anon_ghost_avatar">👻</div>
            <span className="anon_username">Anonymous</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something freely... no one will know it's you."
            className="anon_textarea"
            style={{
              background: theme ? "rgba(255,255,255,0.05)" : "#f8f9fa",
              color: theme ? "#eee" : "#111",
            }}
          />

          <div className="anon_images_preview">
            {images.map((img, i) => (
              <div key={i} className="anon_file_img">
                {img.url
                  ? img.url.match(/video/i) ? videoShow(img.url) : imageShow(img.url)
                  : img.type?.match(/video/i)
                    ? videoShow(URL.createObjectURL(img))
                    : imageShow(URL.createObjectURL(img))}
                <span onClick={() => deleteImage(i)}>×</span>
              </div>
            ))}
          </div>

          <div className="anon_toolbar">
            <label htmlFor="anon_file" className="anon_upload_btn">
              📷 Add Photo/Video
              <input
                id="anon_file"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleChangeImages}
                style={{ display: "none" }}
              />
            </label>
            <button type="submit" className="anon_submit_btn" disabled={loading}>
              {loading ? "Posting..." : "👻 Share Anonymously"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnonPostModal;
