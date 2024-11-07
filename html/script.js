/* https://github.com/AMDRadeonRX6750XT/web-lyrics */


//while (document.readyState != "complete") {}  // js sucks




console.log("script.js");


let lyrics = [];
let timestamps = [];

// gpt did the loading thing it sucks really
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

async function main() {
	console.log("main();");

	// Wait for both loadLyrics and loadTimestamps to complete
	const [lyrics, timestamps] = await Promise.all([loadLyrics(), loadTimestamps()]);

	// Check if both data are available before logging them
	if (lyrics && timestamps) {
		console.log("Loaded data.")
		//console.log("Timestamps:", timestamps);
	} else {
		console.log("Failed to load data.");
	}
	
	let div = document.querySelector(".lyrics_box")
	let i = 0
	lyrics.forEach(lyricString => {
		let p = document.createElement("p");
		p.innerHTML = `<strong>${lyricString}</strong>`
		p.className = "lyrics_text"
		p.id = `lyrics_text-${i}`
		//p.style = "margin: 0;"
		div.append(p);
		i++;
	});

}



const audioElement = document.getElementById('audio_song');
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
	console.log("song time:", currentTime);
	console.log(lyrics[1])
}

audioElement.addEventListener("timeupdate", onAudioTimeUpdate);

main();



//var lyricElement = document.getElementById('lyrics_text-1');
//lyricElement.style.color = "#bbbbbb"

let array = document.getElementsByClassName("lyrics_text")

document.getElementById('lyrics_box')

// element.scrollTo()