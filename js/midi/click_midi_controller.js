// https://surikov.github.io/webaudiofont/
// https://surikov.github.io/webaudiofont/examples/midikey.html 1218 woodblock

var click_controller = {
	duration_in_sec: 0.2,
	tone: {},
	audioContext: {},
	player: {},
	isFirefox: false,
	otherTone: getAspirinTone(),
	firefoxTone: getFluidTone()
};

click_controller.init = function() {

	console.log("click_controller.init");
	this.isFirefox = isFirefox();
	this.tone= this.isFirefox ? this.firefoxTone : this.otherTone;
	this.player = new WebAudioFontPlayer();
}

var midi_initialized = false;
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
click_controller.load = function(){
	if(!midi_initialized){
		console.log("click_controller.load");
		click_controller.audioContext = new AudioContextFunc();
		click_controller.player.adjustPreset(click_controller.audioContext, click_controller.tone);
		midi_initialized = true;
	}
}

click_controller.playLoudClick = function(){	
	this.playPitch(this.isFirefox ? 65 : 77);
}
click_controller.playNormalClick = function(){
	this.playPitch(this.isFirefox ? 72 : 84);
}
click_controller.playSoftClick = function(){
	this.playPitch(this.isFirefox ? 84 : 96);
}
click_controller.playPitch = function(pitch) {
	this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, this.audioContext.currentTime, pitch, this.duration_in_sec);
}

class WoodblockSound {
	constructor(type) {
		this.type = type;
	}
	play(){

		click_controller.load();
		
		if (this.type == "normal")
			click_controller.playNormalClick();
		else if (this.type == "soft")
			click_controller.playSoftClick();
		else if(this.type == "loud")
			click_controller.playLoudClick();
		else
			click_controller.playNormalClick();
	}
}
