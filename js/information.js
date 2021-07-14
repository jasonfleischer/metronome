var information = {}

information.showAlert = function(){

	let contents = `
		<div>
			<ul class="desktop-only">
				<li>
					<div class="nav-side-menu-item">
						<span>Language</span>
						<select id="language_select">
							<option value="en" selected="selected">English</option>
							<option value="fr">French</option>
							<option value="es">Spanish</option>
							<option value="de">German</option>
							<option value="it">Italian</option>
							<option value="pt">Portuguese</option>
							<option value="ru">Russian</option>
							<option value="ja">Japan</option>
							<option value="ko">Korean</option>
							<option value="zh">Chinese</option>
						</select>
					</div>
				</li>
				<li id="darkmode">
					<div class="nav-toggle-item">
						<span>Dark Mode</span>
						<label id="darkmode_checkbox_switch" class="switch">
							<input id="darkmode_checkbox" type="checkbox" checked="checked"/>
							<span class="switch_track round" tabindex="0"></span>
						</label>
					</div>
				</li>
				<li id="volume">
					<div class="nav-side-menu-item">
						<span id="volume_row_text">Volume</span>
						<div class="range">
							<input id="volume_range" type="range" min="10" max="100" step="1" value="100">
						</div>
					</div>
				</li>
				<li>
					<div class="nav-side-menu-item">
					<span>Duration</span>
					<select id="duration_select">
						<option value="5">5 min</option>
						<option value="10">10 min</option>
						<option value="15">15 min</option>
						<option value="20">20 min</option>
						<option value="30">30 min</option>
						<option value="45">45 min</option>
						<option value="60">1 hour</option>
						<option value="-1" selected="selected">Infinite</option>
					</select>
					</div>
				</li>
			</ul>
		</div>
		<br class="desktop-only" />
		<p onclick="openMailToDeveloper()">Thank you for using this website. If you wish to submit feedback, comment or report an error click <strong>here</strong>.</p>
		<br/>
		<p onclick="openURL('https://surikov.github.io/webaudiofont/')">Special thanks to Surikov for their <strong>WebAudioFont</strong> library.</p>
		<br/>
		<p onclick="openURL('https://jasonfleischer.github.io/website/');">Information about the developer can be found <strong>here</strong>.</p>
		<br class="desktop-only"/>
		<button class="desktop-only" onclick="show_keyboard_shortcuts()">Keyboard Shortcuts</button>
	`
	alert.show("Information", contents)

	setup_language_control("language_select");
	information.setup_darkmode()
	information.setup_volume_control()
	setup_duration_control("duration_select");
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
			log("on volume range change: " + model.volume_percent);
			cookies.set_volume(model.volume_percent);

			audio_controller.init_sounds();
			if(audio_controller.playing && model.tone === TONE.TALKING){
				forcePlay();
			}
		});

		range.addEventListener('input', function(){
			model.volume_percent = parseFloat(this.value);
			log("on volume range input: " + model.volume_percent);
			cookies.set_volume(model.volume_percent);
		}, true);
	}
}


