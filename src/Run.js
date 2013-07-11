// Reads a ROM in and runs it
if(require.main === module) {
    if(process.argv.length <= 2) {
        console.log("Usage: node Run.js [rom filename]");
        process.exit(1);
    }

    var write = require("./WriteNode.js").write;
    var readMakoRom = require("./Read.js").readMakoRom;
    var MakoVM = require("./MakoVM.js").MakoVM;
    var exec = require("./Mako.js").exec;

    var filename = process.argv[2];
    var rom = readMakoRom(filename);
    exec(rom);
}
