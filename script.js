function main () {
    var audio1 = T("audio", {
        loop:true
    }).load("/amen.wav", function() {
        var buffer = this;
        var reverse = false;
        var playButton = document.getElementById('play');
        buffer.plot({target: document.getElementById('waveform')});
        playButton.onclick = function () {
            buffer.set({
                currentTime: 0
            }).play();
        }

        var stopButton = document.getElementById('stop');
        stopButton.onclick = function() {
            buffer.pause.call(buffer);
        }

        var retriggerButton = document.getElementById('retrigger');
        retriggerButton.onclick = () => {
            buffer.currentTime = 0;
        };

        var slider = document.getElementById('pitch');
        slider.oninput = function (e) {
            var speed = (e.target.value / 10) + 1;
            console.log(speed);
            buffer.set({
                currentTime: 0,
                pitch: speed
            }).play();
        }

        var reverseButton = document.getElementById('reverse');
        reverseButton.onclick = () => {
            reverse = !reverse;
            buffer.set({
                reverse: reverse
            }).play();
        };

    });
}
document.onload = window.onload = main;
