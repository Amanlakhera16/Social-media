import React from 'react';

/**
 * Pure SVG avatar renderer. Takes a config object and renders a stylized avatar.
 * config: { faceShape, skinTone, hairStyle, hairColor, eyeColor, bgColor }
 */
const AvatarSVG = ({ config, size = 40 }) => {
  if (!config) return null;

  const {
    faceShape = 'circle',
    skinTone = '#FDBCB4',
    hairStyle = 'short',
    hairColor = '#3B2314',
    eyeColor = '#4A4A4A',
    bgColor = '#E8F4FD',
  } = config;

  const cx = 50;
  const cy = 54;

  // Face shape params
  const faceProps = {
    circle: { rx: 22, ry: 22 },
    oval: { rx: 18, ry: 24 },
    square: { rx: 20, ry: 20, rx_corner: 6 },
  }[faceShape] || { rx: 22, ry: 22 };

  // Hair paths
  const hairPaths = {
    short: `M${cx - 22},${cy - 10} Q${cx - 22},${cy - 36} ${cx},${cy - 36} Q${cx + 22},${cy - 36} ${cx + 22},${cy - 10} Q${cx + 18},${cy - 28} ${cx},${cy - 28} Q${cx - 18},${cy - 28} ${cx - 22},${cy - 10}Z`,
    long: `M${cx - 22},${cy - 10} Q${cx - 22},${cy - 36} ${cx},${cy - 36} Q${cx + 22},${cy - 36} ${cx + 22},${cy - 10} L${cx + 24},${cy + 32} Q${cx + 18},${cy + 36} ${cx + 14},${cy + 30} L${cx + 14},${cy - 5} L${cx - 14},${cy - 5} L${cx - 14},${cy + 30} Q${cx - 18},${cy + 36} ${cx - 24},${cy + 32}Z`,
    curly: `M${cx - 22},${cy - 12} Q${cx - 28},${cy - 40} ${cx},${cy - 40} Q${cx + 28},${cy - 40} ${cx + 22},${cy - 12} Q${cx + 26},${cy - 24} ${cx + 18},${cy - 22} Q${cx + 12},${cy - 20} ${cx + 10},${cy - 30} Q${cx + 4},${cy - 38} ${cx},${cy - 36} Q${cx - 4},${cy - 38} ${cx - 10},${cy - 30} Q${cx - 12},${cy - 20} ${cx - 18},${cy - 22} Q${cx - 26},${cy - 24} ${cx - 22},${cy - 12}Z`,
    bald: null,
  };

  const hairPath = hairPaths[hairStyle];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: '50%', display: 'block', flexShrink: 0 }}
    >
      {/* Background */}
      <circle cx="50" cy="50" r="50" fill={bgColor} />

      {/* Hair (behind face) */}
      {hairPath && <path d={hairPath} fill={hairColor} />}

      {/* Face */}
      {faceShape === 'square' ? (
        <rect
          x={cx - faceProps.rx}
          y={cy - faceProps.ry}
          width={faceProps.rx * 2}
          height={faceProps.ry * 2}
          rx={faceProps.rx_corner}
          fill={skinTone}
        />
      ) : (
        <ellipse cx={cx} cy={cy} rx={faceProps.rx} ry={faceProps.ry} fill={skinTone} />
      )}

      {/* Eyes */}
      <circle cx={cx - 8} cy={cy - 4} r={3} fill={eyeColor} />
      <circle cx={cx + 8} cy={cy - 4} r={3} fill={eyeColor} />
      {/* Eye shine */}
      <circle cx={cx - 7} cy={cy - 5.5} r={1} fill="white" opacity="0.8" />
      <circle cx={cx + 9} cy={cy - 5.5} r={1} fill="white" opacity="0.8" />

      {/* Nose */}
      <ellipse cx={cx} cy={cy + 5} rx={2} ry={1.5} fill={skinTone} stroke={hairColor} strokeWidth="0.8" opacity="0.5" />

      {/* Mouth - friendly smile */}
      <path
        d={`M${cx - 7},${cy + 12} Q${cx},${cy + 18} ${cx + 7},${cy + 12}`}
        fill="none"
        stroke="#C2848A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Ears */}
      <ellipse cx={cx - 22} cy={cy} rx={3} ry={4.5} fill={skinTone} />
      <ellipse cx={cx + 22} cy={cy} rx={3} ry={4.5} fill={skinTone} />

      {/* Neck */}
      <rect x={cx - 7} y={cy + 20} width={14} height={10} fill={skinTone} />

      {/* Shoulders / body hint */}
      <ellipse cx={cx} cy={cy + 48} rx={28} ry={14} fill={hairColor} opacity="0.15" />
    </svg>
  );
};

export default AvatarSVG;
