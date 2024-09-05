const crypto = require('crypto');
var S$ = require('S$');

function compute(A, B) {
    var C = 0;
    if (A > 3) {
        B -= 2;
        A = A + B;
    }
    else {
        if (A == 126) {
            B = B * 2;
        }
        else {
            B = B + 10;
        }
    }
    C = C + 2*A + B;
    return C;
}

function processInputsAndCheckHash(A, B) {
    var symA = S$.symbol('A', 0);
    var symB = S$.symbol('B', 0);
    let C = compute(symA, symB);
    let expectedHash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
    //instrumentation
    if (C===123) { //runtime value of C observed when executing test suites
    }
    process.exit(1);
    //instrumentation
    if (crypto.createHash('sha256').update(String(C)).digest('hex') === expectedHash) {
        return true;
    } else {
        return false;
    }
}

module.exports = processInputsAndCheckHash;
processInputsAndCheckHash(1, 2)
