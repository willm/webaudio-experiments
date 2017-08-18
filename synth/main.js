var Synth = require('./synth');

function main () {
    var synthElement = document.getElementById('synth');
    function registerOscillatorControls(synth, id, oscIndex) {
        var prefix = 'osc-' + id;
        var oscControls = document.getElementById(prefix);
        var waveformSelector = document.getElementsByName(prefix + '-waveform');
        var slider = document.getElementById(prefix + '-detune');
        synth.events.detune(oscIndex, slider.value);
        slider.oninput = function (e) {
            console.log(e.target.value);
            var evt = synth.events.detune(oscIndex, e.target.value);
            synthElement.dispatchEvent(evt);
        }
        waveformSelector.forEach(function (i) {
            i.onchange = function (e) {
                var evt = synth.events.waveform(oscIndex, e.target.value);
                synthElement.dispatchEvent(evt);
                console.log(evt.target.value);
            }
        });
    }

    function connectKeyboard (synth) {
        document.onkeydown = function (e) {
            function frequencyFromNoteNumber( note ) {
                return 440 * Math.pow(2,(note-69)/12);
            }

            var keyboard = 'awsedftgyhu'.split('');
            if (keyboard.indexOf(e.key) != -1) {
                var midiNote = 60 + keyboard.indexOf(e.key);
                var freq = frequencyFromNoteNumber(midiNote);
                console.log(e.key, freq);
                synth.freq(freq);
            }
        }
    }

    function createSynth (stopButton) {
        var synth = new Synth(ac, synthElement);
        registerOscillatorControls(synth, '1', 0);
        registerOscillatorControls(synth, '2', 1);
        stopButton.onclick = synth.stop.bind(synth);
        connectKeyboard(synth);
        return synth;
    }

    var ac = new AudioContext();
    var stopButton = document.getElementById('stop');
    var start = document.getElementById('start');
    var synth;
    start.onclick = function () {
        if (synth) {synth.stop();}
        synth = createSynth(stopButton);
        synth.start();
    }

}

document.onload = window.onload = main;
