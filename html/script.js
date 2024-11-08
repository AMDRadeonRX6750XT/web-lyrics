/* https://github.com/AMDRadeonRX6750XT/web-lyrics */
console.log("script.js");

const audioElement = document.getElementById('audio_song');

let lyrics = [];
let timestamps = [];

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
// -

async function main() {
	console.log("main();");

	// Wait for both loadLyrics and loadTimestamps to complete
	[lyrics, timestamps] = await Promise.all([loadLyrics(), loadTimestamps()]);

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



function audioStart() {
	var promise = audioElement.play();

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
		lyricElement.classList.add("fast");
	}
	var lyricElement = document.getElementById(`lyrics_text-${index}`);
	lyricElement.classList.remove("past", "current", "future");
	lyricElement.classList.add("current");
	
	var lyricElement = document.getElementById(`lyrics_text-${index - 2}`);
	if (lyricElement) {
		//lyricElement.scrollIntoView() // TODO: doesn't only do it in the div
	}
}

audioElement.addEventListener("timeupdate", onAudioTimeUpdate);
audioElement.addEventListener("seeked", () => {
	// console.log("Skip completed to:", audioElement.currentTime);
});




function switchTheme(theme) {
	const themeLink = document.getElementById("theme-style");
	themeLink.href = `styles/${theme}.css`
	return
}

main();
