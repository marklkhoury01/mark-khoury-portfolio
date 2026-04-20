/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
            },
            animation: {
                'scroll-slow': 'scroll 30s linear infinite',
            },
            keyframes: {
                scroll: {
                    '0%':   { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(calc(-250px * 5))' },
                },
            },
        },
    },
    plugins: [],
};
