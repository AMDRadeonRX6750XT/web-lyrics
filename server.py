# Made by ChatGPT so that the sound streams properly

from flask import Flask, send_from_directory, request, Response, jsonify
import os
import json

app = Flask(__name__)

# Dictionary to store {title: id} mappings
songs_list = {}

def load_songs_metadata():
	"""Load song metadata from html/songs/ and populate songs_list dictionary."""
	songs_dir = os.path.join(os.getcwd(), "html", "songs")
	
	for song_id in os.listdir(songs_dir):
		song_path = os.path.join(songs_dir, song_id)
		
		# Ensure it's a directory and contains a meta.json file
		if os.path.isdir(song_path):
			meta_path = os.path.join(song_path, "meta.json")
			
			if os.path.isfile(meta_path):
				# Load the title from meta.json
				with open(meta_path, 'r') as meta_file:
					meta_data = json.load(meta_file)
					title = meta_data.get("title")
					
					if title:
						# Map the title to the song ID
						songs_list[title] = song_id

@app.route('/songs/list')
def list_songs():
	"""Endpoint to return the songs list as {title: id}."""
	return jsonify(songs_list)

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

# Load metadata before starting the server
load_songs_metadata()

if __name__ == '__main__':
	app.run(debug=True, host="0.0.0.0")  #, threaded=True)
