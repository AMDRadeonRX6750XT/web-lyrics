<!-- https://github.com/AMDRadeonRX6750XT/web-lyrics -->
# web-lyrics ♪
Synchronized lyrics with the music in the browser.

# How to use
1. Add a song in html/song.mp3
2. Add lyrics to html/lyrics.json (as a array of strings, not a dictionary)
3. Add time stamps to html/timestamps.json (as a array of numbers corresponding to the lyric)
4. Install Flask
```bash
python -m pip install Flask
```
5. Run server.py (from the directory)

# Todo
- [x] skip to time when clicking on lyrics
- [ ] check if the amount of timestamps equal the amount of lyrics
- [x] proper mobile support
- [ ] screenshots for readme

# Credits
me, main contributor - https://github.com/AMDRadeonRX6750XT
helped - https://github.com/novawraith
