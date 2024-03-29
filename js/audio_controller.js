// audio files generated here:
// https://ttsmp3.com/ with Joey then modified with Audacity


function reloadActivePlayer(){
	if(audio_controller.playing){
		audio_controller.model_changed = true;
	}
}

var new_beat_division = 0;
function reloadDivisions(value){
	if(audio_controller.playing){
		
		audio_controller.divisions_changed = true;
		new_beat_division = value;

	} else {
		model.beat_division = value;
	}
}

function reloadBPM(value){
	if(audio_controller.playing){
		audio_controller.bpm_changed = true;
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

	if(window.mobileCheck()){
		if(!audio_controller.playing) {
			setupMobileOscillator()
		} else {
			audio_controller.oscillator.stop()
		}
		continuePlay()
		
	} else {


		preLoadAudio();
		function preLoadAudio() {
			var j;
			for(j=0; j<4; j++){
				audio_controller.preloaded_audio[j] = document.createElement("AUDIO");
			}
		}

		function loadingMidi(){
			if(window.mobileCheck()){
				return click_controller.load()
			}
			return click_controller.load() && drum_controller.load();
		}

		if(loadingMidi()) {
			setTimeout(function() {
				log.i("delayed execution for midi loading")
				continuePlay();
			}, 500);
		} else {
			continuePlay()
		}
	}

	function continuePlay() {
		var audio_is_playing = audio_controller.playPause();
		if(audio_is_playing) 
			update_UI_playing();
		else 
			update_UI_stopped();
	}
}


function setupMobileOscillator(){
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	audio_controller.context = new AudioContextFunc();
	audio_controller.oscillator = audio_controller.context.createOscillator()
	audio_controller.oscillator.type = "sine"
	audio_controller.oscillator.frequency.value = (model.accent_first_beat) ? 2000.0 : 3000.0
	
	audio_controller.gain_node = audio_controller.context.createGain()
	audio_controller.gain_node.gain.setValueAtTime(0, audio_controller.context.currentTime);
	
	audio_controller.oscillator.connect(audio_controller.gain_node)
	audio_controller.gain_node.connect(audio_controller.context.destination)
	
	audio_controller.oscillator.start()
}

var audio_controller = {
	playing: false,
	timer_id: {},
	audio_queue: [],
	text_queue: [],
	start_time: 0,
	preloaded_audio: [],

	accent_audio: {},

	model_changed: false, /// rename time_signature_change

	divisions_changed: false,
	bpm_changed: false,

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
	a_audio: {},
	tup_audio: {},
	quin_audio: {},

	dhi_audio: {},
	gi_audio: {},
	ka_audio: {},
	ki_audio: {},
	mi_audio: {},
	na_audio: {},
	ta_audio: {},
	tha_audio: {},
	thom_audio: {},

	oscillator: {},
	gain_node: {},
	context: {}
}

audio_controller.init_sounds =function(){

	if(!window.mobileCheck()){

		this.click_accent_audio = new WoodblockSound("loud");
		this.click_audio = new WoodblockSound("normal");
		this.click_division_audio = new WoodblockSound("soft");

		this.bass_and_crash_audio = new DrumSound("bass_and_crash");
		this.snare_audio = new DrumSound("snare");
		this.bass_audio = new DrumSound("bass");
		this.highhat_audio = new DrumSound("highhat");

		init_talking_sounds(this);
		function init_talking_sounds(self){
			var volume = 0.4 * model.volume_percent / 100;

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

			self.tup_audio = document.createElement("AUDIO");
			self.tup_audio.setAttribute("src","audio/talking/tup.wav");
			self.tup_audio.volume = volume;

			self.quin_audio = document.createElement("AUDIO");
			self.quin_audio.setAttribute("src","audio/talking/quin.wav");
			self.quin_audio.volume = volume;

			self.dhi_audio = document.createElement("AUDIO");
			self.dhi_audio.setAttribute("src","audio/solkattu/Dhi.wav");
			self.dhi_audio.volume = volume;

			self.gi_audio = document.createElement("AUDIO");
			self.gi_audio.setAttribute("src","audio/solkattu/Gi.wav");
			self.gi_audio.volume = volume;

			self.ka_audio = document.createElement("AUDIO");
			self.ka_audio.setAttribute("src","audio/solkattu/Ka.wav");
			self.ka_audio.volume = volume;

			self.ki_audio = document.createElement("AUDIO");
			self.ki_audio.setAttribute("src","audio/solkattu/Ki.wav");
			self.ki_audio.volume = volume;

			self.mi_audio = document.createElement("AUDIO");
			self.mi_audio.setAttribute("src","audio/solkattu/Mi.wav");
			self.mi_audio.volume = volume;

			self.na_audio = document.createElement("AUDIO");
			self.na_audio.setAttribute("src","audio/solkattu/Na.wav");
			self.na_audio.volume = volume;

			self.ta_audio = document.createElement("AUDIO");
			self.ta_audio.setAttribute("src","audio/solkattu/Ta.wav");
			self.ta_audio.volume = volume;

			self.tha_audio = document.createElement("AUDIO");
			self.tha_audio.setAttribute("src","audio/solkattu/Tha.wav");
			self.tha_audio.volume = volume;

			self.thom_audio = document.createElement("AUDIO");
			self.thom_audio.setAttribute("src","audio/solkattu/Thom.wav");
			self.thom_audio.volume = volume;

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
	} // else mobile
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

audio_controller.reloadSounds= function(){
	var beat_array = [];
	var beat_text_array =[];
	var division_array = [];
	var division_text_array = [];

	if(model.tone === TONE.SOLKATTU){

		beat_array = [];
		beat_text_array = [];

		this.accent_audio = this.tha_audio;

		var i;
		for(i=0; i<model.time_signature; i++){
			beat_array[i] = this.tha_audio;
			beat_text_array[i] = "Tha";
		}

		if (model.beat_division === 2){
			division_array = [this.ka_audio];
			division_text_array = ["Ka"];
		} else if (model.beat_division === 3){
			division_array = [this.ki_audio, this.ta_audio];
			division_text_array = ["Ki", "Ta"];
		} else if (model.beat_division === 4) {
			division_array = [this.ka_audio, this.dhi_audio, this.mi_audio];
			division_text_array = ["Ka", "Dhi", "Mi"];
		} else if (model.beat_division === 5) {
			division_array = [this.dhi_audio, this.gi_audio, this.na_audio, this.thom_audio];
			division_text_array = ["Dhi", "Gi", "Na", "Thom"];
		} else if (model.beat_division === 6) {
			division_array = [this.ki_audio, this.ta_audio, this.tha_audio, this.ki_audio, this.ta_audio];
			division_text_array = ["Ki", "Ta", "Tha", "Ki", "Ta"];
		}
		
	} else if(model.tone === TONE.TALKING){

		beat_array = [];
		beat_text_array = [];

		this.accent_audio = this.talking_audio_array[0];

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
		} else if (model.beat_division === 5) {
			division_array = [this.quin_audio, this.tup_audio, this.a_audio, this.let_audio];
			division_text_array = ["quin", "tup", "a", "let"];
		} else if (model.beat_division === 6) {
			division_array = [this.trip_audio, this.let_audio, this.and_audio, this.trip_audio, this.let_audio];
			division_text_array = ["trip", "let", "&", "trip", "let"];
		}
		
	} else if(model.tone === TONE.DRUM){

		beat_array = [];
		beat_text_array = [];
		
		this.accent_audio = this.bass_and_crash_audio;
		audio_array = (model.time_signature % 2) ? [this.bass_audio, this.snare_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio] :
													[this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio, this.snare_audio, this.bass_audio];

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
		} else if (model.beat_division === 5) {
			division_array = [this.highhat_audio, this.highhat_audio, this.highhat_audio, this.highhat_audio];
			division_text_array = ["quin", "tup", "a", "let"];
		} else if (model.beat_division === 6) {
			division_array = [this.highhat_audio, this.highhat_audio, this.highhat_audio, this.highhat_audio, this.highhat_audio];
			division_text_array = ["trip", "let", "&", "trip", "let"];
		}

	} else { // TONE.NORMAL

		beat_array = [];
		beat_text_array = [];

		this.accent_audio = this.click_accent_audio;

		var i;
		for(i=0; i<model.time_signature; i++){
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
		} else if (model.beat_division === 5) {
			division_array = [this.click_division_audio, this.click_division_audio, this.click_division_audio, this.click_division_audio];
			division_text_array = ["quin", "tup", "a", "let"];
		} else if (model.beat_division === 6) {
			division_array = [this.click_division_audio, this.click_division_audio, this.click_division_audio, this.click_division_audio, this.click_division_audio];
			division_text_array = ["trip", "let", "&", "trip", "let"];
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
}

audio_controller.reloadDuration = function(){
	audio_controller.start_time = new Date();
}

audio_controller.play = function(){

	audio_controller.start_time = new Date();
	this.playing = true;
	this.reloadSounds();

	var audio_queue_index = 0;

	function BPMtoMilliSeconds(BPM) { return 1000 / (BPM / 60); }
	var time_division_milli_seconds = BPMtoMilliSeconds(model.BPM) / model.beat_division;
	
	audio_controller.executeAudioTimer(audio_queue_index, this.accent_audio, this.audio_queue, this.text_queue);

	var interval = time_division_milli_seconds;
	var expected = Date.now() + interval;

	this.timer_id = setTimeout(step, interval);
	
	function step() {

	    var drift = Date.now() - expected; 
	    if (drift > interval) {
	    	log.e("something really bad happened. Maybe the browser (tab) was inactive? possibly special handling to avoid futile 'catch up' run");
	        audio_controller.pause();
	    }
		audio_queue_index = (audio_queue_index + 1) % audio_controller.audio_queue.length;

		if(isDurationExpired() && audio_queue_index == 1 ) {
			clearInterval(audio_controller.timer_id);
			forceStop();
			update_UI_stopped();
			playFile("audio/exercise_completed.mp3")

			function playFile(file){
				var audio = audio_controller.preloaded_audio[0];
				audio.setAttribute("src", file);
				audio.volume = 0.4 * model.volume_percent / 100;
				audio.play();
			}
			return;
		}

		if(audio_controller.model_changed){
			audio_controller.model_changed = false;
			forcePlay();
		} else {

			audio_controller.executeAudioTimer(audio_queue_index, audio_controller.accent_audio, audio_controller.audio_queue, audio_controller.text_queue);


			if(audio_controller.bpm_changed){
				audio_controller.bpm_changed = false;

				var time_division_milli_seconds = BPMtoMilliSeconds(model.BPM) / model.beat_division;
				interval = time_division_milli_seconds;
				expected = Date.now() + interval;
				audio_controller.timer_id = setTimeout(step, interval);
				
				time_view.reloadBPM(audio_queue_index);

			} else if(audio_queue_index%model.beat_division == 0 && audio_controller.divisions_changed){

				audio_controller.divisions_changed = false;
				var old_length = audio_controller.audio_queue.length;
				model.beat_division = new_beat_division;
				audio_controller.reloadSounds();

				var time_division_milli_seconds = BPMtoMilliSeconds(model.BPM) / new_beat_division;
				interval = time_division_milli_seconds;
				expected = Date.now() + interval;
				audio_queue_index = (audio_queue_index / old_length) * audio_controller.audio_queue.length;
				audio_controller.timer_id = setTimeout(step, interval);

			} else {
		    	expected += interval;
		    	audio_controller.timer_id = setTimeout(step, Math.max(0, interval - drift));
			}
			
		}		
	}
}

audio_controller.executeAudioTimer = function(index, accent_audio, audio_queue, text_queue) {
	
	$("count_text").innerHTML = text_queue[index];

	if(window.mobileCheck()){
		if(index == 0){ 
			// resync on one beat
			time_view.start(model.time_signature, model.BPM);
			if(model.flash_screen){
				flash_screen_animation();
			}
			
			audio_controller.oscillator.frequency.value = (model.accent_first_beat) ? 2000.0 : 3000.0
		} else if(index % model.beat_division == 0 ) {
			audio_controller.oscillator.frequency.value = 4000.0//4186.0
		} else {
			audio_controller.oscillator.frequency.value = 3000.0//4186.0
		}

		var time = audio_controller.context.currentTime
		var fade_time = 0.1
		
		audio_controller.gain_node.gain.setValueAtTime(1.0, time);
		audio_controller.gain_node.gain.exponentialRampToValueAtTime(0.00001, time + fade_time)
		return;
	}
	
	var promise;
	if(index == 0){
		resync_on_beat_one();
		function resync_on_beat_one(){
			time_view.start(model.time_signature, model.BPM);
			if(model.flash_screen){
				flash_screen_animation();
			}
			if(model.accent_first_beat)
				promise = accent_audio.play();
			else
				promise = audio_queue[index].play();
		}
	} else {
		promise = audio_queue[index].play();
	}

	if (promise !== undefined) {
	    promise.catch(error => {
	        log.e("Play Error: Auto-play was prevented " + error);
	    }).then(() => {
	        /* Auto-play started */
	    });
	}
}

function isDurationExpired(){

	if(model.duration != DURATION.INFINITE) {
		var running_time = new Date() - audio_controller.start_time;
		var durationInMS = model.duration * 60000;
		if(running_time > durationInMS){
			log.i("Duration expired")
			return true;
		}
	}
	return false
}