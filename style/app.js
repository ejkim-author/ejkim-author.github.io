const fs = require('fs');
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssLogical = require('postcss-logical');
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');
const postcssPseudoIs = require('postcss-pseudo-is');
const inlineSvg = require('postcss-inline-svg');

const postCssOptions = [
  autoprefixer,
  postcssLogical,
  postcssDirPseudoClass,
  postcssPseudoIs,
  inlineSvg({ paths: ['./scss/'] })
];

const templatePath = '../template/assets/stylesheets';

// Compile main.scss to main.min.css
sass.render({
  file: 'scss/main.scss',
  outputStyle: 'compressed'
}, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    fs.writeFile(`${templatePath}/main.min.css`, result.css, function(err) {
      if (err) {
        console.error(err);
      } else {
        postcss(postCssOptions)
          .process(result.css, { from: `${templatePath}/main.min.css`, to: `${templatePath}/main.min.css` })
          .then(function(result) {
            fs.writeFile(`${templatePath}/main.min.css`, result.css, function(err) {
              if (err) {
                console.error(err);
              } else {
                console.log('main.min.css compiled successfully!');
              }
            });
          })
          .catch(function(err) {
            console.error(err);
          });
      }
    });
  }
});

// Compile palette.scss to palette.min.css
sass.render({
  file: 'scss/palette.scss',
  outputStyle: 'compressed'
}, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    fs.writeFile(`${templatePath}/palette.min.css`, result.css, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log('palette.min.css compiled successfully!');
      }
    });
  }
});


