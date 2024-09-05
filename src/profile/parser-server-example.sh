#!/bin/bash

# the 255 is the line number of static alert, /Apps/parse-server/lib/Controllers/DatabaseController.js is the source file of static alert, and /Apps/parse-server/spec is the test suites

python3 getRefInput.py --spec /Apps/parse-server/spec --source_file /Apps/parse-server/lib/Controllers/DatabaseController.js --line 255 --program_path /Apps/parse-server
python3 ins_helper.py 255
python getRefTraceAligned.py /Apps/parse-server 255A  # Please adjust 255A to the new location of your instrumented code. The new location should corresponding to line 255 in the original program. (you should have manually instrumented code after running the second command). For example, in our prepared instrumented code (DatabaseController1.js), it is 271.
