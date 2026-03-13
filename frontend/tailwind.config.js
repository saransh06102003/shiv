/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "ui-serif", "Georgia", "serif"]
      },
      colors: {
        skin: {
          rose: "#E9337B",
          blush: "#FFD0E2",
          beige: "#EFDCCA",
          cream: "#FFF8F2",
          peach: "#FFC4A6",
          gold: "#C8A96B",
          ivory: "#FFFCF8",
          ink: "#2B1B26"
        }
      },
      boxShadow: {
        glow: "0 14px 40px rgba(232, 91, 141, 0.22)",
        soft: "0 10px 30px rgba(46, 30, 40, 0.10)",
        card: "0 18px 38px rgba(46, 30, 40, 0.12)"
      },
      backgroundImage: {
        "skin-gradient": "linear-gradient(135deg, #FFE7F2 0%, #FFD2E6 36%, #FFE2C7 72%, #F3ECFF 100%)",
        "skin-hero": "radial-gradient(circle at 18% 0%, rgba(255, 118, 170, 0.65), transparent 38%), radial-gradient(circle at 90% 14%, rgba(255, 182, 110, 0.6), transparent 45%), linear-gradient(135deg, #fff0f7 0%, #ffd8ea 52%, #ffe7cf 100%)",
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
