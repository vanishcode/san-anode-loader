module.exports = {
    root: true,
    plugins: ['prettier'],
    extends: ['@webpack-contrib/eslint-config-webpack', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'func-names': 0,
    },
};
