;(function(window) {
    var littleEndian = (function() {
        var buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        return new Int16Array(buffer)[0] === 256;
    })();

    /**
     * Load some bytes via HTTP GET into a typed array
     */
    function loadInt32(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'arraybuffer';
        request.onload = function(e) {
            var buffer = request.response;
            if(buffer) {
                var bytes = new DataView(buffer);
                var ints = new Array(buffer.byteLength/4);
                for(var i = 0, j = 0; i < buffer.byteLength; i+=4, j++) {
                    ints[j] = bytes.getInt32(i, false);
                }
                callback(ints);
            } else {
                callback();
            }
        };
        request.send(null);
    }
    window.loadBytes = loadInt32;
})(window);
