/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "ui-serif", "Georgia", "serif"]
      },
      colors: {
        skin: {
          rose: "#FF6F91",
          blush: "#FFD6E4",
          beige: "#F4DFD2",
          cream: "#FFF6F2",
          peach: "#FFB7A5",
          lavender: "#B8A1FF",
          gold: "#C8A96B",
          ivory: "#FFFCF8",
          ink: "#2E2E2E"
        }
      },
      boxShadow: {
        glow: "0 14px 40px rgba(232, 91, 141, 0.22)",
        soft: "0 10px 30px rgba(46, 30, 40, 0.10)",
        card: "0 18px 38px rgba(46, 30, 40, 0.12)"
      },
      backgroundImage: {
        "skin-gradient": "linear-gradient(135deg, #FFF6F2 0%, #FFD6E4 40%, #FFB7A5 75%, #E8E2FF 100%)",
        "skin-hero": "radial-gradient(circle at 18% 0%, rgba(255, 111, 145, 0.55), transparent 38%), radial-gradient(circle at 90% 14%, rgba(255, 183, 165, 0.6), transparent 45%), linear-gradient(135deg, #fff5f7 0%, #ffe1eb 52%, #ffe9df 100%)",
        "gold-sheen": "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(200,169,107,0.22) 45%, rgba(255,255,255,0) 100%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        heartPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" }
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.06)", opacity: ".9" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "fade-up": "fadeUp 420ms ease-out",
        "heart-pop": "heartPop 300ms ease-out",
        "pulse-soft": "pulseSoft 240ms ease-out"
      }
    }
  },
  plugins: []
};
