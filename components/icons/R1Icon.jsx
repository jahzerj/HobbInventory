export default function R1Icon({ color }) {
  // Determine if the color is light and needs a darker outline for contrast
  const isLightColor = (color) => {
    // List of colors that need a darker outline
    const lightColors = ["white", "beige", "yellow", "cream"];
    return lightColors.includes(color?.toLowerCase());
  };

  // Use soft grey for light colors instead of black
  const outlineColor = isLightColor(color)
    ? "rgba(120,120,120,0.7)"
    : "#ffffff";

  // Reduced stroke width for all outlines
  const strokeWidth = isLightColor(color) ? 0.75 : 1.5;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cherry profile R1 keycap shape */}
      <path
        d="M4 18H20L19.5 16.5L18 8.5L17 6H7L6 8.5L4.5 16.5L4 18Z"
        fill={color || "#333333"}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Top surface of the keycap - slightly curved */}
      <path
        d="M7 6H17L16.5 7H7.5L7 6Z"
        fill={
          isLightColor(color) ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)"
        }
        stroke="none"
      />
      {/* Subtle side curve */}
      <path
        d="M6 8.5L18 8.5"
        stroke={
          isLightColor(color) ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.25)"
        }
        strokeWidth="0.75"
        fill="none"
      />
    </svg>
  );
}
