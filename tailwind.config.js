import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Quicksand', 'Poppins', ...defaultTheme.fontFamily.sans],
                display: ['Quicksand', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                gold: {
                    50: '#fffdf2',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                cream: {
                    50: '#fffaf0',
                    100: '#fff5e1',
                    200: '#ffeac6',
                },
            },
            boxShadow: {
                soft: '0 8px 24px -8px rgba(202, 138, 4, 0.18)',
                cute: '0 12px 32px -10px rgba(234, 179, 8, 0.25)',
            },
            borderRadius: {
                blob: '2rem',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                marquee: 'marquee 32s linear infinite',
                'fade-up': 'fade-up 0.5s ease-out both',
            },
        },
    },
    plugins: [],
};
