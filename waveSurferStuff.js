console.log("I'm run first");

import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'

// The overall structure is
//     -> Body 
//         -> Main Controls
//         -> Tracks 
//             ->  track 
//                 -> controls_panel, waveform        
//                     -> zoom, play, forward, backward

// FOR TESTING PURPOSES ONLY!!!!!
export default function generateWaveforms(urlList, tracks, slices, returnRandomKey) {
    // Setting tracks Div up before we render the waveforms
    tracks.innerHTML = "";

    // Rendering each waveform
    for (let i = 0; i < urlList.length; i++) {
        let url = urlList[i];

        // Make new track
        const track = document.createElement('div');
        track.className = 'track';
        tracks.appendChild(track);

        // Make controls panel
        const controls_panel = document.createElement('div');
        controls_panel.className = 'controls_panel';
        track.appendChild(controls_panel)

        // Make Title
        const songTile = document.createElement('h3');
        songTile.id = "songtile";
        songTile.innerHTML = url;
        controls_panel.appendChild(songTile);

        // Make Zoom bar
        // <label style="margin-left: 2em">
        //     Zoom: <input type="range" min="10" max="1000" value="10" />
        // </label>

        const label = document.createElement('label');
        label.className = 'zoom';
        label.style.marginLeft = '2em';
        label.textContent = 'Zoom: ';

        const rangeInput = document.createElement('input');
        rangeInput.className = 'zoom_slider';
        rangeInput.type = 'range';
        rangeInput.min = 10;
        rangeInput.max = 1000;
        rangeInput.value = 10;
        rangeInput.id = `zoom_${i}`;
        
        label.appendChild(rangeInput);
        controls_panel.appendChild(label);        

        // Adding interactivity
        const backButton = document.createElement('button');
        backButton.className = 'backward';
        backButton.id = `backwards_${i}`;
        backButton.innerHTML = "⏴︎ 5s";
        controls_panel.appendChild(backButton);

        const playButton = document.createElement('button');
        playButton.className = 'play';
        playButton.id = `play_${i}`;
        playButton.innerHTML = "⏯︎";
        controls_panel.appendChild(playButton);

        const forwardButton = document.createElement('button');
        forwardButton.className = 'forward';
        forwardButton.id = `forward_${i}`;
        forwardButton.innerHTML = "5s ⏵︎";
        controls_panel.appendChild(forwardButton);

        // Make a new div
        const newDiv = document.createElement('div');
        newDiv.id = `waveform_${i}`;
        newDiv.className = 'waveform';
        track.appendChild(newDiv);

        // Make waveform
        const ws = WaveSurfer.create({
            container: `#waveform_${i}`,
            waveColor: 'rgb(150, 100, 255)',
            progressColor: 'rgb(150, 100, 255)',
            url: url,
            dragToSeek: true,
            width: "100vw",
            hideScrollbar: true,
            normalize: true,
            barGap: 1,
            height: 80,
            barHeight: 20,
            barRadius: 20,
            barWidth: 2,
        });

        // Add event listener for keys ups
        // Whenever I press a key, this function gets called and
        // if the key is associated to a slice then we go there
        // Otherwise we log that the key is not linked to any slice

        document.addEventListener('keyup', (e) => {
            // console.log(e.key);
            // console.log('About to change the playhead position');
            // console.log(slices);
                
            if (e.key in slices) {
                let sliceValue = slices[e.key];
                let waveformId = sliceValue[0];

                if (waveformId === newDiv.id) {
                    let startTime = sliceValue[1].start;
                    let songDuration = ws.getDuration();
                    let seekTime = startTime / songDuration + 0.001;

                    ws.seekTo(seekTime);
                    ws.play();
                } else {
                    console.log("This key is not registered");
                };
            };
        });

        // Spacebar pausing
        document.addEventListener('keydown', (e) => {
            if (ws) {
                if (e.key == ' ') {
                 console.log('hit space')
                 ws.pause();
                };   
            };
        })

        // Add Regions plugin to the waveforms

        // Initialize the Regions plugin
            const wsRegions = ws.registerPlugin(RegionsPlugin.create())

            // Give regions a random color when they are created
            const random = (min, max) => Math.random() * (max - min) + min
            const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

            // Create some regions at specific time ranges
            ws.on('decode', () => {
            // Regions
            wsRegions.addRegion({
                start: 12,
                end: 17,
                content: '',
                color: randomColor(),
                resize: true,
            })
            })

            wsRegions.enableDragSelection({
            color: randomColor(),
            })

            wsRegions.on('region-updated', (region) => {
            // console.log('Updated region', newDiv.id)
            })

            // // Loop a region on click
            // let loop = true
            // // Toggle looping with a checkbox
            // document.querySelector('input[type="checkbox"]').onclick = (e) => {
            // loop = e.target.checked
            // }

            {
            let activeRegion = null
            wsRegions.on('region-created', (region) => {
                // console.log('region-created', newDiv.id)

                // activeRegion = region
                // region.play()

                region.setOptions({ color: randomColor() })
                // console.log(region);

                // console.log(returnRandomKey());
                let selectedKey = returnRandomKey();
                region.setContent(selectedKey);
                // console.log(selectedKey);
                slices[selectedKey] = [newDiv.id, region];

                // console.log(slices)
            })
            wsRegions.on('region-in', (region) => {
                // console.log('region-in', newDiv.id)
                // activeRegion = region
            })
            wsRegions.on('region-out', (region) => {
                // console.log('region-out', newDiv.id)
                // console.log(region);
                ws.pause();
                // if (activeRegion === region) {
                // if (loop) {
                //     region.play()
                // } else {
                //     activeRegion = null
                // }
                // }
            })
            wsRegions.on('region-clicked', (region, e) => {
                // console.log('region-clicked', newDiv.id)
                // e.stopPropagation() // prevent triggering a click on the waveform
                // // activeRegion = region
                // region.play()
                // region.setOptions({ color: randomColor() })
                // console.log(region);

                // let selectedKey = "d";
                // console.log(selectedKey);
                // slices[selectedKey] = region;

                // console.log(slices)
            })
            // Reset the active region when the user clicks anywhere in the waveform
            ws.on('interaction', () => {
                // console.log('region-interacted', newDiv.id)
                // activeRegion = null
            })
        }

        // const playButton = document.querySelector(`#play_${i}`);
        // const forwardButton = document.querySelector(`#forward${i}`);
        // const backButton = document.querySelector(`#backward${i}`);

        // Update the zoom level on slider change
        ws.once('decode', () => {
            document.getElementById(`zoom_${i}`).oninput = (e) => {
              const minPxPerSec = Number(e.target.value)
              ws.zoom(minPxPerSec)
            }

            playButton.onclick = () => {
            ws.playPause()
            }

            forwardButton.onclick = () => {
            ws.skip(5)
            }

            backButton.onclick = () => {
            ws.skip(-5)
            }
        });

    };
}

// All same as above, except title name
export function generateWaveformsFromUploadedSongs(uploadedSongsList, tracks, slices, returnRandomKey) {
    // Setting tracks Div up before we render the waveforms
    tracks.innerHTML = "";
    slices = {};

    // Rendering each waveform
    for (let i = 0; i < uploadedSongsList.length; i++) {
        let songFile = uploadedSongsList[i];

        // Make new track
        const track = document.createElement('div');
        track.className = 'track';
        tracks.appendChild(track);

        // Make controls panel
        const controls_panel = document.createElement('div');
        controls_panel.className = 'controls_panel';
        track.appendChild(controls_panel)

        // Make Title
        const songTile = document.createElement('h3');
        songTile.innerHTML = uploadedSongsList[i].name;
        songTile.id = "songtile";
        controls_panel.appendChild(songTile);

        // Make Zoom bar
        // <label style="margin-left: 2em">
        //     Zoom: <input type="range" min="10" max="1000" value="10" />
        // </label>

        const label = document.createElement('label');
        label.style.marginLeft = '2em';
        label.textContent = 'Zoom: ';

        const rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.min = 10;
        rangeInput.max = 1000;
        rangeInput.value = 1;
        rangeInput.id = `zoom_${i}`;
        
        label.appendChild(rangeInput);
        controls_panel.appendChild(label);

        // Adding interactivity
        const playButton = document.createElement('button');
        playButton.className = 'play';
        playButton.id = `play_${i}`;
        playButton.innerHTML = "Play/ Pause";
        controls_panel.appendChild(playButton);

        const backButton = document.createElement('button');
        backButton.className = 'backward';
        backButton.id = `backwards_${i}`;
        backButton.innerHTML = "<< 5s";
        controls_panel.appendChild(backButton);

        const forwardButton = document.createElement('button');
        forwardButton.className = 'forward';
        forwardButton.id = `forward_${i}`;
        forwardButton.innerHTML = ">> 5s";
        controls_panel.appendChild(forwardButton);

        // Make a new div
        const newDiv = document.createElement('div');
        newDiv.id = `waveform_${i}`;
        newDiv.className = 'waveform';
        track.appendChild(newDiv);

        // Make waveform
        const url = URL.createObjectURL(songFile);
        const ws = WaveSurfer.create({
            container: `#waveform_${i}`,
            waveColor: 'rgb(150, 100, 255)',
            progressColor: 'rgb(150, 100, 255)',
            url: url,
            dragToSeek: true,
            width: "100vw",
            hideScrollbar: true,
            normalize: true,
            barGap: 1,
            height: 60,
            barHeight: 20,
            barRadius: 20,
            barWidth: 2,
        });

        // Add event listener for keys ups
        // Whenever I press a key, this function gets called and
        // if the key is associated to a slice then we go there
        // Otherwise we log that the key is not linked to any slice

        document.addEventListener('keyup', (e) => {
            // console.log(e.key);
            // console.log('About to change the playhead position');
            // console.log(slices);
                
            if (e.key in slices) {
                let sliceValue = slices[e.key];
                let waveformId = sliceValue[0];

                if (waveformId === newDiv.id) {
                    let startTime = sliceValue[1].start;
                    let songDuration = ws.getDuration();
                    let seekTime = startTime / songDuration + 0.001;

                    ws.seekTo(seekTime);
                    ws.play();
                } else {
                    console.log("This key is not registered");
                };
            };
        });

        // Spacebar pausing
        document.addEventListener('keydown', (e) => {
            if (ws) {
                if (e.key == ' ') {
                 console.log('hit space')
                 ws.pause();
                };   
            };
        })

        // Add Regions plugin to the waveforms

        // Initialize the Regions plugin
            const wsRegions = ws.registerPlugin(RegionsPlugin.create())

            // Give regions a random color when they are created
            const random = (min, max) => Math.random() * (max - min) + min
            const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

            // Create some regions at specific time ranges
            ws.on('decode', () => {
            // Regions
            wsRegions.addRegion({
                start: 12,
                end: 17,
                content: '',
                color: randomColor(),
                resize: true,
            })
            })

            wsRegions.enableDragSelection({
            color: randomColor(),
            })

            wsRegions.on('region-updated', (region) => {
            // console.log('Updated region', newDiv.id)
            })

            // // Loop a region on click
            // let loop = true
            // // Toggle looping with a checkbox
            // document.querySelector('input[type="checkbox"]').onclick = (e) => {
            // loop = e.target.checked
            
            // }

            {
            let activeRegion = null
            wsRegions.on('region-created', (region) => {
                // console.log('region-created', newDiv.id)

                // activeRegion = region
                // region.play()

                region.setOptions({ color: randomColor() })
                // console.log(region);

                // console.log(returnRandomKey());
                let selectedKey = returnRandomKey();
                region.setContent(selectedKey);
                // console.log(selectedKey);
                slices[selectedKey] = [newDiv.id, region];

                // console.log(slices)
            })
            wsRegions.on('region-in', (region) => {
                // console.log('region-in', newDiv.id)
                // activeRegion = region
            })
            wsRegions.on('region-out', (region) => {
                // console.log('region-out', newDiv.id)
                // console.log(region);
                ws.pause();
                // if (activeRegion === region) {
                // if (loop) {
                //     region.play()    
                // } else {
                //     activeRegion = null
                // }
                // }
            })
            wsRegions.on('region-clicked', (region, e) => {
                // console.log('region-clicked', newDiv.id)
                // e.stopPropagation() // prevent triggering a click on the waveform
                // // activeRegion = region
                // region.play()
                // region.setOptions({ color: randomColor() })
                // console.log(region);

                // let selectedKey = "d";
                // console.log(selectedKey);
                // slices[selectedKey] = region;

                // console.log(slices)
            })
            // Reset the active region when the user clicks anywhere in the waveform
            ws.on('interaction', () => {
                // console.log('region-interacted', newDiv.id)
                // activeRegion = null
            })
        }

        // const playButton = document.querySelector(`#play_${i}`);
        // const forwardButton = document.querySelector(`#forward${i}`);
        // const backButton = document.querySelector(`#backward${i}`);

        // Update the zoom level on slider change
        ws.once('decode', () => {
            document.getElementById(`zoom_${i}`).oninput = (e) => {
              const minPxPerSec = Number(e.target.value)
              ws.zoom(minPxPerSec)
            }

            playButton.onclick = () => {
            ws.playPause()
            }

            forwardButton.onclick = () => {
            ws.skip(5)
            }

            backButton.onclick = () => {
            ws.skip(-5)
            }
        });

    };
}