var information = {}

information.showAlert = function(){

	let contents = `
		<div>
			<ul class="desktop-only">
				<li>
					<div class="nav-side-menu-item">
						<span>`+TR("Language")+`</span>
						<select id="language_select">
							<option value="en" selected="selected">`+TR("English")+`</option>
							<option value="fr">`+TR("French")+`</option>
							<option value="es">`+TR("Spanish")+`</option>
							<option value="de">`+TR("German")+`</option>
							<option value="it">`+TR("Italian")+`</option>
							<option value="pt">`+TR("Portuguese")+`</option>
							<option value="ru">`+TR("Russian")+`</option>
							<option value="ja">`+TR("Japan")+`</option>
							<option value="ko">`+TR("Korean")+`</option>
							<option value="zh">`+TR("Chinese")+`</option>
						</select>
					</div>
				</li>
				<li id="darkmode">
					<div class="nav-toggle-item">
						<span>`+TR("Dark Mode")+`</span>
						<label id="darkmode_checkbox_switch" class="switch">
							<input id="darkmode_checkbox" type="checkbox" checked="checked"/>
							<span class="switch_track round" tabindex="0"></span>
						</label>
					</div>
				</li>
				<li id="volume">
					<div class="nav-side-menu-item">
						<span id="volume_row_text">`+TR("Volume")+`</span>
						<div class="range">
							<input id="volume_range" type="range" min="10" max="100" step="1" value="100">
						</div>
					</div>
				</li>
				<li>
					<div class="nav-side-menu-item">
					<span>`+TR("Duration")+`</span>
					<select id="duration_select">
						<option value="5">`+TR("5 min")+`</option>
						<option value="10">`+TR("10 min")+`</option>
						<option value="15">`+TR("15 min")+`</option>
						<option value="20">`+TR("20 min")+`</option>
						<option value="30">`+TR("30 min")+`</option>
						<option value="45">`+TR("45 min")+`</option>
						<option value="60">`+TR("1 hour")+`</option>
						<option value="-1" selected="selected">`+TR("Infinite")+`</option>
					</select>
					</div>
				</li>
			</ul>
		</div>
		<br class="desktop-only" />
		<p id="mail_link">`+TR("Thank you for using this website. If you wish to submit feedback, comment or report an error click <strong>here</strong>.")+`</p>
		<br/>
		<p id="surikov_link">`+TR("Special thanks to Surikov for their <strong>WebAudioFont</strong> library.")+`</p>
		<br/>
		<p id="website_link">`+TR("Information about the developer can be found <strong>here</strong>.")+`</p>
		<br class="desktop-only"/>
		<button class="desktop-only" id="keyboard_shortcuts">`+TR("Keyboard Shortcuts")+`</button>
	`
	alert.show(TR("Information"), contents)

	setup_language_control("language_select");
	information.setup_darkmode();
	information.setup_volume_control();
	information.setupOnClicks();
	setup_duration_control("duration_select");
}

information.setupOnClicks = function() {
	$("mail_link").addEventListener('click', function(e) {
  		openMailToDeveloper();
	});
	$("surikov_link").addEventListener('click', function(e) {
  		openURL('https://surikov.github.io/webaudiofont/');
	});
	$("website_link").addEventListener('click', function(e) {
  		openURL('https://jasonfleischer.github.io/website/');
	});
	$("keyboard_shortcuts").addEventListener('click', function(e) {
  		show_keyboard_shortcuts();
	});
}

information.dismissAlert = function(){
	alert.dismiss()
}

information.setup_darkmode = function(){
	setup_darkmode($("darkmode"), $("darkmode_checkbox_switch"), $("darkmode_checkbox"));
	$("darkmode_checkbox").checked = model.darkmode;
}

information.setup_volume_control = function(){ 

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


