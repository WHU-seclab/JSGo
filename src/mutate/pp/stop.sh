#!/bin/bash

# Find the process IDs (PIDs) using port 1337
pids=$(lsof -ti :1337)

# If there are PIDs, kill them
if [ -n "$pids" ]; then
    echo "Processes using port 1337 found. Killing..."
    echo "$pids" | xargs kill -9
else
    echo "No processes found using port 1337."
fi
