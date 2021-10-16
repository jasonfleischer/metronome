// step 1: $ python <path>/find_js_translations.py
// step 2: paste output (js_translations) in generated.js
// step 3: uncomment 'translations.generate();' of translations.js
// step 4: paste output (en) in generated.js and google_translations.py
// step 5: $pip3 install googletrans; $python3 <path>/google_translations.py
// step 6: paste outputs in generated.js, check for errors
// step 7: comment 'translations.generate();' of translations.js

const LANGUAGE = Object.freeze({
	ENGLISH: "en",
	FRENCH: "fr",
	SPANISH: "es",
	GERMAN: "de",
	ITALIAN: "it",
	PORTUGUESE: "pt",
	RUSSIAN: "ru",
	JAPANESE: "ja", 
	KOREAN: "ko",
	SIMPLIFIED_CHINESE: "zh"
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
	} else if(translations.current_language === LANGUAGE.RUSSIAN){
		translation = ru[index];
	} else if(translations.current_language === LANGUAGE.JAPANESE){
		translation = ja[index];
	} else if(translations.current_language === LANGUAGE.KOREAN){
		translation = ko[index];
	} else if(translations.current_language === LANGUAGE.SIMPLIFIED_CHINESE){
		translation = zh[index];
	} else {
		log.e("Language not supported");
		return
	}

	if(translation != undefined)
		return translation;
	else
		return "Missing " + translations.current_language;
}

function setup_language_select() {
	document.documentElement.lang = translations.current_language;
	setup_language_control("mobile_language_select");
}

function setup_language_control(element_id){
	$(element_id).addEventListener("change", function(e){
		var value = this.value;
		log.i("on language_select: " + value);
		translations.current_language = value;
		storage.set_language(value);
		location.reload();
	});
	$(element_id).value = translations.current_language;
}

var translations = {
	current_language: LANGUAGE.ENGLISH,
	search_tags: ["p", "button", "option", "span", "h1", "h2", "h3", "h4"]
};

translations.load = function(){
	if(this.current_language != LANGUAGE.ENGLISH)
		this.translate(this.current_language);
	
	if(translations.current_language === LANGUAGE.JAPANESE || translations.current_language === LANGUAGE.SIMPLIFIED_CHINESE){
		Array.prototype.forEach.call(document.getElementsByTagName("h3"), function (element) {	
			element.style.fontSize = "14px";
		});
	}
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
				log.e("not transtalting text: " + text);
			}*/
		});
	}
}
translations.is_valid_inner_html = function(text){
	return text != undefined  && text !== "" &&
		!(text.includes(">") || text.includes(">") || text.includes("&nbsp"));
}

translations.generate = function(){

	console.log("GENERATING translations")
	var generated_translate_string = "var " + this.current_language + " = [\n";
	var processed_texts = [];
	var i;
	for(i=0; i<this.search_tags.length; i++){
		Array.prototype.forEach.call(document.getElementsByTagName(this.search_tags[i]), function (element) {	

			var text = element.innerHTML;

			if((translations.is_valid_inner_html(text) || text.includes('<strong>')) && !processed_texts.includes(text)){
				processed_texts.push(text)
				generated_translate_string += '"'+text+'"' + ",\n";
			} else {
				log.i("text ignored or duplicate |"+element.innerHTML+"|");
			}
		});
	}
	var j;
	for(j=0; j<js_translations.length; j++){
		var text = js_translations[j];
		
		if(!processed_texts.includes(text)){
			generated_translate_string += '"' + text + '"' + ",\n";
		}
		if(j==js_translations.length-1) {
			generated_translate_string =  generated_translate_string.substring(0, generated_translate_string.length-2)+"];"
		}
	}

	console.log(generated_translate_string);
	console.log("finished GENERATING translations")
}
//translations.generate();
