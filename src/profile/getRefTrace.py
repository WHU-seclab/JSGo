#!/usr/bin/env python

import json
import subprocess
import os

def run_npm_test(entry, value, index):
    # Construct the npm command
    npm_command = f"npm run testonly -- spec/{entry} --filter='{value}'"
    print("Executing "+npm_command)

    # Create a directory for reftraces if it doesn't exist
    reftraces_dir = 'reftraces'
    os.makedirs(reftraces_dir, exist_ok=True)

    # Construct the file path for stderr output
    stderr_file = os.path.join(reftraces_dir, f'{index}.txt')

    # Run the npm command using subprocess and redirect stderr to the file
    with open(stderr_file, 'w') as stderr_file_o:
        subprocess.run(npm_command, shell=True, stderr=stderr_file_o, cwd='/parse-server')

    # Write entry and value to the first line of the file
    with open(stderr_file, 'r+') as file:
        content = file.read()
        file.seek(0, 0)
        file.write(f"Entry: {entry}, Value: {value}\n" + content)

def main():
    # Read the JSON file
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
                run_npm_test(entry, item[1], index)

if __name__ == "__main__":
    main()

