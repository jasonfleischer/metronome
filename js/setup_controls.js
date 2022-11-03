function setup_controls(){

	setup_on_clicks();

	setup_bpm_controls();
	setup_tone_select();
	setup_time_signature_select();
	setup_beat_division_select();
	setup_duration_select();
	setup_volume_control();
	
	setup_accent_first_beat_switch();
	setup_flash_screen_switch();
		
	setup_mobile_language_select();
	setup_mobile_darkmode_switch();

	function setup_on_clicks() {
		$("page_name").addEventListener('click', function(e) {
	  		info();
		});
		$("kofi_button").addEventListener('click', function(e) {
	  		kofi();
		});
		$("info_button").addEventListener('click', function(e) {
	  		info();
		});
		$("setting_button").addEventListener('click', function(e) {
	  		toggle_settings();
		});
		$("tap_button").addEventListener('click', function(e) {
	  		tap_controller.tap();
		});
		$("play_pause_button").addEventListener('click', function(e) {
	  		playPause();
		});
		$("mobile_tap_button").addEventListener('click', function(e) {
	  		tap_controller.tap();
		});
		$("mobile_play_pause_button").addEventListener('click', function(e) {
	  		playPause();
		});

		setup_settings_menu_on_click();
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
	}

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
				log.i("on BPM dial change: " + BPM_value);
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
				log.i("on BPM range change: " + model.BPM);
				range_control.load(range_control.on_range_control_changed, "", min , max, step, model.BPM, false, 0);
				storage.set_BPM(model.BPM);
				update_UI_BPM(model.BPM);
				reloadBPM();
			});

			bpm_range.addEventListener('input', function(){
				model.BPM = parseFloat(this.value);
				log.i("on BPM range change: " + model.BPM);
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
					log.i("on BPM prompt change: " + BPM);
					model.BPM = BPM;
					range_control.load(range_control.on_range_control_changed, "", MIN_BPM , MAX_BPM, 1, model.BPM, false, 0);
					storage.set_BPM(model.BPM);
					update_UI_BPM(model.BPM);
					reloadBPM();
					if(was_playing) playPause(); 
				}else {
					log.i("Invalid BPM value" + BPM);
				}
			}
		}
	}

	function setup_tone_select() {
		$("tone_select").addEventListener("change", function(e){
			var value = parseInt(this.value);
			log.i("on tone_select: " + value);
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
			log.i("on time_signature_select: " + value);
			model.time_signature = value ;
			storage.set_time_signature(value);
			reloadActivePlayer();
		});
		$("time_signature_select").value = model.time_signature;
	}

	function setup_beat_division_select() {
		$("division_select").addEventListener("change", function(e){
			var value = parseInt(this.value);
			log.i("on division_select: " + value);
			storage.set_subdivision(value);
			reloadDivisions(value);
		});
		$("division_select").value = model.beat_division;
	}

	function setup_duration_select(){
		var element_id = "mobile_duration_select";
		$(element_id).addEventListener("change", function(e){
			var value = parseInt(this.value);
			log.i("on duration_select: " + value);
			model.duration = value;
			storage.set_duration(value);
			durationStartTime = new Date();
			audio_controller.reloadDuration();
			update_UI_duration(model.duration * 60000);
		});
		$(element_id).value = model.duration;
		update_UI_duration(model.duration * 60000);
	}

	function setup_volume_control(){ 

		var min = 10;
		var max = 100;
		var step = 1;
		setup_volume_range(min, max, step);

		function setup_volume_range(min, max, step){
			var range = $("volume_range");
			range.min = min;
			range.max = max;
			range.value = model.volume_percent;
			range.step = step;
			range.addEventListener("change", function(e){
				model.volume_percent = parseFloat(this.value);
				log.i("on volume range change: " + model.volume_percent);
				storage.set_volume(model.volume_percent);

				audio_controller.init_sounds();
				if(audio_controller.playing && model.tone === TONE.TALKING){
					forcePlay();
				}
			});

			range.addEventListener('input', function(){
				model.volume_percent = parseFloat(this.value);
				log.i("on volume range input: " + model.volume_percent);
				storage.set_volume(model.volume_percent);
			}, true);
		}
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
			log.i("on accent beat change: " + value);
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
			log.i("on screen flash change: " + value);
			model.flash_screen = value;
			storage.set_flash_screen(value);
		});
		$("screen_flash_checkbox").checked = model.flash_screen;
	}

	function setup_mobile_language_select(){
		var element_id = "mobile_language_select";
		$(element_id).addEventListener("change", function(e){
			var value = this.value;
			log.i("on language_select: " + value);
			translations.current_language = value;
			storage.set_language(value);
			location.reload();
		});
		$(element_id).value = translations.current_language;
	}

	function setup_mobile_darkmode_switch() {
		setup_darkmode($("mobile_darkmode"), $("mobile_darkmode_checkbox_switch"), $("mobile_darkmode_checkbox"));	
	
		function setup_darkmode(background_obj, switch_obj, checkbox_obj ){

			background_obj.addEventListener("click", function(e){
				checkbox_obj.click();
			});
			switch_obj.addEventListener('keyup', function(event){
				if (event.code === 'Space'|| event.code === 'Enter') $("darkmode_checkbox").click();
			});
			checkbox_obj.addEventListener("change", function(e){
				var value = this.checked;
				log.i("on darkmode change: " + value);
				model.darkmode = value;
				storage.set_darkmode(value);
				update_UI_darkmode();
			});
			checkbox_obj.checked = model.darkmode;

			update_UI_darkmode();
		}
	}	
}

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