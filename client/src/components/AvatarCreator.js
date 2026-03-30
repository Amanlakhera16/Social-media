import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { patchDataAPI } from "../utils/fetchData";
import AvatarSVG from "./AvatarSVG";

const FACE_SHAPES = [
  { id: "circle", label: "Round", emoji: "⭕" },
  { id: "oval", label: "Oval", emoji: "🥚" },
  { id: "square", label: "Square", emoji: "⬜" },
];

const SKIN_TONES = [
  { id: "#FFDBB4", label: "Light" },
  { id: "#FDBCB4", label: "Fair" },
  { id: "#E8AC80", label: "Medium" },
  { id: "#C68642", label: "Tan" },
  { id: "#8D5524", label: "Brown" },
  { id: "#4A2912", label: "Dark" },
];

const HAIR_STYLES = [
  { id: "short", label: "Short", emoji: "💇" },
  { id: "long", label: "Long", emoji: "👱" },
  { id: "curly", label: "Curly", emoji: "🌀" },
  { id: "bald", label: "Bald", emoji: "👨‍🦲" },
];

const HAIR_COLORS = [
  { id: "#1C1C1C", label: "Black" },
  { id: "#3B2314", label: "Dark Brown" },
  { id: "#8B4513", label: "Brown" },
  { id: "#D4A017", label: "Blonde" },
  { id: "#FF4500", label: "Red" },
  { id: "#C0C0C0", label: "Silver" },
];

const EYE_COLORS = [
  { id: "#4A4A4A", label: "Dark" },
  { id: "#4B7ABF", label: "Blue" },
  { id: "#4A7C59", label: "Green" },
  { id: "#8B4513", label: "Brown" },
  { id: "#9B59B6", label: "Violet" },
];

const BG_COLORS = [
  { id: "#E8F4FD", label: "Sky" },
  { id: "#E8FFE8", label: "Mint" },
  { id: "#FFE8F4", label: "Pink" },
  { id: "#FFF8E8", label: "Cream" },
  { id: "#2C2C3E", label: "Dark" },
  { id: "#1A2B4A", label: "Navy" },
];

const AvatarCreator = ({ onClose, onSaved }) => {
  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  const defaultConfig = auth.user.avatarConfig || {
    faceShape: "circle",
    skinTone: "#FDBCB4",
    hairStyle: "short",
    hairColor: "#3B2314",
    eyeColor: "#4A4A4A",
    bgColor: "#E8F4FD",
  };

  const [config, setConfig] = useState(defaultConfig);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setConfig((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await patchDataAPI("user/avatar_config", { avatarConfig: config }, auth.token);
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: res.data.user } });
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: "Avatar saved! 🎨" } });
      if (onSaved) onSaved(res.data.user);
      if (onClose) onClose();
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Failed to save avatar." } });
    } finally {
      setSaving(false);
    }
  };

  const isDark = theme;

  return (
    <div className="avatar_creator_overlay">
      <div className="avatar_creator_modal" style={{ background: isDark ? "#1a1a2e" : "#fff", color: isDark ? "#eee" : "#111" }}>

        <div className="avatar_creator_header">
          <h5>🎨 Create Your Avatar</h5>
          {onClose && <button className="avatar_close_btn" onClick={onClose}>×</button>}
        </div>

        <div className="avatar_creator_body">
          {/* Live Preview */}
          <div className="avatar_preview_box" style={{ background: isDark ? "#2a2a3e" : "#f5f5f5" }}>
            <AvatarSVG config={config} size={120} />
            <p className="avatar_preview_label">Preview</p>
          </div>

          {/* Options */}
          <div className="avatar_options_scroll">

            {/* Face Shape */}
            <div className="avatar_section">
              <label className="avatar_section_label">Face Shape</label>
              <div className="avatar_opts_row">
                {FACE_SHAPES.map((f) => (
                  <button
                    key={f.id}
                    className={`avatar_opt_btn ${config.faceShape === f.id ? "active" : ""}`}
                    onClick={() => set("faceShape", f.id)}
                  >
                    <span>{f.emoji}</span>
                    <small>{f.label}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div className="avatar_section">
              <label className="avatar_section_label">Skin Tone</label>
              <div className="avatar_color_row">
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.id}
                    title={s.label}
                    className={`avatar_color_swatch ${config.skinTone === s.id ? "active" : ""}`}
                    style={{ background: s.id }}
                    onClick={() => set("skinTone", s.id)}
                  />
                ))}
              </div>
            </div>

            {/* Hair Style */}
            <div className="avatar_section">
              <label className="avatar_section_label">Hair Style</label>
              <div className="avatar_opts_row">
                {HAIR_STYLES.map((h) => (
                  <button
                    key={h.id}
                    className={`avatar_opt_btn ${config.hairStyle === h.id ? "active" : ""}`}
                    onClick={() => set("hairStyle", h.id)}
                  >
                    <span>{h.emoji}</span>
                    <small>{h.label}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div className="avatar_section">
              <label className="avatar_section_label">Hair Color</label>
              <div className="avatar_color_row">
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    title={c.label}
                    className={`avatar_color_swatch ${config.hairColor === c.id ? "active" : ""}`}
                    style={{ background: c.id }}
                    onClick={() => set("hairColor", c.id)}
                  />
                ))}
              </div>
            </div>

            {/* Eye Color */}
            <div className="avatar_section">
              <label className="avatar_section_label">Eye Color</label>
              <div className="avatar_color_row">
                {EYE_COLORS.map((e) => (
                  <button
                    key={e.id}
                    title={e.label}
                    className={`avatar_color_swatch ${config.eyeColor === e.id ? "active" : ""}`}
                    style={{ background: e.id }}
                    onClick={() => set("eyeColor", e.id)}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="avatar_section">
              <label className="avatar_section_label">Background</label>
              <div className="avatar_color_row">
                {BG_COLORS.map((b) => (
                  <button
                    key={b.id}
                    title={b.label}
                    className={`avatar_color_swatch ${config.bgColor === b.id ? "active" : ""}`}
                    style={{ background: b.id }}
                    onClick={() => set("bgColor", b.id)}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="avatar_creator_footer">
          <button className="avatar_save_btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "✅ Save Avatar"}
          </button>
          {onClose && (
            <button className="avatar_cancel_btn" onClick={onClose} style={{ color: isDark ? "#aaa" : "#666" }}>
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AvatarCreator;
