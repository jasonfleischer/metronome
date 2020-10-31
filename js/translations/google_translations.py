#pip3 install googletrans
#python3 ./google_trnsaltions.py

from googletrans import Translator
translator = Translator()
language_codes = ['fr','es','de','it','pt','ru','ja','ko','zh-cn'];
#language_codes = ['zh-cn']; // works better on own

# html generated variables from translations.js
en = [
"Thank you for using this website. If you wish to submit feedback, comment or report an error click <strong>here</strong>.", 
"Special thanks to Surikov for their <strong>WebAudioFont</strong> library.", 
"Information about the developer can be found <strong>here</strong>.", 
"Metronome", 
"Configure then press 'Play' to begin", 
"Keyboard Shortcuts", 
"Tap", 
"Play", 
"English", 
"French", 
"Spanish", 
"German", 
"Italian", 
"Portuguese", 
"Russian", 
"Japan", 
"Korean", 
"Chinese", 
"Click", 
"Drum", 
"Talking", 
"2 / 4", 
"3 / 4", 
"4 / 4", 
"5 / 4", 
"6 / 4", 
"7 / 4", 
"8 / 4", 
"9 / 4", 
"None", 
"Eighths", 
"Triplets", 
"Sixteenths", 
"Language", 
"Dark Mode", 
"Buy me a coffee", 
"Tone", 
"Time Signature", 
"Subdivision", 
"Accent First Beat", 
"Flash Screen", 
"Information", 
"Space",
"Keep Tapping",
"Configure then press 'Play' to begin. Talking setting works best at lower BPMs.",
"Increment subdivision",
"Decrement tempo",
"Left arrow",
"Stop",
"Key",
"Letter",
"Metronome Website Feedback",
"Right arrow",
"Decrement subdivision",
"Play or stop",
"Digit",
"Down arrow",
"Command",
"Half tempo",
"Tap tempo",
"Increment tempo",
"Double tempo",
"Up arrow"];

print("Fetching...\n")
for code in language_codes:
	translations = translator.translate(en, dest=code)
	print("var "+code.replace("zh-cn", "zh")+"=[")
	i = 0
	for translation in translations:
		#print(translation.origin, ' -> ', translation.text)
		text = translation.text.replace("\"", "'")
		print("\""+text+  ( "\"" if i==(len(translations)-1) else "\","))
		i += 1
	print("];\n")

print("FINISHED")
