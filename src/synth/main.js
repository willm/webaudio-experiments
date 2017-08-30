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

    function registerOctaveButtons (synth, oscIndex) {
        var buttons = document.getElementsByName('osc-' + (oscIndex + 1) + '-octave');
        buttons.forEach(function (button){
            button.onchange = function (changeEvt) {
                var evt = synth.events.octave(
                    oscIndex, Number(changeEvt.target.value)
                );
                synthElement.dispatchEvent(evt);
            }
        });
    }

    function connectKeyboard (synth) {
        var keyboard = 'awsedftgyhujkilo'.split('');
        keyboard.forEach(function (k, i) {
            const e = document.getElementById('key-' + k);
            if (!e) { return; }
            e.onmousedown = e.ontouchstart = function (evt) {
                synth.noteOn(60 + i);
            };
            e.onmouseup = e.ontouchend = function (evt) {
                synth.noteOff();
            };
        });
        document.onkeydown = function (e) {
            if (keyboard.indexOf(e.key) != -1) {
                var midiNote = 60 + keyboard.indexOf(e.key);
                synth.noteOn(midiNote);
            }
        }
        document.onkeyup = function (e) {
            synth.noteOff();
        }
    }

    function createSynth () {
        var synth = new Synth(ac, synthElement);
        registerOscillatorControls(synth, '1', 0);
        registerOscillatorControls(synth, '2', 1);
        registerOctaveButtons(synth, 0);
        registerOctaveButtons(synth, 1);
        connectKeyboard(synth);
        return synth;
    }

    var ac = new AudioContext();
    var synthElement = document.getElementById('synth');
    var synth = createSynth(synthElement);
    synth.start();
}

document.onload = window.onload = main;
