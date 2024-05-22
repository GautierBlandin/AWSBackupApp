// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  "extends": [
    "expo",
    "airbnb",
    "airbnb-typescript"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "react/no-array-index-key": "off",
    "import/no-named-as-default": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "react/react-in-jsx-scope": "off",
    "no-underscore-dangle": "off",
    "max-len": [2, { "code": 140 }],
    "max-classes-per-file": "off",
    "class-methods-use-this": "off"
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/no-use-before-define": "off"
      }
    }
  ],
  ignorePatterns: [".eslintrc.js", "scripts/reset-project.js", "babel.config.js"]
}


