# Mako.js

From [the original project](https://github.com/JohnEarnest/Mako):

> Mako is a simple stack-based virtual game console, designed to be as
> simple as possible to implement. Maker is a compiler for a Forth-like
> language that targets the Mako VM.

This is a port of Mako to JavaScript with a canvas renderer.

## how to build a ROM

1. Clone the original [Mako](https://github.com/JohnEarnest/Mako) repo.
2. Build the Mako project via `ant`.
3. Compile a Maker program into a ROM: `$ java -jar dist/Maker.jar games/Pong/Pong.fs pong`

This gives you a binary ROM file that can be loaded into the
browser. Alternatively, I've compiled some of the examples and
included the binaries in this repo.
