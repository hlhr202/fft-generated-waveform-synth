module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
        react: {
            version: "detect",
        },
    },
    extends: ["plugin:react/recommended", "airbnb", "prettier"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "no-unused-vars": 0,
        "max-classes-per-file": 0,
        "react/jsx-filename-extension": [
            1,
            { extensions: [".js", ".jsx", ".tsx"] },
        ],
        "react/button-has-type": 0,
        "import/extensions": "off",
        "no-console": 0,
        "consistent-return": 0,
        "import/prefer-default-export": 0,
        "react/react-in-jsx-scope": 0,
        "no-shadow": 0,
    },
};
