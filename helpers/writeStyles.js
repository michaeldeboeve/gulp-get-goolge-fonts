'use strict';
var chalk   = require('chalk'),
    request = require('request'),
    fs      = require('fs'),
    _       = require('lodash');


function writeStyles(cssTemplate, stylesLocation, fontOptions, fontLocation, cb){
  // Main css template
  cssTemplate += [
    "@font-face {",
    "  font-family: '" + fontOptions["fontFamily"] + "';",
    "  font-style: " + fontOptions["fontStyle"] + ";",
    "  font-weight: " + fontOptions["fontWeight"] + ";",
    "  src: url('" + fontLocation + ".eot');",
    "  src: url('" + fontLocation + ".woff2') format('woff2'),",
    "       url('" + fontLocation + ".woff') format('woff'),",
    "       url('" + fontLocation + ".ttf') format('truetype'),",
    "       url('" + fontLocation + ".svg#" + fontOptions["fontName"] + "') format('svg');",
    '}\n\n'
  ].join('\n');

  cb(stylesLocation, cssTemplate);
}

module.exports = writeStyles;
