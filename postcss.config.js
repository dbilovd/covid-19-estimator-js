const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    cssnano({
      preset: 'default'
    }),
    purgecss({
      content: [
        './src/**/*.vue'
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
      // content: ['./layouts/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
      // defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};
