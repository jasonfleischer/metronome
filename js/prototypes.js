
Number.prototype.to_percent = function(min, max){
    return 100.0 * (this - min) / (max - min);
};

// util
function $(id){
	return document.getElementById(id);
}

function isFirefox(){
	function checkBrowser(){
	    c = navigator.userAgent.search("Chrome");
	    f = navigator.userAgent.search("Firefox");
	    m8 = navigator.userAgent.search("MSIE 8.0");
	    m9 = navigator.userAgent.search("MSIE 9.0");
	    if (c > -1) {
	        browser = "Chrome";
	    } else if (f > -1) {
	        browser = "Firefox";
	    } else if (m9 > -1) {
	        browser ="MSIE 9.0";
	    } else if (m8 > -1) {
	        browser ="MSIE 8.0";
	    } else {
	    	browser ="Other - Safari"
	    }
	    return browser;
	}
	return checkBrowser() === "Firefox";
}

function screen_width_is_mobile(){
	return window.innerWidth <= 650;
}
