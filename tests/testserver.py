'''
Usage:

On unix-like system:

    $ pip install falcon falcon-cors
    $ gunicorn -b 127.0.0.1:8001 testserver:api

On Windows:

    $ pip install falcon falcon-cors waitress
    $ waitress-serve --host=127.0.0.1 --port=8001 testserver:api

Use <C-c> to stop serving.

Or use `./serve.sh` on unix-like system and `./serve.bat` on windows to serve.
'''

import falcon
from falcon_cors import CORS

cors = CORS(allow_origins_list=['http://localhost:8080'],
            allow_all_headers=True,
            allow_all_methods=True)

api = falcon.API(middleware=[cors.middleware])

# Cors Error


class LabResource:
    def on_get(self, req, resp):
        index = 0
        res = {"type": "lab",
                "data": {
                   "id": index,
                   "advisor": "Prof. Rudolf{index}".format(index=index),
                   "department": "EECS",
                   "description": "Hello from lab {index}".format(index=index),
                   "inRecruitment": True
                }
              }
        resp.media = res

api.add_route('/lab', LabResource())
