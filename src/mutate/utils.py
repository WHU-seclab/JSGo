import subprocess
import os
import sys
import json
import re
import time
import secrets
import string
import linecache
from vul_utils import *
from urllib.parse import parse_qs
from urllib.parse import urlencode

# get the runtime value of variable_names at line_number_before and line_number_after in source_file when executing commmand
# the rtvalues are stored in /before.txt and /after.txt
def get_value(variable_names, source_file, line_number_before, line_number_after, commands):
    # Backup the original source file
    os.system(f"cp {source_file} {source_file}.bak")

    if os.path.exists('/before.txt'):
        os.remove('/before.txt')
    if os.path.exists('/after.txt'):
        os.remove('/after.txt')
    
    # Read the source JavaScript file
    with open(source_file, 'r') as f:
        source_code = f.readlines()

    # Instrument the code to write the JSON representation of the variable to a file
    source_code.insert(line_number_before - 1, f"const fs = require('fs');\n")
    for variable_name in variable_names.split(","):
        source_code.insert(line_number_before, f"fs.appendFileSync('/before.txt', '{variable_name}' + ' ' + JSON.stringify({variable_name})+'\\n', {{ encoding: 'utf8', flag: 'a' }});\n") # Use append mode because the execution might reach the code multiple times
        line_number_after = line_number_after+1
    if line_number_after > 0:
        for variable_name in variable_names.split(","):
            source_code.insert(line_number_after, f"fs.writeFileSync('/after.txt', '{variable_name}' + ' ' + JSON.stringify({variable_name})+'\\n', {{ encoding: 'utf8', flag: 'w' }});\n")  # Use overide mode because we only need one passing variable

    # Write the instrumented code back to the source file
    with open(source_file, 'w') as f:
        f.writelines(source_code)

    # Execute the command
    stop_command=""
    if isinstance(commands, list):
        if len(commands)==3:
            stop_command=commands[1]
            commands=commands[:1]+commands[2:] # We exclude the stop_command and execute it later
        for command in commands:
            os.chmod(command, 0o755)
            print(command)
            subprocess.Popen(['./' + command], stdout=subprocess.PIPE) # Use Popen instead of run, otherwise it blocks the main script process.
            time.sleep(4)
    else:
        os.chmod(commands, 0o755)
        subprocess.run(['./' + commands], stdout=subprocess.PIPE) # Use run here because the main process need to wait for the process execution results of testsuites

    # Restore the original source file
    os.system(f"cp {source_file} {source_file}.bak.bak")
    os.system(f"mv {source_file}.bak {source_file}")

    # Stop the server app
    if stop_command!="":
        os.chmod(stop_command, 0o755)
        subprocess.run(['./' + stop_command], check=True) 

    return

# Check if the input is JSON object
def is_json_object(input_str):
    try:
        json_object = json.loads(input_str)
        return True
    except Exception:
        return False

# Function to convert type of the variable values read from files.
# "123" -> 123, "\"123\"" -> '123', "true" -> true, "\"true\"" -> "true", '{"key": "value"}' -> {"key": "value"}, '"{"key": "value"}"'-> "{\"key\": \"value\"}"
def type_conversion(s):
    # First check whether s is a JSON object
    is_json = is_json_object(s)
    if is_json:
        json_object = json.loads(s)
        return json_object, False
    elif isinstance(s, str):
        try:
            # Try converting to integer if it's an integer
            if s.isdigit() or (s[0] == '-' and s[1:].isdigit()):
                num = int(s)
                return num, False
            # Otherwise, try converting to float
            num = float(s)
            return num, False
        except ValueError:
            if s.lower() == 'true':
                return True, False
            elif s.lower() == 'false':
                return False, False
            else:
                # If no conversion works, return the a string
                s = remove_quotes(s)
                return s, True
    else:
        return s, False

# flatten a dict and print all its keys and values
def read_dict(data):
    flattened_list = []
    for key, value in data.items():
        if isinstance(value, dict):
            # Recursively flatten nested dictionaries
            flattened_list.append(key)
            flattened_list.extend(read_dict(value))
        elif isinstance(value, list):
            # Flatten lists by converting each element to a string
            for item in value:
                if isinstance(item, dict):
                    flattened_list.append(key)
                    flattened_list.extend(read_dict(item))
                else:
                    flattened_list.append(key)
                    flattened_list.append(item)
        else:
            flattened_list.append(key)
            flattened_list.append(value)
    return flattened_list

#read_rtvalues('{"key1":"value1","key2":42,"key3":["array","of","values"],"key4":{"nestedKey":"nestedValue"}}')
#key1 value1 key2 42 key3 array of values key4 nestedKey nestedValue
def read_rtvalues(json_string):
    # Flattening dict and list
    try:
        # Attempt to parse the JSON string
        parsed_data = json.loads(json_string)
        
        if isinstance(parsed_data, dict):  # Check if parsed data is a dictionary
            # Extract key-value pairs from the dictionary and print them in one line
            ret = read_dict(parsed_data)
        else:
            # Print the parsed data if it's not a dictionary
            ret = parsed_data
    except json.decoder.JSONDecodeError:
        # If the JSON decoding fails, it's a basic type
        ret = json_string

    # it is basic type, we do basic conversion
    ret, isString = type_conversion(ret)
    # Check if this is a string
    if isString and (ret.startswith('"') and ret.endswith('"') or \
        (ret.startswith('"') and ret.endswith('"'))):
        # Remove the first and last character (double quotes)
        ret = ret[1:-1]

    return ret

# recursively read json objects
def read_json_string(input_string):
    data = json.loads(input_string)
    key_value_pairs = read_dict(data)

    return key_value_pairs

def remove_quotes(input_str):
    input_str = input_str.rstrip()
    if (input_str.startswith("'") and input_str.endswith("'")) or \
    (input_str.startswith('"') and input_str.endswith('"')):
        input_str = input_str[1:-1]
    else:
        input_str = input_str
    
    return input_str

def add_quotes(input_string):
    if not ((input_string.startswith("'") and input_string.endswith("'")) or \
            (input_string.startswith('"') and input_string.endswith('"'))):
        return f"'{input_string}'"
    else:
        return input_string

# the input_str is a command that execute the app, the output_str is the value of variable during the execution
# the output is a list that include matched values
def compare_value(input_str, output_str):
    # Initialize an empty list to store the matched values
    value_list = []

    index = input_str.find(" -d ")
    curl_command = input_str
    input_list = []
    output_list = []
    if index != -1:
        input_str = input_str[index + 4:]
        #remove trailing \n and leading and trailing ' and " from the http parameter 
        input_str = remove_quotes(input_str)
        if not is_json_object(input_str):
            input_str = parse_query_string(input_str)
        print(input_str)
        input_list = read_json_string(input_str) #the http parameters are json objects
    
    # headers can be manipulated though tools like burpsuite.
    headers = re.findall(r"-H '([^']+)'", curl_command)
    headers_dict = {}
    for header in headers:
        header_parts = header.split(':', 1)
        if len(header_parts) == 2:
            key = header_parts[0].strip()
            value = header_parts[1].strip()
            headers_dict[key] = value
        else:
            input_list.append(header)
    header_list = read_dict(headers_dict)
    input_list = input_list + header_list
    print(input_list)

    for line in output_str.splitlines():
        # Call read_rtvalues() function for each profiled line
        ele = line.split(' ', 1)
        if len(ele)<2: 
            return value_list
        ele = ele[1]
        ele = read_rtvalues(ele)
        output_list.append(ele)
    print(output_list)
    
    # Iterate over each element in the input list
    for input_elem in input_list:
        # Find the index of the matching element in the output list
        if input_elem in output_list:
            value_list.append(input_elem)
    
    return value_list

i=1 # We variablely mutate dict to avoid value collision
# Function to recursively modify a dictionary including its keys and values
def modify_dict(d, value_list, ref_target_map):
    modified_dict = {}
    global i
    for key, value in d.items():
        # Keys in JSON objects must be in string type
        if key in value_list: # Can be controlled by input bytes
            print(f"\033[90mMutating {key}\033[0m")
            if ref_target_map is None:
                key = generate_random_string()
            elif key in ref_target_map and isinstance(ref_target_map[key], str): # We have a designate value instead of mutating to a random value, note the value to replace should be in the same type of the value being replaced
                key = ref_target_map[key]
        if isinstance(value, dict):
            modified_dict[key] = modify_dict(value, value_list, ref_target_map)
        elif isinstance(value, bool):
            # we cannot determine which field in a body corresponding to rtvalues now
            if value in value_list: 
                print(f"\033[90mMutating {value}\033[0m")
                if ref_target_map is None:
                    modified_dict[key] = not value
                elif value in ref_target_map: 
                    modified_dict[key] = ref_target_map[value]
                else:
                    modified_dict[key] = value
            else: #we cannot control this value and we keep it
                modified_dict[key] = value
        elif isinstance(value, (int, float)):
            if value in value_list:
                print(f"\033[90mMutating {value}\033[0m")
                if ref_target_map is None:
                    modified_dict[key] = value+i
                    i = i+1
                elif value in ref_target_map:
                    modified_dict[key] = ref_target_map[value]
                else:
                    modified_dict[key] = value
            else:
                modified_dict[key] = value
        elif isinstance(value, str):
            if value in value_list:
                print(f"\033[90mMutating {value}\033[0m")
                if ref_target_map is None:
                    modified_dict[key] = value[:-1] + chr(ord(value[-1])+i) if value else value
                    i = i+1
                elif value in ref_target_map:
                    modified_dict[key] = ref_target_map[value]
                else:
                    modified_dict[key] = value
            else:
                modified_dict[key] = value
        elif isinstance(value, list):
            modified_dict[key] = [modify_list_item(item, value_list, ref_target_map) for item in value]
        else:
            modified_dict[key] = value
    return modified_dict

# Function to mutate a list 
def modify_list_item(item, value_list, ref_target_map):
    global i
    if isinstance(item, bool):
        if value in value_list:
            print(f"\033[90mMutating {value}\033[0m")
            if ref_target_map is None:
                return not item
            elif value in ref_target_map:
                return ref_target_map[value]
            else:
                return value
        else:
            return value
    elif isinstance(item, (int, float)):
        if value in value_list:
            print(f"\033[90mMutating {value}\033[0m")
            if ref_target_map is None:
                ret = item+i
                i = i+1
                return ret
            elif value in ref_target_map:
                return ref_target_map[value]
            else:
                return value
        else:
            return value
    elif isinstance(item, str):
        if value in value_list:
            print(f"\033[90mMutating {value}\033[0m")
            if ref_target_map is None:
                ret = ''.join(chr(ord(char) + 1) for char in item)
                i = i+1
                return ret
            elif value in ref_target_map:
                return ref_target_map[value]
            else:
                return value
        else:
            return value
    elif isinstance(item, dict):
        return modify_dict(item, value_list, ref_target_map)
    elif isinstance(item, list):
        return [modify_list_item(sub_item, value_list, ref_target_map) for sub_item in item]
    else:
        return item

# "key1=value1&key2=value2&key3=value3" -> {'key1': 'value1', 'key2': 'value2', 'key3': 'value3'}
def parse_query_string(query_string):
    parsed_query = parse_qs(query_string)
    parsed_query = {key: value[0] for key, value in parsed_query.items()}

    return parsed_query

# Mutate bytes in input_str to values in value_list
def mutate_value(input_str, value_list, ref_target_map=None, merge_map=None):
    header = ""
    index = input_str.find(" -d ") #it is a curl command
    if index != -1:
        header = input_str[:index + 4]
        body = input_str[index + 4:]
        body = remove_quotes(body)

    if any(str(value) in body for value in value_list):
        # Check if input is JSON
        if is_json_object(body):
            json_dict = json.loads(body)
            modified_dict = modify_dict(json_dict, value_list, ref_target_map)
            if merge_map is not None:
                modified_dict.update(merge_map)
            body = json.dumps(modified_dict)
        else: #the body is not json object but like "k1=v1;k2=v2" in the GET request
            body = parse_query_string(body)
            json_dict = json.loads(body)
            modified_dict = modify_dict(json_dict, value_list, ref_target_map)
            if merge_map is not None:
                modified_dict.update(merge_map)
            body = json.dumps(modified_dict)
            body = urlencode(body)
    body = add_quotes(body)

    if any(str(value) in header for value in value_list):
        headers = re.findall(r"-H '([^']+)'", header)
        for hheader in headers:
            header_parts = hheader.split(':', 1)
            if len(header_parts) == 2:
                hvalue = header_parts[1].strip()
                hvalue = type_conversion(hvalue) # hvalue is read from a file and value_list is a list in Python.
                if hvalue in value_list and hvalue in ref_target_map:
                    header = header.replace(hvalue, ref_target_map[hvalue])
            else:
                if hheader in value_list and hheader in ref_target_map:
                    header = header.replace(hheader, ref_target_map[hvalue])

    return header+body

def generate_random_string(length=10):
    first_char = secrets.choice(string.ascii_letters + '_')
    rest_chars = ''.join(secrets.choice(string.ascii_letters + string.digits + '_') for _ in range(length - 1))
    return first_char + rest_chars

def list_to_string(string_list):
    if len(string_list) == 1:
        return string_list[0]
    else:
        return ', '.join(string_list)

def mutate_to_target_value(command_contents, matched_value_list, test_variable_value_after, rtvariable_value):
    ref_map = {}
    ref2target = {}
    new_para = {}
    for ref_value in rtvariable_value.split("\n"):
        # Create the one-to-N map
        parts = ref_value.split(' ', 1)
        if len(parts) < 2:
            continue
        key = parts[0]
        value, _ = type_conversion(parts[1]) # The contents we read from a file are always in strings. We need to change them into the right kinds of things.
        if key in ref_map:
            ref_map[key].append(value)
        else:
            ref_map[key] = [value]
    for target_value in test_variable_value_after.split("\n"):
        flag = False
        if len(target_value.split(' ', 1)) < 2:
            continue
        target_variable_name, target_variable_value = target_value.split(' ', 1)
        target_variable_value, _ = type_conversion(target_variable_value)
        # Create a value_ref to value_target map
        if target_variable_name in ref_map:
            for ref_value in ref_map[target_variable_name]:
                if type(ref_value) == type(target_variable_value) and not isinstance(ref_value, dict): # The value to replace should be in the same type as the value being replaced
                    print(ref_value)
                    print(target_variable_value)
                    ref2target[ref_value]=target_variable_value
                    flag = True
        # We cannot find a place to put the target value in, we generate a new http parameter.
        # A possible issue here, we can determine the new http parameter's value, but cannot know its key, we randomly use one key now. 
        # Fixed, just run the main script again by setting information regarding to condition of new inputs, we can get the expected parameter key.
        if flag is False: 
            key = generate_random_string()
            new_para[key] = target_variable_value

    if ref2target:
        print("\033[90mHave discovered the maps from existing input bytes to input bytes satisfying the condition:\n" + str(ref2target) + "\n\033[0m")
    if new_para:
        print("\033[90mAdding new HTTP parameter to the input curl commands:\n" + str(new_para) + "\n\033[0m")
    
    reach_commands = mutate_value(command_contents, matched_value_list, ref2target, new_para)

    return reach_commands

# A simple check, if the execution of inputs can reach the sink
def check_cf_next(source_file, sink_loc, commands):
    ret = False
    os.system(f"cp {source_file} {source_file}.bak")

    with open(source_file, 'r') as file:
        code_lines = file.readlines()
    # Insert instrumentation code at the sink location
    code_lines.insert(sink_loc - 1, f"const fs = require('fs');\n")
    code_lines.insert(sink_loc, f"fs.writeFileSync('/reach.txt', 'reached' + '\\n', {{ encoding: 'utf8', flag: 'w' }});\n")

    with open(source_file, 'w') as file:
        file.writelines(code_lines)
    
    os.system(f"cp {source_file} {source_file}.bak.bak")

    if os.path.exists('/reach.txt'):
        os.remove('/reach.txt')

    stop_command=""
    if isinstance(commands, list): # Should always return True
        if len(commands)==3:
            stop_command=commands[1]
            commands=commands[:1]+commands[2:] # We exclude the stop_command and execute it later
        for command in commands:
            os.chmod(command, 0o755)
            subprocess.Popen(['./' + command], stdout=subprocess.PIPE) # Use Popen instead of run, otherwise it blocks the main script process.
            time.sleep(4)

    if os.path.exists('/reach.txt'):
        ret = True

    # Close the app
    os.system(f"mv {source_file}.bak {source_file}")
    if stop_command != "":
        subprocess.run(['./' + stop_command], check=True) 

    return ret

def pp_aggressive_mutate(input_str, key_var, times):
    header = ""
    index = input_str.find(" -d ") #it is a curl command
    if index != -1:
        header = input_str[:index + 4]
        body = input_str[index + 4:]
        body = remove_quotes(body)

    i1 = body.find(key_var)
    i2 = body.find('"', i1 + len(key_var))
    i3 = body.rfind('"', 0, i1)
    # TODO: We must modify the inputs to execute additional indexing operations, as necessary to trigger pp. This task can be quite challenging. I employ heuristics to change inputs and perform more indexing operations. A more systematic approach, even like random mutation, will be necessary in the future.
    delimiter = "." # '.' is used in apps to concat substrings
    i4 = body.find(delimiter, i3, i1)
    substring = body[i3+1:i4]
    payloads = ""
    # The values of following index opration should be fixed once we have inserted the first payloads.
    if times == 1:
        payloads = payloads + delimiter + "dummy" 
    else:
        payloads = payloads + delimiter + "prototype" + delimiter + "dummy"
    body = body[:i2] + payloads + body[i2:]
    body = body.replace(substring, generate_random_string())
    print(body)
    body = add_quotes(body)

    return header+body
 
def extract_source_content(source_file, sink_line_number):
    line2contents = {}
    for line_number in sink_line_number:
        line2contents[line_number] = linecache.getline(source_file, line_number).strip()
    return line2contents

# Similar to get_value but a little different, instrument multiple lines and profile variable value in an **execution order**
def multiple_get_value(mapping, source_file, commands):
    os.system(f"cp {source_file} {source_file}.bak")
    if os.path.exists('/before.txt'):
        os.remove('/before.txt')

    min_line_number = min(mapping.keys())
    first_line = "const fs = require('fs');\n"
    offset = 0 # When you insert code, the lines are changed

    with open(source_file, "r") as file:
        lines = file.readlines()
    for line, values in mapping.items():
        current_line = line+offset
        if not isinstance(values, list):
            values = [values]
        for value in values:
            lines.insert(current_line-1, f"fs.appendFileSync('/before.txt', '{value}' + ' ' + JSON.stringify({value})+'\\n', {{ encoding: 'utf8', flag: 'a' }});\n") 
            offset += 1
    with open(source_file, "w") as file:
        lines.insert(1, first_line)
        file.writelines(lines)

    stop_command=""
    if isinstance(commands, list):
        if len(commands)==3:
            stop_command=commands[1]
            commands=commands[:1]+commands[2:] # We exclude the stop_command and execute it later
        for command in commands:
            os.chmod(command, 0o755)
            subprocess.Popen(['./' + command], stdout=subprocess.PIPE) # Use Popen instead of run, otherwise it blocks the main script process.
            time.sleep(4)
    
    # Restore the original source file
    os.system(f"cp {source_file} {source_file}.bak.bak")
    os.system(f"mv {source_file}.bak {source_file}")

    # Stop the server app
    if stop_command!="":
        os.chmod(stop_command, 0o755)
        subprocess.run(['./' + stop_command], check=True) 
    
    return

# Currently generate two pp patterns, __proto__ and constructor.prototype.
def trigger_pp(source_file, sink_line_number, commands):
    line2contents = extract_source_content(source_file, sink_line_number)
    reach_input = ""
    with open(commands[2], 'r') as file:
        reach_input = file.read()
    is_pp = check_pp_pattern(list(line2contents.values())[0])
    key_vars = {}
    to_replace_list = []
    value2name = {}
    line2obj = {}

    if is_pp == 0:
        print('\033[90mCannot find matched prototype pollution vulnerability patterns\033[0m')
        return
    else:
        for line, code in line2contents.items():
            obj, line2var = extract_pp_critical_vars(line, code)
            key_vars.update(line2var)
            line2obj[line] = obj
        multiple_get_value(key_vars, source_file, commands)
        variable_value = ""
        try:
            with open('/before.txt', 'r') as file:
                variable_value = file.read()[:-1]
        except FileNotFoundError:
            print("\033[91mErrors in obtaining runtime value of the provided variable when triggering prototype vulnerability\033[0m")
            sys.exit(0)
        tmp = variable_value.split("\n")
        to_replace_list = [type_conversion(element.split(" ", 1)[1])[0] for element in tmp if element]
        for ele in tmp:
            v = type_conversion(ele.split(" ", 1)[0])[0]
            k = type_conversion(ele.split(" ", 1)[1])[0]
            value2name[k] = v 

        step, fin = 1, False
        # TODO. Consider the cases of key name collision in name2line, but haven't meet this issue now 
        name2line = {value_item: key for key, value in key_vars.items() for value_item in (value if isinstance(value, list) else [value])}
        print(to_replace_list)

        # Try constructor.prototype
        for i in to_replace_list:
            if step == 1:
                step, fin = pp_triggering(i, commands, value2name, name2line, line2obj, source_file, step, "p1")
            elif step == 2:
                step, fin = pp_triggering(i, commands, value2name, name2line, line2obj, source_file, step, "p1")
            elif step == 3:
                step, fin = pp_triggering(i, commands, value2name, name2line, line2obj, source_file, step, "p1")
            if fin == True:
                break
        if fin == False: # The execution time of indexing or object lookup operations is not enough.
            with open("curl_attack.sh", 'r') as file:
                poc = file.read()
            poc = pp_aggressive_mutate(poc, "constructor", 4-step) 
            with open("curl_attack.sh", "w") as f:
                f.write(poc)
        commands[2] = "curl_attack.sh"
        suc = validate_pp(sink_line_number, commands, source_file)
        if suc:
            return True
        # Try __proto__
        commands[2] = "curl_reach.sh"
        step, fin = 1, False
        for i in to_replace_list:
            if step == 1:
                step, fin = pp_triggering(i, commands, value2name, name2line, line2obj, source_file, step, "p2")
            elif step == 2:
                step, fin = pp_triggering(i, commands, value2name, name2line, line2obj, source_file, step, "p2")
            elif step == 3:
                step, fin = pp_triggering(i, commands, value2name, name2line, line2obj, source_file, step, "p2")
            if fin == True:
                break   
        if fin == False:
            with open("curl_attack.sh", 'r') as file:
                poc = file.read()
            poc = pp_aggressive_mutate(poc, "__proto__", 3-step) # or 3-step
            with open("curl_attack.sh", "w") as f:
                f.write(poc)
        commands[2] = "curl_attack.sh"
        suc = validate_pp(sink_line_number, commands, source_file)
        if suc:
            return True
    return False

def trigger_xss(source_file, sink_line_number, commands):
    line2contents = extract_source_content(source_file, sink_line_number)
    reach_input = ""
    with open(commands[2], 'r') as file:
        reach_input = file.read()
    
    if len(line2contents) != 1:
        print("\033[91mOnly support sink with one line\033[0m")
        sys.exit(1)
    else:
        line = list(line2contents.keys())[0]
        code = line2contents[line]
        # The sink function has multiple arguments and each argument can contain some irrelevant variables, we'd better ask users to provide one. We might parse sink function to identify sink variable in the future.
        print(f"\033[90mPlease provide a variable used at line {sink_line_number} in {source_file} by controlling which we can conduct xss attacks\033[0m")
        key_var = input()
        if key_var not in code:
            print("\033[91mYou provide incorrect variable name. The program will exit now.\033[0m")
            sys.exit(1)
        get_value(key_var, source_file, sink_line_number, -9999, commands)
        try:
            with open('/before.txt', 'r') as file:
                variable_value = file.read()
        except FileNotFoundError:
            print("\033[91mErrors in obtaining runtime value of the provided variable when triggering xss\033[0m")
        tmp = variable_value.split("\n")[:-1]
        name, value = "", ""
        to_replace_list = [type_conversion(element.split(" ", 1)[1])[0] for element in tmp if element]
        for ele in tmp:
            name = type_conversion(ele.split(" ", 1)[0])[0]
            value = type_conversion(ele.split(" ", 1)[1])[0]
        
        ret = xss_triggering(source_file, sink_line_number, name, value, commands)
        #no validation for xss here.
        if ret == True:
            return True

    return False

def trigger_sqli(source_file, sink_line_number, commands):
    line2contents = extract_source_content(source_file, sink_line_number)
    reach_input = ""
    with open(commands[2], 'r') as file:
        reach_input = file.read()
    
    if len(line2contents) != 1:
        print("\033[91mOnly support sink with one line\033[0m")
        sys.exit(1)
    else:
        line = list(line2contents.keys())[0]
        code = line2contents[line]
        print(f"\033[90mPlease provide a variable used at line {sink_line_number} in {source_file} by controlling which we can conduct xss attacks\033[0m")
        key_var = input()
        if key_var not in code:
            print("\033[91mYou provide incorrect variable name. The program will exit now.\033[0m")
            sys.exit(1)
        get_value(key_var, source_file, sink_line_number, -9999, commands)
        try:
            with open('/before.txt', 'r') as file:
                variable_value = file.read()
        except FileNotFoundError:
            print("\033[91mErrors in obtaining runtime value of the provided variable when triggering xss\033[0m")
        tmp = variable_value.split("\n")[:-1]
        name, value = "", ""
        to_replace_list = [type_conversion(element.split(" ", 1)[1])[0] for element in tmp if element]
        for ele in tmp:
            name = type_conversion(ele.split(" ", 1)[0])[0]
            value = type_conversion(ele.split(" ", 1)[1])[0]
        
        ret = sqli_triggering(source_file, sink_line_number, name, value, commands)
        # no validation for sqli here
        if ret == True:
            return True

    return False
