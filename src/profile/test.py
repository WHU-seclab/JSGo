import re

def parse_to_curl(input_string):
    # Split the input string into tokens
    tokens = re.split(r'(\s+)', input_string)
    tokens = [token for token in tokens if token.strip()]
    print(tokens)

    # Identify and assemble components
    method = tokens[0]
    url = tokens[1]
    headers = {}
    body_start = False
    body = ""

    for i in range(2, len(tokens)):
        if tokens[i] == "{" or body_start == True:
            body_start = True
            body = body+tokens[i]+" "
        elif body_start:
            body += tokens[i] + " "
        else:
            #print(tokens[i])
            if ":" != tokens[i][-1]:
                continue
            key = tokens[i][:-1]
            if (key=="Content-Length"):
                continue
            headers[key.strip()] = tokens[i+1]

    # Assemble curl command
    curl_command = f"curl -X {method} {url}"

    for key, value in headers.items():
        curl_command += f" -H '{key}: {value}'"

    if body:
        curl_command += f" -d '{body.strip()}'"

    return curl_command

# Example usage:
input_string = 'POST /parse/classes/_User HTTP/1.1\r\nAccept: application/json\r\nHost: localhost:1337\r\nX-Parse-Application-Id: APPLICATION_ID\r\nX-Parse-REST-API-Key: MASTER_KEY\r\nContent-Type: application/json\r\nContent-Length: 147\r\nUser-Agent: restler/9.2.3\r\nx-restler-sequence-id: dd9de504-066a-4745-9815-a9cb2f008dda\r\n\r\n{\n    "username":"fuzzstring",\n    "password":"fuzzstring",\n    "email":"fuzzstring",\n    "emailVerified":true,\n    "authData":{ "fuzz": false }}\r\n'

resulting_curl_command = parse_to_curl(input_string)
print(resulting_curl_command)

