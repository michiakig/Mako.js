/**
 * For character IO in Node, just call stdout.write
 */
;(function(exports) {
    exports.write = function (x) { process.stdout.write(x); };
}(typeof exports === 'undefined' ? this : exports));
