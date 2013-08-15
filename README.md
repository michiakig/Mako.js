# Mako.js

From [the original project](https://github.com/JohnEarnest/Mako):

> Mako is a simple stack-based virtual game console, designed to be as
> simple as possible to implement. Maker is a compiler for a Forth-like
> language that targets the Mako VM.

This is a port of the Mako VM to JavaScript and canvas. See it in
action
[here](http://mako.js.s3-website-us-east-1.amazonaws.com/). (all of
the ROMs hosted there were compiled from example programs included in
the original project. source code for those programs can be found in
the Mako repo)

Mako's author has done an excellent job with the documentation for the
machine -- refer to [this
page](https://github.com/JohnEarnest/Mako/blob/master/docs/makoBasics.md)
for a detailed introduction to the Mako VM and the Maker
language. This port would have been substantially more difficult had
the documentation not been so good.

The original project comes with a number of demos and games, including
the delightful [Forth
Warrior](https://github.com/JohnEarnest/Mako/tree/master/games/Warrior2). Most
of the example programs run in this JavaScript implementation, but
there are some rough edges and quirks related to performance and
issues with the browser environment.

## how to build a ROM

1. Clone the original [Mako](https://github.com/JohnEarnest/Mako) repo
2. Build via `ant`
3. Compile a Maker program: `$ java -jar dist/Maker.jar games/Pong/Pong.fs Pong`

This gives you a binary ROM file that can be loaded into the
browser. Alternatively, I've compiled some of the examples and
hosted the binaries [here](http://mako.js.s3-website-us-east-1.amazonaws.com/).

## command-line tests

As much as possible, the Mako.js code is written such that it can be
run in the browser and in a "headless" JavaScript environment such as
node. To run a ROM on the command-line, with character IO written to
standard out, use the `run.js` script. There is a small test suite in
the Mako repo, which can be run this way.

    node src/run.js path/to/rom
