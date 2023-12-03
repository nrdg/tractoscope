import unittest
import socketserver
import socket
import http.client
import argparse
import threading
import json
from requestHandler import requestHandler

class TestRequestHandler(unittest.TestCase):
    def setUp(self):
        self.port = 8000
        # find port
        while True:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(("localhost", self.port))
                break
            except OSError:
                self.port += 1
        # setup server on thread
        self.server_thread = threading.Thread(target=self.startServer)
        self.server_thread.start()

    def startServer(self):
        with socketserver.TCPServer(("", self.port), requestHandler) as httpd:
            print(f"Serving on port {self.port}")
            # Start the server
            httpd.serve_forever()

    def test_do_listFiles(self):

        conn = http.client.HTTPConnection('localhost', self.port)
        conn.request('GET', '/listFiles?path=testFolder/&recursive=true')

        response = conn.getresponse()

        # check response status
        self.assertEqual(response.status, 200)

        #read json
        response_contents = response.read()
        response_dict = json.loads(response_contents)

        # check that response contains Contents and IsTruncated
        self.assertTrue('Contents' in response_dict)
        self.assertTrue('IsTruncated' in response_dict)

        #check that contents is a list
        self.assertTrue(isinstance(response_dict['Contents'], list))

        #check that contents contains the correct files
        contents = response_dict['Contents']
        self.assertTrue(all("name" in item and "Key" in item for item in contents))
        #check that testFile was found
        self.assertTrue(any(item['name'] == 'testFile.txt' for item in contents))
        #check that recursiveTestFile was found
        self.assertTrue(any(item['name'] == 'recursiveTestFile.txt' for item in contents))

    def test_do_listFiles_no_path(self):
        conn = http.client.HTTPConnection('localhost', self.port)
        conn.request('GET', '/listFiles')
        response = conn.getresponse()
        #check response status
        self.assertEqual(response.status, 400)


if __name__ == '__main__':
    unittest.main()