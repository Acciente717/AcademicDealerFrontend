import falcon

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

api = falcon.API()
api.add_route('/lab', LabResource())

