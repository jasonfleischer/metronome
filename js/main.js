const log = require("@jasonfleischer/log");
const volumeRadialView = new RadialPercentView("volume_percent_view");

function init() {
	storage.load();
	translations.load();

	document.documentElement.lang = translations.current_language;
	
	setup_audio()
	function setup_audio(){
		audio_controller.init_sounds();
		click_controller.init();
		if(!window.mobileCheck()){
			drum_controller.init();
		}
	}
	setup_controls();
	setup_keyboard_listeners();
	
	alert.init()
	

	if(window.mobileAndTabletCheck()){
		setup_mobile();
	}

	update_UI_darkmode();
	update_UI_duration(model.duration * 60000);
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

function openURL(url){
	window.open(url, '_blank');
}

function openMailToDeveloper(){
	var subject = TR("Metronome Website Feedback");
	subject = subject.replaceAll(" ", "%20");
	openURL("mailto:jason_fleischer@hotmail.ca?Subject=" + subject);
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

	if(model.duration == -1) {
		volumeRadialView.draw(0,model.darkmode?"#EEE":"#000", 0.8, model.darkmode?"#000":"#FFF");
	}else {
		let percentage = (duration_in_MS / (model.duration*60000))*100;
		volumeRadialView.draw(percentage,model.darkmode?"#EEE":"#000", 0.8, model.darkmode?"#000":"#FFF");
	}

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
	update_UI_duration(model.duration*60000);
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
	update_UI_duration(model.duration * 60000);

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
