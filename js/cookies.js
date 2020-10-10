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
	return Boolean(cookies.getCookie(cookies.ACCENT_FIRST_BEAT_KEY, default_value));
};
cookies.set_accent_first_beat = function(value){
	document.cookie = cookies.ACCENT_FIRST_BEAT_KEY + "=" + value;
};

cookies.MODE_KEY = "MODE_KEY";
cookies.get_mode = function(default_value){
	return parseInt(cookies.getCookie(cookies.MODE_KEY, default_value));
};
cookies.set_mode = function(value){
	document.cookie = cookies.MODE_KEY + "=" + value;
};

cookies.DARKMODE_KEY = "DARKMODE_KEY";
cookies.get_darkmode = function(default_value){
	return Boolean(cookies.getCookie(cookies.DARKMODE_KEY, default_value));
};
cookies.set_darkmode = function(value){
	document.cookie = cookies.DARKMODE_KEY + "=" + value;
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
