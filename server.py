# Made by ChatGPT so that the sound streams properly

from flask import Flask, send_from_directory, request, Response
import os

app = Flask(__name__)

@app.route('/', defaults={'filename': ''})
@app.route('/<path:filename>')
def serve_file(filename):
	print(filename)
	# Specify the directory to serve from
	directory = os.path.join(os.getcwd(), "html")
	
	# Handle audio range requests for MP3 files
	if filename.endswith('.mp3'):
		return serve_audio(filename, directory)
	if not filename:
		print(filename)
		filename = "index.html"
	
	# Default case: serve static files like python's HTTP server
	return send_from_directory(directory, filename)

def serve_audio(filename, directory):
	# Open the audio file and handle byte-range requests
	path = os.path.join(directory, filename)
	
	# If the range is specified in the request, process it
	range_header = request.headers.get('Range', None)
	if range_header:
		# Handle the byte-range request (usually for large files)
		byte_range = range_header.strip().lower()
		if byte_range.startswith("bytes="):
			# Parse the byte range
			range_values = byte_range[6:]
			start, end = range_values.split('-')
			start = int(start)
			end = int(end) if end else None
			
			# Open the file and seek to the requested byte range
			with open(path, 'rb') as f:
				f.seek(start)
				data = f.read(end - start if end else None)
				# Return the part of the file requested
				return Response(data, status=206, content_type="audio/mpeg", 
								headers={'Content-Range': f'bytes {start}-{start + len(data) - 1}/{os.path.getsize(path)}'})
	
	# Default case: serve the entire audio file without byte-range handling
	return send_from_directory(directory, filename)

if __name__ == '__main__':
	app.run(debug=True, host="0.0.0.0")#, threaded=True)
