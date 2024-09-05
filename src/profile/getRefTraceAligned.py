#!/usr/bin/env python

import json
import subprocess
import os
import sys
import shutil
sys.path.append("..")
import utils.filterTrace as filterTrace

def run_npm_test(entry, value, index, program_path, sink_loc):
    # Construct the npm command
    npm_command = f"npm run testonly -- spec/{entry} --filter='{value}'"
    print("Executing "+npm_command)

    # Create a directory for reftraces if it doesn't exist
    reftraces_dir = 'refAlignTraces'
    os.makedirs(reftraces_dir, exist_ok=True)

    # Construct the file path for stderr output
    stderr_file = os.path.join(reftraces_dir, f'{index}.txt')

    # Run the npm command using subprocess and redirect stderr to the file
    subprocess.run(npm_command, shell=True, cwd=program_path)

    filterTrace.filter_and_save_entries('./rtTrace', stderr_file, sink_loc)

    # Write entry and value to the first line of the file
    with open(stderr_file, 'a+') as file:
        content = file.read()
        file.seek(0, 0)
        file.write(f"Entry: {entry}, Value: {value}\n" + content)

def main():
    print("\033[91mEnsure that you have instrumented code in ins_helper.py before running this, otherwise, you get nothing.\033[0m")

    if len(sys.argv) != 3:
        description_program_path = "The path of the program file, which should be the same as the one used in getRefInput.py."
        description_sink_loc = "The new location after instrumentation, which should be the new location after instrumentation as provided by ins_helper.py."
        print("Program path:", description_program_path)
        print("Sink location:", description_sink_loc)
        print("Usage: python script.py <program_path> <sink_loc>")
        sys.exit(1)

    program_path = sys.argv[1]
    sink_loc = sys.argv[2]

    with open('ref.json', 'r') as file:
        data = json.load(file)

    index=0
    # Iterate through each entry in the JSON file
    for entry, value in data.items():
        # Assuming each entry in the JSON file is a list
        # print(entry)
        if isinstance(value, list):
            for item in enumerate(value):
                # Execute npm run testonly for each item in the list
                print(entry, value, index)
                index=index+1
                run_npm_test(entry, item[1], index, program_path, sink_loc)

if __name__ == "__main__":
    main()

