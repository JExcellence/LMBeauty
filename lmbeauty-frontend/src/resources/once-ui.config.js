import { Merriweather_Sans } from "next/font/google";

const baseURL = "https://lmbeauty.de";

const heading = Merriweather_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Merriweather_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const label = Merriweather_Sans({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const code = Merriweather_Sans({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts = {
  heading: heading,
  body: body,
  label: label,
  code: code,
};

const style = {
    theme: "light",
    brand: "custom",
    accent: "violet",
    neutral: "gray",
    border: "conservative",
    solid: "inverse",
    solidStyle: "flat",
    surface: "translucent",
    transition: "all",
    scaling: "100"
}

const dataStyle = {
    variant: "gradient",
    mode: "categorical",
    height: 24,
    axis: {
        stroke: "var(--neutral-alpha-weak)",
    },
    tick: {
        fill: "var(--neutral-on-background-weak)",
        fontSize: 11,
        line: false,
    },
};

export { fonts, style, dataStyle, baseURL };