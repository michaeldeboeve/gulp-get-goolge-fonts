'use strict';
var chalk   = require('chalk'),
    request = require('request'),
    fs      = require('fs'),
    _       = require('lodash');


function downloadFont(fontUrl, fontOptions, ext, mainFontsFolder) {
  var n = fontUrl.lastIndexOf('/');
  var gFontName = fontUrl.substring(n + 1);
  var fontFolder = fontOptions["fontFolder"];
  var fontFile = fontOptions["fontName"] + '.' + ext;


  request
    .get(fontUrl)
    .on('error', function(err) {
      console.log(err)
    })
    .pipe(fs.createWriteStream(mainFontsFolder + "/" + fontFolder + "/" + fontFile))
    .on('close', function() {
      console.log("Font file " + chalk.cyan(fontFile) + " created with " + chalk.green("success!"));
    });
}

module.exports = downloadFont;
