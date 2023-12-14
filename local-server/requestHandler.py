import http.server
import socketserver
import json
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, parse_qs
import os

class requestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query = parsed_url.query
        if path == '/listFiles':
            params = parse_qs(query)
            file_path = params.get('path')
            recursive = params.get('recursive')

            if recursive:
                recursive = recursive[0]
                if recursive == 'true':
                    recursive = True
                else:
                    recursive = False
            else:
                recursive = False

            # Check if path was provided
            if not file_path:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {"error": "No path provided"}
                self.wfile.write(json.dumps(response).encode())

            else:
                file_path = file_path[0]

                #get all file names in the directory
                files = self.listFiles(file_path, recursive)
                response = {}
                response['Contents'] = files

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())

        else:
            super().do_GET()

    def listFiles(self, path, recursive):
        output = []
        # get all file names in the directory
        try:
            files = os.listdir(path)
        except FileNotFoundError:
            return
        # if recursive is true, then get all files in subdirectories
        for file in files:
            output.append({'name': file, 'Key': os.path.join(path, file)})
            new_path = os.path.join(path, file)
            if recursive and os.path.isdir(new_path):
                output.extend(self.listFiles(new_path, recursive))
        return output