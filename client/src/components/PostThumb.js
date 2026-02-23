import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { imageShow, videoShow } from "../utils/mediaShow";

const PostThumb = ({ posts, result }) => {
  const { theme } = useSelector((state) => state);

  if (result === 0 ){
    return <h2 className="text-center color-c1">No Post</h2>
  }

  return (
    <div className="post_thumb">
      {posts && posts.map((post) => {
        const mediaUrl = post?.images?.[0]?.url;
        const isVideo = typeof mediaUrl === "string" && /video/i.test(mediaUrl);

        return (
          <Link to={`/post/${post._id}`} key={post._id}>
            <div className="post_thumb_display">
              {mediaUrl ? (
                isVideo ? videoShow(mediaUrl, theme) : imageShow(mediaUrl, theme)
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center h-100 w-100"
                  style={{
                    minHeight: "220px",
                    background: "rgba(0,0,0,0.06)",
                    color: theme ? "#eee" : "#555",
                  }}
                >
                  No media
                </div>
              )}

              <div className="post_thumb_menu">
                <i className="far fa-thumbs-up">{post?.likes?.length || 0}</i>
                <i className="far fa-comments">{post?.comments?.length || 0}</i>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PostThumb
