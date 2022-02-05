module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended'
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        "indent": "off",
        '@typescript-eslint/indent': [2, 4, {
            "ignoredNodes": [
                "FunctionExpression > .params[decorators.length > 0]",
                "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"
            ]
        }],
        "quotes": "off",
        '@typescript-eslint/quotes': [2, "double"],
        "semi": "off",
        '@typescript-eslint/semi': [2, "always"],
        "@typescript-eslint/no-unused-vars": [2, { "args": "none" }],
        "@typescript-eslint/ban-ts-comment": 0
    },
};
