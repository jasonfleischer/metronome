function load_cookies(){
	model.BPM = cookies.get_BPM(120);
	model.time_signature = cookies.get_time_signature(TIME_SIGNATURE.TS_4_4);
	model.beat_division = cookies.get_subdivision(1);
	model.accent_first_beat = cookies.get_accent_first_beat(true);
	model.flash_screen = cookies.get_flash_screen(false);
	model.tone = cookies.get_tone(TONE.NORMAL);
	model.darkmode = cookies.get_darkmode(true);
	translations.current_language = cookies.get_language(LANGUAGE.ENGLISH);
}

var cookies = {};

cookies.BPM_KEY = "BPM_KEY";
cookies.get_BPM = function(default_value){
	return parseInt(cookies.getCookie(cookies.BPM_KEY, default_value));
};
cookies.set_BPM = function(value){
	document.cookie = cookies.BPM_KEY + "=" + value;
};
cookies.delete_BPM = function(){
	cookies.deleteCookie(cookies.BPM_KEY);
};

cookies.TIME_SIGNATURE_KEY = "TIME_SIGNATURE_KEY";
cookies.get_time_signature = function(default_value){
	return parseInt(cookies.getCookie(cookies.TIME_SIGNATURE_KEY, default_value));
};
cookies.set_time_signature = function(value){
	document.cookie = cookies.TIME_SIGNATURE_KEY + "=" + value;
};

cookies.SUBDIVISION_KEY = "SUBDIVISION_KEY";
cookies.get_subdivision = function(default_value){
	return parseInt(cookies.getCookie(cookies.SUBDIVISION_KEY, default_value));
};
cookies.set_subdivision = function(value){
	document.cookie = cookies.SUBDIVISION_KEY + "=" + value;
};

cookies.ACCENT_FIRST_BEAT_KEY = "ACCENT_FIRST_BEAT_KEY";
cookies.get_accent_first_beat = function(default_value){
	var value = cookies.getCookie(cookies.ACCENT_FIRST_BEAT_KEY, default_value);
	return Boolean(value === "true" || value === true);
};
cookies.set_accent_first_beat = function(value){
	document.cookie = cookies.ACCENT_FIRST_BEAT_KEY + "=" + value;
};

cookies.FLASH_SCREEN_KEY = "FLASH_SCREEN_KEY";
cookies.get_flash_screen = function(default_value){
	var value = cookies.getCookie(cookies.FLASH_SCREEN_KEY, default_value);
	return Boolean(value === "true" || value === true);
};
cookies.set_flash_screen = function(value){
	document.cookie = cookies.FLASH_SCREEN_KEY + "=" + value;
};

cookies.TONE_KEY = "TONE_KEY";
cookies.get_tone = function(default_value){
	return parseInt(cookies.getCookie(cookies.TONE_KEY, default_value));
};
cookies.set_tone = function(value){
	document.cookie = cookies.TONE_KEY + "=" + value;
};

cookies.DARKMODE_KEY = "DARKMODE_KEY";
cookies.get_darkmode = function(default_value){
	var value = cookies.getCookie(cookies.DARKMODE_KEY, default_value);
	return Boolean(value === "true" || value === true);
};
cookies.set_darkmode = function(value){
	document.cookie = cookies.DARKMODE_KEY + "=" + value;
};

cookies.LANGUAGE_KEY = "LANGUAGE_KEY";
cookies.get_language = function(default_value){
	var value = cookies.getCookie(cookies.LANGUAGE_KEY, default_value);
	return value;
};
cookies.set_language = function(value){
	document.cookie = cookies.LANGUAGE_KEY + "=" + value;
};

cookies.setCookie = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
cookies.getCookie = function(cname, default_value) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return default_value;
};
cookies.deleteCookie = function(cname) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000 * 60 * 60 * 24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    window.document.cookie = cname + "=" + "; " + expires;//Set the cookie with name and the expiration date
};
