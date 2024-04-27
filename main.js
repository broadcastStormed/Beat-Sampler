// import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
// import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import generateWaveforms, { generateWaveformsFromUploadedSongs } from './waveSurferStuff.js'

// JUST DEFINING STUFF, NOT THAT IMPORTANT
let slices = {};
const tracks = document.getElementById("tracks");

let keyList = new Set([
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
]);

// "-", "=", "[", "]", "{", "}", ";", "'", "\\", ",", ".", "/", "`", "~",
//   "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"

function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
};

// Returns a key from keyList and then removes it from keyList to avoid repeats.
// That key is later fed into our generateWave, where we actually construct the slices
// slices currently are {key: region}, eg. {'d': RegionObject}
// Gotta change it to {'key': [waveID, startTime]}

function returnRandomKey() {
  if (keyList.size > 0) {
    let randomKey = getRandomItem(keyList);
    keyList.delete(randomKey);
    return randomKey;
  } else {
    alert("All Keys Chosen")
  }
};

let urlList = ['Her Song.mp3', 'Avicii - SOS (Fan Memories Video) ft. Aloe Blacc - YouTube.mp3', 'La Bachata - MTZ Manuel Turizo | Video Oficial - YouTube.mp3', 'Daft Punk - Face to Face (Official Audio) - YouTube.mp3'];
let uploadedSongsList = [];

// Handler for inputing new songs
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (event) => {
  const uploadedFile = event.target.files[0];
  const songName = uploadedFile.name;
  console.log(songName);
  console.log(uploadedFile);
  if (uploadedFile.type === 'audio/mpeg') {
    uploadedSongsList.push(uploadedFile);
    generateWaveformsFromUploadedSongs(uploadedSongsList, tracks, slices, returnRandomKey);
  } else {
    alert('Please select an MP3 file!');
  }
});

// Generate the initial songslist (FOR TESTING, REMOVE LATER AND REPLACE WITH TEXT ASKING USERS TO UPLOAD THEIR TRACKS)
generateWaveforms(urlList, tracks, slices, returnRandomKey);
