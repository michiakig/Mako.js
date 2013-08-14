// Mako.java
;(function(exports) {
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    var PIXEL_WIDTH = 320;
    var PIXEL_HEIGHT = 240;
    var videoOut, stats, ctx, videoCtx, imageData;
    var intervalID;

    /**
     * initialize canvas elements and Stats stuff
     */
    function setup() {
        if(!videoOut) {
            var hidden = document.getElementById('hidden');
            ctx = hidden.getContext('2d');
            var video = document.getElementById('video');
            videoCtx = video.getContext('2d');
            videoCtx.imageSmoothingEnabled = false;
            videoCtx.webkitImageSmoothingEnabled = false;
            videoCtx.mozImageSmoothingEnabled = false;
            videoCtx.scale(2, 2);
            imageData = ctx.getImageData(0, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
            videoOut = new VideoOut(PIXEL_WIDTH, PIXEL_HEIGHT, imageData);

            stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms

            stats.domElement.style.position = 'absolute';
            stats.domElement.style.right = '0px';
            stats.domElement.style.top = '0px';
            document.body.appendChild(stats.domElement);
        }
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
        setup();
        if(intervalID)
            clearInterval(intervalID);

        var vm = new MakoVM(write, videoOut, rom);
        var keys = 0;
        var masks = {};
        masks[37] = MakoConstants.KEY_LF;
        masks[38] = MakoConstants.KEY_UP;
        masks[39] = MakoConstants.KEY_RT;
        masks[40] = MakoConstants.KEY_DN;

        masks[13] /* enter */ = MakoConstants.KEY_A; // key-a
        masks[32] /* space */ = MakoConstants.KEY_A;
        masks[90] /* Z */ = MakoConstants.KEY_A;
        masks[88] /* X */ = MakoConstants.KEY_B; // key-b
        masks[16] /* shift */ = MakoConstants.KEY_B;

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
        document.body.addEventListener('keypress', function(e) {
            vm.pushKey(e.keyCode);
        });

        var ticks = 0;
        var showTicks = false;
        // run gameloop once per frame, for approx 60 FPS
        function gameloop() {
            stats.begin();
            while(true) { // for each frame, execute ticks until seeing a sync opcode
                if(vm.m[vm.m[MakoConstants.PC]] === -1) { // reached end of bytecode
                    clearInterval(intervalID);
                }
                // either (1) execute one tick or (2) perform one sync and then break
                if(vm.m[vm.m[MakoConstants.PC]] !== MakoConstants.OP_SYNC) {
                    vm.tick();
                    ticks++;
                } else {
                    vm.sync();
                    vm.m[MakoConstants.PC]++;
                    vm.setKeys(keys);
                    break; // yield to the browser for input
                }
            }
            ctx.putImageData(imageData, 0, 0);
            if(showTicks) {
                ctx.fillStyle = "rgb(0,255,0)";
                ctx.fillText(ticks, 20, 20);
                ticks = 0;
            }
            videoCtx.drawImage(hidden, 0, 0);
            stats.end();
        }
        intervalID = setInterval(gameloop, 1000 / 60);
    }

    exports.exec = exec;

})(typeof exports === 'undefined' ? this : exports);
