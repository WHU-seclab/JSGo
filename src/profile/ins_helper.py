import os
import sys
import re

directory_path = '/pppj/src/profile/reftraces'
search_string1 = '/Apps/parse-server'
search_string2 = '(/Apps/parse-server'

matching_words_set = set()

def search_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
            for line in file:
                words = re.split(r'\s+|\x00', line)
                matching_words = {word for word in words if word.startswith(search_string1) or word.startswith(search_string2)}
                matching_words_set.update(matching_words)
    except UnicodeDecodeError:
        # Handle UnicodeDecodeError if needed
        print(f"UnicodeDecodeError: Unable to decode file {file_path}")

def search_in_directory(directory):
    global matching_words_set
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            search_in_file(file_path)

# Start searching
search_in_directory(directory_path)
#print(matching_words_set)

if len(sys.argv) != 2:
    print("Usage: python script.py <line_of_the_fuzzing_target>")
    sys.exit(1)

try:
    user_parameter = int(sys.argv[1])
except ValueError:
    print("Error: First parameter must be an integer")
    sys.exit(1)

transformed_numbers = []
for string in matching_words_set:
    first_number = int(string.split(':')[1])  # Extracting the first number
    transformed_number = first_number
    if first_number > user_parameter + 3:
        transformed_number -= 3
    elif first_number < user_parameter:
        transformed_number = first_number
    else:
        transformed_number = user_parameter
    transformed_numbers.append(transformed_number)

# Replace the first number in set_of_strings with transformed_numbers
set_of_strings_with_transformed_numbers = set()
for i, string in enumerate(matching_words_set):
    new_string = string.split(':')
    new_string[1] = str(transformed_numbers[i])
    set_of_strings_with_transformed_numbers.add(':'.join(new_string))

print(set_of_strings_with_transformed_numbers)

# Print a message indicating where to insert the code
print("\033[91mWe've observed that automated instrumentation may lead to errors. Please manually insert the following code into each of the lines above so that Restler can recognize its execution:\033[0m")
print("\033[91m'''\nconst fs = require('fs');\nError.stackTraceLimit = 2000;\n\n//ins\nconst error = new Error('Custom error message');\nconst stackTrace = error.stack;\nconst filePath = './rtTrace';\nfs.appendFileSync(filePath, stackTrace, 'utf-8');\n'''\033[0m")
print("\033[91mWhen you instrument code, please avoid issues like variable redeclaration. Make sure the instrumentations do not introduce errors.\033[0m")

