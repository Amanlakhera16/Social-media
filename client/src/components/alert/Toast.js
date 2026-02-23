import React, { useEffect, useState } from "react";

const STYLES = {
  error: {
    gradient: "linear-gradient(135deg, #ff4e50, #f9284b)",
    icon: "✕",
    iconBg: "rgba(255,255,255,0.20)",
  },
  success: {
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    icon: "✓",
    iconBg: "rgba(255,255,255,0.20)",
  },
};

const Toast = ({ msg, handleShow, bgColor }) => {
  const [visible, setVisible] = useState(false);

  const isSuccess = bgColor === "bg-success";
  const style = isSuccess ? STYLES.success : STYLES.error;

  // trigger entrance animation on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(handleShow, 300); // wait for exit animation
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "380px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
        background: style.gradient,
        color: "#fff",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.9)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px 10px 16px",
        }}
      >
        {/* Icon badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: style.iconBg,
            fontSize: "14px",
            fontWeight: "700",
            flexShrink: 0,
          }}
        >
          {style.icon}
        </span>

        {/* Title */}
        <strong
          style={{
            flex: 1,
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "0.3px",
          }}
        >
          {msg.title}
        </strong>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            background: "rgba(255,255,255,0.20)",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            lineHeight: 1,
            flexShrink: 0,
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.20)")
          }
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.20)",
          margin: "0 16px",
        }}
      />

      {/* Body */}
      <div
        style={{
          padding: "12px 16px 16px 16px",
          fontSize: "14px",
          lineHeight: "1.5",
          opacity: 0.92,
        }}
      >
        {msg.body}
      </div>

      {/* Bottom progress bar (decorative) */}
      <div
        style={{
          height: "3px",
          background: "rgba(255,255,255,0.35)",
          borderRadius: "0 0 16px 16px",
        }}
      />
    </div>
  );
};

export default Toast;
