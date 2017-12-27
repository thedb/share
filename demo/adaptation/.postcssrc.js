// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "autoprefixer": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, 
      viewportHeight: 1334, 
      unitPrecision: 5, // 单位精度
      viewportUnit: 'vw', 
      minPixelValue: 1, 
      mediaQuery: true
    },
    "postcss-write-svg": {}
  }
}
