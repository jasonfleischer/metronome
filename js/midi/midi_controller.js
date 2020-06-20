// https://surikov.github.io/webaudiofont/

var midi_controller = {
	duration_in_sec: 1,
	tone: _tone_1150_Aspirin_sf2_file,
	audioContext: {},
	player: {},
	initialized: false // // needed otw creates warning
};

midi_controller.init = function() {
	if(!self.initialized){
		var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContextFunc(); 
		this.player = new WebAudioFontPlayer();
		this.player.loader.decodeAfterLoading(this.audioContext, '_tone_1150_Aspirin_sf2_file');
		self.initialized = true;
	}
}

//https://surikov.github.io/webaudiofont/examples/midikey.html 1218 woodblock

midi_controller.playLoudClick = function(){	
	this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, 0, 77, this.duration_in_sec);
}
midi_controller.playNormalClick = function(){
	this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, 0, 84, this.duration_in_sec);
}
midi_controller.playSoftClick = function(){
	this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, 0, 96, this.duration_in_sec);
}

class WoodblockSound {

	constructor(type) {
		this.type = type;
  	}
	play(){
		midi_controller.init();
		if (this.type == "normal")
			midi_controller.playNormalClick();
		else if (this.type == "soft")
			midi_controller.playSoftClick();
		else if(this.type == "loud")
			midi_controller.playLoudClick();
		else
			midi_controller.playNormalClick();
	}
}