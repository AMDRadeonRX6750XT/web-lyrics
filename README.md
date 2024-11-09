<!-- https://github.com/AMDRadeonRX6750XT/web-lyrics -->
# web-lyrics <sup>♪</sup>
Synchronized lyrics with the music in the browser. <br>
Made in plain CSS & JS.

# How to use
1. Add a song in html/song.mp3
2. Add lyrics to html/lyrics.json (as a array of strings, not a dictionary)
3. Add time stamps to html/timestamps.json (as a array of numbers corresponding to the lyric)
4. Add metadata in html/meta.json {title, author, length} all strings
5. Install Flask
```bash
python -m pip install Flask
```
6. Run server.py (from the directory)

# Todo
- [ ] toggle showing theme options
- [ ] working player bar
- [ ] volume controls
- [ ] scroll div automatically to lyrics dynamically
- [ ] accessibility
- [ ] screenshots for readme
- [ ] space theme (with shooting stars)
- [ ] documentation
- [ ] tool to assist with syncing lyrics
- [x] song selection
- [x] skip to time when clicking on lyrics
- [x] proper mobile support

# Credits
me, main contributor - https://github.com/AMDRadeonRX6750XT <br>
helped with the player and making themes a thing - https://github.com/novawraith <br>
