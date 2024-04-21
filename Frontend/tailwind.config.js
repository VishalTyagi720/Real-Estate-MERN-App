/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", //Add your files here to include them in the Tailwind CSS pipeline. All the file with these extension will be detectedand css will be applied.
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}

