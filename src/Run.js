if(require.main === module) {
    var Read = require("./Read.js");
    var Mako = require("./MakoVM.js");
    var rom = Read.readMakoRom(process.argv[2]);
    var vm = new Mako.MakoVM(rom);
    vm.run();
}
