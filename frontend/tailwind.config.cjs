/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
    ],
    theme: {
        extend: {
            colors: {
                "orange": {
                    50: "#fff8f5",
                    100: "#fff0eb",
                    200: "#ffdace",
                    300: "#ffc4b1",
                    400: "#ff9776",
                    500: "#ff6b3b",
                    600: "#e66035",
                    700: "#bf502c",
                    800: "#994023",
                    900: "#7d341d"
                }
            },
        },
    },
    plugins: [
        require("flowbite/plugin")
    ],
    darkMode: "class",
}
