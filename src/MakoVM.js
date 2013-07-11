;(function(exports) {
    // MakoConstants.java
    var OP_CONST  = 0;
    var OP_CALL   = 1;
    var OP_JUMP   = 2;
    var OP_JUMPZ  = 3;
    var OP_JUMPIF = 4;

    var OP_LOAD   = 10;
    var OP_STOR   = 11;
    var OP_RETURN = 12;
    var OP_DROP   = 13;
    var OP_SWAP   = 14;
    var OP_DUP    = 15;
    var OP_OVER   = 16;
    var OP_STR    = 17;
    var OP_RTS    = 18;

    var OP_ADD    = 19;
    var OP_SUB    = 20;
    var OP_MUL    = 21;
    var OP_DIV    = 22;
    var OP_MOD    = 23;
    var OP_AND    = 24;
    var OP_OR     = 25;
    var OP_XOR    = 26;
    var OP_NOT    = 27;
    var OP_SGT    = 28;
    var OP_SLT    = 29;
    var OP_SYNC   = 30;
    var OP_NEXT   = 31;

    var PC =  0; // program counter
    var DP =  1; // data stack pointer
    var RP =  2; // return stack pointer

    var GP =  3; // grid pointer
    var GT =  4; // grid tile pointer
    var SP =  5; // sprite pointer
    var ST =  6; // sprite tile pointer
    var SX =  7; // scroll X
    var SY =  8; // scroll Y
    var GS =  9; // grid horizontal skip
    var CL = 10; // clear color
    var RN = 11; // random number
    var KY = 12; // key input

    var CO = 13; // character-out (debug)
    var AU = 14; // audio-out (8khz, 8-bit)
    var KB = 15; // keyboard-in

    var XO = 16; // bidirectional external IO
    var XA = 17; // external argument
    var XS = 18; // external status

    var RESERVED_HEADER = 19;

    var H_MIRROR_MASK = 0x10000; // sprite is mirrored horizontally?
    var V_MIRROR_MASK = 0x20000; // sprite is mirrored vertically?
    var GRID_Z_MASK = 0x40000000; // grid tile is drawn above sprites?

    var KEY_UP = 0x01;
    var KEY_RT = 0x02;
    var KEY_DN = 0x04;
    var KEY_LF = 0x08;
    var KEY_A  = 0x10;
    var KEY_B  = 0x20;
    var KEY_MASK = KEY_UP | KEY_RT | KEY_DN | KEY_LF | KEY_A | KEY_B;

    var X_CLOSE      = 0;
    var X_OPEN_READ  = 1;
    var X_OPEN_WRITE = 2;

    // MakoVM.java
    function MakoVM(write, rom) {
        // copy ROM into main memory
        var m = new Array(rom.length);
        for(var i = 0; i < rom.length; i++) {
            m[i] = rom[i];
        }
        this.m = m;

        this.p = new Array(320 * 240);

        function push(v)   { m[m[DP]++] = v; }
        function rpush(v)  { m[m[RP]++] = v; }
        function pop()     { return m[--m[DP]]; }
        function rpop()    { return m[--m[RP]]; }
        function mod(a, b) { a %= b; return a < 0 ? a+b : a; }
        function div(a, b) { return Math.floor(a/b); }

        function run() {
            while(m[m[PC]] !== OP_SYNC) {
                tick();
                if(m[PC] === -1) { return; }
            }
            //    sync();
            m[PC]++;
        }
        this.run = run;

        function tick() {
            var o = m[m[PC]++];
            var a, b;
            switch(o) {
            case OP_CONST  : push(m[m[PC]++]);                        break;
            case OP_CALL   : rpush(m[PC]+1); m[PC] = m[m[PC]];        break;
            case OP_JUMP   :                 m[PC] = m[m[PC]];        break;
            case OP_JUMPZ  : m[PC] = pop()==0 ? m[m[PC]] : m[PC]+1;   break;
            case OP_JUMPIF : m[PC] = pop()!=0 ? m[m[PC]] : m[PC]+1;   break;
            case OP_LOAD   : push(load(pop()));                       break;
            case OP_STOR   : stor(pop(),pop());                       break;
            case OP_RETURN : m[PC] = rpop();                          break;
            case OP_DROP   : pop();                                   break;
            case OP_SWAP   : a = pop(); b = pop(); push(a); push(b);  break;
            case OP_DUP    : push(m[m[DP]-1]);                        break;
            case OP_OVER   : push(m[m[DP]-2]);                        break;
            case OP_STR    : rpush(pop());                            break;
            case OP_RTS    : push(rpop());                            break;
            case OP_ADD    : a = pop(); b = pop(); push(b+a);         break;
            case OP_SUB    : a = pop(); b = pop(); push(b-a);         break;
            case OP_MUL    : a = pop(); b = pop(); push(b*a);         break;
            case OP_DIV    : a = pop(); b = pop(); push(div(b,a));    break;
            case OP_MOD    : a = pop(); b = pop(); push(mod(b,a));    break;
            case OP_AND    : a = pop(); b = pop(); push(b&a);         break;
            case OP_OR     : a = pop(); b = pop(); push(b|a);         break;
            case OP_XOR    : a = pop(); b = pop(); push(b^a);         break;
            case OP_NOT    : push(~pop());                            break;
            case OP_SGT    : a = pop(); b = pop(); push(b>a ? -1:0);  break;
            case OP_SLT    : a = pop(); b = pop(); push(b<a ? -1:0);  break;
            case OP_NEXT   : m[PC] = --m[m[RP]-1]<0?m[PC]+1:m[m[PC]]; break;
            }
        }

        function load(addr) {
            if(addr === RN) { /* TODO: random number */ }
            if(addr === KY) { return -1; /*keys*/ }
            if(addr === KB) {
                //        if(keyQueue.length > 0) { return keyQueue.shift(); }
                return -1;
            }
            if(addr === CO) {
                /* TODO: reading from CO not yet implemented */
                return -1;
            }
            if(addr === XO) {
                /* TODO: external IO not implemented at all */
                return -1;
            }
            if(addr === XS) {
                return -1;
            }
            return m[addr];
        }

        function stor(addr, value) {
            if (addr === CO) { write(String.fromCharCode(value)); }
            if (addr === AU) {
                /* TODO: audio out */
            }
            if (addr === XO) {
                /* TODO: external IO */
            }
            if (addr === XS) {
                /* TODO: external status */
            }
            m[addr] = value;
        }
    }

    exports.MakoVM = MakoVM;

})(typeof exports === 'undefined' ? this : exports);
