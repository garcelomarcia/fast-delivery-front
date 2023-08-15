/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      width: {
        90: "90%",
        45: "45%",
        "4vw": "4vw",
        "6vw": "6vw",
        "8vw": "8vw",
        "10vw": "10vw",
        "12vw": "12vw",
        "20vw": "20vw",
        "25vw": "25vw",
        "30vw": "30vw",
        "45vw": "45vw",
        "51vw": "51vw",
        "60vw": "60vw"
      },
      height: {
        'max-content': 'max-content',
        '5vh': '5vh',
        '12vh': '12vh',
        '20vh': '20vh'
      },
      margin: {
        '21': '21%',
      },
      borderRadius: {
        DEFAULT: "4px", // Aplica a todos los elementos
        45: "45px"
      },
      fontSize: {
        "sm-90": "0.9rem" // Añade la nueva clase de tamaño de fuente
      },
      colors: {
        "dark-blue-button": "#217BCE",
        "cyan-text": "#217BCE",
        "yellow-label-text": "#FEBC14",
        "gray-paragraphs": "#4F4F4F",
        "yellow-button-weekly": "#FCBC11",
        "20%": "#6373F7",
        "60%": "#FCBC11",
        "80%": "#FEBD93",
        "100%": "#96DB76",
        "black-opaque-50%": "#00000080",
        inactive: "#FF6B6B"
      },
    }
  },
  plugins: []
};
