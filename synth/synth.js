function Synth(ac, element) {
    this._freq = 440;
    this.osc1 = createOsc(ac);
    this.osc2 = createOsc(ac);
    this.oscs = [this.osc1, this.osc2];
    if (element) {
        ['detune', 'waveform'].forEach(function (eventType) {
            element.addEventListener(eventType, function (e) {
                this[eventType](e.detail)
            }.bind(this));
        }.bind(this));
    }
}

Synth.prototype.start = function () {
    this.oscs.forEach(function (o) {
        o.osc.start();
    });
}


Synth.prototype.stop = function () {
    this.oscs.forEach(function (o) {
        o.osc.stop();
    });
}

Synth.prototype._guardOscIndex = function (oscIndex) {
    if (oscIndex < 0 || oscIndex > this.oscs.length) {
        throw new Error('Invalid oscillator specified: ' + oscIndex);
    }
}

Synth.prototype.waveform = function (opts) {
    this._guardOscIndex(opts.oscIndex);
    this.oscs[opts.oscIndex].osc.type = opts.waveform;
}

Synth.prototype.detune = function (opts) {
    this._guardOscIndex(opts.oscIndex);
    this.oscs[opts.oscIndex].osc.detune.value = opts.hertz;
}

Synth.prototype.gain = function (opts) {
    this._guardOscIndex(opts.oscIndex);
    this.oscs[opts.oscIndex].gain.value = opts.value;
}

Synth.prototype.freq = function (freq) {
    this._freq = freq;
    this.oscs.forEach(function (o) {
        o.osc.frequency.value = freq;
    });
}

Synth.prototype.events = {
    detune: function (oscIndex, hertz) {
        return new CustomEvent('detune', {
            detail: {
                oscIndex: oscIndex,
                hertz: hertz
            }
        });
    },
    waveform: function (oscIndex, waveform) {
        return new CustomEvent('waveform', {
            detail: {
                oscIndex: oscIndex,
                waveform: waveform
            }
        });
    },
}

function createOsc(ac) {
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = "sawtooth";

    osc.connect(gain);
    gain.connect(ac.destination);
    return {
        osc:osc,
        gain: gain
    }
}

module.exports = Synth;
