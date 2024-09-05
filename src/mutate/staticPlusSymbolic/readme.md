# Introduction

In certain scenarios of software testing, it becomes necessary to control the runtime value of a variable `VAR` to a specific value `VAL`, where `VAL` is obtained from executing reachable testing code or is a predefined attack payload. This part provides a method to mutate the end-to-end inputs such that `VAR` takes on the specified value `VAL`. This is especially useful when direct control over `VAR` is not possible due to the program's encoding operations on direct input bytes.

There are two primary scenarios where this code is applicable:

1. When `VAR` is a variable within a condition `Cond`. During the execution of test suites, the condition `Cond` is satisfied. However, when executing end-to-end inputs, the execution diverges from `Cond`. In such cases, setting `VAL` as the runtime value of `VAR` during test suite execution ensures that the execution also satisfies the diverging condition `Cond`.

2. When the execution reaches a sink, and `VAR` is a variable used within the sink. Here, `VAL` is set as the prepared payloads for `VAR`.

## Usage

To use this code, follow these steps:

1. Insert `sink_jsfuzz(VAR);` right before the condition you want to satisfy or the sink function (see `example_1.js`).

2. Run ODGen. For example:
    ```
    python3 ./ODGen/odgen.py ./example_1.js -ma
    python3 ./ODGen/odgen.py ./example_1.js --dataflow
    ```
    ODGen will output variables that `VAR` is data-dependent on.

3. For each output data-dependent variable, check its runtime value (e.g., insert `console.log(VAR)`) and verify whether its runtime value is consistent with input bytes. If consistent, symbolize it. Otherwise, continue backward checking its consistency with data-dependent variables. In the example, `A` and `B` are the variables that `VAR` is data-dependent on.

4. Following the instructions in [ExpoSE GitHub](https://github.com/ExpoSEJS/ExpoSE), symbolize all source variables and set the initial value to be the runtime values of executing end-to-end inputs. Insert a condition `if (equal(VAR, VAL) == True) {}\n process.exit(1);` right before the `Cond` you want to satisfy or the sink function. Also, invoke the app/module as required by ExpoSE (see `example_2.js` as an example).

5. Run ExpoSE to execute the app (in the example, it is `/expoSE/expoSE+ /pppj/src/mutate/staticPlusSymbolic/example_2.js`). The modified ExpoSE will symbolically execute ONE program path that end at `Cond`. You should see outputs in the terminal like `Writing output to *.json`. Open that JSON file and search for `"stringifiedPC:"`. There are multiple constraints separated by commas. Count the number `NUM` of constraints and search for `"_bound": NUM`. The inputs required to set `VAR` (i.e., `C`) value to `VAL` (i.e., `123`) are listed in the `"input":`.

In the example.js, it is `"A": 0`, and `"B": 113`. That is, we set the required values of inputs `A` and `B` to satisfy the condition `if (crypto.createHash('sha256').update(String(C)).digest('hex') === expectedHash)`.


