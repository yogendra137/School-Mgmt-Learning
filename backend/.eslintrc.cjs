module.exports = {
    env: {
        node: true,
        commonjs: true,
    },
    files: ['.ts'],
    extends: 'eslint:recommended',

    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        quotes: ['error', 'double'],
        semi: ['error', 'always'],
        'no-unused-expressions': 'off',
        'object-shorthand': 'error',
        'prefer-const': 'error',
        'array-bracket-spacing': 'warn',
        'comma-style': 'warn',
        'no-var': 'error',
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: 'next',
            },
        ],
        'object-curly-newline': 'error',
        'no-console': 0,
        'no-array-constructor': 'error',
        'no-mixed-operators': 'error',
        'id-length': 'error',
        camelcase: 'error',
        'no-underscore-dangle': 0,
        'no-useless-escape': 'error',
        'no-param-reassign': 'error',
        'no-iterator': 'error',
        'no-undef': 0,
        'no-multi-assign': 'error',
        'new-cap': 'warn',
    },
};
