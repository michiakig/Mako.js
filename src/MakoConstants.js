// MakoConstants.java
;(function(exports) {
    var c = {};
    c.OP_CONST  = 0;
    c.OP_CALL   = 1;
    c.OP_JUMP   = 2;
    c.OP_JUMPZ  = 3;
    c.OP_JUMPIF = 4;

    c.OP_LOAD   = 10;
    c.OP_STOR   = 11;
    c.OP_RETURN = 12;
    c.OP_DROP   = 13;
    c.OP_SWAP   = 14;
    c.OP_DUP    = 15;
    c.OP_OVER   = 16;
    c.OP_STR    = 17;
    c.OP_RTS    = 18;

    c.OP_ADD    = 19;
    c.OP_SUB    = 20;
    c.OP_MUL    = 21;
    c.OP_DIV    = 22;
    c.OP_MOD    = 23;
    c.OP_AND    = 24;
    c.OP_OR     = 25;
    c.OP_XOR    = 26;
    c.OP_NOT    = 27;
    c.OP_SGT    = 28;
    c.OP_SLT    = 29;
    c.OP_SYNC   = 30;
    c.OP_NEXT   = 31;

    c.PC =  0; // program counter
    c.DP =  1; // data stack pointer
    c.RP =  2; // return stack pointer

    c.GP =  3; // grid pointer
    c.GT =  4; // grid tile pointer
    c.SP =  5; // sprite pointer
    c.ST =  6; // sprite tile pointer
    c.SX =  7; // scroll X
    c.SY =  8; // scroll Y
    c.GS =  9; // grid horizontal skip
    c.CL = 10; // clear color
    c.RN = 11; // random number
    c.KY = 12; // key input

    c.CO = 13; // character-out (debug)
    c.AU = 14; // audio-out (8khz, 8-bit)
    c.KB = 15; // keyboard-in

    c.XO = 16; // bidirectional external IO
    c.XA = 17; // external argument
    c.XS = 18; // external status

    c.RESERVED_HEADER = 19;

    c.H_MIRROR_MASK = 0x10000; // sprite is mirrored horizontally?
    c.V_MIRROR_MASK = 0x20000; // sprite is mirrored vertically?
    c.GRID_Z_MASK = 0x40000000; // grid tile is drawn above sprites?

    c.KEY_UP = 0x01;
    c.KEY_RT = 0x02;
    c.KEY_DN = 0x04;
    c.KEY_LF = 0x08;
    c.KEY_A  = 0x10;
    c.KEY_B  = 0x20;
    c.KEY_MASK = c.KEY_UP | c.KEY_RT | c.KEY_DN | c.KEY_LF | c.KEY_A | c.KEY_B;

    c.X_CLOSE      = 0;
    c.X_OPEN_READ  = 1;
    c.X_OPEN_WRITE = 2;

    exports.MakoConstants = c;
})(typeof exports === 'undefined' ? this : exports);
