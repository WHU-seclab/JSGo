/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require('S$');
const bModule = require('./B');

function verify(f) {

    var loInput = S$.symbol('LO', 0);
    var hiInput1 = S$.symbol('HI1', 10);
    var hiInput2 = S$.symbol('HI2', 10);

    //var loInput = 1;
    //var hiInput1 = 2;
    //var hiInput2 = 3;

    var loOutput1 = f(loInput, hiInput1);
    var loOutput2 = f(loInput, hiInput2);

    if (loOutput1 !== 777) {
        S$.assert(loOutput1 === loOutput2);
    }
}

verify(bModule.flowTest);
