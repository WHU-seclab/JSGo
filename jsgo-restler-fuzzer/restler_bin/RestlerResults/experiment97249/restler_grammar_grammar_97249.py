""" THIS IS AN AUTOMATICALLY GENERATED FILE!"""
from __future__ import print_function
import json
from engine import primitives
from engine.core import requests
from engine.errors import ResponseParsingException
from engine import dependencies

_parse_classes__Role__id__put_name = dependencies.DynamicVariable("_parse_classes__Role__id__put_name")

def parse_parseclasses_Roleidput(data, **kwargs):
    """ Automatically generated response parser """
    # Declare response variables
    temp_7262 = None

    if 'headers' in kwargs:
        headers = kwargs['headers']


    # Parse body if needed
    if data:

        try:
            data = json.loads(data)
        except Exception as error:
            raise ResponseParsingException("Exception parsing response, data was not valid json: {}".format(error))
        pass

    # Try to extract each dynamic object

        try:
            temp_7262 = str(data["name"])
            
        except Exception as error:
            # This is not an error, since some properties are not always returned
            pass



    # If no dynamic objects were extracted, throw.
    if not (temp_7262):
        raise ResponseParsingException("Error: all of the expected dynamic objects were not present in the response.")

    # Set dynamic variables
    if temp_7262:
        dependencies.set_variable("_parse_classes__Role__id__put_name", temp_7262)

req_collection = requests.RequestCollection([])
# Endpoint: /parse/batch, method: Post
request = requests.Request([
    primitives.restler_static_string("POST "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("batch"),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_static_string("application/json"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("{"),
    primitives.restler_static_string("""
    "requests":
    [
        {
            "method":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
            "path":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
            "body":"""),
    primitives.restler_fuzzable_object("{ \"fuzz\": false }"),
    primitives.restler_static_string("""
        }
    ]}"""),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/batch"
)
req_collection.add_request(request)

# Endpoint: /parse/files/{filename}, method: Post
request = requests.Request([
    primitives.restler_static_string("POST "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("files"),
    primitives.restler_static_string("/"),
    primitives.restler_fuzzable_string("fuzzstring", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/files/{filename}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_User, method: Get
request = requests.Request([
    primitives.restler_static_string("GET "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_User"),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_User"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_User, method: Post
request = requests.Request([
    primitives.restler_static_string("POST "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_User"),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_static_string("application/json"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("{"),
    primitives.restler_static_string("""
    "objectId":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "createdAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "updatedAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "username":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "password":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "email":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "emailVerified":"""),
    primitives.restler_fuzzable_bool("true"),
    primitives.restler_static_string(""",
    "authData":"""),
    primitives.restler_fuzzable_object("{ \"fuzz\": false }"),
    primitives.restler_static_string("}"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_User"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_User/{id}, method: Get
request = requests.Request([
    primitives.restler_static_string("GET "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_User"),
    primitives.restler_static_string("/"),
    primitives.restler_fuzzable_string("fuzzstring", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_User/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_User/{id}, method: Put
request = requests.Request([
    primitives.restler_static_string("PUT "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_User"),
    primitives.restler_static_string("/"),
    primitives.restler_custom_payload_uuid4_suffix("id", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_static_string("application/json"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("{"),
    primitives.restler_static_string("""
    "objectId":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "createdAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "updatedAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "username":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "password":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "email":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "emailVerified":"""),
    primitives.restler_fuzzable_bool("true"),
    primitives.restler_static_string(""",
    "authData":"""),
    primitives.restler_fuzzable_object("{ \"fuzz\": false }"),
    primitives.restler_static_string("}"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_User/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_User/{id}, method: Delete
request = requests.Request([
    primitives.restler_static_string("DELETE "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_User"),
    primitives.restler_static_string("/"),
    primitives.restler_fuzzable_string("fuzzstring", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_User/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_Role, method: Get
request = requests.Request([
    primitives.restler_static_string("GET "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_Role"),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_Role"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_Role, method: Post
request = requests.Request([
    primitives.restler_static_string("POST "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_Role"),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_static_string("application/json"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("{"),
    primitives.restler_static_string("""
    "objectId":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "createdAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "updatedAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "name":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "users":"""),
    primitives.restler_fuzzable_object("{ \"fuzz\": false }"),
    primitives.restler_static_string(""",
    "roles":"""),
    primitives.restler_fuzzable_object("{ \"fuzz\": false }"),
    primitives.restler_static_string("}"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_Role"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_Role/{id}, method: Get
request = requests.Request([
    primitives.restler_static_string("GET "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_Role"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string(_parse_classes__Role__id__put_name.reader(), quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_Role/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_Role/{id}, method: Put
request = requests.Request([
    primitives.restler_static_string("PUT "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_Role"),
    primitives.restler_static_string("/"),
    primitives.restler_custom_payload_uuid4_suffix("id", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_static_string("application/json"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("{"),
    primitives.restler_static_string("""
    "objectId":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "createdAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "updatedAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "name":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "users":"""),
    primitives.restler_fuzzable_object("{ \"fuzz\": false }"),
    primitives.restler_static_string(""",
    "roles":"""),
    primitives.restler_fuzzable_object("{ \"fuzz\": false }"),
    primitives.restler_static_string("}"),
    primitives.restler_static_string("\r\n"),
    
    {

        'post_send':
        {
            'parser': parse_parseclasses_Roleidput,
            'dependencies':
            [
                _parse_classes__Role__id__put_name.writer()
            ]
        }

    },

],
requestId="/parse/classes/_Role/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/_Role/{id}, method: Delete
request = requests.Request([
    primitives.restler_static_string("DELETE "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("_Role"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string(_parse_classes__Role__id__put_name.reader(), quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/_Role/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/GameScore, method: Get
request = requests.Request([
    primitives.restler_static_string("GET "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("GameScore"),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/GameScore"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/GameScore, method: Post
request = requests.Request([
    primitives.restler_static_string("POST "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("GameScore"),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_static_string("application/json"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("{"),
    primitives.restler_static_string("""
    "objectId":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "createdAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "updatedAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "score":"""),
    primitives.restler_fuzzable_number("1.23"),
    primitives.restler_static_string(""",
    "playerName":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "cheatMode":"""),
    primitives.restler_fuzzable_bool("true"),
    primitives.restler_static_string("}"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/GameScore"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/GameScore/{id}, method: Get
request = requests.Request([
    primitives.restler_static_string("GET "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("GameScore"),
    primitives.restler_static_string("/"),
    primitives.restler_fuzzable_string("fuzzstring", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/GameScore/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/GameScore/{id}, method: Put
request = requests.Request([
    primitives.restler_static_string("PUT "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("GameScore"),
    primitives.restler_static_string("/"),
    primitives.restler_custom_payload_uuid4_suffix("id", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_static_string("application/json"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("{"),
    primitives.restler_static_string("""
    "objectId":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "createdAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "updatedAt":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "score":"""),
    primitives.restler_fuzzable_number("1.23"),
    primitives.restler_static_string(""",
    "playerName":"""),
    primitives.restler_fuzzable_string("fuzzstring", quoted=True),
    primitives.restler_static_string(""",
    "cheatMode":"""),
    primitives.restler_fuzzable_bool("true"),
    primitives.restler_static_string("}"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/GameScore/{id}"
)
req_collection.add_request(request)

# Endpoint: /parse/classes/GameScore/{id}, method: Delete
request = requests.Request([
    primitives.restler_static_string("DELETE "),
    primitives.restler_basepath(""),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("parse"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("classes"),
    primitives.restler_static_string("/"),
    primitives.restler_static_string("GameScore"),
    primitives.restler_static_string("/"),
    primitives.restler_fuzzable_string("fuzzstring", quoted=False),
    primitives.restler_static_string(" HTTP/1.1\r\n"),
    primitives.restler_static_string("Accept: application/json\r\n"),
    primitives.restler_static_string("Host: \r\n"),
    primitives.restler_static_string("Content-Type: "),
    primitives.restler_custom_payload_header("Content-Type"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_static_string("X-Parse-Application-Id: "),
    primitives.restler_custom_payload_header("X-Parse-Application-Id"),
    primitives.restler_static_string("\r\n"),
    primitives.restler_refreshable_authentication_token("authentication_token_tag"),
    primitives.restler_static_string("\r\n"),

],
requestId="/parse/classes/GameScore/{id}"
)
req_collection.add_request(request)
