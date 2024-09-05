exports.flowTest = function (lo, hi) {

    console.log("Inputs: Hi:", hi, "Lo:", lo);

    var result = lo * 42;

    if (lo > 4) {
        console.log("Branch A-then");
        result -= lo;
    } else {
        console.log("Branch A-else");
        if (hi == 777) {
            result = -result;
        }
    }

    if (hi > 0) {
        console.log("Branch B-then");
    } else {
        console.log("Branch B-else");
    }

    console.log("Low output:", result);

    return result;
}

