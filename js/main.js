
//todo 

// tap
// info button
// mobile 
// cookies
// higher bpm msg


function init() {
	setup_bpm_controls();
	setup_up_mode_select();
	setup_time_signature_select();
	setup_beat_division_select();
	setup_accent_first_beat_switch();
	setup_keyboard_listeners();
	time_view.init();
}

function window_resized_end(){
    log("window resized end event");
    if(audio_controller.playing){
 		time_view.resize();
    	time_view.draw_background();
	}
}

var resized_timer;
window.onresize = function(){
  clearTimeout(resized_timer);
  resized_timer = setTimeout(window_resized_end, 200);
};

function setup_bpm_controls() {

	var min = 40;
	var max = 208;
	var step = 1;
	setup_bpm_dial(min, max, step);
	setup_bpm_range(min, max, step);


	function setup_bpm_dial(min, max, step){
		var on_range_control_changed = function(BPM_value){
			log("on BPM dial change: " + BPM_value);
			model.BPM = BPM_value;

			update_UI_BPM(model.BPM);
			forcePlay();
		};
		range_control.load(on_range_control_changed, "", min , max, step, model.BPM, false, 0);
	}

	function setup_bpm_range(min, max, step){
		var bpm_range = $("bpm_range");
		bpm_range.min = min;
		bpm_range.max = max;
		bpm_range.value = model.BPM;
		bpm_range.step = step;
		bpm_range.addEventListener("change", function(e){
			model.BPM = parseFloat(this.value);
			log("on BPM range change: " + model.BPM);

			range_control.load(range_control.on_range_control_changed, "", min , max, step, model.BPM, false, 0);
			update_UI_BPM(model.BPM);
			forcePlay();
		});
	}
}

function setup_up_mode_select() {
	$("mode_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on mode_select: " + value);
		model.mode = value;

		if(model.mode == MODE.NORMAL)
			$("accent_first_beat").style.display = "block"; // show
		else 
			$("accent_first_beat").style.display = "none"; // hide
		reloadActivePlayer();
	});
	$("mode_select").value = model.mode;
}

function setup_time_signature_select() {
	$("time_signature_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on time_signature_select: " + value);
		model.time_signature = value ;

		reloadActivePlayer();
	});
	$("time_signature_select").value = model.time_signature;
}

function setup_beat_division_select() {
	$("division_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on division_select: " + value);
		model.beat_division = value;

		reloadActivePlayer();
	});
	$("division_select").value = model.beat_division;
}

function setup_accent_first_beat_switch() {
	$("accent_first_beat").addEventListener("click", function(e){
		$("accent_first_beat_checkbox").click();
	});
	$("accent_first_beat_checkbox").addEventListener("change", function(e){
		var value = this.checked ? 1 : 0;
		log("on accent beat change: " + value);
		model.accent_first_beat = value;

		reloadActivePlayer();
	});
	$("accent_first_beat_checkbox").checked = model.accent_first_beat;
}

function setup_keyboard_listeners() {

	document.addEventListener('keyup', function(event){
    	if (event.code === 'Space') {
    		// double call with focus on play playPause();
  		} else if (event.code === 'ArrowUp') {
    		range_control.plus_pressed();
  		} else if (event.code === 'ArrowDown') {
    		range_control.minus_pressed();
  		}
	});
}

function reloadActivePlayer(){

	if(audio_controller.playing){
		forcePlay();
	}
}

function forcePlay(){
	audio_controller.pause();
	update_UI_stopped();
	audio_controller.play();
	update_UI_playing();
}

function playPause(){
	var audio_is_playing = audio_controller.playPause();
	if(audio_is_playing) 
		update_UI_playing();
	else 
		update_UI_stopped();
}

function tapMetronome(){
	alert("not yet implemented")
}

function info(){
	alert("not yet implemented")
}

function update_UI_BPM(value) {
	var range = $("bpm_range");
	range.value = value;

	update_UI_tempo_marking(value);

	var canvas = document.getElementById("dial_canvas");
	var bpm_text_object = $("bpm_text");
	bpm_text_object.innerHTML = value;
	bpm_text_object.style.left = Math.round((canvas.offsetWidth - bpm_text_object.offsetWidth) / 2) + "px";


	$("bpm_row_text").innerHTML = "BPM: " + value

	function update_UI_tempo_marking(BPM){
		var tempo_marking = "";
		if(BPM >= 40 && BPM < 60){
			tempo_marking = "Largo";
		} else if(BPM >= 60 && BPM < 66){
			tempo_marking = "Larghetto";
		} else if(BPM >= 66 && BPM < 76){
			tempo_marking = "Adagio";
		} else if(BPM >= 76 && BPM < 108){
			tempo_marking = "Andante";
		} else if(BPM >= 98 && BPM <= 112){
			tempo_marking = "Moderato";
		} else if(BPM > 112 && BPM < 120){
			tempo_marking = "Allegro moderato";
		} else if(BPM >= 120 && BPM <= 156){
			tempo_marking = "Allegro";
		} else if(BPM > 156 && BPM < 168){
			tempo_marking = "Vivace";
		} else if(BPM >= 168 && BPM < 200){
			tempo_marking = "Presto";
		} else if(BPM >= 200){
			tempo_marking = "Prestissimo";
		}
		clearInterval(fadeEffect);
		var fadeTarget = $("tempo_marking");
		fadeTarget.style.opacity = 1;
		var fadeEffect = setInterval(function () {
	        if (!fadeTarget.style.opacity) {
	            fadeTarget.style.opacity = 1;
	        }
	        if (fadeTarget.style.opacity > 0) {
	            fadeTarget.style.opacity -= 0.09;
	        } else {
	            clearInterval(fadeEffect);
	        }
	    }, 100);

		$("tempo_marking").innerHTML = tempo_marking;
	}
	
}

function update_UI_playing(){
	$("play_pause_button").innerHTML = "Stop"; 
	$("init_view").style.display = "none"; // hide
	time_view.start(model.time_signature, model.BPM);
}

function update_UI_stopped(){
	$("play_pause_button").innerHTML = "Play";
	$("count_text").innerHTML = "\xa0";
	$("init_view").style.display = "table"; // show
	time_view.stop();
}




