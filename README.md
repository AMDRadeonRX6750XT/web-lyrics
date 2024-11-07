<!-- https://github.com/AMDRadeonRX6750XT/web-lyrics -->
# web-lyrics ♪
Synchronized lyrics with the music in the browser.

# How to use
1. Add a song in html/song.mp3
2. Add lyrics to html/lyrics.json (as a array of strings, not a dictionary)
3. Add time stamps to html/timestamps.json (as a array of numbers)
4. Start a server
```bash
python3 -m http.server 8080 -d html
# only 'python' for Windows
```

# Todo
- [ ] proper mobile support
