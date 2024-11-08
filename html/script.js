/* https://github.com/AMDRadeonRX6750XT/web-lyrics */
console.log("script.js");

const audioElement = document.getElementById('audio_song')
const cookieConsent = document.getElementById('cookie_consent')
const themeText = document.getElementById('theme-text')

let meta = {}
let lyrics = []
let timestamps = []

// + chatgpt did the loading thing it sucks really
async function loadLyrics() {
	try {
		const response = await fetch("lyrics.json");
		const lyrics = await response.json();
		return lyrics;  // Return the lyrics data
	} catch (error) {
		console.error("Error loading lyrics:", error);
		return null;  // In case of error, return null or handle as needed
	}
}
async function loadTimestamps() {
	try {
		const response = await fetch("timestamps.json");
		const timestamps = await response.json();  // Expecting an array of numbers
		return timestamps;  // Return the timestamps array
	} catch (error) {
		console.error("Error loading timestamps:", error);
		return null;  // In case of error, return null or handle as needed
	}
}

async function loadMeta() {
	try {
		const response = await fetch("meta.json");
		const meta = await response.json();
		document.getElementById('track-title').innerText = meta["title"] || "Track Title"
		document.getElementById('artist-name').innerText = meta["artist"] || "Artist"
		document.getElementById('duration').innerText = meta["length"] || "0:00"
		return meta;  // Return the timestamps array
	} catch (error) {
		console.error("Error loading metadata:", error);
		return null;
	}
}


async function main() {
	console.log("main();");

	// Wait for both loadLyrics and loadTimestamps to complete
	[lyrics, timestamps, meta] = await Promise.all([loadLyrics(), loadTimestamps(), loadMeta()]);

	// Check if both data are available before logging them
	if (lyrics && timestamps) {
		console.log("Loaded data successfully.")
		//console.log("Timestamps:", timestamps);
	} else {
		console.log("Failed to load data.");
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
		})
		div.append(p);
		i++;
	});
}


function buttonPrev() {
	audioElement.currentTime = 0
}

let playing = false;
const playButton = document.getElementById("play-btn")
function buttonPlay() { // when space pressed!
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
	//console.log("song time:", currentTime);

	let currentTimestamp = -1;
	let index = -1;
	while (currentTimestamp < currentTime) {
		index++;
		currentTimestamp = timestamps[index]
	}
	index-- // idk why but it works so
	//console.log(index, currentTime)
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
		lyricElement.classList.add("future");
	}
	var lyricElement = document.getElementById(`lyrics_text-${index}`);
	lyricElement.classList.remove("past", "current", "future");
	lyricElement.classList.add("current");
	
	var lyricElement = document.getElementById(`lyrics_text-${index - 2}`);
	if (lyricElement) {
		//lyricElement.scrollIntoView() // TODO: doesn't only do it in the div
	}

	const minutes = Math.floor(currentTime / 60);
	const secs = Math.floor(currentTime % 60);
	document.getElementById('current-time').innerText = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
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
	if ('caches' in window) {
		caches.keys().then(cacheNames => {
			cacheNames.forEach(cacheName => {
				caches.delete(cacheName);
			});
		});
	}
	alert("Data deleted.") // this might run before actually deleting the data..?
}
// -- removeData();

main();



document.addEventListener("DOMContentLoaded", function(event) {
	if (localStorage.getItem("cookieConsent") === "yes") {
		// cookie consent
	} else {
		window.location.pathname = "/cookie.html";
	}
	switchTheme(localStorage.getItem("theme"))
});

