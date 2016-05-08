'use strict';
var chalk   = require('chalk'),
    request = require('request'),
    fs      = require('fs'),
    _       = require('lodash');


function isFont(font, googleFontsUrl, fontOptions, cb){
  request(googleFontsUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Getting fonts from ' + chalk.cyan(googleFontsUrl));
      cb(font, googleFontsUrl, fontOptions);
    } else {
      console.log('Doesn\'t exist ' + chalk.red(googleFontsUrl));
    }
  });
}

module.exports = isFont;
