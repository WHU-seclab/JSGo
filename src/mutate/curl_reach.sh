#!/bin/bash

curl -X PUT http://localhost:1337/parse/classes/GameScore/TOHbMEyddM -H 'Accept: application/json' -H 'Host: localhost:1337' -H 'X-Parse-Application-Id: APPLICATION_ID' -H 'X-Parse-REST-API-Key: vVpmBSqEaPHdlXKQhnPwEq7nTTFFVJH6s3uxIgFv' -H 'Content-Type: application/json' -H 'User-Agent: restler/9.2.3' -d '{"score": 2.23, "playerName": "fuzzstrini", "cheatMode": false, "sentPerType.ios": {"__op": "Increment", "amount": -1}}'