import os
import shutil

filelist=[]
functionlist=['require']
efunctionlist=[]
with open("/parse-server/coverage/lcov.info", "r") as file:
    for line in file:
        if line.startswith("SF:"):
            # Extract filename from the line
            filename = line.strip().split(":")[1]
        elif line.startswith("DA:"):
            # Extract number from the line
            number = int(line.strip().split(":")[1].split(",")[1])

            # Print filename if number is not zero
            if number != 0 and filename is not None:
                filelist.append(filename)
                #print(filename)
        elif line.startswith("FNDA:"):
            # Extract number and functionname from the line
            parts = line.strip().split(":")[1].split(",")
            number = int(parts[0])
            functionname = parts[1]

            # Print functionname if number is not zero and does not start with '('
            if number != 0 and not functionname.startswith('('):
                functionlist.append(functionname)
                #print(functionname)
            elif number == 0 and not functionname.startswith('('):
                efunctionlist.append(functionname)

#print(filelist)
#print(functionlist)

# Create the /tmp-static directory
tmp_static_dir = '/tmp-static'
os.makedirs(tmp_static_dir, exist_ok=True)

for filename in filelist:
    # Change "src/" to "/parse-server/lib/" in the filename
    new_filename = filename.replace("src/", "/parse-server/lib/")

    # Calculate the destination path in /tmp-static
    dest_path = os.path.join(tmp_static_dir, os.path.relpath(new_filename, '/parse-server'))

    # Ensure the destination directory exists
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)

    # Copy the file to the new folder while preserving the path information
    shutil.copy2(new_filename, dest_path)

print(f"All files copied to {tmp_static_dir}")



print(','.join(map(str, set(efunctionlist)-set(functionlist))))

