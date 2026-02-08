/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1a1a1a',
                secondary: '#f5f1ed',
                accent: '#d4a574',
                'gray-50': '#f8f8f8',
                'gray-100': '#f0f0f0',
                'gray-300': '#d1d1d1',
                'gray-500': '#888888',
                'gray-700': '#333333',
                'gray-900': '#1a1a1a',
            },
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
                heading: ['Manrope', 'Pretendard', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                'card': '0 4px 6px rgba(0, 0, 0, 0.07)',
                'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
