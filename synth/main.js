var Synth = require('./synth');

function main () {
    function tieSliderToPitch(id, o) {
        var slider = document.getElementById(id);
        o.frequency.value = slider.value;
        slider.oninput = function (e) {
            console.log(e.target.value);
            o.frequency.value = e.target.value;
        }
    }

    function createSynth (stopButton) {
        var synth = new Synth(ac);
        tieSliderToPitch('osc1-pitch', synth.osc1);
        tieSliderToPitch('osc2-pitch', synth.osc2);
        stopButton.onclick = synth.stop.bind(synth);
        return synth;
    }

    var ac = new AudioContext();
    var stopButton = document.getElementById('stop');
    var start = document.getElementById('start');

    start.onclick = function () {
        var synth = createSynth(stopButton);
        synth.start();
    }
}

document.onload = window.onload = main;
