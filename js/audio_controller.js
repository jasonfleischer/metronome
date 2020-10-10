// audio files generated here:
// https://ttsmp3.com/ with Joey then modified with Audacity

//todo
var audio_controller = {
	playing: false

}
var timer_id;
var audio_queue = [];
var text_queue = [];


audio_controller.playPause = function(){
	if(this.playing)
		this.pause();
	else 
		this.play();
	return this.playing;
}

audio_controller.pause = function(){
	if (this.playing) clearInterval(timer_id);
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
		audio_array = ["audio/talking/one.wav", "audio/talking/two.wav", "audio/talking/three.wav", "audio/talking/four.wav", "audio/talking/five.wav", "audio/talking/six.wav", "audio/talking/seven.wav", "audio/talking/eight.wav", "audio/talking/nine.wav"];

		var i;
		for(i=0; i<model.time_signature; i++){
			var audio = document.createElement("AUDIO");
			audio.setAttribute("src", audio_array[i]);
			beat_array[i] = audio;
			beat_text_array[i] = (i+1).toString();
		}

		if (model.beat_division === 2){
			var and_audio = document.createElement("AUDIO");
			and_audio.setAttribute("src","audio/talking/and.wav");

			division_array = [and_audio];
			division_text_array = ["&"];
		} else if (model.beat_division === 3){

			var trip_audio = document.createElement("AUDIO");
			trip_audio.setAttribute("src","audio/talking/trip.wav");

			var let_audio = document.createElement("AUDIO");
			let_audio.setAttribute("src","audio/talking/let.wav");

			division_array = [trip_audio, let_audio];
			division_text_array = ["trip", "let"];

		} else if (model.beat_division === 4) {

			var e_audio = document.createElement("AUDIO");
			e_audio.setAttribute("src","audio/talking/e.wav");

			var and_audio = document.createElement("AUDIO");
			and_audio.setAttribute("src","audio/talking/and.wav");

			var a_audio = document.createElement("AUDIO");
			a_audio.setAttribute("src","audio/talking/ah.wav");

			division_array = [e_audio, and_audio, a_audio];
			division_text_array = ["e", "&", "a"];
		}	
		
	} else if(model.mode === MODE.DRUM){

		beat_array = [];
		beat_text_array = [];

		var bass_and_crash_audio = document.createElement("AUDIO");
		bass_and_crash_audio.setAttribute("src","audio/drum/bass_and_crash.wav");

		var bass_audio = document.createElement("AUDIO");
		bass_audio.setAttribute("src","audio/drum/bass.wav");
		
		var snare_audio = document.createElement("AUDIO");
		snare_audio.setAttribute("src","audio/drum/snare.wav");

		var highhat_audio = document.createElement("AUDIO");
		highhat_audio.setAttribute("src","audio/drum/highhat.wav");

		var first_audio = model.accent_first_beat ? bass_and_crash_audio : bass_audio;
		audio_array = [first_audio, snare_audio, bass_audio, snare_audio, bass_audio, snare_audio, bass_audio, snare_audio, bass_audio];

		var i;
		for(i=0; i<model.time_signature; i++){
			beat_array[i] = audio_array[i];
			beat_text_array[i] = (i+1).toString();
		}

		if (model.beat_division === 2){
			division_array = [highhat_audio];
			division_text_array = ["&"];
		} else if (model.beat_division === 3){
			division_array = [highhat_audio, highhat_audio];
			division_text_array = ["trip", "let"];
		} else if (model.beat_division === 4) {
			division_array = [highhat_audio, highhat_audio, highhat_audio];
			division_text_array = ["e", "&", "a"];
		}

	}else if(model.mode === MODE.SYLLABLES){


		var ta_audio = document.createElement("AUDIO");
		ta_audio.setAttribute("src","audio/syllables/ta.wav");

		beat_array = [];
		beat_text_array = [];

		var i;
		for(i=0; i<model.time_signature; i++){
			beat_array[i] = ta_audio;
			beat_text_array[i] = (i+1).toString();
		}
		
		if (model.beat_division === 2){
			var ti_audio = document.createElement("AUDIO");
			ti_audio.setAttribute("src","audio/syllables/ti.wav");

			division_array = [ti_audio];
			division_text_array = ["&"];
		} else if (model.beat_division === 3){

			var pa_audio = document.createElement("AUDIO");
			pa_audio.setAttribute("src","audio/syllables/pa.wav");

			var li_audio = document.createElement("AUDIO");
			li_audio.setAttribute("src","audio/syllables/li.wav");

			division_array = [pa_audio, li_audio];
			division_text_array = ["trip", "let"];

		} else if (model.beat_division === 4) {

			var ka_audio = document.createElement("AUDIO");
			ka_audio.setAttribute("src","audio/syllables/ka.wav");

			var ti_audio = document.createElement("AUDIO");
			ti_audio.setAttribute("src","audio/syllables/ti.wav");

			var ki_audio = document.createElement("AUDIO");
			ki_audio.setAttribute("src","audio/syllables/ki.wav");


			division_array = [ka_audio, ti_audio, ki_audio];
			division_text_array = ["e", "&", "a"];
		}
			
		
	} else { // MODE.NORMAL

		var click_accent_audio = new WoodblockSound("loud");
		var click_audio = new WoodblockSound("normal");
		var click_division_audio = new WoodblockSound("soft");

		beat_array = [model.accent_first_beat ? click_accent_audio : click_audio];
		beat_text_array = ["1"];

		var i;
		for(i=1; i<model.time_signature; i++){
			beat_array[i] = click_audio;
			beat_text_array[i] = (i+1).toString();
		}

		if (model.beat_division === 2){
			division_array = [click_division_audio];
			division_text_array = ["&"];
		} else if (model.beat_division === 3){
			division_array = [click_division_audio, click_division_audio];
			division_text_array = ["trip", "let"];
		} else if (model.beat_division === 4) {
			division_array = [click_division_audio, click_division_audio, click_division_audio];
			division_text_array = ["e", "&", "a"];
		}
	}

	var j = 0;
	audio_queue = [];
	text_array = [];
	for(var l = 0; l<beat_array.length; l++){
		audio_queue[j] = beat_array[l];
		text_queue[j] = beat_text_array[l];
		j = j + 1;
		for(var m= 0; m< division_array.length; m++){
			audio_queue[j] = division_array[m];
			text_queue[j] = division_text_array[m];
			j = j + 1;
		}
	}	

	var audio_queue_index = 0;
	function BPMtoMilliSeconds(BPM) { return 1000 / (BPM / 60); }
	var time_division_milli_seconds = BPMtoMilliSeconds(model.BPM) / model.beat_division;

	audio_controller.executeAudioTimer(audio_queue_index, audio_queue, text_queue);
	

	var interval = time_division_milli_seconds;
	var expected = Date.now() + interval;
	timer_id = setTimeout(step, interval);
	function step() {
	    var drift = Date.now() - expected; 
	    if (drift > interval) {
	    	logE("something really bad happened. Maybe the browser (tab) was inactive? possibly special handling to avoid futile 'catch up' run");
	        audio_controller.pause();
	    }
		audio_queue_index = (audio_queue_index + 1) % audio_queue.length;
		audio_controller.executeAudioTimer(audio_queue_index, audio_queue, text_queue);

	    expected += interval;
	    timer_id = setTimeout(step, Math.max(0, interval - drift));
	}
}

audio_controller.executeAudioTimer = function(index, audio_queue, text_queue) {
	audio_queue[index].play();
  	$("count_text").innerHTML = text_queue[index];
  	if(index == 0){
  		// resync on one beat
  		time_view.start(model.time_signature, model.BPM);
  	}
}

