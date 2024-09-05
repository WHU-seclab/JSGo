from utils import *

if __name__ == "__main__":

    config_path = sys.argv[1] if len(sys.argv) > 1 else 'config.json'

    with open(config_path) as json_file:
        config = json.load(json_file)
    variable_names = config["variable_names"]
    source_file = config["source_file"]
    line_number_before = config["line_number_before"]
    line_number_after = config["line_number_after"]
    commands = config["commands"]
    next_hit_target = config["next_hit_target"]
    sink_line_number = config["sink_line_number"]
    sink_type = config["sink_type"]

    commands=commands.split(",")
    if len(commands)!=4:
        print("\033[94m\"command_path\" is delimited by commas, with **Four** expected elements: one for running the application, one for stopping the application, one for replaying the RESTful APIs, and the last one for executing the reference test suites.\033[0m")
        sys.exit(1)
    
    #instrument code to profile variable values
    get_value(variable_names, source_file, line_number_before, line_number_after, commands[:-1])
    variable_value = ""
    try:
        with open('/before.txt', 'r') as file:
            variable_value = file.read()
    except FileNotFoundError:
        print("\033[91mErrors in obtaining runtime value of the provided variable\033[0m")
    print("\033[90mOriginal variable values\n" + str(variable_value) + "\033[0m")

    # compare inputs with runtime variable values
    with open(commands[2], 'r') as file:
            command_contents = file.read()
    value_list = compare_value(command_contents, variable_value)
    print("\033[90mMatched variable values\n" + str(value_list) + "\033[0m")
    if len(value_list)==0:
        print("\033[91mCannot find source input bytes for variables " + str(variable_names) + ", please run static analysis and symbolic execution to solve this condition!\033[0m")
        sys.exit(0)

    # Mutate the inputs
    new_command_contents = mutate_value(command_contents, value_list)
    with open("curl_new.sh", "w") as f:
        f.write(new_command_contents)
    os.chmod("curl_new.sh", 0o755)
    new_commands=commands
    new_commands[2]="curl_new.sh"
    get_value(variable_names, source_file, line_number_before, line_number_after, new_commands[:-1])
    new_variable_value = ""
    try:
        with open('/before.txt', 'r') as file:
            new_variable_value = file.read()
    except FileNotFoundError:
        print("\033[91mErrors in mutation\033[0m")
    print("\033[90mMutated variable values\n" + str(new_variable_value) + "\033[0m")
    
    # Check consistency again
    with open(new_commands[2], 'r') as file:
            command_contents = file.read()
    new_value_list = compare_value(command_contents, new_variable_value)
    print("\033[90mMatched mutated variable values\n" + str(new_value_list) + "\033[0m")
    if len(new_value_list)==len(value_list):
        print("\033[92mHave found all source input bytes!\033[0m")
    elif len(new_value_list)!=0:
        print("\033[93mHave found partial source input bytes!\033[0m")
    else:
        print("\033[91mCannot find source input bytes for variables " + str(variable_names) + ", please run static analysis and symbolic execution to solve this condition!\033[0m")
        sys.exit(0)
    
    #Get target variable values
    get_value(variable_names, source_file, line_number_before, line_number_after, commands[-1])
    try:
        with open('/before.txt', 'r') as file:
            test_variable_value_before = file.read()
    except FileNotFoundError:
        print("\033[91mErrors in executing testsuites.\033[0m")
        sys.exit(0)
    try:
        with open('/after.txt', 'r') as file:
            test_variable_value_after = file.read()
    except FileNotFoundError:
        print("\033[91mError: the selected testsuites cannot reach the target code.\033[0m")
        sys.exit(0)
    print("\033[92mSucussfully obtained the variable values needed to satisfy the condition\n" + str(test_variable_value_after) + "\033[0m")

    # Mutate the variable value to be the target variable values.
    reach_command = mutate_to_target_value(command_contents, new_value_list, test_variable_value_after, new_variable_value)
    print("\033[90mTry running \n" + str(reach_command) + "\033[0m")

    # check if the mutated commands can reach the target code. If not, run this main.py with
    # the new curl command to solve the next diverging condition
    is_reach_sink = False
    reach_commands = commands
    with open("curl_reach.sh", "w") as f:
        f.write(reach_command)
    os.chmod("curl_reach.sh", 0o755)
    reach_commands[2] = "curl_reach.sh"
    is_reach_next = check_cf_next(source_file, next_hit_target, reach_commands[:-1])
    if is_reach_next:
        if next_hit_target in sink_line_number:
            print("\033[92mSucussfully generate inputs stored at curl_reach.sh that reach the sink!\033[0m")
            is_reach_sink = True
        else:
            print("\033[92mSucussfully generate inputs that reach the {}! Please configure config.json to set the next_hit_target after {} and run main.py again\033[0m".format(next_hit_target, next_hit_target))
            sys.exit(0)
    else:
        print("\033[94mThe execution of newly generated API can satisfy the condition between line {} and line {}, but the execution still cannot reach {}. Please run this script again while configuring line_number_before and line_number_after, and variable_names in config.json to the ones corresponding to the next deviation condition. Also set 'curl_reach.sh' as the third element of the commands option.\033[0m".format(line_number_before, line_number_after, next_hit_target))
        sys.exit(0)

    vul_handle_functions = {
        "pp": trigger_pp,
        "xss": trigger_xss,
        "sqli": trigger_sqli
    }
 
    if is_reach_sink:
        commands[2] = "curl_reach.sh"
        if sink_type in vul_handle_functions:
            suc = vul_handle_functions[sink_type](source_file, sink_line_number, commands[:-1])
            if not suc:
                print("Failed to generate an end-to-end Poc although we have inputs reaching the target location :)")
        else:
            print("\033[91mUnknown sink type:\033[0m", sink_type)
