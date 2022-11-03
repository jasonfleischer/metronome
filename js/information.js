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
	information.setupOnClicks();
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




