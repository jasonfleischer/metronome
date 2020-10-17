// https://surikov.github.io/webaudiofont/
// https://surikov.github.io/webaudiofont/examples/midikey.html 1218 woodblock

//var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
//var audioContext = new AudioContextFunc();
//
//var player = new WebAudioFontPlayer();

class WoodblockSound {
	constructor(type) {
		this.type = type;


		midi_controller.init();
	}
	play(){
		
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

var midi_controller = {
	duration_in_sec: 0.2,
	tone: {},
	audioContext: {},
	player: {},
	initialized: false, // needed otw creates warning
	isFirefox: false
};

midi_controller.getAspirinTone = function() {
	console.log('load _tone_1150_Aspirin_sf2_file');
	var _tone_1150_Aspirin_sf2_file={
		zones:[
			{
				midi:115
				,originalPitch:9200
				,keyRangeLow:0
				,keyRangeHigh:127
				,loopStart:-1
				,loopEnd:-2
				,coarseTune:0
				,fineTune:25
				,sampleRate:44100
				,ahdsr:true
				,file:'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjcyLjEwMQAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFmgC1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1//////////////////////////////////////////////////////////////////8AAAAATGF2YzU3Ljk2AAAAAAAAAAAAAAAAJANtAAAAAAAABZr/LsyLAAAAAAD/+9DEAAAHzAN39BAABhZIK7s1wJC6mv/qgwDkil6HBAEECA4CCgTB8/EAPlAQDEMfygY+XD6z/iAEHfBAEP9/5M5y4Pg+D/yjvslAQd/8EP8Hw+61mZkSZKAAACgAAgAADBSPZtVQdCOiuMSAFiujEFzEKggOmeu4uGskKhVrJPx5W5lRgQKocgSA07gqKDG4pMQogzE2TEeAV2ucxwsy+M1LsjI4Bqrad4xQBFqx2luxl24W0CkeMeCRUFqeFZuNtBK0V09vqopM1AEAV2oQGGBaw1oSR0+nsYDAEASKZUWLVq5sXGjqGgUFGQx0EAd4WUmJBLfZCJClhMCTrKKjiuLWgairU1MEDEiAyChclgzc2XKBIrQqLP6zaSw3Go06lC5OctwqY5U2rqiQYBysDL8T1UGZ1da27zW2tU6yGCvqtyW3Z2kiNLerTL7OumLS0r61q0ShmWzzCy/qPgYCQQA2WtObv1eMOyN1mK3JurPM5e1hylsN3YVDtmPxqIzNmIyplSpodWkmFydiUp5+dbty1S/Zuatbk8fZ82z0tRcZ0osqQYArqxdYZrz1xtrkFSVxXJis116IVn2G7sZkFZrbztJSqgSgda5A9uB41GqSdjNuxSd7MMtO1NtpdSBnFmo2SSQAAADkGU1YGZg76xAFBgtsL0BWyLKZAgokKKLhpxGUC0DICCR9CSKgjkGGgTdTARYzE0euXJymbQ5iCCaMHmDpIkONDawma1mUU5nsEY2jCzEYwT0sMuOvqC7Utpn2dYCBaYie6tzY5TTve0KIQp9ZS/s7yVQZvkSmp7F8HQl9aNMIr9hmTSnCNLRdGBWBOFJ6WU0UVZ5KojE71vdLhqVT2VW9uzKrkudGUxV9qSGoawlUuoJfypK8fq1u1seZfyVTz6xGdhqVX8ccsfvZWYU+z+zEq1l3DD61+lq1Hampd+PP/HdNMwVSyqS01Wg/8fxpPszXLWNO/lJqFUGFqnxvX9a3njrLWrlXmX63WpruWXa2fMf3+8dd//+VVr+PK0zjyrDNSCatmJSq/VqkTboqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uQxLUAJ5IxQ/mdgMgAAD/DgAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'
				,anchor:0.00115646
				//_tone.Wood_Block
			}
		]
	};
	return _tone_1150_Aspirin_sf2_file;
}

midi_controller.getFluidTone = function() {
	log('load _tone_1150_FluidR3_GM_sf2_file');
	var _tone_1150_FluidR3_GM_sf2_file={
		zones:[
			{
				midi:115
				,originalPitch:6000
				,keyRangeLow:0
				,keyRangeHigh:127
				,loopStart:-1
				,loopEnd:-2
				,coarseTune:0
				,fineTune:0
				,sampleRate:44100
				,ahdsr:false
				,file:'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'
				,anchor:0.00324263
				//_tone.High_Woodblock_R_
			}
		]
	};
	return _tone_1150_FluidR3_GM_sf2_file;
}


midi_controller.init = function() {

	if(!midi_controller.initialized){

		console.log("midi_controller.init")

		midi_controller.isFirefox = isFirefox();
		midi_controller.tone= midi_controller.isFirefox ? midi_controller.getFluidTone() : midi_controller.tone=midi_controller.getAspirinTone();
		var AudioContextFunc = window.AudioContext || window.webkitAudioContext;

		midi_controller.audioContext = new AudioContextFunc();
		midi_controller.player=new WebAudioFontPlayer();
		midi_controller.player.adjustPreset(midi_controller.audioContext, midi_controller.tone);
		self.initialized = true;
	}
}

midi_controller.playLoudClick = function(){	
	this.playPitch(this.isFirefox ? 65 : 77);
}
midi_controller.playNormalClick = function(){
	this.playPitch(this.isFirefox ? 72 : 84);
}
midi_controller.playSoftClick = function(){
	this.playPitch(this.isFirefox ? 84 : 96);
}

midi_controller.playPitch = function(pitch) {
	//midi_controller.player.adjustPreset(midi_controller.audioContext, midi_controller.tone);
	this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, this.audioContext.currentTime, pitch, this.duration_in_sec);
}


