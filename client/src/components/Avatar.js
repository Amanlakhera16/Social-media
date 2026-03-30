import React from 'react'
import { useSelector } from "react-redux";
import AvatarSVG from './AvatarSVG';

const Avatar = ({ src, size, user }) => {
  const { theme } = useSelector((state) => state);

  // If the user has a custom SVG avatar configured, render it
  if (user && user.hasCustomAvatar && user.avatarConfig) {
    const px = size === 'big_avatar' ? 80 : size === 'medium_avatar' ? 50 : 40;
    return (
      <span className={size} style={{ display: 'inline-block', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        <AvatarSVG config={user.avatarConfig} size={px} />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="Avatar"
      className={size}
      style={{ filter: `${theme ? "invert(1)" : "invert(0)"}` }}
    />
  );
};

export default Avatar
