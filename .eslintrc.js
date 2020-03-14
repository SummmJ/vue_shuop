module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    //'@vue/standard'
  ],

  parserOptions: {
    //parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    "quotes": [1, "single"], //引号类型 `` "" ''
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
