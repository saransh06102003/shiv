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
          rose: "#E85B8D",
          blush: "#FFDCE8",
          beige: "#EFDCCA",
          cream: "#FFF8F2",
          peach: "#FFD2B5",
          gold: "#C8A96B",
          ivory: "#FFFCF8",
          ink: "#2E1E28"
        }
      },
      boxShadow: {
        glow: "0 14px 40px rgba(232, 91, 141, 0.22)",
        soft: "0 10px 30px rgba(46, 30, 40, 0.10)",
        card: "0 18px 38px rgba(46, 30, 40, 0.12)"
      },
      backgroundImage: {
        "skin-gradient": "linear-gradient(135deg, #FFF7F3 0%, #FFEAF3 45%, #FFF3E8 100%)",
        "skin-hero": "radial-gradient(circle at 20% 0%, rgba(255, 200, 224, 0.6), transparent 35%), radial-gradient(circle at 90% 10%, rgba(255, 218, 180, 0.45), transparent 40%), linear-gradient(135deg, #fffaf7 0%, #fff1f6 55%, #ffefe2 100%)",
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
