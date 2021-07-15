var storage = {};

storage.load = function(){
	model.BPM = storage.get_BPM(120);
	model.time_signature = storage.get_time_signature(TIME_SIGNATURE.TS_4_4);
	model.beat_division = storage.get_subdivision(1);
	model.accent_first_beat = storage.get_accent_first_beat(true);
	model.flash_screen = storage.get_flash_screen(false);
	model.tone = storage.get_tone(TONE.NORMAL);
	model.darkmode = storage.get_darkmode(true);
	model.volume_percent = storage.get_volume(100);
	model.duration = storage.get_duration(DURATION.INFINITE);
	translations.current_language = storage.get_language(LANGUAGE.ENGLISH);
}

storage.BPM_KEY = "BPM_KEY";
storage.get_BPM = function(default_value){
	return parseInt(storage.get(storage.BPM_KEY, default_value));
};
storage.set_BPM = function(value){
	localStorage.setItem(storage.BPM_KEY, value);
};

storage.TIME_SIGNATURE_KEY = "TIME_SIGNATURE_KEY";
storage.get_time_signature = function(default_value){
	return parseInt(storage.get(storage.TIME_SIGNATURE_KEY, default_value));
};
storage.set_time_signature = function(value){
	localStorage.setItem(storage.TIME_SIGNATURE_KEY, value);
};

storage.SUBDIVISION_KEY = "SUBDIVISION_KEY";
storage.get_subdivision = function(default_value){
	return parseInt(storage.get(storage.SUBDIVISION_KEY, default_value));
};
storage.set_subdivision = function(value){
	localStorage.setItem(storage.SUBDIVISION_KEY, value);
};

storage.ACCENT_FIRST_BEAT_KEY = "ACCENT_FIRST_BEAT_KEY";
storage.get_accent_first_beat = function(default_value){
	let value = storage.get(storage.ACCENT_FIRST_BEAT_KEY, default_value);
	return Boolean(value === "true" || value === true);
};
storage.set_accent_first_beat = function(value){
	localStorage.setItem(storage.ACCENT_FIRST_BEAT_KEY, value);
};

storage.FLASH_SCREEN_KEY = "FLASH_SCREEN_KEY";
storage.get_flash_screen = function(default_value){
	let value = storage.get(storage.FLASH_SCREEN_KEY, default_value);
	return Boolean(value === "true" || value === true);
};
storage.set_flash_screen = function(value){
	localStorage.setItem(storage.FLASH_SCREEN_KEY, value);
};

storage.TONE_KEY = "TONE_KEY";
storage.get_tone = function(default_value){
	return parseInt(storage.get(storage.TONE_KEY, default_value));
};
storage.set_tone = function(value){
	localStorage.setItem(storage.TONE_KEY, value);
};

storage.DARKMODE_KEY = "DARKMODE_KEY";
storage.get_darkmode = function(default_value){
	let value = storage.get(storage.DARKMODE_KEY, default_value);
	return Boolean(value === "true" || value === true);
};
storage.set_darkmode = function(value){
	localStorage.setItem(storage.DARKMODE_KEY, value);
};

storage.LANGUAGE_KEY = "LANGUAGE_KEY";
storage.get_language = function(default_value){
	return storage.get(storage.LANGUAGE_KEY, default_value);
};
storage.set_language = function(value){
	localStorage.setItem(storage.LANGUAGE_KEY, value);
};

storage.VOLUME_KEY = "VOLUME_KEY";
storage.get_volume = function(default_value){
	return storage.get(storage.VOLUME_KEY, default_value);
};
storage.set_volume = function(value){
	localStorage.setItem(storage.VOLUME_KEY, value);
};

storage.DURATION_KEY = "DURATION_KEY";
storage.get_duration = function(default_value){
	return storage.get(storage.DURATION_KEY, default_value);
};
storage.set_duration = function(value){
	localStorage.setItem(storage.DURATION_KEY, value);
};

storage.get = function(key, default_value) {
	let result = localStorage.getItem(key);
	return (result == undefined) ? default_value : result;
}