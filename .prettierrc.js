/**
 * prettier 代码格式化配置
 * 如遇到某些不想被格式化的代码:
 *
 * // prettier-ignore
 * matrix(
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  )
 * 添加注释 // prettier-ignore 即可跳过
 * 以下是修改默认的配置, 其他使用官方默认配置
 */

module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 120,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'ignore'
}
