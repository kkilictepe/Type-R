!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).attributesIO={})}(this,function(t){"use strict";function e(){return new o}var o=function(){function t(){}return t.prototype.create=function(t,e){throw new Error("Method is not supported.")},t.prototype.update=function(t,e,o){throw new Error("Method is not supported.")},t.prototype.read=function(t,e,o){var r=o.keys().filter(function(t){return o[t]&&o[t].fetch}).map(function(t){return o[t].fetch(e)}),n=Promise.all(r).then(function(){});return n.abort=function(){r.forEach(function(t){return t.abort&&t.abort()})},n},t.prototype.destroy=function(t,e){throw new Error("Method is not supported.")},t.prototype.list=function(t){throw new Error("Method is not supported.")},t.prototype.subscribe=function(t){},t.prototype.unsubscribe=function(t){},t}();t.create=e,t.attributesIO=e,t.AttributesEndpoint=o,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map
