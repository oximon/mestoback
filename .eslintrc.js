module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      'no-console': 0,
      'global-require': 0,
      'import/no-extraneous-dependencies': 0,
      'import/no-named-as-default-member': 0,
      'import/no-named-as-default': 0,
      'import/prefer-default-export': 0,
      'no-useless-escape': 0,
      'no-underscore-dangle': 0,
      'max-len': 0
    }
};