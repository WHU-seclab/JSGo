import os
import sys
import re
import subprocess
import shlex

index=0

def writeLog2Folder(command):
    global index
    targetTraces_dir = 'targetAlignTraces'
    os.makedirs(targetTraces_dir, exist_ok=True)

    stderr_file = os.path.join(targetTraces_dir, f'{index}.txt')
    index=index+1

    if os.path.exists('/rtTrace'):
        os.rename('/rtTrace', stderr_file)
        #Also tell the replayer which API trigger the error code
        with open(stderr_file, "a") as f:
            # Write string with newline and variable value to file
            f.write("******\n" + command)

def extract_last_restler_subblock(block):
    pattern = re.compile(r'\t- restler_.*?\n\n', re.DOTALL)
    subblocks = pattern.findall(block)
    return [subblock.strip() for subblock in subblocks][-1] if subblocks else None

def extract_last_sending_string(block):
    pattern = re.compile(r'Sending: \'(.*?)\'\n')
    matches = pattern.findall(block)
    return matches[-1] if matches else None

def http_to_curl(input_string):
    # Split the input string into tokens
    input_string=re.sub(r'\\r\\n', ' ', input_string)
    tokens = re.split(r'(\s+)', input_string)
    tokens = [token for token in tokens if token.strip()]
    print(tokens)

    # Identify and assemble components
    method = tokens[0]
    url = tokens[1]
    headers = {}
    body_start = False
    body = ""

    for i in range(2, len(tokens)):
        if tokens[i][0] == "{":
            body_start = True
            body = body+tokens[i]+" "
        elif body_start:
            body += tokens[i] + " "
        else:
            #print(tokens[i])
            if ":" != tokens[i][-1]:
                continue
            key = tokens[i][:-1]
            if (key=="Content-Length") or key=="x-restler-sequence-id":
                continue
            headers[key.strip()] = tokens[i+1]
            if (key=="Host"):
                url="http://"+tokens[i+1]+url

    # Assemble curl command
    curl_command = f"curl -X {method} {url}"

    for key, value in headers.items():
        curl_command += f" -H '{key}: {value}'"
    if body:
        body=body.replace("\\n","")
        body=body.replace("\\t","")
        curl_command += f" -d '{body.strip()}'"

    try:
        # Run the curl command in the shell
        print("Executing "+curl_command)
        subprocess.run(curl_command, shell=True, check=True)
        writeLog2Folder(curl_command)

    except subprocess.CalledProcessError as e:
        print(f"Errr executing curl command: {e}")

    return curl_command


if len(sys.argv) != 2:
    print("\033[91mPlease provide the absolute program of the logging results of running Reslter, e.g., /restler-fuzzer/restler_bin/Fuzz/RestlerResults/experiment4341/logs\033[0m")
    print("Usage: python script.py <folder_path>")
    sys.exit(1)

folder_path = sys.argv[1]

if not os.path.exists(folder_path):
    print(f"Error: Folder '{folder_path}' does not exist.")
    sys.exit(1)

file_last_restler_subblocks = {}
file_last_sending_strings = {}

# remove /rtTrace so that we can generate and use it later
if os.path.exists('/rtTrace'):
    os.remove('/rtTrace')

for filename in os.listdir(folder_path):
    if filename.startswith("network.testing."):
        file_path = os.path.join(folder_path, filename)
        with open(file_path, 'r') as file:
            contents = file.read()
        blocks = contents.split("Generation-")
        blocks = [block.strip() for block in blocks if block.strip()]
        file_last_restler_subblocks[filename] = [extract_last_restler_subblock(block) for block in blocks]
        file_last_sending_strings[filename] = [extract_last_sending_string(block) for block in blocks]

for filename, (last_subblocks_list, last_sending_strings_list) in zip(file_last_restler_subblocks.keys(), zip(file_last_restler_subblocks.values(), file_last_sending_strings.values())):
    print(f"File: {filename}")
    print("Last Restler Sub-Blocks:")
    for i, (last_subblock, last_sending_string) in enumerate(zip(last_subblocks_list, last_sending_strings_list)):
        print(f"Block {i + 1}:")
        if last_subblock is not None:
            print(last_subblock)
            print("-" * 20)
        else:
            print("No matching sub-block found.")

        if last_sending_string is not None:
            print(f"Last Sending String: {last_sending_string}")
            print("-" * 20)
            http_to_curl(last_sending_string)
        else:
            print("No matching sending string found.")
    print("=" * 40)

