export interface MosaicTheme {
  background: string;
  foreground: string;

  card: string;
  cardForeground: string;

  popover: string;
  popoverForeground: string;

  primary: string;
  primaryForeground: string;

  secondary: string;
  secondaryForeground: string;

  accent: string;
  accentForeground: string;

  muted: string;
  mutedForeground: string;

  destructive: string;

  border: string;
  input: string;
  ring: string;

  success: string;
  successForeground: string;

  warning: string;
  warningForeground: string;

  info: string;
  infoForeground: string;
}

export const lightTheme: MosaicTheme = {
  background: "250 248 244",
  foreground: "57 55 51",

  card: "255 253 249",
  cardForeground: "57 55 51",

  popover: "255 253 249",
  popoverForeground: "57 55 51",

  primary: "108 135 115",
  primaryForeground: "255 255 252",

  secondary: "239 234 226",
  secondaryForeground: "75 71 64",

  accent: "224 183 163",
  accentForeground: "76 58 48",

  muted: "241 238 232",
  mutedForeground: "126 120 111",

  destructive: "194 92 84",

  border: "226 221 213",
  input: "226 221 213",
  ring: "145 164 149",

  success: "112 145 121",
  successForeground: "255 255 255",

  warning: "202 157 92",
  warningForeground: "255 255 255",

  info: "125 151 162",
  infoForeground: "255 255 255",
};

export const darkTheme: MosaicTheme = {
  background: "29 32 29",
  foreground: "238 234 226",

  card: "38 42 38",
  cardForeground: "238 234 226",

  popover: "38 42 38",
  popoverForeground: "238 234 226",

  primary: "151 176 157",
  primaryForeground: "32 40 34",

  secondary: "58 62 57",
  secondaryForeground: "232 228 220",

  accent: "188 144 123",
  accentForeground: "255 246 240",

  muted: "49 53 48",
  mutedForeground: "169 164 155",

  destructive: "220 118 108",

  border: "70 73 67",
  input: "70 73 67",
  ring: "137 163 143",

  success: "132 168 141",
  successForeground: "31 40 34",

  warning: "219 174 107",
  warningForeground: "50 42 29",

  info: "144 169 179",
  infoForeground: "30 40 44",
};
