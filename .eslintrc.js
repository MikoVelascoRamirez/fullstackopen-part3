module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        '@stylistic'
    ],
    "extends": "eslint:recommended",
    "rules": {
        "@stylistic/indent" : ["error", 2],
        "eqeqeq" : ["error"],
        "no-trailing-spaces" : 'error',
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-console' : 0,
        "no-undef" : 0,
        "no-unused-vars": ["error", { "vars" : "all", "args": "after-used"}]
    }
}
