#!/usr/bin/env python

from pathlib import Path
import argparse
import os
import subprocess
import json
import re
import shutil

def insert_error_code(source_file, line):
    backup_file = source_file + ".bak"
    shutil.copyfile(source_file, backup_file)
    with open(source_file, 'r') as f:
        lines = f.readlines()

    lines.insert(line - 1, "Error.stackTraceLimit = 2000;\nconst error = new Error('Custom error message');\nconsole.error(error.stack);\n")

    with open(source_file, 'w') as f:
        f.writelines(lines)

def extractDes(dir):
    pj_dir=os.path.dirname(dir)
    it_dis_dict={}
    error_details={}
    if Path(dir).exists() and Path(dir).is_dir():
        directory=Path(dir)
        spec_js_files = [file for file in directory.glob('**/*.js') if file.is_file()]

        #find str in it('str') or it("str") or fit('str') or fit("str")
        pattern = re.compile(r"(it|fit|test)\(['\"](.*?)['\"],", re.DOTALL)
        for spec_js_file in spec_js_files:
            print(str(spec_js_file))
            with open(spec_js_file, 'r') as file:
                spec_content = file.read()
            matches = re.findall(pattern, spec_content)
            #find the test cases that reach the vulnerable location
            for match in matches:
                npm_command = f"npm run testonly -- {spec_js_file} --filter=\"{match[1]}\""
                try:
                    print(f"Running {npm_command}")
                    result = subprocess.run(npm_command, shell=True, cwd=dir, capture_output=True, text=True)
                    #print(result.stderr)
                    if "Custom error message" in result.stderr:
                        # Add spec_js_file and match[1] to the error_details dictionary
                        print("Found reachable test cases!")
                        if spec_js_file.name not in error_details:
                            error_details[spec_js_file.name] = []
                        error_details[spec_js_file.name].append(match[1])
                except subprocess.CalledProcessError as e:
                    print(f"Error running npm command for {spec_js_file}: {e}")

        with open("ref.json", "w") as json_file:
            json.dump(error_details, json_file, indent=2)

def recover_code(source_file):
    backup_file = source_file + ".bak"
    shutil.copyfile(backup_file, source_file)
    os.remove(backup_file)
    print(f"Original file recovered: {source_file}")

def getTrace(program_path):
    with open('ref.json', 'r') as file:
        data = json.load(file)

    index=0
    # Iterate through each entry in the JSON file
    for entry, value in data.items():
        if isinstance(value, list):
            for item in enumerate(value):
                # Execute npm run testonly for each item in the list
                print(entry, value, index)
                index=index+1
                run_npm_test(entry, item[1], index, program_path)

def run_npm_test(entry, value, index, program_path):
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
        subprocess.run(npm_command, shell=True, stderr=stderr_file_o, cwd=program_path)

    # Write entry and value to the first line of the file
    with open(stderr_file, 'r+') as file:
        content = file.read()
        file.seek(0, 0)
        file.write(f"Entry: {entry}, Value: {value}\n" + content)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Testing files, line, file, and app_path of a target vulnerability.")
    parser.add_argument('--spec', type=str, help="Path to testing files.")
    parser.add_argument('--source_file', type=str)
    parser.add_argument('--line', type=int)
    parser.add_argument('--program_path', type=str, help="Path to the target application")

    args = parser.parse_args()
    spec_path = args.spec
    source_file = args.source_file
    line = args.line
    program_path = args.program_path

    if spec_path is None or line is None or source_file is None or program_path is None:
        parser.print_help()
    else:
        #print(dis_dict)
        insert_error_code(source_file, line)
        if not os.path.exists('ref.json'):
            extractDes(spec_path)
        getTrace(program_path)
        recover_code(source_file)
