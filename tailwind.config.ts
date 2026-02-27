import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "Lato", "sans-serif"],
        script: ["Great Vibes", "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          glow: "hsl(var(--gold-glow))",
          "100": "#F9F1D8",
          "300": "#D4AF37",
          "500": "#AA8C2C",
          "900": "#524314",
        },
        burgundy: {
          DEFAULT: "hsl(var(--burgundy))",
          light: "hsl(var(--burgundy-light))",
          dark: "hsl(var(--burgundy-dark))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        rose: {
          DEFAULT: "hsl(var(--rose))",
          light: "hsl(var(--rose-light))",
        },
        maroon: {
          DEFAULT: "hsl(var(--maroon))",
          light: "hsl(var(--maroon-light))",
          dark: "hsl(var(--maroon-dark))",
        },
        "warm-brown": {
          DEFAULT: "hsl(var(--warm-brown))",
          light: "hsl(var(--warm-brown-light))",
        },
        "shiny-gold": "hsl(var(--shiny-gold))",
        "soft-ivory": "hsl(var(--soft-ivory))",
        "dark-charcoal": "hsl(var(--dark-charcoal))",
        "luxury-black": "#1A1A1A",
        "luxury-charcoal": "#2D2D2D",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionDuration: {
        "400": "400ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
      },
      boxShadow: {
        "gold-sm":
          "0 2px 8px -2px rgba(212, 175, 55, 0.15), 0 1px 4px -1px rgba(212, 175, 55, 0.08)",
        "gold-md":
          "0 4px 16px -4px rgba(212, 175, 55, 0.2), 0 2px 8px -2px rgba(212, 175, 55, 0.1)",
        "gold-lg":
          "0 8px 24px -4px rgba(212, 175, 55, 0.25), 0 4px 12px -2px rgba(212, 175, 55, 0.15)",
        "gold-xl":
          "0 12px 32px -4px rgba(212, 175, 55, 0.3), 0 6px 16px -2px rgba(212, 175, 55, 0.2)",
        "gold-2xl":
          "0 16px 40px -4px rgba(212, 175, 55, 0.35), 0 8px 20px -2px rgba(212, 175, 55, 0.25)",
        "gold-hover":
          "0 8px 32px -4px rgba(212, 175, 55, 0.4), 0 4px 16px -2px rgba(212, 175, 55, 0.25)",
        "gold-hover-lg":
          "0 12px 40px -4px rgba(212, 175, 55, 0.45), 0 6px 20px -2px rgba(212, 175, 55, 0.3)",
        "gold-hover-xl":
          "0 16px 48px -4px rgba(212, 175, 55, 0.5), 0 8px 24px -2px rgba(212, 175, 55, 0.35)",
        "gold-badge":
          "0 4px 20px rgba(212, 175, 55, 0.2), 0 2px 8px rgba(212, 175, 55, 0.15)",
        "gold-badge-hover":
          "0 6px 30px rgba(212, 175, 55, 0.3), 0 3px 12px rgba(212, 175, 55, 0.2)",
        "gold-button":
          "0 4px 16px rgba(212, 175, 55, 0.25), 0 2px 8px rgba(212, 175, 55, 0.15)",
        "gold-button-hover":
          "0 8px 24px rgba(212, 175, 55, 0.35), 0 4px 12px rgba(212, 175, 55, 0.25)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
