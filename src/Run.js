// Reads a ROM in and runs it
if(require.main === module) {
    if(process.argv.length <= 2) {
        console.log("Usage: node Run.js [rom filename]");
        process.exit(1);
    }

    var readMakoRom = require("./Read.js").readMakoRom;
    var MakoVM = require("./MakoVM.js").MakoVM;

    var filename = process.argv[2];
    var rom = readMakoRom(filename);
    var vm = new MakoVM(rom);
    vm.run();
}
