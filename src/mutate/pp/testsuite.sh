#!/bin/bash

cd /Apps/parse-server
npm run testonly -- spec/PushController.spec.js --filter='creates _PushStatus without serverURL'
