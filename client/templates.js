(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root === 'undefined' || root !== Object(root)) {
        throw new Error('templatizer: window does not exist or is not an object');
    } else {
        root.templatizer = factory();
    }
}(this, function () {
    var jade=function(){function r(r){return null!=r&&""!==r}function n(e){return Array.isArray(e)?e.map(n).filter(r).join(" "):e}var e={};return e.merge=function t(n,e){if(1===arguments.length){for(var a=n[0],s=1;s<n.length;s++)a=t(a,n[s]);return a}var i=n["class"],l=e["class"];(i||l)&&(i=i||[],l=l||[],Array.isArray(i)||(i=[i]),Array.isArray(l)||(l=[l]),n["class"]=i.concat(l).filter(r));for(var o in e)"class"!=o&&(n[o]=e[o]);return n},e.joinClasses=n,e.cls=function(r,t){for(var a=[],s=0;s<r.length;s++)a.push(t&&t[s]?e.escape(n([r[s]])):n(r[s]));var i=n(a);return i.length?' class="'+i+'"':""},e.attr=function(r,n,t,a){return"boolean"==typeof n||null==n?n?" "+(a?r:r+'="'+r+'"'):"":0==r.indexOf("data")&&"string"!=typeof n?" "+r+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'":t?" "+r+'="'+e.escape(n)+'"':" "+r+'="'+n+'"'},e.attrs=function(r,t){var a=[],s=Object.keys(r);if(s.length)for(var i=0;i<s.length;++i){var l=s[i],o=r[l];"class"==l?(o=n(o))&&a.push(" "+l+'="'+o+'"'):a.push(e.attr(l,o,!1,t))}return a.join("")},e.escape=function(r){var n=String(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return n===""+r?r:n},e.rethrow=function a(r,n,e,t){if(!(r instanceof Error))throw r;if(!("undefined"==typeof window&&n||t))throw r.message+=" on line "+e,r;try{t=t||require("fs").readFileSync(n,"utf8")}catch(s){a(r,null,e)}var i=3,l=t.split("\n"),o=Math.max(e-i,0),c=Math.min(l.length,e+i),i=l.slice(o,c).map(function(r,n){var t=n+o+1;return(t==e?"  > ":"    ")+t+"| "+r}).join("\n");throw r.path=n,r.message=(n||"Jade")+":"+e+"\n"+i+"\n\n"+r.message,r},e}();

    var templatizer = {};
    templatizer["includes"] = {};
    templatizer["pages"] = {};

    // body.jade compiled template
    templatizer["body"] = function tmpl_body() {
        return '<body><nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a href="/" class="navbar-brand">Workout Logger</a></div><ul role="nav-items" class="nav navbar-nav"><li><a href="/">Log</a></li></ul></div></nav><div class="container"><main data-hook="page-container"></main></div></body>';
    };

    // includes/bbcode.jade compiled template
    templatizer["includes"]["bbcode"] = function tmpl_includes_bbcode(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(hook) {
            buf.push('<div class="col-md-12"><br/>[b]<span data-hook="name"></span>[/b]<div class="row"><div' + jade.attr("data", hook = "reps", true, false) + ' class="col-md-12"></div></div></div>');
        }).call(this, "hook" in locals_for_with ? locals_for_with.hook : typeof hook !== "undefined" ? hook : undefined);
        return buf.join("");
    };

    // includes/bbcodeRep.jade compiled template
    templatizer["includes"]["bbcodeRep"] = function tmpl_includes_bbcodeRep() {
        return '<div class="rep">- <span data-hook="pr">[b]</span><span data-hook="rep"></span><span data-hook="pr">[/b]</span></div>';
    };

    // includes/markdown.jade compiled template
    templatizer["includes"]["markdown"] = function tmpl_includes_markdown(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(hook) {
            buf.push('<div class="col-md-12"><br/>###<span data-hook="name"></span><div class="row"><div' + jade.attr("data", hook = "reps", true, false) + ' class="col-md-12"></div></div></div>');
        }).call(this, "hook" in locals_for_with ? locals_for_with.hook : typeof hook !== "undefined" ? hook : undefined);
        return buf.join("");
    };

    // includes/markdownRep.jade compiled template
    templatizer["includes"]["markdownRep"] = function tmpl_includes_markdownRep() {
        return '<div class="rep">&gt;<span data-hook="pr">**</span><span data-hook="rep"></span><span data-hook="pr">**</span></div>';
    };

    // pages/home.jade compiled template
    templatizer["pages"]["home"] = function tmpl_pages_home() {
        return '<section class="page home"><row><div class="col-sm-6"><form role="form"><div class="form-group"><label class="radio">Format</label><input type="radio" name="format" value="md" data-hook="format"/> Markdown <input type="radio" name="format" value="bb" data-hook="format"/> BBCode </div><div class="form-group"><label>Workout</label><textarea data-hook="raw" rows="50" placeholder="Squat 255x5 255x5\nBench 185x5x4" id="rawInput" class="form-control"></textarea></div></form></div><div class="col-sm-6"><div data-hook="formatted" class="workout"></div><div class="instructions"><h1>Workout Log</h1><ol><li>Type your workout in the box</li><li>Select an output format</li><li>Copy and paste it wherever</li><li>Have a great day</li></ol></div></div></row></section>';
    };

    return templatizer;
}));