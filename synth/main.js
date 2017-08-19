var Synth = require('./synth');

function main () {
    function registerOscillatorControls(synth, id, oscIndex) {
        var prefix = 'osc-' + id;
        var oscControls = document.getElementById(prefix);
        var waveformSelector = document.getElementsByName(prefix + '-waveform');
        var slider = document.getElementById(prefix + '-detune');
        var gainSlider = document.getElementById(prefix + '-gain');
        var panSlider = document.getElementById(prefix + '-pan');
        gainSlider.oninput = function (e) {
            var evt = synth.events.gain(oscIndex, Number(e.target.value) / 100);
            synthElement.dispatchEvent(evt);
        }

        panSlider.oninput = function (e) {
            var evt = synth.events.pan(oscIndex, Number(e.target.value) / 100);
            synthElement.dispatchEvent(evt);
        }

        slider.oninput = function (e) {
            var evt = synth.events.detune(oscIndex, e.target.value);
            synthElement.dispatchEvent(evt);
        }
        waveformSelector.forEach(function (i) {
            i.onchange = function (e) {
                var evt = synth.events.waveform(oscIndex, e.target.value);
                synthElement.dispatchEvent(evt);
            }
        });
    }

    function connectKeyboard (synth) {
        document.onkeydown = function (e) {
            function frequencyFromNoteNumber( note ) {
                return 440 * Math.pow(2,(note-69)/12);
            }

            var keyboard = 'awsedftgyhujkilo'.split('');
            if (keyboard.indexOf(e.key) != -1) {
                var midiNote = 60 + keyboard.indexOf(e.key);
                var freq = frequencyFromNoteNumber(midiNote);
                synth.noteOn(freq);
            }
        }
        document.onkeyup = function (e) {
            synth.noteOff();
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
    var synthElement = document.getElementById('synth');
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
