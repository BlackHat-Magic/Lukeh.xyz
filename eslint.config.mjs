import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            '.venv/**',
            'node_modules/**',
            'website/static/js/**',
        ],
    },
    {
        languageOptions: {
            globals: {
                document: 'readonly',
                window: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
                alert: 'readonly',
                localStorage: 'readonly',
                history: 'readonly',
                fetch: 'readonly',
                requestAnimationFrame: 'readonly',
                getComputedStyle: 'readonly',
                URLSearchParams: 'readonly',
                HTMLElement: 'readonly',
                HTMLButtonElement: 'readonly',
                Alpine: 'readonly',
                showdown: 'readonly',
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    }
);
