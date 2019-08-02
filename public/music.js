const HEIGHT = 10;
const WIDTH = 10;
const TIME = 5;

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var socket;
var currentColumn = 0;
var master = false;
var waveform = 'sine';

let buttons = new Array(HEIGHT*WIDTH);
function makeButtons() {
  console.log("hi + " + buttons.length);
  const table = document.createElement('table');
  let tr;
  $('#main').append(table);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i] = document.createElement("button");
    if (i % WIDTH == 0) {
      tr = document.createElement('tr');
      table.append(tr);
    }
    buttons[i].setAttribute('class', 'musicbutton');

    $(buttons[i]).click(() => clickButton(i));
    let td = document.createElement("td");

    td.append(buttons[i]);
    tr.append(td);
 }
}

function initButtonData(buttonData) {
  for (let i = 0; i < buttonData.length; i++) {
    buttons[i].setAttribute('class', buttonData[i] ? 'clicked' : '');
  }
}

function clickButton(index) {
  setButton(index);
  socket.emit('click', {index: index});
}

function setButton(index) {
  if(buttons[index].getAttribute('class') === 'clicked') {
    buttons[index].setAttribute('class', '');
  } else {
    buttons[index].setAttribute('class', 'clicked');
  }
  console.log('clicked: ' + index);
}


const tone = {
	'C0': 16.35,
	'C#0': 17.32,
	'Db0': 17.32,
	'D0': 18.35,
	'D#0': 19.45,
	'Eb0': 19.45,
	'E0': 20.60,
	'F0': 21.83,
	'F#0': 23.12,
	'Gb0': 23.12,
	'G0': 24.50,
	'G#0': 25.96,
	'Ab0': 25.96,
	'A0': 27.50,
	'A#0': 29.14,
	'Bb0': 29.14,
	'B0': 30.87,
	'C1': 32.70,
	'C#1': 34.65,
	'Db1': 34.65,
	'D1': 36.71,
	'D#1': 38.89,
	'Eb1': 38.89,
	'E1': 41.20,
	'F1': 43.65,
	'F#1': 46.25,
	'Gb1': 46.25,
	'G1': 49.00,
	'G#1': 51.91,
	'Ab1': 51.91,
	'A1': 55.00,
	'A#1': 58.27,
	'Bb1': 58.27,
	'B1': 61.74,
	'C2': 65.41,
	'C#2': 69.30,
	'Db2': 69.30,
	'D2': 73.42,
	'D#2': 77.78,
	'Eb2': 77.78,
	'E2': 82.41,
	'F2': 87.31,
	'F#2': 92.50,
	'Gb2': 92.50,
	'G2': 98.00,
	'G#2': 103.83,
	'Ab2': 103.83,
	'A2': 110.00,
	'A#2': 116.54,
	'Bb2': 116.54,
	'B2': 123.47,
	'C3': 130.81,
	'C#3': 138.59,
	'Db3': 138.59,
	'D3': 146.83,
	'D#3': 155.56,
	'Eb3': 155.56,
	'E3': 164.81,
	'F3': 174.61,
	'F#3': 185.00,
	'Gb3': 185.00,
	'G3': 196.00,
	'G#3': 207.65,
	'Ab3': 207.65,
	'A3': 220.00,
	'A#3': 233.08,
	'Bb3': 233.08,
	'B3': 246.94,
	'C4': 261.63,
	'C#4': 277.18,
	'Db4': 277.18,
	'D4': 293.66,
	'D#4': 311.13,
	'Eb4': 311.13,
	'E4': 329.63,
	'F4': 349.23,
	'F#4': 369.99,
	'Gb4': 369.99,
	'G4': 392.00,
	'G#4': 415.30,
	'Ab4': 415.30,
	'A4': 440.00,
	'A#4': 466.16,
	'Bb4': 466.16,
	'B4': 493.88,
	'C5': 523.25,
	'C#5': 554.37,
	'Db5': 554.37,
	'D5': 587.33,
	'D#5': 622.25,
	'Eb5': 622.25,
	'E5': 659.26,
	'F5': 698.46,
	'F#5': 739.99,
	'Gb5': 739.99,
	'G5': 783.99,
	'G#5': 830.61,
	'Ab5': 830.61,
	'A5': 880.00,
	'A#5': 932.33,
	'Bb5': 932.33,
	'B5': 987.77,
	'C6': 1046.50,
	'C#6': 1108.73,
	'Db6': 1108.73,
	'D6': 1174.66,
	'D#6': 1244.51,
	'Eb6': 1244.51,
	'E6': 1318.51,
	'F6': 1396.91,
	'F#6': 1479.98,
	'Gb6': 1479.98,
	'G6': 1567.98,
	'G#6': 1661.22,
	'Ab6': 1661.22,
	'A6': 1760.00,
	'A#6': 1864.66,
	'Bb6': 1864.66,
	'B6': 1975.53,
	'C7': 2093.00,
	'C#7': 2217.46,
	'Db7': 2217.46,
	'D7': 2349.32,
	'D#7': 2489.02,
	'Eb7': 2489.02,
	'E7': 2637.02,
	'F7': 2793.83,
	'F#7': 2959.96,
	'Gb7': 2959.96,
	'G7': 3135.96,
	'G#7': 3322.44,
	'Ab7': 3322.44,
	'A7': 3520.00,
	'A#7': 3729.31,
	'Bb7': 3729.31,
	'B7': 3951.07,
	'C8': 4186.01,
	'C#8': 4435,
	'D8': 4699,
	'Eb8': 4978,
	'E8': 5274,
	'F8': 5588,
	'F#8': 5920,
	'G8': 6272,
	'G#8': 6645,
	'A8': 7040,
	'Bb8': 7459,
	'B8': 7902
}

const notes = [
  tone['G5'],
  tone['E5'],
  tone['C5'],
  tone['B5'],
  tone['A5'],
  tone['G4'],
  tone['E4'],
  tone['C4'],
  tone['B4'],
  tone['A4'],
]


function playSound(waveType,startFreq,length) {
	var oscillatorNode = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillatorNode.type = waveType;
	oscillatorNode.frequency.setValueAtTime(startFreq, context.currentTime);
	
	gainNode.gain.setValueAtTime(1, context.currentTime);

  gainNode.gain.setTargetAtTime(
    0.0001, context.currentTime + (length/2), 0.015
  )

  // gainNode.gain.exponentialRampToValueAtTime(
  //   0.00001, context.currentTime + length
  // )

	oscillatorNode.connect(gainNode);
	gainNode.connect(context.destination);
  
	oscillatorNode.start();
	oscillatorNode.stop(context.currentTime + length);
}

var last = 0;
function playColumn() {

  columnIdx = currentColumn;
  currentColumn = (currentColumn + 1)%WIDTH;
  for(let rowIdx = 0; rowIdx < HEIGHT; rowIdx++) {
    if (buttons[(10*rowIdx) + columnIdx].getAttribute('class') === 'clicked') {
      console.log("Play at x: " + rowIdx + " y: " + columnIdx);
      playSound(waveform, notes[rowIdx], TIME/WIDTH);
    }
  }
}


function changeWaveform(data) {
  socket.emit('waveform', data);
  setWaveform(data)
}

function setWaveform(data) {
  waveform = data;
  $(`button.waveform`).removeClass('clicked');
  $(`button.waveform:contains(${waveform})`).addClass('clicked');

}

let started = false;
$( document ).ready(function() {
  makeButtons();
  socket = io.connect('http://192.168.100.108:3000');
  socket.on('init', (data) => {
    initButtonData(data.buttons);
    setWaveform(data.waveform);
  });
  socket.on('click', (data) => {
    console.log("Got: " + data.index);
    setButton(data.index);
  });

  socket.on('start', (data) => {
    if(!started) {
      console.log("Start");
      started = true;
      $('#timeline').css('animation', 'draw-line 5s infinite linear');
      playColumn();
      setInterval(playColumn, 500);
    }
   });

  socket.on('waveform', (data) => {
    setWaveform(data);
  });
});
