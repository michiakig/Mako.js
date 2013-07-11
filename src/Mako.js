// Mako.java
;(function(exports) {

    // var MakoConstants = require("./MakoConstants.js").MakoConstants;
    // var MakoVM = require("./MakoVM.js").MakoVM;
    // var write = require("./WriteNode.js").write;

    function draw(ctx, px, x, y) {
        var a = (px >> 24) & 0xff;
        var r = (px >> 16) & 0xff;
        var g = (px >> 8) & 0xff;
        var b = px & 0xff;
        var fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a / 255 + ')';
        ctx.fillStyle = fillStyle;
        ctx.fillRect(3 * x, 3 * y, 3, 3);
    }


    function update(ctx, vm) {
        for(var i = 0; i < vm.p.length; i++) {
            draw(ctx, vm.p[i], i % 320, Math.floor(i / 320));
        }
    }

    function exec(rom) {
        var vm = new MakoVM(write, rom);

        var canvas = document.getElementById('video');
        var ctx = canvas.getContext('2d');

        while(undefined !== vm.m[vm.m[MakoConstants.PC]] && vm.m[vm.m[MakoConstants.PC]] !== -1) {
            while(undefined !== vm.m[vm.m[MakoConstants.PC]] && vm.m[vm.m[MakoConstants.PC]] !== MakoConstants.OP_SYNC) {
                vm.tick();
            }
            vm.sync();
            vm.m[MakoConstants.PC]++;
            // vm.keys = ...

            update(ctx, vm);
        }
        console.log("done:" + vm.m[MakoConstants.PC]);
    }

    exports.exec = exec;
    exports.draw = draw;
    exports.update = update;

})(typeof exports === 'undefined' ? this : exports);
