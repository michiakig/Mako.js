;(function(exports) {
    // Read a Mako ROM from a file, returning it as an array
    function readMakoRom(filename) {
        var fs = require('fs');
        var Buffer = require('buffer').Buffer;
        var fd = fs.openSync(filename, 'r');
        var stat = fs.fstatSync(fd);
        var buffer = new Buffer(stat.size);
        var bytes = fs.readSync(fd, buffer, 0, stat.size, 0);
        var m = [];
        for(var i = 0; i < bytes; i += 4) {
            m.push(buffer.readInt32BE(i));
        }
        return m;
    }
    exports.readMakoRom = readMakoRom;
})(exports);
