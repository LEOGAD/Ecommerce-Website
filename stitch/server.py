import http.server
import socketserver
import webbrowser
import os

PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        webbrowser.open(f"http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.server_close()

if __name__ == "__main__":
    start_server()
