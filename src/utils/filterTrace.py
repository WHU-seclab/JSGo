import re
import os

def filter_and_save_entries(input_file_path, output_file_path, sink_loc):
    try:
        with open(input_file_path, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()

        # Split based on "Error: Custom error message"
        entries = re.split(r'Error: Custom error message', content)
        filtered_entries = [entry for entry in entries if sink_loc in entry]

        # Save the filtered entries to a new file
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            output_file.write('\n'.join(filtered_entries))

        # remove trace.txt produced by executing requests as we have analyzed it
        os.remove(input_file_path)

        print(f"Filtered entries saved to {output_file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")
