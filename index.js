
var mkdirp = require('mkdirp'),
    request = require('request'),
    fs      = require('fs'),
    _       = require('lodash');

var mainFontsFolder = "fonts";
var stylesFolder = "css";
var stylesFileName = 'fonts';
var stylesFileExt = 'css';
var stylesLocation = stylesFolder + '/'+ stylesFileName + '.' + stylesFileExt;

var fonts = [{
    "fontName": "Open Sans",
    "fontVersions": ["300", "400","600", "700", "300italic", "400italic"],
    "fontSubset": null
  },{
    "fontName": "Lato",
    "fontVersions": ["400", "400italic", "300", "300italic"],
    "fontSubset": null
  },{
    "fontName": "Roboto",
    "fontVersions": ["400"],
    "fontSubset": null
  }]

var userAgentMap = [{
    extension: 'ttf',
    userAgent: '(none)'
  }, {
    extension: 'woff2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
  }, {
    extension: 'woff',
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:27.0) Gecko/20100101 Firefox/27.0'
  }, {
    extension: 'eot',
    userAgent: 'Mozilla/4.0(compatible; MSIE 7.0b; Windows NT 6.0)'
  }, {
    extension: 'svg',
    userAgent: 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10'
}
];

var weightMap = {
  "100": ["Thin", "100", "normal"],
  "100italic": ["ThinItalic", "100", "italic"],
  "200": ["ExtraLight", "200", "normal"],
  "200italic": ["ExtraLightItalic", "200", "italic"],
  "300": ["Light", "300", "normal"],
  "300italic": ["LightItalic", "300", "italic"],
  "400": ["Regular", "400", "normal"],
  "400italic": ["Italic", "400", "italic"],
  "500": ["Medium", "500", "normal"],
  "500italic": ["MediumItalic", "500", "italic"],
  "600": ["SemiBold", "600", "normal"],
  "600italic": ["SemiBoldItalic", "600", "italic"],
  "700": ["Bold", "700", "normal"],
  "700italic": ["BoldItalic", "700", "italic"],
  "800": ["ExtraBold", "800", "normal"],
  "800italic": ["ExtraBoldItalic", "800", "italic"],
  "900": ["UltraBold", "900", "normal"],
  "900italic": ["UltraBoldItalic", "900", "italic"]
};

var cssTemplate = [];


// Getting the font
loopFonts(fonts, function(options, fontOptions, ext){
  fs.writeFile(stylesLocation, cssTemplate);
  loopFontUrls(options, fontOptions, ext, function(fontUrl, fontOptions, ext){
    downloadFont(fontUrl, fontOptions, ext)
  });
})






function loopFonts(fonts, cb){
  for(var j = 0; j < fonts.length; j++) {
    var fontName = fonts[j].fontName.replace(' ', '+');
    var fontVersions = fonts[j].fontVersions;
    var fontSubset = fonts[j].fontSubset;

    cssTemplate += [
      "/* --- " + fonts[j].fontName + " --- */\n\n"
    ].join('\n');

    // Loop through the specified font versions
    for(var k = 0; k < fontVersions.length; k++){
      var googleFontsUrl = "http://fonts.googleapis.com/css?family=" + fontName;
      var version = fontVersions[k];
      if (fontVersions != null) {
        googleFontsUrl += ":" + version;
      } else {
        version = ["400"];
        googleFontsUrl += ":" + version;
      }
      if (fontSubset != null) { googleFontsUrl += "&subset=" + fontSubset; }

      var fontOptions = {
        "fileNamePrimary": fontName.replace('+', '-'),
        "fileNameSecondary": weightMap[version][0],
        "fontFolder": fontName.toLowerCase().replace('+', ''),
        "fontName": fontName.replace('+', '-') + '-' + weightMap[version][0],
        "fontFamily": fontName.replace('+', ''),
        "fontStyle": weightMap[version][2],
        "fontWeight": weightMap[version][1],
        "ext": ext
      }

      var fontLocation = "../" + mainFontsFolder + "/" + fontOptions["fontFolder"] + "/" + fontOptions["fontName"];
      mkdirp(mainFontsFolder + "/" + fontOptions["fontFolder"]);
      mkdirp(stylesFolder);

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

      console.log('Getting fonts from ' + googleFontsUrl);

      // Loop through the user agents to get the right font extension
      for(var i = 0; i < userAgentMap.length; i++) {
        var userAgent = userAgentMap[i];
        var ext = userAgent.extension;
        var ua = userAgent.userAgent;
        var options = {
          url: googleFontsUrl,
          headers: {
            'User-Agent': ua
          }
        };

        // Getting the font
        cb(options, fontOptions, ext);
      }
    }
  }
}



function loopFontUrls(options, fontOptions, ext, cb){
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var fontRegExpUrl = /url\(([^\)]+)\)/gm;
      var fontUrl = fontRegExpUrl.exec(body)[1];
      cb(fontUrl, fontOptions, ext);

    } else {
      console.log("FONT NOT FOUND");
    }
  });
}



function downloadFont(fontUrl, fontOptions, ext) {
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
      console.log("Font file " + fontFile + " created with success!");
    });
}
