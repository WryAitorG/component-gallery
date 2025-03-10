/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Incluye la carpeta `app`
    "./components/**/*.{js,ts,jsx,tsx}", // Incluye la carpeta `components`
    "./previewsComponents/**/*.{js,ts,jsx,tsx,mdx}" // 🔥 Asegurar que Tailwind escanee estos archivos
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
