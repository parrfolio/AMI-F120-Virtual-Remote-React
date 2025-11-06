/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "jukebox-red": "#D8415B",
        "jukebox-red-dark": "#C03A49",
        "jukebox-pink": "#E9A5B3",
        "jukebox-pink-light": "#F9D5DC",
        "jukebox-blue": "#1E88E5",
        "jukebox-black": "#1A1A1A",
        "jukebox-gray": "#4A4A4A",
        "jukebox-bg": "#FAFAFA",
      },
      fontFamily: {
        "metropolis-bold": ["MetropolisBold", "sans-serif"],
        metropolis: ["MetropolisRegular", "sans-serif"],
      },
      fontSize: {
        "fluid-xs": "clamp(0.75rem, 2vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 2.5vw, 1rem)",
        "fluid-base": "clamp(1rem, 3vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 3.5vw, 1.25rem)",
        "fluid-xl": "clamp(1.25rem, 4vw, 1.5rem)",
        "fluid-2xl": "clamp(1.5rem, 5vw, 2rem)",
        "fluid-3xl": "clamp(1.875rem, 6vw, 2.5rem)",
        "fluid-4xl": "clamp(2.25rem, 7vw, 3rem)",
      },
      spacing: {
        "fluid-1": "clamp(0.25rem, 1vw, 0.5rem)",
        "fluid-2": "clamp(0.5rem, 2vw, 1rem)",
        "fluid-4": "clamp(1rem, 3vw, 1.5rem)",
        "fluid-6": "clamp(1.5rem, 4vw, 2rem)",
        "fluid-8": "clamp(2rem, 5vw, 3rem)",
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeIn: "fadeIn 0.5s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
