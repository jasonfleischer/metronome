
//todo 

// higher bpm msg
// dont restart on active changes
// mobile
// other browsers test, audio broken
// drums sounds
// spacebar for stop start

function init() {
	load_cookies();
	setup_darkmode_switch();
	setup_up_mode_select();
	setup_time_signature_select();
	setup_beat_division_select();
	setup_accent_first_beat_switch();
	setup_keyboard_listeners();
	setup_info_alert();
	show_hidden_views();
	time_view.init();
	setup_bpm_controls();
}

function load_cookies(){
	model.BPM = cookies.get_BPM(120);
	model.time_signature = cookies.get_time_signature(TIME_SIGNATURE.TS_4_4);
	model.beat_division = cookies.get_subdivision(1);
	model.accent_first_beat = cookies.get_accent_first_beat(true);
	model.mode = cookies.get_mode(MODE.NORMAL);
	model.darkmode = cookies.get_darkmode(false);
}

function show_hidden_views(){
	$("header").style.display = "block";
	$("nav-side-menu").style.display = "block";
	$("content_view").style.display = "block";
}

function window_resized_end(){
	log("window resized end event");
	time_view.resize();
	time_view.draw_background();
	if(audio_controller.playing){
		$("time_view_container").style.display = "block"; // show
	}

	{
		var canvas = document.getElementById("dial_canvas");
		var bpm_text_object = $("bpm_text");
		bpm_text_object.style.display = "block"; // show
		bpm_text_object.style.left = Math.round((canvas.offsetWidth - bpm_text_object.offsetWidth) / 2) + "px";
	}
}

var resized_timer;
window.onresize = function(){
	clearTimeout(resized_timer);
	resized_timer = setTimeout(window_resized_end, 200);
	$("bpm_text").style.display = "none"; // hide
	$("time_view_container").style.display = "none"; // hide
};

function setup_bpm_controls() {

	var min = MIN_BPM;
	var max = MAX_BPM;
	var step = 1;
	setup_bpm_dial(min, max, step);
	setup_bpm_range(min, max, step);


	function setup_bpm_dial(min, max, step){
		var on_range_control_changed = function(BPM_value){
			log("on BPM dial change: " + BPM_value);
			model.BPM = BPM_value;
			cookies.set_BPM(model.BPM);
			update_UI_BPM(model.BPM);
			reloadActivePlayer();
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
			cookies.set_BPM(model.BPM);
			update_UI_BPM(model.BPM);
			reloadActivePlayer();
		});
	}
}

function setup_up_mode_select() {
	$("mode_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on mode_select: " + value);
		model.mode = value;
		cookies.set_mode(value);
		update_UI_mode();
		reloadActivePlayer();
	});
	$("mode_select").value = model.mode;
	update_UI_mode();
}

function setup_time_signature_select() {
	$("time_signature_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on time_signature_select: " + value);
		model.time_signature = value ;
		cookies.set_time_signature(value);
		reloadActivePlayer();
	});
	$("time_signature_select").value = model.time_signature;
}

function setup_beat_division_select() {
	$("division_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on division_select: " + value);
		model.beat_division = value;
		cookies.set_subdivision(value);
		reloadActivePlayer();
	});
	$("division_select").value = model.beat_division;
}

function setup_accent_first_beat_switch() {
	$("accent_first_beat").addEventListener("click", function(e){
		$("accent_first_beat_checkbox").click();
	});
	$("accent_first_beat_checkbox_switch").addEventListener('keyup', function(e) {
		if (event.code === 'Space' || event.code === 'Enter') $("accent_first_beat_checkbox").click();
	});
	$("accent_first_beat_checkbox").addEventListener("change", function(e){
		var value = this.checked;
		log("on accent beat change: " + value);
		model.accent_first_beat = value;
		cookies.set_accent_first_beat(value);
		reloadActivePlayer();
	});
	$("accent_first_beat_checkbox").checked = model.accent_first_beat;
}

function setup_darkmode_switch() {
	$("darkmode").addEventListener("click", function(e){
		$("darkmode_checkbox").click();
	});
	$("darkmode_checkbox_switch").addEventListener('keyup', function(event){
		if (event.code === 'Space'|| event.code === 'Enter') $("darkmode_checkbox").click();
	});
	$("darkmode_checkbox").addEventListener("change", function(e){
		var value = this.checked;
		log("on darkmode change: " + value);
		model.darkmode = value;
		cookies.set_darkmode(value);
		update_UI_darkmode();
	});
	$("darkmode_checkbox").checked = model.darkmode;
	update_UI_darkmode();
}

function setup_keyboard_listeners() {

	document.addEventListener('keyup', function(event){

		//logE(event.code)
		var code = event.code;
		if (code === 'Space') {
			// double call with focus on play playPause();
		} else if (code === 'ArrowUp' || code === 'NumpadAdd' || code === 'Equal') {
			range_control.plus_pressed();
		} else if (code === 'ArrowDown' || code === 'NumpadSubtract' || code === 'Minus') {
			range_control.minus_pressed();
		} else if (code === 'ArrowLeft') {
			decrementDivision();
		} else if (code === 'ArrowRight') {
			incrementDivision();
		} else if (code == 'Digit1' || code == 'Numpad1') {
			setBPM(60);
		} else if (code == 'Digit2' || code == 'Numpad2') {
			setBPM(75);
		} else if (code == 'Digit3' || code == 'Numpad3') {
			setBPM(90);
		} else if (code == 'Digit4' || code == 'Numpad4') {
			setBPM(105);
		} else if (code == 'Digit5' || code == 'Numpad5') {
			setBPM(120);
		} else if (code == 'Digit6' || code == 'Numpad6') {
			setBPM(135);
		} else if (code == 'Digit7' || code == 'Numpad7') {
			setBPM(150);
		} else if (code == 'Digit8' || code == 'Numpad8') {
			setBPM(165);
		} else if (code == 'Digit9' || code == 'Numpad9') {
			setBPM(180);
		} else if (code == 'Digit0' || code == 'Numpad0') {
			setBPM(195);
		}

		function setBPM(bpm){
			model.BPM = bpm;
			log("on BPM change: " + model.BPM);
			range_control.load(range_control.on_range_control_changed, "", MIN_BPM , MAX_BPM, 1, model.BPM, false, 0);
			cookies.set_BPM(model.BPM);
			update_UI_BPM(model.BPM);
			reloadActivePlayer();
		}

		function decrementDivision(){
			var new_beat_division = Math.max(model.beat_division - 1, 1);
			if(new_beat_division != model.beat_division){
				model.beat_division = new_beat_division;
				$("division_select").value = model.beat_division;
				reloadActivePlayer();
			}
		}
		function incrementDivision(){
			var new_beat_division = Math.min(model.beat_division + 1, 4);
			if(new_beat_division != model.beat_division){
				model.beat_division = new_beat_division;
				$("division_select").value = model.beat_division;
				reloadActivePlayer();
			}
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

function kofi(){
	window.open("https://ko-fi.com/jasonfleischer", "_blank");
}

function setup_info_alert(){
	$("info_alert_container").addEventListener("click", function(event){
		dismissInfo();
	});
	$("info_alert").addEventListener("click", function(event){
		event.stopPropagation();
		return false;
	});
}

function info(){
	$("info_alert_container").style.display = "block"; // show
}

function dismissInfo(){
	$("info_alert_container").style.display = "none"; // hide
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

function update_UI_mode(){
	$("accent_first_beat").style.display = (model.mode == MODE.NORMAL || model.mode == MODE.DRUM) ? "block" : "none";
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

function update_UI_darkmode(){
	if(model.darkmode)
		setDarkMode();
	else
		setLightMode();

	range_control.reload_colors();
	time_view.reload_colors();

	function setDarkMode(){
		var root = document.documentElement;
		root.style.setProperty('--highlight-color', "#070707");
		root.style.setProperty('--highlight-color-darker', "#333");
		root.style.setProperty('--primary-background-color', "#030405");
		root.style.setProperty('--secondary-background-color', "#000");
		root.style.setProperty('--tertiary-background-color', "#111");
		root.style.setProperty('--primary-font-color', "#eee");

		$("info_button_svg").src = "img/gear_white.svg";
	}

	function setLightMode(){
		var root = document.documentElement;
		root.style.setProperty('--highlight-color', "#f7f7f7");
		root.style.setProperty('--highlight-color-darker', "#999");
		root.style.setProperty('--primary-background-color', "#f3f4f5");
		root.style.setProperty('--secondary-background-color', "#fff");
		root.style.setProperty('--tertiary-background-color', "#eee");
		root.style.setProperty('--primary-font-color', "#111");

		$("info_button_svg").src = "img/gear_black.svg";
	}
}
