function Synth(ac) {
    this.osc1 = createOsc(ac);
    this.osc2 = createOsc(ac);
    this.oscs = [this.osc1, this.osc2];
}

Synth.prototype.start = function () {
    this.oscs.forEach(function (o) {
        o.start();
    });
}


Synth.prototype.stop = function () {
    this.oscs.forEach(function (o) {
        o.stop();
    });
}

function createOsc(ac) {
    var osc = ac.createOscillator();
    osc.type = "sawtooth";

    osc.connect(ac.destination);
    return osc;
}

module.exports = Synth;
