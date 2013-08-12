// Mako.java
;(function(exports) {
    var PIXEL_WIDTH = 320;
    var PIXEL_HEIGHT = 240;

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var stats;

    function setupStats() {
        stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }

    /**
     * instance of VideoOut is an interface to some canvas imageData:
     * width, height, drawPixel(x, y, color)
     */
    function VideoOut(w, h, imageData) {
        this.width = w;
        this.height = h;
        this.drawPixel = function(x, y, c) {
	        if (((c >> 24) & 0xFF) !== 0xFF)        { return; }
	        if (x < 0 || x >= w || y < 0 || y >= h) { return; }

            var data = imageData.data;
            var i = x * 4 + y * w * 4;
            data[i]   = (c >> 16) & 0xff;
            data[i+1] = (c >> 8) & 0xff;
            data[i+2] = c & 0xff;
            data[i+3] = (c >> 24) & 0xff;
        };
    }

    function exec(rom) {
        var hidden = document.getElementById('hidden');
        var ctx = hidden.getContext('2d');
        var video = document.getElementById('video');
        var videoCtx = video.getContext('2d');
        videoCtx.imageSmoothingEnabled = false;
        videoCtx.webkitImageSmoothingEnabled = false;
        videoCtx.mozImageSmoothingEnabled = false;
        videoCtx.scale(2, 2);

        var imageData = ctx.getImageData(0, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
        var videoOut = new VideoOut(PIXEL_WIDTH, PIXEL_HEIGHT, imageData);
        var vm = new MakoVM(write, videoOut, rom);

        var keys = 0;
        var masks = {};
        masks[37] = MakoConstants.KEY_LF;
        masks[38] = MakoConstants.KEY_UP;
        masks[39] = MakoConstants.KEY_RT;
        masks[40] = MakoConstants.KEY_DN;

        document.body.addEventListener('keydown', function(e) {
            if(masks[e.keyCode]) {
                keys |= masks[e.keyCode];
            }
        });
        document.body.addEventListener('keyup', function(e) {
            if(masks[e.keyCode]) {
                keys &= ~masks[e.keyCode];
            }
        });

        numTicks = 0;
        numSyncs = 0;
        function gameloop() {
            stats.begin();
            var sync = false;
            for(var i = 0; i < 1000; i++) {
                // reached end of bytecode
                if(vm.m[vm.m[MakoConstants.PC]] === -1) {
                    clearInterval(intervalID);
                    console.log('done');
                }
                // either execute one tick or perform one sync
                if(vm.m[vm.m[MakoConstants.PC]] !== MakoConstants.OP_SYNC) {
                    vm.tick();
                    numTicks++;
                } else {
                    sync = true;
                    vm.sync();
                    vm.m[MakoConstants.PC]++;
                    vm.setKeys(keys);
                    numSyncs++;
                }
            }
            if(sync) {
                window.requestAnimationFrame(function() {
                    ctx.putImageData(imageData, 0, 0);
                    videoCtx.drawImage(hidden, 0, 0);
                });
            }
            stats.end();
        }

        intervalID = setInterval(gameloop, 1000 / 60);
    }

    exports.exec = exec;
    exports.setupStats = setupStats;

})(typeof exports === 'undefined' ? this : exports);
