/* https://github.com/AMDRadeonRX6750XT/web-lyrics */
console.log("script.js");

const audioElement = document.getElementById('audio_song')
const cookieConsent = document.getElementById('cookie_consent')
const themeText = document.getElementById('theme-text')

// some global values (i hate javascript)
let meta = {}
let lyrics = []
let timestamps = []
let songIDs = Object.values({})
let currentSongIndex = 0

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const songID = urlParams.get("id") || "0000" // always a string


document.getElementById("song-source-main").src = `songs/${songID}/song.mp3`
document.getElementById("track-cover").src = `songs/${songID}/cover`
audioElement.load()


// + chatgpt did the loading thing it sucks really
async function loadLyrics() {
	try {
		const response = await fetch(`/songs/${songID}/lyrics.json`);
		const lyrics = await response.json();
		return lyrics;  // Return the lyrics data
	} catch (error) {
		console.error("Error loading lyrics:", error);
		return ["Error loading lyrics"];
	}
}
async function loadTimestamps() {
	try {
		const response = await fetch(`/songs/${songID}/timestamps.json`);
		const timestamps = await response.json();  // Expecting an array of numbers
		return timestamps;  // Return the timestamps array
	} catch (error) {
		console.error("Error loading timestamps:", error);
		return [0];
	}
}
async function loadMeta() {
	try {
		const response = await fetch(`/songs/${songID}/meta.json`);
		const meta = await response.json();
		document.getElementById("track-title").innerText = meta["title"] || "Track Title"
		document.getElementById("artist-name").innerText = meta["artist"] || "Artist"
		document.getElementById("duration").innerText = meta["length"] || "0:00"
		return meta;
	} catch (error) {
		console.error("Error loading metadata:", error);
		return {"title": "Error", "artist": "Error", "duration": "Error"};
	}
}


async function main() {
	console.log("main();")

	let songs = await fetchSongs()
	songIDs = songs.map(obj => Object.values(obj)[1])
	console.log(songIDs) // DONT REMOVE - this only works if this line is here
	currentSongIndex = songIDs.indexOf(songID)
	console.log(currentSongIndex) // DONT REMOVE - this only works if this line is here

	// don't ask me why it doesn't work anymore
	// [lyrics, timestamps, meta] = await Promise.all([loadLyrics(), loadTimestamps(), loadMeta()]);

	lyrics     = await loadLyrics()
	timestamps = await loadTimestamps()
	meta       = await loadMeta()

	if (lyrics && timestamps && meta) {
		console.log("Loaded song data successfully.")
	} else {
		console.warn("Failed to load song data.");
	}
	
	let div = document.querySelector(".lyrics_box")
	let i = 0
	lyrics.forEach(lyricString => {
		let p = document.createElement("p");
		p.setAttribute("id_int", i)
		p.innerHTML = `<strong>${lyricString}</strong>`
		p.className = "lyrics_text"
		p.id = `lyrics_text-${i}`
		//p.style = "margin: 0;"
		p.addEventListener("click", (event) => {
			audioElement.currentTime = timestamps[Number(p.getAttribute("id_int"))];
			audioElement.play() // just to make sure it doesn't stay paused in case it is
		})
		div.append(p);
		i++;
	});
	audioElement.currentTime = 0
}




let playing = false;
const playButton = document.getElementById("play-btn")
function buttonPlay() { // when space pressed
	if (playing) { // pause
		playing = false
		var promise = audioElement.pause();
	} else { // play
		playing = true
		var promise = audioElement.play();
	}

	if (promise !== undefined) {
		promise.then(_ => {
			// autoplay allowed
		}).catch(error => {
			// autoplay was prevented, user has to do something first
			console.error(error)
		});
	}
}

function onAudioTimeUpdate() {
	const currentTime = audioElement.currentTime;

	let currentTimestamp = -1;
	let index = -1;
	while (currentTimestamp <= currentTime) {
		index++;
		currentTimestamp = timestamps[index]
	}
	index-- // idk why but it works so
	//console.log(index, currentTime)

	// TODO: optimize so it checks for classes before
	for (let i = 0; i < lyrics.length; i++) {
		var lyricElement = document.getElementById(`lyrics_text-${i}`);
		lyricElement.classList.remove("past", "current", "future");
	}
	for (let i = index; i != -1; i--) {
		var lyricElement = document.getElementById(`lyrics_text-${i}`);
		lyricElement.classList.add("past");
	}
	for (let i = index; i < lyrics.length; i++) {
		var lyricElement = document.getElementById(`lyrics_text-${i}`);
		if (lyricElement) {
			lyricElement.classList.add("future");
		}
	}
	var lyricElement = document.getElementById(`lyrics_text-${index}`);
	if (lyricElement) {
		lyricElement.classList.remove("past", "current", "future");
		lyricElement.classList.add("current");
	}
	
	var lyricElement = document.getElementById(`lyrics_text-${index - 2}`);
	if (lyricElement) {
		//lyricElement.scrollIntoView() // TODO: doesn't only do it in the div
	}

	const minutes = Math.floor(currentTime / 60);
	const secs = Math.floor(currentTime % 60);
	document.getElementById("current-time").innerText = `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

audioElement.addEventListener("timeupdate", onAudioTimeUpdate);
audioElement.addEventListener("seeked", () => {
	// console.log("Skip completed to:", audioElement.currentTime);
});
audioElement.addEventListener("play", () => {
	playButton.innerText = "II" // "\u23F8"
});
audioElement.addEventListener("pause", () => {
	playButton.innerText = "\u25B6"
});




function switchTheme(theme) {
	if (!theme) {
		theme = "Purple" // default
	}
	const themeLink = document.getElementById("theme-style");
	localStorage.setItem("theme", theme)
	themeText.innerText = theme

	// brighten up the button of the current theme
	const themeButtonDiv = document.querySelector('.theme-button');
	const buttons = themeButtonDiv.querySelectorAll('button')
	Array.from(buttons).forEach(element => {
		element.classList.remove("active-theme-button")
	});
	const button = Array.from(buttons).find(button => {
		return button.innerText.trim().toLowerCase() === theme.trim().toLowerCase();
	});
	if (button) {
		button.classList.add("active-theme-button")
	}

	// actually set the theme
	themeLink.href = `styles/${theme}.css`
	return
}

// ++ removeData();
function removeData() {
	console.log("removeData();")
	// this function was made by gpt bc this is a lot of weird stuff that's really weird and weird
	const cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const cookieName = cookie.split("=")[0].trim();
		document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	}
	localStorage.clear();
	sessionStorage.clear();
	const dbs = window.indexedDB.databases();
	dbs.then((databases) => {
		databases.forEach(db => {
			window.indexedDB.deleteDatabase(db.name);
		});
	});
	if ("caches" in window) {
		caches.keys().then(cacheNames => {
			cacheNames.forEach(cacheName => {
				caches.delete(cacheName);
			});
		});
	}
	alert("Data deleted.") // this might run before actually deleting the data..?
}
// -- removeData();


// ++ song selection 
async function fetchSongs() {
	try {
		const response = await fetch("/songs/list");
		const songsData = await response.json();

		let songs = [];
		for (const [title, id] of Object.entries(songsData)) {
			songs.push({ title, id });
		}

		songs.sort((a, b) => a.id.localeCompare(b.id));
		return songs;
	} catch (error) {
		console.error("Error fetching song list:", error);
		return [];
	}
}

// pop up
async function showSongList() {
	try {
		const songs = await fetchSongs();
		const songListContainer = document.getElementById("songListContainer");
		songListContainer.innerHTML = "";

		const list = document.createElement("ul");
		for (const song of songs) {
			const listItem = document.createElement("li");
			const link = document.createElement("a");
			link.href = `/?id=${song.id}`;
			link.innerHTML = `<h3>${song.title}</h3>`;
			
			listItem.appendChild(link);
			list.appendChild(listItem);
		}

		songListContainer.appendChild(list);

		// Show popup and overlay
		document.getElementById("popupDiv").style.display = "block";
		document.getElementById("overlay").style.display = "block";
	} catch (error) {
		console.error("Error displaying song list:", error);
	}
}

function closePopup() {
	document.getElementById("popupDiv").style.display = "none";
	document.getElementById("overlay").style.display = "none";
}

// -- song selection pop up


// ++ next/prev buttons
function buttonPrev() {
	if ( 3 < audioElement.currentTime) {
		audioElement.currentTime = 0
		return
	}
	currentSongIndex = (currentSongIndex - 1 + songIDs.length) % songIDs.length
	const prevSongID = songIDs[currentSongIndex]
	window.location.href = `/?id=${prevSongID}`
}
function buttonNext() {
	currentSongIndex = (currentSongIndex + 1) % songIDs.length
	const nextSongID = songIDs[currentSongIndex]
	window.location.href = `/?id=${nextSongID}`
}
// -- next/prev buttons


// keyboard stuff
document.addEventListener("keydown", function(event) {
	console.log(event.code)
	if (event.code === "Space") {
		event.preventDefault()
		buttonPlay()
	}
});


document.addEventListener("DOMContentLoaded", function(event) {
	if (localStorage.getItem("cookieConsent") !== "yes") {
		window.location.href = "/cookie.html"
	} else {
		// cookie consented.
		switchTheme(localStorage.getItem("theme"))
	}
})


main();
