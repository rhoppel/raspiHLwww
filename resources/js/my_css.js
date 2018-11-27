/*
 *    Created by Typecast on 2018-04-09 18:54:47 GMT. Visit http://typecast.com/
 *
 *    Licensing your fonts is easy. Read more here:
 *        http://typecast.com/help/licensing-fonts
 */

// Inclusion of domready [https://github.com/ded/domready]
// --------------------------------------------------------

/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function(a,b){typeof module!="undefined"?module.exports=b():typeof define=="function"&&typeof define.amd=="object"?define(b):this[a]=b()}("domready",function(a){function m(a){l=1;while(a=b.shift())a()}var b=[],c,d=!1,e=document,f=e.documentElement,g=f.doScroll,h="DOMContentLoaded",i="addEventListener",j="onreadystatechange",k="readyState",l=/^loade|c/.test(e[k]);return e[i]&&e[i](h,c=function(){e.removeEventListener(h,c,d),m()},d),g&&e.attachEvent(j,c=function(){/^c/.test(e[k])&&(e.detachEvent(j,c),m())}),a=g?function(c){self!=top?l?c():b.push(c):function(){try{f.doScroll("left")}catch(b){return setTimeout(function(){a(c)},50)}c()}()}:function(a){l?a():b.push(a)}})

// --------------------------------------------------------

var tpcEmbed = {
    page: {},
    element: {},
    iframe: {},
    onload: function() {},
    output: function() {
        var args = Array.prototype.slice.call(arguments),
            message = args.shift(),
            data = args;
        window.console && window.console.log(message, data);
    },
};
domready(function () {tpcEmbed.onload();});

tpcEmbed.page.isHosted = function() {
    return document.location.href.substr(0,4) === 'http';
};

tpcEmbed.element.setAttributes = function(element, attributeList) {
    for(var attributeName in attributeList){
        var attributeValue = attributeList[attributeName];
        element.setAttribute(attributeName, attributeValue);
    }
    return element;
};

tpcEmbed.iframe.add = function(attributes, overlayAttributes) {
    var iframe = document.createElement('iframe');
    if (attributes) {
        if(attributes.src) {
            attributes.src = 'http://typecast.com/' + attributes.src + (attributes.src.substring(attributes.src.length-1) === '/' ? '' : '/');
            attributes.src += (tpcEmbed.page.isHosted() ? '' : 'not-') + 'hosted/';
            if (tpcEmbed.page.state) {
                // On valid domain
                attributes.src += (tpcEmbed.page.state.onSupportedDomain ? '' : 'not-') + 'valid/';
            }
            if (tpcEmbed.page.state) {
                // Fonts have loaded
                attributes.src += (tpcEmbed.page.state.fontsLoaded ? '' : 'not-') + 'loaded/';
            }
        }
        tpcEmbed.element.setAttributes(iframe, attributes);
    }
    document.body.appendChild(iframe);

    if (overlayAttributes) {
        var overlay = document.createElement('pre');
        tpcEmbed.element.setAttributes(overlay, overlayAttributes);
        document.body.appendChild(overlay);
    }

    return true;
};

var foutProtection = {
    hideBody: function() {

        var css = 'body { visibility: hidden; }',
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) { // IE
            style.styleSheet.cssText = css;
        } else {style.appendChild(document.createTextNode(css));}
        document.getElementsByTagName('head')[0].appendChild(style);
        foutProtection.style = style;
    },
    showBody: function() {
        if (foutProtection.style) {
            var parentEl = foutProtection.style.parentElement;
            parentEl && parentEl.removeChild(foutProtection.style);
        }
    }
};

// No FOUT protection required

tpcEmbed.onload = function() {
    tpcEmbed.page.state = { fontsLoaded: true };
    var failedFonts = { length: 0 };
    WebFontConfig = {
        fontinactive: function(fontFamily, fontDescription) {
            if (typeof failedFonts[fontFamily] === 'undefined') {
                failedFonts[fontFamily] = [];
                failedFonts.length++;
            }
            failedFonts[fontFamily].push(fontDescription);
        },
        inactive: function() {
            tpcEmbed.output("Unable to load web fonts");
            foutProtection.showBody();
        },
        active: function() {
            foutProtection.showBody();
            window.clearTimeout(hideTimeout);
            tpcEmbed.page.state.fontsLoaded = ! failedFonts.length;
            if (failedFonts.length > 0 && onWebserver && onSupportedDomain) {
                tpcEmbed.iframe.add({
                    'src':          'updates/font-embed-headsup',
                    'id':           'embed-notice-headsup',
                    'width':        '100%',
                    'height':       '90',
                    'scrolling':    'no',
                    'style':        'position:fixed !important; bottom:0 !important; right:0 !important; border:none !important; outline:none !important; width:100% !important; left:0 !important; background-color:#fff !important; z-index:1 !important; -webkit-box-shadow: 0 -4px 5px rgba(51, 51, 51, 0.15); -moz-box-shadow: 0 -4px 5px rgba(51,51,51,0.15); box-shadow: 0 -4px 5px rgba(51, 51, 51, 0.15);',
                });
            }
        },
// No fonts to load
        noFonts: true,

    };

    var isOnSupportedDomain = function() {
        var domains = ['*','localhost'],
            hostname = document.location.hostname;
        for(var i = 0, l = domains.length; i < l; i++){
            var domain = domains[i];
            if (hostname === domain){
                return true;
            } else {
                if(domain.substring(0,1) === '*') {
                    domain = domain.substr(1);
                }
                var re = new RegExp(domain+'$');
                if(hostname.match(re)){
                    return true;
                }
            }
        }
        return false;
    };

    var onWebserver = tpcEmbed.page.isHosted(),
        onSupportedDomain = isOnSupportedDomain();
        isActive = ! WebFontConfig.noFonts;
        tpcEmbed.page.state.onWebserver = onWebserver;
        tpcEmbed.page.state.onSupportedDomain = onSupportedDomain;

    if ((! onWebserver || ! onSupportedDomain) && isActive) {
        tpcEmbed.output('You need to host this web page on a webserver or set up a domain!');
        tpcEmbed.iframe.add({
            'src':          'updates/font-embed-notice',
            'id':           'embed-notice-webserver',
            'width':        '100%',
            'height':       '90',
            'scrolling':    'no',
            'style':        'position:fixed !important; bottom:0 !important; right:0 !important; border:none !important; outline:none !important; width:100% !important; left:0 !important; background-color:#fff !important; z-index:1 !important; -webkit-box-shadow: 0 -4px 5px rgba(51, 51, 51, 0.15); -moz-box-shadow: 0 -4px 5px rgba(51,51,51,0.15); box-shadow: 0 -4px 5px rgba(51, 51, 51, 0.15);',
        },{
            'id':           'embed-notice-webserver-overlay',
            'style':        'background:transparent !important; width:100% !important; position:fixed !important; bottom:0 !important; right:0 !important; left:0 !important; top:auto !important; height:90px !important; padding:0 !important; margin:0 !important; transform:none !important; display:block !important; z-index:2 !important; cursor:pointer !important; opacity:1 !important; transition:none !important; animation: none !important;',
        });

        document.getElementById("embed-notice-webserver-overlay").onclick = function() {
            if (! document.getElementById("embed-add-domains")) {
                var iframeWidth = 700;
                tpcEmbed.iframe.add({
                    'src':          'dashboard/add-domains/z833ncKCNq/Zrw64KN4vN',
                    'id':           'embed-add-domains',
                    'width':         iframeWidth,
                    'height':        Math.round(iframeWidth*0.9),
                    'style':        'left: 50%; margin-left: -' + (Math.round(iframeWidth/2)) + 'px; top: 50px; position: fixed; z-index: 9000; background: #fff; border: 1px solid #cccccc; display: block; -webkit-box-shadow: 0 0 10px rgba(51,51,51,0.25); -moz-box-shadow: 0 0 10px rgba(51,51,51,0.25); -o-box-shadow: 0 0 10px rgba(51,51,51,0.25); box-shadow: 0 0 10px rgba(51,51,51,0.25);',
                },{
                    'id':           'embed-add-domains-overlay',
                    'style':        'left: 50% !important; margin:0 !important; margin-left: 318px !important; top: 62px !important; background:transparent !important; position:fixed !important; bottom:0 !important; right:0 !important; width:22px !important; height:22px !important; padding:0 !important; transform:none !important; display:block !important; z-index:9001 !important; cursor:pointer !important; opacity:1 !important; transition:none !important; animation: none !important;',
                });

                document.getElementById("embed-add-domains-overlay").onclick = function() {
                    var embedAddDomainsOverlay = document.getElementById("embed-add-domains-overlay"),
                        embedAddDomains = document.getElementById("embed-add-domains");
                    if (embedAddDomainsOverlay) {embedAddDomainsOverlay.parentNode.removeChild(embedAddDomainsOverlay);}
                    if (embedAddDomains) {embedAddDomains.parentNode.removeChild(embedAddDomains);}
                };
            }
            return false;
        };
    }

    // https://developers.google.com/webfonts/docs/webfont_loader
    (function() {
        var wf = document.createElement('script');
        wf.src = (onWebserver ? '' : 'http:') + '//typecast.com/js/libs/google/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();

    if(typeof __tcaExcludeHostedCss === 'undefined' || ! __tcaExcludeHostedCss) {
        var css = document.createElement('link');
        tpcEmbed.element.setAttributes(css, {
            'rel': 'stylesheet',
            'type': 'text/css',
            'media': 'screen',
            'href': (onWebserver ? '' : 'http:') + '//typecast.com/project_css/z833ncKCNq/496130e48d3777.css',
        });
        document.getElementsByTagName('head')[0].appendChild(css);
    }

};

