const OFF = 0
const WARRING = 1
const ERROR = 2

module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    node: true
  },

  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'prettier'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },

  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    // 强制使用一致的缩进
    indent: [
      ERROR,
      2,
      {
        SwitchCase: WARRING
      }
    ],
    // 强制使用骆驼拼写法命名约定
    camelcase: ERROR,
    semi: [ERROR, 'never'],
    quotes: [ERROR, 'single', { avoidEscape: true }],
    // 禁止没使用的变量
    'no-unused-vars': ERROR,
    // 避免使用不必要的括号
    'no-extra-parens': WARRING,
    // 禁用行尾分号
    'no-extra-semi': ERROR,
    // 禁用行尾空格
    'no-trailing-spaces': ERROR,
    // 对象中禁止出现重复的key
    'no-dupe-keys': ERROR,
    // 强制对象赋值引用使用点形式
    'dot-notation': ERROR,
    // 魔术数字
    'no-magic-numbers': [
      WARRING,
      {
        ignoreArrayIndexes: true
      }
    ],
    // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-new-wrappers': ERROR,
    // 自我赋值
    'no-self-assign': WARRING,
    // 数组使用一致的空格
    'array-bracket-spacing': WARRING,
    // 强制把变量的使用限制在其定义的作用域范围内
    'block-scoped-var': ERROR,
    'block-spacing': ERROR,
    // 强制使用let或const 不能使用var
    'no-var': ERROR,
    // 要求对象字面量简写语法
    'object-shorthand': WARRING,
    // 要求构造函数首字母大写 （要求调用 new 操作符时有首字母大小的函数，允许调用首字母大写的函数时没有 new 操作符。）
    'new-cap': [
      ERROR,
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    // 强制一行的最大长度
    'max-len': [WARRING, 200],
    // 强制 function 块最多允许的的语句数量
    'max-statements': [WARRING, 200],
    // 强制回调函数最大嵌套深度 5层
    'max-nested-callbacks': [WARRING, 5],
    // 控制逗号前后的空格
    'comma-spacing': [
      ERROR,
      {
        before: false,
        after: true
      }
    ],
    'arrow-body-style': OFF,
    // 要求箭头函数的参数使用圆括号
    'arrow-parens': OFF,
    // 禁止重新声明变量
    'no-redeclare': ERROR,
    // if return之后没必要使用else
    'no-else-return': WARRING,
    // 禁止使用弱等于
    eqeqeq: ERROR,

    'comma-dangle': ['error', 'never'],

    // 花括号样式
    // 'brace-style': [2, '1tbs'],
    'callback-return': OFF,
    'computed-property-spacing': [ERROR, 'never'],
    'dot-location': [ERROR, 'property'],

    'vue/html-self-closing': OFF,
    'vue/max-attributes-per-line': OFF,
    'vue/attribute-hyphenation': OFF,
    'vue/require-default-prop': OFF,
    'vue/multi-word-component-names': OFF
  }
}
