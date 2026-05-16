import type { Config } from "tailwindcss"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f111a",    
        secondary: "#1e2235",  
        accent: "#fcc419",     
        success: "#10b981",    
        danger: "#ef4444",     
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config