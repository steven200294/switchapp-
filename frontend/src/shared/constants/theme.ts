// Design tokens — single source of truth for colors and spacing
// Change here, changes everywhere

export const COLORS = {
  primary: "#6C5CE7",
  primaryLight: "#A29BFE",
  secondary: "#00CEC9",
  secondaryLight: "#81ECEC",
  accent: "#FD79A8",
  success: "#00B894",
  warning: "#FDCB6E",
  error: "#D63031",
  text: {
    primary: "#2D3436",
    secondary: "#636E72",
    muted: "#B2BEC3",
    inverse: "#FFFFFF",
  },
  bg: {
    primary: "#FFFFFF",
    secondary: "#F8F9FA",
    tertiary: "#DFE6E9",
  },
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
} as const;

export const BORDER_RADIUS = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  full: "9999px",
} as const;
