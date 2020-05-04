const fs = require('fs-extra');
const concat = require('concat');
const cheerio = require('cheerio');

async function copy(src, dest) {
  return new Promise(function(resolve, reject) {
    fs.copy(src, dest, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

(async function build() {

  const exists = await fs.pathExists('./dist/apps/converter');
  if (!exists) {
    console.error('Path ./dist/apps/converter not found');
    process.exit();
  }

  await concat([
    './dist/apps/converter/scripts.js',
    './dist/apps/converter/main-es2015.js',
    './dist/apps/converter/polyfills-es2015.js',
    './dist/apps/converter/runtime-es2015.js',
    './dist/apps/converter/styles-es2015.js'
  ], './dist/apps/converter/currency-exchange.js');

  await concat([
    './dist/apps/converter/scripts.js',
    './dist/apps/converter/main-es5.js',
    './dist/apps/converter/polyfills-es5.js',
    './dist/apps/converter/runtime-es5.js',
    './dist/apps/converter/styles-es5.js'
  ], './dist/apps/converter/currency-exchange-es5.js');

  let doc;
  try {
    doc = fs.readFileSync('./dist/apps/converter/index.html', { encoding:'utf8', flag:'r' });
  } catch (e) {
    return console.log(err);
  }

  // load html into cheerio so we can manipulate DOM
  const $ = cheerio.load(doc);
  $('script').remove();
  $(`<script src="currency-exchange.js" type="module"></script>`).appendTo('body');
  $(`<script src="currency-exchange-es5.js" nomodule></script>`).appendTo('body');

  // write index.html file back
  try {
    fs.writeFileSync('./dist/apps/converter/index.html', $.html())
  } catch (e) {
    return console.log(err);
  }

  await copy('./dist/apps/converter/favicon.ico', './dist/favicon.ico');

  console.info('Angular Elements for Currency Exchange Converter created successfully!');
})();
