## Functionality

This part is responsible for finding end-to-end inputs whose executions overlap with the execution traces of running reachable unit testing code obtained in profile step.

### Requirement:

Ensure you have instrumented the program as required in the profile/ins_helper.py.

### Steps:

1. Start the NodeJS server-side application as we need to fuzz and replay some APIs.
2. Run the modified restler in /jsgo-restler to generate API sequences following [this guide](https://github.com/microsoft/restler-fuzzer).
3. Run `python getReplayReq.py` to obtain input APIs whose executions overlap with the execution traces of running reachable test suites obtained in profile phase. The results will be stored in `targetAlignTraces`.

### Example case:

We also provide the running results of the parse-serveer example in this Reply phase stored in `targetAlighTraces_example`. If you are interested in the Mutate phase, you can skip all prior steps and directly use the files in `targetAlighTraces_example`. These are all what we need in the following mutation phase.

