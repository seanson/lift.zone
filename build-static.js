'use strict';

var Pug = require('pug');
var Fs = require('fs');
var Path = require('path');
var log = require('debug')('lift.zone');
const Config = require('./build-config.js');

//This is a little hard coded but whatever
//[pug, html]
var pages = [
    ['pages/static.pug', 'index.html'],
    ['pages/about.pug', 'about'],
    ['pages/privacy.pug', 'privacy'],
    ['pages/tools.pug', 'tools'],
    ['pages/login.pug', 'login'],
    ['pages/news.pug', 'news']
];

var bodyPug = Fs.readFileSync('./client/templates/body.pug').toString();
var indexPug = Fs.readFileSync('./client/templates/index.pug').toString();

pages.forEach((page) => {

    log('building %s to %s', page[0], page[1]);
    var pageHtml = Pug.renderFile(Path.join('./client/templates/', page[0]), { assetsUrl: Config.ASSETSURL });
    //replace body page w/ html
    var pageBodyPug = bodyPug.replace('block page', pageHtml);
    var pageBodyHtml = Pug.render(pageBodyPug, { assetsUrl: Config.ASSETSURL });
    var pageIndexHtml = Pug.render(indexPug.replace('block body', pageBodyHtml), { assetsUrl: Config.ASSETSURL });
    Fs.writeFileSync(Path.join(Config.BUILDDIR, page[1]), pageIndexHtml);
});
