// Reads a ROM in and runs it
if(require.main === module) {
    if(process.argv.length <= 2) {
        console.log("Usage: node run.js [rom filename]");
        process.exit(1);
    }

    var write = require("./write_node.js").write;
    var readMakoRom = require("./read.js").readMakoRom;
    var MakoVM = require("./mako_vm.js").MakoVM;
    var exec = require("./mako.js").exec;

    var filename = process.argv[2];
    var rom = readMakoRom(filename);
    exec(rom);
}
