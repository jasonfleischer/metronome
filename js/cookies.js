var cookies = {};

cookies.FIRMWARE_OLD_VERSION_KEY = "old_firmware";
cookies.get_firmware_old_version = function(){
	return cookies.getCookie(cookies.FIRMWARE_OLD_VERSION_KEY);
};
cookies.set_firmware_old_version = function(version){
	document.cookie = cookies.FIRMWARE_OLD_VERSION_KEY + "=" + version;
};
cookies.delete_firmware_old_version = function(){
	cookies.deleteCookie(cookies.FIRMWARE_OLD_VERSION_KEY);
};

cookies.setCookie = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
cookies.getCookie = function(cname) {
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
	return "";
};
cookies.deleteCookie = function(cname) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000 * 60 * 60 * 24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    window.document.cookie = cname + "=" + "; " + expires;//Set the cookie with name and the expiration date
};
