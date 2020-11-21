// https://surikov.github.io/webaudiofont/

var drum_controller = {
	snare_tone: getSnareTone(),
	bass_tone: getBassTone(),
	highhat_tone: getHighhatTone(),
	crash_tone: getCrashTone(),
	audioContext: {},
	bass_player: {},
	snare_player: {},
	highhat_player: {},
	crash_player: {}
};

drum_controller.init = function() {

	console.log("drum_controller.init");
	this.snare_player = new WebAudioFontPlayer();
	this.bass_player = new WebAudioFontPlayer();
	this.highhat_player = new WebAudioFontPlayer();
	this.crash_player = new WebAudioFontPlayer();
}

var drum_initialized = false;
drum_controller.load = function(){
	if(!drum_initialized){

		console.log("drum_controller.load");
		var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
		drum_controller.audioContext = new AudioContextFunc();
		drum_controller.snare_player.adjustPreset(drum_controller.audioContext, drum_controller.snare_tone);
		drum_controller.bass_player.adjustPreset(drum_controller.audioContext, drum_controller.bass_tone);
		drum_controller.highhat_player.adjustPreset(drum_controller.audioContext, drum_controller.highhat_tone);
		drum_controller.crash_player.adjustPreset(drum_controller.audioContext, drum_controller.crash_tone);
		drum_initialized = true;
	}
}

drum_controller.playSnare = function(){	
	this.snare_player.queueWaveTable(this.audioContext, this.audioContext.destination, this.snare_tone, this.audioContext.currentTime, 40, 0.2, 0.3);
	this.playHighhat();
}
drum_controller.playBass = function(){
	this.bass_player.queueWaveTable(this.audioContext, this.audioContext.destination, this.bass_tone, this.audioContext.currentTime, 35, 0.2, 0.4);
	this.playHighhat();
}
drum_controller.playHighhat = function(){
	this.highhat_player.queueWaveTable(this.audioContext, this.audioContext.destination, this.highhat_tone, this.audioContext.currentTime, 42, 0.2, 0.1);
}
drum_controller.playCrash = function(){
	this.crash_player.queueWaveTable(this.audioContext, this.audioContext.destination, this.crash_tone, this.audioContext.currentTime, 49, 0.6, 0.1);
}
drum_controller.playBassAndCrash = function(){
	this.playBass();
	this.playCrash();
}

class DrumSound {
	constructor(type) {
		this.type = type;
	}
	play(){
		drum_controller.load();
		
		if (this.type == "snare")
			drum_controller.playSnare();
		else if (this.type == "bass")
			drum_controller.playBass();
		else if(this.type == "highhat")
			drum_controller.playHighhat();
		else if(this.type == "bass_and_crash")
			drum_controller.playBassAndCrash();
		else
			drum_controller.playBass();
	}
}



