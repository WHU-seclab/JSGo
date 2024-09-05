# Configuration Instructions

## Introduction
The code produces end-to-end inputs capable of:

1. Passing a condition where the execution of the input RestFul APIs (obtained in **Replay** phase) diverges from the target code. The input RestFul APIs MUST store the data in '-d' option. For example, 'curl -G TARGET_URL -d "k1=v1&k2=v2"' or 'curl -X PUT TARGET_URL -d '{data}''
2. Triggering the vulnerability (if there is one) in a specified vulnerability type at the sink location.

## Configuration

Users must fill in the `config.json` file with the following information:

1. **Variable Names**: 
   - Description: Denotes variables used in the deviation condition.
   - Format: Comma-separated list of variable names.
   - Example: `"variable_names": "variable1, variable2"`

2. **Source File Path**: 
   - Description: Path to the source file in which the deviation condition or sink locates.
   - Format: Absolute or relative file path.
   - Example: `"source_file_path": "/path/to/source_file"`

3. **Line Number Right Before the Deviation Condition**: 
   - Description: Line number in the source file before the deviation condition.
   - Format: Integer value.
   - Example: `"inserted_line_number_before": 10`

4. **Line Number Right After the Deviation Condition**: 
   - Description: Line number in the source file after the deviation condition.
   - Format: Integer value.
   - Example: `"inserted_line_number_after": 12`

5. **Command Path**: 
   - Description: Delimited by commas, with four expected elements:
     - One for running the application.
     - One for stopping the application.
     - One for replaying the RESTful API. Please use one generated in replay/targetAlignTraces.
     - One for executing the reference test suites (obtained in **profile** phase).
   - Format: Comma-separated list of command paths.
   - Example: `"command_path": "/path/to/run_app,/path/to/stop_app,/path/to/replay_API,/path/to/execute_tests"`

6. **Line Number Right After the Next Deviation Condition Variable**: 
   - Description: Line number in the source file after the next deviation condition. We include it because we need to consider the contexts, the Deviation Condition -> the next Deviation condition
   - Format: Integer value.
   - Example: `"inserted_line_number_after": 14`

7. **Sink Line Number**: 
   - Description: Line number representing the sink.
   - Format: Integer value.
   - Example: `"sink_line_number": 20`

8. **Sink Type**: 
   - Description: Type of sink.
   - Format: String value.
   - Example: 
     - `"sink_type": "pp"` (Prototype Pollution)
     - `"sink_type": "xss"` (Reflected Cross-Site Scripting)
     - `"sink_type": "sqli"` (SQL Injection)

## Usage

Users can follow the provided usage guideline when running the application:

```bash
python main.py config.py
```

The finally generated payload is stored in curl_attack.sh, which is a PoC mutated from replay.sh.

## Example case

An example is provided in `pp`.
The example demonstrates how to configure two `config.json` to exploit a prototype pollution vulnerability in [parse-server](https://github.com/parse-community/parse-server). 

In `example.sh`, `main.py` is invoked twice with two different `config.json` files. 

```bash
python main.py pp/config.json
python main.py pp/config1.json
```


- The first invocation mutates the initial input, causing its execution to satisfy the first diverging condition.
- Subsequently, the second invocation manipulates the API generated from the first run. This manipulation ensures that its execution satisfies the second (also final) diverging condition, ultimately leading to triggering the prototype vulnerability at the specified sink location.

