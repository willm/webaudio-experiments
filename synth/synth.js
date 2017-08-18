function Synth(ac, element) {
    this._freq = 440;
    this.osc1 = {
        osc:createOsc(ac),
        detune: 0
    };
    this.osc2 = {
        osc: createOsc(ac),
        detune: 0
    };
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
    console.log('changed waveform:' + opts.waveform);
    this.oscs[opts.oscIndex].osc.type = opts.waveform;
}

Synth.prototype.detune = function (opts) {
    this._guardOscIndex(opts.oscIndex);
    console.log(opts.hertz);
    this.oscs[opts.oscIndex].detune = opts.hertz;
    this.freq(this._freq);
}

Synth.prototype.freq = function (freq) {
    this._freq = freq;
    this.oscs.forEach(function (o) {
        var adjustedFreq = (freq + Number(o.detune));
        console.log(adjustedFreq);
        o.osc.frequency.value = adjustedFreq;
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
    osc.type = "sawtooth";

    osc.connect(ac.destination);
    return osc;
}

module.exports = Synth;
