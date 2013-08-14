/**
 * For character IO in the browser, buffer characters until seeing a newline
 */
;(function(exports) {
    var buf = [];
    // buffer chars, flush on newline
    function write(ch) {
        if(ch === '\n') {
            console.log(buf.join(''));
            buf = [];
        } else {
            buf.push(ch);
        }
    }
    exports.write = write;
}(typeof exports === 'undefined' ? this : exports));
