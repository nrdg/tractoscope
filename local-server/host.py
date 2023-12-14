import socketserver
import socket
import argparse
from requestHandler import requestHandler

# Parse command-line arguments
parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=-1, help="the port number to start at")
args = parser.parse_args()
port = None

if args.port == -1:
    print("no port provided, finding open port")
    port = 8000
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("localhost", port))
            break
        except OSError:
            port += 1
else:
    port = args.port

if __name__ == "__main__":
    # Set up the server on the specified port
    with socketserver.TCPServer(("", port), requestHandler) as httpd:
        print(f"Serving on port {port}")
        # Start the server
        httpd.serve_forever()
