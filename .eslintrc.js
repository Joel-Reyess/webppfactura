module.exports = {
  root: true,
  env: {
    node: true,
    serviceworker: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['error', { 'args': 'none' }], // Permite parámetros no usados
    'no-restricted-globals': 'off', // Permite el uso de 'self'
    'vue/multi-word-component-names': 'off' 
  }
}
