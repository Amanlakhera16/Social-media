import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadIcon from "../images/loading.gif";
import { imageShow, videoShow } from "../utils/mediaShow";
import AnonPostModal from "./AnonPostModal";
import { BASE_URL } from "../utils/config";

const AnonFeed = () => {
  const { auth, theme } = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const hasMore = useRef(true);
  const isFetching = useRef(false);

  const fetchAnonPosts = useCallback(async (pageNum) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/api/anon_posts?page=${pageNum}&limit=10`, {
        headers: { Authorization: auth.token },
      });
      const newPosts = res.data.posts || [];
      setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
      if (newPosts.length < 10) hasMore.current = false;
    } catch (err) {
      console.error("Failed to fetch anon posts:", err.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [auth.token]);

  useEffect(() => {
    fetchAnonPosts(page);
  }, [page, fetchAnonPosts]);

  const handlePostCreated = () => {
    setShowModal(false);
    setPage(1);
    hasMore.current = true;
    fetchAnonPosts(1);
  };

  return (
    <div className="anon_feed_wrapper">
      {/* Header */}
      <div className="anon_feed_header">
        <div className="anon_feed_title">
          <span className="anon_feed_icon">👻</span>
          <div>
            <h5>Anonymous Zone</h5>
            <p>Posts shared without identity — a safe space to express freely.</p>
          </div>
        </div>
        <button className="anon_post_fab" onClick={() => setShowModal(true)}>
          + Post Anonymously
        </button>
      </div>

      {/* Posts */}
      <div className="anon_posts_list">
        {posts.length === 0 && !loading && (
          <div className="anon_empty_state">
            <span className="anon_empty_icon">🌌</span>
            <h6>The void is quiet...</h6>
            <p>Be the first to share something anonymously.</p>
            <button className="anon_post_fab" onClick={() => setShowModal(true)}>
              Post Anonymously
            </button>
          </div>
        )}

        {posts.map((post) => (
          <div key={post._id} className="anon_post_card outer-shadow" style={{ background: theme ? "#1a1a2e" : "#fff" }}>
            {/* Anonymous badge */}
            <div className="anon_card_header">
              <div className="anon_user_row">
                <div className="anon_ghost_avatar_sm">👻</div>
                <div>
                  <span className="anon_username_sm">Anonymous</span>
                  <span className="anon_time_sm">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
              <span className="anon_badge">🔒 Anonymous</span>
            </div>

            {post.content && (
              <p className="anon_post_content" style={{ color: theme ? "#ddd" : "#222" }}>
                {post.content}
              </p>
            )}

            {post.images && post.images.length > 0 && (
              <div className="anon_post_images">
                {post.images[0].url?.match(/video/i)
                  ? videoShow(post.images[0].url, theme)
                  : imageShow(post.images[0].url, theme)}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-center my-4">
            <img src={LoadIcon} alt="loading" style={{ width: "40px" }} />
          </div>
        )}

        {!loading && hasMore.current && posts.length > 0 && (
          <div className="text-center my-4">
            <button
              className="btn btn-outline-secondary px-4"
              style={{ borderRadius: "20px" }}
              onClick={() => setPage((p) => p + 1)}
            >
              Load More
            </button>
          </div>
        )}

        {!hasMore.current && posts.length > 0 && (
          <p className="text-center text-muted my-4">You've seen it all 👻</p>
        )}
      </div>

      {showModal && (
        <AnonPostModal onClose={handlePostCreated} />
      )}
    </div>
  );
};

export default AnonFeed;
