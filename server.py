from http.server import SimpleHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        SimpleHTTPRequestHandler.end_headers(self)

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    pass

if __name__ == '__main__':
    PORT = 8000
    os.chdir(r'C:\Users\alex1\Desktop\Visual-analytics\src\data') 
