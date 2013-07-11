// Reads a ROM in and exports it to JSON
if(require.main === module) {
    if(process.argv.length <= 2) {
        console.log("Usage: node Export.js [rom filename]");
        process.exit(1);
    }

    var readMakoRom = require("./Read.js").readMakoRom;
    var filename = process.argv[2];
    var rom = readMakoRom(filename);
    console.log(rom);
}
