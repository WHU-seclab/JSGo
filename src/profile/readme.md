The code identifies unit tests that execute the target code and generates execution traces for those tests. These traces are stored in `refAlignTraces`.

### Requirements:
Before running the Python code, add a `testonly` entry in the `scripts` section of the `package.json` file. The value of `testonly` should be one of the following: "Jasmine", "Jest", "Mocha", or similar. Ensure that executing `npm run testonly` successfully runs the application's test suites.

### Usage:
To use the tools, run `getRefInput.py`, `ins_helper.py`, and `getRefTraceAligned.py` with the appropriate arguments.

### Example:
Refer to `parser-server-example.sh` for an example. The results for this example should be the files in `example_results_refAlignTraces`.

1. **Do not directly run** `parser-server-example.sh`. You need to manually instrument code based on the output of `python3 ins_helper.py 255`. We have provided our prepared instrumented code at `/Apps/parse-server/lib/Controllers/DatabaseController.js`. The instrumentation code (lines 5-16 and other callsites that call `writeToStackTraceFile()`) is commented out, you need to uncomment the instrumentation code. It is better not to add/delete lines when you uncomment/comment code because the later scripts use the source code line information. If you change line numbers, you will need to correspondingly updates line numbers in latet scripts.
2. You can keep the instrumentation code in `profile` and `replay` phases as the `replay` phase also need the instrumentation code to record runtime information, but remember to comment out the instrumentation code in `mutate` phase.
3. It is OK to see some "Error messages" during execution, as errors are used to log runtime information when running test suites.
