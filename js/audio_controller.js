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


		var one_audio = document.createElement("AUDIO");
		one_audio.setAttribute("src","audio/talking/one.wav");

		var two_audio = document.createElement("AUDIO");
		two_audio.setAttribute("src","audio/talking/two.wav");


		beat_array = [one_audio, two_audio];
		beat_text_array = ["1", "2"];


		if(model.time_signature === TIME_SIGNATURE.TS_3_4 || model.time_signature === TIME_SIGNATURE.TS_4_4){
			var three_audio = document.createElement("AUDIO");
			three_audio.setAttribute("src","audio/talking/three.wav");
			beat_array[2] = three_audio;
			beat_text_array[2] = "3";
		}

		if(model.time_signature === TIME_SIGNATURE.TS_4_4){
			var four_audio = document.createElement("AUDIO");
			four_audio.setAttribute("src","audio/talking/four.wav");
			beat_array[3] = four_audio;
			beat_text_array[3] = "4";
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
		
	} else if(model.mode === MODE.SYLLABLES){


		var ta_audio = document.createElement("AUDIO");
		ta_audio.setAttribute("src","audio/syllables/ta.wav");

		beat_array = [ta_audio, ta_audio];
		beat_text_array = ["1", "2"];

		if(model.time_signature === TIME_SIGNATURE.TS_3_4 || model.time_signature === TIME_SIGNATURE.TS_4_4){
			beat_array[2] = ta_audio;
			beat_text_array[2] = "3";
		}

		if(model.time_signature === TIME_SIGNATURE.TS_4_4){
			beat_array[3] = ta_audio;
			beat_text_array[3] = "4";
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

		beat_array = [model.accent_first_beat ? click_accent_audio : click_audio, click_audio];
		beat_text_array = ["1", "2"];

		if(model.time_signature === TIME_SIGNATURE.TS_3_4 || model.time_signature === TIME_SIGNATURE.TS_4_4){
			beat_array[2] = click_audio;
			beat_text_array[2] = "3";
		}
		if(model.time_signature === TIME_SIGNATURE.TS_4_4){
			beat_array[3] = click_audio;
			beat_text_array[3] = "4";
		}

		for(var i = 0 ; i < model.beat_division -1; i ++){
			var click_division_audio = new WoodblockSound("soft");
			division_array[i] = click_division_audio;
			division_text_array[i] = "\xa0"; //"&nbsp;";
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
	
	timer_id = setInterval(function() {
		audio_queue_index = (audio_queue_index + 1) % audio_queue.length;
		audio_controller.executeAudioTimer(audio_queue_index, audio_queue, text_queue);
	}, time_division_milli_seconds);

}

audio_controller.executeAudioTimer = function(index, audio_queue, text_queue) {
	audio_queue[index].play();
  	$("count_text").innerHTML = text_queue[index];
}

