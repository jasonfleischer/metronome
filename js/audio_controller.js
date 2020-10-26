// audio files generated here:
// https://ttsmp3.com/ with Joey then modified with Audacity


function reloadActivePlayer(){
	if(audio_controller.playing){
		audio_controller.model_changed = true;
	}
}

function forcePlay(){
	audio_controller.pause();
	update_UI_stopped();
	audio_controller.play();
	update_UI_playing();
}

function forceStop(){
	var was_playing = false;
	if(audio_controller.playing) {
		audio_controller.playPause()
		update_UI_stopped();
		was_playing = true;
	}	
	return was_playing;
}

function playPause(){
	var audio_is_playing = audio_controller.playPause();
	if(audio_is_playing) 
		update_UI_playing();
	else 
		update_UI_stopped();
}

var audio_controller = {
	playing: false,
	timer_id: {},
	audio_queue: [],
	text_queue: [],

	model_changed: false,

	click_accent_audio: {},
	click_audio: {},
	click_division_audio: {},

	bass_and_crash_audio: {},
	snare_audio: {},
	bass_audio: {},
	highhat_audio: {},
	
	talking_audio_array: [],
	and_audio: {},
	trip_audio: {},
	let_audio: {},
	e_audio: {},
	a_audio: {}
}

audio_controller.init_sounds =function(){
	this.click_accent_audio = new WoodblockSound("loud");
	this.click_audio = new WoodblockSound("normal");
	this.click_division_audio = new WoodblockSound("soft");

	this.bass_and_crash_audio = new DrumSound("bass_and_crash");
	this.snare_audio = new DrumSound("snare");
	this.bass_audio = new DrumSound("bass");
	this.highhat_audio = new DrumSound("highhat");

	init_talking_sounds(this);
	function init_talking_sounds(self){
		var volume = 0.4;

		self.and_audio = document.createElement("AUDIO");
		self.and_audio.setAttribute("src","audio/talking/and.wav");
		self.and_audio.volume = volume;

		self.trip_audio = document.createElement("AUDIO");
		self.trip_audio.setAttribute("src","audio/talking/trip.wav");
		self.trip_audio.volume = volume;

		self.let_audio = document.createElement("AUDIO");
		self.let_audio.setAttribute("src","audio/talking/let.wav");
		self.let_audio.volume = volume;

		self.e_audio = document.createElement("AUDIO");
		self.e_audio.setAttribute("src","audio/talking/e.wav");
		self.e_audio.volume = volume;

		self.a_audio = document.createElement("AUDIO");
		self.a_audio.setAttribute("src","audio/talking/ah.wav");
		self.a_audio.volume = volume;

		self.talking_audio_array = [];
		talking_wavs = ["audio/talking/one.wav", "audio/talking/two.wav", "audio/talking/three.wav", "audio/talking/four.wav", "audio/talking/five.wav", "audio/talking/six.wav", "audio/talking/seven.wav", "audio/talking/eight.wav", "audio/talking/nine.wav"];
		var i;
		for(i=0; i<talking_wavs.length; i++){
			var audio = document.createElement("AUDIO");
			audio.setAttribute("src", talking_wavs[i]);
			audio.volume = volume;
			self.talking_audio_array[i] = audio;
		}
	}
}

audio_controller.playPause = function(){
	if(this.playing)
		this.pause();
	else 
		this.play(model);
	return this.playing;
}

audio_controller.pause = function(){
	if (this.playing) clearInterval(this.timer_id);
	this.playing = false;
}


audio_controller.play = function(){

	this.playing = true;

	var beat_array = [];
	var beat_text_array =[];
	var division_array = [];
	var division_text_array = [];

	if(model.mode === MODE.TALKING){

		beat_array = [];
		beat_text_array = [];

		var i;
		for(i=0; i<model.time_signature; i++){
			var audio = this.talking_audio_array[i];
			beat_array[i] = audio;
			beat_text_array[i] = (i+1).toString();
		}

		if (model.beat_division === 2){
			division_array = [this.and_audio];
			division_text_array = ["&"];
		} else if (model.beat_division === 3){
			division_array = [this.trip_audio, this.let_audio];
			division_text_array = ["trip", "let"];
		} else if (model.beat_division === 4) {
			division_array = [this.e_audio, this.and_audio, this.a_audio];
			division_text_array = ["e", "&", "a"];
		}	
		
	} else if(model.mode === MODE.DRUM){

		beat_array = [];
		beat_text_array = [];
		
		var first_audio = model.accent_first_beat ? this.bass_and_crash_audio : this.bass_audio;
		audio_array = (model.time_signature % 2) ? [first_audio, this.snare_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio] :
													[first_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio];

		var i;
		for(i=0; i<model.time_signature; i++){
			beat_array[i] = audio_array[i];
			beat_text_array[i] = (i+1).toString();
		}

		if (model.beat_division === 2){
			division_array = [this.highhat_audio];
			division_text_array = ["&"];
		} else if (model.beat_division === 3){
			division_array = [this.highhat_audio, this.highhat_audio];
			division_text_array = ["trip", "let"];
		} else if (model.beat_division === 4) {
			division_array = [this.highhat_audio, this.highhat_audio, this.highhat_audio];
			division_text_array = ["e", "&", "a"];
		}

	} else { // MODE.NORMAL

		beat_array = [model.accent_first_beat ? this.click_accent_audio : this.click_audio];
		beat_text_array = ["1"];

		var i;
		for(i=1; i<model.time_signature; i++){
			beat_array[i] = this.click_audio;
			beat_text_array[i] = (i+1).toString();
		}

		if (model.beat_division === 2){
			division_array = [this.click_division_audio];
			division_text_array = ["&"];
		} else if (model.beat_division === 3){
			division_array = [this.click_division_audio, this.click_division_audio];
			division_text_array = ["trip", "let"];
		} else if (model.beat_division === 4) {
			division_array = [this.click_division_audio, this.click_division_audio, this.click_division_audio];
			division_text_array = ["e", "&", "a"];
		}
	}

	var j = 0;
	this.audio_queue = [];
	text_array = [];
	for(var l = 0; l<beat_array.length; l++){
		this.audio_queue[j] = beat_array[l];
		this.text_queue[j] = beat_text_array[l];
		j = j + 1;
		for(var m= 0; m< division_array.length; m++){
			this.audio_queue[j] = division_array[m];
			this.text_queue[j] = division_text_array[m];
			j = j + 1;
		}
	}	

	var audio_queue_index = 0;
	function BPMtoMilliSeconds(BPM) { return 1000 / (BPM / 60); }
	var time_division_milli_seconds = BPMtoMilliSeconds(model.BPM) / model.beat_division;

	audio_controller.executeAudioTimer(audio_queue_index, this.audio_queue, this.text_queue);
	
	var interval = time_division_milli_seconds;
	var expected = Date.now() + interval;
	this.timer_id = setTimeout(step, interval);
	function step() {
	    var drift = Date.now() - expected; 
	    if (drift > interval) {
	    	logE("something really bad happened. Maybe the browser (tab) was inactive? possibly special handling to avoid futile 'catch up' run");
	        audio_controller.pause();
	    }
		audio_queue_index = (audio_queue_index + 1) % audio_controller.audio_queue.length;

		if(audio_controller.model_changed){
			audio_controller.model_changed = false;
			forcePlay();
		} else {
			audio_controller.executeAudioTimer(audio_queue_index, audio_controller.audio_queue, audio_controller.text_queue);
		    expected += interval;
		    audio_controller.timer_id = setTimeout(step, Math.max(0, interval - drift));
		}		
	}
}

audio_controller.executeAudioTimer = function(index, audio_queue, text_queue) {
	audio_queue[index].play();
  	$("count_text").innerHTML = text_queue[index];
  	if(index == 0){ // resync on one beat
  		time_view.start(model.time_signature, model.BPM);
  	}
}
