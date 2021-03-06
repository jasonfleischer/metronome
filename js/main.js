
//todo 

 
// mobile 
//	safari - no midi sound
//	chrome - no sound for midi, landscape portait (need to reload)
// other browsers
//	safari - no issues
//  firefox - no issues
//	edge - no issue

// python -m SimpleHTTPServer 8000
// http://localhost:8000/


function init() {
	storage.load();
	translations.load();
	
	setup_audio()
	function setup_audio(){
		audio_controller.init_sounds();
		click_controller.init();
		if(!window.mobileCheck()){
			drum_controller.init();
		}
	}

	setup_controls();
	function setup_controls(){
		setup_language_select();
		setup_tone_select();
		setup_time_signature_select();
		setup_beat_division_select();
		setup_accent_first_beat_switch();
		setup_flash_screen_switch();
		setup_bpm_controls();	
		setup_mobile_darkmode_switch();
		setup_mobile_duration_select();	
	}

	setup_keyboard_listeners();
	alert.init()
	setup_settings_menu_on_click();

	if(window.mobileCheck()){
		setup_mobile();
	}

	update_UI_darkmode();
	show_hidden_views();
	time_view.init();

}

function setup_mobile(){
	model.tone = TONE.NORMAL;
	$("tone").style.display = "none";

	if (isSafari && !isFromHomeScreen()){
		install.showAlert()
	}	
}

function show_hidden_views(){
	$("header").style.display = "block";
	if(!is_compact_window())
		$("nav-side-menu").style.display = "block";
	$("content_view").style.display = "block";
}

// window resize

var window_resize_start_event_occured = false;
var resized_timer;
window.onresize = function(){
	clearTimeout(resized_timer);
	resized_timer = setTimeout(window_resized_end, 200);
	if(!window_resize_start_event_occured) {
		window_resized_start();
		window_resize_start_event_occured = true;
	}
};

function window_resized_start(){
	$("bpm_text").style.display = "none"; // hide
	$("time_view_container").style.display = "none"; // hide
	$("status_msg").style.display = "none"; // hide
	$("nav-side-menu").style.display = "none"; // hide
	dismissInfo();	
}

function window_resized_end(){

	window_resize_start_event_occured = false;

	if(is_compact_window()) {
		hide_settings();
	} else {
		$("nav-side-menu").style.display = "block";
		$("kofi_button").style.display = "block";
		$("info_button").style.display = "block";
	}

	if(audio_controller.playing){
		$("time_view_container").style.display = "block"; // show
	} else {
		$("status_msg").style.display = "block"; // show
	}
	time_view.resize();
	time_view.draw_background();
	
	$("bpm_text").style.display = "block"; // show
	range_control.resize_bpm_text();
}

var flash_timer;
function flash_screen_animation(){
	var element = $("flash_screen");
	element.style.display = 'block';
	clearInterval(flash_timer);

	var op = 1;  // initial opacity
    flash_timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(flash_timer);
            element.style.display = 'none';
            element.style.opacity = 0;
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.15;
    }, 50);
}

// on click

function kofi(){
	window.open("https://ko-fi.com/jasonfleischer", "_blank");
}

function info(){
	information.showAlert()
}
function dismissInfo(){
	information.dismissAlert()
}

function toggle_settings(){
	if($("nav-side-menu").style.display !== "block")
		show_settings();
	else
		hide_settings();
}

var settings_animation_id;
function show_settings() {
	$("nav-side-menu").style.display = "block";
	$("kofi_button").style.display = "none";
	$("info_button").style.display = "none";
	$("setting_button_svg").src = (model.darkmode) ? "img/close_white.svg" : "img/close_black.svg";

	settings_slide_down_animation();
	function settings_slide_down_animation(){
		var elem = $("nav-side-menu");
		var height = $("nav-menu-ul").offsetHeight;
		var pos = -1*height;
		settings_animation_id = setInterval(frame, 10);
		elem.style.top = pos + 'px';
		function frame() {
			if (pos == 0) {
				clearInterval(settings_animation_id);
			} else {
				pos = Math.min(pos + 15, 0);
				elem.style.top = pos + 'px';
			}
		}
	}
}
function hide_settings(){
	clearInterval(settings_animation_id);
	$("nav-side-menu").style.display = "none";
	$("kofi_button").style.display = "block";
	$("info_button").style.display = "block";
	$("setting_button_svg").src = (model.darkmode) ? "img/gear_white.svg" : "img/gear_black.svg";
}
function setup_settings_menu_on_click(){
	$("ul_wrapper").addEventListener("click", function(event){
		if(is_compact_window())
			hide_settings();
	});
	$("nav-menu-ul").addEventListener("click", function(event){
		event.stopPropagation();
		return false;
	});
}

function openURL(url){
	window.open(url, '_blank');
}

function openMailToDeveloper(){
	var subject = TR("Metronome Website Feedback");
	subject = subject.replaceAll(" ", "%20");
	openURL("mailto:jason_fleischer@hotmail.ca?Subject=" + subject);
}

// setup controls

function setup_bpm_controls() {

	var min = MIN_BPM;
	var max = MAX_BPM;
	var step = 1;
	setup_bpm_dial(min, max, step);
	setup_bpm_range(min, max, step);
	setup_bpm_prompt();
	$("bpm_row_text").innerHTML = "BPM: " + model.BPM;

	function setup_bpm_dial(min, max, step){
		var on_range_control_changed = function(BPM_value){
			log("on BPM dial change: " + BPM_value);
			model.BPM = BPM_value;
			storage.set_BPM(model.BPM);
			update_UI_BPM(model.BPM);
			reloadBPM();
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
			storage.set_BPM(model.BPM);
			update_UI_BPM(model.BPM);
			reloadBPM();
		});

		bpm_range.addEventListener('input', function(){
			model.BPM = parseFloat(this.value);
			log("on BPM range change: " + model.BPM);
			storage.set_BPM(model.BPM);
			update_UI_BPM(model.BPM);
			reloadBPM();
		}, true);
	}

	function setup_bpm_prompt(){
		$("bpm_text").addEventListener("click", function(e){
			bpm_prompt();
		});

		function bpm_prompt(){
			var was_playing = forceStop();
			var BPM = parseInt(prompt(TR("Enter a BPM value:"), model.BPM));
			if(BPM >= MIN_BPM && BPM <= MAX_BPM){
				log("on BPM prompt change: " + BPM);
				model.BPM = BPM;
				range_control.load(range_control.on_range_control_changed, "", MIN_BPM , MAX_BPM, 1, model.BPM, false, 0);
				storage.set_BPM(model.BPM);
				update_UI_BPM(model.BPM);
				reloadBPM();
				if(was_playing) playPause(); 
			}else {
				log("Invalid BPM value" + BPM);
			}
		}
	}
}

function setup_mobile_duration_select() {
	setup_duration_control("mobile_duration_select");
}
function setup_duration_control(element_id){
	$(element_id).addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on duration_select: " + value);
		model.duration = value;
		storage.set_duration(value);
		durationStartTime = new Date();
		audio_controller.reloadDuration();
		update_UI_duration(model.duration * 60000);
	});
	$(element_id).value = model.duration;
	update_UI_duration(model.duration * 60000);
}

function setup_tone_select() {
	$("tone_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on tone_select: " + value);
		model.tone = value;
		storage.set_tone(value);
		update_UI_tone();
		audio_controller.reloadSounds();
	});
	$("tone_select").value = model.tone;
	update_UI_tone();
}

function setup_time_signature_select() {
	$("time_signature_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on time_signature_select: " + value);
		model.time_signature = value ;
		storage.set_time_signature(value);
		reloadActivePlayer();
	});
	$("time_signature_select").value = model.time_signature;
}

function setup_beat_division_select() {
	$("division_select").addEventListener("change", function(e){
		var value = parseInt(this.value);
		log("on division_select: " + value);
		storage.set_subdivision(value);
		reloadDivisions(value);
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
		storage.set_accent_first_beat(value);
	});
	$("accent_first_beat_checkbox").checked = model.accent_first_beat;
}

function setup_flash_screen_switch() {
	$("screen_flash").addEventListener("click", function(e){
		$("screen_flash_checkbox").click();
	});
	$("screen_flash_checkbox_switch").addEventListener('keyup', function(e) {
		if (event.code === 'Space' || event.code === 'Enter') $("screen_flash_checkbox").click();
	});
	$("screen_flash_checkbox").addEventListener("change", function(e){
		var value = this.checked;
		log("on screen flash change: " + value);
		model.flash_screen = value;
		storage.set_flash_screen(value);
	});
	$("screen_flash_checkbox").checked = model.flash_screen;
}

function setup_mobile_darkmode_switch() {
	setup_darkmode($("mobile_darkmode"), $("mobile_darkmode_checkbox_switch"), $("mobile_darkmode_checkbox"));
	
}
function setup_darkmode(background_obj, switch_obj, checkbox_obj ){

	background_obj.addEventListener("click", function(e){
		checkbox_obj.click();
	});
	switch_obj.addEventListener('keyup', function(event){
		if (event.code === 'Space'|| event.code === 'Enter') $("darkmode_checkbox").click();
	});
	checkbox_obj.addEventListener("change", function(e){
		var value = this.checked;
		log("on darkmode change: " + value);
		model.darkmode = value;
		storage.set_darkmode(value);
		update_UI_darkmode();
	});
	checkbox_obj.checked = model.darkmode;

	update_UI_darkmode();
}

// update_UI

function update_UI_BPM(value) {
	var range = $("bpm_range");
	range.value = value;

	update_UI_tempo_marking(value);
	range_control.resize_bpm_text();

	$("bpm_row_text").innerHTML = TR("BPM") + ": " + value

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

function update_UI_tone(){
	$("accent_first_beat").style.display = (model.tone == TONE.NORMAL || model.tone == TONE.DRUM) ? "block" : "none";
	$("status_msg").innerHTML = model.tone == TONE.TALKING ? TR("Configure then press 'Play' to begin. Talking setting works best at lower BPMs.") : TR("Configure then press 'Play' to begin");
}

function update_UI_duration(duration_in_MS){
	var new_text;
	if(duration_in_MS < 0)
		new_text = audio_controller.playing ? TR("Stop"): TR("Play");
	else {
		var time_display =  " (" + human_readable_duration(duration_in_MS) + ")"
		if (time_display == " ()"){ time_display = ""; }
		new_text = (audio_controller.playing ? TR("Stop"): TR("Play")) + "<span id='play_pause_button_span'>" + time_display + "</span>" ;
	}
	$("play_pause_button").innerHTML = new_text
	$("mobile_play_pause_button").innerHTML = new_text

	function human_readable_duration(duration_in_MS){

		var isEnglish = translations.current_language === LANGUAGE.ENGLISH
		var duration_in_seconds = duration_in_MS / 1000;
		if(duration_in_seconds < 60) {
			return formattedSeconds(duration_in_seconds);
		} else if(duration_in_seconds < 60*60){
			var mins = parseInt(duration_in_seconds/60)
			var secs = duration_in_seconds - (mins*60)
			if (isEnglish)
				return mins + " min" +  (secs==0?"":" ") + formattedSeconds(secs)
			else 
				return mins + ":" + formattedSeconds(secs)
		} else if (duration_in_seconds >= 60*60) {
			var hours = parseInt(duration_in_seconds/60/60)
			return hours + (isEnglish ? " hour" : ":00")
		} else {
			LogE("not handled human readable duration")
			return ""
		}

		function formattedSeconds(seconds){
			seconds = parseInt(seconds)
			if(seconds == 0) return (isEnglish ? "":"00")
			else if (seconds < 10) return "0"+seconds +(isEnglish ? " s":"")
			else return seconds+(isEnglish ? " s":"")
		}
	}
}

function update_UI_playing(){
	//$("play_pause_button").innerHTML = TR("Stop"); 
	//$("mobile_play_pause_button").innerHTML = TR("Stop");
	$("init_view").style.display = "none"; // hide
	time_view.start(model.time_signature, model.BPM);
	startDurationTimer();
}

var durationTimer;
var durationStartTime;
function startDurationTimer(){

	durationStartTime = new Date();
	update_UI_duration(model.duration*60000);

	durationTimer = setInterval(function () {

		var now = new Date();
		var diff = parseInt(now - durationStartTime);
		update_UI_duration(model.duration*60000 - diff);
	}, 500);
}

function update_UI_stopped(){
	update_UI_duration(model.duration*60000)
	//$("play_pause_button").innerHTML = TR("Play");
	//$("mobile_play_pause_button").innerHTML = TR("Play");
	$("count_text").innerHTML = "\xa0";
	$("init_view").style.display = "block"; // show
	time_view.stop();
	stopDurationTimer();
}

function stopDurationTimer(){
	clearTimeout(durationTimer);
}

function update_UI_darkmode(){
	if(model.darkmode)
		setDarkMode();
	else
		setLightMode();

	range_control.reload_colors();
	time_view.reload_colors();

	
	$("mobile_darkmode_checkbox").checked = model.darkmode;

	function setDarkMode(){
		var root = document.documentElement;
		root.style.setProperty('--highlight-color', "#444");
		root.style.setProperty('--primary-background-color', "#252525"); // 3
		root.style.setProperty('--secondary-background-color', "#000"); // 1
		root.style.setProperty('--tertiary-background-color', "#494949"); // 2
		root.style.setProperty('--primary-font-color', "#fff"); // inverse of 1

		$("info_button_svg").src = "img/info_white.svg";
		$("dismiss_close_button_svg").src = "img/close_white.svg";
		if($("nav-side-menu").style.display !== "block")
			$("setting_button_svg").src = "img/gear_white.svg";
		else 
			$("setting_button_svg").src = "img/close_white.svg";
	}

	function setLightMode(){
		var root = document.documentElement;
		root.style.setProperty('--highlight-color', "#ddd");
		root.style.setProperty('--primary-background-color', "#efefef"); // 3
		root.style.setProperty('--secondary-background-color', "#fff"); // 1
		root.style.setProperty('--tertiary-background-color', "#f5f5f5"); // 2
		root.style.setProperty('--primary-font-color', "#111"); // inverse of 1

		$("info_button_svg").src = "img/info_black.svg";
		$("dismiss_close_button_svg").src = "img/close_black.svg";
		if($("nav-side-menu").style.display !== "block")
			$("setting_button_svg").src = "img/gear_black.svg";
		else 
			$("setting_button_svg").src = "img/close_black.svg";
	}
}
