// Mako.java
;(function(exports) {
    var scale = 3;
    var stats;

    function setupStats() {
        stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }

    // two draw functions, one with fillStyle/fillRect
    function drawFillStyle(ctx, px, x, y) {
        var a = (px >> 24) & 0xff;
        var r = (px >> 16) & 0xff;
        var g = (px >> 8) & 0xff;
        var b = px & 0xff;
        var fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a / 255 + ')';
        ctx.fillStyle = fillStyle;
        ctx.fillRect(scale * x, scale * y, scale, scale);
    }

    // ... one using imagedata
    var drawImageData = (function() {
        var imageData;
        var data;
        return function (ctx, px, x, y) {
            if(!imageData) {
                imageData = ctx.createImageData(scale, scale);
                data = imageData.data;
            }
            for(var i = 0; i < data.length; i+=4) {
                data[i] = (px >> 16) & 0xff;
                data[i+1] = (px >> 8) & 0xff;
                data[i+2] = px & 0xff;
                data[i+3] = (px >> 24) & 0xff;
            }
            ctx.putImageData(imageData, scale * x, scale * y);
        };
    })();

    // update the screen
    function update(ctx, vm, id) {
        for(var i = 0; i < vm.p.length; i++) {
//            drawFillStyle(ctx, vm.p[i], i % 320, Math.floor(i / 320));
            drawImageData(ctx, vm.p[i], i % 320, Math.floor(i / 320));
        }
    }

    function exec(rom) {
        var vm = new MakoVM(write, rom);

        var canvas = document.getElementById('video');
        var ctx = canvas.getContext('2d');

        var id = ctx.createImageData(1, 1);

        numTicks = 0;
        numSyncs = 0;
        // perform one VM tick
        function tick() {
            stats.begin();

            // reached end of bytecode
            if(vm.m[vm.m[MakoConstants.PC]] === -1) {
                clearInterval(intervalID);
                console.log('done');
            }

            // either execute one tick or perform a sync
            if(vm.m[vm.m[MakoConstants.PC]] !== MakoConstants.OP_SYNC) {
                vm.tick();
                numTicks++;
            } else {
                vm.sync();
                vm.m[MakoConstants.PC]++;
                // vm.keys = TODO
                update(ctx, vm, id);
                numSyncs++;
            }
            stats.end();
        }

        intervalID = setInterval(tick, 10);
    }

    exports.exec = exec;
    exports.update = update;
    exports.setupStats = setupStats;

})(typeof exports === 'undefined' ? this : exports);
