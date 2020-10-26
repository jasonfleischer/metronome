const LANGUAGE = Object.freeze({
	ENGLISH: "en",
	FRENCH: "fr",
	SPANISH: "es",
	GERMAN: "de",
	ITALIAN: "it",
	PORTUGUESE: "pt",
	JAPANESE: "ja", 
	KOREAN: "ko",
	SIMPLIFIED_CHINESE: "zh",
	RUSSIAN: "ru"
});

function TR(text){

	if(translations.current_language === LANGUAGE.ENGLISH)
		return text;

	var index = en.indexOf(text);
	var translation;
	if(translations.current_language === LANGUAGE.FRENCH){
		translation = fr[index];
	} else if(translations.current_language === LANGUAGE.SPANISH){
		translation = es[index];
	} else if(translations.current_language === LANGUAGE.GERMAN){
		translation = de[index];
	} else if(translations.current_language === LANGUAGE.ITALIAN){
		translation = it[index];
	} else if(translations.current_language === LANGUAGE.PORTUGUESE){
		translation = pt[index];
	} else if(translations.current_language === LANGUAGE.JAPANESE){
		translation = ja[index];
	} else if(translations.current_language === LANGUAGE.KOREAN){
		translation = ko[index];
	} else if(translations.current_language === LANGUAGE.SIMPLIFIED_CHINESE){
		translation = zh[index];
	} else if(translations.current_language === LANGUAGE.RUSSIAN){
		translation = ru[index];
	} else {
		logE("Language not supported");
		return
	}

	if(translation != undefined)
		return translation;
	else
		return "Missing " + translations.current_language;
}

function setup_language_select() {
	document.documentElement.lang = translations.current_language;
	setup_language_control("language_select");
	setup_language_control("mobile_language_select");
	
	function setup_language_control(element_id){
		$(element_id).addEventListener("change", function(e){
			var value = this.value;
			log("on language_select: " + value);
			translations.current_language = value;
			cookies.set_language(value);
			location.reload();
		});
		$(element_id).value = translations.current_language;
	}
}

var translations = {
	current_language: LANGUAGE.ENGLISH,
	search_tags: ["p", "button", "option", "span", "h1", "h2", "h3", "h4"]
};

translations.load = function(){
	if(this.current_language != LANGUAGE.ENGLISH)
		this.translate(this.current_language);
} 

translations.translate = function(language){

	//document.documentElement.lang = language;
	var i;
	for(i=0; i<this.search_tags.length; i++){
		Array.prototype.forEach.call(document.getElementsByTagName(this.search_tags[i]), function (element) {	

			var text = element.innerHTML;

			if(translations.is_valid_inner_html(text) || text.includes('<strong>') ){
				element.innerHTML = TR(text);
			} /*else {
				logE("not transtalting text: " + text);
			}*/
		});
	}
}
translations.is_valid_inner_html = function(text){
	return text != undefined  && text !== "" &&
		!(text.includes(">") || text.includes(">") || text.includes("&nbsp"));
}

translations.generate = function(){

	log("GENERATING translations")
	var generated_translate_string = "var " + this.current_language + " = [\n";
	var processed_texts = [];
	var i;
	for(i=0; i<this.search_tags.length; i++){
		Array.prototype.forEach.call(document.getElementsByTagName(this.search_tags[i]), function (element) {	

			var text = element.innerHTML;

			if((translations.is_valid_inner_html(text) || text.includes('<strong>')) && !processed_texts.includes(text)){
				processed_texts.push(text)
				generated_translate_string += '"'+text+'"' + ", \n";
			} else {
				log("text ignored or duplicate |"+element.innerHTML+"|");
			}
		});
	}

	var js_text = [	"<tr><th>Key</th><th>Command</th></tr><tr><td>Space</td><td>Play / Stop</td></tr><tr><td>Up Arrow</td><td>Increment Tempo</td></tr><tr><td>Down Arrow</td><td>Decrement Tempo</td></tr><tr><td>Left Arrow</td><td>Decrement Subdivision</td></tr><tr><td>Right Arrow</td><td>Increment Subdivision</td></tr><tr><td>Letter T</td><td>Tap Tempo</td></tr><tr><td>Letter D</td><td>Double Tempo</td></tr><tr><td>Letter H</td><td>Half Tempo</td></tr><tr><td>Digit 1</td><td>60 BPM</td></tr><tr><td>Digit 2</td><td>75 BPM</td></tr><tr><td>Digit 3</td><td>90 BPM</td></tr><tr><td>Digit 4</td><td>105 BPM</td></tr><tr><td>Digit 5</td><td>120 BPM</td></tr><tr><td>Digit 6</td><td>135 BPM</td></tr><tr><td>Digit 7</td><td>150 BPM</td></tr><tr><td>Digit 8</td><td>165 BPM</td></tr><tr><td>Digit 9</td><td>180 BPM</td></tr><tr><td>Digit 0</td><td>195 BPM</td></tr>",
					"Keep Tapping", 
					"Configure / press 'Play' to begin. Talking mode works best at lower BPMs.", 
					"Stop",
					"Metronome Website Feedback"];
	var j;
	for(j=0; j<js_text.length; j++){
		generated_translate_string += '"' + js_text[j] + '"' + ((j==js_text.length-1)? "];" : ",\n");
	}
	console.log(generated_translate_string);
}
//translations.generate();
