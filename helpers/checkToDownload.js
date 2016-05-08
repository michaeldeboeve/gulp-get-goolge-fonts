'use strict';
var chalk   = require('chalk'),
    request = require('request'),
    fs      = require('fs'),
    _       = require('lodash');


function checkToDownload(options, fontOptions, ext, mainFontsFolder, cb) {
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var fontRegExpUrl = /url\(([^\)]+)\)/gm;
      var fontUrl = fontRegExpUrl.exec(body)[1];
      cb(fontUrl, fontOptions, ext, mainFontsFolder);
    }
  });
}

module.exports = checkToDownload;
